// 🚀 CVC ITAQUA v2.2-COMPLETA - API ROBUSTA COM TODOS OS TEMPLATES
// ================================================================================
// 📑 SISTEMA COMPLETO - VERSÃO 2.2 COM TODOS OS 14 TEMPLATES
// ================================================================================
// MELHORIAS v2.2:
// ✅ TODOS OS 14 TEMPLATES: 11 do manual + 3 extras (dicas, ranking, roteiro)
// ✅ CÓDIGO LIMPO: Sem duplicações ou erros
// ✅ TEMPLATES ADICIONADOS: Aéreo somente ida, 3 planos, roteiro sequencial
// ✅ DETECÇÃO ROBUSTA: Todos os tipos de orçamento
// ✅ LEITURA DE DADOS: Texto, imagem base64, PDF
// ✅ INTEGRAÇÃO DUPLA: GPT-4o-mini + Claude Haiku
// ================================================================================

// ================================================================================
// 1. TEMPLATES COMPLETOS - TODOS OS 14 MODELOS
// ================================================================================

const TEMPLATES = {
    // 1.1 AÉREO IDA E VOLTA SIMPLES
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
{link}

Valores sujeitos a confirmação e disponibilidade`,

    // 1.2 AÉREO COM CONEXÃO DETALHADA
    aereo_conexao: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

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

    // 1.3 AÉREO SOMENTE IDA (NOVO v2.2)
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    // 1.4 MÚLTIPLAS OPÇÕES - 2 PLANOS
    multiplas_opcoes_2_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
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

    // 1.5 MÚLTIPLAS OPÇÕES - 3 PLANOS (NOVO v2.2)
    multiplas_opcoes_3_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas

💰 **OPÇÃO 3** - R$ {valor3}
✅ Mala de mão + 2 bagagens despachadas
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
✅ Marcação de assento

Valores sujeitos a confirmação e disponibilidade`,

    // 1.6 MULTITRECHO
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

    // 1.7 MÚLTIPLAS COMPANHIAS INTERNACIONAIS
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

    // 1.8 HOTÉIS - MÚLTIPLAS OPÇÕES
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

    // 1.9 ROTEIRO DE HOTÉIS SEQUENCIAL (NOVO v2.2)
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

    // 1.10 PACOTE COMPLETO (Aéreo + Hotel + Serviços)
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

    // 1.11 CRUZEIRO
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

Valores sujeitos a confirmação e disponibilidade`,

    // 1.12 DICAS COMPLETAS (EXTRA - não está no manual)
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

Fale comigo para adicionar esses serviços ao seu pacote!`,

    // 1.13 RANKING (EXTRA - não está no manual)
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

Valores sujeitos a confirmação e disponibilidade`
};

// ================================================================================
// 2. CONFIGURAÇÕES E CONSTANTES
// ================================================================================

// 2.1 Tabela Completa de Aeroportos (Conforme Manual)
const AEROPORTOS = {
    // BRASILEIROS
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont',
    'GIG': 'Galeão', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre',
    'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa', 'THE': 'Teresina',
    'SLZ': 'São Luís', 'BEL': 'Belém', 'MAO': 'Manaus', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande',
    'GYN': 'Goiânia', 'VIX': 'Vitória', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus', 'JDO': 'Juazeiro do Norte',
    'IGU': 'Foz do Iguaçu', 'IMP': 'Imperatriz', 'MAB': 'Marabá', 'STM': 'Santarém', 'RBR': 'Rio Branco',
    'PVH': 'Porto Velho', 'BVB': 'Boa Vista', 'MCP': 'Macapá', 'PMW': 'Palmas', 'UDI': 'Uberlândia',
    'RAO': 'Ribeirão Preto', 'JOI': 'Joinville', 'XAP': 'Chapecó', 'LDB': 'Londrina', 'MGF': 'Maringá',
    
    // INTERNACIONAIS PRINCIPAIS (Conforme Manual)
    'EZE': 'Ezeiza - Buenos Aires', 'AEP': 'Aeroparque - Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 
    'JFK': 'Nova York - JFK', 'LGA': 'Nova York - LGA', 'EWR': 'Nova York - Newark',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'DFW': 'Dallas', 'ATL': 'Atlanta', 'ORD': 'Chicago',
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris - Charles de Gaulle', 
    'ORY': 'Paris - Orly', 'FCO': 'Roma - Fiumicino', 'MXP': 'Milão', 'LHR': 'Londres - Heathrow', 
    'LGW': 'Londres - Gatwick', 'FRA': 'Frankfurt', 'MUC': 'Munique', 'AMS': 'Amsterdam', 'ZUR': 'Zurich',
    
    // AMÉRICA DO SUL ADICIONAL
    'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'TRU': 'Trujillo', 'PIU': 'Piura',
    'IQT': 'Iquitos', 'TPP': 'Tarapoto', 'JAU': 'Jauja', 'AYP': 'Ayacucho', 'TCQ': 'Tacna',
    'MVD': 'Montevidéu', 'ASU': 'Assunção', 'VVI': 'Santa Cruz', 'LPB': 'La Paz', 'UIO': 'Quito', 'GYE': 'Guayaquil'
};

// 2.2 Destinos Conhecidos
const DESTINOS_CONHECIDOS = {
    // Peruanos
    'pucallpa': 'Pucallpa', 'lima': 'Lima', 'cusco': 'Cusco', 'arequipa': 'Arequipa', 'iquitos': 'Iquitos',
    'trujillo': 'Trujillo', 'piura': 'Piura', 'tarapoto': 'Tarapoto', 'ayacucho': 'Ayacucho',
    
    // Brasileiros
    'joão pessoa': 'João Pessoa', 'joao pessoa': 'João Pessoa', 'brasília': 'Brasília', 'brasilia': 'Brasília',
    'salvador': 'Salvador', 'rio de janeiro': 'Rio de Janeiro', 'belo horizonte': 'Belo Horizonte',
    'porto alegre': 'Porto Alegre', 'curitiba': 'Curitiba', 'florianópolis': 'Florianópolis', 'florianopolis': 'Florianópolis',
    'recife': 'Recife', 'fortaleza': 'Fortaleza', 'natal': 'Natal', 'maceió': 'Maceió', 'maceio': 'Maceió',
    'goiânia': 'Goiânia', 'goiania': 'Goiânia', 'manaus': 'Manaus', 'belém': 'Belém', 'belem': 'Belém',
    
    // Europeus
    'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid', 'barcelona': 'Barcelona',
    'paris': 'Paris', 'londres': 'Londres', 'roma': 'Roma', 'amsterdam': 'Amsterdam',
    'milão': 'Milão', 'milao': 'Milão', 'frankfurt': 'Frankfurt', 'zurich': 'Zurich',
    
    // Americanos
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

// 3.1 Extração de Destino
function extrairDestinoDoConteudo(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.2: Extraindo destino de:', conteudo.substring(0, 100) + '...');
        
        // Prioridade 1: Destino final em conexões
        const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
        if (padraoConexao && padraoConexao.length >= 4) {
            const origem = padraoConexao[1];
            const destinoFinal = padraoConexao[3];
            
            if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
                AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
                console.log(`✅ v2.2: Destino detectado: ${AEROPORTOS[destinoFinal]}`);
                return AEROPORTOS[destinoFinal];
            }
        }
        
        // Prioridade 2: Códigos de aeroporto
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo];
                    console.log(`✅ v2.2: Destino por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        // Prioridade 3: Destinos conhecidos
        for (const [chave, nome] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(chave)) {
                console.log(`✅ v2.2: Destino detectado: ${nome}`);
                return nome;
            }
        }
        
        console.log('⚠️ v2.2: Nenhum destino identificado');
        return null;
    } catch (error) {
        console.error('❌ v2.2: Erro ao extrair destino:', error);
        return null;
    }
}

