// 🔍 analysis.js - SISTEMA INTELIGENTE DE ANÁLISE v7.0
// Detecção precisa de tipos de orçamento + Análise de contexto
// Integração com templates do Manual Completo

console.log("🔍 Analysis v7.0 - DETECÇÃO INTELIGENTE IMPLEMENTADA");

// ================================================================================
// 🎯 SISTEMA PRINCIPAL DE ANÁLISE
// ================================================================================

function analisarTextoCompleto(formData) {
  console.log("🔍 Iniciando análise completa v7.0...");
  
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
// 🔍 FUNÇÕES DE DETECÇÃO ESPECÍFICAS
// ================================================================================

function detectarAereoNacionalSimples(texto, contexto) {
  const indicadores = [
    !texto.includes('internacional'),
    texto.includes('ida') && texto.includes('volta'),
    !texto.includes('opção 1') && !texto.includes('opção 2'),
    contexto.aeroportosNacionais.length > 0,
    !texto.includes('conexão') && !texto.includes('escala'),
    contexto.precos.length === 1
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
    contexto.aeroportosDetectados.length >= 3, // origem, conexão, destino
    texto.includes('brasília') || texto.includes('recife') || texto.includes('fortaleza'),
    contexto.horarios.length >= 4 // ida1, ida2, volta1, volta2
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    indicadores: {
      temConexao: indicadores[0],
      temTempoEspera: indicadores[1],
      multiplosAeroportos: indicadores[2],
      aeroportoConexaoComum: indicadores[3],
      multiplosHorarios: indicadores[4]
    }
  };
}

function detectarAereoSomenteIda(texto, contexto) {
  const indicadores = [
    texto.includes('somente ida') || texto.includes('só ida'),
    texto.includes('ida') && !texto.includes('volta'),
    !texto.includes('--') && !texto.includes('retorno'),
    contexto.datas.length === 1,
    !texto.includes('round trip')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.7,
    confianca: score,
    indicadores: {
      explicito: indicadores[0],
      somenteIda: indicadores[1],
      semSeparador: indicadores[2],
      dataUnica: indicadores[3],
      naoRoundTrip: indicadores[4]
    }
  };
}

function detectarMultiplasOpcoes2(texto, contexto) {
  const indicadores = [
    (texto.includes('opção 1') && texto.includes('opção 2')) ||
    (texto.includes('plano 1') && texto.includes('plano 2')),
    contexto.precos.length === 2,
    !texto.includes('opção 3') && !texto.includes('plano 3'),
    texto.includes('bagagem') && (texto.match(/bagagem/g) || []).length >= 2,
    mesmo_voo_multiplos_precos(texto)
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    indicadores: {
      opcoes2Explicitas: indicadores[0],
      precosDuplos: indicadores[1],
      naoOpcao3: indicadores[2],
      bagagemMultipla: indicadores[3],
      mesmoVoo: indicadores[4]
    }
  };
}

function detectarMultiplasOpcoes3(texto, contexto) {
  const indicadores = [
    (texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção 3')) ||
    (texto.includes('plano 1') && texto.includes('plano 2') && texto.includes('plano 3')),
    contexto.precos.length === 3,
    texto.includes('marcação') && texto.includes('assento'),
    (texto.match(/r\$.*?r\$.*?r\$/gi) || []).length >= 1,
    texto.includes('2 bagagens') || texto.includes('duas bagagens')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    indicadores: {
      opcoes3Explicitas: indicadores[0],
      precosTriplos: indicadores[1],
      servicosPremium: indicadores[2],
      multiplosPrecos: indicadores[3],
      bagagemPremium: indicadores[4]
    }
  };
}

function detectarMultitrecho(texto, contexto) {
  const indicadores = [
    texto.includes('multitrecho') || texto.includes('multi-trecho'),
    texto.includes('trecho 1') || texto.includes('1º trecho'),
    contexto.datas.length >= 3,
    contexto.aeroportosDetectados.length >= 3,
    roteiro_nao_linear(texto),
    (texto.includes('madrid') && texto.includes('lisboa')) ||
    (texto.includes('paris') && texto.includes('roma')) ||
    (texto.includes('londres') && texto.includes('edinburgo')),
    texto.includes('tap portugal') || texto.includes('lufthansa')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      multitrechoExplicito: indicadores[0],
      trechosNumerados: indicadores[1],
      multiplasDatass: indicadores[2],
      multiplosAeroportos: indicadores[3],
      roteiroComplexo: indicadores[4],
      destinosEuropeus: indicadores[5],
      companhiaInternacional: indicadores[6]
    }
  };
}

function detectarMultiplasCompanhiasInternacionais(texto, contexto) {
  const indicadores = [
    texto.includes('miami') || texto.includes('europa') || texto.includes('new york'),
    (texto.includes('copa airlines') || texto.includes('american airlines') || 
     texto.includes('lufthansa') || texto.includes('air france')),
    contexto.companhiasDetectadas.length >= 2,
    texto.includes('opção 1') && texto.includes('opção 2'),
    destino_internacional(contexto.destino),
    texto.includes('voo direto') && texto.includes('conexão')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      destinoInternacional: indicadores[0],
      companhiasInternacionais: indicadores[1],
      multiplas_companhias: indicadores[2],
      opcoesComparativas: indicadores[3],
      destinoDetectado: indicadores[4],
      tiposVooVariados: indicadores[5]
    }
  };
}

