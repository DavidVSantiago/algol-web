class layout extends HTMLElement {
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

        // cria <label>
        const label = document.createElement('label');

        // cria <input>
        const input = document.createElement('input');
        input.type = this._type;
        input.className = 'algol_input';

        // garantir id único evitando colisões
        if (!input.id) {
            if (!this.constructor._uidCounter) this.constructor._uidCounter = 0;
            input.id = `algol-input-${++this.constructor._uidCounter}`;
        }
        label.htmlFor = input.id;

        // cria <div> para <label> e o <input>
        const group = document.createElement('div');
        group.className = 'algol_component-group';

        // monta a árvore: group -> label + input
        group.appendChild(label);
        group.appendChild(input);

        this.appendChild(group);// coloca os elementos dentro da tag

        // guarda referências
        this._rootEl = group;
        this._labelEl = label;
        this._inputEl = input;

        this._base_initialized = true;
    }

    _attachEvents() {
        if (!this._inputEl) return;
        if (!this._onInput) {
            this._onInput = (e) => {
                const val = this._inputEl.value;
                // evita refletir atributo se já estiver igual (reduz triggers desnecessários)
                if (this.getAttribute('value') !== val) this.setAttribute('value', val);
                this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            };
        }
        if (!this._onChange) {
            this._onChange = (e) => {
                const val = this._inputEl.value;
                if (this.getAttribute('value') !== val) this.setAttribute('value', val);
                this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            };
        }
        this._inputEl.addEventListener('input', this._onInput);
        this._inputEl.addEventListener('change', this._onChange);
    }

    _detachEvents() {
        if (!this._inputEl) return; // guard
        //remove os eventos
        if (this._onInput) {
            this._inputEl.removeEventListener('input', this._onInput);
            this._onInput = null;
        }
        if (this._onChange) {
            this._inputEl.removeEventListener('change', this._onChange);
            this._onChange = null;
        }
    }
}