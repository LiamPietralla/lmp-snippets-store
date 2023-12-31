---
outline: deep
---

# Enable OWIN Logging in .NET Framework

The following code snippet shows how to enable Microsoft.OWIN logging in ASP.NET. OWIN logging is mostly useful for debugging issues relating to user sign in / flow, especially when using external identity providers such as Google, Facebook, etc.

To enable OWIN logging, add the following to your `web.config` file inside the `<configuration>` element:

```xml
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
                    initializeData="traces-Owin.log" 
                />
            </listeners>
        </source>
    </sources>
</system.diagnostics>
```
