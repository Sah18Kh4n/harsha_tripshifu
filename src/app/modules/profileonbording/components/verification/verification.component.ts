import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AccountService } from '../../../account/services/account.service';
import { ProfileServices } from '../../../profile/services/profile.services';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  phoneOb = {
    user_id: 0,
    country_code: 0,
    phone: 0
  }
  email: string;
  userId: number;
  otpTimer: number;
  errorMsg: string;
  successMsg: string;
  otpForm: FormGroup;
  enableResend: boolean;
  emailVerification: boolean;
  phoneVerification: boolean;

  @ViewChild('openBtn', { static: false }) openBtn: ElementRef;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  @Output('verified') verified: EventEmitter<string> = new EventEmitter();

  constructor(
    private loaderService: LoaderService,
    private accountService: AccountService,
    private profileService: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.clearMessages();
    this.otpTimer = 20;
    this.otpForm = new FormGroup({
      otp: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(4)
        ]
      })
    });
  }

  get f() {
    return this.otpForm.controls;
  }

  initEmailVerification(email: string) {
    this.email = email;
    this.sendVerification(() => this.openModal());
    this.emailVerification = true;
    this.phoneVerification = false;
  }

  initPhoneVerification(phone) {
    // send otp
    this.phoneOb = phone;
    this.sendOtp(() => this.openModal());
    this.phoneVerification = true;
    this.emailVerification = false;
  }

  openModal() {
    this.openBtn.nativeElement.click();
  }

  closeModal() {
    if (this.closeBtn) {
      this.closeBtn.nativeElement.click();
    }
  }

  submitOtp() {
    this.clearMessages();
    const data = {
      user_id: this.userId,
      otp: this.f.otp.value,
      source: 'influencer'
    };
    if (this.otpForm.invalid) {
      this.errorMsg = 'Plese enter all the fields';
      return;
    }
    this.loaderService.show();
    this.accountService.verifyOtp(data).subscribe(
      result => {
        if (result.success === true) {
          this.successMsg = 'Successfully verified';
          this.verified.emit('phone');
          setTimeout(() => this.closeModal(), 2000);
        } else {
          this.errorMsg = result.message;
        }
        this.loaderService.hide();
      },
      error => {
        this.errorMsg = 'Error occured, please try later.';
      },
      () => {
        this.loaderService.hide();
      }
    );
  }

  resendVerificationEmail() {
    this.sendVerification();
  }

  sendVerification(callback?) {
    this.loaderService.show();
    this.profileService
      .resendVerificationEmail(this.authenticationService.getUserId(), this.email)
      .subscribe(
        result => {
          if (result.success === true) {
            this.successMsg = 'Mail sent successfully';
          } else {
            console.log(result.message);
            this.errorMsg = 'Failed to send the mail';
          }
        },
        error => {
          console.log(error);
          this.errorMsg = 'Failed to send the mail';
        },
        () => {
          if (callback) {
            this.clearMessages();
            callback();
          }
          this.loaderService.hide();
        });
  }

  resendOtp() {
    this.sendOtp();
  }

  countDownResendOtp() {
    this.clearMessages();
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

  sendOtp(callback?) {
    this.loaderService.show();
    this.accountService
      .updatePhone(this.phoneOb)
      .subscribe(
        result => {
          if (result.success === true) {
            this.userId = this.phoneOb.user_id;
            this.successMsg = 'OTP sent successfully';
          } else {
            console.log(result.message);
            this.errorMsg = 'Failed to send the OTP';
          }
        },
        error => {
          console.log(error);
          this.errorMsg = 'Failed to send the OTP';
        },
        () => {
          if (callback) {
            this.clearMessages();
            callback();
          }
          this.countDownResendOtp();
          this.loaderService.hide();
        });
  }

  clearMessages() {
    this.successMsg = '';
    this.errorMsg = '';
  }
}
