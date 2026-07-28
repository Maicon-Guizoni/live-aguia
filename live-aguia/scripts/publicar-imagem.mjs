// Publica uma imagem em /public com nome versionado por hash do conteúdo
// (ex: capa.a1b2c3d4.webp) e remove a versão anterior do mesmo "slot".
//
// Isso existe pra resolver um problema recorrente: como o Cloudflare/navegador
// guardam as imagens em cache por 7 dias, sobrescrever o mesmo nome de arquivo
// (ex: capa.webp) faz quem já visitou o site continuar vendo a imagem antiga
// até o cache expirar ou alguém purgar manualmente. Com nome versionado, a
// URL muda toda vez que o conteúdo muda, então não existe cache antigo pra
// conflitar — é sempre um arquivo "novo" pra qualquer cache.
//
// Depois de rodar, cole o caminho impresso no campo correspondente de
// config/campanha.js.
//
// Uso:
//   node scripts/publicar-imagem.mjs <arquivo-origem> <slot>
//
// Exemplos:
//   node scripts/publicar-imagem.mjs nova-capa.png capa
//   node scripts/publicar-imagem.mjs nova-capa-mobile.png capa-mobile
//   node scripts/publicar-imagem.mjs foto-ricardo.png palestrantes/ricardo-amorim

import { readdirSync, unlinkSync, writeFileSync } from "fs";
import { dirname, join, basename } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import sharp from "sharp";

const [, , origem, slot] = process.argv;

if (!origem || !slot) {
  console.error("Uso: node scripts/publicar-imagem.mjs <arquivo-origem> <slot>");
  console.error('Exemplo: node scripts/publicar-imagem.mjs nova-capa.png capa');
  process.exit(1);
}

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const slotDir = join(publicDir, dirname(slot));
const slotName = basename(slot);

async function main() {
  const buffer = await sharp(origem).webp({ quality: 85 }).toBuffer();
  const hash = createHash("md5").update(buffer).digest("hex").slice(0, 8);
  const novoNomeArquivo = `${slotName}.${hash}.webp`;

  const padraoAntigo = new RegExp(`^${slotName}\\.[a-f0-9]{8}\\.webp$`);
  for (const arquivo of readdirSync(slotDir)) {
    if (padraoAntigo.test(arquivo) && arquivo !== novoNomeArquivo) {
      unlinkSync(join(slotDir, arquivo));
      console.log(`Removido (versão antiga): ${arquivo}`);
    }
  }

  writeFileSync(join(slotDir, novoNomeArquivo), buffer);

  const prefixoPublico = dirname(slot) === "." ? "" : `${dirname(slot)}/`;
  console.log(`\nPublicado: /${prefixoPublico}${novoNomeArquivo}`);
  console.log(`Cole esse caminho em config/campanha.js`);
}

main();
