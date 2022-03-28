import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { OnboardGuard } from '../../common/guards/onboard.guard';

const routes: Routes = [
  { path: '', component: ProfileComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
