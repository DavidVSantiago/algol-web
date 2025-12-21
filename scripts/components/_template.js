class ClassName extends AlgolComponent {
    
    static _innerText = ''; // para armazenar o possivel texto contido dentro da tag

    constructor() {
        super(['','','']); // TODO passe os atributos aceitos pelo componente
        
        BtnBase._innerText = this.textContent; // captura o texto dentro da tag
        // TODO inicialize aqui as referências para os elementos do componente
        this._base_initialized = false; // para saber se o componente foi inicializado
    }
    
    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
       
    /** Faz a construção interna do componente */
    _init() {
        if (this._base_initialized) return;
        
        // TODO crie a estrutura do componente e a adicione com this.add(..)

        this._base_initialized = true;
    }

    _attachEvents() {
        if (!true) return; // TODO implemente guards para não adicionar eventos a compoenntes vazios
        
        // TODO implemente os eventos dos componentes
    }

    _detachEvents() {
        if (!true) return; // TODO implemente guards para não adicionar eventos a compoenntes vazios
        
        // TODO remova os eventos com removeEventListener
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    // TODO implemente um método para cada atributo aceito pelo componente, com  o prefixo '_applyAttribute_[atributo]'
    
}