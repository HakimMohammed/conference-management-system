package com.conference.keynote.command;

import com.conference.keynote.common.events.KeynoteCreatedEvent;
import com.conference.keynote.common.events.KeynoteDeletedEvent;
import com.conference.keynote.common.events.KeynoteUpdatedEvent;
import lombok.NoArgsConstructor;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.modelling.command.AggregateLifecycle;
import org.axonframework.spring.stereotype.Aggregate;

@Aggregate
@NoArgsConstructor
public class KeynoteAggregate {

    @AggregateIdentifier
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String keynoteFunction;

    @CommandHandler
    public KeynoteAggregate(CreateKeynoteCommand command) {
        AggregateLifecycle.apply(new KeynoteCreatedEvent(
                command.getKeynoteId(),
                command.getFirstName(),
                command.getLastName(),
                command.getEmail(),
                command.getKeynoteFunction()
        ));
    }

    @EventSourcingHandler
    public void on(KeynoteCreatedEvent event) {
        this.keynoteId = event.getKeynoteId();
        this.firstName = event.getFirstName();
        this.lastName = event.getLastName();
        this.email = event.getEmail();
        this.keynoteFunction = event.getKeynoteFunction();
    }

    @CommandHandler
    public void handle(UpdateKeynoteCommand command) {
        AggregateLifecycle.apply(new KeynoteUpdatedEvent(
                command.getKeynoteId(),
                command.getFirstName(),
                command.getLastName(),
                command.getEmail(),
                command.getKeynoteFunction()
        ));
    }

    @EventSourcingHandler
    public void on(KeynoteUpdatedEvent event) {
        this.firstName = event.getFirstName();
        this.lastName = event.getLastName();
        this.email = event.getEmail();
        this.keynoteFunction = event.getKeynoteFunction();
    }

    @CommandHandler
    public void handle(DeleteKeynoteCommand command) {
        AggregateLifecycle.apply(new KeynoteDeletedEvent(command.getKeynoteId()));
    }

    @EventSourcingHandler
    public void on(KeynoteDeletedEvent event) {
        AggregateLifecycle.markDeleted();
    }
}
