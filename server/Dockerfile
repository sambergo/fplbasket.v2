FROM node:16.14.0

# Create app directory
WORKDIR /app


COPY package.json ./

RUN npm install

COPY . .

CMD [ "node", "dist/server.js" ]


# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./
# RUN npm ci
# COPY ./server.js ./

# CMD ["npm","start"]
