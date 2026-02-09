const GLOBAL = {
    'scale-factor': 1.0, 

    'scale-factor-break': 3.0, 

    'font-size': '1.1vw', 

    'font-size-break': '1.1vw', 

    'line-height': '1.6vw', 

    'line-height-break': '1.6vw', 

    'border-radius-components': '0.2vw', 

    'border-radius-layout': '0.4vw', 

    'font-size-btn': '1.2vw', 

    'margin-page': '2vw', 

    'margin-page-break': '1vw', 

  }

const MOBILE_BREAKPOINT = '600px'; 

const fontBase64 = "data:application/font-woff;base64,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";

function injectGlobalVariablesStyles() {
    if (document.getElementById('algol-global-variables-style')) return; 

    const style = document.createElement('style');
    style.id = 'algol-global-variables-style';

    style.textContent = ':root {';
    for (const chave in GLOBAL) {
        style.textContent += `  --${chave}: ${GLOBAL[chave]};`;
    }
    style.textContent += '}';
    style.textContent +=
    `@media (max-width: ${MOBILE_BREAKPOINT}) {
        :root {
            --scale-factor: var(--scale-factor-break); 
        }
    }`;

    style.textContent +=
    `@font-face {
        font-family: "Algol Font";
        font-weight: normal;
        font-style: normal;
        src: url("${fontBase64}") format("woff");
    }`;
    document.head.appendChild(style);
}
injectGlobalVariablesStyles();

