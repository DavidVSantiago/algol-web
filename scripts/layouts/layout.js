class AlgolLayout extends HTMLElement {
    static get observedAttributes() {
        return ['colunas', 'gap', 'posicao'];
    }

    constructor() {
        super();
        this._items = []; // Array com refs para os algol-grid-item
        this._observer = null;
        
        this._base_initialized = false;
        this._connected = false;

        const propsToUpgrade = this.constructor.observedAttributes || [];
        propsToUpgrade.forEach(p => this._upgradeProperty(p));
    }

    _upgradeProperty(prop) {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    _init() {
        if (this._base_initialized) return;

        this.style.display = 'grid';
        this.style.boxSizing = 'border-box';

        // Inicializa o Observer para detectar novos itens inseridos via JS
        this._initObserver();
        
        this._base_initialized = true;
    }

    _initObserver() {
        this._observer = new MutationObserver(() => {
            mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Verifica se a mutação foi causada por uma substituição de elemento
                if (mutation.addedNodes.length > 0 && mutation.removedNodes.length > 0) {
                    // Não faz nada se a mutação foi causada por uma substituição de elemento
                    return;
                }
                this._updateItemsList();
            }
        });
        });
        
        this._observer.observe(this, { childList: true });
    }

    /** Atualiza a lista de referências e aplica estilos aos itens */
    _updateItemsList() {
        // Busca apenas filhos diretos que sejam algol-grid-item
        this._items = Array.from(this.children);
        
        this._items.forEach(item => {
            // Verifica se o item não é um algol-grid-item
            if (item.tagName.toLowerCase() !== 'algol-grid-item') {
                // Cria um novo elemento span com o texto "ERRO!"
                const errorSpan = document.createElement('span');
                errorSpan.style.color= 'white';
                errorSpan.style.backgroundColor= 'red';

                errorSpan.textContent = `ERRO! coloque o elemento ${item.outerHTML} dentro de um <algol-grid-item>`;

                // Substitui o item pelo novo span
                this.replaceChild(errorSpan, item);

                // Atualiza a lista de itens para incluir o novo span
                this._items = Array.from(this.children);
            }
            // Define o display grid para cada item como solicitado
            item.style.display = 'grid';
            item.style.boxSizing = 'border-box';
        });

        this._applyAttributes();
    }
    
    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************
    
    _applyAttributes() {
        this._applyAttribute_colunas();
        this._applyAttribute_gap();
        this._applyAttribute_posicao();
    }

    _applyAttribute_colunas() {
        const colunas = this.getAttribute('colunas') || '1fr';
        this.style.gridTemplateColumns = colunas;
    }

    _applyAttribute_gap() {
        const gap = this.getAttribute('gap');
        if (gap) this.style.gap = gap;
        else this.style.removeProperty('gap');
    }

    _applyAttribute_posicao() {
        const pos = this.getAttribute('posicao');
        if (pos){ // se existe a propiedade 'posicao'
            const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicao'
            let alignValue = 'stretch'; // total
            this.style.justifyItems = alignValue;
            switch(pos){
                case posValues[0]: alignValue = 'start'; break;
                case posValues[1]: alignValue = 'end'; break;
                case posValues[2]: alignValue = 'center'; break;
            }
            this._items.forEach(item => {
                item.style.justifyItems = alignValue;
            });
        }else{ // se não existe a propriedade 'posicao'
            this._items.forEach(item => {
                item.style.justifyItems = 'start';
            });
        }
    }

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    connectedCallback() {
        if (this._connected) return;
        this._init();
        this._updateItemsList();
        this._applyAttributes();
        this._connected = true;
    }

    disconnectedCallback() {
        if (this._observer) this._observer.disconnect();
        this._connected = false;
    }

    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (!this._connected) return;
        
        switch(name) {
            case 'colunas': this._applyAttribute_colunas(); break;
            case 'gap': this._applyAttribute_gap(); break;
            case 'posicao': this._applyAttribute_posicao(); break;
        }
    }
}