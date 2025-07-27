const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzoVVO1ZJgoZ-jysI4p8fMkUMpGCSiwFO-9Zk3fwrwxfC4C4cywCrvxqlowi4pEJHD9/exec";

// 🔄 SOLUÇÃO: JSONP para contornar CORS
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Sistema CVC - Versão JSONP");
  console.log("🔗 URL:", WEBAPP_URL);
  console.log("🔄 Usando JSONP para contornar CORS");
  
  // Conectar formulário
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    console.log("✅ Formulário conectado");
  }
  
  // Conectar outras funcionalidades
  setupFileUpload();
  setupPasteArea();
  setupPDFAnalysis();
  
  // Teste automático
  testJSONP();
});

// 🧪 TESTE JSONP
async function testJSONP() {
  console.log("🧪 Testando JSONP...");
  
  try {
    const result = await callAIviaJSONP("Teste de conectividade JSONP", "orcamento");
    console.log("✅ JSONP funcionando:", result.substring(0, 50) + "...");
  } catch (error) {
    console.error("❌ JSONP falhou:", error);
  }
}

// 📝 HANDLER DO FORMULÁRIO
async function handleSubmit(e) {
  e.preventDefault();
  console.log("📝 Formulário enviado");
  
  try {
    const formData = extractFormData(e.target);
    console.log("📊 Dados:", formData);
    
    // Validações
    if (!formData.adultos || formData.adultos < 1) {
      throw new Error("Número de adultos é obrigatório");
    }
    
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de orçamento");
    }
    
    // Gerar orçamento principal
    await generateOrcamento(formData);
    
    // Gerar extras se aplicável
    if (formData.destino && formData.destino !== "(Destino não informado)") {
      await generateTextoDestino(formData.destino);
    }
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro:", error);
    updateElement("orcamentoIA", "❌ Erro: " + error.message);
  }
}

// 📊 EXTRAIR DADOS DO FORMULÁRIO
function extractFormData(form) {
  const formData = new FormData(form);
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  return {
    destino: formData.get('destino') || "(Destino não informado)",
    adultos: formData.get('adultos') || '2',
    criancas: formData.get('criancas') || '0',
    idades: formData.get('idades_criancas') || '',
    observacoes: formData.get('observacoes') || '',
    tipos: Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value),
    textoColado: pasteArea?.innerText || "",
    arquivoBase64: previewArea?.dataset.fileData || ""
  };
}

// 🤖 GERAR ORÇAMENTO PRINCIPAL
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

  updateElement("orcamentoIA", "🤖 Gerando orçamento...");
  
  try {
    const response = await callAIviaJSONP(prompt, 'orcamento');
    updateElement("orcamentoIA", response);
  } catch (error) {
    updateElement("orcamentoIA", "❌ Erro ao gerar orçamento: " + error.message);
  }
}

// 🌍 GERAR TEXTO DO DESTINO
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

  updateElement("destinoIA", "🤖 Gerando texto...");
  
  try {
    const response = await callAIviaJSONP(prompt, 'destino');
    updateElement("destinoIA", response);
  } catch (error) {
    updateElement("destinoIA", "❌ Erro: " + error.message);
  }
}

// 🏨 GERAR RANKING DE HOTÉIS
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking de hotéis:", destino);
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias com crianças.

Formato:
🏆 1. Nome do Hotel - Estrelas
📍 Localização  
💰 Faixa de preço
⭐ Destaques

Seja realista e informativo.`;

  updateElement("rankingIA", "🤖 Gerando ranking...");
  
  try {
    const response = await callAIviaJSONP(prompt, 'ranking');
    updateElement("rankingIA", response);
  } catch (error) {
    updateElement("rankingIA", "❌ Erro: " + error.message);
  }
}

// 🔄 CHAMADA VIA JSONP (SOLUÇÃO PARA CORS)
function callAIviaJSONP(prompt, type) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Chamando IA via JSONP (${type})...`);
    
    // Nome único para callback
    const callbackName = 'cvcCallback' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    // Criar elemento script
    const script = document.createElement('script');
    
    // Timeout de 30 segundos
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout na requisição JSONP"));
    }, 30000);
    
    // Função de limpeza
    function cleanup() {
      if (window[callbackName]) {
        delete window[callbackName];
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      clearTimeout(timeout);
    }
    
    // Configurar callback global
    window[callbackName] = function(data) {
      console.log("📥 Resposta JSONP recebida:", data);
      cleanup();
      
      if (data.error) {
        reject(new Error(data.error));
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log("✅ Conteúdo extraído:", content.substring(0, 100) + "...");
        resolve(content);
      } else {
        reject(new Error("Resposta JSONP inválida"));
      }
    };
    
    // Montar URL com parâmetros
    const params = new URLSearchParams({
      prompt: prompt,
      type: type,
      callback: callbackName
    });
    
    const fullURL = `${WEBAPP_URL}?${params.toString()}`;
    console.log("📤 URL JSONP:", fullURL.substring(0, 100) + "...");
    
    // Configurar script
    script.src = fullURL;
    script.onerror = function() {
      cleanup();
      reject(new Error("Erro ao carregar script JSONP"));
    };
    
    // Adicionar ao DOM
    document.head.appendChild(script);
  });
}

