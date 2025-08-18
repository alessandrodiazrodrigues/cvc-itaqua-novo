// api/ai-google.js - CVC ITAQUA v3.1
// ARQUIVO 3: HANDLER PRINCIPAL
// ================================================================================

import { CONFIG, TEMPLATES, AEROPORTOS } from './templates.js';
import { posProcessar, extrairDadosCompletos } from './corrections.js';

// ================================================================================
// DETECÇÃO DE TIPO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Verificar se tem conexão detalhada
        const temConexaoDetalhada = 
            conteudoLower.includes('tempo de conexão') ||
            conteudoLower.includes('escala em') ||
            /\d+h\d+min/.test(conteudoLower);
        
        if (temConexaoDetalhada) {
            return 'AEREO_CONEXAO_DETALHADA';
        }
        
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT
// ================================================================================

function gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento) {
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    
    return `
Formate este orçamento de viagem para WhatsApp.

TEMPLATE A SEGUIR:
${template}

DADOS:
${conteudoPrincipal}

REGRAS IMPORTANTES:
1. Datas: formato DD/MM (não "11 de julho")
2. Aeroportos: nomes completos (Guarulhos, não GRU)
3. Passageiros: ${passageiros}
4. Se tiver múltiplas opções, numere: OPÇÃO 1, OPÇÃO 2, OPÇÃO 3
5. Use os emojis: 💰 ✈️ 💳 ✅ 🏷️ 🔗 💺
6. Links: formato direto, não use markdown
7. Termine com: Valores sujeitos a confirmação e disponibilidade (v3.1)`;
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
    
    try {
        // OPTIONS
        if (req.method === 'OPTIONS') {
            return res.status(200).json({ success: true });
        }
        
        // GET - Status
        if (req.method === 'GET') {
            return res.status(200).json({
                success: true,
                status: 'operational',
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                message: 'CVC Itaqua API v3.1 - Sistema Modular'
            });
        }
        
        // Validar POST
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Método não permitido - use POST'
            });
        }
        
        console.log('🚀 v3.1: Processando requisição...');
        
        // Extrair dados
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
        
        // Extrair dados e formatar passageiros
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        let passageiros = dadosExtraidos.passageiros;
        
        if (!passageiros) {
            const numAdultos = parseInt(adultos) || 2;
            const numCriancas = parseInt(criancas) || 0;
            passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
            if (numCriancas > 0) {
                passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
            }
        }
        
        console.log(`📋 Passageiros: ${passageiros}`);
        console.log(`💳 Parcelamento: ${parcelamento || 'não selecionado'}`);
        
        // Detectar tipo
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        console.log(`📄 Tipo: ${tipoOrcamento}`);
        
        // Gerar prompt
        const prompt = gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento);
        
        // Processar com IA
        let resultado = '';
        
        try {
            if (imagemBase64 && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 Usando Claude para imagem...');
                
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
                        messages: [{
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: imagemBase64.split(';')[0].split(':')[1],
                                        data: imagemBase64.split(',')[1]
                                    }
                                }
                            ]
                        }]
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Claude erro ${response.status}`);
                }
                
                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ Usando GPT-4...');
                
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
                                content: 'Você é um assistente da CVC. Formate orçamentos de viagem para WhatsApp seguindo EXATAMENTE o template fornecido.' 
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
                resultado = data.choices[0].message.content;
                
            } else {
                throw new Error('Nenhuma API de IA configurada');
            }
            
        } catch (iaError) {
            console.error('❌ Erro IA:', iaError);
            throw iaError;
        }
        
        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // APLICAR PÓS-PROCESSAMENTO
        console.log('🔧 Aplicando pós-processamento...');
        resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        
        console.log('✅ v3.1: Processamento completo');
        
        // Retornar resposta
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                parcelamento: parcelamento || 'não selecionado',
                ia_usada: imagemBase64 ? 'claude' : 'gpt'
            }
        });
        
    } catch (error) {
        console.error('❌ v3.1: Erro geral:', error);
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro ao processar',
            result: 'Erro ao processar. Por favor, tente novamente.'
        });
    }
}

// ================================================================================
// LOGS
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v3.1 - SISTEMA MODULAR                 ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ 3 arquivos separados para fácil manutenção                  ║');
console.log('║ ✅ Parcelamento respeitando seleção do usuário                 ║');
console.log('║ ✅ Bagagem e assento corrigidos                                ║');
console.log('║ ✅ Passageiros detectados corretamente                         ║');
console.log('║ ✅ Pós-processamento robusto                                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v3.1 pronto!');
