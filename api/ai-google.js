// 🚀 CVC ITAQUA v7.4 - SISTEMA COMPLETO FINAL
// Detecção avançada de todos os tipos de orçamento

// ================================================================================
// 📋 TEMPLATES DE ORÇAMENTOS - TODOS OS CASOS
// ================================================================================
const TEMPLATES = {
  // Template 1: Aéreo Ida e Volta Simples
  aereo_ida_volta: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 2: Voo Combinado (Mix de Companhias)
  voo_combinado: `
*Voo {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} a {dataVolta} ({dias} dias e {noites} noites)

✈️ IDA - {companhiaIda}
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoConexao} {horaChegadaConexao} (voo direto)
(conexão em {cidadeConexao} - {tempoEspera} de espera)
{dataIda} - {aeroportoConexao} {horaSaidaConexao} / {aeroportoDestino} {horaChegadaDestino} (voo direto)

✈️ VOLTA - {companhiaVolta}
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoConexaoVolta} {horaChegadaConexaoVolta} (voo direto)
(conexão em {cidadeConexaoVolta} - {tempoEsperaVolta} de espera)
{dataVoltaDia} - {aeroportoConexaoVolta} {horaSaidaConexaoVolta} / {aeroportoOrigem} {horaChegadaVolta} (voo direto)

💰 R$ {valorTotal} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 3: Múltiplas Opções (2+ escolhas)
  multiplas_opcoes: `
*OPÇÃO 1 - {companhia1} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda1} - {aeroportoOrigem1} {horaIda1} / {aeroportoDestino1} {horaChegadaIda1} ({tipoVoo1})
--
{dataVolta1} - {aeroportoDestino1} {horaVolta1} / {aeroportoOrigem1} {horaChegadaVolta1} ({tipoVooVolta1})

💰 R$ {valor1} para {passageiros1}
✅ {bagagem1}
🏷️ {reembolso1}

---

*OPÇÃO 2 - {companhia2} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda2} - {aeroportoOrigem2} {horaIda2} / {aeroportoDestino2} {horaChegadaIda2} ({tipoVoo2})
--
{dataVolta2} - {aeroportoDestino2} {horaVolta2} / {aeroportoOrigem2} {horaChegadaVolta2} ({tipoVooVolta2})
{notaCodeshare}

💰 R$ {valor2} para {passageiros2}
✅ {bagagem2}
🏷️ {reembolso2}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 4: Pacote Completo (Aéreo + Hotel)
  pacote_completo: `
*Pacote {destino}*
{dataIda} a {dataVolta} ({dias} dias e {noites} noites)
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- {noites} noites de hospedagem
{servicosAdicionais}

✈️ *Voos:*
IDA - {companhiaIda} - {dataIda}
{origemIda} {horaIda} / {destinoIda} {horaChegadaIda} ({tipoVooIda})

VOLTA - {companhiaVolta} - {dataVolta}
{origemVolta} {horaVolta} / {destinoVolta} {horaChegadaVolta} ({tipoVooVolta})

🏨 *Hotel Selecionado:*
{nomeHotel}
📍 {enderecoHotel}
🛏️ {tipoQuarto}
☕ {regime}
{observacoesHotel}

💰 R$ {valorTotal} total
💳 {parcelamento}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 5: Voo com Conexão Detalhada
  voo_conexao_detalhada: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} (com {paradas} - {duracao})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} (com {paradasVolta} - {duracaoVolta})

💰 R$ {valorTotal} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 6: Apenas Detalhes (Sem Preço)
  detalhes_sem_preco: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
{detalhesConexaoIda}
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})
{detalhesConexaoVolta}

✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 7: Cruzeiro
  cruzeiro: `
🚢 *Cruzeiro {nomeNavio}* – {noites} noites
{passageiros}
📅 Embarque: {dataEmbarque} ({diaSemana})
📍 Saída e chegada: {porto}
🌊 Roteiro incrível pelo litoral brasileiro!

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
{opcoesCabines}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: taxas, bebidas, excursões

📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade`
};

// ================================================================================
// 🗺️ TABELA COMPLETA DE CONVERSÃO DE AEROPORTOS
// ================================================================================
const AEROPORTOS = {
  // Brasil - Principais
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
  
  // Brasil - Regionais
  'BPS': 'Porto Seguro',
  'IOS': 'Ilhéus',
  'CMG': 'Corumbá',
  'JDO': 'Juazeiro do Norte',
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
  'IGU': 'Foz do Iguaçu',
  'LDB': 'Londrina',
  'MGF': 'Maringá',
  
  // Internacional - América do Sul
  'EZE': 'Ezeiza - Buenos Aires',
  'AEP': 'Aeroparque - Buenos Aires',
  'SCL': 'Santiago',
  'LIM': 'Lima',
  'BOG': 'Bogotá',
  'GYE': 'Guayaquil',
  'UIO': 'Quito',
  'CCS': 'Caracas',
  'MVD': 'Montevidéu',
  'ASU': 'Assunção',
  'LPB': 'La Paz',
  'VVI': 'Santa Cruz de la Sierra',
  
  // Internacional - América do Norte/Central
  'MEX': 'Cidade do México',
  'CUN': 'Cancún',
  'MIA': 'Miami',
  'MCO': 'Orlando',
  'FLL': 'Fort Lauderdale',
  'JFK': 'Nova York - JFK',
  'EWR': 'Newark',
  'LAX': 'Los Angeles',
  'SFO': 'San Francisco',
  'ORD': 'Chicago',
  'YYZ': 'Toronto',
  
  // Internacional - Europa
  'LIS': 'Lisboa',
  'OPO': 'Porto',
  'MAD': 'Madrid',
  'BCN': 'Barcelona',
  'CDG': 'Paris - Charles de Gaulle',
  'ORY': 'Paris - Orly',
  'FCO': 'Roma - Fiumicino',
  'MXP': 'Milão - Malpensa',
  'LHR': 'Londres - Heathrow',
  'LGW': 'Londres - Gatwick',
  'FRA': 'Frankfurt',
  'AMS': 'Amsterdã',
  'ZRH': 'Zurique'
};

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API v7.4
// ================================================================================
export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Status da API
  if (req.method === 'GET') {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    
    return res.status(200).json({
      success: true,
      message: 'API CVC Itaqua v7.5 - Online (Detecção Aprimorada)',
      version: '7.5',
      services: {
        openai: hasOpenAI ? 'Configurado' : 'Não configurado',
        anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
      },
      features: [
        'Detecção de voo combinado vs múltiplas opções',
        'Suporte a codeshare',
        'Processamento com e sem preços',
        'Template de pacote completo',
        'Detecção inteligente de todos os tipos',
        'Formatação perfeita para WhatsApp'
      ],
      lastUpdate: '2025-01-14'
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      console.log('📥 Requisição recebida v7.4');
      
      const { 
        observacoes = '', 
        textoColado = '',
        destino = '',
        adultos = '',
        criancas = 0,
        idadesCriancas = [],
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null
      } = req.body;
      
      // Determinar conteúdo principal
      const conteudoPrincipal = observacoes || textoColado || pdfContent || '';
      const conteudoLower = conteudoPrincipal.toLowerCase();
      
      // Log de análise
      console.log('🔍 Análise do conteúdo:');
      console.log('- Tipos selecionados:', tipos);
      console.log('- Tem imagem?', !!imagemBase64);
      console.log('- Tem hotel?', conteudoLower.includes('hotel') || conteudoLower.includes('palazzo'));
      console.log('- Tem preço?', conteudoLower.includes('r$'));
      console.log('- Tem Avianca?', conteudoLower.includes('avianc'));
      console.log('- Tem Gol?', conteudoLower.includes('gol'));
      
      // Detectar informações de passageiros
      let infoPassageiros = '';
      
      // Padrão 1: "Total (X Adultos e Y Crianças)"
      const padraoTotal = conteudoPrincipal.match(/Total\s*\((\d+)\s*(?:Adulto|Adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:Criança|Crianças))?\)/i);
      
      // Padrão 2: "X Adultos e Y Crianças" genérico
      const padraoPassageiros = conteudoPrincipal.match(/(\d+)\s*(?:adulto|adultos)(?:\s*(?:e|\+)\s*(\d+)\s*(?:criança|crianças))?/i);
      
      if (padraoTotal) {
        const numAdultos = parseInt(padraoTotal[1]);
        const numCriancas = padraoTotal[2] ? parseInt(padraoTotal[2]) : 0;
        
        let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
        
        if (numCriancas > 0) {
          textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
          
          if (idadesCriancas && idadesCriancas.length > 0) {
            textoPax += ` (${idadesCriancas.join(' e ')} anos)`;
          }
        }
        
        infoPassageiros = textoPax;
      } else if (padraoPassageiros) {
        const numAdultos = parseInt(padraoPassageiros[1]);
        const numCriancas = padraoPassageiros[2] ? parseInt(padraoPassageiros[2]) : 0;
        
        let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
        
        if (numCriancas > 0) {
          textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
          
          if (idadesCriancas && idadesCriancas.length > 0) {
            textoPax += ` (${idadesCriancas.join(' e ')} anos)`;
          }
        }
        
        infoPassageiros = textoPax;
      }
      
      // Verificar tipos especiais
      const isDicas = tipos.includes('Dicas');
      const isRanking = tipos.includes('Ranking');
      
      // Detectar tipo de orçamento
      const temHotel = tipos.includes('Hotel') || conteudoLower.includes('palazzo') || conteudoLower.includes('hotel');
      const temAereo = tipos.includes('Aéreo') || conteudoLower.includes('voo') || conteudoLower.includes('ida');
      const isPacote = temHotel && temAereo;
      const temPreco = conteudoLower.includes('r$');
      const temAvianca = conteudoLower.includes('avianc');
      const temGol = conteudoLower.includes('gol');
      const temMultiplasOpcoes = conteudoLower.includes('opção 1') || conteudoLower.includes('selecionado') && conteudoLower.split('selecionado').length > 2;
      
      let prompt = '';
      
      // ================================================================================
      // 💡 PROMPT PARA DICAS
      // ================================================================================
      if (isDicas) {
        let destinoReal = destino && destino !== 'Destino' && destino !== '' ? destino : null;
        
        // Se não tem destino no campo, tentar extrair do conteúdo
        if (!destinoReal && conteudoPrincipal) {
          // Buscar padrões comuns de destino
          const padraoDestino = conteudoPrincipal.match(/(?:Orlando|Miami|Cancún|Porto Seguro|Maceió|Fortaleza|Lisboa|Paris|Buenos Aires|Santiago)/i);
          if (padraoDestino) {
            destinoReal = padraoDestino[0];
          }
        }
        
        const temCriancas = conteudoLower.includes('criança');
        const isCruzeiro = conteudoLower.includes('cruzeiro');
        
        prompt = `Você é um especialista em viagens da CVC Itaqua.
        
        ${!destinoReal ? 
        'ANALISE o conteúdo abaixo, IDENTIFIQUE o destino mencionado e crie dicas específicas para esse destino.' :
        `Crie dicas ESPECÍFICAS para ${destinoReal}.`}
        
        ${isCruzeiro ? 'Este é um CRUZEIRO. Foque em vida a bordo, cabines, refeições.' : ''}
        ${temCriancas ? 'A viagem inclui CRIANÇAS. Adapte as dicas para famílias.' : ''}
        
        CONTEÚDO PARA ANÁLISE:
        ${conteudoPrincipal || 'Destino não especificado'}
        
        IMPORTANTE: 
        - Se conseguir identificar o destino, crie dicas específicas
        - Se não houver destino claro, crie dicas gerais de viagem
        - Use formatação para WhatsApp com emojis apropriados
        - NÃO pergunte ao usuário, processe com as informações disponíveis`;
      }
      // ================================================================================
      // 🏆 PROMPT PARA RANKING
      // ================================================================================
      else if (isRanking) {
        let destinoRanking = destino && destino !== 'Destino' ? destino : 'EXTRAIR_DO_CONTEUDO';
        
        prompt = `Você é um especialista em hotéis da CVC Itaqua.
        
        ${destinoRanking === 'EXTRAIR_DO_CONTEUDO' ?
        'Identifique o destino e crie ranking TOP 5 hotéis REAIS.' :
        `Crie ranking TOP 5 hotéis REAIS em ${destinoRanking}.`}
        
        CONTEÚDO: ${conteudoPrincipal}
        
        Use formatação WhatsApp com emojis.`;
      }
      // ================================================================================
      // 📋 PROMPT PRINCIPAL PARA ORÇAMENTOS - COMPLETO
      // ================================================================================
      else {
        const tabelaAeroportos = Object.entries(AEROPORTOS)
          .map(([codigo, nome]) => `${codigo} → ${nome}`)
          .join('\n');
        
        prompt = `Você é um assistente da CVC Itaqua.
