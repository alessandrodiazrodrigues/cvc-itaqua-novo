// 🚀 api/ai.js - SISTEMA BACKEND CVC ITAQUA v7.2 - INTEGRAÇÃO COMPLETA
// Integração total de todos os módulos especializados
// Sistema modular avançado + Templates profissionais + IA dual

// ================================================================================
// 📥 IMPORTS DOS MÓDULOS ESPECIALIZADOS
// ================================================================================

import { aplicarTemplateCompleto, detectarLayoutOrcamento, TEMPLATES_MANUAIS } from './modules/templates.js';
import { chamarIASegura, selecionarModelo, verificarDisponibilidadeAPIs } from './modules/ia-client.js';
import { analisarTextoCompleto, detectarComplexidade, avaliarTipoOrcamento } from './modules/analysis.js';
import { processarRespostaFinal, aplicarFormatacaoFinal, validarOrcamentoFinal } from './modules/processing.js';
import { construirPromptOtimizado, construirPromptRanking, construirPromptDicas } from './modules/prompts.js';
import { calcularMetricas, validarRespostaIA, formatarTimestamp } from './modules/utils.js';
import { PRECOS_MODELOS, RESPONSE_CONFIG, LIMITS } from './modules/config.js';

console.log("🚀 CVC ITAQUA API v7.2 - SISTEMA MODULAR COMPLETO");

