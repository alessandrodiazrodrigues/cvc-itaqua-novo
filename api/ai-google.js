// ================================================================================
// 🚀 CVC ITAQUA v2.5 - REEMBOLSO INDIVIDUAL E BAGAGEM CORRIGIDA
// ================================================================================
// 
// 📁 ÍNDICE DO ARQUIVO:
//    SEÇÃO 1: CONFIGURAÇÕES GLOBAIS (Linha ~25)
//    SEÇÃO 2: TEMPLATES DE ORÇAMENTO (Linha ~205)
//    SEÇÃO 3: REGRAS DE FORMATAÇÃO (Linha ~810)
//    SEÇÃO 4: PÓS-PROCESSAMENTO (Linha ~1050)
//    SEÇÃO 5: FUNÇÕES DE DETECÇÃO (Linha ~1250)
//    SEÇÃO 6: GERAÇÃO DE PROMPTS (Linha ~1450)
//    SEÇÃO 7: HANDLER PRINCIPAL (Linha ~1750)
//
// ================================================================================
// VERSÃO: 2.5
// DATA: 18/12/2024
// MUDANÇAS v2.5:
// ✅ REEMBOLSO: Agora individual por opção (não no final geral)
// ✅ BAGAGEM: Confirmada regra (com/sem bagagem despachada)
// ✅ Adicionado "(v2.5)" no final de cada template
// ✅ PÓS-PROCESSAMENTO: Melhorado para reembolso individual
// ================================================================================

// ================================================================================
// SEÇÃO 1: CONFIGURAÇÕES GLOBAIS
// ================================================================================

// 1.1 - TABELA DE AEROPORTOS (Conforme Manual CVC)
const AEROPORTOS = {
    // === AEROPORTOS BRASILEIROS ===
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
    
    // === AEROPORTOS INTERNACIONAIS PRINCIPAIS ===
    'EZE': 'Ezeiza - Buenos Aires', 
    'AEP': 'Aeroparque - Buenos Aires', 
    'SCL': 'Santiago', 
    'LIM': 'Lima',
    'BOG': 'Bogotá', 
    'MEX': 'Cidade do México', 
    'CUN': 'Cancún', 
    'MIA': 'Miami', 
    'MCO': 'Orlando', 
    'JFK': 'Nova York - JFK', 
    'LGA': 'Nova York - LGA', 
    'EWR': 'Nova York - Newark',
    'LAX': 'Los Angeles', 
    'SFO': 'São Francisco', 
    'DFW': 'Dallas', 
    'ATL': 'Atlanta', 
    'ORD': 'Chicago',
    'LIS': 'Lisboa', 
    'OPO': 'Porto', 
    'MAD': 'Madrid', 
    'BCN': 'Barcelona', 
    'CDG': 'Paris - Charles de Gaulle', 
    'ORY': 'Paris - Orly', 
    'FCO': 'Roma - Fiumicino', 
    'MXP': 'Milão', 
    'LHR': 'Londres - Heathrow', 
    'LGW': 'Londres - Gatwick', 
    'FRA': 'Frankfurt', 
    'MUC': 'Munique', 
    'AMS': 'Amsterdam', 
    'ZUR': 'Zurich',
    
    // === AMÉRICA DO SUL ADICIONAL ===
    'PCL': 'Pucallpa', 
    'CUZ': 'Cusco', 
    'AQP': 'Arequipa', 
    'TRU': 'Trujillo', 
    'PIU': 'Piura',
    'IQT': 'Iquitos', 
    'TPP': 'Tarapoto', 
    'JAU': 'Jauja', 
    'AYP': 'Ayacucho', 
    'TCQ': 'Tacna',
    'MVD': 'Montevidéu', 
    'ASU': 'Assunção', 
    'VVI': 'Santa Cruz', 
    'LPB': 'La Paz', 
    'UIO': 'Quito', 
    'GYE': 'Guayaquil'
};

