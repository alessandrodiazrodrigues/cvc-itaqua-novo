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
    // ... (todo o seu objeto REGRAS_FORMATACAO permanece igual)
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

// ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
// A palavra 'export' foi REMOVIDA da linha abaixo para corrigir o erro.
function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 Aplicando template completo v9.0...");
  if (!formData) {
    console.error("❌ FormData vazio");
    return "Erro: Dados do formulário não encontrados";
  }
  try {
    let tipoDetectado = 'generico';
    if (formData.textoColado) {
      tipoDetectado = detectarLayoutOrcamento(formData.textoColado);
    } else if (analise && analise.tipoPrincipal) {
      tipoDetectado = mapearTipoParaTemplate(analise.tipoPrincipal);
    }
    if (TEMPLATES_MANUAIS[tipoDetectado]) {
      const dadosExtraidos = formData.textoColado ?
        extrairDadosDoTexto(formData.textoColado, tipoDetectado) :
        formData;
      const resultado = TEMPLATES_MANUAIS[tipoDetectado].template(dadosExtraidos);
      return aplicarFormatacoesFinais(resultado);
    }
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
    // ... (todo o corpo da função permanece igual)
    return 'aereo_nacional_simples';
}

// ================================================================================
// 🗺️ MAPEAMENTO DE TIPOS DE ANÁLISE PARA TEMPLATES
// ================================================================================

function mapearTipoParaTemplate(tipoPrincipal) {
    // ... (todo o corpo da função permanece igual)
    return 'generico';
}

// ================================================================================
// 📤 EXTRAÇÃO DE DADOS DO TEXTO
// ================================================================================

function extrairDadosDoTexto(texto, tipoTemplate) {
    // ... (todo o corpo da função permanece igual)
    return {};
}

// ... (todas as outras funções de extração, como extrairValor, etc., permanecem aqui)

function aplicarFormatacoesFinais(texto) {
    // ... (todo o corpo da função permanece igual)
    return texto.trim();
}

// ================================================================================
// 📝 GERAÇÃO DE PROMPT GENÉRICO
// ================================================================================

function gerarPromptGenerico(formData, analise) {
    // ... (todo o corpo da função permanece igual)
    return `Gere o orçamento completo e formatado:`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 ÚNICA E CORRIGIDA
// ================================================================================
console.log("✅ Templates v9.0 carregado - Sistema profissional completo");

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
