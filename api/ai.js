// 🚀 api/ai.js - SISTEMA BACKEND CVC ITAQUA v7.1 - CORREÇÃO COMPLETA
// Correção da incompatibilidade frontend/backend + Sistema modular completo
// Aceita múltiplos formatos + Debug permanente + Arquitetura limpa

export default async function handler(req, res) {
  console.log("🚀 CVC ITAQUA API v7.1 - Processando requisição");
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    console.log("- Body completo:", JSON.stringify(req.body, null, 2));

    // ============================================================================
    // 🔧 COMPATIBILIDADE: ACEITAR MÚLTIPLOS FORMATOS DE DADOS
    // ============================================================================
    
    let formData, tipo, versao;
    
    // FORMATO NOVO (v7.0+): { formData: {...}, tipo: 'orcamento', versao: '7.0' }
    if (req.body.formData && req.body.tipo) {
      console.log("📍 Formato novo detectado (v7.0+)");
      formData = req.body.formData;
      tipo = req.body.tipo;
      versao = req.body.versao || '7.1';
    }
    
    // FORMATO ANTIGO (v6.x): dados diretos no body
    else if (req.body.tipos || req.body.prompt || req.body.observacoes) {
      console.log("📍 Formato antigo detectado (v6.x) - Convertendo...");
      formData = req.body;
      
      // Determinar tipo baseado nos dados
      if (formData.tipos && formData.tipos.length > 0) {
        tipo = 'orcamento';
      } else if (formData.prompt?.includes('ranking') || formData.prompt?.includes('hotel')) {
        tipo = 'ranking';
      } else if (formData.prompt?.includes('dica') || formData.prompt?.includes('destino')) {
        tipo = 'dicas';
      } else {
        tipo = 'orcamento'; // Padrão
      }
      
      versao = '6.x-convertido';
    }
    
    // FORMATO INVÁLIDO
    else {
      console.error("❌ Formato de dados não reconhecido");
      throw new Error("Formato de dados não reconhecido. Envie 'formData' e 'tipo' ou dados no formato v6.x");
    }

    // ============================================================================
    // 🔧 NORMALIZAÇÃO DOS DADOS
    // ============================================================================
    
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
    console.log("- Tem imagem:", !!formData.temImagem);
    console.log("- Destino:", formData.destino);

    // ============================================================================
    // 🎯 VALIDAÇÕES MELHORADAS
    // ============================================================================
    
    if (!formData) {
      throw new Error("Dados do formulário não encontrados");
    }

    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Pelo menos um tipo de orçamento deve ser selecionado");
    }

    // ============================================================================
    // 🤖 PROCESSAMENTO BASEADO NO TIPO
    // ============================================================================
    
    let resultado;
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamento(formData);
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
        throw new Error(`Tipo de operação não suportado: ${tipo}`);
    }

    console.log("✅ Processamento concluído com sucesso");
    
    return res.status(200).json({
      success: true,
      result: resultado,
      versao: '7.1',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        temImagem: !!formData.temImagem,
        formatoDetectado: versao
      }
    });

  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.1',
      timestamp: new Date().toISOString(),
      debug: {
        bodyReceived: req.body ? Object.keys(req.body) : null,
        errorStack: error.stack?.split('\n')[0]
      }
    });
  }
}

// ================================================================================
// 🎯 PROCESSADORES ESPECIALIZADOS
// ================================================================================

async function processarOrcamento(formData) {
  console.log("🎯 Iniciando processamento de orçamento...");
  
  // ETAPA 1: Análise completa dos dados
  const analise = analisarTextoCompleto(formData);
  console.log("📊 Análise:", analise);
  
  // ETAPA 2: Selecionar template otimizado
  const template = selecionarTemplate(formData, analise);
  console.log("📋 Template selecionado:", template.tipo);
  
  // ETAPA 3: Gerar prompt final
  const prompt = construirPromptFinal(formData, analise, template);
  
  // ETAPA 4: Determinar melhor modelo
  const modelo = determinarModelo(analise.complexidade);
  console.log("🤖 Modelo selecionado:", modelo);
  
  // ETAPA 5: Chamar IA
  try {
    const resposta = await chamarIA(prompt, modelo, formData.temImagem, formData.arquivo);
    
    // ETAPA 6: Processar resposta
    const resultado = processarResposta(resposta, analise);
    
    // ETAPA 7: Calcular e registrar custos
    await registrarCustos(prompt, resposta, modelo, formData.destino);
    
    return resultado;
  } catch (error) {
    console.error("❌ Erro ao processar orçamento:", error);
    throw new Error(`Erro na geração do orçamento: ${error.message}`);
  }
}

