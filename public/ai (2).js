const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxWtCaq_O07y_h_N6YR453i1xJBz9OTtW6gm2hYgBZG3hGuHTMVZ_XM2ibBBZGYyDN5/exec";

console.log("⚡ VERSÃO ULTRA SIMPLES - SEM ERROS");

// Variáveis globais para evitar problemas de escopo
let currentScript = null;
let currentCallback = null;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", enviarFormulario);
    console.log("✅ Formulário conectado");
  }
  
  configurarPaste();
  testarBasico();
});

// 🧪 TESTE BÁSICO
function testarBasico() {
  console.log("🧪 Teste básico...");
  
  const callback = 'test' + Date.now();
  
  window[callback] = function(data) {
    console.log("✅ Teste básico OK:", data);
    delete window[callback];
    if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.removeChild(currentScript);
    }
  };
  
  currentScript = document.createElement('script');
  currentScript.src = `${WEBAPP_URL}?prompt=teste&type=orcamento&callback=${callback}`;
  currentScript.onerror = () => console.error("❌ Teste básico falhou");
  document.head.appendChild(currentScript);
}

// 📝 ENVIAR FORMULÁRIO
async function enviarFormulario(e) {
  e.preventDefault();
  console.log("📝 Enviando formulário...");
  
  // Extrair dados
  const formData = new FormData(e.target);
  const destino = formData.get('destino') || 'Porto';
  const adultos = formData.get('adultos') || '2';
  const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value).join(", ") || "Aéreo";
  
  console.log("📊 Dados:", { destino, adultos, tipos });
  
  // Verificar imagem
  const previewArea = document.getElementById("previewArea");
  const imagemColada = previewArea?.dataset.fileData || '';
  const temImagem = !!imagemColada;
  
  console.log("🖼️ Tem imagem:", temImagem);
  
  // Criar prompt
  let prompt;
  if (temImagem) {
    // Prompt para imagem (bem resumido)
    prompt = `Analise imagem de passagens ${tipos} para ${destino}, ${adultos} adultos. Extraia preços exatos e datas. Imagem: ${imagemColada.substring(0, 500)}`;
  } else {
    // Prompt sem imagem
    prompt = `Orçamento ${tipos} para ${destino}, ${adultos} adultos, formato CVC com emojis`;
  }
  
  console.log("📝 Prompt (tamanho:", prompt.length, ")");
  
  // Mostrar loading
  document.getElementById("orcamentoIA").innerText = "🤖 Gerando orçamento...";
  
  // Enviar
  try {
    await enviarJSONP(prompt, 'orcamento');
  } catch (error) {
    document.getElementById("orcamentoIA").innerText = "❌ Erro: " + error.message;
  }
}

// 🔄 ENVIAR VIA JSONP - ULTRA SIMPLES
function enviarJSONP(prompt, type) {
  return new Promise((resolve, reject) => {
    console.log("🔄 Enviando JSONP...");
    
    // Limpar anterior se existir
    if (currentCallback && window[currentCallback]) {
      delete window[currentCallback];
    }
    if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.removeChild(currentScript);
    }
    
    // Novo callback
    currentCallback = 'cb' + Date.now();
    
    // Timeout
    const timeout = setTimeout(() => {
      console.error("❌ Timeout");
      limparTudo();
      reject(new Error("Timeout"));
    }, 20000);
    
    function limparTudo() {
      if (currentCallback && window[currentCallback]) {
        delete window[currentCallback];
      }
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.removeChild(currentScript);
      }
      clearTimeout(timeout);
    }
    
    // Callback
    window[currentCallback] = function(data) {
      console.log("✅ Resposta recebida:", data);
      limparTudo();
      
      if (data && data.choices && data.choices[0]) {
        const content = data.choices[0].message.content;
        document.getElementById("orcamentoIA").innerText = content;
        console.log("✅ Sucesso!");
        resolve(content);
      } else if (data && data.error) {
        document.getElementById("orcamentoIA").innerText = "❌ Erro: " + data.error;
        reject(new Error(data.error));
      } else {
        document.getElementById("orcamentoIA").innerText = "❌ Resposta inválida";
        reject(new Error("Resposta inválida"));
      }
    };
    
    // Criar URL (limitando tamanho)
    const promptLimitado = prompt.substring(0, 1000); // Bem pequeno
    const params = new URLSearchParams({
      prompt: promptLimitado,
      type: type,
      callback: currentCallback
    });
    
    const url = `${WEBAPP_URL}?${params.toString()}`;
    console.log("📤 URL (tamanho:", url.length, ")");
    
    // Criar script
    currentScript = document.createElement('script');
    currentScript.src = url;
    
    currentScript.onerror = function() {
      console.error("❌ Erro no script");
      limparTudo();
      document.getElementById("orcamentoIA").innerText = "❌ Erro na comunicação";
      reject(new Error("Erro no script"));
    };
    
    currentScript.onload = function() {
      console.log("✅ Script carregado");
    };
    
    // Adicionar ao DOM
    document.head.appendChild(currentScript);
  });
}

// 📋 CONFIGURAR PASTE SIMPLES
function configurarPaste() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  if (pasteArea && previewArea) {
    pasteArea.addEventListener('paste', function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          
          reader.onload = function (event) {
            const base64 = event.target.result;
            const img = document.createElement('img');
            img.src = base64;
            img.style.maxWidth = '100%';
            
            previewArea.innerHTML = '<p>✅ Imagem carregada</p>';
            previewArea.appendChild(img);
            previewArea.dataset.fileData = base64;
            
            console.log("✅ Imagem salva");
          };
          
          reader.readAsDataURL(blob);
          break;
        }
      }
    });
    console.log("✅ Paste configurado");
  }
}

// 📋 COPIAR
function copiarTexto(id) {
  navigator.clipboard.writeText(document.getElementById(id).innerText);
}

console.log("🔧 Sistema ultra simples carregado");
