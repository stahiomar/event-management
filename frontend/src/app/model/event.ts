export interface Event {
  id?: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  type: EventType;
  owner: string;
}

export enum EventType {
  ACADEMIC = 'ACADEMIC',
  SPORT = 'SPORT',
  CULTURAL = 'CULTURAL'
}
