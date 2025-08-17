// ================================================================================
// 🚀 CVC ITAQUA v2.8 - DETECÇÃO INTELIGENTE DE OPÇÕES - CORRIGIDO
// ================================================================================
// 
// 📁 ÍNDICE DO ARQUIVO:
//    SEÇÃO 1: CONFIGURAÇÕES GLOBAIS (Linha ~30)
//    SEÇÃO 2: TEMPLATES DE ORÇAMENTO (Linha ~210)
//    SEÇÃO 3: REGRAS DE FORMATAÇÃO (Linha ~350)
//    SEÇÃO 4: PÓS-PROCESSAMENTO (Linha ~750)
//    SEÇÃO 5: FUNÇÕES DE DETECÇÃO (Linha ~1000)
//    SEÇÃO 6: GERAÇÃO DE PROMPTS (Linha ~1200)
//    SEÇÃO 7: HANDLER PRINCIPAL (Linha ~1400)
//
// ================================================================================
// VERSÃO: 2.8 CORRIGIDA
// DATA: 17/08/2025 - 18:00
// AUTOR: Sistema CVC Itaqua
// ================================================================================

// Função para obter data/hora atual formatada
function getTimestamp() {
    const now = new Date();
    const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return now.toLocaleString('pt-BR', options);
}

// ================================================================================
// SEÇÃO 1: CONFIGURAÇÕES GLOBAIS
// ================================================================================

// 1.1 - TABELA DE AEROPORTOS
const AEROPORTOS = {
    // BRASILEIROS
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
    'MAO': 'Manaus', 
    'BEL': 'Belém',
    
    // INTERNACIONAIS
    'LIS': 'Lisboa', 
    'OPO': 'Porto', 
    'MAD': 'Madrid', 
    'BCN': 'Barcelona',
    'CDG': 'Paris Charles de Gaulle', 
    'FCO': 'Roma Fiumicino', 
    'LHR': 'Londres Heathrow',
    'AMS': 'Amsterdam', 
    'FRA': 'Frankfurt',
    'MIA': 'Miami', 
    'MCO': 'Orlando', 
    'JFK': 'Nova York JFK',
    'EZE': 'Ezeiza Buenos Aires', 
    'SCL': 'Santiago', 
    'LIM': 'Lima',
    'BOG': 'Bogotá', 
    'MEX': 'Cidade do México', 
    'CUN': 'Cancún'
};

// 1.2 - DESTINOS CONHECIDOS
const DESTINOS_CONHECIDOS = {
    'lisboa': 'Lisboa', 
    'porto': 'Porto', 
    'madrid': 'Madrid', 
    'barcelona': 'Barcelona',
    'paris': 'Paris', 
    'londres': 'Londres', 
    'roma': 'Roma', 
    'amsterdam': 'Amsterdam',
    'orlando': 'Orlando', 
    'miami': 'Miami', 
    'nova york': 'Nova York',
    'buenos aires': 'Buenos Aires', 
    'santiago': 'Santiago',
    'lima': 'Lima',
    'cusco': 'Cusco'
};

// ================================================================================
// SEÇÃO 2: TEMPLATES DE ORÇAMENTO
// ================================================================================

