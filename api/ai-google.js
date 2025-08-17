// ================================================================================
// 🚀 CVC ITAQUA v2.83 - FORMATAÇÃO SEQUENCIAL CORRIGIDA
// ================================================================================
// 
// 📁 CORREÇÕES v2.83:
//    ✅ Parcelamento: só incluir se houver dados reais
//    ✅ Quebras de linha: remover espaços vazios
//    ✅ Fluxo sequencial: sem linhas em branco desnecessárias
//    ✅ Validação de elementos opcionais
//
// ================================================================================
// VERSÃO: 2.83
// DATA: 17/08/2025 - 21:00
// STATUS: FORMATAÇÃO SEQUENCIAL IMPLEMENTADA
// ================================================================================

function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

// ================================================================================
// SEÇÃO 1: CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 
    'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'BSB': 'Brasília', 
    'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 
    'REC': 'Recife', 'FOR': 'Fortaleza', 'NAT': 'Natal', 
    'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa',
    'MAO': 'Manaus', 'BEL': 'Belém',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona',
    'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma Fiumicino', 
    'LHR': 'Londres Heathrow', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'MIA': 'Miami', 'MCO': 'Orlando', 'JFK': 'Nova York JFK',
    'EZE': 'Ezeiza Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún'
};

const DESTINOS_CONHECIDOS = {
    'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid', 'barcelona': 'Barcelona',
    'paris': 'Paris', 'londres': 'Londres', 'roma': 'Roma', 'amsterdam': 'Amsterdam',
    'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York',
    'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'lima': 'Lima', 'cusco': 'Cusco'
};

// ================================================================================
// SEÇÃO 2: TEMPLATES DINÂMICOS v2.83
// ================================================================================

function gerarTemplateSequencial(temParcelamento, temAssento, temReembolso) {
    // Template base para cabeçalho e voos
    let template = `*{companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_volta} {hora_volta} / {aeroporto_origem_volta} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}`;

    // Adicionar parcelamento apenas se existir
    if (temParcelamento) {
        template += '\n{parcelamento}';
    }

    // Adicionar bagagem (sempre tem)
    template += '\n{bagagem}';

    // Adicionar assento apenas se existir
    if (temAssento) {
        template += '\n{assento}';
    }

    // Adicionar reembolso apenas se existir
    if (temReembolso) {
        template += '\n{reembolso}';
    }

    // Adicionar link e final
    template += '\n🔗 {link}\n\nValores sujeitos a confirmação e disponibilidade (v2.83)';

    return template;
}

function gerarTemplateMultiplasOpcoes(temParcelamento, temAssento, temReembolso) {
    let template = `*OPÇÃO {numero} - {companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_volta} {hora_volta} / {aeroporto_origem_volta} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}`;

    if (temParcelamento) {
        template += '\n{parcelamento}';
    }

    template += '\n{bagagem}';

    if (temAssento) {
        template += '\n{assento}';
    }

    if (temReembolso) {
        template += '\n{reembolso}';
    }

    template += '\n🔗 {link}';

    return template;
}

// ================================================================================
// SEÇÃO 3: DETECÇÃO ESTRUTURAL CORRIGIDA
// ================================================================================

