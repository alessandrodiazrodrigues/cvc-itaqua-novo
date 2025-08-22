// api/ai-google.js - SISTEMA HÍBRIDO v4.01 - CORREÇÕES GARANTIDAS
// ================================================================================
// 🎯 SISTEMA QUE FORÇA APLICAÇÃO DE TODAS AS CORREÇÕES
// 🛡️ GARANTE JSON VÁLIDO + APLICA CORREÇÕES MESMO SE IA FALHAR
// ================================================================================

import { safeJSONResponse } from './core/json-response.js';

// Configuração atualizada
const SYSTEM_CONFIG = {
    VERSION: '4.01',
    SISTEMA: 'CVC ITAQUA HÍBRIDO'
};

// ================================================================================
// 🧠 HANDLER PRINCIPAL HÍBRIDO
// ================================================================================

export default async function handler(req, res) {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    try {
        console.log(`🚀 [${requestId}] CVC ITAQUA v${SYSTEM_CONFIG.VERSION} - HÍBRIDO`);
        
        // 1. Setup básico
        setupSecurityHeaders(res);
        
        if (req.method === 'OPTIONS') {
            return safeJSONResponse(res, true, 'CORS OK', null, { requestId });
        }
        
        if (req.method === 'GET') {
            return safeJSONResponse(res, true, getSystemStatus(), null, { requestId });
        }
        
        if (req.method !== 'POST') {
            return safeJSONResponse(res, false, 'Use POST', 'Método não permitido', { requestId });
        }
        
        // 2. Extrair dados
        const body = req.body || {};
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
        } = body;
        
        const conteudoPrincipal = (observacoes || textoColado || pdfContent || '').toString();
        
        if (!conteudoPrincipal.trim() && !imagemBase64) {
            return safeJSONResponse(res, false, 'Dados obrigatórios', 
                'Adicione informações sobre a viagem', { requestId });
        }
        
        console.log(`📥 [${requestId}] Entrada: ${conteudoPrincipal.length} chars`);
        
        // 3. DETECÇÃO BÁSICA
        const dadosDetectados = detectarDadosBasicos(conteudoPrincipal);
        const tipoOrcamento = detectarTipo(conteudoPrincipal, tipos);
        
        console.log(`🎯 [${requestId}] Tipo: ${tipoOrcamento}`);
        console.log(`📊 [${requestId}] Dados:`, dadosDetectados);
        
        // 4. FORMATAÇÃO COM IA (se disponível)
        let resultadoIA = '';
        let iaUsada = 'none';
        
        try {
            if (process.env.OPENAI_API_KEY) {
                console.log(`🧠 [${requestId}] Processando com IA...`);
                resultadoIA = await processarComIA(conteudoPrincipal, tipoOrcamento);
                iaUsada = 'gpt';
                console.log(`✅ [${requestId}] IA gerou: ${resultadoIA.length} chars`);
            } else {
                console.log(`⚠️ [${requestId}] IA não disponível, usando template básico`);
                resultadoIA = gerarTemplateBasico(conteudoPrincipal, dadosDetectados, tipoOrcamento);
            }
        } catch (iaError) {
            console.error(`❌ [${requestId}] Erro IA:`, iaError.message);
            resultadoIA = gerarTemplateBasico(conteudoPrincipal, dadosDetectados, tipoOrcamento);
            iaUsada = 'fallback';
        }
        
        // 5. APLICAÇÃO FORÇADA DE TODAS AS CORREÇÕES
        console.log(`🔧 [${requestId}] APLICANDO CORREÇÕES FORÇADAS...`);
        
        let resultadoFinal = resultadoIA;
        
        // Aplicar correções uma por uma, FORÇADAMENTE
        resultadoFinal = aplicarCorrecoesForcadas(resultadoFinal, conteudoPrincipal, {
            dadosDetectados,
            tipoOrcamento,
            parcelamento,
            requestId
        });
        
        console.log(`✅ [${requestId}] Correções aplicadas com sucesso`);
        
        // 6. RESPOSTA FINAL
        const tempoTotal = Date.now() - startTime;
        
        return safeJSONResponse(res, true, resultadoFinal, null, {
            requestId,
            version: SYSTEM_CONFIG.VERSION,
            tipo: tipoOrcamento,
            ia_usada: iaUsada,
            ia_status: getIAStatus(iaUsada),
            tempo: `${tempoTotal}ms`,
            correcoes_aplicadas: true,
            processamento: {
                entrada_chars: conteudoPrincipal.length,
                saida_chars: resultadoFinal.length,
                correcoes: [
                    'datas_corrigidas',
                    'aeroportos_convertidos', 
                    'passageiros_formatados',
                    'bagagem_internacional',
                    'tipos_voo_padronizados',
                    'reembolso_formatado',
                    'versao_atualizada'
                ]
            }
        });
        
    } catch (error) {
        console.error(`💥 [${requestId}] Erro crítico:`, error);
        
        return safeJSONResponse(res, false, 'Erro interno', 
            'Erro no processamento. Tente novamente.', { 
                requestId, 
                error: error.message 
            });
    }
}

