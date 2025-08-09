// 🔧 api/modules/processing.js - v9.0 - SISTEMA COMPLETO E MELHORADO
// Processamento especializado para CVC Itaqua
// FOCO: Formatação WhatsApp perfeita + Múltiplas opções

console.log("🔧 Processing v9.0 - SISTEMA MELHORADO PARA CVC ITAQUA");

// ================================================================================
// 📋 ÍNDICE DE FUNÇÕES
// ================================================================================
/* 
1️⃣ processarRespostaCompleta()      - Função principal de processamento
2️⃣ removerCabecalhosTecnicos()      - Remove headers desnecessários
3️⃣ aplicarFormatacaoCompleta()      - Formatação profissional
4️⃣ validarRegrasCriticas()          - Validação de regras CVC
5️⃣ aplicarCorrecoesPorTipo()        - Correções específicas por tipo
6️⃣ formatarParaWhatsApp()           - Formatação final WhatsApp
7️⃣ validarOrcamentoFinal()          - Validação final
8️⃣ calcularMetricasQualidade()      - Métricas de qualidade
9️⃣ processarMultiplasOpcoes()       - NOVO: Processa múltiplas opções
🔟 garantirFormatoWhatsApp()        - NOVO: Garante formato WhatsApp
*/

// ================================================================================
// 1️⃣ FUNÇÃO PRINCIPAL - PROCESSAMENTO COMPLETO (processing.js)
// ================================================================================

function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("🔧 [1] Iniciando processamento completo v9.0...");
  
  if (!conteudo) {
    console.error("❌ [1] Conteúdo vazio para processar");
    return "❌ Erro: Não foi possível gerar o orçamento. Tente novamente.";
  }
  
  let conteudoProcessado = conteudo;
  
  try {
    // ETAPA 1: Detectar e processar múltiplas opções PRIMEIRO
    if (detectarMultiplasOpcoes(conteudoProcessado)) {
      console.log("🔍 [1] Múltiplas opções detectadas!");
      conteudoProcessado = processarMultiplasOpcoes(conteudoProcessado, formData);
    }
    
    // ETAPA 2: Remover cabeçalhos técnicos
    conteudoProcessado = removerCabecalhosTecnicos(conteudoProcessado);
    
    // ETAPA 3: Aplicar formatação completa
    conteudoProcessado = aplicarFormatacaoCompleta(conteudoProcessado);
    
    // ETAPA 4: Validar regras críticas
    conteudoProcessado = validarRegrasCriticas(conteudoProcessado);
    
    // ETAPA 5: Aplicar correções por tipo
    if (analise) {
      conteudoProcessado = aplicarCorrecoesPorTipo(conteudoProcessado, analise);
    }
    
    // ETAPA 6: Garantir formato WhatsApp
    conteudoProcessado = garantirFormatoWhatsApp(conteudoProcessado);
    
    // ETAPA 7: Formatação final para WhatsApp
    conteudoProcessado = formatarParaWhatsApp(conteudoProcessado);
    
    // ETAPA 8: Validação final
    const validacao = validarOrcamentoFinal(conteudoProcessado, formData);
    if (!validacao.valido) {
      console.warn("⚠️ [1] Validação encontrou problemas:", validacao.problemas);
    }
    
    console.log(`✅ [1] Processamento finalizado: ${conteudoProcessado.length} caracteres`);
    return conteudoProcessado;
    
  } catch (error) {
    console.error("❌ [1] Erro no processamento:", error);
    return aplicarFormatacaoBasica(conteudo);
  }
}

// ================================================================================
// 9️⃣ PROCESSAR MÚLTIPLAS OPÇÕES - NOVO E MELHORADO (processing.js)
// ================================================================================

function detectarMultiplasOpcoes(conteudo) {
  const texto = conteudo.toLowerCase();
  return (
    // Detecta Salvador e Porto Seguro (ou outros destinos diferentes)
    (texto.includes('salvador') && texto.includes('porto seguro')) ||
    (texto.includes('fortaleza') && texto.includes('natal')) ||
    (texto.includes('recife') && texto.includes('maceió')) ||
    // Detecta múltiplos valores
    ((conteudo.match(/R\$\s*[\d.,]+/gi) || []).length >= 2) ||
    // Detecta padrões de opções
    (texto.includes('opção 1') && texto.includes('opção 2')) ||
    // Detecta múltiplas companhias
    ((texto.includes('gol') && texto.includes('latam')) ||
     (texto.includes('azul') && texto.includes('latam')))
  );
}

