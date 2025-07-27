const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxWtCaq_O07y_h_N6YR453i1xJBz9OTtW6gm2hYgBZG3hGuHTMVZ_XM2ibBBZGYyDN5/exec";

console.log("⚡ TESTE MÍNIMO JSONP");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", testeMinimo);
    console.log("✅ Formulário conectado para análise de imagem");
  }
  
  // Configurar paste de imagem
  configurarPasteImagem();
  
  // Teste automático JSONP
  testeJSONPMinimo();
});

// 📋 CONFIGURAR PASTE DE IMAGEM
function configurarPasteImagem() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  
  if (!pasteArea || !previewArea) {
    console.warn("⚠️ Áreas de paste não encontradas");
    return;
  }
  
  console.log("📋 Configurando área de paste para imagens...");
  
  pasteArea.addEventListener('paste', function (e) {
    console.log("📋 Evento paste detectado");
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log("📄 Item tipo:", item.type);

      if (item.type.indexOf('image') !== -1) {
        console.log("🖼️ Imagem detectada no paste!");
        e.preventDefault(); // Prevenir comportamento padrão
        
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = function (event) {
          const base64 = event.target.result;
          
          // Criar elemento de imagem para preview
          const img = document.createElement('img');
          img.src = base64;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '8px';
          img.style.border = '2px solid #28a745';
          
          // Atualizar preview
          previewArea.innerHTML = '<p>🖼️ <strong>Imagem carregada para análise:</strong></p>';
          previewArea.appendChild(img);
          
          // Salvar base64 para envio
          previewArea.dataset.fileData = base64;
          
          console.log("✅ Imagem salva para análise (tamanho:", base64.length, "chars)");
          
          // Feedback visual
          pasteArea.style.backgroundColor = '#d4edda';
          pasteArea.style.borderColor = '#28a745';
          pasteArea.innerHTML = '✅ Imagem carregada! Agora preencha os dados e envie.';
        };
        
        reader.onerror = function() {
          console.error("❌ Erro ao ler imagem");
          previewArea.innerHTML = '<p>❌ Erro ao carregar imagem</p>';
        };
        
        reader.readAsDataURL(blob);
        break; // Processar apenas a primeira imagem
      }
    }
  });
  
  // Feedback visual para drag & drop
  pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '#e3f2fd';
    this.style.borderColor = '#2196f3';
  });
  
  pasteArea.addEventListener('dragleave', function(e) {
    this.style.backgroundColor = '';
    this.style.borderColor = '';
  });
  
  console.log("✅ Paste de imagem configurado");
}

// 🧪 TESTE JSONP MÍNIMO
function testeJSONPMinimo() {
  console.log("🧪 Testando JSONP com prompt mínimo...");
  
  const callback = 'test' + Date.now();
  
  window[callback] = function(data) {
    console.log("✅ JSONP FUNCIONOU! Dados:", data);
    delete window[callback];
    if (script.parentNode) script.parentNode.removeChild(script);
  };
  
  const script = document.createElement('script');
  const url = `${WEBAPP_URL}?prompt=teste&type=orcamento&callback=${callback}`;
  
  console.log("📤 URL teste:", url);
  
  script.onerror = function(e) {
    console.error("❌ Erro no script teste:", e);
    delete window[callback];
  };
  
  script.src = url;
  document.head.appendChild(script);
}

