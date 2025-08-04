// ⚙️ api/modules/config.js - Configurações Centralizadas do Sistema
// Responsável por gerenciar todas as configurações da aplicação

import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

console.log("⚙️ Módulo de Configuração carregado");

// ================================================================================
// 🔑 CONFIGURAÇÕES DE API
// ================================================================================

export const API_CONFIG = {
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

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3002,
  HOST: process.env.HOST || 'localhost',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  REQUEST_TIMEOUT: 60000, // 60 segundos
  MAX_REQUEST_SIZE: '10mb'
};

// ================================================================================
// 📊 CONFIGURAÇÕES DE LOGS
// ================================================================================

export const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_CONSOLE: true,
  ENABLE_FILE: false,
  LOG_REQUESTS: true,
  LOG_RESPONSES: false // Para não logar dados sensíveis
};

// ================================================================================
// 🎯 CONFIGURAÇÕES DO SISTEMA CVC
// ================================================================================

export const CVC_CONFIG = {
  VERSION: '4.0',
  SYSTEM_NAME: 'CVC Itaqua Gestão',
  
  // Configurações de Orçamento
  ORCAMENTO: {
    MAX_TIPOS: 10,
    MAX_ADULTOS: 20,
    MAX_CRIANCAS: 10,
    IDADE_MAXIMA_CRIANCA: 17,
    MOEDA_PADRAO: 'BRL'
  },

  // Configurações de Templates
  TEMPLATES: {
    IDA_VOLTA: 'ida-volta',
    MULTIPLAS_OPCOES: 'multiplas-opcoes',
    CRUZEIRO: 'cruzeiro',
    HOTEL: 'hotel',
    GENERICO: 'generico'
  },

  // Configurações de Detecção
  DETECTION: {
    MIN_CONFIDENCE: 0.7,
    ENABLE_MULTI_DETECTION: true,
    FALLBACK_TO_GENERIC: true
  }
};

// ================================================================================
// 🔍 CONFIGURAÇÕES DE VALIDAÇÃO
// ================================================================================

export const VALIDATION_CONFIG = {
  // Validações de Input
  MAX_TEXT_LENGTH: 10000,
  MAX_OBSERVACOES_LENGTH: 5000,
  REQUIRED_FIELDS: ['tipos'],
  
  // Validações de API
  API_KEY_MIN_LENGTH: 20,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// ================================================================================
// 📱 CONFIGURAÇÕES DE RESPOSTA
// ================================================================================

export const RESPONSE_CONFIG = {
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-Powered-By': 'CVC-Itaqua-AI-v4.0'
  },
  
  // Códigos de status
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Mensagens padrão
  MESSAGES: {
    SUCCESS: 'Operação realizada com sucesso',
    ERROR: 'Erro interno do servidor',
    INVALID_INPUT: 'Dados de entrada inválidos',
    API_KEY_MISSING: 'Chave da API não configurada',
    TIMEOUT: 'Tempo limite de resposta excedido'
  }
};

// ================================================================================
// 🛡️ CONFIGURAÇÕES DE SEGURANÇA
// ================================================================================

export const SECURITY_CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100, // 100 requests por janela
    MESSAGE: 'Muitas requisições. Tente novamente em alguns minutos.'
  },

  // CORS
  CORS: {
    ORIGIN: SERVER_CONFIG.CORS_ORIGIN,
    METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
    CREDENTIALS: false
  },

  // Headers de Segurança
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};

// ================================================================================
// 🧪 CONFIGURAÇÕES DE DESENVOLVIMENTO
// ================================================================================

export const DEV_CONFIG = {
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  MOCK_MODE: !API_CONFIG.OPENAI.API_KEY || !API_CONFIG.ANTHROPIC.API_KEY,
  
  // Configurações de Mock
  MOCK: {
    RESPONSE_DELAY: 1000, // 1 segundo para simular rede
    ENABLE_RANDOM_ERRORS: false,
    ERROR_PROBABILITY: 0.1 // 10% de chance de erro em mock
  }
};

// ================================================================================
// 🔧 FUNÇÕES DE UTILIDADE DE CONFIGURAÇÃO
// ================================================================================

/**
 * Verifica se as configurações necessárias estão presentes
 */
export function validateConfig() {
  console.log("🔧 Validando configurações...");
  
  const errors = [];
  
  // Validar chaves da API (apenas avisar se não configuradas)
  if (!API_CONFIG.OPENAI.API_KEY) {
    console.warn("⚠️ OpenAI API Key não configurada - usando modo mock");
  }
  
  if (!API_CONFIG.ANTHROPIC.API_KEY) {
    console.warn("⚠️ Anthropic API Key não configurada - funcionalidade limitada");
  }
  
  // Validar configurações críticas
  if (!SERVER_CONFIG.PORT) {
    errors.push("Porta do servidor não definida");
  }
  
  if (errors.length > 0) {
    console.error("❌ Erros de configuração:", errors);
    return false;
  }
  
  console.log("✅ Configurações validadas com sucesso");
  return true;
}

/**
 * Retorna o status atual das configurações
 */
export function getConfigStatus() {
  return {
    version: CVC_CONFIG.VERSION,
    environment: process.env.NODE_ENV || 'development',
    server: {
      port: SERVER_CONFIG.PORT,
      host: SERVER_CONFIG.HOST
    },
    apis: {
      openai: !!API_CONFIG.OPENAI.API_KEY,
      anthropic: !!API_CONFIG.ANTHROPIC.API_KEY
    },
    features: {
      mockMode: DEV_CONFIG.MOCK_MODE,
      debugMode: DEV_CONFIG.ENABLE_DEBUG,
      logRequests: LOG_CONFIG.LOG_REQUESTS
    }
  };
}

/**
 * Obtém configuração específica com fallback
 */
export function getConfig(path, defaultValue = null) {
  try {
    const keys = path.split('.');
    let current = { API_CONFIG, SERVER_CONFIG, LOG_CONFIG, CVC_CONFIG, VALIDATION_CONFIG, RESPONSE_CONFIG, SECURITY_CONFIG, DEV_CONFIG };
    
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

/**
 * Atualiza configuração em runtime (apenas para desenvolvimento)
 */
export function updateConfig(path, value) {
  if (process.env.NODE_ENV === 'production') {
    console.warn("⚠️ Tentativa de alterar configuração em produção bloqueada");
    return false;
  }
  
  try {
    console.log(`🔧 Atualizando configuração '${path}' para:`, value);
    // Implementar lógica de atualização se necessário
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar configuração '${path}':`, error.message);
    return false;
  }
}

// ================================================================================
// 🚀 INICIALIZAÇÃO
// ================================================================================

// Executar validação inicial
validateConfig();

// Exibir status das configurações
const status = getConfigStatus();
console.log("📊 Status das configurações:", JSON.stringify(status, null, 2));

console.log("✅ Módulo config.js carregado e configurado");

// ================================================================================
// 📤 EXPORTAÇÃO PADRÃO
// ================================================================================

export default {
  API_CONFIG,
  SERVER_CONFIG,
  LOG_CONFIG,
  CVC_CONFIG,
  VALIDATION_CONFIG,
  RESPONSE_CONFIG,
  SECURITY_CONFIG,
  DEV_CONFIG,
  validateConfig,
  getConfigStatus,
  getConfig,
  updateConfig
};