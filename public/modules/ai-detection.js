// 🔍 ai-detection.js - Módulo de Detecção e Análise Inteligente
// Responsável por analisar o conteúdo e detectar padrões para aplicar templates corretos

console.log("🔍 Módulo de Detecção carregado");

// ================================================================================
// 🛫 DETECÇÃO DE IDA E VOLTA APRIMORADA
// ================================================================================

function detectIdaVolta(texto) {
  console.log("🛫 Analisando padrão Ida e Volta...");
  
  if (!texto || typeof texto !== 'string') {
    return false;
  }
  
  const textoLower = texto.toLowerCase();
  
  // 1. INDICADORES TEXTUAIS EXPLÍCITOS
  const indicadoresExplicitos = [
    'ida e volta', 'round trip', 'ida e retorno', 'viagem de ida e volta',
    'going and returning', 'outbound and return'
  ];
  
  if (indicadoresExplicitos.some(indicador => textoLower.includes(indicador))) {
    console.log("✅ Ida e volta detectado por indicador explícito");
    return true;
  }
  
  // 2. DETECÇÃO POR SEÇÕES "IDA" E "VOLTA"
  const temSecaoIda = /\b(ida|outbound|departure|going)\b[^\n]*:/i.test(texto);
  const temSecaoVolta = /\b(volta|return|retorno|coming back)\b[^\n]*:/i.test(texto);
  
  if (temSecaoIda && temSecaoVolta) {
    console.log("✅ Ida e volta detectado por seções separadas");
    return true;
  }
  
  // 3. DETECÇÃO POR DATAS DIFERENTES
  const datasCompletas = [...textoLower.matchAll(/(\d{1,2})\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/g)];
  const datasNumericas = [...textoLower.matchAll(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/g)];
  
  // Verifica datas por extenso diferentes
  if (datasCompletas.length >= 2) {
    const datas = datasCompletas.map(match => `${match[1]}-${match[2]}`);
    const datasUnicas = [...new Set(datas)];
    if (datasUnicas.length >= 2) {
      console.log("✅ Ida e volta detectado por datas diferentes (extenso):", datasUnicas);
      return true;
    }
  }
  
  // Verifica datas numéricas diferentes
  if (datasNumericas.length >= 2) {
    const datas = datasNumericas.map(match => `${match[1]}/${match[2]}`);
    const datasUnicas = [...new Set(datas)];
    if (datasUnicas.length >= 2) {
      console.log("✅ Ida e volta detectado por datas diferentes (numéricas):", datasUnicas);
      return true;
    }
  }
  
  // 4. DETECÇÃO POR PADRÕES DE VOO
  const padraoVooIdaVolta = /(ida|outbound).*?(volta|return|retorno)/i.test(texto);
  if (padraoVooIdaVolta) {
    console.log("✅ Ida e volta detectado por padrão de voo");
    return true;
  }
  
  // 5. DETECÇÃO POR MÚLTIPLAS REFERÊNCIAS TEMPORAIS
  const referenciasTempo = [
    ...textoLower.matchAll(/\b(segunda|terça|quarta|quinta|sexta|sábado|domingo)/g),
    ...textoLower.matchAll(/\b(\d{1,2})\s*(de|\/)\s*\w+/g)
  ];
  
  if (referenciasTempo.length >= 4) {
    console.log("✅ Ida e volta detectado por múltiplas referências temporais");
    return true;
  }
  
  console.log("❌ Ida e volta não detectado");
  return false;
}

// ================================================================================
// 🔢 DETECÇÃO DE MÚLTIPLAS OPÇÕES
// ================================================================================

