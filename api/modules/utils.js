// ================================================================================
// 🔧 UTILS.JS - UTILITÁRIOS E MÉTRICAS
// ================================================================================
// Responsável por: Cálculos de métricas, validações, funções auxiliares
// ================================================================================

import { PRECOS_MODELOS, USD_TO_BRL } from './config.js';

// ================================================================================
// 📊 FUNÇÃO: CALCULAR MÉTRICAS COMPLETAS
// ================================================================================

export function calcularMetricas(resultado, startTime, estrategia) {
  console.log('[UTILS] Calculando métricas do processamento...');
  
  const tempoTotal = Date.now() - startTime;
  const modelo = resultado.modelo_usado || 'desconhecido';
  
  let custoBRL = 0;
  let economiaUSD = 0;
  
  if (resultado.usage) {
    const metricas = calcularCustos(resultado.usage, modelo);
    custoBRL = metricas.custoBRL;
    economiaUSD = metricas.economiaUSD;
  }

  const metricas = {
    processamento: {
      tempo_total_ms: tempoTotal,
      modelo_usado: modelo,
      estrategia: estrategia,
      timestamp: new Date().toISOString()
    },
    tokens: resultado.usage || {},
    custo: {
      valor_brl: parseFloat(custoBRL.toFixed(4)),
      economia_usd: parseFloat(economiaUSD.toFixed(4)),
      economia_percentual: economiaUSD > 0 ? 
        ((economiaUSD / (economiaUSD + (custoBRL / USD_TO_BRL))) * 100).toFixed(1) + '%' : '0%'
    },
    performance: {
      tempo_processamento_ms: tempoTotal,
      eficiencia: tempoTotal < 5000 ? 'excelente' : tempoTotal < 10000 ? 'boa' : 'lenta'
    }
  };
  
  console.log('[UTILS] ✅ Métricas calculadas:', {
    tempo: `${tempoTotal}ms`,
    modelo: modelo,
    custo: `R$ ${custoBRL.toFixed(4)}`
  });
  
  return metricas;
}

// ================================================================================
// 💰 FUNÇÃO: CALCULAR CUSTOS DE IA
// ================================================================================

function calcularCustos(usage, modelo) {
  const precos = PRECOS_MODELOS[modelo] || PRECOS_MODELOS['gpt-4o-mini'];
  
  const inputTokens = usage.input_tokens || usage.prompt_tokens || 0;
  const outputTokens = usage.output_tokens || usage.completion_tokens || 0;
  
  const custoUSD = (inputTokens / 1000 * precos.input) + (outputTokens / 1000 * precos.output);
  const custoBRL = custoUSD * USD_TO_BRL;
  
  // Economia comparado com GPT-4o
  const custoGPT4o = (inputTokens / 1000 * PRECOS_MODELOS['gpt-4o'].input) + 
                     (outputTokens / 1000 * PRECOS_MODELOS['gpt-4o'].output);
  const economiaUSD = custoGPT4o - custoUSD;
  
  return {
    custoBRL,
    economiaUSD,
    custoUSD,
    custoGPT4o
  };
}

// ================================================================================
// ✅ FUNÇÃO: VALIDAR RESPOSTA DA IA
// ================================================================================

