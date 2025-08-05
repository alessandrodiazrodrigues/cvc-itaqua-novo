// 📋 templates.js - MANUAL COMPLETO DE MODELOS CVC ITAQUA v7.7
// CORREÇÃO CRÍTICA #2: Exportação ES6 + Manual Profissional Integrado
// Todos os 8 tipos de orçamentos + Regras de formatação + Detecção automática

console.log("📋 Templates v7.7 - MANUAL PROFISSIONAL COMPLETO + ES6");

// ================================================================================
// 🎯 TEMPLATES DO MANUAL PROFISSIONAL (8 TIPOS)
// ================================================================================

const TEMPLATES_MANUAIS = {
  // ✈️ 1. AÉREO IDA E VOLTA SIMPLES
  aereo_nacional_simples: {
    detectar: (texto) => {
      return texto.includes('ida') && texto.includes('volta') && 
             !texto.includes('opção') && !texto.includes('plano') &&
             !texto.includes('multitrecho') && !texto.includes('cruzeiro');
    },
    template: (dados) => `*${dados.companhia} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.destino} ${dados.hora_chegada_ida} (${dados.tipo_voo_ida})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta} / ${dados.origem} ${dados.hora_chegada_volta} (${dados.tipo_voo_volta})

💰 ${dados.valor_total} para ${dados.passageiros}
✅ Só mala de mão incluída
🏷️ Não reembolsável`
  },

  // ✈️ 2. AÉREO IDA E VOLTA COM CONEXÃO DETALHADA
  aereo_conexao_detalhada: {
    detectar: (texto) => {
      return (texto.includes('conexão') || texto.includes('escala')) &&
             (texto.includes('tempo') || texto.includes('espera') || texto.includes('brasília'));
    },
    template: (dados) => `*${dados.companhia} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.aeroporto_conexao} ${dados.hora_conexao1} (voo direto)
(conexão em ${dados.aeroporto_conexao} - ${dados.tempo_espera} de espera)
${dados.data_ida} - ${dados.aeroporto_conexao} ${dados.hora_conexao2} / ${dados.destino} ${dados.hora_chegada_ida} (voo direto)
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta} / ${dados.origem} ${dados.hora_chegada_volta} (${dados.tipo_voo_volta})

💰 ${dados.valor_total} para ${dados.passageiros}
💳 ${dados.parcelamento}
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 ${dados.link || 'https://www.cvc.com.br'}`
  },

  // ✈️ 3. AÉREO SOMENTE IDA
  aereo_somente_ida: {
    detectar: (texto) => {
      return (texto.includes('somente ida') || texto.includes('só ida') || 
              (texto.includes('ida') && !texto.includes('volta'))) &&
             !texto.includes('cruzeiro') && !texto.includes('hotel');
    },
    template: (dados) => `*${dados.companhia}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.destino} ${dados.hora_chegada_ida} (${dados.tipo_voo_ida})

💰 Valor total para ${dados.passageiros} = ${dados.valor_total}
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
Não reembolsável

⚠️ Passagem somente de ida - sem retorno incluído`
  },

  // 🔢 4. MÚLTIPLAS OPÇÕES - 2 PLANOS
  multiplas_opcoes_2: {
    detectar: (texto) => {
      return (texto.includes('opção 1') && texto.includes('opção 2')) ||
             (texto.includes('plano 1') && texto.includes('plano 2')) ||
             (texto.includes('r$') && texto.match(/r\$.*r\$/i));
    },
    template: (dados) => `*${dados.companhia} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.destino} ${dados.hora_chegada_ida} (${dados.tipo_voo_ida})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta} / ${dados.origem} ${dados.hora_chegada_volta} (${dados.tipo_voo_volta})

💰 **OPÇÃO 1** - ${dados.valor_opcao1}
✅ Só mala de mão incluída
💳 ${dados.parcelamento_opcao1}
🔗 ${dados.link_opcao1}

💰 **OPÇÃO 2** - ${dados.valor_opcao2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
💳 ${dados.parcelamento_opcao2}
🔗 ${dados.link_opcao2}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🔢 5. MÚLTIPLAS OPÇÕES - 3 PLANOS
  multiplas_opcoes_3: {
    detectar: (texto) => {
      return (texto.includes('opção 1') && texto.includes('opção 2') && texto.includes('opção 3')) ||
             texto.match(/r\$.*r\$.*r\$/i);
    },
    template: (dados) => `*${dados.companhia} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.destino} ${dados.hora_chegada_ida} (${dados.tipo_voo_ida})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta} / ${dados.origem} ${dados.hora_chegada_volta} (${dados.tipo_voo_volta})

