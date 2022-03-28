import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  slug: string;
  userId: string;
  issidebar: boolean;
  loader: boolean;
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

  onSlugChange(slug: string) {
    this.slug = slug;
  }
}
