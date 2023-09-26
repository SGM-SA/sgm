FROM nginx:stable-alpine

COPY dist/apps/web /usr/share/nginx/html
COPY infra/nginx/web.nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
