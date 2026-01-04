class NomeComponenete extends BaseComponent {
    static get observedAttributes() {
        return []; // passar lista de atributos observados
    }

    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    init() {
        if (this.base_initialized) return; // guard para evitar dupla criação
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        // implementar a criação do componente aqui

        this.base_initialized = true;
    }
    /** @override */
    attachEvents() {
        // eventos    
    }

    // ****************************************************************************
    // Métodos de atualização
    // ****************************************************************************
   
    // área para possível sobrescrita do método 'reconstroi'

    // ****************************************************************************
    // Ciclo de Vida de alterações do componente
    // ****************************************************************************

    /** @override */
    mudaFilhosCallback() {
        // decidir o que fazer quando o conteúdo interno do componente for alterado
    }
    /** @override */
    mudaTextoCallback() {
        // decidir o que fazer quando o texto interno do componente for alterado
    }
    /** @override */
    mudaAtributosCallback(nomeAtributo, valorAntigo) {
        // decidir o que fazer quando algum atributo for alterado
    }
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // área para métodos utilitários do componente

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    // implementar um método 'aplicaAtributo_...' para cada atributo observado

    // ****************************************************************************
    // Métodos dos eventos espcíficos deste componente
    // ****************************************************************************

    // implementar os métodos para adicionar eventos específicos deste componente

    // ****************************************************************************
    // Mensagens de Erro
    // ****************************************************************************
    
    // implementar os métodos que montam as mensagens de erro para conteúdo inválido
}