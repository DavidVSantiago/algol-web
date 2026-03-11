/** Classe base de uma página SPA */
class PageBase {

    constructor(container, params = {}) {
        this.container = container; // container alvo da renderização
        this.params = params;
        this.t = null; // guardará todo o dicionario em memória
    }

    /** ****************************************************** */
    /** MÉTODOS ABSTRATOS ************************************ */
    /** ****************************************************** */

    /** @abstract */
    getPageId() {throw new Error("getPageId() deve retornar um identificador único da página");}
    /** @abstract */
    async render() {throw new Error("render() não implementado");}
    /** @abstract */
    async loadData() {throw new Error("loadData() não implementado");}
    
    /** ****************************************************** */
    /** MÉTODOS CONCRETOS ************************************ */
    /** ****************************************************** */
    
    getDataCacheKey(){ // id único para cache dos dados da página
        return `dataCache_${this.getPageId()}_${document.documentElement.lang}`;
    }

    getI18nCacheKey(){ // id único para o dicionário de traduções da página
        return `i18nCache_${this.getPageId()}`;
    }

    getTranslationPath() {
        return null;
    }

    async start(){
        await this.loadTranslations(); // 1. Aguarda as traduções estarem prontas
        await this.render(); // renderiza a página
    }

    async loadTranslations(){
        if (!this.getTranslationPath()) return; // Se a página não definiu tradução, ignora o i18n silenciosamente
        if (this.t) return; // se ja carregou, encerra

        const lang = document.documentElement.lang; // obtem o idioma atual do html

        try {
            // tenta buscar o dicionário no cache (para evitar fetch)
            const cachedI18n = sessionStorage.getItem(this.getI18nCacheKey());
            if(cachedI18n){ // se conseguiu recuperar o dicionario do cache
                const allTranslations = JSON.parse(cachedI18n); // desistringfica
                this.t = allTranslations[lang] || allTranslations['pt-br']; // obtém o objeto do idioma
                return;
            }

            // se não há cache, mostra msg de loading pra fazer fetch
            this.container.innerHTML = `<h2 style="text-align: center; margin-top: 5vw;">Loading...</h2>`;
            // busca as traduções da página
            const response = await fetch(this.getTranslationPath());
            if (!response.ok) {throw new Error(`HTTP ${response.status}`);}

            const allTranslations = await response.json();
            // Salva o JSON completo no cache
            sessionStorage.setItem(this.getI18nCacheKey(), JSON.stringify(allTranslations));
            // obtém o objeto do idioma
            this.t = allTranslations[lang] || allTranslations['pt-br'];
        } catch (error) {
            console.error("Erro no processamento de traduções:", error);
            // Fallback de emergência caso o arquivo falhe
            this.t = { loading: "Carregando...", error_load:  "Erro ao carregar traduções." }; 
        }
    }

    // Método utilitário para injetar CSS dinâmico
    injectStyle(cssString, id = 'dynamic-page-style') {
        if (document.getElementById(id)) return; // Evita duplicar estilos já injetados
        const style = document.createElement('style');
        style.id = id; // Mesmo ID que o roteador vai procurar para apagar
        style.textContent = cssString;
        document.head.appendChild(style);
    }
}