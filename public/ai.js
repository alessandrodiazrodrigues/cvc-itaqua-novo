// ================================================================================
// 🏆 CVC ITAQUA - FRONTEND CORRIGIDO v4.3.0-fix
// ================================================================================
// Principais correções:
// 1. Validação rigorosa antes de enviar para API
// 2. Tratamento robusto de erros da API
// 3. Logs detalhados para debugging
// 4. Fallback melhorado para casos de falha
// 5. Detecção inteligente de tipos de viagem
// ================================================================================

const API_URL = '/api/ai';
const VERSAO_SISTEMA = '4.3.0-fix';

console.log(`⚡ CVC ITAQUA - FRONTEND CORRIGIDO v${VERSAO_SISTEMA}`);
console.log("🔧 Melhorias: Validação rigorosa + Tratamento de erros + Logs detalhados");

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
// 🔧 INICIALIZAÇÃO COM VALIDAÇÃO
// ================================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema corrigido...");
  
  try {
    // Mapear elementos do DOM com validação
    formElements = {
      form: document.getElementById("orcamentoForm"),
      pasteArea: document.getElementById("pasteArea"),
      previewArea: document.getElementById("previewArea"),
      arquivo: document.getElementById("arquivo"),
      pdfUpload: document.getElementById("pdfUpload")
    };

    // Verificar elementos essenciais
    const elementosEssenciais = ['form'];
    const elementosFaltando = elementosEssenciais.filter(nome => !formElements[nome]);
    
    if (elementosFaltando.length > 0) {
      console.warn("⚠️ Elementos DOM faltando:", elementosFaltando);
    }

    // Configurar event listeners com validação
    if (formElements.form) {
      formElements.form.addEventListener("submit", handleOrcamentoSubmitSeguro);
      console.log("✅ Formulário principal conectado");
    }
    
    if (formElements.arquivo) {
      formElements.arquivo.addEventListener("change", handleFileUploadSeguro);
      console.log("✅ Upload de arquivo conectado");
    }

    if (formElements.pdfUpload) {
      window.analisarPDF = handlePDFAnalysisSeguro;
      console.log("✅ Análise de PDF conectada");
    }

    // Inicializar componentes
    setupPasteAreaSegura();
    inicializarMedidorCusto();
    testarConexaoAPISegura();
    
    console.log("✅ Sistema corrigido inicializado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    mostrarErroInicializacao(error);
  }
});

// ================================================================================
// 🎯 HANDLER PRINCIPAL SEGURO
// ================================================================================

async function handleOrcamentoSubmitSeguro(e) {
  e.preventDefault();
  console.log("📝 [SEGURO] Processando orçamento...");
  
  const startTime = Date.now();
  
  try {
    // Mostrar loading
    showLoadingSeguro("Validando dados...");
    
    // VALIDAÇÃO RIGOROSA DOS DADOS
    const validacao = validarFormularioCompleto(e.target);
    if (!validacao.valido) {
      throw new Error(`Validação falhou: ${validacao.erros.join(', ')}`);
    }
    
    const formData = validacao.dados;
    console.log("✅ [SEGURO] Dados validados:", {
      tipos: formData.tipos,
      temImagem: formData.temImagem,
      destino: formData.destino,
      tamanhoTexto: formData.observacoes.length
    });
    
    // Análise prévia
    showLoadingSeguro("Analisando conteúdo...");
    const analise = analisarConteudoCompleto(formData);
    console.log("📊 [SEGURO] Análise:", analise);
    
    // Mostrar estratégia detectada
    const estrategia = formData.temImagem ? 'Claude Sonnet (imagem)' : 'GPT-4o-mini (texto)';
    updateElementSeguro("orcamentoIA", `🎯 Estratégia: ${estrategia}\n📊 ${analise.descricao}`);
    
    // GERAÇÃO DO ORÇAMENTO
    showLoadingSeguro("Processando com IA...");
    const response = await generateOrcamentoSeguro(formData, analise);
    
    // Processar métricas se disponíveis
    if (response.metricas) {
      atualizarMetricasHibridas(response.metricas);
      mostrarFeedbackCustoHibrido(response.metricas);
    }
    
    // Funcionalidades auxiliares
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteisSeguro(formData.destino);
    }
    
    const tempoTotal = Date.now() - startTime;
    console.log(`✅ [SEGURO] Orçamento gerado com sucesso em ${tempoTotal}ms`);
    
    // Log de sucesso
    logEventoSucesso('orcamento_gerado', {
      estrategia: estrategia,
      tempo_ms: tempoTotal,
      multiplas_opcoes: analise.multiplasOpcoes,
      modelo_usado: response.metricas?.modelo_usado
    });
    
  } catch (error) {
    console.error("❌ [SEGURO] Erro no processamento:", error);
    
    // Log de erro detalhado
    logEventoErro('orcamento_falhou', error, {
      tempo_ms: Date.now() - startTime,
      stack: error.stack
    });
    
    // Mostrar erro amigável
    showErrorSeguro(error.message);
    
    // Tentar diagnóstico automático
    setTimeout(() => diagnosticarProblema(error), 1000);
    
  } finally {
    hideLoadingSeguro();
  }
}

// ================================================================================
// 🔍 VALIDAÇÃO RIGOROSA DO FORMULÁRIO
// ================================================================================

