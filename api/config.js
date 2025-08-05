// ⚙️ config.js - CONFIGURAÇÃO CENTRALIZADA CVC ITAQUA v7.0
// Todas as configurações do sistema em um local

console.log("⚙️ Carregando configurações centralizadas v7.0...");

// ================================================================================
// 🎯 CONFIGURAÇÕES PRINCIPAIS DO SISTEMA
// ================================================================================

const SISTEMA_CONFIG = {
  versao: '7.0.0',
  nome: 'CVC Itaquaquecetuba - Sistema Integrado',
  ambiente: process.env.NODE_ENV || 'production',
  debug: {
    habilitado: true, // PERMANENTE conforme solicitado
    nivel: 'completo', // basico | completo | detalhado
    logCustos: true,
    logTokens: true,
    logModelos: true
  },
  
  // URLs e endpoints
  urls: {
    frontend: 'https://cvc-itaqua-gestao.vercel.app',
    api: '/api/ai',
    googleSheets: 'https://docs.google.com/spreadsheets/d/1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc',
    scriptCustos: 'https://script.google.com/macros/s/AKfycbxqOxRJNJm_X4lmD1-4v4OZYRt7E5xh0mYaX1kgRv-fGfFTU4YZM7UWQm8YrWl1B4VQ/exec'
  }
};

// ================================================================================
// 🤖 CONFIGURAÇÕES DE IA
// ================================================================================