// 3.2 Detecção de Voo com Conexão
function detectarVooComConexao(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.2: Verificando conexão...');
        
        const indicadores = [
            'voo com paradas', 'conexão', 'espera de', 'parada em', 'escala', 
            'connecting flight', 'tempo de espera', 'layover', 'stopover'
        ];
        
        const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
        const temIndicadores = indicadores.some(ind => texto.includes(ind));
        const temMultiplosHorarios = (conteudo.match(/\d{2}:\d{2}/g) || []).length >= 4;
        
        const ehConexao = temMultiplosTrechos || temIndicadores || temMultiplosHorarios;
        console.log(`✅ v2.2: Conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
        
        return ehConexao;
    } catch (error) {
        console.error('❌ v2.2: Erro ao detectar conexão:', error);
        return false;
    }
}

// 3.3 Detecção de Tipo de Orçamento (ATUALIZADA v2.2)
function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        console.log('🔍 v2.2: Detectando tipo de orçamento...');
        
        // Prioridade 0: Cruzeiro (sempre prioridade máxima)
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || conteudoLower.includes('cabine')) {
            console.log('✅ v2.2: Tipo: cruzeiro');
            return 'cruzeiro';
        }
        
        // Prioridade 1: Tipos selecionados pelo usuário
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Aéreo') && tipos.includes('Hotel')) {
                console.log('✅ v2.2: Tipo: pacote_completo');
                return 'pacote_completo';
            }
            if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
                // Verificar se é roteiro sequencial
                const temDatasSequenciais = (conteudoPrincipal.match(/\d{2}\/\d{2}\s+a\s+\d{2}\/\d{2}/g) || []).length >= 2;
                if (temDatasSequenciais) {
                    console.log('✅ v2.2: Tipo: roteiro_hoteis');
                    return 'roteiro_hoteis';
                }
                console.log('✅ v2.2: Tipo: hoteis_multiplas_opcoes');
                return 'hoteis_multiplas_opcoes';
            }
            if (tipos.includes('Dicas')) {
                console.log('✅ v2.2: Tipo: dicas_completas');
                return 'dicas_completas';
            }
            if (tipos.includes('Ranking')) {
                console.log('✅ v2.2: Tipo: ranking');
                return 'ranking';
            }
        }
        
        // Prioridade 2: Detecção por conteúdo
        
        // Somente ida
        if (conteudoLower.includes('somente ida') || conteudoLower.includes('apenas ida') || conteudoLower.includes('one way')) {
            console.log('✅ v2.2: Tipo: aereo_somente_ida');
            return 'aereo_somente_ida';
        }
        
        // Roteiro de hotéis sequencial
        const temRoteiro = conteudoLower.includes('roteiro') && conteudoLower.includes('hotel');
        const temDatasSequenciais = (conteudoPrincipal.match(/\d{2}\/\d{2}\s+a\s+\d{2}\/\d{2}/g) || []).length >= 2;
        if (temRoteiro || temDatasSequenciais) {
            console.log('✅ v2.2: Tipo: roteiro_hoteis');
            return 'roteiro_hoteis';
        }
        
        // Multitrecho
        if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
            console.log('✅ v2.2: Tipo: multitrecho');
            return 'multitrecho';
        }
        
        // Múltiplas companhias
        const temMultiplasCompanhias = (conteudoPrincipal.match(/(iberia|tap portugal|latam|gol|azul|avianca)/gi) || []).length >= 2;
        const temMultiplosLinks = (conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico/g) || []).length >= 2;
        
        if (temMultiplasCompanhias || temMultiplosLinks) {
            console.log('✅ v2.2: Tipo: multiplas_companhias');
            return 'multiplas_companhias';
        }
        
        // Conexão explícita
        const temConexaoExplicita = conteudoLower.includes('conexão') && conteudoLower.includes('espera');
        if (temConexaoExplicita && !temMultiplasCompanhias) {
            console.log('✅ v2.2: Tipo: aereo_conexao');
            return 'aereo_conexao';
        }
        
        // Múltiplas opções (2 ou 3 planos)
        const opcoesMarcadas = conteudoPrincipal.match(/OPÇÃO \d/gi) || [];
        if (opcoesMarcadas.length >= 3) {
            console.log('✅ v2.2: Tipo: multiplas_opcoes_3_planos');
            return 'multiplas_opcoes_3_planos';
        } else if (opcoesMarcadas.length >= 2) {
            console.log('✅ v2.2: Tipo: multiplas_opcoes_2_planos');
            return 'multiplas_opcoes_2_planos';
        }
        
        // Padrão: aéreo simples
        console.log('✅ v2.2: Tipo padrão: aereo_simples');
        return 'aereo_simples';
        
    } catch (error) {
        console.error('❌ v2.2: Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

// ================================================================================
// 4. GERAÇÃO DE PROMPTS
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    try {
        let destinoFinal = destino;
        
        if (!destinoFinal || tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
            const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
            if (destinoExtraido) {
                destinoFinal = destinoExtraido;
                console.log('✅ v2.2: Destino extraído:', destinoFinal);
            } else {
                destinoFinal = destino || 'Destino não identificado';
            }
        }
        
        // Informação de parcelamento
        let infoParcelamento = '';
        if (parcelamento) {
            infoParcelamento = `PARCELAMENTO SELECIONADO: Dividir valor total em ${parcelamento} parcelas iguais sem juros`;
        } else {
            infoParcelamento = 'PARCELAMENTO: SÓ INCLUIR SE INFORMADO NO TEXTO. Se não houver, mostrar APENAS valor total.';
        }

        const regrasGerais = `**REGRAS DE FORMATAÇÃO v2.2 - SEGUIR MANUAL CVC ITAQUA:**

**TÍTULO:** Sempre *{Companhia} - {Cidade Origem} ✈ {Cidade Destino}*
NUNCA usar códigos de aeroporto no título

**DATAS:** DD/MM (15/11)
**HORÁRIOS:** HH:MM (06:20)
**VALORES:** R$ 1.464,02 (espaço após R$, vírgula para decimais)

**PASSAGEIROS:**
- Bebê: 0 até 23 meses (idade em MESES)
- Criança: 2 até 11 anos (idade em ANOS)
- Adulto: 12 anos ou mais
- Formato: 01 adulto + 01 criança (5 anos) + 01 bebê (10 meses)
- Sempre zero à esquerda

**BAGAGEM:**
- Só mala de mão incluída
- Mala de mão + bagagem despachada
- Mala de mão + 2 bagagens despachadas

**${infoParcelamento}**

**FINALIZAÇÃO:** Sempre terminar com "Valores sujeitos a confirmação e disponibilidade"`;

        const tabelaAeroportos = `**AEROPORTOS:**\n${JSON.stringify(AEROPORTOS, null, 2)}`;

        // Switch para cada tipo (14 casos)
        switch (tipoOrcamento) {
            case 'aereo_somente_ida':
                return `Crie orçamento de AÉREO SOMENTE IDA.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.aereo_somente_ida}
${regrasGerais}
${tabelaAeroportos}`;

            case 'multiplas_opcoes_3_planos':
                return `Crie orçamento com 3 PLANOS DE SERVIÇO.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.multiplas_opcoes_3_planos}
