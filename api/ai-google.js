// api/ai-google.js - CVC ITAQUA v3.1 CORRIGIDO
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
            return 'RANKING_HOTEIS';
        }
        
        if (conteudoLower.includes('gere ranking') || 
            conteudoLower.includes('ranking de hotéis')) {
            return 'RANKING_HOTEIS';
        }
        
        // Verificar se é cruzeiro
        if (tipos && tipos.includes('Cruzeiro') || 
            conteudoLower.includes('cruzeiro') ||
            conteudoLower.includes('navio')) {
            return 'CRUZEIRO';
        }
        
        // Verificar se é pacote completo
        if (conteudoLower.includes('pacote') && 
            (conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem'))) {
            return 'PACOTE_COMPLETO';
        }
        
        // Verificar se é multitrecho
        if (tipos && tipos.includes('Multitrechos') ||
            conteudoLower.includes('multitrecho') ||
            conteudoLower.includes('multi-trecho') ||
            conteudoLower.includes('trecho 1') ||
            conteudoLower.includes('trecho 2')) {
            return 'MULTITRECHO';
        }
        
        // Verificar se é somente ida
        if (conteudoLower.includes('somente ida') ||
            conteudoLower.includes('apenas ida') ||
            conteudoLower.includes('one way')) {
            return 'AEREO_SOMENTE_IDA';
        }
        
        // Verificar se tem múltiplas opções/companhias
        if (conteudoLower.includes('opção 1') ||
            conteudoLower.includes('opção 2') ||
            conteudoLower.includes('plano 1') ||
            conteudoLower.includes('plano 2')) {
            
            // Contar quantas opções tem
            const opcoes = conteudoLower.match(/opção \d+|plano \d+/g);
            if (opcoes && opcoes.length >= 3) {
                return 'MULTIPLAS_OPCOES_3';
            } else if (opcoes && opcoes.length >= 2) {
                return 'MULTIPLAS_OPCOES_2';
            }
        }
        
        // Verificar se tem múltiplas companhias diferentes
        const companhias = ['latam', 'gol', 'azul', 'tap', 'iberia', 'lufthansa', 'air france'];
        let companhiasEncontradas = 0;
        for (const cia of companhias) {
            if (conteudoLower.includes(cia)) {
                companhiasEncontradas++;
            }
        }
        if (companhiasEncontradas >= 2) {
            return 'MULTIPLAS_COMPANHIAS';
        }
        
        // Verificar se tem conexão detalhada
        const temConexaoDetalhada = 
            conteudoLower.includes('tempo de conexão') ||
            conteudoLower.includes('escala em') ||
            conteudoLower.includes('conexão em') ||
            /\d+h\s*\d+min/.test(conteudoLower);
        
        if (temConexaoDetalhada) {
            return 'AEREO_CONEXAO_DETALHADA';
        }
        
        // Verificar se é apenas hotel
        if (tipos && tipos.includes('Hotel') && 
            !tipos.includes('Aéreo')) {
            return 'HOTEIS_MULTIPLAS';
        }
        
        // Padrão
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT CORRIGIDO
// ================================================================================

function gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento, destino, ehImagem = false) {
    // Se for dicas, usar prompt específico
    if (tipoOrcamento === 'DICAS') {
        return `
Gere APENAS dicas de viagem para ${destino || 'o destino'}.

NÃO INCLUA ORÇAMENTO DE PASSAGEM. APENAS DICAS.

Use exatamente este formato:

━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA ${(destino || 'DESTINO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
[Descrição breve e atrativa do destino]

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
[Avisos específicos do destino]`;
    }
    
    // Se for ranking, usar prompt específico
    if (tipoOrcamento === 'RANKING_HOTEIS') {
        return `
Gere um ranking de hotéis para ${destino || 'o destino'}.

Use exatamente este formato:

🏆 *RANKING DE HOTÉIS - ${(destino || 'DESTINO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - [Nome Hotel Luxo 1]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

🥈 *2º - [Nome Hotel Luxo 2]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐ *CATEGORIA SUPERIOR*

🥇 *1º - [Nome Hotel Superior 1]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

🥈 *2º - [Nome Hotel Superior 2]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐ *CATEGORIA ECONÔMICA*

🥇 *1º - [Nome Hotel Econômico 1]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

🥈 *2º - [Nome Hotel Econômico 2]*
📍 [Localização]
💰 Diária média: R$ [valor]
✨ [Diferencial principal]

━━━━━━━━━━━━━━━━━━

📌 *DICA:* [Dica sobre escolha de hotel]`;
    }
    
    // Se for imagem, prompt específico para OCR
    if (ehImagem) {
        return `
Extraia e formate este orçamento de viagem da imagem para WhatsApp.

⚠️ REGRAS CRÍTICAS - NÃO INVENTE INFORMAÇÕES:
1. Use APENAS as informações visíveis na imagem
2. Se não houver detalhes de conexão, use apenas "(com conexão)" ou "(voo direto)"
3. NÃO adicione horários de conexão se não estiverem na imagem
4. NÃO adicione links se não estiverem visíveis
5. NÃO invente cidades de conexão
6. Use exatamente os horários mostrados

FORMATO ESPERADO:
*{Companhia} - {Origem} ✈ {Destino}*
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
💳 {parcelamento se houver}
✅ {bagagem}
🏷️ {reembolso}

REGRAS:
- Datas: DD/MM
- Horários: HH:MM (24h)
        - Termine com: Valores sujeitos a confirmação e disponibilidade (v3.11)`;
    }
    
    // Para orçamentos normais - PROMPT RESTRITIVO v3.11
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    
    return `
⚠️ INSTRUÇÕES CRÍTICAS v3.11 - SIGA EXATAMENTE:

1. Use SOMENTE as informações do texto fornecido
2. NÃO INVENTE conexões, horários ou cidades
3. NÃO ADICIONE links se não estiverem no texto
4. FORMATO OBRIGATÓRIO para voos:
   Data - Aeroporto Origem Hora / Aeroporto Destino Hora (tipo)
5. Se tem "Uma escala" → usar "(com conexão)"
6. SEMPRE incluir aeroporto de destino na linha
7. Separador "--" APENAS entre ida e volta
8. SEMPRE incluir linha de reembolso 🏷️

TEXTO ORIGINAL A FORMATAR:
${conteudoPrincipal}

PASSAGEIROS: ${passageiros}

FORMATO EXATO OBRIGATÓRIO:
*{Companhia} - {Origem} ✈ {Destino}*
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v3.11)

EXEMPLO CORRETO DO SEU TEXTO:
- "11:10 GRU Uma escala 22:40 MCO" → "Guarulhos 11:10 / Orlando 22:40 (com conexão)"
- "13:40 MCO Uma escala 03:50 GRU" → "Orlando 13:40 / Guarulhos 03:50 (com conexão)"
- "Não reembolsável" → "🏷️ Não reembolsável"

REGRAS CRÍTICAS:
1. Datas: DD/MM (27/01)
2. Aeroportos: nomes completos (Guarulhos, Orlando)
3. SEMPRE ambos aeroportos na linha: origem / destino
4. Separador "--" só entre ida e volta
5. SEMPRE linha 🏷️ com reembolso
6. Termine com: (v3.11)

⚠️ NÃO INVENTE NADA - USE APENAS O TEXTO FORNECIDO!`;
}

