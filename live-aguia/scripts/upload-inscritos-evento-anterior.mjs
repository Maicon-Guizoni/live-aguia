// Envia scripts/fontes/inscritos_thiago_nigro.csv para a tabela
// inscritos_evento_anterior no Supabase — usada pra identificar, quando um
// lead se cadastra pelo link genérico de Comunidades (indicador 366), se ele
// já tinha se inscrito numa live anterior através de um corretor específico.
//
// Precisa de SUPABASE_URL e SUPABASE_ANON_KEY no ambiente.
//
// Como rodar:
//   node --env-file=.env.local scripts/upload-inscritos-evento-anterior.mjs

import { readFileSync } from "fs";
import { parse } from "./csv-parse.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_ANON_KEY no ambiente.");
  process.exit(1);
}

const CSV_PATH = new URL(
  "./fontes/inscritos_thiago_nigro.csv",
  import.meta.url
);

let txt = readFileSync(CSV_PATH, "utf8");
if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
const linhasCsv = parse(txt);

const linhas = linhasCsv.map((r) => ({
  telefone: r.telefone || null,
  email: r.email || null,
  nome: r.nome || null,
  responsavel_nome: r.responsavel_nome || null,
  responsavel_id: r.responsavel_id || null,
  evento_origem: "thiago_nigro",
}));

const headersBase = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function limparTabela() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/inscritos_evento_anterior?evento_origem=eq.thiago_nigro`,
    { method: "DELETE", headers: { ...headersBase, Prefer: "return=representation" } }
  );
  if (!resp.ok) {
    throw new Error(`Falha ao limpar tabela: ${resp.status} ${await resp.text()}`);
  }
  const apagados = await resp.json();
  console.log(`Tabela limpa (evento_origem=thiago_nigro). Linhas apagadas: ${Array.isArray(apagados) ? apagados.length : "?"}`);
}

async function inserirLotes() {
  const tamanhoLote = 500;
  let inseridos = 0;

  for (let i = 0; i < linhas.length; i += tamanhoLote) {
    const lote = linhas.slice(i, i + tamanhoLote);
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/inscritos_evento_anterior`, {
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

async function confirmarTotal() {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/inscritos_evento_anterior?select=id&limit=1`,
    { headers: { ...headersBase, Prefer: "count=exact", Range: "0-0" } }
  );
  console.log("Total na tabela agora:", resp.headers.get("content-range"));
}

async function main() {
  console.log(`Registros a enviar: ${linhas.length}`);
  await limparTabela();
  await inserirLotes();
  await confirmarTotal();
  console.log("Concluído!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
