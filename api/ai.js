// ================================================================================
// 🏆 CVC ITAQUA - API CORRIGIDA v5.2.0-clean
// ================================================================================
// FOCO: Orçamentos limpos sem cabeçalhos técnicos + Detalhes de escalas
// ================================================================================

// ================================================================================
// 🗺️ MAPEAMENTO COMPLETO DE AEROPORTOS
// ================================================================================

const aeroportos = {
  // Principais aeroportos brasileiros
  'CGH': 'Congonhas (SP)', 'GRU': 'Guarulhos (SP)', 'VCP': 'Viracopos (SP)',
  'SDU': 'Santos Dumont (RJ)', 'GIG': 'Galeão (RJ)', 
  'BSB': 'Brasília (DF)', 'CNF': 'Confins (MG)', 'PLU': 'Pampulha (MG)',
  'CWB': 'Curitiba (PR)', 'IGU': 'Foz do Iguaçu (PR)', 
  'REC': 'Recife (PE)', 'FOR': 'Fortaleza (CE)', 'SSA': 'Salvador (BA)',
  'MAO': 'Manaus (AM)', 'BEL': 'Belém (PA)', 'CGB': 'Cuiabá (MT)',
  'CGR': 'Campo Grande (MS)', 'AJU': 'Aracaju (SE)', 'MCZ': 'Maceió (AL)',
  'JPA': 'João Pessoa (PB)', 'NAT': 'Natal (RN)', 'THE': 'Teresina (PI)',
  'SLZ': 'São Luís (MA)', 'VIX': 'Vitória (ES)', 'FLN': 'Florianópolis (SC)',
  'POA': 'Porto Alegre (RS)', 'BPS': 'Porto Seguro (BA)', 'IOS': 'Ilhéus (BA)',
  'RAO': 'Ribeirão Preto (SP)', 'NVT': 'Navegantes (SC)', 'UDI': 'Uberlândia (MG)',
  'MOC': 'Montes Claros (MG)', 'JDF': 'Juiz de Fora (MG)', 'GYN': 'Goiânia (GO)',
  'PNZ': 'Petrolina (PE)', 'JTC': 'Bauru (SP)', 'AQA': 'Araraquara (SP)',
  'PPB': 'Presidente Prudente (SP)', 'CXJ': 'Caxias do Sul (RS)',
  
  // Aeroportos internacionais importantes
  'EZE': 'Buenos Aires (Argentina)', 'MVD': 'Montevidéu (Uruguai)',
  'ASU': 'Assunção (Paraguai)', 'SCL': 'Santiago (Chile)', 'LIM': 'Lima (Peru)',
  'BOG': 'Bogotá (Colômbia)', 'UIO': 'Quito (Equador)', 'CCS': 'Caracas (Venezuela)',
  'MIA': 'Miami (EUA)', 'MCO': 'Orlando (EUA)', 'JFK': 'Nova York (EUA)',
  'LAX': 'Los Angeles (EUA)', 'CDG': 'Paris (França)', 'MAD': 'Madrid (Espanha)',
  'FCO': 'Roma (Itália)', 'LIS': 'Lisboa (Portugal)', 'LGW': 'Londres (Reino Unido)',
  'AMS': 'Amsterdã (Holanda)', 'FRA': 'Frankfurt (Alemanha)', 'ZUR': 'Zurich (Suíça)',
  'DXB': 'Dubai (Emirados)', 'DOH': 'Doha (Catar)', 'IST': 'Istambul (Turquia)'
};

// ================================================================================
// 📋 TEMPLATES LIMPOS (SEM CABEÇALHOS TÉCNICOS)
// ================================================================================

