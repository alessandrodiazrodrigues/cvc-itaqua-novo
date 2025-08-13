// 🚀 CVC ITAQUA v8.3 - DEPURACAO AVANCADA DE ERROS
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API (COM DEPURACAO)
// 4. PROCESSAMENTO DE DADOS (EM BLOCO SEGURO)
// 5. GERAÇÃO DE PROMPTS (EM BLOCO SEGURO)
// 6. PROCESSAMENTO COM IA (EM BLOCO SEGURO)
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS
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
    multitrecho: `*{companhia} ✈ Multitrecho*
{data_trecho1} - {aeroporto1} {hora1} / {aeroporto_chegada1} {hora_chegada1} ({tipo_voo1})
--
{data_trecho2} - {aeroporto2} {hora2} / {aeroporto_chegada2} {hora_chegada2} ({tipo_voo2})
--
{data_trecho3} - {aeroporto3} {hora3} / {aeroporto_chegada3} {hora_chegada3} ({tipo_voo3})

💰 Valor total: R$ {valor_total} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional}
{parcelamento}
{link}
{reembolso}

Valores sujeitos a confirmação e disponibilidade`,
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

**OPÇÃO 1** - {nome_hotel1}
📍 {endereco1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1} para {passageiros}
{link1}

**OPÇÃO 2** - {nome_hotel2}
📍 {endereco2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2} para {passageiros}
{link2}

{opcao3}

{parcelamento}
{reembolso}
Valores sujeitos a confirmação e disponibilidade`,
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

📲 Me chama pra garantir a sua cabine! 🌴🛳️`,
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
• Combustível: devolver com mesmo nível

Valores sujeitos a confirmação e disponibilidade`
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
// 3. 🎯 HANDLER PRINCIPAL DA API v8.3
// ================================================================================
export default async function handler(req, res) {
    // Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({ success: true, status: 'operational', version: '8.3' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método não suportado.' });
    }

    // --- Início do Bloco Principal Try/Catch ---
    try {
        console.log('v8.3: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '', idadesCriancas = [],
            tipos = [], parcelamento = null, imagemBase64 = null,
            arquivoBase64 = null, temImagem = false
        } = req.body;

        let infoPassageiros, destinoFinal, prompt, resultado, iaUsada, tipoDetectado;

        // --- Bloco de Processamento de Dados ---
        try {
            console.log('v8.3: 📊 Iniciando processamento de dados...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();

            const padraoPassageiros = conteudoLower.match(/(\d+)\s*(?:adulto|adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:criança|crianças))?/i);
            if (padraoPassageiros) {
                const numAdultos = parseInt(padraoPassageiros[1]);
                const numCriancas = padraoPassageiros[2] ? parseInt(padraoPassageiros[2]) : 0;
                let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
                if (numCriancas > 0) {
                    textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
                    if (idadesCriancas && idadesCriancas.length > 0) {
                        textoPax += ` (${idadesCriancas.join(' e ')} anos)`;
                    }
                }
                infoPassageiros = textoPax;
            } else {
                infoPassageiros = "01 adulto"; // Valor padrão
            }

            destinoFinal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
            if (!destinoFinal && conteudoPrincipal) {
                const padraoDestino = conteudoLower.match(/(?:orlando|miami|cancún|porto seguro|maceió|fortaleza|lisboa|porto|paris|buenos aires|santiago|nova york|new york|rio de janeiro|gramado|natal|joão pessoa|foz do iguaçu|salvador|recife|roma|londres|barcelona|madrid)/i);
                if (padraoDestino) {
                    destinoFinal = padraoDestino[0].replace(/^\w/, c => c.toUpperCase());
                }
            }
             console.log('v8.3: ✅ Processamento de dados concluído.');
        } catch (dataError) {
            console.error('v8.3: ❌ Erro no processamento de dados:', dataError);
            return res.status(500).json({ success: false, error: 'Falha ao processar os dados de entrada.', details: dataError.message, stage: 'data-processing' });
        }

        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v8.3: 📝 Iniciando geração de prompt...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS).map(([codigo, nome]) => `${codigo} → ${nome}`).join('\n');

            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel');
            const isCarro = conteudoLower.includes('locação') || conteudoLower.includes('locacao');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo');
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('pacote inclui');
            const isSomenteIda = conteudoLower.includes('somente ida');
            const temMultiplasOpcoes = (conteudoLower.match(/opção \d/g) || []).length > 1;
            const isMultitrecho = conteudoLower.includes('multitrecho');
            const temConexaoDetalhada = conteudoLower.includes('conexão em');
            const isCruzeiro = conteudoLower.includes('cruzeiro');
            const temNaoReembolsavel = conteudoLower.includes('não reembolsável');
            const temInfoParcelamento = conteudoLower.includes('entrada de r$') || conteudoLower.includes('x de r$') || parcelamento !== null;

            let templateEspecifico = 'aereo_ida_volta';
            if (isPacote) templateEspecifico = 'pacote_completo';
            else if (isSomenteIda) templateEspecifico = 'aereo_somente_ida';
            else if (temMultiplasOpcoes) templateEspecifico = 'multiplas_opcoes_2';
            else if (isMultitrecho) templateEspecifico = 'multitrecho';
            else if (temConexaoDetalhada) templateEspecifico = 'aereo_conexao_detalhada';
            else if (isCruzeiro) templateEspecifico = 'cruzeiro';
            else if (isCarro) templateEspecifico = 'locacao_carro';
            else if (isHotel && !temAereo) templateEspecifico = 'hoteis_multiplas_opcoes';
            else if (isDicas) templateEspecifico = 'dicas';
            else if (isRanking) templateEspecifico = 'ranking';

            prompt = `🚀 SISTEMA CVC ITAQUA v8.3
DADOS DO CLIENTE: ${conteudoPrincipal}
ANÁLISE: Destino: ${destinoFinal || 'EXTRAIR'}, Passageiros: ${infoPassageiros || 'EXTRAIR'}, Template: ${templateEspecifico}
AEROPORTOS (converter): ${tabelaAeroportos}
TEMPLATES: ${templatesString}
📋 REGRAS CRÍTICAS:
1. TÍTULO: "*Companhia ✈ Destino*".
2. BAGAGEM: Padrão é "✅ Inclui 1 mala de mão + 1 item pessoal".
3. VOOS: Formato "DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo)". Separar com "--".
4. REEMBOLSO: Se "Não reembolsável", inclua "🏷️ Não reembolsável". Se for reembolsável, NÃO mencione.
5. FINALIZAÇÃO: Sempre terminar com "Valores sujeitos a confirmação e disponibilidade".

Use o template '${templateEspecifico}' e siga TODAS as regras.`;
            console.log('v8.3: ✅ Geração de prompt concluída.');
        } catch (promptError) {
            console.error('v8.3: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v8.3: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (observacoes.length + textoColado.length > 2000);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Siga EXATAMENTE os templates e regras fornecidos. NUNCA invente informações. Converta todos os códigos de aeroportos. Formate para WhatsApp.';

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
            console.log('v8.3: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v8.3: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v8.3: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '8.3', ia_usada: iaUsada, destino: destinoFinal }
        });

    } catch (error) {
        // Este é o 'catch' final para erros totalmente inesperados.
        console.error('v8.3: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '8.3',
            stage: 'handler-main'
        });
    }
}
