import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  @ViewChild('modalLauncher', { static: false }) modalLauncher: ElementRef;
  @ViewChild('closeModalEl', { static: false }) closeModalEl: ElementRef;
  signupForm: FormGroup;
  errorMessage: string;
  successmsg: string;
  loading: boolean;



  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] })
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmitSignup() {
    this.clearMessages();
    this.f.email.markAsTouched();
    const data = {
      email: this.f.email.value,
      source: 'influencer'
    };
    this.loading = true;
    this.accountService.forgetPassword(data)
      .subscribe(
        res => {
          if (res.success === true) {
            this.successmsg = 'Recovery link has been sent to your email';
          } else {

            this.errorMessage = res.message;

          }
        },
        error => { },
        () => {
          this.loading = false;
        });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successmsg = '';
  }
  openModal() {
    this.modalLauncher.nativeElement.click();
  }

  closeModal() {
    this.closeModalEl.nativeElement.click();
    this.f.email.reset();
  }
}
