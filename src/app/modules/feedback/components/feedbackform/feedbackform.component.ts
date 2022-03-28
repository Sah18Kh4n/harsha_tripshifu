import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FeedbackserviceService } from '../../service/feedbackservice.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-feedbackform',
  templateUrl: './feedbackform.component.html',
  styleUrls: ['./feedbackform.component.css']
})
export class FeedbackformComponent implements OnInit {

  feedbackForm: FormGroup;
  formdata: any;
  Errormsg: string;
  successmsg: string;
  loading: boolean;
  showLoader: boolean;
  subscription: Subscription;
  submitted: boolean;
  categories: any;

  constructor(
    public loaderService: LoaderService,
    private authenticationService: AuthenticationService,
    private feedbackService: FeedbackserviceService
  ) { }

  ngOnInit() {
    this.Errormsg = '';
    this.successmsg = '';
    
    this.feedbackForm = new FormGroup({
      category: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      destination: new FormControl(null, {
        validators: [
          Validators.maxLength(200)
        ]
      }),
      message: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(700)
        ]
      }),
    });

    this.feedbackService.getCategories().subscribe(categories => {
      this.categories = categories.data;
    });
  }

  get f() {
    return this.feedbackForm.controls;
  }

  onSubmitFeedback(): void {
    this.clearMessage();
    this.submitted = true;
    this.f.category.markAsTouched();
    if(this.feedbackForm.value.category && this.feedbackForm.value.category == 3){
      this.f.destination.markAsTouched();
    }
    this.f.message.markAsTouched();
    if (this.feedbackForm.status === 'INVALID') {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.loaderService.show();
    this.formdata = this.feedbackForm.value;
    const userId = this.authenticationService.getUserId();
    this.feedbackService.submitfeedback(userId, this.formdata).subscribe(
      res => {
        this.loaderService.hide();
        if (res.success === true) {
          this.feedbackForm.reset();
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

  clearMessage() {
    this.Errormsg = '';
    this.successmsg = '';
  }

}