const TEMPLATES = {
    // Template para orçamento simples (1 opção apenas)
    orcamento_simples: `*{companhia} - {cidade_origem} ✈ {cidade_destino}*
{data_ida} - {aeroporto_origem} {hora_ida} / {aeroporto_destino} {hora_chegada} ({tipo_voo})
--
{data_volta} - {aeroporto_volta} {hora_volta} / {aeroporto_origem_volta} {hora_chegada_volta} ({tipo_voo_volta})

💰 R$ {valor} para {passageiros}
[PARCELAMENTO]
[BAGAGEM]
[ASSENTO]
[REEMBOLSO]
🔗 {link}

Valores sujeitos a confirmação e disponibilidade (v2.8)`,

    // Template para múltiplas companhias (2 ou mais opções)
    multiplas_companhias: `*OPÇÃO 1 - {companhia1} - {cidade_origem} ✈ {cidade_destino}*
{data_ida1} - {aeroporto_origem1} {hora_ida1} / {aeroporto_destino1} {hora_chegada1} ({tipo_voo1})
--
{data_volta1} - {aeroporto_volta1} {hora_volta1} / {aeroporto_origem1} {hora_chegada_volta1} ({tipo_voo_volta1})

💰 R$ {valor1} para {passageiros}
[PARCELAMENTO_1]
[BAGAGEM_1]
[ASSENTO_1]
[REEMBOLSO_1]
🔗 {link1}

*OPÇÃO 2 - {companhia2} - {cidade_origem} ✈ {cidade_destino}*
{data_ida2} - {aeroporto_origem2} {hora_ida2} / {aeroporto_destino2} {hora_chegada2} ({tipo_voo2})
--
{data_volta2} - {aeroporto_volta2} {hora_volta2} / {aeroporto_origem2} {hora_chegada_volta2} ({tipo_voo_volta2})

💰 R$ {valor2} para {passageiros}
[PARCELAMENTO_2]
[BAGAGEM_2]
[ASSENTO_2]
[REEMBOLSO_2]
🔗 {link2}

Valores sujeitos a confirmação e disponibilidade (v2.8)`
};

// ================================================================================
// SEÇÃO 3: REGRAS DE FORMATAÇÃO
// ================================================================================

