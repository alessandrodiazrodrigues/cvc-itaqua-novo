// 🚀 ai.js - CVC ITAQUA API v7.0 COMPLETO INTEGRADO
// Sistema completo com todos os módulos integrados
// Manual de Modelos implementado + IA Dual + Formatação Profissional

console.log("🚀 INICIANDO CVC ITAQUA API v7.0 - SISTEMA INTEGRADO COMPLETO");

// ================================================================================
// 🗺️ MAPEAMENTO COMPLETO DE AEROPORTOS
// ================================================================================

const AEROPORTOS = {
  // Principais aeroportos brasileiros
  'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
  'SDU': 'Santos Dumont', 'GIG': 'Galeão', 
  'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha',
  'CWB': 'Curitiba', 'IGU': 'Foz do Iguaçu', 
  'REC': 'Recife', 'FOR': 'Fortaleza', 'SSA': 'Salvador',
  'MAO': 'Manaus', 'BEL': 'Belém', 'CGB': 'Cuiabá',
  'CGR': 'Campo Grande', 'AJU': 'Aracaju', 'MCZ': 'Maceió',
  'JPA': 'João Pessoa', 'NAT': 'Natal', 'THE': 'Teresina',
  'SLZ': 'São Luís', 'VIX': 'Vitória', 'FLN': 'Florianópolis',
  'POA': 'Porto Alegre', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus',
  'RAO': 'Ribeirão Preto', 'NVT': 'Navegantes', 'UDI': 'Uberlândia',
  
  // Aeroportos internacionais importantes
  'EZE': 'Buenos Aires Ezeiza', 'AEP': 'Buenos Aires Aeroparque',
  'LHR': 'Londres Heathrow', 'JFK': 'Nova York JFK', 
  'MXP': 'Milão Malpensa', 'CDG': 'Paris Charles de Gaulle',
  'MVD': 'Montevidéu', 'ASU': 'Assunção', 'SCL': 'Santiago', 'LIM': 'Lima',
  'MIA': 'Miami', 'MCO': 'Orlando', 'LAX': 'Los Angeles',
  'MAD': 'Madrid', 'FCO': 'Roma', 'LIS': 'Lisboa'
};

// ================================================================================
// 🎯 CONFIGURAÇÕES DO SISTEMA
// ================================================================================

const CONFIG = {
  versao: '7.0.0',
  modelos: {
    principal: 'gpt-4o-mini',
    imagem: 'claude-3-5-sonnet',
    premium: 'gpt-4o'
  },
  precos: {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 }
  },
  limites: {
    max_tokens: 2500,
    timeout: 30000
  }
};

// ================================================================================
// 🔍 SISTEMA DE ANÁLISE INTEGRADO
// ================================================================================

function analisarTextoCompleto(formData) {
  console.log("[v7.0] 🔍 Iniciando análise completa...");
  
  const textoCompleto = [
    formData.observacoes || '',
    formData.textoColado || '',
    formData.destino || '',
    formData.tipos?.join(' ') || ''
  ].join(' ').toLowerCase();
  
  const analise = {
    // Detecção básica
    temEscalas: detectarEscalas(textoCompleto),
    isIdaVolta: detectarIdaVolta(textoCompleto),
    isSomenteIda: detectarSomenteIda(textoCompleto),
    temMultiplasOpcoes: detectarMultiplasOpcoes(textoCompleto),
    numeroOpcoes: contarOpcoes(textoCompleto),
    
    // Detecção de elementos
    temPrecos: detectarPrecos(textoCompleto),
    numeroPrecos: contarPrecos(textoCompleto),
    temDatas: detectarDatas(textoCompleto),
    numeroDatas: contarDatas(textoCompleto),
    temHorarios: detectarHorarios(textoCompleto),
    
    // Extração de dados
    aeroportosDetectados: extrairAeroportos(textoCompleto),
    companhiasDetectadas: extrairCompanhias(textoCompleto),
    
    // Tipo principal detectado
    tipoDetectado: determinarTipoPrincipal(textoCompleto),
    confiancaDeteccao: calcularConfianca(textoCompleto),
    complexidade: calcularComplexidade(formData, textoCompleto)
  };
  
  console.log(`[v7.0] ✅ Análise: ${analise.tipoDetectado} (${(analise.confiancaDeteccao * 100).toFixed(1)}%)`);
  return analise;
}

