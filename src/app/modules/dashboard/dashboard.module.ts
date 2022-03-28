import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../common/shared/shared.module';
import { DashboardService } from './services/dashboard.service';
import { BookingdetailsPopupComponent } from './components/bookingdetails-popup/bookingdetails-popup.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    DashboardComponent,
    BookingdetailsPopupComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    DialogModule
  ],
  exports: [
    BookingdetailsPopupComponent,
    DialogModule
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
