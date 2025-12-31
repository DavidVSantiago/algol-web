class GridLayout extends BaseLayout {
    static get observedAttributes() {return ['colunas', 'gap', 'posicaoh', 'posicaov'];}

    constructor() {
        super();
    }

    _init() {
        if (this._base_initialized) return;

        this.style.display = 'grid';
        this.style.boxSizing = 'border-box';
        this._initObserver(); // Inicializa o Observer para detectar novos itens inseridos via JS
        
        this._base_initialized = true;
    }

    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************

    _applyAttribute_colunas() {
        const colunas = this.getAttribute('colunas') || '1fr';
        this.style.gridTemplateColumns = colunas;
    }

    _applyAttribute_gap() {
        const gap = this.getAttribute('gap');
        if (gap) this.style.gap = gap;
        else this.style.removeProperty('gap');
    }

    _applyAttribute_posicaoh() {
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

    _applyAttribute_posicaov() {
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

    // ****************************************************************************
    // Métodos de suporte
    // ****************************************************************************

    /** Faz uma varredura nos filhos do componente, de forma recursiva, em busca elementos fora de <algol-grid-item> */
    _verificaFilhos(filhos){
        // percorre todos os filhos do componente e verifica se são algol-grid-item        
        for (let i = 0; i < filhos.length; i++) {
            const filho = filhos[i];
            // se o filho for outro <algol-grid-layout>, faz uma nova verificação (recursiva)
            if (filho.tagName.toLowerCase() === 'algol-grid-layout') {
                this._verificaFilhos(Array.from(filho.children));
                continue;
            }
            // se não for <algol-grid-item> ou uma div com id de erro (algol-error!), devemos aceitar apenas tags <algol-grid-item>
            if(filho.tagName.toLowerCase()!=='algol-grid-item'){
                if(filho.id==='algol-error!') continue; // ignora a div de erro já existente
                let div = document.createRange().createContextualFragment(this._montaMsgErro(filho.tagName.toLowerCase()));
                filho.replaceWith(div);
            }
        }

        this._applyAttributes();
    }

    _verificaTipoFilho(filho){
        let tagName = filho.tagName.toLowerCase();
        if(tagName!=='algol-grid-item'){
            this._montaMsgErro(filho);
        }
    }
    
    _montaMsgErro(nome) {
        return `
        <div id="algol-error!" style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed purple; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:purple; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Layout: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                Envolva o elemento <code>&lt;${nome}&gt;</code> dentro de um <code>&lt;algol-grid-item&gt;</code><algol-grid-item></code>
            </p>
            
        </div>`;
    }

}