package com.conference.conference.query.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conference {
    @Id
    private String conferenceId;
    private String title;
    private String type;
    private LocalDateTime date;
    private int duration;
    private int registeredCount;
    private double score;
    private String keynoteId;

    @OneToMany(mappedBy = "conference", cascade = CascadeType.ALL)
    private List<Review> reviews;
}