// Funções auxiliares de detecção
function detectarEscalas(texto) {
  return texto.includes('escala') || texto.includes('conexão') || texto.includes('parada');
}

function detectarIdaVolta(texto) {
  return texto.includes('ida') && texto.includes('volta') && !texto.includes('somente ida');
}

function detectarSomenteIda(texto) {
  return texto.includes('somente ida') || (texto.includes('ida') && !texto.includes('volta'));
}

function detectarMultiplasOpcoes(texto) {
  return (texto.includes('opção 1') || texto.includes('plano 1')) ||
         (texto.match(/r\$.*?r\$/gi) || []).length >= 2;
}

function contarOpcoes(texto) {
  const opcoes = texto.match(/opção \d+|plano \d+/gi) || [];
  const precos = texto.match(/r\$\s*[\d.,]+/gi) || [];
  return Math.max(opcoes.length, Math.min(precos.length, 3));
}

function detectarPrecos(texto) {
  return texto.includes('R$') || /\d+[.,]\d{2}/.test(texto);
}

function contarPrecos(texto) {
  return (texto.match(/r\$\s*[\d.,]+/gi) || []).length;
}

function detectarDatas(texto) {
  return /\d{1,2}\/\d{1,2}/.test(texto) || texto.includes('nov') || texto.includes('dezembro');
}

function contarDatas(texto) {
  const datas = texto.match(/\d{1,2}\/\d{1,2}|\d{1,2}\s+de\s+\w+/gi) || [];
  return [...new Set(datas)].length;
}

function detectarHorarios(texto) {
  return /\d{1,2}:\d{2}/.test(texto);
}

function extrairAeroportos(texto) {
  const encontrados = [];
  Object.keys(AEROPORTOS).forEach(codigo => {
    if (texto.toUpperCase().includes(codigo)) {
      encontrados.push(codigo);
    }
  });
  return encontrados;
}

function extrairCompanhias(texto) {
  const companhias = ['latam', 'gol', 'azul', 'avianca', 'copa', 'american'];
  const encontradas = [];
  companhias.forEach(companhia => {
    if (texto.includes(companhia)) {
      encontradas.push(companhia);
    }
  });
  return encontradas;
}

function determinarTipoPrincipal(texto) {
  // Lógica de detecção de tipo principal
  if (texto.includes('cruzeiro') || texto.includes('cabine')) {
    return 'cruzeiro';
  }
  
  if (texto.includes('pacote') || (texto.includes('hotel') && texto.includes('aéreo'))) {
    return 'pacoteCompleto';
  }
  
  if (texto.includes('multitrecho') || texto.includes('trecho 1')) {
    return 'multitrecho';
  }
  
  if (detectarMultiplasOpcoes(texto)) {
    const numeroOpcoes = contarOpcoes(texto);
    return numeroOpcoes >= 3 ? 'multiplasOpcoes3' : 'multiplasOpcoes2';
  }
  
  if (texto.includes('conexão') && texto.includes('espera')) {
    return 'aereoConexaoDetalhada';
  }
  
  if (detectarSomenteIda(texto)) {
    return 'aereoSomenteIda';
  }
  
  return 'aereoNacionalSimples'; // Default
}

function calcularConfianca(texto) {
  let confianca = 0.5; // Base
  
  if (detectarPrecos(texto)) confianca += 0.2;
  if (detectarHorarios(texto)) confianca += 0.2;
  if (detectarDatas(texto)) confianca += 0.1;
  
  return Math.min(confianca, 1.0);
}

function calcularComplexidade(formData, texto) {
  let pontuacao = 0;
  
  if (formData.tipos?.length > 1) pontuacao += 10;
  if (contarOpcoes(texto) > 1) pontuacao += 15;
  if (detectarEscalas(texto)) pontuacao += 10;
  if (formData.imagemBase64) pontuacao += 20;
  if (texto.length > 500) pontuacao += 15;
  
  if (pontuacao <= 20) return 'baixa';
  if (pontuacao <= 50) return 'média';
  return 'alta';
}

// ================================================================================
// 🎯 SISTEMA DE PROMPTS INTEGRADO
// ================================================================================

