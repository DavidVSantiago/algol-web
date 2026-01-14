class BaseComponent extends HTMLElement {
    static formAssociated = true; // Habilita participação em formulários nativos (<form>)

    static _idCont = 0;
    static get observedAttributes() { return []; } 
    
    constructor() {
        
        super();
        this.elems = {}; // cache de elementos internos do componente
        this.inicializado = false;

        this._internals = this.attachInternals(); // API de Formulários, para notifica ao <form>
        this._gerarAcessoresAutomaticos(); // Gera getters/setters baseados nos mapas implementados nas classes filhas
        
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
        if(!slot) throw new Error("O seu método render() deve incluir um <slot> para o conteúdo interno do componente.");

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
        this._registerBaseEvents();
        this.inicializado = true;
    }

    /** @override */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // 1. Prioridade: Mapa de Propriedades (Lógica Funcional)
        const propMap = this.constructor.PROP_MAP;
        if (propMap && propMap[name]) {
            const method = propMap[name];
            if (typeof this[method] === 'function') {
                this[method](newValue);
                return;
            }
        }

        // 2. Segunda opção: Mapa de Atributos (Lógica de Estilo - CSS)
        const attrMap = this.constructor.ATTR_MAP;
        if (attrMap && attrMap[name]) {
            const config = attrMap[name];
            const cssVar = typeof config === 'string' ? config : config.var;
            this.style.setProperty(cssVar, newValue);
            return;
        }
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************
    
    // Gera getters e setters para não precisarmos escrever manualmente
    _gerarAcessoresAutomaticos() {
        const props = Object.keys(this.constructor.PROP_MAP || {});
        const attrs = Object.keys(this.constructor.ATTR_MAP || {});
        const all = [...new Set([...props, ...attrs])];

        all.forEach(attr => {
            if (attr in this) return; // evita recriação
            Object.defineProperty(this, attr, {
                get: () => this.getAttribute(attr),
                set: (val) => { if (val === null || val === false) this.removeAttribute(attr); else this.setAttribute(attr, val);}
            });
        });
    }

    // ****************************************************************************
    // Registro dos eventos padrão de um componente
    // ****************************************************************************

    _registerBaseEvents(){
        // registra o evento de click
        this.addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de clique
            this.dispatchEvent(new CustomEvent('algol-click', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    mouse: {
                        x: e.clientX, y: e.clientY,
                        offsetX: e.offsetX, offsetY: e.offsetY
                    }
                }
            }));
        });
        // registra evento de foco
        this.addEventListener('focus', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de foco
            this.dispatchEvent(new CustomEvent('algol-focus', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });
        // registra evento de blur
        this.addEventListener('blur', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de blur
            this.dispatchEvent(new CustomEvent('algol-blur', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });
        // registra evento de mouseenter
        this.addEventListener('mouseenter', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de mouseenter
            this.dispatchEvent(new CustomEvent('algol-mouseenter', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });
        // registra evento de mouseleave
        this.addEventListener('mouseleave', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de mouseleave
            this.dispatchEvent(new CustomEvent('algol-mouseleave', { bubbles: true,composed: true,
                detail: {origin: this,}
            }));
        });
        // registra evento de mousemove
        this.addEventListener('mousemove', (e) => {
            if (this.hasAttribute('disabled')) {e.stopImmediatePropagation();return;} // interrompe o evento se o componente estiver desabilitado
            // dispara o evento estilizado de mousemove
            this.dispatchEvent(new CustomEvent('algol-mousemove', { bubbles: true,composed: true,
                detail: {
                    origin: this,
                    mouse: {
                        x: e.clientX, y: e.clientY,
                        offsetX: e.offsetX, offsetY: e.offsetY
                    }
                }
            }));
        });

    }
}