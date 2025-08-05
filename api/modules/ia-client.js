// 🤖 ia-client.js - CLIENTE DE IA COMPLETO v7.7
// CORREÇÃO CRÍTICA #2: Exportação ES6 + Sistema Robusto de IA
// Responsável por: Chamadas OpenAI/Claude, fallbacks inteligentes, seleção de modelo

console.log("🤖 IA-Client v7.7 - CLIENTE ROBUSTO + ES6 CORRIGIDA");

// ================================================================================
// 📋 CONFIGURAÇÕES DE MODELOS
// ================================================================================

const MODELOS_CONFIG = {
  openai: {
    'gpt-4o-mini': {
      maxTokens: 2000,
      temperatura: 0.7,
      custoInput: 0.00015,
      custoOutput: 0.0006,
      suporteImagem: false,
      uso: 'texto_simples'
    },
    'gpt-4o': {
      maxTokens: 4000,
      temperatura: 0.7,
      custoInput: 0.0025,
      custoOutput: 0.01,
      suporteImagem: true,
      uso: 'texto_avancado_imagem'
    }
  },
  anthropic: {
    'claude-3-5-sonnet-20240620': {
      maxTokens: 2000,
      temperatura: 0.7,
      custoInput: 0.003,
      custoOutput: 0.015,
      suporteImagem: true,
      uso: 'imagem_especializada'
    }
  }
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL: CHAMAR IA COM SEGURANÇA
// ================================================================================

export async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log('[IA-CLIENT] Iniciando chamada segura...', { modelo, temImagem });
  
  const inicioTempo = Date.now();
  
  try {
    let resultado;
    
    if (temImagem === true) {
      console.log('[IA-CLIENT] Chamando modelo de visão...');
      resultado = await chamarModeloVisao(prompt, arquivo, modelo);
    } else {
      console.log('[IA-CLIENT] Chamando modelo de texto...');
      resultado = await chamarModeloTexto(prompt, modelo);
    }
    
    // Adicionar métricas de tempo
    resultado.tempoProcessamento = Date.now() - inicioTempo;
    resultado.sucesso = true;
    
    console.log(`[IA-CLIENT] ✅ Sucesso com ${modelo} em ${resultado.tempoProcessamento}ms`);
    return resultado;
    
  } catch (erro1) {
    console.error(`❌ [IA-CLIENT] Falha no modelo principal ${modelo}:`, erro1.message);
    
    // ================================================================================
    // 🔄 SISTEMA DE FALLBACK INTELIGENTE
    // ================================================================================
    
    if (!fallbackModelo) {
      fallbackModelo = determinarFallback(modelo, temImagem);
    }
    
    console.warn(`⚠️ [IA-CLIENT] Tentando fallback com ${fallbackModelo}...`);
    
    try {
      let resultadoFallback;
      
      if (temImagem === true) {
        resultadoFallback = await chamarModeloVisao(prompt, arquivo, fallbackModelo);
      } else {
        resultadoFallback = await chamarModeloTexto(prompt, fallbackModelo);
      }
      
      // Adicionar informações do fallback
      resultadoFallback.tempoProcessamento = Date.now() - inicioTempo;
      resultadoFallback.sucesso = true;
      resultadoFallback.usouFallback = true;
      resultadoFallback.erroOriginal = erro1.message;
      
      console.log(`[IA-CLIENT] ✅ Fallback ${fallbackModelo} funcionou em ${resultadoFallback.tempoProcessamento}ms`);
      return resultadoFallback;
      
    } catch (erro2) {
      console.error(`❌ [IA-CLIENT] Fallback também falhou:`, erro2.message);
      
      // Erro final - ambos modelos falharam
      const erroFinal = new Error(`Todos os modelos falharam: ${modelo} (${erro1.message}) | ${fallbackModelo} (${erro2.message})`);
      erroFinal.detalhes = {
        modeloPrincipal: { modelo, erro: erro1.message },
        modeloFallback: { modelo: fallbackModelo, erro: erro2.message },
        tempoTotal: Date.now() - inicioTempo,
        temImagem
      };
      
      throw erroFinal;
    }
  }
}

