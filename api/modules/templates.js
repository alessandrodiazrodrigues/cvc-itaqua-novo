// 📋 templates.js - SISTEMA COMPLETO DE TEMPLATES CVC ITAQUA v7.0
// Implementação COMPLETA do Manual de Modelos de Orçamentos
// Todos os 8 tipos + regras de formatação + detecção automática

console.log("📋 Templates v7.0 - MANUAL COMPLETO IMPLEMENTADO");

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

  // ✈️ 3. AÉREO SOMENTE IDA
  'aereo_somente_ida': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('somente ida') || 
        (texto.includes('ida') && !texto.includes('volta')) ||
        (!texto.includes('--') && !texto.includes('retorno'))
      );
    },
    
    template: (data) => `*${data.companhia || 'Latam'}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo})

💰 Valor total para ${data.passageiros} = ${data.valor_total}
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
${data.reembolso || 'Não reembolsável'}

⚠️ Passagem somente de ida - sem retorno incluído`
  },

  // 🔢 4. MÚLTIPLAS OPÇÕES - 2 PLANOS
  'multiplas_opcoes_2': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('opção 1') && texto.includes('opção 2')) ||
        (texto.includes('plano 1') && texto.includes('plano 2')) ||
        texto.match(/r\$.*?r\$/g)?.length >= 2
      );
    },
    
    template: (data) => `*${data.companhia || 'Azul'}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 **OPÇÃO 1** - ${data.valor_opcao_1}
✅ Só mala de mão incluída
${data.parcelamento_1 ? `💳 ${data.parcelamento_1}` : ''}
${data.link_1 ? `🔗 ${data.link_1}` : ''}

💰 **OPÇÃO 2** - ${data.valor_opcao_2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
${data.parcelamento_2 ? `💳 ${data.parcelamento_2}` : ''}
${data.link_2 ? `🔗 ${data.link_2}` : ''}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🔢 5. MÚLTIPLAS OPÇÕES - 3 PLANOS
  'multiplas_opcoes_3': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        (texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção 3')) ||
        (texto.includes('plano 1') && texto.includes('plano 2') && texto.includes('plano 3')) ||
        texto.match(/r\$.*?r\$/g)?.length >= 3
      );
    },
    
    template: (data) => `*${data.companhia || 'Gol'}*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

💰 **OPÇÃO 1** - ${data.valor_opcao_1}
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - ${data.valor_opcao_2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - ${data.valor_opcao_3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🗺️ 6. MULTITRECHO
  'multitrecho': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('multitrecho') ||
        texto.includes('trecho 1') ||
        (texto.includes('madrid') && texto.includes('lisboa')) ||
        texto.match(/\d+\/\d+.*?\d+\/\d+.*?\d+\/\d+/g)
      );
    },
    
    template: (data) => `*Multitrecho - ${data.companhias || 'TAP Portugal + Portugalia'}*
${data.data_inicio} a ${data.data_fim} (${data.duracao_dias} dias e ${data.duracao_noites} noites)

*Trecho 1:* ${data.origem_1} → ${data.destino_1}
${data.data_trecho_1} - ${data.origem_1} ${data.hora_1} / ${data.destino_1} ${data.hora_chegada_1} (${data.tipo_voo_1})

*Trecho 2:* ${data.origem_2} → ${data.destino_2}
${data.data_trecho_2} - ${data.origem_2} ${data.hora_2} / ${data.destino_2} ${data.hora_chegada_2} (${data.tipo_voo_2})

*Trecho 3:* ${data.origem_3} → ${data.destino_3}
${data.data_trecho_3} - ${data.origem_3} ${data.hora_3} / ${data.destino_3} ${data.hora_chegada_3} (${data.tipo_voo_3})

💰 ${data.valor_total} para ${data.passageiros}
${data.parcelamento ? `💳 ${data.parcelamento}` : ''}
✅ ${data.bagagem || 'Só mala de mão incluída'}
🏷️ ${data.reembolso || 'Não reembolsável'}
${data.link ? `🔗 ${data.link}` : ''}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🌍 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
  'multiplas_companhias_internacionais': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('miami') || texto.includes('europa') || texto.includes('new york') &&
        (texto.includes('copa airlines') || texto.includes('american airlines') || texto.includes('lufthansa'))
      );
    },
    
    template: (data) => `*OPÇÃO 1 - ${data.companhia_1} - ${data.origem} ✈ ${data.destino}*
