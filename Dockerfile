FROM node:18.18.0-alpine3.18
RUN npm install -g pnpm

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY pnpm-lock.yaml package*.json  ./
RUN pnpm i
COPY --chown=app:app . .

EXPOSE 4000 


CMD ["pnpm", "dev"]