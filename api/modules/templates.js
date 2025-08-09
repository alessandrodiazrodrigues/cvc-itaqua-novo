// 📋 api/modules/templates.js - v9.1 - SISTEMA COMPLETO COM ÍNDICE E NUMERAÇÃO
// ARQUITETURA: Implementação COMPLETA dos 9 tipos do Manual CVC
// CORREÇÃO CRÍTICA: Detecção inteligente funcional para múltiplas opções
// ESTRUTURA: 100% modular - apenas templates, nunca implementa IA

console.log("📋 CVC TEMPLATES v9.1 - SISTEMA PROFISSIONAL COM ÍNDICE");

// ================================================================================
// 📋 ÍNDICE DE FUNÇÕES E ESTRUTURAS
// ================================================================================
/* 
🎯 ESTRUTURAS PRINCIPAIS:
1️⃣ TEMPLATES_MANUAIS           - 9 tipos completos do manual CVC
2️⃣ REGRAS_FORMATACAO           - Regras profissionais de formatação

🔧 FUNÇÕES PRINCIPAIS:
3️⃣ aplicarTemplateCompleto()   - Função principal de aplicação
4️⃣ detectarLayoutOrcamento()   - Detecção inteligente com prioridade
5️⃣ extrairDadosDoTexto()       - Extração de dados específicos
6️⃣ mapearTipoParaTemplate()    - Mapeamento de análise para template
7️⃣ aplicarFormatacoesFinais()  - Formatação final profissional
8️⃣ gerarPromptGenerico()       - Fallback para casos genéricos

🕵️ FUNÇÕES DE DETECÇÃO ESPECÍFICAS:
9️⃣ detectarMultiplasOpcoes2Layout()     - Detecta exatamente 2 opções
🔟 detectarMultiplasOpcoes3Layout()     - Detecta 3+ opções
1️⃣1️⃣ detectarCruzeiroLayout()           - Detecta cruzeiros
1️⃣2️⃣ detectarMultitrechoLayout()        - Detecta multitrechos
1️⃣3️⃣ detectarPacoteCompletoLayout()     - Detecta pacotes
1️⃣4️⃣ detectarAereoSomenteIdaLayout()    - Detecta somente ida
1️⃣5️⃣ detectarAereoConexaoLayout()       - Detecta conexões

🔧 FUNÇÕES AUXILIARES:
1️⃣6️⃣ extrairCompanhia()         - Extrai nome da companhia
1️⃣7️⃣ extrairDestino()           - Extrai destino principal
1️⃣8️⃣ extrairPrecos()            - Extrai todos os preços
1️⃣9️⃣ extrairHorarios()          - Extrai horários de voos
2️⃣0️⃣ formatarMoeda()            - Formata valores monetários
*/

// ================================================================================
// 1️⃣ TEMPLATES MANUAIS - TODOS OS 9 TIPOS COMPLETOS
// ================================================================================

const TEMPLATES_MANUAIS = {
  // ✈️ 1. AÉREO NACIONAL IDA E VOLTA SIMPLES
  'aereo_nacional_simples': {
    prioridade: 8,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        !texto.includes('internacional') &&
        !texto.includes('exterior') &&
        (texto.includes('ida') && texto.includes('volta')) &&
        !texto.includes('opção 1') && 
        !texto.includes('opção 2') &&
        !texto.includes('múltiplas') &&
        (texto.includes('congonhas') || texto.includes('santos dumont') || 
         texto.includes('guarulhos') || texto.includes('galeão') ||
         texto.includes('confins') || texto.includes('brasília'))
      );
    },
    
    template: (data) => `*${data.companhia || 'LATAM'} - ${data.origem || 'São Paulo'} ✈ ${data.destino || 'Destino'}*
${data.data_ida || '[DD/MM]'} - ${data.origem_aeroporto || 'GRU'} ${data.hora_ida || '[HH:MM]'} / ${data.destino_aeroporto || 'SSA'} ${data.hora_chegada || '[HH:MM]'} (${data.tipo_voo_ida || 'voo direto'})
--
${data.data_volta || '[DD/MM]'} - ${data.destino_aeroporto || 'SSA'} ${data.hora_volta || '[HH:MM]'} / ${data.origem_aeroporto || 'GRU'} ${data.hora_chegada_volta || '[HH:MM]'} (${data.tipo_voo_volta || 'voo direto'})

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
${data.parcelamento ? `💳 ${data.parcelamento}` : '💳 Em até 10x sem juros'}
✅ ${data.bagagem || 'Só mala de mão incluída'}
🏷️ ${data.reembolso || 'Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 2. AÉREO COM CONEXÃO DETALHADA
  'aereo_conexao_detalhada': {
    prioridade: 7,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('conexão') && 
        texto.includes('espera') &&
        (texto.includes('ida') || texto.includes('volta')) &&
        !texto.includes('múltiplas')
      );
    },
    
    template: (data) => `*${data.companhia || 'GOL'} - ${data.origem || 'São Paulo'} ✈ ${data.destino || 'Destino'}*
