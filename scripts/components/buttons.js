class BtnBase extends HTMLElement {
    // atributos observador do compontente
    static get observedAttributes() { return ['size', 'disabled', 'position', 'positionCel']; } // necessário para o funcionamento do "attributeChangedCallback"

    constructor() {
        super();
        this._btn = null;
        this._variantClass = 'algol_btn-primary'; // botão padrão

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
        if (this._base_initialized) return;

        // Cria o <button>
        const btn = document.createElement('button');
        btn.className = `algol_btn ${this._variantClass}`; // define a classe base + a variante (definida da classe derivada)

        // garantir id único evitando
        if (!btn.id) {
            // inicializa o contador no próprio Input (classe base) se necessário
            if (typeof BtnBase._uidCounter === 'undefined') BtnBase._uidCounter = 0;
            btn.id = `algol-input-${++BtnBase._uidCounter}`;
        }

        // Evita seleção de texto no botão (e no host), com fallbacks
        btn.style.cssText += '-webkit-user-select:none; -ms-user-select:none; user-select:none; -webkit-touch-callout:none;';
        this.style.cssText += '-webkit-user-select:none; -ms-user-select:none; user-select:none;';
        btn.setAttribute('unselectable', 'on');            // IE <= 10
        btn.onselectstart = () => false;  

        // movimenta o conteúdo da tag pesonalizada para dentro do botão
        const frag = document.createDocumentFragment(); // criação do fragmento (container temporário e eficiente, feito para a tranferência de conteúdo via js)
        while (this.firstChild) frag.appendChild(this.firstChild); // transfere o conteúdo da tag pesonalizada para dentro do fragmento
        btn.appendChild(frag); // tranfere do fragmento para a o botão
        
        this._btn = btn;
        this.appendChild(btn);

        this._base_initialized = true;
    }

    _attachEvents() {
        if (!this._btn) return; // guard
        
        // Apenas bloqueamos interação quando disabled.
        if (!this._onClick) {
            this._onClick = (e) => {
                if (this.disabled) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // evita a propagação
                }
                // Caso contrário, deixe o evento propagar normalmente.
            };
        }

        this._btn.addEventListener('click', this._onClick);
    }

    _detachEvents() {
        if (!this._btn) return; // guard
        //remove os eventos
        if (this._onClick) {
            this._btn.removeEventListener('click', this._onClick);
        }
    }

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************

    /** Serve para reaplicar os atributos nas partes filhas dos componentes */
    _applyAttributes() {
        if (!this._btn) return; // guard
        // invoca funções específicas para aplicar cada um dos atributos de forma individual
        this._applyAttribute_size();
        this._applyAttribute_position();
        this._applyAttribute_positionCel();
        this._applyAttribute_disabled();
    }
    _applyAttribute_size() {
        // remove as classes responsáveis por size
        this._btn.classList.remove('algol_btn-small', 'algol_btn-big');
        // reaplica-as condicionalmente
        const size = this.getAttribute('size');
        if (size === 'small') this._btn.classList.add('algol_btn-small');
        else if (size === 'big') this._btn.classList.add('algol_btn-big');
        else if (size && size !== 'small' && size !== 'big') {
            console.warn(`Invalid size for button: ${size}!`);
        }
    }
    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-self-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-self-${pos}`);
        if (pos == 'all') {
            this._btn.classList.add(`algol_position-self-${pos}`);
            this._btn.setAttribute('style', 'width:100%;display:flex;justify-content:center;');
        }
    }
    _applyAttribute_positionCel() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-self-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-self-${pos}`);
        if (pos == 'all') {
            this._btn.classList.add(`algol_position-self-${pos}`);
            this._btn.setAttribute('style', 'width:100%;display:flex;justify-content:center;');
        }
    }
    _applyAttribute_disabled() {
        this._btn.disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            this._btn.style.cursor = 'not-allowed';
        } else {
            this._btn.style.cursor = '';
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
            case 'size': this._applyAttribute_size(); break;
            case 'position': this._applyAttribute_position(); break;
            case 'positionCel': this._applyAttribute_positionCel(); break;
            case 'disabled': this._applyAttribute_disabled(); break;
        }
    }
}



// Subclasses: definem apenas a variante, não renderizam no constructor
class BtnPrimary extends BtnBase {
    constructor() { super(); }
}
class BtnSecondary extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-secondary'; }
}
class BtnOutline extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-outline'; }
}
class BtnSuccess extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-success'; }
}
class BtnDanger extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-danger'; }
}
class BtnWarning extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-warning'; }
}
class BtnInfo extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-info'; }
}
class BtnLink extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-link'; }
}