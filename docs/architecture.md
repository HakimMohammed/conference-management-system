# System Architecture

The Conference Management System is a distributed microservices application designed with a strong emphasis on Event Sourcing and CQRS (Command Query Responsibility Segregation) principles.

## High-Level Overview

The system comprises several independent microservices, each responsible for a specific business domain. These services communicate primarily through events, leveraging Apache Kafka and Axon Server. A central API Gateway provides a unified entry point, and Eureka Server facilitates service discovery. Keycloak handles all authentication and authorization concerns.

```mermaid
graph TD
    User(User) --- Frontend[Frontend (React)]
    Frontend --> Gateway[API Gateway]
    Gateway --> Keycloak[Keycloak (Auth)]
    Gateway -- Route --> KeynoteService[Keynote Service]
    Gateway -- Route --> ConferenceService[Conference Service]
    Gateway -- Route --> AnalyticsService[Analytics Service]

    subgraph Backend Services
        KeynoteService --> AxonServer(Axon Server - Event Store)
        KeynoteService --> MySQLKeynote[MySQL - Keynote Query]

        ConferenceService --> AxonServer
        ConferenceService --> MySQLConference[MySQL - Conference Query]
        ConferenceService -- Review Events --> Kafka[Apache Kafka]

        Kafka --> AnalyticsService
        AnalyticsService --> MySQLAnalytics[MySQL - Analytics Query]
    end

    KeynoteService -- Register --> Eureka[Eureka Server]
    ConferenceService -- Register --> Eureka
    AnalyticsService -- Register --> Eureka
    Gateway -- Discover --> Eureka

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style Frontend fill:#bbf,stroke:#333,stroke-width:2px
    style Gateway fill:#bfb,stroke:#333,stroke-width:2px
    style Keycloak fill:#fbc,stroke:#333,stroke-width:2px
    style KeynoteService fill:#cbf,stroke:#333,stroke-width:2px
    style ConferenceService fill:#cbf,stroke:#333,stroke-width:2px
    style AnalyticsService fill:#cbf,stroke:#333,stroke-width:2px
    style AxonServer fill:#ffc,stroke:#333,stroke-width:2px
    style MySQLKeynote fill:#ccf,stroke:#333,stroke-width:2px
    style MySQLConference fill:#ccf,stroke:#333,stroke-width:2px
    style MySQLAnalytics fill:#ccf,stroke:#333,stroke-width:2px
    style Kafka fill:#ffd,stroke:#333,stroke-width:2px
    style Eureka fill:#ddf,stroke:#333,stroke-width:2px
```

## Core Architectural Patterns

### 1. Event Sourcing

All state changes within the `Keynote Service` and `Conference Service` are captured as immutable events and stored in **Axon Server**. This provides a complete, auditable history of all actions performed in the system.

### 2. CQRS (Command Query Responsibility Segregation)

A strict separation is maintained between the command (write) model and the query (read) model:
-   **Command Side**: Handles commands that change the system's state. Aggregates process these commands, apply business logic, and publish corresponding events to Axon Server.
-   **Query Side**: Maintains a denormalized read model in dedicated MySQL databases, optimized for querying. Event handlers listen to events from Axon Server and update these read models.

### 3. Microservices

The system is broken down into several small, independently deployable services:

-   **Eureka Server**: Provides service registration and discovery for all microservices.
-   **API Gateway**: Routes incoming requests to the appropriate microservices, handles cross-cutting concerns like security (OAuth2 with Keycloak), and load balancing.
-   **Keynote Service**: Manages the domain of keynote speakers, including their creation, updates, and deletion.
-   **Conference Service**: Manages conferences, allowing for creation, updates, deletion, and the addition of reviews. It also publishes `ReviewAddedEvent`s to Kafka.
-   **Analytics Service**: Consumes `ReviewAddedEvent`s from Kafka and processes them using Kafka Streams to provide real-time analytics on reviews (e.g., review counts and average ratings within tumbling windows).
-   **Frontend**: A single-page application (SPA) built with React and TypeScript, providing the user interface for interacting with the microservices.

### 4. Event-Driven Communication

Services communicate asynchronously through events:
-   **Axon Server**: Used by `Keynote Service` and `Conference Service` for event sourcing and inter-service communication related to domain events.
-   **Apache Kafka**: Used for streaming analytics. Specifically, `Conference Service` publishes `ReviewAddedEvent`s to a Kafka topic, which are then consumed and processed by `Analytics Service`.

## Data Storage

-   **Axon Server**: Serves as the primary event store for all domain events.
-   **MySQL**: Separate MySQL instances (`keynote_db` and `conference_db`) are used to store the query-side projections (read models) for `Keynote Service` and `Conference Service`, respectively.
-   **Kafka Streams State Stores**: `Analytics Service` uses internal Kafka Streams state stores to maintain its computed analytics results.

## Security

**Keycloak** is integrated as an OAuth2/OIDC provider for authentication and authorization.
-   The **API Gateway** acts as an OAuth2 Resource Server, validating JWTs issued by Keycloak.
-   The **Frontend** integrates with Keycloak for user login and token management.

This architecture ensures scalability, resilience, and maintainability by decoupling services and adhering to modern distributed system patterns.