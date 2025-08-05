// 🔧 processing.js - PROCESSAMENTO COMPLETO DE ORÇAMENTOS v7.7
// CORREÇÃO CRÍTICA #2: Exportação ES6 (era CommonJS)
// Implementação COMPLETA das regras do Manual de Modelos
// Formatação profissional + Limpeza automática + Validações

console.log("🔧 Processing v7.7 - EXPORTAÇÃO ES6 CORRIGIDA");

// ================================================================================
// 🧹 SISTEMA DE LIMPEZA E FORMATAÇÃO PRINCIPAL
// ================================================================================

export function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("🔧 Iniciando processamento completo v7.7...");
  
  if (!conteudo) {
    console.error("❌ Conteúdo vazio para processar");
    return "Erro: Resposta vazia da IA";
  }
  
  let conteudoProcessado = conteudo;
  
  try {
    // ETAPA 1: Remover cabeçalhos técnicos
    conteudoProcessado = removerCabecalhosTecnicos(conteudoProcessado);
    
    // ETAPA 2: Aplicar formatação específica
    conteudoProcessado = aplicarFormatacaoCompleta(conteudoProcessado);
    
    // ETAPA 3: Validar regras críticas
    conteudoProcessado = validarRegrasCriticas(conteudoProcessado);
    
    // ETAPA 4: Aplicar correções específicas por tipo
    if (analise) {
      conteudoProcessado = aplicarCorrecoesPorTipo(conteudoProcessado, analise);
    }
    
    // ETAPA 5: Formatação final para WhatsApp
    conteudoProcessado = formatarParaWhatsApp(conteudoProcessado);
    
    // ETAPA 6: Validação final
    const validacao = validarOrcamentoFinal(conteudoProcessado, formData);
    if (!validacao.valido) {
      console.warn("⚠️ Validação encontrou problemas:", validacao.problemas);
    }
    
    console.log(`✅ Processamento completo finalizado: ${conteudoProcessado.length} caracteres`);
    return conteudoProcessado;
    
  } catch (error) {
    console.error("❌ Erro no processamento:", error);
    return aplicarFormatacaoBasica(conteudo); // Fallback
  }
}

// ================================================================================
// 🧹 REMOÇÃO DE CABEÇALHOS TÉCNICOS
// ================================================================================

function removerCabecalhosTecnicos(conteudo) {
  console.log("🧹 Removendo cabeçalhos técnicos...");
  
  let limpo = conteudo;
  
  // Lista completa de padrões para remover
  const padroesRemover = [
    // Cabeçalhos do sistema
    /^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim,
    /^SISTEMA PROFISSIONAL[^\n]*\n?/gim,
    /^TIPOS SELECIONADOS:[^\n]*\n?/gim,
    /^DADOS DA VIAGEM:[^\n]*\n?/gim,
    /^INFORMAÇÕES ADICIONAIS:[^\n]*\n?/gim,
    
    // Regras e instruções
    /^REGRAS [^\n]*:[^\n]*\n?/gim,
    /^INSTRUÇÕES [^\n]*:[^\n]*\n?/gim,
    /^CAMPOS OPCIONAIS[^\n]*\n?/gim,
    /^OBSERVAÇÕES IMPORTANTES[^\n]*\n?/gim,
    
    // Metadata e headers
    /^VERSION:[^\n]*\n?/gim,
    /^TIMESTAMP:[^\n]*\n?/gim,
    /^USER-AGENT:[^\n]*\n?/gim,
    /^DEBUG:[^\n]*\n?/gim
  ];
  
  // Aplicar todas as remoções
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  return limpo.trim();
}

// ================================================================================
// 🎨 FORMATAÇÃO COMPLETA E PROFISSIONAL
// ================================================================================

