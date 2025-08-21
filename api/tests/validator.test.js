// api/tests/validator.test.js - SISTEMA DE VALIDAÇÃO AUTOMÁTICA v4.0
// ================================================================================
// 🔍 VALIDAÇÃO AUTOMÁTICA DE ORÇAMENTOS E DETECÇÃO DE REGRESSÕES
// 🎯 Sistema de pontuação e métricas de qualidade
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';
import { SUITE_TESTES, obterCasosPorTipo } from './test-cases.js';

// ================================================================================
// 🔍 VALIDADOR PRINCIPAL
// ================================================================================

/**
 * Valida um orçamento formatado contra critérios de qualidade
 * @param {string} textoFormatado - Orçamento formatado pela IA
 * @param {string} tipoEsperado - Tipo esperado do orçamento
 * @param {Object} dadosOriginais - Dados do texto original
 * @returns {Object} Resultado da validação
 */
export function validarOrcamento(textoFormatado, tipoEsperado, dadosOriginais = {}) {
    console.log(`🔍 Validando orçamento tipo: ${tipoEsperado}`);
    
    const resultado = {
        valido: true,
        pontuacao: 0,
        pontuacaoMaxima: 100,
        erros: [],
        avisos: [],
        metricas: {},
        detalhes: {}
    };
    
    try {
        // 1. VALIDAÇÕES ESTRUTURAIS (30 pontos)
        const estrutural = validarEstrutura(textoFormatado, tipoEsperado);
        resultado.pontuacao += estrutural.pontos;
        resultado.erros.push(...estrutural.erros);
        resultado.avisos.push(...estrutural.avisos);
        resultado.detalhes.estrutural = estrutural;
        
        // 2. VALIDAÇÕES DE CONTEÚDO (25 pontos)
        const conteudo = validarConteudo(textoFormatado, dadosOriginais);
        resultado.pontuacao += conteudo.pontos;
        resultado.erros.push(...conteudo.erros);
        resultado.avisos.push(...conteudo.avisos);
        resultado.detalhes.conteudo = conteudo;
        
        // 3. VALIDAÇÕES DE FORMATAÇÃO (25 pontos)
        const formatacao = validarFormatacao(textoFormatado);
        resultado.pontuacao += formatacao.pontos;
        resultado.erros.push(...formatacao.erros);
        resultado.avisos.push(...formatacao.avisos);
        resultado.detalhes.formatacao = formatacao;
        
        // 4. VALIDAÇÕES ESPECÍFICAS DO TIPO (20 pontos)
        const especifico = validarEspecificoTipo(textoFormatado, tipoEsperado);
        resultado.pontuacao += especifico.pontos;
        resultado.erros.push(...especifico.erros);
        resultado.avisos.push(...especifico.avisos);
        resultado.detalhes.especifico = especifico;
        
        // 5. CALCULAR MÉTRICAS FINAIS
        resultado.metricas = calcularMetricas(resultado);
        resultado.valido = resultado.erros.length === 0 && resultado.pontuacao >= 70;
        
        console.log(`✅ Validação concluída: ${resultado.pontuacao}/${resultado.pontuacaoMaxima} pontos`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro na validação:', error);
        resultado.valido = false;
        resultado.erros.push('Erro interno na validação');
        return resultado;
    }
}

// ================================================================================
// 🏗️ VALIDAÇÃO ESTRUTURAL (30 pontos)
// ================================================================================

function validarEstrutura(texto, tipoEsperado) {
    const validacao = {
        pontos: 0,
        pontosMaximos: 30,
        erros: [],
        avisos: [],
        checks: {}
    };
    
    console.log('🏗️ Validando estrutura...');
    
    // 1. TÍTULO EM NEGRITO (8 pontos)
    const temTitulo = /\*[^*]+\*/m.test(texto);
    if (temTitulo) {
        validacao.pontos += 8;
        validacao.checks.titulo = true;
    } else {
        validacao.erros.push('Título em negrito (*texto*) não encontrado');
        validacao.checks.titulo = false;
    }
    
    // 2. VALOR PRINCIPAL (8 pontos)
    const temValor = /💰.*R\$\s*[\d.,]+/.test(texto);
    if (temValor) {
        validacao.pontos += 8;
        validacao.checks.valor = true;
    } else {
        validacao.erros.push('Valor principal (💰 R$ xxx) não encontrado');
        validacao.checks.valor = false;
    }
    
    // 3. VERSÃO CORRETA (6 pontos)
    const versaoCorreta = texto.includes(`(v${SYSTEM_CONFIG.VERSION})`);
    if (versaoCorreta) {
        validacao.pontos += 6;
        validacao.checks.versao = true;
    } else {
        validacao.erros.push(`Versão incorreta ou ausente (esperado: v${SYSTEM_CONFIG.VERSION})`);
        validacao.checks.versao = false;
    }
    
    // 4. FINALIZAÇÃO PADRÃO (4 pontos)
    const temFinalizacao = texto.includes('Valores sujeitos a confirmação e disponibilidade');
    if (temFinalizacao) {
        validacao.pontos += 4;
        validacao.checks.finalizacao = true;
    } else {
        validacao.avisos.push('Finalização padrão não encontrada');
        validacao.checks.finalizacao = false;
    }
    
    // 5. ESTRUTURA ESPECÍFICA POR TIPO (4 pontos)
    const estruturaEspecifica = validarEstruturaEspecifica(texto, tipoEsperado);
    if (estruturaEspecifica) {
        validacao.pontos += 4;
        validacao.checks.estruturaEspecifica = true;
    } else {
        validacao.avisos.push(`Estrutura específica para ${tipoEsperado} não conforme`);
        validacao.checks.estruturaEspecifica = false;
    }
    
    return validacao;
}

function validarEstruturaEspecifica(texto, tipo) {
    const verificacoes = {
        'AEREO_SIMPLES': () => texto.includes('--') && /\d{2}\/\d{2}\s*-.*\/.*\(/m.test(texto),
        'HOTEIS_MULTIPLAS': () => texto.includes('*Hotéis em') && texto.includes('Período:'),
        'MULTITRECHO': () => texto.includes('*Multitrecho') && texto.includes('Trecho 1:'),
        'PACOTE_COMPLETO': () => texto.includes('*Pacote') && texto.includes('O Pacote Inclui:'),
        'DICAS_DESTINO': () => texto.includes('*DICAS PARA') && texto.includes('🎯 *PRINCIPAIS PASSEIOS:*'),
        'RANKING_HOTEIS': () => texto.includes('*RANKING DE HOTÉIS') && texto.includes('*CATEGORIA LUXO*')
    };
    
    const verificacao = verificacoes[tipo];
    return verificacao ? verificacao() : true; // Default para tipos não específicos
}

// ================================================================================
// 📝 VALIDAÇÃO DE CONTEÚDO (25 pontos)
// ================================================================================

function validarConteudo(texto, dadosOriginais) {
    const validacao = {
        pontos: 0,
        pontosMaximos: 25,
        erros: [],
        avisos: [],
        checks: {}
    };
    
    console.log('📝 Validando conteúdo...');
    
    // 1. DATAS NO FORMATO CORRETO (8 pontos)
    const datasCorretas = validarFormatoDatas(texto);
    if (datasCorretas.score >= 0.8) {
        validacao.pontos += 8;
        validacao.checks.datas = true;
    } else {
        validacao.avisos.push(`Formato de datas: ${Math.round(datasCorretas.score * 100)}% correto`);
        validacao.pontos += Math.round(8 * datasCorretas.score);
        validacao.checks.datas = false;
    }
    
    // 2. AEROPORTOS CONVERTIDOS (6 pontos)
    const aeroportosConvertidos = validarConversaoAeroportos(texto);
    if (aeroportosConvertidos.score >= 0.9) {
        validacao.pontos += 6;
        validacao.checks.aeroportos = true;
    } else {
        validacao.avisos.push(`Aeroportos convertidos: ${Math.round(aeroportosConvertidos.score * 100)}%`);
        validacao.pontos += Math.round(6 * aeroportosConvertidos.score);
        validacao.checks.aeroportos = false;
    }
    
    // 3. VALORES FORMATADOS (6 pontos)
    const valoresCorretos = validarFormatoValores(texto);
    if (valoresCorretos.score >= 0.9) {
        validacao.pontos += 6;
        validacao.checks.valores = true;
    } else {
        validacao.avisos.push(`Formato valores: ${Math.round(valoresCorretos.score * 100)}% correto`);
        validacao.pontos += Math.round(6 * valoresCorretos.score);
        validacao.checks.valores = false;
    }
    
    // 4. CONSISTÊNCIA COM DADOS ORIGINAIS (5 pontos)
    const consistencia = validarConsistencia(texto, dadosOriginais);
    validacao.pontos += Math.round(5 * consistencia.score);
    validacao.checks.consistencia = consistencia.score >= 0.8;
    if (consistencia.problemas.length > 0) {
        validacao.avisos.push(...consistencia.problemas);
    }
    
    return validacao;
}

function validarFormatoDatas(texto) {
    const datas = texto.match(/\d{1,2}\/\d{2}/g) || [];
    const datasCorretas = datas.filter(data => /^\d{2}\/\d{2}$/.test(data));
    const diasSemana = texto.match(/(?:seg|ter|qua|qui|sex|sáb|sab|dom),?\s*\d/gi) || [];
    
    const score = datas.length > 0 ? (datasCorretas.length / datas.length) : 1;
    const penalidade = diasSemana.length > 0 ? 0.3 : 0;
    
    return {
        score: Math.max(0, score - penalidade),
        total: datas.length,
        corretas: datasCorretas.length,
        diasSemanaEncontrados: diasSemana.length
    };
}

function validarConversaoAeroportos(texto) {
    const codigosRestantes = texto.match(/\b[A-Z]{3}\b/g) || [];
    const codigosSuspeitos = codigosRestantes.filter(codigo => 
        !['CVC', 'CPF', 'PDF', 'JPG', 'PNG'].includes(codigo)
    );
    
    const score = codigosSuspeitos.length === 0 ? 1 : Math.max(0, 1 - (codigosSuspeitos.length * 0.2));
    
    return {
        score,
        codigosRestantes: codigosSuspeitos
    };
}

function validarFormatoValores(texto) {
    const valores = texto.match(/R\$\s*[\d.,]+/g) || [];
    const valoresCorretos = valores.filter(valor => /R\$ [\d.]+,\d{2}/.test(valor));
    
    const score = valores.length > 0 ? (valoresCorretos.length / valores.length) : 1;
    
    return {
        score,
        total: valores.length,
        corretos: valoresCorretos.length
    };
}

function validarConsistencia(texto, dadosOriginais) {
    const problemas = [];
    let score = 1;
    
    // Verificar se valores originais foram preservados
    if (dadosOriginais.valores) {
        for (const valor of dadosOriginais.valores) {
            if (!texto.includes(valor)) {
                problemas.push(`Valor original ${valor} não preservado`);
                score -= 0.2;
            }
        }
    }
    
    // Verificar se horários originais foram preservados
    if (dadosOriginais.horarios) {
        for (const horario of dadosOriginais.horarios) {
            if (!texto.includes(horario)) {
                problemas.push(`Horário original ${horario} não preservado`);
                score -= 0.15;
            }
        }
    }
    
    return {
        score: Math.max(0, score),
        problemas
    };
}

// ================================================================================
// 🎨 VALIDAÇÃO DE FORMATAÇÃO (25 pontos)
// ================================================================================

function validarFormatacao(texto) {
    const validacao = {
        pontos: 0,
        pontosMaximos: 25,
        erros: [],
        avisos: [],
        checks: {}
    };
    
    console.log('🎨 Validando formatação...');
    
    // 1. QUEBRAS DE LINHA ADEQUADAS (6 pontos)
    const quebrasLinhaOK = !texto.includes('\n\n\n') && !texto.match(/\n{4,}/);
    if (quebrasLinhaOK) {
        validacao.pontos += 6;
        validacao.checks.quebrasLinha = true;
    } else {
        validacao.avisos.push('Quebras de linha excessivas encontradas');
        validacao.checks.quebrasLinha = false;
    }
    
    // 2. EMOJIS CONSISTENTES (5 pontos)
    const emojisOK = validarEmojis(texto);
    validacao.pontos += Math.round(5 * emojisOK.score);
    validacao.checks.emojis = emojisOK.score >= 0.8;
    if (emojisOK.problemas.length > 0) {
        validacao.avisos.push(...emojisOK.problemas);
    }
    
    // 3. SEPARADORES CORRETOS (5 pontos)
    const separadoresOK = validarSeparadores(texto);
    if (separadoresOK) {
        validacao.pontos += 5;
        validacao.checks.separadores = true;
    } else {
        validacao.avisos.push('Separadores (--) incorretos ou ausentes');
        validacao.checks.separadores = false;
    }
    
    // 4. ESPAÇAMENTOS CONSISTENTES (5 pontos)
    const espacamentosOK = validarEspacamentos(texto);
    validacao.pontos += Math.round(5 * espacamentosOK.score);
    validacao.checks.espacamentos = espacamentosOK.score >= 0.8;
    
    // 5. FORMATAÇÃO MARKDOWN LIMPA (4 pontos)
    const markdownLimpo = !texto.includes('```') && !texto.includes('**') && !texto.includes('~~');
    if (markdownLimpo) {
        validacao.pontos += 4;
        validacao.checks.markdown = true;
    } else {
        validacao.avisos.push('Formatação markdown residual encontrada');
        validacao.checks.markdown = false;
    }
    
    return validacao;
}

function validarEmojis(texto) {
    const problemas = [];
    let score = 1;
    
    // Verificar padrões de emoji
    const padroes = {
        '💰': /💰\s+R\$/g,
        '✅': /✅\s+\w/g,
        '🏷️': /🏷️\s+\w/g,
        '💳': /💳\s+\d/g
    };
    
    for (const [emoji, padrao] of Object.entries(padroes)) {
        if (texto.includes(emoji)) {
            const matches = texto.match(padrao);
            if (!matches || matches.length === 0) {
                problemas.push(`Emoji ${emoji} sem espaçamento adequado`);
                score -= 0.15;
            }
        }
    }
    
    return { score: Math.max(0, score), problemas };
}

function validarSeparadores(texto) {
    if (!texto.includes('--')) return true; // Nem todos os tipos precisam
    
    // Verificar se separadores estão em linhas próprias
    return /\n--\n/.test(texto);
}

function validarEspacamentos(texto) {
    let score = 1;
    
    // Verificar espaços duplos desnecessários
    if (texto.includes('  ')) score -= 0.2;
    
    // Verificar espaçamento após emojis
    if (/💰\S/.test(texto)) score -= 0.2;
    if (/✅\S/.test(texto)) score -= 0.2;
    
    return { score: Math.max(0, score) };
}

// ================================================================================
// 🎯 VALIDAÇÃO ESPECÍFICA POR TIPO (20 pontos)
// ================================================================================

function validarEspecificoTipo(texto, tipo) {
    const validacao = {
        pontos: 0,
        pontosMaximos: 20,
        erros: [],
        avisos: [],
        checks: {}
    };
    
    console.log(`🎯 Validando específico para: ${tipo}`);
    
    const validadores = {
        'AEREO_SIMPLES': validarAereoSimples,
        'HOTEIS_MULTIPLAS': validarHoteisMultiplas,
        'MULTITRECHO': validarMultitrecho,
        'PACOTE_COMPLETO': validarPacoteCompleto,
        'DICAS_DESTINO': validarDicasDestino,
        'RANKING_HOTEIS': validarRankingHoteis
    };
    
    const validador = validadores[tipo];
    if (validador) {
        const resultado = validador(texto);
        validacao.pontos = resultado.pontos;
        validacao.erros = resultado.erros;
        validacao.avisos = resultado.avisos;
        validacao.checks = resultado.checks;
    } else {
        // Validação genérica para tipos não específicos
        validacao.pontos = 15; // Pontuação padrão
        validacao.checks.generico = true;
    }
    
    return validacao;
}

function validarAereoSimples(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // Separador ida/volta (8 pontos)
    if (texto.includes('--')) {
        validacao.pontos += 8;
        validacao.checks.separador = true;
    } else {
        validacao.erros.push('Separador (--) entre ida e volta ausente');
        validacao.checks.separador = false;
    }
    
    // Formato de horários (6 pontos)
    const horarios = texto.match(/\d{2}:\d{2}/g) || [];
    if (horarios.length >= 4) { // Ida e volta com horários
        validacao.pontos += 6;
        validacao.checks.horarios = true;
    } else {
        validacao.avisos.push('Horários de voo incompletos');
        validacao.checks.horarios = false;
    }
    
    // Tipo de voo especificado (6 pontos)
    const tiposVoo = texto.match(/\((?:voo direto|com conexão|com múltiplas conexões)\)/g) || [];
    if (tiposVoo.length >= 2) {
        validacao.pontos += 6;
        validacao.checks.tipoVoo = true;
    } else {
        validacao.avisos.push('Tipo de voo não especificado adequadamente');
        validacao.checks.tipoVoo = false;
    }
    
    return validacao;
}

function validarHoteisMultiplas(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // Não deve ter referências a voos (10 pontos)
    const temVoo = /aeroporto|voo|✈|--|GRU|MCO|LIS/i.test(texto);
    if (!temVoo) {
        validacao.pontos += 10;
        validacao.checks.semVoo = true;
    } else {
        validacao.erros.push('Hotel não deve ter referências a voos');
        validacao.checks.semVoo = false;
    }
    
    // Período de hospedagem (5 pontos)
    if (texto.includes('Período:')) {
        validacao.pontos += 5;
        validacao.checks.periodo = true;
    } else {
        validacao.avisos.push('Período de hospedagem não especificado');
        validacao.checks.periodo = false;
    }
    
    // Opções de hotel (5 pontos)
    const opcoes = texto.match(/\*\*OPÇÃO \d+\*\*/g) || [];
    if (opcoes.length >= 1) {
        validacao.pontos += 5;
        validacao.checks.opcoes = true;
    } else {
        validacao.avisos.push('Opções de hotel não formatadas adequadamente');
        validacao.checks.opcoes = false;
    }
    
    return validacao;
}

function validarMultitrecho(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // Múltiplos trechos (10 pontos)
    const trechos = texto.match(/\*Trecho \d+:\*/g) || [];
    if (trechos.length >= 2) {
        validacao.pontos += 10;
        validacao.checks.trechos = true;
    } else {
        validacao.erros.push('Múltiplos trechos não encontrados');
        validacao.checks.trechos = false;
    }
    
    // Duração especificada (5 pontos)
    if (/\d+\s+dias?\s+e\s+\d+\s+noites?/.test(texto)) {
        validacao.pontos += 5;
        validacao.checks.duracao = true;
    } else {
        validacao.avisos.push('Duração da viagem não especificada');
        validacao.checks.duracao = false;
    }
    
    // Companhias (5 pontos)
    if (texto.includes('*Multitrecho -')) {
        validacao.pontos += 5;
        validacao.checks.companhias = true;
    } else {
        validacao.avisos.push('Formato multitrecho não adequado');
        validacao.checks.companhias = false;
    }
    
    return validacao;
}

function validarPacoteCompleto(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // O que o pacote inclui (8 pontos)
    if (texto.includes('*O Pacote Inclui:*')) {
        validacao.pontos += 8;
        validacao.checks.inclui = true;
    } else {
        validacao.erros.push('Seção "O Pacote Inclui" ausente');
        validacao.checks.inclui = false;
    }
    
    // Voos e hotéis (6 pontos)
    const temVoos = /✈️\s*\*Voos/.test(texto);
    const temOpcoes = /\*\*OPÇÃO \d+\*\*/.test(texto);
    if (temVoos && temOpcoes) {
        validacao.pontos += 6;
        validacao.checks.voosHoteis = true;
    } else {
        validacao.avisos.push('Voos ou opções de hotel ausentes');
        validacao.checks.voosHoteis = false;
    }
    
    // Múltiplas opções (6 pontos)
    const opcoes = texto.match(/\*\*OPÇÃO \d+\*\*/g) || [];
    if (opcoes.length >= 2) {
        validacao.pontos += 6;
        validacao.checks.opcoes = true;
    } else {
        validacao.avisos.push('Múltiplas opções de hotel ausentes');
        validacao.checks.opcoes = false;
    }
    
    return validacao;
}

function validarDicasDestino(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // Seções obrigatórias (15 pontos)
    const secoes = [
        '🎯 *PRINCIPAIS PASSEIOS:*',
        '🌡️ *CLIMA:*',
        '🍽️ *GASTRONOMIA:*',
        '💰 *CUSTOS MÉDIOS:*',
        '📱 *DICAS PRÁTICAS:*'
    ];
    
    let secoesEncontradas = 0;
    for (const secao of secoes) {
        if (texto.includes(secao)) {
            secoesEncontradas++;
        }
    }
    
    validacao.pontos += Math.round((secoesEncontradas / secoes.length) * 15);
    validacao.checks.secoes = secoesEncontradas >= 4;
    
    // Finalização com produtos CVC (5 pontos)
    if (texto.includes('🎁 *PRODUTOS CVC:*')) {
        validacao.pontos += 5;
        validacao.checks.produtosCVC = true;
    } else {
        validacao.avisos.push('Finalização com produtos CVC ausente');
        validacao.checks.produtosCVC = false;
    }
    
    return validacao;
}

function validarRankingHoteis(texto) {
    const validacao = { pontos: 0, erros: [], avisos: [], checks: {} };
    
    // Categorias (12 pontos)
    const categorias = ['*CATEGORIA LUXO*', '*CATEGORIA SUPERIOR*', '*CATEGORIA ECONÔMICA*'];
    let categoriasEncontradas = 0;
    
    for (const categoria of categorias) {
        if (texto.includes(categoria)) {
            categoriasEncontradas++;
        }
    }
    
    validacao.pontos += Math.round((categoriasEncontradas / categorias.length) * 12);
    validacao.checks.categorias = categoriasEncontradas >= 2;
    
    // Rankings com emojis (5 pontos)
    const rankings = texto.match(/🥇|🥈|🥉/g) || [];
    if (rankings.length >= 3) {
        validacao.pontos += 5;
        validacao.checks.rankings = true;
    } else {
        validacao.avisos.push('Rankings com emojis insuficientes');
        validacao.checks.rankings = false;
    }
    
    // Produtos CVC (3 pontos)
    if (texto.includes('🎁 *PRODUTOS CVC:*')) {
        validacao.pontos += 3;
        validacao.checks.produtosCVC = true;
    }
    
    return validacao;
}

// ================================================================================
// 📊 CÁLCULO DE MÉTRICAS
// ================================================================================

function calcularMetricas(resultado) {
    return {
        percentualSucesso: Math.round((resultado.pontuacao / resultado.pontuacaoMaxima) * 100),
        qualidade: obterClassificacaoQualidade(resultado.pontuacao),
        temErrosCriticos: resultado.erros.length > 0,
        temAvisos: resultado.avisos.length > 0,
        distribuicaoPontos: {
            estrutural: resultado.detalhes.estrutural?.pontos || 0,
            conteudo: resultado.detalhes.conteudo?.pontos || 0,
            formatacao: resultado.detalhes.formatacao?.pontos || 0,
            especifico: resultado.detalhes.especifico?.pontos || 0
        }
    };
}

function obterClassificacaoQualidade(pontuacao) {
    if (pontuacao >= 90) return 'EXCELENTE';
    if (pontuacao >= 80) return 'MUITO_BOM';
    if (pontuacao >= 70) return 'BOM';
    if (pontuacao >= 60) return 'REGULAR';
    return 'RUIM';
}

// ================================================================================
// 🧪 EXECUTOR DE TESTES AUTOMÁTICOS
// ================================================================================

/**
 * Executa teste automático usando casos de teste predefinidos
 * @param {Function} funcaoFormatacao - Função que formata orçamentos
 * @param {Array} casosTeste - Casos de teste a executar
 * @returns {Object} Resultado dos testes
 */
export async function executarTestesAutomaticos(funcaoFormatacao, casosTeste = []) {
    console.log('🧪 Iniciando testes automáticos...');
    
    const resultado = {
        total: 0,
        sucessos: 0,
        falhas: 0,
        resultados: [],
        resumo: {},
        tempo: 0
    };
    
    const inicioTempo = Date.now();
    
    try {
        // Usar todos os casos se nenhum específico for fornecido
        if (casosTeste.length === 0) {
            for (const categoria of Object.values(SUITE_TESTES)) {
                casosTeste.push(...Object.values(categoria));
            }
        }
        
        for (const caso of casosTeste) {
            resultado.total++;
            
            try {
                console.log(`🧪 Testando: ${caso.nome}`);
                
                // Executar formatação
                const textoFormatado = await funcaoFormatacao(caso.entrada, {
                    tipoEsperado: caso.tipo,
                    passageiros: '01 adulto' // Padrão para testes
                });
                
                // Validar resultado
                const validacao = validarOrcamento(textoFormatado, caso.tipo, caso.esperado);
                
                const resultadoTeste = {
                    caso: caso.nome,
                    tipo: caso.tipo,
                    sucesso: validacao.valido,
                    pontuacao: validacao.pontuacao,
                    pontuacaoMaxima: validacao.pontuacaoMaxima,
                    erros: validacao.erros,
                    avisos: validacao.avisos,
                    textoFormatado
                };
                
                resultado.resultados.push(resultadoTeste);
                
                if (validacao.valido) {
                    resultado.sucessos++;
                    console.log(`✅ ${caso.nome}: ${validacao.pontuacao}/${validacao.pontuacaoMaxima}`);
                } else {
                    resultado.falhas++;
                    console.log(`❌ ${caso.nome}: ${validacao.erros.join(', ')}`);
                }
                
            } catch (error) {
                resultado.falhas++;
                resultado.resultados.push({
                    caso: caso.nome,
                    tipo: caso.tipo,
                    sucesso: false,
                    erro: error.message
                });
                console.log(`💥 ${caso.nome}: ${error.message}`);
            }
        }
        
        resultado.tempo = Date.now() - inicioTempo;
        resultado.resumo = gerarResumoTestes(resultado);
        
        console.log(`🧪 Testes concluídos: ${resultado.sucessos}/${resultado.total} sucessos`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro nos testes automáticos:', error);
        throw error;
    }
}

function gerarResumoTestes(resultado) {
    const porcentagemSucesso = Math.round((resultado.sucessos / resultado.total) * 100);
    
    // Agrupar por tipo
    const porTipo = {};
    for (const teste of resultado.resultados) {
        if (!porTipo[teste.tipo]) {
            porTipo[teste.tipo] = { total: 0, sucessos: 0 };
        }
        porTipo[teste.tipo].total++;
        if (teste.sucesso) {
            porTipo[teste.tipo].sucessos++;
        }
    }
    
    // Calcular pontuação média
    const pontuacaoTotal = resultado.resultados.reduce((acc, r) => acc + (r.pontuacao || 0), 0);
    const pontuacaoMedia = Math.round(pontuacaoTotal / resultado.total);
    
    return {
        porcentagemSucesso,
        pontuacaoMedia,
        tempoExecucao: `${resultado.tempo}ms`,
        porTipo,
        classificacao: obterClassificacaoQualidade(pontuacaoMedia)
    };
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    validarOrcamento,
    executarTestesAutomaticos,
    calcularMetricas,
    obterClassificacaoQualidade
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Validator Test v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('🔍 Funcionalidades: validação estrutural, conteúdo, formatação, específica');
console.log('🧪 Testes automáticos: execução completa com métricas de qualidade');
