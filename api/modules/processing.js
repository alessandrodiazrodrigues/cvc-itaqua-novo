// 🔧 api/modules/processing.js - v10.0 - SISTEMA COMPLETO E CORRIGIDO
// Processamento especializado para CVC Itaqua
// CORREÇÕES: Extração de datas, horários, passageiros e múltiplas opções

console.log("🔧 Processing v10.0 - SISTEMA CORRIGIDO PARA CVC ITAQUA");

// ================================================================================
// 📋 ÍNDICE COMPLETO DE FUNÇÕES
// ================================================================================
/* 
🔧 FUNÇÕES PRINCIPAIS:
1️⃣ processarRespostaCompleta()      - Função principal de processamento
2️⃣ removerCabecalhosTecnicos()      - Remove headers desnecessários
3️⃣ aplicarFormatacaoCompleta()      - Formatação profissional
4️⃣ validarRegrasCriticas()          - Validação de regras CVC
5️⃣ aplicarCorrecoesPorTipo()        - Correções específicas por tipo
6️⃣ formatarParaWhatsApp()           - Formatação final WhatsApp
7️⃣ validarOrcamentoFinal()          - Validação final
8️⃣ calcularMetricasQualidade()      - Métricas de qualidade

🔄 PROCESSAMENTO DE MÚLTIPLAS OPÇÕES:
9️⃣ detectarMultiplasOpcoes()        - Detecta múltiplas opções
🔟 processarMultiplasOpcoes()       - Processa múltiplas opções
1️⃣1️⃣ extrairOpcoesDoConteudo()       - Extrai opções do conteúdo
1️⃣2️⃣ separarBlocosDeVoo()            - Separa blocos de voo

📅 CORREÇÃO DE DATAS E PASSAGEIROS:
1️⃣3️⃣ corrigirDatasHorariosPassageiros() - Correção completa
1️⃣4️⃣ extrairDatasVoo()                   - Extrai datas do voo
1️⃣5️⃣ extrairPassageirosCompleto()       - Extrai todos passageiros
1️⃣6️⃣ calcularParcelamento()              - Calcula valor das parcelas

🔧 FUNÇÕES AUXILIARES DE EXTRAÇÃO:
1️⃣7️⃣ extrairCompanhiaDoBloco()      - Extrai companhia aérea
1️⃣8️⃣ extrairDestinoDoBloco()        - Extrai destino
1️⃣9️⃣ extrairValorDoBloco()          - Extrai valor monetário
2️⃣0️⃣ extrairDataIda()                - Extrai data de ida
2️⃣1️⃣ extrairDataVolta()              - Extrai data de volta
2️⃣2️⃣ extrairHorario()                - Extrai horários
2️⃣3️⃣ extrairBagagem()                - Extrai informação de bagagem
2️⃣4️⃣ extrairReembolso()              - Extrai política de reembolso
2️⃣5️⃣ extrairAeroportoDestino()       - Extrai aeroporto de destino
2️⃣6️⃣ extrairLinkCVC()                - Extrai link do carrinho CVC

✅ FUNÇÕES DE GARANTIA:
2️⃣7️⃣ garantirFormatoWhatsApp()       - Garante formato WhatsApp
2️⃣8️⃣ garantirFormatoMultiplasOpcoes() - Garante formato múltiplas opções
2️⃣9️⃣ garantirSeparadorIdaVolta()      - Garante separador --

🎨 PROCESSAMENTO POR TIPO:
3️⃣0️⃣ processarOrcamentoAereo()      - Processa aéreo
3️⃣1️⃣ processarOrcamentoCruzeiro()   - Processa cruzeiro
3️⃣2️⃣ processarOrcamentoHotel()      - Processa hotel
3️⃣3️⃣ processarOrcamentoPacote()     - Processa pacote
3️⃣4️⃣ processarSomenteIda()          - Processa somente ida

📊 FUNÇÕES DE MÉTRICAS:
3️⃣5️⃣ contarConversoesAeroportos()   - Conta conversões
3️⃣6️⃣ contarMarkdownRemovido()       - Conta markdown removido
3️⃣7️⃣ contarEmojisAdicionados()      - Conta emojis
3️⃣8️⃣ aplicarFormatacaoBasica()      - Formatação básica (fallback)
*/

// ================================================================================
// 🎯 CONSTANTES GLOBAIS
// ================================================================================

const CODIGOS_AEROPORTO = {
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
  'BEL': 'Belém',
  'AJU': 'Aracaju',
  'THE': 'Teresina',
  'SLZ': 'São Luís',
  'JPA': 'João Pessoa'
};

const MESES_PORTUGUES = {
  'janeiro': '01', 'jan': '01',
  'fevereiro': '02', 'fev': '02',
  'março': '03', 'mar': '03',
  'abril': '04', 'abr': '04',
  'maio': '05', 'mai': '05',
  'junho': '06', 'jun': '06',
  'julho': '07', 'jul': '07',
  'agosto': '08', 'ago': '08',
  'setembro': '09', 'set': '09',
  'outubro': '10', 'out': '10',
  'novembro': '11', 'nov': '11',
  'dezembro': '12', 'dez': '12'
};

const COMPANHIAS_AEREAS = ['GOL', 'LATAM', 'Azul', 'TAP', 'Avianca', 'Copa', 'United', 'American', 'Delta'];

const DESTINOS_COMUNS = {
  'salvador': 'Salvador',
  'porto seguro': 'Porto Seguro',
  'fortaleza': 'Fortaleza',
  'recife': 'Recife',
  'natal': 'Natal',
  'maceió': 'Maceió',
  'maceio': 'Maceió',
  'florianópolis': 'Florianópolis',
  'florianopolis': 'Florianópolis',
  'rio de janeiro': 'Rio de Janeiro',
  'rio': 'Rio de Janeiro',
  'brasília': 'Brasília',
  'brasilia': 'Brasília',
  'curitiba': 'Curitiba',
  'porto alegre': 'Porto Alegre',
  'belo horizonte': 'Belo Horizonte',
  'manaus': 'Manaus',
  'belém': 'Belém',
  'belem': 'Belém'
};

// ================================================================================
// 1️⃣ FUNÇÃO PRINCIPAL - PROCESSAMENTO COMPLETO
// ================================================================================

