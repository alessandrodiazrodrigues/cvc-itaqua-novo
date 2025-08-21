// api/ai-google.js - HANDLER PRINCIPAL v4.0 - NÚCLEO INQUEBRÁVEIS
// ================================================================================
// 🎯 ARQUIVO PRINCIPAL - ORQUESTRADOR DO SISTEMA
// ⚠️  ESTE ARQUIVO É PROTEGIDO - EDIÇÕES APENAS EM CASOS EXTREMOS
// 🛡️ GARANTE JSON VÁLIDO EM 100% DOS CASOS, MESMO EM CRASH TOTAL
// ================================================================================

import { safeJSONResponse } from './core/json-response.js';
import { SYSTEM_CONFIG, TEMPLATES_BASIC } from './data/constants.js';

// ================================================================================
// 🧠 NÚCLEO - ORQUESTRADOR PRINCIPAL
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
        
        // 3. Extrair e validar dados de entrada
        const inputData = await extractAndValidateInput(req, requestId);
        if (!inputData.valid) {
            return safeJSONResponse(res, false, inputData.error, inputData.details, { requestId });
        }
        
        // 4. Processar orçamento principal
        const result = await processOrcamento(inputData.data, requestId);
        
        // 5. Retornar resposta de sucesso
        return safeJSONResponse(res, true, result.content, null, {
            requestId,
            version: SYSTEM_CONFIG.VERSION,
            processingTime: Date.now() - startTime,
            type: result.type,
            aiUsed: result.aiUsed,
            tokensUsed: result.tokensUsed
        });
        
    } catch (error) {
        // 🚨 FALLBACK FINAL - GARANTE JSON MESMO EM CRASH TOTAL
        console.error(`💥 [${requestId}] ERRO CRÍTICO:`, error);
        
        return safeJSONResponse(res, false, 
            'Erro interno do sistema. Tente novamente.', 
            error.message, 
            {
                requestId,
                version: SYSTEM_CONFIG.VERSION,
                errorType: 'CRITICAL_SYSTEM_ERROR',
                timestamp: new Date().toISOString()
            }
        );
    }
}

// ================================================================================
// 🔧 FUNÇÕES DE APOIO PROTEGIDAS
// ================================================================================

function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function setupSecurityHeaders(res) {
    try {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('X-Powered-By', `CVC-ITAQUA-v${SYSTEM_CONFIG.VERSION}`);
    } catch (error) {
        console.error('❌ Erro ao configurar headers:', error);
        // Continua sem falhar - headers são opcionais
    }
}

function getSystemStatus() {
    return {
        status: 'operational',
        version: SYSTEM_CONFIG.VERSION,
        timestamp: new Date().toISOString(),
        features: {
            multipleFormats: true,
            hotelSupport: true,
            multipleCompanies: true,
            automaticCorrections: true,
            jsonGuaranteed: true
        },
        endpoints: {
            health: 'GET /',
            process: 'POST /'
        }
    };
}

