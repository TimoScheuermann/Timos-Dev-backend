FROM node:12 AS builder

WORKDIR /app

COPY ./package.json ./

RUN npm config set ignore-script true
RUN npm i
RUN npm config set ignore-script false

COPY . .

RUN npm run build

FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/dist .
CMD ["node", "/app/main.js"]
