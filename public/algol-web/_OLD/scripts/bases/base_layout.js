    class BaseLayout extends HTMLElement {
        static get observedAttributes() { return []; } 
        
        constructor() {
            super();
            this.elems = {}; // cache de elementos internos do componente
            this.inicializado = false;
            this._observerEstrutura = null; // observer das mudanças internas 
        }

        // ****************************************************************************
        // Métodos de construção do componente
        // ****************************************************************************

        /** @abstract */
        postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

        // ****************************************************************************
        // Ciclo de Vida de HTMLElement
        // ****************************************************************************

        /** @override */
        connectedCallback() {
            this._ativarMonitoramentoDeConteudo();
            if (this.inicializado) return; // se já foi construído, não faz nada!

            this._desativarMonitoramentoDeConteudo();
            this.postConfig(); // invoca o metodo abstrato de pós-configuração

            // Aplica valores iniciais dos atributos
            for(const attr of this.constructor.observedAttributes){
                const val = this.getAttribute(attr);
                if (val !== null) this.attributeChangedCallback(attr, null, val);
            };

            this._ativarMonitoramentoDeConteudo();
            this.inicializado = true;
        }
        
        /** @override */
        disconnectedCallback() {
            this._desativarMonitoramentoDeConteudo();
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

            // 2. Tenta pegar a configuração do mapa de atributos da classe filha
            const map = this.constructor.ATTR_MAP;
            if (!map || !map[name]) return; // se não existir mapa ou atributo, abandona 

            const config = map[name]; // obtem o atributo
            
            // Normaliza a configuração (para suportar string simples ou objeto)        
            const isObj = typeof config === 'object';
            const cssVar = isObj ? config.var : config;
            const prefix = (isObj && config.prefix) ? config.prefix : '';
            const suffix = (isObj && config.suffix) ? config.suffix : '';

            // Aplica a variável CSS diretamente no elemento (inline style)
            this.style.setProperty(cssVar, prefix + newValue + suffix);
        }
        
        // ****************************************************************************
        // Monitoramento de Estrutura (MutationObserver)
        // ****************************************************************************

        _ativarMonitoramentoDeConteudo() {
            if (this._observerEstrutura) return; // Já ativo
            
            const callback = (mutationsList) => {
                // Dispara o evento personalizado planejado
                this.dispatchEvent(new CustomEvent('algol-light-dom-update', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        origin: this,
                        mutations: mutationsList,
                    },
                }));
            };
            
            this._observerEstrutura = new MutationObserver(callback);
            this._observerEstrutura.observe(this, { childList: true, subtree: false, characterData: false});
        }
        _desativarMonitoramentoDeConteudo() {
            if (this._observerEstrutura) {
                this._observerEstrutura.disconnect();
                this._observerEstrutura = null;
            }
        }

        // ****************************************************************************
        // Helper Estático para Injeção de CSS do layout no Head da página
        // ****************************************************************************
        static _injectStyleOnHead(id, cssContent) {
            if (document.getElementById(id)) return; // Já existe, ignora

            const style = document.createElement('style');
            style.id = id;
            style.textContent = cssContent;
            document.head.appendChild(style);
        }
    }