function validarFormularioCompleto(form) {
  const erros = [];
  const avisos = [];
  
  try {
    // Extrair dados básicos
    const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
    const destino = form.destino?.value?.trim() || "";
    const adultos = parseInt(form.adultos?.value) || 0;
    const criancas = parseInt(form.criancas?.value) || 0;
    const observacoes = form.observacoes?.value?.trim() || "";
    
    // Validações obrigatórias
    if (tipos.length === 0) {
      erros.push("Selecione pelo menos um tipo de serviço");
    }
    
    if (adultos < 1 || adultos > 10) {
      erros.push("Número de adultos deve estar entre 1 e 10");
    }
    
    if (criancas < 0 || criancas > 10) {
      erros.push("Número de crianças deve estar entre 0 e 10");
    }
    
    // Validar idades das crianças se especificadas
    let idadesCriancas = [];
    for (let i = 1; i <= criancas; i++) {
      const idadeInput = document.getElementById(`idade_crianca_${i}`);
      if (idadeInput) {
        const idade = parseInt(idadeInput.value);
        if (isNaN(idade) || idade < 0 || idade > 17) {
          avisos.push(`Idade da criança ${i} inválida ou não informada`);
        } else {
          idadesCriancas.push(idade);
        }
      }
    }
    
    // Validar conteúdo de imagem
    const arquivoBase64 = formElements.previewArea?.dataset.fileData || "";
    const temImagem = !!(arquivoBase64 && arquivoBase64.startsWith('data:image/'));
    
    if (temImagem) {
      const validacaoImagem = validarImagemCompleta(arquivoBase64);
      if (!validacaoImagem.valida) {
        erros.push(`Imagem inválida: ${validacaoImagem.erro}`);
      }
    }
    
    // Validar conteúdo textual
    const textoColado = formElements.pasteArea?.innerText?.trim() || '';
    const conteudoTotal = (observacoes + ' ' + textoColado).trim();
    
    if (!temImagem && conteudoTotal.length < 10) {
      avisos.push("Pouco conteúdo fornecido - resultado pode ser genérico");
    }
    
    // Log de avisos
    if (avisos.length > 0) {
      console.warn("⚠️ [VALIDAÇÃO] Avisos:", avisos);
    }
    
    if (erros.length > 0) {
      console.error("❌ [VALIDAÇÃO] Erros:", erros);
      return { valido: false, erros: erros, avisos: avisos };
    }
    
    // Retornar dados validados
    return {
      valido: true,
      erros: [],
      avisos: avisos,
      dados: {
        destino: destino || "(Destino não informado)",
        adultos: adultos.toString(),
        criancas: criancas.toString(),
        idades: idadesCriancas.join(', '),
        observacoes: observacoes,
        tipos: tipos,
        textoColado: textoColado,
        arquivoBase64: arquivoBase64,
        temImagem: temImagem
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
// 🖼️ VALIDAÇÃO ESPECÍFICA DE IMAGENS
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
    
    // Verificar tipos suportados
    const tiposSuportados = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposSuportados.includes(mimeType)) {
      return { valida: false, erro: `Tipo ${mimeType} não suportado. Use: ${tiposSuportados.join(', ')}` };
    }
    
    // Verificar se é base64 válido
    try {
      atob(base64Data.substring(0, 100)); // Testar decodificação
    } catch (e) {
      return { valida: false, erro: 'Dados base64 corrompidos' };
    }
    
    // Verificar tamanho
    const sizeInBytes = base64Data.length * 0.75;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      return { valida: false, erro: `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB. Máximo: 5MB` };
    }
    
    if (sizeInMB < 0.001) {
      return { valida: false, erro: 'Arquivo muito pequeno - pode estar corrompido' };
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

// ================================================================================
// 📊 ANÁLISE COMPLETA DO CONTEÚDO
// ================================================================================

function analisarConteudoCompleto(formData) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  // Análise de múltiplas opções
  const multiplasOpcoes = detectarMultiplasOpcoesAvancado(textoCompleto);
  
  // Análise de tipo de viagem
  const tipoViagem = analisarTipoViagemDetalhado(textoCompleto);
  
  // Análise de qualidade do conteúdo
  const qualidade = analisarQualidadeConteudo(textoCompleto, formData.temImagem);
  
  // Contadores gerais
  const precos = (textoCompleto.match(/r\$[\d.,]+/gi) || []).length;
  const horarios = (textoCompleto.match(/\d{2}:\d{2}/g) || []).length;
  const datas = (textoCompleto.match(/\d{2}\/\d{2}|\d{2} de \w+/gi) || []).length;
  const companhias = (textoCompleto.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  
  let descricao = '';
  if (multiplasOpcoes.detectado) {
    descricao = `Múltiplas opções detectadas (${multiplasOpcoes.quantidade} opções)`;
  } else {
    descricao = `Opção única - ${tipoViagem.tipo}`;
  }
  
  if (formData.temImagem) {
    descricao += ' | Processamento visual';
  }
  
  return {
    multiplasOpcoes: multiplasOpcoes.detectado,
    quantidadeOpcoes: multiplasOpcoes.quantidade,
    tipoViagem: tipoViagem.tipo,
    confiancaTipo: tipoViagem.confianca,
    qualidadeConteudo: qualidade.nivel,
    contadores: {
      precos: precos,
      horarios: horarios,
      datas: datas,
      companhias: companhias
    },
    descricao: descricao,
    recomendacoes: qualidade.recomendacoes
  };
}

function detectarMultiplasOpcoesAvancado(texto) {
  if (!texto) return { detectado: false, quantidade: 0 };
  
  const textoLower = texto.toLowerCase();
  
  // Contadores mais precisos
  const precos = (textoLower.match(/r\$.*?\d{1,3}[\.,]\d{3}/gi) || []).length;
  const totais = (textoLower.match(/total.*\d+.*adult/gi) || []).length;
  const companhias = (textoLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  const horarios = (textoLower.match(/\d{2}:\d{2}/g) || []).length;
  const links = (textoLower.match(/https:\/\/www\.cvc\.com\.br\/carrinho/gi) || []).length;
  const opcoes = (textoLower.match(/opção \d+|option \d+/gi) || []).length;
  
  // Lógica de detecção mais inteligente
  let quantidade = Math.max(precos, totais, companhias, links, opcoes);
  
  // Se há muitos horários, pode ser ida+volta de múltiplas opções
  if (horarios >= 4 && quantidade < 2) {
    quantidade = Math.ceil(horarios / 2);
  }
  
  const detectado = quantidade >= 2;
  
  return {
    detectado: detectado,
    quantidade: detectado ? quantidade : 1,
    indicadores: {
      precos: precos,
      totais: totais,
      companhias: companhias,
      horarios: horarios,
      links: links,
      opcoes: opcoes
    }
  };
}

function analisarTipoViagemDetalhado(texto) {
  if (!texto) return { tipo: 'ida_volta', confianca: 0 };
  
  const textoLower = texto.toLowerCase();
  
  // Indicadores específicos
  const somenteIda = (textoLower.match(/somente ida|só ida|one way/gi) || []).length;
  const idaVolta = (textoLower.match(/ida.*volta|ida.*retorno/gi) || []).length;
  const voosVolta = (textoLower.match(/volta.*\d{2}:\d{2}/gi) || []).length;
  const datasMultiplas = (textoLower.match(/\d{2}\/\d{2}|\d{2} de \w+/gi) || []).length;
  
  let pontuacao = 0;
  let tipo = 'ida_volta';
  
  // Análise de pontuação
  if (somenteIda > 0) {
    pontuacao += 5 * somenteIda;
    tipo = 'somente_ida';
  }
  
  if (idaVolta > 0) {
    pontuacao += 3 * idaVolta;
    tipo = 'ida_volta';
  }
  
  if (voosVolta > 0) {
    pontuacao += 2 * voosVolta;
    tipo = 'ida_volta';
  }
  
  // Se não há indicadores claros, usar heurística de datas
  if (pontuacao === 0) {
    if (datasMultiplas >= 2) {
      tipo = 'ida_volta';
      pontuacao = 1;
    } else {
      tipo = 'somente_ida';
      pontuacao = 1;
    }
  }
  
  return {
    tipo: tipo,
    confianca: pontuacao,
    indicadores: {
      somenteIda: somenteIda,
      idaVolta: idaVolta,
      voosVolta: voosVolta,
      datasMultiplas: datasMultiplas
    }
  };
}

function analisarQualidadeConteudo(texto, temImagem) {
  const tamanho = texto.length;
  const recomendacoes = [];
  let nivel = 'baixa';
  
  if (temImagem) {
    nivel = 'alta';
    recomendacoes.push('Imagem detectada - análise visual será realizada');
  } else if (tamanho > 500) {
    nivel = 'alta';
    recomendacoes.push('Conteúdo textual rico detectado');
  } else if (tamanho > 100) {
    nivel = 'media';
    recomendacoes.push('Conteúdo adequado - considere adicionar mais detalhes');
  } else {
    nivel = 'baixa';
    recomendacoes.push('Pouco conteúdo - adicione mais informações ou uma imagem');
  }
  
  // Verificar presença de dados estruturados
  const temPrecos = /r\$[\d.,]+/gi.test(texto);
  const temHorarios = /\d{2}:\d{2}/g.test(texto);
  const temDatas = /\d{2}\/\d{2}|\d{2} de \w+/gi.test(texto);
  
  if (temPrecos && temHorarios && temDatas) {
    recomendacoes.push('Dados estruturados completos detectados');
  } else {
    const faltando = [];
    if (!temPrecos) faltando.push('preços');
    if (!temHorarios) faltando.push('horários');
    if (!temDatas) faltando.push('datas');
    
    if (faltando.length > 0) {
      recomendacoes.push(`Considere adicionar: ${faltando.join(', ')}`);
    }
  }
  
  return {
    nivel: nivel,
    tamanho: tamanho,
    recomendacoes: recomendacoes
  };
}

// ================================================================================
// 🔗 COMUNICAÇÃO SEGURA COM API
// ================================================================================

async function generateOrcamentoSeguro(formData, analise) {
  console.log("🤖 [SEGURO] Gerando orçamento...");
  
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  // Construir prompt baseado na análise
  let promptEspecializado = construirPromptEspecializado(formData, analise);
  
  try {
    const response = await callAISegura(promptEspecializado, 'orcamento', formData);
    
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Resposta da API em formato inválido');
    }
    
    const conteudo = response.choices[0].message.content;
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Conteúdo da resposta está vazio');
    }
    
    updateElementSeguro("orcamentoIA", conteudo);
    
    console.log("✅ [SEGURO] Orçamento gerado:", {
      tamanho: conteudo.length,
      modelo: response.metricas?.modelo_usado,
      multiplas: analise.multiplasOpcoes
    });
    
    return response;
    
  } catch (error) {
    console.error("❌ [SEGURO] Erro na geração:", error);
    throw new Error(`Falha na geração do orçamento: ${error.message}`);
  }
}

function construirPromptEspecializado(formData, analise) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  let prompt = `Dados do orçamento:
Destino: ${formData.destino}
Adultos: ${formData.adultos}
Crianças: ${formData.criancas}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos.join(', ')}

ANÁLISE PRÉVIA:
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Tipo de viagem: ${analise.tipoViagem}
- Qualidade do conteúdo: ${analise.qualidadeConteudo}

DADOS ESPECÍFICOS DA VIAGEM:
${textoCompleto}

INSTRUÇÕES IMPORTANTES:
`;

  if (analise.multiplasOpcoes) {
    prompt += `
- MÚLTIPLAS OPÇÕES DETECTADAS: Formate TODAS as ${analise.quantidadeOpcoes} opções encontradas
- Use seções numeradas (OPÇÃO 1, OPÇÃO 2, etc.)
- Cada opção deve ter dados completos e distintos
`;
  } else {
    prompt += `
- OPÇÃO ÚNICA: Formate apenas uma opção de forma clara e completa
- Não invente informações de volta se for somente ida
`;
  }

  if (analise.tipoViagem === 'somente_ida') {
    prompt += `
- ATENÇÃO: Esta é uma passagem SOMENTE IDA
- NÃO inclua informações de volta inexistentes
- Deixe claro que é "somente ida" no formato final
`;
  }

  if (analise.recomendacoes.length > 0) {
    prompt += `
- Observações da análise: ${analise.recomendacoes.join('; ')}
`;
  }

  return prompt;
}

async function callAISegura(prompt, tipo, extraData = {}) {
  console.log("🔄 [SEGURO] Enviando para API...");
  
  // Validação prévia dos dados
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt obrigatório para chamada da API');
  }
  
  if (extraData.temImagem && (!extraData.arquivoBase64 || !extraData.arquivoBase64.startsWith('data:image/'))) {
    throw new Error('Arquivo de imagem obrigatório quando temImagem=true');
  }
  
  const requestData = {
    prompt: prompt.trim(),
    tipo: tipo || 'orcamento',
    destino: extraData.destino || 'Não informado',
    tipos: Array.isArray(extraData.tipos) ? extraData.tipos : [],
    temImagem: Boolean(extraData.temImagem),
    arquivo: extraData.temImagem ? extraData.arquivoBase64 : undefined
  };
  
  console.log("📤 [SEGURO] Dados da requisição:", {
    prompt_length: requestData.prompt.length,
    tipo: requestData.tipo,
    temImagem: requestData.temImagem,
    arquivo_length: requestData.arquivo?.length || 0
  });
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `CVC-Itaqua-Frontend/${VERSAO_SISTEMA}`
      },
      body: JSON.stringify(requestData)
    });

    console.log("📊 [SEGURO] Status da resposta:", response.status, response.statusText);

    // Verificar se a resposta é OK
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.error("❌ [SEGURO] Erro da API:", errorText);
        
        // Tentar parsear erro como JSON
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
        } catch (jsonError) {
          // Se não for JSON, usar o texto do erro
          errorMessage = errorText.substring(0, 200);
        }
      } catch (readError) {
        console.error("❌ [SEGURO] Erro ao ler resposta de erro:", readError);
      }
      
      throw new Error(errorMessage);
    }

    // Ler e parsear resposta
    const responseText = await response.text();
    console.log("📄 [SEGURO] Resposta recebida:", responseText.substring(0, 200) + "...");
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("❌ [SEGURO] Erro ao parsear JSON:", jsonError);
      throw new Error(`Resposta da API não é JSON válido: ${jsonError.message}`);
    }
    
    // Validar estrutura da resposta
    if (!data || typeof data !== 'object') {
      throw new Error('Resposta da API não é um objeto válido');
    }
    
    if (data.success === false) {
      const errorMsg = data.error?.message || data.error || 'Erro desconhecido da API';
      throw new Error(errorMsg);
    }
    
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Resposta da API não contém choices válidas');
    }
    
    if (!data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Resposta da API não contém conteúdo válido');
    }
    
    console.log("✅ [SEGURO] Resposta válida recebida");
    
    // Log das métricas se disponíveis
    if (data.metricas) {
      console.log("📊 [SEGURO] Métricas:", {
        modelo: data.metricas.modelo_usado,
        estrategia: data.metricas.estrategia,
        tokens: data.metricas.tokens?.total,
        custo: data.metricas.custo?.brl
      });
    }
    
    return data;
    
  } catch (error) {
    console.error("❌ [SEGURO] Erro na comunicação:", error);
    
    // Categorizar tipo de erro
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Erro de conexão - verifique sua internet e tente novamente');
    } else if (error.message.includes('JSON')) {
      throw new Error('Erro na comunicação com o servidor - resposta inválida');
    } else {
      throw error;
    }
  }
}

