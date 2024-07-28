# Blazor App with an inbuilt API

Using the new Blazor interactive auto mode we can combine the benifits of Blazor WASM with Blazor Server.

In order to create a unified experience the recommended way is to create an API that is exposed from the Server application. 

The Server application will have a service class that will encapsulate all the actual logic, leaving the API controller to just call the service class. 

The Blazor WASM application will then call the API controller to get the data or perform actions.

## Create the Blazor Application

The best way to create a new Blazor application is to use Visual Studio 2022. 

1. Open Visual Studio 2022
2. Click on `Create a new project`
3. Search for `Blazor Web App` and select the `Blazor Web App` template
4. Ensure that the `Interactive Server Mode` is set to `Auto (Blazor Server and WebAssembly)`
5. Ensure that `Interactivity Mode` is set to `Per page/component`
6. Untick `Include sample pages`

## Create a model class in the client

Get started by creating a model class in the client application. This model class will be used to represent the data that is returned from the API.

```csharp [BlazorApp1.Client/Models/Movie.cs]
namespace BlazorApp1.Client.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int Year { get; set; }
    }
}
```

## Create a service interface in the client

Next we will create a service interface in the client application. This service interface will define the methods that will be used to interact with the API. For this guide only a GET method is defined, but more methods can be added as needed.

```csharp [BlazorApp1.Client/Services/IMovieService.cs]
using BlazorApp1.Client.Models;

namespace BlazorApp1.Client.Services
{
    public interface IMovieService
    {
        public List<Movie> GetMovies();
    }
}
```

## Create a client service

Now that we have our service contract we can create our client service. The service will look like the below:

```csharp [BlazorApp1.Client/Services/ClientMovieService.cs]
using BlazorApp1.Client.Models;
using System.Net.Http.Json;

namespace BlazorApp1.Client.Services
{
    public class ClientMovieService(HttpClient httpClient) : IMovieService
    {
        private readonly HttpClient _httpClient = httpClient;


        public async Task<List<Movie>> GetMoviesAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Movie>>("api/movie") ?? [];
        }
    }
}
```

The client service calls the API endpoint `movies` and deserializes the response into a list of `Movie` objects. We will also need to register this HTTP service and the Movie service in the `Program.cs` file.

```csharp [BlazorApp1/Client/Program.cs]
builder.Services.AddScoped<IMovieService, ClientMovieService>();
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.Configuration["FrontendUrl"] ?? "https://localhost:5002") });
```

At this point also update the appsettings.json for both the client and server application to include the `FrontendUrl` key.

::: code-group

```json [BlazorApp1.Client/wwwroot/appsettings.json]
{
  "FrontendUrl": "https://localhost:5002"
}
```

```json [BlazorApp1/appsettings.json]
{
  "FrontendUrl": "https://localhost:5002"
}
```

:::

::: tip
For the client application the appsettings.json will need to be placed in the wwwroot folder, which can be created if it does not exist.
:::

## Create the CSR (Client Side Rendered) movie page

Now that we have our service we can create a page that will call the service and display the data. 

```razor [BlazorApp1.Client/Pages/MoviesCSR.razor]
@page "/movies-csr";
/* NOTE: InteractiveAuto is used to specify the interactivity mode 
    for the page. This is set to InteractiveAuto so that the page 
    can be rendered on the client side. 

    Technically this is not doing anything at this point, as there is no 
    need for client interactivity, but if we add a button or some other
    interactive element this will be useful.
*/
@rendermode InteractiveAuto
@using BlazorApp1.Client.Models
@using BlazorApp1.Client.Services
@inject IMovieService MovieService

<h3>MoviesCSR</h3>

@if (moviesList.Count == 0)
{
    <h5>No movies found</h5>
} else
{
    <table class="table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
            </tr>
        </thead>
        <tbody>
            @foreach (Movie movie in moviesList)
            {
                <tr>
                    <td>@movie.Id</td>
                    <td>@movie.Title</td>
                    <td>@movie.Genre</td>
                    <td>@movie.Year</td>
                </tr>
            }
        </tbody>
    </table>

}

@code {
    private List<Movie> moviesList = [];

    protected override async Task OnInitializedAsync()
    {
        await GetMovies();
    }

    private async Task GetMovies()
    {
        moviesList = await MovieService.GetMoviesAsync();
    }
}
```

