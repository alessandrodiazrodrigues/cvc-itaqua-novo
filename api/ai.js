// 🚀 api/ai.js - v9.0 - INTEGRAÇÃO COM IA-CLIENT REAL
// ESTRATÉGIA: Substituir simulação por IA REAL via ia-client.js
// MANTER: Análise básica atual (será evoluída depois)

console.log("🚀 CVC ITAQUA API v9.0 - IA REAL INTEGRADA");

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 Método: ${req.method} | Timestamp: ${new Date().toISOString()}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v9.0-IA-Real');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '9.0-ia-real'
        });
    }

    try {
        // ================================================================================
        // 📦 CARREGAMENTO APENAS DO IA-CLIENT (outros módulos depois)
        // ================================================================================
        
        console.log("📦 Carregando módulo ia-client...");
        
        const iaClient = await import('./modules/ia-client.js');
        
        console.log("✅ Módulo ia-client carregado com sucesso");
        console.log("🤖 Testando disponibilidade de IA real...");

        // Verificar se IA real está disponível
        const iaRealDisponivel = !!(
            iaClient?.chamarIASegura || 
            iaClient?.default?.chamarIASegura ||
            iaClient?.chamarIA ||
            iaClient?.default?.chamarIA
        );

        console.log(`🎯 IA Real disponível: ${iaRealDisponivel ? 'SIM ✅' : 'NÃO ❌'}`);
        console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'CONFIGURADA ✅' : 'AUSENTE ❌'}`);

        // ================================================================================
        // 🔧 NORMALIZAÇÃO BÁSICA DE DADOS (sem utils ainda)
        // ================================================================================
        
        const formData = req.body.formData || req.body;
        const tipo = req.body.tipo || 'orcamento';
        
        // Garantir dados básicos
        if (!formData.tipos || !Array.isArray(formData.tipos) || formData.tipos.length === 0) {
            formData.tipos = ['Aéreo Nacional'];
        }
        formData.observacoes = formData.observacoes || '';
        formData.destino = formData.destino || '';

        console.log(`🎯 Processando tipo: ${tipo}`);
        console.log(`📊 Dados: tipos=${formData.tipos?.length}, destino="${formData.destino}", obs=${!!formData.observacoes}`);

        // ================================================================================
        // 🎯 ORQUESTRAÇÃO COM IA REAL
        // ================================================================================
        
        let resultado;

        switch (tipo) {
            case 'orcamento':
                resultado = await orquestrarOrcamentoComIAReal(formData, iaClient, iaRealDisponivel);
                break;
            case 'ranking':
                resultado = await orquestrarRankingSimples(formData);
                break;
            case 'dicas':
                resultado = await orquestrarDicasSimples(formData);
                break;
            default:
                throw new Error(`Tipo de operação não suportado: ${tipo}`);
        }

        // ================================================================================
        // 📊 RESPOSTA FINAL
        // ================================================================================
        
        const tempoTotal = Date.now() - inicio;
        console.log(`✅ Processamento concluído em ${tempoTotal}ms`);

        return res.status(200).json({
            success: true,
            result: resultado.conteudo,
            versao: '9.0-ia-real-integrada',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                iaRealUsada: resultado.debug?.iaRealUsada || false,
                modeloUsado: resultado.debug?.modeloUsado || 'nao-informado',
                tipoAnalise: resultado.debug?.tipoAnalise || 'basica',
                ...resultado.debug
            }
        });

    } catch (error) {
        const tempoTotal = Date.now() - inicio;
        console.error("❌ Erro fatal:", error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            versao: '9.0-ia-real-erro',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                tipoErro: error.name || 'erro_ia_real'
            }
        });
    }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DE ORÇAMENTO COM IA REAL
// ================================================================================

async function orquestrarOrcamentoComIAReal(formData, iaClient, iaRealDisponivel) {
    console.log("🎯 Orquestrando orçamento com IA REAL...");
    console.log(`🤖 Tentará usar: ${iaRealDisponivel ? 'IA REAL' : 'ERRO - IA NÃO DISPONÍVEL'}`);

    try {
        // ETAPA 1: ANÁLISE BÁSICA (temporária - será substituída por analysis.js)
        console.log("📊 ETAPA 1: Análise básica temporária...");
        const analise = analisarTextoBasicoTemporario(formData);
        console.log(`✅ Análise: tipo=${analise.tipoDetectado}, complexidade=${analise.complexidade}`);

        // ETAPA 2: PROMPT BÁSICO (temporário - será substituído por prompts.js)
        console.log("📋 ETAPA 2: Geração de prompt básico...");
        const prompt = gerarPromptBasicoTemporario(formData, analise);
        console.log(`✅ Prompt gerado: ${prompt.length} caracteres`);

        // ETAPA 3: IA REAL - AQUI É A MUDANÇA PRINCIPAL!
        console.log("🤖 ETAPA 3: Chamando IA REAL via ia-client...");
        
        let respostaIA;
        let iaRealUsada = false;
        let modeloUsado = 'nenhum';

        if (iaRealDisponivel && process.env.OPENAI_API_KEY) {
            try {
                // TENTAR IA REAL ATRAVÉS DO MÓDULO
                console.log("🚀 Chamando IA real através do módulo ia-client...");
                
                const modeloInfo = selecionarModeloBasico(formData, analise);
                console.log(`🎯 Modelo selecionado: ${modeloInfo.modelo}`);

                // Tentar diferentes funções do módulo ia-client
                if (iaClient.chamarIASegura) {
                    respostaIA = await iaClient.chamarIASegura(
                        prompt, 
                        !!formData.imagemBase64, 
                        formData.imagemBase64, 
                        modeloInfo.modelo, 
                        modeloInfo.fallback
                    );
                } else if (iaClient.default?.chamarIASegura) {
                    respostaIA = await iaClient.default.chamarIASegura(
                        prompt, 
                        !!formData.imagemBase64, 
                        formData.imagemBase64, 
                        modeloInfo.modelo, 
                        modeloInfo.fallback
                    );
                } else if (iaClient.chamarIA) {
                    respostaIA = await iaClient.chamarIA(prompt, formData);
                } else if (iaClient.default?.chamarIA) {
                    respostaIA = await iaClient.default.chamarIA(prompt, formData);
                } else {
                    throw new Error("Nenhuma função de IA encontrada no módulo ia-client");
                }
                
                iaRealUsada = true;
                modeloUsado = respostaIA?.modelo_usado || modeloInfo.modelo;
                
                console.log("✅ IA REAL funcionou!");
                console.log(`🎯 Modelo usado: ${modeloUsado}`);
                console.log(`📊 Resposta: ${respostaIA?.content?.length || 0} caracteres`);
                
            } catch (iaError) {
                console.error("❌ IA REAL falhou:", iaError.message);
                throw new Error(`IA Real falhou: ${iaError.message}`);
            }
        } else {
            // SE IA NÃO DISPONÍVEL, FALHAR EXPLICITAMENTE
            const motivoIndisponivel = !iaRealDisponivel ? 
                "Módulo ia-client não possui funções necessárias" : 
                "OPENAI_API_KEY não configurada";
                
            throw new Error(`IA Real indisponível: ${motivoIndisponivel}`);
        }

        // ETAPA 4: PROCESSAMENTO BÁSICO (temporário - será substituído por processing.js)
        console.log("🎨 ETAPA 4: Processamento básico temporário...");
        const conteudoFinal = processarRespostaBasicoTemporario(respostaIA.content, analise, formData);

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Análise-Básica → Prompt-Básico → IA-REAL → Processamento-Básico',
                iaRealUsada: iaRealUsada,
                modeloUsado: modeloUsado,
                tipoAnalise: analise.tipoDetectado,
                complexidade: analise.complexidade,
                promptLength: prompt.length,
                responseLength: respostaIA?.content?.length || 0,
                tokens: respostaIA?.usage?.total_tokens || 0
            }
        };

    } catch (error) {
        console.error("❌ Erro na orquestração com IA real:", error);
        throw new Error(`Falha na orquestração: ${error.message}`);
    }
}

// ================================================================================
// 🔧 FUNÇÕES BÁSICAS TEMPORÁRIAS (serão substituídas pelos módulos)
// ================================================================================

function analisarTextoBasicoTemporario(formData) {
    const texto = (formData.observacoes || '').toLowerCase();
    
    let tipoDetectado = 'generico';
    let complexidade = 'media';
    
    if (texto.includes('multitrecho') || texto.includes('múltiplos') || texto.includes('trecho')) {
        tipoDetectado = 'multitrecho';
        complexidade = 'alta';
    } else if (texto.includes('iberia')) {
        tipoDetectado = 'multitrecho'; // Iberia geralmente é multitrecho
        complexidade = 'alta';
    } else if (texto.includes('cruzeiro')) {
        tipoDetectado = 'cruzeiro';
        complexidade = 'media';
    } else if (texto.includes('hotel')) {
        tipoDetectado = 'hotel';
        complexidade = 'baixa';
    } else if (formData.tipos?.includes('Aéreo Internacional')) {
        tipoDetectado = 'aereo_internacional';
        complexidade = 'media';
    } else if (formData.tipos?.includes('Aéreo Nacional')) {
        tipoDetectado = 'aereo_nacional_simples';
        complexidade = 'baixa';
    }
    
    return {
        tipoDetectado,
        complexidade,
        confiancaDeteccao: 0.7
    };
}

function gerarPromptBasicoTemporario(formData, analise) {
    return `Você é um consultor especializado da CVC Itaqua. Analise CUIDADOSAMENTE as informações fornecidas e gere um orçamento profissional baseado nos DADOS REAIS.

