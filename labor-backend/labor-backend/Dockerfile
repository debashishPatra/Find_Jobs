# Step 1: Build stage using Maven and Java 8
FROM maven:3.8.8-eclipse-temurin-8 AS build
WORKDIR /app

# Copy everything inside labor-backend into the container
COPY . .

# Build the jar file and skip tests to save time
RUN mvn clean package -DskipTests

# Step 2: Runtime stage using lightweight Java 8 JRE
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
