// 🚀 CVC ITAQUA v7.0 - SEM DEPENDÊNCIA DO GOOGLE DOCS
// Templates embutidos diretamente no código

// ================================================================================
// 📋 TEMPLATES DE ORÇAMENTOS
// ================================================================================
const TEMPLATES = {
  // Template 1: Aéreo Ida e Volta Simples
  aereo_ida_volta: `
*{companhia}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
💳 {parcelamento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 2: Aéreo com Conexão Detalhada
  aereo_conexao: `
*{companhia}*
IDA: {dataIda}
{aeroportoOrigem} {horaIda} / {aeroportoConexao} {horaChegadaConexao}
Espera de {tempoEspera} em {aeroportoConexao}
{aeroportoConexao} {horaSaidaConexao} / {aeroportoDestino} {horaChegadaDestino}
--
VOLTA: {dataVolta}
{aeroportoDestino} {horaVolta} / {aeroportoConexaoVolta} {horaChegadaConexaoVolta}
Espera de {tempoEsperaVolta} em {aeroportoConexaoVolta}
{aeroportoConexaoVolta} {horaSaidaConexaoVolta} / {aeroportoOrigem} {horaChegadaVolta}

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
💳 {parcelamento}
🏷️ {reembolso}
🔗 {link}

Valores sujeitos a confirmação e disponibilidade`,

  // Template 3: Múltiplas Opções
  multiplas_opcoes: `
*OPÇÃO {numero} - {companhia}*
{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVoo})
--
{dataVolta} - {aeroportoDestino} {horaVolta} / {aeroportoOrigem} {horaChegadaVolta} ({tipoVooVolta})

