
class PageAlgoAnalysis01 extends PageBase{

    constructor(container, params) {
        super(container, params);
    }

    /** @override */
    render() {
        this.container.innerHTML = /* html */ `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item
                img="${IMAGE_BUCKET}/imagens/cursos/analise-de-algoritmos/algorithm-analysis-course.webp"
                padding="15vw 5vw"
                paddingbreak="30vw 5vw"
                imgrepeat="no-repeat"
                imgsize="cover"
                imgpos="right"
                imgoverlay="0.6"
                posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Algorithm analysis - part 01</h2>
                </algol-grid-item>
            </algol-grid-layout>
        `;
    }

    /** @override */
    async loadData() {
        // nada para carregar
    }
}