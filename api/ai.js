// 🚀 CVC ITAQUA v5.0 - MANUAL INCORPORADO
// Manual integrado diretamente no código para compatibilidade total

// Manual CVC incorporado
const manualCVC = {
  versao: "1.0",
  ultima_atualizacao: "2024-12-12",
  formatos: {
    aereo_ida_volta_simples: {
      nome: "Aéreo Ida e Volta Simples",
      template: "*{companhia} - {cidadeOrigem} ✈ {cidadeDestino}*\n{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVooIda})\n--\n{dataVolta} - {aeroportoDestinoVolta} {horaVolta} / {aeroportoOrigemVolta} {horaChegadaVolta} ({tipoVooVolta})\n\n💰 R$ {valorTotal} para {passageiros}\n✅ {bagagem}\n🏷️ {reembolso}",
      exemplo: "*Gol - São Paulo ✈ Porto Alegre*\n17/09 - Congonhas 17:05 / Porto Alegre 23:40 (com conexão)\n--\n24/09 - Porto Alegre 08:00 / Congonhas 09:35 (voo direto)\n\n💰 R$ 773,37 para 01 adulto\n✅ Só mala de mão incluída\n🏷️ Não reembolsável"
    },
    aereo_ida_volta_conexao_detalhada: {
      nome: "Aéreo com Conexão Detalhada",
      template: "*{companhia} - {origem} ✈ {destino}*\n{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoConexao} {horaChegadaConexao} (voo direto)\n(conexão em {cidadeConexao} - {tempoEspera} de espera)\n{dataIda} - {aeroportoConexao} {horaSaidaConexao} / {aeroportoDestino} {horaChegadaIda} (voo direto)\n--\n{dataVolta} - {aeroportoDestinoVolta} {horaVolta} / {aeroportoOrigemVolta} {horaChegadaVolta} ({tipoVooVolta})\n\n💰 R$ {valorTotal} para {passageiros}\n💳 {parcelamento}\n✅ {bagagem}\n🏷️ {reembolso}\n🔗 {link}"
    },
    aereo_somente_ida: {
      nome: "Aéreo Somente Ida",
      template: "*{companhia}*\n{data} - {origem} {horaSaida} / {destino} {horaChegada} ({tipoVoo})\n\n💰 Valor total para {passageiros} = {valor}\nValores sujeitos a confirmação e disponibilidade\nInclui taxas de embarque\nInclui 1 item pessoal + 01 mala de mão de 10kg por pessoa\n{reembolso}\n\n⚠️ Passagem somente de ida - sem retorno incluído"
    },
    aereo_multiplas_opcoes_2: {
      nome: "Múltiplas Opções - 2 Planos",
      template: "*{companhia} - {origem} ✈ {destino}*\n{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVooIda})\n--\n{dataVolta} - {aeroportoDestinoVolta} {horaVolta} / {aeroportoOrigemVolta} {horaChegadaVolta} ({tipoVooVolta})\n\n💰 **OPÇÃO 1** - R$ {valor1}\n✅ Só mala de mão incluída\n💳 {parcelamento1}\n🔗 {link1}\n\n💰 **OPÇÃO 2** - R$ {valor2}\n✅ Mala de mão + bagagem despachada\n✅ Cancelamento/alteração com multas\n✅ Reembolsável conforme regras do bilhete\n💳 {parcelamento2}\n🔗 {link2}\n\nValores sujeitos a confirmação e disponibilidade"
    },
    aereo_multiplas_opcoes_3: {
      nome: "Múltiplas Opções - 3 Planos",
      template: "*{companhia} - {origem} ✈ {destino}*\n{dataIda} - {aeroportoOrigem} {horaIda} / {aeroportoDestino} {horaChegadaIda} ({tipoVooIda})\n--\n{dataVolta} - {aeroportoDestinoVolta} {horaVolta} / {aeroportoOrigemVolta} {horaChegadaVolta} ({tipoVooVolta})\n\n💰 **OPÇÃO 1** - R$ {valor1}\n✅ Só mala de mão incluída\n\n💰 **OPÇÃO 2** - R$ {valor2}\n✅ Mala de mão + bagagem despachada\n✅ Cancelamento/alteração com multas\n\n💰 **OPÇÃO 3** - R$ {valor3}\n✅ Mala de mão + 2 bagagens despachadas\n✅ Cancelamento/alteração com multas\n✅ Reembolsável conforme regras do bilhete\n✅ Marcação de assento\n\nValores sujeitos a confirmação e disponibilidade"
    },
    multitrecho: {
      nome: "Multitrecho",
      template: "*Multitrecho - {companhias}*\n{dataInicio} a {dataFim} ({dias} dias e {noites} noites)\n\n*Trecho 1:* {origem1} → {destino1}\n{data1} - {aeroporto1} {hora1} / {aeroportoChegada1} {horaChegada1} ({tipoVoo1})\n\n*Trecho 2:* {origem2} → {destino2}\n{data2} - {aeroporto2} {hora2} / {aeroportoChegada2} {horaChegada2} ({tipoVoo2})\n\n*Trecho 3:* {origem3} → {destino3}\n{data3} - {aeroporto3} {hora3} / {aeroportoChegada3} {horaChegada3} ({tipoVoo3})\n\n💰 R$ {valorTotal} para {passageiros}\n💳 {parcelamento}\n✅ {bagagem}\n🏷️ {reembolso}\n🔗 {link}\n\nValores sujeitos a confirmação e disponibilidade"
    },
    pacote_completo: {
      nome: "Pacote Completo (Aéreo + Hotel)",
      template: "*Pacote {destino}*\nEmbarque: {dataEmbarque}\nPacote para {passageiros}\n\n*O Pacote Inclui:*\n- Passagem Aérea ida e volta para {destino}\n- Taxas de Embarque\n- Traslado {tipoTraslado}\n{passeios}- {noites} noites de hospedagem no hotel escolhido\n\n✈️ *Voos {companhia}:*\n{dataIda} - {origem} {horaIda} / {destino} {horaChegadaIda} ({tipoVooIda})\n--\n{dataVolta} - {destino} {horaVolta} / {origem} {horaChegadaVolta} ({tipoVooVolta})\n\n{opcoesHoteis}\n\nValores sujeitos a confirmação e disponibilidade"
    },
    cruzeiro: {
      nome: "Cruzeiro",
      template: "🚢 *Cruzeiro {nomeNavio}* – {duracao} noites\n{passageiros}\n📅 Embarque: {dataEmbarque} ({diaSemana})\n📍 Saída e chegada: {porto}\n🌊 Roteiro incrível pelo litoral brasileiro!\n\n💥 Tarifas disponíveis!\n(Sujeita à confirmação de cabine e categoria)\n\n🛏 Opções de Cabines:\n{opcoesCabines}\n\n📎 Link para ver fotos, detalhes e reservar:\n{link}\n\n✅ Inclui: hospedagem a bordo, pensão completa\n🚫 Não inclui: taxas, bebidas, excursões\n\n📲 Me chama pra garantir a sua cabine! 🌴🛳️"
    }
  },
  regras: {
    passageiros: {
      exemplos: ["01 adulto", "02 adultos", "02 adultos + 01 criança", "02 adultos + 01 criança (05 anos)"]
    },
    valores: {
      exemplo: "R$ 1.464,02"
    },
    parcelamento: {
      formato_simples: "{parcelas}x de R$ {valor} s/ juros no cartão"
    },
    reembolso: {
      reembolsavel: "Reembolsável conforme regras do bilhete",
      nao_reembolsavel: "Não reembolsável"
    }
  },
  informacoes_fixas: {
    aviso_valores: "Valores sujeitos a confirmação e disponibilidade"
  }
};

