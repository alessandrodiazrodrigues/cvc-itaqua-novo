// 🌍 ai-dicas.js - Módulo de Dicas Automáticas de Destino
// Extrai destino do orçamento e gera dicas personalizadas para WhatsApp

console.log("🌍 Módulo de Dicas Automáticas carregado");

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE GERAÇÃO DE DICAS
// ================================================================================

async function gerarDicasDestino() {
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  if (!btnGerar) {
    console.error('❌ Botão gerar dicas não encontrado');
    return;
  }
  
  try {
    // Desabilitar botão e mostrar progresso
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Analisando orçamento...';
    
    // Extrair informações do orçamento gerado
    const infoViagem = extrairInformacoesViagem();
    
    if (!infoViagem.destino) {
      throw new Error('Destino não identificado. Gere um orçamento primeiro!');
    }
    
    console.log("🎯 Informações extraídas:", infoViagem);
    
    // Atualizar progresso
    btnGerar.innerHTML = '🌍 Buscando dicas do destino...';
    
    // Gerar dicas com IA
    const dicas = await gerarDicasComIA(infoViagem);
    
    // Atualizar interface
    updateElement('destinoIA', dicas);
    
    // Mostrar botão de copiar
    if (btnCopiar) {
      btnCopiar.style.display = 'inline-block';
    }
    
    console.log("✅ Dicas geradas com sucesso!");
    
    return dicas;
    
  } catch (error) {
    console.error("❌ Erro ao gerar dicas:", error);
    updateElement('destinoIA', `❌ Erro: ${error.message}`);
    
  } finally {
    // Restaurar botão
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🎯 Gerar Dicas';
  }
}

// ================================================================================
// 🔍 EXTRAÇÃO DE INFORMAÇÕES DA VIAGEM
// ================================================================================

function extrairInformacoesViagem() {
  console.log("🔍 Extraindo informações da viagem...");
  
  // Obter orçamento gerado
  const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
  
  if (!orcamentoTexto || orcamentoTexto === 'Preencha o formulário acima para gerar o orçamento...') {
    throw new Error('Nenhum orçamento encontrado');
  }
  
  // Extrair destino
  const destino = extrairDestino(orcamentoTexto);
  
  // Extrair período
  const periodo = extrairPeriodo(orcamentoTexto);
  
  // Extrair informações sobre crianças
  const criancas = extrairInformacoesCriancas(orcamentoTexto);
  
  // Extrair tipo de viagem
  const tipoViagem = extrairTipoViagem(orcamentoTexto);
  
  // Obter dados do formulário para contexto adicional
  const adultos = parseInt(document.getElementById('adultos')?.value) || null;
  const destinoManual = document.getElementById('destino')?.value?.trim() || '';
  
  const infoViagem = {
    destino: destino || destinoManual,
    periodo: periodo,
    criancas: criancas,
    tipoViagem: tipoViagem,
    adultos: adultos,
    textoCompleto: orcamentoTexto
  };
  
  console.log("📊 Informações da viagem:", infoViagem);
  
  return infoViagem;
}

function extrairDestino(texto) {
  console.log("🎯 Extraindo destino...");
  
  // Procurar por padrão 📍 Destino
  const regexDestino = /📍\s*([^-\n]+?)(?:\s*-|$)/i;
  const match = texto.match(regexDestino);
  
  if (match) {
    const destino = match[1].trim();
    console.log("✅ Destino encontrado:", destino);
    return destino;
  }
  
  // Fallback: procurar destinos conhecidos
  const destinosComuns = [
    'Orlando', 'Miami', 'Nova York', 'New York', 'Los Angeles', 'Las Vegas',
    'Paris', 'Londres', 'Roma', 'Barcelona', 'Madrid', 'Amsterdam', 'Lisboa',
    'Buenos Aires', 'Santiago', 'Lima', 'Bariloche', 'Mendoza', 'Montevidéu',
    'Dubai', 'Tóquio', 'Singapura', 'Bangkok', 'Phuket', 'Bali',
    'Cancún', 'Punta Cana', 'Costa Rica', 'México', 'Peru', 'Chile',
    'Flórida', 'Califórnia', 'França', 'Itália', 'Espanha', 'Inglaterra'
  ];
  
  for (const destino of destinosComuns) {
    if (texto.toLowerCase().includes(destino.toLowerCase())) {
      console.log("✅ Destino encontrado (fallback):", destino);
      return destino;
    }
  }
  
  console.log("⚠️ Destino não identificado");
  return '';
}