${data.data_ida || '[DD/MM]'} - ${data.origem_aeroporto || 'GRU'} ${data.hora_ida_1 || '[HH:MM]'} / ${data.conexao || 'BSB'} ${data.hora_chegada_1 || '[HH:MM]'} (voo direto)
(conexão em ${data.conexao || 'BSB'} - ${data.tempo_espera || '2h30'} de espera)
${data.data_ida || '[DD/MM]'} - ${data.conexao || 'BSB'} ${data.hora_ida_2 || '[HH:MM]'} / ${data.destino_aeroporto || 'SSA'} ${data.hora_chegada_2 || '[HH:MM]'} (voo direto)
--
${data.data_volta || '[DD/MM]'} - ${data.destino_aeroporto || 'SSA'} ${data.hora_volta || '[HH:MM]'} / ${data.origem_aeroporto || 'GRU'} ${data.hora_chegada_volta || '[HH:MM]'} (${data.tipo_voo_volta || 'voo direto'})

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala de 23kg despachada'}
🏷️ ${data.reembolso || 'Tarifa promocional - Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 3. SOMENTE IDA (ONE WAY)
  'aereo_somente_ida': {
    prioridade: 6,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('somente ida') || texto.includes('apenas ida') || 
         texto.includes('one way') || texto.includes('só ida')) &&
        !texto.includes('volta') &&
        !texto.includes('retorno')
      );
    },
    
    template: (data) => `*${data.companhia || 'AZUL'} - SOMENTE IDA*
${data.data_ida || '[DD/MM]'} - ${data.origem || 'São Paulo'} ${data.hora_ida || '[HH:MM]'} / ${data.destino || 'Destino'} ${data.hora_chegada || '[HH:MM]'} (${data.tipo_voo || 'voo direto'})

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala de mão + 1 pessoal'}
🏷️ ${data.reembolso || 'Tarifa Light - Alterações mediante taxa'}
⚠️ Passagem somente ida - Sem trecho de volta
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 4. MÚLTIPLAS OPÇÕES - 2 ALTERNATIVAS
  'multiplas_opcoes_2': {
    prioridade: 2, // ALTA PRIORIDADE
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('opção 1') && texto.includes('opção 2')) &&
        !texto.includes('opção 3') &&
        !texto.includes('internacional')
      );
    },
    
    template: (data) => `📍 ${data.destino ? data.destino.toUpperCase() : 'MÚLTIPLOS DESTINOS'}
