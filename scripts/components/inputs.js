/** classe base para inputs
 * atributos gerais:
 * - label -> define o rótulo do form. se não existir o form não possuirá rótulo
 * - placeholder ->
 * - position ->
 * - value ->
 * - disabled ->
 */
class Input extends HTMLElement {
    // atributos observador do compontente
    static get observedAttributes() { return ['value', 'placeholder', 'disabled', 'position', 'label']; } // necessário para o funcionamento do "attributeChangedCallback"

    constructor() {
        super();
        this._rootEl = null;      // container (.algol_component-group)
        this._labelEl = null;     // <label>
        this._inputEl = null;     // <input>
        this._type = 'text';

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

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************

    /** Serve para reaplicar os atributos nas partes filhas dos componentes */
    _applyAttributes() {
        if (!this._rootEl) return; // guard
        // invoca funções específicas para aplicar cada um dos atributos de forma individual
        this._applyAttribute_label();
        this._applyAttribute_placeholder();
        this._applyAttribute_value();
        this._applyAttribute_position();
        this._applyAttribute_disabled();
    }
    _applyAttribute_label() {
        const label = this.getAttribute('label');
        if (label && label != '') { // existe o atributo label e ele não está vazio
            this._labelEl.textContent = label;
            // se o label não estiver inserido no componente, insere ele antes do input
            if (!this._labelEl.parentNode) this._rootEl.insertBefore(this._labelEl, this._inputEl)
        } else { // não existe o atributo label
            // se o label estiver inserido no compoenente, remove-o
            if (this._labelEl.parentNode) this._rootEl.removeChild(this._labelEl);
        }
    }
    _applyAttribute_placeholder() {
        if (this.hasAttribute('placeholder')) this._inputEl.placeholder = this.getAttribute('placeholder');
    }
    _applyAttribute_value() {
        if (this.hasAttribute('value')) this._inputEl.value = this.getAttribute('value');
    }
    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-${pos}`);
    }
    _applyAttribute_disabled() {
        const isDisabled = this.hasAttribute('disabled');
        // propriedade do elemento real (impede interação)
        if (this._inputEl) this._inputEl.disabled = isDisabled;
    }

    // ****************************************************************************
    // Gettes & Setters
    // ****************************************************************************

    get value() { return this._inputEl ? this._inputEl.value : this.getAttribute('value') || ''; }
    set value(v) { this.setAttribute('value', v); }

    disable() { this.setAttribute('disabled', ''); }
    enable() { this.removeAttribute('disabled'); }

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
            case 'label': this._applyAttribute_label(); break;
            case 'placeholder': this._applyAttribute_placeholder(); break;
            case 'value': this._applyAttribute_value(); break;
            case 'position': this._applyAttribute_position(); break;
            case 'disabled': this._applyAttribute_disabled(); break;
        }
    }
}

/* === subclasses simples que apenas definem o tipo do input === */

class InputText extends Input {
    constructor() { super(); }
    connectedCallback() { super.connectedCallback(); }
}
class InputEmail extends Input {
    constructor() { super(); }
    connectedCallback() { this._type = 'email'; super.connectedCallback(); }
}
class InputPassword extends Input {
    constructor() { super(); }
    connectedCallback() { this._type = 'password'; super.connectedCallback(); }
}

/* === InputNumber: inclui botões de spinner e validação de min/max === */
class InputNumber extends Input {
    // sobrescreve os atributos observados
    static get observedAttributes() { return ['value', 'min', 'max', 'disabled', 'position', 'label']; }
    constructor() {
        super();
        this._btnUp = null;
        this._btnDown = null;
        this._min = null;
        this._max = null;

        this._initialized = false; // para saber se o componente foi inicializado
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

    // cria estrutura específica para number (com botões up/down)
    _init() {
        if (this._initialized) return;
        super._init();

        // container para agrupar o input e o spinner
        const inputContainer = document.createElement('div');
        inputContainer.className = 'algol_input-container';

        // cria o componente do spinner dos botões
        const spinner = document.createElement('div');
        spinner.className = 'algol_spinner-buttons';
        const up = document.createElement('div'); up.className = 'algol_spinner-up'; up.textContent = '▲';
        const down = document.createElement('div'); down.className = 'algol_spinner-down'; down.textContent = '▼';
        // evitar seleção de texto ao clicar nos botões
        up.style.userSelect = 'none';
        up.style.msUserSelect = 'none';
        down.style.userSelect = 'none';
        down.style.msUserSelect = 'none';
        // prevenir início de seleção pelo mouse
        up.addEventListener('mousedown', e => e.preventDefault());
        down.addEventListener('mousedown', e => e.preventDefault());
        // melhorar acessibilidade/controle por teclado
        up.setAttribute('role', 'button'); up.setAttribute('tabindex', '0');
        down.setAttribute('role', 'button'); down.setAttribute('tabindex', '0');

        spinner.appendChild(up); spinner.appendChild(down);

        // adiciona o input e o spinner  
        inputContainer.appendChild(this._inputEl);
        inputContainer.appendChild(spinner);

        this._rootEl.appendChild(inputContainer);

        // guarda referências
        this._btnUp = up;
        this._btnDown = down;

        this._initialized = true;
    }

    _attachEvents() {
        if (!this._inputEl) return; // guard!!!
        // cria os eventos
        if (!this._btnUpEvent) { this._btnUpEvent = (e) => { this._step(1); }; }
        if (!this._btnDownEvent) { this._btnDownEvent = (e) => { this._step(-1); }; }
        if (!this._inputElKeydownEvent) {
            this._inputElKeydownEvent = (e) => {
                if (e.key === 'ArrowUp') { e.preventDefault(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); }
            };
        }
        if (!this._inputElBlurEvent) { this._inputElBlurEvent = (e) => { this._validateAndApply(); }; }
        if (!this._onChange) {
            this._onChange = (e) => {
                // manter compatibilidade: quando houver um change nativo, validar/aplicar também
                this._validateAndApply();
                this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            };
        };

        this._btnUp.addEventListener('click', this._btnUpEvent);
        this._btnDown.addEventListener('click', this._btnDownEvent);
        this._inputEl.addEventListener('keydown', this._inputElKeydownEvent);
        this._inputEl.addEventListener('blur', this._inputElBlurEvent);
        this._inputEl.addEventListener('change', this._onChange);
    }

    _detachEvents() {
        if (!this._inputEl) return; // guard
        //remove os eventos
        if (this._btnUpEvent) {
            this._btnUp.removeEventListener('click', this._btnUpEvent);
            this._btnUpEvent = null;
        }
        if (this._btnDownEvent) {
            this._btnDown.removeEventListener('click', this._btnDownEvent);
            this._btnDownEvent = null;
        }
        if (this._inputElKeydownEvent) {
            this._inputEl.removeEventListener('keydown', this._inputElKeydownEvent);
            this._inputElKeydownEvent = null;
        }
        if (this._inputElBlurEvent) {
            this._inputEl.removeEventListener('blur', this._inputElBlurEvent);
            this._inputElBlurEvent = null;
        }
        if (this._onChange) {
            this._inputEl.removeEventListener('change', this._onChange);
            this._onChange = null;
        }
    }

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************

    _applyAttributes() { // override
        if (!this._rootEl) return; // guard

        super._applyAttribute_label();
        super._applyAttribute_placeholder();
        super._applyAttribute_value();
        super._applyAttribute_position();
        this._applyAttribute_disabled();
        this._applyAttribute_minmax();

        this._clamp();
    }
    _applyAttribute_disabled() { // override
        const isDisabled = this.hasAttribute('disabled');
        // propriedade do elemento real (impede interação)
        if (!this._inputEl) return; // guard

        if (isDisabled) {
            // salva o valor visível e limpa a caixa para que nada apareça
            this._savedValue = this._inputEl.value;            
            this._inputEl.value = '';
            this._inputEl.disabled = true;
            // remover listeners para evitar alterações enquanto desabilitado
            this._detachEvents();
        } else {
            // habilita, restaura valor (atributo 'value' tem precedência)
            this._inputEl.disabled = false;
            const restored = this.hasAttribute('value') ? this.getAttribute('value') : (this._savedValue !== undefined ? this._savedValue : '');
            this._inputEl.value = restored;
            this._savedValue = undefined; // limpa a savedValue após restaurar
            // reaplica listeners
            this._attachEvents();
        }
    }
    _applyAttribute_minmax() {
        this._min = this.hasAttribute('min') ? Number(this.getAttribute('min')) : undefined;
        this._max = this.hasAttribute('max') ? Number(this.getAttribute('max')) : undefined;
        if (this._min !== undefined) this._inputEl.min = String(this._min);
        else this._inputEl.removeAttribute('min');
        if (this._max !== undefined) this._inputEl.max = String(this._max);
        else this._inputEl.removeAttribute('max');
    }

    // ****************************************************************************
    // Métodos auxiliares
    // ****************************************************************************

    _validateAndApply() {
        // comportamento solicitado:
        // - permitir digitar qualquer coisa
        // - ao Enter/blur: se não-numérico -> setar min (se houver) ou ''
        // - se < min -> min ; se > max -> max
        const raw = this._inputEl.value.trim();
        const num = Number(raw);

        if (raw === '') {
            // vazio: respeitar min? manter vazio e refletir atributo vazio
            this._inputEl.value = '';
            this.setAttribute('value', this._inputEl.value);
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            return;
        }

        if (Number.isNaN(num)) {
            // não-numérico
            if (this._min !== undefined) {
                this._inputEl.value = String(this._min);
            } else {
                this._inputEl.value = '';
            }
        } else {
            // é número: aplicar min/max
            let v = num;
            if (this._min !== undefined && v < this._min) v = this._min;
            if (this._max !== undefined && v > this._max) v = this._max;
            this._inputEl.value = String(v);
        }

        // reflete atributo e dispara eventos
        this.setAttribute('value', this._inputEl.value);
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    _clamp() {
        if(this.hasAttribute('disabled')) return;
        const val = Number(this._inputEl.value);
        if (Number.isNaN(val)) {
            if (this._min !== undefined) this._inputEl.value = String(this._min);
            else this._inputEl.value = '';
            return;
        }
        if (this._min !== undefined && val < this._min) this._inputEl.value = String(this._min);
        if (this._max !== undefined && val > this._max) this._inputEl.value = String(this._max);
    }

    _step(dir) {
        const step = Number(this._inputEl.step) || 1;
        let val = Number(this._inputEl.value) || 0;
        val = val + dir * step;
        if (this._min !== undefined && val < this._min) val = this._min;
        if (this._max !== undefined && val > this._max) val = this._max;
        this._inputEl.value = String(val);
        // reflete e dispara eventos
        this.setAttribute('value', this._inputEl.value);
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** chamado quando um atributo OBSERVADO muda de valor */
    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (!this._connected) return; // só trata eventos de mudança se tiver montado

        switch (name) {
            case 'label': super._applyAttribute_label(); break;
            case 'placeholder': super._applyAttribute_placeholder(); break;
            case 'value': super._applyAttribute_value(); break;
            case 'position': super._applyAttribute_position(); break;
            case 'disabled': this._applyAttribute_disabled(); break;
            case 'min': this._applyAttribute_minmax(); break;
            case 'max': this._applyAttribute_minmax(); break;
        }
    }
}
