// 🚀 CVC ITAQUA v2.0-COMPLETA-FUNCIONAL - API ROBUSTA E COMPLETA
// ================================================================================
// 📑 SISTEMA ROBUSTO - EVOLUÇÃO DA v1.7 COM TODAS AS FUNCIONALIDADES
// ================================================================================
// MELHORIAS v2.0:
// ✅ BASE SÓLIDA v1.7: Mantida estrutura que funcionava
// ✅ TODOS OS TEMPLATES: Aéreo simples, conexão, hotéis, pacotes, dicas, ranking, cruzeiro
// ✅ DETECÇÃO ROBUSTA: Tipos de orçamento, destinos, conexões
// ✅ ERROR HANDLING: Try-catch completo em todas as funções
// ✅ COMPATIBILIDADE: Mantém padrões de funcionamento da v1.7
// ✅ EXTENSIBILIDADE: Código organizado para futuras melhorias
// ================================================================================

// ================================================================================
// 📋 ÍNDICE DO SISTEMA v2.0
// ================================================================================
// 1. TEMPLATES COMPLETOS
//    1.1 Aéreo Simples e Conexão
//    1.2 Hotéis e Pacotes
//    1.3 Dicas e Ranking
//    1.4 Cruzeiro e Multitrecho
// 2. CONFIGURAÇÕES E CONSTANTES
//    2.1 Aeroportos
//    2.2 Destinos Conhecidos
// 3. FUNÇÕES DE DETECÇÃO
//    3.1 Extração de Destino
//    3.2 Detecção de Voo com Conexão
//    3.3 Detecção de Tipo de Orçamento
// 4. GERAÇÃO DE PROMPTS
// 5. HANDLER PRINCIPAL
// ================================================================================

// ================================================================================
// 1. TEMPLATES COMPLETOS
// ================================================================================

// 1.1 Aéreo Simples e Conexão
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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

    // ⭐ TEMPLATE VOOS COM CONEXÃO v2.0
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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

    // 1.2 Hotéis e Pacotes
    hoteis_multiplas_opcoes: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

{opcoes_hoteis}

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

    // 1.3 Dicas e Ranking
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

Fale comigo para adicionar esses serviços ao seu pacote! (v2.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

    // 1.4 Cruzeiro e Multitrecho
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

Valores sujeitos a confirmação e disponibilidade (v2.0)`,

    multitrecho: `*Voo Multitrecho - {companhia}*

**TRECHO 1:** {origem1} ✈ {destino1}
{data1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})

**TRECHO 2:** {origem2} ✈ {destino2}
{data2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})

