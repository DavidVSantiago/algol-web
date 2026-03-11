import { Elysia } from 'elysia';
import { siteRoutes } from './routes/site_routes'; //    
import { apiRoutes } from './routes/api_routes';

// const IMAGE_BUCKET = 'https://algol-bucket.b-cdn.net';
// const IMAGE_BUCKET = 'http://localhost:8080';

export const app = new Elysia()
    // .decorate('IMAGE_BUCKET', IMAGE_BUCKET) // torna a variável global
    .use(apiRoutes)
    .use(siteRoutes)
    .listen(8080);

console.log(`🦊 Servidor modular rodando em ${app.server?.hostname}:${app.server?.port}`);