// 🎯 prompts.js - v12.0 - SISTEMA UNIFICADO INTELIGENTE
// FUSÃO: Lê TUDO simultaneamente (HTML + Texto + PDF + Imagem)
// PRIORIDADE: Hierarquia inteligente de confiabilidade das fontes
// ARQUITETURA: Modular com seções numeradas para manutenção

console.log("🎯 Prompts v12.0 - SISTEMA UNIFICADO INTELIGENTE CARREGADO");

// ================================================================================
// 📋 ÍNDICE DAS SEÇÕES
// ================================================================================
/*
1. 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
2. 🧠 FUSÃO INTELIGENTE DE FONTES (NÚCLEO DO SISTEMA)
3. 🔍 ANÁLISE E PRIORIZAÇÃO DE DADOS
4. ⚙️ DETERMINAÇÃO DE ESTRATÉGIA
5. 🎯 SELEÇÃO DE PROMPT POR TIPO
6. ✈️ PROMPTS ESPECÍFICOS POR TIPO (10 tipos)
7. 🏨 PROMPTS PARA HOTÉIS E PACOTES
8. 🚢 PROMPTS PARA CRUZEIROS
9. 🔧 ENRIQUECIMENTO E OTIMIZAÇÃO
10. 📊 FUNÇÕES AUXILIARES E LOGS
11. 📸 ANÁLISE DE IMAGENS E PDFs
12. 🔧 UTILITÁRIOS E VALIDAÇÃO
13. 🚀 EXPORTAÇÕES E LOGS FINAIS
*/

// ================================================================================
// 1. 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v12.0 - SISTEMA UNIFICADO...");
  
  try {
    // ETAPA 1: FUSÃO INTELIGENTE DE TODAS AS FONTES
    console.log("🧠 Iniciando fusão inteligente de fontes...");
    const contextoUnificado = construirContextoUnificado(formData, analise);
    
    // ETAPA 2: Se houver imagem, usar prompt específico
    if (formData.imagemBase64) {
      console.log("📸 Detectada imagem, usando prompt de análise visual.");
      return gerarPromptAnaliseImagem(formData, contextoUnificado);
    }

    // ETAPA 3: Fluxo normal com contexto unificado
    const estrategia = determinarEstrategia(analise, contextoUnificado);
    const promptEspecifico = selecionarPromptPorTipo(
      contextoUnificado.tipoDetectado, 
      contextoUnificado, 
      estrategia
    );
    
    const promptFinal = enriquecerPrompt(promptEspecifico, formData, analise, contextoUnificado);
    const promptOtimizado = otimizarPromptFinal(promptFinal, { max_tokens: 4096 });
    
    logPromptGerado(promptOtimizado, analise, estrategia, contextoUnificado);
    
    console.log(`✅ Prompt unificado gerado: ${promptOtimizado.length} caracteres`);
    console.log(`🎯 Fontes processadas: ${contextoUnificado.fontesProcessadas.join(', ')}`);
    
    return promptOtimizado;
    
  } catch (error) {
    console.error("❌ Erro na geração do prompt unificado:", error);
    return gerarPromptFallback(formData);
  }
}

// ================================================================================
// 2. 🧠 FUSÃO INTELIGENTE DE FONTES (NÚCLEO DO SISTEMA)
// ================================================================================

function construirContextoUnificado(formData, analise) {
  console.log("🧠 Construindo contexto com fusão inteligente de TODAS as fontes...");
  
  // ANÁLISE DE FONTES DISPONÍVEIS
  const fontesDisponiveis = analisarFontesDisponiveis(formData, analise);
  console.log("📊 Fontes detectadas:", fontesDisponiveis);
  
  // FUSÃO DE PASSAGEIROS (PRIORIDADE: TEXTO > HTML > PADRÃO)
  const passageirosFusao = fusaoInteligentePassageiros(formData, analise, fontesDisponiveis);
  
  // FUSÃO DE PREÇOS (PRIORIDADE: PDF > IMAGEM > TEXTO > HTML)
  const precosFusao = fusaoInteligentePrecos(formData, analise, fontesDisponiveis);
  
  // FUSÃO DE DESTINOS (PRIORIDADE: HTML > TEXTO > ANÁLISE)
  const destinoFusao = fusaoInteligenteDestinos(formData, analise, fontesDisponiveis);
  
  // FUSÃO DE COMPANHIAS (QUALQUER FONTE VÁLIDA)
  const companhiasFusao = fusaoInteligenteCompanhias(formData, analise, fontesDisponiveis);
  
  // FUSÃO DE HORÁRIOS E AEROPORTOS
  const voosFusao = fusaoInteligenteVoos(formData, analise, fontesDisponiveis);
  
  // CONTEXTO UNIFICADO FINAL
  const contextoUnificado = {
    // Dados básicos unificados
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    
    // DADOS FUSIONADOS INTELIGENTEMENTE
    destino: destinoFusao.valor,
    destinoFonte: destinoFusao.fonte,
    
    passageiros: passageirosFusao.texto,
    adultos: passageirosFusao.adultos,
    criancas: passageirosFusao.criancas,
    bebes: passageirosFusao.bebes,
    passageirosFonte: passageirosFusao.fonte,
    
    precoTotal: precosFusao.valor,
    precoFonte: precosFusao.fonte,
    
    companhiaPrincipal: companhiasFusao.principal,
    companhiasFonte: companhiasFusao.fonte,
    
    // Dados de voos fusionados
    horarioIda: voosFusao.horarioIda,
    horarioVolta: voosFusao.horarioVolta,
    aeroportoOrigemFinal: voosFusao.aeroportoOrigem,
    aeroportoDestinoFinal: voosFusao.aeroportoDestino,
    
    // Metadados da análise
    tipoDetectado: analise.tipoDetectado || analise.tipo_principal || 'aereo_nacional_simples',
    confianca: analise.confiancaDeteccao || analise.confianca_deteccao || 0,
    complexidade: analise.complexidade || 'media',
    numeroOpcoes: analise.numeroOpcoes || 1,
    
    // Configurações especiais
    temImagem: !!formData.imagemBase64,
    temPDF: fontesDisponiveis.includes('PDF'),
    temTexto: fontesDisponiveis.includes('TEXTO'),
    temHTML: fontesDisponiveis.includes('HTML'),
    
    parcelamento: {
      incluirParcelamento: !!formData.parcelamento?.incluirParcelamento,
      parcelas10x: !!formData.parcelamento?.parcelas10x,
      parcelas12x: !!formData.parcelamento?.parcelas12x
    },
    
    // Debug e rastreabilidade
    fontesProcessadas: fontesDisponiveis,
    fusaoLog: {
      passageiros: passageirosFusao.log,
      precos: precosFusao.log,
      destino: destinoFusao.log,
      companhias: companhiasFusao.log
    }
  };
  
  console.log("✅ Contexto unificado construído com sucesso");
  console.log(`🎯 Passageiros: ${contextoUnificado.passageiros} (fonte: ${contextoUnificado.passageirosFonte})`);
  console.log(`🏆 Destino: ${contextoUnificado.destino} (fonte: ${contextoUnificado.destinoFonte})`);
  console.log(`💰 Preço: ${contextoUnificado.precoTotal || 'não detectado'} (fonte: ${contextoUnificado.precoFonte || 'nenhuma'})`);
  
  return contextoUnificado;
}

