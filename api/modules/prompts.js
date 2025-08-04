function construirContexto(formData, analise) {
  console.log("🏗️ Construindo contexto inteligente...");
  
  return {
    // Dados básicos
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    
    // Dados extraídos da análise
    tipoDetectado: analise.tipoDetectado,
    confianca: analise.confiancaDeteccao,
    complexidade: analise.complexidade,
    numeroOpcoes: analise.numeroOpcoes || 1,
    
    // Contexto específico
    aeroportos: analise.aeroportosDetectados?.join(", ") || "A detectar",
    companhias: analise.companhiasDetectadas?.join(", ") || "A detectar",
    precos: analise.numeroPrecos || 0,
    datas: analise.numeroDatas || 0,
    
    // Informações do usuário
    destino: formData.destino || "A detectar",
    adultos: formData.adultos || "A detectar",
    criancas: formData.criancas || 0,
    idadesCriancas: formData.idadesCriancas || [],
    
    // Configurações especiais
    parcelamento: formData.parcelamento || {},
    isImagem: !!formData.imagemBase64,
    
    // Flags importantes
    temEscalas: analise.temEscalas || false,
    temMultiplasOpcoes: analise.temMultiplasOpcoes || false,
    isIdaVolta: analise.isIdaVolta || false,
    isSomenteIda: analise.isSomenteIda || false
  };
}

// ================================================================================
// ⚙️ DETERMINAÇÃO DE ESTRATÉGIA
// ================================================================================

function determinarEstrategia(analise) {
  console.log("⚙️ Determinando estratégia de prompt...");
  
  const estrategia = {
    foco: 'formatacao_profissional',
    detalhamento: 'medio',
    validacao: 'padrao',
    modelo_recomendado: 'gpt-4o-mini'
  };
  
  // Ajustes baseados na complexidade
  switch (analise.complexidade) {
    case 'muito_alta':
      estrategia.foco = 'precisao_maxima';
      estrategia.detalhamento = 'alto';
      estrategia.validacao = 'rigorosa';
      estrategia.modelo_recomendado = 'gpt-4o';
      break;
      
    case 'alta':
      estrategia.foco = 'formatacao_e_precisao';
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
  if (analise.temMultiplasOpcoes) {
    estrategia.foco = 'comparacao_opcoes';
  }
  
  if (analise.tipoDetectado?.includes('cruzeiro')) {
    estrategia.foco = 'detalhamento_servicos';
  }
  
  if (analise.tipoDetectado?.includes('multitrecho')) {
    estrategia.detalhamento = 'alto';
    estrategia.validacao = 'elevada';
  }
  
  return estrategia;
}

// ================================================================================
// 🎯 SELEÇÃO DE PROMPT POR TIPO
// ================================================================================

function selecionarPromptPorTipo(tipoDetectado, contexto, estrategia) {
  console.log(`🎯 Selecionando prompt para tipo: ${tipoDetectado}`);
  
  const prompts = {
    aereoNacionalSimples: promptAereoNacionalSimples,
    aereoConexaoDetalhada: promptAereoConexaoDetalhada,
    aereoSomenteIda: promptAereoSomenteIda,
    multiplasOpcoes2: promptMultiplasOpcoes2,
    multiplasOpcoes3: promptMultiplasOpcoes3,
    multitrecho: promptMultitrecho,
    multiplasCompanhiasInternacionais: promptMultiplasCompanhiasInternacionais,
    pacoteCompleto: promptPacoteCompleto,
    cruzeiro: promptCruzeiro
  };
  
  const promptFunction = prompts[tipoDetectado] || prompts.aereoNacionalSimples;
  return promptFunction(contexto, estrategia);
}

// ================================================================================
// ✈️ PROMPTS ESPECÍFICOS POR TIPO
// ================================================================================

function promptAereoNacionalSimples(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL SIMPLES

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Nacional Ida e Volta Simples
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - AÉREO NACIONAL SIMPLES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
${contexto.parcelamento.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável
${contexto.isImagem ? '🔗 [LINK se detectado na imagem]' : ''}

REGRAS CRÍTICAS:
1. ⏰ HORÁRIOS: "06:20" (NUNCA "06: 20")
2. ✈️ AEROPORTOS: CGH → Congonhas, GRU → Guarulhos
3. 🛫 CONEXÕES: "com conexão" (NUNCA "escala")
4. 👥 PASSAGEIROS: "02 adultos" (zero à esquerda)
5. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão nacional)
6. 💰 VALORES: "R$ 1.464,02" (espaço após R$)
7. 📅 SEPARADOR: "--" entre ida e volta
8. 🧹 SEM cabeçalhos técnicos na resposta

${contexto.destino !== 'A detectar' ? `DESTINO CONFIRMADO: ${contexto.destino}` : ''}
${contexto.adultos !== 'A detectar' ? `PASSAGEIROS CONFIRMADOS: ${contexto.adultos} adultos` : ''}

GERAR ORÇAMENTO LIMPO PARA WHATSAPP:`;
}

function promptAereoConexaoDetalhada(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO COM CONEXÃO DETALHADA

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo com Conexão Detalhada
- Conexões identificadas: ${contexto.temEscalas ? 'SIM' : 'POSSÍVEL'}
- Aeroportos detectados: ${contexto.aeroportos}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - CONEXÃO DETALHADA:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [CONEXÃO] [HH:MM] (voo direto)
(conexão em [CONEXÃO] - [TEMPO] de espera)
[DD/MM] - [CONEXÃO] [HH:MM] / [DESTINO] [HH:MM] (voo direto)
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
💳 [PARCELAMENTO se solicitado]
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 [LINK se detectado]

INSTRUÇÕES ESPECÍFICAS PARA CONEXÕES:
1. 🔍 DETECTAR cada trecho da conexão separadamente
2. ⏱️ MOSTRAR tempo de espera entre voos
3. 🏢 IDENTIFICAR aeroporto de conexão (BSB, FOR, REC)
4. 🛫 ESPECIFICAR "voo direto" para cada trecho individual
5. 📍 FORMATO: "conexão em [CIDADE] - [TEMPO] de espera"

GERAR ORÇAMENTO COM CONEXÃO DETALHADA:`;
}

function promptAereoSomenteIda(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO SOMENTE IDA

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Somente Ida
- Sem volta detectada
- Datas identificadas: ${contexto.datas}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - SOMENTE IDA:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])

