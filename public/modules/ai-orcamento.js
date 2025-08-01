// 💰 ai-orcamento.js - Módulo de Geração de Orçamentos
// Responsável por toda a lógica de criação de orçamentos com IA

console.log("💰 Módulo de Orçamentos carregado");

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE GERAÇÃO DE ORÇAMENTO
// ================================================================================

async function generateOrcamento(formData, analise) {
  console.log("🤖 Iniciando geração de orçamento...");
  
  try {
    showLoading("Gerando orçamento com IA...");
    
    // Construir prompt otimizado
    const prompt = construirPromptOrcamento(formData, analise);
    
    // Chamar API
    const response = await callOrcamentoAPI(prompt, formData);
    
    // Processar resposta
    const orcamento = processarRespostaOrcamento(response);
    
    // Atualizar interface
    updateElement("orcamentoIA", orcamento);
    
    // Salvar no estado global
    estadoGlobal.ultimoOrcamento = orcamento;
    estadoGlobal.ultimoDestino = extrairDestinoDoOrcamento(orcamento);
    
    console.log("✅ Orçamento gerado com sucesso!");
    
    return orcamento;
    
  } catch (error) {
    console.error("❌ Erro na geração do orçamento:", error);
    throw error;
  }
}

// ================================================================================
// 📝 CONSTRUÇÃO DO PROMPT OTIMIZADO
// ================================================================================

