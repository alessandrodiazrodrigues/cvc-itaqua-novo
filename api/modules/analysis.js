// 🔍 analysis.js - SISTEMA COMPLETO DE ANÁLISE v11.0
// CORREÇÃO FINAL: Removido 'export' duplicado de todas as constantes e da função principal.
// Baseado em padrões reais: GOL, LATAM, Azul + CVC

console.log("🔍 Analysis v11.0 - SISTEMA COMPLETO DE ANÁLISE CARREGADO");

// ================================================================================
// 1. 🎯 CONSTANTES (PADRÕES DE DETECÇÃO ESPECIALIZADOS)
// ================================================================================

// CORREÇÃO: A palavra 'export' foi removida da frente de todas as constantes abaixo.

const PADROES_COMPANHIAS = {
  'gol': { nome: 'GOL', tipo: 'nacional', cor: 'laranja' },
  'latam': { nome: 'LATAM', tipo: 'nacional_internacional', cor: 'vermelho' },
  'azul': { nome: 'Azul', tipo: 'nacional', cor: 'azul' },
  'iberia': { nome: 'Iberia', tipo: 'internacional', cor: 'vermelho' },
  'tap': { nome: 'TAP Portugal', tipo: 'internacional', cor: 'verde' },
  'lufthansa': { nome: 'Lufthansa', tipo: 'internacional', cor: 'amarelo' },
  'air france': { nome: 'Air France', tipo: 'internacional', cor: 'azul' },
  'airfrance': { nome: 'Air France', tipo: 'internacional', cor: 'azul' },
  'klm': { nome: 'KLM', tipo: 'internacional', cor: 'azul' },
  'emirates': { nome: 'Emirates', tipo: 'internacional', cor: 'dourado' },
  'american': { nome: 'American Airlines', tipo: 'internacional', cor: 'vermelho' },
  'costa': { nome: 'Costa Cruzeiros', tipo: 'cruzeiro', cor: 'amarelo' },
  'msc': { nome: 'MSC Cruzeiros', tipo: 'cruzeiro', cor: 'azul' },
  'disney': { nome: 'Disney Cruise Line', tipo: 'cruzeiro', cor: 'azul' },
  'royal caribbean': { nome: 'Royal Caribbean', tipo: 'cruzeiro', cor: 'azul' },
  'royal': { nome: 'Royal Caribbean', tipo: 'cruzeiro', cor: 'azul' },
  'norwegian': { nome: 'Norwegian Cruise Line', tipo: 'cruzeiro', cor: 'azul' },
  'celebrity': { nome: 'Celebrity Cruises', tipo: 'cruzeiro', cor: 'preto' }
};

const NAVIOS_CONHECIDOS = {
  'costa diadema': 'Costa Cruzeiros',
  'costa fascinosa': 'Costa Cruzeiros',
  'costa favolosa': 'Costa Cruzeiros',
  'msc seaview': 'MSC Cruzeiros',
  'msc preziosa': 'MSC Cruzeiros',
  'msc splendida': 'MSC Cruzeiros'
};

const PORTOS_CRUZEIROS = {
  'santos': { nome: 'Santos', estado: 'São Paulo', tipo: 'nacional' },
  'rio de janeiro': { nome: 'Rio de Janeiro', estado: 'Rio de Janeiro', tipo: 'nacional' },
  'salvador': { nome: 'Salvador', estado: 'Bahia', tipo: 'nacional' },
  'itajai': { nome: 'Itajaí', estado: 'Santa Catarina', tipo: 'nacional' },
  'itajaí': { nome: 'Itajaí', estado: 'Santa Catarina', tipo: 'nacional' },
  'recife': { nome: 'Recife', estado: 'Pernambuco', tipo: 'nacional' },
  'maceio': { nome: 'Maceió', estado: 'Alagoas', tipo: 'nacional' },
  'buenos aires': { nome: 'Buenos Aires', pais: 'Argentina', tipo: 'internacional' },
  'montevideu': { nome: 'Montevidéu', pais: 'Uruguai', tipo: 'internacional' },
  'barcelona': { nome: 'Barcelona', pais: 'Espanha', tipo: 'internacional' },
  'roma': { nome: 'Roma', pais: 'Itália', tipo: 'internacional' }
};

const TIPOS_CABINE_CRUZEIRO = {
  'interna': { nome: 'Cabine Interna', caracteristica: 'sem janela' },
  'externa': { nome: 'Cabine Externa', caracteristica: 'com janela' },
  'suite': { nome: 'Suíte', caracteristica: 'luxo' },
  'grand suite': { nome: 'Grand Suíte', caracteristica: 'luxo premium' },
  'suíte com varanda': { nome: 'Suíte com Varanda', caracteristica: 'varanda privativa' },
  'grand suíte com varanda': { nome: 'Grand Suíte com Varanda', caracteristica: 'luxo com varanda' }
};

const PLANOS_CRUZEIRO = {
  'my cruise': { nome: 'My Cruise', tipo: 'basico' },
  'all inclusive': { nome: 'All Inclusive', tipo: 'completo' },
  'my drinks': { nome: 'My Drinks', tipo: 'bebidas' },
  'my drinks plus': { nome: 'My Drinks Plus', tipo: 'bebidas_premium' }
};

const TIPOS_HOSPEDAGEM = {
  'hotel': { nome: 'Hotel', tipo: 'tradicional' },
  'resort': { nome: 'Resort', tipo: 'all_inclusive' },
  'pousada': { nome: 'Pousada', tipo: 'local' },
  'flat': { nome: 'Flat', tipo: 'apartamento' },
  'aparthotel': { nome: 'Apart Hotel', tipo: 'apartamento' },
  'inn': { nome: 'Inn', tipo: 'boutique' }
};

const REGIMES_HOSPEDAGEM = {
  'cafe da manha': { nome: 'Café da Manhã', tipo: 'meia_pensao' },
  'café da manhã': { nome: 'Café da Manhã', tipo: 'meia_pensao' },
  'meia pensao': { nome: 'Meia Pensão', tipo: 'meia_pensao' },
  'pensao completa': { nome: 'Pensão Completa', tipo: 'pensao_completa' },
  'all inclusive': { nome: 'All Inclusive', tipo: 'tudo_incluso' },
  'sem refeicao': { nome: 'Sem Refeição', tipo: 'hospedagem_simples' }
};

const TIPOS_QUARTO_HOTEL = {
  'standard': { nome: 'Standard', categoria: 'basico' },
  'standard frete': { nome: 'Standard Frete', categoria: 'basico' },
  'superior': { nome: 'Superior', categoria: 'intermediario' },
  'luxo': { nome: 'Luxo', categoria: 'premium' },
  'suite': { nome: 'Suíte', categoria: 'premium' },
  'master': { nome: 'Master', categoria: 'premium' },
  'promo': { nome: 'Promocional', categoria: 'promocional' },
  'frete': { nome: 'Frete', categoria: 'basico' },
  'apartamento': { nome: 'Apartamento', categoria: 'apartamento' },
  'apartamento familia': { nome: 'Apartamento Família', categoria: 'familia' },
  's2c': { nome: 'Apartamento Família Queen + Bicama', categoria: 'familia' },
  's2d': { nome: 'Apartamento Família Queen + Bicama Vista Mar', categoria: 'familia_premium' }
};

const CATEGORIAS_HOTEL = {
  'preferencial': { nome: 'Preferencial', tipo: 'parceria_especial' },
  'executivo': { nome: 'Executivo', tipo: 'business' },
  'luxo': { nome: 'Luxo', tipo: 'premium' },
  'economico': { nome: 'Econômico', tipo: 'basico' },
  'econômico': { nome: 'Econômico', tipo: 'basico' }
};

const POLITICAS_CANCELAMENTO = {
  'reembolsavel': { nome: 'Reembolsável', flexibilidade: 'alta' },
  'reembolsável': { nome: 'Reembolsável', flexibilidade: 'alta' },
  'nao reembolsavel': { nome: 'Não Reembolsável', flexibilidade: 'baixa' },
  'não reembolsável': { nome: 'Não Reembolsável', flexibilidade: 'baixa' },
  'flexivel': { nome: 'Flexível', flexibilidade: 'media' },
  'flexível': { nome: 'Flexível', flexibilidade: 'media' }
};

