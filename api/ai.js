// ================================================================================
// 🏆 CVC ITAQUA - FRONTEND LIMPO v5.2.0-clean
// ================================================================================
// FOCO: Interface limpa para orçamentos profissionais sem informações técnicas
// ================================================================================

const API_URL = '/api/ai';
const VERSAO_SISTEMA = '5.2.0-clean';

console.log(`⚡ CVC ITAQUA - FRONTEND LIMPO v${VERSAO_SISTEMA}`);
console.log("🧹 Melhorias: Orçamentos limpos + Detecção de escalas + Conversão aeroportos");

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
// 🔧 INICIALIZAÇÃO LIMPA
// ================================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema limpo...");
  
  try {
    // Mapear elementos do DOM
    formElements = {
      form: document.getElementById("orcamentoForm"),
      pasteArea: document.getElementById("pasteArea"),
      previewArea: document.getElementById("previewArea"),
      arquivo: document.getElementById("arquivo"),
      pdfUpload: document.getElementById("pdfUpload")
    };

    // Verificar elementos essenciais
    if (!formElements.form) {
      console.warn("⚠️ Formulário principal não encontrado");
      return;
    }

    // Configurar event listeners
    formElements.form.addEventListener("submit", handleOrcamentoLimpo);
    console.log("✅ Formulário principal conectado");
    
    if (formElements.arquivo) {
      formElements.arquivo.addEventListener("change", handleFileUploadLimpo);
      console.log("✅ Upload de arquivo conectado");
    }

    if (formElements.pdfUpload) {
      window.analisarPDF = handlePDFAnalysisLimpo;
      console.log("✅ Análise de PDF conectada");
    }

    // Inicializar componentes
    setupPasteAreaLimpa();
    inicializarMedidorCusto();
    testarConexaoAPILimpa();
    
    console.log("✅ Sistema limpo inicializado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    mostrarErroInicializacao(error);
  }
});

// ================================================================================
// 🎯 HANDLER PRINCIPAL LIMPO - SEM CABEÇALHOS TÉCNICOS
// ================================================================================

async function handleOrcamentoLimpo(e) {
  e.preventDefault();
  console.log("📝 [LIMPO] Processando orçamento sem cabeçalhos técnicos...");
  
  const startTime = Date.now();
  
  try {
    // Mostrar loading limpo
    showLoadingLimpo("Validando dados...");
    
    // VALIDAÇÃO RIGOROSA DOS DADOS
    const validacao = validarFormularioCompleto(e.target);
    if (!validacao.valido) {
      throw new Error(`Validação falhou: ${validacao.erros.join(', ')}`);
    }
    
    const formData = validacao.dados;
    console.log("✅ [LIMPO] Dados validados:", {
      tipos: formData.tipos,
      temImagem: formData.temImagem,
      destino: formData.destino,
      tamanhoTexto: formData.observacoes.length
    });
    
    // Análise prévia
    showLoadingLimpo("Analisando conteúdo e detectando escalas...");
    const analise = analisarConteudoLimpo(formData);
    console.log("📊 [LIMPO] Análise:", analise);
    
    // Feedback da estratégia (sem mostrar na tela final)
    const estrategia = formData.temImagem ? 'Claude Sonnet (imagem)' : 'GPT-4o-mini (texto)';
    console.log(`🎯 [LIMPO] Estratégia: ${estrategia}`);
    
    // GERAÇÃO DO ORÇAMENTO LIMPO
    showLoadingLimpo("Gerando orçamento profissional...");
    const response = await generateOrcamentoLimpo(formData, analise);
    
    // Processar métricas (apenas para logs)
    if (response.metricas) {
      atualizarMetricasHibridas(response.metricas);
      console.log("💰 [LIMPO] Custo:", `R$ ${response.metricas.custo.brl.toFixed(4)}`);
    }
    
    // Funcionalidades auxiliares
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteisLimpo(formData.destino);
    }
    
    const tempoTotal = Date.now() - startTime;
    console.log(`✅ [LIMPO] Orçamento limpo gerado em ${tempoTotal}ms`);
    
    // Log de sucesso
    logEventoSucesso('orcamento_limpo_gerado', {
      estrategia: estrategia,
      tempo_ms: tempoTotal,
      multiplas_opcoes: analise.multiplasOpcoes,
      tem_escalas: analise.temEscalas,
      modelo_usado: response.metricas?.modelo_usado
    });
    
  } catch (error) {
    console.error("❌ [LIMPO] Erro no processamento:", error);
    
    // Log de erro detalhado
    logEventoErro('orcamento_limpo_falhou', error, {
      tempo_ms: Date.now() - startTime,
      stack: error.stack
    });
    
    // Mostrar erro amigável
    showErrorLimpo(error.message);
    
  } finally {
    hideLoadingLimpo();
  }
}

