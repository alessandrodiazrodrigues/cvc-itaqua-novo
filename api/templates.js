// api/templates.js - CVC ITAQUA v3.0
// ARQUIVO 1: TEMPLATES E CONSTANTES (não mexer nas correções)
// ================================================================================

export const CONFIG = {
    VERSION: '3.0'
};

// ================================================================================
// TABELA DE AEROPORTOS
// ================================================================================

export const AEROPORTOS = {
    // Brasil - Principais
    'GRU': 'Guarulhos', 
    'CGH': 'Congonhas', 
    'VCP': 'Viracopos',
    'GIG': 'Galeão', 
    'SDU': 'Santos Dumont', 
    'BSB': 'Brasília',
    'CNF': 'Confins', 
    'SSA': 'Salvador', 
    'REC': 'Recife',
    'FOR': 'Fortaleza', 
    'POA': 'Porto Alegre', 
    'FLN': 'Florianópolis',
    'CWB': 'Curitiba', 
    'MAO': 'Manaus', 
    'BEL': 'Belém',
    'NAT': 'Natal', 
    'MCZ': 'Maceió', 
    'AJU': 'Aracaju',
    'JPA': 'João Pessoa', 
    'THE': 'Teresina', 
    'SLZ': 'São Luís',
    'CGB': 'Cuiabá', 
    'CGR': 'Campo Grande', 
    'GYN': 'Goiânia',
    
    // Internacional - Europa
    'LIS': 'Lisboa', 
    'OPO': 'Porto', 
    'MAD': 'Madrid',
    'BCN': 'Barcelona', 
    'CDG': 'Paris Charles de Gaulle', 
    'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa', 
    'VCE': 'Veneza', 
    'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow', 
    'AMS': 'Amsterdam', 
    'FRA': 'Frankfurt',
    'MUC': 'Munique', 
    'ZRH': 'Zurique', 
    'VIE': 'Viena',
    'BRU': 'Bruxelas', 
    'DUB': 'Dublin', 
    'CPH': 'Copenhague',
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 
    'MIA': 'Miami', 
    'MCO': 'Orlando',
    'LAX': 'Los Angeles', 
    'SFO': 'São Francisco', 
    'LAS': 'Las Vegas',
    'CUN': 'Cancún', 
    'MEX': 'Cidade do México', 
    'PTY': 'Panamá',
    'EZE': 'Ezeiza', 
    'AEP': 'Aeroparque',
    'SCL': 'Santiago', 
    'LIM': 'Lima',
    'BOG': 'Bogotá', 
    'UIO': 'Quito', 
    'MVD': 'Montevidéu',
    'GIG': 'Galeão',
    'DXB': 'Dubai',
    'DOH': 'Doha'
};

// ================================================================================
// TEMPLATES DOS 11 PRODUTOS
// ================================================================================

export const TEMPLATES = {
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} {tipo_voo_ida}
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} {tipo_voo_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
💺 {assento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,
    
    // 1.1. AÉREO COM CONEXÃO DETALHADA
    AEREO_CONEXAO_DETALHADA: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem} {hora_ida1} / {aeroporto_conexao_ida} {hora_chegada_ida1} {tipo_voo_ida1}
{data_ida2} - {aeroporto_conexao_ida} {hora_ida2} / {aeroporto_destino} {hora_chegada_ida2} {tipo_voo_ida2}
        Tempo de conexão: {tempo_conexao_ida} em {cidade_conexao_ida}
--
{data_volta1} - {aeroporto_destino} {hora_volta1} / {aeroporto_conexao_volta} {hora_chegada_volta1} {tipo_voo_volta1}
{data_volta2} - {aeroporto_conexao_volta} {hora_volta2} / {aeroporto_origem} {hora_chegada_volta2} {tipo_voo_volta2}
        Tempo de conexão: {tempo_conexao_volta} em {cidade_conexao_volta}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 2. MÚLTIPLAS OPÇÕES AÉREAS
    MULTIPLAS_OPCOES: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada_ida1} {tipo_voo_ida1}
--
{data_volta1} - {aeroporto_destino1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} {tipo_voo_volta1}

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
✅ {bagagem1}
💺 {assento1}
🏷️ {reembolso1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada_ida2} {tipo_voo_ida2}
--
{data_volta2} - {aeroporto_destino2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} {tipo_voo_volta2}

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
✅ {bagagem2}
💺 {assento2}
🏷️ {reembolso2}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{data_ida3} - {aeroporto_origem3} {hora_ida3} / {aeroporto_destino3} {hora_chegada_ida3} {tipo_voo_ida3}
--
{data_volta3} - {aeroporto_destino3} {hora_volta3} / {aeroporto_origem3} {hora_chegada_volta3} {tipo_voo_volta3}

