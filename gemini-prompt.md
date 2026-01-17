# GEMINI CLI PROMPT - CONFERENCE MANAGEMENT SYSTEM

Please create a complete distributed microservices system for conference and keynote management following these specifications:

## CRITICAL REQUIREMENTS

### Architecture Pattern
- **Event Sourcing**: All state changes must be captured as events in Axon Server
- **CQRS**: Strict separation between Command (write) and Query (read) models
- **Microservices**: Each service is independently deployable
- **Event-Driven**: Services communicate via events through Axon Server and Kafka

### Technology Stack
- Spring Boot 3.x with Java 17+
- Axon Framework 4.x for CQRS/Event Sourcing
- Axon Server for event store
- Apache Kafka for streaming analytics
- MySQL 8.0 for query-side databases
- Spring Cloud (Eureka, Gateway)
- Keycloak for OAuth2/OIDC authentication
- React with TypeScript for frontend
- Docker & Docker Compose for deployment

## PROJECT STRUCTURE

Create the following microservices:

### 1. EUREKA-SERVER (Port: 8761)
- Spring Cloud Netflix Eureka Server
- Service registry for all microservices
- Dependencies: spring-cloud-starter-netflix-eureka-server

### 2. GATEWAY-SERVICE (Port: 8888)
- Spring Cloud Gateway
- Route to all microservices
- OAuth2 Resource Server integration with Keycloak
- Dependencies: spring-cloud-starter-gateway, spring-boot-starter-oauth2-resource-server

### 3. KEYNOTE-SERVICE (Port: 8081)
**Domain Model**: Keynote (id, firstName, lastName, email, function)

**Command Side**:
- Aggregate: KeynoteAggregate
- Commands: CreateKeynoteCommand, UpdateKeynoteCommand, DeleteKeynoteCommand
- Events: KeynoteCreatedEvent, KeynoteUpdatedEvent, KeynoteDeletedEvent
- Controller: KeynoteCommandController (POST /commands/create, PUT /commands/update/{id}, DELETE /commands/delete/{id})

**Query Side**:
- Entity: Keynote (JPA entity)
- Repository: KeynoteRepository (Spring Data JPA)
- Event Handler: KeynoteEventHandler (listens to events and updates read model)
- Controller: KeynoteQueryController (GET /queries/all, GET /queries/{id})
- Database: MySQL (keynote_db on port 3307)

**Dependencies**: 
- axon-spring-boot-starter
- spring-boot-starter-data-jpa
- mysql-connector-java
- spring-cloud-starter-netflix-eureka-client

### 4. CONFERENCE-SERVICE (Port: 8082)
**Domain Models**: 
- Conference (id, title, type[ACADEMIC/COMMERCIAL], date, duration, registeredCount, score, keynoteId)
- Review (id, conferenceId, date, text, stars[1-5])

**Command Side**:
- Aggregate: ConferenceAggregate
- Commands: CreateConferenceCommand, UpdateConferenceCommand, DeleteConferenceCommand, AddReviewCommand
- Events: ConferenceCreatedEvent, ConferenceUpdatedEvent, ConferenceDeletedEvent, ReviewAddedEvent
- Controller: ConferenceCommandController

**Query Side**:
- Entities: Conference, Review (JPA entities with OneToMany relationship)
- Repositories: ConferenceRepository, ReviewRepository
- Event Handler: ConferenceEventHandler
- Controller: ConferenceQueryController
- Database: MySQL (conference_db on port 3308)

**Kafka Integration**:
- When ReviewAddedEvent occurs, publish to Kafka topic "review-events"
- Producer: ReviewEventPublisher
- Config: KafkaProducerConfig

**Dependencies**: 
- axon-spring-boot-starter
- spring-boot-starter-data-jpa
- mysql-connector-java
- spring-cloud-starter-netflix-eureka-client
- spring-kafka

### 5. ANALYTICS-SERVICE (Port: 8083)
**Purpose**: Real-time analytics on reviews using Kafka Streams

**Functionality**:
- Consume from "review-events" topic
- Process with 5-second tumbling windows
- Calculate: count of reviews and sum of stars per window
- Expose REST endpoints to query current analytics

**Components**:
- ReviewStreamsProcessor (Kafka Streams topology)
- AnalyticsController (GET /analytics/reviews/window)
- ReviewStats model (count, totalStars, averageStars, windowStart, windowEnd)

