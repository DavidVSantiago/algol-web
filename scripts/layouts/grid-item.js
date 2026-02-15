/**
 * Componente Web `<algol-grid-item>`.
 *
 * Item de grade para ser usado dentro do `<algol-grid-layout>`.
 * Permite controle fino de posicionamento, expansão em linhas/colunas,
 * alinhamento individual, espaçamentos internos (padding) responsivos
 * e aplicação de imagem de fundo.
 *
 * Suporta:
 *  - colspan / rowspan (e versões responsivas)
 *  - alinhamento horizontal e vertical do item
 *  - padding responsivo (1 a 4 valores)
 *  - imagem de fundo configurável (url, repeat, size, position, attachment)
 *
 * Todos os atributos são convertidos dinamicamente em CSS Custom Properties,
 * permitindo integração direta com o sistema de layout da engine.
 *
 * @extends BaseLayout
 */


class GridItem extends BaseLayout {
    // Mapa de atributos válidos (chaves) e suas respectivas variáveis CSS (valores), usadas dinamicamente
    static get ATTR_MAP() {
        return {
            'colspan':      { var: '--grid-item-colspan',       prefix: 'span ' },
            'colspanbreak': { var: '--grid-item-colspan-break', prefix: 'span ' },
            'rowspan':      { var: '--grid-item-rowspan',       prefix: 'span ' },
            'rowspanbreak': { var: '--grid-item-rowspan-break', prefix: 'span ' },
            'posh':      '--grid-item-posh',
            'poshbreak': '--grid-item-poshbreak',
            'posv':      '--grid-item-posv',
            'posvbreak': '--grid-item-posvbreak',
            'imgattach': '--grid-item-imgattach', // scroll, fixed
            'imgrepeat': '--grid-item-imgrepeat', // no-repeat, repeat, repeat-x, repeat-y, ...
            'imgpos': '--grid-item-imgpos', // top, bottom, center, left, right, ...
            'imgsize': '--grid-item-imgsize', // contain, cover, ...
        };
    }
    static get PROP_MAP() {
        return {
            'padding': 'update_padding',
            'paddingbreak': 'update_paddingbreak',
            'img': 'update_img',
        };
    }
    static get observedAttributes() {return [...Object.keys(GridItem.PROP_MAP), ...Object.keys(GridItem.ATTR_MAP)];}
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
    // Métodos dos atributos
    // ****************************************************************************
    
    update_img(val) {
        this.style.setProperty('--grid-item-img', `url("${val}")`);
    }
    update_padding(val) {
        this.style.setProperty('--grid-item-padding', this._adjustPadding(val));
    }
    update_paddingbreak(val) {
        this.style.setProperty('--grid-item-paddingbreak', this._adjustPadding(val));
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
            algol-grid-item[colspan]{grid-column-end: var(--grid-item-colspan);}
            algol-grid-item[rowspan]{grid-row-end: var(--grid-item-rowspan);}
            algol-grid-item[posh]{justify-self: var(--grid-item-posh);}
            algol-grid-item[posv]{align-self: var(--grid-item-posv);}
            algol-grid-item[img]{background-image: var(--grid-item-img);}
            algol-grid-item[imgattach]{background-attachment: var(--grid-item-imgattach);}
            algol-grid-item[imgrepeat]{background-repeat: var(--grid-item-imgrepeat);}
            algol-grid-item[imgpos]{background-position: var(--grid-item-imgpos);}
            algol-grid-item[imgsize]{background-size: var(--grid-item-imgsize);}
            algol-grid-item[padding]{padding: var(--grid-item-padding);}

            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-grid-item[colspanbreak] {grid-column-end: var(--grid-item-colspan-break) !important;}
                algol-grid-item[rowspanbreak] {grid-row-end: var(--grid-item-rowspan-break) !important;}
                algol-grid-item[poshbreak] {justify-self: var(--grid-item-poshbreak) !important;}
                algol-grid-item[posvbreak] {align-self: var(--grid-item-posvbreak) !important;}
                algol-grid-item[paddingbreak]{padding: var(--grid-item-paddingbreak);}
            }
        `;

        BaseLayout._injectStyleOnHead('algol-grid-item-style', css); // injeta no head
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

customElements.define('algol-grid-item', GridItem); // Registra o componente customizado
GridItem.injectStyles(); // injeta CSS desse componente