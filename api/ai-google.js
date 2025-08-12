// 🚀 CVC ITAQUA v8.0 - AÉREO E PACOTE ATUALIZADOS COM CHECKLIST COMPLETO
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (ATUALIZADOS)
//    1.1 Aéreo Ida e Volta Simples (NOVO FORMATO)
//    1.2 Aéreo com Conexão Detalhada (NOVO FORMATO) 
//    1.3 Aéreo Somente Ida (NOVO FORMATO)
//    1.4 Múltiplas Opções (2 e 3 planos) (NOVO FORMATO)
//    1.5 Multitrecho (NOVO FORMATO)
//    1.6 Múltiplas Companhias (NOVO FORMATO)
//    1.7 Hotéis - Múltiplas Opções (MANTIDO)
//    1.8 Roteiro de Hotéis (MANTIDO)
//    1.9 Pacote Completo (COMPLETAMENTE ATUALIZADO)
//    1.10 Cruzeiro (MANTIDO)
//    1.11 Locação de Carro (MANTIDO)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS (ATUALIZADA)
// 3. HANDLER PRINCIPAL DA API
// 4. PROCESSAMENTO DE DADOS
// 5. PROMPTS ESPECIALIZADOS (ATUALIZADOS)
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (AÉREO E PACOTE ATUALIZADOS)
// ================================================================================
const TEMPLATES = {
    // 1.1 - Aéreo Ida e Volta Simples (NOVO FORMATO CHECKLIST)
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

    // 1.2 - Aéreo com Conexão Detalhada (NOVO FORMATO CHECKLIST)
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

    // 1.3 - Aéreo Somente Ida (NOVO FORMATO CHECKLIST)
    aereo_somente_ida: `*{companhia} ✈ {cidade_destino}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total: R$ {valor} para {passageiros}
✅ Inclui 1 mala de mão + 1 item pessoal{bagagem_adicional}
{parcelamento}
{link}
{reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    // 1.4 - Múltiplas Opções - 2 Planos (NOVO FORMATO CHECKLIST)
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

    // 1.5 - Multitrecho (NOVO FORMATO CHECKLIST)
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

    // 1.6 - Múltiplas Companhias (NOVO FORMATO CHECKLIST)
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} ✈ {cidade_destino}*
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

    // 1.7 - Hotéis - Múltiplas Opções (MANTIDO - NÃO ALTERADO)
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

    // 1.8 - Roteiro de Hotéis (MANTIDO - NÃO ALTERADO)
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

    // 1.9 - Pacote Completo (COMPLETAMENTE ATUALIZADO COM CONDICIONAIS)
    pacote_completo: `*Pacote ✈ {destino}*
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

{opcao3}

{parcelamento}
{reembolso}
Valores sujeitos a confirmação e disponibilidade`,

    // 1.10 - Cruzeiro (MANTIDO - NÃO ALTERADO)
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

    // 1.11 - Locação de Carro (MANTIDO - NÃO ALTERADO)
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
// 2. 🗺️ TABELA DE CONVERSÃO DE AEROPORTOS (ATUALIZADA COM MÚLTIPLOS AEROPORTOS)
// ================================================================================
const AEROPORTOS = {
    // Aeroportos Brasileiros Principais
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
    'BPS': 'Porto Seguro',
    'IOS': 'Ilhéus',
    'JDO': 'Juazeiro do Norte',
    'IGU': 'Foz do Iguaçu',
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
    'LDB': 'Londrina',
    'MGF': 'Maringá',

    // Aeroportos América do Sul
    'EZE': 'Buenos Aires EZE',
    'AEP': 'Buenos Aires AEP',
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

    // Aeroportos América do Norte/Central
    'MEX': 'Cidade do México',
    'CUN': 'Cancún',
    'MIA': 'Miami',
    'MCO': 'Orlando',
    'FLL': 'Fort Lauderdale',
    'JFK': 'Nova York JFK',
    'LGA': 'Nova York LGA',
    'EWR': 'Nova York EWR',
    'LAX': 'Los Angeles',
    'SFO': 'San Francisco',
    'ORD': 'Chicago',
    'YYZ': 'Toronto',

    // Aeroportos Europa (COM MÚLTIPLOS AEROPORTOS)
    'LIS': 'Lisboa',
    'OPO': 'Porto',
    'MAD': 'Madrid',
    'BCN': 'Barcelona',
    'CDG': 'Paris CDG',
    'ORY': 'Paris ORY',
    'FCO': 'Roma Fiumicino',
    'MXP': 'Milão MXP',
    'MIL': 'Milão MIL',
    'LHR': 'Londres Heathrow',
    'LGW': 'Londres Gatwick',
    'FRA': 'Frankfurt',
    'AMS': 'Amsterdã',
    'ZRH': 'Zurique',
    
    // Aeroportos Ásia/Oceania
    'NRT': 'Tóquio NRT',
    'HND': 'Tóquio HND'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v8.0
// ================================================================================
export default async function handler(req, res) {
    // Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Endpoint GET - Status da API
    if (req.method === 'GET') {
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

        return res.status(200).json({
            success: true,
            status: 'operational',
            version: '8.0',
            message: 'API CVC Itaqua Online - Aéreo e Pacote Atualizados',
            timestamp: new Date().toISOString(),
            services: {
                openai: hasOpenAI ? 'Configurado' : 'Não configurado',
                anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
            },
            features: [
                'Templates aéreo atualizados com checklist completo',
                'Pacote completo totalmente reformulado',
                'Suporte a aeroportos múltiplos (Paris CDG/ORY)',
                'Passageiros flexíveis (com/sem idade)',
                'Parcelamento atualizado',
                'Bagagem padrão: mala de mão + item pessoal',
                'Múltiplas opções e multitrechos'
            ],
            templates_atualizados: [
                'aereo_ida_volta',
                'aereo_conexao_detalhada', 
                'aereo_somente_ida',
                'multiplas_opcoes_2',
                'multitrecho',
                'multiplas_companhias',
                'pacote_completo'
            ],
            templates_mantidos: [
                'hoteis_multiplas_opcoes',
                'roteiro_hoteis', 
                'cruzeiro',
                'locacao_carro'
            ]
        });
    }

    // Endpoint POST - Processar Orçamento
    if (req.method === 'POST') {
        try {
            console.log('📥 Requisição recebida v8.0 - Aéreo e Pacote Atualizados');

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
                arquivoBase64 = null,
                temImagem = false
            } = req.body;

            // ================================================================================
            // 4. 📊 PROCESSAMENTO DE DADOS (TODAS AS VARIÁVEIS DEFINIDAS CORRETAMENTE)
            // ================================================================================

            // Determinar conteúdo principal
            const conteudoPrincipal = observacoes || textoColado || '';
            const conteudoLower = conteudoPrincipal.toLowerCase();

            // 4.1 - Detecção de Passageiros (ATUALIZADA PARA SER FLEXÍVEL)
            let infoPassageiros = '';
            const padraoTotal = conteudoPrincipal.match(/Total\s*\((\d+)\s*(?:Adulto|Adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:Criança|Crianças))?\)/i);
            const padraoPassageiros = conteudoPrincipal.match(/(\d+)\s*(?:adulto|adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:criança|crianças))?/i);

            if (padraoTotal) {
                const numAdultos = parseInt(padraoTotal[1]);
                const numCriancas = padraoTotal[2] ? parseInt(padraoTotal[2]) : 0;
                let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
                if (numCriancas > 0) {
                    textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
                    // IDADE OPCIONAL - SÓ SE INFORMAR
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
                    // IDADE OPCIONAL - SÓ SE INFORMAR
                    if (idadesCriancas && idadesCriancas.length > 0) {
                        textoPax += ` (${idadesCriancas.join(' e ')} anos)`;
                    }
                }
                infoPassageiros = textoPax;
            }

            // 4.2 - Detecção automática de destino
            let destinoFinal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
            if (!destinoFinal && conteudoPrincipal) {
                const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Porto|Paris|Buenos Aires|Santiago|Nova York|New York|Nova Iorque|Manhattan|Times Square|Brooklyn|Queens|Rio de Janeiro|Gramado|Natal|João Pessoa|Foz do Iguaçu|Caldas Novas|Balneário Camboriú|Juazeiro do Norte|Salvador|Recife|Brasília|Curitiba|Florianópolis|Vitória|Belo Horizonte|Manaus|Belém|São Luís|São Paulo|Campinas|Ribeirão Preto|Varsóvia|Warsaw|Roma|Londres|London|Barcelona|Madrid|Frankfurt|Amsterdam|Amsterdã|Zurique|Toronto|Chicago|Los Angeles|San Francisco|Bogotá|Lima|Montevidéu|Assunção|La Paz|Boston|Washington|Seattle|Las Vegas|San Diego|Philadelphia|Phoenix|Dallas|Houston|Atlanta|Denver)/i);
                if (padraoDestino) {
                    destinoFinal = padraoDestino[0];
                    // Normalizar nomes de destinos
                    if (destinoFinal.toLowerCase() === 'new york' || destinoFinal.toLowerCase() === 'manhattan' || destinoFinal.toLowerCase() === 'times square') {
                        destinoFinal = 'Nova York';
                    }
                    console.log('📍 Destino detectado automaticamente:', destinoFinal);
                }
            }

            // 4.3 - Detecção de Tipos Especiais
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem') || conteudoLower.includes('resort');
            const isCarro = conteudoLower.includes('locação') || conteudoLower.includes('locacao') || 
                           (conteudoLower.includes('retirada') && conteudoLower.includes('devolução')) ||
                           conteudoLower.includes('dollar') || conteudoLower.includes('hertz') || 
                           conteudoLower.includes('avis') || conteudoLower.includes('categoria economico');

            // 4.4 - Análise de Conteúdo (TODAS VARIÁVEIS DEFINIDAS AQUI)
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo') || 
                            conteudoLower.includes(' ida ') || conteudoLower.includes('volta') ||
                            conteudoLower.includes('aeroporto') || conteudoLower.includes('embarque');
            
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('o pacote inclui') || 
                            conteudoLower.includes('noites de hospedagem');
            
            const temPreco = conteudoLower.includes('r$');
            
            const linkMatch = conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/[^\s]+/g);
            const linksCVC = linkMatch ? linkMatch : [];
            
            const isMultitrecho = conteudoLower.includes('multitrecho') || 
                                 conteudoLower.includes('trecho 1') || 
                                 (conteudoLower.includes('trecho') && conteudoLower.split('trecho').length > 2);
            
            const temMultiplasOpcoes = conteudoLower.includes('opção 1') || 
                                       conteudoLower.includes('opção 2') ||
                                       (conteudoLower.includes('selecionado') && conteudoLower.split('selecionado').length > 2);

            const isSomenteIda = conteudoLower.includes('somente ida') || 
                                conteudoLower.includes('apenas ida') ||
                                conteudoLower.includes('one way');

            const isCruzeiro = conteudoLower.includes('cruzeiro') || 
                              conteudoLower.includes('navio') ||
                              conteudoLower.includes('cabine');

            // Detecção de informações específicas do pacote
            const temTraslado = conteudoLower.includes('traslado') || 
                               conteudoLower.includes('transfer') ||
                               conteudoLower.includes('aeroporto/hotel');
            
            const temPasseios = conteudoLower.includes('city tour') || 
                               conteudoLower.includes('passeio') ||
                               conteudoLower.includes('excursão') ||
                               conteudoLower.includes('tour');
            
            const temSeguro = conteudoLower.includes('seguro') ||
                             conteudoLower.includes('insurance') ||
                             conteudoLower.includes('cobertura');

            // Detecção de taxas
            const temTaxas = conteudoLower.includes('resort fee') || 
                           conteudoLower.includes('taxa do hotel') ||
                           conteudoLower.includes('mandatory tax') ||
                           conteudoLower.includes('taxa obrigatória') ||
                           conteudoLower.includes('pago localmente') ||
                           conteudoLower.includes('pago no hotel');

            // Detecção de política de cancelamento
            const temReembolsavel = conteudoPrincipal.includes('Reembolsável') && !conteudoPrincipal.includes('Não reembolsável');
            const temNaoReembolsavel = conteudoPrincipal.includes('Não reembolsável');

            // Detecção de parcelamento
            const temInfoParcelamento = conteudoPrincipal.includes('Entrada de R$') || 
                                       conteudoPrincipal.includes('primeira parcela de R$') ||
                                       conteudoPrincipal.includes('x de R$') ||
                                       conteudoPrincipal.includes('x s/ juros') ||
                                       parcelamento !== null;
            
            let tipoParcelamento = null;
            let numParcelas = parcelamento || 10;
            if (temInfoParcelamento) {
                if (conteudoPrincipal.includes('Entrada de R$') || conteudoPrincipal.includes('primeira parcela de R$')) {
                    tipoParcelamento = 'parcela_diferenciada';
                } else if (parcelamento) {
                    tipoParcelamento = 'parcelas_iguais';
                    numParcelas = parcelamento;
                }
            }

            // Log de análise
            console.log('🔍 Análise do conteúdo v8.0:');
            console.log(`- Destino: ${destinoFinal || 'N/A'}, Passageiros: ${infoPassageiros || 'N/A'}`);
            console.log(`- Dicas: ${isDicas}, Ranking: ${isRanking}, Hotel: ${isHotel}, Carro: ${isCarro}, Cruzeiro: ${isCruzeiro}`);
            console.log(`- Pacote: ${isPacote}, Multitrecho: ${isMultitrecho}, Somente Ida: ${isSomenteIda}, Múltiplas Opções: ${temMultiplasOpcoes}`);
            console.log(`- Preço: ${temPreco}, Parcelamento: ${temInfoParcelamento}, Taxas: ${temTaxas}, Links: ${linksCVC.length}`);
            console.log(`- Pacote extras: Traslado: ${temTraslado}, Passeios: ${temPasseios}, Seguro: ${temSeguro}`);

            // ================================================================================
            // 5. 📝 PROMPTS ESPECIALIZADOS (ATUALIZADOS COM NOVAS REGRAS)
            // ================================================================================

            let prompt = '';
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS)
                .map(([codigo, nome]) => `${codigo} → ${nome}`)
                .join('\n');

            // 5.1 - Prompt para Dicas (MANTIDO)
            if (isDicas) {
                if (!destinoFinal) {
                    prompt = `⚠️ DESTINO NÃO IDENTIFICADO

Responda EXATAMENTE assim:

❌ **Destino não identificado**

Para receber dicas personalizadas, por favor informe:
• O destino da viagem
• Período da viagem
• Quantidade de passageiros

📞 Entre em contato com a CVC Itaqua e teremos prazer em criar um roteiro personalizado para sua viagem!

NÃO adicione dicas genéricas. NÃO invente destino.`;
                } else {
                    const temCriancas = conteudoLower.includes('criança');
                    prompt = `Crie dicas ESPECÍFICAS e PRÁTICAS para ${destinoFinal}.
${temCriancas ? 'A viagem inclui CRIANÇAS. Adapte as dicas para famílias.' : ''}

FORMATO:
🌟 DICAS PARA ${destinoFinal.toUpperCase()} 🌟

Crie dicas detalhadas sobre:
- Melhor época para visitar
- Principais atrações
- Dicas de economia
- Gastronomia local
- Transporte
- Compras
- Documentação necessária

Sempre mencione os serviços da CVC Itaqua quando relevante.
Seja específico e prático.`;
                }

            // 5.2 - Prompt para Ranking (MANTIDO)
            } else if (isRanking) {
                 if (!destinoFinal) {
                    prompt = `⚠️ DESTINO NÃO IDENTIFICADO

Responda EXATAMENTE assim:

❌ **Destino não identificado para ranking de hotéis**

Para receber nosso ranking exclusivo de hotéis, por favor informe:
• O destino desejado
• Período da viagem
• Tipo de hotel preferido (luxo, médio, econômico)

📞 A CVC Itaqua tem parceria com os melhores hotéis em todos os destinos!
Entre em contato e encontraremos a hospedagem perfeita para você.

NÃO adicione hotéis genéricos. NÃO invente destino.`;
                } else {
                    const temDadosHoteis = isHotel && temPreco;
                    if (temDadosHoteis) {
                        prompt = `DADOS FORNECIDOS:
${conteudoPrincipal}

Crie um ranking dos hotéis fornecidos, ORDENADOS DO MAIS BARATO PARA O MAIS CARO.

FORMATO OBRIGATÓRIO:
🏆 **RANKING DE HOTÉIS - ${destinoFinal.toUpperCase()}** 🏆
[Período e passageiros se disponível]

[Para cada hotel, do mais barato ao mais caro:]
💰 [Nome do Hotel] – R$ [valor]
🛏 [Tipo de quarto e descrição]
📍 [Localização]
✅ [Destaques positivos]
⚠️ [Se for hotel simples: "HOTEL SIMPLES, CATEGORIA ECONÔMICA"]
💡 [Dica útil e positiva]

NÃO incluir links, parcelamento ou "valores sujeitos".
SEMPRE focar no positivo, nunca mencionar aspectos negativos.`;
                    } else {
                        prompt = `Crie um ranking de hotéis REAIS em ${destinoFinal}.

FORMATO:
🏆 **RANKING DE HOTÉIS - ${destinoFinal.toUpperCase()}** 🏆

Liste 5 hotéis reais, do mais barato ao mais caro:
💰 [Nome real] – R$ [preço médio realista]
🛏 [Tipo de quarto]
📍 [Localização real]
✅ [Destaques positivos]
💡 [Dica útil]

Use hotéis que realmente existem em ${destinoFinal}.
Foque sempre no positivo.
Para hotéis simples, use "HOTEL SIMPLES, CATEGORIA ECONÔMICA".`;
                    }
                }
            // 5.3 - Prompt para Locação de Carro (MANTIDO)
            } else if (isCarro) {
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}

DETECTADO: LOCAÇÃO DE CARRO

Use o template 'locacao_carro' para formatar.

IMPORTANTE:
- ORDENAR do MAIS BARATO para o MAIS CARO
- Converter "ORLANDO INTERNATIONAL APORLANDO" para "Orlando International Airport"
- Identificar categorias (Econômico, Compacto, SUV)
- Destacar taxas locais
- Incluir serviços (Km livre, proteção, motorista adicional)

${temInfoParcelamento ? 
`Incluir parcelamento: ${tipoParcelamento === 'parcela_diferenciada' ? 
'Parcelado em 10x, sendo a primeira de R$ X + 9x de R$ Y s/ juros' :
`${numParcelas}x de R$ X s/ juros`}` : 
'NÃO incluir parcelamento'}

Termine com "Valores sujeitos a confirmação e disponibilidade"`;
            // 5.4 - Prompt para Hotéis (MANTIDO)
            } else if (isHotel && !temAereo) {
                const hasAnyTax = temTaxas ? 'SIM - INCLUIR TODAS!' : 'NÃO';
                const reembolsoInfo = temNaoReembolsavel ? 'Não reembolsável detectado' : 
                                      temReembolsavel ? 'Reembolsável detectado - NÃO MENCIONAR' : 
                                      'Verificar no texto';
                
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}
${destinoFinal ? `Destino: ${destinoFinal}` : ''}
${infoPassageiros ? `Passageiros: ${infoPassageiros}` : ''}

