import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data: any;
  sidebarSpacing: any;
  loading: boolean;
  showLoader: boolean;
  bookings: any;
  popup: boolean;
  bookingDetails: any;

  constructor(
    private router: Router,
    public ls: LoaderService,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.showLoader = true;
    this.sidebarSpacing = 'contracted';
    const userId = this.authenticationService.getUserId();
    this.setDashboard(userId);
    this.popup = false;
  }

  setDashboard(userId) {
    this.ls.show();
    this.dashboardService.getSnapshot(userId)
      .subscribe(
        result => {
          this.showLoader = false;
          if (result.success === true) {
            this.data = result.data;
            this.bookings = result.data.bookings;
          } else {
            this.router.navigateByUrl('/account/logout');
          }
          this.ls.hide();
        },
        error => {
          this.router.navigateByUrl('/account/login');
        },
        () => {
          this.ls.hide();
        }
      );
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }

  openPopUp(bookingId) {
    this.bookingDetails = '';
    this.dashboardService.getBookingDetails(bookingId)
      .subscribe(
        result => {
          this.showLoader = false;
          if (result.success === true) {
            this.bookingDetails = result.data;
            this.popup = true;
          }
          this.ls.hide();
        },
        error => {
          this.router.navigateByUrl('/account/login');
        },
        () => {
          this.ls.hide();
        }
    );
  }

  onClosePopUp() {
    this.popup = false;
  }
}
