FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp-key.json

EXPOSE 5173

CMD ["npm", "run", "dev"]
