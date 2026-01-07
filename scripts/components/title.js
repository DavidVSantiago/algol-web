class AlgolTitle extends BaseComponent {
    static get observedAttributes() {
        return ['level', 'text'];
    }

    constructor() {
        super();
    }

    render() {
        const level = this.getAttribute('level') || '1';
        const text = this.getAttribute('text') || '';
        const headingTag = `h${level}`;

        const html = `
            <${headingTag} part="title">${text}</${headingTag}>
            <slot></slot>
        `;

        this.root.innerHTML = html;
    }

    postConfig() {
        this.elems.title = this.root.querySelector('h1, h2, h3, h4, h5, h6');
        this.elems.slot = this.root.querySelector('slot');

        this._sincronizarTexto();
    }

    attachEvents() {
        this.elems.slot.addEventListener('slotchange', () => {
            this._sincronizarTexto();
        });
    }

    _sincronizarTexto() {
        const textFromSlot = this.elems.slot.assignedNodes().map(node => node.textContent).join('');
        if (textFromSlot.trim() !== '') {
            this.elems.title.textContent = textFromSlot;
        }
    }

    update_level(val) {
        if (this.inicializado) {
            this.render();
            this.postConfig();
        }
    }

    update_text(val) {
        this.elems.title.textContent = val;
    }
}

customElements.define('algol-title', AlgolTitle);