const SERVICOS_PACOTE = {
  'transporte aereo': 'Transporte Aéreo',
  'hospedagem': 'Hospedagem', 
  'transporte': 'Transfers',
  'transfer': 'Transfers',
  'city tour': 'City Tour',
  'by night': 'By Night',
  'atividades': 'Atividades Inclusas',
  'passeios': 'Passeios',
  'receptivo': 'Receptivo Local'
};

const AEROPORTOS_BRASILEIROS = {
  'gru': { nome: 'São Paulo/Guarulhos', cidade: 'São Paulo', tipo: 'internacional' },
  'cgh': { nome: 'São Paulo/Congonhas', cidade: 'São Paulo', tipo: 'nacional' },
  'vcp': { nome: 'Campinas/Viracopos', cidade: 'Campinas', tipo: 'internacional' },
  'sdu': { nome: 'Rio de Janeiro/Santos Dumont', cidade: 'Rio de Janeiro', tipo: 'nacional' },
  'gig': { nome: 'Rio de Janeiro/Galeão', cidade: 'Rio de Janeiro', tipo: 'internacional' },
  'bps': { nome: 'Porto Seguro', cidade: 'Porto Seguro', tipo: 'nacional' },
  'ssa': { nome: 'Salvador', cidade: 'Salvador', tipo: 'internacional' },
  'rec': { nome: 'Recife', cidade: 'Recife', tipo: 'internacional' },
  'for': { nome: 'Fortaleza', cidade: 'Fortaleza', tipo: 'internacional' },
  'bsb': { nome: 'Brasília', cidade: 'Brasília', tipo: 'internacional' }
};

const AEROPORTOS_INTERNACIONAIS = {
  'cdg': { nome: 'Paris/Charles de Gaulle', cidade: 'Paris', pais: 'França' },
  'lin': { nome: 'Milão/Linate', cidade: 'Milão', pais: 'Itália' },
  'mxp': { nome: 'Milão/Malpensa', cidade: 'Milão', pais: 'Itália' },
  'fco': { nome: 'Roma/Fiumicino', cidade: 'Roma', pais: 'Itália' },
  'mad': { nome: 'Madrid/Barajas', cidade: 'Madrid', pais: 'Espanha' },
  'lis': { nome: 'Lisboa', cidade: 'Lisboa', pais: 'Portugal' },
  'lhr': { nome: 'Londres/Heathrow', cidade: 'Londres', pais: 'Reino Unido' },
  'jfk': { nome: 'Nova York/JFK', cidade: 'Nova York', pais: 'Estados Unidos' },
  'mia': { nome: 'Miami', cidade: 'Miami', pais: 'Estados Unidos' }
};

const TODOS_AEROPORTOS = { ...AEROPORTOS_BRASILEIROS, ...AEROPORTOS_INTERNACIONAIS };

const PADROES_VOOS = {
  'voo_direto': /voo\s+direto/gi,
  'uma_conexao': /(uma\s+escala|1\s+escala|uma\s+conexão|1\s+conexão)/gi,
  'duas_conexoes': /(duas\s+escalas|2\s+escalas|duas\s+conexões|2\s+conexões)/gi,
  'multiplas_conexoes': /(três\s+escalas|3\s+escalas|múltiplas\s+escalas)/gi
};

// ================================================================================
// 2. 🎯 FUNÇÃO PRINCIPAL DE ANÁLISE
// ================================================================================

// CORREÇÃO: Removido 'export' da linha abaixo
function analisarTextoCompleto(formData) {
  console.log("🔍 === ANÁLISE COMPLETA v11.0 INICIADA ===");
  
  const textoCompleto = construirTextoAnalise(formData);
  console.log(`📋 Texto para análise: ${textoCompleto.length} caracteres`);
  
  // PRIORIDADE: Dados HTML sobre extração
  const dadosHTML = extrairDadosHTML(formData);
  console.log("🎯 Dados HTML prioritários:", dadosHTML);
  
  // Análise em múltiplas camadas
  let analise = {
    // Dados HTML com prioridade
    ...dadosHTML,
    
    // Detecção básica
    ...detectarTipoViagem(textoCompleto),
    
    // Extração de dados específicos
    ...extrairDadosVoo(textoCompleto),
    
    // Extração de dados de cruzeiros
    ...extrairDadosCruzeiro(textoCompleto),
    
    // Extração de dados de pacotes
    ...extrairDadosPacote(textoCompleto),
    
    // Extração de dados de hotéis
    ...extrairDadosHotel(textoCompleto),
    
    // Análise de preços CVC
    ...analisarPrecosCVC(textoCompleto),
    
    // Detecção de múltiplas opções
    ...detectarMultiplasOpcoes(textoCompleto),
    
    // Detecção de multitrechos avançados
    ...detectarMultitrechoAvancado(textoCompleto),
    
    // Análise de complexidade
    ...calcularComplexidade(textoCompleto),
    
    // Contexto adicional
    contexto: extrairContextoCompleto(formData),
    timestamp: new Date().toISOString()
  };
  
  // Aplicar prioridade HTML sobre extração
  analise = aplicarPrioridadeHTML(analise, dadosHTML);
  
  // Determinar tipo principal e confiança
  analise.tipoDetectado = determinarTipoPrincipal(analise);
  analise.confiancaDeteccao = calcularConfiancaDeteccao(analise);
  
  // Log detalhado da análise
  logAnaliseCompleta(analise);
  
  console.log("🔍 === ANÁLISE COMPLETA FINALIZADA ===");
  return analise;
}

// ================================================================================
// 3. 🎯 EXTRAÇÃO DE DADOS HTML COM PRIORIDADE
// ================================================================================

function extrairDadosHTML(formData) {
  console.log("🎯 Extraindo dados HTML com prioridade...");
  
  const dadosHTML = {
    destinoHTML: formData.destino?.trim() || null,
    adultosHTML: formData.adultos || null,
    criancasHTML: formData.criancas || null,
    tiposHTML: formData.tipos || [],
    temImagemHTML: !!formData.imagemBase64
  };
  
  console.log("🎯 Dados HTML extraídos:", dadosHTML);
  return dadosHTML;
}

function aplicarPrioridadeHTML(analise, dadosHTML) {
  console.log("🎯 Aplicando prioridade HTML sobre extração...");
  
  // Destino: HTML prevalece
  if (dadosHTML.destinoHTML) {
    analise.dadosVoo = analise.dadosVoo || {};
    analise.dadosVoo.destinoFinal = dadosHTML.destinoHTML;
    console.log(`✅ Destino HTML usado: ${dadosHTML.destinoHTML}`);
  }
  
  // Passageiros: HTML prevalece
  if (dadosHTML.adultosHTML) {
    analise.numeroPassageirosHTML = dadosHTML.adultosHTML;
    console.log(`✅ Adultos HTML: ${dadosHTML.adultosHTML}`);
  }
  
  if (dadosHTML.criancasHTML) {
    analise.numeroCriancasHTML = dadosHTML.criancasHTML;
    console.log(`✅ Crianças HTML: ${dadosHTML.criancasHTML}`);
  }
  
  // Tipos: HTML prevalece
  if (dadosHTML.tiposHTML?.length > 0) {
    analise.tiposHTMLSelecionados = dadosHTML.tiposHTML;
    console.log(`✅ Tipos HTML: ${dadosHTML.tiposHTML.join(', ')}`);
  }
  
  return analise;
}

// ================================================================================
// 4. 🌍 DETECÇÃO DE MULTITRECHO AVANÇADO
// ================================================================================

function detectarMultitrechoAvancado(texto) {
  console.log("🌍 Detectando multitrecho avançado...");
  
  const multitrecho = {
    isMultitrechoInternacional: false,
    numeroTrechos: 0,
    trechosDetalhados: [],
    companhiaPrincipal: null,
    aeroportosInternacionais: []
  };
  
  const trechosExplicitos = texto.match(/trecho\s*\d+/gi) || [];
  multitrecho.numeroTrechos = trechosExplicitos.length;
  
  if (multitrecho.numeroTrechos > 1) {
    console.log(`✅ ${multitrecho.numeroTrechos} trechos explícitos detectados`);
    
    for (let i = 1; i <= multitrecho.numeroTrechos; i++) {
      const trecho = extrairTrechoEspecifico(texto, i);
      if (trecho) {
        multitrecho.trechosDetalhados.push(trecho);
      }
    }
    
    const aeroportosInternacionais = Object.keys(AEROPORTOS_INTERNACIONAIS);
    const aeroportosDetectados = aeroportosInternacionais.filter(codigo => 
      texto.toLowerCase().includes(codigo.toLowerCase())
    );
    
    if (aeroportosDetectados.length > 0) {
      multitrecho.isMultitrechoInternacional = true;
      multitrecho.aeroportosInternacionais = aeroportosDetectados;
      console.log(`✅ Multitrecho internacional - Aeroportos: ${aeroportosDetectados.join(', ')}`);
    }
    
    const companhias = Object.keys(PADROES_COMPANHIAS);
    multitrecho.companhiaPrincipal = companhias.find(comp => 
      texto.toLowerCase().includes(comp)
    );
  }
  
  return multitrecho;
}

