class BaseLayout extends HTMLElement {
    static get observedAttributes() { return []; } 
    
    constructor() {
        super();
        
        this.elems = {}; // cache de elementos internos do componente
        this.inicializado = false;
        this._gerarAcessores();
        
        // usa light DOM para permitir estilos herdados e manipulação direta dos elementos filhos
        this.root = this; 
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @abstract */
    postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

    // ****************************************************************************
    // Ciclo de Vida de HTMLElement
    // ****************************************************************************

    /** @override */
    connectedCallback() {
        if (this.inicializado) return; // se já foi construído, não faz nada!
        
        this.postConfig(); // invoca o metodo abstrato de pós-configuração

        // Aplica valores iniciais dos atributos
        this.constructor.observedAttributes.forEach(attr => {
            const val = this.getAttribute(attr);
            if (val !== null) this.attributeChangedCallback(attr, null, val);
        });
        this.inicializado = true;
    }

    /** @override */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        const updateMethod = `update_${name}`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod](newValue);
        }else{
            console.error(`DEV MSG: está faltando o método ${updateMethod}()`);
        }
    }

    // ****************************************************************************
    // Geração de Acessores e Atributos
    // ****************************************************************************

    _gerarAcessores() {
        for (const attr of this.constructor.observedAttributes) {
            if (!(attr in this)) {
                Object.defineProperty(this, attr, {
                    get: () => this.getAttribute(attr),
                    set: (val) => this.setAttribute(attr, val),
                    configurable: true
                });
            }
        };
    }
}