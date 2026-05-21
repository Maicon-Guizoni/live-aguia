"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [indicador, setIndicador] = useState("");
  const [status, setStatus] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const indicadorSalvo = localStorage.getItem("indicador");
    setIndicador(indicadorSalvo || "");
  }, []);

  async function enviarFormulario(event) {
    event.preventDefault();
    setEnviando(true);
    setStatus("");

    const form = event.target;

    const dados = {
      nome: form.nome.value,
      telefone: form.telefone.value,
      email: form.email.value,
      indicador,
    };

    const resposta = await fetch("/api/bitrix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.success) {
      setStatus("Cadastro realizado com sucesso!");
      form.reset();
    } else {
      setStatus("Erro ao cadastrar. Veja o terminal.");
      console.log(resultado);
    }

    setEnviando(false);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
          Ao vivo | 24 de março | 20h
        </p>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Por que investir no Litoral Norte de SC?
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-300">
          Participe de uma live gratuita e descubra os fundamentos por trás da
          valorização imobiliária da região.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
          <p className="mb-4 text-sm font-semibold text-zinc-300">
            Vagas limitadas | 100% gratuito
          </p>

          <form onSubmit={enviarFormulario} className="flex flex-col gap-4">
            <input
              name="nome"
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
              placeholder="Seu nome"
            />

            <input
              name="telefone"
              required
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
              placeholder="Seu telefone"
            />

            <input
              name="email"
              type="email"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
              placeholder="Seu e-mail"
            />

            <button
              disabled={enviando}
              className="rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Garantir minha vaga"}
            </button>
          </form>

          {indicador && (
            <p className="mt-4 text-xs text-zinc-500">
              Indicador salvo: {indicador}
            </p>
          )}

          {status && <p className="mt-4 text-sm text-yellow-400">{status}</p>}
        </div>
      </section>
    </main>
  );
}