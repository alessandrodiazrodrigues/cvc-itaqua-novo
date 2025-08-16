// 🚀 CVC ITAQUA v1.7-CORRECAO-VOOS-CONEXAO - API COMPLETA - Esse estava funcionando ontem.
// ================================================================================
// 📑 SISTEMA COMPLETO PARA VERCEL FUNCTIONS
// ================================================================================
// CORREÇÕES v1.7:
// ✅ DETECÇÃO VOOS CONEXÃO: Identificar voos com paradas/conexões automaticamente
// ✅ TEMPLATE CONEXÃO: Seção específica com detalhes de cada trecho e conexões
// ✅ DESTINO CORRETO: São Paulo ✈ Pucallpa (não Lima quando destino final é Pucallpa)
// ✅ TEMPO CONEXÃO: Mostrar tempo de espera em cada conexão
// ✅ PARCELAMENTO SIMPLES: "12x de R$ 272,83 sem juros" (sem primeira parcela)
// ✅ BAGAGEM SIMPLIFICADA: "Bagagem de mão + bolsa pequena incluídas"
// ================================================================================

// ================================================================================
// 📋 TEMPLATES COMPLETOS v1.7
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
{link}

Valores sujeitos a confirmação e disponibilidade (v1.7)`,

    // ⭐ NOVO TEMPLATE PARA VOOS COM CONEXÃO v1.7
    aereo_conexao: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_conexao_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_conexao_volta})

✈️ **Detalhes dos Voos:**
**IDA - {data_ida}:**
{detalhes_ida}

**VOLTA - {data_volta}:**
{detalhes_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v1.7)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.7)`,

    // ⭐ TEMPLATE PACOTE COMPLETO MANTIDO v1.7
    pacote_completo: `*Pacote {destino}*
Embarque: {data_embarque}
Pacote para {passageiros}

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para {destino}
✅ Taxas de Embarque
✅ Traslado {tipo_traslado}
✅ {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{data_ida} - {origem} {hora_ida} / {destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {destino} {hora_volta} / {origem} {hora_chegada_volta} ({tipo_voo_volta})

🏨 *Hotel:*
{nome_hotel}
📍 {endereco_hotel}
🛏️ {tipo_quarto} com {regime_alimentacao}
💰 R$ {valor_hotel} para {passageiros}
✅ {reembolso_hotel}

✅ {bagagem}
🏷️ Aéreo não reembolsável, hotel {reembolso_hotel}

Valores sujeitos a confirmação e disponibilidade (v1.7)`,

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

