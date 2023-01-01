FROM node:alpine AS builder

LABEL maintainer="StarkSim<gooda159753@163.com>"

# make the 'src' folder the current working directory
WORKDIR /src
# copy 'package.json' to install dependencies
COPY package*.json ./
# install dependencies
RUN npm install
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN npm run build


FROM nginx:alpine
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# 将项目根目录下dist文件夹下的所有文件复制到镜像中 /usr/share/nginx/html/ 目录下
COPY --from=builder /src/dist/ /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]