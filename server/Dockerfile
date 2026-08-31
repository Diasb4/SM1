FROM node:22-bookworm

WORKDIR /app

COPY package.json ./

RUN npm install

COPY src ./src

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

CMD ["node", "src/index.js"]
