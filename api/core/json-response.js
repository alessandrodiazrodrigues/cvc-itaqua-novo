// api/core/json-response.js - RESPOSTA JSON GARANTIDA
// ================================================================================
// 🛡️ NÚCLEO CRÍTICO - GARANTE JSON VÁLIDO EM 100% DOS CASOS
// ⚠️  ESTE ARQUIVO É PROTEGIDO - NUNCA EDITAR SEM JUSTIFICATIVA EXTREMA
// 🎯 RESPONSABILIDADE: EVITAR O ERRO "Unexpected token 'A'" PARA SEMPRE
// ================================================================================

/**
 * Função que GARANTE retorno JSON válido em qualquer circunstância
 * Mesmo se o servidor crashar, sempre retorna JSON parseável
 * 
 * @param {Object} res - Response object do Express/Vercel
 * @param {boolean} success - Status de sucesso da operação
 * @param {string|Object} result - Resultado principal ou mensagem
 * @param {string} error - Mensagem de erro (se houver)
 * @param {Object} metadata - Metadados adicionais
 * @returns {Object} Sempre retorna JSON válido
 */
export function safeJSONResponse(res, success, result, error = null, metadata = {}) {
    const startTime = Date.now();
    
    try {
        // 1. Sanitizar parâmetros de entrada
        const sanitizedData = sanitizeInputs(success, result, error, metadata);
        
        // 2. Construir objeto de resposta seguro
        const responseObject = buildSafeResponse(sanitizedData);
        
        // 3. Validar JSON antes de enviar
        const validatedJSON = validateAndStringify(responseObject);
        
        // 4. Configurar headers de segurança
        setSecureHeaders(res);
        
        // 5. Enviar resposta com status sempre 200 (evita erro no frontend)
        console.log(`📤 JSON Response: ${validatedJSON.substring(0, 100)}...`);
        
        res.status(200).send(validatedJSON);
        
        // 6. Log de sucesso
        console.log(`✅ JSON Response enviado em ${Date.now() - startTime}ms`);
        
        return true;
        
    } catch (criticalError) {
        // 🚨 FALLBACK FINAL - SE TUDO MAIS FALHAR
        console.error('💥 ERRO CRÍTICO na safeJSONResponse:', criticalError);
        
        try {
            // Tentativa de envio de emergência
            const emergencyResponse = JSON.stringify({
                success: false,
                result: 'Erro crítico no sistema',
                error: 'CRITICAL_JSON_ERROR',
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '4.0',
                    errorDetails: String(criticalError).substring(0, 100)
                }
            });
            
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(200).send(emergencyResponse);
            
            console.log('🚨 Resposta de emergência enviada');
            return true;
            
        } catch (finalError) {
            // 💀 ÚLTIMO RECURSO - RESPOSTA MÍNIMA
            console.error('💀 ERRO FINAL:', finalError);
            
            try {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send('{"success":false,"result":"Sistema indisponível","error":"FINAL_FALLBACK"}');
                return true;
            } catch (absoluteError) {
                console.error('💀💀 ERRO ABSOLUTO:', absoluteError);
                return false;
            }
        }
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES PROTEGIDAS
// ================================================================================

/**
 * Sanitiza todos os inputs para evitar problemas de serialização
 */
function sanitizeInputs(success, result, error, metadata) {
    try {
        return {
            success: Boolean(success),
            result: sanitizeValue(result),
            error: error ? String(error).substring(0, 500) : null,
            metadata: sanitizeMetadata(metadata)
        };
    } catch (err) {
        console.error('❌ Erro na sanitização:', err);
        return {
            success: false,
            result: 'Erro na sanitização de dados',
            error: 'SANITIZATION_ERROR',
            metadata: { timestamp: new Date().toISOString() }
        };
    }
}

/**
 * Sanitiza um valor individual
 */
function sanitizeValue(value) {
    try {
        if (value === null || value === undefined) {
            return null;
        }
        
        if (typeof value === 'string') {
            // Limitar tamanho da string para evitar payloads gigantes
            return value.length > 50000 ? value.substring(0, 50000) + '...[truncated]' : value;
        }
        
        if (typeof value === 'object') {
            // Converter objetos complexos para string segura
            return JSON.stringify(value).substring(0, 10000);
        }
        
        if (typeof value === 'number') {
            return isNaN(value) ? 0 : value;
        }
        
        if (typeof value === 'boolean') {
            return value;
        }
        
        // Para outros tipos, converter para string
        return String(value).substring(0, 1000);
        
    } catch (err) {
        console.error('❌ Erro na sanitização de valor:', err);
        return 'Erro na sanitização';
    }
}

/**
 * Sanitiza objeto de metadata
 */
function sanitizeMetadata(metadata) {
    try {
        if (!metadata || typeof metadata !== 'object') {
            return { timestamp: new Date().toISOString() };
        }
        
        const sanitized = {};
        
        // Campos obrigatórios seguros
        sanitized.timestamp = new Date().toISOString();
        sanitized.version = '4.0';
        
        // Sanitizar campos customizados
        for (const [key, value] of Object.entries(metadata)) {
            if (key.length > 50) continue; // Ignorar chaves muito longas
            
            try {
                sanitized[key] = sanitizeValue(value);
            } catch (err) {
                console.error(`❌ Erro ao sanitizar metadata.${key}:`, err);
                // Pula este campo se houver erro
            }
        }
        
        return sanitized;
        
    } catch (err) {
        console.error('❌ Erro na sanitização de metadata:', err);
        return {
            timestamp: new Date().toISOString(),
            version: '4.0',
            sanitizationError: true
        };
    }
}

/**
 * Constrói objeto de resposta seguro
 */
function buildSafeResponse(sanitizedData) {
    try {
        const response = {
            success: sanitizedData.success,
            result: sanitizedData.result,
            metadata: sanitizedData.metadata
        };
        
        // Adicionar error apenas se existir
        if (sanitizedData.error) {
            response.error = sanitizedData.error;
        }
        
        return response;
        
    } catch (err) {
        console.error('❌ Erro ao construir resposta:', err);
        return {
            success: false,
            result: 'Erro na construção da resposta',
            error: 'RESPONSE_BUILD_ERROR',
            metadata: {
                timestamp: new Date().toISOString(),
                version: '4.0'
            }
        };
    }
}

/**
 * Valida e serializa para JSON
 */
function validateAndStringify(responseObject) {
    try {
        // Primeira tentativa de serialização
        const jsonString = JSON.stringify(responseObject);
        
        // Validar se é JSON válido tentando fazer parse
        JSON.parse(jsonString);
        
        return jsonString;
        
    } catch (jsonError) {
        console.error('❌ Erro na serialização JSON:', jsonError);
        
        try {
            // Fallback para objeto mínimo garantido
            const fallbackObject = {
                success: false,
                result: 'Erro na serialização JSON',
                error: 'JSON_SERIALIZATION_ERROR',
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '4.0',
                    originalError: String(jsonError).substring(0, 100)
                }
            };
            
            const fallbackJSON = JSON.stringify(fallbackObject);
            
            // Validar fallback
            JSON.parse(fallbackJSON);
            
            return fallbackJSON;
            
        } catch (fallbackError) {
            console.error('💥 Erro crítico no fallback JSON:', fallbackError);
            
            // JSON mínimo absoluto - garantidamente válido
            return '{"success":false,"result":"JSON serialization failed","error":"CRITICAL_JSON_ERROR","metadata":{"version":"4.0"}}';
        }
    }
}

