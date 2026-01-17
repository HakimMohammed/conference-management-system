package com.conference.conference.query.controller;

import com.conference.conference.query.entity.Conference;
import com.conference.conference.query.entity.Review;
import com.conference.conference.query.repository.ConferenceRepository;
import com.conference.conference.query.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/conferences/queries")
@AllArgsConstructor
public class ConferenceQueryController {

    private final ConferenceRepository conferenceRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping("/all")
    public List<Conference> getAllConferences() {
        return conferenceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Conference getConferenceById(@PathVariable String id) {
        return conferenceRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/reviews")
    public List<Review> getConferenceReviews(@PathVariable String id) {
        return conferenceRepository.findById(id).map(Conference::getReviews).orElse(null);
    }
}
