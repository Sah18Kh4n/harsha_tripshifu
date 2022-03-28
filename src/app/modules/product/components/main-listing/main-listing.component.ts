import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';

@Component({
  selector: 'app-main-listing',
  templateUrl: './main-listing.component.html',
  styleUrls: ['./main-listing.component.css']
})
export class MainListingComponent implements OnInit {

  issidebar: boolean;
  sidebarSpacing: string;
  showLoader: boolean;
  subscription: Subscription;

  constructor() { }

  ngOnInit() {
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }
}
