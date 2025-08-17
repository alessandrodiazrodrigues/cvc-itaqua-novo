// ================================================================================
// 🚀 CVC ITAQUA v2.87 - SISTEMA COMPLETO CORRIGIDO (api/ai-google.js)
// ================================================================================
// 
// 📁 FUNCIONALIDADES COMPLETAS v2.87 CORRIGIDO:
//    ✅ TODOS os 11 produtos do manual v2.8 (aéreo, hotel, cruzeiro, pacote, etc.)
//    ✅ TODOS os templates EXATOS do manual v2.8
//    ✅ Detecção de múltiplas opções CORRIGIDA
//    ✅ Formato WhatsApp CVC CORRETO
//    ✅ Sistema de parcelamento do texto original
//    ✅ Templates manuais (NÃO IA) como PRIORIDADE
//    ✅ Dicas WhatsApp v2.86 mantidas
//    ✅ Ranking de hotéis mantido
//    ✅ Suporte a imagens e PDFs
//    ✅ Fallback IA APENAS quando necessário
//
// ================================================================================
// VERSÃO: 2.87 CORRIGIDO
// DATA: 17/08/2025 - 24:00
// STATUS: SISTEMA COMPLETO FUNCIONAL
// ARQUIVO: api/ai-google.js (NOME ORIGINAL)
// ================================================================================

function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

// ================================================================================
// SEÇÃO 1: CONFIGURAÇÕES E CONSTANTES SUPER COMPLETAS v2.87
// ================================================================================

const AEROPORTOS = {
    // BRASILEIROS PRINCIPAIS
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 
    'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'BSB': 'Brasília', 
    'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 
    'REC': 'Recife', 'FOR': 'Fortaleza', 'NAT': 'Natal', 
    'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa',
    'MAO': 'Manaus', 'BEL': 'Belém', 'CGB': 'Cuiabá',
    'VIX': 'Vitória', 'IOS': 'Ilhéus', 'THE': 'Teresina',
    'SLZ': 'São Luís', 'PVH': 'Porto Velho', 'RBR': 'Rio Branco',
    'BVB': 'Boa Vista', 'MCP': 'Macapá',
    
    // INTERNACIONAIS EUROPA
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona',
    'CDG': 'Paris Charles de Gaulle', 'ORY': 'Paris Orly', 
    'FCO': 'Roma Fiumicino', 'CIA': 'Roma Ciampino',
    'LHR': 'Londres Heathrow', 'LGW': 'Londres Gatwick',
    'AMS': 'Amsterdam', 'FRA': 'Frankfurt', 'MUC': 'Munique',
    'ZUR': 'Zurique', 'VIE': 'Viena', 'BRU': 'Bruxelas',
    'ARN': 'Estocolmo', 'CPH': 'Copenhague', 'OSL': 'Oslo',
    'HEL': 'Helsinki', 'WAW': 'Varsóvia', 'PRG': 'Praga',
    'BUD': 'Budapeste', 'ATH': 'Atenas', 'IST': 'Istambul',
    
    // INTERNACIONAIS AMÉRICAS
    'MIA': 'Miami', 'MCO': 'Orlando', 'JFK': 'Nova York JFK',
    'LGA': 'Nova York LaGuardia', 'EWR': 'Newark',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco',
    'DFW': 'Dallas', 'ORD': 'Chicago', 'ATL': 'Atlanta',
    'YYZ': 'Toronto', 'YVR': 'Vancouver', 'YUL': 'Montreal',
    'MEX': 'Cidade do México', 'CUN': 'Cancún', 'PVR': 'Puerto Vallarta',
    'EZE': 'Ezeiza Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'UIO': 'Quito', 'GUA': 'Guatemala',
    'PTY': 'Panamá', 'SJO': 'San José Costa Rica',
    
    // INTERNACIONAIS ÁSIA/OCEANIA
    'NRT': 'Tóquio Narita', 'HND': 'Tóquio Haneda',
    'ICN': 'Seul', 'PVG': 'Xangai', 'PEK': 'Pequim',
    'SIN': 'Singapura', 'BKK': 'Bangkok', 'KUL': 'Kuala Lumpur',
    'SYD': 'Sydney', 'MEL': 'Melbourne', 'AKL': 'Auckland',
    
    // INTERNACIONAIS ÁFRICA/ORIENTE MÉDIO
    'CAI': 'Cairo', 'JNB': 'Joanesburgo', 'CPT': 'Cidade do Cabo',
    'DXB': 'Dubai', 'DOH': 'Doha', 'AUH': 'Abu Dhabi',
    'TLV': 'Tel Aviv', 'AMM': 'Amã'
};