function construirPromptOrcamento(formData, analise) {
  console.log("📝 Construindo prompt para orçamento...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  let prompt = `ORÇAMENTO CVC ITAQUA - SISTEMA PROFISSIONAL

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

REGRAS OBRIGATÓRIAS:
1. 🧹 FORMATO LIMPO: Sem cabeçalhos técnicos, pronto para copy/paste
2. ✈️ ESCALAS: Detectar automaticamente e mencionar se houver
3. 🌍 AEROPORTOS: Converter códigos para nomes completos
4. 💰 PREÇOS: Usar apenas valores reais fornecidos
5. 📱 WHATSAPP: Formato ideal para envio direto

CAMPOS OPCIONAIS (usar apenas se fornecidos):`;

  // Adicionar destino se fornecido
  if (formData.destino) {
    prompt += `\n- Destino: ${formData.destino}`;
  }
  
  // Adicionar adultos se fornecido
  if (formData.adultos) {
    prompt += `\n- Adultos: ${formData.adultos}`;
  }
  
  // Adicionar crianças e idades se fornecido
  if (formData.criancas > 0) {
    prompt += `\n- Crianças: ${formData.criancas}`;
    if (formData.idadesCriancas && formData.idadesCriancas.length > 0) {
      prompt += ` (idades: ${formData.idadesCriancas.join(', ')} anos)`;
    }
  }

  // Adicionar configuração de parcelamento
  prompt += adicionarConfiguracaoParcelamento(formData);
  
  prompt += `\n\nGERE O ORÇAMENTO NO FORMATO PADRÃO CVC ITAQUA:`;
  
  console.log("📋 Prompt construído:", prompt.length, "caracteres");
  
  return prompt;
}

function adicionarConfiguracaoParcelamento(formData) {
  if (!formData.parcelamento || !formData.parcelamento.incluirParcelamento) {
    return '\n\nPARCELAMENTO: Não incluir (exceto se explícito nas observações para Aéreo Facial)';
  }
  
  let configParcelamento = '\n\nPARCELAMENTO SOLICITADO:';
  
  if (formData.parcelamento.parcelas10x && formData.parcelamento.parcelas12x) {
    configParcelamento += '\n- Incluir opções de 10x e 12x';
  } else if (formData.parcelamento.parcelas10x) {
    configParcelamento += '\n- Incluir opção de 10x';
  } else if (formData.parcelamento.parcelas12x) {
    configParcelamento += '\n- Incluir opção de 12x';
  }
  
  configParcelamento += '\n- Calcular valor das parcelas automaticamente';
  
  return configParcelamento;
}

// ================================================================================
// 🔗 COMUNICAÇÃO COM API
// ================================================================================

async function callOrcamentoAPI(prompt, formData) {
  console.log("🔄 Enviando para API...");
  
  const requestData = {
    prompt: prompt,
    tipo: 'orcamento',
    modelo: 'gpt-4o-mini', // Modelo padrão
    maxTokens: 2000,
    metadata: {
      tipos: formData.tipos,
      destino: formData.destino,
      temImagem: formData.temImagem,
      timestamp: new Date().toISOString()
    }
  };
  
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log("✅ Resposta da API recebida");
  
  return data;
}

// ================================================================================
// 🧹 PROCESSAMENTO DA RESPOSTA
// ================================================================================

function processarRespostaOrcamento(response) {
  console.log("🧹 Processando resposta da API...");
  
  if (!response || !response.choices || !response.choices[0]) {
    throw new Error('Resposta da API em formato inválido');
  }
  
  let conteudo = response.choices[0].message?.content || '';
  
  if (!conteudo.trim()) {
    throw new Error('Conteúdo da resposta está vazio');
  }
  
  // Limpar cabeçalhos técnicos
  conteudo = limparCabecalhosTecnicos(conteudo);
  
  // Melhorar formatação
  conteudo = melhorarFormatacao(conteudo);
  
  console.log("✅ Orçamento processado:", conteudo.length, "caracteres");
  
  return conteudo;
}

function limparCabecalhosTecnicos(conteudo) {
  let limpo = conteudo;
  
  const cabecalhosRemover = [
    /ORÇAMENTO CVC ITAQUA.*?\n/gi,
    /TIPOS SELECIONADOS:.*?\n/gi,
    /DADOS DA VIAGEM:.*?\n/gi,
    /INFORMAÇÕES ADICIONAIS:.*?\n/gi,
    /REGRAS OBRIGATÓRIAS:.*?\n/gi,
    /CAMPOS OPCIONAIS:.*?\n/gi,
    /PARCELAMENTO.*?:\s*.*?\n/gi,
    /GERE O ORÇAMENTO.*?\n/gi,
    /FORMATO PADRÃO.*?\n/gi
  ];
  
  cabecalhosRemover.forEach(regex => {
    limpo = limpo.replace(regex, '');
  });
  
  // Remover linhas em branco excessivas
  limpo = limpo.replace(/\n\s*\n\s*\n/g, '\n\n');
  limpo = limpo.replace(/^\s*\n+/, '');
  
  return limpo.trim();
}

function melhorarFormatacao(conteudo) {
  let melhorado = conteudo;
  
  // Garantir emojis nos cabeçalhos principais se não tiver
  if (!melhorado.includes('📍') && melhorado.includes('Destino')) {
    melhorado = melhorado.replace(/^(.+?-.*?)$/m, '📍 $1');
  }
  
  // Melhorar formatação de datas
  melhorado = melhorado.replace(/(\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2})/g, '🗓️ $1');
  
  // Melhorar formatação de preços
  melhorado = melhorado.replace(/(R\$\s*[\d.,]+)/g, '💰 $1');
  
  return melhorado;
}

// ================================================================================
// 🔍 ANÁLISE DE DADOS DA VIAGEM
// ================================================================================

function analisarDadosViagem(formData) {
  console.log("🔍 Analisando dados da viagem...");
  
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.toLowerCase();
  
  const analise = {
    temEscalas: detectarEscalas(textoCompleto),
    isIdaVolta: detectarIdaVolta(textoCompleto),
    temMultiplasOpcoes: detectarMultiplasOpcoes(textoCompleto),
    temPrecos: detectarPrecos(textoCompleto),
    complexidade: calcularComplexidade(formData)
  };
  
  console.log("📊 Análise completa:", analise);
  
  return analise;
}

function detectarEscalas(texto) {
  const indicadores = [
    'escala', 'conexão', 'conexao', 'parada em', 'via ',
    'troca em', 'com parada', 'escalas'
  ];
  
  return indicadores.some(indicador => texto.includes(indicador));
}

function detectarIdaVolta(texto) {
  const indicadores = [
    'ida e volta', 'round trip', 'retorno', 'volta em',
    'ida:', 'volta:', 'going:', 'return:'
  ];
  
  return indicadores.some(indicador => texto.includes(indicador));
}

function detectarMultiplasOpcoes(texto) {
  const indicadores = [
    'opção 1', 'opção 2', 'primeira opção', 'segunda opção',
    'hotel 1', 'hotel 2', 'voo 1', 'voo 2', 'alternativa'
  ];
  
  return indicadores.some(indicador => texto.includes(indicador));
}

function detectarPrecos(texto) {
  const regexPreco = /r\$\s*[\d.,]+/gi;
  return regexPreco.test(texto);
}

function calcularComplexidade(formData) {
  let pontos = 0;
  
  pontos += formData.tipos.length * 2; // Cada tipo adiciona complexidade
  pontos += formData.criancas * 3; // Crianças aumentam complexidade
  pontos += formData.temImagem ? 5 : 0; // Imagens são mais complexas
  pontos += formData.observacoes.length > 500 ? 3 : 0; // Textos longos
  
  if (pontos <= 5) return 'baixa';
  if (pontos <= 15) return 'média';
  return 'alta';
}

// ================================================================================
// 🎯 EXTRAÇÃO DE INFORMAÇÕES DO ORÇAMENTO
// ================================================================================

function extrairDestinoDoOrcamento(orcamento) {
  console.log("🎯 Extraindo destino do orçamento...");
  
  if (!orcamento) return '';
  
  // Tentar extrair destino do emoji 📍
  const regexDestino = /📍\s*([^-\n]+)/i;
  const match = orcamento.match(regexDestino);
  
  if (match) {
    return match[1].trim();
  }
  
  // Fallback: procurar por nomes de cidades conhecidas
  const destinosComuns = [
    'Orlando', 'Miami', 'Nova York', 'Paris', 'Londres', 'Roma',
    'Buenos Aires', 'Santiago', 'Lima', 'Bariloche', 'Mendoza',
    'Dubai', 'Lisboa', 'Madrid', 'Barcelona', 'Amsterdam'
  ];
  
  for (const destino of destinosComuns) {
    if (orcamento.toLowerCase().includes(destino.toLowerCase())) {
      return destino;
    }
  }
  
  console.log("⚠️ Destino não identificado automaticamente");
  return '';
}

// ================================================================================
// 📊 LOGS E MÉTRICAS
// ================================================================================

function logMetricasOrcamento(formData, resultado) {
  console.log("📊 Métricas do orçamento:");
  console.log("- Tipos:", formData.tipos.join(', '));
  console.log("- Destino:", formData.destino || 'Detectado automaticamente');
  console.log("- Adultos:", formData.adultos || 'Detectado automaticamente');
  console.log("- Crianças:", formData.criancas);
  console.log("- Tem imagem:", formData.temImagem ? 'Sim' : 'Não');
  console.log("- Parcelamento:", formData.parcelamento?.incluirParcelamento ? 'Sim' : 'Não');
  console.log("- Tamanho resultado:", resultado.length, 'caracteres');
}

console.log("✅ Módulo ai-orcamento.js carregado completamente!");
