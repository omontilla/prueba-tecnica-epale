FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

RUN apk add --no-cache ffmpeg

COPY . .

RUN npm run build

CMD ["node", "dist/main"]