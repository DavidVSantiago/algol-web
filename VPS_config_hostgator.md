# Configurando a VPS ubuntu 22.04 (VPS localhost)

# instalar o redis
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl unzip redis-server

# Para garantir que o Redis já está rodando e configurado para iniciar junto com o sistema:
sudo systemctl enable redis-server
sudo systemctl status redis-server

# Instalar o bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version

# Instalar e configurar o proxy reverso NGINX

# 01 organizar as pastas das aplicações
mkdir -p ~/apps/algol.dev
mkdir -p ~/apps/cegesp.algol.dev
mkdir -p ~/apps/teethgram.algol.dev

# 02 instalar o nginx
sudo apt update
sudo apt install -y nginx
sudo systemctl status nginx

# 03 configurar os subdomínios no nginx

# a. Site Principal: algol.dev
sudo nano /etc/nginx/sites-available/algol.dev

server {
    listen 80;
    server_name algol.dev www.algol.dev;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# b. Sistema CEGESP: cegesp.algol.dev
nano /etc/nginx/sites-available/cegesp.algol.dev

server {
    listen 80;
    server_name cegesp.algol.dev;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# c. Sistema TEETHGRAM: teethgram.algol.dev
nano /etc/nginx/sites-available/teethgram.algol.dev

server {
    listen 80;
    server_name teethgram.algol.dev;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# d listar os sites ativos e os disponíveis
ls -l /etc/nginx/sites-available/
ls -l /etc/nginx/sites-enabled/

# 04 Remover o link simbólico do site padrão
sudo rm /etc/nginx/sites-enabled/default

# 05 ativar a configuração criando o link simbólico na pasta de sites ativos:
sudo ln -s /etc/nginx/sites-available/algol.dev /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/cegesp.algol.dev /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/teethgram.algol.dev /etc/nginx/sites-enabled/

# 06 testar a configuração:
sudo nginx -t

# 07 recarregar o nginx:
sudo systemctl restart nginx

# ------------------------------------------------------
# Criar o site algol.dev do zero com o bun + elysia
# pode ignorar essa etapa se fizer o git clone diretamente no pasta ~/apps/
# ------------------------------------------------------

# 1 - Navegue até a pasta onde deseja criar o projeto e iniciar um projeto bun+elysia
cd ~/apps/algol.dev
bun init -y
bun add elysia

# alterar o index.txt
nano index.ts

import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => ({
    status: "online",
    message: "Hello World do site principal: algol.dev",
    timestamp: new Date()
  }))
  .listen(3000)

console.log('🚀 App Principal rodando na porta 3000')

# 2 - rodar a aplicação (o console trava, precisa deixar ele rodando em segundo plano)
bun run index.ts

# ------------------------------------------------------
# Colocar HTTPS (SSL)
# ------------------------------------------------------

# 01 - Instalar o Certbot (Gerador de SSL)
sudo apt install -y certbot python3-certbot-nginx

# 02 - desativar o cdn no bunny.net

# 03 - Gerar os certificados
sudo certbot --nginx -d algol.dev -d www.algol.dev
sudo certbot --nginx -d cegesp.algol.dev
sudo certbot --nginx -d teethgram.algol.dev

# 04 - reativar o cdn no bunny.net

# ------------------------------------------------------
# Faça os redirecionamentos no Bunny.net para apontar para o ip da VPS
# ------------------------------------------------------

# ------------------------------------------------------
# Testando o app no navegador (apenas na minha rede local)
# ------------------------------------------------------
# 01 - rode cada aplicação com o bun index.ts (bloqueia o console)

# usar os endereços no browser
https://algol.dev
https://cegesp.algol.dev
https://teethgram.algol.dev

# ------------------------------------------------------
# Agendar inicialização com Systemd
# ------------------------------------------------------

# 1 - Criar os serviços no systemd (um para cada aplicação)
sudo nano /etc/systemd/system/algol.dev.service

[Unit]
Description=algol.dev - Bun Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/apps/algol.dev
ExecStart=/root/.bun/bin/bun run index.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# ------

sudo nano /etc/systemd/system/cegesp.algol.dev.service

[Unit]
Description=cegesp.algol.dev - Bun Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/apps/cegesp.algol.dev
ExecStart=/root/.bun/bin/bun run index.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# ------

sudo nano /etc/systemd/system/teethgram.algol.dev.service

[Unit]
Description=teethgram.algol.dev - Bun Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/apps/teethgram.algol.dev
ExecStart=/root/.bun/bin/bun run index.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# 2 - Recarrega o motor de serviços do Linux
systemctl daemon-reload

# 3 - Ativa e inicia os seviços criados para as aplicações
systemctl enable --now algol.dev.service
systemctl enable --now cegesp.algol.dev.service
systemctl enable --now teethgram.algol.dev.service

# 4 - Verifica o status
systemctl status algol.dev.service
systemctl status cegesp.algol.dev.service
systemctl status teethgram.algol.dev.service

# 5 - ver logs em tempo real
journalctl -u algol.dev.service -f
journalctl -u cegesp.algol.dev.service -f
journalctl -u teethgram.algol.dev.service   -f

# 6 - atualizar o serviço (apos atualizar o código)
systemctl restart algol.dev.service
systemctl restart cegesp.algol.dev.service
systemctl restart teethgram.algol.dev.service