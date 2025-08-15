// 🚀 CVC ITAQUA v1.1 - BASEADO NA VERSÃO FUNCIONAL v11.0 + TODAS AS MELHORIAS
// ================================================================================
// 📑 SISTEMA COMPLETO E FUNCIONAL
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (TODOS OS MODELOS + CORREÇÕES)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS (EXPANDIDA)
// 3. HANDLER PRINCIPAL DA API (MANTIDO FUNCIONAL)
// 4. PROCESSAMENTO E DETECÇÃO DE TIPO (MELHORADO)
// 5. GERAÇÃO DE PROMPTS (CORRIGIDA)
// 6. PROCESSAMENTO COM IA (ESTÁVEL)
// 7. RESPOSTA FINAL (COM VERSIONAMENTO)
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (TODOS OS MODELOS + CORREÇÕES)
// ================================================================================
const TEMPLATES = {
    // ✈️ AÉREO IDA E VOLTA SIMPLES
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // ✈️ AÉREO COM CONEXÃO DETALHADA
    aereo_conexao_detalhada: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

🛫 **Ida: {data_ida}**
{detalhes_ida}
--
🛬 **Volta: {data_volta}**
{detalhes_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // ✈️ AÉREO SOMENTE IDA
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🔢 MÚLTIPLAS OPÇÕES - 2 PLANOS
    multiplas_opcoes_2_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
💳 {parcelamento1}
🔗 {link1}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
💳 {parcelamento2}
🔗 {link2}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🔢 MÚLTIPLAS OPÇÕES - 3 PLANOS
    multiplas_opcoes_3_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - R$ {valor3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🌍 MÚLTIPLAS COMPANHIAS
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
🔗 {link2}

🏷️ {reembolso}
Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🗺️ MULTITRECHO
    multitrecho: `*Multitrecho - {companhias}*
📅 Período: {data_inicio} a {data_fim}

{trechos_formatados}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🏨 HOTÉIS - MÚLTIPLAS OPÇÕES
    hoteis_multiplas_opcoes: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel1} ⭐{estrelas1}
📍 {localizacao1}
🛏️ {tipo_quarto1}
☕ {regime1}
💰 R$ {valor1} total
🔗 {link1}

**OPÇÃO 2** - {nome_hotel2} ⭐{estrelas2}
📍 {localizacao2}
🛏️ {tipo_quarto2}
☕ {regime2}
💰 R$ {valor2} total
🔗 {link2}

**OPÇÃO 3** - {nome_hotel3} ⭐{estrelas3}
📍 {localizacao3}
🛏️ {tipo_quarto3}
☕ {regime3}
💰 R$ {valor3} total
🔗 {link3}

💳 {parcelamento}
Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🏨 ROTEIRO DE HOTÉIS
    roteiro_hoteis: `*Roteiro {destino}*
{passageiros}

📅 **{data1} a {data2}** ({noites1} noites)
🏨 {hotel1} - {cidade1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1}

📅 **{data2} a {data3}** ({noites2} noites)
🏨 {hotel2} - {cidade2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2}

📅 **{data3} a {data4}** ({noites3} noites)
🏨 {hotel3} - {cidade3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3}

💰 **VALOR TOTAL DO ROTEIRO:** R$ {valor_total}
💳 {parcelamento}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🏖️ PACOTE COMPLETO
    pacote_completo: `*Pacote {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para {destino}
✅ Taxas de Embarque
✅ Traslado {tipo_traslado}
✅ {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

{opcoes_hoteis}

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🚢 CRUZEIRO
    cruzeiro: `🚢 *Cruzeiro {nome_navio}* – {duracao} noites
{passageiros}
📅 Embarque: {data_embarque} ({dia_semana})
📍 Saída e chegada: {porto}
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
{opcoes_cabines}

📎 Link para ver fotos, detalhes e reservar:
{link}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade (v1.1)`,

    // 🌍 DICAS DE DESTINO
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

Fale comigo para adicionar esses serviços ao seu pacote! (v1.1)`,

    // 🏆 RANKING DE HOTÉIS
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

🏅 **4º LUGAR** - {hotel4}
📍 {localizacao4}
⭐ Google: {nota_google4}/5 | Booking: {nota_booking4}/10 | TripAdvisor: {nota_tripadvisor4}/5
✅ {ponto_positivo4}
💬 "{review4}"

🏅 **5º LUGAR** - {hotel5}
📍 {localizacao5}
⭐ Google: {nota_google5}/5 | Booking: {nota_booking5}/10 | TripAdvisor: {nota_tripadvisor5}/5
✅ {ponto_positivo5}
💬 "{review5}"

---
✈️ *Quer reservar algum desses hotéis?*
Fale comigo para verificar disponibilidade e fazer sua reserva com as melhores condições! (v1.1)`
};

// ================================================================================
// 2. 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS (EXPANDIDA)
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
    'EZE': 'Ezeiza - Buenos Aires', 'AEP': 'Aeroparque - Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 
    'JFK': 'Nova York - JFK', 'LGA': 'Nova York - LaGuardia', 'EWR': 'Nova York - Newark',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'DFW': 'Dallas', 'ATL': 'Atlanta', 'ORD': 'Chicago',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris - Charles de Gaulle',
    'ORY': 'Paris - Orly', 'FCO': 'Roma - Fiumicino', 'MXP': 'Milão', 'LHR': 'Londres - Heathrow',
    'LGW': 'Londres - Gatwick', 'FRA': 'Frankfurt', 'MUC': 'Munique', 'AMS': 'Amsterdam', 'ZUR': 'Zurique'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v1.1 (MANTIDO FUNCIONAL)
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '1.1', message: 'API CVC Itaqua v1.1 - Sistema Completo' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v1.1: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v1.1: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '',
            adultos = 1, criancas = 0, bebes = 0,
            tipos = [], parcelamento = '',
            imagemBase64 = null, arquivoBase64 = null, temImagem = false
        } = req.body;

        let prompt, resultado, iaUsada;
        const conteudoPrincipal = (observacoes || textoColado || '').toString();
        
        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v1.1: 📝 Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            
            // Extrair destino automaticamente se não fornecido
            let destinoFinal = destino;
            if (!destinoFinal && (tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking')) {
                destinoFinal = extrairDestinoDoConteudo(conteudoPrincipal);
            }
            
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, parcelamento);
            
            console.log(`v1.1: ✅ Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('v1.1: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v1.1: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (conteudoPrincipal.length > 2500);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua única função é analisar os dados brutos e gerar um orçamento formatado para WhatsApp, seguindo o modelo, o exemplo e as regras fornecidas no prompt do usuário. Seja preciso e atento aos detalhes. Sua resposta deve ser apenas o texto final, sem comentários ou explicações.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                iaUsada = 'claude-3-haiku';
                const messages = [{ role: 'user', content: (imagemBase64 || arquivoBase64) ? [{ type: 'text', text: prompt }, { type: 'image', source: { type: 'base64', media_type: (imagemBase64 || arquivoBase64).split(';')[0].split(':')[1], data: (imagemBase64 || arquivoBase64).split(',')[1] } }] : prompt }];
                const apiResponse = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 2048, temperature: 0.1, messages, system: systemPrompt }) });
                if (!apiResponse.ok) { const errorText = await apiResponse.text(); throw new Error(`Erro Claude: ${errorText}`); }
                const responseData = await apiResponse.json();
                resultado = responseData.content[0].text;
            } else {
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) throw new Error('OpenAI API key não configurada (OPENAI_API_KEY).');
                const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2048 }) });
                if (!apiResponse.ok) { const errorText = await apiResponse.text(); throw new Error(`Erro GPT: ${errorText}`); }
                const responseData = await apiResponse.json();
                resultado = responseData.choices[0].message.content;
            }
            console.log('v1.1: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v1.1: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('v1.1: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '1.1', ia_usada: iaUsada, tipo: detectOrcamentoType(conteudoPrincipal, tipos) }
        });

    } catch (error) {
        console.error('v1.1: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '1.1',
            stage: 'handler-main'
        });
    }
}

