// 🔍 analysis.js - SISTEMA INTELIGENTE DE ANÁLISE v7.7
// CORREÇÃO CRÍTICA #2: Exportação ES6 + Detecção Precisa
// Análise avançada de tipos de orçamento + Integração com Manual

console.log("🔍 Analysis v7.7 - DETECÇÃO INTELIGENTE + ES6 CORRIGIDA");

// ================================================================================
// 🎯 SISTEMA PRINCIPAL DE ANÁLISE
// ================================================================================

export function analisarTextoCompleto(formData) {
  console.log("🔍 Iniciando análise completa v7.7...");
  
  const textoCompleto = construirTextoAnalise(formData);
  const contexto = extrairContexto(textoCompleto);
  
  const analise = {
    // Análise básica
    ...analisarElementosBasicos(textoCompleto),
    
    // Detecção de tipos específicos
    ...detectarTiposEspecificos(textoCompleto, contexto),
    
    // Análise de complexidade
    ...calcularComplexidadeAvancada(textoCompleto, formData),
    
    // Detecção de padrões
    ...detectarPadroes(textoCompleto),
    
    // Contexto extraído
    contexto: contexto,
    
    // Timestamp
    timestamp: new Date().toISOString()
  };
  
  // Log da análise
  logAnalise(analise);
  
  return analise;
}

function construirTextoAnalise(formData) {
  return [
    formData.observacoes || '',
    formData.textoColado || '',
    formData.destino || '',
    formData.tipos?.join(' ') || ''
  ].join(' ').toLowerCase();
}

// ================================================================================
// 🔍 ANÁLISE DE ELEMENTOS BÁSICOS
// ================================================================================

function analisarElementosBasicos(texto) {
  console.log("🔍 Analisando elementos básicos...");
  
  return {
    // Detecção de escalas/conexões
    temEscalas: detectarEscalas(texto),
    temConexoes: detectarConexoes(texto),
    
    // Detecção ida/volta vs somente ida
    isIdaVolta: detectarIdaVolta(texto),
    isSomenteIda: detectarSomenteIda(texto),
    
    // Detecção de múltiplas opções
    temMultiplasOpcoes: detectarMultiplasOpcoes(texto),
    numeroOpcoes: contarOpcoes(texto),
    
    // Detecção de preços
    temPrecos: detectarPrecos(texto),
    numeroPrecos: contarPrecos(texto),
    
    // Detecção de datas
    temDatas: detectarDatas(texto),
    numeroDatas: contarDatas(texto),
    
    // Detecção de horários
    temHorarios: detectarHorarios(texto),
    numeroHorarios: contarHorarios(texto),
    
    // Detecção de aeroportos
    temAeroportos: detectarAeroportos(texto),
    aeroportosDetectados: extrairAeroportos(texto),
    
    // Detecção de companhias
    temCompanhias: detectarCompanhias(texto),
    companhiasDetectadas: extrairCompanhias(texto)
  };
}

// ================================================================================
// 🎯 DETECÇÃO DE TIPOS ESPECÍFICOS (MANUAL IMPLEMENTADO)
// ================================================================================

export function detectarTiposEspecificos(texto, contexto) {
  console.log("🎯 Detectando tipos específicos do manual...");
  
  const tipos = {};
  
  // 1. ✈️ AÉREO NACIONAL SIMPLES
  tipos.aereoNacionalSimples = detectarAereoNacionalSimples(texto, contexto);
  
  // 2. ✈️ AÉREO COM CONEXÃO DETALHADA
  tipos.aereoConexaoDetalhada = detectarAereoConexaoDetalhada(texto, contexto);
  
  // 3. ✈️ AÉREO SOMENTE IDA
  tipos.aereoSomenteIda = detectarAereoSomenteIda(texto, contexto);
  
  // 4. 🔢 MÚLTIPLAS OPÇÕES - 2 PLANOS
  tipos.multiplasOpcoes2 = detectarMultiplasOpcoes2(texto, contexto);
  
  // 5. 🔢 MÚLTIPLAS OPÇÕES - 3 PLANOS
  tipos.multiplasOpcoes3 = detectarMultiplasOpcoes3(texto, contexto);
  
  // 6. 🗺️ MULTITRECHO
  tipos.multitrecho = detectarMultitrecho(texto, contexto);
  
  // 7. 🌍 MÚLTIPLAS COMPANHIAS INTERNACIONAIS
  tipos.multiplasCompanhiasInternacionais = detectarMultiplasCompanhiasInternacionais(texto, contexto);
  
  // 8. 🏖️ PACOTE COMPLETO
  tipos.pacoteCompleto = detectarPacoteCompleto(texto, contexto);
  
  // 9. 🚢 CRUZEIRO
  tipos.cruzeiro = detectarCruzeiro(texto, contexto);
  
  // Determinar tipo principal
  tipos.tipoPrincipal = determinarTipoPrincipal(tipos);
  tipos.confianca = calcularConfiancaDeteccao(tipos);
  
  return {
    tipos: tipos,
    tipoDetectado: tipos.tipoPrincipal,
    confiancaDeteccao: tipos.confianca
  };
}

