FROM node:16

WORKDIR /usr/src/lejardinier

RUN git clone --depth 1 --branch v3.2.1 https://github.com/valflrt/lejardinier-typescript.git .

COPY ./src/config/secrets.ts ./src/config/secrets.ts

RUN npm install

CMD ["npm", "start"]
