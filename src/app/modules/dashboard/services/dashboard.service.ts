import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable()
export class DashboardService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBase;
  }

  getSnapshot(userId: string): Observable<any> {
    const url = this.baseUrl + 'dashboard/snapshot/' + userId;
    return this.http.get(url);
  }

  getBookingDetails(bookingId: number): Observable<any> {
    const url = this.baseUrl + 'dashboard/bookingDetails/' + bookingId;
    return this.http.get(url);
  }
}
