// ================================================================================
// 🏆 CVC ITAQUA - API FINAL CORRIGIDA v6.0
// ================================================================================
// CORREÇÕES: Templates WhatsApp + Imagens + Múltiplas opções + Conexões + Parcelamento
// ================================================================================

// ================================================================================
// 🗺️ MAPEAMENTO COMPLETO DE AEROPORTOS
// ================================================================================

const aeroportos = {
  // Principais aeroportos brasileiros
  'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
  'SDU': 'Santos Dumont', 'GIG': 'Galeão', 
  'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha',
  'CWB': 'Curitiba', 'IGU': 'Foz do Iguaçu', 
  'REC': 'Recife', 'FOR': 'Fortaleza', 'SSA': 'Salvador',
  'MAO': 'Manaus', 'BEL': 'Belém', 'CGB': 'Cuiabá',
  'CGR': 'Campo Grande', 'AJU': 'Aracaju', 'MCZ': 'Maceió',
  'JPA': 'João Pessoa', 'NAT': 'Natal', 'THE': 'Teresina',
  'SLZ': 'São Luís', 'VIX': 'Vitória', 'FLN': 'Florianópolis',
  'POA': 'Porto Alegre', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus',
  'RAO': 'Ribeirão Preto', 'NVT': 'Navegantes', 'UDI': 'Uberlândia',
  'MOC': 'Montes Claros', 'JDF': 'Juiz de Fora', 'GYN': 'Goiânia',
  'PNZ': 'Petrolina', 'JTC': 'Bauru', 'AQA': 'Araraquara',
  'PPB': 'Presidente Prudente', 'CXJ': 'Caxias do Sul',
  
  // Aeroportos internacionais importantes
  'EZE': 'Buenos Aires Ezeiza', 'AEP': 'Buenos Aires Aeroparque',
  'LHR': 'Londres Heathrow', 'LGW': 'Londres Gatwick', 'STN': 'Londres Stansted',
  'JFK': 'Nova York JFK', 'LGA': 'Nova York LaGuardia', 'EWR': 'Nova York Newark',
  'MXP': 'Milão Malpensa', 'LIN': 'Milão Linate',
  'CDG': 'Paris Charles de Gaulle', 'ORY': 'Paris Orly',
  'MVD': 'Montevidéu', 'ASU': 'Assunção', 'SCL': 'Santiago', 'LIM': 'Lima',
  'BOG': 'Bogotá', 'UIO': 'Quito', 'CCS': 'Caracas',
  'MIA': 'Miami', 'MCO': 'Orlando', 'LAX': 'Los Angeles',
  'MAD': 'Madrid', 'FCO': 'Roma', 'LIS': 'Lisboa',
  'AMS': 'Amsterdã', 'FRA': 'Frankfurt', 'ZUR': 'Zurich',
  'DXB': 'Dubai', 'DOH': 'Doha', 'IST': 'Istambul'
};

// ================================================================================
// 📋 TEMPLATES FORMATADOS PARA WHATSAPP
// ================================================================================

