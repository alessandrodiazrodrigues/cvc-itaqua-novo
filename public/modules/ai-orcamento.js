// 💰 ai-orcamento.js - Módulo de Geração de Orçamentos v4.0
// Responsável por toda a lógica de criação de orçamentos com IA
// Integrado com: ai-detection.js, ai-templates.js, ai-prompts.js, ai-formatting.js

console.log("💰 Módulo de Orçamentos v4.0 carregado");

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE GERAÇÃO DE ORÇAMENTO
// ================================================================================

async function generateOrcamento(formData, analise) {
  console.log("🤖 Iniciando geração de orçamento v4.0...");
  
  try {
    showLoading("Analisando dados da viagem...");
    
    // ETAPA 1: ANÁLISE COMPLETA DOS DADOS
    let analiseCompleta = analise;
    if (typeof analisarTextoCompleto === 'function') {
      console.log("🔍 Usando análise avançada...");
      analiseCompleta = analisarTextoCompleto(formData) || analise;
    } else {
      console.warn("⚠️ Módulo ai-detection.js não disponível - usando análise básica");
      analiseCompleta = analisarDadosViagem(formData);
    }
    
    showLoading("Gerando prompt otimizado...");
    
    // ETAPA 2: GERAR PROMPT OTIMIZADO
    let prompt;
    if (typeof gerarPromptOtimizado === 'function') {
      console.log("🎯 Usando sistema de prompts avançado...");
      prompt = gerarPromptOtimizado(formData, analiseCompleta);
    } else if (typeof aplicarTemplate === 'function') {
      console.log("📋 Usando sistema de templates...");
      prompt = aplicarTemplate(formData, analiseCompleta);
    } else {
      console.warn("⚠️ Módulos ai-prompts.js e ai-templates.js não disponíveis - usando prompt básico");
      prompt = construirPromptOrcamento(formData, analiseCompleta);
    }
    
    if (!prompt) {
      throw new Error("Falha na geração do prompt");
    }
    
    showLoading("Enviando para IA...");
    
    // ETAPA 3: CHAMAR API
    const response = await callOrcamentoAPI(prompt, formData, analiseCompleta);
    
    showLoading("Processando resposta...");
    
    // ETAPA 4: PROCESSAR RESPOSTA
    const orcamento = processarRespostaOrcamento(response, analiseCompleta);
    
    // ETAPA 5: ATUALIZAR INTERFACE
    updateElement("orcamentoIA", orcamento);
    
    // ETAPA 6: SALVAR NO ESTADO GLOBAL
    estadoGlobal.ultimoOrcamento = orcamento;
    estadoGlobal.ultimoDestino = extrairDestinoDoOrcamento(orcamento);
    estadoGlobal.ultimaAnalise = analiseCompleta;
    
    // ETAPA 7: LOGS E MÉTRICAS
    logMetricasOrcamento(formData, orcamento, analiseCompleta);
    
    console.log("✅ Orçamento v4.0 gerado com sucesso!");
    
    return orcamento;
    
  } catch (error) {
    console.error("❌ Erro na geração do orçamento v4.0:", error);
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

async function callOrcamentoAPI(prompt, formData, analise) {
  console.log("🔄 Enviando para API v4.0...");
  
  // Determinar complexidade e ajustar parâmetros
  const complexidade = analise?.complexidade || 'média';
  const maxTokens = complexidade === 'alta' ? 3000 : complexidade === 'média' ? 2000 : 1500;
  
  const requestData = {
    prompt: prompt,
    tipo: 'orcamento',
    modelo: 'gpt-4o-mini', // Modelo padrão
    maxTokens: maxTokens,
    metadata: {
      tipos: formData.tipos,
      destino: formData.destino,
      temImagem: formData.temImagem,
      versao: '4.0',
      analise: {
        isIdaVolta: analise?.isIdaVolta || false,
        temMultiplasOpcoes: analise?.temMultiplasOpcoes || false,
        tipoServico: analise?.tipoServico?.tipo || 'desconhecido',
        complexidade: complexidade,
        temEscalas: analise?.temEscalas || false
      },
      timestamp: new Date().toISOString()
    }
  };
  
  console.log("📊 Request metadata:", requestData.metadata);
  
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
  console.log("✅ Resposta da API v4.0 recebida");
  
  return data;
}

// ================================================================================
// 🧹 PROCESSAMENTO DA RESPOSTA
// ================================================================================

function processarRespostaOrcamento(response, analise) {
  console.log("🧹 Processando resposta da API v4.0...");
  
  if (!response || !response.choices || !response.choices[0]) {
    throw new Error('Resposta da API em formato inválido');
  }
  
  let conteudo = response.choices[0].message?.content || '';
  
  if (!conteudo.trim()) {
    throw new Error('Conteúdo da resposta está vazio');
  }
  
  console.log("📊 Conteúdo original:", conteudo.length, "caracteres");
  
  // ETAPA 1: LIMPEZA BÁSICA
  conteudo = limparCabecalhosTecnicos(conteudo);
  
  // ETAPA 2: FORMATAÇÃO AVANÇADA (PRIORIDADE)
  if (typeof formatText === 'function') {
    console.log("🎨 Aplicando formatação avançada do ai-formatting.js...");
    conteudo = formatText(conteudo);
  } else {
    console.warn("⚠️ Módulo ai-formatting.js não disponível - usando formatação básica");
    conteudo = melhorarFormatacao(conteudo);
  }
  
  // ETAPA 3: VALIDAÇÕES ESPECÍFICAS BASEADAS NA ANÁLISE
  if (analise) {
    conteudo = aplicarValidacoesEspecificas(conteudo, analise);
  }
  
  console.log("✅ Orçamento v4.0 processado:", conteudo.length, "caracteres");
  
  return conteudo;
}

function aplicarValidacoesEspecificas(conteudo, analise) {
  console.log("🔍 Aplicando validações específicas...");
  
  // Se foi detectado ida e volta, garantir que há seções separadas
  if (analise.isIdaVolta && !conteudo.includes('IDA') && !conteudo.includes('VOLTA')) {
    console.log("⚠️ Ida e volta detectado mas não formatado corretamente");
  }
  
  // Se há múltiplas opções, garantir numeração
  if (analise.temMultiplasOpcoes && !conteudo.includes('OPÇÃO')) {
    console.log("⚠️ Múltiplas opções detectadas mas não numeradas");
  }
  
  // Se há escalas, verificar se foram mencionadas
  if (analise.temEscalas && !conteudo.toLowerCase().includes('escala') && !conteudo.toLowerCase().includes('conexão')) {
    console.log("⚠️ Escalas detectadas mas não mencionadas no orçamento");
  }
  
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
  console.log("🔍 Analisando dados da viagem (modo fallback)...");
  
  const textoCompleto = `${formData.observacoes} ${formData.textoColado}`.toLowerCase();
  
  const analise = {
    temEscalas: detectarEscalas(textoCompleto),
    isIdaVolta: detectarIdaVolta(textoCompleto),
    temMultiplasOpcoes: detectarMultiplasOpcoes(textoCompleto),
    temPrecos: detectarPrecos(textoCompleto),
    complexidade: calcularComplexidade(formData),
    
    // Campos adicionais para compatibilidade com v4.0
    numeroOpcoes: detectarMultiplasOpcoes(textoCompleto) ? 2 : 1,
    tipoServico: {
      tipo: determinarTipoServico(formData),
      confianca: 0.7
    },
    numeroEscalas: detectarEscalas(textoCompleto) ? 1 : 0,
    aeroportos: extrairAeroportos(textoCompleto)
  };
  
  console.log("📊 Análise completa (fallback):", analise);
  
  return analise;
}

function determinarTipoServico(formData) {
  if (formData.tipos.some(t => t.toLowerCase().includes('aereo'))) return 'aereo';
  if (formData.tipos.some(t => t.toLowerCase().includes('hotel'))) return 'hotel';
  if (formData.tipos.some(t => t.toLowerCase().includes('cruzeiro'))) return 'cruzeiro';
  if (formData.tipos.some(t => t.toLowerCase().includes('carro'))) return 'carro';
  return 'misto';
}

function extrairAeroportos(texto) {
  const codigosAeroporto = [...texto.matchAll(/\b([A-Z]{3})\b/g)];
  return [...new Set(codigosAeroporto.map(match => match[1]))];
}

function detectarEscalas(texto) {
  const indicadores = [
    'escala', 'conexão', 'conexao', 'parada em', 'via ',
    'troca em', 'com parada', 'escalas'
  ];
  
  return indicadores.some(indicador => texto.includes(indicador));
}

function detectarIdaVolta(texto) {
  // ================================================================================
  // 📅 DETECÇÃO APRIMORADA DE IDA E VOLTA
  // ================================================================================
  
  // 1. INDICADORES TRADICIONAIS
  const indicadoresTexto = [
    'ida e volta', 'round trip', 'retorno', 'volta em',
    'ida:', 'volta:', 'going:', 'return:', 'ida e retorno',
    'viagem de volta', 'retorno em', 'volta no dia'
  ];
  
  // Se encontrar indicadores claros, é ida e volta
  if (indicadoresTexto.some(indicador => texto.includes(indicador))) {
    return true;
  }
  
  // 2. DETECÇÃO POR DATAS DIFERENTES
  // Busca padrões como: "17 de janeiro" e "23 de janeiro"
  const regexDataCompleta = /(\d{1,2})\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/gi;
  const datasEncontradas = [...texto.matchAll(regexDataCompleta)];
  
  if (datasEncontradas.length >= 2) {
    // Se há 2 ou mais datas diferentes, provavelmente é ida e volta
    const datas = datasEncontradas.map(match => ({
      dia: parseInt(match[1]),
      mes: match[2].toLowerCase()
    }));
    
    // Verifica se há datas diferentes
    const temDatasDiferentes = datas.some((data, index) => 
      datas.some((outraData, outroIndex) => 
        index !== outroIndex && 
        (data.dia !== outraData.dia || data.mes !== outraData.mes)
      )
    );
    
    if (temDatasDiferentes) {
      console.log('🔍 Detectado ida e volta por datas diferentes:', datas);
      return true;
    }
  }
  
  // 3. DETECÇÃO POR DATAS NUMÉRICAS
  // Busca padrões como: "17/01" e "23/01" ou "17/01/2024" e "23/01/2024"
  const regexDataNumerica = /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/g;
  const datasNumericas = [...texto.matchAll(regexDataNumerica)];
  
  if (datasNumericas.length >= 2) {
    const datasNum = datasNumericas.map(match => ({
      dia: parseInt(match[1]),
      mes: parseInt(match[2]),
      ano: match[3] ? parseInt(match[3]) : null
    }));
    
    // Remove duplicatas e verifica se há datas diferentes
    const datasUnicas = datasNum.filter((data, index, arr) => 
      arr.findIndex(d => d.dia === data.dia && d.mes === data.mes) === index
    );
    
    if (datasUnicas.length >= 2) {
      console.log('🔍 Detectado ida e volta por datas numéricas diferentes:', datasUnicas);
      return true;
    }
  }
  
  // 4. DETECÇÃO POR PALAVRAS-CHAVE COM CONTEXTO
  const contextosIdaVolta = [
    // Padrões que indicam duas datas/momentos
    /ida.*(\d{1,2}.*(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)).*volta.*(\d{1,2}.*(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro))/i,
    /partida.*(\d{1,2}\/\d{1,2}).*retorno.*(\d{1,2}\/\d{1,2})/i,
    /saída.*(\d{1,2}).*chegada.*(\d{1,2})/i,
    /voo.*ida.*voo.*volta/i,
    /going.*(\d{1,2}).*coming.*(\d{1,2})/i
  ];
  
  const temContextoIdaVolta = contextosIdaVolta.some(regex => regex.test(texto));
  
  if (temContextoIdaVolta) {
    console.log('🔍 Detectado ida e volta por contexto de viagem');
    return true;
  }
  
  // 5. DETECÇÃO POR MÚLTIPLAS REFERÊNCIAS TEMPORAIS
  const referencesTemporais = [
    /\b(\d{1,2})\s*(de\s*)?(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/gi,
    /\b(\d{1,2})\/(\d{1,2})\b/g,
    /\b(segunda|terça|quarta|quinta|sexta|sábado|domingo)/gi
  ];
  
  let totalReferencias = 0;
  for (const regex of referencesTemporais) {
    const matches = [...texto.matchAll(regex)];
    totalReferencias += matches.length;
  }
  
  // Se há muitas referências temporais, provavelmente tem ida e volta
  if (totalReferencias >= 4) {
    console.log('🔍 Detectado ida e volta por múltiplas referências temporais:', totalReferencias);
    return true;
  }
  
  return false;
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

function logMetricasOrcamento(formData, resultado, analise) {
  console.log("📊 Métricas do orçamento v4.0:");
  console.log("- Tipos:", formData.tipos.join(', '));
  console.log("- Destino:", formData.destino || 'Detectado automaticamente');
  console.log("- Adultos:", formData.adultos || 'Detectado automaticamente');
  console.log("- Crianças:", formData.criancas);
  console.log("- Tem imagem:", formData.temImagem ? 'Sim' : 'Não');
  console.log("- Parcelamento:", formData.parcelamento?.incluirParcelamento ? 'Sim' : 'Não');
  console.log("- Tamanho resultado:", resultado.length, 'caracteres');
  
  if (analise) {
    console.log("\n🔍 Análise avançada:");
    console.log("- Ida e volta:", analise.isIdaVolta ? 'Sim' : 'Não');
    console.log("- Múltiplas opções:", analise.temMultiplasOpcoes ? `Sim (${analise.numeroOpcoes})` : 'Não');
    console.log("- Tipo de serviço:", analise.tipoServico?.tipo || 'Não detectado');
    console.log("- Confiança tipo:", analise.tipoServico?.confianca ? `${(analise.tipoServico.confianca * 100).toFixed(1)}%` : 'N/A');
    console.log("- Escalas:", analise.temEscalas ? `Sim (${analise.numeroEscalas})` : 'Não');
    console.log("- Aeroportos:", analise.aeroportos?.join(', ') || 'Nenhum');
    console.log("- Complexidade:", analise.complexidade || 'N/A');
  }
}

function logCompatibilidadeModulos() {
  console.log("\n🔧 Status dos módulos integrados:");
  console.log("- ai-detection.js:", typeof analisarTextoCompleto === 'function' ? '✅ Carregado' : '❌ Não disponível');
  console.log("- ai-templates.js:", typeof aplicarTemplate === 'function' ? '✅ Carregado' : '❌ Não disponível');
  console.log("- ai-prompts.js:", typeof gerarPromptOtimizado === 'function' ? '✅ Carregado' : '❌ Não disponível');
  console.log("- ai-formatting.js:", typeof formatText === 'function' ? '✅ Carregado' : '❌ Não disponível');
}

// Executar verificação de compatibilidade automaticamente
if (typeof window !== 'undefined') {
  setTimeout(logCompatibilidadeModulos, 500);
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE PARA DETECÇÃO DE IDA E VOLTA
// ================================================================================

function testarDeteccaoIdaVolta() {
  console.log("🧪 Testando detecção de ida e volta...");
  
  const exemplos = [
    // Casos que DEVEM ser detectados como ida e volta
    {
      texto: "Viagem para Orlando, ida 17 de janeiro e volta 23 de janeiro",
      esperado: true,
      caso: "Datas diferentes no mesmo mês"
    },
    {
      texto: "Partida 15/03/2024 retorno 22/03/2024",
      esperado: true,
      caso: "Datas numéricas diferentes"
    },
    {
      texto: "Ida e volta para Miami",
      esperado: true,
      caso: "Indicador tradicional"
    },
    {
      texto: "Voo de ida no dia 10 de março, voo de volta dia 17 de março",
      esperado: true,
      caso: "Contexto com datas"
    },
    {
      texto: "Round trip to Paris, going 5th returning 12th",
      esperado: true,
      caso: "Inglês com datas"
    },
    
    // Casos que NÃO devem ser detectados como ida e volta
    {
      texto: "Viagem somente de ida para São Paulo no dia 20 de janeiro",
      esperado: false,
      caso: "Somente ida - uma data"
    },
    {
      texto: "Preciso de passagem para o Rio, saindo segunda-feira",
      esperado: false,
      caso: "Uma referência temporal apenas"
    }
  ];
  
  let acertos = 0;
  let total = exemplos.length;
  
  exemplos.forEach((exemplo, index) => {
    const resultado = detectarIdaVolta(exemplo.texto.toLowerCase());
    const correto = resultado === exemplo.esperado;
    
    console.log(`${correto ? '✅' : '❌'} Teste ${index + 1}: ${exemplo.caso}`);
    console.log(`   Texto: "${exemplo.texto}"`);
    console.log(`   Esperado: ${exemplo.esperado}, Resultado: ${resultado}`);
    
    if (correto) acertos++;
  });
  
  console.log(`\n📊 Resultado final: ${acertos}/${total} testes corretos (${Math.round((acertos/total)*100)}%)`);
  
  return { acertos, total, porcentagem: Math.round((acertos/total)*100) };
}

// Executar teste automaticamente em desenvolvimento
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Aguarda 1 segundo para carregar completamente e depois testa
  setTimeout(() => {
    testarDeteccaoIdaVolta();
  }, 1000);
}

console.log("✅ Módulo ai-orcamento.js v4.0 carregado completamente!");
console.log("🔗 Integração com: ai-detection, ai-templates, ai-prompts, ai-formatting");
