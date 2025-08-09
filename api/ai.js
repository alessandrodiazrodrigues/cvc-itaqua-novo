// 🎯 api/ai.js - ORQUESTRADOR PRINCIPAL v8.0 - COMPLETO
// Sistema CVC Itaqua - Geração de Orçamentos com IA
// CORRIGIDO: Parâmetro formData em processarRespostaCompleta

console.log("🎯 CVC ITAQUA API v8.0 - ORQUESTRADOR PRINCIPAL COMPLETO");

// ================================================================================
// 1️⃣ HANDLER PRINCIPAL - ENTRADA DE REQUISIÇÕES (api/ai.js)
// ================================================================================
export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 [ORQUESTRADOR] Iniciando | ${req.method} | ${new Date().toISOString()}`);

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-v8.0');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '8.0'
        });
    }

    try {
        // ================================================================================
        // 2️⃣ CARREGAMENTO DE MÓDULOS ESPECIALIZADOS (api/ai.js)
        // ================================================================================
        console.log("📦 [ORQUESTRADOR] Carregando módulos...");
        
        const [analysis, iaClient, processing, prompts, templates, utils] = await Promise.all([
            import('./modules/analysis.js'),
            import('./modules/ia-client.js'),
            import('./modules/processing.js'),
            import('./modules/prompts.js'),
            import('./modules/templates.js'),
            import('./modules/utils.js')
        ]);
        
        console.log("✅ [ORQUESTRADOR] Módulos carregados");

        // ================================================================================
        // 3️⃣ NORMALIZAÇÃO DE DADOS DE ENTRADA (api/ai.js)
        // ================================================================================
        let formData, tipo;
        
        // Tentar usar utils.normalizarEntrada
        if (utils.default?.normalizarEntrada) {
            ({ formData, tipo } = utils.default.normalizarEntrada(req.body));
        } else if (utils.normalizarEntrada) {
            ({ formData, tipo } = utils.normalizarEntrada(req.body));
        } else {
            // Fallback manual
            formData = req.body.formData || req.body;
            tipo = req.body.tipo || 'orcamento';
        }
        
        console.log(`🎯 [ORQUESTRADOR] Tipo: ${tipo} | Destino: ${formData.destino || 'auto'}`);

        // ================================================================================
        // 4️⃣ ROTEAMENTO POR TIPO DE OPERAÇÃO (api/ai.js)
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
            case 'pdf':
                // Carregar módulo PDF quando necessário
                const pdfProcessor = await import('./modules/pdf-processor.js');
                modulos.pdfProcessor = pdfProcessor;
                resultado = await orquestrarPDF(formData, modulos);
                break;
            default:
                throw new Error(`Tipo não suportado: ${tipo}`);
        }

        // ================================================================================
        // 5️⃣ RESPOSTA FINAL COM MÉTRICAS (api/ai.js)
        // ================================================================================
        const tempoTotal = Date.now() - inicio;
        console.log(`✅ [ORQUESTRADOR] Concluído em ${tempoTotal}ms`);

        return res.status(200).json({
            success: true,
            result: resultado.conteudo,
            versao: '8.0',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                tipoProcessado: tipo,
                modulosUsados: Object.keys(modulos).length,
                ...resultado.debug
            }
        });

    } catch (error) {
        const tempoTotal = Date.now() - inicio;
        console.error("❌ [ORQUESTRADOR] Erro fatal:", error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            versao: '8.0',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 3)
            }
        });
    }
}

// ================================================================================
// 6️⃣ ORQUESTRAÇÃO DE ORÇAMENTO PRINCIPAL (api/ai.js)
// ================================================================================
async function orquestrarOrcamento(formData, modulos) {
    console.log("🎯 [ORÇAMENTO] Iniciando orquestração completa...");

    try {
        // ETAPA 1: Análise do texto de entrada
        console.log("📊 [ORÇAMENTO] Etapa 1: Análise...");
        const analise = modulos.analysis.default?.analisarTextoCompleto
            ? modulos.analysis.default.analisarTextoCompleto(formData)
            : modulos.analysis.analisarTextoCompleto(formData);
        
        console.log(`✅ [ORÇAMENTO] Tipo detectado: ${analise?.tipoDetectado || 'generico'}`);

        // ETAPA 2: Aplicação de template
        console.log("📋 [ORÇAMENTO] Etapa 2: Template...");
        const template = modulos.templates.default?.aplicarTemplateCompleto
            ? modulos.templates.default.aplicarTemplateCompleto(formData, analise)
            : modulos.templates.aplicarTemplateCompleto(formData, analise);
        
        // Se template já resolver (múltiplas opções detectadas), retornar direto
        if (template && !template.includes('[PROCESSAR_IA]')) {
            console.log("✅ [ORÇAMENTO] Template resolveu localmente");
            return {
                conteudo: template,
                debug: {
                    metodo: 'template_direto',
                    tipoDetectado: analise?.tipoDetectado
                }
            };
        }

        // ETAPA 3: Geração de prompt para IA
        console.log("💬 [ORÇAMENTO] Etapa 3: Prompt...");
        const prompt = modulos.prompts.default?.gerarPromptOtimizado
            ? modulos.prompts.default.gerarPromptOtimizado(formData, analise)
            : modulos.prompts.gerarPromptOtimizado
            ? modulos.prompts.gerarPromptOtimizado(formData, analise)
            : gerarPromptFallback(formData, template);

        // ETAPA 4: Chamada para IA
        console.log("🤖 [ORÇAMENTO] Etapa 4: Chamando IA (GPT-4o-mini prioritário)...");
        const respostaIA = await chamarIA(modulos.iaClient, {
            prompt,
            temImagem: !!formData.imagemBase64,
            imagemBase64: formData.imagemBase64,
            modelo: 'gpt-4o-mini',  // SEMPRE priorizar mini (custo)
            fallback: ['gpt-4o']     // Fallback só se necessário
        });

        // ETAPA 5: Processamento final - CORREÇÃO CRÍTICA: 3 PARÂMETROS
        console.log("🔧 [ORÇAMENTO] Etapa 5: Processamento final...");
        const conteudoFinal = await processarResposta(
            modulos.processing,
            respostaIA?.content || template || '',
            analise,
            formData  // ✅ CORREÇÃO: 3º parâmetro adicionado
        );

        return {
            conteudo: conteudoFinal,
            debug: {
                tipoDetectado: analise?.tipoDetectado,
                modeloUsado: 'gpt-4o-mini',
                metodo: 'ia_completo',
                promptLength: prompt?.length,
                respostaLength: respostaIA?.content?.length
            }
        };

    } catch (error) {
        console.error("❌ [ORÇAMENTO] Erro:", error);
        throw new Error(`Falha no orçamento: ${error.message}`);
    }
}

// ================================================================================
// 7️⃣ ORQUESTRAÇÃO DE RANKING DE HOTÉIS (api/ai.js)
// ================================================================================
async function orquestrarRanking(formData, modulos) {
    console.log("🏨 [RANKING] Gerando ranking de hotéis...");
    
    try {
        const destino = formData.destino || 'destino solicitado';
        
        // Tentar usar template estático primeiro
        if (modulos.templates.default?.gerarRankingHoteis || modulos.templates.gerarRankingHoteis) {
            const funcao = modulos.templates.default?.gerarRankingHoteis || modulos.templates.gerarRankingHoteis;
            return {
                conteudo: funcao(destino),
                debug: { metodo: 'template_estatico', destino }
            };
        }
        
        // Fallback: usar IA
        const prompt = `Crie um ranking dos 5 melhores hotéis em ${destino} com estrelas e breve descrição. Formato WhatsApp com emojis.`;
        const respostaIA = await chamarIA(modulos.iaClient, {
            prompt,
            modelo: 'gpt-4o-mini',
            fallback: ['gpt-4o']
        });
        
        const conteudoFinal = await processarResposta(
            modulos.processing,
            respostaIA?.content || '',
            { tipoDetectado: 'ranking' },
            formData
        );
        
        return {
            conteudo: conteudoFinal,
            debug: { metodo: 'ia_generativa', destino }
        };
        
    } catch (error) {
        console.error("❌ [RANKING] Erro:", error);
        throw new Error(`Falha no ranking: ${error.message}`);
    }
}

// ================================================================================
// 8️⃣ ORQUESTRAÇÃO DE DICAS DE VIAGEM (api/ai.js)
// ================================================================================
async function orquestrarDicas(formData, modulos) {
    console.log("💡 [DICAS] Gerando dicas de viagem...");
    
    try {
        const destino = formData.destino || 'viagem';
        
        // Tentar usar template estático primeiro
        if (modulos.templates.default?.gerarDicasViagem || modulos.templates.gerarDicasViagem) {
            const funcao = modulos.templates.default?.gerarDicasViagem || modulos.templates.gerarDicasViagem;
            return {
                conteudo: funcao(destino),
                debug: { metodo: 'template_estatico', destino }
            };
        }
        
        // Fallback: usar IA
        const prompt = `Crie 5 dicas essenciais para viagem a ${destino}. Formato WhatsApp com emojis.`;
        const respostaIA = await chamarIA(modulos.iaClient, {
            prompt,
            modelo: 'gpt-4o-mini',
            fallback: ['gpt-4o']
        });
        
        const conteudoFinal = await processarResposta(
            modulos.processing,
            respostaIA?.content || '',
            { tipoDetectado: 'dicas' },
            formData
        );
        
        return {
            conteudo: conteudoFinal,
            debug: { metodo: 'ia_generativa', destino }
        };
        
    } catch (error) {
        console.error("❌ [DICAS] Erro:", error);
        throw new Error(`Falha nas dicas: ${error.message}`);
    }
}

// ================================================================================
// 9️⃣ ORQUESTRAÇÃO DE PDF (api/ai.js)
// ================================================================================
async function orquestrarPDF(formData, modulos) {
    console.log("📄 [PDF] Processando arquivo PDF...");
    
    try {
        if (!formData.arquivoBase64 && !formData.pdfBase64) {
            throw new Error("Nenhum PDF fornecido");
        }
        
        const arquivoBase64 = formData.arquivoBase64 || formData.pdfBase64;
        const nomeArquivo = formData.nomeArquivo || 'documento.pdf';
        
        // Usar pdf-processor para extrair texto
        const resultadoPDF = await (modulos.pdfProcessor.default?.processarPDFCompleto || modulos.pdfProcessor.processarPDFCompleto)(
            arquivoBase64,
            nomeArquivo
        );
        
        // Criar formData com texto extraído
        const formDataComTexto = {
            ...formData,
            observacoes: resultadoPDF.textoFinal || resultadoPDF.texto || '',
            textoColado: resultadoPDF.textoFinal || resultadoPDF.texto || ''
        };
        
        // Processar como orçamento normal
        return await orquestrarOrcamento(formDataComTexto, modulos);
        
    } catch (error) {
        console.error("❌ [PDF] Erro:", error);
        throw new Error(`Falha no PDF: ${error.message}`);
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES (api/ai.js)
// ================================================================================

async function chamarIA(iaClient, opcoes) {
    try {
        const funcao = iaClient.default?.chamarIASegura || iaClient.chamarIASegura;
        if (!funcao) {
            throw new Error("Função chamarIASegura não encontrada no ia-client");
        }
        
        return await funcao(
            opcoes.prompt,
            opcoes.temImagem || false,
            opcoes.imagemBase64 || null,
            opcoes.modelo || 'gpt-4o-mini',
            opcoes.fallback || ['gpt-4o']
        );
    } catch (error) {
        console.error("❌ Erro ao chamar IA:", error);
        throw error;
    }
}

async function processarResposta(processing, conteudo, analise, formData) {
    try {
        const funcao = processing.default?.processarRespostaCompleta || processing.processarRespostaCompleta;
        if (!funcao) {
            console.warn("⚠️ Função processarRespostaCompleta não encontrada, retornando conteúdo bruto");
            return conteudo;
        }
        
        return await funcao(conteudo, analise, formData);
    } catch (error) {
        console.error("❌ Erro ao processar resposta:", error);
        return conteudo; // Retornar conteúdo sem processamento em caso de erro
    }
}

function gerarPromptFallback(formData, template) {
    const destino = formData.destino || 'destino';
    const passageiros = `${formData.adultos || 1} adulto(s)` + 
                       (formData.criancas ? ` + ${formData.criancas} criança(s)` : '');
    
    return `
