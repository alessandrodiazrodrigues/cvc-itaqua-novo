// 🚀 CVC ITAQUA v7.6 - SISTEMA COMPLETO COM ÍNDICE (CORRIGIDO)
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS
//    1.1 Aéreo Ida e Volta Simples
//    1.2 Voo Combinado (Mix de Companhias)
//    1.3 Múltiplas Opções
//    1.4 Pacote Completo (Aéreo + Hotel)
//    1.5 Voo com Conexão Detalhada
//    1.6 Apenas Detalhes (Sem Preço)
//    1.7 Cruzeiro
//
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
//    2.1 Aeroportos Brasileiros Principais
//    2.2 Aeroportos Brasileiros Regionais
//    2.3 Aeroportos América do Sul
//    2.4 Aeroportos América do Norte/Central
//    2.5 Aeroportos Europa
//
// 3. HANDLER PRINCIPAL DA API
//    3.1 Configuração CORS
//    3.2 Endpoint GET - Status
//    3.3 Endpoint POST - Processar
//
// 4. PROCESSAMENTO DE DADOS
//    4.1 Detecção de Passageiros
//    4.2 Detecção de Tipos
//    4.3 Análise de Conteúdo
//
// 5. PROMPTS ESPECIALIZADOS
//    5.1 Prompt para Dicas
//    5.2 Prompt para Ranking
//    5.3 Prompt Principal para Orçamentos
//
// 6. PROCESSAMENTO COM IA
//    6.1 Decisão de IA (Claude vs GPT)
//    6.2 Processamento com Claude
//    6.3 Processamento com GPT
//
// 7. RESPOSTA FINAL
//    7.1 Formatação de Resposta
//    7.2 Logs e Debug
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS - TODOS OS CASOS
// ================================================================================
const TEMPLATES = {
    // 1.1 - Template Aéreo Ida e Volta Simples
    aereo_ida_volta: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.2 - Template Voo Combinado (Mix de Companhias)
    voo_combinado: `
*Voo {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} a {dataVolta} ({dias} dias e {noites} noites)

✈️ IDA - {companhiaIda}
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoConexao} {horaChegadaConexao} (voo direto)
(conexão em {cidadeConexao} - {tempoEspera} de espera)
{dataIda} - {aeroportoConexao} {horaSaidaConexao} / {aeroportoDestino} {horaChegadaDestino} (voo direto)

✈️ VOLTA - {companhiaVolta}
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoConexaoVolta} {horaChegadaConexaoVolta} (voo direto)
(conexão em {cidadeConexaoVolta} - {tempoEsperaVolta} de espera)
{dataVoltaDia} - {aeroportoConexaoVolta} {horaSaidaConexaoVolta} / {aeroportoOrigem} {horaChegadaVolta} (voo direto)

💰 R$ {valorTotal} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.3 - Template Múltiplas Opções (2+ escolhas)
    multiplas_opcoes: `
*OPÇÃO 1 - {companhia1} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda1} - {aeroportoOrigem1} {horaIda1} / {aeroportoDestino1} {horaChegadaIda1} ({tipoVoo1})
--
{dataVolta1} - {aeroportoDestino1} {horaVolta1} / {aeroportoOrigem1} {horaChegadaVolta1} ({tipoVooVolta1})

💰 R$ {valor1} para {passageiros1}
✅ {bagagem1}
🏷️ {reembolso1}

---

*OPÇÃO 2 - {companhia2} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda2} - {aeroportoOrigem2} {horaIda2} / {aeroportoDestino2} {horaChegadaIda2} ({tipoVoo2})
--
{dataVolta2} - {aeroportoDestino2} {horaVolta2} / {aeroportoOrigem2} {horaChegadaVolta2} ({tipoVooVolta2})
{notaCodeshare}