**Dependencies**:
- spring-kafka
- kafka-streams
- spring-cloud-starter-netflix-eureka-client

### 6. FRONTEND (Port: 3000)
React application with TypeScript

**Pages**:
1. Login (Keycloak integration)
2. Home/Dashboard
3. Keynotes Management (list, create, edit, delete)
4. Conferences Management (list, create, edit, delete)
5. Conference Details (with reviews)
6. Analytics Dashboard (real-time charts)

**Libraries**:
- react-router-dom
- axios
- keycloak-js
- recharts (for analytics visualization)
- tailwindcss

**Features**:
- Protected routes requiring authentication
- CRUD operations for keynotes and conferences
- Add reviews to conferences
- Real-time analytics visualization
- Responsive design

## IMPLEMENTATION DETAILS

### Axon Framework Pattern

**Command Handler in Aggregate**:
```java
@Aggregate
public class KeynoteAggregate {
    @AggregateIdentifier
    private String keynoteId;
    
    public KeynoteAggregate() {}
    
    @CommandHandler
    public KeynoteAggregate(CreateKeynoteCommand command) {
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
        // ... set all fields
    }
}
```

**Event Handler for Query Side**:
```java
@Service
public class KeynoteEventHandler {
    @Autowired
    private KeynoteRepository repository;
    
    @EventHandler
    public void on(KeynoteCreatedEvent event) {
        Keynote keynote = new Keynote();
        BeanUtils.copyProperties(event, keynote);
        repository.save(keynote);
    }
}
```

### Kafka Streams Processing
```java
@Bean
public KStream<String, ReviewEvent> processReviews(StreamsBuilder builder) {
    KStream<String, ReviewEvent> source = builder.stream("review-events");
    
    source.groupByKey()
        .windowedBy(TimeWindows.of(Duration.ofSeconds(5)))
        .aggregate(
            ReviewStats::new,
            (key, value, aggregate) -> {
                aggregate.incrementCount();
                aggregate.addStars(value.getStars());
                return aggregate;
            },
            Materialized.as("review-stats-store")
        );
    
    return source;
}
```