function detectMultiplasOpcoes(texto) {
  console.log("🔢 Analisando múltiplas opções...");
  
  if (!texto || typeof texto !== 'string') {
    return { temMultiplasOpcoes: false, numeroOpcoes: 0 };
  }
  
  const textoLower = texto.toLowerCase();
  let numeroOpcoes = 0;
  
  // 1. DETECÇÃO POR NUMERAÇÃO EXPLÍCITA
  const opcoesNumeradas = [
    ...textoLower.matchAll(/\b(opção|option)\s*(\d+)/g),
    ...textoLower.matchAll(/\b(\d+)[ªº]?\s*(opção|option)/g),
    ...textoLower.matchAll(/\b(alternativa|alternative)\s*(\d+)/g)
  ];
  
  if (opcoesNumeradas.length >= 2) {
    numeroOpcoes = Math.max(numeroOpcoes, opcoesNumeradas.length);
    console.log("✅ Múltiplas opções detectadas por numeração:", numeroOpcoes);
  }
  
  // 2. DETECÇÃO POR MÚLTIPLOS VOOS/HOTÉIS
  const voosDetectados = [
    ...textoLower.matchAll(/\b(voo|flight)\s*\d+/g),
    ...textoLower.matchAll(/\b(companhia|airline)[^\n]*?(latam|gol|azul|american|delta|united)/g)
  ];
  
  const hoteisDetectados = [
    ...textoLower.matchAll(/\b(hotel|resort)\s*[a-z\s]{3,}/g),
    ...textoLower.matchAll(/\b\d+\s*estrelas?\b/g)
  ];
  
  if (voosDetectados.length >= 2 || hoteisDetectados.length >= 2) {
    numeroOpcoes = Math.max(numeroOpcoes, Math.max(voosDetectados.length, hoteisDetectados.length));
    console.log("✅ Múltiplas opções detectadas por serviços:", numeroOpcoes);
  }
  
  // 3. DETECÇÃO POR MÚLTIPLOS PREÇOS
  const precosDetectados = [...textoLower.matchAll(/r\$\s*[\d.,]+/g)];
  if (precosDetectados.length >= 3) { // Pelo menos 3 preços diferentes
    numeroOpcoes = Math.max(numeroOpcoes, Math.floor(precosDetectados.length / 2));
    console.log("✅ Múltiplas opções detectadas por preços:", numeroOpcoes);
  }
  
  // 4. DETECÇÃO POR ESTRUTURA DE COMPARAÇÃO
  const marcadoresComparacao = [
    ...textoLower.matchAll(/\bvs\b|\bou\b|\bmelhor\b|\bpior\b/g),
    ...textoLower.matchAll(/\b(mais barato|mais caro|econômico|premium)\b/g)
  ];
  
  if (marcadoresComparacao.length >= 2) {
    numeroOpcoes = Math.max(numeroOpcoes, 2);
    console.log("✅ Múltiplas opções detectadas por comparação");
  }
  
  const temMultiplasOpcoes = numeroOpcoes >= 2;
  
  console.log(`📊 Resultado: ${temMultiplasOpcoes ? numeroOpcoes + ' opções' : 'opção única'}`);
  
  return {
    temMultiplasOpcoes,
    numeroOpcoes: Math.min(numeroOpcoes, 5), // Máximo 5 opções
    numeroOpcoesDetectadas: numeroOpcoes
  };
}

// ================================================================================
// 🏷️ DETECÇÃO DE TIPO DE SERVIÇO
// ================================================================================

