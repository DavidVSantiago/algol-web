import { PostsDAO } from '../db/dao/posts_dao';
import { redis } from '../db/redis';
import { readFile } from 'node:fs/promises';
import type {SimplePosts, Posts} from '../db/schema';
import recentPosts from "./_mocks/recent_posts.json"
import simplePosts from "./_mocks/simple_posts.json"
import post from "./_mocks/post.json"

export class PostsService {
    private dao = new PostsDAO();
    private CACHE_KEY = 'posts:recentes';
    private CACHE_TTL = 3600; // Tempo de vida do cache em segundos (1 hora)

    // public async getHomePosts(): Promise<HomePosts[]> {
    //     // 1. Tenta buscar do Cache
    //     const cachedPosts = await redis.get(this.CACHE_KEY); //
        
    //     if (cachedPosts) { // Cache Hit
    //         console.log("Retornando posts do Redis Cache");
    //         return JSON.parse(cachedPosts);
    //     }

    //     // 2. Se não achou (Cache Miss), busca do banco através do DAO
    //     console.log("Cache Miss. Buscando do Banco...");
    //     const artigos = await this.dao.getRecentPosts();

    //     // 3. Salva no Redis para as próximas consultas
    //     if (artigos && artigos.length > 0) {
    //         await redis.set(
    //             this.CACHE_KEY, 
    //             JSON.stringify(artigos), 
    //             'EX', 
    //             this.CACHE_TTL
    //         );
    //     }

    //     return artigos;
    // }

    /** Retorna dados mockados */
    public async getSimplePosts(max: string): Promise<SimplePosts[]> {
        return await this.dao.getSimplePosts(max);
    }
    public async getPost(slug: string): Promise<Posts | undefined> {
        return await this.dao.getPost(slug);
    }
}