DETECTADO: HOTÉIS (sem aéreo)

Use o template 'hoteis_multiplas_opcoes'.

REGRAS CRÍTICAS PARA HOTÉIS:

1. REEMBOLSO (REGRA OBRIGATÓRIA):
   - ${reembolsoInfo}
   - Se diz "Reembolsável" (sem "Não") → NÃO MENCIONAR NADA
   - Se diz "Não reembolsável" → INCLUIR: 🏷️ Não reembolsável
   - NUNCA mostrar "🏷️ Reembolsável"

2. TAXAS (SEMPRE DESTACAR):
   - Taxas detectadas? ${hasAnyTax}
   - Resort Fee → ⚠️ Resort Fee: USD XX por noite (pago no hotel)
   - Taxa do hotel → ⚠️ Taxa do hotel: USD XX por noite (pago no hotel)
   - Mandatory Tax → ⚠️ Taxa obrigatória: USD XX (pago no hotel)
   - SEMPRE usar ⚠️ para taxas

3. ORDENAÇÃO:
   - SEMPRE do MAIS BARATO para o MAIS CARO
   - Primeiro hotel = menor preço
   - Último hotel = maior preço

4. FORMATAÇÃO:
   - Usar ━━━━━━━━━━━━━━━━━━ entre opções
   - Cada hotel em seção separada
   - Se houver "Preferencial", destacar com ⭐
   - Se houver desconto, mostrar: De ~~R$ X~~ por R$ Y