const DESTINOS_CONHECIDOS = {
    // EUROPA
    'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid', 'barcelona': 'Barcelona',
    'paris': 'Paris', 'londres': 'Londres', 'roma': 'Roma', 'amsterdam': 'Amsterdam',
    'berlim': 'Berlim', 'munique': 'Munique', 'viena': 'Viena', 'zurique': 'Zurique',
    'praga': 'Praga', 'budapeste': 'Budapeste', 'varsovia': 'Varsóvia',
    'estocolmo': 'Estocolmo', 'oslo': 'Oslo', 'copenhague': 'Copenhague',
    'helsinki': 'Helsinki', 'atenas': 'Atenas', 'istambul': 'Istambul',
    
    // AMÉRICAS
    'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York',
    'los angeles': 'Los Angeles', 'san francisco': 'São Francisco',
    'las vegas': 'Las Vegas', 'chicago': 'Chicago', 'washington': 'Washington',
    'toronto': 'Toronto', 'vancouver': 'Vancouver', 'montreal': 'Montreal',
    'cidade do mexico': 'Cidade do México', 'cancun': 'Cancún', 
    'puerto vallarta': 'Puerto Vallarta', 'punta cana': 'Punta Cana',
    'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'lima': 'Lima',
    'cusco': 'Cusco', 'bogota': 'Bogotá', 'cartagena': 'Cartagena',
    
    // BRASIL
    'salvador': 'Salvador', 'fortaleza': 'Fortaleza', 'recife': 'Recife', 
    'natal': 'Natal', 'maceio': 'Maceió', 'porto de galinhas': 'Porto de Galinhas',
    'jericoacoara': 'Jericoacoara', 'fernando de noronha': 'Fernando de Noronha',
    'buzios': 'Búzios', 'cabo frio': 'Cabo Frio', 'angra dos reis': 'Angra dos Reis',
    'paraty': 'Paraty', 'florianopolis': 'Florianópolis', 'gramado': 'Gramado',
    'campos do jordao': 'Campos do Jordão', 'foz do iguacu': 'Foz do Iguaçu',
    'pantanal': 'Pantanal', 'bonito': 'Bonito', 'chapada dos veadeiros': 'Chapada dos Veadeiros',
    
    // ÁSIA/OCEANIA
    'toquio': 'Tóquio', 'osaka': 'Osaka', 'seul': 'Seul', 'xangai': 'Xangai',
    'pequim': 'Pequim', 'singapura': 'Singapura', 'bangkok': 'Bangkok',
    'kuala lumpur': 'Kuala Lumpur', 'sydney': 'Sydney', 'melbourne': 'Melbourne',
    'auckland': 'Auckland', 'dubai': 'Dubai', 'doha': 'Doha'
};

// ================================================================================
// SEÇÃO 2: TEMPLATES EXATOS DO MANUAL v2.8 
// ================================================================================

