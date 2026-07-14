import { campanha } from "@/config/campanha";

export default function Hero() {
  return (
    <section className="bg-black">
      <picture>
        <source media="(max-width: 768px)" srcSet={campanha.imagemMobile} />

        <img
          src={campanha.imagemDesktop}
          alt={campanha.tituloSite}
          fetchPriority="high"
          className="block h-auto w-full"
        />
      </picture>
    </section>
  );
}