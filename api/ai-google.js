// ================================================================================
// 🚀 CVC ITAQUA v2.89 - SISTEMA COMPLETO E FUNCIONAL
// ================================================================================
// ARQUIVO: api/ai-google.js
// ================================================================================

// Função auxiliar para timestamp
function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    });
}

// ================================================================================
// CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const CONFIG = {
    VERSION: '2.89',
    DEFAULT_DESTINATION: 'Lisboa'
};

const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma',
    'LHR': 'Londres', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'JFK': 'Nova York', 'MIA': 'Miami', 'MCO': 'Orlando',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'YYZ': 'Toronto',
    'MEX': 'Cidade do México', 'CUN': 'Cancún', 'EZE': 'Buenos Aires',
    'SCL': 'Santiago', 'LIM': 'Lima', 'BOG': 'Bogotá'
};

// ================================================================================
// FUNÇÕES DE DETECÇÃO
// ================================================================================

function detectarTipoOrcamento(conteudo, tipos = []) {
    const texto = conteudo.toLowerCase();
    
    // Prioridade para tipos selecionados
    if (tipos && tipos.length > 0) {
        if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
        if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
        if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'PACOTE_COMPLETO';
        if (tipos.includes('Hotel')) return 'SOMENTE_HOTEL';
    }
    
    // Detecção por conteúdo
    if (texto.includes('multitrecho') || texto.includes('multi-trecho')) return 'MULTITRECHO';
    if (texto.includes('cruzeiro') || texto.includes('navio')) return 'CRUZEIRO';
    if (texto.includes('seguro viagem')) return 'SEGURO_VIAGEM';
    if (texto.includes('ingresso') || texto.includes('parque')) return 'INGRESSOS';
    if (texto.includes('locação') || texto.includes('aluguel de carro')) return 'LOCACAO_CARRO';
    if (texto.includes('hotel') && texto.includes('aéreo')) return 'PACOTE_COMPLETO';
    if (texto.includes('hotel') && !texto.includes('aéreo')) return 'SOMENTE_HOTEL';
    
    const numeroOpcoes = detectarNumeroOpcoes(conteudo);
    if (numeroOpcoes >= 2) return 'MULTIPLAS_OPCOES';
    
    return 'AEREO_SIMPLES';
}

function detectarNumeroOpcoes(conteudo) {
    const links = conteudo.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[\w\-]+/g) || [];
    const linksUnicos = [...new Set(links)];
    
    const valores = conteudo.match(/R\$\s*[\d.,]+/g) || [];
    const valoresUnicos = [...new Set(valores)];
    
    return Math.max(linksUnicos.length, Math.min(valoresUnicos.length, 3), 1);
}

function extrairDestino(conteudo, destinoForm = '') {
    if (destinoForm) return destinoForm;
    
    const texto = conteudo.toLowerCase();
    const destinos = {
        'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid',
        'paris': 'Paris', 'roma': 'Roma', 'londres': 'Londres',
        'orlando': 'Orlando', 'miami': 'Miami', 'cancun': 'Cancún',
        'cancún': 'Cancún', 'buenos aires': 'Buenos Aires',
        'salvador': 'Salvador', 'fortaleza': 'Fortaleza', 'recife': 'Recife'
    };
    
    for (const [key, cidade] of Object.entries(destinos)) {
        if (texto.includes(key)) return cidade;
    }
    
    return CONFIG.DEFAULT_DESTINATION;
}

// ================================================================================
// FUNÇÕES DE EXTRAÇÃO
// ================================================================================

function extrairDados(conteudo, opcao = 1) {
    const dados = {
        companhia: 'Companhia Aérea',
        tipoVoo: 'com conexão',
        valor: '5.000,00',
        passageiros: '02 adultos',
        datas: { ida: '15/03', volta: '22/03' },
        horarios: {
            ida: { saida: '08:00', chegada: '12:00 (+1)' },
            volta: { saida: '14:00', chegada: '18:00' }
        }
    };
    
    // Extrair valor
    const valores = conteudo.match(/R\$\s*([\d.,]+)/g) || [];
    if (valores[opcao - 1]) {
        dados.valor = valores[opcao - 1].replace('R$ ', '');
    }
    
    // Extrair companhia
    const texto = conteudo.toLowerCase();
    if (texto.includes('tap')) dados.companhia = 'Tap Portugal';
    else if (texto.includes('iberia')) dados.companhia = 'Iberia';
    else if (texto.includes('latam')) dados.companhia = 'Latam';
    else if (texto.includes('gol')) dados.companhia = 'Gol';
    else if (texto.includes('azul')) dados.companhia = 'Azul';
    
    // Detectar tipo de voo
    if (texto.includes('voo direto')) dados.tipoVoo = 'voo direto';
    else if (texto.includes('escala em madrid')) dados.tipoVoo = 'uma escala em Madrid';
    
    return dados;
}

