# para instalar
bun add elysia @elysiajs/static
bun add -d @types/bun
bun add ioredis

# configurar o redis no SO
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
redis-cli ping <!-- A resposta deve ser: PONG -->


# para rodar
bun drizzle-kit push <!-- para recriar o banco -->
bun run index.ts
bun --watch index.ts <!-- para recarregar automaticamente -->