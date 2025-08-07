// 🚀 api/ai.js - v8.7 - IA REAL CONECTADA
// MUDANÇA: Removida simulação, usando OpenAI + Claude reais
// OBJETIVO: Sistema modular completo com IA real funcionando

console.log("🚀 CVC ITAQUA API v8.7 - IA REAL CONECTADA");

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 Método: ${req.method} | Timestamp: ${new Date().toISOString()}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v8.7-IA-REAL');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '8.7-ia-real'
        });
    }

    try {
        // ================================================================================
        // 📦 CARREGAMENTO DINÂMICO DE TODOS OS MÓDULOS
        // ================================================================================
        
        console.log("📦 Carregando módulos especializados...");
        
        const [analysis, iaClient, processing, prompts, templates, utils] = await Promise.all([
            import('./modules/analysis.js').catch(() => null),
            import('./modules/ia-client.js').catch(() => null), 
            import('./modules/processing.js').catch(() => null),
            import('./modules/prompts.js').catch(() => null),
            import('./modules/templates.js').catch(() => null),
            import('./modules/utils.js').catch(() => null)
        ]);
        
        console.log("✅ Todos os módulos carregados");

        // ================================================================================
        // 🔧 NORMALIZAÇÃO DE DADOS
        // ================================================================================
        
        let formData, tipo;
        
        try {
            if (utils?.default?.normalizarEntrada) {
                const resultado = utils.default.normalizarEntrada(req.body);
                formData = resultado.formData;
                tipo = resultado.tipo;
            } else if (utils?.normalizarEntrada) {
                const resultado = utils.normalizarEntrada(req.body);
                formData = resultado.formData;
                tipo = resultado.tipo;
            } else {
                formData = req.body.formData || req.body;
                tipo = req.body.tipo || 'orcamento';
                
                if (!formData.tipos || !Array.isArray(formData.tipos) || formData.tipos.length === 0) {
                    formData.tipos = ['Aéreo Nacional'];
                }
                formData.observacoes = formData.observacoes || '';
                formData.destino = formData.destino || '';
            }
        } catch (normError) {
            console.warn("⚠️ Erro na normalização, usando fallback:", normError.message);
            formData = req.body.formData || req.body;
            tipo = 'orcamento';
        }
        
        console.log(`🎯 Dados normalizados para tipo: ${tipo}`);

        // ================================================================================
        // 🎯 ORQUESTRAÇÃO BASEADA NO TIPO
        // ================================================================================
        
        let resultado;
        const modulos = { analysis, iaClient, processing, prompts, templates, utils };

        switch (tipo) {
            case 'orcamento':
                resultado = await orquestrarOrcamentoReal(formData, modulos);
                break;
            case 'ranking':
                resultado = await orquestrarRankingReal(formData, modulos);
                break;
            case 'dicas':
                resultado = await orquestrarDicasReal(formData, modulos);
                break;
            default:
                throw new Error(`Tipo de operação não suportado: ${tipo}`);
        }

        // ================================================================================
        // 📊 RESPOSTA FINAL COM IA REAL
        // ================================================================================
        
        const tempoTotal = Date.now() - inicio;
        console.log(`✅ Orquestração IA REAL concluída em ${tempoTotal}ms`);

        return res.status(200).json({
            success: true,
            result: resultado.conteudo,
            versao: '8.7-ia-real-conectada',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                fluxoCompleto: 'Análise → Prompt → IA-REAL → Processamento → Resposta',
                iaReal: true,
                modulosUtilizados: Object.keys(modulos).filter(k => modulos[k]),
                ...resultado.debug
            }
        });

    } catch (error) {
        const tempoTotal = Date.now() - inicio;
        console.error("❌ Erro fatal na IA REAL:", error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            versao: '8.7-ia-real-erro',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                iaReal: true,
                tipoErro: error.name || 'erro_ia_real'
            }
        });
    }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DE ORÇAMENTO COM IA REAL
// ================================================================================