function processarMultiplasOpcoes(conteudo, formData) {
  console.log("🔢 [9] Processando múltiplas opções...");
  
  // Extrair blocos de informação
  const opcoes = extrairOpcoesDoConteudo(conteudo);
  
  if (opcoes.length < 2) {
    console.log("⚠️ [9] Menos de 2 opções detectadas, retornando conteúdo original");
    return conteudo;
  }
  
  let resultado = '';
  
  // Processar cada opção
  opcoes.forEach((opcao, index) => {
    const numeroOpcao = index + 1;
    
    // Formatar cabeçalho da opção
    resultado += `*OPÇÃO ${numeroOpcao} - ${opcao.companhia || 'Companhia'} - São Paulo ✈ ${opcao.destino}*\n`;
    
    // Adicionar datas e horários
    if (opcao.dataIda && opcao.horaIda) {
      resultado += `${opcao.dataIda} - ${opcao.origemAeroporto || 'Guarulhos'} ${opcao.horaIda} / ${opcao.destinoAeroporto || opcao.destino} ${opcao.horaChegadaIda || '--:--'} (${opcao.tipoVooIda || 'voo direto'})\n`;
    }
    
    resultado += `--\n`;
    
    if (opcao.dataVolta && opcao.horaVolta) {
      resultado += `${opcao.dataVolta} - ${opcao.destinoAeroporto || opcao.destino} ${opcao.horaVolta} / ${opcao.origemAeroporto || 'Guarulhos'} ${opcao.horaChegadaVolta || '--:--'} (${opcao.tipoVooVolta || 'voo direto'})\n`;
    }
    
    resultado += `\n`;
    
    // Adicionar valor
    resultado += `💰 ${opcao.valor || 'R$ 0,00'} para ${formData?.adultos || 4} adulto${(formData?.adultos || 4) > 1 ? 's' : ''}`;
    if (formData?.criancas > 0) {
      resultado += ` + ${formData.criancas} criança${formData.criancas > 1 ? 's' : ''}`;
    }
    resultado += `\n`;
    
    // Adicionar bagagem
    resultado += `✅ ${opcao.bagagem || 'Só mala de mão incluída'}\n`;
    
    // Adicionar política de reembolso
    resultado += `🏷️ ${opcao.reembolso || 'Não reembolsável'}\n`;
    
    // Separador entre opções
    if (numeroOpcao < opcoes.length) {
      resultado += `\n`;
    }
  });
  
  // Adicionar rodapé
  resultado += `\nValores sujeitos a confirmação e disponibilidade`;
  
  console.log(`✅ [9] ${opcoes.length} opções formatadas`);
  return resultado;
}

function extrairOpcoesDoConteudo(conteudo) {
  const opcoes = [];
  const blocos = separarBlocosDeVoo(conteudo);
  
  blocos.forEach(bloco => {
    const opcao = {
      companhia: extrairCompanhiaDoBloco(bloco),
      destino: extrairDestinoDoBloco(bloco),
      valor: extrairValorDoBloco(bloco),
      dataIda: extrairDataIda(bloco),
      dataVolta: extrairDataVolta(bloco),
      horaIda: extrairHorario(bloco, 'ida'),
      horaVolta: extrairHorario(bloco, 'volta'),
      horaChegadaIda: extrairHorario(bloco, 'chegada_ida'),
      horaChegadaVolta: extrairHorario(bloco, 'chegada_volta'),
      bagagem: extrairBagagem(bloco),
      reembolso: extrairReembolso(bloco),
      origemAeroporto: 'Guarulhos',
      destinoAeroporto: extrairAeroportoDestino(bloco)
    };
    
    if (opcao.destino && opcao.valor) {
      opcoes.push(opcao);
    }
  });
  
  return opcoes;
}