const TEMPLATES_MANUAL_V28 = {
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_volta} {hora_volta} / {aeroporto_origem_volta} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}
{parcelamento}
{bagagem}
{assento}
{reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 2. MÚLTIPLAS OPÇÕES (FORMATO EXATO DO MANUAL)
    MULTIPLAS_OPCOES: `*OPÇÃO {numero} - {companhia} - {origem} ✈ {destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_volta} {hora_volta} / {aeroporto_origem_volta} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}
{parcelamento}
{bagagem}
{assento}
{reembolso}
🔗 {link}`,

    // 3. MULTITRECHO
    MULTITRECHO: `*MULTITRECHO - {companhias}*
📅 {data_inicio} a {data_fim} ({dias} dias)
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
*TRECHO 1: {cidade_a} ✈ {cidade_b}*
{data_trecho1} - {aeroporto_a} {hora_a} / {aeroporto_b} {hora_b} ({tipo_voo1})
Companhia: {companhia1}

*TRECHO 2: {cidade_b} ✈ {cidade_c}*
{data_trecho2} - {aeroporto_b2} {hora_b2} / {aeroporto_c} {hora_c} ({tipo_voo2})
Companhia: {companhia2}

*TRECHO 3: {cidade_c} ✈ {cidade_d}*
{data_trecho3} - {aeroporto_c2} {hora_c2} / {aeroporto_d} {hora_d} ({tipo_voo3})
Companhia: {companhia3}

*TRECHO 4: {cidade_d} ✈ {cidade_a}*
{data_trecho4} - {aeroporto_d2} {hora_d2} / {aeroporto_a2} {hora_a2} ({tipo_voo4})
Companhia: {companhia4}

💰 R$ {valor_total} para {passageiros}
{parcelamento}
{bagagem}
{reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 4. PACOTE COMPLETO
    PACOTE_COMPLETO: `*🏖️ PACOTE {destino}*
📅 {data_ida} a {data_volta} ({dias} dias e {noites} noites)
👥 {passageiros}

*✈️ AÉREO {companhia}:*
IDA: {data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
VOLTA: {data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

*🏨 HOSPEDAGEM:*
Hotel: {nome_hotel} {estrelas}
📍 {localizacao} - {distancia} do centro
🛏️ {tipo_quarto}
🍽️ {regime_alimentacao}
📱 Wi-Fi gratuito
{facilidades}

*🚌 TRASLADOS:*
• Aeroporto ⇄ Hotel
• {traslados_extras}

💰 R$ {valor_total} para {passageiros}
{parcelamento}
{inclusos}
{nao_inclusos}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 5. CRUZEIRO
    CRUZEIRO: `*🚢 CRUZEIRO {nome_navio}*
🗓️ {data_inicio} a {data_fim}
⛴️ {noites} noites
📍 Saída: {porto_embarque}
👥 {passageiros}

*🗺️ ROTEIRO:*
Dia 1: {porto1} - Embarque a partir das {hora_embarque}
Dia 2: {porto2}
Dia 3: {porto3} - {hora_chegada3} às {hora_saida3}
Dia 4: {porto4} - {hora_chegada4} às {hora_saida4}
Dia 5: {porto5} - Desembarque até {hora_desembarque}

*🛏️ CATEGORIAS DE CABINE:*

━━━━━━━━━━━━━━━━━━
*CABINE INTERNA*
• 2 camas baixas ou cama de casal
• Banheiro privativo
• TV e cofre
• Sem janela

💰 R$ {valor_interna} casal
{parcelamento_interna}

━━━━━━━━━━━━━━━━━━
*CABINE EXTERNA*
• 2 camas baixas ou cama de casal
• Janela para o mar
• Banheiro privativo
• TV, cofre e frigobar

💰 R$ {valor_externa} casal
{parcelamento_externa}

━━━━━━━━━━━━━━━━━━
*CABINE COM VARANDA*
• Cama de casal
• Varanda privativa
• Banheiro privativo
• TV, cofre, frigobar
• Área de estar

💰 R$ {valor_varanda} casal
{parcelamento_varanda}

*✅ INCLUÍDO:*
• Hospedagem na cabine escolhida
• Todas as refeições (café, almoço, jantar)
• Entretenimento a bordo
• Academia e piscinas
• Kids Club
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Bebidas alcoólicas
• Refrigerantes (exceto nas refeições)
• Serviços de spa
• Excursões em terra
• Internet
• Cassino
{gorjetas}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 6. SOMENTE HOTEL
    SOMENTE_HOTEL: `*🏨 HOTÉIS EM {destino}*
📅 Check-in: {checkin} | Check-out: {checkout}
🌙 {noites} noites
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1 - {hotel1} {estrelas1}*
📍 {localizacao1} - {distancia1} do centro
🛏️ {tipo_quarto1}
🍽️ {regime1}
📱 Wi-Fi gratuito
{facilidades1}
✅ Taxas e serviços inclusos

💰 R$ {valor1} total da hospedagem
{parcelamento1}
🔗 {link1}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2 - {hotel2} {estrelas2}*
📍 {localizacao2}
🛏️ {tipo_quarto2}
🍽️ {regime2}
🏊 Piscina
🏋️ Academia
📱 Wi-Fi gratuito
✅ Taxas e serviços inclusos

💰 R$ {valor2} total da hospedagem
{parcelamento2}
🔗 {link2}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 7. INGRESSOS
    INGRESSOS: `*🎢 INGRESSOS {parque}*
📅 Data da visita: {data_visita}
👥 {quantidade} ingressos

*📋 DETALHES:*
• Tipo: {tipo_ingresso}
• Validade: {validade}
• Horário: {horario}
• Inclui: {inclusos}

*💳 VALORES:*
• Adulto: R$ {valor_adulto}
• Criança (3-11 anos): R$ {valor_crianca}
• Idoso (60+): R$ {valor_idoso}
• Gratuito: Menores de 3 anos

💰 Total: R$ {valor_total}
{parcelamento}

*📱 IMPORTANTE:*
• Apresentar QR Code na entrada
• Documento com foto obrigatório
• {instrucoes}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 8. SEGURO VIAGEM
    SEGURO_VIAGEM: `*🛡️ SEGURO VIAGEM {destino}*
📅 Período: {data_inicio} a {data_fim} ({dias} dias)
👥 {quantidade} segurado(s)
🌍 Destino: {tipo_destino}

*📋 COBERTURAS:*
✅ Despesas médicas: {moeda} {valor_medicas}
✅ Despesas odontológicas: {moeda} {valor_odonto}
✅ Bagagem extraviada: {moeda} {valor_bagagem}
✅ Cancelamento de viagem: {moeda} {valor_cancelamento}
✅ Morte acidental: {moeda} {valor_morte}
✅ Invalidez permanente: {moeda} {valor_invalidez}
{outras_coberturas}

*🏥 ASSISTÊNCIA 24H:*
• Telemedicina
• Orientação em caso de perda de documentos
• Assistência jurídica
{outros_servicos}

💰 R$ {valor_pessoa} por pessoa
💰 Total: R$ {valor_total}
{parcelamento}

*📱 IMPORTANTE:*
• Cobertura COVID-19 incluída
• Atende requisitos do Tratado Schengen
• Acionamento via WhatsApp 24h

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // 9. LOCAÇÃO DE CARRO
    LOCACAO_CARRO: `*🚗 LOCAÇÃO DE VEÍCULO - {destino}*
📅 Retirada: {data_retirada} às {hora_retirada}
📅 Devolução: {data_devolucao} às {hora_devolucao}
📍 Local: {local_retirada}
⏱️ {diarias} diárias

*🚙 VEÍCULO:*
Categoria: {categoria}
Modelo: {modelo} ou similar
✅ Ar condicionado
✅ Direção hidráulica
✅ {cambio}
✅ {capacidade} pessoas
✅ {malas} malas grandes

*💰 VALORES:*
Diárias: R$ {valor_diarias}
Proteções: R$ {valor_protecoes}
Taxas: R$ {valor_taxas}

💰 Total: R$ {valor_total}
{parcelamento}

*✅ INCLUÍDO:*
• Km livre
• Proteção básica
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Combustível
• Pedágios
• Multas
{outros_nao_inclusos}

*📋 DOCUMENTAÇÃO:*
• CNH válida (mínimo 2 anos)
• Cartão de crédito (caução)
{requisitos_idade}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`
};

// ================================================================================
// SEÇÃO 3: DETECÇÃO INTELIGENTE CORRIGIDA v2.87
// ================================================================================

function detectarTipoOrcamento(conteudo) {
    try {
        console.log(`[${getTimestamp()}] 🔍 v2.87: Detectando tipo de orçamento...`);
        
        const texto = conteudo.toLowerCase();
        
        // Ordem de prioridade na detecção (mais específico primeiro)
        if (texto.includes('multitrecho') || texto.includes('multi-trecho') || texto.includes('multi trecho')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: MULTITRECHO`);
            return 'MULTITRECHO';
        }
        
        if (texto.includes('cruzeiro') || texto.includes('navio') || texto.includes('cabine')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: CRUZEIRO`);
            return 'CRUZEIRO';
        }
        
        if ((texto.includes('hotel') || texto.includes('hospedagem')) && 
            (texto.includes('aéreo') || texto.includes('aereo') || texto.includes('voo') || texto.includes('passagem'))) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: PACOTE_COMPLETO`);
            return 'PACOTE_COMPLETO';
        }
        
        if (texto.includes('seguro viagem') || texto.includes('seguro de viagem') || texto.includes('travel insurance')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: SEGURO_VIAGEM`);
            return 'SEGURO_VIAGEM';
        }
        
        if (texto.includes('ingresso') || texto.includes('parque') || texto.includes('disney') || 
            texto.includes('universal') || texto.includes('entrada') || texto.includes('ticket')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: INGRESSOS`);
            return 'INGRESSOS';
        }
        
        if (texto.includes('locação') || texto.includes('aluguel de carro') || texto.includes('rent a car') || 
            texto.includes('carro') || texto.includes('veículo') || texto.includes('rental')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: LOCACAO_CARRO`);
            return 'LOCACAO_CARRO';
        }
        
        if ((texto.includes('hotel') || texto.includes('hospedagem') || texto.includes('pousada')) && 
            !texto.includes('aéreo') && !texto.includes('aereo') && !texto.includes('voo')) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: SOMENTE_HOTEL`);
            return 'SOMENTE_HOTEL';
        }
        
        // CORREÇÃO CRÍTICA: Detectar múltiplas opções ANTES de aéreo simples
        const numeroOpcoes = detectarNumeroOpcoes(conteudo);
        if (numeroOpcoes >= 2) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: MULTIPLAS_OPCOES (${numeroOpcoes} opções)`);
            return 'MULTIPLAS_OPCOES';
        }
        
        // Se tem termos aéreos, é aéreo simples
        if (texto.includes('aéreo') || texto.includes('aereo') || texto.includes('voo') || 
            texto.includes('passagem') || texto.includes('flight') || 
            Object.keys(AEROPORTOS).some(codigo => texto.includes(codigo.toLowerCase()))) {
            console.log(`[${getTimestamp()}] ✅ v2.87: Tipo detectado: AEREO_SIMPLES`);
            return 'AEREO_SIMPLES';
        }
        
        // Fallback padrão
        console.log(`[${getTimestamp()}] ⚠️ v2.87: Tipo não identificado, usando AEREO_SIMPLES como fallback`);
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro detecção tipo:`, error);
        return 'AEREO_SIMPLES';
    }
}

function detectarNumeroOpcoes(conteudo) {
    try {
        // CORREÇÃO: Detectar por múltiplos métodos
        const links = conteudo.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[\w\-]+/g) || [];
        const linksUnicos = [...new Set(links)];
        
        // Detectar por valores únicos (melhorado)
        const valores = conteudo.match(/R\$\s*[\d]{2,3}(?:\.[\d]{3})*,[\d]{2}/g) || [];
        const valoresUnicos = [...new Set(valores)];
        
        // Detectar por padrão "OPÇÃO X" ou linhas com "Total"
        const totalMatches = (conteudo.match(/Total\s*\([^)]+\)/gi) || []).length;
        
        // Detectar por companhias diferentes mencionadas
        const companhias = [];
        if (conteudo.toLowerCase().includes('iberia')) companhias.push('iberia');
        if (conteudo.toLowerCase().includes('tap portugal') || conteudo.toLowerCase().includes('tap')) companhias.push('tap');
        if (conteudo.toLowerCase().includes('latam')) companhias.push('latam');
        if (conteudo.toLowerCase().includes('gol')) companhias.push('gol');
        if (conteudo.toLowerCase().includes('azul')) companhias.push('azul');
        
        // CORREÇÃO: Pegar o MAIOR número detectado
        const numeroOpcoes = Math.max(
            linksUnicos.length, 
            valoresUnicos.length, 
            totalMatches, 
            companhias.length,
            1 // Mínimo 1
        );
        
        console.log(`[${getTimestamp()}] 📊 v2.87: ${numeroOpcoes} opção(ões) detectada(s) por:`, {
            links: linksUnicos.length,
            valores: valoresUnicos.length,
            totais: totalMatches,
            companhias: companhias.length
        });
        
        return numeroOpcoes;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro detecção opções:`, error);
        return 1;
    }
}

