# LMP Snippets Store

A collection of handy code snippets and techniques that I have found useful so far in my career.

## Live Site

The live site can be found at [https://code.liampietralla.com/](https://code.liampietralla.com/).

### Running locally

To run the site locally, you will need to have [Node.js](https://nodejs.org/en/) installed. Once you have Node.js installed, you can run the following commands to get the site running locally:

```bash
# Install dependencies
yarn

# Run the dev server
yarn dev
```

### Deployment

The site is deployed using a custom infrastructure setup. Ansible configuration can be found in the `infra` directory which is used to deploy the lastest version of the site to a DigitalOcean droplet. The site is then served using Nginx.

Deployment occurs automatically when a new commit is pushed to the `main` branch. This is done using GitHub Actions.