// ================================================================================
// 3. 🔍 ANÁLISE E PRIORIZAÇÃO DE DADOS
// ================================================================================

function analisarFontesDisponiveis(formData, analise) {
  const fontes = [];
  
  if (formData.observacoes && formData.observacoes.length > 50) {
    fontes.push('TEXTO');
  }
  
  if (formData.imagemBase64) {
    fontes.push('IMAGEM');
  }
  
  // Detectar PDF através do tamanho do texto (PDFs geram textos longos)
  if (formData.observacoes && formData.observacoes.length > 1000) {
    fontes.push('PDF');
  }
  
  if ((formData.adultos && formData.adultos > 0) || 
      (formData.criancas && formData.criancas > 0) || 
      (formData.destino && formData.destino.length > 0)) {
    fontes.push('HTML');
  }
  
  return fontes;
}

function fusaoInteligentePassageiros(formData, analise, fontesDisponiveis) {
  console.log("👥 Fusão inteligente de passageiros...");
  
  // PRIORIDADE: TEXTO/PDF > HTML > PADRÃO
  
  // 1º: Tentar extrair do texto/análise
  const adultosTexto = analise.dadosVoo?.numeroPassageiros || 0;
  const criancasTexto = analise.dadosVoo?.numeroCriancas || 0;
  const bebesTexto = analise.dadosVoo?.numeroBebes || 0;
  
  // 2º: Usar dados do HTML se disponíveis
  const adultosHTML = parseInt(formData.adultos) || 0;
  const criancasHTML = parseInt(formData.criancas) || 0;
  
  // LÓGICA DE FUSÃO INTELIGENTE
  let adultosFinal, criancasFinal, bebesFinal, fonte, log;
  
  if (adultosTexto > 0 || criancasTexto > 0 || bebesTexto > 0) {
    // Usar dados extraídos do texto
    adultosFinal = adultosTexto || 1;
    criancasFinal = criancasTexto;
    bebesFinal = bebesTexto;
    fonte = 'TEXTO_EXTRAIDO';
    log = `Extraído do texto: ${adultosFinal}A, ${criancasFinal}C, ${bebesFinal}B`;
  } else if (adultosHTML > 0 || criancasHTML > 0) {
    // Usar dados do formulário HTML
    adultosFinal = adultosHTML || 1;
    criancasFinal = criancasHTML;
    bebesFinal = 0; // Bebês só vêm do texto
    fonte = 'HTML_FORM';
    log = `Usado formulário HTML: ${adultosFinal}A, ${criancasFinal}C`;
  } else {
    // Usar padrão
    adultosFinal = 1;
    criancasFinal = 0;
    bebesFinal = 0;
    fonte = 'PADRAO';
    log = 'Usado padrão: 1A, 0C, 0B';
  }
  
  // Construir texto final
  let textoPassageiros = `${adultosFinal} adulto(s)`;
  if (criancasFinal > 0) textoPassageiros += `, ${criancasFinal} criança(s)`;
  if (bebesFinal > 0) textoPassageiros += ` e ${bebesFinal} bebê(s)`;
  
  console.log(`✅ Passageiros fusionados: ${textoPassageiros} (${fonte})`);
  
  return {
    adultos: adultosFinal,
    criancas: criancasFinal,
    bebes: bebesFinal,
    texto: textoPassageiros,
    fonte: fonte,
    log: log
  };
}

function fusaoInteligentePrecos(formData, analise, fontesDisponiveis) {
  console.log("💰 Fusão inteligente de preços...");
  
  // PRIORIDADE: PDF > IMAGEM > TEXTO > HTML
  
  // Tentar extrair preços da análise
  const precosAnalise = analise.precosCVC?.precoTotal || 
                       analise.dadosVoo?.precoTotal ||
                       analise.dadosHotel?.precoTotal ||
                       analise.dadosCruzeiro?.precoTotal;
  
  let precoFinal = null;
  let fonte = 'NENHUMA';
  let log = 'Nenhum preço detectado';
  
  if (precosAnalise) {
    precoFinal = precosAnalise;
    if (fontesDisponiveis.includes('PDF')) {
      fonte = 'PDF_EXTRAIDO';
      log = `Preço extraído de PDF: ${precoFinal}`;
    } else if (fontesDisponiveis.includes('IMAGEM')) {
      fonte = 'IMAGEM_EXTRAIDA';
      log = `Preço extraído de imagem: ${precoFinal}`;
    } else {
      fonte = 'TEXTO_EXTRAIDO';
      log = `Preço extraído de texto: ${precoFinal}`;
    }
  }
  
  console.log(`✅ Preços fusionados: ${precoFinal || 'não detectado'} (${fonte})`);
  
  return {
    valor: precoFinal,
    fonte: fonte,
    log: log
  };
}

