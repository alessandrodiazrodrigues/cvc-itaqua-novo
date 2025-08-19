// ================================================================================
// 🚀 CVC ITAQUA v3.2 - CORREÇÃO DE CONEXÕES
// ================================================================================
// ARQUIVO: api/ai-google.js - BACKEND PRINCIPAL CORRIGIDO
// ================================================================================

import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Importar templates e correções
import { TEMPLATES, AEROPORTOS, CONFIG } from './templates.js';
import { posProcessar } from './corrections.js';

// Configurar APIs
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ================================================================================
// 🎯 FUNÇÃO PRINCIPAL - HANDLER DA API
// ================================================================================

export default async function handler(req, res) {
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
            tipos: dados.tipos,
            parcelamento: dados.parcelamento
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
}

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
    const template = buscarTemplate(tipoOrcamento);
    
    // 4. Montar prompt específico para IA
    const prompt = montarPrompt(template, conteudoPrincipal, dados, tipoOrcamento);
    
    // 5. Decidir qual IA usar
    const usarClaude = dados.imagemBase64 || 
                      conteudoPrincipal.length > 3000 ||
                      tipoOrcamento.includes('PACOTE') ||
                      tipoOrcamento.includes('MULTITRECHO');
    
    // 6. Chamar IA apropriada
    let respostaIA;
    if (usarClaude) {
        respostaIA = await chamarClaude(prompt, dados.imagemBase64);
    } else {
        respostaIA = await chamarGPT(prompt);
    }
    
    // 7. Aplicar pós-processamento
    const resultado = posProcessar(respostaIA, conteudoPrincipal, dados.parcelamento);
    
    return resultado;
}

// ================================================================================
// 🔍 DETECÇÃO DE TIPO DE ORÇAMENTO
// ================================================================================

function detectarTipoOrcamento(conteudo, tipos) {
    const conteudoLower = conteudo.toLowerCase();
    
    // Se solicitado dicas específicas
    if (tipos && tipos.includes('Dicas')) {
        return 'DICAS';
    }
    
    // Se solicitado ranking específico
    if (tipos && tipos.includes('Ranking')) {
        return 'RANKING_HOTEIS';
    }
    
    // Cruzeiro
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || 
        conteudoLower.includes('cabine')) {
        return 'CRUZEIRO';
    }
    
    // Pacote completo
    if (conteudoLower.includes('pacote') || 
        (conteudoLower.includes('hotel') && conteudoLower.includes('aéreo'))) {
        return 'PACOTE_COMPLETO';
    }
    
    // Multitrecho
    if (conteudoLower.includes('multitrecho') || conteudoLower.includes('trecho 1')) {
        return 'MULTITRECHO';
    }
    
    // Múltiplas opções
    if (conteudoLower.includes('opção 1') || conteudoLower.includes('plano 1')) {
        return 'MULTIPLAS_OPCOES';
    }
    
    // Somente ida
    if (conteudoLower.includes('somente ida') || conteudoLower.includes('apenas ida') ||
        conteudoLower.includes('one way')) {
        return 'AEREO_SOMENTE_IDA';
    }
    
    // ⚠️ CORREÇÃO PRINCIPAL: Verificar se tem DETALHES reais de conexão
    const temDetalhesConexao = verificarDetalhesConexao(conteudo);
    
    if (temDetalhesConexao) {
        return 'AEREO_CONEXAO_DETALHADA';
    }
    
    // Padrão: aéreo simples
    return 'AEREO_SIMPLES';
}

// ================================================================================
// 🔍 NOVA FUNÇÃO: VERIFICAR SE TEM DETALHES REAIS DE CONEXÃO
// ================================================================================

function verificarDetalhesConexao(conteudo) {
    // Procurar por padrões que indicam DETALHES REAIS de conexão:
    // - Aeroporto de conexão mencionado (ex: "conexão em Madrid")
    // - Horários específicos da conexão
    // - Tempo de espera mencionado (ex: "2h de espera")
    
    const padroes = [
        /conexão em (\w+)/i,           // "conexão em Madrid"
        /escala em (\w+)/i,             // "escala em Lisboa"
        /(\d+h?\s*\d*\s*min?\s*de espera)/i,  // "2h de espera"
        /parada em (\w+)/i,             // "parada em Paris"
        /via (\w+)/i                    // "via Londres"
    ];
    
    for (let padrao of padroes) {
        if (padrao.test(conteudo)) {
            // Verificar se não é apenas "Uma escala" genérico
            if (!conteudo.match(/uma escala\s*\d+h/i)) {
                return true;
            }
        }
    }
    
    return false;
}

