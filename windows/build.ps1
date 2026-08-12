
$wd = $pwd

## SQL Server Database

# build the database builder
cd $wd\docker\database
docker build -t onlineshop-db-builder -f Dockerfile.builder .

# build the dacpac for the database schema
rmdir -Force -Recurse out
mkdir out
docker run --rm -v $pwd\out:c:\bin -v $wd\dotnet:c:\src onlineshop-db-builder c:\src\Docker.OnlineShop\Docker.OnlineShop.Database\build.ps1

# build the database image
docker build -t onlineshop-db .


# build the database builder
cd $wd\docker\database
docker build -t onlineshop-db-builder -f Dockerfile.builder .

# build the dacpac for the database schema
rmdir -Force -Recurse out
mkdir out
docker run --rm -v $pwd\out:c:\bin -v $wd\dotnet:c:\src onlineshop-db-builder c:\src\Docker.OnlineShop\Docker.OnlineShop.Database\build.ps1

# build the database image
docker build -t onlineshop-db .


## .NET WebApi
cd $wd\docker\api
docker build -t onlineshop-api-builder -f Dockerfile.builder .

# build the web output
rmdir -Force -Recurse out
mkdir out
docker run --rm -v $pwd\out:c:\bin -v $wd\dotnet:c:\src onlineshop-api-builder c:\src\Docker.OnlineShop\Docker.OnlineShop.Api\build.ps1

# build the web api image
docker build -t onlineshop-api .

cd $wd