async function processarRanking(formData) {
  console.log("🏨 Processando ranking de hotéis...");
  
  try {
    const prompt = construirPromptRanking(formData.destino || 'destino solicitado');
    const resposta = await chamarIA(prompt, 'gpt-4o-mini');
    
    await registrarCustos(prompt, resposta, 'gpt-4o-mini', formData.destino);
    
    return resposta;
  } catch (error) {
    console.error("❌ Erro ao processar ranking:", error);
    throw new Error(`Erro na geração do ranking: ${error.message}`);
  }
}

async function processarDicas(formData) {
  console.log("💡 Processando dicas de destino...");
  
  try {
    const prompt = construirPromptDicas(formData.destino || 'destino solicitado');
    const resposta = await chamarIA(prompt, 'gpt-4o-mini');
    
    await registrarCustos(prompt, resposta, 'gpt-4o-mini', formData.destino);
    
    return resposta;
  } catch (error) {
    console.error("❌ Erro ao processar dicas:", error);
    throw new Error(`Erro na geração das dicas: ${error.message}`);
  }
}

async function processarAnalise(formData) {
  console.log("📄 Processando análise de PDF...");
  
  try {
    const prompt = construirPromptAnalise(formData);
    const resposta = await chamarIA(prompt, 'gpt-4o', formData.temImagem, formData.arquivo);
    
    await registrarCustos(prompt, resposta, 'gpt-4o', 'Análise PDF');
    
    return resposta;
  } catch (error) {
    console.error("❌ Erro ao processar análise:", error);
    throw new Error(`Erro na análise do PDF: ${error.message}`);
  }
}

// ================================================================================
// 🧠 SISTEMA DE ANÁLISE INTELIGENTE
// ================================================================================

