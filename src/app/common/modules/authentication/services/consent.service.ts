import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  private consentIdentifier = 'CKCNSNT';
  private secure = environment.secureCookie;
  private expiryDays = environment.consentExpiryDays;

  constructor(
    private cookie: CookieService
  ) { }

  getConsent(): string {
    return this.cookie.get(this.consentIdentifier);
  }

  acceptCookies() {
    environment.siblings.map(domain => {
      this.cookie.set(this.consentIdentifier, 'true', this.expiryDays, '/', domain, this.secure, 'Lax');
    });
  }
}
