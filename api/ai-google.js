// ================================================================================
// 🚀 CVC ITAQUA v2.89 - SISTEMA DE TEMPLATES/MODELOS
// ================================================================================
// ARQUIVO: api/ai-google.js
// 
// IMPORTANTE: Este arquivo contém apenas MODELOS/TEMPLATES!
// A IA é responsável por preencher com dados reais baseados no conteúdo fornecido.
// ================================================================================

// ================================================================================
// CONFIGURAÇÕES
// ================================================================================

const CONFIG = {
    VERSION: '2.89',
    DEFAULT_DESTINATION: 'Destino'
};

// Tabela de conversão de aeroportos (para a IA usar como referência)
const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma',
    'LHR': 'Londres', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'JFK': 'Nova York', 'MIA': 'Miami', 'MCO': 'Orlando',
    'CUN': 'Cancún', 'EZE': 'Buenos Aires', 'SCL': 'Santiago'
};

// ================================================================================
// SEÇÃO 1: TEMPLATES/MODELOS DE ORÇAMENTO
// ================================================================================

const TEMPLATES = {
    
    // TEMPLATE 1: AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
💺 {assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 2: MÚLTIPLAS OPÇÕES
    MULTIPLAS_OPCOES: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{dados_opcao1}

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
✅ {bagagem1}
💺 {assento1}
🏷️ {reembolso1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{dados_opcao2}

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
✅ {bagagem2}
💺 {assento2}
🏷️ {reembolso2}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{dados_opcao3}

💰 R$ {valor3} para {passageiros}
💳 {parcelamento3}
✅ {bagagem3}
💺 {assento3}
🏷️ {reembolso3}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 3: MULTITRECHO
    MULTITRECHO: `*MULTITRECHO - {companhias}*
📅 {data_inicio} a {data_fim} ({total_dias} dias)
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
{trechos_detalhados}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 4: PACOTE COMPLETO
    PACOTE_COMPLETO: `*🏖️ PACOTE {destino_upper}*
📅 {data_inicio} a {data_fim} ({dias} dias e {noites} noites)
👥 {passageiros}

*✈️ AÉREO {companhia}:*
{detalhes_voo}

*🏨 HOSPEDAGEM:*
{detalhes_hotel}

*🚌 TRASLADOS:*
{detalhes_traslados}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}

*✅ INCLUÍDO:*
{itens_incluidos}

*❌ NÃO INCLUÍDO:*
{itens_nao_incluidos}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 5: CRUZEIRO
    CRUZEIRO: `*🚢 CRUZEIRO {nome_navio}*
🗓️ {data_inicio} a {data_fim}
⛴️ {noites} noites
📍 Saída: {porto_saida}
👥 {passageiros}

*🗺️ ROTEIRO:*
{roteiro_detalhado}

*🛏️ CATEGORIAS DE CABINE:*
{categorias_cabines}

*✅ INCLUÍDO:*
{itens_incluidos}

*❌ NÃO INCLUÍDO:*
{itens_nao_incluidos}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 6: SOMENTE HOTEL
    SOMENTE_HOTEL: `*🏨 HOTÉIS EM {destino_upper}*
📅 Check-in: {checkin} | Check-out: {checkout}
🌙 {noites} noites
👥 {passageiros}

{opcoes_hoteis}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 7: INGRESSOS
    INGRESSOS: `*🎢 INGRESSOS {nome_atracao}*
📅 Data da visita: {data_visita}
👥 {quantidade} ingressos

*📋 DETALHES:*
{detalhes_ingresso}

*💳 VALORES:*
{tabela_valores}

💰 Total: R$ {valor_total}
💳 {parcelamento}

*📱 IMPORTANTE:*
{informacoes_importantes}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 8: SEGURO VIAGEM
    SEGURO_VIAGEM: `*🛡️ SEGURO VIAGEM {destino}*
📅 Período: {data_inicio} a {data_fim} ({dias} dias)
👥 {quantidade} segurado(s)
🌍 Destino: {tipo_destino}

*📋 COBERTURAS:*
{lista_coberturas}

*🏥 ASSISTÊNCIA 24H:*
{lista_assistencia}

💰 R$ {valor_por_pessoa} por pessoa
💰 Total: R$ {valor_total}
💳 {parcelamento}

*📱 IMPORTANTE:*
{informacoes_importantes}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 9: LOCAÇÃO DE CARRO
    LOCACAO_CARRO: `*🚗 LOCAÇÃO DE VEÍCULO - {destino_upper}*
📅 Retirada: {data_retirada} às {hora_retirada}
📅 Devolução: {data_devolucao} às {hora_devolucao}
📍 Local: {local_retirada}
⏱️ {total_diarias} diárias

*🚙 VEÍCULO:*
{detalhes_veiculo}

*💰 VALORES:*
{detalhamento_valores}

💰 Total: R$ {valor_total}
💳 {parcelamento}

*✅ INCLUÍDO:*
{itens_incluidos}

*❌ NÃO INCLUÍDO:*
{itens_nao_incluidos}

*📋 DOCUMENTAÇÃO:*
{documentacao_necessaria}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // TEMPLATE 10: DICAS WHATSAPP
    DICAS_WHATSAPP: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {destino_upper}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre {destino}*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
{lista_passeios}

🌡️ *CLIMA {periodo}:*
{informacoes_clima}

{secao_criancas}

🍽️ *GASTRONOMIA:*
{informacoes_gastronomia}

💰 *INFORMAÇÕES ÚTEIS:*
{informacoes_uteis}

💳 *CUSTOS MÉDIOS:*
{tabela_custos}

🛡️ *SEGURO VIAGEM:*
{informacoes_seguro}

📱 *DICAS PRÁTICAS:*
{dicas_praticas}

🎁 *PRODUTOS CVC RECOMENDADOS:*
{produtos_recomendados}

🚨 *IMPORTANTE:*
{avisos_importantes}

{documentacao_menores}

💡 *DICA DE OURO:*
{dica_especial}`,

    // TEMPLATE 11: RANKING DE HOTÉIS
    RANKING_HOTEIS: `━━━━━━━━━━━━━━━━━━
🏆 *RANKING DOS HOTÉIS EM {destino_upper}*
━━━━━━━━━━━━━━━━━━

{ranking_detalhado}

💡 *MINHA RECOMENDAÇÃO:*
{recomendacao_personalizada}

{dicas_familias}

📌 *OBSERVAÇÕES:*
{observacoes_finais}`
};

// ================================================================================
// SEÇÃO 2: INSTRUÇÕES PARA A IA
// ================================================================================

const INSTRUCOES_IA = {
    GERAL: `
Você deve preencher o template fornecido com as informações extraídas do conteúdo.
Use EXATAMENTE o formato do template, substituindo apenas os placeholders {}.

REGRAS DE FORMATAÇÃO:
- Datas: DD/MM
- Horários: HH:MM
- Valores: R$ X.XXX,XX
- Passageiros: XX adultos + XX crianças
- Converter códigos de aeroporto usando a tabela fornecida
- Adicionar (+1) quando chegada é no dia seguinte
- Para tipo de voo: "voo direto", "com conexão", "uma escala em {cidade}"

IMPORTANTE:
- Extraia TODAS as informações do conteúdo fornecido
- Se alguma informação não estiver disponível, use valores padrão razoáveis
- Mantenha a formatação WhatsApp com emojis
- Termine sempre com: Valores sujeitos a confirmação e disponibilidade (v2.89)`,

    DICAS: `
Para gerar DICAS, você deve:
1. Pesquisar/criar informações REAIS e ATUALIZADAS sobre o destino
2. Incluir clima específico do período mencionado
3. Listar atrações turísticas principais
4. Informar custos médios locais
5. Adicionar dicas práticas e úteis
6. Se houver crianças, incluir seção específica com atrações infantis
7. Todas as informações devem ser VERÍDICAS e ÚTEIS`,

    RANKING: `
Para gerar RANKING de hotéis, você deve:
1. Criar 3 opções de hotéis com características diferentes
2. Incluir localização e distâncias de pontos turísticos
3. Adicionar avaliações realistas (Booking, Google, TripAdvisor)
4. Destacar pontos fortes e fracos
5. Se houver crianças, mencionar estrutura familiar
6. Fazer recomendação baseada no perfil dos passageiros`
};

// ================================================================================
// SEÇÃO 3: FUNÇÕES DE DETECÇÃO
// ================================================================================

function detectarTipoOrcamento(conteudo, tipos = []) {
    const texto = conteudo.toLowerCase();
    
    // Prioridade para tipos selecionados no formulário
    if (tipos && tipos.length > 0) {
        if (tipos.includes('Dicas')) return 'DICAS';
        if (tipos.includes('Ranking')) return 'RANKING';
        if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
        if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
        if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'PACOTE_COMPLETO';
        if (tipos.includes('Hotel')) return 'SOMENTE_HOTEL';
    }
    
    // Detecção automática pelo conteúdo
    if (texto.includes('gere dicas') || texto.includes('dicas')) return 'DICAS';
    if (texto.includes('gere ranking') || texto.includes('ranking')) return 'RANKING';
    if (texto.includes('multitrecho')) return 'MULTITRECHO';
    if (texto.includes('cruzeiro')) return 'CRUZEIRO';
    if (texto.includes('seguro viagem')) return 'SEGURO_VIAGEM';
    if (texto.includes('ingresso')) return 'INGRESSOS';
    if (texto.includes('locação') || texto.includes('carro')) return 'LOCACAO_CARRO';
    if (texto.includes('hotel') && texto.includes('aéreo')) return 'PACOTE_COMPLETO';
    if (texto.includes('hotel')) return 'SOMENTE_HOTEL';
    
    // Verificar múltiplas opções
    const numeroOpcoes = detectarNumeroOpcoes(conteudo);
    if (numeroOpcoes >= 2) return 'MULTIPLAS_OPCOES';
    
    return 'AEREO_SIMPLES';
}

function detectarNumeroOpcoes(conteudo) {
    const valores = (conteudo.match(/R\$\s*[\d.,]+/g) || []).length;
    const links = (conteudo.match(/https:\/\/www\.cvc\.com\.br/g) || []).length;
    const opcoes = (conteudo.match(/opção \d/gi) || []).length;
    
    return Math.max(valores, links, opcoes, 1);
}

function extrairDestino(conteudo, destinoForm = '') {
    if (destinoForm && destinoForm.trim()) return destinoForm;
    
    // Tentar extrair do conteúdo
    const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
    if (codigosAeroporto) {
        for (const codigo of codigosAeroporto) {
            if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(codigo)) {
                return AEROPORTOS[codigo].split(' ')[0];
            }
        }
    }
    
    return CONFIG.DEFAULT_DESTINATION;
}

