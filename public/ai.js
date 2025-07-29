// ================================================================================
// 🏆 CVC ITAQUA - API HÍBRIDA COMPLETA (Claude + GPT-4o-mini)
// ================================================================================
// Versão: 4.0.0-hybrid
// Autor: Sistema CVC Itaqua
// Última atualização: 2025
// ================================================================================

/*
📋 ÍNDICE DO CÓDIGO:

🔧 SEÇÃO 1: CONFIGURAÇÕES E TEMPLATES (Linhas 30-120)
   ├── 1.1 Templates de Formatação de Orçamentos
   ├── 1.2 Mapeamento de Aeroportos  
   ├── 1.3 Configurações de Preços e Modelos
   └── 1.4 Constantes do Sistema

🎯 SEÇÃO 2: HANDLER PRINCIPAL (Linhas 130-200)
   ├── 2.1 Configuração de CORS e Headers
   ├── 2.2 Validação de Requests
   ├── 2.3 Processamento Principal
   └── 2.4 Retorno de Resposta com Métricas

🤖 SEÇÃO 3: SISTEMA HÍBRIDO DE IA (Linhas 210-280)
   ├── 3.1 Seleção Inteligente de Modelos
   ├── 3.2 Estratégia Híbrida (Claude + GPT-4o-mini)
   ├── 3.3 Sistema de Fallback
   └── 3.4 Logs e Debugging

🏗️ SEÇÃO 4: PROMPTS OTIMIZADOS (Linhas 290-400)
   ├── 4.1 Prompt para Claude (Imagens)
   ├── 4.2 Prompt para GPT-4o-mini (Texto)
   ├── 4.3 Prompts Especiais (Análise, Destino, Ranking)
   └── 4.4 Template Selection Logic

🟠 SEÇÃO 5: CLAUDE SONNET (Linhas 410-480)
   ├── 5.1 Processamento de Imagens Base64
   ├── 5.2 Validações Específicas do Claude
   ├── 5.3 Chamada da API Anthropic
   └── 5.4 Tratamento de Respostas

🔵 SEÇÃO 6: OPENAI GPT-4o-mini (Linhas 490-570)
   ├── 6.1 Processamento de Texto
   ├── 6.2 Fallback para GPT-4o quando necessário
   ├── 6.3 Validações e Logs
   └── 6.4 Tratamento de Erros

🔧 SEÇÃO 7: UTILITÁRIOS E PROCESSAMENTO (Linhas 580-650)
   ├── 7.1 Detecção de Múltiplas Opções
   ├── 7.2 Seleção de Templates
   ├── 7.3 Processamento de Respostas
   └── 7.4 Conversão de Aeroportos

💰 SEÇÃO 8: SISTEMA DE CUSTOS HÍBRIDO (Linhas 660-720)
   ├── 8.1 Cálculo de Custos por Modelo
   ├── 8.2 Comparação de Economia
   ├── 8.3 Métricas Detalhadas
   └── 8.4 Relatórios de Performance

📊 SEÇÃO 9: LOGS E DEBUGGING (Linhas 730-750)
   ├── 9.1 Sistema de Logs Estruturados
   ├── 9.2 Debug de Modelos
   └── 9.3 Monitoramento de Performance
*/

// ================================================================================
// 🔧 SEÇÃO 1: CONFIGURAÇÕES E TEMPLATES
// ================================================================================