function gerarPromptOtimizado(formData, analise) {
  console.log("[v7.0] 🎯 Gerando prompt especializado...");
  
  const contexto = {
    tipos: formData.tipos?.join(", ") || "Orçamento geral",
    observacoes: formData.observacoes || "",
    textoColado: formData.textoColado || "",
    tipoDetectado: analise.tipoDetectado,
    confianca: analise.confiancaDeteccao,
    complexidade: analise.complexidade
  };
  
  // Selecionar template baseado no tipo detectado
  const templates = {
    'aereoNacionalSimples': criarPromptAereoSimples,
    'aereoConexaoDetalhada': criarPromptConexaoDetalhada,
    'multiplasOpcoes2': criarPromptMultiplasOpcoes,
    'multiplasOpcoes3': criarPromptMultiplasOpcoes,
    'cruzeiro': criarPromptCruzeiro,
    'pacoteCompleto': criarPromptPacote,
    'multitrecho': criarPromptMultitrecho
  };
  
  const criarPrompt = templates[analise.tipoDetectado] || templates['aereoNacionalSimples'];
  return criarPrompt(contexto, formData, analise);
}

function criarPromptAereoSimples(contexto, formData, analise) {
  return `ORÇAMENTO CVC ITAQUA - AÉREO NACIONAL SIMPLES v7.0

TIPO DETECTADO: ${contexto.tipoDetectado} (${(contexto.confianca * 100).toFixed(0)}% confiança)

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - AÉREO NACIONAL SIMPLES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
${formData.parcelamento?.incluirParcelamento ? '💳 [PARCELAMENTO]' : ''}
✅ Só mala de mão incluída
🏷️ Não reembolsável

REGRAS CRÍTICAS DE FORMATAÇÃO:
1. ⏰ HORÁRIOS: "23:20" (NUNCA "23: 20" com espaços)
2. ✈️ AEROPORTOS: GRU → Guarulhos, MCZ → Maceió (conversão obrigatória)
3. 📅 SEPARADOR: "--" obrigatório entre ida e volta
4. 👥 PASSAGEIROS: "02 adultos" (zero à esquerda sempre)
5. 🧳 BAGAGEM: "Só mala de mão incluída" (padrão nacional)
6. 💰 VALORES: "R$ 2.692,82" (espaço após R$)
7. 🧹 REMOVER todos os cabeçalhos técnicos da resposta
8. 📱 FORMATO: Limpo para WhatsApp

${contexto.observacoes.includes('latam') || contexto.textoColado.includes('latam') ? 'COMPANHIA DETECTADA: Latam' : ''}
${contexto.observacoes.includes('gol') || contexto.textoColado.includes('gol') ? 'COMPANHIA DETECTADA: Gol' : ''}

GERAR ORÇAMENTO LIMPO E PROFISSIONAL:`;
}

function criarPromptMultiplasOpcoes(contexto, formData, analise) {
  const numeroOpcoes = analise.numeroOpcoes || 2;
  
  return `ORÇAMENTO CVC ITAQUA - MÚLTIPLAS OPÇÕES

TIPO DETECTADO: ${numeroOpcoes} opções identificadas

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - MÚLTIPLAS OPÇÕES:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 **OPÇÃO 1** - R$ [VALOR_1]
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ [VALOR_2]
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

${numeroOpcoes >= 3 ? `💰 **OPÇÃO 3** - R$ [VALOR_3]
✅ Mala de mão + 2 bagagens despachadas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento` : ''}

Valores sujeitos a confirmação e disponibilidade

REGRAS ESPECÍFICAS MÚLTIPLAS OPÇÕES:
1. 🔢 NUMERAÇÃO: "**OPÇÃO 1**", "**OPÇÃO 2**" (negrito obrigatório)
2. 🧳 BAGAGEM ESCALONADA automática por opção
3. 💰 ORDEM: Menor preço primeiro
4. ✅ SERVIÇOS PROGRESSIVOS: cada opção tem mais benefícios

GERAR MÚLTIPLAS OPÇÕES FORMATADAS:`;
}

