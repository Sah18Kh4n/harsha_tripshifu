import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShifupayoutsserviceService {

  constructor(
    private httpclient: HttpClient
  ) { }

  public getShifuPayoutsDetails(influencerId, $offset, $limit): Observable<any> {
    return this.httpclient.get(environment.apiBase + 'influencer/getShifuPayouts/'+$offset+'/'+$limit+'/' + influencerId);
  }

}