// 1.1 TEMPLATES DE FORMATAÇÃO DE ORÇAMENTOS
const templates = {
  'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*

📋 *OPÇÃO 1: [COMPANHIA_1]*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [AEROPORTO_ORIGEM_1] [HORA_IDA_1] / [AEROPORTO_DESTINO_1] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [AEROPORTO_DESTINO_VOLTA_1] [HORA_SAIDA_VOLTA_1] / [AEROPORTO_ORIGEM_VOLTA_1] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [COMPOSICAO_PASSAGEIROS_1]
💳 [FORMA_PAGAMENTO_1]
🔗 [LINK_CVC_1]

📋 *OPÇÃO 2: [COMPANHIA_2]*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [AEROPORTO_ORIGEM_2] [HORA_IDA_2] / [AEROPORTO_DESTINO_2] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [AEROPORTO_DESTINO_VOLTA_2] [HORA_SAIDA_VOLTA_2] / [AEROPORTO_ORIGEM_VOLTA_2] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [COMPOSICAO_PASSAGEIROS_2]
💳 [FORMA_PAGAMENTO_2]
🔗 [LINK_CVC_2]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`,

  'Aéreo Facial': `*Passagem Aérea*
[COMPANHIA_AEREA] 
[DATA_IDA] - [AEROPORTO_ORIGEM] [HORA_SAIDA] / [AEROPORTO_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [AEROPORTO_DESTINO_VOLTA] [HORA_SAIDA_VOLTA] / [AEROPORTO_ORIGEM_VOLTA] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_TOTAL] para [COMPOSICAO_PASSAGEIROS]
💳 [FORMA_PAGAMENTO]
🔗 [LINK_CVC]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra.`,

  'Hotel': `*Hospedagem*
🏨 [NOME_HOTEL] - [CATEGORIA_ESTRELAS]⭐
📍 [LOCALIZACAO_HOTEL]
🗓️ [DATA_CHECK_IN] a [DATA_CHECK_OUT] ([QTDE_NOITES] noites)
👥 [QTDE_ADULTOS] adultos[QTDE_CRIANCAS_TEXTO]

🏠 *Acomodação:*
[TIPO_QUARTO] com [REGIME_ALIMENTACAO]

✅ *Inclui:*
• [TIPO_CAFE]
• [WIFI_INCLUSO]
• [SERVICOS_INCLUSOS]

💰 R$ [VALOR_TOTAL_HOSPEDAGEM] para toda a estadia
💳 Parcelamento: [QTDE_PARCELAS]x de R$ [VALOR_PARCELA_HOTEL]

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva.`
};

// 1.2 MAPEAMENTO DE AEROPORTOS BRASILEIROS
const aeroportos = {
  'CGH': 'Congonhas', 'GRU': 'Guarulhos', 'VCP': 'Viracopos',
  'SDU': 'Santos Dumont', 'GIG': 'Galeão',
  'RAO': 'Ribeirão Preto', 'BPS': 'Porto Seguro', 'SSA': 'Salvador', 'IOS': 'Ilhéus',
  'BSB': 'Brasília', 'CNF': 'Confins', 'PLU': 'Pampulha', 'CWB': 'Afonso Pena',
  'IGU': 'Foz do Iguaçu', 'REC': 'Recife', 'FOR': 'Fortaleza', 'MAO': 'Manaus',
  'BEL': 'Belém', 'CGB': 'Cuiabá', 'CGR': 'Campo Grande', 'AJU': 'Aracaju',
  'MCZ': 'Maceió', 'JPA': 'João Pessoa', 'NAT': 'Natal', 'THE': 'Teresina',
  'SLZ': 'São Luís', 'VIX': 'Vitória', 'FLN': 'Florianópolis', 'POA': 'Porto Alegre'
};

// 1.3 CONFIGURAÇÕES DE PREÇOS (USD por 1K tokens)
const PRECOS_MODELOS = {
  // OpenAI
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-vision-preview': { input: 0.01, output: 0.03 },
  
  // Claude (aproximado)
  'claude-3-sonnet': { input: 0.003, output: 0.015 }
};

// 1.4 CONSTANTES DO SISTEMA
const USD_TO_BRL = 5.2;
const MAX_TOKENS = 2500;
const CLAUDE_MAX_IMAGE_SIZE_MB = 5;
const OPENAI_MAX_IMAGE_SIZE_MB = 20;

// ================================================================================
// 🎯 SEÇÃO 2: HANDLER PRINCIPAL
// ================================================================================

export default async function handler(req, res) {
  try {
    // 2.1 CONFIGURAÇÃO DE CORS E HEADERS
    console.log('🚀 [CVC HÍBRIDO] API iniciada');
    console.log('🚀 [CVC HÍBRIDO] Método:', req.method);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // 2.2 TRATAMENTO DE REQUESTS ESPECIAIS
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'CORS OK' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ 
        message: 'CVC Itaqua API Híbrida',
        version: '4.0.0-hybrid',
        timestamp: new Date().toISOString(),
        sistema: 'Claude (imagens) + GPT-4o-mini (texto)',
        features: [
          'Claude Sonnet 3 para análise visual',
          'GPT-4o-mini para processamento de texto',
          'Sistema híbrido de fallback',
          'Medidor de custo em tempo real',
          'Templates múltiplas opções',
          'Links CVC corrigidos'
        ],
        modelos: {
          texto: 'gpt-4o-mini',
          imagem: 'claude-3-sonnet',
          fallback: 'gpt-4-vision-preview'
        }
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // 2.3 VALIDAÇÃO DE DADOS
    if (!req.body) {
      return res.status(400).json({ error: 'Body obrigatório' });
    }
    
    const { prompt, tipo, destino, tipos, temImagem, arquivo } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Prompt obrigatório',
        received: { prompt: typeof prompt, length: prompt?.length || 0 }
      });
    }
    
    console.log('✅ [CVC HÍBRIDO] Dados válidos - Prompt:', prompt.length, 'chars | Imagem:', !!temImagem);

    // 2.4 PROCESSAMENTO PRINCIPAL COM SISTEMA HÍBRIDO
    const startTime = Date.now();
    
    // Estimativa de tokens
    const tokensInput = Math.ceil(prompt.length / 4);
    const tokensEstimadosOutput = 800;
    
    // Seleção inteligente de modelo
    const { modelo, estrategia } = selecionarModeloHibrido(temImagem);
    console.log('🎯 [CVC HÍBRIDO] Estratégia:', estrategia);
    
    // Seleção de template
    const template = selecionarTemplate(tipos, tipo, prompt);
    
    // Construir prompt otimizado por modelo
    const promptFinal = construirPromptOtimizado(prompt, template, { destino, tipos, temImagem, tipo });
    
    // Chamar IA híbrida
    const resultado = await chamarIAHibrida(promptFinal, temImagem, arquivo, modelo);
    
    // Processar resposta
    const responseProcessada = processarResposta(resultado.content);
    
    // Calcular métricas finais
    const metricas = calcularMetricasHibridas(resultado, temImagem, startTime, estrategia);
    
    console.log('✅ [CVC HÍBRIDO] Processamento concluído em', Date.now() - startTime, 'ms');

    // 2.5 RETORNO DE RESPOSTA COM MÉTRICAS
    return res.status(200).json({
      success: true,
      choices: [{
        message: { content: responseProcessada }
      }],
      metricas: metricas,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '4.0.0-hybrid',
        estrategia: estrategia,
        template_usado: template.substring(0, 50) + '...',
        tipos: tipos || [],
        temImagem: !!temImagem,
        processamento_ms: Date.now() - startTime
      }
    });

  } catch (error) {
    console.error('💥 [CVC HÍBRIDO] Erro:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        message: error.message,
        timestamp: new Date().toISOString(),
        version: '4.0.0-hybrid'
      },
      debug: {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5)
      }
    });
  }
}

// ================================================================================
// 🤖 SEÇÃO 3: SISTEMA HÍBRIDO DE IA
// ================================================================================

// 3.1 SELEÇÃO INTELIGENTE DE MODELOS
function selecionarModeloHibrido(temImagem) {
  if (temImagem) {
    return {
      modelo: 'claude-3-sonnet',
      estrategia: 'Claude Sonnet para análise visual (alta qualidade)',
      fallback: 'gpt-4-vision-preview',
      economia_vs_gpt4o: 60
    };
  } else {
    return {
      modelo: 'gpt-4o-mini',
      estrategia: 'GPT-4o-mini para texto (máxima economia)',
      fallback: 'gpt-4o',
      economia_vs_gpt4o: 92
    };
  }
}

// 3.2 CHAMADA IA HÍBRIDA PRINCIPAL
async function chamarIAHibrida(prompt, temImagem, arquivo, modelo) {
  try {
    console.log('🤖 [IA HÍBRIDA] Iniciando com modelo:', modelo);
    
    // Estratégia híbrida
    if (temImagem) {
      console.log('🟠 [IA HÍBRIDA] Rota: Claude Sonnet para imagem');
      return await chamarClaudeOtimizado(prompt, temImagem, arquivo);
    } else {
      console.log('🔵 [IA HÍBRIDA] Rota: GPT-4o-mini para texto');
      return await chamarOpenAIOtimizada(prompt, false, null, 'gpt-4o-mini');
    }
    
  } catch (error) {
    console.error('❌ [IA HÍBRIDA] Erro no modelo principal:', error.message);
    
    // 3.3 SISTEMA DE FALLBACK INTELIGENTE
    console.log('🔄 [IA HÍBRIDA] Iniciando fallback...');
    
    if (temImagem) {
      console.log('🔄 [IA HÍBRIDA] Fallback: GPT-4 Vision Preview');
      try {
        return await chamarOpenAIOtimizada(prompt, temImagem, arquivo, 'gpt-4-vision-preview');
      } catch (fallbackError) {
        console.error('❌ [IA HÍBRIDA] Fallback também falhou:', fallbackError.message);
        throw new Error(`Ambos os modelos de imagem falharam: Claude (${error.message}) | GPT-4 Vision (${fallbackError.message})`);
      }
    } else {
      console.log('🔄 [IA HÍBRIDA] Fallback: GPT-4o');
      return await chamarOpenAIOtimizada(prompt, false, null, 'gpt-4o');
    }
  }
}

// ================================================================================
// 🏗️ SEÇÃO 4: PROMPTS OTIMIZADOS
// ================================================================================

// 4.1 CONSTRUÇÃO DE PROMPTS OTIMIZADOS POR MODELO
function construirPromptOtimizado(promptBase, template, context) {
  try {
    const { destino, tipos, temImagem, tipo } = context;
    
    // 4.2 PROMPTS ESPECIAIS
    if (tipo === 'analise') {
      return `Você é um analista da CVC Itaqua. ${promptBase}`;
    }
    
    if (tipo === 'destino' || tipo === 'ranking') {
      return promptBase;
    }
    
    const isMultipleTemplate = template.includes('*OPÇÃO 1:*');
    
    // 4.3 PROMPT ESPECÍFICO PARA CLAUDE (IMAGENS)
    if (temImagem) {
      return construirPromptClaude(promptBase, template, context, isMultipleTemplate);
    }
    
    // 4.4 PROMPT ESPECÍFICO PARA GPT-4o-mini (TEXTO)
    return construirPromptGPTMini(promptBase, template, context, isMultipleTemplate);
    
  } catch (error) {
    console.error('❌ [PROMPT] Erro na construção:', error);
    return `Formate este orçamento: ${promptBase}`;
  }
}

// 4.5 PROMPT OTIMIZADO PARA CLAUDE
function construirPromptClaude(promptBase, template, context, isMultiple) {
  return `Você é um especialista em análise de orçamentos de viagem da CVC Itaqua.

TAREFA: Analise esta imagem de orçamento de passagem aérea e extraia todas as informações para criar um orçamento formatado.

FORMATO OBRIGATÓRIO:
${template}

INFORMAÇÕES DO FORMULÁRIO:
${promptBase}

INSTRUÇÕES PARA ANÁLISE DA IMAGEM:

1. 📋 EXTRAIR DA IMAGEM:
   - Companhia aérea (Latam, Gol, Azul, Avianca, etc.)
   - Rota: origem ↔ destino  
   - Datas de ida e volta
   - Horários dos voos
   - Valor total em Reais (R$)
   - Quantidade de passageiros
   - Forma de pagamento (se visível)

2. ✈️ AEROPORTOS - Converter códigos para nomes:
   - CGH = Congonhas | GRU = Guarulhos | IOS = Ilhéus
   - BPS = Porto Seguro | RAO = Ribeirão Preto

3. 🔗 LINKS: Se houver link da CVC na imagem, copie exatamente como está

4. 💰 VALORES: Use os valores exatos mostrados na imagem

${isMultiple ? `
5. 📊 MÚLTIPLAS OPÇÕES: Se a imagem mostra várias opções:
   - Crie seções separadas (OPÇÃO 1, OPÇÃO 2, etc.)
   - Use dados específicos de cada opção
` : ''}

EXEMPLO DO RESULTADO:
*Passagem Aérea*
Latam
30 de agosto - São Paulo/Guarulhos 07:20 / Ilhéus 09:20
30 de agosto - Ilhéus 17:30 / São Paulo/Guarulhos 19:40

💰 R$ 1.439,42 para 1 Adulto
💳 [Forma de pagamento da imagem]

⚠️ Valores sujeitos a alteração e disponibilidade!

RESULTADO: Formate apenas o orçamento final baseado na análise da imagem.`;
}

// 4.6 PROMPT OTIMIZADO PARA GPT-4o-mini
function construirPromptGPTMini(promptBase, template, context, isMultiple) {
  return `Você é uma atendente experiente da CVC Itaqua (filial 6220).

Formate este orçamento seguindo EXATAMENTE o modelo:

${template}

DADOS DO CLIENTE:
${promptBase}

REGRAS IMPORTANTES:
1. Links CVC: Use apenas o URL direto, sem formatação markdown
2. Exemplo: 🔗 https://www.cvc.com.br/carrinho-dinamico/...
3. Aeroportos por extenso: CGH=Congonhas, GRU=Guarulhos
4. Formato pronto para WhatsApp
5. Valores exatos em Real (R$)

${isMultiple ? `
MÚLTIPLAS OPÇÕES: Se há várias opções no texto:
- Identifique TODAS as opções
- Crie seções separadas para cada uma
- Use dados específicos por opção
` : ''}

Gere apenas o orçamento formatado, sem explicações.`;
}

// ================================================================================
// 🟠 SEÇÃO 5: CLAUDE SONNET (PROCESSAMENTO DE IMAGENS)
// ================================================================================

// 5.1 CHAMADA CLAUDE OTIMIZADA
async function chamarClaudeOtimizado(prompt, temImagem, arquivo) {
  try {
    console.log('🟠 [CLAUDE] Iniciando processamento de imagem...');
    
    // 5.2 VALIDAÇÕES ESPECÍFICAS DO CLAUDE
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Chave da Anthropic não configurada. Configure ANTHROPIC_API_KEY.');
    }
    
    let content;
    
    if (temImagem && arquivo) {
      // Processar base64
      const base64Match = arquivo.match(/data:image\/[^;]+;base64,(.+)/);
      if (!base64Match) {
        throw new Error('Formato de imagem inválido para Claude');
      }
      
      const base64Data = base64Match[1];
      const mimeType = arquivo.match(/data:(image\/[^;]+)/)?.[1] || 'image/jpeg';
      
      console.log('🟠 [CLAUDE] MIME Type:', mimeType);
      console.log('🟠 [CLAUDE] Base64 length:', base64Data.length);
      
      // Verificar tamanho (Claude tem limite menor que OpenAI)
      const sizeInMB = (base64Data.length * 0.75) / (1024 * 1024);
      console.log('🟠 [CLAUDE] Tamanho:', sizeInMB.toFixed(2), 'MB');
      
      if (sizeInMB > CLAUDE_MAX_IMAGE_SIZE_MB) {
        throw new Error(`Imagem muito grande para Claude: ${sizeInMB.toFixed(2)}MB. Máximo: ${CLAUDE_MAX_IMAGE_SIZE_MB}MB`);
      }
      
      content = [
        { type: "text", text: prompt },
        { 
          type: "image", 
          source: { 
            type: "base64", 
            media_type: mimeType, 
            data: base64Data 
          } 
        }
      ];
      
    } else {
      content = prompt;
    }

    // 5.3 CHAMADA DA API ANTHROPIC
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: MAX_TOKENS,
        temperature: 0.1,
        messages: [{ role: 'user', content: content }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CLAUDE] Error:', response.status, errorText);
      throw new Error(`Claude Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    // 5.4 TRATAMENTO DE RESPOSTAS
    if (!data.content?.[0]?.text) {
      console.error('❌ [CLAUDE] Resposta inválida:', JSON.stringify(data, null, 2));
      throw new Error('Claude resposta sem conteúdo');
    }

    console.log('✅ [CLAUDE] Sucesso! Resposta:', data.content[0].text.length, 'caracteres');
    console.log('💰 [CLAUDE] Tokens:', (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0));

    // Normalizar resposta para compatibilidade
    return {
      content: data.content[0].text,
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      modelo_usado: 'claude-3-sonnet'
    };
    
  } catch (error) {
    console.error('❌ [CLAUDE] Erro final:', error.message);
    throw error;
  }
}

