// 🤖 modules/ia-client.js - v8.1 - CORREÇÃO FINAL DE EXPORTAÇÕES
// CORREÇÃO: Removido 'export' duplicado de TODAS as funções para resolver o erro.
// Responsável por: Chamadas OpenAI, Claude, fallbacks, seleção de modelo

console.log("🤖 IA-Client v8.1 - EXPORTAÇÕES CORRIGIDAS");

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
  totalChamadas: 0, custoTotalBRL: 0, tokensTotal: 0,
  sucessos: 0, falhas: 0, ultimaReset: new Date().toISOString()
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL: CHAMAR IA COM SEGURANÇA
// ================================================================================

async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log('[IA-CLIENT] Iniciando chamada segura...', { modelo, temImagem });
  
  try {
    estatisticas.totalChamadas++;
    let resultado;
    
    if (temImagem === true) {
      console.log('[IA-CLIENT] Chamando Claude para análise de imagem...');
      resultado = await chamarClaude(prompt, arquivo, modelo);
    } else {
      console.log('[IA-CLIENT] Chamando OpenAI para processamento de texto...');
      resultado = await chamarOpenAI(prompt, false, null, modelo);
    }
    
    estatisticas.sucessos++;
    atualizarEstatisticas(resultado);
    return resultado;
    
  } catch (erro1) {
    console.error(`❌ [IA-CLIENT] Falha no modelo principal ${modelo}:`, erro1.message);
    
    if (temImagem === true) {
      console.warn(`⚠️ [IA-CLIENT] Claude falhou, tentando GPT-4o com visão...`);
      try {
        const resultadoFallback = await chamarOpenAI(prompt, true, arquivo, 'gpt-4o');
        estatisticas.sucessos++;
        atualizarEstatisticas(resultadoFallback);
        return resultadoFallback;
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] GPT-4o também falhou:`, erro2.message);
        estatisticas.falhas++;
        throw new Error(`Ambos os modelos de imagem falharam: Claude (${erro1.message}) | GPT-4o (${erro2.message})`);
      }
    } else {
      console.warn(`⚠️ [IA-CLIENT] Tentando fallback com ${fallbackModelo}...`);
      try {
        const resultadoFallback = await chamarOpenAI(prompt, false, null, fallbackModelo);
        estatisticas.sucessos++;
        atualizarEstatisticas(resultadoFallback);
        return resultadoFallback;
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] Fallback também falhou:`, erro2.message);
        estatisticas.falhas++;
        throw new Error(`Ambos os modelos de texto falharam: ${modelo} (${erro1.message}) | ${fallbackModelo} (${erro2.message})`);
      }
    }
  }
}

// ================================================================================
// 🧠 FUNÇÃO: CHAMAR CLAUDE (ANTHROPIC)
// ================================================================================

async function chamarClaude(prompt, arquivo, modelo = 'claude-3-5-sonnet-20240620') {
  console.log('[IA-CLIENT] Preparando chamada para Claude...', { modelo });
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY não encontrada');

  const messages = [{
    role: 'user',
    content: [
      { type: 'text', text: prompt },
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: arquivo.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png',
          data: arquivo.split(',')[1]
        }
      }
    ]
  }];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: modelo, max_tokens: MAX_TOKENS, messages: messages })
  });

  if (!response.ok) throw new Error(`Erro na API Claude ${response.status}: ${(await response.text()).substring(0, 200)}`);
  const data = await response.json();
  if (!data.content?.[0]?.text) throw new Error('Resposta da API Claude em formato inválido');

  console.log('[IA-CLIENT] ✅ Claude respondeu com sucesso');
  return { content: data.content[0].text, usage: data.usage || { input_tokens: 0, output_tokens: 0 }, modelo_usado: modelo };
}

// ================================================================================
// 🤖 FUNÇÃO: CHAMAR OPENAI (GPT)
// ================================================================================

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  console.log('[IA-CLIENT] Preparando chamada para OpenAI...', { modelo, temImagem });
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não encontrada');

  let messages;
  if (temImagem === true && arquivo) {
    messages = [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: arquivo } }] }];
  } else {
    messages = [{ role: "user", content: prompt }];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelo, messages: messages, max_tokens: MAX_TOKENS, temperature: 0.1 })
  });

  if (!response.ok) throw new Error(`Erro na API OpenAI ${response.status}: ${(await response.text()).substring(0, 200)}`);
  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) throw new Error('Resposta da API OpenAI em formato inválido');

  console.log('[IA-CLIENT] ✅ OpenAI respondeu com sucesso');
  return { content: data.choices[0].message.content, usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 }, modelo_usado: modelo };
}

// ================================================================================
// 🎯 FUNÇÃO: SELEÇÃO INTELIGENTE DE MODELO
// ================================================================================

function selecionarModelo(temImagem, complexidade = 'media') {
  if (temImagem === true) {
    return { modelo: 'claude-3-5-sonnet-20240620', estrategia: 'Claude para análise visual', fallback: ['gpt-4o'] };
  }
  if (complexidade === 'muito_alta' || complexidade === 'alta') {
    return { modelo: 'gpt-4o', estrategia: 'GPT-4o para alta complexidade', fallback: ['gpt-4o-mini'] };
  }
  return { modelo: 'gpt-4o-mini', estrategia: 'GPT-4o-mini para texto simples', fallback: ['gpt-4o'] };
}

