class TextArea extends AlgolComponent {
    // atributos observados
    static get observedAttributes() {
        return ['valor', 'placeholder', 'rotulo', 'disabled', 'posicao', ,
                'linhas', 'maxcaracteres', 'apenasleitura', 'required', 'fixo'];
    }

    constructor() {
        super();
    }

    // ****************************************************************************
    // Inicialização
    // ****************************************************************************

    _init() {
        if (this._base_initialized) return;
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        // rotulo (segue padrão atual do inputs.js usando <div> com classe)
        const rotulo = document.createElement('div');
        rotulo.className = 'algol-rotulo';
        rotulo.setAttribute('tabindex', '-1'); // para não receber foco
        
        // textarea
        const ta = document.createElement('textarea');
        ta.className = 'algol-textarea';
        ta.setAttribute('tabindex', '-1'); // para não receber foco
        
        // garantir id único evitando
        if (!ta.id) {
            // inicializa o contador no próprio Input (classe base) se necessário
            if (typeof TextArea._uidCounter === 'undefined') TextArea._uidCounter = 0;
            ta.id = `algol-textarea-${++TextArea._uidCounter}`;
        }
        
        // container
        const group = document.createElement('div');
        group.className = 'algol-component-group';
        group.setAttribute('tabindex', '-1'); // para não receber foco

        // monta a árvore
        group.appendChild(rotulo);
        group.appendChild(ta);
        this.appendChild(group);

        // salva as refs globais
        this._elems['root'] = group;
        this._elems['rotulo'] = rotulo;
        this._elems['textarea'] = ta;

        this._base_initialized = true;
    }

    _attachEvents() {
        /* reflete o valor digitado no input no atributo valor do componente */
        this._elems['textarea'].addEventListener('input', () => {
            const val = this._elems['textarea'].value;
            if (this.valor !== val) this.valor = val;
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        this._elems['textarea'].addEventListener('change',() => {
            const val = this._elems['textarea'].value;
            if (this.valor !== val) this.valor = val;
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        // faz com que o enter no componente leve o foco para o input
        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'Enter') {
                this._elems['textarea'].focus();
                return;
            }
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    _applyAttribute_rotulo() {
        const rotulo = this.getAttribute('rotulo');
        if (rotulo && rotulo !== '') {
            this._elems['rotulo'].textContent = rotulo;
            if (!this._elems['rotulo'].parentNode) this._elems['root'].insertBefore(this._elems['rotulo'], this._elems['textarea']);
        } else {
            if (this._elems['rotulo'].parentNode) this._elems['root'].removeChild(this._elems['rotulo']);
        }
    }
    _applyAttribute_placeholder() {
        if(this.hasAttribute('disabled'))return;
        if (this.hasAttribute('placeholder')) this._elems['textarea'].placeholder = this.getAttribute('placeholder');
    }
    _applyAttribute_valor() {
        if (this.hasAttribute('valor')) this._elems['textarea'].value = this.valor;
    }
    _applyAttribute_posicao() {
        const pos = this.getAttribute('posicao');       
        if (!pos) return; // se não existe a propiedade 'posicao', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicao'
        switch(pos){
            case posValues[0]: this.style.justifySelf = 'start'; break;
            case posValues[1]: this.style.justifySelf = 'end'; break;
            case posValues[2]: this.style.justifySelf = 'center'; break;
            case posValues[3]: this.style.justifySelf = 'stretch'; break;
        }
    }
    _applyAttribute_disabled() {
        const isDisabled = this.hasAttribute('disabled');
        this._elems['textarea'].disabled = isDisabled;
        if (isDisabled) {
            this._elems['textarea'].style.cursor = 'not-allowed';
        } else {
            this._elems['textarea'].style.cursor = '';
        }
    }
    _applyAttribute_required() {
        this._elems['textarea'].required = this.hasAttribute('required');
    }

    // específicos do textarea
    _applyAttribute_linhas() {
        if (!this._elems['textarea']) return;
        if (this.hasAttribute('linhas')) {
            const v = parseInt(this.linhas, 10);
            if (Number.isFinite(v) && v > 0) this._elems['textarea'].rows = v;
        }
    }
    _applyAttribute_maxcaracteres() {
        if (this.hasAttribute('maxcaracteres')) {
            const v = parseInt(this.maxcaracteres, 10);
            if (Number.isFinite(v) && v >= 0) this._elems['textarea'].maxLength = v;
        }
    }
    _applyAttribute_apenasleitura() {
        const apenasleitura =  this.hasAttribute('apenasleitura'); 
        if (!apenasleitura) return;
        this._elems['textarea'].readOnly = 'readonly';
    }
    _applyAttribute_fixo() {
        const apenasleitura =  this.hasAttribute('fixo'); 
        if (!apenasleitura) return;
        this._elems['textarea'].style.resize = 'none';
    }

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    // gerais
    addEventoClique(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let mouseInfo = {
                x: e.clientX,
                y: e.clientY,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
            callback(origem,mouseInfo);
        };
        this.addEventListener('click', wrapperCallback);
    }
    addEventoFoco(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('focus', wrapperCallback);
    }
    addEventoBlur(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('blur', wrapperCallback);
    }
    addEventoMouseEntra(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('mouseenter', wrapperCallback);
    }
    addEventoMouseSai(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('mouseleave', wrapperCallback);
    }
    addEventoMouseSobre(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            let mouseInfo = {
                x: e.clientX,
                y: e.clientY,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
            callback(origem,mouseInfo);
        };
        this.addEventListener('mousemove', wrapperCallback);
    }
    addEventoMudaValor(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            if(e.detail.attribute=='valor'){
                let origem = e.currentTarget
                let valor = this.valor;
                callback(origem,valor);
                return;
            }
        };
        this.addEventListener('mudancaAtributo', wrapperCallback);
    }
    

}