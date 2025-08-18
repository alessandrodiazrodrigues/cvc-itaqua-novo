// api/corrections.js - CVC ITAQUA v3.1
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
        destino: null
    };
    
    try {
        // Extrair passageiros - PRIORIZAR o formato "Total (X Adultos)"
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
        
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 1;
            const criancas = parseInt(matchPassageiros[2]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        } else {
            // Tentar outros formatos apenas se não encontrou o formato principal
            matchPassageiros = conteudoPrincipal.match(/(\d+)\s*adultos?\s*(?:\+|e)?\s*(\d*)\s*crianças?/i);
            
            if (matchPassageiros) {
                const adultos = parseInt(matchPassageiros[1]) || 1;
                const criancas = parseInt(matchPassageiros[2]) || 0;
                
                dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
                if (criancas > 0) {
                    dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
                }
            }
        }
        
        // Extrair destino
        const destinos = ['Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma', 
                         'Londres', 'Orlando', 'Miami', 'Cancún', 'Buenos Aires'];
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
// PÓS-PROCESSAMENTO PRINCIPAL
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.1...');
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
        resultado = corrigirFormatoVoo(resultado, conteudoOriginal);
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamento(resultado, parcelamentoSelecionado);
        resultado = corrigirBagagem(resultado, conteudoOriginal);
        resultado = corrigirAssento(resultado, conteudoOriginal);
        resultado = corrigirReembolso(resultado);
        resultado = adicionarDiaSeguinte(resultado);
        resultado = garantirVersao(resultado);
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

// ================================================================================
// CORREÇÕES ESPECÍFICAS
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

function corrigirFormatoVoo(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    resultado = resultado.replace(/\(voo \(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(com conexão\)\)/g, '(com conexão)');
    
    // Corrigir formato de voo - adicionar parênteses
    resultado = resultado.replace(/(\d{2}:\d{2})\s+(Voo direto|Direto)/gi, '$1 (voo direto)');
    resultado = resultado.replace(/(\d{2}:\d{2})\s+(Uma escala|Com conexão)/gi, '$1 (com conexão)');
    
    // IMPORTANTE: Sempre usar "conexão" e nunca "escala"
    resultado = resultado.replace(/uma escala em/gi, 'com conexão em');
    resultado = resultado.replace(/\(uma escala/gi, '(com conexão');
    resultado = resultado.replace(/Uma escala/gi, '(com conexão)');
    resultado = resultado.replace(/com escala/gi, 'com conexão');
    
    // Adicionar cidade da conexão se for Iberia
    if (conteudoOriginal.toLowerCase().includes('iberia')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(com conexão em Madrid)');
        resultado = resultado.replace(/com conexão em Madrid em Madrid/g, 'com conexão em Madrid');
    }
    
    // Corrigir nomes longos de aeroportos
    resultado = resultado.replace(/Aeroporto Internacional de São Paulo\/Guarulhos/g, 'Guarulhos');
    resultado = resultado.replace(/Aeroporto Internacional do Galeão/g, 'Galeão');
    resultado = resultado.replace(/Aeroporto de Lisboa/g, 'Lisboa');
    resultado = resultado.replace(/Aeroporto Internacional de Guarulhos/g, 'Guarulhos');
    
    return resultado;
}

function corrigirLinks(texto) {
    // Converter markdown links para links diretos
    let resultado = texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
    
    // Se ainda houver formato markdown, remover
    resultado = resultado.replace(/🔗 \[.+\]/g, '🔗 https://www.cvc.com.br');
    
    // Se não tiver link, adicionar placeholder
    if (!resultado.includes('🔗')) {
        // Adicionar antes de "Valores sujeitos"
        resultado = resultado.replace(/\n\nValores sujeitos/, '\n🔗 https://www.cvc.com.br\n\nValores sujeitos');
    }
    
    return resultado;
}

function corrigirParcelamento(texto, parcelamentoSelecionado) {
    let resultado = texto;
    
    if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        console.log('Aplicando parcelamento:', parcelamentoSelecionado);
        
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                // Procurar e substituir parcelamento após o valor
                const regex = new RegExp(`(${valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^💳]*)(💳[^\\n]*)?`, 'gs');
                resultado = resultado.replace(regex, (match, antes, parcelamentoAntigo) => {
                    if (parcelamentoAntigo) {
                        return `${antes}${linhaParcelamento}`;
                    } else {
                        return `${antes}\n${linhaParcelamento}`;
                    }
                });
            });
        }
    } else {
        // Remover linha de parcelamento se não foi selecionado
        console.log('Removendo parcelamento (não selecionado)');
        resultado = resultado.replace(/\n💳[^\n]+/g, '');
        resultado = resultado.replace(/💳[^\n]+\n/g, '');
    }
    
    return resultado;
}

function corrigirBagagem(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Primeiro, remover linhas incorretas de bagagem
    resultado = resultado.replace(/✅ Não reembolsável/g, '');
    
    // Detectar e aplicar tipo correto de bagagem
    if (conteudoLower.includes('sem bagagem') || conteudoLower.includes('sem  bagagem')) {
        // Sem bagagem despachada
        resultado = resultado.replace(/✅[^\\n]+/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    } else if (conteudoLower.includes('com bagagem') || conteudoLower.includes('com abagegem')) {
        // Com bagagem despachada
        resultado = resultado.replace(/✅[^\\n]+/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
    } else {
        // Se não especificado, usar padrão sem despachada
        if (!resultado.includes('✅')) {
            // Adicionar linha de bagagem após o valor
            resultado = resultado.replace(/(💰 R\$ [^\n]+)/g, '$1\n✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        } else {
            // Corrigir formatos incorretos
            resultado = resultado.replace(/✅ 1 bagagem de até \d+kg/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
            resultado = resultado.replace(/✅ 1 bagagem de mão/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
            resultado = resultado.replace(/✅ Bolsa ou mochila pequena/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        }
    }
    
    return resultado;
}

function corrigirAssento(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Se não tem pré-reserva no conteúdo original, remover linha
    if (!conteudoLower.includes('pré reserva') && 
        !conteudoLower.includes('pre reserva') &&
        !conteudoLower.includes('pré-reserva')) {
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
                                       linha.includes('Paris') || linha.includes('Londres');
                
                if (ehInternacional && (horaSaida >= 15 || horaChegada <= 10 || temConexao)) {
                    // Adicionar (+1) antes do tipo de voo
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                }
            }
        }
    });
    
    return linhas.join('\n');
}

function garantirVersao(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    
    // Remover versão antiga
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
    
    // Adicionar versão correta
    if (!texto.includes(versaoTexto)) {
        texto = texto.trim() + '\n\n' + versaoTexto;
    }
    
    return texto;
}

function corrigirReembolso(texto) {
    let resultado = texto;
    
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
    
    return resultado;
}

function limparFormatacao(texto) {
    let resultado = texto;
    
    // Remover múltiplas quebras
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços extras
    resultado = resultado.split('\n').map(linha => linha.trimEnd()).join('\n');
    
    return resultado.trim();
}

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    posProcessar,
    extrairDadosCompletos
};