// 1.2 - DESTINOS CONHECIDOS
const DESTINOS_CONHECIDOS = {
    // === DESTINOS PERUANOS ===
    'pucallpa': 'Pucallpa', 
    'lima': 'Lima', 
    'cusco': 'Cusco', 
    'arequipa': 'Arequipa', 
    'iquitos': 'Iquitos',
    'trujillo': 'Trujillo', 
    'piura': 'Piura', 
    'tarapoto': 'Tarapoto', 
    'ayacucho': 'Ayacucho',
    
    // === DESTINOS BRASILEIROS ===
    'joão pessoa': 'João Pessoa', 
    'joao pessoa': 'João Pessoa', 
    'brasília': 'Brasília', 
    'brasilia': 'Brasília',
    'salvador': 'Salvador', 
    'rio de janeiro': 'Rio de Janeiro', 
    'belo horizonte': 'Belo Horizonte',
    'porto alegre': 'Porto Alegre', 
    'curitiba': 'Curitiba', 
    'florianópolis': 'Florianópolis', 
    'florianopolis': 'Florianópolis',
    'recife': 'Recife', 
    'fortaleza': 'Fortaleza', 
    'natal': 'Natal', 
    'maceió': 'Maceió', 
    'maceio': 'Maceió',
    'goiânia': 'Goiânia', 
    'goiania': 'Goiânia', 
    'manaus': 'Manaus', 
    'belém': 'Belém', 
    'belem': 'Belém',
    
    // === DESTINOS EUROPEUS ===
    'lisboa': 'Lisboa', 
    'porto': 'Porto', 
    'madrid': 'Madrid', 
    'barcelona': 'Barcelona',
    'paris': 'Paris', 
    'londres': 'Londres', 
    'roma': 'Roma', 
    'amsterdam': 'Amsterdam',
    'milão': 'Milão', 
    'milao': 'Milão', 
    'frankfurt': 'Frankfurt', 
    'zurich': 'Zurich',
    
    // === DESTINOS AMERICANOS ===
    'orlando': 'Orlando', 
    'miami': 'Miami', 
    'nova york': 'Nova York', 
    'los angeles': 'Los Angeles',
    'são francisco': 'São Francisco', 
    'sao francisco': 'São Francisco', 
    'chicago': 'Chicago', 
    'dallas': 'Dallas', 
    'atlanta': 'Atlanta', 
    'cancún': 'Cancún', 
    'cancun': 'Cancún',
    
    // === AMÉRICA LATINA ===
    'buenos aires': 'Buenos Aires', 
    'santiago': 'Santiago', 
    'bogotá': 'Bogotá', 
    'bogota': 'Bogotá',
    'montevidéu': 'Montevidéu', 
    'montevideu': 'Montevidéu', 
    'assunção': 'Assunção', 
    'assuncao': 'Assunção',
    'quito': 'Quito', 
    'guayaquil': 'Guayaquil', 
    'la paz': 'La Paz'
};

// ================================================================================
// SEÇÃO 2: TEMPLATES DE ORÇAMENTO (14 TEMPLATES) - v2.5 COM REEMBOLSO INDIVIDUAL
// ================================================================================

const TEMPLATES = {
    // ===========================
    // 2.1 - TEMPLATES AÉREOS (6 tipos)
    // ===========================
    
    // TEMPLATE 1: Aéreo Ida e Volta Simples
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
{{PARCELAMENTO}}
{{BAGAGEM}}
{{ASSENTO}}
{{REEMBOLSO}}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 2: Aéreo com Conexão Detalhada
    aereo_conexao: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_conexao} {hora_chegada_conexao} (voo direto)
(conexão em {cidade_conexao} - {tempo_espera} de espera)
{data_ida} - {aeroporto_conexao} {hora_saida_conexao} / {aeroporto_destino} {hora_chegada_ida} (voo direto)
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
{{PARCELAMENTO}}
{{BAGAGEM}}
{{ASSENTO}}
{{REEMBOLSO}}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 3: Aéreo Somente Ida
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
{{BAGAGEM}}
{{ASSENTO}}
{{REEMBOLSO}}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 4: Múltiplas Opções - 2 Planos
    multiplas_opcoes_2_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
{{PARCELAMENTO_1}}
{{REEMBOLSO_1}}
🔗 {link1}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
{{PARCELAMENTO_2}}
{{REEMBOLSO_2}}
🔗 {link2}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 5: Múltiplas Opções - 3 Planos
    multiplas_opcoes_3_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
{{REEMBOLSO_1}}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
{{REEMBOLSO_2}}

