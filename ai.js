const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxWtCaq_O07y_h_N6YR453i1xJBz9OTtW6gm2hYgBZG3hGuHTMVZ_XM2ibBBZGYyDN5/exec";

console.log("🔧 DEBUG DEFINITIVO JSONP");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmitDebug);
    console.log("✅ Formulário conectado");
  }
  
  configurarPasteImagem();
  testarURLCompleto();
});

// 🧪 TESTE COMPLETO DA URL
async function testarURLCompleto() {
  console.log("🧪 === TESTANDO URL COMPLETO ===");
  
  // Teste 1: URL básica
  console.log("📡 Teste 1: URL básica");
  try {
    const response = await fetch(WEBAPP_URL);
    console.log("✅ URL responde:", response.status, response.statusText);
    
    if (response.ok) {
      const text = await response.text();
      console.log("📄 Resposta:", text.substring(0, 100) + "...");
    }
  } catch (error) {
    console.error("❌ URL básica falhou:", error);
    return;
  }
  
  // Teste 2: URL com parâmetro simples
  console.log("📡 Teste 2: URL com parâmetro");
  try {
    const testURL = WEBAPP_URL + "?test=true";
    const response = await fetch(testURL);
    console.log("✅ URL com parâmetro:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("📄 JSON:", data);
    }
  } catch (error) {
    console.error("❌ URL com parâmetro falhou:", error);
    return;
  }
  
  // Teste 3: JSONP super simples
  console.log("📡 Teste 3: JSONP super simples");
  testarJSONPBasico();
}

// 🔄 TESTE JSONP BÁSICO
function testarJSONPBasico() {
  console.log("🔄 Iniciando JSONP básico...");
  
  const callback = 'testBasico' + Date.now();
  console.log("📝 Callback:", callback);
  
  // Timeout
  const timeout = setTimeout(() => {
    console.error("❌ TIMEOUT: JSONP básico demorou mais de 10 segundos");
    limpar();
  }, 10000);
  
  function limpar() {
    if (window[callback]) {
      delete window[callback];
      console.log("🧹 Callback removido");
    }
    if (script.parentNode) {
      script.parentNode.removeChild(script);
      console.log("🧹 Script removido");
    }
    clearTimeout(timeout);
  }
  
  // Callback
  window[callback] = function(data) {
    console.log("✅ JSONP BÁSICO FUNCIONOU!");
    console.log("📊 Dados:", data);
    limpar();
  };
  
  // URL super simples
  const testURL = `${WEBAPP_URL}?prompt=teste&type=orcamento&callback=${callback}`;
  console.log("📤 URL JSONP básica:", testURL);
  
  const script = document.createElement('script');
  
  script.onerror = function(event) {
    console.error("❌ ERRO NO SCRIPT BÁSICO:");
    console.error("- Event:", event);
    console.error("- Type:", event.type);
    console.error("- Target:", event.target);
    console.error("- URL:", script.src);
    limpar();
  };
  
  script.onload = function() {
    console.log("✅ Script básico carregou (aguardando callback...)");
  };
  
  script.src = testURL;
  document.head.appendChild(script);
}

// 📝 ENVIO DO FORMULÁRIO COM DEBUG INTENSIVO
async function handleSubmitDebug(e) {
  e.preventDefault();
  console.log("📝 === ENVIANDO FORMULÁRIO DEBUG ===");
  
  try {
    // Extrair dados básicos
    const formData = new FormData(e.target);
    const destino = formData.get('destino') || 'Porto';
    const adultos = formData.get('adultos') || '2';
    const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
      .map(el => el.value).join(", ") || "Aéreo";
    
    console.log("📊 Dados extraídos:", { destino, adultos, tipos });
    
    // Verificar imagem
    const previewArea = document.getElementById("previewArea");
    const imagemColada = previewArea?.dataset.fileData || '';
    const temImagem = !!imagemColada;
    
    console.log("🖼️ Tem imagem:", temImagem);
    if (temImagem) {
      console.log("🖼️ Tamanho da imagem:", imagemColada.length, "caracteres");
    }
    
    // Criar prompt CURTO (evitar URL muito longa)
    let prompt;
    if (temImagem) {
      // Prompt super compacto para imagem
      prompt = `Analise esta imagem de passagens e extraia todas as opções com preços exatos.
Destino: ${destino}, ${adultos} adultos, ${tipos}.
Formato: ✈️ TAP Porto - OPÇÃO 1: R$ [preço exato] para ${adultos} adultos.
Imagem: ${imagemColada.substring(0, 1000)}...`; // Limitar tamanho
    } else {
      // Prompt sem imagem
      prompt = `Orçamento ${tipos} para ${destino}, ${adultos} adultos. Use formato CVC com emojis.`;
    }
    
    console.log("📝 Prompt criado:");
    console.log("- Tamanho:", prompt.length, "caracteres");
    console.log("- Primeiros 100:", prompt.substring(0, 100) + "...");
    
    // Mostrar loading
    document.getElementById("orcamentoIA").innerText = "🔧 Debugando envio...";
    
    // Tentar envio com debug
    await enviarComDebugCompleto(prompt, 'orcamento');
    
  } catch (error) {
    console.error("❌ Erro no formulário:", error);
    document.getElementById("orcamentoIA").innerText = "❌ Erro: " + error.message;
  }
}

