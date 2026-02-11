/**
 * Componente Web `<algol-flex-item>`.
 *
 * Item flexível para composição de layouts baseados em Flexbox.
 * Atua como contêiner flex (`display: flex`) com quebra automática de linha,
 * permitindo distribuição de conteúdo, padding responsivo
 * e aplicação de imagem de fundo.
 *
 * Suporta:
 *  - distribuição horizontal do conteúdo (space-between, around, evenly, start, center, end)
 *  - padding responsivo (1 a 4 valores)
 *  - aplicação de imagem de fundo
 *  - controle de rowspan/colspan para integração com sistemas híbridos (grid + flex)
 *
 * Os atributos são mapeados dinamicamente para CSS Custom Properties,
 * mantendo o padrão arquitetural da engine.
 *
 * @extends BaseLayout
 */

class FlexItem extends BaseLayout {
    // Mapa de atributos válidos (chaves) e suas respectivas variáveis CSS (valores), usadas dinamicamente
    static get ATTR_MAP() {
        return {
            'colspan':      { var: '--flex-item-colspan',       prefix: 'span ' },
            'colspanbreak': { var: '--flex-item-colspan-break', prefix: 'span ' },
            'rowspan':      { var: '--flex-item-rowspan',       prefix: 'span ' },
            'rowspanbreak': { var: '--flex-item-rowspan-break', prefix: 'span ' },
            'imgattach': '--flex-item-imgattach', // scroll, fixed
            'imgrepeat': '--flex-item-imgrepeat', // no-repeat, repeat, repeat-x, repeat-y, ...
            'imgpos': '--flex-item-imgpos', // top, bottom, center, left, right, ...
            'imgsize': '--flex-item-imgsize', // contain, cover, ...
        };
    }
    static get PROP_MAP() {
        return {
            'distrib': 'update_distrib', // 'between', 'around', 'evenly', 'start', 'center', 'end'
            'padding': 'update_padding',
            'paddingbreak': 'update_paddingbreak',
            'img': 'update_img',
        };
    }
    static get observedAttributes() {return [...Object.keys(FlexItem.PROP_MAP), ...Object.keys(FlexItem.ATTR_MAP)];}
    constructor() {super();}

    // ****************************************************************************
    // Métodos de configuração do layout
    // ****************************************************************************

    /** @override */
    postConfig(){
        this.style.display = 'flex';
        this.style.flexWrap = 'wrap';
        this.style.gap = '0';
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    update_distrib(val) {
        val = val?.trim().toLowerCase();
        if(!['between', 'around', 'evenly', 'start', 'center', 'end'].includes(val))return; // guard
        this.style.justifyContent = ['between', 'around', 'evenly'].includes(val)? `space-${val}`: val;
    }
    update_img(val) {
        this.style.setProperty('--flex-item-img', `url("${val}")`);
    }
    update_padding(val) {
        this.style.setProperty('--flex-item-padding', this._adjustPadding(val));
    }
    update_paddingbreak(val) {
        this.style.setProperty('--flex-item-paddingbreak', this._adjustPadding(val));
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
            algol-flex-item[colspan]{grid-column-end: var(--flex-item-colspan);}
            algol-flex-item[rowspan]{grid-row-end: var(--flex-item-rowspan);}
            algol-flex-item[img]{background-image: var(--flex-item-img); width: 100%; height: 100%;}
            algol-flex-item[imgattach]{background-attachment: var(--flex-item-imgattach);}
            algol-flex-item[imgrepeat]{background-repeat: var(--flex-item-imgrepeat);}
            algol-flex-item[imgpos]{background-position: var(--flex-item-imgpos);}
            algol-flex-item[imgsize]{background-size: var(--flex-item-imgsize);}
            algol-flex-item[padding]{padding: var(--flex-item-padding);}
            algol-flex-item[distrib]{width: 100%}

            @media (max-width: ${MOBILE_BREAKPOINT}) {
                algol-flex-item[colspanbreak] {grid-column-end: var(--flex-item-colspan-break) !important;}
                algol-flex-item[rowspanbreak] {grid-row-end: var(--flex-item-rowspan-break) !important;}
                algol-flex-item[paddingbreak]{padding: var(--flex-item-paddingbreak);}

            }
        `;

        BaseLayout._injectStyleOnHead('algol-flex-item-style', css); // injeta no head
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------

customElements.define('algol-flex-item', FlexItem); // Registra o componente customizado
FlexItem.injectStyles(); // injeta CSS desse componente