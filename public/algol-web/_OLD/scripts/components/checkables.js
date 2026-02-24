class BaseCheckable extends BaseComponent {
    static get formAssociated() { return true; }
    // Mapeamento comum a todos os inputs de seleção
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
        this.elems.labelBox = labels[0]; // O primeiro é sempre a caixa visual
        this.elems.labelText = labels[1]; // O segundo é o texto (se existir)
        // Remove associação 'for' automática para evitar bugs em ShadowDOM,
        // pois o input está dentro do mesmo escopo.
        if(this.elems.labelBox) this.elems.labelBox.removeAttribute('for');
        if(this.elems.labelText) this.elems.labelText.removeAttribute('for');
    }

    attachEvents() {
        // 1. Escuta a mudança no input nativo
        this.elems.input.addEventListener('change', (e) => {
            // Sincroniza o atributo do componente com o estado do input
            // IMPORTANTE: Isso chama o setter 'checked' da classe, ou o update_checked
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

        // 2. Torna o componente inteiro clicável (melhora UX)
        this.elems.labelText.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            
            // Se o clique não foi direto no input (foi no texto ou container),
            // transferimos o clique para o input nativo.
            if (e.target !== this.elems.input) {
                // Evita loop infinito se o label já estiver associado corretamente
                // Mas como estamos em ShadowDOM, forçar o click é seguro.
                this.elems.input.click();
            }
        });
    }

    // ****************************************************************************
    // Getters e Setters de Estado
    // ****************************************************************************

    // Checked: Atributo Booleano
    get checked() { return this.hasAttribute('checked'); }
    set checked(isTrue) {
        // Reflete a propriedade JS no atributo HTML
        // Isso vai disparar o attributeChangedCallback -> update_checked
        if (isTrue) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    // Name: Importante para Radios
    get name() { return this.getAttribute('name'); }
    set name(val) { this.setAttribute('name', val); }

    // ****************************************************************************
    // Métodos de Atualização (Chamados pelo PROP_MAP)
    // ****************************************************************************

    update_label(val) {
        if (this.elems.labelText) {
            this.elems.labelText.textContent = val;
            this.elems.labelText.style.display = val ? 'block' : 'none';
        }
    }

    update_checked(val) {
        const estaMarcado = this.hasAttribute('checked');
            // 1. Atualiza visual/nativo
        if (this.elems.input) this.elems.input.checked = estaMarcado;
        // 2. IMPORTANTE: Atualiza o formulário (cobre casos de alteração via JS)
        this._atualizarFormValue();
        // 3. Validação
        this._atualizarValidacao();
    }

    update_value(val) {
        if (this.elems.input) this.elems.input.value = val;
        // Se o valor muda, precisamos atualizar o formulário caso esteja checado
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

    // ****************************************************************************
    // Utils Internos
    // ****************************************************************************

    _atualizarFormValue() {
        // Proteção contra chamadas antes da inicialização (embora seu setTimeout resolva isso)
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
                this.elems.input // DICA: Aponte para o input nativo ou deixe undefined para o host
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class Checkbox extends BaseCheckable{
    static get formAssociated() { return true; }
    constructor() { super(); }
    
    /** @override */
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
    
    /** @override */
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
    // 1. Garante participação em forms
    static get formAssociated() { return true; }

    constructor() { super(); }
    
    /** @override */
    render() {
        // Usa o mesmo CSS já definido
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

    /** * @override
     * Sobrescrevemos o update_checked para adicionar a lógica de exclusividade.
     * Quando um radio é marcado, ele deve desmarcar os irmãos com o mesmo 'name'.
     */
    update_checked(val) {
        // 1. Executa a lógica padrão da BaseCheckable (atualiza visual, formValue, validação)
        super.update_checked(val);

        // 2. Se este radio acabou de ser marcado, desmarca os outros do mesmo grupo
        if (this.checked) {
            this._garantirUnicidadeDoGrupo();
        }
    }

    /**
     * Procura por outros elementos <algol-radio> no mesmo escopo (documento ou shadowRoot)
     * que tenham o mesmo 'name' e os desmarca.
     */
    _garantirUnicidadeDoGrupo() {
        const name = this.name;
        if (!name) return; // Se não tem name, não pertence a grupo

        // Pega a raiz onde este componente está (pode ser o document ou outro ShadowDOM)
        const root = this.getRootNode();
        
        // Se estiver desconectado do DOM, root pode ser null ou o próprio elemento
        if (!root || !root.querySelectorAll) return;

        // Seleciona todos os radios com o mesmo nome
        const siblings = root.querySelectorAll(`algol-radio[name="${name}"]`);

        siblings.forEach(radio => {
            // Se for um irmão (não eu mesmo) e estiver marcado...
            if (radio !== this && radio.checked) {
                radio.checked = false; // ...desmarca ele (isso dispara o update_checked dele)
            }
        });
    }
}

class SwitchRadio extends BaseCheckable {
    // 1. Garante participação em forms
    static get formAssociated() { return true; }

    constructor() { super(); }
    
    /** @override */
    render() {
        this.root.adoptedStyleSheets = [algol_checkables_sheet];
        // A estrutura HTML muda as classes para usar o estilo "box-switch-radio" e "ball-switch-radio"
        // que você definiu no CSS compartilhado.
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

    /** @override */
    update_checked(val) {
        // 1. Atualiza visual, validação e form internals
        super.update_checked(val);

        // 2. Se ativado, garante que é o único do grupo
        if (this.checked) {
            this._garantirUnicidadeDoGrupo();
        }
    }

    /**
     * Lógica de exclusividade mútua (só um pode estar marcado por vez)
     */
    _garantirUnicidadeDoGrupo() {
        const name = this.name;
        if (!name) return; 

        const root = this.getRootNode();
        if (!root || !root.querySelectorAll) return;

        // IMPORTANTE: Aqui mudamos o seletor para buscar apenas outros SwitchRadios.
        // Se você quiser que um 'algol-radio' comum desmarque um 'algol-switch-radio' 
        // (misturar os tipos), você precisaria ajustar a query para: 
        // root.querySelectorAll(`algol-radio[name="${name}"], algol-switch-radio[name="${name}"]`);
        
        const siblings = root.querySelectorAll(`algol-switch-radio[name="${name}"]`);

        siblings.forEach(elem => {
            // Se for um irmão do mesmo grupo e estiver marcado, desmarca.
            if (elem !== this && elem.checked) {
                elem.checked = false; 
            }
        });
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
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