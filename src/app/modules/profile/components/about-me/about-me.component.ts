import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileServices } from '../../services/profile.services';
import { ProfileAdapter } from '../../adapters/profileadapters';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {

  descCharCount: number;
  descMaxCharCount: number;
  aboutForm: FormGroup;
  formdata: any;
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  showloader: boolean;

  @Input() profile: any;
  @Output() outputProfileevent = new EventEmitter();

  constructor(
    public ls: LoaderService,
    public profileadapter: ProfileAdapter,
    private profileservice: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.descMaxCharCount = this.descCharCount = 200;
    this.aboutForm = new FormGroup({
      about: new FormControl(this.profile.about, [Validators.required, Validators.maxLength(this.descMaxCharCount)]),
    });
    if (this.profile.about && this.profile.about.length > 0) {
      this.descCharCount = this.descCharCount - this.profile.about.length;
    }
  }

  get f() {
    return this.aboutForm.controls;
  }

  onSubmitAbout(): void {
    this.clearMessages();
    if (this.aboutForm.valid) {
      this.ls.show();
      this.loading = true;
      this.profile.about = this.aboutForm.get('about').value;
      this.formdata = this.profile;
      const userId = this.authenticationService.getUserId();
      this.profileservice.editbasicdata(userId, this.formdata).subscribe(
        res => {
          this.ls.hide();
          if (res.success === true) {
            this.successMessage = 'Saved successfully';
          } else {
            this.errorMessage = res.message;
          }
        },
        error => {},
        () => {
          this.loading = false;
        });
    } else {
      this.f.about.markAsDirty();
    }
  }

  updateDescCharCount() {
    this.descCharCount = this.descMaxCharCount - this.f.about.value.length;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}