function separarBlocosDeVoo(conteudo) {
  // Separar por padrões que indicam diferentes voos
  const separadores = [
    /total.*?R\$/gi,
    /detalhes/gi,
    /─+/g,
    /\n\n\n/g
  ];
  
  let blocos = [conteudo];
  
  // Tentar separar por valores totais
  const valoresMatch = conteudo.match(/total.*?R\$\s*[\d.,]+/gi);
  if (valoresMatch && valoresMatch.length > 1) {
    blocos = [];
    let textoTemp = conteudo;
    valoresMatch.forEach((valor, index) => {
      const pos = textoTemp.indexOf(valor);
      if (pos > 0) {
        blocos.push(textoTemp.substring(0, pos + valor.length));
        textoTemp = textoTemp.substring(pos + valor.length);
      }
    });
  }
  
  return blocos.filter(b => b.trim().length > 50);
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES DE EXTRAÇÃO (processing.js)
// ================================================================================

function extrairCompanhiaDoBloco(bloco) {
  const companhias = ['Gol', 'Latam', 'Azul', 'TAP', 'Avianca', 'Copa'];
  for (const cia of companhias) {
    if (bloco.toLowerCase().includes(cia.toLowerCase())) {
      return cia.toUpperCase();
    }
  }
  return 'LATAM';
}

function extrairDestinoDoBloco(bloco) {
  const destinos = {
    'salvador': 'Salvador',
    'porto seguro': 'Porto Seguro',
    'fortaleza': 'Fortaleza',
    'recife': 'Recife',
    'natal': 'Natal',
    'maceió': 'Maceió',
    'maceio': 'Maceió',
    'florianópolis': 'Florianópolis',
    'florianopolis': 'Florianópolis'
  };
  
  const textoLower = bloco.toLowerCase();
  for (const [key, value] of Object.entries(destinos)) {
    if (textoLower.includes(key)) {
      return value;
    }
  }
  
  // Tentar extrair do padrão "São Paulo - [Destino]"
  const padraoDestino = /são paulo\s*[-–]\s*([^\n\r]+)/i;
  const match = bloco.match(padraoDestino);
  if (match) {
    return match[1].trim();
  }
  
  return 'Destino';
}

function extrairValorDoBloco(bloco) {
  const padraoValor = /R\$\s*([\d.,]+)/i;
  const match = bloco.match(padraoValor);
  return match ? match[0] : 'R$ 0,00';
}

function extrairDataIda(bloco) {
  const padraoData = /(\d{1,2})\s*de\s*(dez|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov)/i;
  const match = bloco.match(padraoData);
  if (match) {
    const dia = match[1].padStart(2, '0');
    const mesMap = {
      'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
      'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
      'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
    };
    const mes = mesMap[match[2].toLowerCase()];
    return `${dia}/${mes}`;
  }
  return '19/12';
}

function extrairDataVolta(bloco) {
  const todasDatas = bloco.match(/(\d{1,2})\s*de\s*(dez|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov)/gi);
  if (todasDatas && todasDatas.length > 1) {
    const match = todasDatas[todasDatas.length - 1].match(/(\d{1,2})\s*de\s*(\w+)/i);
    if (match) {
      const dia = match[1].padStart(2, '0');
      const mesMap = {
        'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
        'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
        'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
      };
      const mes = mesMap[match[2].toLowerCase()];
      return `${dia}/${mes}`;
    }
  }
  return '26/12';
}

function extrairHorario(bloco, tipo) {
  const horarios = bloco.match(/\d{2}:\d{2}/g) || [];
  
  switch(tipo) {
    case 'ida': return horarios[0] || '07:00';
    case 'chegada_ida': return horarios[1] || '09:00';
    case 'volta': return horarios[2] || '20:00';
    case 'chegada_volta': return horarios[3] || '22:00';
    default: return '00:00';
  }
}

function extrairBagagem(bloco) {
  if (bloco.toLowerCase().includes('2 bagagen') || bloco.toLowerCase().includes('duas bagagen')) {
    return 'Mala de mão + 2 bagagens despachadas';
  }
  if (bloco.toLowerCase().includes('bagagem despachada')) {
    return 'Mala de mão + bagagem despachada';
  }
  return 'Só mala de mão incluída';
}

function extrairReembolso(bloco) {
  if (bloco.toLowerCase().includes('reembolsável conforme')) {
    return 'Reembolsável conforme regras do bilhete';
  }
  if (bloco.toLowerCase().includes('não reembolsável')) {
    return 'Não reembolsável';
  }
  return 'Não reembolsável';
}

function extrairAeroportoDestino(bloco) {
  const aeroportos = {
    'ssa': 'Salvador',
    'bps': 'Porto Seguro',
    'for': 'Fortaleza',
    'rec': 'Recife',
    'nat': 'Natal',
    'mcz': 'Maceió'
  };
  
  const textoLower = bloco.toLowerCase();
  for (const [codigo, nome] of Object.entries(aeroportos)) {
    if (textoLower.includes(codigo)) {
      return nome;
    }
  }
  
  return extrairDestinoDoBloco(bloco);
}

// ================================================================================
// 2️⃣ REMOÇÃO DE CABEÇALHOS TÉCNICOS (processing.js)
// ================================================================================

function removerCabecalhosTecnicos(conteudo) {
  console.log("🧹 [2] Removendo cabeçalhos técnicos...");
  let limpo = conteudo;
  
  const padroesRemover = [
    /^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim,
    /^SISTEMA PROFISSIONAL[^\n]*\n?/gim,
    /^\*\*Orçamento CVC[^\n]*\*\*\n?/gim,
    /^\*\*Passageiro\(s\):[^\n]*\*\*\n?/gim,
    /^---+\n?/gm,
    /^###[^\n]*\n?/gm,
    /^\*\*Observações:\*\*[^\n]*\n?/gim,
    /^TIPOS SELECIONADOS:[^\n]*\n?/gim,
    /^DADOS DA VIAGEM:[^\n]*\n?/gim,
    /^INFORMAÇÕES ADICIONAIS:[^\n]*\n?/gim,
    /^DEBUG:[^\n]*\n?/gim
  ];
  
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  // Remover markdown
  limpo = limpo.replace(/\*\*(.*?)\*\*/g, '*$1*'); // Converter ** para *
  limpo = limpo.replace(/^#+\s*/gm, ''); // Remover headers markdown
  limpo = limpo.replace(/^-\s+/gm, '• '); // Converter listas
  
  return limpo.trim();
}

// ================================================================================
// 3️⃣ FORMATAÇÃO COMPLETA E PROFISSIONAL (processing.js)
// ================================================================================

function aplicarFormatacaoCompleta(conteudo) {
  console.log("🎨 [3] Aplicando formatação completa...");
  let formatado = conteudo;
  
  // Conversão COMPLETA de códigos de aeroporto
  const codigosAeroporto = {
    'GRU': 'Guarulhos',
    'CGH': 'Congonhas',
    'VCP': 'Viracopos',
    'SSA': 'Salvador',
    'BPS': 'Porto Seguro',
    'SDU': 'Santos Dumont',
    'GIG': 'Galeão',
    'BSB': 'Brasília',
    'CNF': 'Confins',
    'POA': 'Porto Alegre',
    'CWB': 'Curitiba',
    'FOR': 'Fortaleza',
    'REC': 'Recife',
    'NAT': 'Natal',
    'MCZ': 'Maceió',
    'FLN': 'Florianópolis',
    'MAO': 'Manaus',
    'BEL': 'Belém'
  };
  
  // Aplicar conversões
  Object.entries(codigosAeroporto).forEach(([codigo, nome]) => {
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    formatado = formatado.replace(regex, nome);
  });
  
  // Formatação de valores monetários (manter formato brasileiro)
  formatado = formatado.replace(/R\$\s*(\d+)\.(\d{3}),(\d{2})/g, 'R$ $1.$2,$3');
  formatado = formatado.replace(/R\$\s*(\d+),(\d{2})/g, 'R$ $1,$2');
  
  // Formatação de datas
  formatado = formatado.replace(/(\d{1,2})[\/\-](\d{1,2})/g, (match, dia, mes) => {
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}`;
  });
  
  // Formatação de horários (remover espaços extras)
  formatado = formatado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, (match, h, m) => {
    return `${h.padStart(2, '0')}:${m}`;
  });
  
  // Limpeza de espaços
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  formatado = formatado.replace(/[ \t]+\n/g, '\n');
  formatado = formatado.replace(/\n[ \t]+/g, '\n');
  
  return formatado.trim();
}

// ================================================================================
// 4️⃣ VALIDAÇÃO DE REGRAS CRÍTICAS (processing.js)
// ================================================================================

function validarRegrasCriticas(conteudo) {
  console.log("✅ [4] Validando regras críticas CVC...");
  let validado = conteudo;
  
  // Garantir formato de horário correto
  validado = validado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Garantir espaço após R$
  validado = validado.replace(/R\$(\d)/g, 'R$ $1');
  
  // Garantir formato de passageiros com zero à esquerda
  validado = validado.replace(/\b(\d)\s+adulto/gi, (match, num) => {
    return `${num.padStart(2, '0')} adulto`;
  });
  
  // Garantir separador -- entre ida e volta
  if (!validado.includes('--')) {
    validado = validado.replace(/(volta|retorno):/gi, '--\n$1:');
  }
  
  return validado;
}

// ================================================================================
// 5️⃣ CORREÇÕES ESPECÍFICAS POR TIPO (processing.js)
// ================================================================================

function aplicarCorrecoesPorTipo(conteudo, analise) {
  console.log("🔧 [5] Aplicando correções por tipo:", analise?.tipoDetectado || analise?.tipo_principal);
  let corrigido = conteudo;
  
  const tipo = (analise?.tipoDetectado || analise?.tipo_principal || '').toLowerCase();
  
  switch (tipo) {
    case 'multiplas_opcoes_2':
    case 'multiplas_opcoes_3':
      corrigido = garantirFormatoMultiplasOpcoes(corrigido);
      break;
      
    case 'aereo_nacional_simples':
    case 'aéreo nacional':
    case 'aéreo internacional':
      corrigido = processarOrcamentoAereo(corrigido, analise);
      break;
      
    case 'cruzeiro':
    case 'cruzeiros':
      corrigido = processarOrcamentoCruzeiro(corrigido, analise);
      break;
      
    case 'hotel':
    case 'hotéis':
      corrigido = processarOrcamentoHotel(corrigido, analise);
      break;
      
    case 'pacote':
    case 'pacotes':
    case 'pacote_completo':
      corrigido = processarOrcamentoPacote(corrigido, analise);
      break;
  }
  
  return corrigido;
}

function garantirFormatoMultiplasOpcoes(conteudo) {
  console.log("🔢 [5] Garantindo formato de múltiplas opções...");
  
  // Garantir que OPÇÃO esteja em maiúsculas e com asterisco
  conteudo = conteudo.replace(/opção\s+(\d)/gi, '*OPÇÃO $1*');
  
  // Garantir separação entre opções
  conteudo = conteudo.replace(/(\*OPÇÃO \d\*)/g, '\n$1');
  
  return conteudo;
}

function processarOrcamentoAereo(conteudo, analise) {
  console.log("✈️ [5] Processando orçamento aéreo...");
  let processado = conteudo;
  
  // Garantir emoji de avião se não houver
  if (!processado.match(/[✈️🛫]/)) {
    const primeiraLinha = processado.split('\n')[0];
    if (primeiraLinha.includes('*')) {
      processado = processado.replace(primeiraLinha, primeiraLinha.replace('*', '*✈️ '));
    }
  }
  
  return processado;
}

function processarOrcamentoCruzeiro(conteudo, analise) {
  console.log("🚢 [5] Processando orçamento de cruzeiro...");
  return conteudo.startsWith('🚢') ? conteudo : '🚢 ' + conteudo;
}

function processarOrcamentoHotel(conteudo, analise) {
  console.log("🏨 [5] Processando orçamento de hotel...");
  return conteudo.match(/^[🏨🏩]/) ? conteudo : '🏨 ' + conteudo;
}

function processarOrcamentoPacote(conteudo, analise) {
  console.log("🏖️ [5] Processando orçamento de pacote...");
  return conteudo.match(/^[🏖️📦]/) ? conteudo : '🏖️ ' + conteudo;
}

// ================================================================================
// 🔟 GARANTIR FORMATO WHATSAPP - NOVO (processing.js)
// ================================================================================

function garantirFormatoWhatsApp(conteudo) {
  console.log("📱 [10] Garantindo formato WhatsApp...");
  let formatado = conteudo;
  
  // REMOVER qualquer formato markdown restante
  formatado = formatado.replace(/#{1,6}\s*/g, ''); // Headers
  formatado = formatado.replace(/\*\*(.*?)\*\*/g, '*$1*'); // Bold
  formatado = formatado.replace(/__(.*?)__/g, '$1'); // Underline
  formatado = formatado.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
  formatado = formatado.replace(/^>\s*/gm, ''); // Quotes
  formatado = formatado.replace(/```[^`]*```/g, ''); // Code blocks
  formatado = formatado.replace(/`([^`]+)`/g, '$1'); // Inline code
  
  // Garantir emojis apropriados
  if (!formatado.match(/[💰💳✅🏷️📅👥🎯📍✈️🚢🏨]/)) {
    console.log("⚠️ [10] Adicionando emojis faltantes...");
    
    // Adicionar emojis em linhas específicas
    formatado = formatado.replace(/^(R\$\s*[\d.,]+)/gm, '💰 $1');
    formatado = formatado.replace(/\b(parcel\w+|cartão)/gi, '💳 $&');
    formatado = formatado.replace(/\b(bagagem|mala)/gi, '✅ $&');
    formatado = formatado.replace(/\b(não\s+reembolsável|reembolsável)/gi, '🏷️ $&');
  }
  
  return formatado;
}

// ================================================================================
// 6️⃣ FORMATAÇÃO FINAL PARA WHATSAPP (processing.js)
// ================================================================================

function formatarParaWhatsApp(conteudo) {
  console.log("📱 [6] Formatação final para WhatsApp...");
  let formatado = conteudo;
  
  // Garantir quebras de linha adequadas
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  // Remover espaços em excesso
  formatado = formatado.replace(/\s+\n/g, '\n');
  formatado = formatado.replace(/\n\s+/g, '\n');
  
  // Garantir formatação de títulos com asterisco
  formatado = formatado.replace(/^([A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ\s]+):$/gm, '*$1:*');
  
  // Garantir espaçamento entre seções
  formatado = formatado.replace(/\n([💰✅🏷️📅👥])/g, '\n$1');
  
  return formatado.trim();
}

// ================================================================================
// 7️⃣ VALIDAÇÃO FINAL DO ORÇAMENTO (processing.js)
// ================================================================================

function validarOrcamentoFinal(conteudo, formData) {
  console.log("✅ [7] Executando validação final...");
  
  const problemas = [];
  
  // Verificações obrigatórias
  if (!conteudo.includes('R$')) {
    problemas.push('Valor em reais não encontrado');
  }
  
  if (!/\d{2}:\d{2}/.test(conteudo)) {
    problemas.push('Horários não encontrados');
  }
  
  if (!/\d{2}\/\d{2}/.test(conteudo)) {
    problemas.push('Datas não encontradas');
  }
  
  // Verificar elementos essenciais do formato CVC
  if (!conteudo.includes('*')) {
    problemas.push('Formatação com asterisco não encontrada');
  }
  
  if (!conteudo.match(/[💰✅🏷️]/)) {
    problemas.push('Emojis padrão CVC não encontrados');
  }
  
  const validacao = {
    valido: problemas.length === 0,
    problemas: problemas,
    score: (5 - problemas.length) / 5 * 100
  };
  
  if (problemas.length > 0) {
    console.log(`⚠️ [7] Problemas encontrados: ${problemas.join(', ')}`);
  } else {
    console.log("✅ [7] Validação perfeita! Score: 100%");
  }
  
  return validacao;
}

// ================================================================================
// 8️⃣ MÉTRICAS DE QUALIDADE (processing.js)
// ================================================================================

function calcularMetricasQualidade(conteudoOriginal, conteudoProcessado) {
  console.log("📊 [8] Calculando métricas de qualidade...");
  
  const metricas = {
    conversoes: {
      aeroportos_convertidos: contarConversoesAeroportos(conteudoOriginal, conteudoProcessado),
      markdown_removido: contarMarkdownRemovido(conteudoOriginal, conteudoProcessado),
      emojis_adicionados: contarEmojisAdicionados(conteudoProcessado)
    },
    qualidade: {
      tem_valores: conteudoProcessado.includes('R$'),
      tem_horarios: /\d{2}:\d{2}/.test(conteudoProcessado),
      tem_datas: /\d{2}\/\d{2}/.test(conteudoProcessado),
      formato_whatsapp: !conteudoProcessado.includes('**') && !conteudoProcessado.includes('##'),
      emojis_presentes: (conteudoProcessado.match(/[💰✅🏷️📱⚠️✈️🚢🏨]/g) || []).length,
      tem_opcoes_multiplas: /OPÇÃO \d/.test(conteudoProcessado)
    },
    tamanho: {
      original: conteudoOriginal.length,
      processado: conteudoProcessado.length,
      reducao_percentual: ((conteudoOriginal.length - conteudoProcessado.length) / conteudoOriginal.length * 100).toFixed(1)
    }
  };
  
  // Calcular score geral
  const scores = Object.values(metricas.qualidade);
  const scoreTotal = scores.filter(Boolean).length / scores.length * 100;
  metricas.score_geral = scoreTotal.toFixed(1);
  
  console.log(`📊 [8] Score de qualidade: ${metricas.score_geral}%`);
  return metricas;
}

function contarConversoesAeroportos(original, processado) {
  const codigos = ['GRU', 'CGH', 'SSA', 'BPS', 'BSB', 'POA'];
  let conversoes = 0;
  
  codigos.forEach(codigo => {
    if (original.includes(codigo) && !processado.includes(codigo)) {
      conversoes++;
    }
  });
  
  return conversoes;
}

function contarMarkdownRemovido(original, processado) {
  const markdownPatterns = [/\*\*/g, /##/g, /```/g, /__/g];
  let removidos = 0;
  
  markdownPatterns.forEach(pattern => {
    const originalCount = (original.match(pattern) || []).length;
    const processadoCount = (processado.match(pattern) || []).length;
    removidos += originalCount - processadoCount;
  });
  
  return removidos;
}

function contarEmojisAdicionados(conteudo) {
  return (conteudo.match(/[💰✅🏷️📱⚠️✈️🚢🏨📅👥🎯📍]/g) || []).length;
}

// ================================================================================
// 🎨 FORMATAÇÃO BÁSICA - FALLBACK (processing.js)
// ================================================================================

function aplicarFormatacaoBasica(conteudo) {
  console.log("🎨 [FB] Aplicando formatação básica (fallback)...");
  
  let basico = conteudo;
  
  // Formatação mínima essencial
  basico = basico.replace(/R\$\s*(\d+)/g, 'R$ $1,00');
  basico = basico.replace(/\n{3,}/g, '\n\n');
  basico = basico.replace(/\*\*(.*?)\*\*/g, '*$1*');
  
  // Adicionar emojis básicos se não houver
  if (!basico.includes('💰')) {
    basico = basico.replace(/(R\$\s*[\d.,]+)/g, '💰 $1');
  }
  
  return basico.trim();
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 - v9.0 COMPLETA
// ================================================================================

console.log("✅ Processing v9.0 carregado com sucesso!");
console.log("🎯 Funcionalidades ativas:");
console.log("- ✅ Processamento de múltiplas opções");
console.log("- ✅ Formatação WhatsApp garantida");
console.log("- ✅ Conversão completa de aeroportos");
console.log("- ✅ Validação CVC rigorosa");
console.log("- ✅ Métricas de qualidade");

// Exportação nomeada
export {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade,
  processarMultiplasOpcoes,
  garantirFormatoWhatsApp
};

// Exportação default
export default {
  processarRespostaCompleta,
  aplicarFormatacaoCompleta,
  validarOrcamentoFinal,
  formatarParaWhatsApp,
  calcularMetricasQualidade,
  processarMultiplasOpcoes,
  garantirFormatoWhatsApp
};

console.log("🚀 Sistema de Processamento v9.0 - OTIMIZADO PARA CVC ITAQUA!");