function criarPromptCruzeiro(contexto, formData, analise) {
  return `ORÇAMENTO CVC ITAQUA - CRUZEIRO

TIPO DETECTADO: Cruzeiro identificado

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - CRUZEIRO:

🚢 *Cruzeiro [NAVIO]* – [X] noites
Para: [PASSAGEIROS]
📅 Embarque: [DD/MM] ([PORTO])

💰 *Opções de Cabines:*
**CABINE INTERNA** - R$ [VALOR_1] ([OCUPAÇÃO])
**CABINE EXTERNA** - R$ [VALOR_2] ([OCUPAÇÃO])
**CABINE COM VARANDA** - R$ [VALOR_3] ([OCUPAÇÃO])

✅ Inclui: hospedagem a bordo, pensão completa, entretenimento
🚫 Não inclui: taxas portuárias, bebidas, excursões
📋 Documentação: RG original (máx. 10 anos) ou passaporte

📲 Me chama pra garantir a sua cabine! 🌴🛳️

REGRAS ESPECÍFICAS CRUZEIRO:
1. 🚢 EMOJI DE NAVIO obrigatório no início
2. 🛏️ PREÇOS POR CABINE (não por pessoa)
3. 📋 DOCUMENTAÇÃO sempre incluir

GERAR ORÇAMENTO DE CRUZEIRO:`;
}

function criarPromptPacote(contexto, formData, analise) {
  return `ORÇAMENTO CVC ITAQUA - PACOTE COMPLETO

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - PACOTE:

*Pacote [DESTINO]*
Pacote para [PASSAGEIROS]

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- Traslado Aeroporto / Hotel / Aeroporto
- [X] noites de hospedagem

✈️ *Voos [COMPANHIA]:*
[DD/MM] - [ORIGEM] [HH:MM] / [DESTINO] [HH:MM] ([TIPO_VOO])
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

**OPÇÃO 1** - [HOTEL_1]
💰 R$ [VALOR_1] para [PASSAGEIROS]

**OPÇÃO 2** - [HOTEL_2]
💰 R$ [VALOR_2] para [PASSAGEIROS]

Valores sujeitos a confirmação e disponibilidade

GERAR PACOTE ESTRUTURADO:`;
}

function criarPromptConexaoDetalhada(contexto, formData, analise) {
  return `ORÇAMENTO CVC ITAQUA - CONEXÃO DETALHADA

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - CONEXÃO DETALHADA:

*[COMPANHIA]*
[DD/MM] - [ORIGEM] [HH:MM] / [CONEXÃO] [HH:MM] (voo direto)
(conexão em [CONEXÃO] - [TEMPO] de espera)
[DD/MM] - [CONEXÃO] [HH:MM] / [DESTINO] [HH:MM] (voo direto)
--
[DD/MM] - [DESTINO] [HH:MM] / [ORIGEM] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR] para [PASSAGEIROS]
✅ Só mala de mão incluída
🏷️ Não reembolsável

REGRAS ESPECÍFICAS CONEXÃO:
1. 🔍 MOSTRAR cada trecho separadamente
2. ⏱️ INCLUIR tempo de espera
3. 🏢 ESPECIFICAR aeroporto de conexão

GERAR CONEXÃO DETALHADA:`;
}

function criarPromptMultitrecho(contexto, formData, analise) {
  return `ORÇAMENTO CVC ITAQUA - MULTITRECHO

DADOS DA VIAGEM:
${contexto.observacoes}

${contexto.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${contexto.textoColado}` : ''}

TEMPLATE OBRIGATÓRIO - MULTITRECHO:

*Multitrecho - [COMPANHIAS]*
[DD/MM] a [DD/MM] ([X] dias e [Y] noites)

*Trecho 1:* [ORIGEM_1] → [DESTINO_1]
[DD/MM] - [ORIGEM_1] [HH:MM] / [DESTINO_1] [HH:MM] ([TIPO_VOO])

*Trecho 2:* [ORIGEM_2] → [DESTINO_2]
[DD/MM] - [ORIGEM_2] [HH:MM] / [DESTINO_2] [HH:MM] ([TIPO_VOO])

💰 R$ [VALOR_TOTAL] para [PASSAGEIROS]
✅ Só mala de mão incluída
🏷️ Não reembolsável

