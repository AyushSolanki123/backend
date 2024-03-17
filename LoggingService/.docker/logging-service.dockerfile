FROM  node:16-alpine
LABEL author="Chatify Development Team"
WORKDIR /usr/src/logging-service
COPY package*.json ./
RUN npm i nodemon -g && npm i
RUN npx tsc
EXPOSE 3000
COPY . .
CMD ["npm", "start"]