// 🚀 api/ai.js - SISTEMA CVC ITAQUA v7.3 FUNCIONAL
// Volta ao que funcionava + organização modular interna
// Correções dos problemas identificados

export default async function handler(req, res) {
  const inicio = Date.now();
  
  console.log("🚀 CVC ITAQUA API v7.3 - Sistema Funcional Organizado");
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CONFIGURAÇÃO CORS
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.3');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.3'
    });
  }

  try {
    console.log("📥 Dados recebidos:", req.body ? Object.keys(req.body) : null);

    // ================================================================================
    // 🔧 NORMALIZAÇÃO DE DADOS
    // ================================================================================
    
    let formData, tipo;
    
    if (req.body.formData && req.body.tipo) {
      formData = req.body.formData;
      tipo = req.body.tipo;
      console.log("📍 Formato v7.x detectado");
    } else if (req.body.tipos || req.body.observacoes) {
      formData = req.body;
      tipo = 'orcamento';
      console.log("📍 Formato legado convertido");
    } else {
      throw new Error("Formato de dados não reconhecido");
    }

    // Normalizar tipos
    if (formData.tipos) {
      formData.tipos = Array.isArray(formData.tipos) ? formData.tipos : [formData.tipos];
    } else {
      formData.tipos = ['Aéreo Nacional'];
    }

    console.log("🎯 Processando:", { tipo, tipos: formData.tipos, destino: formData.destino });

    // Validação básica
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Pelo menos um tipo deve ser selecionado");
    }

    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`;
    if (textoCompleto.trim().length < 5) {
      throw new Error("Forneça informações sobre a viagem");
    }

    // ================================================================================
    // 🎯 PROCESSAMENTO BASEADO NO TIPO
    // ================================================================================
    
    let resultado;
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamentoCompleto(formData);
        break;
      case 'ranking':
        resultado = await processarRanking(formData);
        break;
      case 'dicas':
        resultado = await processarDicas(formData);
        break;
      case 'analise':
        resultado = await processarAnalise(formData);
        break;
      default:
        throw new Error(`Tipo não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL
    // ================================================================================
    
    const tempoTotal = Date.now() - inicio;
    
    console.log("✅ Processamento concluído");
    console.log(`⏱️ Tempo: ${tempoTotal}ms`);
    
    return res.status(200).json({
      success: true,
      result: resultado.conteudo,
      versao: '7.3',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        tempoProcessamento: `${tempoTotal}ms`,
        templateUsado: resultado.templateUsado || 'basico',
        modeloUsado: resultado.modeloUsado || 'gpt-4o-mini'
      }
    });

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    
    console.error("❌ Erro:", error);
    console.error("📚 Stack:", error.stack?.split('\n').slice(0, 3).join('\n'));
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.3',
      timestamp: new Date().toISOString(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        bodyKeys: req.body ? Object.keys(req.body) : null
      }
    });
  }
}

// ================================================================================
// 💰 PROCESSAMENTO COMPLETO DE ORÇAMENTOS
// ================================================================================

