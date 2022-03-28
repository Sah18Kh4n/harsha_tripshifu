import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'projects/dashboard/src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {

  private slug: BehaviorSubject<string>;
  private name: BehaviorSubject<string>;
  private avatar: BehaviorSubject<string>;
  private isPasswordSet: BehaviorSubject<number>;

  constructor(
    private http: HttpClient
  ) {
    this.slug = new BehaviorSubject(null);
    this.name = new BehaviorSubject(null);
    this.avatar = new BehaviorSubject(null);
    this.isPasswordSet = new BehaviorSubject(null);
  }

  setName(name: string) {
    this.name.next(name);
  }

  getName(): Observable<string> {
    return this.name.asObservable();
  }

  setSlug(slug: string) {
    this.slug.next(slug);
  }

  getSlug(): Observable<string> {
    return this.slug.asObservable();
  }
  
  setPasswordCheck(isPasswordSet: number) {
    this.isPasswordSet.next(isPasswordSet);
  }

  getPasswordCheck(): Observable<number> {
    return this.isPasswordSet.asObservable();
  }

  setAvatar(avatar: string) {
    this.avatar.next(avatar);
  }

  getAvatar(): Observable<string> {
    return this.avatar.asObservable();
  }

  saveProgress(userId, data): Observable<any> {
    const url = environment.apiBase + 'influencer/progress/' + userId;
    return this.http.post(url, data);
  }
}
