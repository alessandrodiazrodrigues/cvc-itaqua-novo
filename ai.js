const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwCnLpZYbKcfbql7GysU7_K9fiV3pzWNA-OWv-uoJtuO-f4szNj5OtFwkiaLou4cknS/exec";

console.log("🔄 CVC JSONP - Versão Ultra Simples");

document.addEventListener("DOMContentLoaded", function () {
  // Conectar formulário
  const form = document.getElementById("orcamentoForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    console.log("✅ Formulário conectado");
  }
  
  // Configurar área de paste e upload
  configurarPasteEUpload();
  
  // Teste automático
  testarJSONP();
});

// 📋 CONFIGURAR PASTE E UPLOAD
function configurarPasteEUpload() {
  const pasteArea = document.getElementById("pasteArea");
  const previewArea = document.getElementById("previewArea");
  const arquivo = document.getElementById("arquivo");
  
  // Configurar paste de imagens
  if (pasteArea && previewArea) {
    pasteArea.addEventListener('paste', function (e) {
      console.log("📋 Conteúdo colado");
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') !== -1) {
          console.log("🖼️ Imagem detectada");
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';
            previewArea.innerHTML = '<p>🖼️ Imagem carregada para análise:</p>';
            previewArea.appendChild(img);
            previewArea.dataset.fileData = event.target.result;
            console.log("✅ Imagem salva para envio");
          };
          reader.readAsDataURL(blob);
        } else if (item.type === 'text/plain') {
          item.getAsString(function (text) {
            console.log("📝 Texto colado:", text.substring(0, 50) + "...");
            previewArea.innerHTML = '<p>📝 Texto colado:</p><div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">' + text + '</div>';
          });
        }
      }
    });
  }
  
  // Configurar upload de arquivo
  if (arquivo) {
    arquivo.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;

      console.log("📁 Arquivo selecionado:", file.name);
      
      const reader = new FileReader();
      reader.onload = function(event) {
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '8px';
          previewArea.innerHTML = '<p>📁 Arquivo carregado:</p>';
          previewArea.appendChild(img);
        } else {
          previewArea.innerHTML = `<p>📄 ${file.name} carregado</p>`;
        }
        previewArea.dataset.fileData = event.target.result;
        console.log("✅ Arquivo salvo para envio");
      };
      reader.readAsDataURL(file);
    });
  }
}

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
  
  // Extrair dados do formulário
  const formData = new FormData(e.target);
  const destino = formData.get('destino') || 'não informado';
  const adultos = formData.get('adultos') || '2';
  const criancas = formData.get('criancas') || '0';
  const idades = formData.get('idades_criancas') || '';
  const observacoes = formData.get('observacoes') || '';
  const tipos = Array.from(e.target.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value).join(", ") || "Aéreo";
  
  // Verificar se há imagem colada
  const previewArea = document.getElementById("previewArea");
  const pasteArea = document.getElementById("pasteArea");
  const imagemColada = previewArea?.dataset.fileData || '';
  const textoColado = pasteArea?.innerText || '';
  
  // Montar prompt detalhado
  let prompt = `DADOS DO CLIENTE:
Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas}${idades ? ` (idades: ${idades})` : ''}
Tipos solicitados: ${tipos}
${observacoes ? `Observações: ${observacoes}` : ''}

`;

  // Adicionar informações de imagem/texto colado
  if (imagemColada) {
    prompt += `IMPORTANTE: Uma captura de tela foi colada com informações de preços. 
ANALISE A IMAGEM e use EXATAMENTE os preços, datas e companhias mostrados.
Dados da imagem: ${imagemColada}

`;
  }
  
  if (textoColado && textoColado.trim() !== 'Clique aqui ou pressione Ctrl+V') {
    prompt += `TEXTO ADICIONAL FORNECIDO:
${textoColado}

`;
  }

  prompt += `Você é atendente da CVC Itaquaquecetuba. Crie um orçamento PRECISO para WhatsApp usando EXATAMENTE os dados fornecidos acima.

REGRAS OBRIGATÓRIAS:
- Use APENAS preços reais da imagem/texto (NUNCA invente valores)
- Se há captura de tela, extraia dados EXATOS (companhia, preços, datas)
- Use formato atrativo da CVC com emojis
- Mencione que valores podem alterar`;

  console.log("📤 Prompt detalhado:", prompt.substring(0, 200) + "...");
  
  // Mostrar loading
  document.getElementById("orcamentoIA").innerText = "🤖 Analisando dados e gerando orçamento...";
  
  try {
    const resposta = await chamarIA(prompt, "orcamento");
    document.getElementById("orcamentoIA").innerText = resposta;
    console.log("✅ Orçamento gerado com dados reais!");
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
