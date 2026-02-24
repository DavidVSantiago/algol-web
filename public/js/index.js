const IMAGE_BUCKET = 'http://localhost:8080'; // fazer com que este valor seja enviado pleo servidor no request da rota '/'

// insere dinamicamente o menu da página.
function createMenu(){
    const page_content = document.getElementById('page-content');
    page_content.insertAdjacentHTML('afterbegin',`
        <algol-power-menu id="menu"
            logo="${IMAGE_BUCKET}/imagens/structural-site/logo_h.svg"
            logoalt="logo"
            logolink="/"
            logowidth = 91
            logoheight = 100
            logosize = "12vw"
            logosizebreak = "30vw"
            >
            <li><a href="/" onclick="route(event)">HOME</a></li>
            <li><a href="/posts" onclick="route(event)">ARTIGOS</a></li>
            <li><a href="/publications" onclick="route(event)">PUBLICAÇÕES</a></li>
            <li><a href="/courses" onclick="route(event)">CURSOS</a></li>
            <li>
                <algol-button type="submit">Botão simples</algol-button>
            </li>
        </algol-power-menu>
    `);
}
function createFooter(){
    const page_content = document.getElementById('page-content');
    page_content.insertAdjacentHTML('beforeend',`
        <algol-grid-layout cols="1fr" id="footer">
            <algol-grid-item>
                <algol-spacer value="1.2"></algol-spacer>
                <algol-image size="12vw" sizebreak = "30vw" 
                    src="${IMAGE_BUCKET}/imagens/structural-site/logo_h_pb.svg" alt="logo" width="91" height="100">
                </algol-image>
            </algol-grid-item>
            <algol-flex-item posh="stretch">
                <algol-spacer value="1.2"></algol-spacer>
                    <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                        <p>Inscreva-se&nbsp;</p>
                    </a>
                    <a href="https://www.youtube.com/channel/UCVJGac_RO3I-yIM77xLYrdw" target="_blank">
                        <algol-image size="1.6vw" sizebreak="5vw"
                            src="https://algol-bucket.b-cdn.net/imagens/structural-site/icon-youtube.svg" alt="logo" width="91" height="100">
                    </a>
            </algol-flex-item>
            <algol-flex-item>
                <algol-spacer value="1.2"></algol-spacer>   
                <p><a href="#">Termos de uso</a></p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                <p><a href="#">Política de privarcidade</a></p>
                <algol-spacer value="1.2"></algol-spacer>
            </algol-flex-item>
            <algol-grid-item id="ano" padding="1.5vw 0" posh="stretch">
                <p>©20xx Algol.dev. Todos os direitos reservados.</p>
            </algol-grid-item>
        </algol-grid-layout>
    `);
}
createMenu();
createFooter();