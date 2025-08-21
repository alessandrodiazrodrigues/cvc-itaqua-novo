// api/processors/baggage-processor.js - PROCESSADOR DE BAGAGEM v4.0
// ================================================================================
// 🎒 DETECTA E FORMATA REGRAS DE BAGAGEM CONSISTENTES
// 🎯 Regra: "Com bagagem" = despachada incluída | Padrão CVC
// ================================================================================

import { SYSTEM_CONFIG, REGRAS_BAGAGEM } from '../data/constants.js';

// ================================================================================
// 🎒 PROCESSADOR PRINCIPAL DE BAGAGEM
// ================================================================================

/**
 * Processa e padroniza informações de bagagem no texto
 * @param {string} texto - Texto a ser processado
 * @param {Object} dadosExtraidos - Dados extraídos do orçamento
 * @returns {string} Texto com bagagem padronizada
 */
export function processarBagagem(texto, dadosExtraidos = {}) {
    if (!texto || typeof texto !== 'string') {
        console.warn('⚠️ Baggage Processor: Texto inválido recebido');
        return texto || '';
    }
    
    console.log('🎒 Iniciando processamento de bagagem...');
    
    let resultado = texto;
    
    try {
        // 1. DETECTAR TIPO DE BAGAGEM
        const tipoBagagem = detectarTipoBagagem(texto, dadosExtraidos);
        console.log(`🎒 Tipo detectado: ${tipoBagagem.tipo}`);
        
        // 2. APLICAR REGRA DE BAGAGEM
        resultado = aplicarRegraBagagem(resultado, tipoBagagem);
        
        // 3. PADRONIZAR FORMATO
        resultado = padronizarFormatoBagagem(resultado);
        
        // 4. VALIDAR CONSISTÊNCIA
        const validacao = validarBagagem(resultado);
        if (!validacao.valido) {
            console.warn('⚠️ Inconsistências na bagagem:', validacao.avisos);
        }
        
        console.log('✅ Baggage Processor: Processamento concluído');
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Baggage Processor: Erro no processamento:', error);
        return texto; // Retorna original em caso de erro
    }
}

// ================================================================================
// 🔍 DETECÇÃO DE TIPO DE BAGAGEM
// ================================================================================

function detectarTipoBagagem(texto, dadosExtraidos) {
    const deteccao = {
        tipo: 'SEM_DESPACHADA', // Padrão
        confianca: 0.5,
        indicadores: [],
        temAssento: false,
        ehInternacional: false
    };
    
    const textoLower = texto.toLowerCase();
    
    console.log('🔍 Analisando indicadores de bagagem...');
    
    // INDICADORES DE BAGAGEM DESPACHADA
    const indicadoresDespachada = [
        { termo: 'com bagagem', peso: 5, desc: 'indicador principal' },
        { termo: 'bagagem despachada', peso: 5, desc: 'explícito' },
        { termo: 'bagagens inclusas', peso: 4, desc: 'inclusão explícita' },
        { termo: 'mala de até 23kg', peso: 4, desc: 'peso específico' },
        { termo: 'bagagem de 23kg', peso: 4, desc: 'peso padrão' },
        { termo: '23kg incluída', peso: 4, desc: 'peso incluído' },
        { termo: 'franquia de bagagem', peso: 3, desc: 'termo técnico' },
        { termo: 'bagagem incluída', peso: 3, desc: 'inclusão geral' }
    ];
    
    // INDICADORES DE MÚLTIPLAS BAGAGENS
    const indicadoresMultiplas = [
        { termo: '2 bagagens', peso: 5, desc: 'duas bagagens' },
        { termo: 'duas bagagens', peso: 5, desc: 'duas explícito' },
        { termo: '+ 2 bagagens', peso: 5, desc: 'duas adicionais' },
        { termo: 'mala de mão + 2', peso: 4, desc: 'mão + duas' }
    ];
    
    // INDICADORES DE PRÉ-RESERVA DE ASSENTO
    const indicadoresAssento = [
        { termo: 'pré-reserva de assento', peso: 5, desc: 'pré-reserva explícita' },
        { termo: 'pre reserva de assento', peso: 5, desc: 'sem hífen' },
        { termo: 'pré reserva de assento', peso: 5, desc: 'sem hífen 2' },
        { termo: 'marcação de assento', peso: 4, desc: 'marcação' },
        { termo: 'escolha de assento', peso: 4, desc: 'escolha' },
        { termo: 'assento incluído', peso: 3, desc: 'inclusão assento' }
    ];
    
    // VERIFICAR INDICADORES
    for (const { termo, peso, desc } of indicadoresDespachada) {
        if (textoLower.includes(termo)) {
            deteccao.confianca += peso * 0.1;
            deteccao.indicadores.push(`bagagem: ${desc}`);
        }
    }
    
    for (const { termo, peso, desc } of indicadoresMultiplas) {
        if (textoLower.includes(termo)) {
            deteccao.confianca += peso * 0.15;
            deteccao.indicadores.push(`múltiplas: ${desc}`);
            deteccao.tipo = 'DUAS_DESPACHADAS';
        }
    }
    
    for (const { termo, peso, desc } of indicadoresAssento) {
        if (textoLower.includes(termo)) {
            deteccao.temAssento = true;
            deteccao.indicadores.push(`assento: ${desc}`);
        }
    }
    
    // DETECTAR VIAGEM INTERNACIONAL
    const destinosInternacionais = ['orlando', 'miami', 'lisboa', 'madrid', 'barcelona', 'paris', 'roma', 'londres'];
    deteccao.ehInternacional = destinosInternacionais.some(destino => 
        textoLower.includes(destino)
    );
    
    // DETERMINAR TIPO FINAL
    if (deteccao.confianca >= 0.8 && deteccao.tipo !== 'DUAS_DESPACHADAS') {
        deteccao.tipo = deteccao.ehInternacional ? 'COM_DESPACHADA_23KG' : 'COM_DESPACHADA_23KG';
    } else if (deteccao.confianca >= 0.6) {
        deteccao.tipo = 'COM_DESPACHADA_23KG';
    } else if (deteccao.confianca < 0.3) {
        deteccao.tipo = 'SEM_DESPACHADA';
    }
    
    console.log(`🔍 Indicadores encontrados: ${deteccao.indicadores.join(', ')}`);
    console.log(`🔍 Confiança: ${(deteccao.confianca * 100).toFixed(1)}%`);
    
    return deteccao;
}

