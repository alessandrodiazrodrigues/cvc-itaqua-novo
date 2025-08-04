// ================================================================================
// 🚀 CVC ITAQUA API v7.0 - VERCEL FUNCTIONS COMPLETO
// ================================================================================

console.log("🚀 INICIANDO CVC ITAQUA API v7.0 - VERCEL");

// ================================================================================
// 🎯 CONFIGURAÇÕES
// ================================================================================

const CONFIG = {
  versao: '7.0.0',
  modelos: {
    principal: 'gpt-4o-mini',
    imagem: 'claude-3-5-sonnet-20240620',
    premium: 'gpt-4o'
  },
  precos: {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
  },
  limites: {
    max_tokens: 2500,
    timeout: 30000
  }
};

// ================================================================================
// 🗺️ AEROPORTOS
// ================================================================================

const AEROPORTOS = {
  'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
  'SDU': 'Santos Dumont', 'GIG': 'Galeão', 
  'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha',
  'CWB': 'Curitiba', 'IGU': 'Foz do Iguaçu', 
  'REC': 'Recife', 'FOR': 'Fortaleza', 'SSA': 'Salvador',
  'MAO': 'Manaus', 'BEL': 'Belém', 'CGB': 'Cuiabá',
  'CGR': 'Campo Grande', 'AJU': 'Aracaju', 'MCZ': 'Maceió',
  'JPA': 'João Pessoa', 'NAT': 'Natal', 'THE': 'Teresina',
  'SLZ': 'São Luís', 'VIX': 'Vitória', 'FLN': 'Florianópolis',
  'POA': 'Porto Alegre', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus'
};

// ================================================================================
// 🔍 ANÁLISE DE CONTEÚDO
// ================================================================================

function analisarConteudo(prompt, tipos, temImagem) {
  console.log('[ANALISE] 🔍 Iniciando análise...');
  
  const texto = prompt.toLowerCase();
  
  const analise = {
    tipo: 'aereo',
    multiplasOpcoes: texto.includes('opção 1') || texto.includes('plano 1') || texto.includes('**opção'),
    temEscalas: texto.includes('escala') || texto.includes('conexão'),
    temCruzeiro: texto.includes('cruzeiro') || texto.includes('cabine') || texto.includes('navio'),
    temPacote: texto.includes('pacote') || (texto.includes('hotel') && texto.includes('aéreo')),
    complexidade: temImagem ? 'alta' : 'media',
    numeroOpcoes: contarOpcoes(texto)
  };
  
  // Determinar tipo principal
  if (analise.temCruzeiro) {
    analise.tipo = 'cruzeiro';
  } else if (analise.temPacote) {
    analise.tipo = 'pacote';
  } else if (analise.multiplasOpcoes) {
    analise.tipo = analise.numeroOpcoes >= 3 ? 'multiplasOpcoes3' : 'multiplasOpcoes2';
  } else if (analise.temEscalas) {
    analise.tipo = 'aereoConexao';
  }
  
  console.log('[ANALISE] Tipo:', analise.tipo, 'Múltiplas:', analise.multiplasOpcoes);
  return analise;
}

function contarOpcoes(texto) {
  const opcoes = texto.match(/opção \d+|plano \d+|\*\*opção \d+/gi) || [];
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return Math.max(opcoes.length, Math.min(precos.length, 3), 1);
}

// ================================================================================
// 🎯 TEMPLATES
// ================================================================================

function selecionarTemplate(analise, tipos) {
  console.log('[TEMPLATE] Selecionando para tipo:', analise.tipo);
  
  const templates = {
    'aereo': 'AÉREO NACIONAL SIMPLES',
    'aereoConexao': 'AÉREO COM CONEXÃO',
    'multiplasOpcoes2': 'MÚLTIPLAS OPÇÕES (2)',
    'multiplasOpcoes3': 'MÚLTIPLAS OPÇÕES (3)',
    'cruzeiro': 'CRUZEIRO',
    'pacote': 'PACOTE COMPLETO'
  };
  
  return {
    nome: templates[analise.tipo] || templates['aereo'],
    tipo: analise.tipo
  };
}

