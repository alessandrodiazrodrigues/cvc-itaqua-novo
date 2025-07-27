const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwCnLpZYbKcfbql7GysU7_K9fiV3pzWNA-OWv-uoJtuO-f4szNj5OtFwkiaLou4cknS/exec";

console.log("🔍 DEBUG: Erro no script - Versão diagnóstico");

document.addEventListener("DOMContentLoaded", function () {
  // Conectar formulário
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    console.log("✅ Formulário conectado");
  }
  
  // Configurar paste/upload
  configurarPasteEUpload();
  
  // Teste com debug extensivo
  testarComDebug();
});

// 🧪 TESTE COM DEBUG DETALHADO
async function testarComDebug() {
  console.log("🧪 Iniciando teste com debug...");
  
  // Teste 1: URL direta
  console.log("📡 Teste 1: Verificando URL direta...");
  try {
    const response = await fetch(WEBAPP_URL);
    console.log("✅ URL responde:", response.status, response.statusText);
    
    if (response.ok) {
      const text = await response.text();
      console.log("📄 Resposta:", text.substring(0, 200) + "...");
    }
  } catch (error) {
    console.error("❌ URL não responde:", error);
  }
  
  // Teste 2: JSONP simples
  console.log("📡 Teste 2: JSONP simples...");
  try {
    await testarJSONPSimples();
  } catch (error) {
    console.error("❌ JSONP falhou:", error);
  }
  
  // Teste 3: GET com parâmetros
  console.log("📡 Teste 3: GET com parâmetros...");
  try {
    const testURL = WEBAPP_URL + "?test=true";
    const response = await fetch(testURL);
    console.log("✅ GET com parâmetros:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("📄 Dados:", data);
    }
  } catch (error) {
    console.error("❌ GET com parâmetros falhou:", error);
  }
}

// 🔄 TESTE JSONP SUPER SIMPLES
function testarJSONPSimples() {
  return new Promise((resolve, reject) => {
    console.log("🔄 Iniciando JSONP super simples...");
    
    const callback = 'testCallback' + Date.now();
    console.log("📝 Nome do callback:", callback);
    
    // Timeout mais longo
    const timeout = setTimeout(() => {
      console.error("❌ TIMEOUT: JSONP demorou mais de 15 segundos");
      limpar();
      reject(new Error("Timeout no JSONP"));
    }, 15000);
    
    function limpar() {
      if (window[callback]) {
        console.log("🧹 Limpando callback:", callback);
        delete window[callback];
      }
      if (script.parentNode) {
        console.log("🧹 Removendo script");
        script.parentNode.removeChild(script);
      }
      clearTimeout(timeout);
    }
    
    // Callback global com debug
    window[callback] = function(data) {
      console.log("📥 Callback executado!");
      console.log("📊 Dados recebidos:", data);
      limpar();
      
      if (data && data.choices) {
        console.log("✅ JSONP funcionou!");
        resolve(data);
      } else if (data && data.error) {
        console.error("❌ Erro do backend:", data.error);
        reject(new Error(data.error));
      } else {
        console.error("❌ Resposta inválida:", data);
        reject(new Error("Resposta JSONP inválida"));
      }
    };
    
    // Criar script com URL mínima
    const script = document.createElement('script');
    const testURL = `${WEBAPP_URL}?prompt=teste&type=orcamento&callback=${callback}`;
    
    console.log("📤 URL JSONP:", testURL);
    
    script.onerror = function(event) {
      console.error("❌ ERRO NO SCRIPT:", event);
      console.error("❌ Script src:", script.src);
      limpar();
      reject(new Error("Erro ao carregar script JSONP"));
    };
    
    script.onload = function() {
      console.log("✅ Script carregado com sucesso");
    };
    
    script.src = testURL;
    
    console.log("📎 Adicionando script ao DOM...");
    document.head.appendChild(script);
  });
}

