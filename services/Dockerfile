FROM maven:alpine AS build
COPY src /app/src
COPY pom.xml /app
WORKDIR /app
RUN mvn clean install -DskipTests


FROM openjdk:8-jdk-alpine 
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