function injectGlobalNormalizationStyles() {
  if (document.getElementById('algol-global-normalization-style')) return; 

  const style = document.createElement('style');
  style.id = 'algol-global-normalization-style';

  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      border: none;
    }
    body {
        font-family: 'Algol Font';
        font-weight: 100;
        font-style: normal;
        font-size: calc(var(--font-size) * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));
        margin: calc(var(--margin-page) * var(--scale-factor));
        color: var(--text-color);
        background-color: var(--bg-color);
    }
    main {
        margin: 0 auto;
    }

    h1 {
        font-size: calc(2.0vw * var(--scale-factor));
    }
    h2 {
        font-size: calc(1.8vw * var(--scale-factor));
    }
    h3 {
        font-size: calc(1.6vw * var(--scale-factor));
    }
    h4 {
        font-size: calc(1.4vw  * var(--scale-factor));
    }
    h5 {
        font-size: calc(1.2vw  * var(--scale-factor));
    }
    h6 {
        font-size: calc(1.0vw * var(--scale-factor));
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: calc(1vw * var(--scale-factor));
        margin-bottom: calc(2vw * var(--scale-factor));
        font-weight: 600;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}) {
        body {
            font-size: calc(var(--font-size-break) * var(--scale-factor));
            margin: calc(var(--margin-page-break) * var(--scale-factor));
            line-height-break: calc(var(--line-height-break) * var(--scale-factor));
        }
    }
  `;
  document.head.appendChild(style);
}
injectGlobalNormalizationStyles();

function injectGlobalClasses() {
  if (document.getElementById('algol-global-classes-style')) return; 

  const style = document.createElement('style');
  style.id = 'algol-global-classes-style';

  style.textContent = `

    .algol-bubble-01 {
        padding: calc(1.0vw * var(--scale-factor));
        background-color: var(--bg-color-section-bubble-01);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-section-bubble-01);
        border-radius: calc(var(--border-radius-layout) * var(--scale-factor));
    }
    .algol-bubble-02 {
        padding: calc(1.0vw * var(--scale-factor));
        background-color: var(--bg-color-section-bubble-02);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-section-bubble-02);
        border-radius: calc(var(--border-radius-layout) * var(--scale-factor));
    }
  `;
  document.head.appendChild(style);
}
injectGlobalClasses();

class BaseComponent extends HTMLElement {
    static useShadow = true; 

    static get observedAttributes() { return []; } 

    constructor() {
        super();
        this.elems = {}; 

        this.inicializado = false;

        this._gerarAcessoresAutomaticos(); 

        if (this.constructor.useShadow) {
            this.root = this.attachShadow({ 

                mode: 'open',
                delegatesFocus: true,
            });
        } else {
            this.root = this; 

        }
    }

    render() { throw new Error("Método 'render' deve ser implementado."); }

    attachEvents() { throw new Error("Método 'attachEvents' deve ser implementado."); }

    postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

    configSlot(){
        const slot = this.root.querySelector('slot');
        if(this.constructor.useShadow===true && !slot) throw new Error("O seu método render() deve incluir um <slot> para o conteúdo interno do componente.");

        this.postConfig(); 

    }

    connectedCallback() {
        if (this.inicializado) return; 

        setTimeout(() => { 

            this.render(); 

            if(this.constructor.useShadow) 

                this.configSlot(); 

            else 

                this.postConfig();

            this.constructor.observedAttributes.forEach(attr => {
                const val = this.getAttribute(attr);
                if (val !== null) this.attributeChangedCallback(attr, null, val);
            });
            this.attachEvents();
            this._registerBaseEvents();
            this.inicializado = true;
        }, 0);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        const propMap = this.constructor.PROP_MAP;
        if (propMap && propMap[name]) {
            const method = propMap[name];
            if (typeof this[method] === 'function') {
                this[method](newValue);
                return;
            }
        }

        const attrMap = this.constructor.ATTR_MAP;
        if (attrMap && attrMap[name]) {
            const config = attrMap[name];
            const cssVar = typeof config === 'string' ? config : config.var;
            this.style.setProperty(cssVar, newValue);
            return;
        }
    }

    _gerarAcessoresAutomaticos() {
        const props = Object.keys(this.constructor.PROP_MAP || {});
        const attrs = Object.keys(this.constructor.ATTR_MAP || {});
        const all = [...new Set([...props, ...attrs])];

        all.forEach(attr => {
            if (attr in this) return; 

            Object.defineProperty(this, attr, {
                get: () => this.getAttribute(attr),
                set: (val) => { if (val === null || val === false) this.removeAttribute(attr); else this.setAttribute(attr, val);}
            });
        });
    }

    _registerBaseEvents(){

        this.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-click', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    mouse: {
                        x: e.clientX, y: e.clientY,
                        offsetX: e.offsetX, offsetY: e.offsetY
                    }
                }
            }));
        });

        this.addEventListener('focus', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-focus', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });

        this.addEventListener('blur', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-blur', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });

        this.addEventListener('mouseenter', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-mouseenter', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });

        this.addEventListener('mouseleave', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-mouseleave', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });

        this.addEventListener('mousemove', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            this.dispatchEvent(new CustomEvent('algol-mousemove', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    mouse: {
                        x: e.clientX, y: e.clientY,
                        offsetX: e.offsetX, offsetY: e.offsetY
                    }
                }
            }));
        });

    }
}
    class BaseLayout extends HTMLElement {
        static get observedAttributes() { return []; } 

        constructor() {
            super();
            this.elems = {}; 

            this.inicializado = false;
            this._observerEstrutura = null; 

        }

        postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

        connectedCallback() {
            this._ativarMonitoramentoDeConteudo();
            if (this.inicializado) return; 

            this._desativarMonitoramentoDeConteudo();
            this.postConfig(); 

            for(const attr of this.constructor.observedAttributes){
                const val = this.getAttribute(attr);
                if (val !== null) this.attributeChangedCallback(attr, null, val);
            };

            this._ativarMonitoramentoDeConteudo();
            this.inicializado = true;
        }

        disconnectedCallback() {
            this._desativarMonitoramentoDeConteudo();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;

            const propMap = this.constructor.PROP_MAP;
            if (propMap && propMap[name]) {
                const method = propMap[name];
                if (typeof this[method] === 'function') {
                    this[method](newValue);
                    return;
                }
            }

            const map = this.constructor.ATTR_MAP;
            if (!map || !map[name]) return; 

            const config = map[name]; 

            const isObj = typeof config === 'object';
            const cssVar = isObj ? config.var : config;
            const prefix = (isObj && config.prefix) ? config.prefix : '';
            const suffix = (isObj && config.suffix) ? config.suffix : '';

            this.style.setProperty(cssVar, prefix + newValue + suffix);
        }

        _ativarMonitoramentoDeConteudo() {
            if (this._observerEstrutura) return; 

            const callback = (mutationsList) => {

                this.dispatchEvent(new CustomEvent('algol-light-dom-update', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        origin: this,
                        mutations: mutationsList,
                    },
                }));
            };

            this._observerEstrutura = new MutationObserver(callback);
            this._observerEstrutura.observe(this, { childList: true, subtree: false, characterData: false});
        }
        _desativarMonitoramentoDeConteudo() {
            if (this._observerEstrutura) {
                this._observerEstrutura.disconnect();
                this._observerEstrutura = null;
            }
        }

        static _injectStyleOnHead(id, cssContent) {
            if (document.getElementById(id)) return; 

            const style = document.createElement('style');
            style.id = id;
            style.textContent = cssContent;
            document.head.appendChild(style);
        }
    }
    class Button extends BaseComponent {
    static get formAssociated() { return true; }

    static get PROP_MAP() {
        return {
            'size':     'update_size',     

            'type':     'update_type',     

            'disabled': 'update_disabled', 

            'loading':  'update_loading',  

            'name':     'update_name',     

            'value':    'update_value'     

        };
    }
    static get ATTR_MAP() {
        return {
            'bgcolor': '--bg-color-button', 

            'color': '--text-color', 

        };
    }
    static get observedAttributes() {return [...Object.keys(this.PROP_MAP), ...Object.keys(this.ATTR_MAP)];}
    constructor() {super(); this._internals = this.attachInternals();}

    render() {
        this.root.adoptedStyleSheets = [algol_button_sheet];
        this.root.innerHTML = `
            <button part="button">
                <span class="loader"></span>
                <span class="content"><slot></slot></span>
            </button>
        `;
    }

    postConfig(){

        this.elems.button = this.root.querySelector('button');
        this.elems.content = this.root.querySelector('.content');
        this.elems.slot = this.root.querySelector('slot');
    }

    attachEvents() {

        this.elems.button.addEventListener('click', (e) => {

            if (this.hasAttribute('loading')) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return;
            }

            if (this._internals.form) {
                const type = this.getAttribute('type');
                if (type === 'submit') this._internals.form.requestSubmit(); 
                else if (type === 'reset') this._internals.form.reset();
            }
        });
    }

    preventDefault(){
        this.elems.button.preventDefault();
    }
    stopImmediatePropagation(){
        this.elems.button.stopImmediatePropagation();
    }
    stopPropagation(){
        this.elems.button.stopPropagation();
    }

    update_disabled(val) { if(this.elems.button) this.elems.button.disabled = this.hasAttribute('disabled'); }
    update_loading(val) { 

        if(!this.elems.button) return;
        if (this.hasAttribute('loading')) {
            this.elems.button.classList.add('loading');
            this.elems.button.disabled = true; 

        } else {
            this.elems.button.classList.remove('loading');
            this.elems.button.disabled = this.hasAttribute('disabled'); 

        }
    }
    update_size(val) {

        if (!['small', 'mid', 'big'].includes(val)) this.setAttribute('size', 'mid'); 

    }
    update_type(val) {

        if (!['button', 'submit', 'reset'].includes(val)) {this.setAttribute('type', 'button');} 

        if(!this.elems.button) return;
        this.elems.button.type = val;
    }
    update_name(val) {} 
    update_value(val) {}
}

const algol_button_sheet = new CSSStyleSheet();
algol_button_sheet.replaceSync(`
    :host {
        display: block;
    }

    button {

        appearance: none;
        outline: none;
        border: none;
        user-select: none; 

        cursor: pointer;
        width: 100%;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: calc(0.6vw * var(--scale-factor)) calc(1.2vw * var(--scale-factor));
        min-height: calc(2.4vw * var(--scale-factor));
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        background-color: var(--bg-color-button);
        color: var(--text-color);
        font-family: 'Algol Font';
        font-weight: 200;
        font-size: calc(var(--font-size-btn)* var(--scale-factor));
    }

    button:hover:not(:disabled) {
        filter: brightness(1.1); 
    }
    button:active:not(:disabled) {
        transform: translateY(calc(0.09vw * var(--scale-factor))); 
        filter: brightness(0.9);
    }

    :host([size="small"]) button {
        padding: calc(0.4vw * var(--scale-factor)) calc(0.8vw * var(--scale-factor));
    }

    :host([size="mid"]) button { 
        padding: calc(0.6vw * var(--scale-factor)) calc(1.2vw * var(--scale-factor));
    }

    :host([size="big"]) button {
        padding: calc(0.8vw * var(--scale-factor)) calc(1.6vw * var(--scale-factor));
    }

    button:disabled {
        background-color: var(--bg-color-inputs-disabled);
        color: var(--text-color-disabled);
        cursor: not-allowed;
        opacity: 0.7;
    }

    .loader {
        display: none;
        width: calc(1.5vw * var(--scale-factor));
        height: calc(1.5vw * var(--scale-factor));
        border: calc(0.2vw * var(--scale-factor)) solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        position: absolute;
    }

    button.loading .content {
        visibility: hidden;
        opacity: 0; 
    }
    button.loading .loader {
        display: block;
        pointer-events: none; 
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    :host(:focus-within) button {
         box-shadow: 0 0 0 calc(0.2vw * var(--scale-factor)) var(--border-color-focus-glow);
    }
`);

customElements.define('algol-button', Button); 

class BaseCheckable extends BaseComponent {
    static get formAssociated() { return true; }

    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'checked': 'update_checked',
            'value': 'update_value',
            'disabled': 'update_disabled',
            'required': 'update_required',
            'name': 'update_name'
        };
    }
    static get observedAttributes() { return Object.keys(BaseCheckable.PROP_MAP); }

    constructor() {
        super();
        this._internals = this.attachInternals();
    }

    render() {
        throw new Error("O método 'render' deve ser implementado pela classe filha.");
    }

    postConfig() {
        this.elems.input = this.root.querySelector('input');

        const labels = this.root.querySelectorAll('label');
        this.elems.labelBox = labels[0]; 

        this.elems.labelText = labels[1]; 

        if(this.elems.labelBox) this.elems.labelBox.removeAttribute('for');
        if(this.elems.labelText) this.elems.labelText.removeAttribute('for');
    }

    attachEvents() {

        this.elems.input.addEventListener('change', (e) => {

            this.checked = this.elems.input.checked;
            this.dispatchEvent(new CustomEvent('algol-change', {
                bubbles: true, composed: true,
                detail: { 
                    origin: this, 
                    value: this.checked ? (this.getAttribute('value') || 'on') : null,
                    checked: this.checked
                }
            }));
        });

        this.elems.labelText.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;

            if (e.target !== this.elems.input) {

                this.elems.input.click();
            }
        });
    }

    get checked() { return this.hasAttribute('checked'); }
    set checked(isTrue) {

        if (isTrue) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    get name() { return this.getAttribute('name'); }
    set name(val) { this.setAttribute('name', val); }

    update_label(val) {
        if (this.elems.labelText) {
            this.elems.labelText.textContent = val;
            this.elems.labelText.style.display = val ? 'block' : 'none';
        }
    }

    update_checked(val) {
        const estaMarcado = this.hasAttribute('checked');

        if (this.elems.input) this.elems.input.checked = estaMarcado;

        this._atualizarFormValue();

        this._atualizarValidacao();
    }

    update_value(val) {
        if (this.elems.input) this.elems.input.value = val;

        this._atualizarFormValue();
    }

    update_disabled(val) {
        const isDisabled = this.hasAttribute('disabled');
        if (this.elems.input) this.elems.input.disabled = isDisabled;

        if(!this.elems.labelText) return;
        if(isDisabled) this.elems.labelText.style.cursor = 'not-allowed';
        else this.elems.labelText.style.cursor = 'pointer';
    }

    update_required(val) {
         if (!this.elems.input) return;
        this.elems.input.required = this.hasAttribute('required');
        this._atualizarValidacao();
    }

    update_name(val) {
        if (this.elems.input) this.elems.input.name = val;
    }

    _atualizarFormValue() {

        if (!this._internals || !this._internals.setFormValue) return;
        const valorReal = this.getAttribute('value') || 'on';
        this._internals.setFormValue(this.checked ? valorReal : null);
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validade = this.elems.input.validity;

        if (!validade.valid) {
            this._internals.setValidity(
                { valueMissing: validade.valueMissing },
                this.elems.input.validationMessage,
                this.elems.input 

            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class Checkbox extends BaseCheckable{
    static get formAssociated() { return true; }
    constructor() { super(); }

    render() {
        this.root.adoptedStyleSheets = [algol_checkables_sheet];
        this.root.innerHTML = `
            <div class="container">
                <label class="box-checkbox">
                    <input type="checkbox">
                    <span class="ball-checkbox" style="user-select: none;"></span>
                </label>
                <label style="cursor: pointer; user-select: none;"></label>
                <slot></slot>
            </div>
        `;
    }
}

class SwitchCheckbox extends BaseCheckable{
    static get formAssociated() { return true; }
    constructor() { super(); }

    render() {
        this.root.adoptedStyleSheets = [algol_checkables_sheet];
        this.root.innerHTML = `
            <div class="container">
                <label class="box-switch-checkbox">
                    <input type="checkbox">
                    <span class="ball-switch-checkbox" style="user-select: none;"></span>
                </label>
                <label style="cursor: pointer; user-select: none;"></label>
                <slot></slot>
            </div>
        `;
    }
}

class Radio extends BaseCheckable {

    static get formAssociated() { return true; }

    constructor() { super(); }

    render() {

        this.root.adoptedStyleSheets = [algol_checkables_sheet];
        this.root.innerHTML = `
            <div class="container">
                <label class="box-radio">
                    <input type="radio">
                    <span class="ball-radio"></span>
                </label>
                <label style="cursor: pointer; user-select: none;"></label>
                <slot></slot>
            </div>
        `;
    }

    update_checked(val) {

        super.update_checked(val);

        if (this.checked) {
            this._garantirUnicidadeDoGrupo();
        }
    }

    _garantirUnicidadeDoGrupo() {
        const name = this.name;
        if (!name) return; 

        const root = this.getRootNode();

        if (!root || !root.querySelectorAll) return;

        const siblings = root.querySelectorAll(`algol-radio[name="${name}"]`);

        siblings.forEach(radio => {

            if (radio !== this && radio.checked) {
                radio.checked = false; 

            }
        });
    }
}

class SwitchRadio extends BaseCheckable {

    static get formAssociated() { return true; }

    constructor() { super(); }

    render() {
        this.root.adoptedStyleSheets = [algol_checkables_sheet];

        this.root.innerHTML = `
            <div class="container">
                <label class="box-switch-radio">
                    <input type="radio"> <span class="ball-switch-radio" style="user-select: none;"></span>
                </label>
                <label style="cursor: pointer; user-select: none;"></label>
                <slot></slot>
            </div>
        `;
    }

    update_checked(val) {

        super.update_checked(val);

        if (this.checked) {
            this._garantirUnicidadeDoGrupo();
        }
    }

    _garantirUnicidadeDoGrupo() {
        const name = this.name;
        if (!name) return; 

        const root = this.getRootNode();
        if (!root || !root.querySelectorAll) return;

        const siblings = root.querySelectorAll(`algol-switch-radio[name="${name}"]`);

        siblings.forEach(elem => {

            if (elem !== this && elem.checked) {
                elem.checked = false; 
            }
        });
    }
}

const algol_checkables_sheet = new CSSStyleSheet();
algol_checkables_sheet.replaceSync(`
    :host([disabled]){
        color: var(--text-color-disabled);
    }

    .container{
        display: flex;
        flex-direction: row;
        gap: calc(0.5vw * var(--scale-factor));
        justify-content: start;
        align-items: center;
    }

    .container .box-checkbox,
    .container .box-radio,
    .container .box-switch-checkbox,
    .container .box-switch-radio{
        position: relative;
        background-color: var(--bg-color-inputs);
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container .box-checkbox{
        width: calc(1.8vw * var(--scale-factor));
        height: calc(1.8vw * var(--scale-factor));
        border-radius: calc(0.3vw * var(--scale-factor));
    }
    .container .box-radio{
        width: calc(1.8vw * var(--scale-factor));
        height: calc(1.8vw * var(--scale-factor));
        border-radius: calc(0.9vw * var(--scale-factor));
    }
    .container .box-switch-checkbox,
    .container .box-switch-radio{
        width: calc(3vw * var(--scale-factor));
        height: calc(1.8vw * var(--scale-factor));
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color);
        border-radius: calc(0.9vw * var(--scale-factor));
    }

    .container .box-checkbox:hover:has(input:not(:checked):not(:disabled)),
    .container .box-radio:hover:has(input:not(:checked):not(:disabled)),
    .container .box-switch-checkbox:hover:has(input:not(:checked):not(:disabled)),
    .container .box-switch-radio:hover:has(input:not(:checked):not(:disabled)) {
        background-color: var(--border-color-btn-spinner-disabled);
    }

    .container span{
        position: absolute;
        left: calc(0.35vw * var(--scale-factor));
    }
    .container .box-checkbox .ball-checkbox,
    .container .box-radio .ball-radio{
        background-color: var(--bg-color-button);
        opacity: 0;
        width: calc(1.1vw * var(--scale-factor));
        height: calc(1.1vw * var(--scale-factor));
        transition: opacity 0.1s ease;

    }
    .container .box-checkbox .ball-checkbox{
        border-radius: calc(0.15vw * var(--scale-factor));
    }
    .container .box-radio .ball-radio{
        border-radius: calc(0.55vw * var(--scale-factor));
    }
    .container .box-switch-checkbox .ball-switch-checkbox,
    .container .box-switch-radio .ball-switch-radio{
        background-color: var(--text-color-disabled);
        width: calc(1.2vw * var(--scale-factor));
        height: calc(1.2vw * var(--scale-factor));
        border-radius: calc(1.5vw * var(--scale-factor));
        transition: left 0.3s ease, background-color 0.3s ease;

    }

    .container input{
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        margin: 0;
    }

    .container .box-checkbox input:checked ~ .ball-checkbox,
    .container .box-radio input:checked ~ .ball-radio{
        opacity: 100%;
    }
    .container .box-switch-checkbox input:checked ~ .ball-switch-checkbox,
    .container .box-switch-radio input:checked ~ .ball-switch-radio{
        left: calc(1.5vw * var(--scale-factor));
        background-color: var(--bg-color-button);
    }

    .container .box-checkbox:has(input:disabled),
    .container .box-radio:has(input:disabled),
    .container .box-switch-checkbox:has(input:disabled),
    .container .box-switch-radio:has(input:disabled){
        background-color: var(--text-color-disabled);
        cursor: not-allowed;
    }
`);

customElements.define('algol-checkbox', Checkbox);
customElements.define('algol-switch-checkbox', SwitchCheckbox);
customElements.define('algol-radio', Radio);
customElements.define('algol-switch-radio', SwitchRadio);

class Image extends BaseComponent {

    static get PROP_MAP() {
        return {
            'src': 'update_src',
            'alt': 'update_alt',
            'width': 'update_width',
            'height': 'update_height',
            'expand': 'update_expand',
            'lazy': 'update_lazy',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();}

    render() {
        this.root.adoptedStyleSheets = [algol_image_sheet]; 

        this.root.innerHTML = `
            <img loading="eager">
            <div class="error">⚠️ Image not loaded!</div>  
            <slot></slot>
        `;
    }

    postConfig(){

        this.elems.img = this.root.querySelector('img');
        this.elems.error = this.root.querySelector('.error');
        this.elems.slot = this.root.querySelector('slot');
    }

    attachEvents(){
        this.elems.img.addEventListener('load', () => { 
            this.elems.error.style.display = 'none';
            this.elems.img.style.display = 'block';

            this.dispatchEvent(new CustomEvent('algol-image-load', { bubbles: true, composed: true }));
            this._atualizarValidacao(true);
        });

        this.elems.img.addEventListener('error', () => {
            this.elems.error.style.display = 'block';
            this.elems.img.style.display = 'none';

            this.dispatchEvent(new CustomEvent('algol-image-error', { bubbles: true, composed: true }));
            this._atualizarValidacao(false);
        });
    }

    update_src(val) {
        if (!this.elems.img) return; 

        this.elems.error.style.display = 'none';
        this.elems.img.style.display = 'block';
        this.elems.img.src = val;
    }
    update_alt(val) {
        if (!this.elems.img) return; 

        this.elems.img.alt = val;
    }
    update_width(val) {
        if (!this.elems.img) return; 

        this.elems.img.width = val;
    }
    update_height(val) {
        if (!this.elems.img) return; 

        this.elems.img.height = val;
    }
    update_expand(val) {
        if (!this.elems.img) return;
        if(this.hasAttribute('expand')) this.elems.img.style.width = '100%';
        else this.elems.img.style.removeProperty('width');
    }
    update_lazy(val) {
        if (!this.elems.img) return;
        this.elems.img.loading = this.hasAttribute('lazy')?'lazy':'eager';
    }

    _atualizarValidacao(carregouSucesso = true) {

        if (!this._internals) return;

        if (!carregouSucesso) {
            this._internals.setValidity(
                { badInput: true }, 

                "A imagem não pôde ser carregada.",
                this.elems.img
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

const algol_image_sheet = new CSSStyleSheet();
algol_image_sheet.replaceSync(`
    :host {
        display: block;
    }
    slot {display: none;}
    img{
        max-width: 100%;
        height: auto;
        display: block;     
        object-fit: cover;   
    }
    .error{
        display: none;
        text-align: center;
    }
`);

customElements.define('algol-image', Image); 

class Input extends BaseComponent {
    static get formAssociated() { return true; }

    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'placeholder': 'update_placeholder',
            'disabled': 'update_disabled',
            'required': 'update_required',
            'type': 'update_type',
            'minlength': 'update_minlength',
            'maxlength': 'update_maxlength',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();this._internals = this.attachInternals();}

    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; 

        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <input type="text">
            </div>
            <slot></slot>
        `;
    }

    postConfig(){

        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.input = this.root.querySelector('input');
        this.elems.slot = this.root.querySelector('slot');
    }

    attachEvents(){

        this.elems.input.addEventListener('input', (e) => {
            const novoValor = e.currentTarget.value; 

            if (this.value !== novoValor) {
                this.value = novoValor; 

            }

            this.dispatchEvent(new CustomEvent('algol-input', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    value: e.target.value
                }
            }));
            this._internals.setFormValue(novoValor); 

            this._atualizarValidacao();
        });
        this.elems.input.addEventListener('change',() => {
            this._atualizarValidacao(); 
        });
    }

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        const valorSeguro = val === null || val === undefined ? '' : val; 

        if (this.elems.input && this.elems.input.value !== valorSeguro){
            this.elems.input.value = valorSeguro;
            this._internals.setFormValue(valorSeguro); 

            this._atualizarValidacao(); 

        }
    }
    update_placeholder(val) {if (this.elems.input) this.elems.input.placeholder = val;    }
    update_required(val) {if (this.elems.input) this.elems.input.required = this.hasAttribute('required'); this._atualizarValidacao();}
    update_disabled(val) {if (this.elems.input) this.elems.input.disabled = this.hasAttribute('disabled');}
    update_type(val) {
        if (!this.elems.input) return;
        const tipo = ['text','email','password','url','search'].includes(val) ? val : 'text'; 

        this.elems.input.type = tipo;
        this._atualizarValidacao();
    }
    update_minlength(val) {
        if (this.elems.input) {
            if(val) this.elems.input.minLength = val;
            else this.elems.input.removeAttribute('minlength');
            this._atualizarValidacao();
        }
    }
    update_maxlength(val) {
        if (this.elems.input) {
            if(val) this.elems.input.maxLength = val;
            else this.elems.input.removeAttribute('maxlength');
            this._atualizarValidacao();
        }
    }
    update_pattern(val) {
        if (this.elems.input) {
            if (val) this.elems.input.pattern = val;
            else this.elems.input.removeAttribute('pattern');
            this._atualizarValidacao();
        }
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity; 

        if (!validadeInterna.valid) { 

            const flags = {
                valueMissing: validadeInterna.valueMissing,    

                typeMismatch: validadeInterna.typeMismatch,    

                tooShort: validadeInterna.tooShort,            

                tooLong: validadeInterna.tooLong,              

                patternMismatch: validadeInterna.patternMismatch, 

            };
            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, 

                this.elems.input 
            );
        } else this._internals.setValidity({}); 

    }
}

