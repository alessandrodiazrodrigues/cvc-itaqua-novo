// api/ai.js - Versão 2.0 SUPER SIMPLIFICADA
// Sistema CVC Itaqua - Apenas o essencial

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Inicializar clientes
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Handler principal
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🚀 Recebendo requisição...');
    
    const {
      observacoes,
      textoColado,
      destino,
      adultos,
      criancas,
      tipos,
      parcelamento,
      imagemBase64,
      pdfContent
    } = req.body;

    // Montar contexto para a IA
    const contexto = `
CONSULTE O MANUAL DE FORMATOS CVC:
https://docs.google.com/document/d/1-uDIGYTkKwErFh6kpWKtPHxMhGd2s2jsnOfFPmebtO0/edit

DADOS DO CLIENTE:
- Destino: ${destino || 'Não especificado'}
- Adultos: ${adultos || 1}
- Crianças: ${criancas || 0}
- Bebês: ${req.body.bebes || 0}
- Tipos solicitados: ${tipos?.join(', ') || 'Aéreo'}
${parcelamento ? `- Parcelamento: ${parcelamento}x sem juros` : ''}

TEXTO FORNECIDO PELO CLIENTE:
${observacoes || ''}

${textoColado ? `DADOS COLADOS (copiar/colar do site CVC):
${textoColado}` : ''}

${pdfContent ? `CONTEÚDO DO PDF:
${pdfContent}` : ''}

INSTRUÇÕES IMPORTANTES:
1. Leia e siga EXATAMENTE o manual no link acima
2. Gere o orçamento no formato EXATO do manual para WhatsApp
3. Use os dados fornecidos acima
4. Se houver texto colado, extraia datas, horários, valores e informações
5. Converta códigos de aeroporto (GRU→Guarulhos, CGH→Congonhas, etc)
6. Formate datas como DD/MM
7. Se tiver parcelamento, adicione após o valor
8. Use emojis apropriados (✈️, 💰, ✅, 🏷️, etc)
9. Para múltiplas opções, use formato: *OPÇÃO 1*, *OPÇÃO 2*
10. SEMPRE incluir separador -- entre ida e volta (exceto em conexões)
11. RETORNE APENAS O ORÇAMENTO FORMATADO, sem explicações extras

GERE O ORÇAMENTO AGORA:`;

    // Decidir qual IA usar
    const usarClaude = imagemBase64 || contexto.length > 4000;
    
    console.log(`📤 Enviando para ${usarClaude ? 'Claude' : 'GPT-4o-mini'}...`);
    
    let resposta;
    
    if (usarClaude) {
      // Usar Claude para casos complexos ou com imagem
      const messages = [{
        role: 'user',
        content: imagemBase64 
          ? [
              { type: 'text', text: contexto },
              { 
                type: 'image', 
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imagemBase64.replace(/^data:image\/\w+;base64,/, '')
                }
              }
            ]
          : contexto
      }];
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        temperature: 0.3,
        messages: messages
      });
      
      resposta = response.content[0].text;
      
    } else {
      // Usar GPT-4o-mini para casos simples
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criar orçamentos CVC. SEMPRE siga EXATAMENTE o manual fornecido. Retorne APENAS o orçamento formatado para WhatsApp.'
          },
          {
            role: 'user',
            content: contexto
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });
      
      resposta = response.choices[0].message.content;
    }
    
    // Limpar resposta (remover markdown se houver)
    resposta = resposta
      .replace(/```/g, '')
      .replace(/^#+\s*/gm, '')
      .trim();
    
    console.log('✅ Orçamento gerado com sucesso!');
    
    // Retornar resposta
    return res.status(200).json({
      success: true,
      result: resposta,
      ia_usada: usarClaude ? 'Claude' : 'GPT-4o-mini'
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar requisição'
    });
  }
}