💰 Valor total para [PASSAGEIROS] = R$ [VALOR]
Valores sujeitos a confirmação e disponibilidade
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ Não reembolsável

⚠️ Passagem somente de ida - sem retorno incluído

REGRAS ESPECÍFICAS SOMENTE IDA:
1. 🚫 NÃO incluir separador "--"
2. 🚫 NÃO mencionar volta ou retorno
3. ⚠️ SEMPRE incluir aviso "somente de ida"
4. 📦 ESPECIFICAR bagagem detalhada
5. 💰 FORMATO especial: "Valor total para [X] = R$ [Y]"

GERAR ORÇAMENTO SOMENTE IDA:`;
}

function promptMultiplasOpcoes2(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (2 PLANOS)

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 2 Planos
- Opções identificadas: ${contexto.numeroOpcoes}
- Preços detectados: ${contexto.precos}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - 2 OPÇÕES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 **OPÇÃO 1** - R$ [VALOR_1]
✅ Só mala de mão incluída
💳 [PARCELAMENTO_1 se solicitado]
🔗 [LINK_1 se detectado]

💰 **OPÇÃO 2** - R$ [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
💳 [PARCELAMENTO_2 se solicitado]
🔗 [LINK_2 se detectado]

Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS MÚLTIPLAS OPÇÕES:
1. 🔢 NUMERAÇÃO: "**OPÇÃO 1**", "**OPÇÃO 2**" (negrito)
2. 🧳 BAGAGEM ESCALONADA:
   - Opção 1: "Só mala de mão incluída"
   - Opção 2: "Mala de mão + bagagem despachada"
3. 💰 ORDEM: Menor preço primeiro
4. ✅ SERVIÇOS PROGRESSIVOS: Opção 2 tem mais benefícios
5. 🔗 LINKS INDIVIDUAIS se detectados

GERAR MÚLTIPLAS OPÇÕES FORMATADAS:`;
}

function promptMultiplasOpcoes3(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (3 PLANOS)

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 3 Planos
- Sistema escalonado detectado
- Opção premium identificada

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - 3 OPÇÕES ESCALONADAS:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 **OPÇÃO 1** - R$ [VALOR_1]
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - R$ [VALOR_3]
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS 3 OPÇÕES:
1. 📈 ESCALONAMENTO PROGRESSIVO:
   - Opção 1: Básica (só mala de mão)
   - Opção 2: Intermediária (+ bagagem + cancelamento)
   - Opção 3: Premium (+ 2 bagagens + reembolso + assento)
2. 💰 ORDEM CRESCENTE de preços
3. ✅ BENEFÍCIOS CUMULATIVOS
4. 🎯 OPÇÃO 3 = Experiência completa

GERAR 3 OPÇÕES ESCALONADAS:`;
}

function promptMultitrecho(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MULTITRECHO

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Viagem Multitrecho
- Roteiro complexo identificado
- Múltiplas datas e destinos

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - MULTITRECHO:

*Multitrecho - [COMPANHIAS]*
[DD/MM] a [DD/MM] ([X] dias e [Y] noites)

*Trecho 1:* [ORIGEM_1] → [DESTINO_1]
[DD/MM] - [ORIGEM_1] [HH:MM] / [DESTINO_1] [HH:MM] ([TIPO_VOO])

*Trecho 2:* [ORIGEM_2] → [DESTINO_2]
[DD/MM] - [ORIGEM_2] [HH:MM] / [DESTINO_2] [HH:MM] ([TIPO_VOO])

*Trecho 3:* [ORIGEM_3] → [DESTINO_3]
[DD/MM] - [ORIGEM_3] [HH:MM] / [DESTINO_3] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR_TOTAL] para [PASSAGEIROS]
💳 Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ [X] + 9x de R$ [Y] s/ juros
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 [LINK se detectado]

Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS MULTITRECHO:
1. 🗺️ NUMERAÇÃO: "*Trecho 1:*", "*Trecho 2:*", etc.
2. ➡️ SETAS: "Origem → Destino" para cada trecho
3. 📅 PERÍODO TOTAL: Calcular dias e noites totais
4. 🛫 MÚLTIPLAS COMPANHIAS possíveis
5. 💳 PARCELAMENTO ESTENDIDO (até 10x)

GERAR MULTITRECHO DETALHADO:`;
}

function promptMultiplasCompanhiasInternacionais(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS COMPANHIAS INTERNACIONAIS

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Companhias Internacionais
- Destino internacional: ${contexto.destino}
- Companhias identificadas: ${contexto.companhias}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - MÚLTIPLAS COMPANHIAS:

*OPÇÃO 1 - [COMPANHIA_1] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR_1] para [PASSAGEIROS]
💳 [PARCELAMENTO_1 se solicitado]
🔗 [LINK_1 se detectado]

*OPÇÃO 2 - [COMPANHIA_2] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR_2] para [PASSAGEIROS]
💳 [PARCELAMENTO_2 se solicitado]
🔗 [LINK_2 se detectado]

🏷️ Não reembolsável
Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS MÚLTIPLAS COMPANHIAS:
1. 🏢 COMPANHIAS DESTACADAS: Nome da companhia no cabeçalho
2. 🌍 FORMATO INTERNACIONAL: "Origem ✈ Destino"
3. 🧳 BAGAGEM: "Mala de mão + bagagem despachada 23kg"
4. 💰 COMPARAÇÃO: Focar nas diferenças de preço/serviço
5. 🔗 LINKS INDIVIDUAIS para cada companhia

