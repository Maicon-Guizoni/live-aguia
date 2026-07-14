import { campanha } from "@/config/campanha";

export default function Contador({ tempo }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-white">
        {campanha.selo}
        <br />
        <span className="text-[#f89921]">{campanha.seloDestaque}</span>
      </p>

      <div className="mt-5 grid grid-cols-4 gap-5">
      <div>
        <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">
          {tempo.dias}
        </h2>
        <p className="mt-2 text-sm">Dias</p>
      </div>

      <div>
        <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">
          {tempo.horas}
        </h2>
        <p className="mt-2 text-sm">Horas</p>
      </div>

      <div>
        <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">
          {tempo.minutos}
        </h2>
        <p className="mt-2 text-sm">Minutos</p>
      </div>

      <div>
        <h2 className="text-4xl font-light text-[#f89921] md:text-5xl">
          {tempo.segundos}
        </h2>
        <p className="mt-2 text-sm">Segundos</p>
      </div>
      </div>
    </div>
  );
}