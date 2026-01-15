class TextArea extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
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
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_textarea_sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `
            <div class="container">
                <label></label>
                <textarea></textarea>
            </div>
            <slot></slot>
        `;
    }
    /** @override */
    postConfig(){
        // salva as referências globais dos componentes
        this.elems.container = this.root.querySelector('.container');
        this.elems.label = this.root.querySelector('label');
        this.elems.textarea = this.root.querySelector('textarea');
        this.elems.slot = this.root.querySelector('slot');

        // criação de id único para o textarea e linkagem com o label
        const idUnico = `textarea-${BaseComponent._idCont++}`;
        this.elems.textarea.id = idUnico;
        this.elems.label.setAttribute('for', idUnico);

    }
    /** @override */
    attachEvents(){
        /* Escuta alterações do slot */
        this.elems.slot.addEventListener('slotchange', () => {
            // Se já tiver valor setado via atributo/JS, ignoramos o slot para não sobrescrever o que o usuário digitou
            // Mas se o value estiver vazio, puxamos do slot.
            if (this.getAttribute('value') === null && this.elems.slot.assignedNodes().length > 0) {
                const nodes = this.elems.slot.assignedNodes(); // obtém os elementos internos da tag
                // filtra e obtem apenas o que for texto (específico para <textarea>)
                const textoInicial = nodes.map(n => n.textContent).join('');
                if (textoInicial.trim() !== '') {
                    this.value = textoInicial;
                }
            }
        });
        /* reflete o valor digitado no input no atributo valor do componente */
        this.elems.textarea.addEventListener('input', (e) => {
            const novoValor = e.target.value; // obtém o valor do textarea
            if (this.value !== novoValor) {
                this.value = novoValor; // Mantém a propriedade da classe sincronizada
            }
            this._internals.setFormValue(novoValor); // Informa ao formulário nativo (API Internals)
            this._atualizarValidacao();
        });
        this.elems.textarea.addEventListener('change',() => {
            this._atualizarValidacao(); 
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_label(val) {if (this.elems.label) this.elems.label.textContent = val;}
    update_value(val) {
        const valorSeguro = val === null || val === undefined ? '' : val; // Se o valor for nulo/undefined, transformamos em string vazia
        if (this.elems.textarea && this.elems.textarea.value !== valorSeguro){
            this.elems.textarea.value = valorSeguro;
            this._internals.setFormValue(valorSeguro); // informa o que será enviado pro form
            this._atualizarValidacao(); // atualiza a validação
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
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Atualiza a validação de form do elemento customizado
    _atualizarValidacao() {
        if (!this.elems.textarea) return;
        // Pega a validade nativa do textarea escondido
        const validadeInterna = this.elems.textarea.validity; // obtem a validade do select interno
        if (!validadeInterna.valid) { // Se for inválido
            this._internals.setValidity( // seta a validade do elemento customizado
                { 
                    valueMissing: validadeInterna.valueMissing,
                    valid: false,
                    tooLong: validadeInterna.tooLong,
                }, 
                this.elems.textarea.validationMessage, 
                this.elems.textarea, // onde a 'bolha' de erro deve aparecer
            );
        } else this._internals.setValidity({}); // Se for válido, limpa o erro
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_textarea_sheet = new CSSStyleSheet();
algol_textarea_sheet.replaceSync(`
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
    .container textarea {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        background: var(--bg-color-forms);
        color: var(--text-color);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-color-forms);
        border-radius: calc(var(--border-radius-components) * var(--scale-factor));
        padding: calc(0.8vw * var(--scale-factor)) calc(1.1vw * var(--scale-factor));
       
        font-family: 'Algol Font';
        font-weight: 100;
        font-size: calc(1.1vw * var(--scale-factor));
        line-height: calc(var(--line-height) * var(--scale-factor));

        /* Comportamento padrão de resize (sobrescrito pelo JS se tiver fixed) */
        resize: vertical; 
        min-height: calc(3.5vw * var(--scale-factor)); /* Altura mínima decente */
    }
    /* Para o estado disabled */
    :host([disabled]) .container textarea{
        background-color: var(--bg-color-forms-disabled) !important;
        color: var(--text-color-forms-disabled) !important;
        cursor: not-allowed;
    }
    :host(:focus-within) textarea {
        border-color: var(--border-color-focus); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-textarea', TextArea); // Registra o componente customizado