💰 R$ {valor2} para {passageiros2}
✅ {bagagem2}
🏷️ {reembolso2}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.4 - Template Pacote Completo (Aéreo + Hotel)
    pacote_completo: `
*Pacote {destino}*
{dataIda} a {dataVolta} ({dias} dias e {noites} noites)
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- {noites} noites de hospedagem
{servicosAdicionais}

✈️ *Voos:*
IDA - {companhiaIda} - {dataIda}
{origemIda} {horaIda} / {destinoIda} {horaChegadaIda} ({tipoVooIda})

VOLTA - {companhiaVolta} - {dataVolta}
{origemVolta} {horaVolta} / {destinoVolta} {horaChegadaVolta} ({tipoVooVolta})

🏨 *Hotel Selecionado:*
{nomeHotel}
📍 {enderecoHotel}
🛏️ {tipoQuarto}
☕ {regime}
{observacoesHotel}

💰 R$ {valorTotal} total
💳 {parcelamento}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.5 - Template Voo com Conexão Detalhada
    voo_conexao_detalhada: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} (com {paradas} - {duracao})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} (com {paradasVolta} - {duracaoVolta})

💰 R$ {valorTotal} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.6 - Template Apenas Detalhes (Sem Preço)
    detalhes_sem_preco: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
{detalhesConexaoIda}
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})
{detalhesConexaoVolta}

✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.7 - Template Cruzeiro
    cruzeiro: `