Fale comigo para adicionar esses serviços ao seu pacote! (v1.7)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.7)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.7)`
};

// ================================================================================
// 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS v1.7
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
    'AMS': 'Amsterdam', 'ZUR': 'Zurich',
    
    // ⭐ AEROPORTOS AMÉRICA DO SUL v1.7
    'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'TRU': 'Trujillo', 'PIU': 'Piura',
    'IQT': 'Iquitos', 'TPP': 'Tarapoto', 'JAU': 'Jauja', 'AYP': 'Ayacucho'
};

// ================================================================================
// 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO v1.7 (APRIMORADA PARA CONEXÕES)
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.7: Extraindo destino de:', conteudo.substring(0, 100) + '...');
    
    // ⭐ PRIORIDADE 1: DESTINO FINAL EM VOOS COM CONEXÃO v1.7
    // Detectar padrão: GRU -> LIM -> PCL (destino final é PCL)
    const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
    if (padraoConexao && padraoConexao.length >= 4) {
        const origem = padraoConexao[1];
        const conexao = padraoConexao[2]; 
        const destinoFinal = padraoConexao[3];
        
        // Se origem é brasileira e destino final é internacional
        if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
            AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
            console.log(`✅ v1.7: DESTINO FINAL detectado em conexão: ${origem} -> ${conexao} -> ${destinoFinal} = ${AEROPORTOS[destinoFinal]}`);
            return AEROPORTOS[destinoFinal];
        }
    }
    
    // PRIORIDADE 2: CÓDIGOS DE AEROPORTO ESPECÍFICOS
    if (conteudo.includes('PCL') || conteudo.includes('Pucallpa')) {
        console.log('✅ v1.7: PUCALLPA detectado por código PCL ou nome direto');
        return 'Pucallpa';
    }
    
    if (conteudo.includes('LIS') || conteudo.includes('Lisboa')) {
        console.log('✅ v1.7: LISBOA detectado por código LIS ou nome direto');
        return 'Lisboa';
    }
    
    // PRIORIDADE 3: ROTA EXPLÍCITA "Guarulhos - Destino"
    const rotaExplicita = conteudo.match(/(Guarulhos|GRU)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
    if (rotaExplicita) {
        const destino = rotaExplicita[2].trim();
        console.log('✅ v1.7: Destino detectado por rota explícita:', destino);
        return destino;
    }
    
    // PRIORIDADE 4: OUTROS CÓDIGOS DE AEROPORTO 
    const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
    if (codigosAeroporto) {
        for (const codigo of codigosAeroporto) {
            if (AEROPORTOS[codigo] && codigo !== 'GRU' && codigo !== 'CGH' && codigo !== 'SDU') {
                const cidade = AEROPORTOS[codigo].split(' - ')[0].split(' (')[0];
                console.log(`✅ v1.7: Destino extraído por código ${codigo}:`, cidade);
                return cidade;
            }
        }
    }
    
    // PRIORIDADE 5: Destinos conhecidos no texto
    const destinosConhecidos = {
        // Destinos Peruanos PRIORITÁRIOS v1.7
        'pucallpa': 'Pucallpa',
        'lima': 'Lima',
        'cusco': 'Cusco',
        'arequipa': 'Arequipa',
        'iquitos': 'Iquitos',
        
        // Destinos Brasileiros 
        'joão pessoa': 'João Pessoa',
        'brasília': 'Brasília',
        'salvador': 'Salvador',
        'rio de janeiro': 'Rio de Janeiro',
        'belo horizonte': 'Belo Horizonte',
        
        // Destinos Europeus
        'lisboa': 'Lisboa',
        'porto': 'Porto', 
        'madrid': 'Madrid', 
        'barcelona': 'Barcelona',
        'paris': 'Paris', 
        'londres': 'Londres',
        'roma': 'Roma', 
        'amsterdam': 'Amsterdam',
        
        // Destinos Americanos
        'orlando': 'Orlando', 
        'miami': 'Miami', 
        'nova york': 'Nova York', 
        'los angeles': 'Los Angeles',
        
        // América Latina  
        'buenos aires': 'Buenos Aires', 
        'santiago': 'Santiago', 
        'bogota': 'Bogotá'
    };
    
    // Buscar destinos conhecidos (priorizar Pucallpa)
    if (texto.includes('pucallpa') || texto.includes('pcl')) {
        console.log('✅ v1.7: PUCALLPA detectado por busca no texto');
        return 'Pucallpa';
    }
    
    for (const [chave, nome] of Object.entries(destinosConhecidos)) {
        if (texto.includes(chave)) {
            console.log(`✅ v1.7: Destino ${nome} detectado por palavra-chave`);
            return nome;
        }
    }
    
    console.log('⚠️ v1.7: Nenhum destino identificado no conteúdo');
    return null;
}

// ================================================================================
// 🔍 FUNÇÃO DE DETECÇÃO DE VOOS COM CONEXÃO v1.7
// ================================================================================
function detectarVooComConexao(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.7: Verificando se é voo com conexão...');
    
    // INDICADORES DE CONEXÃO
    const indicadoresConexao = [
        'voo com paradas',
        'conexão',
        'espera de',
        'parada em',
        'escala',
        'connecting flight'
    ];
    
    // PADRÃO DE MÚLTIPLOS TRECHOS
    const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
    const temTempoEspera = texto.includes('espera de') || texto.includes('conexão');
    const temIndicadores = indicadoresConexao.some(ind => texto.includes(ind));
    
    const ehConexao = temMultiplosTrechos || temTempoEspera || temIndicadores;
    
    console.log(`✅ v1.7: Voo com conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
    console.log(`   - Múltiplos trechos: ${temMultiplosTrechos}`);
    console.log(`   - Tempo espera: ${temTempoEspera}`);
    console.log(`   - Indicadores: ${temIndicadores}`);
    
    return ehConexao;
}

