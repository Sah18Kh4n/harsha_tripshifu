import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingserviceService {

  constructor(
    private httpclient: HttpClient
  ) { }

  public changepassword(userId, data): Observable<any> {
    return this.httpclient.put(environment.apiBase + 'user/account/password/change/' + userId, data);
  }
}