export default async function handler(req, res) {
  console.log('🤖 CVC v5.0 - Requisição recebida');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Tratar OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Status da API
  if (req.method === 'GET') {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    
    return res.status(200).json({
      success: true,
      status: 'online',
      version: '5.0-manual-inline',
      message: 'CVC Itaqua v5.0 - Manual Incorporado',
      manual: {
        versao: manualCVC.versao,
        formatos: Object.keys(manualCVC.formatos).length + ' formatos disponíveis',
        ultima_atualizacao: manualCVC.ultima_atualizacao
      },
      config: {
        openai: hasOpenAI ? 'Configurada ✅' : 'Não configurada ❌',
        anthropic: hasAnthropic ? 'Configurada ✅' : 'Não configurada ❌'
      }
    });
  }
  
  // POST - Processar orçamento
  if (req.method === 'POST') {
    try {
      const { 
        observacoes = '', 
        textoColado = '', 
        destino = '',
        adultos = '',
        criancas = 0,
        tipos = [],
        parcelamento = null,
        imagemBase64 = null,
        pdfContent = null,
        tipo = 'orcamento'
      } = req.body;

      console.log('📋 Dados recebidos:', { 
        temImagem: !!imagemBase64, 
        temPDF: !!pdfContent,
        tipo,
        destino,
        parcelamento 
      });

      // Construir prompt baseado no tipo
      let prompt = '';
      let tipoOrcamento = null;
      
      if (tipo === 'dicas' && destino) {
        prompt = `Gere dicas em português para: ${destino}
        
Use EXATAMENTE este formato:

🌟 **DICAS ${destino.toUpperCase()}**

📍 **Melhor época:**
[época ideal para visitar]

🏖️ **Praias imperdíveis:**
• [praia 1 com breve descrição]
• [praia 2 com breve descrição]
• [praia 3 com breve descrição]

🍽️ **Gastronomia local:**
• [prato típico 1]
• [prato típico 2]
• [restaurante recomendado]

💡 **Dica especial:**
[dica importante ou curiosidade local]

⚠️ **Importante:**
[aviso ou recomendação de segurança]`;
      } 
      else if (tipo === 'ranking' && destino) {
        prompt = `Gere ranking de hotéis para: ${destino}

Use EXATAMENTE este formato:

🏆 **TOP 5 HOTÉIS - ${destino.toUpperCase()}**

**1️⃣ [Nome Hotel Premium]**
⭐⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal - ex: Vista mar, pé na areia]
💰 Diária média: R$ [valor]

**2️⃣ [Nome Hotel]**
⭐⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**3️⃣ [Nome Hotel]**
⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**4️⃣ [Nome Hotel]**
⭐⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque principal]
💰 Diária média: R$ [valor]

**5️⃣ [Nome Hotel]**
⭐⭐⭐ | 📍 [Bairro/Região]
✨ [Destaque - boa relação custo-benefício]
💰 Diária média: R$ [valor]`;
      }
      else {
        // Orçamento normal - usar formatos do manual
        const conteudoPrincipal = observacoes || textoColado || '';
        
        // Detectar tipo de orçamento
        tipoOrcamento = 'aereo_ida_volta_simples'; // default
        
        // Lógica de detecção
        const textoAnalise = conteudoPrincipal.toLowerCase();
        
        if (textoAnalise.includes('somente ida') || textoAnalise.includes('apenas ida')) {
          tipoOrcamento = 'aereo_somente_ida';
        } else if (textoAnalise.includes('opção 1') && textoAnalise.includes('opção 2') && textoAnalise.includes('opção 3')) {
          tipoOrcamento = 'aereo_multiplas_opcoes_3';
        } else if (textoAnalise.includes('opção 1') && textoAnalise.includes('opção 2')) {
          tipoOrcamento = 'aereo_multiplas_opcoes_2';
        } else if (textoAnalise.includes('multitrecho') || textoAnalise.includes('trecho 1')) {
          tipoOrcamento = 'multitrecho';
        } else if (textoAnalise.includes('o pacote inclui') || textoAnalise.includes('noites de hospedagem')) {
          tipoOrcamento = 'pacote_completo';
        } else if (textoAnalise.includes('cruzeiro') || textoAnalise.includes('navio')) {
          tipoOrcamento = 'cruzeiro';
        } else if (textoAnalise.includes('conexão em') && textoAnalise.includes('espera')) {
          tipoOrcamento = 'aereo_ida_volta_conexao_detalhada';
        }
        
        const formatoEscolhido = manualCVC.formatos[tipoOrcamento];
        
        prompt = `IMPORTANTE: Use EXATAMENTE o formato do manual CVC para processar este orçamento.

**DADOS DO CLIENTE:**
${conteudoPrincipal}

${destino ? `Destino adicional informado: ${destino}` : ''}
${adultos ? `Adultos: ${adultos}` : ''}
${criancas > 0 ? `Crianças: ${criancas}` : ''}

**FORMATO DETECTADO:** ${formatoEscolhido.nome}

**REGRAS CRÍTICAS DE FORMATAÇÃO:**

1. TÍTULO: Use sempre "*[Companhia] - [Cidade Origem] ✈ [Cidade Destino]*"
   - Use NOMES DE CIDADES, não códigos de aeroporto
   - Exemplos: "São Paulo ✈ Rio de Janeiro", "Salvador ✈ Porto Alegre"
   - NUNCA: "GRU ✈ SDU" ou "Guarulhos ✈ Santos Dumont"

2. AEROPORTOS: Use nome completo quando relevante
   - Guarulhos, Congonhas, Santos Dumont, Galeão
   - Formato: "29/12 - Guarulhos 12:15 / Santos Dumont 13:15"
   - NUNCA use apenas códigos como GRU, SDU, GIG

3. CONVERSÃO DE CÓDIGOS:
   - GRU = Guarulhos
   - CGH = Congonhas  
   - SDU = Santos Dumont
   - GIG = Galeão
   - VCP = Viracopos
   - BSB = Brasília
   - CNF = Confins
   - GYN = Goiânia
   - SSA = Salvador
   - POA = Porto Alegre

4. FORMATO DE LINHA DE VOO:
   "[Data] - [Aeroporto Origem] [Hora] / [Aeroporto Destino] [Hora] ([tipo voo])"
   Exemplo: "29/12 - Guarulhos 12:15 / Santos Dumont 13:15 (voo direto)"

5. PASSAGEIROS: Use formato "${manualCVC.regras.passageiros.exemplos[1]}"

6. VALORES: Use formato "${manualCVC.regras.valores.exemplo}"

7. REEMBOLSO: Use "${manualCVC.regras.reembolso.nao_reembolsavel}" ou "${manualCVC.regras.reembolso.reembolsavel}"

8. BAGAGEM: 
   - "✅ Só mala de mão incluída" (se incluir)
   - "✅ Não inclui bagagem" (se não incluir)

**PARCELAMENTO:**
${parcelamento ? `INCLUIR parcelamento ${parcelamento} usando formato "${manualCVC.regras.parcelamento.formato_simples}"` : 
  conteudoPrincipal.includes('x de R
      }

      // Definir conteudoPrincipal para todos os casos
      const conteudoPrincipal = observacoes || textoColado || '';
      
      // Escolher modelo baseado na complexidade
      let useClaudeFor = imagemBase64 || pdfContent || 
                          (conteudoPrincipal && conteudoPrincipal.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      console.log(`📋 Formato detectado: ${tipoOrcamento || 'N/A'}`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude para casos complexos
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_KEY) {
          console.warn('⚠️ Claude não configurado, usando GPT como fallback');
          useClaudeFor = false;
        } else {
          try {
            const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': ANTHROPIC_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [{
                  role: 'user',
                  content: imagemBase64 ? [
                    { type: 'text', text: prompt },
                    { 
                      type: 'image', 
                      source: {
                        type: 'base64',
                        media_type: 'image/jpeg',
                        data: imagemBase64.split(',')[1]
                      }
                    }
                  ] : prompt
                }]
              })
            });

            if (claudeResponse.ok) {
              const claudeData = await claudeResponse.json();
              resultado = claudeData.content[0].text;
            } else {
              const error = await claudeResponse.text();
              console.error('❌ Erro Claude, usando GPT:', error);
              useClaudeFor = false;
            }
          } catch (error) {
            console.error('❌ Erro ao chamar Claude, usando GPT:', error);
            useClaudeFor = false;
          }
        }
      } 
      
      if (!useClaudeFor) {
        // Usar GPT-4o-mini
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada. Verifique OPENAI_API_KEY no Vercel.');
        }
        
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!gptResponse.ok) {
          const error = await gptResponse.text();
          console.error('❌ Erro GPT:', error);
          throw new Error('Erro ao processar com GPT: ' + error);
        }

        const gptData = await gptResponse.json();
        resultado = gptData.choices[0].message.content;
      }

      console.log('✅ Processamento concluído');
      
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini',
        formato_usado: tipoOrcamento || tipo
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar orçamento',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    error: 'Método não suportado'
  });
}) || conteudoPrincipal.includes('parcelamento') ? 
  'MANTER o parcelamento que está no texto original' : 
  'NÃO INCLUIR parcelamento (não foi solicitado)'}

**TEMPLATE EXATO A SEGUIR:**
${formatoEscolhido.template}

**REGRA FINAL:**
- Termine SEMPRE com: "Valores sujeitos a confirmação e disponibilidade"
- NÃO adicione WhatsApp, telefone ou validade
- Use APENAS os dados fornecidos no texto`;
      }

      // Definir conteudoPrincipal para todos os casos
      const conteudoPrincipal = observacoes || textoColado || '';
      
      // Escolher modelo baseado na complexidade
      let useClaudeFor = imagemBase64 || pdfContent || 
                          (conteudoPrincipal && conteudoPrincipal.length > 500);
      
      console.log(`🤖 Usando: ${useClaudeFor ? 'Claude' : 'GPT-4o-mini'}`);
      console.log(`📋 Formato detectado: ${tipoOrcamento || 'N/A'}`);
      
      let resultado = '';
      
      if (useClaudeFor) {
        // Usar Claude para casos complexos
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_KEY) {
          console.warn('⚠️ Claude não configurado, usando GPT como fallback');
          useClaudeFor = false;
        } else {
          try {
            const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': ANTHROPIC_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [{
                  role: 'user',
                  content: imagemBase64 ? [
                    { type: 'text', text: prompt },
                    { 
                      type: 'image', 
                      source: {
                        type: 'base64',
                        media_type: 'image/jpeg',
                        data: imagemBase64.split(',')[1]
                      }
                    }
                  ] : prompt
                }]
              })
            });

            if (claudeResponse.ok) {
              const claudeData = await claudeResponse.json();
              resultado = claudeData.content[0].text;
            } else {
              const error = await claudeResponse.text();
              console.error('❌ Erro Claude, usando GPT:', error);
              useClaudeFor = false;
            }
          } catch (error) {
            console.error('❌ Erro ao chamar Claude, usando GPT:', error);
            useClaudeFor = false;
          }
        }
      } 
      
      if (!useClaudeFor) {
        // Usar GPT-4o-mini
        const OPENAI_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_KEY) {
          throw new Error('OpenAI API key não configurada. Verifique OPENAI_API_KEY no Vercel.');
        }
        
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!gptResponse.ok) {
          const error = await gptResponse.text();
          console.error('❌ Erro GPT:', error);
          throw new Error('Erro ao processar com GPT: ' + error);
        }

        const gptData = await gptResponse.json();
        resultado = gptData.choices[0].message.content;
      }

      console.log('✅ Processamento concluído');
      
      return res.status(200).json({
        success: true,
        result: resultado,
        model: useClaudeFor ? 'claude' : 'gpt-4o-mini',
        formato_usado: tipoOrcamento || tipo
      });

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar orçamento',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // Método não suportado
  return res.status(405).json({
    success: false,
    error: 'Método não suportado'
  });
}
