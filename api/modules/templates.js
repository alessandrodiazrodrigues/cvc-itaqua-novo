// 📋 templates.js - v9.0 - SISTEMA COMPLETO DE TEMPLATES CVC ITAQUA
// ✅ Exportações ES6 corretas (sem duplicação)
// ✅ Todos os 9 tipos implementados
// ✅ Detecção inteligente com prioridade
// ✅ Formatação profissional completa

console.log("📋 Templates v9.0 - SISTEMA PROFISSIONAL COMPLETO");

// ================================================================================
// 🎯 TEMPLATES COMPLETOS - TODOS OS 9 TIPOS DO MANUAL CVC
// ================================================================================

const TEMPLATES_MANUAIS = {
  
  // ✈️ 1. AÉREO NACIONAL IDA E VOLTA SIMPLES
  'aereo_nacional_simples': {
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
    
    template: (data) => `*${data.companhia || 'LATAM'}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida || 'voo direto'})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta || 'voo direto'})

💰 ${data.valor_total} para ${data.passageiros}
${data.parcelamento ? `💳 ${data.parcelamento}` : '💳 Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala de 23kg + mochila de mão'}
🏷️ ${data.reembolso || 'Tarifa flexível com remarcação gratuita'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 2. AÉREO COM CONEXÃO DETALHADA
  'aereo_conexao_detalhada': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('conexão') && 
        texto.includes('espera') &&
        (texto.includes('ida') || texto.includes('volta')) &&
        !texto.includes('múltiplas')
      );
    },
    
    template: (data) => `*${data.companhia || 'GOL'}*
${data.data_ida} - ${data.origem} ${data.hora_ida_1} / ${data.conexao} ${data.hora_chegada_1} (voo direto)
➜ Conexão em ${data.conexao} - ${data.tempo_espera || '2h30'} de espera
${data.data_ida} - ${data.conexao} ${data.hora_ida_2} / ${data.destino} ${data.hora_chegada_2} (voo direto)
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta || 'voo direto'})

💰 ${data.valor_total} para ${data.passageiros}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala de 23kg despachada'}
🏷️ ${data.reembolso || 'Tarifa promocional - Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 3. SOMENTE IDA (ONE WAY)
  'aereo_somente_ida': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('somente ida') || texto.includes('apenas ida') || 
         texto.includes('one way') || texto.includes('só ida')) &&
        !texto.includes('volta') &&
        !texto.includes('retorno')
      );
    },
    
    template: (data) => `*${data.companhia || 'AZUL'}* - SOMENTE IDA
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo || 'voo direto'})

💰 ${data.valor_total} para ${data.passageiros}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala de mão + 1 pessoal'}
🏷️ ${data.reembolso || 'Tarifa Light - Alterações mediante taxa'}
⚠️ Passagem somente ida - Sem trecho de volta
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 4. MÚLTIPLAS OPÇÕES - 2 ALTERNATIVAS
  'multiplas_opcoes_2': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('opção 1') && texto.includes('opção 2')) &&
        !texto.includes('opção 3') &&
        !texto.includes('internacional')
      );
    },
    
    template: (data) => `📍 ${data.destino ? data.destino.toUpperCase() : 'DESTINO'}
