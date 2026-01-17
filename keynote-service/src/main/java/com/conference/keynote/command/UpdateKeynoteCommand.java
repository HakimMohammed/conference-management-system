package com.conference.keynote.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.axonframework.modelling.command.TargetAggregateIdentifier;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateKeynoteCommand {
    @TargetAggregateIdentifier
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String keynoteFunction;
}
