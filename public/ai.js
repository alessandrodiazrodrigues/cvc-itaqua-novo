// 🚀 ai.js - Arquivo Principal (Versão Modular)
// Importa todos os módulos necessários

console.log("⚡ CVC ITAQUA - SISTEMA MODULAR ATIVO (v4.0 - Integrado)");

// ================================================================================
// 📱 CONFIGURAÇÕES GLOBAIS
// ================================================================================

const CONFIG = {
  API_URL: '/api/ai',
  VERSION: '4.0',
  DEBUG: true,
  MODULES: {
    DETECTION: 'ai-detection.js',
    TEMPLATES: 'ai-templates.js', 
    PROMPTS: 'ai-prompts.js',
    FORMATTING: 'ai-formatting.js'
  }
};

let formElements = {};
let estadoGlobal = {
  orcamentoGerado: false,
  ultimoDestino: '',
  ultimoOrcamento: ''
};

// ================================================================================
// 🔧 INICIALIZAÇÃO PRINCIPAL
// ================================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema modular v4.0 integrado...");
  
  // Inicializar elementos do formulário
  initFormElements();
  
  // Conectar eventos
  setupEventListeners();
  
  // Configurar área de paste
  setupPasteArea();
  
  // Testar conexão com API
  testarConexaoAPI();
  
  // Inicializar botões de dicas
  initBotoesDicas();
  
  // Verificar integração dos módulos
  verificarModulosIntegrados();
  
  console.log("✅ Sistema modular v4.0 inicializado!");
});

// ================================================================================
// 🔍 VERIFICAÇÃO DE MÓDULOS INTEGRADOS
// ================================================================================

function verificarModulosIntegrados() {
  console.log("🔍 Verificando integração dos módulos v4.0...");
  
  const modulos = {
    'ai-detection.js': typeof analisarTextoCompleto === 'function',
    'ai-templates.js': typeof aplicarTemplate === 'function',
    'ai-prompts.js': typeof gerarPromptOtimizado === 'function',
    'ai-formatting.js': typeof formatText === 'function',
    'ai-orcamento.js': typeof generateOrcamento === 'function'
  };
  
  let modulosCarregados = 0;
  let totalModulos = Object.keys(modulos).length;
  
  Object.entries(modulos).forEach(([nome, carregado]) => {
    const status = carregado ? '✅ Carregado' : '❌ Não disponível';
    console.log(`- ${nome}: ${status}`);
    if (carregado) modulosCarregados++;
  });
  
  const porcentagem = Math.round((modulosCarregados / totalModulos) * 100);
  console.log(`\n📊 Status da integração: ${modulosCarregados}/${totalModulos} módulos (${porcentagem}%)`);
  
  if (porcentagem === 100) {
    console.log("✅ Todos os módulos v4.0 integrados com sucesso!");
  } else if (porcentagem >= 80) {
    console.log("⚠️ Maioria dos módulos carregados - sistema funcional");
  } else {
    console.log("❌ Alguns módulos não carregaram - funcionalidade limitada");
  }
  
  return { modulosCarregados, totalModulos, porcentagem };
}

// ================================================================================
// 🎯 EXTRAÇÃO DE DADOS DO FORMULÁRIO
// ================================================================================

function extractFormData(form) {
  console.log("📊 Extraindo dados do formulário...");
  
  const tipos = Array.from(form.querySelectorAll('input[name="tipo"]:checked'))
    .map(checkbox => checkbox.value);
  
  const parcelamento = obterConfiguracaoParcelamento();
  
  const idades = extrairIdadesCriancas();
  
  const formData = {
    tipos: tipos,
    destino: form.querySelector('#destino')?.value?.trim() || '',
    adultos: parseInt(form.querySelector('#adultos')?.value) || null,
    criancas: parseInt(form.querySelector('#criancas')?.value) || 0,
    idadesCriancas: idades,
    observacoes: form.querySelector('#observacoes')?.value || '',
    textoColado: extrairTextoColado(),
    arquivo: extrairArquivo(),
    parcelamento: parcelamento,
    temImagem: verificarSeTemImagem()
  };
  
  console.log("📋 Dados extraídos:", formData);
  
  return formData;
}

function extrairIdadesCriancas() {
  const idades = [];
  const qtdeCriancas = parseInt(document.getElementById('criancas')?.value) || 0;
  
  for (let i = 1; i <= qtdeCriancas; i++) {
    const idade = document.getElementById(`idade_crianca_${i}`)?.value;
    if (idade) {
      idades.push(parseInt(idade));
    }
  }
  
  return idades;
}

