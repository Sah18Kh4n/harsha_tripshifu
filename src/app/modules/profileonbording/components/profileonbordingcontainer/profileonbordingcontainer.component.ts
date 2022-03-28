import { Component, OnInit } from '@angular/core';
import { ProfileServices } from '../../../profile/services/profile.services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';

@Component({
  selector: 'app-profileonbordingcontainer',
  templateUrl: './profileonbordingcontainer.component.html',
  styleUrls: ['./profileonbordingcontainer.component.css']
})
export class ProfileonbordingcontainerComponent implements OnInit {

  name: string;
  profile: any;
  showLoader: boolean;
  subscription: Subscription;

  constructor(
    private router: Router,
    public ls: LoaderService,
    private commonService: CommonService,
    private profileService: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const userId = this.authenticationService.getUserId();
    if (userId == null) {
      this.router.navigateByUrl('/account/logout');
    } else {
      this.ls.show();
      this.profileService.getprofile(userId).subscribe(result => {
        this.ls.hide();
        if (result.success === true) {
          this.profile = result.data.profile;
          this.name = this.profile.firstname;
          this.commonService.setSlug(this.profile.slug);
        } else {
          this.router.navigateByUrl('account/logout');
        }
      });
    }
  }
}
