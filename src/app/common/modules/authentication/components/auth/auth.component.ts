import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderService } from '../../../loader/services/loader.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const token = this.authenticationService.getToken();
    if (token) {
      this.loaderService.show();
      this.authenticationService.getUser(token).subscribe(
        result => {
          if (result.success === true) {
            if (!result.data.influencer) {
              this.router.navigateByUrl('account/logout');
            } else {
              this.commonService.setSlug(result.data.influencer.slug);
              this.commonService.setName(result.data.firstname + ' ' + result.data.lastname);
              this.commonService.setAvatar(result.data.influencer.avatar);
              this.commonService.setPasswordCheck(result.data.is_password_set);
              localStorage.setItem('user', result.data.user_id);
            }
          } else {
            this.router.navigateByUrl('account/logout');
          }
        },
        error => {},
        () => {
          this.loaderService.hide();
        }
      );
    }
  }

}
