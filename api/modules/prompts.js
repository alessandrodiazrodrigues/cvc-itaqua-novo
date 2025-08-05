// 🎯 prompts.js - SISTEMA AVANÇADO DE PROMPTS v7.7
// CORREÇÃO CRÍTICA #2: Exportação ES6 + Prompts Especializados
// Prompts específicos para cada tipo de orçamento + Contexto inteligente

console.log("🎯 Prompts v7.7 - SISTEMA ESPECIALIZADO + ES6 CORRIGIDA");

// ================================================================================
// 🎯 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

export function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v7.7...");
  
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
    precos: analise.numeroPrecos || 0,
    
    // Flags de contexto
    temImagem: !!formData.imagemBase64,
    temLinks: analise.contexto?.links?.length > 0,
    temParcelamento: !!formData.parcelamento,
    
    // Dados do usuário
    destino: formData.destino || "Destino a definir",
    adultos: formData.adultos || 2,
    criancas: formData.criancas || 0
  };
}

function determinarEstrategia(analise) {
  const estrategias = {
    alta: {
      foco: 'detalhamento',
      abordagem: 'análise_profunda',
      prioridade: 'precisao_maxima'
    },
    media: {
      foco: 'balanceamento',
      abordagem: 'estruturada',
      prioridade: 'eficiencia'
    },
    simples: {
      foco: 'clareza',
      abordagem: 'direta',
      prioridade: 'rapidez'
    }
  };
  
  return estrategias[analise.complexidade] || estrategias.simples;
}

// ================================================================================
// 🎯 SELETOR DE PROMPTS POR TIPO
// ================================================================================

export function selecionarPromptPorTipo(tipoDetectado, contexto, estrategia) {
  console.log(`🎯 Selecionando prompt para tipo: ${tipoDetectado}`);
  
  const prompts = {
    aereoNacionalSimples: () => gerarPromptAereoNacionalSimples(contexto),
    aereoConexaoDetalhada: () => gerarPromptAereoConexaoDetalhada(contexto),
    aereoSomenteIda: () => gerarPromptAereoSomenteIda(contexto),
    multiplasOpcoes2: () => gerarPromptMultiplasOpcoes2(contexto),
    multiplasOpcoes3: () => gerarPromptMultiplasOpcoes3(contexto),
    multitrecho: () => gerarPromptMultitrecho(contexto),
    multiplasCompanhiasInternacionais: () => gerarPromptMultiplasCompanhias(contexto),
    pacoteCompleto: () => gerarPromptPacoteCompleto(contexto),
    cruzeiro: () => gerarPromptCruzeiro(contexto)
  };
  
  const gerador = prompts[tipoDetectado] || prompts.aereoNacionalSimples;
  return gerador();
}

// ================================================================================
// 📋 PROMPTS ESPECÍFICOS POR TIPO
// ================================================================================

function gerarPromptAereoNacionalSimples(contexto) {
  return `ORÇAMENTO AÉREO NACIONAL SIMPLES - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Aéreo Nacional Ida e Volta Simples
- Destino: ${contexto.destino}
- Passageiros: ${contexto.adultos} adulto(s)${contexto.criancas > 0 ? ` + ${contexto.criancas} criança(s)` : ''}
- Complexidade: ${contexto.complexidade}

FORMATAÇÃO OBRIGATÓRIA:
1. ⏰ HORÁRIOS: Formato "06:20" (nunca "06: 20")
2. 📅 DATAS: Formato "15/11" (DD/MM)
3. ✈️ AEROPORTOS: Converter códigos (CGH → Congonhas, GRU → Guarulhos)
4. 💰 PREÇOS: Formato "R$ 1.247,80" (espaço após R$)
5. 👥 PASSAGEIROS: "02 adultos" (zero à esquerda)
6. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão nacional)
7. 🏷️ REEMBOLSO: "Não reembolsável" ou "Reembolsável conforme regras do bilhete"

TEMPLATE OBRIGATÓRIO:
*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DATA_IDA] - [ORIGEM] [HORA_IDA] / [DESTINO] [HORA_CHEGADA] ([TIPO_VOO])
--
[DATA_VOLTA] - [DESTINO] [HORA_VOLTA] / [ORIGEM] [HORA_CHEGADA_VOLTA] ([TIPO_VOO])

💰 [VALOR_TOTAL] para [PASSAGEIROS]
✅ Só mala de mão incluída
🏷️ Não reembolsável

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR ORÇAMENTO PROFISSIONAL:`;
}

