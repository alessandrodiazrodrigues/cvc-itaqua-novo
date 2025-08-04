// 🔧 processing.js - PROCESSAMENTO COMPLETO DE ORÇAMENTOS v7.0
// Implementação COMPLETA das regras do Manual de Modelos
// Formatação profissional + Limpeza automática + Validações

console.log("🔧 Processing v7.0 - MANUAL COMPLETO IMPLEMENTADO");

// ================================================================================
// 🧹 SISTEMA DE LIMPEZA E FORMATAÇÃO PRINCIPAL
// ================================================================================

function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("🔧 Iniciando processamento completo v7.0...");
  
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
    /^PARCELAMENTO SOLICITADO[^\n]*\n?/gim,
    /^TEMPLATE ESPECÍFICO[^\n]*\n?/gim,
    /^DADOS EXTRAÍDOS[^\n]*\n?/gim,
    /^INSTRUÇÕES FINAIS[^\n]*\n?/gim,
    
    // Comandos de geração
    /^GERE O ORÇAMENTO[^\n]*\n?/gim,
    /^GERAR ORÇAMENTO[^\n]*\n?/gim,
    /^FORMATO PADRÃO[^\n]*\n?/gim,
    
    // Listas numeradas de regras
    /^\d+\.\s*[⏰📅✈️🛫💳👥🧳👶🏷️💰📱🔧][^\n]*\n?/gim,
    
    // Separadores técnicos
    /^={10,}\n?/gim,
    /^-{10,}\n?/gim,
    
    // Prompts residuais
    /^- [A-Z][^\n]*:[^\n]*\n?/gim
  ];
  
  // Aplicar cada padrão
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  // Limpeza adicional de linhas vazias excessivas
  limpo = limpo.replace(/\n\s*\n\s*\n+/g, '\n\n'); // Máximo 2 quebras
  limpo = limpo.replace(/^\s*\n+/, ''); // Remover quebras do início
  limpo = limpo.trim();
  
  console.log(`🧹 Cabeçalhos removidos: ${conteudo.length} → ${limpo.length} caracteres`);
  return limpo;
}

// ================================================================================
// 🎨 FORMATAÇÃO COMPLETA - TODAS AS REGRAS DO MANUAL
// ================================================================================

function aplicarFormatacaoCompleta(conteudo) {
  console.log("🎨 Aplicando formatação completa...");
  
  let formatado = conteudo;
  
  // 1. ⏰ HORÁRIOS - Formato exato "06:20"
  formatado = formatarHorarios(formatado);
  
  // 2. 📅 DATAS - Formato "15/11" 
  formatado = formatarDatas(formatado);
  
  // 3. ✈️ AEROPORTOS - Conversão completa
  formatado = converterAeroportos(formatado);
  
  // 4. 🛫 CONEXÕES - "com conexão" nunca "escala"
  formatado = formatarConexoes(formatado);
  
  // 5. 💳 PARCELAMENTO - "primeira parcela" nunca "entrada"
  formatado = formatarParcelamento(formatado);
  
  // 6. 👥 PASSAGEIROS - "02 adultos" com zero à esquerda
  formatado = formatarPassageiros(formatado);
  
  // 7. 🧳 BAGAGEM - Regras específicas nacional/internacional
  formatado = formatarBagagem(formatado);
  
  // 8. 👶 CRIANÇAS - Com idades se informado
  formatado = formatarCriancas(formatado);
  
  // 9. 🏷️ REEMBOLSO - Padronizado
  formatado = formatarReembolso(formatado);
  
  // 10. 💰 VALORES - "R$ 1.464,02"
  formatado = formatarValores(formatado);
  
  // 11. 📱 EMOJIS - Garantir emojis apropriados
  formatado = garantirEmojis(formatado);
  
  console.log("✅ Formatação completa aplicada");
  return formatado;
}

// ================================================================================
// 🔧 FUNÇÕES ESPECÍFICAS DE FORMATAÇÃO
// ================================================================================

