import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";

const ROOT = "./public/algol-web/scripts";
const OUTPUT = "algol-web-completo.txt";

let output = "";

/** Percorre diretórios recursivamente */
function walk(dir: string) {

    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {

        const fullPath = join(dir, entry.name);

        // Ignora pastas proibidas
        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        // Apenas .html e .js
        if (
            !entry.name.endsWith(".js")
        ) {
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