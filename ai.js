const OPENAI_API_KEY = "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";

document.getElementById("orcamentoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const destino = form.destino.value;
  const adultos = form.adultos.value;
  const criancas = form.criancas.value;
  const idades = form.idades_criancas.value;
  const observacoes = form.observacoes.value;
  const tiposSelecionados = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value);
  const tipos = tiposSelecionados.join(", ");

  let prompt = "";

  if (tiposSelecionados.includes("Aéreo Facial")) {
    prompt = `Você é uma atendente da CVC. Monte um orçamento para WhatsApp com base nas informações abaixo, utilizando formatação clara, emojis e estilo direto, como os modelos usados na loja CVC Itaqua.

Dados:
Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas} (idades: ${idades})
Serviços: ${tipos}
Observações: ${observacoes}

Caso haja imagem anexa, analise se são múltiplos voos e quais as cias, horários, tarifas e bagagens incluídas. Combine isso com os links de pagamento, se houverem.

Formato esperado:

🛫 *Passagem Aérea*

1️⃣ ✈️ Cia Aérea
📅 Data - Origem (Sigla) / Destino (Sigla)
⏱️ Duração / Tipo de voo
💼 Tipo de tarifa (facial, bagagem, etc)
💰 Valor total com taxas
💳 Condição de pagamento (parcelamento)
🔗 Link do orçamento

Finalize com a seguinte mensagem:
✨ *Importante:*
Valores sujeitos a alteração e disponibilidade!
A melhor forma de garantir o preço é efetuando a compra.
Você pode usar o link que enviamos — é simples, rápido e seguro! Ou, se preferir, chama a gente por aqui que te ajudamos com a compra 💛`;
  } else {
    document.getElementById("orcamentoIA").innerText = "⛔ Tipo de orçamento ainda não implementado.";
    return;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const json = await res.json();
    const reply = json.choices[0].message.content;

    document.getElementById("orcamentoIA").innerText = reply;
  } catch (err) {
    document.getElementById("orcamentoIA").innerText = "❌ Erro ao conectar com a IA.";
    console.error(err);
  }
});

