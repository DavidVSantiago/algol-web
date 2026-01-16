class Input extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
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
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <input type="text">
            </div>
            <slot></slot>
        `;
    }
    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.input = this.root.querySelector('input');
        this.elems.slot = this.root.querySelector('slot');

        // criação de id único para o select e linkagem com o label
        const idUnico = `input-${BaseComponent._idCont++}`;
        this.elems.input.id = idUnico;
        this.elems.label.setAttribute('for', idUnico);
    }

    /** @override */
    attachEvents(){
        /* reflete o valor digitado no input no atributo valor do componente */
        this.elems.input.addEventListener('input', (e) => {
            const novoValor = e.currentTarget.value; // obtém o valor do input
            if (this.value !== novoValor) {
                this.value = novoValor; // Mantém a propriedade da classe sincronizada
            }
            this._internals.setFormValue(novoValor); // Informa ao formulário nativo (API Internals)
            this._atualizarValidacao();
        });
        this.elems.input.addEventListener('change',() => {
            this._atualizarValidacao(); 
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        const valorSeguro = val === null || val === undefined ? '' : val; // Se o valor for nulo/undefined, transformamos em string vazia
        if (this.elems.input && this.elems.input.value !== valorSeguro){
            this.elems.input.value = valorSeguro;
            this._internals.setFormValue(valorSeguro); // informa o que será enviado pro form
            this._atualizarValidacao(); // atualiza a validação
        }
    }
    update_placeholder(val) {if (this.elems.input) this.elems.input.placeholder = val;    }
    update_required(val) {if (this.elems.input) this.elems.input.required = this.hasAttribute('required'); this._atualizarValidacao();}
    update_disabled(val) {if (this.elems.input) this.elems.input.disabled = this.hasAttribute('disabled');}
    update_type(val) {
        if (!this.elems.input) return;
        const tipo = ['text','email','password','url','search'].includes(val) ? val : 'text'; // validação com fallback
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

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Atualiza a validação de form do elemento customizado
    _atualizarValidacao() {
        if (!this.elems.input) return;
        // Pega a validade nativa do textarea escondido
        const validadeInterna = this.elems.input.validity; // obtem a validade do select interno
        if (!validadeInterna.valid) { // Se for inválido
            // Repassa TODAS as flags possíveis para inputs de texto
            const flags = {
                valueMissing: validadeInterna.valueMissing,    // Required
                typeMismatch: validadeInterna.typeMismatch,    // Email inválido
                tooShort: validadeInterna.tooShort,            // Minlength
                tooLong: validadeInterna.tooLong,              // Maxlength
                patternMismatch: validadeInterna.patternMismatch, // Regex (se usar pattern)
            };
            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, // Mensagem nativa do browser
                this.elems.input 
            );
        } else this._internals.setValidity({}); // Se for válido, limpa o erro
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

class InputNumber extends Input {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
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

            // exclusivos de input number
            'min': 'update_min',
            'max': 'update_max',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; // aplica o estilo do componente (compartilhado)
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
    /** @override */
    postConfig(){
        super.postConfig();
        this.elems.spinner = this.root.querySelector('.spinner');
        this.elems.btnup = this.root.querySelector('.btnup');
        this.elems.btndown = this.root.querySelector('.btndown');
        
        this.elems.btnup.setAttribute('role', 'button');
        this.elems.btndown.setAttribute('role', 'button');

        this._lastValidValue='';
    }

    /** @override */
    attachEvents(){
        // eventos do input
        this.elems.input.addEventListener('input', (e) => {
            let valor = e.currentTarget.value;
            const isValido = /^-?\d*([.,]\d*)?$/.test(valor); // regra: só número (ajuste regex se aceitar decimal, negativo etc)
            if (!isValido) {
                this.elems.input.value = this._lastValidValue; // restaura o último valor válido
                this.value = this._lastValidValue; // restaura o último valor válido
                return;
            }
            this._lastValidValue = valor; // se é válido, salva o último valor válido
            this.value = valor;
        });
        this.elems.input.addEventListener('change',(e) => {
            let valorStr = this.value;
            // Limpeza de sujeira (- e   .)
            if (['-', '-.', '.', '', ','].includes(valorStr)) {
                this._resetToEmpty();
                return;
            }

            // Tratar vírgula antes de converter
            let valorNum = Number(valorStr.replace(',', '.'));

            if (isNaN(valorNum)) {
                this._resetToEmpty();
                return;
            }

            valorNum = this._validaLimites(valorNum); // valida min/max
            
            this.value = String(valorNum); 
            this.elems.input.value = this.value;
            this._lastValidValue = this.value;

            this._internals.setFormValue(this.value);
            this._atualizarValidacao(); 
        });
        // eventos de clique nos bottões spin (up e down)
        this.elems.btnup.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(1);
        });
        this.elems.btndown.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(-1);
        });
        // para fazer o 'up' e 'down' funcionarem pra subir e descer o valor do inputnumber
        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'ArrowUp') {
                e.preventDefault(); // Evita mover o cursor no texto
                this._incrementaValor(1);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault(); // Evita mover o cursor no texto
                this._incrementaValor(-1);
            }
        });
        
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_min(val) {}
    update_max(val) {}
    

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _validaLimites(valor){
        valor = (this.hasAttribute('max') && (valor > this.max))? Number(this.max) : valor;
        valor = (this.hasAttribute('min') && (valor < this.min))? Number(this.min) : valor;
        return valor;
    }

    _incrementaValor(inc){
        let atualStr = this.value ? this.value.replace(',', '.') : '0'; // Trata vírgula e valor vazio (vazio vira 0)
        let valorNum = Number(atualStr); // converte para numero
        if(isNaN(valorNum)) valorNum = 0; // guard
        valorNum += inc;
        valorNum = this._validaLimites(valorNum); // verifica min/max
        
        valorNum = parseFloat(valorNum.toFixed(2)); // Opcional: arredonda para 2 casas se tiver decimal, ou mantém inteiro

        this.value = String(valorNum);
        this.elems.input.value = this.value;
        this._lastValidValue = this.value; // se é válido, salva o último valor válido
        this._internals.setFormValue(this.value);
    }

    _resetToEmpty() {
        this.value = '';
        this.elems.input.value = '';
        this._lastValidValue = '';
        this._internals.setFormValue('');
        this._atualizarValidacao();
    }

}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_input_sheet = new CSSStyleSheet();
algol_input_sheet.replaceSync(`
    :host {
        display: block; /* Garante que o componente respeite largura/altura */
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
        color: var(--text-color-forms-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
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
        background-color: var(--bg-color-btn-spinner-hover);
    }
    .container input {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        padding: calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));
        background: var(--bg-color-forms);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        
        font-family: 'Algol Font';
        font-weight: 100;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));
    }
    /* Para o estado disabled */
    :host([disabled]) input{
        background-color: var(--bg-color-forms-disabled) !important;
        color: var(--text-color-forms-disabled) !important;
        cursor: not-allowed;
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
    :host(:focus-within) input {
        border-color: var(--border-color-focus); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-input', Input); // Registra o componente customizado
customElements.define('algol-input-number', InputNumber); // Registra o componente customizado
