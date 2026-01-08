class Select extends BaseComponent {
    static get observedAttributes() {
        return ['rotulo', 'valor', 'required', 'disabled'];
    }

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    render() {
        const css = `
            <style>
                :host {
                    display: block; /* Garante que o componente respeite largura/altura */
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: calc(0.3vw * var(--scale-factor));
                    margin-bottom: calc(1.0vw * var(--scale-factor));
                    width: 100%;

                    label {
                        color: var(--text-color-forms-label);
                        font-size: calc(1.0vw * var(--scale-factor));
                    }
                    select {
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
                }
                /* Para o estado disabled */
                :host([disabled]) {
                    .container {
                        select {
                            background-color: var(--bg-color-forms-disabled) !important;
                            color: var(--text-color-forms-disabled) !important;
                            cursor: not-allowed;
                        }
                    }
                }
                :host(:focus-within) select {
                    border-color: var(--border-color-focus); /* Exemplo */
                    box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
                }
            </style>
        `;

        const html = `
            <div class="container">
                <label></label>
                <select></select>
            </div>
            <slot></slot>
        `;
        
        this.root.innerHTML = css + html;
    }
    /** @override */
    postConfig(){
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
            this.valor = e.target.value; // reflete no atributo
            // Dispara evento nativo para que frameworks saibam que mudou
            this.dispatchEvent(new Event('change', { bubbles: true }));
            this.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        // Quando o usuário adiciona/remove <option> no HTML, isso dispara.
        this.elems.slot.addEventListener('slotchange', () => {
            this._sincronizarOptions();
        });
    }
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Copia as options do Slot (light DOM) para o Select (shadow DOM)
    _sincronizarOptions() {
        const select = this.elems.select;
        const options = this.elems.slot.assignedElements(); // pega um array dos elementos passados para o slot (light DOM)
        select.innerHTML = ''; // limpa as opções
        // Clona as options do usuário para dentro do shadow select
        for(const option of options){
            if (option.tagName.toLowerCase() === 'option') { // garante que é uma option
                select.appendChild(option.cloneNode(true));
            }
        };
        // Reaplica o valor se houver
        if (this.valor) select.value = this.valor;
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_rotulo(val) {
        if (this.elems.label) this.elems.label.textContent = val;
    }
    update_valor(val) {
        if (this.elems.select && this.elems.select.value !== val) {
            this.elems.select.value = val;
        }
    }
    update_required(val) {
        // O atributo vem como string 'true', '', ou null
        const isRequired= this.hasAttribute('required');
        if (this.elems.select) this.elems.select.required = isRequired;
    }
    update_disabled(val) {
        // O atributo vem como string 'true', '', ou null
        const isDisabled = this.hasAttribute('disabled');
        if (this.elems.select) this.elems.select.disabled = isDisabled;
    }
}
customElements.define('algol-select', Select);