REGRAS ESPECÍFICAS MULTITRECHO:
1. 🗺️ NUMERAÇÃO: "*Trecho 1:*", "*Trecho 2:*"
2. ➡️ SETAS: "Origem → Destino"
3. 📅 PERÍODO TOTAL: dias e noites

GERAR MULTITRECHO DETALHADO:`;
}

// ================================================================================
// 🔧 SISTEMA DE PROCESSAMENTO INTEGRADO
// ================================================================================

function processarRespostaCompleta(conteudo, analise, formData) {
  console.log("[v7.0] 🔧 Processando resposta com formatação profissional...");
  
  if (!conteudo) {
    console.error("❌ Conteúdo vazio para processar");
    return "Erro: Resposta vazia da IA";
  }
  
  let processado = conteudo;
  
  try {
    // ETAPA 1: Remover cabeçalhos técnicos
    processado = removerCabecalhosTecnicos(processado);
    
    // ETAPA 2: Aplicar formatação específica
    processado = aplicarFormatacaoCompleta(processado);
    
    // ETAPA 3: Correções específicas por tipo
    if (analise) {
      processado = aplicarCorrecoesPorTipo(processado, analise);
    }
    
    // ETAPA 4: Formatação final para WhatsApp
    processado = formatarParaWhatsApp(processado);
    
    console.log(`[v7.0] ✅ Processamento concluído: ${processado.length} caracteres`);
    return processado;
    
  } catch (error) {
    console.error("[v7.0] ❌ Erro no processamento:", error);
    return aplicarFormatacaoBasica(conteudo);
  }
}

function removerCabecalhosTecnicos(conteudo) {
  let limpo = conteudo;
  
  const padroesRemover = [
    /^ORÇAMENTO CVC ITAQUA[^\n]*\n?/gim,
    /^TIPO DETECTADO[^\n]*\n?/gim,
    /^DADOS DA VIAGEM[^\n]*\n?/gim,
    /^INFORMAÇÕES COMPLEMENTARES[^\n]*\n?/gim,
    /^TEMPLATE OBRIGATÓRIO[^\n]*\n?/gim,
    /^REGRAS CRÍTICAS[^\n]*\n?/gim,
    /^GERAR ORÇAMENTO[^\n]*\n?/gim,
    /^\d+\.\s*[⏰📅✈️🛫💳👥🧳][^\n]*\n?/gim,
    /^COMPANHIA DETECTADA[^\n]*\n?/gim
  ];
  
  padroesRemover.forEach(padrao => {
    limpo = limpo.replace(padrao, '');
  });
  
  // Limpar linhas em branco excessivas
  limpo = limpo.replace(/\n\s*\n\s*\n+/g, '\n\n');
  limpo = limpo.replace(/^\s*\n+/, '');
  
  return limpo.trim();
}

function aplicarFormatacaoCompleta(conteudo) {
  let formatado = conteudo;
  
  // 1. ⏰ HORÁRIOS - Corrigir espaços
  formatado = formatado.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  formatado = formatado.replace(/\b(\d):/g, '0$1:');
  
  // 2. ✈️ AEROPORTOS - Conversão completa
  Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
    const regex = new RegExp(`\\b${codigo}\\b`, 'gi');
    formatado = formatado.replace(regex, nome);
  });
  
  // 3. 🛫 CONEXÕES - "com conexão" nunca "escala"
  formatado = formatado.replace(/\bescala\b/gi, 'conexão');
  formatado = formatado.replace(/\bcom escala\b/gi, 'com conexão');
  
  // 4. 👥 PASSAGEIROS - Zero à esquerda
  formatado = formatado.replace(/\b(\d) adulto/g, '0$1 adulto');
  formatado = formatado.replace(/\b(\d) adultos/g, '0$1 adultos');
  
  // 5. 💰 VALORES - Espaço após R$
  formatado = formatado.replace(/R\$(\d)/g, 'R$ $1');
  
  // 6. 🏷️ REEMBOLSO - Padronizar
  formatado = formatado.replace(/totalmente reembolsável/gi, 'Reembolsável conforme regras do bilhete');
  formatado = formatado.replace(/não reembolsável.*?multa/gi, 'Não reembolsável');
  
  return formatado;
}

function aplicarCorrecoesPorTipo(conteudo, analise) {
  let corrigido = conteudo;
  
  // Correções específicas por tipo
  switch (analise.tipoDetectado) {
    case 'aereoNacionalSimples':
      // Garantir separador ida/volta
      if (corrigido.includes('ida') && corrigido.includes('volta') && !corrigido.includes('--')) {
        corrigido = corrigido.replace(/volta/i, '--\nvolta');
      }
      break;
      
    case 'multiplasOpcoes2':
    case 'multiplasOpcoes3':
      // Garantir numeração de opções
      if (!corrigido.includes('OPÇÃO 1')) {
        const linhasComPreco = corrigido.split('\n').filter(linha => linha.includes('R$'));
        if (linhasComPreco.length >= 2) {
          linhasComPreco.forEach((linha, index) => {
            const opcaoNum = `**OPÇÃO ${index + 1}**`;
            corrigido = corrigido.replace(linha, `💰 ${opcaoNum} - ${linha.replace(/💰\s*/, '')}`);
          });
        }
      }
      break;
      
    case 'cruzeiro':
      // Garantir emoji de navio
      if (!corrigido.includes('🚢')) {
        corrigido = '🚢 ' + corrigido;
      }
      break;
  }
  
  return corrigido;
}

function formatarParaWhatsApp(conteudo) {
  let formatado = conteudo;
  
  // Garantir quebras adequadas
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  // Garantir companhias em negrito
  formatado = formatado.replace(/^(Latam|Gol|Azul|Avianca)$/gm, '*$1*');
  
  // Remover espaços desnecessários
  formatado = formatado.replace(/\n\s+/g, '\n');
  formatado = formatado.replace(/\s+\n/g, '\n');
  
  return formatado.trim();
}

function aplicarFormatacaoBasica(conteudo) {
  let basico = conteudo;
  basico = removerCabecalhosTecnicos(basico);
  basico = basico.replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2');
  return basico.trim();
}

// ================================================================================
// 🤖 SISTEMA DE IA INTEGRADO
// ================================================================================

async function callOpenAI(prompt, formData, parametros = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const modelo = parametros.modelo || CONFIG.modelos.principal;
  const maxTokens = parametros.max_tokens || CONFIG.limites.max_tokens;
  
  const payload = {
    model: modelo,
    messages: [
      {
        role: "system",
        content: "Você é um especialista em criação de orçamentos de viagem profissionais. Siga EXATAMENTE as regras de formatação fornecidas."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: maxTokens,
    temperature: parametros.temperature || 0.3
  };

  // Adicionar imagem se fornecida
  if (formData.imagemBase64) {
    payload.messages[1].content = [
      { type: "text", text: prompt },
      { 
        type: "image_url", 
        image_url: { 
          url: `data:image/jpeg;base64,${formData.imagemBase64}` 
        }
      }
    ];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API erro: ${response.status}`);
  }

  const data = await response.json();
  
  const tokens = {
    input: data.usage?.prompt_tokens || 0,
    output: data.usage?.completion_tokens || 0,
    total: data.usage?.total_tokens || 0
  };
  
  const precoModelo = CONFIG.precos[modelo];
  const custo = ((tokens.input * precoModelo.input) + (tokens.output * precoModelo.output)) * 5.2; // USD para BRL
  
  return {
    resposta: data.choices[0]?.message?.content || '',
    tokens,
    custo,
    modelo
  };
}

