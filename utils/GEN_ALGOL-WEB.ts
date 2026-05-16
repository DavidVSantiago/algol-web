import { join } from "path";
import { readdir } from "node:fs/promises";

const BASE_DIR = "./public/algol-web/scripts"; // Caminho da sua pasta raiz de scripts
const OUTPUT_FILE = "algol-web-completo.txt"; // Onde o arquivo final será salvo

async function bundleFiles() {
  const contents: string[] = [];

  // 1. Adiciona o variaveis.js primeiro (conforme solicitado)
  console.log("Adicionando: variaveis.js");
  const variaveis = await Bun.file(join(BASE_DIR, "variaveis.js")).text();
  contents.push(`// --- variaveis.js ---\n${variaveis}\n`);

  // 2. Define a ordem das pastas conforme a imagem
  const folders = ["bases", "components", "layouts"];

  for (const folder of folders) {
    const folderPath = join(BASE_DIR, folder);
    
    try {
      // Lê os arquivos da pasta e ordena alfabeticamente para garantir a ordem de cima para baixo
      const files = (await readdir(folderPath)).sort();

      for (const file of files) {
        if (file.endsWith(".js")) {
          console.log(`Adicionando: ${folder}/${file}`);
          const content = await Bun.file(join(folderPath, file)).text();
          contents.push(`// --- ${folder}/${file} ---\n${content}\n`);
        }
      }
    } catch (err) {
      console.warn(`Aviso: Pasta ${folder} não encontrada ou vazia.`);
    }
  }

  // 3. Salva o arquivo final
  await Bun.write(OUTPUT_FILE, contents.join("\n"));
  console.log(`\nSucesso! Arquivo gerado em: ${OUTPUT_FILE}`);
}

bundleFiles();