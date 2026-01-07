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
        const html = `
            <div class="container">
                <label part="label"></label>
                <select part="select"></select>
            </div>
            <slot></slot>
        `;

        this.root.innerHTML = html;
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