GERAR COMPARATIVO DE COMPANHIAS:`;
}

function promptPacoteCompleto(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - PACOTE COMPLETO

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Pacote Completo (Aéreo + Hotel + Serviços)
- Estrutura de pacote identificada
- Múltiplas opções de hospedagem possíveis

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - PACOTE COMPLETO:

*Pacote [DESTINO]*
Embarque: [DD/MM]
Pacote para [PASSAGEIROS]

*O Pacote Inclui:*
- Passagem Aérea ida e volta para [DESTINO]
- Taxas de Embarque
- Traslado Aeroporto / Hotel / Aeroporto
- [PASSEIOS se houver]
- [SEGURO se houver]
- [X] noites de hospedagem no hotel escolhido

✈️ *Voos [COMPANHIA]:*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

**OPÇÃO 1** - [HOTEL_1]
📍 [ENDEREÇO_1 se fornecido]
🛏️ [TIPO_QUARTO] com [REGIME_ALIMENTAÇÃO]
💰 R$ [VALOR_1] para [PASSAGEIROS]
🔗 [LINK_1 se detectado]

**OPÇÃO 2** - [HOTEL_2] [⭐ CATEGORIA se especial]
📍 [ENDEREÇO_2 se fornecido]
🛏️ [TIPO_QUARTO] com [REGIME_ALIMENTAÇÃO]
✅ Reembolsável conforme regras do bilhete [se aplicável]
💰 R$ [VALOR_2] para [PASSAGEIROS]
🔗 [LINK_2 se detectado]

Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS PACOTE:
1. 📦 SEÇÃO "O Pacote Inclui:" obrigatória
2. ✈️ VOOS: Seção separada após inclusões
3. 🏨 HOTÉIS: Opções numeradas com detalhes
4. 📍 ENDEREÇOS: Incluir se fornecidos
5. 🛏️ QUARTOS: Especificar tipo e regime

GERAR PACOTE COMPLETO ESTRUTURADO:`;
}

function promptCruzeiro(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Cruzeiro
- Estrutura por cabines identificada
- Sistema de preços por acomodação

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - CRUZEIRO:

🚢 *Cruzeiro [NAVIO]* – [X] noites
Para: [PASSAGEIROS]
📅 Embarque: [DD/MM] ([PORTO])
🌊 Roteiro incrível pelo litoral brasileiro!

💰 *Opções de Cabines:*
**CABINE INTERNA** - R$ [VALOR_1] ([OCUPAÇÃO])
**CABINE EXTERNA** - R$ [VALOR_2] ([OCUPAÇÃO])
**CABINE COM VARANDA** - R$ [VALOR_3] ([OCUPAÇÃO])
**SUÍTE** - R$ [VALOR_4] ([OCUPAÇÃO])

🗺️ *Itinerário:* [se fornecido]
[ROTEIRO_DETALHADO]

🍹 *Pacotes de Bebidas:* [se fornecido]
[PACOTES_BEBIDAS]

✅ Inclui: hospedagem a bordo, pensão completa, entretenimento
🚫 Não inclui: taxas portuárias, bebidas, excursões

📋 Documentação: RG original (máx. 10 anos) ou passaporte

🔗 [LINK se detectado]

📲 Me chama pra garantir a sua cabine! 🌴🛳️

REGRAS ESPECÍFICAS CRUZEIRO:
1. 🚢 EMOJI DE NAVIO obrigatório no início
2. 🛏️ CABINES: Preços POR CABINE (não por pessoa)
3. 📋 DOCUMENTAÇÃO: Sempre incluir requisitos
4. 🗺️ ITINERÁRIO: Só se fornecido explicitamente
5. 🍹 BEBIDAS: Só mencionar se informado
6. 💰 OCUPAÇÃO: Especificar quantas pessoas por cabine

GERAR ORÇAMENTO DE CRUZEIRO:`;
}

// ================================================================================
// 🔧 ENRIQUECIMENTO DE PROMPT
// ================================================================================

function enriquecerPrompt(promptBase, formData, analise) {
  console.log("🔧 Enriquecendo prompt com contexto avançado...");
  
  let promptEnriquecido = promptBase;
  
  // Adicionar instruções de parcelamento se solicitado
  if (formData.parcelamento?.incluirParcelamento) {
    promptEnriquecido += adicionarInstrucoesParcelamento(formData.parcelamento);
  }
  
  // Adicionar instruções especiais para imagens
  if (formData.imagemBase64) {
    promptEnriquecido += adicionarInstrucoesImagem();
  }
  
  // Adicionar validações baseadas na confiança
  if (analise.confiancaDeteccao < 0.7) {
    promptEnriquecido += adicionarValidacaoExtra();
  }
  
  // Adicionar instruções de complexidade
  if (analise.complexidade === 'muito_alta') {
    promptEnriquecido += adicionarInstrucoesComplexidade();
  }
  
  // Adicionar contexto de crianças se necessário
  if (formData.criancas > 0) {
    promptEnriquecido += adicionarContextoCriancas(formData);
  }
  
  return promptEnriquecido;
}

function adicionarInstrucoesParcelamento(parcelamento) {
  let instrucoes = '\n\nCONFIGURAÇÃO DE PARCELAMENTO:';
  
  if (parcelamento.parcelas10x && parcelamento.parcelas12x) {
    instrucoes += '\n- Incluir opções de 10x E 12x sem juros';
    instrucoes += '\n- Formato: "10x de R$ [X] s/ juros" E "12x de R$ [Y] s/ juros"';
  } else if (parcelamento.parcelas10x) {
    instrucoes += '\n- Incluir APENAS opção de 10x sem juros';
    instrucoes += '\n- Formato: "10x de R$ [X] s/ juros no cartão"';
  } else if (parcelamento.parcelas12x) {
    instrucoes += '\n- Incluir APENAS opção de 12x sem juros';
    instrucoes += '\n- Formato: "12x de R$ [X] s/ juros no cartão"';
  }
  
  instrucoes += '\n- SEMPRE calcular o valor das parcelas automaticamente';
  instrucoes += '\n- NUNCA usar "entrada" - sempre "primeira parcela"';
  
  return instrucoes;
}

function adicionarInstrucoesImagem() {
  return `\n\nINSTRUÇÕES ESPECIAIS PARA ANÁLISE DE IMAGEM:
- Analisar CUIDADOSAMENTE todos os elementos visuais
- Extrair horários, preços e informações exatos da imagem
- Identificar automaticamente o tipo de layout (vertical, horizontal, tabular)
- Detectar múltiplas opções se houver caixas/seções separadas
- Preservar links se visíveis na imagem
- Converter códigos de aeroportos mesmo se aparecem na imagem`;
}

function adicionarValidacaoExtra() {
  return `\n\nVALIDAÇÃO EXTRA (Confiança Baixa):
- REVISAR cuidadosamente o tipo de orçamento detectado
- CONFIRMAR se é ida/volta ou somente ida
- VERIFICAR se há múltiplas opções real ou aparente
- VALIDAR todos os horários e datas antes de formatar
- EM CASO DE DÚVIDA, usar template mais simples`;
}

function adicionarInstrucoesComplexidade() {
  return `\n\nINSTRUÇÕES DE ALTA COMPLEXIDADE:
- Aplicar máximo rigor na formatação
- Verificar TODAS as regras críticas
- Detalhar conexões se houver
- Organizar informações de forma clara e hierárquica
- Priorizar legibilidade e profissionalismo`;
}

function adicionarContextoCriancas(formData) {
  let contexto = '\n\nCONTEXTO DE CRIANÇAS:';
  
  if (formData.idadesCriancas && formData.idadesCriancas.length > 0) {
    if (formData.idadesCriancas.length === 1) {
      contexto += `\n- Formato: "${formData.criancas.toString().padStart(2, '0')} criança (${formData.idadesCriancas[0]} anos)"`;
    } else {
      contexto += `\n- Formato: "${formData.criancas.toString().padStart(2, '0')} crianças (${formData.idadesCriancas.join(' e ')} anos)"`;
    }
  } else {
    contexto += `\n- Formato: "${formData.criancas.toString().padStart(2, '0')} ${formData.criancas === 1 ? 'criança' : 'crianças'}" (sem idades)`;
  }
  
  contexto += '\n- SEMPRE incluir idades se fornecidas';
  contexto += '\n- Usar zero à esquerda para números menores que 10';
  
  return contexto;
}

// ================================================================================
// 🔄 PROMPT FALLBACK
// ================================================================================

function gerarPromptFallback(formData) {
  console.log("🔄 Gerando prompt fallback...");
  
  const tiposTexto = formData.tipos?.join(", ") || "Orçamento geral";
  
  return `ORÇAMENTO CVC ITAQUA - MODO SEGURO

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes || 'Não informado'}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

