// public/ai.js - Frontend com medidor de custo integrado

const API_URL = '/api/ai';

console.log("⚡ CVC ITAQUA - SISTEMA v3.0 (Otimizado + Medidor de Custo)");

let formElements = {};
let custoMeter = {
  orcamentosHoje: 0,
  custoTotalHoje: 0,
  economiaHoje: 0,
  ultimaAtualizacao: new Date().toDateString()
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema otimizado...");
  
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
  inicializarMedidorCusto();
  testarConexaoAPI();
});

// 💰 INICIALIZAR MEDIDOR DE CUSTO
function inicializarMedidorCusto() {
  try {
    // Carregar dados salvos do localStorage
    const dadosSalvos = localStorage.getItem('cvc_custo_meter');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      
      // Verificar se é do mesmo dia
      if (dados.ultimaAtualizacao === new Date().toDateString()) {
        custoMeter = dados;
        console.log("💰 [CUSTO] Dados carregados:", custoMeter);
      } else {
        console.log("💰 [CUSTO] Novo dia, resetando contador");
        resetarContadorDiario();
      }
    }
    
    // Criar widget de custo no header
    criarWidgetCusto();
    atualizarWidgetCusto();
    
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao inicializar:", error);
    resetarContadorDiario();
  }
}

// 🎨 CRIAR WIDGET DE CUSTO
function criarWidgetCusto() {
  const header = document.querySelector('header h1');
  if (!header) return;
  
  const widget = document.createElement('div');
  widget.id = 'custoWidget';
  widget.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255,255,255,0.2);
  `;
  
  widget.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  });
  
  widget.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  });
  
  widget.addEventListener('click', mostrarDetalhamentoCompleto);
  
  document.body.appendChild(widget);
  console.log("✅ [CUSTO] Widget criado");
}

// 📊 ATUALIZAR WIDGET DE CUSTO
function atualizarWidgetCusto() {
  const widget = document.getElementById('custoWidget');
  if (!widget) return;
  
  const economiaTexto = custoMeter.economiaHoje > 0 ? 
    ` | 💰 Economia: R$ ${custoMeter.economiaHoje.toFixed(2)}` : '';
  
  widget.innerHTML = `
    <div style="text-align: center;">
      <div>💰 Hoje: R$ ${custoMeter.custoTotalHoje.toFixed(3)}</div>
      <div style="font-size: 10px; opacity: 0.9;">
        📊 ${custoMeter.orcamentosHoje} orçamentos${economiaTexto}
      </div>
    </div>
  `;
}

// 📈 MOSTRAR DETALHAMENTO COMPLETO
function mostrarDetalhamentoCompleto() {
  const custoMedio = custoMeter.orcamentosHoje > 0 ? 
    custoMeter.custoTotalHoje / custoMeter.orcamentosHoje : 0;
  
  const projecaoMensal = custoMeter.custoTotalHoje * 30; // Estimativa simples
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 12px; 
                max-width: 500px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <h3 style="color: #003399; margin-bottom: 1.5rem;">📊 Dashboard de Custos IA</h3>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        
        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">
            R$ ${custoMeter.custoTotalHoje.toFixed(3)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Hoje</div>
        </div>
        
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #388e3c;">
            ${custoMeter.orcamentosHoje}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Orçamentos</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #f57c00;">
            R$ ${custoMedio.toFixed(4)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Médio</div>
        </div>
        
        <div style="background: #fce4ec; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #c2185b;">
            R$ ${custoMeter.economiaHoje.toFixed(2)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Economia Hoje</div>
        </div>
        
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h4 style="color: #003399; margin-bottom: 0.5rem;">📈 Projeções</h4>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span>Projeção Mensal:</span>
          <strong>R$ ${projecaoMensal.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span>Economia Mensal:</span>
          <strong style="color: #28a745;">R$ ${(custoMeter.economiaHoje * 30).toFixed(2)}</strong>
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <h4 style="color: #003399; margin-bottom: 0.5rem;">🤖 Otimização Inteligente</h4>
        <div style="font-size: 0.9rem; color: #666; line-height: 1.4;">
          • <strong>Texto:</strong> GPT-4o-mini (92% economia)<br>
          • <strong>Imagens:</strong> GPT-4o (quando necessário)<br>
          • <strong>Seleção automática</strong> do modelo ideal
        </div>
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: #003399; color: white; border: none; 
                     padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer;">
        Fechar
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Remover ao clicar fora
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// 💾 SALVAR DADOS DO MEDIDOR
function salvarMedidorCusto() {
  try {
    localStorage.setItem('cvc_custo_meter', JSON.stringify(custoMeter));
    console.log("💾 [CUSTO] Dados salvos");
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao salvar:", error);
  }
}

// 🔄 RESETAR CONTADOR DIÁRIO
function resetarContadorDiario() {
  custoMeter = {
    orcamentosHoje: 0,
    custoTotalHoje: 0,
    economiaHoje: 0,
    ultimaAtualizacao: new Date().toDateString()
  };
  salvarMedidorCusto();
  console.log("🔄 [CUSTO] Contador resetado");
}

// 📊 ATUALIZAR MÉTRICAS com dados da API
function atualizarMetricas(metricas) {
  try {
    // Verificar se mudou o dia
    const hoje = new Date().toDateString();
    if (custoMeter.ultimaAtualizacao !== hoje) {
      resetarContadorDiario();
    }
    
    // Atualizar contadores
    custoMeter.orcamentosHoje++;
    custoMeter.custoTotalHoje += metricas.custo.brl;
    custoMeter.economiaHoje += metricas.economia.vs_gpt4o || 0;
    custoMeter.ultimaAtualizacao = hoje;
    
    // Salvar e atualizar UI
    salvarMedidorCusto();
    atualizarWidgetCusto();
    
    console.log("📊 [MÉTRICAS] Atualizadas:", {
      modelo: metricas.modelo_usado,
      custo: `R$ ${metricas.custo.brl.toFixed(4)}`,
      economia: `R$ ${(metricas.economia.vs_gpt4o || 0).toFixed(4)}`,
      total_hoje: `R$ ${custoMeter.custoTotalHoje.toFixed(3)}`
    });
    
  } catch (error) {
    console.error("❌ [MÉTRICAS] Erro ao atualizar:", error);
  }
}

// 🧪 Teste de conexão (mantido igual)
async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando API otimizada...");
    
    const response = await fetch(API_URL, { method: 'GET' });
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ API Otimizada Online:", data);
      console.log("🤖 Modelos disponíveis:", data.models);
    } else {
      console.warn("⚠️ API status:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
  }
}

// 🎯 FUNÇÃO PRINCIPAL (atualizada para métricas)
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando orçamento otimizado...");
  
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
    
    // Mostrar modelo que será usado
    const modeloEsperado = formData.temImagem ? 'GPT-4o' : 'GPT-4o-mini';
    updateElement("orcamentoIA", `🤖 Processando com ${modeloEsperado}...`);
    
    const response = await generateOrcamento(formData);
    
    // 📊 PROCESSAR MÉTRICAS DA RESPOSTA
    if (response.metricas) {
      atualizarMetricas(response.metricas);
      
      // Mostrar feedback de custo no resultado
      mostrarFeedbackCusto(response.metricas);
    }
    
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    showError("Erro: " + error.message);
  } finally {
    hideLoading();
  }
}

// 💰 MOSTRAR FEEDBACK DE CUSTO
function mostrarFeedbackCusto(metricas) {
  const feedbackElement = document.getElementById('custoFeedback');
  
  // Criar elemento se não existir
  if (!feedbackElement) {
    const feedback = document.createElement('div');
    feedback.id = 'custoFeedback';
    feedback.style.cssText = `
      background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
      border: 1px solid #4caf50;
      border-radius: 8px;
      padding: 0.8rem;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #2e7d32;
    `;
    
    const orcamentoSection = document.querySelector('.output-section');
    if (orcamentoSection) {
      orcamentoSection.appendChild(feedback);
    }
  }
  
  const feedback = document.getElementById('custoFeedback');
  if (feedback) {
    const economiaTexto = metricas.economia.vs_gpt4o > 0 ? 
      ` | 💰 Economia: R$ ${metricas.economia.vs_gpt4o.toFixed(4)}` : '';
    
    feedback.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>
          🤖 <strong>${metricas.modelo_usado}</strong> | 
          💰 Custo: <strong>R$ ${metricas.custo.brl.toFixed(4)}</strong>${economiaTexto}
        </span>
        <span style="font-size: 0.75rem; opacity: 0.8;">
          📊 ${metricas.tokens.total} tokens
        </span>
      </div>
    `;
  }
}