function extrairPeriodo(texto) {
  console.log("📅 Extraindo período...");
  
  // Procurar por padrões de data
  const regexData = /🗓️\s*(\d{1,2})\s*de\s*(\w+)\s*-\s*(\d{1,2})\s*de\s*(\w+)/i;
  const match = texto.match(regexData);
  
  if (match) {
    const periodo = `${match[1]} de ${match[2]} - ${match[3]} de ${match[4]}`;
    console.log("✅ Período encontrado:", periodo);
    return periodo;
  }
  
  // Procurar por outros padrões de data
  const regexDataSimples = /(\d{1,2}\/\d{1,2}\/?\d{0,4})\s*-\s*(\d{1,2}\/\d{1,2}\/?\d{0,4})/;
  const matchSimples = texto.match(regexDataSimples);
  
  if (matchSimples) {
    const periodo = `${matchSimples[1]} - ${matchSimples[2]}`;
    console.log("✅ Período encontrado (simples):", periodo);
    return periodo;
  }
  
  // Procurar por quantidade de dias
  const regexDias = /(\d+)\s*dias?\s*e?\s*(\d+)?\s*noites?/i;
  const matchDias = texto.match(regexDias);
  
  if (matchDias) {
    const dias = matchDias[1];
    const noites = matchDias[2] || (parseInt(dias) - 1);
    const periodo = `${dias} dias e ${noites} noites`;
    console.log("✅ Período encontrado (dias):", periodo);
    return periodo;
  }
  
  console.log("⚠️ Período não identificado");
  return '';
}

function extrairInformacoesCriancas(texto) {
  console.log("👶 Extraindo informações sobre crianças...");
  
  // Procurar por padrões de crianças
  const regexCriancas = /(\d+)\s*crianças?\s*\(?([^)]*)\)?/i;
  const match = texto.match(regexCriancas);
  
  if (match) {
    const quantidade = parseInt(match[1]);
    const idades = match[2] ? match[2].replace(/e|anos?|,/gi, '').trim() : '';
    
    const info = {
      quantidade: quantidade,
      idades: idades,
      temCriancas: true
    };
    
    console.log("✅ Crianças encontradas:", info);
    return info;
  }
  
  // Verificar se é viagem familiar baseada no contexto
  const isFamiliar = /família|familiar|kids|children|crianças/i.test(texto);
  
  const info = {
    quantidade: 0,
    idades: '',
    temCriancas: false,
    isFamiliar: isFamiliar
  };
  
  console.log("📊 Info crianças:", info);
  return info;
}

function extrairTipoViagem(texto) {
  console.log("✈️ Extraindo tipo de viagem...");
  
  const tipos = [];
  
  if (/aéreo|passagem|voo|flight/i.test(texto)) tipos.push('aéreo');
  if (/hotel|hospedagem|accommodation/i.test(texto)) tipos.push('hotel');
  if (/cruzeiro|cruise|navio/i.test(texto)) tipos.push('cruzeiro');
  if (/carro|aluguel|rental/i.test(texto)) tipos.push('carro');
  if (/seguro|insurance/i.test(texto)) tipos.push('seguro');
  if (/passeio|tour|excursão/i.test(texto)) tipos.push('passeios');
  
  console.log("✅ Tipos identificados:", tipos);
  return tipos;
}

// ================================================================================
// 🤖 GERAÇÃO DE DICAS COM IA
// ================================================================================

async function gerarDicasComIA(infoViagem) {
  console.log("🤖 Gerando dicas com IA...");
  
  const prompt = construirPromptDicas(infoViagem);
  
  const requestData = {
    prompt: prompt,
    tipo: 'dicas-destino',
    modelo: 'gpt-4o-mini',
    maxTokens: 1500,
    metadata: {
      destino: infoViagem.destino,
      temCriancas: infoViagem.criancas.temCriancas,
      tipoViagem: infoViagem.tipoViagem,
      timestamp: new Date().toISOString()
    }
  };
  
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Resposta da API em formato inválido');
  }
  
  const dicas = data.choices[0].message.content;
  
  console.log("✅ Dicas geradas:", dicas.length, "caracteres");
  
  return dicas;
}

