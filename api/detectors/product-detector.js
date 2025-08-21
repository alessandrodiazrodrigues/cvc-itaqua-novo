// api/detectors/product-detector.js - DETECTOR UNIVERSAL v4.0
// ================================================================================
// 🎯 DETECTA TODOS OS PRODUTOS CVC AUTOMATICAMENTE
// 🔍 Analisa texto e identifica: aéreo, hotel, cruzeiro, carro, seguro, etc.
// 🛡️ Sistema à prova de falhas com fallbacks inteligentes
// ================================================================================

import { DETECTION_PATTERNS } from '../data/constants.js';

// ================================================================================
// 🧠 DETECTOR PRINCIPAL - IDENTIFICA QUALQUER PRODUTO CVC
// ================================================================================

export function detectProduct(data, requestId) {
    try {
        console.log(`🔍 [${requestId}] Iniciando detecção universal de produto...`);
        
        const { conteudoPrincipal, tipos, imagemBase64 } = data;
        const conteudoLower = conteudoPrincipal.toLowerCase();
        
        // 1. Análise por tipos selecionados pelo usuário (prioridade alta)
        const tipoUsuario = analyzeUserSelectedTypes(tipos, requestId);
        if (tipoUsuario) {
            console.log(`✅ [${requestId}] Tipo detectado via seleção: ${tipoUsuario}`);
            return tipoUsuario;
        }
        
        // 2. Detecção automática por padrões de conteúdo
        const tipoAutomatico = analyzeContentPatterns(conteudoLower, requestId);
        if (tipoAutomatico) {
            console.log(`✅ [${requestId}] Tipo detectado automaticamente: ${tipoAutomatico}`);
            return tipoAutomatico;
        }
        
        // 3. Detecção por estrutura de dados
        const tipoEstrutura = analyzeDataStructure(conteudoPrincipal, requestId);
        if (tipoEstrutura) {
            console.log(`✅ [${requestId}] Tipo detectado por estrutura: ${tipoEstrutura}`);
            return tipoEstrutura;
        }
        
        // 4. Análise de imagem (se houver)
        if (imagemBase64) {
            const tipoImagem = analyzeImageContext(conteudoPrincipal, requestId);
            if (tipoImagem) {
                console.log(`✅ [${requestId}] Tipo detectado por imagem: ${tipoImagem}`);
                return tipoImagem;
            }
        }
        
        // 5. Fallback padrão
        console.log(`⚠️ [${requestId}] Usando fallback: AEREO_SIMPLES`);
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro na detecção:`, error);
        return 'AEREO_SIMPLES'; // Fallback seguro
    }
}

// ================================================================================
// 🎯 ANÁLISE POR TIPOS SELECIONADOS PELO USUÁRIO
// ================================================================================

function analyzeUserSelectedTypes(tipos, requestId) {
    try {
        if (!Array.isArray(tipos) || tipos.length === 0) {
            return null;
        }
        
        console.log(`👤 [${requestId}] Analisando tipos selecionados:`, tipos);
        
        // Mapeamento direto de seleções do usuário
        const typeMap = {
            'Dicas': 'DICAS',
            'Ranking': 'RANKING_HOTEIS',
            'Cruzeiro': 'CRUZEIRO',
            'Carro': 'LOCACAO_CARRO',
            'Seguro': 'SEGURO_VIAGEM',
            'Passeios': 'PASSEIOS_INGRESSOS',
            'Traslados': 'TRASLADOS'
        };
        
        // Se usuário selecionou apenas Hotel (sem Aéreo)
        if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
            return 'HOTEL_PURO';
        }
        
        // Se selecionou Hotel + Aéreo
        if (tipos.includes('Hotel') && tipos.includes('Aéreo')) {
            return 'PACOTE_COMPLETO';
        }
        
        // Verificar outros tipos específicos
        for (const tipo of tipos) {
            if (typeMap[tipo]) {
                return typeMap[tipo];
            }
        }
        
        // Se selecionou apenas Aéreo ou Multitrechos
        if (tipos.includes('Multitrechos')) {
            return 'MULTITRECHO';
        }
        
        if (tipos.includes('Aéreo')) {
            return null; // Deixa para detecção automática (simples vs múltiplas)
        }
        
        return null;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na análise de tipos:`, error);
        return null;
    }
}

// ================================================================================
// 🔍 ANÁLISE POR PADRÕES DE CONTEÚDO
// ================================================================================