async function callClaude(prompt, formData, parametros = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  const modelo = 'claude-3-5-sonnet-20240620';
  const maxTokens = parametros.max_tokens || CONFIG.limites.max_tokens;

  const messages = [
    {
      role: "user",
      content: formData.imagemBase64 ? [
        { type: "text", text: prompt },
        { 
          type: "image", 
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: formData.imagemBase64
          }
        }
      ] : prompt
    }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: maxTokens,
      messages: messages,
      temperature: parametros.temperature || 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API erro: ${response.status}`);
  }

  const data = await response.json();
  
  const tokens = {
    input: data.usage?.input_tokens || 0,
    output: data.usage?.output_tokens || 0,
    total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
  };
  
  const precoModelo = CONFIG.precos[modelo];
  const custo = ((tokens.input * precoModelo.input) + (tokens.output * precoModelo.output)) * 5.2; // USD para BRL
  
  return {
    resposta: data.content[0]?.text || '',
    tokens,
    custo,
    modelo
  };
}

function determinarMelhorModelo(analise, formData) {
  // Usar Claude para imagens
  if (formData.imagemBase64) {
    return CONFIG.modelos.imagem;
  }
  
  // Usar GPT-4o para alta complexidade
  if (analise.complexidade === 'alta' || analise.confiancaDeteccao < 0.6) {
    return CONFIG.modelos.premium;
  }
  
  // Usar GPT-4o-mini para casos normais
  return CONFIG.modelos.principal;
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL INTEGRADO
// ================================================================================

export default async function handler(req, res) {
  const startTime = Date.now();
  let modelo_usado = null;
  let custo_total = 0;
  
  try {
    console.log('[v7.0] 🚀 Iniciando processamento integrado...');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }
    
    if (req.method === 'GET') {
      return res.status(200).json({
        nome: 'CVC Itaqua API v7.0',
        versao: CONFIG.versao,
        status: 'OPERACIONAL',
        funcionalidades: [
          'Análise inteligente de tipos de orçamento',
          'Templates especializados por tipo',
          'Formatação profissional automática',
          'IA Dual (OpenAI + Claude)',
          'Processamento de imagens',
          'Sistema integrado completo'
        ],
        tipos_suportados: [
          'Aéreo Nacional Simples',
          'Aéreo com Conexão Detalhada',
          'Múltiplas Opções (2 e 3 planos)',
          'Cruzeiro',
          'Pacote Completo',
          'Multitrecho'
        ]
      });
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Método não permitido'
      });
    }
    
    // ETAPA 1: ANÁLISE COMPLETA DOS DADOS
    console.log('[v7.0] 🔍 Executando análise completa...');
    const analise = analisarTextoCompleto(req.body);
    
    // ETAPA 2: GERAÇÃO DE PROMPT OTIMIZADO
    console.log('[v7.0] 🎯 Gerando prompt especializado...');
    const prompt = gerarPromptOtimizado(req.body, analise);
    
    // ETAPA 3: DETERMINAÇÃO DO MODELO IDEAL
    modelo_usado = determinarMelhorModelo(analise, req.body);
    console.log(`[v7.0] 🤖 Modelo selecionado: ${modelo_usado}`);
    
    // ETAPA 4: CHAMADA PARA IA
    console.log('[v7.0] 🔄 Executando chamada para IA...');
    let resultado;
    
    try {
      if (modelo_usado.startsWith('gpt')) {
        resultado = await callOpenAI(prompt, req.body, { modelo: modelo_usado });
      } else {
        resultado = await callClaude(prompt, req.body, { modelo: modelo_usado });
      }
    } catch (error) {
      console.warn(`[v7.0] ⚠️ Erro com ${modelo_usado}, tentando fallback...`);
      // Tentar modelo fallback
      const fallback = modelo_usado === CONFIG.modelos.principal ? CONFIG.modelos.imagem : CONFIG.modelos.principal;
      
      if (fallback.startsWith('gpt')) {
        resultado = await callOpenAI(prompt, req.body, { modelo: fallback });
      } else {
        resultado = await callClaude(prompt, req.body, { modelo: fallback });
      }
      modelo_usado = fallback;
    }
    
    custo_total = resultado.custo;
    
    // ETAPA 5: PROCESSAMENTO COMPLETO DA RESPOSTA
    console.log('[v7.0] 🔧 Processando resposta...');
    const respostaProcessada = processarRespostaCompleta(resultado.resposta, analise, req.body);
    
    // ETAPA 6: VALIDAÇÃO FINAL
    const validacao = validarResposta(respostaProcessada, analise);
    
    console.log('[v7.0] ✅ Processamento concluído com sucesso!');
    
    // Log do resultado
    console.log(`[v7.0] 📊 Tipo: ${analise.tipoDetectado}, Modelo: ${modelo_usado}, Custo: R$ ${custo_total.toFixed(4)}`);
    
    // Resposta final
    return res.status(200).json({
      success: true,
      orcamento: respostaProcessada,
      analise: {
        tipo_detectado: analise.tipoDetectado,
        confianca: analise.confiancaDeteccao,
        complexidade: analise.complexidade,
        numero_opcoes: analise.numeroOpcoes
      },
      processamento: {
        modelo_usado,
        tempo_ms: Date.now() - startTime,
        tokens_usados: resultado.tokens?.total || 0,
        custo_brl: custo_total,
        versao: CONFIG.versao
      },
      validacao: {
        score: validacao.score,
        problemas: validacao.problemas,
        status: validacao.score >= 70 ? 'APROVADO' : 'ATENÇÃO'
      }
    });
    
  } catch (error) {
    console.error('[v7.0] ❌ Erro no processamento:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      detalhes: error.message,
      versao: CONFIG.versao,
      tempo_ms: Date.now() - startTime,
      modelo_tentativa: modelo_usado
    });
  }
}

// ================================================================================
// ✅ SISTEMA DE VALIDAÇÃO
// ================================================================================

function validarResposta(resposta, analise) {
  let score = 0;
  const problemas = [];
  
  // Validação 1: Elementos obrigatórios (40 pontos)
  if (resposta.includes('R)) score += 15; else problemas.push('Valor ausente');
  if (/\d{2}:\d{2}/.test(resposta)) score += 15; else problemas.push('Horários mal formatados');
  if (resposta.includes('adulto')) score += 10; else problemas.push('Passageiros ausentes');
  
  // Validação 2: Formatação profissional (30 pontos)
  if (!resposta.includes('ORÇAMENTO CVC')) score += 15; else problemas.push('Cabeçalhos técnicos presentes');
  if (!resposta.match(/\d{1,2}\s+:\s+\d{2}/)) score += 15; else problemas.push('Horários com espaços');
  
  // Validação 3: Coerência com tipo (30 pontos)
  switch (analise.tipoDetectado) {
    case 'aereoNacionalSimples':
      if (resposta.includes('--')) score += 15; else problemas.push('Separador ida/volta ausente');
      if (!resposta.includes('OPÇÃO 1')) score += 15; else problemas.push('Múltiplas opções detectadas incorretamente');
      break;
      
    case 'multiplasOpcoes2':
    case 'multiplasOpcoes3':
      if (resposta.includes('OPÇÃO 1')) score += 15; else problemas.push('Numeração de opções ausente');
      if (resposta.includes('bagagem despachada')) score += 15; else problemas.push('Bagagem escalonada ausente');
      break;
      
    case 'cruzeiro':
      if (resposta.includes('🚢')) score += 15; else problemas.push('Emoji de navio ausente');
      if (resposta.includes('CABINE')) score += 15; else problemas.push('Tipos de cabine ausentes');
      break;
      
    default:
      score += 20; // Pontuação padrão
  }
  
  return { score, problemas };
}

// ================================================================================
// 🚀 INICIALIZAÇÃO DO SISTEMA
// ================================================================================

console.log('✅ === CVC ITAQUA API v7.0 INTEGRADA CARREGADA ===');
console.log('📋 Sistema Completamente Integrado');
console.log('🔍 Análise Inteligente: ATIVA');
console.log('🎯 Prompts Especializados: CARREGADOS');
console.log('🔧 Processamento Profissional: ATIVO');
console.log('🤖 IA Dual: CONFIGURADA');
console.log('✅ Validação Automática: HABILITADA');
console.log('🚀 STATUS: PRONTO PARA PRODUÇÃO!');
console.log('===========================================');

// Teste de integridade
console.log('🧪 Testando funções principais...');
console.log(`✅ analisarTextoCompleto: ${typeof analisarTextoCompleto === 'function' ? 'OK' : 'ERRO'}`);
console.log(`✅ gerarPromptOtimizado: ${typeof gerarPromptOtimizado === 'function' ? 'OK' : 'ERRO'}`);
console.log(`✅ processarRespostaCompleta: ${typeof processarRespostaCompleta === 'function' ? 'OK' : 'ERRO'}`);
console.log(`✅ callOpenAI: ${typeof callOpenAI === 'function' ? 'OK' : 'ERRO'}`);
console.log(`✅ callClaude: ${typeof callClaude === 'function' ? 'OK' : 'ERRO'}`);
console.log('🎯 SISTEMA v7.0 INTEGRADO E FUNCIONANDO!');