function detectarPacoteCompleto(texto, contexto) {
  const indicadores = [
    texto.includes('pacote'),
    texto.includes('traslado') || texto.includes('transfer'),
    (texto.includes('hotel') && texto.includes('aéreo')) ||
    (texto.includes('hospedagem') && texto.includes('voo')),
    texto.includes('inclui') || texto.includes('inclusões'),
    contexto.hoteis.length > 0,
    texto.includes('noites') || texto.includes('diárias'),
    texto.includes('café da manhã') || texto.includes('meia pensão')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      pacoteExplicito: indicadores[0],
      temTraslado: indicadores[1],
      aereoHotel: indicadores[2],
      listaInclusoes: indicadores[3],
      hoteisDetectados: indicadores[4],
      temNoites: indicadores[5],
      regimeAlimentacao: indicadores[6]
    }
  };
}

function detectarCruzeiro(texto, contexto) {
  const indicadores = [
    texto.includes('cruzeiro'),
    texto.includes('costa') || texto.includes('msc') || texto.includes('royal caribbean'),
    texto.includes('cabine') || texto.includes('navio'),
    texto.includes('embarque') && texto.includes('porto'),
    texto.includes('interna') || texto.includes('externa') || texto.includes('varanda'),
    texto.includes('noites') && !texto.includes('hotel'),
    texto.includes('roteiro') || texto.includes('itinerário'),
    precos_por_cabine(texto)
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.5,
    confianca: score,
    indicadores: {
      cruzeiroExplicito: indicadores[0],
      companhiaCruzeiro: indicadores[1],
      terminologiaNautica: indicadores[2],
      embarquePorto: indicadores[3],
      tiposCabine: indicadores[4],
      duracaoNoites: indicadores[5],
      temRoteiro: indicadores[6],
      precosCabine: indicadores[7]
    }
  };
}

// ================================================================================
// 🧠 FUNÇÕES AUXILIARES DE DETECÇÃO
// ================================================================================

function mesmo_voo_multiplos_precos(texto) {
  const horarios = texto.match(/\d{1,2}:\d{2}/g) || [];
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  
  // Se há múltiplos preços mas poucos horários diferentes, provavelmente é mesmo voo
  return precos.length >= 2 && horarios.length <= 4;
}

function roteiro_nao_linear(texto) {
  const cidades = extrair_cidades_texto(texto);
  
  // Se há mais de 2 cidades e não é ida-volta simples
  return cidades.length >= 3 && !eh_ida_volta_simples(cidades);
}

function destino_internacional(destino) {
  const destinosInternacionais = [
    'miami', 'new york', 'paris', 'londres', 'madrid', 'lisboa', 
    'roma', 'amsterda', 'barcelona', 'berlim', 'zurich', 'dubai'
  ];
  
  return destinosInternacionais.some(dest => 
    (destino || '').toLowerCase().includes(dest)
  );
}

function precos_por_cabine(texto) {
  // Detectar se preços são por cabine (valores mais altos, poucos passageiros)
  const precos = extrair_valores_numericos(texto);
  const adultos = texto.match(/(\d+)\s*adult/gi) || [];
  
  if (precos.length > 0 && adultos.length > 0) {
    const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;
    return precoMedio > 5000; // Preços típicos de cabine de cruzeiro
  }
  
  return false;
}

function extrair_cidades_texto(texto) {
  const cidades = [
    'são paulo', 'rio de janeiro', 'salvador', 'fortaleza', 'recife',
    'madrid', 'lisboa', 'paris', 'roma', 'londres', 'miami', 'new york'
  ];
  
  return cidades.filter(cidade => texto.includes(cidade));
}

function eh_ida_volta_simples(cidades) {
  return cidades.length === 2;
}

function extrair_valores_numericos(texto) {
  const matches = texto.match(/r\$\s*([\d.,]+)/gi) || [];
  return matches.map(match => {
    const numero = match.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numero) || 0;
  });
}