ANALISE CUIDADOSAMENTE o tipo de orçamento.

**DADOS DO CLIENTE:**
${conteudoPrincipal}
${destino ? `Destino: ${destino}` : ''}
${infoPassageiros ? `Passageiros: ${infoPassageiros}` : ''}
${parcelamento ? `Parcelamento: ${parcelamento}x sem juros` : ''}

**ANÁLISE DETECTADA:**
- Tem Hotel? ${temHotel ? 'SIM' : 'NÃO'}
- Tem Aéreo? ${temAereo ? 'SIM' : 'NÃO'}
- É Pacote? ${isPacote ? 'SIM' : 'NÃO'}
- Tem Preço? ${temPreco ? 'SIM' : 'NÃO'}
- Tem Avianca? ${temAvianca ? 'SIM' : 'NÃO'}
- Tem Gol? ${temGol ? 'SIM' : 'NÃO'}
- Múltiplas Opções? ${temMultiplasOpcoes ? 'SIM' : 'NÃO'}

// =================================================================
// IDENTIFICAÇÃO CRÍTICA DO TIPO
// =================================================================

**REGRAS DE PRIORIDADE:**

1. **PACOTE COMPLETO** (Hotel + Aéreo juntos)
   ${isPacote ? '✅ DETECTADO - USE TEMPLATE DE PACOTE!' : ''}
   - Palazzo Lakeside ou outros hotéis + voos
   - Use template com seções separadas para voo e hotel
   
