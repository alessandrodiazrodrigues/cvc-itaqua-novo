// 📋 api/modules/templates.js - v8.2 - CORREÇÃO CRÍTICA DE SINTAXE
// CORREÇÃO: Estrutura da função aplicarTemplateCompleto corrigida
// CORREÇÃO: Todos os objetos e funções com sintaxe ES6 válida

console.log("📋 Templates v8.2 - CORREÇÃO CRÍTICA DE SINTAXE APLICADA");

// ================================================================================
// 🎯 TEMPLATES BÁSICOS PARA FUNCIONAMENTO
// ================================================================================

const TEMPLATES_MANUAIS = {
  'aereo_nacional_simples': {
    detectar: (dados) => {
      const texto = dados.toLowerCase();
      return texto.includes('ida') && texto.includes('volta') && !texto.includes('internacional');
    },
    
    template: (data) => `*${data.companhia || 'LATAM'}*
${data.data_ida || 'Data IDA'} - ${data.origem || 'Origem'} ${data.hora_ida || '00:00'} / ${data.destino || 'Destino'} ${data.hora_chegada || '00:00'} (voo direto)
--
${data.data_volta || 'Data VOLTA'} - ${data.destino || 'Destino'} ${data.hora_volta || '00:00'} / ${data.origem || 'Origem'} ${data.hora_chegada_volta || '00:00'} (voo direto)

💰 ${data.valor_total || 'R$ 0.000,00'} para ${data.passageiros || '1 adulto'}
💳 Em até 10x sem juros
✅ 1 mala de 23kg + mochila de mão
🏷️ Tarifa flexível com remarcação gratuita`
  },

  'generico': {
    detectar: (dados) => true,
    template: (data) => `Orçamento CVC Itaqua
Destino: ${data.destino || 'A definir'}
Passageiros: ${data.passageiros || '1 adulto'}
Tipo: ${data.tipos?.join(', ') || 'Geral'}
${data.observacoes ? `Observações: ${data.observacoes}` : ''}`
  }
};

// ================================================================================
// 🎨 REGRAS DE FORMATAÇÃO BÁSICAS
// ================================================================================

