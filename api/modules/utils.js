// 🔧 utils.js - UTILITÁRIOS E MÉTRICAS COMPLETOS v8.0
// CORREÇÃO CRÍTICA: Exportação ES6 + normalizarEntrada + Sistema Avançado de Métricas
// Responsável por: Cálculos, validações, logs, sanitização, estatísticas, normalização

console.log("🔧 Utils v8.0 - UTILITÁRIOS COMPLETOS + NORMALIZAÇÃO + ES6 CORRIGIDA");

// ================================================================================
// 📊 CONFIGURAÇÕES DE MÉTRICAS
// ================================================================================

const METRICAS_CONFIG = {
  precos_modelos: {
    'gpt-4o-mini': {
      input: 0.00015,   // USD por 1K tokens
      output: 0.0006    // USD por 1K tokens
    },
    'gpt-4o': {
      input: 0.0025,
      output: 0.01
    },
    'claude-3-5-sonnet-20240620': {
      input: 0.003,
      output: 0.015
    }
  },
  usd_to_brl: 5.20, // Taxa de conversão aproximada
  limites_qualidade: {
    score_minimo: 70,
    tamanho_minimo: 50,
    tamanho_maximo: 10000
  }
};

// ================================================================================
// 🔧 FUNÇÃO: NORMALIZAR ENTRADA (NOVA - CRÍTICA PARA ORQUESTRADOR)
// ================================================================================

export function normalizarEntrada(body) {
  console.log('[UTILS] Normalizando entrada de dados...');
  
  let formData, tipo;

  if (body?.formData && body?.tipo) {
    formData = body.formData;
    tipo = body.tipo;
  } else if (body?.tipos || body?.observacoes) {
    formData = body;
    tipo = 'orcamento';
  } else {
    throw new Error("Formato de dados de entrada inválido");
  }

  // Normalizar tipos
  if (!formData.tipos || !Array.isArray(formData.tipos) || formData.tipos.length === 0) {
    formData.tipos = ['Aéreo Nacional'];
  }

  // Garantir campos obrigatórios
  formData.observacoes = formData.observacoes || '';
  formData.textoColado = formData.textoColado || '';
  formData.destino = formData.destino || '';

  console.log(`[UTILS] ✅ Entrada normalizada: tipo=${tipo}, tipos=${formData.tipos?.length}`);
  
  return { formData, tipo };
}

// ================================================================================
// 📊 FUNÇÃO: CALCULAR MÉTRICAS COMPLETAS
// ================================================================================

export function calcularMetricas(resultado, startTime, estrategia) {
  console.log('[UTILS] Calculando métricas do processamento...');
  
  const tempoTotal = Date.now() - startTime;
  const modelo = resultado.modelo_usado || 'desconhecido';
  
  let custoBRL = 0;
  let economiaUSD = 0;
  let detalhesUso = {};
  
  if (resultado.usage) {
    const custos = calcularCustos(resultado.usage, modelo);
    custoBRL = custos.custoBRL;
    economiaUSD = custos.economiaUSD;
    detalhesUso = custos;
  }

  const metricas = {
    processamento: {
      tempo_total_ms: tempoTotal,
      modelo_usado: modelo,
      estrategia: estrategia,
      timestamp: new Date().toISOString(),
      sucesso: !!resultado.content
    },
    tokens: {
      input: resultado.usage?.input_tokens || resultado.usage?.prompt_tokens || 0,
      output: resultado.usage?.output_tokens || resultado.usage?.completion_tokens || 0,
      total: (resultado.usage?.input_tokens || resultado.usage?.prompt_tokens || 0) + 
             (resultado.usage?.output_tokens || resultado.usage?.completion_tokens || 0)
    },
    custo: {
      valor_usd: parseFloat((custoBRL / METRICAS_CONFIG.usd_to_brl).toFixed(6)),
      valor_brl: parseFloat(custoBRL.toFixed(4)),
      economia_usd: parseFloat(economiaUSD.toFixed(4)),
      economia_percentual: economiaUSD > 0 ? 
        ((economiaUSD / (economiaUSD + (custoBRL / METRICAS_CONFIG.usd_to_brl))) * 100).toFixed(1) + '%' : '0%'
    },
    performance: {
      tempo_processamento_ms: tempoTotal,
      eficiencia: categorizar_eficiencia(tempoTotal),
      tokens_por_segundo: tempoTotal > 0 ? 
        Math.round(((resultado.usage?.output_tokens || 0) / tempoTotal) * 1000) : 0
    },
    qualidade: resultado.content ? calcularScoreQualidade(resultado.content) : 0
  };
  
  console.log('[UTILS] ✅ Métricas calculadas:', {
    tempo: `${tempoTotal}ms`,
    modelo: modelo,
    custo: `R$ ${custoBRL.toFixed(4)}`,
    tokens: metricas.tokens.total,
    qualidade: metricas.qualidade
  });
  
  return metricas;
}

