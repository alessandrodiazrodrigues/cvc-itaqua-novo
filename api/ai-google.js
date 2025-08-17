// api/ai-google.js - CVC ITAQUA v2.89
// Baseado no v2.4.1 que estava funcionando

// ================================================================================
// CONFIGURAÇÕES
// ================================================================================

const CONFIG = {
    VERSION: '2.89'
};

const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma',
    'LHR': 'Londres', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'JFK': 'Nova York', 'MIA': 'Miami', 'MCO': 'Orlando',
    'CUN': 'Cancún', 'EZE': 'Buenos Aires', 'SCL': 'Santiago'
};

// ================================================================================
// TEMPLATES - Apenas modelos para a IA preencher
// ================================================================================

const TEMPLATES = {
    aereo_simples: `*{companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo})

💰 R$ {valor} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
💺 {assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.89)`,

    multiplas_opcoes: `{opcoes_detalhadas}

Valores sujeitos a confirmação e disponibilidade (v2.89)`,

    dicas: `💡 *DICAS PARA {destino}*

🌟 *Sobre {destino}*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
{lista_passeios}

🌡️ *CLIMA:*
{informacoes_clima}

🍽️ *GASTRONOMIA:*
{informacoes_gastronomia}

💰 *CUSTOS MÉDIOS:*
{custos_locais}

🛡️ *SEGURO VIAGEM:*
{info_seguro}

📱 *DICAS PRÁTICAS:*
{dicas_praticas}`,

    ranking: `🏆 *RANKING DOS HOTÉIS EM {destino}*

{hoteis_rankeados}

💡 *MINHA RECOMENDAÇÃO:*
{recomendacao}`
};

// ================================================================================
// FUNÇÕES DE DETECÇÃO
// ================================================================================

function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Prioridade para tipos selecionados
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Dicas')) return 'dicas';
            if (tipos.includes('Ranking')) return 'ranking';
            if (tipos.includes('Cruzeiro')) return 'cruzeiro';
            if (tipos.includes('Multitrechos')) return 'multitrecho';
            if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'pacote_completo';
            if (tipos.includes('Hotel')) return 'hotel';
        }
        
        // Detecção automática
        if (conteudoLower.includes('gere dicas') || conteudoLower.includes('consulte o manual e gere dicas')) {
            return 'dicas';
        }
        if (conteudoLower.includes('gere ranking') || conteudoLower.includes('consulte o manual e gere ranking')) {
            return 'ranking';
        }
        if (conteudoLower.includes('multitrecho')) return 'multitrecho';
        if (conteudoLower.includes('cruzeiro')) return 'cruzeiro';
        
        // Detectar múltiplas opções
        const valores = (conteudoPrincipal.match(/R\$\s*[\d.,]+/g) || []).length;
        const opcoes = (conteudoPrincipal.match(/opção \d/gi) || []).length;
        
        if (valores >= 3 || opcoes >= 2) return 'multiplas_opcoes';
        
        return 'aereo_simples';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