class InputNumber extends Input {

    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, 

            'min': 'update_min',
            'max': 'update_max',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();}

    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; 

        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <div class="input-container">
                    <input type="text" inputmode="numeric">
                    <div class="spinner">
                        <div class="btn btnup">▲</div>
                        <div class="btn btndown">▼</div>
                    </div>
                </div>
            </div>
            <slot></slot>

        `;
    }

    postConfig(){
        super.postConfig();
        this.elems.spinner = this.root.querySelector('.spinner');
        this.elems.btnup = this.root.querySelector('.btnup');
        this.elems.btndown = this.root.querySelector('.btndown');

        this.elems.btnup.setAttribute('role', 'button');
        this.elems.btndown.setAttribute('role', 'button');

        this._lastValidValue='';
    }

    attachEvents(){

        this.elems.input.addEventListener('input', (e) => {
            let valor = e.currentTarget.value;
            const isValido = /^-?\d*([.,]\d*)?$/.test(valor); 

            if (!isValido) {
                this.elems.input.value = this._lastValidValue; 

                this.value = this._lastValidValue; 

                return;
            }
            this._lastValidValue = valor; 

            this.value = valor;
        });
        this.elems.input.addEventListener('change',(e) => {
            let valorStr = this.value;

            if (['-', '-.', '.', '', ','].includes(valorStr)) {
                this._resetToEmpty();
                return;
            }

            let valorNum = Number(valorStr.replace(',', '.'));

            if (isNaN(valorNum)) {
                this._resetToEmpty();
                return;
            }

            valorNum = this._validaLimites(valorNum); 

            this.value = String(valorNum); 
            this.elems.input.value = this.value;
            this._lastValidValue = this.value;
            this.dispatchEvent(new CustomEvent('algol-input-number', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    value: this.value
                }
            }));

            this._internals.setFormValue(this.value);
            this._atualizarValidacao(); 
        });

        this.elems.btnup.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(1);
        });
        this.elems.btndown.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(-1);
        });

        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'ArrowUp') {
                e.preventDefault(); 

                this._incrementaValor(1);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault(); 

                this._incrementaValor(-1);
            }
        });

    }

    update_min(val) {}
    update_max(val) {}

    _validaLimites(valor){
        valor = (this.hasAttribute('max') && (valor > this.max))? Number(this.max) : valor;
        valor = (this.hasAttribute('min') && (valor < this.min))? Number(this.min) : valor;
        return valor;
    }

    _incrementaValor(inc){
        let atualStr = this.value ? this.value.replace(',', '.') : '0'; 

        let valorNum = Number(atualStr); 

        if(isNaN(valorNum)) valorNum = 0; 

        valorNum += inc;
        valorNum = this._validaLimites(valorNum); 

        valorNum = parseFloat(valorNum.toFixed(2)); 

        this.value = String(valorNum);
        this.elems.input.value = this.value;
        this._lastValidValue = this.value; 

        this._internals.setFormValue(this.value);
        this.dispatchEvent(new CustomEvent('algol-input-number', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    value: this.value
                }
        }));
        this._atualizarValidacao();
    }

    _resetToEmpty() {
        this.value = '';
        this.elems.input.value = '';
        this._lastValidValue = '';
        this._internals.setFormValue('');
        this._atualizarValidacao();
    }

}
class InputDate extends Input {

    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, 

            'min': 'update_min',
            'max': 'update_max',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();}

    postConfig(){
        super.postConfig();
        this.elems.input.type = 'date';
    }

    attachEvents(){
        super.attachEvents();
    }

    update_min(val) {
        if (!this.elems.input) return;
        if (!val) { 

            this.elems.input.removeAttribute('min');
            this._atualizarValidacao();
            return;
        }
        let valorFinal = val;

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const [dia, mes, ano] = val.split('/');
            valorFinal = `${ano}-${mes}-${dia}`; 

        }
        this.elems.input.min = valorFinal;
        this._atualizarValidacao();
    }

    update_max(val) {
        if (!this.elems.input) return;
        if (!val) { 

            this.elems.input.removeAttribute('max');
            this._atualizarValidacao();
            return;
        }
        let valorFinal = val;

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const [dia, mes, ano] = val.split('/');
            valorFinal = `${ano}-${mes}-${dia}`; 

        }
        this.elems.input.max = valorFinal;
        this._atualizarValidacao();
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {

            const flags = {
                valueMissing: validadeInterna.valueMissing,     

                rangeUnderflow: validadeInterna.rangeUnderflow, 

                rangeOverflow: validadeInterna.rangeOverflow,   

                badInput: validadeInterna.badInput,             

                stepMismatch: validadeInterna.stepMismatch      

            };

            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, 

                this.elems.input
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class InputTime extends Input {

    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, 

            'min': 'update_min',
            'max': 'update_max',
            'step': 'update_step' 

        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    postConfig(){
        super.postConfig(); 

        this.elems.input.type = 'time';
    }

    attachEvents(){
        super.attachEvents(); 

    }

    update_min(val) {
        if (!this.elems.input) return;

        if (val) this.elems.input.min = val;
        else this.elems.input.removeAttribute('min');
        this._atualizarValidacao();
    }

    update_max(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.max = val;
        else this.elems.input.removeAttribute('max');
        this._atualizarValidacao();
    }

    update_step(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.step = val;
        else this.elems.input.removeAttribute('step');
        this._atualizarValidacao();
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {
            const flags = {
                valueMissing: validadeInterna.valueMissing,     

                rangeUnderflow: validadeInterna.rangeUnderflow, 

                rangeOverflow: validadeInterna.rangeOverflow,   

                badInput: validadeInterna.badInput,             

                stepMismatch: validadeInterna.stepMismatch      

            };

            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, 
                this.elems.input
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class InputColor extends Input {

    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'disabled': 'update_disabled'
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; 

        this.root.innerHTML = `
            <div class="container" tabindex="-1">
                <label></label>
                <input type="color" style="display:none">
                <div class="color-border" tabindex="0">
                   <div class="color-box" tabindex="-1"></div>
                </div>
            </div>
            <slot></slot>
        `;
    }

    postConfig(){
        super.postConfig();

        this.elems.colorBorder = this.root.querySelector('.color-border');
        this.elems.colorBox = this.root.querySelector('.color-box');

        this.elems.label.removeAttribute('for');

        if (!this.value){
            this.value = '#f00'; 

            this.elems.input.value = '#f00';
        }
        this._atualizarVisual(this.value);
    }

    attachEvents(){
        super.attachEvents();
        this.elems.colorBox.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this.elems.input.click(); 

        });

        this.elems.input.addEventListener('input', (e) => {
            const novaCor = e.target.value;
            this._atualizarVisual(novaCor);
        });

        this.elems.input.addEventListener('change', (e) => {
            this._atualizarVisual(e.target.value);
        });
        this.addEventListener('keydown', (e) => {
            if (e.code === "Space" || e.code === "Enter") {
                e.preventDefault(); 

                this.elems.input.click(); 

            }
        });

    }

    update_value(val) {
        if (!this.elems.input) return;
        super.update_value(val);
        this._atualizarVisual(val);
    }
    update_disabled(val) {
        super.update_disabled(val);
        if (!this.elems.colorBorder) return;
        if (this.hasAttribute('disabled')) {
            this.elems.colorBorder.removeAttribute('tabindex');
        } else {
            this.elems.colorBorder.setAttribute('tabindex', '0');
        }
        this._atualizarVisual(val);
    }

    _atualizarVisual(cor) {
        if(this.elems.colorBox) {
            this.elems.colorBox.style.backgroundColor = cor;
        }
    }

    _atualizarValidacao() {

        if (this._internals) this._internals.setValidity({});
    }
}

class InputRange extends Input {
    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, 

            'min': 'update_min',
            'max': 'update_max',
            'step': 'update_step'
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    postConfig(){
        super.postConfig(); 

        this.elems.input.type = "range";
    }

    attachEvents(){
        super.attachEvents(); 

        this.elems.input.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('algol-input-range', { 
                bubbles: true, 
                composed: true,
                detail: { value: this.value }
            }));
        });
    }

    update_min(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.min = val;
        else this.elems.input.removeAttribute('min');
        this._atualizarValidacao();
    }

    update_max(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.max = val;
        else this.elems.input.removeAttribute('max');
        this._atualizarValidacao();
    }

    update_step(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.step = val;
        else this.elems.input.removeAttribute('step');
        this._atualizarValidacao();
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {
            const flags = {
                valueMissing: validadeInterna.valueMissing,    
                rangeUnderflow: validadeInterna.rangeUnderflow, 
                rangeOverflow: validadeInterna.rangeOverflow,   
                stepMismatch: validadeInterna.stepMismatch      
            };

            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, 
                this.elems.input
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class InputFile extends Input {

    static get PROP_MAP() {
        return {

            'label': 'update_label',         

            'required': 'update_required',   

            'disabled': 'update_disabled',   

            'placeholder': 'update_placeholder', 

            'value': 'update_value',

            'accept': 'update_accept',
            'multiple': 'update_multiple',
            'text': 'update_text'

        };
    }

    static get observedAttributes() { return Object.keys(this.PROP_MAP); }

    constructor() { super(); }

    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; 

        this.root.innerHTML = `
            <div class="container-file">
                <label></label>
                <div class="input-container">
                    <input type="text" class='input-file' readonly placeholder="Select file...">
                    <button class="btn">Search</button>
                    <input type="file" style="display: none;">
                </div>
            </div>
            <slot></slot>
        `;
    }

    postConfig() {
        super.postConfig(); 

        this.elems.textDisplay = this.root.querySelector('.input-file');
        this.elems.btnSearch = this.root.querySelector('.btn');
        this.elems.input = this.root.querySelector('input[type="file"]');
    }

    attachEvents(){
        this.elems.btnSearch.addEventListener('click', (e) => {
            if(this.hasAttribute('disabled')) return;
            this.elems.input.click();
        });
        this.elems.input.addEventListener('change', (e) => {
            const arquivos = this.elems.input.files; 

            if(arquivos.length > 0){ 

                let temArquivoInvalido = false;
                for (const file of arquivos) {

                    if (!this._validaArquivo(file)) {
                        temArquivoInvalido = true;
                        break;
                    }
                }
                if (temArquivoInvalido) {
                    this.elems.input.value = ''; 

                    this._atualizarTextoDisplay();

                    this._internals.setValidity(
                        { customError: true }, 
                        `Invalid file! Only: ${this.getAttribute('accept')}`,
                        this.elems.btnSearch
                    );
                    return;
                }
            }

            this._atualizarTextoDisplay(); 

            this._atualizarValidacao(); 

            if (this.elems.input.files.length > 0) { 

                const nomeCampo = this.getAttribute('name') || 'file';
                const formData = new FormData();

                for (const file of this.elems.input.files) {
                    formData.append(nomeCampo, file);
                }
                this._internals.setFormValue(formData); 

            } else {

                this._internals.setFormValue(null);
            }

            this.dispatchEvent(new CustomEvent('algol-change', {
                bubbles: true, composed: true,
                detail: { 
                    origin: this, 
                    files: this.elems.input.files 
                }
            }));
        });
    }

    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {

            const flags = {
                valueMissing: validadeInterna.valueMissing,
                customError: validadeInterna.customError 
            };

            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, 

                this.elems.btnSearch 

            );
        } else {
            this._internals.setValidity({});
        }
    }

    _atualizarTextoDisplay() {
        const files = this.elems.input.files;
        if (!files || files.length === 0) { 

            this.elems.textDisplay.value = '';
        } else if (files.length === 1) { 

            this.elems.textDisplay.value = files[0].name;
        } else { 

            const nomes = Array.from(files).map(f => f.name).join(' | ');
            this.elems.textDisplay.value = nomes;
        }
    }

    _validaArquivo(file){
        const accept = this.getAttribute('accept');
        if (!accept) return true; 

        const regras = accept.split(',').map(r => r.trim().toLowerCase());
        const nomeArquivo = file.name.toLowerCase();
        const tipoArquivo = file.type.toLowerCase();

        return regras.some(regra => {
            if (regra.startsWith('.')) {

                return nomeArquivo.endsWith(regra);
            } else if (regra.endsWith('/*')) {
                const baseMime = regra.replace('/*', '');
                return tipoArquivo.startsWith(baseMime);
            } else {
                return tipoArquivo === regra;
            }
        });
    }
    get files() {
        return this.elems.input ? this.elems.input.files : null;
    }

    update_placeholder(val) {
        if (this.elems.textDisplay) {
            this.elems.textDisplay.placeholder = val || "Select file...";
        }
    }

    update_disabled(val) {

        const isDisabled = this.hasAttribute('disabled');
        if (this.elems.input) this.elems.input.disabled = isDisabled;
        if (this.elems.btnSearch) {
            this.elems  .btnSearch.disabled = isDisabled;
        }
        if (this.elems.textDisplay) {
            this.elems.textDisplay.disabled = isDisabled; 
        }
    }

    update_value(val) {
        if (!val && this.elems.input) {
            this.elems.input.value = '';
            this.elems.textDisplay.value = '';
        }
    }
    update_accept(val) {
        if (this.elems.input) {
            if (val) this.elems.input.accept = val;
            else this.elems.input.removeAttribute('accept');
        }
    }

    update_multiple(val) {
        if (this.elems.input) {
            this.elems.input.multiple = this.hasAttribute('multiple');
        }
    }

    update_text(val) {
        if (this.elems.btnSearch) {
            this.elems.btnSearch.textContent = val || "Search";
        }
    }
}

const algol_input_sheet = new CSSStyleSheet();
algol_input_sheet.replaceSync(`
    :host {
        display: block; 
    }
    slot{display: none;}
    .container {
        display: flex;
        flex-direction: column;
        gap: calc(0.3vw * var(--scale-factor));
        margin-bottom: calc(1.0vw * var(--scale-factor));
        width: 100%;

    }
    label {
        color: var(--text-color-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    :host([disabled]) label{
        color: var(--text-color-label-disabled);
    }
    input::-webkit-calendar-picker-indicator { 
        color-scheme: var(--theme-color-scheme);
    }
    input {
        color-scheme: var(--theme-color-scheme);
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        padding: calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));
        background: var(--bg-color-inputs);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));

        font-family: 'Algol Font';
        font-weight: 100;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));
    }
    :host([disabled]) input{
        background-color: var(--bg-color-inputs-disabled) !important;
        color: var(--text-color-disabled) !important;
        cursor: not-allowed;
    }
    :host(:focus-within) input {
        border-color: var(--border-color-focus); 
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) 
    }
    input::placeholder {
        color: var(--text-color-placeholder) !important;
    }
    :host([disabled]) input::placeholder {
        color: var(--text-color-placeholder-disabled) !important;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {-webkit-appearance: none;margin: 0;}
    input[type="number"] {-moz-appearance: textfield;}

    .input-container{
        display: flex;
        flex-direction: row;
    }
    .spinner{
        display: flex;
        flex-direction: column;
    }
    .btnup, .btndown{
        width: calc(2.0vw * var(--scale-factor));
        height: 100%;
        background-color: var(--bg-color-btn-spinner);
        color: var(--text-color-btn-spinner);
        text-align: center;
        border: none;
        cursor: pointer;
        font-size: calc(1.0vw * var(--scale-factor));
        padding: 0;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
    }
    .btnup{
        border-bottom: solid calc(0.1vw * var(--scale-factor)) var(--border-color-btn-spinner);
    }
    .btndown{
        border-top: solid calc(0.1vw * var(--scale-factor)) var(--border-color-btn-spinner);
    }
    .btnup:hover, .btndown:hover{
        background-color: var(--bg-color-btn-spinner-hover);
    }
    .btnup:active, .btndown:active{
        transform: translateY(calc(0.09vw * var(--scale-factor))); 
        background-color: var(--bg-color-btn-spinner-hover);
    }

    :host([disabled]) .btnup,:host([disabled]) .btndown{
        background-color: var(--bg-color-btn-spinner-disabled) !important;
        color: var(--text-color-btn-spinner-disabled) !important;
        cursor: not-allowed;
    }
    :host([disabled]) .btnup{
        border-bottom-color:var(--border-color-btn-spinner-disabled) !important;
    }
    :host([disabled]) .btndown{
        border-top-color:var(--border-color-btn-spinner-disabled) !important;
    }

    .color-border{
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(5vw * var(--scale-factor));
        height: calc(3vw * var(--scale-factor));
        background: var(--bg-color-inputs);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
    }
    :host(:focus-within) .color-border,
    .color-border:focus {
        border-color: var(--border-color-focus);
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow);
    }
    :host([disabled]) .color-border,
    :host([disabled]) .color-border:focus {
        border-color: #0000 !important;
        box-shadow: none;
    }
    :host([disabled]) .color-border{
        background: var(--bg-color-inputs-disabled) !important;
        cursor: not-allowed;
    }

    .color-box{
        cursor: pointer;
        width: calc(4vw * var(--scale-factor));
        height: calc(2vw * var(--scale-factor));
    }
    :host([disabled]) .color-box{
        background: var(--bg-color-inputs-disabled) !important;
        cursor: not-allowed;
        filter: brightness(0.8); 
    }
    :host(:not([disabled])) .color-box:hover, :host(:not([disabled])) .color-border:hover{
        filter: brightness(0.9); 
    }
    :host(:not([disabled])) .color-box:active{
        transform: translateY(calc(0.09vw * var(--scale-factor))); 
        filter: brightness(0.8);
    }

    input[type="range"] {        
        background: transparent; 
        padding: 0;              
        width: 100%;
        border:none;
        min-height: calc(2.4vw * var(--scale-factor)); 
        cursor: pointer;
    }
    input[type="range"]:focus {
        outline: none;
        box-shadow: none;
    }

    input[type="range"]::-moz-range-track { 
        width: 100%;
        height: calc(0.4vw * var(--scale-factor));
        background: var(--bg-color-inputs);
        border-radius: calc(0.2vw * var(--scale-factor));
        cursor: pointer;
    }
    :host([disabled]) input[type="range"]::-moz-range-track { 
        background: var(--bg-color-inputs-disabled) !important;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        width: 100%;
        height: calc(0.4vw * var(--scale-factor));
        background: var(--bg-color-inputs);
        border-radius: calc(0.2vw * var(--scale-factor));
        cursor: pointer;
    }
    :host([disabled]) input[type="range"]::-webkit-slider-runnable-track {
        cursor: not-allowed;
        background: var(--bg-color-inputs-disabled) !important;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; 
        height: calc(1.2vw * var(--scale-factor));
        width: calc(1.2vw * var(--scale-factor));
        border-radius: 50%;
        background: var(--text-color); 
        border: none;
        margin-top: calc(-0.4vw * var(--scale-factor)); 
    }

    input[type="range"]::-moz-range-thumb { 
        height: calc(1.2vw * var(--scale-factor));
        width: calc(1.2vw * var(--scale-factor));
        border-radius: 50%;
        background: var(--text-color);
        border: none;
    }
    input[type="range"]::-webkit-slider-thumb:hover { 
        transform: scale(1.2); 
        background: var(--border-color-focus);
    }
    input[type="range"]::-moz-range-thumb:hover { 
        transform: scale(1.2);
        background: var(--border-color-focus);
    }
    input[type="range"]:focus::-moz-range-thumb {
        box-shadow: 0 0 0 calc(0.3vw * var(--scale-factor)) var(--border-color-focus-glow);
    }
    input[type="range"]:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 calc(0.3vw * var(--scale-factor)) var(--border-color-focus-glow);
    }
    :host([disabled]) input[type="range"]{
        background: #0000 !important; 
        cursor: not-allowed;
    }
    :host([disabled]) input[type="range"]::-moz-range-thumb {
        background: var(--text-color-disabled) !important;
    }
    :host([disabled]) input[type="range"]::-webkit-slider-thumb {
        background: var(--text-color-disabled) !important;
        cursor: not-allowed;
    }

    :host .container-file .btn{
        appearance: none;
        outline: none;
        border: none;
        user-select: none; 

        cursor: pointer;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: calc(0.6vw * var(--scale-factor)) calc(1.2vw * var(--scale-factor));
        min-height: calc(2.4vw * var(--scale-factor));
        border-radius: 0 calc(var(--border-radius-components) * var(--scale-factor)) calc(var(--border-radius-components) * var(--scale-factor)) 0;
        background-color: var(--bg-color-button);
        color: var(--text-color);
        font-family: 'Algol Font';
        font-weight: 200;
        font-size: calc(var(--font-size-btn)* var(--scale-factor));
    }

    :host .container-file input[type="text"]{
        border-radius: calc(var(--border-radius-components) * var(--scale-factor)) 0 0 calc(var(--border-radius-components) * var(--scale-factor));
    }

    :host .container-file .btn:hover:not(:disabled) {
        filter: brightness(1.1); 
    }
    :host .container-file .btn:active:not(:disabled) {
        transform: translateY(calc(0.09vw * var(--scale-factor))); 
        filter: brightness(0.9);
    }
    :host([disabled]) .container-file .btn {
        background-color: var(--bg-color-inputs-disabled);
        color: var(--text-color-disabled);
        cursor: not-allowed;
        opacity: 0.7;
    }

