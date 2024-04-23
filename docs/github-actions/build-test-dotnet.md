# Build and Test .NET Core Applicatons

This action builds and tests .NET Core applications using the `dotnet` CLI. 

Building and testing .NET Core applications is a common task in CI/CD pipelines. I often like to ensure this step runs on all commits to the `main` branch, and any `feature/*` or `fix/*` branches.

## Minimal Pipeline Example

```yaml 
name: Build and Test .NET Core

on:
  push:
    branches:
    - main
    - feature/*  
    - fix/*

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
  
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
    
    - name: Restore dependencies
      run: dotnet restore ./path/to/project
      
    - name: Build
      run: dotnet build ./path/to/project --no-restore
      
    - name: Test
      run: dotnet test ./path/to/project --no-restore --no-build --verbosity normal
```

In the above pipeline only two main changes are required:
* Update the `path/to/project` to the path of your .NET Core project.
* Update the `dotnet-version` to the version of .NET Core you are using.