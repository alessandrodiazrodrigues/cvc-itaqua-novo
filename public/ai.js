// public/ai.js - Frontend com tratamento robusto de erros JSON

const API_URL = '/api/ai';

console.log("⚡ CVC ITAQUA - SISTEMA v2.1 (Error Handling)");

let formElements = {};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema com debug robusto...");
  
  formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload")
  };

  if (formElements.form) {
    formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário conectado");
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
    console.log("✅ Upload conectado");
  }

  if (formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
    console.log("✅ PDF análise conectada");
  }

  setupPasteArea();
  testarConexaoAPI();
});

// 🧪 TESTE DE CONEXÃO MELHORADO
async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando conexão API...");
    
    // Primeiro teste: GET simples
    const response = await fetch(API_URL, {
      method: 'GET',
    });
    
    console.log("📊 Response status:", response.status);
    console.log("📊 Response headers:", Array.from(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("📊 Response text (primeiros 200 chars):", responseText.substring(0, 200));
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log("✅ API Online - JSON válido:", data);
      } catch (jsonError) {
        console.warn("⚠️ API respondeu mas não é JSON:", jsonError.message);
        console.warn("Response completa:", responseText);
      }
    } else {
      console.warn("⚠️ API status não OK:", response.status, responseText);
    }
    
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
    console.error("Possíveis causas:");
    console.error("- API não deployada");  
    console.error("- Erro de sintaxe no api/ai.js");
    console.error("- Problema no Vercel");
  }
}

// 🎯 FUNÇÃO PRINCIPAL com tratamento robusto
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando formulário...");
  
  showLoading();
  
  try {
    const formData = extractFormData(e.target);
    console.log("📊 Dados extraídos:", formData);
    
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de serviço");
    }
    
    // Análise local para debug
    const analiseLocal = analisarTextoParaMultiplasOpcoes(formData.observacoes + ' ' + formData.textoColado);
    console.log("🔍 Análise local:", analiseLocal);
    
    if (analiseLocal.detectado) {
      updateElement("orcamentoIA", "🔍 Múltiplas opções detectadas! Processando...");
    }
    
    await generateOrcamento(formData);
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Processamento concluído!");
    
  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    showError("Erro: " + error.message);
  } finally {
    hideLoading();
  }
}

// 📊 Extração de dados (mantida igual)
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
  
  return {
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
}

// 🔍 Análise local (mantida igual)
function analisarTextoParaMultiplasOpcoes(texto) {
  if (!texto) return { detectado: false, motivo: "Texto vazio" };
  
  const textoLower = texto.toLowerCase();
  
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

// 🤖 GERAR ORÇAMENTO com tratamento robusto
async function generateOrcamento(data) {
  console.log("🤖 Gerando orçamento...");
  
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
    
    console.log("✅ Orçamento gerado:");
    console.log("- Múltiplas opções:", analise.detectado);
    console.log("- Tamanho resposta:", response.length, "chars");
    
  } catch (error) {
    console.error("❌ Erro na geração:", error);
    throw error;
  }
}

// 🏨 Gerar ranking (mantido igual)
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking de hotéis...");
  
  const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} para famílias.

Formato:
🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

Use informações realistas.`;

  try {
    const response = await callAI(prompt, 'ranking', { destino });
    updateElement("rankingIA", response);
  } catch (error) {
    console.error("❌ Erro no ranking:", error);
    updateElement("rankingIA", "❌ Erro ao gerar ranking: " + error.message);
  }
}

// 📄 Análise PDF (mantida igual)
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

Formato executivo para a filial 6220.`;

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
    updateElement("analiseIA", "❌ Erro: " + error.message);
  } finally {
    hideLoading("analiseIA");
  }
}

// 📁 Upload arquivo (mantido igual)
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Arquivo:", file.name);

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
    console.error("❌ Erro upload:", error);
    formElements.previewArea.innerHTML = `<p>❌ Erro: ${file.name}</p>`;
  }
}

// 📋 Setup paste (mantido igual)
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

// 🔧 CHAMAR API COM TRATAMENTO ROBUSTO DE ERROS
async function callAI(prompt, tipo, extraData = {}) {
  try {
    console.log("🔄 Enviando para API:", { tipo, temImagem: extraData.temImagem });
    
    const requestData = {
      prompt,
      tipo,
      destino: extraData.destino,
      tipos: extraData.tipos,
      temImagem: extraData.temImagem,
      arquivo: extraData.arquivo
    };
    
    console.log("📤 Request data:", {
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

    console.log("📊 Response status:", response.status);
    console.log("📊 Response headers:", Array.from(response.headers.entries()));

    // 🔍 LER RESPOSTA COMO TEXTO PRIMEIRO
    const responseText = await response.text();
    console.log("📊 Response text (primeiros 200 chars):", responseText.substring(0, 200));

    if (!response.ok) {
      console.error("❌ Response não OK:", response.status, responseText);
      
      // Tentar parsear erro como JSON
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      } catch (jsonError) {
        // Se não for JSON, usar texto direto
        throw new Error(`API Error ${response.status}: ${responseText.substring(0, 100)}`);
      }
    }
    
    // 🔍 TENTAR PARSEAR RESPOSTA COMO JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("✅ JSON parseado com sucesso");
    } catch (jsonError) {
      console.error("❌ Erro ao parsear JSON:", jsonError.message);
      console.error("❌ Response text completo:", responseText);
      
      // Se a resposta parece ser HTML de erro do Vercel
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        throw new Error("API retornou HTML ao invés de JSON. Possível erro no servidor.");
      }
      
      // Se começa com texto de erro
      if (responseText.startsWith('A server error') || responseText.startsWith('Error:')) {
        throw new Error(`Erro do servidor: ${responseText.substring(0, 200)}`);
      }
      
      throw new Error(`Resposta não é JSON válido: ${jsonError.message}`);
    }
    
    // 🔍 VALIDAR ESTRUTURA DA RESPOSTA
    if (data.success && data.choices?.[0]?.message?.content) {
      console.log("✅ Resposta válida recebida");
      return data.choices[0].message.content;
    } else {
      console.error("❌ Estrutura de resposta inválida:", data);
      
      // Se tem erro na resposta
      if (data.error) {
        throw new Error(data.error);
      }
      
      throw new Error("Estrutura de resposta inválida da API");
    }
    
  } catch (error) {
    console.error("❌ Erro completo na API:", error);
    console.error("❌ Stack:", error.stack);
    throw error;
  }
}

// 🎯 Funções auxiliares (mantidas iguais)
function habilitarBotaoDicas() {
  const btnGerar = document.getElementById('btnGerarDicas');
  if (btnGerar) {
    btnGerar.disabled = false;
    console.log("✅ Botão dicas habilitado");
  }
}

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
    console.log("📝 Elemento atualizado:", id, "length:", content.length);
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

// 📋 Função copiar (mantida robusta anterior)
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
      console.warn("❌ Clipboard falhou:", err);
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
  
  alert("Cópia automática falhou. Selecione o texto manualmente e pressione Ctrl+C para copiar.");
}

console.log("🚀 Sistema CVC Itaqua v2.1 (Robust Error Handling) carregado!");
