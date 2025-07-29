// Adicionar ao api/ai.js - função chamarOpenAIOtimizada

async function chamarOpenAIOtimizada(prompt, temImagem, arquivo, modelo) {
  try {
    let messages;
    
    if (temImagem && arquivo) {
      console.log('🖼️ [OPENAI] Processando com imagem usando', modelo);
      
      // ✅ VALIDAÇÕES MELHORADAS BASE64
      if (!arquivo || typeof arquivo !== 'string') {
        throw new Error('Arquivo de imagem inválido');
      }
      
      // Verificar formato base64 (deve começar com data:image/)
      if (!arquivo.startsWith('data:image/')) {
        throw new Error('Formato de imagem não suportado. Esperado: data:image/...');
      }
      
      // Verificar se contém base64
      if (!arquivo.includes('base64,')) {
        throw new Error('Imagem deve estar em formato base64');
      }
      
      // Extrair informações do base64
      const [header, base64Data] = arquivo.split('base64,');
      const mimeType = header.match(/data:(image\/[^;]+)/)?.[1];
      
      console.log('🖼️ [OPENAI] MIME Type:', mimeType);
      console.log('🖼️ [OPENAI] Base64 length:', base64Data?.length || 0);
      
      // Verificar tamanho (aproximado em bytes)
      const sizeInBytes = (base64Data?.length || 0) * 0.75; // base64 é ~33% maior
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      console.log('🖼️ [OPENAI] Tamanho estimado:', sizeInMB.toFixed(2), 'MB');
      
      if (sizeInMB > 20) {
        throw new Error(`Imagem muito grande: ${sizeInMB.toFixed(2)}MB. Máximo: 20MB`);
      }
      
      // Verificar se MIME type é suportado
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (mimeType && !supportedTypes.includes(mimeType)) {
        throw new Error(`Tipo de imagem não suportado: ${mimeType}. Use: JPEG, PNG, WebP ou GIF`);
      }

      // ✅ ESTRUTURA CORRETA PARA GPT-4o
      messages = [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { 
              url: arquivo,  // URL completa com data:image/...
              detail: "high" // Alta resolução para melhor análise
            } 
          }
        ]
      }];
      
      console.log('✅ [OPENAI] Imagem validada e preparada');
      
    } else {
      console.log('📝 [OPENAI] Processando texto usando', modelo);
      messages = [{ role: "user", content: prompt }];
    }

    // ✅ CHAMADA API COM TRATAMENTO DE ERRO ESPECÍFICO
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelo,  // gpt-4o para imagens, gpt-4o-mini para texto
        messages,
        max_tokens: 2500,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OPENAI] Status:', response.status);
      console.error('❌ [OPENAI] Error body:', errorText);
      
      // Tratamento específico para erros de imagem
      if (errorText.includes('image') || errorText.includes('base64') || errorText.includes('content blocks')) {
        // Tentar com modelo vision específico se necessário
        if (modelo === 'gpt-4o' && errorText.includes('vision')) {
          console.log('🔄 [OPENAI] Tentando com gpt-4-vision-preview...');
          
          const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4-vision-preview',
              messages,
              max_tokens: 2500,
              temperature: 0.2
            })
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            return {
              content: fallbackData.choices[0].message.content,
              usage: fallbackData.usage
            };
          }
        }
        
        throw new Error(`Erro no processamento da imagem: ${errorText.substring(0, 300)}`);
      }
      
      throw new Error(`OpenAI API Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('❌ [OPENAI] Resposta inválida:', JSON.stringify(data, null, 2));
      throw new Error('OpenAI resposta sem conteúdo');
    }

    console.log('✅ [OPENAI] Sucesso! Resposta:', data.choices[0].message.content.length, 'caracteres');
    console.log('💰 [OPENAI] Tokens usados:', data.usage?.total_tokens || 'N/A');

    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
    
  } catch (error) {
    console.error('❌ [OPENAI] Erro final:', error.message);
    console.error('❌ [OPENAI] Stack:', error.stack?.split('\n').slice(0, 3));
    throw error;
  }
}

// ✅ FUNÇÃO AUXILIAR - Validar base64 no frontend
function validarImagemBase64(base64String) {
  try {
    if (!base64String || typeof base64String !== 'string') {
      return { valido: false, erro: 'String base64 inválida' };
    }
    
    if (!base64String.startsWith('data:image/')) {
      return { valido: false, erro: 'Não é uma imagem base64 válida' };
    }
    
    if (!base64String.includes('base64,')) {
      return { valido: false, erro: 'Formato base64 incorreto' };
    }
    
    const [header, base64Data] = base64String.split('base64,');
    
    if (!base64Data || base64Data.length < 100) {
      return { valido: false, erro: 'Dados base64 muito pequenos' };
    }
    
    // Verificar se é base64 válido (regex simples)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64Data.substring(0, 100))) {
      return { valido: false, erro: 'Dados base64 inválidos' };
    }
    
    const mimeType = header.match(/data:(image\/[^;]+)/)?.[1];
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (mimeType && !supportedTypes.includes(mimeType)) {
      return { valido: false, erro: `Tipo ${mimeType} não suportado` };
    }
    
    const sizeInBytes = base64Data.length * 0.75;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 20) {
      return { valido: false, erro: `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB` };
    }
    
    return { 
      valido: true, 
      mimeType, 
      tamanhoMB: sizeInMB.toFixed(2),
      tamanhoBase64: base64Data.length 
    };
    
  } catch (error) {
    return { valido: false, erro: `Erro na validação: ${error.message}` };
  }
}

// ✅ USAR NO FRONTEND - antes de enviar para API
function extractFormData(form) {
  // ... código existente ...
  
  const arquivoBase64 = formElements.previewArea?.dataset.fileData || "";
  const temImagem = !!(arquivoBase64 && arquivoBase64.startsWith('data:image/'));
  
  // ✅ VALIDAR IMAGEM ANTES DE ENVIAR
  if (temImagem) {
    const validacao = validarImagemBase64(arquivoBase64);
    
    if (!validacao.valido) {
      alert(`❌ Erro na imagem: ${validacao.erro}`);
      throw new Error(`Imagem inválida: ${validacao.erro}`);
    }
    
    console.log('✅ [VALIDAÇÃO] Imagem válida:', {
      mimeType: validacao.mimeType,
      tamanho: validacao.tamanhoMB + 'MB',
      base64Length: validacao.tamanhoBase64
    });
    
    // Mostrar feedback de validação
    const feedback = document.createElement('div');
    feedback.style.cssText = 'background: #d4edda; padding: 8px; border-radius: 4px; margin: 5px 0; font-size: 12px; color: #155724;';
    feedback.innerHTML = `✅ Imagem válida: ${validacao.mimeType} (${validacao.tamanhoMB}MB)`;
    
    if (formElements.previewArea && !formElements.previewArea.querySelector('.validacao-feedback')) {
      feedback.className = 'validacao-feedback';
      formElements.previewArea.appendChild(feedback);
    }
  }
  
  return {
    // ... dados existentes ...
    arquivoBase64: arquivoBase64,
    temImagem: temImagem
  };
}