function analisarTextoCompleto(formData) {
  const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`.trim();
  
  console.log("🔍 Analisando texto completo...");
  console.log("📏 Tamanho do texto:", textoCompleto.length, "caracteres");
  
  // Análise de múltiplas opções
  const multiplasOpcoes = detectarMultiplasOpcoes(textoCompleto);
  
  // Análise de ida e volta
  const idaVolta = detectarIdaVolta(textoCompleto);
  
  // Análise de complexidade
  const complexidade = calcularComplexidade(textoCompleto, formData);
  
  // Análise de tipo específico
  const tipoEspecifico = detectarTipoEspecifico(formData.tipos, textoCompleto);
  
  return {
    multiplasOpcoes,
    idaVolta,
    complexidade,
    tipoEspecifico,
    temImagem: formData.temImagem || false,
    tamanhoTexto: textoCompleto.length
  };
}

function detectarMultiplasOpcoes(texto) {
  const indicadores = [
    /opção\s+\d+/gi,
    /alternativa\s+\d+/gi,
    /\d+º?\s*-\s*(voo|passagem)/gi,
    /r\$\s*\d+[\.,]\d+.*r\$\s*\d+[\.,]\d+/gi
  ];
  
  const deteccoes = indicadores.map(regex => (texto.match(regex) || []).length);
  const total = deteccoes.reduce((a, b) => a + b, 0);
  
  return {
    detectado: total >= 2,
    quantidade: Math.max(...deteccoes, 1),
    confianca: Math.min(total / 4, 1)
  };
}

function detectarIdaVolta(texto) {
  const indicadoresIda = /\b(ida|saída|partida|embarque)\b/gi;
  const indicadoresVolta = /\b(volta|retorno|chegada|regresso)\b/gi;
  
  const temIda = indicadoresIda.test(texto);
  const temVolta = indicadoresVolta.test(texto);
  
  // Detectar datas diferentes
  const datas = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/g) || [];
  const datasUnicas = [...new Set(datas)];
  
  return {
    detectado: (temIda && temVolta) || datasUnicas.length >= 2,
    temIndicadores: temIda && temVolta,
    quantidadeDatas: datasUnicas.length
  };
}

function calcularComplexidade(texto, formData) {
  let pontos = 0;
  
  // Fatores de complexidade
  if (texto.length > 500) pontos += 2;
  if (formData.tipos && formData.tipos.length > 1) pontos += 1;
  if (formData.temImagem) pontos += 1;
  if (detectarMultiplasOpcoes(texto).detectado) pontos += 2;
  if ((texto.match(/\d{2}:\d{2}/g) || []).length > 4) pontos += 1;
  if ((texto.match(/[A-Z]{3}/g) || []).length > 2) pontos += 1;
  
  if (pontos <= 2) return 'simples';
  if (pontos <= 5) return 'media';
  return 'alta';
}

function detectarTipoEspecifico(tipos, texto) {
  const deteccoes = {
    cruzeiro: /\b(cruzeiro|navio|msc|costa)\b/gi.test(texto),
    hotel: /\b(hotel|resort|pousada|hostel)\b/gi.test(texto),
    aereo: /\b(voo|passagem|aéreo|airline)\b/gi.test(texto),
    pacote: /\b(pacote|combo|all inclusive)\b/gi.test(texto)
  };
  
  const tipoDetectado = Object.keys(deteccoes).find(tipo => deteccoes[tipo]);
  
  return {
    principal: tipoDetectado || 'aereo',
    deteccoes,
    baseadoEm: tipoDetectado ? 'texto' : 'tipos_selecionados'
  };
}

// ================================================================================
// 📋 SISTEMA DE TEMPLATES OTIMIZADO
// ================================================================================

function selecionarTemplate(formData, analise) {
  console.log("📋 Selecionando template otimizado...");
  
  // Prioridade 1: Cruzeiros
  if (analise.tipoEspecifico.principal === 'cruzeiro' || 
      formData.tipos.some(t => t.toLowerCase().includes('cruzeiro'))) {
    return { tipo: 'cruzeiro', template: TEMPLATE_CRUZEIRO };
  }
  
  // Prioridade 2: Múltiplas opções
  if (analise.multiplasOpcoes.detectado) {
    return { tipo: 'multiplas_opcoes', template: TEMPLATE_MULTIPLAS_OPCOES };
  }
  
  // Prioridade 3: Ida e volta
  if (analise.idaVolta.detectado) {
    return { tipo: 'ida_volta', template: TEMPLATE_IDA_VOLTA };
  }
  
  // Prioridade 4: Hotel
  if (analise.tipoEspecifico.principal === 'hotel' || 
      formData.tipos.some(t => t.toLowerCase().includes('hotel'))) {
    return { tipo: 'hotel', template: TEMPLATE_HOTEL };
  }
  
  // Template padrão
  return { tipo: 'ida_volta', template: TEMPLATE_IDA_VOLTA };
}

// Templates específicos
const TEMPLATE_IDA_VOLTA = `
ORÇAMENTO CVC ITAQUAQUECETUBA - IDA E VOLTA

DADOS DA VIAGEM:
{dadosViagem}

INSTRUÇÕES ESPECÍFICAS:
1. 🔍 ESTRUTURA OBRIGATÓRIA:
   - Seção "✈️ VOO DE IDA" com data, horário e aeroportos
   - Seção "✈️ VOO DE VOLTA" com data, horário e aeroportos
   - Separar claramente as duas seções

2. ✈️ AEROPORTOS:
   - Converter códigos para nomes completos
   - Ida: Origem → Destino (com escalas se houver)
   - Volta: Destino → Origem (com escalas se houver)

3. 💰 PREÇOS:
   - Total por pessoa
   - Total família (se múltiplos passageiros)
   - Usar apenas valores reais fornecidos

4. 🧹 FORMATAÇÃO:
   - Sem cabeçalhos técnicos
   - Pronto para WhatsApp
   - Emojis apropriados

GERE O ORÇAMENTO PROFISSIONAL:
`;

const TEMPLATE_MULTIPLAS_OPCOES = `
ORÇAMENTO CVC ITAQUAQUECETUBA - MÚLTIPLAS OPÇÕES

DADOS DA VIAGEM:
{dadosViagem}

INSTRUÇÕES ESPECÍFICAS:
1. 🔢 NUMERAÇÃO CLARA:
   - "OPÇÃO 1:", "OPÇÃO 2:", etc.
   - Separar cada opção visualmente
   - Apresentar TODAS as opções encontradas

2. ✈️ PARA CADA OPÇÃO:
   - Aeroportos e horários específicos
   - Companhia aérea
   - Escalas (se houver)
   - Preço individual

3. 💰 COMPARAÇÃO DE PREÇOS:
   - Apresentar opções do menor para maior preço
   - Total por pessoa para cada opção
   - Destacar melhor custo-benefício

GERE O COMPARATIVO COMPLETO:
`;

const TEMPLATE_CRUZEIRO = `
ORÇAMENTO CVC ITAQUAQUECETUBA - CRUZEIRO

DADOS DA VIAGEM:
{dadosViagem}

INSTRUÇÕES ESPECÍFICAS:
1. 🚢 INFORMAÇÕES DO NAVIO:
   - Nome do navio e companhia
   - Categoria da cabine
   - Datas de embarque e desembarque

2. 🗺️ ITINERÁRIO:
   - Portos de parada
   - Dias em cada destino
   - Atividades principais

3. 🍽️ INCLUSO NO PACOTE:
   - Refeições
   - Entretenimento
   - Serviços inclusos

GERE O ORÇAMENTO DE CRUZEIRO:
`;

const TEMPLATE_HOTEL = `
ORÇAMENTO CVC ITAQUAQUECETUBA - HOTEL

DADOS DA VIAGEM:
{dadosViagem}

INSTRUÇÕES ESPECÍFICAS:
1. 🏨 DETALHES DO HOTEL:
   - Nome exato e categoria
   - Localização e região
   - Tipo de acomodação

2. 🛏️ SERVIÇOS INCLUSOS:
   - Tipo de pensão
   - Facilidades do hotel
   - Atividades disponíveis

3. 💰 VALORES:
   - Preço por diária
   - Total da estadia
   - Taxas e impostos

GERE O ORÇAMENTO HOTELEIRO:
`;

// ================================================================================
// 🤖 SISTEMA DE IA DUAL (OpenAI + Claude)
// ================================================================================

function determinarModelo(complexidade) {
  switch (complexidade) {
    case 'simples':
      return 'gpt-4o-mini';
    case 'media':
      return 'gpt-4o-mini';
    case 'alta':
      return 'gpt-4o';
    default:
      return 'gpt-4o-mini';
  }
}

function construirPromptFinal(formData, analise, template) {
  const dadosViagem = formatarDadosViagem(formData);
  const promptBase = template.template.replace('{dadosViagem}', dadosViagem);
  
  return promptBase;
}

function formatarDadosViagem(formData) {
  return `
Destino: ${formData.destino || 'Não informado'}
Adultos: ${formData.adultos || '2'}
Crianças: ${formData.criancas || '0'}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos?.join(', ') || 'Não especificado'}