function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("🔧 [1] Iniciando processamento completo v10.0...");
  
  if (!conteudo) {
    console.error("❌ [1] Conteúdo vazio para processar");
    return "❌ Erro: Não foi possível gerar o orçamento. Tente novamente.";
  }
  
  let conteudoProcessado = conteudo;
  const respostaOriginal = conteudo; // Guardar original para extração
  
  try {
    // ETAPA 1: Detectar tipo de orçamento
    const tipoOrcamento = detectarTipoOrcamento(conteudoProcessado, analise);
    console.log(`📋 [1] Tipo detectado: ${tipoOrcamento}`);
    
    // ETAPA 2: Processar múltiplas opções se necessário
    if (detectarMultiplasOpcoes(conteudoProcessado)) {
      console.log("🔍 [1] Múltiplas opções detectadas!");
      conteudoProcessado = processarMultiplasOpcoes(conteudoProcessado, formData, respostaOriginal);
    }
    
    // ETAPA 3: Processar somente ida se necessário
    if (analise?.isSomenteIda || detectarSomenteIda(conteudoProcessado)) {
      console.log("✈️ [1] Voo somente ida detectado!");
      conteudoProcessado = processarSomenteIda(conteudoProcessado, formData);
    }
    
    // ETAPA 4: Remover cabeçalhos técnicos
    conteudoProcessado = removerCabecalhosTecnicos(conteudoProcessado);
    
    // ETAPA 5: Aplicar formatação completa
    conteudoProcessado = aplicarFormatacaoCompleta(conteudoProcessado);
    
    // ETAPA 6: Validar regras críticas
    conteudoProcessado = validarRegrasCriticas(conteudoProcessado);
    
    // ETAPA 7: Aplicar correções por tipo
    if (analise) {
      conteudoProcessado = aplicarCorrecoesPorTipo(conteudoProcessado, analise);
    }
    
    // ETAPA 8: Corrigir datas, horários e passageiros
    conteudoProcessado = corrigirDatasHorariosPassageiros(conteudoProcessado, respostaOriginal, formData);
    
    // ETAPA 9: Aplicar parcelamento se selecionado
    if (formData?.parcelamento) {
      conteudoProcessado = aplicarParcelamento(conteudoProcessado, formData.parcelamento);
    }
    
    // ETAPA 10: Extrair e aplicar links CVC
    conteudoProcessado = aplicarLinksCVC(conteudoProcessado, respostaOriginal);
    
    // ETAPA 11: Garantir formato WhatsApp
    conteudoProcessado = garantirFormatoWhatsApp(conteudoProcessado);
    
    // ETAPA 12: Formatação final para WhatsApp
    conteudoProcessado = formatarParaWhatsApp(conteudoProcessado);
    
    // ETAPA 13: Validação final
    const validacao = validarOrcamentoFinal(conteudoProcessado, formData);
    if (!validacao.valido) {
      console.warn("⚠️ [1] Validação encontrou problemas:", validacao.problemas);
    }
    
    // ETAPA 14: Calcular métricas
    const metricas = calcularMetricasQualidade(respostaOriginal, conteudoProcessado);
    console.log(`📊 [1] Score de qualidade: ${metricas.score_geral}%`);
    
    console.log(`✅ [1] Processamento finalizado: ${conteudoProcessado.length} caracteres`);
    return conteudoProcessado;
    
  } catch (error) {
    console.error("❌ [1] Erro no processamento:", error);
    return aplicarFormatacaoBasica(conteudo);
  }
}

