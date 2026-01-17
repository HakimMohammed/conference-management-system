package com.conference.keynote.command.controller;

import com.conference.keynote.command.CreateKeynoteCommand;
import com.conference.keynote.command.DeleteKeynoteCommand;
import com.conference.keynote.command.UpdateKeynoteCommand;
import lombok.AllArgsConstructor;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/keynotes/commands")
@AllArgsConstructor
public class KeynoteCommandController {

    private final CommandGateway commandGateway;

    @PostMapping("/create")
    public CompletableFuture<String> createKeynote(@RequestBody CreateKeynoteCommand command) {
        command.setKeynoteId(UUID.randomUUID().toString());
        return commandGateway.send(command);
    }

    @PutMapping("/update/{id}")
    public CompletableFuture<String> updateKeynote(@PathVariable String id, @RequestBody UpdateKeynoteCommand command) {
        command.setKeynoteId(id);
        return commandGateway.send(command);
    }

    @DeleteMapping("/delete/{id}")
    public CompletableFuture<String> deleteKeynote(@PathVariable String id) {
        return commandGateway.send(new DeleteKeynoteCommand(id));
    }
}
