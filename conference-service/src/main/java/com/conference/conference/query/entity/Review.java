package com.conference.conference.query.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    private String reviewId;
    private LocalDateTime date;
    private String text;
    private int stars;

    @ManyToOne
    @JoinColumn(name = "conference_id")
    @JsonIgnore
    private Conference conference;
}
