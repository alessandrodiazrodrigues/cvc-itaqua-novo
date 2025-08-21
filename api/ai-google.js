// api/ai-google.js - CVC ITAQUA v3.19 SOLUÇÃO COMPLETA
// TODAS AS DIVERGÊNCIAS CORRIGIDAS
// ================================================================================

import { CONFIG, TEMPLATES, AEROPORTOS, REGRAS_BAGAGEM } from './templates.js';
import { posProcessar, extrairDadosCompletos } from './corrections.js';

// ================================================================================
// BUSCA ONLINE DE AEROPORTOS
// ================================================================================

async function buscarAeroportoOnline(codigo) {
    try {
        if (!process.env.OPENAI_API_KEY) return codigo;
        console.log(`🔍 Buscando aeroporto: ${codigo}`);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ 
                    role: 'user', 
                    content: `Qual é o nome da cidade do aeroporto ${codigo}? Responda APENAS o nome da cidade, exemplo: "Bogotá" ou "Salvador". Se não souber, responda "${codigo}".` 
                }],
                temperature: 0,
                max_tokens: 15
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const resultado = data.choices[0].message.content.trim();
            console.log(`✅ ${codigo} → ${resultado}`);
            return resultado;
        }
        return codigo;
    } catch (error) {
        console.error(`❌ Erro busca ${codigo}:`, error);
        return codigo;
    }
}

