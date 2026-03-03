
class PageHome extends PageBase{

    constructor(container, params) {
        super(container, params);
        this.dataCacheKey = 'dataCacheHome'; // cache de dados json, se houver
        this.i18nCacheKey = 'i18nHome'; // cache das traduções
        this.t = null; // guardará o dicionário atual
    }

    async loadTranslations(lang){
        if(this.t) return; // se ja carregou, encerra

        // tenta buscar o dicionário no cache (para evitar fetch)
        const cachedI18n = sessionStorage.getItem(this.i18nCacheKey);
        if(cachedI18n){ // se conseguiu recuperar o dicionario do cache
            const allTranslations = JSON.parse(cachedI18n); // desistringfica
            this.t = allTranslations[lang] || allTranslations['pt-br']; // obtém o objeto do idioma
            return;
        }

        // se não há cache, mostra msg de loading pra fazer fetch
        this.container.innerHTML = `<h2 style="text-align: center; margin-top: 5vw;">Loading...</h2>`;
        try {
            // busca as traduções da página
            const response = await fetch('/js/pages/home.json');
            const allTranslations = await response.json();
            // Salva o JSON completo no cache
            sessionStorage.setItem(this.i18nCacheKey, JSON.stringify(allTranslations));
            // obtém o objeto do idioma
            this.t = allTranslations[lang] || allTranslations['pt-br'];
        } catch (error) {
            console.error("Erro ao carregar home.json:", error);
            // Fallback de emergência caso o arquivo falhe
            this.t = { loading: "Carregando...", hero_title: "Computação", error_load: "Erro." }; 
        }
    }

    /** @override */
    async render() {
        const lang = document.documentElement.lang || 'pt-br';

        // 1. Aguarda as traduções estarem prontas
        await this.loadTranslations(lang);

        let cachedPostsHtml = null;// sessionStorage.getItem(this.dataCacheKey);

        const postsContent = cachedPostsHtml
            ? cachedPostsHtml
            : /* html */`
                <div id="posts-container">
                    <h2 style="text-align: center;">
                        ${this.t.loading}
                    </h2>
               </div>`;
               
        this.container.innerHTML = /* html */ `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item
                img="${IMAGE_BUCKET}/imagens/structural-site/slide-img-01.webp"
                padding="22vw 5vw"
                paddingbreak="60vw 5vw 5vw 5vw"
                imgrepeat="no-repeat"
                imgsize="cover"
                imgpos="center"
                posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">
                        ${this.t.hero_title}
                    </h2>
                    <algol-spacer value="1.5"></algol-spacer>
                    <h3 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">
                        ${this.t.hero_subtitle}
                    </h3>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                    <a href="/publications" onclick="route(event)" style="text-decoration: none; color: inherit;">
                        <algol-grid-layout class="card-bg" posh="stretch" cols="0.3fr 0.7fr" colsbreak="1fr" gap="1vw">
                            <algol-grid-item padding="1vw">
                                    <algol-image
                                    size="100%"
                                    radius="1vw"
                                    expand src="${IMAGE_BUCKET}/imagens/publications/gds1/book-gds1-java.webp" alt="landscape" width="400" height="200"></algol-image>
                            </algol-grid-item>
                            <algol-grid-item padding="0 2vw" paddingbreak="5vw 3vw" posh="start">
                                    <h2>${this.t.book_title}</h2>
                                    <algol-spacer value="1.5"></algol-spacer>
                                    <p>${this.t.book_desc}</p>
                            </algol-grid-item>
                        </algol-grid-layout>
                    </a>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="8"></algol-spacer>
                    <h3 style="text-align: center;">${this.t.articles_title}</h3>
                    <algol-spacer value="3"></algol-spacer>
                    
                    ${postsContent}
                    
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                </algol-grid-item>
            </algol-grid-layout>
        `;

        if (!cachedPostsHtml)
           await this.loadData();
    }

    /** @override */
    async loadData() {
        const div = document.getElementById('posts-container');
        if (!div) return;
        try {
            const lang = document.documentElement.lang; // obtem o idioma atual da página
            const response = await fetch(`/api/simple-posts?limit=${6}&lang=${lang}`);
            const artigos = await response.json();
            
            let stringHtml = `<algol-grid-layout  class="card-bg" posh="stretch" cols="1fr 1fr 1fr" colsbreak="1fr 1fr" gap="1vw">`
            stringHtml += artigos.map(artigo => /* html */`
                <algol-grid-item padding="1vw">
                    <a href="/${artigo.slug}" onclick="route(event)">
                        <algol-image radius="0.4vw" size="100%" src="${IMAGE_BUCKET}${artigo.featured_image_url}" alt="landscape" width="400" height="200"></algol-image>
                        <p style="text-align:center;">${artigo.title}</p>
                    </a>
                </algol-grid-item>
            `).join('');
            stringHtml += `</algol-grid-layout>`
            div.outerHTML = stringHtml; // substitui a div pelo <algol-grid-layout>
            sessionStorage.setItem(this.dataCacheKey, stringHtml); // salva no cache do sessionStorage para evitar recarregar do servidor

        } catch (error) {
            console.error("Erro ao carregar artigos:", error);
            div.innerHTML = "<p>Erro ao carregar conteúdos.</p>";
        }
    }
}