import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class OnboardedGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const isOnboarded = localStorage.getItem('isOnboarded');
        if (isOnboarded && isOnboarded === 'true') {
          this.router.navigateByUrl('profile');
          return false;
        }
        return true;
    }
}
