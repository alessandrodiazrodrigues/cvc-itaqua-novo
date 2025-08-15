// 🚀 api/ai-google.js - CVC ITAQUA v1.2 CORREÇÃO
// ================================================================================
// 📑 SISTEMA COMPLETO PARA VERCEL FUNCTIONS
// ================================================================================
// Este é o arquivo que o frontend estava procurando!
// Frontend chama: /api/ai-google
// Arquivo: api/ai-google.js
// ================================================================================

// ================================================================================
// 📋 TEMPLATES COMPLETOS v1.2 (CORRIGIDOS)
// ================================================================================
const TEMPLATES = {
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v1.2)`,

    multiplas_opcoes_2_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
💳 {parcelamento1}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
💳 {parcelamento2}

Valores sujeitos a confirmação e disponibilidade (v1.2)`,

    dicas_completas: `🌍 *Dicas Essenciais para sua Viagem a {destino}!* 🌍

Aqui estão algumas sugestões para aproveitar ao máximo sua estadia:

1️⃣ **Gastronomia Imperdível**
{dica_gastronomia}

2️⃣ **Atrações Clássicas**
{dica_atracoes}

3️⃣ **Passeios e Experiências**
{dica_passeios}

---
✈️ *Complete sua Viagem com a CVC!*
Além de voos e hotéis, a CVC Itaqua oferece tudo para deixar sua viagem ainda mais fácil e segura:
- Passeios opcionais incríveis
- Seguro viagem completo
- Chip de celular internacional

Fale comigo para adicionar esses serviços ao seu pacote! (v1.2)`,

    ranking: `🏆 *Ranking dos Melhores Hotéis em {destino}* 🏆

Confira nossa seleção especial dos hotéis mais bem avaliados:

🥇 **1º LUGAR** - {hotel1}
📍 {localizacao1}
⭐ Google: {nota_google1}/5 | Booking: {nota_booking1}/10 | TripAdvisor: {nota_tripadvisor1}/5
✅ {ponto_positivo1}
💬 "{review1}"

🥈 **2º LUGAR** - {hotel2}
📍 {localizacao2}
⭐ Google: {nota_google2}/5 | Booking: {nota_booking2}/10 | TripAdvisor: {nota_tripadvisor2}/5
✅ {ponto_positivo2}
💬 "{review2}"

🥉 **3º LUGAR** - {hotel3}
📍 {localizacao3}
⭐ Google: {nota_google3}/5 | Booking: {nota_booking3}/10 | TripAdvisor: {nota_tripadvisor3}/5
✅ {ponto_positivo3}
💬 "{review3}"

Valores sujeitos a confirmação e disponibilidade (v1.2)`
};

// ================================================================================
// 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS v1.2
// ================================================================================
const AEROPORTOS = {
    // AEROPORTOS BRASILEIROS
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont',
    'GIG': 'Galeão', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa', 'THE': 'Teresina',
    'SLZ': 'São Luís', 'BEL': 'Belém', 'MAO': 'Manaus', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande',
    'GYN': 'Goiânia', 'VIX': 'Vitória', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus', 'JDO': 'Juazeiro do Norte',
    'IGU': 'Foz do Iguaçu', 'IMP': 'Imperatriz', 'MAB': 'Marabá', 'STM': 'Santarém', 'RBR': 'Rio Branco',
    'PVH': 'Porto Velho', 'BVB': 'Boa Vista', 'MCP': 'Macapá', 'PMW': 'Palmas', 'UDI': 'Uberlândia',
    'RAO': 'Ribeirão Preto', 'JOI': 'Joinville', 'XAP': 'Chapecó', 'LDB': 'Londrina', 'MGF': 'Maringá',
    
    // AEROPORTOS INTERNACIONAIS
    'EZE': 'Buenos Aires', 'AEP': 'Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 
    'JFK': 'Nova York', 'LGA': 'Nova York', 'EWR': 'Nova York',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'DFW': 'Dallas', 'ATL': 'Atlanta', 'ORD': 'Chicago',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris', 'ORY': 'Paris',
    'FCO': 'Roma', 'MXP': 'Milão', 'LHR': 'Londres', 'LGW': 'Londres', 'FRA': 'Frankfurt', 'MUC': 'Munique', 
    'AMS': 'Amsterdam', 'ZUR': 'Zurich'
};

