// api/ai-google.js - CVC ITAQUA v2.90 FINAL
// Sistema completo com pós-processamento robusto

// ================================================================================
// CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const CONFIG = {
    VERSION: '2.90'
};

const AEROPORTOS = {
    // Brasil - Principais
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju',
    'JPA': 'João Pessoa', 'THE': 'Teresina', 'SLZ': 'São Luís',
    'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'GYN': 'Goiânia',
    
    // Internacional - Europa
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa', 'VCE': 'Veneza', 'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'MUC': 'Munique', 'ZRH': 'Zurique', 'VIE': 'Viena',
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 'MIA': 'Miami', 'MCO': 'Orlando',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'LAS': 'Las Vegas',
    'CUN': 'Cancún', 'MEX': 'Cidade do México', 'PTY': 'Panamá',
    'EZE': 'Ezeiza', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'UIO': 'Quito', 'MVD': 'Montevidéu'
};

const CIDADES_AEROPORTOS = {
    'São Paulo': ['GRU', 'CGH', 'VCP'],
    'Rio de Janeiro': ['GIG', 'SDU'],
    'Lisboa': ['LIS'],
    'Porto': ['OPO'],
    'Madrid': ['MAD'],
    'Barcelona': ['BCN'],
    'Paris': ['CDG'],
    'Roma': ['FCO'],
    'Londres': ['LHR'],
    'Miami': ['MIA'],
    'Orlando': ['MCO'],
    'Buenos Aires': ['EZE']
};

// ================================================================================
// FUNÇÕES DE PÓS-PROCESSAMENTO ROBUSTAS
// ================================================================================