💰 R$ {valorTotal} para {passageiros}
✅ {bagagem}
💳 {parcelamento}
🏷️ {reembolso}
🔗 {link}`,

  // Template 4: Cruzeiro CORRIGIDO
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

🔗 {link}

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
// 🗺️ TABELA DE CONVERSÃO DE AEROPORTOS
// ================================================================================
const AEROPORTOS = {
  // Brasil
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
  
  // Internacional
  'EZE': 'Ezeiza - Buenos Aires',
  'AEP': 'Aeroparque - Buenos Aires',
  'SCL': 'Santiago',
  'LIM': 'Lima',
  'BOG': 'Bogotá',
  'MEX': 'Cidade do México',
  'CUN': 'Cancún',
  'MIA': 'Miami',
  'MCO': 'Orlando',
  'JFK': 'Nova York - JFK',
  'LAX': 'Los Angeles',
  'LIS': 'Lisboa',
  'OPO': 'Porto',
  'MAD': 'Madrid',
  'BCN': 'Barcelona',
  'CDG': 'Paris - Charles de Gaulle',
  'FCO': 'Roma - Fiumicino',
  'LHR': 'Londres - Heathrow'
};

// ================================================================================
// 🎯 HANDLER PRINCIPAL DA API
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
      message: 'API CVC Itaqua v7.0 - Online (sem dependência do Google Docs)',
      version: '7.0',
      services: {
        openai: hasOpenAI ? 'Configurado' : 'Não configurado',
        anthropic: hasAnthropic ? 'Configurado' : 'Não configurado'
      },
      features: [
        'Templates embutidos no código',
        'Suporte a cruzeiros com roteiro completo',
        'Processamento mais rápido',
        'Sem dependências externas'
      ]
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      console.log('📥 Requisição recebida v7.0');
      
      const { 
        observacoes = '', 
        textoColado = '',
        destino = '',
        adultos = '',
        criancas = 0,
        idadesCriancas = [], // Array com as idades das crianças
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null
      } = req.body;
      
      // Determinar conteúdo principal
      const conteudoPrincipal = observacoes || textoColado || pdfContent || '';
      
      // Formatar informações de passageiros com idades
      let infoPassageiros = '';
      
      // Primeiro verificar se há informação no conteúdo principal
      const conteudoLower = conteudoPrincipal.toLowerCase();
      
      // Detectar padrões mais amplos de passageiros
      // Padrão 1: "X adultos + Y crianças"
      const padraoCompleto = conteudoPrincipal.match(/(\d+)\s*(?:adulto|adultos|adt|adts)\s*\+\s*(\d+)\s*(?:criança|crianças|chd|chds)(?:\s+(.+?)(?:\s+anos?)?)?/i);
      
      if (padraoCompleto) {
        const numAdultos = parseInt(padraoCompleto[1]);
        const numCriancas = parseInt(padraoCompleto[2]);
        const idades = padraoCompleto[3];
        
        let textoPax = `${String(numAdultos).padStart(2, '0')} ${numAdultos === 1 ? 'adulto' : 'adultos'}`;
        textoPax += ` + ${String(numCriancas).padStart(2, '0')} ${numCriancas === 1 ? 'criança' : 'crianças'}`;
        
        if (idades) {
          // Limpar e formatar idades
          const idadesLimpas = idades.replace(/anos?/gi, '').trim();
          textoPax += ` (${idadesLimpas} anos)`;
        }
        
        infoPassageiros = textoPax;
      }
      // Detectar padrões separados de passageiros no texto
      else if (conteudoLower.includes('adt') || conteudoLower.includes('chd') || conteudoLower.includes('inf')) {
        // Extrair números de adultos
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
          // Tentar extrair idades entre parênteses ou após vírgula
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
      
      // Verificar também nos campos do formulário (adultos e criancas)
      if (!infoPassageiros) {
        // Verificar se o campo adultos tem "adt" ou número
        let adultosNum = 0;
        let criancasNum = 0;
        
        if (adultos) {
          // Se tem "adt" no campo adultos
          if (adultos.toLowerCase().includes('adt')) {
            const match = adultos.match(/(\d+)\s*(?:adt|adts)/i);
            if (match) adultosNum = parseInt(match[1]);
          } else if (!isNaN(parseInt(adultos))) {
            adultosNum = parseInt(adultos);
          }
        }
        
        if (criancas) {
          // Se tem "chd" no campo criancas
          if (typeof criancas === 'string' && criancas.toLowerCase().includes('chd')) {
            const match = criancas.match(/(\d+)\s*(?:chd|chds)/i);
            if (match) criancasNum = parseInt(match[1]);
          } else if (!isNaN(parseInt(criancas))) {
            criancasNum = parseInt(criancas);
          }
        }
        
        // Montar o texto de passageiros
        let partes = [];
        if (adultosNum > 0) {
          partes.push(`${String(adultosNum).padStart(2, '0')} ${adultosNum === 1 ? 'adulto' : 'adultos'}`);
        }
        if (criancasNum > 0) {
          // Pegar idades das crianças se fornecidas
          const idadesCriancas = req.body.idadesCriancas || [];
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
      
      // Verificar se é requisição de dicas ou ranking
      const isDicas = tipos.includes('Dicas');
      const isRanking = tipos.includes('Ranking');
      
      let prompt = '';
      
      // ================================================================================
      // 💡 PROMPT PARA DICAS
      // ================================================================================
      if (isDicas) {
        // Lista de cidades nacionais para referência
        const cidadesNacionais = ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife', 'Fortaleza', 
                                 'Natal', 'Maceió', 'Porto Alegre', 'Florianópolis', 'Curitiba', 
                                 'Belo Horizonte', 'Brasília', 'Manaus', 'Belém', 'Foz do Iguaçu',
                                 'Búzios', 'Ilhéus', 'Santos', 'Angra dos Reis', 'Cabo Frio',
                                 'Paraty', 'Porto Seguro', 'Arraial do Cabo'];
        
        // Sempre tentar detectar o destino real
        let destinoReal = '';
        
        // PRIORIDADE: Se for cruzeiro MSC
        if (conteudoPrincipal.toLowerCase().includes('msc') || 
            conteudoPrincipal.toLowerCase().includes('cruzeiro')) {
          destinoReal = 'Cruzeiro MSC pelo litoral brasileiro';
          
          // Detectar os portos específicos
          const portos = [];
          if (conteudoPrincipal.includes('Búzios')) portos.push('Búzios');
          if (conteudoPrincipal.includes('Salvador')) portos.push('Salvador');
          if (conteudoPrincipal.includes('Ilhéus')) portos.push('Ilhéus');
          if (conteudoPrincipal.includes('Rio de Janeiro')) portos.push('Rio de Janeiro');
          
          if (portos.length > 0) {
            destinoReal = `Cruzeiro MSC com paradas em ${portos.join(', ')}`;
          }
        } 
        // Se não for cruzeiro, usar o destino fornecido
        else if (destino) {
          destinoReal = destino;
        }
        // Tentar extrair do conteúdo
        else {
          for (const cidade of cidadesNacionais) {
            if (conteudoPrincipal.includes(cidade)) {
              destinoReal = cidade;
              break;
            }
          }
        }
        
        const isNacional = true; // Forçar nacional para cruzeiros brasileiros
        const temCriancas = conteudoPrincipal.includes('criança') || 
                          conteudoPrincipal.includes('2 e 12 anos');
        
        const isCruzeiro = conteudoPrincipal.toLowerCase().includes('msc') || 
                          conteudoPrincipal.toLowerCase().includes('cruzeiro');
        
        prompt = `Você é um especialista em viagens da CVC Itaqua. 
        ${isCruzeiro ? 
        `Este é um CRUZEIRO MSC ARMONIA pelo litoral brasileiro.
        IMPORTANTE: NÃO fale sobre Paris, Tóquio ou qualquer outro destino!
        
        Crie dicas ESPECÍFICAS para este cruzeiro com paradas em Búzios, Salvador e Ilhéus.
        
        Use EXATAMENTE este formato:` :
        `Crie dicas práticas sobre ${destinoReal}.
        Use este formato:`}
        
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
        prompt = `Você é um especialista em hotéis da CVC Itaqua.
        Crie um ranking dos TOP 5 hotéis em ${destino || 'o destino'}.
        
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
      // 📋 PROMPT PRINCIPAL PARA ORÇAMENTOS
      // ================================================================================
      else {
        // Converter a tabela de aeroportos em string para o prompt
        const tabelaAeroportos = Object.entries(AEROPORTOS)
          .map(([codigo, nome]) => `${codigo} → ${nome}`)
          .join('\n');
        
        prompt = `Você é um assistente especialista da CVC Itaqua. Analise os dados do cliente e formate um orçamento seguindo EXATAMENTE as regras abaixo.