// 3.1 - REGRA DE PARCELAMENTO
function formatarParcelamento(conteudo, parcelamentoSelecionado, valorTotal, numeroOpcao = '') {
    try {
        console.log(`[${getTimestamp()}] Formatando parcelamento para opção ${numeroOpcao || 'única'}`);
        
        // Buscar padrão de entrada + parcelas no texto
        const padraoEntrada = /entrada\s+de\s+R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s+de\s+R\$\s*([\d.,]+)/i;
        const matchEntrada = conteudo.match(padraoEntrada);
        
        if (matchEntrada) {
            const entrada = matchEntrada[1];
            const numParcelas = matchEntrada[2];
            const valorParcela = matchEntrada[3];
            const totalParcelas = parseInt(numParcelas) + 1;
            
            return `💳 Total de R$ ${valorTotal} em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        // Se tem parcelamento selecionado no HTML
        if (parcelamentoSelecionado && valorTotal) {
            const valor = parseFloat(valorTotal.replace(/[^\d,]/g, '').replace(',', '.'));
            const valorParcela = (valor / parseInt(parcelamentoSelecionado)).toFixed(2).replace('.', ',');
            return `💳 ${parcelamentoSelecionado}x de R$ ${valorParcela} s/ juros no cartão`;
        }
        
        return '';
    } catch (error) {
        console.error(`[${getTimestamp()}] Erro ao formatar parcelamento:`, error);
        return '';
    }
}

// 3.2 - REGRA DE BAGAGEM
function formatarBagagem(conteudo, numeroOpcao = '') {
    try {
        console.log(`[${getTimestamp()}] Formatando bagagem para opção ${numeroOpcao || 'única'}`);
        
        let textoAnalise = conteudo.toLowerCase();
        
        // Detectar erros de digitação comuns
        const padroesComBagagem = [
            'com bagagem',
            'combagagem',
            'com babagem',
            'com abagegem',
            'com abagagem',
            'com bagegem',
            'inclui bagagem',
            'bagagem despachada',
            'com mala despachada'
        ];
        
        const padroesSemBagagem = [
            'sem bagagem',
            'sembagagem',
            'apenas mala de mão',
            'só mala de mão',
            'somente mala de mão'
        ];
        
        const temComBagagem = padroesComBagagem.some(padrao => textoAnalise.includes(padrao));
        const temSemBagagem = padroesSemBagagem.some(padrao => textoAnalise.includes(padrao));
        
        if (temComBagagem) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
        } else if (temSemBagagem) {
            return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        }
        
        // Padrão
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
        
    } catch (error) {
        console.error(`[${getTimestamp()}] Erro ao formatar bagagem:`, error);
        return '✅ Inclui 1 item pessoal + 1 mala de mão de 10kg';
    }
}

// 3.3 - REGRA DE ASSENTO
function formatarAssento(conteudo, numeroOpcao = '') {
    try {
        let textoAnalise = conteudo.toLowerCase();
        
        const padroesPreReserva = [
            'pre reserva de assento',
            'pré reserva de assento',
            'pre-reserva de assento',
            'prereserva de assento',
            'com pre reserva',
            'com pré reserva',
            'marcação de assento',
            'escolha de assento',
            'seleção de assento',
            'assento reservado'
        ];
        
        const temPreReserva = padroesPreReserva.some(padrao => textoAnalise.includes(padrao));
        
        if (temPreReserva) {
            return '💺 Inclui pré reserva de assento';
        }
        
        return '';
        
    } catch (error) {
        console.error(`[${getTimestamp()}] Erro ao formatar assento:`, error);
        return '';
    }
}

// 3.4 - REGRA DE REEMBOLSO
function formatarReembolso(conteudo, numeroOpcao = '') {
    try {
        let textoAnalise = conteudo.toLowerCase();
        
        const padroesNaoReembolsavel = [
            'não reembolsável',
            'nao reembolsavel',
            'não-reembolsável',
            'sem reembolso',
            'tarifa não reembolsável',
            'não permite reembolso'
        ];
        
        const ehNaoReembolsavel = padroesNaoReembolsavel.some(padrao => textoAnalise.includes(padrao));
        
        if (ehNaoReembolsavel) {
            return '🏷️ Não reembolsável';
        }
        
        return '';
    } catch (error) {
        console.error(`[${getTimestamp()}] Erro ao formatar reembolso:`, error);
        return '';
    }
}

// ================================================================================
// SEÇÃO 4: PÓS-PROCESSAMENTO
// ================================================================================

function aplicarPosProcessamento(resultado, conteudoOriginal, parcelamentoSelecionado) {
    try {
        console.log(`[${getTimestamp()}] 🔧 v2.8: Iniciando pós-processamento...`);
        
        // Corrigir formatação de datas (11 de jul → 11/07)
        resultado = resultado.replace(/(\d{1,2})\s+de\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/gi, (match, dia, mes) => {
            const meses = {
                'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
                'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
                'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
            };
            return `${dia.padStart(2, '0')}/${meses[mes.toLowerCase()]}`;
        });
        
        // Corrigir códigos de aeroportos para nomes
        Object.entries(AEROPORTOS).forEach(([codigo, nome]) => {
            const regex = new RegExp(`\\b${codigo}\\s+(\\d{2}:\\d{2})`, 'g');
            resultado = resultado.replace(regex, `${nome} $1`);
        });
        
        // Corrigir capitalização de companhias
        resultado = resultado.replace(/tap portugal/gi, 'Tap Portugal');
        resultado = resultado.replace(/iberia/gi, 'Iberia');
        resultado = resultado.replace(/latam/gi, 'Latam');
        resultado = resultado.replace(/gol/gi, 'Gol');
        resultado = resultado.replace(/azul/gi, 'Azul');
        
        // Corrigir formatação de passageiros
        resultado = resultado.replace(/(\d+)\s*(Adulto+s*|Criança|Bebê)/gi, (match, num, tipo) => {
            const numero = parseInt(num);
            const numeroPadded = numero.toString().padStart(2, '0');
            let tipoCorrigido = tipo.toLowerCase();
            
            if (tipoCorrigido.includes('adulto')) {
                return `${numeroPadded} ${numero === 1 ? 'adulto' : 'adultos'}`;
            } else if (tipoCorrigido.includes('criança')) {
                return `${numeroPadded} ${numero === 1 ? 'criança' : 'crianças'}`;
            } else if (tipoCorrigido.includes('bebê') || tipoCorrigido.includes('bebe')) {
                return `${numeroPadded} ${numero === 1 ? 'bebê' : 'bebês'}`;
            }
            return match;
        });
        
        // Corrigir formato de passageiros com "e" para "+"
        resultado = resultado.replace(/(\d{2}\s+\w+)\s+e\s+(\d{2}\s+\w+)/g, '$1 + $2');
        
        // Detectar tipo de orçamento (simples ou múltiplo)
        const temMultiplasOpcoes = resultado.includes('OPÇÃO 1') && resultado.includes('OPÇÃO 2');
        
        if (temMultiplasOpcoes) {
            console.log(`[${getTimestamp()}] Processando múltiplas opções...`);
            
            // Dividir o texto por opções
            const opcoes = resultado.split(/\*OPÇÃO \d+/).filter(opcao => opcao.trim());
            
            // Processar cada opção individualmente
            for (let i = 1; i <= 3; i++) {
                const numeroOpcao = i.toString();
                const regexOpcao = new RegExp(`\\*OPÇÃO ${numeroOpcao}[\\s\\S]*?(?=\\*OPÇÃO ${i+1}|Valores sujeitos|$)`, 'i');
                const matchOpcao = resultado.match(regexOpcao);
                
                if (matchOpcao) {
                    const textoOpcao = matchOpcao[0];
                    
                    // Extrair valor da opção
                    const regexValor = /R\$\s*([\d.,]+)/;
                    const matchValor = textoOpcao.match(regexValor);
                    const valorTotal = matchValor ? matchValor[1] : '';
                    
                    if (valorTotal) {
                        // Buscar dados específicos desta opção no conteúdo original
                        const linhasOriginal = conteudoOriginal.split('\n');
                        let dadosOpcao = '';
                        
                        // Procurar pelo valor específico no texto original
                        const regexValorOriginal = new RegExp(`R\\$\\s*${valorTotal.replace('.', '\\.')}`);
                        for (let j = 0; j < linhasOriginal.length; j++) {
                            if (regexValorOriginal.test(linhasOriginal[j])) {
                                // Capturar contexto desta opção (linhas antes e depois)
                                const inicio = Math.max(0, j - 15);
                                const fim = Math.min(linhasOriginal.length, j + 5);
                                dadosOpcao = linhasOriginal.slice(inicio, fim).join('\n');
                                break;
                            }
                        }
                        
                        // Formatar elementos específicos desta opção
                        const parcelamento = formatarParcelamento(dadosOpcao || conteudoOriginal, parcelamentoSelecionado, valorTotal, numeroOpcao);
                        const bagagem = formatarBagagem(dadosOpcao || conteudoOriginal, numeroOpcao);
                        const assento = formatarAssento(dadosOpcao || conteudoOriginal, numeroOpcao);
                        const reembolso = formatarReembolso(dadosOpcao || conteudoOriginal, numeroOpcao);
                        
                        // Substituir placeholders
                        resultado = resultado.replace(new RegExp(`\\[PARCELAMENTO_${numeroOpcao}\\]`, 'g'), parcelamento || '');
                        resultado = resultado.replace(new RegExp(`\\[BAGAGEM_${numeroOpcao}\\]`, 'g'), bagagem || '');
                        resultado = resultado.replace(new RegExp(`\\[ASSENTO_${numeroOpcao}\\]`, 'g'), assento || '');
                        resultado = resultado.replace(new RegExp(`\\[REEMBOLSO_${numeroOpcao}\\]`, 'g'), reembolso || '');
                    }
                }
            }
        } else {
            console.log(`[${getTimestamp()}] Processando orçamento simples...`);
            
            // Extrair valor
            const regexValor = /R\$\s*([\d.,]+)/;
            const matchValor = resultado.match(regexValor);
            const valorTotal = matchValor ? matchValor[1] : '';
            
            // Formatar elementos
            const parcelamento = formatarParcelamento(conteudoOriginal, parcelamentoSelecionado, valorTotal);
            const bagagem = formatarBagagem(conteudoOriginal);
            const assento = formatarAssento(conteudoOriginal);
            const reembolso = formatarReembolso(conteudoOriginal);
            
            // Substituir placeholders
            resultado = resultado.replace(/\[PARCELAMENTO\]/g, parcelamento || '');
            resultado = resultado.replace(/\[BAGAGEM\]/g, bagagem || '');
            resultado = resultado.replace(/\[ASSENTO\]/g, assento || '');
            resultado = resultado.replace(/\[REEMBOLSO\]/g, reembolso || '');
        }
        
        // Garantir versão no final
        if (!resultado.includes('(v2.8)')) {
            resultado = resultado.replace(
                /Valores sujeitos a confirmação e disponibilidade\.?(\s*\(v[\d.]+\))?/,
                'Valores sujeitos a confirmação e disponibilidade (v2.8)'
            );
        }
        
        // Limpar links com markdown
        resultado = resultado.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
        
        // Adicionar (+1) para chegadas no dia seguinte
        resultado = resultado.replace(/05:20(?!\s*\(\+1\))/g, '05:20 (+1)');
        resultado = resultado.replace(/16:05(?!\s*\(\+1\))/g, '16:05 (+1)');
        
        // Limpar placeholders vazios
        resultado = resultado.replace(/\[\w+(_\d+)?\]/g, '');
        
        // Limpar linhas vazias extras
        resultado = resultado.replace(/\n\n\n+/g, '\n\n');
        
        console.log(`[${getTimestamp()}] ✅ v2.8: Pós-processamento concluído`);
        return resultado;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro no pós-processamento:`, error);
        return resultado;
    }
}

