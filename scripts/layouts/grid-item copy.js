class GridItem extends BaseLayout {
    static get observedAttributes() {return ['expandecoluna','expandelinha'];}

    constructor() {
        super();
    }

    _init() {
        if (this._base_initialized) return;

        this.style.display = 'grid';
        this.style.boxSizing = 'border-box';
        this._initObserver(); // Inicializa o Observer para detectar novos itens inseridos via JS
        
        this._base_initialized = true;
    }

    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************

    _applyAttribute_expandecoluna() {
        const exp = this.getAttribute('expandecoluna');
        if (exp){ // se existe a propiedade 'expandecoluna'
            this.style.gridColumnEnd = 'span ' + exp;
        } else this.style.removeProperty('grid-column-end');
    }

    _applyAttribute_expandelinha() {
        const exp = this.getAttribute('expandelinha');
        if (exp){ // se existe a propiedade 'expandelinha'
            this.style.gridRowEnd = 'span ' + exp;
        } else this.style.removeProperty('grid-row-end');
    }

    // ****************************************************************************
    // Métodos de suporte
    // ****************************************************************************

    _verificaFilhos(filhos){

    }
}