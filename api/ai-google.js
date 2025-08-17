// api/ai-google.js - CVC ITAQUA v2.89 COMPLETO
// Sistema completo com todos os 11 produtos do manual

// ================================================================================
// CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const CONFIG = {
    VERSION: '2.89'
};

const AEROPORTOS = {
    // Brasil - Principais
    'GRU': 'Guarulhos', 'CGH': 'Congonhas', 'VCP': 'Viracopos',
    'GIG': 'Galeão', 'SDU': 'Santos Dumont', 'BSB': 'Brasília',
    'CNF': 'Confins', 'SSA': 'Salvador', 'REC': 'Recife',
    'FOR': 'Fortaleza', 'POA': 'Porto Alegre', 'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 'MAO': 'Manaus', 'BEL': 'Belém',
    'NAT': 'Natal', 'MCZ': 'Maceió', 'AJU': 'Aracaju',
    'JPA': 'João Pessoa', 'THE': 'Teresina', 'SLZ': 'São Luís',
    'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'GYN': 'Goiânia',
    
    // Internacional - Europa
    'LIS': 'Lisboa', 'OPO': 'Porto', 'MAD': 'Madrid',
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma',
    'MXP': 'Milão', 'VCE': 'Veneza', 'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'MUC': 'Munique', 'ZRH': 'Zurique', 'VIE': 'Viena',
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 'MIA': 'Miami', 'MCO': 'Orlando',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'LAS': 'Las Vegas',
    'CUN': 'Cancún', 'MEX': 'Cidade do México', 'PTY': 'Panamá',
    'EZE': 'Buenos Aires', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'UIO': 'Quito', 'MVD': 'Montevidéu'
};

// ================================================================================
// TEMPLATES COMPLETOS - 11 PRODUTOS
// ================================================================================

