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
customElements.define('algol-layout', AlgolLayout);


/**  */

window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
});