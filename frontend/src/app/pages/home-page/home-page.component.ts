import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Router } from "@angular/router";
import { EventService } from "../../services/event/event.service"; // Import EventService
import { Event } from "../../model/event"; // Import Event model
import { AsyncPipe, JsonPipe } from "@angular/common";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Attendance} from "../../model/attendance";
import {AttendanceService} from "../../services/attandence/attendance.service";
import { MailService } from '../../services/mail/mail.service';
import { Mail } from '../../model/mail';


@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly eventService = inject(EventService); // Inject EventService
  private readonly mailService = inject(MailService); // Inject MailService
  private readonly attendanceService = inject(AttendanceService); // Inject AttendanceService
  private readonly router = inject(Router);

  isAuthenticated = false;
  username = "";
  useremail = "";
  events: Event[] = []; // Declare events array
  filteredEvents: Event[] = []; // Declare filtered events array for search functionality

  searchName: string = ''; // Initialize search input for event name
  searchLocation: string = ''; // Initialize search input for location
  searchType: string = ''; // Initialize search input for event type

  ngOnInit(): void {
    // Check authentication status and fetch events if authenticated
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        this.oidcSecurityService.userData$.subscribe(
          ({userData}) => {
            this.username = userData.preferred_username
            this.useremail = userData.email;
          }
        )
        if (isAuthenticated) {
          this.fetchEvents();
        }
      }
    );
  }

  // Fetch events from the EventService
  fetchEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.filteredEvents = events; // Initially, display all events
    });
  }

  // Filter events based on search criteria (name, location, type)
  filterEvents(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchesName = event.title.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesLocation = event.location.toLowerCase().includes(this.searchLocation.toLowerCase());
      const matchesType = this.searchType ? event.type === this.searchType : true;
      return matchesName && matchesLocation && matchesType;
    });
  }


  // Optional: Navigate to event creation page
  goToCreateEventPage(): void {
    this.router.navigateByUrl('/add-event');
  }

  // Mark attendance for an event
  onMarkAttendance(event: Event): void {
    const attendance: { eventId: number | undefined; attendee: string; present: boolean } = {
      eventId: event.id,
      attendee: this.username,
      present: true,
    };

    // Mark attendance
    this.attendanceService.markAttendance(attendance).subscribe({
      next: (response) => {
        console.log('Attendance marked:', response);

        // Prepare mail object
        const mail: Mail = {
          receiver: this.useremail, // User's email fetched from Keycloak
          title: `Attendance Confirmation: ${event.title}`,
          description: `You have successfully marked your attendance for the event "${event.title}".`,
          location: event.location,
          date: event.date,
          time: event.time,
        };

        // Send mail
        this.mailService.sendMail(mail).subscribe({
          next: () => {
            console.log('Mail sent successfully');
            alert(`Attendance marked and email sent to ${this.username}`);
          },
          error: (err) => {
            console.error('Error sending mail:', err);
            alert('Failed to send email notification.');
          },
        });
      },
      error: (err) => {
        console.error('Error marking attendance:', err);
        alert('Failed to mark attendance.');
      }
    });
  }
}

/*

export class HeaderComponent implements OnInit {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  isAuthenticated = false;
  username = "";

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
      }
    )
    this.oidcSecurityService.userData$.subscribe(
      ({userData}) => {
        this.username = userData.preferred_username
      }
    )
  }


*/
