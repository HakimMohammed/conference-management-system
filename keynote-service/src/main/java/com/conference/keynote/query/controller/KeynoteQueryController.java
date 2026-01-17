package com.conference.keynote.query.controller;

import com.conference.keynote.query.entity.Keynote;
import com.conference.keynote.query.repository.KeynoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/keynotes/queries")
@AllArgsConstructor
public class KeynoteQueryController {

    private final KeynoteRepository keynoteRepository;

    @GetMapping("/all")
    public List<Keynote> getAllKeynotes() {
        return keynoteRepository.findAll();
    }

    @GetMapping("/{id}")
    public Keynote getKeynoteById(@PathVariable String id) {
        return keynoteRepository.findById(id).orElse(null);
    }
}
