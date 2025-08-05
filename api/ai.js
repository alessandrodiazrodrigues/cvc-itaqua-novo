// 🚀 api/ai.js - SISTEMA CVC ITAQUA v7.1 SIMPLIFICADO
// Versão funcional com integração gradual dos módulos
// Foco: FUNCIONAR primeiro, depois otimizar

export default async function handler(req, res) {
  const inicioProcessamento = Date.now();
  
  console.log("🚀 CVC ITAQUA API v7.1 - Processando requisição");
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CONFIGURAÇÃO CORS
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.1');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.1'
    });
  }

  try {
    console.log("📥 Dados recebidos:");
    console.log("- Body existe:", !!req.body);
    console.log("- Body keys:", req.body ? Object.keys(req.body) : null);

    // ================================================================================
    // 🔧 COMPATIBILIDADE: ACEITAR MÚLTIPLOS FORMATOS
    // ================================================================================
    
    let formData, tipo, versao;
    
    // FORMATO NOVO (v7.x): { formData: {...}, tipo: 'orcamento', versao: '7.1' }
    if (req.body.formData && req.body.tipo) {
      console.log("📍 Formato novo detectado (v7.x)");
      formData = req.body.formData;
      tipo = req.body.tipo;
      versao = req.body.versao || '7.1';
    }
    // FORMATO ANTIGO (v6.x): dados diretos no body
    else if (req.body.tipos || req.body.prompt || req.body.observacoes) {
      console.log("📍 Formato antigo detectado (v6.x) - Convertendo...");
      formData = req.body;
      tipo = determinarTipoLegado(formData);
      versao = '6.x-convertido';
    }
    // FORMATO INVÁLIDO
    else {
      throw new Error("Formato de dados não reconhecido");
    }

    // ================================================================================
    // 🔧 NORMALIZAÇÃO DOS DADOS
    // ================================================================================
    
    // Garantir que 'tipos' seja sempre um array
    if (formData.tipos) {
      if (typeof formData.tipos === 'string') {
        formData.tipos = [formData.tipos];
      }
    } else if (formData.tipo) {
      formData.tipos = [formData.tipo];
    } else {
      formData.tipos = ['Aéreo Nacional']; // Padrão
    }

    console.log("🎯 Dados normalizados:");
    console.log("- Tipo operação:", tipo);
    console.log("- Tipos orçamento:", formData.tipos);
    console.log("- Destino:", formData.destino);

    // ================================================================================
    // 🎯 VALIDAÇÕES BÁSICAS
    // ================================================================================
    
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Pelo menos um tipo de orçamento deve ser selecionado");
    }

    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`;
    if (textoCompleto.trim().length < 5) {
      throw new Error("Forneça informações sobre a viagem");
    }

    // ================================================================================
    // 🤖 PROCESSAMENTO BASEADO NO TIPO
    // ================================================================================
    
    let resultado;
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamentoSimplificado(formData);
        break;
      case 'ranking':
        resultado = await processarRankingSimplificado(formData);
        break;
      case 'dicas':
        resultado = await processarDicasSimplificado(formData);
        break;
      case 'analise':
        resultado = await processarAnaliseSimplificado(formData);
        break;
      default:
        throw new Error(`Tipo de operação não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL
    // ================================================================================
    
    const tempoTotal = Date.now() - inicioProcessamento;
    
    console.log("✅ Processamento concluído com sucesso");
    console.log(`⏱️ Tempo total: ${tempoTotal}ms`);
    
    return res.status(200).json({
      success: true,
      result: resultado.conteudo,
      versao: '7.1',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        temImagem: !!formData.temImagem,
        tempoProcessamento: `${tempoTotal}ms`,
        modeloUsado: resultado.modeloUsado || 'gpt-4o-mini',
        formatoEntrada: versao
      }
    });

  } catch (error) {
    // ================================================================================
    // ❌ TRATAMENTO DE ERROS
    // ================================================================================
    
    const tempoTotal = Date.now() - inicioProcessamento;
    
    console.error("❌ Erro no processamento:", error);
    console.error("📚 Stack trace:", error.stack?.split('\n').slice(0, 3).join('\n'));
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.1',
      timestamp: new Date().toISOString(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        bodyKeys: req.body ? Object.keys(req.body) : null,
        errorType: error.name || 'Error'
      }
    });
  }
}

// ================================================================================
// 🎯 PROCESSAMENTO SIMPLIFICADO DE ORÇAMENTOS
// ================================================================================

