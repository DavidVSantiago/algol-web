class Image extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
     
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_image_sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `
            <img src="https://picsum.photos/400/200" alt="">
            <slot></slot>
        `;
    }
    /** @override */
    postConfig(){
        
    }
    /** @override */
    attachEvents(){
        
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Atualiza a validação de form do elemento customizado
    _atualizarValidacao() {
        
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_image_sheet = new CSSStyleSheet();
algol_image_sheet.replaceSync(`
    :host {
        display: block; /* Garante que o componente respeite largura/altura */
    }
    img{
        width: 100%;       /* preenche tudo, pode distorcer */
        height: auto;
        object-fit: cover;   /* preenche tudo, pode cortar */
        display: block;     /* remove espaço fantasma */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-image', Image); // Registra o componente customizado