// ================================================================================
// DETECÇÃO MELHORADA DE TIPO DE ORÇAMENTO v3.19
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // 1. TIPOS SELECIONADOS PELO USUÁRIO
        if (tipos && tipos.includes('Dicas')) {
            return 'DICAS';
        }
        
        if (tipos && tipos.includes('Ranking')) {
            return 'RANKING_HOTEIS';
        }
        
        if (tipos && tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
            return 'HOTEIS_MULTIPLAS';
        }
        
        if (tipos && tipos.includes('Cruzeiro')) {
            return 'CRUZEIRO';
        }
        
        // 2. DETECÇÃO AUTOMÁTICA POR CONTEÚDO
        if (conteudoLower.includes('gere dicas') || conteudoLower.includes('dicas para')) {
            return 'DICAS';
        }
        
        if (conteudoLower.includes('ranking de hotéis') || conteudoLower.includes('gere ranking')) {
            return 'RANKING_HOTEIS';
        }
        
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
            return 'CRUZEIRO';
        }
        
        // 3. DETECÇÃO ESPECÍFICA DE HOTEL (SEM VOO)
        const temHotel = conteudoLower.includes('hotel') || 
                        conteudoLower.includes('pousada') || 
                        conteudoLower.includes('resort') ||
                        conteudoLower.includes('comfort suites') ||
                        conteudoLower.includes('preferencial');
        
        const temVoo = conteudoLower.includes('aeroporto') || 
                      conteudoLower.includes('voo') || 
                      conteudoLower.includes('airlines') ||
                      conteudoLower.includes('gru') ||
                      conteudoLower.includes('mco');
        
        if (temHotel && !temVoo) {
            return 'HOTEIS_MULTIPLAS';
        }
        
        // 4. DETECÇÃO DE MÚLTIPLAS OPÇÕES/COMPANHIAS v3.19
        const companhias = (conteudoPrincipal.match(/(?:Copa|Latam|Avianca|Gol|Azul|Tap|Iberia)/gi) || []);
        const companhiasUnicas = [...new Set(companhias.map(c => c.toLowerCase()))];
        
        console.log(`🔍 Companhias detectadas: ${companhiasUnicas.join(', ')}`);
        
        if (companhiasUnicas.length >= 3) {
            return 'MULTIPLAS_OPCOES_3';
        } else if (companhiasUnicas.length >= 2) {
            return 'MULTIPLAS_COMPANHIAS';
        }
        
        // 5. OUTROS TIPOS
        if (tipos && tipos.includes('Multitrechos') ||
            conteudoLower.includes('multitrecho') ||
            conteudoLower.includes('multi-trecho') ||
            (conteudoLower.match(/trecho \d+/g) && conteudoLower.match(/trecho \d+/g).length >= 2)) {
            return 'MULTITRECHO';
        }
        
        if (conteudoLower.includes('somente ida') ||
            conteudoLower.includes('apenas ida') ||
            conteudoLower.includes('one way')) {
            return 'AEREO_SOMENTE_IDA';
        }
        
        if (conteudoLower.includes('pacote') && 
            (conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem'))) {
            return 'PACOTE_COMPLETO';
        }
        
        // 6. PADRÃO: AÉREO SIMPLES
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT ESPECÍFICA v3.19
// ================================================================================

function gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento, destino, ehImagem = false) {
    // DICAS ESPECÍFICAS
    if (tipoOrcamento === 'DICAS') {
        return `
Gere dicas de viagem ESPECÍFICAS para ${destino || 'Orlando'}.

Use EXATAMENTE este formato:

━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA ${(destino || 'ORLANDO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
[Descrição específica e atrativa do destino]

🎯 *PRINCIPAIS PASSEIOS:*
1. [Passeio específico 1]
2. [Passeio específico 2] 
3. [Passeio específico 3]
4. [Passeio específico 4]
5. [Passeio específico 5]

🌡️ *CLIMA:*
• Temperatura: XX°C a XX°C
• [Condição do clima atual]
• Leve: [roupas específicas recomendadas]

🍽️ *GASTRONOMIA:*
• Pratos típicos: [pratos locais]
• Preço médio refeição: R$ XX
• Dica: [restaurante ou região específica]

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ XX
• Táxi do aeroporto: R$ XX
• Entrada museus: R$ XX

📱 *DICAS PRÁTICAS:*
• [Moeda e câmbio específicos]
• [Idioma local]
• [Gorjetas locais]
• [Segurança específica]

🚨 *IMPORTANTE:*
[Avisos específicos do destino]

Seja ESPECÍFICO para ${destino || 'Orlando'}, não genérico.`;
    }
    
    // RANKING DE HOTÉIS
    if (tipoOrcamento === 'RANKING_HOTEIS') {
        return `
Gere um ranking ESPECÍFICO de hotéis para ${destino || 'Orlando'}.

Use EXATAMENTE este formato:

🏆 *RANKING DE HOTÉIS - ${(destino || 'ORLANDO').toUpperCase()}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - [Nome Hotel Luxo Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

🥈 *2º - [Nome Hotel Luxo Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐ *CATEGORIA SUPERIOR*

🥇 *1º - [Nome Hotel Superior Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

🥈 *2º - [Nome Hotel Superior Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

━━━━━━━━━━━━━━━━━━

⭐⭐⭐ *CATEGORIA ECONÔMICA*

🥇 *1º - [Nome Hotel Econômico Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

🥈 *2º - [Nome Hotel Econômico Real]*
📍 [Localização específica]
💰 Diária média: R$ [valor real]
✨ [Diferencial específico]

━━━━━━━━━━━━━━━━━━

📌 *DICA:* [Dica específica sobre escolha de hotel em ${destino || 'Orlando'}]

Use hotéis REAIS de ${destino || 'Orlando'}, não genéricos.`;
    }
    
    // HOTÉIS (SEM VOO)
    if (tipoOrcamento === 'HOTEIS_MULTIPLAS') {
        const template = TEMPLATES.HOTEIS_MULTIPLAS;
        return `
Formate este orçamento de HOTEL para WhatsApp seguindo o template específico.

⚠️ ESTE É UM ORÇAMENTO DE HOTEL - NÃO ADICIONE VOOS!

CONTEÚDO:
${conteudoPrincipal}

PASSAGEIROS: ${passageiros}

TEMPLATE HOTEL:
${template}

REGRAS ESPECÍFICAS:
- NÃO adicionar voos ou aeroportos
- Usar formato de hotel: *Hotéis em {destino}*
- Período: {data_entrada} a {data_saida}
- Formato: **OPÇÃO X** - {nome_hotel}
- 📍 {localização}
- 🛏️ {tipo_quarto}
- ☕ {regime alimentar}
- 💰 R$ {valor} total
- Termine com: Valores sujeitos a confirmação e disponibilidade (v3.19)`;
    }
    
    // PARA IMAGENS
    if (ehImagem) {
        return `
Extraia e formate este orçamento de viagem da imagem para WhatsApp.

⚠️ REGRAS CRÍTICAS v3.19:
1. Use APENAS informações visíveis na imagem
2. NÃO invente horários, cidades ou detalhes
3. Mantenha exatamente os horários mostrados
4. Se mostra "Uma escala" sem cidade, use "(com conexão)"
5. Se mostra cidade de conexão, especifique
6. REMOVER dias da semana (ter, qua, qui, etc.)
7. NÃO adicione (+1) automaticamente - apenas se mostrar na imagem

FORMATO:
*{Companhia} - {Origem} ✈ {Destino}*
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
✅ {bagagem se especificada}
🏷️ {reembolso}

REGRAS:
- Datas: DD/MM (27/01, NÃO "ter, 27/01")
- Use nomes completos de aeroportos (Guarulhos, não GRU)
- Termine com: Valores sujeitos a confirmação e disponibilidade (v3.19)`;
    }
    
    // TEMPLATE PADRÃO
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    
    return `
Formate este orçamento de viagem para WhatsApp seguindo EXATAMENTE o template.

⚠️ INSTRUÇÕES CRÍTICAS v3.19:

1. Use SOMENTE as informações fornecidas no texto
2. NÃO INVENTE horários, cidades ou detalhes
3. REMOVER dias da semana (ter, qua, qui, sex, sáb, dom)
4. Para múltiplas companhias, detectar automaticamente
5. Mantenha passageiros exatos (adultos, bebês, crianças)
6. Extraia parcelamento com entrada se presente
7. Detecte "Com bagagem" e "pré-reserva de assento"

TEXTO ORIGINAL:
${conteudoPrincipal}

PASSAGEIROS: ${passageiros}

TEMPLATE A SEGUIR:
${template}

REGRAS ESPECÍFICAS v3.19:
- Datas: DD/MM (27/01, NÃO "ter, 27 de janeiro")
- Aeroportos: nomes completos (Guarulhos, não GRU)
- "Uma escala" → "(com conexão)"
- "Duas escalas" → "(com múltiplas conexões)"
- "Voo direto" → "(voo direto)"
- Links: manter formato 🔗 https://...
- Passageiros: formato "XX adultos + XX crianças + XX bebês"
- (+1) APENAS para volta Orlando chegada ≤ 08h
- Bagagem: detectar "Com bagagem" = despachada incluída
- Assento: detectar "pré-reserva" = incluir linha 💺
- Reembolso: "Reembolsável" ou "Não reembolsável"

⚠️ CRÍTICO: NÃO INVENTE INFORMAÇÕES - USE APENAS O TEXTO!`;
}

