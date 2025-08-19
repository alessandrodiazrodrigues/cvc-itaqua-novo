// ================================================================================
// 🚀 CVC ITAQUA v3.2 - SISTEMA COMPLETO FUNCIONANDO
// ================================================================================
// ARQUIVO: api/ai-google.js - SEM IMPORTS, TUDO INTEGRADO
// ================================================================================

const { Anthropic } = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

// ================================================================================
// 🎯 CONFIGURAÇÕES E CONSTANTES (INTEGRADAS)
// ================================================================================

const CONFIG = {
    VERSION: '3.2',
    SISTEMA: 'CVC ITAQUA'
};

const AEROPORTOS = {
    // Brasil
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    
    // Internacional
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris', 'FCO': 'Roma',
    'LHR': 'Londres', 'JFK': 'Nova York', 'MIA': 'Miami',
    'EZE': 'Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima'
};

// ================================================================================
// 📝 TEMPLATES DO MANUAL (INTEGRADOS)
// ================================================================================

const TEMPLATES = {
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

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

Valores sujeitos a confirmação e disponibilidade`,

    MULTIPLAS_OPCOES: `Use este formato quando houver múltiplas opções de voo/hotel.
Para cada opção, formate como:

*OPÇÃO 1 - {companhia} - {origem} ✈ {destino}*
[detalhes do voo]
💰 R$ {valor}
[outros detalhes]

*OPÇÃO 2 - {companhia} - {origem} ✈ {destino}*
[detalhes do voo]
💰 R$ {valor}
[outros detalhes]`
};

// ================================================================================
// 🔧 FUNÇÕES DE PÓS-PROCESSAMENTO (INTEGRADAS)
// ================================================================================

function posProcessar(texto, conteudoOriginal, parcelamento) {
    let resultado = texto;
    
    // 1. Converter códigos de aeroporto
    for (const [codigo, nome] of Object.entries(AEROPORTOS)) {
        const regex = new RegExp(`\\b${codigo}\\b`, 'g');
        resultado = resultado.replace(regex, nome);
    }
    
    // 2. Corrigir formatos de data
    resultado = resultado.replace(/(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const meses = {
            'janeiro': '01', 'jan': '01', 'fevereiro': '02', 'fev': '02',
            'março': '03', 'mar': '03', 'abril': '04', 'abr': '04',
            'maio': '05', 'mai': '05', 'junho': '06', 'jun': '06',
            'julho': '07', 'jul': '07', 'agosto': '08', 'ago': '08',
            'setembro': '09', 'set': '09', 'outubro': '10', 'out': '10',
            'novembro': '11', 'nov': '11', 'dezembro': '12', 'dez': '12'
        };
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    // 3. Aplicar parcelamento se fornecido
    if (parcelamento && !resultado.includes('💳')) {
        const valorMatch = resultado.match(/R\$\s*([\d.,]+)/);
        if (valorMatch) {
            const valor = parseFloat(valorMatch[1].replace('.', '').replace(',', '.'));
            const parcela = (valor / parseInt(parcelamento)).toFixed(2).replace('.', ',');
            const linhaParcelamento = `💳 ${parcelamento}x de R$ ${parcela} s/ juros no cartão`;
            
            // Inserir após o valor
            resultado = resultado.replace(/(💰[^\n]+)/, `$1\n${linhaParcelamento}`);
        }
    }
    
    // 4. Garantir versão no final
    if (!resultado.includes('(v')) {
        resultado = resultado.replace(
            /Valores sujeitos a confirmação e disponibilidade/,
            `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`
        );
    }
    
    // 5. Remover linhas vazias extras
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    return resultado.trim();
}

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL - HANDLER DA API
// ================================================================================

module.exports = async function handler(req, res) {
    console.log('[v3.2] 🚀 CVC ITAQUA API iniciada');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    
    try {
        const dados = req.body;
        console.log('[v3.2] 📋 Dados recebidos:', {
            temImagem: !!dados.imagemBase64,
            temPDF: !!dados.pdfContent,
            temTexto: !!dados.observacoes || !!dados.textoColado,
            destino: dados.destino,
            tipos: dados.tipos
        });
        
        // Processar orçamento
        const resultado = await processarOrcamento(dados);
        
        // Retornar sucesso
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: dados.imagemBase64 ? 'Claude' : 'GPT-4o-mini',
            version: CONFIG.VERSION
        });
        
    } catch (error) {
        console.error('[v3.2] ❌ Erro:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erro ao processar orçamento'
        });
    }
};

// ================================================================================
// 🎯 PROCESSAMENTO PRINCIPAL DO ORÇAMENTO
// ================================================================================

async function processarOrcamento(dados) {
    console.log('[v3.2] 🔧 Iniciando processamento...');
    
    // 1. Preparar conteúdo principal
    const conteudoPrincipal = prepararConteudo(dados);
    
    // 2. Detectar tipo de orçamento
    const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, dados.tipos);
    console.log('[v3.2] 📊 Tipo detectado:', tipoOrcamento);
    
    // 3. Buscar template apropriado
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    
    // 4. Montar prompt específico para IA
    const prompt = montarPrompt(template, conteudoPrincipal, dados, tipoOrcamento);
    
    // 5. Decidir qual IA usar
    const usarClaude = dados.imagemBase64 || 
                      conteudoPrincipal.length > 3000 ||
                      tipoOrcamento.includes('PACOTE');
    
    // 6. Chamar IA apropriada
    let respostaIA;
    if (usarClaude && process.env.ANTHROPIC_API_KEY) {
        respostaIA = await chamarClaude(prompt, dados.imagemBase64);
    } else if (process.env.OPENAI_API_KEY) {
        respostaIA = await chamarGPT(prompt);
    } else {
        throw new Error('Nenhuma API key configurada');
    }
    
    // 7. Aplicar pós-processamento
    const resultado = posProcessar(respostaIA, conteudoPrincipal, dados.parcelamento);
    
    return resultado;
}

// ================================================================================
// 🔍 DETECÇÃO DE TIPO DE ORÇAMENTO (CORRIGIDA)
// ================================================================================

function detectarTipoOrcamento(conteudo, tipos) {
    const conteudoLower = conteudo.toLowerCase();
    
    // Verificar se tem DETALHES REAIS de conexão
    const temDetalhesConexao = verificarDetalhesConexao(conteudo);
    
    // Se tem múltiplas opções
    if (conteudoLower.includes('opção 1') || conteudoLower.includes('opção 2')) {
        return 'MULTIPLAS_OPCOES';
    }
    
    // Se tem detalhes de conexão REAIS
    if (temDetalhesConexao) {
        return 'AEREO_CONEXAO_DETALHADA';
    }
    
    // Padrão: aéreo simples
    return 'AEREO_SIMPLES';
}

// ================================================================================
// 🔍 VERIFICAR SE TEM DETALHES REAIS DE CONEXÃO
// ================================================================================

function verificarDetalhesConexao(conteudo) {
    // Procurar por padrões que indicam DETALHES REAIS de conexão
    const padroes = [
        /conexão em (\w+)/i,           // "conexão em Madrid"
        /escala em (\w+)/i,             // "escala em Lisboa"
        /(\d+h?\s*\d*\s*min?\s*de espera)/i,  // "2h de espera"
        /parada em (\w+)/i,             // "parada em Paris"
        /via (\w+)/i                    // "via Londres"
    ];
    
    // Verificar se NÃO é apenas tempo total de voo
    const tempoTotal = /(\d+h\s*\d*min)\s*(uma escala|1 escala)/i;
    if (tempoTotal.test(conteudo) && !conteudo.match(/de espera/i)) {
        return false; // É tempo total, não tempo de espera
    }
    
    for (let padrao of padroes) {
        if (padrao.test(conteudo)) {
            return true;
        }
    }
    
    return false;
}

// ================================================================================
// 📝 MONTAGEM DO PROMPT PARA IA
// ================================================================================

function montarPrompt(template, conteudo, dados, tipoOrcamento) {
    const instrucaoConexao = `
REGRA CRÍTICA SOBRE CONEXÕES:
- Se o texto diz "Uma escala" mas NÃO fornece detalhes do aeroporto de conexão, use formato SIMPLES: (com conexão)
- NUNCA invente aeroportos de conexão que não foram mencionados
- "16h 50min Uma escala" significa tempo TOTAL do voo com uma parada, NÃO é tempo de espera
- Exemplo CORRETO sem detalhes: "Guarulhos 19:15 / Lisboa 16:05 (+1) (com conexão)"
- Exemplo ERRADO: inventar "conexão em Madrid" quando não foi mencionado
`;
    
    let prompt = `Você é especialista em formatação de orçamentos CVC.

${instrucaoConexao}

TEMPLATE A SEGUIR:
${template}

DADOS FORNECIDOS:
${conteudo}

REGRAS:
1. Use o template EXATAMENTE como fornecido
2. Converta códigos de aeroporto para nomes completos
3. NUNCA invente informações não fornecidas
4. Se há "Uma escala" sem detalhes, use apenas "(com conexão)"
5. Mantenha formatação para WhatsApp
6. Sempre termine com "Valores sujeitos a confirmação e disponibilidade"

PASSAGEIROS: ${montarTextoPassageiros(dados)}

Retorne APENAS o orçamento formatado.`;

    return prompt;
}

// ================================================================================
// 🤖 CHAMADAS PARA AS IAs
// ================================================================================

async function chamarClaude(prompt, imagemBase64 = null) {
    console.log('[v3.2] 🤖 Chamando Claude...');
    
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    const messages = [{
        role: 'user',
        content: imagemBase64 ? [
            {
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: imagemBase64.split(',')[0].split(':')[1].split(';')[0],
                    data: imagemBase64.split(',')[1]
                }
            },
            { type: 'text', text: prompt }
        ] : prompt
    }];
    
    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 2000,
            temperature: 0.3,
            messages: messages
        });
        
        return response.content[0].text;
    } catch (error) {
        console.error('[v3.2] ❌ Erro Claude:', error);
        // Fallback para GPT se Claude falhar
        return await chamarGPT(prompt);
    }
}

async function chamarGPT(prompt) {
    console.log('[v3.2] 🤖 Chamando GPT-4o-mini...');
    
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Você é especialista em formatação de orçamentos CVC. NUNCA invente informações. Siga o template fornecido EXATAMENTE.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 2000
        });
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error('[v3.2] ❌ Erro GPT:', error);
        throw new Error('Erro ao processar com GPT: ' + error.message);
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function prepararConteudo(dados) {
    const partes = [];
    
    if (dados.observacoes) partes.push(dados.observacoes);
    if (dados.textoColado) partes.push(dados.textoColado);
    if (dados.pdfContent) partes.push(dados.pdfContent);
    if (dados.destino) partes.push(`Destino: ${dados.destino}`);
    
    return partes.join('\n\n').trim();
}

function montarTextoPassageiros(dados) {
    const partes = [];
    
    if (dados.adultos) {
        const num = parseInt(dados.adultos);
        partes.push(`${String(num).padStart(2, '0')} ${num === 1 ? 'adulto' : 'adultos'}`);
    }
    
    if (dados.criancas && dados.criancas > 0) {
        const num = parseInt(dados.criancas);
        partes.push(`${String(num).padStart(2, '0')} ${num === 1 ? 'criança' : 'crianças'}`);
    }
    
    return partes.length > 0 ? partes.join(' + ') : '01 adulto';
}

// ================================================================================
// 🎯 LOG FINAL
// ================================================================================

console.log('[v3.2] ✅ CVC ITAQUA API carregada!');
console.log('[v3.2] 🔧 Correção: Não inventa conexões');
console.log('[v3.2] 📋 Versão:', CONFIG.VERSION);
