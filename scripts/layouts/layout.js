class AlgolLayout extends HTMLElement {
    static get observedAttributes() {
        return ['colunas', 'gap', 'posicao'];
    }

    constructor() {
        super();
        this._elems = []; // Array com refs para os algol-grid-item
        this._observer = null;
        
        this._base_initialized = false;
        this._connected = false;
    }

    _init() {
        if (this._base_initialized) return;

        this.style.display = 'grid';
        this.style.boxSizing = 'border-box';

        // Inicializa o Observer para detectar novos itens inseridos via JS
        this._initObserver();
        
        this._base_initialized = true;
    }

    _initObserver() {
        this._observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Verifica se a mutação foi causada por uma substituição de elemento
                    if (mutation.addedNodes.length > 0 && mutation.removedNodes.length > 0) {
                        // Não faz nada se a mutação foi causada por uma substituição de elemento
                        return;
                    }
                    this._verificaErro();
                }
            });
        });
        
        this._observer.observe(this, { childList: true });
    }

    /** Atualiza a lista de referências e aplica estilos aos itens */
    _verificaErro() {
        this._elems = Array.from(this.children); // atualiza a lista de filhos
        // percorre todos os filhos do componente e verifica se são algol-grid-item        
        this._elems.forEach(item => {

            // Verifica se o item não é um algol-grid-item
            if (item.tagName.toLowerCase() !== 'algol-grid-item') {
                // modifica o conteúdo do item para imprimir o erro de layout
                item._InnerHtmlErro = this._montaMsgErro(item);
                item._ERRO = true;
                item._imprimeErro();
            }
            // Define o display grid para cada item como solicitado
            item.style.display = 'grid';
            item.style.boxSizing = 'border-box';
        });

        this._applyAttributes();
    }
    
    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************
    
    _applyAttributes() {
        this._applyAttribute_colunas();
        this._applyAttribute_gap();
        this._applyAttribute_posicao();
    }

    _applyAttribute_colunas() {
        const colunas = this.getAttribute('colunas') || '1fr';
        this.style.gridTemplateColumns = colunas;
    }

    _applyAttribute_gap() {
        const gap = this.getAttribute('gap');
        if (gap) this.style.gap = gap;
        else this.style.removeProperty('gap');
    }

    _applyAttribute_posicao() {
        const pos = this.getAttribute('posicao');
        if (pos){ // se existe a propiedade 'posicao'
            const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicao'
            let alignValue = 'stretch'; // total
            this.style.justifyItems = alignValue;
            switch(pos){
                case posValues[0]: alignValue = 'start'; break;
                case posValues[1]: alignValue = 'end'; break;
                case posValues[2]: alignValue = 'center'; break;
            }
            this._elems.forEach(item => {
                item.style.justifyItems = alignValue;
            });
        }else{ // se não existe a propriedade 'posicao'
            this._elems.forEach(item => {
                item.style.justifyItems = 'start';
            });
        }
    }

    // ****************************************************************************
    // Ciclo de Vida
    // ****************************************************************************
    
    connectedCallback() {
        if (this._connected) return;
        this._init();
        this._verificaErro();
        this._applyAttributes();
        this._connected = true;
    }

    disconnectedCallback() {
        if (this._observer) this._observer.disconnect();
        this._connected = false;
    }

    attributeChangedCallback(name, oldV, newV) {
        if (oldV === newV) return;
        if (!this._connected) return;
        
        switch(name) {
            case 'colunas': this._applyAttribute_colunas(); break;
            case 'gap': this._applyAttribute_gap(); break;
            case 'posicao': this._applyAttribute_posicao(); break;
        }
    }

    // ****************************************************************************
    // Métodos de suporte
    // ****************************************************************************

    _montaMsgErro(item) {
        return `
        <div style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed purple; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:purple; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Layout: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                ERRO! envolva o elemento <code>&lt;${item.tagName.toLowerCase()}&gt;</code> dentro de um <code>&lt;algol-grid-item&gt;</code><algol-grid-item></code>
            </p>
            
        </div>`;
    }

}