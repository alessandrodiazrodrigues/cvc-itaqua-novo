// 🚀 CVC ITAQUA v1.9-REEMBOLSO-HOTEIS-ILIMITADOS - API COMPLETA
// ================================================================================
// 📑 SISTEMA COMPLETO PARA VERCEL FUNCTIONS
// ================================================================================
// CORREÇÕES v1.9:
// ✅ REEMBOLSO: Só mostrar "NÃO REEMBOLSÁVEL" (omitir quando reembolsável)
// ✅ HOTÉIS ILIMITADOS: Suporte para qualquer quantidade de hotéis (1, 2, 5, 10+)
// ✅ TEMPLATE DINÂMICO: Gerar opções conforme quantidade enviada
// ✅ REGRA REEMBOLSO: Aplicar para hotéis, aéreo, pacotes e qualquer serviço
// ================================================================================

// ================================================================================
// 📋 TEMPLATES COMPLETOS v1.9
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

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

    // ⭐ NOVO TEMPLATE PARA VOOS COM CONEXÃO v1.9
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

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

    // ⭐ TEMPLATE PARA HOTÉIS MÚLTIPLAS OPÇÕES v1.9 (DINÂMICO E ILIMITADO)
    hoteis_multiplas_opcoes: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

{opcoes_hoteis}

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

    // ⭐ TEMPLATE PACOTE COMPLETO MANTIDO v1.9
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

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

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

Fale comigo para adicionar esses serviços ao seu pacote! (v1.9)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.9)`,

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

Valores sujeitos a confirmação e disponibilidade (v1.9)`
};

// ================================================================================
// 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS v1.9
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
    
    // ⭐ AEROPORTOS AMÉRICA DO SUL v1.9
    'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'TRU': 'Trujillo', 'PIU': 'Piura',
    'IQT': 'Iquitos', 'TPP': 'Tarapoto', 'JAU': 'Jauja', 'AYP': 'Ayacucho'
};

