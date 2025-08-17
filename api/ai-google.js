// api/ai-google.js - VERSÃO DEBUG v2.89
// Esta versão ajuda a identificar onde está o erro

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

    // GET - Status
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: '2.89-DEBUG',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.89 DEBUG',
            env_check: {
                has_openai_key: !!process.env.OPENAI_API_KEY,
                has_anthropic_key: !!process.env.ANTHROPIC_API_KEY,
                openai_key_length: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
                anthropic_key_length: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0
            }
        });
    }

    // POST - Com debug detalhado
    if (req.method === 'POST') {
        try {
            // Debug 1: Verificar se o body existe
            if (!req.body) {
                return res.status(200).json({
                    success: false,
                    error: 'Body vazio',
                    debug: 'req.body is null or undefined'
                });
            }

            // Debug 2: Extrair dados
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

            const conteudoPrincipal = observacoes || textoColado || pdfContent || '';

            // Debug 3: Verificar conteúdo
            if (!conteudoPrincipal.trim() && !imagemBase64) {
                return res.status(200).json({
                    success: false,
                    error: 'Sem conteúdo para processar',
                    debug: {
                        observacoes_length: observacoes.length,
                        textoColado_length: textoColado.length,
                        tem_imagem: !!imagemBase64
                    }
                });
            }

            // Debug 4: Verificar APIs disponíveis
            const temOpenAI = !!process.env.OPENAI_API_KEY;
            const temClaude = !!process.env.ANTHROPIC_API_KEY;

            if (!temOpenAI && !temClaude) {
                // RETORNAR RESULTADO MOCK SEM APIs
                return res.status(200).json({
                    success: true,
                    result: gerarResultadoMock(destino || 'Lisboa', adultos, criancas),
                    metadata: {
                        version: '2.89',
                        tipo: 'MOCK',
                        aviso: 'Nenhuma API key configurada - resultado exemplo'
                    }
                });
            }

            // Debug 5: Tentar processar com IA disponível
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            let resultado;

            try {
                if (usarClaude && temClaude) {
                    resultado = await processarComClaude(conteudoPrincipal, imagemBase64, destino);
                } else if (temOpenAI) {
                    resultado = await processarComGPT(conteudoPrincipal, destino, adultos, criancas);
                } else {
                    resultado = gerarResultadoMock(destino || 'Lisboa', adultos, criancas);
                }

                return res.status(200).json({
                    success: true,
                    result: resultado,
                    metadata: {
                        version: '2.89',
                        ia_usada: usarClaude && temClaude ? 'claude' : temOpenAI ? 'gpt' : 'mock',
                        destino: destino || 'detectado'
                    }
                });

            } catch (iaError) {
                // Se IA falhar, retornar mock
                console.error('Erro IA:', iaError);
                return res.status(200).json({
                    success: true,
                    result: gerarResultadoMock(destino || 'Lisboa', adultos, criancas),
                    metadata: {
                        version: '2.89',
                        tipo: 'FALLBACK',
                        erro_ia: iaError.message
                    }
                });
            }

        } catch (error) {
            // Debug 6: Capturar qualquer erro
            console.error('Erro geral:', error);
            return res.status(200).json({
                success: false,
                error: 'Erro no processamento',
                debug: {
                    message: error.message,
                    stack: error.stack,
                    type: error.constructor.name
                }
            });
        }
    }

    // Método não suportado
    return res.status(405).json({
        success: false,
        error: 'Método não suportado'
    });
}

// Função para gerar resultado mock/exemplo
function gerarResultadoMock(destino, adultos, criancas) {
    const passageiros = formatarPassageiros(adultos, criancas);
    
    return `*TAP Portugal - São Paulo ✈ ${destino}*
11/07 - Guarulhos 15:30 / ${destino} 05:20 (+1) (voo direto)
--
23/07 - ${destino} 17:05 / Guarulhos 23:10 (voo direto)

💰 R$ 5.000,00 para ${passageiros}
💳 10x de R$ 500,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
💺 Inclui pré reserva de assento
🏷️ Não reembolsável
🔗 https://www.cvc.com.br

Valores sujeitos a confirmação e disponibilidade (v2.89)`;
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

// Processamento simplificado com GPT
async function processarComGPT(conteudo, destino, adultos, criancas) {
    const passageiros = formatarPassageiros(adultos, criancas);
    
    const prompt = `
Formate um orçamento de viagem baseado nestas informações:
${conteudo}

Destino: ${destino || 'extrair do conteúdo'}
Passageiros: ${passageiros}

Use este formato:
*[Companhia] - São Paulo ✈ [Destino]*
[Data] - [Origem] [Hora] / [Destino] [Hora] ([tipo voo])
--
[Data] - [Destino] [Hora] / [Origem] [Hora] ([tipo voo])

💰 R$ [valor] para ${passageiros}
💳 [parcelamento]
✅ [bagagem]
💺 [assento]
🏷️ [reembolso]
🔗 [link]

Valores sujeitos a confirmação e disponibilidade (v2.89)`;

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
                    { role: 'system', content: 'Você é um assistente da CVC Itaqua.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`GPT erro: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        throw error;
    }
}

// Processamento simplificado com Claude
async function processarComClaude(conteudo, imagemBase64, destino) {
    const prompt = `Extraia informações de viagem e formate um orçamento para ${destino || 'o destino identificado'}.`;
    
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
            ] : prompt + '\n\nConteúdo: ' + conteudo
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
                max_tokens: 1000,
                temperature: 0.3,
                messages
            })
        });

        if (!response.ok) {
            throw new Error(`Claude erro: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
        
    } catch (error) {
        throw error;
    }
}

console.log('✅ CVC Itaqua v2.89 DEBUG carregado');
