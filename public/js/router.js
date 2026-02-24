// identifica a função de renderização da página, com base na URL
const urlRoutes = {
    404: render404,
    "/": renderHome,
    "/posts": renderPosts,
    "/publications": renderPublications,
};

/** função que gerencia a mudança dinâmica de conteúdo */
const spa_container = document.getElementById('spa-container');
const handleLocation = async () => {
    const path = window.location.pathname; // captura o caminho da url
    const renderPage = urlRoutes[path] || urlRoutes[404]; // seleciona a função, com base na rota
    renderPage(spa_container); // invoca a funçao correta de renderização
}   

// função de roteamento (invocada pelos links do menu)
const route = (event) =>{
    event.preventDefault(); // impede recarregar a página
    window.history.pushState({},"",event.currentTarget.href); // atualiza a URL com base na opção que voi clicada
    handleLocation(); // handleLocation será a função que troca o conteúdo
}

window.onpopstate = handleLocation; // para quando o usuário usar os botões de avançar e voltar
window.route = route; // Expõe a função route no escopo global para que os onclick="route(event)" funcionem
handleLocation(); // Garante que a rota inicial seja processada no carregamento