`);

customElements.define('algol-input', Input); 

customElements.define('algol-input-number', InputNumber); 

customElements.define('algol-input-date', InputDate);
customElements.define('algol-input-time', InputTime);
customElements.define('algol-input-color', InputColor); 
customElements.define('algol-input-range', InputRange); 
customElements.define('algol-input-file', InputFile);

class PowerMenu extends BaseComponent {
    static useShadow = false; 

    static get PROP_MAP() {
        return {
            'logo': 'update_logo',
            'logoalt': 'update_logoalt',
            'logolink': 'update_logolink',
        };
    }
    static get observedAttributes() {return Object.keys(PowerMenu.PROP_MAP);} 

    constructor() {super();}

    static template = document.createElement('template');
    static {
        this.template.innerHTML = `
            <header class="menu">
                <div class="menu-toggle" title="Menu mobile">
                    <span></span><span></span><span></span>
                </div>
                <div class="menu-overlay"></div>
                <a class="logo-link"><img class="logo"/></a>
                <nav class="menu-btns">
                    <ul>
                    </ul>
                </nav>
            </header>
        `;
    }

    render() {
        this.elems.savedChildren = Array.from(this.children); 

        this.textContent = ''; 

        const content = PowerMenu.template.content.cloneNode(true);
        this.root.appendChild(content);
    }

    postConfig(){

        this.elems.menu = this.root.querySelector('.menu');
        this.elems.logoLink = this.root.querySelector('.logo-link');
        this.elems.logo = this.root.querySelector('.logo');
        this.elems.menuToggle = this.root.querySelector('.menu-toggle');
        this.elems.menuBtns = this.root.querySelector('.menu-btns');
        this.elems.ul = this.root.querySelector('.menu-btns ul');
        this.elems.menuOverlay = this.root.querySelector('.menu-overlay');

        this._sincronizarMenuOptions(); 

    }

    attachEvents(){
        this.elems.menuToggle.addEventListener('click', () =>{
            this.elems.menuBtns.classList.toggle('show');
            this.elems.menuOverlay.classList.toggle('show');
        });
        this.elems.menuOverlay.addEventListener('click', () =>{
            this.elems.menuBtns.classList.toggle('show');
            this.elems.menuOverlay.classList.toggle('show');
        });
    }

    update_logo(val) {
        if (!this.elems.logo) return; 

        this.elems.logo.src = val;
    }
    update_logoalt(val) {
        if (!this.elems.logo) return; 

        this.elems.logo.alt = val;
    }
    update_logolink(val) {
        if (!this.elems.logo) return; 

        this.elems.logoLink.href = val;
    }

    _sincronizarMenuOptions() {
        const ul = this.elems.ul;
        ul.innerHTML = ''; 

        let childCount = 0;

        for(const li of this.elems.savedChildren){ 
            if (li.tagName.toLowerCase() === 'li') { 

                const node = li.firstElementChild; 

                if (!node) continue; 

                const div = document.createElement('div'); 

                if(node.tagName.toLowerCase() === 'a' || node.tagName.toLowerCase() === 'div'){
                    div.classList.add('li-link-wrapper');
                }else { 

                    div.classList.add('li-element-wrapper');
                }

                div.appendChild(li); 

                ul.appendChild(div); 

                childCount++; 

            }
        };
        ul.style.gridTemplateColumns = `repeat(${childCount}, auto)`;
    }

    static injectStyles() {
        const css = `
            algol-power-menu {
                display: block; 

                line-height: normal;
            }

            algol-power-menu .menu{
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: max-content;
                background-color: var(--bg-color-menu);
                z-index: 99;
                padding-left: calc(1.5vw * var(--scale-factor));
                padding-right: calc(0.6vw * var(--scale-factor));
                padding-top: calc(0.4vw * var(--scale-factor));
                padding-bottom: calc(0.4vw * var(--scale-factor));
            }

            algol-power-menu .menu .menu-toggle {
                display: none;
                cursor: pointer;
                z-index: 98;

            }
            algol-power-menu .menu .menu-toggle span {
                display: block;
                height: calc(0.4vw * var(--scale-factor));
                width: calc(2.5vw * var(--scale-factor));
                margin: calc(0.5vw * var(--scale-factor)) 0;
                border-radius: calc(0.5vw * var(--scale-factor));
                background: var(--text-color-menu);
            }

            algol-power-menu .menu .menu-overlay{
                    display: none;
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 96;
                    background-color: black;
            }

            algol-power-menu[logolink] .menu .logo{
                cursor: pointer;
                text-decoration: none;
            }

            algol-power-menu .menu .logo-link,
            algol-power-menu .menu .menu-btns ul .li-link-wrapper a{
                color: var(--text-color);
                text-decoration: none;
                cursor: unset;
            }

            algol-power-menu .menu .logo-link .logo{width: calc(3vw * var(--scale-factor));}

            algol-power-menu .menu .menu-btns,
            algol-power-menu .menu .menu-btns * {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }   

            algol-power-menu .menu .menu-btns{
                box-sizing: border-box;
                height: 100%;
                z-index: 97;
                padding-bottom: 0;
            }

            algol-power-menu .menu .menu-btns ul{
                display: grid;
                gap: calc(0.5vw * var(--scale-factor));
                align-items: center;
                justify-items: center;
                height: 100%;
                margin: 0;
                padding: 0;
                list-style: none;
            }

            algol-power-menu .menu .menu-btns ul .li-link-wrapper,
            algol-power-menu .menu .menu-btns ul .li-element-wrapper{
                min-height: calc(3.5vw * var(--scale-factor));
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 0 calc(1vw * var(--scale-factor));
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper{
                cursor: pointer;
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper:hover{
                background-color: var(--text-color-menu-focus);
            }
            algol-power-menu .menu .menu-btns ul .li-link-wrapper:active{
                background-color: var(--text-color-menu-active);
            }

            @media (max-width: 600px) {
                algol-power-menu .menu{
                    padding: calc(0.5vw * var(--scale-factor)) calc(1vw * var(--scale-factor));
                    position: fixed;
                    width: 100vw;
                    top: 0;
                    left: 0;
                }

                algol-power-menu .menu .menu-toggle {
                    display: block;
                }

                algol-power-menu .menu .menu-overlay{
                    display: none;
                }
                algol-power-menu .menu .menu-overlay.show{
                    display: block;
                    opacity: 0.8;
                }

                algol-power-menu .menu .logo-link .logo{width: calc(3vw * var(--scale-factor));}

                algol-power-menu .menu .menu-btns{
                    visibility: hidden;
                    position: absolute;
                    width: 100vw;
                    top: 0;
                    left: 0;
                    height: max-content;
                    padding-top: calc(5vw * var(--scale-factor));
                    padding-bottom: calc(1vw * var(--scale-factor));
                    transform: translateY(-100%);
                    transition: transform 0.3s ease, visibility 0.3s ease;
                    background-color: var(--bg-color-menu);
                }
                algol-power-menu .menu .menu-btns.show {
                    visibility: visible;
                    transform: translateY(0);
                }

                algol-power-menu .menu .menu-btns ul{
                    display: flex;
                    flex-direction: column;
                    gap: calc(1vw * var(--scale-factor));
                }

                algol-power-menu .menu .menu-btns ul .li-link-wrapper{
                    min-height: calc(3.5vw * var(--scale-factor));
                }
            }
        `;
        BaseLayout._injectStyleOnHead('algol-power-menu-style', css);
    }
}

customElements.define('algol-power-menu', PowerMenu); 

PowerMenu.injectStyles(); 

class Select extends BaseComponent {
    static get formAssociated() { return true; }

    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'placeholder': 'update_placeholder',
            'disabled': 'update_disabled',
            'required': 'update_required'
        };
    }
    static get observedAttributes() {return Object.keys(Select.PROP_MAP);} 

    constructor() {super();this._internals = this.attachInternals();}

    render() {
        this.root.adoptedStyleSheets = [algol_select_sheet]; 

        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <div class="select-wrapper">
                    <select></select>
                </div>
            </div>
            <slot></slot>
        `;
    }

    postConfig(){

        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.select = this.root.querySelector('select');
        this.elems.slot = this.root.querySelector('slot');
    }

    attachEvents(){

        this.elems.slot.addEventListener('slotchange', () => {
            this._sincronizarOptions();
        });

        this.elems.select.addEventListener('change', (e)=>{
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} 

            const oldValue = this.value 

            this.value =e.target.value; 

            this._internals.setFormValue(this.value); 

            this._atualizarValidacao(); 

            this.dispatchEvent(new CustomEvent('algol-select-value', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    oldValue,
                    newValue: e.target.value
                }
            }));
        });
    }

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        if (this.elems.select && this.elems.select.value !== val){
            this.elems.select.value = val;
            this._internals.setFormValue(val); 

            this._atualizarValidacao(); 

        }
    }
    update_placeholder(val) {if (this.elems.select) this._sincronizarOptions();}
    update_required(val) {if (this.elems.select) this.elems.select.required = this.hasAttribute('required'); this._atualizarValidacao();}
    update_disabled(val) {if (this.elems.select) this.elems.select.disabled = this.hasAttribute('disabled');}

    _sincronizarOptions() {
        const select = this.elems.select;
        const options = this.elems.slot.assignedElements(); 

        select.innerHTML = ''; 

        const placeholderTxt = this.placeholder;
        const opt = document.createElement('option');
        opt.text = placeholderTxt? placeholderTxt : 'Select...';
        opt.value = "";
        opt.disabled = true;
        opt.selected = true;
        select.appendChild(opt);

        for(const option of options){   
            if (option.tagName.toLowerCase() === 'option') { 

                select.appendChild(option.cloneNode(true));
            }
        };

        if (this.value) select.value = this.value;
    }

    _atualizarValidacao() {
        if (!this.elems.select) return;

        const validadeInterna = this.elems.select.validity; 

        const mensagem = this.elems.select.validationMessage || "Select option!.";
        if (!validadeInterna.valid) { 

            this._internals.setValidity( 

                { 
                    valueMissing: validadeInterna.valueMissing,
                    valid: false 
                }, 
                mensagem, 
                this.elems.select, 

            );
        } else this._internals.setValidity({}); 

    }
}

