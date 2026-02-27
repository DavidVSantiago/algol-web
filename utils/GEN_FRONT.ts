import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";

const ROOT = "./public";
const OUTPUT = "projeto_completo_FRONT.txt";

let output = "";

/** Percorre diretórios recursivamente */
function walk(dir: string) {

    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {

        const fullPath = join(dir, entry.name);

        // Ignora pastas proibidas
        if (entry.isDirectory()) {

            if (
                entry.name === "_mocks" ||
                entry.name === "algol-web"
            ) {
                continue;
            }

            walk(fullPath);
            continue;
        }

        // Apenas .html e .js
        if (
            !entry.name.endsWith(".html") &&
            !entry.name.endsWith(".js")
        ) {
            continue;
        }

        // Ignora min.js
        if (entry.name === "min.js") {
            continue;
        }

        const relPath = "./" + relative(".", fullPath);

        output += "// ====================================\n";
        output += `// 📁 ${relPath}\n`;
        output += "// ====================================\n";

        output += readFileSync(fullPath, "utf8");
        output += "\n\n";
    }
}

walk(ROOT);

writeFileSync(OUTPUT, output);

console.log("Arquivo gerado:", OUTPUT);