# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Maven wrapper configuration files
COPY .mvn/ .mvn
COPY mvnw mvnw.cmd pom.xml ./

# Download application dependencies to speed up subsequent builds
RUN ./mvnw dependency:go-offline -B

# Copy the actual source files and build the production jar file
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Clean, secure production runtime environment
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Explicitly install standard Linux security root certificate updates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the compiled production executable jar from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Open standard network server listening port
EXPOSE 8080

# Run Spring Boot with built-in TLS protocol compatibility flags
ENTRYPOINT ["java", "-Dhttps.protocols=TLSv1.2,TLSv1.3", "-jar", "app.jar"]