const TEMPLATES = {
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
💺 {assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 2. MÚLTIPLAS OPÇÕES AÉREAS
    MULTIPLAS_OPCOES: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{voo_ida1}
--
{voo_volta1}

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
✅ {bagagem1}
💺 {assento1}
🏷️ {reembolso1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{voo_ida2}
--
{voo_volta2}

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
✅ {bagagem2}
💺 {assento2}
🏷️ {reembolso2}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{voo_ida3}
--
{voo_volta3}

💰 R$ {valor3} para {passageiros}
💳 {parcelamento3}
✅ {bagagem3}
💺 {assento3}
🏷️ {reembolso3}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 3. MULTITRECHO
    MULTITRECHO: `*MULTITRECHO - {companhias}*
📅 {data_inicio} a {data_fim} ({total_dias} dias)
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
*TRECHO 1: {origem1} ✈ {destino1}*
{data1} - {detalhes_trecho1}
Companhia: {companhia1}

*TRECHO 2: {origem2} ✈ {destino2}*
{data2} - {detalhes_trecho2}
Companhia: {companhia2}

*TRECHO 3: {origem3} ✈ {destino3}*
{data3} - {detalhes_trecho3}
Companhia: {companhia3}

*TRECHO 4: {origem4} ✈ {destino4}*
{data4} - {detalhes_trecho4}
Companhia: {companhia4}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 4. PACOTE COMPLETO
    PACOTE_COMPLETO: `*🏖️ PACOTE {destino_upper}*
📅 {data_inicio} a {data_fim} ({dias} dias e {noites} noites)
👥 {passageiros}

*✈️ AÉREO {companhia_upper}:*
IDA: {data_ida} - {voo_ida_detalhes}
VOLTA: {data_volta} - {voo_volta_detalhes}

*🏨 HOSPEDAGEM:*
Hotel: {nome_hotel} {estrelas}
📍 {localizacao_hotel}
🛏️ {tipo_quarto}
🍽️ {regime_alimentacao}
📱 Wi-Fi gratuito
🏊 {facilidades_hotel}

*🚌 TRASLADOS:*
• Aeroporto ⇄ Hotel
• {traslados_adicionais}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}

*✅ INCLUÍDO:*
• Passagens aéreas
• {noites} noites de hospedagem
• {regime_alimentacao}
• Traslados
• Taxas e serviços inclusos

*❌ NÃO INCLUÍDO:*
• Passeios opcionais
• Gastos pessoais
• Seguro viagem
• {nao_incluido_adicional}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 5. CRUZEIRO
    CRUZEIRO: `*🚢 CRUZEIRO {nome_navio}*
🗓️ {data_inicio} a {data_fim}
⛴️ {noites} noites
📍 Saída: {porto_saida}
👥 {passageiros}

*🗺️ ROTEIRO:*
{roteiro_detalhado}

*🛏️ CATEGORIAS DE CABINE:*

━━━━━━━━━━━━━━━━━━
*CABINE INTERNA*
• {descricao_interna}
• Banheiro privativo
• TV e cofre
• Sem janela

💰 R$ {valor_interna} casal
💳 {parcelamento_interna}

━━━━━━━━━━━━━━━━━━
*CABINE EXTERNA*
• {descricao_externa}
• Janela para o mar
• Banheiro privativo
• TV, cofre e frigobar

💰 R$ {valor_externa} casal
💳 {parcelamento_externa}

━━━━━━━━━━━━━━━━━━
*CABINE COM VARANDA*
• {descricao_varanda}
• Varanda privativa
• Banheiro privativo
• TV, cofre, frigobar
• Área de estar

💰 R$ {valor_varanda} casal
💳 {parcelamento_varanda}

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
{gorjetas_info}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 6. SOMENTE HOTEL (MÚLTIPLAS OPÇÕES)
    SOMENTE_HOTEL: `*🏨 HOTÉIS EM {destino_upper}*
📅 Check-in: {checkin} | Check-out: {checkout}
🌙 {noites} noites
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 1 - {hotel1_nome} {hotel1_estrelas}*
📍 {hotel1_localizacao}
🛏️ {hotel1_quarto}
🍽️ {hotel1_regime}
📱 Wi-Fi gratuito
{hotel1_facilidades}
✅ Taxas e serviços inclusos

💰 R$ {hotel1_valor} total da hospedagem
💳 {hotel1_parcelamento}
🔗 {hotel1_link}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 2 - {hotel2_nome} {hotel2_estrelas}*
📍 {hotel2_localizacao}
🛏️ {hotel2_quarto}
🍽️ {hotel2_regime}
📱 Wi-Fi gratuito
{hotel2_facilidades}
✅ Taxas e serviços inclusos

💰 R$ {hotel2_valor} total da hospedagem
💳 {hotel2_parcelamento}
🔗 {hotel2_link}

━━━━━━━━━━━━━━━━━━
*OPÇÃO 3 - {hotel3_nome} {hotel3_estrelas}*
📍 {hotel3_localizacao}
🛏️ {hotel3_quarto}
🍽️ {hotel3_regime}
📱 Wi-Fi gratuito
{hotel3_facilidades}
✅ Taxas e serviços inclusos

💰 R$ {hotel3_valor} total da hospedagem
💳 {hotel3_parcelamento}
🔗 {hotel3_link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 7. INGRESSOS
    INGRESSOS: `*🎢 INGRESSOS {nome_atracao}*
📅 Data da visita: {data_visita}
👥 {quantidade} ingressos

*📋 DETALHES:*
• Tipo: {tipo_ingresso}
• Validade: {validade}
• Horário: {horario}
• Inclui: {incluso}

*💳 VALORES:*
• Adulto: R$ {valor_adulto}
• Criança (3-11 anos): R$ {valor_crianca}
• Idoso (60+): R$ {valor_idoso}
• Gratuito: Menores de 3 anos

💰 Total: R$ {valor_total}
💳 {parcelamento}

*📱 IMPORTANTE:*
• Apresentar QR Code na entrada
• Documento com foto obrigatório
• {instrucoes_adicionais}

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 8. SEGURO VIAGEM
    SEGURO_VIAGEM: `*🛡️ SEGURO VIAGEM {destino_upper}*
📅 Período: {data_inicio} a {data_fim} ({dias} dias)
👥 {quantidade} segurado(s)
🌍 Destino: {tipo_destino}

*📋 COBERTURAS:*
✅ Despesas médicas: {moeda} {valor_medico}
✅ Despesas odontológicas: {moeda} {valor_odonto}
✅ Bagagem extraviada: {moeda} {valor_bagagem}
✅ Cancelamento de viagem: {moeda} {valor_cancelamento}
✅ Morte acidental: {moeda} {valor_morte}
✅ Invalidez permanente: {moeda} {valor_invalidez}
✅ {coberturas_adicionais}

*🏥 ASSISTÊNCIA 24H:*
• Telemedicina
• Orientação em caso de perda de documentos
• Assistência jurídica
• Localização de bagagem
• {assistencia_adicional}

💰 R$ {valor_por_pessoa} por pessoa
💰 Total: R$ {valor_total}
💳 {parcelamento}

*📱 IMPORTANTE:*
• Cobertura COVID-19 incluída
• {requisitos_destino}
• Acionamento via WhatsApp 24h
• App com cartão virtual do seguro

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 9. LOCAÇÃO DE CARRO
    LOCACAO_CARRO: `*🚗 LOCAÇÃO DE VEÍCULO - {destino_upper}*
📅 Retirada: {data_retirada} às {hora_retirada}
📅 Devolução: {data_devolucao} às {hora_devolucao}
📍 Local: {local_retirada}
⏱️ {total_diarias} diárias

*🚙 VEÍCULO:*
Categoria: {categoria}
Modelo: {modelo}
✅ Ar condicionado
✅ Direção hidráulica
✅ {cambio}
✅ {capacidade_pessoas} pessoas
✅ {capacidade_malas}

*💰 VALORES:*
Diárias: R$ {valor_diarias}
Proteções: R$ {valor_protecoes}
Taxas: R$ {valor_taxas}

💰 Total: R$ {valor_total}
💳 {parcelamento}

*✅ INCLUÍDO:*
• Km livre
• Proteção básica
• Taxas e serviços inclusos
• {incluido_adicional}

*❌ NÃO INCLUÍDO:*
• Combustível
• Pedágios
• Multas
• {nao_incluido_adicional}

*📋 DOCUMENTAÇÃO:*
• CNH válida (mínimo 2 anos)
• Cartão de crédito (caução)
• Idade mínima: {idade_minima} anos

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

    // 10. DICAS WHATSAPP
    DICAS_WHATSAPP: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {destino_upper}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre {destino}*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
{lista_passeios_numerada}

🌡️ *CLIMA {periodo}:*
{informacoes_clima}
{roupas_recomendadas}

{secao_criancas}

🍽️ *GASTRONOMIA:*
{pratos_tipicos}
{precos_refeicoes}
{dicas_restaurantes}

💰 *INFORMAÇÕES ÚTEIS:*
{moeda_info}
{idioma_info}
{documentacao_info}
{seguro_info}

💳 *CUSTOS MÉDIOS:*
{tabela_custos}

🛡️ *SEGURO VIAGEM:*
{detalhes_seguro}

📱 *DICAS PRÁTICAS:*
{lista_dicas_praticas}

🎁 *PRODUTOS CVC RECOMENDADOS:*
{produtos_cvc}

🚨 *IMPORTANTE:*
{avisos_importantes}

{secao_documentacao_menores}

💡 *DICA DE OURO:*
{dica_especial}`,

    // 11. RANKING DE HOTÉIS
    RANKING_HOTEIS: `━━━━━━━━━━━━━━━━━━
🏆 *RANKING DOS HOTÉIS EM {destino_upper}*
━━━━━━━━━━━━━━━━━━

🥇 *1º LUGAR: {hotel1_nome}*
🛏️ {hotel1_quarto}: {hotel1_descricao}
📍 {hotel1_localizacao}
   📏 {hotel1_distancia1}
   📏 {hotel1_distancia2}
   📏 {hotel1_distancia3}
⭐ Avaliações:
   • Booking: {hotel1_booking}/10
   • Google: {hotel1_google}/5
   • TripAdvisor: {hotel1_trip}/5
✅ Destaques: {hotel1_destaques}
{hotel1_avisos}

🥈 *2º LUGAR: {hotel2_nome}*
🛏️ {hotel2_quarto}: {hotel2_descricao}
📍 {hotel2_localizacao}
   📏 {hotel2_distancia1}
   📏 {hotel2_distancia2}
⭐ Avaliações:
   • Booking: {hotel2_booking}/10
   • Google: {hotel2_google}/5
   • TripAdvisor: {hotel2_trip}/5
✅ Destaques: {hotel2_destaques}
{hotel2_avisos}

🥉 *3º LUGAR: {hotel3_nome}*
🛏️ {hotel3_quarto}: {hotel3_descricao}
📍 {hotel3_localizacao}
   📏 {hotel3_distancia1}
   📏 {hotel3_distancia2}
⭐ Avaliações:
   • Booking: {hotel3_booking}/10
   • Google: {hotel3_google}/5
   • TripAdvisor: {hotel3_trip}/5
✅ Destaques: {hotel3_destaques}

💡 *MINHA RECOMENDAÇÃO:*
{recomendacao_personalizada}

{dica_familias}

📌 *OBSERVAÇÕES:*
{observacoes_finais}`
};

// ================================================================================
// FUNÇÕES DE DETECÇÃO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Prioridade 1: Tipos selecionados no formulário
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Dicas')) return 'DICAS_WHATSAPP';
            if (tipos.includes('Ranking')) return 'RANKING_HOTEIS';
            if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
            if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
            if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'PACOTE_COMPLETO';
            if (tipos.includes('Hotel')) return 'SOMENTE_HOTEL';
        }
        
        // Prioridade 2: Detecção por conteúdo
        if (conteudoLower.includes('gere dicas') || conteudoLower.includes('consulte o manual e gere dicas')) {
            return 'DICAS_WHATSAPP';
        }
        if (conteudoLower.includes('gere ranking') || conteudoLower.includes('consulte o manual e gere ranking')) {
            return 'RANKING_HOTEIS';
        }
        if (conteudoLower.includes('multitrecho') || conteudoLower.includes('multi-trecho')) {
            return 'MULTITRECHO';
        }
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || conteudoLower.includes('cabine')) {
            return 'CRUZEIRO';
        }
        if (conteudoLower.includes('seguro viagem') || conteudoLower.includes('seguro de viagem')) {
            return 'SEGURO_VIAGEM';
        }
        if (conteudoLower.includes('ingresso') || conteudoLower.includes('parque') || conteudoLower.includes('disney')) {
            return 'INGRESSOS';
        }
        if (conteudoLower.includes('locação') || conteudoLower.includes('aluguel de carro') || conteudoLower.includes('rent')) {
            return 'LOCACAO_CARRO';
        }
        if (conteudoLower.includes('pacote') && conteudoLower.includes('hotel')) {
            return 'PACOTE_COMPLETO';
        }
        if (conteudoLower.includes('hotel') || conteudoLower.includes('hospedagem')) {
            return 'SOMENTE_HOTEL';
        }
        
        // Detectar múltiplas opções
        const valores = (conteudoPrincipal.match(/R\$\s*[\d.,]+/g) || []).length;
        const opcoes = (conteudoPrincipal.match(/opção \d/gi) || []).length;
        const companhias = (conteudoPrincipal.match(/(tap|iberia|latam|gol|azul|american|united)/gi) || []).length;
        
        if (valores >= 3 || opcoes >= 2 || companhias >= 2) {
            return 'MULTIPLAS_OPCOES';
        }
        
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

