import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  userId: string;
  sidebarSpacing: any;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.sidebarSpacing = 'contracted';
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
