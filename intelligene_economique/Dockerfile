# syntax=docker/dockerfile:1

# Dépendances (inclut dev pour builder Next)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# Build
FROM node:18-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copier uniquement le nécessaire
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
