# Spring boot + GraphQL-Java

This application is using Spring boot 2 and Graphql-Java. This application will communicate with apaleo APIs to get or renew access token, get reservation data. Then use the reservation data as input data for AI services.

## Structure
![Pipeline](../structure.png)
## Installation
### Using Maven

To start the project, use the below command:
```bash
mvn clean springboot:run -DskipTests
```
By default, the application will listen on port 8000.
## Usage
### GraphiQL
You can view available queries and mutations on: http://localhost:8000/graphiql

Example:

To exchange code for access token, use the below query:
```
mutation exchangeToken
{
  exchangeToken(input:{
    code:"<replace with code>"
    redirectUrl:"http://localhost:4200/callback"
  }){
    idToken
    accessToken
    expiresIn
    tokenType
    refreshToken
  }
}

```