// ================================================================================
// 🎨 INTERFACE SEGURA E FEEDBACK
// ================================================================================

function updateElementSeguro(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ [SEGURO] Elemento '${id}' não encontrado`);
      return false;
    }
    
    if (typeof content !== 'string') {
      console.warn(`⚠️ [SEGURO] Conteúdo inválido para '${id}':`, typeof content);
      content = String(content);
    }
    
    element.innerText = content;
    console.log(`📝 [SEGURO] Elemento '${id}' atualizado (${content.length} chars)`);
    return true;
    
  } catch (error) {
    console.error(`❌ [SEGURO] Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoadingSeguro(mensagem = "Processando...") {
  const sucesso = updateElementSeguro("orcamentoIA", `🤖 ${mensagem}`);
  if (!sucesso) {
    console.warn("⚠️ [SEGURO] Não foi possível mostrar loading");
  }
}

function hideLoadingSeguro() {
  // Loading será substituído pelo conteúdo real
  console.log("🔄 [SEGURO] Loading ocultado");
}

function showErrorSeguro(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElementSeguro("orcamentoIA", errorMessage);
  
  if (!sucesso) {
    // Fallback: mostrar alert se não conseguir atualizar elemento
    alert(errorMessage);
  }
  
  console.error("❌ [SEGURO] Erro mostrado:", message);
}

function mostrarErroInicializacao(error) {
  const container = document.body || document.documentElement;
  
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 15px;
    max-width: 400px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  `;
  
  errorDiv.innerHTML = `
    <strong>❌ Erro de Inicialização</strong><br>
    ${error.message}<br><br>
    <small>Recarregue a página ou contate o suporte.</small>
    <button onclick="this.parentElement.remove()" style="float: right; margin-left: 10px;">×</button>
  `;
  
  container.appendChild(errorDiv);
  
  // Remover após 10 segundos
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 10000);
}

// ================================================================================
// 🔧 FUNCIONALIDADES AUXILIARES SEGURAS
// ================================================================================

async function generateRankingHoteisSeguro(destino) {
  if (!destino || destino.trim().length === 0) {
    console.warn("⚠️ [SEGURO] Destino vazio para ranking de hotéis");
    return;
  }
  
  console.log("🏨 [SEGURO] Gerando ranking de hotéis...");
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;

  try {
    const response = await callAISegura(prompt, 'ranking', { destino });
    updateElementSeguro("rankingIA", response.choices[0].message.content);
    console.log("✅ [SEGURO] Ranking de hotéis gerado");
  } catch (error) {
    console.error("❌ [SEGURO] Erro no ranking:", error);
    updateElementSeguro("rankingIA", `❌ Erro ao gerar ranking: ${error.message}`);
  }
}

async function handlePDFAnalysisSeguro() {
  if (!formElements.pdfUpload) {
    console.error("❌ [SEGURO] Elemento pdfUpload não encontrado");
    alert("Erro: Sistema de upload não disponível");
    return;
  }
  
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  console.log("📄 [SEGURO] Analisando arquivo:", file.name, file.size, "bytes");
  
  // Validações do arquivo
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert("Arquivo muito grande. Máximo: 10MB");
    return;
  }
  
  const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!tiposPermitidos.includes(file.type)) {
    alert(`Tipo de arquivo não suportado: ${file.type}\nPermitidos: PDF, JPG, PNG`);
    return;
  }
  
  showLoadingSeguro("Analisando arquivo...");
  
  try {
    const base64 = await fileToBase64Seguro(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. 📊 Principais métricas de vendas
2. 🎯 Metas vs realizado
3. 🏆 Produtos mais vendidos
4. 💡 Recomendações práticas

Formato executivo para a filial 6220.`;

    const response = await callAISegura(prompt, 'analise', { 
      temImagem: true, 
      arquivoBase64: base64 
    });
    
    updateElementSeguro("analiseIA", response.choices[0].message.content);
    
    const container = document.getElementById('analiseContainer');
    if (container) {
      container.style.display = 'block';
    }
    
    console.log("✅ [SEGURO] Análise de PDF concluída");
    
  } catch (error) {
    console.error("❌ [SEGURO] Erro na análise:", error);
    updateElementSeguro("analiseIA", `❌ Erro: ${error.message}`);
  } finally {
    hideLoadingSeguro();
  }
}

