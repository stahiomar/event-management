import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mail } from '../../model/mail';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private readonly mailApiUrl = 'http://localhost:9003/mail/send';

  constructor(private http: HttpClient) {}

  sendMail(mail: Mail): Observable<any> {
    return this.http.post(this.mailApiUrl, mail);
  }
}