**DADOS DO CLIENTE:**
${conteudoPrincipal}
${destino ? `\nDestino: ${destino}` : ''}
${infoPassageiros ? `\nPassageiros: ${infoPassageiros}` : ''}
${parcelamento ? `\nParcelamento: ${parcelamento}x sem juros` : ''}

// =================================================================
// IDENTIFICAÇÃO DO TIPO DE ORÇAMENTO
// =================================================================

**ANÁLISE PRIORITÁRIA:**

1. **CRUZEIRO**
   - SE contém: "cruzeiro", "navio", "cabine", "MSC", "Costa", "noites•", "Embarque:", "Desembarque:"
   - REGRAS CRÍTICAS:
     * SEMPRE inclua o ROTEIRO se houver dias com portos e horários
     * Liste TODAS as cabines fornecidas (Interna, Externa, Varanda, etc)
     * Use SEMPRE o valor "Total a pagar" para cada cabine
     * Parcelamento vai JUNTO com cada cabine, não no final
     * Se houver promoção (ex: "3º E 4º GRATIS"), mencione

2. **ABREVIAÇÕES E PADRÕES DE PASSAGEIROS:**
   - adt/adts = adulto(s)
   - chd/chds = criança(s)
   - inf = bebê
   - "2 adultos + 2 crianças" = detectar e formatar
   - Se houver idades: "2 adultos + 2 crianças (2 e 12 anos)"
   - Exemplo: "2 adts + 2 chds (2 e 10)" = "02 adultos + 02 crianças (2 e 10 anos)"

3. **PACOTES DE BEBIDAS (se houver):**
   - Detectar: "Pacote Easy", "Pacote Premium", "Pacote Não Alcoólico"
   - Adicionar seção separada após as cabines
   - Valores são por cabine (4 passageiros)

3. **MÚLTIPLOS VOOS**
   - SE houver 2+ voos diferentes
   - Use: *OPÇÃO 1 - Companhia*, *OPÇÃO 2 - Companhia*

4. **PACOTE COMPLETO**
   - SE contém: "pacote" OU ("hotel" E "aéreo")
   - Use template de pacote

5. **VOO SIMPLES**
   - Padrão para voos únicos
   - Título: *Companhia*

6. **IMAGENS DE BEBIDAS/EXTRAS**
   - NÃO rejeite - processe normalmente o orçamento principal
   - Mencione os extras se relevante

// =================================================================
// TEMPLATE PARA CRUZEIROS
// =================================================================

**FORMATO BÁSICO (SEM ROTEIRO):**

🚢 *Cruzeiro [Nome do Navio]* – [X] noites
[XX] passageiros
📅 Embarque: [DD/MM/AAAA] ([dia da semana])
📍 Saída e chegada: [Porto]

[SE houver promoção, adicione:]
🎯 [TEXTO DA PROMOÇÃO]

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:

**CABINE [TIPO]** - [Categoria] ([Código])
💰 R$ [usar o "Total a pagar"] (total com taxas)

[Se houver mais cabines, repetir o formato acima]

🔗 [link]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: bebidas, excursões
📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade

**FORMATO COM ROTEIRO (APENAS SE FORNECIDO):**

🚢 *Cruzeiro [Nome do Navio]* – [X] noites
[XX] passageiros
📅 Embarque: [DD/MM/AAAA] ([dia da semana])
📍 Saída e chegada: [Porto]

🗺️ ROTEIRO:
[COPIAR EXATAMENTE O ROTEIRO FORNECIDO]

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:
[LISTAR APENAS AS CABINES FORNECIDAS COM VALORES TOTAIS]

