// api/tests/test-cases.js - CASOS DE TESTE REAIS v4.0
// ================================================================================
// 🧪 CASOS DE TESTE BASEADOS EM EXEMPLOS REAIS DO MANUAL
// 🎯 Valida todos os tipos de orçamento e suas variações
// ================================================================================

import { SYSTEM_CONFIG } from '../data/constants.js';

// ================================================================================
// ✈️ CASOS DE TESTE - AÉREO
// ================================================================================

export const CASOS_AEREO = {
    
    // 1. AÉREO SIMPLES
    AEREO_SIMPLES_BASICO: {
        nome: 'Aéreo Simples - Gol São Paulo → Porto Alegre',
        tipo: 'AEREO_SIMPLES',
        entrada: `Gol - São Paulo para Porto Alegre
        ter, 17/09 - GRU 17:05 / POA 23:40 (uma escala)
        qua, 24/09 - POA 08:00 / CGH 09:35 (voo direto)
        R$ 773,37 para 1 adulto
        Só mala de mão incluída
        Não reembolsável`,
        
        esperado: {
            titulo: '*Gol - São Paulo ✈ Porto Alegre*',
            datasSemDiaSemana: ['17/09', '24/09'],
            aeroportosConvertidos: ['Guarulhos', 'Porto Alegre', 'Congonhas'],
            valor: 'R$ 773,37',
            passageiros: '01 adulto',
            bagagem: 'Inclui 1 item pessoal + 1 mala de mão de 10kg',
            versao: `(v${SYSTEM_CONFIG.VERSION})`
        }
    },
    
    // 2. MÚLTIPLAS OPÇÕES
    MULTIPLAS_OPCOES_2: {
        nome: 'Múltiplas Opções - 2 Planos Latam',
        tipo: 'MULTIPLAS_OPCOES_2',
        entrada: `Latam - São Paulo para Orlando
        seg, 27/01 - GRU 23:00 / MCO 09:15 (voo direto)
        ter, 04/02 - MCO 23:59 / GRU 06:25 (+1) (voo direto)
        
        OPÇÃO 1 - R$ 4.847,28
        Só mala de mão incluída
        10x de R$ 484,73 s/ juros
        
        OPÇÃO 2 - R$ 5.291,28  
        Com bagagem despachada
        Cancelamento/alteração com multas
        12x de R$ 440,94 s/ juros`,
        
        esperado: {
            titulo: '*Latam - São Paulo ✈ Orlando*',
            opcoes: 2,
            maisUm: true, // Deve manter (+1) para Orlando
            bagagemVariada: true
        }
    },
    
    // 3. MÚLTIPLAS COMPANHIAS
    MULTIPLAS_COMPANHIAS: {
        nome: 'Múltiplas Companhias - Copa vs Latam',
        tipo: 'MULTIPLAS_COMPANHIAS',
        entrada: `Copa Airlines - São Paulo para Orlando
        27/01 - GRU 06:30 / MCO 18:45 (com conexão)
        04/02 - MCO 20:00 / GRU 05:30 (+1) (com conexão)
        R$ 4.200,00 para 2 adultos
        
        Latam - São Paulo para Orlando  
        27/01 - GRU 23:00 / MCO 09:15 (voo direto)
        04/02 - MCO 23:59 / GRU 06:25 (+1) (voo direto)
        R$ 4.847,28 para 2 adultos`,
        
        esperado: {
            companhias: ['Copa', 'Latam'],
            opcoes: 2,
            maisUm: true
        }
    }
};

// ================================================================================
// 🏨 CASOS DE TESTE - HOTÉIS
// ================================================================================

