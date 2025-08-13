// 🚀 CVC ITAQUA v8.4 - CORREÇÕES CRÍTICAS
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (CORRIGIDOS)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API (COM DEPURACAO)
// 4. PROCESSAMENTO DE DADOS (EM BLOCO SEGURO)
// 5. GERAÇÃO DE PROMPTS (EM BLOCO SEGURO)
// 6. PROCESSAMENTO COM IA (EM BLOCO SEGURO)
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (CORRIGIDOS)
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

    // NOVO TEMPLATE PARA PACOTE COM MÚLTIPLOS HOTÉIS
    pacote_completo_multiplos: `*Pacote ✈ {destino}*
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

**OPÇÃO 3** - {nome_hotel3}
📍 {endereco3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3} para {passageiros}
{link3}

{opcoes_extras}

{parcelamento}
{reembolso}
Valores sujeitos a confirmação e disponibilidade`,

    // TEMPLATE PARA DICAS ESPECÍFICAS
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

✈️ Quer um orçamento personalizado? Me chama! 🌟

Valores sujeitos a confirmação e disponibilidade`,

    // TEMPLATE PARA RANKING DE HOTÉIS
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

💡 Quer reservar algum desses? Me chama! 📲

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
// 3. 🎯 HANDLER PRINCIPAL DA API v8.4
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
        return res.status(200).json({ success: true, status: 'operational', version: '8.4' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método não suportado.' });
    }

    // --- Início do Bloco Principal Try/Catch ---
    try {
        console.log('v8.4: 📥 Início do processamento POST.');
        const {
            observacoes = '', textoColado = '', destino = '', idadesCriancas = [],
            tipos = [], parcelamento = null, imagemBase64 = null,
            arquivoBase64 = null, temImagem = false
        } = req.body;

        let infoPassageiros, destinoFinal, prompt, resultado, iaUsada, tipoDetectado;

        // --- Bloco de Processamento de Dados ---
        try {
            console.log('v8.4: 📊 Iniciando processamento de dados...');
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
                // Detectar do conteúdo
                const adultoMatch = conteudoLower.match(/(\d+)\s*adulto/);
                if (adultoMatch) {
                    infoPassageiros = `${String(parseInt(adultoMatch[1])).padStart(2, '0')} ${parseInt(adultoMatch[1]) === 1 ? 'adulto' : 'adultos'}`;
                } else {
                    infoPassageiros = "02 adultos"; // Valor padrão do exemplo
                }
            }

            destinoFinal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
            if (!destinoFinal && conteudoPrincipal) {
                const padraoDestino = conteudoLower.match(/(?:orlando|miami|cancún|porto seguro|maceió|fortaleza|lisboa|porto|paris|buenos aires|santiago|nova york|new york|rio de janeiro|gramado|natal|joão pessoa|foz do iguaçu|salvador|recife|roma|londres|barcelona|madrid)/i);
                if (padraoDestino) {
                    destinoFinal = padraoDestino[0].replace(/^\w/, c => c.toUpperCase());
                }
            }
             console.log('v8.4: ✅ Processamento de dados concluído.');
        } catch (dataError) {
            console.error('v8.4: ❌ Erro no processamento de dados:', dataError);
            return res.status(500).json({ success: false, error: 'Falha ao processar os dados de entrada.', details: dataError.message, stage: 'data-processing' });
        }

        // --- Bloco de Geração de Prompt ---
        try {
            console.log('v8.4: 📝 Iniciando geração de prompt...');
            const conteudoPrincipal = (observacoes || textoColado || '').toString();
            const conteudoLower = conteudoPrincipal.toLowerCase();
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS).map(([codigo, nome]) => `${codigo} → ${nome}`).join('\n');

            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel');
            const isCarro = conteudoLower.includes('locação') || conteudoLower.includes('locacao');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo');
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('pacote inclui') || conteudoLower.includes('o pacote inclui');
            const isSomenteIda = conteudoLower.includes('somente ida');
            const temMultiplasOpcoes = (conteudoLower.match(/opção \d/g) || []).length > 1;
            const isMultitrecho = conteudoLower.includes('multitrecho');
            const temConexaoDetalhada = conteudoLower.includes('conexão em');
            const isCruzeiro = conteudoLower.includes('cruzeiro');
            const temNaoReembolsavel = conteudoLower.includes('não reembolsável');
            const temInfoParcelamento = conteudoLower.includes('entrada de r$') || conteudoLower.includes('x de r$') || parcelamento !== null;

            let templateEspecifico = 'aereo_ida_volta';
            
            // LÓGICA ESPECÍFICA PARA DICAS E RANKING
            if (isDicas) {
                templateEspecifico = 'dicas_especificas';
                prompt = `SISTEMA CVC ITAQUA v8.4 - GERAÇÃO DE DICAS

DESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}
DADOS: ${conteudoPrincipal}

INSTRUÇÕES CRÍTICAS:
1. Use o template 'dicas_especificas' com informações REAIS sobre ${destinoFinal || 'o destino mencionado'}
2. NUNCA use informações genéricas
3. Pesquise no seu conhecimento dados específicos sobre o destino
4. Inclua preços aproximados, épocas específicas, atrações reais
5. Formate para WhatsApp
6. Termine sempre com "Valores sujeitos a confirmação e disponibilidade"