// ================================================================================
// 4. 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO (MELHORADA)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    // Detecção baseada nos tipos solicitados
    if (tipos.includes('Dicas')) return 'dicas_completas';
    if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) return 'ranking';
    
    // Detecção baseada no conteúdo
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) return 'cruzeiro';
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) return 'multitrecho';
    
    // Múltiplas opções
    const opcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length;
    const planosDetectados = (conteudoPrincipal.match(/Plano \d/gi) || []).length;
    const totaisDetectados = (conteudoPrincipal.match(/Total \(/gi) || []).length;
    
    if (opcoesMarcadas === 2 || planosDetectados === 2) return 'multiplas_opcoes_2_planos';
    if (opcoesMarcadas >= 3 || planosDetectados >= 3) return 'multiplas_opcoes_3_planos';
    if (totaisDetectados > 1 || opcoesMarcadas >= 2) return 'multiplas_companhias';
    
    // Tipos específicos
    if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'pacote_completo';
    if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) return 'hoteis_multiplas_opcoes';
    if (conteudoLower.includes('roteiro') && conteudoLower.includes('hotel')) return 'roteiro_hoteis';
    if (conteudoLower.includes('conexão em') && conteudoLower.includes('espera')) return 'aereo_conexao_detalhada';
    if (conteudoLower.includes('somente ida') || conteudoLower.includes('one way')) return 'aereo_somente_ida';
    
    // Padrão
    return 'aereo_simples';
}

