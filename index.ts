import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static'; // para servir html, css, js, etc
import { siteRoutes } from './routes/acesso_site'; //    
import { apiRoutes } from './routes/rest_api';

// const IMAGE_BUCKET = 'https://algol-bucket.b-cdn.net';
const IMAGE_BUCKET = 'http://localhost:8080';

export const app = new Elysia()
    .decorate('IMAGE_BUCKET', IMAGE_BUCKET) // torna a variável global
    // Rota de saúde (sempre bom manter no principal)
    .use(staticPlugin({ // para servir arquivos estáticos (html, css, js, etc)
        assets: 'public', // Pasta onde estão seus arquivos
        prefix: '/'       // Onde eles estarão disponíveis na URL
    }))
    .use(siteRoutes)
    // .use(apiRoutes)
    .listen(8080);

console.log(`🦊 Servidor modular rodando em ${app.server?.hostname}:${app.server?.port}`);