// ================================================================================
// 💰 FUNÇÃO: CALCULAR CUSTOS DE IA
// ================================================================================

function calcularCustos(usage, modelo) {
  const precos = METRICAS_CONFIG.precos_modelos[modelo] || METRICAS_CONFIG.precos_modelos['gpt-4o-mini'];
  
  const inputTokens = usage.input_tokens || usage.prompt_tokens || 0;
  const outputTokens = usage.output_tokens || usage.completion_tokens || 0;
  
  const custoUSD = (inputTokens / 1000 * precos.input) + (outputTokens / 1000 * precos.output);
  const custoBRL = custoUSD * METRICAS_CONFIG.usd_to_brl;
  
  // Economia comparado com GPT-4o
  const precosGPT4o = METRICAS_CONFIG.precos_modelos['gpt-4o'];
  const custoGPT4oUSD = (inputTokens / 1000 * precosGPT4o.input) + (outputTokens / 1000 * precosGPT4o.output);
  const economiaUSD = custoGPT4oUSD - custoUSD;
  
  return {
    custoBRL,
    custoUSD,
    economiaUSD,
    custoGPT4oUSD,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens
  };
}

function categorizar_eficiencia(tempo) {
  if (tempo < 3000) return 'excelente';
  if (tempo < 8000) return 'boa';
  if (tempo < 15000) return 'aceitavel';
  return 'lenta';
}

// ================================================================================
// ✅ FUNÇÃO: VALIDAR RESPOSTA DA IA
// ================================================================================

export function validarRespostaIA(conteudo, analise = null) {
  const validacao = {
    isValida: true,
    problemas: [],
    sugestoes: [],
    score: 100,
    detalhes: {}
  };
  
  if (!conteudo || typeof conteudo !== 'string') {
    validacao.isValida = false;
    validacao.problemas.push('Conteúdo inválido ou vazio');
    validacao.score = 0;
    return validacao;
  }
  
  // ================================================================================
  // 🔍 VERIFICAÇÕES DE QUALIDADE
  // ================================================================================
  
  // Verificar placeholders não substituídos
  const placeholders = conteudo.match(/\[[A-Z_]+\]/g);
  if (placeholders && placeholders.length > 0) {
    validacao.problemas.push(`Placeholders não substituídos: ${placeholders.join(', ')}`);
    validacao.score -= 30;
    validacao.sugestoes.push('Revisar substituição de variáveis no template');
  }
  
  // Verificar tamanho
  if (conteudo.trim().length < METRICAS_CONFIG.limites_qualidade.tamanho_minimo) {
    validacao.problemas.push('Resposta muito curta, possivelmente incompleta');
    validacao.score -= 40;
    validacao.sugestoes.push('Verificar se o prompt está completo');
  }
  
  if (conteudo.length > METRICAS_CONFIG.limites_qualidade.tamanho_maximo) {
    validacao.problemas.push('Resposta muito longa, pode estar truncada');
    validacao.score -= 20;
    validacao.sugestoes.push('Considerar otimizar o prompt');
  }
  
  // Verificar elementos básicos esperados
  const temCompanhia = /\*(.*?)\*/.test(conteudo);
  const temValor = /R\$\s*[\d.,]+/.test(conteudo);
  const temHorario = /\d{1,2}:\d{2}/.test(conteudo);
  const temData = /\d{1,2}\/\d{1,2}/.test(conteudo);
  
  validacao.detalhes = {
    tem_companhia: temCompanhia,
    tem_valor: temValor,
    tem_horario: temHorario,
    tem_data: temData,
    tamanho: conteudo.length,
    placeholders_encontrados: placeholders?.length || 0
  };
  
  // Penalizar por elementos faltando
  if (!temCompanhia) {
    validacao.problemas.push('Companhia aérea não identificada');
    validacao.score -= 15;
  }
  
  if (!temValor) {
    validacao.problemas.push('Valor em reais não encontrado');
    validacao.score -= 25;
  }
  
  if (!temHorario && analise?.tipos?.aereo) {
    validacao.problemas.push('Horários de voo não encontrados');
    validacao.score -= 20;
  }
  
  if (!temData && analise?.tipos?.aereo) {
    validacao.problemas.push('Datas de viagem não encontradas');
    validacao.score -= 20;
  }
  
  // Verificar formatação específica
  const formatacaoProblemas = verificarFormatacao(conteudo);
  validacao.problemas.push(...formatacaoProblemas.problemas);
  validacao.score -= formatacaoProblemas.penalidade;
  
  // Determinar se é válida
  validacao.isValida = validacao.score >= METRICAS_CONFIG.limites_qualidade.score_minimo;
  validacao.score = Math.max(0, validacao.score);
  
  console.log(`[UTILS] Validação: Score ${validacao.score}, Válida: ${validacao.isValida}`);
  
  return validacao;
}

