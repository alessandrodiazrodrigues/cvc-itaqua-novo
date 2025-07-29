// ===== SISTEMA COMPLETO - TODOS OS TIPOS DE PRODUTOS =====
// ================================================================================
// 🏆 CVC ITAQUA - API COMPLETA v5.0.0-complete
// ================================================================================
// TODOS OS PRODUTOS: Aéreo, Hotel, Carro, Cruzeiro, Frete, Traslado, Passeios, Seguro, Circuito
// ================================================================================

// ================================================================================
// 📋 TEMPLATES PARA TODOS OS PRODUTOS
// ================================================================================

const TEMPLATES = {
  // ✈️ AÉREO
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

  // 🏨 HOTEL
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

  // 🚗 CARRO
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

  // 🚢 CRUZEIRO
  'Cruzeiro': `*Cruzeiro Marítimo*
🚢 [NOME_NAVIO] - [COMPANHIA_CRUZEIRO]
🗓️ [DATA_EMBARQUE] a [DATA_DESEMBARQUE] ([DURACAO_NOITES] noites)
📍 Embarque: [PORTO_EMBARQUE]
🗺️ *Roteiro:* [ROTEIRO_DESTINOS]

🛏️ *Acomodação:*
[CATEGORIA_CABINE] para [PASSAGEIROS]
[LOCALIZACAO_CABINE]

🍽️ *Inclui:*
• [REGIME_ALIMENTACAO]
• [ENTRETENIMENTO_BORDO]
• [SERVICOS_INCLUSOS]

💰 R$ [VALOR_TOTAL] para [PASSAGEIROS]
💳 Parcelamento: [PARCELAS]x de R$ [VALOR_PARCELA]
🔗 [LINK]

⚠️ Documentação: Passaporte ou RG (conforme roteiro). Taxas de embarque não incluídas`,

  // 📦 FRETE
  'Frete': `*Serviço de Frete*
📦 [TIPO_FRETE]
📍 Origem: [ORIGEM_FRETE]
📍 Destino: [DESTINO_FRETE]
📏 Dimensões: [DIMENSOES]
⚖️ Peso: [PESO]

⏱️ *Prazo de Entrega:*
[PRAZO_ENTREGA] dias úteis

✅ *Inclui:*
• [TIPO_SERVICO]
• [RASTREAMENTO]
• [SEGURO_FRETE]

💰 R$ [VALOR_FRETE]
💳 [FORMA_PAGAMENTO]

⚠️ Sujeito às condições da transportadora. Documentação necessária conforme produto`,

  // 🚌 TRASLADO
  'Traslado': `*Serviço de Traslado*
🚌 [TIPO_VEICULO] - [CATEGORIA_TRASLADO]
📍 [ORIGEM_TRASLADO] ➜ [DESTINO_TRASLADO]
🗓️ [DATA_TRASLADO] às [HORA_TRASLADO]
👥 [PASSAGEIROS_TRASLADO] passageiros

🧳 *Especificações:*
• [BAGAGEM_INCLUIDA]
• [AR_CONDICIONADO_VEICULO]
• [WIFI_VEICULO]

✅ *Inclui:*
• [MOTORISTA_PROFISSIONAL]
• [COMBUSTIVEL_INCLUIDO]
• [PEDÁGIOS]

💰 R$ [VALOR_TRASLADO]
💳 [FORMA_PAGAMENTO]
🔗 [LINK]

⚠️ Apresentar-se no local com 15 minutos de antecedência`,

  // 🎢 PASSEIOS
  'Passeios': `*Passeio/Excursão*
🎢 [NOME_PASSEIO]
📍 [DESTINO_PASSEIO]
🗓️ [DATA_PASSEIO] às [HORA_INICIO]
⏱️ Duração: [DURACAO_PASSEIO]
👥 [PARTICIPANTES] pessoas

🗺️ *Roteiro:*
[ROTEIRO_DETALHADO]

✅ *Inclui:*
• [TRANSPORTE_PASSEIO]
• [GUIA_ACOMPANHANTE]
• [INGRESSOS_INCLUSOS]
• [ALIMENTACAO_PASSEIO]

❌ *Não Inclui:*
• [EXTRAS_NAO_INCLUSOS]

💰 R$ [VALOR_PASSEIO] por pessoa
💳 [FORMA_PAGAMENTO]
🔗 [LINK]

⚠️ Sujeito às condições climáticas. Cancelamento gratuito até [PRAZO_CANCELAMENTO]`,

  // 🛡️ SEGURO
  'Seguro': `*Seguro Viagem*
🛡️ [SEGURADORA] - [PLANO_SEGURO]
🗓️ Vigência: [DATA_INICIO] a [DATA_FIM]
🌍 Cobertura: [ABRANGENCIA_GEOGRAFICA]
👥 [SEGURADOS] segurado(s)

💊 *Coberturas Médicas:*
• Despesas médicas: até R$ [COBERTURA_MEDICA]
• Odontológica: até R$ [COBERTURA_ODONTO]
• Medicamentos: até R$ [COBERTURA_MEDICAMENTOS]

🧳 *Coberturas de Bagagem:*
• Bagagem extraviada: até R$ [COBERTURA_BAGAGEM]
• Atraso de bagagem: até R$ [COBERTURA_ATRASO_BAGAGEM]

✈️ *Outras Coberturas:*
• Cancelamento de viagem: até R$ [COBERTURA_CANCELAMENTO]
• Atraso de voo: até R$ [COBERTURA_ATRASO_VOO]
• [OUTRAS_COBERTURAS]

💰 R$ [VALOR_SEGURO] por pessoa
💳 [FORMA_PAGAMENTO]
🔗 [LINK]

⚠️ Leia atentamente as condições gerais. Carência de [CARENCIA] horas`,

  // 🗺️ CIRCUITO
  'Circuito': `*Circuito/Pacote Turístico*
🗺️ [NOME_CIRCUITO]
🌍 [DESTINOS_CIRCUITO]
🗓️ [DATA_INICIO] a [DATA_FIM] ([DURACAO_TOTAL])
👥 [PARTICIPANTES_CIRCUITO] pessoas

✈️ *Transporte:*
• [TRANSPORTE_IDA_VOLTA]
• [TRANSPORTE_INTERNO]

🏨 *Hospedagem:*
• [HOTEIS_CIRCUITO]
• [REGIME_ALIMENTACAO_CIRCUITO]

🎯 *Roteiro:*
[ROTEIRO_CIRCUITO_DETALHADO]

✅ *Inclui:*
• [TRANSPORTE_INCLUIDO]
• [HOSPEDAGEM_INCLUIDA]
• [ALIMENTACAO_INCLUIDA]
• [PASSEIOS_INCLUSOS]
• [GUIA_ACOMPANHANTE_CIRCUITO]

❌ *Não Inclui:*
• [EXTRAS_NAO_INCLUSOS_CIRCUITO]

💰 R$ [VALOR_CIRCUITO] por pessoa
💳 Parcelamento: [PARCELAS_CIRCUITO]x de R$ [VALOR_PARCELA_CIRCUITO]
🔗 [LINK]

⚠️ Documentação necessária: [DOCUMENTOS_NECESSARIOS]. Sujeito a alterações por condições climáticas`
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
    console.log('[COMPLETE] Iniciando processamento completo...');
    
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
        message: 'CVC Itaqua API Completa - Todos os Produtos',
        version: '5.0.0-complete',
        produtos_suportados: Object.keys(TEMPLATES),
        total_templates: Object.keys(TEMPLATES).length,
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
    console.log(`[COMPLETE] Prompt: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}`);

    // ANÁLISE E SELEÇÃO DE TEMPLATE
    const analise = analisarConteudoCompleto(prompt, tipos);
    const template = selecionarTemplateCompleto(analise, tipos);
    console.log(`[COMPLETE] Template selecionado: ${template.nome}`);

    // CONSTRUIR PROMPT ESPECIALIZADO
    const promptFinal = construirPromptEspecializado(prompt, template, analise, tipos);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[COMPLETE] Concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [COMPLETE ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '5.0.0-complete'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE COMPLETA DE CONTEÚDO
// ================================================================================

function analisarConteudoCompleto(prompt, tipos) {
  console.log('[ANÁLISE-COMPLETA] Analisando tipos:', tipos);
  
  if (!prompt || !tipos || tipos.length === 0) {
    return { 
      tipo: 'generico', 
      multiplasOpcoes: false,
      produtosPrincipais: ['Aéreo Facial']
    };
  }

  const promptLower = prompt.toLowerCase();
  
  // Detectar múltiplas opções
  const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (promptLower.match(/total.*\d+/gi) || []).length;
  const links = (promptLower.match(/https:\/\/www\.cvc\.com\.br/gi) || []).length;
  const multiplasOpcoes = Math.max(precos, totais, links) >= 2;
  
  // Analisar tipo de conteúdo baseado nos produtos selecionados
  let tipoPrincipal = 'generico';
  
  if (tipos.includes('Aéreo Facial') || tipos.includes('Aéreo VBI/Fácil')) {
    tipoPrincipal = 'aereo';
  } else if (tipos.includes('Hotel')) {
    tipoPrincipal = 'hotel';
  } else if (tipos.includes('Carro')) {
    tipoPrincipal = 'carro';
  } else if (tipos.includes('Cruzeiro')) {
    tipoPrincipal = 'cruzeiro';
  } else if (tipos.includes('Circuito')) {
    tipoPrincipal = 'circuito';
  } else {
    tipoPrincipal = tipos[0]?.toLowerCase() || 'generico';
  }
  
  console.log(`[ANÁLISE-COMPLETA] Tipo principal: ${tipoPrincipal}, Múltiplas: ${multiplasOpcoes}`);
  
  return {
    tipo: tipoPrincipal,
    multiplasOpcoes: multiplasOpcoes,
    produtosPrincipais: tipos,
    indicadores: { precos, totais, links }
  };
}

// ================================================================================
// 🎯 SELEÇÃO DE TEMPLATE COMPLETO
// ================================================================================

function selecionarTemplateCompleto(analise, tipos) {
  console.log('[TEMPLATE-COMPLETO] Selecionando para:', tipos);
  
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
  console.warn(`[TEMPLATE-COMPLETO] Template não encontrado para: ${tipoPrincipal}, usando Aéreo Facial`);
  return {
    nome: 'Aéreo Facial',
    conteudo: TEMPLATES['Aéreo Facial']
  };
}

// ================================================================================
// 🏗️ PROMPT ESPECIALIZADO POR PRODUTO
// ================================================================================

function construirPromptEspecializado(promptBase, template, analise, tipos) {
  console.log('[PROMPT-ESPECIALIZADO] Construindo para:', template.nome);
  
  const tipoPrincipal = tipos?.[0] || 'Aéreo Facial';
  
  let prompt = `Você é um assistente especializado da CVC. Formate o orçamento de ${tipoPrincipal} usando EXATAMENTE o template abaixo.

PRODUTO SELECIONADO: ${tipoPrincipal}
MÚLTIPLAS OPÇÕES: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}

TEMPLATE OBRIGATÓRIO:
${template.conteudo}

DADOS FORNECIDOS PELO CLIENTE:
${promptBase}

INSTRUÇÕES ESPECÍFICAS PARA ${tipoPrincipal.toUpperCase()}:
`;

  // Instruções específicas por tipo de produto
  switch (tipoPrincipal) {
    case 'Aéreo Facial':
    case 'Aéreo VBI/Fácil':
      prompt += `
- Converta siglas de aeroportos (VCP→Viracopos, GRU→Guarulhos, BSB→Brasília)
- Para somente ida, use "(Somente ida)" e NÃO adicione linha de volta
- Para ida/volta, inclua ambos os trechos
- Mantenha links exatos como fornecidos
- Use formato de data brasileiro (01/ago)`;
      break;
      
    case 'Hotel':
      prompt += `
- Extraia nome do hotel, categoria (estrelas), localização
- Calcule número de noites entre check-in e check-out
- Identifique regime de alimentação (café, meia pensão, etc.)
- Especifique tipo de quarto e ocupação
- Inclua serviços como WiFi, piscina, etc.`;
      break;
      
    case 'Carro':
      prompt += `
- Identifique modelo, categoria e locadora
- Extraia locais de retirada e devolução
- Calcule duração em dias
- Especifique câmbio, combustível, ar condicionado
- Inclua seguros e quilometragem incluída`;
      break;
      
    case 'Cruzeiro':
      prompt += `
- Nome do navio e companhia
- Roteiro com portos de parada
- Categoria de cabine e localização
- Regime de alimentação a bordo
- Entretenimento e serviços inclusos`;
      break;
      
    case 'Seguro':
      prompt += `
- Seguradora e nome do plano
- Período de vigência da cobertura
- Valores de cobertura médica, bagagem, cancelamento
- Abrangência geográfica
- Carência e condições especiais`;
      break;
      
    case 'Passeios':
      prompt += `
- Nome e descrição do passeio
- Data, horário e duração
- Roteiro detalhado
- O que está incluso (transporte, guia, ingressos, alimentação)
- O que NÃO está incluso`;
      break;
      
    case 'Traslado':
      prompt += `
- Tipo de veículo e categoria
- Trajeto origem → destino
- Data e horário
- Número de passageiros
- Bagagem incluída e especificações`;
      break;
      
    case 'Frete':
      prompt += `
- Tipo de frete e modalidade
- Origem e destino
- Dimensões e peso
- Prazo de entrega
- Rastreamento e seguro`;
      break;
      
    case 'Circuito':
      prompt += `
- Nome do circuito e destinos
- Duração total da viagem  
- Transporte ida/volta e interno
- Hotéis e regime alimentação
- Roteiro dia a dia
- Passeios inclusos e opcionais`;
      break;
      
    default:
      prompt += `
- Use os dados fornecidos para preencher o template
- Mantenha formato profissional
- Inclua todas as informações relevantes`;
  }

  prompt += `

REGRAS GERAIS:
1. Use EXATAMENTE o formato do template
2. Mantenha todos os emojis e estrutura
3. Preencha apenas com dados reais fornecidos
4. Não invente informações que não existem
5. Mantenha links e valores exatos
6. Use moeda brasileira (R$) 
7. Responda APENAS com o template preenchido

Se alguma informação não estiver disponível, use "A consultar" ou "Conforme disponibilidade".`;

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
// 🔧 PROCESSAMENTO
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

  // Remover linhas de volta indesejadas em produtos somente ida
  if (processada.includes('✈️ Volta:') && processada.includes('(Somente ida)')) {
    console.warn('[PROCESSAMENTO] Removendo linha de volta em produto somente ida');
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

console.log('✅ [COMPLETE] CVC Itaqua API v5.0.0-complete carregada');
console.log('🎯 [PRODUTOS] Todos os 9 tipos de produtos suportados:');
console.log('   ✈️ Aéreo Facial | ✈️ Aéreo VBI/Fácil | 🏨 Hotel | 🚗 Carro | 🚢 Cruzeiro');
console.log('   📦 Frete | 🚌 Traslado | 🎢 Passeios | 🛡️ Seguro | 🗺️ Circuito');
console.log('📋 [TEMPLATES] 10 templates específicos criados');
console.log('🚀 [STATUS] Sistema completo pronto para todos os produtos!');