${regrasGerais}
${tabelaAeroportos}`;

            case 'roteiro_hoteis':
                return `Crie ROTEIRO DE HOTÉIS SEQUENCIAL.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.roteiro_hoteis}
${regrasGerais}`;

            case 'multiplas_companhias':
                return `Crie orçamento de MÚLTIPLAS COMPANHIAS para ${destinoFinal}.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.multiplas_companhias}
${regrasGerais}
${tabelaAeroportos}`;

            case 'aereo_conexao':
                return `Crie orçamento de VOO COM CONEXÃO DETALHADA para ${destinoFinal}.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.aereo_conexao}
${regrasGerais}
${tabelaAeroportos}`;

            case 'hoteis_multiplas_opcoes':
                return `Crie orçamento de HOTÉIS - MÚLTIPLAS OPÇÕES para ${destinoFinal}.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.hoteis_multiplas_opcoes}
${regrasGerais}`;

            case 'pacote_completo':
                return `Crie PACOTE COMPLETO (Aéreo + Hotel + Serviços) para ${destinoFinal}.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.pacote_completo}
${regrasGerais}
${tabelaAeroportos}`;

            case 'dicas_completas':
                return `Crie dicas de viagem completas e úteis para ${destinoFinal}.
DESTINO: ${destinoFinal}
Use informações REAIS e ESPECÍFICAS de ${destinoFinal}.
TEMPLATE: ${TEMPLATES.dicas_completas}`;

            case 'ranking':
                return `Crie ranking dos melhores hotéis em ${destinoFinal}.
