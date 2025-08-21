// api/processors/format-processor.js - PROCESSADOR DE FORMATAÇÃO FINAL v4.0
// ================================================================================
// 🔧 FORMATAÇÃO FINAL, VERSÃO E LIMPEZA GERAL
// 🎯 Regra: (+1) apenas volta Orlando ≤ 08h | Versão v4.0 | Limpeza final
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// 🔧 PROCESSADOR PRINCIPAL DE FORMATAÇÃO
// ================================================================================

/**
 * Aplica formatação final, (+1), versão e limpeza geral
 * @param {string} texto - Texto a ser formatado
 * @param {Object} dadosExtraidos - Dados extraídos do orçamento
 * @returns {string} Texto com formatação final
 */
export function processarFormatacaoFinal(texto, dadosExtraidos = {}) {
    if (!texto || typeof texto !== 'string') {
        console.warn('⚠️ Format Processor: Texto inválido recebido');
        return texto || '';
    }
    
    console.log('🔧 Iniciando formatação final...');
    
    let resultado = texto;
    let processamentos = 0;
    
    try {
        // 1. APLICAR REGRA (+1) PARA VOLTA ORLANDO
        resultado = aplicarMaisDiaOrlando(resultado);
        processamentos++;
        
        // 2. CORRIGIR REEMBOLSO
        resultado = corrigirReembolso(resultado, dadosExtraidos);
        processamentos++;
        
        // 3. LIMPAR LINKS E FORMATAÇÃO
        resultado = limparLinksEFormatacao(resultado);
        processamentos++;
        
        // 4. GARANTIR VERSÃO CORRETA
        resultado = garantirVersaoCorreta(resultado);
        processamentos++;
        
        // 5. LIMPEZA FINAL E ESPAÇAMENTOS
        resultado = limpezaFinal(resultado);
        processamentos++;
        
        console.log(`✅ Format Processor: ${processamentos} etapas concluídas`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Format Processor: Erro no processamento:', error);
        return texto; // Retorna original em caso de erro
    }
}

// ================================================================================
// 🌅 APLICAÇÃO DE (+1) PARA VOLTA ORLANDO
// ================================================================================

function aplicarMaisDiaOrlando(texto) {
    let resultado = texto;
    
    console.log('🌅 Verificando regra (+1) para volta Orlando...');
    
    const linhas = resultado.split('\n');
    let aplicacoes = 0;
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Verificar se é linha de voo (tem formato: origem - hora / destino - hora)
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            const match = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            
            if (match) {
                const horaChegada = parseInt(match[3]);
                
                // REGRA ESPECÍFICA: (+1) APENAS para volta de Orlando
                const ehVoltaOrlando = linha.includes('Orlando') && 
                                      linha.includes('Guarulhos') && 
                                      linha.indexOf('Orlando') < linha.indexOf('Guarulhos');
                
                // E chegada entre 00h e 08h (madrugada)
                if (ehVoltaOrlando && horaChegada <= 8) {
                    console.log(`🌅 Aplicando (+1) para volta Orlando: ${linha.substring(0, 50)}...`);
                    
                    // Aplicar (+1) no horário de chegada, antes dos parênteses se existirem
                    linhas[i] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))?$/, '$1 (+1)$2');
                    aplicacoes++;
                }
            }
        }
    }
    
    if (aplicacoes > 0) {
        console.log(`🌅 (+1) aplicado em ${aplicacoes} linha(s)`);
    } else {
        console.log('🌅 Nenhuma volta Orlando ≤ 08h encontrada');
    }
    
    return linhas.join('\n');
}

// ================================================================================
// 🏷️ CORREÇÃO DE REEMBOLSO
// ================================================================================

