// ================================================================================
// 🌍 FUNÇÃO MELHORADA - GERAR DICAS DO DESTINO AUTOMATICAMENTE
// ================================================================================
// Extrai destino do orçamento gerado + informações de crianças para dicas personalizadas

/**
 * Gera dicas do destino automaticamente baseado no orçamento já criado
 */
async function gerarDicasDestino() {
  const btnGerar = document.getElementById('btnGerarDicas');
  const btnCopiar = document.getElementById('btnCopiarDicas');
  
  if (!btnGerar) {
    console.error('❌ Botão gerar dicas não encontrado');
    return;
  }
  
  try {
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Analisando orçamento...';
    
    // ================================================================================
    // 🎯 EXTRAIR INFORMAÇÕES DO ORÇAMENTO GERADO
    // ================================================================================
    
    const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
    const destinoManual = document.getElementById('destino')?.value?.trim() || '';
    
    if (!orcamentoTexto || orcamentoTexto === 'Preencha o formulário acima para gerar o orçamento...') {
      throw new Error('Gere um orçamento primeiro para extrair as informações do destino!');
    }
    
    console.log('🔍 Extraindo informações do orçamento gerado...');
    
    // ================================================================================
    // 🌍 EXTRAÇÃO INTELIGENTE DE DESTINO
    // ================================================================================
    
    let destinoDetectado = destinoManual; // Prioridade para destino manual
    
    if (!destinoDetectado) {
      // Procurar por padrões de destino no orçamento
      const padroes = [
        /📍\s*([^🗓\n]+)/i,  // 📍 Orlando - Flórida
        /🌍\s*([^🗓\n]+)/i,  // 🌍 Paris
        /destino[:\s]*([^🗓\n]+)/i,
        /.*?-\s*([A-Za-zÀ-ÿ\s,.-]+?)(?:\n|🗓)/i // Linha com destino antes de data
      ];
      
      for (const padrao of padroes) {
        const match = orcamentoTexto.match(padrao);
        if (match && match[1]) {
          destinoDetectado = match[1].trim();
          console.log(`✅ Destino detectado: "${destinoDetectado}"`);
          break;
        }
      }
    }
    
    if (!destinoDetectado) {
      throw new Error('Não foi possível detectar o destino. Informe o destino no campo "Destino" e tente novamente.');
    }
    
    // ================================================================================
    // 📅 EXTRAÇÃO DE PERÍODO/DATAS
    // ================================================================================
    
    let periodoDetectado = '';
    const padroesDatas = [
      /🗓️\s*([^👥\n]+)/i, // 🗓️ 05 de mar - 15 de mar
      /(\d{1,2}\s+de\s+\w+\s*-\s*\d{1,2}\s+de\s+\w+)/i, // 05 de mar - 15 de mar
      /(\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2})/i // 05/03 - 15/03
    ];
    
    for (const padrao of padroesDatas) {
      const match = orcamentoTexto.match(padrao);
      if (match && match[1]) {
        periodoDetectado = match[1].trim();
        console.log(`📅 Período detectado: "${periodoDetectado}"`);
        break;
      }
    }
    
    // ================================================================================
    // 👶 EXTRAÇÃO DE INFORMAÇÕES DE CRIANÇAS
    // ================================================================================
    
    let temCriancas = false;
    let idadesCriancas = [];
    
    // Verificar no formulário primeiro
    const criancasFormulario = parseInt(document.getElementById('criancas')?.value) || 0;
    if (criancasFormulario > 0) {
      temCriancas = true;
      for (let i = 1; i <= criancasFormulario; i++) {
        const idadeInput = document.getElementById(`idade_crianca_${i}`);
        if (idadeInput && idadeInput.value) {
          idadesCriancas.push(parseInt(idadeInput.value));
        }
      }
    }
    
    // Se não encontrou no formulário, procurar no orçamento
    if (!temCriancas) {
      const padroesCriancas = [
        /(\d+)\s*crian[çc]as?\s*\(([^)]+)\)/i, // 2 crianças (02 e 04 anos)
        /👶\s*(\d+)/i, // 👶 2
        /crian[çc]as?[:\s]*(\d+)/i
      ];
      
      for (const padrao of padroesCriancas) {
        const match = orcamentoTexto.match(padrao);
        if (match && match[1] && parseInt(match[1]) > 0) {
          temCriancas = true;
          if (match[2]) {
            // Extrair idades: "02 e 04 anos" -> [2, 4]
            const idades = match[2].match(/\d+/g);
            if (idades) {
              idadesCriancas = idades.map(idade => parseInt(idade));
            }
          }
          console.log(`👶 Crianças detectadas: ${match[1]}, idades: ${idadesCriancas.join(', ')}`);
          break;
        }
      }
    }
    
    // ================================================================================
    // 🏨 VERIFICAR SE É PACOTE COM HOTEL
    // ================================================================================
    
    const tipos = Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(el => el.value);
    const temHotel = tipos.includes('Hotel') || orcamentoTexto.toLowerCase().includes('hotel') || orcamentoTexto.toLowerCase().includes('hospedagem');
    
    // ================================================================================
    // 🤖 GERAR PROMPT PERSONALIZADO PARA DICAS
    // ================================================================================
    
    btnGerar.innerHTML = '🌍 Gerando dicas personalizadas...';
    
    let prompt = `Crie dicas de viagem personalizadas para ${destinoDetectado} para envio via WhatsApp da CVC.

INFORMAÇÕES DA VIAGEM:
- Destino: ${destinoDetectado}`;

    if (periodoDetectado) {
      prompt += `\n- Período: ${periodoDetectado}`;
    }

    if (temCriancas) {
      prompt += `\n- Viajam com ${idadesCriancas.length || 'crianças'}`;
      if (idadesCriancas.length > 0) {
        prompt += ` (idades: ${idadesCriancas.join(' e ')} anos)`;
      }
    }

    if (temHotel) {
      prompt += `\n- Pacote inclui hospedagem`;
    }

    prompt += `

FORMATO DAS DICAS:
🌟 **Dicas para ${destinoDetectado}**

🗓️ **Melhor época:** [Baseado no período informado ou época geral]

🌤️ **Clima e bagagem:** [Temperatura esperada e o que levar]

🎯 **Principais atrações:**
• [Atração 1 - breve descrição]
• [Atração 2 - breve descrição]
• [Atração 3 - breve descrição]`;

    if (temCriancas) {
      prompt += `

👶 **Com crianças:**
• [Atividade família-friendly 1]
• [Atividade família-friendly 2]`;
    }

    prompt += `

💡 **Dicas práticas:**
• Moeda: [moeda local]
• Documentação: [passaporte/RG]
• Fuso horário: [diferença do Brasil]
• Idioma: [idioma local]

🍽️ **Gastronomia:** [1-2 pratos típicos imperdíveis]

⚠️ **Importante:** [1 dica essencial de segurança ou cultural]

INSTRUÇÕES:
- Máximo 300 palavras
- Tom amigável e vendedor
- Use emojis para deixar atrativo
- Informações práticas e úteis
- Baseie-se no período da viagem se informado
- Se há crianças, priorize atividades familiares
- Não invente informações específicas sobre preços ou horários`;

    // ================================================================================
    // 🔗 CHAMAR A IA PARA GERAR AS DICAS
    // ================================================================================
    
    console.log('🤖 Enviando prompt para IA:', prompt.substring(0, 100) + '...');
    
    // Usar o sistema de IA existente
    const response = await chamarIAParaDicas(prompt, 'destino', { 
      destino: destinoDetectado,
      temCriancas: temCriancas,
      periodo: periodoDetectado
    });
    
    // ================================================================================
    // ✅ EXIBIR RESULTADO E HABILITAR BOTÃO COPIAR
    // ================================================================================
    
    document.getElementById('destinoIA').innerText = response;
    
    // Mostrar botão copiar
    if (btnCopiar) {
      btnCopiar.style.display = 'inline-block';
    }
    
    console.log('✅ Dicas geradas automaticamente:', {
      destino: destinoDetectado,
      periodo: periodoDetectado || 'não detectado',
      criancas: temCriancas ? `${idadesCriancas.length} crianças` : 'sem crianças',
      hotel: temHotel ? 'com hotel' : 'sem hotel',
      tamanho: response.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar dicas:', error);
    document.getElementById('destinoIA').innerText = `❌ Erro: ${error.message}`;
    
    // Esconder botão copiar se houver erro
    const btnCopiar = document.getElementById('btnCopiarDicas');
    if (btnCopiar) {
      btnCopiar.style.display = 'none';
    }
    
  } finally {
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🎯 Gerar Dicas';
  }
}