function construirPrompt(prompt, template, analise, tipos, temImagem) {
  console.log('[PROMPT] Construindo para template:', template.nome);
  
  let promptFinal = `Crie um orçamento profissional CVC Itaqua baseado nestas informações:\n\n${prompt}\n\n`;
  
  // Template específico por tipo
  switch (template.tipo) {
    case 'multiplasOpcoes2':
    case 'multiplasOpcoes3':
      promptFinal += gerarTemplateMultiplasOpcoes(analise.numeroOpcoes);
      break;
    case 'cruzeiro':
      promptFinal += gerarTemplateCruzeiro();
      break;
    case 'pacote':
      promptFinal += gerarTemplatePacote();
      break;
    case 'aereoConexao':
      promptFinal += gerarTemplateConexao();
      break;
    default:
      promptFinal += gerarTemplateAereoSimples();
  }
  
  promptFinal += `\n\nREGRAS OBRIGATÓRIAS:\n`;
  promptFinal += `1. ⏰ HORÁRIOS: "06:20" (NUNCA "06: 20")\n`;
  promptFinal += `2. ✈️ AEROPORTOS: CGH → Congonhas, GRU → Guarulhos\n`;
  promptFinal += `3. 💰 VALORES: "R$ 1.234,56" (espaço após R$)\n`;
  promptFinal += `4. 👥 PASSAGEIROS: "02 adultos" (zero à esquerda)\n`;
  promptFinal += `5. 📅 SEPARADOR: "--" entre ida e volta\n`;
  promptFinal += `6. 🧹 REMOVER cabeçalhos técnicos\n`;
  promptFinal += `7. 📱 FORMATO limpo para WhatsApp\n\n`;
  
  promptFinal += `RESPONDA APENAS COM O ORÇAMENTO FORMATADO, SEM EXPLICAÇÕES.`;
  
  return promptFinal;
}

function gerarTemplateAereoSimples() {
  return `TEMPLATE - AÉREO SIMPLES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
✅ Só mala de mão incluída
🏷️ Não reembolsável`;
}

function gerarTemplateMultiplasOpcoes(numeroOpcoes) {
  return `TEMPLATE - MÚLTIPLAS OPÇÕES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 **OPÇÃO 1** - R$ [VALOR_1]
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

${numeroOpcoes >= 3 ? `💰 **OPÇÃO 3** - R$ [VALOR_3]
✅ Mala de mão + 2 bagagens despachadas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento` : ''}

Valores sujeitos a confirmação e disponibilidade`;
}

function gerarTemplateCruzeiro() {
  return `TEMPLATE - CRUZEIRO:

🚢 *Cruzeiro [NAVIO]* – [X] noites
Para: [PASSAGEIROS]
📅 Embarque: [DD/MM] ([PORTO])

💰 *Opções de Cabines:*
**CABINE INTERNA** - R$ [VALOR_1] ([OCUPAÇÃO])
**CABINE EXTERNA** - R$ [VALOR_2] ([OCUPAÇÃO])
**CABINE COM VARANDA** - R$ [VALOR_3] ([OCUPAÇÃO])

✅ Inclui: hospedagem a bordo, pensão completa, entretenimento
🚫 Não inclui: taxas portuárias, bebidas, excursões
📋 Documentação: RG original (máx. 10 anos) ou passaporte

📲 Me chama pra garantir a sua cabine! 🌴🛳️`;
}

function gerarTemplatePacote() {
  return `TEMPLATE - PACOTE COMPLETO:

*Pacote [DESTINO]*
Pacote para [PASSAGEIROS]

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- Traslado Aeroporto / Hotel / Aeroporto
- [X] noites de hospedagem

✈️ *Voos [COMPANHIA]:*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

**OPÇÃO 1** - [HOTEL_1]
💰 R$ [VALOR_1] para [PASSAGEIROS]

**OPÇÃO 2** - [HOTEL_2]
💰 R$ [VALOR_2] para [PASSAGEIROS]

Valores sujeitos a confirmação e disponibilidade`;
}

function gerarTemplateConexao() {
  return `TEMPLATE - CONEXÃO DETALHADA:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [CONEXÃO] [HH:MM] (voo direto)
(conexão em [CONEXÃO] - [TEMPO] de espera)
[DD/MM] - [CONEXÃO] [HH:MM] / [DESTINO] [HH:MM] (voo direto)
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
✅ Só mala de mão incluída
🏷️ Não reembolsável`;
}

// ================================================================================
// 🔧 PROCESSAMENTO
// ================================================================================