const algol_select_sheet = new CSSStyleSheet();
algol_select_sheet.replaceSync(`
    :host {
        display: block; 
    }
    slot{display: none;}
    .container {
        display: flex;
        flex-direction: column;
        gap: calc(0.3vw * var(--scale-factor));
        margin-bottom: calc(1.0vw * var(--scale-factor));
        width: 100%;
    }
    label {
        color: var(--text-color-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    :host([disabled]) label{
        color: var(--text-color-label-disabled);
    }

    .select-wrapper {
        position: relative; 
        width: 100%;
        display: flex;
        align-items: center;
    }

    .select-wrapper::after {
        content: '▼';
        position: absolute;
        right: calc(1.0vw * var(--scale-factor)); 

        top: 50%;
        transform: translateY(-50%);

        font-size: calc(0.8vw * var(--scale-factor)); 
        color: var(--text-color);

        pointer-events: none; 
    }
    select {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        background: var(--bg-color-inputs);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));

        padding: calc(0.8vw * var(--scale-factor)) 0 calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));

        padding-right: calc(2.5vw * var(--scale-factor));

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        width: 100%;
        font-family: 'Algol Font';
        cursor: inherit;
        font-weight: 100;
        font-style: normal;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));
    }

    :host([disabled]) select{
        background-color: var(--bg-color-inputs-disabled) !important;
        color: var(--text-color-disabled) !important;
        cursor: not-allowed;
    }
    :host(:focus-within) select {
        border-color: var(--border-color-focus); 
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) 
    }
`);

