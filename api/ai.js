// ===== INÍCIO DO CÓDIGO COMPLETO =====
// ================================================================================
// 🏆 CVC ITAQUA - API HÍBRIDA COMPLETA (Claude + GPT-4o-mini)
// ================================================================================
// Versão: 4.2.0-stable
// Autor: Sistema CVC Itaqua
// Última atualização: 2025-07-29
// Foco: Estabilidade e prompt reforçado para análise de imagem.
// ================================================================================

// SEÇÃO 1: CONFIGURAÇÕES E TEMPLATES
const templates = {
  'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [AEROPORTO_DESTINO_VOLTA_1] [HORA_SAIDA_VOLTA_1] / [AEROPORTO_ORIGEM_VOLTA_1] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]
💳 [FORMA_PAGAMENTO_1]
🔗 [LINK_CVC_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [AEROPORTO_DESTINO_VOLTA_2] [HORA_SAIDA_VOLTA_2] / [AEROPORTO_ORIGEM_VOLTA_2] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]
💳 [FORMA_PAGAMENTO_2]
🔗 [LINK_CVC_2]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`,
  'Aéreo Facial': `*Passagem Aérea*
[COMPANHIA_AEREA] 
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [AEROPORTO_DESTINO_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_ORIGEM_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.`,
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

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva.`
};
const aeroportos = { 'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'RAO': 'Ribeirão Preto', 'BPS': 'Porto Seguro', 'SSA': 'Salvador', 'IOS': 'Ilhéus', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'CWB': 'Afonso Pena', 'IGU': 'Foz do Iguaçu', 'REC': 'Recife', 'FOR': 'Fortaleza', 'MAO': 'Manaus', 'BEL': 'Belém', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'AJU': 'Aracaju', 'MCZ': 'Maceió', 'JPA': 'João Pessoa', 'NAT': 'Natal', 'THE': 'Teresina', 'SLZ': 'São Luís', 'VIX': 'Vitória', 'FLN': 'Florianópolis', 'POA': 'Porto Alegre' };
const PRECOS_MODELOS = { 'gpt-4o': { input: 0.005, output: 0.015 }, 'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, 'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 } };
const USD_TO_BRL = 5.2;
const MAX_TOKENS = 2500;

// ================================================================================
// 🎯 SEÇÃO 2: HANDLER PRINCIPAL (com logging aprimorado)
// ================================================================================

export default async function handler(req, res) {
  try {
    console.log('[HANDLER] Iniciando processamento da requisição.');
    // Configuração de CORS e Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
      console.log('[HANDLER] Requisição OPTIONS recebida. Respondendo com CORS OK.');
      return res.status(200).json({ message: 'CORS OK' });
    }
    if (req.method === 'GET') {
        console.log('[HANDLER] Requisição GET recebida. Respondendo com status da API.');
        return res.status(200).json({ 
            message: 'CVC Itaqua API Híbrida',
            version: '4.2.0-stable',
            modelos: {
              texto: 'gpt-4o-mini',
              imagem: 'claude-3-5-sonnet-20240620',
              fallback: 'gpt-4o'
            }
        });
    }
    if (req.method !== 'POST') {
      console.error(`[HANDLER] Método não permitido: ${req.method}`);
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // Validação do corpo da requisição
    console.log('[HANDLER] Validando corpo da requisição...');
    if (!req.body) {
      console.error('[HANDLER] Erro: Corpo da requisição ausente.');
      return res.status(400).json({ error: 'Corpo da requisição obrigatório' });
    }
    const { prompt, temImagem, arquivo } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      console.error('[HANDLER] Erro: Prompt ausente ou inválido.');
      return res.status(400).json({ error: 'Prompt obrigatório' });
    }
    console.log(`[HANDLER] Dados recebidos: Imagem=${temImagem}, Prompt=${prompt.length} chars`);

    // Processamento principal
    const startTime = Date.now();
    const { modelo, estrategia, fallback } = selecionarModeloHibrido(temImagem);
    console.log(`[HANDLER] Estratégia definida: ${estrategia}`);

    const template = selecionarTemplate(req.body);
    console.log('[HANDLER] Template selecionado.');
    
    const isMultiple = detectarMultiplasOpcoes(prompt);
    const promptFinal = construirPromptOtimizado({ temImagem, promptBase: prompt, template, isMultiple });
    console.log('[HANDLER] Prompt final construído.');

    const resultado = await chamarIAHibrida(promptFinal, temImagem, arquivo, modelo, fallback);
    console.log(`[HANDLER] IA respondeu com sucesso usando o modelo: ${resultado.modelo_usado}`);

    const responseProcessada = processarResposta(resultado.content);
    console.log('[HANDLER] Resposta da IA processada.');
    
    const metricas = calcularMetricasHibridas(resultado, startTime, estrategia);
    console.log(`[HANDLER] Métricas calculadas. Custo: R$ ${metricas.custo.brl.toFixed(4)}`);

    console.log(`[HANDLER] Processamento concluído em ${Date.now() - startTime}ms. Enviando resposta.`);
    return res.status(200).json({
      success: true,
      choices: [{ message: { content: responseProcessada } }],
      metricas: metricas,
    });

  } catch (error) {
    console.error('💥 [ERRO FATAL NO HANDLER] 💥', error);
    return res.status(500).json({
      success: false,
      error: {
        message: `Ocorreu um erro inesperado no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        details: error.stack
      }
    });
  }
}

// ================================================================================
// 🤖 SEÇÃO 3: SISTEMA HÍBRIDO DE IA
// ================================================================================

function selecionarModeloHibrido(temImagem) {
  if (temImagem) {
    return {
      modelo: 'claude-3-5-sonnet-20240620',
      estrategia: 'Claude 3.5 Sonnet para análise visual',
      fallback: 'gpt-4o',
    };
  } else {
    return {
      modelo: 'gpt-4o-mini',
      estrategia: 'GPT-4o-mini para processamento de texto',
      fallback: 'gpt-4o',
    };
  }
}

async function chamarIAHibrida(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  try {
    if (temImagem) {
      console.log(`[IA-HÍBRIDA] Tentando com o modelo principal de imagem: ${modelo}`);
      return await chamarClaudeOtimizado(prompt, arquivo, modelo);
    } else {
      console.log(`[IA-HÍBRIDA] Tentando com o modelo principal de texto: ${modelo}`);
      return await chamarOpenAIOtimizada(prompt, false, null, modelo);
    }
  } catch (error) {
    console.error(`❌ [IA-HÍBRIDA] Falha no modelo principal (${modelo}): ${error.message}`);
    console.log(`🔄 [IA-HÍBRIDA] Acionando fallback para o modelo: ${fallbackModelo}`);
    try {
        return await chamarOpenAIOtimizada(prompt, temImagem, arquivo, fallbackModelo);
    } catch (fallbackError) {
        console.error(`❌ [IA-HÍBRIDA] Falha também no modelo de fallback (${fallbackModelo}): ${fallbackError.message}`);
        throw new Error(`Principal falhou: (${error.message}) | Fallback falhou: (${fallbackError.message})`);
    }
  }
}

// ================================================================================
// 🏗️ SEÇÃO 4: PROMPTS OTIMIZADOS
// ================================================================================
function construirPromptOtimizado({ temImagem, promptBase, template, isMultiple }) {
    if (temImagem) {
        return construirPromptClaude(promptBase, template, isMultiple);
    }
    return construirPromptGPTMini(promptBase, template, isMultiple);
}

function construirPromptClaude(promptBase, template, isMultiple) {
  return `Você é um assistente de IA especializado em extrair dados de imagens de orçamentos de voos. Sua única tarefa é analisar a imagem fornecida e preencher o template com as informações extraídas. Não converse, não peça a imagem, apenas analise e responda no formato solicitado.

TEMPLATE DE SAÍDA OBRIGATÓRIO:
${template}

INSTRUÇÕES:
1.  **AÇÃO OBRIGATÓRIA:** Analise a imagem. A imagem é a fonte primária de dados.
2.  **EXTRAIA DA IMAGEM:**
    * Companhia(s) Aérea(s).
    * Datas e horários de ida e volta.
    * Aeroportos de origem e destino (converta siglas como GRU para Guarulhos).
    * Valor total em R$.
    * Qualquer informação sobre parcelamento.
3.  **MÚLTIPLAS OPÇÕES:** ${isMultiple ? "A imagem contém várias opções. Preencha uma seção para cada uma (OPÇÃO 1, OPÇÃO 2...)." : "A imagem contém uma única opção. Preencha o template para ela."}
4.  **DADOS DE CONTEXTO:** O texto abaixo é apenas para contexto (ex: número de passageiros). Use-o para complementar, mas os dados da imagem têm prioridade.
    * Contexto do usuário: ${promptBase}

Responda apenas com o template preenchido.`;
}

function construirPromptGPTMini(promptBase, template, isMultiple) {
    return `Você é um assistente da CVC. Formate o orçamento abaixo usando EXATAMENTE o modelo fornecido.

MODELO:
${template}

DADOS DO CLIENTE:
${promptBase}

REGRAS:
- Use os dados para preencher os campos como [COMPANHIA_AEREA], [VALOR_TOTAL], etc.
- ${isMultiple ? "O texto contém múltiplas opções. Formate todas elas." : "O texto contém uma única opção."}
- Converta siglas de aeroportos para nomes completos (ex: GRU para Guarulhos).
- O resultado deve ser apenas o texto formatado, pronto para copiar e colar.`;
}

function detectarMultiplasOpcoes(prompt) {
    if (!prompt) return false;
    const texto = prompt.toLowerCase();
    const precos = (texto.match(/r\$.*\d/g) || []).length;
    const cias = (texto.match(/(gol|latam|azul)/gi) || []).length;
    return precos >= 2 || cias >= 2;
}

function selecionarTemplate({ tipos, prompt }) {
    if (detectarMultiplasOpcoes(prompt) && tipos?.includes('Aéreo Facial')) {
        return templates['Aéreo Múltiplas Opções'];
    }
    return templates[tipos?.[0]] || templates['Aéreo Facial'];
}


// ================================================================================
// 🟠/🔵 SEÇÕES 5 e 6: CHAMADAS ÀS APIS
// ================================================================================

async function chamarClaudeOtimizado(prompt, arquivo, modelo) {
    console.log(`[CLAUDE] Preparando chamada para o modelo ${modelo}...`);
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('Chave da API da Anthropic não encontrada.');
    
    const base64Match = arquivo.match(/data:image\/[^;]+;base64,(.+)/);
    if (!base64Match) throw new Error('Formato de imagem Base64 inválido para Claude.');
    
    const content = [{ type: "text", text: prompt }, { type: "image", source: { type: "base64", media_type: arquivo.match(/data:(image\/[^;]+)/)[1], data: base64Match[1] } }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: modelo, max_tokens: MAX_TOKENS, messages: [{ role: 'user', content }] })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[CLAUDE] Erro na API: ${response.status}`, errorText);
        throw new Error(`Erro na API Claude (${response.status}): ${errorText.substring(0, 150)}`);
    }

    const data = await response.json();
    if (!data.content?.[0]?.text) throw new Error('Resposta da API Claude veio em formato inesperado.');
    
    console.log(`[CLAUDE] Chamada bem-sucedida. Tokens usados: ${data.usage?.output_tokens || 'N/A'}`);
    return { content: data.content[0].text, usage: data.usage, modelo_usado: modelo };
}

async function chamarOpenAIOtimizada(prompt, temImagem, arquivo, modelo) {
    console.log(`[OPENAI] Preparando chamada para o modelo ${modelo}...`);
    if (!process.env.OPENAI_API_KEY) throw new Error('Chave da API da OpenAI não encontrada.');

    let messages;
    if (temImagem) {
        if (!arquivo || !arquivo.startsWith('data:image')) throw new Error('Arquivo de imagem inválido para OpenAI.');
        messages = [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: arquivo } }] }];
    } else {
        messages = [{ role: "user", content: prompt }];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelo, messages, max_tokens: MAX_TOKENS })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OPENAI] Erro na API: ${response.status}`, errorText);
        throw new Error(`Erro na API OpenAI (${response.status}): ${errorText.substring(0, 150)}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) throw new Error('Resposta da API OpenAI veio em formato inesperado.');

    console.log(`[OPENAI] Chamada bem-sucedida. Tokens usados: ${data.usage?.total_tokens || 'N/A'}`);
    return { content: data.choices[0].message.content, usage: data.usage, modelo_usado: modelo };
}

