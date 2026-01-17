package com.conference.conference.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.axonframework.modelling.command.TargetAggregateIdentifier;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateConferenceCommand {
    @TargetAggregateIdentifier
    private String conferenceId;
    private String title;
    private String type;
    private LocalDateTime date;
    private int duration;
    private int registeredCount;
    private double score;
    private String keynoteId;
}
