import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { AccountService } from '../../services/account.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const token = this.authenticationService.getToken();
    if (!token) {
      localStorage.clear();
      this.router.navigateByUrl('/account/login');
    }
    this.loaderService.show();
    this.accountService.logout(token).subscribe(
      result => {
        if (result.success) {
          this.authenticationService.logout();
        }
        localStorage.clear();
      },
      error => {},
      () => {
        this.loaderService.hide();
        this.router.navigateByUrl('/account/login');
      }
    );
  }

}
