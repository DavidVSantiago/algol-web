class Input extends BaseComponent {
    static get observedAttributes() {
        return ['valor', 'placeholder', 'disabled', 'posicaoh', 'posicaov', 'rotulo', 'required'];
    }
    constructor() {
        super();
        this._type = 'text';
    }

    // sobrescreve o observador de mudanças
    _mutationObserver (mutations) {
        // Flag para evitar rebuilds desnecessários se a mudança não for relevante
        let mudancaRelevante = false;
        for (const mutation of mutations) { // percorre todas as mutações

            if (mutation.type === 'childList') { // Mudança na estrutura do DOM (elementos adicionados/removidos)
                mudancaRelevante = true; break;
            } else if (mutation.type === 'attributes') { // Mudança de atributos
                if (mutation.attributeName === 'valor'){ // se a mudança foi no atributo valor... 
                    this.dispatchEvent(new CustomEvent('mudancaValor', {bubbles: false}));
                    this._applyAttribute_valor(); // não deve reconstruir, apenas atualizar o valor
                }else {mudancaRelevante = true; break;}
            } else if (mutation.type === 'characterData') { // Mudança de texto]
                
                mudancaRelevante = true; break;
            }
        }
        if(mudancaRelevante) { console.log('reconstruindo...'); this.reconstroi();}
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
       
    _init() {
        if (this._base_initialized) return;
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        // cria <rotulo>
        const rotulo = document.createElement('div');
        rotulo.setAttribute('tabindex', '-1'); // para não receber foco
        rotulo.className = 'algol-rotulo';
        
        // cria <input>
        const input = document.createElement('input');
        input.setAttribute('tabindex', '-1'); // para não receber foco
        input.type = this._type;
        input.className = 'algol-input';
        input.id = `algol-input-${++BaseComponent._idCont}`;
        
        // cria <div> para <rotulo> e o <input>
        const group = document.createElement('div');
        group.setAttribute('tabindex', '-1'); // para não receber foco
        group.className = 'algol-component-group';

        // monta a árvore: group -> rotulo + input
        group.appendChild(rotulo);
        group.appendChild(input);
        this.appendChild(group);// coloca os elementos dentro da tag

        // guarda referências
        this._elems.set('group',group);
        this._elems.set('rotulo',rotulo);
        this._elems.set('input',input);
    
        this._base_initialized = true; // marca como inicializado
    }

    _attachEvents() {
        /* reflete o valor digitado no input no atributo valor do componente */
        this._elems.get('input').addEventListener('input', (e) => {
            const val = this._elems.get('input').value; 
            if (this.getAttribute('valor') !== val) this.setAttribute('valor', val);
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        this._elems.get('input').addEventListener('change', (e) => {
            const val = this._elems.get('input').value; // obtém o valor do input
            if (this.getAttribute('valor') !== val) this.setAttribute('valor', val);
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        // faz com que o enter no componente leve o foco para o input
        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'Enter') {
                this._elems.get('input').focus();
            }
        });
    }

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************
    
    _applyAttribute_rotulo() {
        const rotulo = this.getAttribute('rotulo');
        if (rotulo && rotulo != '') { // existe o atributo rotulo e ele não está vazio
            this._elems.get('rotulo').textContent = rotulo;
            // se o rotulo não estiver inserido no componente, insere ele antes do input
            if (!this._elems.get('rotulo').parentNode) this._elems.get('group').insertBefore(this._elems.get('rotulo'), this._elems.get('input'));
        } else { // não existe o atributo rotulo
            // se o rotulo estiver inserido no compoenente, remove-o
            if (this._elems.get('rotulo').parentNode) this._elems.get('group').removeChild(this._elems.get('rotulo'));
        }
    }
    _applyAttribute_placeholder() {
        if(this.hasAttribute('disabled'))return;
        if (this.hasAttribute('placeholder')) this._elems.get('input').placeholder = this.getAttribute('placeholder');
    }
    _applyAttribute_valor() {
        if (this.hasAttribute('valor')) this._elems.get('input').value = this.valor;
    }
    _applyAttribute_posicaoh() {
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
    _applyAttribute_posicaov() {
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
    _applyAttribute_disabled() {
        const isDisabled = this.hasAttribute('disabled');
        // propriedade do elemento real (impede interação)
        this._elems.get('input').disabled = isDisabled;
        if (isDisabled) {
            this._elems.get('input').style.cursor = 'not-allowed';
        } else {
            this._elems.get('input').style.cursor = '';
        }
    }
    _applyAttribute_required() {
        this._elems.get('input').required = this.hasAttribute('required');
    }

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    // gerais
    addEventoClique(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let mouseInfo = {
                x: e.clientX,
                y: e.clientY,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
            callback(origem,mouseInfo);
        };
        this.addEventListener('click', wrapperCallback);
    }
    addEventoFoco(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('focus', wrapperCallback);
    }
    addEventoBlur(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('blur', wrapperCallback);
    }
    addEventoMouseEntra(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('mouseenter', wrapperCallback);
    }
    addEventoMouseSai(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            callback(origem);
        };
        this.addEventListener('mouseleave', wrapperCallback);
    }
    addEventoMouseSobre(callback) {
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) return;
            let origem = e.currentTarget
            let mouseInfo = {
                x: e.clientX,
                y: e.clientY,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
            callback(origem,mouseInfo);
        };
        this.addEventListener('mousemove', wrapperCallback);
    }
    addEventoMudaValor(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let valor = this.valor;
            callback(origem,valor);
            return;
            
        };
        this.addEventListener('mudancaValor', wrapperCallback);
    }
}

class InputText extends Input {
    constructor() { super(); }
}
class InputEmail extends Input {
    constructor() { super(); this._type = 'email';}
}
class InputPassword extends Input {
    constructor() { super(); this._type = 'password';}
}
class InputNumber extends Input {
    static get observedAttributes() {
        return ['valor', 'min', 'max', 'disabled', 'posicaoh', 'posicaov', 'rotulo', 'required'];
    }
    constructor() {
        super();
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

    // cria estrutura específica para number (com botões up/down)
    _init() {
        if (this._base_initialized) return;
        super._init();

        // container para agrupar o input e o spinner
        const inputContainer = document.createElement('div');
        inputContainer.className = 'algol-input-container';
        inputContainer.setAttribute('tabindex', '-1'); // para não receber foco

        // cria o componente do spinner dos botões
        const spinner = document.createElement('div');
        spinner.className = 'algol-spinner-buttons';
        spinner.setAttribute('tabindex', '-1');
        const up = document.createElement('div'); up.className = 'algol-spinner-up'; up.textContent = '▲';
        up.setAttribute('tabindex', '-1');
        const down = document.createElement('div'); down.className = 'algol-spinner-down'; down.textContent = '▼';
        down.setAttribute('tabindex', '-1');

        // evitar seleção de texto ao clicar nos botões
        up.style.userSelect = 'none';
        up.style.msUserSelect = 'none';
        down.style.userSelect = 'none';
        down.style.msUserSelect = 'none';

        // prevenir início de seleção pelo mouse
        up.addEventListener('mousedown', e => e.preventDefault());
        down.addEventListener('mousedown', e => e.preventDefault());
        // melhorar acessibilidade/controle por teclado
        up.setAttribute('role', 'button');
        down.setAttribute('role', 'button');

        // adiciona o input e o spinner  
        spinner.appendChild(up); spinner.appendChild(down);
        inputContainer.appendChild(this._elems.get('input'));
        inputContainer.appendChild(spinner);

        this._elems.get('group').appendChild(inputContainer);

        // guarda referências
        this._elems.set('up',up);
        this._elems.set('down',down);

        this._base_initialized = true;
    }

    _attachEvents() {
        // eventos de clique nos bottões spin (up e down)
        this._elems.get('up').addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(1);
            this._refleteValor();
        });
        this._elems.get('down').addEventListener('click', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._incrementaValor(-1);
            this._refleteValor();
        });
        // eventos 
        this._elems.get('input').addEventListener('blur', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._refleteValor();
        });
        this._elems.get('input').addEventListener('change', (e) => {
            if (this.hasAttribute('disabled')) return;
            this._refleteValor();
        });

        // para fazer o 'up' e 'down' funcionarem pra subir e descer o valor do inputnumber
        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'ArrowUp') {this._incrementaValor(1); this._refleteValor();}
            if (e.key === 'ArrowDown') {this._incrementaValor(-1); this._refleteValor();}
            if (e.key === 'Enter') { // para fazer o enter focar o input
                this._elems.get('input').focus();
                return;
            }
        });
    }

    // ****************************************************************************
    // Métodos de atributos
    // ****************************************************************************
    
    _applyAttribute_valor() {
        super._applyAttribute_valor();
        // faz o clamp do min/max
        let val = Number(this.valor);
        if (Number.isNaN(val)) { // se não for numero
            if (this.min !== null){
                this.valor = this.min;
                this._elems.get('input').value = this.min;
            }else{
                this.valor = '';
                this._elems.get('input').value = '';
            }
            return;
        }
        if (this.min !== null && val < this.min){
            this.valor = this.min;
            this._elems.get('input').value = this.min;
        }
        if (this.max !== null && val > this.max){
            this.valor = this.max;
            this._elems.get('input').value = this.max;
        }
    }
    _applyAttribute_disabled() {
        if (this.hasAttribute('disabled')) {
            this._elems.get('input').disabled = true;
            this._elems.get('input').value = '';
            this._elems.get('up').style.cursor = 'not-allowed';
            this._elems.get('down').style.cursor = 'not-allowed';
            this._elems.get('input').style.cursor = 'not-allowed';

        } else {
            this._elems.get('input').disabled = false;
            this._elems.get('input').style.cursor = '';
        }
    }
    _applyAttribute_min() {
        if (this.hasAttribute('min')) this._elems.get('input').min = this.min;
    }
    _applyAttribute_max() {
        if (this.hasAttribute('max')) this._elems.get('input').max = this.max;
    }
    _applyAttribute_required() {
        this._elems.get('input').required = this.hasAttribute('required');
    }

    // ****************************************************************************
    // Métodos auxiliares
    // ****************************************************************************

    /** Esta função reflete o valor do input no atributo */
    _refleteValor() {
        this.valor = this._elems.get('input').value.trim();
    }
    _incrementaValor(incremento){
        this._elems.get('input').value = Number(this._elems.get('input').value)+incremento;
    }


    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    // específicos de <algol-input-number>
    addEventoCliqueSobe(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let valor = this.valor
            callback(origem,valor);
        };
        this._elems.get('up').addEventListener('click', wrapperCallback);
    }
    addEventoCliqueDesce(callback){
        const wrapperCallback = (e) => {
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }
            let origem = e.currentTarget
            let valor = this.valor
            callback(origem,valor);
        };
        this._elems.get('down').addEventListener('click', wrapperCallback);
    }

    // ****************************************************************************
    // Mensagens de Erro
    // ****************************************************************************
    
    _montaMsgErroTextoInterno() {
       return `
        <div style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed red; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:red; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Conteúdo: &lt;${this.tagName.toLowerCase()}&gt;</h3>
        </div>`;
    }
}
