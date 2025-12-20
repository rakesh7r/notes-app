FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm serve && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
