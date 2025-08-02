// 🎯 ai-prompts.js - Módulo de Prompts Otimizados
// Responsável por gerar prompts específicos baseados no tipo de conteúdo detectado

console.log("🎯 Módulo de Prompts carregado");

// ================================================================================
// 🛫 PROMPT IDA E VOLTA
// ================================================================================

function promptIdaVolta(formData, analise) {
  console.log("🛫 Gerando prompt Ida e Volta...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - IDA E VOLTA

INSTRUÇÕES CRÍTICAS:
1. 🔍 DETECTAR AUTOMATICAMENTE:
   - Se há duas datas diferentes, é ida e volta
   - Exemplo: "17 de janeiro" (ida) e "23 de janeiro" (volta)
   - Dividir em seções "✈️ VOO DE IDA" e "✈️ VOO DE VOLTA"

2. ✈️ AEROPORTOS OBRIGATÓRIO:
   - Converter códigos para nomes completos
   - GRU → Guarulhos, CGH → Congonhas, SDU → Santos Dumont
   - Ida: Origem → Destino (com escalas se houver)
   - Volta: Destino → Origem (com escalas se houver)

3. 🕐 HORÁRIOS PRECISOS:
   - Formato 24h: 08:30, 14:15, 23:45
   - Saída e chegada para cada trecho
   - Se há escala, mostrar todos os horários

4. 🏷️ FORMATAÇÃO ESPECÍFICA:
   - Sem cabeçalhos técnicos
   - Pronto para WhatsApp
   - Emojis apropriados por seção

DADOS FORNECIDOS:
Tipos: ${tiposTexto}
${formData.destino ? `Destino: ${formData.destino}` : ''}
${formData.adultos ? `Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `Crianças: ${formData.criancas} (idades: ${formData.idadesCriancas.join(', ')})` : ''}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `DADOS ADICIONAIS:
${formData.textoColado}` : ''}

GERE O ORÇAMENTO IDA E VOLTA PROFISSIONAL:`;
}

// ================================================================================
// 🔢 PROMPT MÚLTIPLAS OPÇÕES
// ================================================================================

function promptMultiplasOpcoes(formData, analise) {
  console.log("🔢 Gerando prompt Múltiplas Opções...");
  
  const tiposTexto = formData.tipos.join(", ");
  const numeroOpcoes = analise.numeroOpcoesDetectadas || 2;
  
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES

INSTRUÇÕES CRÍTICAS:
1. 🔢 NUMERAÇÃO OBRIGATÓRIA:
   - "OPÇÃO 1:", "OPÇÃO 2:", etc. (máximo ${numeroOpcoes} detectadas)
   - Separar cada opção com linha em branco
   - Apresentar do menor para maior preço

2. ✈️ PARA CADA OPÇÃO INCLUIR:
   - Aeroportos específicos (GRU→MIA→LAX)
   - Horários de saída e chegada
   - Companhia aérea
   - Escalas detalhadas se houver
   - Preço individual claro

3. 🏨 HOTÉIS (se aplicável):
   - Nome exato do hotel
   - Categoria/Estrelas (★★★★☆)
   - Localização específica
   - Regime alimentar

4. 💰 COMPARAÇÃO INTELIGENTE:
   - Destacar melhor custo-benefício
   - Total por pessoa para cada opção
   - Explicar diferenças principais

5. 🎯 RECOMENDAÇÃO FINAL:
   - Sugerir a melhor opção e justificar
   - Considerar preço, horário, comodidade

DADOS FORNECIDOS:
Tipos: ${tiposTexto}
${formData.destino ? `Destino: ${formData.destino}` : ''}
${formData.adultos ? `Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `Crianças: ${formData.criancas} (idades: ${formData.idadesCriancas.join(', ')})` : ''}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `DADOS ADICIONAIS:
${formData.textoColado}` : ''}

GERE AS ${numeroOpcoes} OPÇÕES ORGANIZADAS E COMPARADAS:`;
}

// ================================================================================
// 🚢 PROMPT CRUZEIRO POR CABINE
// ================================================================================

function promptCruzeiro(formData, analise) {
  console.log("🚢 Gerando prompt Cruzeiro por Cabine...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO POR CABINE

INSTRUÇÕES CRÍTICAS:
1. 🛳️ FOCO EM CABINES (NÃO POR PASSAGEIRO):
   - "Cabine Interna - R$ 5.018,00"
   - "Cabine Externa - R$ 6.250,00" 
   - "Cabine com Varanda - R$ 8.150,00"
   - "Suíte - R$ 12.800,00"
   - SEMPRE valor da cabine completa (2 pessoas)

2. 🗓️ INFORMAÇÕES OBRIGATÓRIAS:
   - Nome do navio e companhia
   - Roteiro completo (todos os portos)
   - Data exata de embarque e desembarque
   - Duração total (X noites)

3. 🏖️ DESTINOS DETALHADOS:
   - Cada porto de parada
   - Tempo de permanência em cada destino
   - Principais atrações incluídas

4. 🍽️ INCLUSÕES IMPORTANTES:
   - "Todas as refeições incluídas"
   - "Entretenimento a bordo"
   - "Taxa de serviço incluída"
   - Listar o que NÃO está incluído

5. 💰 ESTRUTURA DE PREÇOS:
   - Valor por tipo de cabine
   - Taxas portuárias separadas
   - Opções de parcelamento
   - Melhor custo-benefício destacado

6. ⚠️ INFORMAÇÕES PRÁTICAS:
   - Documentação necessária
   - Políticas de cancelamento
   - Data limite para reserva

DADOS FORNECIDOS:
Tipos: ${tiposTexto}
${formData.destino ? `Destino: ${formData.destino}` : ''}
${formData.adultos ? `Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `Crianças: ${formData.criancas} (idades: ${formData.idadesCriancas.join(', ')})` : ''}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `DADOS ADICIONAIS:
${formData.textoColado}` : ''}

GERE O ORÇAMENTO DE CRUZEIRO POR CABINE:`;
}

// ================================================================================
// 🏨 PROMPT HOTEL DETALHADO
// ================================================================================

function promptHotel(formData, analise) {
  console.log("🏨 Gerando prompt Hotel Detalhado...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - HOTÉIS DETALHADOS

INSTRUÇÕES CRÍTICAS:
1. 🏨 NOME E CATEGORIA EXATOS:
   - Nome completo sem abreviações
   - Estrelas ou categoria (★★★★☆)
   - Rede hoteleira se aplicável
   - NUNCA inventar nomes de hotéis

2. 📍 LOCALIZAÇÃO PRECISA:
   - Bairro ou região específica
   - Distância de pontos turísticos principais
   - Acesso a transporte público
   - Endereço se disponível

3. 🛏️ DETALHES DA ACOMODAÇÃO:
   - Tipo exato de quarto
   - Capacidade de hóspedes
   - Regime alimentar específico (café/meia pensão/all inclusive)

4. 🗓️ PERÍODO E DIÁRIAS:
   - Check-in e check-out claros
   - Número exato de diárias
   - Datas em formato brasileiro (dd/mm/aaaa)

5. 🌟 DIFERENCIAIS ESPECÍFICOS:
   - Comodidades reais do hotel
   - Piscina, spa, academia (só se confirmado)
   - Wi-Fi, ar condicionado
   - Localização privilegiada

6. 💰 PREÇOS TRANSPARENTES:
   - Valor por pessoa (se aplicável)
   - Valor total da reserva
   - Impostos e taxas inclusos
   - Parcelamento disponível

7. ✅ INCLUSÕES DETALHADAS:
   - O que está incluído na tarifa
   - Café da manhã, transfers
   - Políticas de cancelamento

DADOS FORNECIDOS:
Tipos: ${tiposTexto}
${formData.destino ? `Destino: ${formData.destino}` : ''}
${formData.adultos ? `Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `Crianças: ${formData.criancas} (idades: ${formData.idadesCriancas.join(', ')})` : ''}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `DADOS ADICIONAIS:
${formData.textoColado}` : ''}

GERE O ORÇAMENTO DE HOTEL DETALHADO:`;
}

// ================================================================================
// 🎯 PROMPT GENÉRICO MELHORADO
// ================================================================================

function promptGenerico(formData, analise) {
  console.log("🎯 Gerando prompt genérico melhorado...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - ANÁLISE AUTOMÁTICA

INSTRUÇÕES GERAIS:
1. 🔍 ANALISAR AUTOMATICAMENTE:
   - Tipo de viagem (ida/volta, múltiplas opções, etc.)
   - Detectar escalas e conexões
   - Identificar padrões nos dados

2. ✈️ AEROPORTOS E VOOS:
   - Converter códigos para nomes (GRU→Guarulhos)
   - Horários em formato 24h (08:30, 23:45)
   - Detalhar escalas se houver

3. 🏨 HOTÉIS E HOSPEDAGEM:
   - Nome completo e categoria
   - Localização específica
   - Regime alimentar

4. 💰 PREÇOS E VALORES:
   - Usar apenas valores fornecidos
   - Não inventar preços
   - Calcular totais quando possível

5. 🎨 FORMATAÇÃO PROFISSIONAL:
   - Sem cabeçalhos técnicos
   - Pronto para WhatsApp
   - Emojis apropriados

DADOS FORNECIDOS:
Tipos: ${tiposTexto}
${formData.destino ? `Destino: ${formData.destino}` : ''}
${formData.adultos ? `Adultos: ${formData.adultos}` : ''}
${formData.criancas > 0 ? `Crianças: ${formData.criancas} (idades: ${formData.idadesCriancas.join(', ')})` : ''}

OBSERVAÇÕES:
${formData.observacoes}

${formData.textoColado ? `DADOS ADICIONAIS:
${formData.textoColado}` : ''}

GERE O ORÇAMENTO PROFISSIONAL:`;
}

// ================================================================================
// 🎯 SELETOR AUTOMÁTICO DE PROMPT
// ================================================================================

function selecionarPrompt(formData, analise) {
  console.log("🎯 Selecionando prompt apropriado...", analise);
  
  // 1. Prioridade para CRUZEIRO se detectado
  if (formData.tipos.some(tipo => tipo.toLowerCase().includes('cruzeiro'))) {
    console.log("🚢 Prompt Cruzeiro selecionado");
    return promptCruzeiro(formData, analise);
  }
  
  // 2. Prompt IDA E VOLTA se detectado
  if (analise.isIdaVolta) {
    console.log("🛫 Prompt Ida e Volta selecionado");
    return promptIdaVolta(formData, analise);
  }
  
  // 3. Prompt MÚLTIPLAS OPÇÕES se detectado
  if (analise.temMultiplasOpcoes) {
    console.log("🔢 Prompt Múltiplas Opções selecionado");
    return promptMultiplasOpcoes(formData, analise);
  }
  
  // 4. Prompt HOTEL se detectado
  if (formData.tipos.some(tipo => tipo.toLowerCase().includes('hotel'))) {
    console.log("🏨 Prompt Hotel selecionado");
    return promptHotel(formData, analise);
  }
  
  // 5. Prompt genérico melhorado
  console.log("📋 Prompt genérico selecionado");
  return promptGenerico(formData, analise);
}

// ================================================================================
// 🔧 FUNÇÃO PRINCIPAL DE GERAÇÃO DE PROMPT
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  try {
    console.log("🔧 Iniciando geração de prompt...");
    
    if (!formData || !analise) {
      console.error("❌ Dados inválidos para prompt");
      return null;
    }
    
    // Seleciona o prompt apropriado baseado na análise
    let prompt = selecionarPrompt(formData, analise);
    
    // Adiciona configurações específicas baseadas na análise
    prompt = adicionarConfiguracoesDinamicas(prompt, formData, analise);
    
    console.log("✅ Prompt gerado com sucesso");
    console.log(`📊 Prompt final: ${prompt.length} caracteres`);
    
    return prompt;
    
  } catch (error) {
    console.error("❌ Erro ao gerar prompt:", error);
    return null;
  }
}

// ================================================================================
// ⚙️ CONFIGURAÇÕES DINÂMICAS
// ================================================================================

function adicionarConfiguracoesDinamicas(prompt, formData, analise) {
  let promptFinal = prompt;
  
  // Adiciona instruções de parcelamento se necessário
  if (formData.parcelamento?.incluirParcelamento) {
    promptFinal += adicionarInstrucoesParcelamento(formData);
  }
  
  // Adiciona instruções específicas baseadas na complexidade
  if (analise.complexidade === 'alta') {
    promptFinal += `\n\nIMPORTANTE: Esta é uma viagem complexa. Seja extra detalhado e organize as informações de forma clara.`;
  }
  
  // Adiciona instruções para escalas se detectadas
  if (analise.temEscalas) {
    promptFinal += `\n\nESCALAS DETECTADAS: Detalhe todas as conexões com horários e aeroportos (${analise.aeroportos.join(' → ')}).`;
  }
  
  // Adiciona instruções para crianças se houver
  if (formData.criancas > 0) {
    promptFinal += `\n\nVIAGEM COM CRIANÇAS: Considere políticas de idade e tarifas infantis.`;
  }
  
  return promptFinal;
}

function adicionarInstrucoesParcelamento(formData) {
  if (!formData.parcelamento || !formData.parcelamento.incluirParcelamento) {
    return '\n\nPARCELAMENTO: Não incluir (exceto se explícito nas observações para Aéreo Facial)';
  }
  
  let instrucoes = '\n\nPARCELAMENTO OBRIGATÓRIO:';
  
  if (formData.parcelamento.parcelas10x && formData.parcelamento.parcelas12x) {
    instrucoes += '\n- Mostrar opções de 10x e 12x';
    instrucoes += '\n- Exemplo: "💳 10x de R$ 128,50 ou 12x de R$ 107,08"';
  } else if (formData.parcelamento.parcelas10x) {
    instrucoes += '\n- Incluir parcelamento em 10x';
    instrucoes += '\n- Exemplo: "💳 10x de R$ 128,50"';
  } else if (formData.parcelamento.parcelas12x) {
    instrucoes += '\n- Incluir parcelamento em 12x';
    instrucoes += '\n- Exemplo: "💳 12x de R$ 107,08"';
  }
  
  instrucoes += '\n- Calcular valor das parcelas automaticamente (valor total ÷ parcelas)';
  
  return instrucoes;
}

// ================================================================================
// 🎯 PROMPTS PARA OUTROS MÓDULOS
// ================================================================================

function promptDicasDestino(destino, periodo, temCriancas) {
  console.log("🌍 Gerando prompt para dicas de destino...");
  
  return `DICAS PERSONALIZADAS - ${destino.toUpperCase()}

INSTRUÇÕES ESPECÍFICAS:
1. 🎯 GERAR DICAS PRÁTICAS:
   - Melhor época para visitar
   - Pontos turísticos imperdíveis
   - Dicas de transporte local
   - Restaurantes recomendados

2. 📅 CONSIDERAR PERÍODO:
   - ${periodo ? `Viagem em: ${periodo}` : 'Adaptar às características gerais do destino'}
   - Clima e temperatura esperada
   - Eventos e festivais locais

3. 👨‍👩‍👧‍👦 VIAGEM FAMILIAR:
   - ${temCriancas ? 'Incluir atrações familiares e dicas para crianças' : 'Focar em experiências para adultos'}
   - Parques, museus interativos
   - Restaurantes family-friendly

4. 💡 DICAS PRÁTICAS:
   - Documentação necessária
   - Moeda local e câmbio
   - Segurança e precauções
   - Itens essenciais para levar

5. 🎨 FORMATO WHATSAPP:
   - Texto corrido, sem tópicos
   - Emojis apropriados
   - Máximo 10 linhas
   - Linguagem amigável

GERE AS DICAS PERSONALIZADAS:`;
}

function promptRankingHoteis(destino) {
  console.log("🏨 Gerando prompt para ranking de hotéis...");
  
  return `RANKING DE HOTÉIS - ${destino.toUpperCase()}

INSTRUÇÕES ESPECÍFICAS:
1. 🏆 RANKING TOP 5:
   - Hotéis reais e disponíveis
   - Avaliações do TripAdvisor/Booking
   - Notas acima de 8.0

2. 🌟 PARA CADA HOTEL:
   - Nome completo e categoria
   - Nota e fonte (TripAdvisor 4.5/5)
   - Localização específica
   - 2-3 pontos positivos principais

3. 📍 INFORMAÇÕES PRÁTICAS:
   - Distância do centro/aeroporto
   - Acesso a pontos turísticos
   - Comodidades principais

4. 💰 FAIXA DE PREÇO:
   - Classificar: Econômico/Médio/Luxo
   - Não inventar valores específicos
   - Usar apenas faixas gerais

5. 🎯 APENAS PONTOS POSITIVOS:
   - Destacar qualidades dos hotéis
   - Não mencionar pontos negativos
   - Foco em experiência positiva

GERE O RANKING PROFISSIONAL:`;
}

// ================================================================================
// 📤 EXPORTAÇÃO COMPATÍVEL COM SISTEMA CVC
// ================================================================================

// Compatibilidade com sistema de módulos existente
if (typeof window !== 'undefined') {
  // Browser environment - adiciona ao objeto global
  window.gerarPromptOtimizado = gerarPromptOtimizado;
  window.selecionarPrompt = selecionarPrompt;
  window.promptIdaVolta = promptIdaVolta;
  window.promptMultiplasOpcoes = promptMultiplasOpcoes;
  window.promptCruzeiro = promptCruzeiro;
  window.promptHotel = promptHotel;
  window.promptGenerico = promptGenerico;
  window.promptDicasDestino = promptDicasDestino;
  window.promptRankingHoteis = promptRankingHoteis;
}

// Exportação para sistemas que suportam modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gerarPromptOtimizado,
    selecionarPrompt,
    promptIdaVolta,
    promptMultiplasOpcoes,
    promptCruzeiro,
    promptHotel,
    promptGenerico,
    promptDicasDestino,
    promptRankingHoteis,
    adicionarConfiguracoesDinamicas
  };
}

console.log("✅ Módulo ai-prompts.js carregado e pronto para uso");