function extrairTrechoEspecifico(texto, numeroTrecho) {
  console.log(`✈️ Extraindo trecho ${numeroTrecho}...`);
  const padraoTrecho = new RegExp(`trecho\\s*${numeroTrecho}[\\s\\S]*?(?=trecho\\s*${numeroTrecho + 1}|fácil|não reembolsável|total|$)`, 'gi');
  const matchTrecho = padraoTrecho.exec(texto);
  
  if (!matchTrecho) return null;
  
  const textoTrecho = matchTrecho[0];
  const trecho = {
    numero: numeroTrecho,
    horarioSaida: extrairHorario(textoTrecho, 'primeiro'),
    aeroportoSaida: extrairAeroportoTodos(textoTrecho, 'primeiro'),
    horarioChegada: extrairHorario(textoTrecho, 'segundo'),
    aeroportoChegada: extrairAeroportoTodos(textoTrecho, 'segundo'),
    duracao: extrairDuracao(textoTrecho),
    tipoVoo: extrairTipoVoo(textoTrecho),
    data: extrairDataTrecho(textoTrecho)
  };
  
  console.log(`✅ Trecho ${numeroTrecho} extraído:`, trecho);
  return trecho;
}

function extrairAeroportoTodos(texto, posicao = 'primeiro') {
  const todosAeroportos = Object.keys(TODOS_AEROPORTOS);
  const regex = new RegExp(`\\b(${todosAeroportos.join('|')})\\b`, 'gi');
  const matches = [...texto.matchAll(regex)];
  
  if (posicao === 'primeiro' && matches.length > 0) {
    return matches[0][1].toUpperCase();
  } else if (posicao === 'segundo' && matches.length > 1) {
    return matches[1][1].toUpperCase();
  }
  
  return null;
}

function extrairDataTrecho(texto) {
  const padraoData = /(\w+,?\s*\d{1,2}\s+de\s+\w+|\d{1,2}\/\d{1,2})/gi;
  const match = padraoData.exec(texto);
  return match ? match[1] : null;
}

// ================================================================================
// 5. 🛫 DETECÇÃO DE TIPOS
// ================================================================================

function detectarTipoViagem(texto) {
  console.log("🛫 Detectando tipo de viagem...");
  
  const tipos = {
    isVooNacional: false,
    isVooInternacional: false,
    isMultitrecho: false,
    isCruzeiro: false,
    isHotel: false,
    isPacote: false
  };
  
  const aeroportosBrasileiros = Object.keys(AEROPORTOS_BRASILEIROS);
  const aeroportosInternacionais = Object.keys(AEROPORTOS_INTERNACIONAIS);
  
  const aeroportosBrasDetectados = aeroportosBrasileiros.filter(codigo => 
    texto.toLowerCase().includes(codigo.toLowerCase())
  );
  
  const aeroportosIntDetectados = aeroportosInternacionais.filter(codigo => 
    texto.toLowerCase().includes(codigo.toLowerCase())
  );
  
  if (aeroportosBrasDetectados.length > 0) {
    tipos.isVooNacional = true;
  }
  
  if (aeroportosIntDetectados.length > 0) {
    tipos.isVooInternacional = true;
  }
  
  const companhiasDetectadas = [];
  Object.keys(PADROES_COMPANHIAS).forEach(companhia => {
    if (texto.toLowerCase().includes(companhia)) {
      companhiasDetectadas.push(PADROES_COMPANHIAS[companhia].nome);
      if (PADROES_COMPANHIAS[companhia].tipo.includes('internacional')) {
        tipos.isVooInternacional = true;
      }
    }
  });
  
  const trechos = (texto.match(/trecho\s*\d+/gi) || []).length;
  if (trechos > 1) {
    tipos.isMultitrecho = true;
  }
  
  if (detectarCruzeiro(texto)) tipos.isCruzeiro = true;
  if (detectarPacote(texto)) tipos.isPacote = true;
  if (detectarHotel(texto)) tipos.isHotel = true;
  
  console.log("🛫 Tipos detectados:", tipos);
  return {
    ...tipos,
    companhiasDetectadas,
    aeroportosDetectados: [...aeroportosBrasDetectados, ...aeroportosIntDetectados]
  };
}

// ================================================================================
// 6. 🚢 DETECÇÃO ESPECÍFICA DE CRUZEIROS
// ================================================================================

function detectarCruzeiro(texto) {
  console.log("🚢 Detectando cruzeiros...");
  const palavrasChaveCruzeiro = [
    'embarque:', 'desembarque:', 'navio', 'cruzeiro', 'cabine', 'suite',
    'my cruise', 'all inclusive', 'costa diadema', 'msc', 'noites •',
    'em navegação', 'porto', 'itinerário'
  ];
  const naviosDetectados = Object.keys(NAVIOS_CONHECIDOS).filter(navio => 
    texto.toLowerCase().includes(navio.toLowerCase())
  );
  const companhiasCruzeiroDetectadas = ['costa', 'msc', 'disney', 'royal', 'norwegian'].filter(comp => 
    texto.toLowerCase().includes(comp)
  );
  const portosDetectados = Object.keys(PORTOS_CRUZEIROS).filter(porto => 
    texto.toLowerCase().includes(porto.toLowerCase())
  );
  const isCruzeiro = 
    palavrasChaveCruzeiro.some(palavra => texto.toLowerCase().includes(palavra.toLowerCase())) ||
    naviosDetectados.length > 0 ||
    companhiasCruzeiroDetectadas.length > 0 ||
    (portosDetectados.length > 0 && texto.includes('embarque'));
  
  if (isCruzeiro) {
    console.log("✅ Indicadores de cruzeiro encontrados");
  }
  return isCruzeiro;
}

// ================================================================================
// 7. 📦 DETECÇÃO ESPECÍFICA DE PACOTES
// ================================================================================

function detectarPacote(texto) {
  console.log("📦 Detectando pacotes...");
  const temHotel = Object.keys(TIPOS_HOSPEDAGEM).some(tipo => texto.toLowerCase().includes(tipo));
  const temVoo = texto.includes('ida') && texto.includes('volta') && (texto.includes('gru') || texto.includes('cgh') || texto.includes('vcp'));
  const temServicosInclusos = Object.keys(SERVICOS_PACOTE).some(servico => texto.toLowerCase().includes(servico));
  const temDesconto = /-\d+%/.test(texto) || /~~R\$/.test(texto);
  const temDiarias = /\d+\s*diárias?/.test(texto);
  const temRegime = Object.keys(REGIMES_HOSPEDAGEM).some(regime => texto.toLowerCase().includes(regime));
  const palavrasChavePacote = ['serviços inclusos', 'transporte aéreo', 'hospedagem', 'city tour', 'by night', 'receptivo', 'transfer', 'aeroporto / hotel', 'cafe da manha', 'standard promo'];
  const temPalavrasChave = palavrasChavePacote.some(palavra => texto.toLowerCase().includes(palavra.toLowerCase()));
  const isPacote = (temHotel && temVoo) || (temHotel && temServicosInclusos) || (temVoo && temDiarias) || (temDesconto && temRegime) || temPalavrasChave;
  if (isPacote) {
    console.log("✅ Indicadores de pacote encontrados");
  }
  return isPacote;
}

// ================================================================================
// 8. 🏨 DETECÇÃO ESPECÍFICA DE HOTEL
// ================================================================================

