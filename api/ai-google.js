// 🚀 CVC ITAQUA v1.2 - CORREÇÃO DE EXTRAÇÃO DE DESTINOS
// ================================================================================
// 📑 CORREÇÃO ESPECÍFICA: Função extrairDestinoDoConteudo()
// ================================================================================
// PROBLEMA IDENTIFICADO:
// - Input: "Guarulhos - Lisboa" 
// - Output esperado: "Lisboa"
// - Output atual: "Paris" (ERRO!)
// 
// SOLUÇÃO: Melhorar regex e priorizar destinos explícitos no conteúdo
// ================================================================================

// ================================================================================
// 🧠 FUNÇÃO DE EXTRAÇÃO DE DESTINO CORRIGIDA v1.2
// ================================================================================
function extrairDestinoDoConteudo(conteudo) {
    const texto = conteudo.toLowerCase();
    console.log('🔍 v1.2: Extraindo destino de:', conteudo.substring(0, 100) + '...');
    
    // PADRÃO 1: CÓDIGOS DE AEROPORTO PRIMEIRO (mais preciso)
    const padraoAeroportoDestino = conteudo.match(/(?:para|destino|→|✈|chegada)\s*:?\s*([A-Z]{3})/i);
    if (padraoAeroportoDestino && AEROPORTOS[padraoAeroportoDestino[1]]) {
        const nomeAeroporto = AEROPORTOS[padraoAeroportoDestino[1]];
        const cidade = nomeAeroporto.split(' - ')[0].split(' (')[0]; // Remove detalhes extras
        console.log('✅ v1.2: Destino extraído por código:', cidade);
        return cidade;
    }
    
    // PADRÃO 2: "Cidade1 - Cidade2" ou "Cidade1 ✈ Cidade2" (PRIORIDADE ALTA)
    const padraoSetas = conteudo.match(/([a-záàâãéêíóôõúç\s\(\)]+)\s*[-→✈]+\s*([a-záàâãéêíóôõúç\s\(\)]+)/i);
    if (padraoSetas) {
        const origem = padraoSetas[1].trim();
        const destino = padraoSetas[2].trim();
        
        // Validar que é realmente uma rota válida
        const destinosEuropeus = ['lisboa', 'madrid', 'paris', 'londres', 'roma', 'barcelona', 'amsterdam', 'berlin', 'zurich'];
        const destinosAmericanos = ['miami', 'orlando', 'nova york', 'los angeles', 'buenos aires', 'santiago'];
        const todosDestinos = [...destinosEuropeus, ...destinosAmericanos];
        
        if (todosDestinos.some(d => destino.toLowerCase().includes(d))) {
            console.log('✅ v1.2: Destino extraído por padrão de rota:', destino);
            return destino;
        }
    }
    
    // PADRÃO 3: "GRU-LIS" ou "GRU → LIS" (códigos de aeroporto)
    const padraoCodigosRota = conteudo.match(/([A-Z]{3})\s*[-→✈]+\s*([A-Z]{3})/);
    if (padraoCodigosRota) {
        const codigoDestino = padraoCodigosRota[2];
        if (AEROPORTOS[codigoDestino]) {
            const cidade = AEROPORTOS[codigoDestino].split(' - ')[0].split(' (')[0];
            console.log('✅ v1.2: Destino extraído por códigos de rota:', cidade);
            return cidade;
        }
    }
    
    // PADRÃO 4: "Pacote Orlando", "Hotéis em Lisboa", "Viagem para Paris"
    const padraoExplicito = conteudo.match(/(?:pacote|hotéis?\s+em|viagem\s+para|destino\s*:?\s*)([a-záàâãéêíóôõúç\s]+)/i);
    if (padraoExplicito) {
        const destino = padraoExplicito[1].trim();
        console.log('✅ v1.2: Destino extraído por padrão explícito:', destino);
        return destino;
    }
    
    // PADRÃO 5: Destinos conhecidos no texto (ÚLTIMO RECURSO)
    const destinosConhecidos = {
        // Destinos Europeus
        'lisboa': 'Lisboa',
        'madrid': 'Madrid', 
        'paris': 'Paris',
        'londres': 'Londres',
        'roma': 'Roma',
        'barcelona': 'Barcelona',
        'amsterdam': 'Amsterdam',
        'berlin': 'Berlin',
        'zurich': 'Zurich',
        'frankfurt': 'Frankfurt',
        'munique': 'Munique',
        'milao': 'Milão',
        'veneza': 'Veneza',
        'florenca': 'Florença',
        
        // Destinos Americanos
        'orlando': 'Orlando',
        'miami': 'Miami',
        'nova york': 'Nova York',
        'los angeles': 'Los Angeles',
        'san francisco': 'São Francisco',
        'las vegas': 'Las Vegas',
        'chicago': 'Chicago',
        'boston': 'Boston',
        'washington': 'Washington',
        
        // América Latina
        'buenos aires': 'Buenos Aires',
        'santiago': 'Santiago',
        'lima': 'Lima',
        'bogota': 'Bogotá',
        'montevideu': 'Montevidéu',
        'caracas': 'Caracas',
        'quito': 'Quito',
        'la paz': 'La Paz',
        
        // Outros
        'toquio': 'Tóquio',
        'dubai': 'Dubai',
        'istambul': 'Istambul',
        'moscou': 'Moscou'
    };
    
    for (const [chave, nome] of Object.entries(destinosConhecidos)) {
        if (texto.includes(chave)) {
            console.log('✅ v1.2: Destino extraído por palavra-chave:', nome);
            return nome;
        }
    }
    
    console.log('⚠️ v1.2: Nenhum destino identificado no conteúdo');
    return null;
}