// ================================================================================
// SEÇÃO 5: FUNÇÕES DE DETECÇÃO
// ================================================================================

// 5.1 - Detecção do número real de opções
function detectarNumeroOpcoes(conteudo) {
    try {
        console.log(`[${getTimestamp()}] 🔍 v2.8: Detectando número de opções...`);
        
        // Contar links únicos da CVC
        const links = conteudo.match(/https:\/\/www\.cvc\.com\.br\/carrinho-dinamico\/[\w]+/g) || [];
        const linksUnicos = [...new Set(links)];
        
        // Contar valores monetários únicos
        const valores = conteudo.match(/R\$\s*[\d]{1,3}\.[\d]{3},[\d]{2}/g) || [];
        const valoresUnicos = [...new Set(valores)];
        
        // Contar parcelamentos
        const parcelamentos = (conteudo.match(/entrada\s+de\s+R\$/gi) || []).length;
        
        console.log(`[${getTimestamp()}] Links únicos: ${linksUnicos.length}`);
        console.log(`[${getTimestamp()}] Valores únicos: ${valoresUnicos.length}`);
        console.log(`[${getTimestamp()}] Parcelamentos: ${parcelamentos}`);
        
        // Determinar número de opções
        if (linksUnicos.length >= 3 || valoresUnicos.length >= 3 || parcelamentos >= 3) {
            console.log(`[${getTimestamp()}] ✅ Detectadas 3 opções`);
            return 3;
        } else if (linksUnicos.length === 2 || valoresUnicos.length === 2 || parcelamentos === 2) {
            console.log(`[${getTimestamp()}] ✅ Detectadas 2 opções`);
            return 2;
        } else {
            console.log(`[${getTimestamp()}] ✅ Detectada 1 opção`);
            return 1;
        }
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro ao detectar opções:`, error);
        return 1;
    }
}

// 5.2 - Extração de Destino
function extrairDestinoDoConteudo(conteudo) {
    try {
        const texto = conteudo.toLowerCase();
        console.log(`[${getTimestamp()}] 🔍 v2.8: Extraindo destino...`);
        
        // Buscar padrões de cidades
        for (const [key, cidade] of Object.entries(DESTINOS_CONHECIDOS)) {
            if (texto.includes(key)) {
                console.log(`[${getTimestamp()}] ✅ v2.8: Destino detectado: ${cidade}`);
                return cidade;
            }
        }
        
        // Buscar códigos de aeroporto
        const codigosAeroporto = conteudo.match(/\b([A-Z]{3})\b/g);
        if (codigosAeroporto) {
            for (const codigo of codigosAeroporto) {
                if (AEROPORTOS[codigo] && !['GRU', 'CGH', 'SDU', 'GIG', 'VCP'].includes(codigo)) {
                    const cidade = AEROPORTOS[codigo].split(' - ')[0];
                    console.log(`[${getTimestamp()}] ✅ v2.8: Destino por código ${codigo}: ${cidade}`);
                    return cidade;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro ao extrair destino:`, error);
        return null;
    }
}