Note the following:
* The `@page` directive specifies the route for the page.
* The `@inject` directive is used to inject the `IMovieService` into the page.
* The `@code` block contains the code for the page. In the block we have a `moviesList` variable that will hold the list of movies.
* The `OnInitializedAsync` method is called when the page is initialized. In this method we call the `GetMovies` method.
* The `GetMovies` method calls the `GetMoviesAsync` method on the `MovieService` and assigns the result to the `moviesList` variable.

## Create the server service

Now that the frontend part is done we can move on to the server part. Get started by creating a ServerMovieService class in the server application:

```csharp [BlazorApp1/Services/ServerMovieService.cs]
using BlazorApp1.Client.Models;
using BlazorApp1.Client.Services;

namespace BlazorApp1.Services
{
    public class ServerMovieService : IMovieService
    {
        public Task<List<Movie>> GetMoviesAsync()
        {
            return Task.FromResult(new List<Movie>
            {
                new() { Title = "The Shawshank Redemption", Year = 1994 },
                new() { Title = "The Godfather", Year = 1972 },
                new() { Title = "The Dark Knight", Year = 2008 },
                new() { Title = "Pulp Fiction", Year = 1994 },
                new() { Title = "The Lord of the Rings: The Return of the King", Year = 2003 },
                new() { Title = "Schindler's List", Year = 1993 }
            });
        }
    }
}
```

## Create the API Controller

Now that our service is ready we can create the API controller. The controller will call the service and return the data.

```csharp [BlazorApp1/Controllers/MovieController.cs]
using BlazorApp1.Client.Services;
using Microsoft.AspNetCore.Mvc;

namespace BlazorApp1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController(IMovieService movieService) : ControllerBase
    {
        private readonly IMovieService _movieService = movieService;

        public async Task<IActionResult> GetMoviesAsync()
        {
            var movies = await _movieService.GetMoviesAsync();
            return Ok(movies);
        }
    }
}
```

This will require us to do two things in the `Program.cs` file. First we need to register the movie service in the file:

```csharp [BlazorApp1/Program.cs]
builder.Services.AddScoped<IMovieService, ServerMovieService>();
```

And second we also need to register the API controller in the file:

```csharp [BlazorApp1/Program.cs]
// Before builder.Build();
builder.Services.AddControllers();

// Before app.Run();
app.MapControllers();
```

## Add the server side movie page

Now that the API is ready we can create a server side page that will call the service directly and display the data.

```razor [BlazorApp1/Pages/MoviesSSR.razor]
@page "/movies-ssr";
@using BlazorApp1.Client.Models
@using BlazorApp1.Client.Services
@inject IMovieService MovieService

<h3>MoviesSSR</h3>

@if (moviesList.Count == 0)
{
    <h5>No movies found</h5>
} else
{
    <table class="table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
            </tr>
        </thead>
        <tbody>
            @foreach (Movie movie in moviesList)
            {
                <tr>
                    <td>@movie.Id</td>
                    <td>@movie.Title</td>
                    <td>@movie.Genre</td>
                    <td>@movie.Year</td>
                </tr>
            }
        </tbody>
    </table>

}

@code {
    private List<Movie> moviesList = [];

    protected override async Task OnInitializedAsync()
    {
        await GetMovies();
    }

    private async Task GetMovies()
    {
        moviesList = await MovieService.GetMoviesAsync();
    }
}
```

As you can see the code is almost identical to the CSR page. The only difference is that the data is fetched from the server side service.

## Run the application

At this point you can run the application and navigate to the `/movies-csr` and `/movies-ssr` pages to see the data being displayed.

### Conclusion

In this guide we have seen how to create a Blazor application that uses an inbuilt API. We have created a client service that calls the API and a server service that returns the data. We have also created a client side rendered page and a server side rendered page that display the data. This is a good way to create a unified experience for the user.

While simple in this example this can be extended so that the Blazor app stores data in a database and in this way we can build a full stack application.