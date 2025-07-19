# 🌐 Hotsite de Gestão – CVC Itaqua (Filial 6220)

Este projeto é um hotsite desenvolvido para uso interno da loja CVC Itaquaquecetuba. Ele reúne ferramentas de gestão, geração automatizada de orçamentos com IA, formulários integrados com Google Sheets e um painel de desempenho da equipe.

---

## 📁 Estrutura do Projeto

### Páginas principais:

| Arquivo                 | Descrição |
|--------------------------|-----------|
| `index.html`             | Página inicial com dashboard de vendas (Looker Studio) + upload de PDF para análise por IA |
| `orcamentos.html`        | Formulário completo para geração de orçamentos formatados via IA |
| `cadastro-vendas.html`   | Tela protegida por senha para envio de dados de vendas para o Google Sheets |
| `embarques.html`         | Iframe com Web App de registro de embarques |
| `orbiuns.html`           | Iframe com Web App de controle de orbiuns |

---

## 🧠 Recursos com IA

A integração com OpenAI GPT-4 permite:

- Extrair informações de orçamentos a partir de prints e PDFs
- Organizar no modelo-padrão da loja (pronto para envio por WhatsApp)
- Analisar relatórios semanais enviados pela franqueadora
- Gerar textos explicativos sobre destinos e rankings de hotéis

---

## 🎯 Modelo de Orçamento (IA)

```
📍 Orlando - Flórida
🗓️ 05 de mar - 15 de mar (11 dias e 10 noites)
👥 2 adultos + 2 crianças (02 e 04 anos)

*O Pacote Inclui:*
- Aéreo ida e volta com Avianca
- Taxas de embarque
- 01 mala de mão + item pessoal por pessoa
- 10 noites em hotel com café da manhã

✈ Detalhes dos Voos:
05/03 - Guarulhos 01:50 / Bogotá 05:45
05/03 - Bogotá 08:00 / Orlando 12:15
--
15/03 - Orlando 14:55 / Bogotá 17:54
15/03 - Bogotá 21:40 / Guarulhos 05:50 (16/03)

🏨 Opções de Hotéis:
1. Magic Moment Resort & Kids Club – R$ 14.069,19
2. Palazzo Lakeside Hotel – R$ 12.590,76
```

---

## 🛠️ Como usar

1. Faça upload dos arquivos neste repositório
2. Vá em **Settings > Pages**
   - Selecione `main` branch e root folder
   - Clique em **Save**
3. Acesse o site publicado pelo link fornecido (ex: `https://seunome.github.io/cvc-itaqua-gestao`)
4. Use as páginas conforme a operação da loja

---

## 🔐 Integrações com Google Sheets

- Orbiuns (controle de processos internos)
- Embarques (ida, volta, multitrechos, bagagem, seguro)
- Cadastro de vendas com senha e cálculo automático de meta, percentual e GAP

---

## 📌 Manutenção futura

- Conectar backend para upload seguro de PDFs (Node/Vercel)
- Criar painel administrativo com histórico de orçamentos
- Exportação em PDF
- Painel comparativo entre filiais 6220 e 6223

---

© CVC Itaqua | Projeto Interno – Não distribuído externamente