export const CASOS_HOTEIS = {
    
    // 1. HOTEL PURO (SEM VOO)
    HOTEL_ORLANDO: {
        nome: 'Hotel Orlando - Comfort Suites',
        tipo: 'HOTEIS_MULTIPLAS',
        entrada: `Hotéis em Orlando - Florida
        Período: ter, 27/01 a ter, 04/02 (8 noites)
        4 Adultos e 2 Crianças
        
        Comfort Suites Maingate East ⭐⭐⭐
        2775 florida plaza blvd
        Studio Suite
        Café da manhã
        R$ 5.568,03 total`,
        
        esperado: {
            semVoo: true,
            titulo: '*Hotéis em Orlando*',
            periodo: '27/01 a 04/02',
            noites: '8 noites',
            passageiros: '04 adultos + 02 crianças'
        }
    },
    
    // 2. MÚLTIPLAS OPÇÕES DE HOTÉIS
    HOTEIS_MULTIPLAS_OPCOES: {
        nome: 'Múltiplas Opções - 3 Hotéis Lisboa',
        tipo: 'HOTEIS_MULTIPLAS',
        entrada: `Hotéis em Lisboa
        Período: 15/11 a 22/11 (7 noites)
        02 adultos
        
        OPÇÃO 1 - Hotel Real Palácio ⭐⭐⭐⭐
        Rua das Janelas Verdes
        Quarto Standard
        Só hospedagem
        R$ 2.150,00 total
        
        OPÇÃO 2 - Tivoli Oriente ⭐⭐⭐⭐⭐
        Oriente Station
        Superior Room
        Café da manhã incluído
        R$ 3.280,00 total
        
        OPÇÃO 3 - Pensão Residencial ⭐⭐⭐
        Rossio
        Quarto Duplo
        Café da manhã
        R$ 1.680,00 total`,
        
        esperado: {
            opcoes: 3,
            regimeAlimentar: true,
            estrelas: true
        }
    }
};

// ================================================================================
// 🗺️ CASOS DE TESTE - MULTITRECHO
// ================================================================================

export const CASOS_MULTITRECHO = {
    
    EUROPA_3_CIDADES: {
        nome: 'Multitrecho Europa - 3 Cidades',
        tipo: 'MULTITRECHO',
        entrada: `Multitrecho - Latam/Tap
        15/11 a 29/11 (14 dias e 13 noites)
        
        Trecho 1: São Paulo → Lisboa
        15/11 - GRU 23:30 / LIS 13:15 (+1) (voo direto)
        
        Trecho 2: Lisboa → Madrid  
        20/11 - LIS 08:00 / MAD 10:30 (voo direto)
        
        Trecho 3: Madrid → São Paulo
        29/11 - MAD 11:45 / GRU 06:30 (+1) (voo direto)
        
        R$ 6.850,00 para 01 adulto
        Mala de mão + bagagem despachada 23kg
        Reembolsável conforme regras`,
        
        esperado: {
            trechos: 3,
            companhias: ['Latam', 'Tap'],
            duracao: '14 dias e 13 noites'
        }
    }
};

// ================================================================================
// 🏖️ CASOS DE TESTE - PACOTES
// ================================================================================

export const CASOS_PACOTES = {
    
    PACOTE_COMPLETO_ORLANDO: {
        nome: 'Pacote Completo Orlando',
        tipo: 'PACOTE_COMPLETO',
        entrada: `Pacote Orlando
        Embarque: 27/01
        Pacote para 4 Adultos e 2 Crianças
        
        O Pacote Inclui:
        - Passagem Aérea ida e volta para Orlando
        - Taxas de Embarque
        - Traslado executivo
        - Seguro viagem
        - 8 noites de hospedagem no hotel escolhido
        
        Voos Latam:
        27/01 - GRU 23:00 / MCO 09:15 (voo direto)
        04/02 - MCO 23:59 / GRU 06:25 (+1) (voo direto)
        
        OPÇÃO 1 - Comfort Suites Maingate East
        2775 Florida Plaza Blvd
        Studio Suite com café da manhã
        R$ 28.450,00 para 4 Adultos e 2 Crianças
        
        OPÇÃO 2 - Holiday Inn Resort ⭐ Preferencial
        14500 Continental Gateway
        Family Suite com café da manhã
        Reembolsável conforme regras do bilhete
        R$ 35.680,00 para 4 Adultos e 2 Crianças`,
        
        esperado: {
            temVoo: true,
            temHotel: true,
            opcoes: 2,
            inclui: ['Passagem', 'Taxas', 'Traslado', 'Seguro']
        }
    }
};

// ================================================================================
// 💡 CASOS DE TESTE - DICAS E RANKINGS
// ================================================================================

