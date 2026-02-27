/** Classe base de uma página SPA */
class PageBase {

    constructor(container, params = {}) {
        this.container = container; // container alvo da renderização
        this.params = params;
    }

    /** @abstract */
    render() {
        throw "render() não implementado";
    }
    
    /** @abstract */
    async loadData() {
        throw "loadData() não implementado";
    }

    // Método utilitário para injetar CSS dinâmico
    injectStyle(cssString) {
        const style = document.createElement('style');
        style.id = 'dynamic-page-style'; // Mesmo ID que o roteador vai procurar para apagar
        style.textContent = cssString;
        document.head.appendChild(style);
    }
}