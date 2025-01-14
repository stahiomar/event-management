package com.example.event_service.repository;

import com.example.event_service.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByOwner(String owner);
}