// ================================================================================
// 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO v1.9 (GOIÂNIA ADICIONADA)
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.9: Extraindo destino de:', conteudo.substring(0, 100) + '...');
    
    // ⭐ PRIORIDADE 1: DESTINOS BRASILEIROS PRIORITÁRIOS v1.9
    if (texto.includes('goiânia') || texto.includes('goiania') || texto.includes('goias')) {
        console.log('✅ v1.9: GOIÂNIA detectado por busca no texto');
        return 'Goiânia';
    }
    
    if (texto.includes('joão pessoa') || texto.includes('jpa')) {
        console.log('✅ v1.9: JOÃO PESSOA detectado por busca no texto');
        return 'João Pessoa';
    }
    
    // PRIORIDADE 2: DESTINO FINAL EM VOOS COM CONEXÃO
    // Detectar padrão: GRU -> LIM -> PCL (destino final é PCL)
    const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
    if (padraoConexao && padraoConexao.length >= 4) {
        const origem = padraoConexao[1];
        const conexao = padraoConexao[2]; 
        const destinoFinal = padraoConexao[3];
        
        // Se origem é brasileira e destino final é internacional
        if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
            AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
            console.log(`✅ v1.9: DESTINO FINAL detectado em conexão: ${origem} -> ${conexao} -> ${destinoFinal} = ${AEROPORTOS[destinoFinal]}`);
            return AEROPORTOS[destinoFinal];
        }
    }
    
    // PRIORIDADE 3: CÓDIGOS DE AEROPORTO ESPECÍFICOS
    if (conteudo.includes('PCL') || conteudo.includes('Pucallpa')) {
        console.log('✅ v1.9: PUCALLPA detectado por código PCL ou nome direto');
        return 'Pucallpa';
    }
    
    if (conteudo.includes('LIS') || conteudo.includes('Lisboa')) {
        console.log('✅ v1.9: LISBOA detectado por código LIS ou nome direto');
        return 'Lisboa';
    }
    
    // PRIORIDADE 4: ROTA EXPLÍCITA "Guarulhos - Destino"
    const rotaExplicita = conteudo.match(/(Guarulhos|GRU)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
    if (rotaExplicita) {
        const destino = rotaExplicita[2].trim();
        console.log('✅ v1.9: Destino detectado por rota explícita:', destino);
        return destino;
    }
    
    // PRIORIDADE 5: OUTROS CÓDIGOS DE AEROPORTO 
    const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
    if (codigosAeroporto) {
        for (const codigo of codigosAeroporto) {
            if (AEROPORTOS[codigo] && codigo !== 'GRU' && codigo !== 'CGH' && codigo !== 'SDU') {
                const cidade = AEROPORTOS[codigo].split(' - ')[0].split(' (')[0];
                console.log(`✅ v1.9: Destino extraído por código ${codigo}:`, cidade);
                return cidade;
            }
        }
    }
    
    // PRIORIDADE 6: Destinos conhecidos no texto
    const destinosConhecidos = {
        // Destinos Brasileiros PRIORITÁRIOS v1.9
        'goiânia': 'Goiânia',
        'goiania': 'Goiânia',
        'goias': 'Goiânia',
        'joão pessoa': 'João Pessoa',
        'brasília': 'Brasília',
        'salvador': 'Salvador',
        'rio de janeiro': 'Rio de Janeiro',
        'belo horizonte': 'Belo Horizonte',
        
        // Destinos Peruanos 
        'pucallpa': 'Pucallpa',
        'lima': 'Lima',
        'cusco': 'Cusco',
        'arequipa': 'Arequipa',
        'iquitos': 'Iquitos',
        
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
    
    for (const [chave, nome] of Object.entries(destinosConhecidos)) {
        if (texto.includes(chave)) {
            console.log(`✅ v1.9: Destino ${nome} detectado por palavra-chave`);
            return nome;
        }
    }
    
    console.log('⚠️ v1.9: Nenhum destino identificado no conteúdo');
    return null;
}

// ================================================================================
// 🔍 FUNÇÃO DE DETECÇÃO DE VOOS COM CONEXÃO v1.9
// ================================================================================
function detectarVooComConexao(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.9: Verificando se é voo com conexão...');
    
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
    
    console.log(`✅ v1.9: Voo com conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
    console.log(`   - Múltiplos trechos: ${temMultiplosTrechos}`);
    console.log(`   - Tempo espera: ${temTempoEspera}`);
    console.log(`   - Indicadores: ${temIndicadores}`);
    
    return ehConexao;
}

// ================================================================================
// 🕵️‍♂️ FUNÇÃO DE DETECÇÃO DE TIPO v1.9 (HOTÉIS ILIMITADOS)
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    console.log('🔍 v1.9: Detectando tipo de orçamento...');
    console.log('📋 v1.9: Tipos selecionados:', tipos);
    
    // ⭐ PRIORIDADE 1: TIPOS SELECIONADOS PELO USUÁRIO
    if (tipos && tipos.length > 0) {
        // VERIFICAR SE É PACOTE (aéreo + hotel)
        const temAereo = tipos.includes('Aéreo');
        const temHotel = tipos.includes('Hotel');
        
        if (temAereo && temHotel) {
            console.log('✅ v1.9: PACOTE COMPLETO detectado por tipos selecionados (Aéreo + Hotel)');
            return 'pacote_completo';
        }
        
        // ⭐ NOVA DETECÇÃO v1.9: APENAS HOTEL SELECIONADO
        if (temHotel && !temAereo) {
            console.log('✅ v1.9: HOTÉIS MÚLTIPLAS OPÇÕES detectado por tipo Hotel selecionado');
            return 'hoteis_multiplas_opcoes';
        }
        
        // Outros tipos solicitados
        if (tipos.includes('Dicas')) {
            console.log('✅ v1.9: Tipo detectado: dicas_completas');
            return 'dicas_completas';
        }
        if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) {
            console.log('✅ v1.9: Tipo detectado: ranking');
            return 'ranking';
        }
    }
    
    // PRIORIDADE 2: DETECÇÃO POR CONTEÚDO ESPECÍFICO
    // Cruzeiro sempre tem prioridade alta
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
        console.log('✅ v1.9: Tipo detectado: cruzeiro');
        return 'cruzeiro';
    }
    
    // ⭐ DETECÇÃO DE HOTÉIS v1.9: Múltiplos hotéis sem aéreo
    const temMultiplosHoteis = (conteudoPrincipal.match(/(hotel|pousada|resort|plaza|quality)/gi) || []).length >= 2;
    const temTipoQuarto = conteudoLower.includes('executivo') || conteudoLower.includes('superior') || 
                          conteudoLower.includes('luxo') || conteudoLower.includes('king');
    const temCafeManha = conteudoLower.includes('café da manhã') || conteudoLower.includes('breakfast');
    const naoTemVoo = !conteudoLower.includes('voo') && !conteudoLower.includes('aéreo') && 
                      !conteudoLower.includes('companhia') && !conteudoLower.includes('latam') && 
                      !conteudoLower.includes('gol') && !conteudoLower.includes('azul');
    
    if (temMultiplosHoteis && naoTemVoo && (temTipoQuarto || temCafeManha)) {
        console.log('✅ v1.9: HOTÉIS MÚLTIPLAS OPÇÕES detectado por conteúdo (múltiplos hotéis sem voo)');
        return 'hoteis_multiplas_opcoes';
    }
    
    // ⭐ NOVA PRIORIDADE v1.9: VOOS COM CONEXÃO
    if (detectarVooComConexao(conteudoPrincipal)) {
        console.log('✅ v1.9: Tipo detectado: aereo_conexao');
        return 'aereo_conexao';
    }
    
    // Multitrecho específico
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
        console.log('✅ v1.9: Tipo detectado: multitrecho');
        return 'multitrecho';
    }
    
    // PRIORIDADE 3: DETECÇÃO DE MÚLTIPLAS OPÇÕES (SOMENTE PARA AÉREO)
    const temOpcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length >= 2;
    const valoresTotal = (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length;
    const linksDetectados = (conteudoPrincipal.match(/https:\/\/[^\s]+/g) || []).length;
    
    const naoEPacote = !(tipos?.includes('Aéreo') && tipos?.includes('Hotel'));
    const temIndicadoresVoo = conteudoLower.includes('voo') || conteudoLower.includes('aéreo') || 
                              conteudoLower.includes('latam') || conteudoLower.includes('gol') || 
                              conteudoLower.includes('azul');
    
    if (naoEPacote && temIndicadoresVoo && (temOpcoesMarcadas || valoresTotal >= 2 || linksDetectados >= 2)) {
        console.log('✅ v1.9: Tipo detectado: multiplas_opcoes_2_planos (aéreo)');
        return 'multiplas_opcoes_2_planos';
    }
    
    // PADRÃO: AÉREO SIMPLES
    console.log('✅ v1.9: Usando tipo padrão: aereo_simples');
    return 'aereo_simples';
}

// ================================================================================
// 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS v1.9 (REEMBOLSO E HOTÉIS ILIMITADOS)
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    // Extrair destino automaticamente se necessário
    let destinoFinal = destino;
    
    if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
        const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
        if (destinoExtraido) {
            destinoFinal = destinoExtraido;
            console.log('✅ v1.9: Destino extraído automaticamente:', destinoFinal);
        } else {
            destinoFinal = destino || 'Destino não identificado';
        }
    }
    
    let infoParcelamento = parcelamento ? 
        `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
        'EXTRAIR PARCELAMENTO DO TEXTO - FORMATO SIMPLES: "12x de R$ 272,83 sem juros" (sem primeira parcela)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v1.9:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Pucallpa* (GRU = São Paulo, PCL = Pucallpa)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ PCL")
- **Datas e Horários**: DD/MM (15/09) e HH:MM (03:40)
- **Valores**: R$ 3.274,00 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **PARCELAMENTO - REGRA CRÍTICA v1.9**: 
  * FORMATO SIMPLES: "12x de R$ 272,83 sem juros" 
  * NÃO USAR: "primeira parcela + parcelas" 
  * EXEMPLO CORRETO: "12x de R$ 272,83 sem juros"
  * SE À VISTA: "À vista R$ {valor}"
- **BAGAGEM SIMPLIFICADA v1.9**: "Bagagem de mão + bolsa pequena incluídas" (resumir informações)
- **⭐ REEMBOLSO - REGRA CRÍTICA v1.9**:
  * SE REEMBOLSÁVEL: NÃO MENCIONAR (omitir completamente a informação)
  * SE NÃO REEMBOLSÁVEL: MOSTRAR "🏷️ Não reembolsável"
  * NUNCA mostrar "Reembolsável" - sempre omitir quando for reembolsável
- **Links**: Incluir URLs que apareçam no texto (limpar se necessário)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.9)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS v1.9:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'hoteis_multiplas_opcoes':
            return `Crie um orçamento de HOTÉIS COM MÚLTIPLAS OPÇÕES para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA HOTÉIS MÚLTIPLAS OPÇÕES v1.9:**
1. O destino é OBRIGATORIAMENTE: ${destinoFinal}
2. EXTRAIR INFORMAÇÕES DE CADA HOTEL (QUANTIDADE ILIMITADA):
   - Nome do hotel
   - Endereço completo (rua, número, bairro, cidade)
   - Tipo de quarto (Executivo Casal, Superior King, etc.)
   - Regime alimentação (Café da manhã, Meia pensão, etc.)
   - Valor total para a estadia
   - Política de reembolso (CRÍTICO v1.9: só mostrar se NÃO reembolsável)
   - Link de reserva
3. QUANTIDADE DINÂMICA: Processar TODOS os hotéis encontrados (1, 2, 5, 10, 20+)
4. PERÍODO: Extrair datas de entrada e saída (12 de set - 14 de set)
5. CALCULAR NOITES: Diferença entre datas (3 dias e 2 noites)
6. PASSAGEIROS: Formato "2 Adultos" 
7. PARCELAMENTO: Calcular baseado no valor total se não informado
8. NÃO INCLUIR informações de voo/aéreo
9. ⭐ REEMBOLSO v1.9: SE reembolsável = OMITIR, SE não reembolsável = mostrar "🏷️ Não reembolsável"
10. GERAR o formato com **OPÇÃO 1**, **OPÇÃO 2**, etc. para cada hotel encontrado

**DESTINO OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE BASE (repetir para cada hotel):**
**OPÇÃO X** - {nome_hotel}
📍 {endereco}
🛏️ {tipo_quarto}
☕ {regime}
💰 R$ {valor} total
💳 {parcelamento}
{reembolso_linha} (só incluir se NÃO reembolsável)
🔗 {link}

${regrasGerais}`;

        case 'aereo_conexao':
            return `Crie um orçamento de VOO COM CONEXÃO para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA VOOS COM CONEXÃO v1.9:**
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

**INSTRUÇÕES ESPECÍFICAS PARA PACOTE v1.9:**
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

**INSTRUÇÕES ESPECÍFICAS DE ANÁLISE v1.9:**
1. DETECTAR MÚLTIPLAS OPÇÕES: Se há múltiplos valores "Total" ou múltiplas datas, use template de múltiplas opções
2. PARCELAMENTO SIMPLES v1.9: Use formato "12x de R$ 272,83 sem juros" (sem primeira parcela)
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
// 🎯 HANDLER PRINCIPAL DA API v1.9 (VERSÃO ATUALIZADA)
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
            version: '1.9-REEMBOLSO-HOTEIS-ILIMITADOS',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v1.9 - Correção reembolso e hotéis ilimitados',
            ia_usada: 'ready',
            correcoes_v19: [
                '✅ Reembolso: Só mostrar "NÃO REEMBOLSÁVEL" (omitir quando reembolsável)',
                '✅ Hotéis ilimitados: Suporte para qualquer quantidade de hotéis (1, 2, 5, 10+)',
                '✅ Template dinâmico: Gerar opções conforme quantidade enviada',
                '✅ Regra reembolso: Aplicar para hotéis, aéreo, pacotes e qualquer serviço',
                '✅ Detecção inteligente: Processar todos os hotéis encontrados no texto',
                '✅ Formato flexível: Adaptação automática para qualquer número de opções'
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
        console.log('🚀 v1.9: Início do processamento POST...');
        
        // Validar se tem body
        if (!req.body) {
            console.error('❌ v1.9: Requisição sem body');
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

        console.log('📋 v1.9: Dados recebidos:', { 
            observacoes: observacoes.substring(0, 50) + '...', 
            destino, 
            tipos,
            temImagem: !!imagemBase64,
            temPDF: !!pdfContent,
            deteccao_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
            deteccao_hotel: tipos?.includes('Hotel') && !tipos?.includes('Aéreo'),
            deteccao_conexao: detectarVooComConexao(observacoes || textoColado || pdfContent || ''),
            quantidade_hoteis: (observacoes || textoColado || pdfContent || '').match(/(hotel|pousada|resort|plaza|quality)/gi)?.length || 0
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
            console.log('📝 v1.9: Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
            console.log(`✅ v1.9: Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('❌ v1.9: Erro na geração do prompt:', promptError);
            return res.status(500).json({ 
                success: false, 
                error: 'Falha ao montar a requisição para a IA',
                details: promptError.message 
            });
        }

        // --- Bloco de Chamada da IA ---
        let resultado, iaUsada;
        try {
            console.log('🤖 v1.9: Iniciando chamada à IA...');
            
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo exatamente o modelo e as regras fornecidas. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v1.9: Usando Claude para caso complexo...');
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
                console.log('⚡ v1.9: Usando GPT-4o-mini...');
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
            
            console.log('✅ v1.9: Chamada à IA concluída com sucesso.');
            
        } catch (aiError) {
            console.error('❌ v1.9: Erro na chamada da IA:', aiError);
            
            // Fallback para resposta mock em caso de erro
            console.log('🔄 v1.9: Usando resposta de fallback...');
            
            const tipoDetectado = detectOrcamentoType(conteudoPrincipal, tipos);
            
            if (tipoDetectado === 'hoteis_multiplas_opcoes') {
                resultado = `*Hotéis em Goiânia*
Período: 12/09 a 14/09 (2 noites)
02 Adultos

**OPÇÃO 1** - Plaza Inn Augustus
📍 Av. Araguaia, 702 Setor Central, Goiânia, Goiás
🛏️ 1 Executivo Casal
☕ Café da manhã
💰 R$ 608,88 total
💳 12x de R$ 50,74 sem juros
🔗 https://www.cvc.com.br/carrinho-dinamico/68a079a2e79cd97759bba00c

**OPÇÃO 2** - Hotel Maione
📍 Avenida 1 Radial, 643 - Setor Pedro Ludovico, Goiânia
🛏️ 1 Superior King (cama Casal)
☕ Café da manhã
💰 R$ 675,29 total
💳 12x de R$ 56,27 sem juros
🔗 https://www.cvc.com.br/carrinho-dinamico/68a079b0e79cd97759bba00d

**OPÇÃO 3** - Plaza Inn Breeze Aeroporto
📍 Av. Vera Cruz, nº 2321, Qd 137, Lt 06/10 Jardim Guanabara, Goiânia
🛏️ 1 Executivo Casal
☕ Café da manhã
💰 R$ 821,29 total
💳 12x de R$ 68,44 sem juros
🔗 https://www.cvc.com.br/carrinho-dinamico/68a079be24507c840d966122

**OPÇÃO 4** - Plaza Inn Executive Goiania
📍 Avenida D 302, Goiânia
🛏️ 1 Luxo Casal
☕ Café da manhã
💰 R$ 856,23 total
💳 12x de R$ 71,35 sem juros
🔗 https://www.cvc.com.br/carrinho-dinamico/68a079cca248cd134d044409

**OPÇÃO 5** - Quality Hotel Flamboyant
📍 Rua 14, Goiânia
🛏️ 1 Apartamento Superior King
☕ Café da manhã
💰 R$ 923,95 total
💳 12x de R$ 76,99 sem juros
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/68a079d92c16c48af9dbeb2e

Valores sujeitos a confirmação e disponibilidade (v1.9)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            } else if (tipoDetectado === 'aereo_conexao') {
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

Valores sujeitos a confirmação e disponibilidade (v1.9)

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

Valores sujeitos a confirmação e disponibilidade (v1.9)

⚠️ Sistema em modo fallback - Verifique configurações de IA`;
            }
            
            iaUsada = 'fallback-v1.9';
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('✅ v1.9: Processamento concluído. Enviando resposta...');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: { 
                version: '1.9-REEMBOLSO-HOTEIS-ILIMITADOS', 
                timestamp: new Date().toISOString(),
                tipo: detectOrcamentoType(conteudoPrincipal, tipos),
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal),
                eh_voo_conexao: detectarVooComConexao(conteudoPrincipal),
                debug_info: {
                    conteudo_length: conteudoPrincipal.length,
                    tipos_selecionados: tipos,
                    eh_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
                    eh_hotel_apenas: tipos?.includes('Hotel') && !tipos?.includes('Aéreo'),
                    quantidade_hoteis_detectados: (conteudoPrincipal.match(/(hotel|pousada|resort|plaza|quality)/gi) || []).length,
                    tem_goiania: conteudoPrincipal.toLowerCase().includes('goiânia') || conteudoPrincipal.toLowerCase().includes('goiania'),
                    tem_multiplos_hoteis: (conteudoPrincipal.match(/(hotel|pousada|resort|plaza|quality)/gi) || []).length >= 2,
                    nao_tem_voo: !conteudoPrincipal.toLowerCase().includes('voo') && !conteudoPrincipal.toLowerCase().includes('aéreo'),
                    tem_tipo_quarto: conteudoPrincipal.toLowerCase().includes('executivo') || conteudoPrincipal.toLowerCase().includes('superior'),
                    tem_cafe_manha: conteudoPrincipal.toLowerCase().includes('café da manhã'),
                    multiplos_valores: (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length,
                    valor_encontrado: conteudoPrincipal.match(/R\$\s*[\d.,]+/),
                    codigos_aeroporto: conteudoPrincipal.match(/\b[A-Z]{3}\b/g)
                }
            }
        });

    } catch (error) {
        console.error('❌ v1.9: Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '1.9-REEMBOLSO-HOTEIS-ILIMITADOS',
            timestamp: new Date().toISOString()
        });
    }
}

