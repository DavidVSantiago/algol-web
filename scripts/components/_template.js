class Base extends HTMLElement {
    // atributos observador do compontente
    static get observedAttributes() { return ['','','']; } // necessário para o funcionamento do "attributeChangedCallback"

    constructor() {
        super();
        // this._type = ''; // para distinção de subtipos em subclasses

        this._base_initialized = false; // para saber se o componente foi inicializado
        this._connected = false; // para saber se o componente foi montado

        const propsToUpgrade = this.constructor.observedAttributes || [];
        propsToUpgrade.forEach(p => this._upgradeProperty(p));
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

    _upgradeProperty(prop) {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
    /** Faz a construção interna do compoenente */
    _init() {
        if (this._base_initialized) return; // guard

        // cria cada um dos compoentes
        
        // monta a árvore

        // guarda referências

        this._base_initialized = true; // componente inicializado
    }

    _attachEvents() {
        // guarda
    }

    _detachEvents() {
       // guarda
    }

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************

    /** Serve para reaplicar os atributos nas partes filhas dos componentes */
    _applyAttributes() {
        // guarda
        // invoca funções específicas para aplicar cada um dos atributos de forma individual
        
    }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** invocado automaticamente quando o componente é inserido no DOM ou movido para outro local. */
    connectedCallback() {
        if (this._connected) return;
        // contrói o componente, se ainda não foi
        this._init();
        this._attachEvents(); // liga os eventos
        this._applyAttributes(); // aplica atributos
        this._connected = true; // marca como motado
    }
    disconnectedCallback() {
        this._detachEvents();
        this._connected = false; // marca como desmontado
    }
    /** invocado automaticamente quando muda o valor de algum atributo observado ('observedAttributes'). */
    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (!this._connected) return; // só trata eventos de mudança se tiver montado

        switch (name) {
            // faz o case para cada atributo e invoca o this._applyAttribute_ específico
        }
    }
    
}