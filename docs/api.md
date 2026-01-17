# API Documentation

This document outlines the REST API endpoints exposed by each microservice in the Conference Management System.

## Gateway Service

The Gateway Service (`http://localhost:8888`) acts as a single entry point for all client requests, routing them to the appropriate microservice. All API calls below are assumed to be routed through the Gateway.

## Keynote Service (Port: 8081)

Manages keynote speakers.

### Command Endpoints

-   **Create Keynote**
    -   `POST /keynotes/commands/create`
    -   **Description**: Creates a new keynote speaker.
    -   **Request Body**:
        ```json
        {
            "firstName": "string",
            "lastName": "string",
            "email": "string",
            "function": "string"
        }
        ```
    -   **Response**: `CompletableFuture<String>` (Keynote ID)

-   **Update Keynote**
    -   `PUT /keynotes/commands/update/{id}`
    -   **Description**: Updates an existing keynote speaker.
    -   **Request Body**:
        ```json
        {
            "firstName": "string",
            "lastName": "string",
            "email": "string",
            "function": "string"
        }
        ```
    -   **Response**: `CompletableFuture<String>` (Keynote ID)

-   **Delete Keynote**
    -   `DELETE /keynotes/commands/delete/{id}`
    -   **Description**: Deletes a keynote speaker by ID.
    -   **Response**: `CompletableFuture<String>` (Keynote ID)

### Query Endpoints

-   **Get All Keynotes**
    -   `GET /keynotes/queries/all`
    -   **Description**: Retrieves a list of all keynote speakers.
    -   **Response**: `List<Keynote>`

-   **Get Keynote by ID**
    -   `GET /keynotes/queries/{id}`
    -   **Description**: Retrieves a single keynote speaker by ID.
    -   **Response**: `Keynote`

## Conference Service (Port: 8082)

Manages conferences and their reviews.

### Command Endpoints

-   **Create Conference**
    -   `POST /conferences/commands/create`
    -   **Description**: Creates a new conference.
    -   **Request Body**:
        ```json
        {
            "title": "string",
            "type": "ACADEMIC" | "COMMERCIAL",
            "date": "LocalDateTime (e.g., 2026-01-17T10:00:00)",
            "duration": "int",
            "registeredCount": "int",
            "score": "double",
            "keynoteId": "string (UUID)"
        }
        ```
    -   **Response**: `CompletableFuture<String>` (Conference ID)

-   **Update Conference**
    -   `PUT /conferences/commands/update/{id}`
    -   **Description**: Updates an existing conference.
    -   **Request Body**:
        ```json
        {
            "title": "string",
            "type": "ACADEMIC" | "COMMERCIAL",
            "date": "LocalDateTime (e.g., 2026-01-17T10:00:00)",
            "duration": "int",
            "registeredCount": "int",
            "score": "double",
            "keynoteId": "string (UUID)"
        }
        ```
    -   **Response**: `CompletableFuture<String>` (Conference ID)

-   **Delete Conference**
    -   `DELETE /conferences/commands/delete/{id}`
    -   **Description**: Deletes a conference by ID.
    -   **Response**: `CompletableFuture<String>` (Conference ID)

-   **Add Review to Conference**
    -   `POST /conferences/commands/{id}/reviews`
    -   **Description**: Adds a new review to a specific conference.
    -   **Request Body**:
        ```json
        {
            "date": "LocalDateTime (e.g., 2026-01-17T11:30:00)",
            "text": "string",
            "stars": "int (1-5)"
        }
        ```
    -   **Response**: `CompletableFuture<String>` (Review ID)

### Query Endpoints

-   **Get All Conferences**
    -   `GET /conferences/queries/all`
    -   **Description**: Retrieves a list of all conferences.
    -   **Response**: `List<Conference>`

-   **Get Conference by ID**
    -   `GET /conferences/queries/{id}`
    -   **Description**: Retrieves a single conference by ID, including its reviews.
    -   **Response**: `Conference`

-   **Get Reviews for Conference**
    -   `GET /conferences/queries/{id}/reviews`
    -   **Description**: Retrieves all reviews for a specific conference.
    -   **Response**: `List<Review>`

## Analytics Service (Port: 8083)

Provides real-time analytics on conference reviews using Kafka Streams.

### Query Endpoints

-   **Get Review Stats (Windowed)**
    -   `GET /analytics/reviews/window`
    -   **Description**: Retrieves aggregated statistics (count, total stars, average stars) for reviews processed within 5-second tumbling windows.
    -   **Response**: `List<ReviewStats>`
        ```json
        [
            {
                "count": 10,
                "totalStars": 45,
                "averageStars": 4.5,
                "windowStart": "2026-01-17T10:00:00Z",
                "windowEnd": "2026-01-17T10:00:05Z"
            }
        ]
        ```