async function handleFileUploadSeguro(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 [SEGURO] Arquivo selecionado:", file.name, file.size, "bytes");

  try {
    // Validações básicas
    if (!file.type.startsWith('image/')) {
      throw new Error('Apenas arquivos de imagem são aceitos (PNG, JPG, JPEG)');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo: 5MB');
    }

    if (file.size < 1024) {
      throw new Error('Arquivo muito pequeno. Pode estar corrompido');
    }

    // Converter para base64
    showLoadingSeguro("Processando imagem...");
    const base64 = await fileToBase64Seguro(file);
    
    // Validar resultado
    const validacao = validarImagemCompleta(base64);
    if (!validacao.valida) {
      throw new Error(validacao.erro);
    }
    
    // Armazenar dados
    if (formElements.previewArea) {
      formElements.previewArea.dataset.fileData = base64;
      
      // Criar preview
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      
      formElements.previewArea.innerHTML = `
        <p>✅ Imagem carregada - Claude Sonnet ready!</p>
        <div style="font-size: 12px; color: #666; margin: 5px 0;">
          📊 ${validacao.mimeType} | ${validacao.tamanhoMB}MB | 🟠 Análise visual
        </div>
      `;
      formElements.previewArea.appendChild(img);
    }
    
    console.log('✅ [SEGURO] Imagem processada:', validacao.tamanhoMB, 'MB');
    
  } catch (error) {
    console.error("❌ [SEGURO] Erro no upload:", error);
    
    if (formElements.previewArea) {
      formElements.previewArea.innerHTML = `<p>❌ Erro: ${error.message}</p>`;
    }
    
    alert(`Erro ao processar imagem: ${error.message}`);
  } finally {
    hideLoadingSeguro();
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
          reject(new Error('Resultado da leitura inválido'));
          return;
        }
        resolve(result);
      } catch (error) {
        reject(new Error(`Erro no processamento: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo - arquivo pode estar corrompido'));
    };
    
    reader.onabort = () => {
      reject(new Error('Leitura do arquivo cancelada'));
    };
    
    // Timeout de 30 segundos
    const timeout = setTimeout(() => {
      reader.abort();
      reject(new Error('Timeout na leitura do arquivo (30s)'));
    }, 30000);
    
    reader.onloadend = () => {
      clearTimeout(timeout);
    };
    
    reader.readAsDataURL(file);
  });
}

// ================================================================================
// 🔍 DIAGNÓSTICO E LOGS
// ================================================================================

function diagnosticarProblema(error) {
  console.log("🔍 [DIAGNÓSTICO] Analisando erro...");
  
  const diagnosticos = [];
  
  // Verificar conectividade
  if (error.message.includes('fetch') || error.message.includes('network')) {
    diagnosticos.push('❌ Problema de conexão detectado');
    diagnosticos.push('💡 Verifique sua conexão com a internet');
  }
  
  // Verificar problemas da API
  if (error.message.includes('500') || error.message.includes('servidor')) {
    diagnosticos.push('❌ Erro interno do servidor');
    diagnosticos.push('💡 Tente novamente em alguns minutos');
  }
  
  // Verificar problemas de dados
  if (error.message.includes('undefined') || error.message.includes('null')) {
    diagnosticos.push('❌ Dados mal formatados detectados');
    diagnosticos.push('💡 Verifique se todos os campos estão preenchidos');
  }
  
  // Verificar problemas de imagem
  if (error.message.includes('imagem') || error.message.includes('base64')) {
    diagnosticos.push('❌ Problema com o arquivo de imagem');
    diagnosticos.push('💡 Tente uma imagem menor ou em outro formato');
  }
  
  if (diagnosticos.length > 0) {
    console.log("🔍 [DIAGNÓSTICO] Problemas encontrados:", diagnosticos);
    
    // Mostrar diagnóstico para o usuário
    setTimeout(() => {
      const diagnosticoTexto = diagnosticos.join('\n');
      updateElementSeguro("orcamentoIA", 
        `❌ Erro detectado\n\n🔍 DIAGNÓSTICO:\n${diagnosticoTexto}\n\n🔄 Tente novamente ou recarregue a página.`
      );
    }, 2000);
  }
}

function logEventoSucesso(evento, dados) {
  console.log(`✅ [EVENTO] ${evento}:`, dados);
  
  // Em produção, isso poderia enviar para analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', evento, dados);
  }
}

function logEventoErro(evento, error, contexto) {
  console.error(`❌ [EVENTO] ${evento}:`, {
    message: error.message,
    stack: error.stack,
    contexto: contexto
  });
  
  // Em produção, isso poderia enviar para sistema de monitoramento
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(error, { extra: contexto });
  }
}

// ================================================================================
// 🧪 TESTE DE CONEXÃO SEGURO
// ================================================================================

async function testarConexaoAPISegura() {
  try {
    console.log("🧪 [SEGURO] Testando API...");
    
    const response = await fetch(API_URL, { 
      method: 'GET',
      headers: {
        'User-Agent': `CVC-Itaqua-Frontend/${VERSAO_SISTEMA}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ [SEGURO] API Online:", {
        status: data.message,
        version: data.version,
        modelos: data.modelos
      });
    } else {
      console.warn("⚠️ [SEGURO] API com problemas:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("❌ [SEGURO] Erro na conexão:", error.message);
  }
}

