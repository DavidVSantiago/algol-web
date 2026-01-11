class Select extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'placeholder': 'update_placeholder',
            'disabled': 'update_disabled',
            'required': 'update_required'
        };
    }
    static get observedAttributes() {return Object.keys(Select.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <select></select>
            </div>
            <slot></slot>
        `;
    }
    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.select = this.root.querySelector('select');
        this.elems.slot = this.root.querySelector('slot');

        // criação de id único para o select e linkagem com o label
        const idUnico = `select-${BaseComponent._idCont++}`;
        this.elems.select.id = idUnico;
        this.elems.label.setAttribute('for', idUnico);
    }
    /** @override */
    attachEvents() {
        this.elems.select.addEventListener('change', (e) => {
            this._oldValue = this.value // guarda o valor antigo
            this.value =e.target.value; // reflete no atributo

            this._internals.setFormValue(this.value); // informa o que será enviado pro form
            this._atualizarValidacao(); // atualiza a validação
        });
        
        // Quando o usuário adiciona/remove <option> no HTML, isso dispara.
        this.elems.slot.addEventListener('slotchange', () => {
            this._sincronizarOptions();
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        if (this.elems.select && this.elems.select.value !== val){
            this.elems.select.value = val;
            this._internals.setFormValue(val); // informa o que será enviado pro form
            this._atualizarValidacao(); // atualiza a validação
        }
    }
    update_placeholder(val) {if (this.elems.select) this._sincronizarOptions();}
    update_required(val) {if (this.elems.select) this.elems.select.required = this.hasAttribute('required'); this._atualizarValidacao();}
    update_disabled(val) {if (this.elems.select) this.elems.select.disabled = this.hasAttribute('disabled');}
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Copia as options do Slot (light DOM) para o Select (shadow DOM)
    _sincronizarOptions() {
        const select = this.elems.select;
        const options = this.elems.slot.assignedElements(); // pega um array dos elementos passados para o slot (light DOM)
        select.innerHTML = ''; // limpa as opções

        // adiciona o placeholder do select
        const placeholderTxt = this.placeholder;
        const opt = document.createElement('option');
        opt.text = placeholderTxt? placeholderTxt : 'Select...';
        opt.value = "";
        opt.disabled = true;
        opt.selected = true;
        select.appendChild(opt);

        // Clona as options do usuário para dentro do shadow select
        for(const option of options){   
            if (option.tagName.toLowerCase() === 'option') { // garante que é uma option
                select.appendChild(option.cloneNode(true));
            }
        };
        // Reaplica o value se houver
        if (this.value) select.value = this.value;
    }

    // Atualiza a validação de form do elemento customizado
    _atualizarValidacao() {
        if (!this.elems.select) return;
        // Pega a validade nativa do select escondido
        const validadeInterna = this.elems.select.validity; // obtem a validade do select interno
        if (!validadeInterna.valid) { // Se for inválido
            this._internals.setValidity( // seta a validade do elemento customizado
                { 
                    valueMissing: validadeInterna.valueMissing,
                    valid: false 
                }, 
                this.elems.select.validationMessage, 
                this.elems.select, // onde a 'bolha' de erro deve aparecer
            );
        } else this._internals.setValidity({}); // Se for válido, limpa o erro
    }

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    addEventValue(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origin = e.currentTarget;
            let oldValue = this._oldValue;
            let newValue = e.target.value;
            callback(origin,oldValue,newValue); // função do usuário
        };
        this.elems.select.addEventListener('change', wrapperCallback);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
    :host {
        display: block; /* Garante que o componente respeite largura/altura */
    }
    .container {
        display: flex;
        flex-direction: column;
        gap: calc(0.3vw * var(--scale-factor));
        margin-bottom: calc(1.0vw * var(--scale-factor));
        width: 100%;
    }
    .container label {
        color: var(--text-color-forms-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    .container select {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        background: var(--bg-color-forms);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        padding: calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));
        width: 100%;
        font-family: 'Algol Font';
        cursor: inherit;
        font-weight: 100;
        font-style: normal;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));
    }
    /* Para o estado disabled */
    :host([disabled]) .container select{
        background-color: var(--bg-color-forms-disabled) !important;
        color: var(--text-color-forms-disabled) !important;
        cursor: not-allowed;
    }
    :host(:focus-within) select {
        border-color: var(--border-color-focus); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-select', Select); // Registra o componente customizado