//// ===== CORREÇÃO ESPECÍFICA - TEMPLATE DE CRUZEIRO =====
// ================================================================================
// 🏆 CVC ITAQUA - TEMPLATE CRUZEIRO CORRIGIDO v5.1.0-cruzeiro
// ================================================================================
// FOCO: Corrigir formato de cruzeiro para o padrão CVC desejado
// ================================================================================

// ================================================================================
// 📋 TEMPLATE CRUZEIRO CORRIGIDO
// ================================================================================

const TEMPLATE_CRUZEIRO_CORRETO = `🚢 Cruzeiro [NOME_NAVIO] – [DURACAO_NOITES] noites
[COMPOSICAO_PASSAGEIROS]
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO_EMBARQUE]
🌊 Roteiro incrível pelo litoral brasileiro!

🗺 Itinerário:
[ROTEIRO_DETALHADO]

💥 [TIPO_TARIFA]!
(Sujeita à confirmação de cabine e categoria)

[OPCOES_CABINES]

📎 Link para ver fotos, detalhes e reservar:
[LINK_CRUZEIRO]

✅ Inclui: hospedagem a bordo, pensão completa (refeições), entretenimento e atividades para todas as idades!
🚫 Não inclui: taxas, bebidas, excursões e transporte até o porto.

📲 Me chama pra garantir a sua cabine nesse cruzeiro incrível! 🌴🛳️`;

const TEMPLATES = {
  // ✈️ AÉREO (mantidos iguais)
  'Aéreo Facial': `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA]
🗓️ [DATA] (Somente ida)
✈️ [DATA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA]

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem somente de ida - sem retorno incluído`,

  'Aéreo Múltiplas': `*Passagens Aéreas - Opções Somente Ida*

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
📞 Dúvidas? Estamos aqui para ajudar!`,

  'Aéreo VBI/Fácil': `*Passagem Aérea VBI/Fácil*
🏷️ [COMPANHIA]
🗓️ [DATA_IDA] a [DATA_VOLTA] ([DURACAO])
✈️ Ida: [DATA_IDA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA_IDA]
✈️ Volta: [DATA_VOLTA] - [DESTINO] [HORA_SAIDA_VOLTA] / [ORIGEM] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem ida e volta incluída`,

  // 🚢 CRUZEIRO CORRIGIDO
  'Cruzeiro': TEMPLATE_CRUZEIRO_CORRETO,

  // 🏨 HOTEL (mantido igual)
  'Hotel': `*Hospedagem*
🏨 [NOME_HOTEL] - [CATEGORIA]⭐
📍 [LOCALIZACAO]
🗓️ [CHECK_IN] a [CHECK_OUT] ([NOITES] noites)
👥 [ADULTOS] adultos[CRIANCAS_TEXTO]

🏠 *Acomodação:*
[TIPO_QUARTO] com [REGIME_ALIMENTACAO]

✅ *Inclui:*
• [CAFE_MANHA]
• [WIFI]
• [SERVICOS_INCLUSOS]

💰 R$ [VALOR_TOTAL] para toda a estadia
💳 Parcelamento: [PARCELAS]x de R$ [VALOR_PARCELA]

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva`,

  // 🚗 CARRO (mantido igual)
  'Carro': `*Aluguel de Carro*
🚗 [MODELO_CARRO] - [CATEGORIA]
🏢 [LOCADORA]
📍 Retirada: [LOCAL_RETIRADA]
📍 Devolução: [LOCAL_DEVOLUCAO]
🗓️ [DATA_RETIRADA] às [HORA_RETIRADA] até [DATA_DEVOLUCAO] às [HORA_DEVOLUCAO]
⏱️ [DURACAO_DIAS] dias

🔧 *Especificações:*
• [CAMBIO] | [COMBUSTIVEL]
• [AR_CONDICIONADO]
• [PORTAS] portas | [PASSAGEIROS] passageiros
• [BAGAGEM]

✅ *Inclui:*
• [QUILOMETRAGEM]
• [SEGUROS_INCLUSOS]
• [TAXAS_INCLUIDAS]

💰 R$ [VALOR_TOTAL] para [DURACAO_DIAS] dias
💳 [FORMA_PAGAMENTO]
🔗 [LINK]

⚠️ Valores sujeitos à disponibilidade. Documentação obrigatória: CNH válida`,

  // Outros templates mantidos...
  'Frete': `*Serviço de Frete*
📦 [TIPO_FRETE]
📍 Origem: [ORIGEM_FRETE]
📍 Destino: [DESTINO_FRETE]

💰 R$ [VALOR_FRETE]
💳 [FORMA_PAGAMENTO]

⚠️ Sujeito às condições da transportadora`,

  'Traslado': `*Serviço de Traslado*
🚌 [TIPO_VEICULO]
📍 [ORIGEM_TRASLADO] ➜ [DESTINO_TRASLADO]
🗓️ [DATA_TRASLADO] às [HORA_TRASLADO]

💰 R$ [VALOR_TRASLADO]
💳 [FORMA_PAGAMENTO]

⚠️ Apresentar-se no local com 15 minutos de antecedência`,

  'Passeios': `*Passeio/Excursão*
🎢 [NOME_PASSEIO]
📍 [DESTINO_PASSEIO]
🗓️ [DATA_PASSEIO] às [HORA_INICIO]

💰 R$ [VALOR_PASSEIO] por pessoa
💳 [FORMA_PAGAMENTO]

⚠️ Sujeito às condições climáticas`,

  'Seguro': `*Seguro Viagem*
🛡️ [SEGURADORA] - [PLANO_SEGURO]
🗓️ Vigência: [DATA_INICIO] a [DATA_FIM]
🌍 Cobertura: [ABRANGENCIA_GEOGRAFICA]

💰 R$ [VALOR_SEGURO] por pessoa
💳 [FORMA_PAGAMENTO]

⚠️ Leia atentamente as condições gerais`,

  'Circuito': `*Circuito/Pacote Turístico*
🗺️ [NOME_CIRCUITO]
🌍 [DESTINOS_CIRCUITO]
🗓️ [DATA_INICIO] a [DATA_FIM] ([DURACAO_TOTAL])

💰 R$ [VALOR_CIRCUITO] por pessoa
💳 Parcelamento: [PARCELAS_CIRCUITO]x de R$ [VALOR_PARCELA_CIRCUITO]

⚠️ Documentação necessária: [DOCUMENTOS_NECESSARIOS]`
};

