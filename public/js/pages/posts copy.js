class PagePosts extends PageBase{

    constructor(container) {
        super(container);
        this.dataCacheKey = 'dataCachePosts'; // cache de dados json, se houver
    }

    /** @override */
    render() {
        let cachedPostsHtml = null; // sessionStorage.getItem(this.dataCacheKey);

        const postsContent = cachedPostsHtml
            ? cachedPostsHtml
            : /* html */`
                <div id="posts-container">
                    <h2 style="text-align: center;">
                        Carregando conteúdo...
                    </h2>
               </div>`;
               
        this.container.innerHTML = /* html */ `
            <algol-grid-layout posh="stretch" cols="1fr">
                <algol-grid-item
                img="${IMAGE_BUCKET}/imagens/structural-site/articles-page-cover.webp"
                padding="15vw 5vw"
                paddingbreak="30vw 5vw"
                imgrepeat="no-repeat"
                imgsize="cover"
                imgpos="right"
                imgoverlay="0.6"
                posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Os mais variados assuntos sobre computação e tecnologia</h2>
                </algol-grid-item>
                
                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="8"></algol-spacer>
                    
                    ${postsContent}
                    
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                </algol-grid-item>

            </algol-grid-layout>
        `;

        if (!cachedPostsHtml)
            this.loadData();
    }

    /** @override */
    async loadData() {
        const div = document.getElementById('posts-container');
        if (!div) return;

        try {
            // Simula a demora
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await (await fetch('/_mocks/posts.json'));
            const artigos = await response.json();
            
            let stringHtml = `<algol-grid-layout  class="card-bg" posh="stretch" cols="1fr 1fr 1fr" colsbreak="1fr" gap="1vw" gapbreak="10vw">`
            stringHtml += artigos.map(artigo => /* html */`
                <algol-grid-item padding="1vw">
                    <algol-image radius="0.1vw" size="100%" src="${IMAGE_BUCKET}${artigo.featured_image_url}" alt="landscape" width="400" height="200"></algol-image>
                    <algol-grid-layout cols="1fr" color="white">
                        <algol-grid-item padding="1vw" paddingbreak="4vw">
                            <algol-spacer value="1"></algol-spacer>
                            <h3 style="text-align:left;">${artigo.title}</h3>
                            <algol-spacer value="1"></algol-spacer>
                            <p style="text-align:left;">${artigo.excerpt}</p>
                            <algol-spacer value="1"></algol-spacer>
                        </algol-grid-item>
                    </algol-grid-layout>
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