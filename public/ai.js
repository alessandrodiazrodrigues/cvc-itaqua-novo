// ================================================================================
// 🎯 SISTEMA DE IA PARA ORÇAMENTOS CVC ITAQUA - VERSÃO CORRIGIDA FASE 2
// ================================================================================
// ✅ CORREÇÕES IMPLEMENTADAS:
// 1. Limpeza de cabeçalhos técnicos aprimorada
// 2. Conversão automática de aeroportos (remove redundâncias)
// 3. Sistema de links condicionais (só mostra quando existir)
// 4. Detecção melhorada de múltiplas opções
// 5. Distinção correta ida/volta vs somente ida
// 6. Templates específicos para cruzeiros
// 7. Prompts otimizados para GPT-4
// ================================================================================

console.log("🚀 [FASE 2] Sistema de IA Corrigido carregando...");

// ================================================================================
// 🔧 CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ================================================================================

let formElements = {};
let custoMeter = {
  orcamentosHoje: 0,
  custoTotalHoje: 0,
  economiaHoje: 0,
  orcamentosTexto: 0,
  orcamentosImagem: 0,
  ultimaAtualizacao: new Date().toDateString(),
  modelosUsados: {
    'claude-3-sonnet': 0,
    'gpt-4o-mini': 0,
    'fallback': 0
  }
};

// ================================================================================
// 🔧 INICIALIZAÇÃO
// ================================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 [FASE 2] Iniciando sistema corrigido...");

  try {
    formElements = {
      form: document.getElementById("orcamentoForm"),
      pasteArea: document.getElementById("pasteArea"),
      previewArea: document.getElementById("previewArea"),
      arquivo: document.getElementById("arquivo"),
      pdfUpload: document.getElementById("pdfUpload")
    };

    if (!formElements.form) {
      console.warn("⚠️ Formulário principal não encontrado");
      return;
    }

    formElements.form.addEventListener("submit", handleOrcamentoCorrigido);
    console.log("✅ Formulário principal conectado");

    if (formElements.arquivo) {
      formElements.arquivo.addEventListener("change", handleFileUploadCorrigido);
    }

    if (formElements.pdfUpload) {
      window.analisarPDF = handlePDFAnalysisCorrigido;
    }

    setupPasteAreaCorrigida();
    inicializarMedidorCusto();
    testarConexaoAPICorrigida();

    console.log("✅ [FASE 2] Sistema corrigido inicializado!");

  } catch (error) {
    console.error("❌ [FASE 2] Erro na inicialização:", error);
  }
});

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL CORRIGIDA - HANDLE ORÇAMENTO
// ================================================================================

async function handleOrcamentoCorrigido(event) {
  event.preventDefault();
  
  const startTime = Date.now();
  console.log("🎯 [FASE 2] Iniciando processamento corrigido...");

  try {
    // VALIDAÇÃO CORRIGIDA
    const formData = coletarDadosFormularioCorrigido(event.target);
    const errosValidacao = validarFormularioCorrigido(formData);
    
    if (errosValidacao.length > 0) {
      throw new Error(`Erros de validação: ${errosValidacao.join(', ')}`);
    }

    // ANÁLISE APRIMORADA
    const analise = analisarConteudoCorrigido(formData);
    console.log("📊 [FASE 2] Análise corrigida:", analise);

    // ESTRATÉGIA DE IA
    const estrategia = formData.temImagem ? 
      'Claude Sonnet (imagem)' : 'GPT-4o-mini (texto)';
    console.log(`🎯 [FASE 2] Estratégia: ${estrategia}`);

    // GERAÇÃO DO ORÇAMENTO CORRIGIDO
    showLoadingCorrigido("Gerando orçamento com correções aplicadas...");
    const response = await generateOrcamentoCorrigido(formData, analise);

    if (response.metricas) {
      atualizarMetricasCorrigidas(response.metricas);
      console.log("💰 [FASE 2] Custo:", `R$ ${response.metricas.custo.brl.toFixed(4)}`);
    }

    habilitarBotaoDicas();

    if (formData.tipos.includes("Hotel")) {
        const btnRanking = document.getElementById('btnGerarRanking');
        if (btnRanking) {
            btnRanking.disabled = false;
        }
    }

    const tempoTotal = Date.now() - startTime;
    console.log(`✅ [FASE 2] Orçamento gerado em ${tempoTotal}ms`);

    logEventoSucesso('orcamento_fase2_gerado', {
      estrategia: estrategia,
      tempo_ms: tempoTotal,
      tipo_viagem_detectado: analise.tipoViagem,
      ida_volta_corrigido: analise.isIdaVolta,
      modelo_usado: response.metricas?.modelo_usado
    });

  } catch (error) {
    console.error("❌ [FASE 2] Erro no processamento:", error);
    showErrorCorrigido(error.message);

  } finally {
    hideLoadingCorrigido();
  }
}

// ================================================================================
// 📊 COLETA DE DADOS APRIMORADA
// ================================================================================

function coletarDadosFormularioCorrigido(form) {
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value);
  
  const destino = form.destino?.value?.trim() || "";
  const adultos = parseInt(form.adultos?.value) || null;
  const criancas = parseInt(form.criancas?.value) || 0;
  
  // Coletar idades das crianças
  const idadesCriancas = [];
  if (criancas > 0) {
    for (let i = 1; i <= criancas; i++) {
      const idade = parseInt(form[`idade_crianca_${i}`]?.value) || null;
      if (idade !== null) {
        idadesCriancas.push(idade);
      }
    }
  }

  const observacoes = form.observacoes?.value?.trim() || "";
  
  // Dados da área de paste/arquivo
  const pasteArea = document.getElementById("pasteArea");
  const conteudoPaste = pasteArea?.innerText?.trim() || "";
  
  // Verificar se tem imagem
  const temImagem = Boolean(
    document.querySelector("#previewArea img") || 
    formElements.arquivo?.files?.length > 0
  );

  // NOVA FUNCIONALIDADE: Configuração de parcelamento
  const configParcelamento = obterConfigParcelamento ? 
    obterConfigParcelamento() : { incluir10x: false, incluir12x: false };

  return {
    tipos,
    destino,
    adultos,
    criancas,
    idadesCriancas,
    observacoes,
    conteudoPaste,
    temImagem,
    parcelamento: configParcelamento
  };
}

