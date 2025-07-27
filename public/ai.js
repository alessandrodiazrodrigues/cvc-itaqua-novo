// public/ai.js - Frontend modificado para Vercel API

// URL da API (automaticamente detecta o domínio)
const API_URL = '/api/ai';

console.log("⚡ CVC ITAQUA - SISTEMA VERCEL ATIVO");

// Variáveis globais
let formElements = {};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema...");
  
  // Cache elementos DOM
  formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload") // Para index.html
  };

  // Event Listeners
  if (formElements.form) {
    formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário de orçamento conectado");
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
    console.log("✅ Upload de arquivo conectado");
  }

  // Para index.html - análise de PDF
  if (formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
    console.log("✅ Análise de PDF conectada");
  }

  setupPasteArea();
  testarConexaoAPI();
});

// 🧪 TESTAR CONEXÃO COM API
async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando conexão com API...");
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'teste de conexão',
        tipo: 'teste'
      })
    });
    
    if (response.ok) {
      console.log("✅ API Vercel conectada com sucesso!");
    } else {
      console.warn("⚠️ API retornou status:", response.status);
      const errorData = await response.json();
      console.warn("Detalhes:", errorData);
    }
  } catch (error) {
    console.error("❌ Erro na conexão com API:", error);
    console.error("Verifique se o deploy foi feito corretamente");
  }
}

// 🎯 FUNÇÃO PRINCIPAL: Gerar Orçamento
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando formulário...");
  
  showLoading();
  
  try {
    const formData = extractFormData(e.target);
    console.log("📊 Dados extraídos:", formData);
    
    // Validação básica
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de serviço");
    }
    
    // Gerar orçamento principal
    await generateOrcamento(formData);
    
    // Gerar texto do destino (se destino informado)
    if (formData.destino && formData.destino !== "(Destino não informado)") {
      await generateTextoDestino(formData.destino);
    }
    
    // Gerar ranking de hotéis (se for tipo Hotel)
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao processar:", error);
    showError("Erro ao processar solicitação: " + error.message);
  } finally {
    hideLoading();
  }
}

// 📊 Extrair dados do formulário
function extractFormData(form) {
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
  
  const formData = {
    destino: form.destino.value || "(Destino não informado)",
    adultos: form.adultos.value || "2",
    criancas: form.criancas.value || "0",
    idades: form.idades_criancas.value || "",
    observacoes: form.observacoes.value || "",
    tipos: tipos,
    textoColado: formElements.pasteArea?.innerText || '',
    arquivoBase64: formElements.previewArea?.dataset.fileData || "",
    temImagem: !!(formElements.previewArea?.dataset.fileData)
  };
  
  console.log("Tipos selecionados:", tipos);
  console.log("Tem imagem:", formData.temImagem);
  
  return formData;
}

// 🤖 Gerar orçamento principal
async function generateOrcamento(data) {
  console.log("🤖 Gerando orçamento principal...");
  
  const prompt = `Dados do orçamento:
Destino: ${data.destino}
Adultos: ${data.adultos}
Crianças: ${data.criancas}${data.idades ? ` (idades: ${data.idades})` : ''}
Observações: ${data.observacoes}
Texto adicional enviado: ${data.textoColado}`;

  const response = await callAI(prompt, 'orcamento', data);
  updateElement("orcamentoIA", response);
}

// 🌍 Gerar texto do destino
async function generateTextoDestino(destino) {
  console.log("🌍 Gerando texto do destino:", destino);
  
  const prompt = `Crie um texto promocional sobre ${destino} para WhatsApp da CVC. 
  
Inclua:
- Principais atrações
- Melhor época para visitar  
- Dicas importantes
- Tom vendedor mas informativo
- Máximo 200 palavras
- Use emojis`;

  const response = await callAI(prompt, 'destino', { destino });
  updateElement("destinoIA", response);
}

// 🏨 Gerar ranking de hotéis
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking de hotéis para:", destino);
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias com crianças.

Formato:
🏆 1. Nome do Hotel - Estrelas
📍 Localização  
💰 Faixa de preço
⭐ Destaques

