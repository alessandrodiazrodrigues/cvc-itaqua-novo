// ===== CORREÇÃO ULTRA ESPECÍFICA - ANTI-INVENÇÃO DE VOLTA =====
// ================================================================================
// 🏆 CVC ITAQUA - API ULTRA CORRIGIDA v4.5.0-ultra
// ================================================================================
// FOCO ABSOLUTO: Impedir que a IA invente horários de volta para voos somente ida
// ================================================================================

const templates = {
  'Aéreo Somente Ida': `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA_AEREA]
🗓️ [DATA_IDA] (Somente ida)
✈️ [DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Passagem somente de ida - sem retorno incluído`,

  'Aéreo Múltiplas Somente Ida': `*Passagens Aéreas - Opções Somente Ida*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] (Somente ida)
✈️ [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]
💳 [FORMA_PAGAMENTO_1]
🔗 [LINK_CVC_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] (Somente ida)
✈️ [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]
💳 [FORMA_PAGAMENTO_2]
🔗 [LINK_CVC_2]

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído
📞 Dúvidas? Estamos aqui para ajudar!`
};

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
    console.log('[ULTRA-FIX] Iniciando processamento...');
    
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
        message: 'CVC Itaqua API Ultra Corrigida',
        version: '4.5.0-ultra',
        status: 'ANTI-INVENÇÃO DE VOLTA ATIVO',
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
    console.log(`[ULTRA-FIX] Prompt recebido: ${prompt.length} chars`);

    // ANÁLISE ULTRA RIGOROSA
    const analise = analisarVooUltraRigoroso(prompt);
    console.log('[ULTRA-FIX] Análise:', analise);

    // SELEÇÃO FORÇADA DO TEMPLATE CORRETO
    const template = selecionarTemplateForcado(analise);
    console.log(`[ULTRA-FIX] Template forçado: ${template.nome}`);

    // PROMPT ULTRA ESPECÍFICO
    const promptFinal = construirPromptUltraEspecifico(prompt, template, analise);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModeloHibrido(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[ULTRA-FIX] Concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [ULTRA-FIX ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '4.5.0-ultra'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE ULTRA RIGOROSA
// ================================================================================

function analisarVooUltraRigoroso(texto) {
  console.log('[ULTRA-ANÁLISE] Iniciando análise ultra rigorosa...');
  
  if (!texto) {
    return { tipo: 'somente_ida', multiplasOpcoes: false, confianca: 0 };
  }

  const textoLower = texto.toLowerCase();
  
  // DETECTAR MÚLTIPLAS OPÇÕES
  const precos = (textoLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (textoLower.match(/total.*\d+.*adult/gi) || []).length;
  const links = (textoLower.match(/https:\/\/www\.cvc\.com\.br\/carrinho/gi) || []).length;
  
  const multiplasOpcoes = Math.max(precos, totais, links) >= 2;
  const quantidadeOpcoes = multiplasOpcoes ? Math.max(precos, totais, links) : 1;
  
  console.log(`[ULTRA-ANÁLISE] Múltiplas opções: ${multiplasOpcoes} (${quantidadeOpcoes})`);

  // ANÁLISE ULTRA ESPECÍFICA PARA SOMENTE IDA
  const indicadoresVolta = [
    // Buscar por palavras explícitas de volta
    textoLower.includes('volta'),
    textoLower.includes('retorno'),
    textoLower.includes('return'),
    // Buscar por padrões de horários de volta
    /volta.*\d{2}:\d{2}/gi.test(textoLower),
    // Buscar por múltiplas datas DIFERENTES (não repetidas)
    temDatasRealmenteDistintas(texto),
    // Buscar por menção de duração de viagem
    /\d+ dias.*\d+ noites/gi.test(textoLower)
  ];
  
  const contemVolta = indicadoresVolta.some(Boolean);
  
  console.log('[ULTRA-ANÁLISE] Indicadores de volta:', indicadoresVolta);
  console.log(`[ULTRA-ANÁLISE] Contém volta: ${contemVolta}`);
  
  // DECISÃO ULTRA CONSERVADORA
  // Se NÃO há indicadores claros de volta, é SOMENTE IDA
  const tipoViagem = contemVolta ? 'ida_volta' : 'somente_ida';
  const confianca = contemVolta ? 2 : 4; // Alta confiança para somente ida
  
  console.log(`[ULTRA-ANÁLISE] DECISÃO FINAL: ${tipoViagem.toUpperCase()}`);

  return {
    tipo: tipoViagem,
    multiplasOpcoes: multiplasOpcoes,
    quantidadeOpcoes: quantidadeOpcoes,
    confianca: confianca,
    contemVolta: contemVolta,
    indicadores: {
      precos, totais, links,
      volta: indicadoresVolta
    }
  };
}

function temDatasRealmenteDistintas(texto) {
  // Extrair todas as datas do texto
  const datasCompletas = texto.match(/\d{2} de \w+|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}/gi) || [];
  
  // Normalizar as datas para comparação
  const datasNormalizadas = datasCompletas.map(data => {
    return data.toLowerCase().replace(/\s+/g, ' ').trim();
  });
  
  // Contar datas únicas
  const datasUnicas = [...new Set(datasNormalizadas)];
  
  console.log('[ULTRA-ANÁLISE] Datas encontradas:', datasCompletas);
  console.log('[ULTRA-ANÁLISE] Datas únicas:', datasUnicas);
  
  // Só considera múltiplas datas se há REALMENTE datas diferentes
  return datasUnicas.length >= 2;
}

// ================================================================================
// 🎯 SELEÇÃO FORÇADA DE TEMPLATE
// ================================================================================

function selecionarTemplateForcado(analise) {
  console.log('[TEMPLATE-FORÇADO] Selecionando template...');
  
  let templateNome = '';
  let template = '';
  
  // FORÇAR TEMPLATE BASEADO NA ANÁLISE ULTRA RIGOROSA
  if (analise.tipo === 'somente_ida') {
    if (analise.multiplasOpcoes) {
      templateNome = 'Aéreo Múltiplas Somente Ida';
      template = templates['Aéreo Múltiplas Somente Ida'];
    } else {
      templateNome = 'Aéreo Somente Ida';
      template = templates['Aéreo Somente Ida'];
    }
  } else {
    // Para ida/volta, usar templates padrão (não definidos aqui pois foco é somente ida)
    templateNome = 'Aéreo Ida e Volta';
    template = `*Passagem Aérea - Ida e Volta*
[DADOS_IDA_VOLTA]`;
  }
  
  console.log(`[TEMPLATE-FORÇADO] Selecionado: ${templateNome}`);
  
  return {
    nome: templateNome,
    conteudo: template
  };
}

// ================================================================================
// 🏗️ PROMPT ULTRA ESPECÍFICO - ANTI-INVENÇÃO
// ================================================================================

function construirPromptUltraEspecifico(promptBase, template, analise) {
  console.log('[PROMPT-ULTRA] Construindo prompt anti-invenção...');
  
  let prompt = `VOCÊ É UM ASSISTENTE ESPECIALIZADO EM ORÇAMENTOS DE VIAGEM.

🚨 INSTRUÇÃO CRÍTICA ABSOLUTA:
${analise.tipo === 'somente_ida' ? 
  `ESTE É UM VOO SOMENTE IDA! NÃO INVENTE INFORMAÇÕES DE VOLTA!` : 
  `Este é um voo ida e volta com dados de retorno.`}

ANÁLISE REALIZADA:
- Tipo detectado: ${analise.tipo.toUpperCase()}
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Quantidade: ${analise.quantidadeOpcoes}
- Contém volta: ${analise.contemVolta ? 'SIM' : 'NÃO'}

TEMPLATE OBRIGATÓRIO (USE EXATAMENTE ESTE FORMATO):
${template.conteudo}

DADOS FORNECIDOS PELO CLIENTE:
${promptBase}

`;

  if (analise.tipo === 'somente_ida') {
    prompt += `
🚨🚨🚨 REGRAS ABSOLUTAS PARA SOMENTE IDA 🚨🚨🚨:

1. NÃO ADICIONE linha "✈️ Volta:" - PROIBIDO!
2. NÃO INVENTE horários de retorno - PROIBIDO!
3. USE apenas "(Somente ida)" na data - OBRIGATÓRIO!
4. NÃO CALCULE duração em dias/noites - PROIBIDO!
5. USE apenas os dados de IDA fornecidos - OBRIGATÓRIO!

EXEMPLO CORRETO PARA MÚLTIPLAS OPÇÕES SOMENTE IDA:

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

NUNCA ADICIONE INFORMAÇÕES DE VOLTA QUE NÃO EXISTEM!
`;
  }

  prompt += `
INSTRUÇÕES FINAIS:
- Converta siglas: VCP → Viracopos, BSB → Brasília, GRU → Guarulhos
- Use APENAS dados reais do texto fornecido
- Mantenha links exatos como fornecidos
- Responda APENAS com o template preenchido
- NÃO adicione comentários ou explicações extras`;

  console.log('[PROMPT-ULTRA] Prompt construído, tamanho:', prompt.length);
  console.log('[PROMPT-ULTRA] Tipo foco:', analise.tipo);
  
  return prompt;
}

// ================================================================================
// 🤖 SISTEMA HÍBRIDO (simplificado)
// ================================================================================

function selecionarModeloHibrido(temImagem) {
  if (temImagem === true) {
    return {
      modelo: 'claude-3-5-sonnet-20240620',
      estrategia: 'Claude 3.5 Sonnet para análise visual',
      fallback: 'gpt-4o'
    };
  } else {
    return {
      modelo: 'gpt-4o-mini',
      estrategia: 'GPT-4o-mini para processamento de texto',
      fallback: 'gpt-4o'
    };
  }
}

async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log(`[IA-ULTRA] Chamando modelo: ${modelo}`);
  
  try {
    if (temImagem === true) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ [IA-ULTRA] Falha no modelo principal: ${erro1.message}`);
    
    try {
      console.log(`🔄 [IA-ULTRA] Fallback: ${fallbackModelo}`);
      return await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelo);
    } catch (erro2) {
      console.error(`❌ [IA-ULTRA] Falha no fallback: ${erro2.message}`);
      throw new Error(`Ambos modelos falharam. Principal: ${erro1.message}. Fallback: ${erro2.message}`);
    }
  }
}

// ================================================================================
// 🟠/🔵 CHAMADAS DE API (mantidas iguais)
// ================================================================================

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
      temperature: 0.0 // Temperatura zero para máxima precisão
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
// 🔧 PROCESSAMENTO E UTILITÁRIOS
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

console.log('✅ [ULTRA-FIX] CVC Itaqua API v4.5.0-ultra carregada');
console.log('🚨 [MODO] ANTI-INVENÇÃO DE VOLTA ATIVO');
console.log('🎯 [FOCO] Detecção ultra rigorosa + Prompt extremamente específico');
console.log('🔧 [TEMPERATURA] 0.0 para máxima precisão');
console.log('🚀 [STATUS] Pronto para eliminar invenções!')
