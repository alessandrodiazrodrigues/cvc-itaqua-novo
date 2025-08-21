// api/prompts/specific-prompts.js - PROMPTS ESPECÍFICOS v4.0
// ================================================================================
// 🎯 PROMPTS OTIMIZADOS PARA SITUAÇÕES ESPECÍFICAS
// 🧠 Contextos especiais, emergências e casos complexos
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// 🖼️ PROMPTS PARA IMAGENS
// ================================================================================

export const PROMPTS_IMAGEM = {
    
    // Análise geral de imagem
    ANALISE_GERAL: `Analise esta imagem de orçamento de viagem e extraia TODAS as informações visíveis.

⚠️ REGRAS CRÍTICAS v${SYSTEM_CONFIG.VERSION}:
1. Use SOMENTE informações VISÍVEIS na imagem
2. NÃO invente horários, preços ou detalhes
3. Se algo não estiver claro, use [não visível]
4. REMOVER dias da semana (ter, qua, qui, etc.)
5. Converter códigos aeroporto → nomes completos

EXTRAIR:
- Companhia aérea
- Destinos (origem e destino)
- Datas (formato DD/MM)
- Horários exatos mostrados
- Preços visíveis
- Quantidade de passageiros
- Tipo de voo (direto/conexão)
- Bagagem incluída
- Condições de reembolso

Se a imagem mostra "Uma escala" sem especificar cidade, use "(com conexão)".
Se mostra cidade de conexão, especifique qual.

NÃO adicione (+1) automaticamente - apenas se estiver mostrado na imagem.`,

    // Específico para orçamentos aéreos
    AEREO_IMAGEM: `Extraia este orçamento AÉREO da imagem e formate para WhatsApp.

FORMATO OBRIGATÓRIO:
*{Companhia} - {Origem} ✈ {Destino}*
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
✅ {bagagem se especificada}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})

⚠️ CRÍTICO: Mantenha EXATAMENTE os horários da imagem!`,

    // Específico para hotéis
    HOTEL_IMAGEM: `Extraia este orçamento de HOTEL da imagem.

⚠️ IMPORTANTE: NÃO adicione informações de voo!

FORMATO HOTEL:
*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel} ⭐{estrelas}
📍 {localização}
🛏️ {tipo_quarto}
☕ {regime}
💰 R$ {valor} total

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 🏨 PROMPTS ESPECÍFICOS PARA HOTÉIS
// ================================================================================

export const PROMPTS_HOTEL = {
    
    HOTEL_PURO: `Formate este orçamento de HOTEL seguindo nosso padrão específico.

⚠️ ESTE É UM ORÇAMENTO DE HOTEL - NÃO INCLUA VOOS OU AEROPORTOS!

TEXTO DO ORÇAMENTO:
{conteudo}

TEMPLATE HOTEL OBRIGATÓRIO:
*Hotéis em {destino}*
Período: {check-in} a {check-out} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel} ⭐{categoria}
📍 {localização}
🛏️ {tipo_quarto}
☕ {café_da_manhã/regime}
💰 R$ {valor} total

**OPÇÃO 2** - {nome_hotel2} ⭐{categoria2}
📍 {localização2}
🛏️ {tipo_quarto2}
☕ {regime2}
💰 R$ {valor2} total

💳 {parcelamento se houver}
Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})

REGRAS ESPECÍFICAS:
- NÃO adicionar referências a voos
- Usar período de hospedagem, não datas de ida/volta
- Focar em características do hotel
- Incluir regime alimentar se especificado`,

    ROTEIRO_HOTEIS: `Formate este ROTEIRO de hotéis sequenciais.

FORMATO ROTEIRO:
*Roteiro {destino}*
{passageiros}

📅 **{data1} a {data2}** ({noites1} noites)
🏨 {hotel1} - {cidade1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1}

📅 **{data2} a {data3}** ({noites2} noites)
🏨 {hotel2} - {cidade2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2}

💰 **VALOR TOTAL DO ROTEIRO:** R$ {valor_total}

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`
};

// ================================================================================
// 💡 PROMPTS PARA DICAS E RANKINGS
// ================================================================================

export const PROMPTS_DICAS = {
    
    DICAS_DESTINO: `Gere dicas de viagem ESPECÍFICAS para {destino}.

⚠️ IMPORTANTE: Seja específico para {destino}, NÃO genérico!

FORMATO OBRIGATÓRIO:
━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {DESTINO_MAIUSCULO}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
[Descrição específica e atrativa de {destino}]

