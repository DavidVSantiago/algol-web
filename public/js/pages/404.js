
class Page404 extends PageBase{

    constructor(container, params) {
        super(container, params);
    }

    /** @override */
    render() {
        this.container.innerHTML = /* html */ `
            <h1>404 - Página não encontrada</h1>
        `;
    }

    /** @override */
    async loadData() {
        // nada para carregar
    }
}