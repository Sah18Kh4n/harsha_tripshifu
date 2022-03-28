import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileServices } from '../../services/profile.services';
import { CropComponent } from '../../../../common/modules/image-cropper/components/crop/crop.component';
import { ShareService } from '@ngx-share/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'projects/dashboard/src/environments/environment';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit, OnChanges {

  result: string;
  isbanner: boolean;
  scale: number;
  fileToUpload: File;
  fileToUploadcover: File;
  profileheader: any;
  uploadform: FormGroup;
  profiledp: string;
  profilecover: string;
  slug: string;
  avatarConfig: CropConfig;
  bannerConfig: CropConfig;
  @Input() profile: any;
  @Input() updatedSlug: string;
  @ViewChild('crop', { static: false }) crop: CropComponent;
  @ViewChild('avatar', { static: false }) avatar: ElementRef<HTMLElement>;
  @ViewChild('banner', { static: false }) banner: ElementRef<HTMLElement>;
  public href: string;
  route: string;
  show: boolean;

  constructor(
    library: FaIconLibrary,
    public share: ShareService,
    public fa: FontAwesomeModule,
    private profileservice: ProfileServices,
    private authenticationService: AuthenticationService
  ) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }

  ngOnInit() {
    this.href = environment.storefrontBase + this.profile.slug;
    this.uploadform = new FormGroup({
      avatar: new FormControl(null),
      banner: new FormControl(null),
    });
    this.avatarConfig = {
      width: 180,
      aspectRatio: 1 / 1,
      round: true,
      type: 'avatar'
    };
    this.bannerConfig = {
      width: 1200,
      aspectRatio: 3 / 1,
      round: false,
      type: 'banner'
    };
    if (this.profile) {
      this.profileheader = this.profile;
      this.profiledp = this.profileheader.avatar;
      this.profilecover = this.profile.banner;
      if (this.profile.slug) {
        this.slug = this.profile.slug;
      }
    }
  }

  ngOnChanges() {
    this.href = environment.storefrontBase + this.updatedSlug;
  }

  get f() {
    return this.uploadform.controls;
  }

  addAvatar($event) {
    this.crop.addImage($event, this.avatarConfig);
  }

  addBanner($event) {
    this.crop.addImage($event, this.bannerConfig);
  }

  saveImage(image) {
    if (image.type === 'avatar') {
      this.uploadAvatar(image.file);
    } else {
      this.uploadBanner(image.file);
    }
  }

  uploadAvatar(image) {
    const formData = new FormData();
    formData.append('avatar', image);
    const userId = this.authenticationService.getUserId();
    this.profileservice.upload(userId, formData).subscribe(
      res => {
        if (res.success === true) {
          this.profiledp = res.data.url;
        }
      }
    );
  }

  uploadBanner(image) {
    const formData = new FormData();
    formData.append('banner', image);
    const userId = this.authenticationService.getUserId();
    this.profileservice.uploadcover(userId, formData).subscribe(
      res => {
        if (res.success === true) {
          this.profilecover = res.data.url;
        }
      }
    );
  }

  browseAvatar() {
    this.f.avatar.reset('');
    this.avatar.nativeElement.click();
  }

  browseBanner() {
    this.f.banner.reset('');
    this.banner.nativeElement.click();
  }

  toggle() {
    this.show = !this.show;
    setTimeout(() => {
      this.show = !this.show;
    }, 2000);
  }
}
