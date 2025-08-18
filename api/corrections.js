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
        // Extrair passageiros - múltiplos formatos
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
        
        if (!matchPassageiros) {
            matchPassageiros = conteudoPrincipal.match(/(\d+)\s*adultos?\s*(?:\+|e)?\s*(\d*)\s*crianças?/i);
        }
        
        if (!matchPassageiros) {
            matchPassageiros = conteudoPrincipal.match(/para\s*(\d+)\s*adultos?\s*(?:\+\s*(\d+)\s*crianças?)?/i);
        }
        
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 2;
            const criancas = parseInt(matchPassageiros[2]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
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
        
        // Extrair dados primeiro
        const dados = extrairDadosCompletos(conteudoOriginal);
        
        // Aplicar correções
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dados);
        resultado = corrigirFormatoVoo(resultado, conteudoOriginal);
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamento(resultado, parcelamentoSelecionado);
        resultado = corrigirBagagem(resultado, conteudoOriginal);
        resultado = corrigirAssento(resultado, conteudoOriginal);
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
    
    // Adicionar cidade da escala se detectada
    if (conteudoOriginal.toLowerCase().includes('iberia')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Madrid)');
    }
    
    return resultado;
}

function corrigirLinks(texto) {
    return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
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
    
    // Detectar tipo de bagagem
    if (conteudoLower.includes('sem bagagem') || conteudoLower.includes('sem  bagagem')) {
        resultado = resultado.replace(/✅[^\\n]+/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    } else if (conteudoLower.includes('com bagagem') || conteudoLower.includes('com abagegem')) {
        resultado = resultado.replace(/✅[^\\n]+/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
    }
    
    // Correções específicas
    resultado = resultado.replace(/✅ Bolsa ou mochila pequena/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ 1 bagagem de mão/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Não inclui bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    
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
                
                if ((horaSaida >= 15 && horaChegada <= 10) || 
                    linha.includes('9h') || linha.includes('10h') || 
                    linha.includes('11h') || linha.includes('12h')) {
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))?$/, '$1 (+1)$2');
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