💰 R$ {valor3} para {passageiros}
💳 {parcelamento3}
✅ {bagagem3}
💺 {assento3}
🏷️ {reembolso3}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,
    
    // 2.1. MÚLTIPLAS OPÇÕES COM CONEXÕES DETALHADAS
    MULTIPLAS_OPCOES_DETALHADAS: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{detalhes_voo_ida1}
--
{detalhes_voo_volta1}

💰 R$ {valor1} para {passageiros}
💳 {parcelamento1}
✅ {bagagem1}
🏷️ {reembolso1}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{detalhes_voo_ida2}
--
{detalhes_voo_volta2}

💰 R$ {valor2} para {passageiros}
💳 {parcelamento2}
✅ {bagagem2}
🏷️ {reembolso2}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{detalhes_voo_ida3}
--
{detalhes_voo_volta3}

💰 R$ {valor3} para {passageiros}
💳 {parcelamento3}
✅ {bagagem3}
🏷️ {reembolso3}
🔗 {link3}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 3. MULTITRECHO
    MULTITRECHO: `*MULTITRECHO - {companhias}*
📅 {data_inicio} a {data_fim} ({total_dias} dias)
👥 {passageiros}

━━━━━━━━━━━━━━━━━━
*TRECHO 1: {origem1} ✈ {destino1}*
{data1} - {aeroporto_origem1} {hora1} / {aeroporto_destino1} {hora_chegada1} {tipo_voo1}
Companhia: {companhia1}

*TRECHO 2: {origem2} ✈ {destino2}*
{data2} - {aeroporto_origem2} {hora2} / {aeroporto_destino2} {hora_chegada2} {tipo_voo2}
Companhia: {companhia2}

*TRECHO 3: {origem3} ✈ {destino3}*
{data3} - {aeroporto_origem3} {hora3} / {aeroporto_destino3} {hora_chegada3} {tipo_voo3}
Companhia: {companhia3}

*TRECHO 4: {origem4} ✈ {destino4}*
{data4} - {aeroporto_origem4} {hora4} / {aeroporto_destino4} {hora_chegada4} {tipo_voo4}
Companhia: {companhia4}

💰 R$ {valor_total} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 4. PACOTE COMPLETO
    PACOTE_COMPLETO: `*🏖️ PACOTE {destino_upper}*
📅 {data_inicio} a {data_fim} ({dias} dias e {noites} noites)
👥 {passageiros}

*✈️ AÉREO {companhia_upper}:*
IDA: {data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} {tipo_voo_ida}
VOLTA: {data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} {tipo_voo_volta}

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

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 5. CRUZEIRO
    CRUZEIRO: `*🚢 CRUZEIRO {nome_navio}*
🗓️ {data_inicio} a {data_fim}
⛴️ {noites} noites
📍 Saída: {porto_saida}
👥 {passageiros}

*🗺️ ROTEIRO:*
Dia 1: {porto1} - Embarque a partir das {hora_embarque}
Dia 2: {porto2}
Dia 3: {porto3}
Dia 4: {porto4}
Dia 5: {porto5} - Desembarque até {hora_desembarque}

*🛏️ CATEGORIAS DE CABINE:*

━━━━━━━━━━━━━━━━━━
*CABINE INTERNA*
• 2 camas baixas ou cama de casal
• Banheiro privativo
• TV e cofre
• Sem janela

💰 R$ {valor_interna} casal
💳 {parcelamento_interna}

━━━━━━━━━━━━━━━━━━
*CABINE EXTERNA*
• 2 camas baixas ou cama de casal
• Janela para o mar
• Banheiro privativo
• TV, cofre e frigobar

💰 R$ {valor_externa} casal
💳 {parcelamento_externa}

━━━━━━━━━━━━━━━━━━
*CABINE COM VARANDA*
• Cama de casal
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

🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 6. SOMENTE HOTEL
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

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

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

Valores sujeitos a confirmação e disponibilidade (v3.0)`,

    // 10. DICAS WHATSAPP
    DICAS_WHATSAPP: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {destino_upper}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre {destino}*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
