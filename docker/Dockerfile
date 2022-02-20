# FROM node:lts-buster    
# ENV DEBIAN_FRONTEND=noninteractive    
  
# Install git on top of alpine.    
# RUN apt-get update
FROM node:16-alpine3.14

RUN mkdir /dist /app && chown node:node /app && \
  apk add --no-cache --virtual .persistent-deps bash && \
  npm install -g npm@8.5.1 && \
  npm install --silent --save-dev -g \
  typescript

# add app    
ADD ./src /app
ADD ./package.json /app
ADD ./package-lock.json /app
RUN chown -R node:node /app    

USER node:node    
  
# set working directory    
WORKDIR /app    

RUN mkdir ./node_modules && \
  npm install && \
  tsc --lib es2019,DOM ./Main.ts && \
  find . -name '*.ts' -exec rm {} \;

USER root
RUN npm -g uninstall --silent -g typescript
USER node:node

# start the app    
CMD ["node", "Main.js"]