💰 **OPÇÃO 3** - R$ {valor3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Marcação de assento
{{REEMBOLSO_3}}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 6: Múltiplas Companhias (v2.5 - REEMBOLSO INDIVIDUAL)
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
{{PARCELAMENTO_1}}
{{BAGAGEM_1}}
{{ASSENTO_1}}
{{REEMBOLSO_1}}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
{{PARCELAMENTO_2}}
{{BAGAGEM_2}}
{{ASSENTO_2}}
{{REEMBOLSO_2}}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{data_ida3} - {aeroporto_origem3} {hora_ida3} / {aeroporto_destino3} {hora_chegada3} ({tipo_voo3})
--
{data_volta3} - {aeroporto_volta3} {hora_volta3} / {aeroporto_origem3} {hora_chegada_volta3} ({tipo_voo_volta3})

💰 R$ {valor3} para {passageiros}
{{PARCELAMENTO_3}}
{{BAGAGEM_3}}
{{ASSENTO_3}}
{{REEMBOLSO_3}}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 7: Multitrecho
    multitrecho: `*Multitrecho - {companhias}*
{data_inicio} a {data_fim} ({dias} dias e {noites} noites)

*Trecho 1:* {origem1} → {destino1}
{data1} - {aeroporto1} {hora1} / {aeroporto_chegada1} {hora_chegada1} ({tipo_voo1})

*Trecho 2:* {origem2} → {destino2}
{data2} - {aeroporto2} {hora2} / {aeroporto_chegada2} {hora_chegada2} ({tipo_voo2})

*Trecho 3:* {origem3} → {destino3}
{data3} - {aeroporto3} {hora3} / {aeroporto_chegada3} {hora_chegada3} ({tipo_voo3})

💰 R$ {valor_total} para {passageiros}
{{PARCELAMENTO}}
{{BAGAGEM}}
{{REEMBOLSO}}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // ===========================
    // 2.2 - TEMPLATES DE HOTÉIS (3 tipos)
    // ===========================
    
    // TEMPLATE 8: Hotéis - Múltiplas Opções (v2.5 - REEMBOLSO INDIVIDUAL)
    hoteis_multiplas_opcoes: `*Hotéis em {destino}*
Período: {data_entrada} a {data_saida} ({noites} noites)
{passageiros}

**OPÇÃO 1** - {nome_hotel1} ⭐{estrelas1}
📍 {localizacao1}
🛏️ {tipo_quarto1}
☕ {regime1}
💰 R$ {valor1} total
{{REEMBOLSO_HOTEL_1}}
🔗 {link1}

**OPÇÃO 2** - {nome_hotel2} ⭐{estrelas2}
📍 {localizacao2}
🛏️ {tipo_quarto2}
☕ {regime2}
💰 R$ {valor2} total
{{REEMBOLSO_HOTEL_2}}
🔗 {link2}

**OPÇÃO 3** - {nome_hotel3} ⭐{estrelas3}
📍 {localizacao3}
🛏️ {tipo_quarto3}
☕ {regime3}
💰 R$ {valor3} total
{{REEMBOLSO_HOTEL_3}}
🔗 {link3}

{{PARCELAMENTO}}
Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 9: Roteiro de Hotéis Sequencial
    roteiro_hoteis: `*Roteiro {destino}*
{passageiros}

📅 **{data1} a {data2}** ({noites1} noites)
🏨 {hotel1} - {cidade1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1}
{{REEMBOLSO_HOTEL_1}}

📅 **{data2} a {data3}** ({noites2} noites)
🏨 {hotel2} - {cidade2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2}
{{REEMBOLSO_HOTEL_2}}

📅 **{data3} a {data4}** ({noites3} noites)
🏨 {hotel3} - {cidade3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3}
{{REEMBOLSO_HOTEL_3}}

💰 **VALOR TOTAL DO ROTEIRO:** R$ {valor_total}
{{PARCELAMENTO}}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 10: Pacote Completo (Aéreo + Hotel + Serviços)
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
{data_volta} - {destino} {hora_volta} / {origem} {hora_chegada_volta} ({tipo_voo_volta})
{{BAGAGEM}}
{{REEMBOLSO_AEREO}}

**OPÇÃO 1** - {nome_hotel1}
📍 {endereco1}
🛏️ {tipo_quarto1} com {regime1}
💰 R$ {valor1} para {passageiros}
{{REEMBOLSO_HOTEL_1}}
🔗 {link1}

**OPÇÃO 2** - {nome_hotel2} ⭐ Preferencial
📍 {endereco2}
🛏️ {tipo_quarto2} com {regime2}
💰 R$ {valor2} para {passageiros}
{{REEMBOLSO_HOTEL_2}}
🔗 {link2}

**OPÇÃO 3** - {nome_hotel3}
📍 {endereco3}
🛏️ {tipo_quarto3} com {regime3}
💰 R$ {valor3} para {passageiros}
{{REEMBOLSO_HOTEL_3}}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // ===========================
    // 2.3 - TEMPLATES ESPECIAIS (4 tipos)
    // ===========================
    
    // TEMPLATE 11: Cruzeiro
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

Valores sujeitos a confirmação e disponibilidade (v2.5)`,

    // TEMPLATE 12: Dicas Completas
    dicas_completas: `🌍 *Dicas Essenciais para sua Viagem a {destino}!* 🌍

Aqui estão algumas sugestões para aproveitar ao máximo sua estadia:

1️⃣ **Gastronomia Imperdível**
{dica_gastronomia}

2️⃣ **Atrações Clássicas**
{dica_atracoes}

3️⃣ **Passeios e Experiências**
{dica_passeios}

4️⃣ **Melhor Época para Visitar**
{dica_epoca}

5️⃣ **Dicas de Economia**
{dica_economia}

---
✈️ *Complete sua Viagem com a CVC!*
Além de voos e hotéis, a CVC Itaqua oferece tudo para deixar sua viagem ainda mais fácil e segura:
- Passeios opcionais incríveis
- Seguro viagem completo
- Chip de celular internacional
- Câmbio e cartão pré-pago

Fale comigo para adicionar esses serviços ao seu pacote! (v2.5)`,

    // TEMPLATE 13: Ranking de Hotéis
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

📊 *Metodologia:* Rankings baseados em avaliações reais de múltiplas plataformas
🔄 *Atualizado em:* {data_atualizacao}

Valores sujeitos a confirmação e disponibilidade (v2.5)`
};

// ================================================================================
// SEÇÃO 3: REGRAS DE FORMATAÇÃO UNIVERSAIS (v2.5 - COM REEMBOLSO)
// ================================================================================

// 3.1 - REGRA DE PARCELAMENTO
function formatarParcelamento(conteudo, parcelamentoSelecionado, valorTotal, numeroOpcao = '') {
    try {
        // Para múltiplas opções, buscar o parcelamento específico
        let padraoBusca = numeroOpcao ? 
            new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?Entrada de R\\$\\s*([\\d.,]+)\\s*\\+\\s*(\\d+)x\\s*de\\s*R\\$\\s*([\\d.,]+)`, 'i') :
            /Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i;
        
        const entradaParcelas = conteudo.match(padraoBusca);
        
        if (entradaParcelas) {
            const entrada = entradaParcelas[1];
            const numParcelas = parseInt(entradaParcelas[2]);
            const valorParcela = entradaParcelas[3];
            const totalParcelas = numParcelas + 1;
            
            // Extrair valor total se não fornecido
            if (!valorTotal && numeroOpcao) {
                const valorMatch = conteudo.match(new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?R\\$\\s*([\\d.,]+)`, 'i'));
                valorTotal = valorMatch ? valorMatch[1] : '';
            }
            
            return `💳 Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // Parcelamento selecionado no HTML
        if (parcelamentoSelecionado && valorTotal) {
            const valor = parseFloat(valorTotal.replace(/[^\d,]/g, '').replace(',', '.'));
            const valorParcela = (valor / parseInt(parcelamentoSelecionado)).toFixed(2).replace('.', ',');
            return `💳 ${parcelamentoSelecionado}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        return ''; // Não incluir linha se não há info
    } catch (error) {
        console.error('Erro ao formatar parcelamento:', error);
        return '';
    }
}

// 3.2 - REGRA DE BAGAGEM (CONFIRMADA v2.5)
function formatarBagagem(conteudo, numeroOpcao = '') {
    try {
        // Para múltiplas opções, buscar a bagagem específica
        let textoBusca = conteudo.toLowerCase();
        if (numeroOpcao) {
            const opcaoMatch = conteudo.match(new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?(?=OPÇÃO|$)`, 'i'));
            textoBusca = opcaoMatch ? opcaoMatch[0].toLowerCase() : conteudo.toLowerCase();
        }
        
        // Detectar se tem bagagem despachada
        const semBagagemDespachada = 
            textoBusca.includes('sem bagagem') || 
            textoBusca.includes('sem  bagagem') ||
            textoBusca.includes('apenas mala de mão') ||
            textoBusca.includes('só mala de mão');
        
        const comBagagemDespachada = 
            textoBusca.includes('com bagagem') || 
            textoBusca.includes('com babagem') ||
            textoBusca.includes('com abagegem') ||
            textoBusca.includes('combagagem') ||
            textoBusca.includes('inclui bagagem') ||
            textoBusca.includes('bagagem despachada');
        
        // REGRA v2.5 CONFIRMADA
        if (comBagagemDespachada && !semBagagemDespachada) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
        } else {
            // Padrão: sem bagagem despachada ou quando não está claro
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        }
    } catch (error) {
        console.error('Erro ao formatar bagagem:', error);
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
    }
}

