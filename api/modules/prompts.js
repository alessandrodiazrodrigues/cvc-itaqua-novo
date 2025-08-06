// 🎯 prompts.js - SISTEMA AVANÇADO DE PROMPTS v8.1
// Prompts específicos para cada tipo de orçamento + Contexto inteligente
// ✅ EXPORTAÇÃO ES6 CORRIGIDA - SEM SISTEMA HÍBRIDO
// Integração completa com análise e templates

console.log("🎯 Prompts v8.1 - ES6 EXPORTS CORRIGIDA");

// ================================================================================
// 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

export function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v8.1...");
  
  try {
    // Determinar contexto e estratégia
    const contexto = construirContexto(formData, analise);
    const estrategia = determinarEstrategia(analise);
    
    // Selecionar prompt específico baseado no tipo detectado
    const promptEspecifico = selecionarPromptPorTipo(analise.tipoDetectado, contexto, estrategia);
    
    // Adicionar configurações avançadas
    const promptFinal = enriquecerPrompt(promptEspecifico, formData, analise);
    
    // Otimizar para modelo específico
    const promptOtimizado = otimizarPromptFinal(promptFinal, { max_tokens: 4096 });
    
    // Log de métricas
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
// 🏗️ CONSTRUÇÃO DE CONTEXTO INTELIGENTE
// ================================================================================

function construirContexto(formData, analise) {
  console.log("🏗️ Construindo contexto inteligente...");
  
  return {
    // Dados básicos
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    destino: formData.destino || "",
    
    // Dados extraídos da análise
    tipoDetectado: analise.tipoDetectado || analise.tipo_principal,
    confianca: analise.confiancaDeteccao || analise.confianca_deteccao || 0,
    complexidade: analise.complexidade,
    numeroOpcoes: analise.numeroOpcoes || 1,
    
    // Contexto específico
    aeroportos: analise.aeroportosDetectados?.join(", ") || "A detectar",
    companhias: analise.companhiasDetectadas?.join(", ") || "A detectar",
    precos: analise.numeroPrecos || 0,
    datas: analise.numeroDatas || 0,
    
    // Configurações especiais
    temImagem: !!formData.imagemBase64,
    isImagem: !!formData.imagemBase64,
    parcelamento: {
      incluirParcelamento: !!formData.parcelamento?.incluirParcelamento,
      parcelas10x: !!formData.parcelamento?.parcelas10x,
      parcelas12x: !!formData.parcelamento?.parcelas12x
    },
    
    // Passageiros
    adultos: formData.adultos || 1,
    criancas: formData.criancas || 0,
    idadesCriancas: formData.idadesCriancas || []
  };
}

// ================================================================================
// ⚙️ DETERMINAÇÃO DE ESTRATÉGIA
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
// 🎯 SELEÇÃO DE PROMPT POR TIPO
// ================================================================================

export function selecionarPromptPorTipo(tipoDetectado, contexto, estrategia) {
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
    cruzeiro: promptCruzeiro
  };
  
  const promptFunction = prompts[tipoDetectado] || prompts.aereo_nacional_simples;
  return promptFunction(contexto, estrategia);
}

// ================================================================================
// ✈️ PROMPTS ESPECÍFICOS POR TIPO (TODOS OS 9 DO MANUAL)
// ================================================================================

function promptAereoNacionalSimples(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL SIMPLES v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Aéreo Nacional Ida e Volta Simples
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATAÇÃO OBRIGATÓRIA - AÉREO NACIONAL SIMPLES:

*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO_AEROPORTO] [HH:MM] / [ORIGEM_AEROPORTO] [HH:MM] ([TIPO_VOO])

💰 [VALOR] para [PASSAGEIROS]
${contexto.parcelamento.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável
${contexto.isImagem ? '🔗 [LINK se detectado na imagem]' : ''}

REGRAS CRÍTICAS:
1. ⏰ HORÁRIOS: "06:20" (NUNCA "06: 20")
2. ✈️ AEROPORTOS: CGH → Congonhas, GRU → Guarulhos
3. 🛫 TIPO VOO: "voo direto" ou "com conexão" (NUNCA "escala")
4. 👥 PASSAGEIROS: "02 adultos" (zero à esquerda)
5. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão nacional)
6. 💰 VALORES: "R$ 1.464,02" (espaço após R$)

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

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

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
${contexto.isImagem ? '🔗 [LINK se detectado]' : ''}

REGRAS ESPECIAIS CONEXÃO:
- Mostrar CADA trecho separadamente
- Incluir tempo de espera específico
- Conexões comuns: Brasília, Recife, Fortaleza

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

GERAR ORÇAMENTO SOMENTE IDA:`;
}

function promptMultiplasOpcoes2(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (2 PLANOS) v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 2 Planos
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR ORÇAMENTO COM 2 OPÇÕES:`;
}

