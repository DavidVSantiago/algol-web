class GridItem extends BaseLayout {
    static get observedAttributes() {return ['expandecoluna','expandelinha'];}

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    render() {
        const css = `
            <style>
                
            </style>
        `;

        const html = `
            <slot></slot>        
        `;
        
        this.root.innerHTML = css + html;
    }

    /** @override */
    postConfig(){
        this.elems.slot = this.root.querySelector('slot');
    }
    /** @override */
    attachEvents() {        
        // Quando o usuário adiciona/remove <option> no HTML, isso dispara.
        this.elems.slot.addEventListener('slotchange', () => {
            this._sincronizarGridItens();
        });
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // Copia os elementos do Slot (light DOM) para o shadow DOM
    _sincronizarGridItens() {
        const elems = this.elems.slot.assignedElements(); // pega um array dos elementos passados para o slot (light DOM)

        // limpeza seletiva do shadow DOM, removendo apenas os nós que não são <slot> ou <style>
        for(const node of this.root.children){ // percorre os filhos do shadow DOM
            const tagName = node.tagName?.toLowerCase();
            if (tagName !== 'slot' && tagName !== 'style') {
                this.root.removeChild(node); // remove do shadow DOM
            }
        };

        // Clona as options do usuário para dentro do shadow DOM
        for(const elem of elems){ // percorre os elementos do light DOM
            this.root.appendChild(elem.cloneNode(true)); // adiciona ao shadow DOM
        };
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_expandecoluna() {
        const exp = this.getAttribute('expandecoluna');
        if (exp){ // se existe a propiedade 'expandecoluna'
            this.style.gridColumnEnd = 'span ' + exp;
        } else this.style.removeProperty('grid-column-end');
    }
    update_expandelinha() {
        const exp = this.getAttribute('expandelinha');
        if (exp){ // se existe a propiedade 'expandelinha'
            this.style.gridRowEnd = 'span ' + exp;
        } else this.style.removeProperty('grid-row-end');
    }
}