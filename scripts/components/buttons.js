class BtnBase extends AlgolComponent {
    static get observedAttributes() {
        return ['valor','tamanho','posicao','disabled'];
    }
    constructor() {
        super(); // atributos aceitos pelo componente
        this._elems = new Map(); // elementos internos do componente
        this._variantClass = 'algol-btn-primary'; // botão padrão
    }
    
    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
       
    /** Faz a construção interna do componente */
    _init() {
        if (this._base_initialized) return;
        
        // Cria o <button>
        const btn = document.createElement('button');
        btn.className = `algol-btn ${this._variantClass}`; // define a classe base + a variante (definida da classe derivada)
        btn.id = `algol-btn-${++AlgolComponent._idCont}`; // define o id unico
        
        // Evita seleção de texto no botão (e no host), com fallbacks
        btn.style.cssText += '-webkit-user-select:none; -ms-user-select:none; user-select:none; -webkit-touch-callout:none;';
        this.style.cssText += '-webkit-user-select:none; -ms-user-select:none; user-select:none;';
        btn.setAttribute('unselectable', 'on');            // IE <= 10
        btn.onselectstart = () => false;  
        btn.style.width = '100%';
        btn.style.justifyContent = 'center';

        this._elems.set('button',btn); // salva uma referência global do botão

        this.appendChild(btn); // adiciona o botão ao componente
        this._base_initialized = true; // marca como inicializado
    }

    _attachEvents() {
        const btn = this._elems.get('button'); // obtem o botão
        if (!btn) return; // guard
        
        // Apenas bloqueamos interação quando o botão estiver desabilitado.
        this._onClick = (e) => {
            if (this.disabled) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }
            // Caso contrário, deixe o evento propagar normalmente.
        };

        btn.addEventListener('click', this._onClick,{ capture: true });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    _applyAttribute_valor() {
        this._elems.get('button').innerHTML = this.getAttribute('valor'); // aplica o valor do atributo 'valor' ao botão
    }
    _applyAttribute_tamanho() {
        const btn = this._elems.get('button'); // obtem o botão
        btn.classList.remove('algol-btn-small', 'algol-btn-big');// remove as classes responsáveis pelo tamanho
        // reaplica-as condicionalmente
        const tamValue = this.getAttribute('tamanho');
        if (!tamValue) return; // se não existe a propiedade 'tamanho', abandona
        const tamanho = ['pequeno','grande']; // valores aceitos para 'posicao'
        switch(tamValue){
            case tamanho[0]: btn.classList.add('algol-btn-small'); break;
            case tamanho[1]: btn.classList.add('algol-btn-big'); break;
        }
    }
    _applyAttribute_posicao() {
        const pos = this.getAttribute('posicao');       
        if (!pos) return; // se não existe a propiedade 'posicao', abandona
        const posValues = ['inicio','fim','centro','total']; // valores aceitos para 'posicao'
        switch(pos){
            case posValues[0]: this.style.justifySelf = 'start'; break;
            case posValues[1]: this.style.justifySelf = 'end'; break;
            case posValues[2]: this.style.justifySelf = 'center'; break;
            case posValues[3]: this.style.justifySelf = 'stretch'; break;
        }
    }
    _applyAttribute_disabled() {
        const btn = this._elems.get('button'); // obtem o botão
        btn.disabled = this.hasAttribute('disabled');
        if (this.hasAttribute('disabled')) {
            btn.style.cursor = 'not-allowed';
        } else {
            btn.style.cursor = '';
        }
    }

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    adicionarEvento(teste){
        this.addEventListener('click', teste);
        //TODO implementar um enumerador para gerenciar os tipos de eventos
    }
}



// Subclasses: definem apenas a variante, não renderizam no constructor
class BtnPrimary extends BtnBase {
    constructor() { super(); }
}
class BtnSecondary extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-secondary'; }
}
class BtnOutline extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-outline'; }
}
class BtnSuccess extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-success'; }
}
class BtnDanger extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-danger'; }
}
class BtnWarning extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-warning'; }
}
class BtnInfo extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-info'; }
}
class BtnLink extends BtnBase {
    constructor() { super(); this._variantClass = 'algol-btn-link'; }
}