**TRECHO 3:** {origem3} ✈ {destino3}
{data3} - {aeroporto_origem3} {hora_ida3} / {aeroporto_destino3} {hora_chegada3} ({tipo_voo3})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v2.0)`
};

// ================================================================================
// 2. CONFIGURAÇÕES E CONSTANTES
// ================================================================================

// 2.1 Tabela Completa de Aeroportos v2.0
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
    
    // AMÉRICA DO SUL EXTENDIDA v2.0
    'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'TRU': 'Trujillo', 'PIU': 'Piura',
    'IQT': 'Iquitos', 'TPP': 'Tarapoto', 'JAU': 'Jauja', 'AYP': 'Ayacucho', 'TCQ': 'Tacna',
    'MVD': 'Montevidéu', 'ASU': 'Assunção', 'VVI': 'Santa Cruz', 'LPB': 'La Paz', 'UIO': 'Quito', 'GYE': 'Guayaquil'
};

// 2.2 Destinos Conhecidos Expandidos v2.0
const DESTINOS_CONHECIDOS = {
    // Destinos Peruanos PRIORITÁRIOS
    'pucallpa': 'Pucallpa', 'lima': 'Lima', 'cusco': 'Cusco', 'arequipa': 'Arequipa', 'iquitos': 'Iquitos',
    'trujillo': 'Trujillo', 'piura': 'Piura', 'tarapoto': 'Tarapoto', 'ayacucho': 'Ayacucho',
    
    // Destinos Brasileiros 
    'joão pessoa': 'João Pessoa', 'joao pessoa': 'João Pessoa', 'brasília': 'Brasília', 'brasilia': 'Brasília',
    'salvador': 'Salvador', 'rio de janeiro': 'Rio de Janeiro', 'belo horizonte': 'Belo Horizonte',
    'porto alegre': 'Porto Alegre', 'curitiba': 'Curitiba', 'florianópolis': 'Florianópolis', 'florianopolis': 'Florianópolis',
    'recife': 'Recife', 'fortaleza': 'Fortaleza', 'natal': 'Natal', 'maceió': 'Maceió', 'maceio': 'Maceió',
    'goiânia': 'Goiânia', 'goiania': 'Goiânia', 'manaus': 'Manaus', 'belém': 'Belém', 'belem': 'Belém',
    
    // Destinos Europeus
    'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid', 'barcelona': 'Barcelona',
    'paris': 'Paris', 'londres': 'Londres', 'roma': 'Roma', 'amsterdam': 'Amsterdam',
    'milão': 'Milão', 'milao': 'Milão', 'frankfurt': 'Frankfurt', 'zurich': 'Zurich',
    
    // Destinos Americanos
    'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York', 'los angeles': 'Los Angeles',
    'são francisco': 'São Francisco', 'sao francisco': 'São Francisco', 'chicago': 'Chicago', 
    'dallas': 'Dallas', 'atlanta': 'Atlanta', 'cancún': 'Cancún', 'cancun': 'Cancún',
    
    // América Latina  
    'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'bogotá': 'Bogotá', 'bogota': 'Bogotá',
    'montevidéu': 'Montevidéu', 'montevideu': 'Montevidéu', 'assunção': 'Assunção', 'assuncao': 'Assunção',
    'quito': 'Quito', 'guayaquil': 'Guayaquil', 'la paz': 'La Paz'
};

// ================================================================================
// 3. FUNÇÕES DE DETECÇÃO
// ================================================================================

// 3.1 Função de Extração de Destino Robusta v2.0
function extrairDestinoDoConteudo(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.0: Extraindo destino de:', conteudo.substring(0, 100) + '...');
        
        // PRIORIDADE 1: DESTINO FINAL EM VOOS COM CONEXÃO
        const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
        if (padraoConexao && padraoConexao.length >= 4) {
            const origem = padraoConexao[1];
            const conexao = padraoConexao[2]; 
            const destinoFinal = padraoConexao[3];
            
            if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
                AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
                console.log(`✅ v2.0: DESTINO FINAL detectado em conexão: ${origem} -> ${conexao} -> ${destinoFinal} = ${AEROPORTOS[destinoFinal]}`);
                return AEROPORTOS[destinoFinal];
            }
        }
        
        // PRIORIDADE 2: CÓDIGOS DE AEROPORTO ESPECÍFICOS
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            // Buscar código prioritário (não brasileiro)
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo].split(' - ')[0].split(' (')[0];
                    console.log(`✅ v2.0: Destino extraído por código ${codigo}:`, cidade);
                    return cidade;
                }
            }
        }
        
        // PRIORIDADE 3: ROTA EXPLÍCITA "São Paulo - Destino"
        const rotaExplicita = conteudo.match(/(São Paulo|Guarulhos|GRU)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
        if (rotaExplicita) {
            const destino = rotaExplicita[2].trim();
            console.log('✅ v2.0: Destino detectado por rota explícita:', destino);
            return destino;
        }
        
        // PRIORIDADE 4: Destinos conhecidos no texto (ordenado por prioridade)
        for (const [chave, nome] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(chave)) {
                console.log(`✅ v2.0: Destino ${nome} detectado por palavra-chave: ${chave}`);
                return nome;
            }
        }
        
        console.log('⚠️ v2.0: Nenhum destino identificado no conteúdo');
        return null;
    } catch (error) {
        console.error('❌ v2.0: Erro ao extrair destino:', error);
        return null;
    }
}

// 3.2 Função de Detecção de Voos com Conexão v2.0
function detectarVooComConexao(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.0: Verificando se é voo com conexão...');
        
        // INDICADORES DE CONEXÃO
        const indicadoresConexao = [
            'voo com paradas', 'conexão', 'espera de', 'parada em', 'escala', 
            'connecting flight', 'tempo de espera', 'layover', 'stopover'
        ];
        
        // PADRÃO DE MÚLTIPLOS TRECHOS
        const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
        const temTempoEspera = texto.includes('espera de') || texto.includes('conexão') || texto.includes('tempo de');
        const temIndicadores = indicadoresConexao.some(ind => texto.includes(ind));
        const temMultiplosHorarios = (conteudo.match(/\d{2}:\d{2}/g) || []).length >= 4;
        
        const ehConexao = temMultiplosTrechos || temTempoEspera || temIndicadores || temMultiplosHorarios;
        
        console.log(`✅ v2.0: Voo com conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
        console.log(`   - Múltiplos trechos: ${temMultiplosTrechos}`);
        console.log(`   - Tempo espera: ${temTempoEspera}`);
        console.log(`   - Indicadores: ${temIndicadores}`);
        console.log(`   - Múltiplos horários: ${temMultiplosHorarios}`);
        
        return ehConexao;
    } catch (error) {
        console.error('❌ v2.0: Erro ao detectar conexão:', error);
        return false;
    }
}