// ================================================================================
// 🔍 ANÁLISE DE CONTEÚDO CORRIGIDA - FASE 2
// ================================================================================

function analisarConteudoCorrigido(formData) {
  const textoCompleto = `${formData.observacoes} ${formData.conteudoPaste}`.trim();
  
  console.log("🔍 [FASE 2] Analisando conteúdo:", {
    tamanho: textoCompleto.length,
    temImagem: formData.temImagem,
    tipos: formData.tipos
  });

  // DETECÇÃO APRIMORADA DE MÚLTIPLAS OPÇÕES
  const indicadoresMultiplas = detectarMultiplasOpcoes(textoCompleto);
  
  // DETECÇÃO CORRIGIDA IDA E VOLTA
  const idaVoltaInfo = detectarIdaVolta(textoCompleto);
  
  // DETECÇÃO DE ESCALAS MANTIDA
  const temEscalas = detectarEscalas(textoCompleto);
  
  // ANÁLISE DE PREÇOS E COMPANHIAS
  const indicadoresPreco = analisarPrecos(textoCompleto);

  return {
    tipoViagem: determinarTipoViagem(formData.tipos, textoCompleto),
    isIdaVolta: idaVoltaInfo.isIdaVolta,
    confiancaIdaVolta: idaVoltaInfo.confianca,
    temEscalas,
    multiplasOpcoes: indicadoresMultiplas,
    confiancaTipoViagem: 'alta',
    indicadoresPreco
  };
}

// ================================================================================
// 🎯 NOVA FUNCIONALIDADE - DETECÇÃO DE MÚLTIPLAS OPÇÕES
// ================================================================================

function detectarMultiplasOpcoes(texto) {
  if (!texto) return { temMultiplas: false, quantidade: 1 };

  const textoLower = texto.toLowerCase();
  
  // Indicadores explícitos de múltiplas opções
  const padroes = [
    /opção\s*\d+/gi,
    /alternativa\s*\d+/gi,
    /\d+[ªº]?\s*opção/gi,
    /voo\s*\d+/gi,
    /flight\s*\d+/gi
  ];

  let opcoes = [];
  
  padroes.forEach(padrao => {
    const matches = texto.match(padrao);
    if (matches) {
      opcoes.push(...matches);
    }
  });

  // Detectar múltiplos preços distintos
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  const precosUnicos = [...new Set(precos)];

  // Detectar múltiplas companhias aéreas
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'american', 'delta', 'united'];
  const companhiasEncontradas = companhias.filter(cia => 
    textoLower.includes(cia)
  );

  const quantidade = Math.max(
    opcoes.length,
    precosUnicos.length > 1 ? precosUnicos.length : 1,
    companhiasEncontradas.length > 1 ? companhiasEncontradas.length : 1
  );

  return {
    temMultiplas: quantidade > 1,
    quantidade,
    opcoes,
    precos: precosUnicos,
    companhias: companhiasEncontradas
  };
}

// ================================================================================
// ✈️ DETECÇÃO IDA E VOLTA CORRIGIDA
// ================================================================================

function detectarIdaVolta(texto) {
  if (!texto) return { isIdaVolta: false, confianca: 'baixa' };

  const textoLower = texto.toLowerCase();
  
  // Indicadores FORTES de ida e volta
  const indicadoresIdaVolta = [
    'ida e volta',
    'round trip',
    'return',
    'retorno',
    'volta:',
    'return:',
    'going back',
    'de volta'
  ];

  // Indicadores FORTES de somente ida
  const indicadoresSomenteIda = [
    'somente ida',
    'só ida',
    'one way',
    'single',
    'apenas ida'
  ];

  const temIndicadorIdaVolta = indicadoresIdaVolta.some(ind => 
    textoLower.includes(ind)
  );

  const temIndicadorSomenteIda = indicadoresSomenteIda.some(ind => 
    textoLower.includes(ind)
  );

  // Se tem indicador explícito, usar ele
  if (temIndicadorIdaVolta) {
    return { isIdaVolta: true, confianca: 'alta' };
  }
  
  if (temIndicadorSomenteIda) {
    return { isIdaVolta: false, confianca: 'alta' };
  }

  // Detecção por padrões de data/horário
  const padroesDatas = texto.match(/\d{1,2}[\/\-]\d{1,2}/g) || [];
  const datasUnicas = [...new Set(padroesDatas)];

  const padroesHorarios = texto.match(/\d{1,2}:\d{2}/g) || [];
  const horariosUnicos = [...new Set(padroesHorarios)];

  // Se tem múltiplas datas/horários distintos, provavelmente ida e volta
  if (datasUnicas.length >= 2 || horariosUnicos.length >= 4) {
    return { isIdaVolta: true, confianca: 'média' };
  }

  // Padrão conservador: assumir somente ida se não há evidência clara
  return { isIdaVolta: false, confianca: 'baixa' };
}

// ================================================================================
// 💰 ANÁLISE DE PREÇOS APRIMORADA
// ================================================================================

