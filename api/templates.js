// /api/templates.js - Templates para diferentes tipos de orçamento CVC

export const templates = {
  
  // ✈️ AÉREO FACIAL
  'Aéreo Facial': `*Passagem Aérea*
[COMPANHIA_AEREA] 
[DATA_IDA] - [CIDADE_ORIGEM] [HORA_SAIDA] / [CIDADE_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [CIDADE_DESTINO] [HORA_SAIDA_VOLTA] / [CIDADE_ORIGEM] [HORA_CHEGADA_VOLTA]

💰 R$ [VALOR_POR_PESSOA] por pessoa, taxas inclusas
💳 Pagamento em até [QTDE_PARCELAS]x de R$ [VALOR_PARCELA] s/ juros
🔗 [LINK_COMPRA]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra. Pode usar o link que enviamos mesmo, é bem simples e seguro, ou pode chamar a gente que te ajudamos com a compra.`,


// Adicionar ao templates.js

// ✈️ AÉREO MÚLTIPLAS OPÇÕES
'Aéreo Múltiplas Opções': `*Passagens Aéreas - Opções Disponíveis*
🇵🇹 [COMPANHIA_AEREA]

📋 *OPÇÃO 1:*
🗓️ [DATA_IDA_1] a [DATA_VOLTA_1] ([DURACAO_1])
✈️ Ida: [DATA_IDA_1] - [ORIGEM] [HORA_IDA_1] / [DESTINO] [HORA_CHEGADA_1]
✈️ Volta: [DATA_VOLTA_1] - [DESTINO] [HORA_SAIDA_VOLTA_1] / [ORIGEM] [HORA_CHEGADA_VOLTA_1]
💰 R$ [VALOR_TOTAL_1] para [QTDE_PASSAGEIROS] pessoas
💳 [VALOR_POR_PESSOA_1] por pessoa
🔗 [LINK_1]

📋 *OPÇÃO 2:*
🗓️ [DATA_IDA_2] a [DATA_VOLTA_2] ([DURACAO_2])
✈️ Ida: [DATA_IDA_2] - [ORIGEM] [HORA_IDA_2] / [DESTINO] [HORA_CHEGADA_2]
✈️ Volta: [DATA_VOLTA_2] - [DESTINO] [HORA_SAIDA_VOLTA_2] / [ORIGEM] [HORA_CHEGADA_VOLTA_2]
💰 R$ [VALOR_TOTAL_2] para [QTDE_PASSAGEIROS] pessoas
💳 [VALOR_POR_PESSOA_2] por pessoa
🔗 [LINK_2]

📋 *OPÇÃO 3:*
🗓️ [DATA_IDA_3] a [DATA_VOLTA_3] ([DURACAO_3])
✈️ Ida: [DATA_IDA_3] - [ORIGEM] [HORA_IDA_3] / [DESTINO] [HORA_CHEGADA_3]
✈️ Volta: [DATA_VOLTA_3] - [DESTINO] [HORA_SAIDA_VOLTA_3] / [ORIGEM] [HORA_CHEGADA_VOLTA_3]
💰 R$ [VALOR_TOTAL_3] para [QTDE_PASSAGEIROS] pessoas
💳 [VALOR_POR_PESSOA_3] por pessoa
🔗 [LINK_3]

⚠️ Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra. Pode usar qualquer link que enviamos, é bem simples e seguro, ou pode chamar a gente que te ajudamos com a compra.

📞 Dúvidas? Estamos aqui para ajudar você a escolher a melhor opção!`,

  
  // ✈️ AÉREO VBI/FÁCIL  
  'Aéreo VBI/Fácil': `*Passagem Aérea VBI - Venda Bem Informada*
[COMPANHIA_AEREA]
[DATA_IDA] - [CIDADE_ORIGEM] [HORA_SAIDA] / [CIDADE_DESTINO] [HORA_CHEGADA]
[DATA_VOLTA] - [CIDADE_DESTINO] [HORA_SAIDA_VOLTA] / [CIDADE_ORIGEM] [HORA_CHEGADA_VOLTA]

✅ *O que inclui:*
• Taxas de embarque
• Bagagem de mão [PESO_BAGAGEM_MAO]kg
• Item pessoal
• [OUTROS_INCLUSOS]

💰 R$ [VALOR_TOTAL] para [QTDE_PASSAGEIROS] passageiros
💳 Parcelamento: até [QTDE_PARCELAS]x no cartão de crédito

📋 *Documentação necessária:*
• RG ou CNH dentro da validade
• [DOCUMENTOS_ADICIONAIS]

🔗 Link para compra: [LINK_COMPRA]

⚠️ Preços sujeitos à disponibilidade. Garantimos o valor apenas na finalização da compra.`,

  // 📦 FRETE
  'Frete': `*Frete Aéreo*
✈️ [CIDADE_ORIGEM] → [CIDADE_DESTINO]
📦 Até [PESO_LIMITE]kg por pessoa

💰 R$ [VALOR_FRETE] por pessoa
📅 Envio: [DATA_ENVIO]
📅 Entrega prevista: [DATA_ENTREGA_PREVISTA]

📋 *Documentação necessária:*
• Nota fiscal dos produtos
• Lista detalhada dos itens
• Documento do remetente

🚫 *Itens não permitidos:*
• Líquidos e aerossóis
• Produtos perecíveis
• Itens de valor superior a R$ [VALOR_LIMITE]

📞 Dúvidas sobre o frete? É só chamar a gente!`,

  // 🏨 HOTEL
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

🌟 *Destaques do hotel:*
• [DESTAQUE_1]
• [DESTAQUE_2]
• [DESTAQUE_3]

🔗 [LINK_RESERVA]

⚠️ Tarifas sujeitas à disponibilidade no momento da reserva.`,

  // 🚢 CRUZEIRO
  'Cruzeiro': `*Cruzeiro Marítimo*
🚢 [COMPANHIA_CRUZEIRO] - [NOME_NAVIO]
🗓️ [DATA_EMBARQUE] a [DATA_DESEMBARQUE] ([QTDE_NOITES_CRUZEIRO] noites)
🌊 *Itinerário:* [ROTA_CRUZEIRO]

🛏️ *Cabine:*
[CATEGORIA_CABINE] para [QTDE_PASSAGEIROS_CRUZEIRO] pessoas

✅ *Incluso no cruzeiro:*
• Todas as refeições principais
• Entretenimento a bordo
• [ATIVIDADES_INCLUSAS]
• [SERVICOS_CABINE]

💰 R$ [VALOR_POR_PESSOA_CRUZEIRO] por pessoa
💳 Entrada R$ [VALOR_ENTRADA] + [PARCELAS_CRUZEIRO]x de R$ [VALOR_PARCELA_CRUZEIRO]

🏖️ *Destinos do roteiro:*
[PORTOS_PARADA]

⚠️ Documentação: [DOCUMENTOS_CRUZEIRO]
🔗 [LINK_RESERVA_CRUZEIRO]`,

  // 🚗 CARRO
  'Carro': `*Aluguel de Veículo*
🚗 [CATEGORIA_VEICULO] - [MODELO_EXEMPLO]
📍 Retirada: [LOCAL_RETIRADA]
📍 Devolução: [LOCAL_DEVOLUCAO]
🗓️ [DATA_RETIRADA] às [HORA_RETIRADA] até [DATA_DEVOLUCAO] às [HORA_DEVOLUCAO]

✅ *Inclui:*
• Ar condicionado
• Direção hidráulica
• [QUILOMETRAGEM] inclusos
• Seguro básico obrigatório

💰 R$ [VALOR_TOTAL_CARRO] para [QTDE_DIAS_ALUGUEL] dias
💳 Sinal: R$ [VALOR_SINAL] + saldo na retirada

📋 *Documentação obrigatória:*
• CNH válida (mínimo 2 anos)
• Cartão de crédito para caução
• RG ou Passaporte

⚠️ Idade mínima: [IDADE_MINIMA] anos
🔗 [LINK_RESERVA_CARRO]`,

  // 🚌 TRASLADO
  'Traslado': `*Traslado*
🚌 [ORIGEM_TRASLADO] ↔ [DESTINO_TRASLADO]
🗓️ [DATA_IDA_TRASLADO] e [DATA_VOLTA_TRASLADO]
👥 [QTDE_PASSAGEIROS_TRASLADO] passageiros

🚐 *Veículo:*
[TIPO_VEICULO_TRASLADO] com ar condicionado

✅ *Serviço inclui:*
• Transfer ida e volta
• Motorista experiente
• Atendimento em português
• [SERVICOS_EXTRAS]

💰 R$ [VALOR_TOTAL_TRASLADO] para todo o grupo
💳 Pagamento: [FORMA_PAGAMENTO_TRASLADO]

⏰ *Horários programados:*
Ida: [HORARIO_IDA_TRASLADO]
Volta: [HORARIO_VOLTA_TRASLADO]

📞 Contato do motorista será enviado 24h antes da viagem`,

  // 🎢 PASSEIOS
  'Passeios': `*Passeio/Tour*
🎢 [NOME_PASSEIO]
🗓️ [DATA_PASSEIO]
⏰ [HORARIO_INICIO_PASSEIO] às [HORARIO_FIM_PASSEIO]
👥 [QTDE_PESSOAS_PASSEIO] pessoas

🗺️ *Roteiro incluído:*
[ROTEIRO_DETALHADO]

✅ *O passeio inclui:*
• Transporte de ida e volta
• Guia acompanhante em português
• [INGRESSOS_INCLUSOS]
• [REFEICAO_INCLUSA]

💰 R$ [VALOR_POR_PESSOA_PASSEIO] por pessoa (adulto)
👶 Crianças [FAIXA_ETARIA]: R$ [VALOR_CRIANCA_PASSEIO]

📋 *Recomendações:*
• Protetor solar e chapéu
• Roupa confortável e tênis
• [ITENS_RECOMENDADOS]

🔗 [LINK_RESERVA_PASSEIO]`,

  // 🛡️ SEGURO
  'Seguro': `*Seguro Viagem*
🛡️ [SEGURADORA] - Plano [NOME_PLANO]
🌍 Cobertura: [REGIAO_COBERTURA]
🗓️ [DATA_INICIO_SEGURO] a [DATA_FIM_SEGURO]
👥 [QTDE_SEGURADOS] segurados

💊 *Principais coberturas:*
• Despesas médicas: até R$ [VALOR_DMH]
• Bagagem extraviada: até R$ [VALOR_BAGAGEM]
• Cancelamento de viagem: até R$ [VALOR_CANCELAMENTO]
• [COBERTURAS_EXTRAS]

💰 R$ [VALOR_TOTAL_SEGURO] para todo o grupo
💳 À vista com desconto ou [PARCELAS_SEGURO]x no cartão

⚠️ *Importante saber:*
• Válido para emergências médicas
• Central de atendimento 24h em português
• [OBSERVACOES_SEGURO]

🔗 [LINK_CONTRATACAO_SEGURO]`,

  // 🗺️ CIRCUITO
  'Circuito': `*Circuito/Pacote Completo*
🗺️ [NOME_CIRCUITO]
📍 [DESTINOS_CIRCUITO]
🗓️ [DATA_INICIO_CIRCUITO] a [DATA_FIM_CIRCUITO] ([QTDE_DIAS_CIRCUITO] dias)
👥 [QTDE_PASSAGEIROS_CIRCUITO] passageiros

✈️ *O pacote completo inclui:*
• Passagens aéreas ida e volta
• [QTDE_NOITES_CIRCUITO] noites de hospedagem
• Café da manhã todos os dias
• Traslados aeroporto/hotel
• [PASSEIOS_INCLUSOS_CIRCUITO]
• Seguro viagem internacional
• Guia acompanhante em português

🏨 *Hotéis programados:*
[LISTA_HOTEIS_CIRCUITO]

💰 R$ [VALOR_POR_PESSOA_CIRCUITO] por pessoa em apartamento duplo
💳 Entrada R$ [ENTRADA_CIRCUITO] + [PARCELAS_CIRCUITO]x de R$ [VALOR_PARCELA_CIRCUITO]

📋 *Documentação obrigatória:*
• [DOCUMENTOS_CIRCUITO]

🔗 [LINK_DETALHES_CIRCUITO]

⚠️ Valores por pessoa em apartamento duplo. Consulte suplemento single.`,

  // 📄 TEMPLATE PADRÃO (fallback)
  'default': `*Orçamento CVC Itaqua*
📍 Destino: [DESTINO]
🗓️ Período: [PERIODO_VIAGEM]
👥 Passageiros: [PASSAGEIROS]

💰 Valor: R$ [VALOR_ORCAMENTO]
💳 Formas de pagamento: [OPCOES_PAGAMENTO]

📋 *Serviços inclusos:*
[SERVICOS_DETALHADOS]

🔗 Link para mais informações: [LINK_INFORMACOES]

⚠️ Valores sujeitos a alteração conforme disponibilidade no momento da reserva.

📞 CVC Itaqua - Filial 6220
Estamos aqui para ajudar você a realizar essa viagem!`
};



