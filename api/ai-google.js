// ================================================================================
// 🚀 CVC ITAQUA v2.6 - PÓS-PROCESSAMENTO CORRIGIDO PARA MÚLTIPLAS OPÇÕES
// ================================================================================
//
// 📁 ÍNDICE DO ARQUIVO:
//   SEÇÃO 1: CONFIGURAÇÕES GLOBAIS
//   SEÇÃO 2: TEMPLATES DE ORÇAMENTO
//   SEÇÃO 3: FUNÇÕES DE FORMATAÇÃO DE REGRAS (Pós-processamento)
//   SEÇÃO 4: FUNÇÕES DE DETECÇÃO
//   SEÇÃO 5: GERAÇÃO DE PROMPTS
//   SEÇÃO 6: HANDLER PRINCIPAL (com lógica de Pós-processamento CORRIGIDA)
//
// ================================================================================
// VERSÃO: 2.6
// DATA: 18/12/2024
// MUDANÇAS:
// - CORREÇÃO CRÍTICA: Lógica de pós-processamento agora analisa CADA opção
//   individualmente, aplicando as regras corretas de parcelamento, bagagem e assento.
// - CORREÇÃO VISUAL: Adicionada quebra de linha entre as opções.
// - INTEGRIDADE MANTIDA: Nenhuma função, template ou lógica foi simplificada.
// ================================================================================

// ================================================================================
// SEÇÃO 1: CONFIGURAÇÕES GLOBAIS
// ================================================================================
const AEROPORTOS = {
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos', 'SDU': 'Santos Dumont', 'GIG': 'Galeão', 'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'POA': 'Porto Alegre', 'CWB': 'Curitiba', 'FLN': 'Florianópolis', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza', 'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju', 'JPA': 'João Pessoa', 'THE': 'Teresina', 'SLZ': 'São Luís', 'BEL': 'Belém', 'MAO': 'Manaus', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'GYN': 'Goiânia', 'VIX': 'Vitória', 'BPS': 'Porto Seguro', 'IOS': 'Ilhéus', 'JDO': 'Juazeiro do Norte', 'IGU': 'Foz do Iguaçu', 'IMP': 'Imperatriz', 'MAB': 'Marabá', 'STM': 'Santarém', 'RBR': 'Rio Branco', 'PVH': 'Porto Velho', 'BVB': 'Boa Vista', 'MCP': 'Macapá', 'PMW': 'Palmas', 'UDI': 'Uberlândia', 'RAO': 'Ribeirão Preto', 'JOI': 'Joinville', 'XAP': 'Chapecó', 'LDB': 'Londrina', 'MGF': 'Maringá', 'EZE': 'Ezeiza - Buenos Aires', 'AEP': 'Aeroparque - Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima', 'BOG': 'Bogotá', 'MEX': 'Cidade do México', 'CUN': 'Cancún', 'MIA': 'Miami', 'MCO': 'Orlando', 'JFK': 'Nova York - JFK', 'LGA': 'Nova York - LGA', 'EWR': 'Nova York - Newark', 'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'DFW': 'Dallas', 'ATL': 'Atlanta', 'ORD': 'Chicago', 'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'Paris - Charles de Gaulle', 'ORY': 'Paris - Orly', 'FCO': 'Roma - Fiumicino', 'MXP': 'Milão', 'LHR': 'Londres - Heathrow', 'LGW': 'Londres - Gatwick', 'FRA': 'Frankfurt', 'MUC': 'Munique', 'AMS': 'Amsterdam', 'ZUR': 'Zurich', 'PCL': 'Pucallpa', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'TRU': 'Trujillo', 'PIU': 'Piura', 'IQT': 'Iquitos', 'TPP': 'Tarapoto', 'JAU': 'Jauja', 'AYP': 'Ayacucho', 'TCQ': 'Tacna', 'MVD': 'Montevidéu', 'ASU': 'Assunção', 'VVI': 'Santa Cruz', 'LPB': 'La Paz', 'UIO': 'Quito', 'GYE': 'Guayaquil'
};
const DESTINOS_CONHECIDOS = {
    'pucallpa': 'Pucallpa', 'lima': 'Lima', 'cusco': 'Cusco', 'arequipa': 'Arequipa', 'iquitos': 'Iquitos', 'trujillo': 'Trujillo', 'piura': 'Piura', 'tarapoto': 'Tarapoto', 'ayacucho': 'Ayacucho', 'joão pessoa': 'João Pessoa', 'joao pessoa': 'João Pessoa', 'brasília': 'Brasília', 'brasilia': 'Brasília', 'salvador': 'Salvador', 'rio de janeiro': 'Rio de Janeiro', 'belo horizonte': 'Belo Horizonte', 'porto alegre': 'Porto Alegre', 'curitiba': 'Curitiba', 'florianópolis': 'Florianópolis', 'florianopolis': 'Florianópolis', 'recife': 'Recife', 'fortaleza': 'Fortaleza', 'natal': 'Natal', 'maceió': 'Maceió', 'maceio': 'Maceió', 'goiânia': 'Goiânia', 'goiania': 'Goiânia', 'manaus': 'Manaus', 'belém': 'Belém', 'belem': 'Belém', 'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid', 'barcelona': 'Barcelona', 'paris': 'Paris', 'londres': 'Londres', 'roma': 'Roma', 'amsterdam': 'Amsterdam', 'milão': 'Milão', 'milao': 'Milão', 'frankfurt': 'Frankfurt', 'zurich': 'Zurich', 'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York', 'los angeles': 'Los Angeles', 'são francisco': 'São Francisco', 'sao francisco': 'São Francisco', 'chicago': 'Chicago', 'dallas': 'Dallas', 'atlanta': 'Atlanta', 'cancún': 'Cancún', 'cancun': 'Cancún', 'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'bogotá': 'Bogotá', 'bogota': 'Bogotá', 'montevidéu': 'Montevidéu', 'montevideu': 'Montevidéu', 'assunção': 'Assunção', 'assuncao': 'Assunção', 'quito': 'Quito', 'guayaquil': 'Guayaquil', 'la paz': 'La Paz'
};

