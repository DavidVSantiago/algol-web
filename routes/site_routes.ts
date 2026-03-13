/** Possui as rotas de acesso público do site */
import { Elysia, t } from 'elysia';

export const siteRoutes = new Elysia()
    .get('/*', async ({ path }) => {
        // Tenta mapear a URL para um arquivo físico na pasta public
        const file = Bun.file(`public${path}`);
        // Se o arquivo físico existir (ex: /css/style.css, /js/app.js, imagens)
        // O Bun automaticamente lida   com os MIME Types corretos
        if (await file.exists()) {
            return file;
        }

        // 💡 ATUALIZADO: Adicionamos txt e xml na lista
        if (path.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ttf|ico|json|txt|xml)$/i)) {
            return new Response('Not Found', { status: 404 });
        }

        // Se o arquivo não existir, é uma rota do frontend (ex: /algoritmo-o-que-e)
        // Então fazemos o fallback para o index.html
        return Bun.file('public/index.html');
    })
;