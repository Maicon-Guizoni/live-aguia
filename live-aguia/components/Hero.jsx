export default function Hero() {
  return (
    <section className="bg-black">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet="/capa-mobile.jpeg"
        />

        <img
          src="/capa.png"
          alt="Flash Sales"
          className="block h-auto w-full"
        />
      </picture>
    </section>
  );
}