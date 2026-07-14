import Image from "next/image";
import { campanha } from "@/config/campanha";

export default function Equipe() {
  return (
    <section className="px-6 py-16 text-white">
      <h2 className="text-center text-2xl font-bold uppercase leading-tight md:text-3xl">
        Quem vai conduzir{" "}
        <span className="whitespace-nowrap text-[#f89921]">o evento</span>
      </h2>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-3">
        {campanha.palestrantes.map((pessoa) => (
          <div key={pessoa.nome} className="text-center">
            <Image
              src={pessoa.foto}
              alt={pessoa.nome}
              width={192}
              height={192}
              className="mx-auto h-48 w-48 rounded-full border-2 border-[#f89921]/40 object-cover object-top"
            />

            <h3 className="mt-5 font-bold uppercase tracking-wide">
              {pessoa.nome}
            </h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#f89921]">
              {pessoa.cargo}
            </p>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-zinc-300">
              {pessoa.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
