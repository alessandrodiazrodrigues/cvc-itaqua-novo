// 🎯 prompts.js - v11.1 - ARQUIVO COMPLETO E CORRIGIDO
// CORREÇÃO: Lógica de 'construirContexto' para usar passageiros da análise.
// COMPLETO: Todas as funções implementadas, sem lacunas ou "..."
// TESTADO: Resolvido problema de passageiros 4 Adultos + 1 Bebê

console.log("🎯 Prompts v11.1 - ARQUIVO COMPLETO E CORRIGIDO");

// ================================================================================
// 1. 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v11.1...");
  
  try {
    // Se houver uma imagem, usamos um prompt específico para análise visual
    if (formData.imagemBase64) {
      console.log("📸 Detectada imagem, usando prompt de análise visual.");
      return gerarPromptAnaliseImagem(formData);
    }

    // Para texto, seguimos o fluxo normal
    const contexto = construirContexto(formData, analise);
    const estrategia = determinarEstrategia(analise);
    const promptEspecifico = selecionarPromptPorTipo(analise.tipoDetectado, contexto, estrategia);
    const promptFinal = enriquecerPrompt(promptEspecifico, formData, analise);
    const promptOtimizado = otimizarPromptFinal(promptFinal, { max_tokens: 4096 });
    
    logPromptGerado(promptOtimizado, analise, estrategia);
    
    console.log(`✅ Prompt otimizado gerado: ${promptOtimizado.length} caracteres`);
    console.log(`🎯 Tipo: ${analise.tipoDetectado}, Complexidade: ${analise.complexidade}`);
    
    return promptOtimizado;
    
  } catch (error) {
    console.error("❌ Erro na geração do prompt:", error);
    return gerarPromptFallback(formData);
  }
}

// ================================================================================
// 2. 🏗️ CONSTRUÇÃO DE CONTEXTO INTELIGENTE (CORREÇÃO APLICADA)
// ================================================================================

function construirContexto(formData, analise) {
  console.log("🏗️ Construindo contexto inteligente com dados da análise...");

  // CORREÇÃO CRÍTICA: Prioriza os passageiros extraídos pela análise,
  // usando os dados do formulário apenas como fallback.
  const adultosExtraidos = analise.dadosVoo?.numeroPassageiros || 0;
  const criancasExtraidas = analise.dadosVoo?.numeroCriancas || 0;
  const bebesExtraidos = analise.dadosVoo?.numeroBebes || 0;

  let textoPassageiros = '';
  if (adultosExtraidos > 0) {
    textoPassageiros += `${adultosExtraidos} adulto(s)`;
  }
  if (criancasExtraidas > 0) {
    textoPassageiros += textoPassageiros ? `, ${criancasExtraidas} criança(s)` : `${criancasExtraidas} criança(s)`;
  }
  if (bebesExtraidos > 0) {
    textoPassageiros += textoPassageiros ? ` e ${bebesExtraidos} bebê(s)` : `${bebesExtraidos} bebê(s)`;
  }
  
  return {
    // Dados básicos
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    destino: formData.destino || analise.dadosVoo?.destino || "Destino a definir",
    
    // Dados da análise
    tipoDetectado: analise.tipoDetectado || analise.tipo_principal,
    confianca: analise.confiancaDeteccao || analise.confianca_deteccao || 0,
    complexidade: analise.complexidade,
    numeroOpcoes: analise.numeroOpcoes || 1,
    
    // Contexto específico da análise
    aeroportos: analise.aeroportosDetectados?.join(", ") || "A detectar",
    companhias: analise.companhiasDetectadas?.join(", ") || "A detectar",
    precos: analise.numeroPrecos || 0,
    datas: analise.numeroDatas || 0,
    
    // Configurações
    temImagem: !!formData.imagemBase64,
    parcelamento: {
      incluirParcelamento: !!formData.parcelamento?.incluirParcelamento,
      parcelas10x: !!formData.parcelamento?.parcelas10x,
      parcelas12x: !!formData.parcelamento?.parcelas12x
    },
    
    // Passageiros (CORREÇÃO APLICADA)
    passageiros: textoPassageiros || `${formData.adultos || 1} adulto(s)`,
    adultos: adultosExtraidos || formData.adultos || 1,
    criancas: criancasExtraidas || formData.criancas || 0
  };
}

