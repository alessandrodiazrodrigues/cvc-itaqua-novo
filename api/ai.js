// ===== CORREÇÃO FINAL DE FORMATO - FORÇA TEMPLATE EXATO =====
// ================================================================================
// 🏆 CVC ITAQUA - API FORMATO CORRIGIDO v4.6.0-format
// ================================================================================
// FOCO: Forçar uso exato do template correto para voos somente ida
// ================================================================================

const TEMPLATE_MULTIPLAS_SOMENTE_IDA = `*Passagens Aéreas - Opções Somente Ida*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_1] (Somente ida)
✈️ [DATA_1] - [ORIGEM_1] [HORA_IDA_1] / [DESTINO_1] [HORA_CHEGADA_1]
💰 R$ [VALOR_1] para [PASSAGEIROS_1]
💳 [PAGAMENTO_1]
🔗 [LINK_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_2] (Somente ida)
✈️ [DATA_2] - [ORIGEM_2] [HORA_IDA_2] / [DESTINO_2] [HORA_CHEGADA_2]
💰 R$ [VALOR_2] para [PASSAGEIROS_2]
💳 [PAGAMENTO_2]
🔗 [LINK_2]

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído
📞 Dúvidas? Estamos aqui para ajudar!`;

const TEMPLATE_UNICA_SOMENTE_IDA = `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA]
🗓️ [DATA] (Somente ida)
✈️ [DATA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA]

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem somente de ida - sem retorno incluído`;

const aeroportos = {
  'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
  'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'RAO': 'Ribeirão Preto',
  'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha',
  'CWB': 'Afonso Pena', 'IGU': 'Foz do Iguaçu', 'REC': 'Recife',
  'FOR': 'Fortaleza', 'MAO': 'Manaus', 'BEL': 'Belém',
  'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'AJU': 'Aracaju',
  'MCZ': 'Maceió', 'JPA': 'João Pessoa', 'NAT': 'Natal',
  'THE': 'Teresina', 'SLZ': 'São Luís', 'VIX': 'Vitória',
  'FLN': 'Florianópolis', 'POA': 'Porto Alegre', 'BPS': 'Porto Seguro',
  'SSA': 'Salvador', 'IOS': 'Ilhéus'
};

const PRECOS_MODELOS = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
};

const USD_TO_BRL = 5.2;
const MAX_TOKENS = 2500;

// ================================================================================
// 🎯 HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('[FORMAT-FIX] Iniciando processamento...');
    
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'CVC Itaqua API Formato Corrigido',
        version: '4.6.0-format',
        status: 'FORMATO EXATO ATIVO',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false,
        error: 'Método não permitido' 
      });
    }

    // VALIDAÇÃO
    if (!req.body?.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt obrigatório'
      });
    }

    const { prompt, temImagem, arquivo } = req.body;
    console.log(`[FORMAT-FIX] Prompt recebido: ${prompt.length} chars`);

    // ANÁLISE SIMPLES E DIRETA
    const analise = analisarParaFormato(prompt);
    console.log('[FORMAT-FIX] Análise:', analise);

    // CONSTRUIR PROMPT COM FORMATO FORÇADO
    const promptFinal = construirPromptComFormatoForcado(prompt, analise);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[FORMAT-FIX] Concluído: ${Date.now() - startTime}ms`);

    return res.status(200).json({
      success: true,
      choices: [{ 
        message: { 
          content: responseProcessada 
        } 
      }],
      metricas: metricas
    });

  } catch (error) {
    console.error('💥 [FORMAT-FIX ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '4.6.0-format'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE SIMPLES PARA FORMATO
// ================================================================================

function analisarParaFormato(texto) {
  if (!texto) {
    return { multiplasOpcoes: false, tipo: 'somente_ida' };
  }

  const textoLower = texto.toLowerCase();
  
  // Contar indicadores de múltiplas opções
  const precos = (textoLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (textoLower.match(/total.*adult/gi) || []).length;
  const links = (textoLower.match(/https:\/\/www\.cvc\.com\.br/gi) || []).length;
  
  const multiplasOpcoes = Math.max(precos, totais, links) >= 2;
  
  // Para o formato, sempre assumir somente ida a menos que haja indicação clara de volta
  const temVoltaExplicita = textoLower.includes('volta') && textoLower.includes('retorno');
  const tipo = temVoltaExplicita ? 'ida_volta' : 'somente_ida';
  
  console.log(`[ANÁLISE-FORMAT] Múltiplas: ${multiplasOpcoes}, Tipo: ${tipo}`);
  
  return {
    multiplasOpcoes: multiplasOpcoes,
    tipo: tipo,
    indicadores: { precos, totais, links }
  };
}

// ================================================================================
// 🏗️ PROMPT COM FORMATO FORÇADO
// ================================================================================

function construirPromptComFormatoForcado(promptBase, analise) {
  console.log('[PROMPT-FORMAT] Construindo prompt com formato forçado...');
  
  // Escolher template baseado na análise
  const template = analise.multiplasOpcoes ? TEMPLATE_MULTIPLAS_SOMENTE_IDA : TEMPLATE_UNICA_SOMENTE_IDA;
  
  let prompt = `Você é um assistente da CVC. Formate o orçamento usando EXATAMENTE o template abaixo.