function processarResposta(conteudo) {
  console.log('[PROCESSAMENTO] 🔧 Aplicando formatação...');
  
  if (!conteudo) {
    return "Erro: Resposta vazia da IA";
  }
  
  let processado = conteudo;
  
  try {
    // 1. Remover cabeçalhos técnicos
    processado = removerCabecalhos(processado);
    
    // 2. Aplicar formatação
    processado = aplicarFormatacao(processado);
    
    // 3. Converter aeroportos
    processado = converterAeroportos(processado);
    
    // 4. Limpar para WhatsApp
    processado = limparParaWhatsApp(processado);
    
    console.log('[PROCESSAMENTO] ✅ Processado:', processado.length, 'caracteres');
    return processado;
    
  } catch (error) {
    console.error('[PROCESSAMENTO] ❌ Erro:', error);
    return conteudo; // Retorna original se der erro
  }
}

function removerCabecalhos(conteudo) {
  const padroesRemover = [
    /^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim,
    /^TEMPLATE[^\n]*\n?/gim,
    /^REGRAS[^\n]*\n?/gim,
    /^\d+\.\s*[⏰📅✈️🛫💳👥🧳][^\n]*\n?/gim
  ];
  
  let limpo = conteudo;
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  return limpo.replace(/\n\s*\n\s*\n+/g, '\n\n').trim();
}

function aplicarFormatacao(conteudo) {
  let formatado = conteudo;
  
  // Horários
  formatado = formatado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  formatado = formatado.replace(/\b(\d):/g, '0$1:');
  
  // Valores
  formatado = formatado.replace(/R\$(\d)/g, 'R$ $1');
  
  // Passageiros
  formatado = formatado.replace(/\b(\d) adulto/g, '0$1 adulto');
  formatado = formatado.replace(/\b(\d) adultos/g, '0$1 adultos');
  
  return formatado;
}

function converterAeroportos(conteudo) {
  let convertido = conteudo;
  
  Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    convertido = convertido.replace(regex, nome);
  });
  
  return convertido;
}

function limparParaWhatsApp(conteudo) {
  let limpo = conteudo;
  
  // Remover espaços extras
  limpo = limpo.replace(/\n{3,}/g, '\n\n');
  limpo = limpo.replace(/\n\s+/g, '\n');
  limpo = limpo.replace(/\s+\n/g, '\n');
  
  return limpo.trim();
}

// ================================================================================
// 🤖 SISTEMA DE IA
// ================================================================================

function selecionarModelo(temImagem, complexidade) {
  if (temImagem) {
    return {
      modelo: CONFIG.modelos.imagem,
      estrategia: 'Claude para imagem',
      fallback: CONFIG.modelos.premium
    };
  } else if (complexidade === 'alta') {
    return {
      modelo: CONFIG.modelos.premium,
      estrategia: 'GPT-4o para alta complexidade',
      fallback: CONFIG.modelos.principal
    };
  } else {
    return {
      modelo: CONFIG.modelos.principal,
      estrategia: 'GPT-4o-mini para eficiência',
      fallback: CONFIG.modelos.premium
    };
  }
}

async function chamarIA(prompt, temImagem, arquivo, modelo, fallback) {
  console.log('[IA] 🤖 Chamando:', modelo);
  
  try {
    if (modelo.startsWith('claude')) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, temImagem, arquivo, modelo);
    }
  } catch (erro1) {
    console.warn('[IA] ⚠️ Tentando fallback:', fallback);
    try {
      return await chamarOpenAI(prompt, temImagem, arquivo, fallback);
    } catch (erro2) {
      throw new Error(`Ambos os modelos falharam: ${erro1.message} | ${erro2.message}`);
    }
  }
}

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const payload = {
    model: modelo,
    messages: [
      {
        role: "system",
        content: "Você é um especialista em criação de orçamentos de viagem profissionais da CVC. Siga EXATAMENTE as regras de formatação fornecidas."
      },
      {
        role: "user",
        content: temImagem && arquivo ? [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: arquivo } }
        ] : prompt
      }
    ],
    max_tokens: CONFIG.limites.max_tokens,
    temperature: 0.3
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API erro ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Resposta inválida da OpenAI API');
  }

  const tokens = {
    input: data.usage?.prompt_tokens || 0,
    output: data.usage?.completion_tokens || 0,
    total: data.usage?.total_tokens || 0
  };
  
  const precoModelo = CONFIG.precos[modelo] || CONFIG.precos[CONFIG.modelos.principal];
  const custo = ((tokens.input * precoModelo.input) + (tokens.output * precoModelo.output)) * 5.2;
  
  return {
    content: data.choices[0].message.content,
    tokens,
    custo,
    modelo
  };
}

