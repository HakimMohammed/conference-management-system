package com.conference.conference.command;

import com.conference.conference.common.event.ConferenceCreatedEvent;
import com.conference.conference.common.event.ConferenceUpdatedEvent;
import com.conference.conference.common.event.ReviewAddedEvent;
import com.conference.conference.common.event.ConferenceDeletedEvent;
import lombok.NoArgsConstructor;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.modelling.command.AggregateLifecycle;
import org.axonframework.spring.stereotype.Aggregate;

import java.time.LocalDateTime;

@Aggregate
@NoArgsConstructor
public class ConferenceAggregate {

    @AggregateIdentifier
    private String conferenceId;
    private String title;
    private String type;
    private LocalDateTime date;
    private int duration;
    private int registeredCount;
    private double score;
    private String keynoteId;

    @CommandHandler
    public ConferenceAggregate(CreateConferenceCommand command) {
        AggregateLifecycle.apply(new ConferenceCreatedEvent(
                command.getConferenceId(),
                command.getTitle(),
                command.getType(),
                command.getDate(),
                command.getDuration(),
                command.getRegisteredCount(),
                command.getScore(),
                command.getKeynoteId()
        ));
    }

    @EventSourcingHandler
    public void on(ConferenceCreatedEvent event) {
        this.conferenceId = event.getConferenceId();
        this.title = event.getTitle();
        this.type = event.getType();
        this.date = event.getDate();
        this.duration = event.getDuration();
        this.registeredCount = event.getRegisteredCount();
        this.score = event.getScore();
        this.keynoteId = event.getKeynoteId();
    }

    @CommandHandler
    public void handle(UpdateConferenceCommand command) {
        AggregateLifecycle.apply(new ConferenceUpdatedEvent(
                command.getConferenceId(),
                command.getTitle(),
                command.getType(),
                command.getDate(),
                command.getDuration(),
                command.getRegisteredCount(),
                command.getScore(),
                command.getKeynoteId()
        ));
    }

    @EventSourcingHandler
    public void on(ConferenceUpdatedEvent event) {
        this.title = event.getTitle();
        this.type = event.getType();
        this.date = event.getDate();
        this.duration = event.getDuration();
        this.registeredCount = event.getRegisteredCount();
        this.score = event.getScore();
        this.keynoteId = event.getKeynoteId();
    }

    @CommandHandler
    public void handle(AddReviewCommand command) {
        AggregateLifecycle.apply(new ReviewAddedEvent(
                command.getReviewId(),
                command.getConferenceId(),
                command.getDate(),
                command.getText(),
                command.getStars()
        ));
    }

    @CommandHandler
    public void handle(DeleteConferenceCommand command) {
        AggregateLifecycle.apply(new ConferenceDeletedEvent(command.getConferenceId()));
    }

    @EventSourcingHandler
    public void on(ConferenceDeletedEvent event) {
        AggregateLifecycle.markDeleted();
    }
}
