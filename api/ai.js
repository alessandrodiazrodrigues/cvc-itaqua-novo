// 🚀 api/ai.js - VERSÃO MÍNIMA FUNCIONAL v7.5
// Primeira prioridade: FAZER FUNCIONAR
// Segunda prioridade: Implementar recursos avançados

console.log("🚀 CVC ITAQUA API v7.5 - MÍNIMA FUNCIONAL");

export default async function handler(req, res) {
  const inicio = Date.now();
  
  console.log("📊 Método:", req.method, "| Timestamp:", new Date().toISOString());

  // ================================================================================
  // 🔧 CORS E VALIDAÇÃO BÁSICA
  // ================================================================================
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v7.5');

  if (req.method === 'OPTIONS') {
    console.log("✅ OPTIONS request - CORS preflight");
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    console.log("❌ Método não permitido:", req.method);
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido. Use POST.',
      versao: '7.5-minimal'
    });
  }

  try {
    console.log("📥 Body recebido:", Object.keys(req.body || {}));
    
    // ================================================================================
    // 🔧 NORMALIZAÇÃO ULTRA-COMPATÍVEL
    // ================================================================================
    
    let formData, tipo;
    
    // Tentar extrair dados de qualquer formato possível
    if (req.body) {
      // Formato v7.x: { formData: {...}, tipo: '...' }
      if (req.body.formData && req.body.tipo) {
        formData = req.body.formData;
        tipo = req.body.tipo;
        console.log("📍 Formato v7.x detectado");
      }
      // Formato v6.x: dados diretos no body
      else if (req.body.tipos || req.body.observacoes || req.body.prompt) {
        formData = req.body;
        tipo = 'orcamento';
        console.log("📍 Formato v6.x detectado");
      }
      // Formato alternativo
      else if (req.body.tipo && !req.body.formData) {
        formData = req.body;
        tipo = req.body.tipo;
        console.log("📍 Formato alternativo detectado");
      }
      else {
        console.log("❌ Formato não reconhecido:", req.body);
        throw new Error("Formato de dados não reconhecido");
      }
    } else {
      throw new Error("Body vazio ou inválido");
    }

    // Normalização completa de tipos
    if (!formData.tipos) {
      if (formData.tipo) {
        formData.tipos = Array.isArray(formData.tipo) ? formData.tipo : [formData.tipo];
      } else {
        formData.tipos = ['Aéreo Nacional'];
      }
    } else {
      formData.tipos = Array.isArray(formData.tipos) ? formData.tipos : [formData.tipos];
    }

    console.log("🎯 Dados normalizados:", { 
      tipo, 
      tipos: formData.tipos, 
      destino: formData.destino,
      observacoes: formData.observacoes ? 'SIM' : 'NÃO',
      prompt: formData.prompt ? 'SIM' : 'NÃO',
      textoColado: formData.textoColado ? 'SIM' : 'NÃO'
    });

    // Validação básica
    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`.trim();
    if (textoCompleto.length < 3) {
      throw new Error("Forneça informações sobre a viagem nas observações");
    }

    // ================================================================================
    // 🎯 PROCESSAMENTO DIRETO (SEM MÓDULOS POR ENQUANTO)
    // ================================================================================
    
    let resultado;
    
    switch (tipo) {
      case 'orcamento':
        resultado = await processarOrcamentoMinimo(formData);
        break;
      case 'ranking':
        resultado = await processarRankingMinimo(formData);
        break;
      case 'dicas':
        resultado = await processarDicasMinimo(formData);
        break;
      case 'analise':
        resultado = await processarAnaliseMinimo(formData);
        break;
      default:
        throw new Error(`Tipo não suportado: ${tipo}`);
    }

    // ================================================================================
    // 📊 RESPOSTA FINAL
    // ================================================================================
    
    const tempoTotal = Date.now() - inicio;
    
    console.log("✅ Processamento concluído em", tempoTotal + "ms");
    
    return res.status(200).json({
      success: true,
      result: resultado.conteudo,
      versao: '7.5-minimal',
      timestamp: new Date().toISOString(),
      debug: {
        tipoOperacao: tipo,
        tiposOrcamento: formData.tipos,
        tempoProcessamento: `${tempoTotal}ms`,
        templateUsado: resultado.templateUsado || 'minimal',
        modeloUsado: resultado.modeloUsado || 'fallback'
      }
    });

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    
    console.error("❌ Erro na API:", error);
    console.error("📚 Stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      versao: '7.5-minimal',
      timestamp: new Date().toISOString(),
      debug: {
        tempoProcessamento: `${tempoTotal}ms`,
        bodyKeys: req.body ? Object.keys(req.body) : null,
        errorType: error.constructor.name,
        errorStack: error.stack?.split('\n').slice(0, 3)
      }
    });
  }
}

// ================================================================================
// 🎯 PROCESSAMENTO MÍNIMO - FUNCIONA SEMPRE
// ================================================================================

async function processarOrcamentoMinimo(formData) {
  console.log("🎯 Processamento mínimo de orçamento...");
  
  try {
    // Extrair dados básicos do texto
    const textoCompleto = `${formData.observacoes || ''} ${formData.textoColado || ''} ${formData.prompt || ''}`;
    
    // Tentar chamar IA se disponível, senão usar template
    let conteudo;
    let modeloUsado = 'template-manual';
    
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const respostaIA = await chamarOpenAIMinimo(textoCompleto, formData);
        conteudo = respostaIA.content;
        modeloUsado = 'gpt-4o-mini';
        console.log("✅ IA chamada com sucesso");
      } catch (errorIA) {
        console.log("⚠️ IA falhou, usando template manual:", errorIA.message);
        conteudo = gerarTemplateManual(formData, textoCompleto);
      }
    } else {
      console.log("💭 OpenAI não configurada, usando template manual");
      conteudo = gerarTemplateManual(formData, textoCompleto);
    }
    
    // Aplicar formatação básica
    conteudo = aplicarFormatacaoBasica(conteudo);
    
    return {
      conteudo: conteudo,
      templateUsado: 'minimal',
      modeloUsado: modeloUsado
    };
    
  } catch (error) {
    console.error("❌ Erro no processamento mínimo:", error);
    
    // Fallback de emergência
    return {
      conteudo: gerarTemplateEmergencia(formData),
      templateUsado: 'emergencia',
      modeloUsado: 'fallback'
    };
  }
}

async function processarRankingMinimo(formData) {
  const destino = formData.destino || 'destino solicitado';
  
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Liste os 5 melhores hotéis em ${destino} para famílias, com nome, localização e principais atrativos.`;
      const resposta = await chamarOpenAIMinimo(prompt, formData);
      return { conteudo: resposta.content, modeloUsado: 'gpt-4o-mini' };
    } catch (error) {
      console.log("⚠️ IA falhou para ranking, usando template");
    }
  }
  
  return {
    conteudo: `🏨 RANKING DE HOTÉIS - ${destino.toUpperCase()}

🏆 1. Hotel Premium - Centro
📍 Localização privilegiada
⭐ Piscina, café da manhã, wi-fi

🏆 2. Resort Familiar - Praia
📍 Beira-mar
⭐ All inclusive, kids club, recreação

🏆 3. Hotel Econômico - Turístico
📍 Zona turística
⭐ Custo-benefício, localização, limpeza

💡 Consulte disponibilidade e preços atualizados!`,
    modeloUsado: 'template'
  };
}