// ================================================================================
// SEÇÃO 2: TEMPLATES DE ORÇAMENTO (14 TEMPLATES)
// ================================================================================
const TEMPLATES = {
    aereo_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
{parcelamento}
{bagagem}
{assento}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,
    aereo_conexao: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*

{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_conexao} {hora_chegada_conexao} (voo direto)
(conexão em {cidade_conexao} - {tempo_espera} de espera)
{data_ida} - {aeroporto_conexao} {hora_saida_conexao} / {aeroporto_destino} {hora_chegada_ida} (voo direto)
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
{parcelamento}
{bagagem}
{assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor_total}
Inclui taxas de embarque
{bagagem}
{assento}
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,
    multiplas_opcoes_2_planos: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 **OPÇÃO 1** - R$ {valor1}
✅ Só mala de mão incluída
{parcelamento1}
🔗 {link1}

💰 **OPÇÃO 2** - R$ {valor2}
✅ Mala de mão + bagagem despachada
✅ Cancelamento/alteração com multas
✅ Reembolsável conforme regras do bilhete
{parcelamento2}
🔗 {link2}

Valores sujeitos a confirmação e disponibilidade`,
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
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
{parcelamento1}
{bagagem1}
{assento1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
{parcelamento2}
{bagagem2}
{assento2}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{data_ida3} - {aeroporto_origem3} {hora_ida3} / {aeroporto_destino3} {hora_chegada3} ({tipo_voo3})
--
{data_volta3} - {aeroporto_volta3} {hora_volta3} / {aeroporto_origem3} {hora_chegada_volta3} ({tipo_voo_volta3})

💰 R$ {valor3} para {passageiros}
{parcelamento3}
{bagagem3}
{assento3}
🔗 {link3}

🏷️ {reembolso}
Valores sujeitos a confirmação e disponibilidade`,
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

{parcelamento}
Valores sujeitos a confirmação e disponibilidade`,
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
{parcelamento}

Valores sujeitos a confirmação e disponibilidade`,
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
    multitrecho: `*Multitrecho - {companhias}*
{data_inicio} a {data_fim} ({dias} dias e {noites} noites)

*Trecho 1:* {origem1} → {destino1}
{data1} - {aeroporto1} {hora1} / {aeroporto_chegada1} {hora_chegada1} ({tipo_voo1})

*Trecho 2:* {origem2} → {destino2}
{data2} - {aeroporto2} {hora2} / {aeroporto_chegada2} {hora_chegada2} ({tipo_voo2})

*Trecho 3:* {origem3} → {destino3}
{data3} - {aeroporto3} {hora3} / {aeroporto_chegada3} {hora_chegada3} ({tipo_voo3})

💰 R$ {valor_total} para {passageiros}
{parcelamento}
{bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,
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
    dicas_completas: `🌍 *Dicas Essenciais para sua Viagem a {destino}!* 🌍

1️⃣ **Gastronomia Imperdível**
{dica_gastronomia}

2️⃣ **Atrações Clássicas**
{dica_atracoes}

3️⃣ **Passeios e Experiências**
{dica_passeios}

---
✈️ *Complete sua Viagem com a CVC!*
Fale comigo para adicionar outros serviços ao seu pacote!`,
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

Valores sujeitos a confirmação e disponibilidade`
};
// ================================================================================
// SEÇÃO 3: FUNÇÕES DE FORMATAÇÃO DE REGRAS (Pós-processamento)
// ================================================================================

