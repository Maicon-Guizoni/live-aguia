"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [indicador, setIndicador] = useState("");
  const [status, setStatus] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroTelefone, setErroTelefone] = useState("");
  const [tempo, setTempo] = useState({
    dias: "00",
    horas: "00",
    minutos: "00",
    segundos: "00",
  });

  useEffect(() => {
    const indicadorSalvo = localStorage.getItem("indicador");
    setIndicador(indicadorSalvo || "");
  }, []);

  useEffect(() => {
    const dataEvento = new Date("2026-05-27T20:00:00-03:00");

    function atualizarContador() {
      const agora = new Date();
      const diferenca = dataEvento - agora;

      if (diferenca <= 0) {
        setTempo({ dias: "00", horas: "00", minutos: "00", segundos: "00" });
        return;
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
      const segundos = Math.floor((diferenca / 1000) % 60);

      setTempo({
        dias: String(dias).padStart(2, "0"),
        horas: String(horas).padStart(2, "0"),
        minutos: String(minutos).padStart(2, "0"),
        segundos: String(segundos).padStart(2, "0"),
      });
    }

    atualizarContador();
    const intervalo = setInterval(atualizarContador, 1000);
    return () => clearInterval(intervalo);
  }, []);

  async function enviarFormulario(event) {
  event.preventDefault();

  setEnviando(true);
  setStatus("");

  const form = event.target;

  const telefoneLimpo = form.telefone.value.replace(/\D/g, "");
  const emailLimpo = form.email.value.trim().toLowerCase();

  if (telefoneLimpo.length !== 11) {
    setErroTelefone("Digite um telefone válido com DDD.");
    setEnviando(false);
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);

  if (!emailValido) {
    setStatus("Digite um e-mail válido. Exemplo: nome@dominio.com");
    setEnviando(false);
    return;
  }

  setErroTelefone("");

  const dados = {
    nome: form.nome.value,
    telefone: telefoneLimpo,
    email: emailLimpo,
    indicador,
    utm_source: localStorage.getItem("utm_source") || "",
    utm_medium: localStorage.getItem("utm_medium") || "",
    utm_campaign: localStorage.getItem("utm_campaign") || "",
    utm_content: localStorage.getItem("utm_content") || "",
    utm_term: localStorage.getItem("utm_term") || "",
  };

  try {
    const resposta = await fetch("/api/bitrix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.success) {
      window.location.href = "/obrigado";
      return;
    } else {
      setStatus("Erro ao cadastrar.");
      console.log(resultado);
    }
  } catch (erro) {
    console.log(erro);
    setStatus("Erro ao enviar formulário.");
  } finally {
    setEnviando(false);
  }
}

  return (
    <main className="bg-black text-white">
      <section className="bg-black">
  <picture>
    <source media="(max-width: 768px)" srcSet="/capa-mobile.jpeg" />

    <img
      src="/capa.png"
      alt="Flash Sales"
      className="block h-auto w-full"
    />
  </picture>
</section>

      <section className="bg-gradient-to-b from-black to-[#f89921] px-6 pb-0 pt-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="grid grid-cols-4 gap-5">
            <div>
              <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">{tempo.dias}</h2>
              <p className="mt-2 text-sm">Dias</p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">{tempo.horas}</h2>
              <p className="mt-2 text-sm">Horas</p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">{tempo.minutos}</h2>
              <p className="mt-2 text-sm">Minutos</p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">{tempo.segundos}</h2>
              <p className="mt-2 text-sm">Segundos</p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-7 text-black shadow-2xl">
            <h2 className="text-2xl font-light leading-tight md:text-3xl">
              Não perca essa oportunidade e garanta sua vaga para essa <br></br>LIVE EXCLUSIVA!
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
        </div>

        <section className="mt-20 px-6 py-16 text-center text-white">
          <h2 className="text-4xl font-bold uppercase leading-tight text-[#f89921] md:text-5xl">
            UM PRESENTE
            <br />
            PARA VOCÊ.
          </h2>

          <div className="mx-auto mt-8 h-2 w-20 bg-[#f89921]" />

          <p className="mx-auto mt-10 max-w-6xl text-base leading-7 md:text-lg">
            <strong>A Construtora Rôgga</strong>, hoje entre as 6 maiores
            construtoras do Brasil, acaba de registrar o{" "}
            <strong>melhor quadrimestre da sua história</strong> e, para celebrar
            esse resultado, vai liberar no dia 27 de maio de 2026{" "}
            <strong className="text-[#f89921]">
              as condições mais agressivas do mercado imobiliário
            </strong>{" "}
            para quem ainda não conseguiu aproveitar essa oportunidade. Após essa
            data, as condições retornam ao padrão normal e o mesmo investimento
            pode custar significativamente mais caro. Se você busca algo único, não
            fique de fora dessa.
          </p>
        </section>

        <footer className="px-6 py-14 text-center text-white">
          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7">
            <p>
              A Águia Consultoria Imobiliária, inscrita no CNPJ
              14.865.476/0001-08, é registrada sob o CRECI 3535-J.
            </p>

            <p>
              Seu endereço de e-mail será utilizado exclusivamente para o envio de
              oportunidades, conteúdos sobre investimentos e comunicações da Águia
              Consultoria Imobiliária. Para mais informações, acesse nossa
              [Política de Privacidade].
            </p>

            <p>
              As rentabilidades passadas não garantem resultados futuros.
              Recomendamos a análise completa de todas as condições antes de
              realizar qualquer investimento.
            </p>

            <p>
              A Águia Consultoria Imobiliária valoriza a precisão das informações
              divulgadas e assegura a verificação de todo o conteúdo por sua equipe.
              No entanto, os relatórios e materiais fornecidos não constituem oferta
              ou recomendação de compra e venda de ativos financeiros. Todas as
              decisões de investimento devem ser tomadas pelo próprio investidor. A
              Águia Consultoria Imobiliária não se responsabiliza por eventuais
              perdas, danos diretos ou indiretos, custos ou lucros cessantes.
            </p>

            <p>© Todos os direitos reservados.</p>
          </div>
        </footer>
      </section>
    </main>
  );
}