import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  isReady: boolean;
  issidebar: boolean;
  sidebarSpacing: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.sidebarSpacing = 'contracted';
    const userId = this.authenticationService.getUserId();
    if (userId == null) {
      this.router.navigateByUrl('/account/login');
    } else {
      this.isReady = true;
    }
  }

  updatedsidebarOnSubmit(sidebar): void {
    this.issidebar = sidebar;
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }
}
