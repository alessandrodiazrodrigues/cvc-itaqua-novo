// 🚀 CVC ITAQUA v7.9 - SISTEMA COMPLETO COM TEMPLATES HARDCODED
// ================================================================================
// 📑 ÍNDICE GERAL DO SISTEMA
// ================================================================================
// 1. TEMPLATES DE ORÇAMENTOS (HARDCODED)
//    1.1 Aéreo Ida e Volta Simples
//    1.2 Aéreo com Conexão Detalhada
//    1.3 Aéreo Somente Ida
//    1.4 Múltiplas Opções (2 e 3 planos)
//    1.5 Multitrecho
//    1.6 Múltiplas Companhias
//    1.7 Hotéis - Múltiplas Opções
//    1.8 Roteiro de Hotéis
//    1.9 Pacote Completo
//    1.10 Cruzeiro
//    1.11 Locação de Carro (NOVO)
// 2. TABELA DE CONVERSÃO DE AEROPORTOS
// 3. HANDLER PRINCIPAL DA API
// 4. PROCESSAMENTO DE DADOS
// 5. PROMPTS ESPECIALIZADOS
// 6. PROCESSAMENTO COM IA
// 7. RESPOSTA FINAL
// ================================================================================

// ================================================================================
// 1. 📋 TEMPLATES DE ORÇAMENTOS (HARDCODED DO MANUAL)
// ================================================================================
const TEMPLATES = {
    // 1.1 - Aéreo Ida e Volta Simples
    aereo_ida_volta: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.2 - Aéreo com Conexão Detalhada
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

    // 1.3 - Aéreo Somente Ida
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    // 1.4 - Múltiplas Opções - 2 Planos
    multiplas_opcoes_2: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
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

    // 1.5 - Multitrecho
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

    // 1.6 - Múltiplas Companhias
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

    // 1.7 - Hotéis - Múltiplas Opções
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

    // 1.8 - Roteiro de Hotéis
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

    // 1.9 - Pacote Completo
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

    // 1.10 - Cruzeiro
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

    // 1.11 - Locação de Carro (NOVO)
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
// 2. 🗺️ TABELA DE CONVERSÃO DE AEROPORTOS
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
    'EZE': 'Buenos Aires Ezeiza',
    'AEP': 'Buenos Aires Aeroparque',
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
    'LGA': 'Nova York LaGuardia',
    'EWR': 'Newark',
    'LAX': 'Los Angeles',
    'SFO': 'San Francisco',
    'ORD': 'Chicago',
    'YYZ': 'Toronto',

    // Aeroportos Europa
    'LIS': 'Lisboa',
    'OPO': 'Porto',
    'MAD': 'Madrid',
    'BCN': 'Barcelona',
    'CDG': 'Paris Charles de Gaulle',
    'ORY': 'Paris Orly',
    'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa',
    'LHR': 'Londres Heathrow',
    'LGW': 'Londres Gatwick',
    'FRA': 'Frankfurt',
    'AMS': 'Amsterdã',
    'ZRH': 'Zurique'
};

