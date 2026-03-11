
    class ComponentMenu extends PageBase{

        constructor(container, params) {
            super(container, params);
        }

        /** ****************************************************** */
        /** MÉTODOS SOBRESCRITOS ********************************* */
        /** ****************************************************** */

        /** @override */
        getPageId() { return 'menu'; }

        /** @override apenas se houver tradução para as páginas */ 
        getTranslationPath() { return '/pages/menu.json'; }

        /** @override */
        render() {
            const currentLang = document.documentElement.lang; // obtém o idioma atual da página
            const selectPt = currentLang === 'pt-br' ? 'selected' : '';
            const selectEn = currentLang === 'en-us' ? 'selected' : '';
            
            this.container.innerHTML = /* html */ `
                <algol-power-menu id="menu"
                    logo="${IMAGE_BUCKET}/imagens/structural-site/logo_h.svg"
                    logoalt="logo"
                    logolink="/"
                    logowidth = 91
                    logoheight = 100
                    logosize = "12vw"
                    logosizebreak = "30vw"
                    >
                    <li><a href="/" onclick="route(event)">${this.t.home}</a></li>
                    <li><a href="/posts" onclick="route(event)">${this.t.articles}</a></li>
                    <li><a href="/publications" onclick="route(event)">${this.t.publications}</a></li>
                    <li>
                        <algol-select name="select" id="select-lang">
                            <option value="pt-br" ${selectPt}>Português &#x1F1E7;&#x1F1F7;</option>  
                            <option value="en-us" ${selectEn}>English &#x1F1FA;&#x1F1F8;</option>
                        </algol-select>
                    </li>
                </algol-power-menu>
            `;

            // evento para clique no seletor de idioma
            document.getElementById("select-lang").addEventListener('algol-change', (e) => {
                const selectedLang = e.detail.value;
                if (selectedLang !== currentLang) { // se a selecionada é diferente da atual
                    this.changeLanguage(selectedLang);
                }
            });

            // eventos para recolher o menu quando houver clique nos botão (modo mobile)
            const butons = document.querySelectorAll('#menu li:has(a)');
            butons.forEach(button => {
                button.addEventListener("click", function (event) {
                    document.getElementById('menu').hide();
                });
            });


            this.injectStyle(/* css */ `
                #menu{
                    font-family: 'Roboto Condensed Regular' !important;
                }
            `,"menu-style");
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
            // sessionStorage.clear();

            window.location.reload(); // 3. Recarrega a página para reaplicar as traduções
        }
    }