function fusaoInteligenteDestinos(formData, analise, fontesDisponiveis) {
  console.log("🗺️ Fusão inteligente de destinos...");
  
  // PRIORIDADE: HTML > TEXTO > ANÁLISE
  
  let destinoFinal = null;
  let fonte = 'NENHUMA';
  let log = 'Nenhum destino detectado';
  
  if (formData.destino && formData.destino.length > 0) {
    destinoFinal = formData.destino;
    fonte = 'HTML_FORM';
    log = `Destino do formulário: ${destinoFinal}`;
  } else if (analise.dadosVoo?.destino) {
    destinoFinal = analise.dadosVoo.destino;
    fonte = 'TEXTO_EXTRAIDO';
    log = `Destino extraído do texto: ${destinoFinal}`;
  } else if (analise.dadosVoo?.destinoFinal) {
    destinoFinal = analise.dadosVoo.destinoFinal;
    fonte = 'ANALISE';
    log = `Destino da análise: ${destinoFinal}`;
  } else {
    destinoFinal = 'Destino a definir';
    fonte = 'PADRAO';
    log = 'Usado destino padrão';
  }
  
  console.log(`✅ Destino fusionado: ${destinoFinal} (${fonte})`);
  
  return {
    valor: destinoFinal,
    fonte: fonte,
    log: log
  };
}

function fusaoInteligenteCompanhias(formData, analise, fontesDisponiveis) {
  console.log("✈️ Fusão inteligente de companhias...");
  
  const companhiasDetectadas = analise.companhiasDetectadas || 
                              analise.dadosVoo?.companhiaPrincipal ||
                              [];
  
  let companhiaPrincipal = null;
  let fonte = 'NENHUMA';
  let log = 'Nenhuma companhia detectada';
  
  if (Array.isArray(companhiasDetectadas) && companhiasDetectadas.length > 0) {
    companhiaPrincipal = companhiasDetectadas[0];
    fonte = 'TEXTO_EXTRAIDO';
    log = `Companhia extraída: ${companhiaPrincipal}`;
  } else if (typeof companhiasDetectadas === 'string' && companhiasDetectadas.length > 0) {
    companhiaPrincipal = companhiasDetectadas;
    fonte = 'ANALISE';
    log = `Companhia da análise: ${companhiaPrincipal}`;
  } else {
    companhiaPrincipal = 'A confirmar';
    fonte = 'PADRAO';
    log = 'Companhia padrão';
  }
  
  console.log(`✅ Companhia fusionada: ${companhiaPrincipal} (${fonte})`);
  
  return {
    principal: companhiaPrincipal,
    todas: companhiasDetectadas,
    fonte: fonte,
    log: log
  };
}

function fusaoInteligenteVoos(formData, analise, fontesDisponiveis) {
  console.log("🛫 Fusão inteligente de dados de voos...");
  
  const dadosVoo = analise.dadosVoo || {};
  
  return {
    horarioIda: dadosVoo.vooIda?.horarioSaida || 'A confirmar',
    horarioVolta: dadosVoo.vooVolta?.horarioSaida || 'A confirmar',
    aeroportoOrigem: dadosVoo.vooIda?.aeroportoSaida || dadosVoo.origem || 'A confirmar',
    aeroportoDestino: dadosVoo.vooIda?.aeroportoChegada || dadosVoo.destino || 'A confirmar',
    duracao: dadosVoo.vooIda?.duracao || 'A confirmar',
    tipoVoo: dadosVoo.vooIda?.tipoVoo || 'A confirmar'
  };
}

// ================================================================================
// 4. ⚙️ DETERMINAÇÃO DE ESTRATÉGIA
// ================================================================================

function determinarEstrategia(analise, contextoUnificado) {
  console.log("⚙️ Determinando estratégia com contexto unificado...");
  
  const estrategia = {
    foco: 'formatacao_padrao',
    detalhamento: 'medio',
    validacao: 'padrao',
    modelo_recomendado: 'gpt-4o-mini',
    fontesUsadas: contextoUnificado.fontesProcessadas
  };
  
  // Ajustar estratégia baseado nas fontes disponíveis
  if (contextoUnificado.temImagem) {
    estrategia.foco = 'analise_visual';
    estrategia.modelo_recomendado = 'gpt-4o';
  }
  
  if (contextoUnificado.temPDF) {
    estrategia.detalhamento = 'alto';
    estrategia.validacao = 'elevada';
  }
  
  // Ajustes baseados na complexidade
  switch (contextoUnificado.complexidade) {
    case 'muito_alta':
      estrategia.foco = 'maxima_precisao';
      estrategia.detalhamento = 'muito_alto';
      estrategia.validacao = 'rigorosa';
      estrategia.modelo_recomendado = 'gpt-4o';
      break;
      
    case 'alta':
      estrategia.foco = 'alta_qualidade';
      estrategia.detalhamento = 'alto';
      estrategia.validacao = 'elevada';
      break;
      
    case 'baixa':
      estrategia.foco = 'eficiencia';
      estrategia.detalhamento = 'basico';
      estrategia.validacao = 'basica';
      break;
  }
  
  console.log(`✅ Estratégia determinada: ${estrategia.foco} (${estrategia.modelo_recomendado})`);
  
  return estrategia;
}

// ================================================================================
// 5. 🎯 SELEÇÃO DE PROMPT POR TIPO
// ================================================================================

