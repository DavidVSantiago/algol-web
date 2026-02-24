import { eq } from "drizzle-orm";
import { Database } from "../database";
import { posts } from "../schema";
import type { Posts, NewPosts, RecentPost } from "../schema";
import postsData from "../../utils/fillPosts/fillPosts.json";

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
    // cRud
    public async getRecentPosts(): Promise<RecentPost[]> {
        // Busca apenas os 6 primeiros registros
        const artigos = await this.db
        .select({
            id: posts.id,
            title: posts.title,
            featured_image_url: posts.featured_image_url,
        })
        .from(posts)
        .limit(6);

        return artigos;
    }
    
    public async fillTable(): Promise<void> {
        // 1. Transformamos o JSON bruto no formato do Schema
        const formattedData = postsData.map((item) => ({
            date: Math.floor(new Date(item.post_date).getTime() / 1000),
            title: item.post_title,
            excerpt: item.post_excerpt,
            slug: item.post_name,
            category_id: 1,
            idiom_id: 1,
            featured_image_url: item.thumb_url,
            content: "" // Campo obrigatório não nulo
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