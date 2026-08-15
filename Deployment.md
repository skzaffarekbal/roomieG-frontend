# RoomieG Deployment

- Sign up in AWS
- Go EC2 Services
- Select ubuntu and create secret key and download <secret>.pem file 
- Launch Instances
- Open an SSH client
- Locate or download your private key file
- Ensure your key is not publicly viewable. ```chmod 400 "<secret>.pem"```
- Connect to your instance using its Public DNS. ```ssh -i "<secret>.pem" ubuntu@ec2-54-252-229-150.ap-southeast-2.compute.amazonaws.com```
- install nvm and node version 24.18.0

- clone both frontend and backend project on server machine

## Frontend deployment
- install package ```npm i```
- build the project ```npm run build```
- run ```sudo apt update```
- install nginx on server ```sudo apt install nginx```
- check nginx status ```sudo systemctl status nginx```
- start nginx ```sudo systemctl start nginx```
- enable nginx ```sudo systemctl enable nginx```
- copy code from dist(build files) to /var/www/html/
- ```sudo scp -r dist/* /var/www/html/```
- Go to Public IPv4 address and enable port 80 of your instance.
- AWS Console → EC2 → Instances → your instance → Security → Security groups → Inbound rules → Add Port 80

## Backend deployment
- install package ```npm i```
- add .env ```nano .env```
- Allow EC2 instance public IP on mongoDB server.
- Go to Public IPv4 address and enable port 7777 of your instance for backend
- AWS Console → EC2 → Instances → your instance → Security → Security groups → Inbound rules → Add 
- install PM2 ```npm i pm2 -g```
- Start server ```pm2 start npm --name <project_name> -- start``` 
- Now check on http:PUBLIC_IP:7777

### Do a proxy pass for my backend URL to '/api' instead of the port 7777
```
Current:
http://54.252.229.150:7777/feed

Desired:
http://54.252.229.150/api/feed
```
- Find the nginx config ```ls /etc/nginx/sites-available/``` probably see: ```default```
- Open it : ```sudo nano /etc/nginx/sites-available/default```
- add this section
```
server_name 54.252.229.150;
location /api/ {
    proxy_pass http://127.0.0.1:7777/;

    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

So your config might look like:
```
server {
    listen 80;
    listen [::]:80;

    server_name 54.252.229.150;

    location /api/ {
        proxy_pass http://127.0.0.1:7777/;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- after that restart nginx ```sudo systemctl restart nginx```
- modify base URL in frontend project to ```/api```

### When reload frontend 404 Not Found nginx/1.28.3 (Ubuntu) ERROR
- This is a different Nginx issue, and it's very common with React SPAs.```/login``` route works when navigating inside the app, but when refresh: http://54.252.229.150/login the browser sends a new request directly to Nginx: ```GET /login```

- Nginx looks for a real /login file/folder and returns:
```
404 Not Found
nginx/1.28.3
```

- Fix: add try_files ```sudo nano /etc/nginx/sites-available/default```
```
location / {
    try_files $uri $uri/ /index.html;
}
```

- Where old code was
```
location / {
    try_files $uri $uri/ =404;
}
```


## Important
- An unexpected process occupying a port, don't just restart the manager. Check: ```sudo ss -lntp | grep :7777```
- Then identify the PID: ```ps -fp <PID>```
- And if necessary: ```sudo kill <PID>```
```
pm2 list
pm2 logs <project_name>
pm2 flush npm
pm2 restart <project_name>
pm2 stop <project_name>
pm2 delete <project_name>
pm2 save
```

## Add custom domain
- Purchased domain name from ```godaddy.com```
- signup on ```cloudflare``` & add a new domain name
- change the nameservers on godaddy and point it to cloudflare
- Add DNS record: roomieg.in to 54.252.229.150 ```cloudflare```
```
Type    Name    Content
─────────────────────────────────
A       @       54.252.229.150
CNAME   www     roomieg.in
```
- Enable SSL for website 
- Add PORT 443 for https in Inbound rules
```
HTTP       TCP 80   0.0.0.0/0
Custom TCP TCP 7777 0.0.0.0/0
HTTPS      TCP 443  0.0.0.0/0
```
