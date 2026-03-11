FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN mkdir -p /app/data

RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_PATH=./data/prime.db

CMD ["npm", "start"]
