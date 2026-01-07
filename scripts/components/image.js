class AlgolImage extends BaseComponent {
    static get observedAttributes() {
        return ['src', 'alt', 'fluid'];
    }

    constructor() {
        super();
    }

    render() {
        const src = this.getAttribute('src') || '';
        const alt = this.getAttribute('alt') || '';
        const fluid = this.hasAttribute('fluid');

        const html = `
            <img part="image" src="${src}" alt="${alt}" ${fluid ? 'class="fluid"' : ''}>
        `;

        this.root.innerHTML = html;
    }

    postConfig() {
        this.elems.image = this.root.querySelector('img');
    }

    attachEvents() {
        // Nenhum evento específico para este componente
    }

    update_src(val) {
        this.elems.image.src = val;
    }

    update_alt(val) {
        this.elems.image.alt = val;
    }

    update_fluid(val) {
        if (this.hasAttribute('fluid')) {
            this.elems.image.classList.add('fluid');
        } else {
            this.elems.image.classList.remove('fluid');
        }
    }
}

customElements.define('algol-image', AlgolImage);