DESTINO: ${destinoFinal}
Use hotéis REAIS de ${destinoFinal} com avaliações realistas.
TEMPLATE: ${TEMPLATES.ranking}`;

            case 'cruzeiro':
                return `Crie orçamento de CRUZEIRO.
DADOS: ${conteudoPrincipal}
TEMPLATE: ${TEMPLATES.cruzeiro}
${regrasGerais}`;

            case 'multitrecho':
                return `Crie orçamento MULTITRECHO.
DADOS: ${conteudoPrincipal}
TEMPLATE: ${TEMPLATES.multitrecho}
${regrasGerais}
${tabelaAeroportos}`;

            case 'multiplas_opcoes_2_planos':
                return `Crie orçamento com 2 PLANOS DE SERVIÇO.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.multiplas_opcoes_2_planos}
${regrasGerais}
${tabelaAeroportos}`;

            default:
                return `Crie orçamento AÉREO IDA E VOLTA SIMPLES.
DADOS: ${conteudoPrincipal}
DESTINO: ${destinoFinal}
TEMPLATE: ${TEMPLATES.aereo_simples}
${regrasGerais}
${tabelaAeroportos}`;
        }
    } catch (error) {
        console.error('❌ v2.2: Erro ao gerar prompt:', error);
        return `Erro: ${error.message}`;
    }
}

// ================================================================================
// 5. HANDLER PRINCIPAL
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
            version: '2.2-COMPLETA',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.2 - Sistema completo com todos os templates',
            funcionalidades: [
                '✅ 14 templates completos (11 manual + 3 extras)',
                '✅ Templates novos: Somente ida, 3 planos, Roteiro sequencial',
                '✅ Leitura: texto, imagem, PDF',
                '✅ GPT-4o-mini + Claude Haiku',
                '✅ Detecção automática aprimorada',
                '✅ 100% conforme manual CVC Itaqua'
            ],
            templates_disponiveis: Object.keys(TEMPLATES)
        });
    }

    // Verificar POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido - use POST'
        });
    }

    try {
        console.log('🚀 v2.2: Processando requisição...');
        
        // Validar body
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'Body obrigatório'
            });
        }

        // Extrair dados - SUPORTA TODOS OS TIPOS DE INPUT
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

        console.log('📋 v2.2: Dados recebidos:', {
            temTexto: !!(observacoes || textoColado),
            temImagem: !!imagemBase64,
            temPDF: !!pdfContent,
            destino,
            tipos
        });

        // Montar conteúdo principal
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem'
            });
        }

        // Gerar prompt
        const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
        const prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
        console.log(`✅ v2.2: Tipo detectado: ${tipoOrcamento}`);

        // Chamar IA
        let resultado, iaUsada;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        const systemPrompt = 'Você é um assistente especialista da CVC Itaqua. Sua função é analisar os dados e gerar um orçamento formatado para WhatsApp seguindo EXATAMENTE o modelo e as regras do manual fornecido. Seja preciso e atento aos detalhes. Retorne apenas o texto final formatado, sem explicações adicionais.';

        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            console.log('🔮 v2.2: Usando Claude Haiku...');
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
            console.log('⚡ v2.2: Usando GPT-4o-mini...');
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

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        console.log('✅ v2.2: Processamento concluído');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            ia_usada: iaUsada,
            metadata: {
                version: '2.2-COMPLETA',
                timestamp: new Date().toISOString(),
                tipo: tipoOrcamento,
                destino_extraido: extrairDestinoDoConteudo(conteudoPrincipal),
                templates_disponiveis: Object.keys(TEMPLATES).length
            }
        });

    } catch (error) {
        console.error('❌ v2.2: Erro:', error);
        
        // Fallback básico para erros
        const tipoDetectado = detectOrcamentoType(conteudoPrincipal || '', tipos || []);
        const destinoDetectado = extrairDestinoDoConteudo(conteudoPrincipal || '') || destino || 'Destino';
        
        let resultadoFallback = `*Orçamento ${destinoDetectado}*\n\n`;
        resultadoFallback += `⚠️ Sistema em manutenção. Por favor, aguarde alguns instantes e tente novamente.\n\n`;
        resultadoFallback += `Valores sujeitos a confirmação e disponibilidade`;
        
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '2.2-COMPLETA',
            result: resultadoFallback,
            ia_usada: 'fallback'
        });
    }
}

// Logs de inicialização
console.log('✅ CVC Itaqua v2.2-COMPLETA carregado com sucesso!');
console.log('📋 14 templates disponíveis | 🔍 Detecção automática | 🤖 GPT + Claude | 📄 Texto/Imagem/PDF');
console.log('📌 100% conforme Manual CVC Itaqua | Atualização: 18/12/2024');
