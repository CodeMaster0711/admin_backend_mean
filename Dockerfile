FROM node:7.9.0
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
RUN mkdir /src
WORKDIR /src
RUN npm install nodemon -g
RUN npm install pm2 -g

RUN npm install

EXPOSE 3000

CMD pm2 start --watch --no-daemon processes.json