// ================================================================================
// 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO CORRIGIDA v1.2
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.2: Extraindo destino de:', conteudo.substring(0, 100) + '...');
    
    // PADRÃO 1: CÓDIGOS DE AEROPORTO PRIMEIRO (mais preciso)
    const padraoAeroportoDestino = conteudo.match(/(?:para|destino|→|✈|chegada)\s*:?\s*([A-Z]{3})/i);
    if (padraoAeroportoDestino && AEROPORTOS[padraoAeroportoDestino[1]]) {
        const nomeAeroporto = AEROPORTOS[padraoAeroportoDestino[1]];
        const cidade = nomeAeroporto.split(' - ')[0].split(' (')[0]; // Remove detalhes extras
        console.log('✅ v1.2: Destino extraído por código:', cidade);
        return cidade;
    }
    
    // PADRÃO 2: "Cidade1 - Cidade2" ou "Cidade1 ✈ Cidade2" (PRIORIDADE ALTA)
    const padraoSetas = conteudo.match(/([a-záàâãéêíóôõúç\s\(\)]+)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
    if (padraoSetas) {
        const origem = padraoSetas[1].trim();
        const destino = padraoSetas[2].trim();
        
        // Validar que é realmente uma rota válida
        const destinosEuropeus = ['lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona', 'amsterdam', 'berlin', 'zurich'];
        const destinosAmericanos = ['miami', 'orlando', 'nova york', 'los angeles', 'buenos aires', 'santiago'];
        const todosDestinos = [...destinosEuropeus, ...destinosAmericanos];
        
        if (todosDestinos.some(d => destino.toLowerCase().includes(d))) {
            console.log('✅ v1.2: Destino extraído por padrão de rota:', destino);
            return destino;
        }
    }
    
    // PADRÃO 3: "GRU-LIS" ou "GRU → LIS" (códigos de aeroporto)
    const padraoCodigosRota = conteudo.match(/([A-Z]{3})\s*[-→✈]+\s*([A-Z]{3})/);
    if (padraoCodigosRota) {
        const codigoDestino = padraoCodigosRota[2];
        if (AEROPORTOS[codigoDestino]) {
            const cidade = AEROPORTOS[codigoDestino].split(' - ')[0].split(' (')[0];
            console.log('✅ v1.2: Destino extraído por códigos de rota:', cidade);
            return cidade;
        }
    }
    
    // PADRÃO 4: "Pacote Orlando", "Hotéis em Lisboa", "Viagem para Paris"
    const padraoExplicito = conteudo.match(/(?:pacote|hotéis?\s+em|viagem\s+para|destino\s*:?\s*)([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoExplicito) {
        const destino = padraoExplicito[1].trim();
        console.log('✅ v1.2: Destino extraído por padrão explícito:', destino);
        return destino;
    }
    
    // PADRÃO 5: Destinos conhecidos no texto (ÚLTIMO RECURSO)
    const destinosConhecidos = {
        // Destinos Europeus
        'lisboa': 'Lisboa', 'madrid': 'Madrid', 'paris': 'Paris', 'londres': 'Londres',
        'roma': 'Roma', 'barcelona': 'Barcelona', 'amsterdam': 'Amsterdam', 'berlin': 'Berlin',
        'zurich': 'Zurich', 'frankfurt': 'Frankfurt', 'munique': 'Munique', 'milao': 'Milão',
        
        // Destinos Americanos
        'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York', 'los angeles': 'Los Angeles',
        'san francisco': 'São Francisco', 'las vegas': 'Las Vegas', 'chicago': 'Chicago',
        
        // América Latina
        'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'lima': 'Lima', 'bogota': 'Bogotá'
    };
    
    for (const [chave, nome] of Object.entries(destinosConhecidos)) {
        if (texto.includes(chave)) {
            console.log('✅ v1.2: Destino extraído por palavra-chave:', nome);
            return nome;
        }
    }
    
    console.log('⚠️ v1.2: Nenhum destino identificado no conteúdo');
    return null;
}

// ================================================================================
// 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO v1.2
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    console.log('🔍 v1.2: Detectando tipo de orçamento...');
    
    // Detecção baseada nos tipos solicitados (PRIORIDADE 1)
    if (tipos.includes('Dicas')) {
        console.log('✅ v1.2: Tipo detectado: dicas_completas');
        return 'dicas_completas';
    }
    if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) {
        console.log('✅ v1.2: Tipo detectado: ranking');
        return 'ranking';
    }
    
    // Detecção baseada no conteúdo (PRIORIDADE 2)
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
        console.log('✅ v1.2: Tipo detectado: cruzeiro');
        return 'cruzeiro';
    }
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
        console.log('✅ v1.2: Tipo detectado: multitrecho');
        return 'multitrecho';
    }
    
    // Múltiplas opções (PRIORIDADE 3)
    const opcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length;
    if (opcoesMarcadas >= 2) {
        console.log('✅ v1.2: Tipo detectado: multiplas_opcoes_2_planos');
        return 'multiplas_opcoes_2_planos';
    }
    
    // Padrão
    console.log('✅ v1.2: Usando tipo padrão: aereo_simples');
    return 'aereo_simples';
}

