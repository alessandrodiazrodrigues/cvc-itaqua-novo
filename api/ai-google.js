// api/ai-google.js - CVC ITAQUA v3.13 ESTRUTURA CORRIGIDA
// ARQUIVO 3: HANDLER PRINCIPAL
// ================================================================================

// ⚠️ IMPORTS CRÍTICOS - ESTRUTURA FIXA
const CONFIG = { VERSION: '3.13', SISTEMA: 'CVC ITAQUA' };

const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'PLU': 'Pampulha', 'SSA': 'Salvador', 
    'REC': 'Recife', 'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 
    'FLN': 'Florianópolis', 'CWB': 'Curitiba', 'MAO': 'Manaus',
    'MCO': 'Orlando', 'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma Fiumicino',
    'JFK': 'Nova York JFK', 'MIA': 'Miami', 'LAX': 'Los Angeles'
};

const REGRAS_BAGAGEM = {
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg'
};

// ================================================================================
// EXTRAÇÃO E PÓS-PROCESSAMENTO INLINE
// ================================================================================

function extrairDadosCompletos(conteudoPrincipal) {
    const dados = { passageiros: null, parcelamento: null, multiplas: false };
    
    try {
        // Detectar múltiplas opções
        dados.multiplas = conteudoPrincipal.includes('Copa airlines') && conteudoPrincipal.includes('Latam');
        
        // Extrair passageiros
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\)/i);
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 1;
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
        }
        
        // Extrair parcelamento
        const matchParcelamento = conteudoPrincipal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
        if (matchParcelamento) {
            dados.parcelamento = `Total de R$ ${matchParcelamento[1]} em até ${parseInt(matchParcelamento[2]) + 1}x, sendo a primeira de R$ ${matchParcelamento[1]}, mais ${matchParcelamento[2]}x de R$ ${matchParcelamento[3]} s/ juros no cartão`;
        }
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
}