// ================================================================================
// 3. 🎯 HANDLER PRINCIPAL DA API v7.9
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
            version: '7.9',
            message: 'API CVC Itaqua Online - Templates Hardcoded',
            timestamp: new Date().toISOString(),
            services: {
                openai: hasOpenAI ? 'Configurado' : 'Não configurado',
                anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
            },
            features: [
                'Templates hardcoded (sem dependência externa)',
                'Detecção automática de tipo',
                'Suporte a locação de carro',
                'Multitrecho aprimorado',
                'Ranking de hotéis',
                'Ordenação por preço',
                'Parcelamento condicional'
            ],
            templates_disponíveis: Object.keys(TEMPLATES)
        });
    }

    // Endpoint POST - Processar Orçamento
    if (req.method === 'POST') {
        try {
            console.log('📥 Requisição recebida v7.9');

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
            // 4. 📊 PROCESSAMENTO DE DADOS
            // ================================================================================

            // Determinar conteúdo principal
            const conteudoPrincipal = observacoes || textoColado || '';
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

            // 4.2 - Detecção automática de destino
            let destinoFinal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
            if (!destinoFinal && conteudoPrincipal) {
                const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Paris|Buenos Aires|Santiago|Nova York|New York|Rio de Janeiro|Gramado|Natal|João Pessoa|Foz do Iguaçu|Caldas Novas|Balneário Camboriú|Juazeiro do Norte|Salvador|Recife|Brasília|Curitiba|Florianópolis|Vitória|Belo Horizonte|Manaus|Belém|São Luís|São Paulo|Campinas|Ribeirão Preto|Varsóvia|Warsaw|Roma|Londres|London|Barcelona|Madrid|Frankfurt|Amsterdam|Zurique|Toronto|Chicago|Los Angeles|San Francisco|Bogotá|Lima|Montevidéu|Assunção|La Paz)/i);
                if (padraoDestino) {
                    destinoFinal = padraoDestino[0];
                    console.log('📍 Destino detectado automaticamente:', destinoFinal);
                }
            }

            // 4.3 - Detecção de Tipos Especiais
            const isDicas = tipos.includes('Dicas');
            const isRanking = tipos.includes('Ranking');
            const isHotel = tipos.includes('Hotel') || conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem') || conteudoLower.includes('resort');
            const isCarro = conteudoLower.includes('locação') || conteudoLower.includes('locacao') || 
                           conteudoLower.includes('retirada') && conteudoLower.includes('devolução') ||
                           conteudoLower.includes('dollar') || conteudoLower.includes('hertz') || 
                           conteudoLower.includes('avis') || conteudoLower.includes('categoria economico');

            // 4.4 - Análise de Conteúdo
            const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo') || 
                            conteudoLower.includes(' ida ') || conteudoLower.includes('volta') ||
                            conteudoLower.includes('aeroporto') || conteudoLower.includes('embarque');
            const isPacote = isHotel && temAereo;
            const temPreco = conteudoLower.includes('r$');
            const linkMatch = conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/[^\s]+/g);
            const linksCVC = linkMatch ? linkMatch : [];
            
            // Detecções específicas
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
            console.log('🔍 Análise do conteúdo:');
            console.log('- Destino:', destinoFinal || 'NÃO IDENTIFICADO');
            console.log('- Passageiros:', infoPassageiros || 'NÃO IDENTIFICADO');
            console.log('- É Dicas?', isDicas);
            console.log('- É Ranking?', isRanking);
            console.log('- É Hotel?', isHotel);
            console.log('- É Carro?', isCarro);
            console.log('- É Pacote?', isPacote);
            console.log('- É Multitrecho?', isMultitrecho);
            console.log('- É Cruzeiro?', isCruzeiro);
            console.log('- Somente Ida?', isSomenteIda);
            console.log('- Múltiplas Opções?', temMultiplasOpcoes);
            console.log('- Tem preço?', temPreco);
            console.log('- Tem parcelamento?', temInfoParcelamento);
            console.log('- Links encontrados:', linksCVC.length);

            // ================================================================================
            // 5. 📝 PROMPTS ESPECIALIZADOS
            // ================================================================================

            let prompt = '';
            const templatesString = JSON.stringify(TEMPLATES, null, 2);
            const tabelaAeroportos = Object.entries(AEROPORTOS)
                .map(([codigo, nome]) => `${codigo} → ${nome}`)
                .join('\n');

            // 5.1 - Prompt para Dicas
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

            // 5.2 - Prompt para Ranking
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

            // 5.3 - Prompt para Locação de Carro
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
    'Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ X + 9x de R$ Y s/ juros' :
    `${numParcelas}x de R$ X s/ juros no cartão`}` : 
  'NÃO incluir parcelamento'}

Termine com "Valores sujeitos a confirmação e disponibilidade"`;

            // 5.4 - Prompt para Hotéis
            } else if (isHotel && !temAereo) {
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}
${destinoFinal ? `Destino: ${destinoFinal}` : ''}
${infoPassageiros ? `Passageiros: ${infoPassageiros}` : ''}

DETECTADO: HOTÉIS (sem aéreo)

Use o template 'hoteis_multiplas_opcoes'.