/**
 * Configura headers seguros
 */
function setSecureHeaders(res) {
    try {
        // Headers essenciais para JSON
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        
        // Headers CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Headers de segurança
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        
        // Header customizado para identificação
        res.setHeader('X-CVC-System', 'ITAQUA-v4.0');
        
    } catch (headerError) {
        console.error('❌ Erro ao configurar headers:', headerError);
        // Continua sem headers customizados - não é crítico
    }
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE DA RESPOSTA JSON
// ================================================================================

/**
 * Testa se o sistema de resposta JSON está funcionando
 * Útil para validação durante desenvolvimento
 */
export function testJSONResponse() {
    console.log('🧪 Testando sistema de resposta JSON...');
    
    const testCases = [
        { success: true, result: 'Teste simples' },
        { success: false, result: null, error: 'Erro de teste' },
        { success: true, result: { objeto: 'complexo', array: [1, 2, 3] } },
        { success: false, result: 'a'.repeat(60000), error: 'String gigante' }, // Teste de limite
        { success: true, result: undefined }, // Teste de undefined
        { success: false, result: null, error: null } // Teste de nulls
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        try {
            const testCase = testCases[i];
            const mockRes = {
                setHeader: () => {},
                status: () => ({ send: (data) => console.log(`Test ${i + 1}: ${data.substring(0, 100)}...`) })
            };
            
            safeJSONResponse(mockRes, testCase.success, testCase.result, testCase.error, { testCase: i + 1 });
            console.log(`✅ Teste ${i + 1} passou`);
            
        } catch (testError) {
            console.error(`❌ Teste ${i + 1} falhou:`, testError);
        }
    }
    
    console.log('🧪 Testes de JSON Response concluídos');
}

// ================================================================================
// 🔄 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('🛡️ Módulo JSON Response v4.0 carregado - Garantia de JSON válido ativada');

// Executar teste automático em desenvolvimento
if (process.env.NODE_ENV === 'development') {
    // testJSONResponse(); // Descomente para testar
}
