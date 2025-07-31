// ================================================================================
// 🏆 CVC ITAQUA - FRONTEND CORRIGIDO v5.3.1-fixed
// ================================================================================
// CORREÇÕES: Validação campos opcionais + Detecção ida/volta + Sistema completo
// ================================================================================

const API_URL = '/api/ai';
const VERSAO_SISTEMA = '5.3.1-fixed';

console.log(`⚡ CVC ITAQUA - FRONTEND CORRIGIDO v${VERSAO_SISTEMA}`);
console.log("🔧 Correções: Campos opcionais + Detecção ida/volta corrigida");

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
  console.log("🔄 Iniciando sistema corrigido...");
  
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
    
    console.log("✅ Sistema corrigido inicializado!");
    
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    mostrarErroInicializacao(error);
  }
});

// ================================================================================
// 🎯 HANDLER PRINCIPAL CORRIGIDO
// ================================================================================

async function handleOrcamentoCorrigido(e) {
  e.preventDefault();
  console.log("📝 [CORRIGIDO] Processando orçamento com correções...");
  
  const startTime = Date.now();
  
  try {
    showLoadingCorrigido("Validando dados...");
    
    // ================================================================================
    // ✅ VALIDAÇÃO CORRIGIDA PARA CAMPOS OPCIONAIS
    // ================================================================================
    
    const validacao = validarFormularioCorrigido(e.target);
    if (!validacao.valido) {
      throw new Error(`Validação falhou: ${validacao.erros.join(', ')}`);
    }
    
    const formData = validacao.dados;
    console.log("✅ [CORRIGIDO] Dados validados:", {
      tipos: formData.tipos,
      destino: formData.destino || "(detectar automaticamente)",
      adultos: formData.adultos || "(detectar automaticamente)",
      temImagem: formData.temImagem,
      parcelamento: formData.parcelamento?.incluirParcelamento
    });
    
    if (validacao.avisos.length > 0) {
      console.warn("⚠️ [AVISOS]:", validacao.avisos);
    }
    
    // ================================================================================
    // 📊 ANÁLISE CORRIGIDA (IDA/VOLTA FIXED)
    // ================================================================================
    
    showLoadingCorrigido("Analisando conteúdo e detectando tipo de viagem...");
    const analise = analisarConteudoCorrigido(formData);
    console.log("📊 [CORRIGIDO] Análise:", analise);
    
    const estrategia = formData.temImagem ? 'Claude Sonnet (imagem)' : 'GPT-4o-mini (texto)';
    console.log(`🎯 [CORRIGIDO] Estratégia: ${estrategia}`);
    
    // GERAÇÃO DO ORÇAMENTO CORRIGIDO
    showLoadingCorrigido("Gerando orçamento com detecção corrigida...");
    const response = await generateOrcamentoCorrigido(formData, analise);
    
    if (response.metricas) {
      atualizarMetricasCorrigidas(response.metricas);
      console.log("💰 [CORRIGIDO] Custo:", `R$ ${response.metricas.custo.brl.toFixed(4)}`);
    }
    
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteisCorrigido(formData.destino);
    }
    
    const tempoTotal = Date.now() - startTime;
    console.log(`✅ [CORRIGIDO] Orçamento gerado em ${tempoTotal}ms`);
    
    logEventoSucesso('orcamento_corrigido_gerado', {
      estrategia: estrategia,
      tempo_ms: tempoTotal,
      tipo_viagem_detectado: analise.tipoViagem,
      ida_volta_corrigido: analise.isIdaVolta,
      modelo_usado: response.metricas?.modelo_usado
    });
    
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro no processamento:", error);
    showErrorCorrigido(error.message);
    
  } finally {
    hideLoadingCorrigido();
  }
}

// ================================================================================
// ✅ VALIDAÇÃO CORRIGIDA - CAMPOS OPCIONAIS FUNCIONANDO
// ================================================================================

