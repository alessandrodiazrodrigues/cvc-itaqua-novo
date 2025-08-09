// 🚀 CVC ITAQUA v4.0 - COM MANUAL JSON
// Lê o manual do arquivo JSON e usa os formatos corretos

import manualCVC from '../manual-cvc.json';

export default async function handler(req, res) {
  console.log('🤖 CVC v4.0 - Requisição recebida');
  
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
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    
    return res.status(200).json({
      success: true,
      status: 'online',
      version: '4.0-manual-json',
      message: 'CVC Itaqua v4.0 - Manual JSON Integrado',
      manual: {
        versao: manualCVC.versao,
        formatos: Object.keys(manualCVC.formatos).length + ' formatos disponíveis',
        ultima_atualizacao: manualCVC.ultima_atualizacao
      },
      config: {
        openai: hasOpenAI ? 'Configurada ✅' : 'Não configurada ❌',
        anthropic: hasAnthropic ? 'Configurada ✅' : 'Não configurada ❌'
      }
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
        tipo = 'orcamento'
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
        prompt = `Gere dicas em português para: ${destino}
        
Use EXATAMENTE este formato:

🌟 **DICAS ${destino.toUpperCase()}**

📍 **Melhor época:**
[época ideal para visitar]

🏖️ **Praias imperdíveis:**
• [praia 1 com breve descrição]
• [praia 2 com breve descrição]
• [praia 3 com breve descrição]

🍽️ **Gastronomia local:**
• [prato típico 1]
• [prato típico 2]
• [restaurante recomendado]

💡 **Dica especial:**
[dica importante ou curiosidade local]

⚠️ **Importante:**
[aviso ou recomendação de segurança]`;
      } 
      else if (tipo === 'ranking' && destino) {
        prompt = `Gere ranking de hotéis para: ${destino}

Use EXATAMENTE este formato:

🏆 **TOP 5 HOTÉIS - ${destino.toUpperCase()}**

**1️⃣ [Nome Hotel Premium]**
⭐⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal - ex: Vista mar, pé na areia]
💰 Diária média: R$ [valor]

**2️⃣ [Nome Hotel]**
⭐⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**3️⃣ [Nome Hotel]**
⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**4️⃣ [Nome Hotel]**
⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**5️⃣ [Nome Hotel]**
⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque - boa relação custo-benefício]
💰 Diária média: R$ [valor]`;
      }
      else {
        // Orçamento normal - usar formatos do manual
        const conteudoPrincipal = observacoes || textoColado || '';
        
        // Detectar tipo de orçamento
        let tipoOrcamento = 'aereo_ida_volta_simples'; // default
        
        // Lógica de detecção
        const textoAnalise = conteudoPrincipal.toLowerCase();
        
        if (textoAnalise.includes('somente ida') || textoAnalise.includes('apenas ida')) {
          tipoOrcamento = 'aereo_somente_ida';
        } else if (textoAnalise.includes('opção 1') && textoAnalise.includes('opção 2') && textoAnalise.includes('opção 3')) {
          tipoOrcamento = 'aereo_multiplas_opcoes_3';
        } else if (textoAnalise.includes('opção 1') && textoAnalise.includes('opção 2')) {
          tipoOrcamento = 'aereo_multiplas_opcoes_2';
        } else if (textoAnalise.includes('multitrecho') || textoAnalise.includes('trecho 1')) {
          tipoOrcamento = 'multitrecho';
        } else if (textoAnalise.includes('o pacote inclui') || textoAnalise.includes('noites de hospedagem')) {
          tipoOrcamento = 'pacote_completo';
        } else if (textoAnalise.includes('cruzeiro') || textoAnalise.includes('navio')) {
          tipoOrcamento = 'cruzeiro';
        } else if (textoAnalise.includes('conexão em') && textoAnalise.includes('espera')) {
          tipoOrcamento = 'aereo_ida_volta_conexao_detalhada';
        }
        
        const formatoEscolhido = manualCVC.formatos[tipoOrcamento];
        
        prompt = `IMPORTANTE: Use EXATAMENTE o formato do manual CVC para processar este orçamento.

**DADOS DO CLIENTE:**
${conteudoPrincipal}

${destino ? `Destino adicional informado: ${destino}` : ''}
${adultos ? `Adultos: ${adultos}` : ''}
${criancas > 0 ? `Crianças: ${criancas}` : ''}

**FORMATO DETECTADO:** ${formatoEscolhido.nome}

**TEMPLATE A SEGUIR:**
${formatoEscolhido.template}

**EXEMPLO DO FORMATO:**
${formatoEscolhido.exemplo || 'Seguir o template acima'}

**REGRAS OBRIGATÓRIAS:**
1. EXTRAIA todos os dados do texto fornecido (datas, horários, valores, companhias, etc)
2. SUBSTITUA as variáveis {campo} pelos dados reais extraídos
3. MANTENHA exatamente a estrutura e emojis do template
4. Para passageiros: use formato "${manualCVC.regras.passageiros.exemplos[1]}"
5. Para valores: use formato "${manualCVC.regras.valores.exemplo}"
6. Para reembolso: use "${manualCVC.regras.reembolso.nao_reembolsavel}" ou "${manualCVC.regras.reembolso.reembolsavel}"
7. Reembolso: Se não especificado, use "${manualCVC.regras.reembolso.nao_reembolsavel}"

**PARCELAMENTO:**
${parcelamento ? `INCLUIR parcelamento ${parcelamento} usando formato "${manualCVC.regras.parcelamento.formato_simples}"` : 
  conteudoPrincipal.includes('x de R
      }

      // Definir conteudoPrincipal para todos os casos
      const conteudoPrincipal = observacoes || textoColado || '';
      
      // Escolher modelo baseado na complexidade
      const useClaudeFor = imagemBase64 || pdfContent || 
                          (conteudoPrincipal && conteudoPrincipal.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      console.log(`📋 Formato detectado: ${tipoOrcamento || 'N/A'}`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude para casos complexos
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_KEY) {
          console.warn('⚠️ Claude não configurado, usando GPT como fallback');
          useClaudeFor = false;
        } else {
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
      } 
      
      if (!useClaudeFor) {
        // Usar GPT-4o-mini
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada. Verifique OPENAI_API_KEY no Vercel.');
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
            temperature: 0.3, // Mais determinístico para seguir o formato
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
      
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini',
        formato_usado: tipoOrcamento || tipo
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
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
}) || conteudoPrincipal.includes('parcelamento') ? 
  'MANTER o parcelamento que está no texto original' : 
  'NÃO INCLUIR parcelamento (não foi solicitado)'}

**REGRA IMPORTANTE:**
- NÃO adicione informações de contato (WhatsApp, telefone)
- NÃO adicione validade do orçamento
- Use APENAS os dados fornecidos no texto
- Mantenha links se fornecidos
- Termine com: "Valores sujeitos a confirmação e disponibilidade"`;
      }

      // Definir conteudoPrincipal para todos os casos
      const conteudoPrincipal = observacoes || textoColado || '';
      
      // Escolher modelo baseado na complexidade
      const useClaudeFor = imagemBase64 || pdfContent || 
                          (conteudoPrincipal && conteudoPrincipal.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      console.log(`📋 Formato detectado: ${tipoOrcamento || 'N/A'}`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude para casos complexos
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_KEY) {
          console.warn('⚠️ Claude não configurado, usando GPT como fallback');
          useClaudeFor = false;
        } else {
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
      } 
      
      if (!useClaudeFor) {
        // Usar GPT-4o-mini
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada. Verifique OPENAI_API_KEY no Vercel.');
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
            temperature: 0.3, // Mais determinístico para seguir o formato
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
      
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini',
        formato_usado: tipoOrcamento || tipo
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
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
