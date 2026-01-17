package com.conference.conference.command.controller;

import com.conference.conference.command.AddReviewCommand;
import com.conference.conference.command.CreateConferenceCommand;
import com.conference.conference.command.DeleteConferenceCommand;
import com.conference.conference.command.UpdateConferenceCommand;
import lombok.AllArgsConstructor;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/conferences/commands")
@AllArgsConstructor
public class ConferenceCommandController {

    private final CommandGateway commandGateway;

    @PostMapping("/create")
    public CompletableFuture<String> createConference(@RequestBody CreateConferenceCommand command) {
        command.setConferenceId(UUID.randomUUID().toString());
        return commandGateway.send(command);
    }

    @PutMapping("/update/{id}")
    public CompletableFuture<String> updateConference(@PathVariable String id, @RequestBody UpdateConferenceCommand command) {
        command.setConferenceId(id);
        return commandGateway.send(command);
    }

    @DeleteMapping("/delete/{id}")
    public CompletableFuture<String> deleteConference(@PathVariable String id) {
        return commandGateway.send(new DeleteConferenceCommand(id));
    }

    @PostMapping("/{id}/reviews")
    public CompletableFuture<String> addReview(@PathVariable String id, @RequestBody AddReviewCommand command) {
        command.setConferenceId(id);
        command.setReviewId(UUID.randomUUID().toString());
        return commandGateway.send(command);
    }
}
