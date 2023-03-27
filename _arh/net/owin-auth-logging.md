# Owin Auth Logging

This will enable logging of the Owin authentication process.

```xml
<configuration>
  .....
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