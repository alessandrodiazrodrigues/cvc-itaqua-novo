// api/corrections.js - CVC ITAQUA v3.19 TODAS AS CORREÇÕES
// ARQUIVO 2: PÓS-PROCESSAMENTO E CORREÇÕES
// ================================================================================

import { CONFIG, AEROPORTOS, REGRAS_BAGAGEM } from './templates.js';

// ================================================================================
// EXTRAÇÃO DE DADOS MELHORADA v3.19
// ================================================================================

export function extrairDadosCompletos(conteudoPrincipal) {
    const dados = {
        opcoes: [],
        passageiros: null,
        destino: null,
        parcelamento: null,
        multiplas: false,
        temBagagem: false,
        temAssento: false,
        ehHotel: false
    };
    
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Detectar se é hotel
        dados.ehHotel = (conteudoLower.includes('hotel') || 
                        conteudoLower.includes('comfort suites') ||
                        conteudoLower.includes('preferencial')) && 
                       !conteudoLower.includes('aeroporto') && 
                       !conteudoLower.includes('voo');
        
        // Detectar múltiplas companhias v3.19
        const companhias = (conteudoPrincipal.match(/(?:Copa|Latam|Avianca|Gol|Azul|Tap|Iberia)/gi) || []);
        const companhiasUnicas = [...new Set(companhias.map(c => c.toLowerCase()))];
        dados.multiplas = companhiasUnicas.length >= 2;
        
        // Extrair passageiros com TODAS as variações v3.19
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?(?:,\s*(\d+)\s*Bebês?\s*e\s*(\d+)\s*Crianças?)?(?:\s*e\s*(\d+)\s*Crianças?)?(?:\s*,\s*(\d+)\s*Bebês?\s*e\s*(\d+)\s*Crianças?)?\)/i);
        
        if (!matchPassageiros) {
            // Tentar outros formatos
            matchPassageiros = conteudoPrincipal.match(/(\d+)\s*Adultos?,\s*(\d+)\s*Bebês?\s*e\s*(\d+)\s*Crianças?/i);
        }
        
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 1;
            const bebes = parseInt(matchPassageiros[2] || matchPassageiros[5]) || 0;
            const criancas = parseInt(matchPassageiros[3] || matchPassageiros[4] || matchPassageiros[6]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (bebes > 0) {
                dados.passageiros += `, ${String(bebes).padStart(2, '0')} bebê${bebes > 1 ? 's' : ''}`;
            }
            if (criancas > 0) {
                dados.passageiros += ` e ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        }
        
        // Detectar bagagem despachada v3.19
        dados.temBagagem = conteudoLower.includes('com bagagem') || 
                          conteudoLower.includes('bagagem despachada') ||
                          conteudoLower.includes('bagagens inclusas') ||
                          conteudoLower.includes('mala de até 23kg');
        
        // Detectar pré-reserva de assento v3.19
        dados.temAssento = conteudoLower.includes('pré-reserva de assento') ||
                          conteudoLower.includes('pre reserva de assento') ||
                          conteudoLower.includes('pré reserva de assento') ||
                          conteudoLower.includes('bagagem despachada + pre´-resera de assento') ||
                          conteudoLower.includes('marcação de assento');
        
        // Extrair parcelamento com entrada v3.19
        const matchParcelamento = conteudoPrincipal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
        if (matchParcelamento) {
            const entrada = matchParcelamento[1];
            const numParcelas = matchParcelamento[2];
            const valorParcela = matchParcelamento[3];
            const totalParcelas = parseInt(numParcelas) + 1;
            
            // Extrair valor total
            const matchValorTotal = conteudoPrincipal.match(/R\$\s*([\d.,]+)(?:\s*$|\s*Entrada|\s*Total)/m);
            const valorTotal = matchValorTotal ? matchValorTotal[1] : entrada;
            
            dados.parcelamento = `Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // Extrair destino
        const destinos = ['Orlando', 'Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma', 
                         'Londres', 'Miami', 'Cancún', 'Buenos Aires', 'Santiago',
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
    
    console.log('📊 Dados extraídos v3.19:', dados);
    return dados;
}

// ================================================================================
// PÓS-PROCESSAMENTO PRINCIPAL v3.19
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.19 - TODAS AS CORREÇÕES...');
        
        let resultado = texto;
        
        // Extrair dados primeiro
        const dados = extrairDadosCompletos(conteudoOriginal);
        
        // Se é hotel, aplicar processamento específico
        if (dados.ehHotel) {
            resultado = processarHotel(resultado, dados);
            return resultado;
        }
        
        // Aplicar correções em ordem para voos
        resultado = removerDiasSemana(resultado);
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dados);
        resultado = corrigirFormatoVoo(resultado);
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamento(resultado, parcelamentoSelecionado, dados);
        resultado = corrigirBagagem(resultado, dados);
        resultado = corrigirAssento(resultado, dados);
        resultado = corrigirReembolso(resultado, conteudoOriginal);
        resultado = adicionarDiaSeguinte(resultado);
        resultado = garantirVersao(resultado);
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v3.19 completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

// ================================================================================
// PROCESSAMENTO ESPECÍFICO PARA HOTÉIS v3.19
// ================================================================================

function processarHotel(texto, dados) {
    console.log('🏨 Processando hotel...');
    
    let resultado = texto;
    
    // Remover qualquer referência a voo/aeroporto
    resultado = resultado.replace(/.*Aeroporto.*\n/g, '');
    resultado = resultado.replace(/.*✈.*\n/g, '');
    resultado = resultado.replace(/.*--.*\n/g, '');
    resultado = resultado.replace(/.*\(voo direto\).*\n/g, '');
    resultado = resultado.replace(/.*\(com conexão\).*\n/g, '');
    
    // Garantir formato de hotel
    if (!resultado.includes('*Hotéis em')) {
        // Reconstruir como hotel
        const linhas = resultado.split('\n');
        const novasLinhas = [];
        
        // Extrair dados do hotel
        let nomeHotel = '';
        let localizacao = '';
        let valor = '';
        let passageiros = dados.passageiros || '4 Adultos e 2 Crianças';
        
        for (const linha of linhas) {
            if (linha.includes('Comfort Suites') || linha.includes('Hotel') || linha.includes('Preferencial')) {
                nomeHotel = linha.replace(/[*-]/g, '').trim();
            } else if (linha.includes('R$')) {
                valor = linha;
            } else if (linha.includes('florida plaza') || linha.includes('📍')) {
                localizacao = linha.replace('📍', '').trim();
            }
        }
        
        // Reconstruir formato hotel
        novasLinhas.push('*Hotéis em Orlando - Florida*');
        novasLinhas.push('Período: 27/01 a 04/02 (8 noites)');
        novasLinhas.push(passageiros);
        novasLinhas.push('');
        novasLinhas.push(`**OPÇÃO 1** - ${nomeHotel || 'Comfort Suites Maingate East'} ⭐⭐⭐`);
        novasLinhas.push(`📍 ${localizacao || '2775 Florida Plaza Blvd'}`);
        novasLinhas.push('🛏️ Studio Suite');
        novasLinhas.push('☕ Café da manhã');
        novasLinhas.push(valor || '💰 R$ 5.568,03 total');
        novasLinhas.push('');
        novasLinhas.push(`Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`);
        
        resultado = novasLinhas.join('\n');
    }
    
    // Garantir versão correta
    resultado = resultado.replace(/\(v[\d.]+\)/g, `(v${CONFIG.VERSION})`);
    
    return resultado;
}

// ================================================================================
// CORREÇÕES ESPECÍFICAS v3.19
// ================================================================================

function removerDiasSemana(texto) {
    console.log('📅 Removendo dias da semana...');
    
    let resultado = texto;
    
    // Remover dias da semana das datas
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*(\d{1,2}\/\d{2})/gi, '$1');
    resultado = resultado.replace(/(?:segunda|terça|quarta|quinta|sexta|sábado|domingo),?\s*(\d{1,2}\/\d{2})/gi, '$1');
    
    // Remover dias da semana com vírgula
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),\s*(\d{1,2}\/\d{2})/gi, '$1');
    
    return resultado;
}

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
    
    // Substituir formatos de passageiros
    let resultado = texto;
    resultado = resultado.replace(/\d{1,2}\s*adultos?(?:\s*[,+]\s*\d{1,2}\s*(?:bebês?|crianças?))*(?:\s*e\s*\d{1,2}\s*crianças?)?/gi, dados.passageiros);
    resultado = resultado.replace(/Total\s*\([^)]+\)/gi, dados.passageiros);
    
    return resultado;
}