function corrigirReembolso(texto, dadosExtraidos) {
    let resultado = texto;
    
    console.log('🏷️ Corrigindo informações de reembolso...');
    
    // Determinar tipo de reembolso baseado no conteúdo
    let tipoReembolso = 'Não reembolsável'; // padrão
    
    const textoLower = texto.toLowerCase();
    
    // Detectar se é reembolsável
    if (textoLower.includes('reembolsável') && !textoLower.includes('não reembolsável')) {
        tipoReembolso = 'Reembolsável conforme regras do bilhete';
    }
    
    // Detectar preferencial (geralmente é reembolsável)
    if (textoLower.includes('preferencial')) {
        tipoReembolso = 'Reembolsável conforme regras do bilhete';
    }
    
    // Aplicar ou substituir linha de reembolso
    const linhas = resultado.split('\n');
    let reembolsoAplicado = false;
    
    // Procurar linha existente de reembolso
    for (let i = 0; i < linhas.length; i++) {
        if (linhas[i].includes('🏷️')) {
            linhas[i] = `🏷️ ${tipoReembolso}`;
            reembolsoAplicado = true;
            console.log('🏷️ Linha de reembolso substituída');
            break;
        }
    }
    
    // Se não encontrou, adicionar antes da versão
    if (!reembolsoAplicado) {
        const indiceVersao = linhas.findIndex(linha => linha.includes('Valores sujeitos'));
        if (indiceVersao > 0) {
            linhas.splice(indiceVersao, 0, `🏷️ ${tipoReembolso}`);
            console.log('🏷️ Linha de reembolso adicionada');
        } else {
            // Adicionar antes do final
            linhas.splice(-1, 0, `🏷️ ${tipoReembolso}`);
            console.log('🏷️ Linha de reembolso adicionada ao final');
        }
    }
    
    return linhas.join('\n');
}

// ================================================================================
// 🔗 LIMPEZA DE LINKS E FORMATAÇÃO
// ================================================================================

function limparLinksEFormatacao(texto) {
    let resultado = texto;
    
    console.log('🔗 Limpando links e formatação...');
    
    // 1. CONVERTER MARKDOWN LINKS PARA LINKS DIRETOS
    resultado = resultado.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
    
    // 2. REMOVER LINKS GENÉRICOS DA CVC
    const linksGenericos = [
        /🔗 https:\/\/www\.cvc\.com\.br\s*$/gm,
        /🔗 www\.cvc\.com\.br\s*$/gm,
        /🔗 cvc\.com\.br\s*$/gm
    ];
    
    for (const linkGenerico of linksGenericos) {
        resultado = resultado.replace(linkGenerico, '');
    }
    
    // 3. LIMPAR FORMATAÇÃO MARKDOWN RESIDUAL
    resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
    resultado = resultado.replace(/\*\*\*([^*]+)\*\*\*/g, '$1'); // Bold + italic
    resultado = resultado.replace(/~~([^~]+)~~/g, '$1'); // Strikethrough
    
    // 4. REMOVER DUPLICAÇÕES DE PARÊNTESES
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    
    // 5. CORRIGIR TIPOS DE VOO DUPLICADOS
    resultado = resultado.replace(/\(voo\s+voo direto\)/g, '(voo direto)');
    resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
    
    return resultado;
}

// ================================================================================
// 📌 GARANTIR VERSÃO CORRETA
// ================================================================================

function garantirVersaoCorreta(texto) {
    const versaoCorreta = `Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`;
    
    console.log(`📌 Garantindo versão ${SYSTEM_CONFIG.VERSION}...`);
    
    let resultado = texto;
    
    // Remover todas as versões antigas e duplicações
    resultado = resultado.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
    resultado = resultado.replace(/Valores sujeitos a confirmação e disponibilidade/g, '');
    resultado = resultado.replace(/\(v[\d.]+\)/g, '');
    
    // Remover linhas vazias extras criadas pela remoção
    resultado = resultado.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Adicionar versão correta UMA ÚNICA VEZ no final
    if (!resultado.includes(versaoCorreta)) {
        resultado = resultado.trim() + '\n\n' + versaoCorreta;
        console.log(`📌 Versão ${SYSTEM_CONFIG.VERSION} adicionada`);
    }
    
    return resultado;
}

// ================================================================================
// 🧹 LIMPEZA FINAL
// ================================================================================

