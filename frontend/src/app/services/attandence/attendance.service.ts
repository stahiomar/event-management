import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Attendance} from "../../model/attendance";

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseUrl = 'http://localhost:9002/attendance';

  constructor(private http: HttpClient) {}

  // POST: Mark attendance
  markAttendance(attendance: {
    eventId: number | undefined;
    attendee: string;
    present: boolean
  }): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}`, attendance);
  }

  // GET: Get attendance for an event
  getAttendance(eventId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/${eventId}`);
  }
}