async function chamarClaude(prompt, arquivo, modelo) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  let content = prompt;
  
  if (arquivo) {
    const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
    if (base64Match) {
      content = [
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
    }
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: CONFIG.limites.max_tokens,
      messages: [{ role: 'user', content }],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API erro ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.content?.[0]?.text) {
    throw new Error('Resposta inválida da Claude API');
  }

  const tokens = {
    input: data.usage?.input_tokens || 0,
    output: data.usage?.output_tokens || 0,
    total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
  };
  
  const precoModelo = CONFIG.precos[modelo] || CONFIG.precos[CONFIG.modelos.imagem];
  const custo = ((tokens.input * precoModelo.input) + (tokens.output * precoModelo.output)) * 5.2;
  
  return {
    content: data.content[0].text,
    tokens,
    custo,
    modelo
  };
}

// ================================================================================
// 📊 MÉTRICAS
// ================================================================================

function calcularMetricas(resultado, startTime, estrategia) {
  return {
    modelo_usado: resultado.modelo,
    estrategia: estrategia,
    tempo_ms: Date.now() - startTime,
    tokens: resultado.tokens,
    custo: {
      usd: resultado.custo / 5.2,
      brl: resultado.custo
    },
    versao: CONFIG.versao
  };
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('[v7.0] 🚀 Iniciando processamento...');
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }
    
    if (req.method === 'GET') {
      return res.status(200).json({
        nome: 'CVC Itaqua API v7.0',
        versao: CONFIG.versao,
        status: 'OPERACIONAL',
        funcionalidades: [
          'Análise inteligente de tipos',
          'Templates especializados',
          'Formatação profissional',
          'IA Dual (OpenAI + Claude)',
          'Processamento de imagens',
          'Sistema integrado completo'
        ]
      });
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Método não permitido'
      });
    }
    
    // Validação
    if (!req.body?.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt obrigatório'
      });
    }
    
    const { prompt, temImagem, arquivo, tipos, tipoViagem, parcelamento, camposOpcionais } = req.body;
    console.log(`[v7.0] Processando: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}, TemImagem: ${temImagem}`);
    
    // ETAPA 1: ANÁLISE
    const analise = analisarConteudo(prompt, tipos, temImagem);
    
    // ETAPA 2: TEMPLATE
    const template = selecionarTemplate(analise, tipos);
    
    // ETAPA 3: PROMPT
    const promptFinal = construirPrompt(prompt, template, analise, tipos, temImagem);
    
    // ETAPA 4: IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem, analise.complexidade);
    const resultado = await chamarIA(promptFinal, temImagem, arquivo, modelo, fallback);
    
    // ETAPA 5: PROCESSAMENTO
    const respostaProcessada = processarResposta(resultado.content);
    
    // ETAPA 6: MÉTRICAS
    const metricas = calcularMetricas(resultado, startTime, estrategia);
    
    console.log(`[v7.0] ✅ Concluído: ${Date.now() - startTime}ms, Modelo: ${resultado.modelo}`);
    
    // RESPOSTA FINAL
    return res.status(200).json({
      success: true,
      choices: [{
        message: {
          content: respostaProcessada,
          role: 'assistant'
        }
      }],
      metricas,
      analise: {
        tipo: analise.tipo,
        multiplasOpcoes: analise.multiplasOpcoes,
        complexidade: analise.complexidade
      }
    });
    
  } catch (error) {
    console.error('[v7.0] ❌ Erro:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      detalhes: error.message,
      versao: CONFIG.versao,
      tempo_ms: Date.now() - startTime
    });
  }
}

// ================================================================================
// 🚀 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('✅ CVC ITAQUA API v7.0 CARREGADA E PRONTA!');
console.log('🎯 Tipos suportados: Aéreo, Cruzeiro, Pacote, Múltiplas Opções');
console.log('🤖 IA Dual: OpenAI + Claude configurados');
console.log('📱 Formatação: WhatsApp ready');
console.log('🚀 STATUS: OPERACIONAL');
