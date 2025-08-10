// 🚀 CVC ITAQUA v6.0 - GOOGLE DOCS API (COM CACHE)
import { google } from 'googleapis';

// ================================================================================
// 📋 SISTEMA DE CACHE DO MANUAL
// ================================================================================
let cache = {
  manual: null,
  timestamp: 0,
};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// ================================================================================
// 🔐 AUTENTICAÇÃO GOOGLE
// ================================================================================
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;
if (!credentialsJsonString) {
  throw new Error('A variável de ambiente GOOGLE_CREDENTIALS_JSON não foi definida.');
}
const credentials = JSON.parse(credentialsJsonString);

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  scopes: ['https://www.googleapis.com/auth/documents.readonly'],
});

// ================================================================================
// 📚 FUNÇÃO PARA LER O MANUAL DO GOOGLE DOCS
// ================================================================================
async function lerManualGoogleDocs() {
  const agora = Date.now();
  
  // Verificar cache
  if (cache.manual && (agora - cache.timestamp < CACHE_DURATION)) {
    console.log('✅ Manual carregado do CACHE');
    return cache.manual;
  }
  
  try {
    console.log('🔄 Baixando novo manual do Google Docs...');
    const docs = google.docs({ version: 'v1', auth });
    const documentId = process.env.GOOGLE_DOCS_ID || '1J6luZmr0Q_ldqsmEJ4kuMEfA7BYt3DInd7-Tt98hInY';
    
    const response = await docs.documents.get({ documentId });
    let manualTexto = '';
    
    const content = response.data.body?.content || [];
    content.forEach(element => {
      if (element.paragraph) {
        element.paragraph.elements?.forEach(elem => {
          if (elem.textRun?.content) {
            manualTexto += elem.textRun.content;
          }
        });
      }
    });
    
    // Salvar no cache
    cache.manual = manualTexto;
    cache.timestamp = agora;
    
    console.log('✅ Manual carregado do Google Docs:', manualTexto.length, 'caracteres');
    return manualTexto;
    
  } catch (error) {
    console.error('❌ Erro ao ler Google Docs:', error.message);
    throw new Error(`Erro ao conectar com Google Docs: ${error.message}`);
  }
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API
// ================================================================================
export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Status da API
  if (req.method === 'GET') {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    const hasGoogle = !!process.env.GOOGLE_CREDENTIALS_JSON;
    
    return res.status(200).json({
      success: true,
      message: 'API CVC Itaqua v6.0 - Online',
      services: {
        openai: hasOpenAI ? 'Configurado' : 'Não configurado',
        anthropic: hasAnthropic ? 'Configurado' : 'Não configurado',
        googleDocs: hasGoogle ? 'Configurado' : 'Não configurado'
      },
      cache: {
        hasManual: !!cache.manual,
        age: cache.manual ? `${Math.floor((Date.now() - cache.timestamp) / 1000)}s` : 'N/A'
      }
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      console.log('📥 Requisição recebida');
      
      const { 
        observacoes = '', 
        textoColado = '',
        destino = '',
        adultos = '',
        criancas = 0,
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null
      } = req.body;
      
      // Buscar manual do Google Docs
      const manualCompleto = await lerManualGoogleDocs();
      
      // Determinar conteúdo principal
      const conteudoPrincipal = observacoes || textoColado || pdfContent || '';
      
      // Verificar se é requisição de dicas ou ranking
      const isDicas = tipos.includes('Dicas');
      const isRanking = tipos.includes('Ranking');
      
      let prompt = '';
      
      // ================================================================================
      // 💡 PROMPT PARA DICAS
      // ================================================================================
      if (isDicas) {
        prompt = `Você é um especialista em viagens da CVC Itaqua. 
        Crie dicas práticas e úteis sobre ${destino || 'o destino mencionado no orçamento'}.
        
        IMPORTANTE: Se for um cruzeiro (MSC, Costa, etc), foque em:
        - Vida a bordo e refeições
        - Pacote de bebidas antecipado (economia de 40%)
        - Passeios nos portos com a CVC
        - Custos extras a bordo
        
        Se for destino terrestre, foque em:
        - Período da viagem e clima
        - Principais atrações
        - Gastronomia local
        - Transporte e economia
        
        Sempre mencione que a CVC oferece:
        - Passeios com guias em português
        - Transfers seguros
        - Assistência 24h
        
        Formate com emojis e seções claras.`;
      }
      // ================================================================================
      // 🏆 PROMPT PARA RANKING
      // ================================================================================
      else if (isRanking) {
        prompt = `Você é um especialista em hotéis da CVC Itaqua.
        Crie um ranking dos TOP 5 hotéis em ${destino || 'o destino'}.
        
        Use este formato:
        
        🏆 TOP 5 HOTÉIS
        
        1️⃣ [Nome do Hotel] ⭐⭐⭐⭐⭐
        📍 [Localização]
        ✨ [Diferencial]
        💰 Diária média: R$ [valor]
        
        (Continue para os 5 hotéis)`;
      }
      // ================================================================================
      // 📋 PROMPT PRINCIPAL PARA ORÇAMENTOS
      // ================================================================================
      else {
        const parcelamentoInfo = parcelamento ? `\nParcelamento solicitado: ${parcelamento}x sem juros` : '';
        
        prompt = `Você é um assistente especialista da CVC Itaqua.

**MANUAL COMPLETO:**
${manualCompleto}

**DADOS DO CLIENTE:**
${conteudoPrincipal}
${destino ? `Destino: ${destino}` : ''}
${adultos ? `Adultos: ${adultos}` : ''}
${criancas > 0 ? `Crianças: ${criancas}` : ''}
${parcelamentoInfo}

**REGRAS CRÍTICAS:**

1. TÍTULO:
- Voo único: *Companhia*
- Múltiplos voos: *OPÇÃO 1 - Companhia*, *OPÇÃO 2 - Companhia*
- NUNCA incluir cidades no título

2. MÚLTIPLOS VOOS = sempre OPÇÃO 1, OPÇÃO 2

3. PASSAGEIROS: Não inventar idades

4. BAGAGEM: Sempre incluir (padrão: 1 item pessoal + 1 mala de mão 10kg)

5. CRUZEIROS:
- Incluir roteiro completo
- Usar valor total com taxas
- Formato: R$ X.XXX,XX (valor total com taxas)

6. PARCELAMENTO com entrada:
- "Em até Xx sem juros no cartão, sendo a primeira de R$ xxx + Yx de R$ xxx"

7. LINKS: Só incluir se existir no texto

8. Sempre terminar com "Valores sujeitos a confirmação e disponibilidade"

Use o formato do manual e responda APENAS com o orçamento formatado.`;
      }
      
      // ================================================================================
      // 🤖 PROCESSAMENTO COM GPT
      // ================================================================================
      let resultado = '';
      
      console.log('🤖 Usando GPT-4o-mini...');
      
      const OPENAI_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_KEY) {
        throw new Error('OpenAI API key não configurada.');
      }
      
      const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 1500
        })
      });
      
      if (!gptResponse.ok) {
        const errorText = await gptResponse.text();
        console.error('❌ Erro GPT:', errorText);
        throw new Error(`Erro ao processar com GPT: ${errorText}`);
      }
      
      const gptData = await gptResponse.json();
      resultado = gptData.choices[0].message.content;
      
      // ================================================================================
      // ✅ RESPOSTA FINAL
      // ================================================================================
      console.log('✅ Processamento concluído');
      
      return res.status(200).json({
        success: true,
        result: resultado,
        ia_usada: 'gpt-4o-mini',
        cache_info: {
          manual_cached: cache.manual ? true : false,
          cache_age_seconds: cache.manual ? Math.floor((Date.now() - cache.timestamp) / 1000) : 0
        }
      });
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro desconhecido ao processar orçamento'
      });
    }
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    error: 'Método não suportado. Use GET para status ou POST para processar.'
  });
}
