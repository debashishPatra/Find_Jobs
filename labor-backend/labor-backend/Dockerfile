# Step 1: Build stage using Maven and Java 8 (Temurin)
FROM maven:3.8.8-eclipse-temurin-8 AS build
WORKDIR /app

# Copy the pom.xml and source code from the labor-backend root
COPY pom.xml . 
COPY src ./src

# Build the jar file
RUN mvn clean package -DskipTests

# Step 2: Runtime stage using a lightweight Java 8 JRE (Temurin)
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the spring boot application
ENTRYPOINT ["java", "-jar", "appjar"]