// ================================================================================
// 🧪 FUNÇÃO DE TESTE DA EXTRAÇÃO v1.2
// ================================================================================
function testarExtracaoDestino() {
    console.log('🧪 v1.2: Testando extração de destinos...');
    
    const casos = [
        'Guarulhos - Lisboa',
        'São Paulo ✈ Madrid', 
        'GRU → LIS',
        'Pacote Orlando 2025',
        'Hotéis em Paris',
        'Viagem para Buenos Aires',
        'Voo direto para Miami',
        'Cruzeiro saindo de Barcelona',
        'Conexão em Amsterdam'
    ];
    
    casos.forEach((caso, i) => {
        const resultado = extrairDestinoDoConteudo(caso);
        console.log(`${i+1}. "${caso}" → "${resultado}"`);
    });
}

// ================================================================================
// 📝 FUNÇÃO DE GERAÇÃO DE PROMPTS ATUALIZADA v1.2
// ================================================================================
function generatePrompt(tipoOrcamento, conteudoPrincipal, destino, parcelamento) {
    // Extrair destino automaticamente se não fornecido ou para tipos específicos
    let destinoFinal = destino;
    
    if (!destinoFinal || destinoFinal === 'EXTRAIR DO CONTEÚDO' || 
        tipoOrcamento === 'dicas_completas' || tipoOrcamento === 'ranking') {
        
        const destinoExtraido = extrairDestinoDoConteudo(conteudoPrincipal);
        if (destinoExtraido) {
            destinoFinal = destinoExtraido;
            console.log('✅ v1.2: Destino extraído automaticamente:', destinoFinal);
        } else {
            destinoFinal = destino || 'Destino não identificado';
            console.log('⚠️ v1.2: Usando destino padrão:', destinoFinal);
        }
    }
    
    let infoParcelamento = parcelamento ? 
        `INCLUIR PARCELAMENTO: ${parcelamento}x sem juros no cartão` : 
        'EXTRAIR PARCELAMENTO DO TEXTO (entrada + parcelas ou parcelamento selecionado)';

    const regrasGerais = `**REGRAS CRÍTICAS DE FORMATAÇÃO v1.2:**
- **Título**: Use CIDADES no título: *Latam - São Paulo ✈ Lisboa* (GRU = São Paulo, CGH = São Paulo, SDU = Rio de Janeiro)
- **NUNCA use códigos de aeroporto no título** (não "Guarulhos ✈ Lisboa")
- **Datas e Horários**: DD/MM (03/01) e HH:MM (17:40)
- **Valores**: R$ 1.234,56 (espaço após R$, vírgula para centavos)
- **Passageiros**: zero à esquerda (01, 02, 03 adultos)
- **Parcelamento**: ${infoParcelamento}
- **Bagagem**: Seja ESPECÍFICO - inclua TUDO mencionado:
  * "item pessoal" → incluir
  * "mala de mão" → incluir
  * "bagagem despachada" → incluir
  * "pré-reserva de assento" → incluir
- **Links**: Incluir URLs que apareçam no texto (limpar texto extra)
- **Aeroportos**: Converter códigos para nomes nos horários
- **Reembolso**: "Não reembolsável" OU "Reembolsável conforme regras do bilhete"
- **Finalização**: "Valores sujeitos a confirmação e disponibilidade (v1.2)"`;

    const tabelaAeroportos = `**TABELA DE AEROPORTOS v1.2:**\n${JSON.stringify(AEROPORTOS)}`;

    switch (tipoOrcamento) {
        case 'dicas_completas':
            return `Crie dicas de viagem específicas e úteis para ${destinoFinal}, usando o template fornecido. 

**INSTRUÇÕES ESPECÍFICAS:**
1. Use informações REAIS e ÚTEIS sobre ${destinoFinal}
2. Mencione restaurantes, atrações e experiências específicos da cidade
3. Adapte as dicas ao destino correto: ${destinoFinal}
4. Não use informações genéricas de outros destinos

**TEMPLATE:**
${TEMPLATES.dicas_completas}`;

        case 'ranking':
            return `Crie um ranking de hotéis específico para ${destinoFinal}. 

**INSTRUÇÕES ESPECÍFICAS:**
1. Use hotéis REAIS de ${destinoFinal}
2. Inclua notas realistas das plataformas (Google /5, Booking /10, TripAdvisor /5)
3. Mencione localizações específicas de ${destinoFinal}
4. Use reviews autênticos que fazem sentido para ${destinoFinal}

**TEMPLATE:**
${TEMPLATES.ranking}`;

        default:
            return `Converta os dados brutos em um orçamento formatado para WhatsApp.

**DADOS BRUTOS:**
${conteudoPrincipal}

**DESTINO IDENTIFICADO:** ${destinoFinal}

**TEMPLATE:**
${TEMPLATES[tipoOrcamento] || TEMPLATES.aereo_simples}

${regrasGerais}
${tabelaAeroportos}`;
    }
}