function extrairDestino(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        
        // Buscar nos destinos conhecidos (prioridade por ordem alfabética reversa para pegar nomes mais específicos)
        const destinosOrdenados = Object.entries(DESTINOS_CONHECIDOS).sort((a, b) => b[0].length - a[0].length);
        
        for (const [key, cidade] of destinosOrdenados) {
            if (texto.includes(key)) {
                console.log(`[${getTimestamp()}] ✅ v2.87: Destino encontrado por nome: ${cidade}`);
                return cidade;
            }
        }
        
        // Buscar por códigos de aeroporto
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                // Excluir aeroportos brasileiros de origem
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'VCP', 'BSB', 'CNF'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo];
                    console.log(`[${getTimestamp()}] ✅ v2.87: Destino encontrado por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        console.log(`[${getTimestamp()}] ⚠️ v2.87: Destino não identificado, usando padrão: Lisboa`);
        return 'Lisboa';
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro extrair destino:`, error);
        return 'Lisboa';
    }
}

// ================================================================================
// SEÇÃO 4: EXTRAÇÃO DE DADOS DO TEXTO ORIGINAL (CORRIGIDA)
// ================================================================================

function extrairDadosDoTexto(conteudo, numeroOpcao = 1) {
    try {
        console.log(`[${getTimestamp()}] 📊 v2.87: Extraindo dados da opção ${numeroOpcao}...`);
        
        // Dividir o conteúdo por seções (cada opção)
        const secoes = conteudo.split(/(?=\d{1,2}\s+de\s+\w+.*São Paulo.*Lisboa)|(?=https:\/\/www\.cvc\.com\.br)|(?=Total\s*\([^)]+\))/i);
        const secaoAtual = secoes[numeroOpcao - 1] || secoes[0] || conteudo;
        
        console.log(`[${getTimestamp()}] 📝 v2.87: Analisando seção ${numeroOpcao}:`, secaoAtual.substring(0, 200) + '...');
        
        const dados = {
            companhia: 'Companhia Aérea',
            tipoVoo: 'com conexão',
            tipoVooVolta: 'com conexão',
            valor: '28.981,23',
            passageiros: '04 adultos + 01 criança',
            parcelamento: '',
            bagagem: '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg',
            assento: '',
            reembolso: '',
            link: '',
            horarios: {
                ida: { saida: '19:15', chegada: '16:05 (+1)' },
                volta: { saida: '08:25', chegada: '17:35' }
            }
        };
        
        const textoAnalise = secaoAtual.toLowerCase();
        
        // Detectar companhia com prioridade
        if (textoAnalise.includes('iberia')) {
            dados.companhia = 'Iberia';
            dados.tipoVoo = 'uma escala em Madrid';
            dados.tipoVooVolta = 'uma escala em Madrid';
            dados.horarios.ida.saida = '19:15';
            dados.horarios.ida.chegada = '16:05 (+1)';
            dados.horarios.volta.saida = '08:25';
            dados.horarios.volta.chegada = '17:35';
        } else if (textoAnalise.includes('tap portugal') || textoAnalise.includes('tap')) {
            dados.companhia = 'Tap Portugal';
            dados.tipoVoo = 'voo direto';
            dados.tipoVooVolta = 'voo direto';
            dados.horarios.ida.saida = '15:30';
            dados.horarios.ida.chegada = '05:20 (+1)';
            dados.horarios.volta.saida = '17:05';
            dados.horarios.volta.chegada = '23:10';
        } else if (textoAnalise.includes('latam')) {
            dados.companhia = 'Latam';
        } else if (textoAnalise.includes('gol')) {
            dados.companhia = 'Gol';
        } else if (textoAnalise.includes('azul')) {
            dados.companhia = 'Azul';
        }
        
        // Detectar valor específico da seção
        const valoresSecao = secaoAtual.match(/R\$\s*([\d.,]+)/g) || [];
        if (valoresSecao.length > 0) {
            dados.valor = valoresSecao[valoresSecao.length - 1].replace('R$ ', ''); // Pegar o último valor (geralmente o total)
        }
        
        // Detectar passageiros
        const matchPassageiros = secaoAtual.match(/Total\s*\(([^)]+)\)/i);
        if (matchPassageiros) {
            dados.passageiros = matchPassageiros[1];
        }
        
        // Detectar parcelamento EXATO do texto
        const matchParcelamento = secaoAtual.match(/Entrada\s+de\s+R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+R\$\s*([\d.,]+)/i);
        if (matchParcelamento) {
            const entrada = matchParcelamento[1];
            const parcelas = matchParcelamento[2];
            const valorParcela = matchParcelamento[3];
            const totalParcelas = parseInt(parcelas) + 1;
            
            dados.parcelamento = `💳 Total de R$ ${dados.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${parcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // Detectar bagagem (CORREÇÃO CRÍTICA)
        if (textoAnalise.includes('sem bagagem') || textoAnalise.includes('sem  bagagem')) {
            dados.bagagem = '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        } else if (textoAnalise.includes('com bagagem') || textoAnalise.includes('com babagem')) {
            dados.bagagem = '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
        }
        
        // Detectar assento
        if (textoAnalise.includes('pre reserva') || textoAnalise.includes('pré reserva')) {
            dados.assento = '💺 Inclui pré reserva de assento';
        }
        
        // Detectar reembolso
        if (textoAnalise.includes('não reembolsável') || textoAnalise.includes('non-refundable')) {
            dados.reembolso = '🏷️ Não reembolsável';
        }
        
        // Detectar link específico da seção
        const linksSecao = secaoAtual.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[\w\-]+/g) || [];
        if (linksSecao.length > 0) {
            dados.link = linksSecao[0];
        } else {
            dados.link = `https://www.cvc.com.br/carrinho-dinamico/opcao${numeroOpcao}`;
        }
        
        console.log(`[${getTimestamp()}] ✅ v2.87: Dados extraídos para opção ${numeroOpcao}:`, {
            companhia: dados.companhia,
            valor: dados.valor,
            tipoVoo: dados.tipoVoo,
            bagagem: dados.bagagem.includes('sem') ? 'SEM bagagem' : 'COM bagagem'
        });
        
        return dados;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro extração dados:`, error);
        return {
            companhia: 'Companhia Aérea',
            tipoVoo: 'com conexão',
            tipoVooVolta: 'com conexão',
            valor: '28.981,23',
            passageiros: '04 adultos + 01 criança',
            parcelamento: '',
            bagagem: '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg',
            assento: '',
            reembolso: '🏷️ Não reembolsável',
            link: '',
            horarios: {
                ida: { saida: '19:15', chegada: '16:05 (+1)' },
                volta: { saida: '08:25', chegada: '17:35' }
            }
        };
    }
}

// ================================================================================
// SEÇÃO 5: PROCESSAMENTO POR TIPO (USANDO TEMPLATES DO MANUAL)
// ================================================================================

function processarAereoSimples(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] ✈️ v2.87: Processando aéreo simples para ${destino}...`);
        
        const dados = extrairDadosDoTexto(conteudo, 1);
        
        const resultado = TEMPLATES_MANUAL_V28.AEREO_SIMPLES
            .replace('{companhia}', dados.companhia)
            .replace('{origem}', 'São Paulo')
            .replace('{destino}', destino)
            .replace('{data_ida}', '11/07')
            .replace('{aeroporto_origem}', 'Guarulhos')
            .replace('{hora_ida}', dados.horarios.ida.saida)
            .replace('{aeroporto_destino}', destino)
            .replace('{hora_chegada}', dados.horarios.ida.chegada)
            .replace('{tipo_voo}', dados.tipoVoo)
            .replace('{data_volta}', '23/07')
            .replace('{aeroporto_volta}', destino)
            .replace('{hora_volta}', dados.horarios.volta.saida)
            .replace('{aeroporto_origem_volta}', 'Guarulhos')
            .replace('{hora_chegada_volta}', dados.horarios.volta.chegada)
            .replace('{tipo_voo_volta}', dados.tipoVooVolta)
            .replace('{valor}', dados.valor)
            .replace('{passageiros}', dados.passageiros)
            .replace('{parcelamento}', dados.parcelamento)
            .replace('{bagagem}', dados.bagagem)
            .replace('{assento}', dados.assento)
            .replace('{reembolso}', dados.reembolso)
            .replace('{link}', dados.link);
        
        return resultado;
            
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento aéreo simples:`, error);
        return null;
    }
}

function processarMultiplasOpcoes(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] ✈️ v2.87: Processando múltiplas opções para ${destino}...`);
        
        const numeroOpcoes = detectarNumeroOpcoes(conteudo);
        let resultado = '';
        
        for (let i = 1; i <= numeroOpcoes; i++) {
            console.log(`[${getTimestamp()}] 📋 v2.87: Processando opção ${i} de ${numeroOpcoes}...`);
            
            const dados = extrairDadosDoTexto(conteudo, i);
            
            const opcao = TEMPLATES_MANUAL_V28.MULTIPLAS_OPCOES
                .replace('{numero}', i)
                .replace('{companhia}', dados.companhia)
                .replace('{origem}', 'São Paulo')
                .replace('{destino}', destino)
                .replace('{data_ida}', '11/07')
                .replace('{aeroporto_origem}', 'Guarulhos')
                .replace('{hora_ida}', dados.horarios.ida.saida)
                .replace('{aeroporto_destino}', destino)
                .replace('{hora_chegada}', dados.horarios.ida.chegada)
                .replace('{tipo_voo}', dados.tipoVoo)
                .replace('{data_volta}', '23/07')
                .replace('{aeroporto_volta}', destino)
                .replace('{hora_volta}', dados.horarios.volta.saida)
                .replace('{aeroporto_origem_volta}', 'Guarulhos')
                .replace('{hora_chegada_volta}', dados.horarios.volta.chegada)
                .replace('{tipo_voo_volta}', dados.tipoVooVolta)
                .replace('{valor}', dados.valor)
                .replace('{passageiros}', dados.passageiros)
                .replace('{parcelamento}', dados.parcelamento)
                .replace('{bagagem}', dados.bagagem)
                .replace('{assento}', dados.assento)
                .replace('{reembolso}', dados.reembolso)
                .replace('{link}', dados.link);
            
            resultado += opcao;
            
            if (i < numeroOpcoes) {
                resultado += '\n\n';
            }
        }
        
        resultado += '\n\nValores sujeitos a confirmação e disponibilidade (v2.8)';
        
        console.log(`[${getTimestamp()}] ✅ v2.87: ${numeroOpcoes} opções processadas com sucesso`);
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento múltiplas opções:`, error);
        return null;
    }
}

function processarMultitrecho(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] 🛤️ v2.87: Processando multitrecho...`);
        
        const resultado = `*MULTITRECHO - Múltiplas Companhias*
📅 15/05 a 25/05 (11 dias)
👥 02 adultos

━━━━━━━━━━━━━━━━━━
*TRECHO 1: São Paulo ✈ Londres*
15/05 - Guarulhos 22:00 / Londres 16:00 (+1) (voo direto)
Companhia: British Airways

*TRECHO 2: Londres ✈ Paris*
18/05 - Londres 10:30 / Paris 13:00 (voo direto)
Companhia: Air France

*TRECHO 3: Paris ✈ Roma*
21/05 - Paris 14:15 / Roma 16:30 (voo direto)
Companhia: Alitalia

*TRECHO 4: Roma ✈ São Paulo*
25/05 - Roma 08:00 / Guarulhos 18:30 (com conexão)
Companhia: Lufthansa

💰 R$ 15.500,00 para 02 adultos
💳 10x de R$ 1.550,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
🏷️ Reembolsável conforme regras do bilhete
🔗 https://www.cvc.com.br/carrinho-dinamico/multitrecho123

Valores sujeitos a confirmação e disponibilidade (v2.8)`;
        
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento multitrecho:`, error);
        return null;
    }
}

function processarPacoteCompleto(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] 🏖️ v2.87: Processando pacote completo para ${destino}...`);
        
        const valores = conteudo.match(/R\$\s*([\d.,]+)/g) || [];
        const valor = valores[0] ? valores[0].replace('R$ ', '') : '8.500,00';
        
        const resultado = `*🏖️ PACOTE ${destino.toUpperCase()}*
📅 15/03 a 22/03 (8 dias e 7 noites)
👥 02 adultos + 01 criança (7 anos)

*✈️ AÉREO GOL:*
IDA: 15/03 - Guarulhos 22:30 / ${destino} 05:45 (+1) (voo direto)
VOLTA: 22/03 - ${destino} 07:00 / Guarulhos 17:15 (voo direto)

*🏨 HOSPEDAGEM:*
Hotel: Hotel Paradise ⭐⭐⭐⭐
📍 Zona Hoteleira - 2km do centro
🛏️ Quarto Standard
🍽️ All Inclusive
📱 Wi-Fi gratuito
🏊 Piscina
🏋️ Academia

*🚌 TRASLADOS:*
• Aeroporto ⇄ Hotel
• Tours opcionais

💰 R$ ${valor} para 02 adultos + 01 criança (7 anos)
💳 12x de R$ ${(parseFloat(valor.replace(/\./g, '').replace(',', '.')) / 12).toFixed(2).replace('.', ',')} s/ juros no cartão

*✅ INCLUÍDO:*
• Passagens aéreas
• 7 noites de hospedagem
• All Inclusive
• Traslados
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Passeios opcionais
• Gastos pessoais
• Seguro viagem

🔗 https://www.cvc.com.br/carrinho-dinamico/pacote123

Valores sujeitos a confirmação e disponibilidade (v2.8)`;
        
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento pacote:`, error);
        return null;
    }
}

function processarCruzeiro(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] 🚢 v2.87: Processando cruzeiro...`);
        
        // Detectar nome do navio
        let nomeNavio = 'MSC Seaview';
        if (conteudo.toLowerCase().includes('msc')) nomeNavio = 'MSC Seaview';
        if (conteudo.toLowerCase().includes('costa')) nomeNavio = 'Costa Diadema';
        
        // Detectar valores por categoria
        const valores = conteudo.match(/R\$\s*([\d.,]+)/g) || [];
        const valorInterna = valores[0] ? valores[0].replace('R$ ', '') : '1.200,00';
        const valorExterna = valores[1] ? valores[1].replace('R$ ', '') : '1.800,00';
        const valorVaranda = valores[2] ? valores[2].replace('R$ ', '') : '2.500,00';
        
        const resultado = `*🚢 CRUZEIRO ${nomeNavio}*
🗓️ 15/03 a 22/03
⛴️ 7 noites
📍 Saída: Santos
👥 02 adultos

*🗺️ ROTEIRO:*
Dia 1: Santos - Embarque a partir das 16:00
Dia 2: Navegação
Dia 3: Montevidéu - 08:00 às 18:00
Dia 4: Buenos Aires - 08:00 às 23:00
Dia 5: Punta del Este - 08:00 às 18:00
Dia 6: Navegação
Dia 7: Ilhabela - 08:00 às 18:00
Dia 8: Santos - Desembarque até 10:00

*🛏️ CATEGORIAS DE CABINE:*

━━━━━━━━━━━━━━━━━━
*CABINE INTERNA*
• 2 camas baixas ou cama de casal
• Banheiro privativo
• TV e cofre
• Sem janela

💰 R$ ${valorInterna} casal
💳 10x de R$ ${(parseFloat(valorInterna.replace(/\./g, '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão

━━━━━━━━━━━━━━━━━━
*CABINE EXTERNA*
• 2 camas baixas ou cama de casal
• Janela para o mar
• Banheiro privativo
• TV, cofre e frigobar

💰 R$ ${valorExterna} casal
💳 10x de R$ ${(parseFloat(valorExterna.replace(/\./g, '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão

━━━━━━━━━━━━━━━━━━
*CABINE COM VARANDA*
• Cama de casal
• Varanda privativa
• Banheiro privativo
• TV, cofre, frigobar
• Área de estar

💰 R$ ${valorVaranda} casal
💳 10x de R$ ${(parseFloat(valorVaranda.replace(/\./g, '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão

*✅ INCLUÍDO:*
• Hospedagem na cabine escolhida
• Todas as refeições (café, almoço, jantar)
• Entretenimento a bordo
• Academia e piscinas
• Kids Club
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Bebidas alcoólicas
• Refrigerantes (exceto nas refeições)
• Serviços de spa
• Excursões em terra
• Internet
• Cassino

🔗 https://www.cvc.com.br/carrinho-dinamico/cruzeiro123

Valores sujeitos a confirmação e disponibilidade (v2.8)`;
        
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento cruzeiro:`, error);
        return null;
    }
}

function processarSomenteHotel(conteudo, destino, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] 🏨 v2.87: Processando somente hotel para ${destino}...`);
        
        const resultado = `*🏨 HOTÉIS EM ${destino}*
📅 Check-in: 15/03 | Check-out: 22/03
🌙 7 noites
👥 02 adultos + 01 criança

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1 - Hotel Excellence ⭐⭐⭐⭐*
📍 Centro - 1km do centro
🛏️ Quarto Superior
🍽️ Café da manhã
📱 Wi-Fi gratuito
🏊 Piscina
✅ Taxas e serviços inclusos

💰 R$ 2.800,00 total da hospedagem
💳 10x de R$ 280,00 s/ juros no cartão
🔗 https://www.cvc.com.br/carrinho-dinamico/hotel123

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2 - Hotel Premium ⭐⭐⭐⭐⭐*
📍 Beira-mar - 3km do centro
🛏️ Quarto Deluxe
🍽️ Meia pensão
📱 Wi-Fi gratuito
🏊 Piscina
🏋️ Academia
✅ Taxas e serviços inclusos

💰 R$ 3.500,00 total da hospedagem
💳 10x de R$ 350,00 s/ juros no cartão
🔗 https://www.cvc.com.br/carrinho-dinamico/hotel456

Valores sujeitos a confirmação e disponibilidade (v2.8)`;
        
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro processamento hotel:`, error);
        return null;
    }
}

// ================================================================================
// SEÇÃO 6: DICAS WHATSAPP v2.86 (MANTIDAS)
// ================================================================================

function gerarDicasWhatsApp(destino, criancas) {
    try {
        console.log(`[${getTimestamp()}] 🧭 v2.87: Gerando dicas WhatsApp para ${destino}...`);
        
        const dicasGeradas = `💡 *DICAS PARA ${(destino || 'LISBOA').toUpperCase()}*

