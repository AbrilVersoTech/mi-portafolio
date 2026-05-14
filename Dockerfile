FROM nginx:alpine
# Copia el contenido de tu portafolio a la ruta de Nginx
COPY . /usr/share/nginx/html
EXPOSE 80