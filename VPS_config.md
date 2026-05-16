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

# 02 instalar o nginx
sudo apt update
sudo apt install -y nginx
sudo systemctl status nginx

# 03 configurar os subdomínios no nginx
sudo nano /etc/nginx/sites-available/algol.dev

# a. Site Principal: algol.dev
server {
    listen 8000;
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
server {
    listen 8001;
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

# 04 ativar a configuração criando o link simbólico na pasta de sites ativos:
sudo ln -s /etc/nginx/sites-available/algol.dev /etc/nginx/sites-enabled/

# 05 Remover o link simbólico do site padrão
sudo rm /etc/nginx/sites-enabled/default

# 06 testar a configuração:
sudo nginx -t

# 07 recarregar o nginx:
sudo systemctl restart nginx

# ------------------------------------------------------
# Criar o site algol.dev do zero com o bun + elysia
# pode ignorar essa etapa se fizer o git clone diretamente no pasta ~/apps/
# ------------------------------------------------------


# 1 - Navegue até a pasta onde deseja criar o projeto e iniciar um projeto bun+elysia
cd ~/apps/algol-main
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
# Testando o app no navegador (apenas na minha rede local)
# ------------------------------------------------------

# usar esses endereços no browser
http://192.168.253.129:8000/
http://192.168.253.129:8001/


# ------------------------------------------------------
# Agendar inicialização com Systemd
# ------------------------------------------------------

# 1 - Criar os serviços no systemd (um para cada aplicação)
sudo nano /etc/systemd/system/algol-web.service

[Unit]
Description=Algol Web - Bun Application
After=network.target

[Service]
Type=simple
User=vps
WorkingDirectory=/home/vps/apps/algol-web
ExecStart=/home/vps/.bun/bin/bun run index.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# ------

sudo nano /etc/systemd/system/cegesp.service

[Unit]
Description=CEGESP - Bun Application
After=network.target

[Service]
Type=simple
User=vps
WorkingDirectory=/home/vps/apps/cegesp.algol.dev
ExecStart=/home/vps/.bun/bin/bun run index.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# 2 - Recarrega o motor de serviços do Linux
sudo systemctl daemon-reload

# 3 - Ativa e inicia os seviços criados para as aplicações
sudo systemctl enable --now algol-web.service
sudo systemctl enable --now cegesp.service

# 4 - Verifica o status
sudo systemctl status algol-web
sudo systemctl status cegesp

# 5 - ver logs em tempo real
sudo journalctl -u algol-web -f
sudo journalctl -u cegesp -f

# 6 - atualizar o serviço (apos atualizar o código)
sudo systemctl restart algol-web
sudo systemctl restart cegesp