function detectarHotel(texto) {
  console.log("🏨 Detectando hotel...");
  
  // Padrões específicos de hotel
  const padroesHotel = [
    /\*\*(Preferencial|Executivo|Luxo|Econômico)\*\*/gi,
    /Standard\s+Frete/gi,
    /Apartamento\s+Família/gi,
    /Vista\s+Mar/gi,
    /Reembolsável/gi,
    /S2c\s*-\s*Apartamento/gi,
    /S2d\s*-\s*Apartamento/gi
  ];
  
  const temPadraoHotel = padroesHotel.some(padrao => padrao.test(texto));
  
  // Verificar se tem elementos de hotel
  const temHotel = Object.keys(TIPOS_HOSPEDAGEM).some(tipo => 
    texto.toLowerCase().includes(tipo)
  );
  
  const temRegime = Object.keys(REGIMES_HOSPEDAGEM).some(regime => 
    texto.toLowerCase().includes(regime)
  );
  
  const temQuarto = Object.keys(TIPOS_QUARTO_HOTEL).some(tipo => 
    texto.toLowerCase().includes(tipo)
  );
  
  // Verificar se NÃO tem elementos de voo
  const temElementosVoo = /\*\*(ida|volta)\*\*/gi.test(texto) || 
                          /(GRU|CGH|VCP|SDU|GIG)/gi.test(texto);
  
  // Palavras-chave de hotel
  const palavrasChaveHotel = ['hospedagem', 'quarto', 'diaria', 'check-in', 'check-out'];
  const temPalavrasChave = palavrasChaveHotel.some(palavra => 
    texto.toLowerCase().includes(palavra)
  );
  
  const isHotel = (temPadraoHotel || temHotel || temRegime || temQuarto || temPalavrasChave) && !temElementosVoo;
  
  if (isHotel) {
    console.log("✅ Hotel detectado (sem voos)");
  }
  
  return isHotel;
}

// ================================================================================
// 9. ✈️ EXTRAÇÃO DE DADOS DE VOO
// ================================================================================

function extrairDadosVoo(texto) {
  console.log("✈️ Extraindo dados de voo...");
  
  const dadosVoo = {
    periodo: null,
    origem: null,
    destino: null,
    companhiaPrincipal: null,
    vooIda: null,
    vooVolta: null,
    numeroPassageiros: null,
    classeVoo: 'Econômica',
    condicoesVoo: []
  };
  
  // Extrair período
  const padrãoPeriodo = /(\d{1,2}\s+de\s+\w+|\d{1,2}\/\d{1,2}).*?(\d{1,2}\s+de\s+\w+|\d{1,2}\/\d{1,2}).*?\((\d+)\s+dias?\s+e\s+(\d+)\s+noites?\)/gi;
  const matchPeriodo = padrãoPeriodo.exec(texto);
  
  if (matchPeriodo) {
    dadosVoo.periodo = {
      ida: matchPeriodo[1],
      volta: matchPeriodo[2], 
      dias: parseInt(matchPeriodo[3]),
      noites: parseInt(matchPeriodo[4])
    };
    console.log("✅ Período extraído:", dadosVoo.periodo);
  }
  
  // Extrair origem e destino
  const padrãoRota = /\*\*(.*?)\s*-\s*(.*?)\*\*/g;
  const matchRota = padrãoRota.exec(texto);
  
  if (matchRota) {
    dadosVoo.origem = matchRota[1].trim();
    dadosVoo.destino = matchRota[2].trim();
    console.log(`✅ Rota extraída: ${dadosVoo.origem} → ${dadosVoo.destino}`);
  }
  
  // Extrair companhia principal
  const companhias = ['Gol', 'Latam', 'Azul', 'Iberia', 'TAP'];
  dadosVoo.companhiaPrincipal = companhias.find(comp => 
    texto.toLowerCase().includes(comp.toLowerCase())
  );
  
  // Extrair dados de ida
  dadosVoo.vooIda = extrairDadosVooTrecho(texto, 'ida');
  
  // Extrair dados de volta  
  dadosVoo.vooVolta = extrairDadosVooTrecho(texto, 'volta');
  
  // Extrair número de passageiros (melhorado para bebês e crianças)
  const passageiros = extrairPassageirosCompleto(texto);
  dadosVoo.numeroPassageiros = passageiros.adultos;
  dadosVoo.numeroCriancas = passageiros.criancas;
  dadosVoo.numeroBebes = passageiros.bebes;
  
  console.log("👥 Passageiros detectados:", passageiros);
  
  // Extrair condições
  if (texto.includes('Não reembolsável')) dadosVoo.condicoesVoo.push('Não reembolsável');
  if (texto.includes('Fácil')) dadosVoo.condicoesVoo.push('Fácil');
  
  console.log("✈️ Dados de voo extraídos:", dadosVoo);
  return { dadosVoo };
}

function extrairDadosVooTrecho(texto, tipoTrecho) {
  console.log(`✈️ Extraindo trecho de ${tipoTrecho}...`);
  
  // Regex para encontrar seção ida ou volta
  const padrãoTrecho = new RegExp(`\\*\\*${tipoTrecho}\\*\\*([\\s\\S]*?)(?=\\*\\*(?:volta|ida)\\*\\*|\\*\\*Fácil\\*\\*|$)`, 'gi');
  const matchTrecho = padrãoTrecho.exec(texto);
  
  if (!matchTrecho) return null;
  
  const textoTrecho = matchTrecho[1];
  
  const dadosTrecho = {
    horarioSaida: extrairHorario(textoTrecho),
    aeroportoSaida: extrairAeroporto(textoTrecho, 'primeiro'),
    horarioChegada: extrairHorario(textoTrecho, 'segundo'),  
    aeroportoChegada: extrairAeroporto(textoTrecho, 'segundo'),
    duracao: extrairDuracao(textoTrecho),
    tipoVoo: extrairTipoVoo(textoTrecho)
  };
  
  console.log(`✅ Dados ${tipoTrecho}:`, dadosTrecho);
  return dadosTrecho;
}

// ================================================================================
// 10. 💰 ANÁLISE DE PREÇOS CVC
// ================================================================================

function analisarPrecosCVC(texto) {
  console.log("💰 Analisando preços CVC...");
  
  const precos = {
    precoTotal: null,
    precoParcelado: null,
    linkCVC: null,
    formaPagamento: null
  };
  
  // Extrair preço total
  const padrãoPrecoTotal = /R\$\s*([\d.,]+)/g;
  const matchesPreco = [...texto.matchAll(padrãoPrecoTotal)];
  
  if (matchesPreco.length > 0) {
    // O primeiro preço geralmente é o total do voo
    precos.precoTotal = matchesPreco[0][1];
    console.log(`✅ Preço total: R$ ${precos.precoTotal}`);
  }
  
  // Extrair parcelamento
  const padrãoParcelado = /Entrada\s+de\s+R\$\s*([\d.,]+).*?(\d+)x\s+de\s+R\$\s*([\d.,]+)/gi;
  const matchParcelado = padrãoParcelado.exec(texto);
  
  if (matchParcelado) {
    precos.precoParcelado = {
      entrada: matchParcelado[1],
      parcelas: parseInt(matchParcelado[2]),
      valorParcela: matchParcelado[3]
    };
    console.log("✅ Parcelamento extraído:", precos.precoParcelado);
  }
  
  // Extrair link CVC
  const padrãoLink = /(https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[a-zA-Z0-9]+)/g;
  const matchLink = padrãoLink.exec(texto);
  
  if (matchLink) {
    precos.linkCVC = matchLink[1];
    console.log("✅ Link CVC extraído");
  }
  
  console.log("💰 Preços analisados:", precos);
  return { precosCVC: precos };
}

// ================================================================================
// 11. 🔄 DETECÇÃO DE MÚLTIPLAS OPÇÕES
// ================================================================================

