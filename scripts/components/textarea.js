class TextArea extends BaseComponent {
    static get observedAttributes() {
        return ['valor', 'placeholder', 'rotulo', 'disabled', 'posicaoh', 'posicaov',
                'linhas', 'maxcaracteres', 'apenasleitura', 'required', 'fixo'];
    }

    constructor() {super();}

    // ****************************************************************************
    // Métodos de construção do componente
    // ****************************************************************************

    /** @override */
    init() {
        if (this.base_initialized) return; // guard para evitar dupla criação
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Torna o componente focável

        this.style.alignSelf = 'center';
        
        // rotulo (segue padrão atual do inputs.js usando <div> com classe)
        const rotulo = document.createElement('div');
        rotulo.className = 'algol-rotulo';
        rotulo.setAttribute('tabindex', '-1'); // para não receber foco
        
        // textarea
        const ta = document.createElement('textarea');
        ta.className = 'algol-textarea';
        ta.setAttribute('tabindex', '-1'); // para não receber foco
        
        // garantir id único evitando
        if (!ta.id) {
            // inicializa o contador no próprio Input (classe base) se necessário
            if (typeof TextArea._uidCounter === 'undefined') TextArea._uidCounter = 0;
            ta.id = `algol-textarea-${++TextArea._uidCounter}`;
        }
        
        // container
        const group = document.createElement('div');
        group.className = 'algol-component-group';
        group.setAttribute('tabindex', '-1'); // para não receber foco

        // monta a árvore
        group.appendChild(rotulo);
        group.appendChild(ta);
        this.appendChild(group);

        // salva as refs globais
        this.elems['root'] = group;
        this.elems['rotulo'] = rotulo;
        this.elems['textarea'] = ta;

        this.base_initialized = true;
    }
    /** @override */
    attachEvents() {
        /* reflete o valor digitado no input no atributo valor do componente */
        this.elems['textarea'].addEventListener('input', () => {
            const val = this.elems['textarea'].value;
            if (this.valor !== val) this.valor = val;
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        this.elems['textarea'].addEventListener('change',() => {
            const val = this.elems['textarea'].value;
            if (this.valor !== val) this.valor = val;
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        // faz com que o enter no componente leve o foco para o input
        this.addEventListener('keydown', (e) => {
            if (this.hasAttribute('disabled')) return;
            if (e.key === 'Enter') {
                this.elems['textarea'].focus();
                return;
            }
        });  
    }

    // ****************************************************************************
    // Métodos de atualização
    // ****************************************************************************
   
    // área para possível sobrescrita do método 'reconstroi'

    // ****************************************************************************
    // Ciclo de Vida de alterações do componente
    // ****************************************************************************

    /** @override */
    mudaFilhosCallback() {
        // decidir o que fazer quando o conteúdo interno do componente for alterado
    }
    /** @override */
    mudaTextoCallback() {
        // decidir o que fazer quando o texto interno do componente for alterado
    }
    /** @override */
    mudaAtributosCallback(nomeAtributo, valorAntigo) {
        // decidir o que fazer quando algum atributo for alterado
    }
    
    // ****************************************************************************
    // Utils
    // ****************************************************************************

    // área para métodos utilitários do componente

    // ****************************************************************************
    // Métodos dos atributos
    // ****************************************************************************

    // implementar um método 'aplicaAtributo_...' para cada atributo observado

    // ****************************************************************************
    // Métodos dos eventos espcíficos deste componente
    // ****************************************************************************

    // implementar os métodos para adicionar eventos específicos deste componente

    // ****************************************************************************
    // Mensagens de Erro
    // ****************************************************************************
    
    // implementar os métodos que montam as mensagens de erro para conteúdo inválido
}