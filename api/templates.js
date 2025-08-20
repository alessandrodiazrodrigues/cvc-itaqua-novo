// api/templates.js - CVC ITAQUA v3.12
// ARQUIVO 1: TEMPLATES E CONSTANTES
// ================================================================================

export const CONFIG = {
    VERSION: '3.12',
    SISTEMA: 'CVC ITAQUA'
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
    'PLU': 'Pampulha',
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
    'VIX': 'Vitória',
    
    // Internacional - Principais
    'MCO': 'Orlando',
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
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 
    'MIA': 'Miami', 
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
    'MVD': 'Montevidéu'
};

// ================================================================================
// REGRAS DE BAGAGEM
// ================================================================================

export const REGRAS_BAGAGEM = {
    SEM_DESPACHADA: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
    COM_DESPACHADA_23KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg',
    COM_DESPACHADA_32KG: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 32kg',
    DUAS_DESPACHADAS: 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 2 bagagens despachadas de 23kg cada',
    SO_MAO: 'Só mala de mão incluída',
    MAO_DESPACHADA: 'Mala de mão + bagagem despachada',
    MAO_DUAS_DESPACHADAS: 'Mala de mão + 2 bagagens despachadas'
};

// ================================================================================
// TEMPLATES DOS PRODUTOS (TODOS DO MANUAL)
// ================================================================================

export const TEMPLATES = {
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada_ida} ({tipo_voo_ida})
--
{data_volta} - {aeroporto_destino} {hora_volta} / {aeroporto_origem} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor_total} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,
    
    // 2. AÉREO COM CONEXÃO DETALHADA  
    AEREO_CONEXAO_DETALHADA: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
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

    // 3. AÉREO SOMENTE IDA
    AEREO_SOMENTE_IDA: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
Inclui 1 item pessoal + 01 mala de mão de 10kg por pessoa
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade`,

    // 4. MÚLTIPLAS OPÇÕES - 2 PLANOS
    MULTIPLAS_OPCOES_2: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
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

    // 5. MÚLTIPLAS OPÇÕES - 3 PLANOS
    MULTIPLAS_OPCOES_3: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
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

    // 6. MULTITRECHO
    MULTITRECHO: `*Multitrecho - {companhias}*
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

    // 7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS
    MULTIPLAS_COMPANHIAS: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
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

    // 8. HOTÉIS - MÚLTIPLAS OPÇÕES
    HOTEIS_MULTIPLAS: `*Hotéis em {destino}*
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

    // 9. ROTEIRO DE HOTÉIS
    ROTEIRO_HOTEIS: `*Roteiro {destino}*
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

    // 10. PACOTE COMPLETO
    PACOTE_COMPLETO: `*Pacote {destino}*
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

    // 11. CRUZEIRO
    CRUZEIRO: `🚢 *Cruzeiro {nome_navio}* – {duracao} noites
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

    // 12. DICAS DE DESTINO
    DICAS: `━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA {DESTINO}*
━━━━━━━━━━━━━━━━━━

🌟 *Sobre o destino*
{descricao_destino}

🎯 *PRINCIPAIS PASSEIOS:*
1. {passeio1}
2. {passeio2}
3. {passeio3}
4. {passeio4}
5. {passeio5}

🌡️ *CLIMA:*
• Temperatura: {temp_min}°C a {temp_max}°C
• {condicao_clima}
• Leve: {roupas_recomendadas}

🍽️ *GASTRONOMIA:*
• Pratos típicos: {pratos_tipicos}
• Preço médio refeição: R$ {preco_refeicao}
• Dica: {restaurante_regiao}

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ {transporte_publico}
• Táxi do aeroporto: R$ {taxi_aeroporto}
• Entrada museus: R$ {entrada_museus}

📱 *DICAS PRÁTICAS:*
• {moeda_cambio}
• {idioma}
• {gorjetas}
• {seguranca}

🚨 *IMPORTANTE:*
{avisos_especificos}`,

    // 13. RANKING DE HOTÉIS
    RANKING_HOTEIS: `🏆 *RANKING DE HOTÉIS - {DESTINO}*
━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ *CATEGORIA LUXO*

🥇 *1º - {hotel_luxo1}*
📍 {localizacao_luxo1}
💰 Diária média: R$ {valor_luxo1}
✨ {diferencial_luxo1}

🥈 *2º - {hotel_luxo2}*
📍 {localizacao_luxo2}
💰 Diária média: R$ {valor_luxo2}
✨ {diferencial_luxo2}

━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐ *CATEGORIA SUPERIOR*

🥇 *1º - {hotel_superior1}*
📍 {localizacao_superior1}
💰 Diária média: R$ {valor_superior1}
✨ {diferencial_superior1}

🥈 *2º - {hotel_superior2}*
📍 {localizacao_superior2}
💰 Diária média: R$ {valor_superior2}
✨ {diferencial_superior2}

━━━━━━━━━━━━━━━━━━

⭐⭐⭐ *CATEGORIA ECONÔMICA*

🥇 *1º - {hotel_economico1}*
📍 {localizacao_economico1}
💰 Diária média: R$ {valor_economico1}
✨ {diferencial_economico1}

🥈 *2º - {hotel_economico2}*
📍 {localizacao_economico2}
💰 Diária média: R$ {valor_economico2}
✨ {diferencial_economico2}

━━━━━━━━━━━━━━━━━━

📌 *DICA:* {dica_escolha_hotel}`
};

// ================================================================================
// EXPORTS
// ================================================================================

export default {
    CONFIG,
    AEROPORTOS,
    TEMPLATES,
    REGRAS_BAGAGEM
};