// ================================================================================
// 🔍 FUNÇÕES DE CHAMADA ESPECÍFICAS
// ================================================================================

async function chamarModeloVisao(prompt, arquivo, modelo) {
  console.log(`[IA-CLIENT] Chamando modelo de visão: ${modelo}`);
  
  if (modelo.includes('claude')) {
    return await chamarClaude(prompt, arquivo, modelo);
  } else if (modelo.includes('gpt')) {
    return await chamarOpenAI(prompt, true, arquivo, modelo);
  } else {
    throw new Error(`Modelo de visão não suportado: ${modelo}`);
  }
}

async function chamarModeloTexto(prompt, modelo) {
  console.log(`[IA-CLIENT] Chamando modelo de texto: ${modelo}`);
  
  if (modelo.includes('gpt')) {
    return await chamarOpenAI(prompt, false, null, modelo);
  } else if (modelo.includes('claude')) {
    return await chamarClaude(prompt, null, modelo);
  } else {
    throw new Error(`Modelo de texto não suportado: ${modelo}`);
  }
}

// ================================================================================
// 🧠 FUNÇÃO: CHAMAR CLAUDE (ANTHROPIC)
// ================================================================================

async function chamarClaude(prompt, arquivo, modelo) {
  console.log('[IA-CLIENT] Preparando chamada para Claude...');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente');
  }

  let content = [{ type: "text", text: prompt }];
  
  if (arquivo) {
    const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
    if (!base64Match) {
      throw new Error('Formato de imagem base64 inválido para Claude');
    }
    
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: base64Match[1],
        data: base64Match[2]
      }
    });
  }

  console.log('[IA-CLIENT] Enviando requisição para Claude...');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: MODELOS_CONFIG.anthropic[modelo]?.maxTokens || 2000,
      messages: [{ role: 'user', content }]
    })
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
    modelo_usado: modelo,
    provider: 'anthropic'
  };
}

// ================================================================================
// 🤖 FUNÇÃO: CHAMAR OPENAI (GPT)
// ================================================================================

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  console.log('[IA-CLIENT] Preparando chamada para OpenAI...', { modelo, temImagem });
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
  }

  let messages;
  
  if (temImagem === true && arquivo) {
    console.log('[IA-CLIENT] Configurando OpenAI para análise de imagem...');
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
    console.log('[IA-CLIENT] Configurando OpenAI para processamento de texto...');
    messages = [{ role: "user", content: prompt }];
  }

  console.log('[IA-CLIENT] Enviando requisição para OpenAI...');

  const modelConfig = MODELOS_CONFIG.openai[modelo] || MODELOS_CONFIG.openai['gpt-4o-mini'];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelo,
      messages: messages,
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperatura
    })
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
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 },
    modelo_usado: modelo,
    provider: 'openai'
  };
}

// ================================================================================
// 🎯 SELEÇÃO INTELIGENTE DE MODELO
// ================================================================================

export function selecionarModelo(temImagem, complexidade = 'simples', opcoes = {}) {
  console.log(`[IA-CLIENT] Selecionando modelo para: imagem=${temImagem}, complexidade=${complexidade}`);
  
  // Estratégias por tipo de tarefa
  if (temImagem === true) {
    // Para análise de imagem: priorizar Claude
    return {
      modelo: opcoes.forcarGPT ? 'gpt-4o' : 'claude-3-5-sonnet-20240620',
      estrategia: 'Claude especializado em visão',
      fallback: 'gpt-4o',
      provider: opcoes.forcarGPT ? 'openai' : 'anthropic'
    };
  } else {
    // Para texto: escolher baseado na complexidade
    const modelosTexto = {
      simples: {
        modelo: 'gpt-4o-mini',
        estrategia: 'GPT-4o-mini para tarefas simples',
        fallback: 'gpt-4o',
        provider: 'openai'
      },
      media: {
        modelo: 'gpt-4o-mini',
        estrategia: 'GPT-4o-mini otimizado',
        fallback: 'gpt-4o',
        provider: 'openai'
      },
      alta: {
        modelo: 'gpt-4o',
        estrategia: 'GPT-4o para tarefas complexas',
        fallback: 'gpt-4o-mini',
        provider: 'openai'
      }
    };
    
    return modelosTexto[complexidade] || modelosTexto.simples;
  }
}