// ================================================================================
// 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO v1.7 (CONEXÃO ADICIONADA)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    console.log('🔍 v1.7: Detectando tipo de orçamento...');
    console.log('📋 v1.7: Tipos selecionados:', tipos);
    
    // ⭐ PRIORIDADE 1: TIPOS SELECIONADOS PELO USUÁRIO
    if (tipos && tipos.length > 0) {
        // VERIFICAR SE É PACOTE (aéreo + hotel)
        const temAereo = tipos.includes('Aéreo');
        const temHotel = tipos.includes('Hotel');
        
        if (temAereo && temHotel) {
            console.log('✅ v1.7: PACOTE COMPLETO detectado por tipos selecionados (Aéreo + Hotel)');
            return 'pacote_completo';
        }
        
        // Outros tipos solicitados
        if (tipos.includes('Dicas')) {
            console.log('✅ v1.7: Tipo detectado: dicas_completas');
            return 'dicas_completas';
        }
        if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) {
            console.log('✅ v1.7: Tipo detectado: ranking');
            return 'ranking';
        }
    }
    
    // PRIORIDADE 2: DETECÇÃO POR CONTEÚDO ESPECÍFICO
    // Cruzeiro sempre tem prioridade alta
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
        console.log('✅ v1.7: Tipo detectado: cruzeiro');
        return 'cruzeiro';
    }
    
    // ⭐ NOVA PRIORIDADE v1.7: VOOS COM CONEXÃO
    if (detectarVooComConexao(conteudoPrincipal)) {
        console.log('✅ v1.7: Tipo detectado: aereo_conexao');
        return 'aereo_conexao';
    }
    
    // Multitrecho específico
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
        console.log('✅ v1.7: Tipo detectado: multitrecho');
        return 'multitrecho';
    }
    
    // PRIORIDADE 3: DETECÇÃO DE MÚLTIPLAS OPÇÕES
    const temOpcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length >= 2;
    const valoresTotal = (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length;
    const linksDetectados = (conteudoPrincipal.match(/https:\/\/[^\s]+/g) || []).length;
    
    const naoEPacote = !(tipos?.includes('Aéreo') && tipos?.includes('Hotel'));
    
    if (naoEPacote && (temOpcoesMarcadas || valoresTotal >= 2 || linksDetectados >= 2)) {
        console.log('✅ v1.7: Tipo detectado: multiplas_opcoes_2_planos');
        return 'multiplas_opcoes_2_planos';
    }
    
    // PADRÃO: AÉREO SIMPLES
    console.log('✅ v1.7: Usando tipo padrão: aereo_simples');
    return 'aereo_simples';
}

// ================================================================================
// 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS v1.7 (CONEXÃO ADICIONADA)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    // Extrair destino automaticamente se necessário
    let destinoFinal = destino;
    
    if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
        const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
        if (destinoExtraido) {
            destinoFinal = destinoExtraido;
            console.log('✅ v1.7: Destino extraído automaticamente:', destinoFinal);
        } else {
            destinoFinal = destino || 'Destino não identificado';
        }
    }
    
    let infoParcelamento = parcelamento ? 
        `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
        'EXTRAIR PARCELAMENTO DO TEXTO - FORMATO SIMPLES: "12x de R$ 272,83 sem juros" (sem primeira parcela)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v1.7:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Pucallpa* (GRU = São Paulo, PCL = Pucallpa)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ PCL")
- **Datas e Horários**: DD/MM (15/09) e HH:MM (03:40)
- **Valores**: R$ 3.274,00 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **PARCELAMENTO - REGRA CRÍTICA v1.7**: 
  * FORMATO SIMPLES: "12x de R$ 272,83 sem juros" 
  * NÃO USAR: "primeira parcela + parcelas" 
  * EXEMPLO CORRETO: "12x de R$ 272,83 sem juros"
  * SE À VISTA: "À vista R$ {valor}"
- **BAGAGEM SIMPLIFICADA v1.7**: "Bagagem de mão + bolsa pequena incluídas" (resumir informações)
- **Links**: Incluir URLs que apareçam no texto (limpar se necessário)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.7)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS v1.7:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'aereo_conexao':
            return `Crie um orçamento de VOO COM CONEXÃO para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA VOOS COM CONEXÃO v1.7:**
