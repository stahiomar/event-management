import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {CreateEventComponent} from "./pages/create-event/create-event.component";
import {MyEventsComponent} from "./pages/my-events/my-events.component";
import {UpdateEventComponent} from "./pages/update-event/update-event.component";

export const routes: Routes = [
  {
    path: '', pathMatch: 'full', loadComponent: () => {
      return import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent)
    }
  },
  {
    path: 'create-event', loadComponent: () => {
      return import('./pages/create-event/create-event.component').then((m) => m.CreateEventComponent)
    }
  },
  {
    path: 'my-events', loadComponent: () => {
      return import('./pages/my-events/my-events.component').then((m) => m.MyEventsComponent)
    }
  },
  {
    path: 'profile', loadComponent: () => {
      return import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
    }
  },
  { path: 'events/update/:id', component: UpdateEventComponent }
];