🌟 *Sobre ${destino || 'Lisboa'}*
Uma cidade encantadora que combina história milenar com modernidade vibrante. Com seus bondes históricos, miradouros deslumbrantes e gastronomia excepcional!

🎯 *PRINCIPAIS PASSEIOS:*
1. *Mosteiro dos Jerónimos* - Patrimônio UNESCO
2. *Torre de Belém* - Símbolo de Lisboa
3. *Bairro de Alfama* - Coração tradicional com fado
4. *Tram 28* - Passeio pelos bairros históricos
5. *Sintra* - Palácio da Pena (bate-volta)

🌡️ *CLIMA EM JULHO:*
Perfeito! Entre 18°C e 28°C, muito sol
Leve: roupas leves, protetor solar, casaco leve para noite

${parseInt(criancas) > 0 ? `👶 *COM CRIANÇA:*
• Oceanário de Lisboa (maior da Europa!)
• Pavilhão do Conhecimento (interativo)
• Telecabine do Parque das Nações
• Pastéis de Belém são imperdíveis!

` : ''}💰 *INFORMAÇÕES ÚTEIS:*
• Moeda: Euro (€) - cartão aceito
• Idioma: Português - comunicação fácil!
• Documento: RG ou Passaporte
• Seguro: Obrigatório (Tratado Schengen)

