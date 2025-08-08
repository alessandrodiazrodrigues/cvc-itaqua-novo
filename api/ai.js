// 🚀 api/ai.js - v8.1 - ORQUESTRADOR CORRIGIDO COM ÍNDICE E NUMERAÇÃO
// CORREÇÃO CRÍTICA: processarRespostaCompleta agora recebe 3 argumentos
// CORREÇÃO CRÍTICA: Compatibilidade ES6 completa
// ARQUITETURA: 100% modular - apenas orquestra, nunca implementa

console.log("🚀 CVC ITAQUA API v8.1 - ORQUESTRADOR CORRIGIDO COM ÍNDICE");

// ================================================================================
// 📋 ÍNDICE DE FUNÇÕES
// ================================================================================
/* 
1️⃣ handler()                     - Função principal da API
2️⃣ orquestrarOrcamento()         - Fluxo completo de orçamento (5 etapas)
3️⃣ orquestrarRanking()           - Fluxo de ranking de hotéis
4️⃣ orquestrarDicas()             - Fluxo de dicas de viagem
5️⃣ orquestrarAnalise()           - Fluxo de análise de PDF (NOVO)
6️⃣ configurarHeaders()           - CORS e headers de resposta
7️⃣ validarMetodo()               - Validação de método HTTP
8️⃣ carregarModulos()             - Carregamento dinâmico de módulos
9️⃣ gerarRespostaFinal()          - Resposta padronizada com métricas
🔟 tratarErroFatal()             - Tratamento de erros críticos
*/

// ================================================================================
// 📦 IMPORTAÇÃO COMPLETA DE TODOS OS MÓDULOS (ES6)
// ================================================================================

// ⚠️ IMPORTANTE: Todas as importações dinâmicas serão feitas dentro das funções
// para evitar problemas de compatibilidade ES6/CommonJS

