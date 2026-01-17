package com.conference.keynote.query.handler;

import com.conference.keynote.common.events.KeynoteCreatedEvent;
import com.conference.keynote.common.events.KeynoteDeletedEvent;
import com.conference.keynote.common.events.KeynoteUpdatedEvent;
import com.conference.keynote.query.entity.Keynote;
import com.conference.keynote.query.repository.KeynoteRepository;
import lombok.AllArgsConstructor;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class KeynoteEventHandler {

    private final KeynoteRepository keynoteRepository;

    @EventHandler
    public void on(KeynoteCreatedEvent event) {
        Keynote keynote = new Keynote();
        BeanUtils.copyProperties(event, keynote);
        keynoteRepository.save(keynote);
    }

    @EventHandler
    public void on(KeynoteUpdatedEvent event) {
        Keynote keynote = keynoteRepository.findById(event.getKeynoteId()).orElse(new Keynote());
        BeanUtils.copyProperties(event, keynote);
        keynoteRepository.save(keynote);
    }

    @EventHandler
    public void on(KeynoteDeletedEvent event) {
        keynoteRepository.deleteById(event.getKeynoteId());
    }
}
