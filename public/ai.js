// ================================================================================
// 🏆 CVC ITAQUA - FRONTEND HÍBRIDO COMPLETO (Claude + GPT-4o-mini)
// ================================================================================
// Versão: 4.0.0-hybrid-frontend
// Autor: Sistema CVC Itaqua
// Última atualização: 2025
// ================================================================================

/*
📋 ÍNDICE DO CÓDIGO FRONTEND:

🔧 SEÇÃO 1: CONFIGURAÇÕES E INICIALIZAÇÃO (Linhas 30-80)
   ├── 1.1 Constantes e Configurações
   ├── 1.2 Elementos do DOM
   ├── 1.3 Estrutura do Medidor de Custo
   └── 1.4 Inicialização do Sistema

💰 SEÇÃO 2: SISTEMA DE MEDIDOR DE CUSTO (Linhas 90-250)
   ├── 2.1 Inicialização do Medidor
   ├── 2.2 Widget Visual no Header
   ├── 2.3 Dashboard Completo de Custos
   ├── 2.4 Armazenamento Local de Dados
   └── 2.5 Cálculos e Projeções

🎯 SEÇÃO 3: PROCESSAMENTO PRINCIPAL (Linhas 260-350)
   ├── 3.1 Handler do Formulário Principal
   ├── 3.2 Validações de Dados
   ├── 3.3 Chamada para API Híbrida
   ├── 3.4 Processamento de Respostas
   └── 3.5 Atualização de Métricas

🖼️ SEÇÃO 4: PROCESSAMENTO DE IMAGENS (Linhas 360-480)
   ├── 4.1 Validação de Imagens Base64
   ├── 4.2 Upload de Arquivos
   ├── 4.3 Área de Paste (Ctrl+V)
   ├── 4.4 Drag & Drop
   └── 4.5 Preview e Feedback Visual

📊 SEÇÃO 5: EXTRAÇÃO E ANÁLISE DE DADOS (Linhas 490-570)
   ├── 5.1 Extração de Dados do Formulário
   ├── 5.2 Análise de Múltiplas Opções
   ├── 5.3 Validações Específicas
   ├── 5.4 Preparação para API Híbrida
   └── 5.5 Logs e Debugging

🔗 SEÇÃO 6: COMUNICAÇÃO COM API (Linhas 580-650)
   ├── 6.1 Chamada da API Híbrida
   ├── 6.2 Tratamento de Respostas
   ├── 6.3 Tratamento de Erros
   ├── 6.4 Logs de Comunicação
   └── 6.5 Retry Logic

🎨 SEÇÃO 7: INTERFACE E FEEDBACK (Linhas 660-750)
   ├── 7.1 Atualização de Elementos
   ├── 7.2 Feedback de Custo
   ├── 7.3 Loading States
   ├── 7.4 Mensagens de Erro
   └── 7.5 Feedback Visual de Sucesso

📋 SEÇÃO 8: FUNCIONALIDADES AUXILIARES (Linhas 760-850)
   ├── 8.1 Geração de Orçamentos
   ├── 8.2 Ranking de Hotéis
   ├── 8.3 Análise de PDFs
   ├── 8.4 Dicas de Destinos
   └── 8.5 Funções de Cópia

🔧 SEÇÃO 9: UTILITÁRIOS E HELPERS (Linhas 860-920)
   ├── 9.1 Conversão de Arquivos
   ├── 9.2 Validadores
   ├── 9.3 Manipulação de DOM
   └── 9.4 Logs e Debug
*/

// ================================================================================
// 🔧 SEÇÃO 1: CONFIGURAÇÕES E INICIALIZAÇÃO
// ================================================================================

// 1.1 CONSTANTES E CONFIGURAÇÕES
const API_URL = '/api/ai';
const VERSAO_SISTEMA = '4.0.0-hybrid-frontend';

console.log(`⚡ CVC ITAQUA - SISTEMA HÍBRIDO v${VERSAO_SISTEMA}`);
console.log("🎯 Estratégia: Claude (imagens) + GPT-4o-mini (texto)");

// 1.2 ELEMENTOS DO DOM
let formElements = {};

// 1.3 ESTRUTURA DO MEDIDOR DE CUSTO
let custoMeter = {
  orcamentosHoje: 0,
  custoTotalHoje: 0,
  economiaHoje: 0,
  orcamentosTexto: 0,
  orcamentosImagem: 0,
  ultimaAtualizacao: new Date().toDateString(),
  modelosUsados: {
    'claude-3-sonnet': 0,
    'gpt-4o-mini': 0,
    'fallback': 0
  }
};

