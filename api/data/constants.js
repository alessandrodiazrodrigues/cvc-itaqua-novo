// api/data/constants.js - CONFIGURAÇÕES E DADOS v4.0
// ================================================================================
// 📊 DADOS ESSENCIAIS DO SISTEMA
// 🔧 Este arquivo contém todas as configurações, templates básicos e constantes
// ⚠️  Editável, mas com cuidado - mudanças afetam todo o sistema
// ================================================================================

// ================================================================================
// ⚙️ CONFIGURAÇÃO DO SISTEMA
// ================================================================================

export const SYSTEM_CONFIG = {
    VERSION: '4.0',
    SYSTEM_NAME: 'CVC ITAQUA',
    BUILD_DATE: '2025-01-XX',
    ENVIRONMENT: process.env.NODE_ENV || 'production',
    
    // Configurações de performance
    MAX_INPUT_LENGTH: 50000,
    MAX_OUTPUT_LENGTH: 10000,
    REQUEST_TIMEOUT: 30000,
    
    // Configurações de IA
    DEFAULT_AI: 'claude',
    FALLBACK_AI: 'openai',
    MAX_TOKENS: 3000,
    TEMPERATURE: 0.1,
    
    // Configurações de debugging
    ENABLE_DETAILED_LOGS: process.env.NODE_ENV === 'development',
    LOG_REQUESTS: true,
    LOG_AI_USAGE: true
};

// ================================================================================
// 🗺️ MAPEAMENTO DE AEROPORTOS COMPLETO
// ================================================================================

export const AEROPORTOS = {
    // Brasil - Principais
    'GRU': 'Guarulhos',
    'CGH': 'Congonhas', 
    'VCP': 'Viracopos',
    'GIG': 'Galeão',
    'SDU': 'Santos Dumont',
    'BSB': 'Brasília',
    'CNF': 'Confins',
    'PLU': 'Pampulha',
    
    // Brasil - Regionais
    'SSA': 'Salvador',
    'REC': 'Recife',
    'FOR': 'Fortaleza',
    'NAT': 'Natal',
    'MCZ': 'Maceió',
    'AJU': 'Aracaju',
    'JPA': 'João Pessoa',
    'POA': 'Porto Alegre',
    'FLN': 'Florianópolis',
    'CWB': 'Curitiba',
    'MAO': 'Manaus',
    'BEL': 'Belém',
    'THE': 'Teresina',
    'SLZ': 'São Luís',
    'CGB': 'Cuiabá',
    'CGR': 'Campo Grande',
    'GYN': 'Goiânia',
    'VIX': 'Vitória',
    
    // Internacional - Europa
    'LIS': 'Lisboa',
    'OPO': 'Porto',
    'MAD': 'Madrid',
    'BCN': 'Barcelona',
    'CDG': 'Paris Charles de Gaulle',
    'ORY': 'Paris Orly',
    'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa',
    'VCE': 'Veneza',
    'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow',
    'LGW': 'Londres Gatwick',
    'AMS': 'Amsterdam',
    'FRA': 'Frankfurt',
    'MUC': 'Munique',
    'ZRH': 'Zurique',
    'VIE': 'Viena',
    'ATH': 'Atenas',
    'IST': 'Istambul',
    
    // Internacional - Américas
    'MCO': 'Orlando',
    'MIA': 'Miami',
    'JFK': 'Nova York JFK',
    'LGA': 'Nova York LaGuardia',
    'LAX': 'Los Angeles',
    'SFO': 'São Francisco',
    'LAS': 'Las Vegas',
    'DFW': 'Dallas',
    'ATL': 'Atlanta',
    'CUN': 'Cancún',
    'MEX': 'Cidade do México',
    'BOG': 'Bogotá',
    'PTY': 'Panamá',
    'SAL': 'San Salvador',
    'LIM': 'Lima',
    'SCL': 'Santiago',
    'EZE': 'Ezeiza',
    'AEP': 'Aeroparque',
    'MVD': 'Montevidéu',
    'ASU': 'Assunção',
    'UIO': 'Quito',
    'CCS': 'Caracas',
    
    // Internacional - Outros
    'DXB': 'Dubai',
    'DOH': 'Doha',
    'CAI': 'Cairo',
    'JNB': 'Joanesburgo',
    'NRT': 'Tóquio Narita',
    'ICN': 'Seul',
    'SIN': 'Singapura',
    'SYD': 'Sydney',
    'AKL': 'Auckland'
};

// ================================================================================
// 🧳 REGRAS DE BAGAGEM PADRONIZADAS
// ================================================================================

