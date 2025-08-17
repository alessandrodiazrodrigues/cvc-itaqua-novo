// api/ai-google.js - CVC ITAQUA v2.89
// Sistema de Templates para Formatação de Orçamentos

// ================================================================================
// CONFIGURAÇÕES
// ================================================================================

const CONFIG = {
    VERSION: '2.89'
};

// ================================================================================
// HANDLER PRINCIPAL - EXPORTAÇÃO CORRETA PARA VERCEL
// ================================================================================

export default async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Handle GET - Status check
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: CONFIG.VERSION,
            message: 'CVC Itaqua API v2.89 funcionando!'
        });
    }
    
    // Validar método POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido - use POST'
        });
    }
    
    try {
        // Extrair dados do body
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 1,
            criancas = 0,
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = req.body;
        
        // Combinar conteúdo
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // Validação básica
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }
        
        // Detectar tipo e destino
        const tipoOrcamento = detectarTipo(conteudoPrincipal, tipos);
        const destinoFinal = extrairDestino(conteudoPrincipal, destino);
        
        // Formatar passageiros
        const passageiros = formatarPassageiros(adultos, criancas);
        
        // Gerar prompt para IA
        const prompt = gerarPrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, passageiros, parcelamento);
        
        // Decidir qual IA usar
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        
        let resultado;
        
        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            resultado = await processarComClaude(prompt, imagemBase64);
        } else if (process.env.OPENAI_API_KEY) {
            resultado = await processarComGPT(prompt);
        } else {
            // Fallback sem IA - retorna template básico
            resultado = gerarResultadoBasico(tipoOrcamento, destinoFinal, passageiros);
        }
        
        // Retornar sucesso
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                destino: destinoFinal,
                ia_usada: usarClaude ? 'claude' : 'gpt'
            }
        });
        
    } catch (error) {
        console.error('Erro no handler:', error);
        
        // IMPORTANTE: Sempre retornar JSON válido
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar orçamento',
            details: error.message,
            result: 'Não foi possível processar o orçamento. Tente novamente.'
        });
    }
}

// ================================================================================
// FUNÇÕES AUXILIARES
// ================================================================================

function detectarTipo(conteudo, tipos) {
    const texto = conteudo.toLowerCase();
    
    // Prioridade para tipos selecionados
    if (tipos && tipos.length > 0) {
        if (tipos.includes('Dicas')) return 'DICAS';
        if (tipos.includes('Ranking')) return 'RANKING';
        if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
        if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
        if (tipos.includes('Hotel')) return 'HOTEL';
    }
    
    // Detecção automática
    if (texto.includes('dicas')) return 'DICAS';
    if (texto.includes('ranking')) return 'RANKING';
    if (texto.includes('multitrecho')) return 'MULTITRECHO';
    if (texto.includes('cruzeiro')) return 'CRUZEIRO';
    if (texto.includes('hotel')) return 'HOTEL';
    
    // Detectar múltiplas opções
    const valores = (texto.match(/r\$\s*[\d.,]+/gi) || []).length;
    if (valores >= 3) return 'MULTIPLAS_OPCOES';
    
    return 'AEREO_SIMPLES';
}

function extrairDestino(conteudo, destinoForm) {
    if (destinoForm && destinoForm.trim()) return destinoForm;
    
    // Lista básica de destinos
    const destinos = {
        'lisboa': 'Lisboa',
        'porto': 'Porto',
        'paris': 'Paris',
        'madrid': 'Madrid',
        'roma': 'Roma',
        'orlando': 'Orlando',
        'miami': 'Miami',
        'cancun': 'Cancún',
        'cancún': 'Cancún',
        'salvador': 'Salvador',
        'fortaleza': 'Fortaleza'
    };
    
    const texto = conteudo.toLowerCase();
    for (const [key, value] of Object.entries(destinos)) {
        if (texto.includes(key)) return value;
    }
    
    return 'Destino';
}

function formatarPassageiros(adultos, criancas) {
    const numAdultos = parseInt(adultos) || 2;
    const numCriancas = parseInt(criancas) || 0;
    
    let resultado = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
    
    if (numCriancas > 0) {
        resultado += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
    }
    
    return resultado;
}

// ================================================================================
// TEMPLATES
// ================================================================================

