// api/processors/airport-processor.js - PROCESSADOR DE AEROPORTOS v4.0
// ================================================================================
// ✈️ CONVERTE CÓDIGOS DE AEROPORTO PARA NOMES COMPLETOS
// 🎯 Regra: "GRU" → "Guarulhos" | Busca online se não encontrar
// ================================================================================

import { SYSTEM_CONFIG, AEROPORTOS_BASICOS } from '../data/constants.js';

// ================================================================================
// ✈️ PROCESSADOR PRINCIPAL DE AEROPORTOS
// ================================================================================

/**
 * Converte todos os códigos de aeroporto para nomes completos
 * @param {string} texto - Texto com códigos de aeroporto
 * @param {string} conteudoOriginal - Conteúdo original para contexto
 * @returns {Promise<string>} Texto com nomes de aeroportos
 */
export async function processarAeroportos(texto, conteudoOriginal = '') {
    if (!texto || typeof texto !== 'string') {
        console.warn('⚠️ Airport Processor: Texto inválido recebido');
        return texto || '';
    }
    
    console.log('✈️ Iniciando processamento de aeroportos...');
    
    let resultado = texto;
    let conversoes = 0;
    
    try {
        // 1. CONVERSÕES LOCAIS (TABELA INTERNA)
        const { resultado: textoLocal, conversoes: conversoesLocais } = converterAeroportosLocais(resultado);
        resultado = textoLocal;
        conversoes += conversoesLocais;
        
        // 2. BUSCA ONLINE PARA CÓDIGOS NÃO ENCONTRADOS
        const codigosRestantes = encontrarCodigosNaoConvertidos(resultado);
        
        if (codigosRestantes.length > 0 && process.env.OPENAI_API_KEY) {
            console.log(`🔍 Buscando online: ${codigosRestantes.join(', ')}`);
            
            const { resultado: textoOnline, conversoes: conversoesOnline } = await converterAeroportosOnline(resultado, codigosRestantes);
            resultado = textoOnline;
            conversoes += conversoesOnline;
        }
        
        // 3. VALIDAÇÃO FINAL
        const codigosFinais = encontrarCodigosNaoConvertidos(resultado);
        if (codigosFinais.length > 0) {
            console.warn(`⚠️ Códigos não convertidos: ${codigosFinais.join(', ')}`);
        }
        
        console.log(`✅ Airport Processor: ${conversoes} conversões realizadas`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Airport Processor: Erro no processamento:', error);
        return texto; // Retorna original em caso de erro
    }
}

// ================================================================================
// 🏠 CONVERSÕES LOCAIS (TABELA INTERNA)
// ================================================================================

function converterAeroportosLocais(texto) {
    let resultado = texto;
    let conversoes = 0;
    
    console.log('🏠 Aplicando conversões locais...');
    
    // Iterar por todos os aeroportos da tabela
    for (const [codigo, nome] of Object.entries(AEROPORTOS_BASICOS)) {
        // Padrões de busca mais específicos para evitar conversões indevidas
        const patterns = [
            // Código isolado: " GRU " ou "GRU," ou "GRU."
            new RegExp(`\\b${codigo}\\b(?=\\s|,|\\.|$|\\n)`, 'g'),
            // Em contexto de aeroporto: "Aeroporto GRU"
            new RegExp(`aeroporto\\s+${codigo}\\b`, 'gi'),
            // Entre parênteses: "(GRU)"
            new RegExp(`\\(${codigo}\\)`, 'g'),
            // Com hífen: "São Paulo - GRU"
            new RegExp(`\\s-\\s${codigo}\\b`, 'g')
        ];
        
        for (const pattern of patterns) {
            const matches = resultado.match(pattern);
            if (matches) {
                console.log(`🏠 Convertendo ${codigo} → ${nome} (${matches.length} ocorrências)`);
                
                // Aplicar conversão mantendo contexto
                resultado = resultado.replace(pattern, (match) => {
                    conversoes++;
                    
                    if (match.includes('aeroporto')) {
                        return match.replace(codigo, nome);
                    } else if (match.includes('(')) {
                        return `(${nome})`;
                    } else if (match.includes(' - ')) {
                        return ` - ${nome}`;
                    } else {
                        return match.replace(codigo, nome);
                    }
                });
            }
        }
    }
    
    return { resultado, conversoes };
}

// ================================================================================
// 🌐 CONVERSÕES ONLINE (API EXTERNA)
// ================================================================================

async function converterAeroportosOnline(texto, codigos) {
    let resultado = texto;
    let conversoes = 0;
    
    console.log('🌐 Iniciando busca online de aeroportos...');
    
    // Buscar códigos em lotes para otimizar
    const lotes = criarLotesCodigoss(codigos, 3); // 3 códigos por busca
    
    for (const lote of lotes) {
        try {
            const resultadosLote = await buscarLoteAeroportos(lote);
            
            // Aplicar conversões do lote
            for (const { codigo, nome } of resultadosLote) {
                if (nome && nome !== codigo) {
                    const regex = new RegExp(`\\b${codigo}\\b`, 'g');
                    const matches = resultado.match(regex);
                    
                    if (matches) {
                        console.log(`🌐 ${codigo} → ${nome} (online)`);
                        resultado = resultado.replace(regex, nome);
                        conversoes += matches.length;
                    }
                }
            }
            
            // Delay entre lotes para não sobrecarregar API
            if (lotes.indexOf(lote) < lotes.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
        } catch (error) {
            console.error(`❌ Erro na busca online do lote:`, error);
        }
    }
    
    return { resultado, conversoes };
}

// ================================================================================
// 🔍 BUSCA DE AEROPORTO INDIVIDUAL ONLINE
// ================================================================================

async function buscarLoteAeroportos(codigos) {
    try {
        const prompt = `Converta estes códigos de aeroporto para nomes de cidade:

CÓDIGOS: ${codigos.join(', ')}

RESPONDA EXATAMENTE assim:
${codigos.map(codigo => `${codigo}: [nome da cidade]`).join('\n')}

Se não souber algum código, responda: ${codigos.map(codigo => `${codigo}: ${codigo}`).join('\n')}

Exemplo:
MCO: Orlando
GRU: Guarulhos
XYZ: XYZ`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0,
                max_tokens: 200
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const resposta = data.choices[0].message.content.trim();
        
        // Processar resposta
        const resultados = [];
        const linhas = resposta.split('\n');
        
        for (const linha of linhas) {
            const match = linha.match(/([A-Z]{3}):\s*(.+)/);
            if (match) {
                const codigo = match[1];
                const nome = match[2].trim();
                resultados.push({ codigo, nome });
            }
        }
        
        return resultados;
        
    } catch (error) {
        console.error('❌ Erro na busca online:', error);
        // Retornar códigos sem conversão em caso de erro
        return codigos.map(codigo => ({ codigo, nome: codigo }));
    }
}

// ================================================================================
// 🔍 DETECÇÃO DE CÓDIGOS NÃO CONVERTIDOS
// ================================================================================

function encontrarCodigosNaoConvertidos(texto) {
    // Buscar padrões de 3 letras maiúsculas que podem ser códigos de aeroporto
    const matches = texto.match(/\b[A-Z]{3}\b/g);
    
    if (!matches) return [];
    
    // Filtrar códigos únicos e remover falsos positivos conhecidos
    const codigosUnicos = [...new Set(matches)];
    const falsosPositivos = ['CVC', 'CPF', 'RNC', 'PDF', 'JPG', 'PNG', 'USD', 'EUR', 'BRL'];
    
    return codigosUnicos.filter(codigo => 
        !falsosPositivos.includes(codigo) &&
        !AEROPORTOS_BASICOS[codigo] // Não está na tabela local
    );
}

// ================================================================================
// 🔧 UTILIDADES
// ================================================================================

function criarLotesCodigoss(array, tamanho) {
    const lotes = [];
    for (let i = 0; i < array.length; i += tamanho) {
        lotes.push(array.slice(i, i + tamanho));
    }
    return lotes;
}

/**
 * Valida se um código parece ser um código de aeroporto válido
 * @param {string} codigo - Código a ser validado
 * @returns {boolean} Se o código é válido
 */
export function validarCodigoAeroporto(codigo) {
    if (!codigo || typeof codigo !== 'string') return false;
    
    // Código deve ter exatamente 3 letras maiúsculas
    return /^[A-Z]{3}$/.test(codigo);
}

/**
 * Extrai todos os possíveis códigos de aeroporto do texto
 * @param {string} texto - Texto para extrair códigos
 * @returns {Array} Array de códigos encontrados
 */
export function extrairCodigosAeroporto(texto) {
    if (!texto) return [];
    
    const matches = texto.match(/\b[A-Z]{3}\b/g);
    if (!matches) return [];
    
    return [...new Set(matches)].filter(validarCodigoAeroporto);
}

/**
 * Verifica se o texto contém códigos de aeroporto não convertidos
 * @param {string} texto - Texto a ser verificado
 * @returns {boolean} Se há códigos não convertidos
 */
export function temCodigosNaoConvertidos(texto) {
    const codigos = encontrarCodigosNaoConvertidos(texto);
    return codigos.length > 0;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    processarAeroportos,
    validarCodigoAeroporto,
    extrairCodigosAeroporto,
    temCodigosNaoConvertidos
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Airport Processor v${SYSTEM_CONFIG.VERSION} carregado`);
console.log(`✈️ Aeroportos na base local: ${Object.keys(AEROPORTOS_BASICOS).length}`);
console.log('🌐 Busca online habilitada:', !!process.env.OPENAI_API_KEY);