// ================================================================================
// 3. ⚙️ DETERMINAÇÃO DE ESTRATÉGIA
// ================================================================================

function determinarEstrategia(analise) {
  console.log("⚙️ Determinando estratégia de prompt...");
  
  const estrategia = {
    foco: 'formatacao_padrao',
    detalhamento: 'medio',
    validacao: 'padrao',
    modelo_recomendado: 'gpt-4o-mini'
  };
  
  // Ajustes baseados na complexidade
  switch (analise.complexidade) {
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
      estrategia.modelo_recomendado = 'gpt-4o-mini';
      break;
      
    case 'baixa':
      estrategia.foco = 'eficiencia';
      estrategia.detalhamento = 'basico';
      estrategia.validacao = 'basica';
      estrategia.modelo_recomendado = 'gpt-4o-mini';
      break;
  }
  
  // Ajustes baseados no tipo
  const tipoDetectado = analise.tipoDetectado || analise.tipo_principal;
  
  if (analise.temMultiplasOpcoes || tipoDetectado?.includes('multiplas')) {
    estrategia.foco = 'comparacao_opcoes';
  }
  
  if (tipoDetectado?.includes('cruzeiro')) {
    estrategia.foco = 'detalhamento_servicos';
  }
  
  if (tipoDetectado?.includes('multitrecho')) {
    estrategia.detalhamento = 'alto';
    estrategia.validacao = 'elevada';
  }
  
  return estrategia;
}

// ================================================================================
// 4. 🎯 SELEÇÃO DE PROMPT POR TIPO
// ================================================================================

function selecionarPromptPorTipo(tipoDetectado, contexto, estrategia) {
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
  return promptFunction(contexto, estrategia);
}

// ================================================================================
// 5. ✈️ PROMPTS ESPECÍFICOS POR TIPO - TODOS COMPLETOS
// ================================================================================

function promptAereoNacionalSimples(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL SIMPLES v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Nacional Ida e Volta Simples
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - AÉREO NACIONAL SIMPLES:

*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO_AEROPORTO] [HH:MM] / [ORIGEM_AEROPORTO] [HH:MM] ([TIPO_VOO])

💰 [VALOR] para [PASSAGEIROS]
${contexto.parcelamento.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável
${contexto.temImagem ? '🔗 [LINK se detectado na imagem]' : ''}

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS. NÃO INVENTE NADA.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL. SUA RESPOSTA DEVE COMEÇAR COM O ASTERISCO DO TÍTULO.
- NÃO ADICIONE TÍTULOS EXTRAS, SEPARADORES (---) OU QUALQUER FORMATAÇÃO MARKDOWN ADICIONAL. APENAS O TEMPLATE.

GERAR ORÇAMENTO PROFISSIONAL:`;
}

function promptAereoConexaoDetalhada(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO CONEXÃO DETALHADA v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Nacional com Conexão Detalhada
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - CONEXÃO DETALHADA:

*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [CONEXAO] [HH:MM] (voo direto)
(conexão em [CONEXAO] - [TEMPO_ESPERA] de espera)
[DD/MM] - [CONEXAO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] (voo direto)
--
[DD/MM] - [DESTINO_AEROPORTO] [HH:MM] / [ORIGEM_AEROPORTO] [HH:MM] ([TIPO_VOO])

💰 [VALOR] para [PASSAGEIROS]
${contexto.parcelamento.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável
${contexto.temImagem ? '🔗 [LINK se detectado]' : ''}

REGRAS ESPECIAIS CONEXÃO:
- Mostrar CADA trecho separadamente
- Incluir tempo de espera específico
- Conexões comuns: Brasília, Recife, Fortaleza

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO COM CONEXÃO DETALHADA:`;
}

function promptAereoSomenteIda(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO SOMENTE IDA v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Somente Ida (sem retorno)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - SOMENTE IDA:

*[COMPANHIA]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] ([TIPO_VOO])

💰 Valor total para [PASSAGEIROS] = [VALOR]
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
[REEMBOLSO]

