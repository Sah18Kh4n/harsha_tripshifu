import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-onboard-listing',
  templateUrl: './onboard-listing.component.html',
  styleUrls: ['./onboard-listing.component.css']
})
export class OnboardListingComponent implements OnInit {

  showLoader: boolean;
  sidebarSpacing: any;
  userId: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    if (this.userId == null) {
      this.router.navigateByUrl('/account/login');
    }
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }

}