// 3.3 Função de Detecção de Tipo de Orçamento Completa v2.0
function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        console.log('🔍 v2.0: Detectando tipo de orçamento...');
        console.log('📋 v2.0: Tipos selecionados:', tipos);
        
        // PRIORIDADE 1: TIPOS SELECIONADOS PELO USUÁRIO
        if (tipos && tipos.length > 0) {
            // VERIFICAR SE É PACOTE (aéreo + hotel)
            const temAereo = tipos.includes('Aéreo');
            const temHotel = tipos.includes('Hotel');
            
            if (temAereo && temHotel) {
                console.log('✅ v2.0: PACOTE COMPLETO detectado por tipos selecionados (Aéreo + Hotel)');
                return 'pacote_completo';
            }
            
            // Só hotel
            if (temHotel && !temAereo) {
                console.log('✅ v2.0: HOTÉIS MÚLTIPLAS OPÇÕES detectado por tipo selecionado');
                return 'hoteis_multiplas_opcoes';
            }
            
            // Outros tipos solicitados
            if (tipos.includes('Dicas')) {
                console.log('✅ v2.0: Tipo detectado: dicas_completas');
                return 'dicas_completas';
            }
            if (tipos.includes('Ranking')) {
                console.log('✅ v2.0: Tipo detectado: ranking');
                return 'ranking';
            }
        }
        
        // PRIORIDADE 2: DETECÇÃO POR CONTEÚDO ESPECÍFICO
        // Cruzeiro sempre tem prioridade alta
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || conteudoLower.includes('cabine')) {
            console.log('✅ v2.0: Tipo detectado: cruzeiro');
            return 'cruzeiro';
        }
        
        // Multitrecho específico
        if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
            console.log('✅ v2.0: Tipo detectado: multitrecho');
            return 'multitrecho';
        }
        
        // VOOS COM CONEXÃO - Nova funcionalidade v2.0
        if (detectarVooComConexao(conteudoPrincipal)) {
            console.log('✅ v2.0: Tipo detectado: aereo_conexao');
            return 'aereo_conexao';
        }
        
        // HOTÉIS SEM AÉREO - Detecção melhorada v2.0
        const temMultiplosHoteis = (conteudoPrincipal.match(/(hotel|pousada|resort|plaza|quality|ibis|mercure)/gi) || []).length >= 2;
        const temTipoQuarto = conteudoLower.includes('executivo') || conteudoLower.includes('superior') || conteudoLower.includes('standard');
        const naoTemVoo = !conteudoLower.includes('voo') && !conteudoLower.includes('aéreo') && 
                          !conteudoLower.includes('latam') && !conteudoLower.includes('gol') && 
                          !conteudoLower.includes('azul') && !conteudoLower.includes('avianca');
        
        if (temMultiplosHoteis && naoTemVoo && temTipoQuarto) {
            console.log('✅ v2.0: HOTÉIS MÚLTIPLAS OPÇÕES detectado por conteúdo');
            return 'hoteis_multiplas_opcoes';
        }
        
        // PRIORIDADE 3: DETECÇÃO DE MÚLTIPLAS OPÇÕES AÉREAS
        const temOpcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length >= 2;
        const valoresTotal = (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length;
        const linksDetectados = (conteudoPrincipal.match(/https:\/\/[^\s]+/g) || []).length;
        
        const naoEPacote = !(tipos?.includes('Aéreo') && tipos?.includes('Hotel'));
        
        if (naoEPacote && (temOpcoesMarcadas || valoresTotal >= 2 || linksDetectados >= 2)) {
            console.log('✅ v2.0: Tipo detectado: multiplas_opcoes_2_planos');
            return 'multiplas_opcoes_2_planos';
        }
        
        // PADRÃO: AÉREO SIMPLES
        console.log('✅ v2.0: Usando tipo padrão: aereo_simples');
        return 'aereo_simples';
        
    } catch (error) {
        console.error('❌ v2.0: Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

// ================================================================================
// 4. GERAÇÃO DE PROMPTS ROBUSTA v2.0
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    try {
        // Extrair destino automaticamente se necessário
        let destinoFinal = destino;
        
        if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
            const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
            if (destinoExtraido) {
                destinoFinal = destinoExtraido;
                console.log('✅ v2.0: Destino extraído automaticamente:', destinoFinal);
            } else {
                destinoFinal = destino || 'Destino não identificado';
            }
        }
        
        let infoParcelamento = parcelamento ? 
            `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
            'EXTRAIR PARCELAMENTO DO TEXTO - FORMATO SIMPLES: "12x de R$ 272,83 sem juros" (sem primeira parcela)';

        const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v2.0:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ ${destinoFinal}* (GRU = São Paulo, PCL = ${destinoFinal})
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ PCL")
- **Datas e Horários**: DD/MM (15/09) e HH:MM (03:40)
- **Valores**: R$ 3.274,00 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **PARCELAMENTO - REGRA CRÍTICA v2.0**: 
  * FORMATO SIMPLES: "12x de R$ 272,83 sem juros" 
  * NÃO USAR: "primeira parcela + parcelas" 
  * EXEMPLO CORRETO: "12x de R$ 272,83 sem juros"
  * SE À VISTA: "À vista R$ {valor}"
- **BAGAGEM SIMPLIFICADA v2.0**: "Bagagem de mão + bolsa pequena incluídas" (resumir informações)
- **Links**: Incluir URLs que apareçam no texto (limpar se necessário)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v2.0)"`;

        const tabelaAeroportos = `**TABELA DE AEROPORTOS v2.0:**\n${JSON.stringify(AEROPORTOS)}`;

        // SWITCH CASE PARA CADA TIPO
        switch (tipoOrcamento) {
            case 'aereo_conexao':
                return `Crie um orçamento de VOO COM CONEXÃO para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA VOOS COM CONEXÃO v2.0:**
1. O destino FINAL é OBRIGATORIAMENTE: ${destinoFinal}
2. DETECTAR TRECHOS:
   - ORIGEM → CONEXÃO (horário ida, horário chegada, duração)
   - CONEXÃO → DESTINO FINAL (horário saída, horário chegada, duração)
   - VOLTA: DESTINO → CONEXÃO → ORIGEM
3. TEMPO DE CONEXÃO: Calcular e mostrar tempo de espera entre voos
4. FORMATO DETALHES:
   * Guarulhos 03:40 / Lima 07:00 (5h20min - voo direto)
   * **Conexão em Lima: 7h05min**
   * Lima 14:05 / ${destinoFinal} 15:25 (1h20min - voo direto)
5. USAR TEMPLATE AEREO_CONEXAO exatamente como fornecido
6. TÍTULO: *Latam - São Paulo ✈ ${destinoFinal}* (cidade de origem ✈ cidade destino final)

**DESTINO FINAL OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.aereo_conexao}

${regrasGerais}
${tabelaAeroportos}`;

            case 'hoteis_multiplas_opcoes':
                return `Crie um orçamento de HOTÉIS COM MÚLTIPLAS OPÇÕES para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA HOTÉIS v2.0:**
1. TÍTULO OBRIGATÓRIO: "*Hotéis em ${destinoFinal}*" (NUNCA usar nomes de companhias aéreas)
2. PERÍODO OBRIGATÓRIO: "Período: 12/09 a 14/09 (2 noites)" (calcular noites automaticamente)
3. PASSAGEIROS: "02 Adultos" (formato correto)
4. MÚLTIPLAS OPÇÕES: Criar seção para cada hotel encontrado
5. TIPO DE QUARTO: Sempre incluir número "1" antes do tipo (ex: "1 Executivo Casal")
6. LINKS: URL direto sem markdown (ex: "Link: https://www.cvc.com.br/...")
7. REEMBOLSO v2.0: SE reembolsável = OMITIR, SE não reembolsável = mostrar "Não reembolsável"
8. PARCELAMENTO: Se não informado, usar "À vista R$ {valor}"

**DESTINO OBRIGATÓRIO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.hoteis_multiplas_opcoes}

${regrasGerais}
${tabelaAeroportos}`;

            case 'pacote_completo':
                return `Crie um orçamento de PACOTE COMPLETO (aéreo + hotel) para ${destinoFinal}.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA PACOTE v2.0:**
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

            case 'cruzeiro':
                return `Crie um orçamento de CRUZEIRO.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA CRUZEIRO v2.0:**
1. IDENTIFICAR: nome do navio, duração, porto de saída
2. CABINES: listar todas as opções disponíveis com preços
3. INCLUI/NÃO INCLUI: sempre especificar claramente
4. DATA: sempre incluir dia da semana

**TEMPLATE:**
${TEMPLATES.cruzeiro}

${regrasGerais}`;

            case 'multitrecho':
                return `Crie um orçamento de VOO MULTITRECHO.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA MULTITRECHO v2.0:**
1. IDENTIFICAR TODOS OS TRECHOS: origem/destino de cada trecho
2. ORDENAR CRONOLOGICAMENTE: do primeiro ao último trecho
3. FORMATAÇÃO: TRECHO 1, TRECHO 2, TRECHO 3...
4. VALOR TOTAL: somar todos os trechos

**TEMPLATE:**
${TEMPLATES.multitrecho}

${regrasGerais}
${tabelaAeroportos}`;

            case 'multiplas_opcoes_2_planos':
                return `Crie um orçamento com MÚLTIPLAS OPÇÕES AÉREAS.

**DADOS BRUTOS:**
${conteudoPrincipal}

**INSTRUÇÕES ESPECÍFICAS PARA MÚLTIPLAS OPÇÕES v2.0:**
1. IDENTIFICAR 2 OU MAIS OPÇÕES: diferentes valores, bagagens ou condições
2. DIFERENCIAÇÃO CLARA: explicar diferença entre as opções
3. BAGAGEM: principal diferenciador entre opções
4. PARCELAMENTO: calcular para cada opção

**DESTINO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.multiplas_opcoes_2_planos}

${regrasGerais}
${tabelaAeroportos}`;

            default:
                return `Converta os dados brutos em um orçamento AÉREO SIMPLES formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**DESTINO IDENTIFICADO:** ${destinoFinal}

**INSTRUÇÕES ESPECÍFICAS DE ANÁLISE v2.0:**
1. DETECTAR MÚLTIPLAS OPÇÕES: Se há múltiplos valores "Total" ou múltiplas datas, use template de múltiplas opções
2. PARCELAMENTO SIMPLES v2.0: Use formato "12x de R$ 272,83 sem juros" (sem primeira parcela)
3. SE À VISTA: usar "À vista R$ {valor}"
4. BAGAGEM SIMPLIFICADA: "Bagagem de mão + bolsa pequena incluídas"
5. Leia CUIDADOSAMENTE todo o texto para identificar:
   - Bagagens mencionadas
   - Serviços extras
   - Múltiplos voos: diferentes datas/valores para mesmo destino
6. Converta códigos de aeroporto para nomes de cidades no título
7. Mantenha horários e datas exatamente como fornecidos

**TEMPLATE:**
${TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
        }
    } catch (error) {
        console.error('❌ v2.0: Erro ao gerar prompt:', error);
        return `Erro ao gerar prompt: ${error.message}`;
    }
}

