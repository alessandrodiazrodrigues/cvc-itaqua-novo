// NOVA FUNÇÃO v3.18 - Reembolso específico
function corrigirReembolsoV318(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Determinar tipo de reembolso pelo conteúdo
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
            resultado += `\// api/corrections.js - CVC ITAQUA v3.18
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
// PÓS-PROCESSAMENTO PRINCIPAL v3.18
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.18...');
        console.log('Parcelamento selecionado:', parcelamentoSelecionado);
        
        let resultado = texto;
        
        // Extrair dados primeiro
        const dados = extrairDadosCompletos(conteudoOriginal);
        
        // Aplicar correções em ordem
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dados);
        resultado = corrigirFormatoVooV318(resultado, conteudoOriginal); // NOVA v3.18
        resultado = corrigirLinks(resultado, dados);
        resultado = corrigirParcelamentoV318(resultado, parcelamentoSelecionado, conteudoOriginal, dados); // NOVA v3.18
        resultado = corrigirBaggagemV318(resultado, conteudoOriginal); // MELHORADA v3.18
        resultado = corrigirAssento(resultado, conteudoOriginal);
        resultado = corrigirReembolsoV318(resultado, conteudoOriginal); // NOVA v3.18
        resultado = adicionarDiaSeguinteV318(resultado); // CORRIGIDA v3.18
        resultado = garantirVersaoV318(resultado); // NOVA v3.18
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v3.18 completo');
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

// NOVA FUNÇÃO v3.18 - Corrigir formato específico de voo
function corrigirFormatoVooV318(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Detectar se é hotel (não aplicar correções de voo)
    if (conteudoOriginal.toLowerCase().includes('hotel') && 
        !conteudoOriginal.toLowerCase().includes('aeroporto') && 
        !conteudoOriginal.toLowerCase().includes('voo')) {
        return resultado;
    }
    
    // Remover dias da semana das datas se aparecerem
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|dom),?\s*(\d{2}\/\d{2})/gi, '$1');
    
    // Corrigir (+1) apenas quando realmente necessário
    resultado = resultado.replace(/(\d{2}:\d{2})\s*\+1/g, '$1 (+1)');
    
    // Garantir formato correto de voo
    resultado = resultado.replace(/(\d{2}\/\d{2}) - (\w+) (\d{2}:\d{2}) \/ (\w+) (\d{2}:\d{2})(?:\s*\+1)?\s*\(([^)]+)\)/g, 
        (match, data, origem, horaOrigem, destino, horaDestino, tipo) => {
            // Verificar se precisa de (+1)
            const hora = parseInt(horaDestino.split(':')[0]);
            const precisaPlus1 = hora <= 8 && destino.toLowerCase().includes('guarulhos');
            
            if (precisaPlus1) {
                return `${data} - ${origem} ${horaOrigem} / ${destino} ${horaDestino} (+1) (${tipo})`;
            } else {
                return `${data} - ${origem} ${horaOrigem} / ${destino} ${horaDestino} (${tipo})`;
            }
        });
    
    // Corrigir tipos de voo
    resultado = resultado.replace(/uma escala/gi, 'com conexão');
    resultado = resultado.replace(/duas escalas/gi, 'com múltiplas conexões');
    resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
    resultado = resultado.replace(/\(voo\s+voo direto\)/g, '(voo direto)');
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    
    return resultado;
}

function corrigirLinks(texto, dados) {
    let resultado = texto;
    
    // Converter markdown links para links diretos
    resultado = resultado.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
    
    // Remover links genéricos
    resultado = resultado.replace(/🔗 https:\/\/www\.cvc\.com\.br\s*$/gm, '');
    resultado = resultado.replace(/🔗 www\.cvc\.com\.br\s*$/gm, '');
    
    // Adicionar links específicos se não existirem
    if (dados && dados.links && dados.links.length > 0 && !resultado.includes('🔗')) {
        // Encontrar última linha antes da versão e adicionar primeiro link
        const linhas = resultado.split('\n');
        const indiceVersao = linhas.findIndex(linha => linha.includes('Valores sujeitos'));
        if (indiceVersao > 0) {
            linhas.splice(indiceVersao, 0, `🔗 ${dados.links[0]}`);
            resultado = linhas.join('\n');
        }
    }
    
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

// MELHORADA v3.18 - Bagagem mais precisa
function corrigirBaggagemV318(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    // Detectar tipo de bagagem pelo conteúdo
    let tipoBagagem = REGRAS_BAGAGEM.SEM_DESPACHADA; // padrão
    
    if (conteudoLower.includes('com bagagem') || 
        conteudoLower.includes('bagagem despachada') ||
        conteudoLower.includes('mala de até 23kg') ||
        conteudoLower.includes('bagagens inclusas')) {
        tipoBagagem = REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
    }
    
    // Substituir linhas de bagagem existentes
    resultado = resultado.replace(/✅[^\n]*/g, `✅ ${tipoBagagem}`);
    
    // Se não tem linha de bagagem, adicionar após valor/parcelamento
    if (!resultado.includes('✅')) {
        resultado = resultado.replace(/(💰[^\n]+|💳[^\n]+)(\n|$)/, `$1\n✅ ${tipoBagagem}\n`);
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
