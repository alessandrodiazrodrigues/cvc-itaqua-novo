// 🚀 CVC ITAQUA v6.0 - GOOGLE DOCS API
// Lê o manual diretamente do Google Docs

import { google } from 'googleapis';

// Bloco de autenticação corrigido que usa a variável de ambiente única
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

// Função para ler o Google Docs
async function lerManualGoogleDocs() {
  // ... (a função lerManualGoogleDocs continua a mesma, não precisa alterar)
  try {
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
    console.log('✅ Manual carregado do Google Docs:', manualTexto.length, 'caracteres');
    return manualTexto;
  } catch (error) {
    console.error('❌ Erro ao ler Google Docs:', error.message);
    throw new Error(`Erro ao conectar com Google Docs: ${error.message}`);
  }
}

export default async function handler(req, res) {
  // ... (o início do handler continua o mesmo: CORS, GET, etc.)

  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      const { 
        observacoes = '', 
        textoColado = '', 
        destino = '',
        // ... (resto da desestruturação)
      } = req.body;

      const manualCompleto = await lerManualGoogleDocs();
      const conteudoPrincipal = observacoes || textoColado || '';
      
      let prompt = '';
      
      // Lógica para Dicas e Ranking continua a mesma
      if (req.body.tipo === 'dicas' && destino) {
        // ... prompt para dicas
      } else if (req.body.tipo === 'ranking' && destino) {
        // ... prompt para ranking
      } else {
        // ======================================================================
        // PROMPT COMPLETO E FINAL PARA ORÇAMENTOS
        // ======================================================================
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
    * **SE** os "DADOS DO CLIENTE" contiverem orçamentos claramente distintos e não relacionados (ex: um voo Salvador-Rio e outro Guarulhos-Rio), **ENTÃO** aplique a lógica de decisão acima para **CADA ORÇAMENTO SEPARADAMENTE** e apresente os resultados formatados um abaixo do outro.

4.  **REGRAS FINAIS DE FORMATAÇÃO (APLIQUE APÓS ESCOLHER O TEMPLATE):**
    * Use estritamente as regras de formatação de datas, horários, valores e passageiros descritas no manual.
    * Converta todos os códigos de aeroporto para nomes completos (GRU -> Guarulhos).
    * O título deve ser sempre entre cidades (São Paulo ✈ Rio de Janeiro).
    * A resposta final deve ser **APENAS** o orçamento formatado, sem nenhuma conversa, saudação ou explicação.
    * Sempre termine a resposta com "Valores sujeitos a confirmação e disponibilidade", se o modelo escolhido incluir essa frase.`;
      }
      
      // ... (Resto do código para chamar a IA, que permanece o mesmo)
      // ...
    } catch (error) {
      // ... (bloco catch permanece o mesmo)
    }
  }
  
  // ... (resto do handler para métodos não suportados)
}
