// api/prompts/prompt-builder.js - CONSTRUTOR INTELIGENTE DE PROMPTS v4.0
// ================================================================================
// 🧠 CONSTRÓI PROMPTS OTIMIZADOS PARA CADA IA E TIPO DE ORÇAMENTO
// 🎯 Adapta linguagem, complexidade e instruções por contexto
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';
import { obterTemplate } from '../templates/all-templates.js';

// ================================================================================
// 🧠 CONSTRUTOR PRINCIPAL DE PROMPTS
// ================================================================================

/**
 * Constrói prompt otimizado para o contexto específico
 * @param {Object} contexto - Contexto da requisição
 * @returns {string} Prompt otimizado
 */
export function construirPrompt(contexto) {
    const {
        conteudoPrincipal,
        tipoOrcamento,
        passageiros,
        destino,
        ehImagem = false,
        iaDestino = 'gpt', // 'gpt' ou 'claude'
        dadosExtraidos = {}
    } = contexto;
    
    console.log(`🧠 Construindo prompt para: ${tipoOrcamento} (${iaDestino})`);
    
    try {
        // 1. OBTER CONFIGURAÇÃO BASE DA IA
        const configIA = obterConfiguracaoIA(iaDestino);
        
        // 2. OBTER TEMPLATE ESPECÍFICO
        const template = obterTemplate(tipoOrcamento);
        
        // 3. CONSTRUIR SEÇÕES DO PROMPT
        const secoes = {
            abertura: construirAbertura(tipoOrcamento, configIA, ehImagem),
            regras: construirRegras(tipoOrcamento, configIA, ehImagem),
            template: construirSecaoTemplate(template, tipoOrcamento),
            exemplos: construirExemplos(tipoOrcamento, configIA),
            fechamento: construirFechamento(configIA)
        };
        
        // 4. MONTAR PROMPT FINAL
        const prompt = montarPromptFinal(secoes, conteudoPrincipal, passageiros);
        
        console.log(`✅ Prompt construído: ${prompt.length} caracteres`);
        
        return prompt;
        
    } catch (error) {
        console.error('❌ Erro ao construir prompt:', error);
        return construirPromptFallback(contexto);
    }
}

// ================================================================================
// ⚙️ CONFIGURAÇÕES POR IA
// ================================================================================

function obterConfiguracaoIA(iaDestino) {
    const configuracoes = {
        gpt: {
            nome: 'GPT-4o-mini',
            estilo: 'direto',
            detalhamento: 'médio',
            enfaseRegras: 'alta',
            usarExemplos: true,
            linguagem: 'técnica',
            limiteCaracteres: 3000
        },
        claude: {
            nome: 'Claude 3 Haiku',
            estilo: 'conversacional',
            detalhamento: 'alto',
            enfaseRegras: 'muito_alta',
            usarExemplos: true,
            linguagem: 'natural',
            limiteCaracteres: 4000
        }
    };
    
    return configuracoes[iaDestino] || configuracoes.gpt;
}

// ================================================================================
// 📝 CONSTRUÇÃO DE SEÇÕES
// ================================================================================

function construirAbertura(tipoOrcamento, configIA, ehImagem) {
    const aperturas = {
        gpt: {
            imagem: "Extraia e formate este orçamento de viagem da imagem para WhatsApp.",
            texto: "Formate este orçamento de viagem para WhatsApp seguindo EXATAMENTE o template.",
            dicas: "Gere dicas de viagem ESPECÍFICAS e úteis para o destino informado.",
            ranking: "Gere um ranking ESPECÍFICO de hotéis para o destino informado.",
            hotel: "Formate este orçamento de HOTEL para WhatsApp seguindo o template específico."
        },
        claude: {
            imagem: "Por favor, analise esta imagem de orçamento de viagem e formate-a adequadamente para WhatsApp.",
            texto: "Preciso que você formate este orçamento de viagem seguindo exatamente nosso template padrão.",
            dicas: "Crie dicas de viagem específicas e personalizadas para o destino solicitado.",
            ranking: "Desenvolva um ranking detalhado de hotéis para o destino especificado.",
            hotel: "Formate este orçamento de hospedagem seguindo nosso template específico para hotéis."
        }
    };
    
    const categoria = ehImagem ? 'imagem' :
                     tipoOrcamento.includes('DICAS') ? 'dicas' :
                     tipoOrcamento.includes('RANKING') ? 'ranking' :
                     tipoOrcamento.includes('HOTEL') ? 'hotel' : 'texto';
    
    return aperturas[configIA.estilo === 'direto' ? 'gpt' : 'claude'][categoria];
}

