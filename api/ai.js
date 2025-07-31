// ================================================================================
// 🏆 CVC ITAQUA - API CORRIGIDA v5.3.1-fixed
// ================================================================================
// CORREÇÕES: Detecção ida/volta + Campos opcionais + Templates corretos
// ================================================================================

// ================================================================================
// 🗺️ MAPEAMENTO COMPLETO DE AEROPORTOS
// ================================================================================

const aeroportos = {
  // Principais aeroportos brasileiros
  'CGH': 'Congonhas (SP)', 'GRU': 'Guarulhos (SP)', 'VCP': 'Viracopos (SP)',
  'SDU': 'Santos Dumont (RJ)', 'GIG': 'Galeão (RJ)', 
  'BSB': 'Brasília (DF)', 'CNF': 'Confins (MG)', 'PLU': 'Pampulha (MG)',
  'CWB': 'Curitiba (PR)', 'IGU': 'Foz do Iguaçu (PR)', 
  'REC': 'Recife (PE)', 'FOR': 'Fortaleza (CE)', 'SSA': 'Salvador (BA)',
  'MAO': 'Manaus (AM)', 'BEL': 'Belém (PA)', 'CGB': 'Cuiabá (MT)',
  'CGR': 'Campo Grande (MS)', 'AJU': 'Aracaju (SE)', 'MCZ': 'Maceió (AL)',
  'JPA': 'João Pessoa (PB)', 'NAT': 'Natal (RN)', 'THE': 'Teresina (PI)',
  'SLZ': 'São Luís (MA)', 'VIX': 'Vitória (ES)', 'FLN': 'Florianópolis (SC)',
  'POA': 'Porto Alegre (RS)', 'BPS': 'Porto Seguro (BA)', 'IOS': 'Ilhéus (BA)',
  'RAO': 'Ribeirão Preto (SP)', 'NVT': 'Navegantes (SC)', 'UDI': 'Uberlândia (MG)',
  'MOC': 'Montes Claros (MG)', 'JDF': 'Juiz de Fora (MG)', 'GYN': 'Goiânia (GO)',
  'PNZ': 'Petrolina (PE)', 'JTC': 'Bauru (SP)', 'AQA': 'Araraquara (SP)',
  'PPB': 'Presidente Prudente (SP)', 'CXJ': 'Caxias do Sul (RS)',
  
  // Aeroportos internacionais importantes
  'EZE': 'Buenos Aires (Argentina)', 'MVD': 'Montevidéu (Uruguai)',
  'ASU': 'Assunção (Paraguai)', 'SCL': 'Santiago (Chile)', 'LIM': 'Lima (Peru)',
  'BOG': 'Bogotá (Colômbia)', 'UIO': 'Quito (Equador)', 'CCS': 'Caracas (Venezuela)',
  'MIA': 'Miami (EUA)', 'MCO': 'Orlando (EUA)', 'JFK': 'Nova York (EUA)',
  'LAX': 'Los Angeles (EUA)', 'CDG': 'Paris (França)', 'MAD': 'Madrid (Espanha)',
  'FCO': 'Roma (Itália)', 'LIS': 'Lisboa (Portugal)', 'LGW': 'Londres (Reino Unido)',
  'AMS': 'Amsterdã (Holanda)', 'FRA': 'Frankfurt (Alemanha)', 'ZUR': 'Zurich (Suíça)',
  'DXB': 'Dubai (Emirados)', 'DOH': 'Doha (Catar)', 'IST': 'Istambul (Turquia)'
};

// ================================================================================
// 📋 TEMPLATES CORRIGIDOS - IDA/VOLTA VS SOMENTE IDA
// ================================================================================

