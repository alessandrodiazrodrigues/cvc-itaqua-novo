// 🚀 api/ai.js - v8.1 - ORQUESTRADOR COMPLETO E CORRIGIDO
// ARQUITETURA MODULAR: Este arquivo APENAS orquestra, NUNCA implementa
// Fluxo: Análise → Templates → Prompts → IA → Processamento → Resposta

console.log("🚀 CVC ITAQUA API v8.1 - ORQUESTRADOR MODULAR COMPLETO");

// ================================================================================
// 📦 FUNÇÃO PRINCIPAL DO HANDLER
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
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v8.1');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '8.1'
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
        
        const { formData, tipo } = utils.normalizarEntrada(req.body);
        
        console.log(`🎯 Tipo de operação: ${tipo}`);
        console.log(`📊 FormData normalizado:`, {
            tipos: formData.tipos?.length || 0,
            destino: formData.destino || 'não informado',
            temTextoColado: !!formData.textoColado,
            temImagem: !!formData.imagemBase64
        });

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
            case 'analise':
                resultado = await orquestrarAnalise(formData, modulos);
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
            versao: '8.1',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                fluxoCompleto: 'Análise → Prompt → IA → Processamento',
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
            versao: '8.1',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                tipoErro: error.name
            }
        });
    }
}

// ================================================================================
// 🎯 FUNÇÃO: ORQUESTRAR ORÇAMENTO COMPLETO
// ================================================================================

async function orquestrarOrcamento(formData, modulos) {
    console.log("🎯 === INICIANDO ORQUESTRAÇÃO DE ORÇAMENTO ===");
    
    try {
        // ETAPA 1: ANÁLISE DO TEXTO (analysis.js)
        console.log("🔍 ETAPA 1: Análise inteligente do texto...");
        
        let analise;
        if (modulos.analysis?.analisarTextoCompleto) {
            analise = await modulos.analysis.analisarTextoCompleto(formData);
        } else if (modulos.analysis?.default?.analisarTextoCompleto) {
            analise = await modulos.analysis.default.analisarTextoCompleto(formData);
        } else {
            throw new Error("Módulo analysis.js não possui função analisarTextoCompleto");
        }
        
        console.log(`🔍 Análise concluída: Tipo=${analise.tipo_principal}, Complexidade=${analise.complexidade}`);

        // ETAPA 2: APLICAR TEMPLATE ESPECÍFICO (templates.js)
        console.log("📋 ETAPA 2: Aplicando template específico...");
        
        let templateAplicado;
        if (modulos.templates?.aplicarTemplateCompleto) {
            templateAplicado = await modulos.templates.aplicarTemplateCompleto(formData, analise);
        } else if (modulos.templates?.default?.aplicarTemplateCompleto) {
            templateAplicado = await modulos.templates.default.aplicarTemplateCompleto(formData, analise);
        } else {
            throw new Error("Módulo templates.js não possui função aplicarTemplateCompleto");
        }
        
        console.log(`📋 Template aplicado: ${templateAplicado.length} caracteres`);

        // ETAPA 3: GERAR PROMPT OTIMIZADO (prompts.js)
        console.log("🎯 ETAPA 3: Gerando prompt otimizado...");
        
        let prompt;
        if (modulos.prompts?.gerarPromptOtimizado) {
            prompt = await modulos.prompts.gerarPromptOtimizado(formData, analise);
        } else if (modulos.prompts?.default?.gerarPromptOtimizado) {
            prompt = await modulos.prompts.default.gerarPromptOtimizado(formData, analise);
        } else {
            // Fallback para prompt básico se a função não existir
            prompt = templateAplicado;
        }
        
        console.log(`🎯 Prompt gerado: ${prompt.length} caracteres`);

        // ETAPA 4: CHAMAR IA (ia-client.js)
        console.log("🧠 ETAPA 4: Chamada para Inteligência Artificial...");
        
        // Determinar modelo baseado na complexidade
        const modeloInfo = determinarModelo(analise.complexidade);
        
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

        // ETAPA 5: PÓS-PROCESSAMENTO DA RESPOSTA (processing.js)
        console.log("🎨 ETAPA 5: Processamento final da resposta...");
        
        let conteudoFinal;
        if (modulos.processing?.processarRespostaCompleta) {
            conteudoFinal = await modulos.processing.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise, 
                formData
            );
        } else if (modulos.processing?.default?.processarRespostaCompleta) {
            conteudoFinal = await modulos.processing.default.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise, 
                formData
            );
        } else {
            conteudoFinal = respostaIA?.content || respostaIA?.conteudo || 'Conteúdo não processado';
        }
        
        console.log(`✅ Resposta final processada: ${conteudoFinal.length} caracteres`);

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
                fluxoExecutado: 'Análise → Template → Prompt → IA → Processamento',
                modeloUsado: respostaIA?.modelo_usado || modeloInfo.modelo,
                templateUsado: analise?.tipoDetectado || 'generico',
                custoBRL: custo?.custo_total ? `R$ ${custo.custo_total.toFixed(4)}` : 'N/A',
                tokensUsados: informacoesUso?.tokens_total || 0,
                complexidade: analise?.complexidade || 'média',
                confianca: `${((analise?.confianca_deteccao || 0) * 100).toFixed(1)}%`
            }
        };
        
    } catch (error) {
        console.error("❌ Erro na orquestração de orçamento:", error);
        throw error;
    }
}

