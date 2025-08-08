// 🔍 analysis.js - SISTEMA COMPLETO DE ANÁLISE v11.1
// CORREÇÃO LÓGICA: Extração de passageiros aprimorada e estruturada para o prompts.js v12.0
// Baseado em padrões reais: GOL, LATAM, Azul + CVC

console.log("🔍 Analysis v11.1 - LÓGICA DE EXTRAÇÃO E DETECÇÃO CORRIGIDA");

// ================================================================================
// 1. 🎯 CONSTANTES (PADRÕES DE DETECÇÃO ESPECIALIZADOS)
// ================================================================================

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

function analisarTextoCompleto(formData) {
  console.log("🔍 === ANÁLISE COMPLETA v11.1 INICIADA ===");
  
  const textoCompleto = construirTextoAnalise(formData);
  console.log(`📋 Texto para análise: ${textoCompleto.length} caracteres`);
  
  const dadosHTML = extrairDadosHTML(formData);
  console.log("🎯 Dados HTML prioritários:", dadosHTML);
  
  let analise = {
    ...dadosHTML,
    ...detectarTipoViagem(textoCompleto),
    ...extrairDadosVoo(textoCompleto),
    ...extrairDadosCruzeiro(textoCompleto),
    ...extrairDadosPacote(textoCompleto),
    ...extrairDadosHotel(textoCompleto),
    ...analisarPrecosCVC(textoCompleto),
    ...detectarMultiplasOpcoes(textoCompleto),
    ...detectarMultitrechoAvancado(textoCompleto),
    ...calcularComplexidade(textoCompleto),
    contexto: extrairContextoCompleto(formData),
    timestamp: new Date().toISOString()
  };
  
  analise = aplicarPrioridadeHTML(analise, dadosHTML);
  analise.tipoDetectado = determinarTipoPrincipal(analise);
  analise.confiancaDeteccao = calcularConfiancaDeteccao(analise);
  
  // CORREÇÃO: Bloco adicionado para estruturar dados para o prompts.js v12.0
  const passageirosExtraidos = extrairPassageirosCompleto(textoCompleto);
  analise.dadosVoo = {
    ...analise.dadosVoo, // Mantém dados de voo já extraídos
    numeroPassageiros: passageirosExtraidos?.adultos || 0,
    numeroCriancas: passageirosExtraidos?.criancas || 0,
    numeroBebes: passageirosExtraidos?.bebes || 0
  };
  
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
  if (dadosHTML.destinoHTML) {
    analise.dadosVoo = analise.dadosVoo || {};
    analise.dadosVoo.destinoFinal = dadosHTML.destinoHTML;
  }
  if (dadosHTML.adultosHTML) {
    analise.numeroPassageirosHTML = dadosHTML.adultosHTML;
  }
  if (dadosHTML.criancasHTML) {
    analise.numeroCriancasHTML = dadosHTML.criancasHTML;
  }
  if (dadosHTML.tiposHTML?.length > 0) {
    analise.tiposHTMLSelecionados = dadosHTML.tiposHTML;
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
    for (let i = 1; i <= multitrecho.numeroTrechos; i++) {
      const trecho = extrairTrechoEspecifico(texto, i);
      if (trecho) multitrecho.trechosDetalhados.push(trecho);
    }
    const aeroportosInternacionais = Object.keys(AEROPORTOS_INTERNACIONAIS);
    const aeroportosDetectados = aeroportosInternacionais.filter(codigo => texto.toLowerCase().includes(codigo.toLowerCase()));
    if (aeroportosDetectados.length > 0) {
      multitrecho.isMultitrechoInternacional = true;
      multitrecho.aeroportosInternacionais = aeroportosDetectados;
    }
    const companhias = Object.keys(PADROES_COMPANHIAS);
    multitrecho.companhiaPrincipal = companhias.find(comp => texto.toLowerCase().includes(comp));
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
  return trecho;
}

function extrairAeroportoTodos(texto, posicao = 'primeiro') {
  const todosAeroportos = Object.keys(TODOS_AEROPORTOS);
  const regex = new RegExp(`\\b(${todosAeroportos.join('|')})\\b`, 'gi');
  const matches = [...texto.matchAll(regex)];
  if (posicao === 'primeiro' && matches.length > 0) return matches[0][1].toUpperCase();
  if (posicao === 'segundo' && matches.length > 1) return matches[1][1].toUpperCase();
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
    isVooNacional: false, isVooInternacional: false, isMultitrecho: false,
    isCruzeiro: false, isHotel: false, isPacote: false
  };
  const aeroportosBrasDetectados = Object.keys(AEROPORTOS_BRASILEIROS).filter(codigo => texto.toLowerCase().includes(codigo.toLowerCase()));
  const aeroportosIntDetectados = Object.keys(AEROPORTOS_INTERNACIONAIS).filter(codigo => texto.toLowerCase().includes(codigo.toLowerCase()));
  if (aeroportosBrasDetectados.length > 0) tipos.isVooNacional = true;
  if (aeroportosIntDetectados.length > 0) tipos.isVooInternacional = true;
  const companhiasDetectadas = [];
  Object.keys(PADROES_COMPANHIAS).forEach(companhia => {
    if (texto.toLowerCase().includes(companhia)) {
      companhiasDetectadas.push(PADROES_COMPANHIAS[companhia].nome);
      if (PADROES_COMPANHIAS[companhia].tipo.includes('internacional')) tipos.isVooInternacional = true;
    }
  });
  if ((texto.match(/trecho\s*\d+/gi) || []).length > 1) tipos.isMultitrecho = true;
  if (detectarCruzeiro(texto)) tipos.isCruzeiro = true;
  if (detectarPacote(texto)) tipos.isPacote = true;
  if (detectarHotel(texto)) tipos.isHotel = true;
  return { ...tipos, companhiasDetectadas, aeroportosDetectados: [...aeroportosBrasDetectados, ...aeroportosIntDetectados] };
}