⚠️ Passagem somente de ida - sem retorno incluído

REGRAS SOMENTE IDA:
- NÃO usar separador "--"
- Incluir aviso obrigatório de "somente ida"
- Texto padrão de taxas e itens inclusos

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO SOMENTE IDA:`;
}

function promptMultiplasOpcoes2(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (2 PLANOS) v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 2 Planos
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - 2 OPÇÕES:

*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO_AEROPORTO] [HH:MM] / [ORIGEM_AEROPORTO] [HH:MM] ([TIPO_VOO])

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

REGRAS 2 OPÇÕES:
- OPÇÃO 1: Básica (só mala de mão)
- OPÇÃO 2: Completa (bagagem + serviços)
- Formato **OPÇÃO X** obrigatório

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO COM 2 OPÇÕES:`;
}

function promptMultiplasOpcoes3(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (3 PLANOS) v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 3 Planos
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - 3 OPÇÕES ESCALONADAS:

*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
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

REGRAS 3 OPÇÕES:
- Escalonamento: Básica → Intermediária → Premium
- OPÇÃO 3 DEVE incluir "Marcação de assento"
- Serviços progressivos

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO COM 3 OPÇÕES:`;
}

function promptMultitrecho(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MULTITRECHO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Multitrecho (múltiplos destinos)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - MULTITRECHO:

*Multitrecho - [COMPANHIAS]*
[DATA_INICIO] a [DATA_FIM] ([DIAS] dias e [NOITES] noites)

*Trecho 1:* [ORIGEM_1] → [DESTINO_1]
[DATA_1] - [AEROPORTO_1] [HORA_1] / [AEROPORTO_2] [HORA_2] ([TIPO_VOO_1])

*Trecho 2:* [ORIGEM_2] → [DESTINO_2]
[DATA_2] - [AEROPORTO_3] [HORA_3] / [AEROPORTO_4] [HORA_4] ([TIPO_VOO_2])

*Trecho 3:* [ORIGEM_3] → [DESTINO_3]
[DATA_3] - [AEROPORTO_5] [HORA_5] / [AEROPORTO_6] [HORA_6] ([TIPO_VOO_3])

💰 [VALOR_TOTAL] para [PASSAGEIROS]
💳 Parcelamento em até 10x sem juros no cartão
✅ [BAGAGEM]
🏷️ [REEMBOLSO]
🔗 [LINK]

REGRAS MULTITRECHO:
- Formato: *Trecho X:* Origem → Destino
- Múltiplas companhias permitidas
- Parcelamento geralmente maior (10x)

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO MULTITRECHO:`;
}

function promptMultiplasCompanhiasInternacionais(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS COMPANHIAS INTERNACIONAIS v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Internacional com Múltiplas Companhias
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - MÚLTIPLAS COMPANHIAS:

*OPÇÃO 1 - [COMPANHIA_1] - [ORIGEM] ✈ [DESTINO]*
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_1] / [AEROPORTO_DESTINO] [HORA_2] ([TIPO_VOO_1])
--
[DATA_VOLTA] - [AEROPORTO_DESTINO] [HORA_3] / [AEROPORTO_ORIGEM] [HORA_4] ([TIPO_VOO_2])

💰 [VALOR_1] para [PASSAGEIROS]
💳 [PARCELAMENTO_1]
🔗 [LINK_1]

*OPÇÃO 2 - [COMPANHIA_2] - [ORIGEM] ✈ [DESTINO]*
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_5] / [AEROPORTO_DESTINO] [HORA_6] ([TIPO_VOO_3])
--
[DATA_VOLTA] - [AEROPORTO_DESTINO] [HORA_7] / [AEROPORTO_ORIGEM] [HORA_8] ([TIPO_VOO_4])

💰 [VALOR_2] para [PASSAGEIROS]
💳 [PARCELAMENTO_2]
🔗 [LINK_2]

🏷️ [REEMBOLSO]
Valores sujeitos a confirmação e disponibilidade

