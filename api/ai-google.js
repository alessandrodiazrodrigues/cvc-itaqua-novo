// ================================================================================================
// 🔧 CVC ITAQUA v4.02 - VERSÃO DEBUG PARA DIAGNOSTICAR ERRO 500
// ================================================================================================
// Esta versão tem logs detalhados e tratamento de erros robusto para identificar o problema
// ================================================================================================

const CONFIG = {
    VERSION: '4.02-debug',
    SISTEMA: 'CVC ITAQUA DEBUG'
};

// ================================================================================================
// 🛠️ HANDLER PRINCIPAL COM DEBUG COMPLETO
// ================================================================================================

export default async function handler(req, res) {
    console.log('🔍 DEBUG: Iniciando handler...');
    
    // Headers CORS básicos primeiro
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');
        console.log('✅ DEBUG: Headers configurados');
    } catch (headerError) {
        console.error('❌ DEBUG: Erro ao configurar headers:', headerError);
        return res.status(500).json({
            success: false,
            error: 'Erro ao configurar headers',
            debug: headerError.message
        });
    }
    
    try {
        console.log('🔍 DEBUG: Método recebido:', req.method);
        
        // OPTIONS
        if (req.method === 'OPTIONS') {
            console.log('✅ DEBUG: Respondendo OPTIONS');
            return res.status(200).json({ success: true, debug: 'OPTIONS OK' });
        }
        
        // GET - Status básico
        if (req.method === 'GET') {
            console.log('✅ DEBUG: Respondendo GET');
            return res.status(200).json({
                success: true,
                status: 'operational',
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                message: 'CVC Itaqua API v4.02 - DEBUG MODE',
                debug: {
                    node_version: process.version,
                    platform: process.platform,
                    memory: process.memoryUsage(),
                    env_check: {
                        has_openai: !!process.env.OPENAI_API_KEY,
                        has_anthropic: !!process.env.ANTHROPIC_API_KEY
                    }
                }
            });
        }
        
        // POST - Validação básica
        if (req.method === 'POST') {
            console.log('🔍 DEBUG: Processando POST...');
            
            try {
                const body = req.body || {};
                console.log('✅ DEBUG: Body recebido:', Object.keys(body));
                
                const {
                    observacoes = '',
                    textoColado = '',
                    destino = '',
                    tipos = []
                } = body;
                
                console.log('🔍 DEBUG: Dados extraídos:', {
                    observacoes_length: observacoes.length,
                    textoColado_length: textoColado.length,
                    destino,
                    tipos
                });
                
                // Resposta básica por enquanto
                return res.status(200).json({
                    success: true,
                    result: 'API v4.02 DEBUG funcionando!\n\nDados recebidos:\n- Observações: ' + observacoes.length + ' caracteres\n- Texto colado: ' + textoColado.length + ' caracteres\n- Destino: ' + (destino || 'não informado')\n- Tipos: ' + tipos.join(', '),
                    debug: {
                        timestamp: new Date().toISOString(),
                        body_keys: Object.keys(body),
                        memory_after: process.memoryUsage()
                    }
                });
                
            } catch (postError) {
                console.error('❌ DEBUG: Erro ao processar POST:', postError);
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao processar POST',
                    debug: {
                        message: postError.message,
                        stack: postError.stack,
                        name: postError.name
                    }
                });
            }
        }
        
        // Método não suportado
        console.log('⚠️ DEBUG: Método não suportado:', req.method);
        return res.status(405).json({
            success: false,
            error: `Método ${req.method} não permitido`,
            debug: 'Use GET ou POST'
        });
        
    } catch (globalError) {
        console.error('❌ DEBUG: Erro global no handler:', globalError);
        
        try {
            return res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                debug: {
                    message: globalError.message,
                    stack: globalError.stack,
                    name: globalError.name,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (responseError) {
            console.error('❌ DEBUG: Erro ao enviar resposta de erro:', responseError);
            // Último recurso
            return res.end('ERRO CRÍTICO NO SERVIDOR');
        }
    }
}

// ================================================================================================
// 🎯 LOGS DE INICIALIZAÇÃO DEBUG
// ================================================================================================

console.log('🔧 DEBUG: Arquivo carregado');
console.log('🔧 DEBUG: Node.js version:', process.version);
console.log('🔧 DEBUG: Platform:', process.platform);
console.log('🔧 DEBUG: Memory usage:', process.memoryUsage());
console.log('🔧 DEBUG: Environment variables check:');
console.log('  - OPENAI_API_KEY:', !!process.env.OPENAI_API_KEY);
console.log('  - ANTHROPIC_API_KEY:', !!process.env.ANTHROPIC_API_KEY);
console.log('🔧 DEBUG: Handler function defined');

// ================================================================================================
// 📋 INSTRUÇÕES DE DEBUG
// ================================================================================================
/*
🔧 VERSÃO DEBUG v4.02

Esta versão simplificada serve para:
1. ✅ Verificar se a função básica funciona
2. ✅ Identificar onde está o erro 500
3. ✅ Checar variáveis de ambiente
4. ✅ Validar estrutura básica

PASSOS PARA USAR:
1. Substitua temporariamente o arquivo da API por este
2. Faça deploy
3. Teste GET /api/ai-google (deve retornar status)
4. Teste POST com dados básicos
5. Analise os logs para identificar o problema

DEPOIS DE IDENTIFICAR O PROBLEMA:
- Volte para a versão completa v4.02
- Aplique a correção específica identificada

POSSÍVEIS CAUSAS DO ERRO 500:
❌ Erro de sintaxe no código principal
❌ Variáveis de ambiente não configuradas  
❌ Import/export com problema
❌ Timeout na inicialização
❌ Memória insuficiente
❌ Dependências faltando
*/