const TEMPLATES = {
  'Aéreo Facial': `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA]
🗓️ [DATA] (Somente ida)
✈️ [DATA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA][DETALHES_VOO]
💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem somente de ida - sem retorno incluído`,

  'Aéreo Múltiplas': `*Passagens Aéreas - Opções Somente Ida*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_1] (Somente ida)
✈️ [DATA_1] - [ORIGEM_1] [HORA_IDA_1] / [DESTINO_1] [HORA_CHEGADA_1][DETALHES_VOO_1]
💰 R$ [VALOR_1] para [PASSAGEIROS_1]
💳 [PAGAMENTO_1]
🔗 [LINK_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_2] (Somente ida)
✈️ [DATA_2] - [ORIGEM_2] [HORA_IDA_2] / [DESTINO_2] [HORA_CHEGADA_2][DETALHES_VOO_2]
💰 R$ [VALOR_2] para [PASSAGEIROS_2]
💳 [PAGAMENTO_2]
🔗 [LINK_2]

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído
📞 Dúvidas? Estamos aqui para ajudar!`,

  'Aéreo VBI/Fácil': `*Passagem Aérea VBI/Fácil*
🏷️ [COMPANHIA]
🗓️ [DATA_IDA] a [DATA_VOLTA] ([DURACAO])
✈️ Ida: [DATA_IDA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA_IDA][DETALHES_VOO_IDA]
✈️ Volta: [DATA_VOLTA] - [DESTINO] [HORA_SAIDA_VOLTA] / [ORIGEM] [HORA_CHEGADA_VOLTA][DETALHES_VOO_VOLTA]

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem ida e volta incluída`,

  'Cruzeiro': `🚢 Cruzeiro [NOME_NAVIO] – [DURACAO_NOITES] noites
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

📲 Me chama pra garantir a sua cabine nesse cruzeiro incrível! 🌴🛳️`,

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

⚠️ Valores sujeitos à disponibilidade. Documentação obrigatória: CNH válida`
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
    console.log('[CLEAN-API] Iniciando processamento...');
    
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
        message: 'CVC Itaqua API - Orçamentos Limpos',
        version: '5.2.0-clean',
        produtos_suportados: Object.keys(TEMPLATES),
        melhorias: [
          'Orçamentos sem cabeçalhos técnicos',
          'Detecção de escalas/conexões',
          'Conversão completa de aeroportos',
          'Templates limpos para copy/paste'
        ],
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
    console.log(`[CLEAN-API] Prompt: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}`);

    // ANÁLISE E SELEÇÃO DE TEMPLATE
    const analise = analisarConteudoCompleto(prompt, tipos);
    const template = selecionarTemplateCompleto(analise, tipos);
    console.log(`[CLEAN-API] Template selecionado: ${template.nome}`);

    // CONSTRUIR PROMPT LIMPO
    const promptFinal = construirPromptLimpo(prompt, template, analise, tipos);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[CLEAN-API] Concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [CLEAN-API ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '5.2.0-clean'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE COMPLETA DE CONTEÚDO
// ================================================================================

function analisarConteudoCompleto(prompt, tipos) {
  console.log('[ANÁLISE-CLEAN] Analisando tipos:', tipos);
  
  if (!prompt || !tipos || tipos.length === 0) {
    return { 
      tipo: 'generico', 
      multiplasOpcoes: false,
      produtosPrincipais: ['Aéreo Facial'],
      temEscalas: false
    };
  }

  const promptLower = prompt.toLowerCase();
  
  // Detectar múltiplas opções
  const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (promptLower.match(/total.*\d+/gi) || []).length;
  const links = (promptLower.match(/https:\/\/www\.cvc\.com\.br/gi) || []).length;
  const companhias = (promptLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  
  const multiplasOpcoes = Math.max(precos, totais, links, companhias) >= 2;
  
  // Detectar escalas/conexões
  const temEscalas = detectarEscalas(prompt);
  
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
  
  console.log(`[ANÁLISE-CLEAN] Tipo: ${tipoPrincipal}, Múltiplas: ${multiplasOpcoes}, Escalas: ${temEscalas}`);
  
  return {
    tipo: tipoPrincipal,
    multiplasOpcoes: multiplasOpcoes,
    produtosPrincipais: tipos,
    temEscalas: temEscalas
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE ESCALAS/CONEXÕES MELHORADA
// ================================================================================

function detectarEscalas(texto) {
  const textoLower = texto.toLowerCase();
  
  // Indicadores de escalas
  const indicadoresEscalas = [
    'uma escala', 'duas escalas', 'três escalas',
    'conexão', 'conexao', 'escala em', 'via ',
    'com escala', 'parada em', 'troca em',
    /\d+h\s*\d+min.*escala/i,
    /escala.*\d+h/i,
    /via\s+\w{3,}/i
  ];
  
  const temEscala = indicadoresEscalas.some(indicador => {
    if (typeof indicador === 'string') {
      return textoLower.includes(indicador);
    } else {
      return indicador.test(texto);
    }
  });
  
  // Detectar também por tempo de voo longo (mais de 4h pode indicar escala)
  const temposVoo = texto.match(/(\d+)h\s*(\d+)?min/gi) || [];
  const temVooLongo = temposVoo.some(tempo => {
    const match = tempo.match(/(\d+)h/);
    if (match && parseInt(match[1]) >= 4) {
      return true;
    }
    return false;
  });
  
  console.log(`[ESCALAS] Detectado: ${temEscala || temVooLongo}`);
  
  return temEscala || temVooLongo;
}

// ================================================================================
// 🎯 SELEÇÃO DE TEMPLATE COMPLETO
// ================================================================================

function selecionarTemplateCompleto(analise, tipos) {
  console.log('[TEMPLATE-CLEAN] Selecionando para:', tipos);
  
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
  console.warn(`[TEMPLATE-CLEAN] Template não encontrado para: ${tipoPrincipal}, usando Aéreo Facial`);
  return {
    nome: 'Aéreo Facial',
    conteudo: TEMPLATES['Aéreo Facial']
  };
}

// ================================================================================
// 🏗️ PROMPT LIMPO SEM CABEÇALHOS TÉCNICOS
// ================================================================================

function construirPromptLimpo(promptBase, template, analise, tipos) {
  console.log('[PROMPT-CLEAN] Construindo prompt limpo...');
  
  const tipoPrincipal = tipos?.[0] || 'Aéreo Facial';
  
  let prompt = `Você é um assistente especializado da CVC. Formate o orçamento de ${tipoPrincipal} usando EXATAMENTE o template abaixo.

