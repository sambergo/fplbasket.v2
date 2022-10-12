FROM node:16.14.0

ENV NODE_ENV=production
# Create app directory
WORKDIR /app


COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env

# RUN yarn build

EXPOSE 3636
CMD [ "node", "dist/server.js" ]
USER node

