import { campanha } from "@/config/campanha";

export default function SobreEvento() {
  return (
    <section className="mt-20 px-6 py-16 text-white">
      <h2 className="text-center text-2xl font-bold uppercase leading-tight md:text-3xl">
        <span className="text-[#f89921]">Pontos chave</span>
        <br />
        para aprender
      </h2>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-2">
        {campanha.pontosChave.map((ponto) => (
          <div key={ponto.titulo} className="flex gap-4 text-left">
            <svg
              className="mt-1 h-8 w-8 shrink-0 text-[#f89921]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <div>
              <h3 className="font-semibold uppercase tracking-wide text-[#f89921]">
                {ponto.titulo}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {ponto.texto}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
