---
sidebar_position: 1
---

# Enable OWIN Logging

The following code snippet shows how to enable OWIN logging in ASP.NET.

```xml
<configuration>
  <system.diagnostics>
    <trace autoflush="true" />
    <sharedListeners>
      <add name="file" initializeData="D:\\network.log" type="System.Diagnostics.TextWriterTraceListener" />
    </sharedListeners>
    <sources>
      <source name="System.Net" switchValue="Verbose">
        <listeners>
          <add name="file" />
        </listeners>
      </source>
    </sources>
  </system.diagnostics>
</configuration>
```

## References

- [System.Net Logging](https://docs.microsoft.com/en-us/dotnet/framework/network-programming/system-net-logging)