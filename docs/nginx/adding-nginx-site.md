# Adding a new site to Nginx in Ubuntu

This guide assumes you already have Nginx running on your server.

## Add an available site configuration

Create a new configuration file in the `/etc/nginx/sites-available` directory. The file will usually be titled after the domain or subdomain you are adding

```bash
sudo vim /etc/nginx/sites-available/example.com
```

For the file contents enter a valid nginx server block configuration. Here is an example:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
}
```

## Add the site configuration

Once the configuration file is setup we can enable it by creating a symbolic link to the `sites-enabled` directory.

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

## Test and Update Nginx

Test the configuration file for syntax errors:

```bash
sudo nginx -t
```

If the test is successful, reload Nginx to apply the changes:

```bash
sudo systemctl reload nginx
```