// ================================================================================
// 📊 EXTRAÇÃO DE CONTEXTO
// ================================================================================

function extrairContexto(texto) {
  console.log("📊 Extraindo contexto...");
  
  return {
    // Preços detectados
    precos: extrairPrecos(texto),
    valoresNumericos: extrair_valores_numericos(texto),
    
    // Datas e horários
    datas: extrairDatas(texto),
    horarios: extrairHorarios(texto),
    
    // Aeroportos e companhias
    aeroportosDetectados: extrairAeroportos(texto),
    aeroportosNacionais: extrairAeroportosNacionais(texto),
    companhiasDetectadas: extrairCompanhias(texto),
    
    // Hotéis e destinos
    hoteis: extrairHoteis(texto),
    destino: extrairDestinoPrincipal(texto),
    
    // Características técnicas
    temLinks: texto.includes('http') || texto.includes('www'),
    temEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(texto),
    
    // Análise de tamanho
    tamanhoTexto: texto.length,
    numeroLinhas: texto.split('\n').length,
    numeroPalavras: texto.split(' ').length
  };
}

function extrairPrecos(texto) {
  const matches = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return matches.map(match => match.trim());
}

function extrairDatas(texto) {
  const matches = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || [];
  return [...new Set(matches)]; // Remove duplicatas
}

function extrairHorarios(texto) {
  const matches = texto.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(matches)]; // Remove duplicatas
}

function extrairAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'SSA', 'FOR', 'REC', 'POA', 'CWB'];
  const encontrados = [];
  
  codigos.forEach(codigo => {
    if (texto.toUpperCase().includes(codigo)) {
      encontrados.push(codigo);
    }
  });
  
  return encontrados;
}

function extrairAeroportosNacionais(texto) {
  const nacionais = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'SSA', 'FOR', 'REC', 'POA'];
  return extrairAeroportos(texto).filter(codigo => nacionais.includes(codigo));
}

function extrairCompanhias(texto) {
  const companhias = [
    'latam', 'gol', 'azul', 'avianca', 'copa airlines', 'american airlines',
    'united', 'delta', 'lufthansa', 'air france', 'klm', 'tap portugal'
  ];
  
  const encontradas = [];
  companhias.forEach(companhia => {
    if (texto.toLowerCase().includes(companhia)) {
      encontradas.push(companhia);
    }
  });
  
  return encontradas;
}

function extrairHoteis(texto) {
  const palavrasHotel = ['hotel', 'resort', 'pousada', 'flat', 'apart'];
  const hoteis = [];
  
  // Buscar por nomes que contenham palavras relacionadas a hospedagem
  palavrasHotel.forEach(palavra => {
    const regex = new RegExp(`\\b\\w*${palavra}\\w*\\b`, 'gi');
    const matches = texto.match(regex) || [];
    hoteis.push(...matches);
  });
  
  return [...new Set(hoteis)]; // Remove duplicatas
}

function extrairDestinoPrincipal(texto) {
  const destinos = [
    'são paulo', 'rio de janeiro', 'salvador', 'fortaleza', 'recife', 'maceió',
    'porto alegre', 'curitiba', 'florianópolis', 'brasília', 'goiânia',
    'miami', 'new york', 'paris', 'londres', 'madrid', 'lisboa', 'roma'
  ];
  
  for (const destino of destinos) {
    if (texto.includes(destino)) {
      return destino;
    }
  }
  
  return null;
}

// ================================================================================
// 🧮 CÁLCULO DE COMPLEXIDADE AVANÇADA
// ================================================================================

function calcularComplexidadeAvancada(texto, formData) {
  console.log("🧮 Calculando complexidade avançada...");
  
  let pontuacao = 0;
  const fatores = {};
  
  // Fator 1: Número de tipos selecionados
  const tiposSelecionados = formData.tipos?.length || 0;
  pontuacao += tiposSelecionados * 10;
  fatores.tiposSelecionados = tiposSelecionados;
  
  // Fator 2: Múltiplas opções
  const numeroOpcoes = contarOpcoes(texto);
  pontuacao += numeroOpcoes * 15;
  fatores.numeroOpcoes = numeroOpcoes;
  
  // Fator 3: Conexões/escalas
  if (detectarEscalas(texto)) {
    pontuacao += 20;
    fatores.temEscalas = true;
  }
  
  // Fator 4: Múltiplas companhias
  const companhias = extrairCompanhias(texto);
  pontuacao += companhias.length * 10;
  fatores.numeroCompanhias = companhias.length;
  
  // Fator 5: Crianças com idades
  if (formData.criancas > 0 && formData.idadesCriancas?.length > 0) {
    pontuacao += 15;
    fatores.criancasComIdades = true;
  }
  
  // Fator 6: Texto extenso
  if (texto.length > 1000) {
    pontuacao += 25;
    fatores.textoExtenso = true;
  }
  
  // Fator 7: Parcelamento solicitado
  if (formData.parcelamento?.incluirParcelamento) {
    pontuacao += 10;
    fatores.parcelamentoSolicitado = true;
  }
  
  // Determinar nível de complexidade
  let nivel;
  if (pontuacao <= 30) {
    nivel = 'baixa';
  } else if (pontuacao <= 70) {
    nivel = 'média';
  } else if (pontuacao <= 120) {
    nivel = 'alta';
  } else {
    nivel = 'muito_alta';
  }
  
  return {
    complexidade: nivel,
    pontuacao: pontuacao,
    fatores: fatores,
    recomendacoes: gerarRecomendacoes(nivel, fatores)
  };
}

