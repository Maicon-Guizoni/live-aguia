"use client";

import { useState } from "react";
import { campanha } from "@/config/campanha";

// id = sigla do país (único). ddi = código de discagem (vários países dividem o +1).
// Para adicionar um país, acrescente uma linha aqui.
export const paises = [
  // ---------- Américas ----------
  { id: "BR", ddi: "55", nome: "Brasil", bandeira: "🇧🇷", grupo: "Américas" },
  { id: "AI", ddi: "1", nome: "Anguilla", bandeira: "🇦🇮", grupo: "Américas" },
  { id: "AG", ddi: "1", nome: "Antígua e Barbuda", bandeira: "🇦🇬", grupo: "Américas" },
  { id: "AR", ddi: "54", nome: "Argentina", bandeira: "🇦🇷", grupo: "Américas" },
  { id: "AW", ddi: "297", nome: "Aruba", bandeira: "🇦🇼", grupo: "Américas" },
  { id: "BS", ddi: "1", nome: "Bahamas", bandeira: "🇧🇸", grupo: "Américas" },
  { id: "BB", ddi: "1", nome: "Barbados", bandeira: "🇧🇧", grupo: "Américas" },
  { id: "BZ", ddi: "501", nome: "Belize", bandeira: "🇧🇿", grupo: "Américas" },
  { id: "BM", ddi: "1", nome: "Bermudas", bandeira: "🇧🇲", grupo: "Américas" },
  { id: "BO", ddi: "591", nome: "Bolívia", bandeira: "🇧🇴", grupo: "Américas" },
  { id: "BQ", ddi: "599", nome: "Caribe Neerlandês", bandeira: "🇧🇶", grupo: "Américas" },
  { id: "CA", ddi: "1", nome: "Canadá", bandeira: "🇨🇦", grupo: "Américas" },
  { id: "CL", ddi: "56", nome: "Chile", bandeira: "🇨🇱", grupo: "Américas" },
  { id: "CO", ddi: "57", nome: "Colômbia", bandeira: "🇨🇴", grupo: "Américas" },
  { id: "CR", ddi: "506", nome: "Costa Rica", bandeira: "🇨🇷", grupo: "Américas" },
  { id: "CU", ddi: "53", nome: "Cuba", bandeira: "🇨🇺", grupo: "Américas" },
  { id: "CW", ddi: "599", nome: "Curaçao", bandeira: "🇨🇼", grupo: "Américas" },
  { id: "DM", ddi: "1", nome: "Dominica", bandeira: "🇩🇲", grupo: "Américas" },
  { id: "SV", ddi: "503", nome: "El Salvador", bandeira: "🇸🇻", grupo: "Américas" },
  { id: "EC", ddi: "593", nome: "Equador", bandeira: "🇪🇨", grupo: "Américas" },
  { id: "US", ddi: "1", nome: "Estados Unidos", bandeira: "🇺🇸", grupo: "Américas" },
  { id: "GD", ddi: "1", nome: "Granada", bandeira: "🇬🇩", grupo: "Américas" },
  { id: "GL", ddi: "299", nome: "Groenlândia", bandeira: "🇬🇱", grupo: "Américas" },
  { id: "GP", ddi: "590", nome: "Guadalupe", bandeira: "🇬🇵", grupo: "Américas" },
  { id: "GT", ddi: "502", nome: "Guatemala", bandeira: "🇬🇹", grupo: "Américas" },
  { id: "GY", ddi: "592", nome: "Guiana", bandeira: "🇬🇾", grupo: "Américas" },
  { id: "GF", ddi: "594", nome: "Guiana Francesa", bandeira: "🇬🇫", grupo: "Américas" },
  { id: "HT", ddi: "509", nome: "Haiti", bandeira: "🇭🇹", grupo: "Américas" },
  { id: "HN", ddi: "504", nome: "Honduras", bandeira: "🇭🇳", grupo: "Américas" },
  { id: "KY", ddi: "1", nome: "Ilhas Cayman", bandeira: "🇰🇾", grupo: "Américas" },
  { id: "FK", ddi: "500", nome: "Ilhas Malvinas", bandeira: "🇫🇰", grupo: "Américas" },
  { id: "VG", ddi: "1", nome: "Ilhas Virgens Britânicas", bandeira: "🇻🇬", grupo: "Américas" },
  { id: "VI", ddi: "1", nome: "Ilhas Virgens Americanas", bandeira: "🇻🇮", grupo: "Américas" },
  { id: "JM", ddi: "1", nome: "Jamaica", bandeira: "🇯🇲", grupo: "Américas" },
  { id: "MQ", ddi: "596", nome: "Martinica", bandeira: "🇲🇶", grupo: "Américas" },
  { id: "MX", ddi: "52", nome: "México", bandeira: "🇲🇽", grupo: "Américas" },
  { id: "MS", ddi: "1", nome: "Montserrat", bandeira: "🇲🇸", grupo: "Américas" },
  { id: "NI", ddi: "505", nome: "Nicarágua", bandeira: "🇳🇮", grupo: "Américas" },
  { id: "PA", ddi: "507", nome: "Panamá", bandeira: "🇵🇦", grupo: "Américas" },
  { id: "PY", ddi: "595", nome: "Paraguai", bandeira: "🇵🇾", grupo: "Américas" },
  { id: "PE", ddi: "51", nome: "Peru", bandeira: "🇵🇪", grupo: "Américas" },
  { id: "PR", ddi: "1", nome: "Porto Rico", bandeira: "🇵🇷", grupo: "Américas" },
  { id: "DO", ddi: "1", nome: "República Dominicana", bandeira: "🇩🇴", grupo: "Américas" },
  { id: "BL", ddi: "590", nome: "São Bartolomeu", bandeira: "🇧🇱", grupo: "Américas" },
  { id: "KN", ddi: "1", nome: "São Cristóvão e Neves", bandeira: "🇰🇳", grupo: "Américas" },
  { id: "MF", ddi: "590", nome: "São Martinho", bandeira: "🇲🇫", grupo: "Américas" },
  { id: "PM", ddi: "508", nome: "São Pedro e Miquelão", bandeira: "🇵🇲", grupo: "Américas" },
  { id: "VC", ddi: "1", nome: "São Vicente e Granadinas", bandeira: "🇻🇨", grupo: "Américas" },
  { id: "LC", ddi: "1", nome: "Santa Lúcia", bandeira: "🇱🇨", grupo: "Américas" },
  { id: "SX", ddi: "1", nome: "Sint Maarten", bandeira: "🇸🇽", grupo: "Américas" },
  { id: "SR", ddi: "597", nome: "Suriname", bandeira: "🇸🇷", grupo: "Américas" },
  { id: "TT", ddi: "1", nome: "Trinidad e Tobago", bandeira: "🇹🇹", grupo: "Américas" },
  { id: "TC", ddi: "1", nome: "Turks e Caicos", bandeira: "🇹🇨", grupo: "Américas" },
  { id: "UY", ddi: "598", nome: "Uruguai", bandeira: "🇺🇾", grupo: "Américas" },
  { id: "VE", ddi: "58", nome: "Venezuela", bandeira: "🇻🇪", grupo: "Américas" },

  // ---------- Outros países ----------
  { id: "DE", ddi: "49", nome: "Alemanha", bandeira: "🇩🇪", grupo: "Outros países" },
  { id: "AO", ddi: "244", nome: "Angola", bandeira: "🇦🇴", grupo: "Outros países" },
  { id: "AU", ddi: "61", nome: "Austrália", bandeira: "🇦🇺", grupo: "Outros países" },
  { id: "BE", ddi: "32", nome: "Bélgica", bandeira: "🇧🇪", grupo: "Outros países" },
  { id: "AE", ddi: "971", nome: "Emirados Árabes", bandeira: "🇦🇪", grupo: "Outros países" },
  { id: "ES", ddi: "34", nome: "Espanha", bandeira: "🇪🇸", grupo: "Outros países" },
  { id: "FR", ddi: "33", nome: "França", bandeira: "🇫🇷", grupo: "Outros países" },
  { id: "NL", ddi: "31", nome: "Holanda", bandeira: "🇳🇱", grupo: "Outros países" },
  { id: "IE", ddi: "353", nome: "Irlanda", bandeira: "🇮🇪", grupo: "Outros países" },
  { id: "IT", ddi: "39", nome: "Itália", bandeira: "🇮🇹", grupo: "Outros países" },
  { id: "JP", ddi: "81", nome: "Japão", bandeira: "🇯🇵", grupo: "Outros países" },
  { id: "LU", ddi: "352", nome: "Luxemburgo", bandeira: "🇱🇺", grupo: "Outros países" },
  { id: "MZ", ddi: "258", nome: "Moçambique", bandeira: "🇲🇿", grupo: "Outros países" },
  { id: "PT", ddi: "351", nome: "Portugal", bandeira: "🇵🇹", grupo: "Outros países" },
  { id: "GB", ddi: "44", nome: "Reino Unido", bandeira: "🇬🇧", grupo: "Outros países" },
  { id: "CH", ddi: "41", nome: "Suíça", bandeira: "🇨🇭", grupo: "Outros países" },
  { id: "ZZ", ddi: "", nome: "Outro país (informar DDI)", bandeira: "🌎", grupo: "Outros países" },
];

