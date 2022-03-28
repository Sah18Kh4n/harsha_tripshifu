import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ProfileServices } from '../../../profile/services/profile.services';
import { FormGroup, FormControl } from '@angular/forms';
import { CropComponent } from 'projects/dashboard/src/app/common/modules/image-cropper/components/crop/crop.component';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-profileonbordingimageupload',
  templateUrl: './profileonbordingimageupload.component.html',
  styleUrls: ['./profileonbordingimageupload.component.css']
})
export class ProfileonbordingimageuploadComponent implements OnInit {

  image: string;
  profiledp: any;
  profilecover: any;
  imageForm: FormGroup;
  avatarConfig: CropConfig;
  bannerConfig: CropConfig;
  @Input() profile: any;
  @ViewChild('crop', { static: false }) crop: CropComponent;
  @ViewChild('avatar', { static: false }) avatar: ElementRef<HTMLElement>;
  @ViewChild('banner', { static: false }) banner: ElementRef<HTMLElement>;

  constructor(
    private profileservice: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.imageForm = new FormGroup({
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
    if (this.profile && this.profile.avatar !== null) {
      this.profiledp = this.profile.avatar;
    }
    if (this.profile && this.profile.banner !== null) {
      this.profilecover = this.profile.banner;
    }
  }

  get f() {
    return this.imageForm.controls;
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

}
