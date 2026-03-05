/**
 * Componente de layout `<algol-grid-layout>`.
 *
 * Wrapper de layout baseado em CSS Grid, com configuração dinâmica via atributos
 * que são refletidos diretamente em variáveis CSS.
 *
 * Permite controlar:
 *  - número e tamanho das colunas
 *  - espaçamento entre os itens (gap)
 *  - alinhamento horizontal e vertical dos elementos
 *  - variações responsivas para breakpoint móvel
 *
 * Todos os atributos são convertidos em CSS Custom Properties,
 * possibilitando layouts altamente flexíveis sem reprocessamento de DOM.
 *
 * A estilização é injetada automaticamente no `<head>` via `injectStyles()`.
 *
 * @extends BaseLayout
 */

class GridLayout extends BaseLayout {
    // Mapa de atributos válidos (chaves) e suas respectivas variáveis CSS (valores), usadas dinamicamente
    static get ATTR_MAP() {
        return {
            'cols':      '--grid-layout-cols',
            'colsbreak': '--grid-layout-cols-break',
            'gap':       '--grid-layout-gap',
            'gapbreak':  '--grid-layout-gap-break',
            'posh':      '--grid-layout-posh',
            'poshbreak': '--grid-layout-poshbreak',
            'posv':      '--grid-layout-posv',
            'posvbreak': '--grid-layout-posvbreak',
            'color': '--grid-layout-color',
            'colorbreak': '--grid-layout-colorbreak'
        };
    }
    static get PROP_MAP() {
        return {
            'padding': 'update_padding',
            'paddingbreak': 'update_paddingbreak',
        };
    }
    static get observedAttributes() {return [...Object.keys(GridLayout.PROP_MAP), ...Object.keys(GridLayout.ATTR_MAP)];}
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
    // Métodos dos atributos
    // ****************************************************************************

    update_padding(val) {
        this.style.setProperty('--grid-layout-padding', this._adjustPadding(val));
    }
    update_paddingbreak(val) {
        this.style.setProperty('--grid-layout-paddingbreak', this._adjustPadding(val));
    }

    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _adjustPadding(val) {
        if (!val) return '0vw'; // guard!
        // 1. Converte para string, remove espaços extras nas pontas e divide pelos espaços internos
        // O regex /\s+/ garante que múltiplos espaços contem como apenas um separador
        const partes = val.toString().trim().split(/\s+/);
        // 2. Mapeia cada parte (ex: "10", "20px") para o formato "Xvw"
        const valoresConvertidos = partes.map(parte => {
            const num = parseFloat(parte); 
            // Se for número válido retorna com vw, senão retorna 0vw
            return !isNaN(num) ? `${num}vw` : '0vw';
        });
        // 3. Junta tudo de volta em uma string separada por espaços
        return valoresConvertidos.join(' ');
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
                background-color: var(--grid-layout-color, none);
                padding: var(--grid-layout-padding, none);
            }
                
            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-grid-layout[colsbreak] {grid-template-columns: var(--grid-layout-cols-break) !important;}
                algol-grid-layout[gapbreak] {gap: var(--grid-layout-gap-break) !important;}
                algol-grid-layout[poshbreak] {justify-items: var(--grid-layout-poshbreak) !important;}
                algol-grid-layout[posvbreak] {align-items: var(--grid-layout-posvbreak) !important;}
                algol-grid-layout[colorbreak] {background-color: var(--grid-layout-colorbreak) !important;}
                algol-grid-layout[paddingbreak]{padding: var(--grid-layout-paddingbreak);}
            }
        `;
        BaseLayout._injectStyleOnHead('algol-grid-layout-style', css);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

customElements.define('algol-grid-layout', GridLayout); // Registra o componente customizado
GridLayout.injectStyles(); // injeta CSS desse componente