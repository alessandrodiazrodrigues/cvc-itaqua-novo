// api/ai-google.js - CVC ITAQUA v2.91 FINAL COMPLETO
// Sistema com todos os 11 produtos e pós-processamento robusto

// ================================================================================
// CONFIGURAÇÕES E CONSTANTES
// ================================================================================

const CONFIG = {
    VERSION: '2.91'
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
    'BCN': 'Barcelona', 'CDG': 'Paris Charles de Gaulle', 'FCO': 'Roma Fiumicino',
    'MXP': 'Milão Malpensa', 'VCE': 'Veneza', 'NAP': 'Nápoles',
    'LHR': 'Londres Heathrow', 'AMS': 'Amsterdam', 'FRA': 'Frankfurt',
    'MUC': 'Munique', 'ZRH': 'Zurique', 'VIE': 'Viena',
    
    // Internacional - Américas
    'JFK': 'Nova York JFK', 'MIA': 'Miami', 'MCO': 'Orlando',
    'LAX': 'Los Angeles', 'SFO': 'São Francisco', 'LAS': 'Las Vegas',
    'CUN': 'Cancún', 'MEX': 'Cidade do México', 'PTY': 'Panamá',
    'EZE': 'Ezeiza', 'SCL': 'Santiago', 'LIM': 'Lima',
    'BOG': 'Bogotá', 'UIO': 'Quito', 'MVD': 'Montevidéu'
};

// ================================================================================
// TEMPLATES DOS 11 PRODUTOS COMPLETOS
// ================================================================================

const TEMPLATES = {
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
// EXTRAÇÃO INTELIGENTE DE DADOS
// ================================================================================

function extrairDadosCompletos(conteudoPrincipal) {
    const dados = {
        opcoes: [],
        passageiros: null,
        destino: null
    };
    
    try {
        // Extrair passageiros com formato correto
        const matchPassageiros = conteudoPrincipal.match(/Total\s*\((\d+)\s*Adultos?\s*(?:e\s*)?(\d*)\s*Crianças?\)/i);
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]);
            const criancas = parseInt(matchPassageiros[2]) || 0;
            
            dados.passageiros = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                // CORREÇÃO: singular/plural correto para crianças
                dados.passageiros += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        }
        
        // Dividir por blocos de orçamento (cada um com valor próprio)
        const blocos = conteudoPrincipal.split(/(?=\bR\$\s*[\d.,]+\s*\n)/);
        
        blocos.forEach((bloco, index) => {
            if (!bloco.includes('R$')) return;
            
            const opcao = {
                numero: index + 1,
                companhia: null,
                valor: null,
                parcelamento: null,
                bagagem: null,
                assento: null,
                link: null,
                tipoVoo: null,
                escala: null
            };
            
            // Companhia
            const matchCompanhia = bloco.match(/(Iberia|Tap portugal|Latam|Gol|Azul|American|United)/i);
            if (matchCompanhia) {
                opcao.companhia = matchCompanhia[1].replace(/tap portugal/i, 'Tap Portugal');
            }
            
            // Valor ESPECÍFICO deste bloco
            const matchValor = bloco.match(/Total[^R]*R\$\s*([\d.,]+)/);
            if (matchValor) {
                opcao.valor = matchValor[1];
            } else {
                const matchValorSimples = bloco.match(/R\$\s*([\d.,]+)/);
                if (matchValorSimples) opcao.valor = matchValorSimples[1];
            }
            
            // Parcelamento ESPECÍFICO deste bloco
            const matchParc = bloco.match(/Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i);
            if (matchParc && opcao.valor) {
                const totalParcelas = parseInt(matchParc[2]) + 1;
                opcao.parcelamento = `Total de R$ ${opcao.valor} em até ${totalParcelas}x, sendo a primeira de R$ ${matchParc[1]}, mais ${matchParc[2]}x de R$ ${matchParc[3]} s/ juros no cartão`;
            } else if (opcao.valor) {
                // Parcelamento padrão se não houver
                opcao.parcelamento = `10x de R$ ${(parseFloat(opcao.valor.replace(/\./g, '').replace(',', '.')) / 10).toFixed(2).replace('.', ',')} s/ juros no cartão`;
            }
            
            // Bagagem
            if (bloco.toLowerCase().includes('sem') && bloco.toLowerCase().includes('bagagem')) {
                opcao.bagagem = 'Inclui 1 item pessoal + 1 mala de mão de 10kg';
            } else if (bloco.toLowerCase().includes('com bagagem') || bloco.toLowerCase().includes('com abagegem')) {
                opcao.bagagem = 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
            }
            
            // Assento
            if (bloco.toLowerCase().includes('pre reserva') || bloco.toLowerCase().includes('pré reserva')) {
                opcao.assento = 'Inclui pré reserva de assento';
            }
            
            // Tipo de voo
            if (bloco.toLowerCase().includes('voo direto')) {
                opcao.tipoVoo = 'voo direto';
            } else if (bloco.toLowerCase().includes('uma escala')) {
                opcao.tipoVoo = 'com conexão';
                // Detectar cidade da escala
                if (opcao.companhia === 'Iberia') {
                    opcao.escala = 'Madrid';
                }
            }
            
            // Link
            const matchLink = bloco.match(/https:\/\/www\.cvc\.com\.br[^\s]*/);
            if (matchLink) opcao.link = matchLink[0];
            
            if (opcao.valor) dados.opcoes.push(opcao);
        });
        
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
    }
    
    return dados;
}

