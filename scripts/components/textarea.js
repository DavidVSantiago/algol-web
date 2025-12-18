class TextArea extends HTMLElement {
    // atributos observados
    static get observedAttributes() {
        return ['value', 'placeholder', 'disabled', 'position', 'label',
                'rows', 'maxlength', 'readonly', 'name', 'required', 'wrap', 'autofocus'];
    }

    constructor() {
        super();
        this._rootEl = null;    // container (.algol_component-group)
        this._labelEl = null;   // <div.algol_label>
        this._taEl = null;      // <textarea>

        this._base_initialized = false;
        this._connected = false;

        const propsToUpgrade = this.constructor.observedAttributes || [];
        propsToUpgrade.forEach(p => this._upgradeProperty(p));
    }

    // ****************************************************************************
    // Inicialização
    // ****************************************************************************
    _upgradeProperty(prop) {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    _init() {
        if (this._base_initialized) return;

        // label (segue padrão atual do inputs.js usando <div> com classe)
        const label = document.createElement('div');
        label.className = 'algol_label';

        // textarea
        const ta = document.createElement('textarea');
        ta.className = 'algol_textarea';

        // garantir id único evitando
        if (!ta.id) {
            // inicializa o contador no próprio Input (classe base) se necessário
            if (typeof TextArea._uidCounter === 'undefined') TextArea._uidCounter = 0;
            ta.id = `algol-textarea-${++TextArea._uidCounter}`;
        }

        // container
        const group = document.createElement('div');
        group.className = 'algol_component-group';

        // monta a árvore
        group.appendChild(label);
        group.appendChild(ta);
        this.appendChild(group);

        // refs
        this._rootEl = group;
        this._labelEl = label;
        this._taEl = ta;

        this._base_initialized = true;
    }

    _attachEvents() {
        if (!this._taEl) return;

        if (!this._onInput) {
            this._onInput = () => {
                const val = this._taEl.value;
                if (this.getAttribute('value') !== val) this.setAttribute('value', val);
                this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            };
        }
        if (!this._onChange) {
            this._onChange = () => {
                const val = this._taEl.value;
                if (this.getAttribute('value') !== val) this.setAttribute('value', val);
                this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            };
        }

        this._taEl.addEventListener('input', this._onInput);
        this._taEl.addEventListener('change', this._onChange);
    }

    _detachEvents() {
        if (!this._taEl) return;
        if (this._onInput) {
            this._taEl.removeEventListener('input', this._onInput);
            this._onInput = null;
        }
        if (this._onChange) {
            this._taEl.removeEventListener('change', this._onChange);
            this._onChange = null;
        }
    }

    // ****************************************************************************
    // Atributos
    // ****************************************************************************
    _applyAttributes() {
        if (!this._rootEl) return;
        this._applyAttribute_label();
        this._applyAttribute_placeholder();
        this._applyAttribute_value();
        this._applyAttribute_position();
        this._applyAttribute_disabled();

        // específicos de textarea
        this._applyAttribute_rows();
        this._applyAttribute_maxlength();
        this._applyAttribute_readonly();
        this._applyAttribute_name();
        this._applyAttribute_required();
        this._applyAttribute_wrap();
        this._applyAttribute_autofocus();
    }

    _applyAttribute_label() {
        const label = this.getAttribute('label');
        if (label && label !== '') {
            this._labelEl.textContent = label;
            if (!this._labelEl.parentNode) this._rootEl.insertBefore(this._labelEl, this._taEl);
        } else {
            if (this._labelEl.parentNode) this._rootEl.removeChild(this._labelEl);
        }
    }
    _applyAttribute_placeholder() {
        if (!this._taEl) return;
        if (this.hasAttribute('placeholder')) this._taEl.placeholder = this.getAttribute('placeholder') ?? '';
        else this._taEl.removeAttribute('placeholder');
    }
    _applyAttribute_value() {
        if (!this._taEl) return;
        if (this.hasAttribute('value')) this._taEl.value = this.getAttribute('value') ?? '';
    }
    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-self-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-self-${pos}`);
    }
    _applyAttribute_disabled() {
        if (!this._taEl) return;
        this._taEl.disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            this._taEl.style.cursor = 'not-allowed';
        } else {
            this._taEl.style.cursor = '';
        }
    }

    // específicos
    _applyAttribute_rows() {
        if (!this._taEl) return;
        if (this.hasAttribute('rows')) {
            const v = parseInt(this.getAttribute('rows'), 10);
            if (Number.isFinite(v) && v > 0) this._taEl.rows = v;
        } else {
            this._taEl.removeAttribute('rows');
        }
    }
    _applyAttribute_maxlength() {
        if (!this._taEl) return;
        if (this.hasAttribute('maxlength')) {
            const v = parseInt(this.getAttribute('maxlength'), 10);
            if (Number.isFinite(v) && v >= 0) this._taEl.maxLength = v;
        } else {
            this._taEl.removeAttribute('maxlength');
        }
    }
    _applyAttribute_readonly() {
        if (!this._taEl) return;
        this._taEl.readOnly = this.hasAttribute('readonly');
    }
    _applyAttribute_name() {
        if (!this._taEl) return;
        if (this.hasAttribute('name')) this._taEl.name = this.getAttribute('name') ?? '';
        else this._taEl.removeAttribute('name');
    }
    _applyAttribute_required() {
        if (!this._taEl) return;
        this._taEl.required = this.hasAttribute('required');
    }
    _applyAttribute_wrap() {
        if (!this._taEl) return;
        if (this.hasAttribute('wrap')) {
            const v = this.getAttribute('wrap');
            if (v === 'hard' || v === 'soft') this._taEl.wrap = v;
        } else {
            this._taEl.removeAttribute('wrap');
        }
    }
    _applyAttribute_autofocus() {
        if (!this._taEl) return;
        // refletimos o atributo; o foco real fica a cargo do navegador
        if (this.hasAttribute('autofocus')) this._taEl.setAttribute('autofocus', '');
        else this._taEl.removeAttribute('autofocus');
    }

    // ****************************************************************************
    // Ciclo de vida
    // ****************************************************************************
    connectedCallback() {
        if (this._connected) return;
        this._init();
        this._attachEvents();
        this._applyAttributes();
        this._connected = true;
    }

    disconnectedCallback() {
        this._detachEvents();
        this._connected = false;
    }

    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (!this._connected) return;

        switch (name) {
            case 'label': this._applyAttribute_label(); break;
            case 'placeholder': this._applyAttribute_placeholder(); break;
            case 'value': this._applyAttribute_value(); break;
            case 'position': this._applyAttribute_position(); break;
            case 'disabled': this._applyAttribute_disabled(); break;
            case 'rows': this._applyAttribute_rows(); break;
            case 'maxlength': this._applyAttribute_maxlength(); break;
            case 'readonly': this._applyAttribute_readonly(); break;
            case 'name': this._applyAttribute_name(); break;
            case 'required': this._applyAttribute_required(); break;
            case 'wrap': this._applyAttribute_wrap(); break;
            case 'autofocus': this._applyAttribute_autofocus(); break;
        }
    }
}

// Opcional: registre o custom element aqui.
// Caso você centralize os defines em outro arquivo, remova a linha abaixo.
// 