// ===== CORREÇÃO FINAL - DETECÇÃO PRECISA DE VOOS SOMENTE IDA =====
// ================================================================================
// 🏆 CVC ITAQUA - API CORRIGIDA v4.4.0-final
// ================================================================================
// FOCO: Resolver problema específico de voos somente ida sendo tratados como ida/volta
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
📞 Dúvidas? Estamos aqui para ajudar!`,

  'Aéreo Ida e Volta': `*Passagem Aérea - Ida e Volta*
🏷️ [COMPANHIA_AEREA]
🗓️ [DATA_IDA] a [DATA_VOLTA] ([DURACAO])
✈️ Ida: [DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_IDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA_IDA]
✈️ Volta: [DATA_VOLTA] - [AEROPORTO_ORIGEM_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_DESTINO_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Ida e volta incluídos no valor`,

  'Aéreo Múltiplas Ida e Volta': `*Passagens Aéreas - Opções Ida e Volta*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [AEROPORTO_ORIGEM_VOLTA_1] [HORA_SAIDA_VOLTA_1] / [AEROPORTO_DESTINO_VOLTA_1] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]
💳 [FORMA_PAGAMENTO_1]
🔗 [LINK_CVC_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [AEROPORTO_ORIGEM_VOLTA_2] [HORA_SAIDA_VOLTA_2] / [AEROPORTO_DESTINO_VOLTA_2] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]
💳 [FORMA_PAGAMENTO_2]
🔗 [LINK_CVC_2]

⚠️ Valores sujeitos a alteração e disponibilidade!
📞 Dúvidas? Estamos aqui para ajudar!`,

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

⚠️ Tarifas sujeitas à disponibilidade.`
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
    console.log('[HANDLER-FINAL] Iniciando processamento...');
    
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'CVC Itaqua API Híbrida (Correção Final)',
        version: '4.4.0-final',
        status: 'online',
        focus: 'Detecção precisa de voos somente ida',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false,
        error: 'Método não permitido' 
      });
    }

    // VALIDAÇÃO RIGOROSA
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisição obrigatório'
      });
    }

    const { prompt, temImagem, arquivo } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt obrigatório'
      });
    }

    console.log(`[HANDLER-FINAL] Dados: Prompt=${prompt.length} chars, TemImagem=${temImagem}`);

    // ANÁLISE ESPECÍFICA DO CONTEÚDO
    const analiseDetalhada = analisarVooDetalhadamente(prompt);
    console.log('[HANDLER-FINAL] Análise detalhada:', analiseDetalhada);

    // SELEÇÃO DE MODELO E TEMPLATE
    const { modelo, estrategia, fallback } = selecionarModeloHibrido(temImagem);
    const template = selecionarTemplateEspecifico(analiseDetalhada);
    const promptFinal = construirPromptEspecifico(prompt, template, analiseDetalhada);

    console.log(`[HANDLER-FINAL] Template selecionado: ${template.nome}`);
    console.log(`[HANDLER-FINAL] Estratégia: ${estrategia}`);

    // CHAMADA PARA IA
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    if (!resultado || !resultado.content) {
      throw new Error('Resposta da IA está vazia');
    }

    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[HANDLER-FINAL] Processamento concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [ERRO FINAL] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '4.4.0-final'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE DETALHADA DE VOOS - FOCO EM SOMENTE IDA
// ================================================================================

