import { Component, OnInit } from '@angular/core';
import { ProfileServices } from '../../../modules/profile/services/profile.services';
import { ToasterService } from '../../modules/toaster/services/toaster.service';
import { LoaderService } from '../../modules/loader/services/loader.service';
import { EmailVerificationService } from '../../services/email-verification.service';
import { AuthenticationService } from '../../modules/authentication/services/authentication.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  notVerified: boolean;

  constructor(
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToasterService,
    private profileService: ProfileServices,
    private authenticationService: AuthenticationService,
    private verificationService: EmailVerificationService
  ) { }

  ngOnInit() {
    this.checkVerificationStatus();
    this.verificationService.getVerificationState()
      .subscribe(state => {
        this.notVerified = !state;
      });
  }

  checkVerificationStatus() {
    const userId = this.authenticationService.getUserId();
    this.profileService.getprofile(userId).subscribe(res => {
      if (res.success === true) {
        this.commonService.setSlug(res.data.profile.slug);
        localStorage.setItem('email_verification', res.data.profile.email_verification);
        if (res.data.profile.email_verification === 1) {
          this.verificationService.verified();
        } else if (res.data.profile.email) {
          this.verificationService.notverified();
        } else {
          this.verificationService.verified();
        }
      }
    });
  }

  resendLink() {
    this.loaderService.show();
    this.profileService
      .resendVerificationEmail(this.authenticationService.getUserId())
      .subscribe(result => {
        if (result.success === true) {
          this.toasterService.success({
            message: 'Mail sent successfully',
            timeOut: 5000
          });
        } else {
          console.log(result.message);
          this.toasterService.error({
            message: 'Failed to send the mail',
            timeOut: 5000
          });
        }
      },
        error => {
          console.log(error);
          this.toasterService.error({
            message: 'Failed to send the mail',
            timeOut: 5000
          });
        },
        () => {
          this.loaderService.hide();
        });
  }
}
