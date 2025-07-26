const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzFdSfHXeabhWaH2d3K3dDjL0BRSk_85JGAB6j86JkJa3IRmO2dWL0flXUKbMeaVQ/exec";

// 🧪 TESTE DE CONECTIVIDADE AUTOMÁTICO
document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Sistema CVC iniciado");
  console.log("🔗 URL configurada:", WEBAPP_URL);
  
  // Teste automático de conectividade
  await testConnectivity();
  
  // Cache elementos DOM
  window.formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload")
  };

  // Event Listeners
  if (window.formElements.form) {
    window.formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário conectado");
  }
  
  if (window.formElements.arquivo) {
    window.formElements.arquivo.addEventListener("change", handleFileUpload);
  }

  if (window.formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
    console.log("✅ Análise PDF configurada");
  }

  setupPasteArea();
});

// 🧪 TESTE DE CONECTIVIDADE
async function testConnectivity() {
  console.log("🧪 Testando conectividade com o backend...");
  
  try {
    // Teste 1: Verificar se URL responde
    console.log("📡 Teste 1: Verificando URL...");
    const response = await fetch(WEBAPP_URL, {
      method: 'GET',
      mode: 'cors'
    });
    console.log("✅ URL responde:", response.status, response.statusText);
    
    // Teste 2: POST simples
    console.log("📡 Teste 2: POST simples...");
    const testResponse = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "teste de conectividade",
        type: "orcamento"
      })
    });
    
    console.log("✅ POST responde:", testResponse.status, testResponse.statusText);
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log("✅ Conectividade OK! Dados:", data);
    } else {
      const errorText = await testResponse.text();
      console.log("⚠️ Resposta com erro:", errorText);
    }
    
  } catch (error) {
    console.error("❌ Erro de conectividade:", error);
    console.error("❌ Tipo do erro:", error.name);
    console.error("❌ Mensagem:", error.message);
    
    // Exibir aviso na tela
    showConnectivityError(error);
  }
}

// 🚨 MOSTRAR ERRO DE CONECTIVIDADE
function showConnectivityError(error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 9999;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  
  errorDiv.innerHTML = `
    <h4>🚨 Erro de Conectividade</h4>
    <p><strong>Erro:</strong> ${error.message}</p>
    <p><strong>Possíveis causas:</strong></p>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>Google Apps Script não publicado corretamente</li>
      <li>Permissões não configuradas</li>
      <li>CORS bloqueado pelo navegador</li>
      <li>URL incorreta</li>
    </ul>
    <button onclick="this.parentElement.remove()" style="background: white; color: #ff4444; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Fechar</button>
  `;
  
  document.body.appendChild(errorDiv);
  
  // Auto-remover após 10 segundos
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 10000);
}

// 🎯 FUNÇÃO PRINCIPAL: Gerar Orçamento
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("🤖 Gerando orçamento...");
  
  showLoading();
  
  try {
    const formData = extractFormData(e.target);
    console.log("📊 Dados extraídos:", formData);
    
    // Validar dados básicos
    if (!formData.adultos || formData.adultos < 1) {
      throw new Error("Número de adultos é obrigatório");
    }
    
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de orçamento");
    }
    
    // Gerar orçamento principal
    await generateOrcamento(formData);
    
    // Gerar texto do destino (se destino informado)
    if (formData.destino && formData.destino !== "(Destino não informado)") {
      console.log("🌍 Gerando texto do destino...");
      await generateTextoDestino(formData.destino);
    }
    
    // Gerar ranking de hotéis (se for tipo Hotel)
    if (formData.tipos.includes("Hotel")) {
      console.log("🏨 Gerando ranking de hotéis...");
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro:", error);
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
    textoColado: window.formElements.pasteArea?.innerText || "",
    arquivoBase64: window.formElements.previewArea?.dataset.fileData || ""
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

  const response = await callAI(prompt, 'orcamento');
  updateElement("orcamentoIA", response);
}

// 🌍 Gerar texto do destino
async function generateTextoDestino(destino) {
  console.log("🌍 Gerando texto sobre:", destino);
  
  const prompt = `Crie um texto promocional sobre ${destino} para WhatsApp da CVC. 
  
Inclua:
- Principais atrações
- Melhor época para visitar  
- Dicas importantes
- Tom vendedor mas informativo
- Máximo 200 palavras
- Use emojis`;

  const response = await callAI(prompt, 'destino');
  updateElement("destinoIA", response);
}

// 🏨 Gerar ranking de hotéis
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking para:", destino);
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias com crianças.

Formato:
🏆 1. Nome do Hotel - Estrelas
📍 Localização  
💰 Faixa de preço
⭐ Destaques

