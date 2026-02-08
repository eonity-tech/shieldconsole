#!/bin/bash

# Couleurs pour le style
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_NAME="front-console"

echo -e "${BLUE}🚀 Démarrage de l'installation de l'Appliance Frontend : $PROJECT_NAME ${NC}"

# 1. Vérification de Node.js et Angular CLI
if ! command -v npm &> /dev/null
then
    echo -e "${RED}❌ npm n'est pas installé. Installe Node.js d'abord.${NC}"
    exit 1
fi

if ! command -v ng &> /dev/null
then
    echo -e "${BLUE}📦 Angular CLI non trouvé. Installation en cours...${NC}"
    npm install -g @angular/cli
else
    echo -e "${GREEN}✅ Angular CLI est déjà installé.${NC}"
fi

# 2. Création du projet Angular
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${RED}⚠️  Le dossier $PROJECT_NAME existe déjà. Suppression ou backup recommandé avant de relancer.${NC}"
    # exit 1 # Décommenter pour bloquer si le dossier existe
else
    echo -e "${BLUE}🔨 Création du projet Angular $PROJECT_NAME...${NC}"
    # --skip-git : Important car tu es déjà dans un repo git
    # --style=scss : Pour le style moderne
    # --ssr=false : Pas de rendu serveur (plus simple pour Nginx)
    ng new $PROJECT_NAME --style=scss --routing --skip-git --ssr=false --defaults
fi

# On rentre dans le dossier
cd $PROJECT_NAME

# 3. Création du fichier nginx.conf
echo -e "${BLUE}📄 Création de nginx.conf...${NC}"
cat <<EOF > nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
        expires 1y;
        add_header Pragma public;
        add_header Cache-Control "public";
    }
}
EOF

# 4. Création du Dockerfile
echo -e "${BLUE}🐳 Création du Dockerfile...${NC}"
cat <<EOF > Dockerfile
# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Note: Angular 17+ met les fichiers dans dist/$PROJECT_NAME/browser
COPY --from=build /app/dist/$PROJECT_NAME/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 5. Configuration de l'environnement de PROD (lien avec le backend)
echo -e "${BLUE}🔗 Configuration de l'environnement de production...${NC}"
mkdir -p src/environments
cat <<EOF > src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api/v1'
};
EOF

echo -e "${GREEN}✅ Installation terminée avec succès !${NC}"
echo -e "${BLUE}👉 Étapes suivantes :${NC}"
echo -e "   1. Copie tes composants (DeviceList, services...) dans $PROJECT_NAME/src/app/"
echo -e "   2. Retourne dans le dossier backend :"
echo -e "      cd ../cybershield-360/backend-protection"
echo -e "   3. Lance tout l'orchestre :"
echo -e "      docker compose up --build -d"