function validarFormularioCorrigido(form) {
  const erros = [];
  const avisos = [];
  
  try {
    const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
    const destino = form.destino?.value?.trim() || "";
    
    // ✅ CORREÇÃO PRINCIPAL: Adultos opcional
    const adultosValue = form.adultos?.value?.trim();
    const adultos = adultosValue ? parseInt(adultosValue) : 0;
    
    const criancas = parseInt(form.criancas?.value) || 0;
    const observacoes = form.observacoes?.value?.trim() || "";
    
    // ================================================================================
    // ✅ VALIDAÇÕES OBRIGATÓRIAS (APENAS TIPO)
    // ================================================================================
    
    if (tipos.length === 0) {
      erros.push("Selecione pelo menos um tipo de serviço");
    }
    
    // ================================================================================
    // ✅ VALIDAÇÕES CONDICIONAIS - SÓ SE PREENCHIDO
    // ================================================================================
    
    // ✅ ADULTOS: Validar apenas se preenchido e maior que 0
    if (adultosValue && (adultos < 1 || adultos > 10)) {
      erros.push("Se informar adultos, deve estar entre 1 e 10");
    }
    
    // Crianças: validar sempre
    if (criancas < 0 || criancas > 10) {
      erros.push("Número de crianças deve estar entre 0 e 10");
    }
    
    // ================================================================================
    // ✅ IDADES DAS CRIANÇAS
    // ================================================================================
    
    let idadesCriancas = [];
    for (let i = 1; i <= criancas; i++) {
      const idadeInput = document.getElementById(`idade_crianca_${i}`);
      if (idadeInput && idadeInput.value) {
        const idade = parseInt(idadeInput.value);
        if (!isNaN(idade) && idade >= 0 && idade <= 17) {
          idadesCriancas.push(idade);
        } else {
          avisos.push(`Idade da criança ${i} inválida`);
        }
      } else if (criancas > 0) {
        avisos.push(`Idade da criança ${i} não informada`);
      }
    }
    
    // ================================================================================
    // ✅ VALIDAÇÃO DE IMAGEM
    // ================================================================================
    
    const arquivoBase64 = formElements.previewArea?.dataset.fileData || "";
    const temImagem = !!(arquivoBase64 && arquivoBase64.startsWith('data:image/'));
    
    if (temImagem) {
      const validacaoImagem = validarImagemCompleta(arquivoBase64);
      if (!validacaoImagem.valida) {
        erros.push(`Imagem inválida: ${validacaoImagem.erro}`);
      }
    }
    
    // ================================================================================
    // ✅ VALIDAÇÃO DE CONTEÚDO (avisos, não erros)
    // ================================================================================
    
    const textoColado = formElements.pasteArea?.innerText?.trim() || '';
    const conteudoTotal = (observacoes + ' ' + textoColado).trim();
    
    if (!temImagem && conteudoTotal.length < 10) {
      avisos.push("Pouco conteúdo fornecido - IA pode ter dificuldade para detectar informações");
    }
    
    if (!destino && !adultosValue && conteudoTotal.length < 50) {
      avisos.push("Campos destino e adultos vazios - certifique-se que as informações estão no texto/imagem");
    }
    
    // ================================================================================
    // ✅ CONFIGURAÇÃO DE PARCELAMENTO
    // ================================================================================
    
    const configuracaoParcelamento = obterConfiguracaoParcelamento();
    
    if (avisos.length > 0) {
      console.warn("⚠️ [VALIDAÇÃO] Avisos:", avisos);
    }
    
    if (erros.length > 0) {
      console.error("❌ [VALIDAÇÃO] Erros:", erros);
      return { valido: false, erros: erros, avisos: avisos };
    }
    
    // ================================================================================
    // ✅ RETORNAR DADOS VALIDADOS CORRIGIDOS
    // ================================================================================
    
    return {
      valido: true,
      erros: [],
      avisos: avisos,
      dados: {
        destino: destino, // Pode ser vazio
        adultos: adultosValue || "", // ✅ CORRIGIDO: Pode ser vazio
        criancas: criancas.toString(),
        idades: idadesCriancas.join(', '),
        observacoes: observacoes,
        tipos: tipos,
        textoColado: textoColado,
        arquivoBase64: arquivoBase64,
        temImagem: temImagem,
        parcelamento: configuracaoParcelamento
      }
    };
    
  } catch (error) {
    console.error("❌ [VALIDAÇÃO] Erro interno:", error);
    return {
      valido: false,
      erros: [`Erro interno na validação: ${error.message}`],
      avisos: []
    };
  }
}

// ================================================================================
// 📊 ANÁLISE CORRIGIDA - DETECÇÃO IDA/VOLTA FIXED
// ================================================================================

function analisarConteudoCorrigido(formData) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  // Análise de múltiplas opções
  const multiplasOpcoes = detectarMultiplasOpcoes(textoCompleto);
  
  // Análise de escalas
  const temEscalas = detectarEscalas(textoCompleto);
  
  // ================================================================================
  // 🔧 DETECÇÃO CORRIGIDA DE IDA E VOLTA
  // ================================================================================
  
  const tipoViagem = analisarTipoViagemCorrigido(textoCompleto);
  
  console.log(`[ANÁLISE-CORRIGIDA] Texto analisado: ${textoCompleto.length} chars`);
  console.log(`[ANÁLISE-CORRIGIDA] Tipo detectado: ${tipoViagem.tipo} (confiança: ${tipoViagem.confianca})`);
  
  // Contadores gerais
  const precos = (textoCompleto.match(/r\$[\d.,]+/gi) || []).length;
  const horarios = (textoCompleto.match(/\d{2}:\d{2}/g) || []).length;
  const datas = (textoCompleto.match(/\d{2}\/\d{2}|\d{2} de \w+/gi) || []).length;
  const companhias = (textoCompleto.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  
  return {
    multiplasOpcoes: multiplasOpcoes.detectado,
    quantidadeOpcoes: multiplasOpcoes.quantidade,
    tipoViagem: tipoViagem.tipo,
    isIdaVolta: tipoViagem.tipo === 'ida_volta',
    temEscalas: temEscalas,
    confiancaTipoViagem: tipoViagem.confianca,
    contadores: {
      precos: precos,
      horarios: horarios,
      datas: datas,
      companhias: companhias
    }
  };
}