// ================================================================================
// 📝 MONTAGEM DO PROMPT PARA IA
// ================================================================================

function montarPrompt(template, conteudo, dados, tipoOrcamento) {
    // ⚠️ INSTRUÇÃO CRÍTICA ADICIONADA
    const instrucaoConexao = `
REGRA CRÍTICA SOBRE CONEXÕES:
- Se o texto diz "Uma escala" mas NÃO fornece detalhes (aeroporto, horários), use formato SIMPLES: (com conexão)
- NUNCA invente aeroportos de conexão que não foram mencionados
- "16h 50min" é o tempo TOTAL do voo, NÃO é tempo de espera
- Se não há detalhes específicos da conexão, NÃO use o template de conexão detalhada
- Exemplo correto sem detalhes: "Guarulhos 19:15 / Lisboa 16:05 (+1) (com conexão)"
- Exemplo ERRADO: inventar "conexão em Madrid" quando não foi mencionado
`;
    
    let prompt = `
Você é especialista em formatação de orçamentos de viagem para WhatsApp da CVC Itaquaquecetuba.
SIGA O MANUAL v3.2 COM PRECISÃO ABSOLUTA.

${instrucaoConexao}

TEMPLATE A SEGUIR EXATAMENTE:
${template}

DADOS FORNECIDOS:
${conteudo}

REGRAS OBRIGATÓRIAS:
1. Use o template EXATAMENTE como fornecido
2. Converta TODOS os códigos de aeroporto para nomes completos
3. NUNCA invente informações não fornecidas
4. Se há "Uma escala" sem detalhes, use apenas "(com conexão)"
5. Mantenha formatação para WhatsApp
6. Sempre termine com "Valores sujeitos a confirmação e disponibilidade"
7. NÃO adicione versão no final (será adicionada automaticamente)

PASSAGEIROS: ${montarTextoPassageiros(dados)}
PARCELAMENTO: ${dados.parcelamento ? dados.parcelamento + 'x sem juros' : 'detectar do texto'}

Retorne APENAS o orçamento formatado, sem explicações.`;

    return prompt;
}

// ================================================================================
// 🎯 BUSCAR TEMPLATE APROPRIADO
// ================================================================================

function buscarTemplate(tipo) {
    const mapa = {
        'AEREO_SIMPLES': TEMPLATES.AEREO_SIMPLES,
        'AEREO_CONEXAO_DETALHADA': TEMPLATES.AEREO_CONEXAO_DETALHADA,
        'AEREO_SOMENTE_IDA': TEMPLATES.AEREO_SOMENTE_IDA,
        'MULTIPLAS_OPCOES': TEMPLATES.MULTIPLAS_OPCOES,
        'MULTITRECHO': TEMPLATES.MULTITRECHO,
        'CRUZEIRO': TEMPLATES.CRUZEIRO,
        'PACOTE_COMPLETO': TEMPLATES.PACOTE_COMPLETO,
        'HOTEIS': TEMPLATES.HOTEIS,
        'ROTEIRO_HOTEIS': TEMPLATES.ROTEIRO_HOTEIS,
        'DICAS': TEMPLATES.DICAS,
        'RANKING_HOTEIS': TEMPLATES.RANKING_HOTEIS
    };
    
    return mapa[tipo] || TEMPLATES.AEREO_SIMPLES;
}

// ================================================================================
// 🤖 CHAMADAS PARA AS IAs
// ================================================================================

async function chamarClaude(prompt, imagemBase64 = null) {
    console.log('[v3.2] 🤖 Chamando Claude...');
    
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
        throw new Error('Erro ao processar com Claude: ' + error.message);
    }
}

async function chamarGPT(prompt) {
    console.log('[v3.2] 🤖 Chamando GPT-4o-mini...');
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Você é especialista em formatação de orçamentos CVC. NUNCA invente informações.'
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
    
    return partes.length > 0 ? partes.join(' + ') : 'detectar do texto';
}

// ================================================================================
// 🎯 LOG FINAL
// ================================================================================

console.log('[v3.2] ✅ CVC ITAQUA API carregada com sucesso!');
console.log('[v3.2] 📋 Versão:', CONFIG.VERSION);
console.log('[v3.2] 🔧 Correção aplicada: Não inventa detalhes de conexão');
