# Stage 1: Build the application

# Use the .NET 8 SDK to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution file and all project files
COPY *.sln ./
COPY ReactNotes.Api/ReactNotes.Api.csproj ReactNotes.Api/
COPY ReactNotes.Domain/ReactNotes.Domain.csproj ReactNotes.Domain/
COPY ReactNotes.Application/ReactNotes.Application.csproj ReactNotes.Application/

# Restore the dependencies for all projects
RUN dotnet restore ReactNotes.Domain/ReactNotes.Domain.csproj
RUN dotnet restore ReactNotes.Application/ReactNotes.Application.csproj
RUN dotnet restore ReactNotes.Api/ReactNotes.Api.csproj

# Copy the remaining project files
COPY . .

# Build the Web API and the class libraries
RUN dotnet publish ReactNotes.Api/ReactNotes.Api.csproj -c Release -o /publish

# Stage 2: Run the application

# Use the .NET 8 runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /publish .

# Expose port 80 for the web API
EXPOSE 80

# Set environment variables (Optional)
ENV ASPNETCORE_URLS=http://+:80

# Run the Web API
ENTRYPOINT ["dotnet", "ReactNotes.Api.dll"]