export const REGRAS_BAGAGEM = {
    // Padrões mais comuns
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg',
    COM_DESPACHADA_32KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 32kg',
    DUAS_DESPACHADAS: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 2 bagagens despachadas de 23kg cada',
    
    // Formatos alternativos (para compatibilidade)
    SO_MAO: 'Só mala de mão incluída',
    MAO_DESPACHADA: 'Mala de mão + bagagem despachada',
    MAO_DUAS_DESPACHADAS: 'Mala de mão + 2 bagagens despachadas',
    
    // Regras especiais
    EXECUTIVA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 2 bagagens despachadas de 32kg cada',
    PRIMEIRA_CLASSE: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 3 bagagens despachadas de 32kg cada'
};

// ================================================================================
// 🎯 TEMPLATES BÁSICOS (VERSÃO INICIAL)
// ================================================================================

export const TEMPLATES_BASIC = {
    AEREO_SIMPLES: `*{companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v4.0)`,

    HOTEL: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel} ⭐⭐⭐
📍 {localizacao}
🛏️ {tipo_quarto}
☕ {regime}
💰 R$ {valor} total

Valores sujeitos a confirmação e disponibilidade (v4.0)`,

    MULTIPLAS_COMPANHIAS: `*OPÇÃO 1 - {companhia1} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor1} para {passageiros}

*OPÇÃO 2 - {companhia2} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor2} para {passageiros}

Valores sujeitos a confirmação e disponibilidade (v4.0)`,

    DICAS: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {DESTINO}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
{descricao}

🎯 *PRINCIPAIS PASSEIOS:*
1. {passeio1}
2. {passeio2}
3. {passeio3}

🌡️ *CLIMA:*
• Temperatura: {temp_min}°C a {temp_max}°C
• {condicao_clima}

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ {transporte}
• Refeição: R$ {refeicao}

Valores sujeitos a confirmação e disponibilidade (v4.0)`,

    RANKING: `🏆 *RANKING DE HOTÉIS - {DESTINO}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - {hotel_luxo1}*
📍 {localizacao_luxo1}
💰 Diária média: R$ {valor_luxo1}

🥈 *2º - {hotel_luxo2}*
📍 {localizacao_luxo2}
💰 Diária média: R$ {valor_luxo2}

Valores sujeitos a confirmação e disponibilidade (v4.0)`
};

// ================================================================================
// 🔍 PADRÕES DE DETECÇÃO
// ================================================================================

export const DETECTION_PATTERNS = {
    // Detecção de companhias aéreas
    AIRLINES: {
        patterns: [
            /copa\s*airlines?/gi,
            /latam/gi,
            /avianca/gi,
            /gol/gi,
            /azul/gi,
            /tap\s*portugal/gi,
            /iberia/gi,
            /emirates/gi,
            /lufthansa/gi,
            /air\s*france/gi,
            /klm/gi,
            /american\s*airlines/gi,
            /delta/gi,
            /united/gi
        ]
    },
    
    // Detecção de tipos de orçamento
    BUDGET_TYPES: {
        hotel: [
            /hotel/gi,
            /pousada/gi,
            /resort/gi,
            /comfort\s*suites/gi,
            /preferencial/gi
        ],
        
        multiple_companies: [
            /opção\s*\d+/gi,
            /plano\s*\d+/gi,
            /alternativa/gi
        ],
        
        multitrecho: [
            /multitrecho/gi,
            /multi[\-\s]*trecho/gi,
            /trecho\s*\d+/gi
        ],
        
        tips: [
            /dicas/gi,
            /sugestões/gi,
            /recomendações/gi
        ],
        
        ranking: [
            /ranking/gi,
            /classificação/gi,
            /melhores\s*hotéis/gi
        ]
    },
    
    // Detecção de dados específicos
    DATA_EXTRACTION: {
        passengers: [
            /total\s*\((\d+)\s*adultos?\)/gi,
            /(\d+)\s*adultos?/gi,
            /(\d+)\s*adultos?,\s*(\d+)\s*crianças?/gi,
            /(\d+)\s*adultos?,\s*(\d+)\s*bebês?\s*e\s*(\d+)\s*crianças?/gi
        ],
        
        baggage: [
            /com\s*bagagem/gi,
            /bagagem\s*despachada/gi,
            /bagagens\s*inclusas/gi,
            /mala\s*de\s*até\s*23kg/gi
        ],
        
        installments: [
            /entrada\s*de\s*r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*r\$\s*([\d.,]+)/gi,
            /(\d+)x\s*de\s*r\$\s*([\d.,]+)/gi,
            /parcelamento/gi
        ],
        
        seat_reservation: [
            /pré[\-\s]*reserva\s*de\s*assento/gi,
            /marcação\s*de\s*assento/gi,
            /escolha\s*de\s*assento/gi
        ]
    }
};

// ================================================================================
// 🌍 CONFIGURAÇÕES POR DESTINO
// ================================================================================

