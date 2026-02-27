/** Arquivo que possui a estrutura do banco de dados */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/** Tabela categorias */
export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

/** Tabela idioma */
export const idioms = sqliteTable('idioms', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

/** Tabela atigos */
export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: integer('date').notNull(),
    title: text('title').notNull(),
    // Removido .notNull() para permitir campos vazios
    excerpt: text('excerpt', { length: 400 }), 
    slug: text('slug').notNull().unique(),
    category_id: integer('category_id')
        .notNull()
        .references(() => categories.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
    }),
    idioms_id: integer('idioms_id')
        .notNull()
        .references(() => idioms.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
    }),
    featured_image_url: text('featured_image_url'),
    // Removido .notNull() para permitir campos vazios
    content: text('content') 
});

// Para gerar os tipos automaticamente
export type Posts = typeof posts.$inferSelect;
export type NewPosts = typeof posts.$inferInsert;

/** Tipo para especificar o retorno de posts resumidos*/
export type SimplePosts = Pick<Posts,"id" | "title" | "slug" | "featured_image_url">;