// 📝 TESTE DO FORMULÁRIO COM ANÁLISE DE IMAGEM
async function testeMinimo(e) {
  e.preventDefault();
  console.log("📝 Enviando formulário com análise de imagem...");
  
  // Extrair dados do formulário
  const formData = new FormData(e.target);
  const destino = formData.get('destino') || 'Porto';
  const adultos = formData.get('adultos') || '2';
  const criancas = formData.get('criancas') || '0';
  const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value).join(", ") || "Aéreo";
  
  // Verificar se há imagem colada
  const previewArea = document.getElementById("previewArea");
  const imagemColada = previewArea?.dataset.fileData || '';
  
  console.log("🖼️ Imagem presente:", !!imagemColada);
  console.log("📊 Dados:", { destino, adultos, criancas, tipos });
  
  let prompt;
  
  if (imagemColada) {
    // Prompt especial para análise de imagem
    prompt = `ANÁLISE DE IMAGEM - ORÇAMENTO DE PASSAGENS AÉREAS

Dados do cliente:
- Destino: ${destino}
- Adultos: ${adultos}
- Crianças: ${criancas}
- Tipos solicitados: ${tipos}

INSTRUÇÃO CRÍTICA: Há uma imagem de cotação de passagens aéreas anexada. 
ANALISE CUIDADOSAMENTE a imagem e extraia TODOS os dados EXATOS:

1. TODAS as opções mostradas (normalmente 3 opções)
2. Datas EXATAS de cada opção  
3. Preços TOTAIS EXATOS (não invente valores)
4. Companhia aérea REAL
5. Horários COMPLETOS dos voos
6. Duração da viagem (dias e noites)

IMPORTANTE: Os preços mostrados são TOTAIS para ${adultos} adultos, não por pessoa.

Use EXATAMENTE o formato:
✈️ **Passagens Aéreas para [Destino] - [Companhia]**

🥇 OPÇÃO 1 (melhor preço)
📅 [Data ida] - [Data volta] ([X] dias e [Y] noites)
Detalhes dos Voos:
[Data ida] - Guarulhos [Hora] / [Destino] [Hora] ([Data chegada se diferente])
--
[Data volta] - [Destino] [Hora] / Guarulhos [Hora]
💰 R$ [VALOR TOTAL EXATO] para ${adultos} adultos
💵 R$ [VALOR ÷ ${adultos}] por pessoa

[Repetir para TODAS as opções na imagem]

Imagem anexada: ${imagemColada}`;
  } else {
    // Prompt simples sem imagem
    prompt = `Crie um orçamento básico para:
Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas}
Tipos: ${tipos}

Use formato da CVC com emojis e preços estimados.`;
  }
  
  console.log("📤 Enviando prompt com", imagemColada ? "IMAGEM" : "TEXTO APENAS");
  console.log("📝 Prompt:", prompt.substring(0, 200) + "...");
  
  document.getElementById("orcamentoIA").innerText = imagemColada ? 
    "🖼️ Analisando imagem e gerando orçamento..." : 
    "🤖 Gerando orçamento básico...";
  
  const callback = 'form' + Date.now();
  
  window[callback] = function(data) {
    console.log("✅ Resposta recebida:", data);
    
    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content;
      document.getElementById("orcamentoIA").innerText = content;
      console.log("✅ Orçamento gerado! Modelo usado:", data.model || 'desconhecido');
    } else if (data.error) {
      document.getElementById("orcamentoIA").innerText = "❌ Erro da IA: " + data.error;
    } else {
      document.getElementById("orcamentoIA").innerText = "❌ Resposta inválida";
    }
    
    // Limpar
    delete window[callback];
    if (script.parentNode) script.parentNode.removeChild(script);
  };
  
  const script = document.createElement('script');
  
  script.onerror = function(e) {
    console.error("❌ Erro no script:", e);
    document.getElementById("orcamentoIA").innerText = "❌ Erro na comunicação";
    delete window[callback];
  };
  
  // URL com parâmetros
  const params = new URLSearchParams({
    prompt: prompt,
    type: 'orcamento',
    callback: callback
  });
  
  const url = `${WEBAPP_URL}?${params.toString()}`;
  console.log("📤 URL (primeiros 120 chars):", url.substring(0, 120) + "...");
  
  script.src = url;
  document.head.appendChild(script);
}

// 📋 COPIAR
function copiarTexto(id) {
  navigator.clipboard.writeText(document.getElementById(id).innerText);
}

console.log("🔧 Teste mínimo pronto. Aguardando...");
