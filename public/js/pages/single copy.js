
class PageSingle extends PageBase{

    constructor(container) {
        super(container);
    }

    /** @override */
    render() {
        let cachedPostsHtml = null;// sessionStorage.getItem(this.dataCacheKey);

        const postsContent = cachedPostsHtml
            ? cachedPostsHtml
            : /* html */`
                <div id="single-container">
                    <h2 style="text-align: center;">
                        Carregando conteúdo...
                    </h2>
               </div>`;
               
        this.container.innerHTML = `
            ${postsContent}
        `;

        this.injectStyle(/* css */`
             #single-container{
                background-color: white;
             }
            #single-container a:link{
                text-decoration: underline;
                color: var(--site_global_color)
            }
            #single-container a:hover {
                color: rgb(88, 38, 155);
            }
            
            #single-container a:visited {
                text-decoration: none;
                color: rgb(128, 128, 128);
            }

            #single-container h2{
               
            }
            #single-container h3{
            
            }
            #single-container p, #single-container ul, #single-container ol, #single-container table{
            
            }
            #single-container ul, #single-container ol{
                padding-left: 4vw;
            }
            #single-container ul{
                list-style-type: disc;
            }
            #single-container li{
                margin-bottom: 1vw;
            }
            #single-container hr{
                margin-bottom: 7vw;
                margin-top: 7vw;
                border: 0.2vw solid #ccc;
            }
            #single-container img{

            }

            /* classes para estilização de tabelas */
            #single-container table{
                text-align: center;
                margin: auto;
            }
            #single-container table tr:nth-child(odd){background-color: #ddd;}
            #single-container table tr:nth-child(even){background-color: #eee;}
            #single-container table th, #single-container table td{padding: 1vw 2vw;}
            #single-container table th{
                background-color: #aaa;
                padding-bottom: 1vw;
                padding-top: 1vw;
            }
            #single-container table .blueHeader{
                background-color: rgb(80, 102, 148);
                color: white;
            }

            /* classes para estilização de abas */
            #single-container .container-abas .abas {
                list-style: none; /* Remove os marcadores padrão */
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
            #single-container .container-abas .abas .aba {
                text-decoration: none;
                text-align: center;
                color: #505050;
                background-color: #eee;
                border: 0.2vw #ddd solid;
                padding: 1vw;
                min-width: 6vw;
            }
            #single-container .container-abas .abas .aba.aba-ativa{
                color: #fff;
                background-color: var(--site_global_color);
                border-color:var(--site_global_color);
            }

            #single-container .container-abas .abas .aba:hover {
                background-color: #8a8a8a; /* Cor de fundo ao passar o mouse */
                color: #fff;
                border-color:#8a8a8a;
            }
            #single-container .container-abas .abas .aba.aba-ativa:hover {
                background-color: var(--site_global_color);
                border-color:var(--site_global_color);
            }

            #single-container .container-abas .conteudos {
                margin-top: 1vw; /* Espaçamento entre as abas e o conteúdo */
                background-color: #f6f6f6;
            }
            #single-container .container-abas .conteudo {
                display: none; /* Oculta todas as abas por padrão */
            }
            #single-container .container-abas .conteudo.conteudo-ativo {
                display: block; /* mostra apenas a aba com a classe .ativo */
            }

            /* classes para textos descritivos */
            #single-container .description{
                font-style: italic;
                color: rgb(85, 85, 85);
                text-align: center;
            }

            /* classes para textos estilizados */
            #single-container p.stylized_01{
                font-weight: bold;
                font-size: 2vw;
            }

            /* classes para divs separadoras */
            #single-container .separator-1{
                height: 2vw;
            }
            #single-container .separator-2{
                height: 4vw;
            }
            #single-container .separator-3{
                height: 6vw;
            }
            #single-container .separator-4{
                height: 8vw;
            }
            #single-container .separator-5{
                height: 10vw;
            }

            /* classes para tamanhos de imagens */
            #single-container .full-size-img-mobile, #single-container .less-size-img-mobile, #single-container .half-size-img-mobile, #single-container .quarter-size-img-mobile, #single-container .eighth-size-img-mobile{
                width: unset;
            }
            #single-container .full-size-img{
                width: 100% !important;
            }
            #single-container .less-size-img{
                width: 75% !important;
            }
            #single-container .half-size-img{
                width: 50% !important;
            }
            #single-container .quarter-size-img{
                width: 25% !important;
            }
            #single-container .eighth-size-img{
                width: 12.5% !important;
            }

            /* classes para animações de lotties */
            #single-container .lottie-anim{
                margin: auto;
            }
            #single-container .lottie-size-80-desktop, #single-container .lottie-size-80{
                width: 80%;
            }
            #single-container .lottie-size-70-desktop, #single-container .lottie-size-70{
                width: 70%;
            }
            #single-container .lottie-size-60-desktop, #single-container .lottie-size-60{
                width: 60%;
            }
            #single-container .lottie-size-50-desktop, #single-container .lottie-size-50{
                width: 50%;
            }
            #single-container .lottie-size-40-desktop, #single-container .lottie-size-40{
                width: 40%;
            }
            #single-container .lottie-size-30-desktop, #single-container .lottie-size-30{
                width: 30%;
            }
            #single-container .lottie-size-20-desktop, #single-container .lottie-size-20{
                width: 20%;
            }

            /* classes utils */
            #single-container .hide-desktop{
                display: none;
            }

            #single-container .youtube-player {
                width: 100%;
                /* Or set a specific width */
                height: auto;
                aspect-ratio: 16 / 9;
                margin-bottom: 6vw;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: black;
            }
        `);

        if (!cachedPostsHtml)
            this.loadData();
    }

    /** @override */
    async loadData() {
        const div = document.getElementById('single-container');
        if (!div) return;

        try {
            // Simula a demora
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await (await fetch('/_mocks/single.json'));
            const artigo = await response.json();
            const content = this.processSingleContent(artigo.content); // faz substituições de tags marcadas no artigo

            let stringHtml = `
                <algol-grid-layout posh="stretch" cols="1fr">
                    <algol-grid-item
                    img="${IMAGE_BUCKET}${artigo.featured_image_url}"
                    padding="15vw 5vw"
                    paddingbreak="30vw 5vw"
                    imgrepeat="no-repeat"
                    imgsize="cover"
                    imgpos="right"
                    imgoverlay="0.6"
                    posh="stretch">
                        <h2 style="text-align: center; color: white; text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) black;">${artigo.title}</h2>
                        <algol-spacer value="1.5"></algol-spacer>
                        <p style="text-align: center; color: white;">${artigo.excerpt}</p>
                        <algol-spacer value="1.5"></algol-spacer>
                        <p style="text-align: center; color: white;">${artigo.date}</p>
                    </algol-grid-item>

                    <algol-grid-item id="single-container">
                        ${content}
                    </algol-grid-item>
                </algol-grid-layout>
            `;

            div.outerHTML = stringHtml; // substitui a div pelo <algol-grid-layout>

        } catch (error) {
            console.error("Erro ao carregar artigos:", error);
            div.innerHTML = "<p>Erro ao carregar conteúdos.</p>";
        }
    }

    processSingleContent(rawContent) {
        if (!rawContent) return '';

        // Substitui todas as ocorrências de [[[filebucket]]] pelo domínio das imagens
        let processedContent = rawContent.replaceAll('[[[filebucket]]]', IMAGE_BUCKET);
        // Substituição do Domain
        processedContent = processedContent.replaceAll('[[[domain]]]', window.location.origin);

        return processedContent;
    }

}