// ================================================================================
// PÓS-PROCESSAMENTO ROBUSTO v2.91
// ================================================================================

function posProcessarResultado(texto, conteudoOriginal) {
    try {
        console.log('🔧 Pós-processamento v2.91...');
        
        let resultado = texto;
        
        // Extrair dados reais do conteúdo original
        const dadosReais = extrairDadosCompletos(conteudoOriginal);
        
        // 1. Corrigir datas
        resultado = corrigirDatas(resultado);
        
        // 2. Converter códigos de aeroporto
        resultado = converterCodigosAeroporto(resultado);
        
        // 3. Corrigir passageiros com dados reais
        if (dadosReais.passageiros) {
            resultado = corrigirPassageiros(resultado, dadosReais.passageiros);
        }
        
        // 4. Corrigir formato de voo e remover duplicações
        resultado = corrigirFormatoVoo(resultado, conteudoOriginal);
        
        // 5. Corrigir links
        resultado = corrigirLinks(resultado);
        
        // 6. Corrigir valores e parcelamentos INDIVIDUAIS
        resultado = corrigirValoresEParcelamentos(resultado, dadosReais);
        
        // 7. Corrigir bagagem
        resultado = corrigirBagagem(resultado, dadosReais);
        
        // 8. Adicionar (+1) quando necessário
        resultado = adicionarDiaSeguinte(resultado);
        
        // 9. Adicionar "OPÇÃO X" se necessário
        resultado = adicionarNumeracaoOpcoes(resultado);
        
        // 10. Garantir versão no final
        resultado = garantirVersao(resultado);
        
        // 11. Limpar formatação
        resultado = limparFormatacao(resultado);
        
        console.log('✅ Pós-processamento v2.91 completo');
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro no pós-processamento:', error);
        return texto;
    }
}

function corrigirDatas(texto) {
    const meses = {
        'janeiro': '01', 'jan': '01',
        'fevereiro': '02', 'fev': '02',
        'março': '03', 'mar': '03',
        'abril': '04', 'abr': '04',
        'maio': '05', 'mai': '05',
        'junho': '06', 'jun': '06',
        'julho': '07', 'jul': '07',
        'agosto': '08', 'ago': '08',
        'setembro': '09', 'set': '09',
        'outubro': '10', 'out': '10',
        'novembro': '11', 'nov': '11',
        'dezembro': '12', 'dez': '12'
    };
    
    let resultado = texto;
    
    // Remover dias da semana e formatar datas
    resultado = resultado.replace(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    resultado = resultado.replace(/(\d{1,2})\s+de\s+(\w+)/gi, (match, dia, mes) => {
        const mesNum = meses[mes.toLowerCase()] || mes;
        return `${dia.padStart(2, '0')}/${mesNum}`;
    });
    
    return resultado;
}

function converterCodigosAeroporto(texto) {
    let resultado = texto;
    
    Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
        // Converter em contextos de horário
        const regex = new RegExp(`\\b${codigo}\\b`, 'g');
        resultado = resultado.replace(regex, nome);
    });
    
    return resultado;
}

