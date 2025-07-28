// /api/ai.js - API completa com debug robusto e tratamento de erros

import { templates } from './templates.js';

export default async function handler(req, res) {
  // 🛡️ TRATAMENTO DE ERRO GLOBAL
  try {
    console.log('🚀 [CVC API] Requisição iniciada');
    console.log('🚀 [CVC API] Método:', req.method);
    console.log('🚀 [CVC API] URL:', req.url);
    console.log('🚀 [CVC API] Headers:', JSON.stringify(req.headers, null, 2));
    
    // 🌐 CORS HEADERS - SEMPRE PRIMEIRO
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // ⚙️ OPTIONS (CORS Preflight)
    if (req.method === 'OPTIONS') {
      console.log('✅ [CVC API] Respondendo OPTIONS (CORS)');
      return res.status(200).json({ 
        message: 'CORS preflight OK',
        methods: ['GET', 'POST', 'OPTIONS'],
        timestamp: new Date().toISOString()
      });
    }

    // 🧪 GET (Teste de conectividade)
    if (req.method === 'GET') {
      console.log('✅ [CVC API] Respondendo GET (teste)');
      return res.status(200).json({ 
        message: 'CVC Itaqua API Online',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        status: 'operational',
        endpoints: {
          health: 'GET /api/ai',
          process: 'POST /api/ai'
        },
        features: [
          'Múltiplas opções de passagens',
          'Templates dinâmicos',
          'Suporte a imagens',
          'OpenAI & Claude'
        ]
      });
    }

    // 🚫 Métodos não permitidos
    if (req.method !== 'POST') {
      console.log('❌ [CVC API] Método não permitido:', req.method);
      return res.status(405).json({ 
        error: 'Método não permitido',
        message: `Método ${req.method} não é suportado`,
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
        timestamp: new Date().toISOString()
      });
    }

    // 📥 PROCESSAMENTO POST
    console.log('📥 [CVC API] Processando POST...');
    
    // Validar se body existe
    if (!req.body) {
      console.log('❌ [CVC API] Body vazio');
      return res.status(400).json({ 
        error: 'Body da requisição é obrigatório',
        expected: {
          prompt: 'string (obrigatório)',
          tipo: 'string (opcional)',
          destino: 'string (opcional)',
          tipos: 'array (opcional)',
          temImagem: 'boolean (opcional)',
          arquivo: 'string base64 (opcional)'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('📥 [CVC API] Body recebido (primeiros 200 chars):', JSON.stringify(req.body).substring(0, 200) + '...');
    
    const { prompt, tipo, destino, tipos, temImagem, arquivo } = req.body;
    
    // 🔍 Validação de dados
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.log('❌ [CVC API] Prompt inválido:', prompt);
      return res.status(400).json({ 
        error: 'Prompt é obrigatório e deve ser uma string não vazia',
        received: {
          prompt: typeof prompt,
          length: prompt?.length || 0,
          tipo,
          destino,
          tipos: Array.isArray(tipos) ? tipos.length : typeof tipos
        },
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ [CVC API] Dados válidos recebidos');
    console.log('📊 [CVC API] Prompt length:', prompt.length);
    console.log('📊 [CVC API] Tipo:', tipo);
    console.log('📊 [CVC API] Destino:', destino);
    console.log('📊 [CVC API] Tipos:', tipos);
    console.log('📊 [CVC API] Tem imagem:', temImagem);

    // 🎯 SELEÇÃO DE TEMPLATE
    console.log('🎯 [CVC API] Selecionando template...');
    const template = selecionarTemplate(tipos, tipo, prompt);
    console.log('📝 [CVC API] Template selecionado, length:', template.length);
    
    // 🏗️ CONSTRUÇÃO DO PROMPT
    console.log('🏗️ [CVC API] Construindo prompt final...');
    const promptFinal = construirPrompt(prompt, template, { 
      destino, 
      tipos, 
      temImagem,
      tipo 
    });
    
    console.log('🤖 [CVC API] Prompt final construído, length:', promptFinal.length);
    console.log('🤖 [CVC API] Enviando para IA...');
    
    // 🤖 CHAMADA DA IA
    const responseIA = await chamarIA(promptFinal, temImagem, arquivo);
    
    console.log('✅ [CVC API] IA respondeu');
    console.log('✅ [CVC API] Response length:', responseIA.length);
    console.log('✅ [CVC API] Preview response:', responseIA.substring(0, 100) + '...');
    
    // 📤 RESPOSTA FINAL
    const finalResponse = { 
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
        temImagem: !!temImagem,
        destino: destino || 'Não especificado'
      }
    };
    
    console.log('✅ [CVC API] Enviando resposta final');
    return res.status(200).json(finalResponse);

  } catch (error) {
    // 🚨 TRATAMENTO DE ERRO ABRANGENTE
    console.error('💥 [CVC API] ERRO CAPTURADO:', error);
    console.error('💥 [CVC API] Nome:', error.name);
    console.error('💥 [CVC API] Mensagem:', error.message);
    console.error('💥 [CVC API] Stack:', error.stack);
    
    // Categorizar o erro
    let errorCategory = 'unknown';
    let httpStatus = 500;
    
    if (error.message.includes('API Key')) {
      errorCategory = 'api_key';
      httpStatus = 500;
    } else if (error.message.includes('fetch')) {
      errorCategory = 'network';
      httpStatus = 502;
    } else if (error.message.includes('JSON')) {
      errorCategory = 'parsing';
      httpStatus = 422;
    } else if (error.message.includes('template')) {
      errorCategory = 'template';
      httpStatus = 500;
    }
    
    const errorResponse = {
      success: false,
      error: {
        message: error.message || 'Erro interno do servidor',
        category: errorCategory,
        code: `CVC_${errorCategory.toUpperCase()}`,
        timestamp: new Date().toISOString()
      },
      debug: {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5), // Primeiras 5 linhas
        method: req.method,
        url: req.url,
        hasBody: !!req.body,
        bodyKeys: req.body ? Object.keys(req.body) : []
      },
      help: {
        message: 'Se o erro persistir, verifique os logs ou entre em contato com o suporte',
        documentation: 'https://github.com/cvc-itaqua/sistema'
      }
    };
    
    // Garantir que sempre retornamos JSON válido
    try {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(httpStatus).json(errorResponse);
    } catch (jsonError) {
      console.error('💥 [CVC API] ERRO AO GERAR JSON DE ERRO:', jsonError);
      // Fallback para texto plano se JSON falhar
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(500).send(`ERRO CRÍTICO: ${error.message}\nTimestamp: ${new Date().toISOString()}`);
    }
  }
}

// 🎯 SELEÇÃO DE TEMPLATE
function selecionarTemplate(tipos, tipoEspecifico, prompt) {
  console.log('🔍 [TEMPLATE] Selecionando para:', { tipos, tipoEspecifico });
  
  try {
    // Detectar múltiplas opções
    const temMultiplasOpcoes = detectarMultiplasOpcoes(prompt);
    console.log('🔍 [TEMPLATE] Múltiplas opções:', temMultiplasOpcoes);
    
    if (temMultiplasOpcoes && (tipos?.includes('Aéreo Facial') || tipos?.includes('Aéreo VBI/Fácil'))) {
      console.log('✅ [TEMPLATE] Usando template de múltiplas opções');
      return templates['Aéreo Múltiplas Opções'] || templates.default || getDefaultTemplate();
    }
    
    // Template específico
    if (tipoEspecifico && templates[tipoEspecifico]) {
      console.log('✅ [TEMPLATE] Template específico encontrado:', tipoEspecifico);
      return templates[tipoEspecifico];
    }
    
    // Primeiro tipo válido dos selecionados
    if (tipos && Array.isArray(tipos) && tipos.length > 0) {
      for (const tipo of tipos) {
        if (templates[tipo]) {
          console.log('✅ [TEMPLATE] Template encontrado para tipo:', tipo);
          return templates[tipo];
        }
      }
    }
    
    // Fallback seguro
    console.log('⚠️ [TEMPLATE] Usando template padrão');
    return templates['Aéreo Facial'] || templates.default || getDefaultTemplate();
    
  } catch (error) {
    console.error('❌ [TEMPLATE] Erro na seleção:', error);
    return getDefaultTemplate();
  }
}

// 🔍 DETECÇÃO DE MÚLTIPLAS OPÇÕES (MELHORADA)
function detectarMultiplasOpcoes(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  
  try {
    const texto = prompt.toLowerCase();
    
    // Indicadores com regex otimizada
    const indicadores = [
      { nome: 'totais_adultos', regex: /total.*\d+.*adult/gi, minimo: 2 },
      { nome: 'precos_reais', regex: /r\$.*\d{1,3}[\.,]\d{3}/gi, minimo: 2 },
      { nome: 'companhias', regex: /(gol|latam|azul|avianca|tap|american|united|delta|lufthansa)/gi, minimo: 2 },
      { nome: 'horarios', regex: /\d{2}:\d{2}/g, minimo: 4 },
      { nome: 'datas_viagem', regex: /(ida|volta).*\d{2} de \w+/gi, minimo: 2 },
      { nome: 'links_cvc', regex: /https:\/\/www\.cvc\.com\.br\/carrinho-dinamico/gi, minimo: 2 },
      { nome: 'classe_voo', regex: /classe.*econômica/gi, minimo: 2 },
      { nome: 'voo_direto', regex: /voo direto/gi, minimo: 2 }
    ];
    
    let contadores = {};
    let detalhes = {};
    let criteriosAtendidos = [];
    
    indicadores.forEach(indicador => {
      const matches = (texto.match(indicador.regex) || []);
      contadores[indicador.nome] = matches.length;
      detalhes[indicador.nome] = matches.slice(0, 5); // Máximo 5 exemplos
      
      if (matches.length >= indicador.minimo) {
        criteriosAtendidos.push(indicador.nome);
      }
    });
    
    const resultado = criteriosAtendidos.length > 0;
    
    console.log('🔍 [DETECÇÃO] Resultado:', {
      detectado: resultado,
      criteriosAtendidos,
      contadores,
      total_criterios: criteriosAtendidos.length
    });
    
    return resultado;
    
  } catch (error) {
    console.error('❌ [DETECÇÃO] Erro:', error);
    return false; // Fallback seguro
  }
}

// 🏗️ CONSTRUÇÃO DO PROMPT
function construirPrompt(promptBase, template, context) {
  console.log('🏗️ [PROMPT] Construindo prompt...');
  
  try {
    const { destino, tipos, temImagem, tipo } = context;
    
    // Para análise de PDFs/relatórios
    if (tipo === 'analise') {
      console.log('🏗️ [PROMPT] Modo análise');
      return `Você é um analista experiente da CVC Itaqua (filial 6220). 

Analise o conteúdo fornecido e extraia informações relevantes para a gestão da filial.

CONTEÚDO PARA ANÁLISE:
${promptBase}

Formate sua resposta de forma executiva, clara e acionável.`;
    }
    
    // Para dicas de destino
    if (tipo === 'destino') {
      console.log('🏗️ [PROMPT] Modo destino');
      return promptBase; // Já vem formatado
    }
    
    // Para ranking de hotéis
    if (tipo === 'ranking') {
      console.log('🏗️ [PROMPT] Modo ranking');
      return promptBase; // Já vem formatado
    }
    
    // Para orçamentos (PRINCIPAL)
    console.log('🏗️ [PROMPT] Modo orçamento');
    const isMultipleTemplate = template.includes('*OPÇÃO 1:*');
    console.log('🏗️ [PROMPT] Template múltiplas opções:', isMultipleTemplate);
    
    let promptFinal = `Você é uma atendente experiente da CVC Itaqua (filial 6220). 

Sua especialidade é formatar orçamentos de viagem para envio por WhatsApp de forma profissional e atrativa.

IMPORTANTE: Use EXATAMENTE o template abaixo como base, substituindo os valores entre [COLCHETES] pelos dados reais extraídos:

=== TEMPLATE PARA USAR ===
${template}
=== FIM DO TEMPLATE ===

DADOS FORNECIDOS PELO CLIENTE:
${promptBase}

INSTRUÇÕES OBRIGATÓRIAS:
1. Use EXATAMENTE o formato do template acima
2. Substitua TODOS os valores [ENTRE_COLCHETES] pelos dados reais encontrados
3. Mantenha TODOS os emojis e formatação original
4. Use valores sempre em Real (R$) com formatação brasileira
5. O resultado deve estar 100% pronto para copiar e colar no WhatsApp
6. NÃO adicione explicações ou comentários extras
7. NÃO inclua as marcações de template (=== TEMPLATE ===, etc) na resposta final

${isMultipleTemplate ? `
INSTRUÇÕES ESPECÍFICAS PARA MÚLTIPLAS OPÇÕES:
8. CRÍTICO: Identifique TODAS as opções de passagens disponíveis no texto
9. Preencha TODAS as opções encontradas (OPÇÃO 1, OPÇÃO 2, OPÇÃO 3, etc.)
10. Para cada opção, extraia com precisão: datas, horários, valores TOTAIS e companhias
11. VALORES: Use sempre o valor TOTAL exato informado para cada opção
12. Se houver menos de 3 opções no texto, remova as seções vazias do template
13. Cada opção deve mostrar claramente a companhia aérea correspondente
14. Mantenha a ordem das opções conforme aparecem no texto original
` : `
INSTRUÇÕES ESPECÍFICAS PARA OPÇÃO ÚNICA:
8. Se o texto contém múltiplas opções, use apenas a primeira/melhor opção
9. Calcule corretamente valores por pessoa baseado no total informado
10. Destaque claramente a companhia aérea e horários
`}

${temImagem ? 'ATENÇÃO ESPECIAL: Há uma imagem anexada. Extraia com precisão todas as informações visíveis (preços, datas, companhias, horários, links) da imagem para preencher o template corretamente.' : ''}

CONTEXTO ADICIONAL:
- Destino da viagem: ${destino || 'Não especificado'}
- Tipos de serviço solicitados: ${tipos?.join(', ') || 'Não especificado'}
- Filial: CVC Itaqua 6220
- Padrão de atendimento: Profissional e acolhedor

Gere apenas o orçamento formatado, sem explicações adicionais.`;

    console.log('🏗️ [PROMPT] Prompt final construído, length:', promptFinal.length);
    return promptFinal;
    
  } catch (error) {
    console.error('❌ [PROMPT] Erro na construção:', error);
    // Fallback mínimo
    return `Formate este orçamento de viagem de forma profissional: ${promptBase}`;
  }
}

// 🤖 CHAMAR IA
async function chamarIA(prompt, temImagem, arquivo) {
  console.log('🤖 [IA] Iniciando chamada...');
  
  try {
    // Verificar APIs disponíveis
    const temOpenAI = !!process.env.OPENAI_API_KEY;
    const temClaude = !!process.env.ANTHROPIC_API_KEY;
    
    console.log('🤖 [IA] APIs disponíveis - OpenAI:', temOpenAI, 'Claude:', temClaude);
    
    if (!temOpenAI && !temClaude) {
      throw new Error('❌ Nenhuma API Key configurada. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY nas variáveis de ambiente do Vercel.');
    }
    
    // Priorizar OpenAI por padrão
    if (temOpenAI) {
      console.log('🔵 [IA] Usando OpenAI GPT-4o');
      return await chamarOpenAI(prompt, temImagem, arquivo);
    } else {
      console.log('🟠 [IA] Usando Claude');
      return await chamarClaude(prompt, temImagem, arquivo);
    }
    
  } catch (error) {
    console.error('❌ [IA] Erro geral:', error);
    throw new Error(`Erro na IA: ${error.message}`);
  }
}

// 🔵 OPENAI API
async function chamarOpenAI(prompt, temImagem, arquivo) {
  try {
    console.log('🔵 [OPENAI] Preparando requisição...');
    
    let messages;
    
    if (temImagem && arquivo) {
      console.log('🔵 [OPENAI] Modo texto + imagem');
      messages = [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { 
              url: arquivo,
              detail: "high"
            } 
          }
        ]
      }];
    } else {
      console.log('🔵 [OPENAI] Modo apenas texto');
      messages = [{
        role: "user",
        content: prompt
      }];
    }

    console.log('🔵 [OPENAI] Enviando requisição...');
    
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
        temperature: 0.3, // Mais determinístico para formatação
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    console.log('🔵 [OPENAI] Status resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OPENAI] Erro HTTP:', response.status, errorText);
      throw new Error(`OpenAI API Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('🔵 [OPENAI] Resposta recebida, usage:', data.usage);
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('❌ [OPENAI] Resposta sem conteúdo:', data);
      throw new Error('OpenAI não retornou conteúdo válido');
    }

    const content = data.choices[0].message.content;
    console.log('✅ [OPENAI] Sucesso, content length:', content.length);
    
    return content;
    
  } catch (error) {
    console.error('❌ [OPENAI] Erro específico:', error);
    throw error;
  }
}

// 🟠 CLAUDE API
async function chamarClaude(prompt, temImagem, arquivo) {
  try {
    console.log('🟠 [CLAUDE] Preparando requisição...');
    
    let content;
    
    if (temImagem && arquivo) {
      console.log('🟠 [CLAUDE] Modo texto + imagem');
      
      const base64Match = arquivo.match(/data:image\/[^;]+;base64,(.+)/);
      if (!base64Match) {
        throw new Error('Formato de imagem inválido para Claude');
      }
      
      const base64Data = base64Match[1];
      const mimeType = arquivo.match(/data:(image\/[^;]+)/)?.[1] || 'image/jpeg';
      
      content = [
        { type: "text", text: prompt },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType,
            data: base64Data
          }
        }
      ];
    } else {
      console.log('🟠 [CLAUDE] Modo apenas texto');
      content = prompt;
    }

    console.log('🟠 [CLAUDE] Enviando requisição...');

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
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      })
    });

    console.log('🟠 [CLAUDE] Status resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CLAUDE] Erro HTTP:', response.status, errorText);
      throw new Error(`Claude API Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('🟠 [CLAUDE] Resposta recebida, usage:', data.usage);
    
    if (!data.content?.[0]?.text) {
      console.error('❌ [CLAUDE] Resposta sem conteúdo:', data);
      throw new Error('Claude não retornou conteúdo válido');
    }

    const content_text = data.content[0].text;
    console.log('✅ [CLAUDE] Sucesso, content length:', content_text.length);
    
    return content_text;
    
  } catch (error) {
    console.error('❌ [CLAUDE] Erro específico:', error);
    throw error;
  }
}

// 🛡️ TEMPLATE PADRÃO DE FALLBACK
function getDefaultTemplate() {
  return `*Orçamento CVC Itaqua*
📍 Destino: [DESTINO]
🗓️ Período: [PERIODO]
👥 Passageiros: [PASSAGEIROS]

💰 Valor: R$ [VALOR]
💳 Formas de pagamento disponíveis

📞 CVC Itaqua - Filial 6220
Estamos aqui para realizar sua viagem!`;
}

console.log('✅ [CVC API] Módulo carregado com sucesso');
