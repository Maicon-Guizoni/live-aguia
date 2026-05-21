"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [indicador, setIndicador] = useState("");
  const [status, setStatus] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroTelefone, setErroTelefone] = useState("");

  useEffect(() => {
    const indicadorSalvo = localStorage.getItem("indicador");
    setIndicador(indicadorSalvo || "");
  }, []);

  async function enviarFormulario(event) {
    event.preventDefault();

    setEnviando(true);
    setStatus("");

    const form = event.target;
    const telefoneLimpo = form.telefone.value.replace(/\D/g, "");

    if (telefoneLimpo.length !== 11) {
      setErroTelefone("Digite um telefone válido com DDD.");
      setEnviando(false);
      return;
    }

    setErroTelefone("");

    const dados = {
      nome: form.nome.value,
      telefone: telefoneLimpo,
      email: form.email.value,
      indicador,
    };

    try {
      const resposta = await fetch("/api/bitrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (resultado.success) {
        setStatus("Cadastro realizado com sucesso!");
        form.reset();
      } else {
        setStatus("Erro ao cadastrar.");
        console.log(resultado);
      }
    } catch (erro) {
      console.log(erro);
      setStatus("Erro ao enviar formulário.");
    }

    setEnviando(false);
  }

  return (
    <main className="bg-black text-white">
    <section className="bg-black">
  <img
    src="/capa.png"
    alt="Flash Sales"
    className="block h-auto w-full"
  />
</section>

      <section className="relative bg-gradient-to-b from-[#000000] to-[#f59e0b] px-6 pb-20 pt-10 text-white">
  <div className="mx-auto max-w-4xl text-center">
    <div className="grid grid-cols-4 gap-5 text-center">
      <div>
        <h2 className="text-5xl font-light text-[#f89921]">06</h2>
        <p className="mt-2 text-sm">Dias</p>
      </div>

      <div>
        <h2 className="text-5xl font-light text-[#f89921]">07</h2>
        <p className="mt-2 text-sm">Horas</p>
      </div>

      <div>
        <h2 className="text-5xl font-light text-[#f89921]">45</h2>
        <p className="mt-2 text-sm">Minutos</p>
      </div>

      <div>
        <h2 className="text-5xl font-light text-[#f89921]">43</h2>
        <p className="mt-2 text-sm">Segundos</p>
      </div>
    </div>

    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-7 text-black shadow-2xl">
      <h2 className="text-3xl font-light leading-tight">
        Não perca essa oportunidade e garanta sua vaga para essa LIVE Exclusiva
      </h2>

      <p className="mt-4 text-zinc-500">
        Preencha seus dados para confirmar sua participação.
      </p>

      <form onSubmit={enviarFormulario} className="mt-8 flex flex-col gap-4">
        <input
          name="nome"
          required
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Nome"
        />

        <input
          name="email"
          type="email"
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Email"
        />

        <input
          name="telefone"
          required
          maxLength={15}
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Telefone"
        />

        {erroTelefone && <p className="text-sm text-red-500">{erroTelefone}</p>}

        <button
          disabled={enviando}
          className="rounded bg-[#f89921] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#f58319] disabled:opacity-60"
        >
          {enviando ? "Enviando..." : "GARANTIR MINHA VAGA"}
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-green-600">{status}</p>}
    </div>

    <div className="mx-auto mt-20 max-w-5xl text-center">
      <h2 className="text-5xl font-bold uppercase text-white">
        UM PRESENTE
        <br />
        PARA VOCÊ.
      </h2>

      <div className="mx-auto mt-6 h-2 w-20 bg-white/80" />

      <p className="mt-10 text-lg leading-8 text-white/90">
        <strong>A Construtora Rôgga</strong>, hoje entre as 6 maiores
        construtoras do Brasil, acaba de registrar o melhor quadrimestre da sua
        história e vai liberar no dia 27 de maio de 2026 as condições mais
        agressivas do mercado imobiliário.
      </p>

      <p className="mt-6 text-lg leading-8 text-white/90">
        Após essa data, as condições retornam ao padrão normal. Se você busca
        algo único, não fique de fora dessa oportunidade.
      </p>

      <div className="mt-20 space-y-8 text-sm leading-7 text-white/70">
        <p>
          A Águia Consultoria Imobiliária, inscrita no CNPJ
          14.865.476/0001-08, é registrada sob o CRECI 3535-J.
        </p>

        <p>
          Seu endereço de e-mail será utilizado exclusivamente para o envio de
          oportunidades, conteúdos sobre investimentos e comunicações da Águia
          Consultoria Imobiliária.
        </p>

        <p>
          As rentabilidades passadas não garantem resultados futuros.
        </p>

        <p>© Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}