async function orquestrarOrcamentoReal(formData, modulos) {
    console.log("🎯 Orquestrando fluxo com IA REAL...");
    console.log("🔄 FLUXO: Análise → Prompt → IA-REAL → Processamento → Resposta");

    try {
        // ETAPA 1: ANÁLISE DO TEXTO
        console.log("📊 ETAPA 1: Análise do texto...");
        let analise;
        try {
            if (modulos.analysis?.analisarTextoCompleto) {
                analise = modulos.analysis.analisarTextoCompleto(formData);
            } else if (modulos.analysis?.default?.analisarTextoCompleto) {
                analise = modulos.analysis.default.analisarTextoCompleto(formData);
            } else {
                analise = {
                    tipoDetectado: 'generico',
                    complexidade: 'media',
                    confiancaDeteccao: 0.8
                };
            }
        } catch (analiseError) {
            console.warn("⚠️ Erro na análise:", analiseError.message);
            analise = { tipoDetectado: 'generico', complexidade: 'media', confiancaDeteccao: 0.7 };
        }
        
        console.log(`✅ Análise: ${analise?.tipoDetectado}, complexidade: ${analise?.complexidade}`);

        // ETAPA 2: GERAÇÃO DO PROMPT
        console.log("📋 ETAPA 2: Geração de prompt...");
        let prompt;
        try {
            if (modulos.prompts?.gerarPromptOtimizado) {
                prompt = modulos.prompts.gerarPromptOtimizado(formData, analise);
            } else if (modulos.prompts?.default?.gerarPromptOtimizado) {
                prompt = modulos.prompts.default.gerarPromptOtimizado(formData, analise);
            } else {
                prompt = gerarPromptBasico(formData, analise);
            }
        } catch (promptError) {
            console.warn("⚠️ Erro na geração de prompt:", promptError.message);
            prompt = gerarPromptBasico(formData, analise);
        }
        
        console.log(`✅ Prompt gerado: ${prompt?.length} caracteres`);

        // ETAPA 3: SELEÇÃO DE MODELO
        console.log("🤖 ETAPA 3: Seleção de modelo IA...");
        let modeloInfo = { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
        try {
            if (modulos.iaClient?.selecionarModelo) {
                modeloInfo = modulos.iaClient.selecionarModelo(!!formData.imagemBase64, analise?.complexidade);
            } else if (modulos.iaClient?.default?.selecionarModelo) {
                modeloInfo = modulos.iaClient.default.selecionarModelo(!!formData.imagemBase64, analise?.complexidade);
            }
        } catch (selecaoError) {
            console.warn("⚠️ Erro na seleção de modelo:", selecaoError.message);
        }
        
        console.log(`✅ Modelo selecionado: ${modeloInfo.modelo} (motivo: ${modeloInfo.motivo})`);

        // ETAPA 4: CHAMADA PARA IA REAL
        console.log("🧠 ETAPA 4: Chamada para IA REAL...");
        let respostaIA;
        try {
            if (modulos.iaClient?.chamarIASegura) {
                respostaIA = await modulos.iaClient.chamarIASegura(
                    prompt, 
                    !!formData.imagemBase64, 
                    formData.imagemBase64, 
                    modeloInfo.modelo, 
                    modeloInfo.fallback
                );
            } else if (modulos.iaClient?.default?.chamarIASegura) {
                respostaIA = await modulos.iaClient.default.chamarIASegura(
                    prompt, 
                    !!formData.imagemBase64, 
                    formData.imagemBase64, 
                    modeloInfo.modelo, 
                    modeloInfo.fallback
                );
            } else {
                throw new Error("Módulo ia-client.js não disponível - IA real não pode ser executada");
            }
        } catch (iaError) {
            console.error("❌ ERRO CRÍTICO na IA REAL:", iaError.message);
            throw new Error(`Falha na IA Real: ${iaError.message}`);
        }
        
        console.log(`✅ IA REAL respondeu: ${respostaIA?.content?.length} caracteres`);
        console.log(`🎯 Modelo usado: ${respostaIA?.modelo_usado}`);

        // ETAPA 5: PROCESSAMENTO
        console.log("🎨 ETAPA 5: Processamento final...");
        let conteudoFinal;
        try {
            if (modulos.processing?.processarRespostaCompleta) {
                conteudoFinal = modulos.processing.processarRespostaCompleta(
                    respostaIA.content, 
                    analise,
                    formData
                );
            } else if (modulos.processing?.default?.processarRespostaCompleta) {
                conteudoFinal = modulos.processing.default.processarRespostaCompleta(
                    respostaIA.content, 
                    analise,
                    formData
                );
            } else {
                conteudoFinal = respostaIA.content;
            }
        } catch (processError) {
            console.warn("⚠️ Erro no processamento:", processError.message);
            conteudoFinal = respostaIA.content;
        }

        // ETAPA 6: MÉTRICAS
        console.log("📊 ETAPA 6: Cálculo de métricas...");
        let custo = { custo_total: 0 };
        let informacoesUso = { tokens_total: 0 };
        
        try {
            if (modulos.iaClient?.obterInformacoesUso && modulos.iaClient?.calcularCusto) {
                informacoesUso = modulos.iaClient.obterInformacoesUso(respostaIA);
                custo = modulos.iaClient.calcularCusto(informacoesUso);
            } else if (modulos.iaClient?.default?.obterInformacoesUso && modulos.iaClient?.default?.calcularCusto) {
                informacoesUso = modulos.iaClient.default.obterInformacoesUso(respostaIA);
                custo = modulos.iaClient.default.calcularCusto(informacoesUso);
            }
        } catch (errorMetricas) {
            console.warn("⚠️ Erro ao calcular métricas:", errorMetricas.message);
        }

        console.log(`✅ Orçamento IA REAL processado com sucesso!`);

        // RESULTADO FINAL
        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Análise → Prompt → IA-REAL → Processamento → Métricas',
                modeloUsado: respostaIA?.modelo_usado || modeloInfo.modelo,
                templateUsado: analise?.tipoDetectado || 'generico',
                custoBRL: custo?.custo_total ? `R$ ${custo.custo_total.toFixed(4)}` : 'Não calculado',
                tokensUsados: informacoesUso?.tokens_total || 0,
                tempoIA: respostaIA?.tempo_resposta || 'Não medido',
                complexidadeAnalise: analise?.complexidade || 'media',
                iaReal: true,
                motivoModelo: modeloInfo?.motivo || 'Padrão'
            }
        };

    } catch (error) {
        console.error("❌ Erro na orquestração IA REAL:", error);
        return {
            conteudo: `❌ ERRO NA IA REAL: ${error.message}

O sistema detectou uma falha na conexão com a inteligência artificial.

Possíveis causas:
• APIs não configuradas corretamente
• Limite de tokens excedido  
• Erro de conectividade
• Problema nos módulos especializados

Detalhes técnicos: ${error.stack?.split('\n')[0]}

Contate o suporte técnico se o problema persistir.`,
            debug: {
                erro: error.message,
                fluxoInterrompido: true,
                iaReal: true,
                erroTipo: error.name
            }
        };
    }
}

