// 🏨 ai-ranking.js - Módulo de Ranking de Hotéis
// Gera ranking detalhado de hotéis com avaliações e informações específicas

console.log("🏨 Módulo de Ranking de Hotéis carregado");

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE RANKING DE HOTÉIS
// ================================================================================

async function generateRankingHoteis(destinoManual = '') {
  const btnGerar = document.getElementById('btnGerarRanking');
  const btnCopiar = document.getElementById('btnCopiarRanking');
  
  if (!btnGerar) {
    console.error('❌ Botão ranking não encontrado');
    return;
  }
  
  try {
    // Desabilitar botão e mostrar progresso
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Analisando hotéis...';
    
    // Determinar destino
    const destino = destinoManual || extrairDestinoParaRanking();
    
    if (!destino) {
      throw new Error('Destino não identificado. Certifique-se de que há hotéis no orçamento!');
    }
    
    console.log("🎯 Gerando ranking para:", destino);
    
    // Extrair hotéis do orçamento se houver
    const hoteisOrcamento = extrairHoteisDoOrcamento();
    
    // Atualizar progresso
    btnGerar.innerHTML = '🏆 Buscando rankings...';
    
    // Gerar ranking com IA
    const ranking = await gerarRankingComIA(destino, hoteisOrcamento);
    
    // Atualizar interface
    updateElement('rankingIA', ranking);
    
    // Mostrar botão de copiar
    if (btnCopiar) {
      btnCopiar.style.display = 'inline-block';
    }
    
    console.log("✅ Ranking gerado com sucesso!");
    
    return ranking;
    
  } catch (error) {
    console.error("❌ Erro ao gerar ranking:", error);
    updateElement('rankingIA', `❌ Erro: ${error.message}`);
    
  } finally {
    // Restaurar botão
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🏆 Gerar Ranking';
  }
}

// ================================================================================
// 🔍 EXTRAÇÃO DE INFORMAÇÕES DE HOTÉIS
// ================================================================================

function extrairDestinoParaRanking() {
  console.log("🎯 Extraindo destino para ranking...");
  
  // Primeiro tentar do estado global
  if (estadoGlobal && estadoGlobal.ultimoDestino) {
    console.log("✅ Destino do estado global:", estadoGlobal.ultimoDestino);
    return estadoGlobal.ultimoDestino;
  }
  
  // Depois tentar extrair do orçamento
  const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
  
  if (orcamentoTexto && orcamentoTexto !== 'Preencha o formulário acima para gerar o orçamento...') {
    const destino = extrairDestino(orcamentoTexto);
    if (destino) {
      console.log("✅ Destino do orçamento:", destino);
      return destino;
    }
  }
  
  // Por último, tentar do campo manual
  const destinoManual = document.getElementById('destino')?.value?.trim();
  if (destinoManual) {
    console.log("✅ Destino manual:", destinoManual);
    return destinoManual;
  }
  
  console.log("⚠️ Destino não encontrado para ranking");
  return '';
}

function extrairHoteisDoOrcamento() {
  console.log("🏨 Extraindo hotéis do orçamento...");
  
  const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
  
  if (!orcamentoTexto) {
    console.log("⚠️ Nenhum orçamento encontrado");
    return [];
  }
  
  const hoteis = [];
  
  // Padrões para identificar hotéis no orçamento
  const padroes = [
    // Padrão: 1. Nome do Hotel – R$ preço
    /(\d+)\.\s*([^–\-\n]+?)\s*[–\-]\s*(R\$\s*[\d.,]+)/gi,
    // Padrão: Hotel Name - $ preço
    /([A-Z][^-\n]+?)\s*-\s*(R\$\s*[\d.,]+)/gi,
    // Padrão: 🏨 Hotel Name
    /🏨\s*([^\n\r]+)/gi
  ];
  
  padroes.forEach((padrao, index) => {
    let match;
    while ((match = padrao.exec(orcamentoTexto)) !== null) {
      const hotel = {
        numero: match[1] || (hoteis.length + 1),
        nome: (match[2] || match[1]).trim(),
        preco: match[3] || 'Consulte',
        fonte: `Padrão ${index + 1}`
      };
      
      // Evitar duplicatas
      if (!hoteis.some(h => h.nome.toLowerCase() === hotel.nome.toLowerCase())) {
        hoteis.push(hotel);
      }
    }
  });
  
  console.log("🏨 Hotéis encontrados:", hoteis);
  
  return hoteis;
}