const TEMPLATES = {
  // ✅ TEMPLATE AÉREO IDA E VOLTA
  'Aéreo Ida e Volta': `*[COMPANHIA]*
[DATA_IDA] - [ORIGEM_IDA] [HORA_IDA] / [DESTINO_IDA] [HORA_CHEGADA_IDA][CONEXAO_IDA]
--
[DATA_VOLTA] - [ORIGEM_VOLTA] [HORA_VOLTA] / [DESTINO_VOLTA] [HORA_CHEGADA_VOLTA][CONEXAO_VOLTA]

💰 Valor total para [PASSAGEIROS] = [VALOR][PARCELAMENTO]
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
[BAGAGEM_INFO]
[REEMBOLSAVEL]
[LINK]`,

  // ✅ TEMPLATE AÉREO SOMENTE IDA
  'Aéreo Somente Ida': `*[COMPANHIA]*
[DATA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA][CONEXAO]

💰 Valor total para [PASSAGEIROS] = [VALOR][PARCELAMENTO]
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
[BAGAGEM_INFO]
[REEMBOLSAVEL]
[LINK]

⚠️ Passagem somente de ida - sem retorno incluído`,

  // ✅ TEMPLATE MÚLTIPLAS OPÇÕES IDA E VOLTA
  'Múltiplas Ida e Volta': `*Opção 1* - [COMPANHIA_1]
[DATA_IDA_1] - [ORIGEM_IDA_1] [HORA_IDA_1] / [DESTINO_IDA_1] [HORA_CHEGADA_IDA_1][CONEXAO_IDA_1]
--
[DATA_VOLTA_1] - [ORIGEM_VOLTA_1] [HORA_VOLTA_1] / [DESTINO_VOLTA_1] [HORA_CHEGADA_VOLTA_1][CONEXAO_VOLTA_1]
💰 Valor total para [PASSAGEIROS_1] = [VALOR_1]

*Opção 2* - [COMPANHIA_2]
[DATA_IDA_2] - [ORIGEM_IDA_2] [HORA_IDA_2] / [DESTINO_IDA_2] [HORA_CHEGADA_IDA_2][CONEXAO_IDA_2]
--
[DATA_VOLTA_2] - [ORIGEM_VOLTA_2] [HORA_VOLTA_2] / [DESTINO_VOLTA_2] [HORA_CHEGADA_VOLTA_2][CONEXAO_VOLTA_2]
💰 Valor total para [PASSAGEIROS_2] = [VALOR_2]

Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
[BAGAGEM_INFO]`,

  // ✅ TEMPLATE MÚLTIPLAS OPÇÕES SOMENTE IDA
  'Múltiplas Somente Ida': `*Opção 1* - [COMPANHIA_1]
[DATA_1] - [ORIGEM_1] [HORA_IDA_1] / [DESTINO_1] [HORA_CHEGADA_1][CONEXAO_1]
💰 [VALOR_1] para [PASSAGEIROS_1]

*Opção 2* - [COMPANHIA_2]
[DATA_2] - [ORIGEM_2] [HORA_IDA_2] / [DESTINO_2] [HORA_CHEGADA_2][CONEXAO_2]
💰 [VALOR_2] para [PASSAGEIROS_2]

Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
[BAGAGEM_INFO]

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído`,

  // ✅ TEMPLATE MULTITRECHO
  'Multitrecho': `*Multitrecho* - [COMPANHIA]
[PERIODO_TOTAL]

[TRECHOS_DETALHADOS]

💰 [VALOR] para [PASSAGEIROS]
[PARCELAMENTO]
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
[BAGAGEM_INFO]
[REEMBOLSAVEL]

[LINK]`,

  // ✅ TEMPLATE HOTEL
  'Hotel': `🏨 *[NOME_HOTEL]* [CATEGORIA]
📍 [ENDERECO] - [CIDADE], [ESTADO]
🗓️ [CHECK_IN] a [CHECK_OUT] ([NOITES] noites)
👥 [PASSAGEIROS]

🛏️ *Acomodação:*
[TIPO_QUARTO][REGIME_ALIMENTACAO]

💰 [VALOR] para toda a estadia[PARCELAMENTO]

✅ *Inclui:*
• [CAFE_MANHA]
• Wi-Fi gratuito

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva`,

  // ✅ TEMPLATE HOTEL MÚLTIPLAS OPÇÕES
  'Hotel Múltiplas Opções': `*Opção 1* - [HOTEL_1] [CATEGORIA_1]
📍 [ENDERECO_1] - [CIDADE_1], [ESTADO_1]
[CHECK_IN_1] a [CHECK_OUT_1] ([NOITES_1] noites) - [PASSAGEIROS_1]
🛏️ [TIPO_QUARTO_1][REGIME_1]
💰 [VALOR_1][PARCELAMENTO_1] - [REEMBOLSAVEL_1]

*Opção 2* - [HOTEL_2] [CATEGORIA_2]
📍 [ENDERECO_2] - [CIDADE_2], [ESTADO_2]
[CHECK_IN_2] a [CHECK_OUT_2] ([NOITES_2] noites) - [PASSAGEIROS_2]
🛏️ [TIPO_QUARTO_2][REGIME_2]
💰 [VALOR_2][PARCELAMENTO_2] - [REEMBOLSAVEL_2]

Valores sujeitos a confirmação e disponibilidade`,

  // ✅ TEMPLATE CRUZEIRO
  'Cruzeiro': `🚢 *Cruzeiro [NOME_NAVIO]* – [DURACAO] noites
[PASSAGEIROS]
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO]
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
[OPCOES_CABINES]

📎 Link para ver fotos, detalhes e reservar:
[LINK]

✅ Inclui: hospedagem a bordo, pensão completa (refeições), entretenimento e atividades para todas as idades!

🚫 Não inclui: taxas, bebidas, excursões e transporte até o porto.

[OPCIONAL_ALL_INCLUSIVE]

📲 Me chama pra garantir a sua cabine nesse cruzeiro incrível! 🌴🛳️`
};

const PRECOS_MODELOS = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
};

const USD_TO_BRL = 5.2;
const MAX_TOKENS = 3000;

