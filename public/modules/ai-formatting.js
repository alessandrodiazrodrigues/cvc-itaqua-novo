// 🎨 ai-formatting.js - Módulo de Formatação de Texto
// Responsável por aplicar formatações e limpezas no texto gerado pela IA

console.log("🎨 Módulo de Formatação carregado");

// ================================================================================
// ✈️ FORMATAÇÃO DE AEROPORTOS
// ================================================================================

function formatAirports(text) {
  try {
    console.log("✈️ Aplicando formatação de aeroportos...");
    
    // Remove informações redundantes entre parênteses de aeroportos
    let formatted = text
      // 1. CASOS ESPECÍFICOS - Cidade (Aeroporto) → Aeroporto
      // Casos complexos com duplo parênteses: "São Paulo (Guarulhos (SP))" → "Guarulhos"
      .replace(/São Paulo\s*\(Guarulhos\s*\([^)]*\)\)/gi, 'Guarulhos')
      .replace(/São Paulo\s*\(Congonhas\s*\([^)]*\)\)/gi, 'Congonhas')
      .replace(/São Paulo\s*\(Viracopos\s*\([^)]*\)\)/gi, 'Viracopos')
      .replace(/Rio de Janeiro\s*\(Galeão\s*\([^)]*\)\)/gi, 'Galeão')
      .replace(/Rio de Janeiro\s*\(Santos Dumont\s*\([^)]*\)\)/gi, 'Santos Dumont')
      
      // Casos simples - Cidade (Aeroporto) → Aeroporto
      .replace(/São Paulo\s*\(Guarulhos\)/gi, 'Guarulhos')
      .replace(/São Paulo\s*\(Congonhas\)/gi, 'Congonhas')  
      .replace(/São Paulo\s*\(Viracopos\)/gi, 'Viracopos')
      .replace(/Rio de Janeiro\s*\(Galeão\)/gi, 'Galeão')
      .replace(/Rio de Janeiro\s*\(Santos Dumont\)/gi, 'Santos Dumont')
      
      // 2. AEROPORTOS ESPECÍFICOS COM SIGLAS
      .replace(/Congonhas\s*\(SP\)/gi, 'Congonhas')
      .replace(/Guarulhos\s*\(SP\)/gi, 'Guarulhos')
      .replace(/Viracopos\s*\(SP\)/gi, 'Viracopos')
      .replace(/Campinas\s*Viracopos\s*\(SP\)/gi, 'Viracopos')
      
      // Aeroportos do Rio de Janeiro
      .replace(/Galeão\s*\(RJ\)/gi, 'Galeão')
      .replace(/Santos Dumont\s*\(RJ\)/gi, 'Santos Dumont')
      
      // 3. PADRÃO: "Cidade Aeroporto (Estado)" → "Aeroporto"
      // Ex: "São Paulo Guarulhos (SP)" → "Guarulhos"
      .replace(/(?:São Paulo|Rio de Janeiro|Brasília|Belo Horizonte|Curitiba|Salvador|Recife|Fortaleza)\s+([A-Za-zÀ-ÿ\s]+)\s*\([A-Z]{2}\)/gi, '$1')
      
      // 4. PADRÃO GERAL: Nome longo com sigla → Nome principal
      .replace(/([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*)\s*\([A-Z]{2,3}\)/g, function(match, nome) {
        // Se o nome tem múltiplas palavras, pega a última (que geralmente é o aeroporto)
        const palavras = nome.trim().split(/\s+/);
        return palavras.length > 1 ? palavras[palavras.length - 1] : palavras[0];
      })
      
      // 5. REMOVE CÓDIGOS IATA ISOLADOS
      .replace(/\s*\([A-Z]{3}\)/g, '')
      
      // 6. CASOS ESPECIAIS DE FORMATAÇÃO
      .replace(/Aeroporto\s+Internacional\s+de\s+([A-Za-zÀ-ÿ\s]+)/gi, '$1')
      .replace(/Aeroporto\s+([A-Za-zÀ-ÿ\s]+)/gi, '$1')
      
      // 7. LIMPA ESPAÇOS DUPLOS E TRIM
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    console.log("✅ Formatação de aeroportos aplicada");
    return formatted;
    
  } catch (error) {
    console.error("❌ Erro na formatação de aeroportos:", error);
    return text;
  }
}

