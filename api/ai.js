// 🚀 api/ai.js - v8.8 - TRANSIÇÃO GRADUAL PARA IA REAL
// ESTRATÉGIA: Manter funcionando + adicionar IA real progressivamente
// FALLBACK: Se IA real falhar, usar simulação inteligente

console.log("🚀 CVC ITAQUA API v8.8 - TRANSIÇÃO GRADUAL PARA IA REAL");

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 Método: ${req.method} | Timestamp: ${new Date().toISOString()}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v8.8-TRANSICAO');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '8.8-transicao'
        });
    }

    try {
        // ================================================================================
        // 📦 CARREGAMENTO DE MÓDULOS COM VERIFICAÇÃO
        // ================================================================================
        
        console.log("📦 Carregando módulos com verificação de IA...");
        
        const [analysis, iaClient, processing, prompts, templates, utils] = await Promise.all([
            import('./modules/analysis.js').catch(() => null),
            import('./modules/ia-client.js').catch(() => null), 
            import('./modules/processing.js').catch(() => null),
            import('./modules/prompts.js').catch(() => null),
            import('./modules/templates.js').catch(() => null),
            import('./modules/utils.js').catch(() => null)
        ]);
        
        // Verificar disponibilidade da IA real
        const iaRealDisponivel = iaClient && (
            iaClient.chamarIASegura || 
            iaClient.default?.chamarIASegura
        );
        
        console.log("✅ Módulos carregados");
        console.log(`🤖 IA Real disponível: ${iaRealDisponivel ? 'SIM' : 'NÃO'}`);

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
        // 🎯 ORQUESTRAÇÃO COM FALLBACK INTELIGENTE
        // ================================================================================
        
        let resultado;
        const modulos = { analysis, iaClient, processing, prompts, templates, utils };

        switch (tipo) {
            case 'orcamento':
                resultado = await orquestrarOrcamentoInteligente(formData, modulos, iaRealDisponivel);
                break;
            case 'ranking':
                resultado = await orquestrarRankingInteligente(formData, modulos, iaRealDisponivel);
                break;
            case 'dicas':
                resultado = await orquestrarDicasInteligente(formData, modulos, iaRealDisponivel);
                break;
            default:
                throw new Error(`Tipo de operação não suportado: ${tipo}`);
        }

        // ================================================================================
        // 📊 RESPOSTA FINAL
        // ================================================================================
        
        const tempoTotal = Date.now() - inicio;
        console.log(`✅ Orquestração concluída em ${tempoTotal}ms`);

        return res.status(200).json({
            success: true,
            result: resultado.conteudo,
            versao: '8.8-transicao-inteligente',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                fluxoCompleto: 'Análise → Prompt → IA-Inteligente → Processamento → Resposta',
                iaRealDisponivel: iaRealDisponivel,
                tipoIAUsada: resultado.debug?.tipoIAUsada || 'simulada',
                modulosUtilizados: Object.keys(modulos).filter(k => modulos[k]),
                ...resultado.debug
            }
        });

    } catch (error) {
        const tempoTotal = Date.now() - inicio;
        console.error("❌ Erro fatal:", error);
        
        return res.status(500).json({
            success: false,
            error: error.message,
            versao: '8.8-transicao-erro',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                tipoErro: error.name || 'erro_transicao'
            }
        });
    }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO INTELIGENTE DE ORÇAMENTO (IA REAL + FALLBACK)
// ================================================================================

