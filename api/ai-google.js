// api/ai-google.js - CVC ITAQUA v3.0
// ARQUIVO 3: HANDLER PRINCIPAL (lógica limpa e simples)
// ================================================================================

import { CONFIG, TEMPLATES, PROMPTS, AEROPORTOS } from './templates.js';
import { posProcessar, extrairDadosCompletos } from './corrections.js';

// ================================================================================
// DETECÇÃO DE TIPO DE ORÇAMENTO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Prioridade 1: Tipos selecionados no formulário
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Dicas')) return 'DICAS_WHATSAPP';
            if (tipos.includes('Ranking')) return 'RANKING_HOTEIS';
            if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
            if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
            if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'PACOTE_COMPLETO';
            if (tipos.includes('Hotel')) return 'SOMENTE_HOTEL';
        }
        
        // Prioridade 2: Detecção por conteúdo
        if (conteudoLower.includes('gere dicas') || conteudoLower.includes('dicas para')) {
            return 'DICAS_WHATSAPP';
        }
        if (conteudoLower.includes('gere ranking') || conteudoLower.includes('ranking de')) {
            return 'RANKING_HOTEIS';
        }
        if (conteudoLower.includes('multitrecho') || conteudoLower.includes('multi-trecho')) {
            return 'MULTITRECHO';
        }
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
            return 'CRUZEIRO';
        }
        if (conteudoLower.includes('seguro viagem')) {
            return 'SEGURO_VIAGEM';
        }
        if (conteudoLower.includes('ingresso') || conteudoLower.includes('parque')) {
            return 'INGRESSOS';
        }
        if (conteudoLower.includes('locação') || conteudoLower.includes('aluguel de carro')) {
            return 'LOCACAO_CARRO';
        }
        if (conteudoLower.includes('pacote') && conteudoLower.includes('hotel')) {
            return 'PACOTE_COMPLETO';
        }
        if (conteudoLower.includes('hotel') && !conteudoLower.includes('aéreo')) {
            return 'SOMENTE_HOTEL';
        }
        
        // Detectar se tem conexões detalhadas (múltiplos horários para um mesmo voo)
        const temConexaoDetalhada = detectarConexaoDetalhada(conteudoPrincipal);
        
        // Detectar múltiplas opções
        const valores = (conteudoPrincipal.match(/R\$\s*[\d.,]+/g) || []).length;
        const links = (conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br/g) || []).length;
        
        if (valores >= 3 || links >= 2) {
            return temConexaoDetalhada ? 'MULTIPLAS_OPCOES_DETALHADAS' : 'MULTIPLAS_OPCOES';
        }
        
        // Se tem conexão detalhada mas é voo único
        if (temConexaoDetalhada) {
            return 'AEREO_CONEXAO_DETALHADA';
        }
        
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

// Nova função para detectar conexões detalhadas
function detectarConexaoDetalhada(conteudo) {
    // Detecta padrões que indicam conexão com múltiplos trechos
    const padroes = [
        /tempo de conexão/i,
        /\d+h\d+min em/i,
        /escala em/i,
        /GRU.*MAD.*LIS/i,  // Rota típica com conexão
        /LIS.*MAD.*GRU/i,
        /\d{2}:\d{2}.*\d{2}:\d{2}.*\d{2}:\d{2}/  // Múltiplos horários
    ];
    
    return padroes.some(padrao => padrao.test(conteudo));
}

// ================================================================================
// EXTRAÇÃO DE DESTINO
// ================================================================================