// ================================================================================
// 🔵 SEÇÃO 6: OPENAI GPT-4o-mini (PROCESSAMENTO DE TEXTO)
// ================================================================================

// 6.1 CHAMADA OPENAI OTIMIZADA
async function chamarOpenAIOtimizada(prompt, temImagem, arquivo, modelo) {
  try {
    console.log('🔵 [OPENAI] Iniciando com modelo:', modelo);
    
    // 6.2 VALIDAÇÕES
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Chave da OpenAI não configurada. Configure OPENAI_API_KEY.');
    }
    
    let messages;
    
    if (temImagem && arquivo) {
      // Processamento de imagem (fallback)
      console.log('🔵 [OPENAI] Processando imagem com', modelo);
      
      if (!arquivo.startsWith('data:image/') || !arquivo.includes('base64,')) {
        throw new Error('Formato de imagem inválido para OpenAI');
      }
      
      const sizeInMB = (arquivo.split('base64,')[1]?.length || 0) * 0.75 / (1024 * 1024);
      
      if (sizeInMB > OPENAI_MAX_IMAGE_SIZE_MB) {
        throw new Error(`Imagem muito grande: ${sizeInMB.toFixed(2)}MB. Máximo: ${OPENAI_MAX_IMAGE_SIZE_MB}MB`);
      }

      messages = [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { 
              url: arquivo,
              detail: "high"
            } 
          }
        ]
      }];
      
    } else {
      // Processamento de texto
      console.log('🔵 [OPENAI] Processando texto com', modelo);
      messages = [{ role: "user", content: prompt }];
    }

    // 6.3 CHAMADA DA API OPENAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelo,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OPENAI] Error:', response.status, errorText);
      throw new Error(`OpenAI Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    // 6.4 TRATAMENTO DE RESPOSTAS
    if (!data.choices?.[0]?.message?.content) {
      console.error('❌ [OPENAI] Resposta inválida:', JSON.stringify(data, null, 2));
      throw new Error('OpenAI resposta sem conteúdo');
    }

    console.log('✅ [OPENAI] Sucesso! Resposta:', data.choices[0].message.content.length, 'caracteres');
    console.log('💰 [OPENAI] Tokens:', data.usage?.total_tokens || 'N/A');

    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      modelo_usado: modelo
    };
    
  } catch (error) {
    console.error('❌ [OPENAI] Erro final:', error.message);
    throw error;
  }
}

// ================================================================================
// 🔧 SEÇÃO 7: UTILITÁRIOS E PROCESSAMENTO
// ================================================================================

// 7.1 DETECÇÃO DE MÚLTIPLAS OPÇÕES
function detectarMultiplasOpcoes(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  
  try {
    const texto = prompt.toLowerCase();
    const indicadores = [
      { regex: /total.*\d+.*adult/gi, minimo: 2 },
      { regex: /r\$.*\d{1,3}[\.,]\d{3}/gi, minimo: 2 },
      { regex: /(gol|latam|azul|avianca|tap)/gi, minimo: 2 },
      { regex: /\d{2}:\d{2}/g, minimo: 4 }
    ];
    
    return indicadores.some(ind => (texto.match(ind.regex) || []).length >= ind.minimo);
  } catch (error) {
    return false;
  }
}

// 7.2 SELEÇÃO DE TEMPLATES
function selecionarTemplate(tipos, tipoEspecifico, prompt) {
  try {
    const temMultiplasOpcoes = detectarMultiplasOpcoes(prompt);
    
    if (temMultiplasOpcoes && (tipos?.includes('Aéreo Facial') || tipos?.includes('Aéreo VBI/Fácil'))) {
      return templates['Aéreo Múltiplas Opções'];
    }
    
    if (tipoEspecifico && templates[tipoEspecifico]) {
      return templates[tipoEspecifico];
    }
    
    if (tipos && Array.isArray(tipos) && tipos.length > 0) {
      for (const tipo of tipos) {
        if (templates[tipo]) return templates[tipo];
      }
    }
    
    return templates['Aéreo Facial'] || templates.default;
  } catch (error) {
    console.error('❌ [TEMPLATE]:', error);
    return templates['Aéreo Facial'];
  }
}

// 7.3 PROCESSAMENTO DE RESPOSTAS
function processarResposta(response) {
  try {
    let processada = response;
    
    // Remover marcações desnecessárias
    processada = processada.replace(/=== TEMPLATE ===/g, '');
    processada = processada.replace(/=== FIM TEMPLATE ===/g, '');
    
    // Corrigir formatação
    processada = processada.replace(/^\*([^*])/gm, '$1');
    processada = processada.replace(/([^*])\*$/gm, '$1');
    
    // 7.4 CONVERSÃO DE AEROPORTOS
    Object.entries(aeroportos).forEach(([sigla, nome]) => {
      const regex = new RegExp(`\\b${sigla}\\b`, 'gi');
      processada = processada.replace(regex, nome);
    });
    
    // Limpar espaços extras
    processada = processada.replace(/\n\s*\n\s*\n/g, '\n\n');
    processada = processada.trim();
    
    return processada;
  } catch (error) {
    console.error('❌ [PROCESSAMENTO]:', error);
    return response;
  }
}

// ================================================================================
// 💰 SEÇÃO 8: SISTEMA DE CUSTOS HÍBRIDO
// ================================================================================

// 8.1 CÁLCULO DE MÉTRICAS HÍBRIDAS
function calcularMetricasHibridas(resultado, temImagem, startTime, estrategia) {
  const tokensInput = resultado.usage?.prompt_tokens || 0;
  const tokensOutput = resultado.usage?.completion_tokens || 0;
  const tokensTotal = resultado.usage?.total_tokens || tokensInput + tokensOutput;
  
  // 8.2 CÁLCULO DE CUSTOS POR MODELO
  let custoUSD, economiaUSD, percentualEconomia;
  
  if (temImagem) {
    // Claude Sonnet
    custoUSD = (tokensInput / 1000) * PRECOS_MODELOS['claude-3-sonnet'].input + 
               (tokensOutput / 1000) * PRECOS_MODELOS['claude-3-sonnet'].output;
    
    // Economia vs GPT-4o
    const custoGPT4o = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o'].input + 
                       (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o'].output;
    economiaUSD = custoGPT4o - custoUSD;
    percentualEconomia = ((economiaUSD / custoGPT4o) * 100).toFixed(1);
    
  } else {
    // GPT-4o-mini
    custoUSD = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o-mini'].input + 
               (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o-mini'].output;
    
    // Economia vs GPT-4o
    const custoGPT4o = (tokensInput / 1000) * PRECOS_MODELOS['gpt-4o'].input + 
                       (tokensOutput / 1000) * PRECOS_MODELOS['gpt-4o'].output;
    economiaUSD = custoGPT4o - custoUSD;
    percentualEconomia = ((economiaUSD / custoGPT4o) * 100).toFixed(1);
  }

  // 8.3 CONVERSÃO PARA BRL
  const custoBRL = custoUSD * USD_TO_BRL;
  const economiaBRL = economiaUSD * USD_TO_BRL;
  
  // 8.4 MÉTRICAS DETALHADAS
  return {
    modelo_usado: resultado.modelo_usado || (temImagem ? 'claude-3-sonnet' : 'gpt-4o-mini'),
    estrategia: estrategia,
    tipo_processamento: temImagem ? 'imagem' : 'texto',
    tokens: {
      input: tokensInput,
      output: tokensOutput,
      total: tokensTotal
    },
    custo: {
      usd: custoUSD,
      brl: custoBRL,
      input_usd: (tokensInput / 1000) * (temImagem ? PRECOS_MODELOS['claude-3-sonnet'].input : PRECOS_MODELOS['gpt-4o-mini'].input),
      output_usd: (tokensOutput / 1000) * (temImagem ? PRECOS_MODELOS['claude-3-sonnet'].output : PRECOS_MODELOS['gpt-4o-mini'].output)
    },
    economia: {
      vs_gpt4o_usd: economiaUSD,
      vs_gpt4o_brl: economiaBRL,
      percentual: parseFloat(percentualEconomia)
    },
    performance: {
      tempo_processamento_ms: Date.now() - startTime,
      tokens_por_segundo: Math.round(tokensTotal / ((Date.now() - startTime) / 1000))
    },
    timestamp: new Date().toISOString()
  };
}

// ================================================================================
// 📊 SEÇÃO 9: LOGS E DEBUGGING
// ================================================================================

// 9.1 LOG DE INICIALIZAÇÃO
console.log('✅ [CVC HÍBRIDO] Sistema carregado com sucesso!');
console.log('🎯 [CVC HÍBRIDO] Estratégia: Claude (imagens) + GPT-4o-mini (texto)');
console.log('💰 [CVC HÍBRIDO] Economia esperada: 60-92% vs GPT-4o puro');
console.log('🔄 [CVC HÍBRIDO] Fallback automático configurado');
console.log('📈 [CVC HÍBRIDO] Versão: 4.0.0-hybrid');