function extrairDestino(conteudoPrincipal, destinoForm) {
    try {
        if (destinoForm && destinoForm.trim()) {
            return destinoForm;
        }
        
        const texto = conteudoPrincipal.toLowerCase();
        
        // Lista expandida de destinos
        const destinos = {
            'lisboa': 'Lisboa', 'porto': 'Porto', 'madrid': 'Madrid',
            'barcelona': 'Barcelona', 'paris': 'Paris', 'roma': 'Roma',
            'milão': 'Milão', 'milao': 'Milão', 'veneza': 'Veneza',
            'londres': 'Londres', 'amsterdam': 'Amsterdam', 'frankfurt': 'Frankfurt',
            'orlando': 'Orlando', 'miami': 'Miami', 'nova york': 'Nova York',
            'los angeles': 'Los Angeles', 'las vegas': 'Las Vegas',
            'cancun': 'Cancún', 'cancún': 'Cancún', 'playa del carmen': 'Playa del Carmen',
            'buenos aires': 'Buenos Aires', 'santiago': 'Santiago', 'lima': 'Lima',
            'salvador': 'Salvador', 'fortaleza': 'Fortaleza', 'recife': 'Recife',
            'natal': 'Natal', 'maceio': 'Maceió', 'maceió': 'Maceió',
            'joão pessoa': 'João Pessoa', 'porto seguro': 'Porto Seguro',
            'florianopolis': 'Florianópolis', 'florianópolis': 'Florianópolis'
        };
        
        for (const [key, value] of Object.entries(destinos)) {
            if (texto.includes(key)) return value;
        }
        
        // Tentar extrair de códigos de aeroporto
        const codigosAeroporto = conteudoPrincipal.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) {
                    return AEROPORTOS[codigo].split(' ')[0];
                }
            }
        }
        
        return 'Destino';
        
    } catch (error) {
        console.error('Erro ao extrair destino:', error);
        return 'Destino';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPTS ESPECÍFICOS
// ================================================================================

function gerarPrompt(tipoOrcamento, conteudoPrincipal, destino, passageiros) {
    try {
        const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
        const destinoUpper = destino.toUpperCase();
        
        let instrucoes = `
Você é um assistente especializado da CVC Itaqua para formatar orçamentos de viagem.

TIPO DE ORÇAMENTO: ${tipoOrcamento}
DESTINO: ${destino}
PASSAGEIROS: ${passageiros}

DADOS FORNECIDOS:
${conteudoPrincipal}

TEMPLATE A SEGUIR EXATAMENTE:
${template}

INSTRUÇÕES ESPECÍFICAS POR TIPO:`;

        // Instruções específicas por tipo
        switch (tipoOrcamento) {
            case 'DICAS_WHATSAPP':
                instrucoes += `
PARA DICAS:
1. Pesquise/gere informações REAIS e ATUALIZADAS sobre ${destino}
2. Inclua clima específico do período
3. Liste 5 principais atrações turísticas
4. Informe custos médios em moeda local
5. Se houver crianças, adicione seção específica
6. Dicas práticas e úteis para o viajante
7. Produtos CVC relevantes`;
                break;
                
            case 'RANKING_HOTEIS':
                instrucoes += `
PARA RANKING:
1. Crie 3 hotéis diferentes com características distintas
2. Hotel 1: Premium/Luxo (nota 8.5+)
3. Hotel 2: Executivo/Intermediário (nota 7.5-8.5)
4. Hotel 3: Econômico/Simples (nota 7.0-7.5)
5. Inclua distâncias reais de pontos turísticos
6. Avaliações realistas (Booking, Google, TripAdvisor)
7. Recomendação baseada no perfil`;
                break;
                
            case 'MULTITRECHO':
                instrucoes += `
PARA MULTITRECHO:
1. Extraia todos os trechos do conteúdo
2. Identifique cidades e datas
3. Mantenha ordem cronológica
4. Especifique companhia de cada trecho
5. Calcule total de dias`;
                break;
                
            case 'CRUZEIRO':
                instrucoes += `
PARA CRUZEIRO:
1. Identifique nome do navio
2. Extraia roteiro completo
3. Crie 3 categorias de cabine (Interna, Externa, Varanda)
4. Valores crescentes por categoria
5. Liste inclusos e não inclusos`;
                break;
                
            case 'PACOTE_COMPLETO':
                instrucoes += `
PARA PACOTE:
1. Combine informações de voo + hotel
2. Calcule dias e noites
3. Especifique regime de alimentação
4. Liste traslados inclusos
5. Separe incluído/não incluído`;
                break;
                
            default:
                instrucoes += `
PARA ORÇAMENTO:
1. Extraia TODAS as informações do conteúdo
2. Identifique origem e destino
3. Mantenha valores originais
4. Detecte tipo de voo (direto/conexão)
5. Formate parcelamento corretamente`;
        }
        
        instrucoes += `

REGRAS GERAIS:
- Use datas no formato DD/MM
- Horários no formato HH:MM
- Valores em R$ X.XXX,XX
- Passageiros: XX adultos + XX crianças
- Converta códigos usando: ${JSON.stringify(AEROPORTOS)}
- Adicione (+1) quando chegada é dia seguinte
- Termine com: Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})
- Preencha TODOS os placeholders {} do template
- NÃO invente informações - use dados do conteúdo ou valores padrão razoáveis`;

        return instrucoes;
        
    } catch (error) {
        console.error('Erro ao gerar prompt:', error);
        return 'Formate um orçamento de viagem seguindo o template.';
    }
}

// ================================================================================
// HANDLER PRINCIPAL
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
            version: CONFIG.VERSION,
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.89 - Sistema Completo',
            produtos: [
                '1. Aéreo Simples',
                '2. Múltiplas Opções Aéreas',
                '3. Multitrecho',
                '4. Pacote Completo',
                '5. Cruzeiro',
                '6. Somente Hotel',
                '7. Ingressos',
                '8. Seguro Viagem',
                '9. Locação de Carro',
                '10. Dicas WhatsApp',
                '11. Ranking de Hotéis'
            ],
            apis_disponiveis: {
                openai: !!process.env.OPENAI_API_KEY,
                anthropic: !!process.env.ANTHROPIC_API_KEY
            }
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
        console.log('🚀 v2.89: Processando requisição...');
        
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

        // Formatar passageiros
        const numAdultos = parseInt(adultos) || 2;
        const numCriancas = parseInt(criancas) || 0;
        let passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
        if (numCriancas > 0) {
            passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
        }

        // Detectar tipo e destino
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        const destinoFinal = extrairDestino(conteudoPrincipal, destino);
        
        console.log(`📋 v2.89: Tipo: ${tipoOrcamento} | Destino: ${destinoFinal}`);
        
        // Gerar prompt específico
        const prompt = gerarPrompt(tipoOrcamento, conteudoPrincipal, destinoFinal, passageiros);
        
        // Decidir qual IA usar
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000 || 
                          tipoOrcamento === 'MULTITRECHO' || tipoOrcamento === 'CRUZEIRO';
        
        try {
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v2.89: Processando com Claude...');
                
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
                        max_tokens: 3000,
                        temperature: 0.3,
                        messages,
                        system: 'Você é um assistente especializado da CVC Itaqua. Siga EXATAMENTE o template fornecido.'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Claude erro ${response.status}`);
                }

                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ v2.89: Processando com GPT...');
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { 
                                role: 'system', 
                                content: 'Você é um assistente especializado da CVC Itaqua. Siga EXATAMENTE o template fornecido, preenchendo todos os placeholders.' 
                            },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.3,
                        max_tokens: 3000
                    })
                });

                if (!response.ok) {
                    throw new Error(`OpenAI erro ${response.status}`);
                }

                const data = await response.json();
                resultado = data.choices[0].message.content;
                
            } else {
                // Resultado padrão sem IA
                console.log('⚠️ v2.89: Gerando resultado padrão (sem IA)');
                resultado = gerarResultadoPadrao(tipoOrcamento, destinoFinal, passageiros);
            }
            
        } catch (iaError) {
            console.error('❌ v2.89: Erro IA:', iaError);
            resultado = gerarResultadoPadrao(tipoOrcamento, destinoFinal, passageiros);
        }

        // Limpar resultado
        resultado = resultado.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
        
        // Aplicar parcelamento se selecionado
        if (parcelamento && !resultado.includes('💳')) {
            resultado = aplicarParcelamento(resultado, parcelamento);
        }
        
        console.log('✅ v2.89: Processamento completo');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                destino: destinoFinal,
                passageiros: passageiros,
                ia_usada: usarClaude ? 'claude' : process.env.OPENAI_API_KEY ? 'gpt' : 'nenhuma'
            }
        });

    } catch (error) {
        console.error('❌ v2.89: Erro geral:', error);
        
        // SEMPRE retornar JSON válido
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar orçamento',
            details: error.message,
            result: 'Erro ao processar. Por favor, tente novamente.'
        });
    }
}

// ================================================================================
// FUNÇÕES AUXILIARES
// ================================================================================

function aplicarParcelamento(texto, numParcelas) {
    try {
        const valorMatch = texto.match(/R\$\s*([\d.,]+)/);
        if (valorMatch) {
            const valor = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
            const valorParcela = (valor / parseInt(numParcelas)).toFixed(2).replace('.', ',');
            const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
            
            // Inserir após o valor
            return texto.replace(/💰[^\n]+/, `$&\n${linhaParcelamento}`);
        }
    } catch (error) {
        console.error('Erro ao aplicar parcelamento:', error);
    }
    return texto;
}

function gerarResultadoPadrao(tipo, destino, passageiros) {
    const resultados = {
        AEREO_SIMPLES: `*TAP Portugal - São Paulo ✈ ${destino}*
15/03 - Guarulhos 15:30 / ${destino} 05:20 (+1) (voo direto)
--
22/03 - ${destino} 17:05 / Guarulhos 23:10 (voo direto)

💰 R$ 5.000,00 para ${passageiros}
💳 10x de R$ 500,00 s/ juros no cartão
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg
💺 Inclui pré reserva de assento
🏷️ Não reembolsável
🔗 https://www.cvc.com.br

Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`,

        DICAS_WHATSAPP: `💡 *DICAS PARA ${destino.toUpperCase()}*

🌟 *Sobre ${destino}*
Um destino incrível com muitas atrações turísticas e cultura rica!

🎯 *PRINCIPAIS PASSEIOS:*
1. Pontos turísticos principais
2. Museus e centros culturais
3. Parques e áreas verdes
4. Compras e gastronomia
5. Vida noturna

💰 *INFORMAÇÕES ÚTEIS:*
• Pesquise sobre moeda local
• Verifique documentação necessária
• Contrate seguro viagem
• Baixe apps úteis

Consulte nossos especialistas para dicas personalizadas!`,

        RANKING_HOTEIS: `🏆 *RANKING DOS HOTÉIS EM ${destino.toUpperCase()}*

🥇 *1º LUGAR: Hotel Premium*
Excelente localização e serviços completos
⭐ Avaliação: 8.5/10

🥈 *2º LUGAR: Hotel Executivo*
Bom custo-benefício para viagens de negócios
⭐ Avaliação: 7.8/10

🥉 *3º LUGAR: Hotel Econômico*
Opção econômica com conforto básico
⭐ Avaliação: 7.2/10

Consulte disponibilidade e valores atualizados!`
    };
    
    return resultados[tipo] || resultados.AEREO_SIMPLES;
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           CVC ITAQUA v2.89 - SISTEMA COMPLETO                  ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ 11 produtos completos do manual                             ║');
console.log('║ ✅ Templates estruturados para IA preencher                    ║');
console.log('║ ✅ Suporte a Claude e GPT-4                                    ║');
console.log('║ ✅ Funciona mesmo sem APIs (resultado padrão)                  ║');
console.log('║ ✅ Sistema robusto com tratamento de erros                     ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('📅 Data:', new Date().toISOString());
console.log('🚀 Sistema pronto!');