🚢 *Cruzeiro {nomeNavio}* – {noites} noites
{passageiros}
📅 Embarque: {dataEmbarque} ({diaSemana})
📍 Saída e chegada: {porto}
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
{opcoesCabines}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade`
};

// ================================================================================
// 2. 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS
// ================================================================================
const AEROPORTOS = {
    // 2.1 - Aeroportos Brasileiros Principais
    'GRU': 'Guarulhos',
    'CGH': 'Congonhas',
    'VCP': 'Viracopos',
    'SDU': 'Santos Dumont',
    'GIG': 'Galeão',
    'BSB': 'Brasília',
    'CNF': 'Confins',
    'PLU': 'Pampulha',
    'POA': 'Porto Alegre',
    'CWB': 'Curitiba',
    'FLN': 'Florianópolis',
    'SSA': 'Salvador',
    'REC': 'Recife',
    'FOR': 'Fortaleza',
    'NAT': 'Natal',
    'MCZ': 'Maceió',
    'AJU': 'Aracaju',
    'JPA': 'João Pessoa',
    'THE': 'Teresina',
    'SLZ': 'São Luís',
    'BEL': 'Belém',
    'MAO': 'Manaus',
    'CGB': 'Cuiabá',
    'CGR': 'Campo Grande',
    'GYN': 'Goiânia',
    'VIX': 'Vitória',

    // 2.2 - Aeroportos Brasileiros Regionais
    'BPS': 'Porto Seguro',
    'IOS': 'Ilhéus',
    'CMG': 'Corumbá',
    'JDO': 'Juazeiro do Norte',
    'IMP': 'Imperatriz',
    'MAB': 'Marabá',
    'STM': 'Santarém',
    'RBR': 'Rio Branco',
    'PVH': 'Porto Velho',
    'BVB': 'Boa Vista',
    'MCP': 'Macapá',
    'PMW': 'Palmas',
    'UDI': 'Uberlândia',
    'RAO': 'Ribeirão Preto',
    'JOI': 'Joinville',
    'XAP': 'Chapecó',
    'IGU': 'Foz do Iguaçu',
    'LDB': 'Londrina',
    'MGF': 'Maringá',

    // 2.3 - Aeroportos América do Sul
    'EZE': 'Ezeiza - Buenos Aires',
    'AEP': 'Aeroparque - Buenos Aires',
    'SCL': 'Santiago',
    'LIM': 'Lima',
    'BOG': 'Bogotá',
    'GYE': 'Guayaquil',
    'UIO': 'Quito',
    'CCS': 'Caracas',
    'MVD': 'Montevidéu',
    'ASU': 'Assunção',
    'LPB': 'La Paz',
    'VVI': 'Santa Cruz de la Sierra',

    // 2.4 - Aeroportos América do Norte/Central
    'MEX': 'Cidade do México',
    'CUN': 'Cancún',
    'MIA': 'Miami',
    'MCO': 'Orlando',
    'FLL': 'Fort Lauderdale',
    'JFK': 'Nova York - JFK',
    'EWR': 'Newark',
    'LAX': 'Los Angeles',
    'SFO': 'San Francisco',
    'ORD': 'Chicago',
    'YYZ': 'Toronto',

    // 2.5 - Aeroportos Europa
    'LIS': 'Lisboa',
    'OPO': 'Porto',
    'MAD': 'Madrid',
    'BCN': 'Barcelona',
    'CDG': 'Paris - Charles de Gaulle',
    'ORY': 'Paris - Orly',
    'FCO': 'Roma - Fiumicino',
    'MXP': 'Milão - Malpensa',
    'LHR': 'Londres - Heathrow',
    'LGW': 'Londres - Gatwick',
    'FRA': 'Frankfurt',
    'AMS': 'Amsterdã',
    'ZRH': 'Zurique'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v7.6
// ================================================================================
export default async function handler(req, res) {
    // 3.1 - Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3.2 - Endpoint GET - Status da API
    if (req.method === 'GET') {
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

        return res.status(200).json({
            success: true,
            message: 'API CVC Itaqua v7.6 - Online (Sistema Completo com Índice)',
            version: '7.6',
            services: {
                openai: hasOpenAI ? 'Configurado' : 'Não configurado',
                anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
            },
            features: [
                'Sistema com índice completo',
                'Detecção de voo combinado vs múltiplas opções',
                'Suporte a codeshare',
                'Processamento com e sem preços',
                'Template de pacote completo',
                'Sistema de dicas e ranking',
                'Formatação perfeita para WhatsApp'
            ],
            lastUpdate: '2025-01-14', // Manter data fictícia
            sections: {
                '1': 'Templates de Orçamentos',
                '2': 'Tabela de Aeroportos',
                '3': 'Handler Principal',
                '4': 'Processamento de Dados',
                '5': 'Prompts Especializados',
                '6': 'Processamento com IA',
                '7': 'Resposta Final'
            }
        });
    }

    // 3.3 - Endpoint POST - Processar Orçamento
    if (req.method === 'POST') {
        try {
            console.log('📥 Requisição recebida v7.6');

            const {
                observacoes = '',
                textoColado = '',
                destino = '',
                adultos = '',
                criancas = 0,
                idadesCriancas = [],
                tipos = [],
                parcelamento = null,
                imagemBase64 = null,
                pdfContent = null
            } = req.body;

            // ================================================================================
            // 4. 📊 PROCESSAMENTO DE DADOS
            // ================================================================================

            // Determinar conteúdo principal
            const conteudoPrincipal = observacoes || textoColado || pdfContent || '';
            const conteudoLower = conteudoPrincipal.toLowerCase();

            // 4.1 - Detecção de Passageiros
            let infoPassageiros = '';
            const padraoTotal = conteudoPrincipal.match(/Total\s*\((\d+)\s*(?:Adulto|Adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:Criança|Crianças))?\)/i);
            const padraoPassageiros = conteudoPrincipal.match(/(\d+)\s*(?:adulto|adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:criança|crianças))?/i);

            if (padraoTotal) {
                const numAdultos = parseInt(padraoTotal[1]);
                const numCriancas = padraoTotal[2] ? parseInt(padraoTotal[2]) : 0;
                let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
                if (numCriancas > 0) {
                    textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
                    if (idadesCriancas && idadesCriancas.length > 0) {
                        textoPax += ` (${idadesCriancas.join(' e ')} anos)`;
                    }
                }
                infoPassageiros = textoPax;
            } else if (padraoPassageiros) {
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
            }

            // 4.2 - Detecção de Tipos Especiais
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');

            // 4.3 - Análise de Conteúdo
            const temHotel = tipos.includes('Hotel') || conteudoLower.includes('palazzo') || conteudoLower.includes('hotel');
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo') || conteudoLower.includes('ida');
            const isPacote = temHotel && temAereo;
            const temPreco = conteudoLower.includes('r$'); // CORREÇÃO: Adicionado '$'
            const temAvianca = conteudoLower.includes('avianc');
            const temGol = conteudoLower.includes('gol');
            const temMultiplasOpcoes = conteudoLower.includes('opção 1') || (conteudoLower.includes('selecionado') && conteudoLower.split('selecionado').length > 2);
            const linkMatch = conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/[^\s]+/);
            const linkCVC = linkMatch ? linkMatch[0] : null;

            // Log de análise
            console.log('🔍 Análise do conteúdo:');
            console.log('- Tipos selecionados:', tipos);
            console.log('- Tem imagem?', !!imagemBase64);
            console.log('- Tem hotel?', temHotel);
            console.log('- Tem preço?', temPreco);
            console.log('- Tem link?', !!linkCVC);
            console.log('- Tem Avianca?', temAvianca);
            console.log('- Tem Gol?', temGol);
            console.log('- É pacote?', isPacote);
            console.log('- Múltiplas Opções?', temMultiplasOpcoes);

            let prompt = '';

            // ================================================================================
            // 5. 📝 PROMPTS ESPECIALIZADOS
            // ================================================================================

            if (isDicas) {
                let destinoReal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
                if (!destinoReal && conteudoPrincipal) {
                    const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Paris|Buenos Aires|Santiago|Nova York|Rio de Janeiro|Gramado|Natal|João Pessoa)/i);
                    if (padraoDestino) {
                        destinoReal = padraoDestino[0];
                    }
                }
                const temCriancas = conteudoLower.includes('criança');
                const isCruzeiro = conteudoLower.includes('cruzeiro');
                const isOrlando = destinoReal && destinoReal.toLowerCase().includes('orlando');
                prompt = `Você é um especialista em viagens da CVC Itaqua.
        
                ${!destinoReal ? 'ANALISE o conteúdo abaixo, IDENTIFIQUE o destino mencionado e crie dicas específicas.' : `Crie dicas ESPECÍFICAS e PRÁTICAS para ${destinoReal}.`}
                
                ${isCruzeiro ? 'Este é um CRUZEIRO. Foque em vida a bordo, cabines, refeições.' : ''}
                ${temCriancas ? 'A viagem inclui CRIANÇAS. Adapte as dicas para famílias.' : ''}
                
                CONTEÚDO: ${conteudoPrincipal || 'Destino não especificado'}
                
                ${isOrlando ? `
                REGRAS ESPECIAIS PARA ORLANDO:
                - Mencione que a CVC vende ingressos para todos os parques
                - Destaque que organizamos toda a programação dos parques
                - Informe sobre locação de carros pela CVC
                - Dicas práticas de economia e logística
                - Sugestões de roteiro por dia` : ''}
                
                FORMATO OBRIGATÓRIO:
                
                🌟 DICAS PARA ${destinoReal || '[DESTINO]'} ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🌟
                
                📅 SOBRE SUA VIAGEM:
                [Clima, época, o que esperar]
                ${temCriancas ? '[Atividades ideais para crianças]' : ''}
                
                ${isOrlando ? `
                🎢 PARQUES TEMÁTICOS:
                ✅ A CVC Itaqua vende ingressos para TODOS os parques com preços especiais!
                ✅ Organizamos sua programação completa: qual parque em cada dia
                ✅ Dicas de FastPass e horários estratégicos
                [Sugestões específicas de roteiro]
                
                🚗 TRANSPORTE:
                ✅ Locação de carros pela CVC com tarifas exclusivas
                ✅ Seguro completo e GPS incluído
                ✅ Entrega no aeroporto ou hotel
                [Dicas de deslocamento entre parques]` : ''}
                
                💰 DICAS DE ECONOMIA:
                [3-4 dicas práticas e específicas]
                [Mencionar vantagens dos pacotes CVC]
                
                🍽️ GASTRONOMIA:
                [Pratos/restaurantes imperdíveis]
                ${temCriancas ? '[Opções family-friendly]' : ''}
                
                🛍️ COMPRAS:
                [Melhores outlets e lojas]
                [Dicas de tax free se aplicável]
                
                📱 DICAS PRÁTICAS:
                [Aplicativos úteis]
                [Documentação necessária]
                ${temCriancas ? '[Itens essenciais para crianças]' : ''}
                
                ⚠️ IMPORTANTE:
                📞 A CVC Itaqua oferece assistência completa durante toda sua viagem!
                ✅ Ingressos, transfers, passeios - tudo com a gente!
                
                INSTRUÇÕES:
                - Use emojis apropriados
                - Seja específico e prático
                - Sempre mencione os serviços CVC quando relevante
                - Formatação para WhatsApp
                - NÃO use formato de lista numerada genérica`;

            } else if (isRanking) {
                let destinoRanking = destino && destino !== 'Destino' && destino !== '' ? destino : null;
                if (!destinoRanking && conteudoPrincipal) {
                    const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Paris|Buenos Aires|Santiago|Nova York|Rio de Janeiro|Gramado|Natal|João Pessoa|Foz do Iguaçu|Caldas Novas|Balneário Camboriú)/i);
                    if (padraoDestino) {
                        destinoRanking = padraoDestino[0];
                    }
                }
                if (!destinoRanking) {
                    destinoRanking = 'Orlando';
                }
                prompt = `Você é um especialista em hotéis da CVC Itaqua.
        
                Crie um ranking dos TOP 5 hotéis REAIS em ${destinoRanking}.
                
                CONTEÚDO PARA CONTEXTO: ${conteudoPrincipal || 'Não fornecido'}
                
                IMPORTANTE:
                - Use apenas hotéis que REALMENTE EXISTEM em ${destinoRanking}
                - Inclua variedade: luxo, médio, econômico
                - Mencione que a CVC tem tarifas especiais
                - Se possível, inclua hotéis mencionados no conteúdo
                
                Use EXATAMENTE este formato:
                
                🏆 TOP 5 HOTÉIS - ${destinoRanking.toUpperCase()} 🏆
                ✅ Todos disponíveis na CVC com tarifas exclusivas!
                
                1️⃣ [Nome do Hotel Real] ⭐⭐⭐⭐⭐
                📍 [Localização/Bairro real]
                ✨ [Principal diferencial verdadeiro]
                🛏️ [Tipo de acomodação]
                💰 Diária média: R$ [valor realista]
                📞 Reserve com a CVC: melhores tarifas!
                
                2️⃣ [Nome do Hotel Real] ⭐⭐⭐⭐⭐
                📍 [Localização/Bairro real]
                ✨ [Principal diferencial verdadeiro]
                🛏️ [Tipo de acomodação]
                💰 Diária média: R$ [valor realista]
                📞 Parcelamento exclusivo CVC
                
                3️⃣ [Nome do Hotel Real] ⭐⭐⭐⭐
                📍 [Localização/Bairro real]
                ✨ [Principal diferencial verdadeiro]
                🛏️ [Tipo de acomodação]
                💰 Diária média: R$ [valor realista]
                📞 Pacotes com aéreo na CVC
                
                4️⃣ [Nome do Hotel Real] ⭐⭐⭐⭐
                📍 [Localização/Bairro real]
                ✨ [Principal diferencial verdadeiro]
                🛏️ [Tipo de acomodação]
                💰 Diária média: R$ [valor realista]
                📞 Ofertas especiais CVC
                
                5️⃣ [Nome do Hotel Real] ⭐⭐⭐
                📍 [Localização/Bairro real]
                ✨ Melhor custo-benefício
                🛏️ [Tipo de acomodação]
                💰 Diária média: R$ [valor realista]
                📞 Condições imperdíveis na CVC
                
                💡 DICA: A CVC Itaqua oferece:
                • Parcelamento em até 10x sem juros
                • Pacotes completos com aéreo + hotel
                • Seguro viagem incluído
                • Assistência 24h durante sua estadia
                
                📲 Entre em contato para valores exclusivos!
                
                INSTRUÇÕES FINAIS:
                - NÃO pergunte ao usuário qual destino
                - Use hotéis REAIS do destino
                - Se o destino for Orlando, inclua hotéis próximos aos parques
                - Sempre destaque os benefícios CVC`;

            } else {
                // 5.3 - Prompt Principal para Orçamentos
                const tabelaAeroportos = Object.entries(AEROPORTOS)
                    .map(([codigo, nome]) => `${codigo} → ${nome}`)
                    .join('\n');

                prompt = `Você é um assistente da CVC Itaqua.
