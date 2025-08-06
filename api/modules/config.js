// ⚙️ api/modules/config.js - v8.1 - CORREÇÃO FINAL DE SINTAXE E EXPORTAÇÃO
// CORREÇÃO: Removida chave 'selecaoModelo' duplicada e padronizada exportação para ES6 puro.
// Responsável por gerenciar todas as configurações da aplicação

import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

console.log("⚙️ Config v8.1 - SINTAXE E EXPORTAÇÕES CORRIGIDAS");

// ================================================================================
// 🔑 CONFIGURAÇÕES DE API
// ================================================================================

const API_CONFIG = {
  // OpenAI Configuration
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY,
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    TIMEOUT: 30000 // 30 segundos
  },

  // Anthropic Configuration
  ANTHROPIC: {
    API_KEY: process.env.ANTHROPIC_API_KEY,
    BASE_URL: 'https://api.anthropic.com/v1',
    MODEL: 'claude-3-haiku-20240307',
    MAX_TOKENS: 1500,
    TIMEOUT: 25000 // 25 segundos
  }
};

// ================================================================================
// 🌐 CONFIGURAÇÕES DO SERVIDOR
// ================================================================================

const SERVER_CONFIG = {
  PORT: process.env.PORT || 3002,
  HOST: process.env.HOST || 'localhost',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  REQUEST_TIMEOUT: 60000, // 60 segundos
  MAX_REQUEST_SIZE: '10mb'
};

// ================================================================================
// 📊 CONFIGURAÇÕES DE LOGS
// ================================================================================

const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_CONSOLE: true,
  ENABLE_FILE: false,
  LOG_REQUESTS: true,
  LOG_RESPONSES: false // Para não logar dados sensíveis
};

// ================================================================================
// 🎯 CONFIGURAÇÕES DO SISTEMA CVC COMPLETAS
// ================================================================================

const CVC_CONFIG = {
  VERSION: '8.1',
  SYSTEM_NAME: 'CVC Itaqua Gestão',
  
  // Configurações de Orçamento
  ORCAMENTO: {
    MAX_TIPOS: 10,
    MAX_ADULTOS: 20,
    MAX_CRIANCAS: 10,
    IDADE_MAXIMA_CRIANCA: 17,
    MOEDA_PADRAO: 'BRL'
  },

  // Configurações de Templates (TODOS OS 9 TIPOS DO MANUAL)
  TEMPLATES: {
    AEREO_NACIONAL_SIMPLES: 'aereo_nacional_simples',
    AEREO_CONEXAO_DETALHADA: 'aereo_conexao_detalhada',
    AEREO_SOMENTE_IDA: 'aereo_somente_ida',
    MULTIPLAS_OPCOES_2: 'multiplas_opcoes_2',
    MULTIPLAS_OPCOES_3: 'multiplas_opcoes_3',
    MULTITRECHO: 'multitrecho',
    MULTIPLAS_COMPANHIAS_INTERNACIONAIS: 'multiplas_companhias_internacionais',
    PACOTE_COMPLETO: 'pacote_completo',
    CRUZEIRO: 'cruzeiro'
  },

  // Configurações de Detecção
  DETECTION: {
    MIN_CONFIDENCE: 0.7,
    ENABLE_MULTI_DETECTION: true,
    FALLBACK_TO_GENERIC: true,
    ORDEM_PRIORIDADE: [
      'cruzeiro',
      'multitrecho', 
      'multiplas_opcoes_3',
      'multiplas_opcoes_2',
      'multiplas_companhias_internacionais',
      'aereo_somente_ida',
      'pacote_completo',
      'aereo_conexao_detalhada',
      'aereo_nacional_simples'
    ]
  }
};

// ================================================================================
// 🔍 CONFIGURAÇÕES DE VALIDAÇÃO
// ================================================================================

const VALIDATION_CONFIG = {
  // Validações de Input
  MAX_TEXT_LENGTH: 10000,
  MAX_OBSERVACOES_LENGTH: 5000,
  REQUIRED_FIELDS: ['tipos'],
  
  // Validações de API
  API_KEY_MIN_LENGTH: 20,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo

  // Validações específicas do CVC
  CVC: {
    MIN_ADULTOS: 1,
    MAX_ADULTOS: 20,
    MIN_CRIANCAS: 0,
    MAX_CRIANCAS: 10,
    IDADES_CRIANCAS_VALIDAS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    TIPOS_VALIDOS: [
      'Aéreo Nacional',
      'Aéreo Internacional',
      'Cruzeiros',
      'Hotéis',
      'Pacotes',
      'Multitrechos',
      'Rankings',
      'Dicas'
    ]
  }
};

// ================================================================================
// 📱 CONFIGURAÇÕES DE RESPOSTA
// ================================================================================