function posProcessarResultado(texto, conteudoOriginal) {
    try {
        console.log('🔧 Iniciando pós-processamento v2.90...');
        
        let resultado = texto;
        
        // 1. Corrigir datas (CRÍTICO)
        resultado = corrigirDatas(resultado);
        
        // 2. Converter códigos de aeroporto
        resultado = converterCodigosAeroporto(resultado);
        
        // 3. Extrair e corrigir passageiros
        resultado = corrigirPassageiros(resultado, conteudoOriginal);
        
        // 4. Corrigir formato de voo
        resultado = corrigirFormatoVoo(resultado, conteudoOriginal);
        
        // 5. Corrigir links markdown
        resultado = corrigirLinks(resultado);
        
        // 6. Corrigir bagagem
        resultado = corrigirBagagem(resultado, conteudoOriginal);
        
        // 7. Corrigir parcelamento
        resultado = corrigirParcelamento(resultado, conteudoOriginal);
        
        // 8. Adicionar (+1) quando necessário
        resultado = adicionarDiaSeguinte(resultado, conteudoOriginal);
        
        // 9. Garantir versão no final
        resultado = garantirVersao(resultado);
        
        // 10. Limpar formatação extra
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

function corrigirDatas(texto) {
    // Converter vários formatos de data para DD/MM
    const meses = {
        'janeiro': '01', 'jan': '01',
        'fevereiro': '02', 'fev': '02',
        'março': '03', 'mar': '03',
        'abril': '04', 'abr': '04',
        'maio': '05', 'mai': '05',
        'junho': '06', 'jun': '06',
        'julho': '07', 'jul': '07',
        'agosto': '08', 'ago': '08',
        'setembro': '09', 'set': '09',
        'outubro': '10', 'out': '10',
        'novembro': '11', 'nov': '11',
        'dezembro': '12', 'dez': '12'
    };
    
    let resultado = texto;
    
    // Formato: "sáb, 11 de julho" ou "11 de julho"
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    // Formato: "11 de jul"
    resultado = resultado.replace(/(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    // Formato: "julho 11" ou "jul 11"
    resultado = resultado.replace(/(\w+)\s+(\d{1,2})/gi, (match, mes, dia) => {
        const mesNum = meses[mes.toLowerCase()];
        if (mesNum) {
            return `${dia.padStart(2, '0')}/${mesNum}`;
        }
        return match;
    });
    
    return resultado;
}

function converterCodigosAeroporto(texto) {
    let resultado = texto;
    
    // Converter códigos de aeroporto para nomes
    Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
        // Padrão: "19:15 GRU" ou "GRU 19:15"
        const regex1 = new RegExp(`(\\d{2}:\\d{2})\\s+${codigo}\\b`, 'g');
        const regex2 = new RegExp(`\\b${codigo}\\s+(\\d{2}:\\d{2})`, 'g');
        const regex3 = new RegExp(`\\b${codigo}\\b`, 'g');
        
        resultado = resultado.replace(regex1, `$1 ${nome}`);
        resultado = resultado.replace(regex2, `${nome} $1`);
        
        // Apenas substituir códigos isolados em contextos de voo
        if (resultado.includes(codigo) && resultado.includes('✈')) {
            resultado = resultado.replace(regex3, nome);
        }
    });
    
    return resultado;
}

function corrigirPassageiros(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Extrair passageiros do conteúdo original
    const matchPassageiros = conteudoOriginal.match(/(\d+)\s*(?:Adultos?|adultos?)[^0-9]*(\d*)\s*(?:Crianças?|crianças?|Criança|criança)?/i);
    
    if (matchPassageiros) {
        const adultos = matchPassageiros[1].padStart(2, '0');
        const criancas = matchPassageiros[2] || '0';
        
        let passageirosFormatado = `${adultos} adulto${adultos !== '01' ? 's' : ''}`;
        if (criancas !== '0' && criancas !== '') {
            passageirosFormatado += ` + ${criancas.padStart(2, '0')} criança${criancas !== '01' ? 's' : ''}`;
        }
        
        // Substituir qualquer formato de passageiros incorreto
        resultado = resultado.replace(/para \d+ adultos?(?:\s*\+\s*\d+ crianças?)?/gi, `para ${passageirosFormatado}`);
        resultado = resultado.replace(/👥 .+/g, `👥 ${passageirosFormatado}`);
    }
    
    return resultado;
}

function corrigirFormatoVoo(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Detectar tipo de voo e formatar corretamente
    
    // Voo direto
    resultado = resultado.replace(/Voo direto/gi, '(voo direto)');
    resultado = resultado.replace(/\bDireto\b/gi, '(voo direto)');
    
    // Voo com escala/conexão
    if (conteudoOriginal.toLowerCase().includes('madrid')) {
        resultado = resultado.replace(/Uma escala/gi, '(uma escala em Madrid)');
        resultado = resultado.replace(/\(com conexão\)/gi, '(uma escala em Madrid)');
    } else if (conteudoOriginal.toLowerCase().includes('panamá')) {
        resultado = resultado.replace(/Uma escala/gi, '(uma escala no Panamá)');
    } else {
        resultado = resultado.replace(/Uma escala/gi, '(com conexão)');
    }
    
    // Corrigir formato de ida e volta
    resultado = resultado.replace(/^Ida:/gm, '');
    resultado = resultado.replace(/^Volta:/gm, '');
    resultado = resultado.replace(/Classe Econômica/gi, '');
    
    // Formatar corretamente as linhas de voo
    resultado = resultado.replace(/(\d{2}\/\d{2})\s*-?\s*(\d{2}:\d{2})\s+([A-Za-zÀ-ú\s]+?)\s+(\d{1,2}h\s*\d{1,2}min)\s+(.+?)\s+(\d{2}:\d{2})\s+([A-Za-zÀ-ú\s]+)/g, 
        '$1 - $2 $3 / $6 $7');
    
    return resultado;
}

function corrigirLinks(texto) {
    // Converter markdown links para links diretos
    return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
}

function corrigirBagagem(texto, conteudoOriginal) {
    let resultado = texto;
    const conteudoLower = conteudoOriginal.toLowerCase();
    
    if (conteudoLower.includes('sem bagagem') || conteudoLower.includes('sem  bagagem')) {
        resultado = resultado.replace(/✅.+(?=\n💺|$)/m, '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg');
    } else if (conteudoLower.includes('com bagagem') || conteudoLower.includes('com abagegem')) {
        resultado = resultado.replace(/✅.+(?=\n💺|$)/m, '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg');
    }
    
    return resultado;
}

function corrigirParcelamento(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Detectar parcelamento com entrada
    const matchEntrada = conteudoOriginal.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
    
    if (matchEntrada) {
        const [, entrada, parcelas, valorParcela] = matchEntrada;
        const totalMatch = conteudoOriginal.match(/R\$\s*([\d.,]+)/);
        const total = totalMatch ? totalMatch[1] : '0';
        
        const totalParcelas = parseInt(parcelas) + 1;
        const linhaParcelamento = `💳 Total de R$ ${total} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${parcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        
        // Substituir linha de parcelamento existente
        resultado = resultado.replace(/💳.+/g, linhaParcelamento);
    } else {
        // Parcelamento simples
        const matchSimples = conteudoOriginal.match(/(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
        if (matchSimples) {
            const [, parcelas, valor] = matchSimples;
            resultado = resultado.replace(/💳.+/g, `💳 ${parcelas}x de R$ ${valor} s/ juros no cartão`);
        }
    }
    
    return resultado;
}

function adicionarDiaSeguinte(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Adicionar (+1) quando necessário baseado em horários
    // Se voo sai tarde e chega cedo, provavelmente é dia seguinte
    const linhasVoo = resultado.split('\n');
    
    linhasVoo.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ')) {
            const horaMatch = linha.match(/(\d{2}:\d{2})[^\/]+\/[^0-9]*(\d{2}:\d{2})/);
            if (horaMatch) {
                const [, horaSaida, horaChegada] = horaMatch;
                const saidaMin = parseInt(horaSaida.split(':')[0]) * 60 + parseInt(horaSaida.split(':')[1]);
                const chegadaMin = parseInt(horaChegada.split(':')[0]) * 60 + parseInt(horaChegada.split(':')[1]);
                
                // Se saída depois das 15h e chegada antes das 10h, ou voo longo (>8h)
                if ((saidaMin > 900 && chegadaMin < 600) || 
                    linha.includes('9h') || linha.includes('10h') || 
                    linha.includes('11h') || linha.includes('12h') ||
                    linha.includes('13h') || linha.includes('14h') ||
                    linha.includes('15h') || linha.includes('16h')) {
                    
                    if (!linha.includes('(+1)')) {
                        linhasVoo[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))?$/, '$1 (+1)$2');
                    }
                }
            }
        }
    });
    
    return linhasVoo.join('\n');
}

function garantirVersao(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    
    if (!texto.includes(`(v${CONFIG.VERSION})`)) {
        // Remover versão antiga se existir
        texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
        // Adicionar versão correta no final
        texto = texto.trim() + '\n\n' + versaoTexto;
    }
    
    return texto;
}

function limparFormatacao(texto) {
    // Limpar espaços extras e linhas vazias desnecessárias
    let resultado = texto;
    
    // Remover múltiplas quebras de linha
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços no final das linhas
    resultado = resultado.split('\n').map(linha => linha.trimEnd()).join('\n');
    
    // Garantir separador correto entre ida e volta
    resultado = resultado.replace(/\n--\n/g, '\n--\n');
    
    return resultado.trim();
}

// ================================================================================
// DETECÇÃO DE TIPO E EXTRAÇÃO DE DADOS
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
        
        // Detectar múltiplas opções
        const opcoes = (conteudoPrincipal.match(/R\$\s*[\d.,]+/g) || []).length;
        const temOpcoes = conteudoPrincipal.match(/opção \d|OPÇÃO \d/gi);
        const multiplosLinks = (conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br/g) || []).length;
        
        if (opcoes >= 2 || temOpcoes || multiplosLinks >= 2) {
            return 'MULTIPLAS_OPCOES';
        }
        
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

function extrairDadosDoConteudo(conteudoPrincipal) {
    const dados = {
        passageiros: null,
        opcoes: [],
        destino: null
    };
    
    // Extrair passageiros
    const matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
    if (matchPassageiros) {
        const adultos = matchPassageiros[1].padStart(2, '0');
        const criancas = matchPassageiros[2] || '0';
        dados.passageiros = `${adultos} adulto${adultos !== '01' ? 's' : ''}`;
        if (criancas !== '0' && criancas !== '') {
            dados.passageiros += ` + ${criancas.padStart(2, '0')} criança${criancas !== '01' ? 's' : ''}`;
        }
    }
    
    // Extrair opções de voo
    const blocos = conteudoPrincipal.split(/(?=R\$\s*[\d.,]+\s*(?:Entrada|Total))/);
    
    blocos.forEach(bloco => {
        if (bloco.includes('R$')) {
            const opcao = {
                companhia: null,
                valor: null,
                parcelamento: null,
                bagagem: null,
                assento: null,
                link: null
            };
            
            // Companhia
            const matchCompanhia = bloco.match(/(Iberia|Tap portugal|Latam|Gol|Azul)/i);
            if (matchCompanhia) {
                opcao.companhia = matchCompanhia[1].replace(/tap portugal/i, 'Tap Portugal');
            }
            
            // Valor
            const matchValor = bloco.match(/R\$\s*([\d.,]+)/);
            if (matchValor) opcao.valor = matchValor[1];
            
            // Parcelamento
            const matchParc = bloco.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParc) {
                const total = parseInt(matchParc[2]) + 1;
                opcao.parcelamento = `Total de R$ ${opcao.valor} em até ${total}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`;
            }
            
            // Bagagem
            if (bloco.toLowerCase().includes('sem bagagem')) {
                opcao.bagagem = 'Inclui 1 item pessoal + 1 mala de mão de 10kg';
            } else if (bloco.toLowerCase().includes('com bagagem') || bloco.toLowerCase().includes('com abagegem')) {
                opcao.bagagem = 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
            }
            
            // Assento
            if (bloco.toLowerCase().includes('pre reserva') || bloco.toLowerCase().includes('pré reserva')) {
                opcao.assento = 'Inclui pré reserva de assento';
            }
            
            // Link
            const matchLink = bloco.match(/https:\/\/www\.cvc\.com\.br[^\s]*/);
            if (matchLink) opcao.link = matchLink[0];
            
            if (opcao.valor) dados.opcoes.push(opcao);
        }
    });
    
    return dados;
}

// ================================================================================
// GERAÇÃO DE PROMPT MELHORADO
// ================================================================================

function gerarPromptMelhorado(tipoOrcamento, conteudoPrincipal, destino, passageiros) {
    const dados = extrairDadosDoConteudo(conteudoPrincipal);
    
    if (dados.passageiros) {
        passageiros = dados.passageiros;
    }
    
    let prompt = `
TAREFA: Formatar orçamento de viagem CVC no formato WhatsApp.

DADOS EXTRAÍDOS DO CONTEÚDO:
${conteudoPrincipal}

FORMATO EXATO ESPERADO:

*{COMPANHIA} - São Paulo ✈ ${destino}*
{DATA_IDA} - {AEROPORTO_ORIGEM} {HORA_SAIDA} / {AEROPORTO_DESTINO} {HORA_CHEGADA} {TIPO_VOO}
--
{DATA_VOLTA} - {AEROPORTO_DESTINO} {HORA_SAIDA} / {AEROPORTO_ORIGEM} {HORA_CHEGADA} {TIPO_VOO}

💰 R$ {VALOR} para ${passageiros}
💳 {PARCELAMENTO}
✅ {BAGAGEM}
💺 {ASSENTO}
🏷️ Não reembolsável
🔗 {LINK}

REGRAS CRÍTICAS:
1. DATAS: Formato DD/MM (exemplo: 11/07, não "11 de julho")
2. AEROPORTOS: Use nomes completos (Guarulhos, não GRU)
3. TIPO VOO: "(voo direto)" ou "(uma escala em {cidade})" ou "(com conexão)"
4. CHEGADA: Adicione (+1) se chegar no dia seguinte
5. LINKS: Formato direto, não use markdown [texto](link)
6. PASSAGEIROS: Exatamente como fornecido: ${passageiros}
7. NÃO invente informações - use apenas dados do conteúdo

`;

    if (dados.opcoes.length > 0) {
        prompt += '\nOPÇÕES DETECTADAS:\n';
        dados.opcoes.forEach((opcao, index) => {
            prompt += `
OPÇÃO ${index + 1}:
- Companhia: ${opcao.companhia}
- Valor: R$ ${opcao.valor}
- Parcelamento: ${opcao.parcelamento}
- Bagagem: ${opcao.bagagem}
- Assento: ${opcao.assento}
- Link: ${opcao.link}
`;
        });
    }

    return prompt;
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

    // GET - Status
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: CONFIG.VERSION,
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.90 - Sistema com Pós-Processamento Robusto'
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
        console.log('🚀 v2.90: Iniciando processamento...');
        
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

        // Detectar tipo
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        
        // Extrair destino
        const destinoFinal = destino || extrairDestino(conteudoPrincipal);
        
        // Formatar passageiros (será sobrescrito se encontrado no conteúdo)
        let passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
        if (criancas > 0) {
            passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
        }
        
        console.log(`📋 v2.90: Tipo: ${tipoOrcamento} | Destino: ${destinoFinal}`);
        
        // Gerar prompt melhorado
        const prompt = gerarPromptMelhorado(tipoOrcamento, conteudoPrincipal, destinoFinal, passageiros);
        
        // Processar com IA
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        
        try {
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v2.90: Usando Claude...');
                
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
                        messages
                    })
                });

                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ v2.90: Usando GPT-4...');
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'Formate EXATAMENTE como solicitado. Siga o template à risca.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.1,
                        max_tokens: 3000
                    })
                });

                const data = await response.json();
                resultado = data.choices[0].message.content;
            }
            
        } catch (iaError) {
            console.error('❌ v2.90: Erro IA:', iaError);
            throw iaError;
        }

        // APLICAR PÓS-PROCESSAMENTO ROBUSTO
        resultado = posProcessarResultado(resultado, conteudoPrincipal);
        
        console.log('✅ v2.90: Processamento completo com pós-processamento');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                destino: destinoFinal,
                passageiros: passageiros,
                ia_usada: usarClaude ? 'claude' : 'gpt',
                pos_processado: true
            }
        });

    } catch (error) {
        console.error('❌ v2.90: Erro geral:', error);
        
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar orçamento',
            details: error.message,
            result: 'Erro ao processar. Por favor, tente novamente.'
        });
    }
}

function extrairDestino(conteudoPrincipal) {
    const destinos = ['Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma', 'Londres', 
                     'Orlando', 'Miami', 'Cancún', 'Buenos Aires', 'Santiago'];
    
    for (const destino of destinos) {
        if (conteudoPrincipal.includes(destino)) {
            return destino;
        }
    }
    
    return 'Destino';
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║          CVC ITAQUA v2.90 - PÓS-PROCESSAMENTO ROBUSTO          ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Sistema completo de pós-processamento                       ║');
console.log('║ ✅ Correção automática de datas                                ║');
console.log('║ ✅ Conversão de códigos de aeroporto                           ║');
console.log('║ ✅ Formatação correta de passageiros                           ║');
console.log('║ ✅ Links diretos sem markdown                                  ║');
console.log('║ ✅ Detecção inteligente de bagagem e parcelamento              ║');
console.log('║ ✅ Adiciona (+1) automaticamente                               ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('📅 Data:', new Date().toISOString());
console.log('🚀 Sistema v2.90 pronto!');