ANALISE CUIDADOSAMENTE o tipo de orçamento.

**DADOS DO CLIENTE:**
${conteudoPrincipal}
${destino ? `Destino: ${destino}` : ''}
${infoPassageiros ? `Passageiros: ${infoPassageiros}` : ''}
${parcelamento ? `Parcelamento: ${parcelamento}x sem juros` : ''}
${linkCVC ? `Link CVC: ${linkCVC}` : ''}

**ANÁLISE DETECTADA:**
- Tem Hotel? ${temHotel ? 'SIM' : 'NÃO'}
- Tem Aéreo? ${temAereo ? 'SIM' : 'NÃO'}
- É Pacote? ${isPacote ? 'SIM' : 'NÃO'}
- Tem Preço? ${temPreco ? 'SIM' : 'NÃO'}
- Tem Link? ${linkCVC ? 'SIM - INCLUIR!' : 'NÃO'}
- Tem Avianca? ${temAvianca ? 'SIM' : 'NÃO'}
- Tem Gol? ${temGol ? 'SIM' : 'NÃO'}
- Múltiplas Opções? ${temMultiplasOpcoes ? 'SIM' : 'NÃO'}

// =================================================================
// IDENTIFICAÇÃO CRÍTICA DO TIPO
// =================================================================

**REGRAS DE PRIORIDADE:**