function selecionarPromptPorTipo(tipoDetectado, contextoUnificado, estrategia) {
  console.log(`🎯 Selecionando prompt para tipo: ${tipoDetectado}`);
  
  const prompts = {
    aereo_nacional_simples: promptAereoNacionalSimples,
    aereo_conexao_detalhada: promptAereoConexaoDetalhada,
    aereo_somente_ida: promptAereoSomenteIda,
    multiplas_opcoes_2: promptMultiplasOpcoes2,
    multiplas_opcoes_3: promptMultiplasOpcoes3,
    multitrecho: promptMultitrecho,
    multiplas_companhias_internacionais: promptMultiplasCompanhiasInternacionais,
    pacote_completo: promptPacoteCompleto,
    hotel_somente: promptHotelSomente,
    cruzeiro: promptCruzeiro
  };
  
  const promptFunction = prompts[tipoDetectado] || promptAereoNacionalSimples;
  return promptFunction(contextoUnificado, estrategia);
}

// ================================================================================
// 6. ✈️ PROMPTS ESPECÍFICOS POR TIPO - AÉREOS
// ================================================================================

function promptAereoNacionalSimples(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL SIMPLES v12.0

🧠 ANÁLISE INTELIGENTE MULTI-FONTE:
- Tipo: Aéreo Nacional Ida e Volta Simples
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}
- Fontes processadas: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS DE TODAS AS FONTES:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

🎯 INFORMAÇÕES FUSIONADAS INTELIGENTEMENTE:
- Passageiros: ${contexto.passageiros} (fonte: ${contexto.passageirosFonte})
- Destino: ${contexto.destino} (fonte: ${contexto.destinoFonte})
- Companhia: ${contexto.companhiaPrincipal} (fonte: ${contexto.companhiasFonte})
${contexto.precoTotal ? `- Preço detectado: R$ ${contexto.precoTotal} (fonte: ${contexto.precoFonte})` : ''}

FORMATAÇÃO OBRIGATÓRIA - AÉREO NACIONAL SIMPLES:

*${contexto.companhiaPrincipal || '[COMPANHIA]'} - [ORIGEM] ✈ ${contexto.destino}*
[DD/MM] - ${contexto.aeroportoOrigemFinal} [HH:MM] / ${contexto.aeroportoDestinoFinal} [HH:MM] ([TIPO_VOO])
--
[DD/MM] - ${contexto.aeroportoDestinoFinal} [HH:MM] / ${contexto.aeroportoOrigemFinal} [HH:MM] ([TIPO_VOO])

💰 ${contexto.precoTotal ? `R$ ${contexto.precoTotal}` : '[VALOR]'} para ${contexto.passageiros}
${contexto.parcelamento.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável
${contexto.temImagem ? '🔗 [LINK se detectado na imagem]' : ''}

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS E FUSIONADOS ACIMA
- APLIQUE O TEMPLATE DE FORMA LITERAL
- SUA RESPOSTA DEVE COMEÇAR COM O ASTERISCO DO TÍTULO
- NÃO ADICIONE TÍTULOS EXTRAS, SEPARADORES (---) OU FORMATAÇÃO MARKDOWN ADICIONAL

GERAR ORÇAMENTO PROFISSIONAL:`;
}

function promptAereoConexaoDetalhada(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO CONEXÃO DETALHADA v12.0

🧠 ANÁLISE INTELIGENTE MULTI-FONTE:
- Tipo: Aéreo Nacional com Conexão Detalhada
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}
- Fontes: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS:
${contexto.observacoes}

🎯 INFORMAÇÕES FUSIONADAS:
- Passageiros: ${contexto.passageiros} (${contexto.passageirosFonte})
- Destino: ${contexto.destino} (${contexto.destinoFonte})
- Companhia: ${contexto.companhiaPrincipal}

FORMATAÇÃO OBRIGATÓRIA - CONEXÃO DETALHADA:

*${contexto.companhiaPrincipal || '[COMPANHIA]'} - [ORIGEM] ✈ ${contexto.destino}*
[DD/MM] - ${contexto.aeroportoOrigemFinal} [HH:MM] / [CONEXAO] [HH:MM] (voo direto)
(conexão em [CONEXAO] - [TEMPO_ESPERA] de espera)
[DD/MM] - [CONEXAO] [HH:MM] / ${contexto.aeroportoDestinoFinal} [HH:MM] (voo direto)
--
[DD/MM] - ${contexto.aeroportoDestinoFinal} [HH:MM] / ${contexto.aeroportoOrigemFinal} [HH:MM] ([TIPO_VOO])

💰 ${contexto.precoTotal ? `R$ ${contexto.precoTotal}` : '[VALOR]'} para ${contexto.passageiros}
✅ Só mala de mão incluída
🏷️ Não reembolsável

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FUSIONADOS ACIMA
- APLIQUE O TEMPLATE DE FORMA LITERAL
- NÃO ADICIONE FORMATAÇÃO MARKDOWN EXTRA

GERAR ORÇAMENTO COM CONEXÃO DETALHADA:`;
}

