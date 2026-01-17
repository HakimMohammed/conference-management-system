package com.conference.keynote.query.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Keynote {
    @Id
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String keynoteFunction;
}
