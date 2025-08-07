// 🤖 api/modules/ia-client.js - v9.0 - IA REAL CONECTADA
// OBJETIVO: Substituir simulação por calls reais OpenAI + Claude
// ESTRATÉGIA: GPT-4o-mini principal, GPT-4o complexo, Claude imagens

console.log("🤖 IA-Client v9.0 - IA REAL CONECTADA");

// ================================================================================
// 🎯 CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const MAX_TOKENS = 4000;
const USD_TO_BRL = 5.20;

const PRECOS_MODELOS = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
};

let estatisticas = {
  totalChamadas: 0,
  custoTotalBRL: 0,
  tokensTotal: 0,
  sucessos: 0,
  falhas: 0,
  ultimaReset: new Date().toISOString()
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL: CHAMAR IA REAL
// ================================================================================

export async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log('[IA-CLIENT] 🚀 Iniciando chamada IA REAL...', { modelo, temImagem });
  
  try {
    estatisticas.totalChamadas++;
    let resultado;
    
    if (temImagem === true && arquivo) {
      console.log('[IA-CLIENT] 📸 Chamando Claude para análise de imagem...');
      resultado = await chamarClaude(prompt, arquivo, modelo || 'claude-3-5-sonnet-20240620');
    } else {
      console.log('[IA-CLIENT] 🤖 Chamando OpenAI para processamento de texto...');
      resultado = await chamarOpenAI(prompt, modelo || 'gpt-4o-mini');
    }
    
    estatisticas.sucessos++;
    atualizarEstatisticas(resultado);
    
    console.log('[IA-CLIENT] ✅ IA REAL respondeu com sucesso!');
    return resultado;
    
  } catch (erro1) {
    console.error(`❌ [IA-CLIENT] Falha no modelo principal ${modelo}:`, erro1.message);
    
    // FALLBACK 1: Tentar modelo secundário
    if (fallbackModelo && fallbackModelo.length > 0) {
      console.warn(`⚠️ [IA-CLIENT] Tentando fallback: ${fallbackModelo[0]}...`);
      try {
        const resultadoFallback = await chamarOpenAI(prompt, fallbackModelo[0]);
        estatisticas.sucessos++;
        atualizarEstatisticas(resultadoFallback);
        return resultadoFallback;
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] Fallback também falhou:`, erro2.message);
      }
    }
    
    // FALLBACK FINAL: Resposta estruturada de erro
    estatisticas.falhas++;
    throw new Error(`IA indisponível: ${erro1.message}`);
  }
}

// ================================================================================
// 🤖 FUNÇÃO: CHAMAR OPENAI
// ================================================================================

async function chamarOpenAI(prompt, modelo = 'gpt-4o-mini') {
  console.log('[IA-CLIENT] 📡 Conectando com OpenAI...', { modelo });
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada nas variáveis de ambiente');
  }

  const requestBody = {
    model: modelo,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: MAX_TOKENS,
    temperature: 0.1,
    response_format: { type: 'text' }
  };

  console.log('[IA-CLIENT] 📤 Enviando request para OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[IA-CLIENT] ❌ Erro da API OpenAI:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText.substring(0, 200)
    });
    throw new Error(`OpenAI API error ${response.status}: ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('[IA-CLIENT] ❌ Resposta OpenAI inválida:', data);
    throw new Error('Resposta da API OpenAI em formato inválido');
  }

  console.log('[IA-CLIENT] ✅ OpenAI respondeu com sucesso');
  console.log('[IA-CLIENT] 📊 Tokens usados:', data.usage);
  
  return {
    content: data.choices[0].message.content,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    modelo_usado: modelo,
    tempo_resposta: new Date().toISOString()
  };
}

// ================================================================================
// 🎨 FUNÇÃO: CHAMAR CLAUDE (PARA IMAGENS)
// ================================================================================

async function chamarClaude(prompt, imagemBase64, modelo = 'claude-3-5-sonnet-20240620') {
  console.log('[IA-CLIENT] 🎨 Conectando com Claude...', { modelo });
  
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada nas variáveis de ambiente');
  }

  // Preparar conteúdo com imagem
  const content = [
    {
      type: 'text',
      text: prompt
    },
    {
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg', // Assumindo JPEG, pode ajustar conforme necessário
        data: imagemBase64.replace(/^data:image\/[a-z]+;base64,/, '') // Remove prefix se houver
      }
    }
  ];

  const requestBody = {
    model: modelo,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: content
      }
    ]
  };

  console.log('[IA-CLIENT] 📤 Enviando request para Claude...');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[IA-CLIENT] ❌ Erro da API Claude:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText.substring(0, 200)
    });
    throw new Error(`Claude API error ${response.status}: ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  
  if (!data.content || !data.content[0] || !data.content[0].text) {
    console.error('[IA-CLIENT] ❌ Resposta Claude inválida:', data);
    throw new Error('Resposta da API Claude em formato inválido');
  }

  console.log('[IA-CLIENT] ✅ Claude respondeu com sucesso');
  console.log('[IA-CLIENT] 📊 Tokens usados:', data.usage);
  
  return {
    content: data.content[0].text,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
    modelo_usado: modelo,
    tempo_resposta: new Date().toISOString()
  };
}

// ================================================================================
// 🎯 FUNÇÃO: SELEÇÃO AUTOMÁTICA DE MODELO
// ================================================================================

export function selecionarModelo(temImagem, complexidade) {
  console.log('[IA-CLIENT] 🎯 Selecionando modelo...', { temImagem, complexidade });
  
  // Se tem imagem, sempre usar Claude
  if (temImagem) {
    return {
      modelo: 'claude-3-5-sonnet-20240620',
      fallback: ['gpt-4o'], // Se Claude falhar, tentar GPT-4o
      motivo: 'Imagem detectada - usando Claude'
    };
  }
  
  // Para texto, escolher baseado na complexidade
  switch (complexidade) {
    case 'muito_alta':
    case 'alta':
      return {
        modelo: 'gpt-4o',
        fallback: ['gpt-4o-mini'],
        motivo: 'Alta complexidade - usando GPT-4o'
      };
      
    case 'baixa':
    case 'media':
    default:
      return {
        modelo: 'gpt-4o-mini',
        fallback: ['gpt-4o'],
        motivo: 'Complexidade padrão - usando GPT-4o-mini'
      };
  }
}

// ================================================================================
// 💰 FUNÇÃO: CALCULAR CUSTOS
// ================================================================================

export function calcularCusto(informacoesUso) {
  const modelo = informacoesUso.modelo || 'gpt-4o-mini';
  const precos = PRECOS_MODELOS[modelo] || PRECOS_MODELOS['gpt-4o-mini'];
  
  // Tokens de entrada e saída
  const inputTokens = informacoesUso.tokens_input || 0;
  const outputTokens = informacoesUso.tokens_output || 0;
  
  // Cálculo em USD
  const custoInputUSD = (inputTokens / 1000) * precos.input;
  const custoOutputUSD = (outputTokens / 1000) * precos.output;
  const custoTotalUSD = custoInputUSD + custoOutputUSD;
  
  // Conversão para BRL
  const custoTotalBRL = custoTotalUSD * USD_TO_BRL;
  
  return {
    custo_input_usd: custoInputUSD,
    custo_output_usd: custoOutputUSD,
    custo_total_usd: custoTotalUSD,
    custo_total_brl: custoTotalBRL,
    custo_total: custoTotalBRL, // Compatibilidade
    taxa_conversao: USD_TO_BRL,
    modelo: modelo,
    tokens_processados: inputTokens + outputTokens
  };
}

// ================================================================================
// 📊 FUNÇÃO: OBTER INFORMAÇÕES DE USO
// ================================================================================

export function obterInformacoesUso(resultado) {
  const usage = resultado.usage || {};
  
  // Compatibilidade OpenAI vs Claude
  const inputTokens = usage.input_tokens || usage.prompt_tokens || 0;
  const outputTokens = usage.output_tokens || usage.completion_tokens || 0;
  
  return {
    modelo: resultado.modelo_usado || 'desconhecido',
    tokens_input: inputTokens,
    tokens_output: outputTokens,
    tokens_total: inputTokens + outputTokens,
    tempo_resposta: resultado.tempo_resposta
  };
}

// ================================================================================
// 📊 FUNÇÃO: ATUALIZAR ESTATÍSTICAS
// ================================================================================

function atualizarEstatisticas(resultado) {
  const informacoes = obterInformacoesUso(resultado);
  const custo = calcularCusto(informacoes);
  
  estatisticas.tokensTotal += informacoes.tokens_total;
  estatisticas.custoTotalBRL += custo.custo_total;
  
  console.log(`[IA-CLIENT] 📊 Estatísticas atualizadas:`);
  console.log(`[IA-CLIENT] - Tokens: +${informacoes.tokens_total} (total: ${estatisticas.tokensTotal})`);
  console.log(`[IA-CLIENT] - Custo: +R$ ${custo.custo_total.toFixed(4)} (total: R$ ${estatisticas.custoTotalBRL.toFixed(4)})`);
}

// ================================================================================
// 📈 FUNÇÃO: OBTER ESTATÍSTICAS COMPLETAS
// ================================================================================

export function obterEstatisticas() {
  const taxaSucesso = estatisticas.totalChamadas > 0 
    ? ((estatisticas.sucessos / estatisticas.totalChamadas) * 100).toFixed(1) + '%' 
    : '0%';
    
  const custoMedio = estatisticas.sucessos > 0 
    ? (estatisticas.custoTotalBRL / estatisticas.sucessos).toFixed(4) 
    : 0;
    
  const tokensMedio = estatisticas.sucessos > 0 
    ? Math.round(estatisticas.tokensTotal / estatisticas.sucessos) 
    : 0;

  return {
    ...estatisticas,
    taxa_sucesso: taxaSucesso,
    custo_medio_brl: custoMedio,
    tokens_medio: tokensMedio,
    status: 'IA_REAL_CONECTADA'
  };
}

// ================================================================================
// 🔧 FUNÇÕES UTILITÁRIAS
// ================================================================================

export function verificarDisponibilidadeAPIs() {
  return {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai_key_length: process.env.OPENAI_API_KEY?.length || 0,
    anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0,
    configuracao_ok: !!process.env.OPENAI_API_KEY
  };
}

export function resetarEstatisticas() {
  console.log('[IA-CLIENT] 🔄 Resetando estatísticas...');
  estatisticas = {
    totalChamadas: 0,
    custoTotalBRL: 0,
    tokensTotal: 0,
    sucessos: 0,
    falhas: 0,
    ultimaReset: new Date().toISOString()
  };
  console.log('[IA-CLIENT] ✅ Estatísticas resetadas');
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 FINAL
// ================================================================================

console.log('✅ [IA-CLIENT] IA-Client v9.0 carregado - IA REAL CONECTADA');
console.log('🤖 [IA-CLIENT] OpenAI:', !!process.env.OPENAI_API_KEY ? 'CONECTADA' : 'NÃO CONFIGURADA');
console.log('🎨 [IA-CLIENT] Claude:', !!process.env.ANTHROPIC_API_KEY ? 'CONECTADA' : 'NÃO CONFIGURADA');

export {
  chamarIASegura,
  selecionarModelo,
  calcularCusto,
  obterInformacoesUso,
  obterEstatisticas,
  verificarDisponibilidadeAPIs,
  resetarEstatisticas
};

export default {
  chamarIASegura,
  selecionarModelo,
  calcularCusto,
  obterInformacoesUso,
  obterEstatisticas,
  verificarDisponibilidadeAPIs,
  resetarEstatisticas
};

console.log('🚀 [IA-CLIENT] Sistema de IA Real v9.0 - OPENAI + CLAUDE CONECTADOS!');
