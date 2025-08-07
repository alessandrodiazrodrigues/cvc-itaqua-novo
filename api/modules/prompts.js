// 🎯 api/modules/prompts.js - v8.3 - CORREÇÃO EMERGENCIAL DE SINTAXE
// ESTRATÉGIA: Implementação mínima funcional para quebrar o ciclo de erros
// FOCO: Todas as funções implementadas, mesmo que básicas

console.log("🎯 Prompts v8.3 - CORREÇÃO EMERGENCIAL DE SINTAXE");

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL - IMPLEMENTAÇÃO MÍNIMA
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  console.log("🎯 Gerando prompt otimizado v8.3...");
  
  if (!formData) {
    return gerarPromptFallback({});
  }
  
  try {
    // Contexto básico
    const contexto = construirContexto(formData, analise || {});
    const estrategia = determinarEstrategia(analise || {});
    
    // Prompt específico
    const tipoDetectado = analise?.tipoDetectado || 'generico';
    const promptEspecifico = selecionarPromptPorTipo(tipoDetectado, contexto, estrategia);
    
    console.log(`✅ Prompt gerado: ${promptEspecifico.length} caracteres`);
    return promptEspecifico;
    
  } catch (error) {
    console.error("❌ Erro na geração do prompt:", error);
    return gerarPromptFallback(formData);
  }
}

// ================================================================================
// 🏗️ CONSTRUÇÃO DE CONTEXTO BÁSICA
// ================================================================================

function construirContexto(formData, analise) {
  return {
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    destino: formData.destino || "Destino não informado",
    
    // Dados da análise (com fallbacks)
    tipoDetectado: analise.tipoDetectado || 'generico',
    confianca: analise.confiancaDeteccao || 0.8,
    complexidade: analise.complexidade || 'media',
    
    // Configurações básicas
    temImagem: !!formData.imagemBase64,
    adultos: formData.adultos || 1,
    criancas: formData.criancas || 0
  };
}

// ================================================================================
// ⚙️ ESTRATÉGIA BÁSICA
// ================================================================================

function determinarEstrategia(analise) {
  return {
    foco: 'formatacao_padrao',
    detalhamento: 'medio',
    validacao: 'padrao',
    modelo_recomendado: 'gpt-4o-mini'
  };
}

// ================================================================================
// 🎯 SELEÇÃO DE PROMPT SIMPLIFICADA
// ================================================================================

function selecionarPromptPorTipo(tipoDetectado, contexto, estrategia) {
  console.log(`🎯 Selecionando prompt para tipo: ${tipoDetectado}`);
  
  // Prompts básicos por tipo
  const prompts = {
    'aereo_nacional_simples': promptAereoNacionalSimples(contexto),
    'generico': promptGenerico(contexto)
  };
  
  return prompts[tipoDetectado] || prompts.generico;
}

// ================================================================================
// 📋 PROMPTS ESPECÍFICOS - IMPLEMENTAÇÃO BÁSICA
// ================================================================================

function promptAereoNacionalSimples(contexto) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL v8.3

DADOS DA VIAGEM:
- Tipos: ${contexto.tipos}
- Destino: ${contexto.destino}
- Passageiros: ${contexto.adultos} adulto(s)${contexto.criancas > 0 ? `, ${contexto.criancas} criança(s)` : ''}
${contexto.observacoes ? `- Observações: ${contexto.observacoes}` : ''}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATO OBRIGATÓRIO:
*[COMPANHIA] - [ORIGEM] ✈ [DESTINO]*
[DD/MM] - [ORIGEM_AEROPORTO] [HH:MM] / [DESTINO_AEROPORTO] [HH:MM] (voo direto)
--
[DD/MM] - [DESTINO_AEROPORTO] [HH:MM] / [ORIGEM_AEROPORTO] [HH:MM] (voo direto)

💰 [VALOR] para ${contexto.adultos} adulto(s)
💳 Em até 10x sem juros
✅ Só mala de mão incluída
🏷️ Não reembolsável