// ================================================================================
// 🔧/💰 SEÇÕES 7 e 8: UTILITÁRIOS E PROCESSAMENTO
// ================================================================================
function processarResposta(response) {
    let processada = response.replace(/TEMPLAT. DE SAÍDA OBRIGATÓRIO:/g, '').trim();
    Object.entries(aeroportos).forEach(([sigla, nome]) => {
      const regex = new RegExp(`\\b${sigla}\\b`, 'gi');
      processada = processada.replace(regex, nome);
    });
    return processada.replace(/\n\s*\n/g, '\n\n').trim();
}

function calcularMetricasHibridas(resultado, startTime, estrategia) {
  const tokensInput = resultado.usage?.prompt_tokens || resultado.usage?.input_tokens || 0;
  const tokensOutput = resultado.usage?.completion_tokens || resultado.usage?.output_tokens || 0;
  
  const modeloUsado = resultado.modelo_usado;
  const precosModelo = PRECOS_MODELOS[modeloUsado] || { input: 0, output: 0 };
  
  const custoUSD = (tokensInput / 1000) * precosModelo.input + (tokensOutput / 1000) * precosModelo.output;
  const custoBRL = custoUSD * USD_TO_BRL;

  const custoGPT4o = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o'].input + 
                     (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o'].output;
  const economiaBRL = (custoGPT4o * USD_TO_BRL) - custoBRL;
  
  return {
    modelo_usado: modeloUsado,
    estrategia: estrategia,
    tokens: { input: tokensInput, output: tokensOutput, total: tokensInput + tokensOutput },
    custo: { usd: custoUSD, brl: custoBRL },
    economia: { vs_gpt4o_brl: economiaBRL },
    performance: { tempo_processamento_ms: Date.now() - startTime }
  };
}
// ===== FIM DO CÓDIGO COMPLETO =====
