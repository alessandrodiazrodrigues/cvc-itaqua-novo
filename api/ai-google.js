// 🚀 CVC ITAQUA v6.0 - GOOGLE DOCS API (COM CACHE)
import { google } from 'googleapis';

// ================================================================================
// 📋 SISTEMA DE CACHE DO MANUAL
// ================================================================================
let cache = {
  manual: null,
  timestamp: 0,
};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// ================================================================================
// 🔐 AUTENTICAÇÃO GOOGLE
// ================================================================================
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;
if (!credentialsJsonString) {
  throw new Error('A variável de ambiente GOOGLE_CREDENTIALS_JSON não foi definida.');
}
const credentials = JSON.parse(credentialsJsonString);

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  scopes: ['https://www.googleapis.com/auth/documents.readonly'],
});

// ================================================================================
// 📚 FUNÇÃO PARA LER O MANUAL DO GOOGLE DOCS
// ================================================================================
async function lerManualGoogleDocs() {
  const agora = Date.now();
  
  // Verificar cache
  if (cache.manual && (agora - cache.timestamp < CACHE_DURATION)) {
    console.log('✅ Manual carregado do CACHE');
    return cache.manual;
  }
  
  try {
    console.log('🔄 Baixando novo manual do Google Docs...');
    const docs = google.docs({ version: 'v1', auth });
    const documentId = process.env.GOOGLE_DOCS_ID || '1J6luZmr0Q_ldqsmEJ4kuMEfA7BYt3DInd7-Tt98hInY';
    
    const response = await docs.documents.get({ documentId });
    let manualTexto = '';
    
    const content = response.data.body?.content || [];
    content.forEach(element => {
      if (element.paragraph) {
        element.paragraph.elements?.forEach(elem => {
          if (elem.textRun?.content) {
            manualTexto += elem.textRun.content;
          }
        });
      }
    });
    
    // Salvar no cache
    cache.manual = manualTexto;
    cache.timestamp = agora;
    
    console.log('✅ Manual carregado do Google Docs:', manualTexto.length, 'caracteres');
    return manualTexto;
    
  } catch (error) {
    console.error('❌ Erro ao ler Google Docs:', error.message);
    throw new Error(`Erro ao conectar com Google Docs: ${error.message}`);
  }
}

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
    const hasGoogle = !!process.env.GOOGLE_CREDENTIALS_JSON;
    
    return res.status(200).json({
      success: true,
      message: 'API CVC Itaqua v6.0 - Online',
      services: {
        openai: hasOpenAI ? 'Configurado' : 'Não configurado',
        anthropic: hasAnthropic ? 'Configurado' : 'Não configurado',
        googleDocs: hasGoogle ? 'Configurado' : 'Não configurado'
      },
      cache: {
        hasManual: !!cache.manual,
        age: cache.manual ? `${Math.floor((Date.now() - cache.timestamp) / 1000)}s` : 'N/A'
      }
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      console.log('📥 Requisição recebida');
      
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
      
      // Buscar manual do Google Docs
      const manualCompleto = await lerManualGoogleDocs();
      
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
        // Detectar se é cruzeiro
        const isCruzeiro = conteudoPrincipal.toLowerCase().includes('cruzeiro') || 
                          conteudoPrincipal.toLowerCase().includes('msc') || 
                          conteudoPrincipal.toLowerCase().includes('costa') ||
                          conteudoPrincipal.toLowerCase().includes('navio') ||
                          conteudoPrincipal.toLowerCase().includes('cabine');
        
        if (isCruzeiro) {
          // DICAS ESPECÍFICAS PARA CRUZEIRO
          const temCriancas = criancas > 0 || conteudoPrincipal.toLowerCase().includes('criança');
          
          prompt = `Você é um especialista em cruzeiros da CVC Itaqua.
          Crie dicas práticas sobre o cruzeiro mencionado.
          ${temCriancas ? 'ATENÇÃO: Viagem com CRIANÇAS! Adapte as dicas para famílias.' : ''}
          
          Use este formato EXATO:
          
          🚢 DICAS DO SEU CRUZEIRO ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🚢
          
          ⚓ VIDA A BORDO:
          [Como funciona o navio, refeições incluídas, restaurantes especiais]
          [Horários das refeições, dress code para jantar]
          ${temCriancas ? '[Atividades infantis, kids club, piscinas para crianças]' : '[Atividades para adultos, shows, cassino]'}
          
          🍹 PACOTE DE BEBIDAS:
          💡 IMPORTANTE: Compre o pacote de bebidas ANTECIPADO com a CVC!
          [Economia de até 40% comparado a comprar a bordo]
          [Opções: refrigerantes, sucos, alcoólicas, premium]
          ${temCriancas ? '[Pacotes infantis com sucos e refrigerantes ilimitados]' : ''}
          
          🎯 PASSEIOS NOS DESTINOS:
          [Lista dos portos de parada]
          💡 Compre os passeios ANTECIPADOS com a CVC:
          - Garantia de lugar
          - Preços melhores que a bordo
          - Guias em português
          ${temCriancas ? '- Passeios adequados para crianças' : ''}
          
          ${temCriancas ? `
          👨‍👩‍👧‍👦 DICAS PARA FAMÍLIAS:
          - Kids Club gratuito (verificar idades)
          - Piscinas infantis e tobogãs
          - Cardápio kids nos restaurantes
          - Babysitting disponível (pago)
          - Fraldário e berços sob solicitação` : ''}
          
          💰 DICAS DE ECONOMIA:
          - Pacote de bebidas antecipado (economia de 40%)
          - Passeios comprados com a CVC (mais baratos)
          - Internet: compre pacote antes do embarque
          - Spa: promoções no primeiro dia
          
          🍽️ GASTRONOMIA A BORDO:
          [Restaurante principal incluído]
          [Restaurantes de especialidades (pagos)]
          [Buffet 24h, pizzaria, sorveteria]
          ${temCriancas ? '[Menu infantil disponível em todos restaurantes]' : ''}
          
          📱 DICAS IMPORTANTES:
          - Check-in online antecipado
          - Leve remédios para enjoo
          - Protetor solar indispensável
          - Roupas formais para noites de gala
          ${temCriancas ? '- Leve entretenimento para crianças nos trajetos' : ''}
          
          🛳️ O QUE ESTÁ INCLUÍDO:
          - Acomodação e entretenimento
          - Refeições principais
          - Shows e atividades
          - Academia e piscinas
          
          💳 CUSTOS EXTRAS A BORDO:
          - Bebidas (exceto água, café, chá)
          - Restaurantes de especialidades
          - Spa e salão de beleza
          - Cassino e bingo
          - Fotos profissionais
          - Loja de souvenirs
          
          ⚠️ DICAS DE SEGURANÇA:
          - Participe do drill de segurança
          - Use pulseira de identificação em crianças
          - Álcool gel sempre à mão
          - Seguro viagem é fundamental
          
          📞 IMPORTANTE: A CVC Itaqua oferece:
          - Pacotes de bebidas com desconto
          - Passeios em português
          - Assistência no embarque
          - Seguro viagem especializado para cruzeiros!`;
          
        } else {
          // DICAS NORMAIS DE DESTINO (código anterior)
          const isNacional = destino && ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife', 'Fortaleza', 'Natal', 'Maceió', 'Porto Alegre', 'Florianópolis', 'Curitiba', 'Belo Horizonte', 'Brasília', 'Manaus', 'Belém', 'Foz do Iguaçu'].some(cidade => destino.includes(cidade));
          
          // ... resto do código de dicas normais ...
        }
      }
        
        Use este formato EXATO:
        
        🌟 DICAS SOBRE [DESTINO] ${temCriancas ? '- VIAGEM EM FAMÍLIA' : ''} 🌟
        
        📅 SOBRE SUA VIAGEM EM [MÊS/PERÍODO]:
        [O que esperar do clima e o que aproveitar NESTE período específico da viagem]
        [Eventos ou atrações especiais deste período]
        ${temCriancas ? '[Mencione atividades ideais para crianças neste período]' : ''}
        
        ${temCriancas ? `👨‍👩‍👧‍👦 DICAS PARA FAMÍLIAS COM CRIANÇAS:
        [Atrações específicas para crianças]
        [Horários mais adequados para passeios com pequenos]
        [Restaurantes com área kids ou menu infantil]
        [Cuidados especiais com sol, hidratação e descanso]
        ` : ''}
        
        💰 DICAS DE ECONOMIA:
        [3-4 dicas práticas - NÃO mencionar comprar pela internet]
        ${temCriancas ? '[Mencione gratuidades ou descontos para crianças]' : ''}
        [Mencionar vantagens dos pacotes CVC]
        
        🍽️ GASTRONOMIA LOCAL:
        [Pratos típicos que vale a pena experimentar]
        ${temCriancas ? '[Indicar pratos que crianças costumam gostar]' : ''}
        [Restaurantes parceiros CVC com desconto, se aplicável]
        
        🎯 PRINCIPAIS ATRAÇÕES:
        [Top 5 lugares imperdíveis]
        ${temCriancas ? '[Destacar quais são mais adequadas para crianças]' : ''}
        [Mencionar que a CVC vende todos os passeios com segurança]
        
        💡 DOCUMENTAÇÃO NECESSÁRIA:
        ${isNacional ? 
        `RG original em bom estado (máximo 10 anos) ou CNH válida.${temCriancas ? ' CRIANÇAS: RG ou Certidão de Nascimento original. Menores desacompanhados de um dos pais precisam de autorização judicial com firma reconhecida.' : ''}` : 
        `Passaporte válido (mínimo 6 meses), verificar necessidade de visto.${temCriancas ? ' CRIANÇAS: Passaporte próprio obrigatório. Menores precisam de autorização de ambos os pais se viajarem desacompanhados de um deles.' : ''}`}
        
        🚕 TRANSPORTE:
        [Como se locomover - destacar transfers CVC disponíveis]
        ${temCriancas ? '[Mencionar necessidade de cadeirinha/assento infantil]' : ''}
        
        🎁 O QUE TRAZER:
        [Sugestões de lembrancinhas típicas]
        ${temCriancas ? '[Sugestões de presentes infantis locais]' : ''}
        
        📌 OUTRAS ÉPOCAS DO ANO:
        [Breve menção sobre o que muda em outras estações]
        
        ⚠️ DICAS DE SEGURANÇA:
        [Cuidados básicos com pertences e saúde]
        ${temCriancas ? '[Atenção especial: pulseiras de identificação, protetor solar infantil, repelente adequado]' : ''}
        
        📞 IMPORTANTE: A CVC Itaqua oferece todos os passeios com receptivos locais confiáveis, transfers seguros${temCriancas ? ', cadeirinhas para crianças' : ''} e assistência 24h durante sua viagem!`;
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
      // 📋 PROMPT PRINCIPAL PARA ORÇAMENTOS (OTIMIZADO)
      // ================================================================================
      else {
        prompt = `Você é um assistente especialista da CVC Itaqua. Sua única função é receber DADOS de um cliente e um MANUAL de formatação e retornar um orçamento perfeitamente formatado, seguindo a lógica de decisão abaixo.

**MANUAL COMPLETO (Use para consultar os templates exatos):**
${manualCompleto}

**DADOS DO CLIENTE PARA PROCESSAR:**
${conteudoPrincipal}
${destino ? `\nDestino adicional informado: ${destino}` : ''}
${adultos ? `\nAdultos: ${adultos}` : ''}
${criancas > 0 ? `\nCrianças: ${criancas}` : ''}
${parcelamento ? `\nParcelamento solicitado: ${parcelamento}x sem juros` : ''}

// =================================================================
// LÓGICA DE DECISÃO OBRIGATÓRIA (SIGA ESTA ÁRVORE DE DECISÃO):
// =================================================================

**ANÁLISE PRIORITÁRIA - IDENTIFIQUE O TIPO:**

0. **REGRA UNIVERSAL PARA MÚLTIPLOS VOOS:**
   - SE houver 2 ou mais voos/blocos no texto
   - SEMPRE use formato: *OPÇÃO 1 - Companhia*, *OPÇÃO 2 - Companhia*
   - Não importa se são companhias iguais ou diferentes
   - Exceção: Use TARIFA A, B APENAS quando for literalmente o MESMO voo (mesma companhia E mesmos horários EXATOS)

1. **VOOS IDÊNTICOS COM TARIFAS DIFERENTES (RARO):**
   - SE houver 2+ blocos com:
     * MESMA companhia E
     * MESMOS horários EXATOS (nem 1 minuto diferente) E
     * MESMAS datas E
     * Apenas preços diferentes
   - ENTÃO: Use formato TARIFA A, B, C em um único bloco
   - Isto é MUITO RARO

2. **MÚLTIPLOS VOOS DIFERENTES (MAIS COMUM):**
   - QUALQUER diferença = use OPÇÃO 1, OPÇÃO 2
   - Diferentes companhias = SEMPRE opções
   - Diferentes horários = SEMPRE opções
   - Diferentes datas = SEMPRE opções
   - Cada OPÇÃO tem seu próprio título, dados e link

2. **CRUZEIRO**
   - SE contém: "cruzeiro", "navio", "cabine", "MSC", "Costa"
   - ENTÃO: Use template "11. CRUZEIRO"

3. **PACOTE COMPLETO**
   - SE contém: "pacote" OU ("hotel" E "aéreo") OU "hospedagem incluída"
   - ENTÃO: Use template "10. PACOTE COMPLETO"

4. **HOTÉIS (sem aéreo)**
   - SE contém apenas hotéis, sem menção a voos:
     - Com datas sequenciais diferentes: Use "9. ROTEIRO DE HOTÉIS"
     - Com mesma data, múltiplas opções: Use "8. HOTÉIS - MÚLTIPLAS OPÇÕES"

5. **MULTITRECHO**
   - SE contém: "multitrecho" OU "Trecho 1, Trecho 2, Trecho 3" 
   - OU roteiro tipo A→B→C→D
   - ENTÃO: Use template "6. MULTITRECHO"

6. **MÚLTIPLAS OPÇÕES DO MESMO VOO**
   - SE são 2-3 opções de tarifa para o MESMO voo (mesma data/rota):
     - 2 opções: Use template "4. MÚLTIPLAS OPÇÕES - 2 PLANOS"
     - 3 opções: Use template "5. MÚLTIPLAS OPÇÕES - 3 PLANOS"

7. **VOO SOMENTE IDA**
   - SE contém: "somente ida", "apenas ida", "one way" OU não tem volta
   - ENTÃO: Use template "3. AÉREO SOMENTE IDA"

8. **CONEXÃO DETALHADA**
   - SE mostra tempo de espera E aeroporto de conexão explicitamente
   - ENTÃO: Use template "2. AÉREO IDA E VOLTA COM CONEXÃO DETALHADA"

9. **IDA E VOLTA SIMPLES (padrão)**
   - TODOS os outros casos de voo com ida e volta
   - Use template "1. AÉREO IDA E VOLTA SIMPLES"

// =================================================================
// REGRAS CRÍTICAS DE FORMATAÇÃO:
// =================================================================

**TÍTULO - REGRA ABSOLUTA:**
- Para VOO ÚNICO: Use apenas "*Companhia*"
- Para MÚLTIPLOS VOOS: Use "*OPÇÃO X - Companhia*"
- Exemplos CORRETOS: 
  * Único: "*Gol*"
  * Múltiplo: "*OPÇÃO 1 - Gol*", "*OPÇÃO 2 - Latam*"
- NUNCA inclua cidades no título

**MÚLTIPLOS VOOS - REGRA ABSOLUTA:**
- Companhias DIFERENTES = SEMPRE use OPÇÃO 1, OPÇÃO 2
- Horários DIFERENTES = SEMPRE use OPÇÃO 1, OPÇÃO 2  
- NÃO use formato simples quando há 2+ voos
- Cada OPÇÃO deve começar com "*OPÇÃO X - Companhia*"

**PASSAGEIROS - NUNCA INVENTE:**
- PROIBIDO inventar idades
- Use APENAS: "01 bebê", "01 criança" (sem idades)
- SÓ coloque idade se estiver EXPLICITAMENTE no texto original

**CONVERSÕES OBRIGATÓRIAS DE AEROPORTOS:**
- GRU → Guarulhos
- CGH → Congonhas  
- SDU → Santos Dumont
- GIG → Galeão
- SSA → Salvador
- REC → Recife
- FOR → Fortaleza
- BSB → Brasília
- POA → Porto Alegre
- CWB → Curitiba
- FLN → Florianópolis
- NAT → Natal
- MCZ → Maceió
- CNF → Confins
- VCP → Viracopos
- (veja tabela completa no manual)

**FORMATAÇÃO ESSENCIAL:**
1. TÍTULO: SEMPRE e SOMENTE "*Companhia*" 
   - Correto: "*Latam*" ou "*GOL*" ou "*Azul*"
   - ERRADO: "*Latam - São Paulo ✈ Rio*" ou "*GOL - Guarulhos ✈ Salvador*"
   - NUNCA incluir cidades, rotas ou símbolos de avião no título
2. DATAS: Formato "15/11" (sempre 2 dígitos)
3. HORÁRIOS: Formato "06:20" (24h, sem espaços)
4. VALORES: "R$ 1.234,56" (espaço após R$, vírgula decimal)
5. PASSAGEIROS: "02 adultos" (zero à esquerda)
6. SEPARADOR IDA/VOLTA: Sempre usar "--"
7. LINKS: Se houver URL no texto, adicionar linha: 🔗 URL (SEM colchetes)
8. BAGAGEM: SEMPRE incluir informação de bagagem:
   - Padrão (quando não informado): "✅ Inclui 1 item pessoal + 1 mala de mão 10kg"
   - Com despachada: "✅ Inclui 1 item pessoal + 1 mala de mão 10kg + 1 mala despachada 23kg"
   - Internacional específico: Seguir o que estiver descrito
9. FINALIZAÇÃO: Sempre terminar com "Valores sujeitos a confirmação e disponibilidade"

**PARCELAMENTO - REGRAS IMPORTANTES:**
- COM ENTRADA: "Em até Xx sem juros no cartão, sendo a primeira de R$ xxx + (X-1)x de R$ xxx"
- CÁLCULO DO TOTAL: Se tem "Entrada de R$ X + Yx", o total de parcelas é Y+1
- Exemplos corretos:
  * "Entrada de R$ 1.288,99 + 9x de R$ 576,73" → "Em até 10x sem juros no cartão, sendo a primeira de R$ 1.288,99 + 9x de R$ 576,73"
  * "Entrada de R$ 225,72 + 8x de R$ 77,53" → "Em até 9x sem juros no cartão, sendo a primeira de R$ 225,72 + 8x de R$ 77,53"
  * "Entrada de R$ 500,00 + 11x de R$ 100,00" → "Em até 12x sem juros no cartão, sendo a primeira de R$ 500,00 + 11x de R$ 100,00"
- NUNCA usar a palavra "Entrada" no resultado final, sempre "primeira parcela" ou "sendo a primeira"
- SEM ENTRADA: "10x de R$ xxx s/ juros no cartão"

**CASOS ESPECIAIS:**
- PASSAGEIROS: NUNCA inventar idades
  * Bebês: apenas "01 bebê" ou "02 bebês" (SEM idade, exceto se informada)
  * Crianças: apenas "01 criança" ou "02 crianças" (SEM idade, exceto se informada)
  * Se a idade estiver informada: "01 bebê (10 meses)" ou "01 criança (5 anos)"
- Chegada dia seguinte: "23:30 (15/11)"
- Múltiplos voos: Cada um pode ter seu próprio link e parcelamento
- Voos idênticos: Usar formato TARIFA A, B, C

**INSTRUÇÃO FINAL:**
- NUNCA adicione explicações como "De acordo com o manual..."
- Responda APENAS com o orçamento formatado
- NÃO invente informações (idades, valores, links falsos)
- SEMPRE use OPÇÃO 1, 2 quando há múltiplos voos
- SEMPRE use apenas nome da companhia no título
- Use TARIFA A, B APENAS quando for exatamente o mesmo voo

**IMPORTANTE SOBRE TARIFAS:**
- Use TARIFA A, B, C APENAS para as opções que realmente existem nos dados
- Se houver apenas 2 opções, use apenas TARIFA A e B
- NUNCA invente tarifas adicionais ou valores
- NUNCA use links de exemplo (xxxxx, yyyyy) - use apenas links reais fornecidos

**FORMATO PARA VOOS DIFERENTES (use OPÇÃO 1, 2):**
Quando há companhias diferentes ou horários diferentes:

*OPÇÃO 1 - [Companhia1]*
[Detalhes do voo 1]

💰 R$ [valor1] para [passageiros]
✅ [Bagagem]
💳 [Parcelamento se houver]
🏷️ [Reembolso]
🔗 [Link1 se houver - específico desta opção]

*OPÇÃO 2 - [Companhia2]*
[Detalhes do voo 2]

💰 R$ [valor2] para [passageiros]
✅ [Bagagem]
💳 [Parcelamento se houver]
🏷️ [Reembolso]
🔗 [Link2 se houver - específico desta opção]

Valores sujeitos a confirmação e disponibilidade

**FORMATO PARA VOOS IDÊNTICOS (raro - use TARIFA A, B):**
Use APENAS quando for EXATAMENTE o mesmo voo, mesma companhia, mesmos horários:

*[Companhia]*
[Detalhes do voo - idênticos para todas tarifas]

Para [passageiros]

💰 **TARIFA A** - R$ [valor1]
✅ [Bagagem básica]
💳 [Parcelamento1 se houver]
🏷️ [Reembolso]
🔗 [Link1 se houver]

💰 **TARIFA B** - R$ [valor2]
✅ [Bagagem melhor]
💳 [Parcelamento2 se houver]
🏷️ [Reembolso]
🔗 [Link2 se houver]

Valores sujeitos a confirmação e disponibilidade`;
      }
      
      // ================================================================================
      // 🤖 DECISÃO: USAR GPT OU CLAUDE?
      // ================================================================================
      let resultado = '';
      let iaUsada = 'gpt-4o-mini'; // padrão
      
      // Usar Claude para imagens ou casos complexos
      const usarClaude = imagemBase64 || 
                        (conteudoPrincipal.length > 2000) ||
                        tipos.includes('Cruzeiro') ||
                        tipos.includes('Multitrecho');
      
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
            max_tokens: 1500,
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
            max_tokens: 1500
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
        cache_info: {
          manual_cached: cache.manual ? true : false,
          cache_age_seconds: cache.manual ? Math.floor((Date.now() - cache.timestamp) / 1000) : 0
        }
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