function gerarPrompt(tipo, conteudo, destino, passageiros, parcelamento) {
    const templates = {
        AEREO_SIMPLES: `
Formate um orçamento aéreo simples para ${destino}.
Extraia as informações de: ${conteudo}

FORMATO:
*[Companhia] - São Paulo ✈ ${destino}*
[Data Ida] - [Aeroporto] [Hora] / [Destino] [Hora] ([tipo voo])
--
[Data Volta] - [Destino] [Hora] / [Aeroporto] [Hora] ([tipo voo])

💰 R$ [valor] para ${passageiros}
💳 [parcelamento]
✅ [bagagem]
💺 [assento se tiver]
🏷️ [reembolso]
🔗 [link]

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

        MULTIPLAS_OPCOES: `
Formate múltiplas opções de voo para ${destino}.
Extraia as informações de: ${conteudo}

Crie 3 opções no formato:
*OPÇÃO X - [Companhia] - São Paulo ✈ ${destino}*
[detalhes do voo]
💰 R$ [valor] para ${passageiros}
[demais informações]

Termine com: Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

        DICAS: `
Gere dicas de viagem REAIS e ATUALIZADAS para ${destino}.

FORMATO:
💡 *DICAS PARA ${destino.toUpperCase()}*

🌟 *Sobre ${destino}*
[Descrição breve e atrativa]

🎯 *PRINCIPAIS PASSEIOS:*
[Lista de 5 atrações principais]

🌡️ *CLIMA:*
[Informações de clima]

🍽️ *GASTRONOMIA:*
[Pratos típicos e preços]

💰 *CUSTOS MÉDIOS:*
[Transporte, alimentação, etc]

[Mais seções relevantes]`,

        RANKING: `
Crie um ranking de 3 hotéis para ${destino}.

FORMATO:
🏆 *RANKING DOS HOTÉIS EM ${destino.toUpperCase()}*

🥇 *1º LUGAR: [Nome Hotel]*
[Detalhes, localização, avaliações]

🥈 *2º LUGAR: [Nome Hotel]*
[Detalhes, localização, avaliações]

🥉 *3º LUGAR: [Nome Hotel]*
[Detalhes, localização, avaliações]

💡 *RECOMENDAÇÃO:*
[Recomendação baseada no perfil]`
    };
    
    return templates[tipo] || templates.AEREO_SIMPLES;
}

// ================================================================================
// PROCESSAMENTO COM IAs
// ================================================================================

async function processarComClaude(prompt, imagemBase64) {
    try {
        const messages = [{
            role: 'user',
            content: imagemBase64 ? [
                { type: 'text', text: prompt },
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: imagemBase64.split(';')[0].split(':')[1],
                        data: imagemBase64.split(',')[1]
                    }
                }
            ] : prompt
        }];
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 2048,
                temperature: 0.3,
                messages,
                system: 'Você é um assistente da CVC Itaqua especializado em formatar orçamentos.'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Claude erro: ${response.status}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
        
    } catch (error) {
        console.error('Erro Claude:', error);
        throw error;
    }
}

async function processarComGPT(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um assistente da CVC Itaqua. Formate orçamentos de viagem seguindo os modelos fornecidos.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2048
            })
        });
        
        if (!response.ok) {
            throw new Error(`GPT erro: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('Erro GPT:', error);
        throw error;
    }
}

// ================================================================================
// FALLBACK - Resultado básico sem IA
// ================================================================================

function gerarResultadoBasico(tipo, destino, passageiros) {
    const resultados = {
        AEREO_SIMPLES: `*Companhia Aérea - São Paulo ✈ ${destino}*
15/03 - Guarulhos 08:00 / ${destino} 12:00 (+1) (com conexão)
--
22/03 - ${destino} 14:00 / Guarulhos 22:00 (com conexão)

💰 R$ 5.000,00 para ${passageiros}
💳 10x de R$ 500,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
🏷️ Não reembolsável
🔗 https://www.cvc.com.br

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

        DICAS: `💡 *DICAS PARA ${destino.toUpperCase()}*

🌟 *Sobre ${destino}*
Um destino incrível com muitas atrações!

🎯 *PRINCIPAIS PASSEIOS:*
1. Pontos turísticos principais
2. Museus e cultura
3. Gastronomia local
4. Compras
5. Vida noturna

💰 *INFORMAÇÕES ÚTEIS:*
• Pesquise sobre moeda local
• Verifique documentação necessária
• Contrate seguro viagem

Consulte nossos especialistas para mais informações!`,

        RANKING: `🏆 *RANKING DOS HOTÉIS EM ${destino.toUpperCase()}*

🥇 *1º LUGAR: Hotel Premium*
Excelente localização e serviços

🥈 *2º LUGAR: Hotel Executivo*
Bom custo-benefício

🥉 *3º LUGAR: Hotel Econômico*
Opção mais em conta

Consulte disponibilidade e valores!`
    };
    
    return resultados[tipo] || resultados.AEREO_SIMPLES;
}

// ================================================================================
// LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('✅ CVC Itaqua v2.89 carregado');
console.log('📋 Sistema de templates para orçamentos');
console.log('🤖 Suporte a GPT e Claude');
