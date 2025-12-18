class AlgolLayout extends HTMLElement {
    static get observedAttributes() {
        return ['cols', 'gap', 'align', 'position', 'width', 'height'];
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
        this.classList.add('algol_section-bubble');

        // Inicializa o Observer para detectar novos itens inseridos via JS
        this._initObserver();
        
        this._base_initialized = true;
    }

    _initObserver() {
        this._observer = new MutationObserver(() => {
            this._updateItemsList();
        });
        
        this._observer.observe(this, { childList: true });
    }

    /** Atualiza a lista de referências e aplica estilos aos itens */
    _updateItemsList() {
        // Busca apenas filhos diretos que sejam algol-grid-item
        this._items = Array.from(this.querySelectorAll(':scope > algol-grid-item'));
        
        this._items.forEach(item => {
            // Define o display grid para cada item como solicitado
            item.style.display = 'grid';
            item.style.boxSizing = 'border-box';
        });

        // Re-aplica a posição para os novos itens encontrados
        this._applyAttribute_position();
    }

    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************
    
    _applyAttributes() {
        this._applyAttribute_cols();
        this._applyAttribute_gap();
        this._applyAttribute_align();
        this._applyAttribute_dims();
        this._updateItemsList(); // Isso já chama o _applyAttribute_position()
    }

    _applyAttribute_cols() {
        const cols = this.getAttribute('cols') || '1fr';
        this.style.gridTemplateColumns = cols;
    }

    _applyAttribute_gap() {
        const gap = this.getAttribute('gap');
        if (gap) this.style.gap = gap;
        else this.style.removeProperty('gap');
    }

    _applyAttribute_align() {
        const align = this.getAttribute('align');
        if (align) this.style.alignItems = align;
        else this.style.removeProperty('align-items');
    }

    _applyAttribute_position() {
        const positions = ['left', 'center', 'right', 'all'];
        const pos = this.getAttribute('position');

        // 1. Aplica ao próprio Layout
        this.classList.remove(...positions.map(p => `algol_position-${p}`));
        if (positions.includes(pos)) {
            this.classList.add(`algol_position-${pos}`);
        }

        // 2. Aplica a cada item dentro do array de refs
        this._items.forEach(item => {
            item.classList.remove(...positions.map(p => `algol_position-${p}`));
            if (positions.includes(pos)) {
                item.classList.add(`algol_position-${pos}`);
            }
        });
    }
    
    _applyAttribute_dims() {
        const w = this.getAttribute('width');
        const h = this.getAttribute('height');
        if(w) this.style.width = w;
        if(h) this.style.height = h;
    }

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    connectedCallback() {
        if (this._connected) return;
        this._init();
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
            case 'cols': this._applyAttribute_cols(); break;
            case 'gap': this._applyAttribute_gap(); break;
            case 'align': this._applyAttribute_align(); break;
            case 'position': this._applyAttribute_position(); break;
            case 'width': 
            case 'height': this._applyAttribute_dims(); break;
        }
    }
}

// Registro apenas do Layout
if (!customElements.get('algol-layout')) {
    customElements.define('algol-layout', AlgolLayout);
}