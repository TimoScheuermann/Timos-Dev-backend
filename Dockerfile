FROM node:10.19.0 AS development

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --link-duplicates --ignore-optional
RUN rm -rf node_modules/sharp
RUN npm install --arch=x64 --platform=linux --target=8.10.0 sharp

COPY . .

RUN yarn build
RUN yarn install --production --link-duplicates --ignore-optional
RUN rm -rf node_modules/sharp
RUN npm install --arch=x64 --platform=linux --target=8.10.0 sharp

FROM node:10.19.0-alpine as production
EXPOSE 3000

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY ./*.json .
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]