🔗 [link]

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: bebidas, excursões
📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade

**REGRAS ABSOLUTAS PARA CRUZEIROS:**
1. NUNCA invente paradas/roteiro - se não houver, NÃO inclua a seção ROTEIRO
2. NUNCA invente cabines - liste APENAS as fornecidas
3. SEMPRE use o "Total a pagar" como valor único da cabine (NÃO liste valores por passageiro)
4. Se houver promoção (OFERTA RELAMPAGO, 3º E 4º GRATIS, etc), inclua após a data
5. Para cada cabine fornecida, use EXATAMENTE este formato:
   **CABINE INTERNA** - Bella (IB)
   💰 R$ [valor do "Total a pagar"]
6. NÃO liste valores individuais de passageiros
7. NÃO liste taxas separadamente - já estão incluídas no total
8. LINK: Se não houver URL real, NÃO inclua a linha do link
9. PASSAGEIROS: O número antes de "Editar" indica quantidade de passageiros (ex: "4Editar" = 4 passageiros)
   - Use esse número SEMPRE, exceto se o usuário informar adultos/crianças nos campos do formulário

**EXEMPLO CORRETO:**
🚢 *Cruzeiro MSC Armonia* – 6 noites
4 passageiros
📅 Embarque: 04/01/2026 (domingo)
📍 Saída e chegada: Rio de Janeiro

🎯 OFERTA RELÂMPAGO - 3º E 4º GRÁTIS

💥 Tarifas disponíveis!
(Sujeita à confirmação de cabine e categoria)

🛏 Opções de Cabines:

**CABINE INTERNA** - Bella (IB)
💰 R$ 12.826,00

✅ Inclui: hospedagem a bordo, pensão completa
🚫 Não inclui: bebidas, excursões
📲 Me chama pra garantir a sua cabine! 🌴🛳️

Valores sujeitos a confirmação e disponibilidade

// =================================================================
// CONVERSÃO DE AEROPORTOS
// =================================================================

**CONVERTA TODOS OS CÓDIGOS:**
${tabelaAeroportos}

// =================================================================
// REGRAS GERAIS DE FORMATAÇÃO
// =================================================================

1. **TÍTULO DE VOOS:** Sempre "*Companhia*" (sem cidades)
2. **DATAS:** Formato DD/MM ou DD/MM/AAAA
3. **HORÁRIOS:** Formato HH:MM (24h)
4. **VALORES:** R$ X.XXX,XX (com espaço após R$)
5. **PASSAGEIROS:** 
   - Para cruzeiros: buscar número antes de "Editar" (ex: "4Editar" = 4 passageiros)
   - Para voos: "02 adultos", "01 criança" (com zero à esquerda)
   - SEMPRE incluir idades quando informadas:
     * Crianças: "02 crianças (10 e 15 anos)"
     * Bebês: "01 bebê (10 meses)"
     * Formato: sempre entre parênteses após a quantidade
   - Só substituir quantidade se usuário informar nos campos do formulário
6. **PARCELAMENTO:** "Xx de R$ XXX,XX s/ juros no cartão"
7. **LINKS:** Só incluir se houver URL real (https://...), NUNCA escrever "[link]"
8. **FINALIZAÇÃO:** Sempre "Valores sujeitos a confirmação e disponibilidade"

**REGRAS CRÍTICAS - NUNCA INVENTE:**
- NUNCA invente roteiros de cruzeiro - só inclua se fornecido
- NUNCA invente cabines extras - liste APENAS as fornecidas
- NUNCA invente valores - use EXATAMENTE os valores dados
- NUNCA escreva "[link]" se não houver URL real
- Se não tiver informação, NÃO inclua
- Para cruzeiros SEM roteiro, NÃO inclua a seção ROTEIRO
- Mantenha a formatação para WhatsApp`;
      }
      
      // ================================================================================
      // 🤖 DECISÃO: USAR GPT OU CLAUDE?
      // ================================================================================
      let resultado = '';
      let iaUsada = 'gpt-4o-mini'; // padrão
      
      // Usar Claude para casos complexos
      const usarClaude = imagemBase64 || 
                        (conteudoPrincipal.length > 2000) ||
                        tipos.includes('Cruzeiro') ||
                        tipos.includes('Multitrecho') ||
                        conteudoPrincipal.toLowerCase().includes('cruzeiro') ||
                        conteudoPrincipal.toLowerCase().includes('msc') ||
                        conteudoPrincipal.toLowerCase().includes('costa') ||
                        conteudoPrincipal.toLowerCase().includes('cabine');
      
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
            temperature: 0.2,
            messages
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
        
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
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
      
      return res.status(200).json({
        success: true,
        result: resultado,
        ia_usada: iaUsada,
        version: '7.0'
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
