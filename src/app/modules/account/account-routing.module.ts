import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { OtpComponent } from './components/otp/otp.component';
import { EmailComponent } from './components/email/email.component';
import { NotLoggedInGuard } from '../../common/modules/authentication/guards/not-logged-in.guard';
import { LoggedInGuard } from '../../common/modules/authentication/guards/logged-in.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ NotLoggedInGuard ] },
  { path: 'signup', component: EmailComponent, canActivate: [ NotLoggedInGuard ]  },
  { path: 'signup/email', component: EmailComponent, canActivate: [ NotLoggedInGuard ]  },
  { path: 'otp', component: OtpComponent, canActivate: [ NotLoggedInGuard ]  },
  { path: 'logout', component: LogoutComponent, canActivate: [ LoggedInGuard ]  },
  { path: 'password/recover/:token', component: ResetpasswordComponent, canActivate: [ NotLoggedInGuard ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
