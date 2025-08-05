// 📋 modules/templates.js - SISTEMA COMPLETO DE TEMPLATES v7.7
// CORREÇÃO CRÍTICA: Exportações ES6 limpas - sem duplicatas
// Responsável por: Templates especializados, detecção, formatação, dicas e rankings

console.log("📋 Templates v7.7 - EXPORTAÇÕES ES6 CORRIGIDAS");

// ================================================================================
// 🎯 TEMPLATES COMPLETOS - MANUAL IMPLEMENTADO
// ================================================================================

const TEMPLATES_MANUAIS = {
  
  // ✈️ 1. AÉREO NACIONAL IDA E VOLTA SIMPLES
  'aereo_nacional_simples': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        !texto.includes('internacional') &&
        (texto.includes('ida') && texto.includes('volta')) &&
        !texto.includes('opção 1') && !texto.includes('opção 2') &&
        (texto.includes('congonhas') || texto.includes('santos dumont') || 
         texto.includes('guarulhos') || texto.includes('viracopos'))
      );
    },
    
    template: (data) => `*${data.companhia || 'Latam'}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 ${data.valor_total} para ${data.passageiros}
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ ${data.bagagem || 'Só mala de mão incluída'}
🏷️ ${data.reembolso || 'Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 2. AÉREO COM CONEXÃO DETALHADA
  'aereo_conexao_detalhada': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('conexão') && 
        (texto.includes('brasília') || texto.includes('recife') || texto.includes('fortaleza')) &&
        texto.includes('espera')
      );
    },
    
    template: (data) => `*${data.companhia || 'Gol'}*
${data.data_ida} - ${data.origem} ${data.hora_ida_1} / ${data.conexao} ${data.hora_chegada_1} (voo direto)
(conexão em ${data.conexao} - ${data.tempo_espera} de espera)
${data.data_ida} - ${data.conexao} ${data.hora_ida_2} / ${data.destino} ${data.hora_chegada_2} (voo direto)
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 ${data.valor_total} para ${data.passageiros}
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ ${data.bagagem || 'Só mala de mão incluída'}
🏷️ ${data.reembolso || 'Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // ✈️ 3. AÉREO INTERNACIONAL
  'aereo_internacional': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('internacional') ||
        texto.includes('miami') || texto.includes('orlando') || texto.includes('europa') ||
        texto.includes('londres') || texto.includes('paris') || texto.includes('madrid')
      );
    },
    
    template: (data) => `*${data.companhia || 'Latam'}* ✈️ ${data.destino}
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 ${data.valor_total} para ${data.passageiros}
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ ${data.bagagem || 'Bagagem de mão incluída'}
🏷️ ${data.reembolso || 'Reembolsável conforme regras'}
📋 Documentação: ${data.documentos || 'Passaporte obrigatório'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // 🔢 4. MÚLTIPLAS OPÇÕES
  'multiplas_opcoes': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return texto.includes('opção') && (texto.includes('opção 1') || texto.includes('opção 2'));
    },
    
    template: (data) => `*${data.companhia || 'Latam'}* - ${data.origem} ✈ ${data.destino}
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 **OPÇÃO 1** - ${data.valor_opcao1}
✅ Só mala de mão incluída
💳 ${data.parcelamento_opcao1 || '10x sem juros'}

💰 **OPÇÃO 2** - ${data.valor_opcao2}  
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração permitidos
💳 ${data.parcelamento_opcao2 || '10x sem juros'}