const IA_CONFIG = {
  // Modelos disponíveis com especificações
  modelos: {
    'gpt-4o-mini': {
      nome: 'GPT-4o Mini',
      provider: 'openai',
      maxTokens: 2000,
      temperatura: 0.7,
      precos: {
        input: 0.00015,   // USD por 1K tokens
        output: 0.0006    // USD por 1K tokens
      },
      uso: ['simples', 'media'], // complexidades recomendadas
      limitePorMinuto: 100
    },
    'gpt-4o': {
      nome: 'GPT-4o',
      provider: 'openai',
      maxTokens: 4000,
      temperatura: 0.7,
      precos: {
        input: 0.0025,
        output: 0.01
      },
      uso: ['alta', 'premium'],
      limitePorMinuto: 20
    },
    'claude-3-5-sonnet': {
      nome: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      maxTokens: 2000,
      temperatura: 0.7,
      precos: {
        input: 0.003,
        output: 0.015
      },
      uso: ['media', 'alta'],
      limitePorMinuto: 30
    }
  },
  
  // Estratégia de seleção de modelo
  selecaoModelo: {
    padrao: 'gpt-4o-mini',
    backup: 'claude-3-5-sonnet',
    premium: 'gpt-4o',
    
  // Estratégia de seleção de modelo
  selecaoModelo: {
    padrao: 'gpt-4o-mini',
    backup: 'claude-3-5-sonnet',
    premium: 'gpt-4o',
    
    // Regras de seleção por complexidade
    porComplexidade: {
      simples: 'gpt-4o-mini',
      media: 'gpt-4o-mini',
      alta: 'gpt-4o'
    },
    
    // Regras por tipo de conteúdo
    porTipo: {
      orcamento: 'gpt-4o-mini',
      ranking: 'gpt-4o-mini',
      dicas: 'gpt-4o-mini',
      analise: 'gpt-4o'
    }
  },
  
  // Configurações de conversão de moeda
  moeda: {
    taxaUSDtoBRL: 5.2, // Atualizar periodicamente
    ultimaAtualizacao: '2025-01-01',
    formatoBRL: 'R$0.000000',
    formatoUSD: '$0.000000'
  }
};

// ================================================================================
// 📋 CONFIGURAÇÕES DE TEMPLATES
// ================================================================================

const TEMPLATES_CONFIG = {
  // Tipos de template disponíveis
  tipos: [
    'ida_volta',
    'multiplas_opcoes', 
    'cruzeiro',
    'hotel',
    'multitrecho',
    'pacote_completo',
    'ranking_hoteis',
    'dicas_destino'
  ],
  
  // Regras de seleção de template
  selecao: {
    // Prioridade 1: Detecção por palavras-chave
    palavrasChave: {
      cruzeiro: ['cruzeiro', 'navio', 'msc', 'costa', 'embarque'],
      hotel: ['hotel', 'resort', 'pousada', 'hospedagem', 'diaria'],
      multitrecho: ['trecho', 'conexao', 'escala', 'multiplas cidades'],
      pacote: ['pacote', 'combo', 'all inclusive', 'tudo incluso']
    },
    
    // Prioridade 2: Detecção por padrões
    padroes: {
      multiplasOpcoes: [
        /opção\s+\d+/gi,
        /alternativa\s+\d+/gi,
        /\d+º?\s*-\s*(voo|passagem)/gi
      ],
      idaVolta: [
        /\b(ida|saída|partida)\b.*\b(volta|retorno|chegada)\b/gi,
        /\d{1,2}\/\d{1,2}.*\d{1,2}\/\d{1,2}/g
      ]
    }
  },
  
  // Configurações de formatação
  formatacao: {
    maxLinhasPorSecao: 10,
    usarEmojis: true,
    separarSecoes: true,
    destacarPrecos: true,
    incluirTimestamp: false
  }
};

// ================================================================================
// 🔍 CONFIGURAÇÕES DE ANÁLISE
// ================================================================================

const ANALISE_CONFIG = {
  // Fatores de complexidade
  complexidade: {
    fatores: {
      tamanhoTexto: { limite: 500, pontos: 2 },
      multiplosTipos: { pontos: 1 },
      temImagem: { pontos: 1 },
      multiplasOpcoes: { pontos: 2 },
      muitosHorarios: { limite: 4, pontos: 1 },
      muitosAeroportos: { limite: 2, pontos: 1 }
    },
    
    // Classificação
    niveis: {
      simples: { min: 0, max: 2 },
      media: { min: 3, max: 5 },
      alta: { min: 6, max: 10 }
    }
  },
  
  // Detecção de padrões
  padroes: {
    precos: /r\$\s*\d+[\.,]\d+/gi,
    horarios: /\d{2}:\d{2}/g,
    aeroportos: /\b[A-Z]{3}\b/g,
    companhias: /(gol|latam|azul|avianca|tap|lufthansa|air france|klm)/gi,
    datas: /\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/g
  }
};

// ================================================================================
// 💰 CONFIGURAÇÕES DE CUSTOS E MÉTRICAS
// ================================================================================

const CUSTOS_CONFIG = {
  // Limites de alerta
  alertas: {
    custoAlto: 0.01,        // BRL - Alertar se custo > R$ 0.01
    tokensMuitos: 5000,     // Alertar se tokens > 5000
    consultasDia: 100       // Alertar se consultas/dia > 100
  },
  
  // Configurações de log
  log: {
    salvarNaPlanilha: true,
    salvarLocal: true,
    incluirDetalhes: true,
    manterHistorico: 90    // dias
  },
  
  // Métricas para acompanhamento
  metricas: {
    calcularPorHora: true,
    calcularPorDia: true,
    calcularPorDestino: true,
    calcularPorModelo: true
  }
};

// ================================================================================
// 🌐 CONFIGURAÇÕES DE INTEGRAÇÃO
// ================================================================================

const INTEGRACAO_CONFIG = {
  // Google Sheets
  googleSheets: {
    planilhaId: '1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc',
    abas: {
      custos: 'LOG_IA_CUSTOS',
      resumo: 'RESUMO_CUSTOS_IA',
      placar: 'PLACAR',
      embarques: 'EMBARQUES',
      dados: 'dados'
    },
    timeout: 10000 // ms
  },
  
  // APIs externas
  apis: {
    openai: {
      baseURL: 'https://api.openai.com/v1',
      timeout: 30000,
      retries: 3
    },
    anthropic: {
      baseURL: 'https://api.anthropic.com/v1',
      timeout: 30000,
      retries: 3
    }
  }
};

// ================================================================================
// 🔧 CONFIGURAÇÕES DE VALIDAÇÃO
// ================================================================================

const VALIDACAO_CONFIG = {
  // Campos obrigatórios por tipo
  camposObrigatorios: {
    orcamento: ['destino', 'tipos'],
    ranking: ['destino'],
    dicas: ['destino'],
    analise: ['arquivo']
  },
  
  // Limites de tamanho
  limites: {
    maxPromptSize: 10000,    // caracteres
    maxResponseSize: 15000,  // caracteres
    maxFileSize: 10485760,   // bytes (10MB)
    maxTipos: 5             // tipos selecionados
  },
  
  // Sanitização
  sanitizacao: {
    removerHTMLTags: true,
    limitarLinhas: true,
    maxLinhas: 100
  }
};

// ================================================================================
// 📊 MAPEAMENTO DE AEROPORTOS E DESTINOS
// ================================================================================

const DESTINOS_CONFIG = {
  aeroportos: {
    // Principais aeroportos brasileiros
    'GRU': 'Guarulhos (São Paulo)',
    'CGH': 'Congonhas (São Paulo)',
    'SDU': 'Santos Dumont (Rio de Janeiro)',
    'GIG': 'Galeão (Rio de Janeiro)',
    'BSB': 'Brasília',
    'SSA': 'Salvador',
    'REC': 'Recife',
    'FOR': 'Fortaleza',
    'MAO': 'Manaus',
    'BEL': 'Belém',
    'CWB': 'Curitiba',
    'POA': 'Porto Alegre',
    'FLN': 'Florianópolis',
    'VIX': 'Vitória',
    'CNF': 'Belo Horizonte',
    'IGU': 'Foz do Iguaçu',
    'MCZ': 'Maceió',
    'NAT': 'Natal',
    'AJU': 'Aracaju',
    'THE': 'Teresina',
    'SLZ': 'São Luís',
    'CGB': 'Cuiabá',
    'VCP': 'Campinas',
    
    // Principais aeroportos internacionais
    'JFK': 'John F. Kennedy (Nova York)',
    'LAX': 'Los Angeles',
    'MIA': 'Miami',
    'LIS': 'Lisboa',
    'MAD': 'Madrid',
    'FCO': 'Roma',
    'CDG': 'Paris',
    'LHR': 'Londres',
    'FRA': 'Frankfurt',
    'AMS': 'Amsterdam',
    'EZE': 'Buenos Aires',
    'SCL': 'Santiago',
    'LIM': 'Lima',
    'BOG': 'Bogotá',
    'CCS': 'Caracas',
    'MVD': 'Montevidéu',
    'ASU': 'Assunção'
  },
  
  // Destinos populares
  populares: [
    'Rio de Janeiro',
    'São Paulo', 
    'Salvador',
    'Recife',
    'Fortaleza',
    'Porto Alegre',
    'Florianópolis',
    'Maceió',
    'Natal',
    'Foz do Iguaçu',
    'Manaus',
    'Brasília',
    'Orlando',
    'Miami',
    'Nova York',
    'Londres',
    'Paris',
    'Lisboa',
    'Buenos Aires',
    'Santiago'
  ]
};

// ================================================================================
// 🚀 EXPORTAÇÃO DAS CONFIGURAÇÕES
// ================================================================================

// Para Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SISTEMA_CONFIG,
    IA_CONFIG,
    TEMPLATES_CONFIG,
    ANALISE_CONFIG,
    CUSTOS_CONFIG,
    INTEGRACAO_CONFIG,
    VALIDACAO_CONFIG,
    DESTINOS_CONFIG
  };
}

// Para Browser (frontend)
if (typeof window !== 'undefined') {
  window.CVC_CONFIG = {
    SISTEMA_CONFIG,
    IA_CONFIG,
    TEMPLATES_CONFIG,
    ANALISE_CONFIG,
    CUSTOS_CONFIG,
    INTEGRACAO_CONFIG,
    VALIDACAO_CONFIG,
    DESTINOS_CONFIG
  };
}

console.log("✅ Configurações centralizadas v7.0 carregadas");
console.log(`🎯 Sistema: ${SISTEMA_CONFIG.nome} v${SISTEMA_CONFIG.versao}`);
console.log(`🔧 Debug: ${SISTEMA_CONFIG.debug.habilitado ? 'ATIVADO' : 'DESATIVADO'}`);
console.log(`🤖 Modelos disponíveis: ${Object.keys(IA_CONFIG.modelos).length}`);
console.log(`📋 Templates disponíveis: ${TEMPLATES_CONFIG.tipos.length}`);
console.log(`✈️ Aeroportos mapeados: ${Object.keys(DESTINOS_CONFIG.aeroportos).length}`);