// ================================================================================
// 🎯 FUNÇÕES PRINCIPAIS MANTIDAS (compatibilidade)
// ================================================================================

// Manter funções originais para compatibilidade
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

async function gerarDicasDestino() {
  const destino = document.getElementById('destino').value;
  const orcamentoTexto = document.getElementById('orcamentoIA').innerText;
  
  if (!destino) {
    alert('Informe um destino primeiro!');
    return;
  }
  
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  btnGerar.disabled = true;
  btnGerar.innerText = '🤖 Gerando...';
  
  try {
    let contextoData = '';
    if (orcamentoTexto && orcamentoTexto !== 'Preencha o formulário acima para gerar o orçamento...') {
      contextoData = `\n\nCONTEXTO DA VIAGEM:\n${orcamentoTexto.substring(0, 300)}...`;
    }
    
    const prompt = `Crie dicas personalizadas sobre ${destino} para WhatsApp da CVC.${contextoData}
    
Inclua:
- Principais atrações e pontos turísticos
- Melhor época para visitar (considerando a época da viagem se informada)
- Dicas de clima e o que levar
- Informações práticas (moeda, documentação, fuso horário)
- Tom vendedor mas informativo
- Máximo 250 palavras
- Use emojis para deixar atrativo

Se há datas específicas na viagem, adapte as dicas para essa época do ano.`;

    const response = await callAISegura(prompt, 'destino', { destino });
    document.getElementById('destinoIA').innerText = response.choices[0].message.content;
    
    btnCopiar.style.display = 'inline-block';
    console.log("✅ Dicas do destino geradas!");
    
  } catch (error) {
    console.error("❌ Erro ao gerar dicas:", error);
    document.getElementById('destinoIA').innerText = "❌ Erro ao gerar dicas: " + error.message;
  } finally {
    btnGerar.disabled = false;
    btnGerar.innerText = '🎯 Gerar Dicas';
  }
}