customElements.define('algol-select', Select); 

class Spacer extends BaseComponent {

    static get PROP_MAP() {
        return {
            'value': 'update_value',
            'valuebreak': 'update_valuebreak',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();}

    render() {
        this.root.adoptedStyleSheets = [algol_spacer_sheet]; 

        this.root.innerHTML = `<slot></slot>`;
    }

    postConfig(){}

    attachEvents(){}

    update_value(val) {
        this.style.setProperty('--spacer-value', this._toVw(val));
    }
    update_valuebreak(val) {
        this.style.setProperty('--spacer-valuebreak', this._toVw(val));
    }

    _toVw(val) {
        const num = parseFloat(val); 

        if (!isNaN(num)) {return `calc(${num}vw * var(--scale-factor)`;} 

        return '0vw'; 

    }
}

const algol_spacer_sheet = new CSSStyleSheet();
algol_spacer_sheet.replaceSync(`
    :host {
        display: block;
        width: 100%;
    }
    :host([value]){ height: var(--spacer-value);}

    slot {display: none;}
    @media (max-width: ${MOBILE_BREAKPOINT}) {
        :host([valuebreak]) {height: var(--spacer-valuebreak);}
    }
`);

customElements.define('algol-spacer', Spacer); 

class TextArea extends BaseComponent {
    static get formAssociated() { return true; }

    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'placeholder': 'update_placeholder',
            'fixed': 'update_fixed',
            'lines': 'update_lines',
            'maxlength': 'update_maxlength',
            'disabled': 'update_disabled',
            'required': 'update_required',
            'readonly': 'update_readonly',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} 

