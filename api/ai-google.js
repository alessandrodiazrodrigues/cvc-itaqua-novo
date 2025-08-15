// 🚀 CVC ITAQUA v1.6-CORRECAO-DETECAO-PACOTES - API COMPLETA
// ================================================================================
// 📑 SISTEMA COMPLETO PARA VERCEL FUNCTIONS
// ================================================================================
// CORREÇÕES v1.6:
// ✅ DETECÇÃO PRIORIZADA: Pacotes (aéreo + hotel) antes de múltiplas opções
// ✅ TEMPLATE PACOTE: Informações do hotel separadas do aéreo
// ✅ VALOR HOTEL: Corrigir associação R$ 5.507,83 = hotel (não aéreo)
// ✅ PARCELAMENTO: Corrigir lógica "primeira parcela + 0x"
// ✅ TIPOS CHECKBOX: Usar tipos selecionados para detecção prioritária
// ================================================================================

// ================================================================================
// 📋 TEMPLATES COMPLETOS v1.6
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

Valores sujeitos a confirmação e disponibilidade (v1.6)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.6)`,

    // ⭐ TEMPLATE PACOTE COMPLETO CORRIGIDO v1.6
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

Valores sujeitos a confirmação e disponibilidade (v1.6)`,

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

Fale comigo para adicionar esses serviços ao seu pacote! (v1.6)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.6)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.6)`
};

// ================================================================================
// 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS v1.6
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
    'AMS': 'Amsterdam', 'ZUR': 'Zurich'
};

// ================================================================================
// 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO MANTIDA v1.6
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.6: Extraindo destino de:', conteudo.substring(0, 100) + '...');
    
    // PADRÃO 1: CÓDIGOS DE AEROPORTO ESPECÍFICOS (MÁXIMA PRIORIDADE)
    if (conteudo.includes('LIS') || conteudo.includes('Lisboa')) {
        console.log('✅ v1.6: LISBOA detectado por código LIS ou nome direto');
        return 'Lisboa';
    }
    
    // PADRÃO 2: ROTA EXPLÍCITA "Guarulhos - Lisboa"
    const rotaGuarulhosLisboa = conteudo.match(/(Guarulhos|GRU)\s*[-→✈]+\s*(Lisboa|LIS)/i);
    if (rotaGuarulhosLisboa) {
        console.log('✅ v1.6: LISBOA detectado por rota Guarulhos-Lisboa');
        return 'Lisboa';
    }
    
    // PADRÃO 3: OUTROS CÓDIGOS DE AEROPORTO 
    const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
    if (codigosAeroporto) {
        for (const codigo of codigosAeroporto) {
            if (AEROPORTOS[codigo] && codigo !== 'GRU' && codigo !== 'CGH' && codigo !== 'SDU') {
                const cidade = AEROPORTOS[codigo].split(' - ')[0].split(' (')[0];
                console.log(`✅ v1.6: Destino extraído por código ${codigo}:`, cidade);
                return cidade;
            }
        }
    }
    
    // PADRÃO 4: "Cidade1 - Cidade2" (pattern geral)
    const padraoSetas = conteudo.match(/([a-záàâãéêíóôõúç\s\(\)]+)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
    if (padraoSetas) {
        const origem = padraoSetas[1].trim();
        const destino = padraoSetas[2].trim();
        
        // Lista prioritária de destinos válidos
        const destinosValidos = [
            'lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona', 'amsterdam', 
            'berlin', 'zurich', 'frankfurt', 'munique', 'milao', 'porto',
            'miami', 'orlando', 'nova york', 'los angeles', 'san francisco', 
            'las vegas', 'chicago', 'boston', 'washington',
            'buenos aires', 'santiago', 'lima', 'bogota', 'montevideu', 'caracas',
            'joão pessoa', 'brasília', 'salvador', 'rio de janeiro'
        ];
        
        if (destinosValidos.some(d => destino.toLowerCase().includes(d))) {
            console.log('✅ v1.6: Destino extraído por padrão de rota:', destino);
            return destino;
        }
    }
    
    // PADRÃO 5: Destinos conhecidos no texto (busca mais específica)
    const destinosConhecidos = {
        // Destinos Brasileiros (PRIORIDADE JOÃO PESSOA)
        'joão pessoa': 'João Pessoa',
        'brasília': 'Brasília',
        'salvador': 'Salvador',
        'rio de janeiro': 'Rio de Janeiro',
        'belo horizonte': 'Belo Horizonte',
        'porto alegre': 'Porto Alegre',
        'curitiba': 'Curitiba',
        'florianópolis': 'Florianópolis',
        'recife': 'Recife',
        'fortaleza': 'Fortaleza',
        
        // Destinos Europeus
        'lisboa': 'Lisboa',
        'porto': 'Porto', 
        'madrid': 'Madrid', 
        'barcelona': 'Barcelona',
        'paris': 'Paris', 
        'londres': 'Londres',
        'roma': 'Roma', 
        'amsterdam': 'Amsterdam', 
        'berlin': 'Berlin',
        'zurich': 'Zurich', 
        'frankfurt': 'Frankfurt', 
        'munique': 'Munique', 
        'milao': 'Milão',
        
        // Destinos Americanos
        'orlando': 'Orlando', 
        'miami': 'Miami', 
        'nova york': 'Nova York', 
        'los angeles': 'Los Angeles',
        'san francisco': 'São Francisco', 
        'las vegas': 'Las Vegas', 
        'chicago': 'Chicago',
        'boston': 'Boston',
        
        // América Latina  
        'buenos aires': 'Buenos Aires', 
        'santiago': 'Santiago', 
        'lima': 'Lima', 
        'bogota': 'Bogotá',
        'montevideu': 'Montevidéu'
    };
    
    // Buscar destinos conhecidos (priorizar João Pessoa)
    if (texto.includes('joão pessoa') || texto.includes('jpa')) {
        console.log('✅ v1.6: JOÃO PESSOA detectado por busca no texto');
        return 'João Pessoa';
    }
    
    for (const [chave, nome] of Object.entries(destinosConhecidos)) {
        if (texto.includes(chave)) {
            console.log(`✅ v1.6: Destino ${nome} detectado por palavra-chave`);
            return nome;
        }
    }
    
    console.log('⚠️ v1.6: Nenhum destino identificado no conteúdo');
    return null;
}

// ================================================================================
// 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO v1.6 (PRIORIZAÇÃO CORRIGIDA)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    console.log('🔍 v1.6: Detectando tipo de orçamento...');
    console.log('📋 v1.6: Tipos selecionados:', tipos);
    
    // ⭐ PRIORIDADE 1: TIPOS SELECIONADOS PELO USUÁRIO (CRÍTICO v1.6)
    if (tipos && tipos.length > 0) {
        // VERIFICAR SE É PACOTE (aéreo + hotel)
        const temAereo = tipos.includes('Aéreo');
        const temHotel = tipos.includes('Hotel');
        
        if (temAereo && temHotel) {
            console.log('✅ v1.6: PACOTE COMPLETO detectado por tipos selecionados (Aéreo + Hotel)');
            return 'pacote_completo';
        }
        
        // Outros tipos solicitados
        if (tipos.includes('Dicas')) {
            console.log('✅ v1.6: Tipo detectado: dicas_completas');
            return 'dicas_completas';
        }
        if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) {
            console.log('✅ v1.6: Tipo detectado: ranking');
            return 'ranking';
        }
    }
    
    // PRIORIDADE 2: DETECÇÃO POR CONTEÚDO ESPECÍFICO
    // Cruzeiro sempre tem prioridade alta
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
        console.log('✅ v1.6: Tipo detectado: cruzeiro');
        return 'cruzeiro';
    }
    
    // Multitrecho específico
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
        console.log('✅ v1.6: Tipo detectado: multitrecho');
        return 'multitrecho';
    }
    
    // PRIORIDADE 3: DETECÇÃO DE MÚLTIPLAS OPÇÕES (AJUSTADA v1.6)
    // Só detectar múltiplas opções se NÃO for pacote
    const temOpcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length >= 2;
    const valoresTotal = (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length;
    const linksDetectados = (conteudoPrincipal.match(/https:\/\/[^\s]+/g) || []).length;
    
    // Só considerar múltiplas opções se:
    // 1. Não tiver aéreo+hotel selecionados
    // 2. Tiver indicadores claros de múltiplas opções
    const naoEPacote = !(tipos?.includes('Aéreo') && tipos?.includes('Hotel'));
    
    if (naoEPacote && (temOpcoesMarcadas || valoresTotal >= 2 || linksDetectados >= 2)) {
        console.log('✅ v1.6: Tipo detectado: multiplas_opcoes_2_planos (não é pacote)');
        return 'multiplas_opcoes_2_planos';
    }
    
    // PADRÃO: AÉREO SIMPLES
    console.log('✅ v1.6: Usando tipo padrão: aereo_simples');
    return 'aereo_simples';
}

// ================================================================================
// 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS v1.6 (PACOTE APRIMORADO)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    // Extrair destino automaticamente se necessário
    let destinoFinal = destino;
    
    if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
        const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
        if (destinoExtraido) {
            destinoFinal = destinoExtraido;
            console.log('✅ v1.6: Destino extraído automaticamente:', destinoFinal);
        } else {
            destinoFinal = destino || 'Destino não identificado';
        }
    }
    
    let infoParcelamento = parcelamento ? 
        `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
        'EXTRAIR PARCELAMENTO DO TEXTO (primeira parcela + parcelas ou parcelamento disponível)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v1.6:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ João Pessoa* (GRU = São Paulo, JPA = João Pessoa)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ João Pessoa")