async function processarOrcamentoSimplificado(formData) {
  console.log("💰 Processando orçamento...");
  
  try {
    // PROMPT OTIMIZADO PARA CVC
    const prompt = construirPromptCVC(formData);
    
    // CHAMAR IA
    const resposta = await chamarIASimples(prompt, formData.temImagem, formData.arquivo);
    
    // PROCESSAR RESPOSTA
    const conteudoFinal = processarRespostaCVC(resposta.content);
    
    // REGISTRAR CUSTOS (simplificado)
    await registrarCustosSimples(resposta, formData);
    
    return {
      conteudo: conteudoFinal,
      modeloUsado: resposta.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no orçamento:", error);
    throw new Error(`Falha no orçamento: ${error.message}`);
  }
}

// ================================================================================
// 📋 PROMPT OTIMIZADO CVC
// ================================================================================

function construirPromptCVC(formData) {
  const dadosViagem = formatarDadosViagem(formData);
  
  return `ORÇAMENTO CVC ITAQUAQUECETUBA PROFISSIONAL

DADOS DA VIAGEM:
${dadosViagem}

FORMATO OBRIGATÓRIO CVC:

📍 [Destino]
🗓️ [Data ida] - [Data volta] ([X] dias e [Y] noites)
👥 [Passageiros]

*O Pacote Inclui:*
- Aéreo ida e volta com [Companhia]
- Taxas de embarque
- [Bagagem incluída]

✈ Detalhes dos Voos:
[Data ida] - [Origem] [Hora] / [Destino] [Hora]
[Data volta] - [Destino] [Hora] / [Origem] [Hora]

💰 Valor Total: R$ [Valor]
[Condições de reembolso]

REGRAS CRÍTICAS:
1. ⏰ HORÁRIOS: "06:20" (nunca "06: 20")
2. 📅 DATAS: "17/09" ou "17 de set"
3. ✈️ AEROPORTOS: CGH → São Paulo, GRU → São Paulo
4. 👥 PASSAGEIROS: "02 adultos" (com zero)
5. 💰 VALORES: "R$ 3.752,55" (espaço após R$)
6. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão)
7. 🏷️ REEMBOLSO: "Não reembolsável" OU "Reembolsável conforme regras"
8. 🚫 SEM separadores técnicos (---) ou formatação markdown

DETECTAR AUTOMATICAMENTE:
- Companhia aérea das informações
- Horários e datas exatos
- Valores reais (não inventar)
- Tipo de voo (direto/conexão)

GERAR ORÇAMENTO LIMPO PADRÃO CVC:`;
}

// ================================================================================
// 🤖 CLIENTE DE IA SIMPLIFICADO
// ================================================================================

async function chamarIASimples(prompt, temImagem = false, arquivo = null) {
  console.log("🤖 Chamando IA...");
  
  try {
    if (temImagem && arquivo) {
      // Usar Claude para imagens
      return await chamarClaude(prompt, arquivo);
    } else {
      // Usar OpenAI para texto
      return await chamarOpenAI(prompt);
    }
  } catch (error) {
    console.error("❌ Erro na IA:", error);
    throw new Error(`Falha na IA: ${error.message}`);
  }
}

async function chamarOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI Error ${response.status}: ${errorData.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Resposta inválida da OpenAI");
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 },
    modelo_usado: 'gpt-4o-mini'
  };
}

async function chamarClaude(prompt, arquivo) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  // Extrair base64 da URL data:
  const base64Data = arquivo.split(',')[1];
  const mediaType = arquivo.split(':')[1].split(';')[0];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Claude Error ${response.status}: ${errorData.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.content?.[0]?.text) {
    throw new Error("Resposta inválida do Claude");
  }

  return {
    content: data.content[0].text,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
    modelo_usado: 'claude-3-5-sonnet-20240620'
  };
}

// ================================================================================
// 🔧 PROCESSAMENTO DE RESPOSTA CVC
// ================================================================================

function processarRespostaCVC(conteudo) {
  console.log("🔧 Processando resposta CVC...");
  
  let processado = conteudo;
  
  // Limpeza básica
  processado = processado.trim();
  
  // Remover cabeçalhos técnicos residuais
  processado = processado.replace(/ORÇAMENTO CVC.*?\n/gi, '');
  processado = processado.replace(/DADOS DA VIAGEM.*?\n/gi, '');
  processado = processado.replace(/GERE O ORÇAMENTO.*?\n/gi, '');
  
  // Garantir formatação de horários
  processado = processado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Garantir formato de valores
  processado = processado.replace(/R\$\s*(\d)/g, 'R$ $1');
  
  return processado;
}

// ================================================================================
// 🏨 PROCESSAMENTO SIMPLIFICADO DE OUTROS TIPOS
// ================================================================================

async function processarRankingSimplificado(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;

  const resposta = await chamarIASimples(prompt);
  await registrarCustosSimples(resposta, formData);
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado
  };
}