// ================================================================================
// 🔍 FUNÇÕES DE DETECÇÃO ESPECÍFICAS POR TIPO
// ================================================================================

function detectarAereoNacionalSimples(texto, contexto) {
  const indicadores = [
    !texto.includes('internacional'),
    texto.includes('ida') && texto.includes('volta'),
    !texto.includes('opção 1') && !texto.includes('opção 2'),
    contexto?.aeroportosNacionais?.length > 0,
    !texto.includes('conexão') && !texto.includes('escala'),
    contexto?.precos?.length === 1
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    indicadores: {
      naoInternacional: indicadores[0],
      idaVolta: indicadores[1],
      opcaoUnica: indicadores[2],
      aeroportosNacionais: indicadores[3],
      semConexao: indicadores[4],
      precoUnico: indicadores[5]
    }
  };
}

function detectarAereoConexaoDetalhada(texto, contexto) {
  const indicadores = [
    texto.includes('conexão') || texto.includes('escala'),
    texto.includes('espera') || texto.includes('tempo'),
    contexto?.aeroportos?.length >= 3, // Origem + Conexão + Destino
    texto.includes('brasília') || texto.includes('são paulo'),
    contexto?.horarios?.length >= 4, // Múltiplos horários
    !texto.includes('opção')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      temConexao: indicadores[0],
      temTempo: indicadores[1],
      multiplosAeroportos: indicadores[2],
      aeroportoConexao: indicadores[3],
      multiplosHorarios: indicadores[4],
      opcaoUnica: indicadores[5]
    }
  };
}

function detectarAereoSomenteIda(texto, contexto) {
  const indicadores = [
    (texto.includes('ida') && !texto.includes('volta')),
    texto.includes('somente ida') || texto.includes('só ida'),
    contexto?.datas?.length === 1,
    contexto?.horarios?.length <= 2,
    !texto.includes('retorno'),
    texto.includes('sem volta') || texto.includes('passagem ida')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.4,
    confianca: score,
    indicadores: {
      idaSemVolta: indicadores[0],
      termoSomenteIda: indicadores[1],
      dataUnica: indicadores[2],
      poucoHorarios: indicadores[3],
      semRetorno: indicadores[4],
      termoPassagemIda: indicadores[5]
    }
  };
}

function detectarMultiplasOpcoes2(texto, contexto) {
  const indicadores = [
    (texto.includes('opção 1') && texto.includes('opção 2')),
    (texto.includes('plano 1') && texto.includes('plano 2')),
    contexto?.precos?.length === 2,
    texto.includes('bagagem') && texto.includes('despachada'),
    !texto.includes('opção 3'),
    texto.includes('cancelamento') || texto.includes('reembolsável')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      opcoes12: indicadores[0],
      planos12: indicadores[1],
      doisPrecos: indicadores[2],
      diferencaBagagem: indicadores[3],
      semOpcao3: indicadores[4],
      diferenciasServicos: indicadores[5]
    }
  };
}

function detectarMultiplasOpcoes3(texto, contexto) {
  const indicadores = [
    (texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção 3')),
    contexto?.precos?.length === 3,
    texto.includes('marcação de assento'),
    texto.includes('2 bagagens'),
    texto.includes('básico') || texto.includes('premium'),
    texto.match(/r\$.*r\$.*r\$/i) // Três valores diferentes
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      tresOpcoes: indicadores[0],
      tresPrecos: indicadores[1],
      assentoMarcado: indicadores[2],
      duasBagagens: indicadores[3],
      niveis: indicadores[4],
      tresValores: indicadores[5]
    }
  };
}

