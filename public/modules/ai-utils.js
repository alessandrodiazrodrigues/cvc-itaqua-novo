// 🔧 ai-utils.js - Módulo de Funções Utilitárias
// Contém todas as funções auxiliares e utilitários do sistema

console.log("🔧 Módulo de Utilitários carregado");

// ================================================================================
// 🎨 FUNÇÕES DE INTERFACE E FEEDBACK
// ================================================================================

function updateElement(id, content) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`⚠️ Elemento '${id}' não encontrado`);
      return false;
    }
    
    if (typeof content !== 'string') {
      content = String(content);
    }
    
    element.innerText = content;
    console.log(`📝 Elemento '${id}' atualizado (${content.length} chars)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar elemento '${id}':`, error);
    return false;
  }
}

function showLoading(mensagem = "Processando...") {
  updateElement("orcamentoIA", `🤖 ${mensagem}`);
  console.log(`⏳ Loading: ${mensagem}`);
}

function hideLoading() {
  console.log("🔄 Loading ocultado");
}

function showError(message) {
  const errorMessage = `❌ Erro: ${message}`;
  const sucesso = updateElement("orcamentoIA", errorMessage);
  
  if (!sucesso) {
    alert(errorMessage);
  }
  
  console.error("❌ Erro exibido:", message);
}

function showSuccess(message) {
  console.log(`✅ Sucesso: ${message}`);
  
  // Feedback visual temporário se necessário
  const elements = ['orcamentoIA', 'destinoIA', 'rankingIA'];
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element && element.innerText.includes('🤖')) {
      element.style.border = '2px solid #28a745';
      setTimeout(() => {
        element.style.border = '';
      }, 2000);
    }
  });
}

// ================================================================================
// 📋 FUNÇÕES DE FORMULÁRIO E DADOS
// ================================================================================

function extractFormData(form) {
  console.log("📊 Extraindo dados do formulário...");
  
  const tipos = Array.from(form.querySelectorAll('input[name="tipo"]:checked'))
    .map(checkbox => checkbox.value);
  
  const parcelamento = obterConfiguracaoParcelamento();
  const idades = extrairIdadesCriancas();
  
  const formData = {
    tipos: tipos,
    destino: form.querySelector('#destino')?.value?.trim() || '',
    adultos: parseInt(form.querySelector('#adultos')?.value) || null,
    criancas: parseInt(form.querySelector('#criancas')?.value) || 0,
    idadesCriancas: idades,
    observacoes: form.querySelector('#observacoes')?.value || '',
    textoColado: extrairTextoColado(),
    arquivo: extrairArquivo(),
    parcelamento: parcelamento,
    temImagem: verificarSeTemImagem()
  };
  
  console.log("📋 Dados extraídos:", formData);
  return formData;
}

function extrairIdadesCriancas() {
  const idades = [];
  const qtdeCriancas = parseInt(document.getElementById('criancas')?.value) || 0;
  
  for (let i = 1; i <= qtdeCriancas; i++) {
    const idade = document.getElementById(`idade_crianca_${i}`)?.value;
    if (idade) {
      idades.push(parseInt(idade));
    }
  }
  
  return idades;
}

function extrairTextoColado() {
  const pasteArea = document.getElementById('pasteArea');
  if (!pasteArea) return '';
  
  const texto = pasteArea.innerText || pasteArea.textContent || '';
  return texto.replace('📌 Clique aqui ou pressione Ctrl+V para colar conteúdo | 🔍 Detecção automática de escalas', '').trim();
}

function extrairArquivo() {
  const arquivoInput = document.getElementById('arquivo');
  return arquivoInput?.files?.[0] || null;
}

function verificarSeTemImagem() {
  const previewArea = document.getElementById('previewArea');
  return !!(previewArea?.dataset?.fileData || document.getElementById('arquivo')?.files?.[0]);
}

// ================================================================================
// 🔄 FUNÇÕES DE CONFIGURAÇÃO E PARCELAMENTO
// ================================================================================

