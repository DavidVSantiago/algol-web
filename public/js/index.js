const IMAGE_BUCKET = 'http://localhost:8080'; // fazer com que este valor seja enviado pleo servidor no request da rota '/'

// lê no localstorage o idioma atual
const currentLang = localStorage.getItem('app_lang') || 'pt-br';

// Dicionário de traduções globais (Menu e Footer)
const i18n = {
    "pt-br": {
        menu: {
            home: "HOME",
            articles: "ARTIGOS",
            publications: "PUBLICAÇÕES",
            courses: "CURSOS"
        },
        footer: {
            subscribe: "Inscreva-se",
            terms: "Termos de uso",
            privacy: "Política de privacidade",
            rights: "Todos os direitos reservados."
        }
    },
    "en-us": {
        menu: {
            home: "HOME",
            articles: "ARTICLES",
            publications: "PUBLICATIONS",
            courses: "COURSES"
        },
        footer: {
            subscribe: "Subscribe",
            terms: "Terms of use",
            privacy: "Privacy policy",
            rights: "All rights reserved."
        }
    }
};

document.documentElement.lang = currentLang; // atualiza o idioma da página

let t = null;

/** Função que carrega e monta a página */
async function initLayout() {
    try {
        hideApp();
        // Busca o dicionário global do site
        const response = await fetch('/js/index.json');
        const i18n = await response.json();
        
        // Atribui o nó correto do JSON (com fallback para pt-br caso algo falhe)
        t = i18n[currentLang] || i18n['pt-br'];

        // Só desenha a interface depois que 't' estiver preenchido
        createMenu();
        createFooter();
        await window.handleLocation();
        showApp();
    } catch (error) {
        console.error("Erro ao carregar o arquivo index.json:", error);
    }
}

// insere dinamicamente o menu da página.
function createMenu(){
    const page_content = document.getElementById('app');

    // Configura qual <option> de idioma do menu deve aparecer selecionado por padrão
    const selectPt = currentLang === 'pt-br' ? 'selected' : '';
    const selectEn = currentLang === 'en-us' ? 'selected' : '';

    page_content.insertAdjacentHTML('afterbegin',`
        <header>
        <algol-power-menu id="menu"
            logo="${IMAGE_BUCKET}/imagens/structural-site/logo_h.svg"
            logoalt="logo"
            logolink="/"
            logowidth = 91
            logoheight = 100
            logosize = "12vw"
            logosizebreak = "30vw"
            >
            <li><a href="/" onclick="route(event)">${t.menu.home}</a></li>
            <li><a href="/posts" onclick="route(event)">${t.menu.articles}</a></li>
            <li><a href="/publications" onclick="route(event)">${t.menu.publications}</a></li>
            <li>
                <algol-select name="select" id="select-lang">
                    <option value="pt-br" ${selectPt}>Português &#x1F1E7;&#x1F1F7;</option>  
                    <option value="en-us" ${selectEn}>English &#x1F1FA;&#x1F1F8;</option>
                </algol-select>
            </li>
        </algol-power-menu>
        </header>
    `);

    // evento para clique no seletor de idioma
    document.getElementById("select-lang").addEventListener('algol-change', function (e) {
        const selectedLang = e.detail.value;
        if (selectedLang !== currentLang) { // se a selecionada é diferente da atual
            changeLanguage(selectedLang);
        }
    });

    // eventos para recolher o menu quando houver clique nos botão (modo mobile)
    const butons = document.querySelectorAll('#menu li:has(a)');
    butons.forEach(button => {
        button.addEventListener("click", function (event) {
            console.log("FUNFOU!");
            document.getElementById('menu').hide();
        });
    });

}
function createFooter(){
    const page_content = document.getElementById('app');
    const currentYear = new Date().getFullYear(); // TODO Buscar do servidor
    page_content.insertAdjacentHTML('beforeend',`
        <footer>
        <algol-grid-layout cols="1fr" id="footer">
            <algol-grid-item>
                <algol-spacer value="1.2"></algol-spacer>
                <algol-image size="12vw" sizebreak = "30vw" 
                    src="${IMAGE_BUCKET}/imagens/structural-site/logo_h_pb.svg" alt="logo" width="91" height="100">
                </algol-image>
            </algol-grid-item>
            <algol-flex-item posh="stretch">
                <algol-spacer value="1.2" valuebreak="2"></algol-spacer>
                    <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                        <p>${t.footer.subscribe}&nbsp;</p>
                    </a>
                    <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                        <algol-image size="2vw" sizebreak="7vw"
                            src="https://algol-bucket.b-cdn.net/imagens/structural-site/icon-youtube.svg" alt="logo" width="91" height="100">
                    </a>
            </algol-flex-item>
            <algol-flex-item>
                <algol-spacer value="1.2" valuebreak="2"></algol-spacer>   
                <p><a href="#">${t.footer.terms}</a></p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                <p><a href="#">${t.footer.privacy}</a></p>
                <algol-spacer value="1.2"></algol-spacer>
            </algol-flex-item>
            <algol-grid-item id="ano" padding="1.5vw 0" posh="stretch">
                <p>©${currentYear} Algol.dev. ${t.footer.rights}.</p>
            </algol-grid-item>
        </algol-grid-layout>
        </footer>
    `);
}

function changeLanguage(newLang) {
    // 1. Salva a nova preferência no localstorage
    localStorage.setItem('app_lang', newLang);

    // 2. Limpa o sessionStorage. 
    // Como suas classes PageHome e PagePosts usam sessionStorage para evitar recarregar dados do Elysia,
    // nós precisamos limpar esse cache. Caso contrário, o layout muda para inglês, mas os posts continuam em português.
    sessionStorage.clear();

    // 3. Recarrega a página. 
    // Em uma SPA, o reload reinicia o JS, pega o novo 'app_lang' logo no início do script, 
    // refaz o menu/footer traduzidos e o router carrega a página atual com o idioma novo.
    window.location.reload();
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
        const container = document.getElementById("spa-container");
        const footer = document.getElementById("footer");
        if (!container) return resolve();
        
        container.style.transition = "opacity 0.3s ease-in-out";
        container.style.opacity = "0";
        
        // para evitar o footer jump
        if (footer) {
            footer.style.transition = "opacity 0.3s ease-in-out";
            footer.style.opacity = "0";
        }
        container.style.minHeight = container.offsetHeight + 'px';

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
    const container = document.getElementById("spa-container");
    if (container) {
        container.style.opacity = "1";        
        document.getElementById("footer").style.opacity = "1"; // para evitar o footer jump
        setTimeout(() => {
            container.style.minHeight = 'auto';
        }, 300);
    }
}

initLayout();