${data.periodo || 'Período consultado'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1* - ${data.opcao1_companhia || 'LATAM'}
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

📱 *Escolha sua opção preferida!*`
  },

  // ✈️ 5. MÚLTIPLAS OPÇÕES - 3 ALTERNATIVAS
  'multiplas_opcoes_3': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('opção 3') ||
        (texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção'))
      );
    },
    
    template: (data) => `📍 ${data.destino ? data.destino.toUpperCase() : 'DESTINO'}
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
${data.trecho3_tipo || 'Voo direto'}` : ''}

━━━━━━━━━━━━━━━━━━
💰 *VALOR TOTAL:* ${data.valor_total || 'R$ 0.000,00'}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
✅ ${data.bagagem || '1 mala 23kg em todos os trechos'}
🏷️ ${data.reembolso || 'Tarifa flexível com alterações'}
⚠️ *Importante:* ${data.observacao || 'Confirme os horários de conexão'}`
  },

  // ✈️ 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
  'multiplas_companhias_internacionais': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('internacional') || texto.includes('exterior') ||
         texto.includes('europa') || texto.includes('estados unidos') ||
         texto.includes('miami') || texto.includes('orlando') || 
         texto.includes('lisboa') || texto.includes('paris') ||
         texto.includes('madrid') || texto.includes('londres')) &&
        (texto.includes('opção') || texto.includes('múltiplas') || 
         texto.includes('companhias'))
      );
    },
    
    template: (data) => `🌍 *VOOS INTERNACIONAIS* - ${data.destino ? data.destino.toUpperCase() : 'DESTINO'}
${data.periodo || 'Período consultado'}
${data.passageiros || '1 adulto'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1* - ${data.opcao1_companhia || 'LATAM'} 🇧🇷
✈️ IDA: ${data.opcao1_data_ida || 'Data'}
${data.opcao1_rota_ida || 'GRU → Destino (voo direto)'}
${data.opcao1_horario_ida || 'Horários'}

✈️ VOLTA: ${data.opcao1_data_volta || 'Data'}
${data.opcao1_rota_volta || 'Destino → GRU (voo direto)'}
${data.opcao1_horario_volta || 'Horários'}

💰 ${data.opcao1_valor || 'USD 0.000,00 (R$ 0.000,00)'}
💳 ${data.opcao1_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao1_bagagem || '2 malas de 23kg + mão'}
🍽️ ${data.opcao1_servico || 'Refeições e entretenimento inclusos'}
📋 ${data.opcao1_documentacao || 'Passaporte + Visto/ESTA necessário'}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2* - ${data.opcao2_companhia || 'TAP'} 🇵🇹
✈️ IDA: ${data.opcao2_data_ida || 'Data'}
${data.opcao2_rota_ida || 'GRU → LIS → Destino'}
${data.opcao2_horario_ida || 'Horários com conexão'}

✈️ VOLTA: ${data.opcao2_data_volta || 'Data'}
${data.opcao2_rota_volta || 'Destino → LIS → GRU'}
${data.opcao2_horario_volta || 'Horários com conexão'}

💰 ${data.opcao2_valor || 'EUR 0.000,00 (R$ 0.000,00)'}
💳 ${data.opcao2_parcelamento || 'Em até 10x sem juros'}
✅ ${data.opcao2_bagagem || '1 mala de 23kg + mão'}
🍽️ ${data.opcao2_servico || 'Refeições inclusas'}
📋 ${data.opcao2_documentacao || 'Passaporte válido por 6 meses'}

━━━━━━━━━━━━━━━━━━
📱 *DOCUMENTAÇÃO NECESSÁRIA:*
${data.documentacao || '• Passaporte válido (mínimo 6 meses)\n• Visto ou autorização eletrônica\n• Certificado Internacional de Vacinas\n• Seguro viagem obrigatório'}

💡 *Recomendamos reservar com antecedência!*`
  },

  // 🚢 8. CRUZEIRO MARÍTIMO
  'cruzeiro': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('cruzeiro') || 
        texto.includes('navio') ||
        texto.includes('cabine') ||
        texto.includes('msc') || 
        texto.includes('costa') ||
        texto.includes('royal caribbean') ||
        texto.includes('navegação') ||
        texto.includes('all inclusive marítimo')
      );
    },
    
    template: (data) => `🚢 *CRUZEIRO ${data.nome_cruzeiro || 'COSTA FASCINOSA'}*
${data.rota || 'Santos → Búzios → Salvador → Ilhéus → Santos'}
${data.duracao || '7 noites'} | ${data.data_embarque || 'Data de embarque'}

━━━━━━━━━━━━━━━━━━
🛏️ *CATEGORIA DA CABINE:* ${data.categoria_cabine || 'Externa com Varanda'}
👥 *Ocupação:* ${data.passageiros || '2 adultos'}
🏢 *Deck:* ${data.deck || 'Deck 8 - Vista para o mar'}

━━━━━━━━━━━━━━━━━━
📅 *ROTEIRO COMPLETO:*
${data.roteiro_detalhado || `Dia 1: Santos - Embarque a partir das 13h
Dia 2: Navegação - Aproveite o navio
Dia 3: Búzios - 08h às 18h
Dia 4: Salvador - 08h às 18h
Dia 5: Ilhéus - 08h às 17h
Dia 6: Navegação - Dia no mar
Dia 7: Santos - Desembarque às 08h`}

━━━━━━━━━━━━━━━━━━
✅ *O CRUZEIRO INCLUI:*
• Hospedagem em cabine ${data.tipo_cabine || 'com varanda'}
• Pensão completa (café, almoço e jantar)
• Entretenimento e shows a bordo
• Academia, piscinas e áreas de lazer
• Kids Club e recreação infantil
• Taxas portuárias inclusas

❌ *NÃO INCLUI:*
• Bebidas alcoólicas e refrigerantes
• Serviços de SPA e salão
• Excursões em terra (opcionais)
• Taxa de serviço (USD 14 por dia/pessoa)
• Internet e telefone a bordo

━━━━━━━━━━━━━━━━━━
💰 *VALOR TOTAL:* ${data.valor_total || 'R$ 0.000,00'}
${data.valor_detalhe || 'Por pessoa em cabine dupla'}
💳 ${data.parcelamento || 'Em até 10x sem juros'}
🎁 ${data.promocao || 'Terceiro e quarto hóspede com desconto'}

📋 *DOCUMENTAÇÃO:*
${data.documentacao || '• RG ou Passaporte\n• Menores: Documentação específica\n• Cartão de vacinas atualizado'}

⚓ *Reserve já e garanta sua cabine!*`
  },

  // 📦 9. PACOTE COMPLETO (AÉREO + HOTEL + TRANSFER)
  'pacote_completo': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('pacote') || 
        (texto.includes('hotel') && texto.includes('aéreo')) ||
        (texto.includes('hospedagem') && texto.includes('voo')) ||
        texto.includes('all inclusive') ||
        texto.includes('resort') ||
        texto.includes('transfer incluído') ||
        texto.includes('café da manhã incluído')
      );
    },
    
    template: (data) => `📦 *PACOTE COMPLETO ${data.destino ? data.destino.toUpperCase() : 'DESTINO'}*
${data.duracao || '5 dias / 4 noites'} | ${data.periodo || 'Período da viagem'}
${data.passageiros || '2 adultos'}

━━━━━━━━━━━━━━━━━━
✈️ *AÉREO INCLUÍDO:*
${data.companhia_aerea || 'LATAM/GOL'}
• IDA: ${data.voo_ida || 'São Paulo → Destino'}
  ${data.data_ida || 'Data'} - ${data.horario_ida || 'Horários'}
• VOLTA: ${data.voo_volta || 'Destino → São Paulo'}
  ${data.data_volta || 'Data'} - ${data.horario_volta || 'Horários'}
• ${data.bagagem || '1 mala de 23kg + mão incluída'}

━━━━━━━━━━━━━━━━━━
🏨 *HOSPEDAGEM:*
*${data.nome_hotel || 'Resort Paradise Beach'}* ${data.categoria_hotel || '⭐⭐⭐⭐⭐'}
📍 ${data.localizacao_hotel || 'Beira-mar, região turística'}
🛏️ ${data.tipo_quarto || 'Quarto Duplo Vista Mar'}
🍽️ ${data.regime || 'All Inclusive - Todas as refeições e bebidas'}

*Comodidades do Hotel:*
${data.comodidades || `• 3 Piscinas (1 infantil)
• Praia privativa
• 4 Restaurantes temáticos
• SPA e academia
• Kids Club e recreação
• Wi-Fi gratuito
• Esportes aquáticos`}

━━━━━━━━━━━━━━━━━━
🚐 *TRANSFERS:*
✅ Aeroporto → Hotel → Aeroporto
${data.tipo_transfer || 'Transfer privativo com assistência'}

━━━━━━━━━━━━━━━━━━
💰 *VALOR DO PACOTE COMPLETO:*
${data.valor_total || 'R$ 0.000,00'} ${data.valor_detalhe || 'para 2 adultos'}
💳 ${data.parcelamento || 'Em até 10x sem juros no cartão'}
${data.entrada ? `💵 Entrada de ${data.entrada} + saldo parcelado` : ''}

━━━━━━━━━━━━━━━━━━
✅ *O PACOTE INCLUI:*
• Passagem aérea ida e volta
• ${data.noites || '4'} noites de hospedagem
• ${data.regime || 'All Inclusive'}
• Transfer aeroporto/hotel/aeroporto
• Seguro viagem básico
• Assistência 24h em português

❌ *NÃO INCLUI:*
• Despesas pessoais
• Passeios opcionais
• Upgrade de categoria
• Seguro adicional (opcional)

━━━━━━━━━━━━━━━━━━
🎁 *PROMOÇÃO ESPECIAL:*
${data.promocao || '• Criança até 12 anos FREE\n• 2º quarto com 30% desconto\n• Check-in antecipado cortesia'}

📱 *Reserve agora e garanta essa oferta!*`
  }
};