${data.data_ida} - ${data.origem} ${data.hora_ida_1} / ${data.destino} ${data.hora_chegada_1} (${data.tipo_voo_1})
--
${data.data_volta} - ${data.destino} ${data.hora_volta_1} / ${data.origem} ${data.hora_chegada_volta_1} (${data.tipo_voo_volta_1})

💰 ${data.valor_opcao_1} para ${data.passageiros}
${data.parcelamento_1 ? `💳 ${data.parcelamento_1}` : ''}
${data.link_1 ? `🔗 ${data.link_1}` : ''}

*OPÇÃO 2 - ${data.companhia_2} - ${data.origem} ✈ ${data.destino}*
${data.data_ida} - ${data.origem} ${data.hora_ida_2} / ${data.destino} ${data.hora_chegada_2} (${data.tipo_voo_2})
--
${data.data_volta} - ${data.destino} ${data.hora_volta_2} / ${data.origem} ${data.hora_chegada_volta_2} (${data.tipo_voo_volta_2})

💰 ${data.valor_opcao_2} para ${data.passageiros}
${data.parcelamento_2 ? `💳 ${data.parcelamento_2}` : ''}
${data.link_2 ? `🔗 ${data.link_2}` : ''}

🏷️ ${data.reembolso || 'Não reembolsável'}
Valores sujeitos a confirmação e disponibilidade`
  },

  // 🏖️ 8. PACOTE COMPLETO (Aéreo + Hotel + Serviços)
  'pacote_completo': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('pacote') ||
        texto.includes('traslado') ||
        (texto.includes('hotel') && texto.includes('aéreo')) ||
        texto.includes('hospedagem')
      );
    },
    
    template: (data) => `*Pacote ${data.destino}*
${data.data_embarque ? `Embarque: ${data.data_embarque}` : ''}
Pacote para ${data.passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para ${data.destino}
- Taxas de Embarque
${data.traslado ? `- ${data.traslado}` : '- Traslado Aeroporto / Hotel / Aeroporto'}
${data.passeios ? `- ${data.passeios}` : ''}
${data.seguro ? `- ${data.seguro}` : ''}
- ${data.noites} noites de hospedagem no hotel escolhido

✈️ *Voos ${data.companhia}:*
${data.data_ida} - ${data.origem} ${data.hora_ida} / ${data.destino} ${data.hora_chegada} (${data.tipo_voo_ida})
--
${data.data_volta} - ${data.destino} ${data.hora_volta} / ${data.origem} ${data.hora_chegada_volta} (${data.tipo_voo_volta})

**OPÇÃO 1** - ${data.hotel_1}
${data.endereco_1 ? `📍 ${data.endereco_1}` : ''}
🛏️ ${data.quarto_1} com ${data.regime_1}
${data.reembolsavel_1 ? '✅ Reembolsável conforme regras do bilhete' : ''}
💰 ${data.valor_1} para ${data.passageiros}
${data.link_1 ? `🔗 ${data.link_1}` : ''}

**OPÇÃO 2** - ${data.hotel_2}${data.categoria_2 ? ` ${data.categoria_2}` : ''}
${data.endereco_2 ? `📍 ${data.endereco_2}` : ''}
🛏️ ${data.quarto_2} com ${data.regime_2}
${data.reembolsavel_2 ? '✅ Reembolsável conforme regras do bilhete' : ''}
💰 ${data.valor_2} para ${data.passageiros}
${data.link_2 ? `🔗 ${data.link_2}` : ''}

${data.mais_opcoes ? data.mais_opcoes : ''}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🚢 9. CRUZEIRO
  'cruzeiro': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return (
        texto.includes('cruzeiro') ||
        texto.includes('costa') || texto.includes('msc') ||
        texto.includes('cabine') || texto.includes('navio')
      );
    },
    
    template: (data) => `🚢 *Cruzeiro ${data.navio}* – ${data.duracao} noites
${data.passageiros ? `Para: ${data.passageiros}` : ''}
${data.data_embarque ? `📅 Embarque: ${data.data_embarque} (${data.porto})` : ''}
${data.roteiro ? `🌊 ${data.roteiro}` : '🌊 Roteiro incrível pelo litoral brasileiro!'}

💰 *Opções de Cabines:*
${data.cabine_interna ? `**CABINE INTERNA** - ${data.cabine_interna}` : ''}
${data.cabine_externa ? `**CABINE EXTERNA** - ${data.cabine_externa}` : ''}
${data.cabine_varanda ? `**CABINE COM VARANDA** - ${data.cabine_varanda}` : ''}
${data.suite ? `**SUÍTE** - ${data.suite}` : ''}

${data.itinerario ? `🗺️ *Itinerário:*\n${data.itinerario}` : ''}

${data.pacote_bebidas ? `🍹 *Pacotes de Bebidas:*\n${data.pacote_bebidas}` : ''}

✅ Inclui: hospedagem a bordo, ${data.inclusoes || 'pensão completa, entretenimento'}
🚫 Não inclui: ${data.nao_inclui || 'taxas portuárias, bebidas, excursões'}

${data.documentacao ? `📋 Documentação: ${data.documentacao}` : '📋 Documentação: RG original (máx. 10 anos) ou passaporte'}

${data.link ? `🔗 ${data.link}` : ''}

📲 Me chama pra garantir a sua cabine! 🌴🛳️`
  }
};