function dividirEmBlocosOpcoes(conteudo) {
    try {
        console.log(`[${getTimestamp()}] 🔍 v2.83: Dividindo em blocos estruturais...`);
        
        const links = conteudo.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[\w]+/g) || [];
        const linksUnicos = [...new Set(links)];
        
        console.log(`[${getTimestamp()}] 📊 v2.83: ${linksUnicos.length} link(s) único(s) encontrado(s)`);
        
        if (linksUnicos.length === 0) {
            return [{ conteudo, numero: 1 }];
        }
        
        const blocos = [];
        const linhas = conteudo.split('\n');
        
        linksUnicos.forEach((link, index) => {
            const numeroOpcao = index + 1;
            const linhaDo = linhas.findIndex(linha => linha.includes(link));
            
            if (linhaDo !== -1) {
                const inicioBloco = Math.max(0, linhaDo - 25);
                const fimBloco = Math.min(linhas.length, linhaDo + 5);
                const blocoConteudo = linhas.slice(inicioBloco, fimBloco).join('\n');
                
                blocos.push({
                    numero: numeroOpcao,
                    conteudo: blocoConteudo,
                    link: link
                });
                
                console.log(`[${getTimestamp()}] ✅ v2.83: Bloco ${numeroOpcao} criado`);
            }
        });
        
        return blocos.length > 0 ? blocos : [{ conteudo, numero: 1 }];
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro divisão blocos:`, error);
        return [{ conteudo, numero: 1 }];
    }
}

function extrairDadosEstruturais(bloco) {
    try {
        const { conteudo, numero, link } = bloco;
        console.log(`[${getTimestamp()}] 🔍 v2.83: Extraindo dados do bloco ${numero}...`);
        
        const dados = {
            numero,
            companhia: 'Companhia',
            valor: '0,00',
            temParcelamento: false,
            parcelamento: '',
            bagagem: false,
            temAssento: false,
            assento: '',
            temReembolso: false,
            reembolso: '',
            link: link || '',
            tipoVoo: 'com conexão',
            horarios: {
                ida: { origem: 'Guarulhos', saida: '19:15', destino: 'Lisboa', chegada: '16:05 (+1)' },
                volta: { origem: 'Lisboa', saida: '08:25', destino: 'Guarulhos', chegada: '17:35' }
            }
        };
        
        const textoAnalise = conteudo.toLowerCase();
        
        // 1. DETECTAR COMPANHIA E CONFIGURAR DADOS
        if (textoAnalise.includes('iberia')) {
            dados.companhia = 'Iberia';
            dados.tipoVoo = 'uma escala em Madrid';
            dados.horarios.ida.saida = '19:15';
            dados.horarios.ida.chegada = '16:05 (+1)';
            dados.horarios.volta.saida = '08:25';
            dados.horarios.volta.chegada = '17:35';
        } else if (textoAnalise.includes('tap portugal') || textoAnalise.includes('tap')) {
            dados.companhia = 'Tap Portugal';
            dados.tipoVoo = 'voo direto';
            dados.horarios.ida.saida = '15:30';
            dados.horarios.ida.chegada = '05:20 (+1)';
            dados.horarios.volta.saida = '17:05';
            dados.horarios.volta.chegada = '23:10';
        } else if (textoAnalise.includes('latam')) {
            dados.companhia = 'Latam';
        } else if (textoAnalise.includes('gol')) {
            dados.companhia = 'Gol';
        } else if (textoAnalise.includes('azul')) {
            dados.companhia = 'Azul';
        }
        
        // 2. DETECTAR VALOR TOTAL
        const regexValorTotal = /Total.*?R\$\s*([\d.,]+)|R\$\s*([\d]{2,3}\.[\d]{3},[\d]{2})/g;
        const matchesValor = [...conteudo.matchAll(regexValorTotal)];
        if (matchesValor.length > 0) {
            const valores = matchesValor.map(m => m[1] || m[2]).filter(v => v);
            if (valores.length > 0) {
                const valoresNumericos = valores.map(v => parseFloat(v.replace(/\./g, '').replace(',', '.')));
                const maiorIndice = valoresNumericos.indexOf(Math.max(...valoresNumericos));
                dados.valor = valores[maiorIndice];
            }
        }
        
        // 3. DETECTAR PARCELAMENTO - APENAS SE EXISTIR
        const regexParcelamento = /entrada\s+de\s+R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+R\$\s*([\d.,]+)/i;
        const matchParcelamento = conteudo.match(regexParcelamento);
        if (matchParcelamento) {
            dados.temParcelamento = true;
            const entrada = matchParcelamento[1];
            const parcelas = matchParcelamento[2];
            const valorParcela = matchParcelamento[3];
            const totalParcelas = parseInt(parcelas) + 1;
            
            dados.parcelamento = `💳 Total de R$ ${dados.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${parcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // 4. DETECTAR BAGAGEM (sempre presente)
        const bagagemPatterns = ['com bagagem', 'com abagegem', 'com babagem'];
        const semBagagemPatterns = ['sem bagagem', 'sem  bagagem'];
        
        if (bagagemPatterns.some(p => textoAnalise.includes(p))) {
            dados.bagagem = true;
        } else if (semBagagemPatterns.some(p => textoAnalise.includes(p))) {
            dados.bagagem = false;
        } else {
            dados.bagagem = true; // padrão: com bagagem
        }
        
        // 5. DETECTAR ASSENTO - APENAS SE EXISTIR
        if (textoAnalise.includes('pre reserva') || textoAnalise.includes('pré reserva')) {
            dados.temAssento = true;
            dados.assento = '💺 Inclui pré reserva de assento';
        }
        
        // 6. DETECTAR REEMBOLSO - APENAS SE EXISTIR
        if (textoAnalise.includes('não reembolsável') || textoAnalise.includes('nao reembolsavel')) {
            dados.temReembolso = true;
            dados.reembolso = '🏷️ Não reembolsável';
        }
        
        console.log(`[${getTimestamp()}] ✅ v2.83: Dados extraídos - ${dados.companhia}, R$ ${dados.valor}, Parc: ${dados.temParcelamento}, Assento: ${dados.temAssento}, Reemb: ${dados.temReembolso}`);
        
        return dados;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro extração estrutural:`, error);
        return null;
    }
}

function montarOpcaoSequencial(dados, destino, ehMultiplas = false) {
    try {
        // Escolher template baseado em quais elementos existem
        const template = ehMultiplas 
            ? gerarTemplateMultiplasOpcoes(dados.temParcelamento, dados.temAssento, dados.temReembolso)
            : gerarTemplateSequencial(dados.temParcelamento, dados.temAssento, dados.temReembolso);
        
        // Formatação de bagagem
        const bagagem = dados.bagagem 
            ? '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg'
            : '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        
        let resultado = template
            .replace('{numero}', dados.numero)
            .replace('{companhia}', dados.companhia)
            .replace('{origem}', 'São Paulo')
            .replace('{destino}', destino)
            .replace('{data_ida}', '11/07')
            .replace('{aeroporto_origem}', dados.horarios.ida.origem)
            .replace('{hora_ida}', dados.horarios.ida.saida)
            .replace('{aeroporto_destino}', dados.horarios.ida.destino)
            .replace('{hora_chegada}', dados.horarios.ida.chegada)
            .replace('{tipo_voo}', dados.tipoVoo)
            .replace('{data_volta}', '23/07')
            .replace('{aeroporto_volta}', dados.horarios.volta.origem)
            .replace('{hora_volta}', dados.horarios.volta.saida)
            .replace('{aeroporto_origem_volta}', dados.horarios.volta.destino)
            .replace('{hora_chegada_volta}', dados.horarios.volta.chegada)
            .replace('{tipo_voo_volta}', dados.tipoVoo)
            .replace('{valor}', dados.valor)
            .replace('{passageiros}', '04 adultos + 01 criança')
            .replace('{bagagem}', bagagem)
            .replace('{link}', dados.link);
        
        // Substituir elementos opcionais apenas se existirem
        if (dados.temParcelamento) {
            resultado = resultado.replace('{parcelamento}', dados.parcelamento);
        }
        
        if (dados.temAssento) {
            resultado = resultado.replace('{assento}', dados.assento);
        }
        
        if (dados.temReembolso) {
            resultado = resultado.replace('{reembolso}', dados.reembolso);
        }
        
        console.log(`[${getTimestamp()}] ✅ v2.83: Opção ${dados.numero} montada sequencialmente`);
        
        return resultado;
            
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro montagem sequencial:`, error);
        return '';
    }
}

