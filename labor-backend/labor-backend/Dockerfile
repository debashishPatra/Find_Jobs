# Build stage
FROM maven:3.8-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
# Replace the deprecated openjdk image with this stable version
FROM eclipse-temurin:8-jre-alpine

# The rest of your Dockerfile configurations (WORKDIR, COPY, ENTRYPOINT, etc.) remain the same...

WORKDIR /app
COPY --from=build /app/target/labor-registration.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
