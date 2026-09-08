# Build stage using stable Eclipse Temurin Java 8 images
FROM maven:3.8.8-eclipse-temurin-8 AS build
WORKDIR /app
COPY . .
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests

# Run stage using matching lightweight Temurin Java 8 execution environment
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Dynamically fall back to 8080 if PORT environment variable isn't present
EXPOSE 8080

# CRITICAL FIX: Pass the dynamic Render port variable straight into Spring Boot
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]


