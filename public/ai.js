// public/ai.js - Frontend melhorado para detecção de múltiplas opções

const API_URL = '/api/ai';

console.log("⚡ CVC ITAQUA - SISTEMA VERCEL ATIVO (v2.0)");

let formElements = {};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema melhorado...");
  
  formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload")
  };

  if (formElements.form) {
    formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário de orçamento conectado");
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
    console.log("✅ Upload de arquivo conectado");
  }

  if (formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
    console.log("✅ Análise de PDF conectada");
  }

  setupPasteArea();
  testarConexaoAPI();
});

// 🧪 Teste de conexão
async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando conexão com API melhorada...");
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'teste de conexão v2.0',
        tipo: 'teste'
      })
    });
    
    if (response.ok) {
      console.log("✅ API Vercel v2.0 conectada!");
    } else {
      console.warn("⚠️ API status:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
  }
}

// 🎯 FUNÇÃO PRINCIPAL melhorada
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando formulário (v2.0)...");
  
  showLoading();
  
  try {
    const formData = extractFormData(e.target);
    console.log("📊 Dados extraídos:", formData);
    
    // Validação melhorada
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de serviço");
    }
    
    // PRÉ-ANÁLISE do texto para debug
    const temMultiplasOpcoes = analisarTextoParaMultiplasOpcoes(formData.observacoes + ' ' + formData.textoColado);
    console.log("🔍 Pré-análise múltiplas opções:", temMultiplasOpcoes);
    
    // Feedback visual para o usuário
    if (temMultiplasOpcoes.detectado) {
      updateElement("orcamentoIA", "🔍 Múltiplas opções detectadas! Processando com template especial...");
    }
    
    // Gerar orçamento principal
    await generateOrcamento(formData);
    
    // Habilitar botão de gerar dicas
    habilitarBotaoDicas();
    
    // Gerar ranking de hotéis se necessário
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao processar:", error);
    showError("Erro ao processar: " + error.message);
  } finally {
    hideLoading();
  }
}

// 📊 Extração de dados melhorada
function extractFormData(form) {
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
  
  const qtdeCriancas = parseInt(form.criancas.value) || 0;
  let idadesCriancas = [];
  
  for (let i = 1; i <= qtdeCriancas; i++) {
    const idadeInput = document.getElementById(`idade_crianca_${i}`);
    if (idadeInput && idadeInput.value) {
      idadesCriancas.push(idadeInput.value);
    }
  }
  
  const formData = {
    destino: form.destino.value || "(Destino não informado)",
    adultos: form.adultos.value || "2",
    criancas: form.criancas.value || "0",
    idades: idadesCriancas.join(', '),
    observacoes: form.observacoes.value || "",
    tipos: tipos,
    textoColado: formElements.pasteArea?.innerText || '',
    arquivoBase64: formElements.previewArea?.dataset.fileData || "",
    temImagem: !!(formElements.previewArea?.dataset.fileData)
  };
  
  console.log("✅ Dados extraídos - Tipos:", tipos, "| Tem imagem:", formData.temImagem);
  
  return formData;
}