// ================================================================================
// 🔧 APLICAÇÃO FORÇADA DE CORREÇÕES
// ================================================================================

function aplicarCorrecoesForcadas(texto, conteudoOriginal, contexto) {
    const { dadosDetectados, tipoOrcamento, parcelamento, requestId } = contexto;
    
    let resultado = texto;
    
    console.log(`🔧 [${requestId}] Iniciando correções forçadas...`);
    
    // 1. CORRIGIR DATAS (forçar remoção de dias da semana)
    console.log(`📅 [${requestId}] Corrigindo datas...`);
    resultado = corrigirDatasForçado(resultado);
    
    // 2. CORRIGIR AEROPORTOS (forçar conversão)
    console.log(`✈️ [${requestId}] Corrigindo aeroportos...`);
    resultado = corrigirAeroportosForçado(resultado);
    
    // 3. CORRIGIR PASSAGEIROS (forçar formato CVC)
    console.log(`👥 [${requestId}] Corrigindo passageiros...`);
    resultado = corrigirPassageirosForçado(resultado, dadosDetectados);
    
    // 4. CORRIGIR BAGAGEM (forçar detecção internacional)
    console.log(`🎒 [${requestId}] Corrigindo bagagem...`);
    resultado = corrigirBagagemForçado(resultado, conteudoOriginal);
    
    // 5. CORRIGIR TIPOS DE VOO (forçar padronização)
    console.log(`🛫 [${requestId}] Corrigindo tipos de voo...`);
    resultado = corrigirTiposVooForçado(resultado);
    
    // 6. CORRIGIR REEMBOLSO (forçar formato padrão)
    console.log(`🏷️ [${requestId}] Corrigindo reembolso...`);
    resultado = corrigirReembolsoForçado(resultado);
    
    // 7. CORRIGIR PARCELAMENTO (se fornecido)
    if (parcelamento) {
        console.log(`💳 [${requestId}] Aplicando parcelamento...`);
        resultado = aplicarParcelamentoForçado(resultado, parcelamento);
    }
    
    // 8. GARANTIR VERSÃO CORRETA
    console.log(`📌 [${requestId}] Aplicando versão...`);
    resultado = garantirVersaoCorreta(resultado);
    
    // 9. LIMPEZA FINAL
    resultado = limpezaFinal(resultado);
    
    console.log(`✅ [${requestId}] Todas as correções aplicadas!`);
    
    return resultado;
}

// ================================================================================
// 🔧 CORREÇÕES INDIVIDUAIS FORÇADAS
// ================================================================================

function corrigirDatasForçado(texto) {
    let resultado = texto;
    
    // Remover dias da semana agressivamente
    const diasSemana = ['sáb', 'sab', 'seg', 'ter', 'qua', 'qui', 'sex', 'dom', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
    
    for (const dia of diasSemana) {
        // Padrões variados
        resultado = resultado.replace(new RegExp(`${dia},?\\s*(\\d{1,2}\\/\\d{2})`, 'gi'), '$1');
        resultado = resultado.replace(new RegExp(`${dia}\\s+de\\s+\\w+`, 'gi'), '');
    }
    
    // Converter datas extensas para DD/MM
    const meses = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };
    
    for (const [nome, num] of Object.entries(meses)) {
        resultado = resultado.replace(new RegExp(`(\\d{1,2})\\s+de\\s+${nome}`, 'gi'), (match, dia) => {
            return `${dia.padStart(2, '0')}/${num}`;
        });
    }
    
    return resultado;
}

