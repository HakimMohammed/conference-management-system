package com.conference.conference.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewAddedEvent {
    private String reviewId;
    private String conferenceId;
    private LocalDateTime date;
    private String text;
    private int stars;
}