// ================================================================================
// 6. 🚢 DETECÇÃO ESPECÍFICA DE CRUZEIROS
// ================================================================================

function detectarCruzeiro(texto) {
  const palavrasChaveCruzeiro = ['embarque:', 'desembarque:', 'navio', 'cruzeiro', 'cabine', 'suite', 'my cruise', 'all inclusive', 'costa diadema', 'msc', 'noites •', 'em navegação', 'porto', 'itinerário'];
  const naviosDetectados = Object.keys(NAVIOS_CONHECIDOS).filter(navio => texto.toLowerCase().includes(navio.toLowerCase()));
  const companhiasCruzeiroDetectadas = ['costa', 'msc', 'disney', 'royal', 'norwegian'].filter(comp => texto.toLowerCase().includes(comp));
  const portosDetectados = Object.keys(PORTOS_CRUZEIROS).filter(porto => texto.toLowerCase().includes(porto.toLowerCase()));
  return palavrasChaveCruzeiro.some(p => texto.toLowerCase().includes(p)) || naviosDetectados.length > 0 || companhiasCruzeiroDetectadas.length > 0 || (portosDetectados.length > 0 && texto.includes('embarque'));
}

// ================================================================================
// 7. 📦 DETECÇÃO ESPECÍFICA DE PACOTES
// ================================================================================

function detectarPacote(texto) {
  const temHotel = Object.keys(TIPOS_HOSPEDAGEM).some(tipo => texto.toLowerCase().includes(tipo));
  const temVoo = texto.includes('ida') && texto.includes('volta') && (texto.includes('gru') || texto.includes('cgh') || texto.includes('vcp'));
  const temServicosInclusos = Object.keys(SERVICOS_PACOTE).some(servico => texto.toLowerCase().includes(servico));
  const temDesconto = /-\d+%/.test(texto) || /~~R\$/.test(texto);
  const temDiarias = /\d+\s*diárias?/.test(texto);
  const temRegime = Object.keys(REGIMES_HOSPEDAGEM).some(regime => texto.toLowerCase().includes(regime));
  const palavrasChavePacote = ['serviços inclusos', 'transporte aéreo', 'hospedagem', 'city tour', 'by night', 'receptivo', 'transfer', 'aeroporto / hotel', 'cafe da manha', 'standard promo'];
  const temPalavrasChave = palavrasChavePacote.some(palavra => texto.toLowerCase().includes(palavra.toLowerCase()));
  return (temHotel && temVoo) || (temHotel && temServicosInclusos) || (temVoo && temDiarias) || (temDesconto && temRegime) || temPalavrasChave;
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
  console.log("🔄 Detectando múltiplas opções v11.1...");
  
  const multiplasOpcoes = {
    temMultiplasOpcoes: false,
    numeroOpcoes: 1,
    opcoes: []
  };

  // Critérios mais fortes para detecção:
  const temPalavraOpcao = (texto.match(/opção\s*\d+/gi) || []).length;
  const temPrecoTotalRepetido = (texto.match(/Total\s*\(([^)]+)\)/gi) || []).length;
  
  // É Múltiplas Opções se houver a palavra "opção" explicitamente,
  // ou se houver múltiplos blocos "Total (...)"
  // E NÃO for um multitrecho.
  if ((temPalavraOpcao >= 2 || temPrecoTotalRepetido >= 2) && !texto.includes('trecho')) {
    multiplasOpcoes.temMultiplasOpcoes = true;
    multiplasOpcoes.numeroOpcoes = Math.max(temPalavraOpcao, temPrecoTotalRepetido);
    
    console.log(`✅ Múltiplas opções detectadas: ${multiplasOpcoes.numeroOpcoes} opções`);
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
  console.log("👥 Extraindo passageiros com lógica final aprimorada...");
  
  const passageiros = {
    adultos: 0,
    criancas: 0,
    bebes: 0
  };

  // Padrão que captura o conteúdo dentro de "Total (...)"
  const padraoContainer = /Total\s*\(([^)]+)\)/i;
  const matchContainer = texto.match(padraoContainer);

  if (matchContainer && matchContainer[1]) {
    const textoPassageiros = matchContainer[1].toLowerCase();
    
    const matchAdultos = textoPassageiros.match(/(\d+)\s*adulto/);
    if (matchAdultos) passageiros.adultos = parseInt(matchAdultos[1], 10);

    const matchCriancas = textoPassageiros.match(/(\d+)\s*criança/);
    if (matchCriancas) passageiros.criancas = parseInt(matchCriancas[1], 10);

    const matchBebes = textoPassageiros.match(/(\d+)\s*bebê/);
    if (matchBebes) passageiros.bebes = parseInt(matchBebes[1], 10);
    
    console.log(`✅ Passageiros extraídos: ${passageiros.adultos} adulto(s), ${passageiros.criancas} criança(s), ${passageiros.bebes} bebê(s)`);
  }
  
  // Garantia de pelo menos 1 adulto se a extração falhar completamente
  if (passageiros.adultos === 0 && passageiros.criancas === 0 && passageiros.bebes === 0) {
      const matchAdultosSimples = texto.match(/(\d+)\s*adulto/i);
      if(matchAdultosSimples) {
        passageiros.adultos = parseInt(matchAdultosSimples[1], 10);
      } else {
        passageiros.adultos = 1;
        console.log("⚠️ Nenhum passageiro detectado, definindo 1 adulto como padrão.");
      }
  }

  return passageiros;
}

