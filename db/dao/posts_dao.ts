import { eq } from "drizzle-orm";
import { Database } from "../database";
import { posts } from "../schema";
import type { SimplePosts, Posts, NewPosts } from "../schema";
import postsData from "../../services/_mocks/full_posts.json";

/** DAO da tabela LINK */
export class PostsDAO{
    // atributos
    private db = Database.getInstance().connection;

    // Crud
    public async create(data: NewPosts): Promise<Posts|undefined>{
        // insere a informação no banco de dados e retorna o resultado
        const result = await this.db.insert(posts).values(data).returning();
        return result[0];
    }
    public async getPost(slug: string): Promise<Posts|undefined>{
        const result = await this.db.select() // equivale a select *
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1); // otimização para retornar apenas o primeiro resultado encontrado
        return result[0];
    }
    public async getSimplePosts(max: string): Promise<SimplePosts[]> {
        const result = await this.db.select({
            id: posts.id,
            title: posts.title,
            featured_image_url: posts.featured_image_url,
            slug: posts.slug
        })
        .from(posts)
        .limit(Number(max)); // otimização para retornar apenas o primeiro resultado encontrado
        return result;
    }
    // cRud
    // public async getRecentPosts(): Promise<RecentPost[]> {
    //     // Busca apenas os 6 primeiros registros
    //     const artigos = await this.db
    //     .select({
    //         id: posts.id,
    //         title: posts.title,
    //         featured_image_url: posts.featured_image_url,
    //     })
    //     .from(posts)
    //     .limit(6);

    //     return artigos;
    // }
    

    
    /*************************************************************************************** */
    /** FUNÇÕES DE SERVIÇO ***************************************************************** */
    /*************************************************************************************** */

    public async fillTable(): Promise<void> {
        // 1. Transformamos o JSON bruto no formato do Schema
        const formattedData = postsData.map((item) => ({
            date: Math.floor(new Date(item.date).getTime() / 1000),
            title: item.title,
            excerpt: item.excerpt,
            slug: item.slug,
            category_id: 1,
            idioms_id: 1,
            featured_image_url: item.featured_image_url,
            content: item.content,
        }));

        try {
            console.log(`⏳ Iniciando inserção de ${formattedData.length} registros...`);
            
            // 2. O "Pulo do Gato": Bulk Insert
            await this.db
                .insert(posts)
                .values(formattedData)
                // Se o slug já existir, ele pula o registro em vez de dar erro
                .onConflictDoNothing({ target: posts.slug });

            console.log("✅ Bulk Insert finalizado com sucesso!");
        } catch (error) {
            console.error("❌ Erro crítico no Bulk Insert:", error);
            throw error;
        }
    }
}