function extrairTextoColado() {
  const pasteArea = document.getElementById('pasteArea');
  if (!pasteArea) return '';
  
  const texto = pasteArea.innerText || pasteArea.textContent || '';
  return texto.replace('📌 Clique aqui ou pressione Ctrl+V para colar conteúdo | 🔍 Detecção automática de escalas', '').trim();
}

function extrairArquivo() {
  const arquivoInput = document.getElementById('arquivo');
  return arquivoInput?.files?.[0] || null;
}

function verificarSeTemImagem() {
  const previewArea = document.getElementById('previewArea');
  return !!(previewArea?.dataset?.fileData || document.getElementById('arquivo')?.files?.[0]);
}

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE ORÇAMENTO
// ================================================================================

async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando formulário v3.0...");
  
  try {
    showLoading("Analisando dados da viagem...");
    
    const formData = extractFormData(e.target);
    
    // Validação
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de serviço");
    }
    
    // Pré-análise
    const analise = analisarDadosViagem(formData);
    console.log("🔍 Análise da viagem:", analise);
    
    // Gerar orçamento
    await generateOrcamento(formData, analise);
    
    // Atualizar estado global
    estadoGlobal.orcamentoGerado = true;
    estadoGlobal.ultimoOrcamento = document.getElementById('orcamentoIA')?.innerText || '';
    
    // Habilitar botões de dicas
    habilitarBotoesDicas();
    
    // Auto-gerar ranking se for hotel
    if (formData.tipos.includes("Hotel")) {
      setTimeout(() => generateRankingHoteis(formData.destino), 1000);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}

// ================================================================================
// 🔧 CONFIGURAÇÃO DE ELEMENTOS E EVENTOS
// ================================================================================

function initFormElements() {
  formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload")
  };
  
  console.log("📋 Elementos do formulário inicializados");
}

function setupEventListeners() {
  if (formElements.form) {
    formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário conectado");
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
    console.log("✅ Upload de arquivo conectado");
  }
}

function initBotoesDicas() {
  // Inicializar botões de dicas em estado desabilitado
  const btnDicas = document.getElementById('btnGerarDicas');
  const btnRanking = document.getElementById('btnGerarRanking');
  
  if (btnDicas) {
    btnDicas.disabled = true;
    btnDicas.title = "Gere um orçamento primeiro";
  }
  
  if (btnRanking) {
    btnRanking.disabled = true;
    btnRanking.title = "Selecione 'Hotel' e gere um orçamento primeiro";
  }
}

function habilitarBotoesDicas() {
  const btnDicas = document.getElementById('btnGerarDicas');
  const btnRanking = document.getElementById('btnGerarRanking');
  
  if (btnDicas) {
    btnDicas.disabled = false;
    btnDicas.title = "Clique para gerar dicas do destino";
  }
  
  // Só habilita ranking se tiver hotel no orçamento
  if (btnRanking && estadoGlobal.ultimoOrcamento.toLowerCase().includes('hotel')) {
    btnRanking.disabled = false;
    btnRanking.title = "Clique para gerar ranking de hotéis";
  }
}

// ================================================================================
// 🔗 TESTE DE CONEXÃO
// ================================================================================

async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando conexão com API v4.0...");
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'teste de conexão v4.0 integrado',
        tipo: 'teste',
        metadata: {
          versao: CONFIG.VERSION,
          modulos: Object.keys(CONFIG.MODULES)
        }
      })
    });
    
    if (response.ok) {
      console.log("✅ API Vercel v4.0 conectada!");
    } else {
      console.warn("⚠️ API status:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
  }
}

// ================================================================================
// 🎨 INTERFACE E FEEDBACK
// ================================================================================