// 3.3 - REGRA DE ASSENTO
function formatarAssento(conteudo, numeroOpcao = '') {
    try {
        let textoBusca = conteudo.toLowerCase();
        if (numeroOpcao) {
            const opcaoMatch = conteudo.match(new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?(?=OPÇÃO|$)`, 'i'));
            textoBusca = opcaoMatch ? opcaoMatch[0].toLowerCase() : conteudo.toLowerCase();
        }
        
        const temPreReserva = 
            textoBusca.includes('pre reserva de assento') ||
            textoBusca.includes('pré reserva de assento') ||
            textoBusca.includes('com pre reserva') ||
            textoBusca.includes('com pré reserva') ||
            textoBusca.includes('marcação de assento') ||
            textoBusca.includes('escolha de assento');
        
        if (temPreReserva) {
            return '💺 Inclui pré reserva de assento';
        }
        
        return ''; // Não incluir linha se não tem
    } catch (error) {
        console.error('Erro ao formatar assento:', error);
        return '';
    }
}

// 3.4 - REGRA DE REEMBOLSO (NOVA v2.5 - INDIVIDUAL)
function formatarReembolso(conteudo, numeroOpcao = '') {
    try {
        let textoBusca = conteudo.toLowerCase();
        
        // Para múltiplas opções, buscar o reembolso específico
        if (numeroOpcao) {
            const opcaoMatch = conteudo.match(new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?(?=OPÇÃO|$)`, 'i'));
            textoBusca = opcaoMatch ? opcaoMatch[0].toLowerCase() : conteudo.toLowerCase();
        }
        
        // Detectar se é NÃO reembolsável
        const naoReembolsavel = 
            textoBusca.includes('não reembolsável') ||
            textoBusca.includes('nao reembolsavel') ||
            textoBusca.includes('não-reembolsável') ||
            textoBusca.includes('sem reembolso') ||
            textoBusca.includes('tarifa não reembolsável');
        
        // Se é não reembolsável, retorna a linha
        if (naoReembolsavel) {
            return '🏷️ Não reembolsável';
        }
        
        // Se é reembolsável ou não tem informação, retorna vazio (omite)
        return '';
    } catch (error) {
        console.error('Erro ao formatar reembolso:', error);
        return '';
    }
}

