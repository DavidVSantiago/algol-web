class BaseLayout extends HTMLElement {
    static get observedAttributes() {return [];}

    constructor() {
        super();

        this._ERRO = false;
        this._observer = null; // MutationObserver para monitorar mudanças nos filhos
        this._gerarAcessores(); // gera os acessores para os atributos observados
        
        this._base_initialized = false;
        this._connected = false;
    }

    // ****************************************************************************
    // Métodos de inicialização
    // ****************************************************************************
    
    _render() { throw new Error("Método 'render' deve ser implementado."); }
    /** @abstract */
    attachEvents() { throw new Error("Método 'attachEvents' deve ser implementado."); }
    /** @abstract */
    
    postConfig() { throw new Error("Método 'postConfig' deve ser implementado."); }

    configSlot(){
        const slot = this.root.querySelector('slot');
        if(slot) slot.style.display = 'none'; // esconde o slot por padrão
        else throw new Error("O seu método render() deve incluir um <slot> para o conteúdo interno do componente.");

        this.postConfig(); // invoca o metodo abstrato de pós-configuração
    }
    
    // _attachEvents(){ // @abstract
    //     throw new Error("O método '_attachEvents()' deve ser implementado na classe filha.");
    // }

    _initObserver() {
        this._observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => { // itera sobre as mutações observadas
                if (mutation.type === 'childList') { // verifica se houve adição, remoção ou alteração de filhos
                    console.log('Mutação!');
                    
                    this._verificaFilhos(Array.from(this.children));
                }
            });
        });
        
        this._observer.observe(this, { childList: true });
    }

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

    // ****************************************************************************
    // Aplicação de Atributos
    // ****************************************************************************
    
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
    // Ciclo de Vida
    // ****************************************************************************
    
    connectedCallback() {
        if (this._connected) return;

        // validação de erros. se houver erros, sinalizará ao componente
        this._validarAtributos();
        
        if(this._ERRO) return; // se houver erro sinalizado, substitui o conteúdo do componente por uma mensagem de erro

        this._init();
        this._verificaFilhos(Array.from(this.children));
        this._applyAttributes();
        this._connected = true;
    }

    disconnectedCallback() {
        if (this._observer) this._observer.disconnect();
        this._connected = false;
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
            // altera o código de erro
            this.innerHTML = this._montaMsgErroAtributo(invalidos,globaisPermitidos);
            // sinaliza ao compoente
            this._ERRO = true;
        }
    }

    /** Exibe o erro visualmente (substitui o conteúdo por texto vermelho) */
    _montaMsgErroAtributo(listaInvalidos,listaGlobaisPermitidos) {
        return `
        <div style="display:block; border:calc(0.5vw * var(--fator-escala)) dashed red; background-color:#fff0f0; padding:calc(1vw * var(--fator-escala)); color:red; fontFamily:'monospace';">
            <h3 style="margin: 0 0 calc(0.5vw * var(--fator-escala)) 0;">🚫 Erro de Atributo: &lt;${this.tagName.toLowerCase()}&gt;</h3>
            <p style="margin: 0;">
                Os seguintes atributos não são reconhecidos:
                <strong><em>'${listaInvalidos.join(', ')}'</em></strong>.<br>Remova-os!
            </p>
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                Atributos padrão do componente: <em>[${this.constructor.observedAttributes.join(', ')}]</em>
            </p>
            <p style="margin: calc(0.5vw * var(--fator-escala)) 0 0 0; font-size: 0.9em; color: #333;">
                Outros atributos também aceitos: <em>[${listaGlobaisPermitidos.join(', ')}]</em>
            </p>
        </div>`;
    }
}