// 🚀 CVC ITAQUA v11.0 - LÓGICA COMPLETA BASEADA NO MANUAL OFICIAL
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (FIÉIS AOS MODELOS APROVADOS)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API
// 4. PROCESSAMENTO E DETECÇÃO DE TIPO (LÓGICA DO MANUAL)
// 5. GERAÇÃO DE PROMPTS (ESPECÍFICOS POR MODELO)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (FIÉIS AOS MODELOS APROVADOS)
// ================================================================================
const TEMPLATES = {
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
🎒 Bagagem: {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade.`,

    aereo_conexao_detalhada: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

🛫 **Ida: {data_ida}**
{detalhes_ida}
--
🛬 **Volta: {data_volta}**
{detalhes_volta}

💰 R$ {valor_total} para {passageiros}
💳 Pagamento: {pagamento}
🎒 Bagagem: {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade.`,

    multiplas_opcoes_voos: `*Cotação Aéreo ✈ {destino}*
📅 Período: {data_inicio} a {data_fim}
👥 Passageiros: {passageiros}

Abaixo estão as opções que encontramos:
---
{opcoes_formatadas}
---
Valores sujeitos a confirmação e disponibilidade.`,

    multitrecho: `*Multitrecho - {companhias}*
📅 Período: {data_inicio} a {data_fim}

{trechos_formatados}

💰 R$ {valor_total} para {passageiros}
💳 Pagamento: {pagamento}
🎒 Bagagem: {bagagem}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade.`,

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

Valores sujeitos a confirmação e disponibilidade.`,

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
// 3. 🎯 HANDLER PRINCIPAL DA API v11.0
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') return res.status(200).json({ success: true, status: 'operational', version: '11.0', message: 'API CVC Itaqua com Lógica do Manual' });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não suportado.' });

    try {
        if (!req.body) {
            console.error('v11.0: ❌ Erro: Requisição sem corpo.');
            return res.status(400).json({ success: false, error: 'Requisição inválida: corpo não encontrado.' });
        }
        
        console.log('v11.0: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '',
            tipos = [], imagemBase64 = null, arquivoBase64 = null, temImagem = false
        } = req.body;

        let prompt, resultado, iaUsada;
        const conteudoPrincipal = (observacoes || textoColado || '').toString();
        
        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v11.0: 📝 Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino);
            
            console.log(`v11.0: ✅ Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('v11.0: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v11.0: 🤖 Iniciando chamada à IA...');
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
            console.log('v11.0: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v11.0: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v11.0: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '11.0', ia_usada: iaUsada }
        });

    } catch (error) {
        console.error('v11.0: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '11.0',
            stage: 'handler-main'
        });
    }
}

