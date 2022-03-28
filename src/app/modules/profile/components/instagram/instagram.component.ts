import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'projects/dashboard/src/environments/environment';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {
  
  storeBase: string;
  @Input() profile: any;

  constructor() {
    this.storeBase = environment.storefrontBase;
  }

  ngOnInit() {}

  onInstagramClick() {
    const redirectUrl = environment.baseUrl + 'profile';
    const url = environment.instaApiBaseUrl
      + 'oauth/authorize?app_id=' + environment.instaAppId
      + '&redirect_uri=' + encodeURI(redirectUrl)
      + '&scope=user_profile,user_media'
      + '&response_type=code';
    window.location.replace(url);
  }
}