// ================================================================================
// 🏨 FUNÇÃO: ORQUESTRAR RANKING DE HOTÉIS
// ================================================================================

async function orquestrarRanking(formData, modulos) {
    console.log("🏨 === INICIANDO ORQUESTRAÇÃO DE RANKING ===");
    
    try {
        // Usar destino do último orçamento se não informado
        const destino = formData.destino || 'destino não informado';
        
        // Criar prompt específico para ranking
        const promptRanking = `
🏨 RANKING DE HOTÉIS - ${destino.toUpperCase()}

Por favor, gere um ranking dos TOP 5 melhores hotéis em ${destino}.

Para cada hotel, inclua:
✨ Nome do Hotel
⭐ Classificação (estrelas)
📍 Localização específica
💰 Faixa de preço (diária média)
🎯 Diferenciais principais
📱 Contato (se disponível)

Formato o ranking de forma clara e profissional para envio via WhatsApp.
Use emojis para melhor visualização.
        `;

        // Chamar IA diretamente para ranking
        let respostaIA;
        if (modulos.iaClient?.chamarIASegura) {
            respostaIA = await modulos.iaClient.chamarIASegura(
                promptRanking,
                false,
                null,
                'gpt-4o-mini',
                true
            );
        } else if (modulos.iaClient?.default?.chamarIASegura) {
            respostaIA = await modulos.iaClient.default.chamarIASegura(
                promptRanking,
                false,
                null,
                'gpt-4o-mini',
                true
            );
        } else {
            throw new Error("Módulo ia-client não disponível");
        }

        // Processar resposta
        let conteudoFinal = respostaIA?.content || respostaIA?.conteudo || '';
        
        if (modulos.processing?.formatarParaWhatsApp) {
            conteudoFinal = modulos.processing.formatarParaWhatsApp(conteudoFinal);
        } else if (modulos.processing?.default?.formatarParaWhatsApp) {
            conteudoFinal = modulos.processing.default.formatarParaWhatsApp(conteudoFinal);
        }

        return {
            conteudo: conteudoFinal,
            debug: {
                tipo: 'ranking',
                destino: destino,
                modeloUsado: respostaIA?.modelo_usado || 'gpt-4o-mini'
            }
        };
        
    } catch (error) {
        console.error("❌ Erro na orquestração de ranking:", error);
        throw error;
    }
}

// ================================================================================
// 💡 FUNÇÃO: ORQUESTRAR DICAS DO DESTINO
// ================================================================================

async function orquestrarDicas(formData, modulos) {
    console.log("💡 === INICIANDO ORQUESTRAÇÃO DE DICAS ===");
    
    try {
        const destino = formData.destino || 'destino não informado';
        
        // Criar prompt específico para dicas
        const promptDicas = `
💡 DICAS IMPORTANTES - ${destino.toUpperCase()}

Por favor, forneça dicas práticas e úteis sobre ${destino}:

📍 COMO CHEGAR
- Principais aeroportos
- Melhores formas de transporte

🌡️ MELHOR ÉPOCA
- Clima por temporada
- Alta/baixa temporada

💰 CUSTOS MÉDIOS
- Alimentação
- Transporte local
- Atrações

🎯 IMPERDÍVEL
- Top 3 atrações
- Experiências únicas

⚠️ IMPORTANTE SABER
- Documentação necessária
- Vacinas recomendadas
- Dicas de segurança

📱 CONTATOS ÚTEIS

Formate as dicas de forma clara para WhatsApp, com emojis para facilitar a leitura.
        `;

        // Chamar IA
        let respostaIA;
        if (modulos.iaClient?.chamarIASegura) {
            respostaIA = await modulos.iaClient.chamarIASegura(
                promptDicas,
                false,
                null,
                'gpt-4o-mini',
                true
            );
        } else if (modulos.iaClient?.default?.chamarIASegura) {
            respostaIA = await modulos.iaClient.default.chamarIASegura(
                promptDicas,
                false,
                null,
                'gpt-4o-mini',
                true
            );
        } else {
            throw new Error("Módulo ia-client não disponível");
        }

        // Processar resposta
        let conteudoFinal = respostaIA?.content || respostaIA?.conteudo || '';
        
        if (modulos.processing?.formatarParaWhatsApp) {
            conteudoFinal = modulos.processing.formatarParaWhatsApp(conteudoFinal);
        } else if (modulos.processing?.default?.formatarParaWhatsApp) {
            conteudoFinal = modulos.processing.default.formatarParaWhatsApp(conteudoFinal);
        }

        return {
            conteudo: conteudoFinal,
            debug: {
                tipo: 'dicas',
                destino: destino,
                modeloUsado: respostaIA?.modelo_usado || 'gpt-4o-mini'
            }
        };
        
    } catch (error) {
        console.error("❌ Erro na orquestração de dicas:", error);
        throw error;
    }
}

