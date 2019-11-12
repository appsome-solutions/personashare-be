FROM node:10.15.3-alpine

WORKDIR /app
COPY . .

RUN npm install -g yarn
RUN yarn install

EXPOSE 3000

CMD ["yarn","start:dev"]
