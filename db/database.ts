import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from './schema';

/** Singleton do banco de dados */
export class Database{
    private static instance: Database; // singleton
    // atributos
    public readonly connection: LibSQLDatabase<typeof schema>;

    private constructor() {
        this.connection  = drizzle(createClient({url:"file:algol.db"}), {schema});
    }

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }
}