// ================================================================================
// 🔧 FUNÇÃO CORRIGIDA PARA DETECTAR IDA E VOLTA
// ================================================================================

function analisarTipoViagemCorrigido(texto) {
  if (!texto) return { tipo: 'somente_ida', confianca: 0 };
  
  const textoLower = texto.toLowerCase();
  
  console.log(`[TIPO-VIAGEM] Analisando texto: "${textoLower.substring(0, 200)}..."`);
  
  // ================================================================================
  // 🔍 INDICADORES EXPLÍCITOS DE IDA E VOLTA
  // ================================================================================
  
  // Palavras-chave explícitas
  const indicadoresIdaVolta = [
    'ida e volta', 'ida/volta', 'ida + volta', 'round trip',
    '\\b(\\d+) dias e (\\d+) noites', // "5 dias e 4 noites"
    'volta.*\\d{2}.*\\d{2}', // "volta dom, 12 de outubro"
    'retorno.*\\d{2}.*\\d{2}' // "retorno sex, 01 de agosto"
  ];
  
  let pontuacaoIdaVolta = 0;
  
  indicadoresIdaVolta.forEach(indicador => {
    const regex = new RegExp(indicador, 'gi');
    const matches = (textoLower.match(regex) || []).length;
    if (matches > 0) {
      pontuacaoIdaVolta += matches;
      console.log(`[IDA-VOLTA] Encontrado indicador: "${indicador}" (${matches}x)`);
    }
  });
  
  // ================================================================================
  // 🔍 DETECÇÃO POR ESTRUTURA DE DATAS
  // ================================================================================
  
  // Procurar por duas datas diferentes no texto
  const datas = textoLower.match(/\d{1,2}\/\d{1,2}|\d{1,2} de \w+/gi) || [];
  const datasUnicas = [...new Set(datas)];
  
  if (datasUnicas.length >= 2) {
    pontuacaoIdaVolta += 2;
    console.log(`[IDA-VOLTA] Múltiplas datas encontradas: ${datasUnicas.join(', ')}`);
  }
  
  // ================================================================================
  // 🔍 DETECÇÃO POR ESTRUTURA DE HORÁRIOS
  // ================================================================================
  
  // Procurar padrões "Ida:" e "Volta:" ou similar
  const temPadraoIdaVolta = /ida.*\d{2}:\d{2}.*volta.*\d{2}:\d{2}/gi.test(textoLower) ||
                            /\d{2}:\d{2}.*ida.*\d{2}:\d{2}.*volta/gi.test(textoLower);
  
  if (temPadraoIdaVolta) {
    pontuacaoIdaVolta += 3;
    console.log(`[IDA-VOLTA] Padrão ida/volta em horários detectado`);
  }
  
  // ================================================================================
  // 🔍 DETECÇÃO POR PERÍODO (X DIAS E Y NOITES)
  // ================================================================================
  
  const periodoMatch = textoLower.match(/(\d+) dias e (\d+) noites/gi);
  if (periodoMatch) {
    pontuacaoIdaVolta += 2;
    console.log(`[IDA-VOLTA] Período detectado: ${periodoMatch[0]}`);
  }
  
  // ================================================================================
  // 🔍 INDICADORES DE SOMENTE IDA
  // ================================================================================
  
  let pontuacaoSomenteIda = 0;
  
  const indicadoresSomenteIda = [
    'somente ida', 'só ida', 'one way', 'apenas ida'
  ];
  
  indicadoresSomenteIda.forEach(indicador => {
    if (textoLower.includes(indicador)) {
      pontuacaoSomenteIda += 3;
      console.log(`[SOMENTE-IDA] Encontrado indicador: "${indicador}"`);
    }
  });
  
  // Se há apenas uma data/horário e não há indicadores de volta
  const horarios = (textoLower.match(/\d{2}:\d{2}/g) || []).length;
  if (horarios <= 2 && datasUnicas.length === 1 && pontuacaoIdaVolta === 0) {
    pontuacaoSomenteIda += 1;
    console.log(`[SOMENTE-IDA] Poucos horários/datas detectados`);
  }
  
  // ================================================================================
  // 🎯 DECISÃO FINAL
  // ================================================================================
  
  console.log(`[DECISÃO] Pontuação Ida/Volta: ${pontuacaoIdaVolta} | Somente Ida: ${pontuacaoSomenteIda}`);
  
  let tipoFinal = 'somente_ida';
  let confiancaFinal = pontuacaoSomenteIda;
  
  if (pontuacaoIdaVolta > pontuacaoSomenteIda) {
    tipoFinal = 'ida_volta';
    confiancaFinal = pontuacaoIdaVolta;
  }
  
  console.log(`[RESULTADO] Tipo final: ${tipoFinal} (confiança: ${confiancaFinal})`);
  
  return { 
    tipo: tipoFinal, 
    confianca: confiancaFinal,
    debug: {
      indicadoresIdaVolta: pontuacaoIdaVolta,
      indicadoresSomenteIda: pontuacaoSomenteIda,
      datasEncontradas: datasUnicas,
      horariosCount: horarios
    }
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE MÚLTIPLAS OPÇÕES E ESCALAS (mantidas iguais)
// ================================================================================

function detectarMultiplasOpcoes(texto) {
  if (!texto) return { detectado: false, quantidade: 0 };
  
  const textoLower = texto.toLowerCase();
  
  const precos = (textoLower.match(/r\$.*?\d{1,3}[\.,]\d{3}/gi) || []).length;
  const totais = (textoLower.match(/total.*\d+.*adult/gi) || []).length;
  const companhias = (textoLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  const links = (textoLower.match(/https:\/\/www\.cvc\.com\.br\/carrinho/gi) || []).length;
  
  let quantidade = Math.max(precos, totais, companhias, links);
  const detectado = quantidade >= 2;
  
  return {
    detectado: detectado,
    quantidade: detectado ? quantidade : 1,
    indicadores: { precos, totais, companhias, links }
  };
}

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
  console.log("🤖 [CORRIGIDO] Gerando orçamento com detecção corrigida...");
  
  try {
    const response = await callAICorrigida(formData, analise);
    
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Resposta da API em formato inválido');
    }
    
    const conteudo = response.choices[0].message.content;
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Conteúdo da resposta está vazio');
    }
    
    const conteudoLimpo = limparCabecalhosTecnicos(conteudo);
    
    updateElementCorrigido("orcamentoIA", conteudoLimpo);
    
    console.log("✅ [CORRIGIDO] Orçamento gerado:", {
      tamanho: conteudoLimpo.length,
      modelo: response.metricas?.modelo_usado,
      tipo_detectado: analise.tipoViagem,
      ida_volta: analise.isIdaVolta
    });
    
    return response;
    
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro na geração:", error);
    throw new Error(`Falha na geração do orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🔗 COMUNICAÇÃO CORRIGIDA COM API
// ================================================================================

async function callAICorrigida(formData, analise) {
  console.log("🔄 [CORRIGIDO] Enviando para API corrigida...");
  
  const requestData = {
    prompt: construirPromptCorrigido(formData, analise),
    tipo: 'orcamento',
    destino: formData.destino || 'Detectar automaticamente',
    tipos: Array.isArray(formData.tipos) ? formData.tipos : [],
    temImagem: Boolean(formData.temImagem),
    arquivo: formData.temImagem ? formData.arquivoBase64 : undefined,
    parcelamento: formData.parcelamento,
    tipoViagem: analise.tipoViagem, // ✅ NOVO: Enviar tipo detectado
    camposOpcionais: {
      destino: !formData.destino,
      adultos: !formData.adultos
    }
  };
  
  console.log("📤 [CORRIGIDO] Dados da requisição:", {
    tipo_viagem_detectado: analise.tipoViagem,
    ida_volta: analise.isIdaVolta,
    confianca: analise.confiancaTipoViagem,
    temImagem: requestData.temImagem
  });
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `CVC-Itaqua-Frontend-Corrigido/${VERSAO_SISTEMA}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
        } catch (jsonError) {
          errorMessage = errorText.substring(0, 200);
        }
      } catch (readError) {
        console.error("❌ [CORRIGIDO] Erro ao ler resposta:", readError);
      }
      
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    let data = JSON.parse(responseText);
    
    if (data.success === false) {
      throw new Error(data.error?.message || data.error || 'Erro da API');
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Resposta da API inválida');
    }
    
    return data;
    
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro na comunicação:", error);
    throw error;
  }
}

