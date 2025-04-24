# Étape 1 : Build Angular App avec Node.js
FROM node:18-alpine as angular

WORKDIR /app

# Copier tous les fichiers du projet Angular
COPY . .

# Installer les dépendances
RUN npm install --force

# Construire l'app Angular
RUN npm run build

# Étape 2 : Serveur HTTP avec Apache
FROM httpd:alpine3.15

WORKDIR /usr/local/apache2/htdocs

# Copier le build Angular depuis l'étape précédente
COPY --from=angular /app/dist/crm/browser .