// ================================================================================
// 🎨 REGRAS DE FORMATAÇÃO PROFISSIONAL
// ================================================================================

const REGRAS_FORMATACAO = {
  // Conversão de aeroportos
  aeroportos: {
    'GRU': 'Guarulhos (GRU)',
    'CGH': 'Congonhas (CGH)',
    'VCP': 'Viracopos (VCP)',
    'SDU': 'Santos Dumont (SDU)',
    'GIG': 'Galeão (GIG)',
    'BSB': 'Brasília (BSB)',
    'CNF': 'Confins (CNF)',
    'POA': 'Porto Alegre (POA)',
    'REC': 'Recife (REC)',
    'SSA': 'Salvador (SSA)',
    'FOR': 'Fortaleza (FOR)',
    'MAO': 'Manaus (MAO)',
    'CWB': 'Curitiba (CWB)',
    'FLN': 'Florianópolis (FLN)',
    'MCZ': 'Maceió (MCZ)',
    'JPA': 'João Pessoa (JPA)',
    'NAT': 'Natal (NAT)',
    'AJU': 'Aracaju (AJU)',
    'BEL': 'Belém (BEL)',
    'VIX': 'Vitória (VIX)',
    'CGB': 'Cuiabá (CGB)',
    'GYN': 'Goiânia (GYN)',
    'SLZ': 'São Luís (SLZ)',
    'THE': 'Teresina (THE)',
    'PMW': 'Palmas (PMW)',
    // Internacionais principais
    'MIA': 'Miami (MIA)',
    'MCO': 'Orlando (MCO)',
    'JFK': 'Nova York (JFK)',
    'LAX': 'Los Angeles (LAX)',
    'LIS': 'Lisboa (LIS)',
    'MAD': 'Madrid (MAD)',
    'CDG': 'Paris (CDG)',
    'LHR': 'Londres (LHR)',
    'FCO': 'Roma (FCO)',
    'EZE': 'Buenos Aires (EZE)',
    'SCL': 'Santiago (SCL)',
    'LIM': 'Lima (LIM)',
    'BOG': 'Bogotá (BOG)',
    'MEX': 'Cidade do México (MEX)',
    'CUN': 'Cancún (CUN)'
  },

  // Formatação de valores monetários
  formatarValor: (valor) => {
    if (!valor) return 'R$ 0,00';
    
    // Remove tudo exceto números e vírgula/ponto
    let limpo = valor.toString().replace(/[^\d.,]/g, '');
    
    // Converte para número
    let numero = parseFloat(limpo.replace(',', '.'));
    
    if (isNaN(numero)) return valor;
    
    // Formata para moeda brasileira
    return `R$ ${numero.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  },

  // Formatação de datas
  formatarData: (data) => {
    if (!data) return '';
    
    // Se já está formatada (DD/MM ou DD/MM/AAAA)
    if (data.includes('/')) return data;
    
    // Converte formatos diversos
    const meses = {
      'jan': '01', 'janeiro': '01',
      'fev': '02', 'fevereiro': '02', 
      'mar': '03', 'março': '03',
      'abr': '04', 'abril': '04',
      'mai': '05', 'maio': '05',
      'jun': '06', 'junho': '06',
      'jul': '07', 'julho': '07',
      'ago': '08', 'agosto': '08',
      'set': '09', 'setembro': '09',
      'out': '10', 'outubro': '10',
      'nov': '11', 'novembro': '11',
      'dez': '12', 'dezembro': '12'
    };
    
    // Tenta converter
    let dataLimpa = data.toLowerCase();
    for (const [mes, num] of Object.entries(meses)) {
      dataLimpa = dataLimpa.replace(mes, num);
    }
    
    return dataLimpa;
  },

  // Formatação de horários
  formatarHorario: (horario) => {
    if (!horario) return '';
    
    // Remove textos desnecessários
    let limpo = horario.replace(/\s*(hrs?|horas?|h)\s*/gi, '');
    
    // Adiciona 'h' se for apenas números
    if (/^\d{2}:\d{2}$/.test(limpo)) {
      limpo = limpo.replace(':', 'h');
    }
    
    return limpo;
  },

  // Formatação de companhias aéreas
  formatarCompanhia: (companhia) => {
    const nomes = {
      'latam': 'LATAM',
      'gol': 'GOL',
      'azul': 'AZUL',
      'tam': 'LATAM',
      'avianca': 'Avianca',
      'voepass': 'VoePass',
      'tap': 'TAP',
      'american': 'American Airlines',
      'united': 'United Airlines',
      'delta': 'Delta Airlines',
      'air france': 'Air France',
      'klm': 'KLM',
      'lufthansa': 'Lufthansa',
      'copa': 'Copa Airlines',
      'aeromexico': 'Aeroméxico',
      'iberia': 'Iberia',
      'british': 'British Airways',
      'emirates': 'Emirates',
      'qatar': 'Qatar Airways'
    };
    
    if (!companhia) return '';
    const lower = companhia.toLowerCase();
    return nomes[lower] || companhia;
  }
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 Aplicando template completo v9.0...");
  
  if (!formData) {
    console.error("❌ FormData vazio");
    return "Erro: Dados do formulário não encontrados";
  }

  try {
    // Detectar tipo de layout se houver texto colado
    let tipoDetectado = 'generico';
    
    if (formData.textoColado) {
      tipoDetectado = detectarLayoutOrcamento(formData.textoColado);
      console.log(`📊 Tipo detectado: ${tipoDetectado}`);
    } else if (analise && analise.tipoPrincipal) {
      tipoDetectado = mapearTipoParaTemplate(analise.tipoPrincipal);
      console.log(`📊 Tipo mapeado da análise: ${tipoDetectado}`);
    }

    // Aplicar template específico ou gerar prompt
    if (TEMPLATES_MANUAIS[tipoDetectado]) {
      console.log(`✅ Usando template manual: ${tipoDetectado}`);
      
      // Extrair dados do texto colado se houver
      const dadosExtraidos = formData.textoColado ? 
        extrairDadosDoTexto(formData.textoColado, tipoDetectado) : 
        formData;
      
      // Aplicar template
      const resultado = TEMPLATES_MANUAIS[tipoDetectado].template(dadosExtraidos);
      
      // Aplicar formatações finais
      return aplicarFormatacoesFinais(resultado);
    }

    // Se não encontrou template específico, gerar prompt para IA
    console.log("📝 Gerando prompt para template genérico");
    return gerarPromptGenerico(formData, analise);

  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return gerarPromptGenerico(formData, analise);
  }
}

// ================================================================================
// 🔍 DETECÇÃO INTELIGENTE DE LAYOUT COM PRIORIDADE
// ================================================================================

function detectarLayoutOrcamento(textoColado) {
  console.log("🔍 Detectando layout do orçamento v9.0...");
  
  if (!textoColado) {
    console.log("⚠️ Texto vazio, retornando genérico");
    return 'generico';
  }

  const texto = textoColado.toLowerCase();
  
  // Ordem de prioridade: mais específico → mais genérico
  const ordemPrioridade = [
    'cruzeiro',                          // Muito específico
    'pacote_completo',                   // Específico (hotel + aéreo)
    'multitrecho',                       // Específico (múltiplos trechos)
    'multiplas_companhias_internacionais', // Internacional com opções
    'multiplas_opcoes_3',                // 3 opções
    'multiplas_opcoes_2',                // 2 opções
    'aereo_conexao_detalhada',          // Conexão específica
    'aereo_somente_ida',                 // One way
    'aereo_nacional_simples'            // Mais genérico dos específicos
  ];

  // Testar cada tipo na ordem de prioridade
  for (const tipo of ordemPrioridade) {
    if (TEMPLATES_MANUAIS[tipo] && TEMPLATES_MANUAIS[tipo].detectar(texto)) {
      console.log(`✅ Layout detectado: ${tipo}`);
      return tipo;
    }
  }

  console.log("📝 Nenhum layout específico detectado, usando genérico");
  return 'generico';
}

// ================================================================================
// 🗺️ MAPEAMENTO DE TIPOS DE ANÁLISE PARA TEMPLATES
// ================================================================================

function mapearTipoParaTemplate(tipoPrincipal) {
  const mapeamento = {
    'Aéreo Nacional': 'aereo_nacional_simples',
    'Aéreo Internacional': 'multiplas_companhias_internacionais',
    'Multi Destinos': 'multitrecho',
    'Cruzeiros Marítimos': 'cruzeiro',
    'Hotéis': 'pacote_completo',
    'Pacotes Completos': 'pacote_completo',
    'Pacotes Terrestres': 'pacote_completo'
  };

  return mapeamento[tipoPrincipal] || 'generico';
}

// ================================================================================
// 📤 EXTRAÇÃO DE DADOS DO TEXTO
// ================================================================================

function extrairDadosDoTexto(texto, tipoTemplate) {
  console.log(`📤 Extraindo dados para template: ${tipoTemplate}`);
  
  const dados = {
    textoOriginal: texto
  };

  // Extrações comuns
  dados.valor_total = extrairValor(texto);
  dados.data_ida = extrairData(texto, 'ida');
  dados.data_volta = extrairData(texto, 'volta');
  dados.passageiros = extrairPassageiros(texto);
  dados.destino = extrairDestino(texto);

  // Extrações específicas por tipo
  switch (tipoTemplate) {
    case 'cruzeiro':
      dados.nome_cruzeiro = extrairNomeCruzeiro(texto);
      dados.duracao = extrairDuracao(texto);
      dados.categoria_cabine = extrairCabine(texto);
      break;
      
    case 'pacote_completo':
      dados.nome_hotel = extrairHotel(texto);
      dados.regime = extrairRegime(texto);
      dados.noites = extrairNoites(texto);
      break;
      
    case 'multitrecho':
      dados.trechos = extrairTrechos(texto);
      break;
      
    default:
      dados.companhia = extrairCompanhia(texto);
      dados.horarios = extrairHorarios(texto);
  }

  return dados;
}

// Funções auxiliares de extração
function extrairValor(texto) {
  const match = texto.match(/R\$\s*[\d.,]+/);
  return match ? REGRAS_FORMATACAO.formatarValor(match[0]) : 'R$ 0,00';
}

function extrairData(texto, tipo) {
  const patterns = tipo === 'ida' ? 
    [/ida[:\s]+(\d{2}\/\d{2})/i, /saída[:\s]+(\d{2}\/\d{2})/i] :
    [/volta[:\s]+(\d{2}\/\d{2})/i, /retorno[:\s]+(\d{2}\/\d{2})/i];
  
  for (const pattern of patterns) {
    const match = texto.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function extrairPassageiros(texto) {
  const match = texto.match(/(\d+)\s*(adulto|pessoa|pax)/i);
  return match ? `${match[1]} ${match[2]}` : '1 adulto';
}

function extrairDestino(texto) {
  // Lista de destinos comuns
  const destinos = ['Salvador', 'Recife', 'Fortaleza', 'Natal', 'Maceió', 
                    'João Pessoa', 'Porto Seguro', 'Florianópolis', 'Rio de Janeiro',
                    'Búzios', 'Campos do Jordão', 'Gramado', 'Foz do Iguaçu',
                    'Miami', 'Orlando', 'Lisboa', 'Paris', 'Madrid', 'Londres'];
  
  for (const destino of destinos) {
    if (texto.toLowerCase().includes(destino.toLowerCase())) {
      return destino;
    }
  }
  return 'Destino';
}

function extrairCompanhia(texto) {
  const companhias = ['LATAM', 'GOL', 'AZUL', 'TAP', 'American', 'United'];
  for (const cia of companhias) {
    if (texto.toLowerCase().includes(cia.toLowerCase())) {
      return cia;
    }
  }
  return 'Companhia Aérea';
}

function extrairHorarios(texto) {
  const matches = texto.match(/\d{2}[h:]\d{2}/g);
  return matches ? matches.join(' / ') : '';
}

function extrairNomeCruzeiro(texto) {
  const nomes = ['Costa Fascinosa', 'MSC Preziosa', 'MSC Grandiosa', 'Costa Diadema'];
  for (const nome of nomes) {
    if (texto.toLowerCase().includes(nome.toLowerCase())) {
      return nome;
    }
  }
  return 'Cruzeiro';
}

function extrairDuracao(texto) {
  const match = texto.match(/(\d+)\s*noites?/i);
  return match ? `${match[1]} noites` : '7 noites';
}

function extrairCabine(texto) {
  if (texto.toLowerCase().includes('varanda')) return 'Externa com Varanda';
  if (texto.toLowerCase().includes('interna')) return 'Interna';
  if (texto.toLowerCase().includes('suíte')) return 'Suíte';
  return 'Externa';
}

function extrairHotel(texto) {
  const match = texto.match(/hotel\s+([^\n,]+)/i);
  return match ? match[1].trim() : 'Hotel';
}

function extrairRegime(texto) {
  if (texto.toLowerCase().includes('all inclusive')) return 'All Inclusive';
  if (texto.toLowerCase().includes('meia pensão')) return 'Meia Pensão';
  if (texto.toLowerCase().includes('café da manhã')) return 'Café da manhã incluído';
  return 'Conforme disponibilidade';
}

function extrairNoites(texto) {
  const match = texto.match(/(\d+)\s*noites?/i);
  return match ? match[1] : '4';
}

function extrairTrechos(texto) {
  // Implementação simplificada para extração de trechos
  const trechos = [];
  const linhas = texto.split('\n');
  
  for (const linha of linhas) {
    if (linha.includes('→') || linha.includes('->')) {
      trechos.push(linha.trim());
    }
  }
  
  return trechos;
}

// ================================================================================
// 🎨 APLICAÇÃO DE FORMATAÇÕES FINAIS
// ================================================================================

function aplicarFormatacoesFinais(texto) {
  console.log("🎨 Aplicando formatações finais...");
  
  let formatado = texto;
  
  // Aplicar conversão de aeroportos
  for (const [sigla, nome] of Object.entries(REGRAS_FORMATACAO.aeroportos)) {
    const regex = new RegExp(`\\b${sigla}\\b`, 'g');
    formatado = formatado.replace(regex, nome);
  }
  
  // Remover espaços extras
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  formatado = formatado.replace(/\s+$/gm, '');
  
  // Garantir emojis corretos
  formatado = formatado.replace(/airplane/gi, '✈️');
  formatado = formatado.replace(/ship/gi, '🚢');
  formatado = formatado.replace(/hotel/gi, '🏨');
  
  return formatado.trim();
}

// ================================================================================
// 📝 GERAÇÃO DE PROMPT GENÉRICO
// ================================================================================

function gerarPromptGenerico(formData, analise) {
  console.log("📝 Gerando prompt genérico para IA...");
  
  const tipos = formData.tipos || ['Orçamento'];
  const destino = formData.destino || 'Destino não especificado';
  const observacoes = formData.observacoes || '';
  const textoColado = formData.textoColado || '';
  
  let prompt = `Crie um orçamento profissional CVC Itaquaquecetuba:

TIPOS SOLICITADOS: ${tipos.join(', ')}
DESTINO: ${destino}
ADULTOS: ${formData.adultos || 1}
CRIANÇAS: ${formData.criancas || 0}
${formData.idadesCriancas ? `IDADES DAS CRIANÇAS: ${formData.idadesCriancas}` : ''}

${observacoes ? `OBSERVAÇÕES DO CLIENTE:\n${observacoes}\n` : ''}
${textoColado ? `INFORMAÇÕES ADICIONAIS:\n${textoColado}\n` : ''}

FORMATO OBRIGATÓRIO:
- Use emojis profissionais (✈️ 🏨 💰 📅 ✅)
- Destaque com *negrito* informações importantes
- Separe seções com linhas (━━━━━)
- Inclua valores, datas e horários
- Termine com call-to-action

Gere o orçamento completo e formatado:`;

  return prompt;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 COMPLETA (SEM DUPLICAÇÃO)
// ================================================================================

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

console.log("✅ Templates v9.0 carregado - Sistema profissional completo");