REGRAS OBRIGATÓRIAS (MODO SEGURO):
1. 🧹 FORMATO LIMPO: Sem cabeçalhos técnicos, pronto para WhatsApp
2. ⏰ HORÁRIOS: Formato "06:20" (nunca "06: 20")
3. 📅 DATAS: Formato "15/11" (DD/MM)
4. ✈️ AEROPORTOS: Converter códigos (CGH → Congonhas, GRU → Guarulhos)
5. 💰 PREÇOS: Usar apenas valores reais fornecidos
6. 👥 PASSAGEIROS: "02 adultos" (com zero à esquerda)
7. 🧳 BAGAGEM NACIONAL: "Só mala de mão incluída" (padrão)
8. 🧳 BAGAGEM INTERNACIONAL: "Mala de mão + bagagem despachada 23kg"
9. 🏷️ REEMBOLSO: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
10. 🛫 CONEXÕES: "com conexão" (nunca "escala")

CAMPOS DISPONÍVEIS:
${formData.destino ? `- Destino: ${formData.destino}` : '- Destino: A detectar'}
${formData.adultos ? `- Adultos: ${formData.adultos}` : '- Adultos: A detectar'}
${formData.criancas > 0 ? `- Crianças: ${formData.criancas}${formData.idadesCriancas?.length > 0 ? ` (${formData.idadesCriancas.join(', ')} anos)` : ''}` : ''}

${formData.parcelamento?.incluirParcelamento ? 
`PARCELAMENTO SOLICITADO:
${formData.parcelamento.parcelas10x ? '- Incluir 10x sem juros' : ''}
${formData.parcelamento.parcelas12x ? '- Incluir 12x sem juros' : ''}
- Calcular automaticamente o valor das parcelas` :
'PARCELAMENTO: Não incluir (exceto se explícito nas observações)'}

GERAR ORÇAMENTO PROFISSIONAL LIMPO:`;
}

// ================================================================================
// 🎯 PROMPTS PARA FUNCIONALIDADES AUXILIARES
// ================================================================================

function gerarPromptDicasDestino(destino, contexto) {
  return `DICAS PERSONALIZADAS - ${destino.toUpperCase()}

CONTEXTO:
- Destino: ${destino}
- Período: ${contexto.periodo || 'A definir'}
- Viajantes: ${contexto.passageiros || 'Família'}
- Tipo de viagem: ${contexto.tipoViagem || 'Lazer'}

GERAR DICAS PRÁTICAS E PERSONALIZADAS:

🌟 *DICAS DE ${destino.toUpperCase()}*

🗓️ *Melhor época:* [Análise do período e clima]
🎯 *Atrações imperdíveis:* [Baseado no perfil dos viajantes]
🍽️ *Gastronomia local:* [Pratos típicos e onde encontrar]
🏨 *Onde ficar:* [Melhores regiões por tipo de viagem]
🚗 *Como se locomover:* [Transporte local e dicas]
💡 *Dicas importantes:* [Informações práticas específicas]
💰 *Orçamento médio:* [Custos aproximados por categoria]
📱 *Apps úteis:* [Aplicativos recomendados]

FORMATO:
- Informações práticas e atualizadas
- Linguagem acessível e amigável
- Dicas específicas para o perfil identificado
- Sem informações genéricas demais`;
}

function gerarPromptRankingHoteis(destino, contexto) {
  return `RANKING DE HOTÉIS - ${destino.toUpperCase()}

