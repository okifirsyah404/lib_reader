FROM node:lts-alpine AS builder

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run db:generate

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.* ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/public ./public

# RUN apk update && apk add openssl

EXPOSE 12021

VOLUME ["/app/node_modules", "/app/public"]

CMD ["npm", "run", "start:prod"]