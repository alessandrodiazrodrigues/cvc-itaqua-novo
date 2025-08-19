// api/ai-google.js - CVC ITAQUA v3.1 CORRIGIDO
// ARQUIVO PRINCIPAL COM EDGE RUNTIME
// ================================================================================

export const config = {
    runtime: 'edge',
};

// ================================================================================
// IMPORTS CORRIGIDOS PARA EDGE
// ================================================================================

import { CONFIG, TEMPLATES, AEROPORTOS } from './templates.js';
import { posProcessar, extrairDadosCompletos } from './corrections.js';

// ================================================================================
// DETECÇÃO DE TIPO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Verificar se é dicas
        if (tipos && tipos.includes('Dicas')) {
            return 'DICAS';
        }
        
        if (conteudoLower.includes('gere dicas') || 
            conteudoLower.includes('dicas para') ||
            conteudoLower.includes('consulte o manual e gere dicas')) {
            return 'DICAS';
        }
        
        // Verificar se é ranking
        if (tipos && tipos.includes('Ranking')) {
            return 'RANKING';
        }
        
        if (conteudoLower.includes('gere ranking') || 
            conteudoLower.includes('ranking de')) {
            return 'RANKING';
        }
        
        // Verificar se tem conexão detalhada
        const temConexaoDetalhada = 
            conteudoLower.includes('tempo de conexão') ||
            conteudoLower.includes('escala em') ||
            /\d+h\d+min/.test(conteudoLower);
        
        if (temConexaoDetalhada) {
            return 'AEREO_CONEXAO_DETALHADA';
        }
        
        // Verificar múltiplas opções
        if (conteudoLower.includes('opção 1') || conteudoLower.includes('opção 2')) {
            return 'MULTIPLAS_OPCOES';
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

function gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento, destino, ehImagem = false) {
    // Se for dicas, usar prompt específico
    if (tipoOrcamento === 'DICAS') {
        return `
Gere APENAS dicas de viagem para ${destino || 'o destino'}.

NÃO INCLUA ORÇAMENTO DE PASSAGEM. APENAS DICAS.

Formato das dicas:
━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA ${(destino || 'DESTINO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
[Descrição breve]

🎯 *PRINCIPAIS PASSEIOS:*
1. [Passeio 1]
2. [Passeio 2]
3. [Passeio 3]
4. [Passeio 4]
5. [Passeio 5]

🌡️ *CLIMA:*
• Temperatura: XX°C a XX°C
• [Condição do clima]
• Leve: [roupas recomendadas]

🍽️ *GASTRONOMIA:*
• Pratos típicos: [pratos]
• Preço médio refeição: R$ XX
• Dica: [restaurante ou região]

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ XX
• Táxi do aeroporto: R$ XX
• Entrada museus: R$ XX

📱 *DICAS PRÁTICAS:*
• [Moeda e câmbio]
• [Idioma]
• [Gorjetas]
• [Segurança]

🚨 *IMPORTANTE:*
[Avisos específicos]`;
    }
    
    // Se for ranking
    if (tipoOrcamento === 'RANKING') {
        return `
Gere um ranking de hotéis para ${destino || 'o destino'}.

Formato:
━━━━━━━━━━━━━━━━━━
🏆 *RANKING DE HOTÉIS - ${(destino || 'DESTINO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

⭐ *CATEGORIA LUXO (5 estrelas)*

🥇 *1. [Nome do Hotel]*
📍 Localização: [Bairro/Região]
💰 Diária média: R$ [valor]
✨ Destaques: [principais amenidades]

🥈 *2. [Nome do Hotel]*
[mesma estrutura]

🥉 *3. [Nome do Hotel]*
[mesma estrutura]

⭐ *CATEGORIA SUPERIOR (4 estrelas)*
[3 hotéis com mesma estrutura]

⭐ *CATEGORIA ECONÔMICA (3 estrelas)*
[3 hotéis com mesma estrutura]`;
    }
    
    // Se for imagem, prompt específico para OCR
    if (ehImagem) {
        return `
Extraia e formate este orçamento de viagem da imagem para WhatsApp.

FORMATO ESPERADO:
*{Companhia} - {Origem} ✈ {Destino}*
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
💳 {parcelamento se houver}
✅ {bagagem no formato: Inclui 1 item pessoal + 1 mala de mão de 10kg}
💺 {assento se houver}
🏷️ {reembolso}
🔗 {link específico se houver}

REGRAS:
- Datas: DD/MM
- Horários: HH:MM
- Adicione (+1) se chegar no dia seguinte
- Use "com conexão em {cidade}" não "escala"
- Se tem 4 trechos (ida com conexão + volta com conexão), mostre todos
- Passageiros: formato "XX adultos" ou "XX adultos + XX crianças"`;
    }
    
    // Para orçamentos normais
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
// HANDLER PRINCIPAL COM EDGE RUNTIME
// ================================================================================

export default async function handler(req) {
    console.log('🚀 v3.1 EDGE: Iniciando processamento...');
    
    try {
        // Processar diferentes métodos
        if (req.method === 'OPTIONS') {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        
        if (req.method === 'GET') {
            return new Response(JSON.stringify({
                success: true,
                status: 'operational',
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                message: 'CVC Itaqua API v3.1 EDGE - Sistema Modular'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Método não permitido - use POST'
            }), {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        // Processar body da requisição
        let body = {};
        try {
            const text = await req.text();
            if (text) {
                body = JSON.parse(text);
            }
        } catch (e) {
            console.error('Erro ao parsear body:', e);
            body = {};
        }
        
        console.log('📋 Body recebido:', body);
        
        // Extrair dados com validação robusta
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
        } = body;
        
        // Combinar conteúdo
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // Validar entrada
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Adicione informações sobre a viagem',
                result: 'Por favor, adicione informações sobre a viagem'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        
        // Extrair dados e formatar passageiros
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        let passageiros = dadosExtraidos.passageiros;
        
        if (!passageiros) {
            const numAdultos = parseInt(adultos) || 1;
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
        const prompt = gerarPrompt(
            conteudoPrincipal, 
            passageiros, 
            tipoOrcamento, 
            dadosExtraidos.destino || destino,
            !!imagemBase64
        );
        
        // Processar com IA
        let resultado = '';
        let iaUsada = 'none';
        
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
                    const errorText = await response.text();
                    throw new Error(`Claude erro ${response.status}: ${errorText}`);
                }
                
                const data = await response.json();
                resultado = data.content[0].text;
                iaUsada = 'claude';
                
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
                    const errorText = await response.text();
                    throw new Error(`OpenAI erro ${response.status}: ${errorText}`);
                }
                
                const data = await response.json();
                resultado = data.choices[0].message.content;
                iaUsada = 'gpt';
                
            } else {
                console.warn('⚠️ Nenhuma API de IA configurada');
                resultado = `Configure as variáveis de ambiente OPENAI_API_KEY ou ANTHROPIC_API_KEY no Vercel.`;
                iaUsada = 'none';
            }
            
        } catch (iaError) {
            console.error('❌ Erro IA:', iaError);
            resultado = `Erro ao processar com IA: ${iaError.message}. Verifique as configurações de API.`;
            iaUsada = 'error';
        }
        
        // Limpar e aplicar pós-processamento
        if (resultado && typeof resultado === 'string') {
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            
            if (resultado && !resultado.includes('Erro') && !resultado.includes('Configure')) {
                console.log('🔧 Aplicando pós-processamento...');
                resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
            }
        }
        
        console.log('✅ v3.1 EDGE: Processamento completo');
        
        // Retornar resposta com Edge Runtime
        return new Response(JSON.stringify({
            success: true,
            result: resultado || 'Erro ao processar. Verifique as configurações.',
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                parcelamento: parcelamento || 'não selecionado',
                ia_usada: iaUsada
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
        
    } catch (error) {
        console.error('❌ v3.1 EDGE: Erro geral:', error);
        
        // Sempre retornar JSON válido
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Erro interno do servidor',
            result: 'Erro interno. Verifique os logs do Vercel.'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// ================================================================================
// LOG INICIAL
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           CVC ITAQUA v3.1 - EDGE RUNTIME CONFIGURADO          ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Edge Runtime ativado para melhor performance               ║');
console.log('║ ✅ Resposta sempre em JSON válido                             ║');
console.log('║ ✅ CORS configurado corretamente                              ║');
console.log('║ ✅ Suporte completo a imagens e textos                        ║');
console.log('║ ✅ Estrutura modular de 3 arquivos mantida                    ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v3.1 EDGE pronto!');