CONTEXTO:
- Destino: ${destino}
- Orçamento: ${contexto.orcamento || 'Variado'}
- Tipo de viagem: ${contexto.tipoViagem || 'Lazer'}
- Passageiros: ${contexto.passageiros || 'Família'}

GERAR RANKING DETALHADO DE HOTÉIS:

🏨 *RANKING DE HOTÉIS - ${destino.toUpperCase()}*

💰 [HOTEL ECONÔMICO]
🛏️ [Categoria]: [Descrição do padrão]
📍 [Localização detalhada]
⭐ Avaliações: [Booking] | [Google] | [TripAdvisor]
✅ Destaques: [Principais vantagens]
❌ Atenção: [Possíveis limitações]

🏖️ [HOTEL INTERMEDIÁRIO]
🛏️ [Categoria]: [Descrição do padrão]
📍 [Localização detalhada]
⭐ Avaliações: [Scores de plataformas]
✅ Destaques: [Principais vantagens]
💡 Dica: [Informação extra relevante]

⭐ [HOTEL PREMIUM]
🛏️ [Categoria]: [Descrição do padrão]
📍 [Localização privilegiada]
⭐ Avaliações: [Scores altos]
✅ Destaques: [Serviços diferenciados]
🎯 Ideal para: [Perfil de hóspede]

FORMATO:
- Ranking por categoria de preço
- Informações objetivas e atualizadas
- Avaliações de múltiplas plataformas
- Dicas específicas por hotel
- Localização detalhada`;
}

// ================================================================================
// 🧠 PROMPTS PARA ANÁLISE DE RELATÓRIOS
// ================================================================================

function gerarPromptAnaliseRelatorio(tipoRelatorio) {
  return `ANÁLISE EXECUTIVA DE RELATÓRIO

TIPO DE RELATÓRIO: ${tipoRelatorio}

INSTRUÇÕES PARA ANÁLISE:
1. 📊 EXTRAIR métricas principais e KPIs
2. 📈 IDENTIFICAR tendências e padrões
3. 🎯 DESTACAR pontos críticos de atenção
4. 💡 SUGERIR ações práticas baseadas nos dados
5. 📋 RESUMIR em formato executivo

FORMATO DE SAÍDA:

📊 *RESUMO EXECUTIVO - ${tipoRelatorio.toUpperCase()}*

🎯 *Principais Achados:*
- [Métrica 1]: [Valor] ([Variação])
- [Métrica 2]: [Valor] ([Tendência])
- [Métrica 3]: [Valor] ([Status])

📈 *Tendências Identificadas:*
- [Tendência positiva]
- [Tendência de atenção]
- [Oportunidade detectada]

🚨 *Pontos de Atenção:*
- [Problema 1]: [Impacto]
- [Problema 2]: [Urgência]

💡 *Recomendações Imediatas:*
1. [Ação prioritária]
2. [Melhoria sugerida]
3. [Próximo passo]

🎯 *Bottom Line:*
[Conclusão principal em 1-2 frases]

REGRAS:
- Linguagem executiva e objetiva
- Dados específicos sempre que possível
- Foco em acionabilidade
- Máximo 200 palavras no resumo`;
}

// ================================================================================
// 🔧 UTILITÁRIOS DE PROMPT
// ================================================================================

function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt para modelo: ${modelo}`);
  
  let promptAjustado = prompt;
  
  switch (modelo) {
    case 'gpt-4o':
      // GPT-4o pode lidar com prompts mais complexos
      promptAjustado += '\n\nMODO GPT-4O: Máxima precisão e detalhamento';
      break;
      
    case 'gpt-4o-mini':
      // GPT-4o-mini precisa de instruções mais diretas
      promptAjustado += '\n\nMODO OTIMIZADO: Foco em eficiência e precisão';
      break;
      
    case 'claude-3-5-sonnet':
      // Claude é melhor com análise de imagens
      promptAjustado += '\n\nMODO CLAUDE: Análise visual detalhada e contextual';
      break;
  }
  
  return promptAjustado;
}

function calcularTamanhoPrompt(prompt) {
  const tokens = prompt.split(/\s+/).length * 1.3; // Estimativa aproximada
  return {
    caracteres: prompt.length,
    palavras: prompt.split(/\s+/).length,
    tokens_estimados: Math.ceil(tokens),
    categoria: tokens < 1000 ? 'pequeno' : tokens < 2000 ? 'médio' : 'grande'
  };
}

function validarPrompt(prompt, tipoDetectado) {
  const validacao = {
    valido: true,
    problemas: [],
    sugestoes: []
  };
  
  // Verificar tamanho
  const tamanho = calcularTamanhoPrompt(prompt);
  if (tamanho.tokens_estimados > 3000) {
    validacao.problemas.push('Prompt muito longo (pode ser truncado)');
    validacao.sugestoes.push('Considerar simplificar instruções');
  }
  
  // Verificar elementos obrigatórios
  const elementosObrigatorios = [
    'FORMATAÇÃO OBRIGATÓRIA',
    'REGRAS',
    'GERAR'
  ];
  
  elementosObrigatorios.forEach(elemento => {
    if (!prompt.includes(elemento)) {
      validacao.problemas.push(`Elemento obrigatório ausente: ${elemento}`);
    }
  });
  
  // Verificar coerência com tipo detectado
  if (tipoDetectado?.includes('cruzeiro') && !prompt.includes('🚢')) {
    validacao.problemas.push('Prompt de cruzeiro sem emoji de navio');
  }
  
  if (tipoDetectado?.includes('multiplas') && !prompt.includes('OPÇÃO')) {
    validacao.problemas.push('Prompt de múltiplas opções sem numeração');
  }
  
  validacao.valido = validacao.problemas.length === 0;
  
  return validacao;
}

// ================================================================================
// 📊 MÉTRICAS E LOGS
// ================================================================================

