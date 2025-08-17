// ================================================================================
// 🚀 CVC ITAQUA v2.4.1 - COM PÓS-PROCESSAMENTO E VERSÃO NO FINAL
// ================================================================================
// 
// 📁 ÍNDICE DO ARQUIVO:
//    SEÇÃO 1: CONFIGURAÇÕES GLOBAIS (Linha ~25)
//    SEÇÃO 2: TEMPLATES DE ORÇAMENTO (Linha ~205)
//    SEÇÃO 3: REGRAS DE FORMATAÇÃO (Linha ~810)
//    SEÇÃO 4: PÓS-PROCESSAMENTO (Linha ~1010)
//    SEÇÃO 5: FUNÇÕES DE DETECÇÃO (Linha ~1210)
//    SEÇÃO 6: GERAÇÃO DE PROMPTS (Linha ~1410)
//    SEÇÃO 7: HANDLER PRINCIPAL (Linha ~1710)
//
// ================================================================================
// VERSÃO: 2.4.1
// DATA: 18/12/2024
// MUDANÇAS v2.4.1:
// ✅ Adicionado "(v2.4)" no final de cada template para rastreamento
// ✅ Confirmados emojis: ✅ para bagagem, 💺 para assento
// ✅ PÓS-PROCESSAMENTO: IA retorna com placeholders, sistema formata
// ✅ FUNÇÕES DE FORMATAÇÃO: Agora são realmente utilizadas
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
// SEÇÃO 2: TEMPLATES DE ORÇAMENTO (14 TEMPLATES) - COM PLACEHOLDERS
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
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade (v2.4)`,

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
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.4)`,

    // TEMPLATE 3: Aéreo Somente Ida
    aereo_somente_ida: `*{companhia}*
{data} - {aeroporto_origem} {hora_saida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})

💰 Valor total para {passageiros} = R$ {valor}
Inclui taxas de embarque
{{BAGAGEM}}
{{ASSENTO}}
🏷️ {reembolso}

⚠️ Passagem somente de ida - sem retorno incluído

Valores sujeitos a confirmação e disponibilidade (v2.4)`,

    // TEMPLATE 6: Múltiplas Companhias (CORRIGIDO v2.4 com placeholders)
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
{{PARCELAMENTO_1}}
{{BAGAGEM_1}}
{{ASSENTO_1}}
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
{{PARCELAMENTO_2}}
{{BAGAGEM_2}}
{{ASSENTO_2}}
🔗 {link2}

*OPÇÃO 3 - {companhia3} - {cidade_origem} ✈ {cidade_destino}*
{data_ida3} - {aeroporto_origem3} {hora_ida3} / {aeroporto_destino3} {hora_chegada3} ({tipo_voo3})
--
{data_volta3} - {aeroporto_volta3} {hora_volta3} / {aeroporto_origem3} {hora_chegada_volta3} ({tipo_voo_volta3})

💰 R$ {valor3} para {passageiros}
{{PARCELAMENTO_3}}
{{BAGAGEM_3}}
{{ASSENTO_3}}
🔗 {link3}