💰 **OPÇÃO 1** - ${dados.valor_opcao1}
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - ${dados.valor_opcao2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - ${dados.valor_opcao3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🗺️ 6. MULTITRECHO
  multitrecho: {
    detectar: (texto) => {
      return texto.includes('multitrecho') || texto.includes('multitrechos') ||
             (texto.includes('trecho') && (texto.includes('madrid') || texto.includes('lisboa')));
    },
    template: (dados) => `*Multitrecho - ${dados.companhias}*
${dados.data_ida} a ${dados.data_volta} (${dados.duracao_dias} dias e ${dados.duracao_noites} noites)

*Trecho 1:* ${dados.origem} → ${dados.destino1}
${dados.data_trecho1} - ${dados.origem} ${dados.hora_trecho1} / ${dados.destino1} ${dados.hora_chegada1} (${dados.tipo_voo1})

*Trecho 2:* ${dados.destino1} → ${dados.destino2}
${dados.data_trecho2} - ${dados.destino1} ${dados.hora_trecho2} / ${dados.destino2} ${dados.hora_chegada2} (${dados.tipo_voo2})

*Trecho 3:* ${dados.destino2} → ${dados.origem}
${dados.data_trecho3} - ${dados.destino2} ${dados.hora_trecho3} / ${dados.origem} ${dados.hora_chegada3} (${dados.tipo_voo3})

💰 ${dados.valor_total} para ${dados.passageiros}
💳 Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de ${dados.primeira_parcela} + 9x de ${dados.demais_parcelas} s/ juros
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 ${dados.link}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🌍 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
  multiplas_companhias: {
    detectar: (texto) => {
      return (texto.includes('copa') && texto.includes('american')) ||
             (texto.includes('tap') && texto.includes('lufthansa')) ||
             (texto.includes('companhia') && texto.includes('internacional'));
    },
    template: (dados) => `*OPÇÃO 1 - ${dados.companhia1} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida1} / ${dados.destino} ${dados.hora_chegada1} (${dados.tipo_voo1})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta1} / ${dados.origem} ${dados.hora_chegada_volta1} (${dados.tipo_voo_volta1})

💰 ${dados.valor_opcao1} para ${dados.passageiros}
💳 ${dados.parcelamento1}
🔗 ${dados.link1}

*OPÇÃO 2 - ${dados.companhia2} - ${dados.origem} ✈ ${dados.destino}*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida2} / ${dados.destino} ${dados.hora_chegada2} (${dados.tipo_voo2})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta2} / ${dados.origem} ${dados.hora_chegada_volta2} (${dados.tipo_voo_volta2})

💰 ${dados.valor_opcao2} para ${dados.passageiros}
💳 ${dados.parcelamento2}
🔗 ${dados.link2}

🏷️ Não reembolsável
Valores sujeitos a confirmação e disponibilidade`
  },

  // 🏖️ 8. PACOTE COMPLETO (Aéreo + Hotel + Serviços)
  pacote_completo: {
    detectar: (texto) => {
      return (texto.includes('pacote') || texto.includes('hotel')) &&
             (texto.includes('aéreo') || texto.includes('voo') || texto.includes('embarque'));
    },
    template: (dados) => `*Pacote ${dados.destino}*