function verificarFormatacao(conteudo) {
  const problemas = [];
  let penalidade = 0;
  
  // Verificar formatação de horários
  const horariosComEspaco = (conteudo.match(/\d{1,2}\s+:\s*\d{2}/g) || []).length;
  if (horariosComEspaco > 0) {
    problemas.push('Horários com espaçamento incorreto encontrados');
    penalidade += horariosComEspaco * 5;
  }
  
  // Verificar separador ida/volta
  if (conteudo.includes('volta') && !conteudo.includes('--')) {
    problemas.push('Separador ida/volta (--) ausente');
    penalidade += 10;
  }
  
  // Verificar parênteses duplos
  const parentesesDuplos = (conteudo.match(/\(\([^)]+\)\)/g) || []).length;
  if (parentesesDuplos > 0) {
    problemas.push('Parênteses duplos encontrados');
    penalidade += parentesesDuplos * 3;
  }
  
  return { problemas, penalidade };
}

function calcularScoreQualidade(conteudo, analise = null) {
  let score = 100;
  
  // Elementos básicos
  if (!/\*(.*?)\*/.test(conteudo)) score -= 15; // Sem companhia destacada
  if (!/R\$\s*[\d.,]+/.test(conteudo)) score -= 25; // Sem valor
  if (!/\d{1,2}:\d{2}/.test(conteudo)) score -= 20; // Sem horário
  if (!/\d{1,2}\/\d{1,2}/.test(conteudo)) score -= 20; // Sem data
  
  // Formatação
  const horariosComEspaco = (conteudo.match(/\d{1,2}\s+:\s*\d{2}/g) || []).length;
  score -= horariosComEspaco * 5;
  
  const parentesesDuplos = (conteudo.match(/\(\([^)]+\)\)/g) || []).length;
  score -= parentesesDuplos * 3;
  
  // Bonificações
  if (conteudo.includes('--') && conteudo.includes('volta')) score += 10;
  if (conteudo.match(/\*[^*]+\*/)) score += 5;
  if (conteudo.includes('💰')) score += 5;
  if (conteudo.includes('✈️')) score += 3;
  if (conteudo.includes('✅')) score += 3;
  
  return Math.max(0, Math.min(100, score));
}

// ================================================================================
// 📊 FUNÇÃO: EXTRAIR INFORMAÇÕES ESTRUTURADAS
// ================================================================================

export function extrairInformacoes(conteudo) {
  console.log('[UTILS] Extraindo informações estruturadas...');
  
  const informacoes = {
    companhias: extrairCompanhias(conteudo),
    valores: extrairValores(conteudo),
    horarios: extrairHorarios(conteudo),
    datas: extrairDatas(conteudo),
    destinos: extrairDestinos(conteudo),
    aeroportos: extrairAeroportos(conteudo),
    links: extrairLinks(conteudo),
    estatisticas: {
      tamanho_caracteres: conteudo.length,
      tamanho_palavras: conteudo.split(/\s+/).length,
      linhas: conteudo.split('\n').length,
      tem_emojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(conteudo)
    }
  };
  
  console.log('[UTILS] ✅ Informações extraídas:', {
    companhias: informacoes.companhias.length,
    valores: informacoes.valores.length,
    horarios: informacoes.horarios.length,
    datas: informacoes.datas.length
  });
  
  return informacoes;
}