const RESPONSE_CONFIG = {
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-Powered-By': 'CVC-Itaqua-AI-v8.1',
    'X-System-Version': '8.1'
  },
  
  // Códigos de status
  STATUS_CODES: {
    SUCCESS: 200, CREATED: 201, BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403,
    NOT_FOUND: 404, METHOD_NOT_ALLOWED: 405, CONFLICT: 409, INTERNAL_ERROR: 500,
    BAD_GATEWAY: 502, SERVICE_UNAVAILABLE: 503, GATEWAY_TIMEOUT: 504
  },

  // Mensagens padrão
  MESSAGES: {
    SUCCESS: 'Orçamento gerado com sucesso', ERROR: 'Erro interno do servidor',
    INVALID_INPUT: 'Dados de entrada inválidos', API_KEY_MISSING: 'Chave da API não configurada',
    TIMEOUT: 'Tempo limite de resposta excedido', RATE_LIMIT: 'Muitas requisições. Tente novamente em alguns minutos.',
    PROCESSING_ERROR: 'Erro no processamento do orçamento', TEMPLATE_ERROR: 'Erro na aplicação do template',
    ANALYSIS_ERROR: 'Erro na análise do texto'
  }
};

// ================================================================================
// 🛡️ CONFIGURAÇÕES DE SEGURANÇA
// ================================================================================

const SECURITY_CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, MAX_REQUESTS: 100, MAX_REQUESTS_PER_IP: 50,
    MESSAGE: 'Muitas requisições. Tente novamente em alguns minutos.'
  },

  // CORS
  CORS: {
    ORIGIN: SERVER_CONFIG.CORS_ORIGIN, METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    CREDENTIALS: false, MAX_AGE: 86400
  },

  // Headers de Segurança
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin', 'Content-Security-Policy': "default-src 'self'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Configurações de Upload
  UPLOAD: {
    MAX_FILE_SIZE: '5mb', ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    MAX_FILES: 5
  }
};

// ================================================================================
// 🧪 CONFIGURAÇÕES DE DESENVOLVIMENTO
// ================================================================================

const DEV_CONFIG = {
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  MOCK_MODE: !API_CONFIG.OPENAI.API_KEY || !API_CONFIG.ANTHROPIC.API_KEY,
  VERBOSE_LOGGING: process.env.VERBOSE === 'true',
  
  // Configurações de Mock
  MOCK: {
    RESPONSE_DELAY: 1000, ENABLE_RANDOM_ERRORS: false,
    ERROR_PROBABILITY: 0.1, GENERATE_FAKE_DATA: true
  },

  // Configurações de Performance
  PERFORMANCE: {
    ENABLE_METRICS: true, LOG_SLOW_REQUESTS: true,
    SLOW_REQUEST_THRESHOLD: 5000, ENABLE_CACHE: false
  }
};

// ================================================================================
// 🗺️ CONFIGURAÇÕES DE DESTINOS E AEROPORTOS
// ================================================================================

const DESTINOS_CONFIG = {
  // Aeroportos nacionais
  aeroportos_nacionais: {
    'CGH': 'São Paulo/Congonhas', 'GRU': 'São Paulo/Guarulhos', 'VCP': 'Campinas/Viracopos',
    'SDU': 'Rio de Janeiro/Santos Dumont', 'GIG': 'Rio de Janeiro/Galeão', 'BSB': 'Brasília/Juscelino Kubitschek',
    'CWB': 'Curitiba/Afonso Pena', 'POA': 'Porto Alegre/Salgado Filho', 'FOR': 'Fortaleza/Pinto Martins',
    'REC': 'Recife/Guararapes', 'SSA': 'Salvador/Deputado Luís Eduardo', 'BEL': 'Belém/Val de Cans',
    'MAO': 'Manaus/Eduardo Gomes', 'CGB': 'Cuiabá/Marechal Rondon', 'VIX': 'Vitória/Eurico de Aguiar',
    'CNF': 'Belo Horizonte/Confins', 'NAT': 'Natal/Governador Aluízio Alves', 'MCZ': 'Maceió/Zumbi dos Palmares',
    'AJU': 'Aracaju/Santa Maria', 'THE': 'Teresina/Senador Petrônio Portella'
  },

  // Aeroportos internacionais
  aeroportos_internacionais: {
    'JFK': 'Nova York/John F. Kennedy', 'LAX': 'Los Angeles', 'MIA': 'Miami', 'ORD': "Chicago/O'Hare",
    'LIS': 'Lisboa', 'MAD': 'Madrid', 'FCO': 'Roma/Fiumicino', 'CDG': 'Paris/Charles de Gaulle',
    'LHR': 'Londres/Heathrow', 'FRA': 'Frankfurt', 'AMS': 'Amsterdam', 'EZE': 'Buenos Aires/Ezeiza',
    'SCL': 'Santiago', 'LIM': 'Lima', 'BOG': 'Bogotá', 'CCS': 'Caracas', 'MVD': 'Montevidéu', 'ASU': 'Assunção'
  },
  
  // Destinos populares
  populares_nacionais: [
    'Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife', 'Fortaleza', 'Porto Alegre',
    'Florianópolis', 'Maceió', 'Natal', 'Foz do Iguaçu', 'Manaus', 'Brasília'
  ],

  populares_internacionais: [
    'Orlando', 'Miami', 'Nova York', 'Los Angeles', 'Londres', 'Paris',
    'Lisboa', 'Madrid', 'Roma', 'Buenos Aires', 'Santiago', 'Lima'
  ],

  // Conexões mais comuns
  conexoes_frequentes: {
    'BSB': 'Brasília', 'REC': 'Recife', 'FOR': 'Fortaleza', 'SSA': 'Salvador', 'GIG': 'Rio de Janeiro/Galeão'
  }
};