// ================================================================================
// 🔗 FILTRO DE LINKS CONDICIONAIS
// ================================================================================

function conditionalLinks(text) {
  try {
    console.log("🔗 Filtrando links válidos...");
    
    // 1. REMOVE PLACEHOLDERS DE LINKS GENÉRICOS - VERSÃO APRIMORADA
    let formatted = text
      // Remove colchetes com diferentes tipos de texto
      .replace(/\[LINK[^\]]*\]/gi, '')
      .replace(/\[CLIQUE[^\]]*\]/gi, '')
      .replace(/\[ACESSE[^\]]*\]/gi, '')
      .replace(/\[VEJA[^\]]*\]/gi, '')
      .replace(/\[CONFIRA[^\]]*\]/gi, '')
      .replace(/\[SAIBA[^\]]*\]/gi, '')
      .replace(/\[CONSULTE[^\]]*\]/gi, '')
      .replace(/\[RESERVE[^\]]*\]/gi, '')
      
      // Remove parágrafos genéricos de link
      .replace(/.*\[LINK\s+[A-Z\s]+\].*/gi, '')
      .replace(/.*\[.*MAIS.*INFORMAÇÕES.*\].*/gi, '')
      
      // Remove URLs quebradas ou placeholders
      .replace(/https?:\/\/www\.exemplo[^\s]*/gi, '')
      .replace(/https?:\/\/[a-z-]+\.com\.br\/exemplo[^\s]*/gi, '')
      
      // Remove texto genérico de links
      .replace(/Link para mais informações[:.]*\s*/gi, '')
      .replace(/Clique aqui para[^\n]*/gi, '')
      .replace(/Acesse o link[^\n]*/gi, '')
      .replace(/Mais detalhes em[^\n]*/gi, '')
      .replace(/Para mais informações[^\n]*/gi, '');
    
    // 2. FILTRA LINHAS COM LINKS
    formatted = formatted
      .split('\n')
      .filter(line => {
        const lineTrimmed = line.trim();
        
        // Remove linhas vazias que sobraram da remoção de links
        if (!lineTrimmed) return false;
        
        // Se a linha contém "http" ou "www", verifica se é um link válido
        if (lineTrimmed.includes('http') || lineTrimmed.includes('www')) {
          // Mantém apenas se começar com http:// ou https://
          return /https?:\/\/[a-zA-Z0-9][^\s]*\.[a-zA-Z]{2,}/.test(lineTrimmed);
        }
        
        // Remove linhas que são apenas indicadores de link sem URL real
        const linkIndicators = [
          /^link:/i,
          /^url:/i,
          /^website:/i,
          /^site:/i,
          /^acesse:/i,
          /^confira:/i,
          /^veja em:/i,
          /^mais em:/i,
          /^detalhes:/i
        ];
        
        // Se a linha começa com indicador de link mas não tem URL válida
        const temIndicadorLink = linkIndicators.some(regex => regex.test(lineTrimmed));
        if (temIndicadorLink && !/https?:\/\//.test(lineTrimmed)) {
          return false;
        }
        
        // Mantém todas as outras linhas
        return true;
      })
      .join('\n');
    
    // 3. REMOVE FRASES COMUNS DE PLACEHOLDER
    formatted = formatted
      .replace(/.*\[LINK PARA.*\].*/gi, '')
      .replace(/.*Para reservas, acesse.*[^http].*/gi, '')
      .replace(/.*Entre em contato.*[^http].*/gi, '')
      .replace(/.*Mais informações disponíveis.*[^http].*/gi, '')
      .replace(/.*Consulte nosso site.*[^http].*/gi, '')
      .replace(/.*Visite nossa página.*[^http].*/gi, '');
    
    // 4. LIMPA LINHAS VAZIAS RESULTANTES
    formatted = formatted
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
    
    console.log("✅ Filtro de links aplicado");
    return formatted;
    
  } catch (error) {
    console.error("❌ Erro no filtro de links:", error);
    return text;
  }
}

// ================================================================================
// 📋 LIMPEZA DE CABEÇALHOS TÉCNICOS
// ================================================================================