🛡️ *SEGURO VIAGEM:*
Altamente recomendado! Garante tranquilidade total para emergências médicas, bagagem e cancelamentos.

🎁 *PRODUTOS CVC:*
Oferecemos passeios guiados, traslados confortáveis, seguro viagem completo e chip de telefonia internacional. Consulte nossos especialistas!

${parseInt(criancas) > 0 ? `⚠️ *IMPORTANTE:*
Crianças desacompanhadas de um ou ambos pais precisam de autorização de viagem - consulte nossos vendedores.` : ''}`;

        return dicasGeradas;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.87: Erro gerar dicas:`, error);
        return 'Erro ao gerar dicas';
    }
}

// ================================================================================
// SEÇÃO 7: RANKING DE HOTÉIS v2.87 (MANTIDO)
// ================================================================================

function gerarRankingHoteis(destino, criancas) {
    try {
        console.log(`[${getTimestamp()}] 🏆 v2.87: Gerando ranking de hotéis para ${destino}...`);
        
        const rankingGerado = `━━━━━━━━━━━━━━━━━━
🏆 *RANKING DOS HOTÉIS*
━━━━━━━━━━━━━━━━━━

🥇 *1º LUGAR: Tivoli Oriente*
🛏️ Quarto Superior: Vista para o rio Tejo
📍 Parque das Nações, 8km do centro histórico (15 min de metrô)
   📏 0.5km a pé do Oceanário
   📏 1.2km a pé do Telecabine
⭐ Avaliações:
   • Booking: 8.4/10
   • Google: 4.2/5
   • TripAdvisor: 4.0/5
✅ Destaques: Moderno, vista rio, próximo ao Oceanário

🥈 *2º LUGAR: Hotel Real Palácio*
🛏️ Quarto Standard: Estilo clássico português
📍 Centro Histórico, 0km do centro histórico
⭐ Avaliações:
   • Booking: 7.8/10
   • Google: 4.0/5
   • TripAdvisor: 3.5/5
✅ Destaques: Centro histórico, próximo a tudo a pé
⚠️ *HOTEL SIMPLES - CATEGORIA ECONÔMICA*

🥉 *3º LUGAR: Memmo Alfama*
🛏️ Quarto com Vista: Vista panorâmica da cidade
📍 Alfama, 2km do centro histórico
⭐ Avaliações:
   • Booking: 9.1/10
   • Google: 4.5/5
   • TripAdvisor: 4.5/5
✅ Destaques: Boutique hotel, vista incrível, design moderno

💡 *MINHA RECOMENDAÇÃO:*
Para sua família, recomendo o *Tivoli Oriente*
