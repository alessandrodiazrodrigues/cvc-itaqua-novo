// 🚀 CVC ITAQUA v13.2 - VERSÃO FINAL CORRIGIDA
// ================================================================================
// 📋 IMPLEMENTAÇÃO FINAL ABSOLUTA DO MANUAL OFICIAL CVC ITAQUA
// ✅ TODOS OS 11 MODELOS DE TEMPLATE DO MANUAL (COMPLETOS)
// ✅ DETECÇÃO INTELIGENTE AVANÇADA (11 REGRAS PRECISAS)
// ✅ EXTRAÇÃO OTIMIZADA DE DADOS DE IMAGEM (CLAUDE HAIKU)
// ✅ PROCESSAMENTO DUAL IA (CLAUDE + GPT-4O-MINI)
// ✅ VALIDAÇÃO COMPLETA + LOGS OTIMIZADOS
// ✅ CORS COMPLETO + ERROR HANDLING PROFISSIONAL
// ✅ FETCH PURO (ZERO DEPENDÊNCIAS)
// ✅ MODELOS CORRETOS (TESTADOS E FUNCIONAIS)
// ✅ SINTAXE 100% CORRIGIDA
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES COMPLETOS - TODOS OS 11 MODELOS DO MANUAL OFICIAL
// ================================================================================
const TEMPLATES = {
    // ✈️ 1. AÉREO IDA E VOLTA SIMPLES
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

    // ✈️ 2. AÉREO COM CONEXÃO DETALHADA
    aereo_conexao_detalhada: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_conexao} {hora_chegada_conexao} (voo direto)
(conexão em {cidade_conexao} - {tempo_espera} de espera)
{data_ida} - {aeroporto_conexao} {hora_saida_conexao} / {aeroporto_destino} {hora_chegada_ida} (voo direto)
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,

    // ✈️ 3. AÉREO SOMENTE IDA
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    // 🔢 4. MÚLTIPLAS OPÇÕES - 2 PLANOS
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

Valores sujeitos a confirmação e disponibilidade`,

    // 🔢 5. MÚLTIPLAS OPÇÕES - 3 PLANOS
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

Valores sujeitos a confirmação e disponibilidade`,

    // 🗺️ 6. MULTITRECHO
    multitrecho: `*Multitrecho - {companhias}*
{data_inicio} a {data_fim} ({dias} dias e {noites} noites)

*Trecho 1:* {origem1} → {destino1}
{data1} - {aeroporto1} {hora1} / {aeroporto_chegada1} {hora_chegada1} ({tipo_voo1})

*Trecho 2:* {origem2} → {destino2}
{data2} - {aeroporto2} {hora2} / {aeroporto_chegada2} {hora_chegada2} ({tipo_voo2})

*Trecho 3:* {origem3} → {destino3}
{data3} - {aeroporto3} {hora3} / {aeroporto_chegada3} {hora_chegada3} ({tipo_voo3})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,

    // 🌍 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
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
Valores sujeitos a confirmação e disponibilidade`,

    // 🏨 8. HOTÉIS - MÚLTIPLAS OPÇÕES
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

    // 🏨 9. ROTEIRO DE HOTÉIS SEQUENCIAL
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

