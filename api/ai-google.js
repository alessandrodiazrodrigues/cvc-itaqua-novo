// api/ai-google.js - CVC ITAQUA v3.0 - ARQUIVO ÚNICO PARA DEBUG
// ================================================================================

const CONFIG = {
    VERSION: '3.0'
};

const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'LIS': 'Lisboa', 'MAD': 'Madrid', 'BCN': 'Barcelona',
    'CDG': 'Paris', 'FCO': 'Roma', 'LHR': 'Londres',
    'MIA': 'Miami', 'MCO': 'Orlando', 'CUN': 'Cancún',
    'EZE': 'Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima'
};

const REGRAS_BAGAGEM = {
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg'
};

// ================================================================================
// FUNÇÕES DE PÓS-PROCESSAMENTO
// ================================================================================

function extrairDadosCompletos(conteudoPrincipal) {
    const dados = {
        opcoes: [],
        passageiros: null,
        destino: null
    };
    
    try {
        // Extrair passageiros
        let matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
        
        if (!matchPassageiros) {
            matchPassageiros = conteudoPrincipal.match(/(\d+)\s*adultos?\s*(?:\+|e)?\s*(\d*)\s*crianças?/i);
        }
        
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]) || 2;
            const criancas = parseInt(matchPassageiros[2]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        }
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
}

function posProcessar(texto, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 Pós-processamento v3.0...');
        
        let resultado = texto;
        
        // 1. Corrigir datas
        const meses = {
            'janeiro': '01', 'jan': '01', 'fevereiro': '02', 'fev': '02',
            'março': '03', 'mar': '03', 'abril': '04', 'abr': '04',
            'maio': '05', 'mai': '05', 'junho': '06', 'jun': '06',
            'julho': '07', 'jul': '07', 'agosto': '08', 'ago': '08',
            'setembro': '09', 'set': '09', 'outubro': '10', 'out': '10',
            'novembro': '11', 'nov': '11', 'dezembro': '12', 'dez': '12'
        };
        
        resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
            const mesNum = meses[mes.toLowerCase()] || mes;
            return `${dia.padStart(2, '0')}/${mesNum}`;
        });
        
        // 2. Converter aeroportos
        Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
            const regex = new RegExp(`\\b${codigo}\\b`, 'g');
            resultado = resultado.replace(regex, nome);
        });
        
        // 3. Corrigir passageiros
        const dados = extrairDadosCompletos(conteudoOriginal);
        if (dados.passageiros) {
            resultado = resultado.replace(/\d{2} adultos?(?:\s*\+\s*\d{2} crianças?)?/gi, dados.passageiros);
        }
        
        // 4. Corrigir parcelamento
        if (parcelamentoSelecionado && parcelamentoSelecionado !== '') {
            const valoresEncontrados = resultado.match(/💰 R\$ ([\d.,]+)/g);
            
            if (valoresEncontrados) {
                valoresEncontrados.forEach(valorMatch => {
                    const valor = valorMatch.match(/[\d.,]+/)[0];
                    const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                    const numParcelas = parseInt(parcelamentoSelecionado);
                    const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
                    
                    const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
                    
                    // Substituir parcelamento existente ou adicionar
                    const regex = new RegExp(`(${valorMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?)(?:💳[^\\n]*)?`, 'gs');
                    resultado = resultado.replace(regex, `$1\n${linhaParcelamento}`);
                });
            }
        } else {
            // Se não tem parcelamento selecionado, remover linha de parcelamento
            resultado = resultado.replace(/\n💳[^\n]+/g, '');
        }
        
        // 5. Corrigir bagagem
        resultado = resultado.replace(/✅ Bolsa ou mochila pequena/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        resultado = resultado.replace(/✅ 1 bagagem de mão/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        resultado = resultado.replace(/✅ Sem bagagem/g, '✅ ' + REGRAS_BAGAGEM.SEM_DESPACHADA);
        
        // 6. Remover linha de assento se não tiver
        if (!conteudoOriginal.toLowerCase().includes('pré reserva') && 
            !conteudoOriginal.toLowerCase().includes('pre reserva')) {
            resultado = resultado.replace(/💺[^\n]*\n/g, '');
        }
        
        // 7. Garantir versão
        if (!resultado.includes(`(v${CONFIG.VERSION})`)) {
            resultado = resultado.trim() + `\n\nValores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
        }
        
        return resultado;
        
    } catch (error) {
        console.error('Erro no pós-processamento:', error);
        return texto;
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
    
    try {
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
                message: 'CVC Itaqua API v3.0 - Debug Mode'
            });
        }
        
        // POST
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Método não permitido'
            });
        }
        
        console.log('🚀 v3.0: Processando...');
        
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
        
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }
        
        // Formatar passageiros
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
        
        // Criar prompt simples
        const prompt = `
Formate este orçamento de viagem para WhatsApp:

${conteudoPrincipal}

REGRAS:
- Datas: DD/MM
- Passageiros: ${passageiros}
- Se tiver múltiplas opções, numere: OPÇÃO 1, OPÇÃO 2, etc.
- Use emojis: 💰 ✈️ 💳 ✅ 🏷️ 🔗
- Termine com: Valores sujeitos a confirmação e disponibilidade (v3.0)`;
        
        let resultado = '';
        
        // Processar com IA
        try {
            if (imagemBase64 && process.env.ANTHROPIC_API_KEY) {
                // Claude para imagens
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
                
                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                // GPT para texto
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'Formate orçamentos de viagem para WhatsApp.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.3,
                        max_tokens: 3000
                    })
                });
                
                const data = await response.json();
                resultado = data.choices[0].message.content;
                
            } else {
                throw new Error('Nenhuma API configurada');
            }
            
        } catch (iaError) {
            console.error('Erro IA:', iaError);
            resultado = 'Erro ao processar com IA';
        }
        
        // Pós-processar
        resultado = posProcessar(resultado, conteudoPrincipal, parcelamento);
        
        console.log('✅ Processamento completo');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                passageiros: passageiros
            }
        });
        
    } catch (error) {
        console.error('❌ Erro geral:', error);
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro ao processar',
            result: 'Erro ao processar. Tente novamente.'
        });
    }
}

console.log('🚀 CVC Itaqua v3.0 - Debug Mode carregado!');
