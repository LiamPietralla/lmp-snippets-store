# Build and Publish a Docker Image

This action builds and publishes a Docker image to a container registry. For most of my projects I use DockerHub, but you could use this action and tweak it to use any container registry.

For publish docker images I usually restrict this to the `main` branch, however as this step is often just part of the CI pipeline, you will need some conditional logic to ensure the image is only published on the `main` branch (and not when the build is triggered by a `feature/*` or `fix/*` branch).

## Minimal Pipeline Example

```yaml
name: Build, Test & Publish

on:
  push:
    branches:
    - main
    - feature/*  
    - fix/*
  pull_request:
    branches:
    - main

jobs:
  publish:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    name: Build and Publish Container Image
    runs-on: ubuntu-latest
    
    needs:
    - build

    steps:
    - uses: actions/checkout@v3
  
    - name: Setup Docker Metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
          images: your-username/your-project
          tags: |
            type=raw,value=latest

    - name: Login to DockerHub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_TOKEN }}

    - name: Build and Push Docker Image to DockerHub
      uses: docker/build-push-action@v4 
      with:
        file: './path/to/project/Dockerfile'
        context: ./path/to/project
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
```

In the above pipeline a few changes will need to be made to suit the project you are working on:
* In the setup docker metadata step, update the `images` to your DockerHub username and the name of your project.
* In the build and push docker image step, update the `file` to the path of your Dockerfile, and the `context` to the path of your project.
* You will also need to add your docker username and docker token to your GitHub repository secrets. The `DOCKER_USERNAME` is your DockerHub username, and the `DOCKER_TOKEN` is a token generated from DockerHub.