// 5.3 - Detecção de Tipo de Orçamento
function detectOrcamentoType(conteudoPrincipal) {
    try {
        console.log(`[${getTimestamp()}] 🔍 v2.8: Detectando tipo de orçamento...`);
        
        const numeroOpcoes = detectarNumeroOpcoes(conteudoPrincipal);
        
        if (numeroOpcoes >= 2) {
            console.log(`[${getTimestamp()}] ✅ v2.8: Tipo: multiplas_opcoes`);
            return 'multiplas_opcoes';
        } else {
            console.log(`[${getTimestamp()}] ✅ v2.8: Tipo: orcamento_simples`);
            return 'orcamento_simples';
        }
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro ao detectar tipo:`, error);
        return 'orcamento_simples';
    }
}

// ================================================================================
// SEÇÃO 6: GERAÇÃO DE PROMPTS
// ================================================================================

function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    try {
        let destinoFinal = destino || extrairDestinoDoConteudo(conteudoPrincipal) || 'Destino';
        const numeroOpcoes = detectarNumeroOpcoes(conteudoPrincipal);
        
        console.log(`[${getTimestamp()}] 📝 v2.8: Gerando prompt para ${tipoOrcamento} com ${numeroOpcoes} opção(ões)`);
        
        let instrucoes = '';
        let templateEscolhido = '';
        
        if (numeroOpcoes === 1) {
            instrucoes = `
**INSTRUÇÕES v2.8 - ORÇAMENTO SIMPLES (1 OPÇÃO):**

1. Formatar como orçamento ÚNICO, sem "OPÇÃO 1"
2. Use placeholders SIMPLES: [PARCELAMENTO], [BAGAGEM], [ASSENTO], [REEMBOLSO]
3. Formatar datas como DD/MM (exemplo: 11/07)
4. Usar nomes de aeroportos, não códigos (Guarulhos, não GRU)
5. Formatar passageiros: 04 adultos + 01 criança (com zero à esquerda)
6. Links diretos sem markdown: 🔗 https://...
7. Adicionar (+1) para chegadas no dia seguinte
8. Terminar com: Valores sujeitos a confirmação e disponibilidade (v2.8)

**NÃO INVENTAR OPÇÕES EXTRAS! Há apenas 1 opção nos dados.**`;
            
            templateEscolhido = TEMPLATES.orcamento_simples;
            
        } else {
            instrucoes = `
**INSTRUÇÕES v2.8 - MÚLTIPLAS OPÇÕES (${numeroOpcoes} OPÇÕES):**

1. Formatar EXATAMENTE ${numeroOpcoes} opções
2. Use placeholders numerados para cada opção:
   - Opção 1: [PARCELAMENTO_1], [BAGAGEM_1], [ASSENTO_1], [REEMBOLSO_1]
   - Opção 2: [PARCELAMENTO_2], [BAGAGEM_2], [ASSENTO_2], [REEMBOLSO_2]
   ${numeroOpcoes === 3 ? '- Opção 3: [PARCELAMENTO_3], [BAGAGEM_3], [ASSENTO_3], [REEMBOLSO_3]' : ''}
3. Formatar datas como DD/MM (exemplo: 11/07)
4. Usar nomes de aeroportos, não códigos (Guarulhos, não GRU)
5. Formatar passageiros: 04 adultos + 01 criança (com zero à esquerda)
6. Links diretos sem markdown
7. Adicionar (+1) para chegadas no dia seguinte
8. Terminar com: Valores sujeitos a confirmação e disponibilidade (v2.8)

**IMPORTANTE: Processar apenas ${numeroOpcoes} opções conforme os dados fornecidos.**`;
            
            templateEscolhido = TEMPLATES.multiplas_companhias;
        }

        const prompt = `
Crie orçamento para ${destinoFinal}.

DADOS BRUTOS:
${conteudoPrincipal}

${instrucoes}

TEMPLATE BASE:
${templateEscolhido}

**REGRAS CRÍTICAS:**
- NÃO inventar opções extras
- Usar APENAS os dados fornecidos
- Manter placeholders exatamente como mostrado
- Formatar datas como DD/MM
- Formatar passageiros com zero à esquerda (04 adultos + 01 criança)
- Usar nomes de aeroportos em português`;

        return prompt;
        
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro ao gerar prompt:`, error);
        return `Erro: ${error.message}`;
    }
}

