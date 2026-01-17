package com.conference.conference.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.axonframework.modelling.command.TargetAggregateIdentifier;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddReviewCommand {
    private String reviewId;
    @TargetAggregateIdentifier
    private String conferenceId;
    private LocalDateTime date;
    private String text;
    private int stars;
}