function logPromptGerado(prompt, analise, estrategia) {
  const metricas = calcularTamanhoPrompt(prompt);
  
  console.log("📊 === PROMPT GERADO v7.7 ===");
  console.log(`🎯 Tipo: ${analise.tipoDetectado}`);
  console.log(`📈 Confiança: ${(analise.confiancaDeteccao * 100).toFixed(1)}%`);
  console.log(`🧮 Complexidade: ${analise.complexidade}`);
  console.log(`⚙️ Estratégia: ${estrategia.foco}`);
  console.log(`📏 Tamanho: ${metricas.caracteres} chars, ~${metricas.tokens_estimados} tokens`);
  console.log(`📊 Categoria: ${metricas.categoria}`);
  console.log("📊 === FIM LOG ===");
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
      altaComplexidade: analise.complexidade === 'alta',
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

function gerarPromptAdaptativo(formData, analise, contextoEspecial) {
  console.log("🎯 Gerando prompt adaptativo...");
  
  // Construir contexto
  const contexto = construirContexto(formData, analise);
  const estrategia = determinarEstrategia(analise);
  
  // Selecionar prompt base
  let promptBase = selecionarPromptPorTipo(analise.tipoDetectado, contexto, estrategia);
  
  // Adaptações especiais
  if (contextoEspecial.baixaConfianca) {
    promptBase += '\n\n⚠️ ANÁLISE ADICIONAL: Detectar padrões não óbvios e adaptar template conforme necessário.';
  }
  
  if (contextoEspecial.altaComplexidade) {
    promptBase += '\n\n🔍 ANÁLISE DETALHADA: Preservar TODOS os detalhes específicos fornecidos.';
  }
  
  if (contextoEspecial.imagemCompleta) {
    promptBase += '\n\n📸 ANÁLISE VISUAL: Extrair dados exatos da imagem anexada.';
  }
  
  return promptBase;
}

function otimizarPromptFinal(prompt, limites) {
  console.log("🔧 Otimizando prompt final...");
  
  const tamanhoAtual = calcularTamanhoPrompt(prompt);
  let promptOtimizado = prompt;
  
  // Se exceder limites, aplicar otimizações
  if (tamanhoAtual.tokens_estimados > limites.max_tokens * 0.8) {
    console.log("⚡ Aplicando otimizações de tamanho...");
    
    // Remover seções menos críticas
    promptOtimizado = promptOtimizado.replace(/CONTEXTO DETECTADO:[\s\S]*?(?=FORMATAÇÃO|REGRAS|TEMPLATE)/g, '');
    promptOtimizado = promptOtimizado.replace(/DADOS FORNECIDOS:[\s\S]*?(?=GERAR|$)/g, '');
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
// 🚀 FUNÇÃO PRINCIPAL ATUALIZADA
// ================================================================================

function gerarPromptOtimizadoCompleto(formData, analise, opcoes = {}) {
  console.log("🚀 Gerando prompt otimizado completo v7.7...");
  
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
// 🚀 EXPORTAÇÃO ES6 (CORREÇÃO CRÍTICA #2)
// ================================================================================

// Log de inicialização
console.log("✅ Prompts v7.7 carregado:");
console.log("🎯 9 prompts específicos por tipo de orçamento");
console.log("🧠 Contexto inteligente baseado em análise");
console.log("⚙️ Estratégias adaptativas por complexidade");
console.log("🔧 Enriquecimento automático de prompts");
console.log("📊 Sistema de cache e otimização");
console.log("🔍 Prompts especializados para análise de imagem");
console.log("📊 Sistema de validação e métricas completo");
console.log("🚨 EXPORTAÇÃO ES6 CORRIGIDA - Compatível com import()");

// Exportação individual das funções principais
export {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

// Exportação padrão para máxima compatibilidade
export default {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

console.log("🚀 Sistema de Prompts v7.7 - ESPECIALIZADO COMPLETO!");ISSIONAL:`;
}

function gerarPromptAereoConexaoDetalhada(contexto) {
  return `ORÇAMENTO AÉREO COM CONEXÃO DETALHADA - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Aéreo com Conexão Detalhada
- Aeroportos detectados: ${contexto.aeroportos}
- Companhias detectadas: ${contexto.companhias}

FORMATAÇÃO ESPECÍFICA PARA CONEXÕES:
1. 🔄 MOSTRAR cada trecho separadamente
2. ⏱️ INCLUIR tempo de espera na conexão
3. 🛂 ESPECIFICAR aeroporto de conexão
4. 📍 FORMATO: "conexão em [CIDADE] - [TEMPO] de espera"

TEMPLATE OBRIGATÓRIO:
*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DATA] - [ORIGEM] [HORA] / [AEROPORTO_CONEXAO] [HORA_CONEXAO] (voo direto)
(conexão em [AEROPORTO_CONEXAO] - [TEMPO_ESPERA] de espera)
[DATA] - [AEROPORTO_CONEXAO] [HORA2] / [DESTINO] [HORA_CHEGADA] (voo direto)
--
[DATA_VOLTA] - [DESTINO] [HORA_VOLTA] / [ORIGEM] [HORA_CHEGADA_VOLTA] ([TIPO_VOO])

💰 [VALOR] para [PASSAGEIROS]
💳 [PARCELAMENTO]
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 [LINK]

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR ORÇAMENTO COM CONEXÃO DETALHADA:`;
}

function gerarPromptMultiplasOpcoes2(contexto) {
  return `ORÇAMENTO MÚLTIPLAS OPÇÕES - 2 PLANOS - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Múltiplas Opções (2 planos)
- Número de preços detectados: ${contexto.precos}
- Estratégia: Escalonamento de serviços

REGRAS ESPECÍFICAS PARA 2 OPÇÕES:
1. 📦 OPÇÃO 1: Básica - "Só mala de mão incluída"
2. 📦 OPÇÃO 2: Completa - "Mala de mão + bagagem despachada"
3. ✅ OPÇÃO 2: Adicionar "Cancelamento/alteração com multas"
4. 🏷️ OPÇÃO 2: "Reembolsável conforme regras do bilhete"

TEMPLATE OBRIGATÓRIO:
*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[VOOS_DETALHADOS]

💰 **OPÇÃO 1** - [VALOR_1]
✅ Só mala de mão incluída
💳 [PARCELAMENTO_1]
🔗 [LINK_1]

💰 **OPÇÃO 2** - [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
💳 [PARCELAMENTO_2]
🔗 [LINK_2]

Valores sujeitos a confirmação e disponibilidade

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR ORÇAMENTO COM 2 OPÇÕES ESCALONADAS:`;
}

function gerarPromptMultiplasOpcoes3(contexto) {
  return `ORÇAMENTO MÚLTIPLAS OPÇÕES - 3 PLANOS - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Múltiplas Opções (3 planos)
- Escalonamento: Básico → Intermediário → Premium

REGRAS ESPECÍFICAS PARA 3 OPÇÕES:
1. 📦 OPÇÃO 1: "Só mala de mão incluída"
2. 📦 OPÇÃO 2: "Mala de mão + bagagem despachada" + "Cancelamento/alteração com multas"
3. 📦 OPÇÃO 3: "Mala de mão + 2 bagagens despachadas" + "Reembolsável" + "Marcação de assento"

TEMPLATE OBRIGATÓRIO:
*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[VOOS_DETALHADOS]

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

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR ORÇAMENTO COM 3 OPÇÕES ESCALONADAS:`;
}

function gerarPromptMultitrecho(contexto) {
  return `ORÇAMENTO MULTITRECHO - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Multitrecho (roteiro complexo)
- Aeroportos: ${contexto.aeroportos}
- Companhias: ${contexto.companhias}

FORMATAÇÃO ESPECÍFICA MULTITRECHO:
1. 🗺️ FORMATO: "*Trecho 1:* Origem → Destino"
2. 📅 INCLUIR duração total: "[X] dias e [Y] noites"
3. 💳 PARCELAMENTO: "até 10x sem juros" (padrão multitrecho)
4. ✈️ MÚLTIPLAS companhias permitidas

TEMPLATE OBRIGATÓRIO:
*Multitrecho - [COMPANHIAS]*
[DATA_IDA] a [DATA_VOLTA] ([DIAS] dias e [NOITES] noites)

*Trecho 1:* [ORIGEM] → [DESTINO_1]
[DATA_T1] - [ORIGEM] [HORA_T1] / [DESTINO_1] [HORA_C1] ([TIPO_VOO_1])

*Trecho 2:* [DESTINO_1] → [DESTINO_2]
[DATA_T2] - [DESTINO_1] [HORA_T2] / [DESTINO_2] [HORA_C2] ([TIPO_VOO_2])

*Trecho 3:* [DESTINO_2] → [ORIGEM]
[DATA_T3] - [DESTINO_2] [HORA_T3] / [ORIGEM] [HORA_C3] ([TIPO_VOO_3])

💰 [VALOR_TOTAL] para [PASSAGEIROS]
💳 Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de [PRIMEIRA] + 9x de [DEMAIS] s/ juros
✅ Só mala de mão incluída
🏷️ Não reembolsável
🔗 [LINK]

Valores sujeitos a confirmação e disponibilidade

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR MULTITRECHO DETALHADO:`;
}

function gerarPromptPacoteCompleto(contexto) {
  return `PACOTE COMPLETO (AÉREO + HOTEL) - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Pacote Completo
- Destino: ${contexto.destino}
- Inclui: Aéreo + Hotel + Serviços

FORMATAÇÃO ESPECÍFICA PACOTES:
1. 📋 LISTA "O Pacote Inclui:" obrigatória
2. ✈️ SEÇÃO voos separada: "*Voos [COMPANHIA]:*"
3. 🏨 MÚLTIPLAS opções de hotel com endereços
4. 🚐 TRASLADO: "Aeroporto / Hotel / Aeroporto"

TEMPLATE OBRIGATÓRIO:
*Pacote [DESTINO]*
Embarque: [DATA_EMBARQUE]
Pacote para [PASSAGEIROS]

*O Pacote Inclui:*
- Passagem Aérea ida e volta para [DESTINO]
- Taxas de Embarque
- Traslado [TIPO_TRASLADO]
[PASSEIOS_SE_HOUVER]
[SEGURO_SE_HOUVER]
- [NOITES] noites de hospedagem no hotel escolhido

✈️ *Voos [COMPANHIA]:*
[VOOS_DETALHADOS]

**OPÇÃO 1** - [HOTEL_1]
[ENDERECO_1_SE_HOUVER]
🛏️ [QUARTO_1] com [REGIME_1]
💰 [VALOR_1] para [PASSAGEIROS]
🔗 [LINK_1]

**OPÇÃO 2** - [HOTEL_2] [CATEGORIA_SE_HOUVER]
[ENDERECO_2_SE_HOUVER]
🛏️ [QUARTO_2] com [REGIME_2]
[REEMBOLSAVEL_SE_APLICAVEL]
💰 [VALOR_2] para [PASSAGEIROS]
🔗 [LINK_2]

Valores sujeitos a confirmação e disponibilidade

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR PACOTE COMPLETO:`;
}

function gerarPromptCruzeiro(contexto) {
  return `CRUZEIRO PROFISSIONAL - CVC ITAQUAQUECETUBA

CONTEXTO DETECTADO:
- Tipo: Cruzeiro
- Companhias detectadas: ${contexto.companhias}

FORMATAÇÃO ESPECÍFICA CRUZEIROS:
1. 🚢 TÍTULO: "🚢 *Cruzeiro [NAVIO]* – [X] noites"
2. 📅 EMBARQUE: Incluir dia da semana
3. 📍 PORTO: "Saída e chegada: [PORTO]"
4. 🛏️ CABINES: Tipos disponíveis

TEMPLATE OBRIGATÓRIO:
🚢 *Cruzeiro [NAVIO]* – [DURACAO] noites
[PASSAGEIROS]
📅 Embarque: [DATA_EMBARQUE] ([DIA_SEMANA])
📍 Saída e chegada: [PORTO]
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
[OPCOES_CABINES]

📎 Link para ver fotos, detalhes e reservar:
[LINK]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️

DADOS FORNECIDOS:
${contexto.observacoes}
${contexto.textoColado}

GERAR CRUZEIRO PROFISSIONAL:`;
}

// ================================================================================
// 🔧 ENRIQUECIMENTO DE PROMPTS
// ================================================================================

function enriquecerPrompt(promptBase, formData, analise) {
  console.log("🔧 Enriquecendo prompt com contexto adicional...");
  
  let promptEnriquecido = promptBase;
  
  // Adicionar contexto de confiança se baixa
  if (analise.confiancaDeteccao < 0.7) {
    promptEnriquecido += `\n\n⚠️ ATENÇÃO: Confiança de detecção: ${(analise.confiancaDeteccao * 100).toFixed(1)}%
Analise cuidadosamente o contexto e adapte o template se necessário.`;
  }
  
  // Adicionar instruções para complexidade alta
  if (analise.complexidade === 'alta') {
    promptEnriquecido += `\n\n🔍 COMPLEXIDADE ALTA DETECTADA:
- Analise TODOS os detalhes fornecidos
- Preserve informações específicas (links, códigos, horários)
- Mantenha estrutura de múltiplas opções se presente`;
  }
  
  // Adicionar instruções para imagens
  if (formData.imagemBase64) {
    promptEnriquecido += `\n\n📸 IMAGEM ANEXADA:
- Extraia TODOS os dados visíveis da imagem
- Preserve horários, preços e códigos exatos
- Mantenha links se visíveis`;
  }
  
  // Adicionar contexto de parcelamento
  if (formData.parcelamento?.incluirParcelamento) {
    promptEnriquecido += `\n\n💳 INCLUIR PARCELAMENTO:
- Calcular parcelamento em ${formData.parcelamento.parcelas || 10}x
- Formato: "${formData.parcelamento.parcelas}x de R$ [VALOR] s/ juros no cartão"`;
  }
  
  return promptEnriquecido;
}

// ================================================================================
// 🎯 PROMPTS ESPECÍFICOS PARA RANKING E DICAS
// ================================================================================

export function gerarPromptRankingHoteis(destino) {
  return `RANKING DE HOTÉIS - ${destino.toUpperCase()} - CVC ITAQUAQUECETUBA

OBJETIVO: Gerar ranking profissional dos 5 melhores hotéis

FORMATAÇÃO OBRIGATÓRIA:
1. 🏆 TÍTULO: "*🏆 TOP 5 HOTÉIS - ${destino.toUpperCase()}*"
2. 🥇 NUMERAÇÃO: 🥇 1. / 🥈 2. / 🥉 3. / 🏆 4. / 🏆 5.
3. ⭐ CATEGORIA: "⭐⭐⭐⭐" (estrelas visuais)
4. 📍 LOCALIZAÇÃO: Bairro ou região específica
5. 💰 FAIXA DE PREÇO: "R$ XXX-XXX por diária"
6. ⭐ DESTAQUE: Principais amenidades

TEMPLATE OBRIGATÓRIO:
*🏆 TOP 5 HOTÉIS - ${destino.toUpperCase()}*

🥇 *1. [NOME_HOTEL] - [ESTRELAS]*
📍 [LOCALIZACAO]
💰 R$ [FAIXA] por diária
⭐ [DESTAQUES]

[Repetir para os 5 hotéis]

📱 *CVC Itaquaquecetuba - Sua melhor escolha!*

DESTINO: ${destino}

GERAR RANKING PROFISSIONAL:`;
}

export function gerarPromptDicasDestino(destino) {
  return `DICAS DE VIAGEM - ${destino.toUpperCase()} - CVC ITAQUAQUECETUBA

OBJETIVO: Gerar dicas práticas e úteis para o destino

FORMATAÇÃO OBRIGATÓRIA:
1. 💡 TÍTULO: "*💡 DICAS DE VIAGEM - ${destino.toUpperCase()}*"
2. 🌡️ MELHOR ÉPOCA: Clima e temporadas
3. 🎯 ATRAÇÕES: Pontos turísticos principais
4. 🍽️ GASTRONOMIA: Pratos típicos locais
5. 💡 DICAS PRÁTICAS: Informações úteis

TEMPLATE OBRIGATÓRIO:
*💡 DICAS DE VIAGEM - ${destino.toUpperCase()}*

*🌡️ MELHOR ÉPOCA:*
[CLIMA_E_TEMPORADAS]

*🎯 ATRAÇÕES IMPERDÍVEIS:*
• [ATRACAO_1]
• [ATRACAO_2]
• [ATRACAO_3]
• [ATRACAO_4]

*🍽️ GASTRONOMIA LOCAL:*
• [PRATO_1]
• [PRATO_2]
• [PRATO_3]
• [BEBIDA_TIPICA]

*💡 DICAS IMPORTANTES:*
• [DICA_1]
• [DICA_2]
• [DICA_3]
• [DICA_4]

📱 *Entre em contato para mais informações específicas!*

DESTINO: ${destino}

GERAR DICAS PROFISSIONAIS:`;
}

export function gerarPromptAnaliseRelatorio(tipoAnalise) {
  return `ANÁLISE E RELATÓRIO - ${tipoAnalise.toUpperCase()} - CVC ITAQUAQUECETUBA

CONTEXTO: Análise detalhada para relatório profissional

INSTRUÇÕES:
1. 📊 APRESENTAR dados de forma estruturada
2. 📈 INCLUIR métricas e estatísticas relevantes
3. 🎯 DESTACAR insights principais
4. 📋 FORNECER conclusões práticas

FORMATO OBRIGATÓRIO:
- Seções bem definidas
- Dados quantitativos
- Análise qualitativa
- Recomendações finais

TIPO DE ANÁLISE: ${tipoAnalise}

GERAR RELATÓRIO PROFISSIONAL:`;
}

// ================================================================================
// 🔧 AJUSTES POR MODELO DE IA
// ================================================================================

export function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt para modelo: ${modelo}`);
  
  const ajustes = {
    'gpt-4o-mini': (p) => {
      // GPT-4o Mini: Prompts mais concisos e diretos
      return p.replace(/FORMATAÇÃO OBRIGATÓRIA:[\s\S]*?(?=TEMPLATE|DADOS)/g, 'REGRAS:\n')
              .replace(/\d+\.\s*[⏰📅✈️🛫💳👥🧳👶🏷️💰📱🔧]\s*/g, '• ');
    },
    'gpt-4o': (p) => {
      // GPT-4o: Pode lidar com prompts mais complexos
      return p; // Manter prompt completo
    },
    'claude-3-5-sonnet': (p) => {
      // Claude: Preferência por estruturas mais claras
      return p.replace(/GERAR ([A-Z\s]+):$/, 'Gere o $1 seguindo exatamente as regras acima:');
    }
  };
  
  const ajustador = ajustes[modelo] || ajustes['gpt-4o-mini'];
  return ajustador(prompt);
}

// ================================================================================
// ✅ VALIDAÇÃO DE PROMPTS
// ================================================================================

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
    'FORMATAÇÃO',
    'TEMPLATE',
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
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function calcularTamanhoPrompt(prompt) {
  return {
    caracteres: prompt.length,
    tokens_estimados: Math.ceil(prompt.length / 4), // Estimativa aproximada
    categoria: prompt.length < 1000 ? 'pequeno' : prompt.length < 2000 ? 'médio' : 'grande'
  };
}

function gerarPromptFallback(formData) {
  console.log("🔧 Gerando prompt de fallback...");
  
  return `ORÇAMENTO PROFISSIONAL - CVC ITAQUAQUECETUBA

DADOS FORNECIDOS:
- Destino: ${formData.destino || 'A definir'}
- Tipos: ${formData.tipos?.join(', ') || 'Aéreo Nacional'}
- Passageiros: ${formData.adultos || 2} adulto(s)${formData.criancas ? ` + ${formData.criancas} criança(s)` : ''}

OBSERVAÇÕES:
${formData.observacoes || 'Sem observações específicas'}

TEXTO COLADO:
${formData.textoColado || 'Nenhum texto adicional'}

INSTRUÇÕES:
1. Gerar orçamento profissional formatado para WhatsApp
2. Usar emojis apropriados (✈️ 💰 ✅ 🏷️)
3. Incluir separador "--" entre ida e volta
4. Formato de valores: "R$ 1.247,80"
5. Bagagem: "Só mala de mão incluída" (padrão)
6. Reembolso: "Não reembolsável" (padrão)

GERAR ORÇAMENTO PROF
