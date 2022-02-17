FROM node:16.14.0-alpine
EXPOSE 3000

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY . /home/app

ENTRYPOINT [ "npm" ]
CMD ["start"]