REGRAS MÚLTIPLAS COMPANHIAS:
- Destacar diferenças entre companhias
- Horários e conexões diferentes
- Preços e links separados

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO MÚLTIPLAS COMPANHIAS:`;
}

function promptPacoteCompleto(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - PACOTE COMPLETO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Pacote Completo (Aéreo + Hotel)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - PACOTE:

*Pacote [DESTINO]*
Embarque: [DATA_EMBARQUE]
Pacote para [PASSAGEIROS]

*O Pacote Inclui:*
- Passagem Aérea ida e volta para [DESTINO]
- Taxas de Embarque
- [TRASLADO]
[PASSEIOS_SE_HOUVER]
[SEGURO_SE_HOUVER]
- [NOITES] noites de hospedagem no hotel escolhido

✈️ *Voos [COMPANHIA]:*
[VOOS_DETALHADOS]

**OPÇÃO 1** - [HOTEL_1]
📍 [ENDERECO_1]
🛏️ [QUARTO_1] com [REGIME_1]
💰 [VALOR_1] para [PASSAGEIROS]
🔗 [LINK_1]

**OPÇÃO 2** - [HOTEL_2]
📍 [ENDERECO_2]
🛏️ [QUARTO_2] com [REGIME_2]
✅ Reembolsável conforme regras do bilhete
💰 [VALOR_2] para [PASSAGEIROS]
🔗 [LINK_2]

Valores sujeitos a confirmação e disponibilidade

REGRAS PACOTE:
- Seção "*O Pacote Inclui:*" obrigatória
- Voos separados das opções de hotel
- **OPÇÃO X** para cada hotel

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR PACOTE COMPLETO:`;
}

function promptHotelSomente(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - HOTEL SOMENTE v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Hotel (sem voos)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - HOTEL:

*[NOME_HOTEL]*
📍 [ENDERECO_COMPLETO]
⭐ [CATEGORIA_ESTRELAS]
🛏️ [TIPO_QUARTO] 
🍽️ [REGIME_ALIMENTACAO]

📅 Check-in: [DATA_CHECKIN]
📅 Check-out: [DATA_CHECKOUT]
🌙 [QUANTIDADE_NOITES] noites

💰 [VALOR_TOTAL] para [PASSAGEIROS]
💳 [PARCELAMENTO]
🔗 [LINK_RESERVA]

✅ Incluso: [SERVICOS_INCLUSOS]
❌ Não incluso: [SERVICOS_NAO_INCLUSOS]

Valores sujeitos a confirmação e disponibilidade

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO DE HOTEL:`;
}

function promptCruzeiro(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Cruzeiro Marítimo
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:\n${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - CRUZEIRO:

🚢 *Cruzeiro [NOME_NAVIO]* – [DURACAO] noites
[PASSAGEIROS]
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO]
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
[CABINES_COM_PRECOS]

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

REGRAS CRÍTICAS E FINAIS:
- USE EXCLUSIVAMENTE OS DADOS FORNECIDOS.
- APLIQUE O TEMPLATE ACIMA DE FORMA LITERAL.
- NÃO ADICIONE TÍTULOS EXTRAS OU FORMATAÇÃO MARKDOWN.

GERAR ORÇAMENTO DE CRUZEIRO:`;
}

// ================================================================================
// 6. 🔧 ENRIQUECIMENTO DE PROMPTS
// ================================================================================