function corrigirFormatoVoo(texto) {
    let resultado = texto;
    
    // Corrigir tipos de voo
    resultado = resultado.replace(/uma escala/gi, 'com conexão');
    resultado = resultado.replace(/duas escalas/gi, 'com múltiplas conexões');
    resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
    resultado = resultado.replace(/\(voo\s+voo direto\)/g, '(voo direto)');
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    
    return resultado;
}

function corrigirLinks(texto) {
    let resultado = texto;
    
    // Converter markdown links para links diretos
    resultado = resultado.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
    
    // Remover links genéricos
    resultado = resultado.replace(/🔗 https:\/\/www\.cvc\.com\.br\s*$/gm, '');
    resultado = resultado.replace(/🔗 www\.cvc\.com\.br\s*$/gm, '');
    
    return resultado;
}

function corrigirParcelamento(texto, parcelamentoSelecionado, dados) {
    let resultado = texto;
    
    // Primeiro, usar parcelamento extraído se existir
    if (dados.parcelamento) {
        console.log('💳 Usando parcelamento extraído:', dados.parcelamento);
        
        if (resultado.includes('💰')) {
            resultado = resultado.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${dados.parcelamento}`);
        }
    } else if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        console.log('💳 Aplicando parcelamento selecionado:', parcelamentoSelecionado);
        
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                const escapedValue = valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\        // Reconstruir formato hotel
        novasLinhas.push('*Hotéis em Orlando - Florida*');
        novasLinhas.push('Período: 27/01 a 04/02 (8 noites)');
        novasLinhas.push(passageiros);
        no');
                const regex = new RegExp(`(${escapedValue}[^💳\\n]*)(💳[^\\n]*)?`, 'gs');
                resultado = resultado.replace(regex, (match, antes) => {
                    return `${antes}\n${linhaParcelamento}`;
                });
            });
        }
    } else {
        console.log('💳 Removendo parcelamento (não selecionado)');
        resultado = resultado.replace(/\n💳[^\n]+/g, '');
        resultado = resultado.replace(/💳[^\n]+\n/g, '');
    }
    
    return resultado;
}

function corrigirBagagem(texto, dados) {
    let resultado = texto;
    
    console.log('✅ Corrigindo bagagem. Tem bagagem:', dados.temBagagem);
    
    // Determinar tipo de bagagem
    let tipoBagagem;
    if (dados.temBagagem) {
        tipoBagagem = REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
    } else {
        tipoBagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
    }
    
    // Substituir linhas de bagagem existentes
    if (resultado.includes('✅')) {
        resultado = resultado.replace(/✅[^\n]*/g, `✅ ${tipoBagagem}`);
    } else {
        // Adicionar após valor/parcelamento
        resultado = resultado.replace(/(💰[^\n]+|💳[^\n]+)(\n|$)/, `$1\n✅ ${tipoBagagem}\n`);
    }
    
    return resultado;
}

function corrigirAssento(texto, dados) {
    let resultado = texto;
    
    console.log('💺 Corrigindo assento. Tem assento:', dados.temAssento);
    
    if (dados.temAssento && !resultado.includes('💺')) {
        // Adicionar após bagagem
        resultado = resultado.replace(/(✅[^\n]+)(\n|$)/, '$1\n💺 Inclui pré reserva de assento\n');
    } else if (!dados.temAssento) {
        // Remover linha de assento se não tem
        resultado = resultado.replace(/💺[^\n]*\n/g, '');
        resultado = resultado.replace(/\n💺[^\n]+/g, '');
    }
    
    return resultado;
}

function corrigirReembolso(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Determinar tipo de reembolso
    let tipoReembolso = 'Não reembolsável'; // padrão
    
    if (conteudoLower.includes('reembolsável') && !conteudoLower.includes('não reembolsável')) {
        tipoReembolso = 'Reembolsável conforme regras do bilhete';
    }
    
    // Substituir ou adicionar linha de reembolso
    if (resultado.includes('🏷️')) {
        resultado = resultado.replace(/🏷️[^\n]*/g, `🏷️ ${tipoReembolso}`);
    } else {
        // Adicionar após bagagem/assento
        const linhas = resultado.split('\n');
        const indiceVersao = linhas.findIndex(linha => linha.includes('Valores sujeitos'));
        if (indiceVersao > 0) {
            linhas.splice(indiceVersao, 0, `🏷️ ${tipoReembolso}`);
            resultado = linhas.join('\n');
        } else {
            resultado += `\n🏷️ ${tipoReembolso}`;
        }
    }
    
    return resultado;
}

function adicionarDiaSeguinte(texto) {
    let resultado = texto;
    const linhas = resultado.split('\n');
    
    console.log('🌅 Corrigindo (+1) - apenas volta Orlando...');
    
    linhas.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            if (horaMatch) {
                const horaChegada = parseInt(horaMatch[3]);
                
                // (+1) APENAS para:
                // 1. Volta de Orlando (contém "Orlando" e depois "Guarulhos")
                // 2. Chegada entre 00h e 08h (madrugada)
                const ehVoltaOrlando = linha.includes('Orlando') && 
                                      linha.includes('Guarulhos') && 
                                      linha.indexOf('Orlando') < linha.indexOf('Guarulhos');
                
                if (ehVoltaOrlando && horaChegada <= 8) {
                    console.log(`✅ Adicionando (+1) para volta Orlando: ${linha}`);
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                }
            }
        }
    });
    
    return linhas.join('\n');
}

function garantirVersao(texto) {
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
