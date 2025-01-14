package com.example.event_service.controller;

import com.example.event_service.model.Event;
import com.example.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@CrossOrigin
public class EventController {
    private final EventRepository eventRepository;
    private final Job job;
    private final JobLauncher jobLauncher;

    @PostMapping("/events/job")
    public void importCsvToDBJob() {
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();
        try {
            jobLauncher.run(job, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            e.printStackTrace();
        }
    }

    @GetMapping(value = "/events", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    @PostMapping("events")
    public Event createEvent(@RequestBody Event event) {
        eventRepository.save(event);
        return event;
    }

    @GetMapping("/events/me")
    public List<Event> getMyEvents(@RequestHeader("Owner") String owner) {
        return eventRepository.findByOwner(owner);
    }

    @GetMapping("/events/{id}")
    public Optional<Event> getMyEvents(@PathVariable Integer id) {
        return eventRepository.findById(id);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Integer id, @RequestBody Event updatedEvent) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            Event existingEvent = optionalEvent.get();
            // Update fields
            existingEvent.setTitle(updatedEvent.getTitle());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setLocation(updatedEvent.getLocation());
            existingEvent.setTime(updatedEvent.getTime());
            existingEvent.setDate(updatedEvent.getDate());
            existingEvent.setType(updatedEvent.getType());
            existingEvent.setOwner(updatedEvent.getOwner());

            eventRepository.save(existingEvent);
            return ResponseEntity.ok(existingEvent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /*@PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String userId = jwt.getClaim("sub");
            event.setUserId(userId); // Set the user ID
        }
        return eventRepository.save(event);
    }


    @GetMapping("/events/me")
    public ResponseEntity<List<Event>> getUserEvents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String userId = jwt.getClaim("sub"); // "sub" is the user's unique identifier in Keycloak

            List<Event> userEvents = eventRepository.findByUserId(userId);
            return ResponseEntity.ok(userEvents);
        }

        return ResponseEntity.status(401).build(); // Unauthorized if JWT is not present
    }*/
}
