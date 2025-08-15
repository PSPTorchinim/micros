FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

ARG MICROSERVICE_NAME

RUN apt-get update

COPY ["Services/${MICROSERVICE_NAME}/", "Services/${MICROSERVICE_NAME}/"]
COPY ["Services/Shared/", "Services/Shared/"]
COPY ["Tests/${MICROSERVICE_NAME}.Tests/", "Tests/${MICROSERVICE_NAME}.Tests/"]

RUN dotnet restore "Services/${MICROSERVICE_NAME}/${MICROSERVICE_NAME}.csproj"

WORKDIR Services/${MICROSERVICE_NAME}/
RUN dotnet tool install --global dotnet-ef && export PATH="$PATH:/root/.dotnet/tools"
RUN dotnet ef dbcontext list && dotnet ef migrations add InitialMigration || echo "No DbContext found, skipping migrations"

WORKDIR /
RUN dotnet test "Services/${MICROSERVICE_NAME}/${MICROSERVICE_NAME}.csproj"
RUN dotnet build "Services/${MICROSERVICE_NAME}/${MICROSERVICE_NAME}.csproj" -c Release -o /app/build
RUN dotnet publish "Services/${MICROSERVICE_NAME}/${MICROSERVICE_NAME}.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base
RUN apt-get update && apt-get install -y curl
EXPOSE 8080
ARG MICROSERVICE_NAME 

WORKDIR /app
COPY --from=build /app/publish/ .
ENV APP_EXE=$MICROSERVICE_NAME.dll

ENTRYPOINT ["/bin/sh", "-c", "dotnet /app/${APP_EXE}"]
HEALTHCHECK --interval=5s --timeout=10s --start-period=30s --retries=3 CMD curl --silent --fail http://localhost:8080/healthz/live || exit 1
