import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from "@angular/common";
import { EventService } from "../../services/event/event.service"; // Replace ProductService with EventService

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  addEventForm: FormGroup;
  private readonly eventService = inject(EventService); // Inject EventService
  eventCreated = false;

  constructor(private fb: FormBuilder) {
    this.addEventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  // Getter methods for form controls
  get title() {
    return this.addEventForm.get('title');
  }

  get description() {
    return this.addEventForm.get('description');
  }

  get location() {
    return this.addEventForm.get('location');
  }

  get date() {
    return this.addEventForm.get('date');
  }

  get time() {
    return this.addEventForm.get('time');
  }

  get type() {
    return this.addEventForm.get('type');
  }

  onSubmit() {
    if (this.addEventForm.valid) {
      const event = {
        title: this.addEventForm.get('title')?.value,
        description: this.addEventForm.get('description')?.value,
        location: this.addEventForm.get('location')?.value,
        date: this.addEventForm.get('date')?.value,
        time: this.addEventForm.get('time')?.value,
        type: this.addEventForm.get('type')?.value,
      };

      this.eventService.createEvent(event).subscribe(() => {
        this.eventCreated = true;
        this.addEventForm.reset();
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
