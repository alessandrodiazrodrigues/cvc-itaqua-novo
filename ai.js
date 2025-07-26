const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwDvhY_BrbsUkeo96OxFKs0TItAxA9tNh2ikNUXIgxGe_XPgEC5euTWec2xLL82zN4Dcg/exec";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("orcamentoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const destino = form.destino.value || "(Destino não informado)";
    const adultos = form.adultos.value;
    const criancas = form.criancas.value;
    const idades = form.idades_criancas.value;
    const observacoes = form.observacoes.value;
    const tipos = Array.from(form.querySelectorAll("input[name='tipo']:checked")).map(el => el.value).join(", ");
    const textoColado = document.getElementById("pasteArea").innerText;

    const prompt = `Você é uma atendente da CVC. Formate um orçamento para WhatsApp baseado nos dados abaixo, seguindo o padrão da loja CVC Itaqua:

Destino: ${destino}
Adultos: ${adultos}
Crianças: ${criancas} (idades: ${idades})
Serviços solicitados: ${tipos}
Observações: ${observacoes}

Texto adicional enviado:
${textoColado}

Responda apenas se identificar dados válidos.

Formato esperado (exemplo para Aéreo):

*Passagem Aérea*
AZUL
29/07 - Vitória 05:50 / Campinas 07:30

R$ 709,58 por pessoa, taxas inclusas
Pagamento em até 10x de R$ 70,95 s/ juros
https://www.cvc.com.br/carrinho-dinamico/...

Valores sujeitos a alteração e disponibilidade! A melhor forma de garantir o preço é efetuando a compra. Pode usar o link que enviamos mesmo, é bem simples e seguro, ou pode chamar a gente que te ajudamos com a compra.`;

    try {
      const res = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const json = await res.json();
      const reply = json.choices?.[0]?.message?.content || "❌ Resposta da IA vazia.";
      document.getElementById("orcamentoIA").innerText = reply;
    } catch (err) {
      document.getElementById("orcamentoIA").innerText = "❌ Erro ao conectar com a IA.";
      console.error(err);
    }
  });
});
