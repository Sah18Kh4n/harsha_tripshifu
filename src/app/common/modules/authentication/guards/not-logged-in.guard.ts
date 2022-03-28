import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class NotLoggedInGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookie: CookieService
  ) { }

  canActivate(): boolean {
    const token = this.cookie.get('UTKN');
    if (token) {
      this.router.navigateByUrl('dashboard');
      return false;
    }
    return true;
  }
}
