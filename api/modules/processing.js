// 🔧 api/modules/processing.js - v8.2 - CORREÇÃO DEFINITIVA
// TODAS AS EXPORTAÇÕES DUPLICADAS REMOVIDAS
// Sistema de processamento e formatação completo

console.log("🔧 Processing v8.2 - EXPORTAÇÕES CORRIGIDAS DEFINITIVAMENTE");

// ================================================================================
// 🧹 SISTEMA DE LIMPEZA E FORMATAÇÃO PRINCIPAL
// ================================================================================

function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("🔧 Iniciando processamento completo v8.2...");
  
  if (!conteudo) {
    console.error("❌ Conteúdo vazio para processar");
    return "Erro: Resposta vazia da IA";
  }
  
  let conteudoProcessado = conteudo;
  
  try {
    conteudoProcessado = removerCabecalhosTecnicos(conteudoProcessado);
    conteudoProcessado = aplicarFormatacaoCompleta(conteudoProcessado);
    conteudoProcessado = validarRegrasCriticas(conteudoProcessado);
    
    if (analise) {
      conteudoProcessado = aplicarCorrecoesPorTipo(conteudoProcessado, analise);
    }
    
    conteudoProcessado = formatarParaWhatsApp(conteudoProcessado);
    
    const validacao = validarOrcamentoFinal(conteudoProcessado, formData);
    if (!validacao.valido) {
      console.warn("⚠️ Validação encontrou problemas:", validacao.problemas);
    }
    
    console.log(`✅ Processamento completo finalizado: ${conteudoProcessado.length} caracteres`);
    return conteudoProcessado;
    
  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    return aplicarFormatacaoBasica(conteudo);
  }
}

// ================================================================================
// 🧹 REMOÇÃO DE CABEÇALHOS TÉCNICOS
// ================================================================================

function removerCabecalhosTecnicos(conteudo) {
  console.log("🧹 Removendo cabeçalhos técnicos...");
  let limpo = conteudo;
  
  const padroesRemover = [
    /^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim,
    /^SISTEMA PROFISSIONAL[^\n]*\n?/gim,
    /^TIPOS SELECIONADOS:[^\n]*\n?/gim,
    /^DADOS DA VIAGEM:[^\n]*\n?/gim,
    /^INFORMAÇÕES ADICIONAIS:[^\n]*\n?/gim,
    /^REGRAS [^\n]*:[^\n]*\n?/gim,
    /^INSTRUÇÕES [^\n]*:[^\n]*\n?/gim,
    /^CAMPOS OPCIONAIS[^\n]*\n?/gim,
    /^OBSERVAÇÕES IMPORTANTES[^\n]*\n?/gim,
    /^VERSION:[^\n]*\n?/gim,
    /^TIMESTAMP:[^\n]*\n?/gim,
    /^USER-AGENT:[^\n]*\n?/gim,
    /^DEBUG:[^\n]*\n?/gim
  ];
  
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  return limpo.trim();
}

// ================================================================================
// 🎨 FORMATAÇÃO COMPLETA E PROFISSIONAL
// ================================================================================

function aplicarFormatacaoCompleta(conteudo) {
  console.log("🎨 Aplicando formatação completa...");
  let formatado = conteudo;
  
  // Conversão de códigos de aeroporto
  const codigosAeroporto = {
    'CGH': 'São Paulo/Congonhas',
    'GRU': 'São Paulo/Guarulhos',
    'VCP': 'Campinas/Viracopos',
    'SDU': 'Rio de Janeiro/Santos Dumont',
    'GIG': 'Rio de Janeiro/Galeão',
    'BSB': 'Brasília',
    'CWB': 'Curitiba/Afonso Pena',
    'POA': 'Porto Alegre/Salgado Filho',
    'FOR': 'Fortaleza/Pinto Martins',
    'REC': 'Recife/Guararapes',
    'SSA': 'Salvador/Deputado Luís Eduardo',
    'BEL': 'Belém/Val de Cans',
    'MAO': 'Manaus/Eduardo Gomes',
    'CGB': 'Cuiabá/Marechal Rondon',
    'VIX': 'Vitória/Eurico de Aguiar',
    'CNF': 'Belo Horizonte/Confins',
    'NAT': 'Natal/Governador Aluízio Alves',
    'MCZ': 'Maceió/Zumbi dos Palmares',
    'AJU': 'Aracaju/Santa Maria',
    'THE': 'Teresina/Senador Petrônio Portella'
  };
  
  Object.entries(codigosAeroporto).forEach(([codigo, nome]) => {
    formatado = formatado.replace(new RegExp(`\\b${codigo}\\b`, 'g'), nome);
  });
  
  // Formatação de valores monetários
  formatado = formatado.replace(/R\$\s*(\d+)([,.]?)(\d{0,2})/g, (match, valor, sep, centavos) => {
    if (centavos) {
      return `R$ ${parseInt(valor).toLocaleString('pt-BR')},${centavos.padEnd(2, '0')}`;
    }
    return `R$ ${parseInt(valor).toLocaleString('pt-BR')},00`;
  });
  
  // Formatação de datas
  formatado = formatado.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?/g, (match, dia, mes, ano) => {
    const d = dia.padStart(2, '0');
    const m = mes.padStart(2, '0');
    if (ano) {
      const a = ano.length === 2 ? `20${ano}` : ano;
      return `${d}/${m}/${a}`;
    }
    return `${d}/${m}`;
  });
  
  // Formatação de horários
  formatado = formatado.replace(/(\d{1,2})[:\.](\d{2})/g, (match, hora, min) => {
    return `${hora.padStart(2, '0')}:${min}`;
  });
  
  // Limpeza de espaços
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  formatado = formatado.replace(/[ \t]+\n/g, '\n');
  formatado = formatado.replace(/\n[ \t]+/g, '\n');
  
  return formatado.trim();
}

