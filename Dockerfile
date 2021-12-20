FROM node:16

WORKDIR /usr/src/lejardinier

COPY . .

RUN npm set timeout=100000
RUN npm install

CMD ["npm", "run", "prod"]
