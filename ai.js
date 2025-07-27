// ⚡ AI.JS FINAL - FUNCIONANDO
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzEiP9hXPqOtPEpLvqSV0oE9eaIdyQeC8Q3yMF38s5LyD-4ycYzD3_3ju7mFJCbnYm2/exec";

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Versão de teste iniciada");
  console.log("🔗 URL:", WEBAPP_URL);
  
  // Teste automático da URL
  testURL();
  
  // Conectar formulário
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    console.log("✅ Formulário conectado");
  }
});

// 🧪 TESTE AUTOMÁTICO DA URL
async function testURL() {
  console.log("🧪 Testando URL...");
  
  try {
    // Teste GET simples
    const response = await fetch(WEBAPP_URL + "?test=true");
    console.log("📥 GET resposta:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ GET funcionando:", data);
      
      // Se GET funciona, testar POST
      await testPOST();
    } else {
      console.error("❌ GET falhou:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    showError("Erro de conectividade: " + error.message);
  }
}

// 🧪 TESTE POST
async function testPOST() {
  console.log("🧪 Testando POST...");
  
  try {
    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Teste de POST",
        type: "orcamento"
      })
    });
    
    console.log("📥 POST resposta:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ POST funcionando:", data);
    } else {
      const errorText = await response.text();
      console.error("❌ POST falhou:", response.status, errorText);
    }
  } catch (error) {
    console.error("❌ Erro no POST:", error);
  }
}

// 📝 HANDLER DO FORMULÁRIO
async function handleSubmit(e) {
  e.preventDefault();
  console.log("📝 Formulário enviado");
  
  const formData = new FormData(e.target);
  const destino = formData.get('destino') || 'Orlando';
  const adultos = formData.get('adultos') || '2';
  const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value).join(", ") || "Aéreo";
  
  const prompt = `Crie um orçamento para WhatsApp:
Destino: ${destino}
Adultos: ${adultos}
Tipos: ${tipos}

Use o padrão da CVC com emojis e preços.`;

  console.log("📤 Enviando prompt:", prompt.substring(0, 100) + "...");
  
  // Mostrar loading
  updateElement("orcamentoIA", "🤖 Gerando orçamento...");
  
  try {
    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        type: "orcamento"
      })
    });
    
    console.log("📥 Resposta:", response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Dados recebidos:", data);
    
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      updateElement("orcamentoIA", content);
      console.log("✅ Orçamento gerado com sucesso!");
    } else {
      throw new Error("Resposta vazia da IA");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
    updateElement("orcamentoIA", "❌ Erro: " + error.message);
  }
}

// 🔧 FUNÇÕES AUXILIARES
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = content;
    console.log(`✅ ${id} atualizado`);
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed; top: 20px; left: 20px; right: 20px;
    background: #ff4444; color: white; padding: 15px;
    border-radius: 8px; z-index: 9999; text-align: center;
  `;
  errorDiv.innerHTML = `<h4>🚨 ${message}</h4>`;
  document.body.appendChild(errorDiv);
}

// 📋 COPIAR TEXTO
function copiarTexto(id) {
  const texto = document.getElementById(id).innerText;
  navigator.clipboard.writeText(texto).then(() => {
    console.log("📋 Copiado:", id);
  });
}

// 🧪 TESTE MANUAL
window.testeManual = async function() {
  console.log("🧪 Teste manual...");
  await testURL();
  alert("✅ Teste concluído - veja o console");
};

console.log("🔧 Cole a URL nova no código e teste!");
