import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";

const ROOT = "./";
const OUTPUT = "projeto_completo_BACK.txt";

let files: string[] = [];
let output = "";

/** Percorre diretórios recursivamente */
function walk(dir: string) {

    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {

        const fullPath = join(dir, entry.name);

        // Ignora diretórios proibidos
        if (entry.isDirectory()) {

            if (
                entry.name === "node_modules" ||
                entry.name === "public"
            ) {
                continue;
            }

            walk(fullPath);
            continue;
        }

        // Apenas arquivos .ts
        if (!entry.name.endsWith(".ts")) {
            continue;
        }

        files.push(fullPath);
    }
}

// Percorre
walk(ROOT);

// Ordena igual ao "sort"
files.sort();

// Gera saída igual ao find + cat
for (const file of files) {

    const relPath = "./" + relative(".", file);

    output += "// ====================================\n";
    output += `// 📁 ${relPath}\n`;
    output += "// ====================================\n";

    output += readFileSync(file, "utf8");
    output += "\n\n";
}

writeFileSync(OUTPUT, output);

console.log("Arquivo gerado:", OUTPUT);