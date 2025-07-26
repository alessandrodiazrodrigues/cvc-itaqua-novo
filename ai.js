const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwDvhY_BrbsUkeo96OxFKs0TItAxA9tNh2ikNUXIgxGe_XPgEC5euTWec2xLL82zN4Dcg/exec";

// Elementos DOM
let formElements = {};

document.addEventListener("DOMContentLoaded", function () {
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
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
  }

  // Para index.html - análise de PDF
  if (formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
  }

  setupPasteArea();
});

// 🎯 FUNÇÃO PRINCIPAL: Gerar Orçamento
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  
  showLoading();
  
  try {
    const formData = extractFormData(e.target);
    
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
    
  } catch (error) {
    showError("Erro ao processar solicitação: " + error.message);
  } finally {
    hideLoading();
  }
}

// 📊 Extrair dados do formulário
function extractFormData(form) {
  return {
    destino: form.destino.value || "(Destino não informado)",
    adultos: form.adultos.value,
    criancas: form.criancas.value,
    idades: form.idades_criancas.value,
    observacoes: form.observacoes.value,
    tipos: Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value),
    textoColado: formElements.pasteArea.innerText,
    arquivoBase64: formElements.previewArea.dataset.fileData || ""
  };
}

// 🤖 Gerar orçamento principal
async function generateOrcamento(data) {
  const prompt = `Você é uma atendente da CVC. Formate um orçamento para WhatsApp baseado nos dados abaixo, seguindo o padrão da loja CVC Itaqua:

Destino: ${data.destino}
Adultos: ${data.adultos}
Crianças: ${data.criancas} (idades: ${data.idades})
Serviços solicitados: ${data.tipos.join(", ")}
Observações: ${data.observacoes}

Texto adicional enviado:
${data.textoColado}

${data.arquivoBase64 ? 'Arquivo anexado: Sim' : ''}

Responda apenas se identificar dados válidos.

Formato esperado (exemplo para Aéreo):

*Passagem Aérea*
AZUL
29/07 - Vitória 05:50 / Campinas 07:30

R$ 709,58 por pessoa, taxas inclusas
Pagamento em até 10x de R$ 70,95 s/ juros
https://www.cvc.com.br/carrinho-dinamico/...

Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra. Pode usar o link que enviamos mesmo, é bem simples e seguro, ou pode chamar a gente que te ajudamos com a compra.`;

  const response = await callAI(prompt);
  updateElement("orcamentoIA", response);
}

// 🌍 Gerar texto do destino
async function generateTextoDestino(destino) {
  const prompt = `Crie um texto promocional sobre ${destino} para WhatsApp da CVC. 
  
Inclua:
- Principais atrações
- Melhor época para visitar  
- Dicas importantes
- Tom vendedor mas informativo
- Máximo 200 palavras
- Use emojis`;

  const response = await callAI(prompt);
  updateElement("destinoIA", response);
}

// 🏨 Gerar ranking de hotéis
async function generateRankingHoteis(destino) {
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias com crianças.

Formato:
🏆 1. Nome do Hotel - Estrelas
📍 Localização  
💰 Faixa de preço
⭐ Destaques

Seja realista e informativo.`;

  const response = await callAI(prompt);
  updateElement("rankingIA", response);
}

// 📄 Análise de PDF (para index.html)
async function handlePDFAnalysis() {
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo PDF primeiro!");
    return;
  }

  showLoading("analiseIA");
  
  try {
    const base64 = await fileToBase64(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. Principais métricas de vendas
2. Metas vs realizado  
3. Produtos mais vendidos
4. Recomendações de ação

Formato executivo, objetivo e prático.`;

    const response = await callAI(prompt);
    updateElement("analiseIA", response);
    
  } catch (error) {
    updateElement("analiseIA", "❌ Erro ao analisar PDF: " + error.message);
  } finally {
    hideLoading("analiseIA");
  }
}

// 📁 Upload de arquivo
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const base64 = await fileToBase64(file);
    formElements.previewArea.dataset.fileData = base64;
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      formElements.previewArea.innerHTML = '';
      formElements.previewArea.appendChild(img);
    } else {
      formElements.previewArea.innerHTML = `<p>📄 ${file.name} carregado</p>`;
    }
  } catch (error) {
    console.error("Erro no upload:", error);
  }
}

// 📋 Configurar área de paste
function setupPasteArea() {
  if (!formElements.pasteArea) return;
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          formElements.previewArea.innerHTML = '';
          formElements.previewArea.appendChild(img);
          formElements.previewArea.dataset.fileData = event.target.result;
        };
        reader.readAsDataURL(blob);
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          formElements.previewArea.innerHTML = '<p>' + text + '</p>';
        });
      }
    }
  });
}

// 🔧 Funções auxiliares
async function callAI(prompt) {
  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error("Erro na requisição");
  
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "❌ Resposta da IA vazia.";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = content;
  }
}

function showLoading(elementId = "orcamentoIA") {
  updateElement(elementId, "🤖 Processando com IA...");
}

function hideLoading(elementId = "orcamentoIA") {
  // Loading será substituído pelo conteúdo real
}

function showError(message) {
  updateElement("orcamentoIA", message);
}

// 📋 Copiar texto (global)
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto).then(() => {
    // Feedback visual opcional
    const button = event.target;
    const originalText = button.innerText;
    button.innerText = "✅ Copiado!";
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
  });
}