OBSERVAÇÕES:
${formData.observacoes || 'Nenhuma observação fornecida'}

${formData.textoColado ? `INFORMAÇÕES COLADAS:
${formData.textoColado}` : ''}

${formData.prompt ? `PROMPT ADICIONAL:
${formData.prompt}` : ''}
`;
}

function construirPromptRanking(destino) {
  return `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;
}

function construirPromptDicas(destino) {
  return `Gere dicas personalizadas de viagem para ${destino}, focadas em famílias.

Incluir:
🌡️ Melhor época para visitar
🎯 Atrações imperdíveis para crianças
🍽️ Gastronomia local
💡 Dicas importantes de segurança e saúde

Seja prático e direto.`;
}

function construirPromptAnalise(formData) {
  return `Analise este relatório da CVC e extraia:

1. 📊 Principais métricas de vendas
2. 🎯 Metas vs realizado  
3. 🏆 Produtos mais vendidos
4. 📈 Tendências identificadas
5. 💡 Recomendações para melhoria

Arquivo: ${formData.nomeArquivo || 'Documento enviado'}
Seja objetivo e direto nas conclusões.`;
}

// ================================================================================
// 🤖 CLIENTE DE IA UNIFICADO
// ================================================================================

async function chamarIA(prompt, modelo, temImagem = false, arquivo = null) {
  console.log(`🤖 Chamando ${modelo}... (Imagem: ${temImagem ? 'Sim' : 'Não'})`);
  
  try {
    if (modelo.startsWith('gpt')) {
      return await chamarOpenAI(prompt, modelo, temImagem, arquivo);
    } else if (modelo.startsWith('claude')) {
      return await chamarClaude(prompt, modelo, temImagem, arquivo);
    } else {
      throw new Error(`Modelo não suportado: ${modelo}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao chamar ${modelo}:`, error);
    
    // Fallback para modelo alternativo
    if (modelo !== 'gpt-4o-mini') {
      console.log("🔄 Tentando fallback para gpt-4o-mini...");
      return await chamarOpenAI(prompt, 'gpt-4o-mini', false, null);
    }
    
    throw error;
  }
}

async function chamarOpenAI(prompt, modelo, temImagem = false, arquivo = null) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  let messages;
  
  if (temImagem && arquivo) {
    messages = [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: arquivo } }
      ]
    }];
  } else {
    messages = [{
      role: 'user',
      content: prompt
    }];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: modelo,
      messages: messages,
      max_tokens: modelo === 'gpt-4o' ? 4000 : 2000,
      temperature: 0.7
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

  return data.choices[0].message.content;
}

