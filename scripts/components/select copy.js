class Select extends BaseComponent {
    static get observedAttributes() {
        return ['rotulo', 'valor', 'required', 'disabled','posicaoh', 'posicaov'];
    }

    constructor() {
        super();
    }

    // observador de mudanças
    _mutationObserver (mutations) {
        // Flag para evitar rebuilds desnecessários se a mudança não for relevante
        let mudancaRelevante = false;
        for (const mutation of mutations) { // percorre todas as mutações

            if (mutation.type === 'childList') { // Mudança na estrutura do DOM (elementos adicionados/removidos)
                mudancaRelevante = true; break;
            } else if (mutation.type === 'attributes') { // Mudança de atributos
                if (mutation.attributeName === 'valor'){ // se a mudança foi no atributo valor...
                    this.dispatchEvent(new CustomEvent('mudancaValor', {bubbles: false}));
                    this._applyAttribute_valor(); // não deve reconstruir, apenas atualizar o valor
                }else {mudancaRelevante = true; break;}
            } else if (mutation.type === 'characterData') { // Mudança de texto
                
                mudancaRelevante = true; break;
            }
        }
        if(mudancaRelevante) {
            this.reaplicaAtributos();
        }
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

     /** Faz a construção interna do componente */
    _init() {
        if (this._base_initialized) return; // guard para evitar dupla criação
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        this.style.alignSelf = 'center';

        // container raiz
        const group = document.createElement('div');
        group.className = 'algol-component-group';

        // rotulo
        const label = document.createElement('label');
        label.className = 'algol-label';

        // wrapper do select custom
        const select = document.createElement('select');
        select.className = 'algol-select';

        // Move as <option> existentes para o select nativo
        while (this.firstChild) {
            const node = this.firstChild;
            if (node.tagName === 'OPTION' || node.nodeType === Node.TEXT_NODE) {
                select.append(node);
            } else {
                node.remove();
            }
        }

        group.appendChild(label);
        group.appendChild(select);
        this.appendChild(group);

        // refs
        this._elems['root'] = group;
        this._elems['label'] = label;
        this._elems['select'] = select;

        this._applyAttributes();
        this._marcarOpcaoPadrao(); // para selecionar a opção padrão

        this._base_initialized = true;
    }

    _marcarOpcaoPadrao() {
        if (this._elems['select'].options.length > 0) {
            let select = this._elems['select'];
            select.selectedIndex = 0; // a princípio, a opção padrão é a primeira
            // seleciona o primeiro <option> marcado como ativo
            for(let i=0;i<select.options.length;i++){
                const option = select.options[i];
                if(option.hasAttribute('ativa')) {
                    select.selectedIndex = i;
                    break;
                }
            }
            this._refletirValor(); // Atualiza o valor refletido
        }
    }

    _attachEvents() {
        this._elems['select'].addEventListener('input', () => this._refletirValor());
        this._elems['select'].addEventListener('change', () => this._refletirValor());
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _refletirValor() {
    const current = this._elems['select'].value;
        if (this.valor !== current) {
        this.valor = current;
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    _applyAttribute_rotulo() {
        const rotulo = this.getAttribute('rotulo');
        this._elems['label'].textContent = rotulo;
    }
    _applyAttribute_valor() {
        // quando alterar externamente o atributo, aplica sem disparar eventos duplicados
        const v = this.valor;
        this._elems['select'].value = v;
    }
    _applyAttribute_disabled() {
        this._elems['select'].disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            this._elems['select'].style.cursor = 'not-allowed';
        } else {
            this._elems['select'].style.cursor = '';
        }
    }

    _applyAttribute_required() {
        this._elems['select'].toggleAttribute('required', this.hasAttribute('required'));
    }
    _applyAttribute_posicaoh() {
        const pos = this.getAttribute('posicaoh');       
        if (!pos) return; // se não existe a propiedade 'posicaoh', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        switch(pos){
            case posValues[0]: this.style.justifySelf = 'start'; break;
            case posValues[1]: this.style.justifySelf = 'end'; break;
            case posValues[2]: this.style.justifySelf = 'center'; break;
            case posValues[3]: this.style.justifySelf = 'stretch'; break;
        }
    }
    _applyAttribute_posicaov() {
        const pos = this.getAttribute('posicaov');       
        if (!pos) return; // se não existe a propiedade 'posicaov', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaov'
        switch(pos){
            case posValues[0]: this.style.alignSelf = 'start'; break;
            case posValues[1]: this.style.alignSelf = 'end'; break;
            case posValues[2]: this.style.alignSelf = 'center'; break;
            case posValues[3]: this.style.alignSelf = 'center'; break;
        }
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
            let origem = e.currentTarget
            let valor = this.valor;
            callback(origem,valor);
            return;
            
        };
        this.addEventListener('mudancaValor', wrapperCallback);
    }
}

// static counter para ids
Select._uidCounter = 0;