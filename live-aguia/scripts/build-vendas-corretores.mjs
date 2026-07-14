// Gera data/vendas-corretores.json a partir dos CSVs exportados das 4 abas
// da planilha de vendas + da planilha de corretores ativos.
//
// Como rodar (depois de atualizar os arquivos de origem em scripts/fontes/):
//   node scripts/build-vendas-corretores.mjs

import { readFileSync, writeFileSync, existsSync } from "fs";
import { parse } from "./csv-parse.mjs";

const FONTES_DIR = new URL("./fontes/", import.meta.url);
const OUT_PATH = new URL("../data/vendas-corretores.json", import.meta.url);

const ABAS = [
  { arquivo: "vendas_2026.csv", origem: "vendas_2026" },
  { arquivo: "vendas_2025.csv", origem: "vendas_2025" },
  { arquivo: "vendas_2024.csv", origem: "vendas_2024" },
  { arquivo: "restante.csv", origem: "restante" },
];

function normalizar(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Partículas ignoradas ao comparar nomes — a planilha de vendas e a lista de
// corretores ativos não escrevem os nomes sempre da mesma forma (ex: "André
// de Oliveira" vs "ANDRÉ OLIVEIRA", "Cíntia Viana Canuto" vs "CINTIA
// CANUTO"), então comparamos só a primeira e a última palavra significativa.
const PARTICULAS = new Set(["de", "da", "do", "das", "dos", "e"]);

function palavrasSignificativas(nome) {
  return normalizar(nome)
    .split(" ")
    .filter((palavra) => palavra && !PARTICULAS.has(palavra));
}

function lerCsv(caminho) {
  let txt = readFileSync(caminho, "utf8");
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
  return parse(txt);
}

// Colunas que podem conter nome(s) de corretor em cada aba.
const COLUNAS_CORRETOR = {
  vendas_2026: ["Corretor 1", "Corretor 2", "Corretor 3", "Corretor 4"],
  vendas_2025: ["Corretor 1", "Corretor 2", "Corretor 3", "Corretor 4"],
  vendas_2024: [
    "Corretor",
    "Corretor 1",
    "Corretor 2",
    "Corretor 3",
    "Corretor 4",
    "Corretor 5",
  ],
  restante: ["EX CORRETOR", "CORRETOR ATIVO"],
};

const ativos = lerCsv(new URL("corretores_ativos.csv", FONTES_DIR));
const ativosNormalizados = ativos
  .map((linha) => linha.Colaborador?.trim())
  .filter(Boolean)
  .map((nome) => ({ nome, palavras: palavrasSignificativas(nome) }))
  // Nomes de uma palavra só (sem sobrenome, ou que viraram uma palavra só
  // depois de remover partículas) são ambíguos demais para cruzar com o
  // texto livre das vendas (ex: "Junior" colide com "Rubens Junior",
  // "Arno Junior" etc.) — não entram no cruzamento.
  .filter(({ palavras }) => palavras.length > 1)
  .map(({ nome, palavras }) => ({
    nome,
    regexPrimeira: new RegExp(`\\b${escapeRegex(palavras[0])}\\b`),
    regexUltima: new RegExp(
      `\\b${escapeRegex(palavras[palavras.length - 1])}\\b`
    ),
  }));

console.log(`Corretores ativos carregados: ${ativosNormalizados.length}`);

function encontrarCorretorAtivo(textoCombinado) {
  const normalizado = normalizar(textoCombinado);
  if (!normalizado) return null;

  // Quando mais de um corretor ativo bate no mesmo texto (ex: "Junior" e
  // "Assis Junior" batem ambos em "Assis Junior 50% / SAV 50%"), fica com
  // o nome mais longo/específico em vez do primeiro da lista.
  let melhor = null;
  for (const corretor of ativosNormalizados) {
    if (
      corretor.regexPrimeira.test(normalizado) &&
      corretor.regexUltima.test(normalizado)
    ) {
      if (!melhor || corretor.nome.length > melhor.length) {
        melhor = corretor.nome;
      }
    }
  }
  return melhor;
}

const registros = [];
const stats = {};

for (const aba of ABAS) {
  const caminho = new URL(aba.arquivo, FONTES_DIR);
  if (!existsSync(caminho)) {
    console.warn(`Arquivo não encontrado, pulando: ${aba.arquivo}`);
    continue;
  }

  const linhas = lerCsv(caminho);
  let comMatch = 0;
  let semTelefoneEmail = 0;

  for (const linha of linhas) {
    const telefone = (linha.Telefone || "").replace(/\D/g, "");
    const email = (linha.Email || "").trim().toLowerCase();

    if (!telefone && !email) {
      semTelefoneEmail++;
      continue;
    }

    const colunas = COLUNAS_CORRETOR[aba.origem] || [];
    const textoCombinado = colunas.map((c) => linha[c] || "").join(" / ");

    const corretorAtivo = encontrarCorretorAtivo(textoCombinado);
    if (corretorAtivo) comMatch++;

    registros.push({
      telefone: telefone || null,
      email: email || null,
      cliente: linha.Cliente || null,
      corretorAtivo,
      origem: aba.origem,
    });
  }

  stats[aba.origem] = {
    linhas: linhas.length,
    aproveitadas: linhas.length - semTelefoneEmail,
    semTelefoneEmail,
    comCorretorAtivo: comMatch,
  };
}

writeFileSync(OUT_PATH, JSON.stringify(registros, null, 2), "utf8");

console.log("\nResumo:");
console.table(stats);
console.log(`\nTotal de registros gravados: ${registros.length}`);
console.log(`Arquivo: ${OUT_PATH.pathname}`);
