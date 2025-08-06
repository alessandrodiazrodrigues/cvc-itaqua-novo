// 🔍 analysis.js - v8.0 - EXPORTAÇÕES ES6 CORRIGIDAS
// CORREÇÃO CRÍTICA: Removido 'export' duplicado das funções
// Sistema completo de análise de tipos de orçamento + contexto

console.log("🔍 Analysis v8.0 - EXPORTAÇÕES ES6 CORRIGIDAS");

// ================================================================================
// 🎯 SISTEMA PRINCIPAL DE ANÁLISE
// ================================================================================

function analisarTextoCompleto(formData) {
  console.log("🔍 Iniciando análise completa v8.0...");
  
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

function detectarTiposEspecificos(texto, contexto) {
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
    contexto?.aeroportos?.length >= 3,
    texto.includes('brasília') || texto.includes('são paulo'),
    contexto?.horarios?.length >= 4,
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
    contexto?.precos?.length >= 3,
    texto.includes('tarifas') || texto.includes('modalidades'),
    texto.includes('econômica') || texto.includes('premium') || texto.includes('executiva'),
    !texto.includes('opção 4'),
    texto.includes('flexibilidade') || texto.includes('conforto')
  ];
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: { 
      opcoes123: indicadores[0], 
      tresPrecos: indicadores[1], 
      termosTarifas: indicadores[2], 
      categorias: indicadores[3], 
      semOpcao4: indicadores[4], 
      diferenciasClassificacao: indicadores[5] 
    }
  };
}

function detectarMultitrecho(texto, contexto) {
  const indicadores = [
    texto.includes('multitrecho') || texto.includes('multi-trecho'),
    texto.includes('trecho 1') || texto.includes('1º trecho'),
    contexto?.aeroportos?.length >= 4,
    contexto?.datas?.length >= 3,
    !texto.includes('ida') || !texto.includes('volta'),
    texto.includes('itinerário') || texto.includes('roteiro')
  ];
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return {
    detectado: score > 0.4,
    confianca: score,
    indicadores: { 
      termoMultitrecho: indicadores[0], 
      trechosNumerados: indicadores[1], 
      muitosAeroportos: indicadores[2], 
      muitasDatas: indicadores[3], 
      naoIdaVoltaSimples: indicadores[4], 
      termoItinerario: indicadores[5] 
    }
  };
}

function detectarMultiplasCompanhiasInternacionais(texto, contexto) {
  const indicadores = [
    contexto?.companhias?.length >= 2,
    texto.includes('internacional') || texto.includes('europa') || texto.includes('eua'),
    texto.includes('tap') || texto.includes('lufthansa') || texto.includes('air france'),
    texto.includes('code share') || texto.includes('codeshare'),
    contexto?.aeroportosInternacionais?.length > 0,
    !texto.includes('nacional')
  ];
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: { 
      multiplasCompanhias: indicadores[0], 
      rotaInternacional: indicadores[1], 
      companhiaInternacional: indicadores[2], 
      codeShare: indicadores[3], 
      aeroportosInternacionais: indicadores[4], 
      naoNacional: indicadores[5] 
    }
  };
}

function detectarPacoteCompleto(texto, contexto) {
  const indicadores = [
    texto.includes('hotel') || texto.includes('hospedagem'),
    texto.includes('pacote') || texto.includes('combo'),
    texto.includes('aéreo') && (texto.includes('hotel') || texto.includes('hospedagem')),
    texto.includes('check-in') || texto.includes('check-out'),
    texto.includes('diárias') || texto.includes('noites'),
    !texto.includes('somente aéreo')
  ];
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: { 
      temHotel: indicadores[0], 
      termoPacote: indicadores[1], 
      aereoMaisHotel: indicadores[2], 
      termosHotel: indicadores[3], 
      termoDiarias: indicadores[4], 
      naoSomenteAereo: indicadores[5] 
    }
  };
}

function detectarCruzeiro(texto, contexto) {
  const indicadores = [
    texto.includes('cruzeiro') || texto.includes('cruise'),
    texto.includes('msc') || texto.includes('costa') || texto.includes('princess'),
    texto.includes('cabine') || texto.includes('camarote'),
    texto.includes('porto') || texto.includes('santos') || texto.includes('embarque'),
    texto.includes('noites') && !texto.includes('hotel'),
    texto.includes('roteiro') && (texto.includes('litoral') || texto.includes('costa'))
  ];
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return {
    detectado: score > 0.4,
    confianca: score,
    indicadores: { 
      termoCruzeiro: indicadores[0], 
      companhiaCruzeiro: indicadores[1], 
      termoCabine: indicadores[2], 
      termoPorto: indicadores[3], 
      noitesSemHotel: indicadores[4], 
      roteiroLitoral: indicadores[5] 
    }
  };
}

// ================================================================================
// 🔧 EXTRAÇÃO DE CONTEXTO
// ================================================================================

