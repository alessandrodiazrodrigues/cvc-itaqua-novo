// api/detectors/hotel-detector.js - DETECTOR ESPECÍFICO PARA HOTÉIS v4.0
// ================================================================================
// 🏨 DETECTA E EXTRAI DADOS ESPECÍFICOS DE HOTÉIS
// 🎯 Diferencia: Hotel puro vs Pacote vs Roteiro de hotéis
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// 🏨 DETECTOR PRINCIPAL DE HOTÉIS
// ================================================================================

/**
 * Detecta se o conteúdo é um orçamento de hotel
 * @param {string} conteudo - Texto do orçamento
 * @param {Array} tiposSelecionados - Tipos selecionados pelo usuário
 * @returns {Object} Resultado da detecção
 */
export function detectarHotel(conteudo, tiposSelecionados = []) {
    const resultado = {
        ehHotel: false,
        tipoHotel: null,
        dadosHotel: {},
        confianca: 0
    };
    
    try {
        console.log('🏨 Iniciando detecção de hotel...');
        
        const conteudoLower = conteudo.toLowerCase();
        
        // 1. VERIFICAÇÃO POR TIPOS SELECIONADOS
        if (tiposSelecionados.includes('Hotel') && !tiposSelecionados.includes('Aéreo')) {
            resultado.ehHotel = true;
            resultado.confianca = 0.9;
            console.log('✅ Hotel detectado por seleção do usuário');
        }
        
        // 2. DETECÇÃO POR PALAVRAS-CHAVE
        const indicadoresHotel = detectarIndicadoresHotel(conteudoLower);
        const indicadoresVoo = detectarIndicadoresVoo(conteudoLower);
        
        // 3. LÓGICA DE DECISÃO
        if (indicadoresHotel.score > 0 && indicadoresVoo.score === 0) {
            resultado.ehHotel = true;
            resultado.confianca = Math.min(0.95, indicadoresHotel.score / 10);
            console.log(`✅ Hotel puro detectado (score: ${indicadoresHotel.score})`);
        } else if (indicadoresHotel.score > indicadoresVoo.score * 2) {
            resultado.ehHotel = true;
            resultado.confianca = 0.7;
            console.log(`✅ Hotel com baixos indicadores de voo detectado`);
        }
        
        // 4. DETERMINAR TIPO DE HOTEL
        if (resultado.ehHotel) {
            resultado.tipoHotel = determinarTipoHotel(conteudo, indicadoresHotel);
            resultado.dadosHotel = extrairDadosHotel(conteudo);
            
            console.log(`🏨 Tipo de hotel: ${resultado.tipoHotel}`);
            console.log(`📊 Dados extraídos:`, resultado.dadosHotel);
        }
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro na detecção de hotel:', error);
        return resultado;
    }
}

// ================================================================================
// 🔍 INDICADORES DE HOTEL
// ================================================================================

function detectarIndicadoresHotel(conteudoLower) {
    const indicadores = {
        score: 0,
        encontrados: []
    };
    
    // Palavras-chave específicas de hotel
    const palavrasHotel = {
        'hotel': 3,
        'pousada': 3,
        'resort': 3,
        'comfort suites': 5,
        'preferencial': 4,
        'hospedagem': 3,
        'check-in': 4,
        'check-out': 4,
        'café da manhã': 3,
        'pensão completa': 3,
        'meia pensão': 3,
        'all inclusive': 4,
        'diária': 3,
        'suíte': 2,
        'standard': 2,
        'deluxe': 2,
        'superior': 2,
        'vista para o mar': 2,
        'piscina': 1,
        'spa': 1,
        'room service': 2,
        'late check-out': 3,
        'early check-in': 3
    };
    
    // Verificar presença de palavras-chave
    for (const [palavra, peso] of Object.entries(palavrasHotel)) {
        if (conteudoLower.includes(palavra)) {
            indicadores.score += peso;
            indicadores.encontrados.push(palavra);
        }
    }
    
    // Padrões específicos
    if (conteudoLower.match(/\d+\s*noites?/)) {
        indicadores.score += 2;
        indicadores.encontrados.push('padrão noites');
    }
    
    if (conteudoLower.match(/período:\s*\d/)) {
        indicadores.score += 3;
        indicadores.encontrados.push('padrão período');
    }
    
    console.log(`🏨 Indicadores hotel encontrados:`, indicadores.encontrados);
    
    return indicadores;
}

// ================================================================================
// ✈️ INDICADORES DE VOO (PARA EXCLUSÃO)
// ================================================================================

