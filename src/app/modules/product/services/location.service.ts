import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable()
export class LocationService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBase;
  }

  search(queryString: string): Observable<any> {
    let url;
    if (queryString === null) {
      url = this.baseUrl + 'influencer/location/search';
    } else {
      url = this.baseUrl + 'influencer/location/search/' + queryString;
    }
    return this.http.get(url);
  }

  saveLocation(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/location/' + userId;
    return this.http.post(url, data);
  }

  updateLocation(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/location/update/' + userId;
    return this.http.post(url, data);
  }

  getLocations(userId): Observable<any> {
    const url = this.baseUrl + 'influencer/product/locations/' + userId;
    return this.http.get(url);
  }

  deleteLocation(userId, data): Observable<any> {
    const url = this.baseUrl + 'influencer/product/location/delete/' + userId;
    return this.http.post(url, data);
  }

  getLocationData(locationId): Observable<any> {
    const url = this.baseUrl + 'influencer/product/location/' + locationId;
    return this.http.get(url);
  }
}