const TEMPLATES = {
  // ✅ TEMPLATE CORRIGIDO PARA SOMENTE IDA
  'Aéreo Somente Ida': `*Passagem Aérea - Somente Ida*
🏷️ [COMPANHIA]
🗓️ [DATA] (Somente ida)
✈️ [DATA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA][DETALHES_VOO]
💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

⚠️ Passagem somente de ida - sem retorno incluído`,

  // ✅ TEMPLATE CORRIGIDO PARA IDA E VOLTA
  'Aéreo Ida e Volta': `*Passagem Aérea - Ida e Volta*
🏷️ [COMPANHIA]
🗓️ [DATA_IDA] a [DATA_VOLTA] ([DURACAO])
✈️ Ida: [DATA_IDA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA_IDA][DETALHES_VOO_IDA]
✈️ Volta: [DATA_VOLTA] - [DESTINO] [HORA_SAIDA_VOLTA] / [ORIGEM] [HORA_CHEGADA_VOLTA][DETALHES_VOO_VOLTA]

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PAGAMENTO]
🔗 [LINK]

✅ Passagem ida e volta incluída`,

  // ✅ TEMPLATE PARA MÚLTIPLAS OPÇÕES SOMENTE IDA
  'Múltiplas Somente Ida': `*Passagens Aéreas - Opções Somente Ida*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_1] (Somente ida)
✈️ [DATA_1] - [ORIGEM_1] [HORA_IDA_1] / [DESTINO_1] [HORA_CHEGADA_1][DETALHES_VOO_1]
💰 R$ [VALOR_1] para [PASSAGEIROS_1]
💳 [PAGAMENTO_1]
🔗 [LINK_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_2] (Somente ida)
✈️ [DATA_2] - [ORIGEM_2] [HORA_IDA_2] / [DESTINO_2] [HORA_CHEGADA_2][DETALHES_VOO_2]
💰 R$ [VALOR_2] para [PASSAGEIROS_2]
💳 [PAGAMENTO_2]
🔗 [LINK_2]

⚠️ Todas as opções são SOMENTE IDA - sem retorno incluído`,

  // ✅ TEMPLATE PARA MÚLTIPLAS OPÇÕES IDA E VOLTA
  'Múltiplas Ida e Volta': `*Passagens Aéreas - Opções Ida e Volta*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [ORIGEM_1] [HORA_IDA_1] / [DESTINO_1] [HORA_CHEGADA_IDA_1][DETALHES_IDA_1]
✈️ Volta: [DATA_VOLTA_1] - [DESTINO_1] [HORA_SAIDA_VOLTA_1] / [ORIGEM_1] [HORA_CHEGADA_VOLTA_1][DETALHES_VOLTA_1]
💰 R$ [VALOR_1] para [PASSAGEIROS_1]
🔗 [LINK_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [ORIGEM_2] [HORA_IDA_2] / [DESTINO_2] [HORA_CHEGADA_IDA_2][DETALHES_IDA_2]
✈️ Volta: [DATA_VOLTA_2] - [DESTINO_2] [HORA_SAIDA_VOLTA_2] / [ORIGEM_2] [HORA_CHEGADA_VOLTA_2][DETALHES_VOLTA_2]
💰 R$ [VALOR_2] para [PASSAGEIROS_2]
🔗 [LINK_2]

✅ Todas as opções incluem ida e volta`,

  // Outros templates mantidos
  'Hotel': `*Hospedagem*
🏨 [NOME_HOTEL] - [CATEGORIA]⭐
📍 [LOCALIZACAO]
🗓️ [CHECK_IN] a [CHECK_OUT] ([NOITES] noites)
👥 [ADULTOS] adultos[CRIANCAS_TEXTO]

🏠 *Acomodação:*
[TIPO_QUARTO] com [REGIME_ALIMENTACAO]

✅ *Inclui:*
• [CAFE_MANHA]
• [WIFI]
• [SERVICOS_INCLUSOS]

💰 R$ [VALOR_TOTAL] para toda a estadia
💳 Parcelamento: [PARCELAS]x de R$ [VALOR_PARCELA]

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva`,

  'Cruzeiro': `🚢 Cruzeiro [NOME_NAVIO] – [DURACAO_NOITES] noites
[COMPOSICAO_PASSAGEIROS]
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO_EMBARQUE]
🌊 Roteiro incrível pelo litoral brasileiro!

🗺 Itinerário:
[ROTEIRO_DETALHADO]

💥 [TIPO_TARIFA]!
(Sujeita à confirmação de cabine e categoria)

[OPCOES_CABINES]

📎 Link para ver fotos, detalhes e reservar:
[LINK_CRUZEIRO]

✅ Inclui: hospedagem a bordo, pensão completa (refeições), entretenimento e atividades para todas as idades!
🚫 Não inclui: taxas, bebidas, excursões e transporte até o porto.

📲 Me chama pra garantir a sua cabine nesse cruzeiro incrível! 🌴🛳️`,

  'Carro': `*Aluguel de Carro*
🚗 [MODELO_CARRO] - [CATEGORIA]
🏢 [LOCADORA]
📍 Retirada: [LOCAL_RETIRADA]
📍 Devolução: [LOCAL_DEVOLUCAO]
🗓️ [DATA_RETIRADA] às [HORA_RETIRADA] até [DATA_DEVOLUCAO] às [HORA_DEVOLUCAO]
⏱️ [DURACAO_DIAS] dias

🔧 *Especificações:*
• [CAMBIO] | [COMBUSTIVEL]
• [AR_CONDICIONADO]
• [PORTAS] portas | [PASSAGEIROS] passageiros
• [BAGAGEM]

✅ *Inclui:*
• [QUILOMETRAGEM]
• [SEGUROS_INCLUSOS]
• [TAXAS_INCLUIDAS]

💰 R$ [VALOR_TOTAL] para [DURACAO_DIAS] dias
💳 [FORMA_PAGAMENTO]
🔗 [LINK]

⚠️ Valores sujeitos à disponibilidade. Documentação obrigatória: CNH válida`
};

