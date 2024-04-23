# Run Entity Framework Core Migrations

Running Entity Framework Core migrations in a GitHub Actions pipeline is a common task. This action demonstrates how to run EF Core migrations in a GitHub Actions pipeline.

## Minimal Pipeline Example

In this example the pipeline will run the EF Core migrations on the `main` branch when a push event occurs. The pipeline runs this as part of a `publish` step, in most cases this will include other steps as well, but these have been omitted for brevity.

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
  deploy: 
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'  
    name: Deploy to Infrastructure
    runs-on: ubuntu-latest

    - name: Run Database Migrations
      run: |
        dotnet tool install --global dotnet-ef
        dotnet tool restore
        dotnet ef database update -p .path/to/project/Project.csproj -s ./path/to/project/Project.csproj --connection "$DATABASE_CONNECTION_STRING"
      env: 
        DATABASE_CONNECTION_STRING: ${{ secrets.DATABASE_CONNECTION_STRING }}
```

For this pipeline you will need to ensure that the database connection string is stored as a secret in the GitHub repository.

The above example also assumes that your project and startup project are the same and in the same directory, however you may need to adjust these slightly depending on your project setup. 