function promptMultiplasOpcoes3(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES (3 PLANOS) v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Múltiplas Opções - 3 Planos
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR ORÇAMENTO COM 3 OPÇÕES:`;
}

function promptMultitrecho(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MULTITRECHO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Multitrecho (múltiplos destinos)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR ORÇAMENTO MULTITRECHO:`;
}

function promptMultiplasCompanhiasInternacionais(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS COMPANHIAS INTERNACIONAIS v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Internacional com Múltiplas Companhias
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR ORÇAMENTO MÚLTIPLAS COMPANHIAS:`;
}

function promptPacoteCompleto(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - PACOTE COMPLETO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Pacote Completo (Aéreo + Hotel)
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR PACOTE COMPLETO:`;
}

function promptCruzeiro(contexto, estrategia) {
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO v8.1

ANÁLISE INTELIGENTE DETECTOU:
- Tipo: Cruzeiro Marítimo
- Confiança: ${(contexto.confianca * 100).toFixed(0)}%
- Complexidade: ${contexto.complexidade}

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

GERAR ORÇAMENTO DE CRUZEIRO:`;
}

// ================================================================================
// 🔧 ENRIQUECIMENTO DE PROMPTS
// ================================================================================

function enriquecerPrompt(promptBase, formData, analise) {
  console.log("🔧 Enriquecendo prompt com contexto avançado...");
  
  let promptEnriquecido = promptBase;
  
  // Adicionar informações de contexto especial
  const contextoEspecial = {
    baixaConfianca: analise.confiancaDeteccao < 0.7,
    altaComplexidade: analise.complexidade === 'muito_alta',
    imagemCompleta: !!formData.imagemBase64,
    dadosIncompletos: (!formData.observacoes || formData.observacoes.length < 50) && 
                     (!formData.textoColado || formData.textoColado.length < 50)
  };
  
  // Adaptações baseadas no contexto especial
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
// 🔧 OTIMIZAÇÃO DE PROMPTS
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
// 📊 GERAÇÃO DE PROMPTS ESPECIALIZADOS
// ================================================================================

export function gerarPromptDicasDestino(destino) {
  return `DICAS DE VIAGEM CVC ITAQUA - ${destino.toUpperCase()}

GERAR 5 DICAS PRÁTICAS para viagem a ${destino}:

🎯 *DICAS ESSENCIAIS - ${destino}*

1. 📍 **Quando ir:** [melhor época/clima]
2. 💰 **Orçamento:** [gastos médios por dia]
3. 🎭 **Principais atrações:** [top 3 pontos turísticos]
4. 🍽️ **Gastronomia:** [pratos típicos imperdíveis]
5. 🚌 **Transporte:** [como se locomover]

💡 **Dica extra:** [informação especial ou curiosidade]

📲 Me chama para fechar seu pacote para ${destino}! ✈️

GERAR DICAS PROFISSIONAIS:`;
}

export function gerarPromptRankingHoteis(destino) {
  return `RANKING DE HOTÉIS CVC ITAQUA - ${destino.toUpperCase()}

GERAR RANKING com 5 melhores hotéis em ${destino}:

🏨 *RANKING DE HOTÉIS - ${destino}*

🏆 1. **[NOME_HOTEL_1]** - ⭐⭐⭐⭐⭐
📍 [Localização/bairro]
💰 R$ [faixa_preco] por diária
⭐ [principal diferencial]

🏆 2. **[NOME_HOTEL_2]** - ⭐⭐⭐⭐
📍 [Localização/bairro]
💰 R$ [faixa_preco] por diária
⭐ [principal diferencial]

🏆 3. **[NOME_HOTEL_3]** - ⭐⭐⭐⭐
📍 [Localização/bairro]
💰 R$ [faixa_preco] por diária
⭐ [principal diferencial]

🏆 4. **[NOME_HOTEL_4]** - ⭐⭐⭐
📍 [Localização/bairro]
💰 R$ [faixa_preco] por diária
⭐ [principal diferencial]

🏆 5. **[NOME_HOTEL_5]** - ⭐⭐⭐
📍 [Localização/bairro]
💰 R$ [faixa_preco] por diária
⭐ [principal diferencial]

💡 **Nossa recomendação:** [hotel com melhor custo-benefício]

📲 Me chama para reservar qualquer um desses hotéis! 🏨

GERAR RANKING PROFISSIONAL:`;
}

export function gerarPromptAnaliseRelatorio(dados) {
  return `ANÁLISE DE RELATÓRIO CVC ITAQUA

DADOS PARA ANÁLISE:
${JSON.stringify(dados, null, 2)}

GERAR RELATÓRIO EXECUTIVO com:

📊 *RELATÓRIO DE PERFORMANCE*

**📈 Principais Métricas:**
- [métrica_1]: [valor] ([variação]%)
- [métrica_2]: [valor] ([variação]%)
- [métrica_3]: [valor] ([variação]%)

**🎯 Destaques do Período:**
1. [destaque_positivo_1]
2. [destaque_positivo_2]
3. [destaque_positivo_3]

**⚠️ Pontos de Atenção:**
- [ponto_atencao_1]
- [ponto_atencao_2]

**💡 Recomendações:**
- [recomendacao_1]
- [recomendacao_2]

GERAR ANÁLISE PROFISSIONAL:`;
}

// ================================================================================
// 🔧 UTILITÁRIOS E VALIDAÇÃO
// ================================================================================

export function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt para modelo: ${modelo}`);
  
  let promptAjustado = prompt;
  
  const limitesModelo = {
    'gpt-4o': { max_tokens: 8192, contexto_forte: true },
    'gpt-4o-mini': { max_tokens: 4096, contexto_medio: true },
    'claude-3-haiku': { max_tokens: 2048, contexto_basico: true }
  };
  
  const limite = limitesModelo[modelo] || limitesModelo['gpt-4o-mini'];
  
  // Ajustar complexidade baseado no modelo
  if (modelo === 'gpt-4o-mini') {
    // Simplificar para modelo menor
    promptAjustado = promptAjustado.replace(/REGRAS CRÍTICAS:[\s\S]*?(?=GERAR)/g, 
      'REGRAS BÁSICAS: Seguir formatação padrão CVC.\n\n');
  }
  
  // Verificar e otimizar tamanho
  const tamanho = calcularTamanhoPrompt(promptAjustado);
  if (tamanho.tokens_estimados > limite.max_tokens * 0.8) {
    promptAjustado = otimizarPromptFinal(promptAjustado, limite);
  }
  
  return promptAjustado;
}

