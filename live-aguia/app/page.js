"use client";

import Hero from "@/components/Hero";
import Contador from "@/components/Contador";
import Formulario from "@/components/Formulario";
import SobreEvento from "@/components/SobreEvento";
import Equipe from "@/components/Equipe";
import Footer from "@/components/Footer";
import { campanha } from "@/config/campanha";
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
  const params = new URLSearchParams(window.location.search);

  // Indicador
  const indicadorUrl = params.get("indicador");
  const indicadorSalvo = localStorage.getItem("indicador");

  const indicadorFinal = indicadorUrl || indicadorSalvo || "";

  if (indicadorFinal) {
    localStorage.setItem("indicador", indicadorFinal);
  }

  setIndicador(indicadorFinal);

  // Salva UTMs se vierem na URL
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ].forEach((param) => {
    const valor = params.get(param);

    if (valor) {
      localStorage.setItem(param, valor);
    }
  });
}, []);

  useEffect(() => {
    const dataEvento = new Date(campanha.dataEvento);

    function atualizarContador() {
      const agora = new Date();
      const diferenca = dataEvento - agora;

      if (diferenca <= 0) {
        setTempo({
          dias: "00",
          horas: "00",
          minutos: "00",
          segundos: "00",
        });
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

    const emailLimpo = form.email.value.trim().toLowerCase();

    const ddi = (form.ddi?.value || "55").replace(/\D/g, "");

    let telefoneLimpo = form.telefone.value.replace(/\D/g, "");

    if (ddi === "55") {
      // Brasil: mantém a regra de sempre (DDD + 9 dígitos).
      if (telefoneLimpo.length !== 11) {
        setErroTelefone("Digite um telefone válido com 11 dígitos. Exemplo: 47912345678");
        setEnviando(false);
        return;
      }
    } else {
      if (!ddi) {
        setErroTelefone("Informe o código do país (DDI). Exemplo: 351 para Portugal.");
        setEnviando(false);
        return;
      }

      // Tira o DDI repetido e o zero de tronco, se a pessoa digitar junto.
      if (telefoneLimpo.startsWith(ddi)) {
        telefoneLimpo = telefoneLimpo.slice(ddi.length);
      }
      telefoneLimpo = telefoneLimpo.replace(/^0+/, "");

      if (telefoneLimpo.length < 6 || telefoneLimpo.length > 14) {
        setErroTelefone("Digite um telefone válido, sem o código do país.");
        setEnviando(false);
        return;
      }

      telefoneLimpo = `${ddi}${telefoneLimpo}`;
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
      profissao: form.profissao.value.trim(),
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <Hero />

    <section className="bg-gradient-to-b from-black to-[#010f1e] px-6 pt-10 pb-0 text-white">
    
      <div className="mx-auto max-w-4xl text-center">
        <Contador tempo={tempo} />

        <Formulario
          enviarFormulario={enviarFormulario}
          enviando={enviando}
          erroTelefone={erroTelefone}
          status={status}
        />
      </div>

      <SobreEvento />
      <Equipe />

      <div className="mx-auto max-w-4xl text-center">
        <Formulario
          enviarFormulario={enviarFormulario}
          enviando={enviando}
          erroTelefone={erroTelefone}
          status={status}
        />
      </div>

      <Footer />
    </section>
  </main>
);
}