// ================================================================================
// 🏨 FUNÇÃO MELHORADA - GERAR RANKING DE HOTÉIS
// ================================================================================

async function gerarRankingHoteis() {
  const btnGerar = document.getElementById('btnGerarRanking');
  const btnCopiar = document.getElementById('btnCopiarRanking');
  
  if (!btnGerar) {
    console.error('❌ Botão gerar ranking não encontrado');
    return;
  }
  
  try {
    btnGerar.disabled = true;
    btnGerar.innerHTML = '🤖 Analisando destino...';
    
    // ================================================================================
    // 🎯 EXTRAIR DESTINO DO ORÇAMENTO OU FORMULÁRIO
    // ================================================================================
    
    const orcamentoTexto = document.getElementById('orcamentoIA')?.innerText || '';
    const destinoManual = document.getElementById('destino')?.value?.trim() || '';
    
    let destinoDetectado = destinoManual;
    
    // Se não foi informado manualmente, extrair do orçamento
    if (!destinoDetectado && orcamentoTexto && orcamentoTexto !== 'Preencha o formulário acima para gerar o orçamento...') {
      const padroes = [
        /📍\s*([^🗓\n]+)/i,
        /🌍\s*([^🗓\n]+)/i,
        /destino[:\s]*([^🗓\n]+)/i,
        /.*?-\s*([A-Za-zÀ-ÿ\s,.-]+?)(?:\n|🗓)/i
      ];
      
      for (const padrao of padroes) {
        const match = orcamentoTexto.match(padrao);
        if (match && match[1]) {
          destinoDetectado = match[1].trim();
          console.log(`🏨 Destino detectado para ranking: "${destinoDetectado}"`);
          break;
        }
      }
    }
    
    if (!destinoDetectado) {
      throw new Error('Informe o destino no campo "Destino" ou gere um orçamento primeiro para detectar automaticamente.');
    }
    
    // ================================================================================
    // 👥 EXTRAIR INFORMAÇÕES DOS HÓSPEDES
    // ================================================================================
    
    const adultos = parseInt(document.getElementById('adultos')?.value) || 2;
    const criancas = parseInt(document.getElementById('criancas')?.value) || 0;
    
    let idadesCriancas = [];
    if (criancas > 0) {
      for (let i = 1; i <= criancas; i++) {
        const idadeInput = document.getElementById(`idade_crianca_${i}`);
        if (idadeInput && idadeInput.value) {
          idadesCriancas.push(parseInt(idadeInput.value));
        }
      }
    }
    
    // ================================================================================
    // 🤖 GERAR PROMPT PARA RANKING
    // ================================================================================
    
    btnGerar.innerHTML = '🏆 Gerando ranking...';
    
    let prompt = `Crie um ranking detalhado dos 5 melhores hotéis em ${destinoDetectado} para envio via WhatsApp.

INFORMAÇÕES DOS HÓSPEDES:
- ${adultos} adulto${adultos > 1 ? 's' : ''}`;

    if (criancas > 0) {
      prompt += `\n- ${criancas} criança${criancas > 1 ? 's' : ''}`;
      if (idadesCriancas.length > 0) {
        prompt += ` (${idadesCriancas.join(' e ')} anos)`;
      }
    }

    prompt += `

FORMATO OBRIGATÓRIO:
Para facilitar a escolha do seu hotel, fizemos um ranking detalhado sobre os hotéis de ${destinoDetectado}:

1️⃣ - [Nome do Hotel]
📍 Localização: [Descrição da localização]
🛏 Tipo de quarto: [Categoria do quarto]
🍽 Serviço: [Café da manhã/meia pensão/etc]
⭐ Notas: TripAdvisor: X,X/5 | Booking.com: X,X/10 | Google: X,X/5
✅ Ponto positivo: [Destacar os melhores aspectos - design, localização, café da manhã elogiado, etc.]
⚠️ Atenção: [APENAS se for hotel simples/econômico: "Este é um hotel de categoria econômica, é um meio de hospedagem simples." - NUNCA fale mal do hotel]
📍 Distâncias a pé:
[Principal ponto turístico]: X m (~X min)
[Centro/ponto importante]: X,X km (~X min)

2️⃣ - [Repetir formato para hotel 2]
[etc...]

INSTRUÇÕES IMPORTANTES:
- Use informações realistas sobre hotéis reais de ${destinoDetectado}
- Notas devem ser coerentes (TripAdvisor até 5, Booking até 10, Google até 5)
- NUNCA critique negativamente os hotéis
- Para hotéis simples, use apenas "categoria econômica" ou "meio de hospedagem simples"
- Destaque pontos positivos genuínos (localização, café, design, atendimento)
- Inclua distâncias reais para pontos turísticos principais
- Considere que é para ${adultos} adulto${adultos > 1 ? 's' : ''}${criancas > 0 ? ` e ${criancas} criança${criancas > 1 ? 's' : ''}` : ''}
- Máximo 400 palavras total`;

    // ================================================================================
    // 🔗 CHAMAR A IA
    // ================================================================================
    
    console.log('🏨 Gerando ranking para:', destinoDetectado);
    
    const response = await chamarIAParaDicas(prompt, 'ranking', { 
      destino: destinoDetectado,
      adultos: adultos,
      criancas: criancas
    });
    
    // ================================================================================
    // ✅ EXIBIR RESULTADO
    // ================================================================================
    
    document.getElementById('rankingIA').innerText = response;
    
    // Mostrar botão copiar
    if (btnCopiar) {
      btnCopiar.style.display = 'inline-block';
    }
    
    console.log('✅ Ranking gerado:', {
      destino: destinoDetectado,
      hospedes: `${adultos} adultos, ${criancas} crianças`,
      tamanho: response.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar ranking:', error);
    document.getElementById('rankingIA').innerText = `❌ Erro: ${error.message}`;
    
    // Esconder botão copiar se houver erro
    const btnCopiar = document.getElementById('btnCopiarRanking');
    if (btnCopiar) {
      btnCopiar.style.display = 'none';
    }
    
  } finally {
    btnGerar.disabled = false;
    btnGerar.innerHTML = '🏆 Gerar Ranking';
  }
}

// ================================================================================
// 🔧 FUNÇÃO AUXILIAR PARA CHAMAR A IA (compatibilidade com sistema existente)
// ================================================================================

/**
 * Chama a API de IA usando o sistema existente
 */
async function chamarIAParaDicas(prompt, tipo, extraData = {}) {
  try {
    // Verificar se existe a função callAICorrigida (sistema mais novo)
    if (typeof callAICorrigida === 'function') {
      const formData = {
        tipos: [tipo === 'destino' ? 'Destino' : 'Hotel'],
        destino: extraData.destino || '',
        observacoes: prompt,
        textoColado: '',
        temImagem: false,
        parcelamento: { incluirParcelamento: false }
      };
      
      const analise = {
        multiplasOpcoes: false,
        temEscalas: false,
        tipoViagem: tipo === 'destino' ? 'destino' : 'hotel'
      };
      
      const response = await callAICorrigida(formData, analise);
      return response.choices[0].message.content;
      
    } else if (typeof callAI === 'function') {
      // Fallback para sistema antigo
      return await callAI(prompt, tipo, extraData);
      
    } else {
      // Fallback direto para API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          tipo: tipo,
          destino: extraData.destino,
          temCriancas: extraData.temCriancas,
          periodo: extraData.periodo,
          adultos: extraData.adultos,
          criancas: extraData.criancas
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success || !data.choices?.[0]?.message?.content) {
        throw new Error(data.error?.message || 'Erro na resposta da API');
      }
      
      return data.choices[0].message.content;
    }
    
  } catch (error) {
    console.error('❌ Erro ao chamar IA:', error);
    throw new Error(`Falha na comunicação com IA: ${error.message}`);
  }
}

// ================================================================================
// 🎯 INTEGRAÇÃO COM CHECKBOXES - HABILITAR RANKING QUANDO HOTEL SELECIONADO
// ================================================================================

// Adicionar event listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que outros scripts carregaram
  setTimeout(() => {
    console.log('🔧 Configurando event listeners para checkboxes...');
    
    // Escutar mudanças nos checkboxes de tipo
    const checkboxesTipo = document.querySelectorAll('input[name="tipo"]');
    if (checkboxesTipo.length > 0) {
      checkboxesTipo.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const btnRanking = document.getElementById('btnGerarRanking');
          if (btnRanking) {
            const tipos = Array.from(document.querySelectorAll('input[name="tipo"]:checked')).map(el => el.value);
            const temHotel = tipos.includes('Hotel');
            
            if (temHotel) {
              btnRanking.disabled = false;
              btnRanking.title = 'Gerar ranking baseado no destino';
              console.log('✅ Botão ranking habilitado');
            } else {
              btnRanking.disabled = true;
              btnRanking.title = 'Selecione "Hotel" primeiro';
            }
          }
        });
      });
      console.log(`✅ Event listeners configurados para ${checkboxesTipo.length} checkboxes`);
    } else {
      console.warn('⚠️ Checkboxes de tipo não encontrados');
    }
  }, 1000);
});

// ================================================================================
// 🔧 MELHORAR A FUNÇÃO HABILITAR BOTÃO DICAS EXISTENTE
// ================================================================================

// Substituir a função habilitarBotaoDicas existente
function habilitarBotaoDicas() {
  const btnGerar = document.getElementById('btnGerarDicas');
  if (btnGerar) {
    btnGerar.disabled = false;
    btnGerar.title = 'Gerar dicas baseadas no orçamento criado - Extração automática ativa';
    console.log('✅ Botão dicas habilitado - Sistema de extração automática pronto');
  }
}

// ================================================================================
// 🚀 LOG DE INICIALIZAÇÃO
// ================================================================================

console.log('🌍 Sistema de Dicas e Ranking Melhorado Carregado!');
console.log('✨ Funcionalidades:');
console.log('   🎯 Extração automática de destino do orçamento');
console.log('   📅 Detecção automática de período da viagem');
console.log('   👶 Detecção de crianças para dicas família-friendly');
console.log('   🏨 Ranking de hotéis com formato específico');
console.log('   📋 Botões "Copiar" dinâmicos');
console.log('   🔗 Compatibilidade com sistema existente');
console.log('🚀 Pronto para uso!');