// ================================================================================
// ⚙️ APLICAÇÃO DE REGRA DE BAGAGEM
// ================================================================================

function aplicarRegraBagagem(texto, tipoBagagem) {
    let resultado = texto;
    
    console.log(`⚙️ Aplicando regra: ${tipoBagagem.tipo}`);
    
    // Obter texto da regra
    const textoBagagem = obterTextoBagagem(tipoBagagem);
    
    // Padrões existentes de bagagem para substituir
    const padroesBagagem = [
        /✅[^\n]*bagagem[^\n]*/gi,
        /✅[^\n]*mala[^\n]*/gi,
        /✅[^\n]*item pessoal[^\n]*/gi,
        /✅[^\n]*só.*mão[^\n]*/gi,
        /✅[^\n]*inclui[^\n]*/gi
    ];
    
    let substitucaoFeita = false;
    
    // Tentar substituir linha existente
    for (const padrao of padroesBagagem) {
        if (padrao.test(resultado)) {
            resultado = resultado.replace(padrao, `✅ ${textoBagagem}`);
            substitucaoFeita = true;
            console.log('⚙️ Linha de bagagem substituída');
            break;
        }
    }
    
    // Se não encontrou linha existente, adicionar após valor
    if (!substitucaoFeita) {
        console.log('⚙️ Adicionando nova linha de bagagem');
        resultado = adicionarLinhaBagagem(resultado, textoBagagem);
    }
    
    // Adicionar linha de assento se necessário
    if (tipoBagagem.temAssento && !resultado.includes('💺')) {
        resultado = adicionarLinhaAssento(resultado);
    }
    
    return resultado;
}

// ================================================================================
// 📝 OBTENÇÃO DE TEXTO DE BAGAGEM
// ================================================================================

function obterTextoBagagem(tipoBagagem) {
    const { tipo, ehInternacional } = tipoBagagem;
    
    switch (tipo) {
        case 'SEM_DESPACHADA':
            return REGRAS_BAGAGEM.SEM_DESPACHADA;
        
        case 'COM_DESPACHADA_23KG':
            return ehInternacional 
                ? REGRAS_BAGAGEM.COM_DESPACHADA_23KG 
                : REGRAS_BAGAGEM.COM_DESPACHADA_23KG;
        
        case 'DUAS_DESPACHADAS':
            return REGRAS_BAGAGEM.DUAS_DESPACHADAS;
        
        case 'COM_DESPACHADA_32KG':
            return REGRAS_BAGAGEM.COM_DESPACHADA_32KG;
        
        default:
            return REGRAS_BAGAGEM.SEM_DESPACHADA;
    }
}

// ================================================================================
// 📝 ADIÇÃO DE LINHAS
// ================================================================================

