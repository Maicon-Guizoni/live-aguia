// Envia data/vendas-corretores.json (gerado por build-vendas-corretores.mjs)
// para a tabela vendas_corretores no Supabase, substituindo os dados antigos.
//
// Precisa de SUPABASE_URL e SUPABASE_ANON_KEY no ambiente (mesmas do .env.local).
//
// Como rodar:
//   node scripts/build-vendas-corretores.mjs
//   node --env-file=.env.local scripts/upload-vendas-corretores.mjs

import { readFileSync } from "fs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_ANON_KEY no ambiente.");
  process.exit(1);
}

const DATA_PATH = new URL("../data/vendas-corretores.json", import.meta.url);

const dados = JSON.parse(readFileSync(DATA_PATH, "utf8"));

const linhas = dados.map((d) => ({
  telefone: d.telefone,
  email: d.email,
  cliente: d.cliente,
  corretor_ativo: d.corretorAtivo,
  origem: d.origem,
}));

const headersBase = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function limparTabela() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/vendas_corretores?id=gt.0`,
    { method: "DELETE", headers: headersBase }
  );
  if (!resp.ok) {
    throw new Error(`Falha ao limpar tabela: ${resp.status} ${await resp.text()}`);
  }
  console.log("Tabela vendas_corretores limpa.");
}

async function inserirLotes() {
  const tamanhoLote = 500;
  let inseridos = 0;

  for (let i = 0; i < linhas.length; i += tamanhoLote) {
    const lote = linhas.slice(i, i + tamanhoLote);
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/vendas_corretores`, {
      method: "POST",
      headers: { ...headersBase, Prefer: "return=minimal" },
      body: JSON.stringify(lote),
    });

    if (!resp.ok) {
      throw new Error(
        `Falha no lote ${i}-${i + lote.length}: ${resp.status} ${await resp.text()}`
      );
    }

    inseridos += lote.length;
    console.log(`Lote ${i}-${i + lote.length}: OK (total ${inseridos}/${linhas.length})`);
  }
}

async function main() {
  console.log(`Registros a enviar: ${linhas.length}`);
  await limparTabela();
  await inserirLotes();
  console.log("Concluído!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