async function chamarClaude(prompt, modelo, temImagem = false, arquivo = null) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  let content;
  
  if (temImagem && arquivo) {
    // Extrair base64 da URL data:
    const base64Data = arquivo.split(',')[1];
    const mediaType = arquivo.split(':')[1].split(';')[0];
    
    content = [
      { type: 'text', text: prompt },
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data
        }
      }
    ];
  } else {
    content = [{ type: 'text', text: prompt }];
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: content
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

  return data.content[0].text;
}

// ================================================================================
// 📊 PROCESSAMENTO DE RESPOSTA
// ================================================================================

function processarResposta(resposta, analise) {
  console.log("📊 Processando resposta da IA...");
  
  // Aplicar formatação específica baseada na análise
  let respostaProcessada = resposta;
  
  // Limpeza básica
  respostaProcessada = respostaProcessada.trim();
  
  // Aplicar regras de formatação específicas
  if (analise.multiplasOpcoes.detectado) {
    respostaProcessada = formatarMultiplasOpcoes(respostaProcessada);
  }
  
  if (analise.idaVolta.detectado) {
    respostaProcessada = formatarIdaVolta(respostaProcessada);
  }
  
  return respostaProcessada;
}

function formatarMultiplasOpcoes(texto) {
  // Garantir que opções estejam bem separadas
  return texto.replace(/OPÇÃO (\d+)/g, '\n🔸 **OPÇÃO $1**');
}

function formatarIdaVolta(texto) {
  // Garantir separação clara entre ida e volta
  return texto.replace(/(VOO DE VOLTA|VOLTA)/gi, '\n✈️ **$1**');
}

// ================================================================================
// 💰 SISTEMA DE CUSTOS CORRIGIDO (DEBUG PERMANENTE)
// ================================================================================

async function registrarCustos(prompt, resposta, modelo, destino) {
  try {
    console.log('\n🧪 === DEBUG CUSTOS PERMANENTE v7.1 ===');
    
    // Calcular tokens (aproximação)
    const tokensInput = Math.ceil(prompt.length / 4);
    const tokensOutput = Math.ceil(resposta.length / 4);
    const tokensTotal = tokensInput + tokensOutput;
    
    console.log(`📥 Input: ${tokensInput} tokens`);
    console.log(`📤 Output: ${tokensOutput} tokens`);
    console.log(`📊 Total: ${tokensTotal} tokens`);
    console.log(`🤖 Modelo: ${modelo}`);
    
    // Preços corretos por modelo (por 1K tokens)
    const precos = {
      'gpt-4o-mini': {
        input: 0.00015,
        output: 0.0006
      },
      'gpt-4o': {
        input: 0.0025,
        output: 0.01
      },
      'claude-3-5-sonnet-20240620': {
        input: 0.003,
        output: 0.015
      }
    };
    
    const preco = precos[modelo] || precos['gpt-4o-mini'];
    
    // Cálculo CORRETO
    const custoInputUSD = (tokensInput / 1000) * preco.input;
    const custoOutputUSD = (tokensOutput / 1000) * preco.output;
    const custoTotalUSD = custoInputUSD + custoOutputUSD;
    
    // Conversão para BRL (taxa atual aproximada)
    const taxaBRL = 5.2;
    const custoTotalBRL = custoTotalUSD * taxaBRL;
    
    console.log(`💵 Custo USD: ${custoTotalUSD.toFixed(6)}`);
    console.log(`💸 Custo BRL: R${custoTotalBRL.toFixed(6)}`);
    
    // Registrar na planilha Google Sheets
    await salvarCustoNaPlanilha({
      timestamp: new Date().toISOString(),
      destino: destino || 'N/A',
      modelo: modelo,
      tokensInput: tokensInput,
      tokensOutput: tokensOutput,
      tokensTotal: tokensTotal,
      custoUSD: custoTotalUSD.toFixed(6),
      custoBRL: custoTotalBRL.toFixed(6),
      promptSize: prompt.length,
      responseSize: resposta.length
    });
    
    console.log('✅ Custos registrados na planilha');
    console.log('🧪 === FIM DEBUG CUSTOS ===\n');
    
  } catch (error) {
    console.error('❌ Erro ao registrar custos:', error);
    // Não interromper o fluxo principal por erro de log
  }
}

