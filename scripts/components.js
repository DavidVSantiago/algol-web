/** Instanciação dos componentes customizados */
customElements.define('algol-btn-primary', BtnPrimary);
customElements.define('algol-btn-secondary', BtnSecondary);
customElements.define('algol-btn-outline', BtnOutline);
customElements.define('algol-btn-success', BtnSuccess);
customElements.define('algol-btn-danger', BtnDanger);
customElements.define('algol-btn-warning', BtnWarning);
customElements.define('algol-btn-info', BtnInfo);
customElements.define('algol-btn-link', BtnLink);
customElements.define('algol-input-text', InputText);
customElements.define('algol-input-email', InputEmail);
customElements.define('algol-input-password', InputPassword);
customElements.define('algol-input-number', InputNumber);
customElements.define('algol-textarea', TextArea);
customElements.define('algol-select', Select);
customElements.define('algol-grid-layout', GridLayout);
customElements.define('algol-grid-item', GridItem);


/**  */

window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
});


/**  */
var _lang = 'pt-BR';
var _dict = {};

async function load(lang) {
    if (this._lang === lang && Object.keys(this._dict).length) return;

    this._lang = lang;
    const res = await fetch(`/i18n/${lang}.json`);
    this._dict = await res.json();
}

function t(path, params = {}) {
    let text = path.split('.').reduce((o, k) => o?.[k], this._dict);
    if (!text) return `⚠️ ${path}`;

    Object.entries(params).forEach(([k, v]) => {
        text = text.replaceAll(`{${k}}`, v);
    });

    return text;
}