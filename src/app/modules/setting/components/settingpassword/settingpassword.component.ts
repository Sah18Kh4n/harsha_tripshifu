import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingserviceService } from '../../service/settingservice.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';

@Component({
  selector: 'app-settingpassword',
  templateUrl: './settingpassword.component.html',
  styleUrls: ['./settingpassword.component.css']
})
export class SettingpasswordComponent implements OnInit {

  isPasswordSet: boolean;
  passwordForm: FormGroup;
  formdata: any;
  Errormsg: string;
  successmsg: string;
  loading: boolean;
  currentPasswordClass: string;
  newPasswordClass: string;
  confirmPasswordClass: string;
  showLoader: boolean;
  subscription: Subscription;
  submitted: boolean;
  @Input() profilecontainer: any;
  @ViewChild('currentPassword', { static: false }) currentPassword: ElementRef;
  @ViewChild('newPassword', { static: true }) newPassword: ElementRef;
  @ViewChild('confirmPassword', { static: true }) confirmPassword: ElementRef;

  constructor(
    public loaderService: LoaderService,
    private settingservice: SettingserviceService,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {

    this.commonService.getPasswordCheck().subscribe(passwordCheck => {
      this.isPasswordSet = passwordCheck === 1 ? true : false;
    });

    this.Errormsg = '';
    this.successmsg = '';
    
    if( this.isPasswordSet ){
      this.passwordForm = new FormGroup({
        old_password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{7,30}$/)
          ]
        }),
        password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*()]).{7,30}$/)
          ]
        }),
        confirmpassword: new FormControl(null, { validators: [Validators.required] })
      });
    } else {
      this.passwordForm = new FormGroup({
        password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*()]).{7,30}$/)
          ]
        }),
        confirmpassword: new FormControl(null, { validators: [Validators.required] })
      });
    }

    this.currentPasswordClass = this.newPasswordClass = this.confirmPasswordClass = 'fa-eye';
  }

  get f() {
    return this.passwordForm.controls;
  }

  onSubmitPassword(): void {
    this.clearMessage();
    this.submitted = true;
    if( this.isPasswordSet ){
      this.f.old_password.markAsTouched();
    }
    this.f.password.markAsTouched();
    this.f.confirmpassword.markAsTouched();
    if (this.passwordForm.status === 'INVALID') {
      this.loading = false;
      return;
    }
    if (this.f.confirmpassword.value !== this.f.password.value) {
      return;
    }
    this.loading = true;
    this.loaderService.show();
    this.formdata = this.passwordForm.value;
    const userId = this.authenticationService.getUserId();
    this.settingservice.changepassword(userId, this.formdata).subscribe(
      res => {
        this.loaderService.hide();
        if (res.success === true) {
          this.Errormsg = '';
          this.successmsg = 'Successfully done';
          this.loading = false;
        } else {
          this.successmsg = '';
          this.Errormsg = res.message;
          this.loading = false;
        }
      },
      error => { },
      () => {
        this.loading = false;
        this.loaderService.hide();
      }
    );
  }

  toggleCurrentPassword() {
    if (this.currentPassword.nativeElement.type === 'password') {
      this.currentPassword.nativeElement.type = 'text';
      this.currentPasswordClass = 'fa-eye-slash';
    } else {
      this.currentPassword.nativeElement.type = 'password';
      this.currentPasswordClass = 'fa-eye';
    }
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

  clearMessage() {
    this.Errormsg = '';
    this.successmsg = '';
  }
}