    constructor() {super();this._internals = this.attachInternals();}

    render() {
        this.root.adoptedStyleSheets = [algol_textarea_sheet]; 

        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <textarea></textarea>
            </div>
            <slot></slot>
        `;
    }

    postConfig(){

        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.textarea = this.root.querySelector('textarea');
        this.elems.slot = this.root.querySelector('slot');
    }

    attachEvents(){

        this.elems.slot.addEventListener('slotchange', () => {

            if (this.getAttribute('value') === null && this.elems.slot.assignedNodes().length > 0) {
                const nodes = this.elems.slot.assignedNodes(); 

                const textoInicial = nodes.map(n => n.textContent).join('');
                if (textoInicial.trim() !== '') {
                    this.value = textoInicial;
                }
            }
        });

        this.elems.textarea.addEventListener('input', (e) => {
            const novoValor = e.target.value; 

            if (this.value !== novoValor) {
                this.value = novoValor; 

            }

            this.dispatchEvent(new CustomEvent('algol-textarea-input', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    value: e.target.value
                }
            }));
            this._internals.setFormValue(novoValor); 

            this._atualizarValidacao();
        });
        this.elems.textarea.addEventListener('change',(e) => {
            this._atualizarValidacao(); 
        });
    }

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        const valorSeguro = val === null || val === undefined ? '' : val; 

        if (this.elems.textarea && this.elems.textarea.value !== valorSeguro){
            this.elems.textarea.value = valorSeguro;
            this._internals.setFormValue(valorSeguro); 

            this._atualizarValidacao(); 

        }
    }
    update_placeholder(val) {if (this.elems.textarea) this.elems.textarea.placeholder = val;    }
    update_required(val) {if (this.elems.textarea) this.elems.textarea.required = this.hasAttribute('required'); this._atualizarValidacao();}
    update_readonly(val) {if (this.elems.textarea)this.elems.textarea.readOnly = this.hasAttribute('readonly');}
    update_disabled(val) {if (this.elems.textarea) this.elems.textarea.disabled = this.hasAttribute('disabled');}
    update_fixed(val) {if (this.elems.textarea) this.elems.textarea.style.resize = this.hasAttribute('fixed') ? 'none' : 'vertical';}
    update_lines(val) {
        if (this.elems.textarea) {
            if (val) this.elems.textarea.rows = val;
            else this.elems.textarea.removeAttribute('rows');
        }
    }
    update_maxlength(val) {
        if (this.elems.textarea) {
            if (val) this.elems.textarea.maxLength = val;
            else this.elems.textarea.removeAttribute('maxlength');
        }
    }

    _atualizarValidacao() {
        if (!this.elems.textarea) return;

        const validadeInterna = this.elems.textarea.validity; 

        if (!validadeInterna.valid) { 

            this._internals.setValidity( 

                { 
                    valueMissing: validadeInterna.valueMissing,
                    valid: false,
                    tooLong: validadeInterna.tooLong,
                }, 
                this.elems.textarea.validationMessage, 
                this.elems.textarea, 

            );
        } else this._internals.setValidity({}); 

    }
}

const algol_textarea_sheet = new CSSStyleSheet();
algol_textarea_sheet.replaceSync(`
    :host {
        display: block; 
    }
    slot{display: none;}
    .container {
        display: flex;
        flex-direction: column;
        gap: calc(0.3vw * var(--scale-factor));
        margin-bottom: calc(1.0vw * var(--scale-factor));
        width: 100%;
    }
    label {
        color: var(--text-color-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    :host([disabled]) label {
        color: var(--text-color-label-disabled);
    }
    textarea {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        background: var(--bg-color-inputs);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        padding: calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));

        font-family: 'Algol Font';
        font-weight: 100;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));