function determinarFallback(modeloOriginal, temImagem) {
  if (temImagem) {
    // Para imagem: alternar entre Claude e GPT-4o
    if (modeloOriginal.includes('claude')) {
      return 'gpt-4o';
    } else {
      return 'claude-3-5-sonnet-20240620';
    }
  } else {
    // Para texto: escalonar entre GPT modelos
    if (modeloOriginal === 'gpt-4o-mini') {
      return 'gpt-4o';
    } else {
      return 'gpt-4o-mini';
    }
  }
}

// ================================================================================
// 🔧 VERIFICAÇÃO E DIAGNÓSTICO
// ================================================================================

export function verificarDisponibilidadeAPIs() {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    detalhes: {
      openai_key_length: process.env.OPENAI_API_KEY?.length || 0,
      anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0
    }
  };
  
  console.log('[IA-CLIENT] Status das APIs:', status);
  
  return status;
}

export async function testarConectividade(opcoes = {}) {
  const resultados = {
    openai: false,
    anthropic: false,
    erros: [],
    tempos: {},
    detalhes: {}
  };
  
  // Testar OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const inicio = Date.now();
      const resultado = await chamarOpenAI('Teste de conectividade. Responda apenas: OK', false, null, 'gpt-4o-mini');
      
      resultados.openai = true;
      resultados.tempos.openai = Date.now() - inicio;
      resultados.detalhes.openai = {
        resposta: resultado.content,
        usage: resultado.usage
      };
      
      console.log(`[IA-CLIENT] ✅ OpenAI conectada (${resultados.tempos.openai}ms)`);
    } catch (error) {
      resultados.erros.push(`OpenAI: ${error.message}`);
      console.log('[IA-CLIENT] ❌ OpenAI falhou:', error.message);
    }
  } else {
    resultados.erros.push('OpenAI: API key não configurada');
  }
  
  // Testar Anthropic (se solicitado)
  if (process.env.ANTHROPIC_API_KEY && opcoes.testarClaude) {
    try {
      const inicio = Date.now();
      const resultado = await chamarClaude('Teste de conectividade. Responda apenas: OK', null, 'claude-3-5-sonnet-20240620');
      
      resultados.anthropic = true;
      resultados.tempos.anthropic = Date.now() - inicio;
      resultados.detalhes.anthropic = {
        resposta: resultado.content,
        usage: resultado.usage
      };
      
      console.log(`[IA-CLIENT] ✅ Anthropic conectada (${resultados.tempos.anthropic}ms)`);
    } catch (error) {
      resultados.erros.push(`Anthropic: ${error.message}`);
      console.log('[IA-CLIENT] ❌ Anthropic falhou:', error.message);
    }
  } else if (!process.env.ANTHROPIC_API_KEY) {
    resultados.erros.push('Anthropic: API key não configurada');
  }
  
  return resultados;
}

// ================================================================================
// 📊 MÉTRICAS E ANÁLISE
// ================================================================================

export function obterInformacoesUso(resultado) {
  const usage = resultado.usage || {};
  
  return {
    modelo: resultado.modelo_usado || 'desconhecido',
    provider: resultado.provider || 'desconhecido',
    tokens_input: usage.input_tokens || usage.prompt_tokens || 0,
    tokens_output: usage.output_tokens || usage.completion_tokens || 0,
    tokens_total: (usage.input_tokens || usage.prompt_tokens || 0) + 
                  (usage.output_tokens || usage.completion_tokens || 0),
    tempo_processamento: resultado.tempoProcessamento || 0,
    usou_fallback: resultado.usouFallback || false,
    sucesso: resultado.sucesso || false
  };
}