function extrairCompanhias(conteudo) {
  const patterns = [
    /\*(.*?(?:gol|azul|latam|tap|copa|american|lufthansa).*?)\*/gi,
    /(?:gol|azul|latam|tap|copa|american|lufthansa)[^\n]*/gi
  ];
  
  const companhias = new Set();
  patterns.forEach(pattern => {
    const matches = conteudo.match(pattern) || [];
    matches.forEach(match => companhias.add(match.trim()));
  });
  
  return Array.from(companhias);
}

function extrairValores(conteudo) {
  const matches = conteudo.match(/R\$\s*[\d.,]+/g) || [];
  return [...new Set(matches)];
}

function extrairHorarios(conteudo) {
  const matches = conteudo.match(/\d{1,2}:\d{2}/g) || [];
  return [...new Set(matches)];
}

function extrairDatas(conteudo) {
  const matches = conteudo.match(/\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/g) || [];
  return [...new Set(matches)];
}

function extrairDestinos(conteudo) {
  const patterns = [
    /(?:✈|→)\s*([A-Z][a-z\s]+)/g,
    /(?:para|destino|cidade)\s*:?\s*([A-Z][a-z\s]+)/gi
  ];
  
  const destinos = new Set();
  patterns.forEach(pattern => {
    const matches = [...conteudo.matchAll(pattern)];
    matches.forEach(match => destinos.add(match[1].trim()));
  });
  
  return Array.from(destinos);
}

function extrairAeroportos(conteudo) {
  const codigos = ['CGH', 'GRU', 'VCP', 'SDU', 'GIG', 'BSB', 'CWB', 'POA', 'FOR', 'REC', 'SSA'];
  const encontrados = codigos.filter(codigo => 
    conteudo.toUpperCase().includes(codigo)
  );
  
  return encontrados;
}

function extrairLinks(conteudo) {
  const matches = conteudo.match(/https?:\/\/[^\s]+/g) || [];
  return matches;
}

// ================================================================================
// 📈 FUNÇÃO: GERAR RELATÓRIO DE PERFORMANCE
// ================================================================================

export function gerarRelatorioPerformance(metricas, informacoes) {
  console.log('[UTILS] Gerando relatório de performance...');
  
  const relatorio = {
    resumo: {
      tempo_processamento_ms: metricas.processamento.tempo_total_ms,
      modelo_usado: metricas.processamento.modelo_usado,
      eficiencia: metricas.performance.eficiencia,
      score_qualidade: metricas.qualidade,
      sucesso: metricas.processamento.sucesso
    },
    tokens: {
      total_usado: metricas.tokens.total,
      input: metricas.tokens.input,
      output: metricas.tokens.output,
      tokens_por_segundo: metricas.performance.tokens_por_segundo
    },
    custos: {
      valor_brl: metricas.custo.valor_brl,
      valor_usd: metricas.custo.valor_usd,
      economia_percentual: metricas.custo.economia_percentual
    },
    conteudo: {
      companhias_detectadas: informacoes.companhias.length,
      valores_encontrados: informacoes.valores.length,
      horarios_encontrados: informacoes.horarios.length,
      datas_encontradas: informacoes.datas.length,
      tamanho_final: informacoes.estatisticas.tamanho_caracteres
    },
    qualidade: {
      score: metricas.qualidade,
      categoria: metricas.qualidade >= 90 ? 'excelente' : 
                 metricas.qualidade >= 80 ? 'boa' : 
                 metricas.qualidade >= 70 ? 'aceitavel' : 'baixa',
      tem_elementos_basicos: informacoes.companhias.length > 0 && informacoes.valores.length > 0
    }
  };
  
  console.log('[UTILS] 📈 Relatório de performance gerado');
  
  return relatorio;
}

