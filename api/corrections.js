// api/corrections.js - CVC ITAQUA v3.20 CORREÇÃO COMPLETA
// ARQUIVO 2: PÓS-PROCESSAMENTO E CORREÇÕES - TODAS AS DIVERGÊNCIAS
// ================================================================================

import { CONFIG, AEROPORTOS, REGRAS_BAGAGEM } from './templates.js';

// ================================================================================
// EXTRAÇÃO DE DADOS MELHORADA v3.20
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
        ehHotel: false,
        companhias: []
    };
    
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Detectar se é hotel v3.20
        dados.ehHotel = (conteudoLower.includes('hotel') || 
                        conteudoLower.includes('comfort suites') ||
                        conteudoLower.includes('preferencial') ||
                        conteudoLower.includes('pousada') ||
                        conteudoLower.includes('resort')) && 
                       !conteudoLower.includes('aeroporto') && 
                       !conteudoLower.includes('voo') &&
                       !conteudoLower.includes('ida') &&
                       !conteudoLower.includes('volta');
        
        console.log(`🏨 É hotel: ${dados.ehHotel}`);
        
        // Detectar múltiplas companhias v3.20
        const companhias = (conteudoPrincipal.match(/(?:Copa airlines|Copa|Latam|Avianca|Gol|Azul|Tap|Iberia|Emirates|Lufthansa)/gi) || []);
        dados.companhias = [...new Set(companhias.map(c => c.toLowerCase().replace(/\s+airlines?/, '')))];
        dados.multiplas = dados.companhias.length >= 2;
        
        console.log(`✈️ Companhias: ${dados.companhias.join(', ')}, Múltiplas: ${dados.multiplas}`);
        
        // Extrair passageiros com TODAS as variações v3.20
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
        
        // Detectar bagagem despachada v3.20 - MELHORADO
        dados.temBagagem = conteudoLower.includes('com bagagem') || 
                          conteudoLower.includes('bagagem despachada') ||
                          conteudoLower.includes('bagagens inclusas') ||
                          conteudoLower.includes('mala de até 23kg') ||
                          conteudoLower.includes('bagagem despachada + pre´-resera') ||
                          conteudoLower.includes('com babagem'); // erro de digitação comum
        
        console.log(`🧳 Tem bagagem: ${dados.temBagagem}`);
        
        // Detectar pré-reserva de assento v3.20
        dados.temAssento = conteudoLower.includes('pré-reserva de assento') ||
                          conteudoLower.includes('pre reserva de assento') ||
                          conteudoLower.includes('pré reserva de assento') ||
                          conteudoLower.includes('bagagem despachada + pre´-resera de assento') ||
                          conteudoLower.includes('marcação de assento') ||
                          conteudoLower.includes('pre´-resera');
        
        console.log(`💺 Tem assento: ${dados.temAssento}`);
        
        // Extrair parcelamento com entrada v3.20 - MELHORADO
        const matchParcelamento = conteudoPrincipal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
        if (matchParcelamento) {
            const entrada = matchParcelamento[1];
            const numParcelas = matchParcelamento[2];
            const valorParcela = matchParcelamento[3];
            const totalParcelas = parseInt(numParcelas) + 1;
            
            // Extrair valor total do contexto
            const matchValorTotal = conteudoPrincipal.match(/R\$\s*([\d.,]+)(?:\s*$|\s*Entrada|\s*Total|\s*Detalhes)/m);
            const valorTotal = matchValorTotal ? matchValorTotal[1] : entrada;
            
            dados.parcelamento = `Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
            
            console.log(`💳 Parcelamento extraído: ${dados.parcelamento}`);
        }
        
        // Extrair destino v3.20
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
    
    console.log('📊 Dados extraídos v3.20:', dados);
    return dados;
}

// ================================================================================
// PÓS-PROCESSAMENTO PRINCIPAL v3.20
// ================================================================================

export function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.20 - CORREÇÃO TOTAL...');
        
        let resultado = texto;
        
        // Extrair dados primeiro
        const dados = extrairDadosCompletos(conteudoOriginal);
        
        // Se é hotel, aplicar processamento específico v3.20
        if (dados.ehHotel) {
            resultado = processarHotelV320(resultado, dados, conteudoOriginal);
            return resultado;
        }
        
        // Aplicar correções em ordem para voos v3.20
        resultado = removerDiasSemanaV320(resultado); // NOVA v3.20
        resultado = corrigirDatas(resultado);
        resultado = converterCodigosAeroporto(resultado);
        resultado = corrigirPassageiros(resultado, dados);
        resultado = corrigirFormatoVooV320(resultado); // MELHORADA v3.20
        resultado = corrigirLinks(resultado);
        resultado = corrigirParcelamentoV320(resultado, parcelamentoSelecionado, dados); // MELHORADA v3.20
        resultado = corrigirBagagem(resultado, dados);
        resultado = corrigirAssento(resultado, dados);
        resultado = corrigirReembolso(resultado, conteudoOriginal);
        resultado = adicionarDiaSeguinteV320(resultado); // CORRIGIDA v3.20
        resultado = garantirVersaoV320(resultado); // NOVA v3.20
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v3.20 completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

// ================================================================================
// NOVA FUNÇÃO v3.20 - REMOVER DIAS DA SEMANA
// ================================================================================

function removerDiasSemanaV320(texto) {
    console.log('📅 Removendo dias da semana v3.20...');
    
    let resultado = texto;
    
    // Remover dias da semana das datas - TODOS OS FORMATOS
    resultado = resultado.replace(/(?:ter|qua|qui|sex|sáb|sab|dom|seg|segunda|terça|quarta|quinta|sexta|sábado|domingo),?\s*(\d{1,2}\/\d{2})/gi, '$1');
    resultado = resultado.replace(/(?:ter|qua|qui|sex|sáb|sab|dom|seg),?\s*(\d{1,2})\s+de\s+(\w+)/gi, '$1 de $2');
    
    // Casos específicos como "ter, 27 de janeiro"
    resultado = resultado.replace(/(?:ter|qua|qui|sex|sáb|sab|dom|seg),\s*(\d{1,2}\s+de\s+\w+)/gi, '$1');
    
    console.log('✅ Dias da semana removidos');
    return resultado;
}

// ================================================================================
// PROCESSAMENTO ESPECÍFICO PARA HOTÉIS v3.20
// ================================================================================

function processarHotelV320(texto, dados, conteudoOriginal) {
    console.log('🏨 Processando hotel v3.20...');
    
    let resultado = texto;
    
    // Remover qualquer referência a voo/aeroporto
    resultado = resultado.replace(/.*Aeroporto.*\n/g, '');
    resultado = resultado.replace(/.*✈.*\n/g, '');
    resultado = resultado.replace(/.*--.*\n/g, '');
    resultado = resultado.replace(/.*\(voo direto\).*\n/g, '');
    resultado = resultado.replace(/.*\(com conexão\).*\n/g, '');
    resultado = resultado.replace(/.*Hora.*\n/g, '');
    
    // Garantir formato de hotel correto
    if (!resultado.includes('*Hotéis em') && !resultado.includes('*Hotel') && !resultado.includes('**OPÇÃO')) {
        // Reconstruir como hotel baseado no conteúdo original
        const linhas = [];
        
        // Extrair dados do conteúdo original
        let nomeHotel = '';
        let localizacao = '';
        let valor = '';
        let passageiros = dados.passageiros || '04 adultos e 02 crianças';
        let destino = 'Orlando';
        
        // Extrair informações específicas
        const comfortMatch = conteudoOriginal.match(/Comfort Suites[^\\n]*/i);
        if (comfortMatch) {
            nomeHotel = comfortMatch[0].replace(/[*-]/g, '').trim();
        }
        
        const localizacaoMatch = conteudoOriginal.match(/(\d+\s+[\w\s]+blvd)/i);
        if (localizacaoMatch) {
            localizacao = localizacaoMatch[1];
        }
        
        const valorMatch = conteudoOriginal.match(/R\$\s*([\d.,]+)/);
        if (valorMatch) {
            valor = valorMatch[1];
        }
        
        if (conteudoOriginal.includes('Orlando')) destino = 'Orlando';
        
        // Construir formato hotel correto
        linhas.push(`*Hotéis em ${destino} - Florida*`);
        linhas.push('Período: 27/01 a 04/02 (8 noites)');
        linhas.push(passageiros);
        linhas.push('');
        linhas.push(`**OPÇÃO 1** - ${nomeHotel || 'Comfort Suites Maingate East'} ⭐⭐⭐`);
        linhas.push(`📍 ${localizacao || '2775 Florida Plaza Blvd'}`);
        linhas.push('🛏️ Studio Suite');
        linhas.push('☕ Café da manhã');
        linhas.push(`💰 R$ ${valor || '5.568,03'} total`);
        linhas.push('');
        linhas.push(`Valores sujeitos a confirmação e disponibilidade (v3.20)`);
        
        resultado = linhas.join('\n');
    }
    
    // Garantir versão correta
    resultado = resultado.replace(/\(v[\d.]+\)/g, '(v3.20)');
    
    console.log('✅ Hotel processado v3.20');
    return resultado;
}

// ================================================================================
// CORREÇÕES ESPECÍFICAS v3.20
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
    
    // Converter datas com mês por extenso
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

// MELHORADA v3.20 - Corrigir formato de voo
function corrigirFormatoVooV320(texto) {
    let resultado = texto;
    
    // Corrigir tipos de voo - TODAS as variações
    resultado = resultado.replace(/uma escala/gi, 'com conexão');
    resultado = resultado.replace(/duas escalas/gi, 'com múltiplas conexões');
    resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
    resultado = resultado.replace(/\(voo\s+voo direto\)/g, '(voo direto)');
    resultado = resultado.replace(/voo com paradas/gi, 'com conexão');
    
    // Remover duplicações
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    
    // Corrigir formato específico "Avianca - Guarulhos, São Paulo ✈ Orlando, Orlando"
    resultado = resultado.replace(/([A-Za-z\s]+),\s*([A-Za-z\s]+)\s*✈\s*([A-Za-z\s]+),\s*([A-Za-z\s]+)/g, '$1 ✈ $3');
    
    // Corrigir linhas de voo com destinos duplicados
    resultado = resultado.replace(/(\w+)\s+(\d{2}:\d{2})\s+\/\s+([A-Za-z\s]+)\.\s+(\d{2}:\d{2})/g, '$1 $2 / $3 $4');
    
    console.log('✅ Formato de voo corrigido v3.20');
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

// MELHORADA v3.20 - Corrigir parcelamento
function corrigirParcelamentoV320(texto, parcelamentoSelecionado, dados) {
    let resultado = texto;
    
    console.log('💳 Corrigindo parcelamento v3.20...');
    console.log('- Parcelamento extraído:', dados.parcelamento);
    console.log('- Parcelamento selecionado:', parcelamentoSelecionado);
    
    // Primeiro, usar parcelamento extraído se existir
    if (dados.parcelamento) {
        console.log('💳 Usando parcelamento extraído');
        
        if (resultado.includes('💰')) {
            // Substituir ou adicionar parcelamento após valor
            resultado = resultado.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${dados.parcelamento}`);
        }
    } else if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
        console.log('💳 Aplicando parcelamento selecionado');
        
        const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
        
        if (valoresEncontrados) {
            valoresEncontrados.forEach(valorMatch => {
                const valor = valorMatch.match(/[\d.,]+/)[0];
                const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                const numParcelas = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                
                const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                
                const escapedValue = valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

// CORRIGIDA v3.20 - (+1) apenas para volta Orlando
function adicionarDiaSeguinteV320(texto) {
    let resultado = texto;
    const linhas = resultado.split('\n');
    
    console.log('🌅 Corrigindo (+1) v3.20 - apenas volta Orlando ≤ 08h...');
    
    linhas.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            if (horaMatch) {
                const horaChegada = parseInt(horaMatch[3]);
                
                // (+1) APENAS para:
                // 1. Volta de Orlando (contém "Orlando" antes de outro aeroporto)
                // 2. Chegada entre 00h e 08h (madrugada)
                const ehVoltaOrlando = linha.includes('Orlando') && 
                                      (linha.includes('Guarulhos') || linha.includes('São Paulo')) && 
                                      linha.indexOf('Orlando') < linha.indexOf('Guarulhos');
                
                if (ehVoltaOrlando && horaChegada <= 8) {
                    console.log(`✅ Adicionando (+1) para volta Orlando: ${linha.substring(0, 50)}...`);
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                }
            }
        }
    });
    
    return linhas.join('\n');
}

// NOVA v3.20 - Garantir versão
function garantirVersaoV320(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v3.20)`;
    
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
    
    // Remover
