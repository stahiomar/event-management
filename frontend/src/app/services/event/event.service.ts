import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../model/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:9000/events';

  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post('/event-service/events', event);
  }

  getEvents(): Observable<Array<Event>> {
    return this.http.get<Array<Event>>('/event-service/events');
    //return this.http.get<Array<Event>>('/event-service/events');
  }

  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`/event-service/events/${eventId}`);
  }

  // Use custom header to send the owner
  getEventsByOwner(owner: string): Observable<Event[]> {
    const headers = new HttpHeaders().set('Owner', owner);  // Set 'Owner' header
    return this.http.get<Event[]>('/event-service/events/me', { headers });
  }

  // Delete an event by ID
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`/event-service/events/${eventId}`);
  }

  // Update an event
  updateEvent(eventId: number, updatedEvent: Event): Observable<Event> {
    return this.http.put<Event>(`/event-service/events/${eventId}`, updatedEvent);
    //return this.http.put<Event>(`/event-service/events${eventId}`, updatedEvent);

  }

}
