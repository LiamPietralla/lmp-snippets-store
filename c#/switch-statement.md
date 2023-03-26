# Switch Statement

The `switch` statement is a multi-way branch statement. It provides an efficient way to execute a block of code among many alternatives.

## Syntax

```csharp
switch (expression)
{
    case constant-expression:
        statement(s);
        break;
    case constant-expression:
        statement(s);
        break;
    // You can have any number of case statements.
    default: // Optional
        statement(s);
        break;
}
```