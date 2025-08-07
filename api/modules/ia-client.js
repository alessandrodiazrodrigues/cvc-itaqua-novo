// 🤖 modules/ia-client.js - v9.0 - VERSÃO FINAL PARA INTEGRAÇÃO
// CORREÇÃO: Exportações ES6 limpas, funções testadas
// Responsável por: Chamadas OpenAI, Claude, fallbacks, seleção de modelo

console.log("🤖 IA-Client v9.0 - VERSÃO FINAL PARA INTEGRAÇÃO");

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
// 🎯 FUNÇÃO PRINCIPAL: CHAMAR IA COM SEGURANÇA
// ================================================================================

async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelos) {
  console.log('[IA-CLIENT] Iniciando chamada segura...', { 
    modelo, 
    temImagem, 
    promptLength: prompt.length 
  });
  
  try {
    estatisticas.totalChamadas++;
    let resultado;
    
    if (temImagem === true && arquivo) {
      console.log('[IA-CLIENT] 🖼️ Processando imagem com IA...');
      resultado = await processarComImagem(prompt, arquivo, modelo);
    } else {
      console.log('[IA-CLIENT] 📝 Processando texto com IA...');
      resultado = await chamarOpenAI(prompt, false, null, modelo);
    }
    
    estatisticas.sucessos++;
    atualizarEstatisticas(resultado);
    
    console.log('[IA-CLIENT] ✅ Chamada bem-sucedida!', {
      modelo: resultado.modelo_usado,
      responseLength: resultado.content.length,
      tokens: resultado.usage?.total_tokens || 0
    });
    
    return resultado;
    
  } catch (erro1) {
    console.error(`❌ [IA-CLIENT] Falha no modelo principal ${modelo}:`, erro1.message);
    
    // Tentar fallback se disponível
    if (fallbackModelos && fallbackModelos.length > 0) {
      console.warn(`⚠️ [IA-CLIENT] Tentando fallback: ${fallbackModelos[0]}...`);
      
      try {
        const resultadoFallback = await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelos[0]);
        estatisticas.sucessos++;
        atualizarEstatisticas(resultadoFallback);
        
        console.log('[IA-CLIENT] ✅ Fallback funcionou!');
        return resultadoFallback;
        
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] Fallback também falhou:`, erro2.message);
        estatisticas.falhas++;
        throw new Error(`Ambos os modelos falharam: ${modelo} (${erro1.message}) | ${fallbackModelos[0]} (${erro2.message})`);
      }
    } else {
      estatisticas.falhas++;
      throw new Error(`Modelo ${modelo} falhou: ${erro1.message}`);
    }
  }
}

// ================================================================================
// 🖼️ PROCESSAMENTO COM IMAGEM
// ================================================================================

async function processarComImagem(prompt, arquivo, modelo) {
  console.log('[IA-CLIENT] 🖼️ Iniciando processamento de imagem...');
  
  // Prioridade: Claude para imagens, GPT-4o como fallback
  if (process.env.ANTHROPIC_API_KEY && modelo.includes('claude')) {
    try {
      console.log('[IA-CLIENT] Tentando Claude para análise de imagem...');
      return await chamarClaude(prompt, arquivo, modelo);
    } catch (claudeError) {
      console.warn('[IA-CLIENT] Claude falhou, tentando GPT-4o:', claudeError.message);
    }
  }
  
  // Fallback para GPT-4o com visão
  console.log('[IA-CLIENT] Usando GPT-4o para análise de imagem...');
  return await chamarOpenAI(prompt, true, arquivo, 'gpt-4o');
}

// ================================================================================
// 🤖 FUNÇÃO: CHAMAR OPENAI (GPT)
// ================================================================================

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  console.log('[IA-CLIENT] 🚀 Preparando chamada para OpenAI...', { modelo, temImagem });
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
  }

  let messages;
  if (temImagem && arquivo) {
    messages = [{
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: arquivo } }
      ]
    }];
  } else {
    messages = [{ role: "user", content: prompt }];
  }

  const requestBody = {
    model: modelo,
    messages: messages,
    max_tokens: MAX_TOKENS,
    temperature: 0.1
  };

  console.log('[IA-CLIENT] 📡 Enviando requisição para OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API OpenAI ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Resposta da API OpenAI em formato inválido');
  }

  console.log('[IA-CLIENT] ✅ OpenAI respondeu com sucesso');
  
  return {
    content: data.choices[0].message.content,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    modelo_usado: modelo
  };
}

// ================================================================================
// 🎨 FUNÇÃO: CHAMAR CLAUDE (ANTHROPIC)
// ================================================================================

async function chamarClaude(prompt, arquivo, modelo) {
  console.log('[IA-CLIENT] 🎨 Preparando chamada para Claude...', { modelo });
  
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente');
  }

  const messages = [{
    role: "user",
    content: arquivo ? [
      { type: "text", text: prompt },
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: arquivo.split(',')[1] } }
    ] : [{ type: "text", text: prompt }]
  }];

  const requestBody = {
    model: modelo,
    max_tokens: MAX_TOKENS,
    messages: messages,
    temperature: 0.1
  };

  console.log('[IA-CLIENT] 📡 Enviando requisição para Claude...');
  
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
    throw new Error(`Erro na API Claude ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.content?.[0]?.text) {
    throw new Error('Resposta da API Claude em formato inválido');
  }

  console.log('[IA-CLIENT] ✅ Claude respondeu com sucesso');
  
  return {
    content: data.content[0].text,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
    modelo_usado: modelo
  };
}