REGRAS CRÍTICAS:
- Horários: "06:20" (NUNCA "06: 20")
- Aeroportos: CGH → Congonhas, GRU → Guarulhos
- Valores: "R$ 1.464,02" (espaço após R$)

GERAR ORÇAMENTO PROFISSIONAL:`;
}

function promptGenerico(contexto) {
  return `ORÇAMENTO CVC ITAQUA v8.3

Gere um orçamento completo e formatado para:

DADOS DA SOLICITAÇÃO:
- Tipos: ${contexto.tipos}
- Destino: ${contexto.destino}
- Passageiros: ${contexto.adultos} adulto(s)${contexto.criancas > 0 ? `, ${contexto.criancas} criança(s)` : ''}
${contexto.observacoes ? `- Observações: ${contexto.observacoes}` : ''}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

FORMATO OBRIGATÓRIO:
- Use emojis para destacar seções (💰 para preços, ✈️ para voos, 🏨 para hotéis)
- Inclua valores em R$ com formatação brasileira
- Adicione informações sobre bagagem e parcelamento
- Mantenha linguagem profissional e atrativa

Gere o orçamento completo e formatado:`;
}

// ================================================================================
// 🔧 FUNÇÕES DE SUPORTE - IMPLEMENTAÇÃO MÍNIMA
// ================================================================================

function gerarPromptFallback(formData) {
  return `ORÇAMENTO CVC ITAQUA - MODO BÁSICO

Destino: ${formData.destino || 'Não informado'}
Passageiros: ${formData.adultos || 1} adulto(s)
Tipos solicitados: ${formData.tipos?.join(', ') || 'Geral'}

${formData.observacoes ? `Observações: ${formData.observacoes}` : ''}

Gere um orçamento profissional baseado nestes dados.`;
}

function gerarPromptDicasDestino(destino) {
  return `DICAS DE VIAGEM CVC ITAQUA - ${destino.toUpperCase()}

Forneça dicas práticas de viagem para ${destino} incluindo:
- Melhor época para visitar
- O que levar
- Pontos turísticos principais
- Orçamento estimado diário
- Documentação necessária`;
}

function gerarPromptRankingHoteis(destino) {
  return `RANKING DE HOTÉIS CVC ITAQUA - ${destino.toUpperCase()}

Crie um ranking dos melhores hotéis em ${destino} com:
- Top 5 hotéis recomendados
- Faixa de preço por noite
- Principais características
- Localização
- Classificação por estrelas`;
}

function gerarPromptAnaliseRelatorio(dados) {
  return `ANÁLISE DE RELATÓRIO CVC ITAQUA

Analise os dados fornecidos e gere um relatório com:
- Resumo executivo
- Principais achados
- Recomendações
- Próximos passos`;
}

function ajustarPromptParaModelo(prompt, modelo) {
  console.log(`🔧 Ajustando prompt para modelo: ${modelo}`);
  return prompt; // Implementação básica - apenas retorna o prompt
}

function validarPrompt(prompt, tipoDetectado) {
  const validacao = {
    valido: true,
    problemas: [],
    sugestoes: []
  };
  
  if (!prompt || prompt.length < 10) {
    validacao.valido = false;
    validacao.problemas.push('Prompt muito curto');
  }
  
  return validacao;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 CORRIGIDA E COMPLETA
// ================================================================================

console.log("✅ Prompts v8.3 carregado - SINTAXE EMERGENCIAL CORRIGIDA");

export {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

export default {
  gerarPromptOtimizado,
  selecionarPromptPorTipo,
  gerarPromptDicasDestino,
  gerarPromptRankingHoteis,
  gerarPromptAnaliseRelatorio,
  ajustarPromptParaModelo,
  validarPrompt
};

console.log("🚀 Sistema de Prompts v8.3 - EMERGENCIAL FUNCIONAL!");
