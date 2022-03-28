import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'projects/dashboard/src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../../loader/services/loader.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userIdentifier = 'USID';
  private tokenIdentifier = 'UTKN';
  private secure = environment.secureCookie;
  private expiryDays = environment.sessionExpiryDays;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private loaderService: LoaderService
  ) { }

  getToken(): string {
    return this.cookie.get(this.tokenIdentifier);
  }

  getUserId(): string {
    return this.cookie.get(this.userIdentifier);
  }

  login(params: LoginParams): void {
    this.saveUserRef(params.userId);
    this.saveToken(params.token);
  }

  saveUserRef(userId: string): void {
    environment.siblings.map(domain => {
      this.cookie.set(this.userIdentifier, userId, this.expiryDays, '/', domain, this.secure, 'Lax');
    });
  }

  saveToken(token: string): void {
    environment.siblings.map(domain => {
      this.cookie.set(this.tokenIdentifier, token, this.expiryDays, '/', domain, this.secure, 'Lax');
    });
  }

  getCurrentUser(): void {
    const token = this.cookie.get(this.tokenIdentifier);
    if (token) {
      this.loaderService.show();
      this.getUser(token).subscribe(
        result => {
          if (result.success === true) {
            this.saveUserRef(result.data.profile.user_id);
          } else {
            this.logout();
          }
          this.loaderService.hide();
        },
        error => { },
        () => {
          this.loaderService.hide();
        }
      );
    }
  }

  getUser(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
    return this.http.get(environment.apiBase + 'user', { headers });
  }

  logout(): void {
    environment.siblings.map(domain => {
      this.cookie.delete(this.tokenIdentifier, '/', domain);
      this.cookie.delete(this.userIdentifier, '/', domain);
    });
  }
}
