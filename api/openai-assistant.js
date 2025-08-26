import OpenAI from 'openai';

// ================================================================================
// 🔧 VALIDAÇÃO E LIMPEZA DA API KEY
// ================================================================================
function cleanApiKey(apiKey) {
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY não definida');
    }
    
    // Remover quebras de linha, espaços e caracteres invisíveis
    const cleaned = apiKey
        .replace(/\r?\n|\r/g, '') // Remove quebras de linha
        .replace(/\s+/g, '') // Remove espaços extras
        .trim(); // Remove espaços no início/fim
    
    console.log('Chave limpa, comprimento:', cleaned.length);
    console.log('Chave começa com sk-:', cleaned.startsWith('sk-'));
    console.log('Primeiros 10 chars:', cleaned.substring(0, 10));
    
    if (!cleaned.startsWith('sk-')) {
        throw new Error('Formato de chave inválido - deve começar com sk-');
    }
    
    if (cleaned.length < 50) {
        throw new Error('Chave muito curta - possível corrupção');
    }
    
    return cleaned;
}

// ================================================================================
// 🤖 HANDLER PRINCIPAL COM VALIDAÇÕES ROBUSTAS
// ================================================================================
export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ✅ ENDPOINT GET PARA VERIFICAÇÃO DE STATUS
    if (req.method === 'GET') {
        try {
            const cleanedKey = cleanApiKey(process.env.OPENAI_API_KEY);
            
            const openai = new OpenAI({
                apiKey: cleanedKey,
            });
            
            // Teste simples de conexão
            const models = await openai.models.list();
            console.log('✅ Conexão OpenAI OK, modelos disponíveis:', models.data.length);
            
            return res.status(200).json({
                success: true,
                version: 'v4.04',
                ia_usada: 'OpenAI Assistant',
                total_templates: 14,
                assistant_id: process.env.ASSISTANT_ID ? 'Configurado' : 'Não configurado',
                models_available: models.data.length
            });
            
        } catch (error) {
            console.error('❌ Erro na verificação:', error.message);
            return res.status(500).json({
                success: false,
                error: error.message,
                version: 'v4.04'
            });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🚀 Iniciando Assistant OpenAI v4.04...');
        
        // ================================================================================
        // 🔧 VALIDAÇÕES INICIAIS
        // ================================================================================
        const cleanedKey = cleanApiKey(process.env.OPENAI_API_KEY);
        
        if (!process.env.ASSISTANT_ID) {
            throw new Error('ASSISTANT_ID não configurado');
        }
        
        console.log('Assistant ID:', process.env.ASSISTANT_ID);
        
        // ================================================================================
        // 🤖 INICIALIZAÇÃO OPENAI COM CHAVE LIMPA
        // ================================================================================
        const openai = new OpenAI({
            apiKey: cleanedKey,
        });
        
        // Teste da chave API primeiro
        console.log('🔍 Testando conexão OpenAI...');
        const models = await openai.models.list();
        console.log('✅ Conexão OpenAI OK, modelos disponíveis:', models.data.length);
        
        // ================================================================================
        // 🧠 PROCESSAMENTO DA MENSAGEM
        // ================================================================================
        const mensagem = req.body.message || req.body.observacoes || 'test';
        console.log('📝 Mensagem recebida:', mensagem.substring(0, 100) + '...');
        
        // Para teste simples, retornar sucesso
        if (mensagem === 'test') {
            return res.status(200).json({
                success: true,
                result: '✅ OpenAI Assistant v4.04 funcionando perfeitamente!\n\n🎯 Sistema CVC Itaqua ativo\n🤖 14 templates disponíveis\n🔧 Detecção automática inteligente',
                ia_usada: 'OpenAI Assistant',
                metadata: {
                    version: 'v4.04',
                    models_available: models.data.length
                }
            });
        }

        // ================================================================================
        // 🧵 CRIAÇÃO E EXECUÇÃO DO THREAD
        // ================================================================================
        console.log('🧵 Criando thread...');
        const thread = await openai.beta.threads.create();
        console.log('✅ Thread criada:', thread.id);
        
        // Adicionar mensagem
        console.log('📨 Adicionando mensagem...');
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: mensagem
        });

        // Executar Assistant
        console.log('🚀 Executando Assistant...');
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: process.env.ASSISTANT_ID
        });
        console.log('⚡ Run iniciado:', run.id);

        // ================================================================================
        // ⏳ AGUARDAR COMPLETAR COM TIMEOUT INTELIGENTE
        // ================================================================================
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        const maxAttempts = 50; // 50 segundos máximo
        
        console.log('⏳ Aguardando conclusão...');
        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            console.log(`📊 Status: ${runStatus.status}, tentativa: ${attempts + 1}/${maxAttempts}`);
            
            if (runStatus.status === 'failed') {
                console.error('❌ Assistant falhou:', runStatus.last_error);
                throw new Error(`Assistant execution failed: ${runStatus.last_error?.message || 'Unknown error'}`);
            }
            
            if (runStatus.status === 'requires_action') {
                console.log('⚠️ Assistant requer ação, continuando...');
            }
            
            if (runStatus.status === 'cancelled') {
                throw new Error('Assistant execution was cancelled');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            attempts++;
        }

        if (runStatus.status !== 'completed') {
            throw new Error(`⏰ Assistant timeout após ${attempts} tentativas. Status final: ${runStatus.status}`);
        }

        // ================================================================================
        // 📥 OBTER RESPOSTA
        // ================================================================================
        console.log('📥 Assistant completado, obtendo mensagens...');
        const messages = await openai.beta.threads.messages.list(thread.id);
        
        if (!messages.data || messages.data.length === 0) {
            throw new Error('Nenhuma mensagem retornada pelo Assistant');
        }

        const assistantMessage = messages.data[0].content[0].text.value;
        console.log('✅ Resposta obtida, tamanho:', assistantMessage.length);

        // ================================================================================
        // 🎯 RESPOSTA FINAL
        // ================================================================================
        res.status(200).json({
            success: true,
            result: assistantMessage,
            ia_usada: 'OpenAI Assistant v4.04',
            metadata: {
                thread_id: thread.id,
                run_id: run.id,
                attempts: attempts,
                version: 'v4.04',
                models_available: models.data.length
            }
        });

    } catch (error) {
        console.error('❌ Erro detalhado no Assistant:', error);
        
        // Erro mais específico para problemas de API Key
        let errorMessage = error.message;
        if (error.message.includes('HTTP header') || error.message.includes('Bearer')) {
            errorMessage = 'Problema com a chave da API OpenAI - verifique as variáveis de ambiente no Vercel';
        }
        
        res.status(500).json({
            success: false,
            error: errorMessage,
            details: error.stack,
            version: 'v4.04'
        });
    }
}
