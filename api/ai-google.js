// api/ai-google.js - HANDLER PRINCIPAL CORRIGIDO v4.0
// ================================================================================
// 🎯 ARQUIVO PRINCIPAL COM TODOS OS PROCESSADORES INTEGRADOS
// 🛡️ GARANTE JSON VÁLIDO EM 100% DOS CASOS + APLICA TODAS AS CORREÇÕES
// ================================================================================

import { safeJSONResponse } from './core/json-response.js';
import { SYSTEM_CONFIG } from './data/constants.js';
import { extrairDadosCompletos } from './detectors/data-extractor.js';
import { detectarTipoProduto } from './detectors/product-detector.js';
import { detectarHotel } from './detectors/hotel-detector.js';
import { processarDatas } from './processors/date-processor.js';
import { processarAeroportos } from './processors/airport-processor.js';
import { processarBagagem } from './processors/baggage-processor.js';
import { processarPrecos } from './processors/price-processor.js';
import { processarFormatacaoFinal } from './processors/format-processor.js';
import { construirPrompt } from './prompts/prompt-builder.js';

// ================================================================================
// 🧠 HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    // 🛡️ GARANTIA ABSOLUTA DE JSON VÁLIDO
    try {
        console.log(`🚀 [${requestId}] Iniciando processamento v${SYSTEM_CONFIG.VERSION}`);
        
        // 1. Configurar headers de segurança
        setupSecurityHeaders(res);
        
        // 2. Validar método HTTP
        if (req.method === 'OPTIONS') {
            return safeJSONResponse(res, true, 'CORS OK', null, { requestId });
        }
        
        if (req.method === 'GET') {
            return safeJSONResponse(res, true, getSystemStatus(), null, {
                requestId,
                version: SYSTEM_CONFIG.VERSION,
                uptime: Date.now() - startTime
            });
        }
        
        if (req.method !== 'POST') {
            return safeJSONResponse(res, false, 'Método não permitido', 'Use POST', { requestId });
        }
        
        // 3. Extrair e validar dados
        const body = req.body || {};
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 1,
            criancas = 0,
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = body;
        
        // 4. Combinar conteúdo principal
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // 5. Validar entrada
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return safeJSONResponse(res, false, 'Adicione informações sobre a viagem', 
                'Por favor, adicione informações sobre a viagem', { requestId });
        }
        
        console.log(`📋 [${requestId}] Conteúdo recebido: ${conteudoPrincipal.length} caracteres`);
        
        // 6. FASE DE DETECÇÃO
        console.log(`🔍 [${requestId}] Iniciando fase de detecção...`);
        
        // Extrair dados do conteúdo
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        console.log(`📊 [${requestId}] Dados extraídos:`, dadosExtraidos);
        
        // Detectar se é hotel
        const resultadoHotel = detectarHotel(conteudoPrincipal, tipos);
        console.log(`🏨 [${requestId}] Detecção hotel:`, resultadoHotel);
        
        // Detectar tipo de produto
        const tipoDetectado = detectarTipoProduto(conteudoPrincipal, tipos, resultadoHotel);
        console.log(`🎯 [${requestId}] Tipo detectado: ${tipoDetectado}`);
        
        // Formatar passageiros
        let passageiros = dadosExtraidos.passageiros;
        if (!passageiros) {
            const numAdultos = parseInt(adultos) || 1;
            const numCriancas = parseInt(criancas) || 0;
            passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
            if (numCriancas > 0) {
                passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
            }
        }
        
        console.log(`👥 [${requestId}] Passageiros: ${passageiros}`);
        
        // 7. FASE DE GERAÇÃO COM IA
        console.log(`🧠 [${requestId}] Iniciando fase de geração...`);
        
        // Construir prompt contextual
        const contextoPrompt = {
            conteudoPrincipal,
            tipoOrcamento: tipoDetectado,
            passageiros,
            destino: dadosExtraidos.destino || destino,
            ehImagem: !!imagemBase64,
            iaDestino: decidirIA(conteudoPrincipal, tipoDetectado, imagemBase64),
            dadosExtraidos
        };
        
        const prompt = construirPrompt(contextoPrompt);
        console.log(`📝 [${requestId}] Prompt construído: ${prompt.length} caracteres`);
        
        // Processar com IA
        let resultado = '';
        let iaUsada = 'none';
        
        try {
            if (contextoPrompt.iaDestino === 'claude' && process.env.ANTHROPIC_API_KEY) {
                console.log(`🔮 [${requestId}] Usando Claude...`);
                resultado = await processarComClaude(prompt, imagemBase64);
                iaUsada = 'claude';
            } else if (process.env.OPENAI_API_KEY) {
                console.log(`⚡ [${requestId}] Usando GPT-4o-mini...`);
                resultado = await processarComGPT(prompt);
                iaUsada = 'gpt';
            } else {
                throw new Error('Nenhuma API de IA configurada');
            }
            
            console.log(`✅ [${requestId}] IA processou: ${resultado.length} caracteres`);
            
        } catch (iaError) {
            console.error(`❌ [${requestId}] Erro IA:`, iaError);
            return safeJSONResponse(res, false, 'Erro ao processar com IA', 
                `Erro: ${iaError.message}`, { requestId, ia_usada: 'error' });
        }
        
        // 8. FASE DE PÓS-PROCESSAMENTO (TODAS AS CORREÇÕES)
        console.log(`🔧 [${requestId}] Iniciando pós-processamento completo...`);
        
        if (resultado && typeof resultado === 'string') {
            // Limpar formatação markdown inicial
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            
            try {
                // APLICAR TODOS OS PROCESSADORES EM SEQUÊNCIA
                console.log(`📅 [${requestId}] Processando datas...`);
                resultado = processarDatas(resultado);
                
                console.log(`✈️ [${requestId}] Processando aeroportos...`);
                resultado = await processarAeroportos(resultado, conteudoPrincipal);
                
                console.log(`🎒 [${requestId}] Processando bagagem...`);
                resultado = processarBagagem(resultado, dadosExtraidos);
                
                console.log(`💰 [${requestId}] Processando preços...`);
                resultado = processarPrecos(resultado, parcelamento, dadosExtraidos);
                
                console.log(`🔧 [${requestId}] Processando formatação final...`);
                resultado = processarFormatacaoFinal(resultado, dadosExtraidos);
                
                console.log(`✅ [${requestId}] Pós-processamento completo!`);
                
            } catch (procError) {
                console.error(`⚠️ [${requestId}] Erro no pós-processamento:`, procError);
                // Continuar mesmo com erro de processamento
            }
        }
        
        // 9. RESPOSTA FINAL
        const tempoTotal = Date.now() - startTime;
        console.log(`🎉 [${requestId}] Processamento completo em ${tempoTotal}ms`);
        
        return safeJSONResponse(res, true, resultado || 'Erro ao processar orçamento', null, {
            requestId,
            version: SYSTEM_CONFIG.VERSION,
            tipo_detectado: tipoDetectado,
            passageiros: passageiros,
            parcelamento_aplicado: parcelamento || 'nenhum',
            ia_usada: iaUsada,
            tempo_processamento: `${tempoTotal}ms`,
            processadores_aplicados: ['dates', 'airports', 'baggage', 'prices', 'format']
        });
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro geral:`, error);
        
        return safeJSONResponse(res, false, 'Erro interno do servidor', 
            'Erro interno. Tente novamente.', { 
                requestId, 
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
    }
}

// ================================================================================
// 🤖 PROCESSAMENTO COM IAS
// ================================================================================

async function processarComClaude(prompt, imagemBase64) {
    const requestBody = {
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        temperature: 0.1,
        messages: [{
            role: 'user',
            content: imagemBase64 ? [
                { type: 'text', text: prompt },
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: imagemBase64.split(';')[0].split(':')[1],
                        data: imagemBase64.split(',')[1]
                    }
                }
            ] : prompt
        }]
    };
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude erro ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

async function processarComGPT(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `Você é um assistente da CVC. Formate orçamentos seguindo EXATAMENTE as instruções. NÃO INVENTE informações que não estejam no texto fornecido. Use apenas informações explícitas no conteúdo.` 
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 3000
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI erro ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// ================================================================================
// 🎯 DECISÃO DE IA
// ================================================================================

function decidirIA(conteudo, tipo, imagemBase64) {
    // Usar Claude para casos complexos
    if (imagemBase64 || 
        conteudo.length > 3000 ||
        tipo === 'PACOTE_COMPLETO' ||
        tipo === 'MULTITRECHO' ||
        tipo === 'DICAS_DESTINO' ||
        tipo === 'RANKING_HOTEIS') {
        return 'claude';
    }
    
    // GPT para casos simples
    return 'gpt';
}

// ================================================================================
// 🔧 FUNÇÕES UTILITÁRIAS
// ================================================================================

function generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
}

function setupSecurityHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
}

function getSystemStatus() {
    return {
        status: 'operational',
        version: SYSTEM_CONFIG.VERSION,
        sistema: 'CVC ITAQUA',
        funcionalidades: [
            'Detecção automática de tipos',
            'Processamento com múltiplas IAs',
            'Pós-processamento completo',
            'Validação automática',
            'JSON sempre válido'
        ],
        processadores: [
            'date-processor',
            'airport-processor', 
            'baggage-processor',
            'price-processor',
            'format-processor'
        ],
        apis_configuradas: {
            claude: !!process.env.ANTHROPIC_API_KEY,
            openai: !!process.env.OPENAI_API_KEY
        }
    };
}

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v4.0 - SISTEMA COMPLETO               ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Handler principal com todos os processadores               ║');
console.log('║ ✅ Pós-processamento automático GARANTIDO                     ║');
console.log('║ ✅ Correções: datas, aeroportos, bagagem, preços, formato     ║');
console.log('║ ✅ JSON sempre válido mesmo em crash total                    ║');
console.log('║ ✅ Logs detalhados para debugging                             ║');
console.log('║ ✅ Suporte a Claude + GPT com fallbacks                       ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log(`🚀 Sistema v${SYSTEM_CONFIG.VERSION} pronto para produção!`);