function logPromptGerado(prompt, analise, estrategia) {
  const metricas = calcularTamanhoPrompt(prompt);
  
  console.log("📊 === PROMPT GERADO v7.0 ===");
  console.log(`🎯 Tipo: ${analise.tipoDetectado}`);
  console.log(`📈 Confiança: ${(analise.confiancaDeteccao * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade}`);
  console.log(`⚙️ Estratégia: ${estrategia.foco}`);
  console.log(`📏 Tamanho: ${metricas.caracteres} chars, ~${metricas.tokens_estimados} tokens`);
  console.log(`📊 Categoria: ${metricas.categoria}`);
  console.log("📊 === FIM LOG ===");
}

// ================================================================================
// 🚀 EXPORTAÇÃO E INICIALIZAÇÃO
// ================================================================================

console.log("✅ Prompts v7.0 carregado:");
console.log("🎯 9 prompts específicos por tipo de orçamento");
console.log("🧠 Contexto inteligente baseado em análise");
console.log("⚙️ Estratégias adaptativas por complexidade");
console.log("🔧 Enriquecimento automático de prompts");
console.log("📊 Sistema de validação e métricas");

// Exportar funções principais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gerarPromptOtimizado,
    selecionarPromptPorTipo,
    gerarPromptDicasDestino,
    gerarPromptRankingHoteis,
    gerarPromptAnaliseRelatorio,
    ajustarPromptParaModelo,
    validarPrompt
  };
} else {
  // Browser environment
  window.gerarPromptOtimizado = gerarPromptOtimizado;
  window.selecionarPromptPorTipo = selecionarPromptPorTipo;
  window.gerarPromptDicasDestino = gerarPromptDicasDestino;
  window.gerarPromptRankingHoteis = gerarPromptRankingHoteis;
  window.gerarPromptAnaliseRelatorio = gerarPromptAnaliseRelatorio;
  window.ajustarPromptParaModelo = ajustarPromptParaModelo;
  window.validarPrompt = validarPrompt;
}

// ================================================================================
// 🔍 PROMPTS PARA DETECÇÃO DE IMAGEM ESPECÍFICOS
// ================================================================================

function gerarPromptAnaliseImagem(tipoDetectado) {
  const basePrompt = `ANÁLISE VISUAL ESPECIALIZADA - ${tipoDetectado.toUpperCase()}

INSTRUÇÕES PARA ANÁLISE DE IMAGEM:
1. 👁️ EXAMINAR cuidadosamente TODOS os elementos visuais
2. 🔍 IDENTIFICAR layout específico (vertical, horizontal, tabular)
3. 📊 EXTRAIR dados exatos: horários, preços, datas, aeroportos
4. 🏢 DETECTAR companhias aéreas e logos
5. 🔗 LOCALIZAR e preservar links se visíveis
6. 🎯 DETERMINAR tipo exato de orçamento pela estrutura visual

FOCO ESPECÍFICO PARA ${tipoDetectado.toUpperCase()}:`;

  const promptsEspecificos = {
    'multiplasOpcoes2': `
- 🔢 BUSCAR por caixas/seções lado a lado ou verticais
- 💰 IDENTIFICAR 2 preços distintos na imagem
- 🧳 DETECTAR diferenças nos serviços de bagagem
- 📋 VERIFICAR se há "Plano 1/Plano 2" ou "Opção 1/Opção 2"`,

    'multiplasOpcoes3': `
- 🔢 BUSCAR por 3 caixas/seções distintas
- 💰 IDENTIFICAR 3 preços em ordem crescente
- ⭐ DETECTAR serviços progressivos (básico → intermediário → premium)
- 🎯 VERIFICAR se há opção com "marcação de assento" ou "2 bagagens"`,

    'cruzeiro': `
- 🚢 BUSCAR por imagens de navios ou terminologia náutica
- 🛏️ IDENTIFICAR tipos de cabine (interna, externa, varanda, suíte)
- 💰 VERIFICAR se preços são POR CABINE (valores mais altos)
- 📅 LOCALIZAR datas de embarque e duração em noites`,

    'pacoteCompleto': `
- 🏖️ BUSCAR por estrutura de "pacote" ou "inclui"
- ✈️ IDENTIFICAR seção de voos separada
- 🏨 DETECTAR múltiplas opções de hotéis
- 📍 EXTRAIR nomes e endereços de hotéis se visíveis`,

    'multitrecho': `
- 🗺️ BUSCAR por múltiplas rotas ou "Trecho 1", "Trecho 2"
- ➡️ IDENTIFICAR setas ou indicadores de direção
- 📅 VERIFICAR múltiplas datas diferentes
- 🌍 DETECTAR destinos internacionais ou roteiros complexos`,

    'aereoConexaoDetalhada': `
- 🔄 BUSCAR por informações de conexão ou escala
- ⏰ IDENTIFICAR tempo de espera entre voos
- 🏢 DETECTAR aeroporto de conexão (BSB, FOR, REC)
- ✈️ VERIFICAR se mostra cada trecho separadamente`
  };

  return basePrompt + (promptsEspecificos[tipoDetectado] || `
- 📋 APLICAR análise geral e extrair dados conforme tipo detectado
- 🎯 FOCAR na precisão e completude das informações`);
}

// ================================================================================
// 🎯 PROMPTS CONDICIONAIS AVANÇADOS
// ================================================================================

function gerarPromptCondicional(contexto, condicoes) {
  let prompt = `ORÇAMENTO CVC ITAQUA - CONTEXTO INTELIGENTE

CONDIÇÕES DETECTADAS:`;

  // Adicionar condições específicas
  Object.entries(condicoes).forEach(([condicao, ativo]) => {
    if (ativo) {
      prompt += `\n✅ ${condicao.toUpperCase()}: Aplicar regras específicas`;
    }
  });

  // Condições específicas
  if (condicoes.temCriancasComIdades) {
    prompt += `\n\nCRIANÇAS COM IDADES DETECTADAS:
- Formato obrigatório: "02 adultos + 01 criança (05 anos)"
- Múltiplas idades: "02 adultos + 02 crianças (05 e 07 anos)"
- SEMPRE incluir idades entre parênteses se fornecidas`;
  }

  if (condicoes.temConexaoCompleta) {
    prompt += `\n\nCONEXÃO DETALHADA DETECTADA:
- Mostrar CADA trecho separadamente
- Incluir tempo de espera: "(conexão em Brasília - 2h05 de espera)"
- Especificar "voo direto" para cada trecho individual`;
  }

  if (condicoes.temMultiplosPrecos) {
    prompt += `\n\nMÚLTIPLOS PREÇOS DETECTADOS:
- Organizar do menor para maior valor
- Aplicar bagagem escalonada automaticamente
- Usar numeração: "**OPÇÃO 1**", "**OPÇÃO 2**", etc.`;
  }

  if (condicoes.temParcelamentoEspecial) {
    prompt += `\n\nPARCELAMENTO SOLICITADO:
- NUNCA usar "entrada" - sempre "primeira parcela"
- Calcular automaticamente valor das parcelas
- Formato: "primeira parcela de R$ X + Yx de R$ Y s/ juros"`;
  }

  return prompt;
}

