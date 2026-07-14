import { campanha } from "@/config/campanha";

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
              Telefone / WhatsApp
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
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.148a1.5 1.5 0 0 0-1.206-1.47l-3.223-.645a1.5 1.5 0 0 0-1.53.563l-.71.947a11.25 11.25 0 0 1-5.373-5.373l.947-.71a1.5 1.5 0 0 0 .563-1.53l-.645-3.223A1.5 1.5 0 0 0 5.898 3H3.75a1.5 1.5 0 0 0-1.5 1.5v2.25Z"
                />
              </svg>
              <input
                name="telefone"
                required
                inputMode="numeric"
                maxLength={15}
                placeholder="(47) 91234-5678"
                onChange={(event) => {
                  event.target.value = formatarTelefone(event.target.value);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-black outline-none transition focus:border-[#f89921] focus:bg-white focus:ring-4 focus:ring-[#f89921]/15"
              />
            </div>
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
