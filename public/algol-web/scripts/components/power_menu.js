class PowerMenu extends BaseComponent {
    static useShadow = false; // Usa shadow DOM?
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
            'logo': 'update_logo',
            'logoalt': 'update_logoalt',
            'logolink': 'update_logolink',
            'logowidth': 'update_logowidth',
            'logoheight': 'update_logoheight',
        };
    }
    static get ATTR_MAP() {
        return {
            'logosize': '--power-menu-logosize',
            'logosizebreak': '--power-menu-logosizebreak',
        }
    }
    static get observedAttributes() {return [...Object.keys(PowerMenu.PROP_MAP), ...Object.keys(PowerMenu.ATTR_MAP)];}
    constructor() {super();}

    static template = document.createElement('template');
    static {
        this.template.innerHTML = `
            <header class="menu">
                <div class="menu-toggle" title="Menu mobile">
                    <span></span><span></span><span></span>
                </div>
                <div class="menu-overlay"></div>
                <a class="logo-link"><img class="logo"/></a>
                <nav class="menu-btns">
                    <ul>
                    </ul>
                </nav>
            </header>
        `;
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.elems.savedChildren = Array.from(this.children); // salva os filhos do componente
        this.textContent = ''; // limpa o conteúdo original passado para o componente

        // rendezida com base no template
        const content = PowerMenu.template.content.cloneNode(true);
        this.root.appendChild(content);
    }
    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.menu = this.root.querySelector('.menu');
        this.elems.logoLink = this.root.querySelector('.logo-link');
        this.elems.logo = this.root.querySelector('.logo');
        this.elems.menuToggle = this.root.querySelector('.menu-toggle');
        this.elems.menuBtns = this.root.querySelector('.menu-btns');
        this.elems.ul = this.root.querySelector('.menu-btns ul');
        this.elems.menuOverlay = this.root.querySelector('.menu-overlay');

        this._sincronizarMenuOptions(); // adiciona as opções ao menu
    }
    /** @override */
    attachEvents(){
        this.elems.menuToggle.addEventListener('click', () =>{
            this.elems.menuBtns.classList.toggle('show');
            this.elems.menuOverlay.classList.toggle('show');
        });
        this.elems.menuOverlay.addEventListener('click', () =>{
            this.elems.menuBtns.classList.toggle('show');
            this.elems.menuOverlay.classList.toggle('show');
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    update_logo(val) {
        if (!this.elems.logo) return; // guard
        // Assume que vai dar certo (mostra img, esconde erro) enquanto carrega
        this.elems.logo.src = val;
    }
    update_logoalt(val) {
        if (!this.elems.logo) return; // guard
        this.elems.logo.alt = val;
    }
    update_logolink(val) {
        if (!this.elems.logo) return; // guard
        this.elems.logoLink.href = val;
    }
    update_logowidth(val){
        if (!this.elems.logo) return; // guard
        this.elems.logo.width = val;
    }
    update_logoheight(val){
        if (!this.elems.logo) return; // guard
        this.elems.logo.height = val;
    }
    update_logoheight(val){
        if (!this.elems.logo) return; // guard
        this.elems.logo.height = val;
    }
   
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // 
    _sincronizarMenuOptions() {
        const ul = this.elems.ul;
        ul.innerHTML = ''; // limpa o menu
        let childCount = 0;
        // transfere as opções do menu para dentro da lista <ul>
        for(const li of this.elems.savedChildren){ 
            if (li.tagName.toLowerCase() === 'li') { // garante que é uma tag <li>
                const node = li.firstElementChild; // obtém o conteúdo    
                if (!node) continue; // se não tem filho, ignora e não adiciona
                
                // caso de um elemento <a>
                if(node.tagName.toLowerCase() === 'a' || node.tagName.toLowerCase() === 'div'){
                    li.classList.add('li-link-wrapper');
                }else { // caso seja um outro tipo de elemento
                    li.classList.add('li-element-wrapper');
                }
                 
                ul.appendChild(li);
                childCount++; // incrementa o contador de filhos
            }
        };
        ul.style.gridTemplateColumns = `repeat(${childCount}, auto)`;
    }

    // ****************************************************************************
    // Injeção de estilo CSS
    // ****************************************************************************
    
    static injectStyles() {
        const css = `
            algol-power-menu {
                display: block; 
                /* Reset básico para garantir que estilos globais não quebrem o layout */
                line-height: normal;
            }

            algol-power-menu .menu{
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: max-content;
                background-color: var(--bg-D);
                z-index: 99;
                padding-left: calc(1.5vw * var(--scale-factor));
                padding-right: calc(0.6vw * var(--scale-factor));
                padding-top: calc(0.4vw * var(--scale-factor));
                padding-bottom: calc(0.4vw * var(--scale-factor));
                border-bottom: calc(0.4vw * var(--scale-factor)) solid var(--bg-C);
            }

            algol-power-menu .menu .menu-toggle {
                display: none;
                cursor: pointer;
                z-index: 98;
                
                
            }
            algol-power-menu .menu .menu-toggle span {
                display: block;
                height: calc(0.4vw * var(--scale-factor));
                width: calc(2.5vw * var(--scale-factor));
                margin: calc(0.5vw * var(--scale-factor)) 0;
                border-radius: calc(0.5vw * var(--scale-factor));
                background: var(--text-A);
                box-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) var(--bg-A);

            }

            algol-power-menu .menu .menu-overlay{
                    display: none;
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 96;
                    background-color: var(--overlay);
            }
            
            algol-power-menu[logolink] .menu .logo{
                cursor: pointer;
                text-decoration: none;
                width: 100%;
                height: 100%;
            }
            algol-power-menu[logosize] .menu .logo{width: var(--power-menu-logosize) !important;}

            algol-power-menu .menu .logo-link,
            algol-power-menu .menu .menu-btns ul .li-link-wrapper a{
                color: var(--text-A);
                text-decoration: none;
                cursor: unset;
                display: flex;
                min-height: calc(3.5vw * var(--scale-factor));
                align-items: center;
                padding: 0 calc(1vw * var(--scale-factor));
            }

            algol-power-menu .menu .logo-link .logo{width: calc(3vw * var(--scale-factor));}

            algol-power-menu .menu .menu-btns,
            algol-power-menu .menu .menu-btns * {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }   
                
            algol-power-menu .menu .menu-btns{
                box-sizing: border-box;
                height: 100%;
                z-index: 97;
                padding-bottom: 0;
            }

            algol-power-menu .menu .menu-btns ul{
                display: grid;
                gap: calc(0.5vw * var(--scale-factor));
                align-items: center;
                justify-items: center;
                height: 100%;
                margin: 0;
                padding: 0;
                list-style: none;
            }
            
            algol-power-menu .menu .menu-btns ul .li-link-wrapper,
            algol-power-menu .menu .menu-btns ul .li-element-wrapper{
                min-height: calc(3.5vw * var(--scale-factor));
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                text-shadow: 0 calc(0.1vw * var(--scale-factor)) calc(0.1vw * var(--scale-factor)) var(--bg-A);
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper{
                cursor: pointer;
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper:hover{
                background-color: var(--bg-C);
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper:active{
                background-color: var(--bg-B);

            }
        
            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-power-menu .menu{
                    padding: calc(0.5vw * var(--scale-factor)) calc(1vw * var(--scale-factor));
                    position: fixed;
                    width: 100vw;
                    top: 0;
                    left: 0;
                }

                algol-power-menu .menu .menu-toggle {
                    display: block;
                }

                algol-power-menu .menu .menu-overlay.show{
                    display: block;
                }

                algol-power-menu[logosizebreak] .menu .logo{width: var(--power-menu-logosizebreak) !important;}

                algol-power-menu .menu .logo-link .logo{width: calc(3vw * var(--scale-factor));}

                algol-power-menu .menu .menu-btns{
                    visibility: hidden;
                    position: absolute;
                    width: 100vw;
                    top: 0;
                    left: 0;
                    height: max-content;
                    padding-top: calc(5vw * var(--scale-factor));
                    padding-bottom: calc(1vw * var(--scale-factor));
                    transform: translateY(-100%);
                    transition: transform 0.3s ease, visibility 0.3s ease;
                    background-color: var(--bg-D);
                }
                algol-power-menu .menu .menu-btns.show {
                    visibility: visible;
                    transform: translateY(0);
                }

                algol-power-menu .menu .menu-btns ul{
                    display: flex;
                    flex-direction: column;
                    gap: calc(1vw * var(--scale-factor));
                }

                algol-power-menu .menu .menu-btns ul .li-link-wrapper{
                    min-height: calc(3.5vw * var(--scale-factor));
                }
            }
        `;
        BaseLayout._injectStyleOnHead('algol-power-menu-style', css);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-power-menu', PowerMenu); // Registra o componente customizado
PowerMenu.injectStyles(); // injeta CSS desse componente