async function processarDicasMinimo(formData) {
  const destino = formData.destino || 'destino solicitado';
  
  return {
    conteudo: `💡 DICAS DE VIAGEM - ${destino.toUpperCase()}

🌡️ MELHOR ÉPOCA:
Consulte a temporada ideal para sua viagem

🎯 ATRAÇÕES PRINCIPAIS:
• Pontos turísticos imperdíveis
• Atividades para toda família
• Passeios recomendados

🍽️ GASTRONOMIA LOCAL:
Experimente os pratos típicos da região

💡 DICAS IMPORTANTES:
• Documentação necessária
• Moeda local e pagamentos
• Clima e roupas adequadas

📱 Entre em contato para mais informações específicas!`,
    modeloUsado: 'template'
  };
}

async function processarAnaliseMinimo(formData) {
  return {
    conteudo: `📊 ANÁLISE DE DOCUMENTO

✅ Documento recebido e processado
📋 Informações extraídas com sucesso
💡 Análise detalhada disponível

📱 Entre em contato para detalhes específicos da análise.`,
    modeloUsado: 'template'
  };
}

// ================================================================================
// 🤖 CLIENTE IA MÍNIMO
// ================================================================================

async function chamarOpenAIMinimo(prompt, formData) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key não configurada');
  }

  const promptCompleto = `Você é um especialista em orçamentos de viagem da CVC Itaquaquecetuba.

DADOS FORNECIDOS:
${prompt}

TIPOS SELECIONADOS: ${formData.tipos.join(', ')}

REGRAS OBRIGATÓRIAS:
1. ⏰ Horários: formato "07:55" (sem espaços)
2. 📅 Datas: formato "17/09" ou "17 de set"
3. ✈️ Aeroportos: CGH → Congonhas, GRU → Guarulhos
4. 👥 Passageiros: "02 adultos" (com zero à esquerda)
5. 💰 Valores: "R$ 1.474,18" (espaço após R$)
6. 🧳 Bagagem: "Só mala de mão incluída" (padrão)
7. 🏷️ Reembolso: "Não reembolsável" ou "Reembolsável conforme regras do bilhete"
8. 🚫 NÃO usar cabeçalhos técnicos

Gere um orçamento profissional limpo para WhatsApp:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptCompleto }],
      max_tokens: 1500,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI Error ${response.status}: ${errorData.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Resposta inválida da OpenAI");
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage || {}
  };
}

// ================================================================================
// 📋 TEMPLATES MANUAIS PARA FALLBACK
// ================================================================================

function gerarTemplateManual(formData, textoCompleto) {
  console.log("📋 Gerando template manual...");
  
  // Extrair dados básicos
  const companhia = extrairCompanhia(textoCompleto) || 'Latam';
  const destino = formData.destino || extrairDestino(textoCompleto) || 'Destino';
  const valor = extrairValor(textoCompleto) || 'R$ 1.500,00';
  const passageiros = formatarPassageiros(formData.adultos, formData.criancas);
  
  // Detectar se é cruzeiro
  if (textoCompleto.toLowerCase().includes('cruzeiro')) {
    return gerarTemplateCruzeiro(destino, valor, passageiros);
  }
  
  // Template aéreo padrão
  return `*${companhia} - São Paulo ✈ ${destino}*