// ================================================================================
// SEÇÃO 4: GERAÇÃO DE PROMPTS PARA A IA
// ================================================================================

function gerarPromptParaIA(tipo, conteudo, destino, passageiros) {
    const template = TEMPLATES[tipo];
    const instrucoes = INSTRUCOES_IA.GERAL;
    
    let promptEspecifico = '';
    
    switch (tipo) {
        case 'DICAS':
            promptEspecifico = `
${INSTRUCOES_IA.DICAS}

Gere dicas REAIS e ATUALIZADAS para ${destino}.
Use o template abaixo e preencha com informações verdadeiras:

${TEMPLATES.DICAS_WHATSAPP}`;
            break;
            
        case 'RANKING':
            promptEspecifico = `
${INSTRUCOES_IA.RANKING}

Crie um ranking de 3 hotéis para ${destino}.
Use o template abaixo:

${TEMPLATES.RANKING_HOTEIS}`;
            break;
            
        default:
            promptEspecifico = `
Extraia as informações do conteúdo abaixo e preencha o template:

CONTEÚDO:
${conteudo}

DESTINO: ${destino}
PASSAGEIROS: ${passageiros}

TEMPLATE A PREENCHER:
${template}`;
    }
    
    return `
${instrucoes}

TABELA DE AEROPORTOS:
${JSON.stringify(AEROPORTOS, null, 2)}

${promptEspecifico}

IMPORTANTE: 
- Preencha TODOS os placeholders {} com informações extraídas ou geradas
- Mantenha o formato exato do template
- Use dados REAIS quando for gerar informações (dicas, ranking)
- Termine com: Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// ================================================================================
// SEÇÃO 5: HANDLER PRINCIPAL
// ================================================================================

module.exports = async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
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
            message: 'CVC Itaqua API v2.89 - Sistema de Templates',
            info: 'Este sistema fornece templates/modelos para a IA preencher com dados reais'
        });
    }
    
    // Validar POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido'
        });
    }
    
    try {
        // Extrair dados do request
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = '2',
            criancas = '0',
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = req.body || {};
        
        // Combinar conteúdo
        const conteudo = observacoes || textoColado || pdfContent || '';
        
        // Validar conteúdo
        if (!conteudo.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, adicione informações sobre a viagem'
            });
        }
        
        // Detectar informações
        const destinoFinal = extrairDestino(conteudo, destino);
        const tipoOrcamento = detectarTipoOrcamento(conteudo, tipos);
        
        // Formatar passageiros
        const numAdultos = parseInt(adultos) || 2;
        const numCriancas = parseInt(criancas) || 0;
        let passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
        if (numCriancas > 0) {
            passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
        }
        
        // Gerar prompt para a IA
        const prompt = gerarPromptParaIA(tipoOrcamento, conteudo, destinoFinal, passageiros);
        
        // Configurar qual IA usar
        const usarClaude = imagemBase64 || conteudo.length > 3000 || tipoOrcamento === 'MULTITRECHO';
        
        let resultado;
        
        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            // Usar Claude para casos complexos
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
                    temperature: 0.3,
                    messages,
                    system: 'Você é um assistente da CVC Itaqua especializado em formatar orçamentos de viagem.'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Claude API erro: ${response.status}`);
            }
            
            const data = await response.json();
            resultado = data.content[0].text;
            
        } else if (process.env.OPENAI_API_KEY) {
            // Usar GPT-4 para casos normais
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente da CVC Itaqua especializado em formatar orçamentos de viagem. Siga EXATAMENTE o template fornecido.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2048
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API erro: ${response.status}`);
            }
            
            const data = await response.json();
            resultado = data.choices[0].message.content;
            
        } else {
            throw new Error('Nenhuma API key configurada');
        }
        
        // Limpar formatação de código se houver
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // Retornar resultado
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                tipo: tipoOrcamento,
                destino: destinoFinal,
                passageiros: passageiros,
                version: CONFIG.VERSION
            }
        });
        
    } catch (error) {
        console.error('Erro:', error);
        return res.status(200).json({
            success: false,
            error: error.message || 'Erro ao processar orçamento',
            result: 'Erro ao processar. Por favor, tente novamente.'
        });
    }
};

// ================================================================================
// LOG DE INICIALIZAÇÃO
// ================================================================================
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║       CVC ITAQUA v2.89 - SISTEMA DE TEMPLATES                  ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Sistema fornece apenas MODELOS/TEMPLATES                    ║');
console.log('║ ✅ IA preenche com dados REAIS baseados no conteúdo           ║');
console.log('║ ✅ Suporta todos os 11 tipos de orçamento                     ║');
console.log('║ ✅ Dicas e Rankings gerados com dados reais pela IA           ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
