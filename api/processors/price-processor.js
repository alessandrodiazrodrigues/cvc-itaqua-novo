// api/processors/price-processor.js - PROCESSADOR DE PREÇOS v4.0
// ================================================================================
// 💰 PROCESSA VALORES E PARCELAMENTO CONFORME PADRÃO CVC
// 🎯 Regra: Detecta parcelamento com entrada | Aplica selecionado pelo usuário
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// 💰 PROCESSADOR PRINCIPAL DE PREÇOS
// ================================================================================

/**
 * Processa valores e parcelamento no texto
 * @param {string} texto - Texto a ser processado
 * @param {string} parcelamentoSelecionado - Parcelamento escolhido pelo usuário
 * @param {Object} dadosExtraidos - Dados extraídos do orçamento
 * @returns {string} Texto com preços processados
 */
export function processarPrecos(texto, parcelamentoSelecionado = '', dadosExtraidos = {}) {
    if (!texto || typeof texto !== 'string') {
        console.warn('⚠️ Price Processor: Texto inválido recebido');
        return texto || '';
    }
    
    console.log('💰 Iniciando processamento de preços...');
    console.log(`💳 Parcelamento selecionado: ${parcelamentoSelecionado || 'nenhum'}`);
    
    let resultado = texto;
    
    try {
        // 1. DETECTAR PARCELAMENTO COM ENTRADA NO TEXTO ORIGINAL
        const parcelamentoExtraido = extrairParcelamentoComEntrada(texto);
        
        // 2. PADRONIZAR FORMATO DE VALORES
        resultado = padronizarValores(resultado);
        
        // 3. APLICAR PARCELAMENTO CORRETO
        if (parcelamentoExtraido.encontrado) {
            console.log('💳 Usando parcelamento extraído do texto');
            resultado = aplicarParcelamentoExtraido(resultado, parcelamentoExtraido);
        } else if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
            console.log('💳 Aplicando parcelamento selecionado pelo usuário');
            resultado = aplicarParcelamentoSelecionado(resultado, parcelamentoSelecionado);
        } else {
            console.log('💳 Removendo parcelamento (não especificado)');
            resultado = removerParcelamento(resultado);
        }
        
        // 4. VALIDAR CONSISTÊNCIA DOS PREÇOS
        const validacao = validarPrecos(resultado);
        if (!validacao.valido) {
            console.warn('⚠️ Inconsistências nos preços:', validacao.avisos);
        }
        
        console.log('✅ Price Processor: Processamento concluído');
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Price Processor: Erro no processamento:', error);
        return texto; // Retorna original em caso de erro
    }
}

// ================================================================================
// 🔍 EXTRAÇÃO DE PARCELAMENTO COM ENTRADA
// ================================================================================

function extrairParcelamentoComEntrada(texto) {
    const resultado = {
        encontrado: false,
        entrada: null,
        numParcelas: null,
        valorParcela: null,
        valorTotal: null,
        textoCompleto: null
    };
    
    console.log('🔍 Buscando parcelamento com entrada...');
    
    // Padrões de parcelamento com entrada - EXPANDIDOS
    const padroes = [
        // "Entrada de R$ 1.162,10 + 5x de R$ 478,60"
        /entrada\s+de\s+r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+r\$\s*([\d.,]+)/gi,
        // "R$ 1.162,10 de entrada + 5x R$ 478,60"
        /r\$\s*([\d.,]+)\s+de\s+entrada\s*\+\s*(\d+)x\s+r\$\s*([\d.,]+)/gi,
        // "Primeira parcela R$ 1.162,10 + 5x R$ 478,60"
        /primeira\s+parcela\s+r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+r\$\s*([\d.,]+)/gi,
        // "1ª parcela R$ 1.162,10 + 5x R$ 478,60"
        /1[ªº]\s+parcela\s+r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+r\$\s*([\d.,]+)/gi,
        // NOVOS PADRÕES ADICIONADOS:
        // "Entrada de R$ 8.822,07 + 4x de R$ 5.144,23 s/ juros"
        /entrada\s+de\s+r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+r\$\s*([\d.,]+)\s+s\/\s+juros/gi,
        // "R$ 8.822,07 + 4x de R$ 5.144,23 s/ juros c/ taxa"
        /r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+r\$\s*([\d.,]+)\s+s\/\s+juros/gi,
        // "R$ 8.822,07 + 4x de R$ 5.144,23"
        /r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+r\$\s*([\d.,]+)/gi,
        // Padrão mais flexível para capturar variações
        /([\d.,]+)\s*\+\s*(\d+)x\s+de\s+r?\$?\s*([\d.,]+)/gi
    ];
    
    for (const padrao of padroes) {
        const match = texto.match(padrao);
        if (match) {
            console.log('🔍 Parcelamento com entrada encontrado:', match[0]);
            
            resultado.encontrado = true;
            resultado.entrada = match[1];
            resultado.numParcelas = parseInt(match[2]);
            resultado.valorParcela = match[3];
            resultado.textoCompleto = match[0];
            
            // Calcular valor total
            const entradaNum = parseFloat(resultado.entrada.replace(/\./g, '').replace(',', '.'));
            const parcelaNum = parseFloat(resultado.valorParcela.replace(/\./g, '').replace(',', '.'));
            const totalNum = entradaNum + (resultado.numParcelas * parcelaNum);
            resultado.valorTotal = formatarValor(totalNum);
            
            break;
        }
    }
    
    return resultado;
}