// 📝 HANDLER DO FORMULÁRIO COM DEBUG
async function handleSubmit(e) {
  e.preventDefault();
  console.log("📝 === ENVIANDO FORMULÁRIO ===");
  
  try {
    // Extrair dados básicos
    const formData = new FormData(e.target);
    const destino = formData.get('destino') || 'Porto';
    const adultos = formData.get('adultos') || '2';
    const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
      .map(el => el.value).join(", ") || "Aéreo";
    
    console.log("📊 Dados básicos:", { destino, adultos, tipos });
    
    // Verificar imagem/texto
    const previewArea = document.getElementById("previewArea");
    const imagemColada = previewArea?.dataset.fileData || '';
    
    console.log("🖼️ Imagem presente:", !!imagemColada);
    
    // Prompt super simples para teste
    const prompt = `Teste para ${destino}, ${adultos} adultos, ${tipos}`;
    console.log("📝 Prompt de teste:", prompt);
    
    // Mostrar loading
    document.getElementById("orcamentoIA").innerText = "🔍 Debugando requisição...";
    
    // Chamar com debug extensivo
    const resposta = await chamarComDebugCompleto(prompt, "orcamento");
    document.getElementById("orcamentoIA").innerText = resposta;
    console.log("✅ === SUCESSO TOTAL ===");
    
  } catch (error) {
    console.error("❌ === ERRO NO FORMULÁRIO ===");
    console.error("❌ Tipo:", error.name);
    console.error("❌ Mensagem:", error.message);
    console.error("❌ Stack:", error.stack);
    
    document.getElementById("orcamentoIA").innerText = "❌ Erro detalhado: " + error.message;
  }
}

// 🔄 CHAMADA COM DEBUG COMPLETO
function chamarComDebugCompleto(prompt, tipo) {
  return new Promise((resolve, reject) => {
    console.log("🔄 === INICIANDO CHAMADA DEBUG ===");
    console.log("📝 Prompt:", prompt.substring(0, 100) + "...");
    console.log("🏷️ Tipo:", tipo);
    
    const callback = 'debugCallback' + Date.now() + Math.random().toString(36).substr(2, 5);
    console.log("📝 Callback único:", callback);
    
    const timeout = setTimeout(() => {
      console.error("❌ === TIMEOUT ===");
      limpar();
      reject(new Error("Timeout após 20 segundos"));
    }, 20000);
    
    function limpar() {
      console.log("🧹 Executando limpeza...");
      if (window[callback]) {
        delete window[callback];
        console.log("✅ Callback removido");
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        console.log("✅ Script removido");
      }
      clearTimeout(timeout);
      console.log("✅ Timeout cancelado");
    }
    
    // Callback com máximo debug
    window[callback] = function(data) {
      console.log("📥 === CALLBACK EXECUTADO ===");
      console.log("📊 Tipo de data:", typeof data);
      console.log("📊 Data completa:", data);
      
      limpar();
      
      if (data && data.error) {
        console.error("❌ Erro do backend:", data.error);
        reject(new Error("Backend: " + data.error));
      } else if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log("✅ Conteúdo extraído:", content.substring(0, 100) + "...");
        resolve(content);
      } else {
        console.error("❌ Estrutura inválida:", data);
        reject(new Error("Resposta com estrutura inválida"));
      }
    };
    
    // Montar URL com encoding
    const params = new URLSearchParams({
      prompt: prompt,
      type: tipo,
      callback: callback
    });
    
    const fullURL = `${WEBAPP_URL}?${params.toString()}`;
    console.log("📤 URL completa:", fullURL.substring(0, 150) + "...");
    
    // Criar script com handlers completos
    const script = document.createElement('script');
    
    script.onerror = function(event) {
      console.error("❌ === ERRO NO SCRIPT ===");
      console.error("❌ Event:", event);
      console.error("❌ Script src:", script.src);
      console.error("❌ Readystate:", script.readyState);
      limpar();
      reject(new Error("Falha ao carregar script JSONP"));
    };
    
    script.onload = function() {
      console.log("✅ Script carregado (aguardando callback...)");
    };
    
    script.src = fullURL;
    
    console.log("📎 Adicionando script ao DOM...");
    document.head.appendChild(script);
    console.log("✅ Script adicionado, aguardando resposta...");
  });
}

// 📋 CONFIGURAR PASTE E UPLOAD (simplificado)
function configurarPasteEUpload() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  if (pasteArea && previewArea) {
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
            img.style.maxWidth = '100%';
            previewArea.innerHTML = '<p>🖼️ Imagem carregada:</p>';
            previewArea.appendChild(img);
            previewArea.dataset.fileData = event.target.result;
            console.log("✅ Imagem salva");
          };
          reader.readAsDataURL(blob);
        }
      }
    });
  }
}

// 📋 COPIAR TEXTO
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto);
  console.log("📋 Copiado:", id);
}

console.log("🔧 Sistema de debug carregado. Aguardando testes...");
