FROM nginx:latest

# Optional: Install additional packages within the container (if needed)
# RUN apk add --no-cache some-package

# Copy the Nginx configuration file (replace 'nginx.conf' with your actual filename)
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
