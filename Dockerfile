FROM node:16

WORKDIR /usr/src/lejardinier

COPY . ./

RUN npm install

CMD ["npm", "start"]