function enriquecerPrompt(promptBase, formData, analise) {
  console.log("🔧 Enriquecendo prompt com contexto avançado...");
  let promptEnriquecido = promptBase;
  
  const contextoEspecial = {
    baixaConfianca: analise.confiancaDeteccao < 0.7,
    altaComplexidade: analise.complexidade === 'muito_alta',
    imagemCompleta: !formData.imagemBase64,
    dadosIncompletos: (!formData.observacoes || formData.observacoes.length < 50) && 
                      (!formData.textoColado || formData.textoColado.length < 50)
  };
  
  if (contextoEspecial.baixaConfianca) {
    promptEnriquecido += `\n\n⚠️ VALIDAÇÃO EXTRA (Confiança: ${((analise.confiancaDeteccao || 0) * 100).toFixed(1)}%):
- REVISAR cuidadosamente o tipo detectado
- EM CASO DE DÚVIDA, usar formato mais simples
- PRIORIZAR clareza sobre complexidade`;
  }
  
  if (contextoEspecial.altaComplexidade) {
    promptEnriquecido += `\n\n🎯 ALTA COMPLEXIDADE DETECTADA:
- Aplicar MÁXIMO rigor na formatação
- Verificar TODAS as regras críticas listadas
- Organizar informações de forma hierárquica
- Priorizar legibilidade profissional`;
  }
  
  if (contextoEspecial.imagemCompleta) {
    promptEnriquecido += `\n\n📸 ANÁLISE DE IMAGEM:
- Examinar TODOS os elementos visuais
- Extrair dados exatos: horários, preços, datas
- Preservar links se visíveis
- Detectar layout específico (tabular, vertical)`;
  }
  
  if (contextoEspecial.dadosIncompletos) {
    promptEnriquecido += `\n\n📋 DADOS LIMITADOS DETECTADOS:
- Usar apenas informações REAIS fornecidas
- NÃO inventar horários, preços ou datas
- Focar na formatação dos dados disponíveis
- Indicar "A detectar" se necessário`;
  }
  
  return promptEnriquecido;
}

// ================================================================================
// 7. 🔧 OTIMIZAÇÃO DE PROMPTS
// ================================================================================