function detectarMultiplasOpcoes(texto) {
  console.log("🔄 Detectando múltiplas opções...");
  
  const multiplasOpcoes = {
    temMultiplasOpcoes: false,
    numeroOpcoes: 1,
    opcoes: []
  };
  
  // Contar quantas companhias aparecem
  const companhias = ['gol', 'latam', 'azul', 'iberia', 'tap'];
  const companhiasEncontradas = companhias.filter(comp => 
    texto.toLowerCase().includes(comp)
  );
  
  // Contar quantos preços diferentes aparecem
  const precos = [...texto.matchAll(/R\$\s*([\d.,]+)/g)];
  const precosUnicos = [...new Set(precos.map(p => p[1]))];
  
  // Para hotéis, contar quantas vezes aparece o padrão de data
  const padroesDatasHotel = (texto.match(/\*\*\d{1,2}\s+de\s+\w+\s*-\s*\d{1,2}\s+de\s+\w+/gi) || []).length;
  
  if (companhiasEncontradas.length > 1 || precosUnicos.length > 1 || padroesDatasHotel > 1) {
    multiplasOpcoes.temMultiplasOpcoes = true;
    multiplasOpcoes.numeroOpcoes = Math.max(
      companhiasEncontradas.length, 
      precosUnicos.length,
      padroesDatasHotel
    );
    
    console.log(`✅ Múltiplas opções detectadas: ${multiplasOpcoes.numeroOpcoes} opções`);
    if (companhiasEncontradas.length > 0) console.log(`   Companhias: ${companhiasEncontradas.join(', ')}`);
    if (precosUnicos.length > 0) console.log(`   Preços únicos: ${precosUnicos.length}`);
    if (padroesDatasHotel > 1) console.log(`   Opções de hotel: ${padroesDatasHotel}`);
  }
  
  return multiplasOpcoes;
}

// ================================================================================
// 12. 🧮 FUNÇÕES AUXILIARES DE EXTRAÇÃO
// ================================================================================

function extrairHorario(texto, posicao = 'primeiro') {
  const padrãoHorario = /\*\*(\d{1,2}:\d{2})\*\*/g;
  const matches = [...texto.matchAll(padrãoHorario)];
  
  if (posicao === 'primeiro' && matches.length > 0) {
    return matches[0][1];
  } else if (posicao === 'segundo' && matches.length > 1) {
    return matches[1][1];
  }
  
  return null;
}

function extrairAeroporto(texto, posicao = 'primeiro') {
  const aeroportos = Object.keys(AEROPORTOS_BRASILEIROS);
  const regex = new RegExp(`\\b(${aeroportos.join('|')})\\b`, 'gi');
  const matches = [...texto.matchAll(regex)];
  
  if (posicao === 'primeiro' && matches.length > 0) {
    return matches[0][1].toUpperCase();
  } else if (posicao === 'segundo' && matches.length > 1) {
    return matches[1][1].toUpperCase();
  }
  
  return null;
}

function extrairDuracao(texto) {
  const padrãoDuracao = /(\d+h\s*\d+min|\d+h)/gi;
  const match = padrãoDuracao.exec(texto);
  return match ? match[1] : null;
}

function extrairTipoVoo(texto) {
  if (PADROES_VOOS.voo_direto.test(texto)) return 'Voo direto';
  if (PADROES_VOOS.uma_conexao.test(texto)) return 'Uma conexão';  
  if (PADROES_VOOS.duas_conexoes.test(texto)) return 'Duas conexões';
  if (PADROES_VOOS.multiplas_conexoes.test(texto)) return 'Múltiplas conexões';
  return 'Voo direto'; // padrão
}

function extrairPassageirosCompleto(texto) {
  console.log("👥 Extraindo passageiros completo...");
  
  const passageiros = {
    adultos: 0,
    criancas: 0,
    bebes: 0
  };
  
  // Padrão para detectar: "Total (4 Adultos e 1 Bebê)"
  const padraoCompleto = /Total\s*\(([^)]+)\)/gi;
  const matchCompleto = padraoCompleto.exec(texto);
  
  if (matchCompleto) {
    const textoPassageiros = matchCompleto[1];
    console.log("📝 Texto de passageiros encontrado:", textoPassageiros);
    
    // Extrair adultos - CORRIGIDO para pegar número antes da palavra
    const matchAdultos = textoPassageiros.match(/(\d+)\s*[Aa]dulto/);
    if (matchAdultos) {
      passageiros.adultos = parseInt(matchAdultos[1]);
    }
    
    // Extrair crianças - CORRIGIDO
    const matchCriancas = textoPassageiros.match(/(\d+)\s*[Cc]riança/);
    if (matchCriancas) {
      passageiros.criancas = parseInt(matchCriancas[1]);
    }
    
    // Extrair bebês - CORRIGIDO para aceitar singular e plural
    const matchBebes = textoPassageiros.match(/(\d+)\s*[Bb]ebê/);
    if (matchBebes) {
      passageiros.bebes = parseInt(matchBebes[1]);
    }
    
    console.log(`✅ Passageiros extraídos: ${passageiros.adultos} adulto(s), ${passageiros.criancas} criança(s), ${passageiros.bebes} bebê(s)`);
  } else {
    // Fallback para padrão simples
    const padraoSimples = /Total\s*\((\d+)\s*(Adulto|Adult)/gi;
    const matchSimples = padraoSimples.exec(texto);
    if (matchSimples) {
      passageiros.adultos = parseInt(matchSimples[1]);
      console.log(`✅ Passageiros simples: ${passageiros.adultos} adulto(s)`);
    }
  }
  
  return passageiros;
}
// ================================================================================
// 13. 🚢 EXTRAÇÃO DE DADOS DE CRUZEIRO
// ================================================================================

function extrairDadosCruzeiro(texto) {
  console.log("🚢 Extraindo dados de cruzeiro...");
  
  const dadosCruzeiro = {
    navio: null,
    companhiaCruzeiro: null,
    duracao: null,
    embarque: null,
    desembarque: null,
    itinerario: [],
    tiposCabine: [],
    planosDisponiveis: [],
    precosCabines: {},
    taxasInclusas: null
  };
  
  // Extrair nome do navio
  const naviosConhecidos = Object.keys(NAVIOS_CONHECIDOS);
  dadosCruzeiro.navio = naviosConhecidos.find(navio => 
    texto.toLowerCase().includes(navio.toLowerCase())
  );
  
  if (dadosCruzeiro.navio) {
    dadosCruzeiro.companhiaCruzeiro = NAVIOS_CONHECIDOS[dadosCruzeiro.navio];
    console.log(`✅ Navio: ${dadosCruzeiro.navio} (${dadosCruzeiro.companhiaCruzeiro})`);
  }
  
  // Extrair duração
  const padrãoDuracao = /(\d+)\s*noites/gi;
  const matchDuracao = padrãoDuracao.exec(texto);
  if (matchDuracao) {
    dadosCruzeiro.duracao = `${matchDuracao[1]} noites`;
    console.log(`✅ Duração: ${dadosCruzeiro.duracao}`);
  }
  
  // Extrair embarque e desembarque
  const padrãoEmbarque = /embarque:\s*([^,\n]+)/gi;
  const matchEmbarque = padrãoEmbarque.exec(texto);
  if (matchEmbarque) {
    dadosCruzeiro.embarque = matchEmbarque[1].trim();
  }
  
  const padrãoDesembarque = /desembarque:\s*([^,\n]+)/gi;
  const matchDesembarque = padrãoDesembarque.exec(texto);
  if (matchDesembarque) {
    dadosCruzeiro.desembarque = matchDesembarque[1].trim();
  }
  
  // Extrair itinerário
  dadosCruzeiro.itinerario = extrairItinerarioCruzeiro(texto);
  
  // Extrair tipos de cabine disponíveis
  dadosCruzeiro.tiposCabine = Object.keys(TIPOS_CABINE_CRUZEIRO).filter(tipo => 
    texto.toLowerCase().includes(tipo)
  );
  
  // Extrair planos disponíveis
  dadosCruzeiro.planosDisponiveis = Object.keys(PLANOS_CRUZEIRO).filter(plano => 
    texto.toLowerCase().includes(plano)
  );
  
  // Extrair preços por cabine
  dadosCruzeiro.precosCabines = extrairPrecosCabines(texto);
  
  // Extrair taxas
  const padraoTaxas = /taxas?\s*e?\s*impostos?\s*r\$\s*([\d.,]+)/gi;
  const matchTaxas = padraoTaxas.exec(texto);
  if (matchTaxas) {
    dadosCruzeiro.taxasInclusas = matchTaxas[1];
    console.log(`✅ Taxas: R$ ${dadosCruzeiro.taxasInclusas}`);
  }
  
  console.log("🚢 Dados de cruzeiro extraídos:", dadosCruzeiro);
  return { dadosCruzeiro };
}