1. **PACOTE COMPLETO** (Hotel + Aéreo juntos)
   ${isPacote ? '✅ DETECTADO - USE TEMPLATE DE PACOTE!' : ''}
   - Palazzo Lakeside ou outros hotéis + voos
   - Use template com seções separadas para voo e hotel
   
2. **MÚLTIPLAS OPÇÕES** (2+ cards "Selecionado")
   ${temMultiplasOpcoes ? '✅ DETECTADO - USE OPÇÃO 1 e OPÇÃO 2!' : ''}
   - Diferentes datas/horários/passageiros
   - Cada opção com seu preço
   
3. **VOO COMBINADO** (Mix no mesmo itinerário)
   ${temAvianca && temGol && !temMultiplasOpcoes ? '✅ DETECTADO - USE VOO COMBINADO!' : ''}
   - Ida Avianca + Volta Gol (ou vice-versa)
   - Um único preço total
   
4. **VOO SIMPLES** (Ida e volta normal)
   - Uma companhia ou codeshare
   - Com ou sem conexão
   
5. **SEM PREÇO** (Apenas detalhes)
   ${!temPreco ? '✅ DETECTADO - NÃO INCLUIR VALORES!' : ''}
   - Omitir linha de valor
   - Manter outros detalhes

// =================================================================
// TEMPLATES ESPECÍFICOS (Exemplos para a IA seguir)
// =================================================================