function otimizarPromptFinal(prompt, limitesModelo) {
  console.log("🔧 Otimizando prompt para limites do modelo...");
  let promptOtimizado = prompt;
  
  const tamanhoAtual = calcularTamanhoPrompt(prompt);
  
  if (tamanhoAtual.tokens_estimados > limitesModelo.max_tokens * 0.7) {
    console.warn("⚠️ Prompt muito longo, aplicando otimizações...");
    
    // Remover seções opcionais
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
// 8. 📊 FUNÇÕES AUXILIARES COMPLETAS
// ================================================================================

function gerarPromptAnaliseImagem(formData) {
  return `ORÇAMENTO CVC ITAQUA - ANÁLISE DE IMAGEM v11.1

🔍 INSTRUÇÕES PARA ANÁLISE DE IMAGEM DE VIAGEM:

Examine cuidadosamente a imagem fornecida e extraia TODAS as informações visíveis sobre viagem/orçamento.

📋 DADOS A EXTRAIR:
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

⚠️ REGRAS CRÍTICAS:
1. Use APENAS informações VISÍVEIS na imagem
2. NÃO invente dados que não estejam claros
3. Preserve horários EXATOS como mostrados
4. Mantenha valores monetários precisos
5. Se algo não estiver claro, indique "Não visível na imagem"

🎯 FORMATO DE RESPOSTA:
Organize as informações em um orçamento profissional seguindo o template CVC, usando exclusivamente os dados extraídos da imagem.

Tipos selecionados pelo usuário: ${formData.tipos?.join(', ') || 'Não especificado'}
Destino informado: ${formData.destino || 'Conforme imagem'}

ANALISAR IMAGEM E GERAR ORÇAMENTO:`;
}

function gerarPromptFallback(formData) {
  return `ORÇAMENTO CVC ITAQUA - MODO FALLBACK

Dados disponíveis:
- Tipos: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}
- Observações: ${formData.observacoes || 'Nenhuma'}

Gere um orçamento básico com os dados disponíveis, indicando "A confirmar" para informações não fornecidas.

GERAR ORÇAMENTO BÁSICO:`;
}

function logPromptGerado(prompt, analise, estrategia) {
  console.log("📊 === LOG DE PROMPT GERADO ===");
  console.log(`🎯 Tipo: ${analise.tipoDetectado}`);
  console.log(`📈 Confiança: ${((analise.confiancaDeteccao || 0) * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade}`);
  console.log(`⚙️ Estratégia: ${estrategia.foco}`);
  console.log(`📏 Tamanho: ${prompt.length} caracteres`);
  console.log(`🤖 Modelo recomendado: ${estrategia.modelo_recomendado}`);
}

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

// ================================================================================
// 9. 📊 PROMPTS ESPECIALIZADOS ADICIONAIS
// ================================================================================

function gerarPromptDicasDestino(destino) {
  return `DICAS DE VIAGEM CVC ITAQUA - ${destino.toUpperCase()}

Gere dicas completas e práticas para viagem ao destino ${destino}, incluindo:

📅 Melhor época para viajar
🎒 O que levar na mala
🗺️ Principais atrações
💰 Orçamento diário sugerido
🚖 Transporte local
🍽️ Gastronomia típica
📱 Apps úteis
⚠️ Cuidados importantes

Formato: Lista organizada com emojis e informações práticas.

GERAR DICAS COMPLETAS:`;
}

function gerarPromptRankingHoteis(destino) {
  return `RANKING DE HOTÉIS CVC ITAQUA - ${destino.toUpperCase()}

Crie um ranking com os 5 melhores hotéis em ${destino}, incluindo:

🏨 Nome do hotel
⭐ Categoria (estrelas)
📍 Localização
💰 Faixa de preço (diária)
✅ Principais diferenciais
🎯 Público-alvo

Organize do 1º ao 5º lugar com justificativas.

GERAR RANKING DE HOTÉIS:`;
}

function gerarPromptAnaliseRelatorio(dados) {
  return `ANÁLISE DE RELATÓRIO CVC ITAQUA

Dados para análise:
${JSON.stringify(dados, null, 2)}

Gere uma análise detalhada incluindo:
- Tendências identificadas
- Métricas principais
- Insights e recomendações
- Gráficos sugeridos (descrição)

GERAR ANÁLISE COMPLETA:`;
}

// ================================================================================
// 10. 🔧 UTILITÁRIOS E VALIDAÇÃO
// ================================================================================

function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt para modelo: ${modelo}`);
  
  // Ajustes específicos por modelo
  switch (modelo) {
    case 'gpt-4o':
      // GPT-4o pode lidar com prompts mais complexos
      return prompt;
      
    case 'gpt-4o-mini':
      // GPT-4o-mini prefere instruções mais diretas
      return prompt.replace(/ANÁLISE INTELIGENTE DETECTOU:[\s\S]*?(?=DADOS DA VIAGEM|FORMATAÇÃO)/g, '');
      
    case 'claude-3-5-sonnet-20240620':
      // Claude prefere estrutura mais clara
      return prompt.replace(/REGRAS CRÍTICAS E FINAIS:/g, 'INSTRUÇÕES IMPORTANTES:');
      
    default:
      return prompt;
  }
}

function validarPrompt(prompt, tipoDetectado) {
  const validacao = {
    valido: true,
    problemas: [],
    sugestoes: []
  };
  
  // Verificações básicas
  if (!prompt || prompt.length < 100) {
    validacao.valido = false;
    validacao.problemas.push('Prompt muito curto');
  }
  
  if (!prompt.includes('GERAR')) {
    validacao.problemas.push('Falta instrução de geração');
  }
  
  // Verificações específicas por tipo
  if (tipoDetectado?.includes('cruzeiro') && !prompt.includes('🚢')) {
    validacao.sugestoes.push('Adicionar emoji de cruzeiro');
  }
  
  if (tipoDetectado?.includes('multitrecho') && !prompt.includes('Trecho')) {
    validacao.problemas.push('Template multitrecho deve incluir "Trecho"');
  }
  
  return validacao;
}

// ================================================================================
// 11. 🚀 EXPORTAÇÕES
// ================================================================================

export {
  gerarPromptOtimizado,
  construirContexto,
  selecionarPromptPorTipo,
  gerarPromptAnaliseImagem,
  gerarPromptFallback,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  validarPrompt,
  ajustarPromptParaModelo
};

export default {
  gerarPromptOtimizado,
  construirContexto,
  selecionarPromptPorTipo,
  gerarPromptAnaliseImagem,
  gerarPromptFallback,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  validarPrompt,
  ajustarPromptParaModelo
};

// ================================================================================
// 12. 🎯 LOGS FINAIS
// ================================================================================

console.log("✅ Prompts v11.1 - ARQUIVO COMPLETO E FUNCIONAL!");
console.log("🔧 CORREÇÃO aplicada: passageiros da análise prioritários");
console.log("📋 TODOS os 10 tipos de prompt implementados");
console.log("🛠️ Funções auxiliares completas");
console.log("🚀 Sistema pronto para resolver problema dos passageiros!");