Seja realista e informativo.`;

  const response = await callAI(prompt, 'ranking');
  updateElement("rankingIA", response);
}

// 📄 Análise de PDF
async function handlePDFAnalysis() {
  const file = window.formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo PDF primeiro!");
    return;
  }

  showLoading("analiseIA");
  console.log("📄 Analisando arquivo:", file.name);
  
  try {
    const base64 = await fileToBase64(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. Principais métricas de vendas
2. Metas vs realizado  
3. Produtos mais vendidos
4. Recomendações de ação

Formato executivo, objetivo e prático.`;

    const response = await callAI(prompt, 'analise');
    updateElement("analiseIA", response);
    console.log("✅ PDF analisado com sucesso");
    
  } catch (error) {
    console.error("❌ Erro na análise:", error);
    updateElement("analiseIA", "❌ Erro ao analisar PDF: " + error.message);
  } finally {
    hideLoading("analiseIA");
  }
}

// 📁 Upload de arquivo
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Upload:", file.name);
  
  try {
    const base64 = await fileToBase64(file);
    window.formElements.previewArea.dataset.fileData = base64;
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      window.formElements.previewArea.innerHTML = '';
      window.formElements.previewArea.appendChild(img);
    } else {
      window.formElements.previewArea.innerHTML = `<p>📄 ${file.name} carregado</p>`;
    }
  } catch (error) {
    console.error("❌ Erro no upload:", error);
  }
}

// 📋 Configurar área de paste
function setupPasteArea() {
  if (!window.formElements.pasteArea) return;
  
  window.formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 Conteúdo colado");
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          window.formElements.previewArea.innerHTML = '';
          window.formElements.previewArea.appendChild(img);
          window.formElements.previewArea.dataset.fileData = event.target.result;
        };
        reader.readAsDataURL(blob);
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          window.formElements.previewArea.innerHTML = '<p>' + text + '</p>';
        });
      }
    }
  });
}

// 🔧 FUNÇÃO PRINCIPAL DE CHAMADA À IA - SUPER ROBUSTA
async function callAI(prompt, type = 'orcamento') {
  console.log(`🤖 Chamando IA (${type})...`);
  console.log("🔗 URL:", WEBAPP_URL);
  console.log("📝 Prompt (100 chars):", prompt.substring(0, 100) + "...");
  
  const requestData = { 
    prompt: prompt,
    type: type 
  };
  
  console.log("📤 Dados da requisição:", requestData);
  
  // Array de tentativas com diferentes configurações
  const attempts = [
    // Tentativa 1: Configuração padrão
    {
      name: "Padrão",
      config: {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      }
    },
    // Tentativa 2: Com mode CORS explícito
    {
      name: "CORS explícito",
      config: {
        method: "POST",
        mode: "cors",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      }
    },
    // Tentativa 3: Com cache disabled
    {
      name: "No-cache",
      config: {
        method: "POST",
        cache: "no-cache",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      }
    }
  ];
  
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    console.log(`🔄 Tentativa ${i + 1}: ${attempt.name}`);
    
    try {
      const response = await fetch(WEBAPP_URL, attempt.config);
      console.log(`📥 Resposta ${i + 1}:`, response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Erro HTTP ${i + 1}:`, errorText);
        continue; // Tenta próximo método
      }
      
      const json = await response.json();
      console.log(`✅ JSON ${i + 1}:`, json);
      
      if (json.error) {
        throw new Error(`Erro da API: ${json.error}`);
      }
      
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Resposta vazia da IA");
      }
      
      console.log(`✅ Sucesso na tentativa ${i + 1}:`, content.substring(0, 100) + "...");
      return content;
      
    } catch (error) {
      console.error(`❌ Erro na tentativa ${i + 1}:`, error);
      
      if (i === attempts.length - 1) {
        // Última tentativa, propagar erro
        throw new Error(`Todas as tentativas falharam. Último erro: ${error.message}`);
      }
    }
  }
}

// 🔧 Funções auxiliares
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
    console.log(`✅ ${id} atualizado`);
  } else {
    console.warn(`⚠️ Elemento ${id} não encontrado`);
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
  console.error("❌ Erro:", message);
}

// 📋 Copiar texto (global)
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto).then(() => {
    console.log("📋 Copiado:", id);
    
    // Feedback visual
    const button = event.target;
    const originalText = button.innerText;
    button.innerText = "✅ Copiado!";
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
  }).catch(err => {
    console.error("❌ Erro ao copiar:", err);
  });
}

// 🧪 FUNÇÃO DE TESTE MANUAL
window.testManual = async function() {
  console.log("🧪 Teste manual iniciado...");
  try {
    const result = await callAI("Teste manual de conectividade", "orcamento");
    console.log("✅ Teste manual bem-sucedido:", result);
    alert("✅ Teste bem-sucedido! Verifique o console para detalhes.");
  } catch (error) {
    console.error("❌ Teste manual falhou:", error);
    alert("❌ Teste falhou: " + error.message);
  }
};

console.log("🔧 Para teste manual, execute: testManual() no console");
