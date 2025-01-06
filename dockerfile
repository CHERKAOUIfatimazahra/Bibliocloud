FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM base AS build

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY .env .env

EXPOSE 3000

CMD ["node", "dist/main"]