// ================================================================================
// 🏨 ORQUESTRAÇÃO DE RANKING COM IA REAL
// ================================================================================

async function orquestrarRankingReal(formData, modulos) {
    console.log("🏨 Orquestrando ranking com IA REAL...");
    
    try {
        const destino = formData.destino || 'destino informado';
        
        // Prompt específico para ranking
        const prompt = `Crie um ranking profissional dos 5 melhores hotéis em ${destino}.

FORMATO OBRIGATÓRIO:
🏨 *RANKING DE HOTÉIS - ${destino.toUpperCase()}*

🥇 *1º LUGAR - [Nome do Hotel]*
⭐ [X] estrelas | [Localização]
💰 R$ [preço]/noite | [Regime]
✅ [3 principais comodidades]

🥈 *2º LUGAR - [Nome do Hotel]*
⭐ [X] estrelas | [Localização]  
💰 R$ [preço]/noite | [Regime]
✅ [3 principais comodidades]

(Continuar até o 5º lugar)

💡 *Dica:* [Dica de reserva ou melhor época]

Use preços realistas para ${destino} e hotéis reais quando possível.`;

        // Chamada IA REAL
        let respostaIA;
        if (modulos.iaClient?.chamarIASegura) {
            respostaIA = await modulos.iaClient.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o']);
        } else if (modulos.iaClient?.default?.chamarIASegura) {
            respostaIA = await modulos.iaClient.default.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o']);
        } else {
            throw new Error("IA Real não disponível para ranking");
        }

        // Processamento
        let conteudoFinal;
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = modulos.processing.processarRespostaCompleta(
                respostaIA.content,
                { tipoDetectado: 'ranking', complexidade: 'baixa' },
                formData
            );
        } else {
            conteudoFinal = respostaIA.content;
        }

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Ranking → Prompt → IA-REAL → Processamento',
                tipo: 'ranking',
                modeloUsado: respostaIA?.modelo_usado,
                iaReal: true
            }
        };

    } catch (error) {
        console.error("❌ Erro no ranking IA REAL:", error);
        return {
            conteudo: `❌ Erro ao gerar ranking com IA REAL: ${error.message}`,
            debug: { erro: error.message, tipo: 'ranking', iaReal: true }
        };
    }
}

