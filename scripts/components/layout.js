class Layout extends HTMLElement {
    // atributos observador do compontente
    static get observedAttributes() { return ['cols', 'celCols']; } // necessário para o funcionamento do "attributeChangedCallback"

    constructor() {
        super();
        // this._type = ''; // para distinção de subtipos em subclasses

        this._cols = 1;
        this._celCols = 1;
        this._mq = null;        // MediaQueryList armazenado
        this._mqHandler = null; // handler armazenado

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
        this._base_initialized = true; // componente inicializado
    }

    _attachEvents() {
        // obtém o breakpoint (string como '800px' ou similar)
        const rawBp = getComputedStyle(document.documentElement).getPropertyValue('--cel-breakpoint').trim() || '0px';

        // cria/atualiza matchMedia e handler (arrow function preserva `this`)
        this._mq = window.matchMedia(`(max-width: ${rawBp})`);

        // handler usa this._cols / this._celCols (já atualizados via atributos)
        this._mqHandler = () => {
            if (this._mq.matches) {
                // recomenda-se definir a var no host para isolamento:
                this.style.setProperty('--layout-cols-value', String(this._celCols));
            } else {
                this.style.setProperty('--layout-cols-value', String(this._cols));
            }
        };

        // executa uma vez para sincronizar o estado inicial
        this._mqHandler();

        // adiciona listener (armazenado para posterior remoção)
        this._mq.addEventListener('change', this._mqHandler);
    }

    _detachEvents() {
        if (this._mq && this._mqHandler) {
            this._mq.removeEventListener('change', this._mqHandler);
            this._mqHandler = null;
            this._mq = null;
        }
    }

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************

    /** Serve para reaplicar os atributos nas partes filhas dos componentes */
    _applyAttributes() {
        this._applyAttributes_cols();
        this._applyAttributes_celCols();
        // força recalcular o estado atual (útil quando attrs mudam após connect)
        if (this._mqHandler) this._mqHandler();
    }
    _applyAttributes_cols() {
        if (this.hasAttribute('cols')) {
            // guarda como número
            const val = Number(this.getAttribute('cols'));
            this._cols = Number.isFinite(val) ? val : 1;
            this.style.setProperty("--layout-cols", String(this._cols)); // var no host
        }
    }
    _applyAttributes_celCols() {
        if (this.hasAttribute('celCols')) {
            const val = Number(this.getAttribute('celCols'));
            this._celCols = Number.isFinite(val) ? val : 1;
            this.style.setProperty("--layout-celCols", String(this._celCols)); // var no host
        }
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
            case 'cols': this._applyAttributes_cols(); break;
            case 'celCols': this._applyAttributes_celCols();
        }
        if (this._mqHandler) this._mqHandler();
    }

}