export function validarRespostaIA(conteudo) {
  const validacao = {
    isValida: true,
    problemas: [],
    score: 100
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
  
  // Verificar se contém placeholders não substituídos
  const placeholders = conteudo.match(/\[[A-Z_]+\]/g);
  if (placeholders && placeholders.length > 0) {
    validacao.problemas.push(`Placeholders não substituídos encontrados: ${placeholders.join(', ')}`);
    validacao.score -= 30;
  }
  
  // Verificar se é muito curto (provavelmente erro)
  if (conteudo.trim().length < 50) {
    validacao.problemas.push('Resposta muito curta, possivelmente incompleta');
    validacao.score -= 40;
  }
  
  // Verificar se contém informações básicas esperadas
  const temCompanhia = /\*(.*?)\*/g.test(conteudo); // *Latam*
  const temHorario = /\d{2}:\d{2}/.test(conteudo);
  const temValor = /R\$[\s]*[\d.,]+/.test(conteudo);
  
  if (!temCompanhia && !temHorario && !temValor) {
    validacao.problemas.push('Resposta não contém informações básicas de viagem');
    validacao.score -= 50;
  }
  
  // Verificar formatação de horários
  const horariosComEspaco = conteudo.match(/\d{1,2}:\s+\d{2}/g);
  if (horariosComEspaco) {
    validacao.problemas.push('Horários com espaços extras detectados');
    validacao.score -= 10;
  }
  
  // Verificar parênteses duplos
  if (conteudo.includes('((') || conteudo.includes('))')) {
    validacao.problemas.push('Parênteses duplos encontrados');
    validacao.score -= 5;
  }
  
  validacao.isValida = validacao.score >= 70;
  
  return validacao;
}

// ================================================================================
// 🔧 FUNÇÃO: EXTRAIR INFORMAÇÕES BÁSICAS
// ================================================================================

export function extrairInformacoes(conteudo) {
  const info = {
    companhia: null,
    destinos: [],
    horarios: [],
    valores: [],
    passageiros: null
  };
  
  // Extrair companhia (texto entre asteriscos)
  const companhiaMatch = conteudo.match(/\*([^*]+)\*/);
  if (companhiaMatch) {
    info.companhia = companhiaMatch[1];
  }
  
  // Extrair horários
  info.horarios = conteudo.match(/\d{2}:\d{2}/g) || [];
  
  // Extrair valores monetários
  info.valores = conteudo.match(/R\$[\s]*[\d.,]+/g) || [];
  
  // Extrair destinos comuns
  const destinosComuns = ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Porto Alegre', 'Brasília', 'Recife', 'Fortaleza'];
  info.destinos = destinosComuns.filter(destino => 
    conteudo.toLowerCase().includes(destino.toLowerCase())
  );
  
  // Extrair quantidade de passageiros
  const passageirosMatch = conteudo.match(/(\d+)\s+adultos?/i);
  if (passageirosMatch) {
    info.passageiros = parseInt(passageirosMatch[1]);
  }
  
  return info;
}

// ================================================================================
// 📈 FUNÇÃO: GERAR RELATÓRIO DE PERFORMANCE
// ================================================================================

export function gerarRelatorioPerformance(metricas, validacao, informacoes) {
  const relatorio = {
    timestamp: new Date().toISOString(),
    performance: {
      tempo_ms: metricas.processamento.tempo_total_ms,
      eficiencia: metricas.performance.eficiencia,
      modelo_usado: metricas.processamento.modelo_usado
    },
    qualidade: {
      score: validacao.score,
      is_valida: validacao.isValida,
      problemas: validacao.problemas.length
    },
    conteudo: {
      tem_companhia: !!informacoes.companhia,
      quantidade_horarios: informacoes.horarios.length,
      quantidade_valores: informacoes.valores.length,
      quantidade_destinos: informacoes.destinos.length
    },
    custo: {
      valor_brl: metricas.custo.valor_brl,
      economia_percentual: metricas.custo.economia_percentual
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
  
  // Remover caracteres perigosos
  let sanitizado = texto
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript:
    .trim();
  
  // Limitar tamanho
  if (sanitizado.length > 10000) {
    sanitizado = sanitizado.substring(0, 10000) + '...';
    console.log('[UTILS] ⚠️ Entrada truncada por exceder limite de tamanho');
  }
  
  return sanitizado;
}

// ================================================================================
// 📊 FUNÇÃO: ESTATÍSTICAS DE USO
// ================================================================================

export function calcularEstatisticasUso(historico) {
  if (!Array.isArray(historico) || historico.length === 0) {
    return {
      total_processamentos: 0,
      tempo_medio_ms: 0,
      custo_total_brl: 0,
      modelo_mais_usado: 'N/A',
      score_medio_qualidade: 0
    };
  }
  
  const stats = {
    total_processamentos: historico.length,
    tempo_medio_ms: historico.reduce((acc, item) => acc + (item.tempo_ms || 0), 0) / historico.length,
    custo_total_brl: historico.reduce((acc, item) => acc + (item.custo_brl || 0), 0),
    score_medio_qualidade: historico.reduce((acc, item) => acc + (item.score || 0), 0) / historico.length
  };
  
  // Modelo mais usado
  const modelos = {};
  historico.forEach(item => {
    const modelo = item.modelo || 'desconhecido';
    modelos[modelo] = (modelos[modelo] || 0) + 1;
  });
  
  stats.modelo_mais_usado = Object.keys(modelos).reduce((a, b) => 
    modelos[a] > modelos[b] ? a : b, 'N/A'
  );
  
  return stats;
}

// ================================================================================
// 🔧 FUNÇÃO: DETECTAR TIPO DE ERRO
// ================================================================================

export function detectarTipoErro(erro) {
  const mensagem = erro.message || erro.toString();
  
  if (mensagem.includes('API key')) {
    return {
      tipo: 'AUTENTICACAO',
      descricao: 'Problema com chave de API',
      solucao: 'Verificar se as chaves estão configuradas corretamente no .env'
    };
  }
  
  if (mensagem.includes('rate limit') || mensagem.includes('429')) {
    return {
      tipo: 'RATE_LIMIT',
      descricao: 'Limite de taxa da API excedido',
      solucao: 'Aguardar alguns minutos antes de tentar novamente'
    };
  }
  
  if (mensagem.includes('timeout') || mensagem.includes('ECONNRESET')) {
    return {
      tipo: 'CONEXAO',
      descricao: 'Problema de conectividade',
      solucao: 'Verificar conexão com internet e tentar novamente'
    };
  }
  
  if (mensagem.includes('base64') || mensagem.includes('image')) {
    return {
      tipo: 'IMAGEM',
      descricao: 'Problema no processamento de imagem',
      solucao: 'Verificar se a imagem está em formato válido (JPG, PNG)'
    };
  }
  
  return {
    tipo: 'GENERICO',
    descricao: 'Erro não categorizado',
    solucao: 'Verificar logs para mais detalhes'
  };
}

// ================================================================================
// 📝 FUNÇÃO: FORMATAR LOGS
// ================================================================================

export function formatarLog(nivel, modulo, mensagem, dados = null) {
  const timestamp = new Date().toISOString();
  const emoji = {
    'ERROR': '💥',
    'WARN': '⚠️',
    'INFO': '✅',
    'DEBUG': '🔍'
  };
  
  let log = `${emoji[nivel] || '📝'} [${timestamp}] [${modulo}] ${mensagem}`;
  
  if (dados) {
    log += ` | Dados: ${JSON.stringify(dados)}`;
  }
  
  return log;
}

// ================================================================================
// 🎯 FUNÇÃO: CALCULAR SCORE DE QUALIDADE
// ================================================================================

export function calcularScoreQualidade(conteudo, analise) {
  let score = 100;
  
  // Penalizar placeholders não substituídos
  const placeholders = (conteudo.match(/\[[A-Z_]+\]/g) || []).length;
  score -= placeholders * 20;
  
  // Penalizar formatação incorreta
  const horariosComEspaco = (conteudo.match(/\d{1,2}:\s+\d{2}/g) || []).length;
  score -= horariosComEspaco * 5;
  
  const parentesesDuplos = (conteudo.match(/\(\([^)]+\)\)/g) || []).length;
  score -= parentesesDuplos * 3;
  
  // Bonificar boa formatação
  if (conteudo.includes('--') && analise.tipoViagem === 'ida_volta') {
    score += 10; // Separador ida/volta correto
  }
  
  if (conteudo.match(/\*[^*]+\*/)) {
    score += 5; // Companhia em negrito
  }
  
  if (conteudo.includes('💰')) {
    score += 5; // Emoji de dinheiro
  }
  
  return Math.max(0, Math.min(100, score));
}

// ================================================================================
// 🔧 FUNÇÃO: LIMPAR CACHE (se necessário)
// ================================================================================

export function limparRecursos() {
  // Limpar variáveis temporárias se houver
  console.log('[UTILS] 🧹 Recursos limpos');
}

// ================================================================================
// 📊 FUNÇÃO: OBTER STATUS DO SISTEMA
// ================================================================================

export function obterStatusSistema() {
  const status = {
    timestamp: new Date().toISOString(),
    uptime_ms: process.uptime() * 1000,
    memoria: process.memoryUsage(),
    apis_configuradas: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY
    },
    version: '6.0-modular'
  };
  
  return status;
}

console.log('✅ [UTILS] Módulo de utilitários carregado');
console.log('📊 [UTILS] Funções disponíveis: métricas, validação, sanitização, logs');