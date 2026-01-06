class GridLayout extends BaseLayout {
    static get observedAttributes() {return ['colunas', 'gap', 'posicaoh', 'posicaov'];}

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'grid';
        this.style.justifyItems = 'center';
        this.style.alignItems = 'center';
        this.style.gap = '1vw';
    }
 
    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_colunas(val) {
        this.style.gridTemplateColumns = val;
    }

    update_gap(val) {
        this.style.gap = val;
    }

    update_posicaoh(val) {
        const filhos = Array.from(this.children); // obtém a lista de filhos
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        let justifyValue = '';
        switch(val){
            case posValues[0]: justifyValue = 'start'; break;
            case posValues[1]: justifyValue = 'end'; break;
            case posValues[2]: justifyValue = 'center'; break;
            case posValues[3]: justifyValue = 'stretch'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaoh! Valores aceitos: 'inicio', 'centro', 'fim', 'total'.`); justifyValue = 'center';
        }
        this.style.justifyItems = justifyValue; 
    }
        
    update_posicaov(val) {
        const filhos = Array.from(this.children); // obtém a lista de filhos
        const posValues = ['inicio','fim','centro']; // valores aceitos para 'posicaov'
        let alignValue = '';
        switch(val){
            case posValues[0]: alignValue = 'start'; break;
            case posValues[1]: alignValue = 'end'; break;
            case posValues[2]: alignValue = 'center'; break;
            default: console.warn(`Valor '${val}' é inválido para posicaov! Valores aceitos: 'inicio', 'centro', 'fim'.`); alignValue = 'center';
        }
        this.style.alignItems = alignValue;
    }
}