// ================================================================================
// 🧠 PROMPTS ADAPTATIVOS POR CONTEXTO
// ================================================================================

function gerarPromptAdaptativo(formData, analise, contextoEspecial) {
  console.log("🧠 Gerando prompt adaptativo...");

  let promptBase = selecionarPromptPorTipo(analise.tipoDetectado, construirContexto(formData, analise), determinarEstrategia(analise));

  // Adaptações baseadas no contexto especial
  if (contextoEspecial.baixaConfianca) {
    promptBase += `\n\n⚠️ VALIDAÇÃO EXTRA (Confiança: ${(analise.confiancaDeteccao * 100).toFixed(1)}%):
- REVISAR cuidadosamente o tipo detectado
- EM CASO DE DÚVIDA, usar formato mais simples
- PRIORIZAR clareza sobre complexidade`;
  }

  if (contextoEspecial.altaComplexidade) {
    promptBase += `\n\n🎯 ALTA COMPLEXIDADE DETECTADA:
- Aplicar MÁXIMO rigor na formatação
- Verificar TODAS as regras críticas listadas
- Organizar informações de forma hierárquica
- Priorizar legibilidade profissional`;
  }

  if (contextoEspecial.imagemCompleta) {
    promptBase += `\n\n📸 ANÁLISE DE IMAGEM COMPLETA:
${gerarPromptAnaliseImagem(analise.tipoDetectado)}`;
  }

  if (contextoEspecial.dadosIncompletos) {
    promptBase += `\n\n📋 DADOS INCOMPLETOS DETECTADOS:
- Usar apenas informações REAIS fornecidas
- NÃO inventar horários, preços ou datas
- Indicar claramente campos "A detectar" se necessário
- Focar na formatação dos dados disponíveis`;
  }

  return promptBase;
}

// ================================================================================
// 🔧 OTIMIZAÇÕES FINAIS DE PROMPT
// ================================================================================

function otimizarPromptFinal(prompt, limitesModelo) {
  console.log("🔧 Otimizando prompt para limites do modelo...");

  let promptOtimizado = prompt;

  // Verificar tamanho
  const tamanhoAtual = calcularTamanhoPrompt(prompt);
  
  if (tamanhoAtual.tokens_estimados > limitesModelo.max_tokens * 0.7) {
    console.warn("⚠️ Prompt muito longo, aplicando otimizações...");
    
    // Remover seções menos críticas
    promptOtimizado = promptOtimizado.replace(/INSTRUÇÕES FINAIS:[\s\S]*?(?=GERAR|$)/g, '');
    promptOtimizado = promptOtimizado.replace(/CAMPOS OPCIONAIS:[\s\S]*?(?=REGRAS|GERAR|$)/g, '');
    
    // Simplificar listas numeradas
    promptOtimizado = promptOtimizado.replace(/\d+\.\s*[⏰📅✈️🛫💳👥🧳👶🏷️💰📱🔧]\s*/g, '• ');
  }

  // Garantir que termina com instrução de geração
  if (!promptOtimizado.includes('GERAR')) {
    promptOtimizado += '\n\nGERAR ORÇAMENTO PROFISSIONAL FORMATADO:';
  }

  // Log da otimização
  const tamanhoFinal = calcularTamanhoPrompt(promptOtimizado);
  console.log(`🔧 Otimização: ${tamanhoAtual.tokens_estimados} → ${tamanhoFinal.tokens_estimados} tokens`);

  return promptOtimizado;
}

// ================================================================================
// 📊 SISTEMA DE CACHE DE PROMPTS
// ================================================================================

const CACHE_PROMPTS = new Map();

function obterPromptCacheado(chaveCache, gerador) {
  if (CACHE_PROMPTS.has(chaveCache)) {
    console.log(`📊 Prompt recuperado do cache: ${chaveCache}`);
    return CACHE_PROMPTS.get(chaveCache);
  }

  const prompt = gerador();
  CACHE_PROMPTS.set(chaveCache, prompt);
  
  // Limitar tamanho do cache
  if (CACHE_PROMPTS.size > 50) {
    const primeiraChave = CACHE_PROMPTS.keys().next().value;
    CACHE_PROMPTS.delete(primeiraChave);
  }

  console.log(`📊 Prompt gerado e cacheado: ${chaveCache}`);
  return prompt;
}

function gerarChaveCache(tipoDetectado, complexidade, temImagem, temParcelamento) {
  return `${tipoDetectado}_${complexidade}_${temImagem ? 'img' : 'txt'}_${temParcelamento ? 'parc' : 'noparc'}`;
}

// ================================================================================
// 🎯 INTERFACE UNIFICADA DE PROMPTS
// ================================================================================