🚨 IMPORTANTE: Este é um voo SOMENTE IDA - não adicione informações de volta!

TEMPLATE OBRIGATÓRIO (copie exatamente este formato):
${template}

DADOS DO CLIENTE:
${promptBase}

INSTRUÇÕES ESPECÍFICAS:
1. Use EXATAMENTE o formato do template acima
2. Mantenha todos os emojis e estrutura
3. Para múltiplas opções, preencha OPÇÃO 1 e OPÇÃO 2
4. Converta siglas: VCP → Viracopos, GRU → Guarulhos, BSB → Brasília
5. Use apenas "(Somente ida)" nas datas
6. NÃO adicione linhas de volta
7. Mantenha os links exatos como fornecidos

EXEMPLO DO RESULTADO ESPERADO PARA SEU CASO:

*Passagens Aéreas - Opções Somente Ida*

📋 *OPÇÃO 1: Gol*
🗓️ 01 de agosto (Somente ida)
✈️ 01/ago - Viracopos 17:55 / Brasília 19:30
💰 R$ 373,06 para 1 Adulto
💳 Tarifa facial - Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/6888fd4866fac5c6de086f77

📋 *OPÇÃO 2: Gol*
🗓️ 01 de agosto (Somente ida)
✈️ 01/ago - Guarulhos 06:00 / Brasília 07:45
💰 R$ 489,48 para 1 Adulto
💳 Tarifa facial - Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/6888fd59790b60759b7d4300

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído
📞 Dúvidas? Estamos aqui para ajudar!

RESPONDA APENAS COM O TEMPLATE PREENCHIDO. NÃO ADICIONE COMENTÁRIOS.`;

  console.log('[PROMPT-FORMAT] Template usado:', analise.multiplasOpcoes ? 'MÚLTIPLAS' : 'ÚNICA');
  
  return prompt;
}

// ================================================================================
// 🤖 SISTEMA DE IA SIMPLIFICADO
// ================================================================================

function selecionarModelo(temImagem) {
  if (temImagem === true) {
    return {
      modelo: 'claude-3-5-sonnet-20240620',
      estrategia: 'Claude para análise visual',
      fallback: 'gpt-4o'
    };
  } else {
    return {
      modelo: 'gpt-4o-mini',
      estrategia: 'GPT-4o-mini para texto',
      fallback: 'gpt-4o'
    };
  }
}

async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log(`[IA-FORMAT] Chamando: ${modelo}`);
  
  try {
    if (temImagem === true) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ [IA-FORMAT] Falha principal: ${erro1.message}`);
    
    try {
      console.log(`🔄 [IA-FORMAT] Fallback: ${fallbackModelo}`);
      return await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelo);
    } catch (erro2) {
      console.error(`❌ [IA-FORMAT] Falha fallback: ${erro2.message}`);
      throw new Error(`Ambos modelos falharam. Principal: ${erro1.message}. Fallback: ${erro2.message}`);
    }
  }
}