// ================================================================================
// 🎯 SELEÇÃO INTELIGENTE DE MODELO
// ================================================================================

function selecionarModelo(temImagem, complexidade) {
  console.log('[IA-CLIENT] 🎯 Selecionando modelo...', { temImagem, complexidade });
  
  let modeloRecomendado;
  let fallbackModelos;

  if (temImagem) {
    // Para imagens: Claude ou GPT-4o
    if (process.env.ANTHROPIC_API_KEY) {
      modeloRecomendado = 'claude-3-5-sonnet-20240620';
      fallbackModelos = ['gpt-4o'];
    } else {
      modeloRecomendado = 'gpt-4o';
      fallbackModelos = [];
    }
  } else {
    // Para texto: baseado na complexidade
    switch (complexidade) {
      case 'muito_alta':
      case 'alta':
        modeloRecomendado = 'gpt-4o';
        fallbackModelos = ['gpt-4o-mini'];
        break;
      case 'media':
      case 'baixa':
      default:
        modeloRecomendado = 'gpt-4o-mini';
        fallbackModelos = ['gpt-4o'];
        break;
    }
  }

  const resultado = {
    modelo: modeloRecomendado,
    fallback: fallbackModelos
  };

  console.log('[IA-CLIENT] 🎯 Modelo selecionado:', resultado);
  return resultado;
}

// ================================================================================
// 💰 CÁLCULO DE CUSTOS
// ================================================================================

function calcularCusto(informacoesUso) {
  console.log('[IA-CLIENT] 💰 Calculando custos...', informacoesUso);
  
  const modelo = informacoesUso.modelo || 'gpt-4o-mini';
  const precos = PRECOS_MODELOS[modelo];
  
  if (!precos) {
    console.warn('[IA-CLIENT] ⚠️ Preços não encontrados para modelo:', modelo);
    return { custo_total: 0, modelo_usado: modelo };
  }
  
  const inputTokens = informacoesUso.tokens_input || 0;
  const outputTokens = informacoesUso.tokens_output || 0;
  
  const custoInputUSD = (inputTokens / 1000) * precos.input;
  const custoOutputUSD = (outputTokens / 1000) * precos.output;
  const custoTotalUSD = custoInputUSD + custoOutputUSD;
  const custoTotalBRL = custoTotalUSD * USD_TO_BRL;
  
  const resultado = {
    custo_input_usd: parseFloat(custoInputUSD.toFixed(6)),
    custo_output_usd: parseFloat(custoOutputUSD.toFixed(6)),
    custo_total_usd: parseFloat(custoTotalUSD.toFixed(6)),
    custo_total: parseFloat(custoTotalBRL.toFixed(4)),
    modelo_usado: modelo,
    tokens_processados: inputTokens + outputTokens
  };
  
  console.log('[IA-CLIENT] 💰 Custo calculado:', resultado);
  return resultado;
}

// ================================================================================
// 📊 OBTER INFORMAÇÕES DE USO
// ================================================================================