async function extractAndValidateInput(req, requestId) {
    try {
        console.log(`📥 [${requestId}] Extraindo dados de entrada...`);
        
        // Extrair body de forma segura
        let body = {};
        try {
            body = req.body || {};
        } catch (bodyError) {
            console.error(`❌ [${requestId}] Erro ao extrair body:`, bodyError);
            return { valid: false, error: 'Formato de dados inválido', details: 'Body malformado' };
        }
        
        // Extrair campos com valores padrão seguros
        const data = {
            observacoes: String(body.observacoes || '').trim(),
            textoColado: String(body.textoColado || '').trim(),
            destino: String(body.destino || '').trim(),
            adultos: parseInt(body.adultos) || 1,
            criancas: parseInt(body.criancas) || 0,
            tipos: Array.isArray(body.tipos) ? body.tipos : [],
            parcelamento: String(body.parcelamento || '').trim(),
            imagemBase64: body.imagemBase64 || null,
            pdfContent: String(body.pdfContent || '').trim()
        };
        
        // Combinar conteúdo principal
        const conteudoPrincipal = [data.observacoes, data.textoColado, data.pdfContent]
            .filter(Boolean)
            .join('\n')
            .trim();
        
        // Validação básica
        if (!conteudoPrincipal && !data.imagemBase64) {
            return { 
                valid: false, 
                error: 'Nenhum conteúdo fornecido', 
                details: 'Adicione texto, imagem ou PDF com informações da viagem' 
            };
        }
        
        // Validação de tipos
        if (data.tipos.length === 0) {
            data.tipos = ['Aéreo']; // Padrão seguro
        }
        
        console.log(`✅ [${requestId}] Dados validados: ${conteudoPrincipal.length} chars, ${data.tipos.length} tipos`);
        
        return { 
            valid: true, 
            data: { ...data, conteudoPrincipal } 
        };
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro na validação:`, error);
        return { 
            valid: false, 
            error: 'Erro interno na validação', 
            details: error.message 
        };
    }
}

async function processOrcamento(data, requestId) {
    try {
        console.log(`⚙️ [${requestId}] Iniciando processamento do orçamento...`);
        
        // 1. Detectar tipo de orçamento (versão básica inicial)
        const tipo = detectTipoBasico(data, requestId);
        console.log(`🎯 [${requestId}] Tipo detectado: ${tipo}`);
        
        // 2. Extrair dados básicos
        const dadosExtraidos = extractDadosBasicos(data.conteudoPrincipal, requestId);
        
        // 3. Formatar passageiros
        const passageiros = formatPassageiros(data.adultos, data.criancas, dadosExtraidos.passageiros);
        
        // 4. Gerar prompt básico
        const prompt = buildPromptBasico(data.conteudoPrincipal, passageiros, tipo, data.destino);
        
        // 5. Chamar IA
        const aiResult = await callAI(prompt, data.imagemBase64, requestId);
        
        // 6. Aplicar correções básicas
        const finalResult = applyBasicCorrections(aiResult.content, data.conteudoPrincipal, data.parcelamento);
        
        return {
            content: finalResult,
            type: tipo,
            aiUsed: aiResult.aiUsed,
            tokensUsed: aiResult.tokensUsed
        };
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro no processamento:`, error);
        
        // 🛡️ FALLBACK - RETORNAR TEMPLATE BÁSICO
        return {
            content: generateFallbackResponse(data),
            type: 'FALLBACK',
            aiUsed: 'none',
            tokensUsed: 0
        };
    }
}

// ================================================================================
// 🤖 VERSÕES BÁSICAS DAS FUNÇÕES (EXPANDIDAS NAS PRÓXIMAS ETAPAS)
// ================================================================================

function detectTipoBasico(data, requestId) {
    try {
        const conteudo = data.conteudoPrincipal.toLowerCase();
        
        // Detecção simples e segura
        if (data.tipos.includes('Hotel') && !data.tipos.includes('Aéreo')) {
            return 'HOTEL';
        }
        
        if (data.tipos.includes('Dicas')) {
            return 'DICAS';
        }
        
        if (data.tipos.includes('Ranking')) {
            return 'RANKING';
        }
        
        // Detectar múltiplas companhias
        const companhias = (conteudo.match(/(?:copa|latam|avianca|gol|azul|tap|iberia)/g) || []);
        if (new Set(companhias).size >= 2) {
            return 'MULTIPLAS_COMPANHIAS';
        }
        
        return 'AEREO_SIMPLES'; // Padrão seguro
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na detecção de tipo:`, error);
        return 'AEREO_SIMPLES'; // Fallback seguro
    }
}

function extractDadosBasicos(conteudo, requestId) {
    try {
        const dados = {
            passageiros: null,
            temBagagem: false,
            temParcelamento: false
        };
        
        // Extrair passageiros
        const matchPassageiros = conteudo.match(/Total\s*\((\d+)\s*Adultos?\)/i);
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 1;
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
        }
        
        // Detectar bagagem
        dados.temBagagem = conteudo.toLowerCase().includes('com bagagem');
        
        // Detectar parcelamento
        dados.temParcelamento = conteudo.includes('Entrada de R$');
        
        return dados;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na extração de dados:`, error);
        return { passageiros: null, temBagagem: false, temParcelamento: false };
    }
}

