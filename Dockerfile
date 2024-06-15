FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./

WORKDIR /app/packages/discord-bot
COPY packages/discord-bot/package.json ./

WORKDIR /app
RUN npm ci

COPY tsconfig.json ./
COPY packages/discord-bot/ packages/discord-bot/
RUN npm run -w discord-bot build && npm prune --omit=dev

FROM node:22-bookworm-slim

WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules/ ./node_modules/

WORKDIR /app/packages/discord-bot
COPY packages/discord-bot/package.json ./
COPY --from=builder /app/packages/discord-bot/dist/ ./

WORKDIR /app
CMD ["node", "packages/discord-bot/index.js"]
EXPOSE 3000