        resize: vertical; 
        min-height: calc(3.5vw * var(--scale-factor)); 
    }

    :host([disabled]) textarea{
        background-color: var(--bg-color-inputs-disabled) !important;
        color: var(--text-color-disabled) !important;
        cursor: not-allowed !important;
        user-select: none !important;
    }
    :host(:focus-within) textarea {
        border-color: var(--border-color-focus); 
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) 
    }
`);

customElements.define('algol-textarea', TextArea); 


class FlexItem extends BaseLayout {

    static get ATTR_MAP() {
        return {
            'colspan':      { var: '--flex-item-colspan',       prefix: 'span ' },
            'colspanbreak': { var: '--flex-item-colspan-break', prefix: 'span ' },
            'rowspan':      { var: '--flex-item-rowspan',       prefix: 'span ' },
            'rowspanbreak': { var: '--flex-item-rowspan-break', prefix: 'span ' },
            'imgattach': '--flex-item-imgattach', 

            'imgrepeat': '--flex-item-imgrepeat', 

            'imgpos': '--flex-item-imgpos', 

            'imgsize': '--flex-item-imgsize', 

        };
    }
    static get PROP_MAP() {
        return {
            'distrib': 'update_distrib', 

            'padding': 'update_padding',
            'paddingbreak': 'update_paddingbreak',
            'img': 'update_img',
        };
    }
    static get observedAttributes() {return [...Object.keys(this.PROP_MAP), ...Object.keys(this.ATTR_MAP)];}
    constructor() {super();}

    postConfig(){
        this.style.display = 'flex';
        this.style.flexWrap = 'wrap';
        this.style.gap = '0';
    }

    update_distrib(val) {
        val = val?.trim().toLowerCase();
        if(!['between', 'around', 'evenly', 'start', 'center', 'end'].includes(val))return; 

        this.style.justifyContent = ['between', 'around', 'evenly'].includes(val)? `space-${val}`: val;
    }
    update_img(val) {
        this.style.setProperty('--flex-item-img', `url("${val}")`);
    }
    update_padding(val) {
        this.style.setProperty('--flex-item-padding', this._adjustPadding(val));
    }
    update_paddingbreak(val) {
        this.style.setProperty('--flex-item-paddingbreak', this._adjustPadding(val));
    }

    _adjustPadding(val) {
        if (!val) return '0vw'; 

        const partes = val.toString().trim().split(/\s+/);

        const valoresConvertidos = partes.map(parte => {
            const num = parseFloat(parte); 

            return !isNaN(num) ? `${num}vw` : '0vw';
        });

        return valoresConvertidos.join(' ');
    }

    static injectStyles() {
        const css = `
            algol-flex-item[colspan]{grid-column-end: var(--flex-item-colspan);}
            algol-flex-item[rowspan]{grid-row-end: var(--flex-item-rowspan);}
            algol-flex-item[img]{background-image: var(--flex-item-img); width: 100%; height: 100%;}
            algol-flex-item[imgattach]{background-attachment: var(--flex-item-imgattach);}
            algol-flex-item[imgrepeat]{background-repeat: var(--flex-item-imgrepeat);}
            algol-flex-item[imgpos]{background-position: var(--flex-item-imgpos);}
            algol-flex-item[imgsize]{background-size: var(--flex-item-imgsize);}
            algol-flex-item[padding]{padding: var(--flex-item-padding);}
            algol-flex-item[distrib]{width: 100%}

            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-flex-item[colspanbreak] {grid-column-end: var(--flex-item-colspan-break) !important;}
                algol-flex-item[rowspanbreak] {grid-row-end: var(--flex-item-rowspan-break) !important;}
                algol-flex-item[paddingbreak]{padding: var(--flex-item-paddingbreak);}

            }
        `;

        BaseLayout._injectStyleOnHead('algol-flex-item-style', css); 

    }
}

customElements.define('algol-flex-item', FlexItem); 

FlexItem.injectStyles(); 

class GridItem extends BaseLayout {

    static get ATTR_MAP() {
        return {
            'colspan':      { var: '--grid-item-colspan',       prefix: 'span ' },
            'colspanbreak': { var: '--grid-item-colspan-break', prefix: 'span ' },
            'rowspan':      { var: '--grid-item-rowspan',       prefix: 'span ' },
            'rowspanbreak': { var: '--grid-item-rowspan-break', prefix: 'span ' },
            'posh':      '--grid-item-posh',
            'poshbreak': '--grid-item-poshbreak',
            'posv':      '--grid-item-posv',
            'posvbreak': '--grid-item-posvbreak',
            'imgattach': '--grid-item-imgattach', 

            'imgrepeat': '--grid-item-imgrepeat', 

            'imgpos': '--grid-item-imgpos', 

            'imgsize': '--grid-item-imgsize', 

        };
    }
    static get PROP_MAP() {
        return {
            'padding': 'update_padding',
            'paddingbreak': 'update_paddingbreak',
            'img': 'update_img',
        };
    }
    static get observedAttributes() {return [...Object.keys(this.PROP_MAP), ...Object.keys(this.ATTR_MAP)];}
    constructor() {super();}

    postConfig(){
        this.style.display = 'grid'; 
        this.style.gap = '0';
    }

    update_img(val) {
        this.style.setProperty('--grid-item-img', `url("${val}")`);
    }
    update_padding(val) {
        this.style.setProperty('--grid-item-padding', this._adjustPadding(val));
    }
    update_paddingbreak(val) {
        this.style.setProperty('--grid-item-paddingbreak', this._adjustPadding(val));
    }

    _adjustPadding(val) {
        if (!val) return '0vw'; 

        const partes = val.toString().trim().split(/\s+/);

        const valoresConvertidos = partes.map(parte => {
            const num = parseFloat(parte); 

            return !isNaN(num) ? `${num}vw` : '0vw';
        });

        return valoresConvertidos.join(' ');
    }

    static injectStyles() {
        const css = `
            algol-grid-item[colspan]{grid-column-end: var(--grid-item-colspan);}
            algol-grid-item[rowspan]{grid-row-end: var(--grid-item-rowspan);}
            algol-grid-item[posh]{justify-self: var(--grid-item-posh);}
            algol-grid-item[posv]{align-self: var(--grid-item-posv);}
            algol-grid-item[img]{background-image: var(--grid-item-img); width: 100%; height: 100%;}
            algol-grid-item[imgattach]{background-attachment: var(--grid-item-imgattach);}
            algol-grid-item[imgrepeat]{background-repeat: var(--grid-item-imgrepeat);}
            algol-grid-item[imgpos]{background-position: var(--grid-item-imgpos);}
            algol-grid-item[imgsize]{background-size: var(--grid-item-imgsize);}
            algol-grid-item[padding]{padding: var(--grid-item-padding);}

            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-grid-item[colspanbreak] {grid-column-end: var(--grid-item-colspan-break) !important;}
                algol-grid-item[rowspanbreak] {grid-row-end: var(--grid-item-rowspan-break) !important;}
                algol-grid-item[poshbreak] {justify-self: var(--grid-item-poshbreak) !important;}
                algol-grid-item[posvbreak] {align-self: var(--grid-item-posvbreak) !important;}
                algol-grid-item[paddingbreak]{padding: var(--grid-item-paddingbreak);}
            }
        `;

        BaseLayout._injectStyleOnHead('algol-grid-item-style', css); 

    }
}

customElements.define('algol-grid-item', GridItem); 

GridItem.injectStyles(); 

class GridLayout extends BaseLayout {

    static get ATTR_MAP() {
        return {
            'cols':      '--grid-layout-cols',
            'colsbreak': '--grid-layout-cols-break',
            'gap':       '--grid-layout-gap',
            'gapbreak':  '--grid-layout-gap-break',
            'posh':      '--grid-layout-posh',
            'poshbreak': '--grid-layout-poshbreak',
            'posv':      '--grid-layout-posv',
            'posvbreak': '--grid-layout-posvbreak'
        };
    }
    static get observedAttributes() {return Object.keys(this.ATTR_MAP);} 

    constructor() {super();}

    postConfig(){
        this.style.display = 'grid';

        if (!this.style.getPropertyValue('--grid-layout-posh')) this.style.setProperty('--grid-layout-posh', 'center');
        if (!this.style.getPropertyValue('--grid-layout-posv')) this.style.setProperty('--grid-layout-posv', 'center');
    }

    static injectStyles() {
        const css = `
            algol-grid-layout{
                grid-template-columns: var(--grid-layout-cols, none);
                gap: var(--grid-layout-gap, none);
                justify-items: var(--grid-layout-posh, none);
                align-items: var(--grid-layout-posv, none);
            }

            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-grid-layout[colsbreak] {grid-template-columns: var(--grid-layout-cols-break) !important;}
                algol-grid-layout[gapbreak] {gap: var(--grid-layout-gap-break) !important;}
                algol-grid-layout[poshbreak] {justify-items: var(--grid-layout-poshbreak) !important;}
                algol-grid-layout[posvbreak] {align-items: var(--grid-layout-posvbreak) !important;}
            }
        `;
        BaseLayout._injectStyleOnHead('algol-grid-layout-style', css);
    }
}

customElements.define('algol-grid-layout', GridLayout); 

GridLayout.injectStyles(); 

