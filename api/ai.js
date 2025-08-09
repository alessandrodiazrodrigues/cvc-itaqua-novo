// 🚀 CVC ITAQUA v2.0 - BACKEND ULTRA SIMPLIFICADO
// Apenas 1 arquivo, sem módulos, tudo inline
// Manual no Google Docs faz tudo!

export default async function handler(req, res) {
  console.log('🤖 CVC v2.0 - Requisição recebida');
  
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
    return res.status(200).json({
      success: true,
      status: 'online',
      version: '2.0-simplificado',
      message: 'CVC Itaqua v2.0 - Manual Google Docs'
    });
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
        tipo = 'orcamento' // default
      } = req.body;

      console.log('📋 Dados recebidos:', { 
        temImagem: !!imagemBase64, 
        temPDF: !!pdfContent,
        tipo,
        destino 
      });

      // Construir prompt baseado no tipo
      let prompt = '';
      
      if (tipo === 'dicas' && destino) {
        prompt = `CONSULTE O MANUAL e gere dicas em português para: ${destino}
        
Use EXATAMENTE este formato do manual:

🌟 **DICAS ${destino.toUpperCase()}**

📍 **Melhor época:**
[época ideal]

🏖️ **Praias imperdíveis:**
• [praia 1]
• [praia 2]

🍽️ **Gastronomia local:**
• [prato típico]
• [restaurante]

💡 **Dica especial:**
[dica importante]

⚠️ **Importante:**
[aviso ou recomendação]`;
      } 
      else if (tipo === 'ranking' && destino) {
        prompt = `CONSULTE O MANUAL e gere ranking de hotéis para: ${destino}

Use EXATAMENTE este formato:

🏆 **TOP 5 HOTÉIS - ${destino.toUpperCase()}**

**1️⃣ [Nome Hotel]**
⭐ [estrelas] | 📍 [localização]
✨ [destaque principal]

**2️⃣ [Nome Hotel]**
⭐ [estrelas] | 📍 [localização]
✨ [destaque]

**3️⃣ [Nome Hotel]**
⭐ [estrelas] | 📍 [localização]
✨ [destaque]

**4️⃣ [Nome Hotel]**
⭐ [estrelas] | 📍 [localização]
✨ [destaque]

**5️⃣ [Nome Hotel]**
⭐ [estrelas] | 📍 [localização]
✨ [destaque]`;
      }
      else {
        // Orçamento normal
        const conteudoPrincipal = observacoes || textoColado || 'Criar orçamento padrão';
        
        prompt = `CONSULTE O MANUAL DA CVC ITAQUA e processe este pedido de orçamento.

**DADOS DO CLIENTE:**
${conteudoPrincipal}

${destino ? `Destino: ${destino}` : ''}
${adultos ? `Adultos: ${adultos}` : ''}
${criancas > 0 ? `Crianças: ${criancas}` : ''}
${tipos.length > 0 ? `Tipos solicitados: ${tipos.join(', ')}` : ''}

**FORMATO OBRIGATÓRIO DO MANUAL:**

✈️ **CVC ITAQUA - ORÇAMENTO**
📍 **Destino:** [local]
📅 **Período:** [datas]
👥 **Passageiros:** [qtd adultos + crianças com idades]

[detalhes do voo/hotel/pacote conforme o manual]

💰 **VALORES:**
• Por pessoa: R$ X.XXX,XX
• Total: R$ X.XXX,XX

${parcelamento ? `📳 **PARCELAMENTO:**
• ${parcelamento === '10x' ? '10x de R$ XXX,XX' : ''}
${parcelamento === '12x' ? '12x de R$ XXX,XX' : ''}
${parcelamento === '15x' ? '15x de R$ XXX,XX' : ''}` : ''}

📞 **RESERVAS:**
WhatsApp: (11) 94025-4949
Consultor: Jorge - CVC Itaquá

⏰ **Válido por 24h**`;
      }

      // Definir conteudoPrincipal para todos os casos
      const conteudoPrincipal = observacoes || textoColado || '';
      
      // Escolher modelo baseado na complexidade
      const useClaudeFor = imagemBase64 || pdfContent || 
                          (conteudoPrincipal && conteudoPrincipal.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude para casos complexos
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_KEY) {
          throw new Error('Claude API key não configurada');
        }
        
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{
              role: 'user',
              content: imagemBase64 ? [
                { type: 'text', text: prompt },
                { 
                  type: 'image', 
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: imagemBase64.split(',')[1]
                  }
                }
              ] : prompt
            }]
          })
        });

        if (!claudeResponse.ok) {
          const error = await claudeResponse.text();
          console.error('❌ Erro Claude:', error);
          throw new Error('Erro ao processar com Claude');
        }

        const claudeData = await claudeResponse.json();
        resultado = claudeData.content[0].text;
      } 
      else {
        // Usar GPT-4o-mini para casos simples
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada');
        }
        
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!gptResponse.ok) {
          const error = await gptResponse.text();
          console.error('❌ Erro GPT:', error);
          throw new Error('Erro ao processar com GPT');
        }

        const gptData = await gptResponse.json();
        resultado = gptData.choices[0].message.content;
      }

      console.log('✅ Processamento concluído');
      
      // SEMPRE retornar JSON válido
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini'
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
      // SEMPRE retornar JSON válido mesmo em erro
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar orçamento',
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
