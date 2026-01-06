class GridItem extends BaseLayout {
    static get observedAttributes() {return ['expandecoluna','expandecolunabreak','expandelinha','expandelinhabreak','posicaoh','posicaohbreak', 'posicaov','posicaovbreak'];}

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'grid';
        this.style.gap = '0';
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_expandecoluna(val) {this.style.setProperty('--grid-item-expandecoluna', `span ${val}`);}
    update_expandecolunabreak(val) {this.style.setProperty('--grid-item-expandecoluna-break', `span ${val}`);}
    update_expandelinha(val) {this.style.setProperty('--grid-item-expandelinha', `span ${val}`);}
    update_expandelinhabreak(val) {this.style.setProperty('--grid-item-expandelinha-break', `span ${val}`);}
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
        this.style.setProperty('--grid-item-posicaoh', justifyValue);
    }
    update_posicaohbreak(val) {
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        let justifyValue = '';
        switch(val){
            case posValues[0]: justifyValue = 'start'; break;
            case posValues[1]: justifyValue = 'end'; break;
            case posValues[2]: justifyValue = 'center'; break;
            case posValues[3]: justifyValue = 'stretch'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaoh! Valores aceitos: 'inicio', 'centro', 'fim', 'total'.`); justifyValue = 'center';
        }
        this.style.setProperty('--grid-item-posicaoh-break', justifyValue);
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
        this.style.setProperty('--grid-item-posicaov', alignValue);

    }
    update_posicaovbreak(val) {
        const posValues = ['inicio','fim','centro']; // valores aceitos para 'posicaov'
        let alignValue = '';
        switch(val){
            case posValues[0]: alignValue = 'start'; break;
            case posValues[1]: alignValue = 'end'; break;
            case posValues[2]: alignValue = 'center'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaov! Valores aceitos: 'inicio', 'centro', 'fim'.`); alignValue = 'center';
        }
        this.style.setProperty('--grid-item-posicaov-break', alignValue);

    }
}
/** Registra o componente customizado */
customElements.define('algol-grid-item', GridItem);

// injeta CSS desse componente
headStyle.textContent +=`
algol-grid-item[expandecoluna]{grid-column-end: var(--grid-item-expandecoluna);}
algol-grid-item[expandelinha]{grid-row-end: var(--grid-item-expandelinha);}
algol-grid-item[posicaoh]{justify-self: var(--grid-item-posicaoh);}
algol-grid-item[posicaov]{align-self: var(--grid-item-posicaov);}
    
@media (max-width: ${mobileBreakpoint}) {
    algol-grid-item[expandecolunabreak] {grid-column-end: var(--grid-item-expandecoluna-break) !important;}
    algol-grid-item[expandelinhabreak] {grid-row-end: var(--grid-item-expandelinha-break) !important;}
    algol-grid-item[posicaohbreak] {justify-self: var(--grid-item-posicaoh-break) !important;}
    algol-grid-item[posicaovbreak] {align-self: var(--grid-item-posicaov-break) !important;}
}
`;