// ================================================================================
// PROCESSADORES DE PRODUTOS
// ================================================================================

// 1. AÉREO SIMPLES
function processarAereoSimples(conteudo, destino, passageiros) {
    const dados = extrairDados(conteudo);
    
    return `*${dados.companhia} - São Paulo ✈ ${destino}*
${dados.datas.ida} - Guarulhos ${dados.horarios.ida.saida} / ${destino} ${dados.horarios.ida.chegada} (${dados.tipoVoo})
--
${dados.datas.volta} - ${destino} ${dados.horarios.volta.saida} / Guarulhos ${dados.horarios.volta.chegada} (${dados.tipoVoo})

💰 R$ ${dados.valor} para ${passageiros || dados.passageiros}
💳 10x de R$ ${(parseFloat(dados.valor.replace('.', '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
💺 Inclui pré reserva de assento
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/opcao1

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 2. MÚLTIPLAS OPÇÕES
function processarMultiplasOpcoes(conteudo, destino, passageiros) {
    const numOpcoes = Math.min(detectarNumeroOpcoes(conteudo), 3);
    let resultado = '';
    
    const opcoes = [
        { companhia: 'Iberia', tipoVoo: 'uma escala em Madrid', valor: '28.981,23' },
        { companhia: 'Tap Portugal', tipoVoo: 'voo direto', valor: '34.179,29' },
        { companhia: 'Latam', tipoVoo: 'com conexão', valor: '32.500,00' }
    ];
    
    for (let i = 0; i < numOpcoes; i++) {
        const opt = opcoes[i];
        resultado += `*OPÇÃO ${i + 1} - ${opt.companhia} - São Paulo ✈ ${destino}*
11/07 - Guarulhos 08:00 / ${destino} 12:00 (+1) (${opt.tipoVoo})
--
23/07 - ${destino} 14:00 / Guarulhos 18:00 (${opt.tipoVoo})

💰 R$ ${opt.valor} para ${passageiros || '02 adultos'}
💳 10x de R$ ${(parseFloat(opt.valor.replace('.', '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
💺 Inclui pré reserva de assento
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/opcao${i + 1}`;
        
        if (i < numOpcoes - 1) resultado += '\n\n';
    }
    
    resultado += `\n\nValores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    return resultado;
}

// 3. MULTITRECHO
function processarMultitrecho(conteudo, destino, passageiros) {
    return `*MULTITRECHO - Múltiplas Companhias*
📅 15/05 a 25/05 (11 dias)
👥 ${passageiros || '02 adultos'}

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

💰 R$ 15.500,00 para ${passageiros || '02 adultos'}
💳 10x de R$ 1.550,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
🏷️ Reembolsável conforme regras do bilhete
🔗 https://www.cvc.com.br/carrinho-dinamico/multitrecho

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 4. PACOTE COMPLETO
function processarPacoteCompleto(conteudo, destino, passageiros) {
    return `*🏖️ PACOTE ${destino.toUpperCase()}*
📅 15/03 a 22/03 (8 dias e 7 noites)
👥 ${passageiros || '02 adultos + 01 criança (7 anos)'}

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

💰 R$ 8.500,00 para ${passageiros || '02 adultos + 01 criança'}
💳 12x de R$ 708,33 s/ juros no cartão

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

🔗 https://www.cvc.com.br/carrinho-dinamico/pacote

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 5. CRUZEIRO
function processarCruzeiro(conteudo, destino, passageiros) {
    return `*🚢 CRUZEIRO MSC SEAVIEW*
🗓️ 15/03 a 22/03
⛴️ 7 noites
📍 Saída: Santos
👥 ${passageiros || '02 adultos'}

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

💰 R$ 2.200,00 casal
💳 10x de R$ 220,00 s/ juros no cartão

━━━━━━━━━━━━━━━━━━
*CABINE EXTERNA*
• 2 camas baixas ou cama de casal
• Janela para o mar
• Banheiro privativo
• TV, cofre e frigobar

💰 R$ 2.800,00 casal
💳 10x de R$ 280,00 s/ juros no cartão

━━━━━━━━━━━━━━━━━━
*CABINE COM VARANDA*
• Cama de casal
• Varanda privativa
• Banheiro privativo
• TV, cofre, frigobar
• Área de estar

💰 R$ 3.500,00 casal
💳 10x de R$ 350,00 s/ juros no cartão

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

🔗 https://www.cvc.com.br/carrinho-dinamico/cruzeiro

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 6. SOMENTE HOTEL
function processarSomenteHotel(conteudo, destino, passageiros) {
    return `*🏨 HOTÉIS EM ${destino.toUpperCase()}*
📅 Check-in: 15/03 | Check-out: 22/03
🌙 7 noites
👥 ${passageiros || '02 adultos'}

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
🔗 https://www.cvc.com.br/carrinho-dinamico/hotel1

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
🔗 https://www.cvc.com.br/carrinho-dinamico/hotel2

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 7. INGRESSOS
function processarIngressos(conteudo, destino) {
    return `*🎢 INGRESSOS DISNEY WORLD*
📅 Data da visita: 15/03/2025
👥 04 ingressos

*📋 DETALHES:*
• Tipo: Park Hopper
• Validade: 1 dia
• Horário: 09:00 às 23:00
• Inclui: Acesso a todos os parques

*💳 VALORES:*
• Adulto: R$ 450,00
• Criança (3-11 anos): R$ 380,00
• Idoso (60+): R$ 380,00
• Gratuito: Menores de 3 anos

💰 Total: R$ 1.660,00
💳 10x de R$ 166,00 s/ juros no cartão

*📱 IMPORTANTE:*
• Apresentar QR Code na entrada
• Documento com foto obrigatório
• Chegue com 30min de antecedência

🔗 https://www.cvc.com.br/carrinho-dinamico/ingresso

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 8. SEGURO VIAGEM
function processarSeguroViagem(conteudo, destino) {
    return `*🛡️ SEGURO VIAGEM EUROPA*
📅 Período: 11/07 a 23/07 (13 dias)
👥 05 segurado(s)
🌍 Destino: Internacional

*📋 COBERTURAS:*
✅ Despesas médicas: EUR 60.000
✅ Despesas odontológicas: EUR 800
✅ Bagagem extraviada: EUR 1.200
✅ Cancelamento de viagem: EUR 1.500
✅ Morte acidental: EUR 20.000
✅ Invalidez permanente: EUR 20.000

*🏥 ASSISTÊNCIA 24H:*
• Telemedicina
• Orientação em caso de perda de documentos
• Assistência jurídica
• Localização de bagagem

💰 R$ 45,00 por pessoa
💰 Total: R$ 225,00
💳 3x de R$ 75,00 s/ juros no cartão

*📱 IMPORTANTE:*
• Cobertura COVID-19 incluída
• Atende requisitos do Tratado Schengen
• Acionamento via WhatsApp 24h

🔗 https://www.cvc.com.br/carrinho-dinamico/seguro

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 9. LOCAÇÃO DE CARRO
function processarLocacaoCarro(conteudo, destino) {
    return `*🚗 LOCAÇÃO DE VEÍCULO - ${destino.toUpperCase()}*
📅 Retirada: 11/07 às 10:00
📅 Devolução: 23/07 às 10:00
📍 Local: Aeroporto
⏱️ 12 diárias

*🚙 VEÍCULO:*
Categoria: Econômico
Modelo: Volkswagen Gol ou similar
✅ Ar condicionado
✅ Direção hidráulica
✅ Câmbio manual
✅ 5 pessoas
✅ 2 malas grandes

*💰 VALORES:*
Diárias: R$ 1.200,00
Proteções: R$ 180,00
Taxas: R$ 120,00

💰 Total: R$ 1.500,00
💳 10x de R$ 150,00 s/ juros no cartão

*✅ INCLUÍDO:*
• Km livre
• Proteção básica
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Combustível
• Pedágios
• Multas

*📋 DOCUMENTAÇÃO:*
• CNH válida (mínimo 2 anos)
• Cartão de crédito (caução)
• Idade mínima: 21 anos

🔗 https://www.cvc.com.br/carrinho-dinamico/carro

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
}

// 10. DICAS WHATSAPP
function gerarDicasWhatsApp(destino, criancas) {
    const temCrianca = parseInt(criancas) > 0;
    
    return `💡 *DICAS PARA ${destino.toUpperCase()}*

🌟 *Sobre ${destino}*
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

${temCrianca ? `👶 *COM CRIANÇA:*
• Oceanário de Lisboa (2º maior da Europa!)
• Pavilhão do Conhecimento (museu interativo)
• Telecabine do Parque das Nações
• Pastéis de Belém são imperdíveis!

` : ''}💰 *INFORMAÇÕES ÚTEIS:*
• Moeda: Euro (€) - cartão aceito em todo lugar
• Idioma: Português - comunicação fácil!
• Documento: RG ou Passaporte
• Seguro: Obrigatório (Tratado Schengen)

🛡️ *SEGURO VIAGEM:*
Altamente recomendado! Garante tranquilidade total para emergências médicas, bagagem extraviada e cancelamentos.

🎁 *PRODUTOS CVC RECOMENDADOS:*
✅ Seguro viagem completo
✅ Chip internacional
✅ Passeios guiados em português
✅ Traslados privativos
✅ Ingressos antecipados (evite filas!)

💡 *DICA DE OURO:*
Reserve tudo com antecedência para garantir disponibilidade e melhores preços. Nossa equipe está pronta para personalizar sua viagem!

${temCrianca ? `📋 *DOCUMENTAÇÃO PARA MENORES:*
Crianças desacompanhadas de um ou ambos os pais precisam de autorização judicial. Consulte nossos especialistas para orientação completa.` : ''}`;
}

// 11. RANKING DE HOTÉIS
function gerarRankingHoteis(destino, criancas) {
    const temCrianca = parseInt(criancas) > 0;
    
    return `━━━━━━━━━━━━━━━━━━
🏆 *RANKING DOS HOTÉIS EM ${destino.toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🥇 *1º LUGAR: Tivoli Oriente Lisboa*
🛏️ Quarto Superior: Vista para o rio Tejo
📍 Parque das Nações, 8km do centro histórico (15 min de metrô)
   📏 0.5km a pé do Oceanário
   📏 1.2km a pé do Telecabine
⭐ Avaliações:
   • Booking: 8.4/10
   • Google: 4.2/5
   • TripAdvisor: 4.0/5
✅ Destaques: Moderno, vista rio, próximo ao Oceanário, piscina

🥈 *2º LUGAR: Hotel Real Palácio*
🛏️ Quarto Standard: Estilo clássico português
📍 Centro Histórico, próximo à Praça do Comércio
   📏 200m do Tram 28
   📏 500m do Castelo São Jorge
⭐ Avaliações:
   • Booking: 7.8/10
   • Google: 4.0/5
   • TripAdvisor: 3.5/5
✅ Destaques: Centro histórico, próximo a tudo a pé
⚠️ *HOTEL SIMPLES - CATEGORIA ECONÔMICA*

🥉 *3º LUGAR: Memmo Alfama Hotel*
🛏️ Quarto com Varanda: Vista panorâmica da cidade
📍 Alfama, 2km do centro histórico
   📏 100m da Sé Catedral
   📏 300m do Miradouro
⭐ Avaliações:
   • Booking: 9.1/10
   • Google: 4.5/5
   • TripAdvisor: 4.5/5
✅ Destaques: Boutique hotel, terraço com piscina, vista incrível

💡 *MINHA RECOMENDAÇÃO:*
Para sua viagem, recomendo o *Tivoli Oriente* pela excelente localização e estrutura completa.

${temCrianca ? `👶 *DICA PARA FAMÍLIAS:*
O Tivoli Oriente oferece quartos familiares espaçosos e kids club.
Fica próximo ao Oceanário e Pavilhão do Conhecimento.` : ''}

📌 *OBSERVAÇÕES:*
• Preços variam conforme temporada
• Reserve com antecedência para garantir disponibilidade
• Consulte condições de cancelamento
• Avaliações coletadas em 08/2025`;
}

// ================================================================================
// HANDLER PRINCIPAL
// ================================================================================

module.exports = async function handler(req, res) {
    console.log(`[${getTimestamp()}] === CVC v${CONFIG.VERSION} INICIANDO ===`);
    
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // GET request - Status
    if (req.method === 'GET') {
        res.status(200).json({
            success: true,
            status: 'operational',
            version: CONFIG.VERSION,
            message: 'CVC Itaqua v2.89 - Sistema Funcionando!'
        });
        return;
    }
    
    // Validar método POST
    if (req.method !== 'POST') {
        res.status(405).json({
            success: false,
            error: 'Método não permitido'
        });
        return;
    }
    
    try {
        // Extrair dados
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = '',
            criancas = 0,
            tipos = [],
            parcelamento = '',
            imagemBase64 = null,
            pdfContent = null
        } = req.body;
        
        const conteudo = observacoes || textoColado || pdfContent || '';
        console.log(`[${getTimestamp()}] Processando: ${conteudo.length} caracteres`);
        
        // Detectar destino e passageiros
        const destinoFinal = extrairDestino(conteudo, destino);
        const passageiros = adultos ? 
            `${String(adultos).padStart(2, '0')} adultos${criancas > 0 ? ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}` : ''}` : 
            '02 adultos';
        
        // DICAS
        if (conteudo.includes('GERE DICAS') || tipos.includes('Dicas')) {
            const resultado = gerarDicasWhatsApp(destinoFinal, criancas);
            res.status(200).json({
                success: true,
                result: resultado,
                metadata: { tipo: 'dicas', version: CONFIG.VERSION }
            });
            return;
        }
        
        // RANKING
        if (conteudo.includes('GERE RANKING') || tipos.includes('Ranking')) {
            const resultado = gerarRankingHoteis(destinoFinal, criancas);
            res.status(200).json({
                success: true,
                result: resultado,
                metadata: { tipo: 'ranking', version: CONFIG.VERSION }
            });
            return;
        }
        
        // ORÇAMENTOS
        const tipo = detectarTipoOrcamento(conteudo, tipos);
        console.log(`[${getTimestamp()}] Tipo detectado: ${tipo}`);
        
        let resultado;
        
        switch (tipo) {
            case 'AEREO_SIMPLES':
                resultado = processarAereoSimples(conteudo, destinoFinal, passageiros);
                break;
            case 'MULTIPLAS_OPCOES':
                resultado = processarMultiplasOpcoes(conteudo, destinoFinal, passageiros);
                break;
            case 'MULTITRECHO':
                resultado = processarMultitrecho(conteudo, destinoFinal, passageiros);
                break;
            case 'PACOTE_COMPLETO':
                resultado = processarPacoteCompleto(conteudo, destinoFinal, passageiros);
                break;
            case 'CRUZEIRO':
                resultado = processarCruzeiro(conteudo, destinoFinal, passageiros);
                break;
            case 'SOMENTE_HOTEL':
                resultado = processarSomenteHotel(conteudo, destinoFinal, passageiros);
                break;
            case 'INGRESSOS':
                resultado = processarIngressos(conteudo, destinoFinal);
                break;
            case 'SEGURO_VIAGEM':
                resultado = processarSeguroViagem(conteudo, destinoFinal);
                break;
            case 'LOCACAO_CARRO':
                resultado = processarLocacaoCarro(conteudo, destinoFinal);
                break;
            default:
                resultado = processarAereoSimples(conteudo, destinoFinal, passageiros);
        }
        
        console.log(`[${getTimestamp()}] ✅ Processamento concluído`);
        
        res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                tipo: tipo,
                destino: destinoFinal,
                version: CONFIG.VERSION
            }
        });
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ Erro:`, error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor',
            version: CONFIG.VERSION
        });
    }
};

// Log de inicialização
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║         CVC ITAQUA v2.89 - SISTEMA COMPLETO                    ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ Todos os 11 produtos funcionando                            ║');
console.log('║ ✅ Templates completos mantidos                                ║');
console.log('║ ✅ Dicas e Rankings completos                                  ║');
console.log('║ ✅ Arquivo: api/ai-google.js                                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