// ================================================================================
// 5. 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    
    // PADRÃO 1: "São Paulo - Lisboa" ou "São Paulo ✈ Lisboa"
    const padraoSetas = conteudo.match(/([a-záàâãéêíóôõúç\s]+)\s*[→✈-]+\s*([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoSetas) {
        return padraoSetas[2].trim();
    }
    
    // PADRÃO 2: "Pacote Orlando", "Hotéis em Lisboa"
    const padraoDestinos = conteudo.match(/(?:pacote|hotéis?\s+em|viagem\s+para|destino)\s+([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoDestinos) {
        return padraoDestinos[1].trim();
    }
    
    // PADRÃO 3: Códigos de aeroporto de destino
    const codigosDestino = conteudo.match(/(?:para|destino|chegada)\s*:?\s*([A-Z]{3})/i);
    if (codigosDestino && AEROPORTOS[codigosDestino[1]]) {
        const nomeAeroporto = AEROPORTOS[codigosDestino[1]];
        return nomeAeroporto.split(' - ')[0];
    }
    
    // PADRÃO 4: Destinos conhecidos
    const destinosComuns = [
        'orlando', 'miami', 'lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona',
        'buenos aires', 'santiago', 'lima', 'bogotá', 'cancún', 'nova york', 'dubai'
    ];
    
    for (const destino of destinosComuns) {
        if (texto.includes(destino)) {
            return destino.charAt(0).toUpperCase() + destino.slice(1);
        }
    }
    
    return null;
}

// ================================================================================
// 6. 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS (CORRIGIDA)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    let destinoFinal = destino || 'EXTRAIR DO CONTEÚDO';
    let infoParcelamento = parcelamento ? `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 'EXTRAIR PARCELAMENTO DO TEXTO (entrada + parcelas ou parcelamento selecionado)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Lisboa* (GRU = São Paulo, CGH = São Paulo, SDU = Rio de Janeiro)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ Lisboa")
- **Datas e Horários**: DD/MM (03/01) e HH:MM (17:40)
- **Valores**: R$ 1.234,56 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **Bagagem**: Seja ESPECÍFICO - inclua TUDO mencionado:
  * "item pessoal" → incluir
  * "mala de mão" → incluir
  * "bagagem despachada" → incluir
  * "pré-reserva de assento" → incluir
- **Links**: Incluir URLs que apareçam no texto (limpar texto extra)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.1)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'dicas_completas':
            return `Crie dicas de viagem para ${destinoFinal}, usando o template. Preencha com informações reais e úteis sobre gastronomia, atrações e passeios.\n\n**TEMPLATE:**\n${TEMPLATES.dicas_completas}`;

        case 'ranking':
            return `Crie um ranking de hotéis para ${destinoFinal}. Use notas reais das plataformas (Google /5, Booking /10, TripAdvisor /5). Inclua localização com proximidade de atrações, pontos positivos e reviews atrativos.\n\n**TEMPLATE:**\n${TEMPLATES.ranking}`;

        case 'multiplas_opcoes_2_planos':
        case 'multiplas_opcoes_3_planos':
        case 'multiplas_companhias':
            return `Converta os dados de múltiplas opções em orçamento formatado.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE:**
${TEMPLATES[tipoOrcamento]}

${regrasGerais}
${tabelaAeroportos}`;

        case 'multitrecho':
            return `Converta os dados de multitrecho em orçamento formatado.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE:**
${TEMPLATES.multitrecho}

**INSTRUÇÕES ESPECÍFICAS:**
1. Identifique CADA trecho da viagem
2. Formate cada trecho: *Trecho X:* Origem → Destino
3. Extraia valor total, parcelamento, bagagem e link

${regrasGerais}
${tabelaAeroportos}`;

        case 'pacote_completo':
            return `Converta os dados de pacote completo em orçamento formatado.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE:**
${TEMPLATES.pacote_completo}

**INSTRUÇÕES ESPECÍFICAS:**
1. Extraia detalhes do voo
2. Liste TODAS as opções de hotéis
3. Formate cada hotel com localização, quarto, regime, preço e link

${regrasGerais}
${tabelaAeroportos}`;

        default:
            return `Converta os dados brutos em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE:**
${TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
    }
}

console.log('✅ CVC Itaqua v1.1 - Sistema completo carregado com todos os templates e correções!');
