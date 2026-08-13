# ============================================================
# Stage 1: Build React application
# ============================================================

FROM node:22-alpine AS builder

WORKDIR /app

# API URL used by Vite at build time
ARG VITE_API_URL=http://localhost:8001

ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ============================================================
# Stage 2: Nginx
# ============================================================

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]