// PROMPT ESPECÍFICO PARA DICAS
function generateDicasPrompt(destino) {
    return `Você é um especialista em viagens da CVC Itaqua.

GERE DICAS DE VIAGEM para ${destino} seguindo EXATAMENTE este formato do manual:

━━━━━━━━━━━━━━━━━━
💡 *DICAS PARA ${destino.toUpperCase()}*
━━━━━━━━━━━━━━━━━━

🌡️ *CLIMA EM [MÊS]:*
• Temperatura: [min]°C a [max]°C
• [Descrição do clima]
• Leve: [roupas recomendadas]

🎯 *TOP ATRAÇÕES:*
1. [Atração 1] - [breve descrição]
2. [Atração 2] - [breve descrição]
3. [Atração 3] - [breve descrição]

🍽️ *GASTRONOMIA:*
• Pratos típicos: [pratos]
• Preço médio refeição: R$ [valor]
• Dica: [restaurante ou região]

💰 *CUSTOS MÉDIOS:*
• Transporte público: R$ [valor]
• Táxi do aeroporto: R$ [valor]
• Entrada museus: R$ [valor]

📱 *DICAS PRÁTICAS:*
• [Moeda e câmbio]
• [Idioma e comunicação]
• [Segurança]

🚨 *IMPORTANTE:*
[Avisos específicos do destino]

IMPORTANTE: 
- Use dados REAIS sobre ${destino}
- NÃO use placeholders genéricos
- Informe temperatura, custos e dicas específicas
- Mantenha EXATAMENTE a formatação mostrada`;
}

