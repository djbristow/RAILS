Nginx Reverse Proxy

docker build -t dbristow/nginx-rp .
docker run -d -p 80:80 --name myReverseProxy dbristow/nginx-rp