function corrigirPassageiros(texto, passageirosCorretos) {
    // Substituir qualquer formato de passageiros pelo correto
    return texto.replace(/\d{2} adultos?(?:\s*\+\s*\d{2} crianças?)?/gi, passageirosCorretos);
}

function corrigirFormatoVoo(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Remover duplicações de parênteses e formato de voo
    resultado = resultado.replace(/\(\(([^)]+)\)\)/g, '($1)');
    resultado = resultado.replace(/\(voo \(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(voo direto\)\)/g, '(voo direto)');
    resultado = resultado.replace(/\(\(com conexão\)\)/g, '(com conexão)');
    
    // Adicionar cidade da escala se for Iberia
    if (conteudoOriginal.toLowerCase().includes('iberia')) {
        resultado = resultado.replace(/\(com conexão\)/g, '(uma escala em Madrid)');
    }
    
    // Limpar linhas de voo
    resultado = resultado.replace(/Ida:\s*/gi, '');
    resultado = resultado.replace(/Volta:\s*/gi, '');
    resultado = resultado.replace(/Classe Econômica/gi, '');
    resultado = resultado.replace(/\s+Uma escala\s+/gi, ' ');
    resultado = resultado.replace(/\s+Voo direto\s+/gi, ' ');
    
    return resultado;
}

function corrigirLinks(texto) {
    return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $2');
}

function corrigirValoresEParcelamentos(texto, dadosReais) {
    if (!dadosReais.opcoes || dadosReais.opcoes.length === 0) return texto;
    
    let resultado = texto;
    
    // Para cada opção encontrada
    dadosReais.opcoes.forEach((opcao, index) => {
        if (!opcao.valor) return;
        
        // Criar padrão para encontrar cada bloco de opção
        const padrao = new RegExp(
            `(OPÇÃO ${index + 1}[^]*?)💰 R\\$ [\\d.,]+([^]*?)💳[^\\n]+`,
            'gi'
        );
        
        resultado = resultado.replace(padrao, (match, antes, depois) => {
            return `${antes}💰 R$ ${opcao.valor}${depois}💳 ${opcao.parcelamento}`;
        });
    });
    
    return resultado;
}

function corrigirBagagem(texto, dadosReais) {
    if (!dadosReais.opcoes || dadosReais.opcoes.length === 0) return texto;
    
    let resultado = texto;
    
    dadosReais.opcoes.forEach((opcao, index) => {
        if (!opcao.bagagem) return;
        
        const padrao = new RegExp(
            `(OPÇÃO ${index + 1}[^]*?)✅[^\\n]+`,
            'gi'
        );
        
        resultado = resultado.replace(padrao, (match, antes) => {
            return `${antes}✅ ${opcao.bagagem}`;
        });
    });
    
    // Corrigir bagagem geral
    resultado = resultado.replace(/✅ Não inclui bagagem/g, '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg');
    resultado = resultado.replace(/✅ Sem bagagem/g, '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg');
    resultado = resultado.replace(/✅ Com bagagem/g, '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg');
    
    return resultado;
}

function adicionarDiaSeguinte(texto) {
    let resultado = texto;
    const linhas = resultado.split('\n');
    
    linhas.forEach((linha, index) => {
        if (linha.includes(' - ') && linha.includes(' / ') && !linha.includes('(+1)')) {
            // Verificar se é voo noturno ou longo
            const horaMatch = linha.match(/(\d{2}):(\d{2})[^\/]+\/[^0-9]*(\d{2}):(\d{2})/);
            if (horaMatch) {
                const horaSaida = parseInt(horaMatch[1]);
                const horaChegada = parseInt(horaMatch[3]);
                
                // Se sai tarde e chega cedo, adicionar (+1)
                if ((horaSaida >= 15 && horaChegada <= 10) || linha.includes('9h') || linha.includes('10h')) {
                    linhas[index] = linha.replace(/(\d{2}:\d{2})(\s*\([^)]+\))?$/, '$1 (+1)$2');
                }
            }
        }
    });
    
    return linhas.join('\n');
}