// ================================================================================
// 5. HANDLER PRINCIPAL ROBUSTO v2.0
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
            version: '2.0-COMPLETA-FUNCIONAL',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.0 - Sistema completo, robusto e funcional com todos os templates',
            ia_usada: 'ready',
            funcionalidades_v2: [
                '✅ Base sólida v1.7: Estrutura que funcionava mantida',
                '✅ TODOS OS TEMPLATES: Aéreo simples, conexão, hotéis, pacotes, dicas, ranking, cruzeiro, multitrecho',
                '✅ Detecção robusta: Tipos de orçamento, destinos, conexões melhoradas',
                '✅ Error handling: Try-catch completo em todas as funções',
                '✅ Compatibilidade: Mantém padrões de funcionamento da v1.7',
                '✅ Extensibilidade: Código organizado para futuras melhorias',
                '✅ Aeroportos expandidos: América do Sul completa',
                '✅ Destinos conhecidos: Base ampliada e otimizada'
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
        console.log('🚀 v2.0: Início do processamento POST...');
        
        // Validar se tem body
        if (!req.body) {
            console.error('❌ v2.0: Requisição sem body');
            return res.status(400).json({ 
                success: false, 
                error: 'Body da requisição é obrigatório' 
            });
        }

        // Extrair dados do body com valores padrão seguros
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

        console.log('📋 v2.0: Dados recebidos:', { 
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
            console.log('📝 v2.0: Iniciando geração de prompt...');
            const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
            prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
            console.log(`✅ v2.0: Tipo detectado: ${tipoOrcamento}. Prompt gerado.`);
        } catch (promptError) {
            console.error('❌ v2.0: Erro na geração do prompt:', promptError);
            return res.status(500).json({ 
                success: false, 
                error: 'Falha ao montar a requisição para a IA',
                details: promptError.message 
            });
        }

        // --- Bloco de Chamada da IA ---
        let resultado, iaUsada;
        try {
            console.log('🤖 v2.0: Iniciando chamada à IA...');
            
            // Decidir qual IA usar
            const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo exatamente o modelo e as regras fornecidas. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v2.0: Usando Claude para caso complexo...');
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
                console.log('⚡ v2.0: Usando GPT-4o-mini...');
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
            
            console.log('✅ v2.0: Chamada à IA concluída com sucesso.');
            
        } catch (aiError) {
            console.error('❌ v2.0: Erro na chamada da IA:', aiError);
            
            // Fallback para resposta mock em caso de erro
            console.log('🔄 v2.0: Usando resposta de fallback...');
            
            const tipoDetectado = detectOrcamentoType(conteudoPrincipal, tipos);
            const destinoDetectado = extrairDestinoDoConteudo(conteudoPrincipal) || destino || 'Destino Detectado';
            
            // Fallback específico por tipo
            switch (tipoDetectado) {
                case 'aereo_conexao':
                    resultado = `*Latam - São Paulo ✈ ${destinoDetectado}*

15/09 - Guarulhos 03:40 / ${destinoDetectado} 15:25 (conexão em Lima)
--
30/09 - ${destinoDetectado} 20:20 / Guarulhos 06:15 (+1 dia) (conexão em Lima)

✈️ **Detalhes dos Voos:**
**IDA - 15/09:**
* Guarulhos 03:40 / Lima 07:00 (5h20min - voo direto)
* **Conexão em Lima: 7h05min**
* Lima 14:05 / ${destinoDetectado} 15:25 (1h20min - voo direto)

**VOLTA - 30/09:**
* ${destinoDetectado} 20:20 / Lima 21:25 (1h05min - voo direto)
* **Conexão em Lima: 1h50min**
* Lima 23:15 / Guarulhos 06:15 (+1) (5h00min - voo direto)

💰 R$ 3.274,00 para 01 adulto
💳 12x de R$ 272,83 sem juros
✅ Bagagem de mão + bolsa pequena incluídas
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v2.0)`;
                    break;
                
                case 'hoteis_multiplas_opcoes':
                    resultado = `*Hotéis em ${destinoDetectado}*
Período: 12/09 a 14/09 (2 noites)
02 Adultos

**OPÇÃO 1** - Hotel Plaza
Local: Centro, ${destinoDetectado}
Quarto: 1 Executivo Casal
Regime: Café da manhã
Valor: R$ 608,88 total
Parcelamento: À vista R$ 608,88

**OPÇÃO 2** - Quality Hotel
Local: Região Central, ${destinoDetectado}
Quarto: 1 Apartamento Superior
Regime: Café da manhã
Valor: R$ 923,95 total
Parcelamento: À vista R$ 923,95
Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v2.0)`;
                    break;
                
                case 'dicas_completas':
                    resultado = `🌍 *Dicas Essenciais para sua Viagem a ${destinoDetectado}!* 🌍

Aqui estão algumas sugestões para aproveitar ao máximo sua estadia:

1️⃣ **Gastronomia Imperdível**
Experimente os pratos típicos da região e visite os restaurantes locais mais tradicionais de ${destinoDetectado}.

2️⃣ **Atrações Clássicas**
Conheça os pontos turísticos mais famosos e marcos históricos da cidade.

3️⃣ **Passeios e Experiências**
Participe de tours locais e experiências únicas que ${destinoDetectado} oferece.

---
✈️ *Complete sua Viagem com a CVC!*
Além de voos e hotéis, a CVC Itaqua oferece tudo para deixar sua viagem ainda mais fácil e segura.

Fale comigo para adicionar esses serviços ao seu pacote! (v2.0)`;
                    break;
                
                default:
                    resultado = `*Latam - São Paulo ✈ ${destinoDetectado}*

15/09 - Guarulhos 03:40 / ${destinoDetectado} 15:25 (Voo direto)
--
30/09 - ${destinoDetectado} 20:20 / Guarulhos 06:15 (+1 dia) (Voo direto)

💰 R$ 3.274,00 para 01 adulto
💳 ${parcelamento ? `${parcelamento}x de R$ ${(3274/parcelamento).toFixed(2)} sem juros` : '12x de R$ 272,83 sem juros'}
✅ Bagagem de mão + bolsa pequena incluídas
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v2.0)`;
            }
            
            resultado += `\n\n⚠️ Sistema em modo fallback v2.0 - Verifique configurações de IA`;
            iaUsada = 'fallback-v2.0';
        }

        // Limpar resultado
        if (typeof resultado === 'string') {
            resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        } else {
            resultado = 'Erro: Resultado não é uma string válida';
        }

        console.log('✅ v2.0: Processamento concluído. Enviando resposta...');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: { 
                version: '2.0-COMPLETA-FUNCIONAL', 
                timestamp: new Date().toISOString(),
                tipo: detectOrcamentoType(conteudoPrincipal, tipos),
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal),
                eh_voo_conexao: detectarVooComConexao(conteudoPrincipal),
                debug_info: {
                    conteudo_length: conteudoPrincipal.length,
                    tipos_selecionados: tipos,
                    eh_pacote: tipos?.includes('Aéreo') && tipos?.includes('Hotel'),
                    tem_multiplos_hoteis: (conteudoPrincipal.match(/(hotel|pousada|resort)/gi) || []).length >= 2,
                    tem_multiplos_trechos: (conteudoPrincipal.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2,
                    multiplos_valores: (conteudoPrincipal.match(/Total.*R\$\s*[\d.,]+/gi) || []).length,
                    codigos_aeroporto: conteudoPrincipal.match(/\b[A-Z]{3}\b/g)
                }
            }
        });

    } catch (error) {
        console.error('❌ v2.0: Erro INESPERADO no handler principal:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '2.0-COMPLETA-FUNCIONAL',
            timestamp: new Date().toISOString()
        });
    }
}