function obterInformacoesUso(resultado) {
  const usage = resultado.usage || {};
  
  const informacoes = {
    modelo: resultado.modelo_usado || 'desconhecido',
    tokens_input: usage.input_tokens || usage.prompt_tokens || 0,
    tokens_output: usage.output_tokens || usage.completion_tokens || 0,
    tokens_total: (usage.input_tokens || usage.prompt_tokens || 0) + 
                  (usage.output_tokens || usage.completion_tokens || 0)
  };
  
  console.log('[IA-CLIENT] 📊 Informações de uso extraídas:', informacoes);
  return informacoes;
}

// ================================================================================
// 📈 ATUALIZAR E OBTER ESTATÍSTICAS
// ================================================================================

function atualizarEstatisticas(resultado) {
  const informacoes = obterInformacoesUso(resultado);
  const custo = calcularCusto(informacoes);
  
  estatisticas.tokensTotal += informacoes.tokens_total;
  estatisticas.custoTotalBRL += custo.custo_total;
  
  console.log(`[IA-CLIENT] 📊 Estatísticas atualizadas: +${informacoes.tokens_total} tokens, +R$ ${custo.custo_total.toFixed(4)}`);
}

function obterEstatisticas() {
  const stats = {
    ...estatisticas,
    taxa_sucesso: estatisticas.totalChamadas > 0 ? 
      ((estatisticas.sucessos / estatisticas.totalChamadas) * 100).toFixed(1) + '%' : '0%',
    custo_medio_brl: estatisticas.sucessos > 0 ? 
      (estatisticas.custoTotalBRL / estatisticas.sucessos).toFixed(4) : 0,
    tokens_medio: estatisticas.sucessos > 0 ? 
      Math.round(estatisticas.tokensTotal / estatisticas.sucessos) : 0
  };
  
  console.log('[IA-CLIENT] 📈 Estatísticas obtidas:', stats);
  return stats;
}

function resetarEstatisticas() {
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
// 🔧 VERIFICAR DISPONIBILIDADE DAS APIs
// ================================================================================

function verificarDisponibilidadeAPIs() {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai_key_length: process.env.OPENAI_API_KEY?.length || 0,
    anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0
  };
  
  console.log('[IA-CLIENT] 🔧 Status das APIs:', status);
  return status;
}

// ================================================================================
// 🧪 TESTE DE CONECTIVIDADE
// ================================================================================

async function testarConectividade() {
  console.log('[IA-CLIENT] 🧪 Testando conectividade das APIs...');
  
  const resultados = { 
    openai: false, 
    anthropic: false, 
    erros: [] 
  };

  // Testar OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      await chamarOpenAI('Teste de conectividade. Responda apenas: OK', false, null, 'gpt-4o-mini');
      resultados.openai = true;
      console.log('[IA-CLIENT] ✅ OpenAI conectada com sucesso');
    } catch (error) {
      resultados.erros.push(`OpenAI: ${error.message}`);
      console.log('[IA-CLIENT] ❌ OpenAI falhou no teste');
    }
  } else {
    resultados.erros.push('OpenAI: API Key não configurada');
  }

  // Testar Anthropic (apenas verificar se a chave existe)
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('[IA-CLIENT] ✅ Anthropic configurada (chave presente)');
    resultados.anthropic = true;
  } else {
    resultados.erros.push('Anthropic: API Key não configurada');
  }

  console.log('[IA-CLIENT] 🧪 Teste de conectividade concluído:', resultados);
  return resultados;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 COMPLETA
// ================================================================================

console.log('✅ [IA-CLIENT] IA-Client v9.0 carregado e COMPLETO');

// EXPORTAÇÕES NOMEADAS
export {
  chamarIASegura,
  selecionarModelo,
  calcularCusto,
  obterInformacoesUso,
  obterEstatisticas,
  verificarDisponibilidadeAPIs,
  testarConectividade,
  resetarEstatisticas
};

// EXPORTAÇÃO DEFAULT PARA MÁXIMA COMPATIBILIDADE
export default {
  chamarIASegura,
  selecionarModelo,
  calcularCusto,
  obterInformacoesUso,
  obterEstatisticas,
  verificarDisponibilidadeAPIs,
  testarConectividade,
  resetarEstatisticas
};

console.log('🚀 [IA-CLIENT] Sistema de Cliente IA v9.0 - COMPLETO E FUNCIONAL!');