// CORREÇÃO: Removido 'export' da declaração da função
function extrairContexto(texto) {
  console.log("🔧 Extraindo contexto avançado...");
  
  return {
    // Aeroportos detectados
    aeroportos: extrairAeroportos(texto),
    aeroportosNacionais: extrairAeroportosNacionais(texto),
    aeroportosInternacionais: extrairAeroportosInternacionais(texto),
    
    // Companhias aéreas
    companhias: extrairCompanhias(texto),
    companhiasNacionais: extrairCompanhiasNacionais(texto),
    companhiasInternacionais: extrairCompanhiasInternacionais(texto),
    
    // Preços e valores
    precos: extrairPrecos(texto),
    precosFormatados: formatarPrecos(extrairPrecos(texto)),
    
    // Datas e horários
    datas: extrairDatas(texto),
    horarios: extrairHorarios(texto),
    
    // Informações específicas
    bagagem: extrairInfoBagagem(texto),
    reembolso: extrairInfoReembolso(texto),
    parcelamento: extrairInfoParcelamento(texto),
    
    // Metadados
    tamanhoTexto: texto.length,
    numeroLinhas: texto.split('\n').length,
    numeroParavras: texto.split(' ').length
  };
}

// ================================================================================
// 📊 ANÁLISE DE COMPLEXIDADE
// ================================================================================

function calcularComplexidadeAvancada(texto, formData) {
  console.log("📊 Calculando complexidade avançada...");
  
  let pontuacao = 0;
  const fatores = [];
  
  // Fatores de complexidade
  const numeroPrecos = contarPrecos(texto);
  const numeroAeroportos = extrairAeroportos(texto).length;
  const numeroCompanhias = extrairCompanhias(texto).length;
  const numeroHorarios = contarHorarios(texto);
  const numeroDatas = contarDatas(texto);
  
  // Múltiplos preços aumentam complexidade
  if (numeroPrecos >= 3) {
    pontuacao += 30;
    fatores.push('múltiplos_preços');
  } else if (numeroPrecos === 2) {
    pontuacao += 15;
    fatores.push('dois_preços');
  }
  
  // Múltiplos aeroportos/conexões
  if (numeroAeroportos >= 4) {
    pontuacao += 25;
    fatores.push('multitrecho_complexo');
  } else if (numeroAeroportos === 3) {
    pontuacao += 15;
    fatores.push('conexão_simples');
  }
  
  // Múltiplas companhias
  if (numeroCompanhias >= 2) {
    pontuacao += 20;
    fatores.push('múltiplas_companhias');
  }
  
  // Muitos horários indicam complexidade temporal
  if (numeroHorarios >= 6) {
    pontuacao += 15;
    fatores.push('muitos_horários');
  }
  
  // Internacional aumenta complexidade
  if (texto.includes('internacional') || texto.includes('europa') || texto.includes('eua')) {
    pontuacao += 20;
    fatores.push('internacional');
  }
  
  // Pacotes são mais complexos
  if (texto.includes('hotel') && texto.includes('aéreo')) {
    pontuacao += 15;
    fatores.push('pacote_completo');
  }
  
  // Cruzeiros têm complexidade específica
  if (texto.includes('cruzeiro') || texto.includes('msc')) {
    pontuacao += 10;
    fatores.push('cruzeiro');
  }
  
  // Imagem aumenta complexidade
  if (formData.imagemBase64) {
    pontuacao += 25;
    fatores.push('análise_imagem');
  }
  
  // Determinar nível de complexidade
  let complexidade;
  if (pontuacao >= 80) complexidade = 'muito_alta';
  else if (pontuacao >= 50) complexidade = 'alta';
  else if (pontuacao >= 25) complexidade = 'media';
  else complexidade = 'baixa';
  
  return {
    complexidade: complexidade,
    pontuacao: pontuacao,
    fatores: fatores,
    recomendacaoModelo: pontuacao >= 50 ? 'gpt-4o' : 'gpt-4o-mini'
  };
}

// ================================================================================
// 🔍 DETECÇÃO DE PADRÕES
// ================================================================================