function analisarVooDetalhadamente(texto) {
  console.log('[ANÁLISE] Iniciando análise detalhada...');
  
  if (!texto) {
    return { tipo: 'desconhecido', multiplasOpcoes: false, confianca: 0 };
  }

  const textoLower = texto.toLowerCase();
  
  // CONTADORES BÁSICOS
  const precos = (textoLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (textoLower.match(/total.*\d+.*adult/gi) || []).length;
  const links = (textoLower.match(/https:\/\/www\.cvc\.com\.br\/carrinho/gi) || []).length;
  const companhias = (textoLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  
  console.log('[ANÁLISE] Contadores:', { precos, totais, links, companhias });
  
  // DETECÇÃO DE MÚLTIPLAS OPÇÕES
  const multiplasOpcoes = Math.max(precos, totais, links) >= 2;
  const quantidadeOpcoes = multiplasOpcoes ? Math.max(precos, totais, links) : 1;
  
  console.log('[ANÁLISE] Múltiplas opções:', multiplasOpcoes, 'Quantidade:', quantidadeOpcoes);

  // ANÁLISE CRÍTICA: SOMENTE IDA vs IDA E VOLTA
  const indicadoresSomenteIda = [
    // Não há menção explícita de volta
    !(textoLower.includes('volta') || textoLower.includes('retorno')),
    // Não há múltiplas datas diferentes
    !temMultiplasDatasDistintas(texto),
    // Não há horários de volta explícitos
    !temHorariosVolta(texto),
    // Padrão típico de somente ida: origem-destino sem volta
    temPadraoSomenteIda(texto)
  ];
  
  const pontuacaoSomenteIda = indicadoresSomenteIda.filter(Boolean).length;
  
  // DECISÃO FINAL
  let tipoViagem = 'somente_ida';
  let confianca = pontuacaoSomenteIda;
  
  // Se há indicadores explícitos de volta, mudar para ida_volta
  if (textoLower.includes('volta') && temMultiplasDatasDistintas(texto)) {
    tipoViagem = 'ida_volta';
    confianca = 4 - pontuacaoSomenteIda;
  }
  
  console.log('[ANÁLISE] Resultado final:', {
    tipo: tipoViagem,
    confianca: confianca,
    indicadores: indicadoresSomenteIda,
    pontuacao: pontuacaoSomenteIda
  });

  return {
    tipo: tipoViagem,
    multiplasOpcoes: multiplasOpcoes,
    quantidadeOpcoes: quantidadeOpcoes,
    confianca: confianca,
    indicadores: {
      precos: precos,
      totais: totais,
      links: links,
      companhias: companhias,
      somenteIda: indicadoresSomenteIda
    }
  };
}

function temMultiplasDatasDistintas(texto) {
  const datas = texto.match(/\d{2}\/\d{2}|\d{2} de \w+/gi) || [];
  const datasUnicas = [...new Set(datas)];
  
  console.log('[ANÁLISE] Datas encontradas:', datas, 'Únicas:', datasUnicas);
  
  return datasUnicas.length >= 2;
}

function temHorariosVolta(texto) {
  const textoLower = texto.toLowerCase();
  
  // Procurar por padrões explícitos de volta
  const padraoVolta = /volta.*\d{2}:\d{2}/gi;
  const temVolta = padraoVolta.test(textoLower);
  
  console.log('[ANÁLISE] Tem horários de volta:', temVolta);
  
  return temVolta;
}

function temPadraoSomenteIda(texto) {
  const textoLower = texto.toLowerCase();
  
  // Padrões típicos de somente ida:
  // - São Paulo - Brasília (origem-destino)
  // - Ida sex, 01 de agosto (sem menção de volta)
  // - Total (X Adulto) (sem duração de viagem)
  
  const padroes = [
    /\w+ - \w+.*ida.*\d{2}:\d{2}/i, // origem-destino ida horário
    /ida.*\d{2} de \w+/i, // ida + data
    /total.*\d+.*adult.*r\$/i // total adulto preço (sem duração)
  ];
  
  const matches = padroes.filter(padrao => padrao.test(textoLower)).length;
  
  console.log('[ANÁLISE] Padrões somente ida encontrados:', matches);
  
  return matches >= 2;
}

// ================================================================================
// 🎯 SELEÇÃO DE TEMPLATE ESPECÍFICO
// ================================================================================

function selecionarTemplateEspecifico(analise) {
  console.log('[TEMPLATE] Selecionando template para:', analise);
  
  let templateNome = '';
  let template = '';
  
  if (analise.multiplasOpcoes) {
    if (analise.tipo === 'somente_ida') {
      templateNome = 'Aéreo Múltiplas Somente Ida';
      template = templates['Aéreo Múltiplas Somente Ida'];
    } else {
      templateNome = 'Aéreo Múltiplas Ida e Volta';
      template = templates['Aéreo Múltiplas Ida e Volta'];
    }
  } else {
    if (analise.tipo === 'somente_ida') {
      templateNome = 'Aéreo Somente Ida';
      template = templates['Aéreo Somente Ida'];
    } else {
      templateNome = 'Aéreo Ida e Volta';
      template = templates['Aéreo Ida e Volta'];
    }
  }
  
  console.log(`[TEMPLATE] Selecionado: ${templateNome}`);
  
  return {
    nome: templateNome,
    conteudo: template
  };
}

// ================================================================================
// 🏗️ CONSTRUÇÃO DE PROMPT ESPECÍFICO
// ================================================================================

function construirPromptEspecifico(promptBase, template, analise) {
  console.log('[PROMPT] Construindo prompt específico...');
  
  let prompt = `Você é um assistente especializado em formatar orçamentos de viagem da CVC.

ANÁLISE PRÉVIA REALIZADA:
- Tipo detectado: ${analise.tipo.toUpperCase()}
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Quantidade de opções: ${analise.quantidadeOpcoes}
- Confiança na análise: ${analise.confianca}/4

TEMPLATE OBRIGATÓRIO:
${template.conteudo}

DADOS DO CLIENTE:
${promptBase}

INSTRUÇÕES CRÍTICAS:
`;

  if (analise.tipo === 'somente_ida') {
    prompt += `
🚨 ATENÇÃO: Este é um voo SOMENTE IDA!
- NÃO inclua informações de volta
- NÃO invente horários de retorno
- Use "(Somente ida)" na descrição da data
- NÃO adicione linha "✈️ Volta:" 
- Deixe claro que é passagem sem retorno
`;
  } else {
    prompt += `
✈️ Este é um voo IDA E VOLTA:
- Inclua informações completas de ida e volta
- Use formato "(X dias e Y noites)" quando possível
- Adicione linhas separadas para ida e volta
`;
  }

  if (analise.multiplasOpcoes) {
    prompt += `
📊 MÚLTIPLAS OPÇÕES DETECTADAS:
- Formate TODAS as ${analise.quantidadeOpcoes} opções encontradas
- Use seções numeradas (OPÇÃO 1, OPÇÃO 2, etc.)
- Cada opção deve ter dados distintos e completos
`;
  } else {
    prompt += `
📋 OPÇÃO ÚNICA:
- Formate apenas uma opção de forma clara
- Use todos os dados disponíveis
`;
  }

  prompt += `
🔧 REGRAS FINAIS:
- Converta siglas de aeroportos (VCP→Viracopos, BSB→Brasília)
- Use dados reais do texto fornecido
- NÃO invente informações que não existem
- Seja preciso com horários e datas
- Responda APENAS com o template preenchido

EXEMPLO CORRETO PARA SOMENTE IDA:
*Passagem Aérea - Somente Ida*
🏷️ Gol
🗓️ 01 de agosto (Somente ida)
✈️ 01/ago - Viracopos 17:55 / Brasília 19:30
💰 R$ 373,06 para 1 Adulto
💳 Tarifa facial - Não reembolsável
⚠️ Passagem somente de ida - sem retorno incluído
`;

  console.log('[PROMPT] Prompt construído, tamanho:', prompt.length);
  
  return prompt;
}

// ================================================================================
// 🤖 SISTEMA HÍBRIDO DE IA
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
  console.log(`[IA] Tentando modelo principal: ${modelo}`);
  
  try {
    if (temImagem === true) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ [IA] Falha no modelo principal: ${erro1.message}`);
    
    try {
      console.log(`🔄 [IA] Tentando fallback: ${fallbackModelo}`);
      return await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelo);
    } catch (erro2) {
      console.error(`❌ [IA] Falha no fallback: ${erro2.message}`);
      throw new Error(`Ambos modelos falharam. Principal: ${erro1.message}. Fallback: ${erro2.message}`);
    }
  }
}

// ================================================================================
// 🟠 CHAMADA CLAUDE
// ================================================================================

async function chamarClaude(prompt, arquivo, modelo) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada');
  }

  const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
  if (!base64Match) {
    throw new Error('Formato de imagem base64 inválido');
  }

  const mimeType = base64Match[1];
  const base64Data = base64Match[2];

  const content = [
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

// ================================================================================
// 🔵 CHAMADA OPENAI
// ================================================================================

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
      temperature: 0.1
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

console.log('✅ [SISTEMA-FINAL] CVC Itaqua API v4.4.0-final carregada');
console.log('🎯 [FOCO] Detecção precisa de voos somente ida vs ida/volta');
console.log('🔧 [CORREÇÃO] Análise crítica implementada para evitar invenção de volta');
console.log('📋 [TEMPLATES] 4 templates específicos criados');
console.log('🚀 [STATUS] Pronto para uso!');