async function processarOrcamentoCompleto(formData) {
  console.log("💰 Processando orçamento completo...");
  
  try {
    // ETAPA 1: Análise inteligente
    const analise = analisarTextoInteligente(formData);
    console.log(`📊 Análise: ${analise.tipoDetectado}, múltiplas: ${analise.multiplasOpcoes}`);
    
    // ETAPA 2: Aplicar template correto
    const template = selecionarTemplateInteligente(analise, formData);
    const prompt = construirPromptOtimizado(formData, template, analise);
    
    console.log(`📋 Template: ${template.nome}`);
    
    // ETAPA 3: Chamar IA
    const resposta = await chamarIA(prompt, formData.temImagem, formData.arquivo);
    
    // ETAPA 4: Processar resposta com correções
    const conteudoFinal = processarRespostaCorrigida(resposta.content, template, analise);
    
    // ETAPA 5: Registrar custos
    await registrarCustos(resposta, formData, template.nome);
    
    return {
      conteudo: conteudoFinal,
      templateUsado: template.nome,
      modeloUsado: resposta.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no orçamento:", error);
    throw new Error(`Falha no orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🔍 ANÁLISE INTELIGENTE (CORRIGIDA)
// ================================================================================

function analisarTextoInteligente(formData) {
  const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`.toLowerCase();
  
  console.log("🔍 Analisando texto:", textoCompleto.substring(0, 100) + "...");
  
  // CORREÇÃO 1: Detecção melhorada de múltiplas opções
  const multiplasOpcoes = 
    textoCompleto.includes('opção 1') || textoCompleto.includes('opção 2') ||
    textoCompleto.includes('passageiro 1') || textoCompleto.includes('passageiro 2') ||
    (textoCompleto.match(/r\$\s*\d+[\.,]\d+/g) || []).length >= 2 ||
    (textoCompleto.match(/\d{1,3}[\.,]\d{3}[\.,]\d{2}/g) || []).length >= 2;
  
  // CORREÇÃO 2: Detecção melhorada de cruzeiros
  const ehCruzeiro = 
    textoCompleto.includes('cruzeiro') || textoCompleto.includes('msc') || 
    textoCompleto.includes('costa') || textoCompleto.includes('navio') ||
    textoCompleto.includes('embarque: santos') || textoCompleto.includes('cabine') ||
    textoCompleto.includes('desembarque: santos');
  
  // Detecção de outros tipos
  const ehHotel = textoCompleto.includes('hotel') || textoCompleto.includes('resort');
  const ehMultitrecho = textoCompleto.includes('trecho') || textoCompleto.includes('multitrecho');
  
  // Determinar tipo principal
  let tipoDetectado = 'aereo_ida_volta';
  if (ehCruzeiro) tipoDetectado = 'cruzeiro';
  else if (multiplasOpcoes) tipoDetectado = 'multiplas_opcoes';
  else if (ehHotel) tipoDetectado = 'hotel';
  else if (ehMultitrecho) tipoDetectado = 'multitrecho';
  
  const quantidadeOpcoes = Math.max(
    (textoCompleto.match(/opção\s+\d+/g) || []).length,
    (textoCompleto.match(/passageiro\s+\d+/g) || []).length,
    (textoCompleto.match(/r\$\s*\d+[\.,]\d+/g) || []).length,
    1
  );
  
  return {
    tipoDetectado,
    multiplasOpcoes,
    quantidadeOpcoes,
    ehCruzeiro,
    ehHotel,
    ehMultitrecho,
    tamanhoTexto: textoCompleto.length
  };
}

// ================================================================================
// 📋 SELEÇÃO INTELIGENTE DE TEMPLATES (CORRIGIDA)
// ================================================================================

function selecionarTemplateInteligente(analise, formData) {
  console.log("📋 Selecionando template para:", analise.tipoDetectado);
  
  if (analise.ehCruzeiro) {
    return {
      nome: 'cruzeiro',
      template: TEMPLATE_CRUZEIRO_CORRIGIDO
    };
  }
  
  if (analise.multiplasOpcoes) {
    return {
      nome: `multiplas_opcoes_${analise.quantidadeOpcoes}`,
      template: TEMPLATE_MULTIPLAS_OPCOES_CORRIGIDO
    };
  }
  
  if (analise.ehHotel) {
    return {
      nome: 'hotel',
      template: TEMPLATE_HOTEL
    };
  }
  
  // Template padrão (ida e volta)
  return {
    nome: 'ida_volta',
    template: TEMPLATE_IDA_VOLTA_CORRIGIDO
  };
}

// ================================================================================
// 📋 TEMPLATES CORRIGIDOS
// ================================================================================

const TEMPLATE_CRUZEIRO_CORRIGIDO = `
ORÇAMENTO CRUZEIRO CVC ITAQUAQUECETUBA

DADOS: {dadosViagem}

FORMATO OBRIGATÓRIO CRUZEIRO:

🚢 Cruzeiro [NAVIO] – [DURACAO] noites
👥 [PASSAGEIROS]
📅 Embarque: [DATA] ([PORTO])
🌊 Roteiro: [ROTEIRO]

💰 Opções de Cabines:
**CABINE INTERNA** - R$ [VALOR] por pessoa
**CABINE EXTERNA** - R$ [VALOR] por pessoa
**CABINE VARANDA** - R$ [VALOR] por pessoa

Taxas: R$ [TAXAS] total
💰 Valor Total: R$ [VALOR_TOTAL]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas portuárias, bebidas, excursões

IMPORTANTE: Este é um CRUZEIRO, NÃO um voo. NÃO mencionar aeroportos ou detalhes de voos.
PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda)`;

const TEMPLATE_MULTIPLAS_OPCOES_CORRIGIDO = `
ORÇAMENTO MÚLTIPLAS OPÇÕES CVC ITAQUAQUECETUBA

DADOS: {dadosViagem}

FORMATO OBRIGATÓRIO MÚLTIPLAS OPÇÕES:

📍 [Destino]
🗓️ [Datas] ([X] dias e [Y] noites)
👥 [PASSAGEIROS]

**OPÇÃO 1:** R$ [VALOR_1]
✈ [COMPANHIA] - [ORIGEM] [HORA] / [DESTINO] [HORA]
✈ [COMPANHIA] - [DESTINO] [HORA] / [ORIGEM] [HORA]
✅ [BAGAGEM_1]

**OPÇÃO 2:** R$ [VALOR_2]
✈ [COMPANHIA] - [ORIGEM] [HORA] / [DESTINO] [HORA]
✈ [COMPANHIA] - [DESTINO] [HORA] / [ORIGEM] [HORA]
✅ [BAGAGEM_2]

IMPORTANTE: Detectar e apresentar TODAS as opções com preços diferentes.
PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda)`;

const TEMPLATE_IDA_VOLTA_CORRIGIDO = `
ORÇAMENTO CVC ITAQUAQUECETUBA

DADOS: {dadosViagem}

FORMATO OBRIGATÓRIO:

📍 [Destino]
🗓️ [Datas] ([X] dias e [Y] noites)
👥 [PASSAGEIROS]

*O Pacote Inclui:*
- Aéreo ida e volta com [Companhia]
- Taxas de embarque
- [Bagagem incluída]

✈ Detalhes dos Voos:
[Data ida] - [Origem] [Hora] / [Destino] [Hora]
[Data volta] - [Destino] [Hora] / [Origem] [Hora]

💰 Valor Total: R$ [Valor]
[Condições]

PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda)`;

const TEMPLATE_HOTEL = `
ORÇAMENTO HOTEL CVC ITAQUAQUECETUBA

DADOS: {dadosViagem}

FORMATO OBRIGATÓRIO:

🏨 [NOME_HOTEL] - [CATEGORIA]
📍 [CIDADE/REGIÃO]
🗓️ [DATAS] ([X] diárias)
👥 [PASSAGEIROS]

🛏️ Acomodação: [TIPO_QUARTO]
🍽️ Regime: [PENSAO]
✅ Facilidades: [SERVICOS]

💰 Valor Total: R$ [VALOR]

PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda)`;

// ================================================================================
// 📋 CONSTRUÇÃO DE PROMPT OTIMIZADA
// ================================================================================

function construirPromptOtimizado(formData, template, analise) {
  const dadosViagem = formatarDadosViagem(formData);
  const promptBase = template.template.replace('{dadosViagem}', dadosViagem);
  
  const promptCompleto = `${promptBase}

REGRAS CRÍTICAS CVC:
1. ⏰ HORÁRIOS: "07:55" (nunca "07: 55")
2. 📅 DATAS: "17 de set" ou "17/09" 
3. ✈️ AEROPORTOS: CGH → São Paulo, GRU → São Paulo
4. 👥 PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda, nunca "002")
5. 💰 VALORES: "R$ 3.752,55" (espaço após R$)
6. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão)
7. 🏷️ REEMBOLSO: "Não reembolsável" OU "Reembolsável conforme regras"
8. 🚫 PROIBIDO: separadores (---), formatação markdown

ANÁLISE DETECTADA:
- Tipo: ${analise.tipoDetectado}
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Quantidade: ${analise.quantidadeOpcoes}
- É cruzeiro: ${analise.ehCruzeiro ? 'SIM' : 'NÃO'}

GERAR ORÇAMENTO PROFISSIONAL:`;

  return promptCompleto;
}

// ================================================================================
// 🔧 PROCESSAMENTO COM CORREÇÕES
// ================================================================================

function processarRespostaCorrigida(conteudo, template, analise) {
  console.log(`🔧 Processando resposta (template: ${template.nome})...`);
  
  let processado = conteudo.trim();
  
  // Limpeza geral
  processado = processado.replace(/ORÇAMENTO CVC.*?\n/gi, '');
  processado = processado.replace(/DADOS.*?\n/gi, '');
  processado = processado.replace(/FORMATO.*?\n/gi, '');
  processado = processado.replace(/REGRAS.*?\n/gi, '');
  processado = processado.replace(/GERAR.*?\n/gi, '');
  
  // CORREÇÃO PRINCIPAL: Formato de passageiros
  processado = processado.replace(/(\d+)\s+(adulto|criança)/g, (match, num, tipo) => {
    // Se é um dígito, adicionar um zero à esquerda
    if (num.length === 1) {
      return `0${num} ${tipo}`;
    }
    // Se já tem dois ou mais dígitos, manter como está
    return `${num} ${tipo}`;
  });
  
  // Corrigir formato incorreto específico (002 → 02, 003 → 03, etc)
  processado = processado.replace(/0{2,}(\d)\s+(adulto|criança)/g, '0$1 $2');
  
  // Outras correções de formatação
  processado = processado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2'); // Horários
  processado = processado.replace(/R\$\s*(\d)/g, 'R$ $1'); // Valores
  processado = processado.replace(/\n\s*\n\s*\n/g, '\n\n'); // Linhas extras
  
  // Correções específicas por template
  if (template.nome === 'cruzeiro') {
    // Remover menções a voos se for cruzeiro
    processado = processado.replace(/✈.*?\n/g, '');
    processado = processado.replace(/.*aeroporto.*?\n/gi, '');
    processado = processado.replace(/.*voo.*?\n/gi, '');
  }
  
  return processado;
}

// ================================================================================
// 🤖 CLIENTE DE IA
// ================================================================================

async function chamarIA(prompt, temImagem = false, arquivo = null) {
  console.log("🤖 Chamando IA...");
  
  try {
    if (temImagem && arquivo && process.env.ANTHROPIC_API_KEY) {
      return await chamarClaude(prompt, arquivo);
    } else {
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
// 🏨 OUTROS PROCESSAMENTOS
// ================================================================================

async function processarRanking(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais`;

  const resposta = await chamarIA(prompt);
  return { conteudo: resposta.content, modeloUsado: resposta.modelo_usado };
}

async function processarDicas(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Dicas de viagem para ${destino}, focadas em famílias.

🌡️ Melhor época para visitar
🎯 Atrações imperdíveis para crianças
🍽️ Gastronomia local
💡 Dicas importantes`;

  const resposta = await chamarIA(prompt);
  return { conteudo: resposta.content, modeloUsado: resposta.modelo_usado };
}

async function processarAnalise(formData) {
  const prompt = `Analise este documento e extraia as principais informações.`;
  const resposta = await chamarIA(prompt, formData.temImagem, formData.arquivo);
  return { conteudo: resposta.content, modeloUsado: resposta.modelo_usado };
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function formatarDadosViagem(formData) {
  return `
Destino: ${formData.destino || 'Não informado'}
Adultos: ${formData.adultos || '2'}
Crianças: ${formData.criancas || '0'}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos: ${formData.tipos?.join(', ') || 'Não especificado'}

OBSERVAÇÕES:
${formData.observacoes || 'Nenhuma observação'}

INFORMAÇÕES:
${formData.textoColado || formData.prompt || 'Nenhuma informação adicional'}
`;
}

async function registrarCustos(resposta, formData, template) {
  try {
    console.log('💰 Registrando custos...');
    
    const tokensTotal = (resposta.usage?.prompt_tokens || 0) + (resposta.usage?.completion_tokens || 0);
    const custoUSD = tokensTotal * 0.0001; // Aproximação
    const custoBRL = custoUSD * 5.2;
    
    console.log(`💰 Custo: R$ ${custoBRL.toFixed(6)} (${tokensTotal} tokens) - Template: ${template}`);
    
  } catch (error) {
    console.error('❌ Erro ao registrar custos:', error);
  }
}

console.log("🚀 CVC API v7.3 - Sistema Funcional Organizado Inicializado");
console.log("✅ Correções implementadas:");
console.log("- 🔧 Detecção melhorada de múltiplas opções e cruzeiros");
console.log("- 👥 Formato correto de passageiros (02 adultos)");
console.log("- 📋 Templates específicos por tipo");
console.log("- 🎯 Análise inteligente de conteúdo");
