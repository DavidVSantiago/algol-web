/**
 * Componente Web `<algol-textarea>`.
 *
 * Área de texto customizada com:
 *  - label integrada
 *  - suporte a placeholder, readonly e disabled
 *  - controle de linhas visíveis (`lines`)
 *  - limite de caracteres (`maxlength`)
 *  - modo fixo (desabilita resize)
 *  - sincronização automática com formulários (ElementInternals)
 *  - validação nativa (`required`, `tooLong`)
 *  - suporte a conteúdo inicial via slot
 *
 * Este componente encapsula um `<textarea>` nativo no Shadow DOM,
 * preservando acessibilidade, comportamento de formulários e validações.
 *
 * @fires Image#algol-textarea-input
 * 
 * @extends BaseComponent
 */
class TextArea extends BaseComponent {
    static get formAssociated() { return true; }
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
    static get observedAttributes() {return Object.keys(TextArea.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();this._internals = this.attachInternals();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_textarea_sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `
            <div class="container">
                <label aria-label="type... for="connected"></label>
                <textarea id="connected"></textarea>
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
        this.elems.textarea.addEventListener('focus', (e) => {
            this._oldValue = this.elems.textarea.value; // Salva o valor atual do input
        });
        /* reflete o valor digitado no input no atributo valor do componente */
        this.elems.textarea.addEventListener('input', (e) => {
            const novoValor = e.currentTarget.value; // obtém o valor do textarea
            if (this.value !== novoValor) {
                this.value = novoValor; // Mantém a propriedade da classe sincronizada
            }
            this.dispatchEvent(new CustomEvent('algol-input', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    value: e.target.value
                }
            }));
            this._internals.setFormValue(novoValor); // Informa ao formulário nativo (API Internals)
            this._atualizarValidacao();
        });
    
        this.elems.textarea.addEventListener('change',(e) => {
            this.dispatchEvent(new CustomEvent('algol-change', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    oldValue: this._oldValue,
                    value: e.target.value
                }
            }));
            this._oldValue = this.value;
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
    label {
        color: var(--text-B);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    :host([disabled]) label {
        color: var(--text-dis-A);
    }
    textarea {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        background: var(--bg-comp-A);
        color: var(--text-A);
        border: calc(0.1vw * var(--scale-factor)) solid var(--border-A);
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
    :host([disabled]) textarea{
        background-color: var(--bg-comp-dis-A) !important;
        color: var(--text-dis-A) !important;
        cursor: not-allowed !important;
        user-select: none !important;
    }
    :host(:focus-within) textarea {
        border-color: var(--accent-B); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--accent-B) /* "Glow" externo */
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-textarea', TextArea); // Registra o componente customizado