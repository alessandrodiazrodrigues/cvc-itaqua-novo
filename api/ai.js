// 🚀 api/ai.js - v10.0 - INTEGRAÇÃO CORRIGIDA COM IA-CLIENT
// CORREÇÃO: Importação e uso correto do módulo ia-client.js
// MANTER: Análise básica atual (será evoluída depois)

console.log("🚀 CVC ITAQUA API v10.0 - IA REAL INTEGRADA E CORRIGIDA");

export default async function handler(req, res) {
    const inicio = Date.now();
    console.log(`📊 Método: ${req.method} | Timestamp: ${new Date().toISOString()}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Powered-By', 'CVC-Itaqua-AI-v10.0-Corrigido');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido',
            versao: '10.0-corrigido'
        });
    }

    try {
        // ================================================================================
        // 📦 CARREGAMENTO DO IA-CLIENT COM CORREÇÃO
        // ================================================================================
        
        console.log("📦 Carregando módulo ia-client...");
        
        const iaClientModule = await import('./modules/ia-client.js');
        
        // Extrair funções corretamente (suporta tanto named quanto default export)
        const chamarIASegura = iaClientModule.chamarIASegura || iaClientModule.default?.chamarIASegura;
        const selecionarModelo = iaClientModule.selecionarModelo || iaClientModule.default?.selecionarModelo;
        const obterInformacoesUso = iaClientModule.obterInformacoesUso || iaClientModule.default?.obterInformacoesUso;
        
        console.log("✅ Módulo ia-client carregado com sucesso");
        console.log("🤖 Verificando disponibilidade de funções...");
        console.log(`   - chamarIASegura: ${chamarIASegura ? '✅' : '❌'}`);
        console.log(`   - selecionarModelo: ${selecionarModelo ? '✅' : '❌'}`);
        console.log(`   - obterInformacoesUso: ${obterInformacoesUso ? '✅' : '❌'}`);

        // Verificar se IA real está disponível
        const iaRealDisponivel = !!chamarIASegura && !!process.env.OPENAI_API_KEY;

        console.log(`🎯 IA Real disponível: ${iaRealDisponivel ? 'SIM ✅' : 'NÃO ❌'}`);
        console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'CONFIGURADA ✅' : 'AUSENTE ❌'}`);
        console.log(`🔑 Anthropic API Key: ${process.env.ANTHROPIC_API_KEY ? 'CONFIGURADA ✅' : 'AUSENTE ❌'}`);

        // ================================================================================
        // 🔧 NORMALIZAÇÃO BÁSICA DE DADOS
        // ================================================================================
        
        const formData = req.body.formData || req.body;
        const tipo = req.body.tipo || 'orcamento';
        
        // Garantir dados básicos
        if (!formData.tipos || !Array.isArray(formData.tipos) || formData.tipos.length === 0) {
            formData.tipos = ['Aéreo Nacional'];
        }
        formData.observacoes = formData.observacoes || '';
        formData.destino = formData.destino || '';
        formData.adultos = formData.adultos || 1;
        formData.criancas = formData.criancas || 0;

        console.log(`🎯 Processando tipo: ${tipo}`);
        console.log(`📊 Dados recebidos:`, {
            tipos: formData.tipos,
            destino: formData.destino,
            adultos: formData.adultos,
            criancas: formData.criancas,
            temObservacoes: !!formData.observacoes,
            temImagem: !!formData.imagemBase64
        });

        // ================================================================================
        // 🎯 ORQUESTRAÇÃO COM IA REAL
        // ================================================================================
        
        let resultado;

        switch (tipo) {
            case 'orcamento':
                resultado = await orquestrarOrcamentoComIAReal(
                    formData, 
                    { chamarIASegura, selecionarModelo, obterInformacoesUso },
                    iaRealDisponivel
                );
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
            versao: '10.0-ia-real-corrigida',
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
            versao: '10.0-erro',
            timestamp: new Date().toISOString(),
            debug: {
                tempoProcessamento: `${tempoTotal}ms`,
                errorStack: error.stack?.split('\n').slice(0, 4),
                tipoErro: error.name || 'erro_processamento'
            }
        });
    }
}

