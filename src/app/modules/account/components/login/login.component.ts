import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'projects/dashboard/src/environments/environment';
import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showOtp: any;
  isReady: boolean;
  activeClass: string;
  loginForm: FormGroup;
  errorMessage: string;
  successmsg: string;
  loginloading: boolean;
  userprofile: any;
  newPasswordClass: string;
  appVersion: string;
  submitted: boolean;

  @Input() storeContent: any;
  @ViewChild('newPassword', { static: false }) newPassword: ElementRef;
  @ViewChild('forgotPasswordModal', { static: false }) forgotPasswordModal: ForgetpasswordComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {
    this.appVersion = environment.version;
  }

  ngOnInit() {
    this.showOtp = false;
    this.isReady = true;
    this.loginForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.url.subscribe(segment => {
      if (segment[0] && segment[0].path === 'login') {
        this.activeClass = 'active-link';
      } else {
        this.activeClass = '';
      }
    });
    this.newPasswordClass = 'fa-eye';
  }

  get f() {
    return this.loginForm.controls;
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

  onSubmitLogin(): void {
    this.submitted = true;
    this.f.email.markAsTouched();
    this.f.password.markAsTouched();
    if (this.loginForm.status === 'INVALID') {
      this.clearMessages();
      return;
    }
    this.clearMessages();
    this.loginloading = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    const loginjson = {
      email: `${email}`,
      password: `${password}`,
      source: 'influencer',
      platform: 'funstay'
    };
    if (this.loginForm.get('email').value != null && this.loginForm.get('password').value != null) {
      this.loaderService.show();
      this.accountService.login(loginjson).subscribe(res => {
        if (res.success === true) {
          if (res.data.profile.progress == null
            || (res.data.profile.progress
              && res.data.profile.progress.progress === 'otp')) {
            const otpParams = {
              userId: res.data.profile.user_id,
              email: res.data.profile.email,
              country_code: res.data.profile.country_code,
              phone: res.data.profile.phone
            };
            this.clearMessages();
            this.successmsg = 'Logged in successfully';
            this.loginloading = false;
            localStorage.setItem('otpParams', JSON.stringify(otpParams));
            this.router.navigateByUrl('account/otp?verify=phone');
          } else if (res.data.profile.progress
            && res.data.profile.progress.progress === 'onboard') {
            this.authenticationService.login({
              token: res.data.token,
              userId: res.data.profile.user_id
            });
            localStorage.setItem('email_verification', res.data.profile.email_verification);
            this.clearMessages();
            this.successmsg = 'Logged in successfully';
            this.loginloading = false;
            this.router.navigateByUrl('profileonboarding');
          } else {
            this.authenticationService.saveToken(res.data.token);
            this.loginloading = false;
            this.userprofile = res.data.profile;
            this.authenticationService.login({
              token: res.data.token,
              userId: res.data.profile.user_id
            });
            localStorage.setItem('email_verification', res.data.profile.email_verification);
            this.router.navigateByUrl('dashboard');
            this.clearMessages();
            this.successmsg = 'Logged in successfully';
            this.loginloading = false;
          }
        } else {
          this.loginloading = false;
          this.clearMessages();
          this.errorMessage = res.message;
          this.loginloading = false;
        }
        this.loaderService.hide();
      },
        error => { },
        () => {
          this.loaderService.hide();
        });
    } else {
      this.clearMessages();
      this.errorMessage = 'All fields are mandatory';
      this.loginloading = false;
    }
  }

  openModal() {
    this.forgotPasswordModal.openModal();
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

  clearMessages() {
    this.errorMessage = '';
    this.successmsg = '';
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
            this.loginloading = false;
            this.router.navigateByUrl('profileonboarding');
          } else {
            this.loginloading = false;
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
