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
            ...super.PROP_MAP, // Herda tudo de Input
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

class InputDate extends Input {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, // Herda tudo de Input
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
    postConfig(){
        super.postConfig();
        this.elems.input.type = 'date';
    }

    /** @override */
    attachEvents(){
        super.attachEvents();
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    update_min(val) {
        if (!this.elems.input) return;
        if (!val) { // se não houver valor, remove o atributo
            this.elems.input.removeAttribute('min');
            this._atualizarValidacao();
            return;
        }
        let valorFinal = val;
        // verifica formato brasileiro DD/MM/AAAA e atualiza o valor final
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const [dia, mes, ano] = val.split('/');
            valorFinal = `${ano}-${mes}-${dia}`; // Converte para ISO (AAAA-MM-DD)
        }
        this.elems.input.min = valorFinal;
        this._atualizarValidacao();
    }

    update_max(val) {
        if (!this.elems.input) return;
        if (!val) { // se não houver valor, remove o atributo
            this.elems.input.removeAttribute('max');
            this._atualizarValidacao();
            return;
        }
        let valorFinal = val;
        // verifica formato brasileiro DD/MM/AAAA e atualiza o valor final
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const [dia, mes, ano] = val.split('/');
            valorFinal = `${ano}-${mes}-${dia}`; // Converte para ISO (AAAA-MM-DD)
        }
        this.elems.input.max = valorFinal;
        this._atualizarValidacao();
    }

    // ****************************************************************************
    // Validação Específica para Datas
    // ****************************************************************************

    /** @override */
    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {
            // Mapeamento de flags específicas para DATA/NÚMERO
            const flags = {
                valueMissing: validadeInterna.valueMissing,     // Required
                rangeUnderflow: validadeInterna.rangeUnderflow, // Data anterior ao 'min'
                rangeOverflow: validadeInterna.rangeOverflow,   // Data posterior ao 'max'
                badInput: validadeInterna.badInput,             // Data inválida (ex: 31/02)
                stepMismatch: validadeInterna.stepMismatch      // Fora do 'step' (se usar)
            };

            this._internals.setValidity(
                flags,
                this.elems.input.validationMessage, // Mensagem nativa ("Selecione uma data válida...")
                this.elems.input
            );
        } else {
            this._internals.setValidity({});
        }
    }
}

class InputTime extends Input {
    // Mapa de atributos
    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, // Herda label, required, disabled, etc.
            'min': 'update_min',
            'max': 'update_max',
            'step': 'update_step' // Controla a precisão (segundos/milissegundos)
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    /** @override */
    postConfig(){
        super.postConfig(); // Configura container, label, input, slot...
        this.elems.input.type = 'time';
    }

