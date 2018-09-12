FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
#TODO SLL
#EXPOSE 44383   

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore 
COPY . ./

COPY ./wait-for-it.sh ./

RUN dotnet build MagicSword.Core.Api.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish MagicSword.Core.Api.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .

#RUN chmod +x ./wait-for-it.sh
#RUN ./wait-for-it.sh localhost:1433  --echo "sql is up"

ENTRYPOINT ["dotnet", "MagicSword.Core.Api.dll"]