2. **MÚLTIPLAS OPÇÕES** (2+ cards "Selecionado")
   ${temMultiplasOpcoes ? '✅ DETECTADO - USE OPÇÃO 1 e OPÇÃO 2!' : ''}
   - Diferentes datas/horários/passageiros
   - Cada opção com seu preço
   
3. **VOO COMBINADO** (Mix no mesmo itinerário)
   ${temAvianca && temGol && !temMultiplasOpcoes ? '✅ DETECTADO - USE VOO COMBINADO!' : ''}
   - Ida Avianca + Volta Gol (ou vice-versa)
   - Um único preço total
   
4. **VOO SIMPLES** (Ida e volta normal)
   - Uma companhia ou codeshare
   - Com ou sem conexão
   
5. **SEM PREÇO** (Apenas detalhes)
   ${!temPreco ? '✅ DETECTADO - NÃO INCLUIR VALORES!' : ''}
   - Omitir linha de valor
   - Manter outros detalhes

// =================================================================
// TEMPLATES ESPECÍFICOS
// =================================================================

${isPacote ? `
**USE ESTE TEMPLATE DE PACOTE:**

*Pacote {destino}*
{data_ida} a {data_volta} ({X} dias e {Y} noites)
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta
- Taxas de Embarque
- {noites} noites de hospedagem
- {regime_alimentacao}

✈️ *Voos:*
IDA - {companhia} - {data}
{origem} {hora} / {destino} {hora} ({tipo})

VOLTA - {companhia} - {data}
{origem} {hora} / {destino} {hora} ({tipo})

🏨 *Hotel Selecionado:*
{nome_hotel}
📍 {endereco}
🛏️ {tipo_quarto}
☕ {regime}
{observacoes_resort_fee}

💰 R$ {valor_total} total
💳 {parcelamento}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade` : ''}

