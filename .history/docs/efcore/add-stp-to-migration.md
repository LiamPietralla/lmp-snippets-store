---
sidebar_position: 1
---

# Adding Stored Procedures to a Migration

Sometimes even when working with an ORM like Entity Framework Core, you need to use a stored procedure. This is especially true when you are working with legacy databases or you need to have performant and consise SQL. 

## Add Migration

The first step is to add a migration to your DB Context, if working with the dotnet CLI, you can use the following command:

```bash
dotnet ef migrations add AddUserStoredProcedure
```

If working with the Package Manager Console, you can use the following command:

```bash
Add-Migration AddUserStoredProcedure
```


This wil add a migration file similar to the following:

```csharp
public partial class AddUserStoredProcedure : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {

    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {

    }
}
```

## Add Stored Procedure

The stored precedure can then be added using the `Sql` method on the `MigrationBuilder` object. The following example shows how to add a stored procedure that returns a user by their ID:

```csharp
public partial class AddUserStoredProcedure : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            CREATE PROCEDURE [dbo].[GetUserById]
            @Id int
            AS
            BEGIN
                SET NOCOUNT ON;
                SELECT * FROM [dbo].[Users] WHERE [Id] = @Id
            END
        ");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            DROP PROCEDURE [dbo].[GetUserById]
        ");
    }
}
```

## Update Database

Once the migration has been added, you can update the database using the following command:

```bash
dotnet ef database update
```

If working with the Package Manager Console, you can use the following command:

```bash
Update-Database
```