// api/templates/all-templates.js - TODOS OS TEMPLATES ORGANIZADOS v4.0
// ================================================================================
// 📋 TODOS OS TEMPLATES DO MANUAL CVC ORGANIZADOS POR CATEGORIA
// 🎯 Base para construção de prompts e formatação
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// ✈️ TEMPLATES DE AÉREO
// ================================================================================

export const TEMPLATES_AEREO = {
    
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 2. AÉREO COM CONEXÃO DETALHADA
    AEREO_CONEXAO_DETALHADA: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_conexao} {hora_chegada_conexao} (voo direto)
(conexão em {cidade_conexao} - {tempo_espera} de espera)
{data_ida} - {aeroporto_conexao} {hora_saida_conexao} / {aeroporto_destino} {hora_chegada_ida} (voo direto)
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 3. AÉREO SOMENTE IDA
    AEREO_SOMENTE_IDA: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 4. MÚLTIPLAS OPÇÕES - 2 PLANOS
    MULTIPLAS_OPCOES_2: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
💳 {parcelamento1}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
💳 {parcelamento2}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 5. MÚLTIPLAS OPÇÕES - 3 PLANOS
    MULTIPLAS_OPCOES_3: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - R$ {valor3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 6. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
    MULTIPLAS_COMPANHIAS: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
🔗 {link2}

🏷️ {reembolso}
Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 🗺️ TEMPLATES MULTITRECHO
// ================================================================================

export const TEMPLATES_MULTITRECHO = {
    
    MULTITRECHO: `*Multitrecho - {companhias}*
{data_inicio} a {data_fim} ({dias} dias e {noites} noites)

*Trecho 1:* {origem1} → {destino1}
{data1} - {aeroporto1} {hora1} / {aeroporto_chegada1} {hora_chegada1} ({tipo_voo1})

*Trecho 2:* {origem2} → {destino2}
{data2} - {aeroporto2} {hora2} / {aeroporto_chegada2} {hora_chegada2} ({tipo_voo2})

*Trecho 3:* {origem3} → {destino3}
{data3} - {aeroporto3} {hora3} / {aeroporto_chegada3} {hora_chegada3} ({tipo_voo3})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 🏨 TEMPLATES DE HOTÉIS
// ================================================================================

export const TEMPLATES_HOTEIS = {
    
    // 1. HOTÉIS MÚLTIPLAS OPÇÕES
    HOTEIS_MULTIPLAS: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel1} ⭐{estrelas1}
📍 {localizacao1}
🛏️ {tipo_quarto1}
☕ {regime1}
💰 R$ {valor1} total

**OPÇÃO 2** - {nome_hotel2} ⭐{estrelas2}
📍 {localizacao2}
🛏️ {tipo_quarto2}
☕ {regime2}
💰 R$ {valor2} total

**OPÇÃO 3** - {nome_hotel3} ⭐{estrelas3}
📍 {localizacao3}
🛏️ {tipo_quarto3}
☕ {regime3}
💰 R$ {valor3} total

💳 {parcelamento}
Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

    // 2. ROTEIRO DE HOTÉIS
    ROTEIRO_HOTEIS: `*Roteiro {destino}*
{passageiros}

📅 **{data1} a {data2}** ({noites1} noites)
🏨 {hotel1} - {cidade1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1}

📅 **{data2} a {data3}** ({noites2} noites)
🏨 {hotel2} - {cidade2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2}

📅 **{data3} a {data4}** ({noites3} noites)
🏨 {hotel3} - {cidade3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3}

💰 **VALOR TOTAL DO ROTEIRO:** R$ {valor_total}
💳 {parcelamento}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 🏖️ TEMPLATES DE PACOTES
// ================================================================================

export const TEMPLATES_PACOTES = {
    
    PACOTE_COMPLETO: `*Pacote {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para {destino}
- Taxas de Embarque
- Traslado {tipo_traslado}
- {passeios}
- {seguro}
- {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {origem} {hora_ida} / {destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {destino} {hora_volta} / {origem} {hora_chegada_volta} ({tipo_voo})

**OPÇÃO 1** - {nome_hotel1}
📍 {endereco1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1} para {passageiros}

**OPÇÃO 2** - {nome_hotel2} ⭐ Preferencial
📍 {endereco2}
🛏️ {tipo_quarto2} com {regime2}
✅ Reembolsável conforme regras do bilhete
💰 R$ {valor2} para {passageiros}

**OPÇÃO 3** - {nome_hotel3}
📍 {endereco3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3} para {passageiros}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 🚢 TEMPLATES DE CRUZEIROS
// ================================================================================

export const TEMPLATES_CRUZEIROS = {
    
    CRUZEIRO: `🚢 *Cruzeiro {nome_navio}* – {duracao} noites
{passageiros}
📅 Embarque: {data_embarque} ({dia_semana})
📍 Saída e chegada: {porto}
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
{opcoes_cabines}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️`
};

// ================================================================================
// 💡 TEMPLATES DE DICAS E RANKINGS
// ================================================================================

export const TEMPLATES_DICAS = {
    
    // 1. DICAS DE DESTINO
    DICAS_DESTINO: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {DESTINO}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
1. {passeio1}
2. {passeio2}
3. {passeio3}
4. {passeio4}
5. {passeio5}

🌡️ *CLIMA:*
• Temperatura: {temp_min}°C a {temp_max}°C
• {condicao_clima}
• Leve: {roupas_recomendadas}

🍽️ *GASTRONOMIA:*
• Pratos típicos: {pratos_tipicos}
• Preço médio refeição: R$ {preco_refeicao}

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ {transporte_publico}
• Táxi do aeroporto: R$ {taxi_aeroporto}
• Entrada museus: R$ {entrada_museus}

📱 *DICAS PRÁTICAS:*
• {moeda_cambio}
• {idioma}
• {gorjetas}
• {seguranca}

🚨 *IMPORTANTE:*
{avisos_especificos}

🎁 *PRODUTOS CVC:*
Oferecemos passeios guiados, traslados confortáveis, seguro viagem completo e chip internacional. Consulte nossos especialistas!`,

    // 2. RANKING DE HOTÉIS
    RANKING_HOTEIS: `🏆 *RANKING DE HOTÉIS - {DESTINO}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - {hotel_luxo1}*
📍 {localizacao_luxo1}
💰 Diária média: R$ {valor_luxo1}
✨ {diferencial_luxo1}

🥈 *2º - {hotel_luxo2}*
📍 {localizacao_luxo2}
💰 Diária média: R$ {valor_luxo2}
✨ {diferencial_luxo2}

━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐ *CATEGORIA SUPERIOR*

🥇 *1º - {hotel_superior1}*
📍 {localizacao_superior1}
💰 Diária média: R$ {valor_superior1}
✨ {diferencial_superior1}

━━━━━━━━━━━━━━━━━━

⭐⭐⭐ *CATEGORIA ECONÔMICA*

🥇 *1º - {hotel_economico1}*
📍 {localizacao_economico1}
💰 Diária média: R$ {valor_economico1}
✨ {diferencial_economico1}

━━━━━━━━━━━━━━━━━━

📌 *DICA:* {dica_escolha_hotel}

🎁 *PRODUTOS CVC:*
Oferecemos reservas em todos esses hotéis, traslados exclusivos e pacotes personalizados. Consulte nossos especialistas!`
};

// ================================================================================
// 🎯 MAPEAMENTO DE TIPOS PARA TEMPLATES
// ================================================================================

export const MAPEAMENTO_TEMPLATES = {
    'AEREO_SIMPLES': TEMPLATES_AEREO.AEREO_SIMPLES,
    'AEREO_CONEXAO_DETALHADA': TEMPLATES_AEREO.AEREO_CONEXAO_DETALHADA,
    'AEREO_SOMENTE_IDA': TEMPLATES_AEREO.AEREO_SOMENTE_IDA,
    'MULTIPLAS_OPCOES_2': TEMPLATES_AEREO.MULTIPLAS_OPCOES_2,
    'MULTIPLAS_OPCOES_3': TEMPLATES_AEREO.MULTIPLAS_OPCOES_3,
    'MULTIPLAS_COMPANHIAS': TEMPLATES_AEREO.MULTIPLAS_COMPANHIAS,
    'MULTITRECHO': TEMPLATES_MULTITRECHO.MULTITRECHO,
    'HOTEIS_MULTIPLAS': TEMPLATES_HOTEIS.HOTEIS_MULTIPLAS,
    'ROTEIRO_HOTEIS': TEMPLATES_HOTEIS.ROTEIRO_HOTEIS,
    'PACOTE_COMPLETO': TEMPLATES_PACOTES.PACOTE_COMPLETO,
    'CRUZEIRO': TEMPLATES_CRUZEIROS.CRUZEIRO,
    'DICAS_DESTINO': TEMPLATES_DICAS.DICAS_DESTINO,
    'RANKING_HOTEIS': TEMPLATES_DICAS.RANKING_HOTEIS
};

// ================================================================================
// 🔍 FUNÇÕES UTILITÁRIAS
// ================================================================================

/**
 * Obtém template por tipo
 * @param {string} tipo - Tipo do orçamento
 * @returns {string} Template correspondente
 */
export function obterTemplate(tipo) {
    const template = MAPEAMENTO_TEMPLATES[tipo];
    
    if (!template) {
        console.warn(`⚠️ Template não encontrado para tipo: ${tipo}`);
        return TEMPLATES_AEREO.AEREO_SIMPLES; // Fallback
    }
    
    return template;
}

/**
 * Lista todos os tipos disponíveis
 * @returns {Array} Array com todos os tipos
 */
export function listarTipos() {
    return Object.keys(MAPEAMENTO_TEMPLATES);
}

/**
 * Verifica se um tipo existe
 * @param {string} tipo - Tipo a verificar
 * @returns {boolean} Se o tipo existe
 */
export function tipoExiste(tipo) {
    return Object.prototype.hasOwnProperty.call(MAPEAMENTO_TEMPLATES, tipo);
}

/**
 * Obtém templates por categoria
 * @param {string} categoria - Categoria (AEREO, HOTEIS, etc.)
 * @returns {Object} Templates da categoria
 */
export function obterTemplatesPorCategoria(categoria) {
    switch (categoria.toUpperCase()) {
        case 'AEREO':
            return TEMPLATES_AEREO;
        case 'HOTEIS':
            return TEMPLATES_HOTEIS;
        case 'PACOTES':
            return TEMPLATES_PACOTES;
        case 'CRUZEIROS':
            return TEMPLATES_CRUZEIROS;
        case 'DICAS':
            return TEMPLATES_DICAS;
        case 'MULTITRECHO':
            return TEMPLATES_MULTITRECHO;
        default:
            return {};
    }
}

// ================================================================================
// 📊 ESTATÍSTICAS DOS TEMPLATES
// ================================================================================

export const ESTATISTICAS_TEMPLATES = {
    total: Object.keys(MAPEAMENTO_TEMPLATES).length,
    categorias: {
        aereo: Object.keys(TEMPLATES_AEREO).length,
        hoteis: Object.keys(TEMPLATES_HOTEIS).length,
        pacotes: Object.keys(TEMPLATES_PACOTES).length,
        cruzeiros: Object.keys(TEMPLATES_CRUZEIROS).length,
        dicas: Object.keys(TEMPLATES_DICAS).length,
        multitrecho: Object.keys(TEMPLATES_MULTITRECHO).length
    }
};

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    TEMPLATES_AEREO,
    TEMPLATES_HOTEIS,
    TEMPLATES_PACOTES,
    TEMPLATES_CRUZEIROS,
    TEMPLATES_DICAS,
    TEMPLATES_MULTITRECHO,
    MAPEAMENTO_TEMPLATES,
    obterTemplate,
    listarTipos,
    tipoExiste,
    obterTemplatesPorCategoria,
    ESTATISTICAS_TEMPLATES
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ All Templates v${SYSTEM_CONFIG.VERSION} carregado`);
console.log(`📋 Templates disponíveis: ${ESTATISTICAS_TEMPLATES.total}`);
console.log(`📊 Por categoria:`, ESTATISTICAS_TEMPLATES.categorias);