function detectarIndicadoresVoo(conteudoLower) {
    const indicadores = {
        score: 0,
        encontrados: []
    };
    
    // Palavras-chave específicas de voo
    const palavrasVoo = {
        'aeroporto': 3,
        'voo': 3,
        'decolagem': 3,
        'aterrissagem': 3,
        'conexão': 2,
        'escala': 2,
        'embarque': 2,
        'gru': 2,
        'cgh': 2,
        'mco': 2,
        'gig': 2,
        'guarulhos': 2,
        'congonhas': 2,
        'orlando': 1, // Pode ser cidade
        'companhia aérea': 3,
        'latam': 2,
        'gol': 2,
        'azul': 2,
        'avianca': 2,
        'tap': 2
    };
    
    // Verificar presença de palavras-chave
    for (const [palavra, peso] of Object.entries(palavrasVoo)) {
        if (conteudoLower.includes(palavra)) {
            indicadores.score += peso;
            indicadores.encontrados.push(palavra);
        }
    }
    
    // Padrões de horário de voo
    if (conteudoLower.match(/\d{2}:\d{2}\s*\/\s*\d{2}:\d{2}/)) {
        indicadores.score += 4;
        indicadores.encontrados.push('padrão horário voo');
    }
    
    console.log(`✈️ Indicadores voo encontrados:`, indicadores.encontrados);
    
    return indicadores;
}

// ================================================================================
// 🏨 TIPOS DE HOTEL
// ================================================================================

function determinarTipoHotel(conteudo, indicadoresHotel) {
    const conteudoLower = conteudo.toLowerCase();
    
    // 1. ROTEIRO DE HOTÉIS (múltiplos hotéis sequenciais)
    const padraoRoteiro = conteudo.match(/hotel.*?hotel.*?hotel/i) ||
                         conteudo.match(/\d+\/\d+.*?hotel.*?\d+\/\d+.*?hotel/i) ||
                         conteudo.match(/noites.*?noites.*?noites/i);
    
    if (padraoRoteiro) {
        return 'ROTEIRO_HOTEIS';
    }
    
    // 2. MÚLTIPLAS OPÇÕES (vários hotéis para mesmo período)
    const padraoMultiplas = conteudo.match(/opção\s*\d+/gi) ||
                           conteudo.match(/hotel\s*\d+/gi) ||
                           conteudo.match(/\*\*.*?\*\*.*?\*\*.*?\*\*/gi);
    
    if (padraoMultiplas && padraoMultiplas.length >= 2) {
        return 'HOTEIS_MULTIPLAS';
    }
    
    // 3. HOTEL ÚNICO
    return 'HOTEL_UNICO';
}

// ================================================================================
// 📊 EXTRAÇÃO DE DADOS DE HOTEL
// ================================================================================

function extrairDadosHotel(conteudo) {
    const dados = {
        destino: null,
        checkin: null,
        checkout: null,
        noites: null,
        passageiros: null,
        hoteis: [],
        regime: null,
        observacoes: []
    };
    
    try {
        // DESTINO
        const matchDestino = conteudo.match(/hotéis?\s+em\s+([^,\n]+)/i) ||
                            conteudo.match(/hospedagem\s+em\s+([^,\n]+)/i) ||
                            conteudo.match(/([a-záêìóàõãç\s]+),?\s*-?\s*florida/i);
        
        if (matchDestino) {
            dados.destino = matchDestino[1].trim();
        }
        
        // DATAS
        const matchPeriodo = conteudo.match(/período:\s*(\d{1,2}\/\d{2})\s*a\s*(\d{1,2}\/\d{2})/i);
        if (matchPeriodo) {
            dados.checkin = matchPeriodo[1];
            dados.checkout = matchPeriodo[2];
        }
        
        // NOITES
        const matchNoites = conteudo.match(/(\d+)\s*noites?/i);
        if (matchNoites) {
            dados.noites = parseInt(matchNoites[1]);
        }
        
        // PASSAGEIROS
        const matchPassageiros = conteudo.match(/(\d+)\s*adultos?(?:\s*[+,]\s*(\d+)\s*crianças?)?/i);
        if (matchPassageiros) {
            const adultos = parseInt(matchPassageiros[1]);
            const criancas = parseInt(matchPassageiros[2]) || 0;
            dados.passageiros = `${adultos.toString().padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
            if (criancas > 0) {
                dados.passageiros += ` + ${criancas.toString().padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
            }
        }
        
        // HOTÉIS
        dados.hoteis = extrairListaHoteis(conteudo);
        
        // REGIME ALIMENTAR
        const regimes = ['café da manhã', 'meia pensão', 'pensão completa', 'all inclusive'];
        for (const regime of regimes) {
            if (conteudo.toLowerCase().includes(regime)) {
                dados.regime = regime;
                break;
            }
        }
        
        console.log('📊 Dados do hotel extraídos:', dados);
        
    } catch (error) {
        console.error('❌ Erro ao extrair dados do hotel:', error);
    }
    
    return dados;
}