function promptAereoSomenteIda(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO SOMENTE IDA v12.0

🧠 ANÁLISE INTELIGENTE:
- Tipo: Aéreo Somente Ida (sem retorno)
- Fontes: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS:
${contexto.observacoes}

🎯 INFORMAÇÕES FUSIONADAS:
- Passageiros: ${contexto.passageiros}
- Destino: ${contexto.destino}

FORMATAÇÃO OBRIGATÓRIA - SOMENTE IDA:

*${contexto.companhiaPrincipal || '[COMPANHIA]'}*
[DD/MM] - ${contexto.aeroportoOrigemFinal} [HH:MM] / ${contexto.aeroportoDestinoFinal} [HH:MM] ([TIPO_VOO])

💰 Valor total para ${contexto.passageiros} = ${contexto.precoTotal ? `R$ ${contexto.precoTotal}` : '[VALOR]'}
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
[REEMBOLSO]

⚠️ Passagem somente de ida - sem retorno incluído

REGRAS CRÍTICAS:
- USE DADOS FUSIONADOS ACIMA
- NÃO usar separador "--"
- INCLUIR aviso de "somente ida"

GERAR ORÇAMENTO SOMENTE IDA:`;
}

function promptMultiplasOpcoes2(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (2 PLANOS) v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Múltiplas Opções - 2 Planos
- Fontes: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS:
${contexto.observacoes}

FORMATAÇÃO OBRIGATÓRIA - 2 OPÇÕES:

*${contexto.companhiaPrincipal || '[COMPANHIA]'} - [ORIGEM] ✈ ${contexto.destino}*
[DD/MM] - ${contexto.aeroportoOrigemFinal} [HH:MM] / ${contexto.aeroportoDestinoFinal} [HH:MM] ([TIPO_VOO])
--
[DD/MM] - ${contexto.aeroportoDestinoFinal} [HH:MM] / ${contexto.aeroportoOrigemFinal} [HH:MM] ([TIPO_VOO])

💰 **OPÇÃO 1** - [VALOR_1]
✅ Só mala de mão incluída
[PARCELAMENTO_1]
[LINK_1]

💰 **OPÇÃO 2** - [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
[PARCELAMENTO_2]
[LINK_2]

Valores sujeitos a confirmação e disponibilidade

REGRAS CRÍTICAS:
- USE DADOS FUSIONADOS
- FORMATO **OPÇÃO X** obrigatório

GERAR ORÇAMENTO COM 2 OPÇÕES:`;
}

function promptMultiplasOpcoes3(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (3 PLANOS) v12.0

🧠 ANÁLISE MULTI-FONTE:
- Fontes: ${contexto.fontesProcessadas.join(', ')}

FORMATAÇÃO OBRIGATÓRIA - 3 OPÇÕES ESCALONADAS:

*${contexto.companhiaPrincipal || '[COMPANHIA]'} - [ORIGEM] ✈ ${contexto.destino}*
[VOOS_IGUAIS_PARA_TODAS_OPCOES]

💰 **OPÇÃO 1** - [VALOR_1]
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - [VALOR_3]
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade

REGRAS CRÍTICAS:
- ESCALONAMENTO: Básica → Intermediária → Premium
- OPÇÃO 3 DEVE incluir "Marcação de assento"

GERAR ORÇAMENTO COM 3 OPÇÕES:`;
}

function promptMultitrecho(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MULTITRECHO v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Multitrecho (múltiplos destinos)
- Fontes: ${contexto.fontesProcessadas.join(', ')}

FORMATAÇÃO OBRIGATÓRIA - MULTITRECHO:

*Multitrecho - [COMPANHIAS]*
[DATA_INICIO] a [DATA_FIM] ([DIAS] dias e [NOITES] noites)

*Trecho 1:* [ORIGEM_1] → [DESTINO_1]
[DATA_1] - [AEROPORTO_1] [HORA_1] / [AEROPORTO_2] [HORA_2] ([TIPO_VOO_1])

*Trecho 2:* [ORIGEM_2] → [DESTINO_2]
[DATA_2] - [AEROPORTO_3] [HORA_3] / [AEROPORTO_4] [HORA_4] ([TIPO_VOO_2])

*Trecho 3:* [ORIGEM_3] → [DESTINO_3]
[DATA_3] - [AEROPORTO_5] [HORA_5] / [AEROPORTO_6] [HORA_6] ([TIPO_VOO_3])

💰 [VALOR_TOTAL] para ${contexto.passageiros}
💳 Parcelamento em até 10x sem juros no cartão
✅ [BAGAGEM]
🏷️ [REEMBOLSO]
🔗 [LINK]

REGRAS MULTITRECHO:
- Formato: *Trecho X:* Origem → Destino
- Múltiplas companhias permitidas

GERAR ORÇAMENTO MULTITRECHO:`;
}

function promptMultiplasCompanhiasInternacionais(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS COMPANHIAS INTERNACIONAIS v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Internacional com Múltiplas Companhias
- Fontes: ${contexto.fontesProcessadas.join(', ')}

FORMATAÇÃO OBRIGATÓRIA - MÚLTIPLAS COMPANHIAS:

*OPÇÃO 1 - [COMPANHIA_1] - [ORIGEM] ✈ ${contexto.destino}*
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_1] / [AEROPORTO_DESTINO] [HORA_2] ([TIPO_VOO_1])
--
[DATA_VOLTA] - [AEROPORTO_DESTINO] [HORA_3] / [AEROPORTO_ORIGEM] [HORA_4] ([TIPO_VOO_2])

💰 [VALOR_1] para ${contexto.passageiros}
💳 [PARCELAMENTO_1]
🔗 [LINK_1]

*OPÇÃO 2 - [COMPANHIA_2] - [ORIGEM] ✈ ${contexto.destino}*
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_5] / [AEROPORTO_DESTINO] [HORA_6] ([TIPO_VOO_3])
--
[DATA_VOLTA] - [AEROPORTO_DESTINO] [HORA_7] / [AEROPORTO_ORIGEM] [HORA_8] ([TIPO_VOO_4])

💰 [VALOR_2] para ${contexto.passageiros}
💳 [PARCELAMENTO_2]
🔗 [LINK_2]

🏷️ [REEMBOLSO]
Valores sujeitos a confirmação e disponibilidade

REGRAS CRÍTICAS:
- DESTACAR diferenças entre companhias
- Horários e conexões diferentes