🏷️ ${data.reembolso || 'Condições conforme bilhete'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // 🚢 5. CRUZEIROS
  'cruzeiro': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('cruzeiro') || texto.includes('msc') || 
        texto.includes('navio') || texto.includes('sinfonia')
      );
    },
    
    template: (data) => `🚢 *Cruzeiro ${data.navio || 'MSC Sinfonia'}* – ${data.noites || '7'} noites
👥 ${data.passageiros || '2 adultos'}
📅 Embarque: ${data.data_embarque} (${data.porto || 'Santos'})
🌊 ${data.roteiro || 'Roteiro pelo litoral brasileiro'}

💰 Opções de Cabines:
**CABINE INTERNA** - ${data.valor_interna || 'R$ 1.899,00'}
**CABINE EXTERNA** - ${data.valor_externa || 'R$ 2.299,00'}
**CABINE VARANDA** - ${data.valor_varanda || 'R$ 2.899,00'}

✅ Inclui: hospedagem, pensão completa
🚫 Não inclui: taxas portuárias, bebidas, excursões
📋 Documentação: ${data.documentos || 'RG original (máx. 10 anos)'}

${data.observacoes || '📲 Entre em contato para garantir sua cabine! 🌴🛳️'}`
  },

  // 🏨 6. HOTÉIS
  'hotel': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('hotel') && texto.includes('diária') ||
        texto.includes('hospedagem') || texto.includes('resort')
      );
    },
    
    template: (data) => `🏨 *Hotel ${data.nome_hotel}* - ${data.destino}
📍 ${data.localizacao || 'Localização privilegiada'}
⭐ ${data.categoria || '4 estrelas'}

📅 Check-in: ${data.checkin}
📅 Check-out: ${data.checkout}
🛏️ ${data.tipo_quarto || 'Quarto duplo'}
👥 ${data.passageiros || '2 adultos'}

💰 ${data.valor_total} (${data.noites} diárias)
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ Inclui: ${data.inclui || 'café da manhã'}
🏷️ ${data.cancelamento || 'Cancelamento gratuito até 24h antes'}

${data.observacoes || '🌟 Ótima localização e excelente custo-benefício!'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // 📦 7. PACOTES COMPLETOS
  'pacote_completo': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('pacote') && 
        (texto.includes('aéreo') && texto.includes('hotel'))
      );
    },
    
    template: (data) => `📦 *Pacote Completo ${data.destino}*
🗓️ ${data.data_ida} a ${data.data_volta} (${data.noites} noites)
👥 ${data.passageiros}

✈️ **VOO:**
*${data.companhia}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada}
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta}

🏨 **HOTEL:**
*${data.nome_hotel}*
📍 ${data.localizacao_hotel}
⭐ ${data.categoria_hotel}
✅ ${data.inclui_hotel || 'Café da manhã incluído'}

💰 **TOTAL DO PACOTE:** ${data.valor_total}
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ Inclui: ${data.inclui_pacote || 'aéreo, hotel e taxas'}
${data.link ? `🔗 ${data.link}` : ''}`
  },

  // 🏆 8. RANKINGS DE HOTÉIS
  'ranking_hoteis': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return texto.includes('ranking') && texto.includes('hotel');
    },
    
    template: (data) => `🏨 RANKING DE HOTÉIS - ${data.destino.toUpperCase()}

🏆 1. ${data.hotel1_nome} - ${data.hotel1_estrelas}
📍 ${data.hotel1_localizacao}
💰 ${data.hotel1_preco}
⭐ ${data.hotel1_destaque}

🏆 2. ${data.hotel2_nome} - ${data.hotel2_estrelas}  
📍 ${data.hotel2_localizacao}
💰 ${data.hotel2_preco}
⭐ ${data.hotel2_destaque}

🏆 3. ${data.hotel3_nome} - ${data.hotel3_estrelas}
📍 ${data.hotel3_localizacao}  
💰 ${data.hotel3_preco}
⭐ ${data.hotel3_destaque}

