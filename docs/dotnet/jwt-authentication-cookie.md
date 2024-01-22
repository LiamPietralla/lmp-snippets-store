# JWT Authentication Stored in a Cookies

## Overview

Best practice for storing JWT tokens is to store them in a cookie. This is because cookies are automatically sent with every request to the server. This means that we do not need to manually add the token to the request header for every request. It also means that (assuming the cookie is set to HttpOnly) the token cannot be accessed by JavaScript. This is important as it prevents malicious JavaScript from accessing the token and sending it to a third party.

## Prerequisites

* Previous article completed: [JWT Authentication](./jwt-authentication.md)

Note: This article assumes you are using a Windows development environment. If you are using a Mac or Linux, you will need to use the appropriate tools for your environment.

## Implementation

### Open the JWT Authentication Project

We will start by opening the project we created in the previous article. This JWT Authentication project will be modified to store the JWT token in a cookie.

### Remove Swagger Bearer Authentication

We will start by removing the Swagger Bearer authentication. This is because we will be using cookies for authentication instead of a Bearer token and thus we no longer need to manually paste our token into the Swagger UI.

Simple open the `Program.cs` file and replace `builder.Services.AddSwaggerGen` section with the below:

```csharp
builder.Services.AddSwaggerGen();
```

This will remove the Bearer authentication from Swagger UI (i.e. the default setup).

### Update JWT Authentication to check cookies for JWT

We now need to update our JWT authentication to check for the JWT token in the cookies. We will do this by modifying the `AddJwtBearer` call in the `Program.cs` file. See changes below:

```csharp{15-26}
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

        o.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue(WeatherForecastController.ACCESS_TOKEN_NAME, out var accessToken))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };

    });
```

This will configure JWT authentication to check for the JWT token in the `WeatherForecastController.ACCESS_TOKEN_NAME` cookie. If the cookie is found, it will be used as the JWT token, otherwise no token will be used, and the request will be rejected as per normal.

### Add Cookie Authentication to the Controller

Open the `WeatherForecastController.cs` file and add the following code to the top of the class:

```csharp
public const string ACCESS_TOKEN_NAME = "X-Access-Token";
```

This will create a constant that we can use to reference the name of the cookie that will store our JWT token. 

In the same file, replace the `Ok(token)` line with the following:

```csharp
 Response.Cookies.Append(ACCESS_TOKEN_NAME, token, new CookieOptions
 {
     HttpOnly = true,
     Secure = true,
     SameSite = SameSiteMode.Strict,
     Expires = DateTime.UtcNow.AddMinutes(expireMinutes)
 });

 return Ok();
```

Here we are adding a HTTP only cookie to the response. This cookie will be used to store our JWT token. We are also setting the cookie to expire after 20 minutes (as per our configuration). This way when the JWT token expires, the cookie will also expire and the user will need to login again.

### Logout Method

We will now add a logout method to the controller. This method will be used to remove the JWT token cookie from the response. This will effectively log the user out of the application.

Add the following method to the `WeatherForecastController` class:

```csharp
[AllowAnonymous]
[HttpGet("logout")]
public IActionResult Logout()
{
    Response.Cookies.Delete(ACCESS_TOKEN_NAME);
    return Ok();
}
```

### Test the Authentication

We will now test the authentication using Swagger UI.

Start the application and then make the following requests:

* GET /weatherforecast/auth - This should return a 401 Unauthorized response.
* GET /weatherforecast - This should return a 200 OK response.
* POST /weatherforecast/login - Try this with both valid and invalid credentials, you should get a 200 OK response with when using valid credentials.
* GET /weatherforecast/auth - This should return a 200 OK response.
* GET /weatherforecast/logout - This should return a 200 OK response.
* GET /weatherforecast/auth - This should return a 401 Unauthorized response.

## Conclusion

We have now learnt how to update our JWT authentication to store the JWT token in a cookie. This is a more secure way of using JWTs with single page applications and also simplifies the process of authenticating requests as we no longer need to manually add the JWT token to the request header.