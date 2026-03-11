import { Elysia } from 'elysia';
import { PostsService } from '../services/posts_service';
import {globals} from '../utils/globals';

// Inicializa o banco de dados
const postsService = new PostsService();

export const apiRoutes = new Elysia({ prefix: '/api'})
    .use(globals) // para acessar as variáveis globais
    // --- MIDDLEWARE DE DELAY (Apenas para testes) ---
    .onBeforeHandle(async () => {
        await Bun.sleep(2000); // Congela a execução por 2000 milissegundos (2 segundos)
    })
    .get('/simple-posts/', async ({query }) => {
        const limit = Number(query.limit) || 6;
        const lang = query.lang || 'pt-br';
        return await postsService.getSimplePosts(limit, lang);
    })
    .get('/paginated-posts/', async ({ query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 6;
        const lang = query.lang || 'pt-br';
        return await postsService.getPaginatedPosts(page,limit,lang);
    })
    .get('/post/:slug', async ({ params }) => await postsService.getPost(params.slug))
;