// ================================================================================
// 🎨 SISTEMA DE PASTE AREA SEGURO
// ================================================================================

function setupPasteAreaSegura() {
  if (!formElements.pasteArea) {
    console.warn("⚠️ [SEGURO] PasteArea não encontrada");
    return;
  }
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 [SEGURO] Conteúdo sendo colado...");
    
    e.preventDefault();
    
    try {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
          console.log("🖼️ [SEGURO] Imagem detectada");
          
          const blob = item.getAsFile();
          
          if (!blob) {
            console.error("❌ [SEGURO] Falha ao obter blob da imagem");
            continue;
          }
          
          // Validar tamanho do blob
          if (blob.size > 5 * 1024 * 1024) {
            alert('Imagem muito grande (máx: 5MB)');
            continue;
          }
          
          const reader = new FileReader();
          
          reader.onload = function (event) {
            try {
              const base64Data = event.target.result;
              
              // Validar imagem
              const validacao = validarImagemCompleta(base64Data);
              if (!validacao.valida) {
                formElements.previewArea.innerHTML = `<p>❌ ${validacao.erro}</p>`;
                return;
              }
              
              // Criar preview
              const img = document.createElement('img');
              img.src = base64Data;
              img.style.maxWidth = '100%';
              img.style.borderRadius = '8px';
              img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              
              formElements.previewArea.innerHTML = `
                <p>✅ Imagem colada - Claude Sonnet ready!</p>
                <div style="font-size: 12px; color: #666; margin: 5px 0;">
                  📊 ${validacao.mimeType} | ${validacao.tamanhoMB}MB | 🟠 Análise visual
                </div>
              `;
              formElements.previewArea.appendChild(img);
              formElements.previewArea.dataset.fileData = base64Data;
              
              console.log('✅ [SEGURO] Imagem colada processada');
              
            } catch (error) {
              console.error('❌ [SEGURO] Erro ao processar imagem colada:', error);
              formElements.previewArea.innerHTML = '<p>❌ Erro ao processar imagem</p>';
            }
          };
          
          reader.onerror = function() {
            console.error('❌ [SEGURO] Erro ao ler imagem colada');
            formElements.previewArea.innerHTML = '<p>❌ Erro ao ler imagem</p>';
          };
          
          reader.readAsDataURL(blob);
          break;
          
        } else if (item.type === 'text/plain') {
          item.getAsString(function (text) {
            if (text && text.trim().length > 0) {
              formElements.previewArea.innerHTML = `
                <p>📝 Texto colado - GPT-4o-mini ready!</p>
                <div style="font-size: 12px; color: #666;">${text.substring(0, 100)}...</div>
              `;
              console.log('📝 [SEGURO] Texto colado processado:', text.length, 'caracteres');
            }
          });
        }
      }
      
    } catch (error) {
      console.error('❌ [SEGURO] Erro no paste:', error);
      formElements.previewArea.innerHTML = '<p>❌ Erro ao processar conteúdo colado</p>';
    }
  });
  
  // Efeitos visuais seguros
  formElements.pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#003399';
    this.style.backgroundColor = '#e9ecef';
    this.textContent = '📎 Solte aqui - Sistema seguro!';
  });

  formElements.pasteArea.addEventListener('dragleave', function(e) {
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude';
  });

  formElements.pasteArea.addEventListener('drop', function(e) {
    e.preventDefault();
    console.log('📎 [SEGURO] Arquivo dropado');
    
    try {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const mockEvent = { target: { files: [file] } };
        handleFileUploadSeguro(mockEvent);
      }
    } catch (error) {
      console.error('❌ [SEGURO] Erro no drop:', error);
    }
    
    // Resetar visual
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude';
  });
  
  console.log("✅ [SEGURO] PasteArea configurada");
}

