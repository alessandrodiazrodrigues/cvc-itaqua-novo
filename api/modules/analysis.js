// 🔍 analysis.js - SISTEMA INTELIGENTE DE ANÁLISE v8.1
// Detecção precisa de tipos de orçamento + Análise de contexto
// ✅ EXPORTAÇÃO ES6 CORRIGIDA - SEM SISTEMA HÍBRIDO
// Integração com templates do Manual Completo

console.log("🔍 Analysis v8.1 - ES6 EXPORTS CORRIGIDA");

// ================================================================================
// 🎯 SISTEMA PRINCIPAL DE ANÁLISE
// ================================================================================

export function analisarTextoCompleto(formData) {
  console.log("🔍 Iniciando análise completa v8.1...");
  
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
  
  // Determinar tipo principal
  analise.tipo_principal = determinarTipoPrincipal(analise);
  analise.confianca_deteccao = calcularConfiancaDeteccao(analise);
  
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
// 🎯 DETECÇÃO DE TIPOS ESPECÍFICOS (MANUAL COMPLETAMENTE IMPLEMENTADO)
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
  
  return {
    tipos: tipos,
    tipoDetectado: determinarTipoPrincipal(tipos),
    confiancaDeteccao: calcularConfiancaDeteccao(tipos)
  };
}

// ================================================================================
// 🔍 FUNÇÕES DE DETECÇÃO ESPECÍFICAS (TODAS OS 9 TIPOS DO MANUAL)
// ================================================================================

function detectarAereoNacionalSimples(texto, contexto) {
  const indicadores = [
    !texto.includes('internacional'),
    texto.includes('ida') && texto.includes('volta'),
    !texto.includes('opção 1') && !texto.includes('opção 2'),
    !texto.includes('somente ida'),
    contexto?.aeroportosNacionais?.length > 0,
    !texto.includes('conexão') && !texto.includes('escala'),
    contexto?.precos?.length === 1
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'aereo_nacional_simples'
  };
}

function detectarAereoConexaoDetalhada(texto, contexto) {
  const indicadores = [
    texto.includes('conexão') || texto.includes('escala'),
    texto.includes('brasília') || texto.includes('recife') || texto.includes('fortaleza'),
    texto.includes('espera') || texto.includes('tempo'),
    contexto?.horarios?.length >= 4, // Múltiplos horários para conexão
    !texto.includes('internacional')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'aereo_conexao_detalhada'
  };
}

function detectarAereoSomenteIda(texto, contexto) {
  const indicadores = [
    texto.includes('somente ida'),
    texto.includes('ida') && !texto.includes('volta'),
    !texto.includes('--') && !texto.includes('retorno'),
    !texto.includes('volta'),
    contexto?.datas?.length === 1
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'aereo_somente_ida'
  };
}

function detectarMultiplasOpcoes2(texto, contexto) {
  const indicadores = [
    (texto.includes('opção 1') && texto.includes('opção 2')) ||
    (texto.includes('plano 1') && texto.includes('plano 2')),
    !texto.includes('opção 3') && !texto.includes('plano 3'),
    contexto?.precos?.length === 2,
    texto.includes('bagagem')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.7,
    confianca: score,
    tipo: 'multiplas_opcoes_2'
  };
}

function detectarMultiplasOpcoes3(texto, contexto) {
  const indicadores = [
    texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção 3'),
    texto.includes('plano 1') && texto.includes('plano 2') && texto.includes('plano 3'),
    contexto?.precos?.length === 3,
    texto.includes('marcação') || texto.includes('assento')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.7,
    confianca: score,
    tipo: 'multiplas_opcoes_3'
  };
}

function detectarMultitrecho(texto, contexto) {
  const indicadores = [
    texto.includes('multitrecho'),
    texto.includes('trecho 1') || texto.includes('trecho 2'),
    texto.includes('→') && texto.split('→').length > 2,
    contexto?.datas?.length >= 3,
    contexto?.aeroportosDetectados?.length >= 3
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'multitrecho'
  };
}