export default async function handler(req, res) {
  const inicioProcessamento = Date.now();
  
  console.log("📊 Nova requisição - Timestamp:", formatarTimestamp());
  console.log("📊 Método:", req.method, "| Headers:", Object.keys(req.headers));

  // ================================================================================
  // 🔧 CONFIGURAÇÃO CORS E VALIDAÇÕES BÁSICAS
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.2');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.',
      versao: '7.2',
      timestamp: formatarTimestamp()
    });
  }

  try {
    // ================================================================================
    // 🔍 VALIDAÇÃO E NORMALIZAÇÃO DE DADOS
    // ================================================================================
    
    console.log("📥 Processando dados de entrada...");
    console.log("- Body size:", JSON.stringify(req.body).length, "bytes");
    
    let formData, tipo, versao;
    
    // Suporte a múltiplos formatos (compatibilidade total)
    if (req.body.formData && req.body.tipo) {
      // Formato v7.x: { formData: {...}, tipo: 'orcamento', versao: '7.2' }
      formData = req.body.formData;
      tipo = req.body.tipo;
      versao = req.body.versao || '7.2';
      console.log("📍 Formato v7.x detectado");
    } else if (req.body.tipos || req.body.prompt || req.body.observacoes) {
      // Formato legado: dados diretos no body
      formData = req.body;
      tipo = determinarTipoLegado(formData);
      versao = 'legado-convertido';
      console.log("📍 Formato legado convertido para v7.2");
    } else {
      throw new Error("Formato de dados não reconhecido. Verifique a estrutura da requisição.");
    }

    // Normalizar tipos de orçamento
    if (formData.tipos) {
      formData.tipos = Array.isArray(formData.tipos) ? formData.tipos : [formData.tipos];
    } else if (formData.tipo) {
      formData.tipos = [formData.tipo];
    } else {
      formData.tipos = ['Aéreo Nacional']; // Padrão
    }

    // ================================================================================
    // 🔍 VALIDAÇÃO DE LIMITES E SEGURANÇA
    // ================================================================================
    
    const validacao = validarEntrada(formData);
    if (!validacao.valido) {
      throw new Error(`Dados inválidos: ${validacao.erros.join(', ')}`);
    }

    console.log("✅ Dados validados e normalizados:");
    console.log(`- Tipo operação: ${tipo}`);
    console.log(`- Tipos orçamento: ${formData.tipos.join(', ')}`);
    console.log(`- Destino: ${formData.destino || 'N/A'}`);
    console.log(`- Tem imagem: ${!!formData.temImagem}`);

    // ================================================================================
    // 🎯 PROCESSAMENTO BASEADO NO TIPO
    // ================================================================================
    
    let resultado;
    let metricas;
    
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamentoCompleto(formData, inicioProcessamento);
        break;
      case 'ranking':
        resultado = await processarRankingCompleto(formData, inicioProcessamento);
        break;
      case 'dicas':
        resultado = await processarDicasCompleto(formData, inicioProcessamento);
        break;
      case 'analise':
        resultado = await processarAnaliseCompleto(formData, inicioProcessamento);
        break;
      default:
        throw new Error(`Tipo de operação não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL COM MÉTRICAS
    // ================================================================================
    
    const tempoTotal = Date.now() - inicioProcessamento;
    
    console.log("✅ Processamento concluído com sucesso");
    console.log(`⏱️ Tempo total: ${tempoTotal}ms`);
    
    const respostaFinal = {
      success: true,
      result: resultado.conteudo,
      versao: '7.2',
      timestamp: formatarTimestamp(),
      metricas: resultado.metricas,
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        temImagem: !!formData.temImagem,
        tempoProcessamento: `${tempoTotal}ms`,
        layoutDetectado: resultado.layoutDetectado,
        modeloUsado: resultado.modeloUsado,
        formatoEntrada: versao
      }
    };

    return res.status(200).json(respostaFinal);

  } catch (error) {
    // ================================================================================
    // ❌ TRATAMENTO DE ERROS AVANÇADO
    // ================================================================================
    
    const tempoTotal = Date.now() - inicioProcessamento;
    
    console.error("❌ Erro no processamento:", error);
    console.error("📚 Stack trace:", error.stack?.split('\n').slice(0, 3).join('\n'));
    
    const tipoErro = classificarErro(error);
    const statusCode = obterStatusCode(tipoErro);
    
    return res.status(statusCode).json({
      success: false,
      error: error.message,
      tipoErro: tipoErro,
      versao: '7.2',
      timestamp: formatarTimestamp(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        bodyKeys: req.body ? Object.keys(req.body) : null,
        errorCode: error.code || 'UNKNOWN'
      }
    });
  }
}

// ================================================================================
// 🎯 PROCESSAMENTO COMPLETO DE ORÇAMENTOS
// ================================================================================

async function processarOrcamentoCompleto(formData, inicioProcessamento) {
  console.log("💰 Iniciando processamento completo de orçamento...");
  
  try {
    // ETAPA 1: Análise inteligente com módulo especializado
    console.log("🔍 ETAPA 1: Análise inteligente...");
    const analise = analisarTextoCompleto(formData);
    const complexidade = detectarComplexidade(formData, analise);
    const tipoAvaliado = avaliarTipoOrcamento(formData.tipos, analise);
    
    console.log(`📊 Análise concluída - Complexidade: ${complexidade}, Tipo: ${tipoAvaliado}`);
    
    // ETAPA 2: Aplicação de template avançado
    console.log("📋 ETAPA 2: Aplicando template avançado...");
    const layoutDetectado = detectarLayoutOrcamento(formData);
    const promptCompleto = aplicarTemplateCompleto(formData, analise);
    
    console.log(`📋 Template aplicado - Layout: ${layoutDetectado}`);
    
    // ETAPA 3: Seleção inteligente de modelo
    console.log("🤖 ETAPA 3: Seleção de modelo IA...");
    const modeloConfig = selecionarModelo(formData.temImagem);
    console.log(`🤖 Modelo selecionado: ${modeloConfig.modelo} (${modeloConfig.estrategia})`);
    
    // ETAPA 4: Chamada segura para IA
    console.log("🧠 ETAPA 4: Processamento com IA...");
    const respostaIA = await chamarIASegura(
      promptCompleto, 
      formData.temImagem, 
      formData.arquivo, 
      modeloConfig.modelo,
      modeloConfig.fallback
    );
    
    console.log("✅ IA processou com sucesso");
    
    // ETAPA 5: Processamento final avançado
    console.log("🔧 ETAPA 5: Processamento final...");
    const conteudoProcessado = processarRespostaFinal(respostaIA.content, analise, formData);
    const conteudoFormatado = aplicarFormatacaoFinal(conteudoProcessado, layoutDetectado);
    
    // ETAPA 6: Validação final
    console.log("✅ ETAPA 6: Validação final...");
    const validacao = validarOrcamentoFinal(conteudoFormatado, formData);
    
    if (!validacao.valido) {
      console.warn("⚠️ Validação encontrou problemas:", validacao.problemas);
    }
    
    // ETAPA 7: Cálculo de métricas
    console.log("📊 ETAPA 7: Calculando métricas...");
    const metricas = calcularMetricas(
      inicioProcessamento,
      respostaIA.usage,
      respostaIA.modelo_usado,
      promptCompleto,
      conteudoFormatado
    );
    
    // ETAPA 8: Registro de custos
    console.log("💰 ETAPA 8: Registrando custos...");
    await registrarCustosAvancado(metricas, formData, layoutDetectado);
    
    console.log("🎉 Orçamento processado com sucesso!");
    
    return {
      conteudo: conteudoFormatado,
      metricas: metricas,
      layoutDetectado: layoutDetectado,
      modeloUsado: respostaIA.modelo_usado,
      validacao: validacao
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento de orçamento:", error);
    throw new Error(`Falha no processamento do orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🏨 PROCESSAMENTO COMPLETO DE RANKING
// ================================================================================

async function processarRankingCompleto(formData, inicioProcessamento) {
  console.log("🏨 Processando ranking de hotéis...");
  
  try {
    const destino = formData.destino || extrairDestino(formData.observacoes) || 'destino solicitado';
    
    // Usar módulo de prompts especializado
    const prompt = construirPromptRanking(destino, formData);
    
    // Modelo otimizado para rankings
    const modeloConfig = { modelo: 'gpt-4o-mini', fallback: 'gpt-4o' };
    
    const respostaIA = await chamarIASegura(prompt, false, null, modeloConfig.modelo, modeloConfig.fallback);
    
    const metricas = calcularMetricas(inicioProcessamento, respostaIA.usage, respostaIA.modelo_usado, prompt, respostaIA.content);
    
    await registrarCustosAvancado(metricas, formData, 'ranking');
    
    return {
      conteudo: respostaIA.content,
      metricas: metricas,
      layoutDetectado: 'ranking',
      modeloUsado: respostaIA.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento de ranking:", error);
    throw new Error(`Falha na geração do ranking: ${error.message}`);
  }
}

// ================================================================================
// 💡 PROCESSAMENTO COMPLETO DE DICAS
// ================================================================================

async function processarDicasCompleto(formData, inicioProcessamento) {
  console.log("💡 Processando dicas de destino...");
  
  try {
    const destino = formData.destino || extrairDestino(formData.observacoes) || 'destino solicitado';
    
    // Usar módulo de prompts especializado
    const prompt = construirPromptDicas(destino, formData);
    
    // Modelo otimizado para dicas
    const modeloConfig = { modelo: 'gpt-4o-mini', fallback: 'gpt-4o' };
    
    const respostaIA = await chamarIASegura(prompt, false, null, modeloConfig.modelo, modeloConfig.fallback);
    
    const metricas = calcularMetricas(inicioProcessamento, respostaIA.usage, respostaIA.modelo_usado, prompt, respostaIA.content);
    
    await registrarCustosAvancado(metricas, formData, 'dicas');
    
    return {
      conteudo: respostaIA.content,
      metricas: metricas,
      layoutDetectado: 'dicas',
      modeloUsado: respostaIA.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento de dicas:", error);
    throw new Error(`Falha na geração das dicas: ${error.message}`);
  }
}

// ================================================================================
// 📊 PROCESSAMENTO COMPLETO DE ANÁLISE
// ================================================================================

async function processarAnaliseCompleto(formData, inicioProcessamento) {
  console.log("📊 Processando análise de documento...");
  
  try {
    const prompt = `Analise este documento e extraia as informações principais:

1. 📊 Principais métricas e números
2. 🎯 Pontos-chave identificados  
3. 📈 Tendências ou padrões
4. 💡 Recomendações baseadas nos dados
5. 📋 Resumo executivo

Documento: ${formData.nomeArquivo || 'Arquivo enviado'}
Seja objetivo e organize as informações de forma clara.`;

    // Usar modelo mais potente para análise
    const modeloConfig = { modelo: 'gpt-4o', fallback: 'gpt-4o-mini' };
    
    const respostaIA = await chamarIASegura(
      prompt, 
      formData.temImagem, 
      formData.arquivo, 
      modeloConfig.modelo, 
      modeloConfig.fallback
    );
    
    const metricas = calcularMetricas(inicioProcessamento, respostaIA.usage, respostaIA.modelo_usado, prompt, respostaIA.content);
    
    await registrarCustosAvancado(metricas, formData, 'analise');
    
    return {
      conteudo: respostaIA.content,
      metricas: metricas,
      layoutDetectado: 'analise',
      modeloUsado: respostaIA.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento de análise:", error);
    throw new Error(`Falha na análise do documento: ${error.message}`);
  }
}

// ================================================================================
// 🔧 FUNÇÕES DE SUPORTE E VALIDAÇÃO
// ================================================================================

function validarEntrada(formData) {
  const erros = [];
  
  // Validações básicas
  if (!formData.tipos || formData.tipos.length === 0) {
    erros.push('Pelo menos um tipo de orçamento deve ser selecionado');
  }
  
  // Validar limites de texto
  const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`;
  if (textoCompleto.length > LIMITS.MAX_TEXTO_LENGTH) {
    erros.push(`Texto muito longo. Máximo: ${LIMITS.MAX_TEXTO_LENGTH} caracteres`);
  }
  
  // Validar se tem conteúdo mínimo
  if (textoCompleto.trim().length < 10) {
    erros.push('Forneça informações sobre a viagem (mínimo 10 caracteres)');
  }
  
  return {
    valido: erros.length === 0,
    erros
  };
}

function determinarTipoLegado(formData) {
  if (formData.tipos && formData.tipos.length > 0) {
    return 'orcamento';
  } else if (formData.prompt?.includes('ranking') || formData.prompt?.includes('hotel')) {
    return 'ranking';
  } else if (formData.prompt?.includes('dica') || formData.prompt?.includes('destino')) {
    return 'dicas';
  } else if (formData.nomeArquivo || formData.arquivo) {
    return 'analise';
  }
  return 'orcamento';
}

function extrairDestino(texto) {
  if (!texto) return null;
  
  const cidades = {
    'maceió': 'Maceió',
    'recife': 'Recife', 
    'salvador': 'Salvador',
    'fortaleza': 'Fortaleza',
    'natal': 'Natal',
    'joão pessoa': 'João Pessoa',
    'porto alegre': 'Porto Alegre',
    'curitiba': 'Curitiba',
    'florianópolis': 'Florianópolis',
    'brasília': 'Brasília',
    'rio de janeiro': 'Rio de Janeiro',
    'belo horizonte': 'Belo Horizonte',
    'miami': 'Miami',
    'orlando': 'Orlando',
    'nova york': 'Nova York',
    'paris': 'Paris',
    'lisboa': 'Lisboa',
    'madrid': 'Madrid'
  };
  
  const textoLower = texto.toLowerCase();
  
  for (const [key, value] of Object.entries(cidades)) {
    if (textoLower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

// ================================================================================
// 💰 SISTEMA AVANÇADO DE REGISTRO DE CUSTOS
// ================================================================================

async function registrarCustosAvancado(metricas, formData, tipoOperacao) {
  try {
    console.log('💰 Registrando custos avançados...');
    
    const dadosCusto = {
      timestamp: formatarTimestamp(),
      destino: formData.destino || extrairDestino(formData.observacoes) || 'N/A',
      tipoOperacao: tipoOperacao,
      modeloUsado: metricas.modelo_usado,
      custoBRL: metricas.custo.brl,
      custoUSD: metricas.custo.usd,
      tokensTotal: metricas.tokens.total,
      tokensInput: metricas.tokens.input,
      tokensOutput: metricas.tokens.output,
      tempoProcessamento: metricas.performance.tempo_processamento_ms,
      eficiencia: metricas.performance.eficiencia,
      economiaPercent: metricas.economia.percentual,
      passageiros: `${formData.adultos || 2} adultos${formData.criancas > 0 ? ` + ${formData.criancas} crianças` : ''}`,
      versaoSistema: '7.2'
    };
    
    // URL do Google Apps Script para registro avançado
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqOxRJNJm_X4lmD1-4v4OZYRt7E5xh0mYaX1kgRv-fGfFTU4YZM7UWQm8YrWl1B4VQ/exec';
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'registrarCustoAvancado',
        dados: dadosCusto
      })
    });
    
    if (response.ok) {
      const resultado = await response.json();
      console.log('✅ Custos registrados na planilha:', resultado);
    } else {
      console.warn('⚠️ Falha ao registrar custos na planilha:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao registrar custos:', error);
    // Não interromper o fluxo principal por erro de log
  }
}

// ================================================================================
// 🔧 CLASSIFICAÇÃO E TRATAMENTO DE ERROS
// ================================================================================

function classificarErro(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('api key') || message.includes('unauthorized')) {
    return 'CONFIGURACAO';
  } else if (message.includes('rate limit') || message.includes('quota')) {
    return 'LIMITE_API';
  } else if (message.includes('timeout') || message.includes('network')) {
    return 'REDE';
  } else if (message.includes('parsing') || message.includes('json')) {
    return 'FORMATO';
  } else if (message.includes('validation') || message.includes('invalid')) {
    return 'VALIDACAO';
  } else {
    return 'INTERNO';
  }
}

function obterStatusCode(tipoErro) {
  const statusCodes = {
    'CONFIGURACAO': 500,
    'LIMITE_API': 429,
    'REDE': 503,
    'FORMATO': 422,
    'VALIDACAO': 400,
    'INTERNO': 500
  };
  
  return statusCodes[tipoErro] || 500;
}

// ================================================================================
// 🚀 INICIALIZAÇÃO E HEALTH CHECK
// ================================================================================

// Verificar disponibilidade das APIs na inicialização
const statusAPIs = verificarDisponibilidadeAPIs();

console.log("🚀 CVC ITAQUA API v7.2 - SISTEMA MODULAR COMPLETO INICIALIZADO");
console.log("✅ Módulos carregados:");
console.log(`📋 Templates: ${Object.keys(TEMPLATES_MANUAIS).length} layouts específicos`);
console.log(`🤖 IA: OpenAI (${statusAPIs.openai ? 'OK' : 'FALTA KEY'}) + Claude (${statusAPIs.anthropic ? 'OK' : 'FALTA KEY'})`);
console.log("🔧 Análise: Detecção automática de complexidade");
console.log("📊 Processamento: Formatação avançada + validação");
console.log("💰 Custos: Registro automático com métricas");
console.log("🎯 Performance: Otimização e fallbacks automáticos");

// Health check endpoint
export function healthCheck() {
  return {
    status: 'healthy',
    version: '7.2',
    timestamp: formatarTimestamp(),
    modules: {
      templates: Object.keys(TEMPLATES_MANUAIS).length,
      ia_client: 'loaded',
      analysis: 'loaded',
      processing: 'loaded',
      prompts: 'loaded',
      utils: 'loaded',
      config: 'loaded'
    },
    apis: statusAPIs,
    features: {
      templates_avancados: true,
      deteccao_automatica: true,
      ia_dual: true,
      processamento_completo: true,
      metricas_avancadas: true,
      registro_custos: true,
      validacao_qualidade: true,
      fallbacks_automaticos: true
    }
  };
}

console.log("🎉 SISTEMA TOTALMENTE INTEGRADO E OPERACIONAL!");
