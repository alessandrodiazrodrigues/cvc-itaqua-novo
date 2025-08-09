// 🚀 CVC ITAQUA v6.0 - GOOGLE DOCS API (COM CACHE)
import { google } from 'googleapis';

// --- INÍCIO DA LÓGICA DE CACHE ---
let cache = {
  manual: null,
  timestamp: 0,
};
const CACHE_DURATION = 10 * 60 * 1000; // Cache válido por 10 minutos
// --- FIM DA LÓGICA DE CACHE ---

// Bloco de autenticação que lê a variável de ambiente única
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;
if (!credentialsJsonString) {
  // Trava a aplicação se a variável essencial não for encontrada
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

// Função para ler o Google Docs COM CACHE
async function lerManualGoogleDocs() {
  const agora = Date.now();
  
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
    
    cache.manual = manualTexto;
    cache.timestamp = agora;
    
    console.log('✅ Novo manual carregado do Google Docs e salvo no cache:', manualTexto.length, 'caracteres');
    return manualTexto;
    
  } catch (error) {
    console.error('❌ Erro ao ler Google Docs:', error.message);
    throw new Error(`Erro ao conectar com Google Docs: ${error.message}`);
  }
}

export default async function handler(req, res) {
  console.log('🤖 CVC v6.0 Google Docs - Requisição recebida');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // (O GET continua o mesmo, apenas para checagem de status)
    return res.status(200).json({ status: 'online', version: '6.0-cache' });
  }
  
  if (req.method === 'POST') {
    try {
      const { 
        observacoes = '', 
        textoColado = '', 
        destino = '',
        adultos = '',
        criancas = 0,
        parcelamento = null,
        imagemBase64 = null,
        tipo = 'orcamento'
      } = req.body;

      const manualCompleto = await lerManualGoogleDocs();
      const conteudoPrincipal = observacoes || textoColado || '';
      
      let prompt = '';
      
      if (tipo === 'dicas' || tipo === 'ranking') {
          // Lógica para dicas e ranking
          prompt = `Use o manual para gerar ${tipo} para ${destino}. MANUAL: ${manualCompleto}`;
      } else {
        // PROMPT INTELIGENTE E DEFINITIVO PARA ORÇAMENTOS
        prompt = `Você é um assistente especialista da CVC Itaqua. Sua única função é receber DADOS de um cliente e um MANUAL de formatação e retornar um orçamento perfeitamente formatado, seguindo a lógica de decisão abaixo.

**MANUAL COMPLETO (Use para consultar os templates exatos):**
${manualCompleto}

**DADOS DO CLIENTE PARA PROCESSAR:**
${conteudoPrincipal}

// =================================================================
// LÓGICA DE DECISÃO OBRIGATÓRIA (SIGA ESTA ÁRVORE DE DECISÃO):
// =================================================================

1.  **PRIMEIRA VERIFICAÇÃO - TIPO DE SERVIÇO:**
    * **SE** os "DADOS DO CLIENTE" contiverem as palavras "cruzeiro", "navio" ou "cabine", **ENTÃO** use o template "🚢 6. CRUZEIRO".
    * **SENÃO SE** os "DADOS DO CLIENTE" contiverem as palavras "pacote", "hospedagem", "hotel" ou a expressão "aéreo + hotel", **ENTÃO** use o template "🏖️ 7. PACOTE COMPLETO".
    * **SENÃO**, prossiga para a verificação de voos.

2.  **SEGUNDA VERIFICAÇÃO - ESTRUTURA DO VOO:**
    * **SE** os "DADOS DO CLIENTE" contiverem "multitrecho" ou múltiplos "Trecho 1", "Trecho 2", etc., **ENTÃO** use o template "🗺️ 5. MULTITRECHO".
    * **SENÃO SE** os "DADOS DO CLIENTE" contiverem "opção 1", "opção 2" e "opção 3", **ENTÃO** use o template "🔢 4. MÚLTIPLAS OPÇÕES - 3 PLANOS".
    * **SENÃO SE** os "DADOS DO CLIENTE" contiverem "opção 1" e "opção 2":
        * **SE** as companhias aéreas forem diferentes (ex: "OPÇÃO 1 - Copa", "OPÇÃO 2 - American Airlines"), **ENTÃO** use o template "🌍 6. MÚLTIPLAS COMPANHIAS INTERNACIONAIS".
        * **SENÃO** (se for a mesma companhia), **ENTÃO** use o template "🔢 3. MÚLTIPLAS OPÇÕES - 2 PLANOS".
    * **SENÃO SE** os "DADOS DO CLIENTE" mencionarem explicitamente "conexão" junto com um tempo de espera (ex: "2h05 de espera"), **ENTÃO** use o template "✈️ 2. AÉREO IDA E VOLTA COM CONEXÃO DETALHADA".
    * **SENÃO SE** os "DADOS DO CLIENTE" contiverem as palavras "somente ida" ou "apenas ida", **ENTÃO** use o template "✈️ 2. AÉREO SOMENTE IDA".
    * **SENÃO** (para todos os outros casos de voo ida e volta), **ENTÃO** use o template padrão "✈️ 1. AÉREO IDA E VOLTA SIMPLES".

3.  **REGRA ESPECIAL PARA MÚLTIPLOS ORÇAMENTOS:**
    * **SE** os "DADOS DO CLIENTE" contiverem orçamentos claramente distintos e não relacionados, **ENTÃO** aplique a lógica de decisão acima para **CADA ORÇAMENTO SEPARADAMENTE** e apresente os resultados formatados um abaixo do outro.

4.  **REGRAS FINAIS DE FORMATAÇÃO (APLIQUE APÓS ESCOLHER O TEMPLATE):**
    * Use estritamente as regras de formatação de datas, horários, valores e passageiros descritas no manual.
    * Converta todos os códigos de aeroporto para nomes completos (GRU -> Guarulhos).
    * O título deve ser sempre entre cidades (São Paulo ✈ Rio de Janeiro).
    * A resposta final deve ser **APENAS** o orçamento formatado, sem nenhuma conversa, saudação ou explicação.
    * Sempre termine a resposta com "Valores sujeitos a confirmação e disponibilidade", se o modelo escolhido incluir essa frase.`;
      }
      
      let resultado = '';
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
        throw new Error(`Erro ao processar com GPT: ${errorText}`);
      }

      const gptData = await gptResponse.json();
      resultado = gptData.choices[0].message.content;

      console.log('✅ Processamento concluído');
      
      return res.status(200).json({
        success: true,
        result: resultado
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro desconhecido ao processar orçamento'
      });
    }
  }
  
  return res.status(405).json({
    success: false,
    error: 'Método não suportado'
  });
}