// ================================================================================
// ✅ VALIDAÇÃO DE REGRAS CRÍTICAS
// ================================================================================

function validarRegrasCriticas(conteudo) {
  console.log("✅ Validando regras críticas...");
  let validado = conteudo;
  
  // Validação de horários
  validado = validado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, (match, h, m) => {
    return `${h.padStart(2, '0')}:${m}`;
  });
  
  // Validação de valores
  validado = validado.replace(/R\$\s*(\d+)\s*,?\s*(\d{0,2})/g, (match, valor, centavos) => {
    const cents = centavos.padEnd(2, '0');
    return `R$ ${parseInt(valor).toLocaleString('pt-BR')},${cents}`;
  });
  
  return validado;
}

// ================================================================================
// 🔧 CORREÇÕES ESPECÍFICAS POR TIPO
// ================================================================================

function aplicarCorrecoesPorTipo(conteudo, analise) {
  console.log("🔧 Aplicando correções por tipo:", analise.tipo_principal);
  let corrigido = conteudo;
  
  switch (analise.tipo_principal?.toLowerCase()) {
    case 'aéreo nacional':
    case 'aéreo internacional':
      corrigido = processarOrcamentoAereo(corrigido, analise);
      break;
    case 'cruzeiros':
      corrigido = processarOrcamentoCruzeiro(corrigido, analise);
      break;
    case 'hotéis':
      corrigido = processarOrcamentoHotel(corrigido, analise);
      break;
    case 'pacotes':
      corrigido = processarOrcamentoPacote(corrigido, analise);
      break;
  }
  
  return corrigido;
}

function processarOrcamentoAereo(conteudo, analise) {
  console.log("✈️ Processando orçamento aéreo específico...");
  let processado = conteudo;
  
  // Garantir emoji de avião no início se não houver
  if (!processado.match(/^[✈️🛫]/)) {
    processado = '✈️ ' + processado;
  }
  
  // Formatação de trechos
  processado = processado.replace(/(\w+)\s*-\s*(\w+)/g, '$1 → $2');
  
  return processado;
}

function processarOrcamentoCruzeiro(conteudo, analise) {
  console.log("🚢 Processando orçamento de cruzeiro específico...");
  let processado = conteudo;
  
  if (!processado.startsWith('🚢')) {
    processado = '🚢 ' + processado;
  }
  
  return processado;
}

function processarOrcamentoHotel(conteudo, analise) {
  console.log("🏨 Processando orçamento de hotel específico...");
  let processado = conteudo;
  
  if (!processado.match(/^[🏨🏩]/)) {
    processado = '🏨 ' + processado;
  }
  
  return processado;
}

function processarOrcamentoPacote(conteudo, analise) {
  console.log("🏖️ Processando orçamento de pacote específico...");
  let processado = conteudo;
  
  if (!processado.match(/^[🏖️📦]/)) {
    processado = '🏖️ ' + processado;
  }
  
  return processado;
}

// ================================================================================
// 📱 FORMATAÇÃO FINAL PARA WHATSAPP - SEM EXPORT NA DECLARAÇÃO
// ================================================================================