// 1.4 INICIALIZAÇÃO DO SISTEMA
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Iniciando sistema híbrido...");
  
  // Mapear elementos do DOM
  formElements = {
    form: document.getElementById("orcamentoForm"),
    pasteArea: document.getElementById("pasteArea"),
    previewArea: document.getElementById("previewArea"),
    arquivo: document.getElementById("arquivo"),
    pdfUpload: document.getElementById("pdfUpload")
  };

  // Configurar event listeners
  if (formElements.form) {
    formElements.form.addEventListener("submit", handleOrcamentoSubmit);
    console.log("✅ Formulário principal conectado");
  }
  
  if (formElements.arquivo) {
    formElements.arquivo.addEventListener("change", handleFileUpload);
    console.log("✅ Upload de arquivo conectado");
  }

  if (formElements.pdfUpload) {
    window.analisarPDF = handlePDFAnalysis;
    console.log("✅ Análise de PDF conectada");
  }

  // Inicializar componentes
  setupPasteArea();
  inicializarMedidorCusto();
  testarConexaoAPI();
  
  console.log("✅ Sistema híbrido inicializado com sucesso!");
});

// ================================================================================
// 💰 SEÇÃO 2: SISTEMA DE MEDIDOR DE CUSTO
// ================================================================================

// 2.1 INICIALIZAÇÃO DO MEDIDOR
function inicializarMedidorCusto() {
  try {
    console.log("💰 [CUSTO] Inicializando medidor híbrido...");
    
    // Carregar dados salvos do localStorage
    const dadosSalvos = localStorage.getItem('cvc_custo_meter_hybrid');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      
      // Verificar se é do mesmo dia
      if (dados.ultimaAtualizacao === new Date().toDateString()) {
        custoMeter = { ...custoMeter, ...dados };
        console.log("💰 [CUSTO] Dados carregados:", custoMeter);
      } else {
        console.log("💰 [CUSTO] Novo dia, resetando contador");
        resetarContadorDiario();
      }
    }
    
    // Criar e atualizar widget
    criarWidgetCusto();
    atualizarWidgetCusto();
    
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao inicializar:", error);
    resetarContadorDiario();
  }
}

// 2.2 WIDGET VISUAL NO HEADER
function criarWidgetCusto() {
  // Verificar se widget já existe
  if (document.getElementById('custoWidgetHibrido')) return;
  
  const widget = document.createElement('div');
  widget.id = 'custoWidgetHibrido';
  widget.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 3px 15px rgba(0,0,0,0.2);
    z-index: 1001;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255,255,255,0.2);
    min-width: 160px;
  `;
  
  // Efeitos hover
  widget.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 5px 25px rgba(0,0,0,0.3)';
  });
  
  widget.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 3px 15px rgba(0,0,0,0.2)';
  });
  
  widget.addEventListener('click', mostrarDashboardCompleto);
  
  document.body.appendChild(widget);
  console.log("✅ [CUSTO] Widget híbrido criado");
}

// 2.3 ATUALIZAÇÃO DO WIDGET
function atualizarWidgetCusto() {
  const widget = document.getElementById('custoWidgetHibrido');
  if (!widget) return;
  
  const economiaTexto = custoMeter.economiaHoje > 0 ? 
    ` | 💰 -${custoMeter.economiaHoje.toFixed(2)}` : '';
  
  widget.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 13px; font-weight: bold;">💰 Hoje: R$ ${custoMeter.custoTotalHoje.toFixed(3)}</div>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
        📊 ${custoMeter.orcamentosHoje} orçamentos${economiaTexto}
      </div>
      <div style="font-size: 9px; opacity: 0.8; margin-top: 1px;">
        🔵${custoMeter.orcamentosTexto} texto | 🟠${custoMeter.orcamentosImagem} imagem
      </div>
    </div>
  `;
}

