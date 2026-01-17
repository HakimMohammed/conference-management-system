package com.conference.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewStats {
    private long count;
    private long totalStars;
    private double averageStars;
    private Instant windowStart;
    private Instant windowEnd;
}