function construirRegras(tipoOrcamento, configIA, ehImagem) {
    const regrasBase = `
⚠️ REGRAS CRÍTICAS v${SYSTEM_CONFIG.VERSION}:
1. Use APENAS informações fornecidas no texto
2. NÃO invente horários, cidades ou detalhes
3. REMOVER dias da semana (ter, qua, qui, etc.)
4. Conversão: códigos aeroporto → nomes completos
5. Datas: DD/MM (27/01, NÃO "ter, 27/01")`;

    const regrasEspecificas = {
        AEREO_SIMPLES: `
6. Formato: *{Companhia} - {Origem} ✈ {Destino}*
7. Separador ida/volta: --
8. (+1) APENAS para volta Orlando chegada ≤ 08h`,

        HOTEIS_MULTIPLAS: `
6. ⚠️ ESTE É UM ORÇAMENTO DE HOTEL - NÃO ADICIONE VOOS!
7. Formato: *Hotéis em {destino}*
8. Período: {data_entrada} a {data_saida}`,

        DICAS_DESTINO: `
6. Seja ESPECÍFICO para o destino, não genérico
7. Inclua informações práticas e úteis
8. Finalize com produtos CVC`,

        RANKING_HOTEIS: `
6. Use hotéis REAIS do destino informado
7. Organize por categoria (Luxo, Superior, Econômica)
8. Inclua preços aproximados realistas`
    };

    let regras = regrasBase;
    
    if (regrasEspecificas[tipoOrcamento]) {
        regras += regrasEspecificas[tipoOrcamento];
    }
    
    if (ehImagem) {
        regras += `
9. Se mostra "Uma escala" sem cidade, use "(com conexão)"
10. Mantenha exatamente os horários mostrados na imagem`;
    }
    
    return regras;
}

function construirSecaoTemplate(template, tipoOrcamento) {
    if (tipoOrcamento.includes('DICAS') || tipoOrcamento.includes('RANKING')) {
        return `\nUse EXATAMENTE este formato:\n\n${template}`;
    }
    
    return `\nTEMPLATE A SEGUIR:\n${template}`;
}

function construirExemplos(tipoOrcamento, configIA) {
    if (!configIA.usarExemplos) return '';
    
    const exemplos = {
        AEREO_SIMPLES: `
EXEMPLO DE FORMATAÇÃO:
*Gol - São Paulo ✈ Porto Alegre*
17/09 - Guarulhos 17:05 / Porto Alegre 23:40 (com conexão)
--
24/09 - Porto Alegre 08:00 / Guarulhos 09:35 (voo direto)

💰 R$ 773,37 para 01 adulto
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`,

        HOTEIS_MULTIPLAS: `
EXEMPLO HOTEL:
*Hotéis em Orlando - Florida*
Período: 27/01 a 04/02 (8 noites)
02 adultos + 01 criança (5 anos)

**OPÇÃO 1** - Comfort Suites Maingate East ⭐⭐⭐
📍 2775 Florida Plaza Blvd
🛏️ Studio Suite
☕ Café da manhã
💰 R$ 5.568,03 total`
    };
    
    return exemplos[tipoOrcamento] || '';
}