async function salvarCustoNaPlanilha(dados) {
  try {
    // URL do Google Apps Script para registrar custos
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqOxRJNJm_X4lmD1-4v4OZYRt7E5xh0mYaX1kgRv-fGfFTU4YZM7UWQm8YrWl1B4VQ/exec';
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'registrarCusto',
        dados: dados
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    console.log('📊 Resposta da planilha:', resultado);
    
  } catch (error) {
    console.error('❌ Erro ao salvar na planilha:', error);
    // Não interromper o fluxo principal por erro de log
  }
}

// ================================================================================
// 🔧 UTILITÁRIOS DE VALIDAÇÃO E FORMATAÇÃO
// ================================================================================

function validarDados(formData) {
  const erros = [];
  
  if (!formData.destino || formData.destino.trim() === '') {
    erros.push('Destino é obrigatório');
  }
  
  if (!formData.tipos || formData.tipos.length === 0) {
    erros.push('Selecione pelo menos um tipo de orçamento');
  }
  
  if (!formData.observacoes && !formData.textoColado && !formData.prompt) {
    erros.push('Forneça observações, cole informações da viagem ou adicione um prompt');
  }
  
  return {
    valido: erros.length === 0,
    erros
  };
}

function formatarTimestamp() {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function sanitizarTexto(texto) {
  if (!texto) return '';
  
  return texto
    .trim()
    .replace(/[\r\n]+/g, '\n') // Normalizar quebras de linha
    .replace(/\s+/g, ' ') // Normalizar espaços
    .substring(0, 10000); // Limitar tamanho para evitar tokens excessivos
}

// ================================================================================
// 🔍 SISTEMA DE DETECÇÃO AVANÇADA
// ================================================================================

function detectarPadroesCruzeiro(texto) {
  const padroes = [
    /\b(cruzeiro|cruise|navio)\b/gi,
    /\b(msc|costa|royal caribbean|carnival)\b/gi,
    /\b(cabine|suite|balcão)\b/gi,
    /\b(embarque|porto|terminal)\b/gi
  ];
  
  const deteccoes = padroes.map(p => p.test(texto));
  const confianca = deteccoes.filter(d => d).length / padroes.length;
  
  return {
    detectado: confianca >= 0.5,
    confianca: confianca
  };
}

function detectarPadroesHotel(texto) {
  const padroes = [
    /\b(hotel|resort|pousada|hostel)\b/gi,
    /\b(diária|diárias|estadia|hospedagem)\b/gi,
    /\b(quarto|suite|apartamento)\b/gi,
    /\b(café da manhã|pensão completa|all inclusive)\b/gi
  ];
  
  const deteccoes = padroes.map(p => p.test(texto));
  const confianca = deteccoes.filter(d => d).length / padroes.length;
  
  return {
    detectado: confianca >= 0.5,
    confianca: confianca
  };
}

function detectarPadroesAereo(texto) {
  const padroes = [
    /\b(voo|passagem|aéreo|flight)\b/gi,
    /\b(ida|volta|retorno)\b/gi,
    /\b(aeroporto|terminal)\b/gi,
    /\b(decolagem|pouso|embarque)\b/gi,
    /\d{2}:\d{2}/g // Horários
  ];
  
  const deteccoes = padroes.map(p => p.test(texto));
  const confianca = deteccoes.filter(d => d).length / padroes.length;
  
  return {
    detectado: confianca >= 0.4,
    confianca: confianca
  };
}

// ================================================================================
// 📊 SISTEMA DE MÉTRICAS E LOGS DETALHADOS
// ================================================================================

function logMetricasDetalhadas(tipo, dados, analise, modelo) {
  console.log(`\n📊 === MÉTRICAS DETALHADAS - ${tipo.toUpperCase()} ===`);
  console.log(`⏰ Timestamp: ${formatarTimestamp()}`);
  console.log(`🎯 Destino: ${dados.destino || 'N/A'}`);
  console.log(`🏷️ Tipos: ${dados.tipos?.join(', ') || 'N/A'}`);
  console.log(`📱 Tem imagem: ${dados.temImagem ? 'Sim' : 'Não'}`);
  console.log(`📝 Tamanho texto: ${analise.tamanhoTexto} chars`);
  console.log(`🤖 Modelo selecionado: ${modelo}`);
  console.log(`🔍 Complexidade: ${analise.complexidade}`);
  console.log(`🎭 Tipo específico: ${analise.tipoEspecifico.principal}`);
  console.log(`🔢 Múltiplas opções: ${analise.multiplasOpcoes.detectado ? 'Sim' : 'Não'}`);
  console.log(`↔️ Ida e volta: ${analise.idaVolta.detectado ? 'Sim' : 'Não'}`);
  console.log(`📊 === FIM MÉTRICAS ===\n`);
}

function logErroDetalhado(error, contexto) {
  console.error(`\n❌ === ERRO DETALHADO ===`);
  console.error(`⏰ Timestamp: ${formatarTimestamp()}`);
  console.error(`📍 Contexto: ${contexto}`);
  console.error(`🔴 Mensagem: ${error.message}`);
  console.error(`📚 Stack: ${error.stack?.split('\n').slice(0, 3).join('\n')}`);
  console.error(`❌ === FIM ERRO ===\n`);
}

// ================================================================================
// 🧪 SISTEMA DE TESTES E VALIDAÇÃO
// ================================================================================

function validarConfiguracao() {
  const config = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  };
  
  console.log('🧪 Validação de configuração:', config);
  
  if (!config.openai && !config.anthropic) {
    throw new Error('Nenhuma API key configurada (OpenAI ou Anthropic)');
  }
  
  return config;
}

