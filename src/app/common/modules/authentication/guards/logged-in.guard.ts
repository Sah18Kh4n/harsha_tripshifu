import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authenticationService.getToken();
    if (token) {
      return true;
    } else if (state.url === '/account/logout') {
      return true;
    }
    this.router.navigateByUrl('account/logout');
    return false;
  }
}
