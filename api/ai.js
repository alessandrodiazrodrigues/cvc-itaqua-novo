// /api/ai.js - Versão completa com templates inline (sem import)

// 📋 TEMPLATES INLINE - Todos os templates do sistema
const templates = {
  'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [AEROPORTO_DESTINO_VOLTA_1] [HORA_SAIDA_VOLTA_1] / [AEROPORTO_ORIGEM_VOLTA_1] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [AEROPORTO_DESTINO_VOLTA_2] [HORA_SAIDA_VOLTA_2] / [AEROPORTO_ORIGEM_VOLTA_2] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]

📋 *OPÇÃO 3: [COMPANHIA_3]*
🗓️ [DATA_IDA_3] a [DATA_VOLTA_3] ([DURACAO_3])
✈️ Ida: [DATA_IDA_3] - [AEROPORTO_ORIGEM_3] [HORA_IDA_3] / [AEROPORTO_DESTINO_3] [HORA_CHEGADA_3]
✈️ Volta: [DATA_VOLTA_3] - [AEROPORTO_DESTINO_VOLTA_3] [HORA_SAIDA_VOLTA_3] / [AEROPORTO_ORIGEM_VOLTA_3] [HORA_CHEGADA_VOLTA_3]
💰 R$ [VALOR_TOTAL_3] para [COMPOSICAO_PASSAGEIROS_3]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`,

  'Aéreo Facial': `*Passagem Aérea*
[COMPANHIA_AEREA] 
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [AEROPORTO_DESTINO_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_ORIGEM_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 Pagamento em até [QTDE_PARCELAS]x de R$ [VALOR_PARCELA] s/ juros

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.`,

  'Aéreo VBI/Fácil': `*Passagem Aérea VBI - Venda Bem Informada*
[COMPANHIA_AEREA]
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [AEROPORTO_DESTINO_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_ORIGEM_VOLTA] [HORA_CHEGADA_VOLTA]

✅ *O que inclui:*
• Taxas de embarque
• Bagagem de mão [PESO_BAGAGEM_MAO]kg
• Item pessoal
• [OUTROS_INCLUSOS]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 Parcelamento: até [QTDE_PARCELAS]x no cartão de crédito

📋 *Documentação necessária:*
• RG ou CNH dentro da validade
• [DOCUMENTOS_ADICIONAIS]

⚠️ Preços sujeitos à disponibilidade. Garantimos o valor apenas na finalização da compra.`,

  'Hotel': `*Hospedagem*
🏨 [NOME_HOTEL] - [CATEGORIA_ESTRELAS]⭐
📍 [LOCALIZACAO_HOTEL]
🗓️ [DATA_CHECK_IN] a [DATA_CHECK_OUT] ([QTDE_NOITES] noites)
👥 [QTDE_ADULTOS] adultos[QTDE_CRIANCAS_TEXTO]

🏠 *Acomodação:*
[TIPO_QUARTO] com [REGIME_ALIMENTACAO]

✅ *Inclui:*
• [TIPO_CAFE]
• [WIFI_INCLUSO]
• [SERVICOS_INCLUSOS]

💰 R$ [VALOR_TOTAL_HOSPEDAGEM] para toda a estadia
💳 Parcelamento: [QTDE_PARCELAS]x de R$ [VALOR_PARCELA_HOTEL]

🌟 *Destaques do hotel:*
• [DESTAQUE_1]
• [DESTAQUE_2]
• [DESTAQUE_3]

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva.`,

  'default': `*Orçamento CVC Itaqua*
📍 Destino: [DESTINO]
🗓️ Período: [PERIODO_VIAGEM]
👥 Passageiros: [PASSAGEIROS]

💰 Valor: R$ [VALOR_ORCAMENTO]
💳 Formas de pagamento: [OPCOES_PAGAMENTO]

📋 *Serviços inclusos:*
[SERVICOS_DETALHADOS]

⚠️ Valores sujeitos a alteração conforme disponibilidade no momento da reserva.

📞 CVC Itaqua - Filial 6220
Estamos aqui para ajudar você a realizar essa viagem!`
};

export default async function handler(req, res) {
  try {
    console.log('🚀 [CVC] API iniciada - versão inline templates');
    console.log('🚀 [CVC] Método:', req.method);
    console.log('🚀 [CVC] URL:', req.url);
    
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // OPTIONS
    if (req.method === 'OPTIONS') {
      console.log('✅ [CVC] CORS OK');
      return res.status(200).json({ 
        message: 'CORS OK - templates inline',
        timestamp: new Date().toISOString()
      });
    }

    // GET
    if (req.method === 'GET') {
      console.log('✅ [CVC] GET test');
      return res.status(200).json({ 
        message: 'CVC Itaqua API Online - Templates Inline',
        version: '2.1.1-inline',
        timestamp: new Date().toISOString(),
        templates_available: Object.keys(templates),
        status: 'operational'
      });
    }

    // Apenas POST
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Método não permitido',
        allowedMethods: ['GET', 'POST', 'OPTIONS']
      });
    }

    // Validar body
    if (!req.body) {
      return res.status(400).json({ error: 'Body da requisição é obrigatório' });
    }
    
    const { prompt, tipo, destino, tipos, temImagem, arquivo } = req.body;
    
    // Validar prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório e deve ser uma string não vazia',
        received: { prompt: typeof prompt, length: prompt?.length || 0 }
      });
    }
    
    console.log('✅ [CVC] Dados válidos');
    console.log('📊 [CVC] Prompt length:', prompt.length);
    console.log('📊 [CVC] Tipos:', tipos);
    console.log('📊 [CVC] Tem imagem:', temImagem);

    // Seleção de template
    const template = selecionarTemplate(tipos, tipo, prompt);
    console.log('📝 [CVC] Template selecionado');
    
    // Construir prompt
    const promptFinal = construirPrompt(prompt, template, { destino, tipos, temImagem, tipo });
    console.log('🏗️ [CVC] Prompt construído, length:', promptFinal.length);
    
    // Chamar IA
    const responseIA = await chamarIA(promptFinal, temImagem, arquivo);
    console.log('✅ [CVC] IA respondeu, length:', responseIA.length);
    
    // Resposta final
    return res.status(200).json({
      success: true,
      choices: [{
        message: {
          content: responseIA
        }
      }],
      metadata: {
        timestamp: new Date().toISOString(),
        promptLength: prompt.length,
        responseLength: responseIA.length,
        templateUsed: template.substring(0, 50) + '...',
        tipos: tipos || [],
        temImagem: !!temImagem
      }
    });

  } catch (error) {
    console.error('💥 [CVC] Erro capturado:', error);
    
    const errorResponse = {
      success: false,
      error: {
        message: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      debug: {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5),
        method: req.method,
        hasBody: !!req.body
      }
    };
    
    try {
      return res.status(500).json(errorResponse);
    } catch (jsonError) {
      console.error('💥 [CVC] Erro crítico JSON:', jsonError);
      res.setHeader('Content-Type', 'text/plain');
      return res.status(500).send(`ERRO: ${error.message}`);
    }
  }
}

// 🎯 Seleção de template
function selecionarTemplate(tipos, tipoEspecifico, prompt) {
  console.log('🔍 [TEMPLATE] Selecionando...');
  
  try {
    const temMultiplasOpcoes = detectarMultiplasOpcoes(prompt);
    
    if (temMultiplasOpcoes && (tipos?.includes('Aéreo Facial') || tipos?.includes('Aéreo VBI/Fácil'))) {
      console.log('✅ [TEMPLATE] Múltiplas opções');
      return templates['Aéreo Múltiplas Opções'];
    }
    
    if (tipoEspecifico && templates[tipoEspecifico]) {
      console.log('✅ [TEMPLATE] Específico:', tipoEspecifico);
      return templates[tipoEspecifico];
    }
    
    if (tipos && Array.isArray(tipos) && tipos.length > 0) {
      for (const tipo of tipos) {
        if (templates[tipo]) {
          console.log('✅ [TEMPLATE] Encontrado:', tipo);
          return templates[tipo];
        }
      }
    }
    
    console.log('⚠️ [TEMPLATE] Usando padrão');
    return templates['Aéreo Facial'] || templates.default;
    
  } catch (error) {
    console.error('❌ [TEMPLATE] Erro:', error);
    return templates.default;
  }
}

// 🔍 Detecção de múltiplas opções
function detectarMultiplasOpcoes(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  
  try {
    const texto = prompt.toLowerCase();
    
    const indicadores = [
      { nome: 'totais_adultos', regex: /total.*\d+.*adult/gi, minimo: 2 },
      { nome: 'precos_reais', regex: /r\$.*\d{1,3}[\.,]\d{3}/gi, minimo: 2 },
      { nome: 'companhias', regex: /(gol|latam|azul|avianca|tap|american)/gi, minimo: 2 },
      { nome: 'horarios', regex: /\d{2}:\d{2}/g, minimo: 4 },
      { nome: 'datas_viagem', regex: /(ida|volta).*\d{2} de \w+/gi, minimo: 2 }
    ];
    
    let criteriosAtendidos = 0;
    let detalhes = {};
    
    indicadores.forEach(ind => {
      const matches = (texto.match(ind.regex) || []);
      detalhes[ind.nome] = matches.length;
      
      if (matches.length >= ind.minimo) {
        criteriosAtendidos++;
      }
    });
    
    const resultado = criteriosAtendidos > 0;
    
    console.log('🔍 [DETECÇÃO]', {
      detectado: resultado,
      criterios: criteriosAtendidos,
      detalhes
    });
    
    return resultado;
    
  } catch (error) {
    console.error('❌ [DETECÇÃO] Erro:', error);
    return false;
  }
}

// 🏗️ Construir prompt
function construirPrompt(promptBase, template, context) {
  try {
    const { destino, tipos, temImagem, tipo } = context;
    
    if (tipo === 'analise') {
      return `Você é um analista da CVC Itaqua. ${promptBase}`;
    }
    
    if (tipo === 'destino' || tipo === 'ranking') {
      return promptBase;
    }
    
    const isMultipleTemplate = template.includes('*OPÇÃO 1:*');
    
    return `Você é uma atendente da CVC Itaqua (filial 6220). 

Formate o orçamento usando EXATAMENTE este template:

=== TEMPLATE ===
${template}
=== FIM TEMPLATE ===

DADOS FORNECIDOS:
${promptBase}

INSTRUÇÕES:
1. Use EXATAMENTE o formato do template
2. Substitua valores [ENTRE_COLCHETES] pelos dados reais
3. Mantenha emojis e formatação
4. Valores em Real (R$)
5. Pronto para WhatsApp
6. Sem explicações extras

${isMultipleTemplate ? `
MÚLTIPLAS OPÇÕES:
- Identifique TODAS as opções no texto
- Preencha cada OPÇÃO com dados específicos
- Use valores TOTAIS de cada opção
- Remova seções vazias se houver menos de 3 opções
` : `
OPÇÃO ÚNICA:
- Use a melhor opção disponível
- Calcule valores corretamente
`}

${temImagem ? 'ATENÇÃO: Extraia dados da imagem anexada.' : ''}

Contexto: ${destino || 'N/A'} | Tipos: ${tipos?.join(', ') || 'N/A'}`;
    
  } catch (error) {
    console.error('❌ [PROMPT] Erro:', error);
    return `Formate este orçamento: ${promptBase}`;
  }
}

// 🤖 Chamar IA
async function chamarIA(prompt, temImagem, arquivo) {
  console.log('🤖 [IA] Iniciando...');
  
  try {
    const temOpenAI = !!process.env.OPENAI_API_KEY;
    const temClaude = !!process.env.ANTHROPIC_API_KEY;
    
    console.log('🤖 [IA] APIs - OpenAI:', temOpenAI, 'Claude:', temClaude);
    
    if (!temOpenAI && !temClaude) {
      throw new Error('Nenhuma API Key configurada (OPENAI_API_KEY ou ANTHROPIC_API_KEY)');
    }
    
    if (temOpenAI) {
      console.log('🔵 [IA] Usando OpenAI');
      return await chamarOpenAI(prompt, temImagem, arquivo);
    } else {
      console.log('🟠 [IA] Usando Claude');
      return await chamarClaude(prompt, temImagem, arquivo);
    }
    
  } catch (error) {
    console.error('❌ [IA] Erro:', error);
    throw new Error(`Erro na IA: ${error.message}`);
  }
}

// 🔵 OpenAI
async function chamarOpenAI(prompt, temImagem, arquivo) {
  try {
    let messages;
    
    if (temImagem && arquivo) {
      messages = [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: arquivo, detail: "high" } }
        ]
      }];
    } else {
      messages = [{ role: "user", content: prompt }];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 2500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenAI resposta inválida');
    }

    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('❌ [OPENAI] Erro:', error);
    throw error;
  }
}

// 🟠 Claude  
async function chamarClaude(prompt, temImagem, arquivo) {
  try {
    let content;
    
    if (temImagem && arquivo) {
      const base64Match = arquivo.match(/data:image\/[^;]+;base64,(.+)/);
      if (!base64Match) {
        throw new Error('Formato de imagem inválido');
      }
      
      const base64Data = base64Match[1];
      const mimeType = arquivo.match(/data:(image\/[^;]+)/)?.[1] || 'image/jpeg';
      
      content = [
        { type: "text", text: prompt },
        { type: "image", source: { type: "base64", media_type: mimeType, data: base64Data } }
      ];
    } else {
      content = prompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2500,
        temperature: 0.3,
        messages: [{ role: 'user', content: content }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data.content?.[0]?.text) {
      throw new Error('Claude resposta inválida');
    }

    return data.content[0].text;
    
  } catch (error) {
    console.error('❌ [CLAUDE] Erro:', error);
    throw error;
  }
}

console.log('✅ [CVC] Módulo carregado - templates inline');