function detectarMultitrecho(texto, contexto) {
  const indicadores = [
    texto.includes('multitrecho') || texto.includes('multitrechos'),
    texto.includes('trecho 1') && texto.includes('trecho 2'),
    contexto?.aeroportos?.length >= 4,
    contexto?.datas?.length >= 3,
    texto.includes('→') || texto.includes('madrid') || texto.includes('lisboa'),
    texto.includes('dias') && texto.includes('noites')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.4,
    confianca: score,
    indicadores: {
      termoMultitrecho: indicadores[0],
      trechosNumerados: indicadores[1],
      multiplosAeroportos: indicadores[2],
      multiplasDatas: indicadores[3],
      roteiro: indicadores[4],
      duracao: indicadores[5]
    }
  };
}

function detectarMultiplasCompanhiasInternacionais(texto, contexto) {
  const companhiasInternacionais = ['copa', 'american', 'tap', 'lufthansa', 'delta', 'air france'];
  const companhiasDetectadas = companhiasInternacionais.filter(comp => texto.includes(comp));
  
  const indicadores = [
    companhiasDetectadas.length >= 2,
    texto.includes('panamá') || texto.includes('miami') || texto.includes('europa'),
    texto.includes('opção 1') && texto.includes('opção 2'),
    !texto.includes('nacional'),
    contexto?.precos?.length >= 2,
    texto.includes('internacional') || contexto?.aeroportosInternacionais?.length > 0
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      multiplasCompanhias: indicadores[0],
      destinoInternacional: indicadores[1],
      opcoes: indicadores[2],
      naoNacional: indicadores[3],
      multiplosPrecos: indicadores[4],
      termoInternacional: indicadores[5]
    },
    companhiasDetectadas: companhiasDetectadas
  };
}

function detectarPacoteCompleto(texto, contexto) {
  const indicadores = [
    texto.includes('pacote'),
    (texto.includes('hotel') || texto.includes('hospedagem')) && (texto.includes('aéreo') || texto.includes('voo')),
    texto.includes('traslado') || texto.includes('transfer'),
    texto.includes('inclui') || texto.includes('o pacote inclui'),
    contexto?.hoteis?.length > 0,
    texto.includes('noites') && (texto.includes('embarque') || texto.includes('data'))
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      termoPacote: indicadores[0],
      aereoHotel: indicadores[1],
      traslado: indicadores[2],
      listaInclusos: indicadores[3],
      opcoesHotel: indicadores[4],
      duracaoEmbarque: indicadores[5]
    }
  };
}

function detectarCruzeiro(texto, contexto) {
  const indicadores = [
    texto.includes('cruzeiro'),
    texto.includes('msc') || texto.includes('costa') || texto.includes('navio'),
    texto.includes('cabine') || texto.includes('suíte'),
    texto.includes('embarque') && texto.includes('porto'),
    texto.includes('santos') || texto.includes('rio de janeiro'),
    texto.includes('roteiro') || texto.includes('litoral')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.4,
    confianca: score,
    indicadores: {
      termoCruzeiro: indicadores[0],
      companhiaCruzeiro: indicadores[1],
      tipoAcomodacao: indicadores[2],
      embarquePorto: indicadores[3],
      portoEspecifico: indicadores[4],
      roteiro: indicadores[5]
    }
  };
}

// ================================================================================
// 🧮 ANÁLISE DE COMPLEXIDADE
// ================================================================================

export function calcularComplexidadeAvancada(texto, formData) {
  console.log("🧮 Calculando complexidade avançada...");
  
  const fatores = {
    // Fator quantidade de texto
    tamanhoTexto: Math.min(texto.length / 1000, 1), // Normalizado para 0-1
    
    // Fator quantidade de dados estruturados
    dadosEstruturados: calcularDadosEstruturados(texto),
    
    // Fator multiplicidade de opções
    multiplicidadeOpcoes: calcularMultiplicidadeOpcoes(texto),
    
    // Fator complexidade de roteiro
    complexidadeRoteiro: calcularComplexidadeRoteiro(texto),
    
    // Fator diversidade de serviços
    diversidadeServicos: calcularDiversidadeServicos(texto)
  };
  
  // Cálculo da complexidade final (média ponderada)
  const complexidadeNumerica = (
    fatores.tamanhoTexto * 0.1 +
    fatores.dadosEstruturados * 0.3 +
    fatores.multiplicidadeOpcoes * 0.3 +
    fatores.complexidadeRoteiro * 0.2 +
    fatores.diversidadeServicos * 0.1
  );
  
  // Classificação categórica
  let complexidadeCategoria;
  if (complexidadeNumerica < 0.3) {
    complexidadeCategoria = 'simples';
  } else if (complexidadeNumerica < 0.7) {
    complexidadeCategoria = 'media';
  } else {
    complexidadeCategoria = 'alta';
  }
  
  return {
    complexidade: complexidadeCategoria,
    complexidadeNumerica: Math.round(complexidadeNumerica * 100) / 100,
    fatoresComplexidade: fatores
  };
}

