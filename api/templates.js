// api/templates.js - CVC ITAQUA v3.1
// ARQUIVO 1: TEMPLATES E CONSTANTES
// ================================================================================

export const CONFIG = {
    VERSION: '3.1'
};

// ================================================================================
// TABELA DE AEROPORTOS
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
    'SSA': 'Salvador', 
    'REC': 'Recife',
    'FOR': 'Fortaleza', 
    'POA': 'Porto Alegre', 
    'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 
    'MAO': 'Manaus', 
    'BEL': 'Belém',
    'NAT': 'Natal', 
    'MCZ': 'Maceió', 
    'AJU': 'Aracaju',
    'JPA': 'João Pessoa', 
    'THE': 'Teresina', 
    'SLZ': 'São Luís',
    'CGB': 'Cuiabá', 
    'CGR': 'Campo Grande', 
    'GYN': 'Goiânia',
    
    // Internacional - Europa
    'LIS': 'Lisboa', 
    'OPO': 'Porto', 
    'MAD': 'Madrid',
    'BCN': 'Barcelona', 
    'CDG': 'Paris Charles de Gaulle', 
    'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa', 
    'VCE': 'Veneza', 
    'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow', 
    'AMS': 'Amsterdam', 
    'FRA': 'Frankfurt',
    'MUC': 'Munique', 
    'ZRH': 'Zurique', 
    'VIE': 'Viena',
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 
    'MIA': 'Miami', 
    'MCO': 'Orlando',
    'LAX': 'Los Angeles', 
    'SFO': 'São Francisco', 
    'LAS': 'Las Vegas',
    'CUN': 'Cancún', 
    'MEX': 'Cidade do México', 
    'PTY': 'Panamá',
    'EZE': 'Ezeiza', 
    'SCL': 'Santiago', 
    'LIM': 'Lima',
    'BOG': 'Bogotá', 
    'UIO': 'Quito', 
    'MVD': 'Montevidéu'
};

// ================================================================================
// REGRAS DE BAGAGEM
// ================================================================================

export const REGRAS_BAGAGEM = {
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg',
    COM_DESPACHADA_32KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 32kg',
    DUAS_DESPACHADAS: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 2 bagagens despachadas de 23kg cada'
};

// ================================================================================
// TEMPLATES DOS PRODUTOS
// ================================================================================

export const TEMPLATES = {
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} {tipo_voo_ida}
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} {tipo_voo_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
💺 {assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.1)`,
    
    // 2. AÉREO COM CONEXÃO DETALHADA  
    AEREO_CONEXAO_DETALHADA: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem} {hora_ida1} / {aeroporto_conexao_ida} {hora_chegada_ida1} {tipo_voo_ida1}
{data_ida2} - {aeroporto_conexao_ida} {hora_ida2} / {aeroporto_destino} {hora_chegada_ida2} {tipo_voo_ida2}
        Tempo de conexão: {tempo_conexao_ida} em {cidade_conexao_ida}
--
{data_volta1} - {aeroporto_destino} {hora_volta1} / {aeroporto_conexao_volta} {hora_chegada_volta1} {tipo_voo_volta1}
{data_volta2} - {aeroporto_conexao_volta} {hora_volta2} / {aeroporto_origem} {hora_chegada_volta2} {tipo_voo_volta2}
        Tempo de conexão: {tempo_conexao_volta} em {cidade_conexao_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.1)`
};

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    CONFIG,
    AEROPORTOS,
    TEMPLATES,
    REGRAS_BAGAGEM
};
