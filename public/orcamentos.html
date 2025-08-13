// 🚀 CVC ITAQUA v8.1 - AÉREO E PACOTE ATUALIZADOS - ERRO 500 CORRIGIDO
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

    // Aeroportos América do Sul (EXPANDIDO)
    'EZE': 'Buenos Aires EZE',
    'AEP': 'Buenos Aires AEP',
    'SCL': 'Santiago',
    'LIM': 'Lima',
    'PCL': 'Pucallpa',
    'CUZ': 'Cusco',
    'AQP': 'Arequipa',
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
// 3. 🎯 HANDLER PRINCIPAL DA API v8.1 - ERRO 500 CORRIGIDO
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
            version: '8.1',
            message: 'API CVC Itaqua Online - Erro 500 Corrigido',
            timestamp: new Date().toISOString(),
            services: {
                openai: hasOpenAI ? 'Configurado' : 'Não configurado',
                anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
            },
            features: [
                'ERRO 500 CORRIGIDO - sintaxe javascript válida',
                'Templates aéreo atualizados com checklist completo',
                'Pacote completo totalmente reformulado',
                'Suporte a aeroportos múltiplos (Paris CDG/ORY)',
                'Passageiros flexíveis (com/sem idade)',
                'Detecção melhorada de múltiplas opções',
                'Conexão detalhada funcionando'
            ]
        });
    }

    // Endpoint POST - Processar Orçamento
    if (req.method === 'POST') {
        try {
            console.log('📥 Requisição recebida v8.1 - Erro 500 Corrigido');

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

            // 4.1 - Detecção de Passageiros (CORRIGIDA PARA SEMPRE USAR "ADULTO")
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
            } else {
                // SE NÃO DETECTAR, USAR PADRÃO
                infoPassageiros = '01 adulto';
            }

            // 4.2 - Detecção automática de destino (MELHORADA)
            let destinoFinal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
            if (!destinoFinal && conteudoPrincipal) {
                // DESTINOS PRINCIPAIS EXPANDIDOS
                const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Porto|Paris|Buenos Aires|Santiago|Nova York|New York|Nova Iorque|Manhattan|Times Square|Brooklyn|Queens|Rio de Janeiro|Gramado|Natal|João Pessoa|Foz do Iguaçu|Caldas Novas|Balneário Camboriú|Juazeiro do Norte|Salvador|Recife|Brasília|Curitiba|Florianópolis|Vitória|Belo Horizonte|Manaus|Belém|São Luís|São Paulo|Campinas|Ribeirão Preto|Varsóvia|Warsaw|Roma|Londres|London|Barcelona|Madrid|Frankfurt|Amsterdam|Amsterdã|Zurique|Toronto|Chicago|Los Angeles|San Francisco|Bogotá|Lima|Pucallpa|Cusco|Arequipa|Montevidéu|Assunção|La Paz|Boston|Washington|Seattle|Las Vegas|San Diego|Philadelphia|Phoenix|Dallas|Houston|Atlanta|Denver)/i);
                
                // DETECÇÃO POR CÓDIGOS DE AEROPORTO TAMBÉM
                const padraoAeroporto = conteudoPrincipal.match(/\b(PCL|LIM|CUZ|AQP|BOG|SCL|EZE|AEP|MVD|ASU|LPB|VVI|MCO|MIA|JFK|LGA|EWR|LAX|SFO|ORD|YYZ|LIS|OPO|MAD|BCN|CDG|ORY|FCO|MXP|LHR|LGW|FRA|AMS|ZRH|NRT|HND)\b/g);
                
                if (padraoDestino) {
                    destinoFinal = padraoDestino[0];
                    if (destinoFinal.toLowerCase() === 'new york' || destinoFinal.toLowerCase() === 'manhattan') {
                        destinoFinal = 'Nova York';
                    }
                    console.log('📍 Destino detectado por nome:', destinoFinal);
                } else if (padraoAeroporto && padraoAeroporto.length > 0) {
                    const ultimoAeroporto = padraoAeroporto[padraoAeroporto.length - 1];
                    if (AEROPORTOS[ultimoAeroporto]) {
                        destinoFinal = AEROPORTOS[ultimoAeroporto];
                        console.log('📍 Destino detectado por código:', ultimoAeroporto, '→', destinoFinal);
                    }
                }
            }

            // 4.3 - Detecção de Tipos Especiais
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem') || conteudoLower.includes('resort');
            const isCarro = conteudoLower.includes('locação') || conteudoLower.includes('locacao') || 
                           (conteudoLower.includes('retirada') && conteudoLower.includes('devolução'));

            // 4.4 - Análise de Conteúdo (TODAS VARIÁVEIS DEFINIDAS AQUI - CORREÇÃO DO ERRO 500)
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo') || 
                            conteudoLower.includes(' ida ') || conteudoLower.includes('volta') ||
                            conteudoLower.includes('aeroporto') || conteudoLower.includes('embarque');
            
            const isPacote = (isHotel && temAereo) || conteudoLower.includes('o pacote inclui') || 
                            conteudoLower.includes('noites de hospedagem');
            
            // ✅ CORREÇÃO CRÍTICA: Linha completa que causava o erro 500
            const temPreco = conteudoLower.includes('r$');
            
            const linkMatch = conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/[^\s]+/g);
            const linksCVC = linkMatch ? linkMatch : [];
            
            const isMultitrecho = conteudoLower.includes('multitrecho') || 
                                 conteudoLower.includes('trecho 1') || 
                                 (conteudoLower.includes('trecho') && conteudoLower.split('trecho').length > 2);
            
            // DETECÇÃO MELHORADA DE MÚLTIPLAS OPÇÕES
            const temMultiplasOpcoes = conteudoLower.includes('opção 1') || 
                                       conteudoLower.includes('opção 2') ||
                                       (conteudoLower.includes('selecionado') && conteudoLower.split('selecionado').length > 2) ||
                                       (conteudoLower.includes('excluir') && conteudoLower.split('excluir').length > 2) ||
                                       (conteudoLower.match(/total.*r\$/g) && conteudoLower.match(/total.*r\$/g).length > 1) ||
                                       (conteudoLower.includes('tap') && conteudoLower.includes('azul')) ||
                                       (conteudoLower.includes('gol') && conteudoLower.includes('latam')) ||
                                       (conteudoLower.includes('latam') && conteudoLower.includes('azul'));

            // DETECÇÃO DE CONEXÃO DETALHADA
            const temConexaoDetalhada = conteudoLower.includes('espera de') ||
                                       conteudoLower.includes('conexão em') ||
                                       conteudoLower.includes('escala em') ||
                                       (conteudoLower.includes('espera') && conteudoLower.includes('min'));

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
                           conteudoLower.includes('taxa obrigatória');

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
            console.log('🔍 Análise do conteúdo v8.1:');
            console.log(`- Destino: ${destinoFinal || 'N/A'}, Passageiros: ${infoPassageiros || 'N/A'}`);
            console.log(`- Múltiplas Opções: ${temMultiplasOpcoes}, Conexão: ${temConexaoDetalhada}, Pacote: ${isPacote}`);

            // ================================================================================
            // 5. 📝 PROMPTS ESPECIALIZADOS (SIMPLIFICADOS PARA FUNCIONAR)
            // ================================================================================

            let prompt = '';
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS)
                .map(([codigo, nome]) => `${codigo} → ${nome}`)
                .join('\n');

            // 5.1 - Prompt Principal SIMPLIFICADO
            if (isDicas) {
                prompt = `Crie dicas para ${destinoFinal || 'destino não especificado'}`;
            } else if (isRanking) {
                prompt = `Crie ranking de hotéis para ${destinoFinal || 'destino não especificado'}`;
            } else {
                let templateEspecifico = '';
                if (isPacote) {
                    templateEspecifico = 'pacote_completo';
                } else if (isSomenteIda) {
                    templateEspecifico = 'aereo_somente_ida';
                } else if (temMultiplasOpcoes) {
                    templateEspecifico = 'multiplas_opcoes_2';
                } else if (isMultitrecho) {
                    templateEspecifico = 'multitrecho';
                } else if (temConexaoDetalhada) {
                    templateEspecifico = 'aereo_conexao_detalhada';
                } else {
                    templateEspecifico = 'aereo_ida_volta';
                }

                prompt = `SISTEMA CVC ITAQUA v8.1 - ERRO 500 CORRIGIDO

TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS DO CLIENTE:
${conteudoPrincipal}

ANÁLISE:
- Destino: ${destinoFinal || 'EXTRAIR DO CONTEÚDO'}
- Passageiros: ${infoPassageiros || 'EXTRAIR DO CONTEÚDO'}
- Template sugerido: ${templateEspecifico}

AEROPORTOS (converter códigos):
${tabelaAeroportos}

REGRAS OBRIGATÓRIAS:
1. Títulos: "*Companhia ✈ Destino*" (sem origem)
2. Bagagem: "✅ Inclui 1 mala de mão + 1 item pessoal"
3. Passageiros: "01 adulto", "02 adultos" (com zero)
4. Formato voos: "DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo)"
5. Converter TODOS códigos de aeroporto
6. Múltiplas opções: "*OPÇÃO 1 - Companhia ✈ Destino*"
7. Conexão: "(conexão em Cidade - XXh XXmin de espera)"
${temInfoParcelamento ? `8. Parcelamento: ${tipoParcelamento === 'parcela_diferenciada' ? 'Parcelado em 10x, sendo a primeira de R$ X + 9x de R$ Y s/ juros' : `${numParcelas}x de R$ X s/ juros`}` : '8. NÃO incluir parcelamento'}
9. Reembolso: ${temNaoReembolsavel ? 'Incluir "🏷️ Não reembolsável"' : 'NÃO mencionar se reembolsável'}
10. SEMPRE terminar: "Valores sujeitos a confirmação e disponibilidade"

Use o template ${templateEspecifico} e siga EXATAMENTE as regras acima.`;
            }

            // ================================================================================
            // 6. 🤖 PROCESSAMENTO COM IA (SIMPLIFICADO)
            // ================================================================================
            let resultado = '';
            let iaUsada = 'gpt-4o-mini';
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem || (conteudoPrincipal.length > 2000);

            console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');

            const systemPrompt = 'Você é um assistente da CVC Itaqua v8.1. Siga EXATAMENTE os templates e regras fornecidos. NUNCA invente informações. SEMPRE converta códigos de aeroportos. Use formato limpo para WhatsApp.';

            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🤖 Usando Claude...');
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
                if (!claudeResponse.ok) { 
                    const errorText = await claudeResponse.text(); 
                    console.error('❌ Erro Claude:', errorText); 
                    throw new Error(`Erro ao processar com Claude: ${errorText}`); 
                }
                const claudeData = await claudeResponse.json();
                resultado = claudeData.content[0].text;
            } else {
                console.log('🤖 Usando GPT...');
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) throw new Error('OpenAI API key não configurada.');
                const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2000 })
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
            console.log('✅ Processamento concluído v8.1');
            let tipoDetectado = 'aereo_simples';
            if (isDicas) tipoDetectado = 'dicas';
            else if (isRanking) tipoDetectado = 'ranking';
            else if (isPacote) tipoDetectado = 'pacote_completo';
            else if (temMultiplasOpcoes) tipoDetectado = 'multiplas_opcoes';
            else if (temConexaoDetalhada) tipoDetectado = 'conexao_detalhada';

            return res.status(200).json({
                success: true,
                result: resultado,
                metadata: {
                    version: '8.1',
                    ia_usada: iaUsada,
                    tipo_detectado: tipoDetectado,
                    destino: destinoFinal,
                    passageiros: infoPassageiros,
                    tem_preco: temPreco,
                    tem_parcelamento: temInfoParcelamento,
                    correcoes_v81: [
                        'ERRO 500 CORRIGIDO - sintaxe javascript válida',
                        'Todas variáveis definidas corretamente',
                        'Detecção melhorada de múltiplas opções',
                        'PCL → Pucallpa nos aeroportos',
                        'Passageiros sempre 01, 02 (zero à esquerda)'
                    ]
                }
            });

        } catch (error) {
            console.error('❌ Erro no processamento v8.1:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Erro desconhecido no servidor',
                version: '8.1',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    return res.status(405).json({
        success: false,
        error: 'Método não suportado. Use GET para status ou POST para processar.',
        version: '8.1'
    });
}