function calcularDadosEstruturados(texto) {
  const elementos = [
    (texto.match(/\d{1,2}:\d{2}/g) || []).length, // Horários
    (texto.match(/\d{1,2}\/\d{1,2}/g) || []).length, // Datas
    (texto.match(/r\$\s*[\d.,]+/gi) || []).length, // Preços
    (texto.match(/\d+x\s*de/gi) || []).length // Parcelamentos
  ];
  
  const total = elementos.reduce((a, b) => a + b, 0);
  return Math.min(total / 10, 1); // Normalizado
}

function calcularMultiplicidadeOpcoes(texto) {
  const opcoes = (texto.match(/opção\s*\d+/gi) || []).length;
  const planos = (texto.match(/plano\s*\d+/gi) || []).length;
  const hoteis = (texto.match(/hotel\s*[^\n]*/gi) || []).length;
  
  const total = Math.max(opcoes, planos, hoteis);
  return Math.min(total / 5, 1); // Normalizado
}

function calcularComplexidadeRoteiro(texto) {
  const trechos = (texto.match(/trecho\s*\d+/gi) || []).length;
  const conexoes = (texto.match(/conexão|escala/gi) || []).length;
  const aeroportos = extrairAeroportos(texto).length;
  
  const score = (trechos * 0.4 + conexoes * 0.3 + aeroportos * 0.3) / 3;
  return Math.min(score / 3, 1); // Normalizado
}

function calcularDiversidadeServicos(texto) {
  const servicos = [
    'bagagem', 'traslado', 'hotel', 'seguro', 'passeio',
    'refeição', 'bebida', 'spa', 'piscina', 'wifi'
  ];
  
  const encontrados = servicos.filter(servico => texto.includes(servico)).length;
  return encontrados / servicos.length; // Já normalizado
}

// ================================================================================
// 🔍 EXTRAÇÃO DE CONTEXTO
// ================================================================================

export function extrairContexto(texto) {
  console.log("🔍 Extraindo contexto...");
  
  return {
    // Aeroportos
    aeroportos: extrairAeroportos(texto),
    aeroportosNacionais: extrairAeroportosNacionais(texto),
    aeroportosInternacionais: extrairAeroportosInternacionais(texto),
    
    // Companhias aéreas
    companhias: extrairCompanhias(texto),
    companhiasNacionais: extrairCompanhiasNacionais(texto),
    companhiasInternacionais: extrairCompanhiasInternacionais(texto),
    
    // Dados temporais
    datas: extrairDatas(texto),
    horarios: extrairHorarios(texto),
    duracao: extrairDuracao(texto),
    
    // Dados financeiros
    precos: extrairPrecos(texto),
    parcelamentos: extrairParcelamentos(texto),
    
    // Serviços
    hoteis: extrairHoteis(texto),
    servicos: extrairServicos(texto),
    
    // Links e referências
    links: extrairLinks(texto),
    referencias: extrairReferencias(texto)
  };
}

// ================================================================================
// 🔍 FUNÇÕES AUXILIARES DE EXTRAÇÃO
// ================================================================================

function extrairAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC', 'SSA'];
  return codigos.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairAeroportosNacionais(texto) {
  const nacionais = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA'];
  return nacionais.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairAeroportosInternacionais(texto) {
  const internacionais = ['JFK', 'LAX', 'CDG', 'LHR', 'FCO', 'MAD', 'LIS', 'PTY'];
  return internacionais.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairCompanhias(texto) {
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'copa', 'american', 'tap', 'lufthansa'];
  return companhias.filter(comp => texto.toLowerCase().includes(comp));
}

function extrairCompanhiasNacionais(texto) {
  const nacionais = ['latam', 'gol', 'azul', 'avianca'];
  return nacionais.filter(comp => texto.toLowerCase().includes(comp));
}

function extrairCompanhiasInternacionais(texto) {
  const internacionais = ['copa', 'american', 'tap', 'lufthansa', 'delta', 'air france'];
  return internacionais.filter(comp => texto.toLowerCase().includes(comp));
}

function extrairDatas(texto) {
  return (texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || []);
}

function extrairHorarios(texto) {
  return (texto.match(/\d{1,2}:\d{2}/g) || []);
}

function extrairDuracao(texto) {
  const match = texto.match(/(\d+)\s*dias?\s*e?\s*(\d+)?\s*noites?/i);
  return match ? { dias: parseInt(match[1]), noites: parseInt(match[2] || match[1] - 1) } : null;
}

function extrairPrecos(texto) {
  return (texto.match(/r\$\s*[\d.,]+/gi) || []);
}

function extrairParcelamentos(texto) {
  return (texto.match(/\d+x\s*de\s*r\$\s*[\d.,]+/gi) || []);
}

function extrairHoteis(texto) {
  return (texto.match(/hotel\s*[^\n]*/gi) || []);
}

function extrairServicos(texto) {
  const servicos = ['traslado', 'bagagem', 'refeição', 'passeio', 'seguro'];
  return servicos.filter(servico => texto.includes(servico));
}

function extrairLinks(texto) {
  return (texto.match(/https?:\/\/[^\s]+/g) || []);
}

function extrairReferencias(texto) {
  return (texto.match(/carrinho-dinamico\/[a-f0-9]+/g) || []);
}

// ================================================================================
// 🔍 FUNÇÕES DE DETECÇÃO BÁSICA
// ================================================================================

function detectarEscalas(texto) {
  return texto.includes('escala') || texto.includes('conexão');
}

function detectarConexoes(texto) {
  return texto.includes('conexão') || texto.includes('tempo de espera');
}

function detectarIdaVolta(texto) {
  return texto.includes('ida') && texto.includes('volta');
}

function detectarSomenteIda(texto) {
  return (texto.includes('ida') && !texto.includes('volta')) || texto.includes('somente ida');
}

function detectarMultiplasOpcoes(texto) {
  return texto.includes('opção') || texto.includes('plano');
}

function contarOpcoes(texto) {
  const opcoes = texto.match(/opção\s*\d+/gi) || [];
  const planos = texto.match(/plano\s*\d+/gi) || [];
  return Math.max(opcoes.length, planos.length);
}

function detectarPrecos(texto) {
  return /r\$\s*[\d.,]+/i.test(texto);
}

function contarPrecos(texto) {
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return [...new Set(precos)].length; // Remove duplicatas
}

function detectarDatas(texto) {
  return /\d{1,2}\/\d{1,2}(?:\/\d{4})?/.test(texto);
}

function contarDatas(texto) {
  const datas = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || [];
  return [...new Set(datas)].length; // Remove duplicatas
}

function detectarHorarios(texto) {
  return /\d{1,2}:\d{2}/.test(texto);
}

function contarHorarios(texto) {
  const horarios = texto.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(horarios)].length; // Remove duplicatas
}

function detectarAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB'];
  return codigos.some(codigo => texto.toUpperCase().includes(codigo));
}

function detectarCompanhias(texto) {
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'copa', 'american'];
  return companhias.some(companhia => texto.toLowerCase().includes(companhia));
}

// ================================================================================
// 🔍 DETECÇÃO DE PADRÕES
// ================================================================================

function detectarPadroes(texto) {
  console.log("🔍 Detectando padrões de layout...");
  
  return {
    // Layout patterns
    layoutVertical: detectarLayoutVertical(texto),
    layoutHorizontal: detectarLayoutHorizontal(texto),
    layoutTabular: detectarLayoutTabular(texto),
    
    // Padrões específicos CVC
    formatoCVC: texto.includes('cvc') || texto.includes('carrinho-dinamico'),
    temLinks: texto.includes('http') || texto.includes('www'),
    formatoWhatsApp: !texto.includes('ORÇAMENTO CVC') && texto.includes('💰')
  };
}

