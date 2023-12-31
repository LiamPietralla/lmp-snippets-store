---
sidebar_position: 1
---

# Lambda Operator

The lambda operator `=>` is a shorthand syntax for expressing anonymous methods. It is used extensively in LINQ queries and the new expression trees.

It can also be used as a expression-bodied member in a method or property declaration.

## Lambda Operator in Lambda Expressions

Lambda expressions are often used in LINQ queries. The lambda operator `=>` is used to define the body of a lambda expression.

The following example shows how to use the lambda operator in a lambda expression:

```csharp
// Lambda expression with a single parameter
numbers.Select(n => n * 2);

// Lambda expression with multiple parameters
numbers.Select((n, index) => n * index);

// Lambda expression with a single statement
numbers.Select(n => {
    if (n % 2 == 0)
        return n * 2;
    else
        return n * 3;
});

// Lambda expression in a LINQ style setting
numbers.Select(n => n * 2).Where(n => n % 2 == 0);
```

## Lambda Operator in Expresion Body Definitions

The lambda operator `=>` can also be used to define the body of a method or property. This is called an expression body definition. The following example shows how to use the lambda operator in an expression body definition:

```csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    // Expression body definition for a method
    public string GetFullName() => $"{FirstName} {LastName}";

    // Expression body definition for a property
    public string FullName => $"{FirstName} {LastName}";
}
```