function detectTipoServico(texto, formData) {
  console.log("🏷️ Detectando tipo de serviço...");
  
  if (!texto || typeof texto !== 'string') {
    return { tipo: 'desconhecido', confianca: 0 };
  }
  
  const textoLower = texto.toLowerCase();
  const tiposFormulario = formData?.tipos?.map(t => t.toLowerCase()) || [];
  
  const detectores = {
    aereo: {
      keywords: ['voo', 'flight', 'aereo', 'avião', 'companhia aerea', 'latam', 'gol', 'azul', 'american', 'delta', 'united', 'emirates', 'lufthansa'],
      patterns: [/\b(cgr|gru|sdu|gig|bsb|cnf)\b/gi, /\b\d{2}:\d{2}\b/g],
      peso: 3
    },
    hotel: {
      keywords: ['hotel', 'resort', 'pousada', 'hospedagem', 'diarias', 'quarto', 'suite', 'apartamento', 'flat'],
      patterns: [/\b\d+\s*estrelas?\b/g, /\bcheck.?in\b|\bcheck.?out\b/gi],
      peso: 3
    },
    cruzeiro: {
      keywords: ['cruzeiro', 'cruise', 'navio', 'cabine', 'bordo', 'porto', 'embarcação'],
      patterns: [/\bcabine\s+(interna|externa|varanda|suite)\b/gi, /\b\d+\s*noites?\b/g],
      peso: 4
    },
    carro: {
      keywords: ['carro', 'rental', 'aluguel', 'locadora', 'veiculo', 'hertz', 'avis', 'localiza'],
      patterns: [/\b(sedan|hatch|suv|economico)\b/gi],
      peso: 2
    },
    seguro: {
      keywords: ['seguro', 'insurance', 'cobertura', 'assistencia', 'medical'],
      patterns: [/\busd?\s*[\d.,]+\b/gi],
      peso: 2
    }
  };
  
  let melhorTipo = 'desconhecido';
  let maiorPontuacao = 0;
  
  Object.entries(detectores).forEach(([tipo, config]) => {
    let pontuacao = 0;
    
    // Pontos por keywords
    config.keywords.forEach(keyword => {
      if (textoLower.includes(keyword)) {
        pontuacao += config.peso;
      }
    });
    
    // Pontos por patterns
    config.patterns.forEach(pattern => {
      const matches = texto.match(pattern) || [];
      pontuacao += matches.length * (config.peso / 2);
    });
    
    // Bonus se selecionado no formulário
    if (tiposFormulario.some(t => t.includes(tipo))) {
      pontuacao += 5;
    }
    
    console.log(`📊 ${tipo}: ${pontuacao} pontos`);
    
    if (pontuacao > maiorPontuacao) {
      maiorPontuacao = pontuacao;
      melhorTipo = tipo;
    }
  });
  
  const confianca = Math.min(maiorPontuacao / 10, 1); // Normaliza para 0-1
  
  console.log(`🎯 Tipo detectado: ${melhorTipo} (confiança: ${(confianca * 100).toFixed(1)}%)`);
  
  return {
    tipo: melhorTipo,
    confianca,
    pontuacao: maiorPontuacao
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE ESCALAS
// ================================================================================

function detectEscalas(texto) {
  console.log("🔍 Detectando escalas...");
  
  if (!texto || typeof texto !== 'string') {
    return { temEscalas: false, numeroEscalas: 0, aeroportos: [] };
  }
  
  const textoLower = texto.toLowerCase();
  
  // Keywords para escalas
  const keywordsEscalas = [
    'escala', 'conexão', 'conexao', 'parada em', 'via', 'connecting flight',
    'troca em', 'com parada', 'stopover', 'layover'
  ];
  
  const temIndicadorEscala = keywordsEscalas.some(keyword => textoLower.includes(keyword));
  
  // Detecção por múltiplos aeroportos em sequência
  const codigosAeroporto = [...texto.matchAll(/\b([A-Z]{3})\b/g)];
  const aeroportosUnicos = [...new Set(codigosAeroporto.map(match => match[1]))];
  
  // Se há mais de 2 aeroportos únicos, provavelmente há escalas
  const temMultiplosAeroportos = aeroportosUnicos.length > 2;
  
  const temEscalas = temIndicadorEscala || temMultiplosAeroportos;
  const numeroEscalas = temEscalas ? Math.max(1, aeroportosUnicos.length - 2) : 0;
  
  console.log(`🛫 Escalas: ${temEscalas ? 'Sim' : 'Não'} (${numeroEscalas} escalas detectadas)`);
  if (aeroportosUnicos.length > 0) {
    console.log(`✈️ Aeroportos: ${aeroportosUnicos.join(' → ')}`);
  }
  
  return {
    temEscalas,
    numeroEscalas,
    aeroportos: aeroportosUnicos
  };
}

// ================================================================================
// 🎯 ANÁLISE COMPLETA DE TEXTO
// ================================================================================

function analisarTextoCompleto(formData) {
  try {
    console.log("🎯 Iniciando análise completa do texto...");
    
    if (!formData) {
      console.error("❌ FormData não fornecido");
      return null;
    }
    
    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''}`;
    
    if (!textoCompleto.trim()) {
      console.warn("⚠️ Texto vazio para análise");
      return {
        isIdaVolta: false,
        temMultiplasOpcoes: false,
        numeroOpcoes: 1,
        tipoServico: { tipo: 'desconhecido', confianca: 0 },
        temEscalas: false,
        numeroEscalas: 0,
        aeroportos: [],
        complexidade: 'baixa'
      };
    }
    
    console.log(`📄 Analisando texto: ${textoCompleto.length} caracteres`);
    
    // Executa todas as detecções
    const isIdaVolta = detectIdaVolta(textoCompleto);
    const multiplasOpcoes = detectMultiplasOpcoes(textoCompleto);
    const tipoServico = detectTipoServico(textoCompleto, formData);
    const escalas = detectEscalas(textoCompleto);
    
    // Calcula complexidade
    const complexidade = calcularComplexidade(formData, {
      isIdaVolta,
      temMultiplasOpcoes: multiplasOpcoes.temMultiplasOpcoes,
      temEscalas: escalas.temEscalas,
      tipoServico: tipoServico.tipo
    });
    
    const analise = {
      // Detecções principais
      isIdaVolta,
      temMultiplasOpcoes: multiplasOpcoes.temMultiplasOpcoes,
      numeroOpcoes: multiplasOpcoes.numeroOpcoes,
      numeroOpcoesDetectadas: multiplasOpcoes.numeroOpcoesDetectadas,
      
      // Tipo de serviço
      tipoServico,
      
      // Escalas
      temEscalas: escalas.temEscalas,
      numeroEscalas: escalas.numeroEscalas,
      aeroportos: escalas.aeroportos,
      
      // Complexidade
      complexidade,
      
      // Metadados
      tamanhoTexto: textoCompleto.length,
      timestamp: new Date().toISOString()
    };
    
    console.log("✅ Análise completa finalizada:");
    console.log(`📊 Ida/Volta: ${isIdaVolta ? 'Sim' : 'Não'}`);
    console.log(`📊 Múltiplas opções: ${multiplasOpcoes.temMultiplasOpcoes ? multiplasOpcoes.numeroOpcoes : 'Não'}`);
    console.log(`📊 Tipo: ${tipoServico.tipo} (${(tipoServico.confianca * 100).toFixed(1)}%)`);
    console.log(`📊 Escalas: ${escalas.temEscalas ? escalas.numeroEscalas : 'Não'}`);
    console.log(`📊 Complexidade: ${complexidade}`);
    
    return analise;
    
  } catch (error) {
    console.error("❌ Erro na análise de texto:", error);
    return null;
  }
}

// ================================================================================
// 📊 CÁLCULO DE COMPLEXIDADE
// ================================================================================

function calcularComplexidade(formData, deteccoes) {
  let pontos = 0;
  
  // Pontos base
  pontos += formData.tipos?.length * 2 || 0;
  pontos += formData.criancas * 3 || 0;
  pontos += formData.temImagem ? 5 : 0;
  pontos += (formData.observacoes?.length > 500) ? 3 : 0;
  
  // Pontos por detecções
  pontos += deteccoes.isIdaVolta ? 3 : 0;
  pontos += deteccoes.temMultiplasOpcoes ? 5 : 0;
  pontos += deteccoes.temEscalas ? 2 : 0;
  
  // Pontos por tipo de serviço
  const complexidadeTipo = {
    'cruzeiro': 4,
    'aereo': 3,
    'hotel': 2,
    'carro': 1,
    'seguro': 1
  };
  pontos += complexidadeTipo[deteccoes.tipoServico] || 0;
  
  if (pontos <= 5) return 'baixa';
  if (pontos <= 15) return 'média';
  return 'alta';
}

// ================================================================================
// 📤 EXPORTAÇÃO COMPATÍVEL COM SISTEMA CVC
// ================================================================================

// Compatibilidade com sistema de módulos existente
if (typeof window !== 'undefined') {
  // Browser environment - adiciona ao objeto global
  window.analisarTextoCompleto = analisarTextoCompleto;
  window.detectIdaVolta = detectIdaVolta;
  window.detectMultiplasOpcoes = detectMultiplasOpcoes;
  window.detectTipoServico = detectTipoServico;
  window.detectEscalas = detectEscalas;
  window.calcularComplexidade = calcularComplexidade;
}

// Exportação para sistemas que suportam modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analisarTextoCompleto,
    detectIdaVolta,
    detectMultiplasOpcoes,
    detectTipoServico,
    detectEscalas,
    calcularComplexidade
  };
}

console.log("✅ Módulo ai-detection.js carregado e pronto para uso");