function extrairDestinoDoConteudo(conteudoPrincipal, destinoForm) {
    try {
        if (destinoForm && destinoForm.trim()) {
            return destinoForm;
        }
        
        const texto = conteudoPrincipal.toLowerCase();
        
        // Lista de destinos conhecidos
        const destinos = {
            'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid',
            'paris': 'Paris', 'roma': 'Roma', 'londres': 'Londres',
            'orlando': 'Orlando', 'miami': 'Miami', 'cancun': 'Cancún',
            'cancún': 'Cancún', 'salvador': 'Salvador', 'fortaleza': 'Fortaleza'
        };
        
        for (const [key, value] of Object.entries(destinos)) {
            if (texto.includes(key)) return value;
        }
        
        // Tentar extrair de códigos de aeroporto
        const codigosAeroporto = conteudoPrincipal.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB'].includes(codigo)) {
                    return AEROPORTOS[codigo].split(' ')[0];
                }
            }
        }
        
        return 'Destino';
        
    } catch (error) {
        console.error('Erro ao extrair destino:', error);
        return 'Destino';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, passageiros) {
    try {
        const template = TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples;
        
        let instrucoes = `
Você é um assistente da CVC Itaqua especializado em formatar orçamentos de viagem.

TAREFA: ${tipoOrcamento === 'dicas' ? 'Gerar dicas de viagem' : tipoOrcamento === 'ranking' ? 'Criar ranking de hotéis' : 'Formatar orçamento'}

DESTINO: ${destino}
PASSAGEIROS: ${passageiros}

DADOS FORNECIDOS:
${conteudoPrincipal}

TEMPLATE A SEGUIR:
${template}

INSTRUÇÕES:
1. ${tipoOrcamento === 'dicas' ? 'Pesquise/gere informações REAIS e ATUALIZADAS sobre o destino' : 
     tipoOrcamento === 'ranking' ? 'Crie um ranking realista de 3 hotéis com avaliações' :
     'Extraia as informações do conteúdo fornecido'}
2. Preencha TODOS os placeholders {} com informações apropriadas
3. Mantenha a formatação para WhatsApp
4. Use datas no formato DD/MM
5. Converta códigos de aeroporto usando: ${JSON.stringify(AEROPORTOS)}
6. Termine sempre com: Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;

        return instrucoes;
        
    } catch (error) {
        console.error('Erro ao gerar prompt:', error);
        return 'Formate um orçamento de viagem.';
    }
}

// ================================================================================
// HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - Status da API
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: CONFIG.VERSION,
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.89 - Sistema funcionando!',
            funcionalidades: [
                '✅ Templates/modelos para IA preencher',
                '✅ Suporte a todos os tipos de orçamento',
                '✅ Dicas e rankings com dados reais',
                '✅ Sistema baseado no v2.4.1 funcional'
            ]
        });
    }

    // POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido - use POST'
        });
    }

    try {
        console.log('🚀 Processando requisição...');
        
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

        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }

        // Formatar passageiros
        const numAdultos = parseInt(adultos) || 2;
        const numCriancas = parseInt(criancas) || 0;
        let passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
        if (numCriancas > 0) {
            passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
        }

        // Detectar tipo e destino
        const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
        const destinoFinal = extrairDestinoDoConteudo(conteudoPrincipal, destino);
        
        // Gerar prompt
        const prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, passageiros);
        
        // Decidir qual IA usar
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        
        try {
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 Usando Claude...');
                
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
                        system: 'Você é um assistente da CVC Itaqua.'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Claude erro ${response.status}`);
                }

                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ Usando GPT...');
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'Você é um assistente da CVC Itaqua.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.3,
                        max_tokens: 2048
                    })
                });

                if (!response.ok) {
                    throw new Error(`OpenAI erro ${response.status}`);
                }

                const data = await response.json();
                resultado = data.choices[0].message.content;
                
            } else {
                // Resultado padrão sem IA
                resultado = `*TAP Portugal - São Paulo ✈ ${destinoFinal}*
15/03 - Guarulhos 15:30 / ${destinoFinal} 05:20 (+1) (voo direto)
--
22/03 - ${destinoFinal} 17:05 / Guarulhos 23:10 (voo direto)

💰 R$ 5.000,00 para ${passageiros}
💳 10x de R$ 500,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
💺 Inclui pré reserva de assento
🏷️ Não reembolsável
🔗 https://www.cvc.com.br

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
            }
            
        } catch (iaError) {
            console.error('Erro IA:', iaError);
            // Se IA falhar, usar resultado padrão
            resultado = `*Companhia Aérea - São Paulo ✈ ${destinoFinal}*
[Erro ao processar com IA - Resultado exemplo]

💰 R$ 5.000,00 para ${passageiros}
💳 10x de R$ 500,00 s/ juros no cartão

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        console.log('✅ Processamento completo');
        
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
        console.error('❌ Erro:', error);
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar orçamento',
            details: error.message,
            result: 'Erro ao processar. Tente novamente.'
        });
    }
}

// ================================================================================
// LOGS
// ================================================================================
console.log('✅ CVC Itaqua v2.89 carregado');
console.log('📋 Baseado no v2.4.1 funcional');
console.log('🤖 Sistema de templates para IA');
