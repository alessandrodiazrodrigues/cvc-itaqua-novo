function corrigirAssento(texto, dadosReais) {
    let resultado = texto;
    
    // Verificar se tem pré-reserva no conteúdo original
    if (dadosReais.opcoes && dadosReais.opcoes.length > 0) {
        dadosReais.opcoes.forEach((opcao, index) => {
            if (opcao.assento) {
                // Se tem assento, garantir que está correto
                const padrao = new RegExp(
                    `(OPÇÃO ${index + 1}[^]*?)(💺[^\\n]*)?`,
                    'gi'
                );
                
                resultado = resultado.replace(padrao, (match, antes, assentoAntigo) => {
                    if (assentoAntigo) {
                        return match.replace(assentoAntigo, `💺 ${opcao.assento}`);
                    } else {
                        // Adicionar após bagagem
                        return match.replace(/✅[^\\n]+/, `\n💺 ${opcao.assento}`);
                    }
                });
            } else {
                // Se não tem assento, remover linha de assento
                const padrao = new RegExp(
                    `(OPÇÃO ${index + 1}[^]*?)💺[^\\n]*\\n`,
                    'gi'
                );
                resultado = resultado.replace(padrao, '$1');
            }
        });
    } else {
        // Se não detectou assento no conteúdo, remover linha de assento
        resultado = resultado.replace(/💺[^\\n]*\\n/g, '');
    }
    
    return resultado;
}// api/corrections.js - CVC ITAQUA v3.0
// ARQUIVO 2: PÓS-PROCESSAMENTO E CORREÇÕES (editar aqui sem medo)
// ================================================================================

import { CONFIG, AEROPORTOS, REGRAS_BAGAGEM } from './templates.js';

// ================================================================================
// FUNÇÃO PRINCIPAL DE PÓS-PROCESSAMENTO
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Iniciando pós-processamento v3.0...');
        console.log('Parcelamento selecionado:', parcelamentoSelecionado);
        
        let resultado = texto;
        
        // Extrair dados reais primeiro
        const dadosReais = extrairDadosCompletos(conteudoOriginal);
        
        // Aplicar correções em ordem
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dadosReais);
        resultado = corrigirFormatoVoo(resultado, conteudoOriginal);
        resultado = corrigirLinks(resultado);
        resultado = corrigirValoresEParcelamentos(resultado, dadosReais, parcelamentoSelecionado);
        resultado = corrigirBagagem(resultado, dadosReais);
        resultado = corrigirAssento(resultado, dadosReais);
        resultado = adicionarDiaSeguinte(resultado);
        resultado = adicionarNumeracaoOpcoes(resultado);
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
// EXTRAÇÃO DE DADOS DO CONTEÚDO ORIGINAL
// ================================================================================