IMPORTANTE: Sua resposta deve conter APENAS o orçamento formatado, sem cabeçalhos técnicos, sem explicações, sem "PRODUTO SELECIONADO", sem "MÚLTIPLAS OPÇÕES", sem "TEMPLATE OBRIGATÓRIO".

TEMPLATE PARA USAR:
${template.conteudo}

DADOS DO CLIENTE:
${promptBase}

`;

  // Instruções específicas por tipo
  if (tipoPrincipal === 'Aéreo Facial' || tipoPrincipal === 'Aéreo VBI/Fácil') {
    prompt += `INSTRUÇÕES ESPECÍFICAS PARA AÉREO:

1. **AEROPORTOS**: Converta códigos IATA para nomes completos:
   - CGH = Congonhas (SP)
   - GRU = Guarulhos (SP)
   - VCP = Viracopos (SP)
   - NVT = Navegantes (SC)
   - REC = Recife (PE)
   - SSA = Salvador (BA)
   - E assim por diante para todos os códigos

2. **ESCALAS/CONEXÕES**: Se detectar escalas, adicione detalhes:
   - Para "Uma escala": adicione " (1 escala)" após o horário
   - Para "Duas escalas": adicione " (2 escalas)" após o horário
   - Para "Voo direto": adicione " (voo direto)" após o horário
   - Para conexões específicas: adicione " (via [cidade])" se mencionado

3. **MÚLTIPLAS OPÇÕES**: ${analise.multiplasOpcoes ? 'Formate TODAS as opções encontradas' : 'Formate apenas uma opção'}