function cleanHeaders(text) {
  try {
    console.log("📋 Removendo cabeçalhos técnicos...");
    
    // Lista de cabeçalhos técnicos para remover
    const technicalHeaders = [
      'DADOS DO CLIENTE:',
      'PRODUTO SELECIONADO:',
      'INFORMAÇÕES TÉCNICAS:',
      'DETALHES TÉCNICOS:',
      'CONFIGURAÇÕES:',
      'PARÂMETROS:',
      'SISTEMA:',
      'PROCESSAMENTO:',
      'RESULTADO:',
      'OUTPUT:',
      'INPUT:',
      'RESPOSTA:',
      'SOLICITAÇÃO:',
      'REQUISIÇÃO:'
    ];
    
    let formatted = text;
    
    // Remove cabeçalhos técnicos (case insensitive)
    technicalHeaders.forEach(header => {
      const regex = new RegExp(`^\\s*${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'gmi');
      formatted = formatted.replace(regex, '');
    });
    
    // Remove linhas que são apenas marcadores ou separadores
    formatted = formatted
      .replace(/^[-=_*]{3,}$/gm, '') // Remove linhas de separadores
      .replace(/^\s*[#*-]\s*$/gm, '') // Remove marcadores isolados
      .replace(/^\s*\.\.\.\s*$/gm, ''); // Remove "..."
    
    console.log("✅ Cabeçalhos técnicos removidos");
    return formatted;
    
  } catch (error) {
    console.error("❌ Erro na limpeza de cabeçalhos:", error);
    return text;
  }
}

// ================================================================================
// 💰 FORMATAÇÃO DE PREÇOS
// ================================================================================

function formatPrices(text) {
  try {
    console.log("💰 Formatando valores monetários...");
    
    let formatted = text;
    
    // Normaliza diferentes formatos de R$ para "R$ 1.234,56"
    formatted = formatted
      // R$1234.56 -> R$ 1.234,56
      .replace(/R\$\s*(\d{1,3})(\d{3})\.(\d{2})/g, 'R$ $1.$2,$3')
      
      // R$1234,56 -> R$ 1.234,56
      .replace(/R\$\s*(\d{1,3})(\d{3}),(\d{2})/g, 'R$ $1.$2,$3')
      
      // R$ 1234.56 -> R$ 1.234,56
      .replace(/R\$\s+(\d{1,3})(\d{3})\.(\d{2})/g, 'R$ $1.$2,$3')
      
      // R$ 1234,56 (já formatado, apenas garante espaço)
      .replace(/R\$(\d)/g, 'R$ $1')
      
      // Para valores maiores com mais dígitos
      .replace(/R\$\s*(\d{1,3})(\d{3})(\d{3})\.(\d{2})/g, 'R$ $1.$2.$3,$4')
      .replace(/R\$\s*(\d{1,3})(\d{3})(\d{3}),(\d{2})/g, 'R$ $1.$2.$3,$4')
      
      // Corrige valores simples (R$123 -> R$ 123,00)
      .replace(/R\$\s*(\d{1,3})(?![.,\d])/g, 'R$ $1,00')
      
      // Remove espaços duplos entre R$ e valor
      .replace(/R\$\s{2,}/g, 'R$ ');
    
    console.log("✅ Formatação de preços aplicada");
    return formatted;
    
  } catch (error) {
    console.error("❌ Erro na formatação de preços:", error);
    return text;
  }
}

// ================================================================================
// 📏 OTIMIZAÇÃO DE ESPAÇAMENTO
// ================================================================================

function optimizeSpacing(text) {
  try {
    console.log("📏 Otimizando espaçamento...");
    
    let formatted = text
      // 1. FORMATAÇÃO DE HORÁRIOS: "23: 30" → "23:30", "8 : 15" → "08:15"
      .replace(/(\d{1,2})\s*:\s*(\d{2})/g, (match, horas, minutos) => {
        // Adiciona zero à esquerda se necessário
        const h = horas.padStart(2, '0');
        const m = minutos.padStart(2, '0');
        return `${h}:${m}`;
      })
      
      // 2. FORMATAÇÃO DE DATAS: "17 / 01" → "17/01"
      .replace(/(\d{1,2})\s*\/\s*(\d{1,2})/g, '$1/$2')
      
      // 3. Remove quebras de linha excessivas (mais de 2 seguidas)
      .replace(/\n{3,}/g, '\n\n')
      
      // 4. Remove espaços no final das linhas
      .replace(/[ \t]+$/gm, '')
      
      // 5. Remove espaços no início das linhas (exceto indentação intencional)
      .replace(/^[ \t]+/gm, '')
      
      // 6. Normaliza espaços entre palavras
      .replace(/[ \t]{2,}/g, ' ')
      
      // 7. Remove linhas vazias no início e fim
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      
      // 8. CORREÇÃO DE PONTUAÇÃO
      // Garante que não há espaços antes de pontuação
      .replace(/\s+([.,!?;:])/g, '$1')
      
      // Garante espaço após pontuação (exceto no final da linha)
      .replace(/([.,!?;:])(?=[^\s\n])/g, '$1 ')
      
      // 9. CORREÇÃO DE PARÊNTESES
      // Remove espaços antes de parênteses de fechamento
      .replace(/\s+\)/g, ')')
      
      // Remove espaços desnecessários após parênteses de abertura
      .replace(/\(\s+/g, '(')
      
      // 10. FORMATAÇÃO DE SETAS E CONECTORES
      // Padroniza setas: "→", "->", " → " para " → "
      .replace(/\s*[-=]+>\s*/g, ' → ')
      .replace(/\s*→\s*/g, ' → ')
      
      // 11. FORMATAÇÃO DE HÍFENS
      // Hífens em intervalos: " - " (com espaços)
      .replace(/\s*-\s*/g, ' - ')
      
      // 12. FORMATAÇÃO DE VALORES MONETÁRIOS APRIMORADA
      // "R$ 1.234 , 56" → "R$ 1.234,56"
      .replace(/(R\$\s*[\d.]+)\s*,\s*(\d{2})/g, '$1,$2')
      
      // "R$1.234,56" → "R$ 1.234,56" (garante espaço após R$)
      .replace(/R\$(\d)/g, 'R$ $1')
      
      // Corrige espaços excessivos em valores: "R$  1.234" → "R$ 1.234"
      .replace(/R\$\s{2,}/g, 'R$ ')
      
      // Valores sem vírgula: "R$ 1234" → "R$ 1.234,00" (valores acima de 999)
      .replace(/R\$\s*(\d{1,3})(\d{3})(?![,.])/g, 'R$ $1.$2,00')
      
      // 13. CORREÇÃO DE ESPAÇOS EM CÓDIGOS
      // "CGH → GRU" mantém formatação correta
      .replace(/([A-Z]{3})\s*→\s*([A-Z]{3})/g, '$1 → $2');
    
    // 14. Remove múltiplas linhas vazias consecutivas que possam ter sobrado
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    console.log("✅ Espaçamento otimizado");
    return formatted.trim();
    
  } catch (error) {
    console.error("❌ Erro na otimização de espaçamento:", error);
    return text;
  }
}

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE FORMATAÇÃO
// ================================================================================

function formatText(text) {
  try {
    console.log("🎯 Iniciando formatação completa do texto...");
    
    if (!text || typeof text !== 'string') {
      console.warn("⚠️ Texto inválido para formatação");
      return text || '';
    }
    
    // ETAPA 1: ANÁLISE PRÉVIA (antes de modificar o texto)
    // Preserva informações importantes para detecção de ida/volta
    const textoOriginal = text.toLowerCase();
    let isIdaVolta = false;
    
    // Verifica se tem detecção de ida e volta disponível
    if (typeof detectarIdaVolta === 'function') {
      isIdaVolta = detectarIdaVolta(textoOriginal);
      console.log(`🔍 Detecção ida/volta: ${isIdaVolta ? 'SIM' : 'NÃO'}`);
    }
    
    // ETAPA 2: FORMATAÇÕES SEQUENCIAIS
    let formatted = text;
    
    // Aplica todas as formatações em sequência otimizada
    formatted = formatAirports(formatted);
    formatted = conditionalLinks(formatted);  
    formatted = cleanHeaders(formatted);
    formatted = formatPrices(formatted);
    formatted = optimizeSpacing(formatted);
    
    // ETAPA 3: INFORMAÇÕES DE DEBUG (apenas em desenvolvimento)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log("📊 Resultado da formatação:");
      console.log(`   Texto original: ${text.length} caracteres`);
      console.log(`   Texto formatado: ${formatted.length} caracteres`);
      console.log(`   Ida e volta detectado: ${isIdaVolta ? '✅' : '❌'}`);
    }
    
    console.log("✅ Formatação completa aplicada");
    
    return formatted;
    
  } catch (error) {
    console.error("❌ Erro na formatação completa:", error);
    return text;
  }
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE PARA FORMATAÇÃO COMPLETA
// ================================================================================

function testarFormatacaoCompleta() {
  console.log("🧪 Testando formatação completa...");
  
  const textoTeste = `
📍 Orlando - Disney World (Estados Unidos)

🗓️ Saída: 17 de janeiro
🗓️ Retorno: 23 de janeiro

✈️ VOO DE IDA
São Paulo (Guarulhos) → Miami (EUA) → Orlando (EUA)
Saída: 23: 30 - Chegada: 18 : 45
Companhia: LATAM + American Airlines

✈️ VOO DE VOLTA  
Orlando (EUA) → Miami (EUA) → São Paulo (Guarulhos)
Saída: 08 : 15 - Chegada: 23: 30 (+1 dia)

💰 VALOR TOTAL: R$12.850 , 00 por pessoa

[LINK PARA RESERVAS]
Para mais informações, acesse nosso site
Link: www.exemplo-nao-valido.com.br

DADOS DO CLIENTE: João Silva
INFORMAÇÕES TÉCNICAS: Sistema processado
`;

  const resultado = formatText(textoTeste);
  
  console.log("📊 RESULTADO DO TESTE:");
  console.log("Texto formatado:");
  console.log(resultado);
  
  // Verificações específicas
  const verificacoes = [
    {
      nome: "Aeroportos formatados",
      teste: !resultado.includes("São Paulo (Guarulhos)") && resultado.includes("Guarulhos"),
      esperado: true
    },
    {
      nome: "Horários formatados", 
      teste: !resultado.includes("23: 30") && resultado.includes("23:30"),
      esperado: true
    },
    {
      nome: "Links removidos",
      teste: !resultado.includes("[LINK PARA RESERVAS]"),
      esperado: true
    },
    {
      nome: "Cabeçalhos técnicos removidos",
      teste: !resultado.includes("DADOS DO CLIENTE:"),
      esperado: true
    },
    {
      nome: "Preços formatados",
      teste: resultado.includes("R$ 12.850,00"),
      esperado: true
    }
  ];
  
  let acertos = 0;
  verificacoes.forEach(verificacao => {
    const passou = verificacao.teste === verificacao.esperado;
    console.log(`${passou ? '✅' : '❌'} ${verificacao.nome}`);
    if (passou) acertos++;
  });
  
  console.log(`\n📊 Resultado: ${acertos}/${verificacoes.length} testes passaram`);
  
  return { acertos, total: verificacoes.length, resultado };
}

// ================================================================================
// 📤 EXPORTAÇÃO COMPATÍVEL COM SISTEMA CVC
// ================================================================================

// Compatibilidade com sistema de módulos existente
if (typeof window !== 'undefined') {
  // Browser environment - adiciona ao objeto global
  window.formatText = formatText;
  window.formatAirports = formatAirports;
  window.conditionalLinks = conditionalLinks;
  window.cleanHeaders = cleanHeaders;
  window.formatPrices = formatPrices;
  window.optimizeSpacing = optimizeSpacing;
}

// Exportação para sistemas que suportam modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatText,
    formatAirports,
    conditionalLinks,
    cleanHeaders,
    formatPrices,
    optimizeSpacing
  };
}

// ================================================================================
// 🚀 EXECUÇÃO AUTOMÁTICA DE TESTES EM DESENVOLVIMENTO
// ================================================================================

// Executar teste automaticamente em desenvolvimento
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Aguarda 2 segundos para carregar completamente e depois testa
  setTimeout(() => {
    console.log("\n🧪 === TESTES AUTOMÁTICOS DO AI-FORMATTING ===");
    testarFormatacaoCompleta();
    console.log("🧪 === FIM DOS TESTES ===\n");
  }, 2000);
}

console.log("✅ Módulo ai-formatting.js carregado e pronto para uso");