# Dockerising a Blazor Web App

Dockerising a blazor web app is a simple process. The first step is to create a Dockerfile in the root of the project. The Dockerfile should contain the following:

```Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BlazorApp1/BlazorApp1.csproj", "BlazorApp1/"]
COPY ["BlazorApp1.Client/BlazorApp1.Client.csproj", "BlazorApp1.Client/"]
RUN dotnet restore "./BlazorApp1/BlazorApp1.csproj"
COPY . .
WORKDIR "/src/BlazorApp1"
RUN dotnet build "./BlazorApp1.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BlazorApp1.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BlazorApp1.dll"]
```

::: tip

The dockerfile has the HTTPS port disabled, so you can run the app on HTTP. If you want to enable HTTPS add `EXPOSE 8081`, however a reverse proxy like Nginx is recommended for production.

:::