// ================================================================================
// 1️⃣ FUNÇÃO PRINCIPAL DA API
// ================================================================================

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 [1] HANDLER INICIADO | Método: ${req.method} | ${new Date().toISOString()}`);

    try {
        // 5️⃣ Configurar headers e CORS
        configurarHeaders(res);
        
        // 6️⃣ Validar método HTTP
        const validacaoMetodo = validarMetodo(req, res);
        if (validacaoMetodo) return validacaoMetodo;

        // 7️⃣ Carregar todos os módulos especializados
        const modulos = await carregarModulos();
        
        // Normalizar entrada usando utils.js (CORREÇÃO CRÍTICA)
        console.log("🔧 [1] Normalizando dados de entrada...");
        const { formData, tipo } = modulos.utils.normalizarEntrada(req.body);
        
        console.log(`🎯 [1] Dados normalizados | Tipo: ${tipo} | Tipos: ${formData.tipos?.length}`);

        // Orquestrar baseado no tipo
        let resultado;
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

        // 8️⃣ Gerar resposta final com métricas
        return gerarRespostaFinal(res, resultado, inicio);

    } catch (error) {
        // 9️⃣ Tratar erro fatal
        return tratarErroFatal(res, error, inicio);
    }
}

// ================================================================================
// 2️⃣ ORQUESTRAÇÃO DE ORÇAMENTO (FLUXO COMPLETO EM 5 ETAPAS)
// ================================================================================

async function orquestrarOrcamento(formData, modulos) {
    console.log("🎯 [2] ORQUESTRANDO FLUXO COMPLETO DE ORÇAMENTO...");
    console.log("🔄 [2] FLUXO: Análise → Prompt → IA → Processamento → Métricas");

    try {
        // ETAPA 2.1: ANÁLISE DO TEXTO DE ENTRADA (analysis.js)
        console.log("📊 [2.1] ANÁLISE: Detectando tipo e complexidade...");
        
        const analise = modulos.analysis.analisarTextoCompleto 
            ? modulos.analysis.analisarTextoCompleto(formData)
            : modulos.analysis.default.analisarTextoCompleto(formData);
        
        console.log(`✅ [2.1] Análise concluída | Tipo: ${analise?.tipoDetectado || 'generico'}`);

        // ETAPA 2.2: GERAÇÃO DO PROMPT OTIMIZADO (prompts.js)
        console.log("📋 [2.2] PROMPT: Gerando prompt especializado...");
        
        const prompt = modulos.prompts.gerarPromptOtimizado 
            ? modulos.prompts.gerarPromptOtimizado(formData, analise)
            : modulos.prompts.default.gerarPromptOtimizado(formData, analise);
        
        console.log(`✅ [2.2] Prompt gerado | ${prompt?.length || 0} caracteres`);

        // ETAPA 2.3: SELEÇÃO INTELIGENTE DO MODELO (ia-client.js)
        console.log("🤖 [2.3] MODELO: Selecionando IA otimizada...");
        
        const modeloInfo = modulos.iaClient.selecionarModelo 
            ? modulos.iaClient.selecionarModelo(!!formData.imagemBase64, analise?.complexidade)
            : modulos.iaClient.default.selecionarModelo(!!formData.imagemBase64, analise?.complexidade);
        
        console.log(`✅ [2.3] Modelo selecionado: ${modeloInfo.modelo}`);

        // ETAPA 2.4: CHAMADA PARA A IA (ia-client.js)
        console.log("🧠 [2.4] IA: Executando chamada inteligente...");
        
        const respostaIA = modulos.iaClient.chamarIASegura 
            ? await modulos.iaClient.chamarIASegura(
                prompt, 
                !!formData.imagemBase64, 
                formData.imagemBase64, 
                modeloInfo.modelo, 
                modeloInfo.fallback
            )
            : await modulos.iaClient.default.chamarIASegura(
                prompt, 
                !!formData.imagemBase64, 
                formData.imagemBase64, 
                modeloInfo.modelo, 
                modeloInfo.fallback
            );
        
        console.log(`🧠 [2.4] IA respondeu | ${respostaIA?.content?.length || 0} caracteres`);

        // ETAPA 2.5: PÓS-PROCESSAMENTO FINAL (processing.js) - CORREÇÃO CRÍTICA!
        console.log("🎨 [2.5] PROCESSAMENTO: Formatação final...");
        
        const conteudoFinal = modulos.processing.processarRespostaCompleta 
            ? await modulos.processing.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise, 
                formData  // ← CORREÇÃO CRÍTICA: 3º ARGUMENTO ADICIONADO
            )
            : await modulos.processing.default.processarRespostaCompleta(
                respostaIA?.content || respostaIA?.conteudo || '', 
                analise, 
                formData  // ← CORREÇÃO CRÍTICA: 3º ARGUMENTO ADICIONADO
            );
        
        console.log(`✅ [2.5] Processamento concluído`);

        // ETAPA 2.6: CÁLCULO DE MÉTRICAS (ia-client.js)
        console.log("📊 [2.6] MÉTRICAS: Calculando custos...");
        
        let custo = { custo_total: 0 };
        let informacoesUso = { tokens_total: 0 };
        
        try {
            if (modulos.iaClient.obterInformacoesUso && modulos.iaClient.calcularCusto) {
                informacoesUso = modulos.iaClient.obterInformacoesUso(respostaIA);
                custo = modulos.iaClient.calcularCusto(informacoesUso);
            }
        } catch (errorMetricas) {
            console.warn("⚠️ [2.6] Erro ao calcular métricas:", errorMetricas.message);
        }

        // RESULTADO FINAL DO ORÇAMENTO
        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: '5 Etapas: Análise → Prompt → IA → Processamento → Métricas',
                modeloUsado: respostaIA?.modelo_usado || modeloInfo.modelo,
                templateUsado: analise?.tipoDetectado || 'generico',
                custoBRL: custo?.custo_total ? `R$ ${custo.custo_total.toFixed(4)}` : 'R$ 0,0000',
                tokensUsados: informacoesUso?.tokens_total || 0,
                etapas: {
                    analise: !!analise,
                    prompt: !!prompt,
                    ia: !!respostaIA,
                    processamento: !!conteudoFinal,
                    metricas: !!custo
                }
            }
        };

    } catch (error) {
        console.error("❌ [2] Erro na orquestração de orçamento:", error);
        throw new Error(`Falha na orquestração de orçamento: ${error.message}`);
    }
}

// ================================================================================
// 3️⃣ ORQUESTRAÇÃO DE RANKING DE HOTÉIS
// ================================================================================

async function orquestrarRanking(formData, modulos) {
    console.log("🏨 [3] ORQUESTRANDO RANKING DE HOTÉIS...");

    try {
        // Verificar se existe destino ou usar análise
        const destino = formData.destino || 'destino popular';
        console.log(`🏨 [3] Gerando ranking para: ${destino}`);

        // Usar análise simples para ranking
        const analise = { 
            tipoDetectado: 'ranking',
            complexidade: 'media',
            destino: destino
        };

        // Gerar prompt específico para ranking
        const prompt = modulos.prompts.gerarPromptRanking 
            ? modulos.prompts.gerarPromptRanking(destino, formData)
            : modulos.prompts.default.gerarPromptRanking 
            ? modulos.prompts.default.gerarPromptRanking(destino, formData)
            : `Crie um ranking detalhado dos 5 melhores hotéis em ${destino} com avaliações, preços e diferenciais.`;

        // Chamar IA com modelo otimizado
        const modeloInfo = { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
        
        const respostaIA = modulos.iaClient.chamarIASegura 
            ? await modulos.iaClient.chamarIASegura(prompt, false, null, modeloInfo.modelo, modeloInfo.fallback)
            : await modulos.iaClient.default.chamarIASegura(prompt, false, null, modeloInfo.modelo, modeloInfo.fallback);

        // Processar resposta - CORREÇÃO CRÍTICA: 3 ARGUMENTOS
        const conteudoFinal = modulos.processing.processarRespostaCompleta 
            ? await modulos.processing.processarRespostaCompleta(
                respostaIA?.content || '', 
                analise, 
                formData  // ← CORREÇÃO CRÍTICA: 3º ARGUMENTO
            )
            : await modulos.processing.default.processarRespostaCompleta(
                respostaIA?.content || '', 
                analise, 
                formData  // ← CORREÇÃO CRÍTICA: 3º ARGUMENTO
            );

        return { 
            conteudo: conteudoFinal, 
            debug: { 
                templateUsado: 'ranking_hoteis',
                destinoUsado: destino,
                metodo: 'prompts.gerarPromptRanking'
            } 
        };
        
    } catch (error) {
        console.error("❌ [3] Erro na orquestração de ranking:", error);
        throw new Error(`Falha na orquestração de ranking: ${error.message}`);
    }
}

// ================================================================================
// 4️⃣ ORQUESTRAÇÃO DE DICAS DE VIAGEM
// ================================================================================

async function orquestrarDicas(formData, modulos) {
    console.log("💡 [4] ORQUESTRANDO DICAS DE VIAGEM...");

    try {
        const destino = formData.destino || 'viagem geral';
        console.log(`💡 [4] Gerando dicas para: ${destino}`);

        // Verificar se templates tem dicas estáticas
        let conteudo;
        
        if (modulos.templates.gerarDicasViagem) {
            conteudo = modulos.templates.gerarDicasViagem(destino, formData);
            console.log("✅ [4] Usando template estático de dicas");
        } else if (modulos.templates.default?.gerarDicasViagem) {
            conteudo = modulos.templates.default.gerarDicasViagem(destino, formData);
            console.log("✅ [4] Usando template estático de dicas (default)");
        } else {
            // Fallback: usar IA para gerar dicas
            console.log("🤖 [4] Usando IA para gerar dicas...");
            
            const prompt = `Crie dicas essenciais de viagem para ${destino}, incluindo: 
            - Melhor época para visitar
            - Documentação necessária
            - Dicas de bagagem
            - Principais atrações
            - Gastronomia local
            - Dicas de segurança`;

            const respostaIA = modulos.iaClient.chamarIASegura 
                ? await modulos.iaClient.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o'])
                : await modulos.iaClient.default.chamarIASegura(prompt, false, null, 'gpt-4o-mini', ['gpt-4o']);

            conteudo = respostaIA?.content || 'Dicas de viagem indisponíveis';
        }

        return { 
            conteudo, 
            debug: { 
                templateUsado: 'dicas_estatico',
                destinoUsado: destino,
                metodo: 'templates.gerarDicasViagem'
            } 
        };
        
    } catch (error) {
        console.error("❌ [4] Erro na orquestração de dicas:", error);
        throw new Error(`Falha na orquestração de dicas: ${error.message}`);
    }
}

// ================================================================================
// 5️⃣ ORQUESTRAÇÃO DE ANÁLISE DE PDF (NOVO)
// ================================================================================

async function orquestrarAnalise(formData, modulos) {
    console.log("📄 [5] ORQUESTRANDO ANÁLISE DE PDF...");

    try {
        // Verificar se existe arquivo
        if (!formData.arquivo && !formData.arquivoBase64) {
            throw new Error("Nenhum arquivo PDF fornecido para análise");
        }

        const arquivoBase64 = formData.arquivo || formData.arquivoBase64;
        const nomeArquivo = formData.nomeArquivo || 'documento.pdf';
        
        console.log(`📄 [5] Processando arquivo: ${nomeArquivo}`);

        // ETAPA 5.1: Processar PDF usando módulo especializado
        console.log("📄 [5.1] PROCESSAMENTO: Extraindo e analisando PDF...");
        
        const resultadoPDF = modulos.pdfProcessor.processarPDFCompleto 
            ? await modulos.pdfProcessor.processarPDFCompleto(arquivoBase64, nomeArquivo)
            : await modulos.pdfProcessor.default.processarPDFCompleto(arquivoBase64, nomeArquivo);
        
        if (!resultadoPDF.sucesso) {
            throw new Error(`Falha no processamento do PDF: ${resultadoPDF.erro || 'Erro desconhecido'}`);
        }

        console.log(`✅ [5.1] PDF processado: tipo '${resultadoPDF.tipo}', ${resultadoPDF.conteudo.length} caracteres`);

        // ETAPA 5.2: Análise do conteúdo extraído (usando analysis.js)
        console.log("📄 [5.2] ANÁLISE: Analisando conteúdo extraído...");
        
        const formDataAnalise = {
            ...formData,
            textoColado: resultadoPDF.conteudo,
            tipos: [resultadoPDF.tipo === 'orcamento_viagem' ? 'Aéreo Nacional' : 'Dicas'],
            observacoes: `Análise de PDF: ${nomeArquivo}`
        };

        const analise = modulos.analysis.analisarTextoCompleto 
            ? modulos.analysis.analisarTextoCompleto(formDataAnalise)
            : modulos.analysis.default.analisarTextoCompleto(formDataAnalise);

        console.log(`✅ [5.2] Análise concluída: ${analise?.tipoDetectado || 'generico'}`);

        // ETAPA 5.3: Gerar prompt especializado para PDF
        console.log("📄 [5.3] PROMPT: Criando prompt para análise de PDF...");
        
        let prompt;
        if (modulos.prompts.gerarPromptAnalise) {
            prompt = modulos.prompts.gerarPromptAnalise(resultadoPDF, analise);
        } else if (modulos.prompts.default?.gerarPromptAnalise) {
            prompt = modulos.prompts.default.gerarPromptAnalise(resultadoPDF, analise);
        } else {
            // Fallback: prompt genérico para análise
            prompt = `Analise o seguinte documento PDF e organize as informações de forma clara e profissional:

