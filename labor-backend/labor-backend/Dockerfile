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

# Explicitly open a communication channel inside the container setup
EXPOSE 8080

# CRITICAL REWRITE: Force Java to evaluate the dynamic system environment port directly
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Dserver.address=0.0.0.0 -jar app.jar"]