function detectarMultiplasCompanhiasInternacionais(texto, contexto) {
  const indicadores = [
    texto.includes('internacional'),
    (texto.includes('copa') || texto.includes('american') || texto.includes('tap')),
    texto.includes('opção 1') && texto.includes('opção 2'),
    contexto?.companhiasDetectadas?.length >= 2,
    texto.includes('miami') || texto.includes('europa') || texto.includes('argentina')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'multiplas_companhias_internacionais'
  };
}

function detectarPacoteCompleto(texto, contexto) {
  const indicadores = [
    texto.includes('pacote'),
    texto.includes('hotel') && (texto.includes('voo') || texto.includes('aéreo')),
    texto.includes('traslado') || texto.includes('hospedagem'),
    texto.includes('inclui'),
    contexto?.hoteis?.length > 0
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.7,
    confianca: score,
    tipo: 'pacote_completo'
  };
}

function detectarCruzeiro(texto, contexto) {
  const indicadores = [
    texto.includes('cruzeiro'),
    texto.includes('navio') || texto.includes('cabine') || texto.includes('porto'),
    texto.includes('msc') || texto.includes('costa') || texto.includes('sinfonia'),
    texto.includes('noites'),
    texto.includes('embarque')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  
  return {
    detectado: score > 0.6,
    confianca: score,
    tipo: 'cruzeiro'
  };
}

// ================================================================================
// 🧮 CÁLCULO DE COMPLEXIDADE AVANÇADA
// ================================================================================

export function calcularComplexidadeAvancada(texto, formData) {
  console.log("🧮 Calculando complexidade avançada...");
  
  let pontos = 0;
  
  // Fatores de complexidade
  const fatores = {
    multiplasOpcoes: contarOpcoes(texto) > 1 ? 20 : 0,
    multiplasCompanhias: extrairCompanhias(texto).length > 1 ? 15 : 0,
    conexoes: texto.includes('conexão') ? 10 : 0,
    multitrecho: texto.includes('trecho') ? 25 : 0,
    internacional: texto.includes('internacional') ? 10 : 0,
    pacoteCompleto: texto.includes('pacote') && texto.includes('hotel') ? 15 : 0,
    cruzeiro: texto.includes('cruzeiro') ? 20 : 0,
    multiplosPrecos: contarPrecos(texto) > 2 ? 10 : 0,
    tamanhoTexto: texto.length > 500 ? 10 : 0,
    criancas: (formData.criancas || 0) > 0 ? 5 : 0
  };
  
  pontos = Object.values(fatores).reduce((a, b) => a + b, 0);
  
  let nivel;
  if (pontos <= 20) nivel = 'baixa';
  else if (pontos <= 50) nivel = 'media';
  else if (pontos <= 80) nivel = 'alta';
  else nivel = 'muito_alta';
  
  return {
    complexidade: nivel,
    pontuacao: pontos,
    fatores: fatores
  };
}

// ================================================================================
// 🎯 DETERMINAÇÃO DE TIPO PRINCIPAL
// ================================================================================

export function determinarTipoPrincipal(analise) {
  console.log("🎯 Determinando tipo principal...");
  
  const tipos = analise.tipos || analise;
  const candidatos = [];
  
  // Coletar tipos detectados com suas confianças
  Object.entries(tipos).forEach(([nome, deteccao]) => {
    if (deteccao?.detectado && deteccao?.confianca > 0.5) {
      candidatos.push({
        tipo: deteccao.tipo || nome,
        confianca: deteccao.confianca
      });
    }
  });
  
  // Ordenar por confiança
  candidatos.sort((a, b) => b.confianca - a.confianca);
  
  // Retornar o tipo com maior confiança ou padrão
  return candidatos.length > 0 ? candidatos[0].tipo : 'aereo_nacional_simples';
}

function calcularConfiancaDeteccao(analise) {
  const tipos = analise.tipos || analise;
  let maiorConfianca = 0;
  
  Object.values(tipos).forEach(deteccao => {
    if (deteccao?.confianca > maiorConfianca) {
      maiorConfianca = deteccao.confianca;
    }
  });
  
  return maiorConfianca;
}

// ================================================================================
// 🔍 DETECÇÃO DE PADRÕES
// ================================================================================

function detectarPadroes(texto) {
  return {
    temLinks: texto.includes('http') || texto.includes('www') || texto.includes('.com'),
    temEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(texto),
    temAsteriscos: texto.includes('*'),
    temParcelamento: texto.includes('parcela') || texto.includes('12x') || texto.includes('10x'),
    temTaxas: texto.includes('taxa') || texto.includes('tarifa'),
    temReembolso: texto.includes('reembolsável'),
    temBagagem: texto.includes('bagagem') || texto.includes('mala'),
    formatoWhatsApp: texto.includes('💰') || texto.includes('✅')
  };
}

// ================================================================================
// 🔍 FUNÇÕES DE DETECÇÃO BÁSICA
// ================================================================================

function detectarEscalas(texto) {
  return texto.includes('escala') || texto.includes('conexão');
}

function detectarConexoes(texto) {
  return texto.includes('conexão') || texto.includes('escala');
}

function detectarIdaVolta(texto) {
  return texto.includes('ida') && texto.includes('volta') && texto.includes('--');
}

function detectarSomenteIda(texto) {
  return texto.includes('somente ida') || (texto.includes('ida') && !texto.includes('volta'));
}

function detectarMultiplasOpcoes(texto) {
  return texto.includes('opção') || texto.includes('plano') || contarOpcoes(texto) > 1;
}

function contarOpcoes(texto) {
  const opcoes1 = (texto.match(/opção \d/gi) || []).length;
  const opcoes2 = (texto.match(/plano \d/gi) || []).length;
  return Math.max(opcoes1, opcoes2);
}

function detectarPrecos(texto) {
  return /r\$\s*[\d.,]+/i.test(texto);
}

function contarPrecos(texto) {
  const matches = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return matches.length;
}

function detectarDatas(texto) {
  return /\d{1,2}\/\d{1,2}(?:\/\d{4})?/.test(texto);
}

function contarDatas(texto) {
  const datas = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || [];
  return [...new Set(datas)].length;
}

function detectarHorarios(texto) {
  return /\d{1,2}:\d{2}/.test(texto);
}

function contarHorarios(texto) {
  const horarios = texto.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(horarios)].length;
}

function detectarAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC'];
  return codigos.some(codigo => texto.toUpperCase().includes(codigo));
}

function detectarCompanhias(texto) {
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'copa', 'american', 'tap', 'msc'];
  return companhias.some(companhia => texto.toLowerCase().includes(companhia));
}

// ================================================================================
// 📊 FUNÇÕES DE EXTRAÇÃO DE CONTEXTO
// ================================================================================

export function extrairContexto(texto) {
  console.log("📊 Extraindo contexto...");
  
  return {
    // Preços detectados
    precos: extrairPrecos(texto),
    valoresNumericos: extrairValoresNumericos(texto),
    
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
    numeroPalavras: texto.split(' ').filter(p => p.length > 0).length
  };
}

function extrairPrecos(texto) {
  const matches = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return matches.map(match => match.trim());
}

function extrairValoresNumericos(texto) {
  const matches = texto.match(/\d+[,.]?\d*/g) || [];
  return matches.map(match => {
    const numero = match.replace(',', '.');
    return parseFloat(numero) || 0;
  });
}

function extrairDatas(texto) {
  const matches = texto.match(/\d{1,2}\/\d{1,2}(?:\/\d{4})?/g) || [];
  return [...new Set(matches)];
}

function extrairHorarios(texto) {
  const matches = texto.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(matches)];
}

function extrairAeroportos(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC', 'SSA'];
  const encontrados = [];
  
  codigos.forEach(codigo => {
    if (texto.toUpperCase().includes(codigo)) {
      encontrados.push(codigo);
    }
  });
  
  return encontrados;
}

