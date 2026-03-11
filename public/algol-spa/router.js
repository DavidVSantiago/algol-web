// Variável global para armazenar as rotas após o fetch
let config = { routes: {}, catchAll: null, notFound: null };
let menuContainer = null; // Vai guardar a referência do menu
let pageContainer = null; // Vai guardar a referência do DOM para renderização das páginas
let footerContainer = null; // Vai guardar a referência do footer

// Função para buscar o JSON dinamicamente
async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        config = await response.json();
    } catch (error) {
        console.error("Erro ao carregar config.json:", error);
    }
}

// O "motor de partida" do roteador
const initRouter = async (menuId, spaId, footerId) => {
    hideApp(); // esconde a aplicação inteira na tela

    pageContainer = document.getElementById(spaId); // obtem a ref do container das páginas
    menuContainer = document.getElementById(menuId); // obtem a ref do container do menu
    footerContainer = document.getElementById(footerId); // obtem a ref do container do footer

    if(!pageContainer){console.error(`[Router] Container principal '${spaId}' não encontrado.`); return;} // guard para id errado!
    await loadConfig(); // Carrega o arquivo de configurações da aplicação

    /** Insere o menu */
    if (config.layout?.menuClass && menuContainer) { // se a classe do menu foi definida nas configurações e o id de inserção correto foi passado
        try{
            const MenuClass = new Function(`return ${config.layout.menuClass}`)(); // obtem a referência da classe do menu
            if (MenuClass) {
                const menuComp = new MenuClass(menuContainer); // instancia a classe do menu
                await menuComp.start(); // monta o menu na tela
            }
        }catch (e) {
            console.error(`Falha ao montar Menu: Classe ${config.layout.menuClass} não encontrada.`);
        }
    }

    /** Insere o footer */
    if (config.layout?.footerClass && footerContainer) { // se a classe do menu foi definida nas configurações e o id de inserção correto foi passado
        try{
            const FooterClass = new Function(`return ${config.layout.footerClass}`)(); // obtem a referência da classe do footer
            if (FooterClass) {
                const footerComp = new FooterClass(footerContainer); // instancia a classe do footer
                await footerComp.start(); // monta o footer na tela
            }
        }catch (e) {
            console.error(`Falha ao montar Footer: Classe ${config.layout.footerClass} não encontrada.`);
        }
    }
    await handleLocation();   // Dispara a renderização da primeira rota acessada
    
    showApp() // traz de volta a aplicação na tela
}

// função de roteamento (invocada pelos links do menu)
const route = (event) =>{
    event.preventDefault(); // impede recarregar a página
    window.history.pushState({},"",event.currentTarget.href); // atualiza a URL com base na opção que voi clicada
    handleLocation(); // handleLocation será a função que troca o conteúdo
}

/** função que gerencia a mudança dinâmica de conteúdo */
const spa_container = document.getElementById('spa-container');
const handleLocation = async () => {
    if (!pageContainer) return; // guard

    await hideContent(); // apaga o conteúdo da página
    const path = window.location.pathname; // captura o caminho da url
    
    let pageClassName = config.routes.paths[path]; // retorna uma STRING (ex: "PageHome")
    let params = {}; // Objeto de parâmetros para passar para as páginas

    // Se a rota não existir nas configurações, assumimos que é uma página Single (rota dinâmica na raiz)
    if (!pageClassName) {
        // Quebra a URL em segmentos ignorando barras vazias (ex: "/curso/java" -> ["curso", "java"])
        const segments = path.split('/').filter(Boolean);
        if (segments.length > 0 && config.routes.catchAll) {
            pageClassName = config.routes.catchAll;
            // O roteador repassa os fragmentos genericamente. A classe da página decide o que fazer.
            params = { 
                segments, 
                fullPath: path,
                slug: segments[0] // Mantido temporariamente para não quebrar seu construtor atual do PageSingle
            }; 
        } else {
            pageClassName = config.routes.notFound;
        }
    }

    // Remove o estilo da página anterior, se existir ---
    const oldStyle = document.getElementById('dynamic-page-style');
    if (oldStyle) {oldStyle.remove();}

    try {
        const pageClass = new Function(`return ${pageClassName}`)();
        if (pageClass) {
            const page = new pageClass(pageContainer, params); 
            await page.start(); 
        } else {
            throw new Error("Classe não definida");
        }
    } catch (e) {
        console.error(`Falha ao instanciar a classe '${pageClassName}'. Verifique o config.json e os imports globais.`, e);
    }
    showContent();
}

// esconde toda a aplicação
function hideApp(){
    const app = document.getElementById("app")
    app.style.opacity = "0";
}
// Revela toda a aplicação
function showApp(){
    const app = document.getElementById("app")
    app.style.opacity = "1";
    app.style.transition = "opacity 0.3s ease-in-out";
}
// Esconde apenas o miolo da página e ESPERA a animação terminar
function hideContent() {
    return new Promise(resolve => {
        pageContainer.style.transition = "opacity 0.3s ease-in-out";
        pageContainer.style.opacity = "0";
        
        // para evitar o footer jump
        footerContainer.style.transition = "opacity 0.3s ease-in-out";
        footerContainer.style.opacity = "0";
        pageContainer.style.minHeight = pageContainer.offsetHeight + 'px';

        // Aguarda 300ms antes de liberar o Javascript
        setTimeout(() => {
            // Zera o scroll silenciosamente enquanto a tela está "apagada"
            window.scrollTo({ top: 0, behavior: 'instant' }); 
            resolve();
        }, 300); 
    });
}
// Revela o miolo da página
function showContent() {
    pageContainer.style.opacity = "1";        
    footerContainer.style.opacity = "1"; // para evitar o footer jump
    setTimeout(() => {
        pageContainer.style.minHeight = 'auto';
    }, 300);
}

window.onpopstate = handleLocation; // para quando o usuário usar os botões de avançar e voltar
window.route = route; // Expõe a função route no escopo global para que os onclick="route(event)" funcionem
window.initRouter = initRouter; // Expõe o inicializador
