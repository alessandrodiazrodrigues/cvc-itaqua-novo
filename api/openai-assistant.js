import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Iniciando Assistant OpenAI...');

        // Criar thread
        const thread = await openai.beta.threads.create();
        
        // Adicionar mensagem
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: req.body.message || req.body.observacoes || req.body.textoColado
        });

        // Executar Assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: process.env.ASSISTANT_ID
        });

        // Aguardar completar
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        const maxAttempts = 30; // 30 segundos max
        
        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            if (runStatus.status === 'failed') {
                throw new Error('Assistant execution failed');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            attempts++;
        }

        if (runStatus.status !== 'completed') {
            throw new Error('Assistant timeout');
        }

        // Pegar resposta
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data[0].content[0].text.value;

        console.log('Assistant completou com sucesso');

        res.status(200).json({
            success: true,
            result: assistantMessage,
            ia_usada: 'OpenAI Assistant',
            metadata: {
                thread_id: thread.id,
                run_id: run.id,
                version: 'v5.1'
            }
        });

    } catch (error) {
        console.error('Erro no Assistant:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            ia_usada: 'OpenAI Assistant (Error)'
        });
    }
}
