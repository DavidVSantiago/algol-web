import { PostsDAO } from '../db/dao/posts_dao';
import { redis } from '../db/redis';
import type { RecentPost } from '../db/schema';

export class PostsService {
    private dao = new PostsDAO();
    private CACHE_KEY = 'posts:recentes';
    private CACHE_TTL = 3600; // Tempo de vida do cache em segundos (1 hora)

    public async getRecentPosts(): Promise<RecentPost[]> {
        // 1. Tenta buscar do Cache
        const cachedPosts = await redis.get(this.CACHE_KEY); //
        
        if (cachedPosts) { // Cache Hit
            console.log("Retornando posts do Redis Cache");
            return JSON.parse(cachedPosts);
        }

        // 2. Se não achou (Cache Miss), busca do banco através do DAO
        console.log("Cache Miss. Buscando do Banco...");
        const artigos = await this.dao.getRecentPosts();

        // 3. Salva no Redis para as próximas consultas
        if (artigos && artigos.length > 0) {
            await redis.set(
                this.CACHE_KEY, 
                JSON.stringify(artigos), 
                'EX', 
                this.CACHE_TTL
            );
        }

        return artigos;
    }
}