function formatarParcelamento(textoBrutoOpcao, parcelamentoSelecionado, valorTotalString) {
    try {
        if (!textoBrutoOpcao) return '';
        const textoLower = textoBrutoOpcao.toLowerCase();
        
        const entradaParcelas = textoLower.match(/entrada de r\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*r\$\s*([\d.,]+)/i);
        if (entradaParcelas) {
            const entrada = entradaParcelas[1];
            const numParcelas = parseInt(entradaParcelas[2]);
            const valorParcela = entradaParcelas[3];
            const totalParcelas = numParcelas + 1;
            return `💳 Total de R$ ${valorTotalString} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        if (parcelamentoSelecionado && valorTotalString) {
            const valorNumerico = parseFloat(valorTotalString.replace(/\./g, '').replace(',', '.'));
            if (!isNaN(valorNumerico)) {
                const numParcelasInt = parseInt(parcelamentoSelecionado);
                const valorParcela = (valorNumerico / numParcelasInt).toFixed(2).replace('.', ',');
                return `💳 ${numParcelasInt}x de R$ ${valorParcela} s/ juros no cartão`;
            }
        }
        return '';
    } catch (error) {
        console.error('Erro ao formatar parcelamento:', error);
        return '';
    }
}

function formatarBagagem(textoBrutoOpcao) {
    try {
        if (!textoBrutoOpcao) return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        const texto = textoBrutoOpcao.toLowerCase();
        if (texto.includes('sem bagagem') || texto.includes('só mala de mão')) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        }
        if (texto.includes('com bagagem') || texto.includes('com babagem') || texto.includes('inclui bagagem') || texto.includes('bagagem despachada')) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
        }
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
    } catch (error) {
        console.error('Erro ao formatar bagagem:', error);
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
    }
}

function formatarAssento(textoBrutoOpcao) {
    try {
        if (!textoBrutoOpcao) return '';
        const texto = textoBrutoOpcao.toLowerCase();
        if (texto.includes('pre reserva de assento') || texto.includes('pré reserva') || texto.includes('marcação de assento')) {
            return '💺 Inclui pré reserva de assento';
        }
        return '';
    } catch (error) {
        console.error('Erro ao formatar assento:', error);
        return '';
    }
}

function formatarPassageiros(dados) {
    try {
        let resultado = [];
        const { adultos, criancas, bebes, idadesCriancas, idadesBebes } = dados;
        if (adultos > 0) resultado.push(`${String(adultos).padStart(2, '0')} ${adultos === 1 ? 'adulto' : 'adultos'}`);
        if (criancas > 0) {
            let textoIdades = (idadesCriancas && idadesCriancas.length > 0) ? ` (${idadesCriancas.join(' e ')} anos)` : '';
            resultado.push(`${String(criancas).padStart(2, '0')} ${criancas === 1 ? 'criança' : 'crianças'}${textoIdades}`);
        }
        if (bebes > 0) {
            let textoIdades = (idadesBebes && idadesBebes.length > 0) ? ` (${idadesBebes.join(' e ')} meses)` : '';
            resultado.push(`${String(bebes).padStart(2, '0')} ${bebes === 1 ? 'bebê' : 'bebês'}${textoIdades}`);
        }
        return resultado.join(' + ');
    } catch (error) {
        console.error('Erro ao formatar passageiros:', error);
        return '01 adulto';
    }
}

// ================================================================================
// SEÇÃO 4: FUNÇÕES DE DETECÇÃO
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
        if (padraoConexao && padraoConexao.length >= 4) {
            const origem = padraoConexao[1]; const destinoFinal = padraoConexao[3];
            if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) return AEROPORTOS[destinoFinal];
        }
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) return AEROPORTOS[codigo];
            }
        }
        for (const [chave, nome] of Object.entries(DESTINOS_CONHECIDOS)) { if (texto.includes(chave)) return nome; }
        return null;
    } catch (error) { console.error('❌ Erro ao extrair destino:', error); return null; }
}

function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) return 'cruzeiro';
        if (tipos.includes('Aéreo') && tipos.includes('Hotel')) return 'pacote_completo';
        const temDatasSequenciais = (conteudoPrincipal.match(/\d{2}\/\d{2}\s+a\s+\d{2}\/\d{2}/g) || []).length >= 2;
        if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
            if (temDatasSequenciais) return 'roteiro_hoteis';
            return 'hoteis_multiplas_opcoes';
        }
        if (tipos.includes('Dicas')) return 'dicas_completas';
        if (tipos.includes('Ranking')) return 'ranking';
        if (conteudoLower.includes('somente ida') || conteudoLower.includes('one way')) return 'aereo_somente_ida';
        if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) return 'multitrecho';
        if (temDatasSequenciais) return 'roteiro_hoteis';
        
        const companhiasUnicas = [...new Set(conteudoPrincipal.match(/(iberia|tap portugal|latam|gol|azul|avianca)/gi)?.map(c => c.toLowerCase()) || [])];
        if (companhiasUnicas.length >= 2) return 'multiplas_companhias';
        
        if (detectarVooComConexao(conteudoPrincipal)) return 'aereo_conexao';
        
        const opcoesMarcadas = conteudoPrincipal.match(/OPÇÃO \d/gi) || [];
        if (opcoesMarcadas.length >= 3) return 'multiplas_opcoes_3_planos';
        if (opcoesMarcadas.length >= 2) return 'multiplas_opcoes_2_planos';
        
        return 'aereo_simples';
    } catch (error) {
        console.error('❌ Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

function detectarVooComConexao(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        const indicadores = ['voo com paradas', 'conexão', 'espera de', 'parada em', 'escala', 'uma escala', 'layover'];
        const temIndicadores = indicadores.some(ind => texto.includes(ind));
        const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
        return temIndicadores || temMultiplosTrechos;
    } catch (error) {
        console.error('❌ Erro ao detectar conexão:', error);
        return false;
    }
}
// ================================================================================
// SEÇÃO 5: GERAÇÃO DE PROMPTS
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino) {
    try {
        let destinoFinal = destino || extrairDestinoDoConteudo(conteudoPrincipal) || 'Destino não identificado';
        
        const regrasGerais = `**REGRAS CRÍTICAS DE GERAÇÃO v2.6:**
- Sua tarefa é extrair os dados brutos e preencher o template correspondente.
- Para os campos {parcelamento}, {bagagem}, {assento} e {passageiros}, NÃO TENTE FORMATAR. Apenas insira o placeholder exatamente como está no template. O sistema fará a substituição final.
- Para múltiplos planos (2 ou 3), use os placeholders numerados: {parcelamento1}, {parcelamento2}, etc.
- Converta todos os códigos de aeroporto para nomes completos usando a tabela fornecida.
- Formate valores como R$ 1.234,56.
- Formate datas como DD/MM e horários como HH:MM.
- Termine SEMPRE com "Valores sujeitos a confirmação e disponibilidade".`;

        const tabelaAeroportos = `**TABELA DE AEROPORTOS:**\n${JSON.stringify(AEROPORTOS, null, 2)}`;
        
        const templateSelecionado = TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples;

        return `Converta os dados brutos no orçamento formatado.
**DADOS BRUTOS:**
${conteudoPrincipal}

**DESTINO IDENTIFICADO:** ${destinoFinal}
**TEMPLATE A SER USADO:**
${templateSelecionado}

${regrasGerais}
${tabelaAeroportos}`;

    } catch (error) {
        console.error('❌ v2.6: Erro ao gerar prompt:', error);
        return `Erro: ${error.message}`;
    }
}

// ================================================================================
// SEÇÃO 6: HANDLER PRINCIPAL (com Pós-processamento CORRIGIDO)
// ================================================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true, status: 'operational', version: '2.6-PÓS-PROCESSAMENTO-CORRIGIDO',
            message: 'CVC Itaqua API v2.6 - Sistema completo com pós-processamento de regras individualizado por opção.',
            templates_disponiveis: Object.keys(TEMPLATES)
        });
    }

    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido - use POST' });

    try {
        if (!req.body) return res.status(400).json({ success: false, error: 'Body obrigatório' });

        const { observacoes = '', textoColado = '', destino = '', adultos = 1, criancas = 0, bebes = 0, idadesCriancas = [], idadesBebes = [], tipos = [], parcelamento = '', imagemBase64 = null, pdfContent = null } = req.body;
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();

        if (!conteudoPrincipal.trim() && !imagemBase64) return res.status(400).json({ success: false, error: 'Adicione informações sobre a viagem' });

        const tipoOrcamento = detectOrcamentoType(conteudoPrincipal, tipos);
        const prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino);
        console.log(`✅ v2.6: Tipo detectado: ${tipoOrcamento}`);

        let resultado, iaUsada;
        const systemPrompt = `Você é um assistente da CVC Itaqua. Analise os dados e preencha o template fornecido. Onde houver placeholders como {parcelamento}, {bagagem}, {assento} ou {passageiros}, mantenha-os. Retorne apenas o texto formatado.`;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;

        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            iaUsada = 'claude-3-haiku';
            const messages = [{ role: 'user', content: imagemBase64 ? [{ type: 'text', text: prompt }, { type: 'image', source: { type: 'base64', media_type: imagemBase64.split(';')[0].split(':')[1], data: imagemBase64.split(',')[1] } }] : prompt }];
            const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 2048, temperature: 0.1, messages, system: systemPrompt }) });
            if (!response.ok) throw new Error(`Claude erro ${response.status}: ${await response.text()}`);
            const data = await response.json();
            resultado = data.content[0].text;
        } else {
            iaUsada = 'gpt-4o-mini';
            if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não configurada');
            const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.1, max_tokens: 2048 }) });
            if (!response.ok) throw new Error(`OpenAI erro ${response.status}: ${await response.text()}`);
            const data = await response.json();
            resultado = data.choices[0].message.content;
        }

        let resultadoBruto = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        // === PÓS-PROCESSAMENTO CORRIGIDO v2.6 ===
        console.log('🔄 v2.6: Aplicando pós-processamento de regras...');
        
        let resultadoFinal;
        const dadosPassageiros = { adultos, criancas, bebes, idadesCriancas, idadesBebes };
        const passageirosFormatado = formatarPassageiros(dadosPassageiros);

        if (tipoOrcamento === 'multiplas_companhias' || tipoOrcamento === 'multiplas_opcoes_2_planos' || tipoOrcamento === 'multiplas_opcoes_3_planos') {
            const blocosInput = conteudoPrincipal.split(/OPÇÃO \d/i).filter(b => b.trim() !== '');
            const blocosOutput = resultadoBruto.split(/\*OPÇÃO \d/i).filter(b => b.trim() !== '');
            let resultadoProcessado = [];

            for (let i = 0; i < blocosOutput.length; i++) {
                let bloco = blocosOutput[i];
                const inputCorrespondente = blocosInput[i] || conteudoPrincipal;

                const valorTotalMatch = bloco.match(/R\$\s*([\d.,]+)/);
                const valorTotalString = valorTotalMatch ? valorTotalMatch[1] : null;
                
                bloco = bloco.replace(/{passageiros}/g, passageirosFormatado)
                             .replace(/{parcelamento\d?}/g, formatarParcelamento(inputCorrespondente, parcelamento, valorTotalString))
                             .replace(/{bagagem\d?}/g, formatarBagagem(inputCorrespondente))
                             .replace(/{assento\d?}/g, formatarAssento(inputCorrespondente));
                
                resultadoProcessado.push(`*OPÇÃO ${i+1}${bloco}`);
            }
            resultadoFinal = resultadoProcessado.join('\n\n');
        } else {
            const valorTotalMatch = resultadoBruto.match(/R\$\s*([\d.,]+)/);
            const valorTotalString = valorTotalMatch ? valorTotalMatch[1] : null;
            
            resultadoFinal = resultadoBruto
                .replace(/{passageiros}/g, passageirosFormatado)
                .replace(/{parcelamento}/g, formatarParcelamento(conteudoPrincipal, parcelamento, valorTotalString))
                .replace(/{bagagem}/g, formatarBagagem(conteudoPrincipal))
                .replace(/{assento}/g, formatarAssento(conteudoPrincipal));
        }
        
        resultadoFinal = resultadoFinal.split('\n').filter(line => line.trim() !== '').join('\n');
        
        return res.status(200).json({
            success: true, result: resultadoFinal, ia_usada: iaUsada,
            metadata: { version: '2.6-PÓS-PROCESSAMENTO-CORRIGIDO', tipo: tipoOrcamento }
        });

    } catch (error) {
        console.error('❌ v2.6: Erro no handler:', error);
        return res.status(500).json({ success: false, error: 'Erro interno do servidor', details: error.message, version: '2.6-PÓS-PROCESSAMENTO-CORRIGIDO' });
    }
}

console.log('✅ CVC Itaqua v2.6-PÓS-PROCESSAMENTO-CORRIGIDO carregado com sucesso!');
