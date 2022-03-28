import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfileServices } from '../../services/profile.services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from 'projects/dashboard/src/environments/environment';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css']
})
export class ProfileContainerComponent implements OnInit {

  slug: string;
  profile: any;
  loading: boolean;
  @Input() issidebar: any;
  @Output() slugChange: EventEmitter<string> = new EventEmitter();
  showLoader: boolean;
  subscription: Subscription;

  constructor(
    public ls: LoaderService,
    private route: ActivatedRoute,
    private location: Location,
    private commonService: CommonService,
    private profileService: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.ls.show();
    const userId = this.authenticationService.getUserId();
    this.loading = true;
    this.profileService.getprofile(userId).subscribe(res => {
        this.ls.hide();
        if (res.success === true) {
          this.loading = false;
          this.profile = res.data.profile;
          this.commonService.setSlug(this.profile.slug);
          localStorage.setItem('email_verification', res.data.profile.email_verification);
          this.instaAuth();
        }
      });
  }

  instaAuth() {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.authenticate(params.code);
      }
    });
  }

  authenticate(authCode) {
    const userId = this.authenticationService.getUserId();
    const data = {
      auth_code: authCode,
      redirect: environment.baseUrl + 'profile'
    };
    this.profileService
        .instagramAccessTokenRequest(userId, data)
        .subscribe(res => {
          this.profile.social = {
            instagram: true
          };
          this.location.replaceState('/profile');
        });
  }

  onSlugChange(slug: string) {
    this.slugChange.emit(slug);
    this.slug = slug;
  }
}