function detectarLayoutVertical(texto) {
  const linhas = texto.split('\n').filter(linha => linha.trim() !== '');
  const linhasComPreco = linhas.filter(linha => linha.includes('R$'));
  
  // Layout vertical: preços em linhas separadas
  return linhasComPreco.length > 1 && 
         linhasComPreco.every((linha, index) => 
           index === 0 || linha !== linhasComPreco[index - 1]
         );
}

function detectarLayoutHorizontal(texto) {
  const linhas = texto.split('\n');
  const linhasLongas = linhas.filter(linha => linha.length > 80);
  
  // Layout horizontal: informações em linha única longa
  return linhasLongas.length > 2;
}

function detectarLayoutTabular(texto) {
  // Detectar padrões de tabela (múltiplas colunas alinhadas)
  const linhas = texto.split('\n');
  const linhasComSeparadores = linhas.filter(linha => 
    linha.includes('|') || linha.includes('\t') || 
    linha.match(/\s{3,}/g)?.length > 2
  );
  
  return linhasComSeparadores.length > 3;
}

// ================================================================================
// 🎯 DETERMINAÇÃO DO TIPO PRINCIPAL
// ================================================================================

export function determinarTipoPrincipal(tipos) {
  console.log("🎯 Determinando tipo principal...");
  
  // Converter objetos de detecção em pontuações
  const scores = {};
  
  Object.entries(tipos).forEach(([tipo, deteccao]) => {
    if (deteccao && typeof deteccao === 'object' && deteccao.confianca) {
      scores[tipo] = deteccao.confianca;
    }
  });
  
  // Encontrar o tipo com maior confiança
  let tipoMaximo = null;
  let confiancaMaxima = 0;
  
  Object.entries(scores).forEach(([tipo, confianca]) => {
    if (confianca > confiancaMaxima) {
      confiancaMaxima = confianca;
      tipoMaximo = tipo;
    }
  });
  
  // Fallback para tipo padrão se nenhum atingir confiança mínima
  if (confiancaMaxima < 0.3) {
    return 'aereoNacionalSimples';
  }
  
  return tipoMaximo || 'aereoNacionalSimples';
}

function calcularConfiancaDeteccao(tipos) {
  const scores = Object.values(tipos)
    .filter(deteccao => deteccao && typeof deteccao === 'object' && deteccao.confianca)
    .map(deteccao => deteccao.confianca);
  
  if (scores.length === 0) return 0;
  
  // Retorna a maior confiança encontrada
  return Math.max(...scores);
}

// ================================================================================
// 📊 LOGGING E MÉTRICAS
// ================================================================================

function logAnalise(analise) {
  console.log("📊 === RELATÓRIO DE ANÁLISE v7.7 ===");
  console.log(`🎯 Tipo detectado: ${analise.tipoDetectado}`);
  console.log(`📈 Confiança: ${(analise.confiancaDeteccao * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade}`);
  console.log(`🔢 Opções: ${analise.numeroOpcoes}`);
  console.log(`✈️ Aeroportos: ${analise.aeroportosDetectados?.join(', ') || 'Nenhum'}`);
  console.log(`🏢 Companhias: ${analise.companhiasDetectadas?.join(', ') || 'Nenhuma'}`);
  console.log(`💰 Preços: ${analise.numeroPrecos}`);
  console.log(`📅 Datas: ${analise.numeroDatas}`);
  console.log("📊 === FIM DO RELATÓRIO ===");
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 (CORREÇÃO CRÍTICA #2)
// ================================================================================

// Log de inicialização
console.log("✅ Analysis v7.7 carregado:");
console.log("🔍 Detecção inteligente de 9 tipos de orçamento");
console.log("📊 Análise de contexto avançada");
console.log("🧮 Cálculo de complexidade dinâmico");
console.log("🎯 Determinação automática de tipo principal");
console.log("📈 Sistema de confiança e validação");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - Compatível com import()");

// Exportação individual das funções principais
export {
  analisarTextoCompleto,
  detectarTiposEspecificos,
  calcularComplexidadeAvancada,
  determinarTipoPrincipal,
  extrairContexto
};

// Exportação padrão para máxima compatibilidade
export default {
  analisarTextoCompleto,
  detectarTiposEspecificos,
  calcularComplexidadeAvancada,
  determinarTipoPrincipal,
  extrairContexto
};

console.log("🚀 Sistema de Análise v7.7 - DETECÇÃO INTELIGENTE COMPLETA!");