// ================================================================================
// 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS v1.2
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    // Extrair destino automaticamente se necessário
    let destinoFinal = destino;
    
    if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
        const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
        if (destinoExtraido) {
            destinoFinal = destinoExtraido;
            console.log('✅ v1.2: Destino extraído automaticamente:', destinoFinal);
        } else {
            destinoFinal = destino || 'Destino não identificado';
        }
    }
    
    let infoParcelamento = parcelamento ? 
        `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
        'EXTRAIR PARCELAMENTO DO TEXTO (entrada + parcelas ou parcelamento disponível)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v1.2:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Lisboa* (GRU = São Paulo, LIS = Lisboa)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ Lisboa")
- **Datas e Horários**: DD/MM (03/01) e HH:MM (17:40)
- **Valores**: R$ 1.234,56 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **Bagagem**: Incluir TUDO mencionado (item pessoal, mala de mão, bagagem despachada, pré-reserva de assento)
- **Links**: Incluir URLs que apareçam no texto
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.2)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS v1.2:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'dicas_completas':
            return `Crie dicas de viagem específicas e úteis para ${destinoFinal}.

**INSTRUÇÕES ESPECÍFICAS:**
1. Use informações REAIS e ÚTEIS sobre ${destinoFinal}
2. Mencione restaurantes, atrações e experiências específicos da cidade
3. Adapte as dicas ao destino correto: ${destinoFinal}
4. Não use informações genéricas de outros destinos

**TEMPLATE:**
${TEMPLATES.dicas_completas}`;

        case 'ranking':
            return `Crie um ranking de hotéis específico para ${destinoFinal}.