// ================================================================================
// HANDLER PRINCIPAL v3.19
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
                message: 'CVC Itaqua API v3.19 - Solução Completa'
            });
        }
        
        // Validar POST
        if (req.method !== 'POST') {
            return res.status(200).json({
                success: false,
                error: 'Método não permitido - use POST',
                result: 'Método não permitido'
            });
        }
        
        console.log('🚀 v3.19: Processando requisição...');
        
        // Extrair dados com validação robusta
        const body = req.body || {};
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
            const numAdultos = parseInt(adultos) || 1;
            const numCriancas = parseInt(criancas) || 0;
            passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
            if (numCriancas > 0) {
                passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
            }
        }
        
        console.log(`📋 Passageiros: ${passageiros}`);
        console.log(`💳 Parcelamento selecionado: ${parcelamento || 'nenhum'}`);
        console.log(`🎯 Tipos selecionados: ${tipos.join(', ') || 'nenhum'}`);
        
        // Detectar tipo
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        console.log(`📄 Tipo detectado: ${tipoOrcamento}`);
        
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
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || 
                              conteudoPrincipal.length > 3000 ||
                              tipoOrcamento === 'PACOTE_COMPLETO' ||
                              tipoOrcamento === 'MULTITRECHO' ||
                              tipoOrcamento === 'DICAS' ||
                              tipoOrcamento === 'RANKING_HOTEIS' ||
                              tipoOrcamento === 'HOTEIS_MULTIPLAS';
            
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
                                content: 'Você é um assistente da CVC. Formate orçamentos seguindo EXATAMENTE as instruções. NÃO INVENTE informações que não estejam no texto fornecido. Para hotéis, use formato de hotel. Para dicas e rankings, seja específico para o destino.' 
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
                throw new Error('Nenhuma API de IA configurada');
            }
            
        } catch (iaError) {
            console.error('❌ Erro IA:', iaError);
            resultado = `Erro ao processar com IA: ${iaError.message}. Verifique as configurações de API.`;
            iaUsada = 'error';
        }
        
        // Processar resultado
        if (resultado && typeof resultado === 'string' && !resultado.includes('Erro')) {
            // Remover formatação markdown se houver
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            
            // Buscar aeroportos online se necessário
            console.log('🔄 Convertendo aeroportos...');
            
            // Primeiro, conversões locais
            Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
                const regex = new RegExp(`\\b${codigo}\\b`, 'g');
                resultado = resultado.replace(regex, nome);
            });
            
            // Buscar aeroportos não encontrados online
            const codigosNaoEncontrados = resultado.match(/\b[A-Z]{3}\b/g);
            if (codigosNaoEncontrados && process.env.OPENAI_API_KEY) {
                console.log('🔍 Códigos para buscar online:', [...new Set(codigosNaoEncontrados)]);
                
                for (const codigo of [...new Set(codigosNaoEncontrados)]) {
                    if (!AEROPORTOS[codigo]) {
                        const nomeEncontrado = await buscarAeroportoOnline(codigo);
                        if (nomeEncontrado !== codigo) {
                            const regex = new RegExp(`\\b${codigo}\\b`, 'g');
                            resultado = resultado.replace(regex, nomeEncontrado);
                        }
                    }
                }
            }
            
            // APLICAR PÓS-PROCESSAMENTO v3.19
            console.log('🔧 Aplicando pós-processamento v3.19...');
            resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        }
        
        console.log('✅ v3.19: Processamento completo');
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: true,
            result: resultado || 'Erro ao processar. Tente novamente.',
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                parcelamento_selecionado: parcelamento || 'nenhum',
                ia_usada: iaUsada
            }
        });
        
    } catch (error) {
        console.error('❌ v3.19: Erro geral:', error);
        
        // SEMPRE retornar JSON válido mesmo em erro
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro interno do servidor',
            result: 'Erro interno do servidor. Verifique os dados e tente novamente.'
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO v3.19
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v3.19 - SOLUÇÃO COMPLETA              ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Todas as divergências corrigidas                          ║');
console.log('║ ✅ Detecção inteligente de múltiplas companhias               ║');
console.log('║ ✅ Template específico para hotéis                           ║');
console.log('║ ✅ Extração correta de parcelamento                          ║');
console.log('║ ✅ Detecção precisa de bagagem e assento                     ║');
console.log('║ ✅ Remoção de dias da semana                                 ║');
console.log('║ ✅ (+1) apenas para volta Orlando                            ║');
console.log('║ ✅ Dicas específicas por destino                             ║');
console.log('║ ✅ JSON sempre válido                                        ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v3.19 - TODAS AS DIVERGÊNCIAS CORRIGIDAS!');