📱 Entre em contato para mais opções!`
  }
};

// ================================================================================
// 🔧 REGRAS DE FORMATAÇÃO
// ================================================================================

const REGRAS_FORMATACAO = {
  formatarHorario: (hora) => {
    if (!hora) return '';
    return hora.replace(/\s*:\s*/, ':').replace(/(\d{1,2}):(\d{2})/, '$1:$2');
  },
  
  formatarData: (data) => {
    if (!data) return '';
    return data.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, '$1/$2').replace(/(\d{1,2})\/(\d{1,2})/, '$1/$2');
  },
  
  formatarValor: (valor) => {
    if (!valor) return '';
    return valor.replace(/R\$?\s*/, 'R$ ').replace(/(\d)(\d{3})/, '$1.$2');
  },
  
  converterAeroporto: (codigo) => {
    const aeroportos = {
      'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
      'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'BSB': 'Brasília',
      'CWB': 'Curitiba', 'POA': 'Porto Alegre', 'FOR': 'Fortaleza',
      'REC': 'Recife', 'SSA': 'Salvador', 'MAO': 'Manaus'
    };
    return aeroportos[codigo?.toUpperCase()] || codigo;
  },
  
  formatarPassageiros: (adultos, criancas, idades) => {
    if (!adultos && !criancas) return '02 adultos';
    
    let texto = '';
    if (adultos) {
      texto += adultos.toString().padStart(2, '0') + ' adult' + (adultos > 1 ? 'os' : 'o');
    }
    if (criancas && criancas > 0) {
      if (texto) texto += ' + ';
      texto += criancas.toString().padStart(2, '0') + ' criança' + (criancas > 1 ? 's' : '');
      if (idades && idades.length > 0) {
        texto += ` (${idades.join(' e ')} anos)`;
      }
    }
    return texto;
  },
  
  detectarTipoVoo: (horarios, conexoes) => {
    if (conexoes && conexoes.includes('conexão')) {
      const aeroportoConexao = conexoes.match(/(brasília|recife|fortaleza|salvador)/i)?.[1];
      return aeroportoConexao ? `com conexão em ${aeroportoConexao}` : 'com conexão';
    }
    return 'voo direto';
  }
};

// ================================================================================
// 🔍 DETECÇÃO AUTOMÁTICA DE LAYOUTS
// ================================================================================

function detectarLayoutOrcamento(dados) {
  console.log("🔍 Detectando layout do orçamento...");
  
  const texto = (dados.observacoes + ' ' + (dados.textoColado || '')).toLowerCase();
  
  // Testar cada template na ordem de prioridade
  for (const [tipo, config] of Object.entries(TEMPLATES_MANUAIS)) {
    if (config.detectar(texto)) {
      console.log(`✅ Layout detectado: ${tipo}`);
      return tipo;
    }
  }
  
  // Template padrão
  console.log("📋 Usando template padrão: aereo_nacional_simples");
  return 'aereo_nacional_simples';
}

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 Aplicando template completo do manual...");
  
  try {
    // ETAPA 1: Detectar layout
    const layoutDetectado = detectarLayoutOrcamento(formData);
    const templateConfig = TEMPLATES_MANUAIS[layoutDetectado];
    
    // ETAPA 2: Extrair dados específicos baseado no layout
    const dadosExtraidos = extrairDadosEspecificos(formData, layoutDetectado);
    
    // ETAPA 3: Aplicar regras de formatação
    const dadosFormatados = aplicarRegraFormatacao(dadosExtraidos);
    
    // ETAPA 4: Gerar prompt otimizado
    const prompt = construirPromptEspecifico(templateConfig, dadosFormatados, formData);
    
    console.log(`✅ Template ${layoutDetectado} aplicado com sucesso`);
    
    return {
      prompt: prompt,
      templateUsado: layoutDetectado,
      layout: layoutDetectado,
      dadosExtraidos: dadosExtraidos
    };
    
  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return construirPromptFallback(formData);
  }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function extrairDadosEspecificos(formData, layout) {
  const textoCompleto = (formData.observacoes + ' ' + (formData.textoColado || '')).trim();
  
  return {
    companhia: extrairCompanhia(textoCompleto),
    origem: REGRAS_FORMATACAO.converterAeroporto(extrairOrigem(textoCompleto)),
    destino: formData.destino || extrairDestino(textoCompleto),
    passageiros: REGRAS_FORMATACAO.formatarPassageiros(formData.adultos, formData.criancas, formData.idadesCriancas),
    
    // Datas e horários formatados
    data_ida: REGRAS_FORMATACAO.formatarData(extrairDataIda(textoCompleto)),
    data_volta: REGRAS_FORMATACAO.formatarData(extrairDataVolta(textoCompleto)),
    
    // Valores formatados
    valor_total: REGRAS_FORMATACAO.formatarValor(extrairValor(textoCompleto)),
    
    // Informações específicas do layout
    bagagem: extrairBagagem(textoCompleto),
    reembolso: extrairReembolso(textoCompleto),
    parcelamento: extrairParcelamento(textoCompleto)
  };
}

function aplicarRegraFormatacao(dados) {
  return {
    ...dados,
    hora_ida: REGRAS_FORMATACAO.formatarHorario(dados.hora_ida),
    hora_volta: REGRAS_FORMATACAO.formatarHorario(dados.hora_volta),
    data_ida: REGRAS_FORMATACAO.formatarData(dados.data_ida),
    data_volta: REGRAS_FORMATACAO.formatarData(dados.data_volta),
    valor_total: REGRAS_FORMATACAO.formatarValor(dados.valor_total)
  };
}

function construirPromptEspecifico(templateConfig, dados, formData) {
  const contextoTemplate = `