function construirPromptCorrigido(formData, analise) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  let prompt = `Dados do orçamento CORRIGIDO:
Destino: ${formData.destino || "(detectar automaticamente dos dados)"}
Adultos: ${formData.adultos || "(detectar automaticamente dos dados)"}
Crianças: ${formData.criancas}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos.join(', ')}

DADOS ESPECÍFICOS DA VIAGEM:
${textoCompleto}

ANÁLISE CORRIGIDA:
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Escalas/conexões: ${analise.temEscalas ? 'SIM' : 'NÃO'}
- Tipo de viagem DETECTADO: ${analise.tipoViagem}
- É ida e volta: ${analise.isIdaVolta ? 'SIM' : 'NÃO'}
- Confiança da detecção: ${analise.confiancaTipoViagem}`;

  if (formData.parcelamento && formData.parcelamento.incluirParcelamento) {
    prompt += `
- Parcelamento solicitado: ${formData.parcelamento.parcelas10x ? '10x' : ''}${formData.parcelamento.mostrarAmbos ? ' e ' : ''}${formData.parcelamento.parcelas12x ? '12x' : ''}`;
  }

  return prompt;
}

// ================================================================================
// 🧹 LIMPEZA DE CABEÇALHOS (mantida igual)
// ================================================================================

function limparCabecalhosTecnicos(conteudo) {
  let limpo = conteudo;
  
  const cabecalhosRemover = [
    /PRODUTO SELECIONADO:.*?\n/gi,
    /MÚLTIPLAS OPÇÕES:.*?\n/gi,
    /TEMPLATE OBRIGATÓRIO:.*?\n/gi,
    /INSTRUÇÕES.*?\n/gi,
    /DADOS DO CLIENTE:.*?\n/gi,
    /FORMATO PARA USAR:.*?\n/gi
  ];

  cabecalhosRemover.forEach(regex => {
    limpo = limpo.replace(regex, '');
  });

  limpo = limpo.replace(/\n\s*\n\s*\n/g, '\n\n');
  limpo = limpo.replace(/^\s*\n+/, '');
  
  return limpo.trim();
}

