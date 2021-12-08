FROM node:16

WORKDIR /usr/src/lejardinier

RUN git clone --depth 1 --branch v3.2.2 https://github.com/valflrt/lejardinier-typescript.git .

COPY ./src/config/secrets.ts ./src/config/secrets.ts
COPY ./src/config/local.ts ./src/config/local.ts

RUN npm install

CMD ["npm", "start"]