// ================================================================================
// 🔍 FUNÇÃO DE DETECÇÃO DE TIPO ATUALIZADA v1.2
// ================================================================================
function detectOrcamentoType(conteudoPrincipal, tipos) {
    const conteudoLower = conteudoPrincipal.toLowerCase();
    
    console.log('🔍 v1.2: Detectando tipo de orçamento...');
    console.log('📋 Tipos solicitados:', tipos);
    
    // Detecção baseada nos tipos solicitados (PRIORIDADE 1)
    if (tipos.includes('Dicas')) {
        console.log('✅ v1.2: Tipo detectado por solicitação: dicas_completas');
        return 'dicas_completas';
    }
    if (tipos.includes('Ranking') || conteudoLower.includes('ranking')) {
        console.log('✅ v1.2: Tipo detectado por solicitação: ranking');
        return 'ranking';
    }
    
    // Detecção baseada no conteúdo (PRIORIDADE 2)
    if (conteudoLower.includes('cruzeiro') || conteudoLower.includes('navio')) {
        console.log('✅ v1.2: Tipo detectado por conteúdo: cruzeiro');
        return 'cruzeiro';
    }
    
    if (conteudoLower.includes('multitrecho') || (conteudoLower.match(/trecho \d/gi) || []).length > 1) {
        console.log('✅ v1.2: Tipo detectado por conteúdo: multitrecho');
        return 'multitrecho';
    }
    
    // Múltiplas opções (PRIORIDADE 3)
    const opcoesMarcadas = (conteudoPrincipal.match(/OPÇÃO \d/gi) || []).length;
    const planosDetectados = (conteudoPrincipal.match(/Plano \d/gi) || []).length;
    const totaisDetectados = (conteudoPrincipal.match(/Total \(/gi) || []).length;
    
    if (opcoesMarcadas === 2 || planosDetectados === 2) {
        console.log('✅ v1.2: Tipo detectado por opções: multiplas_opcoes_2_planos');
        return 'multiplas_opcoes_2_planos';
    }
    if (opcoesMarcadas >= 3 || planosDetectados >= 3) {
        console.log('✅ v1.2: Tipo detectado por opções: multiplas_opcoes_3_planos');
        return 'multiplas_opcoes_3_planos';
    }
    if (totaisDetectados > 1 || opcoesMarcadas >= 2) {
        console.log('✅ v1.2: Tipo detectado por múltiplas companhias: multiplas_companhias');
        return 'multiplas_companhias';
    }
    
    // Tipos específicos por categoria (PRIORIDADE 4)
    if (tipos.includes('Hotel') && tipos.includes('Aéreo')) {
        console.log('✅ v1.2: Tipo detectado por categoria: pacote_completo');
        return 'pacote_completo';
    }
    if (tipos.includes('Hotel') && !tipos.includes('Aéreo')) {
        console.log('✅ v1.2: Tipo detectado por categoria: hoteis_multiplas_opcoes');
        return 'hoteis_multiplas_opcoes';
    }
    
    // Detecção por palavras-chave específicas (PRIORIDADE 5)
    if (conteudoLower.includes('roteiro') && conteudoLower.includes('hotel')) {
        console.log('✅ v1.2: Tipo detectado por palavra-chave: roteiro_hoteis');
        return 'roteiro_hoteis';
    }
    if (conteudoLower.includes('conexão em') && conteudoLower.includes('espera')) {
        console.log('✅ v1.2: Tipo detectado por palavra-chave: aereo_conexao_detalhada');
        return 'aereo_conexao_detalhada';
    }
    if (conteudoLower.includes('somente ida') || conteudoLower.includes('one way')) {
        console.log('✅ v1.2: Tipo detectado por palavra-chave: aereo_somente_ida');
        return 'aereo_somente_ida';
    }
    
    // Padrão (PRIORIDADE 6)
    console.log('⚠️ v1.2: Usando tipo padrão: aereo_simples');
    return 'aereo_simples';
}

console.log('✅ CVC Itaqua v1.2 - Correção de extração de destinos aplicada!');
console.log('🔧 Melhorias:');
console.log('  - Regex aprimorada para detecção de rotas');
console.log('  - Priorização de códigos de aeroporto');
console.log('  - Mapeamento de destinos europeus expandido');
console.log('  - Sistema de logs para debug');
console.log('  - Validação de destinos conhecidos');

// Para testar a correção:
// testarExtracaoDestino();
