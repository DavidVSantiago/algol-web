/** classe base para inputs
 * atributos gerais:
 * - label -> define o rótulo do form. se não existir o form não possuirá rótulo
 * - placeholder ->
 * - position ->
 * - value ->
 * - disabled ->
 */
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

        this.appendChild(group);// coloca os elementos dentro da tag

        // guarda referências
        this._rootEl = group;
        this._labelEl = label;
        this._inputEl = input;
    }
    _initEvents() {
        // Eventos input/change (mantêm valor atualizado)
        this._inputEl.addEventListener('input', (e) => {
            this.setAttribute('value', this._inputEl.value); // atualiza atributo 'value' no host
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true })); // propaga evento 'input' a partir do host (composed e bubbles)
        });
        this._inputEl.addEventListener('change', (e) => {
            this.setAttribute('value', this._inputEl.value); // atualiza atributo 'value' no host
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true })); // propaga evento 'input' a partir do host (composed e bubbles)
        });
    }

    _applyAttributes() {
        // trata do atrituto 'label'
        const label = this.getAttribute('label');
        if (label && label != '') { // existe o atributo label e ele não está vazio
            this._labelEl.textContent = label;
            // se o label não estiver inserido no componente, insere ele antes do input
            if (!this._labelEl.parentNode) this._rootEl.insertBefore(this._labelEl, this._inputEl)
        } else { // não existe o atributo label
            // se o label estiver inserido no compoenente, remove-o
            if (this._labelEl.parentNode) this._rootEl.removeChild(this._labelEl);
        }

        // trata do atrituto 'placeholder'
        if (this.hasAttribute('placeholder')) this._inputEl.placeholder = this.getAttribute('placeholder');

        // trata do atrituto 'value'
        if (this.hasAttribute('value')) this._inputEl.value = this.getAttribute('value');

        // trata do atrituto 'position'
        const positions = ['left', 'center', 'right', 'all'];
        this.classList.remove(...positions.map(p => `algol_position-${p}`));
        const pos = this.getAttribute('position');
        if (positions.includes(pos)) this.classList.add(`algol_position-${pos}`);

        // trata do atrituto 'disabled'
        if (this.hasAttribute('disabled')) this._inputEl.disabled = true;
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
        if (!this._rootEl) { // cria a estrutura apenas uma vez
            this._init();
            this._initEvents();
        }
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
    connectedCallback() { if (!this._rootEl) { this._init('text'); this._initEvents(); } super.connectedCallback(); }
}
class InputEmail extends Input {
    constructor() { super(); }
    connectedCallback() { if (!this._rootEl) { this._init('email'); this._initEvents(); } super.connectedCallback(); }
}
class InputPassword extends Input {
    constructor() { super(); }
    connectedCallback() { if (!this._rootEl) { this._init('password'); this._initEvents(); } super.connectedCallback(); }
}

/* === InputNumber: inclui botões de spinner e validação de min/max === */
class InputNumber extends Input {

    // sobrescreve os atributos observados
    static observedAttributes = ['value', 'min', 'max', 'disabled', 'position', 'label'];

    constructor() {
        super();
        this._btnUp = null;
        this._btnDown = null;
        this._min = null;
        this._max = null;
    }

    // ****************************************************************************
    // Métodos
    // ****************************************************************************

    // cria estrutura específica para number (com botões up/down)
    _init() {
        super._init();

        // container para agrupar o input e o spinner
        const inputContainer = document.createElement('div');
        inputContainer.className = 'algol_input-container';

        // cria o componente do spinner dos botões
        const spinner = document.createElement('div');
        spinner.className = 'algol_spinner-buttons';
        const up = document.createElement('div'); up.className = 'algol_spinner-up'; up.textContent = '▲';
        const down = document.createElement('div'); down.className = 'algol_spinner-down'; down.textContent = '▼';
        spinner.appendChild(up); spinner.appendChild(down);

        // adiciona o input e o spinner  
        inputContainer.appendChild(this._inputEl);
        inputContainer.appendChild(spinner);

        this._rootEl.appendChild(inputContainer);

        // guarda referências
        this._btnUp = up;
        this._btnDown = down;
    }

    _removeEvents() {
        this._btnUp.removeEventListener('click', listener);
        this._btnDown.removeEventListener('click', listener);
        this._inputEl.removeEventListener('keydown', listener);
    }

    _initEvents() {
        this._btnUp.addEventListener('click', () => { this._step(1); console.log('+'); });
        this._btnDown.addEventListener('click', () => { this._step(-1); console.log('-'); });
        // validação teclado simples (setas)
        this._inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); this._step(1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); this._step(-1); }
        });
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
        if (this.disabled) {
            this._inputEl.disabled;
            this._btnUp.style.color = 'gray';
            this._btnDown.style.color = 'gray';
            this._btnUp.style.pointerEvents = 'none';
            this._btnDown.style.pointerEvents = 'none';
        }

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
    connectedCallback() {
        if (!this._rootEl) { this._init(); this._initEvents(); }
        this._applyAttributes();
    }

    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (this._rootEl) {
            if (name = 'disabled') {
                if (this.disabled) {
                    this._inputEl.disabled = true;
                    this._btnUp.style.color = 'gray';
                    this._btnDown.style.color = 'gray';
                    this._btnUp.style.pointerEvents = 'none';
                    this._btnDown.style.pointerEvents = 'none';
                } else {
                    this._inputEl.disabled = false;
                    this._btnUp.style.color = 'black';
                    this._btnDown.style.color = 'black';
                    this._btnUp.style.pointerEvents = '';
                    this._btnDown.style.pointerEvents = '';
                }
            }
            this._applyAttributes();
        }
    }
}

/* =======================================================================
   Registros (apenas para os inputs; os botões você já separou em buttons.js)
   ======================================================================= */