function construirFechamento(configIA) {
    const fechamentos = {
        gpt: "⚠️ CRÍTICO: NÃO INVENTE INFORMAÇÕES - USE APENAS O TEXTO!",
        claude: "Lembre-se: mantenha fidelidade total ao conteúdo fornecido e siga rigorosamente o template especificado."
    };
    
    return fechamentos[configIA.estilo === 'direto' ? 'gpt' : 'claude'];
}

// ================================================================================
// 🔧 MONTAGEM FINAL DO PROMPT
// ================================================================================

function montarPromptFinal(secoes, conteudoPrincipal, passageiros) {
    const partes = [
        secoes.abertura,
        secoes.regras,
        `\nTEXTO ORIGINAL:\n${conteudoPrincipal}`,
        passageiros ? `\nPASSAGEIROS: ${passageiros}` : '',
        secoes.template,
        secoes.exemplos,
        secoes.fechamento
    ];
    
    return partes.filter(parte => parte.trim()).join('\n');
}

// ================================================================================
// 🆘 PROMPT FALLBACK
// ================================================================================

function construirPromptFallback(contexto) {
    console.warn('🆘 Usando prompt fallback');
    
    return `Formate este orçamento para WhatsApp:

${contexto.conteudoPrincipal}

Regras básicas:
- Use apenas informações do texto
- Remova dias da semana das datas
- Converta códigos de aeroporto para nomes
- Termine com: Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`;
}

// ================================================================================
// 🎯 PROMPTS ESPECÍFICOS POR SITUAÇÃO
// ================================================================================

/**
 * Constrói prompt para correção específica
 * @param {string} tipoCorrecao - Tipo de correção necessária
 * @param {string} textoOriginal - Texto a ser corrigido
 * @returns {string} Prompt de correção
 */
export function construirPromptCorrecao(tipoCorrecao, textoOriginal) {
    const promptsCorrecao = {
        datas: `Corrija apenas as datas neste texto, removendo dias da semana:
${textoOriginal}

Regra: "ter, 27/01" → "27/01"`,

        aeroportos: `Converta apenas os códigos de aeroporto para nomes de cidade:
${textoOriginal}

Exemplo: "GRU" → "Guarulhos"`,

        bagagem: `Corrija apenas a linha de bagagem seguindo o padrão:
${textoOriginal}

Use: "Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg"`,

        versao: `Corrija apenas a versão no final:
${textoOriginal}

Use: "Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})"`
    };
    
    return promptsCorrecao[tipoCorrecao] || `Corrija este texto: ${textoOriginal}`;
}

/**
 * Constrói prompt para validação
 * @param {string} textoFormatado - Texto formatado para validar
 * @param {string} tipoEsperado - Tipo esperado do orçamento
 * @returns {string} Prompt de validação
 */
export function construirPromptValidacao(textoFormatado, tipoEsperado) {
    return `Valide se este orçamento está correto para o tipo ${tipoEsperado}:

${textoFormatado}

Verifique:
1. Estrutura correta
2. Informações consistentes  
3. Formatação adequada
4. Versão correta (v${SYSTEM_CONFIG.VERSION})

Responda: VÁLIDO ou liste os problemas encontrados.`;
}

// ================================================================================
// 📊 ESTATÍSTICAS DE PROMPTS
// ================================================================================

export function obterEstatisticasPrompt(prompt) {
    return {
        caracteres: prompt.length,
        palavras: prompt.split(' ').length,
        linhas: prompt.split('\n').length,
        temRegras: prompt.includes('REGRAS'),
        temTemplate: prompt.includes('TEMPLATE'),
        temExemplo: prompt.includes('EXEMPLO'),
        adequadoGPT: prompt.length <= 3000,
        adequadoClaude: prompt.length <= 4000
    };
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    construirPrompt,
    construirPromptCorrecao,
    construirPromptValidacao,
    obterEstatisticasPrompt
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Prompt Builder v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('🧠 Funcionalidades: construção adaptativa, correção, validação');
