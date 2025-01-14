package com.example.attendance_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer eventId; // Reference to the Event ID

    @Column(nullable = false)
    private String attendee; // Username or attendee ID

    @Column(nullable = false)
    private Boolean present;

    public String toString(){
        return eventId + "\t" + attendee + "\t" + present;
    }

}

