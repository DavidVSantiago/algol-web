class GridItem extends BaseLayout {
    // Mapa de atributos válidos (chaves) e suas respectivas variáveis CSS (valores), usadas dinamicamente
    static get ATTR_MAP() {
        return {
            // Casos com prefixo 'span '
            'colspan':      { var: '--grid-item-colspan',       prefix: 'span ' },
            'colspanbreak': { var: '--grid-item-colspan-break', prefix: 'span ' },
            'rowspan':      { var: '--grid-item-rowspan',       prefix: 'span ' },
            'rowspanbreak': { var: '--grid-item-rowspan-break', prefix: 'span ' },
            
            // Casos simples
            'posh':      '--grid-item-posh',
            'poshbreak': '--grid-item-posh-break',
            'posv':      '--grid-item-posv',
            'posvbreak': '--grid-item-posv-break'
        };
    }
    static get observedAttributes() {return Object.keys(GridItem.ATTR_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'grid';
        this.style.gap = '0';
    }

    // ****************************************************************************
    // Injeção de estilo CSS
    // ****************************************************************************
    
    static injectStyles() {
        if (document.getElementById('algol-grid-item-style')) return; // Já injetado

        const style = document.createElement('style');
        style.id = 'algol-grid-item-style';
        style.textContent = `
            algol-grid-item[colspan]{grid-column-end: var(--grid-item-colspan);}
            algol-grid-item[rowspan]{grid-row-end: var(--grid-item-rowspan);}
            algol-grid-item[posh]{justify-self: var(--grid-item-posh);}
            algol-grid-item[posv]{align-self: var(--grid-item-posv);}

            @media (max-width: ${mobileBreakpoint}) {
                algol-grid-item[colspanbreak] {grid-column-end: var(--grid-item-colspan-break) !important;}
                algol-grid-item[rowspanbreak] {grid-row-end: var(--grid-item-rowspan-break) !important;}
                algol-grid-item[poshbreak] {justify-self: var(--grid-item-posh-break) !important;}
                algol-grid-item[posvbreak] {align-self: var(--grid-item-posv-break) !important;}
            }
        `;
        document.head.appendChild(style);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

customElements.define('algol-grid-item', GridItem); // Registra o componente customizado
GridItem.injectStyles(); // injeta CSS desse componente