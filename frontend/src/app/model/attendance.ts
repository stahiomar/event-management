export interface Attendance {
  id?: number; // Optional, as it might not be provided in POST requests
  eventId: number;
  attendee: string;
  present: boolean;
}

export interface Attendance {
  eventId: number;
  attendee: string;
  present: boolean;
}