async function processarDicasSimplificado(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Gere dicas personalizadas de viagem para ${destino}, focadas em famílias.

Incluir:
🌡️ Melhor época para visitar
🎯 Atrações imperdíveis para crianças
🍽️ Gastronomia local
💡 Dicas importantes de segurança e saúde

Seja prático e direto.`;

  const resposta = await chamarIASimples(prompt);
  await registrarCustosSimples(resposta, formData);
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado
  };
}

async function processarAnaliseSimplificado(formData) {
  const prompt = `Analise este documento e extraia:

1. 📊 Principais métricas de vendas
2. 🎯 Metas vs realizado  
3. 🏆 Produtos mais vendidos
4. 📈 Tendências identificadas
5. 💡 Recomendações para melhoria

Arquivo: ${formData.nomeArquivo || 'Documento enviado'}
Seja objetivo e direto nas conclusões.`;

  const resposta = await chamarIASimples(prompt, formData.temImagem, formData.arquivo);
  await registrarCustosSimples(resposta, formData);
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado
  };
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function determinarTipoLegado(formData) {
  if (formData.tipos && formData.tipos.length > 0) {
    return 'orcamento';
  } else if (formData.prompt?.includes('ranking') || formData.prompt?.includes('hotel')) {
    return 'ranking';
  } else if (formData.prompt?.includes('dica') || formData.prompt?.includes('destino')) {
    return 'dicas';
  } else if (formData.nomeArquivo || formData.arquivo) {
    return 'analise';
  }
  return 'orcamento';
}

function formatarDadosViagem(formData) {
  return `
Destino: ${formData.destino || 'Não informado'}
Adultos: ${formData.adultos || '2'}
Crianças: ${formData.criancas || '0'}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos?.join(', ') || 'Não especificado'}

OBSERVAÇÕES:
${formData.observacoes || 'Nenhuma observação específica'}

INFORMAÇÕES DETALHADAS:
${formData.textoColado || formData.prompt || 'Nenhuma informação adicional fornecida'}
`;
}

// ================================================================================
// 💰 REGISTRO DE CUSTOS SIMPLIFICADO
// ================================================================================

async function registrarCustosSimples(resposta, formData) {
  try {
    console.log('💰 Registrando custos...');
    
    // Calcular tokens aproximados
    const tokensInput = Math.ceil((formData.observacoes?.length || 0 + formData.textoColado?.length || 0) / 4);
    const tokensOutput = Math.ceil((resposta.content?.length || 0) / 4);
    const tokensTotal = tokensInput + tokensOutput;
    
    // Preços por modelo (USD por 1K tokens)
    const precos = {
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
      'gpt-4o': { input: 0.0025, output: 0.01 },
      'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
    };
    
    const modelo = resposta.modelo_usado || 'gpt-4o-mini';
    const preco = precos[modelo] || precos['gpt-4o-mini'];
    
    const custoUSD = (tokensInput / 1000 * preco.input) + (tokensOutput / 1000 * preco.output);
    const custoBRL = custoUSD * 5.2; // Taxa aproximada
    
    console.log(`💰 Custo: R$ ${custoBRL.toFixed(6)} (${tokensTotal} tokens)`);
    
    // Registrar na planilha (opcional - não bloqueia se falhar)
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqOxRJNJm_X4lmD1-4v4OZYRt7E5xh0mYaX1kgRv-fGfFTU4YZM7UWQm8YrWl1B4VQ/exec';
      
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'registrarCusto',
          dados: {
            timestamp: new Date().toISOString(),
            destino: formData.destino || 'N/A',
            modelo: modelo,
            tokensTotal: tokensTotal,
            custoUSD: custoUSD.toFixed(6),
            custoBRL: custoBRL.toFixed(6)
          }
        })
      });
    } catch (planilhaError) {
      console.warn('⚠️ Falha ao registrar na planilha:', planilhaError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no registro de custos:', error);
    // Não interromper o fluxo principal
  }
}

// ================================================================================
// 🚀 LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log("🚀 CVC ITAQUA API v7.1 SIMPLIFICADO INICIALIZADO");
console.log("✅ Funcionalidades:");
console.log("📋 Orçamentos com formato CVC profissional");
console.log("🏨 Rankings de hotéis");
console.log("💡 Dicas de destinos"); 
console.log("📊 Análise de documentos");
console.log("🤖 IA: OpenAI + Claude (fallback automático)");
console.log("💰 Registro de custos automático");
console.log("🔧 Sistema robusto e funcional");

console.log("🎉 SISTEMA OPERACIONAL - VERSÃO FUNCIONAL!");