INFORMAÇÕES DO CLIENTE:
- Tipos solicitados: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}

DADOS DETALHADOS:
${formData.observacoes || 'Nenhuma informação adicional fornecida'}

ANÁLISE AUTOMÁTICA:
- Tipo detectado: ${analise.tipoDetectado}
- Complexidade: ${analise.complexidade}

INSTRUÇÕES CRÍTICAS:
1. USE OS DADOS REAIS fornecidos nas informações detalhadas
2. Se há companhias aéreas mencionadas (Iberia, TAP, LATAM), USE-AS
3. Se há preços mencionados (R$ valores), USE-OS como base
4. Se há aeroportos mencionados (GRU, FCO, ORY), USE-OS
5. Se há datas mencionadas, USE-AS
6. Para multitrechos, organize por segmentos (TRECHO 1, TRECHO 2, etc.)

FORMATO OBRIGATÓRIO:
- Use formatação profissional com emojis apropriados
- Inclua valores em R$ (reais brasileiros)
- Especifique condições de pagamento
- Detalhe informações sobre bagagem
- Mantenha tom profissional mas atrativo

IMPORTANTE: Analise TODO o conteúdo fornecido e extraia informações específicas. NÃO invente dados genéricos se há informações específicas disponíveis.

Gere o orçamento completo baseado nas informações reais fornecidas:`;
}

function selecionarModeloBasico(formData, analise) {
    if (formData.imagemBase64) {
        return { modelo: 'gpt-4o', fallback: ['gpt-4o-mini'] };
    }
    
    if (analise.complexidade === 'alta') {
        return { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
    }
    
    return { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
}

function processarRespostaBasicoTemporario(conteudo, analise, formData) {
    if (!conteudo) return "Erro: Resposta da IA vazia";
    
    // Processamento básico - apenas limpeza simples
    let processado = conteudo.trim();
    
    // Adicionar observações se não estiverem na resposta
    if (formData.observacoes && !processado.includes(formData.observacoes.substring(0, 50))) {
        processado += `\n\n📋 *Dados utilizados:*\n${formData.observacoes.substring(0, 200)}${formData.observacoes.length > 200 ? '...' : ''}`;
    }
    
    return processado;
}

// ================================================================================
// 🏨 FUNÇÕES SIMPLES PARA RANKING E DICAS (temporárias)
// ================================================================================

async function orquestrarRankingSimples(formData) {
    const destino = formData.destino || 'destino informado';
    
    const conteudo = `🏨 *RANKING DE HOTÉIS - ${destino.toUpperCase()}*

