class PagePosts extends PageBase{

    constructor(container, params) {
        super(container, params);
        this.dataCacheKey = 'dataCachePosts'; // cache de dados json, se houver
        // para paginação
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.totalPages = 1;
        this.isLoading = false;
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
                    
                    <div id="posts-wrapper">
                        ${postsContent}
                    </div> 
                    <algol-spacer value="4"></algol-spacer>
                    <div id="pagination-container" style="display: flex; justify-content: center; align-items: center; gap: 0.5vw; flex-wrap: wrap;"></div>
                   
                    <algol-spacer value="7" valuebreak="5"></algol-spacer>
                </algol-grid-item>

            </algol-grid-layout>
        `;

        document.getElementById('pagination-container')?.addEventListener('click', (e) => {
            const btn = e.target.closest('algol-button');
            if (!btn || btn.hasAttribute('disabled')) return;
            
            const targetPage = parseInt(btn.getAttribute('data-page'));
            if (targetPage && targetPage !== this.currentPage) {
                this.goToPage(targetPage);
            }
        });

        if (!cachedPostsHtml)
            this.loadData(1);
        else
            this.loadData(1, true); // Se a página 1 veio do cache, renderiza apenas os botões 
    }


    /** Muda a página e faz o scroll suave para o topo do conteúdo */
    async goToPage(page) {
        this.currentPage = page;
        
        const wrapper = document.getElementById('posts-wrapper');
        if (wrapper) {
            wrapper.innerHTML = /* html */`<div style="display: flex; justify-content: center; width: 100%; padding: 5vw 0;"><h2>Carregando página ${page}...</h2></div>`;
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        await this.loadData(page);
}

    /** @override */
    async loadData(page = 1, isRebuildingPaginationOnly = false) {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await fetch('/api/simple-posts/-1');
            const todosArtigos = await response.json();
            
            // Define o total de páginas
            const totalItems = todosArtigos.length;
            this.totalPages = Math.ceil(totalItems / this.postsPerPage);

            if (!isRebuildingPaginationOnly) {
                // Lógica de paginação simulada (Offset e Limit)
                const offset = (page - 1) * this.postsPerPage;
                const artigosDaPagina = todosArtigos.slice(offset, offset + this.postsPerPage);

                let stringHtml = `<algol-grid-layout class="card-bg" posh="stretch" cols="1fr 1fr 1fr" colsbreak="1fr" gap="1vw" gapbreak="10vw" style="align-items: start;">`;
                
                stringHtml += artigosDaPagina.map(artigo => /* html */`
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
                
                stringHtml += `</algol-grid-layout>`;

                const wrapper = document.getElementById('posts-wrapper');
                if (wrapper) wrapper.innerHTML = stringHtml;

                sessionStorage.setItem(this.dataCacheKey + page, stringHtml);
            }

            // Invoca a construção dos botões na interface
            this.renderPaginationBar();

        } catch (error) {
            console.error("Erro ao carregar artigos:", error);
            const wrapper = document.getElementById('posts-wrapper');
            if (wrapper) wrapper.innerHTML = "<p>Erro ao carregar conteúdos.</p>";
        } finally {
            this.isLoading = false;
        }
    }

    /** Renderiza os botões numéricos com suporte a elipses */
    renderPaginationBar() {
        const container = document.getElementById('pagination-container');
        if (!container) return; // guard
        
        if (this.totalPages <= 1) { // se não houver páginas
            container.innerHTML = '';
            return;
        }

        let html = '';

        if (this.currentPage > 1) { // se não for a página 1
            html += `<algol-button data-page="${this.currentPage - 1}">&larr;</algol-button>`;
        }

        for (let i = 1; i <= this.totalPages; i++) {
            // Renderiza a primeira, a última e as adjacentes à atual
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const isCurrent = (i === this.currentPage);
                const disabledState = isCurrent ? 'disabled' : '';
                
                html += `<algol-button data-page="${i}" ${disabledState}>${i}</algol-button>`;
            } 
            // Renderiza a elipse nos intervalos suprimidos
            else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += `<span style="font-weight: bold; padding: 0 0.5vw; color: var(--color-text, #555);">...</span>`;
            }
        }

        if (this.currentPage < this.totalPages) {
            html += `<algol-button data-page="${this.currentPage + 1}">&rarr;</algol-button>`;
        }

        container.innerHTML = html;
    }
}