function limpezaFinal(texto) {
    let resultado = texto;
    
    console.log('🧹 Aplicando limpeza final...');
    
    // 1. CORRIGIR ESPAÇAMENTOS ENTRE ELEMENTOS
    // Garantir uma linha entre seções principais
    resultado = resultado.replace(/(💰[^\n]+)\n(✅)/g, '$1\n$2');
    resultado = resultado.replace(/(💳[^\n]+)\n(✅)/g, '$1\n$2');
    resultado = resultado.replace(/(✅[^\n]+)\n(🏷️)/g, '$1\n$2');
    resultado = resultado.replace(/(💺[^\n]+)\n(🏷️)/g, '$1\n$2');
    
    // 2. REMOVER MÚLTIPLAS QUEBRAS DE LINHA
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // 3. REMOVER ESPAÇOS NO INÍCIO E FIM DAS LINHAS
    const linhas = resultado.split('\n');
    const linhasLimpas = linhas.map(linha => linha.trimEnd());
    resultado = linhasLimpas.join('\n');
    
    // 4. GARANTIR SEPARADOR CORRETO ENTRE IDA E VOLTA
    resultado = resultado.replace(/\n--\n/g, '\n--\n');
    resultado = resultado.replace(/--\s*\n\s*--/g, '--');
    
    // 5. CORRIGIR EMOJIS COM ESPAÇAMENTO
    resultado = resultado.replace(/💰\s{2,}/g, '💰 ');
    resultado = resultado.replace(/💳\s{2,}/g, '💳 ');
    resultado = resultado.replace(/✅\s{2,}/g, '✅ ');
    resultado = resultado.replace(/🏷️\s{2,}/g, '🏷️ ');
    resultado = resultado.replace(/💺\s{2,}/g, '💺 ');
    
    // 6. LIMPAR FINAL DO TEXTO
    resultado = resultado.trim();
    
    return resultado;
}

// ================================================================================
// 📊 VALIDAÇÃO FINAL
// ================================================================================

/**
 * Valida a estrutura final do orçamento
 * @param {string} texto - Texto para validar
 * @returns {Object} Resultado da validação
 */
export function validarEstrutura(texto) {
    const validacao = {
        valido: true,
        avisos: [],
        erros: [],
        elementos: {
            titulo: false,
            valor: false,
            versao: false
        }
    };
    
    try {
        // Verificar elementos essenciais
        validacao.elementos.titulo = /\*[^*]+\*/m.test(texto);
        validacao.elementos.valor = /💰.*R\$/.test(texto);
        validacao.elementos.versao = texto.includes(`(v${SYSTEM_CONFIG.VERSION})`);
        
        // Verificar problemas comuns
        if (!validacao.elementos.titulo) {
            validacao.erros.push('Título em negrito não encontrado');
            validacao.valido = false;
        }
        
        if (!validacao.elementos.valor) {
            validacao.erros.push('Valor principal não encontrado');
            validacao.valido = false;
        }
        
        if (!validacao.elementos.versao) {
            validacao.avisos.push('Versão incorreta ou ausente');
        }
        
        // Verificar (+1) desnecessários
        const maisUmLinhas = texto.match(/\(+1\)/g);
        if (maisUmLinhas && maisUmLinhas.length > 1) {
            validacao.avisos.push('Múltiplos (+1) encontrados - verificar se correto');
        }
        
        // Verificar linhas duplicadas
        const linhas = texto.split('\n').filter(l => l.trim());
        const linhasUnicas = [...new Set(linhas)];
        if (linhas.length !== linhasUnicas.length) {
            validacao.avisos.push('Possíveis linhas duplicadas detectadas');
        }
        
    } catch (error) {
        validacao.erros.push('Erro na validação da estrutura');
        validacao.valido = false;
    }
    
    return validacao;
}

/**
 * Gera estatísticas do texto processado
 * @param {string} texto - Texto para analisar
 * @returns {Object} Estatísticas do texto
 */
export function gerarEstatisticas(texto) {
    if (!texto) return null;
    
    return {
        caracteres: texto.length,
        linhas: texto.split('\n').length,
        palavras: texto.split(' ').length,
        temTitulo: /\*[^*]+\*/m.test(texto),
        temValor: /💰.*R\$/.test(texto),
        temParcelamento: /💳/.test(texto),
        temBagagem: /✅/.test(texto),
        temReembolso: /🏷️/.test(texto),
        temVersao: texto.includes(`v${SYSTEM_CONFIG.VERSION}`),
        temMaisUm: /\(+1\)/.test(texto)
    };
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    processarFormatacaoFinal,
    validarEstrutura,
    gerarEstatisticas
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Format Processor v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('🔧 Funcionalidades: (+1) Orlando, reembolso, links, versão, limpeza');
