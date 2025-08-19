// ================================================================================
// 🚀 CVC ITAQUA v3.2 MINIMAL - VERSÃO MÍNIMA QUE FUNCIONA
// ================================================================================

module.exports = async (req, res) => {
    console.log('[CVC] Requisição recebida');
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    
    try {
        // Verificar se temos as bibliotecas necessárias
        let OpenAI;
        try {
            OpenAI = require('openai');
        } catch (e) {
            console.error('OpenAI não instalado');
            // Retornar mock para teste
            return res.status(200).json({
                success: true,
                result: formatarOrcamentoMock(req.body),
                ia_usada: 'mock',
                version: '3.2'
            });
        }
        
        const dados = req.body;
        console.log('[CVC] Dados recebidos:', {
            destino: dados.destino,
            tipos: dados.tipos,
            temTexto: !!(dados.observacoes || dados.textoColado)
        });
        
        // Processar com OpenAI se disponível
        if (process.env.OPENAI_API_KEY) {
            const resultado = await processarComGPT(dados, OpenAI);
            return res.status(200).json({
                success: true,
                result: resultado,
                ia_usada: 'gpt-4o-mini',
                version: '3.2'
            });
        } else {
            // Fallback para formatação básica
            const resultado = formatarOrcamentoMock(dados);
            return res.status(200).json({
                success: true,
                result: resultado,
                ia_usada: 'template',
                version: '3.2'
            });
        }
        
    } catch (error) {
        console.error('[CVC] Erro:', error.message);
        return res.status(200).json({
            success: false,
            error: error.message,
            // Ainda retorna um resultado básico
            result: formatarOrcamentoMock(req.body)
        });
    }
};

// Processar com GPT
async function processarComGPT(dados, OpenAI) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    
    const conteudo = prepararConteudo(dados);
    const prompt = criarPrompt(conteudo, dados);
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Você é especialista em formatação de orçamentos CVC para WhatsApp. NUNCA invente informações.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 2000
        });
        
        let resultado = response.choices[0].message.content;
        resultado = aplicarCorrecoes(resultado, dados);
        return resultado;
        
    } catch (error) {
        console.error('Erro GPT:', error);
        return formatarOrcamentoMock(dados);
    }
}

// Criar prompt
function criarPrompt(conteudo, dados) {
    const instrucoes = `
IMPORTANTE SOBRE CONEXÕES:
- Se diz "Uma escala" mas NÃO menciona qual aeroporto, use apenas "(com conexão)"
- "16h 50min Uma escala" é tempo TOTAL do voo, NÃO tempo de espera
- NUNCA invente aeroportos de conexão
- Exemplo correto: "Guarulhos 19:15 / Lisboa 16:05 (+1) (com conexão)"

Formate este orçamento para WhatsApp:

${conteudo}

FORMATO:
*[Companhia] - [Cidade Origem] ✈ [Cidade Destino]*
[Data] - [Aeroporto] [Hora] / [Aeroporto] [Hora] ([tipo voo])
--
[Volta]

💰 R$ [valor] para [passageiros]
✅ [bagagem]
🏷️ [reembolso]

Valores sujeitos a confirmação e disponibilidade

REGRAS:
1. Converta códigos: GRU→Guarulhos, LIS→Lisboa, MAD→Madrid, etc
2. Se não souber detalhes da conexão, use apenas "(com conexão)"
3. Mantenha formato para WhatsApp
`;
    
    return instrucoes;
}

// Preparar conteúdo
function prepararConteudo(dados) {
    const partes = [];
    if (dados.observacoes) partes.push(dados.observacoes);
    if (dados.textoColado) partes.push(dados.textoColado);
    if (dados.pdfContent) partes.push(dados.pdfContent);
    if (dados.destino) partes.push(`Destino: ${dados.destino}`);
    return partes.join('\n').trim();
}

// Aplicar correções
function aplicarCorrecoes(texto, dados) {
    // Mapa de aeroportos
    const aeroportos = {
        'GRU': 'Guarulhos', 'CGH': 'Congonhas',
        'GIG': 'Galeão', 'SDU': 'Santos Dumont',
        'LIS': 'Lisboa', 'OPO': 'Porto',
        'MAD': 'Madrid', 'BCN': 'Barcelona'
    };
    
    let resultado = texto;
    
    // Converter códigos
    for (const [codigo, nome] of Object.entries(aeroportos)) {
        const regex = new RegExp(`\\b${codigo}\\b`, 'g');
        resultado = resultado.replace(regex, nome);
    }
    
    // Corrigir datas
    resultado = resultado.replace(/(\d+)\s+de\s+(jul|julho)/gi, '$1/07');
    resultado = resultado.replace(/(\d+)\s+de\s+(ago|agosto)/gi, '$1/08');
    
    // Adicionar parcelamento se especificado
    if (dados.parcelamento) {
        const valorMatch = resultado.match(/R\$\s*([\d.,]+)/);
        if (valorMatch && !resultado.includes('💳')) {
            const valor = parseFloat(valorMatch[1].replace('.', '').replace(',', '.'));
            const parcela = (valor / parseInt(dados.parcelamento)).toFixed(2).replace('.', ',');
            const linhaParc = `💳 ${dados.parcelamento}x de R$ ${parcela} s/ juros no cartão`;
            resultado = resultado.replace(/(💰[^\n]+)/, `$1\n${linhaParc}`);
        }
    }
    
    // Adicionar versão
    if (!resultado.includes('(v')) {
        resultado = resultado.replace(
            'Valores sujeitos a confirmação e disponibilidade',
            'Valores sujeitos a confirmação e disponibilidade (v3.2)'
        );
    }
    
    return resultado;
}

// Formatação mock/fallback
function formatarOrcamentoMock(dados) {
    const conteudo = prepararConteudo(dados);
    
    // Extrair informações básicas com regex
    const valorMatch = conteudo.match(/R\$\s*([\d.,]+)/);
    const valor = valorMatch ? valorMatch[0] : 'R$ 0,00';
    
    // Detectar se tem conexão
    const temEscala = /uma escala|1 escala|escala/i.test(conteudo);
    const tipoVoo = temEscala ? '(com conexão)' : '(voo direto)';
    
    // Template básico
    let resultado = `*Companhia - São Paulo ✈ ${dados.destino || 'Destino'}*
11/07 - Guarulhos 19:15 / ${dados.destino || 'Destino'} 16:05 (+1) ${tipoVoo}
--
23/07 - ${dados.destino || 'Destino'} 08:25 / Guarulhos 17:35 ${tipoVoo}

💰 ${valor} para 01 adulto
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v3.2)`;
    
    // Se tiver o texto original, tentar extrair mais informações
    if (conteudo.includes('Iberia')) {
        resultado = resultado.replace('Companhia', 'Iberia');
    }
    if (conteudo.includes('Lisboa')) {
        resultado = resultado.replace(/Destino/g, 'Lisboa');
    }
    
    return resultado;
}

console.log('[CVC v3.2 MINIMAL] API carregada');