**INSTRUÇÕES ESPECÍFICAS:**
1. Use hotéis REAIS de ${destinoFinal}
2. Inclua notas realistas das plataformas (Google /5, Booking /10, TripAdvisor /5)
3. Mencione localizações específicas de ${destinoFinal}
4. Use reviews autênticos que fazem sentido para ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.ranking}`;

        default:
            return `Converta os dados brutos em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**DESTINO IDENTIFICADO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
    }
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API v1.2 (CORRIGIDO PARA VERCEL)
// ================================================================================
export default async function handler(req, res) {
    // CORS obrigatório
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET para teste
    if (req.method === 'GET') {
        return res.status(200).json({ 
            success: true, 
            status: 'operational', 
            version: '1.2',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v1.2 - Sistema Completo + Correção Destinos',
            ia_usada: 'ready'
        });
    }

    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido - use POST' 
        });
    }

    try {
        console.log('🚀 v1.2: Início do processamento POST...');
        
        // Validar se tem body
        if (!req.body) {
            console.error('❌ v1.2: Requisição sem body');
            return res.status(400).json({ 
                success: false, 
                error: 'Body da requisição é obrigatório' 
            });
        }

        // Extrair dados do body
        const {
            observacoes = '', 
            textoColado = '', 
            destino = '',
            adultos = 1, 
            criancas = 0, 
            tipos = [], 
            parcelamento = '',
            imagemBase64 = null, 
            pdfContent = null
        } = req.body;

        console.log('📋 v1.2: Dados recebidos:', { 
            observacoes: observacoes.substring(0, 50) + '...', 
            destino, 
            tipos,
            temImagem: !!imagemBase64,
            temPDF: !!pdfContent
        });

        // Montar conteúdo principal
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem (texto, imagem ou PDF)'
            });
        }

        // --- Bloco de Geração de Prompt ---
        let prompt;
        try {
            console.log('📝 v1.2: Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
            console.log(`✅ v1.2: Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('❌ v1.2: Erro na geração do prompt:', promptError);
            return res.status(500).json({ 
                success: false, 
                error: 'Falha ao montar a requisição para a IA',
                details: promptError.message 
            });
        }

        // --- Bloco de Chamada da IA ---
        let resultado, iaUsada;
        try {
            console.log('🤖 v1.2: Iniciando chamada à IA...');
            
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo exatamente o modelo e as regras fornecidas. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v1.2: Usando Claude para caso complexo...');
                iaUsada = 'claude-3-haiku';
                
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
                        system: systemPrompt
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Claude erro ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                resultado = data.content[0].text;
                
            } else {
                console.log('⚡ v1.2: Usando GPT-4o-mini...');
                iaUsada = 'gpt-4o-mini';
                
                if (!process.env.OPENAI_API_KEY) {
                    throw new Error('OPENAI_API_KEY não configurada');
                }

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.1,
                        max_tokens: 2048
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`OpenAI erro ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                resultado = data.choices[0].message.content;
            }
            
            console.log('✅ v1.2: Chamada à IA concluída com sucesso.');
            
        } catch (aiError) {
            console.error('❌ v1.2: Erro na chamada da IA:', aiError);
            
            // Fallback para resposta mock em caso de erro
            console.log('🔄 v1.2: Usando resposta de fallback...');
            
            resultado = `*Latam - São Paulo ✈ ${destino || 'Lisboa'}*

03/01 - Guarulhos 17:40 / ${destino || 'Lisboa'} 06:20 (Voo direto)
--
03/02 - ${destino || 'Lisboa'} 13:50 / Guarulhos 21:05 (Voo direto)

💰 R$ 3.500,00 para 02 adultos
💳 ${parcelamento ? `${parcelamento}x sem juros` : '10x sem juros no cartão'}
✅ Bagagem despachada incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v1.2)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            
            iaUsada = 'fallback-v1.2';
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('✅ v1.2: Processamento concluído. Enviando resposta...');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: { 
                version: '1.2', 
                timestamp: new Date().toISOString(),
                tipo: detectOrcamentoType(conteudoPrincipal, tipos),
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal)
            }
        });

    } catch (error) {
        console.error('❌ v1.2: Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '1.2',
            timestamp: new Date().toISOString()
        });
    }
}

console.log('✅ CVC Itaqua v1.2 - api/ai-google.js completo carregado!');
console.log('🔧 Correções aplicadas:');
console.log('  - ✅ Extração de destinos corrigida (Lisboa detectado corretamente)');
console.log('  - ✅ Sistema de fallback robusto');
console.log('  - ✅ Logs detalhados para debug');
console.log('  - ✅ Compatibilidade total com Vercel Functions');
console.log('  - ✅ Templates completos incluídos');
console.log('  - ✅ CORS configurado corretamente');