export const DESTINATION_CONFIG = {
    'Orlando': {
        timezone: 'America/New_York',
        currency: 'USD',
        flight_duration_from_brazil: '8-10 hours',
        plus_one_rule: true, // Aplicar (+1) na volta
        common_airports: ['MCO'],
        season_info: {
            high: 'Dezembro a Março',
            low: 'Setembro a Novembro'
        }
    },
    
    'Lisboa': {
        timezone: 'Europe/Lisbon',
        currency: 'EUR',
        flight_duration_from_brazil: '8-9 hours',
        plus_one_rule: true,
        common_airports: ['LIS'],
        season_info: {
            high: 'Junho a Agosto',
            low: 'Novembro a Março'
        }
    },
    
    'Buenos Aires': {
        timezone: 'America/Argentina/Buenos_Aires',
        currency: 'ARS',
        flight_duration_from_brazil: '2-3 hours',
        plus_one_rule: false,
        common_airports: ['EZE', 'AEP'],
        season_info: {
            high: 'Dezembro a Março',
            low: 'Junho a Agosto'
        }
    }
};

// ================================================================================
// 🔧 CONFIGURAÇÕES DE PROCESSAMENTO
// ================================================================================

export const PROCESSING_CONFIG = {
    // Configurações de data
    DATE_FORMATS: {
        input_patterns: [
            /(\d{1,2})\s+de\s+(\w+)/gi,
            /(\d{1,2})\/(\d{1,2})/gi,
            /(\w+),?\s*(\d{1,2})\/(\d{2})/gi
        ],
        output_format: 'DD/MM',
        months_map: {
            'janeiro': '01', 'jan': '01',
            'fevereiro': '02', 'fev': '02',
            'março': '03', 'mar': '03',
            'abril': '04', 'abr': '04',
            'maio': '05', 'mai': '05',
            'junho': '06', 'jun': '06',
            'julho': '07', 'jul': '07',
            'agosto': '08', 'ago': '08',
            'setembro': '09', 'set': '09',
            'outubro': '10', 'out': '10',
            'novembro': '11', 'nov': '11',
            'dezembro': '12', 'dez': '12'
        }
    },
    
    // Configurações de limpeza
    CLEANUP_RULES: {
        remove_weekdays: true,
        convert_airport_codes: true,
        standardize_flight_types: true,
        add_version_tag: true,
        remove_markdown: true
    },
    
    // Configurações de validação
    VALIDATION_RULES: {
        min_content_length: 10,
        max_content_length: 50000,
        required_fields: ['conteudoPrincipal'],
        allowed_types: ['Aéreo', 'Hotel', 'Cruzeiro', 'Multitrechos', 'Dicas', 'Ranking']
    }
};

// ================================================================================
// 📊 MÉTRICAS E MONITORAMENTO
// ================================================================================

export const METRICS_CONFIG = {
    // Eventos para tracking
    TRACKED_EVENTS: [
        'request_received',
        'type_detected',
        'ai_called',
        'processing_completed',
        'response_sent',
        'error_occurred'
    ],
    
    // Métricas de performance
    PERFORMANCE_THRESHOLDS: {
        response_time_warning: 10000, // 10s
        response_time_critical: 30000, // 30s
        content_size_warning: 10000,   // 10k chars
        content_size_critical: 50000   // 50k chars
    },
    
    // Configurações de log
    LOG_LEVELS: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    }
};

// ================================================================================
// 🔄 INFORMAÇÕES DE SISTEMA
// ================================================================================

export const SYSTEM_INFO = {
    name: SYSTEM_CONFIG.SYSTEM_NAME,
    version: SYSTEM_CONFIG.VERSION,
    build_date: SYSTEM_CONFIG.BUILD_DATE,
    
    // Capacidades do sistema
    capabilities: [
        'Múltiplos formatos de orçamento',
        'Detecção automática de tipo',
        'Processamento de imagens',
        'Correção automática de dados',
        'Suporte a múltiplas IAs',
        'Resposta JSON garantida',
        'Sistema modular expansível'
    ],
    
    // Status dos módulos (será atualizado conforme implementamos)
    modules: {
        core: 'active',
        detectors: 'pending',
        processors: 'pending',
        templates: 'basic',
        tests: 'pending'
    }
};

// ================================================================================
// 🔄 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`📊 Constantes v${SYSTEM_CONFIG.VERSION} carregadas:`);
console.log(`   - ${Object.keys(AEROPORTOS).length} aeroportos mapeados`);
console.log(`   - ${Object.keys(REGRAS_BAGAGEM).length} regras de bagagem`);
console.log(`   - ${Object.keys(TEMPLATES_BASIC).length} templates básicos`);
console.log(`   - Sistema: ${SYSTEM_CONFIG.SYSTEM_NAME} v${SYSTEM_CONFIG.VERSION}`);
console.log(`   - Ambiente: ${SYSTEM_CONFIG.ENVIRONMENT}`);