Seja realista e informativo.`;

  const response = await callAI(prompt, 'ranking', { destino });
  updateElement("rankingIA", response);
}

// 📄 Análise de PDF (para index.html)
async function handlePDFAnalysis() {
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  console.log("📄 Analisando arquivo:", file.name);
  showLoading("analiseIA");
  
  try {
    const base64 = await fileToBase64(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. Principais métricas de vendas
2. Metas vs realizado  
3. Produtos mais vendidos
4. Recomendações de ação

Formato executivo, objetivo e prático.`;

    const response = await callAI(prompt, 'analise', { 
      temImagem: true, 
      arquivo: base64 
    });
    
    updateElement("analiseIA", response);
    
    // Mostrar container de resultado
    const container = document.getElementById('analiseContainer');
    if (container) {
      container.style.display = 'block';
    }
    
  } catch (error) {
    console.error("❌ Erro na análise:", error);
    updateElement("analiseIA", "❌ Erro ao analisar arquivo: " + error.message);
  } finally {
    hideLoading("analiseIA");
  }
}

// 📁 Upload de arquivo
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Arquivo selecionado:", file.name);

  try {
    const base64 = await fileToBase64(file);
    formElements.previewArea.dataset.fileData = base64;
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      formElements.previewArea.innerHTML = '<p>✅ Imagem carregada com sucesso</p>';
      formElements.previewArea.appendChild(img);
    } else {
      formElements.previewArea.innerHTML = `<p>📄 ${file.name} carregado com sucesso</p>`;
    }
    
    console.log("✅ Arquivo processado");
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    formElements.previewArea.innerHTML = `<p>❌ Erro ao carregar: ${file.name}</p>`;
  }
}

// 📋 Configurar área de paste
function setupPasteArea() {
  if (!formElements.pasteArea) return;
  
  console.log("📋 Configurando área de paste...");
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 Conteúdo colado");
    
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') !== -1) {
        console.log("🖼️ Imagem detectada no paste");
        
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = function (event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '8px';
          formElements.previewArea.innerHTML = '<p>✅ Imagem colada com sucesso</p>';
          formElements.previewArea.appendChild(img);
          formElements.previewArea.dataset.fileData = event.target.result;
          
          console.log("✅ Imagem salva no preview");
        };
        
        reader.readAsDataURL(blob);
        break;
        
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          formElements.previewArea.innerHTML = '<p>📝 Texto colado: ' + text.substring(0, 100) + '...</p>';
          console.log("📝 Texto colado:", text.length, "caracteres");
        });
      }
    }
  });
}

// 🔧 FUNÇÃO PRINCIPAL: Chamar API
async function callAI(prompt, tipo, extraData = {}) {
  try {
    console.log("🔄 Enviando para API:", { tipo, temImagem: extraData.temImagem });
    
    const requestData = {
      prompt,
      tipo,
      destino: extraData.destino,
      tipos: extraData.tipos,
      temImagem: extraData.temImagem,
      arquivo: extraData.arquivo
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro da API:", errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Resposta da API recebida");
    
    if (data.success && data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      console.error("❌ Formato de resposta inválido:", data);
      throw new Error("Resposta inválida da API");
    }
    
  } catch (error) {
    console.error("❌ Erro na chamada da API:", error);
    throw error;
  }
}

// 🔧 Funções auxiliares
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = content;
    console.log("📝 Elemento atualizado:", id);
  } else {
    console.warn("⚠️ Elemento não encontrado:", id);
  }
}

function showLoading(elementId = "orcamentoIA") {
  updateElement(elementId, "🤖 Processando com IA...");
}

function hideLoading(elementId = "orcamentoIA") {
  // Loading será substituído pelo conteúdo real
}

function showError(message) {
  updateElement("orcamentoIA", "❌ " + message);
}

// 📋 Copiar texto (função global)
function copiarTexto(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ Elemento não encontrado:", id);
    return;
  }
  
  const texto = elemento.innerText;
  
  navigator.clipboard.writeText(texto).then(() => {
    console.log("✅ Texto copiado:", id);
    
    // Feedback visual
    const button = event.target;
    const originalText = button.innerText;
    button.innerText = "✅ Copiado!";
    
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
  }).catch(err => {
    console.error("❌ Erro ao copiar:", err);
    alert("Erro ao copiar. Tente selecionar o texto manualmente.");
  });
}

console.log("🚀 Sistema CVC Itaqua carregado com sucesso!");
