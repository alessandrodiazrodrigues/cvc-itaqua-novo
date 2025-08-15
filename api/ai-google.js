// 🚀 CVC ITAQUA v11.1 - BASEADO NA VERSÃO FUNCIONAL v11.0 + CORREÇÕES
// ================================================================================
// 📑 VERSÃO ESTÁVEL COM CORREÇÕES ESPECÍFICAS
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (CORRIGIDOS)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API (MANTIDO FUNCIONAL)
// 4. PROCESSAMENTO E DETECÇÃO DE TIPO
// 5. GERAÇÃO DE PROMPTS (MELHORADA)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (CORRIGIDOS)
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

Valores sujeitos a confirmação e disponibilidade`,

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

Valores sujeitos a confirmação e disponibilidade`,

    multiplas_opcoes_voos: `*Cotação Aéreo ✈ {destino}*
📅 Período: {data_inicio} a {data_fim}
👥 Passageiros: {passageiros}

Abaixo estão as opções que encontramos:
---
{opcoes_formatadas}
---
Valores sujeitos a confirmação e disponibilidade`,

    multitrecho: `*Multitrecho - {companhias}*
📅 Período: {data_inicio} a {data_fim}

{trechos_formatados}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,

    pacote_completo: `*Pacote ✈ {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para {destino}
✅ Taxas de Embarque
✅ Traslado aeroporto/hotel/aeroporto
✅ {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

{opcoes_hoteis}

Valores sujeitos a confirmação e disponibilidade`,

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

Fale comigo para adicionar esses serviços ao seu pacote!`,

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
Fale comigo para verificar disponibilidade e fazer sua reserva com as melhores condições!`
};

// ================================================================================
// 2. 🗺️ TABELA DE CONVERSÃO DE AEROPORTOS
// ================================================================================
const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont',
    'GIG': 'Galeão', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa', 'THE': 'Teresina',
    'SLZ': 'São Luís', 'BEL': 'Belém', 'MAO': 'Manaus', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande',
    'GYN': 'Goiânia', 'VIX': 'Vitória', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus', 'JDO': 'Juazeiro do Norte',
    'IGU': 'Foz do Iguaçu', 'IMP': 'Imperatriz', 'MAB': 'Marabá', 'STM': 'Santarém', 'RBR': 'Rio Branco',
    'PVH': 'Porto Velho', 'BVB': 'Boa Vista', 'MCP': 'Macapá', 'PMW': 'Palmas', 'UDI': 'Uberlândia',
    'RAO': 'Ribeirão Preto', 'JOI': 'Joinville', 'XAP': 'Chapecó', 'LDB': 'Londrina', 'MGF': 'Maringá',
    'EZE': 'Ezeiza - Buenos Aires', 'AEP': 'Aeroparque - Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 'JFK': 'Nova York - JFK',
    'LAX': 'Los Angeles', 'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris - Charles de Gaulle',
    'FCO': 'Roma - Fiumicino', 'LHR': 'Londres - Heathrow'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v11.1 (MANTIDO FUNCIONAL)
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '11.1', message: 'API CVC Itaqua v11.1 - Versão Corrigida' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v11.1: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v11.1: 📥 Início do processamento POST.');
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
            console.log('v11.1: 📝 Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            
            // Extrair destino automaticamente se não fornecido
            let destinoFinal = destino;
            if (!destinoFinal) {
                destinoFinal = extrairDestinoDoConteudo(conteudoPrincipal);
            }
            
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, parcelamento);
            
            console.log(`v11.1: ✅ Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('v11.1: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v11.1: 🤖 Iniciando chamada à IA...');
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
            console.log('v11.1: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v11.1: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('v11.1: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '11.1', ia_usada: iaUsada, tipo: detectOrcamentoType(conteudoPrincipal, tipos) }
        });

    } catch (error) {
        console.error('v11.1: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '11.1',
            stage: 'handler-main'
        });
    }
}

// ================================================================================
// 4. 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO (MELHORADA)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    if (tipos.includes('Dicas')) return 'dicas_completas';
    if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) return 'ranking';
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) return 'cruzeiro';
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) return 'multitrecho';
    if ((conteudoPrincipal.match(/Total \(/gi) || []).length > 1 || (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length > 1 || (conteudoPrincipal.match(/Plano \d/gi) || []).length > 1) return 'multiplas_opcoes_voos';
    if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'pacote_completo';
    if (conteudoLower.includes('conexão em') && conteudoLower.includes('espera')) return 'aereo_conexao_detalhada';
    
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
    
    // PADRÃO 2: Códigos de aeroporto de destino
    const codigosDestino = conteudo.match(/(?:para|destino|chegada)\s*:?\s*([A-Z]{3})/i);
    if (codigosDestino && AEROPORTOS[codigosDestino[1]]) {
        const nomeAeroporto = AEROPORTOS[codigosDestino[1]];
        return nomeAeroporto.split(' - ')[0];
    }
    
    // PADRÃO 3: Destinos conhecidos
    const destinosComuns = ['orlando', 'miami', 'lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona'];
    for (const destino of destinosComuns) {
        if (texto.includes(destino)) {
            return destino.charAt(0).toUpperCase() + destino.slice(1);
        }
    }
    
    return null;
}

// ================================================================================
// 6. 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS (MELHORADA)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    let destinoFinal = destino || 'EXTRAIR DO CONTEÚDO';
    let infoParcelamento = parcelamento ? `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 'EXTRAIR PARCELAMENTO DO TEXTO SE HOUVER';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Lisboa* (GRU = São Paulo, não "Guarulhos")
- **Datas e Horários**: DD/MM e HH:MM
- **Valores**: R$ 1.234,56
- **Passageiros**: zero à esquerda (01, 02, 03)
- **Parcelamento**: ${infoParcelamento}
- **Bagagem**: Seja específico - inclua TUDO mencionado (item pessoal, mala de mão, bagagem despachada, assento)
- **Links**: Incluir URLs que apareçam no texto
- **Aeroportos**: Converter códigos para nomes
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'dicas_completas':
            return `Crie dicas de viagem para ${destinoFinal}, usando o template. Preencha com informações reais e úteis.\n\n**TEMPLATE:**\n${TEMPLATES.dicas_completas}`;

        case 'ranking':
            return `Crie um ranking de hotéis para ${destinoFinal}, usando o template. Use notas reais das plataformas.\n\n**TEMPLATE:**\n${TEMPLATES.ranking}`;

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

console.log('✅ CVC Itaqua v11.1 - Versão funcional corrigida carregada!');
