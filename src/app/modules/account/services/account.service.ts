import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpclient: HttpClient) { }

  login(user): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/login', user);
  }

  signup(user): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/signup', user);
  }

  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
    return this.httpclient.get(environment.apiBase + 'user/logout', { headers });
  }

  updatePhone(data): Observable<any> {
    return this.httpclient.put(environment.apiBase + 'user/profile/phone', data);
  }

  sendOtp(data): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/otp/send', data);
  }

  reSendOtp(data): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/otp/resend', data);
  }

  verifyOtp(data): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/otp/verify', data);
  }

  forgetPassword(user): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/account/password/forgot', user);
  }

  resetPassword(user): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'user/account/password/recover', user);
  }
}