function adicionarNumeracaoOpcoes(texto) {
    let resultado = texto;
    let opcaoNum = 1;
    
    // Adicionar "OPÇÃO X" se não existir
    resultado = resultado.replace(/^\*(?!OPÇÃO)([^*]+\*)/gm, (match, content) => {
        if (content.includes('✈')) {
            return `*OPÇÃO ${opcaoNum++} - ${content}`;
        }
        return match;
    });
    
    return resultado;
}

function garantirVersao(texto) {
    const versaoTexto = `Valores sujeitos a confirmação e disponibilidade (v${CONFIG.VERSION})`;
    
    // Remover versão antiga
    texto = texto.replace(/Valores sujeitos a confirmação e disponibilidade \(v[\d.]+\)/g, '');
    
    // Adicionar versão correta no final
    if (!texto.includes(versaoTexto)) {
        texto = texto.trim() + '\n\n' + versaoTexto;
    }
    
    return texto;
}

function limparFormatacao(texto) {
    let resultado = texto;
    
    // Remover múltiplas quebras de linha
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços extras
    resultado = resultado.split('\n').map(linha => linha.trimEnd()).join('\n');
    
    return resultado.trim();
}

// ================================================================================
// DETECÇÃO DE TIPO
// ================================================================================

function detectarTipoOrcamento(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // Prioridade 1: Tipos selecionados
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Dicas')) return 'DICAS_WHATSAPP';
            if (tipos.includes('Ranking')) return 'RANKING_HOTEIS';
            if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
            if (tipos.includes('Multitrechos')) return 'MULTITRECHO';
            if (tipos.includes('Hotel') && tipos.includes('Aéreo')) return 'PACOTE_COMPLETO';
            if (tipos.includes('Hotel')) return 'SOMENTE_HOTEL';
        }
        
        // Prioridade 2: Detecção por conteúdo
        if (conteudoLower.includes('multitrecho')) return 'MULTITRECHO';
        if (conteudoLower.includes('cruzeiro')) return 'CRUZEIRO';
        if (conteudoLower.includes('seguro viagem')) return 'SEGURO_VIAGEM';
        if (conteudoLower.includes('ingresso')) return 'INGRESSOS';
        if (conteudoLower.includes('locação') || conteudoLower.includes('aluguel de carro')) return 'LOCACAO_CARRO';
        if (conteudoLower.includes('pacote') && conteudoLower.includes('hotel')) return 'PACOTE_COMPLETO';
        if (conteudoLower.includes('hotel') && !conteudoLower.includes('aéreo')) return 'SOMENTE_HOTEL';
        
        // Detectar múltiplas opções
        const valores = (conteudoPrincipal.match(/R\$\s*[\d.,]+/g) || []).length;
        const links = (conteudoPrincipal.match(/https:\/\/www\.cvc\.com\.br/g) || []).length;
        
        if (valores >= 3 || links >= 2) {
            return 'MULTIPLAS_OPCOES';
        }
        
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error('Erro ao detectar tipo:', error);
        return 'AEREO_SIMPLES';
    }
}

// ================================================================================
// GERAÇÃO DE PROMPT
// ================================================================================

