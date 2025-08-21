// api/detectors/data-extractor.js - EXTRATOR DE DADOS v4.0
// ================================================================================
// 📊 EXTRAI DADOS ESPECÍFICOS DE CADA TIPO DE PRODUTO
// 🎯 Identifica: passageiros, preços, datas, bagagem, parcelamento, etc.
// 🛡️ Robusto com fallbacks para dados ausentes ou malformados
// ================================================================================

import { PROCESSING_CONFIG } from '../data/constants.js';

// ================================================================================
// 🧠 EXTRATOR PRINCIPAL - COORDENA EXTRAÇÃO POR TIPO
// ================================================================================

export function extractAllData(conteudo, productType, requestId) {
    try {
        console.log(`📊 [${requestId}] Extraindo dados para tipo: ${productType}`);
        
        const baseData = extractBaseData(conteudo, requestId);
        const specificData = extractSpecificData(conteudo, productType, requestId);
        
        const allData = {
            ...baseData,
            ...specificData,
            productType,
            extractedAt: new Date().toISOString()
        };
        
        console.log(`✅ [${requestId}] Dados extraídos:`, {
            passageiros: allData.passageiros,
            valores: allData.valores?.length || 0,
            temBagagem: allData.temBagagem,
            temParcelamento: allData.temParcelamento
        });
        
        return allData;
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro na extração:`, error);
        return getDefaultData(productType);
    }
}

// ================================================================================
// 📋 EXTRAÇÃO DE DADOS BASE (COMUM A TODOS OS PRODUTOS)
// ================================================================================

function extractBaseData(conteudo, requestId) {
    try {
        console.log(`📋 [${requestId}] Extraindo dados base...`);
        
        return {
            // Passageiros
            passageiros: extractPassengers(conteudo, requestId),
            
            // Valores e preços
            valores: extractPrices(conteudo, requestId),
            
            // Datas
            datas: extractDates(conteudo, requestId),
            
            // Destino
            destino: extractDestination(conteudo, requestId),
            
            // Bagagem
            temBagagem: detectBaggage(conteudo, requestId),
            
            // Parcelamento
            temParcelamento: detectInstallments(conteudo, requestId),
            parcelamentoDetalhes: extractInstallmentDetails(conteudo, requestId),
            
            // Reembolso
            tipoReembolso: extractRefundType(conteudo, requestId),
            
            // Links
            links: extractLinks(conteudo, requestId)
        };
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na extração base:`, error);
        return {};
    }
}

// ================================================================================
// 👥 EXTRAÇÃO DE PASSAGEIROS
// ================================================================================

