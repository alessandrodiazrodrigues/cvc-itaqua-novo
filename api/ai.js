// 🚀 api/ai.js - COORDENADOR MÍNIMO v7.3
// Apenas coordena os módulos especializados
// TODO: imports e orquestração

import { aplicarTemplateCompleto } from './modules/templates.js';
import { chamarIASegura } from './modules/ia-client.js';
import { analisarTextoCompleto } from './modules/analysis.js';
import { processarRespostaFinal } from './modules/processing.js';
import { calcularMetricas } from './modules/utils.js';

export default async function handler(req, res) {
  const inicio = Date.now();
  
  console.log("🚀 CVC ITAQUA API v7.3 - Coordenador Modular");

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido',
      versao: '7.3'
    });
  }

  try {
    // ================================================================================
    // 🔧 NORMALIZAR DADOS (igual ao que já funcionava)
    // ================================================================================
    
    let formData, tipo;
    
    if (req.body.formData && req.body.tipo) {
      formData = req.body.formData;
      tipo = req.body.tipo;
    } else if (req.body.tipos || req.body.observacoes) {
      formData = req.body;
      tipo = 'orcamento';
    } else {
      throw new Error("Formato de dados não reconhecido");
    }

    // Garantir tipos como array
    if (formData.tipos) {
      formData.tipos = Array.isArray(formData.tipos) ? formData.tipos : [formData.tipos];
    } else {
      formData.tipos = ['Aéreo Nacional'];
    }

    console.log("📋 Dados:", { tipo, tipos: formData.tipos, destino: formData.destino });

    // ================================================================================
    // 🎯 PROCESSAR BASEADO NO TIPO
    // ================================================================================
    
    let resultado;
    
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamento(formData);
        break;
      case 'ranking':
        resultado = await processarRanking(formData);
        break;
      case 'dicas':
        resultado = await processarDicas(formData);
        break;
      default:
        throw new Error(`Tipo não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA
    // ================================================================================
    
    const tempoTotal = Date.now() - inicio;
    
    return res.status(200).json({
      success: true,
      result: resultado,
      versao: '7.3',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        tempoProcessamento: `${tempoTotal}ms`,
        sistemaModular: true
      }
    });

  } catch (error) {
    console.error("❌ Erro:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.3',
      timestamp: new Date().toISOString()
    });
  }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DOS MÓDULOS
// ================================================================================

async function processarOrcamento(formData) {
  console.log("💰 Processando orçamento com módulos...");
  
  try {
    // ETAPA 1: Análise (módulo analysis.js)
    const analise = analisarTextoCompleto(formData);
    
    // ETAPA 2: Template (módulo templates.js)  
    const prompt = aplicarTemplateCompleto(formData, analise);
    
    // ETAPA 3: IA (módulo ia-client.js)
    const resposta = await chamarIASegura(
      prompt, 
      formData.temImagem, 
      formData.arquivo, 
      'gpt-4o-mini',
      'gpt-4o'
    );
    
    // ETAPA 4: Processamento (módulo processing.js)
    const conteudoFinal = processarRespostaFinal(resposta.content, analise, formData);
    
    // ETAPA 5: Métricas (módulo utils.js)
    const metricas = calcularMetricas(Date.now() - 1000, resposta.usage, resposta.modelo_usado, prompt, conteudoFinal);
    
    console.log("✅ Orçamento processado pelos módulos");
    return conteudoFinal;
    
  } catch (error) {
    console.error("❌ Erro nos módulos:", error.message);
    // FALLBACK: usar sistema básico se módulos falharem
    return await processarOrcamentoBasico(formData);
  }
}

async function processarRanking(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Ranking dos 5 melhores hotéis em ${destino} para famílias.`;
  
  const resposta = await chamarIASegura(prompt, false, null, 'gpt-4o-mini', 'gpt-4o');
  return resposta.content;
}

async function processarDicas(formData) {
  const destino = formData.destino || 'destino solicitado';
  const prompt = `Dicas de viagem para ${destino}, focadas em famílias.`;
  
  const resposta = await chamarIASegura(prompt, false, null, 'gpt-4o-mini', 'gpt-4o');
  return resposta.content;
}

// ================================================================================
// 🔧 FALLBACK BÁSICO (se módulos falharem)
// ================================================================================

async function processarOrcamentoBasico(formData) {
  console.log("⚠️ Usando fallback básico...");
  
  const prompt = `ORÇAMENTO CVC PROFISSIONAL

Dados: ${formData.observacoes} ${formData.textoColado}

Formato:
📍 [Destino]
🗓️ [Datas] ([X] dias e [Y] noites)
👥 [Passageiros]

*O Pacote Inclui:*
- Aéreo ida e volta com [Companhia]
- Taxas de embarque
- Só mala de mão incluída

✈ Detalhes dos Voos:
[Data ida] - [Origem] [Hora] / [Destino] [Hora]
[Data volta] - [Destino] [Hora] / [Origem] [Hora]

💰 Valor Total: R$ [Valor]
[Condições]

REGRAS: Horários "07:55", Passageiros "02 adultos", Valores "R$ 3.752,55"`;

  // Chamar OpenAI diretamente
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Erro na IA");
  }

  return data.choices[0].message.content;
}

console.log("🎯 CVC API v7.3 - Sistema Modular Inicializado");
console.log("📋 Coordenador: Delega para módulos especializados");
console.log("🔧 Fallback: Sistema básico se módulos falharem");
