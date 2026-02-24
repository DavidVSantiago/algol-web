/**
 * Componente Web `<algol-image>`.
 *
 * Encapsula um elemento `<img>` com:
 *  - fallback visual para erro de carregamento
 *  - suporte a lazy loading
 *  - modo expandido (width: 100%)
 *  - disparo de eventos customizados
 *  - integração com validação de formulários (ElementInternals)
 *
 * @fires Image#algol-image-load
 * @fires Image#algol-image-error
 *
 * @extends BaseComponent
 */
class Image extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
            'src': 'update_src',
            'alt': 'update_alt',
            'width': 'update_width',
            'height': 'update_height',
            'expand': 'update_expand',
            'lazy': 'update_lazy',
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
            <img loading="eager">
            <div class="error">⚠️ Image not loaded!</div>  
            <slot></slot>
        `;
    }
    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.img = this.root.querySelector('img');
        this.elems.error = this.root.querySelector('.error');
        this.elems.slot = this.root.querySelector('slot');
    }
    /** @override */
    attachEvents(){
        this.elems.img.addEventListener('load', () => { 
            this.elems.error.style.display = 'none';
            this.elems.img.style.display = 'block';
            // Dispara evento customizado para o pai saber que carregou
            this.dispatchEvent(new CustomEvent('algol-image-load', { bubbles: true, composed: true }));
            this._atualizarValidacao(true);
        });
        // 2. Evento de Erro (404, rede, etc)
        this.elems.img.addEventListener('error', () => {
            this.elems.error.style.display = 'block';
            this.elems.img.style.display = 'none';
            // Dispara evento customizado de erro
            this.dispatchEvent(new CustomEvent('algol-image-error', { bubbles: true, composed: true }));
            this._atualizarValidacao(false);
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_src(val) {
        if (!this.elems.img) return; // guard
        // Assume que vai dar certo (mostra img, esconde erro) enquanto carrega
        this.elems.error.style.display = 'none';
        this.elems.img.style.display = 'block';
        this.elems.img.src = val;
    }
    update_alt(val) {
        if (!this.elems.img) return; // guard
        this.elems.img.alt = val;
    }
    update_width(val) {
        if (!this.elems.img) return; // guard
        this.elems.img.width = val;
    }
    update_height(val) {
        if (!this.elems.img) return; // guard
        this.elems.img.height = val;
    }
    update_expand(val) {
        if (!this.elems.img) return;
        if(this.hasAttribute('expand')) this.elems.img.style.width = '100%';
        else this.elems.img.style.removeProperty('width');
    }
    update_lazy(val) {
        if (!this.elems.img) return;
        this.elems.img.loading = this.hasAttribute('lazy')?'lazy':'eager';
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Atualiza a validação de form do elemento customizado
    _atualizarValidacao(carregouSucesso = true) {
        // Se a imagem não participa de forms, isso é opcional, 
        // mas útil se quiser impedir submit de form com imagem quebrada.
        if (!this._internals) return;

        if (!carregouSucesso) {
            this._internals.setValidity(
                { badInput: true }, // Flag para "dado inválido"
                "A imagem não pôde ser carregada.",
                this.elems.img
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_image_sheet = new CSSStyleSheet();
algol_image_sheet.replaceSync(`
    :host {
        display: block;
    }
    slot {display: none;}
    img{
        max-width: 100%;
        height: auto;
        display: block;     /* remove espaço fantasma */
        object-fit: cover;   /* preenche tudo, pode cortar */
    }
    .error{
        display: none;
        text-align: center;
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-image', Image); // Registra o componente customizado