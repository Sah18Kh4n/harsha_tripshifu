import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../../dashboard/src/environments/environment';

@Injectable()
export class ProfileServices {

  baseUrl = environment.apiBase + 'influencer/';

  constructor(private httpclient: HttpClient) { }

  editbasicdata(userId, user: FormGroup): Observable<any> {
    return this.httpclient.put(`${this.baseUrl}` + 'profile/' + userId, user);
  }

  upload(userId, formdata): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'profile/avatar/' + userId, formdata);
  }

  uploadcover(userId, formdata): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'profile/banner/' + userId, formdata);
  }

  getprofile(userId): Observable<any> {
    return this.httpclient.get(this.baseUrl + 'profile/' + userId);
  }

  editslug(userId, slug): Observable<any> {
    return this.httpclient.put(`${this.baseUrl}` + 'slug/' + userId, slug);
  }

  locationtravelled(userId, formdata): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'location/' + userId, formdata);
  }

  deleteLocation(userId, data): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'location/delete/' + userId, data);
  }

  instagramauthnticatecode(userId, authCode): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'instagram/authenticate/' + userId, authCode);
  }

  saveSocialLink(userId, url): Observable<any> {
    return this.httpclient.put(`${this.baseUrl}` + 'social/' + userId, url);
  }

  getUserInterests(userId): Observable<any> {
    return this.httpclient.get(`${this.baseUrl}` + 'interests/' + userId);
  }

  searchInterest(interest): Observable<any> {
    return this.httpclient.get(`${this.baseUrl}` + 'interest/search/' + interest);
  }

  addInterest(userId, interest): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'interest/' + userId, interest);
  }

  deleteInterest(userId, data): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'interest/delete/' + userId, data);
  }

  instagramAccessTokenRequest(userId, data): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'influencer/instagram/authenticate/' + userId, data);
  }

  resendVerificationEmail(userId, email?): Observable<any> {
    const data = {
      source: 'influencer'
    };
    return this.httpclient.post(environment.apiBase + 'user/emailverification/send/' + userId, data);
  }

  editbankdata(userId, bankData: FormGroup): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}` + 'profile/bankdetails/' + userId, bankData);
  }
}