const PRECOS_MODELOS = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 }
};

const USD_TO_BRL = 5.2;
const MAX_TOKENS = 2500;

// ================================================================================
// 🎯 HANDLER PRINCIPAL CORRIGIDO
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('[API-CORRIGIDA] Iniciando processamento...');
    
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
        message: 'CVC Itaqua API - Sistema Corrigido',
        version: '5.3.1-fixed',
        produtos_suportados: Object.keys(TEMPLATES),
        correcoes: [
          'Detecção ida/volta vs somente ida corrigida',
          'Validação de campos opcionais corrigida',
          'Templates específicos para cada tipo de viagem',
          'Sistema de parcelamento condicional',
          'Conversão completa de aeroportos'
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
    console.log(`[API-CORRIGIDA] Prompt: ${prompt.length} chars, Tipos: ${tipos?.join(', ')}, TipoViagem: ${tipoViagem}`);

    // ================================================================================
    // 🔧 ANÁLISE CORRIGIDA E SELEÇÃO DE TEMPLATE
    // ================================================================================
    
    const analise = analisarConteudoCorrigido(prompt, tipos, tipoViagem);
    const template = selecionarTemplateCorrigido(analise, tipos);
    console.log(`[API-CORRIGIDA] Template selecionado: ${template.nome}`);

    // ================================================================================
    // 🔧 CONSTRUIR PROMPT CORRIGIDO
    // ================================================================================
    
    const promptFinal = construirPromptCorrigido(prompt, template, analise, tipos, parcelamento, camposOpcionais);

    // CHAMADA PARA IA
    const { modelo, estrategia, fallback } = selecionarModelo(temImagem);
    const resultado = await chamarIASegura(promptFinal, temImagem, arquivo, modelo, fallback);
    
    const responseProcessada = processarRespostaCorrigida(resultado.content);
    const metricas = calcularMetricas(resultado, startTime, estrategia);

    console.log(`[API-CORRIGIDA] Concluído: ${Date.now() - startTime}ms`);

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
    console.error('💥 [API-CORRIGIDA ERROR] 💥', error.message);
    
    return res.status(500).json({
      success: false,
      error: {
        message: `Erro no servidor: ${error.message}`,
        type: 'SERVER_ERROR',
        version: '5.3.1-fixed'
      }
    });
  }
}

// ================================================================================
// 🔍 ANÁLISE CORRIGIDA DE CONTEÚDO
// ================================================================================

