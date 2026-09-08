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

# Open port 10000 inside the container environment
EXPOSE 10000

# CRITICAL FIX: The shell wrapper forces Java to inject Render's PORT variable at runtime
ENTRYPOINT ["sh", "-c", "java -Dserverport=${PORT} -Dserveraddress=0.0.0.0 -jar appjar"]


