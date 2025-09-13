class Select extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'disabled', 'position', 'label', 'placeholder', 'name', 'required'];
    }

    constructor() {
        super();
        this._rootEl = null;        // .algol_component-group
        this._labelEl = null;       // .algol_label
        this._wrapEl = null;        // .algol_select
        this._btnEl = null;         // button trigger
        this._btnValueEl = null;    // span com o texto exibido
        this._dropdownEl = null;    // container do dropdown
        this._listEl = null;        // ul[role=listbox]
        this._hiddenEl = null;      // input[type=hidden] para forms

        this._options = [];         // [{value, label, disabled, li}]
        this._selectedIndex = -1;   // índice do selecionado em _options
        this._activeIndex = -1;     // foco/hover do teclado
        this._open = false;

        this._mq = null;           // não usado aqui; reservado para estilos responsivos se preciso
        this._outsideHandler = null;

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

        // container raiz
        const group = document.createElement('div');
        group.className = 'algol_component-group';

        // label
        const label = document.createElement('div');
        label.className = 'algol_label';

        // wrapper do select custom
        const wrap = document.createElement('div');
        wrap.className = 'algol_select';

        // botão trigger
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'algol_select-trigger';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');

        const btnValue = document.createElement('span');
        btnValue.className = 'algol_select-value';
        const caret = document.createElement('span');
        caret.className = 'algol_select-caret';
        caret.textContent = '▾';

        btn.appendChild(btnValue);
        btn.appendChild(caret);

        // dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'algol_select-dropdown';
        dropdown.hidden = true;

        const list = document.createElement('ul');
        list.className = 'algol_select-list';
        list.setAttribute('role', 'listbox');
        list.tabIndex = -1;
        dropdown.appendChild(list);

        // input hidden para submissão em forms
        const hidden = document.createElement('input');
        hidden.type = 'hidden';

        // ids únicos para aria
        if (typeof Select._uidCounter === 'undefined') Select._uidCounter = 0;
        const uid = ++Select._uidCounter;
        const listId = `algol-select-list-${uid}`;
        const labelId = `algol-select-label-${uid}`;
        list.id = listId;
        label.id = labelId;
        btn.setAttribute('aria-controls', listId);
        btn.setAttribute('aria-labelledby', labelId);

        // monta árvore
        wrap.appendChild(btn);
        wrap.appendChild(dropdown);
        group.appendChild(label);
        group.appendChild(wrap);
        group.appendChild(hidden);
        this.appendChild(group);

        // refs
        this._rootEl = group;
        this._labelEl = label;
        this._wrapEl = wrap;
        this._btnEl = btn;
        this._btnValueEl = btnValue;
        this._dropdownEl = dropdown;
        this._listEl = list;
        this._hiddenEl = hidden;

        // construir opções com base nos <option> filhos atuais
        this._readOptions();
        // aplicar seleção inicial (value attr, option[selected] ou placeholder)
        this._applyInitialSelection();

        this._base_initialized = true;
    }

    _readOptions() {
        this._options = [];
        this._listEl.innerHTML = '';
        const optionNodes = Array.from(this.querySelectorAll(':scope > option'));
        optionNodes.forEach((optNode, index) => {
            const value = optNode.getAttribute('value') ?? '';
            const label = optNode.textContent ?? '';
            const disabled = optNode.hasAttribute('disabled');

            const li = document.createElement('li');
            li.className = 'algol_select-option';
            li.setAttribute('role', 'option');
            li.textContent = label;
            li.dataset.value = value;
            if (disabled) {
                li.setAttribute('aria-disabled', 'true');
                li.classList.add('is-disabled');
            }

            // id para aria-activedescendant
            li.id = `algol-select-option-${Select._uidCounter}-${index}`;

            this._listEl.appendChild(li);
            this._options.push({ value, label, disabled, li });
        });
    }

    _applyInitialSelection() {
        // prioridade: atributo value -> <option selected> -> nenhuma (placeholder/empty)
        let valueAttr = this.getAttribute('value');
        if (valueAttr != null) {
            this._setValue(valueAttr, false);
            return;
        }
        // procurar option[selected]
        const selectedNode = this.querySelector(':scope > option[selected]');
        if (selectedNode) {
            this._setValue(selectedNode.getAttribute('value') ?? '', false);
        } else {
            // sem valor -> mostra placeholder ou vazio
            this._selectedIndex = -1;
            this._renderButtonText();
            this._syncAriaSelected();
            this._syncHiddenInput();
        }
    }

    _attachEvents() {
        if (!this._btnEl) return;

        if (!this._onBtnClick) {
            this._onBtnClick = (e) => {
                if (this.hasAttribute('disabled')) return;
                this._toggle();
            };
        }
        if (!this._onBtnKeydown) {
            this._onBtnKeydown = (e) => {
                if (this.hasAttribute('disabled')) return;
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    if (!this._open) this._openDropdown();
                    // define activeIndex
                    this._moveActive(e.key === 'ArrowUp' ? -1 : 1, true);
                }
            };
        }
        if (!this._onListKeydown) {
            this._onListKeydown = (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this._moveActive(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this._moveActive(-1);
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    this._setActiveToEdge('start');
                } else if (e.key === 'End') {
                    e.preventDefault();
                    this._setActiveToEdge('end');
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (this._activeIndex >= 0) this._selectByIndex(this._activeIndex);
                } else if (e.key === 'Escape' || e.key === 'Tab') {
                    this._closeDropdown();
                }
            };
        }
        if (!this._onOptionClick) {
            this._onOptionClick = (e) => {
                const li = e.target.closest('.algol_select-option');
                if (!li) return;
                const idx = this._options.findIndex(o => o.li === li);
                if (idx >= 0) this._selectByIndex(idx);
            };
        }
        if (!this._onOutside) {
            this._onOutside = (e) => {
                if (!this._open) return;
                if (!this.contains(e.target)) this._closeDropdown();
            };
        }

        this._btnEl.addEventListener('click', this._onBtnClick);
        this._btnEl.addEventListener('keydown', this._onBtnKeydown);
        this._listEl.addEventListener('keydown', this._onListKeydown);
        this._listEl.addEventListener('click', this._onOptionClick);
        document.addEventListener('mousedown', this._onOutside);
        document.addEventListener('focusin', this._onOutside);
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
        this._applyAttribute_name();
        this._applyAttribute_required();
    }

    _applyAttribute_label() {
        const label = this.getAttribute('label');
        if (label && label !== '') {
            this._labelEl.textContent = label;
            if (!this._labelEl.parentNode) this._rootEl.insertBefore(this._labelEl, this._wrapEl);
        } else {
            if (this._labelEl.parentNode) this._rootEl.removeChild(this._labelEl);
        }
    }
    _applyAttribute_placeholder() {
        // apenas reflete no texto; render acontece no _renderButtonText
        this._renderButtonText();
    }
    _applyAttribute_value() {
        // quando alterar externamente o atributo, aplica sem disparar eventos duplicados
        const v = this.getAttribute('value');
        this._setValue(v ?? '', false);
    }
    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-${pos}`);
    }
    _applyAttribute_disabled() {
        const isDisabled = this.hasAttribute('disabled');
        if (this._btnEl) {
            this._btnEl.disabled = isDisabled;
            this._btnEl.setAttribute('aria-disabled', String(isDisabled));
        }
        if (isDisabled) this._closeDropdown();
    }
    _applyAttribute_name() {
        if (!this._hiddenEl) return;
        if (this.hasAttribute('name')) this._hiddenEl.name = this.getAttribute('name') ?? '';
        else this._hiddenEl.removeAttribute('name');
    }
    _applyAttribute_required() {
        // Nota: required em input hidden não é validado nativamente.
        // Mantemos para integração custom (ex: validação manual).
        if (!this._hiddenEl) return;
        if (this.hasAttribute('required')) this._hiddenEl.setAttribute('data-required', 'true');
        else this._hiddenEl.removeAttribute('data-required');
    }

    // ****************************************************************************
    // Lógica de seleção e UI
    // ****************************************************************************

    _toggle() {
        if (this._open) this._closeDropdown();
        else this._openDropdown();
    }
    _openDropdown() {
        if (this._open) return;
        this._dropdownEl.hidden = false;
        this._btnEl.setAttribute('aria-expanded', 'true');
        this._open = true;

        // ativa o item selecionado (ou o primeiro habilitado)
        if (this._selectedIndex >= 0) this._setActive(this._selectedIndex);
        else this._setActive(this._firstEnabledIndex());
        // foco na lista para navegação
        this._listEl.focus();
    }
    _closeDropdown() {
        if (!this._open) return;
        this._dropdownEl.hidden = true;
        this._btnEl.setAttribute('aria-expanded', 'false');
        this._open = false;
        // devolve foco ao botão
        this._btnEl.focus({ preventScroll: true });
        // limpa active
        this._setActive(-1);
    }

    _firstEnabledIndex() {
        return this._options.findIndex(o => !o.disabled);
    }

    _setActive(index) {
        // remove classe do antigo
        if (this._activeIndex >= 0 && this._options[this._activeIndex]) {
            this._options[this._activeIndex].li.classList.remove('is-active');
        }
        this._activeIndex = index;
        if (index >= 0 && this._options[index]) {
            const li = this._options[index].li;
            li.classList.add('is-active');
            this._listEl.setAttribute('aria-activedescendant', li.id);
            // garantir visibilidade
            li.scrollIntoView({ block: 'nearest' });
        } else {
            this._listEl.removeAttribute('aria-activedescendant');
        }
    }

    _moveActive(step, ifUnsetGoToEdge = false) {
        let idx = this._activeIndex;
        if (idx < 0) {
            if (ifUnsetGoToEdge) {
                idx = step < 0 ? this._options.length : -1; // força cálculo abaixo
            } else {
                idx = this._selectedIndex >= 0 ? this._selectedIndex : this._firstEnabledIndex();
            }
        }
        const len = this._options.length;
        for (let i = 0; i < len; i++) {
            idx = (idx + step + len) % len;
            if (!this._options[idx].disabled) {
                this._setActive(idx);
                break;
            }
        }
    }
    _setActiveToEdge(edge) {
        if (edge === 'start') {
            for (let i = 0; i < this._options.length; i++) {
                if (!this._options[i].disabled) { this._setActive(i); break; }
            }
        } else {
            for (let i = this._options.length - 1; i >= 0; i--) {
                if (!this._options[i].disabled) { this._setActive(i); break; }
            }
        }
    }

    _selectByIndex(index) {
        const opt = this._options[index];
        if (!opt || opt.disabled) return;
        if (index === this._selectedIndex) {
            this._closeDropdown();
            return;
        }
        this._selectedIndex = index;
        this._syncAriaSelected();
        this._renderButtonText();
        this._syncHiddenInput();
        // reflete atributo e dispara eventos
        const newValue = opt.value;
        const oldValue = this.getAttribute('value');
        if (oldValue !== newValue) {
            this.setAttribute('value', newValue);
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }
        this._closeDropdown();
    }

    _setValue(value, fireEvents = true) {
        // encontra índice do valor
        const idx = this._options.findIndex(o => o.value === value && !o.disabled);
        const oldValue = this.getAttribute('value');

        if (idx >= 0) {
            this._selectedIndex = idx;
        } else {
            // valor não encontrado (ou todos desabilitados): des-seleciona
            this._selectedIndex = -1;
        }
        this._syncAriaSelected();
        this._renderButtonText();
        this._syncHiddenInput();

        // refletir atributo e eventos
        if (oldValue !== value) {
            // se valor inexistente, ainda refletimos o atributo (pode ser intencional)
            this.setAttribute('value', value);
            if (fireEvents) {
                this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            }
        }
    }

    _syncAriaSelected() {
        this._options.forEach((o, i) => {
            if (i === this._selectedIndex) {
                o.li.setAttribute('aria-selected', 'true');
                o.li.classList.add('is-selected');
            } else {
                o.li.removeAttribute('aria-selected');
                o.li.classList.remove('is-selected');
            }
        });
    }

    _renderButtonText() {
        const placeholder = this.getAttribute('placeholder');
        if (this._selectedIndex >= 0 && this._options[this._selectedIndex]) {
            this._btnValueEl.textContent = this._options[this._selectedIndex].label;
            this._btnEl.classList.remove('is-placeholder');
        } else {
            this._btnValueEl.textContent = placeholder ?? '';
            if (placeholder) this._btnEl.classList.add('is-placeholder');
            else this._btnEl.classList.remove('is-placeholder');
        }
    }

    _syncHiddenInput() {
        const v = (this._selectedIndex >= 0 && this._options[this._selectedIndex]) ? this._options[this._selectedIndex].value : '';
        this._hiddenEl.value = v;
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