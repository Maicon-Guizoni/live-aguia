/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  async headers() {
    return [
      {
        // Imagens e fontes em /public: cache de 7 dias. Curto o bastante
        // pra não travar uma troca de arte no meio de uma campanha, longo
        // o bastante pra evitar revalidação a cada carregamento.
        source: "/:path*.(webp|png|jpg|jpeg|svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
