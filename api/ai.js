// 🚀 api/ai.js - SISTEMA BACKEND CVC ITAQUA v7.0
// Sistema modular integrado + Custos corrigidos + Debug permanente
// Arquitetura limpa - Sem duplicatas

export default async function handler(req, res) {
  console.log("🚀 CVC ITAQUA API v7.0 - Processando requisição");
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
      versao: '7.0'
    });
  }

  try {
    console.log("📥 Dados recebidos:");
    console.log("- Body existe:", !!req.body);
    console.log("- Tipo:", req.body?.tipo);
    console.log("- FormData existe:", !!req.body?.formData);
    console.log("- Versão:", req.body?.versao);
    console.log("- Body completo:", JSON.stringify(req.body, null, 2));

    const { formData, tipo, versao } = req.body;

    // Validação melhorada
    if (!req.body) {
      throw new Error("Body da requisição está vazio");
    }

    if (!tipo) {
      throw new Error("Parâmetro 'tipo' é obrigatório");
    }

    if (!formData) {
      throw new Error("Parâmetro 'formData' é obrigatório");
    }

    console.log("🎯 Processando:", tipo, "| Destino:", formData.destino);

    // Processar baseado no tipo
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
        throw new Error(`Tipo não suportado: ${tipo}`);
    }

    console.log("✅ Processamento concluído com sucesso");
    
    return res.status(200).json({
      success: true,
      result: resultado,
      versao: '7.0',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.0',
      timestamp: new Date().toISOString()
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
  const resposta = await chamarIA(prompt, modelo);
  
  // ETAPA 6: Processar resposta
  const resultado = processarResposta(resposta, analise);
  
  // ETAPA 7: Calcular e registrar custos (CORRIGIDO)
  await registrarCustos(prompt, resposta, modelo, formData.destino);
  
  return resultado;
}

async function processarRanking(formData) {
  console.log("🏨 Processando ranking de hotéis...");
  
  const prompt = construirPromptRanking(formData.destino);
  const resposta = await chamarIA(prompt, 'gpt-4o-mini');
  
  await registrarCustos(prompt, resposta, 'gpt-4o-mini', formData.destino);
  
  return resposta;
}

async function processarDicas(formData) {
  console.log("💡 Processando dicas de destino...");
  
  const prompt = construirPromptDicas(formData.destino);
  const resposta = await chamarIA(prompt, 'gpt-4o-mini');
  
  await registrarCustos(prompt, resposta, 'gpt-4o-mini', formData.destino);
  
  return resposta;
}

async function processarAnalise(formData) {
  console.log("📄 Processando análise de PDF...");
  
  const prompt = construirPromptAnalise(formData);
  const resposta = await chamarIA(prompt, 'gpt-4o');
  
  await registrarCustos(prompt, resposta, 'gpt-4o', 'Análise PDF');
  
  return resposta;
}

// ================================================================================
// 🧠 SISTEMA DE ANÁLISE INTELIGENTE
// ================================================================================

function analisarTextoCompleto(formData) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  console.log("🔍 Analisando texto completo...");
  
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
    temImagem: formData.temImagem,
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
  if (formData.tipos.length > 1) pontos += 1;
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
Destino: ${formData.destino}
Adultos: ${formData.adultos}
Crianças: ${formData.criancas}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos.join(', ')}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES COLADAS:
${formData.textoColado}` : ''}
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

Arquivo: ${formData.nomeArquivo}
Seja objetivo e direto nas conclusões.`;
}

// ================================================================================
// 🤖 CLIENTE DE IA UNIFICADO
// ================================================================================

async function chamarIA(prompt, modelo) {
  console.log(`🤖 Chamando ${modelo}...`);
  
  try {
    if (modelo.startsWith('gpt')) {
      return await chamarOpenAI(prompt, modelo);
    } else if (modelo.startsWith('claude')) {
      return await chamarClaude(prompt, modelo);
    } else {
      throw new Error(`Modelo não suportado: ${modelo}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao chamar ${modelo}:`, error);
    
    // Fallback para modelo alternativo
    if (modelo !== 'gpt-4o-mini') {
      console.log("🔄 Tentando fallback para gpt-4o-mini...");
      return await chamarOpenAI(prompt, 'gpt-4o-mini');
    }
    
    throw error;
  }
}

async function chamarOpenAI(prompt, modelo) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: modelo,
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: modelo === 'gpt-4o' ? 4000 : 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Resposta inválida da OpenAI");
  }

  return data.choices[0].message.content;
}

async function chamarClaude(prompt, modelo) {
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
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Claude Error: ${errorData.error?.message || response.statusText}`);
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
    console.log('\n🧪 === DEBUG CUSTOS PERMANENTE ===');
    
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
      'claude-3-5-sonnet': {
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
      destino: destino,
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
// 🔧 UTILITÁRIOS
// ================================================================================

function validarDados(formData) {
  const erros = [];
  
  if (!formData.destino || formData.destino.trim() === '') {
    erros.push('Destino é obrigatório');
  }
  
  if (!formData.tipos || formData.tipos.length === 0) {
    erros.push('Selecione pelo menos um tipo de orçamento');
  }
  
  if (!formData.observacoes && !formData.textoColado) {
    erros.push('Forneça observações ou cole informações da viagem');
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

// ================================================================================
// 📊 LOGS E MÉTRICAS
// ================================================================================

function logMetricas(tipo, dados) {
  console.log(`📊 MÉTRICAS - ${tipo.toUpperCase()}:`);
  console.log(`- Timestamp: ${formatarTimestamp()}`);
  console.log(`- Destino: ${dados.destino || 'N/A'}`);
  console.log(`- Tipos: ${dados.tipos?.join(', ') || 'N/A'}`);
  console.log(`- Tem imagem: ${dados.temImagem ? 'Sim' : 'Não'}`);
  console.log(`- Texto colado: ${dados.textoColado ? dados.textoColado.length + ' chars' : 'Não'}`);
}

console.log("✅ CVC ITAQUA API v7.0 carregada - Sistema completo integrado!");