// ================================================================================
// HANDLER PRINCIPAL (MANTIDO IGUAL)
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
                message: 'CVC Itaqua API v3.11 - Formato Corrigido'
            });
        }
        
        // Validar POST
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Método não permitido - use POST',
                result: 'Método não permitido'
            });
        }
        
        console.log('🚀 v3.1: Processando requisição...');
        
        // Extrair dados com validação robusta
        const body = req.body || {};
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 1,  // Padrão agora é 1 adulto
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
            return res.status(200).json({
                success: false,
                error: 'Adicione informações sobre a viagem',
                result: 'Por favor, adicione informações sobre a viagem'
            });
        }
        
        // Extrair dados e formatar passageiros
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        let passageiros = dadosExtraidos.passageiros;
        
        if (!passageiros) {
            // Só usar valores do formulário se não encontrou no conteúdo
            const numAdultos = parseInt(adultos) || 1;  // Padrão 1 adulto
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
        
        // Gerar prompt CORRIGIDO
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
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || 
                              conteudoPrincipal.length > 3000 ||
                              tipoOrcamento === 'PACOTE_COMPLETO' ||
                              tipoOrcamento === 'MULTITRECHO';
            
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 Usando Claude...');
                
                const requestBody = {
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 3000,
                    temperature: 0.1,
                    messages: [{
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
                    }]
                };
                
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': process.env.ANTHROPIC_API_KEY,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Claude erro:', errorText);
                    throw new Error(`Claude erro ${response.status}`);
                }
                
                const data = await response.json();
                resultado = data.content[0].text;
                iaUsada = 'claude';
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ Usando GPT-4o-mini...');
                
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
                                content: 'Você é um assistente da CVC. Formate orçamentos seguindo EXATAMENTE as instruções. NÃO INVENTE informações que não estejam no texto fornecido.' 
                            },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.1,
                        max_tokens: 3000
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('OpenAI erro:', errorText);
                    throw new Error(`OpenAI erro ${response.status}`);
                }
                
                const data = await response.json();
                resultado = data.choices[0].message.content;
                iaUsada = 'gpt';
                
            } else {
                // FALLBACK se não tem API configurada
                console.warn('⚠️ Nenhuma API de IA configurada');
                resultado = `Erro: Nenhuma API de IA configurada. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY nas variáveis de ambiente.`;
                iaUsada = 'none';
            }
            
        } catch (iaError) {
            console.error('❌ Erro IA:', iaError);
            
            // FALLBACK robusto se IA falhar
            resultado = `Erro ao processar com IA: ${iaError.message}. Verifique as configurações de API.`;
            iaUsada = 'error';
        }
        
        // Limpar e processar resultado
        if (resultado && typeof resultado === 'string' && !resultado.includes('Erro')) {
            // Remover formatação markdown se houver
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            
            // APLICAR PÓS-PROCESSAMENTO
            console.log('🔧 Aplicando pós-processamento...');
            resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        }
        
        console.log('✅ v3.1: Processamento completo');
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: true,
            result: resultado || 'Erro ao processar. Tente novamente.',
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                parcelamento: parcelamento || 'não selecionado',
                ia_usada: iaUsada
            }
        });
        
    } catch (error) {
        console.error('❌ v3.1: Erro geral:', error);
        
        // SEMPRE retornar JSON válido mesmo em erro
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro interno do servidor',
            result: 'Erro interno do servidor. Verifique os dados e tente novamente.'
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v3.11 - FORMATO CORRIGIDO             ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Formato de voo corrigido (origem / destino)                ║');
console.log('║ ✅ Separador "--" apenas entre ida e volta                    ║');
console.log('║ ✅ Linha de reembolso obrigatória                             ║');
console.log('║ ✅ Prompt ultra-específico para formato                       ║');
console.log('║ ✅ Validação rigorosa de estrutura                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v3.11 com formato perfeito!');
