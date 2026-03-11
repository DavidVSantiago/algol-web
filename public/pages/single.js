
class PageSingle extends PageBase{

    constructor(container, params) {
        super(container, params);
    }

    /** ****************************************************** */
    /** MÉTODOS SOBRESCRITOS ********************************* */
    /** ****************************************************** */

    /** @override */
    getPageId() { return 'single'; }

    /** @override apenas se houver tradução para as páginas */ 
    getTranslationPath() { return '/pages/single.json'; }

    /** @override */
    async render() {   
        this.container.innerHTML = `
            <div id="single-container"></div>
        `;

        this.injectStyle(/* css */`
            #single-container{
                background-color: white;
                padding: 1vw;
                margin: 0 10vw 3vw 10vw;
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
                max-width: 100%;
                height: auto;
                margin: auto;
            }
            #single-container .youtube-player{
                width: 100%;
                height: auto;
                aspect-ratio: 16 / 9;
                margin-bottom: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #000;
            }
            #single-container .youtube-player .play{
                z-index: 1;
                position: absolute;
                cursor: pointer;
                width: 15vw;
            }
            #single-container .youtube-player #video-thumb{
                width: 100% !important;
                height: auto;
                opacity: .5;
                z-index: 0;
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

            /* Este arquivo contém os estilos específicos apenas de layout dos artigos do site */

            /***********************************************************************************************
            Flexbox Layout
            ***********************************************************************************************/
            #single-container ._flex{
                display: flex;
                gap: 10px;
                justify-content: center;
                align-items: center;
            }
            #single-container ._flex_BREAK{
                flex-wrap: wrap;
            }
            #single-container ._flex_H{flex-direction: row;}
            #single-container ._flex_H_REVERSE{flex-direction: row-reverse;}
            #single-container ._flex_H_LEFT{justify-content: left !important;}
            #single-container ._flex_H_RIGHT{justify-content: right !important;}

            #single-container ._flex_V{flex-direction: column;}
            #single-container ._flex_V_REVERSE{flex-direction: column-reverse;}
            #single-container ._flex_V_LEFT{align-items: start !important;}
            #single-container ._flex_V_RIGHT{align-items: right !important;}


            /***********************************************************************************************
            Grid Layout
            ***********************************************************************************************/
            #single-container ._grid{
                display: grid;
                gap: 10px;
            }
            #single-container ._grid_CENTER{
                justify-content: center;
                align-items: center;
            }
            #single-container ._2_cols_grid_A, #single-container ._2_cols_grid_A_FIXED{
                grid-template-columns: 1fr 1fr;
            }

            #single-container ._2_cols_grid_B, #single-container ._2_cols_grid_B_FIXED{
                grid-template-columns: 1fr 2fr;
            }
            #single-container ._2_cols_grid_C, #single-container ._2_cols_grid_C_FIXED{
                grid-template-columns: 2fr 1fr;
            }
            #single-container ._3_cols_grid_A, #single-container ._3_cols_grid_A_FIXED{
                grid-template-columns: 1fr 1fr 1fr;
            }
            #single-container ._3_cols_grid_B_FIXED{
                grid-template-columns: 1fr auto 1fr;
            }
            #single-container ._4_cols_grid_A{
                grid-template-columns: repeat(4, auto);
            }
            #single-container ._5_cols_grid_C, ._5_cols_grid_C_FIXED{
                grid-template-columns: repeat(5, auto);
            }

            /** subcomponents **/
            #single-container ._grid p, ._flex p{
                margin: 0;
            }

            /***********************************************************************************************
            Grid & Flexbox Layout
            ***********************************************************************************************/
            #single-container ._GAP-0{
                gap: 0;
            }

            /***********************************************************************************************
            Estilos
            ***********************************************************************************************/
            #single-container ._frame_A{
                border-width: 1px;
                border-radius: 10px;
                border-style: solid;
                border-color: black;
                padding: 5px;
                padding-bottom: 20px;
            }
            #single-container ._frame_B{
                border-width: 1px;
                border-radius: 0px;
                border-style: solid;
                border-color: black;
                padding: 5px;
                background-color: #ebebeb;
            }

            @media (max-width:${MOBILE_BREAKPOINT}){
                #single-container{
                    padding: 2vw;
                    margin: 0 0 10vw 0;
                }

                /***********************************************************************************************
                Flexbox Layout
                ***********************************************************************************************/
                #single-container ._flex{
                    gap: 2vw;
                }

                /***********************************************************************************************
                Grid Layout
                ***********************************************************************************************/
                #single-container ._grid{
                    grid-template-columns:  1fr;
                    gap: 2vw;
                }
                #single-container ._2_cols_grid_A_FIXED{
                    grid-template-columns: 1fr 1fr;
                }
                #single-container ._2_cols_grid_B_FIXED{
                    grid-template-columns: 1fr 2fr;
                }
                #single-container ._2_cols_grid_C_FIXED{
                    grid-template-columns: 2fr 1fr;
                }
                #single-container ._3_cols_grid_A_FIXED{
                    grid-template-columns:  1fr 1fr 1fr;
                }
                #single-container ._3_cols_grid_B_FIXED{
                    grid-template-columns: 1fr auto 1fr;
                }
                #single-container ._4_cols_grid_A{
                    grid-template-columns: repeat(2, auto);
                }
                #single-container ._5_cols_grid_C_FIXED{
                    grid-template-columns: repeat(5, auto);
                }
                
                /** subcomponents **/


                /***********************************************************************************************
                Grid & Flexbox Layout
                ***********************************************************************************************/


                /***********************************************************************************************
                Estilos
                ***********************************************************************************************/
                #single-container ._frame_A{
                    border-width: 0.1vw;
                    border-radius: 1.8vw;
                    padding: 1vw;
                    padding-bottom: 4vw;
                }
            }
        `);
        
        await this.loadData();
    }

