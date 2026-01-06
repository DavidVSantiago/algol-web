class GridLayout extends BaseLayout {
    static get observedAttributes() {return ['colunas', 'colunasbreak', 'gap', 'gapbreak', 'posicaoh', 'posicaohbreak', 'posicaov','posicaovbreak'];}

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'grid';
        
        // por padrão, os elementos da grade são alinhados ao centro
        this.style.setProperty('--grid-layout-posicaoh', 'center');
        this.style.setProperty('--grid-layout-posicaov', 'center');
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_colunas(val) {
        // this.style.gridTemplateColumns = val; 
        this.style.setProperty('--grid-layout-colunas', val);  
    }

    update_colunasbreak(val) {
        this.style.setProperty('--grid-layout-colunas-break', val);
    }

    update_gap(val) {
        this.style.setProperty('--grid-layout-gap', val);  
    }

    update_gapbreak(val) {
        this.style.setProperty('--grid-layout-gap-break', val);  
    }

    update_posicaoh(val) {
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        let justifyValue = '';
        switch(val){
            case posValues[0]: justifyValue = 'start'; break;
            case posValues[1]: justifyValue = 'end'; break;
            case posValues[2]: justifyValue = 'center'; break;
            case posValues[3]: justifyValue = 'stretch'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaoh! Valores aceitos: 'inicio', 'centro', 'fim', 'total'.`); justifyValue = 'center';
        }
        this.style.setProperty('--grid-layout-posicaoh', justifyValue);
    }
    update_posicaohbreak(val) {
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        let justifyValue = '';
        switch(val){
            case posValues[0]: justifyValue = 'start'; break;
            case posValues[1]: justifyValue = 'end'; break;
            case posValues[2]: justifyValue = 'center'; break;
            case posValues[3]: justifyValue = 'stretch'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaohbreak! Valores aceitos: 'inicio', 'centro', 'fim', 'total'.`); justifyValue = 'center';
        }
        this.style.setProperty('--grid-layout-posicaoh-break', justifyValue);
    }
    update_posicaov(val) {
        const posValues = ['inicio','fim','centro']; // valores aceitos para 'posicaov'
        let alignValue = '';
        switch(val){
            case posValues[0]: alignValue = 'start'; break;
            case posValues[1]: alignValue = 'end'; break;
            case posValues[2]: alignValue = 'center'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaov! Valores aceitos: 'inicio', 'centro', 'fim'.`); alignValue = 'center';
        }
        this.style.setProperty('--grid-layout-posicaov', alignValue);
    }
    update_posicaovbreak(val) {
        const posValues = ['inicio','fim','centro']; // valores aceitos para 'posicaov'
        let alignValue = '';
        switch(val){
            case posValues[0]: alignValue = 'start'; break;
            case posValues[1]: alignValue = 'end'; break;
            case posValues[2]: alignValue = 'center'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaovbreak! Valores aceitos: 'inicio', 'centro', 'fim'.`); alignValue = 'center';
        }
        this.style.setProperty('--grid-layout-posicaov-break', alignValue);
    }
    
}
/** Registra o componente customizado */
customElements.define('algol-grid-layout', GridLayout);

// injeta CSS desse componente
headStyle.textContent +=
`algol-grid-layout{
    grid-template-columns: var(--grid-layout-colunas, none);
    gap: var(--grid-layout-gap, none);
    justify-items: var(--grid-layout-posicaoh, none);
    align-items: var(--grid-layout-posicaov, none);
}
    
@media (max-width: ${mobileBreakpoint}) {
    algol-grid-layout[colunasbreak] {grid-template-columns: var(--grid-layout-colunas-break) !important;}
    algol-grid-layout[gapbreak] {gap: var(--grid-layout-gap-break) !important;}
    algol-grid-layout[posicaohbreak] {justify-items: var(--grid-layout-posicaoh-break) !important;}
    algol-grid-layout[posicaovbreak] {align-items: var(--grid-layout-posicaov-break) !important;}
}
`;
