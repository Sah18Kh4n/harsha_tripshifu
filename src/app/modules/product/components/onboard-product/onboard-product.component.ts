import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboard-product',
  templateUrl: './onboard-product.component.html',
  styleUrls: ['./onboard-product.component.css']
})
export class OnboardProductComponent implements OnInit {

  sidebarSpacing: string;

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