function analisarPrecos(texto) {
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  const links = texto.match(/https?:\/\/[^\s]+/gi) || [];
  const companhias = [];
  
  const companhiasConhecidas = [
    'latam', 'gol', 'azul', 'avianca', 'american', 'delta', 
    'united', 'lufthansa', 'air france', 'klm', 'iberia',
    'msc', 'costa', 'disney cruise', 'ncl'
  ];

  companhiasConhecidas.forEach(cia => {
    if (texto.toLowerCase().includes(cia)) {
      companhias.push(cia);
    }
  });

  const totais = texto.match(/total[:\s]*r\$\s*[\d.,]+/gi) || [];

  return {
    precos,
    links,
    companhias,
    totais,
    quantidade: Math.max(precos.length, 1),
    indicadores: { precos, totais, companhias, links }
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE ESCALAS MANTIDA
// ================================================================================

function detectarEscalas(texto) {
  if (!texto) return false;

  const textoLower = texto.toLowerCase();

  const indicadoresEscalas = [
    'uma escala', 'duas escalas', 'três escalas',
    'conexão', 'conexao', 'escala em', 'via ',
    'com escala', 'parada em', 'troca em'
  ];

  const temIndicadorExplicito = indicadoresEscalas.some(indicador =>
    textoLower.includes(indicador)
  );

  const padraoEscala = /\d+h\s*\d+min.*escala|escala.*\d+h|via\s+\w{3,}/i;
  const temPadraoEscala = padraoEscala.test(texto);

  const temposVoo = texto.match(/(\d+)h\s*(\d+)?min/gi) || [];
  const temVooLongo = temposVoo.some(tempo => {
    const match = tempo.match(/(\d+)h/);
    return match && parseInt(match[1]) >= 5;
  });

  return temIndicadorExplicito || temPadraoEscala || temVooLongo;
}

// ================================================================================
// 🤖 GERAÇÃO DE ORÇAMENTO CORRIGIDO
// ================================================================================

async function generateOrcamentoCorrigido(formData, analise) {
  console.log("🤖 [FASE 2] Gerando orçamento com correções...");

  try {
    const response = await callAICorrigida(formData, analise);

    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Resposta da API em formato inválido');
    }

    let conteudo = response.choices[0].message.content;
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Conteúdo da resposta está vazio');
    }

    // APLICAR TODAS AS CORREÇÕES DA FASE 2
    conteudo = limparCabecalhosTecnicos(conteudo);
    conteudo = converterAeroportos(conteudo);
    conteudo = aplicarLinksCondicionais(conteudo);
    conteudo = limparFormatacao(conteudo);

    updateElementCorrigido("orcamentoIA", conteudo);

    console.log("✅ [FASE 2] Orçamento gerado com correções:", {
      tamanho: conteudo.length,
      modelo: response.metricas?.modelo_usado,
      tipo_detectado: analise.tipoViagem,
      ida_volta: analise.isIdaVolta,
      multiplas: analise.multiplasOpcoes.quantidade
    });

    return response;

  } catch (error) {
    console.error("❌ [FASE 2] Erro na geração:", error);
    throw new Error(`Falha na geração do orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🔗 COMUNICAÇÃO CORRIGIDA COM API
// ================================================================================

async function callAICorrigida(formData, analise) {
  console.log("🔄 [FASE 2] Enviando para API com prompt corrigido...");

  const requestData = {
    prompt: construirPromptCorrigido(formData, analise),
    tipoRequisicao: 'orcamento_fase2',
    destino: formData.destino || 'Detectar automaticamente',
    tipos: Array.isArray(formData.tipos) ? formData.tipos : [],
    temImagem: Boolean(formData.temImagem),
    arquivo: formData.temImagem ? "imagem_anexada" : null,
    metadata: {
      versao: 'fase2_corrigida',
      multiplas_opcoes: analise.multiplasOpcoes.quantidade,
      ida_volta: analise.isIdaVolta
    }
  };

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ [FASE 2] Resposta da API recebida");
    return data;

  } catch (error) {
    console.error("❌ [FASE 2] Erro na API:", error);
    throw new Error(`Erro de comunicação: ${error.message}`);
  }
}

// ================================================================================
// 📝 CONSTRUÇÃO DE PROMPT CORRIGIDO - FASE 2
// ================================================================================

function construirPromptCorrigido(formData, analise) {
  console.log("📝 [FASE 2] Construindo prompt com correções específicas...");

  const textoCompleto = `${formData.observacoes} ${formData.conteudoPaste}`.trim();
  
  let prompt = `SISTEMA DE ORÇAMENTOS CVC ITAQUA - VERSÃO CORRIGIDA FASE 2

INSTRUÇÕES CRÍTICAS PARA MÚLTIPLAS OPÇÕES:
${analise.multiplasOpcoes.temMultiplas ? `
⚠️ ATENÇÃO: DETECTADAS ${analise.multiplasOpcoes.quantidade} OPÇÕES DISTINTAS
1. 🔍 Analise CADA opção separadamente
2. 📊 Numere como "OPÇÃO 1", "OPÇÃO 2", etc.
3. 💰 Mantenha preços EXATOS (não arredonde)
4. 🔗 Links apenas se existirem realmente
5. ✈️ Para cada opção, determine se é ida/volta ou somente ida
` : ''}

DETECÇÃO IDA E VOLTA CORRIGIDA:
- Status detectado: ${analise.isIdaVolta ? 'IDA E VOLTA' : 'SOMENTE IDA'}
- Confiança: ${analise.confiancaIdaVolta}
- Use o template correto baseado na detecção

REGRAS DE FORMATAÇÃO OBRIGATÓRIAS:
1. 🚫 REMOVER informações redundantes de aeroportos:
   - "Congonhas (SP)" → "Congonhas"
   - "Guarulhos (SP)" → "Guarulhos"
   - "Galeão (RJ)" → "Galeão"

2. 🔗 Links condicionais:
   - APENAS inclua linha de link se existir link real
   - Se não houver link, omitir completamente
   - Nunca usar "Detalhes" genérico

3. 🧹 Sem cabeçalhos técnicos:
   - Começar direto com o orçamento
   - Sem "Dados do orçamento:", "Resultado:", etc.

TEMPLATES ESPECÍFICOS:

${formData.tipos.includes('Cruzeiro') ? `
🚢 TEMPLATE CRUZEIRO:
- Mostrar por CABINE, não por passageiro
- Formato: "💰 R$ X.XXX,XX (total)"
- Parcelamento em cada cabine
- Sem detalhamento de taxas
` : ''}

${formData.tipos.includes('Hotel') ? `
🏨 TEMPLATE HOTEL:
- Nome EXATO do hotel
- Estrelas se visíveis
- Localização correta
` : ''}

DADOS FORNECIDOS:
- Tipos selecionados: ${formData.tipos.join(', ')}
- Destino: ${formData.destino || 'Detectar automaticamente'}
- Composição: ${formData.adultos || 'Detectar'} adultos${formData.criancas > 0 ? `, ${formData.criancas} crianças` : ''}
${formData.idadesCriancas.length > 0 ? `- Idades das crianças: ${formData.idadesCriancas.join(', ')} anos` : ''}
- Tem imagem: ${formData.temImagem ? 'SIM' : 'NÃO'}
- Escalas detectadas: ${analise.temEscalas ? 'SIM' : 'NÃO'}

${formData.parcelamento && (formData.parcelamento.incluir10x || formData.parcelamento.incluir12x) ? `
PARCELAMENTO SOLICITADO:
${formData.parcelamento.incluir10x ? '- Incluir parcelamento 10x' : ''}
${formData.parcelamento.incluir12x ? '- Incluir parcelamento 12x' : ''}
` : ''}

CONTEÚDO PARA ANÁLISE:
${textoCompleto}

GERE O ORÇAMENTO APLICANDO TODAS AS CORREÇÕES ACIMA.`;

  return prompt;
}

// ================================================================================
// 🧹 LIMPEZA DE CABEÇALHOS TÉCNICOS - APRIMORADA
// ================================================================================

function limparCabecalhosTecnicos(conteudo) {
  let limpo = conteudo;

  console.log("🧹 [FASE 2] Aplicando limpeza de cabeçalhos...");

  const cabecalhosRemover = [
    /SISTEMA DE ORÇAMENTOS.*?\n/gi,
    /VERSÃO CORRIGIDA.*?\n/gi,
    /INSTRUÇÕES CRÍTICAS.*?\n/gi,
    /PRODUTO SELECIONADO:.*?\n/gi,
    /MÚLTIPLAS OPÇÕES:.*?\n/gi,
    /TEMPLATE OBRIGATÓRIO:.*?\n/gi,
    /INSTRUÇÕES.*?\n/gi,
    /DADOS DO CLIENTE:.*?\n/gi,
    /DADOS FORNECIDOS:.*?\n/gi,
    /FORMATO PARA USAR:.*?\n/gi,
    /CONTEÚDO PARA ANÁLISE:.*?\n/gi,
    /DETECÇÃO IDA E VOLTA.*?\n/gi,
    /REGRAS DE FORMATAÇÃO.*?\n/gi,
    /Dados do orçamento.*?\n/gi,
    /Resultado.*?\n/gi,
    /Orçamento gerado.*?\n/gi
  ];

  cabecalhosRemover.forEach(regex => {
    limpo = limpo.replace(regex, '');
  });

  // Limpar quebras de linha excessivas
  limpo = limpo.replace(/\n\s*\n\s*\n/g, '\n\n');
  limpo = limpo.replace(/^\s*\n+/, '');

  return limpo.trim();
}

// ================================================================================
// ✈️ CONVERSÃO DE AEROPORTOS - NOVA FUNCIONALIDADE FASE 2
// ================================================================================

function converterAeroportos(conteudo) {
  console.log("✈️ [FASE 2] Convertendo nomes de aeroportos...");

  const conversoes = {
    'Congonhas (SP)': 'Congonhas',
    'Congonhas(SP)': 'Congonhas',
    'São Paulo (Congonhas (SP))': 'Congonhas',
    'Guarulhos (SP)': 'Guarulhos',
    'Guarulhos(SP)': 'Guarulhos',
    'São Paulo (Guarulhos (SP))': 'Guarulhos',
    'Galeão (RJ)': 'Galeão',
    'Galeão(RJ)': 'Galeão',
    'Rio de Janeiro (Galeão (RJ))': 'Galeão',
    'Santos Dumont (RJ)': 'Santos Dumont',
    'Santos Dumont(RJ)': 'Santos Dumont',
    'Brasília (DF)': 'Brasília',
    'Brasília(DF)': 'Brasília',
    'Recife (PE)': 'Recife',
    'Recife(PE)': 'Recife',
    'Salvador (BA)': 'Salvador',
    'Salvador(BA)': 'Salvador',
    'Fortaleza (CE)': 'Fortaleza',
    'Fortaleza(CE)': 'Fortaleza'
  };

  let conteudoLimpo = conteudo;

  Object.keys(conversoes).forEach(aeroportoCompleto => {
    const aeroportoLimpo = conversoes[aeroportoCompleto];
    
    // Substituir usando regex para ser mais preciso
    const regex = new RegExp(aeroportoCompleto.replace(/[()]/g, '\\$&'), 'gi');
    conteudoLimpo = conteudoLimpo.replace(regex, aeroportoLimpo);
  });

  return conteudoLimpo;
}

// ================================================================================
// 🔗 SISTEMA DE LINKS CONDICIONAIS - NOVA FUNCIONALIDADE FASE 2
// ================================================================================

function aplicarLinksCondicionais(conteudo) {
  console.log("🔗 [FASE 2] Aplicando sistema de links condicionais...");

  // Verificar se existem links reais no conteúdo
  const temLinksReais = /https?:\/\/[^\s]+/i.test(conteudo);

  if (!temLinksReais) {
    // Remover linhas de link genéricas
    conteudo = conteudo.replace(/🔗\s*Detalhes.*?\n/gi, '');
    conteudo = conteudo.replace(/🔗\s*Link.*?\n/gi, '');
    conteudo = conteudo.replace(/🔗\s*Ver mais.*?\n/gi, '');
    
    console.log("🔗 [FASE 2] Links genéricos removidos");
  } else {
    console.log("🔗 [FASE 2] Links reais mantidos");
  }

  return conteudo;
}

// ================================================================================
// 🎨 LIMPEZA FINAL DE FORMATAÇÃO
// ================================================================================

function limparFormatacao(conteudo) {
  console.log("🎨 [FASE 2] Aplicando limpeza final de formatação...");

  let limpo = conteudo;

  // Remover espaços em branco excessivos
  limpo = limpo.replace(/\s+\n/g, '\n');
  limpo = limpo.replace(/\n\s+/g, '\n');
  
  // Normalizar quebras de linha
  limpo = limpo.replace(/\n{3,}/g, '\n\n');
  
  // Remover espaços no início e fim
  limpo = limpo.trim();

  return limpo;
}

// ================================================================================
// 🔧 FUNÇÕES DE VALIDAÇÃO CORRIGIDAS
// ================================================================================

function validarFormularioCorrigido(formData) {
  const erros = [];
  
  try {
    // Validação de tipos (obrigatório)
    if (!formData.tipos || formData.tipos.length === 0) {
      erros.push("Selecione pelo menos um tipo de serviço");
    }

    // Validação de conteúdo (pelo menos observações ou paste)
    if (!formData.observacoes && !formData.conteudoPaste) {
      erros.push("Forneça informações nas observações ou cole conteúdo");
    }

    // Validação de crianças vs idades
    if (formData.criancas > 0 && formData.idadesCriancas.length !== formData.criancas) {
      console.warn("⚠️ Número de idades não corresponde ao número de crianças");
      // Não é erro crítico, apenas aviso
    }

    console.log("✅ [FASE 2] Validação concluída:", {
      erros: erros.length,
      tipos: formData.tipos.length,
      temConteudo: Boolean(formData.observacoes || formData.conteudoPaste)
    });

  } catch (error) {
    console.error("❌ [FASE 2] Erro na validação:", error);
    erros.push("Erro interno na validação");
  }

  return erros;
}

// ================================================================================
// 🎯 DETERMINAÇÃO DE TIPO DE VIAGEM
// ================================================================================

function determinarTipoViagem(tipos, textoCompleto) {
  if (!tipos || tipos.length === 0) return 'Indefinido';
  
  // Priorizar baseado na seleção
  if (tipos.includes('Cruzeiro')) return 'Cruzeiro';
  if (tipos.includes('Hotel')) return 'Hotel';
  if (tipos.includes('Aéreo Facial') || tipos.includes('Aéreo VBI/Fácil')) return 'Aéreo';
  if (tipos.includes('Circuito')) return 'Circuito';
  
  // Se múltiplos tipos, usar o primeiro
  return tipos[0];
}

// ================================================================================
// 🎨 INTERFACE CORRIGIDA
// ================================================================================

function updateElementCorrigido(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ [FASE 2] Elemento '${id}' não encontrado`);
      return false;
    }

    if (typeof content !== 'string') {
      content = String(content);
    }

    element.innerText = content;
    console.log(`📝 [FASE 2] Elemento '${id}' atualizado (${content.length} chars)`);
    return true;

  } catch (error) {
    console.error(`❌ [FASE 2] Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoadingCorrigido(mensagem = "Processando com correções...") {
  updateElementCorrigido("orcamentoIA", `🤖 ${mensagem}`);
}

function hideLoadingCorrigido() {
  console.log("🔄 [FASE 2] Loading ocultado");
}

function showErrorCorrigido(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElementCorrigido("orcamentoIA", errorMessage);

  if (!sucesso) {
    alert(errorMessage);
  }
}

// ================================================================================
// 🔧 CONFIGURAÇÃO DA ÁREA DE PASTE CORRIGIDA
// ================================================================================

function setupPasteAreaCorrigida() {
  const pasteArea = document.getElementById("pasteArea");
  
  if (!pasteArea) {
    console.warn("⚠️ [FASE 2] Área de paste não encontrada");
    return;
  }

  // Evento de paste melhorado
  pasteArea.addEventListener("paste", async function(e) {
    console.log("📋 [FASE 2] Evento paste detectado");
    
    try {
      const items = e.clipboardData.items;
      let temImagem = false;

      for (let item of items) {
        if (item.type.startsWith('image/')) {
          temImagem = true;
          await processarImagemPaste(item);
          break;
        }
      }

      if (!temImagem) {
        console.log("📝 [FASE 2] Texto colado na área");
      }

    } catch (error) {
      console.error("❌ [FASE 2] Erro no paste:", error);
    }
  });

  console.log("✅ [FASE 2] Área de paste configurada");
}

async function processarImagemPaste(item) {
  console.log("🖼️ [FASE 2] Processando imagem colada...");
  
  const file = item.getAsFile();
  const previewArea = document.getElementById("previewArea");
  
  if (!previewArea) {
    console.warn("⚠️ Preview area não encontrada");
    return;
  }

  try {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.cssText = "max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 1rem;";
    
    previewArea.innerHTML = '';
    previewArea.appendChild(img);

    console.log("✅ [FASE 2] Imagem processada e exibida");

  } catch (error) {
    console.error("❌ [FASE 2] Erro ao processar imagem:", error);
  }
}

// ================================================================================
// 📁 UPLOAD DE ARQUIVO CORRIGIDO
// ================================================================================

function handleFileUploadCorrigido(event) {
  console.log("📁 [FASE 2] Upload de arquivo detectado");
  
  const file = event.target.files[0];
  if (!file) return;

  const previewArea = document.getElementById("previewArea");
  if (!previewArea) return;

  console.log("📄 [FASE 2] Arquivo:", {
    nome: file.name,
    tipo: file.type,
    tamanho: `${(file.size / 1024).toFixed(1)} KB`
  });

  if (file.type.startsWith('image/')) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.cssText = "max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 1rem;";
    
    previewArea.innerHTML = '';
    previewArea.appendChild(img);

    console.log("✅ [FASE 2] Imagem carregada");

  } else if (file.type === 'application/pdf') {
    previewArea.innerHTML = `
      <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-top: 1rem;">
        <strong>📄 PDF carregado:</strong> ${file.name}
      </div>
    `;

    console.log("✅ [FASE 2] PDF carregado");
  }
}

// ================================================================================
// 🌍 FUNÇÃO MELHORADA - GERAR DICAS DO DESTINO
// ================================================================================

async function gerarDicasDestino() {
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');

  if (!btnGerar) {
    console.error('❌ [FASE 2] Botão gerar dicas não encontrado');
    return;
  }

  try {
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Extraindo destino do orçamento...';

    // Extrair informações do orçamento gerado
    const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
    const destinoManual = document.getElementById('destino')?.value?.trim() || '';

    if (!orcamentoTexto || orcamentoTexto === 'Preencha o formulário acima para gerar o orçamento...') {
      throw new Error('Gere um orçamento primeiro para extrair as informações do destino!');
    }

    // Extrair destino automaticamente
    const destinoExtraido = extrairDestinoDoOrcamento(orcamentoTexto) || destinoManual;
    
    if (!destinoExtraido) {
      throw new Error('Não foi possível identificar o destino. Preencha o campo "Destino" manualmente.');
    }

    // Extrair informações de crianças
    const criancas = parseInt(document.getElementById('criancas')?.value) || 0;
    const idadesCriancas = [];
    
    if (criancas > 0) {
      for (let i = 1; i <= criancas; i++) {
        const idade = parseInt(document.querySelector(`input[name="idade_crianca_${i}"]`)?.value) || null;
        if (idade !== null) {
          idadesCriancas.push(idade);
        }
      }
    }

    btnGerar.innerHTML = '🤖 Gerando dicas personalizadas...';

    // Chamar API para gerar dicas
    const dicasResponse = await gerarDicasAPI({
      destino: destinoExtraido,
      orcamento: orcamentoTexto,
      criancas,
      idadesCriancas,
      tipoViagem: extrairTipoViagemDoOrcamento(orcamentoTexto)
    });

    if (dicasResponse && dicasResponse.dicas) {
      updateElementCorrigido('destinoIA', dicasResponse.dicas);
      
      // Habilitar botão de copiar
      if (btnCopiar) {
        btnCopiar.style.display = 'inline-block';
      }

      console.log('✅ [FASE 2] Dicas geradas com sucesso');
    } else {
      throw new Error('Resposta inválida da API de dicas');
    }

  } catch (error) {
    console.error('❌ [FASE 2] Erro ao gerar dicas:', error);
    updateElementCorrigido('destinoIA', `❌ Erro: ${error.message}`);

  } finally {
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🎯 Gerar Dicas';
  }
}

// ================================================================================
// 🏨 FUNÇÃO MELHORADA - GERAR RANKING DE HOTÉIS
// ================================================================================

async function gerarRankingHoteis() {
  const btnGerar = document.getElementById('btnGerarRanking');
  const btnCopiar = document.getElementById('btnCopiarRanking');

  if (!btnGerar) {
    console.error('❌ [FASE 2] Botão gerar ranking não encontrado');
    return;
  }

  try {
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Extraindo hotéis do orçamento...';

    const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
    
    if (!orcamentoTexto || orcamentoTexto === 'Preencha o formulário acima para gerar o orçamento...') {
      throw new Error('Gere um orçamento com hotéis primeiro!');
    }

    // Extrair hotéis do orçamento
    const hoteisExtraidos = extrairHoteisDoOrcamento(orcamentoTexto);
    const destinoExtraido = extrairDestinoDoOrcamento(orcamentoTexto);

    if (hoteisExtraidos.length === 0) {
      throw new Error('Nenhum hotel encontrado no orçamento. Inclua "Hotel" nos tipos selecionados.');
    }

    btnGerar.innerHTML = '🤖 Gerando ranking baseado no orçamento...';

    // Chamar API para gerar ranking
    const rankingResponse = await gerarRankingAPI({
      hoteis: hoteisExtraidos,
      destino: destinoExtraido,
      orcamento: orcamentoTexto
    });

    if (rankingResponse && rankingResponse.ranking) {
      updateElementCorrigido('rankingIA', rankingResponse.ranking);
      
      // Habilitar botão de copiar
      if (btnCopiar) {
        btnCopiar.style.display = 'inline-block';
      }

      console.log('✅ [FASE 2] Ranking gerado com sucesso');
    } else {
      throw new Error('Resposta inválida da API de ranking');
    }

  } catch (error) {
    console.error('❌ [FASE 2] Erro ao gerar ranking:', error);
    updateElementCorrigido('rankingIA', `❌ Erro: ${error.message}`);

  } finally {
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🏆 Gerar Ranking';
  }
}

// ================================================================================
// 🔍 FUNÇÕES DE EXTRAÇÃO DE DADOS
// ================================================================================

function extrairDestinoDoOrcamento(orcamento) {
  // Procurar por padrão "📍 Destino"
  const padraoDestino = /📍\s*([^\n]+)/i;
  const match = orcamento.match(padraoDestino);
  
  if (match) {
    return match[1].trim();
  }

  // Procurar por nomes de cidades conhecidas
  const cidadesComuns = [
    'Orlando', 'Miami', 'Nova York', 'Paris', 'Londres', 'Roma',
    'Buenos Aires', 'Santiago', 'Lima', 'Cancún', 'Punta Cana',
    'Porto de Galinhas', 'Fernando de Noronha', 'Búzios', 'Gramado',
    'Bariloche', 'Mendoza', 'Montevideo', 'Lisboa', 'Barcelona',
    'Madri', 'Amsterdam', 'Berlim', 'Praga', 'Dubai', 'Singapura'
  ];

  for (const cidade of cidadesComuns) {
    if (orcamento.toLowerCase().includes(cidade.toLowerCase())) {
      return cidade;
    }
  }

  return null;
}

function extrairHoteisDoOrcamento(orcamento) {
  const hoteis = [];
  
  // Procurar por padrões de hotel
  const padroes = [
    /🏨\s*([^\n\r]+)/gi,
    /Hotel\s+([^\n\r]+)/gi,
    /Resort\s+([^\n\r]+)/gi,
    /Pousada\s+([^\n\r]+)/gi
  ];

  padroes.forEach(padrao => {
    const matches = orcamento.matchAll(padrao);
    for (const match of matches) {
      const hotel = match[1].trim();
      if (hotel && !hoteis.includes(hotel)) {
        hoteis.push(hotel);
      }
    }
  });

  return hoteis;
}

function extrairTipoViagemDoOrcamento(orcamento) {
  if (orcamento.toLowerCase().includes('cruzeiro')) return 'Cruzeiro';
  if (orcamento.toLowerCase().includes('hotel')) return 'Hotel';
  if (orcamento.toLowerCase().includes('aéreo')) return 'Aéreo';
  if (orcamento.toLowerCase().includes('circuito')) return 'Circuito';
  
  return 'Pacote';
}

// ================================================================================
// 🌐 APIS DE DICAS E RANKING
// ================================================================================

async function gerarDicasAPI(dados) {
  console.log('🌐 [FASE 2] Chamando API de dicas...');
  
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: construirPromptDicas(dados),
        tipoRequisicao: 'dicas_destino',
        destino: dados.destino,
        metadata: {
          versao: 'fase2_dicas',
          criancas: dados.criancas,
          tipo_viagem: dados.tipoViagem
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    return {
      dicas: result.choices[0].message.content
    };

  } catch (error) {
    console.error('❌ [FASE 2] Erro na API de dicas:', error);
    throw error;
  }
}

async function gerarRankingAPI(dados) {
  console.log('🌐 [FASE 2] Chamando API de ranking...');
  
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: construirPromptRanking(dados),
        tipoRequisicao: 'ranking_hoteis',
        destino: dados.destino,
        metadata: {
          versao: 'fase2_ranking',
          hoteis: dados.hoteis.length
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    return {
      ranking: result.choices[0].message.content
    };

  } catch (error) {
    console.error('❌ [FASE 2] Erro na API de ranking:', error);
    throw error;
  }
}

// ================================================================================
// 📝 CONSTRUÇÃO DE PROMPTS PARA DICAS E RANKING
// ================================================================================

function construirPromptDicas(dados) {
  return `GERAÇÃO DE DICAS PERSONALIZADAS - CVC ITAQUA

DESTINO: ${dados.destino}
TIPO DE VIAGEM: ${dados.tipoViagem}
${dados.criancas > 0 ? `CRIANÇAS: ${dados.criancas} (idades: ${dados.idadesCriancas.join(', ')} anos)` : 'SEM CRIANÇAS'}

INSTRUÇÕES:
1. 🌟 Começar com "🌟 **Dicas para ${dados.destino}**"
2. 🗓️ Incluir melhor época para viajar
3. 🌤️ Clima e sugestões de bagagem
4. 💡 Dicas práticas de documentação
${dados.criancas > 0 ? '5. 👶 Dicas específicas para famílias com crianças' : ''}
6. 🍽️ Gastronomia típica (opcional)

REGRAS DE DOCUMENTAÇÃO:
- Nacional: RG original com foto
- Mercosul: RG original (máx. 10 anos) ou passaporte
- Internacional: Passaporte obrigatório
- Europa: Seguro viagem obrigatório
- EUA: Visto americano obrigatório

NÃO incluir informações do orçamento misturadas.
Focar apenas em dicas úteis para WhatsApp.`;
}

function construirPromptRanking(dados) {
  return `RANKING DE HOTÉIS BASEADO NO ORÇAMENTO - CVC ITAQUA

DESTINO: ${dados.destino}
HOTÉIS DO ORÇAMENTO: ${dados.hoteis.join(', ')}

INSTRUÇÕES:
1. 🏆 Usar APENAS os hotéis do orçamento gerado
2. 📍 Para cada hotel: localização, notas TripAdvisor e Booking
3. ✅ Destacar pontos POSITIVOS de cada hotel
4. 📍 Distâncias: até 2,5km (a pé), acima (de carro)
5. 🎯 Ordem baseada em avaliações e localização

FORMATO:
1️⃣ - [Nome do Hotel]
📍 Localização: [descrição]
⭐ Notas: TripAdvisor: X/5 | Booking.com: X/10
✅ Ponto positivo: [destacar qualidade]
📍 Distâncias:
[Local]: Xm (~Y min a pé) ou Xkm (~Y min de carro)

NÃO inventar hotéis não mencionados no orçamento.`;
}

// ================================================================================
// 🎯 FUNÇÕES DE UTILIDADE E COMPATIBILIDADE
// ================================================================================

function habilitarBotaoDicas() {
  const btnDicas = document.getElementById('btnGerarDicas');
  if (btnDicas) {
    btnDicas.disabled = false;
    btnDicas.title = 'Clique para gerar dicas do destino';
  }
}

function inicializarMedidorCusto() {
  try {
    const dadosSalvos = localStorage.getItem('cvc_custo_meter_corrigido');
    if (dadosSalvos) {
      custoMeter = JSON.parse(dadosSalvos);
      
      // Verificar se é um novo dia
      const hoje = new Date().toDateString();
      if (custoMeter.ultimaAtualizacao !== hoje) {
        resetarContadorDiario();
      }
    }
    
    console.log("💰 [FASE 2] Medidor de custo inicializado");
  } catch (error) {
    console.error("❌ [FASE 2] Erro ao inicializar medidor:", error);
    resetarContadorDiario();
  }
}

function testarConexaoAPICorrigida() {
  console.log("🔌 [FASE 2] Testando conexão com API...");
  
  // Test simples para verificar se API está acessível
  fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'test', tipoRequisicao: 'test' })
  })
  .then(response => {
    if (response.status === 200 || response.status === 400) {
      console.log("✅ [FASE 2] API acessível");
    } else {
      console.warn("⚠️ [FASE 2] API pode estar indisponível");
    }
  })
  .catch(error => {
    console.warn("⚠️ [FASE 2] Erro de conexão com API:", error.message);
  });
}

// ================================================================================
// 📊 SISTEMA DE MÉTRICAS CORRIGIDO
// ================================================================================

function atualizarMetricasCorrigidas(metricas) {
  try {
    const hoje = new Date().toDateString();
    if (custoMeter.ultimaAtualizacao !== hoje) {
      resetarContadorDiario();
    }

    custoMeter.orcamentosHoje++;
    custoMeter.custoTotalHoje += metricas.custo?.brl || 0;
    custoMeter.ultimaAtualizacao = hoje;

    if (metricas.estrategia && metricas.estrategia.includes('Claude')) {
      custoMeter.orcamentosImagem++;
      custoMeter.modelosUsados['claude-3-sonnet']++;
    } else {
      custoMeter.orcamentosTexto++;
      custoMeter.modelosUsados['gpt-4o-mini']++;
    }

    salvarMedidorCusto();

    console.log("📊 [FASE 2] Métricas atualizadas:", {
      estrategia: metricas.estrategia,
      modelo: metricas.modelo_usado,
      custo: `R$ ${(metricas.custo?.brl || 0).toFixed(4)}`,
      total_hoje: `R$ ${custoMeter.custoTotalHoje.toFixed(3)}`
    });

  } catch (error) {
    console.error("❌ [FASE 2] Erro ao atualizar métricas:", error);
  }
}

function salvarMedidorCusto() {
  try {
    localStorage.setItem('cvc_custo_meter_corrigido', JSON.stringify(custoMeter));
  } catch (error) {
    console.error("❌ [FASE 2] Erro ao salvar métricas:", error);
  }
}

function resetarContadorDiario() {
  custoMeter = {
    orcamentosHoje: 0,
    custoTotalHoje: 0,
    economiaHoje: 0,
    orcamentosTexto: 0,
    orcamentosImagem: 0,
    ultimaAtualizacao: new Date().toDateString(),
    modelosUsados: {
      'claude-3-sonnet': 0,
      'gpt-4o-mini': 0,
      'fallback': 0
    }
  };
  salvarMedidorCusto();
}

// ================================================================================
// 🎯 FUNÇÕES DE COMPATIBILIDADE COM SISTEMA EXISTENTE
// ================================================================================

function copiarTexto(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ [FASE 2] Elemento não encontrado:", id);
    alert("Elemento não encontrado!");
    return;
  }

  const texto = elemento.innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log("✅ [FASE 2] Texto copiado:", id);
      mostrarFeedbackCopia("✅ Copiado!");
    }).catch(err => {
      console.error("❌ [FASE 2] Erro ao copiar:", err);
      copiarTextoFallback(texto);
    });
  } else {
    copiarTextoFallback(texto);
  }
}

function copiarTextoFallback(texto) {
  const textArea = document.createElement("textarea");
  textArea.value = texto;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const sucesso = document.execCommand("copy");
    mostrarFeedbackCopia(sucesso ? "✅ Copiado!" : "❌ Erro ao copiar");
  } catch (err) {
    console.error("❌ [FASE 2] Fallback falhou:", err);
    mostrarFeedbackCopia("❌ Erro ao copiar");
  }

  document.body.removeChild(textArea);
}

function mostrarFeedbackCopia(mensagem) {
  // Criar elemento de feedback
  const feedback = document.createElement('div');
  feedback.textContent = mensagem;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(feedback);

  // Remover após 3 segundos
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.parentNode.removeChild(feedback);
    }
  }, 3000);
}

// ================================================================================
// 📝 FUNÇÕES DE LOG E DEBUG
// ================================================================================

function logEventoSucesso(evento, dados) {
  console.log(`🎉 [FASE 2] ${evento}:`, dados);
  
  // Enviar dados para analytics se necessário
  if (window.gtag) {
    window.gtag('event', evento, {
      custom_parameter_1: dados.estrategia,
      custom_parameter_2: dados.tempo_ms,
      custom_parameter_3: dados.tipo_viagem_detectado
    });
  }
}

// ================================================================================
// 🚀 PLACEHOLDER PARA FUNÇÕES FUTURAS
// ================================================================================

function handlePDFAnalysisCorrigido(arquivo) {
  console.log("📄 [FASE 2] Análise de PDF - placeholder para implementação futura");
  // Implementar na próxima fase se necessário
}

// ================================================================================
// 🎯 INICIALIZAÇÃO FINAL
// ================================================================================

console.log("✅ [FASE 2] Sistema de IA CVC Itaqua carregado com todas as correções!");
console.log("🔧 [FASE 2] Funcionalidades implementadas:");
console.log("   ✅ Limpeza de cabeçalhos técnicos");
console.log("   ✅ Conversão automática de aeroportos");
console.log("   ✅ Sistema de links condicionais");
console.log("   ✅ Detecção aprimorada de múltiplas opções");
console.log("   ✅ Distinção correta ida/volta vs somente ida");
console.log("   ✅ Templates específicos para cada tipo");
console.log("   ✅ Ge
