// 🚀 CVC ITAQUA v8.9 - CÁLCULO DE PARCELAS E REGRAS FINAIS
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (ESTÁVEL)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API (ESTÁVEL)
// 4. PROCESSAMENTO DE DADOS
// 5. GERAÇÃO DE PROMPTS (COM EXEMPLO E CÁLCULO)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (ESTÁVEL)
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
    
    pacote_completo: `*Pacote ✈ {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para {destino}
✅ Taxas de Embarque
{traslado}
{passeios}
{seguro}
✅ {noites} de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

🏨 *Opções de Hotéis:*
{opcoes_hoteis}

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
// 3. 🎯 HANDLER PRINCIPAL DA API v8.9
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '8.9' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v8.9: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v8.9: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '',
            tipos = [], parcelamento = null, imagemBase64 = null, 
            arquivoBase64 = null, temImagem = false
        } = req.body;

        let infoPassageiros, destinoFinal, prompt, resultado, iaUsada, templateEspecifico;

        // --- Bloco de Processamento de Dados ---
        try {
            console.log('v8.9: 📊 Iniciando processamento de dados...');
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
             console.log('v8.9: ✅ Processamento de dados concluído.');
        } catch (dataError) {
            console.error('v8.9: ❌ Erro no processamento de dados:', dataError);
            return res.status(500).json({ success: false, error: 'Falha ao processar os dados de entrada.', details: dataError.message, stage: 'data-processing' });
        }

        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v8.9: 📝 Iniciando geração de prompt...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();
            
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel');
            const isCarro = tipos.includes('Carro') || conteudoLower.includes('locação') || conteudoLower.includes('locacao');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo');
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('pacote inclui') || conteudoLower.includes('o pacote inclui');
            
            if (isDicas) {
                templateEspecifico = 'dicas_especificas';
                prompt = `SISTEMA CVC ITAQUA v8.9 - GERAÇÃO DE DICAS\nDESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}\nINSTRUÇÕES: Use o template 'dicas_especificas' com informações REAIS e DETALHADAS sobre ${destinoFinal || 'o destino mencionado'}. NÃO use informações genéricas.`;
            } else if (isRanking) {
                templateEspecifico = 'ranking_hoteis';
                prompt = `SISTEMA CVC ITAQUA v8.9 - RANKING DE HOTÉIS\nDESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}\nINSTRUÇÕES: Use o template 'ranking_hoteis' com hotéis REAIS do destino. Pesquise no seu conhecimento e inclua preços médios reais e destaques.`;
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

                // ✅ PROMPT COM EXEMPLO E REGRAS DIRETAS
                prompt = `Sua tarefa é converter os dados brutos de uma viagem em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INFORMAÇÕES ADICIONAIS:**
- Passageiros: ${infoPassageiros}
- Número de Parcelas: ${parcelamento || 'NÃO CALCULAR'}
- Tabela de Aeroportos para conversão: ${JSON.stringify(AEROPORTOS)}

**TEMPLATE A SER PREENCHIDO:**
${TEMPLATES[templateEspecifico]}

**EXEMPLO DE COMO O RESULTADO FINAL DEVE SER (SE HOUVER PARCELAMENTO EM 10X):**
*Pacote ✈ Porto Seguro*
Embarque: 06/11
Pacote para 02 adultos

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para Porto Seguro
✅ Taxas de Embarque
✅ Traslado compartilhado
✅ 5 noites de hospedagem no hotel escolhido

✈️ *Voos Latam:*
06/11 - Congonhas 17:30 / Porto Seguro 19:25 (voo direto)
--
11/11 - Porto Seguro 10:55 / Congonhas 13:05 (voo direto)

🏨 *Opções de Hotéis:*
**OPÇÃO 1** - Hotel Casablanca Porto Seguro
📍 Av dos navegantes 282 282
🛏️ 1 Standard Promo com Café da manhã
💰 R$ 3.366,30 (ou 10x de R$ 336,63) para 02 adultos
https://www.cvc.com.br/link-exemplo-1

**OPÇÃO 2** - Floral Inn Family Experientia Hotels
📍 Avenida beira mar 8323
🛏️ 1 Standard Frete com Café da manhã
💰 R$ 3.445,04 (ou 10x de R$ 344,50) para 02 adultos
https://www.cvc.com.br/link-exemplo-2

Valores sujeitos a confirmação e disponibilidade

**REGRAS FINAIS E OBRIGATÓRIAS:**
1.  **CÁLCULO DE PARCELA (MAIS IMPORTANTE)**: Para CADA hotel, se a informação "Número de Parcelas" for um número (ex: 10, 12), você DEVE calcular o valor da parcela (valor total / número de parcelas). Adicione o resultado ao lado do preço total no formato \`(ou Xx de R$ Y)\`. Formate o valor da parcela com duas casas decimais. Se for "NÃO CALCULAR", não adicione nada sobre parcelamento.
2.  **LIMPEZA DOS LINKS**: Remova COMPLETAMENTE o texto "Olá, Carla! Para conferir os produtos para sua viagem, acesse:". Deixe APENAS a URL limpa em sua própria linha, abaixo da linha do preço.
3.  **AEROPORTOS**: Converta TODOS os códigos de aeroporto (CGH, BPS) para seus nomes completos.
4.  **NOITES**: Calcule as noites corretamente (06/11 a 11/11 = 5 noites) e use APENAS o número de noites na descrição (ex: "5 noites de hospedagem").
5.  **REEMBOLSO**: IGNORE a palavra "Reembolsável". Só adicione "🏷️ Não reembolsável" se esta frase exata estiver nos dados brutos.

Agora, gere o orçamento final usando os DADOS BRUTOS e seguindo o EXEMPLO e as REGRAS à risca.`;
            }
            
            console.log('v8.9: ✅ Geração de prompt concluída.');
        } catch (promptError) {
            console.error('v8.9: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v8.9: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (observacoes.length + textoColado.length > 2000);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua única função é preencher o template fornecido no prompt do usuário com os dados brutos, seguindo o exemplo e as regras à risca. Você deve ser capaz de realizar cálculos matemáticos simples, como divisão, para o parcelamento. Não adicione nenhuma informação que não foi solicitada.';

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
            console.log('v8.9: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v8.9: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v8.9: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '8.9', ia_usada: iaUsada, destino: destinoFinal, template_usado: templateEspecifico }
        });

    } catch (error) {
        console.error('v8.9: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '8.9',
            stage: 'handler-main'
        });
    }
}