// ================================================================================
// 📄 FUNÇÃO: ORQUESTRAR ANÁLISE DE PDF
// ================================================================================

async function orquestrarAnalise(formData, modulos) {
    console.log("📄 === INICIANDO ORQUESTRAÇÃO DE ANÁLISE DE PDF ===");
    
    try {
        const promptAnalise = `
📄 ANÁLISE DE DOCUMENTO

Por favor, analise o documento/imagem fornecido e extraia:

1. **TIPO DE DOCUMENTO**: Identifique o que é (orçamento, voucher, confirmação, etc.)

2. **INFORMAÇÕES PRINCIPAIS**:
   - Datas
   - Valores
   - Nomes/Empresas
   - Locais

3. **RESUMO**: Faça um resumo claro do conteúdo

4. **AÇÃO SUGERIDA**: O que fazer com este documento

Formate a análise de forma clara e profissional.
        `;

        // Chamar IA com imagem
        let respostaIA;
        if (modulos.iaClient?.chamarIASegura) {
            respostaIA = await modulos.iaClient.chamarIASegura(
                promptAnalise,
                true,
                formData.arquivo || formData.imagemBase64,
                'gpt-4o-mini',
                true
            );
        } else if (modulos.iaClient?.default?.chamarIASegura) {
            respostaIA = await modulos.iaClient.default.chamarIASegura(
                promptAnalise,
                true,
                formData.arquivo || formData.imagemBase64,
                'gpt-4o-mini',
                true
            );
        } else {
            throw new Error("Módulo ia-client não disponível");
        }

        // Processar resposta
        let conteudoFinal = respostaIA?.content || respostaIA?.conteudo || '';
        
        if (modulos.processing?.aplicarFormatacaoCompleta) {
            conteudoFinal = modulos.processing.aplicarFormatacaoCompleta(conteudoFinal);
        } else if (modulos.processing?.default?.aplicarFormatacaoCompleta) {
            conteudoFinal = modulos.processing.default.aplicarFormatacaoCompleta(conteudoFinal);
        }

        return {
            conteudo: conteudoFinal,
            debug: {
                tipo: 'analise',
                nomeArquivo: formData.nomeArquivo || 'documento',
                modeloUsado: respostaIA?.modelo_usado || 'gpt-4o-mini'
            }
        };
        
    } catch (error) {
        console.error("❌ Erro na orquestração de análise:", error);
        throw error;
    }
}

// ================================================================================
// 🎯 FUNÇÃO AUXILIAR: DETERMINAR MODELO
// ================================================================================

function determinarModelo(complexidade) {
    console.log(`🎯 Determinando modelo para complexidade: ${complexidade}`);
    
    const modelos = {
        'muito_alta': {
            modelo: 'gpt-4o',
            fallback: true,
            motivo: 'Complexidade muito alta requer modelo avançado'
        },
        'alta': {
            modelo: 'gpt-4o-mini',
            fallback: true,
            motivo: 'Complexidade alta usa modelo padrão otimizado'
        },
        'media': {
            modelo: 'gpt-4o-mini',
            fallback: true,
            motivo: 'Complexidade média usa modelo padrão'
        },
        'baixa': {
            modelo: 'gpt-4o-mini',
            fallback: true,
            motivo: 'Complexidade baixa usa modelo eficiente'
        }
    };
    
    const config = modelos[complexidade] || modelos['media'];
    console.log(`🎯 Modelo selecionado: ${config.modelo} (${config.motivo})`);
    
    return config;
}

// ================================================================================
// 🚀 LOG FINAL
// ================================================================================

console.log("✅ Orquestrador v8.1 carregado com sucesso!");
console.log("📋 Funções de orquestração disponíveis:");
console.log("  - orquestrarOrcamento: Fluxo completo de orçamento");
console.log("  - orquestrarRanking: Ranking de hotéis");
console.log("  - orquestrarDicas: Dicas do destino");
console.log("  - orquestrarAnalise: Análise de PDF/imagens");
console.log("🔧 Pronto para receber requisições!");
