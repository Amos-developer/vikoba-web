FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL=/api
ARG VITE_SESSION_IDLE_MINUTES=30
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SESSION_IDLE_MINUTES=${VITE_SESSION_IDLE_MINUTES}
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