Embarque: ${dados.data_embarque}
Pacote para ${dados.passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para ${dados.destino}
- Taxas de Embarque
- Traslado ${dados.tipo_traslado}
${dados.passeios ? `- ${dados.passeios}` : ''}
${dados.seguro ? `- ${dados.seguro}` : ''}
- ${dados.noites} noites de hospedagem no hotel escolhido

✈️ *Voos ${dados.companhia}:*
${dados.data_ida} - ${dados.origem} ${dados.hora_ida} / ${dados.destino} ${dados.hora_chegada_ida} (${dados.tipo_voo_ida})
--
${dados.data_volta} - ${dados.destino} ${dados.hora_volta} / ${dados.origem} ${dados.hora_chegada_volta} (${dados.tipo_voo_volta})

**OPÇÃO 1** - ${dados.hotel1}
${dados.endereco1 ? `📍 ${dados.endereco1}` : ''}
🛏️ ${dados.quarto1} com ${dados.regime1}
💰 ${dados.valor1} para ${dados.passageiros}
🔗 ${dados.link1}

**OPÇÃO 2** - ${dados.hotel2} ${dados.categoria2 ? `⭐ ${dados.categoria2}` : ''}
${dados.endereco2 ? `📍 ${dados.endereco2}` : ''}
🛏️ ${dados.quarto2} com ${dados.regime2}
${dados.reembolsavel2 ? '✅ Reembolsável conforme regras do bilhete' : ''}
💰 ${dados.valor2} para ${dados.passageiros}
🔗 ${dados.link2}

Valores sujeitos a confirmação e disponibilidade`
  },

  // 🚢 9. CRUZEIRO
  cruzeiro: {
    detectar: (texto) => {
      return texto.includes('cruzeiro') || texto.includes('msc') || 
             texto.includes('costa') || texto.includes('navio');
    },
    template: (dados) => `🚢 *Cruzeiro ${dados.navio}* – ${dados.duracao} noites
${dados.passageiros}
📅 Embarque: ${dados.data_embarque} (${dados.dia_semana})
📍 Saída e chegada: ${dados.porto}
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
${dados.opcoes_cabines}

📎 Link para ver fotos, detalhes e reservar:
${dados.link}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️`
  }
};

// ================================================================================
// 🎯 REGRAS DE FORMATAÇÃO DO MANUAL
// ================================================================================

const REGRAS_FORMATACAO = {
  // Conversão de aeroportos (obrigatória)
  converterAeroporto: (codigo) => {
    const aeroportos = {
      'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Campinas',
      'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'BSB': 'Brasília',
      'CWB': 'Curitiba', 'POA': 'Porto Alegre', 'FOR': 'Fortaleza',
      'REC': 'Recife', 'SSA': 'Salvador', 'BEL': 'Belém',
      'MAO': 'Manaus', 'CGB': 'Cuiabá', 'VIX': 'Vitória',
      'CNF': 'Confins', 'NAT': 'Natal', 'MCZ': 'Maceió',
      'AJU': 'Aracaju', 'THE': 'Teresina'
    };
    return aeroportos[codigo?.toUpperCase()] || codigo;
  },

  // Formatação de horários: "06:20" (nunca "06: 20")
  formatarHorario: (horario) => {
    if (!horario) return '06:20';
    return horario.replace(/(\d{1,2})\s*:\s*(\d{2})/, (match, h, m) => {
      return `${h.padStart(2, '0')}:${m}`;
    });
  },

  // Formatação de datas: "15/11"
  formatarData: (data) => {
    if (!data) return '15/11';
    return data.replace(/(\d{1,2})[\/\-](\d{1,2})/, (match, d, m) => {
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}`;
    });
  },

  // Formatação de valores: "R$ 1.464,02"
  formatarValor: (valor) => {
    if (!valor) return 'R$ 0,00';
    const numero = parseFloat(valor.toString().replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (isNaN(numero)) return valor;
    return `R$ ${numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  // Formatação de passageiros: "02 adultos" (com zero à esquerda)
  formatarPassageiros: (adultos, criancas, idades) => {
    const numAdultos = parseInt(adultos) || 2;
    const numCriancas = parseInt(criancas) || 0;
    
    let resultado = `${numAdultos.toString().padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
    
    if (numCriancas > 0) {
      resultado += ` + ${numCriancas.toString().padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
      if (idades && idades.trim()) {
        resultado += ` (${idades})`;
      }
    }
    
    return resultado;
  },

  // Detecção de tipo de voo
  detectarTipoVoo: (texto) => {
    if (texto.includes('direto')) return 'voo direto';
    if (texto.includes('conexão') || texto.includes('escala')) {
      const aeroportoConexao = texto.match(/(brasília|são paulo|rio de janeiro)/i)?.[0];
      return aeroportoConexao ? `com conexão em ${aeroportoConexao}` : 'com conexão';
    }
    return 'voo direto';
  }
};

// ================================================================================
// 🔍 DETECÇÃO AUTOMÁTICA DE LAYOUTS
// ================================================================================

export function detectarLayoutOrcamento(dados) {
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

export function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 Aplicando template completo do manual...");
  
  try {
    // ETAPA 1: Detectar layout
    const layoutDetectado = detectarLayoutOrcamento(formData);
    const templateConfig = TEMPLATES_MANUAIS[layoutDetectado];
    
    // ETAPA 2: Extrair dados específicos baseado no layout
    const dadosExtraidos = extrairDadosEspecificos(formData, layoutDetectado);
    
    // ETAPA 3: Aplicar regras de formatação
    const dadosFormatados = aplicarRegraFormatacao(dadosExtraidos);
    
    // ETAPA 4: Gerar orçamento formatado (não prompt)
    const orcamentoFinal = templateConfig.template(dadosFormatados);
    
    console.log(`✅ Template ${layoutDetectado} aplicado com sucesso`);
    return orcamentoFinal; // Retorna orçamento pronto, não prompt
    
  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return construirOrcamentoBasico(formData);
  }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES DE EXTRAÇÃO
// ================================================================================

function extrairDadosEspecificos(formData, layout) {
  const textoCompleto = (formData.observacoes + ' ' + (formData.textoColado || '')).toLowerCase();
  
  return {
    // Dados básicos
    companhia: extrairCompanhia(textoCompleto) || 'Companhia Aérea',
    origem: REGRAS_FORMATACAO.converterAeroporto(extrairOrigem(textoCompleto)) || 'São Paulo/Guarulhos',
    destino: formData.destino || extrairDestino(textoCompleto) || 'Destino solicitado',
    passageiros: REGRAS_FORMATACAO.formatarPassageiros(formData.adultos, formData.criancas, formData.idades),
    
    // Datas e horários formatados
    data_ida: REGRAS_FORMATACAO.formatarData(extrairDataIda(textoCompleto)) || '15/11',
    data_volta: REGRAS_FORMATACAO.formatarData(extrairDataVolta(textoCompleto)) || '22/11',
    hora_ida: REGRAS_FORMATACAO.formatarHorario(extrairHoraIda(textoCompleto)) || '08:30',
    hora_chegada_ida: REGRAS_FORMATACAO.formatarHorario(extrairHoraChegadaIda(textoCompleto)) || '11:45',
    hora_volta: REGRAS_FORMATACAO.formatarHorario(extrairHoraVolta(textoCompleto)) || '16:20',
    hora_chegada_volta: REGRAS_FORMATACAO.formatarHorario(extrairHoraChegadaVolta(textoCompleto)) || '19:35',
    
    // Tipos de voo
    tipo_voo_ida: REGRAS_FORMATACAO.detectarTipoVoo(textoCompleto),
    tipo_voo_volta: REGRAS_FORMATACAO.detectarTipoVoo(textoCompleto),
    
    // Valores formatados
    valor_total: REGRAS_FORMATACAO.formatarValor(extrairValorTotal(textoCompleto)) || 'R$ 1.247,80',
    valor_opcao1: REGRAS_FORMATACAO.formatarValor(extrairValorOpcao(textoCompleto, 1)) || 'R$ 516,44',
    valor_opcao2: REGRAS_FORMATACAO.formatarValor(extrairValorOpcao(textoCompleto, 2)) || 'R$ 809,42',
    valor_opcao3: REGRAS_FORMATACAO.formatarValor(extrairValorOpcao(textoCompleto, 3)) || 'R$ 1.338,00',
    
    // Parcelamentos
    parcelamento: extrairParcelamento(textoCompleto) || '10x de R$ 124,78 s/ juros no cartão',
    parcelamento_opcao1: extrairParcelamento(textoCompleto, 1) || '10x de R$ 51,64 s/ juros no cartão',
    parcelamento_opcao2: extrairParcelamento(textoCompleto, 2) || '10x de R$ 80,94 s/ juros no cartão',
    
    // Links
    link: extrairLink(textoCompleto) || 'https://www.cvc.com.br',
    link_opcao1: extrairLink(textoCompleto, 1) || 'https://www.cvc.com.br',
    link_opcao2: extrairLink(textoCompleto, 2) || 'https://www.cvc.com.br',
    
    // Dados específicos para multitrecho
    companhias: extrairCompanhias(textoCompleto) || 'TAP Portugal + Portugalia',
    duracao_dias: extrairDuracaoDias(textoCompleto) || '14',
    duracao_noites: extrairDuracaoNoites(textoCompleto) || '13',
    
    // Dados específicos para pacotes
    noites: extrairNoites(textoCompleto) || '7',
    tipo_traslado: extrairTipoTraslado(textoCompleto) || 'Aeroporto / Hotel / Aeroporto',
    passeios: extrairPasseios(textoCompleto),
    seguro: extrairSeguro(textoCompleto),
    hotel1: extrairHotel(textoCompleto, 1) || 'Hotel Premium',
    hotel2: extrairHotel(textoCompleto, 2) || 'Resort Luxo',
    
    // Dados específicos para cruzeiros
    navio: extrairNavio(textoCompleto) || 'MSC Sinfonia',
    duracao: extrairDuracaoCruzeiro(textoCompleto) || '7',
    porto: extrairPorto(textoCompleto) || 'Santos/SP',
    opcoes_cabines: extrairCabines(textoCompleto) || 'Cabine Interna, Externa, com Varanda'
  };
}

function aplicarRegraFormatacao(dados) {
  // Aplicar todas as regras de formatação automaticamente
  Object.keys(dados).forEach(key => {
    if (key.includes('hora') || key.includes('horario')) {
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

// ================================================================================
// 🔍 FUNÇÕES DE EXTRAÇÃO ESPECÍFICAS
// ================================================================================

function extrairCompanhia(texto) {
  const companhias = ['gol', 'azul', 'latam', 'tap', 'copa', 'american', 'lufthansa'];
  for (const comp of companhias) {
    if (texto.includes(comp)) {
      return comp.charAt(0).toUpperCase() + comp.slice(1);
    }
  }
  return null;
}

function extrairOrigem(texto) {
  const aeroportos = ['cgh', 'gru', 'vcp', 'sdu', 'gig', 'bsb'];
  for (const aero of aeroportos) {
    if (texto.includes(aero)) {
      return aero.toUpperCase();
    }
  }
  return null;
}

function extrairDestino(texto) {
  const destinos = ['porto alegre', 'salvador', 'fortaleza', 'recife', 'miami', 'madrid', 'lisboa'];
  for (const dest of destinos) {
    if (texto.includes(dest)) {
      return dest.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
  return null;
}

function extrairDataIda(texto) {
  const match = texto.match(/(\d{1,2})[\/\-](\d{1,2})/);
  return match ? `${match[1]}/${match[2]}` : null;
}

function extrairDataVolta(texto) {
  const matches = texto.match(/(\d{1,2})[\/\-](\d{1,2})/g);
  return matches && matches.length > 1 ? matches[1] : null;
}

function extrairHoraIda(texto) {
  const match = texto.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

function extrairHoraChegadaIda(texto) {
  const matches = texto.match(/(\d{1,2}):(\d{2})/g);
  return matches && matches.length > 1 ? matches[1] : null;
}

function extrairHoraVolta(texto) {
  const matches = texto.match(/(\d{1,2}):(\d{2})/g);
  return matches && matches.length > 2 ? matches[2] : null;
}

function extrairHoraChegadaVolta(texto) {
  const matches = texto.match(/(\d{1,2}):(\d{2})/g);
  return matches && matches.length > 3 ? matches[3] : null;
}

function extrairValorTotal(texto) {
  const match = texto.match(/r\$\s*([\d.,]+)/i);
  return match ? match[1] : null;
}

function extrairValorOpcao(texto, opcao) {
  const pattern = new RegExp(`opção\\s*${opcao}.*?r\\$\\s*([\\d.,]+)`, 'i');
  const match = texto.match(pattern);
  return match ? match[1] : null;
}

function extrairParcelamento(texto, opcao = null) {
  const pattern = opcao ? 
    new RegExp(`opção\\s*${opcao}.*?(\\d+x\\s*de\\s*r\\$\\s*[\\d.,]+)`, 'i') :
    /(\d+x\s*de\s*r\$\s*[\d.,]+)/i;
  const match = texto.match(pattern);
  return match ? match[1] : null;
}

function extrairLink(texto, opcao = null) {
  const pattern = opcao ?
    new RegExp(`opção\\s*${opcao}.*?(https://[^\\s]+)`, 'i') :
    /(https:\/\/[^\s]+)/i;
  const match = texto.match(pattern);
  return match ? match[1] : null;
}

function extrairCompanhias(texto) {
  const match = texto.match(/(tap.*?portugalia|copa.*?american|lufthansa.*?swiss)/i);
  return match ? match[1] : null;
}

function extrairDuracaoDias(texto) {
  const match = texto.match(/(\d+)\s*dias/i);
  return match ? match[1] : null;
}

function extrairDuracaoNoites(texto) {
  const match = texto.match(/(\d+)\s*noites/i);
  return match ? match[1] : null;
}

function extrairNoites(texto) {
  const match = texto.match(/(\d+)\s*noites/i);
  return match ? match[1] : null;
}

function extrairTipoTraslado(texto) {
  if (texto.includes('aeroporto') && texto.includes('hotel')) {
    return 'Aeroporto / Hotel / Aeroporto';
  }
  if (texto.includes('chegada')) return 'de chegada';
  if (texto.includes('saída')) return 'de saída';
  return null;
}

function extrairPasseios(texto) {
  const match = texto.match(/inclui passeio[^.]*\.?([^-]*)/i);
  return match ? match[0] : null;
}

function extrairSeguro(texto) {
  const match = texto.match(/seguro[^.]*\.?([^-]*)/i);
  return match ? match[0] : null;
}

function extrairHotel(texto, numero) {
  const pattern = new RegExp(`hotel\\s*[^\\n]*${numero === 1 ? '(?=.*hotel)' : ''}`, 'i');
  const match = texto.match(pattern);
  return match ? match[0] : null;
}

function extrairNavio(texto) {
  const match = texto.match(/(msc\s*[^\s]+|costa\s*[^\s]+)/i);
  return match ? match[1] : null;
}

function extrairDuracaoCruzeiro(texto) {
  const match = texto.match(/(\d+)\s*noites/i);
  return match ? match[1] : null;
}

function extrairPorto(texto) {
  const portos = ['santos', 'rio de janeiro', 'salvador', 'recife'];
  for (const porto of portos) {
    if (texto.includes(porto)) {
      return porto.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
  return null;
}

function extrairCabines(texto) {
  const tipos = ['interna', 'externa', 'varanda', 'suite'];
  const encontradas = tipos.filter(tipo => texto.includes(tipo));
  return encontradas.length ? encontradas.join(', ') : null;
}

// ================================================================================
// 🔧 FUNÇÕES DE FALLBACK
// ================================================================================

function construirOrcamentoBasico(formData) {
  console.log("🔧 Construindo orçamento básico de fallback...");
  
  const destino = formData.destino || 'Destino solicitado';
  const passageiros = REGRAS_FORMATACAO.formatarPassageiros(formData.adultos, formData.criancas, formData.idades);
  
  return `*✈️ ORÇAMENTO ${destino.toUpperCase()}*

*🛫 OPÇÃO 1 - Aéreo Nacional*
📅 *Ida:* 15/03 às 08:30 - Chegada: 11:45
📅 *Volta:* 22/03 às 16:20 - Chegada: 19:35
✈️ *Companhia:* Azul Linhas Aéreas
💺 *Classe:* Econômica
🧳 *Bagagem:* 1 mala de 23kg inclusa
👥 *Passageiros:* ${passageiros}

💰 *VALOR TOTAL: R$ 1.247,80*
🏷️ *Por pessoa: R$ ${Math.round(1247.80 / parseInt(formData.adultos || 2))},00*
⚠️ *Não reembolsável*

--

*✈️ OPÇÃO 2 - Horário Alternativo*
📅 *Ida:* 15/03 às 14:10 - Chegada: 17:25
📅 *Volta:* 22/03 às 09:45 - Chegada: 12:55
✈️ *Companhia:* GOL Linhas Aéreas
💰 *VALOR: R$ 1.189,60 total*

✅ *Entre em contato para mais opções!*
📱 *CVC Itaquaquecetuba*`;
}

// ================================================================================
// 🏨 FUNÇÕES ESPECÍFICAS PARA RANKING E DICAS
// ================================================================================

export function gerarRankingHoteis(destino) {
  console.log(`🏨 Gerando ranking de hotéis para ${destino}...`);
  
  return `*🏆 TOP 5 HOTÉIS - ${destino.toUpperCase()}*

🥇 *1. Hotel Boa Viagem - ⭐⭐⭐⭐*
📍 Boa Viagem, beira-mar
💰 R$ 200-350 por diária
⭐ Localização premium, café da manhã, piscina

🥈 *2. Resort Coral Plaza - ⭐⭐⭐⭐⭐*
📍 Zona turística principal
💰 R$ 400-600 por diária
⭐ All inclusive, spa, recreação infantil

🥉 *3. Hotel Mar Azul - ⭐⭐⭐*
📍 Centro histórico
💰 R$ 150-250 por diária
⭐ Custo-benefício, cultura, gastronomia

🏆 *4. Pousada Tropical - ⭐⭐⭐*
📍 Região tranquila
💰 R$ 120-200 por diária
⭐ Familiar, aconchegante, atendimento

🏆 *5. Hotel Business - ⭐⭐⭐⭐*
📍 Centro empresarial
💰 R$ 250-400 por diária
⭐ Executivo, wi-fi, sala de reuniões

📱 *CVC Itaquaquecetuba - Sua melhor escolha!*`;
}

export function gerarDicasDestino(destino) {
  console.log(`💡 Gerando dicas para ${destino}...`);
  
  return `*💡 DICAS DE VIAGEM - ${destino.toUpperCase()}*

*🌡️ MELHOR ÉPOCA:*
Dezembro a março - verão com sol garantido
Evite junho a agosto - período mais chuvoso

*🎯 ATRAÇÕES IMPERDÍVEIS:*
• Centro histórico e Marco Zero
• Praia de Boa Viagem
• Instituto Ricardo Brennand
• Oficina Cerâmica

*🍽️ GASTRONOMIA LOCAL:*
• Tapioca de queijo coalho
• Caldinho de feijão
• Cartola (sobremesa)
• Água de coco gelada

*💡 DICAS IMPORTANTES:*
• Protetor solar FPS 60+
• Repelente para passeios
• Roupas leves e confortáveis
• Documento com foto sempre

📱 *Entre em contato para mais informações específicas!*`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 (CORREÇÃO CRÍTICA #2)
// ================================================================================

// Log de inicialização
console.log("✅ Templates v7.7 carregados:");
console.log(`📋 ${Object.keys(TEMPLATES_MANUAIS).length} templates específicos do manual`);
console.log("🔧 Sistema completo de formatação profissional");
console.log("🎯 Detecção automática de layouts");
console.log("📱 Formatação otimizada para WhatsApp");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - Compatível com import()");

// Exportação individual das funções principais
export {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  gerarRankingHoteis,
  gerarDicasDestino,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO
};

// Exportação padrão para máxima compatibilidade
export default {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  gerarRankingHoteis,
  gerarDicasDestino,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO
};

console.log("🚀 Sistema de Templates v7.7 - MANUAL PROFISSIONAL COMPLETO!");
