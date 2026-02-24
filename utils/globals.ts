import { Elysia } from 'elysia';

const IMAGE_BUCKET = 'https://algol-bucket.b-cdn.net';

// Criamos um plugin de configuração que guarda os decorators
export const globals = new Elysia({ name: 'globals' })
    .decorate('IMAGE_BUCKET', IMAGE_BUCKET);