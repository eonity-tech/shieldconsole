# --- STAGE 1 : Build ---
FROM node:20-alpine as build

WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./
RUN npm install

# On copie tout le code source
COPY . .

# On lance la compilation
# Avec ton angular.json, cela va créer le dossier /app/dist/front-console/browser
RUN npm run build -- --configuration production

# --- STAGE 2 : Nginx ---
FROM nginx:alpine

# On copie ta config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🚨 LA LIGNE MAGIQUE CORRIGÉE 🚨
# On prend le dossier 'browser' créé par le nouveau builder d'Angular
COPY --from=build /app/dist/front-console/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]