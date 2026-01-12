class GridLayout extends BaseLayout {
    // Mapa de atributos válidos (chaves) e suas respectivas variáveis CSS (valores), usadas dinamicamente
    static get ATTR_MAP() {
        return {
            'cols':      '--grid-layout-cols',
            'colsbreak': '--grid-layout-cols-break',
            'gap':       '--grid-layout-gap',
            'gapbreak':  '--grid-layout-gap-break',
            'posh':      '--grid-layout-posh',
            'poshbreak': '--grid-layout-posh-break',
            'posv':      '--grid-layout-posv',
            'posvbreak': '--grid-layout-posv-break'
        };
    }
    static get observedAttributes() {return Object.keys(GridLayout.ATTR_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'grid';
        // por padrão, os elementos da grade são alinhados ao centro
        if (!this.style.getPropertyValue('--grid-layout-posh')) this.style.setProperty('--grid-layout-posh', 'center');
        if (!this.style.getPropertyValue('--grid-layout-posv')) this.style.setProperty('--grid-layout-posv', 'center');
    }

    // ****************************************************************************
    // Injeção de estilo CSS
    // ****************************************************************************
    
    static injectStyles() {
        const css = `
            algol-grid-layout{
                grid-template-columns: var(--grid-layout-cols, none);
                gap: var(--grid-layout-gap, none);
                justify-items: var(--grid-layout-posh, none);
                align-items: var(--grid-layout-posv, none);
            }
                
            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-grid-layout[colsbreak] {grid-template-columns: var(--grid-layout-cols-break) !important;}
                algol-grid-layout[gapbreak] {gap: var(--grid-layout-gap-break) !important;}
                algol-grid-layout[poshbreak] {justify-items: var(--grid-layout-posh-break) !important;}
                algol-grid-layout[posvbreak] {align-items: var(--grid-layout-posv-break) !important;}
            }
        `;
        BaseLayout._injectStyleOnHead('algol-grid-layout-style', css);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

customElements.define('algol-grid-layout', GridLayout); // Registra o componente customizado
GridLayout.injectStyles(); // injeta CSS desse componente