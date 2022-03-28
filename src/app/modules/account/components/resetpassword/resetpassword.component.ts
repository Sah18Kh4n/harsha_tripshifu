import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  newPasswordClass: string;
  confirmPasswordClass: string;
  resetForm: FormGroup;

  @ViewChild('newPassword', { static: false }) newPassword: ElementRef;
  @ViewChild('confirmPassword', { static: false }) confirmPassword: ElementRef;
  loading: boolean;
  success: boolean;
  errorMessage: any;
  token: string;

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      password: new FormControl(null, { validators: [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[!@#$%^&*()]).{7,30}$/)] }),
      confirmpassword: new FormControl(null, { validators: [Validators.required] })
    });
 
    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }

  get f() {
    return this.resetForm.controls;
  }


  onSubmitReset() {
    this.f.password.markAsTouched();
    this.f.confirmpassword.markAsTouched();
    if (this.f.password.value !== this.f.confirmpassword.value) {
      return;
    }
    if(this.resetForm.invalid){
      return;
    }
    const data = {
      token: this.token,
      password: this.f.password.value
    };
    this.loading = true;
    this.accountService.resetPassword(data)
      .subscribe(
        res => {
          if (res.success === true) {
            this.success = true;
            setTimeout(() => {
              this.router.navigateByUrl(`login`);
            }, 3000);
          } else {
            this.errorMessage = res.message;
          }
        },
        error => { },
        () => {
          this.loading = false;
        });
  }
}