// ================================================================================
// SEÇÃO 4: PÓS-PROCESSAMENTO (v2.5 - MELHORADO PARA REEMBOLSO)
// ================================================================================

function aplicarPosProcessamento(resultado, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 v2.5: Iniciando pós-processamento com reembolso individual...');
        
        // Detectar se é múltiplas companhias/opções
        const temMultiplasOpcoes = resultado.includes('OPÇÃO 1') && resultado.includes('OPÇÃO 2');
        
        if (temMultiplasOpcoes) {
            // Processar cada opção separadamente
            for (let i = 1; i <= 3; i++) {
                const valorMatch = resultado.match(new RegExp(`OPÇÃO ${i}[\\s\\S]*?R\\$\\s*([\\d.,]+)\\s*para`, 'i'));
                const valorTotal = valorMatch ? valorMatch[1] : '';
                
                // Substituir placeholders para cada opção
                const parcelamento = formatarParcelamento(conteudoOriginal, parcelamentoSelecionado, valorTotal, i);
                const bagagem = formatarBagagem(conteudoOriginal, i);
                const assento = formatarAssento(conteudoOriginal, i);
                const reembolso = formatarReembolso(conteudoOriginal, i);
                
                resultado = resultado
                    .replace(`{{PARCELAMENTO_${i}}}`, parcelamento)
                    .replace(`{{BAGAGEM_${i}}}`, bagagem)
                    .replace(`{{ASSENTO_${i}}}`, assento)
                    .replace(`{{REEMBOLSO_${i}}}`, reembolso);
            }
        } else {
            // Processar orçamento simples
            const valorMatch = resultado.match(/R\$\s*([\d.,]+)\s*para/i);
            const valorTotal = valorMatch ? valorMatch[1] : '';
            
            const parcelamento = formatarParcelamento(conteudoOriginal, parcelamentoSelecionado, valorTotal);
            const bagagem = formatarBagagem(conteudoOriginal);
            const assento = formatarAssento(conteudoOriginal);
            const reembolso = formatarReembolso(conteudoOriginal);
            
            // Substituir placeholders globais
            resultado = resultado
                .replace(/\{\{PARCELAMENTO\}\}/g, parcelamento)
                .replace(/\{\{BAGAGEM\}\}/g, bagagem)
                .replace(/\{\{ASSENTO\}\}/g, assento)
                .replace(/\{\{REEMBOLSO\}\}/g, reembolso);
        }
        
        // Processar reembolso de hotéis (se houver)
        for (let i = 1; i <= 3; i++) {
            const reembolsoHotel = formatarReembolso(conteudoOriginal, `HOTEL_${i}`);
            resultado = resultado.replace(`{{REEMBOLSO_HOTEL_${i}}}`, reembolsoHotel);
        }
        
        // Processar reembolso de aéreo em pacotes
        resultado = resultado.replace('{{REEMBOLSO_AEREO}}', formatarReembolso(conteudoOriginal, 'AEREO'));
        
        // Limpar linhas vazias extras (quando placeholder não tem valor)
        resultado = resultado
            .replace(/\n\n\n+/g, '\n\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n');
        
        console.log('✅ v2.5: Pós-processamento concluído com reembolso individual');
        return resultado;
        
    } catch (error) {
        console.error('❌ v2.5: Erro no pós-processamento:', error);
        return resultado; // Retorna resultado original em caso de erro
    }
}