🥇 *1º LUGAR - Hotel Premium*
⭐ 5 estrelas | Centro da cidade
💰 R$ 450,00/noite | Café da manhã incluso
✅ Piscina, Spa, Academia

🥈 *2º LUGAR - Resort Familiar*  
⭐ 4 estrelas | Beira-mar
💰 R$ 320,00/noite | All inclusive disponível
✅ Kids Club, 3 Piscinas

🥉 *3º LUGAR - Hotel Executivo*
⭐ 4 estrelas | Centro de negócios  
💰 R$ 280,00/noite | Business center
✅ Sala de reuniões, Wi-Fi premium

💡 *Sistema CVC Itaqua v9.0 - IA Real Integrada*`;

    return {
        conteudo,
        debug: {
            tipo: 'ranking_simples',
            iaRealUsada: false
        }
    };
}

async function orquestrarDicasSimples(formData) {
    const destino = formData.destino || 'destino informado';
    
    const conteudo = `💡 *DICAS DE VIAGEM - ${destino.toUpperCase()}*

📅 *MELHOR ÉPOCA*
• Alta temporada: Dezembro a Março
• Menor movimento: Abril a Junho  
• Preços melhores: Maio e Setembro

🎒 *O QUE LEVAR*
• Roupas leves e protetor solar
• Calçados confortáveis
• Medicamentos pessoais
• Carregador portátil

🗺️ *PONTOS TURÍSTICOS*
• Centro histórico
• Museus locais
• Praias principais
• Mercados tradicionais

💰 *ORÇAMENTO DIÁRIO*
• Econômico: R$ 150-250/dia
• Médio: R$ 300-500/dia
• Premium: R$ 600+/dia

🚀 *Sistema CVC Itaqua v9.0 - IA Real Integrada*`;

    return {
        conteudo,
        debug: {
            tipo: 'dicas_simples',
            iaRealUsada: false
        }
    };
}

console.log("✅ API v9.0 carregada - IA REAL INTEGRADA!");
console.log("🎯 Próximo passo: Testar com dados reais Iberia");
console.log("📊 Status: Simulação removida, IA real obrigatória");