function extrairDestino(conteudoPrincipal, destinoForm) {
    try {
        if (destinoForm && destinoForm.trim()) {
            return destinoForm;
        }
        
        const destinos = [
            'Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma',
            'Londres', 'Amsterdam', 'Frankfurt', 'Milão', 'Veneza',
            'Orlando', 'Miami', 'Nova York', 'Los Angeles', 'Cancún',
            'Buenos Aires', 'Santiago', 'Lima', 'Bogotá',
            'Salvador', 'Fortaleza', 'Recife', 'Natal', 'Maceió',
            'João Pessoa', 'Porto Seguro', 'Florianópolis'
        ];
        
        for (const destino of destinos) {
            if (conteudoPrincipal.includes(destino)) {
                return destino;
            }
        }
        
        return 'Destino';
        
    } catch (error) {
        console.error('Erro ao extrair destino:', error);
        return 'Destino';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT PARA IA
// ================================================================================

function gerarPrompt(tipoOrcamento, conteudoPrincipal, destino, passageiros) {
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    const promptEspecifico = PROMPTS[tipoOrcamento] || '';
    const dados = extrairDadosCompletos(conteudoPrincipal);
    
    // Usar passageiros extraídos se disponível
    if (dados.passageiros) {
        passageiros = dados.passageiros;
    }
    
    let prompt = `
TAREFA: Formatar orçamento CVC para WhatsApp.
TIPO: ${tipoOrcamento}
DESTINO: ${destino}
PASSAGEIROS: ${passageiros}

TEMPLATE A SEGUIR EXATAMENTE:
${template}

INSTRUÇÕES ESPECÍFICAS:
${promptEspecifico}

DADOS DO CONTEÚDO:
${conteudoPrincipal}

REGRAS CRÍTICAS:
1. Datas: DD/MM (não "11 de julho")
2. Aeroportos: nomes completos, use esta tabela: ${JSON.stringify(Object.entries(AEROPORTOS).slice(0, 10))}
3. Tipo voo: (voo direto) ou (uma escala em cidade) ou (com conexão)
4. Links: direto, sem markdown [texto](url)
5. Passageiros: exatamente ${passageiros}
6. Valores: manter originais do conteúdo
7. Preencha TODOS os placeholders {} do template
8. NÃO invente informações - use dados do conteúdo ou valores padrão razoáveis`;

    // Adicionar informações das opções detectadas
    if (dados.opcoes && dados.opcoes.length > 0) {
        prompt += '\n\nOPÇÕES DETECTADAS:\n';
        dados.opcoes.forEach((opcao, index) => {
            prompt += `
OPÇÃO ${index + 1}:
- Valor: R$ ${opcao.valor}
- Parcelamento: ${opcao.parcelamento}
- Bagagem: ${opcao.bagagem}
- Link: ${opcao.link}`;
        });
    }

    return prompt;
}

// ================================================================================
// PROCESSAMENTO COM CLAUDE
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
                max_tokens: 3000,
                temperature: 0.1,
                messages,
                system: 'Você é um assistente especializado da CVC Itaqua. Siga EXATAMENTE o template fornecido.'
            })
        });

        if (!response.ok) {
            throw new Error(`Claude erro ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
        
    } catch (error) {
        console.error('Erro ao processar com Claude:', error);
        throw error;
    }
}

// ================================================================================
// PROCESSAMENTO COM GPT
// ================================================================================

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
                        content: 'Você é um assistente especializado da CVC Itaqua. Siga EXATAMENTE o template fornecido, preenchendo todos os placeholders.' 
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI erro ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('Erro ao processar com GPT:', error);
        throw error;
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
            message: 'CVC Itaqua API v3.0 - Arquitetura Modular',
            arquivos: {
                'ai-google.js': 'Handler principal',
                'templates.js': 'Templates e constantes',
                'corrections.js': 'Pós-processamento'
            },
            produtos: Object.keys(TEMPLATES).length,
            apis: {
                openai: !!process.env.OPENAI_API_KEY,
                anthropic: !!process.env.ANTHROPIC_API_KEY
            }
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
        console.log('🚀 v3.0: Processando requisição...');
        
        // Extrair dados da requisição
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 2,
            criancas = 0,
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = req.body;

        // Combinar conteúdo
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // Validar entrada
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }

        // Detectar tipo de orçamento
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        console.log(`📋 Tipo detectado: ${tipoOrcamento}`);
        
        // Extrair destino
        const destinoFinal = extrairDestino(conteudoPrincipal, destino);
        console.log(`📍 Destino: ${destinoFinal}`);
        
        // Extrair dados completos
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        
        // Formatar passageiros
        let passageiros = dadosExtraidos.passageiros;
        if (!passageiros) {
            const numAdultos = parseInt(adultos) || 2;
            const numCriancas = parseInt(criancas) || 0;
            passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
            if (numCriancas > 0) {
                passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
            }
        }
        console.log(`👥 Passageiros: ${passageiros}`);
        
        // Gerar prompt
        const prompt = gerarPrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, passageiros);
        
        // Decidir qual IA usar
        let resultado;
        const usarClaude = imagemBase64 || 
                          conteudoPrincipal.length > 3000 || 
                          tipoOrcamento === 'MULTITRECHO' || 
                          tipoOrcamento === 'CRUZEIRO';
        
        try {
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 Usando Claude...');
                resultado = await processarComClaude(prompt, imagemBase64);
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ Usando GPT-4...');
                resultado = await processarComGPT(prompt);
                
            } else {
                throw new Error('Nenhuma API de IA configurada');
            }
            
        } catch (iaError) {
            console.error('❌ Erro ao processar com IA:', iaError);
            
            // Fallback básico
            return res.status(200).json({
                success: false,
                error: 'Erro ao processar com IA',
                details: iaError.message,
                result: 'Erro ao processar. Verifique as configurações da API.'
            });
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // APLICAR PÓS-PROCESSAMENTO
        console.log('🔧 Aplicando pós-processamento...');
        resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        
        console.log('✅ v3.0: Processamento completo');
        
        // Retornar resposta
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                destino: destinoFinal,
                passageiros: passageiros,
                ia_usada: usarClaude ? 'claude' : 'gpt',
                pos_processado: true,
                opcoes_detectadas: dadosExtraidos.opcoes.length
            }
        });

    } catch (error) {
        console.error('❌ v3.0: Erro geral:', error);
        
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar orçamento',
            details: error.message,
            result: 'Erro ao processar. Por favor, tente novamente.'
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v3.0 - ARQUITETURA MODULAR             ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Sistema dividido em 3 arquivos                              ║');
console.log('║ ✅ Templates isolados (templates.js)                           ║');
console.log('║ ✅ Correções isoladas (corrections.js)                         ║');
console.log('║ ✅ Handler limpo (ai-google.js)                                ║');
console.log('║ ✅ 11 produtos completos                                       ║');
console.log('║ ✅ Pós-processamento robusto                                   ║');
console.log('║ ✅ Suporte Claude e GPT-4                                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('📅 Data:', new Date().toISOString());
console.log('🚀 Sistema v3.0 pronto!');