function formatPassageiros(adultos, criancas, passageirosExtraidos) {
    try {
        if (passageirosExtraidos) {
            return passageirosExtraidos;
        }
        
        let resultado = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
        if (criancas > 0) {
            resultado += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro ao formatar passageiros:', error);
        return '01 adulto'; // Fallback seguro
    }
}

function buildPromptBasico(conteudo, passageiros, tipo, destino) {
    try {
        const template = TEMPLATES_BASIC[tipo] || TEMPLATES_BASIC.AEREO_SIMPLES;
        
        return `
Formate este orçamento para WhatsApp seguindo o template.

TEXTO:
${conteudo}

PASSAGEIROS: ${passageiros}

TEMPLATE:
${template}

REGRAS:
- Remover dias da semana das datas
- Converter códigos de aeroporto para nomes
- Usar formato DD/MM para datas
- Terminar com: Valores sujeitos a confirmação e disponibilidade (v4.0)
`;
        
    } catch (error) {
        console.error('❌ Erro ao construir prompt:', error);
        return `Formate este orçamento:\n${conteudo}`;
    }
}

async function callAI(prompt, imagemBase64, requestId) {
    try {
        console.log(`🤖 [${requestId}] Chamando IA...`);
        
        // Decidir qual IA usar
        const usarClaude = imagemBase64 || prompt.length > 5000;
        
        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            return await callClaude(prompt, imagemBase64, requestId);
        } else if (process.env.OPENAI_API_KEY) {
            return await callOpenAI(prompt, requestId);
        } else {
            throw new Error('Nenhuma API de IA configurada');
        }
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro na chamada IA:`, error);
        throw error;
    }
}

async function callClaude(prompt, imagemBase64, requestId) {
    try {
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
            throw new Error(`Claude API erro ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            content: data.content[0].text,
            aiUsed: 'claude',
            tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0
        };
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro Claude:`, error);
        throw error;
    }
}

async function callOpenAI(prompt, requestId) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Formate orçamentos de viagem seguindo as instruções.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 3000
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API erro ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            content: data.choices[0].message.content,
            aiUsed: 'openai',
            tokensUsed: data.usage?.prompt_tokens + data.usage?.completion_tokens || 0
        };
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro OpenAI:`, error);
        throw error;
    }
}

function applyBasicCorrections(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        let resultado = texto;
        
        // Limpeza básica
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // Remover dias da semana
        resultado = resultado.replace(/(?:ter|qua|qui|sex|sáb|sab|dom|seg),?\s*(\d{1,2}\/\d{2})/gi, '$1');
        
        // Converter datas básicas
        resultado = resultado.replace(/(\d{1,2})\s+de\s+(janeiro|jan)/gi, '$1/01');
        resultado = resultado.replace(/(\d{1,2})\s+de\s+(fevereiro|fev)/gi, '$1/02');
        // ... (conversões básicas)
        
        // Garantir versão
        if (!resultado.includes('(v4.0)')) {
            resultado = resultado.replace(
                /Valores sujeitos a confirmação e disponibilidade/g,
                'Valores sujeitos a confirmação e disponibilidade (v4.0)'
            );
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro nas correções básicas:', error);
        return texto; // Retorna original se falhar
    }
}

function generateFallbackResponse(data) {
    try {
        return `Orçamento gerado em modo de emergência.

Dados recebidos:
- Destino: ${data.destino || 'Não informado'}
- Passageiros: ${data.adultos} adulto(s)
- Tipos: ${data.tipos.join(', ')}

⚠️ Sistema em modo de fallback - tente novamente em alguns minutos.

Valores sujeitos a confirmação e disponibilidade (v4.0)`;
        
    } catch (error) {
        return 'Erro no sistema. Tente novamente.';
    }
}

// ================================================================================
// 🔄 LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                CVC ITAQUA v4.0 - NÚCLEO INQUEBRÁVEIS          ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ 🛡️ Sistema modular profissional                               ║');
console.log('║ 📤 JSON sempre válido - sem exceções                          ║');
console.log('║ 🔧 Base sólida para expansões futuras                         ║');
console.log('║ 🧪 Testável e monitorado                                      ║');
console.log('║ 🚀 ETAPA 1/5 - Núcleo Operacional                            ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log(`🎯 Handler principal v4.0 carregado às ${new Date().toISOString()}`);