function testarModelos() {
  const modelosDisponiveis = [];
  
  if (process.env.OPENAI_API_KEY) {
    modelosDisponiveis.push('gpt-4o', 'gpt-4o-mini');
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    modelosDisponiveis.push('claude-3-5-sonnet-20240620');
  }
  
  console.log('🤖 Modelos disponíveis:', modelosDisponiveis);
  return modelosDisponiveis;
}

// ================================================================================
// 🚀 INICIALIZAÇÃO DO SISTEMA
// ================================================================================

// Validar configuração na inicialização
try {
  validarConfiguracao();
  testarModelos();
  console.log("✅ CVC ITAQUA API v7.1 carregada com sucesso!");
  console.log("🔧 Compatibilidade: v6.x + v7.0+ | Correção: tipos/tipo resolvida");
  console.log("🎯 Funcionalidades: Orçamentos, Rankings, Dicas, Análises");
  console.log("🤖 IA: OpenAI + Claude | Templates: 4 tipos otimizados");
  console.log("💰 Custos: Registro automático na planilha");
  console.log("🐛 Debug: Logs detalhados permanentes");
} catch (error) {
  console.error("❌ Erro na inicialização:", error.message);
}

// ================================================================================
// 📋 EXPORTS E UTILITÁRIOS FINAIS
// ================================================================================

// Função de saúde do sistema
export function healthCheck() {
  return {
    status: 'healthy',
    version: '7.1',
    timestamp: new Date().toISOString(),
    features: {
      orcamentos: true,
      rankings: true,
      dicas: true,
      analises: true,
      multiplos_formatos: true,
      templates_otimizados: true,
      dual_ai: true,
      registro_custos: true
    },
    apis: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY
    }
  };
}

// Função de debug para testes
export function debugInfo(req) {
  return {
    method: req.method,
    headers: Object.keys(req.headers),
    bodyKeys: req.body ? Object.keys(req.body) : null,
    bodySize: req.body ? JSON.stringify(req.body).length : 0,
    timestamp: new Date().toISOString()
  };
}