    /** @override */
    async loadData() {
        const div = document.getElementById('single-container');
        if (!div) return;

        try {

            const response = await fetch(`/api/post/${this.params.slug}`);
            const artigo = await response.json();

            let stringHtml = "";

            if(document.documentElement.lang != artigo.idiom_name){ // se o idioma da página for diferente ao do artigo
                stringHtml = `
                <h2 style="margin: 5vw">${this.t.invalid_idiom}</h2>
                `
            }else{ // apenas constroi o conteúdo do single se o idioma for válido
                const content = this.processSingleContent(artigo.content); // faz substituições de tags marcadas no artigo
                stringHtml = `
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
                        
                        <algol-grid-item>
                            <algol-spacer value="1.5"></algol-spacer>
                        </algol-grid-item>

                        <algol-grid-item id="single-container">
                            ${content}
                        </algol-grid-item>
                    </algol-grid-layout>
                `;
            }

            div.outerHTML = stringHtml; // substitui a div pelo <algol-grid-layout>
            this.attachVideoEvents();

        } catch (error) {
            div.innerHTML = `<p>${this.t.error_load}</p>`;
        }
    }

    /** ****************************************************** */
    /** MÉTODOS ESPECÍFICOS ********************************** */
    /** ****************************************************** */

    processSingleContent(rawContent) {
        if (!rawContent) return '';

        // Substitui todas as ocorrências de [[[filebucket]]] pelo domínio das imagens
        let processedContent = rawContent.replaceAll('[[[filebucket]]]', IMAGE_BUCKET);
        // Substituição do Domain
        processedContent = processedContent.replaceAll('[[[domain]]]', window.location.origin);

        // === parse das tags do YOUTUBE ===
        // Regex captura o <img...> (grupo 1) e o ID do vídeo (grupo 2), ignorando possíveis quebras de linha ou tags <p> do editor
        const regexYT = /(<img[^>]*id="video-thumb"[^>]*>)\s*(?:<\/?p>|<br>)*\s*\[youtubeVideo\](.*?)\[\/youtubeVideo\]\s*(?:<\/?p>|<br>)*/gi;
        
        processedContent = processedContent.replace(regexYT, (match, imgTag, videoId) => {
            const playBtnBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABRBAMAAAATCYToAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRF/wAA////AAAA/wAA/wAA/wAA/wAA/5SU/zs7/8vL9SIQUQAAAAp0Uk5T//8AmsoVWv///yxtBrEAAAGnSURBVHicxdi9bsJADABgSwT2myhbRHudEQTmSIQdpT3mKGlubreOHfsIfdxeiCoSge3EVoWzZODLofv1GZb9sM77anOOJAvRvu68r13e/2UMHVMlWQpEROFDvs771J4SEvVi7zrUvg1259brCx0ngy3/6MtICTDJW2rT0RQOLR3f6LnZhhYCCmVDrUTCtKGPIjpp6FFEozzQQkShDHQlo+sYJKPaxCFQmYSpij4L6UxOJzHIZoSKRjE8SekRXoUUUPrN0iI8N+PjXU7Nl5wuGLvCqZlzFFlzgTKWpOZHTkmb0tQQQ8RRwqbhISk+RCzFLU/NnGiXoeZBTtEhGkDNp5wiQzSILuT09j8eQpF+GkDlPYzOCZZi8j/n8AJddSyl1iu91IkdhqHyvYncTVX7cIFS5uQgKHfmEMcVd0riFNkZuhRJTPlTXZ5LKNKQQBV5kyJbu0N6ObtXKq3I/RU3Ds09Rzidct2dTnGTlPXTWntrVtzVFRWCpS3G0u2lGjKyp7bdGkw1vAYT7et+5ce6U5VkHMv2u9pdFY3acO7kvd9ch7+qOMW/pI+FJpVAMyIAAAAASUVORK5CYII=";
            
            return `
            <div class="youtube-player" data-id="${videoId}">
                <img decoding="async" class="play" width="115" height="81" src="${playBtnBase64}" alt="algol-youtube-play">
                ${imgTag}
            </div>
            `;
        });
        
        return processedContent;
    }

    /** Busca todos os botões de play renderizados e atrela o evento de clique */
    attachVideoEvents() {
        // Busca todos os botões com a classe 'play' dentro de 'youtube-player'
        const playButtons = this.container.querySelectorAll('.youtube-player .play');
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', (event) => this.playYoutubeVideo(event));
        });
    }

    /** Lógica de substituição da div pelo iframe */
    playYoutubeVideo(event) {
        // event.currentTarget pega exatamente o elemento que sofreu o clique (a imagem)
        const playBtn = event.currentTarget;
        const playerContainer = playBtn.closest('.youtube-player');
        
        if (!playerContainer) return;

        const videoId = playerContainer.getAttribute('data-id');
        const separador = videoId.includes('?') ? '&' : '?';
        const iframeSrc = `https://www.youtube.com/embed/${videoId}${separador}autoplay=1`;

        const iframeHTML = /* html */`
            <iframe 
                src="${iframeSrc}" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                frameborder="0" 
                allowfullscreen="1"
                style="width: 100%; height: 100%; aspect-ratio: 16/9;">
            </iframe>
        `;

        playerContainer.innerHTML = iframeHTML;
    }

}