export function extrairDadosCompletos(conteudoPrincipal) {
    const dados = {
        opcoes: [],
        passageiros: null,
        destino: null
    };
    
    try {
        // Extrair passageiros - MELHORADO para detectar diferentes formatos
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
        
        // Tentar outro formato se não encontrou
        if (!matchPassageiros) {
            matchPassageiros = conteudoPrincipal.match(/(\d+)\s*adultos?\s*(?:\+|e)?\s*(\d*)\s*crianças?/i);
        }
        
        // Tentar formato "para X adultos"
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
        
        // Dividir por blocos de valor
        const blocos = conteudoPrincipal.split(/(?=\bR\$\s*[\d.,]+\s*\n)/);
        
        blocos.forEach((bloco, index) => {
            if (!bloco.includes('R
        
        // Dividir por blocos de valor
        const blocos = conteudoPrincipal.split(/(?=\bR\$\s*[\d.,]+\s*\n)/);
        
        blocos.forEach((bloco, index) => {
            if (!bloco.includes('R$')) return;
            
            const opcao = {
                numero: index + 1,
                companhia: null,
                valor: null,
                parcelamento: null,
                bagagem: null,
                assento: null,
                link: null,
                tipoVoo: null,
                escala: null
            };
            
            // Companhia
            const matchCompanhia = bloco.match(/(Iberia|Tap portugal|Latam|Gol|Azul|American|United|Air France|Lufthansa|Emirates)/i);
            if (matchCompanhia) {
                opcao.companhia = matchCompanhia[1]
                    .replace(/tap portugal/i, 'Tap Portugal')
                    .replace(/air france/i, 'Air France');
            }
            
            // Valor específico deste bloco
            const matchValor = bloco.match(/Total[^R]*R\$\s*([\d.,]+)/);
            if (matchValor) {
                opcao.valor = matchValor[1];
            } else {
                const matchValorSimples = bloco.match(/R\$\s*([\d.,]+)/);
                if (matchValorSimples) opcao.valor = matchValorSimples[1];
            }
            
            // Parcelamento específico
            const matchParc = bloco.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParc && opcao.valor) {
                const totalParcelas = parseInt(matchParc[2]) + 1;
                opcao.parcelamento = `Total de R$ ${opcao.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`;
            } else if (opcao.valor) {
                // Parcelamento padrão
                const valor = parseFloat(opcao.valor.replace(/\./g, '').replace(',', '.'));
                const valorParcela = (valor / 10).toFixed(2).replace('.', ',');
                opcao.parcelamento = `10x de R$ ${valorParcela} s/ juros no cartão`;
            }
            
            // Bagagem
            if (bloco.toLowerCase().includes('sem') && bloco.toLowerCase().includes('bagagem')) {
                opcao.bagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
            } else if (bloco.toLowerCase().includes('com bagagem') || bloco.toLowerCase().includes('com abagegem')) {
                opcao.bagagem = REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
            }
            
            // Assento
            if (bloco.toLowerCase().includes('pre reserva') || bloco.toLowerCase().includes('pré reserva')) {
                opcao.assento = 'Inclui pré reserva de assento';
            }
            
            // Tipo de voo e escala
            if (bloco.toLowerCase().includes('voo direto')) {
                opcao.tipoVoo = 'voo direto';
            } else if (bloco.toLowerCase().includes('uma escala')) {
                opcao.tipoVoo = 'com conexão';
                if (opcao.companhia === 'Iberia') {
                    opcao.escala = 'Madrid';
                } else if (opcao.companhia === 'Air France') {
                    opcao.escala = 'Paris';
                }
            }
            
            // Link
            const matchLink = bloco.match(/https:\/\/www\.cvc\.com\.br[^\s]*/);
            if (matchLink) opcao.link = matchLink[0];
            
            if (opcao.valor) dados.opcoes.push(opcao);
        });
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
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
    
    // Formato: "julho 11" → "11/07"
    resultado = resultado.replace(/(\w+)\s+(\d{1,2})/gi, (match, mes, dia) => {
        const mesNum = meses[mes.toLowerCase()];
        if (mesNum) {
            return `${dia.padStart(2, '0')}/${mesNum}`;
        }
        return match;
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

function corrigirPassageiros(texto, dadosReais) {
    if (!dadosReais.passageiros) return texto;
    
    // Substituir qualquer formato de passageiros pelo correto
    return texto.replace(/\d{2} adultos?(?:\s*\+\s*\d{2} crianças?)?/gi, dadosReais.passageiros);
}

function corrigirFormatoVoo(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    resultado = resultado.replace(/\(voo \(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(com conexão\)\)/g, '(com conexão)');
    resultado = resultado.replace(/\(com conexão\)/g, '(com conexão)');
    
    // Adicionar cidade da escala
    if (conteudoOriginal.toLowerCase().includes('iberia')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Madrid)');
    }
    if (conteudoOriginal.toLowerCase().includes('air france')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Paris)');
    }
    if (conteudoOriginal.toLowerCase().includes('copa')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala no Panamá)');
    }
    
    // Limpar textos desnecessários
    resultado = resultado.replace(/Ida:\s*/gi, '');
    resultado = resultado.replace(/Volta:\s*/gi, '');
    resultado = resultado.replace(/Classe Econômica/gi, '');
    resultado = resultado.replace(/\s+Uma escala\s+/gi, ' ');
    resultado = resultado.replace(/\s+Voo direto\s+/gi, ' ');
    
    return resultado;
}

function corrigirLinks(texto) {
    // Converter markdown para link direto
    return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
}

function corrigirValoresEParcelamentos(texto, dadosReais, parcelamentoSelecionado) {
    let resultado = texto;
    
    // Se tem parcelamento selecionado pelo usuário, aplicar em todas as opções
    if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        console.log('Aplicando parcelamento selecionado:', parcelamentoSelecionado);
        
        // Encontrar todos os valores no texto
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                // Criar linha de parcelamento
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                // Substituir ou adicionar parcelamento após o valor
                const padrao = new RegExp(`(${valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\function corrigirValoresEParcelamentos(texto, dadosReais) {
    if (!dadosReais.opcoes || dadosReais.opcoes.length === 0) return texto;
    
    let resultado = texto;
    
    // Corrigir cada opção individualmente
    dadosReais.opcoes.forEach((opcao, index) => {
        if (!opcao.valor) return;
        
        // Procurar bloco da opção
        const padrao = new RegExp(
            `(OPÇÃO ${index + 1}[^]*?)💰 R\\$ [\\d.,]+([^]*?)💳[^\\n]+`,
            'gi'
        );
        
        resultado = resultado.replace(padrao, (match, antes, depois) => {
            return `${antes}💰 R$ ${opcao.valor}${depois}💳 ${opcao.parcelamento}`;
        });
    });
    
    return resultado;
}')}[^💳]*)(💳[^\\n]*)?`, 'g');
                resultado = resultado.replace(padrao, (match, valor, parcelamentoAntigo) => {
                    return `${valor}\n${linhaParcelamento}`;
                });
            });
        }
    } else if (dadosReais.opcoes && dadosReais.opcoes.length > 0) {
        // Usar parcelamento do conteúdo original se houver
        dadosReais.opcoes.forEach((opcao, index) => {
            if (!opcao.valor) return;
            
            const padrao = new RegExp(
                `(OPÇÃO ${index + 1}[^]*?)💰 R\\$ [\\d.,]+([^]*?)💳[^\\n]+`,
                'gi'
            );
            
            resultado = resultado.replace(padrao, (match, antes, depois) => {
                return `${antes}💰 R$ ${opcao.valor}${depois}💳 ${opcao.parcelamento}`;
            });
        });
    } else {
        // Se não tem parcelamento selecionado e não tem no conteúdo, remover linha de parcelamento
        console.log('Removendo parcelamento (não selecionado)');
        resultado = resultado.replace(/💳[^\\n]+\\n/g, '');
    }
    
    return resultado;
}

function corrigirBagagem(texto, dadosReais) {
    let resultado = texto;
    
    // Aplicar correções específicas de cada opção
    if (dadosReais.opcoes && dadosReais.opcoes.length > 0) {
        dadosReais.opcoes.forEach((opcao, index) => {
            if (!opcao.bagagem) {
                // Se não detectou bagagem, usar padrão mínimo
                opcao.bagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
            }
            
            const padrao = new RegExp(
                `(OPÇÃO ${index + 1}[^]*?)✅[^\\n]+`,
                'gi'
            );
            
            resultado = resultado.replace(padrao, (match, antes) => {
                return `${antes}✅ ${opcao.bagagem}`;
            });
        });
    }
    
    // Correções gerais - MELHORADAS
    resultado = resultado.replace(/✅ Não inclui bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Sem bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Com bagagem/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
    resultado = resultado.replace(/✅ 1 bagagem de mão/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Bolsa ou mochila pequena/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    
    // Se não tem formato correto, aplicar padrão
    if (!resultado.includes('Inclui 1 item pessoal')) {
        resultado = resultado.replace(/✅[^\\n]+/g, match => {
            if (!match.includes('Inclui 1 item pessoal')) {
                return '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA;
            }
            return match;
        });
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
                
                // Lógica para adicionar (+1)
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

function adicionarNumeracaoOpcoes(texto) {
    let resultado = texto;
    let opcaoNum = 1;
    
    // Adicionar "OPÇÃO X" se não existir
    resultado = resultado.replace(/^\*(?!OPÇÃO)([^*]+\*)/gm, (match, content) => {
        if (content.includes('✈')) {
            return `*OPÇÃO ${opcaoNum++} - ${content}`;
        }
        return match;
    });
    
    return resultado;
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
    
    // Garantir separador de ida/volta
    resultado = resultado.replace(/\n--\n/g, '\n--\n');
    
    return resultado.trim();
}

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    posProcessar,
    extrairDadosCompletos
};)) return;
            
            const opcao = {
                numero: index + 1,
                companhia: null,
                valor: null,
                parcelamento: null,
                bagagem: null,
                assento: null,
                link: null,
                tipoVoo: null,
                escala: null
            };
            
            // Companhia
            const matchCompanhia = bloco.match(/(Iberia|Tap portugal|Latam|Gol|Azul|American|United|Air France|Lufthansa|Emirates)/i);
            if (matchCompanhia) {
                opcao.companhia = matchCompanhia[1]
                    .replace(/tap portugal/i, 'Tap Portugal')
                    .replace(/air france/i, 'Air France');
            }
            
            // Valor específico deste bloco
            const matchValor = bloco.match(/Total[^R]*R\$\s*([\d.,]+)/);
            if (matchValor) {
                opcao.valor = matchValor[1];
            } else {
                const matchValorSimples = bloco.match(/R\$\s*([\d.,]+)/);
                if (matchValorSimples) opcao.valor = matchValorSimples[1];
            }
            
            // Parcelamento específico
            const matchParc = bloco.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParc && opcao.valor) {
                const totalParcelas = parseInt(matchParc[2]) + 1;
                opcao.parcelamento = `Total de R$ ${opcao.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`;
            } else if (opcao.valor) {
                // Parcelamento padrão
                const valor = parseFloat(opcao.valor.replace(/\./g, '').replace(',', '.'));
                const valorParcela = (valor / 10).toFixed(2).replace('.', ',');
                opcao.parcelamento = `10x de R$ ${valorParcela} s/ juros no cartão`;
            }
            
            // Bagagem
            if (bloco.toLowerCase().includes('sem') && bloco.toLowerCase().includes('bagagem')) {
                opcao.bagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
            } else if (bloco.toLowerCase().includes('com bagagem') || bloco.toLowerCase().includes('com abagegem')) {
                opcao.bagagem = REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
            }
            
            // Assento
            if (bloco.toLowerCase().includes('pre reserva') || bloco.toLowerCase().includes('pré reserva')) {
                opcao.assento = 'Inclui pré reserva de assento';
            }
            
            // Tipo de voo e escala
            if (bloco.toLowerCase().includes('voo direto')) {
                opcao.tipoVoo = 'voo direto';
            } else if (bloco.toLowerCase().includes('uma escala')) {
                opcao.tipoVoo = 'com conexão';
                if (opcao.companhia === 'Iberia') {
                    opcao.escala = 'Madrid';
                } else if (opcao.companhia === 'Air France') {
                    opcao.escala = 'Paris';
                }
            }
            
            // Link
            const matchLink = bloco.match(/https:\/\/www\.cvc\.com\.br[^\s]*/);
            if (matchLink) opcao.link = matchLink[0];
            
            if (opcao.valor) dados.opcoes.push(opcao);
        });
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
}
        
        // Dividir por blocos de valor
        const blocos = conteudoPrincipal.split(/(?=\bR\$\s*[\d.,]+\s*\n)/);
        
        blocos.forEach((bloco, index) => {
            if (!bloco.includes('R$')) return;
            
            const opcao = {
                numero: index + 1,
                companhia: null,
                valor: null,
                parcelamento: null,
                bagagem: null,
                assento: null,
                link: null,
                tipoVoo: null,
                escala: null
            };
            
            // Companhia
            const matchCompanhia = bloco.match(/(Iberia|Tap portugal|Latam|Gol|Azul|American|United|Air France|Lufthansa|Emirates)/i);
            if (matchCompanhia) {
                opcao.companhia = matchCompanhia[1]
                    .replace(/tap portugal/i, 'Tap Portugal')
                    .replace(/air france/i, 'Air France');
            }
            
            // Valor específico deste bloco
            const matchValor = bloco.match(/Total[^R]*R\$\s*([\d.,]+)/);
            if (matchValor) {
                opcao.valor = matchValor[1];
            } else {
                const matchValorSimples = bloco.match(/R\$\s*([\d.,]+)/);
                if (matchValorSimples) opcao.valor = matchValorSimples[1];
            }
            
            // Parcelamento específico
            const matchParc = bloco.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParc && opcao.valor) {
                const totalParcelas = parseInt(matchParc[2]) + 1;
                opcao.parcelamento = `Total de R$ ${opcao.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`;
            } else if (opcao.valor) {
                // Parcelamento padrão
                const valor = parseFloat(opcao.valor.replace(/\./g, '').replace(',', '.'));
                const valorParcela = (valor / 10).toFixed(2).replace('.', ',');
                opcao.parcelamento = `10x de R$ ${valorParcela} s/ juros no cartão`;
            }
            
            // Bagagem
            if (bloco.toLowerCase().includes('sem') && bloco.toLowerCase().includes('bagagem')) {
                opcao.bagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
            } else if (bloco.toLowerCase().includes('com bagagem') || bloco.toLowerCase().includes('com abagegem')) {
                opcao.bagagem = REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
            }
            
            // Assento
            if (bloco.toLowerCase().includes('pre reserva') || bloco.toLowerCase().includes('pré reserva')) {
                opcao.assento = 'Inclui pré reserva de assento';
            }
            
            // Tipo de voo e escala
            if (bloco.toLowerCase().includes('voo direto')) {
                opcao.tipoVoo = 'voo direto';
            } else if (bloco.toLowerCase().includes('uma escala')) {
                opcao.tipoVoo = 'com conexão';
                if (opcao.companhia === 'Iberia') {
                    opcao.escala = 'Madrid';
                } else if (opcao.companhia === 'Air France') {
                    opcao.escala = 'Paris';
                }
            }
            
            // Link
            const matchLink = bloco.match(/https:\/\/www\.cvc\.com\.br[^\s]*/);
            if (matchLink) opcao.link = matchLink[0];
            
            if (opcao.valor) dados.opcoes.push(opcao);
        });
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
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
    
    // Formato: "julho 11" → "11/07"
    resultado = resultado.replace(/(\w+)\s+(\d{1,2})/gi, (match, mes, dia) => {
        const mesNum = meses[mes.toLowerCase()];
        if (mesNum) {
            return `${dia.padStart(2, '0')}/${mesNum}`;
        }
        return match;
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

function corrigirPassageiros(texto, dadosReais) {
    if (!dadosReais.passageiros) return texto;
    
    // Substituir qualquer formato de passageiros pelo correto
    return texto.replace(/\d{2} adultos?(?:\s*\+\s*\d{2} crianças?)?/gi, dadosReais.passageiros);
}

function corrigirFormatoVoo(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    resultado = resultado.replace(/\(voo \(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(com conexão\)\)/g, '(com conexão)');
    resultado = resultado.replace(/\(com conexão\)/g, '(com conexão)');
    
    // Adicionar cidade da escala
    if (conteudoOriginal.toLowerCase().includes('iberia')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Madrid)');
    }
    if (conteudoOriginal.toLowerCase().includes('air france')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Paris)');
    }
    if (conteudoOriginal.toLowerCase().includes('copa')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala no Panamá)');
    }
    
    // Limpar textos desnecessários
    resultado = resultado.replace(/Ida:\s*/gi, '');
    resultado = resultado.replace(/Volta:\s*/gi, '');
    resultado = resultado.replace(/Classe Econômica/gi, '');
    resultado = resultado.replace(/\s+Uma escala\s+/gi, ' ');
    resultado = resultado.replace(/\s+Voo direto\s+/gi, ' ');
    
    return resultado;
}

