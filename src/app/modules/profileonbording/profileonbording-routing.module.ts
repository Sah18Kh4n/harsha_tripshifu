import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileonbordingcontainerComponent} from './components/profileonbordingcontainer/profileonbordingcontainer.component';
import { OnboardedGuard } from '../../common/guards/onboarded.guard';


const routes: Routes = [
  { path: '', component: ProfileonbordingcontainerComponent, canActivate: [ OnboardedGuard ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileonbordingRoutingModule { }
