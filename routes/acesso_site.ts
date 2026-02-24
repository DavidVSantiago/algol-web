/** Possui as rotas de acesso público do site */
import { Elysia, t } from 'elysia';


export const siteRoutes = new Elysia()
    .get('/', () => Bun.file('public/index.html'))
    .get('*', ({ path, set }) => {
        // Se a rota não tem extensão (ex: /posts, /publications), entrega o SPA
        if (!path.includes('.')) {
            return Bun.file('public/index.html');
        }
        // Se tem extensão e chegou aqui, é porque o staticPlugin não achou o arquivo
        set.status = 404;
        return 'Arquivo não encontrado';
    })
;