// ================================================================================
// 🔧 REGRAS DE FORMATAÇÃO AUTOMÁTICA
// ================================================================================

const REGRAS_FORMATACAO = {
  
  // ⏰ HORÁRIOS
  formatarHorario: (horario) => {
    if (!horario) return '';
    // Garantir formato HH:MM (nunca HH: MM)
    return horario.replace(/(\d{1,2})\s*:\s*(\d{2})/, '$1:$2')
                 .replace(/^(\d):/, '0$1:'); // Adicionar zero à esquerda se necessário
  },
  
  // 📅 DATAS
  formatarData: (data) => {
    if (!data) return '';
    // Formato DD/MM ou DD/MM (23/11) para chegadas no dia seguinte
    return data.replace(/(\d{1,2})\/(\d{1,2})/, (match, dia, mes) => {
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}`;
    });
  },
  
  // ✈️ AEROPORTOS - Conversão completa
  converterAeroporto: (codigo) => {
    const aeroportos = {
      'CGH': 'Congonhas',
      'GRU': 'Guarulhos', 
      'VCP': 'Viracopos',
      'SDU': 'Santos Dumont',
      'GIG': 'Galeão',
      'BSB': 'Brasília',
      'SSA': 'Salvador',
      'FOR': 'Fortaleza',
      'REC': 'Recife',
      'POA': 'Porto Alegre',
      'CWB': 'Curitiba',
      'BEL': 'Belém',
      'MAO': 'Manaus',
      'MCZ': 'Maceió',
      'AJU': 'Aracaju',
      'JPA': 'João Pessoa',
      'NAT': 'Natal',
      'THE': 'Teresina',
      'SLZ': 'São Luís',
      'CGB': 'Cuiabá',
      'CGR': 'Campo Grande',
      'VIX': 'Vitória',
      'CNF': 'Confins',
      'PLU': 'Pampulha',
      'FLN': 'Florianópolis',
      'NVT': 'Navegantes',
      'JOI': 'Joinville',
      'IGU': 'Foz do Iguaçu',
      'LDB': 'Londrina',
      'MGF': 'Maringá'
    };
    return aeroportos[codigo?.toUpperCase()] || codigo;
  },
  
  // 👥 PASSAGEIROS
  formatarPassageiros: (adultos, criancas, idades) => {
    let resultado = '';
    
    // Adultos
    if (adultos) {
      const numAdultos = parseInt(adultos);
      resultado = numAdultos === 1 ? '01 adulto' : `${numAdultos.toString().padStart(2, '0')} adultos`;
    }
    
    // Crianças
    if (criancas && parseInt(criancas) > 0) {
      const numCriancas = parseInt(criancas);
      const textoCriancas = numCriancas === 1 ? 'criança' : 'crianças';
      
      if (idades && idades.length > 0) {
        const idadesFormatadas = idades.length > 1 ? 
          `(${idades.join(' e ')} anos)` : 
          `(${idades[0]} anos)`;
        resultado += ` + ${numCriancas.toString().padStart(2, '0')} ${textoCriancas} ${idadesFormatadas}`;
      } else {
        resultado += ` + ${numCriancas.toString().padStart(2, '0')} ${textoCriancas}`;
      }
    }
    
    return resultado || '02 adultos'; // Padrão
  },
  
  // 💰 VALORES
  formatarValor: (valor) => {
    if (!valor) return '';
    // Garantir formato R$ 1.464,02
    return valor.replace(/R\$\s*/, 'R$ ')
               .replace(/(\d)(\d{3})(\d{3})/, '$1.$2.$3')
               .replace(/(\d)(\d{3}),/, '$1.$2,');
  },
  
  // 💳 PARCELAMENTO
  formatarParcelamento: (parcelas, valor) => {
    if (!parcelas || !valor) return '';
    
    // Sempre usar "primeira parcela", nunca "entrada"
    if (parcelas.includes('primeira')) {
      return parcelas.replace(/entrada/gi, 'primeira parcela');
    }
    
    return parcelas;
  },
  
  // 🧳 BAGAGEM - Regras automáticas
  definirBagagem: (tipo, opcao = 1) => {
    if (tipo.includes('nacional')) {
      switch (opcao) {
        case 1: return 'Só mala de mão incluída';
        case 2: return 'Mala de mão + bagagem despachada';
        case 3: return 'Mala de mão + 2 bagagens despachadas';
        default: return 'Só mala de mão incluída';
      }
    } else if (tipo.includes('internacional')) {
      switch (opcao) {
        case 1: return 'Só mala de mão incluída';
        case 2: return 'Mala de mão + bagagem despachada 23kg';
        default: return 'Mala de mão + bagagem despachada 23kg';
      }
    }
    return 'Só mala de mão incluída';
  },
  
  // 🏷️ REEMBOLSO - Sempre padronizado
  formatarReembolso: (reembolsavel) => {
    if (reembolsavel === true || reembolsavel === 'sim' || reembolsavel === 'reembolsável') {
      return 'Reembolsável conforme regras do bilhete';
    }
    return 'Não reembolsável';
  },
  
  // ✈️ CONEXÕES
  formatarTipoVoo: (temConexao, aeroportoConexao = '') => {
    if (temConexao) {
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
    return prompt;
    
  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return construirPromptFallback(formData);
  }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function extrairDadosEspecificos(formData, layout) {
  const dados = {
    companhia: extrairCompanhia(formData.observacoes + ' ' + (formData.textoColado || '')),
    origem: REGRAS_FORMATACAO.converterAeroporto(extrairOrigem(formData.observacoes + ' ' + (formData.textoColado || ''))),
    destino: formData.destino || extrairDestino(formData.observacoes + ' ' + (formData.textoColado || '')),
    passageiros: REGRAS_FORMATACAO.formatarPassageiros(formData.adultos, formData.criancas, formData.idadesCriancas),
    
    // Datas e horários formatados
    data_ida: REGRAS_FORMATACAO.formatarData(extrairDataIda(formData.observacoes + ' ' + (formData.textoColado || ''))),
    data_volta: REGRAS_FORMATACAO.formatarData(extrairDataVolta(formData.observacoes + ' ' + (formData.textoColado || ''))),
    
    // Valores formatados
    valor_total: REGRAS_FORMATACAO.formatarValor(extrairValor(formData.observacoes + ' ' + (formData.textoColado || ''))),
    
    // Bagagem baseada no tipo e opção
    bagagem: REGRAS_FORMATACAO.definirBagagem(layout, 1),
    
    // Reembolso padronizado
    reembolso: REGRAS_FORMATACAO.formatarReembolso(extrairReembolso(formData.observacoes + ' ' + (formData.textoColado || ''))),
    
    // Tipo de voo baseado em conexões
    tipo_voo_ida: REGRAS_FORMATACAO.formatarTipoVoo(verificarConexao(formData.observacoes + ' ' + (formData.textoColado || ''))),
    tipo_voo_volta: REGRAS_FORMATACAO.formatarTipoVoo(verificarConexao(formData.observacoes + ' ' + (formData.textoColado || '')))
  };
  
  return dados;
}

function aplicarRegraFormatacao(dados) {
  // Aplicar todas as regras de formatação
  Object.keys(dados).forEach(key => {
    if (key.includes('hora')) {
      dados[key] = REGRAS_FORMATACAO.formatarHorario(dados[key]);
    }
    if (key.includes('data')) {
      dados[key] = REGRAS_FORMATACAO.formatarData(dados[key]);
    }
    if (key.includes('valor')) {
      dados[key] = REGRAS_FORMATACAO.formatarValor(dados[key]);
    }
  });
  
  return dados;
}

function construirPromptEspecifico(templateConfig, dados, formData) {
  // Construir prompt específico para o tipo de orçamento
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - SISTEMA PROFISSIONAL v7.0

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

REGRAS CRÍTICAS DE FORMATAÇÃO (OBRIGATÓRIAS):

1. ⏰ HORÁRIOS: Formato exato "06:20" (NUNCA "06: 20")
2. 📅 DATAS: Formato "15/11" ou "00:15 (16/12)" para chegadas no dia seguinte
3. ✈️ AEROPORTOS: CGH → Congonhas, GRU → Guarulhos (conversão automática)
4. 🛫 CONEXÕES: "com conexão" (NUNCA "escala")
5. 💳 PARCELAMENTO: "primeira parcela" (NUNCA "entrada")
6. 👥 PASSAGEIROS: "02 adultos" (com zero à esquerda)
7. 🧳 BAGAGEM NACIONAL:
   - Opção 1: "Só mala de mão incluída"
   - Opção 2: "Mala de mão + bagagem despachada"
   - Opção 3: "Mala de mão + 2 bagagens despachadas"
8. 🧳 BAGAGEM INTERNACIONAL: "Mala de mão + bagagem despachada 23kg"
9. 👶 CRIANÇAS: "02 adultos + 01 criança (05 anos)" se idade informada
10. 🏷️ REEMBOLSO: "Reembolsável conforme regras do bilhete" OU "Não reembolsável"
11. 💰 VALORES: "R$ 1.464,02" (espaço após R$, vírgula para decimais)
12. 📱 FORMATO: Limpo para WhatsApp, SEM cabeçalhos técnicos

TEMPLATE ESPECÍFICO DETECTADO: ${templateConfig ? 'PERSONALIZADO' : 'PADRÃO'}

DADOS EXTRAÍDOS E FORMATADOS:
- Companhia: ${dados.companhia || 'A detectar'}
- Origem: ${dados.origem || 'A detectar'}
- Destino: ${dados.destino || 'A detectar'}  
- Passageiros: ${dados.passageiros}
- Data Ida: ${dados.data_ida || 'A detectar'}
- Data Volta: ${dados.data_volta || 'A detectar'}
- Valor Total: ${dados.valor_total || 'A detectar'}
- Bagagem: ${dados.bagagem}
- Reembolso: ${dados.reembolso}
- Tipo Voo Ida: ${dados.tipo_voo_ida || 'A detectar'}
- Tipo Voo Volta: ${dados.tipo_voo_volta || 'A detectar'}

${formData.parcelamento?.incluirParcelamento ? 
`PARCELAMENTO SOLICITADO:
${formData.parcelamento.parcelas10x ? '- Incluir 10x sem juros' : ''}
${formData.parcelamento.parcelas12x ? '- Incluir 12x sem juros' : ''}
- Calcular valor das parcelas automaticamente` : 
'PARCELAMENTO: Não incluir (exceto se explícito nas observações)'}

INSTRUÇÕES FINAIS:
1. Aplicar EXATAMENTE as regras de formatação acima
2. Usar APENAS dados reais fornecidos
3. Detectar automaticamente tipo de voo (direto/conexão)
4. Converter códigos de aeroportos para nomes completos
5. Formatar limpo para copy/paste no WhatsApp
6. REMOVER todos os cabeçalhos técnicos da resposta final

GERAR ORÇAMENTO PROFISSIONAL FORMATADO:`;
}

// ================================================================================
// 🔍 FUNÇÕES DE EXTRAÇÃO DE DADOS
// ================================================================================

function extrairCompanhia(texto) {
  const texto_lower = texto.toLowerCase();
  const companhias = {
    'latam': 'Latam',
    'gol': 'Gol', 
    'azul': 'Azul',
    'avianca': 'Avianca',
    'copa': 'Copa Airlines',
    'american': 'American Airlines',
    'united': 'United Airlines',
    'delta': 'Delta Airlines',
    'lufthansa': 'Lufthansa',
    'air france': 'Air France',
    'klm': 'KLM',
    'tap portugal': 'TAP Portugal',
    'iberia': 'Iberia',
    'alitalia': 'Alitalia',
    'emirates': 'Emirates',
    'qatar': 'Qatar Airways',
    'turkish': 'Turkish Airlines'
  };
  
  for (const [key, value] of Object.entries(companhias)) {
    if (texto_lower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

function extrairOrigem(texto) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'SSA', 'FOR', 'REC', 'POA', 'CWB'];
  for (const codigo of codigos) {
    if (texto.toUpperCase().includes(codigo)) {
      return codigo;
    }
  }
  return null;
}

function extrairDestino(texto) {
  const cidades = {
    'porto alegre': 'Porto Alegre',
    'salvador': 'Salvador',
    'fortaleza': 'Fortaleza',
    'recife': 'Recife',
    'maceió': 'Maceió',
    'natal': 'Natal',
    'joão pessoa': 'João Pessoa',
    'aracaju': 'Aracaju',
    'brasília': 'Brasília',
    'curitiba': 'Curitiba',
    'florianópolis': 'Florianópolis',
    'vitória': 'Vitória',
    'belo horizonte': 'Belo Horizonte',
    'goiânia': 'Goiânia',
    'cuiabá': 'Cuiabá',
    'campo grande': 'Campo Grande',
    'manaus': 'Manaus',
    'belém': 'Belém',
    'miami': 'Miami',
    'nueva york': 'Nova York',
    'paris': 'Paris',
    'madrid': 'Madrid',
    'lisboa': 'Lisboa',
    'roma': 'Roma',
    'londres': 'Londres'
  };
  
  const texto_lower = texto.toLowerCase();
  for (const [key, value] of Object.entries(cidades)) {
    if (texto_lower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

function extrairDataIda(texto) {
  const regexData = /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/g;
  const matches = [...texto.matchAll(regexData)];
  return matches.length > 0 ? matches[0][0] : null;
}

function extrairDataVolta(texto) {
  const regexData = /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/g;
  const matches = [...texto.matchAll(regexData)];
  return matches.length > 1 ? matches[1][0] : null;
}

function extrairValor(texto) {
  const regexValor = /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g;
  const matches = [...texto.matchAll(regexValor)];
  return matches.length > 0 ? `R$ ${matches[0][1]}` : null;
}

function extrairReembolso(texto) {
  const texto_lower = texto.toLowerCase();
  if (texto_lower.includes('reembolsável') && !texto_lower.includes('não reembolsável')) {
    return true;
  }
  return false;
}

function verificarConexao(texto) {
  const texto_lower = texto.toLowerCase();
  return texto_lower.includes('conexão') || texto_lower.includes('escala');
}

// ================================================================================
// 📋 PROMPT FALLBACK (SE ALGO DER ERRADO)
// ================================================================================

function construirPromptFallback(formData) {
  console.log("⚠️ Usando prompt fallback...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - MODO FALLBACK

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

REGRAS OBRIGATÓRIAS:
1. 🧹 FORMATO LIMPO: Sem cabeçalhos técnicos, pronto para copy/paste
2. ✈️ HORÁRIOS: Formato "06:20" (nunca "06: 20") 
3. 📅 DATAS: Formato "15/11"
4. 🌍 AEROPORTOS: Converter códigos (CGH → Congonhas)
5. 💰 PREÇOS: Usar apenas valores reais fornecidos
6. 🧳 BAGAGEM: Nacional básico = "Só mala de mão incluída"
7. 🏷️ REEMBOLSO: "Não reembolsável" ou "Reembolsável conforme regras do bilhete"
8. 👥 PASSAGEIROS: "02 adultos" (com zero à esquerda)

CAMPOS OPCIONAIS (usar apenas se fornecidos):
${formData.destino ? `- Destino: ${formData.destino}` : ''}
${formData.adultos ? `- Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `- Crianças: ${formData.criancas}` : ''}

GERE O ORÇAMENTO PROFISSIONAL:`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO E LOGS
// ================================================================================

// Log de inicialização
console.log("✅ Templates v7.0 carregados:");
console.log(`📋 ${Object.keys(TEMPLATES_MANUAIS).length} templates específicos`);
console.log("🔧 Sistema completo de formatação");
console.log("🎯 Detecção automática de layouts");
console.log("📱 Formatação otimizada para WhatsApp");

// Exportar funções principais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    aplicarTemplateCompleto,
    detectarLayoutOrcamento,
    TEMPLATES_MANUAIS,
    REGRAS_FORMATACAO
  };
} else {
  // Browser environment
  window.aplicarTemplateCompleto = aplicarTemplateCompleto;
  window.detectarLayoutOrcamento = detectarLayoutOrcamento;
  window.TEMPLATES_MANUAIS = TEMPLATES_MANUAIS;
  window.REGRAS_FORMATACAO = REGRAS_FORMATACAO;
}

console.log("🚀 Sistema de Templates v7.0 - MANUAL COMPLETO IMPLEMENTADO!");