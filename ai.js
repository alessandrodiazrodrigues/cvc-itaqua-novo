const OPENAI_API_KEY = "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";

document.getElementById("orcamentoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const destino = form.destino.value;
  const adultos = form.adultos.value;
  const criancas = form.criancas.value;
  const idades = form.idades_criancas.value;
  const observacoes = form.observacoes.value;
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value).join(", ");

  const prompt = `
Você é uma atendente da CVC. Formate um orçamento para WhatsApp baseado nos dados abaixo, seguindo o padrão da loja CVC Itaqua:

Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas} (idades: ${idades})
Serviços solicitados: ${tipos}
Observações: ${observacoes}

Inclua:
- Cabeçalho com destino e datas se informado
- Lista com o que está incluso
- Hotéis com nome, valor, link e café incluso
- Texto breve de apresentação do destino
- Ranking dos hotéis com nota e distância dos principais pontos turísticos

Use emojis, negrito onde necessário e formatação clara para WhatsApp.
`;

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
