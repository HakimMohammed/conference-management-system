package com.conference.keynote.common.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeynoteCreatedEvent {
    private String keynoteId;
    private String firstName;
    private String lastName;
    private String email;
    private String keynoteFunction;
}
