// injeta as variáveis globais
let cssVariables = ':root {\n';
for (const chave in GLOBAL) {
    cssVariables += `  --${chave}: ${GLOBAL[chave]};\n`;
}
cssVariables += '}';
headStyle.textContent += cssVariables;

// injeta a fonte global
headStyle.textContent +=
`@font-face {
    font-family: "Algol Font";
    font-weight: normal;
    font-style: normal;
    src: url("${fontBase64}") format("woff");
}`;

// injeta o ajuste da variável global do fator de escala 
headStyle.textContent +=
`@media (max-width: ${mobileBreakpoint}) {
    :root {
        --fator-escala: var(--fator-escala-break); /* Ajuste para o valor que desejar */
    }
}`;

document.head.appendChild(headStyle); // injeta o estilo no head