export const CASOS_DICAS = {
    
    DICAS_ORLANDO: {
        nome: 'Dicas para Orlando',
        tipo: 'DICAS_DESTINO',
        entrada: 'Gere dicas para Orlando considerando que é uma viagem em família com crianças',
        
        esperado: {
            formato: 'DICAS PARA ORLANDO',
            secoes: ['Sobre o destino', 'PRINCIPAIS PASSEIOS', 'CLIMA', 'GASTRONOMIA', 'CUSTOS MÉDIOS', 'DICAS PRÁTICAS', 'IMPORTANTE'],
            finalizacao: 'PRODUTOS CVC'
        }
    },
    
    RANKING_HOTEIS_LISBOA: {
        nome: 'Ranking Hotéis Lisboa',
        tipo: 'RANKING_HOTEIS',
        entrada: 'Gere ranking de hotéis para Lisboa por categoria',
        
        esperado: {
            formato: 'RANKING DE HOTÉIS - LISBOA',
            categorias: ['LUXO', 'SUPERIOR', 'ECONÔMICA'],
            finalizacao: 'PRODUTOS CVC'
        }
    }
};

// ================================================================================
// 🚢 CASOS DE TESTE - CRUZEIROS
// ================================================================================

export const CASOS_CRUZEIROS = {
    
    CRUZEIRO_COSTA: {
        nome: 'Cruzeiro Costa Fascinosa',
        tipo: 'CRUZEIRO',
        entrada: `Cruzeiro Costa Fascinosa - 7 noites
        2 adultos + 1 criança (8 anos)
        Embarque: sab, 15/03
        Saída e chegada: Santos
        Roteiro: Santos, Búzios, Salvador, Maceió, Santos
        
        Cabine Interna: R$ 2.850,00
        Cabine Externa: R$ 3.450,00
        Suíte: R$ 5.680,00`,
        
        esperado: {
            navio: 'Costa Fascinosa',
            duracao: '7 noites',
            cabines: 3,
            roteiro: true
        }
    }
};

// ================================================================================
// 🖼️ CASOS DE TESTE - IMAGENS
// ================================================================================

export const CASOS_IMAGEM = {
    
    SCREENSHOT_AEREO: {
        nome: 'Screenshot Orçamento Aéreo',
        tipo: 'AEREO_SIMPLES',
        entrada: 'IMAGEM_BASE64_SIMULADA',
        ehImagem: true,
        
        esperado: {
            extrairDados: true,
            naoInventar: true,
            manterHorarios: true
        }
    }
};

// ================================================================================
// ⚠️ CASOS DE TESTE - EDGE CASES
// ================================================================================

export const CASOS_EDGE = {
    
    TEXTO_INCOMPLETO: {
        nome: 'Texto Incompleto - Dados Faltando',
        tipo: 'AEREO_SIMPLES',
        entrada: `Latam - São Paulo
        27/01 - voo para Orlando
        R$ 4.500,00`,
        
        esperado: {
            naoInventar: true,
            usarDisponivel: true,
            fallback: true
        }
    },
    
    MULTIPLOS_CODIGOS_AEROPORTO: {
        nome: 'Múltiplos Códigos Não Conhecidos',
        tipo: 'AEREO_SIMPLES',
        entrada: `TAP - São Paulo para Lisboa
        27/01 - GRU 23:30 / LIS 13:15
        04/02 - OPO 15:20 / GRU 22:45
        R$ 3.200,00 para 1 adulto`,
        
        esperado: {
            conversaoAeroportos: true,
            buscaOnline: true
        }
    },
    
    DADOS_CONFLITANTES: {
        nome: 'Dados Conflitantes no Texto',
        tipo: 'HOTEIS_MULTIPLAS',
        entrada: `Hotel em Orlando com voo incluído
        Aeroporto GRU para MCO
        Hotel Comfort Suites
        8 noites em Orlando
        R$ 15.000,00`,
        
        esperado: {
            detectarConflito: true,
            priorizarHotel: true
        }
    }
};

// ================================================================================
// 📊 SUITE COMPLETA DE TESTES
// ================================================================================