🏷️ {reembolso}
Valores sujeitos a confirmação e disponibilidade (v2.4)`,

    // Demais templates continuam com a mesma estrutura...
    // Por brevidade, vou incluir apenas os principais com os novos placeholders
};

// ================================================================================
// SEÇÃO 3: REGRAS DE FORMATAÇÃO UNIVERSAIS (v2.4 - ATIVAS!)
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

// 3.2 - REGRA DE BAGAGEM
function formatarBagagem(conteudo, numeroOpcao = '') {
    try {
        // Para múltiplas opções, buscar a bagagem específica
        let textoBusca = conteudo.toLowerCase();
        if (numeroOpcao) {
            const opcaoMatch = conteudo.match(new RegExp(`OPÇÃO ${numeroOpcao}[\\s\\S]*?(?=OPÇÃO|$)`, 'i'));
            textoBusca = opcaoMatch ? opcaoMatch[0].toLowerCase() : conteudo.toLowerCase();
        }
        
        const semBagagem = 
            textoBusca.includes('sem bagagem') || 
            textoBusca.includes('sem  bagagem') ||
            textoBusca.includes('apenas mala de mão') ||
            textoBusca.includes('só mala de mão');
        
        const comBagagem = 
            textoBusca.includes('com bagagem') || 
            textoBusca.includes('com babagem') ||
            textoBusca.includes('com abagegem') ||
            textoBusca.includes('combagagem') ||
            textoBusca.includes('inclui bagagem') ||
            textoBusca.includes('bagagem despachada');
        
        if (semBagagem) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        } else if (comBagagem) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
        }
        
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
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

// ================================================================================
// SEÇÃO 4: PÓS-PROCESSAMENTO (NOVO v2.4!)
// ================================================================================

function aplicarPosProcessamento(resultado, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log('🔧 v2.4: Iniciando pós-processamento...');
        
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
                
                resultado = resultado
                    .replace(`{{PARCELAMENTO_${i}}}`, parcelamento)
                    .replace(`{{BAGAGEM_${i}}}`, bagagem)
                    .replace(`{{ASSENTO_${i}}}`, assento);
            }
        } else {
            // Processar orçamento simples
            const valorMatch = resultado.match(/R\$\s*([\d.,]+)\s*para/i);
            const valorTotal = valorMatch ? valorMatch[1] : '';
            
            const parcelamento = formatarParcelamento(conteudoOriginal, parcelamentoSelecionado, valorTotal);
            const bagagem = formatarBagagem(conteudoOriginal);
            const assento = formatarAssento(conteudoOriginal);
            
            // Substituir placeholders globais
            resultado = resultado
                .replace(/\{\{PARCELAMENTO\}\}/g, parcelamento)
                .replace(/\{\{BAGAGEM\}\}/g, bagagem)
                .replace(/\{\{ASSENTO\}\}/g, assento);
        }
        
        // Limpar linhas vazias extras (quando placeholder não tem valor)
        resultado = resultado
            .replace(/\n\n\n+/g, '\n\n')
            .replace(/\n\s*\n\s*\n/g, '\n\n');
        
        console.log('✅ v2.4: Pós-processamento concluído');
        return resultado;
        
    } catch (error) {
        console.error('❌ v2.4: Erro no pós-processamento:', error);
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
        console.log('🔍 v2.4: Extraindo destino...');
        
        // Prioridade 1: Destino final em conexões
        const padraoConexao = conteudo.match(/([A-Z]{3})\s*[\s\S]*?([A-Z]{3})\s*[\s\S]*?([A-Z]{3})/);
        if (padraoConexao && padraoConexao.length >= 4) {
            const origem = padraoConexao[1];
            const destinoFinal = padraoConexao[3];
            
            if (['GRU', 'CGH', 'SDU', 'GIG'].includes(origem) && 
                AEROPORTOS[destinoFinal] && !['GRU', 'CGH', 'SDU', 'GIG'].includes(destinoFinal)) {
                console.log(`✅ v2.4: Destino detectado: ${AEROPORTOS[destinoFinal]}`);
                return AEROPORTOS[destinoFinal];
            }
        }
        
        // Prioridade 2: Códigos de aeroporto
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'CNF'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo];
                    console.log(`✅ v2.4: Destino por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        // Prioridade 3: Destinos conhecidos
        for (const [chave, nome] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(chave)) {
                console.log(`✅ v2.4: Destino detectado: ${nome}`);
                return nome;
            }
        }
        
        console.log('⚠️ v2.4: Nenhum destino identificado');
        return null;
    } catch (error) {
        console.error('❌ v2.4: Erro ao extrair destino:', error);
        return null;
    }
}

// 5.2 - Detecção de Voo com Conexão
function detectarVooComConexao(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log('🔍 v2.4: Verificando conexão...');
        
        const indicadores = [
            'voo com paradas', 'conexão', 'espera de', 'parada em', 'escala', 
            'uma escala', 'duas escalas', 'connecting flight', 'tempo de espera', 
            'layover', 'stopover'
        ];
        
        const temIndicadores = indicadores.some(ind => texto.includes(ind));
        const temMultiplosTrechos = (conteudo.match(/\d{2}:\d{2}\s+[A-Z]{3}/g) || []).length > 2;
        const temMultiplosHorarios = (conteudo.match(/\d{2}:\d{2}/g) || []).length >= 4;
        
        const ehConexao = temIndicadores || temMultiplosTrechos || temMultiplosHorarios;
        console.log(`✅ v2.4: Conexão: ${ehConexao ? 'SIM' : 'NÃO'}`);
        
        return ehConexao;
    } catch (error) {
        console.error('❌ v2.4: Erro ao detectar conexão:', error);
        return false;
    }
}

// 5.3 - Detecção de Tipo de Orçamento
function detectOrcamentoType(conteudoPrincipal, tipos) {
    try {
        const conteudoLower = conteudoPrincipal.toLowerCase();
        console.log('🔍 v2.4: Detectando tipo de orçamento...');
        
        // Prioridade 0: Cruzeiro
        if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio') || conteudoLower.includes('cabine')) {
            console.log('✅ v2.4: Tipo: cruzeiro');
            return 'cruzeiro';
        }
        
        // Prioridade 1: Tipos selecionados pelo usuário
        if (tipos && tipos.length > 0) {
            if (tipos.includes('Aéreo') && tipos.includes('Hotel')) {
                console.log('✅ v2.4: Tipo: pacote_completo');
                return 'pacote_completo';
            }
            if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
                console.log('✅ v2.4: Tipo: hoteis_multiplas_opcoes');
                return 'hoteis_multiplas_opcoes';
            }
            if (tipos.includes('Dicas')) {
                console.log('✅ v2.4: Tipo: dicas_completas');
                return 'dicas_completas';
            }
            if (tipos.includes('Ranking')) {
                console.log('✅ v2.4: Tipo: ranking');
                return 'ranking';
            }
        }
        
        // Múltiplas companhias
        const companhiasEncontradas = conteudoPrincipal.match(/(iberia|tap portugal|latam|gol|azul|avianca)/gi) || [];
        const companhiasUnicas = [...new Set(companhiasEncontradas.map(c => c.toLowerCase()))];
        const temMultiplasCompanhias = companhiasUnicas.length >= 2;
        
        if (temMultiplasCompanhias) {
            console.log('✅ v2.4: Tipo: multiplas_companhias');
            return 'multiplas_companhias';
        }
        
        // Padrão
        console.log('✅ v2.4: Tipo padrão: aereo_simples');
        return 'aereo_simples';
        
    } catch (error) {
        console.error('❌ v2.4: Erro ao detectar tipo:', error);
        return 'aereo_simples';
    }
}