GERAR ORÇAMENTO MÚLTIPLAS COMPANHIAS:`;
}

// ================================================================================
// 7. 🏨 PROMPTS PARA HOTÉIS E PACOTES
// ================================================================================

function promptHotelSomente(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - HOTEL SOMENTE v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Hotel (sem voos)
- Fontes: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS:
- Passageiros: ${contexto.passageiros}
- Destino: ${contexto.destino}

FORMATAÇÃO OBRIGATÓRIA - HOTEL:

*[NOME_HOTEL]*
📍 [ENDERECO_COMPLETO]
⭐ [CATEGORIA_ESTRELAS]
🛏️ [TIPO_QUARTO] 
🍽️ [REGIME_ALIMENTACAO]

📅 Check-in: [DATA_CHECKIN]
📅 Check-out: [DATA_CHECKOUT]
🌙 [QUANTIDADE_NOITES] noites

💰 ${contexto.precoTotal ? `R$ ${contexto.precoTotal}` : '[VALOR_TOTAL]'} para ${contexto.passageiros}
💳 [PARCELAMENTO]
🔗 [LINK_RESERVA]

✅ Incluso: [SERVICOS_INCLUSOS]
❌ Não incluso: [SERVICOS_NAO_INCLUSOS]

Valores sujeitos a confirmação e disponibilidade

REGRAS CRÍTICAS:
- USE dados fusionados acima
- INCLUA todas as comodidades mencionadas

GERAR ORÇAMENTO DE HOTEL:`;
}

