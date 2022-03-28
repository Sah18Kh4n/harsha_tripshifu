import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileServices } from '../../../profile/services/profile.services';
import { ProfileAdapter } from '../../../profile/adapters/profileadapters';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../product/services/location.service';
import { IconDefinition, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';
import { VerificationComponent } from '../verification/verification.component';

@Component({
  selector: 'app-profileonbordingbody',
  templateUrl: './profileonbordingbody.component.html',
  styleUrls: ['./profileonbordingbody.component.css']
})
export class ProfileonbordingbodyComponent implements OnInit {

  verificationStatus = {
    email: false,
    phone: false
  }
  disabledvalue: boolean;
  loadinginsta: boolean;
  basicSubmitForm: FormGroup;
  errorMessage: string;
  email: string;
  loading: boolean;
  successMessage: string;
  socialSelected: string;
  Errorheadermsg: string;
  successheadermsg: string;
  loadingurl: boolean;
  slug: any;
  url: any;
  socialLoading: boolean;
  Errormsgslug: string;
  successmsgslug: string;
  Errormsglink: string;
  successmsglink: string;
  descMaxCharCount: number;
  descCharCount: number;
  locations: any;
  suggestionConfig: any;
  locationMarker: IconDefinition;
  showLoader: boolean;

  @Input() profile: any;
  @Output() outputProfileevent = new EventEmitter();
  @ViewChild('verificationModal', { static: false }) verificationModal: VerificationComponent;

  constructor(
    private router: Router,
    public ls: LoaderService,
    private commonService: CommonService,
    public profileadapter: ProfileAdapter,
    private profileservice: ProfileServices,
    private locationService: LocationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.clearMessages();
    this.initForm();
  }

  initForm() {
    this.descMaxCharCount = this.descCharCount = 500;
    if (this.profile.dateofbirth) {
      this.profile.dateofbirth = new Date(this.profile.dateofbirth);
    } else {
      this.profile.dateofbirth = new Date('01/01/1985 05:30');
    }
    this.basicSubmitForm = new FormGroup({
      firstname: new FormControl(this.profile.firstname, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      lastname: new FormControl(this.profile.lastname, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      slug: new FormControl(this.profile.slug, [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9_.]*$/)
      ]),
      email: new FormControl(this.profile.email, {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      country_code: new FormControl(this.profile.country_code ? this.profile.country_code : '+91'),
      phone: new FormControl(this.profile.phone,
        {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*$')
          ]
        }
      ),
      url: new FormControl(null),
      dateofbirth: new FormControl(this.profile.dateofbirth),
      gender: new FormControl(this.profile.gender),
      city: new FormControl(this.profile.city),
      about: new FormControl(this.profile.about, [
        Validators.maxLength(this.descMaxCharCount)
      ]),
    });
    if (this.profile.about && this.profile.about.length > 0) {
      this.descCharCount = this.descCharCount - this.profile.about.length;
    }
    this.locationMarker = faMapMarkerAlt;
    this.suggestionConfig = {
      location: this.profile.city,
      disabled: false
    };
    this.checkVerificationStatus();
  }

  get f() {
    return this.basicSubmitForm.controls;
  }

  checkVerificationStatus() {
    if (this.profile.email_verification === 1) {
      this.verificationStatus.email = true;
      this.f.email.disable();
    }
    if (this.profile.phone_verification === 1) {
      this.verificationStatus.phone = true;
      this.f.phone.disable();
    }
  }

  verifyEmail() {
    if (this.f.email.valid) {
      this.verificationModal.initEmailVerification(this.f.email.value);
    } else {
      this.f.email.markAsDirty();
    }
  }

  verifyPhone() {
    this.f.phone.markAsDirty();
    if (this.f.phone.valid) {
      this.verificationModal.initPhoneVerification({
        user_id: this.profile.user_id,
        country_code: this.f.country_code.value,
        phone: this.f.phone.value
      });
    }
  }

  updateDescCharCount() {
    this.descCharCount = this.descMaxCharCount - this.f.about.value.length;
  }

  updateSlug(): void {
    if (this.f.slug.valid && this.f.slug.dirty && this.f.slug.value !== this.profile.slug) {
      this.Errorheadermsg = '';
      this.successheadermsg = '';
      this.loadingurl = true;
      this.successmsgslug = '';
      this.Errormsgslug = '';
      const slugJson = {
        slug: this.f.slug.value
      };
      const userId = this.authenticationService.getUserId();
      this.ls.show();
      this.profileservice.editslug(userId, slugJson)
        .subscribe(
          res => {
            this.commonService.setSlug(this.f.slug.value);
            this.ls.hide();
            if (res.success === true) {
              this.profile.slug = this.f.slug.value;
              localStorage.setItem('slug', this.f.slug.value);
              this.successmsgslug = 'successfully done';
            } else {
              this.Errormsgslug = res.message;
            }
          },
          error => {
          },
          () => {
            this.loadingurl = false;
          });
    }
  }

  selectGender(gender) {
    this.f.gender.setValue(gender);
    this.profile.gender = gender;
    this.saveUserData();
  }

  onSocialClick(platform) {
    this.socialSelected = platform;
    switch (platform) {
      case 'facebook':
        if (this.profile.social.facebook) {
          this.f.url.setValue(this.profile.social.facebook);
        } else {
          this.f.url.setValue('https://facebook.com/');
        }
        break;
      case 'twitter':
        if (this.profile.social.twitter) {
          this.f.url.setValue(this.profile.social.twitter);
        } else {
          this.f.url.setValue('https://twitter.com/');
        }
        break;
      case 'linkedin':
        if (this.profile.social.linkedin) {
          this.f.url.setValue(this.profile.social.linkedin);
        } else {
          this.f.url.setValue('https://linkedin.com/');
        }
        break;
      case 'snapchat':
        if (this.profile.social.snapchat) {
          this.f.url.setValue(this.profile.social.snapchat);
        } else {
          this.f.url.setValue('https://snapchat.com/');
        }
        break;
      case 'pinterest':
        if (this.profile.social.pinterest) {
          this.f.url.setValue(this.profile.social.pinterest);
        } else {
          this.f.url.setValue('https://pinterest.com/');
        }
        break;
      case 'youtube':
        if (this.profile.social.youtube) {
          this.f.url.setValue(this.profile.social.youtube);
        } else {
          this.f.url.setValue('https://youtube.com/');
        }
        break;
    }
  }

  saveSocialLink(platform) {
    this.clearMessages();
    if (this.f.url.dirty) {
      this.loading = true;
      const data = {
        platform: `${platform}`,
        url: this.f.url.value
      };
      const userId = this.authenticationService.getUserId();
      this.profileservice.saveSocialLink(userId, data).subscribe(
        res => {
          if (res.success === true) {
            this.successMessage = 'Saved successfully';
            switch (platform) {
              case 'facebook':
                this.profile.social.facebook = this.f.url.value;
                break;
              case 'twitter':
                this.profile.social.twitter = this.f.url.value;
                break;
              case 'linkedin':
                this.profile.social.linkedin = this.f.url.value;
                break;
              case 'snapchat':
                this.profile.social.snapchat = this.f.url.value;
                break;
              case 'pinterest':
                this.profile.social.pinterest = this.f.url.value;
                break;
              case 'youtube':
                this.profile.social.youtube = this.f.url.value;
                break;
            }
          } else {
            this.errorMessage = res.message;
          }
        },
        error => {
        },
        () => {
          this.loading = false;
        });
    }
  }

  onSubmitBasic(): void {
    // this.ls.show();
    this.clearMessages();
    if (this.basicSubmitForm.invalid) {
      this.f.about.markAsDirty();
      this.f.gender.markAsDirty();
      this.f.dateofbirth.markAsDirty();
      this.f.city.markAsDirty();
      this.f.slug.markAsDirty();
      this.f.email.markAsDirty();
      this.f.phone.markAsDirty();
      // this.errorMessage = 'Fill all the mandatory fields';
      return;
    } else if(this.verificationStatus.email === false || this.verificationStatus.phone === false) {
      this.errorMessage = 'Email and Phone number has to be verified';
    } else {
      this.loading = true;
      const data = this.basicSubmitForm.value;
      data.phone = this.profile.phone;
      data.email = this.profile.email;
      data.email_verification = this.profile.email_verification;
      data.phone_verification = this.profile.phone_verification;
      const userId = this.authenticationService.getUserId();
      this.ls.show();
      this.profileservice.editbasicdata(userId, data)
        .subscribe(
          res => {
            this.ls.hide();
            if (res.success === true) {
              this.successMessage = 'Saved successfully';
              this.router.navigateByUrl('/product/listings/onboard');
            } else {
              this.errorMessage = res.message;
            }
          },
          error => {
          },
          () => {
            this.loading = false;
          });
    }
  }

  search($event) {
    this.f.city.reset();
    if ($event.keyword !== '') {
      this.locationService
        .search($event.keyword)
        .subscribe(result => {
          if (result.success === true) {
            const locationResult = result.data.locations;
            this.locations = locationResult.map(location => {
              if (location.city_id) {
                return {
                  key: location.city_id,
                  value: location.location,
                  type: 'city'
                };
              } else if (location.state_id) {
                return {
                  key: location.state_id,
                  value: location.location,
                  type: 'state'
                };
              } else {
                return {
                  key: location.country_id,
                  value: location.location,
                  type: 'country'
                };
              }
            });
          }
        });
    }
  }

  locationSelected($event) {
    this.f.city.reset($event.selected.value);
    this.saveUserData();
  }

  updateFirstname(){
    this.saveUserData();
  }

  updateLastname(){
    this.saveUserData();
  }

  updateAbout(){
    this.saveUserData();
  }

  updateDateofbirth(){
    this.saveUserData();
  }

  saveUserData(){
    this.clearMessages();
    if(this.f.firstname.value || this.f.lastname.value || this.f.city.value || this.f.gender.value || this.f.about.value || this.f.dateofbirth.value){
      const data = this.basicSubmitForm.value;
      data.phone = this.profile.phone;
      data.email = this.profile.email;
      data.email_verification = this.profile.email_verification;
      data.phone_verification = this.profile.phone_verification;
      const userId = this.authenticationService.getUserId();
      this.ls.show();
      this.profileservice.editbasicdata(userId, data)
        .subscribe(
          res => {
            this.ls.hide();
            if (res.success === true) {
              this.successMessage = 'Saved successfully';
            } else {
              this.errorMessage = res.message;
            }
          },
          error => {
          },
          () => {
            this.loading = false;
          });
    }
    return;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onVerified(entity?) {
    this.verificationStatus.phone = true;
    this.f.phone.disable();
  }
}
