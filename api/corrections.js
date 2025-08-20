// api/corrections.js - CVC ITAQUA v3.11
// ARQUIVO 2: PÓS-PROCESSAMENTO E CORREÇÕES
// ================================================================================

import { CONFIG, AEROPORTOS, REGRAS_BAGAGEM } from './templates.js';

// ================================================================================
// EXTRAÇÃO DE DADOS
// ================================================================================

export function extrairDadosCompletos(conteudoPrincipal) {
    const dados = {
        opcoes: [],
        passageiros: null,
        destino: null,
        parcelamento: null
    };
    
    try {
        // Extrair passageiros - PRIORIZAR formato "Total (X Adultos)"
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\)(?:\s*(?:e|\+)\s*(\d+)\s*Crianças?)?/i);
        
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 1;
            const criancas = parseInt(matchPassageiros[2]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        }
        
        // Extrair parcelamento com entrada
        const matchParcelamento = conteudoPrincipal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
        if (matchParcelamento) {
            const entrada = matchParcelamento[1];
            const numParcelas = matchParcelamento[2];
            const valorParcela = matchParcelamento[3];
            const totalParcelas = parseInt(numParcelas) + 1;
            
            // Extrair valor total
            const matchValor = conteudoPrincipal.match(/R\$\s*([\d.,]+)(?:\s*Entrada|\s*Total|\s*\n)/);
            const valorTotal = matchValor ? matchValor[1] : '0';
            
            dados.parcelamento = `Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // Extrair destino
        const destinos = ['Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma', 
                         'Londres', 'Orlando', 'Miami', 'Cancún', 'Buenos Aires', 
                         'Salvador', 'Maceió', 'Recife', 'Fortaleza', 'Natal'];
        for (const destino of destinos) {
            if (conteudoPrincipal.includes(destino)) {
                dados.destino = destino;
                break;
            }
        }
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
}

// ================================================================================
// PÓS-PROCESSAMENTO PRINCIPAL v3.11
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.11...');
        console.log('Parcelamento selecionado:', parcelamentoSelecionado);
        
        let resultado = texto;
        
        // Remover conteúdo de dicas se aparecer misturado
        resultado = resultado.replace(/Dicas de Viagem para[^]*$/m, '');
        
        // Extrair dados primeiro
        const dados = extrairDadosCompletos(conteudoOriginal);
        
        // Aplicar correções em ordem
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dados);
        resultado = corrigirFormatoVooV311(resultado, conteudoOriginal); // NOVA v3.11
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamento(resultado, parcelamentoSelecionado, conteudoOriginal);
        resultado = corrigirBagagem(resultado, conteudoOriginal);
        resultado = corrigirAssento(resultado, conteudoOriginal);
        resultado = corrigirReembolso(resultado);
        resultado = adicionarDiaSeguinte(resultado);
        resultado = garantirVersaoV311(resultado); // NOVA v3.11
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v3.11 completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

// ================================================================================
// CORREÇÕES ESPECÍFICAS v3.11
// ================================================================================

function corrigirDatas(texto) {
    const meses = {
        'janeiro': '01', 'jan': '01',
        'fevereiro': '02', 'fev': '02',
        'março': '03', 'mar': '03',
        'abril': '04', 'abr': '04',
        'maio': '05', 'mai': '05',
        'junho': '06', 'jun': '06',
        'julho': '07', 'jul': '07',
        'agosto': '08', 'ago': '08',
        'setembro': '09', 'set': '09',
        'outubro': '10', 'out': '10',
        'novembro': '11', 'nov': '11',
        'dezembro': '12', 'dez': '12'
    };
    
    let resultado = texto;
    
    // Remover dias da semana e formatar
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    resultado = resultado.replace(/(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    return resultado;
}

function converterCodigosAeroporto(texto) {
    let resultado = texto;
    
    Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
        const regex = new RegExp(`\\b${codigo}\\b`, 'g');
        resultado = resultado.replace(regex, nome);
    });
    
    return resultado;
}

function corrigirPassageiros(texto, dados) {
    if (!dados.passageiros) return texto;
    
    return texto.replace(/\d{2} adultos?(?:\s*\+\s*\d{2} crianças?)?/gi, dados.passageiros);
}

// NOVA FUNÇÃO v3.11 - Corrigir formato específico de voo
function corrigirFormatoVooV311(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Problema específico: "Guarulhos 11:10 / (com conexão) 22:40"
    // Corrigir para: "Guarulhos 11:10 / Orlando 22:40 (com conexão)"
    
    // Detectar aeroporto de destino do conteúdo original
    let destinoAeroporto = 'Orlando'; // padrão
    if (conteudoOriginal.includes('MCO')) destinoAeroporto = 'Orlando';
    if (conteudoOriginal.includes('LIS')) destinoAeroporto = 'Lisboa';
    if (conteudoOriginal.includes('MAD')) destinoAeroporto = 'Madrid';
    
    // Corrigir formato "/ (com conexão) horário"
    resultado = resultado.replace(/(\w+)\s+(\d{2}:\d{2})\s+\/\s+\(com conexão\)\s+(\d{2}:\d{2})/g, 
        `$1 $2 / ${destinoAeroporto} $3 (com conexão)`);
    
    // Corrigir caso contrário também
    resultado = resultado.replace(/(\w+)\s+(\d{2}:\d{2})\s+\/\s+(\d{2}:\d{2})\s+\(com conexão\)/g, 
        `$1 $2 / ${destinoAeroporto} $3 (com conexão)`);
    
    // Garantir que separador "--" esteja na posição correta
    // Remover "--" que estão na posição errada
    const linhas = resultado.split('\n');
    let novasLinhas = [];
    let separadorAdicionado = false;
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Se a linha tem formato de voo de ida
        if (linha.match(/^\d{2}\/\d{2} - \w+.*\/.*\(.*\)$/) && !separadorAdicionado) {
            novasLinhas.push(linha);
            // Verificar se próxima linha é voo de volta
            if (i + 1 < linhas.length && linhas[i + 1].match(/^\d{2}\/\d{2} - \w+.*\/.*\(.*\)$/)) {
                novasLinhas.push('--');
                separadorAdicionado = true;
            }
        } else if (linha === '--' && separadorAdicionado) {
            // Pular separador duplicado
            continue;
        } else {
            novasLinhas.push(linha);
        }
    }
    
    resultado = novasLinhas.join('\n');
    
    // Remover duplicações de parênteses
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    resultado = resultado.replace(/\(voo \(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(com conexão\)\)/g, '(com conexão)');
    
    // IMPORTANTE: Sempre usar "conexão" e nunca "escala"
    resultado = resultado.replace(/uma escala em/gi, 'com conexão em');
    resultado = resultado.replace(/\(uma escala/gi, '(com conexão');
    resultado = resultado.replace(/Uma escala/gi, '(com conexão)');
    resultado = resultado.replace(/com escala/gi, 'com conexão');
    resultado = resultado.replace(/escala em/gi, 'conexão em');
    
    return resultado;
}

function corrigirLinks(texto) {
    // Converter markdown links para links diretos
    let resultado = texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
    
    // Se ainda houver formato markdown, remover
    resultado = resultado.replace(/🔗 \[.+\]/g, '');
    
    // Remover link genérico se for apenas www.cvc.com.br
    resultado = resultado.replace(/🔗 https:\/\/www\.cvc\.com\.br\s*$/gm, '');
    resultado = resultado.replace(/🔗 www\.cvc\.com\.br\s*$/gm, '');
    
    // Manter apenas links específicos (com path)
    resultado = resultado.replace(/🔗 https:\/\/www\.cvc\.com\.br\n/g, '');
    
    return resultado;
}

function corrigirParcelamento(texto, parcelamentoSelecionado, conteudoOriginal) {
    let resultado = texto;
    
    // Primeiro, verificar se tem parcelamento com entrada no conteúdo original
    const dados = extrairDadosCompletos(conteudoOriginal);
    
    if (dados.parcelamento) {
        // Usar parcelamento extraído do conteúdo
        console.log('Usando parcelamento extraído:', dados.parcelamento);
        
        // Garantir que há quebra de linha antes do parcelamento
        if (resultado.includes('💰')) {
            resultado = resultado.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${dados.parcelamento}`);
        }
    } else if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        // Usar parcelamento selecionado pelo usuário
        console.log('Aplicando parcelamento selecionado:', parcelamentoSelecionado);
        
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                // Adicionar ou substituir parcelamento com quebra de linha
                const escapedValue = valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedValue}[^💳\\n]*)(💳[^\\n]*)?`, 'gs');
                resultado = resultado.replace(regex, (match, antes) => {
                    return `${antes}\n${linhaParcelamento}`;
                });
            });
        }
    } else {
        // Remover linha de parcelamento se não foi selecionado e não tem no conteúdo
        console.log('Removendo parcelamento (não selecionado)');
        resultado = resultado.replace(/\n💳[^\n]+/g, '');
        resultado = resultado.replace(/💳[^\n]+\n/g, '');
    }
    
    // Garantir quebra de linha após parcelamento e antes da bagagem
    resultado = resultado.replace(/(💳[^\n]+)✅/g, '$1\n✅');
    
    return resultado;
}

function corrigirBagagem(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Primeiro, remover linhas incorretas
    resultado = resultado.replace(/✅ Não reembolsável/g, '');
    resultado = resultado.replace(/✅ Com bagagem e pré-reserva de assento/g, '');
    
    // Detectar bagagem e assento separadamente
    let temBagagem = false;
    let temAssento = false;
    
    if (conteudoLower.includes('com bagagem') || 
        conteudoLower.includes('com babagem') ||
        conteudoLower.includes('bagagem despachada')) {
        temBagagem = true;
    }
    
    if (conteudoLower.includes('pre reserva') || 
        conteudoLower.includes('pré reserva') || 
        conteudoLower.includes('pré-reserva') ||
        conteudoLower.includes('marcação de assento')) {
        temAssento = true;
    }
    
    // Aplicar formato correto de bagagem
    if (temBagagem) {
        // Substituir ou adicionar linha de bagagem
        if (resultado.includes('✅')) {
            resultado = resultado.replace(/✅[^\n]+/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
        } else {
            // Adicionar após o valor/parcelamento
            resultado = resultado.replace(/(💳[^\n]+|💰[^\n]+)(\n|$)/, (match, linha) => {
                if (linha.includes('💳')) {
                    return linha + '\n✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
                } else {
                    return linha + '\n✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA;
                }
            });
        }
    } else {
        // Sem bagagem despachada
        if (resultado.includes('✅')) {
            resultado = resultado.replace(/✅[^\n]+/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        } else {
            resultado = resultado.replace(/(💳[^\n]+|💰[^\n]+)(\n|$)/, (match, linha) => {
                return linha + '\n✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA;
            });
        }
    }
    
    // Adicionar assento se necessário
    if (temAssento && !resultado.includes('💺')) {
        resultado = resultado.replace(/(✅[^\n]+)(\n|$)/, '$1\n💺 Inclui pré reserva de assento');
    }
    
    return resultado;
}

function corrigirAssento(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Se não tem pré-reserva no conteúdo original, remover linha
    if (!conteudoLower.includes('pré reserva') && 
        !conteudoLower.includes('pre reserva') &&
        !conteudoLower.includes('pré-reserva') &&
        !conteudoLower.includes('marcação de assento')) {
        resultado = resultado.replace(/💺[^\n]*\n/g, '');
        resultado = resultado.replace(/\n💺[^\n]+/g, '');
    }
    
    return resultado;
}

function adicionarDiaSeguinte(texto) {
    let resultado = texto;
    const linhas = resultado.split('\n');
    
    linhas.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            if (horaMatch) {
                const horaSaida = parseInt(horaMatch[1]);
                const horaChegada = parseInt(horaMatch[3]);
                
                // Para voos internacionais longos ou que saem tarde e chegam cedo
                const temConexao = linha.includes('conexão');
                const ehInternacional = linha.includes('Lisboa') || linha.includes('Madrid') || 
                                       linha.includes('Paris') || linha.includes('Londres') ||
                                       linha.includes('Roma') || linha.includes('Barcelona') ||
                                       linha.includes('Orlando');
                
                if (ehInternacional && (horaSaida >= 15 || horaChegada <= 10 || temConexao)) {
                    // Adicionar (+1) antes do tipo de voo
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                }
            }
        }
    });
    
    return linhas.join('\n');
}

function corrigirReembolso(texto) {
    let resultado = texto;
    
    // Garantir que sempre há linha de reembolso
    if (!resultado.includes('🏷️')) {
        // Adicionar linha de reembolso após bagagem
        resultado = resultado.replace(/(✅[^\n]+)(\n|$)/, '$1\n🏷️ Não reembolsável\n');
    }
    
    // Remover duplicações de reembolso
    const linhasReembolso = resultado.match(/🏷️[^\n]+/g);
    if (linhasReembolso && linhasReembolso.length > 1) {
        // Manter apenas a primeira ocorrência
        let primeiraOcorrencia = true;
        resultado = resultado.replace(/🏷️[^\n]+/g, match => {
            if (primeiraOcorrencia) {
                primeiraOcorrencia = false;
                return match;
            }
            return '';
        });
    }
    
    // Padronizar texto de reembolso
    resultado = resultado.replace(/🏷️ Reembolsável[^\n]*/g, '🏷️ Reembolsável conforme regras do bilhete');
    resultado = resultado.replace(/🏷️ Não-reembolsável/g, '🏷️ Não reembolsável');
    
    return resultado;
}

// NOVA FUNÇÃO v3.11
function garantirVersaoV311(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    
    // Remover versão antiga
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade/g, '');
    
    // Adicionar versão correta
    if (!texto.includes(versaoTexto)) {
        texto = texto.trim() + '\n\n' + versaoTexto;
    }
    
    return texto;
}

function limparFormatacao(texto) {
    let resultado = texto;
    
    // Remover múltiplas quebras de linha
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // Remover quebra de linha extra antes de 🏷️ quando não tem 💺
    resultado = resultado.replace(/\n\n🏷️/g, '\n🏷️');
    
    // Garantir apenas uma quebra entre elementos
    resultado = resultado.replace(/(✅[^\n]+)\n\n(🏷️)/g, '$1\n$2');
    resultado = resultado.replace(/(💺[^\n]+)\n\n(🏷️)/g, '$1\n$2');
    
    // Remover espaços extras no final das linhas
    resultado = resultado.split('\n').map(linha => linha.trimEnd()).join('\n');
    
    // Garantir separador correto entre ida e volta
    resultado = resultado.replace(/\n--\n/g, '\n--\n');
    
    return resultado.trim();
}

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    posProcessar,
    extrairDadosCompletos
};