APLICAR TEMPLATE: ${templateConfig ? 'ESPECÍFICO' : 'GENÉRICO'}

REGRAS DE FORMATAÇÃO OBRIGATÓRIAS:
1. 🏢 COMPANHIAS: Usar formatação *Companhia*
2. ⏰ HORÁRIOS: Formato "06:20" (nunca "06: 20") 
3. 📅 DATAS: Formato "15/11"
4. 🌍 AEROPORTOS: Converter códigos (CGH → Congonhas)
5. 💰 PREÇOS: Usar apenas valores reais fornecidos
6. 🧳 BAGAGEM: Nacional básico = "Só mala de mão incluída"
7. 🏷️ REEMBOLSO: "Não reembolsável" ou "Reembolsável conforme regras do bilhete"
8. 👥 PASSAGEIROS: "02 adultos" (com zero à esquerda)

DADOS FORNECIDOS:
${JSON.stringify(dados, null, 2)}

TEMPLATE A SEGUIR:
${templateConfig?.template ? 'Usar template específico detectado' : 'Usar template genérico'}

GERE O ORÇAMENTO PROFISSIONAL SEGUINDO AS REGRAS:`;

  return contextoTemplate;
}

function construirPromptFallback(formData) {
  return `
GERAR ORÇAMENTO DE VIAGEM - FORMATO PROFISSIONAL

DADOS FORNECIDOS:
- Tipos: ${formData.tipos?.join(', ') || 'Não especificado'}
- Destino: ${formData.destino || 'Não especificado'}
- Observações: ${formData.observacoes || 'Não fornecidas'}
- Texto colado: ${formData.textoColado || 'Não fornecido'}

FORMATO OBRIGATÓRIO:
*Companhia Aérea*
Data ida - Origem Hora / Destino Hora (tipo voo)
--
Data volta - Destino Hora / Origem Hora (tipo voo)

💰 Valor para passageiros
✅ Bagagem incluída
🏷️ Condições de reembolso

GERE O ORÇAMENTO:`;
}

// ================================================================================
// 🏨 FUNÇÃO: GERAR RANKING DE HOTÉIS
// ================================================================================

function gerarRankingHoteis(destino) {
  console.log(`🏨 Gerando ranking de hotéis para: ${destino}`);
  
  const destinoFormatado = typeof destino === 'string' ? destino : 
                          destino?.destino || 'destino solicitado';
  
  return `🏨 RANKING DE HOTÉIS - ${destinoFormatado.toUpperCase()}

🏆 1. Hotel Boa Viagem - ⭐⭐⭐⭐
📍 Região central, próximo às principais atrações
💰 R$ 200-350 por diária
⭐ Localização premium, café da manhã, piscina

🏆 2. Resort Coral Plaza - ⭐⭐⭐⭐⭐
📍 Zona turística principal
💰 R$ 400-600 por diária
⭐ All inclusive, spa, recreação infantil

🏆 3. Hotel Mar Azul - ⭐⭐⭐
📍 Centro histórico
💰 R$ 150-250 por diária
⭐ Custo-benefício, cultura, gastronomia

🏆 4. Pousada Tropical - ⭐⭐⭐
📍 Região tranquila
💰 R$ 120-200 por diária
⭐ Familiar, aconchegante, atendimento personalizado

🏆 5. Hotel Business - ⭐⭐⭐⭐
📍 Centro empresarial
💰 R$ 250-400 por diária
⭐ Executivo, wi-fi, centro de convenções

📱 Entre em contato para mais informações e reservas!`;
}

// ================================================================================
// 💡 FUNÇÃO: GERAR DICAS DE VIAGEM
// ================================================================================

function gerarDicasViagem(destino) {
  console.log(`💡 Gerando dicas de viagem para: ${destino}`);
  
  const destinoFormatado = typeof destino === 'string' ? destino : 
                          destino?.destino || 'destino solicitado';
  
  return `💡 DICAS DE VIAGEM - ${destinoFormatado.toUpperCase()}