// 🔄 ENVIO COM DEBUG COMPLETO
function enviarComDebugCompleto(prompt, tipo) {
  return new Promise((resolve, reject) => {
    console.log("🔄 === ENVIANDO COM DEBUG COMPLETO ===");
    
    const callback = 'debug' + Date.now() + Math.random().toString(36).substr(2, 3);
    console.log("📝 Callback único:", callback);
    
    // Timeout maior
    const timeout = setTimeout(() => {
      console.error("❌ === TIMEOUT COMPLETO ===");
      limpar();
      reject(new Error("Timeout após 15 segundos"));
    }, 15000);
    
    function limpar() {
      if (window[callback]) {
        delete window[callback];
        console.log("🧹 Callback limpo");
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        console.log("🧹 Script removido");
      }
      clearTimeout(timeout);
    }
    
    // Callback com debug
    window[callback] = function(data) {
      console.log("✅ === CALLBACK EXECUTADO ===");
      console.log("📊 Dados recebidos:", data);
      
      limpar();
      
      if (data && data.choices && data.choices[0]) {
        const content = data.choices[0].message.content;
        document.getElementById("orcamentoIA").innerText = content;
        console.log("✅ Sucesso! Modelo:", data.model);
        resolve(content);
      } else if (data && data.error) {
        document.getElementById("orcamentoIA").innerText = "❌ Erro da IA: " + data.error;
        reject(new Error(data.error));
      } else {
        document.getElementById("orcamentoIA").innerText = "❌ Resposta inválida";
        reject(new Error("Resposta inválida"));
      }
    };
    
    // Verificar tamanho da URL
    const params = new URLSearchParams({
      prompt: prompt.substring(0, 2000), // Limitar para evitar URL muito longa
      type: tipo,
      callback: callback
    });
    
    const fullURL = `${WEBAPP_URL}?${params.toString()}`;
    
    console.log("📊 Estatísticas da URL:");
    console.log("- Tamanho total:", fullURL.length, "caracteres");
    console.log("- Tamanho do prompt:", prompt.length, "caracteres");
    console.log("- URL (primeiros 150):", fullURL.substring(0, 150) + "...");
    
    // Verificar se URL é muito longa
    if (fullURL.length > 8000) {
      console.warn("⚠️ URL muito longa! Pode falhar.");
      
      // Tentar versão simplificada
      const promptSimples = `${tipo} para ${prompt.split(',')[0]}, resposta curta.`;
      const paramsSimples = new URLSearchParams({
        prompt: promptSimples,
        type: tipo,
        callback: callback
      });
      
      const urlSimples = `${WEBAPP_URL}?${paramsSimples.toString()}`;
      console.log("🔄 Tentando URL simplificada:", urlSimples.length, "chars");
      
      script.src = urlSimples;
    } else {
      script.src = fullURL;
    }
    
    // Criar script com handlers detalhados
    const script = document.createElement('script');
    
    script.onerror = function(event) {
      console.error("❌ === ERRO DETALHADO NO SCRIPT ===");
      console.error("- Event type:", event.type);
      console.error("- Event target:", event.target);
      console.error("- Script readyState:", script.readyState);
      console.error("- Script src:", script.src);
      console.error("- Error message:", event.message || 'Não disponível');
      console.error("- Error filename:", event.filename || 'Não disponível');
      console.error("- Error lineno:", event.lineno || 'Não disponível');
      
      limpar();
      document.getElementById("orcamentoIA").innerText = "❌ Falha na comunicação";
      reject(new Error("Falha ao carregar script JSONP - verifique console"));
    };
    
    script.onload = function() {
      console.log("✅ Script carregado com sucesso, aguardando callback...");
    };
    
    console.log("📎 Adicionando script ao DOM...");
    document.head.appendChild(script);
  });
}

// 📋 CONFIGURAR PASTE SIMPLES
function configurarPasteImagem() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  if (pasteArea && previewArea) {
    pasteArea.addEventListener('paste', function (e) {
      console.log("📋 Paste detectado");
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          console.log("🖼️ Processando imagem...");
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
            
            console.log("✅ Imagem salva, tamanho:", base64.length);
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

console.log("🔧 Debug definitivo carregado");
