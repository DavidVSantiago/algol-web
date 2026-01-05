class GridLayout extends BaseLayout {
    static get observedAttributes() {return ['colunas', 'gap', 'posicaoh', 'posicaov'];}

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
        const gridItems = this.elems.slot.assignedElements(); // pega um array dos elementos passados para o slot (light DOM)

        // limpeza seletiva do shadow DOM, removendo apenas os nós que não são <slot> ou <style>
        for(const node of this.root.children){
            const tagName = node.tagName?.toLowerCase();
            if (tagName !== 'slot' && tagName !== 'style') {
                this.root.removeChild(node);
            }
        };

        // Clona as options do usuário para dentro do shadow DOM
        for(const gridItem of gridItems){
            if (gridItem.tagName.toLowerCase() === 'algol-grid-item') { // garante que é uma tag <grid-item>
                this.root.appendChild(gridItem.cloneNode(true));
            }else{
                console.warn("Elemento ignorado no <algol-grid-layout>: ", gridItem);
            }
        };
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_colunas() {
        const colunas = this.getAttribute('colunas') || '1fr';
        this.style.gridTemplateColumns = colunas;
    }

    update_gap() {
        const gap = this.getAttribute('gap');
        if (gap) this.style.gap = gap;
        else this.style.removeProperty('gap');
    }

    update_posicaoh() {
        let filhos = Array.from(this.children); // obtém a lista de filhos
        const pos = this.getAttribute('posicaoh');
        if (pos){ // se existe a propiedade 'posicaoh'
            const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
            let alignValue = 'stretch'; // total
            this.style.justifyItems = alignValue;
            switch(pos){
                case posValues[0]: alignValue = 'start'; break;
                case posValues[1]: alignValue = 'end'; break;
                case posValues[2]: alignValue = 'center'; break;
            }
            for (let i = 0; i < filhos.length; i++) {
                const filho = filhos[i];
                if(filho.tagName.toLowerCase()!=='algol-grid-item') continue; // ignora elementos que não são algol-grid-item
                filho.style.display = 'grid';
                filho.style.justifyItems = alignValue;
            }
        }else{ // se não existe a propriedade 'posicaoh'
            for (let i = 0; i < filhos.length; i++) {
                const filho = filhos[i];
                if(filho.tagName.toLowerCase()!=='algol-grid-item') continue; // ignora elementos que não são algol-grid-item
                filho.style.display = 'grid';
                filho.style.justifyItems = 'center';

            }
        }
    }

    update_posicaov() {
        let filhos = Array.from(this.children); // obtém a lista de filhos
        const pos = this.getAttribute('posicaov');
        if (pos){ // se existe a propiedade 'posicaov'
            const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaov'
            let alignValue = 'stretch'; // total
            this.style.alignItems = alignValue;
            switch(pos){
                case posValues[0]: alignValue = 'start'; break;
                case posValues[1]: alignValue = 'end'; break;
                case posValues[2]: alignValue = 'center'; break;
            }
            for (let i = 0; i < filhos.length; i++) {
                const filho = filhos[i];
                if(filho.tagName.toLowerCase()!=='algol-grid-item') continue; // ignora elementos que não são algol-grid-item
                filho.style.display = 'grid';
                filho.style.alignItems = alignValue;
            }
        }else{ // se não existe a propriedade 'posicaov'
            for (let i = 0; i < filhos.length; i++) {
                const filho = filhos[i];
                if(filho.tagName.toLowerCase()!=='algol-grid-item') continue; // ignora elementos que não são algol-grid-item
                filho.style.display = 'grid';
                filho.style.alignItems = 'center';

            }
        }
    }
}