import { Elysia } from 'elysia';
import { PostsService } from '../services/posts_service';
import {globals} from '../utils/globals';

// Inicializa o banco de dados
const postsService = new PostsService();

export const apiRoutes = new Elysia({ prefix: '/api'})
    .use(globals) // para acessar as variáveis globais
    .get('/posts', async () => { 

        const artigos = await postsService.getRecentPosts();
        return artigos
    },);