// ================================================================================
// 13. 🚢 EXTRAÇÃO DE DADOS DE CRUZEIRO
// ================================================================================

function extrairDadosCruzeiro(texto) { /* ...código inalterado... */ }
function extrairItinerarioCruzeiro(texto) { /* ...código inalterado... */ }
function extrairPrecosCabines(texto) { /* ...código inalterado... */ }

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
  // CORREÇÃO DE SINTAXE: Movendo a lógica para dentro da função
  const padraoHotel = /\*\*([^*]+hotel[^*]*)\*\*/gi;
  const matchHotel = padraoHotel.exec(texto);
  if (matchHotel) {
    dadosPacote.nomeHotel = matchHotel[1].trim();
  }
  const linhas = texto.split('\n');
  const linhaHotel = linhas.findIndex(linha => linha.toLowerCase().includes('hotel') && linha.includes('**'));
  if (linhaHotel >= 0 && linhas[linhaHotel + 1]) {
    const proximaLinha = linhas[linhaHotel + 1].trim();
    if (!proximaLinha.includes('**') && proximaLinha.length > 10) {
      dadosPacote.enderecoHotel = proximaLinha;
    }
  }
  const tiposQuarto = Object.keys(TIPOS_QUARTO_HOTEL);
  dadosPacote.tipoQuarto = tiposQuarto.find(tipo => texto.toLowerCase().includes(tipo));
  const regimes = Object.keys(REGIMES_HOSPEDAGEM);
  dadosPacote.regime = regimes.find(regime => texto.toLowerCase().includes(regime));
  dadosPacote.servicosInclusos = Object.keys(SERVICOS_PACOTE).filter(servico => texto.toLowerCase().includes(servico)).map(servico => SERVICOS_PACOTE[servico]);
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
  dadosPacote.transferIncluido = texto.toLowerCase().includes('transfer') || texto.toLowerCase().includes('aeroporto / hotel') || texto.toLowerCase().includes('transporte');
  if (texto.toLowerCase().includes('city tour')) {
    dadosPacote.atividadesInclusas.push('City Tour');
  }
  if (texto.toLowerCase().includes('by night')) {
    dadosPacote.atividadesInclusas.push('By Night');
  }
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
  const blocos = texto.split(/(?=\*\*\d{1,2}\s+de\s+\w+\s*-\s*\d{1,2}\s+de\s+\w+.*?\*\*)/);
  
  blocos.forEach((bloco, index) => {
    if (index === 0 && !bloco.includes('**')) return;
    
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
    
    const matchCategoria = /\*\*(Preferencial|Executivo|Luxo|Econômico)\*\*/gi.exec(bloco);
    if (matchCategoria) opcao.categoria = matchCategoria[1];
    
    const linhas = bloco.split('\n');
    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i];
      
      if (opcao.categoria && linha.includes('**') && !linha.includes(opcao.categoria) && !linha.includes(' de ') && !linha.includes('Reembolsável') && !linha.includes('R$')) {
        const hotelMatch = linha.match(/\*\*([^*]+)\*\*/);
        if (hotelMatch) {
          opcao.nomeHotel = hotelMatch[1].trim();
          if (linhas[i + 1] && !linhas[i + 1].includes('**')) {
            opcao.endereco = linhas[i + 1].trim();
          }
        }
      }
      
      if (linha.match(/\*\*\d+\s+[^*]+\*\*/)) {
        const quartoMatch = linha.match(/\*\*\d+\s+([^*]+)\*\*/);
        if (quartoMatch) {
          opcao.tipoQuarto = quartoMatch[1].trim();
        }
      }
      
      if (linha.toLowerCase().match(/café da manhã|meia pensão|pensão completa|all inclusive/)) {
        opcao.regime = linha.trim();
      }
      
      if (linha.match(/\*\*(Reembolsável|Não reembolsável)\*\*/)) {
        const cancelMatch = linha.match(/\*\*([^*]+)\*\*/);
        if (cancelMatch) {
          opcao.politicaCancelamento = cancelMatch[1].trim();
        }
      }
      
      if (linha.includes('Total')) {
        const matchPassageiros = /Total\s*\(([^)]+)\)/gi.exec(linha);
        if (matchPassageiros) opcao.passageiros = matchPassageiros[1];
        
        const matchPreco = /R\$\s*([\d.,]+)/g.exec(linha);
        if (matchPreco) opcao.precoTotal = matchPreco[1];
      }
    }
    
    if (opcao.nomeHotel && opcao.precoTotal) {
      dadosHotel.opcoes.push(opcao);
    }
  });
  
  return { dadosHotel };
}