🎯 *PRINCIPAIS PASSEIOS:*
1. [Atração específica 1 de {destino}]
2. [Atração específica 2 de {destino}]
3. [Atração específica 3 de {destino}]
4. [Atração específica 4 de {destino}]
5. [Atração específica 5 de {destino}]

🌡️ *CLIMA:*
• Temperatura: {temp_min}°C a {temp_max}°C
• [Condição do clima atual em {destino}]
• Leve: [roupas específicas para {destino}]

🍽️ *GASTRONOMIA:*
• Pratos típicos: [pratos locais de {destino}]
• Preço médio refeição: R$ [valor realista]

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ [valor específico]
• Táxi do aeroporto: R$ [valor específico]
• Entrada museus: R$ [valor específico]

📱 *DICAS PRÁTICAS:*
• [Moeda e câmbio específicos de {destino}]
• [Idioma local de {destino}]
• [Gorjetas locais de {destino}]
• [Segurança específica de {destino}]

🚨 *IMPORTANTE:*
[Avisos específicos para {destino}]

🎁 *PRODUTOS CVC:*
Oferecemos passeios guiados, traslados confortáveis, seguro viagem completo e chip internacional. Consulte nossos especialistas!

CRÍTICO: Use informações REAIS e ESPECÍFICAS de {destino}!`,

    RANKING_HOTEIS: `Gere um ranking ESPECÍFICO de hotéis para {destino}.

⚠️ IMPORTANTE: Use hotéis REAIS de {destino}, não genéricos!

FORMATO OBRIGATÓRIO:
🏆 *RANKING DE HOTÉIS - {DESTINO_MAIUSCULO}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - [Nome Real Hotel Luxo de {destino}]*
📍 [Localização específica em {destino}]
💰 Diária média: R$ [valor realista]
✨ [Diferencial específico do hotel]

🥈 *2º - [Nome Real Hotel Luxo 2 de {destino}]*
📍 [Localização específica em {destino}]
💰 Diária média: R$ [valor realista]
✨ [Diferencial específico do hotel]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐ *CATEGORIA SUPERIOR*

🥇 *1º - [Nome Real Hotel Superior de {destino}]*
📍 [Localização específica em {destino}]
💰 Diária média: R$ [valor realista]
✨ [Diferencial específico do hotel]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐ *CATEGORIA ECONÔMICA*

🥇 *1º - [Nome Real Hotel Econômico de {destino}]*
📍 [Localização específica em {destino}]
💰 Diária média: R$ [valor realista]
✨ [Diferencial específico do hotel]

━━━━━━━━━━━━━━━━━━

📌 *DICA:* [Dica específica sobre escolha de hotel em {destino}]

🎁 *PRODUTOS CVC:*
Oferecemos reservas em todos esses hotéis, traslados exclusivos e pacotes personalizados. Consulte nossos especialistas!

CRÍTICO: Use nomes REAIS de hotéis que existem em {destino}!`
};

// ================================================================================
// 🆘 PROMPTS DE EMERGÊNCIA
// ================================================================================

export const PROMPTS_EMERGENCIA = {
    
    ERRO_IA: `Houve um erro na formatação anterior. Refaça seguindo rigorosamente o template.

CONTEÚDO ORIGINAL:
{conteudo}

INSTRUÇÕES DE EMERGÊNCIA:
1. Use APENAS informações do texto original
2. Siga EXATAMENTE o template fornecido
3. NÃO invente dados que não estão no texto
4. Mantenha formatação simples e clara
5. Termine com a versão correta

TEMPLATE:
{template}

⚠️ CRÍTICO: Esta é uma correção de erro - seja preciso!`,

    FORMATACAO_QUEBRADA: `O texto está mal formatado. Corrija APENAS a formatação, mantendo todo o conteúdo.

TEXTO COM PROBLEMA:
{texto}

CORREÇÕES NECESSÁRIAS:
- Remover formatação markdown excessiva
- Corrigir quebras de linha
- Padronizar emojis
- Garantir versão correta (v${SYSTEM_CONFIG.VERSION})

NÃO altere informações, apenas a formatação!`,

    INFORMACAO_INCOMPLETA: `O orçamento está incompleto. Complete APENAS com base no texto fornecido.

TEXTO INCOMPLETO:
{texto}

COMPLETAR SE HOUVER INFORMAÇÃO:
- Passageiros (se mencionado)
- Bagagem (se especificada)
- Parcelamento (se informado)
- Reembolso (se mencionado)

NÃO invente informações não presentes no texto original!`
};

// ================================================================================
// 🔄 PROMPTS DE CORREÇÃO ESPECÍFICA
// ================================================================================

export const PROMPTS_CORRECAO = {
    
    APENAS_DATAS: `Corrija APENAS as datas neste orçamento, removendo dias da semana.