// 2.4 DASHBOARD COMPLETO DE CUSTOS
function mostrarDashboardCompleto() {
  const custoMedio = custoMeter.orcamentosHoje > 0 ? 
    custoMeter.custoTotalHoje / custoMeter.orcamentosHoje : 0;
  
  const projecaoMensal = custoMeter.custoTotalHoje * 30;
  const eficiencia = custoMeter.orcamentosHoje > 0 ? 
    ((custoMeter.orcamentosTexto / custoMeter.orcamentosHoje) * 100).toFixed(1) : 0;
  
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
                max-width: 600px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <h3 style="color: #003399; margin-bottom: 1.5rem;">📊 Dashboard Híbrido - Custos IA</h3>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        
        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #1976d2;">
            R$ ${custoMeter.custoTotalHoje.toFixed(3)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Total Hoje</div>
        </div>
        
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #388e3c;">
            ${custoMeter.orcamentosHoje}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Orçamentos</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.4rem; font-weight: bold; color: #f57c00;">
            R$ ${custoMedio.toFixed(4)}
          </div>
          <div style="font-size: 0.9rem; color: #666;">Custo Médio</div>
        </div>
        
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        
        <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px;">
          <h4 style="color: #7b1fa2; margin-bottom: 0.5rem;">🔵 GPT-4o-mini (Texto)</h4>
          <div style="font-size: 1.2rem; font-weight: bold; color: #7b1fa2;">
            ${custoMeter.orcamentosTexto}
          </div>
          <div style="font-size: 0.8rem; color: #666;">orçamentos (${eficiencia}%)</div>
        </div>
        
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
          <h4 style="color: #ef6c00; margin-bottom: 0.5rem;">🟠 Claude (Imagem)</h4>
          <div style="font-size: 1.2rem; font-weight: bold; color: #ef6c00;">
            ${custoMeter.orcamentosImagem}
          </div>
          <div style="font-size: 0.8rem; color: #666;">orçamentos (${(100-eficiencia).toFixed(1)}%)</div>
        </div>
        
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h4 style="color: #003399; margin-bottom: 0.5rem;">📈 Projeções e Economia</h4>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
          <span>Projeção Mensal:</span>
          <strong>R$ ${projecaoMensal.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
          <span>Economia vs GPT-4o:</span>
          <strong style="color: #28a745;">R$ ${custoMeter.economiaHoje.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span>Economia Mensal:</span>
          <strong style="color: #28a745;">R$ ${(custoMeter.economiaHoje * 30).toFixed(2)}</strong>
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <h4 style="color: #003399; margin-bottom: 0.5rem;">🏆 Sistema Híbrido</h4>
        <div style="font-size: 0.9rem; color: #666; line-height: 1.4;">
          • <strong>Texto:</strong> GPT-4o-mini (92% economia)<br>
          • <strong>Imagens:</strong> Claude Sonnet (60% economia)<br>
          • <strong>Fallback:</strong> Automático GPT-4 Vision<br>
          • <strong>Eficiência:</strong> ${eficiencia}% texto / ${(100-eficiencia).toFixed(1)}% imagem
        </div>
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: #003399; color: white; border: none; 
                     padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer;">
        Fechar Dashboard
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

// 2.5 FUNÇÕES DE GERENCIAMENTO DO MEDIDOR
function salvarMedidorCusto() {
  try {
    localStorage.setItem('cvc_custo_meter_hybrid', JSON.stringify(custoMeter));
    console.log("💾 [CUSTO] Dados híbridos salvos");
  } catch (error) {
    console.error("❌ [CUSTO] Erro ao salvar:", error);
  }
}

function resetarContadorDiario() {
  custoMeter = {
    orcamentosHoje: 0,
    custoTotalHoje: 0,
    economiaHoje: 0,
    orcamentosTexto: 0,
    orcamentosImagem: 0,
    ultimaAtualizacao: new Date().toDateString(),
    modelosUsados: {
      'claude-3-sonnet': 0,
      'gpt-4o-mini': 0,
      'fallback': 0
    }
  };
  salvarMedidorCusto();
  console.log("🔄 [CUSTO] Contador híbrido resetado");
}

// 2.6 ATUALIZAÇÃO DE MÉTRICAS HÍBRIDAS
function atualizarMetricasHibridas(metricas) {
  try {
    // Verificar se mudou o dia
    const hoje = new Date().toDateString();
    if (custoMeter.ultimaAtualizacao !== hoje) {
      resetarContadorDiario();
    }
    
    // Atualizar contadores gerais
    custoMeter.orcamentosHoje++;
    custoMeter.custoTotalHoje += metricas.custo.brl;
    custoMeter.economiaHoje += metricas.economia.vs_gpt4o_brl || 0;
    custoMeter.ultimaAtualizacao = hoje;
    
    // Atualizar contadores específicos por tipo
    if (metricas.tipo_processamento === 'imagem') {
      custoMeter.orcamentosImagem++;
      custoMeter.modelosUsados['claude-3-sonnet']++;
    } else {
      custoMeter.orcamentosTexto++;
      custoMeter.modelosUsados['gpt-4o-mini']++;
    }
    
    // Salvar e atualizar UI
    salvarMedidorCusto();
    atualizarWidgetCusto();
    
    console.log("📊 [MÉTRICAS HÍBRIDAS] Atualizadas:", {
      estrategia: metricas.estrategia,
      modelo: metricas.modelo_usado,
      custo: `R$ ${metricas.custo.brl.toFixed(4)}`,
      economia: `R$ ${(metricas.economia.vs_gpt4o_brl || 0).toFixed(4)}`,
      total_hoje: `R$ ${custoMeter.custoTotalHoje.toFixed(3)}`
    });
    
  } catch (error) {
    console.error("❌ [MÉTRICAS] Erro ao atualizar:", error);
  }
}

// ================================================================================
// 🎯 SEÇÃO 3: PROCESSAMENTO PRINCIPAL
// ================================================================================

// 3.1 HANDLER DO FORMULÁRIO PRINCIPAL
async function handleOrcamentoSubmit(e) {
  e.preventDefault();
  console.log("📝 Processando orçamento com sistema híbrido...");
  
  showLoading();
  
  try {
    // 3.2 VALIDAÇÕES DE DADOS
    const formData = extractFormData(e.target);
    console.log("📊 Dados extraídos:", formData);
    
    if (!formData.tipos || formData.tipos.length === 0) {
      throw new Error("Selecione pelo menos um tipo de serviço");
    }
    
    // Análise local para debug
    const analiseLocal = analisarTextoParaMultiplasOpcoes(formData.observacoes + ' ' + formData.textoColado);
    console.log("🔍 Análise local:", analiseLocal);
    
    // Mostrar estratégia que será usada
    const estrategia = formData.temImagem ? 
      'Claude Sonnet para análise visual' : 
      'GPT-4o-mini para processamento de texto';
    
    updateElement("orcamentoIA", `🎯 Estratégia: ${estrategia}...`);
    
    if (analiseLocal.detectado) {
      updateElement("orcamentoIA", "🔍 Múltiplas opções detectadas! Processando com IA híbrida...");
    }
    
    // 3.3 CHAMADA PARA API HÍBRIDA
    const response = await generateOrcamento(formData);
    
    // 3.4 PROCESSAMENTO DE RESPOSTAS
    if (response.metricas) {
      atualizarMetricasHibridas(response.metricas);
      mostrarFeedbackCustoHibrido(response.metricas);
    }
    
    // 3.5 FUNCIONALIDADES AUXILIARES
    habilitarBotaoDicas();
    
    if (formData.tipos.includes("Hotel")) {
      await generateRankingHoteis(formData.destino);
    }
    
    console.log("✅ Orçamento gerado com sistema híbrido!");
    
  } catch (error) {
    console.error("❌ Erro no processamento híbrido:", error);
    showError("Erro: " + error.message);
  } finally {
    hideLoading();
  }
}

// ================================================================================
// 🖼️ SEÇÃO 4: PROCESSAMENTO DE IMAGENS
// ================================================================================

// 4.1 VALIDAÇÃO DE IMAGENS BASE64
function validarImagemBase64(base64String) {
  try {
    if (!base64String || typeof base64String !== 'string') {
      return { valido: false, erro: 'String base64 inválida' };
    }
    
    if (!base64String.startsWith('data:image/')) {
      return { valido: false, erro: 'Não é uma imagem base64 válida' };
    }
    
    if (!base64String.includes('base64,')) {
      return { valido: false, erro: 'Formato base64 incorreto' };
    }
    
    const [header, base64Data] = base64String.split('base64,');
    
    if (!base64Data || base64Data.length < 100) {
      return { valido: false, erro: 'Dados base64 muito pequenos' };
    }
    
    // Verificar se é base64 válido (regex simples)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64Data.substring(0, 100))) {
      return { valido: false, erro: 'Dados base64 inválidos' };
    }
    
    const mimeType = header.match(/data:(image\/[^;]+)/)?.[1];
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (mimeType && !supportedTypes.includes(mimeType)) {
      return { valido: false, erro: `Tipo ${mimeType} não suportado` };
    }
    
    const sizeInBytes = base64Data.length * 0.75;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    // Claude tem limite menor
    if (sizeInMB > 5) {
      return { valido: false, erro: `Arquivo muito grande: ${sizeInMB.toFixed(2)}MB. Máximo: 5MB para Claude` };
    }
    
    return { 
      valido: true, 
      mimeType, 
      tamanhoMB: sizeInMB.toFixed(2),
      tamanhoBase64: base64Data.length,
      adequadoParaClaude: sizeInMB <= 5
    };
    
  } catch (error) {
    return { valido: false, erro: `Erro na validação: ${error.message}` };
  }
}

// 4.2 UPLOAD DE ARQUIVOS
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📁 Arquivo selecionado:", file.name, "Tamanho:", file.size);

  // Verificar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG)');
    formElements.previewArea.innerHTML = '<p>❌ Apenas imagens são aceitas</p>';
    return;
  }

  // Verificar tamanho para Claude (mais restritivo)
  if (file.size > 5 * 1024 * 1024) {
    alert('Arquivo muito grande para Claude. Máximo 5MB.');
    formElements.previewArea.innerHTML = '<p>❌ Arquivo muito grande (máx: 5MB para Claude)</p>';
    return;
  }

  try {
    const base64 = await fileToBase64(file);
    
    // Verificar se base64 foi gerado corretamente
    if (!base64 || !base64.startsWith('data:image/')) {
      throw new Error('Erro ao processar imagem');
    }
    
    // Validação específica para sistema híbrido
    const validacao = validarImagemBase64(base64);
    if (!validacao.valido) {
      throw new Error(validacao.erro);
    }
    
    formElements.previewArea.dataset.fileData = base64;
    
    // Criar preview com informações do sistema híbrido
    const img = document.createElement('img');
    img.src = base64;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    
    formElements.previewArea.innerHTML = `
      <p>✅ Imagem carregada para Claude Sonnet</p>
      <div style="font-size: 12px; color: #666; margin: 5px 0;">
        📊 ${validacao.mimeType} | ${validacao.tamanhoMB}MB | 🟠 Claude Ready
      </div>
    `;
    formElements.previewArea.appendChild(img);
    
    console.log('✅ Imagem processada para sistema híbrido:', base64.length, 'caracteres');
    
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    formElements.previewArea.innerHTML = `<p>❌ Erro: ${error.message}</p>`;
    alert('Erro ao processar imagem: ' + error.message);
  }
}

// 4.3 ÁREA DE PASTE (CTRL+V)
function setupPasteArea() {
  if (!formElements.pasteArea) return;
  
  formElements.pasteArea.addEventListener('paste', function (e) {
    console.log("📋 Conteúdo sendo colado para sistema híbrido...");
    
    e.preventDefault();
    
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') !== -1) {
        console.log("🖼️ Imagem detectada - será processada pelo Claude");
        
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = function (event) {
          const base64Data = event.target.result;
          
          // Validar para sistema híbrido
          const validacao = validarImagemBase64(base64Data);
          if (!validacao.valido) {
            formElements.previewArea.innerHTML = `<p>❌ ${validacao.erro}</p>`;
            return;
          }
          
          // Criar preview com informações do Claude
          const img = document.createElement('img');
          img.src = base64Data;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '8px';
          img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          
          formElements.previewArea.innerHTML = `
            <p>✅ Imagem colada - Claude Sonnet ready!</p>
            <div style="font-size: 12px; color: #666; margin: 5px 0;">
              📊 ${validacao.mimeType} | ${validacao.tamanhoMB}MB | 🟠 Análise visual
            </div>
          `;
          formElements.previewArea.appendChild(img);
          formElements.previewArea.dataset.fileData = base64Data;
          
          console.log('✅ Imagem colada para Claude:', base64Data.length, 'caracteres');
        };
        
        reader.onerror = function() {
          console.error('❌ Erro ao ler imagem');
          formElements.previewArea.innerHTML = '<p>❌ Erro ao processar imagem</p>';
        };
        
        reader.readAsDataURL(blob);
        break;
        
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          formElements.previewArea.innerHTML = `
            <p>📝 Texto colado - GPT-4o-mini ready!</p>
            <div style="font-size: 12px; color: #666;">${text.substring(0, 100)}...</div>
          `;
          console.log('📝 Texto colado para GPT-4o-mini:', text.length, 'caracteres');
        });
      }
    }
  });
  
  // 4.4 EFEITOS VISUAIS PARA DRAG & DROP
  formElements.pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#003399';
    this.style.backgroundColor = '#e9ecef';
    this.textContent = '📎 Solte aqui - Claude processará!';
  });

  formElements.pasteArea.addEventListener('dragleave', function(e) {
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude';
  });

  formElements.pasteArea.addEventListener('drop', function(e) {
    e.preventDefault();
    console.log('📎 Arquivo dropado no sistema híbrido');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const mockEvent = { target: { files: [file] } };
      handleFileUpload(mockEvent);
    }
    
    // Resetar visual
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    this.textContent = '📌 Clique ou Ctrl+V | 🔵 Texto→GPT-4o-mini | 🟠 Imagem→Claude';
  });
}