function obterConfiguracaoParcelamento() {
  const parcela10x = document.getElementById('parcela10x')?.checked || false;
  const parcela12x = document.getElementById('parcela12x')?.checked || false;
  
  const configuracao = {
    incluirParcelamento: parcela10x || parcela12x,
    parcelas10x: parcela10x,
    parcelas12x: parcela12x,
    mostrarAmbos: parcela10x && parcela12x
  };
  
  console.log('💳 Configuração de parcelamento:', configuracao);
  return configuracao;
}

function resetarParcelamento() {
  const inputs = ['parcela10x', 'parcela12x'];
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.checked = false;
  });
  
  const secao = document.getElementById('secaoParcelamento');
  if (secao) secao.style.display = 'none';
  
  console.log('🔄 Parcelamento resetado');
}

function atualizarIdadesCriancas() {
  const qtdeCriancas = parseInt(document.getElementById('criancas')?.value) || 0;
  const container = document.getElementById('containerIdadesCriancas');
  const camposContainer = document.getElementById('camposIdadesCriancas');
  
  if (!container || !camposContainer) return;
  
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

// ================================================================================
// 📎 FUNÇÕES DE ÁREA DE PASTE E UPLOAD
// ================================================================================

function setupPasteArea() {
  const pasteArea = document.getElementById('pasteArea');
  const previewArea = document.getElementById('previewArea');
  
  if (!pasteArea || !previewArea) {
    console.warn('⚠️ Área de paste não encontrada');
    return;
  }
  
  // Evento de paste
  pasteArea.addEventListener('paste', function (e) {
    console.log('📋 Conteúdo colado');
    
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        handleImagePaste(item, previewArea);
      } else if (item.type === 'text/plain') {
        item.getAsString(function (text) {
          handleTextPaste(text, previewArea);
        });
      }
    }
  });
  
  // Eventos de drag & drop
  pasteArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#003399';
    this.style.backgroundColor = '#e9ecef';
  });
  
  pasteArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
  });
  
  pasteArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#007bff';
    this.style.backgroundColor = '#f8f9fa';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileDrop(files[0], previewArea);
    }
  });
  
  console.log('📋 Área de paste configurada');
}

function handleImagePaste(item, previewArea) {
  const blob = item.getAsFile();
  const reader = new FileReader();
  
  reader.onload = function (event) {
    const img = document.createElement('img');
    img.src = event.target.result;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    
    previewArea.innerHTML = '';
    previewArea.appendChild(img);
    previewArea.dataset.fileData = event.target.result;
    
    console.log('🖼️ Imagem colada e processada');
  };
  
  reader.readAsDataURL(blob);
}

function handleTextPaste(text, previewArea) {
  const div = document.createElement('div');
  div.innerHTML = `<p style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border-left: 4px solid #007bff;">${text}</p>`;
  
  previewArea.innerHTML = '';
  previewArea.appendChild(div);
  
  console.log('📝 Texto colado:', text.length, 'caracteres');
}

function handleFileDrop(file, previewArea) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    
    reader.onload = function (event) {
      handleImagePaste({ getAsFile: () => file }, previewArea);
    };
    
    reader.readAsDataURL(file);
  } else {
    console.log('📄 Arquivo dropado:', file.name);
    previewArea.innerHTML = `<p>📄 Arquivo: ${file.name}</p>`;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const previewArea = document.getElementById('previewArea');
  if (!previewArea) return;
  
  console.log('📎 Arquivo selecionado:', file.name, file.type);
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      
      previewArea.innerHTML = '';
      previewArea.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'application/pdf') {
    previewArea.innerHTML = `<p style="background: #fff3cd; padding: 1rem; border-radius: 6px;">📄 PDF carregado: ${file.name}</p>`;
  } else {
    previewArea.innerHTML = `<p style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">📎 Arquivo: ${file.name}</p>`;
