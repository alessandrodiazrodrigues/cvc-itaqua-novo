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
       console.log('Mensagem recebida:', req.body.message?.substring(0, 100));
       
       // Para teste simples, retornar sucesso
       if (req.body.message === 'test') {
           return res.status(200).json({
               success: true,
               result: 'Test OK',
               ia_usada: 'OpenAI Assistant'
           });
       }

       // Validar se tem Assistant ID
       if (!process.env.ASSISTANT_ID) {
           throw new Error('ASSISTANT_ID não configurado');
       }

       console.log('Criando thread...');
       // Criar thread
       const thread = await openai.beta.threads.create();
       console.log('Thread criada:', thread.id);
       
       // Adicionar mensagem
       console.log('Adicionando mensagem...');
       await openai.beta.threads.messages.create(thread.id, {
           role: "user",
           content: req.body.message || 'test'
       });

       // Executar Assistant
       console.log('Executando Assistant...');
       const run = await openai.beta.threads.runs.create(thread.id, {
           assistant_id: process.env.ASSISTANT_ID
       });
       console.log('Run iniciado:', run.id);

       // Aguardar completar
       let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
       let attempts = 0;
       
       console.log('Aguardando conclusão...');
       while (runStatus.status !== 'completed' && attempts < 60) {
           console.log(`Status: ${runStatus.status}, tentativa: ${attempts + 1}`);
           
           if (runStatus.status === 'failed') {
               console.error('Assistant falhou:', runStatus.last_error);
               throw new Error(`Assistant execution failed: ${runStatus.last_error?.message || 'Unknown error'}`);
           }
           
           if (runStatus.status === 'requires_action') {
               console.log('Assistant requer ação, mas continuando...');
           }
           
           await new Promise(resolve => setTimeout(resolve, 1000));
           runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
           attempts++;
       }

       if (runStatus.status !== 'completed') {
           throw new Error(`Assistant timeout após ${attempts} tentativas. Status final: ${runStatus.status}`);
       }

       console.log('Assistant completado, obtendo mensagens...');
       // Pegar resposta
       const messages = await openai.beta.threads.messages.list(thread.id);
       
       if (!messages.data || messages.data.length === 0) {
           throw new Error('Nenhuma mensagem retornada pelo Assistant');
       }

       const assistantMessage = messages.data[0].content[0].text.value;
       console.log('Resposta obtida, tamanho:', assistantMessage.length);

       res.status(200).json({
           success: true,
           result: assistantMessage,
           ia_usada: 'OpenAI Assistant',
           metadata: {
               thread_id: thread.id,
               run_id: run.id,
               attempts: attempts
           }
       });

   } catch (error) {
       console.error('Erro detalhado no Assistant:', error);
       res.status(500).json({
           success: false,
           error: error.message,
           details: error.stack
       });
   }
}
