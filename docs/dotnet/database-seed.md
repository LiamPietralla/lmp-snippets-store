# Database Seeding in .NET

Often in development and testing, you need to seed your database with some data. This can be done manually, but it's a tedious process. In this article, we'll see how to seed a database in .NET.

The best way to seed the database in .NET is to first check that the application is running in development mode. 

Most of the time such a check will already exist in your `Program.cs`:

```csharp [Program.cs]
// ...

if (builder.Environment.IsDevelopment()) {
    // ...
}

// ...
```

To seed your database first add a SeedData file (personally I usually place this in a helpers folder):

```csharp [Helpers/SeedData.cs]
using Microsoft.EntityFrameworkCore;
using MySampleApp.Models;

namespace MySampleApp.Helpers;

public class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var context = new AppContext(serviceProvider.GetRequiredService<DbContextOptions<AppContext>>());

        context.Add(new Movie { Name = "Batman Begins", Genre = "Action" });
        context.Add(new Movie { Name = "The Dark Knight", Genre = "Action" });
        context.Add(new Movie { Name = "The Dark Knight Rises", Genre = "Action" });

        await context.SaveChangesAsync();
    }
}
```

In the `SeedData` class, we have a static method `InitializeAsync` that takes an `IServiceProvider` as a parameter. This method initializes the database with some sample data.

Next, we need to call this method in the `Program.cs` file:

```csharp [Program.cs]
// ...

if (builder.Environment.IsDevelopment()) {
    // Seed the database
    await using var scope = app.Services.CreateAsyncScope();
    await SeedData.InitializeAsync(scope.ServiceProvider);

    // ...
}

// ...
```