${temInfoParcelamento ? 
`5. PARCELAMENTO:
   ${tipoParcelamento === 'parcela_diferenciada' ? 
   '- Formato: Parcelado em 10x, sendo a primeira de R$ X + 9x de R$ Y s/ juros' :
   `- Formato: ${numParcelas}x de R$ X s/ juros`}` : 
'5. PARCELAMENTO: NÃO incluir (não foi solicitado)'}

${linksCVC.length > 0 ? `6. LINKS: Incluir links fornecidos: ${linksCVC.join(', ')}` : '6. LINKS: NÃO incluir'}

Termine com "Valores sujeitos a confirmação e disponibilidade"`;
            // 5.5 - Prompt para Cruzeiro (MANTIDO)
            } else if (isCruzeiro) {
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}

DETECTADO: CRUZEIRO

Use o template 'cruzeiro'.
Extraia todas as informações sobre o navio, roteiro, cabines.

Termine com a mensagem padrão do template.`;
            // 5.6 - Prompt Principal para Orçamentos AÉREO E PACOTE (COMPLETAMENTE ATUALIZADO)
            } else {
                let templateEspecifico = '';
                if (isPacote) {
                    templateEspecifico = 'pacote_completo';
                } else if (isSomenteIda) {
                    templateEspecifico = 'aereo_somente_ida';
                } else if (temMultiplasOpcoes && !isMultitrecho) {
                    templateEspecifico = 'multiplas_opcoes_2 ou multiplas_companhias';
                } else if (isMultitrecho) {
                    templateEspecifico = 'multitrecho';
                } else {
                    templateEspecifico = 'aereo_ida_volta ou aereo_conexao_detalhada';
                }

                prompt = `🚀 SISTEMA CVC ITAQUA v8.0 - AÉREO E PACOTE ATUALIZADOS

TEMPLATES DISPONÍVEIS (ATUALIZADOS COM CHECKLIST COMPLETO):
${templatesString}

DADOS DO CLIENTE:
${conteudoPrincipal}

ANÁLISE DETALHADA:
- Destino: ${destinoFinal || 'EXTRAIR DO CONTEÚDO - NÃO INVENTAR'}
- Passageiros: ${infoPassageiros || 'EXTRAIR DO CONTEÚDO'}
- É Pacote? ${isPacote}
- É Multitrecho? ${isMultitrecho}
- Somente Ida? ${isSomenteIda}
- Múltiplas Opções? ${temMultiplasOpcoes}
- Tem preço? ${temPreco}
- Tem taxas? ${temTaxas}
- Pacote Extras: Traslado: ${temTraslado}, Passeios: ${temPasseios}, Seguro: ${temSeguro}

TEMPLATE SUGERIDO: ${templateEspecifico}

CONVERSÕES OBRIGATÓRIAS DE AEROPORTOS:
${tabelaAeroportos}

📋 REGRAS CRÍTICAS v8.0 (SEGUIR RIGOROSAMENTE):

1. 🎯 TÍTULOS ATUALIZADOS:
   - NOVO FORMATO: "*{companhia} ✈ {destino}*"
   - NUNCA MAIS: "*{companhia} - {origem} ✈ {destino}*"
   - Exemplos CORRETOS: "*Latam ✈ Porto Seguro*", "*TAP Portugal ✈ Lisboa*"

2. 🎒 BAGAGEM PADRÃO ATUALIZADA:
   - NOVO PADRÃO: "✅ Inclui 1 mala de mão + 1 item pessoal"
   - SE TIVER bagagem despachada: "✅ Inclui 1 mala de mão + 1 item pessoal + bagagem despachada 23kg"
   - NUNCA MAIS: "✅ Só mala de mão incluída"

3. 👥 PASSAGEIROS FLEXÍVEIS:
   - IDADE OPCIONAL: Se não informar idade, usar só "01 criança" ou "01 bebê"
   - IDADE INFORMADA: "01 criança (5 anos)" ou "01 bebê (10 meses)"
   - Formato: "{passageiros}" conforme detectado

4. 💳 PARCELAMENTO ATUALIZADO:
   ${!temInfoParcelamento ? 'NÃO incluir linha de parcelamento' :
   tipoParcelamento === 'parcela_diferenciada' ? 
   '💳 Parcelado em 10x, sendo a primeira de R$ X + 9x de R$ Y s/ juros' :
   `💳 ${numParcelas}x de R$ X s/ juros`}

5. 🗺️ AEROPORTOS MÚLTIPLOS:
   - Paris CDG / Paris ORY
   - Buenos Aires EZE / Buenos Aires AEP  
   - Nova York JFK / Nova York LGA / Nova York EWR
   - Milão MXP / Milão MIL
   - Tóquio NRT / Tóquio HND

6. 🔗 LINKS E REEMBOLSO:
   ${linksCVC.length === 0 ? 'NÃO incluir links' : `Incluir links: ${linksCVC.join(', ')}`}
   
   REGRA DE REEMBOLSO:
   - Se diz "Reembolsável" (sem "Não") → NÃO MENCIONAR NADA
   - Se diz "Não reembolsável" → INCLUIR: 🏷️ Não reembolsável
   - NUNCA escrever "🏷️ Reembolsável"

7. 📦 PARA PACOTES - REGRAS ESPECIAIS:
   - Traslado: SE HOUVER → "- Traslado {tipo_traslado}" em linha separada
   - Passeios: SE HOUVER → "- {passeios}" em linha separada
   - Seguro: SE HOUVER → "- {seguro}" em linha separada
   - SE NÃO HOUVER → não incluir a linha
   - Hotéis: Até 3 opções, ordenar do mais barato ao mais caro
   - SEMPRE incluir aeroportos convertidos nos voos
   - Parcelamento: Seguir mesmas regras dos aéreos
   
   EXEMPLO DE FORMATAÇÃO PACOTE:
   *O Pacote Inclui:*
   - Passagem Aérea ida e volta para Lisboa
   - Taxas de Embarque
   - Traslado aeroporto/hotel/aeroporto (SE HOUVER)
   - City tour panorâmico (SE HOUVER PASSEIOS)
   - Seguro viagem internacional (SE HOUVER SEGURO)
   - 15 noites de hospedagem no hotel escolhido

8. 🏷️ FINALIZAÇÕES OBRIGATÓRIAS:
   - SEMPRE terminar com: "Valores sujeitos a confirmação e disponibilidade"
   - Usar separador "--" APENAS entre ida e volta
   - Formato data: DD/MM
   - Formato hora: HH:MM

REGRA FUNDAMENTAL: Use o template EXATO correspondente ao tipo detectado. Converta TODOS os códigos de aeroportos. NUNCA invente informações não fornecidas.`;
            }

            // ================================================================================
            // 6. 🤖 PROCESSAMENTO COM IA (MANTIDO)
            // ================================================================================
            let resultado = '';
            let iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (conteudoPrincipal.length > 2000) || isPacote || isMultitrecho || isCruzeiro;

            console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');

            const systemPrompt = 'Você é um assistente especialista da CVC Itaqua v8.0. Siga EXATAMENTE os templates atualizados e regras do checklist fornecidos. NUNCA invente informações. SEMPRE converta códigos de aeroportos. Use o NOVO formato de títulos sem origem. BAGAGEM PADRÃO: mala de mão + item pessoal. PASSAGEIROS: idade opcional. REGRA REEMBOLSO: Se diz "Reembolsável" (sem "Não"), NÃO mencione. Se diz "Não reembolsável", inclua 🏷️ Não reembolsável.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🤖 Usando Claude 3 Haiku...');
                iaUsada = 'claude-3-haiku';
                const messages = [{
                    role: 'user',
                    content: (imagemBase64 || arquivoBase64) ? [
                        { type: 'text', text: prompt },
                        { type: 'image', source: { type: 'base64', media_type: (imagemBase64 || arquivoBase64).split(';')[0].split(':')[1], data: (imagemBase64 || arquivoBase64).split(',')[1] } }
                    ] : prompt
                }];
                const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
                    body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 2000, temperature: 0.1, messages, system: systemPrompt })
                });
                if (!claudeResponse.ok) { const errorText = await claudeResponse.text(); console.error('❌ Erro Claude:', errorText); throw new Error(`Erro ao processar com Claude: ${errorText}`); }
                const claudeData = await claudeResponse.json();
                resultado = claudeData.content[0].text;
            } else {
                console.log('🤖 Usando GPT-4o-mini...');
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) throw new Error('OpenAI API key não configurada.');
                const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2000 })
                });
                if (!gptResponse.ok) { const errorText = await gptResponse.text(); console.error('❌ Erro GPT:', errorText); throw new Error(`Erro ao processar com GPT: ${errorText}`); }
                const gptData = await gptResponse.json();
                resultado = gptData.choices[0].message.content;
            }

            // ================================================================================
            // 7. ✅ RESPOSTA FINAL
            // ================================================================================
            console.log('✅ Processamento concluído v8.0 - Aéreo e Pacote Atualizados');
            let tipoDetectado = 'aereo_simples';
            if (isDicas) tipoDetectado = 'dicas';
            else if (isRanking) tipoDetectado = 'ranking';
            else if (isCarro) tipoDetectado = 'locacao_carro';
            else if (isCruzeiro) tipoDetectado = 'cruzeiro';
            else if (isHotel && !temAereo) tipoDetectado = 'hoteis';
            else if (isPacote) tipoDetectado = 'pacote_completo';
            else if (isMultitrecho) tipoDetectado = 'multitrecho';
            else if (isSomenteIda) tipoDetectado = 'somente_ida';
            else if (temMultiplasOpcoes) tipoDetectado = 'multiplas_opcoes';

            return res.status(200).json({
                success: true,
                result: resultado,
                metadata: {
                    version: '8.0',
                    ia_usada: iaUsada,
                    tipo_detectado: tipoDetectado,
                    destino: destinoFinal,
                    passageiros: infoPassageiros,
                    tem_preco: temPreco,
                    tem_parcelamento: temInfoParcelamento,
                    tipo_parcelamento: tipoParcelamento,
                    num_parcelas: numParcelas,
                    links_detectados: linksCVC.length,
                    template_usado: tipoDetectado,
                    atualizacoes_v8: [
                        'Títulos sem origem (apenas destino)',
                        'Bagagem padrão: mala de mão + item pessoal',
                        'Passageiros com idade opcional',
                        'Parcelamento atualizado',
                        'Aeroportos múltiplos suportados',
                        'Pacote completo reformulado'
                    ]
                }
            });

        } catch (error) {
            console.error('❌ Erro no processamento v8.0:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Erro desconhecido no servidor',
                version: '8.0',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Método não suportado
    return res.status(405).json({
        success: false,
        error: 'Método não suportado. Use GET para status ou POST para processar.',
        version: '8.0'
    });
}
