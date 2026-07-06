"use client";

import { useEffect, useState } from "react";

export default function Obrigado() {
  const [contador, setContador] = useState(5);

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: "Flash Rogga",
      });
    }
  }, []);

  useEffect(() => {
    if (contador <= 0) {
      window.location.href =
        "https://chat.whatsapp.com/LZAbmBD7NZFLegHPr4prVk";
      return;
    }

    const timer = setTimeout(() => setContador((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [contador]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-[#d47e33] to-[#f48805] px-6 py-10 text-center text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {/* <img
          src="/obrigado.png"
          alt="Flash Sales"
          className="mb-8 w-full max-w-md"
        /> */}

        <h1 className="text-4xl font-bold md:text-5xl">
          Falta 1 passo para concluir!
        </h1>

        <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/90">
          Você será redirecionado para a comunidade exclusiva da live no Whatsapp onde receberá o link do evento.
        </p>

        <div className="my-8 text-7xl font-bold text-[#25D366]">
          {contador}
        </div>

        <a
          href="https://chat.whatsapp.com/LZAbmBD7NZFLegHPr4prVk"
          className="rounded-xl bg-[#25D366] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90"
        >
          Entrar na comunidade agora
        </a>
      </div>
    </main>
  );
}