// ================================================================================
// 📊 SEÇÃO 5: EXTRAÇÃO E ANÁLISE DE DADOS
// ================================================================================

// 5.1 EXTRAÇÃO DE DADOS DO FORMULÁRIO
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
  
  // 5.2 DETECÇÃO INTELIGENTE DE IMAGEM
  const arquivoBase64 = formElements.previewArea?.dataset.fileData || "";
  const temImagem = !!(arquivoBase64 && arquivoBase64.startsWith('data:image/'));
  
  console.log('📊 [FORM HÍBRIDO] Tem imagem:', temImagem);
  console.log('📊 [FORM HÍBRIDO] Arquivo tamanho:', arquivoBase64.length);
  
  // 5.3 VALIDAÇÃO ESPECÍFICA PARA SISTEMA HÍBRIDO
  if (temImagem) {
    const validacao = validarImagemBase64(arquivoBase64);
    
    if (!validacao.valido) {
      alert(`❌ Erro na imagem: ${validacao.erro}`);
      throw new Error(`Imagem inválida: ${validacao.erro}`);
    }
    
    console.log('✅ [VALIDAÇÃO HÍBRIDA] Imagem válida para Claude:', {
      mimeType: validacao.mimeType,
      tamanho: validacao.tamanhoMB + 'MB',
      adequadaParaClaude: validacao.adequadoParaClaude
    });
    
    // Mostrar feedback específico do sistema híbrido
    mostrarFeedbackValidacao(validacao, 'claude');
    
  } else {
    console.log('📝 [FORM HÍBRIDO] Somente texto - usando GPT-4o-mini');
    mostrarFeedbackValidacao(null, 'gpt-mini');
  }
  
  return {
    destino: form.destino.value || "(Destino não informado)",
    adultos: form.adultos.value || "2",
    criancas: form.criancas.value || "0",
    idades: idadesCriancas.join(', '),
    observacoes: form.observacoes.value || "",
    tipos: tipos,
    textoColado: formElements.pasteArea?.innerText || '',
    arquivoBase64: arquivoBase64,
    temImagem: temImagem
  };
}

