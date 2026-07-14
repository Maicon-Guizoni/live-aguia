import { campanha } from "@/config/campanha";

export default function Hero() {
  return (
    <section className="bg-black">
      <picture>
        <source media="(max-width: 768px)" srcSet={campanha.imagemMobile} />

        <img
          src={campanha.imagemDesktop}
          alt={campanha.tituloSite}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="block aspect-[4/5] h-auto w-full md:aspect-[16/9]"
        />
      </picture>
    </section>
  );
}