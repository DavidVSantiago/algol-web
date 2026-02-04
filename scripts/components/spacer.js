/**
 * Componente Web `<algol-spacer>`.
 *
 * Espaçador responsivo para controle de espaçamento vertical entre elementos.
 * Permite definir um valor padrão e um valor alternativo para breakpoints móveis.
 *
 * Funciona aplicando altura dinâmica ao host via CSS Custom Properties,
 * convertendo automaticamente os valores para `vw`.
 *
 * Suporta:
 *  - espaçamento padrão (`value`)
 *  - espaçamento em telas menores (`valuebreak`)
 *
 * Ideal para organização de layout, grids e composição visual sem necessidade
 * de margens externas nos componentes.
 *
 * @extends BaseComponent
 */

class Spacer extends BaseComponent {
    // Mapa de atributos válidos (chaves) e seus respectivos métodos (valores)
    static get PROP_MAP() {
        return {
            'value': 'update_value',
            'valuebreak': 'update_valuebreak',
        };
    }
    static get observedAttributes() {return Object.keys(this.PROP_MAP);} // retorna a chaves do mapa de atributos
    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    render() {
        this.root.adoptedStyleSheets = [algol_spacer_sheet]; // aplica o estilo do componente (compartilhado)
        this.root.innerHTML = `<slot></slot>`;
    }
    /** @override */
    postConfig(){}
    /** @override */
    attachEvents(){}

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    update_value(val) {
        this.style.setProperty('--spacer-value', this._toVw(val));
    }
    update_valuebreak(val) {
        this.style.setProperty('--spacer-valuebreak', this._toVw(val));
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _toVw(val) {
        const num = parseFloat(val); // converte para numero puro (ex: "10px" vira 10)
        if (!isNaN(num)) {return `calc(${num}vw * var(--scale-factor)`;} // 2. Verifica se o resultado é um número válido
        return '0vw'; // Valor de fallback caso venha lixo
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// 1. CSS Fora da Classe, Mais performático e limpo (adoptedStyleSheets)
const algol_spacer_sheet = new CSSStyleSheet();
algol_spacer_sheet.replaceSync(`
    :host {
        display: block;
        width: 100%;
    }
    :host([value]){ height: var(--spacer-value);}
        
    slot {display: none;}
    @media (max-width: ${MOBILE_BREAKPOINT}) {
        :host([valuebreak]) {height: var(--spacer-valuebreak);}
    }
`);

// ----------------------------------------------------------------------------------------------------------------------------------
customElements.define('algol-spacer', Spacer); // Registra o componente customizado