// ================================================================================
// 4. 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO (LÓGICA DO MANUAL)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    if (tipos.includes('Dicas')) return 'dicas';
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) return 'cruzeiro';
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) return 'multitrecho';
    if ((conteudoPrincipal.match(/Total \(/gi) || []).length > 1 || (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length > 1 || (conteudoPrincipal.match(/Plano \d/gi) || []).length > 1) return 'multiplas_opcoes_voos';
    if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'pacote_completo';
    if (conteudoLower.includes('conexão em') && conteudoLower.includes('espera')) return 'aereo_conexao_detalhada';
    
    // Padrão para voo simples se nenhuma outra condição for atendida
    return 'aereo_simples';
}

// ================================================================================
// 5. 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS (ESPECÍFICOS POR MODELO)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino) {
    let prompt = '';
    let destinoFinal = destino || 'EXTRAIR DO CONTEÚDO';

    const regrasGerais = `**REGRAS GERAIS DE FORMATAÇÃO (SEMPRE SEGUIR):**
- **Título**: Use o formato \`*{Companhia} - {Cidade Origem} ✈ {Cidade Destino}*\`. NUNCA use códigos de aeroporto no título.
- **Datas e Horários**: Formate datas como \`DD/MM\` e horários como \`HH:MM\`.
- **Passageiros**: Use zero à esquerda e idades. Ex: \`02 adultos + 01 criança (7 anos)\`.
- **Pagamento**: Use "Primeira parcela" em vez de "Entrada".
- **Bagagem**: Use os termos exatos do manual: "Só mala de mão incluída", "Mala de mão + bagagem despachada", etc.
- **Reembolso**: Use "Não reembolsável" ou "Reembolsável conforme regras do bilhete".
- **Links**: Limpe o texto extra, deixando apenas a URL.
- **Aeroportos**: Converta TODOS os códigos de aeroporto para nomes completos usando a tabela fornecida.
- **Finalização**: SEMPRE termine com "Valores sujeitos a confirmação e disponibilidade."`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS PARA CONSULTA:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'dicas':
            return `Sua tarefa é criar um texto com dicas de viagem para ${destinoFinal}, usando o template 'dicas_completas'. Preencha cada campo com informações REAIS e úteis. Mantenha a seção final da CVC exatamente como está. Sua resposta final deve ser APENAS o texto do template preenchido.\n\n**TEMPLATE:**\n${TEMPLATES.dicas_completas}`;

        case 'multitrecho':
            return `Sua tarefa é converter os dados brutos de uma cotação MULTITRECHO em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE A SER PREENCHIDO:**
${TEMPLATES.multitrecho}

**INSTRUÇÕES:**
1.  **IDENTIFIQUE OS TRECHOS**: Encontre e liste CADA trecho da viagem (Trecho 1, 2, 3, etc.).
2.  **FORMATE CADA TRECHO**: Para cada um, formate a linha do voo como: \`*Trecho X:* {Origem} → {Destino}\\n{Data} - {Aeroporto Origem} {Hora} / {Aeroporto Destino} {Hora} ({Tipo de Voo})\`.
3.  **EXTRAIA DADOS GERAIS**: Encontre o valor total, a forma de pagamento, a política de bagagem e o link.
${regrasGerais}\n${tabelaAeroportos}`;

        case 'multiplas_opcoes_voos':
            return `Sua tarefa é converter os dados brutos de uma cotação com MÚLTIPLAS OPÇÕES de voos em um único orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

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
💳 **Pagamento:** Primeira parcela de R$ 8.698,70 + 4x de R$ 5.069,22
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/link-exemplo-1
---
Valores sujeitos a confirmação e disponibilidade.

**INSTRUÇÕES:**
1.  **CABEÇALHO GERAL**: Crie o cabeçalho com o destino, período e passageiros.
2.  **PARA CADA OPÇÃO**: Crie um título claro, formate os voos, extraia valor, pagamento, reembolso e o link limpo.
3.  **BAGAGEM**: Analise CADA opção para determinar a bagagem e mencione no título da opção.
${regrasGerais}\n${tabelaAeroportos}`;

        case 'aereo_conexao_detalhada':
             return `Sua tarefa é converter os dados brutos de um voo com CONEXÃO DETALHADA em um orçamento formatado.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE A SER PREENCHIDO:**
${TEMPLATES.aereo_conexao_detalhada}

**INSTRUÇÕES:**
1.  Extraia os detalhes de cada trecho da conexão, incluindo os horários e o tempo de espera.
2.  Preencha os campos \`{detalhes_ida}\` e \`{detalhes_volta}\` com as informações formatadas.
${regrasGerais}\n${tabelaAeroportos}`;

        case 'pacote_completo':
            return `Sua tarefa é converter os dados brutos de um PACOTE COMPLETO em um orçamento formatado.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE A SER PREENCHIDO:**
${TEMPLATES.pacote_completo}

**INSTRUÇÕES:**
1.  Extraia os detalhes do voo.
2.  Liste TODAS as opções de hotéis encontradas no texto, formatando cada uma com Localização, Quarto, Regime, Preço e Link.
${regrasGerais}\n${tabelaAeroportos}`;
            
        default: // aereo_simples e outros
            return `Sua tarefa é converter os dados brutos de um voo em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**TEMPLATE A SER PREENCHIDO:**
${TEMPLATES.aereo_simples}

**INSTRUÇÕES:**
1.  Extraia todas as informações do voo (companhia, datas, horários, etc.).
2.  Preencha o template com os dados encontrados.
${regrasGerais}\n${tabelaAeroportos}`;
    }
}
