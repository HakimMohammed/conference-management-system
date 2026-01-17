# Conference Management System

A distributed conference management system using microservices, CQRS, and event sourcing.

## Architecture

This project is a microservices-based application built with Spring Boot and Axon Framework. It follows the CQRS (Command Query Responsibility Segregation) and Event Sourcing patterns.

The system consists of the following services:
- **eureka-server**: Service discovery and registration.
- **gateway-service**: API Gateway for routing and security.
- **keynote-service**: Manages keynote speakers.
- **conference-service**: Manages conferences and reviews.
- **analytics-service**: Provides real-time analytics on conference reviews.
- **frontend**: A React-based user interface.

## Technology Stack

- **Backend**: Spring Boot, Spring Cloud, Axon Framework, Java 17
- **Frontend**: React, TypeScript, Tailwind CSS
- **Databases**: MySQL, Axon Server (event store)
- **Messaging**: Apache Kafka
- **Security**: Keycloak (OAuth2/OIDC)
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Java 17
- Maven
- Docker and Docker Compose
- Node.js and npm

## Build

To build all the microservices, run the following command from the root directory:

```bash
mvn clean install
```

## Running the System

The entire system can be started with Docker Compose.

### Running Infrastructure Services Only

To run only the core infrastructure services (MySQL, Axon Server, Kafka, Zookeeper, Keycloak, Eureka Server), use the `docker-compose.infra.yml` file:

```bash
docker-compose -f docker-compose.infra.yml up -d
```

This is useful if you want to run the Spring Boot applications and frontend manually in your IDE.

### Running Spring Boot Applications Locally (with Infrastructure from Docker Compose)

If you've started the infrastructure services using `docker-compose -f docker-compose.infra.yml up -d`, you can run individual Spring Boot microservices directly from your IDE.

To do this, activate the `local` Spring profile for each application. This profile configures the applications to connect to `localhost` and the host-mapped ports exposed by Docker Compose.

For example, to run the Keynote Service locally, you would typically configure your IDE (e.g., IntelliJ IDEA, VS Code) to pass `spring.profiles.active=local` as a VM option or program argument.

Alternatively, you can run from the command line:

```bash
cd keynote-service
mvn spring-boot:run -Dspring-boot.run.profiles=local
# Repeat for conference-service, analytics-service, gateway-service
```

Make sure that the necessary infrastructure containers (MySQL, Axon Server, Kafka, Eureka Server) are running and accessible on `localhost` via their exposed ports (e.g., MySQL Keynote on 3307, MySQL Conference on 3308, Axon Server on 8124, Kafka on 9092, Eureka Server on 8761, Keycloak on 8080).

### Running All Services

1. **Start the infrastructure services:**

```bash
docker-compose up -d mysql-keynote mysql-conference axon-server kafka zookeeper keycloak eureka-server
```

2. **Start the microservices:**

```bash
docker-compose up -d gateway-service keynote-service conference-service analytics-service
```

3. **Start the frontend:**

```bash
docker-compose up -d frontend
```

To stop and remove all containers, run:

```bash
docker-compose down
```

## Accessing the Applications

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Gateway**: [http://localhost:8888](http://localhost:8888)
- **Eureka Server**: [http://localhost:8761](http://localhost:8761)
- **Keycloak**: [http://localhost:8080](http://localhost:8080)
    - **Admin credentials**: `admin`/`admin`
- **Axon Server**: [http://localhost:8024](http://localhost:8024)

## Keycloak Configuration

You will need to configure Keycloak for the application to work correctly.

1.  Go to the Keycloak admin console at [http://localhost:8080](http://localhost:8080) and log in with `admin`/`admin`.
2.  Create a new realm named `conference-realm`.
3.  Create a new client for the frontend:
    -   **Client ID**: `frontend-client`
    -   **Access Type**: `public`
    -   **Valid Redirect URIs**: `http://localhost:3000/*`
4.  Create a new client for the gateway:
    -   **Client ID**: `gateway-client`
    -   **Access Type**: `confidential`
    -   **Valid Redirect URIs**: `http://localhost:8888/*`
5.  Create roles: `USER` and `ADMIN`.
6.  Create users and assign them roles.