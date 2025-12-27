class BaseLayout extends HTMLElement{
    
    static _idCont = 0 // contador para os ids únicos dos elementos internos do componente
    static get observedAttributes() { return []; } // atributos observados serão definidos nas classes filhas

    constructor() {
        super();
        this._elems = new Map(); // mapa dos elementos internos do componente
        this._gerarAcessores();
        this._base_initialized = false; // para saber se o componente foi inicializado
        this._connected = false; // para saber se o componente foi montado
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
    
    // TODO - criar o mecanismo de notificar a inserção de atributos não aceitáveis (não observados). substituir todo o conteúdo por texto vermelho

    /** gera dinamicamente os métodos getters e setters para os atributos */
    _gerarAcessores() {
        this.constructor.observedAttributes.forEach(attr => {
            // Verifica se a propriedade já não existe para não sobrescrever métodos manuais
            if (!(attr in this)) {
                Object.defineProperty(this, attr, {
                    get: () => this.getAttribute(attr),
                    set: (val) => this.setAttribute(attr, val),
                    configurable: true
                });
            }
        });
    }

    _init(){ // @abstract
        throw new Error("O método '_init()' deve ser implementado na classe filha.");
    }
    _attachEvents(){ // @abstract
        throw new Error("O método '_attachEvents()' deve ser implementado na classe filha.");
    }

    // Aplica os atributos do componente
    _applyAttributes() {
        // invoca as funções '_applyAttribute_...' para cada atributo'
        this.constructor.observedAttributes.forEach(item => {
            const nomeMetodo = `_applyAttribute_${item}`;
            // Verifica se a função existe antes de invocar
            if (typeof this[nomeMetodo] === 'function') {
                this[nomeMetodo]();
            } else {
                console.error(`Faltando o método ${nomeMetodo} no componente.`);
            }
        });
    }

    // ****************************************************************************
    // Callbacks do ciclo de vida dos webcomponents
    // ****************************************************************************

    /** invocado automaticamente quando o componente é inserido no DOM ou movido para outro local. */
    connectedCallback() {
        if (this._connected) return; // guard
        
        // validação de erros. se houver erros, limpa o componente e substitui o conteúdo
        if (!this._validarAtributos()) {
             this._connected = true; // Marca como conectado para evitar loops, mas em estado de erro
             return; 
        }

        this.innerHTML=''; // limpa o compoennte do zero
        this._init(); // *abstract* implementado na classe filha
        this._attachEvents(); // *abstract* implementado na classe filha
        this._applyAttributes(); // aplica atributos
        this._connected = true; // marca como motado
    }

    /** invocado automaticamente quando muda o valor de algum atributo observado ('observedAttributes'). */
    attributeChangedCallback(name, oldV, newV) {

        // 1. Só age se o valor realmente mudou e se o componente já foi montado
        if (oldV === newV || !this._connected) return;

        // 2. Constrói o nome do método (ex: _applyAttribute_valor)
        const nomeMetodo = `_applyAttribute_${name}`;
        
        // 3. Chama a função de aplicação específica
        if (typeof this[nomeMetodo] === 'function') {
            this[nomeMetodo]();
        }
        // lança um evento de mudança de atributo, para quem quiser escutar
        this.dispatchEvent(new CustomEvent('mudancaAtributo', {
            detail: {
                attribute: name,
                oldValue: oldV,
                newValue: newV
            },
        }));
    }

    // ****************************************************************************
    // Métodos de suporte
    // ****************************************************************************

    _validarAtributos() {
        const observados = this.constructor.observedAttributes || [];
        
        // Atributos globais que devem ser permitidos para não quebrar o HTML padrão
        // Você pode expandir essa lista conforme a necessidade
        const globaisPermitidos = [
            'id', 'class', 'style', 'tabindex', 'slot', 'hidden', 
            'title', 'lang', 'dir', 'accesskey', 'draggable', 'spellcheck'
        ];

        const invalidos = [];
        
        // Itera sobre TODOS os atributos presentes e identifica os invalidos
        Array.from(this.attributes).forEach(attr => {
            const nome = attr.name;

            // 1. É um atributo observado? OK.
            if (observados.includes(nome)) return;

            // 2. É um atributo global padrão? OK.
            if (globaisPermitidos.includes(nome)) return;

            // 3. É um atributo data-* ou aria-*? OK.
            if (nome.startsWith('data-') || nome.startsWith('aria-')) return;
            
            // 4. É um event listener inline (ex: onclick)?
            if (nome.startsWith('on')) return;

            // Se chegou aqui, é inválido
            invalidos.push(nome);
        });

        if (invalidos.length > 0) {
            this._renderizarErroAtributos(invalidos,globaisPermitidos);
            return false; // Falhou na validação
        }
        return true; // Passou na validação
    }

    /** Exibe o erro visualmente (substitui o conteúdo por texto vermelho) */
    _renderizarErroAtributos(listaInvalidos,listaGlobaisPermitidos) {
        this.innerHTML = ''; // Limpa tudo
        this.style.display = 'block';
        this.style.border = '2px dashed red';
        this.style.backgroundColor = '#fff0f0';
        this.style.padding = '10px';
        this.style.color = 'red';
        this.style.fontFamily = 'monospace';
        // this.style.fontSize = '14px';

        this.innerHTML = `
            <h3 style="margin: 0 0 5px 0;">🚫 Erro de Atributo: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                Os seguintes atributos não são reconhecidos: 
                <strong>${listaInvalidos.join(', ')}</strong>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #333;">
                Atributos padrão do componentes: <em>[${this.constructor.observedAttributes.join(', ')}]</em>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #333;">
                Outros atributos também aceitos: <em>[${listaGlobaisPermitidos.join(', ')}]</em>
            </p>
        `;
        console.error(`Componente ${this.tagName} recebeu atributos inválidos:`, listaInvalidos);
    }
}