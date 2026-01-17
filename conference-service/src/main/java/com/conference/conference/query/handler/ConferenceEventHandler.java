package com.conference.conference.query.handler;

import com.conference.conference.common.event.ConferenceCreatedEvent;
import com.conference.conference.common.event.ConferenceDeletedEvent;
import com.conference.conference.common.event.ConferenceUpdatedEvent;
import com.conference.conference.common.event.ReviewAddedEvent;
import com.conference.conference.query.entity.Conference;
import com.conference.conference.query.entity.Review;
import com.conference.conference.query.repository.ConferenceRepository;
import com.conference.conference.query.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.beans.BeanUtils;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConferenceEventHandler {

    private final ConferenceRepository conferenceRepository;
    private final ReviewRepository reviewRepository;
    private final KafkaTemplate<String, ReviewAddedEvent> kafkaTemplate;

    @EventHandler
    public void on(ConferenceCreatedEvent event) {
        Conference conference = new Conference();
        BeanUtils.copyProperties(event, conference);
        conferenceRepository.save(conference);
    }

    @EventHandler
    public void on(ConferenceUpdatedEvent event) {
        Conference conference = conferenceRepository.findById(event.getConferenceId()).orElse(new Conference());
        BeanUtils.copyProperties(event, conference);
        conferenceRepository.save(conference);
    }

    @EventHandler
    public void on(ConferenceDeletedEvent event) {
        conferenceRepository.deleteById(event.getConferenceId());
    }

    @EventHandler
    public void on(ReviewAddedEvent event) {
        Conference conference = conferenceRepository.findById(event.getConferenceId()).orElse(null);
        if (conference != null) {
            Review review = new Review();
            BeanUtils.copyProperties(event, review);
            review.setConference(conference);
            reviewRepository.save(review);
            kafkaTemplate.send("review-events", event);
        }
    }
}
