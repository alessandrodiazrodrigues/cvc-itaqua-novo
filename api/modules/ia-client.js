// ================================================================================
// 🤖 IA-CLIENT.JS - CLIENTE DE IA (OPENAI + CLAUDE)
// ================================================================================
// Responsável por: Chamadas para OpenAI, Claude, fallbacks, seleção de modelo
// ================================================================================

import { MAX_TOKENS } from './config.js';

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL: CHAMAR IA COM SEGURANÇA
// ================================================================================

export async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  console.log('[IA-CLIENT] Iniciando chamada segura...', { modelo, temImagem });
  
  try {
    if (temImagem === true) {
      console.log('[IA-CLIENT] Chamando Claude para análise de imagem...');
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      console.log('[IA-CLIENT] Chamando OpenAI para processamento de texto...');
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ [IA-CLIENT] Falha no modelo principal ${modelo}:`, erro1.message);
    
    // ================================================================================
    // 🔄 SISTEMA DE FALLBACK INTELIGENTE
    // ================================================================================
    
    if (temImagem === true) {
      console.warn(`⚠️ [IA-CLIENT] Claude falhou, tentando GPT-4o com visão...`);
      try {
        return await chamarOpenAI(prompt, true, arquivo, 'gpt-4o');
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] GPT-4o também falhou:`, erro2.message);
        throw new Error(`Ambos os modelos de imagem falharam: Claude (${erro1.message}) | GPT-4o (${erro2.message})`);
      }
    } else {
      console.warn(`⚠️ [IA-CLIENT] Tentando fallback com ${fallbackModelo}...`);
      try {
        return await chamarOpenAI(prompt, false, null, fallbackModelo);
      } catch (erro2) {
        console.error(`❌ [IA-CLIENT] Fallback também falhou:`, erro2.message);
        throw new Error(`Ambos os modelos de texto falharam: ${modelo} (${erro1.message}) | ${fallbackModelo} (${erro2.message})`);
      }
    }
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

  const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
  if (!base64Match) {
    throw new Error('Formato de imagem base64 inválido para Claude');
  }

  const content = [
    { type: "text", text: prompt },
    { type: "image", source: { type: "base64", media_type: base64Match[1], data: base64Match[2] } }
  ];

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
      max_tokens: MAX_TOKENS,
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
    modelo_usado: modelo
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
    modelo_usado: modelo
  };
}

// ================================================================================
// 🎯 FUNÇÃO: SELEÇÃO INTELIGENTE DE MODELO
// ================================================================================

export function selecionarModelo(temImagem) {
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

// ================================================================================
// 🔧 FUNÇÃO: VERIFICAR DISPONIBILIDADE DAS APIs
// ================================================================================

export function verificarDisponibilidadeAPIs() {
  const status = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY
  };
  
  console.log('[IA-CLIENT] Status das APIs:', status);
  
  return status;
}

// ================================================================================
// 🎯 FUNÇÃO: TESTE DE CONECTIVIDADE
// ================================================================================

export async function testarConectividade() {
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
      console.log('[IA-CLIENT] ✅ OpenAI conectada');
    } catch (error) {
      resultados.erros.push(`OpenAI: ${error.message}`);
      console.log('[IA-CLIENT] ❌ OpenAI falhou');
    }
  }
  
  // Testar Anthropic (só se necessário)
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('[IA-CLIENT] ✅ Anthropic configurada (não testando conectividade)');
    resultados.anthropic = true;
  }
  
  return resultados;
}

// ================================================================================
// 🔧 FUNÇÃO: OBTER INFORMAÇÕES DE USO
// ================================================================================

export function obterInformacoesUso(resultado) {
  const usage = resultado.usage || {};
  
  return {
    modelo: resultado.modelo_usado || 'desconhecido',
    tokens_input: usage.input_tokens || usage.prompt_tokens || 0,
    tokens_output: usage.output_tokens || usage.completion_tokens || 0,
    tokens_total: (usage.input_tokens || usage.prompt_tokens || 0) + 
                  (usage.output_tokens || usage.completion_tokens || 0)
  };
}

console.log('✅ [IA-CLIENT] Módulo de cliente IA carregado');
console.log('🤖 [IA-CLIENT] Suporte: OpenAI (texto/imagem) + Claude (imagem)');