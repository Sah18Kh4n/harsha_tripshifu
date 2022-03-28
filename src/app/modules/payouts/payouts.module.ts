import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../common/shared/shared.module';
import { PayoutsRoutingModule } from './payouts-routing.module';
import { ShifupayoutsComponent } from './components/shifupayouts/shifupayouts.component';

@NgModule({
  declarations: [ShifupayoutsComponent],
  imports: [
    CommonModule,
    PayoutsRoutingModule,
    SharedModule
  ]
})
export class PayoutsModule { }
