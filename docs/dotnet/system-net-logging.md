---
outline: deep
---

# Enable System.NET Logging in .NET Framework

The following code snippet shows how to enable System.NET logging in ASP.NET. System.NET logging is mostly useful for debugging issues relating to HTTP requests and responses. Often this is useful when proxies are involved, or when you need to see the raw HTTP request and response.

To enable System.NET logging, add the following to your `web.config` file inside the `<configuration>` element:

```xml
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
```