// ================================================================================
// 💰 SISTEMA DE MEDIDOR DE CUSTO (mantido igual)
// ================================================================================

function inicializarMedidorCusto() {
  try {
    console.log("💰 [CUSTO] Inicializando medidor...");
    
    const dadosSalvos = localStorage.getItem('cvc_custo_meter_hybrid');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      
      if (dados.ultimaAtualizacao === new Date().toDateString()) {
        custoMeter = { ...custoMeter, ...dados };
        console.log("💰 [CUSTO] Dados carregados");
      } else {
        console.log("💰 [CUSTO] Novo dia, resetando contador");
        resetarContadorDiario();
      }
    }
    
    criarWidgetCusto();
    atualizarWidgetCusto();
    
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao inicializar:", error);
    resetarContadorDiario();
  }
}

function criarWidgetCusto() {
  if (document.getElementById('custoWidgetHibrido')) return;
  
  const widget = document.createElement('div');
  widget.id = 'custoWidgetHibrido';
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
  
  widget.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 5px 25px rgba(0,0,0,0.3)';
  });
  
  widget.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 3px 15px rgba(0,0,0,0.2)';
  });
  
  widget.addEventListener('click', mostrarDashboardCompleto);
  
  document.body.appendChild(widget);
  console.log("✅ [CUSTO] Widget criado");
}

