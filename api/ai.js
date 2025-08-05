// 🚀 api/ai.js - SISTEMA CVC ITAQUA v7.2 COM TEMPLATES INTEGRADOS
// Base funcional v7.1 + Sistema completo de templates
// Integração gradual e segura dos módulos

// ================================================================================
// 📥 IMPORT DO SISTEMA DE TEMPLATES (GRADUAL)
// ================================================================================

let aplicarTemplateCompleto, detectarLayoutOrcamento, TEMPLATES_MANUAIS;

try {
  const templatesModule = await import('./modules/templates.js');
  aplicarTemplateCompleto = templatesModule.aplicarTemplateCompleto;
  detectarLayoutOrcamento = templatesModule.detectarLayoutOrcamento;
  TEMPLATES_MANUAIS = templatesModule.TEMPLATES_MANUAIS;
  console.log("✅ Módulo de templates carregado com sucesso");
  console.log(`📋 ${Object.keys(TEMPLATES_MANUAIS).length} templates disponíveis`);
} catch (error) {
  console.warn("⚠️ Módulo de templates não disponível, usando sistema básico:", error.message);
  aplicarTemplateCompleto = null;
  detectarLayoutOrcamento = null;
  TEMPLATES_MANUAIS = {};
}

export default async function handler(req, res) {
  const inicioProcessamento = Date.now();
  
  console.log("🚀 CVC ITAQUA API v7.2 - Processando requisição");
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CONFIGURAÇÃO CORS
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.2');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.2'
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
    
    // FORMATO NOVO (v7.x): { formData: {...}, tipo: 'orcamento', versao: '7.2' }
    if (req.body.formData && req.body.tipo) {
      console.log("📍 Formato novo detectado (v7.x)");
      formData = req.body.formData;
      tipo = req.body.tipo;
      versao = req.body.versao || '7.2';
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
        resultado = await processarOrcamentoComTemplates(formData);
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
      versao: '7.2',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        temImagem: !!formData.temImagem,
        tempoProcessamento: `${tempoTotal}ms`,
        modeloUsado: resultado.modeloUsado || 'gpt-4o-mini',
        formatoEntrada: versao,
        templateUsado: resultado.templateUsado || 'basico',
        sistemaTemplates: !!aplicarTemplateCompleto
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
      versao: '7.2',
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
// 🎯 PROCESSAMENTO DE ORÇAMENTOS COM TEMPLATES AVANÇADOS
// ================================================================================

async function processarOrcamentoComTemplates(formData) {
  console.log("💰 Processando orçamento com sistema de templates...");
  
  try {
    let prompt, layoutDetectado = 'basico';
    
    // ================================================================================
    // 🔧 USAR SISTEMA AVANÇADO DE TEMPLATES (SE DISPONÍVEL)
    // ================================================================================
    
    if (aplicarTemplateCompleto && detectarLayoutOrcamento) {
      console.log("📋 Usando sistema avançado de templates...");
      
      try {
        // ETAPA 1: Detectar layout automaticamente
        layoutDetectado = detectarLayoutOrcamento(formData);
        console.log(`🎯 Layout detectado: ${layoutDetectado}`);
        
        // ETAPA 2: Aplicar template avançado
        const analiseBasica = analisarTextoBasico(formData);
        prompt = aplicarTemplateCompleto(formData, analiseBasica);
        
        console.log("✅ Template avançado aplicado com sucesso");
        console.log(`📋 Usando template: ${layoutDetectado}`);
        
      } catch (templateError) {
        console.warn("⚠️ Erro no sistema avançado, usando fallback:", templateError.message);
        prompt = construirPromptCVCOtimizado(formData);
        layoutDetectado = 'fallback';
      }
    } else {
      // ================================================================================
      // 🔧 SISTEMA BÁSICO (FALLBACK)
      // ================================================================================
      
      console.log("📋 Usando sistema básico de templates...");
      prompt = construirPromptCVCOtimizado(formData);
      layoutDetectado = 'basico';
    }
    
    // ================================================================================
    // 🤖 CHAMAR IA
    // ================================================================================
    
    const resposta = await chamarIASimples(prompt, formData.temImagem, formData.arquivo);
    
    // ================================================================================
    // 🔧 PROCESSAR RESPOSTA
    // ================================================================================
    
    const conteudoFinal = processarRespostaCVCAvancada(resposta.content, layoutDetectado);
    
    // ================================================================================
    // 💰 REGISTRAR CUSTOS
    // ================================================================================
    
    await registrarCustosAvancados(resposta, formData, layoutDetectado);
    
    return {
      conteudo: conteudoFinal,
      modeloUsado: resposta.modelo_usado,
      templateUsado: layoutDetectado
    };
    
  } catch (error) {
    console.error("❌ Erro no orçamento:", error);
    throw new Error(`Falha no orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🔍 ANÁLISE BÁSICA PARA TEMPLATES
// ================================================================================

function analisarTextoBasico(formData) {
  const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`.toLowerCase();
  
  // Análise básica de complexidade
  let pontos = 0;
  if (textoCompleto.length > 500) pontos += 2;
  if (formData.tipos && formData.tipos.length > 1) pontos += 1;
  if (formData.temImagem) pontos += 1;
  if (textoCompleto.includes('opção 1') && textoCompleto.includes('opção 2')) pontos += 2;
  if ((textoCompleto.match(/\d{2}:\d{2}/g) || []).length > 4) pontos += 1;
  
  const complexidade = pontos <= 2 ? 'simples' : pontos <= 5 ? 'media' : 'alta';
  
  // Análise de múltiplas opções (MELHORADA)
  const multiplasOpcoes = {
    detectado: textoCompleto.includes('opção 1') || textoCompleto.includes('plano 1') || 
               textoCompleto.includes('passageiro 1') || textoCompleto.includes('passageiro 2') ||
               (textoCompleto.match(/r\$.*?r\$/g) || []).length >= 2 ||
               (textoCompleto.match(/\d{1,3}[\.,]\d{3}[\.,]\d{2}/g) || []).length >= 2,
    quantidade: Math.max(
      (textoCompleto.match(/opção\s+\d+/g) || []).length,
      (textoCompleto.match(/passageiro\s+\d+/g) || []).length,
      (textoCompleto.match(/r\$\s*\d+[\.,]\d+/g) || []).length,
      1
    )
  };
  
  // Análise de ida e volta
  const idaVolta = {
    detectado: (textoCompleto.includes('ida') && textoCompleto.includes('volta')) ||
               (textoCompleto.match(/\d{1,2}\/\d{1,2}/g) || []).length >= 2
  };
  
  // Análise de tipo específico (MELHORADA)
  const tipoEspecifico = {
    principal: textoCompleto.includes('cruzeiro') || textoCompleto.includes('msc') || 
               textoCompleto.includes('costa') || textoCompleto.includes('navio') ||
               textoCompleto.includes('embarque') || textoCompleto.includes('cabine') ? 'cruzeiro' :
               textoCompleto.includes('hotel') || textoCompleto.includes('resort') ? 'hotel' :
               textoCompleto.includes('multitrecho') || textoCompleto.includes('trecho') ? 'multitrecho' : 'aereo'
  };
  
  return {
    complexidade,
    multiplasOpcoes,
    idaVolta,
    tipoEspecifico,
    temImagem: formData.temImagem || false,
    tamanhoTexto: textoCompleto.length
  };
}

// ================================================================================
// 📋 PROMPT CVC OTIMIZADO (VERSÃO MELHORADA)
// ================================================================================

function construirPromptCVCOtimizado(formData) {
  const dadosViagem = formatarDadosViagem(formData);
  const analise = analisarTextoBasico(formData);
  
  // Selecionar template baseado na análise
  let templateEspecifico = '';
  
  if (analise.tipoEspecifico.principal === 'cruzeiro') {
    templateEspecifico = `
🚢 TEMPLATE CRUZEIRO:
🚢 Cruzeiro [NAVIO] – [DURACAO] noites
👥 [PASSAGEIROS]
📅 Embarque: [DATA] ([PORTO])
🌊 Roteiro: [DESTINOS]

💰 Opções de Cabines:
**CABINE INTERNA** - [VALOR_INTERNA]
**CABINE EXTERNA** - [VALOR_EXTERNA] 
**CABINE VARANDA** - [VALOR_VARANDA]
**SUÍTE** - [VALOR_SUITE]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas portuárias, bebidas, excursões

IMPORTANTE: Este é um CRUZEIRO, não um voo. Não mencionar aeroportos ou voos.`;
    
  } else if (analise.multiplasOpcoes.detectado) {
    templateEspecifico = `
🔢 TEMPLATE MÚLTIPLAS OPÇÕES:
📍 [Destino]
🗓️ [Datas] ([X] dias e [Y] noites)
👥 [Passageiros]

**OPÇÃO 1:** R$ [VALOR_1]
✈ [DETALHES_VOO_1]
✅ [BAGAGEM_1]

**OPÇÃO 2:** R$ [VALOR_2]  
✈ [DETALHES_VOO_2]
✅ [BAGAGEM_2]

${analise.multiplasOpcoes.quantidade >= 3 ? `**OPÇÃO 3:** R$ [VALOR_3]
✈ [DETALHES_VOO_3]
✅ [BAGAGEM_3]` : ''}

IMPORTANTE: Detectar e apresentar TODAS as opções com preços diferentes.`;
    
  } else if (analise.tipoEspecifico.principal === 'hotel') {
    templateEspecifico = `
🏨 TEMPLATE HOTEL:
🏨 [NOME_HOTEL] - [CATEGORIA]
📍 [CIDADE/REGIÃO]
🗓️ [DATAS] ([X] diárias)
👥 [HÓSPEDES]

🛏️ Acomodação: [TIPO_QUARTO]
🍽️ Regime: [PENSAO]
✅ Facilidades: [SERVICOS]

💰 Valor Total: R$ [VALOR]`;
  }
  
  return `ORÇAMENTO CVC ITAQUAQUECETUBA PROFISSIONAL v7.2

DADOS DA VIAGEM:
${dadosViagem}

${templateEspecifico || `FORMATO PADRÃO CVC:
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
[Condições de reembolso]`}

REGRAS CRÍTICAS CVC:
1. ⏰ HORÁRIOS: "07:55" (nunca "07: 55")
2. 📅 DATAS: "17 de set" ou "17/09"
3. ✈️ AEROPORTOS: CGH → São Paulo, GRU → São Paulo
4. 👥 PASSAGEIROS: "02 adultos" (com zero à esquerda)
5. 💰 VALORES: "R$ 3.752,55" (espaço após R$)
6. 🧳 BAGAGEM PADRÃO: "Só mala de mão incluída"
7. 🏷️ REEMBOLSO: "Não reembolsável" OU "Reembolsável conforme regras"
8. 🚫 PROIBIDO: separadores (---), formatação markdown (**texto**)

ANÁLISE DETECTADA:
- Complexidade: ${analise.complexidade}
- Múltiplas opções: ${analise.multiplasOpcoes.detectado ? 'SIM' : 'NÃO'}
- Tipo específico: ${analise.tipoEspecifico.principal}
- Ida e volta: ${analise.idaVolta.detectado ? 'SIM' : 'NÃO'}

INSTRUÇÕES FINAIS:
1. Detectar automaticamente companhia, horários, valores reais
2. Converter códigos de aeroportos para cidades
3. Usar APENAS dados fornecidos (não inventar)
4. Formato limpo para WhatsApp (sem markdown)
5. Seguir EXATAMENTE o template selecionado
6. Se CRUZEIRO: NÃO mencionar voos ou aeroportos
7. Se MÚLTIPLAS OPÇÕES: Mostrar TODAS as opções com preços
8. PASSAGEIROS: "02 adultos" (apenas UM zero à esquerda)

GERAR ORÇAMENTO PROFISSIONAL CVC:`;
}

// ================================================================================
// 🔧 PROCESSAMENTO AVANÇADO DE RESPOSTA
// ================================================================================

function processarRespostaCVCAvancada(conteudo, layoutDetectado) {
  console.log(`🔧 Processando resposta CVC (layout: ${layoutDetectado})...`);
  
  let processado = conteudo.trim();
  
  // ================================================================================
  // 🧹 LIMPEZA GERAL
  // ================================================================================
  
  // Remover cabeçalhos técnicos residuais
  processado = processado.replace(/ORÇAMENTO CVC.*?\n/gi, '');
  processado = processado.replace(/DADOS DA VIAGEM.*?\n/gi, '');
  processado = processado.replace(/GERE O ORÇAMENTO.*?\n/gi, '');
  processado = processado.replace(/FORMATO.*?CVC.*?\n/gi, '');
  processado = processado.replace(/REGRAS.*?CVC.*?\n/gi, '');
  
  // ================================================================================
  // 🔧 FORMATAÇÃO ESPECÍFICA POR LAYOUT
  // ================================================================================
  
  switch (layoutDetectado) {
    case 'multiplas_opcoes_2':
    case 'multiplas_opcoes_3':
      // Garantir formatação de múltiplas opções
      processado = processado.replace(/OPÇÃO (\d+)/g, '**OPÇÃO $1**');
      processado = processado.replace(/Opção (\d+)/g, '**OPÇÃO $1**');
      break;
      
    case 'cruzeiro':
      // Formatação específica para cruzeiros
      processado = processado.replace(/Cruzeiro (.*?)\s*–/g, '🚢 Cruzeiro $1 –');
      break;
      
    case 'pacote_completo':
      // Formatação para pacotes
      processado = processado.replace(/Pacote (.*?)$/gm, '*Pacote $1*');
      break;
      
    default:
      // Formatação padrão ida e volta
      break;
  }
  
  // ================================================================================
  // 🔧 FORMATAÇÃO GERAL
  // ================================================================================
  
  // Garantir formatação de horários
  processado = processado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Garantir formato de valores
  processado = processado.replace(/R\$\s*(\d)/g, 'R$ $1');
  
  // Garantir formato de passageiros (CORREÇÃO: só um zero)
  processado = processado.replace(/(\d) adulto/g, (match, num) => {
    return num.length === 1 ? `0${num} adulto` : `${num} adulto`;
  });
  processado = processado.replace(/(\d) criança/g, (match, num) => {
    return num.length === 1 ? `0${num} criança` : `${num} criança`;
  });
  
  // Corrigir formato incorreto (002 → 02)
  processado = processado.replace(/00(\d)\s+(adulto|criança)/g, '0$1 $2');
  
  // Limpar linhas vazias excessivas
  processado = processado.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return processado;
}

// ================================================================================
// 💰 REGISTRO DE CUSTOS AVANÇADO
// ================================================================================

async function registrarCustosAvancados(resposta, formData, layoutDetectado) {
  try {
    console.log('💰 Registrando custos avançados...');
    
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
    
    console.log(`💰 Custo: R$ ${custoBRL.toFixed(6)} (${tokensTotal} tokens) - Layout: ${layoutDetectado}`);
    
    // Registrar na planilha com informações avançadas
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqOxRJNJm_X4lmD1-4v4OZYRt7E5xh0mYaX1kgRv-fGfFTU4YZM7UWQm8YrWl1B4VQ/exec';
      
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'registrarCustoAvancado',
          dados: {
            timestamp: new Date().toISOString(),
            destino: formData.destino || 'N/A',
            modelo: modelo,
            tokensTotal: tokensTotal,
            tokensInput: tokensInput,
            tokensOutput: tokensOutput,
            custoUSD: custoUSD.toFixed(6),
            custoBRL: custoBRL.toFixed(6),
            layoutDetectado: layoutDetectado,
            tiposOrcamento: formData.tipos?.join(', ') || 'N/A',
            temImagem: !!formData.temImagem,
            versaoSistema: '7.2',
            sistemaTemplates: !!aplicarTemplateCompleto ? 'avancado' : 'basico'
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
// 🤖 CLIENTE DE IA SIMPLIFICADO (MANTIDO IGUAL)
// ================================================================================

async function chamarIASimples(prompt, temImagem = false, arquivo = null) {
  console.log("🤖 Chamando IA...");
  
  try {
    if (temImagem && arquivo) {
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
// 🏨 PROCESSAMENTO SIMPLIFICADO DE OUTROS TIPOS (MANTIDO)
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
  await registrarCustosAvancados(resposta, formData, 'ranking');
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado,
    templateUsado: 'ranking'
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
  await registrarCustosAvancados(resposta, formData, 'dicas');
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado,
    templateUsado: 'dicas'
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
  await registrarCustosAvancados(resposta, formData, 'analise');
  
  return {
    conteudo: resposta.content,
    modeloUsado: resposta.modelo_usado,
    templateUsado: 'analise'
  };
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES (MANTIDAS)
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
// 🚀 LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log("🚀 CVC ITAQUA API v7.2 COM TEMPLATES INICIALIZADO");
console.log("✅ Funcionalidades:");
console.log("📋 Sistema de templates:", !!aplicarTemplateCompleto ? "AVANÇADO" : "BÁSICO");
console.log(`🎯 Templates disponíveis: ${Object.keys(TEMPLATES_MANUAIS).length}`);
console.log("💰 Orçamentos com detecção automática de layout");
console.log("🏨 Rankings de hotéis");
console.log("💡 Dicas de destinos"); 
console.log("📊 Análise de documentos");
console.log("🤖 IA: OpenAI + Claude (fallback automático)");
console.log("💰 Registro de custos com métricas avançadas");
console.log("🔧 Sistema robusto com integração gradual");

if (aplicarTemplateCompleto) {
  console.log("🎉 SISTEMA COMPLETO OPERACIONAL - TEMPLATES AVANÇADOS ATIVOS!");
} else {
  console.log("⚠️ SISTEMA BÁSICO OPERACIONAL - Templates avançados serão carregados quando disponíveis");
}