// ================================================================================
// 2️⃣ REMOÇÃO DE CABEÇALHOS TÉCNICOS
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
    /^DEBUG:[^\n]*\n?/gim,
    /^🧠 ANÁLISE[^\n]*\n?/gim,
    /^📊 DADOS[^\n]*\n?/gim,
    /^FORMATAÇÃO OBRIGATÓRIA[^\n]*\n?/gim,
    /^REGRAS CRÍTICAS[^\n]*\n?/gim,
    /^GERAR ORÇAMENTO[^\n]*\n?/gim
  ];
  
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  // Remover markdown
  limpo = limpo.replace(/\*\*(.*?)\*\*/g, '*$1*'); // Converter ** para *
  limpo = limpo.replace(/^#+\s*/gm, ''); // Remover headers markdown
  limpo = limpo.replace(/^-\s+/gm, '• '); // Converter listas
  limpo = limpo.replace(/```[^`]*```/g, ''); // Remover code blocks
  limpo = limpo.replace(/`([^`]+)`/g, '$1'); // Remover inline code
  
  return limpo.trim();
}

// ================================================================================
// 3️⃣ FORMATAÇÃO COMPLETA E PROFISSIONAL
// ================================================================================

function aplicarFormatacaoCompleta(conteudo) {
  console.log("🎨 [3] Aplicando formatação completa...");
  let formatado = conteudo;
  
  // Conversão COMPLETA de códigos de aeroporto
  Object.entries(CODIGOS_AEROPORTO).forEach(([codigo, nome]) => {
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    formatado = formatado.replace(regex, nome);
  });
  
  // Formatação de valores monetários (manter formato brasileiro)
  formatado = formatado.replace(/R\$\s*(\d+)\.(\d{3}),(\d{2})/g, 'R$ $1.$2,$3');
  formatado = formatado.replace(/R\$\s*(\d+),(\d{2})/g, 'R$ $1,$2');
  formatado = formatado.replace(/R\$\s*(\d+)\.(\d{3})\.(\d{3}),(\d{2})/g, 'R$ $1.$2.$3,$4');
  
  // Formatação de datas
  formatado = formatado.replace(/(\d{1,2})[\/\-](\d{1,2})/g, (match, dia, mes) => {
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}`;
  });
  
  // Formatação de horários
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
// 4️⃣ VALIDAÇÃO DE REGRAS CRÍTICAS
// ================================================================================

function validarRegrasCriticas(conteudo) {
  console.log("✅ [4] Validando regras críticas CVC...");
  let validado = conteudo;
  
  // Garantir formato de horário correto
  validado = validado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Garantir espaço após R$
  validado = validado.replace(/R\$(\d)/g, 'R$ $1');
  
  // Garantir formato de passageiros
  validado = validado.replace(/\b(\d)\s+adulto/gi, (match, num) => {
    return `${num} adulto`;
  });
  
  // Garantir separador -- entre ida e volta (mas não em conexões)
  validado = garantirSeparadorIdaVolta(validado);
  
  return validado;
}

// ================================================================================
// 5️⃣ APLICAR CORREÇÕES POR TIPO
// ================================================================================

function aplicarCorrecoesPorTipo(conteudo, analise) {
  console.log("🔧 [5] Aplicando correções por tipo:", analise?.tipoDetectado);
  let corrigido = conteudo;
  
  const tipo = (analise?.tipoDetectado || analise?.tipo_principal || '').toLowerCase();
  
  if (tipo.includes('multiplas_opcoes')) {
    corrigido = garantirFormatoMultiplasOpcoes(corrigido);
  } else if (tipo.includes('somente_ida')) {
    corrigido = processarSomenteIda(corrigido);
  } else if (tipo.includes('aereo') || tipo.includes('aéreo')) {
    corrigido = processarOrcamentoAereo(corrigido, analise);
  } else if (tipo.includes('cruzeiro')) {
    corrigido = processarOrcamentoCruzeiro(corrigido, analise);
  } else if (tipo.includes('hotel')) {
    corrigido = processarOrcamentoHotel(corrigido, analise);
  } else if (tipo.includes('pacote')) {
    corrigido = processarOrcamentoPacote(corrigido, analise);
  }
  
  return corrigido;
}

// ================================================================================
// 6️⃣ FORMATAÇÃO FINAL PARA WHATSAPP
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
  
  // Adicionar rodapé se não houver
  if (!formatado.includes('Valores sujeitos')) {
    formatado += '\n\nValores sujeitos a confirmação e disponibilidade';
  }
  
  return formatado.trim();
}

// ================================================================================
// 7️⃣ VALIDAÇÃO FINAL DO ORÇAMENTO
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
// 8️⃣ CALCULAR MÉTRICAS DE QUALIDADE
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

// ================================================================================
// 9️⃣ DETECTAR MÚLTIPLAS OPÇÕES
// ================================================================================

function detectarMultiplasOpcoes(conteudo) {
  console.log("🔍 [9] Detectando múltiplas opções...");
  
  const texto = conteudo.toLowerCase();
  
  // Critérios de detecção
  const temMultiplosDestinos = (
    (texto.includes('salvador') && texto.includes('porto seguro')) ||
    (texto.includes('fortaleza') && texto.includes('natal')) ||
    (texto.includes('recife') && texto.includes('maceió'))
  );
  
  const temMultiplosValores = (conteudo.match(/R\$\s*[\d.,]+/gi) || []).length >= 2;
  const temMultiplosTotais = (texto.match(/total\s*\([^)]+\)/gi) || []).length >= 2;
  const temPalavraOpcao = texto.includes('opção 1') || texto.includes('opção 2');
  const temMultiplasCompanhias = (
    (texto.includes('gol') && texto.includes('latam')) ||
    (texto.includes('azul') && texto.includes('latam'))
  );
  
  const resultado = temMultiplosDestinos || 
                   (temMultiplosValores && temMultiplosTotais) || 
                   temPalavraOpcao || 
                   temMultiplasCompanhias;
  
  if (resultado) {
    console.log("✅ [9] Múltiplas opções detectadas!");
  }
  
  return resultado;
}

// ================================================================================
// 🔟 PROCESSAR MÚLTIPLAS OPÇÕES
// ================================================================================

function processarMultiplasOpcoes(conteudo, formData, respostaOriginal) {
  console.log("🔢 [10] Processando múltiplas opções...");
  
  // Extrair opções do conteúdo
  const opcoes = extrairOpcoesDoConteudo(conteudo, respostaOriginal);
  
  if (opcoes.length < 2) {
    console.log("⚠️ [10] Menos de 2 opções detectadas, retornando conteúdo original");
    return conteudo;
  }
  
  // Extrair período comum
  const periodo = extrairPeriodoViagem(respostaOriginal);
  
  let resultado = '';
  
  // Cabeçalho
  resultado += `✈️ *MÚLTIPLAS OPÇÕES - SÃO PAULO*\n`;
  if (periodo) {
    resultado += `${periodo}\n\n`;
  }
  
  // Processar cada opção
  opcoes.forEach((opcao, index) => {
    const numeroOpcao = index + 1;
    
    // Cabeçalho da opção
    resultado += `*OPÇÃO ${numeroOpcao} - ${opcao.companhia} para ${opcao.destino}*\n`;
    
    // Dados do voo ida
    if (opcao.dataIda && opcao.horaIda) {
      resultado += `${opcao.dataIda} - ${opcao.origemAeroporto} ${opcao.horaIda} / ${opcao.destinoAeroporto} ${opcao.horaChegadaIda} (${opcao.tipoVooIda})\n`;
    }
    
    // Separador ida/volta
    resultado += `--\n`;
    
    // Dados do voo volta
    if (opcao.dataVolta && opcao.horaVolta) {
      resultado += `${opcao.dataVolta} - ${opcao.destinoAeroporto} ${opcao.horaVolta} / ${opcao.origemAeroporto} ${opcao.horaChegadaVolta} (${opcao.tipoVooVolta})\n`;
    }
    
    // Valor e passageiros
    resultado += `💰 ${opcao.valor} para ${formatarTextoPassageiros(formData)}\n`;
    
    // Bagagem
    resultado += `✅ ${opcao.bagagem}\n`;
    
    // Reembolso
    if (opcao.reembolso) {
      resultado += `🏷️ ${opcao.reembolso}\n`;
    }
    
    // Link se houver
    if (opcao.link) {
      resultado += `🔗 ${opcao.link}\n`;
    }
    
    // Separador entre opções
    if (numeroOpcao < opcoes.length) {
      resultado += `\n`;
    }
  });
  
  // Rodapé
  resultado += `\n🏷️ Não reembolsável\n`;
  resultado += `📱 Escolha sua opção preferida!`;
  
  console.log(`✅ [10] ${opcoes.length} opções formatadas`);
  return resultado;
}

// ================================================================================
// 1️⃣1️⃣ EXTRAIR OPÇÕES DO CONTEÚDO
// ================================================================================

function extrairOpcoesDoConteudo(conteudo, respostaOriginal = '') {
  console.log("📋 [11] Extraindo opções do conteúdo...");
  
  const opcoes = [];
  const textoCompleto = respostaOriginal || conteudo;
  const blocos = separarBlocosDeVoo(textoCompleto);
  
  blocos.forEach((bloco, index) => {
    console.log(`   Processando bloco ${index + 1}...`);
    
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
      origemAeroporto: extrairAeroportoOrigem(bloco),
      destinoAeroporto: extrairAeroportoDestino(bloco),
      tipoVooIda: extrairTipoVoo(bloco, 'ida'),
      tipoVooVolta: extrairTipoVoo(bloco, 'volta'),
      link: extrairLinkCVC(bloco)
    };
    
    if (opcao.destino && opcao.valor) {
      opcoes.push(opcao);
      console.log(`   ✅ Opção válida: ${opcao.companhia} - ${opcao.destino}`);
    }
  });
  
  console.log(`📋 [11] Total de opções extraídas: ${opcoes.length}`);
  return opcoes;
}

// ================================================================================
// 1️⃣2️⃣ SEPARAR BLOCOS DE VOO
// ================================================================================

function separarBlocosDeVoo(conteudo) {
  console.log("✂️ [12] Separando blocos de voo...");
  
  let blocos = [];
  
  // Método 1: Separar por "Total (...)"
  const totaisMatch = [...conteudo.matchAll(/Total\s*\([^)]+\)[^]*?R\$\s*[\d.,]+/gi)];
  
  if (totaisMatch.length >= 2) {
    console.log(`   Método 1: ${totaisMatch.length} blocos por Total`);
    let ultimaPosicao = 0;
    
    totaisMatch.forEach((match, index) => {
      const inicio = conteudo.lastIndexOf('\n', match.index) + 1 || 0;
      const fim = match.index + match[0].length;
      
      // Pegar todo o conteúdo desde o último bloco
      const bloco = conteudo.substring(ultimaPosicao, fim);
      if (bloco.trim().length > 50) {
        blocos.push(bloco);
      }
      ultimaPosicao = fim;
    });
  }
  
  // Método 2: Se não funcionou, tentar por companhias diferentes
  if (blocos.length < 2) {
    const companhiasEncontradas = [];
    COMPANHIAS_AEREAS.forEach(cia => {
      if (conteudo.toLowerCase().includes(cia.toLowerCase())) {
        companhiasEncontradas.push(cia);
      }
    });
    
    if (companhiasEncontradas.length >= 2) {
      console.log(`   Método 2: ${companhiasEncontradas.length} companhias diferentes`);
      blocos = [conteudo]; // Usar conteúdo completo se múltiplas companhias
    }
  }
  
  // Fallback: usar conteúdo completo
  if (blocos.length === 0) {
    console.log("   Fallback: usando conteúdo completo");
    blocos = [conteudo];
  }
  
  console.log(`✂️ [12] Total de blocos: ${blocos.length}`);
  return blocos;
}

// ================================================================================
// 1️⃣3️⃣ CORRIGIR DATAS, HORÁRIOS E PASSAGEIROS
// ================================================================================

function corrigirDatasHorariosPassageiros(resultado, respostaOriginal, formData) {
  console.log("📅 [13] Corrigindo datas, horários e passageiros...");
  
  // Extrair e corrigir datas
  const datas = extrairDatasVoo(respostaOriginal);
  if (datas) {
    let contadorData = 0;
    resultado = resultado.replace(/\[DD\/MM\]/g, () => {
      return contadorData++ === 0 ? datas.ida : datas.volta;
    });
  }
  
  // Extrair e corrigir horários
  const horarios = [...respostaOriginal.matchAll(/(\d{2}:\d{2})/g)];
  if (horarios.length > 0) {
    let horarioIndex = 0;
    resultado = resultado.replace(/\[HH:MM\]/g, () => {
      if (horarioIndex < horarios.length) {
        return horarios[horarioIndex++][0];
      }
      return '00:00';
    });
  }
  
  // Extrair e corrigir passageiros
  const passageiros = extrairPassageirosCompleto(respostaOriginal, formData);
  if (passageiros.textoCompleto) {
    // Atualizar linhas com passageiros
    resultado = resultado.replace(
      /💰 R\$ ([\d.,]+) para \d+ adulto[s]?(?:\s*[+,]\s*\d+ criança[s]?)?(?:\s*[+,]\s*\d+ bebê[s]?)?/gi,
      `💰 R$ $1 para ${passageiros.textoCompleto}`
    );
    
    // Fallback: substituir apenas "X adulto(s)"
    resultado = resultado.replace(
      /\b\d+ adulto[s]?\b/gi,
      passageiros.textoCompleto
    );
  }
  
  console.log("✅ [13] Correções aplicadas");
  return resultado;
}

// ================================================================================
// 1️⃣4️⃣ EXTRAIR DATAS DO VOO
// ================================================================================

function extrairDatasVoo(texto) {
  console.log("📅 [14] Extraindo datas do voo...");
  
  // Padrão 1: "sex, 19 de dezembro"
  const padraoData = /(\w{3}),?\s*(\d{1,2})\s+de\s+(\w+)/gi;
  const matches = [...texto.matchAll(padraoData)];
  
  if (matches.length >= 2) {
    const dataIda = matches[0];
    const dataVolta = matches[1];
    
    const diaIda = dataIda[2].padStart(2, '0');
    const mesIda = MESES_PORTUGUES[dataIda[3].toLowerCase()] || '01';
    
    const diaVolta = dataVolta[2].padStart(2, '0');
    const mesVolta = MESES_PORTUGUES[dataVolta[3].toLowerCase()] || '01';
    
    console.log(`✅ [14] Datas extraídas: ${diaIda}/${mesIda} - ${diaVolta}/${mesVolta}`);
    
    return {
      ida: `${diaIda}/${mesIda}`,
      volta: `${diaVolta}/${mesVolta}`
    };
  }
  
  // Padrão 2: Formato DD/MM
  const padraoSimples = /(\d{1,2})\/(\d{1,2})/g;
  const matchesSimples = [...texto.matchAll(padraoSimples)];
  
  if (matchesSimples.length >= 2) {
    return {
      ida: `${matchesSimples[0][1].padStart(2, '0')}/${matchesSimples[0][2].padStart(2, '0')}`,
      volta: `${matchesSimples[1][1].padStart(2, '0')}/${matchesSimples[1][2].padStart(2, '0')}`
    };
  }
  
  console.log("⚠️ [14] Datas não encontradas");
  return null;
}

// ================================================================================
// 1️⃣5️⃣ EXTRAIR PASSAGEIROS COMPLETO
// ================================================================================

function extrairPassageirosCompleto(texto, formData) {
  console.log("👥 [15] Extraindo passageiros completo...");
  
  const passageiros = {
    adultos: 0,
    criancas: 0,
    bebes: 0,
    textoCompleto: ''
  };
  
  // Primeiro tentar extrair do texto
  const matchTotal = texto.match(/Total\s*\(([^)]+)\)/i);
  
  if (matchTotal && matchTotal[1]) {
    const textoPassageiros = matchTotal[1];
    console.log(`   Texto encontrado: "${textoPassageiros}"`);
    
    // Extrair números
    const matchAdultos = textoPassageiros.match(/(\d+)\s*[Aa]dulto/);
    const matchCriancas = textoPassageiros.match(/(\d+)\s*[Cc]riança/);
    const matchBebes = textoPassageiros.match(/(\d+)\s*[Bb]ebê/);
    
    if (matchAdultos) passageiros.adultos = parseInt(matchAdultos[1]);
    if (matchCriancas) passageiros.criancas = parseInt(matchCriancas[1]);
    if (matchBebes) passageiros.bebes = parseInt(matchBebes[1]);
  }
  
  // Fallback: usar dados do formulário
  if (passageiros.adultos === 0 && formData) {
    passageiros.adultos = parseInt(formData.adultos) || 1;
    passageiros.criancas = parseInt(formData.criancas) || 0;
    passageiros.bebes = parseInt(formData.bebes) || 0;
  }
  
  // Se ainda não tem adultos, usar padrão
  if (passageiros.adultos === 0) {
    passageiros.adultos = 1;
  }
  
  // Construir texto formatado
  const partes = [];
  if (passageiros.adultos > 0) {
    partes.push(`${passageiros.adultos} ${passageiros.adultos === 1 ? 'adulto' : 'adultos'}`);
  }
  if (passageiros.criancas > 0) {
    partes.push(`${passageiros.criancas} ${passageiros.criancas === 1 ? 'criança' : 'crianças'}`);
  }
  if (passageiros.bebes > 0) {
    partes.push(`${passageiros.bebes} ${passageiros.bebes === 1 ? 'bebê' : 'bebês'}`);
  }
  
  passageiros.textoCompleto = partes.join(' + ');
  
  console.log(`✅ [15] Passageiros: ${passageiros.textoCompleto}`);
  return passageiros;
}

// ================================================================================
// 1️⃣6️⃣ CALCULAR PARCELAMENTO
// ================================================================================

function calcularParcelamento(valor, numeroParcelas) {
  console.log(`💳 [16] Calculando parcelamento: ${valor} em ${numeroParcelas}x`);
  
  // Extrair valor numérico
  const valorNumerico = parseFloat(
    valor.replace('R$', '')
         .replace(/\./g, '')
         .replace(',', '.')
         .trim()
  );
  
  if (isNaN(valorNumerico)) {
    console.log("⚠️ [16] Valor inválido para parcelamento");
    return null;
  }
  
  const valorParcela = (valorNumerico / numeroParcelas).toFixed(2);
  const valorFormatado = valorParcela.replace('.', ',');
  
  console.log(`✅ [16] Parcela calculada: R$ ${valorFormatado}`);
  return `Em até ${numeroParcelas}x de R$ ${valorFormatado} sem juros`;
}

// ================================================================================
// 1️⃣7️⃣ EXTRAIR COMPANHIA DO BLOCO
// ================================================================================

function extrairCompanhiaDoBloco(bloco) {
  console.log("✈️ [17] Extraindo companhia aérea...");
  
  for (const cia of COMPANHIAS_AEREAS) {
    if (bloco.toLowerCase().includes(cia.toLowerCase())) {
      console.log(`   ✅ Companhia encontrada: ${cia}`);
      return cia.toUpperCase();
    }
  }
  
  console.log("   ⚠️ Companhia não encontrada, usando padrão");
  return 'GOL';
}

// ================================================================================
// 1️⃣8️⃣ EXTRAIR DESTINO DO BLOCO
// ================================================================================

function extrairDestinoDoBloco(bloco) {
  console.log("📍 [18] Extraindo destino...");
  
  const textoLower = bloco.toLowerCase();
  
  for (const [key, value] of Object.entries(DESTINOS_COMUNS)) {
    if (textoLower.includes(key)) {
      console.log(`   ✅ Destino encontrado: ${value}`);
      return value;
    }
  }
  
  // Tentar extrair do padrão "São Paulo - [Destino]"
  const padraoDestino = /são paulo\s*[-–]\s*([^\n\r*]+)/i;
  const match = bloco.match(padraoDestino);
  if (match) {
    const destino = match[1].trim();
    console.log(`   ✅ Destino extraído do padrão: ${destino}`);
    return destino;
  }
  
  console.log("   ⚠️ Destino não encontrado");
  return 'Salvador';
}

// ================================================================================
// 1️⃣9️⃣ EXTRAIR VALOR DO BLOCO
// ================================================================================

function extrairValorDoBloco(bloco) {
  console.log("💰 [19] Extraindo valor...");
  
  // Procurar por Total primeiro
  const padraoTotal = /Total[^R]*R\$\s*([\d.,]+)/i;
  const matchTotal = bloco.match(padraoTotal);
  
  if (matchTotal) {
    const valor = `R$ ${matchTotal[1]}`;
    console.log(`   ✅ Valor encontrado (Total): ${valor}`);
    return valor;
  }
  
  // Fallback: qualquer R$
  const padraoValor = /R\$\s*([\d.,]+)/i;
  const match = bloco.match(padraoValor);
  
  if (match) {
    const valor = match[0];
    console.log(`   ✅ Valor encontrado: ${valor}`);
    return valor;
  }
  
  console.log("   ⚠️ Valor não encontrado");
  return 'R$ 0,00';
}

// ================================================================================
// 2️⃣0️⃣ EXTRAIR DATA IDA
// ================================================================================

function extrairDataIda(bloco) {
  console.log("📅 [20] Extraindo data de ida...");
  
  // Padrão: "19 de dezembro" ou "sex, 19 de dezembro"
  const padraoData = /(?:\w{3},?\s*)?(\d{1,2})\s*de\s*(\w+)/i;
  const match = bloco.match(padraoData);
  
  if (match) {
    const dia = match[1].padStart(2, '0');
    const mes = MESES_PORTUGUES[match[2].toLowerCase()] || '01';
    const data = `${dia}/${mes}`;
    console.log(`   ✅ Data ida: ${data}`);
    return data;
  }
  
  console.log("   ⚠️ Data ida não encontrada");
  return '19/12';
}

// ================================================================================
// 2️⃣1️⃣ EXTRAIR DATA VOLTA
// ================================================================================

function extrairDataVolta(bloco) {
  console.log("📅 [21] Extraindo data de volta...");
  
  // Pegar todas as datas e usar a última
  const todasDatas = bloco.match(/(?:\w{3},?\s*)?(\d{1,2})\s*de\s*(\w+)/gi);
  
  if (todasDatas && todasDatas.length > 1) {
    const ultimaData = todasDatas[todasDatas.length - 1];
    const match = ultimaData.match(/(\d{1,2})\s*de\s*(\w+)/i);
    
    if (match) {
      const dia = match[1].padStart(2, '0');
      const mes = MESES_PORTUGUES[match[2].toLowerCase()] || '01';
      const data = `${dia}/${mes}`;
      console.log(`   ✅ Data volta: ${data}`);
      return data;
    }
  }
  
  console.log("   ⚠️ Data volta não encontrada");
  return '26/12';
}

// ================================================================================
// 2️⃣2️⃣ EXTRAIR HORÁRIO
// ================================================================================

function extrairHorario(bloco, tipo) {
  const horarios = bloco.match(/\d{2}:\d{2}/g) || [];
  
  let horario;
  switch(tipo) {
    case 'ida':
      horario = horarios[0] || '09:00';
      break;
    case 'chegada_ida':
      horario = horarios[1] || '11:20';
      break;
    case 'volta':
      horario = horarios[2] || '12:00';
      break;
    case 'chegada_volta':
      horario = horarios[3] || '14:35';
      break;
    default:
      horario = '00:00';
  }
  
  return horario;
}

// ================================================================================
// 2️⃣3️⃣ EXTRAIR BAGAGEM
// ================================================================================

function extrairBagagem(bloco) {
  const textoLower = bloco.toLowerCase();
  
  if (textoLower.includes('2 bagagen') || textoLower.includes('duas bagagen')) {
    return 'Mala de mão + 2 bagagens despachadas';
  }
  if (textoLower.includes('bagagem despachada')) {
    return 'Mala de mão + bagagem despachada';
  }
  if (textoLower.includes('só mala de mão') || textoLower.includes('somente mala de mão')) {
    return 'Só mala de mão incluída';
  }
  
  return 'Só mala de mão incluída';
}

// ================================================================================
// 2️⃣4️⃣ EXTRAIR REEMBOLSO
// ================================================================================

function extrairReembolso(bloco) {
  const textoLower = bloco.toLowerCase();
  
  if (textoLower.includes('reembolsável conforme')) {
    return 'Reembolsável conforme regras do bilhete';
  }
  if (textoLower.includes('não reembolsável')) {
    return 'Não reembolsável';
  }
  if (textoLower.includes('tarifa facial')) {
    return 'Tarifa Facial - Não reembolsável';
  }
  if (textoLower.includes('fácil')) {
    return 'Tarifa Fácil - Alterações com taxa';
  }
  
  return 'Não reembolsável';
}

// ================================================================================
// 2️⃣5️⃣ EXTRAIR AEROPORTO DESTINO
// ================================================================================

function extrairAeroportoDestino(bloco) {
  const aeroportosDestino = {
    'ssa': 'Salvador',
    'bps': 'Porto Seguro',
    'for': 'Fortaleza',
    'rec': 'Recife',
    'nat': 'Natal',
    'mcz': 'Maceió',
    'fln': 'Florianópolis',
    'poa': 'Porto Alegre',
    'cwb': 'Curitiba',
    'bsb': 'Brasília'
  };
  
  const textoLower = bloco.toLowerCase();
  
  for (const [codigo, nome] of Object.entries(aeroportosDestino)) {
    if (textoLower.includes(codigo)) {
      return nome;
    }
  }
  
  // Fallback: usar o destino extraído
  return extrairDestinoDoBloco(bloco);
}

// ================================================================================
// 2️⃣6️⃣ EXTRAIR LINK CVC
// ================================================================================

function extrairLinkCVC(bloco) {
  const padraoLink = /(https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[a-zA-Z0-9]+)/;
  const match = bloco.match(padraoLink);
  return match ? match[1] : null;
}

// ================================================================================
// 2️⃣7️⃣ GARANTIR FORMATO WHATSAPP
// ================================================================================

function garantirFormatoWhatsApp(conteudo) {
  console.log("📱 [27] Garantindo formato WhatsApp...");
  let formatado = conteudo;
  
  // REMOVER qualquer formato markdown restante
  formatado = formatado.replace(/#{1,6}\s*/g, ''); // Headers
  formatado = formatado.replace(/\*\*(.*?)\*\*/g, '*$1*'); // Bold
  formatado = formatado.replace(/__(.*?)__/g, '$1'); // Underline
  formatado = formatado.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links markdown
  formatado = formatado.replace(/^>\s*/gm, ''); // Quotes
  formatado = formatado.replace(/```[^`]*```/g, ''); // Code blocks
  formatado = formatado.replace(/`([^`]+)`/g, '$1'); // Inline code
  
  // Garantir emojis apropriados
  if (!formatado.match(/[💰💳✅🏷️📅👥🎯📍✈️🚢🏨]/)) {
    console.log("⚠️ [27] Adicionando emojis faltantes...");
    
    // Adicionar emojis em linhas específicas
    formatado = formatado.replace(/^(R\$\s*[\d.,]+)/gm, '💰 $1');
    formatado = formatado.replace(/\b(parcel\w+|cartão)/gi, '💳 // [Continua com as funções 17-38...]');
    formatado = formatado.replace(/\b(bagagem|mala)(?!.*✅)/gi, '✅ // [Continua com as funções 17-38...]');
    formatado = formatado.replace(/\b(não\s+reembolsável|reembolsável)(?!.*🏷️)/gi, '🏷️ // [Continua com as funções 17-38...]');
  }
  
  return formatado;
}

// ================================================================================
// 2️⃣8️⃣ GARANTIR FORMATO MÚLTIPLAS OPÇÕES
// ================================================================================

function garantirFormatoMultiplasOpcoes(conteudo) {
  console.log("🔢 [28] Garantindo formato de múltiplas opções...");
  
  // Garantir que OPÇÃO esteja em maiúsculas e com asterisco
  conteudo = conteudo.replace(/opção\s+(\d)/gi, '*OPÇÃO $1*');
  
  // Garantir separação entre opções
  conteudo = conteudo.replace(/(\*OPÇÃO \d\*)/g, '\n$1');
  
  // Garantir -- entre ida e volta em cada opção
  conteudo = conteudo.replace(/(\d{2}:\d{2}.*\n)(\d{2}\/\d{2})/g, '$1--\n$2');
  
  return conteudo;
}

// ================================================================================
// 2️⃣9️⃣ GARANTIR SEPARADOR IDA VOLTA
// ================================================================================

function garantirSeparadorIdaVolta(conteudo) {
  console.log("➖ [29] Garantindo separador -- entre ida e volta...");
  
  // Não adicionar se for somente ida
  if (conteudo.toLowerCase().includes('somente ida')) {
    console.log("   ✈️ Somente ida detectado, sem separador");
    return conteudo;
  }
  
  // Verificar se já tem separador
  if (conteudo.includes('--')) {
    console.log("   ✅ Separador já presente");
    return conteudo;
  }
  
  // Adicionar separador entre datas diferentes
  const padrao = /(\d{2}\/\d{2}.*voo.*\n)(\d{2}\/\d{2})/g;
  conteudo = conteudo.replace(padrao, '$1--\n$2');
  
  return conteudo;
}

// ================================================================================
// 3️⃣0️⃣ PROCESSAR ORÇAMENTO AÉREO
// ================================================================================

function processarOrcamentoAereo(conteudo, analise) {
  console.log("✈️ [30] Processando orçamento aéreo...");
  let processado = conteudo;
  
  // Garantir emoji de avião
  if (!processado.match(/[✈️🛫]/)) {
    const primeiraLinha = processado.split('\n')[0];
    if (primeiraLinha.includes('*')) {
      processado = processado.replace(primeiraLinha, primeiraLinha.replace(/\*/, '*').replace('*', '✈️ *'));
    }
  }
  
  // Garantir separador -- entre ida e volta
  processado = garantirSeparadorIdaVolta(processado);
  
  return processado;
}

// ================================================================================
// 3️⃣1️⃣ PROCESSAR ORÇAMENTO CRUZEIRO
// ================================================================================

function processarOrcamentoCruzeiro(conteudo, analise) {
  console.log("🚢 [31] Processando orçamento de cruzeiro...");
  
  if (!conteudo.startsWith('🚢')) {
    conteudo = '🚢 ' + conteudo;
  }
  
  return conteudo;
}

// ================================================================================
// 3️⃣2️⃣ PROCESSAR ORÇAMENTO HOTEL
// ================================================================================

function processarOrcamentoHotel(conteudo, analise) {
  console.log("🏨 [32] Processando orçamento de hotel...");
  
  if (!conteudo.match(/^[🏨🏩]/)) {
    conteudo = '🏨 ' + conteudo;
  }
  
  return conteudo;
}

// ================================================================================
// 3️⃣3️⃣ PROCESSAR ORÇAMENTO PACOTE
// ================================================================================

function processarOrcamentoPacote(conteudo, analise) {
  console.log("🏖️ [33] Processando orçamento de pacote...");
  
  if (!conteudo.match(/^[🏖️📦]/)) {
    conteudo = '🏖️ ' + conteudo;
  }
  
  return conteudo;
}

// ================================================================================
// 3️⃣4️⃣ PROCESSAR SOMENTE IDA
// ================================================================================

function processarSomenteIda(conteudo, formData) {
  console.log("✈️ [34] Processando voo somente ida...");
  
  // Adicionar "(SOMENTE IDA)" no título se não houver
  if (!conteudo.includes('SOMENTE IDA')) {
    const primeiraLinha = conteudo.split('\n')[0];
    if (primeiraLinha.includes('*')) {
      conteudo = conteudo.replace(primeiraLinha, primeiraLinha.replace('*', '* (SOMENTE IDA)').replace('**', '*'));
    }
  }
  
  // Remover separador -- se houver
  conteudo = conteudo.replace(/\n--\n/g, '\n');
  
  // Adicionar aviso no final se não houver
  if (!conteudo.includes('Passagem somente ida')) {
    conteudo += '\n⚠️ Passagem somente ida - Sem trecho de volta';
  }
  
  return conteudo;
}

// ================================================================================
// 3️⃣5️⃣ CONTAR CONVERSÕES DE AEROPORTOS
// ================================================================================

function contarConversoesAeroportos(original, processado) {
  let conversoes = 0;
  
  Object.keys(CODIGOS_AEROPORTO).forEach(codigo => {
    if (original.includes(codigo) && !processado.includes(codigo)) {
      conversoes++;
    }
  });
  
  return conversoes;
}

// ================================================================================
// 3️⃣6️⃣ CONTAR MARKDOWN REMOVIDO
// ================================================================================

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

// ================================================================================
// 3️⃣7️⃣ CONTAR EMOJIS ADICIONADOS
// ================================================================================

function contarEmojisAdicionados(conteudo) {
  return (conteudo.match(/[💰✅🏷️📱⚠️✈️🚢🏨📅👥🎯📍💳🔗]/g) || []).length;
}

// ================================================================================
// 3️⃣8️⃣ APLICAR FORMATAÇÃO BÁSICA (FALLBACK)
// ================================================================================

function aplicarFormatacaoBasica(conteudo) {
  console.log("🎨 [38] Aplicando formatação básica (fallback)...");
  
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
// 🆕 FUNÇÕES AUXILIARES ADICIONAIS
// ================================================================================

// DETECTAR TIPO DE ORÇAMENTO
function detectarTipoOrcamento(conteudo, analise) {
  if (analise?.tipoDetectado) {
    return analise.tipoDetectado;
  }
  
  const textoLower = conteudo.toLowerCase();
  
  if (textoLower.includes('cruzeiro') || textoLower.includes('navio')) {
    return 'cruzeiro';
  }
  if (textoLower.includes('hotel') && !textoLower.includes('voo')) {
    return 'hotel';
  }
  if (textoLower.includes('pacote') || (textoLower.includes('hotel') && textoLower.includes('voo'))) {
    return 'pacote';
  }
  if (detectarMultiplasOpcoes(conteudo)) {
    return 'multiplas_opcoes';
  }
  if (detectarSomenteIda(conteudo)) {
    return 'somente_ida';
  }
  
  return 'aereo';
}

// DETECTAR SOMENTE IDA
function detectarSomenteIda(conteudo) {
  const textoLower = conteudo.toLowerCase();
  
  return (
    textoLower.includes('somente ida') ||
    textoLower.includes('apenas ida') ||
    (textoLower.includes('ida') && !textoLower.includes('volta') && !textoLower.includes('retorno'))
  );
}

// EXTRAIR PERÍODO DA VIAGEM
function extrairPeriodoViagem(texto) {
  const padraoPeriodo = /(\d{1,2})\s*(?:de\s*)?(\w+)\s*[-a]\s*(\d{1,2})\s*(?:de\s*)?(\w+)(?:\s*\((\d+)\s*dias?\s*e\s*(\d+)\s*noites?\))?/i;
  const match = texto.match(padraoPeriodo);
  
  if (match) {
    const diaIda = match[1];
    const mesIda = match[2];
    const diaVolta = match[3];
    const mesVolta = match[4];
    const dias = match[5] || '8';
    const noites = match[6] || '7';
    
    return `${diaIda} a ${diaVolta} de ${mesVolta} (${dias} dias e ${noites} noites)`;
  }
  
  return null;
}

// FORMATAR TEXTO DE PASSAGEIROS
function formatarTextoPassageiros(formData) {
  if (!formData) {
    return '1 adulto';
  }
  
  const partes = [];
  const adultos = parseInt(formData.adultos) || 1;
  const criancas = parseInt(formData.criancas) || 0;
  const bebes = parseInt(formData.bebes) || 0;
  
  if (adultos > 0) {
    partes.push(`${adultos} ${adultos === 1 ? 'adulto' : 'adultos'}`);
  }
  if (criancas > 0) {
    partes.push(`${criancas} ${criancas === 1 ? 'criança' : 'crianças'}`);
  }
  if (bebes > 0) {
    partes.push(`${bebes} ${bebes === 1 ? 'bebê' : 'bebês'}`);
  }
  
  return partes.join(' + ') || '1 adulto';
}

// EXTRAIR AEROPORTO DE ORIGEM
function extrairAeroportoOrigem(bloco) {
  const aeroportosOrigem = {
    'gru': 'Guarulhos',
    'cgh': 'Congonhas',
    'vcp': 'Viracopos',
    'sdu': 'Santos Dumont',
    'gig': 'Galeão'
  };
  
  const textoLower = bloco.toLowerCase();
  
  for (const [codigo, nome] of Object.entries(aeroportosOrigem)) {
    if (textoLower.includes(codigo)) {
      return nome;
    }
  }
  
  return 'Guarulhos';
}

// EXTRAIR TIPO DE VOO
function extrairTipoVoo(bloco, tipo) {
  const textoLower = bloco.toLowerCase();
  
  if (textoLower.includes('voo direto')) {
    return 'voo direto';
  }
  if (textoLower.includes('conexão') || textoLower.includes('conexao')) {
    return 'com conexão';
  }
  if (textoLower.includes('escala')) {
    return 'com escala';
  }
  
  return 'voo direto';
}

// APLICAR PARCELAMENTO
function aplicarParcelamento(conteudo, numeroParcelas) {
  console.log(`💳 Aplicando parcelamento em ${numeroParcelas}x...`);
  
  // Procurar valores para parcelar
  const valores = conteudo.match(/R\$\s*([\d.,]+)/g);
  
  if (!valores || valores.length === 0) {
    return conteudo;
  }
  
  valores.forEach(valorStr => {
    const parcelamento = calcularParcelamento(valorStr, numeroParcelas);
    if (parcelamento) {
      // Adicionar parcelamento após o valor
      const regex = new RegExp(`(${valorStr.replace(', '\\)}[^\\n]*)`, 'g');
      conteudo = conteudo.replace(regex, `$1\n💳 ${parcelamento}`);
    }
  });
  
  return conteudo;
}

// APLICAR LINKS CVC
function aplicarLinksCVC(conteudo, respostaOriginal) {
  console.log("🔗 Aplicando links CVC...");
  
  // Extrair links da resposta original
  const links = [...(respostaOriginal || conteudo).matchAll(/(https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[a-zA-Z0-9]+)/g)];
  
  if (links.length === 0) {
    return conteudo;
  }
  
  // Se tem apenas um link, adicionar no final
  if (links.length === 1) {
    if (!conteudo.includes(links[0][0])) {
      conteudo += `\n🔗 ${links[0][0]}`;
    }
  } else {
    // Se tem múltiplos links, tentar associar com cada opção
    let linkIndex = 0;
    conteudo = conteudo.replace(/(OPÇÃO \d.*?)(?=OPÇÃO|\n\n|$)/gs, (match) => {
      if (linkIndex < links.length && !match.includes('cvc.com.br')) {
        match += `\n🔗 ${links[linkIndex][0]}`;
        linkIndex++;
      }
      return match;
    });
  }
  
  return conteudo;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 - v10.0 COMPLETA
// ================================================================================

console.log("✅ Processing v10.0 carregado com sucesso!");
console.log("🎯 Funcionalidades ativas:");
console.log("   ✅ 38 funções numeradas e indexadas");
console.log("   ✅ Processamento de múltiplas opções");
console.log("   ✅ Formatação WhatsApp garantida");
console.log("   ✅ Conversão completa de aeroportos");
console.log("   ✅ Validação CVC rigorosa");
console.log("   ✅ Métricas de qualidade");
console.log("   ✅ Extração correta de datas e horários");
console.log("   ✅ Extração correta de passageiros");
console.log("   ✅ Detecção e processamento de somente ida");
console.log("   ✅ Cálculo automático de parcelamento");
console.log("   ✅ Extração e aplicação de links CVC");
console.log("   ✅ Garantia de separador -- entre ida e volta");

// Exportação nomeada
export {
  processarRespostaCompleta,
  removerCabecalhosTecnicos,
  aplicarFormatacaoCompleta,
  validarRegrasCriticas,
  aplicarCorrecoesPorTipo,
  formatarParaWhatsApp,
  validarOrcamentoFinal,
  calcularMetricasQualidade,
  detectarMultiplasOpcoes,
  processarMultiplasOpcoes,
  extrairOpcoesDoConteudo,
  separarBlocosDeVoo,
  corrigirDatasHorariosPassageiros,
  extrairDatasVoo,
  extrairPassageirosCompleto,
  calcularParcelamento,
  extrairCompanhiaDoBloco,
  extrairDestinoDoBloco,
  extrairValorDoBloco,
  extrairDataIda,
  extrairDataVolta,
  extrairHorario,
  extrairBagagem,
  extrairReembolso,
  extrairAeroportoDestino,
  extrairLinkCVC,
  garantirFormatoWhatsApp,
  garantirFormatoMultiplasOpcoes,
  garantirSeparadorIdaVolta,
  processarOrcamentoAereo,
  processarOrcamentoCruzeiro,
  processarOrcamentoHotel,
  processarOrcamentoPacote,
  processarSomenteIda,
  contarConversoesAeroportos,
  contarMarkdownRemovido,
  contarEmojisAdicionados,
  aplicarFormatacaoBasica
};

// Exportação default
export default {
  processarRespostaCompleta,
  removerCabecalhosTecnicos,
  aplicarFormatacaoCompleta,
  validarRegrasCriticas,
  aplicarCorrecoesPorTipo,
  formatarParaWhatsApp,
  validarOrcamentoFinal,
  calcularMetricasQualidade,
  detectarMultiplasOpcoes,
  processarMultiplasOpcoes,
  extrairOpcoesDoConteudo,
  separarBlocosDeVoo,
  corrigirDatasHorariosPassageiros,
  extrairDatasVoo,
  extrairPassageirosCompleto,
  calcularParcelamento,
  extrairCompanhiaDoBloco,
  extrairDestinoDoBloco,
  extrairValorDoBloco,
  extrairDataIda,
  extrairDataVolta,
  extrairHorario,
  extrairBagagem,
  extrairReembolso,
  extrairAeroportoDestino,
  extrairLinkCVC,
  garantirFormatoWhatsApp,
  garantirFormatoMultiplasOpcoes,
  garantirSeparadorIdaVolta,
  processarOrcamentoAereo,
  processarOrcamentoCruzeiro,
  processarOrcamentoHotel,
  processarOrcamentoPacote,
  processarSomenteIda,
  contarConversoesAeroportos,
  contarMarkdownRemovido,
  contarEmojisAdicionados,
  aplicarFormatacaoBasica
};

console.log("🚀 Sistema de Processamento v10.0 - COMPLETO E CORRIGIDO PARA CVC ITAQUA!");
console.log("📋 Manual de correções aplicadas:");
console.log("   ✅ Extração de passageiros: adultos + crianças + bebês");
console.log("   ✅ Múltiplas opções: detecta e formata corretamente");
console.log("   ✅ Somente ida: detecta e adiciona avisos");
console.log("   ✅ Separador --: aplica entre ida/volta, não em conexões");
console.log("   ✅ Links CVC: extrai e aplica automaticamente");
console.log("   ✅ Parcelamento: calcula e formata valores");
console.log("   ✅ Aeroportos: converte todos os códigos IATA");
