import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { AuthenticationService } from './services/authentication.service';
import { AuthComponent } from './components/auth/auth.component';
import { ConsentComponent } from './components/consent/consent.component';
import { ConsentService } from './services/consent.service';
import { CookieService } from 'ngx-cookie-service';



@NgModule({
  declarations: [
    AuthComponent,
    ConsentComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    LoggedInGuard,
    NotLoggedInGuard,
    ConsentService,
    CookieService,
    AuthenticationService
  ],
  exports: [
    AuthComponent,
    ConsentComponent
  ]
})
export class AuthenticationModule { }