function corrigirLinks(texto) {
    // Converter markdown para link direto
    return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
}

function corrigirValoresEParcelamentos(texto, dadosReais, parcelamentoSelecionado) {
    let resultado = texto;
    
    // Se tem parcelamento selecionado pelo usuário, aplicar em todas as opções
    if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        console.log('Aplicando parcelamento selecionado:', parcelamentoSelecionado);
        
        // Encontrar todos os valores no texto
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                // Criar linha de parcelamento
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                // Substituir ou adicionar parcelamento após o valor
                const padrao = new RegExp(`(${valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\function corrigirValoresEParcelamentos(texto, dadosReais) {
    if (!dadosReais.opcoes || dadosReais.opcoes.length === 0) return texto;
    
    let resultado = texto;
    
    // Corrigir cada opção individualmente
    dadosReais.opcoes.forEach((opcao, index) => {
        if (!opcao.valor) return;
        
        // Procurar bloco da opção
        const padrao = new RegExp(
            `(OPÇÃO ${index + 1}[^]*?)💰 R\\$ [\\d.,]+([^]*?)💳[^\\n]+`,
            'gi'
        );
        
        resultado = resultado.replace(padrao, (match, antes, depois) => {
            return `${antes}💰 R$ ${opcao.valor}${depois}💳 ${opcao.parcelamento}`;
        });
    });
    
    return resultado;
}')}[^💳]*)(💳[^\\n]*)?`, 'g');
                resultado = resultado.replace(padrao, (match, valor, parcelamentoAntigo) => {
                    return `${valor}\n${linhaParcelamento}`;
                });
            });
        }
    } else if (dadosReais.opcoes && dadosReais.opcoes.length > 0) {
        // Usar parcelamento do conteúdo original se houver
        dadosReais.opcoes.forEach((opcao, index) => {
            if (!opcao.valor) return;
            
            const padrao = new RegExp(
                `(OPÇÃO ${index + 1}[^]*?)💰 R\\$ [\\d.,]+([^]*?)💳[^\\n]+`,
                'gi'
            );
            
            resultado = resultado.replace(padrao, (match, antes, depois) => {
                return `${antes}💰 R$ ${opcao.valor}${depois}💳 ${opcao.parcelamento}`;
            });
        });
    } else {
        // Se não tem parcelamento selecionado e não tem no conteúdo, remover linha de parcelamento
        console.log('Removendo parcelamento (não selecionado)');
        resultado = resultado.replace(/💳[^\\n]+\\n/g, '');
    }
    
    return resultado;
}