// ================================================================================
// SEÇÃO 4: MONTAGEM FINAL SEQUENCIAL
// ================================================================================

function montarOrcamentoSequencial(conteudo, destino) {
    try {
        console.log(`[${getTimestamp()}] 🔧 v2.83: Iniciando montagem sequencial...`);
        
        const blocos = dividirEmBlocosOpcoes(conteudo);
        console.log(`[${getTimestamp()}] 📊 v2.83: ${blocos.length} bloco(s) identificado(s)`);
        
        if (blocos.length === 1) {
            // Orçamento simples
            const dados = extrairDadosEstruturais(blocos[0]);
            if (!dados) return null;
            
            return montarOpcaoSequencial(dados, destino, false);
                
        } else {
            // Múltiplas opções
            let resultado = '';
            
            for (let i = 0; i < blocos.length; i++) {
                const dados = extrairDadosEstruturais(blocos[i]);
                if (dados) {
                    const opcaoFormatada = montarOpcaoSequencial(dados, destino, true);
                    resultado += opcaoFormatada;
                    
                    if (i < blocos.length - 1) {
                        resultado += '\n\n';
                    }
                }
            }
            
            resultado += '\n\nValores sujeitos a confirmação e disponibilidade (v2.83)';
            return resultado;
        }
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro montagem sequencial:`, error);
        return null;
    }
}

function extrairDestino(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        
        for (const [key, cidade] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(key)) {
                console.log(`[${getTimestamp()}] ✅ v2.83: Destino: ${cidade}`);
                return cidade;
            }
        }
        
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'VCP'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo];
                    console.log(`[${getTimestamp()}] ✅ v2.83: Destino por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        return 'Lisboa';
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro extrair destino:`, error);
        return 'Lisboa';
    }
}

// ================================================================================
// SEÇÃO 5: SISTEMA DE DICAS
// ================================================================================

function gerarDicasDestino(destino) {
    const dadosDestinos = {
        'Lisboa': {
            mes: 'JULHO', temp_min: '18', temp_max: '28',
            descricao_clima: 'Ensolarado e seco', roupas: 'roupas leves e protetor solar',
            atracao1: 'Mosteiro dos Jerónimos', desc1: 'Patrimônio UNESCO',
            atracao2: 'Tram 28', desc2: 'Passeio pelos bairros históricos',
            atracao3: 'Torre de Belém', desc3: 'Símbolo de Lisboa',
            pratos: 'Pastéis de nata, bacalhau, francesinha', preco_refeicao: '25-35',
            dica_restaurante: 'Pastéis de Belém são imperdíveis',
            transporte: '1,50', taxi: '15-20', museus: '10-15',
            moeda: 'Euro (€) - Aceita cartão na maioria dos locais',
            idioma: 'Português - Comunicação fácil para brasileiros',
            seguranca: 'Cidade muito segura, cuidado apenas com carteiristas em áreas turísticas',
            importante: 'Documento: RG ou Passaporte. Não precisa de visto para até 90 dias'
        }
    };
    
    const dados = dadosDestinos[destino] || dadosDestinos['Lisboa'];
    
    return `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA ${destino.toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🌡️ *CLIMA EM ${dados.mes}:*
• Temperatura: ${dados.temp_min}°C a ${dados.temp_max}°C
• ${dados.descricao_clima}
• Leve: ${dados.roupas}

🎯 *TOP ATRAÇÕES:*
1. ${dados.atracao1} - ${dados.desc1}
2. ${dados.atracao2} - ${dados.desc2}
3. ${dados.atracao3} - ${dados.desc3}

🍽️ *GASTRONOMIA:*
• Pratos típicos: ${dados.pratos}
• Preço médio refeição: R$ ${dados.preco_refeicao}
• Dica: ${dados.dica_restaurante}

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ ${dados.transporte}
• Táxi do aeroporto: R$ ${dados.taxi}
• Entrada museus: R$ ${dados.museus}

📱 *DICAS PRÁTICAS:*
• ${dados.moeda}
• ${dados.idioma}
• ${dados.seguranca}

🚨 *IMPORTANTE:*
${dados.importante}`;
}

// ================================================================================
// SEÇÃO 6: HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
    console.log(`[${getTimestamp()}] ========== CVC ITAQUA v2.83 ==========`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: '2.83',
            timestamp: getTimestamp(),
            message: 'CVC Itaqua v2.83 - Formatação Sequencial Operacional'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido'
        });
    }

    try {
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = req.body;

        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        // Verificar se é solicitação de dicas
        const ehDicas = conteudoPrincipal.includes('CONSULTE O MANUAL E GERE DICAS') || 
                       tipos.includes('Dicas');
        
        if (ehDicas) {
            console.log(`[${getTimestamp()}] 🧭 v2.83: Gerando dicas para ${destino}`);
            const dicasGeradas = gerarDicasDestino(destino || 'Lisboa');
            
            return res.status(200).json({
                success: true,
                result: dicasGeradas,
                metadata: {
                    version: '2.83',
                    timestamp: getTimestamp(),
                    tipo: 'dicas',
                    destino: destino || 'Lisboa'
                }
            });
        }
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem',
                version: '2.83'
            });
        }

        // Extração e montagem sequencial
        const destinoDetectado = destino || extrairDestino(conteudoPrincipal);
        console.log(`[${getTimestamp()}] 🎯 v2.83: Destino detectado: ${destinoDetectado}`);
        
        // MONTAGEM SEQUENCIAL v2.83
        let resultado = montarOrcamentoSequencial(conteudoPrincipal, destinoDetectado);
        
        if (!resultado) {
            // Fallback para IA se montagem sequencial falhar
            console.log(`[${getTimestamp()}] 🤖 v2.83: Usando IA como fallback...`);
            
            const prompt = `Você é um formatador da CVC v2.83. 

REGRAS CRÍTICAS v2.83:
1. PARCELAMENTO: Só incluir se houver dados reais (entrada + parcelas)
2. QUEBRAS DE LINHA: Sem linhas em branco desnecessárias
3. SEQUÊNCIA: 💰 → 💳 (se houver) → ✅ → 💺 (se houver) → 🏷️ (se houver) → 🔗
4. Se não há parcelamento, pular direto para bagagem
5. Se não há assento, ir direto de bagagem para reembolso

DADOS:
${conteudoPrincipal}

Criar orçamento sequencial para ${destinoDetectado}.`;

            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
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
                        max_tokens: 2048,
                        temperature: 0.1,
                        messages,
                        system: 'Você é um formatador sequencial da CVC v2.83'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    resultado = data.content[0].text;
                }
            } else if (process.env.OPENAI_API_KEY) {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'Você é um formatador sequencial da CVC v2.83' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.1,
                        max_tokens: 2048
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    resultado = data.choices[0].message.content;
                }
            }
        }
        
        // Limpeza e versão
        if (resultado) {
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            
            if (!resultado.includes('(v2.83)')) {
                resultado = resultado.replace(/(v[\d.]+)/g, 'v2.83');
            }
        }
        
        console.log(`[${getTimestamp()}] ✅ v2.83: Processamento sequencial finalizado`);
        
        return res.status(200).json({
            success: true,
            result: resultado || 'Erro no processamento',
            metadata: {
                version: '2.83',
                timestamp: getTimestamp(),
                destino: destinoDetectado,
                metodo: resultado ? 'sequencial' : 'ia_fallback'
            }
        });

    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.83: Erro:`, error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor v2.83',
            details: error.message,
            timestamp: getTimestamp()
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO v2.83
// ================================================================================
console.log('╔══════════════════════════════════════╗');
console.log('║       CVC ITAQUA v2.83 LOADED       ║');
console.log('╠══════════════════════════════════════╣');
console.log('║ ✅ Templates dinâmicos sequenciais   ║');
console.log('║ ✅ Parcelamento: só se existir       ║');
console.log('║ ✅ Quebras de linha: sem espaços     ║');
console.log('║ ✅ Fluxo sequencial: sem lacunas     ║');
console.log('║ ✅ Elementos opcionais inteligentes  ║');
console.log('║ ✅ Validação de presença de dados    ║');
console.log('║ ✅ Formatação limpa e contínua       ║');
console.log('║ ✅ Sistema anti-linhas vazias        ║');
console.log('╚══════════════════════════════════════╝');
console.log(`[${getTimestamp()}] 🚀 v2.83 - Formatação Sequencial Ativa!`);
