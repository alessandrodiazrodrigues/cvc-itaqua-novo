// 🚀 CVC ITAQUA v8.6 - LÓGICA DE PACOTES E REGRAS CORRIGIDAS
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (PACOTE FLEXÍVEL)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API (COM VALIDAÇÃO)
// 4. PROCESSAMENTO DE DADOS
// 5. GERAÇÃO DE PROMPTS (REGRAS MAIS RÍGIDAS)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (PACOTE FLEXÍVEL)
// ================================================================================
const TEMPLATES = {
    aereo_ida_volta: `*{companhia} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 Valor total: R$ {valor_total} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional}
{parcelamento}
{link}
{reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    aereo_conexao_detalhada: `*{companhia} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_conexao} {hora_chegada_conexao} (voo direto)
(conexão em {cidade_conexao} - {tempo_espera} de espera)
{data_ida} - {aeroporto_conexao} {hora_saida_conexao} / {aeroporto_destino} {hora_chegada_ida} (voo direto)
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 Valor total: R$ {valor_total} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional}
{parcelamento}
{link}
{reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    aereo_somente_ida: `*{companhia} ✈ {cidade_destino}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total: R$ {valor} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional}
{parcelamento}
{link}
{reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    multiplas_opcoes_2: `*OPÇÃO 1 - {companhia1} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_destino1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 Valor total: R$ {valor1} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional1}
{parcelamento1}
{link1}

*OPÇÃO 2 - {companhia2} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_destino2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 Valor total: R$ {valor2} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional2}
{parcelamento2}
{link2}

