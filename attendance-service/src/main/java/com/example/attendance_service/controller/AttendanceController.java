package com.example.attendance_service.controller;


import com.example.attendance_service.model.Attendance;
import com.example.attendance_service.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;



@RestController
@CrossOrigin
public class AttendanceController {
    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @PostMapping("/attendance")
    public Attendance markAttendance(@RequestBody Attendance attendance) {
        System.out.println("Received Attendance: " + attendance); // Add logging
        attendanceRepository.save(attendance);
        return attendance;
    }


    @GetMapping("/attendance/{eventId}")
    public ResponseEntity<List<Attendance>> getAttendanceForEvent(@PathVariable Integer eventId) {
        List<Attendance> attendanceList = attendanceRepository.findByEventId(eventId);
        return ResponseEntity.ok(attendanceList);
    }

}