// 🔍 ANÁLISE LOCAL de múltiplas opções (para debug)
function analisarTextoParaMultiplasOpcoes(texto) {
  if (!texto) return { detectado: false, motivo: "Texto vazio" };
  
  const textoLower = texto.toLowerCase();
  
  // Contadores
  const precos = (textoLower.match(/r\$.*\d{1,3}[\.,]\d{3}/gi) || []).length;
  const companhias = (textoLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  const horarios = (textoLower.match(/\d{2}:\d{2}/g) || []).length;
  const totais = (textoLower.match(/total.*\d+.*adult/gi) || []).length;
  
  const detectado = precos >= 2 || companhias >= 2 || horarios >= 4 || totais >= 2;
  
  return {
    detectado,
    contadores: { precos, companhias, horarios, totais },
    motivo: detectado ? "Múltiplas opções detectadas" : "Apenas uma opção encontrada"
  };
}

// 🤖 Gerar orçamento com logging melhorado
async function generateOrcamento(data) {
  console.log("🤖 Gerando orçamento principal...");
  
  const textoCompleto = `${data.observacoes} ${data.textoColado}`.trim();
  const analise = analisarTextoParaMultiplasOpcoes(textoCompleto);
  
  console.log("📝 Análise local:", analise);
  
  const prompt = `Dados do orçamento:
Destino: ${data.destino}
Adultos: ${data.adultos}
Crianças: ${data.criancas}${data.idades ? ` (idades: ${data.idades} anos)` : ''}
Tipos selecionados: ${data.tipos.join(', ')}

DADOS ESPECÍFICOS DA VIAGEM:
${textoCompleto}

${analise.detectado ? 
  'IMPORTANTE: Este texto contém múltiplas opções de passagens. Formate TODAS as opções encontradas.' : 
  'IMPORTANTE: Este texto contém uma única opção. Formate de forma simples e clara.'
}`;

  try {
    const response = await callAI(prompt, 'orcamento', data);
    updateElement("orcamentoIA", response);
    
    // Log de sucesso com detalhes
    console.log("✅ Orçamento gerado:");
    console.log("- Múltiplas opções detectadas:", analise.detectado);
    console.log("- Tamanho da resposta:", response.length, "caracteres");
    
  } catch (error) {
    console.error("❌ Erro na geração:", error);
    throw error;
  }
}

// 🏨 Gerar ranking de hotéis
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking de hotéis para:", destino);
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas e atuais.`;

  try {
    const response = await callAI(prompt, 'ranking', { destino });
    updateElement("rankingIA", response);
  } catch (error) {
    console.error("❌ Erro no ranking:", error);
    updateElement("rankingIA", "❌ Erro ao gerar ranking: " + error.message);
  }
}

// 📄 Análise de PDF
async function handlePDFAnalysis() {
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  console.log("📄 Analisando arquivo:", file.name);
  showLoading("analiseIA");
  
  try {
    const base64 = await fileToBase64(file);
    const prompt = `Analise este relatório da CVC e extraia:
    
1. 📊 Principais métricas de vendas
2. 🎯 Metas vs realizado
3. 🏆 Produtos mais vendidos
4. 💡 Recomendações práticas

Formato executivo, claro e acionável para a filial 6220.`;

    const response = await callAI(prompt, 'analise', { 
      temImagem: true, 
      arquivo: base64 
    });
    
    updateElement("analiseIA", response);
    
    const container = document.getElementById('analiseContainer');
    if (container) {
      container.style.display = 'block';
    }
    
  } catch (error) {
    console.error("❌ Erro na análise:", error);
    updateElement("analiseIA", "❌ Erro ao analisar arquivo: " + error.message);
  } finally {
    hideLoading("analiseIA");
  }
}

// 📁 Upload de arquivo (mantido igual)
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Arquivo selecionado:", file.name);

  try {
    const base64 = await fileToBase64(file);
    formElements.previewArea.dataset.fileData = base64;
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      formElements.previewArea.innerHTML = '<p>✅ Imagem carregada</p>';
      formElements.previewArea.appendChild(img);
    } else {
      formElements.previewArea.innerHTML = `<p>📄 ${file.name} carregado</p>`;
    }
    
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    formElements.previewArea.innerHTML = `<p>❌ Erro: ${file.name}</p>`;
  }
}

// 📋 Setup área de paste (mantido igual)
function setupPasteArea() {
  if (!formElements.pasteArea) return;
  
  formElements.pasteArea.addEventListener('paste', function (e) {
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
          img.style.borderRadius = '8px';
          formElements.previewArea.innerHTML = '<p>✅ Imagem colada</p>';
          formElements.previewArea.appendChild(img);
          formElements.previewArea.dataset.fileData = event.target.result;
        };
        
        reader.readAsDataURL(blob);
        break;
        
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          formElements.previewArea.innerHTML = '<p>📝 Texto: ' + text.substring(0, 100) + '...</p>';
        });
      }
    }
  });
}

// 🔧 Chamar API melhorada
async function callAI(prompt, tipo, extraData = {}) {
  try {
    console.log("🔄 Enviando para API v2.0:", { tipo, temImagem: extraData.temImagem });
    
    const requestData = {
      prompt,
      tipo,
      destino: extraData.destino,
      tipos: extraData.tipos,
      temImagem: extraData.temImagem,
      arquivo: extraData.arquivo
    };
    
    console.log("📤 Dados enviados:", {
      prompt: prompt.substring(0, 100) + "...",
      tipo,
      destino: extraData.destino,
      tipos: extraData.tipos
    });
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro da API:", errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Resposta recebida, tamanho:", JSON.stringify(data).length);
    
    if (data.success && data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      console.error("❌ Formato inválido:", data);
      throw new Error("Resposta inválida da API");
    }
    
  } catch (error) {
    console.error("❌ Erro na API:", error);
    throw error;
  }
}

// 🎯 Habilitar botão de dicas
function habilitarBotaoDicas() {
  const btnGerar = document.getElementById('btnGerarDicas');
  if (btnGerar) {
    btnGerar.disabled = false;
    console.log("✅ Botão dicas habilitado");
  }
}

// 🔧 Funções auxiliares (mantidas iguais)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = content;
    console.log("📝 Elemento atualizado:", id, "tamanho:", content.length);
  } else {
    console.warn("⚠️ Elemento não encontrado:", id);
  }
}

function showLoading(elementId = "orcamentoIA") {
  updateElement(elementId, "🤖 Processando com IA...");
}

function hideLoading() {
  // Loading será substituído pelo conteúdo
}

function showError(message) {
  updateElement("orcamentoIA", "❌ " + message);
}

// 📋 Função copiar (mantida robusta)
function copiarTexto(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error("❌ Elemento não encontrado:", id);
    alert("Elemento não encontrado!");
    return;
  }
  
  const texto = elemento.innerText;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log("✅ Texto copiado:", id);
      mostrarFeedbackCopia(event.target, "✅ Copiado!");
    }).catch(err => {
      console.warn("❌ Clipboard falhou, tentando alternativo...");
      tentarCopiaAlternativa(texto, event.target);
    });
  } else {
    tentarCopiaAlternativa(texto, event.target);
  }
}

function tentarCopiaAlternativa(texto, button) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log("✅ Copiado via execCommand");
      mostrarFeedbackCopia(button, "✅ Copiado!");
    } else {
      throw new Error("execCommand falhou");
    }
  } catch (err) {
    console.error("❌ Cópia falhou:", err);
    mostrarInstrucoesManuais(button);
  }
}

function mostrarFeedbackCopia(button, texto) {
  if (!button) return;
  
  const originalText = button.innerText;
  button.innerText = texto;
  button.style.background = '#28a745';
  
  setTimeout(() => {
    button.innerText = originalText;
    button.style.background = '';
  }, 2000);
}

function mostrarInstrucoesManuais(button) {
  if (button) {
    button.innerText = "❌ Erro";
    button.style.background = '#dc3545';
    
    setTimeout(() => {
      button.innerText = "📋 Copiar";
      button.style.background = '';
    }, 3000);
  }
  
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.7); z-index: 10000; display: flex; 
                align-items: center; justify-content: center;">
      <div style="background: white; padding: 2rem; border-radius: 12px; 
                  max-width: 400px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <h3 style="color: #003399; margin-bottom: 1rem;">📋 Cópia Manual</h3>
        <p style="margin-bottom: 1rem; line-height: 1.5;">
          A cópia automática falhou.<br><br>
          <strong>Para copiar:</strong><br>
          1. Selecione todo o texto<br>
          2. Pressione Ctrl+C<br>
          3. Cole com Ctrl+V
        </p>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: #003399; color: white; border: none; 
                       padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
          OK
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 10000);
}

console.log("🚀 Sistema CVC Itaqua v2.0 carregado!");