export function validarPrompt(prompt, tipoDetectado) {
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
// 📊 FUNÇÕES DE APOIO E MÉTRICAS
// ================================================================================

function calcularTamanhoPrompt(prompt) {
  const caracteres = prompt.length;
  const palavras = prompt.split(/\s+/).length;
  const linhas = prompt.split('\n').length;
  
  // Estimativa grosseira de tokens (1 token ≈ 4 caracteres em português)
  const tokens_estimados = Math.ceil(caracteres / 4);
  
  return {
    caracteres,
    palavras,
    linhas,
    tokens_estimados,
    categoria: tokens_estimados < 500 ? 'pequeno' : 
               tokens_estimados < 2000 ? 'médio' : 'grande'
  };
}

function gerarPromptFallback(formData) {
  return `ORÇAMENTO CVC ITAQUA - FALLBACK v8.1

Baseado nos dados fornecidos:
${JSON.stringify(formData, null, 2)}

INSTRUÇÕES BÁSICAS:
- Gerar orçamento profissional
- Seguir formatação padrão CVC
- Usar dados reais fornecidos
- Aplicar regras básicas de formatação

GERAR ORÇAMENTO PADRÃO:`;
}

function logPromptGerado(prompt, analise, estrategia) {
  const metricas = calcularTamanhoPrompt(prompt);
  
  console.log("📊 === PROMPT GERADO v8.1 ===");
  console.log(`🎯 Tipo: ${analise.tipoDetectado || analise.tipo_principal}`);
  console.log(`📈 Confiança: ${((analise.confiancaDeteccao || analise.confianca_deteccao || 0) * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade}`);
  console.log(`⚙️ Estratégia: ${estrategia.foco}`);
  console.log(`📏 Tamanho: ${metricas.caracteres} chars, ~${metricas.tokens_estimados} tokens`);
  console.log(`📊 Categoria: ${metricas.categoria}`);
  console.log("📊 === FIM LOG ===");
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 PURA - SEM SISTEMA HÍBRIDO
// ================================================================================

console.log("✅ Prompts v8.1 carregado:");
console.log("🎯 9 prompts específicos para TODOS os tipos do Manual CVC");
console.log("🧠 Contexto inteligente baseado em análise");
console.log("⚙️ Estratégias adaptativas por complexidade");
console.log("🔧 Enriquecimento automático de prompts");
console.log("📊 Sistema de validação e métricas");
console.log("🚨 EXPORTAÇÃO ES6 PURA - SISTEMA HÍBRIDO REMOVIDO");

// EXPORTAÇÃO ES6 ÚNICA E LIMPA
export {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

// EXPORTAÇÃO DEFAULT PARA MÁXIMA COMPATIBILIDADE
export default {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

console.log("🚀 Sistema de Prompts v8.1 - GERAÇÃO INTELIGENTE ES6 FUNCIONAL!");
