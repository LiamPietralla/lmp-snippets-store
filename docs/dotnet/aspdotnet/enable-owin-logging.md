---
sidebar_position: 1
---

# Enable OWIN Logging

The following code snippet shows how to enable Microsoft.OWIN logging in ASP.NET.

```xml
<configuration>
  <system.diagnostics>
    <switches>
      <add name="Microsoft.Owin" value="Verbose" />
    </switches>
    <trace autoflush="true" /> 
    <sources>
      <source name="Microsoft.Owin">
        <listeners>
          <add name="console" />
        </listeners>
      </source>
      <source name="Microsoft.Owin">
        <listeners>
          <add name="file" 
               type="System.Diagnostics.TextWriterTraceListener" 
               initializeData="traces-Owin.log" />
        </listeners>
      </source>
    </sources>
  </system.diagnostics>
</configuration>
```

## References

- [OWIN Logging](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-5.0#owin-logging)