function detectarPadroes(texto) {
  return {
    // Padrões de layout
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

// CORREÇÃO: Removido 'export' da declaração da função
function determinarTipoPrincipal(tipos) {
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
  
  // Fallback se nenhum tipo atingir confiança mínima
  if (confiancaMaxima < 0.4) {
    tipoMaximo = 'aereoNacionalSimples'; // Tipo padrão
  }
  
  console.log(`🎯 Tipo principal detectado: ${tipoMaximo} (${(confiancaMaxima * 100).toFixed(1)}%)`);
  
  return tipoMaximo;
}

function calcularConfiancaDeteccao(tipos) {
  const scores = Object.values(tipos)
    .filter(deteccao => deteccao && typeof deteccao === 'object' && deteccao.confianca)
    .map(deteccao => deteccao.confianca);
  
  if (scores.length === 0) return 0;
  
  const maxScore = Math.max(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Confiança baseada no melhor score e consistência geral
  return (maxScore * 0.7) + (avgScore * 0.3);
}

// ================================================================================
// 🔧 FUNÇÕES DE EXTRAÇÃO
// ================================================================================

function extrairAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC', 'SSA'];
  return codigos.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairAeroportosNacionais(texto) {
  const nacionais = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC', 'SSA'];
  return nacionais.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairAeroportosInternacionais(texto) {
  const internacionais = ['MIA', 'LAX', 'JFK', 'LHR', 'CDG', 'FCO', 'MAD', 'LIS'];
  return internacionais.filter(codigo => texto.toUpperCase().includes(codigo));
}

function extrairCompanhias(texto) {
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'copa', 'american', 'tap', 'lufthansa'];
  return companhias.filter(companhia => texto.toLowerCase().includes(companhia));
}

function extrairCompanhiasNacionais(texto) {
  const nacionais = ['latam', 'gol', 'azul'];
  return nacionais.filter(companhia => texto.toLowerCase().includes(companhia));
}

function extrairCompanhiasInternacionais(texto) {
  const internacionais = ['american', 'tap', 'lufthansa', 'air france', 'copa', 'avianca'];
  return internacionais.filter(companhia => texto.toLowerCase().includes(companhia));
}

function extrairPrecos(texto) {
  const matches = texto.match(/R\$\s*[\d.,]+/g) || [];
  return [...new Set(matches)]; // Remove duplicatas
}

function formatarPrecos(precos) {
  return precos.map(preco => {
    const valor = preco.replace(/R\$\s*/, '').replace(/\./g, '').replace(',', '.');
    const numero = parseFloat(valor);
    return isNaN(numero) ? preco : numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });
}

function extrairDatas(texto) {
  const matches = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || [];
  return [...new Set(matches)]; // Remove duplicatas
}

function extrairHorarios(texto) {
  const matches = texto.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(matches)]; // Remove duplicatas
}

function extrairInfoBagagem(texto) {
  if (texto.includes('bagagem despachada')) return 'despachada_incluida';
  if (texto.includes('mala de mão')) return 'mao_incluida';
  if (texto.includes('sem bagagem')) return 'sem_bagagem';
  return 'nao_especificado';
}

function extrairInfoReembolso(texto) {
  if (texto.includes('reembolsável')) return 'reembolsavel';
  if (texto.includes('não reembolsável')) return 'nao_reembolsavel';
  return 'nao_especificado';
}

function extrairInfoParcelamento(texto) {
  const match = texto.match(/(\d+)x/);
  return match ? `${match[1]}x` : 'nao_especificado';
}

// ================================================================================
// 🔍 FUNÇÕES BÁSICAS DE DETECÇÃO
// ================================================================================

function detectarEscalas(texto) {
  return texto.includes('escala') || texto.includes('conexão') || 
         texto.includes('parada') || texto.includes('trânsito');
}

function detectarConexoes(texto) {
  return detectarEscalas(texto) || texto.includes('via ') || 
         texto.includes('connecting');
}

function detectarIdaVolta(texto) {
  return texto.includes('ida') && texto.includes('volta') && 
         !texto.includes('somente ida');
}

function detectarSomenteIda(texto) {
  return (texto.includes('somente ida') || texto.includes('só ida')) ||
         (texto.includes('ida') && !texto.includes('volta'));
}

function detectarMultiplasOpcoes(texto) {
  return (texto.includes('opção 1') || texto.includes('plano 1')) ||
         (texto.match(/r\$.*?r\$/gi) || []).length >= 2;
}

function contarOpcoes(texto) {
  const opcoes = texto.match(/opção \d+|plano \d+/gi) || [];
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  
  return Math.max(opcoes.length, Math.min(precos.length, 5)); // Máximo 5 opções
}

function detectarPrecos(texto) {
  return texto.includes('R$') || texto.includes('r$') || 
         texto.includes('real') || /\d+[.,]\d{2}/.test(texto);
}

function contarPrecos(texto) {
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return precos.length;
}

function detectarDatas(texto) {
  return /\d{1,2}\/\d{1,2}/.test(texto) || 
         texto.includes('janeiro') || texto.includes('fevereiro');
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
// 📊 LOGGING E MÉTRICAS
// ================================================================================

function logAnalise(analise) {
  console.log("📊 === RELATÓRIO DE ANÁLISE v8.0 ===");
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
// 🚀 EXPORTAÇÃO ES6 ÚNICA (CORREÇÃO CRÍTICA)
// ================================================================================

console.log("✅ Analysis v8.0 carregado:");
console.log("🔍 Detecção inteligente de 9 tipos de orçamento");
console.log("📊 Análise de contexto avançada");
console.log("🧮 Cálculo de complexidade dinâmico");
console.log("🎯 Determinação automática de tipo principal");
console.log("📈 Sistema de confiança e validação");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - SEM DUPLICATAS");

// EXPORTAÇÃO ÚNICA E LIMPA
export {
  analisarTextoCompleto,
  detectarTiposEspecificos,
  calcularComplexidadeAvancada,
  determinarTipoPrincipal,
  extrairContexto
};

// EXPORTAÇÃO DEFAULT PARA MÁXIMA COMPATIBILIDADE
export default {
  analisarTextoCompleto,
  detectarTiposEspecificos,
  calcularComplexidadeAvancada,
  determinarTipoPrincipal,
  extrairContexto
};

console.log("🚀 Sistema de Análise v8.0 - EXPORTAÇÕES CORRIGIDAS!");