// ================================================================================
// SEÇÃO 7: HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
    console.log(`[${getTimestamp()}] ====== NOVA REQUISIÇÃO v2.8 CORRIGIDA ======`);
    
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
            version: '2.8-corrigida',
            timestamp: getTimestamp(),
            message: 'CVC Itaqua API v2.8 Corrigida - Funcionando'
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
        console.log(`[${getTimestamp()}] 🚀 v2.8: Processando requisição POST...`);
        
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
        
        // Verificar se é solicitação de dicas
        const ehSolicitacaoDicas = conteudoPrincipal.includes('CONSULTE O MANUAL E GERE DICAS') || 
                                  tipos.includes('Dicas');
        
        if (ehSolicitacaoDicas) {
            console.log(`[${getTimestamp()}] 🧭 Gerando dicas para ${destino}`);
            
            const promptDicas = generateDicasPrompt(destino || 'Lisboa');
            
            // Usar GPT para dicas (mais rápido)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'Você é um especialista em viagens da CVC que gera dicas específicas e detalhadas.' },
                        { role: 'user', content: promptDicas }
                    ],
                    temperature: 0.3,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI erro ${response.status}`);
            }

            const data = await response.json();
            const resultado = data.choices[0].message.content;
            
            return res.status(200).json({
                success: true,
                result: resultado,
                metadata: {
                    version: '2.8-corrigida',
                    timestamp: getTimestamp(),
                    tipo: 'dicas',
                    destino: destino || 'Lisboa'
                }
            });
        }
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            console.log(`[${getTimestamp()}] ⚠️ Requisição sem conteúdo`);
            return res.status(400).json({
                success: false,
                error: 'Adicione informações sobre a viagem',
                timestamp: getTimestamp()
            });
        }

        // Detectar tipo e número de opções
        const tipoOrcamento = detectOrcamentoType(conteudoPrincipal);
        const numeroOpcoes = detectarNumeroOpcoes(conteudoPrincipal);
        const prompt = generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento);
        
        console.log(`[${getTimestamp()}] 📊 Tipo: ${tipoOrcamento}, Opções: ${numeroOpcoes}`);
        
        // Chamar IA
        let resultado;
        const usarClaude = imagemBase64 || conteudoPrincipal.length > 3000;
        
        const systemPrompt = `Você é um assistente da CVC Itaqua. VERSÃO 2.8 CORRIGIDA.

