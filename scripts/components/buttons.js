class Button extends BaseComponent {
    // Mapa de propriedades
    static get PROP_MAP() {
        return {
            'size':     'update_size',     // small, mid (default), big
            'type':     'update_type',     // submit, reset, button
            'disabled': 'update_disabled', // desabilita interações
            'loading':  'update_loading',  // estado de carregamento
            'name':     'update_name',     // identificador para forms
            'value':    'update_value'     // valor enviado (útil para lógica JS)
        };
    }
    static get ATTR_MAP() {
        return {
            'bgcolor': '--bg-color-btn', // cor do fundo botão
            'color': '--text-color-btn', // cor do texto do botão
        };
    }
    static get observedAttributes() {const props = Object.keys(this.PROP_MAP);const attrs = Object.keys(this.ATTR_MAP);return [...props, ...attrs];}
    constructor() {super();}
    
    // ****************************************************************************
    // Métodos de construção
    // ****************************************************************************

    /** @override */
    render() {
        this.root.adoptedStyleSheets = [algol_button_sheet];
        this.root.innerHTML = `
            <button part="button">
                <span class="loader"></span>
                <span class="content"><slot></slot></span>
            </button>
        `;
    }

    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.button = this.root.querySelector('button');
        this.elems.content = this.root.querySelector('.content');
        this.elems.slot = this.root.querySelector('slot');

        // criação de id único
        const idUnico = `button-${BaseComponent._idCont++}`;
        this.elems.button.id = idUnico;
    }

    /** @override */
    attachEvents() {
        // O BaseComponent já gerencia o evento de clique global ('algol-click') e a trava de 'disabled'.
        // Aqui, precisamos apenas garantir a integração com FORMULÁRIOS.
        this.elems.button.addEventListener('click', (e) => {
            // Se estiver loading, bloqueia cliques extras
            if (this.hasAttribute('loading')) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return;
            }
            // Integração com <form> nativo (Submissão e Reset)
            // Como estamos no Shadow DOM, o botão não submete o form automaticamente.
            // Precisamos fazer isso via ElementInternals.
            if (this._internals.form) {
                const type = this.getAttribute('type');
                if (type === 'submit') this._internals.form.requestSubmit(); 
                else if (type === 'reset') this._internals.form.reset();
            }
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    update_disabled(val) { if(this.elems.button) this.elems.button.disabled = this.hasAttribute('disabled'); }
    update_loading(val) { // Adiciona classe para mostrar o spinner e esconder o texto
        if(!this.elems.button) return;
        if (this.hasAttribute('loading')) {
            this.elems.button.classList.add('loading');
            this.elems.button.disabled = true; // Trava nativa enquanto carrega
        } else {
            this.elems.button.classList.remove('loading');
            this.elems.button.disabled = this.hasAttribute('disabled'); // Restaura o estado disabled original (se houver)
        }
    }
    update_size(val) {
        // Apenas validação, o estilo é resolvido via CSS
        if (!['small', 'mid', 'big'].includes(val)) this.setAttribute('size', 'mid'); // Fallback
    }
    update_type(val) {
        // Validação básica de tipo, o tipo real é gerenciado no evento 'click' usando internals
        if (!['button', 'submit', 'reset'].includes(val)) {this.setAttribute('type', 'button');} // fallback
        
    }
    update_name(val) {} 
    update_value(val) {}
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_button_sheet = new CSSStyleSheet();
algol_button_sheet.replaceSync(`
    :host {
        display: block;
    }

    button {
        /* Reset básico de button */
        appearance: none;
        outline: none;
        border: none;
        user-select: none; // evita seleção de texto
        cursor: pointer;
        width: 100%;

        /* Layout */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: calc(0.6vw * var(--scale-factor)) calc(1.2vw * var(--scale-factor));
        min-height: calc(2.4vw * var(--scale-factor));
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        background-color: var(--bg-color-btn);
        color: var(--text-color-btn);
        font-family: 'Algol Font';
        font-weight: 200;
        font-size: calc(var(--font-size-btn)* var(--scale-factor));
        transition: filter 0.2s, transform 0.1s; 
    }

    /* --- Hover e Active --------------------------------------------------------------- */
    button:hover:not(:disabled) {
        filter: brightness(1.1); /* Clareia levemente */
    }
    button:active:not(:disabled) {
        transform: translateY(calc(0.09vw * var(--scale-factor))); /* Efeito de clique */
        filter: brightness(0.9);
    }

    /* --- Tamanhos (Size) ---------------------------------------------------------------*/
    :host([size="small"]) button {
        padding: calc(0.4vw * var(--scale-factor)) calc(0.8vw * var(--scale-factor));
    }

    :host([size="mid"]) button { /* Padrão */
        padding: calc(0.6vw * var(--scale-factor)) calc(1.2vw * var(--scale-factor));
    }

    :host([size="big"]) button {
        padding: calc(0.8vw * var(--scale-factor)) calc(1.6vw * var(--scale-factor));
    }

    /* --- Estado Disabled ------------------------------------------------------------- */
    button:disabled {
        background-color: var(--bg-color-forms-disabled, #ccc);
        color: var(--text-color-forms-disabled, #666);
        cursor: not-allowed;
        opacity: 0.7;
    }

    /* --- Estado Loading (Spinner) ---------------------------------------------------- */
    .loader {
        display: none;
        width: calc(1.5vw * var(--scale-factor));
        height: calc(1.5vw * var(--scale-factor));
        border: calc(0.2vw * var(--scale-factor)) solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        position: absolute;
    }

    /* Quando tem a classe loading */
    button.loading .content {
        visibility: hidden;
        opacity: 0; /* Transição suave opcional */
    }
    button.loading .loader {
        display: block;
        pointer-events: none; /* Garante que o loader não bloqueie eventos de mouse */
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Foco acessível */
    :host(:focus-within) button {
         box-shadow: 0 0 0 calc(0.2vw * var(--scale-factor)) var(--border-color-focus-glow);
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-button', Button); // Registra o componente customizado

