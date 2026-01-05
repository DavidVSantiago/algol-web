class BaseComponent extends HTMLElement {
    static _idCont = 0;
    static get observedAttributes() { return []; } 
    
    constructor() {
        super();
        
        this.elems = {}; // cache de elementos internos do componente
        this.inicializado = false;

        this._gerarAcessores();
        
        // usa shadow DOM, que isola o componente do restante da página
        this.root = this.attachShadow({
            mode: 'open',
            delegatesFocus: true, // permite que o foco seja delegado para dentro do shadow DOM
         }); 
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @abstract */
    render() { throw new Error("Método 'render' deve ser implementado."); }
    /** @abstract */
    attachEvents() { throw new Error("Método 'attachEvents' deve ser implementado."); }
    /** @abstract */
    postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

    configSlot(){
        const slot = this.root.querySelector('slot');
        if(slot) slot.style.display = 'none'; // esconde o slot por padrão
        else throw new Error("O seu método render() deve incluir um <slot> para o conteúdo interno do componente.");

        this.postConfig(); // invoca o metodo abstrato de pós-configuração
    }

    // ****************************************************************************
    // Ciclo de Vida de HTMLElement
    // ****************************************************************************

    /** @override */
    connectedCallback() {
        if (this.inicializado) return; // se já foi construído, não faz nada!
        
        this.render(); // Realiza a construção, uma única vez        
        this.configSlot(); // configura o slot e faz configuraçẽos posteriores

        // Aplica valores iniciais dos atributos
        this.constructor.observedAttributes.forEach(attr => {
            const val = this.getAttribute(attr);
            if (val !== null) this.attributeChangedCallback(attr, null, val);
        });
        this.attachEvents();
        this.inicializado = true;
    }

    /** @override */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // se a mudança foi no atributo valor, dispara um evento a ser usado nos eventos estilizados do componente
        // if (nomeAtributo === 'valor') this.dispatchEvent(new CustomEvent('mudancaValor',{bubbles: false,detail: {antigo: oldValue, novo: newValue}}));
        
        // Procura método específico: 'update_rotulo', 'update_valor', etc.
        const updateMethod = `update_${name}`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod](newValue);
        }else{
            console.error(`DEV MSG: está faltando o método ${updateMethod}()`);
        }
    }

    // ****************************************************************************
    // Geração de Acessores e Atributos
    // ****************************************************************************

    _gerarAcessores() {
        for (const attr of this.constructor.observedAttributes) {
            if (!(attr in this)) {
                Object.defineProperty(this, attr, {
                    get: () => this.getAttribute(attr),
                    set: (val) => this.setAttribute(attr, val),
                    configurable: true
                });
            }
        };
    }

    // ****************************************************************************
    // Métodos dos eventos padrão de um componente
    // ****************************************************************************

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
    
}