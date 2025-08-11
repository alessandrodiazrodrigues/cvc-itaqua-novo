// 🚀 CVC ITAQUA v7.2 - VERSÃO COMPLETA CORRIGIDA
// Templates corrigidos + Todas as funcionalidades mantidas

// ================================================================================
// 📋 TEMPLATES DE ORÇAMENTOS - CORRIGIDOS CONFORME MANUAL
// ================================================================================
const TEMPLATES = {
  // Template 1: Aéreo Ida e Volta Simples - CORRIGIDO
  aereo_ida_volta: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 2: Aéreo com Conexão Detalhada
  aereo_conexao: `
*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoConexao} {horaChegadaConexao} (voo direto)
(conexão em {cidadeConexao} - {tempoEspera} de espera)
{dataIda} - {aeroportoConexao} {horaSaidaConexao} / {aeroportoDestino} {horaChegadaDestino} (voo direto)
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoConexaoVolta} {horaChegadaConexaoVolta} (voo direto)
(conexão em {cidadeConexaoVolta} - {tempoEsperaVolta} de espera)
{dataVolta} - {aeroportoConexaoVolta} {horaSaidaConexaoVolta} / {aeroportoOrigem} {horaChegadaVolta} (voo direto)

💰 R$ {valorTotal} para {passageiros}
💳 {parcelamento}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 3: Múltiplas Opções
  multiplas_opcoes: `
*OPÇÃO {numero} - {companhia} - {cidadeOrigem} ✈ {cidadeDestino}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
💳 {parcelamento}
🏷️ {reembolso}`,

  // Template 4: Cruzeiro
  cruzeiro: `
🚢 *Cruzeiro {nomeNavio}* – {noites} noites
{passageiros}
📅 Embarque: {dataEmbarque} ({diaSemana})
📍 Saída e chegada: {porto}

🗺️ ROTEIRO:
{roteiroDias}

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:

{opcoesCabines}

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: bebidas, excursões
📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade`,

  // Template 5: Pacote Completo
  pacote_completo: `
*Pacote {destino}*
Embarque: {dataEmbarque}
Pacote para {passageiros}

*O Pacote Inclui:*
- Passagem Aérea ida e volta para {destino}
- Taxas de Embarque
- Traslado {tipoTraslado}
- {noites} noites de hospedagem no hotel escolhido

✈️ *Voos {companhia}:*
{dataIda} - {origem} {horaIda} / {destino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {destino} {horaVolta} / {origem} {horaChegadaVolta} ({tipoVooVolta})

{opcoesHoteis}

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
  'UDI': 'Uberlândia',
  'RAO': 'Ribeirão Preto',
  'JOI': 'Joinville',
  'XAP': 'Chapecó',
  'IGU': 'Foz do Iguaçu',
  'LDB': 'Londrina',
  'MGF': 'Maringá',
  'PET': 'Pelotas',
  'CXJ': 'Caxias do Sul',
  'PFB': 'Passo Fundo',
  'JDO': 'Juazeiro do Norte',
  'IMP': 'Imperatriz',
  'MAB': 'Marabá',
  'STM': 'Santarém',
  'RBR': 'Rio Branco',
  'PVH': 'Porto Velho',
  'BVB': 'Boa Vista',
  'MCP': 'Macapá',
  'PMW': 'Palmas',
  
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
// 🎯 HANDLER PRINCIPAL DA API v7.2
// ================================================================================
export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Status da API
  if (req.method === 'GET') {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    
    return res.status(200).json({
      success: true,
      message: 'API CVC Itaqua v7.2 - Online (Formatação Corrigida)',
      version: '7.2',
      services: {
        openai: hasOpenAI ? 'Configurado' : 'Não configurado',
        anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
      },
      features: [
        'Templates corrigidos conforme manual',
        'Suporte completo a cruzeiros',
        'Sistema de dicas e ranking',
        'Detecção automática de tipos',
        'Formatação perfeita para WhatsApp'
      ],
      lastUpdate: '2025-01-14'
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      console.log('📥 Requisição recebida v7.2');
      
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
      
      // Formatar informações de passageiros
      let infoPassageiros = '';
      const conteudoLower = conteudoPrincipal.toLowerCase();
      
      // Detectar padrões de passageiros
      const padraoCompleto = conteudoPrincipal.match(/(\d+)\s*(?:adulto|adultos|adt|adts)\s*\+\s*(\d+)\s*(?:criança|crianças|chd|chds)(?:\s+(.+?)(?:\s+anos?)?)?/i);
      
      if (padraoCompleto) {
        const numAdultos = parseInt(padraoCompleto[1]);
        const numCriancas = parseInt(padraoCompleto[2]);
        const idades = padraoCompleto[3];
        
        let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
        textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
        
        if (idades) {
          const idadesLimpas = idades.replace(/anos?/gi, '').trim();
          textoPax += ` (${idadesLimpas} anos)`;
        }
        
        infoPassageiros = textoPax;
      }
      // Detectar outros padrões
      else if (conteudoLower.includes('adt') || conteudoLower.includes('chd') || conteudoLower.includes('inf')) {
        const adtMatch = conteudoPrincipal.match(/(\d+)\s*(?:adt|adts|adulto)/i);
        const chdMatch = conteudoPrincipal.match(/(\d+)\s*(?:chd|chds|criança)/i);
        const infMatch = conteudoPrincipal.match(/(\d+)\s*(?:inf|bebê)/i);
        
        let partes = [];
        if (adtMatch) {
          const num = parseInt(adtMatch[1]);
          partes.push(`${String(num).padStart(2, '0')} ${num === 1 ? 'adulto' : 'adultos'}`);
        }
        if (chdMatch) {
          const num = parseInt(chdMatch[1]);
          const idadesMatch = conteudoPrincipal.match(/chds?\s*[\(\[]?\s*([\d\s,e]+)\s*[\)\]]?/i);
          let textoCriancas = `${String(num).padStart(2, '0')} ${num === 1 ? 'criança' : 'crianças'}`;
          if (idadesMatch && idadesMatch[1]) {
            textoCriancas += ` (${idadesMatch[1].trim()} anos)`;
          }
          partes.push(textoCriancas);
        }
        if (infMatch) {
          const num = parseInt(infMatch[1]);
          partes.push(`${String(num).padStart(2, '0')} ${num === 1 ? 'bebê' : 'bebês'}`);
        }
        
        if (partes.length > 0) {
          infoPassageiros = partes.join(' + ');
        }
      }
      
      // Verificar campos do formulário se não encontrou no conteúdo
      if (!infoPassageiros) {
        let adultosNum = 0;
        let criancasNum = 0;
        
        if (adultos) {
          if (adultos.toLowerCase().includes('adt')) {
            const match = adultos.match(/(\d+)\s*(?:adt|adts)/i);
            if (match) adultosNum = parseInt(match[1]);
          } else if (!isNaN(parseInt(adultos))) {
            adultosNum = parseInt(adultos);
          }
        }
        
        if (criancas) {
          if (typeof criancas === 'string' && criancas.toLowerCase().includes('chd')) {
            const match = criancas.match(/(\d+)\s*(?:chd|chds)/i);
            if (match) criancasNum = parseInt(match[1]);
          } else if (!isNaN(parseInt(criancas))) {
            criancasNum = parseInt(criancas);
          }
        }
        
        let partes = [];
        if (adultosNum > 0) {
          partes.push(`${String(adultosNum).padStart(2, '0')} ${adultosNum === 1 ? 'adulto' : 'adultos'}`);
        }
        if (criancasNum > 0) {
          let textoCriancas = `${String(criancasNum).padStart(2, '0')} ${criancasNum === 1 ? 'criança' : 'crianças'}`;
          
          if (idadesCriancas.length > 0) {
            textoCriancas += ` (${idadesCriancas.join(' e ')} ${idadesCriancas.length === 1 ? 'ano' : 'anos'})`;
          }
          partes.push(textoCriancas);
        }
        
        if (partes.length > 0) {
          infoPassageiros = partes.join(' + ');
        }
      }
      
      // Verificar tipos especiais
      const isDicas = tipos.includes('Dicas');
      const isRanking = tipos.includes('Ranking');
      
      let prompt = '';
      
      // ================================================================================
      // 💡 PROMPT PARA DICAS
      // ================================================================================
      if (isDicas) {
        let destinoReal = '';
        
        if (destino && destino !== 'Destino' && destino !== '') {
          destinoReal = destino;
        }
        
        if (!destinoReal) {
          destinoReal = 'EXTRAIR_DO_CONTEUDO';
        }
        
        const temCriancas = conteudoPrincipal.toLowerCase().includes('criança') || 
                          conteudoPrincipal.toLowerCase().includes('crianças');
        
        const isCruzeiro = conteudoPrincipal.toLowerCase().includes('msc') || 
                          conteudoPrincipal.toLowerCase().includes('cruzeiro');
        
        const isNacional = !conteudoPrincipal.toLowerCase().includes('internacional');
        
        prompt = `Você é um especialista em viagens da CVC Itaqua.
        
        ${destinoReal === 'EXTRAIR_DO_CONTEUDO' ? 
        `PRIMEIRO: Identifique o destino mencionado no conteúdo abaixo.
        DEPOIS: Crie dicas específicas para esse destino.
        
        Se não conseguir identificar o destino, crie dicas gerais de viagem.` :
        `Crie dicas ESPECÍFICAS para ${destinoReal}.`}
        
        ${isCruzeiro ? 
        'Este é um CRUZEIRO. Foque em dicas de vida a bordo, cabines, refeições.' : ''}
        
        ${temCriancas ? 'A viagem inclui CRIANÇAS. Adapte as dicas para famílias.' : ''}
        
        CONTEÚDO PARA ANÁLISE:
        ${conteudoPrincipal}
        
        Use este formato EXATO:
        
        ${isCruzeiro ? 
        `🚢 DICAS PARA SEU CRUZEIRO ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🚢
        
        📅 SOBRE SEU CRUZEIRO:
        [Informações sobre a época do ano, clima nos destinos]
        [Dicas sobre a vida a bordo]
        ${temCriancas ? '[Atividades infantis no navio - MSC Kids Club]' : ''}
        
        🍽️ COMO FUNCIONAM AS REFEIÇÕES A BORDO:
        ☕ CAFÉ DA MANHÃ: Self-service no buffet principal (geralmente das 7h às 10h)
        🍝 ALMOÇO: Self-service no buffet com grande variedade (12h às 15h)
        🍷 JANTAR: Duas opções incluídas:
           • Buffet self-service (horário livre)
           • Restaurante à la carte com serviço de mesa (dois horários: 18h30 ou 21h)
        🍰 LANCHES: Pizza e lanches disponíveis em horários específicos
        ⚠️ BEBIDAS: Água, suco, café e chá incluídos nas refeições principais
        💡 DICA: Restaurantes de especialidades são pagos à parte
        
        🛏️ DIFERENÇA ENTRE AS CABINES:
        📦 CABINE INTERNA:
        - Sem janela, mais econômica
        - Mesmos serviços e conforto
        - Ideal para quem só usa para dormir
        - Tamanho: aproximadamente 13m²
        
        🪟 CABINE EXTERNA:
        - Com janela para o mar (não abre)
        - Entrada de luz natural
        - Vista do oceano
        - Tamanho: aproximadamente 16-22m²
        
        🌅 CABINE COM VARANDA:
        - Varanda privativa com cadeiras
        - Porta de vidro que abre
        - Perfeita para apreciar o nascer/pôr do sol
        - Mais espaço e privacidade
        - Tamanho: aproximadamente 16m² + varanda
        
        💰 DICAS DE ECONOMIA NO CRUZEIRO:
        [Pacotes de bebidas - vale a pena?]
        [Internet a bordo - compre pacotes, não use avulso]
        [Excursões - compare preços do navio vs. locais]
        [Spa e cassino - estabeleça limites]
        
        🧳 O QUE LEVAR NA MALA:
        [Roupas para diferentes ocasiões no navio]
        [Itens essenciais: protetor solar, remédio enjoo, adaptador tomada]
        ${temCriancas ? '[Itens para crianças: boias de braço, fraldas de piscina]' : ''}
        
        🏝️ SOBRE OS DESTINOS DO ROTEIRO:
        [Dicas específicas de cada parada]
        [Tempo em cada porto - aproveite bem]
        ${temCriancas ? '[Passeios adequados para crianças em cada parada]' : ''}
        
        💡 DOCUMENTAÇÃO PARA CRUZEIRO NACIONAL:
        RG original em bom estado (menos de 10 anos) ou CNH válida
        ${temCriancas ? 'CRIANÇAS: RG ou Certidão de Nascimento original\nMenores sem um dos pais: autorização com firma reconhecida' : ''}
        Cartão de vacina (recomendado)
        
        ⚠️ DICAS IMPORTANTES:
        ⏰ Chegue ao porto 3 horas antes do embarque
        📱 Coloque o celular em modo avião para evitar roaming
        💊 Leve remédios em quantidade extra
        🚢 Participe do drill de segurança (obrigatório)
        ${temCriancas ? '👶 Cadastre as crianças no Kids Club no primeiro dia' : ''}` :
        
        `🌟 DICAS SOBRE ${destinoReal || '[DESTINO]'} ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🌟
        
        📅 SOBRE SUA VIAGEM:
        [O que esperar do clima e o que aproveitar]
        ${temCriancas ? '[Mencione atividades ideais para crianças]' : ''}
        
        💰 DICAS DE ECONOMIA:
        [3-4 dicas práticas]
        [Mencionar vantagens dos pacotes CVC]
        
        🍽️ GASTRONOMIA LOCAL:
        [Pratos típicos que vale a pena experimentar]
        ${temCriancas ? '[Indicar pratos que crianças costumam gostar]' : ''}
        
        🎯 PRINCIPAIS ATRAÇÕES:
        [Top 5 lugares imperdíveis]
        ${temCriancas ? '[Destacar quais são mais adequadas para crianças]' : ''}
        
        💡 DOCUMENTAÇÃO NECESSÁRIA:
        ${isNacional ? 
        `RG original em bom estado ou CNH válida.${temCriancas ? ' CRIANÇAS: RG ou Certidão de Nascimento original.' : ''}` : 
        `Passaporte válido (mínimo 6 meses), verificar necessidade de visto.${temCriancas ? ' CRIANÇAS: Passaporte próprio obrigatório.' : ''}`}`}
        
        📞 IMPORTANTE: A CVC Itaqua oferece assistência completa em todos os cruzeiros e viagens!`;
      }
      // ================================================================================
      // 🏆 PROMPT PARA RANKING
      // ================================================================================
      else if (isRanking) {
        let destinoRanking = '';
        
        if (destino && destino !== 'Destino' && destino !== '') {
          destinoRanking = destino;
        }
        
        if (!destinoRanking) {
          destinoRanking = 'EXTRAIR_DO_CONTEUDO';
        }
        
        prompt = `Você é um especialista em hotéis da CVC Itaqua.
        
        ${destinoRanking === 'EXTRAIR_DO_CONTEUDO' ?
        `PRIMEIRO: Identifique o destino/cidade mencionado no conteúdo abaixo.
        DEPOIS: Crie um ranking dos TOP 5 hotéis REAIS dessa cidade.
        
        Se não conseguir identificar a cidade, liste os TOP 5 destinos mais procurados do Brasil.` :
        `Crie um ranking dos TOP 5 hotéis REAIS em ${destinoRanking}.`}
        
        IMPORTANTE:
        - Use apenas hotéis que REALMENTE EXISTEM
        - Inclua variedade de categorias (luxo, médio, econômico)
        - Se não conhecer hotéis da cidade, seja honesto
        
        CONTEÚDO PARA ANÁLISE:
        ${conteudoPrincipal}
        
        Use este formato EXATO:
        
        🏆 TOP 5 HOTÉIS - [DESTINO] 🏆
        
        1️⃣ [Nome do Hotel] ⭐⭐⭐⭐⭐
        📍 [Localização/Bairro]
        ✨ [Principal diferencial]
        💰 Diária média: R$ [valor]
        
        2️⃣ [Nome do Hotel] ⭐⭐⭐⭐⭐
        📍 [Localização/Bairro]
        ✨ [Principal diferencial]
        💰 Diária média: R$ [valor]
        
        3️⃣ [Nome do Hotel] ⭐⭐⭐⭐
        📍 [Localização/Bairro]
        ✨ [Principal diferencial]
        💰 Diária média: R$ [valor]
        
        4️⃣ [Nome do Hotel] ⭐⭐⭐⭐
        📍 [Localização/Bairro]
        ✨ [Principal diferencial]
        💰 Diária média: R$ [valor]
        
        5️⃣ [Nome do Hotel] ⭐⭐⭐
        📍 [Localização/Bairro]
        ✨ [Boa relação custo-benefício]
        💰 Diária média: R$ [valor]`;
      }
      // ================================================================================
      // 📋 PROMPT PRINCIPAL PARA ORÇAMENTOS - CORRIGIDO
      // ================================================================================
      else {
        const tabelaAeroportos = Object.entries(AEROPORTOS)
          .map(([codigo, nome]) => `${codigo} → ${nome}`)
          .join('\n');
        
        prompt = `Você é um assistente especialista da CVC Itaqua.
SIGA EXATAMENTE os templates fornecidos, SEM ALTERAÇÕES.

**DADOS DO CLIENTE:**
${conteudoPrincipal}
${destino ? `\nDestino: ${destino}` : ''}
${infoPassageiros ? `\nPassageiros: ${infoPassageiros}` : ''}
${parcelamento ? `\nParcelamento: ${parcelamento}x sem juros` : ''}

// =================================================================
// IDENTIFICAÇÃO DO TIPO DE ORÇAMENTO
// =================================================================

**ANÁLISE PRIORITÁRIA:**

1. **AÉREO IDA E VOLTA** (mais comum)
   - Detectar: voo com ida e volta para mesmo destino
   - Use template aereo_ida_volta
   - TÍTULO OBRIGATÓRIO: *{Companhia} - {Cidade Origem} ✈ {Cidade Destino}*

2. **CRUZEIRO**
   - Detectar: "cruzeiro", "navio", "cabine", "MSC", "Costa"
   - Use template específico de cruzeiro
   - Incluir ROTEIRO apenas se fornecido
   - Listar APENAS cabines fornecidas

3. **MÚLTIPLAS OPÇÕES DE VOO**
   - Detectar: 2+ companhias ou opções diferentes
   - Use: *OPÇÃO 1 - {Companhia} - {Cidade} ✈ {Cidade}*

4. **PACOTE COMPLETO**
   - Detectar: "pacote" ou hotel + aéreo juntos
   - Use template de pacote

// =================================================================
// TEMPLATE OBRIGATÓRIO PARA AÉREO IDA E VOLTA
// =================================================================

**USE EXATAMENTE ESTE FORMATO:**

*{Companhia} - {Cidade Origem} ✈ {Cidade Destino}*
{DD/MM} - {Nome Aeroporto Origem} {HH:MM} / {Nome Aeroporto Destino} {HH:MM} ({tipo voo})
--
{DD/MM} - {Nome Aeroporto Destino} {HH:MM} / {Nome Aeroporto Origem} {HH:MM} ({tipo voo})

💰 R$ {valor total} para {XX passageiro(s)}
✅ {bagagem}
🏷️ {reembolso}

Valores sujeitos a confirmação e disponibilidade

**EXEMPLO CORRETO:**
Dados: Latam, São Paulo-Porto Seguro, 22/01-27/01, CGH-BPS, 17:30-19:25, 10:55-13:05, R$ 1.543,75, 1 adulto, Não reembolsável

SAÍDA:
*Latam - São Paulo ✈ Porto Seguro*
22/01 - Congonhas 17:30 / Porto Seguro 19:25 (voo direto)
--
27/01 - Porto Seguro 10:55 / Congonhas 13:05 (voo direto)

💰 R$ 1.543,75 para 01 adulto
✅ Só mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade

// =================================================================
// TEMPLATE PARA CRUZEIROS
// =================================================================

**FORMATO PARA CRUZEIRO:**

🚢 *Cruzeiro {Nome do Navio}* – {X} noites
{XX} passageiros
📅 Embarque: {DD/MM/AAAA} ({dia da semana})
📍 Saída e chegada: {Porto}

[SE houver roteiro fornecido, adicione:]
🗺️ ROTEIRO:
{copiar exatamente o roteiro fornecido}

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:

**CABINE {TIPO}** - {Categoria} ({Código})
💰 R$ {valor total com taxas}

[repetir para cada cabine fornecida]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: bebidas, excursões
📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade

// =================================================================
// CONVERSÃO OBRIGATÓRIA DE CÓDIGOS
// =================================================================

**SEMPRE CONVERTER:**
${tabelaAeroportos}

// =================================================================
// REGRAS ABSOLUTAS - NUNCA VIOLAR
// =================================================================

1. **FORMATO DO TÍTULO AÉREO:**
   ✅ CERTO: *Latam - São Paulo ✈ Porto Seguro*
   ❌ ERRADO: *Latam* ou *Voo de São Paulo para Porto Seguro*

2. **LINHAS DE VOO:**
   ✅ CERTO: 22/01 - Congonhas 17:30 / Porto Seguro 19:25 (voo direto)
   ❌ ERRADO: Usar múltiplas linhas ou emojis extras

3. **SEPARADOR IDA/VOLTA:**
   SEMPRE usar: --

4. **CÓDIGOS DE AEROPORTO:**
   SEMPRE converter para nomes completos

5. **VALORES:**
   R$ 1.543,75 (com espaço após R$)

6. **PASSAGEIROS:**
   01 adulto, 02 adultos (com zero à esquerda)

7. **BAGAGEM:**
   - "Só mala de mão incluída"
   - "Mala de mão + bagagem despachada"

8. **REEMBOLSO:**
   - "Não reembolsável"
   - "Reembolsável conforme regras do bilhete"

9. **TIPO DE VOO:**
   - "voo direto"
   - "com conexão"
   - "com 1 parada"

10. **EMOJIS PERMITIDOS:**
    APENAS: 💰 ✅ 🏷️ 💳 (e ✈ no título)
    NUNCA: 🕔 📅 🛬 ou outros

**INSTRUÇÃO FINAL:**
- COPIE exatamente o template
- NÃO adicione campos extras
- NÃO invente informações
- TERMINE sempre com "Valores sujeitos a confirmação e disponibilidade"`;
      }
      
      // ================================================================================
      // 🤖 DECISÃO: USAR GPT OU CLAUDE
      // ================================================================================
      let resultado = '';
      let iaUsada = 'gpt-4o-mini';
      
      console.log('🔍 Analisando requisição...');
      console.log('- Tipos selecionados:', tipos);
      console.log('- Tem imagem?', !!imagemBase64);
      console.log('- Tamanho do conteúdo:', conteudoPrincipal.length);
      console.log('- É Dicas?', isDicas);
      console.log('- É Ranking?', isRanking);
      
      // Decidir qual IA usar
      const usarClaude = imagemBase64 || 
                        (conteudoPrincipal.length > 2000) ||
                        tipos.includes('Cruzeiro') ||
                        tipos.includes('Multitrecho') ||
                        conteudoPrincipal.toLowerCase().includes('cruzeiro') ||
                        conteudoPrincipal.toLowerCase().includes('msc') ||
                        conteudoPrincipal.toLowerCase().includes('costa');
      
      console.log('🤖 IA selecionada:', usarClaude ? 'Claude' : 'GPT');
      
      if (usarClaude && process.env.ANTHROPIC_API_KEY) {
        // ================================================================================
        // 🤖 PROCESSAMENTO COM CLAUDE
        // ================================================================================
        console.log('🤖 Usando Claude 3 Haiku...');
        iaUsada = 'claude-3-haiku';
        
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
        
        const systemPrompt = `Você é um assistente da CVC Itaqua.

REGRAS ABSOLUTAS:
1. Para voos: SEMPRE use o formato *Companhia - Cidade ✈ Cidade*
2. NUNCA adicione emojis extras além dos especificados
3. SEMPRE use o separador -- entre ida e volta
4. Converta TODOS os códigos de aeroporto para nomes
5. NÃO invente informações não fornecidas
6. Para cruzeiros: liste APENAS cabines fornecidas
7. SEMPRE termine com "Valores sujeitos a confirmação e disponibilidade"

FORMATO CORRETO DE VOO:
*Latam - São Paulo ✈ Porto Seguro*
22/01 - Congonhas 17:30 / Porto Seguro 19:25 (voo direto)
--
27/01 - Porto Seguro 10:55 / Congonhas 13:05 (voo direto)

💰 R$ 1.543,75 para 01 adulto
✅ Só mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade`;
        
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
        // ================================================================================
        // 🤖 PROCESSAMENTO COM GPT-4o-mini
        // ================================================================================
        console.log('🤖 Usando GPT-4o-mini...');
        
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada.');
        }
        
        const systemPrompt = `Você é um assistente da CVC Itaqua.

INSTRUÇÕES CRÍTICAS:
1. Para voos: use SEMPRE *Companhia - Cidade ✈ Cidade*
2. Use APENAS emojis: 💰 ✅ 🏷️ 💳 (e ✈ no título)
3. SEMPRE use -- como separador entre ida e volta
4. Converta TODOS os códigos: CGH→Congonhas, GRU→Guarulhos, BPS→Porto Seguro
5. Passageiros: 01 adulto, 02 adultos (com zero à esquerda)
6. Termine SEMPRE com "Valores sujeitos a confirmação e disponibilidade"

EXEMPLO CORRETO:
*Latam - São Paulo ✈ Porto Seguro*
22/01 - Congonhas 17:30 / Porto Seguro 19:25 (voo direto)
--
27/01 - Porto Seguro 10:55 / Congonhas 13:05 (voo direto)

💰 R$ 1.543,75 para 01 adulto
✅ Só mala de mão incluída
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade`;
        
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
      console.log('✅ Processamento concluído com', iaUsada);
      console.log('📋 Preview:', resultado.substring(0, 300));
      
      return res.status(200).json({
        success: true,
        result: resultado,
        ia_usada: iaUsada,
        version: '7.2',
        tipo_processamento: isDicas ? 'dicas' : isRanking ? 'ranking' : 'orcamento'
      });
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro desconhecido ao processar orçamento'
      });
    }
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    error: 'Método não suportado. Use GET para status ou POST para processar.'
  });
}
