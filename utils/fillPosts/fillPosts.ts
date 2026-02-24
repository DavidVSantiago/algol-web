// seed.ts
import { PostsDAO } from "../../db/dao/posts_dao"

const dao = new PostsDAO();
console.log("🚀 Populando banco de dados...");
await dao.fillTable();
process.exit(0);