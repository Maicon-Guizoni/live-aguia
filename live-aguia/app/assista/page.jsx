"use client";

import { useEffect, useRef, useState } from "react";
import { campanha } from "@/config/campanha";

function obterSessionId() {
  if (typeof window === "undefined") return "";

  const chave = `sessao_assista_${campanha.codigo}`;
  let sessionId = localStorage.getItem(chave);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(chave, sessionId);
  }

  return sessionId;
}

export default function Assista() {
  const [etapa, setEtapa] = useState("identificar");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [dominioChat, setDominioChat] = useState("");
  const sessionIdRef = useRef("");
  const playerRef = useRef(null);
  const intervaloRef = useRef(null);

  useEffect(() => {
    sessionIdRef.current = obterSessionId();
    setDominioChat(window.location.hostname);
  }, []);

  async function identificar(event) {
    event.preventDefault();
    setEnviando(true);

    try {
      await fetch("/api/presenca/identificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          sessionId: sessionIdRef.current,
        }),
      });
    } catch (erro) {
      console.log(erro);
    } finally {
      setEnviando(false);
      setEtapa("assistindo");
    }
  }

  useEffect(() => {
    if (etapa !== "assistindo") return;

    function enviarPing() {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;

      const segundos = player.getCurrentTime();

      fetch("/api/presenca/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          segundos,
        }),
      }).catch((erro) => console.log(erro));
    }

    function iniciarPlayer() {
      playerRef.current = new window.YT.Player("player-youtube", {
        videoId: campanha.youtubeVideoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (evento) => {
            if (evento.data === window.YT.PlayerState.PLAYING) {
              if (intervaloRef.current) clearInterval(intervaloRef.current);
              intervaloRef.current = setInterval(enviarPing, 20000);
            } else {
              if (intervaloRef.current) clearInterval(intervaloRef.current);
              enviarPing();
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      iniciarPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = iniciarPlayer;
    }

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [etapa]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-10 text-white">
      {etapa === "identificar" && (
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-black/5 bg-white p-7 text-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] sm:p-9">
            <h1 className="text-2xl font-light leading-tight md:text-3xl">
              {campanha.nome}
            </h1>

            <p className="mt-3 text-zinc-500">
              Digite o e-mail que você usou na inscrição para assistir.
            </p>

            <form onSubmit={identificar} className="mt-8 flex flex-col gap-4">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@email.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 px-4 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />

              <button
                disabled={enviando}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#f89921] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#f89921]/25 transition hover:bg-[#f58319] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "Entrando..." : "ASSISTIR AGORA"}
              </button>
            </form>
          </div>
        </div>
      )}

      {etapa === "assistindo" && (
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-4 text-center text-xl font-light text-white md:text-2xl">
            {campanha.nome}
          </h1>
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 md:flex-1">
              <div id="player-youtube" className="h-full w-full" />
            </div>

            <div className="h-[420px] w-full overflow-hidden rounded-xl bg-zinc-900 md:h-auto md:w-[340px] md:shrink-0">
              {dominioChat && (
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${campanha.youtubeVideoId}&embed_domain=${dominioChat}&dark_theme=1`}
                  title="Chat ao vivo"
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