// ================================================================================
// 💳 APLICAÇÃO DE PARCELAMENTO EXTRAÍDO
// ================================================================================

function aplicarParcelamentoExtraido(texto, parcelamentoExtraido) {
    let resultado = texto;
    
    const { entrada, numParcelas, valorParcela, valorTotal } = parcelamentoExtraido;
    const totalParcelas = numParcelas + 1; // Entrada + parcelas
    
    const linhaParcelamento = `💳 Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
    
    // Encontrar e substituir linhas de valor
    const linhas = resultado.split('\n');
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Substituo valor na linha principal
        if (linha.includes('💰') && linha.includes('R$')) {
            // Manter estrutura mas atualizar valor se necessário
            if (!linha.includes(valorTotal)) {
                linhas[i] = linha.replace(/R\$\s*[\d.,]+/, `R$ ${valorTotal}`);
            }
            
            // Adicionar ou substituir parcelamento na próxima linha não vazia
            let j = i + 1;
            
            // Procurar linha de parcelamento existente
            while (j < linhas.length) {
                if (linhas[j].includes('💳')) {
                    linhas[j] = linhaParcelamento;
                    console.log('💳 Parcelamento extraído aplicado');
                    return linhas.join('\n');
                } else if (linhas[j].trim() !== '' && !linhas[j].includes('✅') && !linhas[j].includes('🏷️')) {
                    // Inserir antes desta linha
                    linhas.splice(j, 0, linhaParcelamento);
                    console.log('💳 Parcelamento extraído inserido');
                    return linhas.join('\n');
                }
                j++;
            }
            
            // Se não encontrou local, adicionar após o valor
            linhas.splice(i + 1, 0, linhaParcelamento);
            console.log('💳 Parcelamento extraído adicionado');
            break;
        }
    }
    
    return linhas.join('\n');
}

// ================================================================================
// 💳 APLICAÇÃO DE PARCELAMENTO SELECIONADO
// ================================================================================

function aplicarParcelamentoSelecionado(texto, parcelamentoSelecionado) {
    let resultado = texto;
    
    const numParcelas = parseInt(parcelamentoSelecionado);
    if (!numParcelas || numParcelas < 1) {
        console.warn('⚠️ Parcelamento inválido:', parcelamentoSelecionado);
        return resultado;
    }
    
    console.log(`💳 Aplicando parcelamento de ${numParcelas}x...`);
    
    // Encontrar valores no texto
    const valoresEncontrados = extrairValores(resultado);
    
    for (const valorInfo of valoresEncontrados) {
        const { valor, valorNum, linha, indice } = valorInfo;
        
        if (valorNum > 0) {
            const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
            const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
            
            resultado = adicionarParcelamentoAposValor(resultado, indice, linhaParcelamento);
            console.log(`💳 Parcelamento ${numParcelas}x aplicado para R$ ${valor}`);
            break; // Aplicar apenas ao primeiro valor encontrado
        }
    }
    
    return resultado;
}

// ================================================================================
// 🗑️ REMOÇÃO DE PARCELAMENTO
// ================================================================================

function removerParcelamento(texto) {
    console.log('🗑️ Removendo linhas de parcelamento...');
    
    let resultado = texto;
    
    // Remover linhas que começam com 💳
    resultado = resultado.replace(/\n💳[^\n]+/g, '');
    resultado = resultado.replace(/💳[^\n]+\n/g, '');
    
    return resultado;
}

// ================================================================================
// 🔧 PADRONIZAÇÃO DE VALORES
// ================================================================================

function padronizarValores(texto) {
    let resultado = texto;
    
    console.log('🔧 Padronizando formato de valores...');
    
    // Padrões de correção
    const correos = [
        // "R$1.464,02" → "R$ 1.464,02" (adicionar espaço)
        { pattern: /R\$(\d)/g, replacement: 'R$ $1' },
        // "R$ 1464,02" → "R$ 1.464,02" (adicionar pontos de milhares)
        { pattern: /R\$ (\d{4,})(\d{2}),(\d{2})/g, replacement: (match, p1, p2, p3) => {
            const numero = p1 + p2;
            const formatado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `R$ ${formatado},${p3}`;
        }},
        // Múltiplos espaços após R$
        { pattern: /R\$\s{2,}/g, replacement: 'R$ ' }
    ];
    
    for (const { pattern, replacement } of correos) {
        resultado = resultado.replace(pattern, replacement);
    }
    
    return resultado;
}

// ================================================================================
// 📊 EXTRAÇÃO DE VALORES
// ================================================================================

function extrairValores(texto) {
    const valores = [];
    const linhas = texto.split('\n');
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        const match = linha.match(/R\$\s*([\d.,]+)/);
        
        if (match) {
            const valor = match[1];
            const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
            
            valores.push({
                valor,
                valorNum,
                linha,
                indice: i
            });
        }
    }
    
    return valores;
}

// ================================================================================
// 🔧 UTILIDADES
// ================================================================================

function adicionarParcelamentoAposValor(texto, indiceLinha, linhaParcelamento) {
    const linhas = texto.split('\n');
    
    // Verificar se já existe parcelamento na sequência
    for (let i = indiceLinha + 1; i < linhas.length; i++) {
        if (linhas[i].includes('💳')) {
            linhas[i] = linhaParcelamento;
            return linhas.join('\n');
        } else if (linhas[i].trim() !== '' && !linhas[i].includes('✅')) {
            // Inserir antes desta linha
            linhas.splice(i, 0, linhaParcelamento);
            return linhas.join('\n');
        }
    }
    
    // Se não encontrou local, adicionar após o valor
    linhas.splice(indiceLinha + 1, 0, linhaParcelamento);
    return linhas.join('\n');
}

function formatarValor(numero) {
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ================================================================================
// ✅ VALIDAÇÃO DE PREÇOS
// ================================================================================

function validarPrecos(texto) {
    const validacao = {
        valido: true,
        avisos: [],
        erros: []
    };
    
    try {
        const valores = extrairValores(texto);
        
        if (valores.length === 0) {
            validacao.avisos.push('Nenhum valor encontrado no texto');
        }
        
        // Verificar valores muito baixos ou altos
        for (const { valorNum, valor } of valores) {
            if (valorNum < 10) {
                validacao.avisos.push(`Valor muito baixo: R$ ${valor}`);
            } else if (valorNum > 50000) {
                validacao.avisos.push(`Valor muito alto: R$ ${valor}`);
            }
        }
        
        // Verificar consistência de parcelamento
        const linhasParcelamento = texto.match(/💳[^\n]+/g);
        if (linhasParcelamento && linhasParcelamento.length > 1) {
            validacao.avisos.push('Múltiplas linhas de parcelamento encontradas');
        }
        
    } catch (error) {
        validacao.erros.push('Erro na validação de preços');
        validacao.valido = false;
    }
    
    return validacao;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    processarPrecos,
    extrairValores,
    formatarValor
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Price Processor v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('💰 Funcionalidades: parcelamento com entrada, selecionado, padronização');
