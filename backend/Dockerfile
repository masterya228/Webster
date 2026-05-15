FROM node:20-alpine AS builder
WORKDIR /app
# Paths are relative to repo root (Railway uses repo root as Docker build context)
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY backend/package*.json ./
RUN mkdir -p uploads/images uploads/thumbnails uploads/avatars
EXPOSE 3001
CMD ["node", "dist/main"]