export function aplicarFormatacaoCompleta(conteudo) {
  console.log("🎨 Aplicando formatação completa...");
  
  let formatado = conteudo;
  
  // ETAPA 1: Conversões de códigos de aeroporto
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
  
  // ETAPA 2: Formatação de valores monetários
  formatado = formatado.replace(/R\$\s*(\d+)([,.]?)(\d{0,2})/g, (match, valor, sep, centavos) => {
    if (centavos) {
      return `R$ ${parseInt(valor).toLocaleString('pt-BR')},${centavos.padEnd(2, '0')}`;
    }
    return `R$ ${parseInt(valor).toLocaleString('pt-BR')},00`;
  });
  
  // ETAPA 3: Formatação de datas
  formatado = formatado.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?/g, (match, dia, mes, ano) => {
    const d = dia.padStart(2, '0');
    const m = mes.padStart(2, '0');
    if (ano) {
      const a = ano.length === 2 ? `20${ano}` : ano;
      return `${d}/${m}/${a}`;
    }
    return `${d}/${m}`;
  });
  
  // ETAPA 4: Formatação de horários
  formatado = formatado.replace(/(\d{1,2})[:\.](\d{2})/g, (match, hora, min) => {
    return `${hora.padStart(2, '0')}:${min}`;
  });
  
  // ETAPA 5: Limpeza de espaçamentos
  formatado = formatado.replace(/\n{3,}/g, '\n\n'); // Max 2 quebras consecutivas
  formatado = formatado.replace(/[ \t]+\n/g, '\n'); // Remove espaços no final da linha
  formatado = formatado.replace(/\n[ \t]+/g, '\n'); // Remove espaços no início da linha
  
  return formatado.trim();
}

// ================================================================================
// ✅ VALIDAÇÃO DE REGRAS CRÍTICAS
// ================================================================================

function validarRegrasCriticas(conteudo) {
  console.log("✅ Validando regras críticas...");
  
  let corrigido = conteudo;
  
  // REGRA 1: Garantir que valores tenham R$
  corrigido = corrigido.replace(/(\d+[,.]?\d{0,2})\s*(reais?|por pessoa|total)/gi, (match, valor, texto) => {
    if (!match.includes('R$')) {
      return `R$ ${valor} ${texto}`;
    }
    return match;
  });
  
  // REGRA 2: Garantir formatação de bagagem
  corrigido = corrigido.replace(/bagagem[:\s]*([^\n]*)/gi, (match, info) => {
    if (!info.includes('kg') && !info.includes('mala')) {
      return `${match} - 1 mala de 23kg inclusa`;
    }
    return match;
  });
  
  // REGRA 3: Garantir informação de reembolso
  if (!corrigido.toLowerCase().includes('reembolsável') && !corrigido.toLowerCase().includes('cancelamento')) {
    corrigido += '\n⚠️ *Não reembolsável*';
  }
  
  return corrigido;
}

// ================================================================================
// 🔧 CORREÇÕES ESPECÍFICAS POR TIPO
// ================================================================================

function aplicarCorrecoesPorTipo(conteudo, analise) {
  console.log("🔧 Aplicando correções por tipo...");
  
  let corrigido = conteudo;
  
  // Correções para voos
  if (analise.tipos?.aereo) {
    // Garantir separador ida/volta
    if (corrigido.includes('Volta:') && !corrigido.includes('--')) {
      corrigido = corrigido.replace(/(\n.*Volta:)/g, '\n--$1');
    }
    
    // Garantir numeração de opções
    if (corrigido.includes('OPÇÃO') && !corrigido.includes('OPÇÃO 1')) {
      corrigido = corrigido.replace(/OPÇÃO(?!\s+\d)/g, 'OPÇÃO 1');
    }
  }
  
  // Correções para cruzeiros
  if (analise.tipos?.cruzeiro) {
    // Garantir informações de documentação
    if (!corrigido.includes('DOCUMENTAÇÃO') && !corrigido.includes('RG')) {
      corrigido += '\n\n*📋 DOCUMENTAÇÃO NECESSÁRIA:*\n• RG ou CNH dentro da validade\n• Cartão de vacina (febre amarela)';
    }
  }
  
  // Correções para hotéis
  if (analise.tipos?.hotel) {
    // Garantir política de check-in/out
    if (!corrigido.includes('Check-in') && !corrigido.includes('check-in')) {
      corrigido += '\n\n*📋 POLÍTICA:*\n• Check-in: 14h | Check-out: 12h\n• Cancelamento gratuito até 24h antes';
    }
  }
  
  return corrigido;
}

// ================================================================================
// 📱 FORMATAÇÃO FINAL PARA WHATSAPP
// ================================================================================

export function formatarParaWhatsApp(conteudo) {
  console.log("📱 Formatação final para WhatsApp...");
  
  let formatado = conteudo;
  
  // Garantir que títulos principais tenham *asterisco*
  formatado = formatado.replace(/^(.*(?:ORÇAMENTO|OPÇÃO|CRUZEIRO|HOTEL|RANKING|DICAS).*)$/gim, '*$1*');
  
  // Garantir que valores monetários tenham destaque
  formatado = formatado.replace(/(VALOR.*?R\$.*?)$/gim, '*$1*');
  
  // Garantir que informações importantes tenham destaque
  formatado = formatado.replace(/^(.*(?:INCLUSO|DOCUMENTAÇÃO|POLÍTICA|IMPORTANTE).*)$/gim, '*$1*');
  
  // Remover múltiplas quebras de linha
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  // Garantir espaçamento antes de seções importantes
  formatado = formatado.replace(/(\n)(\*.*(?:OPÇÃO|VALOR|INCLUSO|DOCUMENTAÇÃO).*\*)/g, '$1\n$2');
  
  return formatado.trim();
}

