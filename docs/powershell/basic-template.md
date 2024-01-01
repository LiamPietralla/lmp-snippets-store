# PowerShell Script Template

This is a basic template for a PowerShell script, that can be used as a starting point for your own scripts.

## Prerequisites

* PowerShell 7.1 or higher

## Step 1: Create a new file

Create a new file with the extension `.ps1` and add the following content:

```powershell
<#
.SYNOPSIS
    A short description of the script.
.DESCRIPTION
    A longer description of the script.

    This description can span multiple lines.
.PARAMETER SampleText
    A sample parameter. This should describe what the parameter is for and any restrictions on it.
.EXAMPLE
    -SampleText 'Hello World!'
.NOTES
    Author: Liam Pietralla
    Last Update: 2023-04-13
#>

param(
    [parameter(Mandatory=$true)]
    [string] $SampleText
)

filter timestamp {"[$(Get-Date -Format G)]: $_"}

Write-Output 'Script started.' | timestamp

# Your script goes here
Write-Output $SampleText | timestamp

Write-Output 'Script finished.' | timestamp
```