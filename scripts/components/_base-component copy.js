class BaseComponent extends HTMLElement {
    static _idCont = 0;
    // observedAttributes não é mais estritamente necessário para gatilhos, 
    // mas mantive caso você use para gerar os getters/setters automaticamente.
    static get observedAttributes() { return []; } 
    
    constructor() {
        super();
        
        this._elems = new Map(); // lista de elementos internos do componente
        this._gerarAcessores();
        this._ERRO = false;
        this._textoInterno = null;
        this._connected = false;
        this._base_initialized = false;
        
        // Configuração do Observer: o mais abrangente possível
        this._observerConfig = {
            attributes: true,       // Observa mudanças em atributos
            childList: true,        // Observa adição/remoção de filhos
            characterData: true,     // Observa mudanças de texto (innerText/textContent)
            subtree: true          // Não bserva filhos dos filhos (profundidade)
        };

        // define o observador de mudanças
        this._observer = new MutationObserver(this._mutationObserver.bind(this));
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
        if(mudancaRelevante) { console.log('reconstruindo...'); this.reconstroi();}
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

    _init() { throw new Error("_init deve ser implementado"); } // abstract
    _attachEvents() { throw new Error("_attachEvents deve ser implementado"); } // abstract

    _constroi(){
        // 1. PAUSA O OBSERVER
        // Isso é crucial! Se não desconectar, as alterações feitas pelo _init() (ex: innerHTML='')
        // dispararão o observer novamente, criando um loop infinito.
        this._base_initialized = false; // reseta o estado de inicialização
        this._ERRO = false; // reseta o estado de erro antes de reconstruir
        if(this._textoInterno===null){ // captura o texto interno apenas primeira construção
            this._textoInterno = this.textContent.trim();
        }
        try {
            if(!this._validaAtributos()) return; // se houver atributos inválidos, abandona com erro!
            
            this._init(); 
            this._attachEvents();
            this._applyAttributes(); // Aplica os valores atuais dos atributos

        } catch (error) {
            console.error("Erro ao reconstruir componente:", error);
        } finally { 
            // if (!this._ERRO) { // se não houve erro na reconstrução, religa o observer
                
            // }
        }
    }
    reconstroi() {
        console.log('reconstruindo...');
        this._observer.disconnect();

        this.innerHTML = ''; // Limpa o componente para garantir reconstrução do zero
        this.removeAttribute("style"); // limoa todos os estilos inline
        this._elems.clear(); // limpa a lista de componente
        _constroi();

        this._observer.observe(this, this._observerConfig);
    }
    reaplicaAtributos(){
        console.log('reestilizando...');
        this._observer.disconnect();

        this.removeAttribute("style");
        this._applyAttributes();

        this._observer.observe(this, this._observerConfig);

    }

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************

    connectedCallback() {
        if (this._connected) return;
        
        this._observer.disconnect();
        this._constroi(); // Realiza a primeira construção
        this._observer.observe(this, this._observerConfig);

        this._connected = true;
    }

    disconnectedCallback() {
        // Limpa o observer ao remover o elemento do DOM para evitar memory leaks
        this._observer.disconnect();
        this._connected = false;
    }

    // ****************************************************************************
    // Geração de Acessores e Atributos
    // ****************************************************************************

    _gerarAcessores() {
        this.constructor.observedAttributes.forEach(attr => {
            if (!(attr in this)) {
                Object.defineProperty(this, attr, {
                    get: () => this.getAttribute(attr),
                    set: (val) => this.setAttribute(attr, val),
                    configurable: true
                });
            }
        });
    }

    get textoInterno() {
        return this._textoInterno;
    }

    // Setter: invocado quando você faz: this.textoInterno = "novo valor"
    set textoInterno(valor) {
        if (valor !== this._textoInterno) {
            this._textoInterno = valor;
            
            // Opcional: Se o valor mudar manualmente via código, 
            // você pode querer disparar o rebuild.
            if (this._connected) {
                this.reconstroi();
            }
        }
    }

    _applyAttributes() {
        // this.removeAttribute("style"); // limoa todos os estilos inline
        this.constructor.observedAttributes.forEach(item => {
            const nomeMetodo = `_applyAttribute_${item}`;
            if (typeof this[nomeMetodo] === 'function') {
                this[nomeMetodo]();
            }else{
                console.error(`DEV MSG: está faltando o método ${nomeMetodo}()`);
            }
        });
    }

    // ****************************************************************************
    // Validações
    // ****************************************************************************

    _validaAtributos() {
        const observados = this.constructor.observedAttributes || [];
        const globaisPermitidos = ['id', 'class', 'style', 'tabindex', 'slot', 'hidden', 'title', 'lang', 'dir', 'accesskey', 'draggable', 'spellcheck'];
        const invalidos = [];
        Array.from(this.attributes).forEach(attr => {
            const nome = attr.name;
            if (observados.includes(nome)) return;
            if (globaisPermitidos.includes(nome)) return;
            if (nome.startsWith('data-') || nome.startsWith('aria-')) return;
            if (nome.startsWith('on')) return;
            invalidos.push(nome);
        });
        if (invalidos.length > 0) {
            this.innerHTML = this._montaMsgErroAtributos(invalidos, globaisPermitidos);
            this._ERRO = true;
            return false;
        }
        return true;
    }
    
    // ****************************************************************************
    // Mensagens de Erro
    // ****************************************************************************
    
    _montaMsgErroAtributos(listaInvalidos, listaGlobaisPermitidos) {
       return `
        <div style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed red; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:red; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Atributo: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                Os seguintes atributos não são reconhecidos:
                <strong><em>'${listaInvalidos.join(', ')}'</em></strong>.<br>Remova-os!
            </p>
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                Atributos padrão do componente: <em>[${this.constructor.observedAttributes.join(', ')}]</em>
            </p>
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                Outros atributos também aceitos: <em>[${listaGlobaisPermitidos.join(', ')}]</em>
            </p>
        </div>`;
    }
}