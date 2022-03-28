import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService } from './services/account.service';
import { LogoutComponent } from './components/logout/logout.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { HttpClientModule } from '@angular/common/http';
import { ShareModule } from '@ngx-share/core';
import { SharedModule } from '../../common/shared/shared.module';
import { OtpComponent } from './components/otp/otp.component';
import { EmailComponent } from './components/email/email.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentComponent } from './components/content/content.component';



@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    OtpComponent,
    EmailComponent,
    ContentComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ShareModule,
    SharedModule
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }
