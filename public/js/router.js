// identifica a a classe da página associada a cada rota
const urlRoutes = {
    "/": PageHome,
    "/posts": PagePosts,
    "/publications": PagePublications,
    "/courses": PageCourses,
    404: Page404,
};

// função de roteamento (invocada pelos links do menu)
const route = (event) =>{
    event.preventDefault(); // impede recarregar a página
    window.history.pushState({},"",event.currentTarget.href); // atualiza a URL com base na opção que voi clicada
    handleLocation(); // handleLocation será a função que troca o conteúdo
}

/** função que gerencia a mudança dinâmica de conteúdo */
const spa_container = document.getElementById('spa-container');
const handleLocation = async () => {
    const path = window.location.pathname; // captura o caminho da url
    let pageClass = urlRoutes[path]; // seleciona a classe(página), com base na rota
    let slug = null;
    let params = {}; // Objeto de parâmetros para passar para as páginas

    // Se a rota não existir no dicionário, assumimos que é uma página Single (rota dinâmica na raiz)
    if (!pageClass) {
        // Remove a primeira barra para extrair o slug (ex: "/java-linguagem" -> "java-linguagem")
        slug = path.substring(1);
        // Evita erro caso o path seja apenas uma barra solta ou algo bizarro não mapeado
        if (slug.length > 0) {
            pageClass = PageSingle; // Direciona para a página do post
            params = { slug } // passa o slug do artigo a ser carregado para a página single
        } else {
            pageClass = urlRoutes[404];
        }
    }

    // Remove o estilo da página anterior, se existir ---
    const oldStyle = document.getElementById('dynamic-page-style');
    if (oldStyle) {
        oldStyle.remove();
    }

    const page = new pageClass(spa_container, params) // instancia a classe da página da rota atual
    page.render(); // invoca a funçao de renderização da página
}

window.onpopstate = handleLocation; // para quando o usuário usar os botões de avançar e voltar
window.route = route; // Expõe a função route no escopo global para que os onclick="route(event)" funcionem
handleLocation(); // Garante que a rota inicial seja processada no carregamento