function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        let resultado = texto;
        
        // 1. Corrigir datas
        const meses = { 'janeiro': '01', 'jan': '01', 'fevereiro': '02', 'fev': '02', 'março': '03', 'mar': '03', 'abril': '04', 'abr': '04', 'maio': '05', 'mai': '05', 'junho': '06', 'jun': '06', 'julho': '07', 'jul': '07', 'agosto': '08', 'ago': '08', 'setembro': '09', 'set': '09', 'outubro': '10', 'out': '10', 'novembro': '11', 'nov': '11', 'dezembro': '12', 'dez': '12' };
        
        resultado = resultado.replace(/(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
            const mesNum = meses[mes.toLowerCase()] || mes;
            return `${dia.padStart(2, '0')}/${mesNum}`;
        });
        
        // 2. Converter aeroportos
        Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
            const regex = new RegExp(`\\b${codigo}\\b`, 'g');
            resultado = resultado.replace(regex, nome);
        });
        
        // 3. Corrigir (+1) APENAS para chegadas madrugada
        const linhas = resultado.split('\n');
        linhas.forEach((linha, index) => {
            if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
                const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
                if (horaMatch) {
                    const horaChegada = parseInt(horaMatch[3]);
                    const ehInternacional = linha.includes('Orlando') || linha.includes('Lisboa');
                    
                    // REGRA FIXA: (+1) só para chegadas antes das 8h
                    if (ehInternacional && horaChegada <= 8) {
                        linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))/, '$1 (+1)$2');
                    }
                }
            }
        });
        resultado = linhas.join('\n');
        
        // 4. Corrigir conexões
        resultado = resultado.replace(/uma escala/gi, 'com conexão');
        resultado = resultado.replace(/\(direto\)/g, '(voo direto)');
        
        // 5. Garantir bagagem
        if (!resultado.includes('✅')) {
            resultado = resultado.replace(/(💰[^\n]+)(\n|$)/, '$1\n✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA + '\n');
        }
        
        // 6. Garantir reembolso
        if (!resultado.includes('🏷️')) {
            resultado = resultado.replace(/(✅[^\n]+)(\n|$)/, '$1\n🏷️ Não reembolsável\n');
        }
        
        // 7. Aplicar parcelamento se extraído
        const dados = extrairDadosCompletos(conteudoOriginal);
        if (dados.parcelamento) {
            resultado = resultado.replace(/(💰 R\$ [\d.,]+ para [^\n]+)(?:\n💳[^\n]*)?/g, `$1\n💳 ${dados.parcelamento}`);
        }
        
        // 8. Garantir versão única
        resultado = resultado.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
        resultado = resultado.replace(/Valores sujeitos a confirmação e disponibilidade/g, '');
        resultado = resultado.replace(/\(v[\d.]+\)/g, '');
        
        if (!resultado.includes(`(v${CONFIG.VERSION})`)) {
            resultado = resultado.trim() + `\n\nValores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
        }
        
        return resultado.trim();
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

// ================================================================================
// DETECÇÃO DE TIPO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        if (tipos && tipos.includes('Dicas')) return 'DICAS';
        if (tipos && tipos.includes('Ranking')) return 'RANKING_HOTEIS';
        if (conteudoLower.includes('cruzeiro')) return 'CRUZEIRO';
        if (conteudoLower.includes('pacote')) return 'PACOTE_COMPLETO';
        if (conteudoLower.includes('multitrecho')) return 'MULTITRECHO';
        if (conteudoLower.includes('somente ida')) return 'AEREO_SOMENTE_IDA';
        
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
    if (tipoOrcamento === 'DICAS') {
        return `Gere APENAS dicas de viagem para ${destino || 'o destino'}. Use formato estruturado com emojis.`;
    }
    
    if (tipoOrcamento === 'RANKING_HOTEIS') {
        return `Gere ranking de hotéis para ${destino || 'o destino'} por categoria (luxo, superior, econômica).`;
    }
    
    // PROMPT PRINCIPAL v3.13 - MÚLTIPLAS OPÇÕES
    return `
⚠️ INSTRUÇÕES CRÍTICAS v3.13:

MÚLTIPLAS OPÇÕES:
- Se há Copa Airlines E Latam: trate como opções separadas
- Cada opção deve ter **{Companhia} - Origem ✈ Destino**
- NÃO misture dados entre opções

FORMATO OBRIGATÓRIO:
**{Companhia} - São Paulo ✈ Orlando**
{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({tipo voo})
--
{Data} - {Aeroporto Destino} {Hora} / {Aeroporto Origem} {Hora} ({tipo voo})

💰 R$ {valor} para {passageiros}
💳 {parcelamento - APENAS se tiver para esta opção}
✅ {bagagem}
🏷️ {reembolso}

REGRAS CRÍTICAS:
1. Datas: DD/MM (27/01)
2. "Uma escala" → "(com conexão)"
3. "Voo direto" → "(voo direto)"
4. GRU → Guarulhos, MCO → Orlando
5. Cada opção independente

TEXTO A FORMATAR:
${conteudoPrincipal}

PASSAGEIROS: ${passageiros}

⚠️ NÃO INVENTE - USE APENAS O TEXTO FORNECIDO!`;
}

// ================================================================================
// HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
    // HEADERS OBRIGATÓRIOS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        console.log('🚀 v3.13: Processando requisição...');
        
        // OPTIONS
        if (req.method === 'OPTIONS') {
            return res.status(200).json({ success: true });
        }
        
        // GET
        if (req.method === 'GET') {
            return res.status(200).json({
                success: true,
                status: 'operational',
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                message: 'CVC Itaqua API v3.13 - Estrutura Corrigida'
            });
        }
        
        // VALIDAR POST
        if (req.method !== 'POST') {
            return res.status(200).json({
                success: false,
                error: 'Método não permitido',
                result: 'Use POST'
            });
        }
        
        // EXTRAIR DADOS COM FALLBACK
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
        
        // COMBINAR CONTEÚDO
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // VALIDAÇÃO
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(200).json({
                success: false,
                error: 'Adicione informações sobre a viagem',
                result: 'Por favor, adicione informações sobre a viagem'
            });
        }
        
        // PASSAGEIROS
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        let passageiros = dadosExtraidos.passageiros || `${String(parseInt(adultos) || 1).padStart(2, '0')} adulto${(parseInt(adultos) || 1) > 1 ? 's' : ''}`;
        
        console.log(`📋 Passageiros: ${passageiros}`);
        
        // DETECTAR TIPO
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        console.log(`📄 Tipo: ${tipoOrcamento}`);
        
        // GERAR PROMPT
        const prompt = gerarPrompt(conteudoPrincipal, passageiros, tipoOrcamento, destino, !!imagemBase64);
        
        // PROCESSAR COM IA
        let resultado = '';
        let iaUsada = 'none';
        
        try {
            // DECIDIR IA
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            
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
                                content: 'Você é assistente da CVC. Formate orçamentos seguindo EXATAMENTE as instruções. NÃO INVENTE informações.' 
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
                iaUsada = 'gpt';
                
            } else {
                throw new Error('Nenhuma API de IA configurada');
            }
            
        } catch (iaError) {
            console.error('❌ Erro IA:', iaError);
            resultado = `Erro ao processar: ${iaError.message}`;
            iaUsada = 'error';
        }
        
        // PÓS-PROCESSAMENTO
        if (resultado && !resultado.includes('Erro')) {
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        }
        
        console.log('✅ v3.13: Processamento completo');
        
        // RETORNO GARANTIDO JSON
        return res.status(200).json({
            success: true,
            result: resultado || 'Erro ao processar. Tente novamente.',
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                ia_usada: iaUsada
            }
        });
        
    } catch (error) {
        console.error('❌ v3.13: Erro geral:', error);
        
        // SEMPRE JSON - NUNCA HTML
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro interno',
            result: 'Erro interno do servidor. Tente novamente.'
        });
    }
}

// ================================================================================
// LOGS
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              CVC ITAQUA v3.13 - ESTRUTURA CORRIGIDA           ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Imports inline - sem quebra ESM                           ║');
console.log('║ ✅ JSON sempre garantido                                      ║');
console.log('║ ✅ Fallback robusto                                           ║');
console.log('║ ✅ Pós-processamento inline                                   ║');
console.log('║ ✅ Lógica (+1) corrigida                                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v3.13 - NUNCA MAIS ERRO 500!');