// 📁 CONFIGURAR UPLOAD DE ARQUIVO
function setupFileUpload() {
  const arquivo = document.getElementById("arquivo");
  if (arquivo) {
    arquivo.addEventListener("change", handleFileUpload);
  }
}

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Upload:", file.name);
  
  try {
    const base64 = await fileToBase64(file);
    const previewArea = document.getElementById("previewArea");
    
    if (previewArea) {
      previewArea.dataset.fileData = base64;
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = base64;
        img.style.maxWidth = '100%';
        previewArea.innerHTML = '';
        previewArea.appendChild(img);
      } else {
        previewArea.innerHTML = `<p>📄 ${file.name} carregado</p>`;
      }
    }
  } catch (error) {
    console.error("❌ Erro no upload:", error);
  }
}

// 📋 CONFIGURAR ÁREA DE PASTE
function setupPasteArea() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  if (!pasteArea || !previewArea) return;
  
  pasteArea.addEventListener('paste', function (e) {
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
          previewArea.innerHTML = '';
          previewArea.appendChild(img);
          previewArea.dataset.fileData = event.target.result;
        };
        reader.readAsDataURL(blob);
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          previewArea.innerHTML = '<p>' + text + '</p>';
        });
      }
    }
  });
}

// 📄 CONFIGURAR ANÁLISE DE PDF
function setupPDFAnalysis() {
  const pdfUpload = document.getElementById("pdfUpload");
  if (pdfUpload) {
    window.analisarPDF = async function() {
      const file = pdfUpload.files[0];
      if (!file) {
        alert("Selecione um arquivo PDF primeiro!");
        return;
      }

      updateElement("analiseIA", "🤖 Analisando PDF...");
      console.log("📄 Analisando:", file.name);
      
      try {
        const base64 = await fileToBase64(file);
        const prompt = `Analise este relatório da CVC e extraia:
        
1. Principais métricas de vendas
2. Metas vs realizado  
3. Produtos mais vendidos
4. Recomendações de ação

Formato executivo, objetivo e prático.`;

        const response = await callAIviaJSONP(prompt, 'analise');
        updateElement("analiseIA", response);
        
        // Mostrar container se estiver oculto
        const container = document.getElementById('analiseContainer');
        if (container) {
          container.style.display = 'block';
        }
        
      } catch (error) {
        updateElement("analiseIA", "❌ Erro ao analisar: " + error.message);
      }
    };
  }
}

// 🔧 FUNÇÕES AUXILIARES
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

// 📋 COPIAR TEXTO
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto).then(() => {
    console.log("📋 Copiado:", id);
    
    // Feedback visual
    const button = event.target;
    if (button) {
      const originalText = button.innerText;
      button.innerText = "✅ Copiado!";
      setTimeout(() => {
        button.innerText = originalText;
      }, 2000);
    }
  }).catch(err => {
    console.error("❌ Erro ao copiar:", err);
  });
}

// 🧪 TESTE MANUAL
window.testeManual = async function() {
  console.log("🧪 Teste manual JSONP...");
  try {
    const result = await callAIviaJSONP("Teste manual JSONP", "orcamento");
    console.log("✅ Teste bem-sucedido:", result.substring(0, 100));
    alert("✅ JSONP funcionando! Sistema operacional.");
  } catch (error) {
    console.error("❌ Teste falhou:", error);
    alert("❌ Teste falhou: " + error.message);
  }
};

console.log("🔧 Sistema pronto! Digite 'testeManual()' para testar.");
