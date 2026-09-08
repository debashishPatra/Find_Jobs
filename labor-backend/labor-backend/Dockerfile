# Build stage using stable Eclipse Temurin Java 8 images
FROM maven:3.8.8-eclipse-temurin-8 AS build
WORKDIR /app

# Copy the entire directory context at once to prevent cache alignment failures
COPY . .

# Run the standard offline configuration using local build flags
RUN mvn dependency:go-offline -B

# Compile your Spring Boot project and skip test executions to optimize deployment time
RUN mvn clean package -DskipTests

# Run stage using matching lightweight Temurin Java 8 execution environment
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

# Safely inherit the built target artifact from your build stage 
COPY --from=build /app/target/*.jar app.jar

# Inform the container routing layer of your exposed dynamic port 
EXPOSE 8080

# Clean array declaration without trailing syntax characters
ENTRYPOINT ["java", "-jar", "app.jar"]