SISTEMA CVC ITAQUA - GERAÇÃO DE ORÇAMENTO

Crie um orçamento de viagem formatado para WhatsApp com as seguintes informações:

DADOS DISPONÍVEIS:
- Destino: ${destino}
- Passageiros: ${passageiros}
- Observações: ${formData.observacoes || 'Não fornecidas'}
- Texto adicional: ${formData.textoColado || 'Não fornecido'}

TEMPLATE BASE:
${template || 'Use formato padrão CVC'}

REGRAS DE FORMATAÇÃO:
1. Use emojis apropriados (✈️ 🏨 💰 📅 👥)
2. Destaque com *negrito* informações importantes
3. Use separador -- entre ida e volta
4. Formato de data: DD/MM
5. Formato de horário: HH:MM
6. Formato de valor: R$ X.XXX,XX
7. Se houver múltiplas opções, use OPÇÃO 1, OPÇÃO 2, etc.

Retorne APENAS o orçamento formatado, sem explicações adicionais.
`;
}

// ================================================================================
// 🚀 EXPORTAÇÃO DO HANDLER (api/ai.js)
// ================================================================================

console.log("✅ API v8.0 - Orquestrador completo carregado");
console.log("📋 Funções disponíveis: orçamento, ranking, dicas, pdf");
console.log("🤖 IA padrão: GPT-4o-mini (economia)");
console.log("✅ Correção aplicada: 3 parâmetros em processarRespostaCompleta");
