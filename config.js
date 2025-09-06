// ================================================================================
// 🔧 CVC ITAQUA - CONFIGURAÇÃO CENTRAL v8.02
// ================================================================================
// ⚡ ÚNICO ARQUIVO PARA ALTERAR QUANDO REIMPLANTAR GOOGLE APPS SCRIPT
// 🎯 Todos os HTMLs usam esta configuração automaticamente

const CVC_CONFIG = {
    // ✅ URL PRINCIPAL - ALTERAR APENAS AQUI quando reimplantar
    API_URL: 'https://script.google.com/macros/s/AKfycbxzwe0F-HVMrNTvEdGZLgDRtb2qECmssL4wQRWgStk2PufjkTeqZlqVxzU6BkM3nwKKSw/exec',
    
    // 📊 INFORMAÇÕES DO SISTEMA
    VERSION: '8.02',
    SYSTEM_NAME: 'CVC Itaqua - Sistema Master',
    LAST_UPDATE: '2025-09-06',
    ENVIRONMENT: 'production',
    
    // 🏪 CONFIGURAÇÕES DA LOJA
    FILIAL_PADRAO: '6220',
    NOME_FILIAL: 'Itaquaquecetuba',
    
    // 👥 VENDEDORES ATIVOS
    VENDEDORES: [
        'Alessandro',
        'Ana Paula', 
        'Adriana',
        'Adrielly',
        'Bia',
        'Conceição',
        'Jhully'
    ],
    
    // ✈️ COMPANHIAS AÉREAS
    COMPANHIAS_AEREAS: [
        'LATAM', 'AZUL', 'GOL', 'VOEPASS',
        '──────────────',
        'CRUZEIRO MSC', 'CRUZEIRO COSTA', 'CRUZEIRO TEMÁTICO', 'CRUZEIRO NCL', 
        'CRUZEIRO DISNEY', 'CRUZEIROS OUTROS',
        '──────────────',
        'Aerolíneas Argentinas', 'Aeroméxico', 'Air Canada', 'Air China', 
        'Air Europa', 'Air France', 'American Airlines', 'Arajet', 'Avianca',
        'Boliviana de Aviación (BoA)', 'British Airways', 'Copa Airlines',
        'Delta Air Lines', 'Emirates', 'Ethiopian Airlines', 'Flybondi',
        'Iberia', 'ITA Airways', 'JetSmart', 'KLM', 'Lufthansa',
        'Qatar Airways', 'Royal Air Maroc', 'Sky Airline', 
        'Swiss International Air Lines', 'TAAG Linhas Aéreas de Angola',
        'TAP Air Portugal', 'Turkish Airlines', 'United Airlines',
        'OUTRAS CIAS'
    ],
    
    // 🏷️ TIPOS DE SERVIÇO
    TIPOS_SERVICO: [
        'Aéreo', 'Aéreo Facial', 'Hotel', 'A+H', 'A+H+S',
        'Passeios', 'Traslados', 'Traslados + Passeios', 'Ingressos',
        'Seguro', 'Cruzeiro', 'SVA e Outros', 'Locação'
    ],
    
    // ⚙️ CONFIGURAÇÕES TÉCNICAS
    TIMEOUTS: {
        conexao: 10000,  // 10 segundos
        envio: 30000     // 30 segundos
    },
    
    // 🎨 CONFIGURAÇÕES DE UI
    UI: {
        auto_hide_alerts: 8000,  // 8 segundos
        loading_delay: 100       // 100ms
    },
    
    // 🔍 DEBUG
    DEBUG: {
        enabled: true,
        log_level: 'info', // 'error', 'warning', 'info', 'debug'
        console_logs: true
    }
};

// ================================================================================
// 🛠️ FUNÇÕES AUXILIARES DE CONFIGURAÇÃO
// ================================================================================

/**
 * 🔍 Detectar ambiente atual
 */
function detectEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return 'development';
    } else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        return 'staging';
    } else {
        return 'production';
    }
}

/**
 * 📊 Obter configuração baseada no ambiente
 */
function getConfig() {
    const env = detectEnvironment();
    
    return {
        ...CVC_CONFIG,
        current_environment: env,
        is_development: env === 'development',
        is_staging: env === 'staging',
        is_production: env === 'production'
    };
}

/**
 * 🔗 Obter URL da API (função principal)
 */
function getApiUrl() {
    return CVC_CONFIG.API_URL;
}

/**
 * 📝 Log configurado baseado no nível de debug
 */
function debugLog(message, level = 'info') {
    if (!CVC_CONFIG.DEBUG.enabled || !CVC_CONFIG.DEBUG.console_logs) return;
    
    const levels = { error: 0, warning: 1, info: 2, debug: 3 };
    const currentLevel = levels[CVC_CONFIG.DEBUG.log_level] || 2;
    const messageLevel = levels[level] || 2;
    
    if (messageLevel <= currentLevel) {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        
        switch (level) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warning':
                console.warn(`${prefix} ${message}`);
                break;
            case 'debug':
                console.debug(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    }
}

/**
 * ✅ Verificar se a configuração está válida
 */
function validateConfig() {
    const errors = [];
    
    if (!CVC_CONFIG.API_URL || !CVC_CONFIG.API_URL.includes('script.google.com')) {
        errors.push('URL da API inválida ou não configurada');
    }
    
    if (!CVC_CONFIG.VENDEDORES || CVC_CONFIG.VENDEDORES.length === 0) {
        errors.push('Lista de vendedores vazia');
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros na configuração:', errors);
        return { valid: false, errors };
    }
    
    debugLog('✅ Configuração validada com sucesso', 'info');
    return { valid: true, errors: [] };
}

// ================================================================================
// 🚀 INICIALIZAÇÃO AUTOMÁTICA
// ================================================================================

// Validar configuração quando o arquivo carrega
document.addEventListener('DOMContentLoaded', function() {
    const validation = validateConfig();
    const config = getConfig();
    
    debugLog(`🚀 CVC Config carregado - Versão ${config.VERSION}`, 'info');
    debugLog(`🌍 Ambiente detectado: ${config.current_environment}`, 'info');
    debugLog(`🔗 API URL: ${config.API_URL}`, 'info');
    
    if (!validation.valid) {
        console.error('❌ Configuração inválida:', validation.errors);
        alert('Erro na configuração do sistema. Verifique o console.');
    }
});

// ================================================================================
// 📝 LOGS INFORMATIVOS
// ================================================================================

console.log('🔧 CVC Config v8.02 carregado!');
console.log('📊 Para alterar a URL da API, edite apenas este arquivo (config.js)');
console.log('🎯 URL atual:', CVC_CONFIG.API_URL);
console.log('🏪 Filial:', CVC_CONFIG.FILIAL_PADRAO, '-', CVC_CONFIG.NOME_FILIAL);