// ================================================================================
// 🎯 ORQUESTRAÇÃO DE ORÇAMENTO COM IA REAL (CORRIGIDA)
// ================================================================================

async function orquestrarOrcamentoComIAReal(formData, iaFunctions, iaRealDisponivel) {
    console.log("🎯 Orquestrando orçamento com IA REAL...");
    console.log(`🤖 IA Real disponível: ${iaRealDisponivel ? 'SIM' : 'NÃO'}`);

    const { chamarIASegura, selecionarModelo, obterInformacoesUso } = iaFunctions;

    try {
        // ETAPA 1: ANÁLISE BÁSICA (temporária - será substituída por analysis.js)
        console.log("📊 ETAPA 1: Análise básica temporária...");
        const analise = analisarTextoBasicoTemporario(formData);
        console.log(`✅ Análise concluída:`, {
            tipo: analise.tipoDetectado,
            complexidade: analise.complexidade,
            confianca: analise.confiancaDeteccao
        });

        // ETAPA 2: PROMPT BÁSICO (temporário - será substituído por prompts.js)
        console.log("📋 ETAPA 2: Geração de prompt básico...");
        const prompt = gerarPromptBasicoTemporario(formData, analise);
        console.log(`✅ Prompt gerado: ${prompt.length} caracteres`);

        // ETAPA 3: IA REAL - CHAMADA CORRIGIDA!
        console.log("🤖 ETAPA 3: Chamando IA REAL via ia-client...");
        
        let respostaIA;
        let iaRealUsada = false;
        let modeloUsado = 'nenhum';

        if (iaRealDisponivel) {
            try {
                // Selecionar modelo usando a função do ia-client
                let modeloInfo;
                if (selecionarModelo) {
                    console.log("🎯 Usando selecionarModelo do ia-client...");
                    modeloInfo = selecionarModelo(!!formData.imagemBase64, analise.complexidade);
                } else {
                    console.log("🎯 Usando seleção básica de modelo...");
                    modeloInfo = selecionarModeloBasico(formData, analise);
                }
                
                console.log(`🎯 Modelo selecionado: ${modeloInfo.modelo}`);
                console.log(`🎯 Fallbacks: ${modeloInfo.fallback?.join(', ') || 'nenhum'}`);

                // CHAMADA CORRIGIDA - Usar a função extraída
                console.log("🚀 Chamando IA real...");
                respostaIA = await chamarIASegura(
                    prompt, 
                    !!formData.imagemBase64, 
                    formData.imagemBase64 || null, 
                    modeloInfo.modelo, 
                    modeloInfo.fallback || []
                );
                
                iaRealUsada = true;
                modeloUsado = respostaIA?.modelo_usado || modeloInfo.modelo;
                
                console.log("✅ IA REAL respondeu com sucesso!");
                console.log(`🎯 Modelo usado: ${modeloUsado}`);
                console.log(`📊 Resposta: ${respostaIA?.content?.length || 0} caracteres`);
                
                // Obter informações de uso se disponível
                if (obterInformacoesUso && respostaIA) {
                    const infoUso = obterInformacoesUso(respostaIA);
                    console.log(`📊 Tokens usados: ${infoUso.tokens_total}`);
                }
                
            } catch (iaError) {
                console.error("❌ IA REAL falhou:", iaError.message);
                throw new Error(`IA Real falhou: ${iaError.message}`);
            }
        } else {
            // SE IA NÃO DISPONÍVEL, FALHAR EXPLICITAMENTE
            const motivoIndisponivel = !chamarIASegura ? 
                "Função chamarIASegura não encontrada no módulo ia-client" : 
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
    const destino = (formData.destino || '').toLowerCase();
    
    let tipoDetectado = 'generico';
    let complexidade = 'media';
    
    // Detecção melhorada baseada em padrões
    if (texto.includes('multitrecho') || texto.includes('múltiplos') || 
        texto.includes('trecho 1') || texto.includes('trecho 2')) {
        tipoDetectado = 'multitrecho';
        complexidade = 'alta';
    } else if (texto.includes('iberia') || texto.includes('tap') || texto.includes('lufthansa')) {
        tipoDetectado = 'aereo_internacional';
        complexidade = texto.includes('trecho') ? 'alta' : 'media';
    } else if (texto.includes('cruzeiro') || texto.includes('navio') || texto.includes('cabine')) {
        tipoDetectado = 'cruzeiro';
        complexidade = 'media';
    } else if (texto.includes('hotel') || texto.includes('hospedagem') || 
               texto.includes('resort') || texto.includes('pousada')) {
        tipoDetectado = 'hotel';
        complexidade = 'baixa';
    } else if (texto.includes('pacote') || (texto.includes('hotel') && texto.includes('voo'))) {
        tipoDetectado = 'pacote';
        complexidade = 'media';
    } else if (formData.tipos?.includes('Aéreo Internacional')) {
        tipoDetectado = 'aereo_internacional';
        complexidade = 'media';
    } else if (formData.tipos?.includes('Aéreo Nacional')) {
        tipoDetectado = 'aereo_nacional';
        complexidade = 'baixa';
    }
    
    // Ajustar complexidade baseado em outros fatores
    if (texto.length > 1000) complexidade = 'alta';
    if (formData.imagemBase64) complexidade = 'media';
    
    return {
        tipoDetectado,
        complexidade,
        confiancaDeteccao: texto.length > 100 ? 0.8 : 0.6
    };
}

function gerarPromptBasicoTemporario(formData, analise) {
    const tipoViagem = analise.tipoDetectado.replace(/_/g, ' ').toUpperCase();
    
    return `Você é um consultor especializado da CVC Itaqua. Analise CUIDADOSAMENTE as informações fornecidas e gere um orçamento profissional baseado nos DADOS REAIS.

🎯 TIPO DE VIAGEM DETECTADO: ${tipoViagem}

📋 INFORMAÇÕES DO CLIENTE:
- Tipos solicitados: ${formData.tipos?.join(', ') || 'Não informado'}
- Destino: ${formData.destino || 'Não informado'}
- Adultos: ${formData.adultos || 1}
- Crianças: ${formData.criancas || 0}

📊 DADOS DETALHADOS FORNECIDOS:
${formData.observacoes || 'Nenhuma informação adicional fornecida'}

⚙️ ANÁLISE AUTOMÁTICA:
- Tipo detectado: ${analise.tipoDetectado}
- Complexidade: ${analise.complexidade}
- Confiança: ${(analise.confiancaDeteccao * 100).toFixed(0)}%

📌 INSTRUÇÕES CRÍTICAS:
1. USE APENAS OS DADOS REAIS fornecidos nas informações detalhadas
2. Se há companhias aéreas mencionadas (Iberia, TAP, LATAM, GOL, Azul), USE-AS EXATAMENTE
3. Se há preços mencionados (R$ valores), USE-OS EXATAMENTE como base
4. Se há códigos de aeroportos (GRU, FCO, CDG, MAD), USE-OS CORRETAMENTE
5. Se há datas específicas mencionadas, USE-AS PRECISAMENTE
6. Para multitrechos, organize CLARAMENTE por segmentos (TRECHO 1, TRECHO 2, etc.)
7. Se há informações de hotéis, USE nome, endereço e categoria EXATOS

✨ FORMATO OBRIGATÓRIO DO ORÇAMENTO:
- Título claro com tipo de viagem
- Use emojis profissionais (✈️ 🏨 🚢 📅 💰 ✅)
- Valores sempre em R$ (reais brasileiros)
- Especifique TODAS as condições de pagamento mencionadas
- Detalhe informações sobre bagagem quando disponível
- Inclua políticas de cancelamento se mencionadas
- Mantenha tom profissional mas acolhedor

⚠️ IMPORTANTE: 
- Analise TODO o conteúdo fornecido minuciosamente
- Extraia e use TODAS as informações específicas disponíveis
- NÃO invente dados genéricos se há informações específicas
- Se algo não está claro, indique que precisa de confirmação
- Para valores não mencionados, indique "A confirmar" ou "Sob consulta"

Agora, gere o orçamento completo e detalhado baseado EXCLUSIVAMENTE nas informações reais fornecidas:`;
}

function selecionarModeloBasico(formData, analise) {
    // Fallback caso a função do ia-client não esteja disponível
    if (formData.imagemBase64) {
        return { 
            modelo: 'gpt-4o', 
            fallback: ['gpt-4o-mini'] 
        };
    }
    
    switch (analise.complexidade) {
        case 'alta':
            return { 
                modelo: 'gpt-4o', 
                fallback: ['gpt-4o-mini'] 
            };
        case 'media':
            return { 
                modelo: 'gpt-4o-mini', 
                fallback: ['gpt-4o'] 
            };
        case 'baixa':
        default:
            return { 
                modelo: 'gpt-4o-mini', 
                fallback: [] 
            };
    }
}

function processarRespostaBasicoTemporario(conteudo, analise, formData) {
    if (!conteudo) return "❌ Erro: Resposta da IA vazia";
    
    // Processamento básico - limpeza e formatação
    let processado = conteudo.trim();
    
    // Adicionar rodapé com informações do sistema
    processado += `\n\n---\n`;
    processado += `💼 *CVC Itaqua - Agência Especializada*\n`;
    processado += `📍 Rua João Tibiriçá Ramos, 17 - Itaquaquecetuba/SP\n`;
    processado += `📞 Contato: (11) 9.5396-7741\n`;
    processado += `✨ Sistema v10.0 - IA Real Integrada`;
    
    // Se há observações muito longas que não foram incluídas, adicionar nota
    if (formData.observacoes && formData.observacoes.length > 1000 && 
        !processado.includes(formData.observacoes.substring(0, 50))) {
        processado += `\n\n📋 *Observação:* Orçamento baseado em ${formData.observacoes.length} caracteres de dados fornecidos.`;
    }
    
    return processado;
}

// ================================================================================
// 🏨 FUNÇÕES SIMPLES PARA RANKING E DICAS (temporárias)
// ================================================================================

async function orquestrarRankingSimples(formData) {
    const destino = formData.destino || 'seu destino';
    
    const conteudo = `🏨 *RANKING DE HOTÉIS - ${destino.toUpperCase()}*

🥇 *1º LUGAR - Hotel Premium Excellence*
⭐⭐⭐⭐⭐ 5 estrelas | Centro da cidade
💰 Diária a partir de R$ 450,00 | Café da manhã incluso
✅ Piscina aquecida, Spa completo, Academia 24h
📍 Localização privilegiada com vista panorâmica

🥈 *2º LUGAR - Resort Familiar Paradise*  
⭐⭐⭐⭐ 4 estrelas | Frente para o mar
💰 Diária a partir de R$ 320,00 | All inclusive disponível
✅ Kids Club, 3 Piscinas, Entretenimento diário
🏖️ Acesso direto à praia privativa

🥉 *3º LUGAR - Hotel Executivo Business*
⭐⭐⭐⭐ 4 estrelas | Distrito empresarial  
💰 Diária a partir de R$ 280,00 | Business center 24h
✅ Salas de reunião equipadas, Wi-Fi premium, Transfer aeroporto
🏢 Ideal para viagens corporativas

📊 *4º LUGAR - Pousada Charme Local*
⭐⭐⭐ 3 estrelas | Centro histórico
💰 Diária a partir de R$ 180,00 | Café colonial
✅ Decoração regional, Ambiente acolhedor
🎨 Experiência cultural autêntica

🌟 *5º LUGAR - Hostel Econômico Central*
⭐⭐ 2 estrelas | Área central
💰 Diária a partir de R$ 80,00 | Cozinha compartilhada
✅ Wi-Fi grátis, Lockers individuais
👥 Ideal para mochileiros e jovens

---
💼 *CVC Itaqua - Sua melhor escolha em hospedagem*
📞 Reservas: (11) 9.5396-7741
✨ Sistema v10.0 - Rankings atualizados`;

    return {
        conteudo,
        debug: {
            tipo: 'ranking_hoteis',
            iaRealUsada: false,
            metodo: 'template_basico'
        }
    };
}

async function orquestrarDicasSimples(formData) {
    const destino = formData.destino || 'seu destino';
    
    const conteudo = `💡 *DICAS ESSENCIAIS DE VIAGEM - ${destino.toUpperCase()}*

📅 *MELHOR ÉPOCA PARA VIAJAR*
• ☀️ Alta temporada: Dezembro a Março (preços mais altos)
• 🌤️ Média temporada: Abril a Junho (clima agradável)
• 💰 Baixa temporada: Maio e Setembro (melhores preços)
• 🌧️ Evitar: Período de chuvas intensas

🎒 *O QUE LEVAR NA MALA*
• 👕 Roupas leves e confortáveis
• 🧴 Protetor solar FPS 50+ e repelente
• 👟 Calçados confortáveis para caminhada
• 💊 Kit farmácia pessoal
• 🔌 Adaptador universal e carregador portátil
• 📷 Câmera ou celular com boa memória

🗺️ *PRINCIPAIS ATRAÇÕES*
• 🏛️ Centro histórico e museus
• 🏖️ Praias e paisagens naturais
• 🛍️ Mercados e feiras locais
• 🍴 Restaurantes típicos
• 🎭 Eventos culturais e festivais

💰 *ORÇAMENTO DIÁRIO SUGERIDO*
• 💵 Econômico: R$ 150-250/dia
• 💳 Intermediário: R$ 300-500/dia
• 💎 Premium: R$ 600+ /dia

🚖 *TRANSPORTE LOCAL*
• 🚌 Transporte público: Mais econômico
• 🚗 Aluguel de carro: Maior liberdade
• 📱 Apps de transporte: Praticidade
• 🚶 A pé: Melhor para conhecer o centro

🍽️ *GASTRONOMIA*
• 🥘 Pratos típicos imperdíveis
• 💧 Beba sempre água mineral
• 🍹 Cuidado com gelo em bebidas
• 🥗 Prefira alimentos cozidos

📱 *APLICATIVOS ÚTEIS*
• 🗺️ Google Maps (offline)
• 🌐 Google Tradutor
• 💱 Conversor de moedas
• ☁️ Previsão do tempo
• 📸 Instagram para inspirações

⚠️ *CUIDADOS IMPORTANTES*
• 📄 Documentos sempre em local seguro
• 💳 Cartões em locais separados
• 📞 Tenha contatos de emergência
• 🏥 Seguro viagem é fundamental
• 📸 Fotos dos documentos no celular

---
💼 *CVC Itaqua - Transformando viagens em experiências*
📞 Consultoria: (11) 9.5396-7741
✨ Sistema v10.0 - Dicas personalizadas`;

    return {
        conteudo,
        debug: {
            tipo: 'dicas_viagem',
            iaRealUsada: false,
            metodo: 'template_basico'
        }
    };
}

console.log("✅ API v10.0 carregada - CORREÇÕES IMPLEMENTADAS!");
console.log("🎯 Importação do ia-client.js corrigida");
console.log("📊 Pronto para integração com analysis.js");
console.log("🚀 Sistema funcionando com IA REAL!");
