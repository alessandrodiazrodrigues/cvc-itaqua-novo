// 🚀 api/ai.js - ORQUESTRADOR MODULAR PURO v7.7
// CORREÇÃO CRÍTICA: Apenas orquestra módulos especializados, NUNCA implementa
// RESOLVIDO: Compatibilidade ES6 + 3 argumentos para processarRespostaCompleta()

console.log("🚀 CVC ITAQUA API v7.7 - ORQUESTRADOR MODULAR PURO");

// ================================================================================
// 🎯 ORQUESTRADOR PRINCIPAL - APENAS IMPORTA E CHAMA MÓDULOS
// ================================================================================

export default async function handler(req, res) {
  const inicio = Date.now();
  
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CORS E VALIDAÇÃO BÁSICA
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.7-Modular');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.7-orquestrador'
    });
  }

  try {
    // ================================================================================
    // 🔧 NORMALIZAÇÃO DE DADOS (MÍNIMA - SEM LÓGICA DE NEGÓCIO)
    // ================================================================================
    
    let formData, tipo;
    
    if (req.body?.formData && req.body?.tipo) {
      formData = req.body.formData;
      tipo = req.body.tipo;
    } else if (req.body?.tipos || req.body?.observacoes) {
      formData = req.body;
      tipo = 'orcamento';
    } else {
      throw new Error("Formato de dados inválido");
    }

    // Normalização básica apenas
    if (!formData.tipos) {
      formData.tipos = formData.tipo ? [formData.tipo] : ['Aéreo Nacional'];
    }
    if (!Array.isArray(formData.tipos)) {
      formData.tipos = [formData.tipos];
    }

    console.log("🎯 Dados normalizados para módulos:", { 
      tipo, 
      tipos: formData.tipos, 
      destino: formData.destino,
      hasObservacoes: !!formData.observacoes,
      hasTextoColado: !!formData.textoColado
    });

    // ================================================================================
    // 🎯 CARREGAMENTO DINÂMICO DE MÓDULOS (CORREÇÃO ES6/COMMONJS)
    // ================================================================================
    
    console.log("📦 Carregando módulos especializados...");
    
    let moduloTemplates, moduloAnalysis, moduloProcessing, moduloPrompts, moduloIAClient, moduloUtils;
    
    try {
      // Importação dinâmica ES6 para todos os módulos
      [moduloTemplates, moduloAnalysis, moduloProcessing, moduloPrompts, moduloIAClient, moduloUtils] = await Promise.all([
        import('./modules/templates.js'),
        import('./modules/analysis.js'), 
        import('./modules/processing.js'),
        import('./modules/prompts.js'),
        import('./modules/ia-client.js'),
        import('./modules/utils.js')
      ]);
      
      console.log("✅ Todos os módulos carregados com sucesso");
      
    } catch (errorImport) {
      console.error("❌ ERRO CRÍTICO: Falha ao carregar módulos:", errorImport.message);
      throw new Error(`Sistema indisponível: módulos não carregados - ${errorImport.message}`);
    }

    // ================================================================================
    // 🎯 ORQUESTRAÇÃO POR TIPO (APENAS CHAMA MÓDULOS)
    // ================================================================================
    
    let resultado;
    
    switch (tipo) {
      case 'orcamento':
        resultado = await orquestrarOrcamento(formData, {
          templates: moduloTemplates,
          analysis: moduloAnalysis,
          processing: moduloProcessing,
          prompts: moduloPrompts,
          iaClient: moduloIAClient,
          utils: moduloUtils
        });
        break;
        
      case 'ranking':
        resultado = await orquestrarRanking(formData, {
          templates: moduloTemplates,
          utils: moduloUtils
        });
        break;
        
      case 'dicas':
        resultado = await orquestrarDicas(formData, {
          templates: moduloTemplates,
          utils: moduloUtils
        });
        break;
        
      default:
        throw new Error(`Tipo não suportado pelo orquestrador: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL COM MÉTRICAS (USA MÓDULO UTILS)
    // ================================================================================
    
    const tempoTotal = Date.now() - inicio;
    
    // Calcular métricas usando módulo utils
    let metricas = { processamento: { tempo_total_ms: tempoTotal } };
    if (moduloUtils && resultado.rawResponse) {
      try {
        metricas = moduloUtils.calcularMetricas(resultado.rawResponse, inicio, tipo);
      } catch (errMetricas) {
        console.warn("⚠️ Erro ao calcular métricas:", errMetricas.message);
      }
    }
    
    console.log("✅ Orquestração concluída:", tempoTotal + "ms");
    
    return res.status(200).json({
      success: true,
      result: resultado.conteudo,
      versao: '7.7-orquestrador-modular',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        tempoProcessamento: `${tempoTotal}ms`,
        templateUsado: resultado.templateUsado,
        modeloUsado: resultado.modeloUsado,
        modulosCarregados: true,
        metricas: metricas,
        detalhesCompletos: resultado.detalhesProcessamento || {
          status: 'Processado via módulos especializados'
        }
      }
    });

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    
    console.error("❌ Erro no orquestrador:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.7-orquestrador-modular',
      timestamp: new Date().toISOString(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        errorStack: error.stack?.split('\n').slice(0, 3),
        tipo_erro: 'erro_orquestrador'
      }
    });
  }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DE ORÇAMENTO (APENAS CHAMA MÓDULOS)
// ================================================================================

async function orquestrarOrcamento(formData, modulos) {
  console.log("🎯 Orquestrando orçamento via módulos especializados...");
  
  try {
    // ETAPA 1: Análise via módulo analysis.js
    console.log("📊 ETAPA 1: Análise de tipos...");
    let analise;
    
    if (modulos.analysis?.analisarTextoCompleto) {
      analise = modulos.analysis.analisarTextoCompleto(formData);
      console.log("✅ Análise executada via analysis.js");
    } else if (modulos.analysis?.default?.analisarTextoCompleto) {
      analise = modulos.analysis.default.analisarTextoCompleto(formData);
      console.log("✅ Análise executada via analysis.js (default export)");
    } else {
      throw new Error("Módulo analysis.js não possui função analisarTextoCompleto");
    }
    
    // ETAPA 2: Template via módulo templates.js
    console.log("📋 ETAPA 2: Aplicação de template...");
    let templateResult;
    
    if (modulos.templates?.aplicarTemplateCompleto) {
      templateResult = modulos.templates.aplicarTemplateCompleto(formData, analise);
      console.log("✅ Template aplicado via templates.js");
    } else if (modulos.templates?.default?.aplicarTemplateCompleto) {
      templateResult = modulos.templates.default.aplicarTemplateCompleto(formData, analise);
      console.log("✅ Template aplicado via templates.js (default export)");
    } else {
      throw new Error("Módulo templates.js não possui função aplicarTemplateCompleto");
    }
    
    // ETAPA 3: Processamento final via módulo processing.js 
    console.log("⚙️ ETAPA 3: Processamento final...");
    let resultadoProcessamento;
    
    if (modulos.processing?.processarRespostaCompleta) {
      // CORREÇÃO CRÍTICA: Passar 3 argumentos (não 2)
      resultadoProcessamento = await modulos.processing.processarRespostaCompleta(
        templateResult, 
        analise,
        formData  // 3º argumento OBRIGATÓRIO
      );
      console.log("✅ Processamento executado via processing.js");
    } else if (modulos.processing?.default?.processarRespostaCompleta) {
      // CORREÇÃO CRÍTICA: Passar 3 argumentos (não 2)
      resultadoProcessamento = await modulos.processing.default.processarRespostaCompleta(
        templateResult, 
        analise,
        formData  // 3º argumento OBRIGATÓRIO
      );
      console.log("✅ Processamento executado via processing.js (default export)");
    } else {
      throw new Error("Módulo processing.js não possui função processarRespostaCompleta");
    }
    
    return {
      conteudo: resultadoProcessamento.content || resultadoProcessamento.conteudo || 'Conteúdo não gerado',
      templateUsado: templateResult.templateUsado || 'templates.js',
      modeloUsado: resultadoProcessamento.modelo_usado || 'modular',
      rawResponse: resultadoProcessamento,
      detalhesProcessamento: {
        etapas_executadas: ['analysis', 'templates', 'processing'],
        analise_tipos: analise?.tipos || {},
        template_aplicado: templateResult?.templateUsado || 'sim',
        processamento_status: 'concluido_via_modulos'
      }
    };
    
  } catch (error) {
    console.error("❌ Erro na orquestração de orçamento:", error);
    throw new Error(`Falha na orquestração de orçamento: ${error.message}`);
  }
}

// ================================================================================
// 🏨 ORQUESTRAÇÃO DE RANKING (USA MÓDULO TEMPLATES)
// ================================================================================

async function orquestrarRanking(formData, modulos) {
  console.log("🏨 Orquestrando ranking via módulo templates...");
  
  try {
    const destino = formData.destino || 'destino não informado';
    
    // Usar módulo templates para ranking
    let ranking;
    if (modulos.templates?.gerarRankingHoteis) {
      ranking = modulos.templates.gerarRankingHoteis(destino);
    } else if (modulos.templates?.default?.gerarRankingHoteis) {
      ranking = modulos.templates.default.gerarRankingHoteis(destino);
    } else {
      throw new Error("Módulo templates.js não possui função gerarRankingHoteis");
    }
    
    return {
      conteudo: ranking,
      templateUsado: 'templates.js-ranking',
      modeloUsado: 'template-estatico',
      detalhesProcessamento: {
        tipo: 'ranking',
        destino: destino,
        metodo: 'templates.gerarRankingHoteis'
      }
    };
    
  } catch (error) {
    console.error("❌ Erro na orquestração de ranking:", error);
    throw new Error(`Falha na orquestração de ranking: ${error.message}`);
  }
}

// ================================================================================
// 💡 ORQUESTRAÇÃO DE DICAS (USA MÓDULO TEMPLATES)
// ================================================================================

async function orquestrarDicas(formData, modulos) {
  console.log("💡 Orquestrando dicas via módulo templates...");
  
  try {
    const destino = formData.destino || 'destino não informado';
    
    // Usar módulo templates para dicas
    let dicas;
    if (modulos.templates?.gerarDicasViagem) {
      dicas = modulos.templates.gerarDicasViagem(destino);
    } else if (modulos.templates?.default?.gerarDicasViagem) {
      dicas = modulos.templates.default.gerarDicasViagem(destino);
    } else {
      throw new Error("Módulo templates.js não possui função gerarDicasViagem");
    }
    
    return {
      conteudo: dicas,
      templateUsado: 'templates.js-dicas',
      modeloUsado: 'template-estatico',
      detalhesProcessamento: {
        tipo: 'dicas',
        destino: destino,
        metodo: 'templates.gerarDicasViagem'
      }
    };
    
  } catch (error) {
    console.error("❌ Erro na orquestração de dicas:", error);
    throw new Error(`Falha na orquestração de dicas: ${error.message}`);
  }
}

// ================================================================================
// 🚀 LOGS E INICIALIZAÇÃO DO ORQUESTRADOR
// ================================================================================

console.log("🚀 CVC API v7.7 - ORQUESTRADOR MODULAR INICIALIZADO");
console.log("✅ Características do orquestrador:");
console.log("- 🎯 APENAS orquestra módulos especializados");
console.log("- 🚫 NUNCA implementa lógica de negócio");
console.log("- 🔧 Importação dinâmica ES6 para todos os módulos");
console.log("- ✅ Correção: processarRespostaCompleta() com 3 argumentos");
console.log("- 🛡️ Falha rápida se módulos não carregarem");
console.log("- 📊 Métricas via módulo utils.js");
console.log("- 🏗️ Arquitetura modular 100% respeitada");
