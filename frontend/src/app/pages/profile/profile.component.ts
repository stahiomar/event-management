import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  userProfile: any = null;

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
    });
  }
}