// 5.4 ANÁLISE DE MÚLTIPLAS OPÇÕES (mantida igual)
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

// 5.5 FEEDBACK DE VALIDAÇÃO HÍBRIDA
function mostrarFeedbackValidacao(validacao, modelo) {
  const feedbackElement = document.getElementById('feedbackValidacao');
  
  // Criar elemento se não existir
  if (!feedbackElement) {
    const feedback = document.createElement('div');
    feedback.id = 'feedbackValidacao';
    feedback.style.cssText = `
      padding: 8px;
      border-radius: 4px;
      margin: 5px 0;
      font-size: 12px;
      font-weight: 500;
    `;
    
    if (formElements.previewArea && !formElements.previewArea.querySelector('#feedbackValidacao')) {
      formElements.previewArea.appendChild(feedback);
    }
  }
  
  const feedback = document.getElementById('feedbackValidacao');
  if (!feedback) return;
  
  if (modelo === 'claude' && validacao) {
    feedback.style.cssText += 'background: #fff3e0; color: #ef6c00; border: 1px solid #ffb74d;';
    feedback.innerHTML = `🟠 Claude Sonnet: ${validacao.mimeType} (${validacao.tamanhoMB}MB) - Análise visual de alta qualidade`;
  } else if (modelo === 'gpt-mini') {
    feedback.style.cssText += 'background: #e3f2fd; color: #1976d2; border: 1px solid #64b5f6;';
    feedback.innerHTML = `🔵 GPT-4o-mini: Processamento de texto com máxima economia (92% vs GPT-4o)`;
  }
}

