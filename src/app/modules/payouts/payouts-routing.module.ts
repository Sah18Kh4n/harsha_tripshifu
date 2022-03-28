import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShifupayoutsComponent } from './components/shifupayouts/shifupayouts.component';

const routes: Routes = [
  { path: '', component: ShifupayoutsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayoutsRoutingModule { }
