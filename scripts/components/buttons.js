class BtnBase extends HTMLElement {
    constructor() {
        super();
        this._btn = null;
        this._variantClass = this._variantClass || 'algol_btn-primary'; // Subclasses definem this._variantClass no constructor delas
    }

    // ****************************************************************************
    // Métodos
    // ****************************************************************************

    /** Faz a construção interna do compoenente */
    _init() {
        // Cria o <button> e move os filhos atuais do host para dentro dele (preserva HTML e listeners)
        const btn = document.createElement('button');
        btn.className = `algol_btn ${this._variantClass}`; // define a classe base + a variante (definida da classe derivada)

        // movimenta o conteúdo da tag pesonalizada para dentro do botão
        const frag = document.createDocumentFragment(); // criação do fragmento (container temporário e eficiente, feito para a tranferência de conteúdo via js)
        while (this.firstChild) frag.appendChild(this.firstChild); // transfere o conteúdo da tag pesonalizada para dentro do fragmento
        btn.appendChild(frag); // tranfere do fragmento para a o botão

        // Em Light DOM o click já propaga para o host.
        // Apenas bloqueamos interação quando disabled.
        btn.addEventListener('click', (e) => {
            if (this.disabled) {
                e.preventDefault();
                e.stopImmediatePropagation(); // evita a propagação
            }
            // Caso contrário, deixe o evento propagar normalmente.
        });

        this._btn = btn;
        this.appendChild(btn);
    }

    /** Sincroniza os atributos do host (tag personalizada) com o botão interno */
    _applyAttributes() {
        // size -> classes
        this._btn.classList.remove('algol_btn-small', 'algol_btn-big');
        const size = this.getAttribute('size');
        if (size === 'small') this._btn.classList.add('algol_btn-small');
        else if (size === 'big') this._btn.classList.add('algol_btn-big');
        else if (size && size !== 'small' && size !== 'big') {
            console.warn(`Invalid size for button: ${size}!`);
        }

        // disabled -> atributo/propriedade nativa do button
        this._btn.disabled = this.disabled;

        // position -> classes no host (mantém seu contrato atual)
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-${pos}`);
        if (pos == 'all') {
            this._btn.classList.add(`algol_position-${pos}`);
            this._btn.setAttribute('style', 'width:100%;display:flex;justify-content:center;');
        }
    }

    // ****************************************************************************
    // Gettes & Setters
    // ****************************************************************************

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }
    get size() { return this.getAttribute('size'); }
    set size(v) { v ? this.setAttribute('size', v) : this.removeAttribute('size'); }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** invocado automaticamente quando o componente é inserido no DOM ou movido para outro local. */
    connectedCallback() {
        if (!this._btn) this._init(); // evita reconstruções desnecessárias
        this._applyAttributes();
    }

    // se o valor de algum desses atributos mudar...
    static observedAttributes = ['size', 'disabled', 'position']; // necessário para o funcionamento do "attributeChangedCallback"
    /** invocado automaticamente quando muda o valor de algum atributo observado ('observedAttributes'). */
    attributeChangedCallback(name, oldV, newV) { // 
        if (oldV === newV) return;
        if (this._btn) this._applyAttributes();
    }
}

// Subclasses: definem apenas a variante, não renderizam no constructor
class BtnPrimary extends BtnBase {
    constructor() { super(); this._variantClass = 'algol_btn-primary'; }
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