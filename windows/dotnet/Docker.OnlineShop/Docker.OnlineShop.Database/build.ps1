 .\msbuild C:\src\Docker.OnlineShop\Docker.OnlineShop.Database\Docker.OnlineShop.Database.sqlproj `
    /p:SQLDBExtensionsRefPath="C:\Microsoft.Data.Tools.Msbuild.10.0.61026\lib\net40" `
    /p:SqlServerRedistPath="C:\Microsoft.Data.Tools.Msbuild.10.0.61026\lib\net40"; `
    cp -Recurse 'C:\src\Docker.OnlineShop\Docker.OnlineShop.Database\bin\Debug\*' 'c:\bin'