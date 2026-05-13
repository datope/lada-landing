FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY stats.json /usr/share/nginx/html/stats.json
COPY screenshots/ /usr/share/nginx/html/screenshots/

CMD sh -c "sed -i 's/listen\s*80/listen '"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
