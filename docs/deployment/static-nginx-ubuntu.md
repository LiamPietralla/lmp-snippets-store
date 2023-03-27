---
sidebar_position: 1
---

# Static Deployment with Nginx on Ubuntu using GitHub Actions

This guide will walk you through deploying a static site to a Ubuntu server using Nginx and GitHub Actions.

## Prerequisites
* A GitHub account
* A Ubuntu server with SSH access
* A domain name

## Step 1: Create a GitHub repository

Create a new GitHub repository and add your static site files to it. Elsewise use a existing repository where you have an application that either is a static site or can be built to a static site.

## Step 2: Create a GitHub Actions workflow

Create a new file in your repository called `.github/workflows/deploy.yml` and add the following content:

```yaml
name: Build and Deploy

on:
  # Run this pipeline for all pushes into main
  push:
    branches:
      - main

jobs:
  build:
    # Job name
    name: Build and Deploy
    
    # Run on ubuntu
    runs-on: ubuntu-latest

    steps:

      # Checkout Repository
      - name: Checkout Repository
        uses: actions/checkout@v3

      # Install Node
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      # Install Dependencies
      - name: Install Dependencies
        run: npm install

      # Build
      - name: Build
        run: npm run build

      # Deploy to remote server
      - name: Deploy to remote server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_KEY }}
          passphrase: ${{ secrets.SSH_KEY_PASSPHRASE }}
          rm: true
          source: "build/"
          target: "${{ secrets.REMOTE_DIR }}"
```

:::caution

You may need to adjust the build command in the `Build` step to match your build command.

:::

:::caution

You may need to adjust the `source` option for the `scp-action` to match your build output directory.

:::

## Step 3: Setup SSH access to your server

To be able to deploy to your server you need to setup SSH access to your server. You can do this by following creating a SSH key for the account you want to login as.

To generate a key using the default settings, run the following command:

```bash
ssh-keygen
```

When generating the key ensure you set a passphrase for the key, and record it as we will need it later.

This will generate a public and private key pair. The public key will be stored in `~/.ssh/id_rsa.pub` and the private key will be stored in `~/.ssh/id_rsa`.

:::caution

**Note**: you may have named the key something else when you generated it. If you did, you will need to use the name you gave it instead of `id_rsa`.

:::

To enable us to use key to sign in on our server we need to add the public key to the `authorized_keys` file on the server.

To do this we need to copy the contents of the public key file to the clipboard. You can do this by running the following command:

```bash
cat ~/.ssh/id_rsa.pub
```

:::caution

**Note**: you may have named the key something else when you generated it. If you did, you will need to use the name you gave it instead of `id_rsa`.

:::

Now that we have the public key we need to add it to the `authorized_keys` file on the server. To do this we need to login to the server and add the key to the file.

Login to the server and then append the public key to the `authorized_keys` file:

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

:::caution

**Note**: you may have named the key something else when you generated it. If you did, you will need to use the name you gave it instead of `id_rsa`.

:::

## Step 4: Add secrets to your repository

Now that we have setup SSH access to our server we need to add the SSH key to our repository as a secret.

The following secrets are required:

* `REMOTE_HOST` - The hostname or IP address of the server
* `REMOTE_USER` - The username to login to the server as
* `REMOTE_DIR` - The directory on the server to deploy to
* `SSH_KEY` - The private key to use to login to the server
* `SSH_KEY_PASSPHRASE` - The passphrase for the private key

To add a secret to your repository go to `Settings > Secrets > New repository secret`.

## Step 5: Deploy your site

Now that we have setup everything we can push our changes to the `main` branch and our site will be deployed to our server.

## Step 6: Setup Nginx

To serve our static site we need to setup Nginx. To do this we need to create a new Nginx configuration file in `/etc/nginx/sites-available/` and then symlink it to `/etc/nginx/sites-enabled/`.

Create a new file in `/etc/nginx/sites-available/` called `example.com` and add the following content:

```nginx
server {
    listen 80;

    server_name example.com;

    root /var/www/example.com;

    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

:::caution

You will need to adjust the `server_name` and `root` to match your domain name and deployment directory.

:::

Now that we have created the configuration file we need to symlink it to `/etc/nginx/sites-enabled/`:

```bash
ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com
```

:::caution

You will need to adjust the `example.com` to match the name of the configuration file you created.

:::

Now that we have created the configuration file we need to restart Nginx:

```bash
sudo systemctl restart nginx
```

## Step 7 (Optional): Setup HTTPS

To setup HTTPS we need to install `certbot` and then run the `certbot` command to generate a certificate for our domain.

To install `certbot` run the following command:

```bash
sudo apt install certbot python3-certbot-nginx
```

Now that we have installed `certbot` we can run the `certbot` command to generate a certificate for our domain:

```bash
sudo certbot --nginx -d example.com
```

:::caution

You will need to adjust the `example.com` to match your domain name.

:::

Now that we have generated a certificate we need to restart Nginx:

```bash
sudo systemctl restart nginx
```