// ================================================================================
// 📊 ANÁLISE LIMPA DE CONTEÚDO
// ================================================================================

function analisarConteudoLimpo(formData) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  // Análise de múltiplas opções
  const multiplasOpcoes = detectarMultiplasOpcoesLimpo(textoCompleto);
  
  // Análise de escalas (NOVA FUNCIONALIDADE)
  const temEscalas = detectarEscalasLimpo(textoCompleto);
  
  // Análise de tipo de viagem
  const tipoViagem = analisarTipoViagemLimpo(textoCompleto);
  
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
  
  if (temEscalas) {
    descricao += ' | Com escalas/conexões';
  }
  
  if (formData.temImagem) {
    descricao += ' | Análise visual';
  }
  
  return {
    multiplasOpcoes: multiplasOpcoes.detectado,
    quantidadeOpcoes: multiplasOpcoes.quantidade,
    tipoViagem: tipoViagem.tipo,
    temEscalas: temEscalas,
    contadores: {
      precos: precos,
      horários: horarios,
      datas: datas,
      companhias: companhias
    },
    descricao: descricao
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE ESCALAS MELHORADA
// ================================================================================

function detectarEscalasLimpo(texto) {
  if (!texto) return false;
  
  const textoLower = texto.toLowerCase();
  
  // Indicadores explícitos de escalas
  const indicadoresEscalas = [
    'uma escala', 'duas escalas', 'três escalas',
    'conexão', 'conexao', 'escala em', 'via ',
    'com escala', 'parada em', 'troca em',
    'conexão em', 'passando por'
  ];
  
  const temIndicadorExplicito = indicadoresEscalas.some(indicador => 
    textoLower.includes(indicador)
  );
  
  // Detectar por padrões de regex
  const padraoEscala = /\d+h\s*\d+min.*escala|escala.*\d+h|via\s+\w{3,}/i;
  const temPadraoEscala = padraoEscala.test(texto);
  
  // Detectar voos longos (mais de 4h podem indicar escala)
  const temposVoo = texto.match(/(\d+)h\s*(\d+)?min/gi) || [];
  const temVooLongo = temposVoo.some(tempo => {
    const match = tempo.match(/(\d+)h/);
    return match && parseInt(match[1]) >= 5; // 5h+ mais provável ter escala
  });
  
  const resultado = temIndicadorExplicito || temPadraoEscala || temVooLongo;
  
  console.log(`[ESCALAS-LIMPO] Detectado: ${resultado}`, {
    explicito: temIndicadorExplicito,
    padrao: temPadraoEscala,
    vooLongo: temVooLongo
  });
  
  return resultado;
}

function detectarMultiplasOpcoesLimpo(texto) {
  if (!texto) return { detectado: false, quantidade: 0 };
  
  const textoLower = texto.toLowerCase();
  
  // Contadores mais precisos
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

function analisarTipoViagemLimpo(texto) {
  if (!texto) return { tipo: 'somente_ida', confianca: 0 };
  
  const textoLower = texto.toLowerCase();
  
  // Indicadores específicos
  const somenteIda = (textoLower.match(/somente ida|só ida|one way/gi) || []).length;
  const idaVolta = (textoLower.match(/ida.*volta|ida.*retorno/gi) || []).length;
  
  let tipo = 'somente_ida';
  let confianca = 1;
  
  if (idaVolta > 0) {
    tipo = 'ida_volta';
    confianca = idaVolta;
  } else if (somenteIda > 0) {
    tipo = 'somente_ida';
    confianca = somenteIda;
  }
  
  return { tipo, confianca };
}

// ================================================================================
// 🤖 GERAÇÃO DE ORÇAMENTO LIMPO
// ================================================================================

async function generateOrcamentoLimpo(formData, analise) {
  console.log("🤖 [LIMPO] Gerando orçamento sem cabeçalhos técnicos...");
  
  try {
    const response = await callAILimpa(formData, analise);
    
    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Resposta da API em formato inválido');
    }
    
    const conteudo = response.choices[0].message.content;
    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Conteúdo da resposta está vazio');
    }
    
    // Verificar se há cabeçalhos técnicos vazados e removê-los
    const conteudoLimpo = limparCabecalhosTecnicos(conteudo);
    
    updateElementLimpo("orcamentoIA", conteudoLimpo);
    
    console.log("✅ [LIMPO] Orçamento limpo gerado:", {
      tamanho: conteudoLimpo.length,
      modelo: response.metricas?.modelo_usado,
      multiplas: analise.multiplasOpcoes,
      escalas: analise.temEscalas
    });
    
    return response;
    
  } catch (error) {
    console.error("❌ [LIMPO] Erro na geração:", error);
    throw new Error(`Falha na geração do orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🧹 LIMPEZA DE CABEÇALHOS TÉCNICOS
// ================================================================================

function limparCabecalhosTecnicos(conteudo) {
  let limpo = conteudo;
  
  // Remover cabeçalhos técnicos que possam ter vazado
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

  // Remover múltiplas quebras de linha
  limpo = limpo.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remover linhas vazias no início
  limpo = limpo.replace(/^\s*\n+/, '');
  
  return limpo.trim();
}

// ================================================================================
// 🔗 COMUNICAÇÃO LIMPA COM API
// ================================================================================

async function callAILimpa(formData, analise) {
  console.log("🔄 [LIMPO] Enviando para API limpa...");
  
  const requestData = {
    prompt: construirPromptFrontend(formData, analise),
    tipo: 'orcamento',
    destino: formData.destino || 'Não informado',
    tipos: Array.isArray(formData.tipos) ? formData.tipos : [],
    temImagem: Boolean(formData.temImagem),
    arquivo: formData.temImagem ? formData.arquivoBase64 : undefined
  };
  
  console.log("📤 [LIMPO] Dados da requisição:", {
    prompt_length: requestData.prompt.length,
    tipo: requestData.tipo,
    temImagem: requestData.temImagem,
    temEscalas: analise.temEscalas
  });
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': `CVC-Itaqua-Frontend-Limpo/${VERSAO_SISTEMA}`
      },
      body: JSON.stringify(requestData)
    });

    console.log("📊 [LIMPO] Status da resposta:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.error("❌ [LIMPO] Erro da API:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
        } catch (jsonError) {
          errorMessage = errorText.substring(0, 200);
        }
      } catch (readError) {
        console.error("❌ [LIMPO] Erro ao ler resposta de erro:", readError);
      }
      
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log("📄 [LIMPO] Resposta recebida (primeiros 200 chars):", responseText.substring(0, 200) + "...");
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("❌ [LIMPO] Erro ao parsear JSON:", jsonError);
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
    
    console.log("✅ [LIMPO] Resposta válida recebida");
    
    return data;
    
  } catch (error) {
    console.error("❌ [LIMPO] Erro na comunicação:", error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Erro de conexão - verifique sua internet e tente novamente');
    } else if (error.message.includes('JSON')) {
      throw new Error('Erro na comunicação com o servidor - resposta inválida');
    } else {
      throw error;
    }
  }
}

function construirPromptFrontend(formData, analise) {
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.trim();
  
  let prompt = `Dados do orçamento:
Destino: ${formData.destino}
Adultos: ${formData.adultos}
Crianças: ${formData.criancas}${formData.idades ? ` (idades: ${formData.idades} anos)` : ''}
Tipos selecionados: ${formData.tipos.join(', ')}

DADOS ESPECÍFICOS DA VIAGEM:
${textoCompleto}

ANÁLISE AUTOMATIZADA:
- Múltiplas opções: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}
- Escalas/conexões detectadas: ${analise.temEscalas ? 'SIM' : 'NÃO'}
- Tipo de viagem: ${analise.tipoViagem}`;

  return prompt;
}

// ================================================================================
// 🎨 INTERFACE LIMPA E FEEDBACK
// ================================================================================

function updateElementLimpo(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ [LIMPO] Elemento '${id}' não encontrado`);
      return false;
    }
    
    if (typeof content !== 'string') {
      console.warn(`⚠️ [LIMPO] Conteúdo inválido para '${id}':`, typeof content);
      content = String(content);
    }
    
    element.innerText = content;
    console.log(`📝 [LIMPO] Elemento '${id}' atualizado (${content.length} chars)`);
    return true;
    
  } catch (error) {
    console.error(`❌ [LIMPO] Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoadingLimpo(mensagem = "Processando...") {
  const sucesso = updateElementLimpo("orcamentoIA", `🤖 ${mensagem}`);
  if (!sucesso) {
    console.warn("⚠️ [LIMPO] Não foi possível mostrar loading");
  }
}

function hideLoadingLimpo() {
  console.log("🔄 [LIMPO] Loading ocultado");
}

function showErrorLimpo(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElementLimpo("orcamentoIA", errorMessage);
  
  if (!sucesso) {
    alert(errorMessage);
  }
  
  console.error("❌ [LIMPO] Erro mostrado:", message);
}

// ================================================================================
// 🔧 FUNCIONALIDADES AUXILIARES LIMPAS
// ================================================================================

async function generateRankingHoteisLimpo(destino) {
  if (!destino || destino.trim().length === 0) {
    console.warn("⚠️ [LIMPO] Destino vazio para ranking de hotéis");
    return;
  }
  
  console.log("🏨 [LIMPO] Gerando ranking de hotéis...");
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;

  try {
    const response = await callAILimpa({ 
      tipos: ['Hotel'], 
      destino: destino,
      observacoes: prompt,
      textoColado: '',
      temImagem: false 
    }, { multiplasOpcoes: false, temEscalas: false });
    
    updateElementLimpo("rankingIA", response.choices[0].message.content);
    console.log("✅ [LIMPO] Ranking de hotéis gerado");
  } catch (error) {
    console.error("❌ [LIMPO] Erro no ranking:", error);
    updateElementLimpo("rankingIA", `❌ Erro ao gerar ranking: ${error.message}`);
  }
}

// ================================================================================
// 🛠️ FUNÇÕES AUXILIARES E VALIDAÇÕES (mantidas do sistema anterior)
// ================================================================================

function validarFormularioCompleto(form) {
  const erros = [];
  
  try {
    const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
    const destino = form.destino?.value?.trim() || "";
    const adultos = parseInt(form.adultos?.value) || 0;
    const criancas = parseInt(form.criancas?.value) || 0;
    const observacoes = form.observacoes?.value?.trim() || "";
    
    if (tipos.length === 0) {
      erros.push("Selecione pelo menos um tipo de serviço");
    }
    
    if (adultos < 1 || adultos > 10) {
      erros.push("Número de adultos deve estar entre 1 e 10");
    }
    
    if (criancas < 0 || criancas > 10) {
      erros.push("Número de crianças deve estar entre 0 e 10");
    }
    
    let idadesCriancas = [];
    for (let i = 1; i <= criancas; i++) {
      const idadeInput = document.getElementById(`idade_crianca_${i}`);
      if (idadeInput) {
        const idade = parseInt(idadeInput.value);
        if (!isNaN(idade) && idade >= 0 && idade <= 17) {
          idadesCriancas.push(idade);
        }
      }
    }
    
    const arquivoBase64 = formElements.previewArea?.dataset.fileData || "";
    const temImagem = !!(arquivoBase64 && arquivoBase64.startsWith('data:image/'));
    
    const textoColado = formElements.pasteArea?.innerText?.trim() || '';
    const conteudoTotal = (observacoes + ' ' + textoColado).trim();
    
    if (!temImagem && conteudoTotal.length < 10) {
      console.warn("⚠️ Pouco conteúdo fornecido - resultado pode ser genérico");
    }
    
    if (erros.length > 0) {
      console.error("❌ [VALIDAÇÃO] Erros:", erros);
      return { valido: false, erros: erros };
    }
    
    return {
      valido: true,
      erros: [],
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
      erros: [`Erro interno na validação: ${error.message}`]
    };
  }
}

// ================================================================================
// 🎨 SISTEMA DE PASTE AREA LIMPO
// ================================================================================

function setupPasteAreaLimpa() {
  if (!formElements.pasteArea) {
    console.warn("⚠️ [LIMPO] PasteArea não encontrada");
    return;
  }
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 [LIMPO] Conteúdo sendo colado...");
    
    e.preventDefault();
    
    try {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
          console.log("🖼️ [LIMPO] Imagem detectada");
          
          const blob = item.getAsFile();
          
          if (!blob) {
            console.error("❌ [LIMPO] Falha ao obter blob da imagem");
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
                <p>✅ Imagem colada - Claude Sonnet ready!</p>
                <div style="font-size: 12px; color: #666; margin: 5px 0;">
                  📊 Análise visual | 🔍 Detecção automática de escalas
                </div>
              `;
              formElements.previewArea.appendChild(img);
              formElements.previewArea.dataset.fileData = base64Data;
              
              console.log('✅ [LIMPO] Imagem colada processada');
              
            } catch (error) {
              console.error('❌ [LIMPO] Erro ao processar imagem colada:', error);
              formElements.previewArea.innerHTML = '<p>❌ Erro ao processar imagem</p>';
            }
          };
          
          reader.onerror = function() {
            console.error('❌ [LIMPO] Erro ao ler imagem colada');
            formElements.previewArea.innerHTML = '<p>❌ Erro ao ler imagem</p>';
          };
          
          reader.readAsDataURL(blob);
          break;
          
        } else if (item.type === 'text/plain') {
          item.getAsString(function (text) {
            if (text && text.trim().length > 0) {
              // Detectar escalas no texto colado
              const temEscalas = detectarEscalasLimpo(text);
              const escalasTexto = temEscalas ? ' | 🔍 Escalas detectadas' : '';
              
              formElements.previewArea.innerHTML = `
                <p>📝 Texto colado - GPT-4o-mini ready!</p>
                <div style="font-size: 12px; color: #666;">${text.substring(0, 100)}...${escalasTexto}</div>
              `;
              console.log('📝 [LIMPO] Texto colado processado:', text.length, 'caracteres, escalas:', temEscalas);
            }
          });
        }
      }
      
    } catch (error) {
      console.error('❌ [LIMPO] Erro no paste:', error);
      formElements.previewArea.innerHTML = '<p>❌ Erro ao processar conteúdo colado</p>';
    }
  });
  
  // Efeitos visuais
  formElements.pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#003399';
    this.style.backgroundColor = '#e9ecef';
    this.textContent = '📎 Solte aqui - Sistema limpo!';
  });

  formElements.pasteArea.addEventListener('dragleave', function(e) {
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude | 🔍 Detecção automática de escalas';
  });
  
  console.log("✅ [LIMPO] PasteArea configurada");
}