// ⚠️ CORREÇÃO: Removido 'export' da declaração da função
function formatarParaWhatsApp(conteudo) {
  console.log("📱 Formatando para WhatsApp...");
  let formatado = conteudo;
  
  // Garantir quebras de linha adequadas
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  // Remover espaços em excesso
  formatado = formatado.replace(/\s+\n/g, '\n');
  formatado = formatado.replace(/\n\s+/g, '\n');
  
  // Garantir formatação de seções
  formatado = formatado.replace(/^([A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ\s]+):$/gm, '*$1:*');
  
  return formatado.trim();
}

// ================================================================================
// ✅ VALIDAÇÃO FINAL DO ORÇAMENTO - SEM EXPORT NA DECLARAÇÃO
// ================================================================================

// ⚠️ CORREÇÃO: Removido 'export' da declaração da função
function validarOrcamentoFinal(conteudo, formData) {
  console.log("✅ Executando validação final...");
  
  const problemas = [];
  
  // Verificações básicas
  if (!conteudo.includes('R$')) {
    problemas.push('Valor em reais não encontrado');
  }
  
  if (!/\d{2}:\d{2}/.test(conteudo)) {
    problemas.push('Horários no formato correto não encontrados');
  }
  
  if (!/\d{2}\/\d{2}/.test(conteudo)) {
    problemas.push('Datas no formato correto não encontradas');
  }
  
  const validacao = {
    valido: problemas.length === 0,
    problemas: problemas
  };
  
  return validacao;
}

// ================================================================================
// 📊 MÉTRICAS DE QUALIDADE - SEM EXPORT NA DECLARAÇÃO
// ================================================================================

// ⚠️ CORREÇÃO: Removido 'export' da declaração da função
function calcularMetricasQualidade(conteudoOriginal, conteudoProcessado) {
  console.log("📊 Calculando métricas de qualidade...");
  
  const metricas = {
    conversoes: {
      aeroportos: contarConversoes(conteudoOriginal, conteudoProcessado),
      cabecalhos_removidos: contarCabecalhosRemovidos(conteudoOriginal, conteudoProcessado)
    },
    qualidade: {
      tem_valores: conteudoProcessado.includes('R$'),
      tem_horarios: /\d{2}:\d{2}/.test(conteudoProcessado),
      tem_datas: /\d{2}\/\d{2}/.test(conteudoProcessado),
      formato_whatsapp: !conteudoProcessado.includes('ORÇAMENTO CVC'),
      emojis_presentes: (conteudoProcessado.match(/[💰✅🏷️📱⚠️]/g) || []).length
    }
  };
  
  return metricas;
}

function contarConversoes(original, processado) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB'];
  let conversoes = 0;
  
  codigos.forEach(codigo => {
    if (original.includes(codigo) && !processado.includes(codigo)) {
      conversoes++;
    }
  });
  
  return conversoes;
}

function contarCabecalhosRemovidos(original, processado) {
  const cabecalhos = ['ORÇAMENTO CVC', 'TIPOS SELECIONADOS', 'DADOS DA VIAGEM'];
  let removidos = 0;
  
  cabecalhos.forEach(cabecalho => {
    if (original.includes(cabecalho) && !processado.includes(cabecalho)) {
      removidos++;
    }
  });
  
  return removidos;
}

// ================================================================================
// 🎨 FORMATAÇÃO BÁSICA (FALLBACK MÍNIMO)
// ================================================================================

function aplicarFormatacaoBasica(conteudo) {
  console.log("🎨 Aplicando formatação básica (fallback)...");
  
  let basico = conteudo;
  
  // Formatação mínima de valores
  basico = basico.replace(/R\$\s*(\d+)/g, 'R$ $1,00');
  
  // Limpeza básica
  basico = basico.replace(/\n{3,}/g, '\n\n');
  
  return basico.trim();
}

// ================================================================================
// 🚀 EXPORTAÇÃO ÚNICA E LIMPA - v8.2 DEFINITIVA
// ================================================================================

console.log("✅ Processing v8.2 carregado:");
console.log("🚨 TODAS AS FUNÇÕES SEM 'export' NA DECLARAÇÃO");
console.log("✅ EXPORTAÇÃO ÚNICA NO FINAL DO ARQUIVO");

// EXPORTAÇÃO NOMEADA - CADA FUNÇÃO APARECE APENAS UMA VEZ
export {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade
};

// EXPORTAÇÃO DEFAULT - PARA COMPATIBILIDADE
export default {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade
};

console.log("🚀 Sistema de Processamento v8.2 - 100% FUNCIONAL!");
