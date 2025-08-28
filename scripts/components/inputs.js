class Input extends HTMLElement {
    constructor() {
        super();
        this._rootEl = null;      // container (.algol_component-group)
        this._labelEl = null;     // <label>
        this._inputEl = null;     // <input>
    }

    // ****************************************************************************
    // Métodos
    // ****************************************************************************
    
    /** Faz a construção interna do compoenente */
    _init(type = 'text') {
        // cria o componente <label>
        const label = document.createElement('label');
        // movimenta o conteúdo da tag pesonalizada para dentro do <label>
        const frag = document.createDocumentFragment();
        while (this.firstChild) frag.appendChild(this.firstChild);
        if (frag.childNodes.length) label.appendChild(frag);

        // cria o componente <input>
        const input = document.createElement('input');
        input.type = type;
        input.className = 'algol_input';

        // cria o grupo que armazenará o <label> e o <input>
        const group = document.createElement('div');
        group.className = 'algol_component-group';

        // monta a árvore: group -> label + input
        group.appendChild(label);
        group.appendChild(input);

        // guarda referências
        this._rootEl = group;
        this._labelEl = label;
        this._inputEl = input;

        // Encaminhar eventos do input para o host (input/change) de forma composta:
        // re-dispatch para garantir consistência de bubbles/composed (em light DOM não é estritamente necessário,
        // porém facilita quem escuta diretamente no custom element).
        input.addEventListener('input', (e) => {
            this.setAttribute('value', input.value); // atualiza atributo 'value' no host
            // propaga evento 'input' a partir do host (composed e bubbles)
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        input.addEventListener('change', (e) => {
            this.setAttribute('value', input.value); // atualiza atributo 'value' no host
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        // substitui o conteúdo do host pelo componente interno
        this.appendChild(group);
    }

    _applyAttributes() {
        // label: prioriza o conteúdo movido (se houver), senão atributo 'label', senão padrão
        if (!(this._labelEl && this._labelEl.childNodes.length > 0)) {
            const labelAttr = this.getAttribute('label') || this.textContent || 'label';
            this._labelEl.textContent = labelAttr;
        }
        
        // placeholder/value/disabled
        if (this.hasAttribute('placeholder')) this._inputEl.placeholder = this.getAttribute('placeholder');
        if (this.hasAttribute('value')) this._inputEl.value = this.getAttribute('value');
        this._inputEl.disabled = this.hasAttribute('disabled');

        // posição: adiciona classes no host para manter compatibilidade com seu CSS atual
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol-position-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol-position-${pos}`);
    }

    // ****************************************************************************
    // Gettes & Setters
    // ****************************************************************************

    get value() { return this._inputEl ? this._inputEl.value : this.getAttribute('value') || ''; }
    set value(v) { this.setAttribute('value', v); }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** invocado automaticamente quando o componente é inserido no DOM ou movido para outro local. */
    connectedCallback() {
        if (!this._rootEl) this._init(); // cria a estrutura apenas uma vez
        this._applyAttributes();
    }

    // se o valor de algum desses atributos mudar...
    static observedAttributes = ['value', 'placeholder', 'disbled', 'position', 'label']; // necessário para o funcionamento do "attributeChangedCallback"
    /** invocado automaticamente quando muda o valor de algum atributo observado ('observedAttributes'). */
    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (this._rootEl) this._applyAttributes();
    }
}

/* === subclasses simples que apenas definem o tipo do input === */

class InputText extends Input {
    constructor() { super(); }
    connectedCallback() { if (!this._rootEl) this._init('text'); super.connectedCallback(); }
}
class InputEmail extends Input {
    constructor() { super(); }
    connectedCallback() { if (!this._rootEl) this._init('email'); super.connectedCallback(); }
}
class InputPassword extends Input {
    constructor() { super(); }
    connectedCallback() { if (!this._rootEl) this._init('password'); super.connectedCallback(); }
}

/* === InputNumber: inclui botões de spinner e validação de min/max === */

class InputNumber extends Input {
    static observedAttributes = ['value', 'min', 'max', 'disabled', 'position', 'label'];

    constructor() {
        super();
        this._btnUp = null;
        this._btnDown = null;
        this._min = null;
        this._max = null;
    }

    connectedCallback() {
        if (!this._rootEl) this._initNumber();
        this._applyAttributes(); // aplica min/max/position/label/value
        // garante que listeners sejam adicionados (se necessário)
        this._attachSpinnerListeners();
    }

    // cria estrutura específica para number (com botões up/down)
    _initNumber() {
        // cria label e move conteúdo do host para o label, como em Input._init
        const label = document.createElement('label');
        const frag = document.createDocumentFragment();
        while (this.firstChild) frag.appendChild(this.firstChild);
        if (frag.childNodes.length) label.appendChild(frag);

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'algol_input';

        // container e botões
        const inputContainer = document.createElement('div');
        inputContainer.className = 'algol_input-container';
        inputContainer.appendChild(input);

        const spinner = document.createElement('div');
        spinner.className = 'algol_spinner-buttons';
        const up = document.createElement('div'); up.className = 'algol_spinner-up'; up.textContent = '▲';
        const down = document.createElement('div'); down.className = 'algol_spinner-down'; down.textContent = '▼';
        spinner.appendChild(up); spinner.appendChild(down);
        inputContainer.appendChild(spinner);

        const group = document.createElement('div');
        group.className = 'algol_component-group';
        group.appendChild(label);
        group.appendChild(inputContainer);

        // guarda referências
        this._rootEl = group;
        this._labelEl = label;
        this._inputEl = input;
        this._btnUp = up;
        this._btnDown = down;

        // input events -> reflete atributo value e re-dispatch
        input.addEventListener('input', () => {
            this.setAttribute('value', input.value);
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        input.addEventListener('change', () => {
            this._clamp();
            this.setAttribute('value', input.value);
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        this.appendChild(group);
    }

    _applyAttributes() {
        // label/position/disabled/value (usa método do pai parcialmente)
        super._applyAttributes && super._applyAttributes();

        // min/max/value
        this._min = this.hasAttribute('min') ? Number(this.getAttribute('min')) : undefined;
        this._max = this.hasAttribute('max') ? Number(this.getAttribute('max')) : undefined;

        if (this._min !== undefined) this._inputEl.min = String(this._min);
        else this._inputEl.removeAttribute('min');

        if (this._max !== undefined) this._inputEl.max = String(this._max);
        else this._inputEl.removeAttribute('max');

        if (this.hasAttribute('value')) this._inputEl.value = this.getAttribute('value');
        // aplica disabled ao input e botões
        const dis = this.hasAttribute('disabled');
        this._inputEl.disabled = dis;
        if (this._btnUp) this._btnUp.style.pointerEvents = dis ? 'none' : '';
        if (this._btnDown) this._btnDown.style.pointerEvents = dis ? 'none' : '';

        // garante que o valor esteja dentro dos limites
        this._clamp();
    }

    _clamp() {
        const val = Number(this._inputEl.value);
        if (Number.isNaN(val)) {
            if (this._min !== undefined) this._inputEl.value = String(this._min);
            else this._inputEl.value = '';
            return;
        }
        if (this._min !== undefined && val < this._min) this._inputEl.value = String(this._min);
        if (this._max !== undefined && val > this._max) this._inputEl.value = String(this._max);
    }

    _attachSpinnerListeners() {
        if (!this._btnUp || !this._btnDown || this._spinnerAttached) return;
        // clique simples
        this._btnUp.addEventListener('click', () => { if (!this.disabled) this._step(1); });
        this._btnDown.addEventListener('click', () => { if (!this.disabled) this._step(-1); });
        // validação teclado simples (setas)
        this._inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); this._step(1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); this._step(-1); }
        });
        // change handler already set in _initNumber
        this._spinnerAttached = true;
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
}

/* =======================================================================
   Registros (apenas para os inputs; os botões você já separou em buttons.js)
   ======================================================================= */