function atualizarWidgetCusto() {
  const widget = document.getElementById('custoWidgetHibrido');
  if (!widget) return;
  
  const economiaTexto = custoMeter.economiaHoje > 0 ? 
    ` | 💰 -${custoMeter.economiaHoje.toFixed(2)}` : '';
  
  widget.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 13px; font-weight: bold;">💰 Hoje: R$ ${custoMeter.custoTotalHoje.toFixed(3)}</div>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
        📊 ${custoMeter.orcamentosHoje} orçamentos${economiaTexto}
      </div>
      <div style="font-size: 9px; opacity: 0.8; margin-top: 1px;">
        🔵${custoMeter.orcamentosTexto} texto | 🟠${custoMeter.orcamentosImagem} imagem
      </div>
    </div>
  `;
}

function mostrarDashboardCompleto() {
  const custoMedio = custoMeter.orcamentosHoje > 0 ? 
    custoMeter.custoTotalHoje / custoMeter.orcamentosHoje : 0;
  
  const projecaoMensal = custoMeter.custoTotalHoje * 30;
  const eficiencia = custoMeter.orcamentosHoje > 0 ? 
    ((custoMeter.orcamentosTexto / custoMeter.orcamentosHoje) * 100).toFixed(1) : 0;
  
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
                max-width: 600px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <h3 style="color: #003399; margin-bottom: 1.5rem;">📊 Dashboard Híbrido - Custos IA</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        
        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #1976d2;">
            R$ ${custoMeter.custoTotalHoje.toFixed(3)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Total Hoje</div>
        </div>
        
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #388e3c;">
            ${custoMeter.orcamentosHoje}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Orçamentos</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #f57c00;">
            R$ ${custoMedio.toFixed(4)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Médio</div>
        </div>
        
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: #003399; color: white; border: none; 
                     padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer;">
        Fechar Dashboard
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function atualizarMetricasHibridas(metricas) {
  try {
    const hoje = new Date().toDateString();
    if (custoMeter.ultimaAtualizacao !== hoje) {
      resetarContadorDiario();
    }
    
    custoMeter.orcamentosHoje++;
    custoMeter.custoTotalHoje += metricas.custo.brl;
    custoMeter.economiaHoje += metricas.economia.vs_gpt4o_brl || 0;
    custoMeter.ultimaAtualizacao = hoje;
    
    if (metricas.estrategia && metricas.estrategia.includes('Claude')) {
      custoMeter.orcamentosImagem++;
      custoMeter.modelosUsados['claude-3-sonnet']++;
    } else {
      custoMeter.orcamentosTexto++;
      custoMeter.modelosUsados['gpt-4o-mini']++;
    }
    
    salvarMedidorCusto();
    atualizarWidgetCusto();
    
    console.log("📊 [MÉTRICAS] Atualizadas:", {
      estrategia: metricas.estrategia,
      modelo: metricas.modelo_usado,
      custo: `R$ ${metricas.custo.brl.toFixed(4)}`,
      total_hoje: `R$ ${custoMeter.custoTotalHoje.toFixed(3)}`
    });
    
  } catch (error) {
    console.error("❌ [MÉTRICAS] Erro ao atualizar:", error);
  }
}

function mostrarFeedbackCustoHibrido(metricas) {
  const feedbackElement = document.getElementById('custoFeedbackHibrido');
  
  if (!feedbackElement) {
    const feedback = document.createElement('div');
    feedback.id = 'custoFeedbackHibrido';
    feedback.style.cssText = `
      background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
      border: 1px solid #4caf50;
      border-radius: 8px;
      padding: 0.8rem;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #2e7d32;
    `;
    
    const orcamentoSection = document.querySelector('.output-section');
    if (orcamentoSection) {
      orcamentoSection.appendChild(feedback);
    }
  }
  
  const feedback = document.getElementById('custoFeedbackHibrido');
  if (feedback) {
    const economiaTexto = metricas.economia.vs_gpt4o_brl > 0 ? 
      ` | 💰 Economia: R$ ${metricas.economia.vs_gpt4o_brl.toFixed(4)}` : '';
    
    const estrategiaIcon = metricas.estrategia && metricas.estrategia.includes('Claude') ? '🟠' : '🔵';
    
    feedback.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>
          ${estrategiaIcon} <strong>${metricas.modelo_usado}</strong> | 
          💰 Custo: <strong>R$ ${metricas.custo.brl.toFixed(4)}</strong>${economiaTexto}
        </span>
        <span style="font-size: 0.75rem; opacity: 0.8;">
          📊 ${metricas.tokens.total} tokens | ⚡ ${metricas.performance?.tempo_processamento_ms}ms
        </span>
      </div>
      <div style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">
        🎯 ${metricas.estrategia}
      </div>
    `;
  }
}

function salvarMedidorCusto() {
  try {
    localStorage.setItem('cvc_custo_meter_hybrid', JSON.stringify(custoMeter));
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
// 📊 LOGS FINAIS E INICIALIZAÇÃO
// ================================================================================

console.log(`🚀 Sistema CVC Itaqua v${VERSAO_SISTEMA} carregado!`);
console.log("🔧 Melhorias implementadas:");
console.log("   ✅ Validação rigorosa de dados");
console.log("   ✅ Tratamento robusto de erros");
console.log("   ✅ Diagnóstico automático de problemas");
console.log("   ✅ Logs detalhados para debugging");
console.log("   ✅ Detecção inteligente de tipos de viagem");
console.log("   ✅ Sistema de fallback melhorado");
console.log("🎯 Sistema pronto para uso seguro!");

// Exportar funções para debug (apenas em desenvolvimento)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.debugCVC = {
    validarFormulario: validarFormularioCompleto,
    analisarConteudo: analisarConteudoCompleto,
    validarImagem: validarImagemCompleta,
    diagnosticar: diagnosticarProblema,
    resetarCusto: resetarContadorDiario,
    versao: VERSAO_SISTEMA
  };
  console.log("🧪 [DEBUG] Funções de debug disponíveis em window.debugCVC");
}
