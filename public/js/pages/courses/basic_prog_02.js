class PageBasicProg02 extends PageBase{

    constructor(container, params) {
        super(container, params);
        this.courseData = [
            {
                "imgurl":"/imagens/posts/_covers/2020/algoritmos_algorithm_cover.webp",
                "title":"01 - Algoritmo: o que é?",
                "description":"Você sabe o que é um algoritmo? Neste artigo você vai aprender de uma forma nunca vista antes em um conteúdo gratuito! E ainda tem exercício!",
                "link":"/algoritmo-o-que-e",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/comandos_entrada_saida_input_output_cover.webp",
                "title":"02 - Comandos de entrada e saída: o seu início na programação",
                "description":"Dê seus primeiros passos na programação. Aprenda sobre os comandos de entrada e saída, e como ele te permite se comunicar com o computador.",
                "link":"/comandos-entrada-saida-inicio-programacao",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/variavel_variable_cover.webp",
                "title":"03 - Variável: O que é?",
                "description":"Aprenda o significado de uma variável. Entenda como as linguagens de programação as utilizam para armazenar e processar as informações.",
                "link":"/variavel-o-que-e",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/oper_atribuicao_cover.webp",
                "title":"04 - Operador de atribuição",
                "description":"Aprenda sobre o operador de atribuição, o mais simples da programação. Veja como ele é usado para colocar informações dentro das variáveis.",
                "link":"/operador-de-atribuicao",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/operadores_aritmeticos_arithmetic_operators_cover-b.webp",
                "title":"05 - Operadores aritméticos",
                "description":"Aprenda sobre a 2ª categoria de operadores. Veja como os operadores aritméticos são usados para realizar cálculos matemáticos.",
                "link":"/operadores-aritmeticos",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/declaracoes_condicionais_conditional_statements_cover.webp",
                "title":"06 - Declarações condicionais",
                "description":"As declarações condicionais te permitem criar algoritmos mais inteligentes, fazendo-os tomar decisões durante a sua execução.",
                "link":"/declaracoes-condicionais",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/operadores_relacionais-b.webp",
                "title":"07 - Operadores relacionais",
                "description":"Aprenda sobre a 3ª categoria de operadores. Veja como os operadores relacionais são usados para criar expressões condicionais.",
                "link":"/operadores-relacionais",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/operadores_logicos_logical_operators_cover_b.webp",
                "title":"08 - Operadores lógicos",
                "description":"Aprenda sobre a 4ª categoria de operadores. Veja como os operadores lógicos são usados para criar expressões condicionais complexas.",
                "link":"/operadores-logicos",
                "lang":"pt-br"
            },
            {
                "imgurl":"/imagens/posts/_covers/2020/operadores_compostos_cover.webp",
                "title":"09 - Operadores compostos",
                "description":"Aprenda sobre a 5ª categoria de operadores. Veja como os operadores compostos, tais como o de incremento e decremento, simplificam os cálculos.",
                "link":"/operadores-compostos",
                "lang":"pt-br"
            }
        ]
    }

    /** @override */
    render() {
        const coursesHTML = this.courseData.map(course => `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item color="#fff">
                    <a href="${course.link}" onclick="route(event)" style="text-decoration: none; color: inherit;">
                        <algol-grid-layout class="card-bg" posh="stretch" cols="0.3fr 0.7fr" colsbreak="1fr" gap="1vw">

                            <algol-grid-item padding="1vw">
                                <algol-image 
                                    radius="0.1vw" 
                                    size="100%" 
                                    src="${IMAGE_BUCKET}${course.imgurl}" 
                                    alt="landscape" 
                                    width="400" 
                                    height="200">
                                </algol-image>
                            </algol-grid-item>

                            <algol-grid-item padding="0 2vw" paddingbreak="5vw 3vw" posh="start">
                                <h2>${course.title}</h2>
                                <algol-spacer value="1.5"></algol-spacer>
                                <p>${course.description}</p>
                            </algol-grid-item>

                        </algol-grid-layout>
                    </a>
                </algol-grid-item>
            </algol-grid-layout>
            <algol-spacer value="3" valuebreak="5"></algol-spacer>
        `).join('');
        
        this.container.innerHTML = `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item
                    img="${IMAGE_BUCKET}/imagens/cursos/programacao-basica/programacao-basica-basic-programming-02-cover.webp"
                    padding="15vw 5vw"
                    paddingbreak="30vw 5vw"
                    imgrepeat="no-repeat"
                    imgsize="cover"
                    imgpos="right"
                    imgoverlay="0.6"
                    posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">
                        Basic programming - part 02
                    </h2>
                </algol-grid-item>
            </algol-grid-layout>

            <algol-spacer value="7" valuebreak="5"></algol-spacer>

            ${coursesHTML}

            <algol-spacer value="7" valuebreak="5"></algol-spacer>
        `;
    }

    /** @override */
    async loadData() {
        // nada para carregar
    }
}