${isPacote ? `
**USE ESTE TEMPLATE DE PACOTE:**

*Pacote {destino}*
{data_ida} a {data_volta} ({X} dias e {Y} noites)
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- {noites} noites de hospedagem
- {regime_alimentacao}

✈️ *Voos:*
IDA - {companhia} - {data}
{origem} {hora} / {destino} {hora} ({tipo})

VOLTA - {companhia} - {data}
{origem} {hora} / {destino} {hora} ({tipo})

🏨 *Hotel Selecionado:*
{nome_hotel}
📍 {endereco}
🛏️ {tipo_quarto}
☕ {regime}
{observacoes_resort_fee}

💰 R$ {valor_total} total
💳 {parcelamento}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade` : ''}

${temAvianca && temGol && !temMultiplasOpcoes ? `
**USE ESTE TEMPLATE DE VOO COMBINADO:**

*Voo {origem} ✈ {destino}*
{data_ida} a {data_volta} ({X} dias e {Y} noites)

✈️ IDA - Avianca
{detalhes_ida_com_conexao}

✈️ VOLTA - Gol
{detalhes_volta_com_conexao}

💰 R$ {valor} para {passageiros}
💳 {parcelamento}
✅ Só mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade` : ''}

${temMultiplasOpcoes ? `
**USE ESTE TEMPLATE DE MÚLTIPLAS OPÇÕES:**

*OPÇÃO 1 - {companhia} - {origem} ✈ {destino}*
{detalhes_opcao1}

💰 R$ {valor1} para {passageiros1}
✅ {bagagem1}
🏷️ {reembolso1}

---

*OPÇÃO 2 - {companhia} - {origem} ✈ {destino}*
{detalhes_opcao2}
{nota_codeshare_se_houver}

💰 R$ {valor2} para {passageiros2}
✅ {bagagem2}
🏷️ {reembolso2}

Valores sujeitos a confirmação e disponibilidade` : ''}

