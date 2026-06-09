# ------------------------------------------------------
# FileBrowser
# ------------------------------------------------------

# 01 - baixar
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash

# 02 - Criar a Pasta de Configuração e o Banco de Dados
# Cria o diretório de configurações
mkdir -p /etc/filebrowser
# Inicializa o banco de dados vazio no lugar certo
filebrowser config init -d /etc/filebrowser/filebrowser.db

# 03 - Criar o Serviço no Systemd (Para o Cockpit gerenciar)
nano /etc/systemd/system/filebrowser.service

[Unit]
Description=File Browser - Gerenciador de Arquivos Web
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/etc/filebrowser
ExecStart=/usr/local/bin/filebrowser --port 9005 --address 0.0.0.0 --database /etc/filebrowser/filebrowser.db --root /
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# 04 - Ativar e Inicializar o Serviço
sudo systemctl daemon-reload
sudo systemctl enable --now filebrowser.service

# 05 - criar o registro A files (files.algol.dev) no bunny.net apontando para o ip da VPS (129.121.50.211)
lembrar de desativar o CDN


# 06 - Criar o arquivo de configuração no Nginx
nano /etc/nginx/sites-available/files.algol.dev

server {
    listen 80;
    server_name files.algol.dev;

    location / {
        proxy_pass http://127.0.0.1:9005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Opcional: Aumenta o limite de upload para você subir arquivos grandes pelo navegador
        client_max_body_size 500M;
    }
}

# 07 - Ativar o site e reiniciar o Nginx
# Cria o link simbólico
ln -s /etc/nginx/sites-available/files.algol.dev /etc/nginx/sites-enabled/
# Testa se o Nginx aprovou o código
nginx -t
# Se der "successful", reinicie o motor
systemctl restart nginx

# 08 - Blindar com o Certbot (SSL)
certbot --nginx -d files.algol.dev

# 09 - mudar a senha do filebrowser

# para o serviço
systemctl stop filebrowser

# Criar o seu usuário administrador customizado
filebrowser -d /etc/filebrowser/filebrowser.db users add admin '&*EeH$$$&S23JE@qtXxhT394O!00o%@#fTz4YM@%' --perm.admin

# ligar o serviço
systemctl start filebrowser

# verificar o status
systemctl status filebrowser

# OBS a pasta dos sites fica em /root/apps/


# ------------------------------------------------------
# Cockpit
# ------------------------------------------------------

# 01 - instalar o cockpit
apt update
apt install cockpit -y

# 02 - Ativar o Socket Otimizado
systemctl enable --now cockpit.socket


# 03 - Liberar a Porta 9090 no Firewall da Nuvem

# Liberação no Iptables
iptables -I INPUT -p tcp --dport 9090 -j ACCEPT
iptables-save | tee /etc/iptables/rules.v4

# Liberação no UFW (apenas por garantia)
ufw allow 9090/tcp
ufw reload

# 04 - Permitir o Login do usuário root (Crucial para a VPS)
nano /etc/cockpit/disallowed-users
# comentar a linha do root (com # root)

# Reinicie o serviço do Cockpit para aplicar a permissão:
systemctl restart cockpit

# 05 - O Primeiro Acesso para teste
https://129.121.50.211:9090
# acessa com o usuário root e senha da vps

# 06 - Criar o registro A na Bunny.net
Tipo: A
Nome: services
IP/Valor: 129.121.50.211
CDN Acceleration: Disabled

# 07 - Ensinar o Cockpit a aceitar o Proxy
nano /etc/cockpit/cockpit.conf

[WebService]
Origins = https://services.algol.dev
ProtocolHeader = X-Forwarded-Proto
AllowUnencrypted = true

# reiniciar o cockpit
systemctl restart cockpit

# 08 - Criar o arquivo no Nginx
nano /etc/nginx/sites-available/services.algol.dev

server {
    listen 80;
    server_name services.algol.dev;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_http_version 1.1;
        
        # Suporte a WebSockets (Terminal e Gráficos do Cockpit)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Cabeçalhos de identificação do visitante
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
# 09 - Ativar o link e Reiniciar o Nginx

# Cria o link simbólico
ln -s /etc/nginx/sites-available/services.algol.dev /etc/nginx/sites-enabled/

# Testa o código
nginx -t

# Reinicia o motor do Nginx
systemctl restart nginx

# 10 - Gerar o SSL (A Chave de Ouro)
certbot --nginx -d services.algol.dev

# 11 - reativar o cdn usar

# ------------------------------------------------------
# Nginx UI
# ------------------------------------------------------

# 01 - Baixar e executar o script oficial de instalação
bash -c "$(curl -L https://cloud.nginxui.com/install.sh)" @ install

# 02 - Verificar se o serviço iniciou corretamente
systemctl status nginx-ui


# 03 - Liberar a Porta 9000 no Firewall (Porta padrão do Nginx UI)

# Liberação no Iptables
iptables -I INPUT -p tcp --dport 9000 -j ACCEPT
iptables-save | tee /etc/iptables/rules.v4

# Liberação no UFW (apenas por garantia)
ufw allow 9000/tcp
ufw reload

# 04 - Resgatar o "Install Secret" (Senha temporária crucial)
# O sistema gera uma senha de uso único para você fazer o primeiro setup.
# Geralmente ela aparece no final da instalação, mas caso passe rápido, leia o arquivo:
cat /usr/local/etc/nginx-ui/.install_secret

# Copie o código gerado na tela.
2f2bed661252969ddda4d9ef673910145de1c0a894c4c3cea656dc483ee3bab0

# 04 - O Primeiro Acesso (Configuração Inicial no Navegador)
# Abra no navegador usando o IP da sua VPS e a porta 9000:
http://129.121.50.211:9000

# Passo a passo na tela:
# 1. Cole o "Install Secret" que você copiou do terminal.
# 2. Crie seu usuário de administrador e uma senha forte.
# 3. Na etapa do Nginx, ele detectará automaticamente as pastas de configuração 
#    (/etc/nginx/nginx.conf, sites-available, sites-enabled). Apenas confirme.

# 05 - Criar o registro A na Bunny.net
# Tipo: A
# Nome: nginx (ficará nginx.algol.dev)
# IP/Valor: 129.121.50.211
# CDN Acceleration: Disabled (desative momentaneamente para o Certbot funcionar)

# 06 - Criar a configuração do Nginx no terminal (Pela ÚLTIMA VEZ!)
# A partir de hoje, você fará tudo isso visualmente pelo próprio painel.
nano /etc/nginx/sites-available/nginx.algol.dev

# 07 - Ativar o site e reiniciar o motor do Nginx
ln -s /etc/nginx/sites-available/nginx.algol.dev /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 08 - Blindar com o Certbot (Gerar SSL)
certbot --nginx -d nginx.algol.dev