// ================================================================================
// 🛠️ FUNÇÃO: SANITIZAR ENTRADA
// ================================================================================

export function sanitizarEntrada(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }
  
  console.log(`[UTILS] Sanitizando entrada: ${texto.length} caracteres`);
  
  // Remover caracteres perigosos e maliciosos
  let sanitizado = texto
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/data:/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
  
  // Limitar tamanho
  const limite = METRICAS_CONFIG.limites_qualidade.tamanho_maximo;
  if (sanitizado.length > limite) {
    sanitizado = sanitizado.substring(0, limite) + '...';
    console.log(`[UTILS] ⚠️ Entrada truncada: ${texto.length} → ${sanitizado.length} caracteres`);
  }
  
  // Normalizar espaçamentos
  sanitizado = sanitizado
    .replace(/\s+/g, ' ') // Múltiplos espaços para um
    .replace(/\n\s*\n/g, '\n') // Múltiplas quebras para uma
    .trim();
  
  console.log(`[UTILS] ✅ Entrada sanitizada: ${sanitizado.length} caracteres`);
  
  return sanitizado;
}

// ================================================================================
// 📊 FUNÇÃO: ESTATÍSTICAS DE USO
// ================================================================================

export function calcularEstatisticasUso(historico) {
  console.log(`[UTILS] Calculando estatísticas para ${historico?.length || 0} registros`);
  
  if (!Array.isArray(historico) || historico.length === 0) {
    return {
      total_processamentos: 0,
      tempo_medio_ms: 0,
      custo_total_brl: 0,
      custo_medio_brl: 0,
      modelo_mais_usado: 'N/A',
      score_medio_qualidade: 0,
      taxa_sucesso: 0,
      tokens_total: 0,
      tokens_medio: 0
    };
  }
  
  const stats = {
    total_processamentos: historico.length,
    tempo_medio_ms: Math.round(
      historico.reduce((acc, item) => acc + (item.tempo_ms || 0), 0) / historico.length
    ),
    custo_total_brl: parseFloat(
      historico.reduce((acc, item) => acc + (item.custo_brl || 0), 0).toFixed(4)
    ),
    score_medio_qualidade: Math.round(
      historico.reduce((acc, item) => acc + (item.score || 0), 0) / historico.length
    ),
    tokens_total: historico.reduce((acc, item) => acc + (item.tokens || 0), 0),
    sucessos: historico.filter(item => item.sucesso).length
  };
  
  // Cálculos derivados
  stats.custo_medio_brl = parseFloat((stats.custo_total_brl / historico.length).toFixed(6));
  stats.tokens_medio = Math.round(stats.tokens_total / historico.length);
  stats.taxa_sucesso = Math.round((stats.sucessos / historico.length) * 100);
  
  // Modelo mais usado
  const modelos = {};
  historico.forEach(item => {
    const modelo = item.modelo || 'desconhecido';
    modelos[modelo] = (modelos[modelo] || 0) + 1;
  });
  
  stats.modelo_mais_usado = Object.keys(modelos).reduce((a, b) => 
    modelos[a] > modelos[b] ? a : b, 'N/A'
  );
  
  // Estatísticas por período
  const agora = new Date();
  const ultimas24h = historico.filter(item => {
    const itemDate = new Date(item.timestamp);
    return (agora - itemDate) < 24 * 60 * 60 * 1000;
  });
  
  stats.ultimas_24h = {
    processamentos: ultimas24h.length,
    custo_brl: parseFloat(
      ultimas24h.reduce((acc, item) => acc + (item.custo_brl || 0), 0).toFixed(4)
    )
  };
  
  console.log('[UTILS] ✅ Estatísticas calculadas:', {
    total: stats.total_processamentos,
    modelo_principal: stats.modelo_mais_usado,
    taxa_sucesso: `${stats.taxa_sucesso}%`
  });
  
  return stats;
}

// ================================================================================
// 🔧 FUNÇÃO: LIMPAR RECURSOS
// ================================================================================

export function limparRecursos() {
  console.log('[UTILS] 🧹 Limpando recursos...');
  
  // Limpar caches se houver
  if (typeof global !== 'undefined' && global.cache) {
    global.cache.clear();
  }
  
  // Forçar garbage collection se disponível
  if (typeof global !== 'undefined' && global.gc) {
    global.gc();
  }
  
  console.log('[UTILS] ✅ Recursos limpos');
}

