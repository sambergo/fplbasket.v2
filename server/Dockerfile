FROM node:20

ENV NODE_ENV=production
# Create app directory
WORKDIR /app


COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install

COPY . .
COPY .env.production .env


EXPOSE 3636
CMD [ "node", "dist/server.js" ]
USER node