function extractPassengers(conteudo, requestId) {
    try {
        console.log(`👥 [${requestId}] Extraindo passageiros...`);
        
        // Padrões para detectar passageiros
        const patterns = [
            // "Total (5 Adultos)"
            /Total\s*\((\d+)\s*Adultos?\)/i,
            
            // "Total (4 Adultos, 1 Bebê e 1 Criança)"
            /Total\s*\((\d+)\s*Adultos?,\s*(\d+)\s*Bebês?\s*e\s*(\d+)\s*Crianças?\)/i,
            
            // "Total (4 Adultos e 2 Crianças)"
            /Total\s*\((\d+)\s*Adultos?\s*e\s*(\d+)\s*Crianças?\)/i,
            
            // "02 adultos + 01 criança"
            /(\d+)\s*adultos?\s*\+\s*(\d+)\s*crianças?/i,
            
            // "2 adultos, 1 bebê e 1 criança"
            /(\d+)\s*adultos?,\s*(\d+)\s*bebês?\s*e\s*(\d+)\s*crianças?/i,
            
            // "5 adultos"
            /(\d+)\s*adultos?/i
        ];
        
        for (const pattern of patterns) {
            const match = conteudo.match(pattern);
            if (match) {
                const adultos = parseInt(match[1]) || 0;
                const bebes = parseInt(match[2]) || 0;
                const criancas = parseInt(match[3]) || parseInt(match[2]) || 0;
                
                let resultado = `${String(adultos).padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
                
                if (bebes > 0) {
                    resultado += `, ${String(bebes).padStart(2, '0')} bebê${bebes > 1 ? 's' : ''}`;
                }
                
                if (criancas > 0 && !bebes) {
                    resultado += ` + ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
                } else if (criancas > 0) {
                    resultado += ` e ${String(criancas).padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
                }
                
                console.log(`✅ [${requestId}] Passageiros extraídos: ${resultado}`);
                return resultado;
            }
        }
        
        console.log(`⚠️ [${requestId}] Passageiros não encontrados - usando padrão`);
        return null;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair passageiros:`, error);
        return null;
    }
}

// ================================================================================
// 💰 EXTRAÇÃO DE PREÇOS E VALORES
// ================================================================================

function extractPrices(conteudo, requestId) {
    try {
        console.log(`💰 [${requestId}] Extraindo valores...`);
        
        // Padrões para valores monetários
        const patterns = [
            /R\$\s*([\d.,]+)/g,
            /R\$\s*([\d.]+,\d{2})/g,
            /(\d{1,3}(?:\.\d{3})*,\d{2})/g
        ];
        
        const valores = [];
        
        for (const pattern of patterns) {
            const matches = [...conteudo.matchAll(pattern)];
            for (const match of matches) {
                const valor = match[1] || match[0];
                if (valor && !valores.includes(valor)) {
                    valores.push(valor);
                }
            }
        }
        
        // Limpar e validar valores
        const valoresLimpos = valores
            .map(v => v.replace(/[^\d.,]/g, ''))
            .filter(v => v.length > 0 && parseFloat(v.replace('.', '').replace(',', '.')) > 0)
            .sort((a, b) => {
                const numA = parseFloat(a.replace(/\./g, '').replace(',', '.'));
                const numB = parseFloat(b.replace(/\./g, '').replace(',', '.'));
                return numA - numB;
            });
        
        console.log(`✅ [${requestId}] Valores extraídos: ${valoresLimpos.length} preços`);
        return valoresLimpos;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair valores:`, error);
        return [];
    }
}

// ================================================================================
// 📅 EXTRAÇÃO DE DATAS
// ================================================================================

function extractDates(conteudo, requestId) {
    try {
        console.log(`📅 [${requestId}] Extraindo datas...`);
        
        const patterns = [
            // "27 de janeiro - 04 de fevereiro"
            /(\d{1,2})\s+de\s+(\w+)\s*[-–]\s*(\d{1,2})\s+de\s+(\w+)/i,
            
            // "27/01 - 04/02"
            /(\d{1,2})\/(\d{1,2})\s*[-–]\s*(\d{1,2})\/(\d{1,2})/i,
            
            // "27/01/2024 - 04/02/2024"
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*[-–]\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
            
            // Datas individuais
            /(\d{1,2})\s+de\s+(\w+)/gi,
            /(\d{1,2})\/(\d{1,2})/g
        ];
        
        const datas = {
            ida: null,
            volta: null,
            periodo: null,
            individuais: []
        };
        
        // Tentar extrair período completo primeiro
        for (const pattern of patterns.slice(0, 3)) {
            const match = conteudo.match(pattern);
            if (match) {
                if (pattern.source.includes('de')) {
                    // Formato "27 de janeiro - 04 de fevereiro"
                    datas.ida = `${match[1].padStart(2, '0')}/${convertMonth(match[2])}`;
                    datas.volta = `${match[3].padStart(2, '0')}/${convertMonth(match[4])}`;
                } else {
                    // Formato DD/MM
                    datas.ida = `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}`;
                    datas.volta = `${match[3].padStart(2, '0')}/${match[4].padStart(2, '0')}`;
                }
                datas.periodo = `${datas.ida} a ${datas.volta}`;
                break;
            }
        }
        
        // Se não encontrou período, extrair datas individuais
        if (!datas.periodo) {
            const matches = [...conteudo.matchAll(patterns[4])];
            for (const match of matches) {
                if (match[0].includes('de')) {
                    const data = `${match[1].padStart(2, '0')}/${convertMonth(match[2])}`;
                    datas.individuais.push(data);
                } else {
                    const data = `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}`;
                    datas.individuais.push(data);
                }
            }
            
            if (datas.individuais.length >= 2) {
                datas.ida = datas.individuais[0];
                datas.volta = datas.individuais[1];
                datas.periodo = `${datas.ida} a ${datas.volta}`;
            }
        }
        
        console.log(`✅ [${requestId}] Datas extraídas:`, datas.periodo || `${datas.individuais.length} datas`);
        return datas;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair datas:`, error);
        return { ida: null, volta: null, periodo: null, individuais: [] };
    }
}