TEMPLATE: ${TEMPLATES.dicas_especificas}`;
            } else if (isRanking) {
                templateEspecifico = 'ranking_hoteis';
                prompt = `SISTEMA CVC ITAQUA v8.4 - RANKING DE HOTÉIS

DESTINO: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}
DADOS: ${conteudoPrincipal}

INSTRUÇÕES CRÍTICAS:
1. Use o template 'ranking_hoteis' com hotéis REAIS
2. Pesquise no seu conhecimento hotéis específicos do destino
3. Inclua preços aproximados reais
4. Use localizações verdadeiras
5. Formate para WhatsApp
6. Termine sempre com "Valores sujeitos a confirmação e disponibilidade"

TEMPLATE: ${TEMPLATES.ranking_hoteis}`;
            } else {
                // Lógica normal para orçamentos
                if (isPacote) {
                    // Verificar se tem mais de 3 hotéis
                    const opcoes = (conteudoPrincipal.match(/total \(2 adultos\)/gi) || []).length;
                    if (opcoes > 3) {
                        templateEspecifico = 'pacote_completo_multiplos';
                    } else {
                        templateEspecifico = 'pacote_completo';
                    }
                } else if (isSomenteIda) {
                    templateEspecifico = 'aereo_somente_ida';
                } else if (temMultiplasOpcoes) {
                    templateEspecifico = 'multiplas_opcoes_2';
                } else if (isMultitrecho) {
                    templateEspecifico = 'multitrecho';
                } else if (temConexaoDetalhada) {
                    templateEspecifico = 'aereo_conexao_detalhada';
                } else if (isCruzeiro) {
                    templateEspecifico = 'cruzeiro';
                } else if (isCarro) {
                    templateEspecifico = 'locacao_carro';
                } else if (isHotel && !temAereo) {
                    templateEspecifico = 'hoteis_multiplas_opcoes';
                }

                prompt = `🚀 SISTEMA CVC ITAQUA v8.4
DADOS DO CLIENTE: ${conteudoPrincipal}
ANÁLISE: Destino: ${destinoFinal || 'EXTRAIR'}, Passageiros: ${infoPassageiros || 'EXTRAIR'}, Template: ${templateEspecifico}
AEROPORTOS (converter): ${tabelaAeroportos}
TEMPLATES: ${templatesString}

📋 REGRAS CRÍTICAS:
1. TÍTULO: "*Companhia ✈ Destino*" (use NOMES de cidades, não códigos)
2. BAGAGEM: Padrão é "✅ Inclui 1 mala de mão + 1 item pessoal"
3. VOOS: Formato "DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo)". Separar com "--"
4. DATAS: Para período de 06/11 a 11/11 são exatamente 5 noites, não 6
5. REEMBOLSO: Se "Não reembolsável", inclua "🏷️ Não reembolsável". Se for reembolsável, NÃO mencione
6. LINKS: Mantenha os links originais da CVC quando fornecidos
7. FINALIZAÇÃO: Sempre terminar com "Valores sujeitos a confirmação e disponibilidade"
8. PASSAGEIROS: Detectar corretamente (exemplo tem "2 Adultos" = "02 adultos")

TEMPLATE ESPECÍFICO: ${templateEspecifico}
Use este template exatamente e substitua as variáveis pelos dados reais.`;
            }
            
            console.log('v8.4: ✅ Geração de prompt concluída.');
        } catch (promptError) {
            console.error('v8.4: ❌ Erro na geração do prompt:', promptError);
            return res.status(500).json({ success: false, error: 'Falha ao montar a requisição para a IA.', details: promptError.message, stage: 'prompt-generation' });
        }

        // --- Bloco de Chamada da IA ---
        try {
            console.log('v8.4: 🤖 Iniciando chamada à IA...');
            iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (observacoes.length + textoColado.length > 2000);
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Siga EXATAMENTE os templates e regras fornecidos. NUNCA invente informações que não estejam nos dados. Converta todos os códigos de aeroportos para nomes. Formate para WhatsApp. Para dicas e rankings, use informações reais do seu conhecimento sobre o destino.';

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
            console.log('v8.4: ✅ Chamada à IA concluída.');
        } catch (aiError) {
            console.error('v8.4: ❌ Erro na chamada da IA:', aiError);
            return res.status(500).json({ success: false, error: 'Falha ao comunicar com o serviço de IA.', details: aiError.message, stage: 'ai-call' });
        }

        console.log('v8.4: ✅ Processamento geral concluído. Enviando resposta...');
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: { version: '8.4', ia_usada: iaUsada, destino: destinoFinal, template_usado: templateEspecifico }
        });

    } catch (error) {
        // Este é o 'catch' final para erros totalmente inesperados.
        console.error('v8.4: ❌ Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Ocorreu um erro inesperado no servidor.',
            details: error.message,
            version: '8.4',
            stage: 'handler-main'
        });
    }
}
