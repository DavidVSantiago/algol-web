
    class PagePublications extends PageBase{

        constructor(container, params) {
            super(container, params);
        }

        /** ****************************************************** */
        /** MÉTODOS SOBRESCRITOS ********************************* */
        /** ****************************************************** */

        /** @override */
        getPageId() { return 'publications'; }

        /** @override apenas se houver tradução para as páginas */ 
        getTranslationPath() { return '/js/pages/publications.json'; }

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
                        <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">${this.t.hero_title}</h2>
                    </algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>

                </algol-grid-layout>

                <algol-grid-layout cols="1fr" color="white" gap="2vw" padding="2vw" paddingbreak="1vw">
                    <algol-grid-item paddingbreak="2vw 0">
                        <h2 style="text-align:center;">${this.t.book1_title}</h2>
                        <p style="text-align:center;">${this.t.book1_subtitle}</p>
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
                                        <p>${this.t.book1_desc}</p>
                                    </algol-grid-item>

                                    <algol-grid-item posh="stretch">
                                        <algol-grid-layout cols="1fr" gap="2vw">
                                            <algol-grid-item>
                                                <p style="text-align:right;">
                                                    <p>${this.t.book1_isbn}</p>
                                                    <p>${this.t.book1_pages}</p>
                                                    <p>${this.t.book1_year}</p>
                                                    <p>${this.t.book1_publisher}</p>
                                                </p>
                                            </algol-grid-item>
                                            <algol-grid-item>
                                                <algol-button color="#4b81ff" textcolor="white" id="btn-download-livro">${this.t.btn_download_book}</algol-button>
                                                <algol-spacer value="1"></algol-spacer>
                                                <algol-button color="#f78a0d" textcolor="white" id="btn-download-arquivos">${this.t.btn_download_files}</algol-button>
                                                <algol-spacer value="1"></algol-spacer>
                                                <algol-button color="#e7303f" textcolor="white" id="btn-testar">${this.t.btn_test_game}</algol-button>
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

        /** ****************************************************** */
        /** MÉTODOS ESPECÍFICOS ********************************** */
        /** ****************************************************** */
    }