// ================================================================================
// 🗺️ EXTRAÇÃO DE DESTINO
// ================================================================================

function extractDestination(conteudo, requestId) {
    try {
        console.log(`🗺️ [${requestId}] Extraindo destino...`);
        
        const destinos = [
            'Orlando', 'Miami', 'Nova York', 'Los Angeles', 'Las Vegas',
            'Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'Roma',
            'Londres', 'Amsterdam', 'Berlin', 'Munique', 'Zurique',
            'Buenos Aires', 'Santiago', 'Lima', 'Bogotá', 'Montevidéu',
            'Salvador', 'Recife', 'Fortaleza', 'Natal', 'Maceió',
            'Cancún', 'Punta Cana', 'Aruba', 'Cartagena'
        ];
        
        const conteudoLower = conteudo.toLowerCase();
        
        for (const destino of destinos) {
            if (conteudoLower.includes(destino.toLowerCase())) {
                console.log(`✅ [${requestId}] Destino encontrado: ${destino}`);
                return destino;
            }
        }
        
        console.log(`⚠️ [${requestId}] Destino não identificado`);
        return null;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair destino:`, error);
        return null;
    }
}

// ================================================================================
// 🧳 DETECÇÃO DE BAGAGEM
// ================================================================================

function detectBaggage(conteudo, requestId) {
    try {
        const baggageKeywords = [
            'com bagagem', 'bagagem despachada', 'bagagem incluída',
            'mala despachada', '23kg', '32kg', 'bagagens inclusas',
            'bagagem de porão', 'checked baggage'
        ];
        
        const conteudoLower = conteudo.toLowerCase();
        const temBagagem = baggageKeywords.some(keyword => conteudoLower.includes(keyword));
        
        console.log(`🧳 [${requestId}] Bagagem despachada: ${temBagagem ? 'SIM' : 'NÃO'}`);
        return temBagagem;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao detectar bagagem:`, error);
        return false;
    }
}

// ================================================================================
// 💳 DETECÇÃO DE PARCELAMENTO
// ================================================================================

function detectInstallments(conteudo, requestId) {
    try {
        const installmentKeywords = [
            'entrada de r$', 'parcela', 'parcelamento', 'x de r$',
            'primeira parcela', 'mais', 'sem juros', 'no cartão'
        ];
        
        const conteudoLower = conteudo.toLowerCase();
        const temParcelamento = installmentKeywords.some(keyword => conteudoLower.includes(keyword));
        
        console.log(`💳 [${requestId}] Parcelamento: ${temParcelamento ? 'SIM' : 'NÃO'}`);
        return temParcelamento;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao detectar parcelamento:`, error);
        return false;
    }
}

// ================================================================================
// 💳 EXTRAÇÃO DE DETALHES DO PARCELAMENTO
// ================================================================================

function extractInstallmentDetails(conteudo, requestId) {
    try {
        console.log(`💳 [${requestId}] Extraindo detalhes do parcelamento...`);
        
        // Padrão: "Entrada de R$ 7.777,69 + 5x de R$ 2.583,06"
        const pattern = /Entrada de R\$\s*([\d.,]+)\s*\+\s*(\d+)x\s*de\s*R\$\s*([\d.,]+)/i;
        const match = conteudo.match(pattern);
        
        if (match) {
            const entrada = match[1];
            const numParcelas = parseInt(match[2]);
            const valorParcela = match[3];
            const totalParcelas = numParcelas + 1;
            
            const detalhes = {
                entrada,
                numParcelas,
                valorParcela,
                totalParcelas,
                formato: `Total em até ${totalParcelas}x, sendo a primeira de R$ ${entrada}, mais ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`
            };
            
            console.log(`✅ [${requestId}] Parcelamento extraído: ${totalParcelas}x`);
            return detalhes;
        }
        
        console.log(`⚠️ [${requestId}] Detalhes do parcelamento não encontrados`);
        return null;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair parcelamento:`, error);
        return null;
    }
}

// ================================================================================
// 🏷️ EXTRAÇÃO DE TIPO DE REEMBOLSO
// ================================================================================