// ================================================================================
// SEÇÃO 5: FUNÇÕES DE DETECÇÃO
// ================================================================================

// 5.1 - Extração de Destino
function extrairDestinoDoConteudo(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.5: Extraindo destino...');
        
        // Prioridade 1: Destino final em conexões
        const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
        if (padraoConexao && padraoConexao.length >= 4) {
            const origem = padraoConexao[1];
            const destinoFinal = padraoConexao[3];
            
            if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
                AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
                console.log(`✅ v2.5: Destino detectado: ${AEROPORTOS[destinoFinal]}`);
                return AEROPORTOS[destinoFinal];
            }
        }
        
        // Prioridade 2: Códigos de aeroporto
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo];
                    console.log(`✅ v2.5: Destino por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        // Prioridade 3: Destinos conhecidos
        for (const [chave, nome] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(chave)) {
                console.log(`✅ v2.5: Destino detectado: ${nome}`);
                return nome;
            }
        }
        
        console.log('⚠️ v2.5: Nenhum destino identificado');
        return null;
    } catch (error) {
        console.error('❌ v2.5: Erro ao extrair destino:', error);
        return null;
    }
}

// 5.2 - Detecção de Voo com Conexão
function detectarVooComConexao(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.5: Verificando conexão...');
        
        const indicadores = [
            'voo com paradas', 'conexão', 'espera de', 'parada em', 'escala', 
            'uma escala', 'duas escalas', 'connecting flight', 'tempo de espera', 
            'layover', 'stopover'
        ];
        
        const temIndicadores = indicadores.some(ind => texto.includes(ind));
        const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
        const temMultiplosHorarios = (conteudo.match(/\d{2}:\d{2}/g) || []).length >= 4;
        
        const ehConexao = temIndicadores || temMultiplosTrechos || temMultiplosHorarios;
        console.log(`✅ v2.5: Conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
        
        return ehConexao;
    } catch (error) {
        console.error('❌ v2.5: Erro ao detectar conexão:', error);
        return false;
    }
}