function corrigirAeroportosForçado(texto) {
    let resultado = texto;
    
    // Tabela de conversão completa
    const aeroportos = {
        'GRU': 'Guarulhos',
        'CGH': 'Congonhas', 
        'VCP': 'Viracopos',
        'GIG': 'Galeão',
        'SDU': 'Santos Dumont',
        'BSB': 'Brasília',
        'CNF': 'Confins',
        'POA': 'Porto Alegre',
        'SSA': 'Salvador',
        'REC': 'Recife',
        'FOR': 'Fortaleza',
        'MCO': 'Orlando',
        'LIS': 'Lisboa',
        'OPO': 'Porto',
        'MAD': 'Madrid',
        'BCN': 'Barcelona',
        'CDG': 'Paris',
        'FCO': 'Roma',
        'LHR': 'Londres',
        'MIA': 'Miami'
    };
    
    // Aplicar conversões FORÇADAMENTE
    for (const [codigo, nome] of Object.entries(aeroportos)) {
        resultado = resultado.replace(new RegExp(`\\b${codigo}\\b`, 'g'), nome);
    }
    
    return resultado;
}

function corrigirPassageirosForçado(texto, dadosDetectados) {
    let resultado = texto;
    
    // Detectar passageiros no texto original
    const matchPassageiros = texto.match(/(\d+)\s*adultos?\s*(?:e\s*(\d+)\s*crianças?)?/i);
    
    if (matchPassageiros) {
        const adultos = parseInt(matchPassageiros[1]) || 1;
        const criancas = parseInt(matchPassageiros[2]) || 0;
        
        let novoFormato = `${adultos.toString().padStart(2, '0')} adulto${adultos > 1 ? 's' : ''}`;
        if (criancas > 0) {
            novoFormato += ` + ${criancas.toString().padStart(2, '0')} criança${criancas > 1 ? 's' : ''}`;
        }
        
        // Substituir TODAS as variações
        resultado = resultado.replace(/\d+\s*adultos?\s*(?:e\s*\d+\s*crianças?)?/gi, novoFormato);
        resultado = resultado.replace(/Total\s*\([^)]+\)/gi, novoFormato);
    }
    
    return resultado;
}

function corrigirBagagemForçado(texto, conteudoOriginal) {
    let resultado = texto;
    
    // Detectar se é internacional
    const ehInternacional = /iberia|tap|lufthansa|air france|klm|classe econômica|lisboa|orlando|madrid|paris|roma/i.test(conteudoOriginal);
    
    // Detectar se tem bagagem
    const temBagagem = /com bagagem|bagagem despachada|classe econômica/i.test(conteudoOriginal);
    
    // Definir bagagem correta
    let bagagemCorreta;
    if (ehInternacional || temBagagem) {
        bagagemCorreta = 'Inclui 1 item pessoal + 1 mala de mão de 10kg + 1 bagagem despachada de 23kg';
    } else {
        bagagemCorreta = 'Inclui 1 item pessoal + 1 mala de mão de 10kg';
    }
    
    // FORÇAR substituição de QUALQUER linha de bagagem
    const padroesBagagem = [
        /✅[^\n]*bagagem[^\n]*/gi,
        /✅[^\n]*classe[^\n]*/gi,
        /✅[^\n]*econômica[^\n]*/gi,
        /✅[^\n]*mala[^\n]*/gi,
        /✅[^\n]*item[^\n]*/gi,
        /✅[^\n]*só[^\n]*/gi,
        /✅[^\n]*inclui[^\n]*/gi
    ];
    
    let substitucaoFeita = false;
    for (const padrao of padroesBagagem) {
        if (padrao.test(resultado)) {
            resultado = resultado.replace(padrao, `✅ ${bagagemCorreta}`);
            substitucaoFeita = true;
            break;
        }
    }
    
    // Se não encontrou, adicionar após valor
    if (!substitucaoFeita) {
        resultado = resultado.replace(/(💰[^\n]+)/, `$1\n✅ ${bagagemCorreta}`);
    }
    
    return resultado;
}