// ================================================================================
// 🎨 INTERFACE CORRIGIDA
// ================================================================================

function updateElementCorrigido(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ [CORRIGIDO] Elemento '${id}' não encontrado`);
      return false;
    }
    
    if (typeof content !== 'string') {
      content = String(content);
    }
    
    element.innerText = content;
    console.log(`📝 [CORRIGIDO] Elemento '${id}' atualizado (${content.length} chars)`);
    return true;
    
  } catch (error) {
    console.error(`❌ [CORRIGIDO] Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoadingCorrigido(mensagem = "Processando...") {
  updateElementCorrigido("orcamentoIA", `🤖 ${mensagem}`);
}

function hideLoadingCorrigido() {
  console.log("🔄 [CORRIGIDO] Loading ocultado");
}

function showErrorCorrigido(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElementCorrigido("orcamentoIA", errorMessage);
  
  if (!sucesso) {
    alert(errorMessage);
  }
}

// ================================================================================
// 🔧 FUNCIONALIDADES AUXILIARES CORRIGIDAS
// ================================================================================

async function generateRankingHoteisCorrigido(destino) {
  if (!destino || destino.trim().length === 0) {
    console.warn("⚠️ [CORRIGIDO] Destino vazio para ranking");
    return;
  }
  
  console.log("🏨 [CORRIGIDO] Gerando ranking de hotéis...");
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;

  try {
    const response = await callAICorrigida({ 
      tipos: ['Hotel'], 
      destino: destino,
      observacoes: prompt,
      textoColado: '',
      temImagem: false,
      parcelamento: { incluirParcelamento: false }
    }, { multiplasOpcoes: false, temEscalas: false, tipoViagem: 'hotel' });
    
    updateElementCorrigido("rankingIA", response.choices[0].message.content);
    console.log("✅ [CORRIGIDO] Ranking de hotéis gerado");
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro no ranking:", error);
    updateElementCorrigido("rankingIA", `❌ Erro ao gerar ranking: ${error.message}`);
  }
}

async function handlePDFAnalysisCorrigido() {
  if (!formElements.pdfUpload) {
    alert("Erro: Sistema de upload não disponível");
    return;
  }
  
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Arquivo muito grande. Máximo: 10MB");
    return;
  }
  
  const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!tiposPermitidos.includes(file.type)) {
    alert(`Tipo não suportado: ${file.type}`);
    return;
  }
  
  showLoadingCorrigido("Analisando arquivo...");
  
  try {
    const base64 = await fileToBase64Seguro(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. 📊 Principais métricas de vendas
2. 🎯 Metas vs realizado
3. 🏆 Produtos mais vendidos
4. 💡 Recomendações práticas

Formato executivo para a filial 6220.`;

    const response = await callAICorrigida({
      tipos: ['Analise'],
      destino: '',
      observacoes: prompt,
      textoColado: '',
      temImagem: true,
      arquivoBase64: base64,
      parcelamento: { incluirParcelamento: false }
    }, { multiplasOpcoes: false, temEscalas: false, tipoViagem: 'analise' });
    
    updateElementCorrigido("analiseIA", response.choices[0].message.content);
    
    const container = document.getElementById('analiseContainer');
    if (container) {
      container.style.display = 'block';
    }
    
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro na análise:", error);
    updateElementCorrigido("analiseIA", `❌ Erro: ${error.message}`);
  } finally {
    hideLoadingCorrigido();
  }
}

// ================================================================================
// 🎨 SISTEMA DE PASTE AREA CORRIGIDO
// ================================================================================

function setupPasteAreaCorrigida() {
  if (!formElements.pasteArea) {
    console.warn("⚠️ [CORRIGIDO] PasteArea não encontrada");
    return;
  }
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 [CORRIGIDO] Conteúdo sendo colado...");
    
    e.preventDefault();
    
    try {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
          console.log("🖼️ [CORRIGIDO] Imagem detectada");
          
          const blob = item.getAsFile();
          
          if (!blob) {
            console.error("❌ [CORRIGIDO] Falha ao obter blob");
            continue;
          }
          
          if (blob.size > 5 * 1024 * 1024) {
            alert('Imagem muito grande (máx: 5MB)');
            continue;
          }
          
          const reader = new FileReader();
          
          reader.onload = function (event) {
            try {
              const base64Data = event.target.result;
              
              const img = document.createElement('img');
              img.src = base64Data;
              img.style.maxWidth = '100%';
              img.style.borderRadius = '8px';
              img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              
              formElements.previewArea.innerHTML = `
                <p>✅ Imagem colada - Sistema corrigido!</p>
                <div style="font-size: 12px; color: #666; margin: 5px 0;">
                  📊 Análise visual | 🔍 Detecção ida/volta corrigida
                </div>
              `;
              formElements.previewArea.appendChild(img);
              formElements.previewArea.dataset.fileData = base64Data;
              
              console.log('✅ [CORRIGIDO] Imagem processada');
              
            } catch (error) {
              console.error('❌ [CORRIGIDO] Erro ao processar imagem:', error);
              formElements.previewArea.innerHTML = '<p>❌ Erro ao processar imagem</p>';
            }
          };
          
          reader.onerror = function() {
            console.error('❌ [CORRIGIDO] Erro ao ler imagem');
            formElements.previewArea.innerHTML = '<p>❌ Erro ao ler imagem</p>';
          };
          
          reader.readAsDataURL(blob);
          break;
          
        } else if (item.type === 'text/plain') {
          item.getAsString(function (text) {
            if (text && text.trim().length > 0) {
              // Detectar tipo de viagem no texto colado
              const tipoDetectado = analisarTipoViagemCorrigido(text);
              const tipoTexto = tipoDetectado.tipo === 'ida_volta' ? '✈️ Ida/Volta detectado' : '✈️ Somente ida detectado';
              
              formElements.previewArea.innerHTML = `
                <p>📝 Texto colado - Sistema corrigido!</p>
                <div style="font-size: 12px; color: #666;">${text.substring(0, 100)}... | ${tipoTexto}</div>
              `;
              console.log('📝 [CORRIGIDO] Texto processado:', text.length, 'chars, tipo:', tipoDetectado.tipo);
            }
          });
        }
      }
      
    } catch (error) {
      console.error('❌ [CORRIGIDO] Erro no paste:', error);
      formElements.previewArea.innerHTML = '<p>❌ Erro ao processar conteúdo</p>';
    }
  });
  
  // Efeitos visuais
  formElements.pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#003399';
    this.style.backgroundColor = '#e9ecef';
    this.textContent = '📎 Solte aqui - Sistema corrigido!';
  });

  formElements.pasteArea.addEventListener('dragleave', function(e) {
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude | ✅ Detecção ida/volta corrigida';
  });
  
  console.log("✅ [CORRIGIDO] PasteArea configurada");
}

// ================================================================================
// 📁 UPLOAD DE ARQUIVO CORRIGIDO
// ================================================================================

async function handleFileUploadCorrigido(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 [CORRIGIDO] Arquivo selecionado:", file.name);

  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Apenas imagens são aceitas (PNG, JPG, JPEG)');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo: 5MB');
    }

    showLoadingCorrigido("Processando imagem...");
    const base64 = await fileToBase64Seguro(file);
    
    const validacao = validarImagemCompleta(base64);
    if (!validacao.valida) {
      throw new Error(validacao.erro);
    }
    
    if (formElements.previewArea) {
      formElements.previewArea.dataset.fileData = base64;
      
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      
      formElements.previewArea.innerHTML = `
        <p>✅ Imagem carregada - Sistema corrigido!</p>
        <div style="font-size: 12px; color: #666; margin: 5px 0;">
          📊 ${validacao.mimeType} | ${validacao.tamanhoMB}MB | 🟠 Análise visual corrigida
        </div>
      `;
      formElements.previewArea.appendChild(img);
    }
    
    console.log('✅ [CORRIGIDO] Imagem processada:', validacao.tamanhoMB, 'MB');
    
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro no upload:", error);
    
    if (formElements.previewArea) {
      formElements.previewArea.innerHTML = `<p>❌ Erro: ${error.message}</p>`;
    }
    
    alert(`Erro: ${error.message}`);
  } finally {
    hideLoadingCorrigido();
  }
}

// ================================================================================
// 🔧 VALIDAÇÃO DE IMAGEM (mantida igual)
// ================================================================================

function validarImagemCompleta(base64String) {
  try {
    if (!base64String || typeof base64String !== 'string') {
      return { valida: false, erro: 'String base64 inválida' };
    }
    
    if (!base64String.startsWith('data:image/')) {
      return { valida: false, erro: 'Não é uma imagem base64 válida' };
    }
    
    const match = base64String.match(/data:(image\/[^;]+);base64,(.+)/);
    if (!match || !match[1] || !match[2]) {
      return { valida: false, erro: 'Formato base64 incorreto' };
    }
    
    const mimeType = match[1];
    const base64Data = match[2];
    
    const tiposSuportados = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposSuportados.includes(mimeType)) {
      return { valida: false, erro: `Tipo ${mimeType} não suportado` };
    }
    
    try {
      atob(base64Data.substring(0, 100));
    } catch (e) {
      return { valida: false, erro: 'Dados base64 corrompidos' };
    }
    
    const sizeInBytes = base64Data.length * 0.75;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      return { valida: false, erro: `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB` };
    }
    
    if (sizeInMB < 0.001) {
      return { valida: false, erro: 'Arquivo muito pequeno' };
    }
    
    return { 
      valida: true, 
      mimeType, 
      tamanhoMB: sizeInMB.toFixed(2),
      tamanhoBase64: base64Data.length
    };
    
  } catch (error) {
    return { valida: false, erro: `Erro na validação: ${error.message}` };
  }
}

function fileToBase64Seguro(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Arquivo inválido'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result;
        if (!result || typeof result !== 'string') {
          reject(new Error('Resultado inválido'));
          return;
        }
        resolve(result);
      } catch (error) {
        reject(new Error(`Erro no processamento: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.onabort = () => {
      reject(new Error('Leitura cancelada'));
    };
    
    const timeout = setTimeout(() => {
      reader.abort();
      reject(new Error('Timeout na leitura (30s)'));
    }, 30000);
    
    reader.onloadend = () => {
      clearTimeout(timeout);
    };
    
    reader.readAsDataURL(file);
  });
}

