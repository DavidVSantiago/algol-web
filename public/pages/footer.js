
    class ComponentFooter extends PageBase{

        constructor(container, params) {
            super(container, params);
        }

        /** ****************************************************** */
        /** MÉTODOS SOBRESCRITOS ********************************* */
        /** ****************************************************** */

        /** @override */
        getPageId() { return 'footer'; }

        /** @override apenas se houver tradução para as páginas */ 
        getTranslationPath() { return '/pages/footer.json'; }

        /** @override */
        render() {
            const page_content = document.getElementById('app');
            const currentYear = new Date().getFullYear(); // TODO Buscar do servidor
            
            this.container.innerHTML = /* html */ `
                <algol-grid-layout cols="1fr" id="footer">
                    <algol-grid-item>
                        <algol-spacer value="1.2"></algol-spacer>
                        <algol-image size="12vw" sizebreak = "30vw" 
                            src="${IMAGE_BUCKET}/imagens/structural-site/logo_h_pb.svg" alt="logo" width="91" height="100">
                        </algol-image>
                    </algol-grid-item>
                    <algol-flex-item posh="stretch">
                        <algol-spacer value="1.2" valuebreak="2"></algol-spacer>
                            <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                                <p>${this.t.subscribe}&nbsp;</p>
                            </a>
                            <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                                <algol-image size="2vw" sizebreak="7vw"
                                    src="https://algol-bucket.b-cdn.net/imagens/structural-site/icon-youtube.svg" alt="logo" width="91" height="100">
                            </a>
                    </algol-flex-item>
                    <algol-flex-item>
                        <algol-spacer value="1.2" valuebreak="2"></algol-spacer>   
                        <p><a href="#">${this.t.terms}</a></p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p><a href="#">${this.t.privacy}</a></p>
                        <algol-spacer value="1.2"></algol-spacer>
                    </algol-flex-item>
                    <algol-grid-item id="ano" padding="1.5vw 0" posh="stretch">
                        <p>©${currentYear} Algol.dev. ${this.t.rights}.</p>
                    </algol-grid-item>
                </algol-grid-layout>
            `;

            this.injectStyle(/* css */ `
                #footer{
                    background-color: #24272d;
                    color: white;
                    #ano{
                        background-color: #222;
                        text-align: center;
                    }
                    a{color: white; text-decoration: none;}
                    a:hover{color: rgb(172, 190, 255);}
                    a:active{color: rgb(97, 124, 222);}
                }
            `,"footer-style");
        }

        /** @override */
        async loadData() {
            // nada para carregar
        }

        /** ****************************************************** */
        /** MÉTODOS ESPECÍFICOS ********************************** */
        /** ****************************************************** */

        /** Muda o idioma da página */
        changeLanguage(newLang) {
            // 1. Salva a nova preferência no localstorage
            localStorage.setItem('app_lang', newLang);

            document.documentElement.lang = newLang; // altera na tag html

            // TODO - Essa mecanica abaixo tem que levar em consideração a politica de cache que ainda será implementada
            // 2. Limpa o sessionStorage. 
            // Como suas classes PageHome e PagePosts usam sessionStorage para evitar recarregar dados do Elysia,
            // nós precisamos limpar esse cache. Caso contrário, o layout muda para inglês, mas os posts continuam em português.
            sessionStorage.clear();

            window.location.reload(); // 3. Recarrega a página para reaplicar as traduções
        }
    }