package com.example.event_service.conf;

import com.example.event_service.model.Event;
import org.springframework.batch.item.ItemProcessor;

public class EventProcessor implements ItemProcessor<Event, Event> {

    @Override
    public Event process(Event event) {
        return event;
    }
}