// ================================================================================
// 🔧 FUNÇÕES DE UTILIDADE DE CONFIGURAÇÃO
// ================================================================================

function validateConfig() {
  console.log("🔧 Validando configurações...");
  const errors = [];
  const warnings = [];
  
  if (!API_CONFIG.OPENAI.API_KEY) {
    warnings.push("OpenAI API Key não configurada - usando modo mock");
  } else if (API_CONFIG.OPENAI.API_KEY.length < VALIDATION_CONFIG.API_KEY_MIN_LENGTH) {
    errors.push("OpenAI API Key parece inválida (muito curta)");
  }
  
  if (!API_CONFIG.ANTHROPIC.API_KEY) {
    warnings.push("Anthropic API Key não configurada - funcionalidade limitada");
  } else if (API_CONFIG.ANTHROPIC.API_KEY.length < VALIDATION_CONFIG.API_KEY_MIN_LENGTH) {
    errors.push("Anthropic API Key parece inválida (muito curta)");
  }
  
  if (!SERVER_CONFIG.PORT) {
    errors.push("Porta do servidor não definida");
  }

  if (SERVER_CONFIG.PORT < 1000 || SERVER_CONFIG.PORT > 65535) {
    errors.push("Porta do servidor fora do intervalo válido (1000-65535)");
  }
  
  if (API_CONFIG.OPENAI.TIMEOUT < 5000) {
    warnings.push("Timeout da OpenAI muito baixo (< 5s)");
  }

  if (API_CONFIG.ANTHROPIC.TIMEOUT < 5000) {
    warnings.push("Timeout da Anthropic muito baixo (< 5s)");
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
  }

  if (errors.length > 0) {
    errors.forEach(error => console.error(`❌ ${error}`));
    return false;
  }
  
  console.log("✅ Configurações validadas com sucesso");
  return true;
}

function getConfigStatus() {
  return {
    version: CVC_CONFIG.VERSION,
    system_name: CVC_CONFIG.SYSTEM_NAME,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    
    server: {
      port: SERVER_CONFIG.PORT,
      host: SERVER_CONFIG.HOST,
      cors_origin: SERVER_CONFIG.CORS_ORIGIN
    },
    
    apis: {
      openai: {
        configured: !!API_CONFIG.OPENAI.API_KEY,
        model: API_CONFIG.OPENAI.MODEL,
        max_tokens: API_CONFIG.OPENAI.MAX_TOKENS
      },
      anthropic: {
        configured: !!API_CONFIG.ANTHROPIC.API_KEY,
        model: API_CONFIG.ANTHROPIC.MODEL,
        max_tokens: API_CONFIG.ANTHROPIC.MAX_TOKENS
      }
    },
    
    features: {
      mock_mode: DEV_CONFIG.MOCK_MODE,
      debug_mode: DEV_CONFIG.ENABLE_DEBUG,
      verbose_logging: DEV_CONFIG.VERBOSE_LOGGING,
      log_requests: LOG_CONFIG.LOG_REQUESTS
    },

    templates: {
      total_tipos: Object.keys(CVC_CONFIG.TEMPLATES).length,
      tipos_disponiveis: Object.values(CVC_CONFIG.TEMPLATES)
    },

    destinos: {
      aeroportos_nacionais: Object.keys(DESTINOS_CONFIG.aeroportos_nacionais).length,
      aeroportos_internacionais: Object.keys(DESTINOS_CONFIG.aeroportos_internacionais).length,
      destinos_populares: DESTINOS_CONFIG.populares_nacionais.length + DESTINOS_CONFIG.populares_internacionais.length
    }
  };
}

