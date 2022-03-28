import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from './common/modules/authentication/guards/logged-in.guard';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: 'login',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },
  /*{
    path: '',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },*/
  {
    path: 'account',
    loadChildren: './modules/account/account.module#AccountModule'
  },
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'profile',
    loadChildren: './modules/profile/profile.module#ProfileModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'payouts',
    loadChildren: './modules/payouts/payouts.module#PayoutsModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'settings',
    loadChildren: './modules/setting/setting.module#SettingModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'feedback',
    loadChildren: './modules/feedback/feedback.module#FeedbackModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'profileonboarding',
    loadChildren: './modules/profileonbording/profileonbording.module#ProfileonbordingModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'product',
    loadChildren: './modules/product/product.module#ProductModule',
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: '**',
    redirectTo: '/account/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