TIPO DETECTADO: ${resultadoPDF.tipo}
ARQUIVO: ${nomeArquivo}
CONFIANÇA: ${(resultadoPDF.dados.confianca * 100).toFixed(1)}%

CONTEÚDO EXTRAÍDO:
${resultadoPDF.conteudo}

Por favor:
1. Identifique as principais informações
2. Organize de forma estruturada
3. Destaque valores, datas e detalhes importantes
4. Formate para apresentação profissional
5. Adicione observações relevantes sobre o documento`;
        }

        console.log(`✅ [5.3] Prompt gerado: ${prompt.length} caracteres`);

        // ETAPA 5.4: Chamar IA para análise inteligente
        console.log("📄 [5.4] IA: Processando análise inteligente...");
        
        const modeloInfo = { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
        
        const respostaIA = modulos.iaClient.chamarIASegura 
            ? await modulos.iaClient.chamarIASegura(prompt, false, null, modeloInfo.modelo, modeloInfo.fallback)
            : await modulos.iaClient.default.chamarIASegura(prompt, false, null, modeloInfo.modelo, modeloInfo.fallback);

        console.log(`📄 [5.4] IA respondeu: ${respostaIA?.content?.length || 0} caracteres`);

        // ETAPA 5.5: Processar resposta final
        console.log("📄 [5.5] PROCESSAMENTO: Formatando resposta final...");
        
        const conteudoFinal = modulos.processing.processarRespostaCompleta 
            ? await modulos.processing.processarRespostaCompleta(
                respostaIA?.content || resultadoPDF.conteudo, 
                analise, 
                formDataAnalise
            )
            : await modulos.processing.default.processarRespostaCompleta(
                respostaIA?.content || resultadoPDF.conteudo, 
                analise, 
                formDataAnalise
            );

        console.log(`✅ [5.5] Análise finalizada`);

        return { 
            conteudo: conteudoFinal, 
            debug: { 
                tipoArquivo: resultadoPDF.tipo,
                nomeArquivo: nomeArquivo,
                confiancaPDF: resultadoPDF.dados.confianca,
                metricasPDF: resultadoPDF.metricas,
                fallbackUsado: resultadoPDF.dados.fallback || false,
                metodo: 'pdf-processor.processarPDFCompleto',
                etapas: {
                    processamentoPDF: !!resultadoPDF,
                    analiseTexto: !!analise,
                    promptIA: !!prompt,
                    respostaIA: !!respostaIA,
                    processamentoFinal: !!conteudoFinal
                }
            } 
        };
        
    } catch (error) {
        console.error("❌ [5] Erro na orquestração de análise:", error);
        
        // Fallback: retornar análise básica
        const nomeArquivo = formData.nomeArquivo || 'documento.pdf';
        const conteudoFallback = `
