class Select extends BaseComponent {
    static get observedAttributes() {
        return ['rotulo', 'valor', 'required', 'disabled','posicaoh', 'posicaov'];
    }

    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    init() {
        if (this.base_initialized) return; // guard para evitar dupla criação
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        // container raiz
        const group = document.createElement('div');
        group.className = 'algol-component-group';

        // rotulo
        const label = document.createElement('label');
        label.className = 'algol-label';

        // wrapper do select custom
        const select = document.createElement('select');
        select.className = 'algol-select';

        // Move as <option> existentes para o select nativo
        while (this.firstChild) {
            const node = this.firstChild;
            if (node.tagName === 'OPTION' || node.nodeType === Node.TEXT_NODE) {
                select.append(node);
            } else {
                node.remove();
            }
        }

        group.appendChild(label);
        group.appendChild(select);
        this.appendChild(group);

        // refs
        this.elems['root'] = group;
        this.elems['label'] = label;
        this.elems['select'] = select;

        this.aplicaAtributos();
        this._marcarOpcaoPadrao(); // para selecionar a opção padrão

        this.base_initialized = true;
    }
    /** @override */
    attachEvents() {
        this.elems['select'].addEventListener('input', () => this._refletirValor());
        this.elems['select'].addEventListener('change', () => this._refletirValor());
    }

    // ****************************************************************************
    // Métodos de atualização
    // ****************************************************************************
   
    /** @override */
    reconstroi() {
        console.log('reconstruindo select...');

        // captura as opções atuais para restaurar depois
        const opcoes = Array.from(this.elems['select'].options).map(option => option.cloneNode(true));
        const valorAtual = this.elems['select'].value;

        this.innerHTML = ''; // Limpa o componente para garantir reconstrução do zero
        this.removeAttribute("style"); // limoa todos os estilos inline
        this.elems.clear(); // limpa a lista de componente

        // coloca as opções de volta
        for (const opcao of opcoes) {
            this.appendChild(opcao);
        }
        this.constroi();

        // restaura o valor atual
        this.valor = valorAtual; 
        this.aplicaAtributo_valor();

    }

    // ****************************************************************************
    // Ciclo de Vida de alterações do componente
    // ****************************************************************************

    /** @override */
    mudaFilhosCallback() {
        this.innerHTML = this._montaMsgErroConteudo();
        this._ERRO = true;
    }
    /** @override */
    mudaTextoCallback() {
        this.innerHTML = this._montaMsgErroConteudo();
        this._ERRO = true;
    }
    /** @override */
    mudaAtributosCallback(nomeAtributo, valorAntigo) {
        if (nomeAtributo === 'valor'){ // se a mudança foi no atributo valor... 
            this.dispatchEvent(new CustomEvent('mudancaValor',{bubbles: false,detail: {antigo: valorAntigo, novo: this.valor}}));
            this.aplicaAtributo_valor(); // não deve reconstruir, apenas atualizar o valor
        }else {this.reconstroi();}
    }
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    _marcarOpcaoPadrao() {
        if (this.elems['select'].options.length > 0) {
            let select = this.elems['select'];
            select.selectedIndex = 0; // a princípio, a opção padrão é a primeira
            // seleciona o primeiro <option> marcado como ativo
            for(let i=0;i<select.options.length;i++){
                const option = select.options[i];
                if(option.hasAttribute('ativa')) {
                    select.selectedIndex = i;
                    break;
                }
            }
            this._refletirValor(); // Atualiza o valor refletido
        }
    }

    _refletirValor() {
    const current = this.elems['select'].value;
        if (this.valor !== current) {
        this.valor = current;
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    aplicaAtributo_rotulo() {
        const rotulo = this.getAttribute('rotulo');
        this.elems['label'].textContent = rotulo;
    }
    aplicaAtributo_valor() {
        // quando alterar externamente o atributo, aplica sem disparar eventos duplicados
        const v = this.valor;
        this.elems['select'].value = v;
    }
    aplicaAtributo_disabled() {
        this.elems['select'].disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            this.elems['select'].style.cursor = 'not-allowed';
        } else {
            this.elems['select'].style.cursor = '';
        }
    }
    aplicaAtributo_required() {
        this.elems['select'].toggleAttribute('required', this.hasAttribute('required'));
    }
    aplicaAtributo_posicaoh() {
        const pos = this.getAttribute('posicaoh');       
        if (!pos) return; // se não existe a propiedade 'posicaoh', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaoh'
        switch(pos){
            case posValues[0]: this.style.justifySelf = 'start'; break;
            case posValues[1]: this.style.justifySelf = 'end'; break;
            case posValues[2]: this.style.justifySelf = 'center'; break;
            case posValues[3]: this.style.justifySelf = 'stretch'; break;
        }
    }
    aplicaAtributo_posicaov() {
        const pos = this.getAttribute('posicaov');       
        if (!pos) return; // se não existe a propiedade 'posicaov', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicaov'
        switch(pos){
            case posValues[0]: this.style.alignSelf = 'start'; break;
            case posValues[1]: this.style.alignSelf = 'end'; break;
            case posValues[2]: this.style.alignSelf = 'center'; break;
            case posValues[3]: this.style.alignSelf = 'center'; break;
        }
    }

    // ****************************************************************************
    // Métodos dos eventos espcíficos deste componente
    // ****************************************************************************

    addEventoMudaValor(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let antigo = e.detail.antigo;
            let novo = e.detail.novo;
            callback(origem,antigo,novo);
            return;
            
        };
        this.addEventListener('mudancaValor', wrapperCallback);
    }

    // ****************************************************************************
    // Mensagens de Erro
    // ****************************************************************************
    
    _montaMsgErroConteudo() {
       return `
        <div style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed #d50; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:#d50; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Conteúdo: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                Este componente não permite alteração de seu conteúdo interno!
            </p>
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                -- Recarregue a página para restaurar o conteúdo original! --
            </p>
        </div>`;
    }
}