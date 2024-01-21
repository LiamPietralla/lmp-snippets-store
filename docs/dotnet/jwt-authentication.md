# JWT Authentication

## Overview

JWT authentication is a common authentication mechanism for web applications. It generally works well when using with APIs and SPAs. This article will cover how to implement JWT authentication in a .NET Core web application.

## Prerequisites

* .NET Core 8
* Visual Studio 2022

Note: This article assumes you are using a Windows development environment. If you are using a Mac or Linux, you will need to use the appropriate tools for your environment.

## Implementation

### Create a new .NET Core Web API Application

Open Visual Studio and create a new .NET Core Web API application. You can use the default template.

### Create an Authenticated Route

We will get started by creating a new authenticated route that will return the default weather forecast data. This will be the only route that requires authentication. We will be able to use this route to ensure that our authentication is working properly.

Simply add the following code to the `WeatherForecastController` class. You will need to add the `using using Microsoft.AspNetCore.Authorization;` namespace.

```csharp
[Authorize]
[HttpGet("auth")]
public IEnumerable<WeatherForecast> GetAuthenicated()
{
    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        TemperatureC = Random.Shared.Next(-20, 55),
        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
    })
    .ToArray();
}
```

### Add JWT Authentication

We will now add JWT authentication to our application. We will be using the `Microsoft.AspNetCore.Authentication.JwtBearer` package to handle the authentication. This package will need to be installed via NuGet.

Open the Program.cs file and add the following code before the `builder.Build()` call.

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    });
```

In the above we are adding a default JWT authentication scheme and configuring it to use the values pulled from our configuration sources. In this case we will add them to the appsettings.json, however in a production application you would want to use a more secure method of storing these values.

::: tip

You can use the [Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-6.0&tabs=windows) to store your secrets locally.

:::

```json
{
  "Jwt": {
    "Key": "ThisIsMySuperSecretKeyForTheDevEnvironment",
    "Issuer": "https://localhost:5001",
    "Audience": "https://localhost:5001",
    "ExpireMinutes": 20
  }
}
```

### Create a Login Method

We will now create a login method that will return a JWT token. This token will be used to authenticate the user for future requests.

Add the following code to the `WeatherForecastController` class.

First we will need to inject an IConfiguration instance into the controller. This will allow us to access the configuration values we added earlier.

```csharp
private readonly IConfiguration _configuration;

public WeatherForecastController(ILogger<WeatherForecastController> logger, IConfiguration configuration)
{
    _logger = logger;
    _configuration = configuration;
}
```

We can then fill out the login method as below:

::: warning

This is a very basic implementation of a login method. In a production application you would want to use a more secure method of storing and retrieving user credentials.

:::

```csharp
[AllowAnonymous]
[HttpPost("login")]
public IActionResult Login([FromBody] string username, [FromBody] string password)
{
    if (username == "username" && password == "password")
    {
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expireMinutes = Convert.ToInt32(_configuration["Jwt:ExpireMinutes"]);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Name, username)
            }),
            Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var createdToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(createdToken);

        return Ok(token);
    }

    return Unauthorized();
}
```

At this stage we can do some testing to ensure out methods are working as expected. Start the API project and then use the default Swagger UI to test the following:

* GET /weatherforecast/auth - This should return a 401 Unauthorized response.
* GET /weatherforecast - This should return a 200 OK response.
* POST /weatherforecast/login - Try this with both valid and invalid credentials, you should get a 200 OK response with a token when using valid credentials.

### Setting up Swagger UI to allow authentication

Finally for us to test if our authentication is working we will need to configure Swagger UI to allow us to pass the token in the request header. Simple reaplace the `builder.Services.AddSwaggerGen()` call in the Program.cs file with the following:

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});
``` 

To test this out, start the API project and then use the login method to get a token. You can then click the Authorize button in the Swagger UI and enter the token.

You should now be able to access the authenticated route. If you try to access the route without the token you should get a 401 Unauthorized response.

## Conclusion

In this article we have covered how to implement JWT authentication in a .NET Core web application. We have also covered how to test the authentication using Swagger UI.