**EXEMPLO CORRETO PARA VOO SIMPLES:**
Dados: Latam, São Paulo-Juazeiro do Norte, 07/10-09/10, GRU-JDO, R$ 1.026,02, linkCVC fornecido

SAÍDA OBRIGATÓRIA:
*Latam - São Paulo ✈ Juazeiro do Norte*
07/10 - Guarulhos 08:20 / Juazeiro do Norte 11:15 (voo direto)
--
09/10 - Juazeiro do Norte 16:05 / Guarulhos 19:15 (voo direto)

💰 R$ 1.026,02 para 01 adulto
💳 Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ 252,20 + 9x de R$ 85,98 s/ juros
✅ Só mala de mão incluída
🏷️ Tarifa facial
🔗 https://www.cvc.com.br/carrinho-dinamico/6899f5730216ce3286369b76

Valores sujeitos a confirmação e disponibilidade

**NUNCA FAÇA:**
❌ Listar campos como "Origem:", "Destino:", "Data:"
❌ Usar formato de lista ou bullet points
❌ Adicionar títulos como "ORÇAMENTO DE VIAGEM"
❌ Usar formato diferente do template

// =================================================================
// CONVERSÃO DE CÓDIGOS
// =================================================================

**SEMPRE CONVERTER:**
${tabelaAeroportos}

// =================================================================
// REGRAS FINAIS
// =================================================================

1. **DETECTAR CORRETAMENTE O TIPO**
2. **USAR O TEMPLATE APROPRIADO**
3. **CONVERTER TODOS OS CÓDIGOS**
4. **SE NÃO TEM PREÇO, OMITIR LINHA DE VALOR**
5. **SE TEM LINK CVC, SEMPRE INCLUIR COM 🔗**
6. **INCLUIR DETALHES DE CONEXÃO QUANDO HOUVER**
7. **MENCIONAR CODESHARE SE APLICÁVEL**
8. **FORMATAR PARCELAMENTO:** "Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ XXX + 9x de R$ YYY s/ juros"
9. **TERMINAR COM "Valores sujeitos..."**

