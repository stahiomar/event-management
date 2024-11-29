package com.example.event_service.controller;

import com.example.event_service.model.Event;
import com.example.event_service.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EventController {
    @Autowired
    EventRepository eventRepository;

    @GetMapping("/events")
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }
}