1. O destino FINAL é OBRIGATORIAMENTE: ${destinoFinal}
2. DETECTAR TRECHOS:
   - ORIGEM → CONEXÃO (horário ida, horário chegada, duração)
   - CONEXÃO → DESTINO FINAL (horário saída, horário chegada, duração)
   - VOLTA: DESTINO → CONEXÃO → ORIGEM
3. TEMPO DE CONEXÃO: Calcular e mostrar tempo de espera entre voos
4. FORMATO DETALHES:
   * Guarulhos 03:40 / Lima 07:00 (5h20min - voo direto)
   * **Conexão em Lima: 7h05min**
   * Lima 14:05 / Pucallpa 15:25 (1h20min - voo direto)
5. USAR TEMPLATE AEREO_CONEXAO exatamente como fornecido
6. TÍTULO: *Latam - São Paulo ✈ ${destinoFinal}* (cidade de origem ✈ cidade destino final)

**DESTINO FINAL OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.aereo_conexao}

${regrasGerais}
${tabelaAeroportos}`;

        case 'pacote_completo':
            return `Crie um orçamento de PACOTE COMPLETO (aéreo + hotel) para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA PACOTE v1.7:**
1. O destino é OBRIGATORIAMENTE: ${destinoFinal}
2. SEPARAR INFORMAÇÕES:
   - AÉREO: companhia, datas, horários, aeroportos
   - HOTEL: nome, endereço, tipo de quarto, regime alimentação, valor
3. VALOR DO HOTEL: Identificar o valor R$ que pertence ao HOTEL (não ao aéreo)
4. INFORMAÇÕES DO HOTEL obrigatórias:
   - Nome: extrair nome completo do hotel
   - Endereço: rua, número, bairro, cidade
   - Quarto: tipo de acomodação (Standard Single, etc.)
   - Regime: café da manhã, meia pensão, etc.
5. REEMBOLSO SEPARADO: aéreo e hotel podem ter políticas diferentes
6. CALCULAR NOITES: diferença entre data embarque e retorno
7. USAR O TEMPLATE PACOTE_COMPLETO exatamente como fornecido

**DESTINO OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.pacote_completo}

${regrasGerais}
${tabelaAeroportos}`;

        case 'dicas_completas':
            return `Crie dicas de viagem específicas e úteis para ${destinoFinal}.

**INSTRUÇÕES ESPECÍFICAS CRÍTICAS:**
1. O destino é OBRIGATORIAMENTE: ${destinoFinal}
2. Use informações REAIS e ESPECÍFICAS de ${destinoFinal}
3. Mencione restaurantes, atrações e experiências EXCLUSIVOS de ${destinoFinal}
4. NUNCA use informações de outros destinos
5. Se o destino for Pucallpa: fale de Rio Ucayali, culinária amazônica, etc.
6. SEMPRE adapte 100% do conteúdo ao destino correto

**DESTINO OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.dicas_completas}`;

        case 'ranking':
            return `Crie um ranking de hotéis específico para ${destinoFinal}.

**INSTRUÇÕES ESPECÍFICAS CRÍTICAS:**
1. O destino é OBRIGATORIAMENTE: ${destinoFinal}
2. Use hotéis REAIS que existem em ${destinoFinal}
3. Inclua notas realistas das plataformas (Google /5, Booking /10, TripAdvisor /5)
4. Mencione localizações ESPECÍFICAS de ${destinoFinal} (bairros, pontos turísticos reais)
5. NUNCA misturar informações de outros destinos