// 🤖 GERAR ORÇAMENTO (atualizada para retornar resposta completa)
async function generateOrcamento(data) {
  console.log("🤖 Gerando orçamento...");
  
  const textoCompleto = `${data.observacoes} ${data.textoColado}`.trim();
  const analise = analisarTextoParaMultiplasOpcoes(textoCompleto);
  
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
    updateElement("orcamentoIA", response.choices[0].message.content);
    
    console.log("✅ Orçamento gerado:");
    console.log("- Múltiplas opções:", analise.detectado);
    console.log("- Modelo usado:", response.metricas?.modelo_usado);
    console.log("- Custo:", response.metricas?.custo.brl);
    
    return response; // Retornar resposta completa com métricas
    
  } catch (error) {
    console.error("❌ Erro na geração:", error);
    throw error;
  }
}

// Todas as outras funções mantidas iguais (generateRankingHoteis, handlePDFAnalysis, etc.)
// ... [resto do código igual ao anterior] ...

// 🔧 CHAMAR API (atualizada para retornar resposta completa)
async function callAI(prompt, tipo, extraData = {}) {
  try {
    console.log("🔄 Enviando para API otimizada:", { tipo, temImagem: extraData.temImagem });
    
    const requestData = {
      prompt,
      tipo,
      destino: extraData.destino,
      tipos: extraData.tipos,
      temImagem: extraData.temImagem,
      arquivo: extraData.arquivo
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    console.log("📊 Response status:", response.status);

    const responseText = await response.text();
    console.log("📊 Response preview:", responseText.substring(0, 200));

    if (!response.ok) {
      console.error("❌ Response não OK:", response.status, responseText);
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      } catch (jsonError) {
        throw new Error(`API Error ${response.status}: ${responseText.substring(0, 100)}`);
      }
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("✅ JSON parseado com sucesso");
    } catch (jsonError) {
      console.error("❌ Erro JSON:", jsonError.message);
      throw new Error(`Resposta não é JSON válido: ${jsonError.message}`);
    }
    
    if (data.success && data.choices?.[0]?.message?.content) {
      console.log("✅ Resposta válida recebida");
      return data; // Retornar objeto completo com métricas
    } else {
      console.error("❌ Estrutura inválida:", data);
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error("Estrutura de resposta inválida");
    }
    
  } catch (error) {
    console.error("❌ Erro na API:", error);
    throw error;
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

// 🏨 Gerar ranking de hotéis
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
    updateElement("rankingIA", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Erro no ranking:", error);
    updateElement("rankingIA", "❌ Erro ao gerar ranking: " + error.message);
  }
}

// 📄 Análise PDF
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
    
    updateElement("analiseIA", response.choices[0].message.content);
    
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

// 📁 Upload arquivo
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

// 📋 Setup paste
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

// 🎯 Funções auxiliares
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

console.log("🚀 Sistema CVC Itaqua v3.0 (Otimizado + Medidor) carregado!");
