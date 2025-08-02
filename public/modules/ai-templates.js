// 📋 ai-templates.js - Módulo de Templates Específicos
// Responsável por aplicar templates otimizados baseados no tipo de conteúdo detectado

console.log("📋 Módulo de Templates carregado");

// ================================================================================
// 🛫 TEMPLATE IDA E VOLTA
// ================================================================================

function templateIdaVolta(formData, analise) {
  console.log("🛫 Aplicando template Ida e Volta...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - IDA E VOLTA

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

INSTRUÇÕES ESPECÍFICAS PARA IDA E VOLTA:
1. 🔍 ESTRUTURA OBRIGATÓRIA:
   - Seção "✈️ VOO DE IDA" com data, horário e aeroportos
   - Seção "✈️ VOO DE VOLTA" com data, horário e aeroportos
   - Separar claramente as duas seções

2. 🕐 DETECÇÃO DE DATAS:
   - Identificar automaticamente data de ida e volta
   - Se há duas datas diferentes, é ida e volta
   - Exemplo: "17 de janeiro" (ida) e "23 de janeiro" (volta)

3. ✈️ AEROPORTOS:
   - Converter códigos para nomes completos
   - Ida: Origem → Destino (com escalas se houver)
   - Volta: Destino → Origem (com escalas se houver)

4. 💰 PREÇOS:
   - Total por pessoa
   - Total família (se múltiplos passageiros)
   - Usar apenas valores reais fornecidos

5. 🧹 FORMATAÇÃO:
   - Sem cabeçalhos técnicos
   - Pronto para WhatsApp
   - Emojis apropriados

GERE O ORÇAMENTO IDA E VOLTA:`;
}

// ================================================================================
// 🔢 TEMPLATE MÚLTIPLAS OPÇÕES
// ================================================================================

function templateMultiplasOpcoes(formData, analise) {
  console.log("🔢 Aplicando template Múltiplas Opções...");
  
  const tiposTexto = formData.tipos.join(", ");
  const numeroOpcoes = analise.numeroOpcoesDetectadas || 2;
  
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

INSTRUÇÕES ESPECÍFICAS PARA MÚLTIPLAS OPÇÕES:
1. 🔢 NUMERAÇÃO CLARA:
   - "OPÇÃO 1:", "OPÇÃO 2:", etc.
   - Separar cada opção visualmente
   - Máximo ${numeroOpcoes} opções detectadas

2. ✈️ PARA CADA OPÇÃO:
   - Aeroportos e horários específicos
   - Companhia aérea
   - Escalas (se houver)
   - Preço individual

3. 🏨 HOTÉIS (se aplicável):
   - Nome exato do hotel
   - Categoria/Estrelas
   - Localização
   - Diárias incluídas

4. 💰 COMPARAÇÃO DE PREÇOS:
   - Apresentar opções do menor para maior preço
   - Total por pessoa para cada opção
   - Destacar melhor custo-benefício

5. 🎯 RECOMENDAÇÃO:
   - Sugerir a melhor opção e por quê
   - Considerar preço, horário, aeroportos

GERE AS MÚLTIPLAS OPÇÕES ORGANIZADAS:`;
}

// ================================================================================
// 🚢 TEMPLATE CRUZEIRO POR CABINE
// ================================================================================

function templateCruzeiro(formData, analise) {
  console.log("🚢 Aplicando template Cruzeiro por Cabine...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO POR CABINE

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

INSTRUÇÕES ESPECÍFICAS PARA CRUZEIROS:
1. 🛳️ FOCO EM CABINES (NÃO POR PASSAGEIRO):
   - "Cabine Interna - R$ 5.018,00"
   - "Cabine Externa - R$ 6.250,00"
   - "Cabine com Varanda - R$ 8.150,00"
   - "Suíte - R$ 12.800,00"

2. 🗓️ INFORMAÇÕES DO CRUZEIRO:
   - Navio e companhia
   - Roteiro completo
   - Data de embarque e desembarque
   - Duração (X noites)

3. 🏖️ DESTINOS:
   - Portos de parada
   - Tempo em cada destino
   - Atividades incluídas

4. 🍽️ INCLUSÕES:
   - Todas as refeições
   - Entretenimento a bordo
   - Taxa de serviço
   - O que NÃO está incluído

5. 💰 PREÇOS POR CABINE:
   - Valor total da cabine (para 2 pessoas)
   - Taxas portuárias separadas
   - Opções de parcelamento

6. ⚠️ OBSERVAÇÕES IMPORTANTES:
   - Documentação necessária
   - Políticas de cancelamento
   - Datas limite para reserva

GERE O ORÇAMENTO DE CRUZEIRO POR CABINE:`;
}

// ================================================================================
// 🏨 TEMPLATE HOTEL MELHORADO
// ================================================================================

function templateHotel(formData, analise) {
  console.log("🏨 Aplicando template Hotel Melhorado...");
  
  const tiposTexto = formData.tipos.join(", ");
  
  return `ORÇAMENTO CVC ITAQUA - HOTÉIS DETALHADOS

TIPOS SELECIONADOS: ${tiposTexto}

DADOS DA VIAGEM:
${formData.observacoes}

${formData.textoColado ? `INFORMAÇÕES ADICIONAIS:
${formData.textoColado}` : ''}

INSTRUÇÕES ESPECÍFICAS PARA HOTÉIS:
1. 🏨 NOME EXATO E CATEGORIA:
   - Nome completo do hotel (sem abreviações)
   - Estrelas ou categoria (★★★★☆)
   - Rede hoteleira (se aplicável)

2. 📍 LOCALIZAÇÃO PRECISA:
   - Bairro ou região específica
   - Distância de pontos turísticos principais
   - Acesso a transporte público

3. 🛏️ DETALHES DA ACOMODAÇÃO:
   - Tipo de quarto reservado
   - Número de hóspedes
   - Regime alimentar (café, meia pensão, all inclusive)

4. 🗓️ PERÍODO E DIÁRIAS:
   - Check-in e check-out
   - Número exato de diárias
   - Datas em formato brasileiro

5. 🌟 DIFERENCIAIS DO HOTEL:
   - Piscina, spa, academia
   - Wi-Fi, ar condicionado
   - Localização privilegiada
   - Comodidades especiais

6. 💰 PREÇOS DETALHADOS:
   - Valor por pessoa (se aplicável)
   - Valor total da reserva
   - Taxas e impostos inclusos
   - Opções de parcelamento

7. ✅ INCLUSÕES:
   - O que está incluído na tarifa
   - Café da manhã, transfers, etc.
   - Políticas de cancelamento

GERE O ORÇAMENTO DE HOTEL DETALHADO:`;
}

// ================================================================================
// 🎯 SELETOR AUTOMÁTICO DE TEMPLATE
// ================================================================================

function selecionarTemplate(formData, analise) {
  console.log("🎯 Selecionando template apropriado...", analise);
  
  // 1. Prioridade para CRUZEIRO se detectado
  if (formData.tipos.some(tipo => tipo.toLowerCase().includes('cruzeiro'))) {
    console.log("🚢 Template Cruzeiro selecionado");
    return templateCruzeiro(formData, analise);
  }
  
  // 2. Template IDA E VOLTA se detectado
  if (analise.isIdaVolta) {
    console.log("🛫 Template Ida e Volta selecionado");
    return templateIdaVolta(formData, analise);
  }
  
  // 3. Template MÚLTIPLAS OPÇÕES se detectado
  if (analise.temMultiplasOpcoes) {
    console.log("🔢 Template Múltiplas Opções selecionado");
    return templateMultiplasOpcoes(formData, analise);
  }
  
  // 4. Template HOTEL se detectado
  if (formData.tipos.some(tipo => tipo.toLowerCase().includes('hotel'))) {
    console.log("🏨 Template Hotel selecionado");
    return templateHotel(formData, analise);
  }
  
  // 5. Template padrão (IDA E VOLTA é mais comum)
  console.log("📋 Template padrão (Ida e Volta) selecionado");
  return templateIdaVolta(formData, analise);
}

// ================================================================================
// 🔧 FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

function aplicarTemplate(formData, analise) {
  try {
    console.log("🔧 Iniciando aplicação de template...");
    
    if (!formData || !analise) {
      console.error("❌ Dados inválidos para template");
      return null;
    }
    
    // Seleciona e aplica o template apropriado
    const prompt = selecionarTemplate(formData, analise);
    
    // Adiciona configurações específicas baseadas na análise
    let promptFinal = prompt;
    
    // Adiciona instruções de parcelamento se necessário
    if (formData.parcelamento?.incluirParcelamento) {
      promptFinal += adicionarConfiguracaoParcelamento(formData);
    }
    
    console.log("✅ Template aplicado com sucesso");
    console.log(`📊 Prompt final: ${promptFinal.length} caracteres`);
    
    return promptFinal;
    
  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return null;
  }
}

// ================================================================================
// 💳 CONFIGURAÇÃO DE PARCELAMENTO (REUTILIZADA)
// ================================================================================

function adicionarConfiguracaoParcelamento(formData) {
  if (!formData.parcelamento || !formData.parcelamento.incluirParcelamento) {
    return '\n\nPARCELAMENTO: Não incluir (exceto se explícito nas observações para Aéreo Facial)';
  }
  
  let configParcelamento = '\n\nPARCELAMENTO SOLICITADO:';
  
  if (formData.parcelamento.parcelas10x && formData.parcelamento.parcelas12x) {
    configParcelamento += '\n- Incluir opções de 10x e 12x';
  } else if (formData.parcelamento.parcelas10x) {
    configParcelamento += '\n- Incluir opção de 10x';
  } else if (formData.parcelamento.parcelas12x) {
    configParcelamento += '\n- Incluir opção de 12x';
  }
  
  configParcelamento += '\n- Calcular valor das parcelas automaticamente';
  
  return configParcelamento;
}

// ================================================================================
// 📊 ESTATÍSTICAS E LOGS
// ================================================================================

function logEstatisticasTemplate(formData, analise, templateUsado) {
  console.log("📊 Estatísticas do template:");
  console.log("- Tipos selecionados:", formData.tipos.join(', '));
  console.log("- Ida e volta:", analise.isIdaVolta ? 'Sim' : 'Não');
  console.log("- Múltiplas opções:", analise.temMultiplasOpcoes ? 'Sim' : 'Não');
  console.log("- Template usado:", templateUsado);
  console.log("- Parcelamento:", formData.parcelamento?.incluirParcelamento ? 'Sim' : 'Não');
}

// ================================================================================
// 📤 EXPORTAÇÃO COMPATÍVEL COM SISTEMA CVC
// ================================================================================

// Compatibilidade com sistema de módulos existente
if (typeof window !== 'undefined') {
  // Browser environment - adiciona ao objeto global
  window.aplicarTemplate = aplicarTemplate;
  window.selecionarTemplate = selecionarTemplate;
  window.templateIdaVolta = templateIdaVolta;
  window.templateMultiplasOpcoes = templateMultiplasOpcoes;
  window.templateCruzeiro = templateCruzeiro;
  window.templateHotel = templateHotel;
}

// Exportação para sistemas que suportam modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    aplicarTemplate,
    selecionarTemplate,
    templateIdaVolta,
    templateMultiplasOpcoes,
    templateCruzeiro,
    templateHotel,
    logEstatisticasTemplate
  };
}

console.log("✅ Módulo ai-templates.js carregado e pronto para uso");