function formatarHorarios(conteudo) {
  // ⏰ HORÁRIOS: "06:20" (nunca "06: 20")
  let formatado = conteudo;
  
  // Corrigir espaços em horários
  formatado = formatado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Adicionar zero à esquerda se necessário
  formatado = formatado.replace(/\b(\d):/g, '0$1:');
  
  // Formato especial para chegadas no dia seguinte
  formatado = formatado.replace(/(\d{2}:\d{2})\s*\((\d{1,2}\/\d{1,2})\)/g, '$1 ($2)');
  
  return formatado;
}

function formatarDatas(conteudo) {
  // 📅 DATAS: "15/11" com zero à esquerda
  let formatado = conteudo;
  
  // Padronizar formato DD/MM
  formatado = formatado.replace(/\b(\d{1})\/(\d{1,2})\b/g, '0$1/$2');
  formatado = formatado.replace(/\b(\d{2})\/(\d{1})\b/g, '$1/0$2');
  
  return formatado;
}

function converterAeroportos(conteudo) {
  // ✈️ AEROPORTOS: Conversão completa de códigos
  let formatado = conteudo;
  
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
  
  // Aplicar conversões
  Object.entries(aeroportos).forEach(([codigo, nome]) => {
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    formatado = formatado.replace(regex, nome);
  });
  
  return formatado;
}

function formatarConexoes(conteudo) {
  // 🛫 CONEXÕES: "com conexão" nunca "escala"
  let formatado = conteudo;
  
  formatado = formatado.replace(/\bescala\b/gi, 'conexão');
  formatado = formatado.replace(/\bcom escala\b/gi, 'com conexão');
  formatado = formatado.replace(/\bfazendo escala\b/gi, 'com conexão');
  
  return formatado;
}

function formatarParcelamento(conteudo) {
  // 💳 PARCELAMENTO: "primeira parcela" nunca "entrada"
  let formatado = conteudo;
  
  formatado = formatado.replace(/\bentrada\b/gi, 'primeira parcela');
  formatado = formatado.replace(/\bvalor de entrada\b/gi, 'primeira parcela');
  formatado = formatado.replace(/\+ entrada de/gi, '+ primeira parcela de');
  
  return formatado;
}

function formatarPassageiros(conteudo) {
  // 👥 PASSAGEIROS: "02 adultos" com zero à esquerda
  let formatado = conteudo;
  
  // Padrões comuns de passageiros
  formatado = formatado.replace(/\b(\d) adulto\b/g, '0$1 adulto');
  formatado = formatado.replace(/\b(\d) adultos\b/g, '0$1 adultos');
  formatado = formatado.replace(/\bpara (\d) adulto/g, 'para 0$1 adulto');
  formatado = formatado.replace(/\bpara (\d) adultos/g, 'para 0$1 adultos');
  
  return formatado;
}

function formatarBagagem(conteudo) {
  // 🧳 BAGAGEM: Regras específicas nacional/internacional
  let formatado = conteudo;
  
  // Padronizações comuns
  formatado = formatado.replace(/apenas mala de mão/gi, 'Só mala de mão incluída');
  formatado = formatado.replace(/somente mala de mão/gi, 'Só mala de mão incluída');
  formatado = formatado.replace(/mala de mão incluída/gi, 'Só mala de mão incluída');
  
  // Bagagem despachada internacional
  formatado = formatado.replace(/bagagem despachada\b(?!\s*\d+kg)/gi, 'bagagem despachada 23kg');
  
  return formatado;
}

function formatarCriancas(conteudo) {
  // 👶 CRIANÇAS: Com idades se informado
  let formatado = conteudo;
  
  // Padronizar formato de crianças com idades
  formatado = formatado.replace(/(\d+) criança.*?(\d+) ano/gi, '01 criança ($2 anos)');
  formatado = formatado.replace(/(\d+) crianças.*?(\d+) e (\d+) anos/gi, '02 crianças ($2 e $3 anos)');
  
  return formatado;
}

