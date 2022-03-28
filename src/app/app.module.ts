import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './common/shared/shared.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToasterModule } from './common/modules/toaster/toaster.module';
import { OnboardGuard } from './common/guards/onboard.guard';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { CommonService } from './common/services/common.service';
import { LoaderModule } from './common/modules/loader/loader.module';
import { OnboardedGuard } from './common/guards/onboarded.guard';
import { AuthenticationModule } from './common/modules/authentication/authentication.module';
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleAppId)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebookAppId)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    ToasterModule,
    SocialLoginModule,
    LoaderModule,
    AuthenticationModule
  ],
  providers: [
    OnboardGuard,
    OnboardedGuard,
    CommonService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