export function calcularCusto(informacoesUso) {
  const { modelo, provider, tokens_input, tokens_output } = informacoesUso;
  
  let custoInput = 0;
  let custoOutput = 0;
  
  // Buscar configuração do modelo
  const config = MODELOS_CONFIG[provider]?.[modelo];
  
  if (config) {
    custoInput = (tokens_input / 1000) * config.custoInput;
    custoOutput = (tokens_output / 1000) * config.custoOutput;
  }
  
  return {
    custo_input: custoInput,
    custo_output: custoOutput,
    custo_total: custoInput + custoOutput,
    tokens_input,
    tokens_output,
    modelo,
    provider
  };
}

// ================================================================================
// 🔄 GERENCIAMENTO DE RETRY
// ================================================================================

export async function chamarComRetry(funcaoChamada, maxTentativas = 3, delayMs = 1000) {
  let ultimoErro;
  
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      console.log(`[IA-CLIENT] Tentativa ${tentativa}/${maxTentativas}`);
      return await funcaoChamada();
    } catch (error) {
      ultimoErro = error;
      console.warn(`[IA-CLIENT] Tentativa ${tentativa} falhou:`, error.message);
      
      if (tentativa < maxTentativas) {
        const delay = delayMs * tentativa; // Delay exponencial
        console.log(`[IA-CLIENT] Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Todas as ${maxTentativas} tentativas falharam. Último erro: ${ultimoErro.message}`);
}

// ================================================================================
// 🔍 ANÁLISE DE PERFORMANCE
// ================================================================================

const metricas = {
  totalChamadas: 0,
  sucessos: 0,
  falhas: 0,
  tempoMedio: 0,
  custTotal: 0
};

export function adicionarMetrica(resultado, custo) {
  metricas.totalChamadas++;
  
  if (resultado.sucesso) {
    metricas.sucessos++;
  } else {
    metricas.falhas++;
  }
  
  if (resultado.tempoProcessamento) {
    metricas.tempoMedio = (metricas.tempoMedio * (metricas.totalChamadas - 1) + resultado.tempoProcessamento) / metricas.totalChamadas;
  }
  
  if (custo) {
    metricas.custTotal += custo.custo_total;
  }
}

export function obterEstatisticas() {
  return {
    ...metricas,
    taxaSucesso: metricas.totalChamadas > 0 ? (metricas.sucessos / metricas.totalChamadas) * 100 : 0,
    custoMedio: metricas.totalChamadas > 0 ? metricas.custTotal / metricas.totalChamadas : 0
  };
}

export function resetarEstatisticas() {
  metricas.totalChamadas = 0;
  metricas.sucessos = 0;
  metricas.falhas = 0;
  metricas.tempoMedio = 0;
  metricas.custTotal = 0;
  
  console.log('[IA-CLIENT] Estatísticas resetadas');
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 (CORREÇÃO CRÍTICA #2)
// ================================================================================

// Log de inicialização
console.log('✅ [IA-CLIENT] IA-Client v7.7 carregado:');
console.log('🤖 [IA-CLIENT] Suporte: OpenAI (GPT-4o, GPT-4o-mini) + Claude (Sonnet)');
console.log('🔄 [IA-CLIENT] Sistema robusto de fallbacks');
console.log('📊 [IA-CLIENT] Métricas e análise de performance');
console.log('🎯 [IA-CLIENT] Seleção inteligente de modelo');
console.log('🔧 [IA-CLIENT] Sistema de retry e recuperação');
console.log('🚨 [IA-CLIENT] EXPORTAÇÃO ES6 CORRIGIDA - Compatível com import()');

// Exportação individual das funções principais
export {
  chamarIASegura,
  selecionarModelo,
  verificarDisponibilidadeAPIs,
  testarConectividade,
  obterInformacoesUso,
  calcularCusto,
  chamarComRetry,
  adicionarMetrica,
  obterEstatisticas,
  resetarEstatisticas
};

// Exportação padrão para máxima compatibilidade
export default {
  chamarIASegura,
  selecionarModelo,
  verificarDisponibilidadeAPIs,
  testarConectividade,
  obterInformacoesUso,
  calcularCusto,
  chamarComRetry,
  adicionarMetrica,
  obterEstatisticas,
  resetarEstatisticas
};

console.log('🚀 [IA-CLIENT] Sistema de Cliente IA v7.7 - ROBUSTO E COMPLETO!');