function formatarReembolso(conteudo) {
  // 🏷️ REEMBOLSO: Padronizado sem percentuais
  let formatado = conteudo;
  
  // Remover percentuais e valores específicos
  formatado = formatado.replace(/reembolsável \d+%/gi, 'Reembolsável conforme regras do bilhete');
  formatado = formatado.replace(/não reembolsável.*?multa/gi, 'Não reembolsável');
  
  // Padronizar textos
  formatado = formatado.replace(/totalmente reembolsável/gi, 'Reembolsável conforme regras do bilhete');
  formatado = formatado.replace(/parcialmente reembolsável/gi, 'Reembolsável conforme regras do bilhete');
  
  return formatado;
}

function formatarValores(conteudo) {
  // 💰 VALORES: "R$ 1.464,02" com espaço após R$
  let formatado = conteudo;
  
  // Garantir espaço após R$
  formatado = formatado.replace(/R\$(\d)/g, 'R$ $1');
  
  // Formatação de milhares
  formatado = formatado.replace(/R\$ (\d+)(\d{3}),/g, 'R$ $1.$2,');
  formatado = formatado.replace(/R\$ (\d+)(\d{3})(\d{3}),/g, 'R$ $1.$2.$3,');
  
  return formatado;
}

function garantirEmojis(conteudo) {
  // 📱 EMOJIS: Garantir emojis apropriados nos lugares certos
  let formatado = conteudo;
  
  // Adicionar emojis se não existirem
  if (!formatado.includes('💰') && formatado.includes('R$')) {
    formatado = formatado.replace(/^(.*R\$ [\d.,]+.*)/gm, '💰 $1');
  }
  
  if (!formatado.includes('✅') && formatado.includes('mala de mão')) {
    formatado = formatado.replace(/^(.*mala de mão.*)/gm, '✅ $1');
  }
  
  if (!formatado.includes('🏷️') && (formatado.includes('reembolsável') || formatado.includes('Não reembolsável'))) {
    formatado = formatado.replace(/^(.*[Nn]ão reembolsável.*)/gm, '🏷️ $1');
    formatado = formatado.replace(/^(.*[Rr]eembolsável.*)/gm, '🏷️ $1');
  }
  
  return formatado;
}

// ================================================================================
// ✅ VALIDAÇÃO DE REGRAS CRÍTICAS
// ================================================================================

function validarRegrasCriticas(conteudo) {
  console.log("✅ Validando regras críticas...");
  
  let corrigido = conteudo;
  
  // Validar e corrigir horários
  if (corrigido.match(/\d{1,2}\s*:\s*\d{2}/)) {
    corrigido = formatarHorarios(corrigido);
  }
  
  // Validar separador ida/volta
  if (corrigido.includes('ida') && corrigido.includes('volta')) {
    if (!corrigido.includes('--')) {
      corrigido = corrigido.replace(/volta/i, '--\nvolta');
    }
  }
  
  // Validar formato de conexões
  if (corrigido.toLowerCase().includes('escala')) {
    corrigido = formatarConexoes(corrigido);
  }
  
  return corrigido;
}

// ================================================================================
// 🎯 CORREÇÕES ESPECÍFICAS POR TIPO
// ================================================================================

