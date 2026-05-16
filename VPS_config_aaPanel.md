# -----------------------------------------------------------------------
# Configurando a VPS ubuntu 22.04 (VPS localhost) com o aaPanel
# -----------------------------------------------------------------------

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

# -----------------------------------------------------------------------
# Instalar e configurar aaPanel
# -----------------------------------------------------------------------

# 01 baixar e instalar o aaPanel (no ubuntu 22.04)

URL=https://www.aapanel.com/script/install_panel_en.sh && if [ -f /usr/bin/curl ];then curl -ksSO "$URL" ;else wget --no-check-certificate -O install_panel_en.sh "$URL";fi;bash install_panel_en.sh forum

# 02 - após instalação
Internet Address: https://45.190.34.85:37725/b2e1e74c
Internal Address: https://192.168.253.129:37725/b2e1e74c
username: j5nebjfv
password: decc3ec6