function gerarPrompt(tipoOrcamento, conteudoPrincipal, destino, passageiros) {
    const template = TEMPLATES[tipoOrcamento] || TEMPLATES.AEREO_SIMPLES;
    const dados = extrairDadosCompletos(conteudoPrincipal);
    
    let prompt = `
TAREFA: Formatar orçamento CVC para WhatsApp.
TIPO: ${tipoOrcamento}
DESTINO: ${destino}

TEMPLATE A SEGUIR EXATAMENTE:
${template}

DADOS DO CONTEÚDO:
${conteudoPrincipal}

REGRAS CRÍTICAS:
1. Datas: DD/MM (não "11 de julho")
2. Aeroportos: nomes completos (Guarulhos, não GRU)
3. Tipo voo: (voo direto) ou (uma escala em cidade) ou (com conexão)
4. Links: direto, sem markdown
5. Passageiros: ${passageiros || dados.passageiros || '02 adultos'}
6. Valores: manter originais do conteúdo
7. NÃO inventar informações

PREENCHA TODOS OS PLACEHOLDERS {} DO TEMPLATE.`;

    return prompt;
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

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'operational',
            version: CONFIG.VERSION,
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.91 - Sistema Completo',
            produtos: Object.keys(TEMPLATES).length + ' produtos disponíveis'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido'
        });
    }

    try {
        console.log('🚀 v2.91: Processando requisição...');
        
        const {
            observacoes = '',
            textoColado = '',
            destino = '',
            adultos = 2,
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

        // Detectar tipo
        const tipoOrcamento = detectarTipoOrcamento(conteudoPrincipal, tipos);
        
        // Extrair dados
        const dadosExtraidos = extrairDadosCompletos(conteudoPrincipal);
        
        // Usar passageiros extraídos ou do formulário
        let passageiros = dadosExtraidos.passageiros;
        if (!passageiros) {
            const numAdultos = parseInt(adultos) || 2;
            const numCriancas = parseInt(criancas) || 0;
            passageiros = `${String(numAdultos).padStart(2, '0')} adulto${numAdultos > 1 ? 's' : ''}`;
            if (numCriancas > 0) {
                passageiros += ` + ${String(numCriancas).padStart(2, '0')} criança${numCriancas > 1 ? 's' : ''}`;
            }
        }
        
        console.log(`📋 v2.91: Tipo: ${tipoOrcamento} | Passageiros: ${passageiros}`);
        
        // Gerar prompt
        const prompt = gerarPrompt(tipoOrcamento, conteudoPrincipal, destino, passageiros);
        
        // Processar com IA
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        
        try {
            if (usarClaude && process.env.ANTHROPIC_API_KEY) {
                console.log('🔮 v2.91: Usando Claude...');
                
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
                        temperature: 0.1,
                        messages
                    })
                });

                const data = await response.json();
                resultado = data.content[0].text;
                
            } else if (process.env.OPENAI_API_KEY) {
                console.log('⚡ v2.91: Usando GPT-4...');
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'Siga EXATAMENTE o template fornecido.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.1,
                        max_tokens: 3000
                    })
                });

                const data = await response.json();
                resultado = data.choices[0].message.content;
            }
            
        } catch (iaError) {
            console.error('❌ v2.91: Erro IA:', iaError);
            throw iaError;
        }

        // APLICAR PÓS-PROCESSAMENTO ROBUSTO
        resultado = posProcessarResultado(resultado, conteudoPrincipal);
        
        console.log('✅ v2.91: Processamento completo');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: CONFIG.VERSION,
                tipo: tipoOrcamento,
                passageiros: passageiros,
                ia_usada: usarClaude ? 'claude' : 'gpt',
                pos_processado: true,
                opcoes_detectadas: dadosExtraidos.opcoes.length
            }
        });

    } catch (error) {
        console.error('❌ v2.91: Erro:', error);
        
        return res.status(200).json({
            success: false,
            error: 'Erro ao processar',
            details: error.message
        });
    }
}

// ================================================================================
// LOGS
// ================================================================================
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║            CVC ITAQUA v2.91 - SISTEMA FINAL COMPLETO           ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ ✅ 11 produtos completos do manual                             ║');
console.log('║ ✅ Pós-processamento robusto                                   ║');
console.log('║ ✅ Correção de valores e parcelamentos individuais             ║');
console.log('║ ✅ Formatação perfeita de bagagem                              ║');
console.log('║ ✅ Detecção inteligente de passageiros                         ║');
console.log('║ ✅ Templates estruturados                                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('🚀 Sistema v2.91 pronto!');