function aplicarCorrecoesPorTipo(conteudo, analise) {
  console.log("🎯 Aplicando correções específicas por tipo...");
  
  let corrigido = conteudo;
  
  // Correções para AÉREO NACIONAL
  if (analise.tipo?.includes('nacional') || !conteudo.includes('internacional')) {
    // Garantir bagagem nacional padrão
    if (corrigido.includes('múltiplas opções') || corrigido.includes('OPÇÃO 1')) {
      corrigido = corrigido.replace(/✅.*?mala.*?(?=\n|$)/gi, '✅ Só mala de mão incluída');
    }
  }
  
  // Correções para MÚLTIPLAS OPÇÕES
  if (analise.temMultiplasOpcoes) {
    // Garantir numeração correta
    if (!corrigido.includes('OPÇÃO 1') && !corrigido.includes('**OPÇÃO 1**')) {
      // Detectar e numerar opções
      corrigido = numerarOpcoes(corrigido);
    }
    
    // Aplicar regras de bagagem escalonada
    corrigido = aplicarBagagemEscalonada(corrigido);
  }
  
  // Correções para CRUZEIROS
  if (analise.tipo?.includes('cruzeiro') || corrigido.toLowerCase().includes('cruzeiro')) {
    // Garantir formato de cabines
    corrigido = formatarCabinesCruzeiro(corrigido);
    
    // Adicionar documentação se não tiver
    if (!corrigido.includes('Documentação') && !corrigido.includes('RG')) {
      corrigido += '\n\n📋 Documentação: RG original (máx. 10 anos) ou passaporte';
    }
  }
  
  // Correções para PACOTES COMPLETOS
  if (analise.tipo?.includes('pacote') || corrigido.toLowerCase().includes('pacote')) {
    // Garantir estrutura de pacote
    corrigido = formatarEstruturaPacote(corrigido);
  }
  
  // Correções para MULTITRECHOS
  if (analise.tipo?.includes('multitrecho') || corrigido.includes('Trecho')) {
    // Garantir numeração de trechos
    corrigido = formatarTrechos(corrigido);
  }
  
  return corrigido;
}

function numerarOpcoes(conteudo) {
  let numerado = conteudo;
  
  // Detectar blocos de opções pela presença de valores
  const blocosValor = numerado.match(/💰.*?R\$.*?\n.*?(?=💰|$)/gs);
  
  if (blocosValor && blocosValor.length > 1) {
    blocosValor.forEach((bloco, index) => {
      const opcaoNum = `**OPÇÃO ${index + 1}**`;
      numerado = numerado.replace(bloco, bloco.replace(/💰/, `💰 ${opcaoNum} -`));
    });
  }
  
  return numerado;
}

function aplicarBagagemEscalonada(conteudo) {
  let corrigido = conteudo;
  
  // Regras de bagagem para múltiplas opções nacionais
  if (corrigido.includes('OPÇÃO 1')) {
    corrigido = corrigido.replace(/(OPÇÃO 1.*?\n).*?bagagem.*?\n/is, '$1✅ Só mala de mão incluída\n');
  }
  
  if (corrigido.includes('OPÇÃO 2')) {
    corrigido = corrigido.replace(/(OPÇÃO 2.*?\n).*?bagagem.*?\n/is, '$1✅ Mala de mão + bagagem despachada\n');
  }
  
  if (corrigido.includes('OPÇÃO 3')) {
    corrigido = corrigido.replace(/(OPÇÃO 3.*?\n).*?bagagem.*?\n/is, '$1✅ Mala de mão + 2 bagagens despachadas\n');
  }
  
  return corrigido;
}