// ================================================================================
// 🧪 TESTE DE CONEXÃO CORRIGIDO
// ================================================================================

async function testarConexaoAPICorrigida() {
  try {
    console.log("🧪 [CORRIGIDO] Testando API corrigida...");
    
    const response = await fetch(API_URL, { 
      method: 'GET',
      headers: {
        'User-Agent': `CVC-Itaqua-Frontend-Corrigido/${VERSAO_SISTEMA}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ [CORRIGIDO] API Online:", {
        version: data.version,
        melhorias: data.melhorias
      });
    } else {
      console.warn("⚠️ [CORRIGIDO] API com problemas:", response.status);
    }
  } catch (error) {
    console.error("❌ [CORRIGIDO] Erro na conexão:", error.message);
  }
}

// ================================================================================
// 💰 SISTEMA DE MEDIDOR DE CUSTO CORRIGIDO
// ================================================================================

function inicializarMedidorCusto() {
  try {
    console.log("💰 [CUSTO] Inicializando medidor corrigido...");
    
    const dadosSalvos = localStorage.getItem('cvc_custo_meter_corrigido');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      
      if (dados.ultimaAtualizacao === new Date().toDateString()) {
        custoMeter = { ...custoMeter, ...dados };
        console.log("💰 [CUSTO] Dados carregados");
      } else {
        resetarContadorDiario();
      }
    }
    
    criarWidgetCustoCorrigido();
    atualizarWidgetCustoCorrigido();
    
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao inicializar:", error);
    resetarContadorDiario();
  }
}

function criarWidgetCustoCorrigido() {
  if (document.getElementById('custoWidgetCorrigido')) return;
  
  const widget = document.createElement('div');
  widget.id = 'custoWidgetCorrigido';
  widget.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 3px 15px rgba(0,0,0,0.2);
    z-index: 1001;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255,255,255,0.2);
    min-width: 160px;
  `;
  
  widget.addEventListener('click', mostrarDashboardCorrigido);
  
  document.body.appendChild(widget);
  console.log("✅ [CUSTO] Widget corrigido criado");
}

function atualizarWidgetCustoCorrigido() {
  const widget = document.getElementById('custoWidgetCorrigido');
  if (!widget) return;
  
  widget.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 13px; font-weight: bold;">💰 Hoje: R$ ${custoMeter.custoTotalHoje.toFixed(3)}</div>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
        📊 ${custoMeter.orcamentosHoje} orçamentos corrigidos
      </div>
      <div style="font-size: 9px; opacity: 0.8; margin-top: 1px;">
        🔵${custoMeter.orcamentosTexto} texto | 🟠${custoMeter.orcamentosImagem} imagem
      </div>
    </div>
  `;
}

function mostrarDashboardCorrigido() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 12px; 
                max-width: 700px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <h3 style="color: #003399; margin-bottom: 1.5rem;">📊 Dashboard Corrigido - CVC Itaqua</h3>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #1976d2;">
            R$ ${custoMeter.custoTotalHoje.toFixed(3)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Total</div>
        </div>
        
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #388e3c;">
            ${custoMeter.orcamentosHoje}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Orçamentos</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #f57c00;">
            ✅
          </div>
          <div style="font-size: 0.9rem; color: #666;">Validação OK</div>
        </div>
        
        <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #8e24aa;">
            🔧
          </div>
          <div style="font-size: 0.9rem; color: #666;">Corrigido</div>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: left;">
        <strong>🔧 Correções Aplicadas:</strong><br>
        ✅ Validação de campos opcionais corrigida<br>
        ✅ Detecção ida/volta vs somente ida corrigida<br>
        ✅ Sistema de parcelamento funcional<br>
        ✅ Análise inteligente de tipo de viagem<br>
        ✅ Orçamentos limpos sem cabeçalhos técnicos<br>
        ✅ Detecção de escalas e conversão de aeroportos<br>
        ✅ Interface responsiva e moderna
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: #003399; color: white; border: none; 
                     padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer;">
        Fechar Dashboard
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function atualizarMetricasCorrigidas(metricas) {
  try {
    const hoje = new Date().toDateString();
    if (custoMeter.ultimaAtualizacao !== hoje) {
      resetarContadorDiario();
    }
    
    custoMeter.orcamentosHoje++;
    custoMeter.custoTotalHoje += metricas.custo.brl;
    custoMeter.ultimaAtualizacao = hoje;
    
    if (metricas.estrategia && metricas.estrategia.includes('Claude')) {
      custoMeter.orcamentosImagem++;
      custoMeter.modelosUsados['claude-3-sonnet']++;
    } else {
      custoMeter.orcamentosTexto++;
      custoMeter.modelosUsados['gpt-4o-mini']++;
    }
    
    salvarMedidorCusto();
    atualizarWidgetCustoCorrigido();
    
    console.log("📊 [MÉTRICAS-CORRIGIDO] Atualizadas:", {
      estrategia: metricas.estrategia,
      modelo: metricas.modelo_usado,
      custo: `R$ ${metricas.custo.brl.toFixed(4)}`,
      total_hoje: `R$ ${custoMeter.custoTotalHoje.toFixed(3)}`
    });
    
  } catch (error) {
    console.error("❌ [MÉTRICAS] Erro ao atualizar:", error);
  }
}

function salvarMedidorCusto() {
  try {
    localStorage.setItem('cvc_custo_meter_corrigido', JSON.stringify(custoMeter));
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao salvar:", error);
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
// 🎯 FUNÇÕES PRINCIPAIS MANTIDAS (compatibilidade)
// ================================================================================

function copiarTexto(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ Elemento não encontrado:", id);
    alert("Elemento não encontrado!");
    return;
  }
  
  const texto = elemento.innerText;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log("✅ Texto copiado:", id);
      mostrarFeedbackCopia(event.target, "✅ Copiado!");
    }).catch(err => {
      console.warn("❌ Clipboard falhou:", err);
      tentarCopiaAlternativa(texto, event.target);
    });
  } else {
    tentarCopiaAlternativa(texto, event.target);
  }
}

function tentarCopiaAlternativa(texto, button) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log("✅ Copiado via execCommand");
      mostrarFeedbackCopia(button, "✅ Copiado!");
    } else {
      throw new Error("execCommand falhou");
    }
  } catch (err) {
    console.error("❌ Cópia falhou:", err);
    mostrarFeedbackCopia(button, "❌ Erro");
  }
}

function mostrarFeedbackCopia(button, texto) {
  if (!button) return;
  
  const originalText = button.innerText;
  button.innerText = texto;
  button.style.background = '#28a745';
  
  setTimeout(() => {
    button.innerText = originalText;
    button.style.background = '';
  }, 2000);
}

function habilitarBotaoDicas() {
  const btnGerar = document.getElementById('btnGerarDicas');
  if (btnGerar) {
    btnGerar.disabled = false;
    console.log("✅ Botão dicas habilitado");
  }
}

function atualizarIdadesCriancas() {
  const qtdeCriancas = parseInt(document.getElementById('criancas').value) || 0;
  const container = document.getElementById('containerIdadesCriancas');
  const camposContainer = document.getElementById('camposIdadesCriancas');
  
  if (qtdeCriancas > 0) {
    container.style.display = 'block';
    camposContainer.innerHTML = '';
    
    for (let i = 1; i <= qtdeCriancas; i++) {
      const div = document.createElement('div');
      div.style.marginBottom = '0.5rem';
      div.innerHTML = `
        <label for="idade_crianca_${i}" style="display: inline-block; width: 120px;">Criança ${i}:</label>
        <input type="number" id="idade_crianca_${i}" name="idade_crianca_${i}" 
               min="0" max="17" placeholder="Idade" 
               style="width: 80px; margin-right: 10px;">
        <small style="color: #666;">anos</small>
      `;
      camposContainer.appendChild(div);
    }
  } else {
    container.style.display = 'none';
    camposContainer.innerHTML = '';
  }
}

// ================================================================================
//
