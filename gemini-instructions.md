# Distributed Conference Management System - Development Instructions

## Project Overview
Build a distributed microservices system for managing conferences and keynote speakers using Event Sourcing and CQRS patterns.

## Tech Stack
- **Backend**: Spring Boot, Spring Cloud, Axon Framework, Axon Server
- **Databases**: MySQL (for query side), Axon Server (event store)
- **Messaging**: Apache Kafka
- **Service Discovery**: Eureka Server
- **API Gateway**: Spring Cloud Gateway
- **Security**: OAuth2/OIDC with Keycloak
- **Frontend**: React
- **Deployment**: Docker, Docker Compose

## Domain Model

### Keynote Entity
- id (UUID)
- firstName (String)
- lastName (String)
- email (String)
- function (String)

### Conference Entity
- id (UUID)
- title (String)
- type (Enum: ACADEMIC, COMMERCIAL)
- date (LocalDateTime)
- duration (Integer - minutes)
- registeredCount (Integer)
- score (Double)
- keynoteId (UUID - reference)

### Review Entity
- id (UUID)
- conferenceId (UUID)
- date (LocalDateTime)
- text (String)
- stars (Integer 1-5)

## Architecture Requirements

### 1. Microservices Structure
Each microservice must be split into CQRS components:

#### keynote-service (Port: 8081)
- **keynote-command-side**: Handles commands (CreateKeynote, UpdateKeynote, DeleteKeynote)
- **keynote-query-side**: Handles queries, maintains read model in MySQL

#### conference-service (Port: 8082)
- **conference-command-side**: Handles commands (CreateConference, UpdateConference, AddReview)
- **conference-query-side**: Handles queries, maintains read model in MySQL

#### analytics-service (Port: 8083)
- Kafka Streams processing
- Real-time analytics: Count and total reviews in 5-second windows
- Expose REST endpoints for analytics results

### 2. Infrastructure Services

#### eureka-server (Port: 8761)
- Service discovery and registration

