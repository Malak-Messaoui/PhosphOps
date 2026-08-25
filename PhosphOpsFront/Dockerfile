# ================================
# STAGE 1 : BUILD
# ================================
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json en premier (cache Docker)
COPY package*.json ./
RUN npm ci

# Copier le reste du code source
COPY . .

# Build de production (le dossier de sortie dépend du nom du projet dans angular.json,
# généralement dist/<nom-du-projet>)
RUN npm run build -- --configuration production

# ================================
# STAGE 2 : RUNTIME (nginx)
# ================================
FROM nginx:alpine

# Supprimer la config par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers buildés depuis le stage précédent
# ⚠️ IMPORTANT : adapter "phosphops-front" au vrai nom du dossier généré dans dist/
COPY --from=build /app/dist/phosph-ops-front/browser /usr/share/nginx/html

# Config nginx personnalisée pour gérer le routing Angular (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
