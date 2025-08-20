// api/corrections.js - CVC ITAQUA v3.12
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
        parcelamento: null,
        multiplas: false
    };
    
    try {
        // Detectar se tem múltiplas opções (v3.12)
        const temMultiplasOpcoes = conteudoPrincipal.includes('Copa airlines') && 
                                  conteudoPrincipal.includes('Latam');
        dados.multiplas = temMultiplasOpcoes;
        
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
        
        // Extrair parcelamento por opção (v3.12)
        if (temMultiplasOpcoes) {
            // Dividir por seções
            const secoes = conteudoPrincipal.split(/(?=\d{2} de \w+ - \d{2} de \w+)/);
            secoes.forEach((secao, index) => {
                const matchParc = secao.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
                if (matchParc) {
                    dados.opcoes[index] = {
                        parcelamento: `Total de R$ ${matchParc[1]} em até ${parseInt(matchParc[2]) + 1}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`
                    };
                }
            });
        } else {
            // Parcelamento único
            const matchParcelamento = conteudoPrincipal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParcelamento) {
                const entrada = matchParcelamento[1];
                const numParcelas = matchParcelamento[2];
                const valorParcela = matchParcelamento[3];
                const totalParcelas = parseInt(numParcelas) + 1;
                
                const matchValor = conteudoPrincipal.match(/R\$\s*([\d.,]+)(?:\s*Entrada|\s*Total|\s*\n)/);
                const valorTotal = matchValor ? matchValor[1] : '0';
                
                dados.parcelamento = `Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
            }
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
// PÓS-PROCESSAMENTO PRINCIPAL v3.12
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.12...');
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
        resultado = corrigirFormatoVooV312(resultado, conteudoOriginal); // NOVA v3.12
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamentoV312(resultado, parcelamentoSelecionado, conteudoOriginal, dados); // NOVA v3.12
        resultado = corrigirBagagem(resultado, conteudoOriginal);
        resultado = corrigirAssento(resultado, conteudoOriginal);
        resultado = corrigirReembolsoV312(resultado, conteudoOriginal); // NOVA v3.12
        resultado = adicionarDiaSeguinteV312(resultado); // CORRIGIDA v3.12
        resultado = garantirVersaoV312(resultado); // NOVA v3.12
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v3.12 completo');
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

// NOVA FUNÇÃO v3.12 - Corrigir formato específico de voo
function corrigirFormatoVooV312(texto, conteudoOriginal) {
    let resultado = texto;
    
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
    
    // Corrigir "direto" para "voo direto"
    resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
    
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

// NOVA FUNÇÃO v3.12 - Parcelamento específico por opção
function corrigirParcelamentoV312(texto, parcelamentoSelecionado, conteudoOriginal, dados) {
    let resultado = texto;
    
    // Se tem múltiplas opções, processar separadamente
    if (dados.multiplas) {
        console.log('Processando múltiplas opções para parcelamento');
        
        // Dividir por opções (**Companhia**)
        const opcoes = resultado.split(/(?=\*\*\w+)/);
        
        opcoes.forEach((opcao, index) => {
            if (opcao.trim() === '') return;
            
            // Verificar se esta opção específica tem parcelamento no conteúdo original
            const temParcelamentoEstaOpcao = dados.opcoes[index] && dados.opcoes[index].parcelamento;
            
            if (temParcelamentoEstaOpcao) {
                // Aplicar parcelamento específico desta opção
                const parcelamentoTexto = dados.opcoes[index].parcelamento;
                opcao = opcao.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${parcelamentoTexto}`);
            } else {
                // Remover parcelamento se não tem para esta opção
                opcao = opcao.replace(/\n💳[^\n]+/g, '');
            }
            
            opcoes[index] = opcao;
        });
        
        resultado = opcoes.join('');
        
    } else {
        // Lógica original para opção única
        const dadosParc = extrairDadosCompletos(conteudoOriginal);
        
        if (dadosParc.parcelamento) {
            console.log('Usando parcelamento extraído:', dadosParc.parcelamento);
            
            if (resultado.includes('💰')) {
                resultado = resultado.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${dadosParc.parcelamento}`);
            }
        } else if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
            console.log('Aplicando parcelamento selecionado:', parcelamentoSelecionado);
            
            const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
            
            if (valoresEncontrados) {
                valoresEncontrados.forEach(valorMatch => {
                    const valor = valorMatch.match(/[\d.,]+/)[0];
                    const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                    const numParcelas = parseInt(parcelamentoSelecionado);
                    const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                    
                    const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                    
                    const escapedValue = valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\function corrigirParcelamento(texto, parcelamentoSelecionado, conteudoOriginal) {
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
}');
                    const regex = new RegExp(`(${escapedValue}[^💳\\n]*)(💳[^\\n]*)?`, 'gs');
                    resultado = resultado.replace(regex, (match, antes) => {
                        return `${antes}\n${linhaParcelamento}`;
                    });
                });
            }
        } else {
            console.log('Removendo parcelamento (não selecionado)');
            resultado = resultado.replace(/\n💳[^\n]+/g, '');
            resultado = resultado.replace(/💳[^\n]+\n/g, '');
        }
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

// CORRIGIDA v3.12 - Lógica (+1) mais precisa
function adicionarDiaSeguinteV312(texto) {
    let resultado = texto;
    const linhas = resultado.split('\n');
    
    linhas.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            if (horaMatch) {
                const horaSaida = parseInt(horaMatch[1]);
                const horaChegada = parseInt(horaMatch[3]);
                
                // LÓGICA CORRIGIDA v3.12:
                // (+1) APENAS se:
                // 1. Voo internacional (Orlando, Lisboa, etc.)
                // 2. Saída após 20h OU chegada antes 8h (madrugada)
                // 3. NÃO para voos que saem e chegam no mesmo período
                
                const ehInternacional = linha.includes('Orlando') || linha.includes('Lisboa') || 
                                       linha.includes('Madrid') || linha.includes('Paris') ||
                                       linha.includes('Londres') || linha.includes('Roma') ||
                                       linha.includes('Barcelona');
                
                // Orlando ida: 11:10→22:40 = mesmo dia (NÃO usar +1)
                // Orlando volta: 13:40→03:50 = madrugada (USAR +1)
                // Lisboa: sempre +1 por ser longa distância
                
                if (ehInternacional) {
                    // Para Orlando: só +1 se chegada for madrugada (antes das 8h)
                    if (linha.includes('Orlando')) {
                        if (horaChegada <= 8) {  // Chegada madrugada
                            linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                        }
                        // NÃO adicionar +1 para Orlando 11:10→22:40 (mesmo dia)
                    } else {
                        // Para Europa: sempre +1 por ser muito longa distância
                        linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                    }
                }
            }
        }
    });
    
    return linhas.join('\n');
}

// NOVA FUNÇÃO v3.12 - Reembolso consistente por opção
function corrigirReembolsoV312(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Garantir que sempre há linha de reembolso para cada opção
    const opcoes = resultado.split(/(?=\*\*\w+)/);
    
    opcoes.forEach((opcao, index) => {
        if (opcao.trim() === '') return;
        
        if (!opcao.includes('🏷️')) {
            // Adicionar linha de reembolso após bagagem ou após valor
            if (opcao.includes('✅')) {
                opcao = opcao.replace(/(✅[^\n]+)(\n|$)/, '$1\n🏷️ Não reembolsável\n');
            } else if (opcao.includes('💰')) {
                opcao = opcao.replace(/(💰[^\n]+)(\n|$)/, '$1\n🏷️ Não reembolsável\n');
            }
        }
        
        opcoes[index] = opcao;
    });
    
    resultado = opcoes.join('');
    
    // Remover duplicações de reembolso dentro da mesma opção
    const linhasReembolso = resultado.match(/🏷️[^\n]+/g);
    if (linhasReembolso && linhasReembolso.length > 2) { // Mais de 2 = duplicação
        let contador = 0;
        resultado = resultado.replace(/🏷️[^\n]+/g, match => {
            contador++;
            // Manter apenas as 2 primeiras (uma para cada opção)
            if (contador <= 2) {
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

// NOVA FUNÇÃO v3.12
function garantirVersaoV312(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    
    // Remover versão antiga e duplicações
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade/g, '');
    texto = texto.replace(/\(v[\d.]+\)/g, '');
    
    // Adicionar versão correta UMA ÚNICA VEZ no final
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