// ================================================================================
// 🔗 SEÇÃO 6: COMUNICAÇÃO COM API
// ================================================================================

// 6.1 CHAMADA DA API HÍBRIDA
async function callAI(prompt, tipo, extraData = {}) {
  try {
    console.log("🔄 Enviando para API híbrida:", { 
      tipo, 
      temImagem: extraData.temImagem,
      estrategia: extraData.temImagem ? 'Claude Sonnet' : 'GPT-4o-mini'
    });
    
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

    // 6.2 TRATAMENTO DE RESPOSTAS
    if (!response.ok) {
      console.error("❌ Response não OK:", response.status, responseText);
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      } catch (jsonError) {
        throw new Error(`API Híbrida Error ${response.status}: ${responseText.substring(0, 100)}`);
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
    
    // 6.3 VALIDAÇÃO DE ESTRUTURA
    if (data.success && data.choices?.[0]?.message?.content) {
      console.log("✅ Resposta válida recebida do sistema híbrido");
      
      // Log das métricas híbridas
      if (data.metricas) {
        console.log("📊 Métricas híbridas:", {
          estrategia: data.metricas.estrategia,
          modelo: data.metricas.modelo_usado,
          tipo: data.metricas.tipo_processamento
        });
      }
      
      return data;
    } else {
      console.error("❌ Estrutura inválida:", data);
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error("Estrutura de resposta inválida");
    }
    
  } catch (error) {
    console.error("❌ Erro na API híbrida:", error);
    throw error;
  }
}

// ================================================================================
// 🎨 SEÇÃO 7: INTERFACE E FEEDBACK
// ================================================================================

// 7.1 FEEDBACK DE CUSTO HÍBRIDO
function mostrarFeedbackCustoHibrido(metricas) {
  const feedbackElement = document.getElementById('custoFeedbackHibrido');
  
  // Criar elemento se não existir
  if (!feedbackElement) {
    const feedback = document.createElement('div');
    feedback.id = 'custoFeedbackHibrido';
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
  
  const feedback = document.getElementById('custoFeedbackHibrido');
  if (feedback) {
    const economiaTexto = metricas.economia.vs_gpt4o_brl > 0 ? 
      ` | 💰 Economia: R$ ${metricas.economia.vs_gpt4o_brl.toFixed(4)} (${metricas.economia.percentual}%)` : '';
    
    const estrategiaIcon = metricas.tipo_processamento === 'imagem' ? '🟠' : '🔵';
    
    feedback.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>
          ${estrategiaIcon} <strong>${metricas.modelo_usado}</strong> | 
          💰 Custo: <strong>R$ ${metricas.custo.brl.toFixed(4)}</strong>${economiaTexto}
        </span>
        <span style="font-size: 0.75rem; opacity: 0.8;">
          📊 ${metricas.tokens.total} tokens | ⚡ ${metricas.performance?.tempo_processamento_ms}ms
        </span>
      </div>
      <div style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">
        🎯 ${metricas.estrategia}
      </div>
    `;
  }
}

// 7.2 OUTRAS FUNÇÕES DE INTERFACE (mantidas iguais)
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
  updateElement(elementId, "🤖 Processando com sistema híbrido...");
}

function hideLoading() {
  // Loading será substituído pelo conteúdo
}

function showError(message) {
  updateElement("orcamentoIA", "❌ " + message);
}

// ================================================================================
// 📋 SEÇÃO 8: FUNCIONALIDADES AUXILIARES
// ================================================================================

// 8.1 GERAÇÃO DE ORÇAMENTOS (atualizada para sistema híbrido)
async function generateOrcamento(data) {
  console.log("🤖 Gerando orçamento com sistema híbrido...");
  
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
    
    console.log("✅ Orçamento gerado com sistema híbrido:");
    console.log("- Múltiplas opções:", analise.detectado);
    console.log("- Estratégia:", response.metricas?.estrategia);
    console.log("- Modelo usado:", response.metricas?.modelo_usado);
    console.log("- Custo:", response.metricas?.custo.brl);
    
    return response;
    
  } catch (error) {
    console.error("❌ Erro na geração híbrida:", error);
    throw error;
  }
}

// 8.2 OUTRAS FUNCIONALIDADES (mantidas iguais, mas otimizadas)
async function generateRankingHoteis(destino) {
  console.log("🏨 Gerando ranking de hotéis com GPT-4o-mini...");
  
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

// ================================================================================
// 🔧 SEÇÃO 9: UTILITÁRIOS E HELPERS
// ================================================================================

// 9.1 TESTE DE CONEXÃO (atualizado)
async function testarConexaoAPI() {
  try {
    console.log("🧪 Testando API híbrida...");
    
    const response = await fetch(API_URL, { method: 'GET' });
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ API Híbrida Online:", data);
      console.log("🎯 Sistema:", data.sistema);
      console.log("🤖 Modelos:", data.modelos);
    } else {
      console.warn("⚠️ API status:", response.status);
    }
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
  }
}

// 9.2 FUNCIONALIDADES AUXILIARES (mantidas iguais)
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

// 9.3 FUNÇÃO DE CÓPIA (mantida robusta)
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
    mostrarFeedbackCopia(button, "❌ Erro");
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

// FUNCIONALIDADES DO FORMULÁRIO (mantidas iguais)
function atualizarIdadesCriancas() {
  const qtdeCriancas = parseInt(document.getElementById('criancas').value) || 0;
  const container = document.getElementById('containerIdadesCriancas');
  const camposContainer = document.getElementById('camposIdadesCriancas');
  
  if (qtdeCriancas > 0) {
    container.style.display = 'block';
    camposContainer.innerHTML = '';
    
    for (let i = 1; i <= qtdeCriancas; i++) {
      const div = document.createElement('div');
      div.style.marginBottom = '0.5rem';
      div.innerHTML = `
        <label for="idade_crianca_${i}" style="display: inline-block; width: 120px;">Criança ${i}:</label>
        <input type="number" id="idade_crianca_${i}" name="idade_crianca_${i}" 
               min="0" max="17" placeholder="Idade" 
               style="width: 80px; margin-right: 10px;">
        <small style="color: #666;">anos</small>
      `;
      camposContainer.appendChild(div);
    }
  } else {
    container.style.display = 'none';
    camposContainer.innerHTML = '';
  }
}

async function gerarDicasDestino() {
  const destino = document.getElementById('destino').value;
  const orcamentoTexto = document.getElementById('orcamentoIA').innerText;
  
  if (!destino) {
    alert('Informe um destino primeiro!');
    return;
  }
  
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  btnGerar.disabled = true;
  btnGerar.innerText = '🤖 Gerando com GPT-4o-mini...';
  
  try {
    let contextoData = '';
    if (orcamentoTexto && orcamentoTexto !== 'Preencha o formulário acima para gerar o orçamento...') {
      contextoData = `\n\nCONTEXTO DA VIAGEM:\n${orcamentoTexto.substring(0, 300)}...`;
    }
    
    const prompt = `Crie dicas personalizadas sobre ${destino} para WhatsApp da CVC.${contextoData}
    
Inclua:
- Principais atrações e pontos turísticos
- Melhor época para visitar (considerando a época da viagem se informada)
- Dicas de clima e o que levar
- Informações práticas (moeda, documentação, fuso horário)
- Tom vendedor mas informativo
- Máximo 250 palavras
- Use emojis para deixar atrativo

Se há datas específicas na viagem, adapte as dicas para essa época do ano.`;

    const response = await callAI(prompt, 'destino', { destino });
    document.getElementById('destinoIA').innerText = response.choices[0].message.content;
    
    btnCopiar.style.display = 'inline-block';
    console.log("✅ Dicas do destino geradas com sistema híbrido!");
    
  } catch (error) {
    console.error("❌ Erro ao gerar dicas:", error);
    document.getElementById('destinoIA').innerText = "❌ Erro ao gerar dicas: " + error.message;
  } finally {
    btnGerar.disabled = false;
    btnGerar.innerText = '🎯 Gerar Dicas';
  }
}

async function handlePDFAnalysis() {
  const file = formElements.pdfUpload.files[0];
  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  console.log("📄 Analisando arquivo com Claude...");
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

// ================================================================================
// 📊 INICIALIZAÇÃO FINAL
// ================================================================================

console.log(`🚀 Sistema CVC Itaqua v${VERSAO_SISTEMA} carregado!`);
console.log("🎯 Estratégia Híbrida Ativa:");
console.log("   🔵 GPT-4o-mini: Texto (92% economia)");
console.log("   🟠 Claude Sonnet: Imagens (60% economia)");
console.log("   🔄 Fallback: GPT-4 Vision Preview");
console.log("✅ Sistema pronto para uso híbrido!");