TEXTO:
{texto}

REGRA: "ter, 27/01" → "27/01"
Mantenha todo o resto igual.`,

    APENAS_AEROPORTOS: `Converta APENAS os códigos de aeroporto para nomes de cidade.

TEXTO:
{texto}

CONVERSÕES:
- GRU → Guarulhos
- CGH → Congonhas  
- MCO → Orlando
- LIS → Lisboa

Mantenha todo o resto igual.`,

    APENAS_VALORES: `Corrija APENAS o formato dos valores para o padrão CVC.

TEXTO:
{texto}

FORMATO: R$ 1.464,02 (com espaço após R$)
Mantenha todo o resto igual.`,

    APENAS_VERSAO: `Corrija APENAS a versão no final do orçamento.

TEXTO:
{texto}

VERSÃO CORRETA: Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})
Mantenha todo o resto igual.`
};

// ================================================================================
// 🧪 PROMPTS DE TESTE E VALIDAÇÃO
// ================================================================================

export const PROMPTS_VALIDACAO = {
    
    VALIDAR_ESTRUTURA: `Valide se este orçamento tem a estrutura correta para o tipo {tipo}.

ORÇAMENTO:
{texto}

VERIFICAR:
1. ✅ Título correto (*Companhia - Origem ✈ Destino*)
2. ✅ Formato de datas (DD/MM)
3. ✅ Valores no padrão (R$ 1.000,00)
4. ✅ Passageiros formatados
5. ✅ Versão correta (v${SYSTEM_CONFIG.VERSION})

RESPONDA: VÁLIDO ou liste os problemas específicos.`,

    COMPARAR_ORIGINAL: `Compare este orçamento formatado com o texto original e identifique inconsistências.

ORIGINAL:
{original}

FORMATADO:
{formatado}

Verifique se:
- Todos os dados originais foram preservados
- Nenhuma informação foi inventada
- Horários e preços estão corretos
- Formatação está adequada

RESPONDA: CONSISTENTE ou liste as inconsistências.`
};

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL DE SELEÇÃO
// ================================================================================

/**
 * Seleciona prompt específico baseado no contexto
 * @param {string} categoria - Categoria do prompt (IMAGEM, HOTEL, DICAS, etc.)
 * @param {string} tipo - Tipo específico dentro da categoria
 * @param {Object} variaveis - Variáveis para substituição
 * @returns {string} Prompt específico
 */
export function obterPromptEspecifico(categoria, tipo, variaveis = {}) {
    const categorias = {
        'IMAGEM': PROMPTS_IMAGEM,
        'HOTEL': PROMPTS_HOTEL,
        'DICAS': PROMPTS_DICAS,
        'EMERGENCIA': PROMPTS_EMERGENCIA,
        'CORRECAO': PROMPTS_CORRECAO,
        'VALIDACAO': PROMPTS_VALIDACAO
    };
    
    const prompt = categorias[categoria]?.[tipo];
    
    if (!prompt) {
        console.warn(`⚠️ Prompt específico não encontrado: ${categoria}.${tipo}`);
        return null;
    }
    
    // Substituir variáveis
    let promptFinal = prompt;
    for (const [chave, valor] of Object.entries(variaveis)) {
        promptFinal = promptFinal.replace(new RegExp(`{${chave}}`, 'g'), valor);
    }
    
    return promptFinal;
}

/**
 * Lista todos os prompts disponíveis por categoria
 * @returns {Object} Estrutura de prompts disponíveis
 */
export function listarPromptsDisponiveis() {
    return {
        IMAGEM: Object.keys(PROMPTS_IMAGEM),
        HOTEL: Object.keys(PROMPTS_HOTEL),
        DICAS: Object.keys(PROMPTS_DICAS),
        EMERGENCIA: Object.keys(PROMPTS_EMERGENCIA),
        CORRECAO: Object.keys(PROMPTS_CORRECAO),
        VALIDACAO: Object.keys(PROMPTS_VALIDACAO)
    };
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    PROMPTS_IMAGEM,
    PROMPTS_HOTEL,
    PROMPTS_DICAS,
    PROMPTS_EMERGENCIA,
    PROMPTS_CORRECAO,
    PROMPTS_VALIDACAO,
    obterPromptEspecifico,
    listarPromptsDisponiveis
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Specific Prompts v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('🎯 Categorias disponíveis:', Object.keys({
    IMAGEM: 1, HOTEL: 1, DICAS: 1, EMERGENCIA: 1, CORRECAO: 1, VALIDACAO: 1
}).join(', '));