function extractRefundType(conteudo, requestId) {
    try {
        const conteudoLower = conteudo.toLowerCase();
        
        if (conteudoLower.includes('reembolsável') && !conteudoLower.includes('não reembolsável')) {
            return 'Reembolsável conforme regras do bilhete';
        }
        
        return 'Não reembolsável';
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair reembolso:`, error);
        return 'Não reembolsável';
    }
}

// ================================================================================
// 🔗 EXTRAÇÃO DE LINKS
// ================================================================================

function extractLinks(conteudo, requestId) {
    try {
        const linkPattern = /https?:\/\/[^\s]+/g;
        const links = [...conteudo.matchAll(linkPattern)].map(match => match[0]);
        
        console.log(`🔗 [${requestId}] Links extraídos: ${links.length}`);
        return links;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair links:`, error);
        return [];
    }
}

// ================================================================================
// 🎯 EXTRAÇÃO DE DADOS ESPECÍFICOS POR PRODUTO
// ================================================================================

function extractSpecificData(conteudo, productType, requestId) {
    try {
        console.log(`🎯 [${requestId}] Extraindo dados específicos para: ${productType}`);
        
        switch (productType) {
            case 'CRUZEIRO':
                return extractCruiseData(conteudo, requestId);
                
            case 'LOCACAO_CARRO':
                return extractCarRentalData(conteudo, requestId);
                
            case 'SEGURO_VIAGEM':
                return extractInsuranceData(conteudo, requestId);
                
            case 'TRASLADOS':
                return extractTransferData(conteudo, requestId);
                
            case 'PASSEIOS_INGRESSOS':
                return extractTicketsData(conteudo, requestId);
                
            case 'HOTEL_PURO':
            case 'PACOTE_COMPLETO':
                return extractHotelData(conteudo, requestId);
                
            default:
                return extractFlightData(conteudo, requestId);
        }
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro na extração específica:`, error);
        return {};
    }
}

// ================================================================================
// 🚢 DADOS ESPECÍFICOS DE CRUZEIRO
// ================================================================================

function extractCruiseData(conteudo, requestId) {
    try {
        const data = {};
        
        // Nome do navio
        const navioMatch = conteudo.match(/(msc|costa)\s+(\w+)/i);
        if (navioMatch) {
            data.navio = navioMatch[0];
        }
        
        // Duração
        const duracaoMatch = conteudo.match(/(\d+)\s*noites?/i);
        if (duracaoMatch) {
            data.duracao = `${duracaoMatch[1]} noites`;
        }
        
        // Porto de embarque
        const portoMatch = conteudo.match(/embarque:?\s*(\w+)/i);
        if (portoMatch) {
            data.porto = portoMatch[1];
        }
        
        // Tipos de cabine
        const cabines = [];
        if (conteudo.toLowerCase().includes('interna')) cabines.push('interna');
        if (conteudo.toLowerCase().includes('externa')) cabines.push('externa');
        if (conteudo.toLowerCase().includes('varanda')) cabines.push('varanda');
        data.cabines = cabines;
        
        console.log(`🚢 [${requestId}] Dados do cruzeiro extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados do cruzeiro:`, error);
        return {};
    }
}

// ================================================================================
// 🚗 DADOS ESPECÍFICOS DE LOCAÇÃO DE CARRO
// ================================================================================

function extractCarRentalData(conteudo, requestId) {
    try {
        const data = {};
        
        // Categoria do veículo
        if (conteudo.toLowerCase().includes('econômica')) data.categoria = 'Econômica';
        if (conteudo.toLowerCase().includes('intermediária')) data.categoria = 'Intermediária';
        if (conteudo.toLowerCase().includes('executiva')) data.categoria = 'Executiva';
        
        // Modelo do carro
        const modeloMatch = conteudo.match(/(nissan|ford|chevrolet|fiat)\s+(\w+)/i);
        if (modeloMatch) {
            data.modelo = modeloMatch[0];
        }
        
        // Número de dias
        const diasMatch = conteudo.match(/(\d+)\s*dias?/i);
        if (diasMatch) {
            data.dias = parseInt(diasMatch[1]);
        }
        
        console.log(`🚗 [${requestId}] Dados da locação extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados da locação:`, error);
        return {};
    }
}

// ================================================================================
// 🛡️ DADOS ESPECÍFICOS DE SEGURO
// ================================================================================

function extractInsuranceData(conteudo, requestId) {
    try {
        const data = {};
        
        // Cobertura médica
        const coberturaMatch = conteudo.match(/usd\s*([\d.,]+)/i);
        if (coberturaMatch) {
            data.coberturaMedica = `USD ${coberturaMatch[1]}`;
        }
        
        // Países/regiões
        const paisesMatch = conteudo.match(/(eua|europa|mundo|nacional)/i);
        if (paisesMatch) {
            data.regiao = paisesMatch[1].toUpperCase();
        }
        
        console.log(`🛡️ [${requestId}] Dados do seguro extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados do seguro:`, error);
        return {};
    }
}

// ================================================================================
// 🚌 DADOS ESPECÍFICOS DE TRASLADOS
// ================================================================================

function extractTransferData(conteudo, requestId) {
    try {
        const data = {};
        
        // Tipo de traslado
        if (conteudo.toLowerCase().includes('privativo')) data.tipo = 'Privativo';
        if (conteudo.toLowerCase().includes('compartilhado')) data.tipo = 'Compartilhado';
        if (conteudo.toLowerCase().includes('executivo')) data.tipo = 'Executivo';
        
        console.log(`🚌 [${requestId}] Dados do traslado extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados do traslado:`, error);
        return {};
    }
}

// ================================================================================
// 🎢 DADOS ESPECÍFICOS DE PASSEIOS/INGRESSOS
// ================================================================================

function extractTicketsData(conteudo, requestId) {
    try {
        const data = {};
        
        // Parques
        const parques = [];
        if (conteudo.toLowerCase().includes('disney')) parques.push('Disney');
        if (conteudo.toLowerCase().includes('universal')) parques.push('Universal');
        if (conteudo.toLowerCase().includes('seaworld')) parques.push('SeaWorld');
        data.parques = parques;
        
        // Número de dias
        const diasMatch = conteudo.match(/(\d+)\s*dias?/i);
        if (diasMatch) {
            data.dias = parseInt(diasMatch[1]);
        }
        
        console.log(`🎢 [${requestId}] Dados dos ingressos extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados dos ingressos:`, error);
        return {};
    }
}

// ================================================================================
// 🏨 DADOS ESPECÍFICOS DE HOTEL
// ================================================================================

function extractHotelData(conteudo, requestId) {
    try {
        const data = {};
        
        // Nome do hotel
        const hotelMatch = conteudo.match(/(comfort suites|hotel|resort)\s+([^\n,]+)/i);
        if (hotelMatch) {
            data.nomeHotel = hotelMatch[0].trim();
        }
        
        // Número de noites
        const noitesMatch = conteudo.match(/(\d+)\s*noites?/i);
        if (noitesMatch) {
            data.noites = parseInt(noitesMatch[1]);
        }
        
        console.log(`🏨 [${requestId}] Dados do hotel extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados do hotel:`, error);
        return {};
    }
}

// ================================================================================
// ✈️ DADOS ESPECÍFICOS DE VOOS
// ================================================================================

function extractFlightData(conteudo, requestId) {
    try {
        const data = {};
        
        // Companhias aéreas
        const companhias = [];
        const airlinePattern = /(copa|latam|avianca|gol|azul|tap|iberia|emirates)/gi;
        const matches = [...conteudo.matchAll(airlinePattern)];
        for (const match of matches) {
            const airline = match[0].toLowerCase();
            if (!companhias.includes(airline)) {
                companhias.push(airline);
            }
        }
        data.companhias = companhias;
        
        // Tipo de voo (direto, conexão)
        if (conteudo.toLowerCase().includes('direto')) data.tipoVoo = 'direto';
        if (conteudo.toLowerCase().includes('escala') || conteudo.toLowerCase().includes('conexão')) {
            data.tipoVoo = 'conexao';
        }
        
        console.log(`✈️ [${requestId}] Dados do voo extraídos:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro ao extrair dados do voo:`, error);
        return {};
    }
}

// ================================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================================

function convertMonth(monthName) {
    const months = PROCESSING_CONFIG.DATE_FORMATS.months_map;
    return months[monthName.toLowerCase()] || monthName;
}

function getDefaultData(productType) {
    return {
        productType,
        passageiros: null,
        valores: [],
        datas: { ida: null, volta: null, periodo: null, individuais: [] },
        destino: null,
        temBagagem: false,
        temParcelamento: false,
        tipoReembolso: 'Não reembolsável',
        links: [],
        extractedAt: new Date().toISOString()
    };
}

// ================================================================================
// 🔄 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('📊 Extrator de Dados v4.0 carregado');
console.log('🎯 Capaz de extrair dados específicos para todos os produtos CVC');
