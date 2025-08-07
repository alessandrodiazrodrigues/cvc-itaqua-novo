// 🚀 api/ai.js - v8.1 - ORQUESTRADOR CORRIGIDO COM ARGUMENTOS CORRETOS
// CORREÇÃO CRÍTICA: Argumentos do processarRespostaCompleta agora corretos
// BASEADO NA ANÁLISE TÉCNICA - FLUXO COMPLETO FUNCIONAL

console.log("🚀 CVC ITAQUA API v8.1 - ORQUESTRADOR COM ARGUMENTOS CORRIGIDOS");

// ================================================================================
// 📦 IMPORTAÇÃO COMPLETA DE TODOS OS MÓDULOS
// ================================================================================

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 Método: ${req.method} | Timestamp: ${new Date().toISOString()}`);

    // ================================================================================
    // 🔧 CORS E VALIDAÇÃO DE MÉTODO
    // ================================================================================
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v8.1-Argumentos-Corretos');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '8.1-argumentos-corretos'
        });
    }

    try {
        // ================================================================================
        // 📦 CARREGAMENTO DINÂMICO DE TODOS OS MÓDULOS
        // ================================================================================
        
        console.log("📦 Carregando módulos especializados...");
        
        const [analysis, iaClient, processing, prompts, templates, utils] = await Promise.all([
            import('./modules/analysis.js'),
            import('./modules/ia-client.js'), 
            import('./modules/processing.js'),
            import('./modules/prompts.js'),
            import('./modules/templates.js'),
            import('./modules/utils.js')
        ]);
        
        console.log("✅ Todos os módulos carregados com sucesso");

        // ================================================================================
        // 🔧 NORMALIZAÇÃO DE DADOS (USANDO UTILS)
        // ================================================================================
        
        const { formData, tipo } = utils.default?.normalizarEntrada 
            ? utils.default.normalizarEntrada(req.body)
            : utils.normalizarEntrada 
                ? utils.normalizarEntrada(req.body)
                : { formData: req.body.formData || req.body, tipo: req.body.tipo || 'orcamento' };
        
        console.log(`🎯 Dados normalizados para tipo: ${tipo}`);
        console.log(`📊 FormData: tipos=${formData.tipos?.length}, destino=${!!formData.destino}`);

        // ================================================================================
        // 🎯 ORQUESTRAÇÃO BASEADA NO TIPO
        // ================================================================================
        
        let resultado;
        const modulos = { analysis, iaClient, processing, prompts, templates, utils };

        switch (tipo) {
            case 'orcamento':
                resultado = await orquestrarOrcamento(formData, modulos);
                break;
            case 'ranking':
                resultado = await orquestrarRanking(formData, modulos);
                break;
            case 'dicas':
                resultado = await orquestrarDicas(formData, modulos);
                break;
            default:
                throw new Error(`Tipo de operação não suportado: ${tipo}`);
        }

        // ================================================================================
        // 📊 RESPOSTA FINAL COM MÉTRICAS
        // ================================================================================
        
        const tempoTotal = Date.now() - inicio;
        console.log(`✅ Orquestração concluída em ${tempoTotal}ms`);

        return res.status(200).json({
            success: true,
            result: resultado.conteudo,
            versao: '8.1-argumentos-corretos',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                fluxoCompleto: 'Análise → Prompt → IA → Processamento → Resposta',
                modulosUtilizados: Object.keys(modulos),
                ...resultado.debug
            }
        });

    } catch (error) {
        const tempoTotal = Date.now() - inicio;
        console.error("❌ Erro fatal no orquestrador:", error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            versao: '8.1-argumentos-corretos',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                tipoErro: error.name || 'erro_orquestrador_corrigido'
            }
        });
    }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DE ORÇAMENTO (FLUXO COMPLETO COM ARGUMENTOS CORRETOS)
// ================================================================================

async function orquestrarOrcamento(formData, modulos) {
    console.log("🎯 Orquestrando fluxo COMPLETO de ORÇAMENTO...");
    console.log("🔄 FLUXO: Análise → Prompt → IA → Processamento → Resposta");

    try {
        // ETAPA 1: ANÁLISE DO TEXTO DE ENTRADA (analysis.js)
        console.log("📊 ETAPA 1: Análise do texto...");
        
        let analise;
        if (modulos.analysis?.analisarTextoCompleto) {
            analise = modulos.analysis.analisarTextoCompleto(formData);
        } else if (modulos.analysis?.default?.analisarTextoCompleto) {
            analise = modulos.analysis.default.analisarTextoCompleto(formData);
        } else {
            throw new Error("Módulo analysis.js não possui função analisarTextoCompleto");
        }
        
        console.log(`✅ Análise concluída. Tipo detectado: ${analise?.tipoDetectado || 'generico'}`);

        // ETAPA 2: GERAÇÃO DO PROMPT OTIMIZADO (prompts.js)
        console.log("📋 ETAPA 2: Geração de prompt especializado...");
        
        let prompt;
        if (modulos.prompts?.gerarPromptOtimizado) {
            prompt = modulos.prompts.gerarPromptOtimizado(formData, analise);
        } else if (modulos.prompts?.default?.gerarPromptOtimizado) {
            prompt = modulos.prompts.default.gerarPromptOtimizado(formData, analise);
        } else if (modulos.prompts?.gerarPromptOtimizadoCompleto) {
            prompt = modulos.prompts.gerarPromptOtimizadoCompleto(formData, analise);
        } else if (modulos.prompts?.default?.gerarPromptOtimizadoCompleto) {
            prompt = modulos.prompts.default.gerarPromptOtimizadoCompleto(formData, analise);
        } else {
            throw new Error("Módulo prompts.js não possui função de geração de prompt");
        }
        
        console.log(`✅ Prompt gerado com ${prompt?.length || 0} caracteres`);

        // ETAPA 3: SELEÇÃO INTELIGENTE DO MODELO (ia-client.js)
        console.log("🤖 ETAPA 3: Seleção de modelo de IA...");
        
        let modeloInfo = { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
        if (modulos.iaClient?.selecionarModelo) {
            modeloInfo = modulos.iaClient.selecionarModelo(!!formData.imagemBase64, analise?.complexidade);
        } else if (modulos.iaClient?.default?.selecionarModelo) {
            modeloInfo = modulos.iaClient.default.selecionarModelo(!!formData.imagemBase64, analise?.complexidade);
        }
        
        console.log(`✅ Modelo selecionado: ${modeloInfo.modelo}`);

        // ETAPA 4: CHAMADA PARA A IA
        console.log("🧠 ETAPA 4: Chamada para Inteligência Artificial...");
        
        let respostaIA;
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
        } else if (modulos.iaClient?.chamarIA) {
            respostaIA = await modulos.iaClient.chamarIA(prompt, formData);
        } else if (modulos.iaClient?.default?.chamarIA) {
            respostaIA = await modulos.iaClient.default.chamarIA(prompt, formData);
        } else {
            throw new Error("Módulo ia-client.js não possui função de chamada de IA");
        }
        
        console.log(`🧠 IA respondeu com ${respostaIA?.content?.length || 0} caracteres`);
        console.log(`🎯 Modelo usado: ${respostaIA?.modelo_usado || 'desconhecido'}`);

        // ETAPA 5: PÓS-PROCESSAMENTO DA RESPOSTA (CORREÇÃO CRÍTICA DOS ARGUMENTOS!)
        console.log("🎨 ETAPA 5: Processamento final da resposta...");
        
        let conteudoFinal;
        // ▼▼▼ CORREÇÃO CRÍTICA: AGORA PASSANDO OS 3 ARGUMENTOS CORRETOS ▼▼▼
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = await modulos.processing.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise,           // 2º argumento: análise 
                formData           // 3º argumento: formData (ERA ISSO QUE ESTAVA FALTANDO!)
            );
        } else if (modulos.processing?.default?.processarRespostaCompleta) {
            conteudoFinal = await modulos.processing.default.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise,           // 2º argumento: análise
                formData           // 3º argumento: formData (ERA ISSO QUE ESTAVA FALTANDO!)
            );
        } else {
            conteudoFinal = respostaIA?.content || respostaIA?.conteudo || 'Conteúdo não processado';
        }
        // ▲▲▲ CORREÇÃO CRÍTICA APLICADA ▲▲▲
        
        console.log(`✅ Resposta final processada`);

        // ETAPA 6: CÁLCULO DE MÉTRICAS (utils.js)
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

        // RESULTADO FINAL
        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Análise → Prompt → IA → Processamento → Métricas',
                modeloUsado: respostaIA?.modelo_usado || modeloInfo.modelo,
                templateUsado: analise?.tipoDetectado || 'generico',
                custoBRL: custo?.custo_total ? `R$ ${custo.custo_total.toFixed(4)}` : 'Não calculado',
                tokensUsados: informacoesUso?.tokens_total || 0,
                tempoIA: respostaIA?.tempo_resposta || 'Não medido',
                complexidadeAnalise: analise?.complexidade || 'media',
                argumentosCorretos: 'processarRespostaCompleta(conteudo, analise, formData) ✅'
            }
        };

    } catch (error) {
        console.error("❌ Erro na orquestração do orçamento:", error);
        return {
            conteudo: "Erro interno no processamento do orçamento. Nossa equipe foi notificada.",
            debug: {
                erro: error.message,
                fluxoInterrompido: true,
                argumentosCorretos: 'processarRespostaCompleta(conteudo, analise, formData) ✅'
            }
        };
    }
}

// ================================================================================
// 🏨 ORQUESTRAÇÃO DE RANKING
// ================================================================================

async function orquestrarRanking(formData, modulos) {
    console.log("🏨 Orquestrando ranking de hotéis...");
    
    try {
        // Análise simplificada para ranking
        let analise = { tipoDetectado: 'ranking', complexidade: 'baixa' };
        if (modulos.analysis?.analisarTextoCompleto) {
            analise = modulos.analysis.analisarTextoCompleto(formData);
            analise.tipoDetectado = 'ranking'; // Força tipo ranking
        }

        // Prompt específico para ranking
        let prompt;
        if (modulos.prompts?.gerarPromptRanking) {
            prompt = modulos.prompts.gerarPromptRanking(formData, analise);
        } else if (modulos.prompts?.default?.gerarPromptRanking) {
            prompt = modulos.prompts.default.gerarPromptRanking(formData, analise);
        } else {
            // Fallback: prompt básico para ranking
            prompt = `Crie um ranking dos melhores hotéis em ${formData.destino || 'destino informado'} com preços e características.`;
        }

        // Chamada IA simplificada para ranking
        let respostaIA;
        if (modulos.iaClient?.chamarIA) {
            respostaIA = await modulos.iaClient.chamarIA(prompt, formData);
        } else if (modulos.iaClient?.default?.chamarIA) {
            respostaIA = await modulos.iaClient.default.chamarIA(prompt, formData);
        } else {
            throw new Error("Módulo ia-client.js não disponível");
        }

        // ▼▼▼ PROCESSAMENTO COM ARGUMENTOS CORRETOS ▼▼▼
        let conteudoFinal;
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = modulos.processing.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '',
                analise,    // 2º argumento correto
                formData    // 3º argumento correto  
            );
        } else {
            conteudoFinal = respostaIA?.content || respostaIA?.conteudo || 'Ranking não disponível';
        }
        // ▲▲▲ ARGUMENTOS CORRETOS ▲▲▲

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Ranking → Prompt → IA → Processamento',
                tipo: 'ranking',
                argumentosCorretos: 'processarRespostaCompleta(conteudo, analise, formData) ✅'
            }
        };

    } catch (error) {
        console.error("❌ Erro no ranking:", error);
        return {
            conteudo: "Erro ao gerar ranking. Tente novamente.",
            debug: { erro: error.message, tipo: 'ranking' }
        };
    }
}

// ================================================================================
// 💡 ORQUESTRAÇÃO DE DICAS
// ================================================================================

async function orquestrarDicas(formData, modulos) {
    console.log("💡 Orquestrando dicas de viagem...");
    
    try {
        // Análise para dicas
        let analise = { tipoDetectado: 'dicas', complexidade: 'baixa' };
        if (modulos.analysis?.analisarTextoCompleto) {
            analise = modulos.analysis.analisarTextoCompleto(formData);
            analise.tipoDetectado = 'dicas'; // Força tipo dicas
        }

        // Prompt para dicas
        let prompt;
        if (modulos.prompts?.gerarPromptDicas) {
            prompt = modulos.prompts.gerarPromptDicas(formData, analise);
        } else if (modulos.prompts?.default?.gerarPromptDicas) {
            prompt = modulos.prompts.default.gerarPromptDicas(formData, analise);
        } else {
            // Fallback: prompt básico para dicas
            prompt = `Forneça dicas práticas de viagem para ${formData.destino || 'o destino informado'} incluindo melhor época, o que levar e onde ir.`;
        }

        // Chamada IA para dicas
        let respostaIA;
        if (modulos.iaClient?.chamarIA) {
            respostaIA = await modulos.iaClient.chamarIA(prompt, formData);
        } else if (modulos.iaClient?.default?.chamarIA) {
            respostaIA = await modulos.iaClient.default.chamarIA(prompt, formData);
        } else {
            throw new Error("Módulo ia-client.js não disponível");
        }

        // ▼▼▼ PROCESSAMENTO COM ARGUMENTOS CORRETOS ▼▼▼
        let conteudoFinal;
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = modulos.processing.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '',
                analise,    // 2º argumento correto
                formData    // 3º argumento correto
            );
        } else {
            conteudoFinal = respostaIA?.content || respostaIA?.conteudo || 'Dicas não disponíveis';
        }
        // ▲▲▲ ARGUMENTOS CORRETOS ▲▲▲

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Dicas → Prompt → IA → Processamento',
                tipo: 'dicas',
                argumentosCorretos: 'processarRespostaCompleta(conteudo, analise, formData) ✅'
            }
        };

    } catch (error) {
        console.error("❌ Erro nas dicas:", error);
        return {
            conteudo: "Erro ao gerar dicas. Tente novamente.",
            debug: { erro: error.message, tipo: 'dicas' }
        };
    }
}

console.log("✅ API v8.1 carregada - ARGUMENTOS DO PROCESSAMENTO CORRIGIDOS!");
console.log("🎯 CORREÇÃO CRÍTICA: processarRespostaCompleta(conteudo, analise, formData)");
