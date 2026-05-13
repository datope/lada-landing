FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY stats.json /usr/share/nginx/html/stats.json
COPY screenshots/ /usr/share/nginx/html/screenshots/
COPY russianroadsign.otf /usr/share/nginx/html/russianroadsign.otf
COPY NikkyouSans.ttf /usr/share/nginx/html/NikkyouSans.ttf
COPY nginx.conf /etc/nginx/nginx.conf

# Inject Railway PORT at startup
CMD sh -c "sed -i \"s/listen PORT/listen $PORT/g\" /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