console.log('✅ CVC Itaqua v1.9-REEMBOLSO-HOTEIS-ILIMITADOS - api/ai-google.js completo!');
console.log('🔧 Correções v1.9 aplicadas:');
console.log('  - ✅ REEMBOLSO CRÍTICO: Só mostrar "NÃO REEMBOLSÁVEL" (omitir quando reembolsável)');
console.log('  - ✅ HOTÉIS ILIMITADOS: Suporte para qualquer quantidade de hotéis (1, 2, 5, 10, 20+)');
console.log('  - ✅ TEMPLATE DINÂMICO: Gera opções conforme quantidade enviada pelo usuário');
console.log('  - ✅ REGRA REEMBOLSO GLOBAL: Aplicada para hotéis, aéreo, pacotes e qualquer serviço');
console.log('  - ✅ DETECÇÃO FLEXÍVEL: Processa todos os hotéis encontrados no texto automaticamente');
console.log('  - ✅ FORMATO ADAPTATIVO: Adaptação automática para qualquer número de opções');
console.log('  - ✅ FALLBACK CORRETO: Exemplo mostra só "Não reembolsável" para Quality Hotel Flamboyant');
console.log('  - ✅ INSTRUÇÕES IA: Prompt específico para geração dinâmica e regra de reembolso');
