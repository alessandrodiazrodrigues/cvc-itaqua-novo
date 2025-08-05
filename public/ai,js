// 🚀 ai.js - SISTEMA FRONTEND LIMPO v7.0
// Removidas todas as duplicatas - Foco apenas na interface
// Backend centralizado em api/ai.js com módulos especializados

console.log("🚀 CVC ITAQUA Frontend v7.0 - Sistema Limpo Carregado");

// ================================================================================
// 🎯 CONFIGURAÇÕES PRINCIPAIS
// ================================================================================

const API_URL = '/api/ai';

// Elementos da interface
const formElements = {
  get form() { return document.getElementById('orcamentoForm'); },
  get pasteArea() { return document.getElementById('pasteArea'); },
  get previewArea() { return document.getElementById('previewArea'); },
  get pdfUpload() { return document.getElementById('pdfUpload'); }
};

// Estado global simplificado
const estadoGlobal = {
  ultimoOrcamento: null,
  ultimoDestino: null,
  ultimaAnalise: null
};

// ================================================================================
// 🔧 FUNÇÃO PRINCIPAL - GERAR ORÇAMENTO
// ================================================================================

async function gerarOrcamento() {
  console.log("🤖 Iniciando geração de orçamento v7.0...");
  
  try {
    showLoading("orcamentoIA");
    
    // Extrair dados do formulário
    const formData = extractFormData(formElements.form);
    console.log("📊 Dados extraídos:", formData);
    
    // Validar dados obrigatórios
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de orçamento");
    }
    
    // Chamar API backend (que usa os módulos especializados)
    const response = await callAI(formData, 'orcamento');
    
    // Atualizar interface
    updateElement("orcamentoIA", response);
    estadoGlobal.ultimoOrcamento = response;
    estadoGlobal.ultimoDestino = formData.destino;
    
    // Habilitar botões relacionados
    habilitarBotaoDicas();
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao gerar orçamento:", error);
    showError("Erro ao gerar orçamento: " + error.message);
  } finally {
    hideLoading();
  }
}

// ================================================================================
// 🏨 FUNÇÃO RANKING DE HOTÉIS
// ================================================================================

async function gerarRankingHoteis() {
  console.log("🏨 Gerando ranking de hotéis...");
  
  try {
    showLoading("rankingIA");
    
    const destino = estadoGlobal.ultimoDestino || 
                   document.getElementById('destino')?.value || 
                   'destino não informado';
    
    if (!destino || destino === 'destino não informado') {
      throw new Error("Destino não encontrado. Gere um orçamento primeiro.");
    }
    
    const formData = { destino };
    const response = await callAI(formData, 'ranking');
    
    updateElement("rankingIA", response);
    console.log("✅ Ranking gerado para:", destino);
    
  } catch (error) {
    console.error("❌ Erro no ranking:", error);
    showError("Erro ao gerar ranking: " + error.message);
  }
}

// ================================================================================
// 💡 FUNÇÃO DICAS DE DESTINO
// ================================================================================

async function gerarDicasDestino() {
  console.log("💡 Gerando dicas de destino...");
  
  try {
    showLoading("dicasIA");
    
    const destino = estadoGlobal.ultimoDestino || 
                   document.getElementById('destino')?.value || 
                   'destino não informado';
    
    if (!destino || destino === 'destino não informado') {
      throw new Error("Destino não encontrado. Gere um orçamento primeiro.");
    }
    
    const formData = { destino };
    const response = await callAI(formData, 'dicas');
    
    updateElement("dicasIA", response);
    console.log("✅ Dicas geradas para:", destino);
    
  } catch (error) {
    console.error("❌ Erro nas dicas:", error);
    showError("Erro ao gerar dicas: " + error.message);
  }
}

// ================================================================================
// 📄 FUNÇÃO ANÁLISE DE PDF
// ================================================================================

