package com.example.attendance_service.repository;

import com.example.attendance_service.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByEventId(Integer eventId);
}
