import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, 'public')));

// API de IA - Suporte para OpenAI real ou Mock
app.post('/api/ai', async (req, res) => {
  try {
    console.log('🤖 Recebida requisição para API de IA');
    console.log('📝 Dados:', req.body);
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')) {
      // ====================================================================
      // 🔑 USAR API REAL DA OPENAI
      // ====================================================================
      try {
        console.log('🔑 Usando API real da OpenAI...');
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: req.body.prompt
              }
            ],
            max_tokens: req.body.maxTokens || 2000,
            temperature: 0.7
          })
        });
        
        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API Error: ${openaiResponse.status}`);
        }
        
        const data = await openaiResponse.json();
        console.log('✅ Resposta real da OpenAI recebida');
        res.json(data);
        
      } catch (openaiError) {
        console.error('❌ Erro na API da OpenAI:', openaiError);
        res.status(500).json({ 
          error: 'Erro na API da OpenAI',
          message: openaiError.message 
        });
      }
      
    } else {
      // ====================================================================
      // 💭 USAR RESPOSTA MOCK PARA TESTE
      // ====================================================================
      console.log('💭 Usando resposta mock (configure OPENAI_API_KEY para IA real)');
      
      const mockResponse = {
        choices: [{
          message: {
            content: `📍 Orlando - Disney World (Estados Unidos)

🗓️ Saída: 15/03/2024
🗓️ Retorno: 22/03/2024

✈️ VOO DE IDA
Congonhas (SP) → Guarulhos (SP) → Miami (EUA) → Orlando (EUA)
Saída: 06:30 - Chegada: 23:45
Companhia: LATAM + American Airlines
Conexões: Guarulhos e Miami

✈️ VOO DE VOLTA  
Orlando (EUA) → Miami (EUA) → Guarulhos (SP) → Congonhas (SP)
Saída: 08:15 - Chegada: 18:30 (+1 dia)
Companhia: American Airlines + LATAM
Conexões: Miami e Guarulhos

🏨 HOSPEDAGEM
Disney's Grand Floridian Resort & Spa
7 diárias com café da manhã
Quarto Superior com vista para o lago

🎢 INGRESSOS INCLUSOS
Disney World - 5 dias Park Hopper
Universal Studios - 2 dias

💰 VALOR TOTAL: R$ 12.850,00 por pessoa
💰 VALOR FAMÍLIA (2 adultos): R$ 25.700,00

📋 INFORMAÇÕES TÉCNICAS:
DADOS DO CLIENTE: João Silva
PRODUTO SELECIONADO: Pacote Orlando
Sistema gerou automaticamente os dados
Link: www.exemplo-nao-valido.com.br/reserva
RESPOSTA: Processamento concluído`
          }
        }]
      };
      
      res.json(mockResponse);
    }
    
  } catch (error) {
    console.error('❌ Erro na API:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para servir arquivos HTML na raiz
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Fallback para SPAs - serve index.html para rotas não encontradas
app.get('*', (req, res) => {
  const filePath = join(__dirname, 'public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(join(__dirname, 'public', 'index.html'));
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-');
  
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Servindo arquivos de: ${join(__dirname, 'public')}`);
  console.log(`🤖 API de IA disponível em: http://localhost:${PORT}/api/ai`);
  console.log('');
  
  if (hasOpenAI) {
    console.log('🔑 ✅ MODO IA REAL - OpenAI configurada');
    console.log('🎯 Respostas serão geradas pela IA real');
  } else {
    console.log('💭 ⚠️  MODO MOCK - OpenAI não configurada');
    console.log('🔧 Para usar IA real:');
    console.log('   1. Copie: copy .env.example .env');
    console.log('   2. Edite .env e adicione sua OPENAI_API_KEY');
    console.log('   3. Reinicie: npm start');
  }
  
  console.log('');
  console.log('🌐 Acesse: http://localhost:' + PORT + '/orcamentos.html');
});