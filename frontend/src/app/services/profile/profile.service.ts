import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  getUserProfile(): Observable<any> {
    return this.oidcSecurityService.userData$.pipe(
      map(({ userData }) => ({
        username: userData.preferred_username,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
      }))
    );
  }
}