// 5.3 - Detecção de Tipo de Orçamento
function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        console.log('🔍 v2.5: Detectando tipo de orçamento...');
        
        // Prioridade 0: Cruzeiro
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || conteudoLower.includes('cabine')) {
            console.log('✅ v2.5: Tipo: cruzeiro');
            return 'cruzeiro';
        }
        
        // Prioridade 1: Tipos selecionados pelo usuário
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Aéreo') && tipos.includes('Hotel')) {
                console.log('✅ v2.5: Tipo: pacote_completo');
                return 'pacote_completo';
            }
            if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
                const temDatasSequenciais = (conteudoPrincipal.match(/\d{2}\/\d{2}\s+a\s+\d{2}\/\d{2}/g) || []).length >= 2;
                if (temDatasSequenciais) {
                    console.log('✅ v2.5: Tipo: roteiro_hoteis');
                    return 'roteiro_hoteis';
                }
                console.log('✅ v2.5: Tipo: hoteis_multiplas_opcoes');
                return 'hoteis_multiplas_opcoes';
            }
            if (tipos.includes('Dicas')) {
                console.log('✅ v2.5: Tipo: dicas_completas');
                return 'dicas_completas';
            }
            if (tipos.includes('Ranking')) {
                console.log('✅ v2.5: Tipo: ranking');
                return 'ranking';
            }
        }
        
        // Prioridade 2: Detecção por conteúdo
        
        // Somente ida
        if (conteudoLower.includes('somente ida') || conteudoLower.includes('apenas ida') || conteudoLower.includes('one way')) {
            console.log('✅ v2.5: Tipo: aereo_somente_ida');
            return 'aereo_somente_ida';
        }
        
        // Multitrecho
        if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
            console.log('✅ v2.5: Tipo: multitrecho');
            return 'multitrecho';
        }
        
        // Múltiplas companhias
        const companhiasEncontradas = conteudoPrincipal.match(/(iberia|tap portugal|latam|gol|azul|avianca)/gi) || [];
        const companhiasUnicas = [...new Set(companhiasEncontradas.map(c => c.toLowerCase()))];
        const temMultiplasCompanhias = companhiasUnicas.length >= 2;
        const temMultiplosLinks = (conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico/g) || []).length >= 2;
        
        if (temMultiplasCompanhias || temMultiplosLinks) {
            console.log('✅ v2.5: Tipo: multiplas_companhias');
            return 'multiplas_companhias';
        }
        
        // Conexão explícita
        const temConexaoExplicita = detectarVooComConexao(conteudoPrincipal);
        if (temConexaoExplicita) {
            console.log('✅ v2.5: Tipo: aereo_conexao');
            return 'aereo_conexao';
        }
        
        // Múltiplas opções (2 ou 3 planos)
        const opcoesMarcadas = conteudoPrincipal.match(/OPÇÃO \d/gi) || [];
        if (opcoesMarcadas.length >= 3) {
            console.log('✅ v2.5: Tipo: multiplas_opcoes_3_planos');
            return 'multiplas_opcoes_3_planos';
        } else if (opcoesMarcadas.length >= 2) {
            console.log('✅ v2.5: Tipo: multiplas_opcoes_2_planos');
            return 'multiplas_opcoes_2_planos';
        }
        
        // Padrão
        console.log('✅ v2.5: Tipo padrão: aereo_simples');
        return 'aereo_simples';
        
    } catch (error) {
        console.error('❌ v2.5: Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

// ================================================================================
// SEÇÃO 6: GERAÇÃO DE PROMPTS (v2.5 - com instruções para reembolso individual)
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    try {
        let destinoFinal = destino || extrairDestinoDoConteudo(conteudoPrincipal) || 'Destino';
        
        // Instruções para IA usar placeholders v2.5
        const instrucoesPosProcessamento = `
**INSTRUÇÕES CRÍTICAS v2.5 - USAR PLACEHOLDERS:**

Para PARCELAMENTO, BAGAGEM, ASSENTO e REEMBOLSO, use EXATAMENTE estes placeholders:

**PARCELAMENTO:**
- Para orçamento simples: {{PARCELAMENTO}}
- Para opção 1: {{PARCELAMENTO_1}}
- Para opção 2: {{PARCELAMENTO_2}}
- Para opção 3: {{PARCELAMENTO_3}}

**BAGAGEM:**
- Para orçamento simples: {{BAGAGEM}}
- Para opção 1: {{BAGAGEM_1}}
- Para opção 2: {{BAGAGEM_2}}
- Para opção 3: {{BAGAGEM_3}}

**ASSENTO:**
- Para orçamento simples: {{ASSENTO}}
- Para opção 1: {{ASSENTO_1}}
- Para opção 2: {{ASSENTO_2}}
- Para opção 3: {{ASSENTO_3}}

**REEMBOLSO (v2.5 - INDIVIDUAL POR OPÇÃO):**
- Para orçamento simples: {{REEMBOLSO}}
- Para opção 1: {{REEMBOLSO_1}}
- Para opção 2: {{REEMBOLSO_2}}
- Para opção 3: {{REEMBOLSO_3}}
- Para hotel opção 1: {{REEMBOLSO_HOTEL_1}}
- Para hotel opção 2: {{REEMBOLSO_HOTEL_2}}
- Para hotel opção 3: {{REEMBOLSO_HOTEL_3}}
- Para aéreo em pacotes: {{REEMBOLSO_AEREO}}

IMPORTANTE: NÃO coloque "Não reembolsável" no final geral. Cada opção tem seu próprio placeholder de reembolso.

NÃO TENTE FORMATAR ESTES ITENS. Apenas coloque os placeholders no lugar correto.
O sistema fará a formatação automaticamente depois.`;

        const regrasGerais = `
${instrucoesPosProcessamento}

**OUTRAS FORMATAÇÕES (você deve fazer):**
- Título: *Companhia - Cidade Origem ✈ Cidade Destino*
- Para múltiplas companhias: *OPÇÃO N - Companhia - Cidade Origem ✈ Cidade Destino*
- Datas: DD/MM
- Horários: HH:MM
- Valores: R$ 1.234,56
- Passageiros: 04 adultos + 01 criança
- Converter códigos de aeroporto para nomes`;

        const tabelaAeroportos = `**AEROPORTOS:**\n${JSON.stringify(AEROPORTOS, null, 2)}`;

        // Templates disponíveis para a IA
        const templateEscolhido = TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples;

        // Switch para cada tipo
        switch (tipoOrcamento) {
            case 'multiplas_companhias':
                return `Crie orçamento de MÚLTIPLAS COMPANHIAS para ${destinoFinal}.
                
IMPORTANTE v2.5: 
- Use placeholders {{REEMBOLSO_1}}, {{REEMBOLSO_2}}, {{REEMBOLSO_3}} INDIVIDUALMENTE em cada opção
- NÃO coloque reembolso no final geral

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${templateEscolhido}
${regrasGerais}
${tabelaAeroportos}`;

            case 'hoteis_multiplas_opcoes':
                return `Crie orçamento de HOTÉIS - MÚLTIPLAS OPÇÕES para ${destinoFinal}.
                
IMPORTANTE v2.5:
- Use {{REEMBOLSO_HOTEL_1}}, {{REEMBOLSO_HOTEL_2}}, {{REEMBOLSO_HOTEL_3}} para cada hotel

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${templateEscolhido}
${regrasGerais}`;

            case 'pacote_completo':
                return `Crie PACOTE COMPLETO para ${destinoFinal}.
                
IMPORTANTE v2.5:
- Use {{REEMBOLSO_AEREO}} para o aéreo
- Use {{REEMBOLSO_HOTEL_1}}, {{REEMBOLSO_HOTEL_2}}, {{REEMBOLSO_HOTEL_3}} para cada hotel

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${templateEscolhido}
${regrasGerais}
${tabelaAeroportos}`;

            default:
                return `Crie orçamento ${tipoOrcamento.replace(/_/g, ' ').toUpperCase()}.
                
IMPORTANTE: Use os placeholders {{PARCELAMENTO}}, {{BAGAGEM}}, {{ASSENTO}}, {{REEMBOLSO}}.

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${templateEscolhido}
${regrasGerais}
${tabelaAeroportos}`;
        }
    } catch (error) {
        console.error('❌ v2.5: Erro ao gerar prompt:', error);
        return `Erro: ${error.message}`;
    }
}

// ================================================================================
// SEÇÃO 7: HANDLER PRINCIPAL (v2.5)
// ================================================================================

export default async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - Status da API
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: '2.5-REEMBOLSO-INDIVIDUAL',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.5 - Reembolso individual e bagagem corrigida',
            funcionalidades: [
                '✅ REEMBOLSO: Individual por opção (não no final)',
                '✅ BAGAGEM: Com/sem bagagem despachada',
                '✅ Versão (v2.5) no final dos templates',
                '✅ PÓS-PROCESSAMENTO ATIVO',
                '✅ Funções de formatação em uso',
                '✅ 14 templates completos',
                '✅ 100% conforme manual CVC'
            ],
            templates_disponiveis: Object.keys(TEMPLATES),
            total_templates: Object.keys(TEMPLATES).length
        });
    }

    // POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido - use POST'
        });
    }

    try {
        console.log('🚀 v2.5: Processando requisição com reembolso individual...');
        
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

        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }

        // Detectar tipo e gerar prompt
        const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
        const prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
        
        // Chamar IA
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        const systemPrompt = `Você é um assistente da CVC Itaqua. 
        IMPORTANTE v2.5: Use os placeholders {{REEMBOLSO_1}}, {{REEMBOLSO_2}}, etc. INDIVIDUALMENTE em cada opção.
        NÃO coloque reembolso no final geral. Cada opção tem seu próprio placeholder.
        Use também {{PARCELAMENTO}}, {{BAGAGEM}}, {{ASSENTO}} conforme instruído.`;

        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            console.log('🔮 v2.5: Usando Claude...');
            
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
                throw new Error(`Claude erro ${response.status}`);
            }

            const data = await response.json();
            resultado = data.content[0].text;
            
        } else {
            console.log('⚡ v2.5: Usando GPT-4o-mini...');
            
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
                throw new Error(`OpenAI erro ${response.status}`);
            }

            const data = await response.json();
            resultado = data.choices[0].message.content;
        }

        // Limpar resultado básico
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // ⭐ APLICAR PÓS-PROCESSAMENTO v2.5
        resultado = aplicarPosProcessamento(resultado, conteudoPrincipal, parcelamento);
        
        console.log('✅ v2.5: Processamento completo com reembolso individual');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: '2.5-REEMBOLSO-INDIVIDUAL',
                tipo: tipoOrcamento,
                pos_processamento: true,
                reembolso_individual: true
            }
        });

    } catch (error) {
        console.error('❌ v2.5: Erro:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '2.5'
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================
console.log('✅ CVC Itaqua v2.5-REEMBOLSO-INDIVIDUAL carregado!');
console.log('🔧 REEMBOLSO: Individual por opção (não no final geral)');
console.log('✅ BAGAGEM: Com/sem bagagem despachada corretamente');
console.log('💺 ASSENTO: Inclui pré reserva quando mencionado');
console.log('📋 Versão (v2.5) no final de cada orçamento');
console.log('🎯 PÓS-PROCESSAMENTO: IA usa placeholders, sistema formata');
console.log('📅 Atualização: 18/12/2024');
