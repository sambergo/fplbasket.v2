FROM node:24-bookworm-slim

ENV NODE_ENV=production
# Create app directory
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .
COPY .env.production .env


EXPOSE 3636
CMD [ "node", "dist/server.js" ]
USER node
