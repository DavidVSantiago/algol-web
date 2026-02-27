
    class PagePublications extends PageBase{

        constructor(container, params) {
            super(container, params);
        }

        /** @override */
        render() {
            this.container.innerHTML = /* html */ `
                <algol-grid-layout posh="stretch" cols="1fr">
                    <algol-grid-item
                    img="${IMAGE_BUCKET}/imagens/structural-site/books-page-cover.webp"
                    padding="15vw 5vw"
                    paddingbreak="30vw 5vw"
                    imgrepeat="no-repeat"
                    imgsize="cover"
                    imgpos="right"
                    imgoverlay="0.6"
                    posh="stretch">
                        <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Conheça as nossas publicações</h2>
                    </algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>

                </algol-grid-layout>

                <algol-grid-layout cols="1fr" color="white" gap="2vw">
                    <algol-grid-item padding="2vw 0">
                        <h2 style="text-align:center;">Game Dev Series vol.01:</h2>
                        <p style="text-align:center;">Fundamentos de algoritmos para jogos digitais (versão Java).</p>
                        <algol-spacer value="1"></algol-spacer>
                    </algol-grid-item>

                    <algol-grid-item>
                        <algol-grid-layout cols="0.8fr 1.2fr" colsbreak="1fr" gap="2vw">
                            <algol-grid-item posh="end">
                                <algol-image
                                size="30vw"
                                sizebreak="100%"
                                expand src="imagens/publications/gds1/book-gds1-java.webp" alt="landscape" width="500" height="483"
                                ></algol-image>
                            </algol-grid-item>
                            
                            <algol-grid-item>
                                <algol-grid-layout cols="1fr" gap="2vw">
                                    <algol-grid-item>
                                        <p>Diferente de tudo o que você já leu sobre programação para jogos! Aprenda a criar jogos usando apenas código de programação. Sem o uso de nenhuma Game Engine! Pensado nos mínimos detalhes, o GDS1 (Game Dev Series vol.01) te fornece, em 12 capítulos recheados de conteúdo, um passo a passo fantástico para você programar se divertindo.</p>
                                    </algol-grid-item>

                                    <algol-grid-item>
                                        <algol-grid-layout cols="1fr" colsbreak="0.4fr 0.6fr" gap="2vw">
                                            <algol-grid-item>
                                                <p style="text-align:right;">
                                                    ISBN: 978-65-00-07450-5
                                                    Páginas: 360
                                                    Ano de publicação: 2020
                                                    Editora: Algol.dev
                                                </p>
                                            </algol-grid-item>
                                            <algol-grid-item>
                                                <algol-button color="#4b81ff" textcolor="white" id="btn-download-livro">Baixar o livro</algol-button>
                                                <algol-spacer value="1"></algol-spacer>
                                                <algol-button color="#f78a0d" textcolor="white" id="btn-download-arquivos">Baixar arquivos do livro</algol-button>
                                                <algol-spacer value="1"></algol-spacer>
                                                <algol-button color="#e7303f" textcolor="white" id="btn-testar">Testar jogo</algol-button>
                                            </algol-grid-item>    
                                        </algol-grid-layout>
                                        <algol-spacer value="1"></algol-spacer>

                                    </algol-grid-item>

                                </algol-grid-layout>
                            </algol-grid-item>
                        </algol-grid-layout>
                    </algol-grid-item>
                </algol-grid-layout>
                <algol-spacer value="7" valuebreak="5"></algol-spacer>
            `;

            this.injectStyle(`
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                    #btn-testar{
                        display: none;
                    }
                }
            `);
        }

        /** @override */
        async loadData() {
            // nada para carregar
        }
    }