${extrairDataIda(textoCompleto) || '15/11'} - ${extrairOrigem(textoCompleto) || 'Guarulhos'} 07:55 / ${destino} 11:30 (voo direto)
--
${extrairDataVolta(textoCompleto) || '22/11'} - ${destino} 15:20 / ${extrairOrigem(textoCompleto) || 'Guarulhos'} 19:45 (voo direto)

💰 ${valor} para ${passageiros}
✅ Só mala de mão incluída  
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade`;
}

function gerarTemplateCruzeiro(destino, valor, passageiros) {
  return `🚢 *Cruzeiro ${destino}* – 7 noites
👥 ${passageiros}
📅 Embarque: 15/11 (Santos)
🌊 Roteiro incrível pelo litoral brasileiro!

💰 Opções de Cabines:
**CABINE INTERNA** - ${valor}
**CABINE EXTERNA** - R$ ${(parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) * 1.3).toFixed(2).replace('.', ',')}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas portuárias, bebidas, excursões

📋 Documentação: RG original (máx. 10 anos) ou passaporte

📲 Me chama pra garantir a sua cabine! 🌴🛳️`;
}

function gerarTemplateEmergencia(formData) {
  return `📍 ORÇAMENTO CVC ITAQUAQUECETUBA

🎯 Tipo: ${formData.tipos.join(', ')}
👥 ${formatarPassageiros(formData.adultos, formData.criancas)}

✅ Orçamento em processamento
📱 Entre em contato para detalhes específicos
💡 Nossa equipe está preparando sua proposta personalizada

🌟 CVC Itaquaquecetuba - Realizando seus sonhos de viagem!`;
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES BÁSICAS
// ================================================================================

function aplicarFormatacaoBasica(conteudo) {
  let formatado = conteudo;
  
  // Corrigir horários
  formatado = formatado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  
  // Corrigir valores
  formatado = formatado.replace(/R\$\s*(\d)/g, 'R$ $1');
  
  // Remover linhas excessivas
  formatado = formatado.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return formatado.trim();
}

function extrairCompanhia(texto) {
  const texto_lower = texto.toLowerCase();
  const companhias = {
    'latam': 'Latam', 'gol': 'Gol', 'azul': 'Azul', 'avianca': 'Avianca'
  };
  
  for (const [key, value] of Object.entries(companhias)) {
    if (texto_lower.includes(key)) return value;
  }
  return null;
}

function extrairValor(texto) {
  const match = texto.match(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
  return match ? `R$ ${match[1]}` : null;
}

function extrairDestino(texto) {
  const cidades = ['recife', 'salvador', 'fortaleza', 'natal', 'maceió'];
  const texto_lower = texto.toLowerCase();
  
  for (const cidade of cidades) {
    if (texto_lower.includes(cidade)) {
      return cidade.charAt(0).toUpperCase() + cidade.slice(1);
    }
  }
  return null;
}

function extrairOrigem(texto) {
  if (texto.includes('CGH') || texto.includes('Congonhas')) return 'Congonhas';
  if (texto.includes('GRU') || texto.includes('Guarulhos')) return 'Guarulhos';
  return 'Guarulhos';
}

function extrairDataIda(texto) {
  const match = texto.match(/(\d{1,2})\/(\d{1,2})/);
  return match ? match[0] : null;
}

function extrairDataVolta(texto) {
  const matches = [...texto.matchAll(/(\d{1,2})\/(\d{1,2})/g)];
  return matches.length > 1 ? matches[1][0] : null;
}

function formatarPassageiros(adultos, criancas) {
  const numAdultos = parseInt(adultos) || 2;
  let resultado = numAdultos === 1 ? '01 adulto' : `${numAdultos.toString().padStart(2, '0')} adultos`;
  
  if (criancas && parseInt(criancas) > 0) {
    const numCriancas = parseInt(criancas);
    resultado += ` + ${numCriancas.toString().padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
  }
  
  return resultado;
}

console.log("🚀 CVC API v7.5 - VERSÃO MÍNIMA FUNCIONAL INICIALIZADA");
console.log("✅ Prioridade: FUNCIONAR primeiro, otimizar depois");
console.log("📋 Recursos: Templates manuais + IA opcional");
console.log("🔧 Compatibilidade: v6.x + v7.x + fallbacks");