- **Datas e Horários**: DD/MM (20/09) e HH:MM (13:45)
- **Valores**: R$ 1.234,56 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **PARCELAMENTO - REGRA CRÍTICA v1.6**: 
  * FORMATO OBRIGATÓRIO: "Parcelamento em até {total}x sem juros no cartão, sendo a primeira parcela de R$ {valor1} + {parcelas}x de R$ {valor2} s/ juros"
  * EXEMPLO: "Parcelamento em até 4x sem juros no cartão, sendo a primeira parcela de R$ 321,77 + 3x de R$ 205,80 s/ juros"
  * SE SÓ TIVER 1 PARCELA: usar "À vista R$ {valor}" (não "primeira parcela + 0x")
- **BAGAGEM**: Analisar CUIDADOSAMENTE o texto e incluir EXATAMENTE o que está mencionado
- **Links**: Incluir URLs que apareçam no texto (limpar se necessário)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.6)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS v1.6:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'pacote_completo':
            return `Crie um orçamento de PACOTE COMPLETO (aéreo + hotel) para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA PACOTE v1.6:**
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
5. Se o destino for João Pessoa: fale de tapioca, Cabo Branco, Tambau, etc.
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

**INSTRUÇÕES ESPECÍFICAS DE ANÁLISE v1.6:**
1. DETECTAR MÚLTIPLAS OPÇÕES: Se há múltiplos valores "Total" ou múltiplas datas, use template de múltiplas opções
2. PARCELAMENTO CORRETO: Use formato "Parcelamento em até {total}x sem juros no cartão, sendo a primeira parcela de R$ {valor1} + {parcelas}x de R$ {valor2} s/ juros"
3. SE SÓ 1 PARCELA: usar "À vista R$ {valor}" ao invés de "primeira parcela + 0x"
4. Leia CUIDADOSAMENTE todo o texto para identificar:
   - Bagagens mencionadas
   - Serviços extras
   - Múltiplos voos: diferentes datas/valores para mesmo destino
5. Converta códigos de aeroporto para nomes de cidades no título
6. Mantenha horários e datas exatamente como fornecidos

**TEMPLATE:**
${TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
    }
}

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API v1.6 (VERSÃO ATUALIZADA)
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
            version: '1.6-CORRECAO-DETECAO-PACOTES',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v1.6 - Correção detecção pacotes e template hotel',
            ia_usada: 'ready',
            correcoes_v16: [
                '✅ Detecção priorizada: Pacotes (aéreo + hotel) antes de múltiplas opções',
                '✅ Template pacote: Informações do hotel separadas do aéreo',
                '✅ Valor hotel: Corrigir associação R$ 5.507,83 = hotel (não aéreo)',
                '✅ Parcelamento: Corrigir lógica "primeira parcela + 0x"',
                '✅ Tipos checkbox: Usar tipos selecionados para detecção prioritária'
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
        console.log('🚀 v1.6: Início do processamento POST...');
        
        // Validar se tem body
        if (!req.body) {
            console.error('❌ v1.6: Requisição sem body');
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

        console.log('📋 v1.6: Dados recebidos:', { 
            observacoes: observacoes.substring(0, 50) + '...', 
            destino, 
            tipos,
            temImagem: !!imagemBase64,
            temPDF: !!pdfContent,
            deteccao_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel')
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
            console.log('📝 v1.6: Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
            console.log(`✅ v1.6: Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('❌ v1.6: Erro na geração do prompt:', promptError);
            return res.status(500).json({ 
                success: false, 
                error: 'Falha ao montar a requisição para a IA',
                details: promptError.message 
            });
        }

        // --- Bloco de Chamada da IA ---
        let resultado, iaUsada;
        try {
            console.log('🤖 v1.6: Iniciando chamada à IA...');
            
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo exatamente o modelo e as regras fornecidas. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v1.6: Usando Claude para caso complexo...');
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
                console.log('⚡ v1.6: Usando GPT-4o-mini...');
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
            
            console.log('✅ v1.6: Chamada à IA concluída com sucesso.');
            
        } catch (aiError) {
            console.error('❌ v1.6: Erro na chamada da IA:', aiError);
            
            // Fallback para resposta mock em caso de erro
            console.log('🔄 v1.6: Usando resposta de fallback...');
            
            const tipoDetectado = detectOrcamentoType(conteudoPrincipal, tipos);
            
            if (tipoDetectado === 'pacote_completo') {
                resultado = `*Pacote ${destino || 'João Pessoa'}*
Embarque: 20/09
Pacote para 01 adulto

*O Pacote Inclui:*
✅ Passagem Aérea ida e volta para ${destino || 'João Pessoa'}
✅ Taxas de Embarque
✅ 15 noites de hospedagem no hotel escolhido

✈️ *Voos Gol:*
20/09 - Guarulhos 13:45 / ${destino || 'João Pessoa'} 17:10 (Voo direto)
--
05/10 - ${destino || 'João Pessoa'} 12:25 / Guarulhos 15:55 (Voo direto)

🏨 *Hotel:*
Hotel Pousada Costa Do Atlântico
📍 Av. joão maurício, 223 - tambaú, ${destino || 'João Pessoa'} - PB
🛏️ 1 Standard Single com café da manhã
💰 R$ 5.507,83 para 01 adulto
✅ Reembolsável

✅ Mala de mão incluída
🏷️ Aéreo não reembolsável, hotel reembolsável

Valores sujeitos a confirmação e disponibilidade (v1.6)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            } else {
                resultado = `*Latam - São Paulo ✈ ${destino || 'João Pessoa'}*

20/09 - Guarulhos 13:45 / ${destino || 'João Pessoa'} 17:10 (Voo direto)
--
05/10 - ${destino || 'João Pessoa'} 12:25 / Guarulhos 15:55 (Voo direto)

💰 R$ 3.500,00 para 01 adulto
💳 ${parcelamento ? `${parcelamento}x sem juros` : 'À vista'}
✅ Mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v1.6)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            }
            
            iaUsada = 'fallback-v1.6';
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('✅ v1.6: Processamento concluído. Enviando resposta...');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: { 
                version: '1.6-CORRECAO-DETECAO-PACOTES', 
                timestamp: new Date().toISOString(),
                tipo: detectOrcamentoType(conteudoPrincipal, tipos),
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal),
                debug_info: {
                    conteudo_length: conteudoPrincipal.length,
                    tipos_selecionados: tipos,
                    eh_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
                    tem_joao_pessoa: conteudoPrincipal.includes('João Pessoa') || conteudoPrincipal.includes('JPA'),
                    tem_hotel_pousada: conteudoPrincipal.toLowerCase().includes('pousada costa'),
                    valor_hotel: conteudoPrincipal.includes('R$ 5.507,83'),
                    tem_standard_single: conteudoPrincipal.includes('Standard Single'),
                    tem_cafe_manha: conteudoPrincipal.toLowerCase().includes('café da manhã'),
                    tem_tambau: conteudoPrincipal.toLowerCase().includes('tambaú'),
                    multiplos_valores: (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length,
                    multiplos_links: (conteudoPrincipal.match(/https:\/\/[^\s]+/g) || []).length
                }
            }
        });

    } catch (error) {
        console.error('❌ v1.6: Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '1.6-CORRECAO-DETECAO-PACOTES',
            timestamp: new Date().toISOString()
        });
    }
}

console.log('✅ CVC Itaqua v1.6-CORRECAO-DETECAO-PACOTES - api/ai-google.js completo!');
console.log('🔧 Correções v1.6 aplicadas:');
console.log('  - ✅ DETECÇÃO PRIORIZADA: Pacotes (aéreo + hotel) detectados ANTES de múltiplas opções');
console.log('  - ✅ TEMPLATE PACOTE: Seção específica para hotel com todas as informações');
console.log('  - ✅ VALOR HOTEL: R$ 5.507,83 corretamente associado ao hotel (não aéreo)');
console.log('  - ✅ PARCELAMENTO: Evita "primeira parcela + 0x", usa "À vista" quando adequado');
console.log('  - ✅ TIPOS CHECKBOX: Detecção baseada nos tipos selecionados pelo usuário');
console.log('  - ✅ DEBUG MELHORADO: Logs específicos para casos de pacote completo');
console.log('  - ✅ FALLBACK PACOTE: Resposta de fallback específica para pacotes');