function gerarRecomendacoes(nivel, fatores) {
  const recomendacoes = [];
  
  if (nivel === 'muito_alta') {
    recomendacoes.push('Usar GPT-4o para maior precisão');
    recomendacoes.push('Aumentar max_tokens para 3000');
    recomendacoes.push('Aplicar validação extra na resposta');
  } else if (nivel === 'alta') {
    recomendacoes.push('Usar GPT-4o-mini com temperature 0.3');
    recomendacoes.push('Aplicar template específico');
  } else {
    recomendacoes.push('GPT-4o-mini suficiente');
    recomendacoes.push('Template básico adequado');
  }
  
  if (fatores.temEscalas) {
    recomendacoes.push('Detalhar conexões claramente');
  }
  
  if (fatores.numeroOpcoes > 2) {
    recomendacoes.push('Usar formatação escalonada de bagagem');
  }
  
  return recomendacoes;
}

// ================================================================================
// 🔍 DETECÇÃO DE PADRÕES
// ================================================================================

function detectarPadroes(texto) {
  console.log("🔍 Detectando padrões...");
  
  return {
    // Padrões de layout
    layoutVertical: detectarLayoutVertical(texto),
    layoutHorizontal: detectarLayoutHorizontal(texto),
    layoutTabular: detectarLayoutTabular(texto),
    
    // Padrões de conteúdo
    temResumoExecutivo: texto.includes('resumo') || texto.includes('sumário'),
    temObservacoes: texto.includes('obs:') || texto.includes('observação'),
    temCondicoes: texto.includes('condições') || texto.includes('termos'),
    
    // Padrões de formatação
    temNegrito: texto.includes('*') || texto.includes('**'),
    temEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(texto),
    temListas: texto.includes('•') || texto.includes('-') || /^\d+\./m.test(texto),
    
    // Padrões específicos CVC
    formatoCVC: texto.includes('cvc') || texto.includes('carrinho-dinamico'),
    temLinks: texto.includes('http') || texto.includes('www'),
    formatoWhatsApp: !texto.includes('ORÇAMENTO CVC') && texto.includes('💰')
  };
}

function detectarLayoutVertical(texto) {
  const linhas = texto.split('\n').filter(linha => linha.trim() !== '');
  const linhasComPreco = linhas.filter(linha => linha.includes('R));
  
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
// 🔍 FUNÇÕES BÁSICAS DE DETECÇÃO (REUTILIZADAS)
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
  return texto.includes('R) || texto.includes('r) || 
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
  console.log("📊 === RELATÓRIO DE ANÁLISE v7.0 ===");
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
// 🚀 EXPORTAÇÃO E INICIALIZAÇÃO
// ================================================================================

console.log("✅ Analysis v7.0 carregado:");
console.log("🔍 Detecção inteligente de 9 tipos de orçamento");
console.log("📊 Análise de contexto avançada");
console.log("🧮 Cálculo de complexidade dinâmico");
console.log("🎯 Determinação automática de tipo principal");
console.log("📈 Sistema de confiança e validação");

// Exportar funções principais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analisarTextoCompleto,
    detectarTiposEspecificos,
    calcularComplexidadeAvancada,
    determinarTipoPrincipal,
    extrairContexto
  };
} else {
  // Browser environment
  window.analisarTextoCompleto = analisarTextoCompleto;
  window.detectarTiposEspecificos = detectarTiposEspecificos;
  window.calcularComplexidadeAvancada = calcularComplexidadeAvancada;
  window.determinarTipoPrincipal = determinarTipoPrincipal;
  window.extrairContexto = extrairContexto;
}

console.log("🚀 Sistema de Análise v7.0 - DETECÇÃO INTELIGENTE COMPLETA!");