async function analisarPDF() {
  console.log("📄 Analisando PDF...");
  
  try {
    const file = formElements.pdfUpload?.files[0];
    if (!file) {
      throw new Error("Selecione um arquivo PDF primeiro!");
    }
    
    showLoading("analiseIA");
    
    const base64 = await fileToBase64(file);
    const formData = {
      arquivo: base64,
      nomeArquivo: file.name
    };
    
    const response = await callAI(formData, 'analise');
    updateElement("analiseIA", response);
    
    console.log("✅ PDF analisado:", file.name);
    
  } catch (error) {
    console.error("❌ Erro na análise:", error);
    showError("Erro ao analisar PDF: " + error.message);
  }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

// Extração de dados do formulário
function extractFormData(form) {
  if (!form) {
    throw new Error("Formulário não encontrado");
  }
  
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked"))
                     .map(el => el.value);
  
  const qtdeCriancas = parseInt(form.criancas?.value) || 0;
  let idadesCriancas = [];
  
  for (let i = 1; i <= qtdeCriancas; i++) {
    const idadeInput = document.getElementById(`idade_crianca_${i}`);
    if (idadeInput && idadeInput.value) {
      idadesCriancas.push(idadeInput.value);
    }
  }
  
  return {
    destino: form.destino?.value || "",
    adultos: form.adultos?.value || "2",
    criancas: form.criancas?.value || "0",
    idades: idadesCriancas.join(', '),
    observacoes: form.observacoes?.value || "",
    tipos: tipos,
    textoColado: formElements.pasteArea?.innerText || '',
    // Dados de arquivos
    arquivoBase64: formElements.previewArea?.dataset.fileData || "",
    temImagem: !!(formElements.previewArea?.dataset.fileData)
  };
}

// Chamada para API backend
async function callAI(formData, tipo) {
  try {
    console.log(`🔄 Chamando API backend: ${tipo}`);
    console.log("📊 Dados sendo enviados:", { formData, tipo });
    
    const requestBody = {
      formData: formData,
      tipo: tipo,
      versao: '7.0'
    };
    
    console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("📥 Response status:", response.status);
    
    const responseText = await response.text();
    console.log("📄 Response text:", responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse da resposta:", parseError);
      throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}`);
    }
    
    if (!response.ok) {
      console.error("❌ Erro HTTP:", data);
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    if (!data.success) {
      console.error("❌ Erro na resposta:", data);
      throw new Error(data.error || "Resposta inválida da API");
    }
    
    console.log("✅ Resposta recebida do backend");
    return data.result;
    
  } catch (error) {
    console.error("❌ Erro na comunicação com backend:", error);
    throw error;
  }
}

// Conversão de arquivo para Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

// Atualização de elementos da interface
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = content;
    console.log(`📝 Elemento ${id} atualizado`);
  } else {
    console.warn(`⚠️ Elemento ${id} não encontrado`);
  }
}

// Estados de loading
function showLoading(elementId = "orcamentoIA") {
  updateElement(elementId, "🤖 Processando com IA...");
}

function hideLoading() {
  // O loading será substituído pelo conteúdo real
}

function showError(message) {
  console.error("❌ Erro exibido:", message);
  updateElement("orcamentoIA", "❌ " + message);
}

// Habilitar botões após orçamento
function habilitarBotaoDicas() {
  const btnDicas = document.getElementById('btnGerarDicas');
  const btnRanking = document.getElementById('btnGerarRanking');
  
  if (btnDicas) {
    btnDicas.disabled = false;
    console.log("✅ Botão dicas habilitado");
  }
  
  if (btnRanking) {
    btnRanking.disabled = false;
    console.log("✅ Botão ranking habilitado");
  }
}

// ================================================================================
// 📋 FUNÇÕES DE CÓPIA
// ================================================================================

function copiarTexto(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ Elemento não encontrado:", id);
    alert("Elemento não encontrado!");
    return;
  }

  const texto = elemento.innerText;
  if (!texto || texto.trim() === "") {
    alert("Nenhum conteúdo para copiar!");
    return;
  }

  navigator.clipboard.writeText(texto).then(() => {
    console.log("✅ Texto copiado:", id);
    
    // Feedback visual
    const originalText = elemento.innerText;
    elemento.innerText = "✅ COPIADO!";
    
    setTimeout(() => {
      elemento.innerText = originalText;
    }, 1000);
    
  }).catch(err => {
    console.error("❌ Erro ao copiar:", err);
    alert("Erro ao copiar texto!");
  });
}

// ================================================================================
// 📁 ÁREA DE PASTE E UPLOAD
// ================================================================================

// Configurar área de paste
if (formElements.pasteArea) {
  formElements.pasteArea.addEventListener('paste', (e) => {
    console.log("📋 Conteúdo colado na área de paste");
    
    // Processar arquivos colados
    const items = Array.from(e.clipboardData?.items || []);
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        handleImageUpload(file);
        break;
      }
    }
  });
}

// Processar upload de imagem
function handleImageUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    console.warn("⚠️ Arquivo não é uma imagem válida");
    return;
  }
  
  console.log("🖼️ Processando imagem:", file.name);
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (formElements.previewArea) {
      formElements.previewArea.innerHTML = `
        <img src="${e.target.result}" style="max-width: 200px; max-height: 200px;" alt="Preview">
        <p>📎 ${file.name}</p>
      `;
      formElements.previewArea.dataset.fileData = e.target.result;
      console.log("✅ Imagem carregada para preview");
    }
  };
  reader.readAsDataURL(file);
}

// ================================================================================
// 🚀 INICIALIZAÇÃO
// ================================================================================

// Auto-execução quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Sistema CVC Itaqua v7.0 inicializado");
  console.log("🔗 Backend modular integrado em api/ai.js");
  console.log("🧹 Frontend limpo - sem duplicatas");
  
  // Verificar se elementos principais existem
  const elementos = ['orcamentoForm', 'pasteArea', 'previewArea'];
  elementos.forEach(id => {
    const elemento = document.getElementById(id);
    console.log(`${elemento ? '✅' : '❌'} Elemento ${id}: ${elemento ? 'encontrado' : 'não encontrado'}`);
  });
});

console.log("✅ Frontend v7.0 carregado - Arquitetura limpa e organizada!");