**IMPORTANTE:**
- Parcelamento: sempre "primeira parcela" (nunca "entrada")
- Resort Fee = mencionar em observações do hotel
- Passageiros = sempre com zero à esquerda (01, 02, 03)`;
            }

            // ================================================================================
            // 6. 🤖 PROCESSAMENTO COM IA
            // ================================================================================
            let resultado = '';
            let iaUsada = 'gpt-4o-mini';

            // 6.1 - Decisão de IA (Claude vs GPT)
            const usarClaude = imagemBase64 ||
                (conteudoPrincipal.length > 2000) ||
                tipos.includes('Cruzeiro') ||
                isPacote ||
                (temAvianca && temGol);

            console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');

            // 6.2 - Processamento com Claude
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🤖 Usando Claude 3 Haiku...');
                iaUsada = 'claude-3-haiku';
                const systemPromptClaude = `Você é um assistente da CVC Itaqua. INSTRUÇÕES ABSOLUTAS - USE EXATAMENTE ESTE FORMATO: PARA VOO SIMPLES: *{Companhia} - {Cidade Origem} ✈ {Cidade Destino}* {DD/MM} - {Aeroporto} {HH:MM} / {Aeroporto} {HH:MM} ({tipo}) -- {DD/MM} - {Aeroporto} {HH:MM} / {Aeroporto} {HH:MM} ({tipo}) 💰 R$ {valor} para {passageiros} 💳 {parcelamento} ✅ {bagagem} 🏷️ {tarifa} 🔗 {link se houver} Valores sujeitos a confirmação e disponibilidade. FORMATO CORRETO DE PARCELAMENTO: - COM entrada: "Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ XXX + 9x de R$ YYY s/ juros" - SEM entrada: "10x de R$ XXX s/ juros no cartão" - NUNCA use "Entrada de", sempre "primeira parcela de". CONVERSÕES: GRU→Guarulhos, JDO→Juazeiro do Norte, MCO→Orlando. SEMPRE INCLUIR O LINK SE FORNECIDO!`;
                const messages = [{
                    role: 'user',
                    content: imagemBase64 ? [{
                        type: 'text',
                        text: prompt
                    }, {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: imagemBase64.split(';')[0].split(':')[1],
                            data: imagemBase64.split(',')[1]
                        }
                    }] : prompt
                }];
                const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': process.env.ANTHROPIC_API_KEY,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-haiku-20240307',
                        max_tokens: 2000,
                        temperature: 0.1,
                        messages,
                        system: systemPromptClaude
                    })
                });
                if (!claudeResponse.ok) {
                    const errorText = await claudeResponse.text();
                    console.error('❌ Erro Claude:', errorText);
                    throw new Error(`Erro ao processar com Claude: ${errorText}`);
                }
                const claudeData = await claudeResponse.json();
                resultado = claudeData.content[0].text;

            }
            // 6.3 - Processamento com GPT
            else {
                console.log('🤖 Usando GPT-4o-mini...');
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) {
                    throw new Error('OpenAI API key não configurada.');
                }
                const systemPromptGpt = `Você é um assistente da CVC Itaqua. REGRAS CRÍTICAS - SIGA EXATAMENTE: 1. FORMATO OBRIGATÓRIO PARA VOOS: *Companhia - Cidade Origem ✈ Cidade Destino* DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo voo) -- DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo voo) 💰 R$ valor para passageiros 💳 Parcelamento (se houver) ✅ Bagagem 🏷️ Tipo tarifa 🔗 Link (se houver) Valores sujeitos a confirmação e disponibilidade. 2. FORMATO DE PARCELAMENTO OBRIGATÓRIO: - COM primeira parcela diferente: "Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ XXX + 9x de R$ YYY s/ juros" - Parcelas iguais: "10x de R$ XXX s/ juros no cartão" - NUNCA use "Entrada de", sempre "primeira parcela de". 3. CONVERSÕES OBRIGATÓRIAS: GRU→Guarulhos, JDO→Juazeiro do Norte, MCO→Orlando, BOG→Bogotá. 4. SEMPRE INCLUIR O LINK SE FORNECIDO!`;
                const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENAI_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{
                            role: 'system',
                            content: systemPromptGpt
                        }, {
                            role: 'user',
                            content: prompt
                        }],
                        temperature: 0.1,
                        max_tokens: 2000
                    })
                });
                if (!gptResponse.ok) {
                    const errorText = await gptResponse.text();
                    console.error('❌ Erro GPT:', errorText);
                    throw new Error(`Erro ao processar com GPT: ${errorText}`);
                }
                const gptData = await gptResponse.json();
                resultado = gptData.choices[0].message.content;
            }

                        // ================================================================================
            // 7. ✅ RESPOSTA FINAL
            // ================================================================================
            console.log('✅ Processamento concluído');
            const tipoDetectadoFinal = isDicas ? 'dicas' :
                isRanking ? 'ranking' :
                isPacote ? 'pacote' :
                temMultiplasOpcoes ? 'multiplas_opcoes' :
                (temAvianca && temGol) ? 'voo_combinado' :
                'voo_simples';

            console.log('📋 Tipo detectado:', tipoDetectadoFinal.toUpperCase());
            console.log('💰 Tem preço?', temPreco ? 'SIM' : 'NÃO');

            return res.status(200).json({
                success: true,
                result: resultado,
                ia_usada: iaUsada,
                version: '7.6',
                tipo_detectado: tipoDetectadoFinal,
                tem_preco: temPreco,
                debug: {
                    section_1: 'Templates processados',
                    section_2: 'Aeroportos convertidos',
                    section_3: 'Handler executado',
                    section_4: 'Dados processados',
                    section_5: 'Prompt utilizado',
                    section_6: `IA utilizada: ${iaUsada}`,
                    section_7: 'Resposta formatada'
                }
            });

        } catch (error) {
            console.error('❌ Erro no handler principal:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Erro desconhecido no servidor',
                version: '7.6'
            });
        }
    }

    return res.status(405).json({
        success: false,
        error: 'Método não suportado',
        version: '7.6'
    });
}