IMPORTANTE:
- ORDENAR do MAIS BARATO para o MAIS CARO
- Se houver "Preferencial", destacar com ⭐
- Se houver Resort Fee, mencionar como ⚠️
- Se houver desconto, mostrar: De ~~R$ X~~ por R$ Y

${temInfoParcelamento ? 
  `Incluir parcelamento: ${tipoParcelamento === 'parcela_diferenciada' ? 
    'Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ X + 9x de R$ Y s/ juros' :
    `${numParcelas}x de R$ X s/ juros no cartão`}` : 
  'NÃO incluir parcelamento'}

${linksCVC.length > 0 ? `Incluir links: ${linksCVC.join(', ')}` : 'NÃO incluir links'}

Termine com "Valores sujeitos a confirmação e disponibilidade"`;

            // 5.5 - Prompt para Cruzeiro
            } else if (isCruzeiro) {
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}

DETECTADO: CRUZEIRO

Use o template 'cruzeiro'.
Extraia todas as informações sobre o navio, roteiro, cabines.

Termine com a mensagem padrão do template.`;

            // 5.6 - Prompt para Multitrecho
            } else if (isMultitrecho) {
                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS FORNECIDOS:
${conteudoPrincipal}

DETECTADO: MULTITRECHO

ANALISE se há múltiplas opções do mesmo roteiro ou multitrecho único.

SE MÚLTIPLAS OPÇÕES (mesmo roteiro, preços diferentes):
Formato compacto com valores separados.

SE MULTITRECHO ÚNICO:
Use o template 'multitrecho'.

CONVERSÕES OBRIGATÓRIAS:
${tabelaAeroportos}

REGRAS:
- NÃO repetir companhia entre trechos
- Usar -- apenas entre ida/volta
- Converter TODOS os códigos de aeroportos
- ${!temInfoParcelamento ? 'NÃO incluir parcelamento' : 'Incluir parcelamento conforme fornecido'}
- ${linksCVC.length === 0 ? 'NÃO incluir links' : `Incluir links: ${linksCVC.join(', ')}`}

Termine com "Valores sujeitos a confirmação e disponibilidade"`;

            // 5.7 - Prompt Principal para Orçamentos
            } else {
                // Determinar qual template usar
                let templateEspecifico = '';
                if (isPacote) {
                    templateEspecifico = 'pacote_completo';
                } else if (isSomenteIda) {
                    templateEspecifico = 'aereo_somente_ida';
                } else if (temMultiplasOpcoes && !isMultitrecho) {
                    templateEspecifico = 'multiplas_opcoes_2 ou multiplas_companhias';
                } else {
                    templateEspecifico = 'aereo_ida_volta ou aereo_conexao_detalhada';
                }

                prompt = `TEMPLATES DISPONÍVEIS:
${templatesString}

DADOS DO CLIENTE:
${conteudoPrincipal}

ANÁLISE:
- Destino: ${destinoFinal || 'EXTRAIR DO CONTEÚDO - NÃO INVENTAR'}
- Passageiros: ${infoPassageiros || 'EXTRAIR DO CONTEÚDO'}
- É Pacote? ${isPacote}
- É Multitrecho? ${isMultitrecho}
- Somente Ida? ${isSomenteIda}
- Múltiplas Opções? ${temMultiplasOpcoes}
- Tem preço? ${temPreco}

TEMPLATE SUGERIDO: ${templateEspecifico}

CONVERSÕES OBRIGATÓRIAS:
${tabelaAeroportos}

REGRAS CRÍTICAS:
1. Use o template EXATO correspondente
2. Converta TODOS os códigos de aeroportos
3. ${!destinoFinal ? 'EXTRAIR destino do conteúdo, NUNCA inventar' : `Usar destino: ${destinoFinal}`}
4. ${!temPreco ? 'NÃO incluir linha de valor' : 'Incluir valores conforme fornecido'}
5. ${!temInfoParcelamento ? 'NÃO incluir parcelamento' :
     tipoParcelamento === 'parcela_diferenciada' ? 
     'Parcelamento: "Parcelamento em até 10x sem juros no cartão, sendo a primeira parcela de R$ X + 9x de R$ Y s/ juros"' :
     `Parcelamento: "${numParcelas}x de R$ X s/ juros no cartão"`}
6. ${linksCVC.length === 0 ? 'NÃO incluir links' : `Incluir links: ${linksCVC.join(', ')}`}

FORMATO:
- Título com cidades (não aeroportos)
- Datas: DD/MM
- Horários: HH:MM
- Passageiros com zero à esquerda (01, 02)
- NUNCA inventar informações

Termine com "Valores sujeitos a confirmação e disponibilidade"`;
            }

            // ================================================================================
            // 6. 🤖 PROCESSAMENTO COM IA
            // ================================================================================

            let resultado = '';
            let iaUsada = 'gpt-4o-mini';

            // Decisão de IA (Claude vs GPT)
            const usarClaude = imagemBase64 || arquivoBase64 || temImagem ||
                              (conteudoPrincipal.length > 2000) ||
                              isPacote || isMultitrecho || isCruzeiro;

            console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');

            // Processamento com Claude
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🤖 Usando Claude 3 Haiku...');
                iaUsada = 'claude-3-haiku';
                
                const messages = [{
                    role: 'user',
                    content: (imagemBase64 || arquivoBase64) ? [
                        { type: 'text', text: prompt },
                        { 
                            type: 'image', 
                            source: {
                                type: 'base64',
                                media_type: (imagemBase64 || arquivoBase64).split(';')[0].split(':')[1],
                                data: (imagemBase64 || arquivoBase64).split(',')[1]
                            }
                        }
                    ] : prompt
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
                        system: 'Você é um assistente da CVC Itaqua. Siga EXATAMENTE os templates fornecidos. NUNCA invente informações. Sempre converta códigos de aeroportos. Use o formato correto para WhatsApp.'
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
            // Processamento com GPT
            else {
                console.log('🤖 Usando GPT-4o-mini...');
                
                const OPENAI_KEY = process.env.OPENAI_API_KEY;
                if (!OPENAI_KEY) {
                    throw new Error('OpenAI API key não configurada.');
                }
                
                const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENAI_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { 
                                role: 'system', 
                                content: 'Você é um assistente da CVC Itaqua. Siga EXATAMENTE os templates fornecidos. NUNCA invente informações. Sempre converta códigos de aeroportos usando a tabela fornecida. Use o formato correto para WhatsApp.'
                            },
                            { role: 'user', content: prompt }
                        ],
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
            
            console.log('✅ Processamento concluído v7.9');
            
            // Determinar tipo detectado
            let tipoDetectado = 'orcamento';
            if (isDicas) tipoDetectado = 'dicas';
            else if (isRanking) tipoDetectado = 'ranking';
            else if (isCarro) tipoDetectado = 'locacao_carro';
            else if (isCruzeiro) tipoDetectado = 'cruzeiro';
            else if (isHotel && !temAereo) tipoDetectado = 'hoteis';
            else if (isPacote) tipoDetectado = 'pacote';
            else if (isMultitrecho) tipoDetectado = 'multitrecho';
            else if (isSomenteIda) tipoDetectado = 'somente_ida';
            else if (temMultiplasOpcoes) tipoDetectado = 'multiplas_opcoes';

            return res.status(200).json({
                success: true,
                result: resultado,
                metadata: {
                    version: '7.9',
                    ia_usada: iaUsada,
                    tipo_detectado: tipoDetectado,
                    destino: destinoFinal,
                    passageiros: infoPassageiros,
                    tem_preco: temPreco,
                    tem_parcelamento: temInfoParcelamento,
                    tipo_parcelamento: tipoParcelamento,
                    num_parcelas: numParcelas,
                    links_detectados: linksCVC.length,
                    template_usado: tipoDetectado
                }
            });

        } catch (error) {
            console.error('❌ Erro no processamento:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Erro desconhecido no servidor',
                version: '7.9',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Método não suportado
    return res.status(405).json({
        success: false,
        error: 'Método não suportado. Use GET para status ou POST para processar.',
        version: '7.9'
    });
}
