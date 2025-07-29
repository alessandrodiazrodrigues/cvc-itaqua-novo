// ===== VERSÃO CORRIGIDA - CVC ITAQUA API =====
// ================================================================================
// 🏆 CVC ITAQUA - API HÍBRIDA CORRIGIDA
// ================================================================================
// Versão: 4.3.0-fix
// Principais correções:
// 1. Validação rigorosa de dados para evitar "undefined properties"
// 2. Template melhorado para detectar voos somente de ida
// 3. Fallback robusto entre modelos
// 4. Logs melhorados para debugging
// ================================================================================

const templates = {
  'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] ([TIPO_VIAGEM_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
[VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]
💳 [FORMA_PAGAMENTO_1]
🔗 [LINK_CVC_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] ([TIPO_VIAGEM_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
[VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]
💳 [FORMA_PAGAMENTO_2]
🔗 [LINK_CVC_2]

⚠️ Valores sujeitos a alteração e disponibilidade!

📞 Dúvidas? Estamos aqui para ajudar!`,

  'Aéreo Facial': `*Passagem Aérea*
🏷️ [COMPANHIA_AEREA]
🗓️ [DATA_IDA] ([TIPO_VIAGEM])
✈️ Ida: [DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[VOLTA_INFO]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Valores sujeitos a alteração e disponibilidade!`,

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
// 🎯 HANDLER PRINCIPAL COM VALIDAÇÃO RIGOROSA
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('[HANDLER-FIX] Iniciando processamento da requisição...');
    
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
      console.log('[HANDLER-FIX] Requisição OPTIONS - enviando CORS OK');
      return res.status(200).json({ message: 'CORS OK' });
    }

    if (req.method === 'GET') {
      console.log('[HANDLER-FIX] Requisição GET - enviando status');
      return res.status(200).json({
        message: 'CVC Itaqua API Híbrida (Versão Corrigida)',
        version: '4.3.0-fix',
        status: 'online',
        modelos: {
          texto: 'gpt-4o-mini',
          imagem: 'claude-3-5-sonnet-20240620',
          fallback: 'gpt-4o'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      console.error(`[HANDLER-FIX] Método não permitido: ${req.method}`);
      return res.status(405).json({ 
        success: false,
        error: 'Método não permitido' 
      });
    }

    // VALIDAÇÃO RIGOROSA DO CORPO DA REQUISIÇÃO
    console.log('[HANDLER-FIX] Validando dados recebidos...');
    
    if (!req.body || typeof req.body !== 'object') {
      console.error('[HANDLER-FIX] Corpo da requisição inválido:', typeof req.body);
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisição obrigatório e deve ser um objeto JSON válido'
      });
    }

    const { prompt, temImagem, arquivo, tipo } = req.body;

    // Validação do prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.error('[HANDLER-FIX] Prompt inválido:', typeof prompt, prompt?.length);
      return res.status(400).json({
        success: false,
        error: 'Prompt obrigatório e deve ser uma string não vazia'
      });
    }

    // Validação de imagem se especificada
    if (temImagem === true) {
      if (!arquivo || typeof arquivo !== 'string') {
        console.error('[HANDLER-FIX] Arquivo de imagem inválido');
        return res.status(400).json({
          success: false,
          error: 'Arquivo de imagem obrigatório quando temImagem=true'
        });
      }

      if (!arquivo.startsWith('data:image/')) {
        console.error('[HANDLER-FIX] Formato de imagem inválido');
        return res.status(400).json({
          success: false,
          error: 'Arquivo deve ser uma imagem em formato base64 válido'
        });
      }
    }

    console.log(`[HANDLER-FIX] Dados validados: Prompt=${prompt.length} chars, TemImagem=${temImagem}, Tipo=${tipo}`);

    // PROCESSAMENTO PRINCIPAL
    const { modelo, estrategia, fallback } = selecionarModeloHibrido(temImagem);
    console.log(`[HANDLER-FIX] Estratégia selecionada: ${estrategia}, Modelo: ${modelo}, Fallback: ${fallback}`);

    const template = selecionarTemplate(req.body);
    const isMultiple = detectarMultiplasOpcoes(prompt);
    const promptFinal = construirPromptOtimizado({ temImagem, promptBase: prompt, template, isMultiple });

    console.log(`[HANDLER-FIX] Múltiplas opções detectadas: ${isMultiple}`);

    // Chamada para IA com tratamento robusto de erros
    const resultado = await chamarIAHibridaSegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    if (!resultado || !resultado.content) {
      throw new Error('Resposta da IA está vazia ou inválida');
    }

    console.log(`[HANDLER-FIX] IA respondeu com sucesso: Modelo=${resultado.modelo_usado}, Conteúdo=${resultado.content.length} chars`);

    const responseProcessada = processarResposta(resultado.content);
    const metricas = calcularMetricasHibridas(resultado, startTime, estrategia);

    console.log(`[HANDLER-FIX] Processamento concluído em ${Date.now() - startTime}ms`);

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
    console.error('💥 [ERRO CRÍTICO NO HANDLER-FIX] 💥');
    console.error('Erro:', error.message);
    console.error('Stack:', error.stack);
    console.error('Tempo decorrido:', Date.now() - startTime, 'ms');

    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        timestamp: new Date().toISOString(),
        version: '4.3.0-fix'
      }
    });
  }
}

// ================================================================================
// 🤖 SISTEMA HÍBRIDO COM TRATAMENTO ROBUSTO DE ERROS
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

async function chamarIAHibridaSegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  let ultimoErro = null;

  try {
    console.log(`[IA-HÍBRIDA-SEGURA] Tentativa 1: ${modelo}`);
    
    if (temImagem === true) {
      return await chamarClaudeSeguro(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAISegura(prompt, false, null, modelo);
    }
    
  } catch (erro1) {
    console.error(`❌ [IA-HÍBRIDA-SEGURA] Falha no modelo principal (${modelo}):`, erro1.message);
    ultimoErro = erro1;

    try {
      console.log(`🔄 [IA-HÍBRIDA-SEGURA] Tentativa 2: ${fallbackModelo}`);
      
      // Para fallback, sempre usar OpenAI (que suporta tanto texto quanto imagem)
      return await chamarOpenAISegura(prompt, temImagem, arquivo, fallbackModelo);
      
    } catch (erro2) {
      console.error(`❌ [IA-HÍBRIDA-SEGURA] Falha no fallback (${fallbackModelo}):`, erro2.message);
      
      // Última tentativa: GPT-4o-mini apenas texto (ignorando imagem)
      try {
        console.log(`🆘 [IA-HÍBRIDA-SEGURA] Tentativa 3: GPT-4o-mini (somente texto)`);
        return await chamarOpenAISegura(prompt, false, null, 'gpt-4o-mini');
        
      } catch (erro3) {
        console.error(`❌ [IA-HÍBRIDA-SEGURA] Falha final:`, erro3.message);
        
        throw new Error(
          `Todos os modelos falharam. ` +
          `Principal (${modelo}): ${erro1.message}. ` +
          `Fallback (${fallbackModelo}): ${erro2.message}. ` +
          `Emergência: ${erro3.message}`
        );
      }
    }
  }
}

// ================================================================================
// 🏗️ PROMPTS OTIMIZADOS COM DETECÇÃO DE TIPO DE VIAGEM
// ================================================================================

function construirPromptOtimizado({ temImagem, promptBase, template, isMultiple }) {
  if (temImagem === true) {
    return construirPromptClaude(promptBase, template, isMultiple);
  }
  return construirPromptGPTMini(promptBase, template, isMultiple);
}

function construirPromptClaude(promptBase, template, isMultiple) {
  return `Você é um assistente especializado em extrair dados de orçamentos de viagem de imagens.

IMPORTANTE: Analise a imagem fornecida e extraia os dados reais. A imagem é a fonte primária.

TEMPLATE DE SAÍDA:
${template}

INSTRUÇÕES ESPECÍFICAS:
1. **TIPO DE VIAGEM**: Determine se é:
   - Somente IDA (sem volta): Use "[TIPO_VIAGEM]" = "Somente ida"
   - IDA E VOLTA: Use "[TIPO_VIAGEM]" = "X dias e Y noites"

2. **VOLTA**: 
   - Se for SOMENTE IDA: Use "[VOLTA_INFO]" = "" (vazio)
   - Se for IDA E VOLTA: Use "✈️ Volta: [DATA] - [ORIGEM] [HORA] / [DESTINO] [HORA]"

3. **MÚLTIPLAS OPÇÕES**: ${isMultiple ? "A imagem contém várias opções. Crie seções separadas (OPÇÃO 1, OPÇÃO 2...)." : "A imagem contém uma única opção."}

4. **DADOS CONTEXTUAIS**: ${promptBase}

5. **CONVERSÃO DE AEROPORTOS**: Converta siglas (ex: VCP → Viracopos, BSB → Brasília)

Responda APENAS com o template preenchido, sem comentários adicionais.`;
}

function construirPromptGPTMini(promptBase, template, isMultiple) {
  return `Você é um assistente da CVC especializado em formatar orçamentos de viagem.

TEMPLATE OBRIGATÓRIO:
${template}

DADOS DO CLIENTE:
${promptBase}

REGRAS IMPORTANTES:
1. **DETECÇÃO DE TIPO**: Analise se é:
   - SOMENTE IDA: Use "[TIPO_VIAGEM]" = "Somente ida" e "[VOLTA_INFO]" = ""
   - IDA E VOLTA: Use "[TIPO_VIAGEM]" = "X dias" e inclua linha de volta

2. **EXEMPLO DE IDA**:
   🗓️ 01 de agosto (Somente ida)
   ✈️ Ida: 01/ago - Viracopos 17:55 / Brasília 19:30

3. **EXEMPLO IDA E VOLTA**:
   🗓️ 05 de mar - 15 de mar (11 dias e 10 noites)
   ✈️ Ida: 05/mar - Guarulhos 01:50 / Orlando 12:15
   ✈️ Volta: 15/mar - Orlando 14:55 / Guarulhos 05:50

4. **MÚLTIPLAS OPÇÕES**: ${isMultiple ? "Formate todas as opções encontradas." : "Formate a única opção."}

5. **AEROPORTOS**: Converta siglas para nomes completos (VCP → Viracopos, BSB → Brasília, etc.)

Responda APENAS com o template preenchido, sem explicações extras.`;
}

function detectarMultiplasOpcoes(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  
  const texto = prompt.toLowerCase();
  const precos = (texto.match(/r\$.*\d/g) || []).length;
  const cias = (texto.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  const totais = (texto.match(/total.*\d+.*adult/gi) || []).length;
  const links = (texto.match(/https:\/\/www\.cvc\.com\.br\/carrinho/gi) || []).length;
  
  return precos >= 2 || cias >= 2 || totais >= 2 || links >= 2;
}

function selecionarTemplate({ tipos, prompt }) {
  // Validação segura
  if (!tipos || !Array.isArray(tipos)) tipos = ['Aéreo Facial'];
  if (!prompt) prompt = '';
  
  if (detectarMultiplasOpcoes(prompt) && tipos.includes('Aéreo Facial')) {
    return templates['Aéreo Múltiplas Opções'];
  }
  
  const primeiroTipo = tipos[0] || 'Aéreo Facial';
  return templates[primeiroTipo] || templates['Aéreo Facial'];
}

// ================================================================================
// 🟠 CHAMADA CLAUDE SEGURA
// ================================================================================

async function chamarClaudeSeguro(prompt, arquivo, modelo) {
  console.log(`[CLAUDE-SEGURO] Preparando chamada para ${modelo}...`);
  
  // Validação de API Key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente');
  }

  // Validação rigorosa do arquivo
  if (!arquivo || typeof arquivo !== 'string') {
    throw new Error('Arquivo base64 obrigatório para Claude');
  }

  const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
  if (!base64Match || !base64Match[1] || !base64Match[2]) {
    throw new Error('Formato de imagem base64 inválido. Esperado: data:image/...;base64,...');
  }

  const mimeType = base64Match[1];
  const base64Data = base64Match[2];

  // Validar tipos suportados
  const tiposSuportados = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!tiposSuportados.includes(mimeType)) {
    throw new Error(`Tipo de imagem não suportado: ${mimeType}. Suportados: ${tiposSuportados.join(', ')}`);
  }

  // Verificar tamanho da imagem
  const tamanhoBytes = (base64Data.length * 3) / 4;
  const tamanhoMB = tamanhoBytes / (1024 * 1024);
  if (tamanhoMB > 5) {
    throw new Error(`Imagem muito grande: ${tamanhoMB.toFixed(2)}MB. Máximo: 5MB`);
  }

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

  console.log(`[CLAUDE-SEGURO] Enviando requisição - Prompt: ${prompt.length} chars, Imagem: ${tamanhoMB.toFixed(2)}MB`);

  try {
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
      console.error(`[CLAUDE-SEGURO] Erro HTTP ${response.status}:`, errorText);
      
      let errorMessage = `Erro Claude ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage += `: ${errorText.substring(0, 200)}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validação rigorosa da resposta
    if (!data || typeof data !== 'object') {
      throw new Error('Resposta Claude inválida: não é um objeto JSON');
    }

    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Resposta Claude inválida: campo content ausente ou vazio');
    }

    if (!data.content[0] || typeof data.content[0] !== 'object' || !data.content[0].text) {
      throw new Error('Resposta Claude inválida: texto da resposta ausente');
    }

    const usage = data.usage || { input_tokens: 0, output_tokens: 0 };
    console.log(`[CLAUDE-SEGURO] Sucesso - Tokens: input=${usage.input_tokens}, output=${usage.output_tokens}`);

    return {
      content: data.content[0].text,
      usage: usage,
      modelo_usado: modelo
    };

  } catch (error) {
    console.error(`[CLAUDE-SEGURO] Erro na requisição:`, error.message);
    throw error;
  }
}

// ================================================================================
// 🔵 CHAMADA OPENAI SEGURA
// ================================================================================

async function chamarOpenAISegura(prompt, temImagem, arquivo, modelo) {
  console.log(`[OPENAI-SEGURO] Preparando chamada para ${modelo}...`);
  
  // Validação de API Key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
  }

  let messages;

  if (temImagem === true && arquivo) {
    // Validar formato da imagem
    if (!arquivo.startsWith('data:image/')) {
      throw new Error('Formato de imagem inválido para OpenAI');
    }

    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: arquivo } }
        ]
      }
    ];
    console.log(`[OPENAI-SEGURO] Modo imagem - Arquivo: ${arquivo.length} chars`);
  } else {
    messages = [{ role: "user", content: prompt }];
    console.log(`[OPENAI-SEGURO] Modo texto - Prompt: ${prompt.length} chars`);
  }

  try {
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
      console.error(`[OPENAI-SEGURO] Erro HTTP ${response.status}:`, errorText);
      
      let errorMessage = `Erro OpenAI ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage += `: ${errorText.substring(0, 200)}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validação rigorosa da resposta
    if (!data || typeof data !== 'object') {
      throw new Error('Resposta OpenAI inválida: não é um objeto JSON');
    }

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Resposta OpenAI inválida: campo choices ausente ou vazio');
    }

    if (!data.choices[0] || typeof data.choices[0] !== 'object' || !data.choices[0].message) {
      throw new Error('Resposta OpenAI inválida: message ausente na primeira choice');
    }

    if (!data.choices[0].message.content) {
      throw new Error('Resposta OpenAI inválida: content ausente na message');
    }

    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    console.log(`[OPENAI-SEGURO] Sucesso - Tokens: ${usage.total_tokens}`);

    return {
      content: data.choices[0].message.content,
      usage: usage,
      modelo_usado: modelo
    };

  } catch (error) {
    console.error(`[OPENAI-SEGURO] Erro na requisição:`, error.message);
    throw error;
  }
}

// ================================================================================
// 🔧 PROCESSAMENTO E UTILITÁRIOS
// ================================================================================

function processarResposta(response) {
  if (!response || typeof response !== 'string') {
    return 'Erro: Resposta da IA está vazia ou inválida';
  }

  let processada = response
    .replace(/TEMPLATE DE SAÍDA:.*?\n/gi, '')
    .replace(/TEMPLATE OBRIGATÓRIO:.*?\n/gi, '')
    .trim();

  // Conversão de aeroportos
  Object.entries(aeroportos).forEach(([sigla, nome]) => {
    const regex = new RegExp(`\\b${sigla}\\b`, 'gi');
    processada = processada.replace(regex, nome);
  });

  return processada.replace(/\n\s*\n/g, '\n\n').trim();
}

function calcularMetricasHibridas(resultado, startTime, estrategia) {
  // Validação de entrada
  if (!resultado || typeof resultado !== 'object') {
    return {
      erro: 'Resultado inválido para cálculo de métricas',
      tempo_processamento_ms: Date.now() - startTime
    };
  }

  const tokensInput = resultado.usage?.prompt_tokens || resultado.usage?.input_tokens || 0;
  const tokensOutput = resultado.usage?.completion_tokens || resultado.usage?.output_tokens || 0;
  const modeloUsado = resultado.modelo_usado || 'desconhecido';
  
  const precosModelo = PRECOS_MODELOS[modeloUsado] || { input: 0, output: 0 };
  
  const custoUSD = (tokensInput / 1000) * precosModelo.input + (tokensOutput / 1000) * precosModelo.output;
  const custoBRL = custoUSD * USD_TO_BRL;

  // Cálculo de economia vs GPT-4o
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

// ================================================================================
// 🧪 FUNÇÕES DE TESTE E DEBUG
// ================================================================================

function validarRequest(req) {
  const erros = [];
  
  if (!req.body) {
    erros.push('Corpo da requisição ausente');
  }
  
  if (!req.body.prompt || typeof req.body.prompt !== 'string') {
    erros.push('Prompt obrigatório e deve ser string');
  }
  
  if (req.body.temImagem === true && !req.body.arquivo) {
    erros.push('Arquivo obrigatório quando temImagem=true');
  }
  
  return {
    valido: erros.length === 0,
    erros: erros
  };
}

function logDebug(contexto, dados) {
  console.log(`[DEBUG-${contexto}]`, {
    timestamp: new Date().toISOString(),
    ...dados
  });
}

// ================================================================================
// 📊 ANÁLISE ESPECÍFICA PARA VOOS SOMENTE IDA
// ================================================================================

function analisarTipoViagem(texto) {
  if (!texto || typeof texto !== 'string') {
    return { tipo: 'desconhecido', confianca: 0 };
  }
  
  const textoLower = texto.toLowerCase();
  
  // Indicadores de ida e volta
  const indicadoresIdaVolta = [
    /ida.*volta/gi,
    /ida.*retorno/gi,
    /partida.*retorno/gi,
    /\d+ dias.*\d+ noites/gi,
    /ida.*\d{2}\/\d{2}.*volta.*\d{2}\/\d{2}/gi
  ];
  
  // Indicadores de somente ida
  const indicadoresSomenteIda = [
    /somente ida/gi,
    /só ida/gi,
    /one way/gi,
    /ida\s*$/gi
  ];
  
  // Contar voos de volta explícitos
  const voosVolta = (textoLower.match(/volta.*\d{2}:\d{2}/gi) || []).length;
  const datasVolta = (textoLower.match(/volta.*\d{2}\/\d{2}/gi) || []).length;
  
  // Análise
  let pontuacaoIdaVolta = 0;
  let pontuacaoSomenteIda = 0;
  
  indicadoresIdaVolta.forEach(regex => {
    if (regex.test(textoLower)) pontuacaoIdaVolta += 2;
  });
  
  indicadoresSomenteIda.forEach(regex => {
    if (regex.test(textoLower)) pontuacaoSomenteIda += 3;
  });
  
  pontuacaoIdaVolta += voosVolta + datasVolta;
  
  // Decisão final
  if (pontuacaoSomenteIda > pontuacaoIdaVolta) {
    return { tipo: 'somente_ida', confianca: pontuacaoSomenteIda };
  } else if (pontuacaoIdaVolta > 0) {
    return { tipo: 'ida_volta', confianca: pontuacaoIdaVolta };
  } else {
    // Se não há indicadores claros, assumir ida e volta se houver múltiplas datas
    const datas = (textoLower.match(/\d{2}\/\d{2}|\d{2} de \w+/gi) || []).length;
    return { 
      tipo: datas >= 2 ? 'ida_volta' : 'somente_ida', 
      confianca: 1 
    };
  }
}

// ================================================================================
// 🔄 SISTEMA DE RETRY INTELIGENTE
// ================================================================================

async function executarComRetry(funcao, maxTentativas = 3, delayMs = 1000) {
  let ultimoErro = null;
  
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      console.log(`[RETRY] Tentativa ${tentativa}/${maxTentativas}`);
      const resultado = await funcao();
      console.log(`[RETRY] Sucesso na tentativa ${tentativa}`);
      return resultado;
    } catch (error) {
      console.error(`[RETRY] Falha na tentativa ${tentativa}:`, error.message);
      ultimoErro = error;
      
      if (tentativa < maxTentativas) {
        const delay = delayMs * tentativa; // Delay progressivo
        console.log(`[RETRY] Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Falha após ${maxTentativas} tentativas. Último erro: ${ultimoErro.message}`);
}

// ================================================================================
// 🎯 TEMPLATES ESPECÍFICOS PARA DIFERENTES CENÁRIOS
// ================================================================================

const templatesEspecificos = {
  somenteIda: `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA_AEREA]
🗓️ [DATA_IDA] (Somente ida)
✈️ [DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Passagem somente de ida - sem retorno incluído`,

  idaVolta: `*Passagem Aérea - Ida e Volta*
🏷️ [COMPANHIA_AEREA]
🗓️ [DATA_IDA] a [DATA_VOLTA] ([DURACAO])
✈️ Ida: [DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_IDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA_IDA]
✈️ Volta: [DATA_VOLTA] - [AEROPORTO_ORIGEM_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_DESTINO_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Ida e volta incluídos no valor`
};

function selecionarTemplateInteligente(dados) {
  const { prompt, tipos } = dados;
  
  if (!tipos || !tipos.includes('Aéreo Facial')) {
    return templates[tipos?.[0]] || templates['Aéreo Facial'];
  }
  
  // Análise do tipo de viagem
  const analiseViagem = analisarTipoViagem(prompt);
  const isMultiple = detectarMultiplasOpcoes(prompt);
  
  console.log(`[TEMPLATE-INTELIGENTE] Tipo: ${analiseViagem.tipo}, Múltiplas: ${isMultiple}`);
  
  if (isMultiple) {
    return templates['Aéreo Múltiplas Opções'];
  }
  
  if (analiseViagem.tipo === 'somente_ida') {
    return templatesEspecificos.somenteIda;
  } else {
    return templatesEspecificos.idaVolta;
  }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES MELHORADAS
// ================================================================================

function sanitizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  
  return texto
    .replace(/[^\w\s\-àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extrairInformacoesVoo(texto) {
  if (!texto) return {};
  
  const regexes = {
    companhia: /(gol|latam|azul|avianca|tap|american|united)/gi,
    preco: /r\$\s*[\d.,]+/gi,
    horario: /\d{2}:\d{2}/g,
    data: /\d{2}\/\d{2}|\d{2} de \w+/gi,
    aeroporto: /\b(cgr|gru|vcp|sdu|gig|bsb|cnf|cwb|rao|rec|for|ssa)\b/gi
  };
  
  const resultados = {};
  
  Object.entries(regexes).forEach(([chave, regex]) => {
    const matches = texto.match(regex);
    resultados[chave] = matches || [];
  });
  
  return resultados;
}

// ================================================================================
// 📈 MÉTRICAS E MONITORAMENTO
// ================================================================================

let contadorRequisicoes = 0;
let contadorErros = 0;
let tempoTotalProcessamento = 0;

function atualizarEstatisticas(tempoProcessamento, sucesso = true) {
  contadorRequisicoes++;
  tempoTotalProcessamento += tempoProcessamento;
  
  if (!sucesso) {
    contadorErros++;
  }
  
  console.log(`[ESTATÍSTICAS] Requisições: ${contadorRequisicoes}, Erros: ${contadorErros}, Tempo médio: ${(tempoTotalProcessamento / contadorRequisicoes).toFixed(2)}ms`);
}

function obterEstatisticas() {
  return {
    total_requisicoes: contadorRequisicoes,
    total_erros: contadorErros,
    taxa_sucesso: contadorRequisicoes > 0 ? ((contadorRequisicoes - contadorErros) / contadorRequisicoes * 100).toFixed(2) + '%' : '0%',
    tempo_medio_ms: contadorRequisicoes > 0 ? (tempoTotalProcessamento / contadorRequisicoes).toFixed(2) : 0
  };
}

// ================================================================================
// 🏁 EXPORTAÇÃO E LOGS FINAIS
// ================================================================================

console.log('✅ [SISTEMA-CORRIGIDO] CVC Itaqua API v4.3.0-fix carregada');
console.log('🔧 [MELHORIAS] Validação rigorosa, detecção de ida/volta, fallback robusto');
console.log('🎯 [RECURSOS] Templates inteligentes, retry automático, logs detalhados');

// Para debug em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🧪 [DEBUG] Modo desenvolvimento ativo - logs extras habilitados');
  
  // Endpoint de estatísticas (apenas em dev)
  global.obterEstatisticasAPI = obterEstatisticas;
  global.resetarEstatisticas = () => {
    contadorRequisicoes = 0;
    contadorErros = 0;
    tempoTotalProcessamento = 0;
    console.log('📊 [DEBUG] Estatísticas resetadas');
  };
}
