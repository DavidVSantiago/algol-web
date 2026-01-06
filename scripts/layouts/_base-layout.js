class BaseLayout extends HTMLElement {
    static get observedAttributes() { return []; } 
    
    constructor() {
        super();
        
        this.elems = {}; // cache de elementos internos do componente
        this.inicializado = false;
        this._gerarAcessores();
        
        // usa light DOM para permitir estilos herdados e manipulação direta dos elementos filhos
        this.root = this; 
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @abstract */
    postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

    // ****************************************************************************
    // Monitoramento de Estrutura (MutationObserver)
    // ****************************************************************************

    _ativarMonitoramentoDeConteudo() {
        const config = { childList: true, subtree: false, characterData: false};

        const callback = (mutationsList) => {
            // Dispara o evento personalizado planejado
            this.dispatchEvent(new CustomEvent('muda-conteudo', {
                detail: {
                    mutations: mutationsList,
                },
                bubbles: true,
                composed: true
            }));
        };

        this._observerEstrutura = new MutationObserver(callback);
        this._observerEstrutura.observe(this, config);
    }
    _desativarMonitoramentoDeConteudo() {
        if (this._observerEstrutura) {
            this._observerEstrutura.disconnect();
            this._observerEstrutura = null;
        }
    }

    // ****************************************************************************
    // Ciclo de Vida de HTMLElement
    // ****************************************************************************

    /** @override */
    connectedCallback() {
        this._ativarMonitoramentoDeConteudo();
        if (this.inicializado) return; // se já foi construído, não faz nada!

        this._desativarMonitoramentoDeConteudo();
        this.postConfig(); // invoca o metodo abstrato de pós-configuração
        this._ativarMonitoramentoDeConteudo();


        // Aplica valores iniciais dos atributos
        for(const attr of this.constructor.observedAttributes){
            const val = this.getAttribute(attr);
            if (val !== null) this.attributeChangedCallback(attr, null, val);
        };
        this.inicializado = true;
    }
    
    /** @override */
    disconnectedCallback() {
        // Importante: Para o observer quando o componente sai da página
        this._desativarMonitoramentoDeConteudo();
    }

    /** @override */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
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
    // Eventos de Grid Layout
    // ****************************************************************************

    addEventoMudaConteudo(callback) {
        // Armazenamos o wrapper em uma propriedade da classe
        this._mudaConteudoWrapper = (e) => {
            if (this.hasAttribute('disabled')) { e.preventDefault(); return; }
            const origem = e.currentTarget;
            const alvo = e.target;
            const mutations = e.detail.mutations;
            callback(origem, alvo, mutations);
        };
        this.addEventListener('muda-conteudo', this._mudaConteudoWrapper);
    }
    removeEventoMudaConteudo() {
        if (this._mudaConteudoWrapper) {
            this.removeEventListener('muda-conteudo', this._mudaConteudoWrapper);
            this._mudaConteudoWrapper = null;
        }
    }
}