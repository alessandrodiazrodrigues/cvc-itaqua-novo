// 🚀 ai.js - Arquivo Principal (Versão Modular)
// Importa todos os módulos necessários

console.log("⚡ CVC ITAQUA - SISTEMA MODULAR ATIVO (v3.0)");

// ================================================================================
// 📱 CONFIGURAÇÕES GLOBAIS
// ================================================================================

const CONFIG = {
  API_URL: '/api/ai',
  VERSION: '3.0',
  DEBUG: true
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
  console.log("🔄 Iniciando sistema modular v3.0...");
  
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
  
  console.log("✅ Sistema modular inicializado!");
});

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
    console.log("🧪 Testando conexão com API v3.0...");
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'teste de conexão v3.0',
        tipo: 'teste'
      })
    });
    
    if (response.ok) {
      console.log("✅ API Vercel v3.0 conectada!");
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
  const texto = document.getElementById(id)?.innerText;
  if (!texto) return;
  
  navigator.clipboard.writeText(texto).then(() => {
    // Feedback visual
    const button = event.target;
    const originalText = button.innerText;
    button.innerText = "✅ Copiado!";
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
  }).catch(err => {
    console.error("Erro ao copiar:", err);
    alert("Erro ao copiar. Tente selecionar o texto manualmente.");
  });
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

console.log("🚀 Sistema modular v3.0 carregado!");
