FROM node:24-alpine3.21 AS build

RUN mkdir /rinxo

WORKDIR /rinxo

COPY package.json package.json
RUN npm install 

COPY . .

RUN npm run build

FROM nginx:alpine as production

EXPOSE 80

COPY --from=build /rinxo/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