function formatarCabinesCruzeiro(conteudo) {
  let formatado = conteudo;
  
  // Garantir formato correto de cabines
  formatado = formatado.replace(/cabine interna.*?R\$/gi, '**CABINE INTERNA** - R);
  formatado = formatado.replace(/cabine externa.*?R\$/gi, '**CABINE EXTERNA** - R);
  formatado = formatado.replace(/cabine.*?varanda.*?R\$/gi, '**CABINE COM VARANDA** - R);
  formatado = formatado.replace(/suíte.*?R\$/gi, '**SUÍTE** - R);
  
  return formatado;
}

function formatarEstruturaPacote(conteudo) {
  let formatado = conteudo;
  
  // Garantir seção "O Pacote Inclui:"
  if (!formatado.includes('O Pacote Inclui:')) {
    // Adicionar estrutura básica se não existir
    const linhasInclusoes = [
      '*O Pacote Inclui:*',
      '- Passagem Aérea ida e volta',
      '- Taxas de Embarque',
      '- Traslado Aeroporto / Hotel / Aeroporto',
      '- Hospedagem no hotel escolhido'
    ];
    
    formatado = formatado.replace(/^(.*pacote.*)/im, '$1\n\n' + linhasInclusoes.join('\n'));
  }
  
  return formatado;
}

function formatarTrechos(conteudo) {
  let formatado = conteudo;
  
  // Garantir formato correto de trechos
  formatado = formatado.replace(/trecho (\d+):/gi, '*Trecho $1:*');
  
  return formatado;
}

// ================================================================================
// 📱 FORMATAÇÃO FINAL PARA WHATSAPP
// ================================================================================

function formatarParaWhatsApp(conteudo) {
  console.log("📱 Formatando para WhatsApp...");
  
  let formatado = conteudo;
  
  // Garantir quebras de linha adequadas
  formatado = formatado.replace(/\n{3,}/g, '\n\n'); // Máximo 2 quebras
  
  // Garantir que companhias estão em negrito
  formatado = formatado.replace(/^(Latam|Gol|Azul|Avianca|Copa Airlines|American Airlines|United|Delta|TAP Portugal)$/gm, '*$1*');
  
  // Garantir separador ida/volta
  if (formatado.includes('ida') && formatado.includes('volta') && !formatado.includes('--')) {
    formatado = formatado.replace(/(?=.*volta)/im, '--\n');
  }
  
  // Remover espaços desnecessários
  formatado = formatado.replace(/\n\s+/g, '\n');
  formatado = formatado.replace(/\s+\n/g, '\n');
  
  // Garantir que não há linhas completamente vazias
  formatado = formatado.split('\n').filter(linha => linha.trim() !== '').join('\n');
  
  return formatado.trim();
}

// ================================================================================
// ✅ VALIDAÇÃO FINAL DO ORÇAMENTO
// ================================================================================

function validarOrcamentoFinal(conteudo, formData) {
  console.log("✅ Executando validação final...");
  
  const problemas = [];
  const validacao = {
    valido: true,
    problemas: []
  };
  
  // Verificar presença de elementos obrigatórios
  const verificacoes = [
    {
      test: () => conteudo.includes('R),
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
    problemas.push('Horários com espaçamento incorreto encontrados');
  }
  
  // Verificar cabeçalhos técnicos residuais
  const cabecalhosResiduais = [
    'ORÇAMENTO CVC',
    'TIPOS SELECIONADOS',
    'DADOS DA VIAGEM',
    'REGRAS OBRIGATÓRIAS',
    'GERE O ORÇAMENTO'
  ];
  
  cabecalhosResiduais.forEach(cabecalho => {
    if (conteudo.includes(cabecalho)) {
      problemas.push(`Cabeçalho técnico residual: ${cabecalho}`);
    }
  });
  
  // Definir resultado da validação
  validacao.valido = problemas.length === 0;
  validacao.problemas = problemas;
  
  if (validacao.valido) {
    console.log("✅ Validação final: APROVADO");
  } else {
    console.warn(`⚠️ Validação final: ${problemas.length} problemas encontrados`);
  }
  
  return validacao;
}

// ================================================================================
// 🔄 FORMATAÇÃO BÁSICA (FALLBACK)
// ================================================================================

function aplicarFormatacaoBasica(conteudo) {
  console.log("🔄 Aplicando formatação básica (fallback)...");
  
  let basico = conteudo;
  
  // Aplicar apenas formatações essenciais
  basico = removerCabecalhosTecnicos(basico);
  basico = formatarHorarios(basico);
  basico = formatarDatas(basico);
  basico = formatarValores(basico);
  basico = formatarParaWhatsApp(basico);
  
  return basico;
}

// ================================================================================
// 🎯 FUNÇÕES ESPECÍFICAS PARA TIPOS DE ORÇAMENTO
// ================================================================================

function processarOrcamentoAereo(conteudo, dadosVoo) {
  console.log("✈️ Processando orçamento aéreo específico...");
  
  let processado = conteudo;
  
  // Garantir estrutura ida/volta se aplicável
  if (dadosVoo.ida && dadosVoo.volta) {
    if (!processado.includes('--')) {
      const partes = processado.split('\n');
      const indiceVolta = partes.findIndex(linha => linha.toLowerCase().includes('volta'));
      if (indiceVolta > 0) {
        partes.splice(indiceVolta, 0, '--');
        processado = partes.join('\n');
      }
    }
  }
  
  // Aplicar conversão de aeroportos
  processado = converterAeroportos(processado);
  
  // Garantir formatação de horários
  processado = formatarHorarios(processado);
  
  return processado;
}

function processarOrcamentoCruzeiro(conteudo, dadosCruzeiro) {
  console.log("🚢 Processando orçamento de cruzeiro específico...");
  
  let processado = conteudo;
  
  // Garantir emoji de navio no início
  if (!processado.startsWith('🚢')) {
    processado = '🚢 ' + processado;
  }
  
  // Formatacao de cabines
  processado = formatarCabinesCruzeiro(processado);
  
  // Adicionar informações obrigatórias se não existirem
  if (!processado.includes('Inclui:')) {
    processado += '\n\n✅ Inclui: hospedagem a bordo, pensão completa, entretenimento';
    processado += '\n🚫 Não inclui: taxas portuárias, bebidas, excursões';
  }
  
  return processado;
}

function processarOrcamentoPacote(conteudo, dadosPacote) {
  console.log("🏖️ Processando orçamento de pacote específico...");
  
  let processado = conteudo;
  
  // Garantir estrutura de pacote
  processado = formatarEstruturaPacote(processado);
  
  // Garantir seção de voos separada
  if (!processado.includes('Voos')) {
    // Adicionar seção de voos se não existir
    const indiceHotel = processado.search(/hotel|hospedagem/i);
    if (indiceHotel > 0) {
      const voosPadrao = '\n✈️ *Voos:*\n[Detalhes dos voos serão inseridos aqui]\n';
      processado = processado.slice(0, indiceHotel) + voosPadrao + processado.slice(indiceHotel);
    }
  }
  
  return processado;
}

// ================================================================================
// 📊 MÉTRICAS E LOGS DE QUALIDADE
// ================================================================================

function calcularMetricasQualidade(conteudoOriginal, conteudoProcessado) {
  const metricas = {
    reducao_tamanho: {
      original: conteudoOriginal.length,
      processado: conteudoProcessado.length,
      reducao_percent: ((conteudoOriginal.length - conteudoProcessado.length) / conteudoOriginal.length * 100).toFixed(1)
    },
    formatacao: {
      horarios_corrigidos: (conteudoOriginal.match(/\d{1,2}\s*:\s*\d{2}/g) || []).length,
      aeroportos_convertidos: contarConversoes(conteudoOriginal, conteudoProcessado),
      cabecalhos_removidos: contarCabecalhosRemovidos(conteudoOriginal, conteudoProcessado)
    },
    qualidade: {
      tem_valores: conteudoProcessado.includes('R),
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
// 🚀 EXPORTAÇÃO E LOGS
// ================================================================================

// Log de inicialização
console.log("✅ Processing v7.0 carregado:");
console.log("🧹 Sistema completo de limpeza");
console.log("🎨 Formatação automática avançada");
console.log("✅ Validação em tempo real");
console.log("📱 Otimização para WhatsApp");
console.log("🔧 Correções específicas por tipo");

// Exportar funções principais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    processarRespostaCompleta,
    aplicarFormatacaoCompleta,
    validarOrcamentoFinal,
    formatarParaWhatsApp,
    calcularMetricasQualidade
  };
} else {
  // Browser environment
  window.processarRespostaCompleta = processarRespostaCompleta;
  window.aplicarFormatacaoCompleta = aplicarFormatacaoCompleta;
  window.validarOrcamentoFinal = validarOrcamentoFinal;
  window.formatarParaWhatsApp = formatarParaWhatsApp;
  window.calcularMetricasQualidade = calcularMetricasQualidade;
}

console.log("🚀 Sistema de Processamento v7.0 - FORMATAÇÃO PROFISSIONAL COMPLETA!");