#### gateway-service (Port: 8888)
- API Gateway routing
- Load balancing
- Routes:
  - /keynotes/** → keynote-service
  - /conferences/** → conference-service
  - /analytics/** → analytics-service

#### config-service (Port: 8888 or 8889)
- Centralized configuration (optional, can use application.yml per service)

#### keycloak (Port: 8080)
- OAuth2/OIDC authentication
- Configure realm: "conference-realm"
- Create clients: "frontend-client", "gateway-client"

### 3. Axon Framework Implementation

#### Commands (keynote-service)
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateKeynoteCommand {
    @TargetAggregateIdentifier
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String function;
}
```

#### Events (keynote-service)
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeynoteCreatedEvent {
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String function;
}
```

#### Aggregate (keynote-service)
```java
@Aggregate
public class KeynoteAggregate {
    @AggregateIdentifier
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String function;
    
    @CommandHandler
    public KeynoteAggregate(CreateKeynoteCommand command) {
        // Validation
        AggregateLifecycle.apply(new KeynoteCreatedEvent(
            command.getKeynoteId(),
            command.getFirstName(),
            command.getLastName(),
            command.getEmail(),
            command.getFunction()
        ));
    }
    
    @EventSourcingHandler
    public void on(KeynoteCreatedEvent event) {
        this.keynoteId = event.getKeynoteId();
        this.firstName = event.getFirstName();
        // ... set other fields
    }
}
```

#### Query Side Projection (keynote-service)
```java
@Service
@AllArgsConstructor
public class KeynoteEventHandler {
    private KeynoteRepository repository;
    
    @EventHandler
    public void on(KeynoteCreatedEvent event) {
        Keynote keynote = new Keynote();
        keynote.setId(event.getKeynoteId());
        keynote.setFirstName(event.getFirstName());
        // ... set other fields
        repository.save(keynote);
    }
}
```

### 4. Kafka Integration

#### Topics
- `review-events` - for review created events
- `analytics-results` - for analytics output

#### conference-service Producer
When a review is added, publish to Kafka:
```java
@Service
public class ReviewEventPublisher {
    @Autowired
    private KafkaTemplate<String, ReviewEvent> kafkaTemplate;
    
    public void publishReviewEvent(ReviewEvent event) {
        kafkaTemplate.send("review-events", event);
    }
}
```

#### analytics-service Kafka Streams
```java
@Bean
public KStream<String, ReviewEvent> processReviews(StreamsBuilder builder) {
    KStream<String, ReviewEvent> reviews = builder.stream("review-events");
    
    reviews.groupByKey()
        .windowedBy(TimeWindows.of(Duration.ofSeconds(5)))
        .aggregate(
            ReviewStats::new,
            (key, value, aggregate) -> {
                aggregate.incrementCount();
                aggregate.addTotal(value.getStars());
                return aggregate;
            }
        )
        .toStream()
        .to("analytics-results");
    
    return reviews;
}
```

### 5. REST API Endpoints

#### Keynote Service
- POST /keynotes/commands/create - Create keynote
- PUT /keynotes/commands/update/{id} - Update keynote
- DELETE /keynotes/commands/delete/{id} - Delete keynote
- GET /keynotes/queries/all - Get all keynotes
- GET /keynotes/queries/{id} - Get keynote by id

#### Conference Service
- POST /conferences/commands/create - Create conference
- PUT /conferences/commands/update/{id} - Update conference
- POST /conferences/commands/{id}/reviews - Add review
- GET /conferences/queries/all - Get all conferences
- GET /conferences/queries/{id} - Get conference by id
- GET /conferences/queries/{id}/reviews - Get conference reviews

#### Analytics Service
- GET /analytics/reviews/window - Get review stats for 5-second window

### 6. Security Configuration

#### Keycloak Setup
1. Create realm: conference-realm
2. Create client: frontend-client (public, redirect: http://localhost:3000/*)
3. Create client: gateway-client (confidential)
4. Create roles: USER, ADMIN
5. Create test users with roles

#### Gateway Security
```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .oauth2ResourceServer()
            .jwt();
        http
            .authorizeExchange()
            .pathMatchers("/keynotes/**").hasRole("USER")
            .pathMatchers("/conferences/**").hasRole("USER")
            .anyExchange().authenticated();
        return http.build();
    }
}
```

### 7. Frontend (React)

#### Required Pages
1. **Login Page** - Keycloak authentication
2. **Keynotes List** - Display all keynotes with add/edit/delete
3. **Keynote Form** - Create/Edit keynote
4. **Conferences List** - Display all conferences
5. **Conference Form** - Create/Edit conference
6. **Conference Details** - View conference with reviews
7. **Analytics Dashboard** - Real-time review analytics

#### Key Libraries
- react-router-dom (routing)
- axios (HTTP client)
- keycloak-js (authentication)
- recharts or chart.js (analytics visualization)
- tailwindcss (styling)

### 8. Docker Compose Structure

```yaml
version: '3.8'
services:
  mysql-keynote:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: keynote_db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3307:3306"
  
  mysql-conference:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: conference_db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3308:3306"
  
  axon-server:
    image: axoniq/axonserver:latest
    ports:
      - "8024:8024"
      - "8124:8124"
  
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    depends_on:
      - zookeeper
  
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
  
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    command: start-dev
  
  eureka-server:
    build: ./eureka-server
    ports:
      - "8761:8761"
  
  gateway-service:
    build: ./gateway-service
    ports:
      - "8888:8888"
    depends_on:
      - eureka-server
      - keycloak
  
  keynote-service:
    build: ./keynote-service
    depends_on:
      - mysql-keynote
      - axon-server
      - eureka-server
  
  conference-service:
    build: ./conference-service
    depends_on:
      - mysql-conference
      - axon-server
      - eureka-server
      - kafka
  
  analytics-service:
    build: ./analytics-service
    depends_on:
      - kafka
      - eureka-server
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - gateway-service
```

## Development Steps

### Step 1: Setup Infrastructure
1. Create parent Maven/Gradle project
2. Setup Eureka Server
3. Setup Gateway Service
4. Create docker-compose.yml with MySQL, Axon Server, Kafka, Keycloak

### Step 2: Develop keynote-service
1. Create Spring Boot project with Axon, MySQL, Eureka dependencies
2. Implement command side (Aggregate, Commands, Events)
3. Implement query side (Entities, Repositories, Projections)
4. Create REST controllers for commands and queries
5. Configure Axon Server connection

### Step 3: Develop conference-service
1. Similar structure to keynote-service
2. Add Review entity and commands
3. Integrate Kafka producer for review events
4. Implement conference and review management

### Step 4: Develop analytics-service
1. Setup Kafka Streams
2. Process review events in 5-second windows
3. Expose REST endpoints for analytics
4. Store/cache results

### Step 5: Security Implementation
1. Configure Keycloak realm and clients
2. Add OAuth2 resource server to Gateway
3. Secure microservices endpoints
4. Implement JWT validation

### Step 6: Frontend Development
1. Setup React project with TypeScript
2. Integrate Keycloak authentication
3. Create components for CRUD operations
4. Implement analytics dashboard
5. Setup routing and state management

### Step 7: Testing & Documentation
1. Test all endpoints with Postman
2. Test event sourcing and CQRS flows
3. Verify Kafka Streams analytics
4. Document API with Swagger/OpenAPI

### Step 8: Dockerization
1. Create Dockerfile for each service
2. Test docker-compose deployment
3. Verify inter-service communication

## Important Configuration Notes

### application.yml for keynote-service
```yaml
spring:
  application:
    name: keynote-service
  datasource:
    url: jdbc:mysql://localhost:3307/keynote_db
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update

axon:
  axonserver:
    servers: localhost:8124

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

server:
  port: 8081
```

## Deliverables
1. Complete source code with all microservices
2. docker-compose.yml for full deployment
3. README.md with setup instructions
4. Technical architecture diagram
5. UML class diagram
6. Postman collection for API testing
7. Screenshots of running application

## Success Criteria
- All services register with Eureka
- Events properly stored in Axon Server
- CQRS pattern correctly implemented
- Kafka Streams analytics working
- Security properly configured
- Frontend fully functional
- Docker deployment successful