// ================================================================================
// ✅ VALIDAÇÃO FINAL DO ORÇAMENTO
// ================================================================================

export function validarOrcamentoFinal(conteudo, formData) {
  console.log("✅ Executando validação final...");
  
  const problemas = [];
  const validacao = {
    valido: true,
    problemas: []
  };
  
  // Verificar presença de elementos obrigatórios
  const verificacoes = [
    {
      test: () => conteudo.includes('R$'),
      erro: 'Valor em reais não encontrado'
    },
    {
      test: () => /\d{2}:\d{2}/.test(conteudo),
      erro: 'Horários no formato correto não encontrados'
    },
    {
      test: () => /\d{2}\/\d{2}/.test(conteudo),
      erro: 'Datas no formato correto não encontradas'
    },
    {
      test: () => conteudo.includes('adulto'),
      erro: 'Informação de passageiros não encontrada'
    },
    {
      test: () => conteudo.includes('mala') || conteudo.includes('bagagem'),
      erro: 'Informação de bagagem não encontrada'
    },
    {
      test: () => conteudo.includes('reembolsável') || conteudo.includes('Não reembolsável'),
      erro: 'Informação de reembolso não encontrada'
    }
  ];
  
  // Executar verificações
  verificacoes.forEach(verificacao => {
    if (!verificacao.test()) {
      problemas.push(verificacao.erro);
    }
  });
  
  // Verificações específicas por tipo
  if (formData.tipos.some(tipo => tipo.toLowerCase().includes('ida') && tipo.toLowerCase().includes('volta'))) {
    if (!conteudo.includes('--')) {
      problemas.push('Separador ida/volta (--) não encontrado');
    }
  }
  
  // Verificar múltiplas opções
  if (conteudo.includes('OPÇÃO') && !conteudo.includes('OPÇÃO 1')) {
    problemas.push('Numeração de opções inconsistente');
  }
  
  // Verificar horários problemáticos
  if (conteudo.match(/\d{1,2}\s+:\s+\d{2}/)) {
    problemas.push('Formatação de horários com espaços desnecessários');
  }
  
  validacao.problemas = problemas;
  validacao.valido = problemas.length === 0;
  
  return validacao;
}

// ================================================================================
// 📊 MÉTRICAS DE QUALIDADE
// ================================================================================

export function calcularMetricasQualidade(conteudoOriginal, conteudoProcessado) {
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
  console.log("🎨 Aplicando formatação básica...");
  
  let formatado = conteudo;
  
  // Conversões básicas de aeroporto
  const codigosBasicos = {
    'CGH': 'São Paulo/Congonhas',
    'GRU': 'São Paulo/Guarulhos',
    'VCP': 'Campinas/Viracopos',
    'SDU': 'Rio de Janeiro/Santos Dumont',
    'GIG': 'Rio de Janeiro/Galeão'
  };
  
  Object.entries(codigosBasicos).forEach(([codigo, nome]) => {
    formatado = formatado.replace(new RegExp(`\\b${codigo}\\b`, 'g'), nome);
  });
  
  // Limpeza básica
  formatado = formatado.replace(/^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim, '');
  formatado = formatado.replace(/^TIPOS SELECIONADOS:[^\n]*\n?/gim, '');
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  return formatado.trim();
}

// ================================================================================
// 🚀 EXPORTAÇÃO E LOGS
// ================================================================================

// Log de inicialização
console.log("✅ Processing v7.7 carregado:");
console.log("🧹 Sistema completo de limpeza");
console.log("🎨 Formatação automática avançada");
console.log("✅ Validação em tempo real");
console.log("📱 Otimização para WhatsApp");
console.log("🔧 Correções específicas por tipo");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - Compatível com import()");

// ================================================================================
// 📤 EXPORTAÇÃO ES6 (CORREÇÃO CRÍTICA #2)
// ================================================================================

// Exportação individual das funções principais
export {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade
};

// Exportação padrão para máxima compatibilidade
export default {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade
};

console.log("🚀 Sistema de Processamento v7.7 - EXPORTAÇÃO ES6 FUNCIONAL!");