const REGRAS_FORMATACAO = {
  VALORES: {
    MOEDA_PADRAO: 'BRL',
    FORMATO_VALOR: 'R$ X.XXX,XX',
    SEPARADOR_MILHARES: '.',
    SEPARADOR_DECIMAL: ','
  },
  HORARIOS: {
    FORMATO: 'HH:MM',
    SEM_ESPACOS: true
  },
  BAGAGEM: {
    PADRAO_NACIONAL: 'Só mala de mão incluída',
    PADRAO_INTERNACIONAL: '2 malas de 23kg + mão'
  }
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE APLICAÇÃO DE TEMPLATE
// ================================================================================

function aplicarTemplateCompleto(formData, analise) {
  console.log("🎯 Aplicando template completo v8.2...");
  
  if (!formData) {
    console.error("❌ FormData vazio");
    return "Erro: Dados do formulário não encontrados";
  }
  
  try {
    let tipoDetectado = 'generico';
    
    // Detectar tipo baseado no texto colado ou análise
    if (formData.textoColado) {
      tipoDetectado = detectarLayoutOrcamento(formData.textoColado);
    } else if (analise && analise.tipoPrincipal) {
      tipoDetectado = mapearTipoParaTemplate(analise.tipoPrincipal);
    }
    
    // Aplicar template se encontrado
    if (TEMPLATES_MANUAIS[tipoDetectado]) {
      const dadosExtraidos = formData.textoColado 
        ? extrairDadosDoTexto(formData.textoColado, tipoDetectado)
        : formData;
      
      const resultado = TEMPLATES_MANUAIS[tipoDetectado].template(dadosExtraidos);
      return aplicarFormatacoesFinais(resultado);
    }
    
    // Fallback para template genérico
    return gerarPromptGenerico(formData, analise);
    
  } catch (error) {
    console.error("❌ Erro ao aplicar template:", error);
    return gerarPromptGenerico(formData, analise);
  }
}

// ================================================================================
// 🔍 DETECÇÃO INTELIGENTE DE LAYOUT
// ================================================================================

function detectarLayoutOrcamento(textoColado) {
  console.log("🔍 Detectando layout do orçamento...");
  
  if (!textoColado) {
    return 'generico';
  }
  
  const texto = textoColado.toLowerCase();
  
  // Verificar cada template na ordem de prioridade
  for (const [tipo, template] of Object.entries(TEMPLATES_MANUAIS)) {
    if (template.detectar && template.detectar(texto)) {
      console.log(`✅ Layout detectado: ${tipo}`);
      return tipo;
    }
  }
  
  console.log("🤷 Usando layout genérico");
  return 'generico';
}

// ================================================================================
// 🗺️ MAPEAMENTO DE TIPOS DE ANÁLISE PARA TEMPLATES
// ================================================================================

function mapearTipoParaTemplate(tipoPrincipal) {
  const mapeamento = {
    'aereo_nacional': 'aereo_nacional_simples',
    'aereo_internacional': 'generico',
    'multitrecho': 'generico',
    'cruzeiro': 'generico',
    'hotel': 'generico',
    'pacote': 'generico'
  };
  
  return mapeamento[tipoPrincipal] || 'generico';
}

// ================================================================================
// 📤 EXTRAÇÃO DE DADOS DO TEXTO
// ================================================================================

function extrairDadosDoTexto(texto, tipoTemplate) {
  console.log(`📤 Extraindo dados para template: ${tipoTemplate}`);
  
  const dadosExtraidos = {
    textoOriginal: texto,
    companhia: extrairCompanhia(texto),
    origem: extrairOrigem(texto),
    destino: extrairDestino(texto),
    valor_total: extrairValor(texto),
    passageiros: extrairPassageiros(texto)
  };
  
  console.log("✅ Dados extraídos:", Object.keys(dadosExtraidos));
  return dadosExtraidos;
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES DE EXTRAÇÃO
// ================================================================================

function extrairCompanhia(texto) {
  const companhias = ['LATAM', 'GOL', 'AZUL', 'TAP', 'LUFTHANSA'];
  for (const companhia of companhias) {
    if (texto.toUpperCase().includes(companhia)) {
      return companhia;
    }
  }
  return 'LATAM';
}

function extrairOrigem(texto) {
  const aeroportos = {
    'GRU': 'São Paulo/Guarulhos',
    'CGH': 'São Paulo/Congonhas', 
    'SDU': 'Rio de Janeiro/Santos Dumont',
    'GIG': 'Rio de Janeiro/Galeão'
  };
  
  for (const [codigo, nome] of Object.entries(aeroportos)) {
    if (texto.toUpperCase().includes(codigo) || texto.includes(nome)) {
      return codigo;
    }
  }
  return 'GRU';
}

function extrairDestino(texto) {
  const destinos = ['Rio de Janeiro', 'Salvador', 'Recife', 'Fortaleza'];
  for (const destino of destinos) {
    if (texto.includes(destino)) {
      return destino;
    }
  }
  return 'Destino';
}

function extrairValor(texto) {
  const regex = /R\$\s*[\d.,]+/gi;
  const matches = texto.match(regex);
  return matches ? matches[0] : 'R$ 0.000,00';
}

function extrairPassageiros(texto) {
  if (texto.includes('2 adultos')) return '2 adultos';
  if (texto.includes('1 adulto')) return '1 adulto';
  return '1 adulto';
}

// ================================================================================
// 🎨 APLICAÇÃO DE FORMATAÇÕES FINAIS
// ================================================================================

function aplicarFormatacoesFinais(texto) {
  console.log("🎨 Aplicando formatações finais...");
  
  let formatado = texto;
  
  // Formatação de valores
  formatado = formatado.replace(/R\$\s*(\d+)/g, 'R$ $1,00');
  
  // Formatação de horários
  formatado = formatado.replace(/(\d{2}):\s*(\d{2})/g, '$1:$2');
  
  // Limpeza de linhas extras
  formatado = formatado.replace(/\n{3,}/g, '\n\n');
  
  return formatado.trim();
}

// ================================================================================
// 📝 GERAÇÃO DE PROMPT GENÉRICO
// ================================================================================

function gerarPromptGenerico(formData, analise) {
  console.log("📝 Gerando prompt genérico...");
  
  return `Gere um orçamento CVC Itaqua completo e formatado para:

DADOS DA SOLICITAÇÃO:
- Tipos: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Passageiros: ${formData.adultos || 1} adulto(s)${formData.criancas > 0 ? `, ${formData.criancas} criança(s)` : ''}
${formData.observacoes ? `- Observações: ${formData.observacoes}` : ''}

${formData.textoColado ? `INFORMAÇÕES COMPLEMENTARES:
${formData.textoColado}` : ''}

FORMATO OBRIGATÓRIO:
- Use emojis para destacar seções
- Inclua valores em R$ com formatação brasileira
- Adicione informações sobre bagagem e parcelamento
- Mantenha linguagem profissional e atrativa

Gere o orçamento completo e formatado:`;
}

// ================================================================================
// 🏨 FUNÇÕES DE RANKING E DICAS
// ================================================================================

function gerarRankingHoteis(destino) {
  return `🏨 *RANKING DE HOTÉIS - ${destino.toUpperCase()}*

🥇 *1º LUGAR - Hotel Premium*
⭐ 5 estrelas | Centro da cidade
💰 R$ 450,00/noite | Café da manhã incluso
✅ Piscina, Spa, Academia

🥈 *2º LUGAR - Resort Familiar*  
⭐ 4 estrelas | Beira-mar
💰 R$ 320,00/noite | All inclusive disponível
✅ Kids Club, 3 Piscinas

🥉 *3º LUGAR - Hotel Executivo*
⭐ 4 estrelas | Centro de negócios  
💰 R$ 280,00/noite | Business center
✅ Sala de reuniões, Wi-Fi premium

💡 *Dica:* Reserve com antecedência para melhores preços!`;
}

function gerarDicasViagem(destino) {
  return `💡 *DICAS DE VIAGEM - ${destino.toUpperCase()}*

📅 *MELHOR ÉPOCA*
• Alta temporada: Dezembro a Março
• Menor movimento: Abril a Junho
• Preços melhores: Maio e Setembro

🎒 *O QUE LEVAR*
• Roupas leves e protetor solar
• Calçados confortáveis
• Medicamentos pessoais
• Carregador portátil

🗺️ *PONTOS TURÍSTICOS*
• Centro histórico
• Museus locais  
• Praias principais
• Mercados tradicionais

💰 *ORÇAMENTO DIÁRIO*
• Econômico: R$ 150-250/dia
• Médio: R$ 300-500/dia
• Premium: R$ 600+/dia

📱 *Apps Recomendados*
• Uber/99 para transporte
• Google Translate
• Maps offline
• App do clima local`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 CORRIGIDA
// ================================================================================

console.log("✅ Templates v8.2 carregado - SINTAXE CORRIGIDA");

export {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO,
  mapearTipoParaTemplate,
  extrairDadosDoTexto,
  aplicarFormatacoesFinais,
  gerarPromptGenerico,
  gerarRankingHoteis,
  gerarDicasViagem
};

export default {
  aplicarTemplateCompleto,
  detectarLayoutOrcamento,
  TEMPLATES_MANUAIS,
  REGRAS_FORMATACAO,
  mapearTipoParaTemplate,
  extrairDadosDoTexto,
  aplicarFormatacoesFinais,
  gerarPromptGenerico,
  gerarRankingHoteis,
  gerarDicasViagem
};

console.log("🚀 Sistema de Templates v8.2 - SINTAXE DEFINITIVAMENTE CORRIGIDA!");
