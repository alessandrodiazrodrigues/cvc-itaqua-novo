const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw_0-r2e70JEoJRmf-NILoX_Ehr0lYECtj8Vs_5ygC0PNJzWf6bDDwofC4v8ooPLiWI/exec";

document.getElementById("orcamentoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const destino = form.destino.value || "(Destino não informado)";
  const adultos = form.adultos.value;
  const criancas = form.criancas.value;
  const idades = form.idades_criancas.value;
  const observacoes = form.observacoes.value;
  const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked"))
    .map(el => el.value)
    .join(", ");
  const colado = document.getElementById("pasteArea").innerText;

  const prompt = `
Você é uma atendente da CVC. Formate um orçamento para WhatsApp baseado nos dados abaixo, seguindo o padrão da loja CVC Itaqua:

Tipo de Orçamento: ${tipos}
Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas} (idades: ${idades})
Observações: ${observacoes}

Conteúdo adicional colado ou anexado:
${colado}

Instruções específicas para tipo "Aéreo Facial":
- Liste os voos com data, horário, origem, destino, companhia e duração
- Separe voos com ou sem bagagem despachada
- Use os preços e formas de pagamento informadas
- Inclua os links dinâmicos CVC se fornecidos

Finalize com:
✨ *Importante:*\nValores sujeitos a alteração e disponibilidade!\nA melhor forma de garantir o preço é efetuando a compra.\nVocê pode usar o link que enviamos — é simples, rápido e seguro! Ou, se preferir, chama a gente por aqui que te ajudamos com a compra 💛

Use emojis, formatação de WhatsApp e clareza na resposta.
`;

  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content || "❌ Erro: resposta da IA veio vazia.";
    document.getElementById("orcamentoIA").innerText = reply;
  } catch (err) {
    document.getElementById("orcamentoIA").innerText = "❌ Erro ao conectar com a IA.";
    console.error(err);
  }
});