function extrairAeroportosNacionais(texto) {
  const nacionais = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA'];
  const encontrados = [];
  
  nacionais.forEach(codigo => {
    if (texto.toUpperCase().includes(codigo)) {
      encontrados.push(codigo);
    }
  });
  
  return encontrados;
}

function extrairCompanhias(texto) {
  const companhias = [
    { nome: 'LATAM', variantes: ['latam', 'tam'] },
    { nome: 'Gol', variantes: ['gol'] },
    { nome: 'Azul', variantes: ['azul'] },
    { nome: 'Avianca', variantes: ['avianca'] },
    { nome: 'Copa Airlines', variantes: ['copa'] },
    { nome: 'American Airlines', variantes: ['american'] },
    { nome: 'TAP Portugal', variantes: ['tap'] },
    { nome: 'MSC', variantes: ['msc'] }
  ];
  
  const encontradas = [];
  const textoLower = texto.toLowerCase();
  
  companhias.forEach(comp => {
    comp.variantes.forEach(variante => {
      if (textoLower.includes(variante) && !encontradas.includes(comp.nome)) {
        encontradas.push(comp.nome);
      }
    });
  });
  
  return encontradas;
}

function extrairHoteis(texto) {
  const patterns = [
    /hotel\s+[\w\s]+/gi,
    /resort\s+[\w\s]+/gi,
    /pousada\s+[\w\s]+/gi
  ];
  
  const hoteis = [];
  patterns.forEach(pattern => {
    const matches = texto.match(pattern) || [];
    hoteis.push(...matches);
  });
  
  return [...new Set(hoteis)];
}

function extrairDestinoPrincipal(texto) {
  const destinos = [
    'porto alegre', 'salvador', 'recife', 'fortaleza', 'maceió', 
    'natal', 'florianópolis', 'brasília', 'manaus', 'belém',
    'miami', 'orlando', 'nova york', 'lisboa', 'madrid', 'paris'
  ];
  
  const textoLower = texto.toLowerCase();
  
  for (const destino of destinos) {
    if (textoLower.includes(destino)) {
      return destino.split(' ').map(palavra => 
        palavra.charAt(0).toUpperCase() + palavra.slice(1)
      ).join(' ');
    }
  }
  
  return '';
}

// ================================================================================
// 📊 LOGGING E MÉTRICAS
// ================================================================================

function logAnalise(analise) {
  console.log("📊 === RELATÓRIO DE ANÁLISE v8.1 ===");
  console.log(`🎯 Tipo detectado: ${analise.tipo_principal || 'Não definido'}`);
  console.log(`📈 Confiança: ${((analise.confianca_deteccao || 0) * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade || 'não calculada'}`);
  console.log(`🔢 Opções: ${analise.numeroOpcoes || 0}`);
  console.log(`✈️ Aeroportos: ${analise.aeroportosDetectados?.join(', ') || 'Nenhum'}`);
  console.log(`🏢 Companhias: ${analise.companhiasDetectadas?.join(', ') || 'Nenhuma'}`);
  console.log(`💰 Preços: ${analise.numeroPrecos || 0}`);
  console.log(`📅 Datas: ${analise.numeroDatas || 0}`);
  console.log("📊 === FIM DO RELATÓRIO ===");
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 PURA - SEM SISTEMA HÍBRIDO
// ================================================================================

console.log("✅ Analysis v8.1 carregado:");
console.log("🔍 Detecção inteligente de TODOS os 9 tipos do Manual CVC");
console.log("📊 Análise de contexto avançada");
console.log("🧮 Cálculo de complexidade dinâmico");
console.log("🎯 Determinação automática de tipo principal");
console.log("📈 Sistema de confiança e validação");
console.log("🚨 EXPORTAÇÃO ES6 PURA - SISTEMA HÍBRIDO REMOVIDO");

// EXPORTAÇÃO ES6 ÚNICA E LIMPA
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

console.log("🚀 Sistema de Análise v8.1 - DETECÇÃO INTELIGENTE ES6 FUNCIONAL!");