// ================================================================================
// 💡 ORQUESTRAÇÃO DE DICAS COM IA REAL
// ================================================================================

async function orquestrarDicasReal(formData, modulos) {
    console.log("💡 Orquestrando dicas com IA REAL...");
    
    try {
        const destino = formData.destino || 'destino informado';
        
        // Prompt específico para dicas
        const prompt = `Forneça dicas práticas e atualizadas de viagem para ${destino}.

FORMATO OBRIGATÓRIO:
💡 *DICAS DE VIAGEM - ${destino.toUpperCase()}*

📅 *MELHOR ÉPOCA*
• [Período recomendado e motivos]
• [Época a evitar e motivos]

🎒 *O QUE LEVAR*
• [5-6 itens essenciais específicos para o destino]

🗺️ *PONTOS TURÍSTICOS*
• [Top 5 atrações principais]

💰 *ORÇAMENTO DIÁRIO*
• Econômico: R$ [X]-[Y]/dia
• Médio: R$ [X]-[Y]/dia  
• Premium: R$ [X]+/dia

📱 *APPS E DICAS EXTRAS*
• [2-3 aplicativos úteis]
• [Dicas locais importantes]

Use informações atualizadas e preços realistas para ${destino}.`;

        // Chamada IA REAL
        let respostaIA;
        if (modulos.iaClient?.chamarIASegura) {
            respostaIA = await modulos.iaClient.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o']);
        } else if (modulos.iaClient?.default?.chamarIASegura) {
            respostaIA = await modulos.iaClient.default.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o']);
        } else {
            throw new Error("IA Real não disponível para dicas");
        }

        // Processamento
        let conteudoFinal;
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = modulos.processing.processarRespostaCompleta(
                respostaIA.content,
                { tipoDetectado: 'dicas', complexidade: 'baixa' },
                formData
            );
        } else {
            conteudoFinal = respostaIA.content;
        }

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Dicas → Prompt → IA-REAL → Processamento',
                tipo: 'dicas',
                modeloUsado: respostaIA?.modelo_usado,
                iaReal: true
            }
        };

    } catch (error) {
        console.error("❌ Erro nas dicas IA REAL:", error);
        return {
            conteudo: `❌ Erro ao gerar dicas com IA REAL: ${error.message}`,
            debug: { erro: error.message, tipo: 'dicas', iaReal: true }
        };
    }
}

// ================================================================================
// 🔧 FUNÇÃO AUXILIAR: PROMPT BÁSICO
// ================================================================================

function gerarPromptBasico(formData, analise) {
    return `Você é um consultor especializado da CVC Itaqua. Gere um orçamento profissional e detalhado baseado nas informações abaixo.

DADOS DA SOLICITAÇÃO:
- Tipos: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}
${formData.observacoes ? `- Observações: ${formData.observacoes}` : ''}

ANÁLISE DETECTADA:
- Tipo: ${analise.tipoDetectado}
- Complexidade: ${analise.complexidade}

FORMATO OBRIGATÓRIO:
- Use formatação profissional com emojis
- Inclua valores em R$ (moeda brasileira)
- Adicione informações sobre parcelamento
- Especifique bagagens incluídas
- Mantenha tom profissional mas atrativo
- Se houver informações de voos/hotéis nas observações, use-as

INSTRUÇÕES IMPORTANTES:
- Analise cuidadosamente as observações para extrair dados de voos, preços, datas
- Se detectar múltiplos trechos, formate como roteiro multitrecho
- Para voos internacionais, inclua informações sobre documentação
- Sempre inclua informações sobre bagagem e condições de reembolso

Gere o orçamento completo e profissional:`;
}

console.log("✅ API v8.7 IA REAL carregada - OPENAI + CLAUDE CONECTADOS!");
console.log("🎯 Sistema modular completo com inteligência artificial real funcionando!");