export const grupos = ["Américas", "Outros países"];

function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length > 6) {
    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  if (digitos.length > 2) {
    return digitos.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }

  if (digitos.length > 0) {
    return digitos.replace(/(\d{0,2})/, "($1");
  }

  return digitos;
}

export default function Formulario({
  enviarFormulario,
  enviando,
  erroTelefone,
  status,
}) {
  const [paisId, setPaisId] = useState("BR");
  const [telefone, setTelefone] = useState("");
  const [ddiManual, setDdiManual] = useState("");

  const pais = paises.find((item) => item.id === paisId) || paises[0];
  const brasil = paisId === "BR";
  const outro = paisId === "ZZ";
  const ddiFinal = outro ? ddiManual : pais.ddi;

  function aoDigitarTelefone(event) {
    const valor = event.target.value;
    setTelefone(brasil ? formatarTelefone(valor) : valor.replace(/[^\d\s()-]/g, "").slice(0, 20));
  }

  function aoTrocarPais(event) {
    setPaisId(event.target.value);
    setTelefone("");
    setDdiManual("");
  }

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <div className="rounded-2xl border border-black/5 bg-white p-7 text-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] sm:p-9">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f89921]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#f89921]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f89921]" />
          Vagas limitadas
        </div>

        <h2 className="text-2xl font-light leading-tight md:text-3xl">
          {campanha.tituloFormulario}
        </h2>

        <p className="mt-3 text-zinc-500">
          {campanha.subtituloFormulario}
        </p>

        <form
          onSubmit={enviarFormulario}
          className="mt-8 flex flex-col gap-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              Nome completo
            </span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>
              <input
                name="nome"
                required
                placeholder="Seu nome"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              E-mail
            </span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3 6.75 9 6.75 9-6.75"
                />
              </svg>
              <input
                name="email"
                type="email"
                required
                placeholder="nome@email.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              Profissão
            </span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              <input
                name="profissao"
                placeholder="Sua profissão"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              Telefone / WhatsApp
            </span>
            <select
              name="pais"
              value={paisId}
              onChange={aoTrocarPais}
              aria-label="País do telefone"
              className="mb-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
            >
              {grupos.map((grupo) => (
                <optgroup key={grupo} label={grupo}>
                  {paises
                    .filter((item) => item.grupo === grupo)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.bandeira} {item.nome}
                        {item.ddi ? ` (+${item.ddi})` : ""}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>

            <input type="hidden" name="ddi" value={ddiFinal} />

            <div className="flex gap-2">
              {outro && (
                <input
                  name="ddiManual"
                  required
                  inputMode="numeric"
                  maxLength={4}
                  value={ddiManual}
                  onChange={(event) => setDdiManual(event.target.value.replace(/\D/g, ""))}
                  placeholder="DDI"
                  aria-label="Código do país"
                  className="w-[86px] shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3.5 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
                />
              )}

              <input
                name="telefone"
                required
                type="tel"
                inputMode="tel"
                value={telefone}
                onChange={aoDigitarTelefone}
                placeholder={brasil ? "(47) 91234-5678" : "Número sem o código do país"}
                className="w-full min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />
            </div>
            {!brasil && (
              <span className="mt-1.5 block text-xs text-zinc-400">
                Digite apenas o número local, sem o código do país e sem o zero inicial.
              </span>
            )}
          </label>

          <label className="flex items-start gap-2.5 text-left text-sm text-zinc-600">
            <input
              type="checkbox"
              name="aceiteTermos"
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-[#f89921] focus:ring-2 focus:ring-[#f89921]/40"
            />
            <span>
              Li e concordo com o{" "}
              <a
                href="/termos"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[#f89921]"
              >
                Termo de Compromisso e Condições de Acesso à Transmissão
              </a>
              .
            </span>
          </label>

          {erroTelefone && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {erroTelefone}
            </p>
          )}

          <button
            disabled={enviando}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#f89921] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#f89921]/25 transition hover:bg-[#f58319] hover:shadow-xl hover:shadow-[#f89921]/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {enviando ? (
              "Confirmando inscrição..."
            ) : (
              <>
                GARANTIR MINHA VAGA
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 9h10.5a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5h-10.5a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5Z"
              />
            </svg>
            Seus dados estão protegidos e não serão compartilhados.
          </p>
        </form>

        {status && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
