
class PageHome extends PageBase{

    constructor(container, params) {
        super(container, params);
        this.dataCacheKey = 'dataCacheHome'; // cache de dados json, se houver
    }

    /** @override */
    render() {
        let cachedPostsHtml = null;// sessionStorage.getItem(this.dataCacheKey);

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
                img="${IMAGE_BUCKET}/imagens/structural-site/slide-img-01.webp"
                padding="22vw 5vw"
                paddingbreak="60vw 5vw 5vw 5vw"
                imgrepeat="no-repeat"
                imgsize="cover"
                imgpos="center"
                posh="stretch">
                    <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Computação e Tecnologia</h2>
                    <algol-spacer value="1.5"></algol-spacer>
                    <h3 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">Conteúdos didáticos com máxima riqueza de recursos visuais</h3>
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
                                <h2>Programação Básica</h2>
                                <algol-spacer value="1.5"></algol-spacer>
                                <p>Inicie agora o seu aprendizado no maravilhoso mundo da programação de computadores.</p>
                        </algol-grid-item>
                    </algol-grid-layout>
                </algol-grid-item>

                <algol-grid-item>
                    <algol-spacer value="7" valuebreak="8"></algol-spacer>
                    <h3 style="text-align: center;">Conheça nossos conteúdos na página de artigos.</h3>
                    <algol-spacer value="3"></algol-spacer>
                    
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
            const response = await fetch('/api/simple-posts/6');
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