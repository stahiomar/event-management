import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../model/event';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // Import Event model

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, CommonModule, FormsModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent {
  constructor(private router: Router) {}

  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly eventService = inject(EventService);  // Inject EventService

  isAuthenticated = false;
  username = '';  // Store the username of the authenticated user
  events: Event[] = [];  // Store the list of events for the owner
  filteredEvents: Event[] = [];  // Store the filtered events based on search criteria

  // Search filters
  searchName: string = '';
  searchLocation: string = '';
  searchType: string = '';

  ngOnInit(): void {
    // Check if the user is authenticated
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        // Get the username of the authenticated user
        this.oidcSecurityService.userData$.subscribe(({ userData }) => {
          this.username = userData.preferred_username;

          // Fetch events for the authenticated user (owner)
          this.fetchEvents();
        });
      }
    });
  }

  fetchEvents(): void {
    // Call the service to fetch events for the authenticated user
    this.eventService.getEventsByOwner(this.username).subscribe(
      (events) => {
        this.events = events;  // Set the events data
        this.filterEvents();  // Apply initial filter if needed
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  deleteEvent(eventId: number): void {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this event?');

    if (isConfirmed) {
      // If user confirms, call the service to delete the event
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          console.log('Event deleted successfully');
          this.events = this.events.filter(event => event.id !== eventId); // Remove the event from the list
          this.filterEvents(); // Reapply filters
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    } else {
      // If user cancels, do nothing
      console.log('Event deletion canceled');
    }
  }

  updateEvent(event: Event): void {
    // Navigate to an update form with the event details (modify the route as needed)
    this.router.navigate(['/events/update', event.id], { state: { event } });
  }

  filterEvents(): void {
    // Apply search filters
    this.filteredEvents = this.events.filter(event => {
      const matchesName = event.title.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesLocation = event.location.toLowerCase().includes(this.searchLocation.toLowerCase());
      const matchesType = !this.searchType || event.type === this.searchType;

      return matchesName && matchesLocation && matchesType;
    });
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/create-event']);
  }

}