1. {passeio1}
2. {passeio2}
3. {passeio3}
4. {passeio4}
5. {passeio5}

🌡️ *CLIMA EM {mes_upper}:*
• Temperatura: {temp_min}°C a {temp_max}°C
• {condicao_clima}
• Leve: {roupas_recomendadas}

👶 *COM CRIANÇAS:*
• {atracao_crianca1}
• {atracao_crianca2}
• {atracao_crianca3}
• Dica: {dica_familia}

🍽️ *GASTRONOMIA:*
• Pratos típicos: {pratos_tipicos}
• Preço médio refeição: R$ {preco_refeicao}
• Dica: {dica_restaurante}

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ {custo_transporte}
• Táxi do aeroporto: R$ {custo_taxi}
• Entrada museus: R$ {custo_museu}
• Refeição simples: R$ {custo_refeicao}

📱 *DICAS PRÁTICAS:*
• {moeda_info}
• {idioma_info}
• {gorjeta_info}
• {seguranca_info}

🚨 *IMPORTANTE:*
{avisos_importantes}

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

👶 *DICA PARA FAMÍLIAS:*
{dica_familias}

📌 *OBSERVAÇÕES:*
{observacoes_finais}`
};

// ================================================================================
// PROMPTS PARA CADA TIPO
// ================================================================================

export const PROMPTS = {
    AEREO_SIMPLES: `
Formate um orçamento de passagem aérea simples.
Use EXATAMENTE este formato:
- Datas: DD/MM (não "11 de julho")
- Aeroportos: nomes completos (Guarulhos, não GRU)
- Tipo voo: (voo direto) ou (uma escala em cidade)
- Adicione (+1) se chegar dia seguinte
- Links diretos, sem markdown`,
    
    AEREO_CONEXAO_DETALHADA: `
Formate um orçamento com conexões detalhadas.
IMPORTANTE:
- Incluir data em CADA trecho (11/07, 12/07, etc.)
- Separar cada trecho de voo em linha própria
- Incluir "Tempo de conexão: Xh em Cidade" após os trechos
- Formato: DD/MM - Aeroporto HH:MM / Aeroporto HH:MM (tipo voo)
- Adicione (+1) quando chegar no dia seguinte
- NÃO incluir linha de assento se não tiver pré-reserva`,

    MULTIPLAS_OPCOES: `
Formate múltiplas opções de voo (até 3).
IMPORTANTE:
- Cada opção tem seu próprio valor e parcelamento
- Numere as opções: OPÇÃO 1, OPÇÃO 2, OPÇÃO 3
- Mantenha valores individuais de cada opção
- Detecte bagagem de cada opção separadamente
- Se houver conexões detalhadas, use o formato com todos os trechos`,

    MULTITRECHO: `
Formate um roteiro multitrecho.
- Liste todos os trechos em ordem
- Especifique companhia de cada trecho
- Calcule total de dias
- Mantenha formato de data DD/MM`,

    PACOTE_COMPLETO: `
Formate um pacote completo (aéreo + hotel).
- Combine informações de voo e hospedagem
- Calcule dias e noites corretamente
- Liste incluído/não incluído
- Especifique regime de alimentação`,

    CRUZEIRO: `
Formate um orçamento de cruzeiro.
- Roteiro dia a dia
- 3 categorias de cabine
- Valores crescentes por categoria
- Liste inclusos específicos de cruzeiro`,

    DICAS_WHATSAPP: `
Crie dicas práticas sobre o destino.
- Informações reais e atualizadas
- Custos em moeda local e reais
- Dicas específicas para famílias se houver crianças
- Clima do período específico`,

    RANKING_HOTEIS: `
Crie ranking de 3 hotéis.
- Hotel 1: Premium/Luxo (8.5+ avaliação)
- Hotel 2: Executivo (7.5-8.5 avaliação)  
- Hotel 3: Econômico (7.0-7.5 avaliação)
- Distâncias reais de pontos turísticos
- Recomendação baseada no perfil`
};

// ================================================================================
// REGRAS DE BAGAGEM
// ================================================================================

export const REGRAS_BAGAGEM = {
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg',
    COM_DESPACHADA_32KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 32kg',
    DUAS_DESPACHADAS: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 2 bagagens despachadas de 23kg cada'
};

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    CONFIG,
    AEROPORTOS,
    TEMPLATES,
    PROMPTS,
    REGRAS_BAGAGEM
};