function construirPromptDicas(infoViagem) {
  console.log("📝 Construindo prompt para dicas...");
  
  let prompt = `DICAS PERSONALIZADAS PARA WHATSAPP - CVC ITAQUA

DESTINO: ${infoViagem.destino}`;

  if (infoViagem.periodo) {
    prompt += `\nPERÍODO: ${infoViagem.periodo}`;
  }
  
  if (infoViagem.criancas.temCriancas) {
    prompt += `\nVIAGEM FAMILIAR: ${infoViagem.criancas.quantidade} crianças`;
    if (infoViagem.criancas.idades) {
      prompt += ` (${infoViagem.criancas.idades})`;
    }
  }
  
  if (infoViagem.tipoViagem.length > 0) {
    prompt += `\nTIPO: ${infoViagem.tipoViagem.join(', ')}`;
  }

  prompt += `

INSTRUÇÕES OBRIGATÓRIAS:
1. 🎯 FOCO: Dicas práticas e úteis para ${infoViagem.destino}
2. 📱 FORMATO: Ideal para WhatsApp (emojis, parágrafos curtos)
3. 👨‍👩‍👧‍👦 PERSONALIZAÇÃO: ${infoViagem.criancas.temCriancas ? 'Incluir dicas familiares' : 'Foco em adultos'}
4. 🌟 CONTEÚDO: Pontos turísticos, clima, moeda, dicas locais
5. 💡 TOM: Entusiasmado e profissional da CVC

GERE DICAS NO FORMATO:

🌟 **DICAS ESPECIAIS - ${infoViagem.destino.toUpperCase()}**

🏛️ **Principais Atrações:**
[Lista de 3-4 pontos turísticos principais]

${infoViagem.criancas.temCriancas ? `👨‍👩‍👧‍👦 **Para Famílias:**
[Dicas específicas para crianças]

` : ''}🌤️ **Clima e Época:**
[Informações sobre clima no período]

💰 **Moeda e Gastos:**
[Dicas sobre moeda local e custos]

🍽️ **Gastronomia:**
[Pratos típicos e restaurantes]

📱 **Dicas Importantes:**
[Informações práticas e culturais]

🎒 **O que levar:**
[Itens essenciais para a bagagem]`;

  console.log("📋 Prompt para dicas construído");
  
  return prompt;
}

// ================================================================================
// 🔄 INTEGRAÇÃO COM SISTEMA PRINCIPAL
// ================================================================================

// Função para habilitar botão de dicas (chamada pelo sistema principal)
function habilitarBotaoDicas() {
  const btnDicas = document.getElementById('btnGerarDicas');
  
  if (btnDicas) {
    btnDicas.disabled = false;
    btnDicas.title = "Clique para gerar dicas do destino";
    console.log("✅ Botão de dicas habilitado");
  }
}

// Função para desabilitar botão de dicas
function desabilitarBotaoDicas() {
  const btnDicas = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  if (btnDicas) {
    btnDicas.disabled = true;
    btnDicas.title = "Gere um orçamento primeiro";
  }
  
  if (btnCopiar) {
    btnCopiar.style.display = 'none';
  }
  
  console.log("❌ Botão de dicas desabilitado");
}

// Função para resetar área de dicas
function resetarDicas() {
  updateElement('destinoIA', 'Clique em "Gerar Dicas" após criar um orçamento para obter informações personalizadas sobre o destino...');
  desabilitarBotaoDicas();
  
  console.log("🔄 Área de dicas resetada");
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE (Para debug)
// ================================================================================

function testarExtracaoInformacoes() {
  console.log("🧪 Testando extração de informações...");
  
  const orcamentoTeste = `📍 Orlando - Flórida
🗓️ 05 de mar - 15 de mar (11 dias e 10 noites)
👥 2 adultos + 2 crianças (02 e 04 anos)

*O Pacote Inclui:*
- Aéreo ida e volta com Avianca
- Taxas de embarque
- 01 mala de mão + item pessoal por pessoa
- 10 noites em hotel com café da manhã`;

  // Simular orçamento na interface
  updateElement('orcamentoIA', orcamentoTeste);
  
  // Extrair informações
  const info = extrairInformacoesViagem();
  
  console.log("🎯 Teste concluído:", info);
  
  return info;
}

// ================================================================================
// 📊 LOGS E INICIALIZAÇÃO
// ================================================================================

console.log("✅ Módulo ai-dicas.js carregado completamente!");
console.log("🎯 Funcionalidades disponíveis:");
console.log("- gerarDicasDestino(): Função principal");
console.log("- extrairInformacoesViagem(): Extrai dados do orçamento");
console.log("- habilitarBotaoDicas(): Habilita interface");
console.log("- testarExtracaoInformacoes(): Função de teste");