4. **LINKS**: Use os links exatos fornecidos nos dados

EXEMPLO DE SAÍDA ESPERADA:
*Passagem Aérea - Somente Ida*
🏷️ LATAM
🗓️ 13 de agosto (Somente ida)
✈️ 13 de agosto - Congonhas (SP) 08:15 / Recife (PE) 15:40 (1 escala)
💰 R$ 2.217,87 para 1 adulto
💳 Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/688a64568c715d91ed9badf0

⚠️ Passagem somente de ida - sem retorno incluído

RESPONDA APENAS COM O ORÇAMENTO FORMATADO, SEM EXPLICAÇÕES.`;

  } else if (tipoPrincipal === 'Cruzeiro') {
    prompt += `INSTRUÇÕES ESPECÍFICAS PARA CRUZEIRO:

1. **FORMATO OBRIGATÓRIO**: Use exatamente o modelo com emojis
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

8. **OPÇÕES DE CABINES**: Formate como:
   🛏 Cabine Interna Bella – IB: R$ 4.010,00
   🌅 Cabine Externa com Vista Mar – OB: R$ 4.270,00  
   🚪 Cabine com Varanda Bella – BB: R$ 4.610,00

RESPONDA APENAS COM O CRUZEIRO FORMATADO, SEM EXPLICAÇÕES.`;

  } else {
    prompt += `INSTRUÇÕES GERAIS:
- Use EXATAMENTE o formato do template
- Preencha apenas com dados reais fornecidos
- Não invente informações que não existem
- Mantenha links e valores exatos
- RESPONDA APENAS COM O TEMPLATE PREENCHIDO, SEM EXPLICAÇÕES`;
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
// 🔧 PROCESSAMENTO MELHORADO COM CONVERSÃO DE AEROPORTOS
// ================================================================================

function processarResposta(response) {
  if (!response || typeof response !== 'string') {
    return 'Erro: Resposta inválida';
  }

  let processada = response.trim();

  // REMOVER cabeçalhos técnicos que possam ter vazado
  const cabecalhosRemover = [
    /PRODUTO SELECIONADO:.*?\n/gi,
    /MÚLTIPLAS OPÇÕES:.*?\n/gi,
    /TEMPLATE OBRIGATÓRIO:.*?\n/gi,
    /INSTRUÇÕES.*?\n/gi
  ];

  cabecalhosRemover.forEach(regex => {
    processada = processada.replace(regex, '');
  });

  // Conversão MELHORADA de aeroportos para nomes completos
  Object.entries(aeroportos).forEach(([codigo, nomeCompleto]) => {
    // Substituir códigos isolados (com espaços ou quebras de linha)
    const regexIsolado = new RegExp(`\\b${codigo}\\b`, 'gi');
    processada = processada.replace(regexIsolado, nomeCompleto);
    
    // Substituir códigos em contextos específicos de voo
    const regexVoo = new RegExp(`(${codigo})\\s*(\\d{2}:\\d{2})`, 'gi');
    processada = processada.replace(regexVoo, `${nomeCompleto} $2`);
  });

  // Limpar múltiplas quebras de linha
  processada = processada.replace(/\n\s*\n/g, '\n\n').trim();

  // Remover linhas vazias no início
  processada = processada.replace(/^\s*\n+/, '');

  return processada;
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

console.log('✅ [CLEAN-API] CVC Itaqua API v5.2.0-clean carregada');
console.log('🧹 [FOCO] Orçamentos limpos sem cabeçalhos técnicos');
console.log('✈️ [MELHORIA] Detecção de escalas e conversão completa de aeroportos');
console.log('📋 [RESULTADO] Templates prontos para copy/paste direto');
console.log('🎯 [EXEMPLO] NVT → Navegantes (SC), CGH → Congonhas (SP)');
console.log('🚀 [STATUS] Pronto para gerar orçamentos profissionais!');