function promptPacoteCompleto(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - PACOTE COMPLETO v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Pacote Completo (Aéreo + Hotel)
- Fontes: ${contexto.fontesProcessadas.join(', ')}

FORMATAÇÃO OBRIGATÓRIA - PACOTE:

*Pacote ${contexto.destino}*
Embarque: [DATA_EMBARQUE]
Pacote para ${contexto.passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para ${contexto.destino}
- Taxas de Embarque
- [TRASLADO]
[PASSEIOS_SE_HOUVER]
[SEGURO_SE_HOUVER]
- [NOITES] noites de hospedagem no hotel escolhido

✈️ *Voos ${contexto.companhiaPrincipal || '[COMPANHIA]'}:*
[VOOS_DETALHADOS]

**OPÇÃO 1** - [HOTEL_1]
📍 [ENDERECO_1]
🛏️ [QUARTO_1] com [REGIME_1]
💰 [VALOR_1] para ${contexto.passageiros}
🔗 [LINK_1]

**OPÇÃO 2** - [HOTEL_2]
📍 [ENDERECO_2]
🛏️ [QUARTO_2] com [REGIME_2]
✅ Reembolsável conforme regras do bilhete
💰 [VALOR_2] para ${contexto.passageiros}
🔗 [LINK_2]

Valores sujeitos a confirmação e disponibilidade

REGRAS PACOTE:
- Seção "*O Pacote Inclui:*" obrigatória
- Voos separados das opções de hotel

GERAR PACOTE COMPLETO:`;
}

// ================================================================================
// 8. 🚢 PROMPTS PARA CRUZEIROS
// ================================================================================

function promptCruzeiro(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO v12.0

🧠 ANÁLISE MULTI-FONTE:
- Tipo: Cruzeiro Marítimo
- Fontes: ${contexto.fontesProcessadas.join(', ')}

📊 DADOS FUSIONADOS:
${contexto.observacoes}

🎯 INFORMAÇÕES FUSIONADAS:
- Passageiros: ${contexto.passageiros}
${contexto.precoTotal ? `- Preço detectado: R$ ${contexto.precoTotal}` : ''}

FORMATAÇÃO OBRIGATÓRIA - CRUZEIRO:

🚢 *Cruzeiro [NOME_NAVIO]* – [DURACAO] noites
${contexto.passageiros}
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO]
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
${contexto.precoTotal ? `- Cabine [TIPO]: R$ ${contexto.precoTotal}` : '[CABINES_COM_PRECOS]'}

📎 Link para ver fotos, detalhes e reservar:
[LINK]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📋 Documentação: RG original (máx. 10 anos) ou passaporte

📲 Me chama pra garantir a sua cabine! 🌴🛳️

REGRAS CRUZEIRO:
- Emoji 🚢 obrigatório no início
- "Roteiro incrível pelo litoral brasileiro!"
- Documentação específica
- Chamada final para ação

REGRAS CRÍTICAS:
- USE dados fusionados do PDF/texto acima
- PRESERVE preços exatos se detectados

GERAR ORÇAMENTO DE CRUZEIRO:`;
}

// ================================================================================
// 9. 🔧 ENRIQUECIMENTO E OTIMIZAÇÃO
// ================================================================================

function enriquecerPrompt(promptBase, formData, analise, contextoUnificado) {
  console.log("🔧 Enriquecendo prompt com contexto unificado...");
  let promptEnriquecido = promptBase;
  
  const contextoEspecial = {
    baixaConfianca: contextoUnificado.confianca < 0.7,
    altaComplexidade: contextoUnificado.complexidade === 'muito_alta',
    multiplasfontes: contextoUnificado.fontesProcessadas.length > 2,
    dadosIncompletos: (!formData.observacoes || formData.observacoes.length < 50)
  };
  
  if (contextoEspecial.baixaConfianca) {
    promptEnriquecido += `\n\n⚠️ VALIDAÇÃO EXTRA (Confiança: ${(contextoUnificado.confianca * 100).toFixed(1)}%):
- REVISAR cuidadosamente o tipo detectado
- EM CASO DE DÚVIDA, usar formato mais simples
- PRIORIZAR clareza sobre complexidade`;
  }
  
  if (contextoEspecial.multiplasfontes) {
    promptEnriquecido += `\n\n🧠 FUSÃO MULTI-FONTE ATIVA:
- Dados processados de: ${contextoUnificado.fontesProcessadas.join(', ')}
- Use PREFERENCIALMENTE os dados já fusionados acima
- Combine informações de forma inteligente
- Priorize dados mais específicos e confiáveis`;
  }
  
  if (contextoEspecial.altaComplexidade) {
    promptEnriquecido += `\n\n🎯 ALTA COMPLEXIDADE DETECTADA:
- Aplicar MÁXIMO rigor na formatação
- Verificar TODAS as regras críticas listadas
- Organizar informações de forma hierárquica
- Priorizar legibilidade profissional`;
  }
  
  if (contextoUnificado.temImagem) {
    promptEnriquecido += `\n\n📸 ANÁLISE DE IMAGEM ATIVA:
- Examinar TODOS os elementos visuais
- Extrair dados exatos: horários, preços, datas
- Preservar links se visíveis
- Detectar layout específico (tabular, vertical)`;
  }
  
  return promptEnriquecido;
}

function otimizarPromptFinal(prompt, limitesModelo) {
  console.log("🔧 Otimizando prompt unificado para limites do modelo...");
  let promptOtimizado = prompt;
  
  const tamanhoAtual = calcularTamanhoPrompt(prompt);
  
  if (tamanhoAtual.tokens_estimados > limitesModelo.max_tokens * 0.7) {
    console.warn("⚠️ Prompt muito longo, aplicando otimizações...");
    
    // Manter seções críticas, remover opcionais
    promptOtimizado = promptOtimizado.replace(/INSTRUÇÕES FINAIS:[\s\S]*?(?=GERAR|$)/g, '');
    promptOtimizado = promptOtimizado.replace(/CAMPOS OPCIONAIS:[\s\S]*?(?=REGRAS|GERAR|$)/g, '');
    promptOtimizado = promptOtimizado.replace(/\d+\.\s*[⏰📅✈️🛫💳👥🧳👶🏷️💰📱🔧]\s*/g, '• ');
  }
  
  // Garantir que termine com instrução de geração
  if (!promptOtimizado.includes('GERAR')) {
    promptOtimizado += '\n\nGERAR ORÇAMENTO PROFISSIONAL FORMATADO:';
  }
  
  const tamanhoFinal = calcularTamanhoPrompt(promptOtimizado);
  console.log(`🔧 Otimização: ${tamanhoAtual.tokens_estimados} → ${tamanhoFinal.tokens_estimados} tokens`);
  
  return promptOtimizado;
}

// ================================================================================
// 10. 📊 FUNÇÕES AUXILIARES E LOGS
// ================================================================================

function calcularTamanhoPrompt(prompt) {
  const caracteres = prompt.length;
  const tokens_estimados = Math.ceil(caracteres / 4);
  
  return {
    caracteres,
    palavras: prompt.split(/\s+/).length,
    linhas: prompt.split('\n').length,
    tokens_estimados,
    categoria: tokens_estimados < 500 ? 'pequeno' : 
               tokens_estimados < 2000 ? 'medio' : 
               tokens_estimados < 4000 ? 'grande' : 'muito_grande'
  };
}

function logPromptGerado(prompt, analise, estrategia, contextoUnificado) {
  console.log("📊 === LOG DE PROMPT UNIFICADO GERADO ===");
  console.log(`🎯 Tipo: ${contextoUnificado.tipoDetectado}`);
  console.log(`📈 Confiança: ${(contextoUnificado.confianca * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${contextoUnificado.complexidade}`);
  console.log(`⚙️ Estratégia: ${estrategia.foco}`);
  console.log(`📏 Tamanho: ${prompt.length} caracteres`);
  console.log(`🤖 Modelo recomendado: ${estrategia.modelo_recomendado}`);
  console.log(`🧠 Fontes processadas: ${contextoUnificado.fontesProcessadas.join(', ')}`);
  console.log(`👥 Passageiros finais: ${contextoUnificado.passageiros} (${contextoUnificado.passageirosFonte})`);
  console.log(`🗺️ Destino final: ${contextoUnificado.destino} (${contextoUnificado.destinoFonte})`);
  console.log("📊 === FIM DO LOG ===");
}

// ================================================================================
// 11. 📸 ANÁLISE DE IMAGENS E PDFs
// ================================================================================

function gerarPromptAnaliseImagem(formData, contextoUnificado) {
  return `ORÇAMENTO CVC ITAQUA - ANÁLISE DE IMAGEM UNIFICADA v12.0

🔍 INSTRUÇÕES PARA ANÁLISE DE IMAGEM/PDF COM FUSÃO INTELIGENTE:

🧠 CONTEXTO UNIFICADO DISPONÍVEL:
- Fontes processadas: ${contextoUnificado.fontesProcessadas.join(', ')}
- Passageiros detectados: ${contextoUnificado.passageiros} (fonte: ${contextoUnificado.passageirosFonte})
- Destino detectado: ${contextoUnificado.destino} (fonte: ${contextoUnificado.destinoFonte})
- Companhia detectada: ${contextoUnificado.companhiaPrincipal}
${contextoUnificado.precoTotal ? `- Preço detectado: R$ ${contextoUnificado.precoTotal} (fonte: ${contextoUnificado.precoFonte})` : ''}

🔍 EXAMINE a imagem/PDF fornecida E COMBINE com os dados já detectados acima.

📋 DADOS A EXTRAIR DA IMAGEM:
- Companhias aéreas mencionadas
- Horários de voo (formato HH:MM)
- Códigos de aeroporto (GRU, CGH, etc.)
- Datas de ida e volta
- Valores em R$ (reais)
- Número de passageiros
- Links da CVC (se visíveis)
- Tipo de voo (direto/conexão)
- Bagagem incluída
- Política de cancelamento

⚠️ REGRAS CRÍTICAS DE FUSÃO:
1. PRIORIZE dados da imagem sobre dados de texto quando mais específicos
2. COMBINE informações complementares (ex: texto tem passageiros, imagem tem horários)
3. NÃO invente dados que não estejam visíveis
4. Use contexto unificado para preencher lacunas
5. Preserve horários EXATOS como mostrados
6. Mantenha valores monetários precisos

🎯 FORMATO DE RESPOSTA:
Organize as informações em um orçamento profissional seguindo o template CVC, usando FUSÃO INTELIGENTE dos dados da imagem + contexto unificado acima.

Tipos selecionados: ${formData.tipos?.join(', ') || 'Conforme detectado'}

ANALISAR IMAGEM + FUSIONAR COM CONTEXTO + GERAR ORÇAMENTO:`;
}

function gerarPromptFallback(formData) {
  return `ORÇAMENTO CVC ITAQUA - MODO FALLBACK UNIFICADO v12.0

⚠️ SISTEMA EM MODO DE RECUPERAÇÃO

Dados básicos disponíveis:
- Tipos: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}
- Observações: ${formData.observacoes ? 'Fornecidas' : 'Nenhuma'}
- Imagem: ${formData.imagemBase64 ? 'Anexada' : 'Não anexada'}

🎯 GERE um orçamento básico mas profissional com os dados disponíveis.

REGRAS FALLBACK:
- Indicar "A confirmar" para informações não fornecidas
- Usar template simples mas correto
- Manter formatação CVC padrão
- Ser transparente sobre limitações

GERAR ORÇAMENTO BÁSICO PROFISSIONAL:`;
}

// ================================================================================
// 12. 🔧 UTILITÁRIOS E VALIDAÇÃO
// ================================================================================

function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt unificado para modelo: ${modelo}`);
  
  switch (modelo) {
    case 'gpt-4o':
      // GPT-4o pode lidar com prompts complexos e fusão
      return prompt;
      
    case 'gpt-4o-mini':
      // GPT-4o-mini prefere instruções mais diretas
      return prompt.replace(/🧠 ANÁLISE INTELIGENTE MULTI-FONTE:[\s\S]*?(?=📊 DADOS|FORMATAÇÃO)/g, '');
      
    case 'claude-3-5-sonnet-20240620':
      // Claude prefere estrutura mais clara
      return prompt.replace(/REGRAS CRÍTICAS E FINAIS:/g, 'INSTRUÇÕES IMPORTANTES:');
      
    default:
      return prompt;
  }
}

function validarPrompt(prompt, tipoDetectado, contextoUnificado) {
  const validacao = {
    valido: true,
    problemas: [],
    sugestoes: [],
    fontesUsadas: contextoUnificado?.fontesProcessadas || []
  };
  
  // Verificações básicas
  if (!prompt || prompt.length < 100) {
    validacao.valido = false;
    validacao.problemas.push('Prompt muito curto');
  }
  
  if (!prompt.includes('GERAR')) {
    validacao.problemas.push('Falta instrução de geração');
  }
  
  // Verificações de fusão
  if (contextoUnificado && contextoUnificado.fontesProcessadas.length > 1) {
    if (!prompt.includes('FUSÃO') && !prompt.includes('MULTI-FONTE')) {
      validacao.sugestoes.push('Prompt não menciona fusão multi-fonte');
    }
  }
  
  // Verificações específicas por tipo
  if (tipoDetectado?.includes('cruzeiro') && !prompt.includes('🚢')) {
    validacao.sugestoes.push('Adicionar emoji de cruzeiro');
  }
  
  if (tipoDetectado?.includes('multitrecho') && !prompt.includes('Trecho')) {
    validacao.problemas.push('Template multitrecho deve incluir "Trecho"');
  }
  
  console.log(`✅ Validação concluída: ${validacao.valido ? 'VÁLIDO' : 'INVÁLIDO'}`);
  
  return validacao;
}

// ================================================================================
// 13. 🚀 EXPORTAÇÕES E LOGS FINAIS
// ================================================================================

export {
  gerarPromptOtimizado,
  construirContextoUnificado,
  fusaoInteligentePassageiros,
  fusaoInteligentePrecos,
  fusaoInteligenteDestinos,
  selecionarPromptPorTipo,
  gerarPromptAnaliseImagem,
  gerarPromptFallback,
  validarPrompt,
  ajustarPromptParaModelo
};

export default {
  gerarPromptOtimizado,
  construirContextoUnificado,
  fusaoInteligentePassageiros,
  fusaoInteligentePrecos,
  fusaoInteligenteDestinos,
  selecionarPromptPorTipo,
  gerarPromptAnaliseImagem,
  gerarPromptFallback,
  validarPrompt,
  ajustarPromptParaModelo
};

// ================================================================================
// 📊 LOGS FINAIS DE INICIALIZAÇÃO
// ================================================================================

console.log("✅ Prompts v12.0 - SISTEMA UNIFICADO INTELIGENTE CARREGADO!");
console.log("🧠 FUSÃO MULTI-FONTE implementada: HTML + Texto + PDF + Imagem");
console.log("🎯 PRIORIDADE INTELIGENTE: Texto > HTML > Padrão");
console.log("📋 SEÇÕES NUMERADAS: 13 seções organizadas");
console.log("🔧 ARQUITETURA MODULAR: Respeitada e otimizada");
console.log("🚀 SISTEMA VERDADEIRAMENTE INTELIGENTE PRONTO!");

/*
📋 ÍNDICE IMPLEMENTADO:
1. ✅ Construtor Principal
2. ✅ Fusão Inteligente (NÚCLEO)
3. ✅ Análise e Priorização
4. ✅ Determinação de Estratégia
5. ✅ Seleção de Prompt
6. ✅ Prompts Aéreos (6 tipos)
7. ✅ Prompts Hotéis/Pacotes (2 tipos)
8. ✅ Prompts Cruzeiros (1 tipo)
9. ✅ Enriquecimento/Otimização
10. ✅ Funções Auxiliares
11. ✅ Análise Imagens/PDFs
12. ✅ Utilitários/Validação
13. ✅ Exportações/Logs
*/
