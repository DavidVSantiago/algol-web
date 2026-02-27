
class PageCourses extends PageBase{

    constructor(container) {
        super(container);
    }

    /** @override */
    render() {
        this.container.innerHTML = /* html */ `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item
                img="${IMAGE_BUCKET}/imagens/structural-site/course-page-cover.webp"
                padding="15vw 5vw"
                paddingbreak="30vw 5vw"
                imgrepeat="no-repeat"
                imgsize="cover"
                imgpos="right"
                imgoverlay="0.6"
                posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Escolha o seu curso gratuito</h2>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                    <algol-grid-layout class="card-bg" posh="stretch" cols="0.3fr 0.7fr" colsbreak="1fr" gap="1vw">
                        <algol-grid-item>
                                <algol-image
                                size="100%"
                                radius="1vw"
                                expand src="${IMAGE_BUCKET}/imagens/cursos/programacao-basica/programacao-basica-basic-programming-01-cover.webp" alt="landscape" width="400" height="200"></algol-image>
                        </algol-grid-item>
                        <algol-grid-item padding="0 2vw" paddingbreak="5vw 3vw" posh="start">
                                <h2>Programação básica - parte 01</h2>
                                <algol-spacer value="1.5"></algol-spacer>
                                <p>Comece com os conceitos básicos de programação de computadores.</p>
                        </algol-grid-item>
                    </algol-grid-layout>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                    <algol-grid-layout class="card-bg" posh="stretch" cols="0.3fr 0.7fr" colsbreak="1fr" gap="1vw">
                        <algol-grid-item>
                                <algol-image
                                size="100%"
                                radius="1vw"
                                expand src="${IMAGE_BUCKET}/imagens/cursos/programacao-basica/programacao-basica-basic-programming-02-cover.webp" alt="landscape" width="400" height="200"></algol-image>
                        </algol-grid-item>
                        <algol-grid-item padding="0 2vw" paddingbreak="5vw 3vw" posh="start">
                                <h2>Programação básica - parte 02</h2>
                                <algol-spacer value="1.5"></algol-spacer>
                                <p>Agora que você sabe o básico da programação de computadores, vamos para os assuntos mais desafiadores</p>
                        </algol-grid-item>
                    </algol-grid-layout>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                    <algol-grid-layout class="card-bg" posh="stretch" cols="0.3fr 0.7fr" colsbreak="1fr" gap="1vw">
                        <algol-grid-item>
                                <algol-image
                                size="100%"
                                radius="1vw"
                                expand src="${IMAGE_BUCKET}/imagens/cursos/analise-de-algoritmos/algorithm-analysis-course.webp" alt="landscape" width="400" height="200"></algol-image>
                        </algol-grid-item>
                        <algol-grid-item padding="0 2vw" paddingbreak="5vw 3vw" posh="start">
                                <h2>Análise de algoritmos - parte 01</h2>
                                <algol-spacer value="1.5"></algol-spacer>
                                <p>Aprenda, de forma detalhada, a medir desempenho de algoritmos.</p>
                        </algol-grid-item>
                    </algol-grid-layout>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                </algol-grid-item>

            </algol-grid-layout>
        `;
    }

    /** @override */
    async loadData() {
        // nada para carregar
    }
}