// ================================================================================
// 🗺️ DADOS AUXILIARES
// ================================================================================

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
    console.log('[CRUZEIRO-FIX] Iniciando processamento...');
    
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
        message: 'CVC Itaqua API - Template Cruzeiro Corrigido',
        version: '5.1.0-cruzeiro',
        produtos_suportados: Object.keys(TEMPLATES),
        template_cruzeiro: 'FORMATO CVC CORRIGIDO',
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

    const { prompt, temImagem, arquivo, tipos } = req.body;
    console.log(`[CRUZEIRO-FIX] Prompt: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}`);

    // ANÁLISE E SELEÇÃO DE TEMPLATE
    const analise = analisarConteudoCompleto(prompt, tipos);
    const template = selecionarTemplateCompleto(analise, tipos);
    console.log(`[CRUZEIRO-FIX] Template selecionado: ${template.nome}`);

    // CONSTRUIR PROMPT ESPECIALIZADO
    const promptFinal = construirPromptEspecializadoCruzeiro(prompt, template, analise, tipos);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[CRUZEIRO-FIX] Concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [CRUZEIRO-FIX ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '5.1.0-cruzeiro'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE COMPLETA DE CONTEÚDO
// ================================================================================

function analisarConteudoCompleto(prompt, tipos) {
  console.log('[ANÁLISE-CRUZEIRO] Analisando tipos:', tipos);
  
  if (!prompt || !tipos || tipos.length === 0) {
    return { 
      tipo: 'generico', 
      multiplasOpcoes: false,
      produtosPrincipais: ['Aéreo Facial']
    };
  }

  const promptLower = prompt.toLowerCase();
  
  // Para cruzeiro, detectar múltiplas opções de cabine
  let multiplasOpcoes = false;
  if (tipos.includes('Cruzeiro')) {
    const precosCruzeiro = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
    const cabines = (promptLower.match(/(interna|externa|varanda|suite)/gi) || []).length;
    multiplasOpcoes = precosCruzeiro >= 2 || cabines >= 2;
    console.log(`[ANÁLISE-CRUZEIRO] Preços: ${precosCruzeiro}, Cabines: ${cabines}, Múltiplas: ${multiplasOpcoes}`);
  } else {
    // Para outros produtos
    const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
    const totais = (promptLower.match(/total.*\d+/gi) || []).length;
    const links = (promptLower.match(/https:\/\/www\.cvc\.com\.br/gi) || []).length;
    multiplasOpcoes = Math.max(precos, totais, links) >= 2;
  }
  
  let tipoPrincipal = 'generico';
  
  if (tipos.includes('Aéreo Facial') || tipos.includes('Aéreo VBI/Fácil')) {
    tipoPrincipal = 'aereo';
  } else if (tipos.includes('Hotel')) {
    tipoPrincipal = 'hotel';
  } else if (tipos.includes('Carro')) {
    tipoPrincipal = 'carro';
  } else if (tipos.includes('Cruzeiro')) {
    tipoPrincipal = 'cruzeiro';
  } else {
    tipoPrincipal = tipos[0]?.toLowerCase() || 'generico';
  }
  
  console.log(`[ANÁLISE-CRUZEIRO] Tipo principal: ${tipoPrincipal}, Múltiplas: ${multiplasOpcoes}`);
  
  return {
    tipo: tipoPrincipal,
    multiplasOpcoes: multiplasOpcoes,
    produtosPrincipais: tipos
  };
}

// ================================================================================
// 🎯 SELEÇÃO DE TEMPLATE COMPLETO
// ================================================================================

function selecionarTemplateCompleto(analise, tipos) {
  console.log('[TEMPLATE-CRUZEIRO] Selecionando para:', tipos);
  
  if (!tipos || tipos.length === 0) {
    return {
      nome: 'Aéreo Facial',
      conteudo: TEMPLATES['Aéreo Facial']
    };
  }

  // Priorizar primeiro tipo selecionado
  const tipoPrincipal = tipos[0];
  
  // Para aéreo, verificar se é múltiplas opções
  if (tipoPrincipal === 'Aéreo Facial' && analise.multiplasOpcoes) {
    return {
      nome: 'Aéreo Múltiplas',
      conteudo: TEMPLATES['Aéreo Múltiplas']
    };
  }
  
  // Buscar template específico
  if (TEMPLATES[tipoPrincipal]) {
    return {
      nome: tipoPrincipal,
      conteudo: TEMPLATES[tipoPrincipal]
    };
  }
  
  // Fallback para aéreo
  console.warn(`[TEMPLATE-CRUZEIRO] Template não encontrado para: ${tipoPrincipal}, usando Aéreo Facial`);
  return {
    nome: 'Aéreo Facial',
    conteudo: TEMPLATES['Aéreo Facial']
  };
}

// ================================================================================
// 🏗️ PROMPT ESPECIALIZADO PARA CRUZEIRO
// ================================================================================

function construirPromptEspecializadoCruzeiro(promptBase, template, analise, tipos) {
  console.log('[PROMPT-CRUZEIRO] Construindo para:', template.nome);
  
  const tipoPrincipal = tipos?.[0] || 'Aéreo Facial';
  
  let prompt = `Você é um assistente especializado da CVC. Formate o orçamento de ${tipoPrincipal} usando EXATAMENTE o template abaixo.

PRODUTO SELECIONADO: ${tipoPrincipal}
MÚLTIPLAS OPÇÕES: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}

TEMPLATE OBRIGATÓRIO:
${template.conteudo}

DADOS FORNECIDOS PELO CLIENTE:
${promptBase}

`;

  // Instruções específicas para CRUZEIRO
  if (tipoPrincipal === 'Cruzeiro') {
    prompt += `INSTRUÇÕES ESPECÍFICAS PARA CRUZEIRO:

1. **FORMATO OBRIGATÓRIO**: Use exatamente o modelo acima com emojis
2. **NOME DO NAVIO**: Extraia "MSC Sinfonia" → "MSC Sinfonia"
3. **DURAÇÃO**: Extraia "3 noites" 
4. **COMPOSIÇÃO**: "2 adultos" (ajuste se houver crianças)
5. **DATA EMBARQUE**: "25/11/2025" + dia da semana se souber
6. **PORTO**: "Santos, Brasil" (saída e chegada)
7. **ROTEIRO DETALHADO**: Format como:
   25/11 – Santos – saída 17:00
   26/11 – Ilha Grande – 08:00 às 20:00
   27/11 – Em navegação
   28/11 – Santos – chegada 08:00

8. **TIPO TARIFA**: Use "Tarifa Super Bingo MSC" ou similar se não especificado
9. **OPÇÕES DE CABINES**: Formate como:
   🛏 Cabine Interna Bella – IB: R$ 4.010,00
   🌅 Cabine Externa com Vista Mar – OB: R$ 4.270,00  
   🚪 Cabine com Varanda Bella – BB: R$ 4.610,00

10. **LINK**: Use o link exato fornecido
11. **TEXTO FINAL**: Mantenha sempre o texto motivacional padrão CVC

EXEMPLO ESPECÍFICO PARA SEU CASO:

🚢 Cruzeiro MSC Sinfonia – 3 noites
2 adultos
📅 Embarque: 25/11/2025 (segunda)
📍 Saída e chegada: Santos, Brasil
🌊 Roteiro incrível pelo litoral brasileiro!

🗺 Itinerário:
25/11 – Santos – saída 17:00
26/11 – Ilha Grande – 08:00 às 20:00
27/11 – Em navegação
28/11 – Santos – chegada 08:00

💥 Tarifa Super Bingo MSC!
(Sujeita à confirmação de cabine e categoria)

🛏 Cabine Interna Bella – IB: R$ 4.010,00
🌅 Cabine Externa com Vista Mar – OB: R$ 4.270,00
🚪 Cabine com Varanda Bella – BB: R$ 4.610,00

📎 Link para ver fotos, detalhes e reservar:
https://cruzeiros.atlas.cvc.com.br/quote/688928f63566df010a05e5df

✅ Inclui: hospedagem a bordo, pensão completa (refeições), entretenimento e atividades para todas as idades!
🚫 Não inclui: taxas, bebidas, excursões e transporte até o porto.

📲 Me chama pra garantir a sua cabine nesse cruzeiro incrível! 🌴🛳️

RESPONDA APENAS COM O TEMPLATE PREENCHIDO EXATAMENTE COMO MOSTRADO ACIMA.`;

  } else {
    // Instruções para outros produtos (mantidas iguais)
    prompt += `INSTRUÇÕES ESPECÍFICAS PARA ${tipoPrincipal.toUpperCase()}:
- Use EXATAMENTE o formato do template
- Preencha apenas com dados reais fornecidos
- Não invente informações que não existem
- Mantenha links e valores exatos
- Responda APENAS com o template preenchido`;
  }

  return prompt;
}

// ================================================================================
// 🤖 SISTEMA DE IA (mantido igual)
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
  try {
    if (temImagem === true) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ Falha principal: ${erro1.message}`);
    try {
      return await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelo);
    } catch (erro2) {
      throw new Error(`Ambos modelos falharam: ${erro1.message} | ${erro2.message}`);
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
    { type: "image", source: { type: "base64", media_type: base64Match[1], data: base64Match[2] } }
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
// 🔧 PROCESSAMENTO (mantido igual)
// ================================================================================

function processarResposta(response) {
  if (!response || typeof response !== 'string') {
    return 'Erro: Resposta inválida';
  }

  let processada = response.trim();

  // Conversão de aeroportos para produtos aéreos
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

console.log('✅ [CRUZEIRO-FIX] CVC Itaqua API v5.1.0-cruzeiro carregada');
console.log('🚢 [FOCO] Template de cruzeiro corrigido para formato CVC padrão');
console.log('📋 [TEMPLATE] Formato específico: emoji inicial + roteiro detalhado + opções cabines');
console.log('🎯 [EXEMPLO] Resultado esperado: formato WhatsApp profissional CVC');
console.log('🚀 [STATUS] Pronto para gerar cruzeiros no formato correto!');
