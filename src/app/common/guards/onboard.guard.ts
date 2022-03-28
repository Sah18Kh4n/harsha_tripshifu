import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class OnboardGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const isOnboarded = localStorage.getItem('isOnboarded');
        if (isOnboarded === 'false') {
            this.router.navigateByUrl('profileonboarding');
            return false;
        }
        return true;
    }
}
