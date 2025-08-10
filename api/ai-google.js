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
        prompt = `Você é um especialista em viagens da CVC Itaqua. 
        Crie dicas práticas e úteis sobre ${destino || 'o destino'}.
        
        Use este formato EXATO:
        
        🌟 DICAS SOBRE [DESTINO] 🌟
        
        📍 MELHOR ÉPOCA PARA VISITAR:
        [Informação sobre clima e temporadas]
        
        💰 DICAS DE ECONOMIA:
        [3-4 dicas para economizar]
        
        🍽️ GASTRONOMIA LOCAL:
        [Pratos típicos e onde comer]
        
        🎯 PRINCIPAIS ATRAÇÕES:
        [Top 5 lugares imperdíveis]
        
        💡 DICAS IMPORTANTES:
        [Documentação, moeda, fuso horário, etc.]
        
        🚕 TRANSPORTE:
        [Como se locomover na cidade]
        
        🛍️ COMPRAS:
        [O que comprar e onde]
        
        ⚠️ CUIDADOS:
        [Avisos de segurança e saúde]`;
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

0. **VERIFICAÇÃO INICIAL - MÚLTIPLOS BLOCOS DE VOOS**
   - CONTE quantos blocos separados de voos existem nos dados
   - SE houver 2 ou mais blocos com:
     * Diferentes datas de viagem OU
     * Diferentes destinos OU  
     * Diferentes origens OU
     * Separados por "Selecionar" ou "Excluir"
   - ENTÃO: Formate CADA bloco como uma OPÇÃO separada (OPÇÃO 1, OPÇÃO 2, etc.)
   - Use a estrutura: Um título para cada opção, depois as informações de cada voo

1. **MÚLTIPLOS VOOS DIFERENTES (Prioridade máxima)**
   - SE existem 2+ blocos de voos com datas OU destinos OU origens diferentes
   - E NÃO são apenas opções de tarifa do mesmo voo
   - ENTÃO: Use template "7. MÚLTIPLAS COMPANHIAS INTERNACIONAIS" com OPÇÃO 1, OPÇÃO 2, etc.
   - IMPORTANTE: Cada voo diferente deve ser uma OPÇÃO separada

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
1. TÍTULO: Sempre apenas "*Companhia*" (SEM cidades, SEM rotas)
   - Correto: "*Latam*" ou "*GOL*" ou "*Azul*"
   - ERRADO: "*Latam - São Paulo ✈ Rio*"
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
- Exemplo: "Em até 10x sem juros no cartão, sendo a primeira de R$ 1.288,99 + 9x de R$ 576,73"
- NUNCA usar a palavra "Entrada", sempre "primeira parcela" ou "sendo a primeira"
- SEM ENTRADA: "10x de R$ xxx s/ juros no cartão"

**CASOS ESPECIAIS:**
- Crianças: idade em ANOS (2-11 anos)
- Bebês: idade em MESES (0-23 meses)
- Chegada dia seguinte: "23:30 (15/11)"
- Múltiplos voos: Cada um pode ter seu próprio link e parcelamento

**INSTRUÇÃO FINAL:**
- Use EXATAMENTE o formato do template escolhido
- NÃO invente informações não fornecidas
- MANTENHA todos os emojis do template
- SEMPRE inclua informação de bagagem (se não houver, use o padrão)
- Responda APENAS com o orçamento formatado, sem explicações adicionais

**EXEMPLO DE MÚLTIPLOS VOOS COM TODOS OS DETALHES:**
Se receber 2 voos diferentes com parcelamento e links, formate assim:

*OPÇÃO 1 - Latam*
29/12 - Guarulhos 12:15 / Santos Dumont 13:15 (voo direto)
--
04/01 - Galeão 14:00 / Guarulhos 15:10 (voo direto)

💰 R$ 6.479,56 para 01 adulto
✅ Inclui 1 item pessoal + 1 mala de mão 10kg
💳 Em até 10x sem juros no cartão, sendo a primeira de R$ 1.288,99 + 9x de R$ 576,73
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/68989c87bd7224e8db4acfb6

*OPÇÃO 2 - Latam*
18/09 - Salvador 05:00 / Galeão 07:10 (voo direto)
--
25/09 - Galeão 22:30 / Salvador 00:30 (voo direto)

💰 R$ 845,96 para 01 adulto
✅ Inclui 1 item pessoal + 1 mala de mão 10kg
💳 Em até 9x sem juros no cartão, sendo a primeira de R$ 225,72 + 8x de R$ 77,53
🏷️ Não reembolsável
🔗 https://www.cvc.com.br/carrinho-dinamico/68989d6121c4f74e9d1e9fd5

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