    /** @override */
    attachEvents(){
        super.attachEvents(); // Ganha validação e update_value de graça
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    update_min(val) {
        if (!this.elems.input) return;
        // Time usa formato HH:MM ou HH:MM:SS. Não requer conversão complexa de data.
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

    // O atributo STEP é crucial para Time.
    // step="60" (padrão) -> Mostra apenas HH:MM
    // step="1" -> Mostra HH:MM:SS
    update_step(val) {
        if (!this.elems.input) return;
        if (val) this.elems.input.step = val;
        else this.elems.input.removeAttribute('step');
        this._atualizarValidacao();
    }

    // ****************************************************************************
    // Validação Específica (Idêntica à de Data)
    // ****************************************************************************

    /** @override */
    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        if (!validadeInterna.valid) {
            const flags = {
                valueMissing: validadeInterna.valueMissing,     // Required
                rangeUnderflow: validadeInterna.rangeUnderflow, // Hora anterior ao 'min'
                rangeOverflow: validadeInterna.rangeOverflow,   // Hora posterior ao 'max'
                badInput: validadeInterna.badInput,             // Hora inválida
                stepMismatch: validadeInterna.stepMismatch      // Fora do 'step' (ex: digitou segundos sem step=1)
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
    // Mapa de atributos (Color é simples: só label, value e disabled importam)
    static get PROP_MAP() {
        return {
            'label': 'update_label',
            'value': 'update_value',
            'disabled': 'update_disabled'
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    /** @override */    
    render() {
        this.root.adoptedStyleSheets = [algol_input_sheet]; // aplica o estilo do componente (compartilhado)
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

    /** @override */
    postConfig(){
        super.postConfig();
        
        this.elems.colorBorder = this.root.querySelector('.color-border');
        this.elems.colorBox = this.root.querySelector('.color-box');

        // CORREÇÃO: Remove a associação automática do label com o input escondido
        this.elems.label.removeAttribute('for');

        if (!this.value){
            this.value = '#f00'; // cor padrão inicial
            this.elems.input.value = '#f00';
        }
        this._atualizarVisual(this.value);
    }

    /** @override */
    attachEvents(){
        super.attachEvents();
        this.elems.colorBox.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this.elems.input.click(); // abre o seletor de cor nativo
        });
        // ao digitar no input color, atualiza a cor do box REAL-TIME
        this.elems.input.addEventListener('input', (e) => {
            const novaCor = e.target.value;
            this._atualizarVisual(novaCor);
        });
        // ao mudar o valor do input color, atualiza a cor do box
        this.elems.input.addEventListener('change', (e) => {
            this._atualizarVisual(e.target.value);
        });
        this.addEventListener('keydown', (e) => {
            if (e.code === "Space" || e.code === "Enter") {
                e.preventDefault(); // evita scroll no Space
                this.elems.input.click(); // abre o seletor de cor nativo
            }
        });

    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    /** @override */
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

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _atualizarVisual(cor) {
        if(this.elems.colorBox) {
            this.elems.colorBox.style.backgroundColor = cor;
        }
    }

    // ****************************************************************************
    // Validação
    // ****************************************************************************

    /** @override */
    _atualizarValidacao() {
        // Input color é sempre válido (validity.valid é sempre true),
        if (this._internals) this._internals.setValidity({});
    }
}

class InputRange extends Input {
    static get PROP_MAP() {
        return {
            ...super.PROP_MAP, // Herda label, required, disabled, etc.
            'min': 'update_min',
            'max': 'update_max',
            'step': 'update_step'
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);}
    constructor() {super();}

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    /** @override */
    postConfig(){
        super.postConfig(); // Configura container, label, input, slot...
        this.elems.input.type = "range";
    }

    /** @override */
    attachEvents(){
        super.attachEvents(); // Ganha validação e update_value de graça
        
        this.elems.input.addEventListener('input', (e) => {
            this.dispatchEvent(new CustomEvent('algol-input-range-move', { 
                bubbles: true, 
                composed: true,
                detail: { value: this.value }
            }));
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
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

    // ****************************************************************************
    // Validação Específica (Idêntica à de Data)
    // ****************************************************************************

    /** @override */
    _atualizarValidacao() {
        if (!this.elems.input) return;

        const validadeInterna = this.elems.input.validity;

        // Nota: Range dificilmente falha na interação do usuário, 
        // mas protege contra valores inválidos via JS.
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
        color: var(--text-color-label);
        font-size: calc(1.0vw * var(--scale-factor));
    }
    :host([disabled]) label{
        color: var(--text-color-label-disabled);
    }
    input::-webkit-calendar-picker-indicator { /* Chrome & others*/
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
        border-color: var(--border-color-focus); /* Exemplo */
        box-shadow: 0 0 0 calc(0.1vw * var(--scale-factor)) var(--border-color-focus-glow) /* "Glow" externo */
    }
    input::placeholder {
        color: var(--text-color-placeholder) !important;
    }
    :host([disabled]) input::placeholder {
        color: var(--text-color-placeholder-disabled) !important;
    }

    /* --- ESTILOS ESPECÍFICOS PARA INPUT NUMBER --- */

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
        transform: translateY(calc(0.09vw * var(--scale-factor))); /* Efeito de clique */
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
    

    /* --- ESTILOS ESPECÍFICOS PARA INPUT COLOR --- */
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
        filter: brightness(0.8); /* leve escurecida */
    }
    :host(:not([disabled])) .color-box:hover, :host(:not([disabled])) .color-border:hover{
        filter: brightness(0.9); /* leve escurecida */
    }
    :host(:not([disabled])) .color-box:active{
        transform: translateY(calc(0.09vw * var(--scale-factor))); /* Efeito de clique */
        filter: brightness(0.8);
    }

    /* --- ESTILOS ESPECÍFICOS PARA INPUT RANGE --- */

    input[type="range"] {        
        background: transparent; /* Importante: remove o fundo de input texto */
        padding: 0;              /* Slider não deve ter padding interno */
        width: 100%;
        border:none;
        min-height: calc(2.4vw * var(--scale-factor)); /* Mantém a altura para alinhamento */
        cursor: pointer;
    }
    input[type="range"]:focus {
        outline: none;
        box-shadow: none;
    }
    
    /* trilho do range ----------------------------------------------------------- */
    input[type="range"]::-moz-range-track { /* Firefox */
        width: 100%;
        height: calc(0.4vw * var(--scale-factor));
        background: var(--bg-color-inputs);
        border-radius: calc(0.2vw * var(--scale-factor));
        cursor: pointer;
    }
    :host([disabled]) input[type="range"]::-moz-range-track { /* Chrome & others */
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
    /* bolinha do range ----------------------------------------------------------- */
    input[type="range"]::-webkit-slider-thumb {/* bolinha Chrome, Safari, Edge */
        -webkit-appearance: none; /* Necessário para estilizar */
        height: calc(1.2vw * var(--scale-factor));
        width: calc(1.2vw * var(--scale-factor));
        border-radius: 50%;
        background: var(--text-color); /* Cor da bolinha */
        border: none;
        margin-top: calc(-0.4vw * var(--scale-factor)); 
    }
   
    input[type="range"]::-moz-range-thumb { /* bolinha Firefox */
        height: calc(1.2vw * var(--scale-factor));
        width: calc(1.2vw * var(--scale-factor));
        border-radius: 50%;
        background: var(--text-color);
        border: none;
    }
    input[type="range"]::-webkit-slider-thumb:hover { /* Hover da bolinha Chrome, Safari, Edge */
        transform: scale(1.2); /* Cresce um pouco */
        background: var(--border-color-focus);
    }
    input[type="range"]::-moz-range-thumb:hover { /* Hover da bolinha firefox */
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
        background: #0000 !important; /* remove o fundo */
        cursor: not-allowed;
    }
    :host([disabled]) input[type="range"]::-moz-range-thumb {
        background: var(--text-color-disabled) !important;
    }
    :host([disabled]) input[type="range"]::-webkit-slider-thumb {
        background: var(--text-color-disabled) !important;
        cursor: not-allowed;
    }
    
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-input', Input); // Registra o componente customizado
customElements.define('algol-input-number', InputNumber); // Registra o componente customizado
customElements.define('algol-input-date', InputDate);
customElements.define('algol-input-time', InputTime);
customElements.define('algol-input-color', InputColor); 
customElements.define('algol-input-range', InputRange); 