${temAvianca && temGol && !temMultiplasOpcoes ? `
**USE ESTE TEMPLATE DE VOO COMBINADO:**

*Voo {origem} ✈ {destino}*
{data_ida} a {data_volta} ({X} dias e {Y} noites)

✈️ IDA - Avianca
{detalhes_ida_com_conexao}

✈️ VOLTA - Gol
{detalhes_volta_com_conexao}

💰 R$ {valor} para {passageiros}
💳 {parcelamento}
✅ Só mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade` : ''}

${temMultiplasOpcoes ? `
**USE ESTE TEMPLATE DE MÚLTIPLAS OPÇÕES:**

*OPÇÃO 1 - {companhia} - {origem} ✈ {destino}*
{detalhes_opcao1}

💰 R$ {valor1} para {passageiros1}
✅ {bagagem1}
🏷️ {reembolso1}

---

*OPÇÃO 2 - {companhia} - {origem} ✈ {destino}*
{detalhes_opcao2}
{nota_codeshare_se_houver}

💰 R$ {valor2} para {passageiros2}
✅ {bagagem2}
🏷️ {reembolso2}

Valores sujeitos a confirmação e disponibilidade` : ''}

// =================================================================
// CONVERSÃO DE CÓDIGOS
// =================================================================

**SEMPRE CONVERTER:**
${tabelaAeroportos}

// =================================================================
// REGRAS FINAIS
// =================================================================

1. **DETECTAR CORRETAMENTE O TIPO**
2. **USAR O TEMPLATE APROPRIADO**
3. **CONVERTER TODOS OS CÓDIGOS**
4. **SE NÃO TEM PREÇO, OMITIR LINHA DE VALOR**
5. **INCLUIR DETALHES DE CONEXÃO QUANDO HOUVER**
6. **MENCIONAR CODESHARE SE APLICÁVEL**
7. **FORMATAR PARCELAMENTO CORRETAMENTE**
8. **TERMINAR COM "Valores sujeitos..."**

**IMPORTANTE:**
- Entrada de R$ X + Yx de R$ Y = usar este formato exato
- Resort Fee = mencionar em observações do hotel
- Passageiros = sempre com zero à esquerda (01, 02, 03)`;
      }
      
      // ================================================================================
      // 🤖 PROCESSAMENTO COM IA
      // ================================================================================
      let resultado = '';
      let iaUsada = 'gpt-4o-mini';
      
      // Decidir qual IA usar
      const usarClaude = imagemBase64 || 
                        (conteudoPrincipal.length > 2000) ||
                        tipos.includes('Cruzeiro') ||
                        isPacote ||
                        (temAvianca && temGol);
      
      console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');
      
      if (usarClaude && process.env.ANTHROPIC_API_KEY) {
        console.log('🤖 Usando Claude 3 Haiku...');
        iaUsada = 'claude-3-haiku';
        
        const systemPrompt = `Você é um assistente da CVC Itaqua.

INSTRUÇÕES ABSOLUTAS:
1. DETECTAR TIPO CORRETAMENTE:
   - Pacote = Hotel + Aéreo juntos
   - Múltiplas Opções = 2+ cards "Selecionado"
   - Voo Combinado = Avianca ida + Gol volta (mesmo itinerário)
   - Voo Simples = ida/volta normal

2. USAR TEMPLATE CORRETO:
   - Pacote → Incluir seção de voos E hotel
   - Múltiplas → OPÇÃO 1, OPÇÃO 2
   - Combinado → IDA - Avianca, VOLTA - Gol
   - Sem preço → Omitir linha de valor

3. CONVERTER CÓDIGOS E FORMATAR:
   - GRU→Guarulhos, MCO→Orlando, BOG→Bogotá, FOR→Fortaleza
   - NÃO incluir códigos entre parênteses
   - Datas: usar formato DD/MM, não "ter, 03 de fevereiro"

4. DETECTAR PASSAGEIROS CORRETAMENTE:
   - Procurar "Total (X Adultos e Y Crianças)" no texto
   - Formato: "02 adultos + 02 crianças" (com zero à esquerda)