function adicionarLinhaBagagem(texto, textoBagagem) {
    // Procurar local apropriado (após valor ou parcelamento)
    const linhas = texto.split('\n');
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Adicionar após linha de valor ou parcelamento
        if (linha.includes('💰') || linha.includes('💳')) {
            // Verificar se já existe linha de bagagem na sequência
            let j = i + 1;
            while (j < linhas.length && linhas[j].trim() === '') j++; // Pular linhas vazias
            
            if (j < linhas.length && linhas[j].includes('✅')) {
                // Já existe, pular
                continue;
            }
            
            // Inserir nova linha de bagagem
            linhas.splice(i + 1, 0, `✅ ${textoBagagem}`);
            break;
        }
    }
    
    return linhas.join('\n');
}

function adicionarLinhaAssento(texto) {
    const linhas = texto.split('\n');
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Adicionar após linha de bagagem
        if (linha.includes('✅') && !linha.includes('💺')) {
            linhas.splice(i + 1, 0, '💺 Inclui pré reserva de assento');
            break;
        }
    }
    
    return linhas.join('\n');
}

// ================================================================================
// 🔧 PADRONIZAÇÃO DE FORMATO
// ================================================================================

function padronizarFormatoBagagem(texto) {
    let resultado = texto;
    
    console.log('🔧 Padronizando formato de bagagem...');
    
    // Padrões a padronizar
    const padronizacoes = [
        // "10 kg" → "10kg"
        { pattern: /(\d+)\s+kg/g, replacement: '$1kg' },
        // "23 Kg" → "23kg"
        { pattern: /(\d+)\s*Kg/g, replacement: '$1kg' },
        // " + " → " + "
        { pattern: /\s*\+\s*/g, replacement: ' + ' },
        // Múltiplos espaços
        { pattern: /\s{2,}/g, replacement: ' ' }
    ];
    
    for (const { pattern, replacement } of padronizacoes) {
        resultado = resultado.replace(pattern, replacement);
    }
    
    return resultado;
}

// ================================================================================
// ✅ VALIDAÇÃO DE BAGAGEM
// ================================================================================

function validarBagagem(texto) {
    const validacao = {
        valido: true,
        avisos: [],
        erros: []
    };
    
    try {
        // Verificar se há linha de bagagem
        const temLinhaBagagem = /✅[^\n]*(?:bagagem|mala|item)/i.test(texto);
        
        if (!temLinhaBagagem) {
            validacao.avisos.push('Nenhuma linha de bagagem encontrada');
        }
        
        // Verificar duplicações
        const linhasBagagem = texto.match(/✅[^\n]*(?:bagagem|mala|item)[^\n]*/gi);
        if (linhasBagagem && linhasBagagem.length > 1) {
            validacao.avisos.push('Múltiplas linhas de bagagem detectadas');
        }
        
        // Verificar consistência de assento
        const temAssento = /💺/.test(texto);
        const temAssentoTexto = /assento/i.test(texto);
        
        if (temAssentoTexto && !temAssento) {
            validacao.avisos.push('Referência a assento sem emoji específico');
        }
        
    } catch (error) {
        validacao.erros.push('Erro na validação de bagagem');
        validacao.valido = false;
    }
    
    return validacao;
}

// ================================================================================
// 📊 UTILIDADES DE ANÁLISE
// ================================================================================

/**
 * Extrai informações de bagagem do texto
 * @param {string} texto - Texto para analisar
 * @returns {Object} Informações de bagagem extraídas
 */
export function extrairInfoBagagem(texto) {
    if (!texto) return null;
    
    const info = {
        temDespachada: false,
        quantidadeDespachadas: 0,
        peso: null,
        temAssento: false,
        descricao: null
    };
    
    // Extrair linha de bagagem
    const matchBagagem = texto.match(/✅[^\n]*(?:bagagem|mala|item)[^\n]*/i);
    if (matchBagagem) {
        info.descricao = matchBagagem[0];
        
        // Verificar despachada
        info.temDespachada = /despachada/i.test(info.descricao);
        
        // Contar quantidade
        const matchQuantidade = info.descricao.match(/(\d+)\s*bagagem/i);
        if (matchQuantidade) {
            info.quantidadeDespachadas = parseInt(matchQuantidade[1]);
        } else if (info.temDespachada) {
            info.quantidadeDespachadas = 1;
        }
        
        // Extrair peso
        const matchPeso = info.descricao.match(/(\d+)kg/i);
        if (matchPeso) {
            info.peso = parseInt(matchPeso[1]);
        }
    }
    
    // Verificar assento
    info.temAssento = /💺/.test(texto) || /assento/i.test(texto);
    
    return info;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    processarBagagem,
    extrairInfoBagagem
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Baggage Processor v${SYSTEM_CONFIG.VERSION} carregado`);
console.log(`🎒 Regras disponíveis: ${Object.keys(REGRAS_BAGAGEM).length}`);
