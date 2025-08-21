// api/processors/date-processor.js - PROCESSADOR DE DATAS v4.0
// ================================================================================
// 📅 REMOVE DIAS DA SEMANA E PADRONIZA FORMATO DE DATAS
// 🎯 Regra: "ter, 27/01" → "27/01" | "27 de janeiro" → "27/01"
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// 📅 MAPEAMENTO DE MESES
// ================================================================================

const MESES = {
    'janeiro': '01', 'jan': '01',
    'fevereiro': '02', 'fev': '02', 'feveiro': '02',
    'março': '03', 'mar': '03', 'marco': '03',
    'abril': '04', 'abr': '04',
    'maio': '05', 'mai': '05',
    'junho': '06', 'jun': '06',
    'julho': '07', 'jul': '07',
    'agosto': '08', 'ago': '08',
    'setembro': '09', 'set': '09', 'sep': '09',
    'outubro': '10', 'out': '10', 'oct': '10',
    'novembro': '11', 'nov': '11',
    'dezembro': '12', 'dez': '12', 'dec': '12'
};

const DIAS_SEMANA = [
    'segunda-feira', 'segunda', 'seg',
    'terça-feira', 'terça', 'terca', 'ter',
    'quarta-feira', 'quarta', 'qua',
    'quinta-feira', 'quinta', 'qui',
    'sexta-feira', 'sexta', 'sex',
    'sábado', 'sabado', 'sáb', 'sab',
    'domingo', 'dom'
];

// ================================================================================
// 📅 PROCESSADOR PRINCIPAL DE DATAS
// ================================================================================

/**
 * Processa todas as datas no texto removendo dias da semana e padronizando formato
 * @param {string} texto - Texto com datas a serem processadas
 * @returns {string} Texto com datas padronizadas
 */