// ================================================================================
// 📊 FUNÇÃO: STATUS DO SISTEMA
// ================================================================================

export function obterStatusSistema() {
  const status = {
    timestamp: new Date().toISOString(),
    sistema: {
      node_version: process.version,
      plataforma: process.platform,
      uptime_ms: Math.round(process.uptime() * 1000),
      pid: process.pid
    },
    memoria: process.memoryUsage(),
    apis_configuradas: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      openai_key_length: process.env.OPENAI_API_KEY?.length || 0,
      anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0
    },
    configuracao: {
      environment: process.env.NODE_ENV || 'development',
      version: '8.0-modular-es6-normalizada'
    }
  };
  
  // Adicionar informações de saúde
  status.saude = {
    memoria_livre_mb: Math.round((status.memoria.heapTotal - status.memoria.heapUsed) / 1024 / 1024),
    uptime_horas: Math.round(status.sistema.uptime_ms / 1000 / 60 / 60),
    apis_ok: status.apis_configuradas.openai && status.apis_configuradas.anthropic
  };
  
  return status;
}

// ================================================================================
// 📋 FUNÇÃO: GERAR LOG ESTRUTURADO
// ================================================================================

export function gerarLogEstruturado(nivel, componente, mensagem, dados = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    nivel: nivel.toUpperCase(),
    componente: componente,
    mensagem: mensagem,
    dados: dados,
    processo_id: process.pid
  };
  
  // Console colorido baseado no nível
  const cores = {
    INFO: '\x1b[36m',    // Cyan
    WARN: '\x1b[33m',    // Yellow  
    ERROR: '\x1b[31m',   // Red
    DEBUG: '\x1b[90m',   // Gray
    SUCCESS: '\x1b[32m'  // Green
  };
  
  const cor = cores[nivel.toUpperCase()] || '\x1b[0m';
  const reset = '\x1b[0m';
  
  console.log(`${cor}[${logEntry.timestamp}] ${logEntry.nivel} [${componente}] ${mensagem}${reset}`);
  
  if (Object.keys(dados).length > 0) {
    console.log(`${cor}  Dados:`, dados, reset);
  }
  
  return logEntry;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 ÚNICA E COMPLETA - utils.js v8.0 CORRIGIDA
// ================================================================================
// LOCALIZAÇÃO: Final do arquivo api/modules/utils.js
// SUBSTITUA toda a seção de exportação no final do arquivo por esta:

// Log de inicialização
console.log('✅ [UTILS] Utils v8.0 carregado:');
console.log('🔧 [UTILS] Normalização de entrada (NOVA)');
console.log('📊 [UTILS] Cálculo de métricas e custos');
console.log('✅ [UTILS] Validação de resposta IA');
console.log('📈 [UTILS] Extração de informações estruturadas');
console.log('📋 [UTILS] Relatórios de performance');
console.log('🛠️ [UTILS] Sanitização de entrada');
console.log('📊 [UTILS] Estatísticas de uso');
console.log('🔧 [UTILS] Status do sistema');
console.log('📋 [UTILS] Sistema de logs estruturados');
console.log('🚨 [UTILS] EXPORTAÇÃO ES6 CORRIGIDA - Compatível com orquestrador v8.0');

// EXPORTAÇÃO INDIVIDUAL COMPLETA
export {
  normalizarEntrada,
  calcularMetricas,
  validarRespostaIA,
  extrairInformacoes,
  gerarRelatorioPerformance,
  sanitizarEntrada,
  calcularEstatisticasUso,
  limparRecursos,
  obterStatusSistema,
  gerarLogEstruturado
};

// EXPORTAÇÃO PADRÃO COMPLETA
export default {
  normalizarEntrada,
  calcularMetricas,
  validarRespostaIA,
  extrairInformacoes,
  gerarRelatorioPerformance,
  sanitizarEntrada,
  calcularEstatisticasUso,
  limparRecursos,
  obterStatusSistema,
  gerarLogEstruturado
};

console.log('🚀 [UTILS] Sistema de Utilitários v8.0 - COMPLETO, CORRIGIDO E FUNCIONAL!');