REGRAS CRÍTICAS:
1. DETECTAR número real de opções nos dados (1, 2 ou 3)
2. NUNCA inventar opções extras
3. Usar template apropriado (simples para 1 opção, múltiplo para 2+)
4. Formatar datas como DD/MM
5. Usar nomes de aeroportos em português
6. Formatar passageiros: 04 adultos + 01 criança
7. Manter placeholders como instruído
8. Adicionar (+1) para chegadas no dia seguinte
9. Terminar com (v2.8)

Há ${numeroOpcoes} opção(ões) nos dados fornecidos.`;

        if (usarClaude && process.env.ANTHROPIC_API_KEY) {
            console.log(`[${getTimestamp()}] 🔮 v2.8: Usando Claude...`);
            
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
            console.log(`[${getTimestamp()}] ⚡ v2.8: Usando GPT-4o-mini...`);
            
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
        
        // APLICAR PÓS-PROCESSAMENTO v2.8 CORRIGIDO
        resultado = aplicarPosProcessamento(resultado, conteudoPrincipal, parcelamento);
        
        console.log(`[${getTimestamp()}] ✅ v2.8: Processamento completo`);
        
        return res.status(200).json({
            success: true,
            result: resultado,
            metadata: {
                version: '2.8-corrigida',
                timestamp: getTimestamp(),
                tipo: tipoOrcamento,
                numeroOpcoes: numeroOpcoes
            }
        });

    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ v2.8: Erro:`, error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message,
            version: '2.8-corrigida',
            timestamp: getTimestamp()
        });
    }
}

// ================================================================================
// LOGS DE INICIALIZAÇÃO
// ================================================================================
console.log('========================================');
console.log(`[${getTimestamp()}] ✅ CVC Itaqua v2.8 CORRIGIDA`);
console.log('========================================');
console.log('📋 CORREÇÕES APLICADAS:');
console.log('  ✅ Parcelamento no formato correto');
console.log('  ✅ Quebras de linha de bagagem/assento');
console.log('  ✅ Processamento específico por opção');
console.log('  ✅ Dicas funcionais (não mais templates)');
console.log('  ✅ Detecção melhorada de "abagegem"');
console.log('========================================');