function extrairItinerarioCruzeiro(texto) {
  console.log("🗺️ Extraindo itinerário de cruzeiro...");
  
  const itinerario = [];
  
  const padrãoItinerario = /(\d+)\.\s*(\w+)\.\s*(\d{2}\.\d{2}\.\d{2})\s*([^]*?)(?=\d+\.\s*\w+\.\s*\d{2}\.\d{2}\.\d{2}|$)/gi;
  
  let match;
  while ((match = padrãoItinerario.exec(texto)) !== null) {
    const dia = {
      numero: parseInt(match[1]),
      diaSemana: match[2],
      data: match[3],
      detalhes: match[4].trim()
    };
    
    const detalhes = match[4];
    const linhas = detalhes.split('\n').filter(linha => linha.trim());
    
    if (linhas.length > 0) {
      dia.porto = linhas[0].replace(/\*\*/g, '').trim();
      
      const chegadaMatch = detalhes.match(/chegada\s*(\d{2}:\d{2})/gi);
      const saidaMatch = detalhes.match(/saída\s*(\d{2}:\d{2})/gi);
      
      if (chegadaMatch) dia.chegada = chegadaMatch[0].replace(/chegada\s*/gi, '');
      if (saidaMatch) dia.saida = saidaMatch[0].replace(/saída\s*/gi, '');
    }
    
    itinerario.push(dia);
  }
  
  console.log(`✅ Itinerário extraído: ${itinerario.length} dias`);
  return itinerario;
}

function extrairPrecosCabines(texto) {
  console.log("💰 Extraindo preços das cabines...");
  
  const precos = {};
  
  const tiposCabine = Object.keys(TIPOS_CABINE_CRUZEIRO);
  
  tiposCabine.forEach(tipo => {
    const regex = new RegExp(`${tipo}[^R]*R\\$\\s*([\\d.,]+)`, 'gi');
    const match = regex.exec(texto);
    
    if (match) {
      precos[tipo] = match[1];
      console.log(`✅ ${tipo}: R$ ${match[1]}`);
    }
  });
  
  return precos;
}

// ================================================================================
// 14. 📦 EXTRAÇÃO DE DADOS DE PACOTE
// ================================================================================

function extrairDadosPacote(texto) {
  console.log("📦 Extraindo dados de pacote...");
  
  const dadosPacote = {
    nomeHotel: null,
    enderecoHotel: null,
    avaliacaoHotel: null,
    tipoQuarto: null,
    regime: null,
    servicosInclusos: [],
    precoOriginal: null,
    precoFinal: null,
    desconto: null,
    temDesconto: false,
    vooIncluido: false,
    transferIncluido: false,
    atividadesInclusas: []
  };
  
  const padraoHotel = /\*\*([^*]+hotel[^*]*)\*\*/gi;
  const matchHotel = padraoHotel.exec(texto);
  if (matchHotel) {
    dadosPacote.nomeHotel = matchHotel[1].trim();
    console.log(`✅ Hotel: ${dadosPacote.nomeHotel}`);
  }
  
  const linhas = texto.split('\n');
  const linhaHotel = linhas.findIndex(linha => 
    linha.toLowerCase().includes('hotel') && linha.includes('**')
  );
  
  if (linhaHotel >= 0 && linhas[linhaHotel + 1]) {
    const proximaLinha = linhas[linhaHotel + 1].trim();
    if (!proximaLinha.includes('**') && proximaLinha.length > 10) {
      dadosPacote.enderecoHotel = proximaLinha;
      console.log(`✅ Endereço: ${dadosPacote.enderecoHotel}`);
    }
  }
  
  const tiposQuarto = Object.keys(TIPOS_QUARTO_HOTEL);
  dadosPacote.tipoQuarto = tiposQuarto.find(tipo => 
    texto.toLowerCase().includes(tipo)
  );
  
  const regimes = Object.keys(REGIMES_HOSPEDAGEM);
  dadosPacote.regime = regimes.find(regime => 
    texto.toLowerCase().includes(regime)
  );
  
  dadosPacote.servicosInclusos = Object.keys(SERVICOS_PACOTE).filter(servico => 
    texto.toLowerCase().includes(servico)
  ).map(servico => SERVICOS_PACOTE[servico]);
  
  const padraoPrecoRiscado = /~~R\$\s*([\d.,]+)~~.*?R\$\s*([\d.,]+)/gi;
  const matchPrecoDesconto = padraoPrecoRiscado.exec(texto);
  
  if (matchPrecoDesconto) {
    dadosPacote.precoOriginal = matchPrecoDesconto[1];
    dadosPacote.precoFinal = matchPrecoDesconto[2];
    dadosPacote.temDesconto = true;
    
    const original = parseFloat(dadosPacote.precoOriginal.replace(/\./g, '').replace(',', '.'));
    const final = parseFloat(dadosPacote.precoFinal.replace(/\./g, '').replace(',', '.'));
    const descontoCalc = Math.round(((original - final) / original) * 100);
    dadosPacote.desconto = `${descontoCalc}%`;
    
    console.log(`✅ Preços: De R$ ${dadosPacote.precoOriginal} por R$ ${dadosPacote.precoFinal} (${dadosPacote.desconto})`);
  } else {
    const padraoPreco = /Total.*?R\$\s*([\d.,]+)/gi;
    const matchPreco = padraoPreco.exec(texto);
    if (matchPreco) {
      dadosPacote.precoFinal = matchPreco[1];
    }
  }
  
  const padraoDesconto = /-(\d+)%/g;
  const matchDesconto = padraoDesconto.exec(texto);
  if (matchDesconto) {
    dadosPacote.desconto = matchDesconto[0];
    dadosPacote.temDesconto = true;
  }
  
  dadosPacote.vooIncluido = texto.includes('ida') && texto.includes('volta');
  
  dadosPacote.transferIncluido = 
    texto.toLowerCase().includes('transfer') || 
    texto.toLowerCase().includes('aeroporto / hotel') ||
    texto.toLowerCase().includes('transporte');
  
  if (texto.toLowerCase().includes('city tour')) {
    dadosPacote.atividadesInclusas.push('City Tour');
  }
  if (texto.toLowerCase().includes('by night')) {
    dadosPacote.atividadesInclusas.push('By Night');
  }
  
  console.log("📦 Dados de pacote extraídos:", dadosPacote);
  return { dadosPacote };
}


// ================================================================================
// 15. 🏨 EXTRAÇÃO DE DADOS DE HOTEL
// ================================================================================

