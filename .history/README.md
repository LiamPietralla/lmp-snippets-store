# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Deployment is done using a docker container. Build the docker image using the following command:

```
$ docker build -t code-website .
```

Then run the container using the following command:

```
$ docker run -d -p 80:80 code-website
```