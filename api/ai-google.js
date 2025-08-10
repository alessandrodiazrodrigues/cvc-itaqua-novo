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
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null
      } = req.body;
      
      // Determinar conteúdo principal
      const conteudoPrincipal = observacoes || textoColado || pdfContent || '';
      
      // Verificar se é requisição de dicas ou ranking
      const isDicas = tipos.includes('Dicas');
      const isRanking = tipos.includes('Ranking');
      
      let prompt = '';
      
      // ================================================================================
      // 💡 PROMPT PARA DICAS
      // ================================================================================
      if (isDicas) {
        const isNacional = destino && ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife', 'Fortaleza', 'Natal', 'Maceió', 'Porto Alegre', 'Florianópolis', 'Curitiba', 'Belo Horizonte', 'Brasília', 'Manaus', 'Belém', 'Foz do Iguaçu'].some(cidade => destino.includes(cidade));
        
        const temCriancas = criancas > 0 || conteudoPrincipal.toLowerCase().includes('criança') || conteudoPrincipal.toLowerCase().includes('crianças');
        
        prompt = `Você é um especialista em viagens da CVC Itaqua. 
        Crie dicas práticas e úteis sobre ${destino || 'o destino'}.
        ${isNacional ? 'Este é um DESTINO NACIONAL (Brasil).' : 'Este é um DESTINO INTERNACIONAL.'}
        ${temCriancas ? 'ATENÇÃO: Esta viagem inclui CRIANÇAS! Adapte TODAS as dicas para famílias com crianças.' : ''}
        
        Use este formato EXATO:
        
        🌟 DICAS SOBRE [DESTINO] ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🌟
        
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
        `Passaporte válido (mínimo 6 meses), verificar necessidade de visto.${temCriancas ? ' CRIANÇAS: Passaporte próprio obrigatório.' : ''}`}
        
        📞 IMPORTANTE: A CVC Itaqua oferece todos os passeios com receptivos locais confiáveis!`;
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
${adultos ? `\nAdultos: ${adultos}` : ''}
${criancas > 0 ? `\nCrianças: ${criancas}` : ''}
${parcelamento ? `\nParcelamento: ${parcelamento}x sem juros` : ''}

// =================================================================
// IDENTIFICAÇÃO DO TIPO DE ORÇAMENTO
// =================================================================

**ANÁLISE PRIORITÁRIA:**

1. **CRUZEIRO**
   - SE contém: "cruzeiro", "navio", "cabine", "MSC", "Costa", "noites•", "Embarque:", "Desembarque:"
   - REGRAS CRÍTICAS:
     * NUNCA INVENTE ROTEIRO - só inclua se houver itinerário nos dados
     * NUNCA INVENTE CABINES - só liste as que foram fornecidas
     * Use SEMPRE o valor total fornecido (com taxas)
     * Se houver promoção (ex: "3º E 4º GRATIS"), mencione

2. **MÚLTIPLOS VOOS**
   - SE houver 2+ voos diferentes
   - Use: *OPÇÃO 1 - Companhia*, *OPÇÃO 2 - Companhia*

3. **PACOTE COMPLETO**
   - SE contém: "pacote" OU ("hotel" E "aéreo")
   - Use template de pacote

4. **VOO SIMPLES**
   - Padrão para voos únicos
   - Título: *Companhia*

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
[LISTAR APENAS AS CABINES FORNECIDAS COM VALORES TOTAIS]

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
3. Use SEMPRE o "Total a pagar" como valor da cabine
4. Se houver promoção (OFERTA RELAMPAGO, 3º E 4º GRATIS, etc), inclua após a data
5. Para cabines fornecidas, use o formato:
   **CABINE [TIPO]** - [Categoria] ([Código])
   💰 R$ [valor total]

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
5. **PASSAGEIROS:** "02 adultos", "01 criança" (com zero à esquerda)
6. **PARCELAMENTO:** "Xx de R$ XXX,XX s/ juros no cartão"
7. **FINALIZAÇÃO:** Sempre "Valores sujeitos a confirmação e disponibilidade"

**IMPORTANTE:**
- NUNCA invente informações
- Para cruzeiros, o ROTEIRO DIA A DIA é OBRIGATÓRIO
- Use apenas os dados fornecidos
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
