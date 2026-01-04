class BaseComponent extends HTMLElement {
    static _idCont = 0;
    static get observedAttributes() { return []; } 
    
    constructor() {
        super();
        
        this.elems = new Map(); // lista de elementos internos do componente
        this._gerarAcessores();
        this._ERRO = false;
        this._textoInterno = null;
        this._connected = false;
        this.base_initialized = false;
        
        // Configuração do Observer: o mais abrangente possível
        this._observerConfig = {
            attributes: true,       // Observa mudanças em atributos
            childList: true,        // Observa adição/remoção de filhos
            characterData: true,    // Observa mudanças de texto (innerText/textContent)
            subtree: true,          // Não bserva filhos dos filhos (profundidade)
            attributeOldValue: true
        };

        // define o observador de mudanças
        this._observer = new MutationObserver(this.mutationObserver.bind(this));
    }

    // observador de mudanças
    mutationObserver (mutations) {
        for (const mutation of mutations) { // percorre todas as mutações
            this._observer.disconnect(); // disabilita o observer temporariamente

            if (mutation.type === 'childList')  this.mudaFilhosCallback();
            else if (mutation.type === 'attributes') this.mudaAtributosCallback(mutation.attributeName, mutation.oldValue);
            else if (mutation.type === 'characterData') this.mudaTextoCallback();

            this._observer.observe(this, this._observerConfig);// reabilita o observer
        }
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @abstract */
    init() { throw new Error("init deve ser implementado"); }
    /** @abstract */
    attachEvents() { throw new Error("attachEvents deve ser implementado"); }
    
    constroi(){
        // 1. PAUSA O OBSERVER
        // Isso é crucial! Se não desconectar, as alterações feitas pelo init() (ex: innerHTML='')
        // dispararão o observer novamente, criando um loop infinito.
        this.base_initialized = false; // reseta o estado de inicialização
        this._ERRO = false; // reseta o estado de erro antes de reconstruir
        if(this._textoInterno===null){ // captura o texto interno apenas primeira construção
            this._textoInterno = this.textContent.trim();
        }
        try {
            if(!this._validaAtributos()) return; // se houver atributos inválidos, abandona com erro!
            this.init(); 
            this.attachEvents();
            this.aplicaAtributos(); // Aplica os valores atuais dos atributos

        } catch (error) {
            console.error("Erro ao reconstruir componente:", error);
        } finally { 
            // if (!this._ERRO) { // se não houve erro na reconstrução, religa o observer
                
            // }
        }
    }

    // ****************************************************************************
    // Métodos de atualização
    // ****************************************************************************

    reconstroi() {
        console.log('reconstruindo...');
        
        this.innerHTML = ''; // Limpa o componente para garantir reconstrução do zero
        this.removeAttribute("style"); // limoa todos os estilos inline
        this.elems.clear(); // limpa a lista de componente
        this.constroi();
    }
    reaplicaAtributos(){
        console.log('reestilizando...');

        this.removeAttribute("style");
        this.aplicaAtributos();
    }

    // ****************************************************************************
    // Ciclo de Vida de alterações do componente
    // ****************************************************************************

    /** @abstract */
    mudaFilhosCallback() { throw new Error("mudaFilhosCallback() deve ser implementado"); }
    /** @abstract */
    mudaTextoCallback() { throw new Error("mudaTextoCallback() deve ser implementado"); }
    /** @abstract */
    mudaAtributosCallback(nomeAtributo, valorAntigo) {throw new Error("mudaAtributosCallback() deve ser implementado");}

    // ****************************************************************************
    // Ciclo de Vida de HTMLElement
    // ****************************************************************************

    /** @override */
    connectedCallback() {
        this._observer.disconnect();

        // se já havia sido conectado antes...
        if (this._connected) this.reconstroi(); // reconstrói o componente
        else this.constroi(); // Realiza a primeira construção
        
        this._observer.observe(this, this._observerConfig);

        this._connected = true;
    }
    /** @override */
    disconnectedCallback() {
        // Limpa o observer ao remover o elemento do DOM para evitar memory leaks
        this._observer.disconnect();
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
    aplicaAtributos() {
        this.constructor.observedAttributes.forEach(item => {
            const nomeMetodo = `aplicaAtributo_${item}`;
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
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                -- Recarregue a página para restaurar o conteúdo original! --
            </p>
        </div>`;
    }
}