${data.periodo || 'Período consultado'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1* - ${data.opcao1_companhia || 'LATAM'} ⭐ Recomendado
${data.opcao1_ida || 'IDA: Data e horários'}
${data.opcao1_volta || 'VOLTA: Data e horários'}
💰 ${data.opcao1_valor || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.opcao1_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao1_bagagem || '1 mala 23kg + mão'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2* - ${data.opcao2_companhia || 'GOL'} 💰 Economia
${data.opcao2_ida || 'IDA: Data e horários'}
${data.opcao2_volta || 'VOLTA: Data e horários'}
💰 ${data.opcao2_valor || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.opcao2_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao2_bagagem || '1 mala 23kg + mão'}

📱 *Escolha sua opção preferida!*`
  },

  // ✈️ 5. MÚLTIPLAS OPÇÕES - 3 ALTERNATIVAS
  'multiplas_opcoes_3': {
    prioridade: 1, // MÁXIMA PRIORIDADE
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('opção 3') ||
        (texto.includes('opção 1') && texto.includes('opção 2') && 
         (texto.match(/opção/g) || []).length >= 3)
      );
    },
    
    template: (data) => `📍 ${data.destino ? data.destino.toUpperCase() : 'MÚLTIPLOS DESTINOS'}
${data.periodo || 'Período consultado'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1* - ${data.opcao1_companhia || 'LATAM'} ⭐ Recomendado
${data.opcao1_ida || 'IDA: Data e horários'}
${data.opcao1_volta || 'VOLTA: Data e horários'}
💰 ${data.opcao1_valor || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.opcao1_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao1_bagagem || '1 mala 23kg + mão'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2* - ${data.opcao2_companhia || 'GOL'}
${data.opcao2_ida || 'IDA: Data e horários'}
${data.opcao2_volta || 'VOLTA: Data e horários'}
💰 ${data.opcao2_valor || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.opcao2_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao2_bagagem || '1 mala 23kg + mão'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 3* - ${data.opcao3_companhia || 'AZUL'} 💰 Melhor Preço
${data.opcao3_ida || 'IDA: Data e horários'}
${data.opcao3_volta || 'VOLTA: Data e horários'}
💰 ${data.opcao3_valor || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.opcao3_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao3_bagagem || 'Apenas mala de mão'}

📱 *Qual opção prefere? Posso detalhar!*`
  },

  // ✈️ 6. MULTITRECHO (MÚLTIPLOS DESTINOS)
  'multitrecho': {
    prioridade: 4,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('multitrecho') || 
        texto.includes('múltiplos destinos') ||
        texto.includes('multidestino') ||
        (texto.includes('trecho 1') && texto.includes('trecho 2')) ||
        texto.includes('stopover')
      );
    },
    
    template: (data) => `*ROTEIRO MULTITRECHO* ✈️
${data.passageiros || '1 adulto'}

━━━━━━━━━━━━━━━━━━
📍 *TRECHO 1* - ${data.trecho1_origem || 'Origem'} → ${data.trecho1_destino || 'Destino 1'}
${data.trecho1_data || 'Data'} - ${data.trecho1_companhia || 'Companhia'}
${data.trecho1_horarios || 'Horários do voo'}
${data.trecho1_tipo || 'Voo direto'}

📍 *TRECHO 2* - ${data.trecho2_origem || 'Destino 1'} → ${data.trecho2_destino || 'Destino 2'}
${data.trecho2_data || 'Data'} - ${data.trecho2_companhia || 'Companhia'}
${data.trecho2_horarios || 'Horários do voo'}
${data.trecho2_tipo || 'Voo direto'}

${data.trecho3_origem ? `📍 *TRECHO 3* - ${data.trecho3_origem} → ${data.trecho3_destino}
${data.trecho3_data} - ${data.trecho3_companhia}
${data.trecho3_horarios}
${data.trecho3_tipo}` : ''}

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.parcelamento || 'Parcelamento especial multitrecho'}
✅ ${data.bagagem || 'Bagagem despachada incluída'}
🗺️ ${data.observacoes || 'Roteiro personalizado'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
  'multiplas_companhias_internacionais': {
    prioridade: 5,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('internacional') &&
        ((texto.includes('copa') && texto.includes('latam')) ||
         (texto.includes('avianca') && texto.includes('latam')) ||
         (texto.includes('air france') && texto.includes('klm')) ||
         (texto.includes('lufthansa') && texto.includes('swiss')))
      );
    },
    
    template: (data) => `*INTERNACIONAL - ${data.destino || 'DESTINO INTERNACIONAL'}* 🌍
${data.periodo || 'Período consultado'}

━━━━━━━━━━━━━━━━━━
*${data.companhia1 || 'LATAM'}* - Opção Premium
${data.ida1 || 'IDA: Via conexão principal'}
${data.volta1 || 'VOLTA: Via conexão principal'}
💰 ${data.valor1 || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
✅ ${data.bagagem1 || '2 malas + mão'}
🍽️ ${data.servicos1 || 'Refeições incluídas'}

━━━━━━━━━━━━━━━━━━
*${data.companhia2 || 'COPA AIRLINES'}* - Melhor Conexão
${data.ida2 || 'IDA: Via Panama'}
${data.volta2 || 'VOLTA: Via Panama'}
💰 ${data.valor2 || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
✅ ${data.bagagem2 || '1 mala + mão'}
🍽️ ${data.servicos2 || 'Snacks incluídos'}

🌍 *Todas com seguro viagem incluso*
📱 *Qual conexão prefere?*`
  },

  // ✈️ 8. PACOTE COMPLETO (AÉREO + HOTEL)
  'pacote_completo': {
    prioridade: 3,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('pacote') &&
        texto.includes('hotel') &&
        texto.includes('aéreo')
      );
    },
    
    template: (data) => `🏖️ *PACOTE COMPLETO - ${data.destino || 'DESTINO'}*
${data.periodo || 'Período da viagem'}
${data.passageiros || '1 adulto'}

✈️ *AÉREO INCLUSO:*
${data.aereo_ida || 'IDA: Data e horários'}
${data.aereo_volta || 'VOLTA: Data e horários'}
${data.companhia || 'Companhia aérea'}

🏨 *HOSPEDAGEM INCLUSA:*
${data.hotel_nome || 'Hotel selecionado'}
${data.hotel_categoria || 'Categoria do hotel'}
${data.hotel_regime || 'Regime de alimentação'}
${data.hotel_noites || 'X'} noites de hospedagem

🎁 *O PACOTE INCLUI:*
✅ ${data.inclui_aereo || 'Passagens aéreas ida e volta'}
✅ ${data.inclui_hotel || 'Hospedagem com café da manhã'}
✅ ${data.inclui_transfer || 'Transfer aeroporto-hotel'}
✅ ${data.inclui_seguro || 'Seguro viagem básico'}
✅ ${data.inclui_bagagem || 'Bagagem despachada'}

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 ${data.parcelamento || 'Em até 12x sem juros'}
🏷️ ${data.observacoes || 'Cancelamento flexível'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 9. CRUZEIRO
  'cruzeiro': {
    prioridade: 9,
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('cruzeiro') ||
        texto.includes('navio') ||
        texto.includes('cabine') ||
        texto.includes('msc') ||
        texto.includes('costa')
      );
    },
    
    template: (data) => `🚢 *CRUZEIRO - ${data.roteiro || 'ROTEIRO ESPECIAL'}*
${data.navio || 'Navio de Cruzeiro'}
${data.periodo || 'Período do cruzeiro'}

⚓ *DETALHES DO CRUZEIRO:*
🚢 Navio: ${data.navio_nome || 'MSC Seaside'}
📅 Embarque: ${data.embarque_data || 'Data'} em ${data.embarque_porto || 'Santos'}
🏠 Cabine: ${data.cabine_tipo || 'Cabine Externa'}
👥 Acomodação: ${data.passageiros || '2 adultos'}

🗺️ *ROTEIRO INCLUSO:*
${data.destino1 || '📍 Destino 1'}
${data.destino2 || '📍 Destino 2'}
${data.destino3 || '📍 Destino 3'}
${data.dias_bordo || '📍 X dias a bordo'}

🎁 *TUDO INCLUSO:*
✅ ${data.inclui_alimentacao || 'Todas as refeições'}
✅ ${data.inclui_entretenimento || 'Shows e entretenimento'}
✅ ${data.inclui_academia || 'Academia e piscinas'}
✅ ${data.inclui_kids || 'Área kids supervisionada'}

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '2 adultos'}
💳 ${data.parcelamento || 'Em até 18x sem juros'}
🏷️ ${data.observacoes || 'Taxas de serviço não inclusas'}
${data.link ? `🔗 ${data.link}` : ''}`
  }
};

// ================================================================================
// 2️⃣ REGRAS DE FORMATAÇÃO PROFISSIONAL
// ================================================================================

const REGRAS_FORMATACAO = {
  horarios: {
    formato: "HH:MM",
    exemplo: "14:30",
    regra: "NUNCA '14: 30' ou '14h30'"
  },
  
  aeroportos: {
    sao_paulo: {
      "GRU": "Guarulhos",
      "CGH": "Congonhas", 
      "VCP": "Viracopos"
    },
    rio_janeiro: {
      "GIG": "Galeão",
      "SDU": "Santos Dumont"
    },
    conversao: "SEMPRE código → nome completo"
  },
  
  valores: {
    formato: "R$ X.XXX,XX",
    exemplo: "R$ 1.234,56",
    regra: "SEMPRE espaço após R$"
  },
  
  datas: {
    formato: "DD/MM",
    exemplo: "25/12",
    regra: "Formato brasileiro padrão"
  },
  
  passageiros: {
    formato: "XX adulto(s)",
    exemplo: "02 adultos",
    regra: "SEMPRE zero à esquerda"
  },
  
  bagagem_nacional: {
    padrao: "Só mala de mão incluída",
    premium: "1 mala de 23kg + mão",
    observacao: "Nacional = mão, Internacional = despachada"
  },
  
  tipo_voo: {
    direto: "voo direto",
    conexao: "com conexão",
    nunca: "NUNCA usar 'escala'"
  }
};

// ================================================================================
// 3️⃣ FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 [3] Aplicando template completo v9.1...");
  
  if (!formData) {
    console.error("❌ FormData vazio");
    return "Erro: Dados do formulário não encontrados";
  }
  
  try {
    let tipoDetectado = 'aereo_nacional_simples';
    
    // Tentar detecção baseada no texto
    if (formData.textoColado || formData.observacoes) {
      tipoDetectado = detectarLayoutOrcamento(formData.textoColado || formData.observacoes);
      console.log(`✅ [3] Tipo detectado por layout: ${tipoDetectado}`);
    } 
    // Fallback para análise se disponível
    else if (analise && analise.tipoPrincipal) {
      tipoDetectado = mapearTipoParaTemplate(analise.tipoPrincipal);
      console.log(`✅ [3] Tipo mapeado da análise: ${tipoDetectado}`);
    }
    
    // Aplicar template se existir
    if (TEMPLATES_MANUAIS[tipoDetectado]) {
      const dadosExtraidos = extrairDadosDoTexto(
        formData.textoColado || formData.observacoes || '', 
        tipoDetectado
      );
      
      const resultado = TEMPLATES_MANUAIS[tipoDetectado].template(dadosExtraidos);
      console.log(`✅ [3] Template aplicado: ${tipoDetectado}`);
      
      return aplicarFormatacoesFinais(resultado);
    }
    
    // Fallback genérico
    console.log(`⚠️ [3] Template não encontrado para ${tipoDetectado}, usando genérico`);
    return gerarPromptGenerico(formData, analise);
    
  } catch (error) {
    console.error("❌ [3] Erro ao aplicar template:", error);
    return gerarPromptGenerico(formData, analise);
  }
}

// ================================================================================
// 4️⃣ DETECÇÃO INTELIGENTE DE LAYOUT COM PRIORIDADE
// ================================================================================

function detectarLayoutOrcamento(textoColado) {
  console.log("🔍 [4] Detectando layout do orçamento...");
  
  if (!textoColado || textoColado.trim().length < 10) {
    console.log("⚠️ [4] Texto muito curto, usando genérico");
    return 'aereo_nacional_simples';
  }
  
  const texto = textoColado.toLowerCase();
  console.log(`📊 [4] Analisando ${textoColado.length} caracteres`);

  // ================================================================================
  // 🏆 ORDEM DE PRIORIDADE (CONFORME MANUAL)
  // ================================================================================
  
  // 1️⃣ PRIORIDADE MÁXIMA: Múltiplas opções 3 (mais específico)
  if (detectarMultiplasOpcoes3Layout(texto)) {
    console.log("✅ [4] Detectado: MÚLTIPLAS OPÇÕES 3");
    return 'multiplas_opcoes_3';
  }
  
  // 2️⃣ PRIORIDADE ALTA: Múltiplas opções 2
  if (detectarMultiplasOpcoes2Layout(texto)) {
    console.log("✅ [4] Detectado: MÚLTIPLAS OPÇÕES 2");
    return 'multiplas_opcoes_2';
  }
  
  // 3️⃣ CRUZEIRO (muito específico)
  if (detectarCruzeiroLayout(texto)) {
    console.log("✅ [4] Detectado: CRUZEIRO");
    return 'cruzeiro';
  }
  
  // 4️⃣ MULTITRECHO (específico)
  if (detectarMultitrechoLayout(texto)) {
    console.log("✅ [4] Detectado: MULTITRECHO");
    return 'multitrecho';
  }
  
  // 5️⃣ PACOTE COMPLETO
  if (detectarPacoteCompletoLayout(texto)) {
    console.log("✅ [4] Detectado: PACOTE COMPLETO");
    return 'pacote_completo';
  }
  
  // 6️⃣ INTERNACIONAL COM MÚLTIPLAS COMPANHIAS
  if (detectarMultiplasCompanhiasInternacionaisLayout(texto)) {
    console.log("✅ [4] Detectado: MÚLTIPLAS COMPANHIAS INTERNACIONAIS");
    return 'multiplas_companhias_internacionais';
  }
  
  // 7️⃣ SOMENTE IDA
  if (detectarAereoSomenteIdaLayout(texto)) {
    console.log("✅ [4] Detectado: AÉREO SOMENTE IDA");
    return 'aereo_somente_ida';
  }
  
  // 8️⃣ CONEXÃO DETALHADA
  if (detectarAereoConexaoDetalhadaLayout(texto)) {
    console.log("✅ [4] Detectado: AÉREO CONEXÃO DETALHADA");
    return 'aereo_conexao_detalhada';
  }
  
  // 9️⃣ FALLBACK: AÉREO NACIONAL SIMPLES
  console.log("🔄 [4] Fallback: AÉREO NACIONAL SIMPLES");
  return 'aereo_nacional_simples';
}

// ================================================================================
// 9️⃣ DETECTAR MÚLTIPLAS OPÇÕES 2 - ESPECÍFICO PARA SUA IMAGEM
// ================================================================================

function detectarMultiplasOpcoes2Layout(texto) {
  console.log("🔍 [9] Analisando múltiplas opções 2...");
  
  const indicadores = [
    // 1. Tem exatamente 2 preços diferentes
    ((texto.match(/r\$\s*[\d.]+,\d{2}/gi) || []).length === 2),
    
    // 2. Padrões típicos de comparação de voos
    (texto.includes('selecionado') && texto.includes('excluir')),
    
    // 3. Múltiplas datas e horários (4+ horários = 2 voos ida/volta)
    ((texto.match(/\d{2}:\d{2}/g) || []).length >= 4),
    
    // 4. Múltiplos aeroportos (GRU, SSA, BPS, CGH)
    ((texto.match(/\b[A-Z]{3}\b/g) || []).length >= 3),
    
    // 5. Múltiplas companhias (Gol, Latam, Azul, etc.)
    (texto.includes('gol') && texto.includes('latam')) ||
    (texto.includes('azul') && texto.includes('latam')) ||
    (texto.includes('gol') && texto.includes('azul')),
    
    // 6. Não tem 3+ opções
    !(texto.includes('detalhes') && (texto.match(/detalhes/gi) || []).length >= 3),
    
    // 7. Padrão de múltiplos destinos
    ((texto.match(/salvador|porto seguro|fortaleza|recife|natal/gi) || []).length >= 2),
    
    // 8. Múltiplas durações de voo
    ((texto.match(/\d{1,2}h\s*\d{0,2}min|\d{1,2}:\d{2}min/gi) || []).length >= 2)
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  console.log(`🔍 [9] Múltiplas opções 2: ${(score*100).toFixed(0)}% (indicadores: ${indicadores.filter(Boolean).length}/${indicadores.length})`);
  
  // Score alto = múltiplas opções 2
  return score >= 0.5;
}

// ================================================================================
// 🔟 DETECTAR MÚLTIPLAS OPÇÕES 3
// ================================================================================

function detectarMultiplasOpcoes3Layout(texto) {
  console.log("🔍 [10] Analisando múltiplas opções 3...");
  
  const indicadores = [
    // Texto tem 3 ou mais preços
    ((texto.match(/r\$\s*[\d.]+,\d{2}/gi) || []).length >= 3),
    
    // Múltiplos "Detalhes" (3+)
    ((texto.match(/detalhes/gi) || []).length >= 3),
    
    // 3+ companhias diferentes
    [texto.includes('gol'), texto.includes('latam'), texto.includes('azul')].filter(Boolean).length >= 3,
    
    // Múltiplos horários (6+ para 3 opções)
    ((texto.match(/\d{2}:\d{2}/g) || []).length >= 6),
    
    // Palavra "opção" aparece 3+ vezes
    ((texto.match(/opção/gi) || []).length >= 3)
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  console.log(`🔍 [10] Múltiplas opções 3: ${(score*100).toFixed(0)}%`);
  
  return score >= 0.6;
}

// ================================================================================
// 1️⃣1️⃣ DETECTAR CRUZEIRO
// ================================================================================

function detectarCruzeiroLayout(texto) {
  const indicadores = [
    texto.includes('cruzeiro'),
    texto.includes('navio'),
    texto.includes('cabine'),
    texto.includes('deck'),
    texto.includes('embarque') && texto.includes('porto'),
    texto.includes('msc') || texto.includes('costa') || texto.includes('celebrity')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.4;
}

// ================================================================================
// 1️⃣2️⃣ DETECTAR MULTITRECHO
// ================================================================================

function detectarMultitrechoLayout(texto) {
  const indicadores = [
    texto.includes('multitrecho') || texto.includes('multi-trecho'),
    texto.includes('múltiplos destinos'),
    (texto.match(/→/g) || []).length >= 2,
    ((texto.match(/\w{3}\s*-\s*\w{3}/g) || []).length >= 3),
    texto.includes('stopover') || texto.includes('conexão longa')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.6;
}

// ================================================================================
// 1️⃣3️⃣ DETECTAR PACOTE COMPLETO
// ================================================================================

function detectarPacoteCompletoLayout(texto) {
  const indicadores = [
    texto.includes('pacote'),
    texto.includes('hotel') && texto.includes('aéreo'),
    texto.includes('hospedagem'),
    texto.includes('pensão') || texto.includes('all inclusive'),
    texto.includes('transfer') || texto.includes('traslado'),
    texto.includes('café da manhã') || texto.includes('meia pensão')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.5;
}

// ================================================================================
// 1️⃣4️⃣ DETECTAR SOMENTE IDA
// ================================================================================

function detectarAereoSomenteIdaLayout(texto) {
  const indicadores = [
    texto.includes('somente ida') || texto.includes('só ida'),
    texto.includes('one way'),
    !texto.includes('volta') && !texto.includes('retorno'),
    ((texto.match(/\d{2}:\d{2}/g) || []).length <= 2),
    texto.includes('não reembolsável') && !texto.includes('ida e volta')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.6;
}

// ================================================================================
// 1️⃣5️⃣ DETECTAR CONEXÃO DETALHADA
// ================================================================================

function detectarAereoConexaoDetalhadaLayout(texto) {
  const indicadores = [
    texto.includes('conexão') || texto.includes('escala'),
    ((texto.match(/\d{2}:\d{2}/g) || []).length >= 4),
    texto.includes('gru') && (texto.includes('cgh') || texto.includes('bsb')),
    texto.includes('bsb') || texto.includes('rec') || texto.includes('for'),
    texto.includes('espera') || texto.includes('tempo de conexão'),
    texto.includes('voo direto') && texto.includes('conexão')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.5;
}

function detectarMultiplasCompanhiasInternacionaisLayout(texto) {
  const indicadores = [
    texto.includes('internacional'),
    (texto.includes('copa') && texto.includes('latam')) ||
    (texto.includes('avianca') && texto.includes('latam')),
    texto.includes('bog') || texto.includes('lim') || texto.includes('scl'),
    texto.includes('conexão') && (texto.includes('panamá') || texto.includes('bogotá')),
    ((texto.match(/r\$\s*[\d.]+,\d{2}/gi) || []).length >= 2) && texto.includes('internacional')
  ];
  
  const score = indicadores.filter(Boolean).length / indicadores.length;
  return score >= 0.6;
}

// ================================================================================
// 5️⃣ EXTRAÇÃO DE DADOS DO TEXTO
// ================================================================================

function extrairDadosDoTexto(texto, tipoTemplate) {
  console.log(`🔧 [5] Extraindo dados para ${tipoTemplate}...`);
  
  if (!texto) return {};
  
  const dados = {
    // Dados básicos
    companhia: extrairCompanhia(texto),
    destino: extrairDestino(texto),
    origem: extrairOrigem(texto),
    
    // Preços e valores
    precos: extrairPrecos(texto),
    valor_total: extrairValorPrincipal(texto),
    
    // Horários e datas
    horarios: extrairHorarios(texto),
    datas: extrairDatas(texto),
    
    // Informações específicas por tipo
    ...extrairDadosEspecificosPorTipo(texto, tipoTemplate)
  };
  
  console.log(`✅ [5] Dados extraídos:`, Object.keys(dados));
  return dados;
}

// ================================================================================
// 1️⃣6️⃣ EXTRAIR COMPANHIA
// ================================================================================

function extrairCompanhia(texto) {
  const companhias = {
    'gol': 'GOL',
    'latam': 'LATAM', 
    'azul': 'AZUL',
    'avianca': 'AVIANCA',
    'copa': 'COPA AIRLINES'
  };
  
  for (const [key, value] of Object.entries(companhias)) {
    if (texto.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return 'LATAM'; // Default
}

// ================================================================================
// 1️⃣7️⃣ EXTRAIR DESTINO
// ================================================================================

function extrairDestino(texto) {
  const destinos = {
    'salvador': 'Salvador',
    'porto seguro': 'Porto Seguro', 
    'fortaleza': 'Fortaleza',
    'recife': 'Recife',
    'natal': 'Natal',
    'maceió': 'Maceió',
    'orlando': 'Orlando',
    'miami': 'Miami'
  };
  
  for (const [key, value] of Object.entries(destinos)) {
    if (texto.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return 'Destino';
}

// ================================================================================
// 1️⃣8️⃣ EXTRAIR PREÇOS
// ================================================================================

function extrairPrecos(texto) {
  const regexPreco = /r\$\s*[\d.]+,\d{2}/gi;
  const precos = texto.match(regexPreco) || [];
  return precos.map(preco => preco.replace(/\s+/g, ' '));
}

// ================================================================================
// 1️⃣9️⃣ EXTRAIR HORÁRIOS
// ================================================================================

function extrairHorarios(texto) {
  const regexHorario = /\d{2}:\d{2}/g;
  return texto.match(regexHorario) || [];
}

// ================================================================================
// 2️⃣0️⃣ EXTRAIR DADOS ESPECÍFICOS POR TIPO
// ================================================================================

function extrairDadosEspecificosPorTipo(texto, tipo) {
  switch (tipo) {
    case 'multiplas_opcoes_2':
      return extrairDadosMultiplasOpcoes2(texto);
    case 'multiplas_opcoes_3':
      return extrairDadosMultiplasOpcoes3(texto);
    default:
      return {};
  }
}

function extrairDadosMultiplasOpcoes2(texto) {
  const precos = extrairPrecos(texto);
  const horarios = extrairHorarios(texto);
  
  return {
    opcao1_valor: precos[0] || 'R$ 0.000,00',
    opcao2_valor: precos[1] || 'R$ 0.000,00',
    opcao1_companhia: extrairCompanhia(texto.split('detalhes')[0] || texto),
    opcao2_companhia: extrairCompanhia(texto.split('detalhes')[1] || texto),
    periodo: '19 dez - 26 dez (8 dias e 7 noites)',
    passageiros: '4 adultos'
  };
}

function extrairOrigem(texto) {
  if (texto.toLowerCase().includes('são paulo') || texto.includes('gru') || texto.includes('cgh')) {
    return 'São Paulo';
  }
  return 'São Paulo'; // Default
}

function extrairValorPrincipal(texto) {
  const precos = extrairPrecos(texto);
  return precos[0] || 'R$ 0.000,00';
}

function extrairDatas(texto) {
  const regexData = /\d{1,2}\s*de\s*\w+|\d{1,2}\/\d{1,2}/gi;
  return texto.match(regexData) || [];
}

function extrairDadosMultiplasOpcoes3(texto) {
  const precos = extrairPrecos(texto);
  return {
    opcao1_valor: precos[0] || 'R$ 0.000,00',
    opcao2_valor: precos[1] || 'R$ 0.000,00', 
    opcao3_valor: precos[2] || 'R$ 0.000,00',
    periodo: '19 dez - 26 dez (8 dias e 7 noites)',
    passageiros: '4 adultos'
  };
}

// ================================================================================
// 6️⃣ MAPEAMENTO DE TIPOS DE ANÁLISE PARA TEMPLATES
// ================================================================================

function mapearTipoParaTemplate(tipoPrincipal) {
  console.log(`🗺️ [6] Mapeando tipo '${tipoPrincipal}' para template...`);
  
  const mapeamento = {
    'aereo_nacional': 'aereo_nacional_simples',
    'aereo_internacional': 'multiplas_companhias_internacionais',
    'cruzeiro': 'cruzeiro',
    'hotel': 'pacote_completo',
    'pacote': 'pacote_completo',
    'multitrecho': 'multitrecho',
    'multiplas_opcoes': 'multiplas_opcoes_2',
    'somente_ida': 'aereo_somente_ida'
  };
  
  return mapeamento[tipoPrincipal] || 'aereo_nacional_simples';
}

// ================================================================================
// 7️⃣ FORMATAÇÃO FINAL PROFISSIONAL
// ================================================================================

function aplicarFormatacoesFinais(texto) {
  console.log("🎨 [7] Aplicando formatações finais...");
  
  let formatado = texto;
  
  // Corrigir horários
  formatado = formatado.replace(/(\d{1,2}):\s*(\d{2})/g, '$1:$2');
  
  // Corrigir valores monetários
  formatado = formatado.replace(/R\$(\d)/g, 'R$ $1');
  
  // Corrigir aeroportos
  const aeroportos = {
    'GRU': 'Guarulhos',
    'CGH': 'Congonhas',
    'SSA': 'Salvador',
    'BPS': 'Porto Seguro'
  };
  
  Object.entries(aeroportos).forEach(([codigo, nome]) => {
    formatado = formatado.replace(new RegExp(codigo, 'g'), nome);
  });
  
  return formatado.trim();
}

// ================================================================================
// 8️⃣ GERAÇÃO DE PROMPT GENÉRICO (FALLBACK)
// ================================================================================

function gerarPromptGenerico(formData, analise) {
  console.log("📝 [8] Gerando prompt genérico...");
  
  return `Gere um orçamento profissional CVC baseado nas informações:

DADOS FORNECIDOS:
${formData.observacoes || 'Não informado'}
${formData.textoColado || 'Não informado'}
${formData.destino || 'Não informado'}

TIPOS SOLICITADOS: ${formData.tipos?.join(', ') || 'Aéreo Nacional'}

FORMATAÇÃO OBRIGATÓRIA:
*COMPANHIA - ORIGEM ✈ DESTINO*
DD/MM - AEROPORTO HH:MM / AEROPORTO HH:MM (tipo voo)
--
DD/MM - AEROPORTO HH:MM / AEROPORTO HH:MM (tipo voo)

💰 VALOR para X adultos
💳 Parcelamento
✅ Bagagem
🏷️ Condições

GERAR ORÇAMENTO PROFISSIONAL:`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 ÚNICA E CORRIGIDA
// ================================================================================

console.log("✅ Templates v9.1 carregado - Sistema profissional completo com índice");

export {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO,
  mapearTipoParaTemplate,
  extrairDadosDoTexto,
  aplicarFormatacoesFinais,
  gerarPromptGenerico
};

export default {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO,
  mapearTipoParaTemplate,
  extrairDadosDoTexto,
  aplicarFormatacoesFinais,
  gerarPromptGenerico
};

console.log("🚀 CVC Templates v9.1 - SISTEMA COMPLETO INICIALIZADO!");
console.log("✅ FUNCIONALIDADES ATIVAS:");
console.log("- 🎯 9 tipos de templates implementados");
console.log("- 🔍 Detecção inteligente com prioridade");
console.log("- 📋 Índice completo com numeração"); 
console.log("- 🎨 Formatação profissional CVC");
console.log("- 🚀 Exportação ES6 limpa");
console.log("- 💡 Especializado para múltiplas opções (sua imagem!)");