function corrigirTiposVooForçado(texto) {
    let resultado = texto;
    
    // Correções de tipos de voo - FORÇADAS
    const correcoes = [
        { pattern: /\(?Uma escala\)?/gi, replacement: '(com conexão)' },
        { pattern: /\(?Duas escalas\)?/gi, replacement: '(com múltiplas conexões)' },
        { pattern: /\(?Direto\)?/gi, replacement: '(voo direto)' },
        { pattern: /\(?Voo direto\)?/gi, replacement: '(voo direto)' },
        { pattern: /\(voo\s+voo direto\)/gi, replacement: '(voo direto)' }
    ];
    
    for (const { pattern, replacement } of correcoes) {
        resultado = resultado.replace(pattern, replacement);
    }
    
    return resultado;
}

function corrigirReembolsoForçado(texto) {
    let resultado = texto;
    
    // Padrões de reembolso para corrigir
    const padroes = [
        /🏷️\s*Tarifa\s+não\s+reembolsável/gi,
        /🏷️\s*Tarifa\s+reembolsável/gi,
        /🏷️\s*Não\s+reembolsável/gi,
        /🏷️\s*Reembolsável/gi
    ];
    
    // Detectar se é reembolsável no texto original
    const ehReembolsavel = /reembolsável(?!\s*não)/i.test(texto) && !/não\s+reembolsável/i.test(texto);
    
    const reembolsoCorreto = ehReembolsavel 
        ? '🏷️ Reembolsável conforme regras do bilhete'
        : '🏷️ Não reembolsável';
    
    // Aplicar correção
    for (const padrao of padroes) {
        resultado = resultado.replace(padrao, reembolsoCorreto);
    }
    
    return resultado;
}

function aplicarParcelamentoForçado(texto, parcelamento) {
    const numParcelas = parseInt(parcelamento);
    if (!numParcelas) return texto;
    
    // Encontrar valor para calcular parcelas
    const matchValor = texto.match(/R\$\s*([\d.,]+)/);
    if (matchValor) {
        const valor = matchValor[1];
        const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
        const valorParcela = (valorNum / numParcelas).toFixed(2).replace('.', ',');
        
        const linhaParcelamento = `💳 ${numParcelas}x de R$ ${valorParcela} s/ juros no cartão`;
        
        // Adicionar após valor
        return texto.replace(/(💰[^\n]+)/, `$1\n${linhaParcelamento}`);
    }
    
    return texto;
}

function garantirVersaoCorreta(texto) {
    // Remover versões antigas
    let resultado = texto.replace(/\(v[\d.]+\)/g, '');
    resultado = resultado.replace(/Valores sujeitos a confirmação e disponibilidade.*$/m, '');
    
    // Adicionar versão correta
    const versaoCorreta = `Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`;
    
    if (!resultado.includes(versaoCorreta)) {
        resultado = resultado.trim() + '\n\n' + versaoCorreta;
    }
    
    return resultado;
}

function limpezaFinal(texto) {
    let resultado = texto;
    
    // Remover linhas vazias extras
    resultado = resultado.replace(/\n{3,}/g, '\n\n');
    
    // Remover espaços no final das linhas
    resultado = resultado.split('\n').map(linha => linha.trimEnd()).join('\n');
    
    // Garantir separador correto
    resultado = resultado.replace(/\n--\n/g, '\n--\n');
    
    return resultado.trim();
}

// ================================================================================
// 🔍 DETECÇÃO BÁSICA
// ================================================================================

function detectarDadosBasicos(conteudo) {
    const dados = {
        passageiros: null,
        valor: null,
        destino: null,
        ehInternacional: false,
        temBagagem: false
    };
    
    // Detectar passageiros
    const matchPassageiros = conteudo.match(/(\d+)\s*adultos?\s*(?:e\s*(\d+)\s*crianças?)?/i);
    if (matchPassageiros) {
        dados.passageiros = {
            adultos: parseInt(matchPassageiros[1]),
            criancas: parseInt(matchPassageiros[2]) || 0
        };
    }
    
    // Detectar valor
    const matchValor = conteudo.match(/R\$\s*([\d.,]+)/);
    if (matchValor) {
        dados.valor = matchValor[1];
    }
    
    // Detectar internacional
    dados.ehInternacional = /iberia|tap|lufthansa|classe econômica|lisboa|orlando|madrid/i.test(conteudo);
    
    // Detectar bagagem
    dados.temBagagem = /com bagagem|bagagem despachada|classe econômica/i.test(conteudo);
    
    return dados;
}