// ================================================================================
// 📁 UPLOAD DE ARQUIVO LIMPO
// ================================================================================

async function handleFileUploadLimpo(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 [LIMPO] Arquivo selecionado:", file.name, file.size, "bytes");

  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Apenas arquivos de imagem são aceitos (PNG, JPG, JPEG)');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo: 5MB');
    }

    if (file.size < 1024) {
      throw new Error('Arquivo muito pequeno. Pode estar corrompido');
    }

    showLoadingLimpo("Processando imagem...");
    const base64 = await fileToBase64Seguro(file);
    
    if (formElements.previewArea) {
      formElements.previewArea.dataset.fileData = base64;
      
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      
      formElements.previewArea.innerHTML = `
        <p>✅ Imagem carregada - Claude Sonnet ready!</p>
        <div style="font-size: 12px; color: #666; margin: 5px 0;">
          📊 ${file.type} | ${sizeInMB}MB | 🟠 Análise visual | 🔍 Detecção automática
        </div>
      `;
      formElements.previewArea.appendChild(img);
    }
    
    console.log('✅ [LIMPO] Imagem processada:', sizeInMB, 'MB');
    
  } catch (error) {
    console.error("❌ [LIMPO] Erro no upload:", error);
    
    if (formElements.previewArea) {
      formElements.previewArea.innerHTML = `<p>❌ Erro: ${error.message}</p>`;
    }
    
    alert(`Erro ao processar imagem: ${error.message}`);
  } finally {
    hideLoadingLimpo();
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
// 🧪 TESTE DE CONEXÃO LIMPO
// ================================================================================

async function testarConexaoAPILimpa() {
  try {
    console.log("🧪 [LIMPO] Testando API limpa...");
    
    const response = await fetch(API_URL, { 
      method: 'GET',
      headers: {
        'User-Agent': `CVC-Itaqua-Frontend-Limpo/${VERSAO_SISTEMA}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ [LIMPO] API Limpa Online:", {
        version: data.version,
        melhorias: data.melhorias
      });
    } else {
      console.warn("⚠️ [LIMPO] API com problemas:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("❌ [LIMPO] Erro na conexão:", error.message);
  }
}

// ================================================================================
// 💰 SISTEMA DE MEDIDOR DE CUSTO (mantido igual)
// ================================================================================

function inicializarMedidorCusto() {
  try {
    console.log("💰 [CUSTO] Inicializando medidor...");
    
    const dadosSalvos = localStorage.getItem('cvc_custo_meter_limpo');
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
    
    criarWidgetCustoLimpo();
    atualizarWidgetCustoLimpo();
    
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao inicializar:", error);
    resetarContadorDiario();
  }
}

function criarWidgetCustoLimpo() {
  if (document.getElementById('custoWidgetLimpo')) return;
  
  const widget = document.createElement('div');
  widget.id = 'custoWidgetLimpo';
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
  
  widget.addEventListener('click', mostrarDashboardLimpo);
  
  document.body.appendChild(widget);
  console.log("✅ [CUSTO] Widget limpo criado");
}

function atualizarWidgetCustoLimpo() {
  const widget = document.getElementById('custoWidgetLimpo');
  if (!widget) return;
  
  widget.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 13px; font-weight: bold;">💰 Hoje: R$ ${custoMeter.custoTotalHoje.toFixed(3)}</div>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
        📊 ${custoMeter.orcamentosHoje} orçamentos limpos
      </div>
      <div style="font-size: 9px; opacity: 0.8; margin-top: 1px;">
        🔵${custoMeter.orcamentosTexto} texto | 🟠${custoMeter.orcamentosImagem} imagem
      </div>
    </div>
  `;
}

function mostrarDashboardLimpo() {
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
      <h3 style="color: #003399; margin-bottom: 1.5rem;">📊 Dashboard Limpo - Orçamentos Profissionais</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
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
          <div style="font-size: 0.9rem; color: #666;">Orçamentos Limpos</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #f57c00;">
            100%
          </div>
          <div style="font-size: 0.9rem; color: #666;">Sem Cabeçalhos</div>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <strong>🧹 Sistema Limpo Ativo:</strong><br>
        ✅ Orçamentos sem cabeçalhos técnicos<br>
        🔍 Detecção automática de escalas<br>
        ✈️ Conversão completa de aeroportos<br>
        📋 Prontos para copy/paste direto
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

function atualizarMetricasHibridas(metricas) {
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
    atualizarWidgetCustoLimpo();
    
    console.log("📊 [MÉTRICAS-LIMPO] Atualizadas:", {
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
    localStorage.setItem('cvc_custo_meter_limpo', JSON.stringify(custoMeter));
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

async function gerarDicasDestino() {
  const destino = document.getElementById('destino').value;
  
  if (!destino) {
    alert('Informe um destino primeiro!');
    return;
  }
  
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  btnGerar.disabled = true;
  btnGerar.innerText = '🤖 Gerando...';
  
  try {
    const prompt = `Crie dicas personalizadas sobre ${destino} para WhatsApp da CVC.
    
Inclua:
- Principais atrações e pontos turísticos
- Melhor época para visitar
- Dicas de clima e o que levar
- Informações práticas (moeda, documentação, fuso horário)
- Tom vendedor mas informativo
- Máximo 250 palavras
- Use emojis para deixar atrativo`;

    const response = await callAILimpa({
      tipos: ['Destino'],
      destino: destino,
      observacoes: prompt,
      textoColado: '',
      temImagem: false
    }, { multiplasOpcoes: false, temEscalas: false });
    
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
// 🎛️ LOGS E EVENTOS
// ================================================================================

function logEventoSucesso(evento, dados) {
  console.log(`✅ [EVENTO-LIMPO] ${evento}:`, dados);
}

function logEventoErro(evento, error, contexto) {
  console.error(`❌ [EVENTO-LIMPO] ${evento}:`, {
    message: error.message,
    contexto: contexto
  });
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
  
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 10000);
}

// ================================================================================
// 📊 LOGS FINAIS E INICIALIZAÇÃO
// ================================================================================

console.log(`🚀 Sistema CVC Itaqua LIMPO v${VERSAO_SISTEMA} carregado!`);
console.log("🧹 Melhorias implementadas:");
console.log("   ✅ Orçamentos sem cabeçalhos técnicos");
console.log("   🔍 Detecção automática de escalas/conexões");
console.log("   ✈️ Conversão completa de códigos de aeroportos");
console.log("   📋 Templates prontos para copy/paste direto");
console.log("   🎨 Interface limpa e profissional");
console.log("   💰 Medidor de custos otimizado");
console.log("🎯 Sistema pronto para orçamentos profissionais!");

// Exportar funções para debug (apenas em desenvolvimento)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.debugCVCLimpo = {
    detectarEscalas: detectarEscalasLimpo,
    analisarConteudo: analisarConteudoLimpo,
    limparCabecalhos: limparCabecalhosTecnicos,
    resetarCusto: resetarContadorDiario,
    versao: VERSAO_SISTEMA
  };
  console.log("🧪 [DEBUG] Funções de debug disponíveis em window.debugCVCLimpo");
}
