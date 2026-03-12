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
    async render() {throw new Error("render() não implementado");}
    /** @abstract */
    async loadData() {throw new Error("loadData() não implementado");}
    
    /** ****************************************************** */
    /** MÉTODOS CONCRETOS ************************************ */
    /** ****************************************************** */
    
    /** Permite que os dados sejam salvos no cache, sem a necessidade das páginas implementarem (padrão CACHE-ASIDE) */
    async withCache(cacheKey, fetchCallback, isJson = false) {
        const cachedData = sessionStorage.getItem(cacheKey); // tenta obter o cache informado
        if(cachedData) // se existir o cache
            return isJson? JSON.parse(cachedData) : cachedData; // retorna o cache em JSON ou em texto
        const freshData = await fetchCallback(); // se não encontrou, executa a regra do chamador
        const dataToCache = isJson? JSON.stringify(freshData): freshData; // prepara os dados para salvamento no cache
        sessionStorage.setItem(cacheKey,dataToCache); // salva no cache
        return freshData; // retorna os dados
    }

    getDataCacheKey(){ // id único para cache dos dados da página
        return `dataCache_${this.constructor.name}`;
    }

    getI18nCacheKey(){ // id único para o dicionário de traduções da página
        return `i18nCache_${this.constructor.name}`;
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

        const lang = document.documentElement.lang; // obtém o idioma atual do html
        
        try {
            
            const translationsData = await this.withCache(this.getI18nCacheKey(),async()=>{ // padrão CACHE-ASIDE
                this.container.innerHTML = `<h2 style="text-align: center; margin-top: 5vw;">Loading...</h2>`; // texto de loading
                // busca as traduções da página
                const response = await fetch(this.getTranslationPath());
                if (!response.ok) {throw new Error(`HTTP ${response.status}`);}
                const allTranslations = await response.json();
                return allTranslations; // retorna o json das traduções
            },true);
            
            this.t = translationsData[lang] || translationsData['pt-br'];
        
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