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
            'maxlength': 'update_maxlength'
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
            const novoValor = e.target.value; // obtém o valor do input
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
        const tipo = ['text','email','password'].includes(val) ? val : 'text'; // validação com fallback
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
    .container label {
        color: var(--text-color-forms-label);
        font-size: calc(1.0vw * var(--scale-factor));
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
    :host([disabled]) .container input{
        background-color: var(--bg-color-forms-disabled) !important;
        color: var(--text-color-forms-disabled) !important;
        cursor: not-allowed;
    }
    :host(:focus-within) input {
        border-color: var(--border-color-focus); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-input', Input); // Registra o componente customizado