// ================================================================================
// 16. 📊 ANÁLISE DE COMPLEXIDADE E CONTEXTO
// ================================================================================

function calcularComplexidade(textoCompleto) {
  let pontuacaoComplexidade = 0;
  
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
  
  if (analise.isHotel && analise.dadosHotel?.opcoes?.length > 0) {
    const numOpcoes = analise.dadosHotel.opcoes.length;
    const categoria = analise.dadosHotel.opcoes[0]?.categoria?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    return `hotel_${categoria}_${numOpcoes}_opcoes`;
  }
  
  if (analise.isPacote) {
    const nomeHotel = analise.dadosPacote?.nomeHotel?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'generico';
    const temDesconto = analise.dadosPacote?.temDesconto ? 'promocional' : 'regular';
    return `pacote_${nomeHotel.substring(0, 20)}_${temDesconto}`;
  }
  
  if (analise.isCruzeiro) {
    const companhiaCruzeiro = analise.dadosCruzeiro?.companhiaCruzeiro?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    const navio = analise.dadosCruzeiro?.navio?.toLowerCase().replace(/\s+/g, '_') || 'generico';
    return `cruzeiro_${companhiaCruzeiro}_${navio}`;
  }
  
  if (analise.isMultitrechoInternacional || (analise.isMultitrecho && analise.isVooInternacional)) {
    const companhia = analise.companhiaPrincipal || analise.companhiasDetectadas?.[0]?.toLowerCase().replace(/\s+/g, '_');
    return `multitrecho_internacional_${companhia || 'generico'}`;
  }
  
  if (analise.isMultitrecho) {
    return 'multitrecho_nacional';
  }
  
  if (analise.isVooInternacional) {
    const companhia = analise.companhiasDetectadas?.[0]?.toLowerCase().replace(/\s+/g, '_');
    return `aereo_internacional_${companhia || 'generico'}`;
  }
  
  if (analise.isVooNacional) {
    const companhia = analise.companhiasDetectadas?.[0]?.toLowerCase();
    return `aereo_nacional_${companhia || 'simples'}`;
  }
  
  return 'generico';
}

function calcularConfiancaDeteccao(analise) {
  let confianca = 0.5;
  
  if (analise.companhiasDetectadas?.length > 0) confianca += 0.2;
  if (analise.aeroportosDetectados?.length > 0) confianca += 0.15;
  if (analise.dadosVoo?.periodo) confianca += 0.1;
  if (analise.precosCVC?.precoTotal) confianca += 0.1;
  if (analise.dadosVoo?.origem && analise.dadosVoo?.destino) confianca += 0.1;
  if (analise.numeroTrechos > 1 && analise.trechosDetalhados?.length > 1) confianca += 0.2;
  if (analise.dadosHotel?.opcoes?.length > 0) confianca += 0.15 + (analise.dadosHotel.opcoes.length * 0.05);
  if (analise.destinoHTML || analise.adultosHTML) confianca += 0.05;
  
  return Math.min(confianca, 0.98);
}

// ================================================================================
// 18. 📊 LOG DE ANÁLISE COMPLETA
// ================================================================================

function logAnaliseCompleta(analise) {
    // ... (todo o corpo da sua função permanece exatamente igual)
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
