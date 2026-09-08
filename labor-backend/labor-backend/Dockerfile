# Build stage
FROM maven:3.8-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:8-jre-slim
WORKDIR /app
COPY --from=build /app/target/labor-registration.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