function extrairDadosHotel(texto) {
  console.log("🏨 Extraindo dados de hotel...");
  
  const dadosHotel = {
    periodo: null,
    destino: null,
    categoria: null,
    opcoes: []
  };
  
  // Extrair período (comum a todas opções)
  const padraoPeriodo = /(\d{1,2}\s+de\s+\w+)\s*-\s*(\d{1,2}\s+de\s+\w+).*?\((\d+)\s+dias?\s+e\s+(\d+)\s+noites?\)/gi;
  const matchPeriodo = padraoPeriodo.exec(texto);
  if (matchPeriodo) {
    dadosHotel.periodo = {
      checkin: matchPeriodo[1],
      checkout: matchPeriodo[2],
      dias: parseInt(matchPeriodo[3]),
      noites: parseInt(matchPeriodo[4])
    };
    console.log("✅ Período do hotel:", dadosHotel.periodo);
  }
  
  // Extrair destino
  const padraoDestino = /\*\*([^*]+)\s+-\s+([^*]+)\*\*/gi;
  const matchDestino = padraoDestino.exec(texto);
  if (matchDestino && !matchDestino[1].match(/\d{1,2}\s+de\s+\w+/)) {
    dadosHotel.destino = {
      cidade: matchDestino[1].trim(),
      estado: matchDestino[2].trim()
    };
    console.log(`✅ Destino: ${dadosHotel.destino.cidade}, ${dadosHotel.destino.estado}`);
  }
  
  // Dividir texto em blocos de opções
  // Cada opção começa com a data
  const blocos = texto.split(/(?=\*\*\d{1,2}\s+de\s+\w+\s*-\s*\d{1,2}\s+de\s+\w+.*?\*\*)/);
  
  blocos.forEach((bloco, index) => {
    if (index === 0 && !bloco.includes('**')) return; // Pular cabeçalho vazio
    
    const opcao = {
      categoria: null,
      nomeHotel: null,
      endereco: null,
      tipoQuarto: null,
      regime: null,
      politicaCancelamento: null,
      passageiros: null,
      precoTotal: null
    };
    
    // Extrair categoria (Preferencial, etc)
    const matchCategoria = /\*\*(Preferencial|Executivo|Luxo|Econômico)\*\*/gi.exec(bloco);
    if (matchCategoria) opcao.categoria = matchCategoria[1];
    
    // Extrair nome do hotel
    const linhas = bloco.split('\n');
    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i];
      
      // Nome do hotel vem após categoria
      if (opcao.categoria && linha.includes('**') && 
          !linha.includes(opcao.categoria) && 
          !linha.includes(' de ') &&
          !linha.includes('Reembolsável') &&
          !linha.includes('R$')) {
        const hotelMatch = linha.match(/\*\*([^*]+)\*\*/);
        if (hotelMatch) {
          opcao.nomeHotel = hotelMatch[1].trim();
          
          // Próxima linha é o endereço
          if (linhas[i + 1] && !linhas[i + 1].includes('**')) {
            opcao.endereco = linhas[i + 1].trim();
          }
        }
      }
      
      // Tipo de quarto (padrão: **1 Standard Frete** ou **1 S2c - Apartamento...**)
      if (linha.match(/\*\*\d+\s+[^*]+\*\*/)) {
        const quartoMatch = linha.match(/\*\*\d+\s+([^*]+)\*\*/);
        if (quartoMatch) {
          opcao.tipoQuarto = quartoMatch[1].trim();
        }
      }
      
      // Regime
      if (linha.toLowerCase().match(/café da manhã|meia pensão|pensão completa|all inclusive/)) {
        opcao.regime = linha.trim();
      }
      
      // Política de cancelamento
      if (linha.match(/\*\*(Reembolsável|Não reembolsável)\*\*/)) {
        const cancelMatch = linha.match(/\*\*([^*]+)\*\*/);
        if (cancelMatch) {
          opcao.politicaCancelamento = cancelMatch[1].trim();
        }
      }
      
      // Passageiros e preço
      if (linha.includes('Total')) {
        const matchPassageiros = /Total\s*\(([^)]+)\)/gi.exec(linha);
        if (matchPassageiros) opcao.passageiros = matchPassageiros[1];
        
        const matchPreco = /R\$\s*([\d.,]+)/g.exec(linha);
        if (matchPreco) opcao.precoTotal = matchPreco[1];
      }
    }
    
    // Adicionar opção se tiver dados válidos
    if (opcao.nomeHotel && opcao.precoTotal) {
      dadosHotel.opcoes.push(opcao);
      console.log(`✅ Hotel ${dadosHotel.opcoes.length}: ${opcao.nomeHotel} - R$ ${opcao.precoTotal}`);
      console.log(`   Categoria: ${opcao.categoria}`);
      console.log(`   Quarto: ${opcao.tipoQuarto}`);
      console.log(`   Regime: ${opcao.regime}`);
      console.log(`   Cancelamento: ${opcao.politicaCancelamento}`);
    }
  });
  
  console.log(`🏨 Total de opções de hotel extraídas: ${dadosHotel.opcoes.length}`);
  return { dadosHotel };
}

// ================================================================================
// 16. 📊 ANÁLISE DE COMPLEXIDADE E CONTEXTO
// ================================================================================

function calcularComplexidade(textoCompleto) {
  let pontuacaoComplexidade = 0;
  
  // Fatores que aumentam complexidade
  if ((textoCompleto.match(/conexão|escala/gi) || []).length > 0) pontuacaoComplexidade += 20;
  if ((textoCompleto.match(/trecho/gi) || []).length > 1) pontuacaoComplexidade += 30;
  if ((textoCompleto.match(/R\$/gi) || []).length > 2) pontuacaoComplexidade += 15;
  if (textoCompleto.length > 1000) pontuacaoComplexidade += 10;
  
  let nivelComplexidade;
  if (pontuacaoComplexidade >= 50) nivelComplexidade = 'muito_alta';
  else if (pontuacaoComplexidade >= 30) nivelComplexidade = 'alta';
  else if (pontuacaoComplexidade >= 15) nivelComplexidade = 'media';
  else nivelComplexidade = 'baixa';
  
  return {
    complexidade: nivelComplexidade,
    pontuacaoComplexidade
  };
}

function extrairContextoCompleto(formData) {
  return {
    temImagem: !!formData.imagemBase64,
    tamanhoTexto: (formData.observacoes || '').length,
    temDestino: !!formData.destino,
    tiposSelecionados: formData.tipos || [],
    numeroAdultos: formData.adultos || 1,
    numeroCriancas: formData.criancas || 0
  };
}

// ================================================================================
// 17. 🎯 DETERMINAÇÃO DO TIPO PRINCIPAL
// ================================================================================

function determinarTipoPrincipal(analise) {
  console.log("🎯 Determinando tipo principal...");
  
  // Prioridade 1: Hotéis com múltiplas opções
  if (analise.isHotel && analise.dadosHotel?.opcoes?.length > 0) {
    const numOpcoes = analise.dadosHotel.opcoes.length;
    const categoria = analise.dadosHotel.opcoes[0]?.categoria?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    return `hotel_${categoria}_${numOpcoes}_opcoes`;
  }
  
  // Prioridade 2: Pacotes (hotel + voo)
  if (analise.isPacote) {
    const nomeHotel = analise.dadosPacote?.nomeHotel?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'generico';
    const temDesconto = analise.dadosPacote?.temDesconto ? 'promocional' : 'regular';
    return `pacote_${nomeHotel.substring(0, 20)}_${temDesconto}`;
  }
  
  // Prioridade 3: Cruzeiros
  if (analise.isCruzeiro) {
    const companhiaCruzeiro = analise.dadosCruzeiro?.companhiaCruzeiro?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    const navio = analise.dadosCruzeiro?.navio?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    return `cruzeiro_${companhiaCruzeiro}_${navio}`;
  }
  
  // Prioridade 4: Multitrecho internacional
  if (analise.isMultitrechoInternacional || 
      (analise.isMultitrecho && analise.isVooInternacional)) {
    const companhia = analise.companhiaPrincipal || 
                      analise.companhiasDetectadas?.[0]?.toLowerCase().replace(/\s+/g, '_');
    return `multitrecho_internacional_${companhia || 'generico'}`;
  }
  
  // Prioridade 5: Multitrecho nacional
  if (analise.isMultitrecho) {
    return 'multitrecho_nacional';
  }
  
  // Prioridade 6: Voo internacional
  if (analise.isVooInternacional) {
    const companhia = analise.companhiasDetectadas?.[0]?.toLowerCase().replace(/\s+/g, '_');
    return `aereo_internacional_${companhia || 'generico'}`;
  }
  
  // Prioridade 7: Voo nacional
  if (analise.isVooNacional) {
    const companhia = analise.companhiasDetectadas?.[0]?.toLowerCase();
    return `aereo_nacional_${companhia || 'simples'}`;
  }
  
  return 'generico';
}

function calcularConfiancaDeteccao(analise) {
  let confianca = 0.5; // base
  
  if (analise.companhiasDetectadas?.length > 0) confianca += 0.2;
  if (analise.aeroportosDetectados?.length > 0) confianca += 0.15;
  if (analise.dadosVoo?.periodo) confianca += 0.1;
  if (analise.precosCVC?.precoTotal) confianca += 0.1;
  if (analise.dadosVoo?.origem && analise.dadosVoo?.destino) confianca += 0.1;
  
  if (analise.numeroTrechos > 1 && analise.trechosDetalhados?.length > 1) {
    confianca += 0.2;
  }
  
  if (analise.dadosHotel?.opcoes?.length > 0) {
    confianca += 0.15 + (analise.dadosHotel.opcoes.length * 0.05);
  }
  
  if (analise.destinoHTML || analise.adultosHTML) confianca += 0.05;
  
  return Math.min(confianca, 0.98); // máximo 98%
}

// ================================================================================
// 18. 📊 LOG DE ANÁLISE COMPLETA
// ================================================================================