{reembolso}
Valores sujeitos a confirmação e disponibilidade`,
    
    // ✅ TEMPLATE DE PACOTE UNIFICADO E FLEXÍVEL
    pacote_completo: `*Pacote ✈ {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para {destino}
- Taxas de Embarque
{traslado}
{passeios}
{seguro}
- {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

🏨 *Opções de Hotéis:*
{opcoes_hoteis}

{parcelamento}
{reembolso}
Valores sujeitos a confirmação e disponibilidade`,

    dicas_especificas: `🌍 *Dicas para {destino}* 🌍

🏖️ **Melhor época para viajar:**
{melhor_epoca}

🍽️ **Gastronomia imperdível:**
{gastronomia}

🎯 **Principais atrações:**
{atracoes}

🏨 **Onde ficar:**
{onde_ficar}

💡 **Dicas especiais:**
{dicas_especiais}

💰 **Orçamento médio:**
{orcamento_medio}

📋 **Documentos necessários:**
{documentos}

✈️ Quer um orçamento personalizado? Me chama! 🌟`,

    ranking_hoteis: `🏆 *Top 5 Hotéis em {destino}* 🏆

**1️⃣ {hotel1_nome}**
⭐{hotel1_estrelas} | 📍 {hotel1_localizacao}
✨ {hotel1_destaque}
💰 Diária média: R$ {hotel1_preco}

**2️⃣ {hotel2_nome}**
⭐{hotel2_estrelas} | 📍 {hotel2_localizacao}
✨ {hotel2_destaque}
💰 Diária média: R$ {hotel2_preco}

**3️⃣ {hotel3_nome}**
⭐{hotel3_estrelas} | 📍 {hotel3_localizacao}
✨ {hotel3_destaque}
💰 Diária média: R$ {hotel3_preco}

**4️⃣ {hotel4_nome}**
⭐{hotel4_estrelas} | 📍 {hotel4_localizacao}
✨ {hotel4_destaque}
💰 Diária média: R$ {hotel4_preco}

**5️⃣ {hotel5_nome}**
⭐{hotel5_estrelas} | 📍 {hotel5_localizacao}
✨ {hotel5_destaque}
💰 Diária média: R$ {hotel5_preco}

💡 Quer reservar algum desses? Me chama! 📲`,

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
Valores sujeitos a confirmação e disponibilidade`,

    locacao_carro: `🚗 *LOCAÇÃO DE VEÍCULOS - {cidade}*
Retirada: {data_retirada} às {hora_retirada}
Devolução: {data_devolucao} às {hora_devolucao}
Local: {local_retirada}
Total: {dias} dias

━━━━━━━━━━━━━━━━━━━━━━━━
*OPÇÃO 1 - {categoria1}*
🚙 {modelo1}
✅ Km livre
✅ Proteção total {franquia1}
✅ Proteção a terceiros
✅ {motorista_adicional1}
💰 R$ {valor1}
⚠️ Taxa local: R$ {taxa1} (pagar na retirada)

━━━━━━━━━━━━━━━━━━━━━━━━
*OPÇÃO 2 - {categoria2}*
🚗 {modelo2}
✅ Km livre
✅ Proteção total {franquia2}
✅ Proteção a terceiros
✅ {motorista_adicional2}
💰 R$ {valor2}
⚠️ Taxa local: R$ {taxa2} (pagar na retirada)

━━━━━━━━━━━━━━━━━━━━━━━━
*OPÇÃO 3 - {categoria3}*
🚙 {modelo3}
✅ Km livre
✅ Proteção total {franquia3}
✅ Proteção a terceiros
✅ {motorista_adicional3}
💰 R$ {valor3}
⚠️ Taxa local: R$ {taxa3} (pagar na retirada)

💡 *DOCUMENTOS NECESSÁRIOS:*
• CNH + Passaporte + Cartão de crédito
• GPS disponível por taxa adicional
• Combustível: devolver com mesmo nível`
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
    'EZE': 'Buenos Aires EZE', 'AEP': 'Buenos Aires AEP', 'SCL': 'Santiago', 'LIM': 'Lima',
    'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'BOG': 'Bogotá', 'GYE': 'Guayaquil',
    'UIO': 'Quito', 'CCS': 'Caracas', 'MVD': 'Montevidéu', 'ASU': 'Assunção', 'LPB': 'La Paz',
    'VVI': 'Santa Cruz de la Sierra', 'BRA': 'Barreiras',
    'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 'FLL': 'Fort Lauderdale',
    'JFK': 'Nova York JFK', 'LGA': 'Nova York LGA', 'EWR': 'Nova York EWR', 'LAX': 'Los Angeles',
    'SFO': 'San Francisco', 'ORD': 'Chicago', 'YYZ': 'Toronto',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris CDG',
    'ORY': 'Paris ORY', 'FCO': 'Roma Fiumicino', 'MXP': 'Milão MXP', 'MIL': 'Milão MIL',
    'LHR': 'Londres Heathrow', 'LGW': 'Londres Gatwick', 'FRA': 'Frankfurt', 'AMS': 'Amsterdã',
    'ZRH': 'Zurique',
    'NRT': 'Tóquio NRT', 'HND': 'Tóquio HND'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v8.6
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '8.6' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v8.6: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v8.6: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '',
            tipos = [], imagemBase64 = null, arquivoBase64 = null, temImagem = false
        } = req.body;

        let infoPassageiros, destinoFinal, prompt, resultado, iaUsada, templateEspecifico;

        // --- Bloco de Processamento de Dados ---
        try {
            console.log('v8.6: 📊 Iniciando processamento de dados...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();

            const padraoPassageiros = conteudoLower.match(/(\d+)\s*(?:adulto|adultos)/i);
            if (padraoPassageiros) {
                const numAdultos = parseInt(padraoPassageiros[1]);
                infoPassageiros = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
            } else {
                infoPassageiros = "02 adultos"; // Valor padrão
            }

            destinoFinal = destino || null;
            if (!destinoFinal && conteudoPrincipal) {
                const padraoDestino = conteudoLower.match(/(?:porto seguro|maceió|fortaleza|lisboa|porto|paris|buenos aires|santiago|nova york|rio de janeiro|gramado|natal|joão pessoa|foz do iguaçu|salvador|recife|roma|londres|barcelona|madrid|orlando|miami|cancún)/i);
                if (padraoDestino) {
                    let cidade = padraoDestino[0];
                    destinoFinal = cidade.charAt(0).toUpperCase() + cidade.slice(1);
                }
            }
             console.log('v8.6: ✅ Processamento de dados concluído.');
        } catch (dataError) {
            console.error('v8.6: ❌ Erro no processamento de dados:', dataError);
            return res.status(500).json({ success: false, error: 'Falha ao processar os dados de entrada.', details: dataError.message, stage: 'data-processing' });
        }

        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v8.6: 📝 Iniciando geração de prompt...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS).map(([codigo, nome]) => `${codigo} → ${nome}`).join('\n');

            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel');
            const isCarro = tipos.includes('Carro') || conteudoLower.includes('locação') || conteudoLower.includes('locacao');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo');
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('pacote inclui') || conteudoLower.includes('o pacote inclui');
            
            if (isDicas) {
                templateEspecifico = 'dicas_especificas';
                prompt = `SISTEMA CVC ITAQUA v8.6 - GERAÇÃO DE DICAS\nDESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}\nINSTRUÇÕES: Use o template 'dicas_especificas' com informações REAIS e DETALHADAS sobre ${destinoFinal || 'o destino mencionado'}. NÃO use informações genéricas. Pesquise no seu conhecimento dados sobre o destino.`;
            } else if (isRanking) {
                templateEspecifico = 'ranking_hoteis';
                prompt = `SISTEMA CVC ITAQUA v8.6 - RANKING DE HOTÉIS\nDESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}\nINSTRUÇÕES: Use o template 'ranking_hoteis' com hotéis REAIS do destino. Pesquise no seu conhecimento e inclua preços médios reais e destaques.`;
            } else {
                if (isPacote) {
                    templateEspecifico = 'pacote_completo';
                } else if (isCarro) {
                    templateEspecifico = 'locacao_carro';
                } else if (isHotel && !temAereo) {
                    templateEspecifico = 'hoteis_multiplas_opcoes';
                } else {
                    templateEspecifico = 'aereo_ida_volta'; // Padrão
                }

                prompt = `🚀 SISTEMA CVC ITAQUA v8.6
DADOS DO CLIENTE:
${conteudoPrincipal}

ANÁLISE:
- Destino: ${destinoFinal || 'EXTRAIR'}
- Passageiros: ${infoPassageiros || 'EXTRAIR'}
- Template a ser usado: ${templateEspecifico}

AEROPORTOS (para consulta):
${tabelaAeroportos}

TEMPLATES DISPONÍVEIS:
${templatesString}

📋 REGRAS CRÍTICAS E OBRIGATÓRIAS:
1.  **TEMPLATE DE PACOTE**: Se o template for 'pacote_completo', você DEVE encontrar TODAS as opções de hotéis no texto e formatá-las sequencialmente no campo {opcoes_hoteis}. O formato para CADA hotel é:
    "**OPÇÃO [N]** - [Nome do Hotel]\\n📍 [Endereço]\\n🛏️ [Quarto] com [Regime]\\n💰 R$ [Valor] para ${infoPassageiros}\\n[Link do Hotel]"
2.  **DATAS**: Calcule as noites CORRETAMENTE. Ex: 06/nov a 11/nov são 5 noites. Padronize TODAS as datas no resultado para o formato DD/MM (ex: 06/11).
3.  **REEMBOLSO (MUITO IMPORTANTE)**: A palavra "Reembolsável" no texto de origem é uma distração. IGNORE-A COMPLETAMENTE. A única regra é: se você encontrar as palavras "Não reembolsável", você DEVE adicionar a linha "🏷️ Não reembolsável" no final. Caso contrário, NÃO adicione NADA sobre reembolso.
4.  **PARCELAMENTO (MUITO IMPORTANTE)**: NÃO INVENTE informação de parcelamento. Se o texto original NÃO MENCIONA parcelamento, a linha {parcelamento} deve ser deixada em branco.
5.  **PASSAGEIROS**: A variável \`infoPassageiros\` já contém o texto formatado ("${infoPassageiros}"). USE ESTE TEXTO EXATO, incluindo o zero à esquerda. Não o altere para "2 adultos".
6.  **LINKS**: Mantenha os links originais da CVC para cada hotel.
7.  **FINALIZAÇÃO**: SEMPRE termine a resposta com "Valores sujeitos a confirmação e disponibilidade", a menos que o template já tenha uma frase final diferente (como Dicas ou Ranking).

Use o template '${templateEspecifico}' e siga TODAS as regras acima sem exceção.`;
            }
            
            console.log('v8.6: ✅ Geração de prompt concluída.');
        } catch (promptError) {
            console.error('v8.6: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v8.6: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (observacoes.length + textoColado.length > 2000);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Siga EXATAMENTE os templates e as regras CRÍTICAS fornecidas no prompt do usuário. NUNCA invente informações. Converta códigos de aeroportos. Formate para WhatsApp. Para dicas e rankings, use informações reais do seu conhecimento sobre o destino.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                iaUsada = 'claude-3-haiku';
                const messages = [{ role: 'user', content: (imagemBase64 || arquivoBase64) ? [{ type: 'text', text: prompt }, { type: 'image', source: { type: 'base64', media_type: (imagemBase64 || arquivoBase64).split(';')[0].split(':')[1], data: (imagemBase64 || arquivoBase64).split(',')[1] } }] : prompt }];
                const apiResponse = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 2000, temperature: 0.1, messages, system: systemPrompt }) });
                if (!apiResponse.ok) { const errorText = await apiResponse.text(); throw new Error(`Erro Claude: ${errorText}`); }
                const responseData = await apiResponse.json();
                resultado = responseData.content[0].text;
            } else {
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) throw new Error('OpenAI API key não configurada (OPENAI_API_KEY).');
                const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2000 }) });
                if (!apiResponse.ok) { const errorText = await apiResponse.text(); throw new Error(`Erro GPT: ${errorText}`); }
                const responseData = await apiResponse.json();
                resultado = responseData.choices[0].message.content;
            }
            console.log('v8.6: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v8.6: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v8.6: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '8.6', ia_usada: iaUsada, destino: destinoFinal, template_usado: templateEspecifico }
        });

    } catch (error) {
        console.error('v8.6: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '8.6',
            stage: 'handler-main'
        });
    }
}