// ================================================================================
// 🎯 HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('[API-FINAL] Iniciando processamento...');
    
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'CVC Itaqua API - Sistema Final',
        version: '6.0-final',
        produtos_suportados: Object.keys(TEMPLATES),
        correcoes: [
          'Templates formatados para WhatsApp',
          'Processamento de imagens CORRIGIDO',
          'Detecção múltiplas opções MELHORADA',
          'Conexões e escalas detalhadas',
          'Parcelamento específico implementado',
          'Multitrecho com conexões'
        ],
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false,
        error: 'Método não permitido' 
      });
    }

    // VALIDAÇÃO
    if (!req.body?.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt obrigatório'
      });
    }

    const { prompt, temImagem, arquivo, tipos, tipoViagem, parcelamento, camposOpcionais } = req.body;
    console.log(`[API-FINAL] Prompt: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}, TipoViagem: ${tipoViagem}, TemImagem: ${temImagem}`);

    // ================================================================================
    // 🔧 ANÁLISE E SELEÇÃO DE TEMPLATE
    // ================================================================================
    
    const analise = analisarConteudoFinal(prompt, tipos, tipoViagem, temImagem);
    const template = selecionarTemplateFinal(analise, tipos);
    console.log(`[API-FINAL] Template: ${template.nome}, TipoViagem: ${analise.tipoViagem}, Múltiplas: ${analise.multiplasOpcoes}`);

    // ================================================================================
    // 🔧 CONSTRUIR PROMPT FINAL
    // ================================================================================
    
    const promptFinal = construirPromptFinal(prompt, template, analise, tipos, parcelamento, camposOpcionais, temImagem, arquivo);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarRespostaFinal(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[API-FINAL] Concluído: ${Date.now() - startTime}ms`);

    return res.status(200).json({
      success: true,
      choices: [{ 
        message: { 
          content: responseProcessada 
        } 
      }],
      metricas: metricas
    });

  } catch (error) {
    console.error('💥 [API-FINAL ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '6.0-final'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE DE CONTEÚDO FINAL
// ================================================================================

function analisarConteudoFinal(prompt, tipos, tipoViagemDetectado, temImagem) {
  console.log('[ANÁLISE-FINAL] Analisando:', { tipos, tipoViagemDetectado, temImagem });
  
  if (!prompt || !tipos || tipos.length === 0) {
    return { 
      tipo: 'generico', 
      multiplasOpcoes: false,
      produtosPrincipais: ['Aéreo Ida e Volta'],
      temEscalas: false,
      tipoViagem: 'ida_volta',
      temImagem: temImagem || false
    };
  }

  const promptLower = prompt.toLowerCase();
  
  // ================================================================================
  // 🔧 DETECÇÃO MELHORADA DE TIPO DE VIAGEM
  // ================================================================================
  
  const tipoViagemFinal = detectarTipoViagemFinal(prompt, tipoViagemDetectado);
  
  // ================================================================================
  // 🔧 DETECÇÃO MÚLTIPLAS OPÇÕES MELHORADA
  // ================================================================================
  
  let multiplasOpcoes = false;
  
  if (temImagem) {
    // Para imagens, ser mais sensível na detecção
    const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
    const totais = (promptLower.match(/total.*(\d+|adulto|criança)/gi) || []).length;
    const opcoes = (promptLower.match(/(opção|option|\d+\s*-)/gi) || []).length;
    const companhias = (promptLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
    const destinos = (promptLower.match(/(são paulo|rio|salvador|fortaleza|recife|brasília)/gi) || []).length;
    
    // Se tem múltiplos indicadores, assume múltiplas opções
    multiplasOpcoes = Math.max(precos, totais, opcoes, companhias) >= 2;
    
    console.log(`[ANÁLISE-IMAGEM] Preços: ${precos}, Totais: ${totais}, Opções: ${opcoes}, Companhias: ${companhias}`);
  } else {
    // Para texto, lógica mais conservadora
    const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
    const totais = (promptLower.match(/total.*(\d+|adulto)/gi) || []).length;
    const opcoes = (promptLower.match(/(opção|option)/gi) || []).length;
    
    multiplasOpcoes = Math.max(precos, totais, opcoes) >= 2;
  }
  
  // Detectar escalas/conexões
  const temEscalas = detectarEscalasFinal(prompt);
  
  // Detectar multitrecho
  const isMultitrecho = detectarMultitrecho(prompt);
  
  let tipoPrincipal = 'generico';
  
  if (tipos.includes('Aéreo Facial') || tipos.includes('Aéreo VBI/Fácil')) {
    if (isMultitrecho) {
      tipoPrincipal = 'multitrecho';
    } else {
      tipoPrincipal = 'aereo';
    }
  } else if (tipos.includes('Hotel')) {
    tipoPrincipal = 'hotel';
  } else if (tipos.includes('Carro')) {
    tipoPrincipal = 'carro';
  } else if (tipos.includes('Cruzeiro')) {
    tipoPrincipal = 'cruzeiro';
  } else {
    tipoPrincipal = tipos[0]?.toLowerCase() || 'generico';
  }
  
  console.log(`[ANÁLISE-FINAL] Tipo: ${tipoPrincipal}, TipoViagem: ${tipoViagemFinal}, Múltiplas: ${multiplasOpcoes}, Multitrecho: ${isMultitrecho}`);
  
  return {
    tipo: tipoPrincipal,
    multiplasOpcoes: multiplasOpcoes,
    produtosPrincipais: tipos,
    temEscalas: temEscalas,
    tipoViagem: tipoViagemFinal,
    temImagem: temImagem || false,
    isMultitrecho: isMultitrecho
  };
}

// ================================================================================
// 🔧 FUNÇÕES DE DETECÇÃO
// ================================================================================

function detectarTipoViagemFinal(texto, tipoDetectado) {
  console.log('[DETECCAO-TIPO] Analisando...');
  
  // Se já foi detectado pelo frontend, confiar na detecção
  if (tipoDetectado === 'ida_volta' || tipoDetectado === 'somente_ida') {
    console.log(`[DETECCAO-TIPO] ✅ Frontend: ${tipoDetectado}`);
    return tipoDetectado;
  }
  
  const textoLower = texto.toLowerCase();
  
  // Indicadores explícitos de ida e volta
  const indicadoresIdaVolta = [
    'ida e volta', 'ida/volta', 'round trip', 'retorno', 
    'latamida', 'latamvolta', 'ida:', 'volta:', 'retorno:',
    /\d+.*?jan.*?\d+.*?jan/i, /\d+.*?nov.*?\d+.*?nov/i,
    /\d{1,2} de \w+ - \d{1,2} de \w+/i,
    /gru.*?ssa.*?ssa.*?gru/i, /cgh.*?poa.*?poa.*?cgh/i
  ];
  
  const temIdaVolta = indicadoresIdaVolta.some(indicador => 
    typeof indicador === 'string' ? textoLower.includes(indicador) : indicador.test(textoLower)
  );
  
  // Indicadores de somente ida
  const indicadoresSomenteIda = ['somente ida', 'só ida', 'one way', 'sem retorno'];
  const temSomenteIda = indicadoresSomenteIda.some(indicador => textoLower.includes(indicador));
  
  // Análise heurística
  const horarios = (textoLower.match(/\d{2}:\d{2}/g) || []).length;
  const datas = (textoLower.match(/\d{1,2} de \w+|\d{1,2}\/\d{1,2}/gi) || []);
  const datasUnicas = [...new Set(datas.map(d => d.toLowerCase()))];
  
  console.log('[DETECCAO-TIPO] Métricas:', { horarios, datasUnicas: datasUnicas.length, temIdaVolta, temSomenteIda });
  
  if (temIdaVolta || (horarios >= 4 && datasUnicas.length >= 2)) {
    console.log('[DETECCAO-TIPO] ✅ IDA E VOLTA');
    return 'ida_volta';
  }
  
  if (temSomenteIda) {
    console.log('[DETECCAO-TIPO] ✅ SOMENTE IDA');
    return 'somente_ida';
  }
  
  // Padrão: ida e volta (mais comum)
  console.log('[DETECCAO-TIPO] ⚠️ Assumindo IDA E VOLTA (padrão)');
  return 'ida_volta';
}

function detectarEscalasFinal(texto) {
  const textoLower = texto.toLowerCase();
  const indicadoresEscalas = [
    'uma escala', 'duas escalas', 'três escalas', '1 escala', '2 escalas',
    'conexão', 'conexao', 'escala em', 'via ', 'parada em', 'parada de',
    'com escala', 'troca em', 'voo com conexão',
    /\d+h\s*\d+min.*escala/i, /escala.*\d+h/i, /via\s+\w{3,}/i,
    /parada.*\d+h/i, /parada.*\d+min/i
  ];
  
  return indicadoresEscalas.some(indicador => 
    typeof indicador === 'string' ? textoLower.includes(indicador) : indicador.test(texto)
  );
}

function detectarMultitrecho(texto) {
  const textoLower = texto.toLowerCase();
  const indicadoresMultitrecho = [
    'multitrecho', 'multi trecho', 'múltiplos trechos',
    'trecho 1', 'trecho 2', 'trecho 3',
    /trecho\s*\d+/i, /múltiplos.*destinos/i
  ];
  
  // Também detecta se há 3+ destinos diferentes
  const destinos = [...new Set(texto.match(/[A-Z]{3}/g) || [])];
  
  return indicadoresMultitrecho.some(indicador => 
    typeof indicador === 'string' ? textoLower.includes(indicador) : indicador.test(texto)
  ) || destinos.length >= 3;
}

// ================================================================================
// 🔧 SELEÇÃO DE TEMPLATE FINAL
// ================================================================================

function selecionarTemplateFinal(analise, tipos) {
  console.log('[TEMPLATE-FINAL] Selecionando:', {
    tipos, 
    tipo: analise.tipo,
    tipoViagem: analise.tipoViagem, 
    multiplasOpcoes: analise.multiplasOpcoes,
    isMultitrecho: analise.isMultitrecho
  });
  
  if (!tipos || tipos.length === 0) {
    return {
      nome: 'Aéreo Ida e Volta',
      conteudo: TEMPLATES['Aéreo Ida e Volta']
    };
  }

  const tipoPrincipal = tipos[0];
  
  // ================================================================================
  // 🔧 SELEÇÃO POR TIPO DE SERVIÇO
  // ================================================================================
  
  if (tipoPrincipal === 'Aéreo Facial' || tipoPrincipal === 'Aéreo VBI/Fácil') {
    
    // MULTITRECHO tem prioridade
    if (analise.isMultitrecho) {
      console.log('[TEMPLATE-FINAL] ✅ Multitrecho');
      return {
        nome: 'Multitrecho',
        conteudo: TEMPLATES['Multitrecho']
      };
    }
    
    // MÚLTIPLAS OPÇÕES
    if (analise.multiplasOpcoes) {
      if (analise.tipoViagem === 'ida_volta') {
        console.log('[TEMPLATE-FINAL] ✅ Múltiplas Ida e Volta');
        return {
          nome: 'Múltiplas Ida e Volta',
          conteudo: TEMPLATES['Múltiplas Ida e Volta']
        };
      } else {
        console.log('[TEMPLATE-FINAL] ✅ Múltiplas Somente Ida');
        return {
          nome: 'Múltiplas Somente Ida',
          conteudo: TEMPLATES['Múltiplas Somente Ida']
        };
      }
    }
    
    // OPÇÃO ÚNICA
    if (analise.tipoViagem === 'ida_volta') {
      console.log('[TEMPLATE-FINAL] ✅ Aéreo Ida e Volta');
      return {
        nome: 'Aéreo Ida e Volta',
        conteudo: TEMPLATES['Aéreo Ida e Volta']
      };
    } else {
      console.log('[TEMPLATE-FINAL] ✅ Aéreo Somente Ida');
      return {
        nome: 'Aéreo Somente Ida',
        conteudo: TEMPLATES['Aéreo Somente Ida']
      };
    }
  }
  
  // HOTEL
  if (tipoPrincipal === 'Hotel') {
    if (analise.multiplasOpcoes) {
      console.log('[TEMPLATE-FINAL] ✅ Hotel Múltiplas Opções');
      return {
        nome: 'Hotel Múltiplas Opções',
        conteudo: TEMPLATES['Hotel Múltiplas Opções']
      };
    } else {
      console.log('[TEMPLATE-FINAL] ✅ Hotel');
      return {
        nome: 'Hotel',
        conteudo: TEMPLATES['Hotel']
      };
    }
  }
  
  // CRUZEIRO
  if (tipoPrincipal === 'Cruzeiro') {
    console.log('[TEMPLATE-FINAL] ✅ Cruzeiro');
    return {
      nome: 'Cruzeiro',
      conteudo: TEMPLATES['Cruzeiro']
    };
  }
  
  // FALLBACK
  console.warn(`[TEMPLATE-FINAL] Fallback para: ${tipoPrincipal}`);
  return {
    nome: 'Aéreo Ida e Volta',
    conteudo: TEMPLATES['Aéreo Ida e Volta']
  };
}

// ================================================================================
// 🏗️ CONSTRUÇÃO DO PROMPT FINAL
// ================================================================================

function construirPromptFinal(promptBase, template, analise, tipos, parcelamento, camposOpcionais, temImagem, arquivo) {
  console.log('[PROMPT-FINAL] Construindo...', {
    template: template.nome,
    temImagem: temImagem,
    multiplasOpcoes: analise.multiplasOpcoes,
    tipoViagem: analise.tipoViagem
  });
  
  const tipoPrincipal = tipos?.[0] || 'Aéreo Facial';
  
  let prompt = '';

  // ================================================================================
  // 📝 INSTRUÇÕES ESPECIAIS PARA ANÁLISE DE IMAGEM
  // ================================================================================
  
  if (temImagem && arquivo) {
    prompt += `VOCÊ É UM ESPECIALISTA EM ANÁLISE DE IMAGENS DE PASSAGENS AÉREAS E HOTÉIS.\n\n`;
    
    prompt += `INSTRUÇÕES CRÍTICAS PARA ANÁLISE DE IMAGEM:\n`;
    prompt += `1. 🔍 EXAMINE CUIDADOSAMENTE toda a imagem\n`;
    prompt += `2. 📍 EXTRAIA: destinos, datas, horários, companhias, preços EXATOS\n`;
    prompt += `3. ✈️ IDENTIFIQUE: se é ida/volta, somente ida, ou múltiplas opções\n`;
    prompt += `4. 🏷️ LEIA: nomes de companhias (Latam, Azul, Gol, TAP, etc.)\n`;
    prompt += `5. 💰 CAPTURE: valores monetários EXATOS (R$ X.XXX,XX)\n`;
    prompt += `6. 🎫 DETECTE: quantos passageiros (adultos/crianças)\n`;
    prompt += `7. 🧳 OBSERVE: informações de bagagem se visíveis\n`;
    prompt += `8. 🔗 PROCURE: links ou códigos de reserva\n\n`;
    
    prompt += `❗ IMPORTANTE: Use APENAS informações que você consegue LER na imagem.\n`;
    prompt += `❌ NÃO invente dados que não estão visíveis.\n\n`;
    
    // INSTRUÇÕES ESPECIAIS PARA MÚLTIPLAS OPÇÕES EM IMAGEM
    if (analise.multiplasOpcoes) {
      prompt += `⚠️ ATENÇÃO: DETECTEI MÚLTIPLAS OPÇÕES NA IMAGEM!\n`;
      prompt += `- Numere como "Opção 1", "Opção 2", etc.\n`;
      prompt += `- Separe CLARAMENTE cada opção\n`;
      prompt += `- NÃO misture informações entre opções\n`;
      prompt += `- Cada opção deve ter seu próprio preço e detalhes\n\n`;
    }
  }

  // ================================================================================
  // 📝 INSTRUÇÕES GERAIS BASEADAS NO TIPO
  // ================================================================================
  
  prompt += `VOCÊ É UM ESPECIALISTA EM ORÇAMENTOS DE VIAGEM DA CVC ITAQUA.\n\n`;
  
  prompt += `🎯 PRODUTO DETECTADO: ${tipoPrincipal}\n`;
  prompt += `🎯 TEMPLATE: ${template.nome}\n`;
  prompt += `🎯 TIPO VIAGEM: ${analise.tipoViagem}\n`;
  prompt += `🎯 MÚLTIPLAS OPÇÕES: ${analise.multiplasOpcoes ? 'SIM' : 'NÃO'}\n\n`;

  // ================================================================================
  // 📝 INSTRUÇÕES ESPECÍFICAS POR TEMPLATE
  // ================================================================================
  
  if (template.nome.includes('Multitrecho')) {
    prompt += `🛫 INSTRUÇÕES MULTITRECHO:\n`;
    prompt += `- Organize por "Trecho 1:", "Trecho 2:", etc.\n`;
    prompt += `- Para conexões detalhadas: "17/09 - Guarulhos 00:45 / Lisboa 14:35\\n(parada em Lisboa de 2h25min)\\n17/09 - Lisboa 17:00 / Madrid 19:20"\n`;
    prompt += `- Para conexões simples: "(voo com conexão)" ou "(voo direto)"\n`;
    prompt += `- Use periodo total: "17/09 a 30/09 (14 dias e 13 noites)"\n\n`;
  }
  
  if (template.nome.includes('Múltiplas')) {
    prompt += `📊 INSTRUÇÕES MÚLTIPLAS OPÇÕES:\n`;
    prompt += `- Numere como "*Opção 1*", "*Opção 2*", etc.\n`;
    prompt += `- Separe claramente cada opção\n`;
    prompt += `- Mantenha preços e detalhes específicos para cada\n`;
    prompt += `- NÃO misture informações entre opções\n\n`;
  }
  
  if (template.nome.includes('Hotel')) {
    prompt += `🏨 INSTRUÇÕES HOTEL:\n`;
    prompt += `- Inclua categoria do hotel (⭐⭐⭐ 3 estrelas)\n`;
    prompt += `- Calcule corretamente o número de noites\n`;
    prompt += `- Especifique regime alimentar se disponível\n\n`;
  }

  // ================================================================================
  // 🎯 TEXTO BASE E TEMPLATE
  // ================================================================================
  
  prompt += `📄 CONTEÚDO PARA ANÁLISE:\n`;
  prompt += `${promptBase}\n\n`;
  
  prompt += `📋 TEMPLATE A USAR:\n`;
  prompt += `${template.conteudo}\n\n`;

  // ================================================================================
  // 📝 INSTRUÇÕES FINAIS E PARCELAMENTO
  // ================================================================================
  
  prompt += `\n📝 INSTRUÇÕES FINAIS DE FORMATAÇÃO:\n`;
  prompt += `- ✅ Preencha apenas com dados reais encontrados no texto/imagem\n`;
  prompt += `- ❌ Não invente informações que não existem\n`;
  prompt += `- 🔗 Mantenha links e valores monetários exatos\n`;
  prompt += `- ✈️ Converta códigos de aeroporto para nomes completos (Ex: CGH = Congonhas, VCP = Viracopos)\n`;
  prompt += `- 📅 Use datas no formato dd/mm (Ex: 15/11 ao invés de "15 de novembro")\n`;
  prompt += `- ⏰ Use horários sem espaços extras (Ex: 06:20 ao invés de "06: 20")\n`;
  prompt += `- 🛫 Para ida e volta, use OBRIGATORIAMENTE o separador "--" entre os trechos\n`;
  prompt += `- 👥 Formate passageiros como "02 adultos" (com zero à esquerda)\n`;
  prompt += `- 🧳 Substitua [BAGAGEM_INFO] por "Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa"\n`;
  
  if (analise.tipo === 'aereo') {
    prompt += `- 🛫 ESCALAS/CONEXÕES: Se detectar escalas, adicione detalhes como "(1 escala)" ou "(voo direto)" após o horário\n`;
    prompt += `- ✈️ FORMATO OBRIGATÓRIO para ida e volta:\n`;
    prompt += `  15/11 - Congonhas 06:20 / Porto Alegre 08:00 (voo direto)\n`;
    prompt += `  --\n`;
    prompt += `  17/11 - Porto Alegre 19:30 / Congonhas 21:10 (voo direto)\n`;
  }

  // PARCELAMENTO
  if (parcelamento && parcelamento.ativo) {
    prompt += `\n💳 PARCELAMENTO:\n`;
    if (parcelamento.tipo === 'especifico' && parcelamento.detalhes) {
      prompt += `- Use: "Parcelamento: ${parcelamento.detalhes}"\n`;
    } else if (parcelamento.parcelas) {
      prompt += `- Use: "💰 [VALOR] em ${parcelamento.parcelas}x de R$ [VALOR_PARCELA]"\n`;
    }
  }

  prompt += `\n🎯 RESPONDA APENAS COM O TEMPLATE PREENCHIDO, SEM EXPLICAÇÕES ADICIONAIS.\n`;
  prompt += `📝 NÃO inclua cabeçalhos como "Orçamento:" ou "Resultado:" - comece direto com o conteúdo formatado.`;

  return prompt;
}

// ================================================================================
// 🤖 SISTEMA DE IA (COMPLETO)
// ================================================================================

function selecionarModelo(temImagem) {
  if (temImagem === true) {
    return {
      modelo: 'claude-3-5-sonnet-20240620',
      estrategia: 'Claude para análise visual',
      fallback: 'gpt-4o'
    };
  } else {
    return {
      modelo: 'gpt-4o-mini',
      estrategia: 'GPT-4o-mini para texto',
      fallback: 'gpt-4o'
    };
  }
}

async function chamarIASegura(prompt, temImagem, arquivo, modelo, fallbackModelo) {
  try {
    if (temImagem === true) {
      return await chamarClaude(prompt, arquivo, modelo);
    } else {
      return await chamarOpenAI(prompt, false, null, modelo);
    }
  } catch (erro1) {
    console.error(`❌ Falha principal no modelo ${modelo}: ${erro1.message}`);
    
    // ✅ NOVO: Fallback específico para imagens
    if (temImagem === true) {
      console.warn(`⚠️ Claude falhou, tentando GPT-4o com visão...`);
      try {
        return await chamarOpenAI(prompt, true, arquivo, 'gpt-4o');
      } catch (erro2) {
        throw new Error(`Ambos os modelos falharam: ${erro1.message} | ${erro2.message}`);
      }
    } else {
      // Fallback normal para texto
      try {
        console.warn(`⚠️ Tentando fallback com ${fallbackModelo}...`);
        return await chamarOpenAI(prompt, false, null, fallbackModelo);
      } catch (erro2) {
        throw new Error(`Ambos os modelos falharam: ${erro1.message} | ${erro2.message}`);
      }
    }
  }
}

async function chamarClaude(prompt, arquivo, modelo) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente');
  }

  const base64Match = arquivo.match(/data:(image\/[^;]+);base64,(.+)/);
  if (!base64Match) {
    throw new Error('Formato de imagem base64 inválido');
  }

  const content = [
    { type: "text", text: prompt },
    { type: "image", source: { type: "base64", media_type: base64Match[1], data: base64Match[2] } }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API Claude ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  if (!data.content?.[0]?.text) {
    throw new Error('Resposta da API Claude em formato inválido');
  }

  return {
    content: data.content[0].text,
    usage: data.usage || { input_tokens: 0, output_tokens: 0 },
    modelo_usado: modelo
  };
}

async function chamarOpenAI(prompt, temImagem, arquivo, modelo) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
  }

  let messages;
  if (temImagem === true && arquivo) {
    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: arquivo } }
        ]
      }
    ];
  } else {
    messages = [{ role: "user", content: prompt }];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelo,
      messages: messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API OpenAI ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Resposta da API OpenAI em formato inválido');
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 },
    modelo_usado: modelo
  };
}

// ================================================================================
// 🧹 PROCESSAMENTO DA RESPOSTA
// ================================================================================

function processarRespostaFinal(conteudo) {
  console.log('[PROCESSAR-RESPOSTA] Iniciando processamento avançado...');
  
  if (!conteudo || typeof conteudo !== 'string') {
    console.error('[PROCESSAR-RESPOSTA] Conteúdo inválido');
    return 'Erro: Resposta inválida da IA';
  }
  
  let resultado = conteudo.trim();
  
  // ================================================================================
  // 🧹 LIMPEZA INICIAL
  // ================================================================================
  
  // Remover cabeçalhos técnicos
  resultado = resultado.replace(/^(Orçamento:|Resultado:|Resposta:)/i, '').trim();
  
  // ================================================================================
  // ✈️ FORMATAÇÃO ESPECÍFICA PARA PASSAGENS AÉREAS
  // ================================================================================
  
  // 1. CORRIGIR HORÁRIOS - remover espaços extras: "06: 20" → "06:20"
  resultado = resultado.replace(/(\d{1,2}):\s+(\d{2})/g, '$1:$2');
  
  // 2. CORRIGIR DATAS - simplificar: "15 de novembro" → "15/11"
  const meses = {
    'janeiro': '01', 'jan': '01',
    'fevereiro': '02', 'fev': '02',
    'março': '03', 'mar': '03',
    'abril': '04', 'abr': '04',
    'maio': '05', 'mai': '05',
    'junho': '06', 'jun': '06',
    'julho': '07', 'jul': '07',
    'agosto': '08', 'ago': '08',
    'setembro': '09', 'set': '09',
    'outubro': '10', 'out': '10',
    'novembro': '11', 'nov': '11',
    'dezembro': '12', 'dez': '12'
  };
  
  Object.entries(meses).forEach(([nomeMes, numeroMes]) => {
    const regex = new RegExp(`(\\d{1,2})\\s+de\\s+${nomeMes}`, 'gi');
    resultado = resultado.replace(regex, `$1/${numeroMes}`);
  });
  
  // 3. GARANTIR SEPARADOR IDA/VOLTA - forçar quebra de linha com "--"
  resultado = resultado.replace(
    /(\d{2}:\d{2}\s+[A-Za-z\s]+)\s*-\s*-\s*(\d{1,2}\/\d{1,2}\s+-\s+[A-Za-z\s]+\s+\d{2}:\d{2})/g,
    '$1\n--\n$2'
  );
  
  // 4. CORRIGIR CONEXÕES - garantir formato correto
  resultado = resultado.replace(/Voo direto/g, '(voo direto)');
  resultado = resultado.replace(/voo direto/g, '(voo direto)');
  
  // 5. SUBSTITUIR PLACEHOLDERS NÃO PREENCHIDOS
  resultado = resultado.replace(/\[BAGAGEM_INFO\]/g, 'Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa');
  resultado = resultado.replace(/\[REEMBOLSAVEL\]/g, 'Não reembolsável');
  resultado = resultado.replace(/\[LINK\]/g, '');
  
  // 6. PADRONIZAR PASSAGEIROS - "2 Adultos" → "02 adultos"
  resultado = resultado.replace(/(\d)\s+(Adultos?)/gi, (match, num, palavra) => {
    const numeroFormatado = num.padStart(2, '0');
    return `${numeroFormatado} ${palavra.toLowerCase()}`;
  });
  
  // ================================================================================
  // ✈️ CONVERSÃO DE CÓDIGOS DE AEROPORTO
  // ================================================================================
  
  resultado = converterCodigosAeroporto(resultado);
  
  // ================================================================================
  // 🔧 MELHORIAS FINAIS DE FORMATAÇÃO
  // ================================================================================
  
  // Corrigir espaçamento em valores monetários
  resultado = resultado.replace(/R\$\s*(\d+)/g, 'R$ $1');
  
  // Garantir espaço após emojis
  resultado = resultado.replace(/([📱🎯✅❌⚠️💰🏨✈️🛫🚢])([A-Za-z])/g, '$1 $2');
  
  // Limpar quebras de linha excessivas, mas manter estrutura
  resultado = resultado.replace(/\n{3,}/g, '\n\n');
  
  // Garantir quebra de linha antes do valor total
  resultado = resultado.replace(/(💰\s*Valor total)/g, '\n$1');
  
  console.log('[PROCESSAR-RESPOSTA] Processamento avançado concluído');
  
  return resultado;
}

function converterCodigosAeroporto(texto) {
  let resultado = texto;
  
  // Converter códigos para nomes completos
  Object.entries(aeroportos).forEach(([codigo, nome]) => {
    // Padrão: GRU -> Guarulhos (SP) para principais aeroportos brasileiros
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    if (resultado.match(regex)) {
      // Adicionar estado para aeroportos brasileiros principais
      const nomeCompleto = codigo.match(/^(CGH|GRU|VCP|SDU|GIG|BSB|CNF|CWB|REC|FOR|SSA|POA|FLN)$/) 
        ? `${nome} (${obterEstadoAeroporto(codigo)})` 
        : nome;
      resultado = resultado.replace(regex, nomeCompleto);
    }
  });
  
  return resultado;
}

function obterEstadoAeroporto(codigo) {
  const estados = {
    'CGH': 'SP', 'GRU': 'SP', 'VCP': 'SP',
    'SDU': 'RJ', 'GIG': 'RJ',
    'BSB': 'DF', 'CNF': 'MG', 'PLU': 'MG',
    'CWB': 'PR', 'IGU': 'PR',
    'REC': 'PE', 'FOR': 'CE', 'SSA': 'BA',
    'POA': 'RS', 'FLN': 'SC',
    'MAO': 'AM', 'BEL': 'PA', 'CGB': 'MT'
  };
  return estados[codigo] || '';
}

// ================================================================================
// 📊 MÉTRICAS E CÁLCULOS
// ================================================================================

function calcularMetricas(resultado, startTime, estrategia) {
  const tempoTotal = Date.now() - startTime;
  const modelo = resultado.modelo_usado || 'desconhecido';
  
  let custoBRL = 0;
  let economiaUSD = 0;
  
  if (resultado.usage) {
    const precos = PRECOS_MODELOS[modelo] || PRECOS_MODELOS['gpt-4o-mini'];
    
    const inputTokens = resultado.usage.input_tokens || resultado.usage.prompt_tokens || 0;
    const outputTokens = resultado.usage.output_tokens || resultado.usage.completion_tokens || 0;
    
    const custoUSD = (inputTokens / 1000 * precos.input) + (outputTokens / 1000 * precos.output);
    custoBRL = custoUSD * USD_TO_BRL;
    
    // Economia comparado com GPT-4o
    const custoGPT4o = (inputTokens / 1000 * PRECOS_MODELOS['gpt-4o'].input) + 
                       (outputTokens / 1000 * PRECOS_MODELOS['gpt-4o'].output);
    economiaUSD = custoGPT4o - custoUSD;
  }

  return {
    processamento: {
      tempo_total_ms: tempoTotal,
      modelo_usado: modelo,
      estrategia: estrategia
    },
    tokens: resultado.usage || {},
    custo: {
      valor_brl: parseFloat(custoBRL.toFixed(4)),
      economia_usd: parseFloat(economiaUSD.toFixed(4)),
      economia_percentual: economiaUSD > 0 ? 
        ((economiaUSD / (economiaUSD + (custoBRL / USD_TO_BRL))) * 100).toFixed(1) + '%' : '0%'
    },
    performance: {
      tempo_processamento_ms: tempoTotal
    }
  };
}

console.log('✅ [API-FINAL] CVC Itaqua API v6.0-final carregada');
console.log('🔧 [FOCO] Leitura de imagens CORRIGIDA com instruções detalhadas');
console.log('✈️ [MELHORIA] Templates WhatsApp + Conexões + Parcelamento específico');
console.log('🎯 [CORREÇÃO] Detecção múltiplas opções MELHORADA para imagens');
console.log('🚀 [STATUS] Pronto para gerar orçamentos profissionais e corretos!');