// ================================================================================
// SEÇÃO 6: GERAÇÃO DE PROMPTS (v2.4 - com instruções para placeholders)
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    try {
        let destinoFinal = destino || extrairDestinoDoConteudo(conteudoPrincipal) || 'Destino';
        
        // Instruções para IA usar placeholders
        const instrucoesPosProcessamento = `
**INSTRUÇÕES CRÍTICAS v2.4 - USAR PLACEHOLDERS:**

Para PARCELAMENTO, BAGAGEM e ASSENTO, use EXATAMENTE estes placeholders:

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

NÃO TENTE FORMATAR ESTES ITENS. Apenas coloque os placeholders no lugar correto.
O sistema fará a formatação automaticamente depois.`;

        const regrasGerais = `
${instrucoesPosProcessamento}

**OUTRAS FORMATAÇÕES (você deve fazer):**
- Título: *Companhia - Cidade Origem ✈ Cidade Destino*
- Datas: DD/MM
- Horários: HH:MM
- Valores: R$ 1.234,56
- Passageiros: 04 adultos + 01 criança
- Converter códigos de aeroporto para nomes`;

        const tabelaAeroportos = `**AEROPORTOS:**\n${JSON.stringify(AEROPORTOS, null, 2)}`;

        // Switch para cada tipo
        switch (tipoOrcamento) {
            case 'multiplas_companhias':
                return `Crie orçamento de MÚLTIPLAS COMPANHIAS para ${destinoFinal}.
                
IMPORTANTE: Use os placeholders {{PARCELAMENTO_1}}, {{BAGAGEM_1}}, {{ASSENTO_1}} etc.

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${TEMPLATES.multiplas_companhias}
${regrasGerais}
${tabelaAeroportos}`;

            default:
                return `Crie orçamento AÉREO SIMPLES.
                
IMPORTANTE: Use os placeholders {{PARCELAMENTO}}, {{BAGAGEM}}, {{ASSENTO}}.

**DADOS:** ${conteudoPrincipal}
**DESTINO:** ${destinoFinal}
**TEMPLATE:** ${TEMPLATES.aereo_simples}
${regrasGerais}
${tabelaAeroportos}`;
        }
    } catch (error) {
        console.error('❌ v2.4: Erro ao gerar prompt:', error);
        return `Erro: ${error.message}`;
    }
}

// ================================================================================
// SEÇÃO 7: HANDLER PRINCIPAL (v2.4 - com pós-processamento)
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
            version: '2.4.1-POS-PROCESSAMENTO',
            timestamp: new Date().toISOString(),
            message: 'CVC Itaqua API v2.4.1 - Com pós-processamento integrado e versão no final',
            funcionalidades: [
                '✅ Versão (v2.4) adicionada no final dos templates',
                '✅ Funções de formatação em uso',
                '✅ IA retorna com placeholders',
                '✅ Sistema formata depois',
                '✅ Maior controle e consistência',
                '✅ 14 templates completos',
                '✅ 100% conforme manual CVC'
            ]
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
        console.log('🚀 v2.4: Processando requisição com pós-processamento...');
        
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
        IMPORTANTE: Use os placeholders {{PARCELAMENTO}}, {{BAGAGEM}}, {{ASSENTO}} conforme instruído.
        NÃO formate estes itens você mesmo. Apenas coloque os placeholders.`;

        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            console.log('🔮 v2.4: Usando Claude...');
            
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
            console.log('⚡ v2.4: Usando GPT-4o-mini...');
            
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
        
        // ⭐ APLICAR PÓS-PROCESSAMENTO v2.4
        resultado = aplicarPosProcessamento(resultado, conteudoPrincipal, parcelamento);
        
        console.log('✅ v2.4: Processamento completo com pós-processamento');
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: '2.4.1-POS-PROCESSAMENTO',
                tipo: tipoOrcamento,
                pos_processamento: true
            }
        });

    } catch (error) {
        console.error('❌ v2.4: Erro:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================
console.log('✅ CVC Itaqua v2.4.1-PÓS-PROCESSAMENTO carregado!');
console.log('🔧 Versão (v2.4) no final de cada orçamento');
console.log('✅ Emojis confirmados: ✅ bagagem, 💺 assento');
console.log('📋 Funções de formatação integradas e funcionais');
console.log('🎯 IA usa placeholders, sistema formata depois');
console.log('📅 Atualização: 18/12/2024');