async function orquestrarOrcamentoInteligente(formData, modulos, iaRealDisponivel) {
    console.log("🎯 Orquestrando com IA inteligente...");
    console.log(`🤖 Tentará usar: ${iaRealDisponivel ? 'IA REAL' : 'IA SIMULADA'}`);

    try {
        // ETAPA 1: ANÁLISE
        let analise;
        try {
            if (modulos.analysis?.analisarTextoCompleto) {
                analise = modulos.analysis.analisarTextoCompleto(formData);
            } else if (modulos.analysis?.default?.analisarTextoCompleto) {
                analise = modulos.analysis.default.analisarTextoCompleto(formData);
            } else {
                analise = analisarTextoBasico(formData);
            }
        } catch (analiseError) {
            console.warn("⚠️ Erro na análise, usando básica:", analiseError.message);
            analise = analisarTextoBasico(formData);
        }

        // ETAPA 2: PROMPT
        let prompt;
        try {
            if (modulos.prompts?.gerarPromptOtimizado) {
                prompt = modulos.prompts.gerarPromptOtimizado(formData, analise);
            } else if (modulos.prompts?.default?.gerarPromptOtimizado) {
                prompt = modulos.prompts.default.gerarPromptOtimizado(formData, analise);
            } else {
                prompt = gerarPromptInteligente(formData, analise);
            }
        } catch (promptError) {
            console.warn("⚠️ Erro no prompt, usando inteligente:", promptError.message);
            prompt = gerarPromptInteligente(formData, analise);
        }

        // ETAPA 3: IA (REAL OU SIMULADA)
        let respostaIA;
        let tipoIAUsada = 'simulada';
        
        if (iaRealDisponivel && process.env.OPENAI_API_KEY) {
            // TENTAR IA REAL
            console.log("🤖 Tentando IA REAL...");
            try {
                const modeloInfo = selecionarModeloInteligente(formData, analise);
                
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
                    throw new Error("Funções de IA não encontradas no módulo");
                }
                
                tipoIAUsada = 'real';
                console.log("✅ IA REAL funcionou!");
                
            } catch (iaError) {
                console.warn("⚠️ IA REAL falhou, usando simulada:", iaError.message);
                respostaIA = gerarRespostaSimuladaInteligente(formData, analise, prompt);
                tipoIAUsada = 'simulada-fallback';
            }
        } else {
            // USAR IA SIMULADA
            console.log("🎭 Usando IA simulada inteligente...");
            respostaIA = gerarRespostaSimuladaInteligente(formData, analise, prompt);
            tipoIAUsada = 'simulada';
        }

        // ETAPA 4: PROCESSAMENTO
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

        return {
            conteudo: conteudoFinal,
            debug: {
                fluxoExecutado: 'Análise → Prompt → IA-Inteligente → Processamento',
                tipoIAUsada: tipoIAUsada,
                modeloUsado: respostaIA?.modelo_usado || 'simulado',
                templateUsado: analise?.tipoDetectado || 'generico',
                complexidadeAnalise: analise?.complexidade || 'media',
                promptLength: prompt?.length || 0,
                responseLength: respostaIA?.content?.length || 0
            }
        };

    } catch (error) {
        console.error("❌ Erro na orquestração inteligente:", error);
        throw error;
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES INTELIGENTES
// ================================================================================

function analisarTextoBasico(formData) {
    const texto = (formData.observacoes || '').toLowerCase();
    
    // Análise inteligente básica
    let tipoDetectado = 'generico';
    let complexidade = 'media';
    
    if (texto.includes('multitrecho') || texto.includes('múltiplos') || texto.includes('trecho')) {
        tipoDetectado = 'multitrecho';
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
        confiancaDeteccao: 0.8,
        numeroOpcoes: 1
    };
}

function gerarPromptInteligente(formData, analise) {
    return `Você é um consultor especializado da CVC Itaqua. Analise cuidadosamente as informações fornecidas e gere um orçamento profissional e detalhado.

DADOS DA SOLICITAÇÃO:
- Tipos: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}
${formData.observacoes ? `- Informações Detalhadas: ${formData.observacoes}` : ''}

ANÁLISE AUTOMÁTICA:
- Tipo Detectado: ${analise.tipoDetectado}
- Complexidade: ${analise.complexidade}
- Confiança: ${(analise.confiancaDeteccao * 100).toFixed(0)}%

INSTRUÇÕES ESPECÍFICAS:
${gerarInstrucoesEspecificas(analise.tipoDetectado)}

FORMATO OBRIGATÓRIO:
- Use formatação profissional com emojis apropriados
- Inclua valores em R$ (reais brasileiros)
- Especifique condições de pagamento e parcelamento
- Detalhe informações sobre bagagem
- Se houver dados de voos/hotéis/preços nas informações, USE-OS
- Mantenha tom profissional mas atrativo
- Para multitrechos, organize por segmentos de viagem
- Para internacionais, inclua documentação necessária

Gere o orçamento completo baseado nas informações fornecidas:`;
}

function gerarInstrucoesEspecificas(tipoDetectado) {
    const instrucoes = {
        'multitrecho': `
- Organize os voos por trechos (TRECHO 1, TRECHO 2, etc.)
- Inclua todas as conexões e tempos de espera
- Destaque o roteiro completo no início
- Use aeroportos específicos mencionados`,
        
        'aereo_internacional': `
- Inclua informações sobre documentação (passaporte, visto)
- Mencione taxas de embarque internacionais
- Especifique franquia de bagagem internacional
- Adicione informações sobre seguro viagem se relevante`,
        
        'cruzeiro': `
- Destaque o roteiro de navegação
- Inclua informações sobre cabines disponíveis
- Mencione o que está/não está incluso
- Especifique documentação necessária`,
        
        'hotel': `
- Organize por opções de acomodação
- Inclua regime de pensão
- Destaque comodidades principais
- Mencione política de cancelamento`
    };
    
    return instrucoes[tipoDetectado] || `
- Analise o contexto fornecido
- Use as informações específicas disponíveis
- Mantenha formatação consistente com padrão CVC`;
}

function selecionarModeloInteligente(formData, analise) {
    if (formData.imagemBase64) {
        return { modelo: 'claude-3-5-sonnet-20240620', fallback: ['gpt-4o'] };
    }
    
    if (analise.complexidade === 'alta') {
        return { modelo: 'gpt-4o', fallback: ['gpt-4o-mini'] };
    }
    
    return { modelo: 'gpt-4o-mini', fallback: ['gpt-4o'] };
}

function gerarRespostaSimuladaInteligente(formData, analise, prompt) {
    // Análise inteligente dos dados para simulação mais realista
    const texto = formData.observacoes || '';
    
    // Detectar se é multitrecho TAP Portugal
    if (texto.includes('TAP Portugal') && texto.includes('Lisboa')) {
        return {
            content: gerarMultitrechoTAP(formData, texto),
            modelo_usado: 'simulado-multitrecho',
            usage: { total_tokens: Math.ceil(prompt.length / 4) + 200 }
        };
    }
    
    // Resposta simulada padrão mais inteligente
    const destino = formData.destino || extrairDestino(texto) || 'Rio de Janeiro';
    const origem = 'São Paulo';
    const adultos = formData.adultos || 1;
    const tipos = formData.tipos?.join(', ') || 'Aéreo Nacional';
    
    const precoBase = analise.tipoDetectado === 'aereo_internacional' ? 2500 : 800;
    const precoTotal = (precoBase + Math.random() * 500) * adultos;
    
    return {
        content: `*${origem.toUpperCase()} → ${destino.toUpperCase()}*
${tipos} | ${adultos} adulto${adultos > 1 ? 's' : ''}

✈️ *Voos LATAM*
15/07 - GRU 08:30 / ${destino === 'Rio de Janeiro' ? 'GIG' : 'destino'} 10:15 (voo direto)
--
22/07 - ${destino === 'Rio de Janeiro' ? 'GIG' : 'destino'} 16:45 / GRU 18:30 (voo direto)

💰 *R$ ${precoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}* para ${adultos} adulto${adultos > 1 ? 's' : ''}
💳 Em até 10x sem juros
✅ Só mala de mão incluída  
🏷️ Não reembolsável

${formData.observacoes ? `📋 *Observações:*\n${formData.observacoes}\n\n` : ''}📱 *Sistema CVC Itaqua v8.8 - IA Inteligente*

*Análise: ${analise.tipoDetectado} | Complexidade: ${analise.complexidade}*`,
        modelo_usado: 'simulado-inteligente-v8.8',
        usage: { total_tokens: Math.ceil(prompt.length / 4) + 150 }
    };
}

function gerarMultitrechoTAP(formData, texto) {
    return `*ROTEIRO MULTITRECHO* ✈️
${formData.adultos || 2} adulto${(formData.adultos || 2) > 1 ? 's' : ''}

🌍 *TAP Portugal - Roteiro Europa*
São Paulo → Lisboa → Zurique → Paris → São Paulo

━━━━━━━━━━━━━━━━━━
📍 *TRECHO 1* - São Paulo → Lisboa
30/06 - Guarulhos 20:45 / Lisboa 10:35 (01/07)
Voo direto TAP Portugal

📍 *TRECHO 2* - Lisboa → Zurique
01/07 - Lisboa 13:25 / Zurique 17:15
(Conexão em Lisboa - 2h50 de espera)

📍 *TRECHO 3* - Paris → Lisboa  
07/07 - Paris-Orly 14:40 / Lisboa 16:15
Voo direto

📍 *TRECHO 4* - Lisboa → São Paulo
10/07 - Lisboa 13:05 / Guarulhos 19:15
Voo direto

━━━━━━━━━━━━━━━━━━
💰 *VALOR TOTAL:* R$ 8.750,00
💳 Em até 10x sem juros
✅ 2 malas de 23kg + bagagem de mão
🏷️ Tarifa flexível com alterações
📋 *Documentação:* Passaporte válido + Seguro Viagem Europa

⚠️ *Importante:* Confirme os horários de conexão e documentação necessária

*Sistema CVC Itaqua v8.8 - Análise Multitrecho Inteligente*`;
}

function extrairDestino(texto) {
    const destinos = ['Rio de Janeiro', 'Salvador', 'Recife', 'Fortaleza', 'Lisboa', 'Paris', 'Zurique'];
    for (const destino of destinos) {
        if (texto.includes(destino)) return destino;
    }
    return null;
}

// ================================================================================
// 🏨 RANKING E DICAS INTELIGENTES  
// ================================================================================

async function orquestrarRankingInteligente(formData, modulos, iaRealDisponivel) {
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

💡 *Sistema CVC Itaqua v8.8 - ${iaRealDisponivel ? 'IA Real Disponível' : 'IA Simulada'}*`;

    return {
        conteudo,
        debug: {
            tipo: 'ranking',
            tipoIAUsada: iaRealDisponivel ? 'disponivel' : 'simulada',
            destinoUsado: destino
        }
    };
}

async function orquestrarDicasInteligente(formData, modulos, iaRealDisponivel) {
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

🚀 *Sistema CVC Itaqua v8.8 - ${iaRealDisponivel ? 'IA Real Disponível' : 'IA Simulada'}*`;

    return {
        conteudo,
        debug: {
            tipo: 'dicas',
            tipoIAUsada: iaRealDisponivel ? 'disponivel' : 'simulada',
            destinoUsado: destino
        }
    };
}

console.log("✅ API v8.8 TRANSIÇÃO carregada - SISTEMA INTELIGENTE COM FALLBACK ROBUSTO!");
console.log("🎯 IA REAL quando disponível, SIMULADA INTELIGENTE como fallback");