function analyzeContentPatterns(conteudo, requestId) {
    try {
        console.log(`🔍 [${requestId}] Analisando padrões de conteúdo...`);
        
        // 1. CRUZEIRO - Palavras-chave específicas
        const cruceiroPadrao = [
            'cruzeiro', 'navio', 'msc', 'costa', 'cabine', 
            'embarque:', 'santos', 'desembarque', 'bordo',
            'all inclusive mar', 'roteiro:', 'navegar'
        ];
        
        if (cruceiroPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🚢 [${requestId}] Detectado: CRUZEIRO`);
            return 'CRUZEIRO';
        }
        
        // 2. LOCAÇÃO DE CARRO - Palavras-chave específicas  
        const carroPadrao = [
            'locação', 'aluguel de carro', 'rental', 'veículo',
            'categoria econômica', 'categoria intermediária',
            'nissan versa', 'cnh', 'pid', 'automático',
            'pickup', 'drop off', 'hertz', 'avis', 'budget'
        ];
        
        if (carroPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🚗 [${requestId}] Detectado: LOCACAO_CARRO`);
            return 'LOCACAO_CARRO';
        }
        
        // 3. SEGURO VIAGEM - Palavras-chave específicas
        const seguroPadrao = [
            'seguro viagem', 'cobertura médica', 'despesas médicas',
            'bagagem extraviada', 'cancelamento de viagem',
            'assistência médica', 'usd 100.000', 'cobertura:',
            'apólice', 'sinistro', 'emergência médica'
        ];
        
        if (seguroPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🛡️ [${requestId}] Detectado: SEGURO_VIAGEM`);
            return 'SEGURO_VIAGEM';
        }
        
        // 4. TRASLADOS - Palavras-chave específicas
        const trasladoPadrao = [
            'traslado', 'transfer', 'transporte',
            'aeroporto → hotel', 'privativo', 'compartilhado',
            'motorista', 'veículo exclusivo',
            'shuttle', 'pickup', 'drop-off'
        ];
        
        if (trasladoPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🚌 [${requestId}] Detectado: TRASLADOS`);
            return 'TRASLADOS';
        }
        
        // 5. PASSEIOS/INGRESSOS - Palavras-chave específicas
        const passeiosPadrao = [
            'ingresso', 'disney', 'universal', 'parque',
            'magic kingdom', 'epcot', 'animal kingdom',
            'fast pass', 'park hopper', 'excursão',
            'tour', 'passeio', 'atração', 'entrada'
        ];
        
        if (passeiosPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🎢 [${requestId}] Detectado: PASSEIOS_INGRESSOS`);
            return 'PASSEIOS_INGRESSOS';
        }
        
        // 6. HOTEL PURO - Sem menção a voos
        const hotelPadrao = [
            'hotel', 'pousada', 'resort', 'hospedagem',
            'comfort suites', 'preferencial', 'diária',
            'check-in', 'check-out', 'café da manhã'
        ];
        
        const vooPadrao = [
            'voo', 'aeroporto', 'airlines', 'ida', 'volta',
            'partida', 'chegada', 'conexão', 'escala'
        ];
        
        const temHotel = hotelPadrao.some(palavra => conteudo.includes(palavra));
        const temVoo = vooPadrao.some(palavra => conteudo.includes(palavra));
        
        if (temHotel && !temVoo) {
            console.log(`🏨 [${requestId}] Detectado: HOTEL_PURO`);
            return 'HOTEL_PURO';
        }
        
        // 7. PACOTE COMPLETO - Hotel + Voo
        if (temHotel && temVoo && conteudo.includes('pacote')) {
            console.log(`📦 [${requestId}] Detectado: PACOTE_COMPLETO`);
            return 'PACOTE_COMPLETO';
        }
        
        // 8. DICAS - Solicitação específica
        const dicasPadrao = [
            'dicas para', 'informações sobre', 'gere dicas',
            'sugestões de', 'recomendações', 'o que fazer em'
        ];
        
        if (dicasPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`💡 [${requestId}] Detectado: DICAS`);
            return 'DICAS';
        }
        
        // 9. RANKING - Solicitação específica
        const rankingPadrao = [
            'ranking de hotéis', 'melhores hotéis', 'classificação',
            'gere ranking', 'top hotéis', 'avaliação de hotéis'
        ];
        
        if (rankingPadrao.some(palavra => conteudo.includes(palavra))) {
            console.log(`🏆 [${requestId}] Detectado: RANKING_HOTEIS`);
            return 'RANKING_HOTEIS';
        }
        
        return null; // Continua para próxima análise
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na análise de padrões:`, error);
        return null;
    }
}

// ================================================================================
// 📊 ANÁLISE POR ESTRUTURA DE DADOS
// ================================================================================

