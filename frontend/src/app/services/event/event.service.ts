import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:9001/events'; // Replace with your actual endpoint

  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }
}