function updateElement(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ Elemento '${id}' não encontrado`);
      return false;
    }
    
    element.innerText = content;
    console.log(`📝 Elemento '${id}' atualizado`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoading(mensagem = "Processando...") {
  updateElement("orcamentoIA", `🤖 ${mensagem}`);
}

function hideLoading() {
  console.log("🔄 Loading ocultado");
}

function showError(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElement("orcamentoIA", errorMessage);
  
  if (!sucesso) {
    alert(errorMessage);
  }
}

// ================================================================================
// 📎 FUNÇÕES DE UTILIDADE
// ================================================================================

function copiarTexto(id) {
  console.log("📋 Tentando copiar elemento:", id);
  
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ Elemento não encontrado:", id);
    alert("Elemento não encontrado!");
    return;
  }
  
  const texto = elemento.innerText || elemento.textContent;
  
  if (!texto || texto.trim() === '') {
    console.warn("⚠️ Elemento vazio:", id);
    alert("Não há conteúdo para copiar!");
    return;
  }
  
  console.log("📄 Copiando texto:", texto.substring(0, 100) + "...");
  
  // Tenta método moderno primeiro
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log("✅ Texto copiado via Clipboard API");
      mostrarFeedbackCopia(event.target, "✅ Copiado!");
    }).catch(err => {
      console.warn("❌ Clipboard API falhou, tentando alternativo...", err);
      tentarCopiaAlternativa(texto, event.target);
    });
  } else {
    console.log("📝 Usando método alternativo (não é contexto seguro)");
    tentarCopiaAlternativa(texto, event.target);
  }
}

function tentarCopiaAlternativa(texto, button) {
  try {
    // Cria elemento temporário para seleção
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    
    // Seleciona e copia
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Para mobile
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log("✅ Copiado via execCommand");
      mostrarFeedbackCopia(button, "✅ Copiado!");
    } else {
      throw new Error("execCommand falhou");
    }
  } catch (err) {
    console.error("❌ Cópia falhou completamente:", err);
    mostrarInstrucoesManuais(button, texto);
  }
}

function mostrarFeedbackCopia(button, texto) {
  if (!button) return;
  
  const originalText = button.innerText;
  const originalBackground = button.style.background;
  
  button.innerText = texto;
  button.style.background = '#28a745';
  button.style.transform = 'scale(1.05)';
  
  setTimeout(() => {
    button.innerText = originalText;
    button.style.background = originalBackground;
    button.style.transform = 'scale(1)';
  }, 2000);
}

function mostrarInstrucoesManuais(button, texto) {
  mostrarFeedbackCopia(button, "❌ Falhou");
  
  // Cria modal com instruções
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
    align-items: center; justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white; padding: 2rem; border-radius: 8px;
    max-width: 500px; max-height: 400px; overflow-y: auto;
  `;
  
  content.innerHTML = `
    <h3>📋 Cópia Manual Necessária</h3>
    <p>Selecione o texto abaixo e pressione <strong>Ctrl+C</strong>:</p>
    <textarea readonly style="width: 100%; height: 200px; margin: 1rem 0;">${texto}</textarea>
    <button onclick="this.parentElement.parentElement.remove()" 
            style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px;">
      Fechar
    </button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Remove modal ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE PARA FUNCIONALIDADE DE CÓPIA
// ================================================================================

function testarFuncionalidadeCopia() {
  console.log("🧪 Testando funcionalidade de cópia...");
  
  const elementos = ['orcamentoIA', 'destinoIA', 'rankingIA'];
  const resultados = [];
  
  elementos.forEach(id => {
    const elemento = document.getElementById(id);
    const existe = elemento !== null;
    const temConteudo = existe && elemento.innerText.trim() !== '';
    
    resultados.push({
      id,
      existe,
      temConteudo,
      conteudo: existe ? elemento.innerText.substring(0, 50) + '...' : 'N/A'
    });
    
    console.log(`${existe ? '✅' : '❌'} Elemento '${id}': ${existe ? 'encontrado' : 'não encontrado'}`);
    if (existe) {
      console.log(`📄 Conteúdo: ${elemento.innerText.substring(0, 100)}...`);
    }
  });
  
  // Testa função de cópia se elementos existem
  const elementosExistentes = resultados.filter(r => r.existe && r.temConteudo);
  if (elementosExistentes.length > 0) {
    console.log(`🎯 Elementos disponíveis para cópia: ${elementosExistentes.map(e => e.id).join(', ')}`);
  } else {
    console.log("⚠️ Nenhum elemento com conteúdo disponível para teste de cópia");
  }
  
  return resultados;
}

// Execução automática do teste em desenvolvimento
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  setTimeout(() => {
    console.log("\n🧪 === TESTE FUNCIONALIDADE DE CÓPIA ===");
    testarFuncionalidadeCopia();
    console.log("🧪 === FIM DO TESTE ===\n");
  }, 1500);
}

// ================================================================================
// 🔄 IMPORTS DOS MÓDULOS ESPECÍFICOS
// ================================================================================

// As funções específicas serão carregadas de outros arquivos:
// - ai-orcamento.js (geração de orçamentos)
// - ai-dicas.js (dicas de destino)  
// - ai-ranking.js (ranking de hotéis)
// - ai-utils.js (utilitários)
// - ai-paste.js (área de paste)

console.log("🚀 Sistema modular v4.0 integrado carregado!");
console.log("🔗 Módulos integrados: Detection, Templates, Prompts, Formatting");
