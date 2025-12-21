class Select extends HTMLElement {
    static get observedAttributes() {
        return ['label', 'value', 'name', 'required', 'disabled','position'];
    }

    constructor() {
        super();
        this._rootEl = null;        // .algol-component-group
        this._label = null;
        this._select = null;

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
        if (this._base_initialized) return; // guard para evitar dupla criação

        // container raiz
        const group = document.createElement('div');
        group.className = 'algol-component-group';

        // label
        const label = document.createElement('label');
        label.className = 'algol-label';

        // wrapper do select custom
        const select = document.createElement('select');
        select.className = 'algol-select';

        // Move as <option> existentes para o select nativo
        while (this.firstChild) {
            const node = this.firstChild;
            if (node.tagName === 'OPTION' || node.nodeType === Node.TEXT_NODE) {
                select.append(node);
            } else {
                node.remove();
            }
        }

        // garante que o primeiro option sempre seja desabilitado
        if (select.options.length > 0) select.options[0].disabled = true;

        group.appendChild(label);
        group.appendChild(select);
        this.appendChild(group);

        // refs
        this._rootEl = group;
        this._label = label;
        this._select = select;

        this._applyAttributes();
        this._selectDefaultOption(); // Adiciona a chamada para selecionar a opção padrão

        this._base_initialized = true;
    }

    _selectDefaultOption() {
        if (this._select.options.length > 0) {
            this._select.selectedIndex = 0; // Seleciona o primeiro option
            this._reflectValue(); // Atualiza o valor refletido
        }
    }

    _attachEvents() {
        this._select.addEventListener('input', () => this._reflectValue());
        this._select.addEventListener('change', () => this._reflectValue());
    }

    _detachEvents() {
        if (this._btnEl && this._onBtnClick) {
            this._btnEl.removeEventListener('click', this._onBtnClick);
            this._onBtnClick = null;
        }
        if (this._btnEl && this._onBtnKeydown) {
            this._btnEl.removeEventListener('keydown', this._onBtnKeydown);
            this._onBtnKeydown = null;
        }
        if (this._listEl && this._onListKeydown) {
            this._listEl.removeEventListener('keydown', this._onListKeydown);
            this._onListKeydown = null;
        }
        if (this._listEl && this._onOptionClick) {
            this._listEl.removeEventListener('click', this._onOptionClick);
            this._onOptionClick = null;
        }
        if (this._onOutside) {
            document.removeEventListener('mousedown', this._onOutside);
            document.removeEventListener('focusin', this._onOutside);
            this._onOutside = null;
        }
    }

    _reflectValue() {
        const current = this._select.value;
        if (this.getAttribute('value') !== current) {
        this.setAttribute('value', current);
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ****************************************************************************
    // Atributos
    // ****************************************************************************

    _applyAttributes() {
        if (!this._rootEl) return;
        this._applyAttribute_label();
        this._applyAttribute_value();
        this._applyAttribute_disabled();
        this._applyAttribute_name();
        this._applyAttribute_required();
        this._applyAttribute_position();
    }

    _applyAttribute_label() {
        const label = this.getAttribute('label');
        this._label.textContent = label;
    }
    _applyAttribute_value() {
        // quando alterar externamente o atributo, aplica sem disparar eventos duplicados
        const v = this.getAttribute('value');
        this._select.value = v;
    }
    _applyAttribute_disabled() {
        this._select.disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            this._select.style.cursor = 'not-allowed';
        } else {
            this._select.style.cursor = '';
        }
    }
    _applyAttribute_name() {
        const name = this.getAttribute('name');
        name ? this._select.setAttribute('name', name) : this._select.removeAttribute('name');
    }
    _applyAttribute_required() {
        this._select.toggleAttribute('required', this.hasAttribute('required'));
    }
    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol-position-self-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol-position-self-${pos}`);
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

     _reflectValue() {
    const current = this._select.value;
        if (this.getAttribute('value') !== current) {
        this.setAttribute('value', current);
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
        }
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
            case 'name': this._applyAttribute_name(); break;
            case 'required': this._applyAttribute_required(); break;
        }
    }
}

// static counter para ids
Select._uidCounter = 0;