### Gateway Routes (application.yml)
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: keynote-service
          uri: lb://KEYNOTE-SERVICE
          predicates:
            - Path=/keynotes/**
        - id: conference-service
          uri: lb://CONFERENCE-SERVICE
          predicates:
            - Path=/conferences/**
        - id: analytics-service
          uri: lb://ANALYTICS-SERVICE
          predicates:
            - Path=/analytics/**
```

### Security Configuration
- Configure Keycloak realm: "conference-realm"
- Create clients: "gateway-client" (confidential), "frontend-client" (public)
- JWT validation in gateway
- Role-based access: USER, ADMIN

## DOCKER COMPOSE

Create comprehensive docker-compose.yml with:
- MySQL instances (keynote_db, conference_db)
- Axon Server
- Kafka + Zookeeper
- Keycloak
- All microservices
- Frontend

**Network**: All services on same Docker network
**Depends_on**: Proper service dependencies
**Health checks**: For databases and Axon Server

## DELIVERABLES

1. **Complete source code** for all 5 microservices + frontend
2. **docker-compose.yml** - ready to deploy entire system
3. **README.md** - setup and run instructions
4. **Dockerfiles** - for each service
5. **pom.xml** - Maven configurations with correct dependencies
6. **application.yml** - for each microservice with proper config

## KEY REQUIREMENTS CHECKLIST

- [ ] Axon Server connection configured in all services
- [ ] Commands use @TargetAggregateIdentifier
- [ ] Events published via AggregateLifecycle.apply()
- [ ] Query side updates via @EventHandler
- [ ] Kafka producer in conference-service for review events
- [ ] Kafka Streams in analytics-service with 5-second windows
- [ ] Eureka registration in all microservices
- [ ] Gateway routes to all services
- [ ] OAuth2 security with Keycloak
- [ ] React frontend with Keycloak authentication
- [ ] MySQL databases for query models
- [ ] Docker deployment working end-to-end

## BUILD & RUN COMMANDS

Provide instructions for:
```bash
# Build all services
mvn clean install

# Start infrastructure
docker-compose up -d mysql-keynote mysql-conference axon-server kafka zookeeper keycloak eureka-server

# Start microservices
docker-compose up -d gateway-service keynote-service conference-service analytics-service

# Start frontend
docker-compose up -d frontend

# Access URLs
- Frontend: http://localhost:3000
- Gateway: http://localhost:8888
- Eureka: http://localhost:8761
- Keycloak: http://localhost:8080
- Axon Server: http://localhost:8024
```

## IMPORTANT NOTES

1. Use UUID.randomUUID().toString() for generating IDs
2. Include proper exception handling and validation
3. Use DTOs for request/response objects
4. Configure CORS in gateway for frontend
5. Add Swagger/OpenAPI documentation
6. Include logging configuration
7. Use Lombok to reduce boilerplate
8. Configure proper JSON serialization for events
9. Handle concurrent updates appropriately
10. Include basic error responses

Generate complete, production-ready code with proper project structure, dependencies, and configurations. All code should be functional and follow Spring Boot and Axon Framework best practices.

## GIT WORKFLOW - COMMIT AFTER EACH STEP

**IMPORTANT**: Git repository is already initialized. After completing EACH step below, you must:
1. Stage the files created/modified in that step
2. Commit with a descriptive message
3. Push to the main branch

Use this exact pattern after each step:

```bash
git add [files-for-this-step]
git commit -m "[commit-message]"
git push origin main
```

### STEP-BY-STEP GIT COMMITS:

**STEP 1: Create Eureka Server**
After creating eureka-server directory with all files:
```bash
git add eureka-server/
git commit -m "feat: Add Eureka Server for service discovery"
git push origin main
```

**STEP 2: Create API Gateway**
After creating gateway-service directory with all files:
```bash
git add gateway-service/
git commit -m "feat: Add API Gateway with OAuth2 security and routing"
git push origin main
```

**STEP 3: Create Docker Compose Infrastructure**
After creating initial docker-compose.yml with MySQL, Axon, Kafka, Keycloak:
```bash
git add docker-compose.yml
git commit -m "chore: Add Docker Compose with infrastructure services"
git push origin main
```

**STEP 4: Create Keynote Service - Command Side**
After creating command package with Aggregate, Commands, Events:
```bash
git add keynote-service/src/main/java/com/conference/keynote/command/
git add keynote-service/src/main/java/com/conference/keynote/common/events/
git commit -m "feat(keynote): Implement CQRS command side with event sourcing"
git push origin main
```

**STEP 5: Create Keynote Service - Query Side**
After creating query package with Entities, Repositories, Event Handlers:
```bash
git add keynote-service/src/main/java/com/conference/keynote/query/
git commit -m "feat(keynote): Implement CQRS query side with projections"
git push origin main
```

**STEP 6: Complete Keynote Service Configuration**
After creating application.yml, pom.xml, Dockerfile, main application class:
```bash
git add keynote-service/src/main/resources/
git add keynote-service/src/main/java/com/conference/keynote/KeynoteServiceApplication.java
git add keynote-service/pom.xml
git add keynote-service/Dockerfile
git commit -m "chore(keynote): Add configuration, dependencies, and Dockerfile"
git push origin main
```

**STEP 7: Create Conference Service - Command Side**
After creating command package with Aggregate, Commands, Events:
```bash
git add conference-service/src/main/java/com/conference/conference/command/
git add conference-service/src/main/java/com/conference/conference/common/
git commit -m "feat(conference): Implement CQRS command side with aggregates"
git push origin main
```

**STEP 8: Create Conference Service - Query Side**
After creating query package with Entities, Repositories, Event Handlers:
```bash
git add conference-service/src/main/java/com/conference/conference/query/
git commit -m "feat(conference): Implement CQRS query side with JPA entities"
git push origin main
```

**STEP 9: Add Kafka Integration to Conference Service**
After creating Kafka producer and configuration:
```bash
git add conference-service/src/main/java/com/conference/conference/kafka/
git commit -m "feat(conference): Add Kafka producer for review events"
git push origin main
```

**STEP 10: Complete Conference Service Configuration**
After creating application.yml, pom.xml, Dockerfile, main application class:
```bash
git add conference-service/src/main/resources/
git add conference-service/src/main/java/com/conference/conference/ConferenceServiceApplication.java
git add conference-service/pom.xml
git add conference-service/Dockerfile
git commit -m "chore(conference): Add configuration and Kafka setup"
git push origin main
```

**STEP 11: Create Analytics Service**
After creating complete analytics service with Kafka Streams:
```bash
git add analytics-service/
git commit -m "feat(analytics): Implement real-time analytics with Kafka Streams 5s windows"
git push origin main
```

**STEP 12: Update Docker Compose with All Services**
After adding all microservices to docker-compose.yml:
```bash
git add docker-compose.yml
git commit -m "chore: Update Docker Compose with all microservices"
git push origin main
```

**STEP 13: Create Frontend - Project Setup**
After initializing React project with dependencies:
```bash
git add frontend/package.json
git add frontend/tsconfig.json
git add frontend/tailwind.config.js
git add frontend/public/
git add frontend/src/index.tsx
git add frontend/src/App.tsx
git commit -m "feat(frontend): Initialize React TypeScript project with Tailwind"
git push origin main
```

**STEP 14: Add Authentication to Frontend**
After creating Keycloak integration and auth components:
```bash
git add frontend/src/auth/
git add frontend/src/pages/Login.tsx
git commit -m "feat(frontend): Add Keycloak OAuth2 authentication"
git push origin main
```

**STEP 15: Add Keynote Management UI**
After creating keynote components and services:
```bash
git add frontend/src/components/keynote/
git add frontend/src/services/keynoteService.ts
git add frontend/src/pages/KeynotesPage.tsx
git add frontend/src/types/keynote.ts
git commit -m "feat(frontend): Add keynote management UI with CRUD operations"
git push origin main
```

**STEP 16: Add Conference Management UI**
After creating conference components and services:
```bash
git add frontend/src/components/conference/
git add frontend/src/services/conferenceService.ts
git add frontend/src/pages/ConferencesPage.tsx
git add frontend/src/types/conference.ts
git commit -m "feat(frontend): Add conference management UI with details view"
git push origin main
```

**STEP 17: Add Review Functionality**
After creating review components and services:
```bash
git add frontend/src/components/review/
git add frontend/src/services/reviewService.ts
git add frontend/src/types/review.ts
git commit -m "feat(frontend): Add review submission and display functionality"
git push origin main
```

**STEP 18: Add Analytics Dashboard**
After creating analytics components:
```bash
git add frontend/src/components/analytics/
git add frontend/src/services/analyticsService.ts
git add frontend/src/pages/AnalyticsPage.tsx
git commit -m "feat(frontend): Add real-time analytics dashboard with charts"
git push origin main
```

**STEP 19: Add Common Components and Utilities**
After creating shared components and utils:
```bash
git add frontend/src/components/common/
git add frontend/src/utils/
git add frontend/src/services/api.ts
git commit -m "feat(frontend): Add common components and utility functions"
git push origin main
```

**STEP 20: Complete Frontend with Dockerfile**
After creating frontend Dockerfile and final configurations:
```bash
git add frontend/Dockerfile
git add frontend/.env
git add frontend/README.md
git commit -m "chore(frontend): Add Dockerfile and production configuration"
git push origin main
```

**STEP 21: Create Parent POM**
After creating parent Maven pom.xml:
```bash
git add pom.xml
git commit -m "chore: Add parent POM with dependency management"
git push origin main
```

**STEP 22: Add Documentation**
After creating README, architecture diagrams, API docs:
```bash
git add README.md
git add docs/
git commit -m "docs: Add comprehensive documentation and diagrams"
git push origin main
```

**STEP 23: Add Postman Collection**
After creating Postman collection for API testing:
```bash
git add postman/
git commit -m "docs: Add Postman collection for API testing"
git push origin main
```

**STEP 24: Add .gitignore**
After creating comprehensive .gitignore:
```bash
git add .gitignore
git commit -m "chore: Add .gitignore for Java, Node, and Docker"
git push origin main
```

**STEP 25: Final Review and Tag**
After completing all features and testing:
```bash
git add .
git commit -m "chore: Final refinements and bug fixes"
git push origin main
git tag -a v1.0.0 -m "Release v1.0.0: Complete Conference Management System"
git push origin v1.0.0
```

### Commit Message Guidelines:
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
- Be descriptive but concise
- Use present tense ("Add feature" not "Added feature")
- Reference the component in parentheses when applicable: `feat(keynote):`

### Critical Rules:
1. **ALWAYS** commit after completing each step
2. **NEVER** skip the git push command
3. **VERIFY** push was successful before moving to next step
4. If push fails, fix the issue before continuing
5. Keep commits atomic - each commit should represent one complete unit of work