class Input extends AlgolComponent {
    
    constructor() {
        super();
        this._type = 'text';
    }
    
    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
       
    _init() {
        if (this._base_initialized) return;
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável
        
        // cria <rotulo>
        const rotulo = document.createElement('div');
        rotulo.className = 'algol-rotulo';
        rotulo.setAttribute('tabindex', '-1'); // para não receber foco
        
        // cria <input>
        const input = document.createElement('input');
        input.type = this._type;
        input.className = 'algol-input';
        input.setAttribute('tabindex', '-1'); // para não receber foco
        input.id = `algol-input-${++AlgolComponent._idCont}`;
        
        // cria <div> para <rotulo> e o <input>
        const group = document.createElement('div');
        group.className = 'algol-component-group';
        group.setAttribute('tabindex', '-1'); // para não receber foco

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
        /** sincroniza o valor digitado no input com o atributo valor do componente */
        let onInput = (e) => {
            const val = this._elems.get('input').value; 
            if (this.getAttribute('valor') !== val) this.setAttribute('valor', val);
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        };
        let onChange = (e) => {
            const val = this._elems.get('input').value; // obtém o valor do input
            if (this.getAttribute('valor') !== val) this.setAttribute('valor', val);
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        };
    
        this._elems.get('input').addEventListener('input', onInput);
        this._elems.get('input').addEventListener('change', onChange);
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
        if (this.hasAttribute('placeholder')) this._elems.get('input').placeholder = this.getAttribute('placeholder');
    }
    _applyAttribute_valor() {
        if (this.hasAttribute('valor')) this._elems.get('input').value = this.valor;
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
        const isDisabled = this.hasAttribute('disabled');
        // propriedade do elemento real (impede interação)
        if (this._elems.get('input')) this._elems.get('input').disabled = isDisabled;
        if (isDisabled) {
            this._elems.get('input').style.cursor = 'not-allowed';
        } else {
            this._elems.get('input').style.cursor = '';
        }
    }

    // ****************************************************************************
    // Métodos dos eventos do componente
    // ****************************************************************************

    // TODO - crie cada um dos métodos de eventos do componente
}

class InputText extends Input {
    static get observedAttributes() {
        return ['valor', 'placeholder', 'disabled', 'posicao', 'rotulo'];
    }
    constructor() { super(); }
}
class InputEmail extends Input {
    static get observedAttributes() {
        return ['valor', 'placeholder', 'disabled', 'posicao', 'rotulo'];
    }
    constructor() { super(); this._type = 'email';}
}
class InputPassword extends Input {
    static get observedAttributes() {
        return ['valor', 'placeholder', 'disabled', 'posicao', 'rotulo'];
    }
    constructor() { super(); this._type = 'password';}
}
class InputNumber extends Input {
    static get observedAttributes() {
        return ['valor', 'min', 'max', 'disabled', 'posicao', 'rotulo'];
    }
    constructor() {
        super();
        this._initialized = false; // para saber se o componente foi inicializado
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************

    // cria estrutura específica para number (com botões up/down)
    _init() {
        if (this._initialized) return;
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

        this._initialized = true;
    }

    _attachEvents() {
        // cria os eventos
        let btnUpEvent = (e) => {
            if (this.hasAttribute('disabled')) return;
            this._step(1);
        };
        let btnDownEvent = (e) => {
            if (this.hasAttribute('disabled')) return;
            this._step(-1);
        };
        let inputElKeydownEvent = (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'ArrowUp') { e.preventDefault(); }
            if (e.key === 'ArrowDown') { e.preventDefault(); }
        };
        let inputElBlurEvent = (e) => {
            if (this.hasAttribute('disabled')) return;
            this._refleteValor();
        };
        let onChange = (e) => {
            if (this.hasAttribute('disabled')) return;
            this._refleteValor();
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        };

        this._elems.get('up').addEventListener('click', btnUpEvent);
        this._elems.get('down').addEventListener('click', btnDownEvent);
        this._elems.get('input').addEventListener('keydown', inputElKeydownEvent);
        this._elems.get('input').addEventListener('blur', inputElBlurEvent);
        this._elems.get('input').addEventListener('change', onChange);
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

    // ****************************************************************************
    // Métodos auxiliares
    // ****************************************************************************

    /** Esta função reflete o valor do input no atributo */
    _refleteValor() {
        // obtem o valor do input
        const raw = this._elems.get('input').value.trim();
        // se estiver vazio, 
        if (raw === '') { 
            this._elems.get('input').value = ''; // limpa o valor do componente
            this.valor=''; // limpa o valor do atributo
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            return;
        }
        let num = Number(raw); // tenta converter para numero
        if (Number.isNaN(num)) { // se não for numero
            if (this.min !== null) { // se min estiver definido
                this._elems.get('input').value = this.min;
                this.valor=min;
            } else {
                this._elems.get('input').value = '';
                this.valor='';
            }
        } else { // é número: aplicar min/max
            if (this.min !== null && num < this.min) num = this.min;
            if (this.max !== null && num > this.max) num = this.max;
            this._elems.get('input').value = String(num);
        }

        // reflete atributo e dispara eventos
        this.valor = this._elems.get('input').value;
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    _step(dir) {
        const step = Number(this._elems.get('input').step) || 1;
        let val = Number(this._elems.get('input').value) || 0;
        val = val + dir * step;
        if (this.min !== null && val < this.min) val = this.min;
        if (this.max !== null && val > this.max) val = this.max;
        this._elems.get('input').value = String(val);
        // reflete e dispara eventos
        this.valor = this._elems.get('input').value;
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
}
