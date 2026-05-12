FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY stats.json /usr/share/nginx/html/stats.json
EXPOSE 80
