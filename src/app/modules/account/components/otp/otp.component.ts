import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { countrycodes } from '../../../profile/models/countrycode';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  userId: string;
  otpParams: any;
  askInfo: boolean;
  otpTimer: number;
  countrycodes: any;
  otpForm: FormGroup;
  userForm: FormGroup;
  showResend: boolean;
  errorMessage: string;
  enableResend: boolean;
  backIcon: IconDefinition;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.errorMessage = '';
    this.countrycodes = countrycodes;
    this.otpTimer = 20;
    this.enableResend = false;
    this.showResend = false;
    this.setForm();
    this.route.queryParams.subscribe(param => {
      if (param.verify && param.verify === 'phone') {
        this.otpParams = JSON.parse(localStorage.getItem('otpParams'));
        if (!this.otpParams) {
          this.router.navigateByUrl('account/logout');
        } else {
          this.countDownResendOtp();
          this.sendOtp();
          this.askInfo = false;
        }
      } else {
        this.askInfo = true;
      }
    });
    this.backIcon = faChevronLeft;
  }

  setForm() {
    this.otpForm = new FormGroup({
      otp: new FormControl(null, { validators: [Validators.required, Validators.pattern('^[0-9]{1,}$')] })
    });
    this.userForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      country_code: new FormControl('+91', { validators: [Validators.required] }),
      phone: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$')
        ]
      })
    });
  }

  get f() {
    return this.otpForm.controls;
  }

  get uForm() {
    return this.userForm.controls;
  }

  countDownResendOtp() {
    this.errorMessage = '';
    this.otpTimer = 20;
    this.enableResend = false;
    const interval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 1) {
        this.otpTimer = null;
        this.enableResend = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  sendOtp() {
    this.errorMessage = '';
    const data = {
      country_code: this.otpParams.country_code,
      phone: this.otpParams.phone,
      email: this.otpParams.email
    };
    this.loaderService.show();
    this.accountService.sendOtp(data).subscribe(
      result => {
        if (result.success) {
          this.userId = result.data.user_id;
          this.showResend = true;
        } else {
          console.log(result.message);
        }
        this.loaderService.hide();
      },
      error => {},
      () => {
        this.loaderService.hide();
      });
  }

  onSubmit() {
    this.uForm.email.markAllAsTouched();
    this.uForm.phone.markAsTouched();
    this.errorMessage = '';
    this.otpParams = {
      country_code: this.uForm.country_code.value,
      phone: this.uForm.phone.value,
      email: this.uForm.email.value
    };
    const data = {
      country_code: this.uForm.country_code.value,
      phone: this.uForm.phone.value,
      email: this.uForm.email.value,
      source: 'influencer',
      platform: 'otp'
    };
    if (this.userForm.invalid) {
      if (this.userForm.untouched) {
        this.errorMessage = 'Plese enter all the fields';
      }
      return;
    }
    this.loaderService.show();
    this.accountService.signup(data).subscribe(
      result => {
        if (result.success) {
          this.userId = result.data.user_id;
          this.askInfo = false;
          this.showResend = true;
          this.countDownResendOtp();
        } else {
          this.errorMessage = result.message;
        }
        this.loaderService.hide();
      },
      error => { },
      () => {
        this.loaderService.hide();
      });
  }

  resendOtp() {
    this.errorMessage = '';
    const data = {
      country_code: this.otpParams.country_code,
      phone: this.otpParams.phone,
      email: this.otpParams.email,
      source: 'influencer',
      platform: 'otp'
    };
    this.loaderService.show();
    this.accountService.signup(data).subscribe(
      result => {
        if (result.success) {
          this.countDownResendOtp();
        } else {
          this.errorMessage = result.message;
        }
        this.loaderService.hide();
      },
      error => { },
      () => {
        this.loaderService.hide();
      });
  }

  onSubmitOTP() {
    this.errorMessage = '';
    const data = {
      user_id: this.userId,
      otp: this.f.otp.value,
      source: 'influencer'
    };
    if (this.otpForm.invalid) {
      this.errorMessage = 'Plese enter all the fields';
      return;
    }
    this.loaderService.show();
    this.accountService.verifyOtp(data).subscribe(
      result => {
        if (result.success === true) {
          localStorage.removeItem('otpParams');
          this.authenticationService.login({
            token: result.data.token,
            userId: result.data.profile.user_id
          });
          if (result.data.profile.progress && result.data.profile.progress.progress === 'dashboard') {
            this.router.navigateByUrl('dashboard');
          } else {
            this.router.navigateByUrl('profileonboarding');
          }
        } else {
          this.errorMessage = result.message;
        }
        this.loaderService.hide();
      },
      error => { },
      () => {
        this.loaderService.hide();
      }
    );
  }

  loginWithEmail() {
    this.router.navigateByUrl('account/login');
  }

  goBack() {
    this.router.navigateByUrl('account/login');
  }

  goBackToLogin() {
    this.router.navigateByUrl('account/login');
  }
}