async function chamarClaude(prompt, arquivo, modelo) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada');
  }

  const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
  if (!base64Match) {
    throw new Error('Formato de imagem base64 inválido');
  }

  const content = [
    { type: "text", text: prompt },
    {
      type: "image",
      source: {
        type: "base64",
        media_type: base64Match[1],
        data: base64Match[2]
      }
    }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro Claude ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.content?.[0]?.text) {
    throw new Error('Resposta Claude inválida');
  }

  return {
    content: data.content[0].text,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
    modelo_usado: modelo
  };
}

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não encontrada');
  }

  let messages;
  if (temImagem === true && arquivo) {
    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: arquivo } }
        ]
      }
    ];
  } else {
    messages = [{ role: "user", content: prompt }];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelo,
      messages: messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.1 // Baixa temperatura para seguir formato
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro OpenAI ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Resposta OpenAI inválida');
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    modelo_usado: modelo
  };
}

// ================================================================================
// 🔧 PROCESSAMENTO
// ================================================================================

function processarResposta(response) {
  if (!response || typeof response !== 'string') {
    return 'Erro: Resposta inválida';
  }

  let processada = response.trim();

  // Conversão de aeroportos
  Object.entries(aeroportos).forEach(([sigla, nome]) => {
    const regex = new RegExp(`\\b${sigla}\\b`, 'gi');
    processada = processada.replace(regex, nome);
  });

  // Garantir que não há linhas de volta adicionadas
  if (processada.includes('✈️ Volta:')) {
    console.warn('[FORMAT-FIX] AVISO: Removendo linha de volta detectada!');
    processada = processada.replace(/✈️ Volta:.*\n/g, '');
  }

  return processada.replace(/\n\s*\n/g, '\n\n').trim();
}

function calcularMetricas(resultado, startTime, estrategia) {
  const tokensInput = resultado.usage?.prompt_tokens || resultado.usage?.input_tokens || 0;
  const tokensOutput = resultado.usage?.completion_tokens || resultado.usage?.output_tokens || 0;
  const modeloUsado = resultado.modelo_usado || 'desconhecido';
  
  const precosModelo = PRECOS_MODELOS[modeloUsado] || { input: 0, output: 0 };
  
  const custoUSD = (tokensInput / 1000) * precosModelo.input + (tokensOutput / 1000) * precosModelo.output;
  const custoBRL = custoUSD * USD_TO_BRL;

  const custoGPT4o = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o'].input + 
                     (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o'].output;
  const economiaUSD = custoGPT4o - custoUSD;
  const economiaBRL = economiaUSD * USD_TO_BRL;
  
  return {
    modelo_usado: modeloUsado,
    estrategia: estrategia,
    tokens: {
      input: tokensInput,
      output: tokensOutput,
      total: tokensInput + tokensOutput
    },
    custo: {
      usd: custoUSD,
      brl: custoBRL
    },
    economia: {
      vs_gpt4o_usd: economiaUSD,
      vs_gpt4o_brl: economiaBRL,
      percentual: custoGPT4o > 0 ? ((economiaUSD / custoGPT4o) * 100).toFixed(1) + '%' : '0%'
    },
    performance: {
      tempo_processamento_ms: Date.now() - startTime
    }
  };
}

console.log('✅ [FORMAT-FIX] CVC Itaqua API v4.6.0-format carregada');
console.log('📋 [FORMATO] Template exato forçado no prompt');
console.log('🚨 [ANTI-VOLTA] Remoção automática de linhas de volta');
console.log('🎯 [EXEMPLO] Resultado esperado incluído no prompt');
console.log('🚀 [STATUS] Pronto para formato perfeito!');
