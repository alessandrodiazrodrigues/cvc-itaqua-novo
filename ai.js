const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzoVVO1ZJgoZ-jysI4p8fMkUMpGCSiwFO-9Zk3fwrwxfC4C4cywCrvxqlowi4pEJHD9/exec";

console.log("🔄 CVC JSONP - Versão Ultra Simples");

document.addEventListener("DOMContentLoaded", function () {
  // Conectar formulário
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    console.log("✅ Formulário conectado");
  }
  
  // Teste automático
  testarJSONP();
});

// 🧪 TESTE JSONP
async function testarJSONP() {
  console.log("🧪 Testando JSONP...");
  try {
    const resultado = await chamarIA("Teste JSONP", "orcamento");
    console.log("✅ JSONP OK:", resultado.substring(0, 50) + "...");
  } catch (error) {
    console.error("❌ JSONP falhou:", error.message);
  }
}

// 📝 ENVIO DO FORMULÁRIO
async function handleSubmit(e) {
  e.preventDefault();
  console.log("📝 Enviando formulário...");
  
  // Extrair dados
  const formData = new FormData(e.target);
  const destino = formData.get('destino') || 'Orlando';
  const adultos = formData.get('adultos') || '2';
  const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value).join(", ") || "Aéreo";
  
  const prompt = `Você é atendente da CVC. Crie orçamento para WhatsApp:

Destino: ${destino}
Adultos: ${adultos}
Tipos: ${tipos}

Use formato da CVC com emojis, preços e "Valores sujeitos a alteração".`;

  // Mostrar loading
  document.getElementById("orcamentoIA").innerText = "🤖 Gerando orçamento...";
  
  try {
    const resposta = await chamarIA(prompt, "orcamento");
    document.getElementById("orcamentoIA").innerText = resposta;
    console.log("✅ Orçamento gerado!");
  } catch (error) {
    document.getElementById("orcamentoIA").innerText = "❌ Erro: " + error.message;
    console.error("❌ Erro:", error);
  }
}

// 🔄 FUNÇÃO JSONP PRINCIPAL
function chamarIA(prompt, tipo) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Chamando IA via JSONP (${tipo})...`);
    
    // Nome único do callback
    const callback = 'callback' + Date.now();
    
    // Timeout
    const timeout = setTimeout(() => {
      limpar();
      reject(new Error("Timeout"));
    }, 25000);
    
    // Função de limpeza
    function limpar() {
      if (window[callback]) delete window[callback];
      if (script.parentNode) script.parentNode.removeChild(script);
      clearTimeout(timeout);
    }
    
    // Callback global
    window[callback] = function(data) {
      console.log("📥 Resposta JSONP:", data);
      limpar();
      
      if (data.error) {
        reject(new Error(data.error));
      } else if (data.choices?.[0]?.message?.content) {
        resolve(data.choices[0].message.content);
      } else {
        reject(new Error("Resposta inválida"));
      }
    };
    
    // Criar script
    const script = document.createElement('script');
    const params = new URLSearchParams({
      prompt: prompt,
      type: tipo,
      callback: callback
    });
    
    script.src = `${WEBAPP_URL}?${params.toString()}`;
    script.onerror = () => {
      limpar();
      reject(new Error("Erro no script"));
    };
    
    document.head.appendChild(script);
  });
}

// 📋 FUNÇÃO COPIAR
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto).then(() => {
    console.log("📋 Copiado:", id);
  });
}

// 🧪 TESTE MANUAL
window.teste = () => testarJSONP();

console.log("🔧 Sistema pronto! Digite 'teste()' para testar.");
