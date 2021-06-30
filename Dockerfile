FROM node:latest AS builder

WORKDIR /app

COPY *.json ./
COPY yarn.lock .

RUN yarn install --link-duplicates --ignore-optional

COPY ./ ./

RUN yarn build
RUN yarn install --production --link-duplicates --ignore-optional

FROM node:alpine
EXPOSE 3000

WORKDIR /app

USER node
ENV NODE_ENV production

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

COPY ./*json /app/

CMD ["node", "--expose-gc", "dist/main.js" ]