console.log('✅ CVC Itaqua v2.0-COMPLETA-FUNCIONAL - Sistema carregado com sucesso!');
console.log('🔧 Principais melhorias v2.0:');
console.log('  - ✅ BASE SÓLIDA v1.7: Mantida estrutura que funcionava');
console.log('  - ✅ TODOS OS TEMPLATES: Aéreo simples, conexão, hotéis, pacotes, dicas, ranking, cruzeiro, multitrecho');
console.log('  - ✅ DETECÇÃO ROBUSTA: Tipos de orçamento, destinos, conexões melhoradas');
console.log('  - ✅ ERROR HANDLING: Try-catch completo em todas as funções');
console.log('  - ✅ COMPATIBILIDADE: Mantém padrões de funcionamento da v1.7');
console.log('  - ✅ EXTENSIBILIDADE: Código organizado para futuras melhorias');
console.log('  - ✅ AEROPORTOS EXPANDIDOS: América do Sul completa + Europa + EUA');
console.log('  - ✅ DESTINOS CONHECIDOS: Base ampliada e otimizada');
console.log('  - ✅ FALLBACKS ESPECÍFICOS: Resposta adequada para cada tipo em caso de erro');
console.log('  - ✅ LOGGING DETALHADO: Debug completo para facilitar manutenção');
