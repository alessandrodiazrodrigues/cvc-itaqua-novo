// 🚀 api/ai.js - ORQUESTRADOR MODULAR CORRETO v7.4
// Usa TODOS os módulos já implementados em /modules/
// NUNCA reescreve funcionalidades - apenas IMPORTA e USA

import { aplicarTemplateCompleto, TEMPLATES_MANUAIS } from './modules/templates.js';
import { analisarTextoCompleto } from './modules/analysis.js';
import { processarResposta, limparResposta } from './modules/processing.js';
import { construirPromptEspecifico } from './modules/prompts.js';
import { chamarIA } from './modules/ia-client.js';
import { registrarCustos, calcularMetricas } from './modules/utils.js';

console.log("🚀 CVC ITAQUA API v7.4 - ORQUESTRADOR MODULAR");

export default async function handler(req, res) {
  const inicio = Date.now();
  
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CORS & VALIDATION
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.4-modular'
    });
  }

  try {
    // ================================================================================
    // 🔧 NORMALIZAÇÃO DE DADOS (COMPATIBILIDADE v6 + v7)
    // ================================================================================
    
    let formData, tipo;
    
    // Formato v7.x
    if (req.body.formData && req.body.tipo) {
      formData = req.body.formData;
      tipo = req.body.tipo;
      console.log("📍 Formato v7.x detectado");
    } 
    // Formato v6.x legado
    else if (req.body.tipos || req.body.observacoes) {
      formData = req.body;
      tipo = 'orcamento';
      console.log("📍 Formato v6.x convertido");
    } 
    else {
      throw new Error("Formato de dados não reconhecido");
    }

    // CORREÇÃO CRÍTICA: Normalizar tipos
    if (formData.tipos) {
      formData.tipos = Array.isArray(formData.tipos) ? formData.tipos : [formData.tipos];
    } else if (formData.tipo) {
      formData.tipos = [formData.tipo];
    } else {
      formData.tipos = ['Aéreo Nacional'];
    }

    console.log("🎯 Dados normalizados:", { 
      tipo, 
      tipos: formData.tipos, 
      destino: formData.destino,
      temTexto: !!(formData.observacoes || formData.textoColado)
    });

    // Validação básica
    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''}`.trim();
    if (textoCompleto.length < 5) {
      throw new Error("Forneça informações sobre a viagem nas observações");
    }

    // ================================================================================
    // 🎯 PROCESSAMENTO USANDO MÓDULOS
    // ================================================================================
    
    let resultado;
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamentoModular(formData);
        break;
      case 'ranking':
        resultado = await processarRankingModular(formData);
        break;
      case 'dicas':
        resultado = await processarDicasModular(formData);
        break;
      case 'analise':
        resultado = await processarAnaliseModular(formData);
        break;
      default:
        throw new Error(`Tipo não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL
    // ================================================================================
    
    const tempoTotal = Date.now() - inicio;
    
    console.log("✅ Processamento modular concluído");
    console.log(`⏱️ Tempo: ${tempoTotal}ms`);
    
    return res.status(200).json({
      success: true,
      result: resultado.conteudo,
      versao: '7.4-modular',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        tempoProcessamento: `${tempoTotal}ms`,
        templateUsado: resultado.templateUsado || 'modular',
        modeloUsado: resultado.modeloUsado || 'gpt-4o-mini',
        modulosCarregados: [
          'templates.js',
          'analysis.js', 
          'processing.js',
          'prompts.js',
          'ia-client.js',
          'utils.js'
        ]
      }
    });

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    
    console.error("❌ Erro no orquestrador:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.4-modular',
      timestamp: new Date().toISOString(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        bodyKeys: req.body ? Object.keys(req.body) : null,
        errorStack: error.stack?.split('\n').slice(0, 3)
      }
    });
  }
}

// ================================================================================
// 🎯 PROCESSAMENTO MODULAR - USA OS MÓDULOS EXISTENTES
// ================================================================================

async function processarOrcamentoModular(formData) {
  console.log("🎯 Processamento modular de orçamento...");
  
  try {
    // ETAPA 1: Análise usando módulo analysis.js
    const analise = analisarTextoCompleto(formData);
    console.log(`📊 Análise modular: ${JSON.stringify(analise)}`);
    
    // ETAPA 2: Template usando módulo templates.js  
    const promptTemplate = aplicarTemplateCompleto(formData, analise);
    console.log("📋 Template modular aplicado");
    
    // ETAPA 3: Construir prompt usando módulo prompts.js
    const promptFinal = construirPromptEspecifico(promptTemplate, formData, analise);
    console.log("📝 Prompt modular construído");
    
    // ETAPA 4: Chamar IA usando módulo ia-client.js
    const respostaIA = await chamarIA(promptFinal, 'gpt-4o-mini');
    console.log("🤖 IA modular chamada");
    
    // ETAPA 5: Processar resposta usando módulo processing.js
    const conteudoFinal = processarResposta(respostaIA.content, analise);
    console.log("🔧 Resposta modular processada");
    
    // ETAPA 6: Registrar custos usando módulo utils.js
    await registrarCustos(respostaIA, formData, 'modular');
    
    return {
      conteudo: conteudoFinal,
      templateUsado: 'modular-templates',
      modeloUsado: respostaIA.modelo_usado
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento modular:", error);
    throw new Error(`Falha modular: ${error.message}`);
  }
}

async function processarRankingModular(formData) {
  console.log("🏨 Ranking modular...");
  
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Ranking dos 5 melhores hotéis em ${destino} para famílias.

🏆 1. Nome do Hotel - ⭐⭐⭐⭐
📍 Região/Localização
💰 Faixa de preço aproximada
⭐ Principais diferenciais

(Repetir para 5 hotéis)`;

  const resposta = await chamarIA(prompt, 'gpt-4o-mini');
  await registrarCustos(resposta, formData, 'ranking');
  
  return { 
    conteudo: resposta.content, 
    modeloUsado: resposta.modelo_usado 
  };
}

async function processarDicasModular(formData) {
  console.log("💡 Dicas modulares...");
  
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Dicas de viagem para ${destino}, focadas em famílias.

🌡️ Melhor época para visitar
🎯 Atrações imperdíveis para crianças  
🍽️ Gastronomia local
💡 Dicas importantes para famílias`;

  const resposta = await chamarIA(prompt, 'gpt-4o-mini');
  await registrarCustos(resposta, formData, 'dicas');
  
  return { 
    conteudo: resposta.content, 
    modeloUsado: resposta.modelo_usado 
  };
}

async function processarAnaliseModular(formData) {
  console.log("📊 Análise modular...");
  
  const prompt = `Analise este documento e extraia as principais informações de forma organizada.`;
  const resposta = await chamarIA(prompt, 'gpt-4o-mini', formData.temImagem, formData.arquivo);
  await registrarCustos(resposta, formData, 'analise');
  
  return { 
    conteudo: resposta.content, 
    modeloUsado: resposta.modelo_usado 
  };
}

console.log("🚀 CVC API v7.4 - ORQUESTRADOR MODULAR INICIALIZADO");
console.log("✅ Módulos importados e funcionais:");
console.log("- 📋 templates.js (Templates completos)");
console.log("- 🔍 analysis.js (Análise inteligente)");
console.log("- 🔧 processing.js (Processamento)");
console.log("- 📝 prompts.js (Construção de prompts)");
console.log("- 🤖 ia-client.js (Cliente IA)");
console.log("- 📊 utils.js (Métricas e custos)");