5. VOOS COM ESCALA:
   - Se tem duração (12h 25min), incluir: "(com 1 parada - 12h 25min)"
   - Se voo noturno chega dia seguinte: adicionar "+1" no horário
   - NÃO repetir códigos de aeroporto

6. FORMATO DE PARCELAMENTO:
   "Entrada de R$ 3.518,65 + 9x de R$ 1.304,48 s/ juros"

7. RESORT FEE:
   "⚠️ Resort Fee: $30+tax por noite (pago direto no hotel)"

8. ENDEREÇO DO HOTEL:
   Capitalizar corretamente: "4944 W Irlo Bronson Memorial Hwy, Kissimmee, FL"

9. FORMATAÇÃO DE VOOS NO PACOTE:
   IDA - Avianca - 03/02 (não "ter, 03 de fevereiro")
   Guarulhos 01:50 / Orlando 12:15 (sem códigos GRU/MCO)

10. SEMPRE terminar com:
    "Valores sujeitos a confirmação e disponibilidade"`;
        
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
        
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 2000,
            temperature: 0.1,
            messages,
            system: systemPrompt
          })
        });
        
        if (!claudeResponse.ok) {
          const errorText = await claudeResponse.text();
          console.error('❌ Erro Claude:', errorText);
          throw new Error(`Erro ao processar com Claude: ${errorText}`);
        }
        
        const claudeData = await claudeResponse.json();
        resultado = claudeData.content[0].text;
        
      } else {
        console.log('🤖 Usando GPT-4o-mini...');
        
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada.');
        }
        
        const systemPrompt = `Você é um assistente da CVC Itaqua.

REGRAS CRÍTICAS:
1. DETECTAR: Pacote (hotel+voo) vs Múltiplas Opções vs Voo Combinado
2. CONVERTER: GRU→Guarulhos, MCO→Orlando, BOG→Bogotá, FOR→Fortaleza
3. PASSAGEIROS: Procurar "Total (X Adultos e Y Crianças)" - formato "02 adultos + 02 crianças"
4. VOOS: 
   - Formato data: 03/02 (NÃO "ter, 03 de fevereiro")
   - Sem códigos: Guarulhos (NÃO "Guarulhos (GRU)")
   - Com escala: "(com 1 parada - 12h 25min)"
5. PARCELAMENTO: "Entrada de R$ X + 9x de R$ Y s/ juros"
6. SEM PREÇO: Omitir linha de valor se não houver
7. HOTEL: Capitalizar endereço corretamente
8. TERMINAR: "Valores sujeitos a confirmação e disponibilidade"`;
        
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 2000
          })
        });
        
        if (!gptResponse.ok) {
          const errorText = await gptResponse.text();
          console.error('❌ Erro GPT:', errorText);
          throw new Error(`Erro ao processar com GPT: ${errorText}`);
        }
        
        const gptData = await gptResponse.json();
        resultado = gptData.choices[0].message.content;
      }
      
      // ================================================================================
      // ✅ RESPOSTA FINAL
      // ================================================================================
      console.log('✅ Processamento concluído');
      console.log('📋 Tipo detectado:', 
        isPacote ? 'PACOTE' : 
        temMultiplasOpcoes ? 'MÚLTIPLAS OPÇÕES' :
        (temAvianca && temGol) ? 'VOO COMBINADO' :
        'VOO SIMPLES'
      );
      console.log('💰 Tem preço?', temPreco ? 'SIM' : 'NÃO');
      
      return res.status(200).json({
        success: true,
        result: resultado,
        ia_usada: iaUsada,
        version: '7.4',
        tipo_detectado: isDicas ? 'dicas' : 
                       isRanking ? 'ranking' : 
                       isPacote ? 'pacote' :
                       temMultiplasOpcoes ? 'multiplas_opcoes' :
                       (temAvianca && temGol) ? 'voo_combinado' :
                       'voo_simples',
        tem_preco: temPreco
      });
      
    } catch (error) {
      console.error('❌ Erro:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro desconhecido'
      });
    }
  }
  
  return res.status(405).json({
    success: false,
    error: 'Método não suportado'
  });
}