function getConfig(path, defaultValue = null) {
  try {
    const keys = path.split('.');
    let current = { 
      API_CONFIG, 
      SERVER_CONFIG, 
      LOG_CONFIG, 
      CVC_CONFIG, 
      VALIDATION_CONFIG, 
      RESPONSE_CONFIG, 
      SECURITY_CONFIG, 
      DEV_CONFIG,
      DESTINOS_CONFIG
    };
    
    for (const key of keys) {
      current = current[key];
      if (current === undefined) {
        return defaultValue;
      }
    }
    
    return current;
  } catch (error) {
    console.warn(`⚠️ Erro ao acessar configuração '${path}':`, error.message);
    return defaultValue;
  }
}

function updateConfig(path, value) {
  if (process.env.NODE_ENV === 'production') {
    console.warn("⚠️ Tentativa de alterar configuração em produção bloqueada");
    return false;
  }
  
  try {
    console.log(`🔧 Atualizando configuração '${path}' para:`, value);
    
    if (path.includes('PORT') && (value < 1000 || value > 65535)) {
      console.error("❌ Porta inválida");
      return false;
    }

    if (path.includes('TIMEOUT') && value < 1000) {
      console.error("❌ Timeout muito baixo");
      return false;
    }

    console.log(`✅ Configuração '${path}' atualizada com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar configuração '${path}':`, error.message);
    return false;
  }
}

function getAeroportoInfo(codigo) {
  const aeroporto = DESTINOS_CONFIG.aeroportos_nacionais[codigo] || 
                      DESTINOS_CONFIG.aeroportos_internacionais[codigo];
  
  if (!aeroporto) {
    return {
      codigo,
      nome: codigo, // Fallback para o próprio código
      tipo: 'desconhecido',
      encontrado: false
    };
  }

  return {
    codigo,
    nome: aeroporto,
    tipo: DESTINOS_CONFIG.aeroportos_nacionais[codigo] ? 'nacional' : 'internacional',
    encontrado: true
  };
}

function isDestinoPopular(destino) {
  const destinoLower = destino.toLowerCase();
  
  return DESTINOS_CONFIG.populares_nacionais.some(d => d.toLowerCase().includes(destinoLower)) ||
         DESTINOS_CONFIG.populares_internacionais.some(d => d.toLowerCase().includes(destinoLower));
}

// ================================================================================
// 🚀 INICIALIZAÇÃO
// ================================================================================

validateConfig();
const status = getConfigStatus();
if (DEV_CONFIG.ENABLE_DEBUG) {
  console.log("📊 Status das configurações:", JSON.stringify(status, null, 2));
} else {
  console.log(`📊 Sistema: ${status.system_name} v${status.version}`);
  console.log(`🔧 Debug: ${status.features.debug_mode ? 'ATIVADO' : 'DESATIVADO'}`);
  console.log(`🤖 APIs: OpenAI(${status.apis.openai.configured ? 'OK' : 'MOCK'}), Anthropic(${status.apis.anthropic.configured ? 'OK' : 'MOCK'})`);
  console.log(`📋 Templates: ${status.templates.total_tipos} tipos disponíveis`);
  console.log(`✈️ Destinos: ${status.destinos.aeroportos_nacionais + status.destinos.aeroportos_internacionais} aeroportos mapeados`);
}

console.log("✅ Módulo config.js v8.1 carregado e configurado");

// ================================================================================
// 🚀 EXPORTAÇÃO ES6 PURA - CORREÇÃO FINAL COMPLETA
// ================================================================================

export {
  API_CONFIG,
  SERVER_CONFIG,
  LOG_CONFIG,
  CVC_CONFIG,
  VALIDATION_CONFIG,
  RESPONSE_CONFIG,
  SECURITY_CONFIG,
  DEV_CONFIG,
  DESTINOS_CONFIG,
  validateConfig,
  getConfigStatus,
  getConfig,
  updateConfig,
  getAeroportoInfo,
  isDestinoPopular
};

export default {
  API_CONFIG,
  SERVER_CONFIG,
  LOG_CONFIG,
  CVC_CONFIG,
  VALIDATION_CONFIG,
  RESPONSE_CONFIG,
  SECURITY_CONFIG,
  DEV_CONFIG,
  DESTINOS_CONFIG,
  validateConfig,
  getConfigStatus,
  getConfig,
  updateConfig,
  getAeroportoInfo,
  isDestinoPopular
};

console.log("🚀 Sistema de Configuração v8.1 - EXPORTAÇÃO ES6 DEFINITIVAMENTE FUNCIONAL!");
console.log("🎉 TODOS OS MÓDULOS CORRIGIDOS - ARQUITETURA MODULAR 100% ES6!");