function analisarConteudoCorrigido(prompt, tipos, tipoViagemDetectado) {
  console.log('[ANÁLISE-CORRIGIDA] Analisando tipos:', tipos, 'TipoDetectado:', tipoViagemDetectado);
  
  if (!prompt || !tipos || tipos.length === 0) {
    return { 
      tipo: 'generico', 
      multiplasOpcoes: false,
      produtosPrincipais: ['Aéreo Somente Ida'],
      temEscalas: false,
      tipoViagem: tipoViagemDetectado || 'somente_ida'
    };
  }

  const promptLower = prompt.toLowerCase();
  
  // Detectar múltiplas opções
  const precos = (promptLower.match(/r\$[\s]*[\d.,]+/gi) || []).length;
  const totais = (promptLower.match(/total.*\d+/gi) || []).length;
  const links = (promptLower.match(/https:\/\/www\.cvc\.com\.br/gi) || []).length;
  const companhias = (promptLower.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  
  const multiplasOpcoes = Math.max(precos, totais, links, companhias) >= 2;
  
  // Detectar escalas/conexões
  const temEscalas = detectarEscalasCorrigido(prompt);
  
  // ================================================================================
  // 🔧 USAR TIPO DE VIAGEM DETECTADO PELO FRONTEND
  // ================================================================================
  
  const tipoViagemFinal = tipoViagemDetectado || analisarTipoViagemLocal(prompt);
  
  let tipoPrincipal = 'generico';
  
  if (tipos.includes('Aéreo Facial') || tipos.includes('Aéreo VBI/Fácil')) {
    tipoPrincipal = 'aereo';
  } else if (tipos.includes('Hotel')) {
    tipoPrincipal = 'hotel';
  } else if (tipos.includes('Carro')) {
    tipoPrincipal = 'carro';
  } else if (tipos.includes('Cruzeiro')) {
    tipoPrincipal = 'cruzeiro';
  } else {
    tipoPrincipal = tipos[0]?.toLowerCase() || 'generico';
  }
  
  console.log(`[ANÁLISE-CORRIGIDA] Tipo: ${tipoPrincipal}, Múltiplas: ${multiplasOpcoes}, TipoViagem: ${tipoViagemFinal}`);
  
  return {
    tipo: tipoPrincipal,
    multiplasOpcoes: multiplasOpcoes,
    produtosPrincipais: tipos,
    temEscalas: temEscalas,
    tipoViagem: tipoViagemFinal
  };
}

// ================================================================================
// 🔧 FUNÇÕES DE DETECÇÃO (usadas pela análise)
// ================================================================================

function detectarEscalasCorrigido(texto) {
    const textoLower = texto.toLowerCase();
    const indicadoresEscalas = [
        'uma escala', 'duas escalas', 'três escalas',
        'conexão', 'conexao', 'escala em', 'via ',
        'com escala', 'parada em', 'troca em',
        /\d+h\s*\d+min.*escala/i,
        /escala.*\d+h/i,
        /via\s+\w{3,}/i
    ];
    const temEscala = indicadoresEscalas.some(indicador => 
        typeof indicador === 'string' ? textoLower.includes(indicador) : indicador.test(texto)
    );
    const temposVoo = texto.match(/(\d+)h\s*(\d+)?min/gi) || [];
    const temVooLongo = temposVoo.some(tempo => {
        const match = tempo.match(/(\d+)h/);
        return match && parseInt(match[1]) >= 4;
    });
    return temEscala || temVooLongo;
}

function analisarTipoViagemLocal(texto) {
    const textoLower = texto.toLowerCase();
    const indicadoresIdaVolta = [
        'ida e volta', 'ida/volta', 'round trip', 'retorno', 
        /volta.*\d{2}/
    ];
    const temIdaVolta = indicadoresIdaVolta.some(indicador => 
        typeof indicador === 'string' ? textoLower.includes(indicador) : indicador.test(textoLower)
    );
    const indicadoresSomenteIda = ['somente ida', 'só ida', 'one way'];
    const temSomenteIda = indicadoresSomenteIda.some(indicador => textoLower.includes(indicador));

    if (temIdaVolta) return 'ida_volta';
    if (temSomenteIda) return 'somente_ida';

    // Se não houver indicador explícito, tentar heurística
    const horarios = (textoLower.match(/\d{2}:\d{2}/g) || []).length;
    const datas = (textoLower.match(/\d{1,2}\/\d{1,2}|\d{1,2} de \w+/gi) || []);
    const datasUnicas = [...new Set(datas)];

    if (horarios >= 4 || datasUnicas.length >= 2) {
        return 'ida_volta';
    }
    return 'somente_ida';
}


// ================================================================================
// 🔧 SELEÇÃO DE TEMPLATE CORRIGIDO
// ================================================================================

function selecionarTemplateCorrigido(analise, tipos) {
  console.log('[TEMPLATE-CORRIGIDO] Selecionando para:', tipos, 'TipoViagem:', analise.tipoViagem);
  
  if (!tipos || tipos.length === 0) {
    return {
      nome: 'Aéreo Somente Ida',
      conteudo: TEMPLATES['Aéreo Somente Ida']
    };
  }

  const tipoPrincipal = tipos[0];
  
  // ================================================================================
  // 🔧 LÓGICA CORRIGIDA PARA TEMPLATES AÉREOS
  // ================================================================================
  
  if (tipoPrincipal === 'Aéreo Facial' || tipoPrincipal === 'Aéreo VBI/Fácil') {
    
    // Múltiplas opções
    if (analise.multiplasOpcoes) {
      if (analise.tipoViagem === 'ida_volta') {
        return {
          nome: 'Múltiplas Ida e Volta',
          conteudo: TEMPLATES['Múltiplas Ida e Volta']
        };
      } else {
        return {
          nome: 'Múltiplas Somente Ida',
          conteudo: TEMPLATES['Múltiplas Somente Ida']
        };
      }
    }
    
    // Opção única
    if (analise.tipoViagem === 'ida_volta') {
      return {
        nome: 'Aéreo Ida e Volta',
        conteudo: TEMPLATES['Aéreo Ida e Volta']
      };
    } else {
      return {
        nome: 'Aéreo Somente Ida',
        conteudo: TEMPLATES['Aéreo Somente Ida']
      };
    }
  }
  
  // Outros tipos de serviço
  if (TEMPLATES[tipoPrincipal]) {
    return {
      nome: tipoPrincipal,
      conteudo: TEMPLATES[tipoPrincipal]
    };
  }
  
  // Fallback
  console.warn(`[TEMPLATE-CORRIGIDO] Template não encontrado para: ${tipoPrincipal}`);
  return {
    nome: 'Aéreo Somente Ida',
    conteudo: TEMPLATES['Aéreo Somente Ida']
  };
}

// ================================================================================
// 🏗️ PROMPT CORRIGIDO COM DETECÇÃO AUTOMÁTICA
// ================================================================================

function construirPromptCorrigido(promptBase, template, analise, tipos, parcelamento, camposOpcionais) {
  console.log('[PROMPT-CORRIGIDO] Construindo prompt corrigido...');
  
  const tipoPrincipal = tipos?.[0] || 'Aéreo Facial';
  
  let prompt = `Você é um assistente especializado da CVC. Formate o orçamento de ${tipoPrincipal} usando EXATAMENTE o template abaixo.

IMPORTANTE: Sua resposta deve conter APENAS o orçamento formatado, sem cabeçalhos técnicos, sem explicações.

TEMPLATE PARA USAR:
${template.conteudo}

DADOS DO CLIENTE:
${promptBase}

`;

  // ================================================================================
  // 🔍 INSTRUÇÕES DE DETECÇÃO AUTOMÁTICA PARA CAMPOS OPCIONAIS
  // ================================================================================
  
  if (camposOpcionais) {
    prompt += `INSTRUÇÕES DE DETECÇÃO AUTOMÁTICA:\n`;
    
    if (camposOpcionais.destino) {
      prompt += `- DESTINO: Detecte automaticamente dos dados fornecidos (procure por nomes de cidades, países, destinos turísticos)\n`;
    }
    
    if (camposOpcionais.adultos) {
      prompt += `- ADULTOS: Detecte automaticamente dos dados (procure por "Total X Adultos", "2 adultos", "passageiro 1", etc.) - padrão: 2 se não encontrar\n`;
    }
  }

  // ================================================================================
  // 💳 INSTRUÇÕES DE PARCELAMENTO CORRIGIDAS
  // ================================================================================
  
  if (parcelamento && parcelamento.incluirParcelamento) {
    prompt += `\nINSTRUÇÕES DE PARCELAMENTO:\n`;
    
    const tiposSemParcelamento = ['Aéreo Facial'];
    const tiposComParcelamento = tipos.filter(tipo => !tiposSemParcelamento.includes(tipo));
    
    if (tiposComParcelamento.length > 0) {
      if (parcelamento.parcelas10x && parcelamento.parcelas12x) {
        prompt += `- Para tipos ${tiposComParcelamento.join(', ')}: incluir "💳 10x de R$ XX,XX ou 12x de R$ XX,XX"\n`;
      } else if (parcelamento.parcelas10x) {
        prompt += `- Para tipos ${tiposComParcelamento.join(', ')}: incluir "💳 Parcelamento: 10x de R$ XX,XX"\n`;
      } else if (parcelamento.parcelas12x) {
        prompt += `- Para tipos ${tiposComParcelamento.join(', ')}: incluir "💳 Parcelamento: 12x de R$ XX,XX"\n`;
      }
    }
    
    if (tipos.includes('Aéreo Facial')) {
      prompt += `- Para Aéreo Facial: incluir parcelamento APENAS se explicitamente mencionado nos dados\n`;
    }
  }
  
    // ================================================================================
    // ✈️ INSTRUÇÕES GERAIS E DE AÉREO
    // ================================================================================
  
    prompt += `\nINSTRUÇÕES GERAIS PARA FORMATAÇÃO:\n`;
    prompt += `- Use EXATAMENTE o formato do template fornecido.\n`;
    prompt += `- Preencha apenas com dados reais encontrados no texto.\n`;
    prompt += `- Não invente informações que não existem.\n`;
    prompt += `- Mantenha links e valores monetários exatos.\n`;
    
    if (analise.tipo === 'aereo') {
        prompt += `- AEROPORTOS: Converta códigos IATA para nomes completos (Ex: CGH para Congonhas (SP)).\n`;
        prompt += `- ESCALAS/CONEXÕES: Se detectar escalas, adicione detalhes como "(1 escala)" ou "(voo direto)" após o horário.\n`;
    }

    prompt += `\nRESPONDA APENAS COM O TEMPLATE PREENCHIDO, SEM EXPLICAÇÕES ADICIONAIS.`;

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
    try {
      console.warn(`⚠️ Tentando fallback com ${fallbackModelo}...`);
      return await chamarOpenAI(prompt, temImagem, arquivo, fallbackModelo);
    } catch (erro2) {
      throw new Error(`Ambos os modelos falharam: ${erro1.message} | ${erro2.message}`);
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
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    modelo_usado: modelo
  };
}

// ================================================================================
// 🔧 PROCESSAMENTO FINAL DA RESPOSTA
// ================================================================================

function processarRespostaCorrigida(response) {
  if (!response || typeof response !== 'string') {
    return 'Erro: Resposta inválida da IA';
  }

  let processada = response.trim();

  // Remover cabeçalhos técnicos que possam ter vazado
  const cabecalhosRemover = [
    /PRODUTO SELECIONADO:.*?\n/gi,
    /MÚLTIPLAS OPÇÕES:.*?\n/gi,
    /TEMPLATE OBRIGATÓRIO:.*?\n/gi,
    /INSTRUÇÕES.*?\n/gi,
    /DADOS DO CLIENTE:.*?\n/gi
  ];

  cabecalhosRemover.forEach(regex => {
    processada = processada.replace(regex, '');
  });

  // Conversão de aeroportos
  Object.entries(aeroportos).forEach(([codigo, nomeCompleto]) => {
    const regexIsolado = new RegExp(`\\b${codigo}\\b`, 'gi');
    processada = processada.replace(regexIsolado, nomeCompleto);
  });

  // Limpar quebras de linha excessivas
  processada = processada.replace(/\n\s*\n/g, '\n\n').trim();
  processada = processada.replace(/^\s*\n+/, '');

  return processada;
}

function calcularMetricas(resultado, startTime, estrategia) {
  const tokensInput = resultado.usage?.prompt_tokens || resultado.usage?.input_tokens || 0;
  const tokensOutput = resultado.usage?.completion_tokens || resultado.usage?.output_tokens || 0;
  const modeloUsado = resultado.modelo_usado || 'desconhecido';
  
  const precosModelo = PRECOS_MODELOS[modeloUsado] || { input: 0, output: 0 };
  
  const custoUSD = (tokensInput / 1000) * precosModelo.input + (tokensOutput / 1000) * precosModelo.output;
  const custoBRL = custoUSD * USD_TO_BRL;

  const custoGPT4o = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o'].input + 
                     (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o'].output;
  const economiaUSD = custoGPT4o - custoUSD;
  const economiaBRL = economiaUSD * USD_TO_BRL;
  
  return {
    modelo_usado: modeloUsado,
    estrategia: estrategia,
    tokens: {
      input: tokensInput,
      output: tokensOutput,
      total: tokensInput + tokensOutput
    },
    custo: {
      usd: parseFloat(custoUSD.toFixed(6)),
      brl: parseFloat(custoBRL.toFixed(6))
    },
    economia: {
      vs_gpt4o_usd: parseFloat(economiaUSD.toFixed(6)),
      vs_gpt4o_brl: parseFloat(economiaBRL.toFixed(6)),
      percentual: custoGPT4o > 0 ? ((economiaUSD / custoGPT4o) * 100).toFixed(1) + '%' : '0%'
    },
    performance: {
      tempo_processamento_ms: Date.now() - startTime
    }
  };
}

console.log('✅ [API-CORRIGIDA] CVC Itaqua API v5.3.1-fixed carregada');
console.log('🔧 [FOCO] Detecção correta de ida/volta e orçamentos limpos');
console.log('✈️ [MELHORIA] Conversão de aeroportos e detecção de escalas');
console.log('🚀 [STATUS] Pronto para gerar orçamentos profissionais e corretos!');