🌡️ MELHOR ÉPOCA:
Dezembro a março - verão com sol garantido
Evite junho a agosto - período mais chuvoso

🎯 ATRAÇÕES IMPERDÍVEIS:
• Centro histórico e pontos turísticos
• Praias principais da região
• Museus e centros culturais
• Gastronomia local típica

🍽️ GASTRONOMIA LOCAL:
• Pratos típicos regionais
• Especialidades locais
• Doces e sobremesas tradicionais
• Bebidas e sucos naturais

💡 DICAS IMPORTANTES:
• Protetor solar FPS 60+
• Repelente para passeios
• Roupas leves e confortáveis
• Documento com foto sempre
• Dinheiro em espécie para emergências

🧳 O QUE LEVAR:
• Roupas adequadas ao clima
• Calçados confortáveis
• Kit de primeiros socorros básico
• Carregador portátil
• Câmera para registrar os momentos

📱 Entre em contato para informações específicas do seu roteiro!`;
}

// ================================================================================
// 🔧 FUNÇÕES DE EXTRAÇÃO (AUXILIARES)
// ================================================================================

function extrairCompanhia(texto) {
  const padroes = ['latam', 'gol', 'azul', 'tap', 'avianca', 'copa', 'american', 'lufthansa'];
  for (const companhia of padroes) {
    if (texto.toLowerCase().includes(companhia)) {
      return companhia.charAt(0).toUpperCase() + companhia.slice(1);
    }
  }
  return 'Latam';
}

function extrairOrigem(texto) {
  const aeroportos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB'];
  for (const aeroporto of aeroportos) {
    if (texto.toUpperCase().includes(aeroporto)) {
      return aeroporto;
    }
  }
  return 'CGH';
}

function extrairDestino(texto) {
  const destinos = ['Rio de Janeiro', 'Salvador', 'Recife', 'Fortaleza', 'Miami', 'Orlando'];
  for (const destino of destinos) {
    if (texto.toLowerCase().includes(destino.toLowerCase())) {
      return destino;
    }
  }
  return 'destino';
}

function extrairDataIda(texto) {
  const match = texto.match(/(\d{1,2}\/\d{1,2})/);
  return match ? match[1] : 'data ida';
}

function extrairDataVolta(texto) {
  const matches = texto.match(/(\d{1,2}\/\d{1,2})/g);
  return matches && matches.length > 1 ? matches[1] : 'data volta';
}

function extrairValor(texto) {
  const match = texto.match(/R\$\s*[\d.,]+/);
  return match ? match[0] : 'R$ valor';
}

function extrairBagagem(texto) {
  if (texto.toLowerCase().includes('bagagem despachada')) {
    return 'Mala de mão + bagagem despachada incluída';
  }
  return 'Só mala de mão incluída';
}

function extrairReembolso(texto) {
  if (texto.toLowerCase().includes('reembolsável')) {
    return 'Reembolsável conforme regras do bilhete';
  }
  return 'Não reembolsável';
}

function extrairParcelamento(texto) {
  const match = texto.match(/(\d+)x.*?(\d+[.,]\d+)/);
  if (match) {
    return `${match[1]}x de R$ ${match[2]} sem juros`;
  }
  return '10x sem juros no cartão';
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 ÚNICA (CORREÇÃO CRÍTICA)
// ================================================================================

console.log("✅ Templates v7.7 carregado:");
console.log(`📋 ${Object.keys(TEMPLATES_MANUAIS).length} templates específicos`);
console.log("🔧 Sistema completo de formatação");
console.log("🎯 Detecção automática de layouts");
console.log("📱 Formatação otimizada para WhatsApp");
console.log("🏨 Geração de rankings de hotéis");
console.log("💡 Geração de dicas de viagem");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - SEM DUPLICATAS");

// EXPORTAÇÃO ÚNICA E LIMPA
export {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  gerarRankingHoteis,
  gerarDicasViagem,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO
};

// EXPORTAÇÃO DEFAULT PARA MÁXIMA COMPATIBILIDADE
export default {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  gerarRankingHoteis,
  gerarDicasViagem,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO
};

console.log("🚀 Sistema de Templates v7.7 - EXPORTAÇÕES CORRIGIDAS!");
