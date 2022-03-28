import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileServices } from '../../services/profile.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuggestionComponent } from 'projects/dashboard/src/app/common/shared/suggest/components/suggestion/suggestion.component';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {

  interests: any;
  loading: boolean;
  loader: boolean;
  searchResults: any;
  errorMessage: string;
  suggestionConfig: any;
  selectedInterest: any;
  successMessage: string;
  interestForm: FormGroup;
  showloader: boolean;

  @ViewChild('suggest', { static: false }) suggest: SuggestionComponent;

  constructor(
    public ls: LoaderService,
    private profileservice: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.searchResults = [];
    this.getUserInterests();
    this.interestForm = new FormGroup({
      interest: new FormControl(null, { validators: [Validators.required] })
    });
  }

  getUserInterests() {
    this.clearMessages();
    const userId = this.authenticationService.getUserId();
    this.profileservice.getUserInterests(userId).subscribe(res => {
      if (res.success === true) {
        this.interests = res.data.interests.map(interest => {
          return {
            key: interest.influencerinterest_id,
            value: interest.interest
          };
        });
      }
    });
  }

  searchInterest(input) {
    this.f.interest.reset();
    this.clearMessages();
    if (input.keyword) {
      this.profileservice.searchInterest(input.keyword).subscribe(res => {
        if (res.success === true) {
          this.searchResults = res.data.interests.map(interest => {
            return {
              key: interest.interest_id,
              value: interest.interest
            };
          });
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  get f() {
    return this.interestForm.controls;
  }

  onSubmitinterest() {
    this.ls.show();
    this.clearMessages();
    if (this.interestForm.status === 'INVALID') {
      this.ls.hide();
      this.f.interest.markAsDirty();
      return;
    }
    const interest = {
      interest_id: this.selectedInterest.key
    };
    this.loading = true;
    const userId = this.authenticationService.getUserId();
    this.profileservice.addInterest(userId, interest).subscribe(res => {
      this.ls.hide();
      if (res.success === true) {
        this.successMessage = 'Saved successfully';
        this.interests.push({
          key: res.data.influencerinterest_id,
          value: this.selectedInterest.value
        });
        this.selectedInterest = '';
      } else {
        this.errorMessage = res.message;
      }
    },
      error => { },
      () => {
        this.suggest.clearInput();
        this.loading = false;
      });
  }

  interestSelected(interest) {
    this.selectedInterest = interest.selected;
    this.f.interest.setValue(interest.selected);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteInterest(interestId) {
    this.ls.show();
    const data = {
      influencerinterest_id: interestId
    };
    const userId = this.authenticationService.getUserId();
    this.clearMessages();
    this.loading = true;
    this.profileservice.deleteInterest(userId, data).subscribe(res => {
      this.ls.hide();
      if (res.success === true) {
        this.successMessage = 'Deleted successfully';
        this.interests = this.interests.filter(interest => {
          if (interest.key !== interestId) {
            return interest;
          }
        });
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
