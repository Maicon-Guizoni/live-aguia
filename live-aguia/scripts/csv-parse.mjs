// Parser de CSV mínimo (RFC 4180): lida com campos entre aspas,
// vírgulas e quebras de linha dentro de campos, e aspas escapadas ("").
export function parse(texto) {
  const linhas = [];
  let linhaAtual = [];
  let campoAtual = "";
  let dentroDeAspas = false;

  const texto2 = texto.replace(/\r\n/g, "\n");

  for (let i = 0; i < texto2.length; i++) {
    const char = texto2[i];

    if (dentroDeAspas) {
      if (char === '"') {
        if (texto2[i + 1] === '"') {
          campoAtual += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campoAtual += char;
      }
      continue;
    }

    if (char === '"') {
      dentroDeAspas = true;
      continue;
    }

    if (char === ",") {
      linhaAtual.push(campoAtual);
      campoAtual = "";
      continue;
    }

    if (char === "\n") {
      linhaAtual.push(campoAtual);
      linhas.push(linhaAtual);
      linhaAtual = [];
      campoAtual = "";
      continue;
    }

    campoAtual += char;
  }

  if (campoAtual.length > 0 || linhaAtual.length > 0) {
    linhaAtual.push(campoAtual);
    linhas.push(linhaAtual);
  }

  const linhasNaoVazias = linhas.filter(
    (linha) => !(linha.length === 1 && linha[0] === "")
  );

  const [cabecalho, ...resto] = linhasNaoVazias;

  return resto.map((linha) => {
    const obj = {};
    cabecalho.forEach((chave, idx) => {
      obj[chave] = linha[idx] ?? "";
    });
    return obj;
  });
}
