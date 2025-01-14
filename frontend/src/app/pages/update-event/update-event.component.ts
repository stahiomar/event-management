import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../model/event';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {
  eventId!: number;
  event: Event = {} as Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.eventService.getEventById(this.eventId).subscribe(
      (event) => (this.event = {...event}),
      (error) => console.error('Error fetching event:', error)
    );
  }

  updateEvent(): void {
    console.log('Updated Event:', this.event); // Debugging
    this.eventService.updateEvent(this.eventId, this.event).subscribe(
      () => {
        console.log('Event updated successfully');
        this.router.navigate(['/my-events']); // Redirect after successful update
      },
      (error) => console.error('Error updating event:', error)
    );
  }

}
