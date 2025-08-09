// 🚀 CVC ITAQUA v6.0 - GOOGLE DOCS API
// Lê o manual diretamente do Google Docs

import { google } from 'googleapis';

// ******* INÍCIO DA CORREÇÃO *******
// Este é o bloco de autenticação corrigido que usa a variável de ambiente única.

const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;

if (!credentialsJsonString) {
  // Esta verificação ajuda a identificar erros rapidamente se a variável não for carregada.
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
// ******* FIM DA CORREÇÃO *******


// Função para ler o Google Docs
async function lerManualGoogleDocs() {
  try {
    const docs = google.docs({ version: 'v1', auth });
    
    const documentId = process.env.GOOGLE_DOCS_ID || '1J6luZmr0Q_ldqsmEJ4kuMEfA7BYt3DInd7-Tt98hInY'; // ID do seu Google Doc
    
    const response = await docs.documents.get({
      documentId: documentId,
    });
    
    // Extrair texto do documento
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
    // Lança o erro para ser pego pelo handler principal
    throw new Error(`Erro ao conectar com Google Docs: ${error.message}`);
  }
}

export default async function handler(req, res) {
  console.log('🤖 CVC v6.0 Google Docs - Requisição recebida');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Tratar OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Status da API
  if (req.method === 'GET') {
    try {
      // Tentar ler o manual para verificar se está funcionando
      const manual = await lerManualGoogleDocs();
      const hasOpenAI = !!process.env.OPENAI_API_KEY;
      const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
      
      return res.status(200).json({
        success: true,
        status: 'online',
        version: '6.0-google-docs',
        message: 'CVC Itaqua v6.0 - Google Docs API',
        manual: {
          status: 'Conectado ao Google Docs ✅',
          tamanho: manual.length + ' caracteres',
          documento: process.env.GOOGLE_DOCS_ID || 'ID Fixo no Código'
        },
        config: {
          openai: hasOpenAI ? 'Configurada ✅' : 'Não configurada ❌',
          anthropic: hasAnthropic ? 'Configurada ✅' : 'Não configurada ❌',
          googleDocs: 'Conectado ✅'
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 'error',
        message: 'CVC Itaqua v6.0 - Erro na API',
        manual: {
          status: 'Erro ao conectar ❌',
          erro: error.message
        }
      });
    }
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      const { 
        observacoes = '', 
        textoColado = '', 
        destino = '',
        adultos = '',
        criancas = 0,
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null,
        tipo = 'orcamento'
      } = req.body;

      console.log('📋 Dados recebidos:', { 
        temImagem: !!imagemBase64, 
        temPDF: !!pdfContent,
        tipo,
        destino,
        parcelamento 
      });

      // Ler o manual do Google Docs
      const manualCompleto = await lerManualGoogleDocs();
      
      // Construir prompt baseado no tipo
      let prompt = '';
      
      if (tipo === 'dicas' && destino) {
        prompt = `Use o manual abaixo para gerar dicas para ${destino}.\n\nMANUAL CVC:\n${manualCompleto}\n\nGere dicas no formato padrão do manual para: ${destino}`;
      } 
      else if (tipo === 'ranking' && destino) {
        prompt = `Use o manual abaixo para gerar ranking de hotéis para ${destino}.\n\nMANUAL CVC:\n${manualCompleto}\n\nGere ranking de TOP 5 hotéis no formato padrão do manual para: ${destino}`;
      }
      else {
        // Orçamento normal
        const conteudoPrincipal = observacoes || textoColado || '';
        
        prompt = `IMPORTANTE: Use o MANUAL CVC abaixo para formatar este orçamento.\n\nMANUAL CVC COMPLETO:\n${manualCompleto}\n\nDADOS DO CLIENTE PARA PROCESSAR:\n${conteudoPrincipal}\n\n${destino ? `Destino adicional: ${destino}` : ''}\n${adultos ? `Adultos: ${adultos}` : ''}\n${criancas > 0 ? `Crianças: ${criancas}` : ''}\n${parcelamento ? `Parcelamento solicitado: ${parcelamento}` : ''}\n\nINSTRUÇÕES:\n1. IDENTIFIQUE o tipo de orçamento nos dados do cliente\n2. ENCONTRE o formato correspondente no manual\n3. USE EXATAMENTE esse formato\n4. Converta códigos de aeroporto para nomes (GRU→Guarulhos, SDU→Santos Dumont, etc)\n5. Use cidades no título (São Paulo ✈ Rio de Janeiro), não aeroportos\n6. ${parcelamento ? 'INCLUA o parcelamento solicitado' : 'NÃO inclua parcelamento (não foi solicitado)'}\n7. Termine com "Valores sujeitos a confirmação e disponibilidade"\n8. NÃO adicione WhatsApp, telefone ou validade\n\nFORMATO CRÍTICO:\n- Título: *[Companhia] - [Cidade] ✈ [Cidade]*\n- Voos: [Data] - [Aeroporto] [Hora] / [Aeroporto] [Hora] (tipo voo)\n- Separador: --\n- Valores e informações conforme o manual`;
      }

      // Escolher modelo baseado na complexidade
      const conteudoPrincipalCompleto = observacoes || textoColado || '';
      let useClaudeFor = imagemBase64 || pdfContent || (conteudoPrincipalCompleto && conteudoPrincipalCompleto.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      console.log(`📄 Manual carregado: ${manualCompleto.length} caracteres`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        if (!ANTHROPIC_KEY) {
          throw new Error('Anthropic API key não configurada.');
        }
        // ... (código para chamar Claude)
      } 
      else {
        // Usar GPT-4o-mini
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
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!gptResponse.ok) {
          const errorText = await gptResponse.text();
          throw new Error(`Erro ao processar com GPT: ${errorText}`);
        }

        const gptData = await gptResponse.json();
        resultado = gptData.choices[0].message.content;
      }

      console.log('✅ Processamento concluído');
      
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini',
        manualSource: 'Google Docs'
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro desconhecido ao processar orçamento',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    error: 'Método não suportado'
  });
}
