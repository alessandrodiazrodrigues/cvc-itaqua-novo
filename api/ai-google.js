// 🚀 CVC ITAQUA v9.0 - MÚLTIPLAS OPÇÕES E CONEXÃO DETALHADA
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (NOVOS MODELOS)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API
// 4. PROCESSAMENTO DE DADOS (COM DETECÇÃO DE MÚLTIPLAS OPÇÕES)
// 5. GERAÇÃO DE PROMPTS (BASEADO EM EXEMPLO)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (NOVOS MODELOS)
// ================================================================================
const TEMPLATES = {
    // ✅ Modelo para Múltiplas Opções Aéreas
    multiplas_opcoes_voos: `*Cotação Aéreo ✈ {destino}*
📅 Período: {data_inicio} a {data_fim}
👥 Passageiros: {passageiros}

Abaixo estão as opções que encontramos:
---
{opcoes_formatadas}
---
Valores sujeitos a confirmação e disponibilidade.`,

    // ✅ Modelo para Voo com Conexão Detalhada
    aereo_conexao_detalhada: `*Iberia ✈ {destino}*

🛫 **Ida: {data_ida}**
{detalhes_ida}
--
🛬 **Volta: {data_volta}**
{detalhes_volta}

💰 **Valor total:** R$ {valor_total} para {passageiros}
💳 **Pagamento:** {pagamento}
🎒 **Bagagem:** {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade.`,
    
    // Modelo Padrão para Voo Simples
    aereo_simples: `*{companhia} ✈ {destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **Valor total:** R$ {valor_total} para {passageiros}
💳 **Pagamento:** {pagamento}
🎒 **Bagagem:** {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade.`,

    // Outros templates mantidos
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
    'VVI': 'Santa Cruz de la Sierra', 'BRA': 'Barreiras', 'MAD': 'Madrid',
    'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 'FLL': 'Fort Lauderdale',
    'JFK': 'Nova York JFK', 'LGA': 'Nova York LGA', 'EWR': 'Nova York EWR', 'LAX': 'Los Angeles',
    'SFO': 'San Francisco', 'ORD': 'Chicago', 'YYZ': 'Toronto',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'BCN': 'Barcelona', 'CDG': 'Paris CDG',
    'ORY': 'Paris ORY', 'FCO': 'Roma Fiumicino', 'MXP': 'Milão MXP', 'MIL': 'Milão MIL',
    'LHR': 'Londres Heathrow', 'LGW': 'Londres Gatwick', 'FRA': 'Frankfurt', 'AMS': 'Amsterdã',
    'ZRH': 'Zurique',
    'NRT': 'Tóquio NRT', 'HND': 'Tóquio HND'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v9.0
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '9.0' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v9.0: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v9.0: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '',
            tipos = [], imagemBase64 = null, arquivoBase64 = null, temImagem = false
        } = req.body;

        let prompt, resultado, iaUsada;

        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v9.0: 📝 Iniciando geração de prompt...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();
            
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo');
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('pacote inclui') || conteudoLower.includes('o pacote inclui');
            
            // ✅ LÓGICA DE DETECÇÃO DE MÚLTIPLAS OPÇÕES
            const numeroDeOpcoes = (conteudoPrincipal.match(/Total \(/gi) || []).length;
            const isMultiplasOpcoes = numeroDeOpcoes > 1;

            if (isMultiplasOpcoes) {
                prompt = `Sua tarefa é converter os dados brutos de uma cotação com MÚLTIPLAS OPÇÕES de voos em um único orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TABELA DE AEROPORTOS PARA CONSULTA:**
${JSON.stringify(AEROPORTOS)}

**MODELO DE SAÍDA / EXEMPLO:**
*Cotação Aéreo ✈ Lisboa*
📅 Período: 11/07 a 23/07
👥 Passageiros: 04 adultos e 01 criança

Abaixo estão as opções que encontramos:
---
*OPÇÃO 1 - Iberia (Com bagagem despachada)*

11/07 - Guarulhos 19:15 / Lisboa 16:05 (com conexão)
--
23/07 - Lisboa 08:25 / Guarulhos 17:35 (com conexão)

💰 **Valor:** R$ 28.975,58
💳 **Pagamento:** Entrada de R$ 8.698,70 + 4x de R$ 5.069,22
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/link-exemplo-1
---
*OPÇÃO 2 - Tap Portugal (Sem bagagem despachada)*

11/07 - Guarulhos 15:30 / Lisboa 05:20 (voo direto)
--
23/07 - Lisboa 17:05 / Guarulhos 23:10 (voo direto)

💰 **Valor:** R$ 32.630,75
💳 **Pagamento:** Entrada de R$ 7.406,99 + 9x de R$ 2.802,64
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/link-exemplo-2
---
Valores sujeitos a confirmação e disponibilidade.

**REGRAS CRÍTICAS:**
1.  **IDENTIFIQUE AS OPÇÕES**: Separe cada bloco de cotação. Cada bloco começa com a companhia aérea e termina com um link.
2.  **CABEÇALHO GERAL**: Crie o cabeçalho com o destino, período e passageiros (extraia do primeiro bloco).
3.  **PARA CADA OPÇÃO**:
    - Crie um título claro, ex: "*OPÇÃO X - Companhia (Com/Sem bagagem despachada)*".
    - Formate os voos com o separador "--".
    - Extraia o valor, a forma de pagamento, a política de reembolso ("Não reembolsável") e o link.
    - Limpe o link, removendo o texto "Olá, Vasti!...".
4.  **AEROPORTOS**: Converta TODOS os códigos de aeroporto (GRU, LIS) para seus nomes completos.
5.  **BAGAGEM**: Analise CADA opção para determinar se a bagagem despachada está inclusa e mencione isso no título da opção.

Agora, gere o orçamento final seguindo o modelo e as regras à risca.`;
            } else {
                 // Lógica para pacotes, voos simples, etc. (mantida)
                 prompt = `Sua tarefa é converter os dados brutos de uma viagem em um orçamento formatado para WhatsApp.
 
**DADOS BRUTOS:**
${conteudoPrincipal}

**INFORMAÇÕES ADICIONAIS:**
- Tabela de Aeroportos para conversão: ${JSON.stringify(AEROPORTOS)}

**REGRAS GERAIS:**
1.  Determine o tipo de orçamento (Pacote, Aéreo Simples, etc.).
2.  Use o template apropriado de: ${JSON.stringify(TEMPLATES)}
3.  Converta todos os códigos de aeroportos.
4.  Extraia e formate todas as informações disponíveis (preço, pagamento, links, etc.).
5.  Sempre finalize com "Valores sujeitos a confirmação e disponibilidade."

Agora, gere o orçamento final.`;
            }
            
            console.log('v9.0: ✅ Geração de prompt concluída.');
        } catch (promptError) {
            console.error('v9.0: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v9.0: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (observacoes.length + textoColado.length > 2000);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua única função é analisar os dados brutos e gerar um orçamento formatado para WhatsApp, seguindo o modelo, o exemplo e as regras fornecidas no prompt do usuário. Seja preciso e atento aos detalhes.';

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
            console.log('v9.0: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v9.0: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v9.0: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '9.0', ia_usada: iaUsada }
        });

    } catch (error) {
        console.error('v9.0: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '9.0',
            stage: 'handler-main'
        });
    }
}