📄 ANÁLISE DE DOCUMENTO PDF

📂 Arquivo: ${nomeArquivo}
⚠️ Status: Processamento com limitações

ERRO ENCONTRADO:
${error.message}

RECOMENDAÇÕES:
• Verifique se o arquivo PDF está válido
• Tente reduzir o tamanho do arquivo
• Para melhor análise, copie e cole o conteúdo em formato texto
• Entre em contato com o suporte se o problema persistir

PRÓXIMOS PASSOS:
1. Revisar o documento manualmente
2. Extrair informações principais
3. Inserir dados no formulário de orçamento
        `.trim();

        return { 
            conteudo: conteudoFallback,
            debug: { 
                erro: error.message,
                fallbackAplicado: true,
                nomeArquivo: nomeArquivo,
                metodo: 'orquestrarAnalise_fallback'
            } 
        };
    }
}

// ================================================================================
// 6️⃣ CONFIGURAR HEADERS E CORS
// ================================================================================

function configurarHeaders(res) {
    console.log("🔒 [5] Configurando headers CORS...");
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v8.1-Corrigido');
    res.setHeader('X-Architecture', 'Modular-ES6');
    
    console.log("✅ [5] Headers configurados");
}

// ================================================================================
// 6️⃣ VALIDAR MÉTODO HTTP
// ================================================================================

function validarMetodo(req, res) {
    console.log(`🔍 [6] Validando método: ${req.method}`);
    
    if (req.method === 'OPTIONS') {
        console.log("✅ [6] OPTIONS request - respondendo 200");
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        console.log(`❌ [6] Método ${req.method} não permitido`);
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido. Use POST.',
            versao: '8.1-corrigido'
        });
    }
    
    console.log("✅ [6] Método POST validado");
    return null; // Continuar processamento
}

// ================================================================================
// 7️⃣ CARREGAR MÓDULOS DINAMICAMENTE
// ================================================================================

async function carregarModulos() {
    console.log("📦 [7] Carregando módulos especializados...");
    
    try {
        const [analysis, iaClient, processing, prompts, templates, utils, pdfProcessor] = await Promise.all([
            import('./modules/analysis.js'),
            import('./modules/ia-client.js'), 
            import('./modules/processing.js'),
            import('./modules/prompts.js'),
            import('./modules/templates.js'),
            import('./modules/utils.js'),
            import('./modules/pdf-processor.js')
        ]);
        
        console.log("✅ [7] Todos os 7 módulos carregados com sucesso");
        
        // Retornar módulos organizados
        return { analysis, iaClient, processing, prompts, templates, utils, pdfProcessor };
        
    } catch (error) {
        console.error("❌ [7] Erro ao carregar módulos:", error);
        throw new Error(`Falha no carregamento de módulos: ${error.message}`);
    }
}

// ================================================================================
// 8️⃣ GERAR RESPOSTA FINAL COM MÉTRICAS
// ================================================================================

function gerarRespostaFinal(res, resultado, inicio) {
    const tempoTotal = Date.now() - inicio;
    console.log(`✅ [8] Orquestração concluída em ${tempoTotal}ms`);

    const resposta = {
        success: true,
        result: resultado.conteudo,
        versao: '8.1-corrigido-com-indices',
        timestamp: new Date().toISOString(),
        debug: {
            tempoProcessamento: `${tempoTotal}ms`,
            arquiteturaModular: '100% respeitada',
            funcaoCorrigida: 'processarRespostaCompleta agora recebe 3 argumentos',
            modulosCarregados: ['analysis', 'ia-client', 'processing', 'prompts', 'templates', 'utils'],
            ...resultado.debug
        }
    };

    return res.status(200).json(resposta);
}

// ================================================================================
// 9️⃣ TRATAR ERRO FATAL
// ================================================================================

function tratarErroFatal(res, error, inicio) {
    const tempoTotal = Date.now() - inicio;
    console.error("❌ [9] ERRO FATAL no orquestrador:", error);
    
    const resposta = {
        success: false,
        error: error.message,
        versao: '8.1-corrigido-com-indices',
        timestamp: new Date().toISOString(),
        debug: {
            tempoProcessamento: `${tempoTotal}ms`,
            errorStack: error.stack?.split('\n').slice(0, 4),
            tipoErro: 'erro_orquestrador_corrigido',
            correcaoAplicada: 'processarRespostaCompleta com 3 argumentos'
        }
    };

    return res.status(500).json(resposta);
}

// ================================================================================
// 🚀 LOGS E INICIALIZAÇÃO
// ================================================================================

console.log("🚀 CVC API v8.1 - ORQUESTRADOR CORRIGIDO INICIALIZADO");
console.log("✅ CORREÇÕES IMPLEMENTADAS:");
console.log("- 🔧 processarRespostaCompleta agora recebe 3 argumentos (formData)");
console.log("- 📦 Compatibilidade ES6 100% corrigida");
console.log("- 📋 Índice e numeração de funções implementado");
console.log("- 🔄 Fluxo completo: Análise → Prompt → IA → Processamento");
console.log("- 🏗️ Arquitetura modular 100% respeitada");
console.log("- 📊 Métricas e custos calculados");
console.log("- 🛡️ Fallbacks robustos em todas as etapas");
console.log("- 🎯 Todos os módulos especializados utilizados corretamente");
