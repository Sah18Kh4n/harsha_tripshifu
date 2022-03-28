import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { countrycodes } from '../../../profile/models/countrycode';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { environment } from 'projects/dashboard/src/environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  userId: string;
  loading: boolean;
  storeBase: string;
  countrycodes: any;
  submitted: boolean;
  successmsg: string;
  errorMessage: string;
  signupForm: FormGroup;
  newPasswordClass: string;
  backIcon: IconDefinition;
  confirmPasswordClass: string;
  showOtp: any;

  @ViewChild('newPassword', { static: false }) newPassword: ElementRef;
  @ViewChild('confirmPassword', { static: false }) confirmPassword: ElementRef;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.showOtp = false;
    this.storeBase = environment.storefrontBase;
    this.countrycodes = countrycodes;
    this.signupForm = new FormGroup({
      firstname: new FormControl(null, { validators: [Validators.required, Validators.pattern('^[A-Za-z\\s\\.]{1,}$')] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')
      ]),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*()]).{7,30}$/)
        ]
      }),
      country_code: new FormControl('+91'),
      confirmpassword: new FormControl(null, { validators: [Validators.required] })
    });
    this.newPasswordClass = this.confirmPasswordClass = 'fa-eye';
    this.backIcon = faChevronLeft;
  }

  onSubmitSignup() {
    this.submitted = true;
    this.clearMessages();
    this.f.firstname.markAsTouched();
    this.f.email.markAsTouched();
    this.f.password.markAsTouched();
    this.f.confirmpassword.markAsTouched();
    if (this.f.password.value !== this.f.confirmpassword.value) {
      return;
    }
    this.handleServerErrors();
    if (this.signupForm.invalid) {
      return;
    }
    const name = this.f.firstname.value.split(' ');
    const firstname = name[0];
    name.splice(0, 1);
    const lastname = name.join(' ');
    const data = {
      firstname,
      lastname,
      email: this.f.email.value,
      country_code: this.f.country_code.value,
      phone: this.f.phone.value,
      password: this.f.password.value,
      confirmpassword: this.f.password.value,
      platform: 'funstay',
      source: 'influencer'
    };
    this.loading = true;
    this.loaderService.show();
    this.accountService.signup(data)
      .subscribe(
        res => {
          if (res.success === true) {
            // this.authenticationService.saveToken(res.data.token);
            this.userId = res.data.user_id;
            this.successmsg = 'Registered successfully';
            localStorage.setItem('isOnboarded', 'false');
            const otpParams = {
              userId: res.data.user_id,
              email: this.f.email.value,
              country_code: this.f.country_code.value,
              phone: this.f.phone.value
            };
            localStorage.setItem('otpParams', JSON.stringify(otpParams));
            this.router.navigateByUrl('account/otp?verify=phone');
          } else {
            if (res.message === 'Email already existing') {
              this.f.email.setErrors({ duplicate: true });
            } else if (res.message === 'Phone already existing') {
              this.f.phone.setErrors({ duplicate: true });
            } else {
              this.errorMessage = res.message;
            }
          }
          this.loading = false;
          this.loaderService.hide();
        },
        error => { },
        () => {
          this.loaderService.hide();
          this.loading = false;
        }
      );
  }

  handleServerErrors() {
    const emailErrors = this.f.email.errors;
    if (emailErrors && emailErrors.length && emailErrors.duplicate) {
      delete emailErrors.duplicate;
      this.f.email.setErrors(emailErrors);
    }

    const phoneErrors = this.f.phone.errors;
    if (phoneErrors && phoneErrors.length && phoneErrors.duplicate) {
      delete phoneErrors.duplicate;
      this.f.phone.setErrors(phoneErrors);
    }
    return true;
  }

  toggleNewPassword() {
    if (this.newPassword.nativeElement.type === 'password') {
      this.newPassword.nativeElement.type = 'text';
      this.newPasswordClass = 'fa-eye-slash';
    } else {
      this.newPassword.nativeElement.type = 'password';
      this.newPasswordClass = 'fa-eye';
    }
  }

  toggleConfirmPassword() {
    if (this.confirmPassword.nativeElement.type === 'password') {
      this.confirmPassword.nativeElement.type = 'text';
      this.confirmPasswordClass = 'fa-eye-slash';
    } else {
      this.confirmPassword.nativeElement.type = 'password';
      this.confirmPasswordClass = 'fa-eye';
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successmsg = '';
  }

  toggleGetOtp() {
    this.router.navigateByUrl('account/otp#otpForm');
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      user => {
        this.socialLogin(user);
      }
    );
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      user => {
        this.socialLogin(user);
      }
    );
  }

  socialLogin(user) {
    this.loaderService.show();
    const params = {
      social_id: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      avatar: user.photoUrl,
      source: 'influencer',
      platform: user.provider === 'GOOGLE' ? 'google' : 'facebook'
    };
    this.accountService.signup(params).subscribe(
      result => {
        if (result.success === true) {
          if (result.data.progress == null
            || (result.data.progress
              && result.data.progress === 'onboard')) {
            this.authenticationService.login({
              token: result.data.token,
              userId: result.data.user_id
            });
            localStorage.setItem('isOnboarded', 'false');
            this.clearMessages();
            this.successmsg = 'Logged in successfully';
            this.loading = false;
            this.router.navigateByUrl('profileonboarding');
          } else {
            this.loading = false;
            this.authenticationService.login({
              token: result.data.token,
              userId: result.data.user_id
            });
            this.clearMessages();
            this.successmsg = 'Logged in successfully';
            this.router.navigateByUrl('dashboard');
          }
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
}