// ================================================================================
// 🏨 EXTRAÇÃO DE LISTA DE HOTÉIS
// ================================================================================

function extrairListaHoteis(conteudo) {
    const hoteis = [];
    
    try {
        // Padrão para múltiplas opções
        const matchesOpcao = conteudo.match(/\*\*opção\s*\d+\*\*[^*]*?\*\*/gi);
        
        if (matchesOpcao) {
            matchesOpcao.forEach((opcao, index) => {
                const hotel = {
                    numero: index + 1,
                    nome: null,
                    localizacao: null,
                    estrelas: null,
                    quarto: null,
                    regime: null,
                    valor: null
                };
                
                // Nome do hotel
                const matchNome = opcao.match(/\*\*opção\s*\d+\*\*\s*-\s*([^⭐\n]+)/i);
                if (matchNome) {
                    hotel.nome = matchNome[1].trim();
                }
                
                // Estrelas
                const matchEstrelas = opcao.match(/⭐{1,5}|(\d+)\s*estrelas?/i);
                if (matchEstrelas) {
                    hotel.estrelas = matchEstrelas[0].includes('⭐') ? 
                                    matchEstrelas[0].length : 
                                    parseInt(matchEstrelas[1]);
                }
                
                // Localização
                const matchLoc = opcao.match(/📍\s*([^\n🛏️]+)/i);
                if (matchLoc) {
                    hotel.localizacao = matchLoc[1].trim();
                }
                
                // Tipo de quarto
                const matchQuarto = opcao.match(/🛏️\s*([^\n☕]+)/i);
                if (matchQuarto) {
                    hotel.quarto = matchQuarto[1].trim();
                }
                
                // Regime
                const matchRegime = opcao.match(/☕\s*([^\n💰]+)/i);
                if (matchRegime) {
                    hotel.regime = matchRegime[1].trim();
                }
                
                // Valor
                const matchValor = opcao.match(/💰\s*R\$\s*([\d.,]+)/i);
                if (matchValor) {
                    hotel.valor = matchValor[1];
                }
                
                hoteis.push(hotel);
            });
        }
        
        console.log(`🏨 ${hoteis.length} hotéis extraídos`);
        
    } catch (error) {
        console.error('❌ Erro ao extrair lista de hotéis:', error);
    }
    
    return hoteis;
}

// ================================================================================
// 🎯 VALIDAÇÃO DE HOTEL
// ================================================================================

/**
 * Valida se os dados de hotel estão consistentes
 * @param {Object} dadosHotel - Dados extraídos do hotel
 * @returns {Object} Resultado da validação
 */
export function validarDadosHotel(dadosHotel) {
    const validacao = {
        valido: true,
        avisos: [],
        erros: []
    };
    
    try {
        // Validar datas
        if (dadosHotel.checkin && dadosHotel.checkout) {
            const checkinDate = new Date(dadosHotel.checkin.split('/').reverse().join('-'));
            const checkoutDate = new Date(dadosHotel.checkout.split('/').reverse().join('-'));
            
            if (checkoutDate <= checkinDate) {
                validacao.erros.push('Data de checkout deve ser posterior ao checkin');
                validacao.valido = false;
            }
        }
        
        // Validar noites vs datas
        if (dadosHotel.checkin && dadosHotel.checkout && dadosHotel.noites) {
            const checkinDate = new Date(dadosHotel.checkin.split('/').reverse().join('-'));
            const checkoutDate = new Date(dadosHotel.checkout.split('/').reverse().join('-'));
            const diffDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays !== dadosHotel.noites) {
                validacao.avisos.push(`Conflito: ${diffDays} dias entre datas vs ${dadosHotel.noites} noites informadas`);
            }
        }
        
        // Validar hotéis
        if (dadosHotel.hoteis.length === 0) {
            validacao.avisos.push('Nenhum hotel específico identificado');
        }
        
        console.log('🎯 Validação hotel:', validacao);
        
    } catch (error) {
        console.error('❌ Erro na validação:', error);
        validacao.erros.push('Erro interno na validação');
        validacao.valido = false;
    }
    
    return validacao;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    detectarHotel,
    validarDadosHotel
};

// ================================================================================
// 📋 LOGS DE INICIALIZAÇÃO
// ================================================================================

console.log(`✅ Hotel Detector v${SYSTEM_CONFIG.VERSION} carregado`);
console.log('🏨 Funcionalidades: detecção, extração, validação de hotéis');