export function processarDatas(texto) {
    if (!texto || typeof texto !== 'string') {
        console.warn('⚠️ Date Processor: Texto inválido recebido');
        return texto || '';
    }
    
    console.log('📅 Iniciando processamento de datas...');
    
    let resultado = texto;
    let processamentos = 0;
    
    try {
        // 1. REMOVER DIAS DA SEMANA BÁSICOS
        resultado = removerDiasSemanaBasicos(resultado);
        processamentos++;
        
        // 2. CONVERTER DATAS EXTENSAS
        resultado = converterDatasExtensas(resultado);
        processamentos++;
        
        // 3. PADRONIZAR FORMATOS VARIADOS
        resultado = padronizarFormatosVariados(resultado);
        processamentos++;
        
        // 4. LIMPAR FORMATAÇÕES REDUNDANTES
        resultado = limparFormatacoesDatas(resultado);
        processamentos++;
        
        console.log(`✅ Date Processor: ${processamentos} etapas concluídas`);
        
        // Log de diferenças se houver mudanças significativas
        if (resultado !== texto) {
            const diferencas = contarDiferencas(texto, resultado);
            console.log(`📊 Date Processor: ${diferencas} alterações aplicadas`);
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Date Processor: Erro no processamento:', error);
        return texto; // Retorna original em caso de erro
    }
}

// ================================================================================
// 🗑️ REMOÇÃO DE DIAS DA SEMANA BÁSICOS
// ================================================================================

function removerDiasSemanaBasicos(texto) {
    let resultado = texto;
    
    console.log('🗑️ Removendo dias da semana básicos...');
    
    // Padrão: "seg, 27/01" → "27/01"
    for (const dia of DIAS_SEMANA) {
        const patterns = [
            // Com vírgula: "seg, 27/01"
            new RegExp(`\\b${dia},?\\s*(\\d{1,2}\\/\\d{2})`, 'gi'),
            // Sem vírgula: "seg 27/01" 
            new RegExp(`\\b${dia}\\s+(\\d{1,2}\\/\\d{2})`, 'gi'),
            // Entre parênteses: "(seg) 27/01"
            new RegExp(`\\(${dia}\\)\\s*(\\d{1,2}\\/\\d{2})`, 'gi'),
            // Com hífen: "seg - 27/01"
            new RegExp(`\\b${dia}\\s*-\\s*(\\d{1,2}\\/\\d{2})`, 'gi')
        ];
        
        for (const pattern of patterns) {
            const matches = resultado.match(pattern);
            if (matches) {
                console.log(`🗑️ Removendo "${dia}" de ${matches.length} ocorrências`);
                resultado = resultado.replace(pattern, '$1');
            }
        }
    }
    
    return resultado;
}

// ================================================================================
// 📝 CONVERSÃO DE DATAS EXTENSAS
// ================================================================================

function converterDatasExtensas(texto) {
    let resultado = texto;
    
    console.log('📝 Convertendo datas extensas...');
    
    // Padrão: "27 de janeiro" → "27/01"
    // Incluir remoção de dias da semana se presentes
    for (const [mesNome, mesNum] of Object.entries(MESES)) {
        const patterns = [
            // Com dia da semana: "ter, 27 de janeiro"
            new RegExp(`(?:${DIAS_SEMANA.join('|')}),?\\s*(\\d{1,2})\\s+de\\s+${mesNome}`, 'gi'),
            // Sem dia da semana: "27 de janeiro"
            new RegExp(`\\b(\\d{1,2})\\s+de\\s+${mesNome}`, 'gi'),
            // Formato alternativo: "27/janeiro"
            new RegExp(`\\b(\\d{1,2})\\/${mesNome}`, 'gi'),
            // Com ano: "27 de janeiro de 2025"
            new RegExp(`\\b(\\d{1,2})\\s+de\\s+${mesNome}\\s+de\\s+\\d{4}`, 'gi')
        ];
        
        for (const pattern of patterns) {
            const matches = resultado.match(pattern);
            if (matches) {
                console.log(`📝 Convertendo datas com "${mesNome}" (${matches.length} ocorrências)`);
                resultado = resultado.replace(pattern, (match, dia) => {
                    const diaFormatado = dia.padStart(2, '0');
                    return `${diaFormatado}/${mesNum}`;
                });
            }
        }
    }
    
    return resultado;
}

// ================================================================================
// 🔧 PADRONIZAÇÃO DE FORMATOS VARIADOS
// ================================================================================

function padronizarFormatosVariados(texto) {
    let resultado = texto;
    
    console.log('🔧 Padronizando formatos variados...');
    
    // Padrões a corrigir
    const padroes = [
        // "27.01" → "27/01"
        {
            pattern: /\b(\d{1,2})\.(\d{2})\b/g,
            replacement: '$1/$2',
            nome: 'ponto para barra'
        },
        // "27-01" → "27/01"
        {
            pattern: /\b(\d{1,2})-(\d{2})\b/g,
            replacement: '$1/$2',
            nome: 'hífen para barra'
        },
        // "27 / 01" → "27/01"
        {
            pattern: /\b(\d{1,2})\s*\/\s*(\d{2})\b/g,
            replacement: '$1/$2',
            nome: 'espaços na barra'
        },
        // Garantir zero à esquerda: "7/01" → "07/01"
        {
            pattern: /\b(\d{1})\/(\d{2})\b/g,
            replacement: '0$1/$2',
            nome: 'zero à esquerda'
        }
    ];
    
    for (const { pattern, replacement, nome } of padroes) {
        const matches = resultado.match(pattern);
        if (matches) {
            console.log(`🔧 Aplicando "${nome}" (${matches.length} ocorrências)`);
            resultado = resultado.replace(pattern, replacement);
        }
    }
    
    return resultado;
}

// ================================================================================
// 🧹 LIMPEZA DE FORMATAÇÕES REDUNDANTES
// ================================================================================

function limparFormatacoesDatas(texto) {
    let resultado = texto;
    
    console.log('🧹 Limpando formatações redundantes...');
    
    // Remover textos desnecessários ao redor das datas
    const limpezas = [
        // "Embarque em 27/01" → "Embarque: 27/01"
        { pattern: /embarque\s+em\s+(\d{2}\/\d{2})/gi, replacement: 'Embarque: $1' },
        // "Data: dia 27/01" → "Data: 27/01"
        { pattern: /data:\s*dia\s+(\d{2}\/\d{2})/gi, replacement: 'Data: $1' },
        // "No dia 27/01" → "27/01"
        { pattern: /no\s+dia\s+(\d{2}\/\d{2})/gi, replacement: '$1' },
        // Remover duplicações: "27/01 27/01" → "27/01"
        { pattern: /(\d{2}\/\d{2})\s+\1/g, replacement: '$1' }
    ];
    
    for (const { pattern, replacement } of limpezas) {
        const antes = resultado;
        resultado = resultado.replace(pattern, replacement);
        
        if (resultado !== antes) {
            console.log('🧹 Limpeza aplicada');
        }
    }
    
    return resultado;
}

// ================================================================================
// 📊 UTILIDADES DE ANÁLISE
// ================================================================================

function contarDiferencas(textoOriginal, textoProcessado) {
    const linhasOriginais = textoOriginal.split('\n');
    const linhasProcessadas = textoProcessado.split('\n');
    
    let diferencas = 0;
    
    for (let i = 0; i < Math.max(linhasOriginais.length, linhasProcessadas.length); i++) {
        const original = linhasOriginais[i] || '';
        const processada = linhasProcessadas[i] || '';
        
        if (original !== processada) {
            diferencas++;
        }
    }
    
    return diferencas;
}

/**
 * Valida se uma string é uma data válida no formato DD/MM
 * @param {string} data - Data no formato DD/MM
 * @returns {boolean} Se a data é válida
 */
export function validarData(data) {
    if (!data || typeof data !== 'string') return false;
    
    const match = data.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]);
    
    return dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12;
}

/**
 * Extrai todas as datas válidas do texto
 * @param {string} texto - Texto para extrair datas
 * @returns {Array} Array de datas encontradas
 */
export function extrairDatas(texto) {
    if (!texto) return [];
    
    const datas = [];
    const matches = texto.match(/\d{2}\/\d{2}/g);
    
    if (matches) {
        for (const match of matches) {
            if (validarData(match) && !datas.includes(match)) {
                datas.push(match);
            }
        }
    }
    
    return datas;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    processarDatas,
    validarData,
    extrairDatas
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Date Processor v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('📅 Funcionalidades: remoção dias da semana, conversão datas extensas, padronização');
