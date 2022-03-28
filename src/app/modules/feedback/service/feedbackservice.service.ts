import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackserviceService {

  constructor(
    private httpclient: HttpClient
  ) { }
  
  public getCategories(): Observable<any> {
    const url = environment.apiBase + 'feedback/categories';
    return this.httpclient.get(url);
  }

  public submitfeedback(userId, data: any): Observable<any> {
    return this.httpclient.post(environment.apiBase + 'feedback/' + userId, data);
  }
}