**DESTINO OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.ranking}`;

        default:
            return `Converta os dados brutos em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**DESTINO IDENTIFICADO:** ${destinoFinal}

**INSTRUÇÕES ESPECÍFICAS DE ANÁLISE v1.7:**
1. DETECTAR MÚLTIPLAS OPÇÕES: Se há múltiplos valores "Total" ou múltiplas datas, use template de múltiplas opções
2. PARCELAMENTO SIMPLES v1.7: Use formato "12x de R$ 272,83 sem juros" (sem primeira parcela)
3. SE À VISTA: usar "À vista R$ {valor}"
4. BAGAGEM SIMPLIFICADA: "Bagagem de mão + bolsa pequena incluídas"
5. Leia CUIDADOSAMENTE todo o texto para identificar:
   - Bagagens mencionadas
   - Serviços extras
   - Múltiplos voos: diferentes datas/valores para mesmo destino
6. Converta códigos de aeroporto para nomes de cidades no título
7. Mantenha horários e datas exatamente como fornecidos

**TEMPLATE:**
${TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
    }
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API v1.7 (VERSÃO ATUALIZADA)
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
            version: '1.7-CORRECAO-VOOS-CONEXAO',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v1.7 - Correção voos com conexão e template detalhado',
            ia_usada: 'ready',
            correcoes_v17: [
                '✅ Detecção voos conexão: Identificar voos com paradas/conexões automaticamente',
                '✅ Template conexão: Seção específica com detalhes de cada trecho e conexões',
                '✅ Destino correto: São Paulo ✈ Pucallpa (não Lima quando destino final é Pucallpa)',
                '✅ Tempo conexão: Mostrar tempo de espera em cada conexão',
                '✅ Parcelamento simples: "12x de R$ 272,83 sem juros" (sem primeira parcela)',
                '✅ Bagagem simplificada: "Bagagem de mão + bolsa pequena incluídas"'
            ]
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
        console.log('🚀 v1.7: Início do processamento POST...');
        
        // Validar se tem body
        if (!req.body) {
            console.error('❌ v1.7: Requisição sem body');
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

        console.log('📋 v1.7: Dados recebidos:', { 
            observacoes: observacoes.substring(0, 50) + '...', 
            destino, 
            tipos,
            temImagem: !!imagemBase64,
            temPDF: !!pdfContent,
            deteccao_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
            deteccao_conexao: detectarVooComConexao(observacoes || textoColado || pdfContent || '')
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
            console.log('📝 v1.7: Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
            console.log(`✅ v1.7: Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('❌ v1.7: Erro na geração do prompt:', promptError);
            return res.status(500).json({ 
                success: false, 
                error: 'Falha ao montar a requisição para a IA',
                details: promptError.message 
            });
        }

        // --- Bloco de Chamada da IA ---
        let resultado, iaUsada;
        try {
            console.log('🤖 v1.7: Iniciando chamada à IA...');
            
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo exatamente o modelo e as regras fornecidas. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v1.7: Usando Claude para caso complexo...');
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
                console.log('⚡ v1.7: Usando GPT-4o-mini...');
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
            
            console.log('✅ v1.7: Chamada à IA concluída com sucesso.');
            
        } catch (aiError) {
            console.error('❌ v1.7: Erro na chamada da IA:', aiError);
            
            // Fallback para resposta mock em caso de erro
            console.log('🔄 v1.7: Usando resposta de fallback...');
            
            const tipoDetectado = detectOrcamentoType(conteudoPrincipal, tipos);
            
            if (tipoDetectado === 'aereo_conexao') {
                resultado = `*Latam - São Paulo ✈ Pucallpa*

15/09 - Guarulhos 03:40 / Pucallpa 15:25 (conexão em Lima)
--
30/09 - Pucallpa 20:20 / Guarulhos 06:15 (+1 dia) (conexão em Lima)

✈️ **Detalhes dos Voos:**
**IDA - 15/09:**
* Guarulhos 03:40 / Lima 07:00 (5h20min - voo direto)
* **Conexão em Lima: 7h05min**
* Lima 14:05 / Pucallpa 15:25 (1h20min - voo direto)

**VOLTA - 30/09:**
* Pucallpa 20:20 / Lima 21:25 (1h05min - voo direto)
* **Conexão em Lima: 1h50min**
* Lima 23:15 / Guarulhos 06:15 (+1) (5h00min - voo direto)

💰 R$ 3.274,00 para 01 adulto
💳 12x de R$ 272,83 sem juros
✅ Bagagem de mão + bolsa pequena incluídas
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v1.7)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            } else {
                resultado = `*Latam - São Paulo ✈ ${destino || 'Pucallpa'}*

15/09 - Guarulhos 03:40 / ${destino || 'Pucallpa'} 15:25 (Voo direto)
--
30/09 - ${destino || 'Pucallpa'} 20:20 / Guarulhos 06:15 (+1 dia) (Voo direto)

💰 R$ 3.274,00 para 01 adulto
💳 ${parcelamento ? `${parcelamento}x de R$ ${(3274/parcelamento).toFixed(2)} sem juros` : '12x de R$ 272,83 sem juros'}
✅ Bagagem de mão + bolsa pequena incluídas
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v1.7)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            }
            
            iaUsada = 'fallback-v1.7';
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('✅ v1.7: Processamento concluído. Enviando resposta...');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: { 
                version: '1.7-CORRECAO-VOOS-CONEXAO', 
                timestamp: new Date().toISOString(),
                tipo: detectOrcamentoType(conteudoPrincipal, tipos),
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal),
                eh_voo_conexao: detectarVooComConexao(conteudoPrincipal),
                debug_info: {
                    conteudo_length: conteudoPrincipal.length,
                    tipos_selecionados: tipos,
                    eh_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
                    tem_pucallpa: conteudoPrincipal.includes('Pucallpa') || conteudoPrincipal.includes('PCL'),
                    tem_lima_conexao: conteudoPrincipal.toLowerCase().includes('lima') && conteudoPrincipal.toLowerCase().includes('espera'),
                    tem_multiplos_trechos: (conteudoPrincipal.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2,
                    tem_voo_paradas: conteudoPrincipal.toLowerCase().includes('voo com paradas'),
                    multiplos_valores: (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length,
                    valor_encontrado: conteudoPrincipal.match(/R\$\s*[\d.,]+/),
                    codigos_aeroporto: conteudoPrincipal.match(/\b[A-Z]{3}\b/g)
                }
            }
        });

    } catch (error) {
        console.error('❌ v1.7: Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '1.7-CORRECAO-VOOS-CONEXAO',
            timestamp: new Date().toISOString()
        });
    }
}

console.log('✅ CVC Itaqua v1.7-CORRECAO-VOOS-CONEXAO - api/ai-google.js completo!');
console.log('🔧 Correções v1.7 aplicadas:');
console.log('  - ✅ DETECÇÃO VOOS CONEXÃO: Identificação automática de voos com paradas/conexões');
console.log('  - ✅ TEMPLATE CONEXÃO: Seção específica "Detalhes dos Voos" com trechos separados');
console.log('  - ✅ DESTINO CORRETO: São Paulo ✈ Pucallpa (não Lima para destino final Pucallpa)');
console.log('  - ✅ TEMPO CONEXÃO: Cálculo e exibição do tempo de espera em cada conexão');
console.log('  - ✅ PARCELAMENTO SIMPLES: "12x de R$ 272,83 sem juros" (removido primeira parcela)');
console.log('  - ✅ BAGAGEM SIMPLIFICADA: "Bagagem de mão + bolsa pequena incluídas"');
console.log('  - ✅ AEROPORTOS PERUANOS: Adicionados PCL, CUZ, IQT e outros');
console.log('  - ✅ FALLBACK CONEXÃO: Resposta específica para voos com conexão em modo fallback');

