# Build stage using stable Eclipse Temurin Java 8 images
FROM maven:3.8.8-eclipse-temurin-8 AS build
WORKDIR /app
COPY . .
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests

# Run stage using matching lightweight Temurin Java 8 environment
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Inform the platform routing layer of our fallback target port
EXPOSE 8080

# SAFE ARBITRARY ENTRYPOINT: Pulls system arguments cleanly
ENTRYPOINT ["java", "-jar", "app.jar"]



