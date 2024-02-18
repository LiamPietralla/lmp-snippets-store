# Easy Reverse Proxy Config for Nginx

## Introduction

This guide will show you how to set up a reverse proxy for your web server using Nginx. A reverse proxy is a really handy tool that allows use to redirect traffic incoming to our server to a different location, for example to another web server, or to a different port. 

I find this most useful for redirecting requests to different dockerised services, but it can be used for many other things too.

## Config 

The config for a reverse proxy is really simple. Here's an example of a basic reverse proxy config:

```nginx
server {
    listen                  80;
    server_name             my-site.com

    location / {
        proxy_pass          http://localhost:5000;
        proxy_redirect      off;
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Host $server_name;
    }
}
```

This config will redirect all traffic coming to `my-site.com` to `http://localhost:5000`. This method will also easily allow you to add SSL to your services, as you can use the `certbot` tool to generate SSL certificates for your domain. Certbot will automatically configure this basic reverse proxy config to use SSL.