function logAnaliseCompleta(analise) {
  console.log("🔍 === RESULTADO DA ANÁLISE COMPLETA ===");
  console.log(`🎯 Tipo principal: ${analise.tipoDetectado}`);
  console.log(`📊 Confiança: ${(analise.confiancaDeteccao * 100).toFixed(1)}%`);
  console.log(`⚡ Complexidade: ${analise.complexidade}`);
  console.log(`🏢 Companhias: ${analise.companhiasDetectadas?.join(', ') || 'nenhuma'}`);
  console.log(`✈️ Aeroportos: ${analise.aeroportosDetectados?.join(', ') || 'nenhum'}`);
  console.log(`💰 Preço detectado: ${analise.precosCVC?.precoTotal ? 'R$ ' + analise.precosCVC.precoTotal : 'não detectado'}`);
  console.log(`🔄 Múltiplas opções: ${analise.temMultiplasOpcoes ? `SIM (${analise.numeroOpcoes})` : 'NÃO'}`);
  
  if (analise.numeroTrechos > 1) {
    console.log(`🌍 Multitrecho: ${analise.numeroTrechos} trechos`);
    console.log(`   Internacional: ${analise.isMultitrechoInternacional ? 'SIM' : 'NÃO'}`);
    console.log(`   Aeroportos internacionais: ${analise.aeroportosInternacionais?.join(', ') || 'nenhum'}`);
  }
  
  if (analise.dadosVoo?.numeroPassageiros || analise.dadosVoo?.numeroCriancas || analise.dadosVoo?.numeroBebes) {
    const adultos = analise.dadosVoo.numeroPassageiros || 0;
    const criancas = analise.dadosVoo.numeroCriancas || 0;
    const bebes = analise.dadosVoo.numeroBebes || 0;
    console.log(`👥 Passageiros: ${adultos} adulto(s), ${criancas} criança(s), ${bebes} bebê(s)`);
  }
  
  if (analise.destinoHTML || analise.adultosHTML) {
    console.log("🎯 Dados HTML prioritários:");
    if (analise.destinoHTML) console.log(`   Destino: ${analise.destinoHTML}`);
    if (analise.adultosHTML) console.log(`   Adultos: ${analise.adultosHTML}`);
    if (analise.criancasHTML) console.log(`   Crianças: ${analise.criancasHTML}`);
  }
  
  if (analise.dadosVoo?.origem && analise.dadosVoo?.destino) {
    console.log(`🗺️ Rota extraída: ${analise.dadosVoo.origem} → ${analise.dadosVoo.destino}`);
  }
  
  if (analise.isHotel && analise.dadosHotel) {
    console.log("🏨 Dados de hotéis:");
    if (analise.dadosHotel.periodo) {
      console.log(`   - Período: ${analise.dadosHotel.periodo.checkin} a ${analise.dadosHotel.periodo.checkout}`);
      console.log(`   - Duração: ${analise.dadosHotel.periodo.dias} dias, ${analise.dadosHotel.periodo.noites} noites`);
    }
    if (analise.dadosHotel.destino) {
      console.log(`   - Destino: ${analise.dadosHotel.destino.cidade}, ${analise.dadosHotel.destino.estado}`);
    }
    if (analise.dadosHotel.opcoes?.length > 0) {
      console.log(`   - Total de opções: ${analise.dadosHotel.opcoes.length}`);
      analise.dadosHotel.opcoes.forEach((opcao, idx) => {
        console.log(`   📍 Opção ${idx + 1}:`);
        console.log(`      Hotel: ${opcao.nomeHotel}`);
        console.log(`      Categoria: ${opcao.categoria}`);
        console.log(`      Quarto: ${opcao.tipoQuarto}`);
        console.log(`      Regime: ${opcao.regime}`);
        console.log(`      Cancelamento: ${opcao.politicaCancelamento}`);
        console.log(`      Passageiros: ${opcao.passageiros}`);
        console.log(`      Preço: R$ ${opcao.precoTotal}`);
      });
    }
  }
  
  if (analise.isPacote && analise.dadosPacote) {
    console.log("📦 Dados do pacote:");
    if (analise.dadosPacote.nomeHotel) console.log(`   - Hotel: ${analise.dadosPacote.nomeHotel}`);
    if (analise.dadosPacote.tipoQuarto) console.log(`   - Quarto: ${analise.dadosPacote.tipoQuarto}`);
    if (analise.dadosPacote.regime) console.log(`   - Regime: ${analise.dadosPacote.regime}`);
    if (analise.dadosPacote.temDesconto) {
      console.log(`   - Preços: De R$ ${analise.dadosPacote.precoOriginal} por R$ ${analise.dadosPacote.precoFinal} (${analise.dadosPacote.desconto})`);
    } else if (analise.dadosPacote.precoFinal) {
      console.log(`   - Preço: R$ ${analise.dadosPacote.precoFinal}`);
    }
    if (analise.dadosPacote.servicosInclusos?.length > 0) {
      console.log(`   - Serviços: ${analise.dadosPacote.servicosInclusos.join(', ')}`);
    }
    console.log(`   - Voo incluso: ${analise.dadosPacote.vooIncluido ? 'SIM' : 'NÃO'}`);
    console.log(`   - Transfer incluso: ${analise.dadosPacote.transferIncluido ? 'SIM' : 'NÃO'}`);
  }
  
  if (analise.isCruzeiro && analise.dadosCruzeiro) {
    console.log("🚢 Dados do cruzeiro:");
    if (analise.dadosCruzeiro.navio) console.log(`   - Navio: ${analise.dadosCruzeiro.navio}`);
    if (analise.dadosCruzeiro.companhiaCruzeiro) console.log(`   - Companhia: ${analise.dadosCruzeiro.companhiaCruzeiro}`);
    if (analise.dadosCruzeiro.duracao) console.log(`   - Duração: ${analise.dadosCruzeiro.duracao}`);
    if (analise.dadosCruzeiro.embarque) console.log(`   - Embarque: ${analise.dadosCruzeiro.embarque}`);
    if (analise.dadosCruzeiro.tiposCabine?.length > 0) console.log(`   - Cabines: ${analise.dadosCruzeiro.tiposCabine.join(', ')}`);
    
    const precos = Object.entries(analise.dadosCruzeiro.precosCabines || {});
    if (precos.length > 0) {
      console.log("   - Preços:");
      precos.forEach(([tipo, preco]) => console.log(`     ${tipo}: R$ ${preco}`));
    }
  }
  
  if (analise.dadosVoo?.destinoFinal) {
    console.log(`🗺️ Destino final (HTML): ${analise.dadosVoo.destinoFinal}`);
  }
}

// ================================================================================
// 19. 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function construirTextoAnalise(formData) {
  return [
    formData.observacoes || '',
    formData.textoColado || '', 
    formData.destino || '',
    formData.tipos?.join(' ') || ''
  ].join(' ').toLowerCase();
}

// ================================================================================
// 20. 🚀 EXPORTAÇÕES
// ================================================================================

export {
  analisarTextoCompleto,
  PADROES_COMPANHIAS,
  AEROPORTOS_BRASILEIROS,
  AEROPORTOS_INTERNACIONAIS,
  TODOS_AEROPORTOS,
  PADROES_VOOS,
  NAVIOS_CONHECIDOS,
  PORTOS_CRUZEIROS,
  TIPOS_CABINE_CRUZEIRO,
  PLANOS_CRUZEIRO,
  TIPOS_HOSPEDAGEM,
  REGIMES_HOSPEDAGEM,
  TIPOS_QUARTO_HOTEL,
  CATEGORIAS_HOTEL,
  POLITICAS_CANCELAMENTO,
  SERVICOS_PACOTE
};

export default {
  analisarTextoCompleto,
  PADROES_COMPANHIAS,
  AEROPORTOS_BRASILEIROS,
  AEROPORTOS_INTERNACIONAIS, 
  TODOS_AEROPORTOS,
  PADROES_VOOS,
  NAVIOS_CONHECIDOS,
  PORTOS_CRUZEIROS,
  TIPOS_CABINE_CRUZEIRO,
  PLANOS_CRUZEIRO,
  TIPOS_HOSPEDAGEM,
  REGIMES_HOSPEDAGEM,
  TIPOS_QUARTO_HOTEL,
  CATEGORIAS_HOTEL,
  POLITICAS_CANCELAMENTO,
  SERVICOS_PACOTE
};

// ================================================================================
// 21. CONSOLE.LOGS FINAIS
// ================================================================================

console.log("✅ Analysis v11.0 - SISTEMA COMPLETO CARREGADO E PRONTO!");
console.log("🎯 Suporte completo: VOOS, MULTITRECHOS, CRUZEIROS, PACOTES, PREÇOS CVC");
console.log("🚢 Cruzeiros: Costa, MSC, Disney, Royal Caribbean + itinerários detalhados");
console.log("📦 Pacotes: Hotel + Voo + Serviços inclusos + Descontos automáticos");
console.log("🏨 NOVO: Suporte para múltiplas opções de hotéis com extração completa!");
