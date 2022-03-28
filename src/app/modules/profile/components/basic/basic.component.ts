import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileServices } from '../../services/profile.services';
import { ProfileAdapter } from '../../adapters/profileadapters';
import { IconDefinition, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { LocationService } from '../../../product/services/location.service';
import { ShareService } from '@ngx-share/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { countrycodes } from '../../models/countrycode';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { EmailVerificationService } from 'projects/dashboard/src/app/common/services/email-verification.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {

  formdata: any;
  email: string;
  locations: any;
  loading: boolean;
  loader: boolean;
  successMessage: string;
  socialSelected: string;
  socialLoading: boolean;
  Errorheadermsg: string;
  successheadermsg: string;
  loadingurl: boolean;
  Errormsgslug: string;
  Errormsglink: string;
  errorMessage: string;
  suggestionConfig: any;
  successmsgslug: string;
  successmsglink: string;
  basicSubmitForm: FormGroup;
  locationMarker: IconDefinition;
  showLoader: boolean;
  countrycodes: any;
  countrydefault: any;
  countrycode: any;

  @Input() profile: any;
  @Output() slugChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('malebtn', { static: false }) malebtn: ElementRef<HTMLElement>;
  @ViewChild('otherbtn', { static: false }) otherbtn: ElementRef<HTMLElement>;
  @ViewChild('femalebtn', { static: false }) femalebtn: ElementRef<HTMLElement>;


  constructor(
    library: FaIconLibrary,
    private ls: LoaderService,
    private share: ShareService,
    private commonService: CommonService,
    public profileadapter: ProfileAdapter,
    private profileservice: ProfileServices,
    private locationService: LocationService,
    private verificationState: EmailVerificationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.countrycodes = countrycodes;
    this.clearMessages();
    this.basicSubmitForm = new FormGroup({
      slug: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z0-9_.]*$/)]),
      url: new FormControl(null),
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      email: new FormControl(null),
      dateofbirth: new FormControl(null, [Validators.required]),
      country_code: new FormControl(null),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')
      ]),
      gender: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required])
    });
    this.loadFormValues();
    this.locationMarker = faMapMarkerAlt;
    if (this.profile.social == null) {
      this.profile.social = {
        youtube: '',
        facebook: '',
        snapchat: '',
        pinterest: '',
        linkedin: '',
        twitter: '',
        instagram: ''
      };
    }
  }

  get f() {
    return this.basicSubmitForm.controls;
  }

  loadFormValues() {
    this.email = this.profile.email;
    this.profile.slug ? this.f.slug.setValue(this.profile.slug) : '';
    this.profile.url ? this.f.url.setValue(this.profile.url) : '';
    this.profile.firstname ? this.f.firstname.setValue(this.profile.firstname) : '';
    this.profile.lastname ? this.f.lastname.setValue(this.profile.lastname) : '';
    this.profile.dateofbirth
      ? this.f.dateofbirth.setValue(new Date(this.profile.dateofbirth))
      : this.f.dateofbirth.setValue(new Date('01/01/1985 05:30'));
    this.profile.country_code ? this.f.country_code.setValue(this.profile.country_code) : this.f.country_code.setValue('+91');
    this.profile.phone ? this.f.phone.setValue(this.profile.phone) : '';
    this.profile.gender ? this.f.gender.setValue(this.profile.gender) : '';
    this.profile.city ? this.f.city.setValue(this.profile.city) : '';
    this.suggestionConfig = {
      location: this.profile.city,
      disabled: false
    };
    this.profile.email ? this.f.email.setValue(this.profile.email) : '';
    if (this.profile.platform === 'otp') {
      this.f.phone.disable();
      this.f.country_code.disable();
      if (this.profile.email_verification === 1) {
        this.f.email.disable();
      }
    } else if (this.profile.platform === 'funstay') {
      this.f.email.disable();
    } else {
      if (this.profile.email_verification === 1) {
        this.f.email.disable();
      }
    }
  }

  selectGender(gender) {
    this.f.gender.setValue(gender);
    this.profile.gender = gender;
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
      this.socialLoading = true;
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
          this.socialLoading = false;
        });
    }
  }

  onBlurslug(): void {
    this.f.slug.markAsDirty();
    if (this.f.slug.invalid) {
      return;
    }
    this.Errorheadermsg = '';
    this.successheadermsg = '';
    this.successmsgslug = '';
    this.Errormsgslug = '';
    if (this.f.slug.dirty && this.f.slug.value !== this.profile.slug) {
      if (this.f.slug.value !== '') {
        this.loadingurl = true;
        const slugjson = {
          slug: this.f.slug.value
        };
        const userId = this.authenticationService.getUserId();
        this.ls.show();
        this.profileservice.editslug(userId, slugjson).subscribe(
          res => {
            if (res.success === true) {
              this.commonService.setSlug(this.f.slug.value);
              this.ls.hide();
              this.successmsgslug = 'successfully done';
              this.profile.slug = this.f.slug.value;
              localStorage.setItem('slug', this.f.slug.value);
              this.f.slug.markAsPristine();
              this.slugChange.emit(this.f.slug.value);
              this.loadingurl = false;
            } else {
              this.ls.hide();
              this.Errormsgslug = res.message;
              this.loadingurl = false;
            }
          }
        );
      } else {
        this.ls.hide();
        this.Errormsgslug = 'Invalid slug';
        this.loadingurl = false;
      }
    }
  }

  onSubmitBasic(): void {
    this.clearMessages();
    if (this.basicSubmitForm.status === 'INVALID') {
      this.markAllDirty();
      return;
    }
    this.loading = true;
    this.formdata = this.basicSubmitForm.value;
    this.formdata.about = this.profile.about;
    this.formdata.total = this.profile.total_locs;
    this.formdata.locations = this.profile.locations;
    this.formdata.headline = this.profile.headline;
    this.formdata.email = this.f.email.value;
    this.formdata.total_locs = this.profile.total_locs;
    this.formdata.email_verification = this.profile.email_verification;
    this.formdata.phone_verification = this.profile.phone_verification;
    const userId = this.authenticationService.getUserId();
    this.ls.show();
    this.profileservice.editbasicdata(userId, this.formdata).subscribe(
      res => {
        if (res.success === true) {
          if (this.profile.email !== this.f.email.value) {
            this.verificationState.notverified();
          }
          this.successMessage = 'Saved successfully';
        } else {
          this.errorMessage = res.message;
        }
        this.ls.hide();
      },
      error => { },
      () => {
        this.loading = false;
        this.ls.hide();
      }
    );
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
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  markAllDirty() {
    this.f.slug.markAsDirty();
    this.f.firstname.markAsDirty();
    this.f.lastname.markAsDirty();
    this.f.phone.markAsDirty();
    this.f.city.markAsDirty();
    this.f.gender.markAsDirty();
    this.f.dateofbirth.markAsDirty();
  }
}