// ================================================================================
// 🤖 GERAÇÃO DE RANKING COM IA
// ================================================================================

async function gerarRankingComIA(destino, hoteisOrcamento = []) {
  console.log("🤖 Gerando ranking com IA...");
  
  const prompt = construirPromptRanking(destino, hoteisOrcamento);
  
  const requestData = {
    prompt: prompt,
    tipo: 'ranking-hoteis',
    modelo: 'gpt-4o-mini',
    maxTokens: 2000,
    metadata: {
      destino: destino,
      hoteisEncontrados: hoteisOrcamento.length,
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
  
  const ranking = data.choices[0].message.content;
  
  console.log("✅ Ranking gerado:", ranking.length, "caracteres");
  
  return ranking;
}

function construirPromptRanking(destino, hoteisOrcamento) {
  console.log("📝 Construindo prompt para ranking...");
  
  let prompt = `RANKING DE HOTÉIS PARA WHATSAPP - CVC ITAQUA

DESTINO: ${destino}`;

  if (hoteisOrcamento && hoteisOrcamento.length > 0) {
    prompt += `\n\nHOTÉIS DO ORÇAMENTO:`;
    hoteisOrcamento.forEach((hotel, index) => {
      prompt += `\n${index + 1}. ${hotel.nome} - ${hotel.preco}`;
    });
    prompt += `\n\nINCLUIR ESTES HOTÉIS NO RANKING COM PRIORIDADE`;
  }

  prompt += `\n\nINSTRUÇÕES OBRIGATÓRIAS:
1. 🏆 FORMATO: Ranking específico para ${destino}
2. 📱 WHATSAPP: Ideal para envio (emojis, formatação limpa)
3. ⭐ AVALIAÇÕES: Incluir notas do TripAdvisor/Booking/Google
4. 📍 LOCALIZAÇÃO: Distância dos principais pontos turísticos
5. 💡 POSITIVOS: Focar apenas nos pontos fortes dos hotéis
6. 🎯 QUANTIDADE: 5-8 hotéis no ranking
7. 💰 FAIXA DE PREÇO: Variada (econômico, médio, luxo)

FORMATO OBRIGATÓRIO:

🏆 **RANKING DE HOTÉIS - ${destino.toUpperCase()}**

🥇 **1º LUGAR - [Nome do Hotel]**
⭐ Avaliação: [X,X]/10 ([Fonte])
📍 Localização: [Região/Distância]
✨ Destaques: [2-3 pontos positivos principais]
💰 Categoria: [Econômico/Médio/Luxo]

🥈 **2º LUGAR - [Nome do Hotel]**
⭐ Avaliação: [X,X]/10 ([Fonte])
📍 Localização: [Região/Distância]
✨ Destaques: [2-3 pontos positivos principais]
💰 Categoria: [Econômico/Médio/Luxo]

[Continuar até 5-8 hotéis]

🎯 **DICA ESPECIAL:**
[Uma dica valiosa sobre hospedagem em ${destino}]

IMPORTANTES:
- Use avaliações REAIS e atuais
- Mencione apenas aspectos POSITIVOS
- Seja específico sobre localização
- Inclua hotéis de diferentes categorias
- Formato limpo para copy/paste`;

  console.log("📋 Prompt para ranking construído");
  
  return prompt;
}

// ================================================================================
// 🔄 INTEGRAÇÃO COM SISTEMA PRINCIPAL
// ================================================================================

// Função para habilitar botão de ranking (chamada pelo sistema principal)
function habilitarBotaoRanking() {
  const btnRanking = document.getElementById('btnGerarRanking');
  
  if (btnRanking) {
    // Verificar se tem hotel no orçamento
    const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
    const temHotel = /hotel|hospedagem|accommodation|🏨/i.test(orcamentoTexto);
    
    if (temHotel) {
      btnRanking.disabled = false;
      btnRanking.title = "Clique para gerar ranking de hotéis";
      console.log("✅ Botão de ranking habilitado");
    } else {
      btnRanking.disabled = true;
      btnRanking.title = "Orçamento deve incluir hotéis";
      console.log("⚠️ Botão de ranking não habilitado - sem hotéis");
    }
  }
}

// Função para desabilitar botão de ranking
function desabilitarBotaoRanking() {
  const btnRanking = document.getElementById('btnGerarRanking');
  const btnCopiar = document.getElementById('btnCopiarRanking');
  
  if (btnRanking) {
    btnRanking.disabled = true;
    btnRanking.title = "Selecione 'Hotel' e gere um orçamento primeiro";
  }
  
  if (btnCopiar) {
    btnCopiar.style.display = 'none';
  }
  
  console.log("❌ Botão de ranking desabilitado");
}

// Função para resetar área de ranking
function resetarRanking() {
  updateElement('rankingIA', 'Será gerado automaticamente se você selecionar "Hotel" ou clique em "Gerar Ranking"...');
  desabilitarBotaoRanking();
  
  console.log("🔄 Área de ranking resetada");
}

// Função para auto-gerar ranking quando apropriado
function autoGerarRankingSeNecessario(tipos) {
  if (tipos && tipos.includes("Hotel")) {
    console.log("🎯 Auto-gerando ranking de hotéis...");
    
    // Aguardar um pouco para o orçamento ser processado
    setTimeout(() => {
      const destino = extrairDestinoParaRanking();
      if (destino) {
        generateRankingHoteis(destino);
      }
    }, 2000);
  }
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE (Para debug)
// ================================================================================

function testarExtracaoHoteis() {
  console.log("🧪 Testando extração de hotéis...");
  
  const orcamentoTeste = `📍 Orlando - Flórida
🗓️ 05 de mar - 15 de mar (11 dias e 10 noites)

🏨 Opções de Hotéis:
1. Magic Moment Resort & Kids Club – R$ 14.069,19
2. Palazzo Lakeside Hotel – R$ 12.590,76
3. Universal's Endless Summer Resort - R$ 16.240,50`;

  // Simular orçamento na interface
  updateElement('orcamentoIA', orcamentoTeste);
  
  // Extrair hotéis
  const hoteis = extrairHoteisDoOrcamento();
  const destino = extrairDestinoParaRanking();
  
  console.log("🎯 Teste concluído:");
  console.log("- Destino:", destino);
  console.log("- Hotéis:", hoteis);
  
  return { destino, hoteis };
}

// ================================================================================
// 🔧 UTILITÁRIOS DE HOTÉIS
// ================================================================================

// Função para detectar se orçamento tem hotéis
function orcamentoTemHoteis() {
  const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
  return /hotel|hospedagem|accommodation|🏨|resort|pousada/i.test(orcamentoTexto);
}

// Função para extrair categoria de hotel
function extrairCategoriaHotel(nomeHotel) {
  const nome = nomeHotel.toLowerCase();
  
  if (/resort|luxury|deluxe|premium|five|5|★★★★★/i.test(nome)) {
    return 'Luxo';
  } else if (/express|inn|budget|economy|2|3|★★|★★★/i.test(nome)) {
    return 'Econômico';
  } else {
    return 'Médio';
  }
}

// Função para formatar preço de hotel
function formatarPrecoHotel(preco) {
  if (!preco || typeof preco !== 'string') return 'Consulte';
  
  // Limpar e formatar
  const precoLimpo = preco.replace(/[^\d.,]/g, '');
  
  if (precoLimpo) {
    return `R$ ${precoLimpo}`;
  }
  
  return 'Consulte';
}

// ================================================================================
// 📊 LOGS E INICIALIZAÇÃO
// ================================================================================

console.log("✅ Módulo ai-ranking.js carregado completamente!");
console.log("🏆 Funcionalidades disponíveis:");
console.log("- generateRankingHoteis(): Função principal");
console.log("- extrairHoteisDoOrcamento(): Extrai hotéis do orçamento");
console.log("- habilitarBotaoRanking(): Habilita interface");
console.log("- autoGerarRankingSeNecessario(): Auto-geração");
console.log("- testarExtracaoHoteis(): Função de teste");