export const SUITE_TESTES = {
    AEREO: CASOS_AEREO,
    HOTEIS: CASOS_HOTEIS,
    MULTITRECHO: CASOS_MULTITRECHO,
    PACOTES: CASOS_PACOTES,
    DICAS: CASOS_DICAS,
    CRUZEIROS: CASOS_CRUZEIROS,
    IMAGEM: CASOS_IMAGEM,
    EDGE_CASES: CASOS_EDGE
};

// ================================================================================
// 🔍 FUNÇÕES DE UTILIDADE PARA TESTES
// ================================================================================

/**
 * Obtém todos os casos de teste de um tipo específico
 * @param {string} tipo - Tipo de orçamento
 * @returns {Array} Casos de teste do tipo
 */
export function obterCasosPorTipo(tipo) {
    const casos = [];
    
    for (const [categoria, casosDaCategoria] of Object.entries(SUITE_TESTES)) {
        for (const [nome, caso] of Object.entries(casosDaCategoria)) {
            if (caso.tipo === tipo) {
                casos.push({ ...caso, categoria, nome });
            }
        }
    }
    
    return casos;
}

/**
 * Obtém caso de teste específico por nome
 * @param {string} nomeCaso - Nome do caso de teste
 * @returns {Object|null} Caso de teste encontrado
 */
export function obterCasoPorNome(nomeCaso) {
    for (const [categoria, casosDaCategoria] of Object.entries(SUITE_TESTES)) {
        for (const [nome, caso] of Object.entries(casosDaCategoria)) {
            if (nome === nomeCaso || caso.nome === nomeCaso) {
                return { ...caso, categoria, chave: nome };
            }
        }
    }
    
    return null;
}

/**
 * Lista todos os tipos de orçamento testados
 * @returns {Array} Array de tipos únicos
 */
export function listarTiposTestados() {
    const tipos = new Set();
    
    for (const categoria of Object.values(SUITE_TESTES)) {
        for (const caso of Object.values(categoria)) {
            tipos.add(caso.tipo);
        }
    }
    
    return Array.from(tipos).sort();
}

/**
 * Conta total de casos de teste
 * @returns {Object} Estatísticas dos testes
 */
export function contarCasosTeste() {
    const stats = {
        total: 0,
        porCategoria: {},
        porTipo: {}
    };
    
    for (const [categoria, casos] of Object.entries(SUITE_TESTES)) {
        const quantidadeCasos = Object.keys(casos).length;
        stats.porCategoria[categoria] = quantidadeCasos;
        stats.total += quantidadeCasos;
        
        for (const caso of Object.values(casos)) {
            stats.porTipo[caso.tipo] = (stats.porTipo[caso.tipo] || 0) + 1;
        }
    }
    
    return stats;
}

/**
 * Valida estrutura de um caso de teste
 * @param {Object} caso - Caso de teste a validar
 * @returns {Object} Resultado da validação
 */
export function validarCasoTeste(caso) {
    const validacao = {
        valido: true,
        erros: [],
        avisos: []
    };
    
    // Campos obrigatórios
    const camposObrigatorios = ['nome', 'tipo', 'entrada', 'esperado'];
    
    for (const campo of camposObrigatorios) {
        if (!caso[campo]) {
            validacao.erros.push(`Campo obrigatório ausente: ${campo}`);
            validacao.valido = false;
        }
    }
    
    // Validações específicas
    if (caso.entrada && caso.entrada.length < 10) {
        validacao.avisos.push('Entrada muito curta para teste realista');
    }
    
    if (caso.esperado && Object.keys(caso.esperado).length === 0) {
        validacao.avisos.push('Nenhuma expectativa definida');
    }
    
    return validacao;
}

// ================================================================================
// 📤 EXPORTS
// ================================================================================

export default {
    SUITE_TESTES,
    obterCasosPorTipo,
    obterCasoPorNome,
    listarTiposTestados,
    contarCasosTeste,
    validarCasoTeste
};

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

const stats = contarCasosTeste();
console.log(`✅ Test Cases v${SYSTEM_CONFIG.VERSION} carregado`);
console.log(`🧪 Total de casos: ${stats.total}`);
console.log(`📊 Por categoria:`, stats.porCategoria);
console.log(`🎯 Tipos testados: ${listarTiposTestados().length}`);
