FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm install serve -g

RUN npm install vite -g

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "serve"]