function criarPromptCompleto(formData, analise, opcoes = {}) {
  console.log("🎯 Criando prompt completo unificado...");

  const chaveCache = gerarChaveCache(
    analise.tipoDetectado,
    analise.complexidade,
    !!formData.imagemBase64,
    !!formData.parcelamento?.incluirParcelamento
  );

  return obterPromptCacheado(chaveCache, () => {
    // Contexto especial
    const contextoEspecial = {
      baixaConfianca: analise.confiancaDeteccao < 0.7,
      altaComplexidade: analise.complexidade === 'muito_alta',
      imagemCompleta: !!formData.imagemBase64,
      dadosIncompletos: !formData.observacoes && !formData.textoColado
    };

    // Gerar prompt adaptativo
    let prompt = gerarPromptAdaptativo(formData, analise, contextoEspecial);

    // Aplicar enriquecimentos
    prompt = enriquecerPrompt(prompt, formData, analise);

    // Otimizar para modelo
    const limitesModelo = {
      max_tokens: opcoes.maxTokens || 4000,
      modelo: opcoes.modelo || 'gpt-4o-mini'
    };
    
    prompt = otimizarPromptFinal(prompt, limitesModelo);

    // Ajustar para modelo específico
    if (opcoes.modelo) {
      prompt = ajustarPromptParaModelo(prompt, opcoes.modelo);
    }

    return prompt;
  });
}

// ================================================================================
// 🚀 FUNÇÃO PRINCIPAL ATUALIZADA
// ================================================================================

// Atualizar a função principal para usar a interface unificada
function gerarPromptOtimizadoCompleto(formData, analise, opcoes = {}) {
  console.log("🚀 Gerando prompt otimizado completo v7.0...");
  
  try {
    // Usar interface unificada
    const prompt = criarPromptCompleto(formData, analise, opcoes);
    
    // Validar prompt final
    const validacao = validarPrompt(prompt, analise.tipoDetectado);
    
    if (!validacao.valido) {
      console.warn("⚠️ Prompt com problemas:", validacao.problemas);
      
      // Aplicar correções automáticas se possível
      if (validacao.sugestoes.length > 0) {
        console.log("🔧 Aplicando correções sugeridas...");
        // Implementar correções básicas aqui se necessário
      }
    }

    // Log final
    logPromptGerado(prompt, analise, determinarEstrategia(analise));
    
    return prompt;
    
  } catch (error) {
    console.error("❌ Erro na geração do prompt completo:", error);
    return gerarPromptFallback(formData);
  }
}

// ================================================================================
// 🚀 EXPORTAÇÃO FINAL ATUALIZADA
// ================================================================================

console.log("✅ Prompts v7.0 COMPLETO carregado:");
console.log("🎯 9 prompts específicos por tipo de orçamento");
console.log("🧠 Contexto inteligente baseado em análise");
console.log("⚙️ Estratégias adaptativas por complexidade");
console.log("🔧 Enriquecimento automático de prompts");
console.log("📊 Sistema de cache e otimização");
console.log("🔍 Prompts especializados para análise de imagem");
console.log("📊 Sistema de validação e métricas completo");
console.log("🎯 Interface unificada de geração");

// Exportar funções principais (VERSÃO ATUALIZADA)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Função principal (nova)
    gerarPromptOtimizado: gerarPromptOtimizadoCompleto,
    
    // Funções específicas
    selecionarPromptPorTipo,
    gerarPromptDicasDestino,
    gerarPromptRankingHoteis,
    gerarPromptAnaliseRelatorio,
    
    // Funções avançadas (novas)
    criarPromptCompleto,
    gerarPromptAdaptativo,
    gerarPromptAnaliseImagem,
    
    // Utilitários
    ajustarPromptParaModelo,
    validarPrompt,
    otimizarPromptFinal
  };
} else {
  // Browser environment (VERSÃO ATUALIZADA)
  window.gerarPromptOtimizado = gerarPromptOtimizadoCompleto;
  window.selecionarPromptPorTipo = selecionarPromptPorTipo;
  window.gerarPromptDicasDestino = gerarPromptDicasDestino;
  window.gerarPromptRankingHoteis = gerarPromptRankingHoteis;
  window.gerarPromptAnaliseRelatorio = gerarPromptAnaliseRelatorio;
  window.criarPromptCompleto = criarPromptCompleto;
  window.gerarPromptAdaptativo = gerarPromptAdaptativo;
  window.ajustarPromptParaModelo = ajustarPromptParaModelo;
  window.validarPrompt = validarPrompt;
}

console.log("🚀 Sistema de Prompts v7.0 - VERSÃO COMPLETA E OTIMIZADA!");// 🎯 prompts.js - SISTEMA AVANÇADO DE PROMPTS v7.0
// Prompts específicos para cada tipo de orçamento + Contexto inteligente
// Integração completa com análise e templates

console.log("🎯 Prompts v7.0 - SISTEMA ESPECIALIZADO CARREGADO");

// ================================================================================
// 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v7.0...");
  
  try {
    // Determinar contexto e estratégia
    const contexto = construirContexto(formData, analise);
    const estrategia = determinarEstrategia(analise);
    
    // Selecionar prompt específico baseado no tipo detectado
    const promptEspecifico = selecionarPromptPorTipo(analise.tipoDetectado, contexto, estrategia);
    
    // Adicionar configurações avançadas
    const promptFinal = enriquecerPrompt(promptEspecifico, formData, analise);
    
    console.log(`✅ Prompt otimizado gerado: ${promptFinal.length} caracteres`);
    console.log(`🎯 Tipo: ${analise.tipoDetectado}, Complexidade: ${analise.complexidade}`);
    
    return promptFinal;
    
  } catch (error) {
    console.error("❌ Erro na geração do prompt:", error);
    return gerarPromptFallback(formData);
  }
}

// ================================================================================
// 🏗️ CONSTRUÇÃO DE CONTEXTO INTELIGENTE
// ================================================================================

function construirContexto(formData, analise) {
  console.log("🏗️ Construindo contexto inteligente...");
  
  return {
    // Dados básicos
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    
    // Dados extraídos da análise
    tipoDetectado: analise.tipoDetectado,
    confianca: analise.confiancaDeteccao,
    complexidade: analise.complexidade,
    numeroOpcoes: analise.numeroOpcoes || 1,
    
    // Contexto específico
    aeroportos: analise.aeroportosDetectados?.join(", ") || "A detectar",
    companhias: analise.companhiasDetectadas?.join(", ") || "A detectar",
    precos: analise.numeroPrecos