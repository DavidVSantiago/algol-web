class NomeComponente extends AlgolComponent {
    static get observedAttributes() {
        return []; // TODO - retornar os atributos aceitos pelo componente
    }
    constructor() {
        super();
    }
    
    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
       
    _init() {
        if (this._base_initialized) return;
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável
        
        // TODO - inicializar aqui os elementos internos do componente

        this._base_initialized = true; // marca como inicializado
    }

    _attachEvents() {
        // TODO - faça os ajustes dos eventos dos elementos internos do componente
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    // TODO - crie cada um dos métodos _applyAttribute_[...], um para cada atributo

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    // TODO - crie cada um dos métodos de eventos do componente
}