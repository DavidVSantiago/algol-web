import { count, eq, getTableColumns} from "drizzle-orm";
import { Database } from "../database";
import { posts, idioms } from "../schema";
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
    // Atualizamos a Promise para refletir que agora o objeto traz um campo extra
    public async getPost(slug: string): Promise<(Posts & { idiom_name: string }) | undefined> {
        const result = await this.db.select({
            ...getTableColumns(posts), // Despeja todas as colunas da tabela posts
            idiom_name: idioms.name    // Adiciona o campo específico da tabela idioms
        })
        .from(posts)
        .innerJoin(idioms, eq(posts.idioms_id, idioms.id)) // Realiza o Join
        .where(eq(posts.slug, slug))
        .limit(1); 

        return result[0];
    }
    
    public async getSimplePosts(limit: number, lang: string): Promise<SimplePosts[]> {
        const result = await this.db.select({
            id: posts.id,
            title: posts.title,
            featured_image_url: posts.featured_image_url,
            slug: posts.slug,
            excerpt: posts.excerpt,
            idioms_id: posts.idioms_id
        })
        .from(posts)
        .innerJoin(idioms, eq(posts.idioms_id, idioms.id))
        .where(eq(idioms.name, lang.toLowerCase()))
        .limit(limit); // otimização para retornar a quantidade solicitada (-1 == todos)
        return result;
    }
    public async getPaginatedPosts(page: number, limit: number, lang: string){
        const offset = (page - 1) * limit; // calcula o offset, de onde devemos começar a buscar

        // usa uma Promisse.all para obter o máximo de desempenho em consultas simultâneas
        const [countPosts, data] = await Promise.all([ // passa um array de promisses, no caso, duas consultas
            // consulta de contagem do total de artigos no banco
            this.db.select({total: count()})
            .from(posts)
            .innerJoin(idioms, eq(posts.idioms_id,idioms.id))
            .where(eq(idioms.name,lang.toLowerCase())), // para restringir ao idioma da página

            this.db.select({
                id: posts.id,
                title: posts.title,
                featured_image_url: posts.featured_image_url,
                slug: posts.slug,
                excerpt: posts.excerpt,
                idioms_id: posts.idioms_id
            })
            .from(posts).innerJoin(idioms,eq(posts.idioms_id,idioms.id))
            .where(eq(idioms.name,lang.toLowerCase()))
            .limit(limit) // para obter até uma certa quantidade (paginação)
            .offset(offset) // para pular (paginação)
        ]);

        const totalCount = countPosts[0].total; // obtém o resultado da primeira consulta
        
        // retorna um objeto estruturado, com os dados dos artigos e o total de artigos
        return{data,totalCount};
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
            category_id: item.category_id,
            idioms_id: item.idioms_id,
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