function analyzeDataStructure(conteudo, requestId) {
    try {
        console.log(`📊 [${requestId}] Analisando estrutura de dados...`);
        
        // 1. MULTITRECHO - Múltiplos trechos identificados
        const trechos = conteudo.match(/trecho\s*\d+/gi);
        if (trechos && trechos.length >= 2) {
            console.log(`✈️ [${requestId}] Detectado: MULTITRECHO (${trechos.length} trechos)`);
            return 'MULTITRECHO';
        }
        
        // 2. MÚLTIPLAS COMPANHIAS - Detectar diferentes airlines
        const companhias = detectAirlines(conteudo);
        if (companhias.length >= 2) {
            console.log(`✈️ [${requestId}] Detectado: MULTIPLAS_COMPANHIAS (${companhias.join(', ')})`);
            return 'MULTIPLAS_COMPANHIAS';
        }
        
        // 3. MÚLTIPLAS OPÇÕES - Detectar múltiplos preços/valores
        const valores = conteudo.match(/r\$\s*[\d.,]+/gi);
        if (valores && valores.length >= 2) {
            console.log(`💰 [${requestId}] Detectado: MULTIPLAS_OPCOES (${valores.length} preços)`);
            return 'MULTIPLAS_OPCOES';
        }
        
        // 4. SOMENTE IDA - Palavras-chave específicas
        if (conteudo.includes('somente ida') || conteudo.includes('one way')) {
            console.log(`➡️ [${requestId}] Detectado: SOMENTE_IDA`);
            return 'SOMENTE_IDA';
        }
        
        return null; // Continua para próxima análise
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na análise estrutural:`, error);
        return null;
    }
}

// ================================================================================
// 🖼️ ANÁLISE DE CONTEXTO DE IMAGEM
// ================================================================================

function analyzeImageContext(conteudo, requestId) {
    try {
        console.log(`🖼️ [${requestId}] Analisando contexto de imagem...`);
        
        // Para imagens, assumir que são capturas de tela de sites
        // Priorizar detecção de múltiplas opções se houver valores
        const valores = conteudo.match(/r\$\s*[\d.,]+/gi);
        if (valores && valores.length >= 2) {
            return 'MULTIPLAS_OPCOES';
        }
        
        // Se tem dados de hotel, assumir hotel
        if (conteudo.includes('hotel') || conteudo.includes('hospedagem')) {
            return 'HOTEL_PURO';
        }
        
        // Padrão para imagens
        return 'AEREO_SIMPLES';
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na análise de imagem:`, error);
        return null;
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function detectAirlines(conteudo) {
    try {
        const airlinePatterns = [
            'copa airlines', 'copa',
            'latam',
            'avianca', 
            'gol',
            'azul',
            'tap portugal', 'tap',
            'iberia',
            'emirates',
            'lufthansa',
            'air france',
            'klm',
            'american airlines',
            'delta',
            'united'
        ];
        
        const found = [];
        const conteudoLower = conteudo.toLowerCase();
        
        for (const airline of airlinePatterns) {
            if (conteudoLower.includes(airline)) {
                // Normalizar nome
                const normalized = airline.replace(/\s*airlines?/, '').trim();
                if (!found.includes(normalized)) {
                    found.push(normalized);
                }
            }
        }
        
        return found;
        
    } catch (error) {
        console.error('❌ Erro ao detectar companhias:', error);
        return [];
    }
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE DO DETECTOR
// ================================================================================

export function testProductDetector() {
    console.log('🧪 Testando detector de produtos...');
    
    const testCases = [
        {
            name: 'Cruzeiro MSC',
            content: 'Cruzeiro MSC Seaview embarque Santos 7 noites cabine interna',
            expected: 'CRUZEIRO'
        },
        {
            name: 'Locação de Carro',
            content: 'Locação Nissan Versa Orlando 8 dias categoria econômica',
            expected: 'LOCACAO_CARRO'
        },
        {
            name: 'Seguro Viagem',
            content: 'Seguro viagem internacional cobertura médica USD 100.000',
            expected: 'SEGURO_VIAGEM'
        },
        {
            name: 'Hotel Puro',
            content: 'Comfort Suites Orlando hotel 8 noites café da manhã',
            expected: 'HOTEL_PURO'
        },
        {
            name: 'Múltiplas Companhias',
            content: 'Copa Airlines R$ 2.500 Latam R$ 3.000 Orlando',
            expected: 'MULTIPLAS_COMPANHIAS'
        },
        {
            name: 'Dicas',
            content: 'Gere dicas para Orlando o que fazer passeios',
            expected: 'DICAS'
        }
    ];
    
    for (const test of testCases) {
        try {
            const data = {
                conteudoPrincipal: test.content,
                tipos: [],
                imagemBase64: null
            };
            
            const result = detectProduct(data, `test_${test.name}`);
            const success = result === test.expected;
            
            console.log(`${success ? '✅' : '❌'} ${test.name}: ${result} (esperado: ${test.expected})`);
            
        } catch (error) {
            console.error(`💥 Erro no teste ${test.name}:`, error);
        }
    }
    
    console.log('🧪 Testes do detector concluídos');
}

// ================================================================================
// 🔄 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('🔍 Detector Universal de Produtos v4.0 carregado');
console.log('📋 Produtos suportados: Aéreo, Hotel, Cruzeiro, Carro, Seguro, Traslados, Passeios, Dicas, Ranking');

// Executar teste em desenvolvimento
if (process.env.NODE_ENV === 'development') {
    // testProductDetector(); // Descomente para testar
}