// ================================================================================
// 💰 FUNÇÃO: CALCULAR CUSTO
// ================================================================================

function calcularCusto(informacoesUso) {
  const modelo = informacoesUso.modelo || 'gpt-4o-mini';
  const precos = PRECOS_MODELOS[modelo] || PRECOS_MODELOS['gpt-4o-mini'];
  const inputTokens = informacoesUso.tokens_input || 0;
  const outputTokens = informacoesUso.tokens_output || 0;
  const custoUSD = (inputTokens / 1000 * precos.input) + (outputTokens / 1000 * precos.output);
  const custoBRL = custoUSD * USD_TO_BRL;
  const precosGPT4o = PRECOS_MODELOS['gpt-4o'];
  const custoGPT4oUSD = (inputTokens / 1000 * precosGPT4o.input) + (outputTokens / 1000 * precosGPT4o.output);
  const economiaUSD = custoGPT4oUSD - custoUSD;

  return {
    custo_usd: custoUSD,
    custo_total: custoBRL,
    economia_usd: economiaUSD,
    economia_percentual: economiaUSD > 0 ? ((economiaUSD / custoGPT4oUSD) * 100) : 0,
    modelo_usado: modelo,
    tokens_processados: inputTokens + outputTokens
  };
}

// ================================================================================
// 🔧 FUNÇÃO: OBTER INFORMAÇÕES DE USO
// ================================================================================

function obterInformacoesUso(resultado) {
  const usage = resultado.usage || {};
  return {
    modelo: resultado.modelo_usado || 'desconhecido',
    tokens_input: usage.input_tokens || usage.prompt_tokens || 0,
    tokens_output: usage.output_tokens || usage.completion_tokens || 0,
    tokens_total: (usage.input_tokens || 0) + (usage.output_tokens || 0)
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
  console.log(`[IA-CLIENT] 📊 Estatísticas atualizadas: +${informacoes.tokens_total} tokens, +R$ ${custo.custo_total.toFixed(4)}`);
}

// ================================================================================
// 📈 FUNÇÃO: OBTER ESTATÍSTICAS
// ================================================================================

function obterEstatisticas() {
  return {
    ...estatisticas,
    taxa_sucesso: estatisticas.totalChamadas > 0 ? ((estatisticas.sucessos / estatisticas.totalChamadas) * 100).toFixed(1) + '%' : '0%',
    custo_medio_brl: estatisticas.sucessos > 0 ? (estatisticas.custoTotalBRL / estatisticas.sucessos).toFixed(4) : 0,
    tokens_medio: estatisticas.sucessos > 0 ? Math.round(estatisticas.tokensTotal / estatisticas.sucessos) : 0
  };
}

// ================================================================================
// 🔄 FUNÇÃO: RESETAR ESTATÍSTICAS
// ================================================================================

function resetarEstatisticas() {
  console.log('[IA-CLIENT] 🔄 Resetando estatísticas...');
  estatisticas = {
    totalChamadas: 0, custoTotalBRL: 0, tokensTotal: 0,
    sucessos: 0, falhas: 0, ultimaReset: new Date().toISOString()
  };
  console.log('[IA-CLIENT] ✅ Estatísticas resetadas');
}

// ================================================================================
// 🔧 FUNÇÃO: VERIFICAR DISPONIBILIDADE DAS APIs
// ================================================================================

function verificarDisponibilidadeAPIs() {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai_key_length: process.env.OPENAI_API_KEY?.length || 0,
    anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0
  };
  console.log('[IA-CLIENT] Status das APIs:', status);
  return status;
}

// ================================================================================
// 🎯 FUNÇÃO: TESTE DE CONECTIVIDADE
// ================================================================================

async function testarConectividade() {
  const resultados = { openai: false, anthropic: false, erros: [] };
  if (process.env.OPENAI_API_KEY) {
    try {
      await chamarOpenAI('Teste de conectividade. Responda apenas: OK', false, null, 'gpt-4o-mini');
      resultados.openai = true;
      console.log('[IA-CLIENT] ✅ OpenAI conectada');
    } catch (error) {
      resultados.erros.push(`OpenAI: ${error.message}`);
      console.log('[IA-CLIENT] ❌ OpenAI falhou');
    }
  }
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('[IA-CLIENT] ✅ Anthropic configurada (não testando conectividade)');
    resultados.anthropic = true;
  }
  return resultados;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 ÚNICA (CORREÇÃO CRÍTICA FINAL)
// ================================================================================

console.log('✅ [IA-CLIENT] IA-Client v8.0 carregado e corrigido');

// EXPORTAÇÃO ÚNICA E LIMPA
export {
  chamarIASegura,
  selecionarModelo,
  calcularCusto,
  obterInformacoesUso,
  obterEstatisticas,
  verificarDisponibilidadeAPIs,
  testarConectividade,
  resetarEstatisticas // Agora exportado corretamente aqui
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

console.log('🚀 [IA-CLIENT] Sistema de Cliente IA v8.0 - CORRIGIDO E FUNCIONAL!');
