class AlgolComponent extends HTMLElement{
    
    static _idCont = 0 // contador para os ids únicos dos elementos internos do componente
    static get observedAttributes() { return []; } // atributos observados serão definidos nas classes filhas

    constructor() {
        super();
        this._elems = new Map(); // mapa dos elementos internos do componente
        this._gerarAcessores();
        this._base_initialized = false; // para saber se o componente foi inicializado
        this._connected = false; // para saber se o componente foi montado
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
    
    /** gera dinamicamente os métodos getters e setters para os atributos */
    _gerarAcessores() {
        this.constructor.observedAttributes.forEach(attr => {
            // Verifica se a propriedade já não existe para não sobrescrever métodos manuais
            if (!(attr in this)) {
                Object.defineProperty(this, attr, {
                    get: () => this.getAttribute(attr),
                    set: (val) => this.setAttribute(attr, val),
                    configurable: true
                });
            }
        });
    }

    _init(){ // @abstract
        throw new Error("O método '_init()' deve ser implementado na classe filha.");
    }
    _attachEvents(){ // @abstract
        throw new Error("O método '_attachEvents()' deve ser implementado na classe filha.");
    }

    // Aplica os atributos do componente
    _applyAttributes() {
        // invoca as funções '_applyAttribute_...' para cada atributo'
        this.constructor.observedAttributes.forEach(item => {
            const nomeMetodo = `_applyAttribute_${item}`;
            // Verifica se a função existe antes de invocar
            if (typeof this[nomeMetodo] === 'function') {
                this[nomeMetodo]();
            } else {
                console.error(`Faltando o método ${nomeMetodo} no componente.`);
            }
        });
    }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** invocado automaticamente quando o componente é inserido no DOM ou movido para outro local. */
    connectedCallback() {
        if (this._connected) return; // guard
        this.innerHTML=''; // limpa o compoennte do zero
        this._init(); // *abstract* implementado na classe filha
        this._attachEvents(); // *abstract* implementado na classe filha
        this._applyAttributes(); // aplica atributos
        this._connected = true; // marca como motado
    }

    /** invocado automaticamente quando muda o valor de algum atributo observado ('observedAttributes'). */
    attributeChangedCallback(name, oldV, newV) {
        // 1. Só age se o valor realmente mudou e se o componente já foi montado
        if (oldV === newV || !this._connected) return;

        // 2. Constrói o nome do método (ex: _applyAttribute_valor)
        const nomeMetodo = `_applyAttribute_${name}`;
        
        // 3. Chama a função de aplicação específica
        if (typeof this[nomeMetodo] === 'function') {
            this[nomeMetodo]();
        }
    }
}