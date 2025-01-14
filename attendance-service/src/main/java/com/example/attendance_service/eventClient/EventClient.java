package com.example.attendance_service.eventClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", url = "http://localhost:9001")
public interface EventClient {

    @GetMapping("/events/{id}")
    Object getEventById(@PathVariable("id") Integer id);
}

