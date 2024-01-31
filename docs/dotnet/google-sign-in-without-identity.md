# Google Sign-In Without Identity

This guide will show you how to implement Google Sign-In without using the Identity framework. While Identity is a great framework, it can be overkill for some applications. Often we just want to use a third-party provider to authenticate a user and use default cookie or JWT authentication for the rest of the application.

## Prerequisites

* A Google account
* .NET 8 
* Visual Studio 2022

Note: This article assumes you are using a Windows development environment. If you are using a Mac or Linux, you will need to use the appropriate tools for your environment.


## Implementation

### Create a new .NET Core MVC Application

Open Visual Studio and create a new .NET Core MVC application. You can use the default template. I have called my project `GoogleAuthentication`.

::: warning

Ensure that when you create the project the 'None' option is selected for authentication. (Otherwise, you will need to remove the Identity framework later.)

:::

### Create a new Account Controller

Create a new blank MVC controller called `AccountController.cs`. This controller will be used to handle the Google Sign-In process.

Inject the configuration service into the controller so that we can access the Google Client ID from the `appsettings.json` file later.

After creating the controller and injecting the service the code should look like this:

```csharp
using Microsoft.AspNetCore.Mvc;

namespace GoogleAuthentication.Controllers
{
    public class AccountController(IConfiguration configuration) : Controller
    {
        private readonly IConfiguration _configuration = configuration;

        public IActionResult Index()
        {
            return View();
        }
    }
}
```

### Create a Login View

We will now add a `Login` method to the `AccountController`. This method will be used to redirect the user to the Google Sign-In page.

Start by creating a `LoginViewModel` in the `Models` folder. This view model will be used to pass the Google Client ID to the view.

```csharp
public class LoginViewModel
{
    public string GoogleClientId { get; set; } = null!;
}
```

Then the following code to the `AccountController` class:

```csharp
public IActionResult Login()
{
    LoginViewModel model = new()
    {
        GoogleClientId = _configuration["GoogleClientId"]!
    };

    return View(model);
}
```

This code will create a new `LoginViewModel` and pass the Google Client ID from the configuration to the view. At this state we can also remove the default `Index` method from the controller as we will not be using it.

Add a new view called `Login.cshtml` to the `Views/Account` folder. This view will be used to display the Google Sign-In button.

```razor
@model LoginViewModel
@{
    ViewData["Title"] = "Login";
}

<div class="row">
    <div class="column text-center">
        <h3>Please sign in with your Google Account</h3>
        <hr />
        <div id="buttonDiv" class="has-text-centered"></div>
    </div>
</div>

<form id="login-form" asp-asp-controller="Account" asp-action="Callback" method="post">
    <input type="hidden" name="jwt" />
</form>


@section Scripts {
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
        function handleCredentialResponse(response) {
            if (response.credential) {
                let form = document.getElementById('login-form');
                let jwt = document.getElementsByName('jwt')[0];
                jwt.value = response.credential;
                form.submit();
            }
        }

        window.onload = function () {
            google.accounts.id.initialize({
                client_id: "@Model.GoogleClientId",
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }  // customization attributes
            );
            google.accounts.id.prompt(); // also display the One Tap dialog
        }
    </script>
}
```

The above code will render the Google Sign-In button and handle the response from Google. When the user signs into google, the `handleCredentialResponse` function will be called and the authentication response from Google will be submitted as the data. This function will then submit the form with the JWT token (called credential in the response) as a hidden field.

### Create a Callback Method

Start by creating a model to represent the submitted form data.

```csharp
public class LoginRequestViewModel
{
    public string Jwt { get; set; } = string.Empty;
}
```

We will now create a `Callback` method in the `AccountController`. This method will be used to handle the response from Google and then perform the authentication step that our appliation requires.

Add the following code to the `AccountController` class:

```csharp{19-20}
[HttpPost]
public async Task<IActionResult> Callback(LoginRequestViewModel login)
{

    // If the jwt token is empty then user is not authorized
    if (string.IsNullOrEmpty(login.Jwt))
    {
        throw new Exception("The jwt token is empty.");
    }

    // Otherwise we can verify the token with google and get the user's email address
    Payload payload = await GoogleJsonWebSignature.ValidateAsync(login.Jwt);

    // If the payload is not null and is valid then get the user by email address
    if (payload != null)
    {
        string userEmail = payload.Email!;

        // Perform necessary logic to sign in the user here
        // e.g. create a cookie, or a JWT token, etc.

        // Return the user to the home page
        return RedirectToAction("Index", "Home");
    }
    else
    {
        // If the payload is null then the user is not authorized
        throw new Exception("The payload is null.");
    }
}
```

The above code will retrive the JWT token and then validate it with Google, using the GoogleJsonWebSignature class. This class is provided as part of the nuget package `Google.Apis.Auth`. If the token is valid, we can then perform any necessary logic to sign the user in. In this example we will just redirect the user to the home page, however in your own applications should could create a sign-in cookie, create a JWT or start a session.

In this above example if the sign in fails, an exception will be thrown. This will cause the user to be redirected to the error page. In a production application you would want to handle this error more gracefully.

### Add the Google Client ID to the Configuration

We will now add the Google Client ID to the configuration. This will allow us to access the value from the `appsettings.json` file.

Add the following code to the `appsettings.json` file:

```json
{
  "GoogleClientId": "YOUR_GOOGLE_CLIENT_ID"
}
```

To generate a Google Client ID, follow the steps below:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to the [Credentials Page](https://console.cloud.google.com/apis/credentials)
4. Click the `Create Credentials` button and select `OAuth client ID`
5. Select `Web application` as the application type
6. Enter a name for the application
7. Add the following URL to the `Authorized JavaScript origins` section: `https://localhost:5001` (replace with your own URL)
8. Add the following URL to the `Authorized redirect URIs` section: `https://localhost:5001/account/callback` (replace with your own URL)
9. Click the `Create` button
10. Copy the Client ID and paste it into the `appsettings.json` file

You will also need to setup the consent screen for your application. To do this, follow the steps below:

1. Go to the [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Select `External` as the user type
3. Click the `Create` button
4. Enter a name for the application
5. Add the following URL to the `Authorized domains` section: `localhost`
6. Click the `Save and continue` button
7. Click the `Add or remove scopes` button
8. Select the `email` and `profile` scopes
9. Click the `Update` button
10. Click the `Save and continue` button

### Test the Authentication

We will now test the authentication using the Google Sign-In button.

Start the application and then manually update the url to go to the `/Account/Login` route. This will redirect you to the Google Sign-In page. Either click the Google Sign-In button or use the one tap feature to sign in with your Google account. You should then be redirected to the home page.

## Conclusion

We have now learnt how to implement Google Sign-In without using the Identity framework. This is a great way to add authentication to your application without the overhead of the Identity framework. 

This method works well when combined with cookie or JWT authentication. You can use the Google Sign-In to authenticate the user and then use the cookie or JWT to authenticate the user for future requests.