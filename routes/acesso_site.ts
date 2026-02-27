/** Possui as rotas de acesso público do site */
import { Elysia, t } from 'elysia';

export const siteRoutes = new Elysia()
    .get('/', () => Bun.file('public/index.html'))
    .get('/posts', () => Bun.file('public/index.html'))
    .get('/publications', () => Bun.file('public/index.html'))
    .get('/courses', () => Bun.file('public/index.html'))
    .get('/*', async ({ path }) => {
        // Tenta mapear a URL para um arquivo físico na pasta public
        const file = Bun.file(`public${path}`);
        // Se o arquivo físico existir (ex: /css/style.css, /js/app.js, imagens)
        // O Bun automaticamente lida com os MIME Types corretos
        if (await file.exists()) {
            return file;
        }
        // Se o arquivo não existir, é uma rota do frontend (ex: /algoritmo-o-que-e)
        // Então fazemos o fallback para o index.html
        return Bun.file('public/index.html');
    })
;