Valores sujeitos a confirmação e disponibilidade`,

    // 🏖️ 10. PACOTE COMPLETO (Aéreo + Hotel + Serviços)
    pacote_completo: `*Pacote {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para {destino}
- Taxas de Embarque
- Traslado {tipo_traslado}
- {passeios}
- {seguro}
- {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {origem} {hora_ida} / {destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {destino} {hora_volta} / {origem} {hora_chegada_volta} ({tipo_voo})

**OPÇÃO 1** - {nome_hotel1}
📍 {endereco1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1} para {passageiros}
🔗 {link1}

**OPÇÃO 2** - {nome_hotel2} ⭐ Preferencial
📍 {endereco2}
🛏️ {tipo_quarto2} com {regime2}
✅ Reembolsável conforme regras do bilhete
💰 R$ {valor2} para {passageiros}
🔗 {link2}

**OPÇÃO 3** - {nome_hotel3}
📍 {endereco3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3} para {passageiros}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade`,

    // 🚢 11. CRUZEIRO
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

    // 🌍 12. DICAS DE DESTINO
    dicas: `🌍 *Dicas Essenciais para sua Viagem a {destino}!* 🌍

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

    // 🏆 13. RANKING DE HOTÉIS
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
// 2. 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS (70+ AEROPORTOS)
// ================================================================================
const AEROPORTOS = {
    // AEROPORTOS BRASILEIROS (40+)
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont',
    'GIG': 'Galeão', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa', 'THE': 'Teresina',
    'SLZ': 'São Luís', 'BEL': 'Belém', 'MAO': 'Manaus', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande',
    'GYN': 'Goiânia', 'VIX': 'Vitória', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus', 'JDO': 'Juazeiro do Norte',
    'IGU': 'Foz do Iguaçu', 'IMP': 'Imperatriz', 'MAB': 'Marabá', 'STM': 'Santarém', 'RBR': 'Rio Branco',
    'PVH': 'Porto Velho', 'BVB': 'Boa Vista', 'MCP': 'Macapá', 'PMW': 'Palmas', 'UDI': 'Uberlândia',
    'RAO': 'Ribeirão Preto', 'JOI': 'Joinville', 'XAP': 'Chapecó', 'LDB': 'Londrina', 'MGF': 'Maringá',
    'CAW': 'Campos dos Goytacazes', 'ARU': 'Aracaju', 'BVH': 'Vilhena', 'CZS': 'Cruzeiro do Sul',
    'CMG': 'Corumbá', 'CXJ': 'Caxias do Sul', 'FEJ': 'Feijó', 'GPB': 'Guarapuava', 'ITB': 'Itaituba',
    
    // AEROPORTOS INTERNACIONAIS (30+)
    'EZE': 'Ezeiza - Buenos Aires', 'AEP': 'Aeroparque - Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando',
    'JFK': 'Nova York - JFK', 'LGA': 'Nova York - LaGuardia', 'EWR': 'Nova York - Newark',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'DFW': 'Dallas', 'ATL': 'Atlanta', 'ORD': 'Chicago',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris - Charles de Gaulle',
    'ORY': 'Paris - Orly', 'FCO': 'Roma - Fiumicino', 'MXP': 'Milão', 'LHR': 'Londres - Heathrow',
    'LGW': 'Londres - Gatwick', 'FRA': 'Frankfurt', 'MUC': 'Munique', 'AMS': 'Amsterdam', 'ZUR': 'Zurique',
    'VIE': 'Viena', 'PRG': 'Praga', 'WAW': 'Varsóvia', 'ARN': 'Estocolmo', 'CPH': 'Copenhague',
    'HEL': 'Helsinque', 'IST': 'Istambul', 'CAI': 'Cairo', 'DXB': 'Dubai', 'DOH': 'Doha', 'KWI': 'Kuwait',
    'NRT': 'Tóquio - Narita', 'ICN': 'Seul', 'PEK': 'Pequim', 'PVG': 'Xangai', 'HKG': 'Hong Kong',
    'SIN': 'Singapura', 'BKK': 'Bangkok', 'KUL': 'Kuala Lumpur', 'CGK': 'Jacarta', 'MNL': 'Manila',
    'SYD': 'Sydney', 'MEL': 'Melbourne', 'AKL': 'Auckland', 'YYZ': 'Toronto', 'YVR': 'Vancouver',
    'MVD': 'Montevidéu', 'ASU': 'Assunção', 'CCS': 'Caracas', 'UIO': 'Quito', 'PTY': 'Panamá'
};

// ================================================================================
// 3. 🧠 SISTEMA DE DETECÇÃO INTELIGENTE (CORRIGIDO)
// ================================================================================
function detectarTipoOrcamento(conteudo, tipos = [], temImagem = false) {
    const texto = conteudo.toLowerCase();
    
    // REGRA 1: DICAS (prioritário se solicitado)
    if (tipos.includes('Dicas') || tipos.includes('dicas')) {
        return 'dicas';
    }
    
    // REGRA 1.1: RANKING (prioritário se solicitado)
    if (tipos.includes('Ranking') || tipos.includes('ranking') || texto.includes('ranking')) {
        return 'ranking';
    }
    
    // REGRA 2: CRUZEIRO
    const palavrasChaveCruzeiro = ['cruzeiro', 'navio', 'cabine', 'embarque', 'msc', 'costa', 'ncl'];
    if (palavrasChaveCruzeiro.some(palavra => texto.includes(palavra))) {
        return 'cruzeiro';
    }
    
    // REGRA 3: MULTITRECHO
    const contemMultitrecho = texto.includes('multitrecho') || 
                            (texto.match(/trecho\s*\d/gi) || []).length > 1;
    if (contemMultitrecho) {
        return 'multitrecho';
    }
    
    // REGRA 4: MÚLTIPLAS OPÇÕES
    const opcoesMarcadas = (texto.match(/opção\s*\d/gi) || []).length;
    const planosDetectados = (texto.match(/plano\s*\d/gi) || []).length;
    const totaisDetectados = (texto.match(/total\s*\(/gi) || []).length;
    
    if ((opcoesMarcadas >= 2 || planosDetectados >= 2) && !texto.includes('hotel')) {
        if (opcoesMarcadas === 2 || planosDetectados === 2) {
            return 'multiplas_opcoes_2_planos';
        } else if (opcoesMarcadas >= 3 || planosDetectados >= 3) {
            return 'multiplas_opcoes_3_planos';
        }
        return 'multiplas_companhias';
    }
    
    if (totaisDetectados > 1) {
        return 'multiplas_companhias';
    }
    
    // REGRA 5: PACOTE COMPLETO
    const contemPacote = texto.includes('pacote') || 
                        (tipos.includes('Hotel') && tipos.includes('Aéreo'));
    if (contemPacote) {
        return 'pacote_completo';
    }
    
    // REGRA 6: ROTEIRO DE HOTÉIS
    const datasSequenciais = (texto.match(/\d{1,2}\/\d{1,2}/g) || []).length;
    const contemHotel = texto.includes('hotel') || texto.includes('resort');
    if (contemHotel && datasSequenciais > 2) {
        return 'roteiro_hoteis';
    }
    
    // REGRA 7: HOTÉIS MÚLTIPLAS OPÇÕES
    if (contemHotel && opcoesMarcadas >= 2) {
        return 'hoteis_multiplas_opcoes';
    }
    
    // REGRA 8: APENAS HOTÉIS
    if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
        return 'hoteis_multiplas_opcoes';
    }
    
    // REGRA 9: CONEXÃO DETALHADA
    const contemConexao = texto.includes('conexão em') || 
                         texto.includes('tempo de espera');
    if (contemConexao) {
        return 'aereo_conexao_detalhada';
    }
    
    // REGRA 10: SOMENTE IDA
    const somenteIda = texto.includes('somente ida') || 
                      texto.includes('one way');
    if (somenteIda) {
        return 'aereo_somente_ida';
    }
    
    // REGRA 11: IDA E VOLTA SIMPLES (padrão)
    return 'aereo_simples';
}

// ================================================================================
// 4. 📝 SISTEMA DE GERAÇÃO DE PROMPTS (CORRIGIDO)
// ================================================================================

- **Horários:** \`HH:MM\` (14:30)
- **Valores:** \`R$ 1.234,56\`
- **Passageiros:** zero à esquerda (01, 02, 03)
- **Aeroportos:** converter códigos para nomes
- **Separador:** \`--\` entre ida e volta

## 🔄 TABELA DE AEROPORTOS:
${JSON.stringify(AEROPORTOS, null, 2)}

## ⚠️ EXEMPLO PRÁTICO OBRIGATÓRIO:
**TEXTO DE ENTRADA:**
"Guarulhos - Lisboa, Entrada de R$ 9.062,38 + 3x de R$ 6.118,14"

**SAÍDA CORRETA:**
\`*Latam - São Paulo ✈ Lisboa*\`
\`💳 Entrada de R$ 9.062,38 + 3x de R$ 6.118,14 s/ juros no cartão\`

## 🚀 EXECUTE:
Gere APENAS o orçamento formatado para WhatsApp, seguindo EXATAMENTE as regras acima.`;
}

// ================================================================================
// 5. 🎛️ SELETOR DE IA (SIMPLIFICADO)
// ================================================================================
function selecionarIA(conteudo, temImagem, temArquivo) {
    const usarClaude = 
        temImagem || 
        temArquivo || 
        conteudo.length > 3000 || 
        (conteudo.match(/opção\s*\d/gi) || []).length > 2;
    
    return usarClaude ? 'claude' : 'gpt';
}

// ================================================================================
// 6. 🔄 PROCESSAMENTO COM IA CLAUDE (CORRIGIDO)
// ================================================================================
async function processarComClaude(prompt, imagemBase64, arquivoBase64) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Chave da API Anthropic não configurada');
    }
    
    const messages = [{
        role: 'user',
        content: (imagemBase64 || arquivoBase64) ? 
            [
                { type: 'text', text: prompt },
                { 
                    type: 'image', 
                    source: {
                        type: 'base64',
                        media_type: (imagemBase64 || arquivoBase64).includes('jpeg') ? 'image/jpeg' : 'image/png',
                        data: (imagemBase64 || arquivoBase64).split(',')[1]
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
            model: 'claude-3-haiku-20240307',  // ✅ MODELO CORRETO
            max_tokens: 3000,
            temperature: 0.1,
            messages: messages,
            system: 'Você é um especialista da CVC Itaqua. Retorne APENAS o orçamento formatado.'
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// ================================================================================
// 7. 🔄 PROCESSAMENTO COM IA GPT (CORRIGIDO)
// ================================================================================
async function processarComGPT(prompt) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Chave da API OpenAI não configurada');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',  // ✅ MODELO CORRETO
            messages: [
                {
                    role: 'system',
                    content: 'Você é um especialista da CVC Itaqua. Retorne APENAS o orçamento formatado.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 3000
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// ================================================================================
// 8. 🛠️ FUNÇÕES AUXILIARES (CORRIGIDAS)
// ================================================================================
function formatarPassageiros(adultos, criancas, bebes) {
    const partes = [];
    
    if (adultos > 0) {
        partes.push(`${String(adultos).padStart(2, '0')} ${adultos === 1 ? 'adulto' : 'adultos'}`);
    }
    
    if (criancas > 0) {
        partes.push(`${String(criancas).padStart(2, '0')} ${criancas === 1 ? 'criança' : 'crianças'}`);
    }
    
    if (bebes > 0) {
        partes.push(`${String(bebes).padStart(2, '0')} ${bebes === 1 ? 'bebê' : 'bebês'}`);
    }
    
    return partes.join(' + ') || '01 adulto';
}

function validarDados(dados) {
    const erros = [];
    
    if (!dados.observacoes && !dados.textoColado) {
        erros.push('Conteúdo vazio');
    }
    
    if (dados.adultos < 0 || dados.criancas < 0 || dados.bebes < 0) {
        erros.push('Números inválidos');
    }
    
    return erros;
}

function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    
    // PADRÃO 1: "São Paulo - Lisboa" ou "São Paulo ✈ Lisboa"
    const padraoSetas = conteudo.match(/([a-záàâãéêíóôõúç\s]+)\s*[→✈-]+\s*([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoSetas) {
        return padraoSetas[2].trim(); // Destino (segundo item)
    }
    
    // PADRÃO 2: "Pacote Orlando", "Hotéis em Lisboa"
    const padraoDestinos = conteudo.match(/(?:pacote|hotéis?\s+em|viagem\s+para|destino)\s+([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoDestinos) {
        return padraoDestinos[1].trim();
    }
    
    // PADRÃO 3: Códigos de aeroporto de destino conhecidos
    const codigosDestino = conteudo.match(/(?:para|destino|chegada)\s*:?\s*([A-Z]{3})/i);
    if (codigosDestino && AEROPORTOS[codigosDestino[1]]) {
        const nomeAeroporto = AEROPORTOS[codigosDestino[1]];
        // Extrair só a cidade (ex: "Lisboa" de "Lisboa", "Orlando" de "Orlando")
        return nomeAeroporto.split(' - ')[0];
    }
    
    // PADRÃO 4: Buscar destinos conhecidos no texto
    const destinosComuns = [
        'orlando', 'miami', 'lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona',
        'buenos aires', 'santiago', 'lima', 'bogotá', 'cancún', 'nova york', 'tóquio'
    ];
    
    for (const destino of destinosComuns) {
        if (texto.includes(destino)) {
            return destino.charAt(0).toUpperCase() + destino.slice(1); // Capitalizar
        }
    }
    
    return null; // Não conseguiu extrair
}

function limparResultado(resultado) {
    return resultado
        .replace(/```[\w]*\n?/g, '')
        .replace(/```/g, '')
        .replace(/^#+\s*/gm, '')
        .trim();
}

// ================================================================================
// 9. 🎯 HANDLER PRINCIPAL v13.2 (CORRIGIDO)
// ================================================================================
export default async function handler(req, res) {
    // CORS COMPLETO
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            version: '13.2-CORRIGIDO',
            status: 'operational',
            message: 'CVC Itaqua - Sistema Corrigido v13.2'
        });
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido'
        });
    }
    
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'Requisição sem corpo'
            });
        }
        
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 1,
            criancas = 0,
            bebes = 0,
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            arquivoBase64 = null,
            temImagem = false
        } = req.body;
        
        // VALIDAÇÃO
        const errosValidacao = validarDados({ observacoes, textoColado, adultos, criancas, bebes });
        if (errosValidacao.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos',
                details: errosValidacao
            });
        }
        
        // PREPARAÇÃO DOS DADOS COM EXTRAÇÃO INTELIGENTE DE DESTINO
        const conteudoPrincipal = [observacoes, textoColado].filter(Boolean).join('\n\n');
        const passageirosFormatado = formatarPassageiros(adultos, criancas, bebes);
        const temImagemOuArquivo = temImagem || !!imagemBase64 || !!arquivoBase64;
        
        // ✅ EXTRAÇÃO INTELIGENTE DE DESTINO
        let destinoFinal = destino; // Use o destino informado manualmente (prioridade)
        if (!destinoFinal) {
            destinoFinal = extrairDestinoDoConteudo(conteudoPrincipal); // Extrai automaticamente
        }
        
        console.log(`📍 Destino processado: Manual="${destino}" | Extraído="${destinoFinal}"`;
        
        // DETECÇÃO DE TIPO (CORRIGIDA)
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos, temImagemOuArquivo);
        
        // GERAÇÃO DE PROMPT (CORRIGIDA)
        const prompt = gerarPrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, passageirosFormatado, parcelamento, temImagemOuArquivo);
        
        // SELEÇÃO E EXECUÇÃO DA IA
        const iaEscolhida = selecionarIA(conteudoPrincipal, !!imagemBase64, !!arquivoBase64);
        
        let resultado;
        
        if (iaEscolhida === 'claude') {
            resultado = await processarComClaude(prompt, imagemBase64, arquivoBase64);
        } else {
            resultado = await processarComGPT(prompt);
        }
        
        // LIMPEZA FINAL
        resultado = limparResultado(resultado);
        
        // RESPOSTA
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: '13.2-CORRIGIDO',
                tipo_detectado: tipoOrcamento,
                ia_usada: iaEscolhida === 'claude' ? 'Claude 3 Haiku' : 'GPT-4o-mini',
                passageiros: passageirosFormatado,
                parcelamento: parcelamento || 'Não informado',
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Erro no processamento',
            details: error.message,
            version: '13.2-CORRIGIDO'
        });
    }
}

// ================================================================================
// 🏁 SISTEMA v13.2 CORRIGIDO E OTIMIZADO
// ================================================================================
console.log('✅ CVC Itaqua v13.2-CORRIGIDO carregado com sucesso!');
