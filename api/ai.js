// /api/ai.js - Versão SEM import para testar

// 📋 TEMPLATES INLINE (temporário para testar)
const templates = {
  'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [AEROPORTO_DESTINO_VOLTA_1] [HORA_SAIDA_VOLTA_1] / [AEROPORTO_ORIGEM_VOLTA_1] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [AEROPORTO_DESTINO_VOLTA_2] [HORA_SAIDA_VOLTA_2] / [AEROPORTO_ORIGEM_VOLTA_2] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`,

  'Aéreo Facial': `*Passagem Aérea*
[COMPANHIA_AEREA] 
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [AEROPORTO_DESTINO_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_ORIGEM_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 Pagamento em até [QTDE_PARCELAS]x de R$ [VALOR_PARCELA] s/ juros

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.`
};

export default async function handler(req, res) {
  try {
    console.log('🚀 [TEST] API iniciada - versão sem import');
    console.log('🚀 [TEST] Método:', req.method);
    
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    
    // OPTIONS
    if (req.method === 'OPTIONS') {
      console.log('✅ [TEST] OPTIONS funcionando');
      return res.status(200).json({ message: 'CORS OK - sem import' });
    }

    // GET de teste
    if (req.method === 'GET') {
      console.log('✅ [TEST] GET funcionando');
      return res.status(200).json({ 
        message: 'API funcionando SEM import',
        version: 'test-no-import',
        timestamp: new Date().toISOString(),
        templates_loaded: Object.keys(templates).length
      });
    }

    // POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    console.log('📥 [TEST] POST recebido');
    
    if (!req.body || !req.body.prompt) {
      return res.status(400).json({ error: 'Prompt obrigatório' });
    }

    const { prompt, tipos } = req.body;
    console.log('📊 [TEST] Prompt length:', prompt.length);
    console.log('📊 [TEST] Tipos:', tipos);

    // Detecção simples
    const temMultiplasOpcoes = detectarMultiplasOpcoes(prompt);
    console.log('🔍 [TEST] Múltiplas opções:', temMultiplasOpcoes);

    // Selecionar template
    let template = templates['Aéreo Facial']; // Padrão
    
    if (temMultiplasOpcoes && tipos?.includes('Aéreo Facial')) {
      template = templates['Aéreo Múltiplas Opções'];
      console.log('✅ [TEST] Usando template múltiplas opções');
    } else {
      console.log('✅ [TEST] Usando template simples');
    }

    // Simular resposta da IA (SEM chamar APIs externas)
    const respostaSimulada = simularIA(prompt, template, temMultiplasOpcoes);
    
    console.log('✅ [TEST] Resposta gerada, length:', respostaSimulada.length);

    return res.status(200).json({
      success: true,
      choices: [{
        message: {
          content: respostaSimulada
        }
      }],
      debug: {
        template_usado: temMultiplasOpcoes ? 'múltiplas' : 'simples',
        prompt_length: prompt.length,
        response_length: respostaSimulada.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 [TEST] Erro:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3),
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 🔍 Detecção simples
function detectarMultiplasOpcoes(prompt) {
  if (!prompt) return false;
  
  const texto = prompt.toLowerCase();
  
  // Contadores básicos
  const precos = (texto.match(/r\$.*\d{1,3}[\.,]\d{3}/gi) || []).length;
  const companhias = (texto.match(/(gol|latam|azul|avianca|tap)/gi) || []).length;
  const totais = (texto.match(/total.*\d+.*adult/gi) || []).length;
  
  console.log('🔍 [DETECÇÃO] Preços:', precos, 'Companhias:', companhias, 'Totais:', totais);
  
  return precos >= 2 || companhias >= 2 || totais >= 2;
}

// 🤖 Simular IA (sem chamar APIs externas)
function simularIA(prompt, template, isMultiple) {
  console.log('🤖 [SIMULAÇÃO] Gerando resposta...');
  
  if (isMultiple) {
    // Tentar extrair dados do seu exemplo
    if (prompt.includes('Gol') && prompt.includes('Latam')) {
      return `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: Gol*
🗓️ 30 de jul a 01 de ago (3 dias e 2 noites)
✈️ Ida: 30/07 - CGH 08:05 / RAO 09:10
✈️ Volta: 01/08 - RAO 18:40 / CGH 19:40
💰 R$ 1.722,96 para 2 adultos

📋 *OPÇÃO 2: Latam*
🗓️ 29 de jul a 01 de ago (4 dias e 3 noites)
✈️ Ida: 29/07 - CGH 17:50 / RAO 18:55
✈️ Volta: 01/08 - RAO 19:40 / CGH 20:40
💰 R$ 4.600,68 para 2 adultos

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`;
    }
  }
  
  // Resposta simples padrão
  return `*Passagem Aérea*
Companhia detectada no texto
Datas e horários extraídos dos dados fornecidos

💰 Valor conforme informado
💳 Pagamento em até 10x no cartão

⚠️ Valores sujeitos a alteração e disponibilidade!

📞 CVC Itaqua - Filial 6220`;
}

console.log('✅ [TEST] Módulo carregado - versão sem import');
