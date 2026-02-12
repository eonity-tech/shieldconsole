# Étape 1 : Build de l'application Angular
FROM node:20-alpine as build

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie tout le code source
COPY . .

# Compilation avec angular.json, cela va créer le dossier /app/dist/front-console/browser
RUN npm run build -- --configuration production

# Étape 2 : Serveur Nginx pour servir l'application Angular
FROM nginx:alpine

# Copie ta config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Dossier 'browser' créé par le nouveau builder d'Angular
COPY --from=build /app/dist/front-console/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]