function corrigirBagagem(texto, dadosReais) {
    let resultado = texto;
    
    // Aplicar correções específicas de cada opção
    if (dadosReais.opcoes && dadosReais.opcoes.length > 0) {
        dadosReais.opcoes.forEach((opcao, index) => {
            if (!opcao.bagagem) {
                // Se não detectou bagagem, usar padrão mínimo
                opcao.bagagem = REGRAS_BAGAGEM.SEM_DESPACHADA;
            }
            
            const padrao = new RegExp(
                `(OPÇÃO ${index + 1}[^]*?)✅[^\\n]+`,
                'gi'
            );
            
            resultado = resultado.replace(padrao, (match, antes) => {
                return `${antes}✅ ${opcao.bagagem}`;
            });
        });
    }
    
    // Correções gerais - MELHORADAS
    resultado = resultado.replace(/✅ Não inclui bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Sem bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Com bagagem/g, '✅ ' + REGRAS_BAGAGEM.COM_DESPACHADA_23KG);
    resultado = resultado.replace(/✅ 1 bagagem de mão/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    resultado = resultado.replace(/✅ Bolsa ou mochila pequena/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
    
    // Se não tem formato correto, aplicar padrão
    if (!resultado.includes('Inclui 1 item pessoal')) {
        resultado = resultado.replace(/✅[^\\n]+/g, match => {
            if (!match.includes('Inclui 1 item pessoal')) {
                return '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA;
            }
            return match;
        });
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
                
                // Lógica para adicionar (+1)
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

function adicionarNumeracaoOpcoes(texto) {
    let resultado = texto;
    let opcaoNum = 1;
    
    // Adicionar "OPÇÃO X" se não existir
    resultado = resultado.replace(/^\*(?!OPÇÃO)([^*]+\*)/gm, (match, content) => {
        if (content.includes('✈')) {
            return `*OPÇÃO ${opcaoNum++} - ${content}`;
        }
        return match;
    });
    
    return resultado;
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
    
    // Garantir separador de ida/volta
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