function detectarTipo(conteudo, tipos) {
    // Lógica simples de detecção
    if (tipos.includes('Hotel')) return 'HOTEIS_MULTIPLAS';
    if (tipos.includes('Cruzeiro')) return 'CRUZEIRO';
    if (tipos.includes('Multitrecho')) return 'MULTITRECHO';
    
    // Detectar por conteúdo
    if (/hotel|pousada|resort/i.test(conteudo) && !/aeroporto|voo/i.test(conteudo)) {
        return 'HOTEIS_MULTIPLAS';
    }
    
    return 'AEREO_SIMPLES'; // Default
}

// ================================================================================
// 🧠 PROCESSAMENTO COM IA
// ================================================================================

async function processarComIA(conteudo, tipo) {
    const prompt = `Formate este orçamento de viagem para WhatsApp seguindo o padrão CVC.

TEXTO:
${conteudo}

REGRAS:
1. Título: *Companhia - Origem ✈ Destino*
2. Formato de data: DD/MM
3. Separador ida/volta: --
4. Valor: 💰 R$ XXX para XXX
5. Bagagem: ✅ (descrição)
6. Reembolso: 🏷️ (condição)
7. Final: Valores sujeitos a confirmação e disponibilidade (v4.01)

Use APENAS informações do texto fornecido.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 1500
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI erro ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// ================================================================================
// 📋 TEMPLATE BÁSICO DE FALLBACK
// ================================================================================

function gerarTemplateBasico(conteudo, dados, tipo) {
    // Template básico quando IA não está disponível
    return `*Companhia - Origem ✈ Destino*
Data - Aeroporto Hora / Aeroporto Hora (tipo voo)
--
Data - Aeroporto Hora / Aeroporto Hora (tipo voo)

💰 R$ ${dados.valor || '0,00'} para passageiros
✅ Informações de bagagem
🏷️ Condições de reembolso

Valores sujeitos a confirmação e disponibilidade (v${SYSTEM_CONFIG.VERSION})`;
}

// ================================================================================
// 🔧 UTILITÁRIOS
// ================================================================================

function getIAStatus(iaUsada) {
    const status = {
        'gpt': '✅ OpenAI GPT-4o-mini usado com sucesso',
        'claude': '✅ Anthropic Claude usado com sucesso', 
        'fallback': '⚠️ IA falhou, template básico aplicado',
        'none': '⚠️ IA não configurada, template básico usado'
    };
    
    return status[iaUsada] || '❓ Status desconhecido';
}

function generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
}

function setupSecurityHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
}

function getSystemStatus() {
    return {
        status: 'operational',
        version: SYSTEM_CONFIG.VERSION,
        sistema: SYSTEM_CONFIG.SISTEMA,
        correcoes_forcadas: [
            'datas (remoção dias da semana)',
            'aeroportos (GRU → Guarulhos)',
            'passageiros (formato CVC)',
            'bagagem (detecção internacional)',
            'tipos de voo (padronização)',
            'reembolso (formato padrão)',
            'versão (v4.01)'
        ]
    };
}

// ================================================================================
// 📋 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║            CVC ITAQUA v4.01 - SISTEMA HÍBRIDO                 ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log('║ 🎯 IA gera estrutura + Processadores corrigem TUDO            ║');
console.log('║ 🔧 Correções FORÇADAS sempre aplicadas                        ║');
console.log('║ 📅 Datas: remove dias da semana                               ║');
console.log('║ ✈️ Aeroportos: GRU → Guarulhos                                ║');
console.log('║ 👥 Passageiros: formato CVC (04 adultos)                      ║');
console.log('║ 🎒 Bagagem: detecta internacional                             ║');
console.log('║ 🛫 Tipos: Uma escala → (com conexão)                          ║');
console.log('║ 🏷️ Reembolso: formato padronizado                             ║');
console.log('║ 📌 Versão: sempre v4.01                                       ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log(`🚀 Sistema Híbrido v${SYSTEM_CONFIG.VERSION} - CORREÇÕES GARANTIDAS!`);
